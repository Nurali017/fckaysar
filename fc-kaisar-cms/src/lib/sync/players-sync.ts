/**
 * Players Synchronization Service
 * Syncs player data from SOTA API (via matches) to Payload CMS
 *
 * Since SOTA API doesn't have a direct players endpoint,
 * we collect player data from match lineups and aggregate statistics.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { sotaClient, LineupPlayer, MatchPlayer, PlayerSeasonStats, PlayerListItem, PlayerSeasonStatsV2 } from '../sota-client'

// Position mapping from SOTA API type to CMS position enum
const POSITION_MAP: Record<string, 'goalkeeper' | 'defender' | 'midfielder' | 'forward'> = {
  goalkeeper: 'goalkeeper',
  defence: 'defender',
  midfield: 'midfielder',
  offence: 'forward',
}

export interface PlayerSyncResult {
  success: boolean
  message: string
  playersProcessed: number
  created: number
  updated: number
  unchanged: number
  errors: number
  timestamp: string
  duration: number
}

export interface SinglePlayerSyncResult {
  action: 'created' | 'updated' | 'unchanged' | 'error'
  sotaId: string
  name: string
  error?: string
}

export interface SyncOptions {
  teamId?: number
  seasonId?: number
}

interface CollectedPlayer {
  sotaId: string
  firstName: string
  lastName: string
  number: number
  isGk: boolean
  isCaptain: boolean
  teamId: number
  // Position from /players/ endpoint
  position?: 'goalkeeper' | 'defender' | 'midfielder' | 'forward'
  // Aggregated stats
  appearances: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  shots: number
  shotsOnGoal: number
  passes: number
  duels: number
  tackles: number
  // From /players/{id}/season_stats/
  minutesPlayed: number
  avgMinutesPlayed: number
  cleanSheets: number
}

const DEFAULT_TEAM_ID = parseInt(process.env.FC_KAISAR_TEAM_ID || '94', 10)
const DEFAULT_SEASON_ID = parseInt(process.env.SOTA_CURRENT_SEASON_ID || '61', 10)

/**
 * Generate slug from name
 */
function generateSlug(firstName: string, lastName: string): string {
  const slug = `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return slug || 'player'
}

/**
 * Transliterate Cyrillic to Latin
 */
function transliterate(text: string): string {
  const map: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
    ә: 'a',
    і: 'i',
    ғ: 'g',
    қ: 'q',
    ң: 'n',
    ө: 'o',
    ұ: 'u',
    ү: 'u',
    һ: 'h',
  }

  return text
    .toLowerCase()
    .split('')
    .map((char) => map[char] || char)
    .join('')
}

/**
 * Normalize Kazakh characters to Russian equivalents for matching
 * Example: Нұрдәулет Ағзамбаев -> Нурдаулет Агзамбаев
 */
function normalizeKazakhToRussian(text: string): string {
  const map: Record<string, string> = {
    ә: 'а',
    Ә: 'А',
    і: 'и',
    І: 'И',
    ғ: 'г',
    Ғ: 'Г',
    қ: 'к',
    Қ: 'К',
    ң: 'н',
    Ң: 'Н',
    ө: 'о',
    Ө: 'О',
    ұ: 'у',
    Ұ: 'У',
    ү: 'у',
    Ү: 'У',
    һ: 'х',
    Һ: 'Х',
  }

  return text
    .split('')
    .map((char) => map[char] || char)
    .join('')
}

/**
 * Collect players from all matches
 */
async function collectPlayersFromMatches(
  teamId: number,
  seasonId: number
): Promise<Map<string, CollectedPlayer>> {
  const players = new Map<string, CollectedPlayer>()

  console.log(`[SYNC] Collecting players from matches for team ${teamId}, season ${seasonId}...`)

  // Get all matches
  const matches = await sotaClient.getTeamMatches(teamId, seasonId)
  const matchesWithStats = matches.filter((m) => m.has_stats)

  console.log(`[SYNC] Found ${matchesWithStats.length} matches with stats`)

  // Process each match
  for (const match of matchesWithStats) {
    try {
      // Determine if our team is home or away
      const isHome = match.home_team.id === teamId
      if (!isHome && match.away_team.id !== teamId) {
        // Skip matches where Kaisar didn't play
        continue
      }

      // Get lineup
      const lineup = await sotaClient.getMatchLineup(match.id)
      if (lineup) {
        // Only get OUR team's lineup (Kaisar)
        const ourLineup = isHome ? lineup.home_team?.lineup : lineup.away_team?.lineup
        const ourTeamShortName = isHome
          ? lineup.home_team?.short_name
          : lineup.away_team?.short_name

        if (ourLineup) {
          for (const player of ourLineup) {
            const existing = players.get(player.id)
            if (existing) {
              // Update appearance count
              existing.appearances++
              // Update number if changed
              if (player.number) existing.number = player.number
              // Update captain status
              if (player.is_captain) existing.isCaptain = true
            } else {
              // Add new player
              players.set(player.id, {
                sotaId: player.id,
                firstName: player.full_name,
                lastName: player.last_name,
                number: player.number,
                isGk: player.is_gk,
                isCaptain: player.is_captain,
                teamId,
                position: player.is_gk ? 'goalkeeper' : undefined,
                appearances: 1,
                goals: 0,
                assists: 0,
                yellowCards: 0,
                redCards: 0,
                shots: 0,
                shotsOnGoal: 0,
                passes: 0,
                duels: 0,
                tackles: 0,
                minutesPlayed: 0,
                avgMinutesPlayed: 0,
                cleanSheets: 0,
              })
            }
          }
        }

        // Get player stats - filter ONLY our team
        const playerStats = await sotaClient.getMatchPlayerStats(match.id)
        if (playerStats) {
          // Only process players that we already have in our map (from lineup)
          for (const pStats of playerStats) {
            const existing = players.get(pStats.id)
            if (existing && pStats.stats) {
              // Aggregate stats
              existing.yellowCards += pStats.stats.yellow_cards || 0
              existing.redCards += pStats.stats.red_cards || 0
              existing.shots += pStats.stats.shot || 0
              existing.shotsOnGoal += pStats.stats.shots_on_goal || 0
              existing.passes += pStats.stats.pass || 0
              existing.duels += pStats.stats.duel || 0
              existing.tackles += pStats.stats.tackle || 0
            }
          }
        }
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch (error) {
      console.warn(`[SYNC] Error processing match ${match.id}:`, error)
    }
  }

  console.log(`[SYNC] Collected ${players.size} unique players from matches`)

  // Fetch complete stats from V2 API for each player
  console.log(`[SYNC] Fetching V2 season stats for ${players.size} players...`)
  let statsUpdated = 0

  for (const player of players.values()) {
    try {
      const v2Stats = await sotaClient.getPlayerSeasonStatsV2(player.sotaId, seasonId)

      if (v2Stats && v2Stats.stats) {
        // Helper to get value by key
        const getValue = (key: string): number => {
          const stat = v2Stats.stats.find((s) => s.key === key)
          return stat?.value || 0
        }

        // Update all stats from V2 API (more accurate than match aggregation)
        player.goals = getValue('goal')
        player.assists = getValue('goal_pass')
        player.appearances = getValue('games_played') || player.appearances
        player.minutesPlayed = Math.round(getValue('time_on_field_total'))
        player.avgMinutesPlayed = player.appearances > 0
          ? Math.round(player.minutesPlayed / player.appearances)
          : 0
        player.shots = getValue('shot')
        player.shotsOnGoal = getValue('shots_on_goal')
        player.passes = getValue('pass')
        player.duels = getValue('duel')
        player.tackles = getValue('tackle')
        player.yellowCards = getValue('yellow_cards')
        player.redCards = getValue('red_cards')
        player.cleanSheets = getValue('dry_match') // "Сухой матч" for goalkeepers

        statsUpdated++

        if (player.goals > 0 || player.assists > 0) {
          console.log(
            `[SYNC] ${player.firstName} ${player.lastName}: ${player.goals} goals, ${player.assists} assists, ${player.minutesPlayed} min`
          )
        }
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 50))
    } catch (error) {
      // Continue with next player
    }
  }

  console.log(`[SYNC] Updated ${statsUpdated} players with V2 stats`)

  return players
}

/**
 * Sync a single player to CMS
 */
async function syncSinglePlayer(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  player: CollectedPlayer,
  seasonId: number
): Promise<SinglePlayerSyncResult> {
  const fullName = `${player.firstName} ${player.lastName}`.trim()

  try {
    // Check if player exists by sotaId
    const existing = await payload.find({
      collection: 'players',
      where: {
        sotaId: { equals: player.sotaId },
      },
      limit: 1,
    })

    const playerData = {
      sotaId: player.sotaId,
      teamId: player.teamId,
      firstName: player.firstName,
      lastName: player.lastName,
      slug: generateSlug(transliterate(player.firstName), transliterate(player.lastName)),
      jerseyNumber: player.number,
      displayName: fullName,
      isGoalkeeper: player.isGk,
      position: player.position || (player.isGk ? 'goalkeeper' : undefined),
      currentSeasonStats: {
        seasonId: seasonId,
        seasonName: '2025',
        appearances: player.appearances,
        goals: player.goals,
        assists: player.assists,
        yellowCards: player.yellowCards,
        redCards: player.redCards,
        shots: player.shots,
        shotsOnGoal: player.shotsOnGoal,
        passes: player.passes,
        duels: player.duels,
        tackles: player.tackles,
        minutesPlayed: player.minutesPlayed,
        avgMinutesPlayed: player.avgMinutesPlayed,
        cleanSheets: player.cleanSheets,
      },
      lastSyncAt: new Date().toISOString(),
    }

    if (existing.docs.length > 0) {
      const doc = existing.docs[0]

      // Check if stats changed
      const currentStats = doc.currentSeasonStats || {}
      const hasChanges =
        currentStats.appearances !== player.appearances ||
        currentStats.goals !== player.goals ||
        currentStats.assists !== player.assists ||
        currentStats.yellowCards !== player.yellowCards ||
        currentStats.redCards !== player.redCards ||
        currentStats.shots !== player.shots ||
        currentStats.passes !== player.passes ||
        currentStats.minutesPlayed !== player.minutesPlayed ||
        currentStats.avgMinutesPlayed !== player.avgMinutesPlayed ||
        currentStats.cleanSheets !== player.cleanSheets ||
        doc.jerseyNumber !== player.number ||
        (player.position && doc.position !== player.position)

      if (!hasChanges) {
        return { action: 'unchanged', sotaId: player.sotaId, name: fullName }
      }

      // Update - preserve manually entered data but update position if we have it from API
      const updateData: Record<string, unknown> = {
        // Only update auto-synced fields
        jerseyNumber: player.number,
        isGoalkeeper: player.isGk,
        currentSeasonStats: playerData.currentSeasonStats,
        lastSyncAt: playerData.lastSyncAt,
      }

      // Update position only if we got it from API and current is not set
      if (player.position && !doc.position) {
        updateData.position = player.position
      }

      await payload.update({
        collection: 'players',
        id: doc.id,
        data: updateData,
      })

      return { action: 'updated', sotaId: player.sotaId, name: fullName }
    } else {
      // Create new player
      // Check if slug exists and make unique
      let slug = playerData.slug
      let slugSuffix = 1
      while (true) {
        const slugExists = await payload.find({
          collection: 'players',
          where: { slug: { equals: slug } },
          limit: 1,
        })
        if (slugExists.docs.length === 0) break
        slug = `${playerData.slug}-${slugSuffix++}`
      }
      playerData.slug = slug

      await payload.create({
        collection: 'players',
        data: {
          ...playerData,
          status: 'active',
        },
      })

      return { action: 'created', sotaId: player.sotaId, name: fullName }
    }
  } catch (error) {
    console.error(`[SYNC] Error syncing player ${fullName}:`, error)
    return {
      action: 'error',
      sotaId: player.sotaId,
      name: fullName,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Sync all players from SOTA API to CMS
 */
export async function syncPlayers(options: SyncOptions = {}): Promise<PlayerSyncResult> {
  const startTime = Date.now()
  const { teamId = DEFAULT_TEAM_ID, seasonId = DEFAULT_SEASON_ID } = options

  console.log(`[SYNC] Starting players sync for team ${teamId}, season ${seasonId}...`)

  let created = 0
  let updated = 0
  let unchanged = 0
  let errors = 0

  try {
    const payload = await getPayload({ config })

    // Collect players from all matches
    const players = await collectPlayersFromMatches(teamId, seasonId)

    console.log(`[SYNC] Processing ${players.size} players...`)

    // Sync each player
    for (const player of players.values()) {
      const result = await syncSinglePlayer(payload, player, seasonId)

      switch (result.action) {
        case 'created':
          created++
          console.log(`[SYNC] Created player: ${result.name}`)
          break
        case 'updated':
          updated++
          break
        case 'unchanged':
          unchanged++
          break
        case 'error':
          errors++
          console.error(`[SYNC] Player ${result.name}: ${result.error}`)
          break
      }
    }

    const duration = Date.now() - startTime
    console.log(
      `[SYNC] Players sync completed in ${duration}ms: ${created} created, ${updated} updated, ${unchanged} unchanged, ${errors} errors`
    )

    return {
      success: errors === 0,
      message: `Processed ${players.size} players`,
      playersProcessed: players.size,
      created,
      updated,
      unchanged,
      errors,
      timestamp: new Date().toISOString(),
      duration,
    }
  } catch (error) {
    console.error('[SYNC] Players sync failed:', error)
    return {
      success: false,
      message: `Sync failed: ${error}`,
      playersProcessed: 0,
      created,
      updated,
      unchanged,
      errors: 1,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
    }
  }
}

/**
 * Get players sync status
 */
export async function getPlayersSyncStatus(): Promise<{
  lastSync: string | null
  totalPlayers: number
  teamId: number
  seasonId: number
}> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'players',
    where: {
      teamId: { equals: DEFAULT_TEAM_ID },
    },
    sort: '-lastSyncAt',
    limit: 1,
  })

  const total = await payload.count({
    collection: 'players',
    where: {
      teamId: { equals: DEFAULT_TEAM_ID },
    },
  })

  return {
    lastSync: (result.docs[0]?.lastSyncAt as string) || null,
    totalPlayers: total.totalDocs,
    teamId: DEFAULT_TEAM_ID,
    seasonId: DEFAULT_SEASON_ID,
  }
}
