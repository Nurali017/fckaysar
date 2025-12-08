/**
 * Matches Synchronization Service
 * Syncs match data from SOTA API to Payload CMS
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import {
  sotaClient,
  SotaGame,
  PreGameLineupResponse,
  TeamMatchStats,
  MatchPlayer,
} from '../sota-client'

// Directory for storing lineup player photos
const LINEUP_PHOTOS_DIR = path.resolve(process.cwd(), 'public/media/lineup-photos')

// Ensure directory exists
if (!fs.existsSync(LINEUP_PHOTOS_DIR)) {
  fs.mkdirSync(LINEUP_PHOTOS_DIR, { recursive: true })
}

/**
 * Transform Windows path to SOTA URL
 */
function transformToSotaUrl(basPath: string | null): string | null {
  if (!basPath) return null
  return basPath
    .replace('C:\\KPL_FINAL\\SOTA_PHOTO_PLAYER\\', 'https://sota.id/media/players/')
    .replace(/\\/g, '/')
}

/**
 * Download photo from URL and save locally
 * Returns local path or null if failed
 */
async function downloadPlayerPhoto(basImagePath: string | null, playerId: string): Promise<string | null> {
  if (!basImagePath) return null

  const sotaUrl = transformToSotaUrl(basImagePath)
  if (!sotaUrl) return null

  // Generate local filename from player ID
  const ext = path.extname(basImagePath) || '.png'
  const filename = `${playerId}${ext}`
  const localPath = path.join(LINEUP_PHOTOS_DIR, filename)
  const publicUrl = `/media/lineup-photos/${filename}`

  // Check if already downloaded
  if (fs.existsSync(localPath)) {
    return publicUrl
  }

  return new Promise((resolve) => {
    try {
      const file = fs.createWriteStream(localPath)

      https.get(sotaUrl, (response) => {
        if (response.statusCode !== 200) {
          console.warn(`[SYNC] Failed to download photo for ${playerId}: HTTP ${response.statusCode}`)
          fs.unlinkSync(localPath)
          resolve(null)
          return
        }

        response.pipe(file)

        file.on('finish', () => {
          file.close()
          resolve(publicUrl)
        })

        file.on('error', (err) => {
          console.warn(`[SYNC] Error saving photo for ${playerId}:`, err.message)
          fs.unlinkSync(localPath)
          resolve(null)
        })
      }).on('error', (err) => {
        console.warn(`[SYNC] Error downloading photo for ${playerId}:`, err.message)
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath)
        resolve(null)
      })
    } catch (err) {
      console.warn(`[SYNC] Exception downloading photo for ${playerId}:`, err)
      resolve(null)
    }
  })
}

export interface MatchSyncResult {
  success: boolean
  message: string
  matchesProcessed: number
  created: number
  updated: number
  unchanged: number
  errors: number
  timestamp: string
  duration: number
}

export interface SingleMatchSyncResult {
  action: 'created' | 'updated' | 'unchanged' | 'error'
  sotaId: string
  error?: string
}

export interface SyncOptions {
  teamId?: number
  seasonId?: number
  syncDetails?: boolean // If true, fetch lineup, team stats, player stats
}

const DEFAULT_TEAM_ID = parseInt(process.env.FC_KAISAR_TEAM_ID || '94', 10)
const DEFAULT_SEASON_ID = parseInt(process.env.SOTA_CURRENT_SEASON_ID || '61', 10)

/**
 * Determine match status based on date and has_stats flag
 */
function getMatchStatus(game: SotaGame): 'scheduled' | 'live' | 'finished' {
  const matchDate = new Date(game.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  matchDate.setHours(0, 0, 0, 0)

  // If has_stats and both teams have scores, it's finished
  if (
    game.has_stats &&
    game.home_team.score !== null &&
    game.away_team.score !== null
  ) {
    return 'finished'
  }

  // If match date is in the future
  if (matchDate > today) {
    return 'scheduled'
  }

  // If match is today and has stats, it might be live or finished
  if (matchDate.getTime() === today.getTime()) {
    if (game.has_stats) {
      return 'finished'
    }
    return 'scheduled' // Match today but not started yet
  }

  // Past match
  return game.has_stats ? 'finished' : 'scheduled'
}

/**
 * Get coach full name from API structure
 */
function getCoachFullName(coach?: { first_name: string; last_name: string[] }): string {
  if (!coach?.first_name) return ''
  const lastName = Array.isArray(coach.last_name) ? coach.last_name[0] : coach.last_name
  return `${coach.first_name} ${lastName || ''}`.trim()
}

/**
 * Transform SOTA lineup data to CMS format
 * Downloads player photos locally
 */
async function transformLineup(lineup: PreGameLineupResponse | null) {
  const emptyCoach = { name: '', photo: '' }

  if (!lineup) {
    return {
      homeLineup: [],
      awayLineup: [],
      homeCoach: emptyCoach,
      awayCoach: emptyCoach,
    }
  }

  const mapPlayer = async (player: PreGameLineupResponse['home_team']['lineup'][0]) => {
    // Download photo locally
    const localPhoto = await downloadPlayerPhoto(player.bas_image_path, player.id)

    return {
      playerId: player.id,
      number: player.number,
      fullName: player.full_name,
      lastName: player.last_name,
      isGk: player.is_gk,
      isCaptain: player.is_captain,
      photo: localPhoto || '', // Use local path or empty
    }
  }

  // Process all players in parallel
  const homeLineup = await Promise.all(
    lineup.home_team?.lineup?.map(mapPlayer) || []
  )
  const awayLineup = await Promise.all(
    lineup.away_team?.lineup?.map(mapPlayer) || []
  )

  return {
    homeLineup,
    awayLineup,
    homeCoach: {
      name: getCoachFullName(lineup.home_team?.coach),
      photo: '',
    },
    awayCoach: {
      name: getCoachFullName(lineup.away_team?.coach),
      photo: '',
    },
  }
}

/**
 * Transform team stats to CMS format
 */
function transformTeamStats(stats: { home: TeamMatchStats; away: TeamMatchStats } | null) {
  const emptyStats = {
    possession: 0,
    shots: 0,
    shotsOnGoal: 0,
    shotsOffGoal: 0,
    passes: 0,
    fouls: 0,
    corners: 0,
    offsides: 0,
    yellowCards: 0,
    redCards: 0,
  }

  if (!stats) {
    return { home: emptyStats, away: emptyStats }
  }

  const mapStats = (teamStats: TeamMatchStats) => ({
    possession: teamStats.possession_percent || teamStats.possession || 0,
    shots: teamStats.shot || 0,
    shotsOnGoal: teamStats.shots_on_goal || 0,
    shotsOffGoal: teamStats.shots_off_goal || 0,
    passes: teamStats.pass || 0,
    fouls: teamStats.foul || 0,
    corners: teamStats.corner || 0,
    offsides: teamStats.offside || 0,
    yellowCards: teamStats.yellow_cards || 0,
    redCards: teamStats.red_cards || 0,
  })

  return {
    home: mapStats(stats.home),
    away: mapStats(stats.away),
  }
}

/**
 * Transform player stats to CMS format
 */
function transformPlayerStats(
  players: MatchPlayer[] | null,
  homeTeamName: string,
  awayTeamName: string,
  homeTeamNameFromLineup?: string,
  awayTeamNameFromLineup?: string
) {
  if (!players || players.length === 0) return { homePlayers: [], awayPlayers: [] }

  const mapPlayer = (player: MatchPlayer) => ({
    playerId: player.id,
    name: `${player.first_name} ${player.last_name}`.trim(),
    number: player.number,
    shots: player.stats?.shot || 0,
    shotsOnGoal: player.stats?.shots_on_goal || 0,
    passes: player.stats?.pass || 0,
    fouls: player.stats?.foul || 0,
    yellowCards: player.stats?.yellow_cards || 0,
    redCards: player.stats?.red_cards || 0,
    duels: player.stats?.duel || 0,
    tackles: player.stats?.tackle || 0,
    offsides: player.stats?.offside || 0,
    corners: player.stats?.corner || 0,
  })

  // Get unique team names from players
  const teamNames = [...new Set(players.map((p) => p.team))]

  // Split players by team - try multiple name variants
  const homeNames = [homeTeamName, homeTeamNameFromLineup].filter(Boolean)
  const awayNames = [awayTeamName, awayTeamNameFromLineup].filter(Boolean)

  let homePlayers = players
    .filter((p) => homeNames.some((name) => p.team === name))
    .map(mapPlayer)

  let awayPlayers = players
    .filter((p) => awayNames.some((name) => p.team === name))
    .map(mapPlayer)

  // If no matches found and we have exactly 2 team names, split by first/second
  if (homePlayers.length === 0 && awayPlayers.length === 0 && teamNames.length === 2) {
    homePlayers = players.filter((p) => p.team === teamNames[0]).map(mapPlayer)
    awayPlayers = players.filter((p) => p.team === teamNames[1]).map(mapPlayer)
  }

  return { homePlayers, awayPlayers }
}

/**
 * Transform referees to CMS format
 */
function transformReferees(lineup: PreGameLineupResponse | null) {
  const emptyReferees = {
    main: '',
    firstAssistant: '',
    secondAssistant: '',
    fourthReferee: '',
    var: '',
    varAssistant: '',
  }

  if (!lineup?.referees) return emptyReferees

  const refs = lineup.referees
  return {
    main: refs.main || '',
    firstAssistant: refs['1st_assistant'] || '',
    secondAssistant: refs['2nd_assistant'] || '',
    fourthReferee: refs['4th_referee'] || '',
    var: refs.video_assistant_main || '',
    varAssistant: refs.video_assistant_1 || '',
  }
}

/**
 * Sync a single match
 */
async function syncSingleMatch(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  game: SotaGame,
  details?: {
    lineup: PreGameLineupResponse | null
    teamStats: { home: TeamMatchStats; away: TeamMatchStats } | null
    playerStats: MatchPlayer[] | null
  }
): Promise<SingleMatchSyncResult> {
  try {
    // Check if match exists
    const existing = await payload.find({
      collection: 'matches',
      where: {
        sotaId: { equals: game.id },
      },
      limit: 1,
    })

    // Transform lineup data (downloads photos locally)
    const lineupData = await transformLineup(details?.lineup || null)

    // Transform team stats
    const teamStatsData = transformTeamStats(details?.teamStats || null)

    // Transform player stats
    const playerStatsData = transformPlayerStats(
      details?.playerStats || null,
      game.home_team.name,
      game.away_team.name,
      details?.lineup?.home_team?.name,
      details?.lineup?.away_team?.name
    )

    // Transform referees
    const refereesData = transformReferees(details?.lineup || null)

    // Build match data
    const matchData = {
      sotaId: game.id,
      seasonId: game.season_id,
      tour: game.tour,
      homeTeam: {
        id: game.home_team.id,
        name: game.home_team.name,
        shortName: details?.lineup?.home_team?.short_name || '',
        logo: details?.lineup?.home_team?.bas_logo_path || '',
        score: game.home_team.score ?? undefined,
        brandColor: details?.lineup?.home_team?.brand_color || '',
      },
      awayTeam: {
        id: game.away_team.id,
        name: game.away_team.name,
        shortName: details?.lineup?.away_team?.short_name || '',
        logo: details?.lineup?.away_team?.bas_logo_path || '',
        score: game.away_team.score ?? undefined,
        brandColor: details?.lineup?.away_team?.brand_color || '',
      },
      matchDate: new Date(game.date).toISOString(),
      venue: '', // Not available in base API
      competition: 'Kazakhstan Premier League',
      visitors: game.visitors ?? undefined,
      status: getMatchStatus(game),
      hasStats: game.has_stats,
      teamStats: teamStatsData,
      referees: refereesData,
      homeLineup: lineupData.homeLineup,
      awayLineup: lineupData.awayLineup,
      homeCoach: lineupData.homeCoach,
      awayCoach: lineupData.awayCoach,
      homePlayers: playerStatsData.homePlayers,
      awayPlayers: playerStatsData.awayPlayers,
      lastSyncAt: new Date().toISOString(),
    }

    if (existing.docs.length > 0) {
      const doc = existing.docs[0]

      // Check if important data changed
      const hasChanges =
        doc.homeTeam?.score !== matchData.homeTeam.score ||
        doc.awayTeam?.score !== matchData.awayTeam.score ||
        doc.status !== matchData.status ||
        doc.hasStats !== matchData.hasStats

      if (!hasChanges && !details) {
        return { action: 'unchanged', sotaId: game.id }
      }

      await payload.update({
        collection: 'matches',
        id: doc.id,
        data: matchData,
      })

      return { action: 'updated', sotaId: game.id }
    } else {
      await payload.create({
        collection: 'matches',
        data: matchData,
      })

      return { action: 'created', sotaId: game.id }
    }
  } catch (error) {
    console.error(`[SYNC] Error syncing match ${game.id}:`, error)
    return {
      action: 'error',
      sotaId: game.id,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Sync all matches from SOTA API to CMS
 */
export async function syncMatches(options: SyncOptions = {}): Promise<MatchSyncResult> {
  const startTime = Date.now()
  const {
    teamId = DEFAULT_TEAM_ID,
    seasonId = DEFAULT_SEASON_ID,
    syncDetails = true,
  } = options

  console.log(`[SYNC] Starting matches sync for team ${teamId}, season ${seasonId}...`)

  let created = 0
  let updated = 0
  let unchanged = 0
  let errors = 0

  try {
    const payload = await getPayload({ config })

    // Fetch all matches from SOTA API
    const games = await sotaClient.getTeamMatches(teamId, seasonId)

    console.log(`[SYNC] Processing ${games.length} matches...`)

    // Process each match
    for (const game of games) {
      // Fetch details only for matches with stats
      let details
      if (syncDetails && game.has_stats) {
        try {
          details = await sotaClient.getCompleteMatchDetails(game.id)
        } catch (err) {
          console.warn(`[SYNC] Could not fetch details for ${game.id}:`, err)
        }
      }

      const result = await syncSingleMatch(payload, game, details)

      switch (result.action) {
        case 'created':
          created++
          break
        case 'updated':
          updated++
          break
        case 'unchanged':
          unchanged++
          break
        case 'error':
          errors++
          console.error(`[SYNC] Match ${result.sotaId}: ${result.error}`)
          break
      }
    }

    const duration = Date.now() - startTime
    console.log(
      `[SYNC] Matches sync completed in ${duration}ms: ${created} created, ${updated} updated, ${unchanged} unchanged, ${errors} errors`
    )

    return {
      success: errors === 0,
      message: `Processed ${games.length} matches`,
      matchesProcessed: games.length,
      created,
      updated,
      unchanged,
      errors,
      timestamp: new Date().toISOString(),
      duration,
    }
  } catch (error) {
    console.error('[SYNC] Matches sync failed:', error)
    return {
      success: false,
      message: `Sync failed: ${error}`,
      matchesProcessed: 0,
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
 * Sync a specific match by ID
 */
export async function syncMatchById(
  gameId: string,
  options: Omit<SyncOptions, 'syncDetails'> = {}
): Promise<SingleMatchSyncResult> {
  const { teamId = DEFAULT_TEAM_ID, seasonId = DEFAULT_SEASON_ID } = options

  console.log(`[SYNC] Syncing single match ${gameId}...`)

  try {
    const payload = await getPayload({ config })

    // Fetch all matches and find the one we need
    const games = await sotaClient.getTeamMatches(teamId, seasonId)
    const game = games.find((g) => g.id === gameId)

    if (!game) {
      return {
        action: 'error',
        sotaId: gameId,
        error: 'Match not found in SOTA API',
      }
    }

    // Always fetch full details for single match sync
    const details = await sotaClient.getCompleteMatchDetails(gameId)

    return syncSingleMatch(payload, game, details)
  } catch (error) {
    console.error(`[SYNC] Error syncing match ${gameId}:`, error)
    return {
      action: 'error',
      sotaId: gameId,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Get matches sync status
 */
export async function getMatchesSyncStatus(): Promise<{
  lastSync: string | null
  totalMatches: number
  teamId: number
  seasonId: number
}> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'matches',
    where: {
      seasonId: { equals: DEFAULT_SEASON_ID },
    },
    sort: '-lastSyncAt',
    limit: 1,
  })

  const total = await payload.count({
    collection: 'matches',
    where: {
      seasonId: { equals: DEFAULT_SEASON_ID },
    },
  })

  return {
    lastSync: (result.docs[0]?.lastSyncAt as string) || null,
    totalMatches: total.totalDocs,
    teamId: DEFAULT_TEAM_ID,
    seasonId: DEFAULT_SEASON_ID,
  }
}
