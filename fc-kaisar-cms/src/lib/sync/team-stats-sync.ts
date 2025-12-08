/**
 * Team Stats Synchronization Service
 * Syncs team statistics from SOTA API to Payload CMS
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { sotaClient, ParsedTeamStats } from '../sota-client'

export interface SyncResult {
  success: boolean
  message: string
  action: 'created' | 'updated' | 'unchanged' | 'error'
  timestamp: string
  duration: number
  stats?: ParsedTeamStats
}

export interface SyncOptions {
  teamId?: number
  seasonId?: number
}

const DEFAULT_TEAM_ID = parseInt(process.env.FC_KAISAR_TEAM_ID || '94', 10)
const DEFAULT_SEASON_ID = parseInt(process.env.SOTA_CURRENT_SEASON_ID || '61', 10)

/**
 * Sync team stats from SOTA API to CMS
 */
export async function syncTeamStats(options: SyncOptions = {}): Promise<SyncResult> {
  const startTime = Date.now()
  const { teamId = DEFAULT_TEAM_ID, seasonId = DEFAULT_SEASON_ID } = options

  console.log(`[SYNC] Starting team stats sync for team ${teamId}, season ${seasonId}...`)

  try {
    // Get Payload instance
    const payload = await getPayload({ config })

    // Fetch stats from SOTA API
    const stats = await sotaClient.getTeamStats(teamId, seasonId)

    // Check if record exists
    const existing = await payload.find({
      collection: 'team-stats',
      where: {
        and: [{ teamId: { equals: teamId } }, { seasonId: { equals: seasonId } }],
      },
      limit: 1,
    })

    const statsData = {
      teamId: stats.teamId,
      seasonId: stats.seasonId,
      gamesPlayed: stats.gamesPlayed,
      gamesTotal: stats.gamesTotal,
      wins: stats.wins,
      draws: stats.draws,
      losses: stats.losses,
      points: stats.points,
      goals: stats.goals,
      goalsConceded: stats.goalsConceded,
      goalsDifference: stats.goalsDifference,
      attackStats: {
        shots: stats.shots,
        shotsOnGoal: stats.shotsOnGoal,
        xg: stats.xg,
        assists: stats.assists,
        corners: stats.corners,
        crosses: stats.crosses,
        penalties: stats.penalties,
        keyPasses: stats.keyPasses,
      },
      possessionStats: {
        possession: stats.possession,
        passes: stats.passes,
        passAccuracy: stats.passAccuracy,
      },
      defenseStats: {
        duels: stats.duels,
        tackles: stats.tackles,
        interceptions: stats.interceptions,
        offsides: stats.offsides,
      },
      disciplineStats: {
        fouls: stats.fouls,
        yellowCards: stats.yellowCards,
        secondYellowCards: stats.secondYellowCards,
        redCards: stats.redCards,
      },
      attendanceStats: {
        averageVisitors: stats.averageVisitors,
        totalVisitors: stats.totalVisitors,
      },
      lastSyncAt: new Date().toISOString(),
    }

    let action: 'created' | 'updated' | 'unchanged'

    if (existing.docs.length > 0) {
      const doc = existing.docs[0]

      // Check if data changed
      if (!hasChanges(doc, stats)) {
        console.log('[SYNC] No changes detected, skipping update')
        return {
          success: true,
          message: 'No changes detected',
          action: 'unchanged',
          timestamp: new Date().toISOString(),
          duration: Date.now() - startTime,
          stats,
        }
      }

      await payload.update({
        collection: 'team-stats',
        id: doc.id,
        data: statsData,
      })

      action = 'updated'
      console.log('[SYNC] Updated team stats')
    } else {
      await payload.create({
        collection: 'team-stats',
        data: statsData,
      })

      action = 'created'
      console.log('[SYNC] Created team stats')
    }

    const duration = Date.now() - startTime
    console.log(`[SYNC] Sync completed in ${duration}ms`)

    return {
      success: true,
      message: `Team stats ${action} successfully`,
      action,
      timestamp: new Date().toISOString(),
      duration,
      stats,
    }
  } catch (error) {
    console.error('[SYNC] Sync failed:', error)
    return {
      success: false,
      message: `Sync failed: ${error}`,
      action: 'error',
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
    }
  }
}

/**
 * Check if stats have changed
 */
function hasChanges(existing: Record<string, unknown>, newStats: ParsedTeamStats): boolean {
  const fields = ['gamesPlayed', 'wins', 'draws', 'losses', 'points', 'goals', 'goalsConceded']

  for (const field of fields) {
    if (existing[field] !== newStats[field as keyof ParsedTeamStats]) {
      return true
    }
  }

  return false
}

/**
 * Get team stats sync status
 */
export async function getTeamStatsSyncStatus(): Promise<{
  lastSync: string | null
  teamId: number
  seasonId: number
}> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'team-stats',
    where: {
      teamId: { equals: DEFAULT_TEAM_ID },
    },
    sort: '-lastSyncAt',
    limit: 1,
  })

  return {
    lastSync: (result.docs[0]?.lastSyncAt as string) || null,
    teamId: DEFAULT_TEAM_ID,
    seasonId: DEFAULT_SEASON_ID,
  }
}
