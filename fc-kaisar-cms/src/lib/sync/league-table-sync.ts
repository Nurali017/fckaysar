/**
 * League Table Synchronization Service
 * Syncs standings from SOTA API to Payload CMS
 */

import { getPayload, Payload } from 'payload'
import config from '@payload-config'
import { sotaClient, TeamStanding } from '../sota-client'

export interface SyncResult {
  success: boolean
  message: string
  teamsUpdated: number
  teamsCreated: number
  timestamp: string
  duration: number
  errors?: string[]
}

export interface SyncOptions {
  seasonId?: number
  forceUpdate?: boolean
  language?: string
}

const DEFAULT_SEASON_ID = parseInt(process.env.SOTA_CURRENT_SEASON_ID || '61', 10)
const FC_KAISAR_TEAM_ID = 94

/**
 * Sync league table from SOTA API to CMS
 */
export async function syncLeagueTable(options: SyncOptions = {}): Promise<SyncResult> {
  const startTime = Date.now()
  const { seasonId = DEFAULT_SEASON_ID, language = 'ru' } = options

  const errors: string[] = []
  let teamsUpdated = 0
  let teamsCreated = 0

  console.log(`[SYNC] Starting league table sync for season ${seasonId}...`)

  try {
    // Get Payload instance
    const payload = await getPayload({ config })

    // Fetch standings from SOTA API
    const standings = await sotaClient.getScoreTable(seasonId, language)

    if (!standings.length) {
      return {
        success: false,
        message: 'No standings data received from SOTA API',
        teamsUpdated: 0,
        teamsCreated: 0,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
      }
    }

    console.log(`[SYNC] Processing ${standings.length} teams...`)

    // Process each team
    for (const standing of standings) {
      try {
        const result = await upsertTeamStanding(payload, standing, seasonId)
        if (result === 'created') {
          teamsCreated++
        } else if (result === 'updated') {
          teamsUpdated++
        }
      } catch (error) {
        const errMsg = `Failed to sync team ${standing.teamName} (${standing.teamId}): ${error}`
        console.error(`[SYNC] ${errMsg}`)
        errors.push(errMsg)
      }
    }

    // Remove teams no longer in standings (relegated/removed)
    await cleanupOldTeams(payload, standings, seasonId)

    const duration = Date.now() - startTime

    console.log(
      `[SYNC] Sync completed in ${duration}ms. Created: ${teamsCreated}, Updated: ${teamsUpdated}`
    )

    return {
      success: errors.length === 0,
      message:
        errors.length === 0
          ? `Successfully synced ${standings.length} teams`
          : `Synced with ${errors.length} errors`,
      teamsUpdated,
      teamsCreated,
      timestamp: new Date().toISOString(),
      duration,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (error) {
    console.error('[SYNC] Sync failed:', error)
    return {
      success: false,
      message: `Sync failed: ${error}`,
      teamsUpdated,
      teamsCreated,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      errors: [String(error)],
    }
  }
}

/**
 * Upsert (create or update) team standing
 */
async function upsertTeamStanding(
  payload: Payload,
  standing: TeamStanding,
  seasonId: number
): Promise<'created' | 'updated' | 'unchanged'> {
  // Check if team exists
  const existing = await payload.find({
    collection: 'league-table',
    where: {
      and: [{ teamId: { equals: standing.teamId } }, { seasonId: { equals: seasonId } }],
    },
    limit: 1,
  })

  const teamData = {
    teamId: standing.teamId,
    teamName: standing.teamName,
    teamLogo: standing.teamLogo,
    position: standing.position,
    played: standing.played,
    won: standing.won,
    drawn: standing.drawn,
    lost: standing.lost,
    goalsFor: standing.goalsFor,
    goalsAgainst: standing.goalsAgainst,
    goalDifference: standing.goalDifference,
    points: standing.points,
    seasonId,
    lastSyncAt: new Date().toISOString(),
    isKaisar: standing.teamId === FC_KAISAR_TEAM_ID,
  }

  if (existing.docs.length > 0) {
    const doc = existing.docs[0]

    // Check if data changed (skip unnecessary updates)
    if (!hasChanges(doc, teamData)) {
      return 'unchanged'
    }

    await payload.update({
      collection: 'league-table',
      id: doc.id,
      data: teamData,
    })

    console.log(`[SYNC] Updated: ${standing.teamName} (position: ${standing.position})`)
    return 'updated'
  } else {
    await payload.create({
      collection: 'league-table',
      data: teamData,
    })

    console.log(`[SYNC] Created: ${standing.teamName} (position: ${standing.position})`)
    return 'created'
  }
}

/**
 * Check if standing data has changed
 */
function hasChanges(existing: Record<string, unknown>, newData: Record<string, unknown>): boolean {
  const fields = [
    'position',
    'played',
    'won',
    'drawn',
    'lost',
    'goalsFor',
    'goalsAgainst',
    'points',
  ]
  return fields.some((field) => existing[field] !== newData[field])
}

/**
 * Remove teams that are no longer in the current standings
 */
async function cleanupOldTeams(
  payload: Payload,
  currentStandings: TeamStanding[],
  seasonId: number
): Promise<void> {
  const currentTeamIds = currentStandings.map((s) => s.teamId)

  const oldTeams = await payload.find({
    collection: 'league-table',
    where: {
      and: [{ seasonId: { equals: seasonId } }, { teamId: { not_in: currentTeamIds } }],
    },
  })

  for (const team of oldTeams.docs) {
    console.log(`[SYNC] Removing old team: ${team.teamName}`)
    await payload.delete({
      collection: 'league-table',
      id: team.id,
    })
  }
}

/**
 * Get sync status
 */
export async function getSyncStatus(): Promise<{
  lastSync: string | null
  totalTeams: number
  seasonId: number
}> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'league-table',
    sort: '-lastSyncAt',
    limit: 1,
  })

  const count = await payload.count({
    collection: 'league-table',
  })

  return {
    lastSync: (result.docs[0]?.lastSyncAt as string) || null,
    totalTeams: count.totalDocs,
    seasonId: DEFAULT_SEASON_ID,
  }
}
