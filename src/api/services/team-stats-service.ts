/**
 * Team Statistics Service
 * Fetches team statistics from CMS (cached from SOTA API)
 */

import { cmsClient } from '../cms/cms-client'
import type { TeamSeasonStats, ProcessedTeamStats } from '../types/team-stats-types'

const KAISAR_TEAM_ID = 94
const CURRENT_SEASON_ID = 61

/**
 * CMS Team Stats Response type
 */
interface CMSTeamStatsResponse {
  success: boolean
  data: {
    teamId: number
    seasonId: number
    gamesPlayed: number
    gamesTotal: number
    wins: number
    draws: number
    losses: number
    points: number
    goals: number
    goalsConceded: number
    goalsDifference: number
    attackStats: {
      shots: number
      shotsOnGoal: number
      xg: number
      assists: number
      corners: number
      crosses: number
      penalties: number
      keyPasses: number
    }
    possessionStats: {
      possession: number
      passes: number
      passAccuracy: number
    }
    defenseStats: {
      duels: number
      tackles: number
      interceptions: number
      offsides: number
    }
    disciplineStats: {
      fouls: number
      yellowCards: number
      secondYellowCards: number
      redCards: number
    }
    attendanceStats: {
      averageVisitors: number
      totalVisitors: number
    }
    lastSyncAt: string
  }
  meta: {
    teamId: number
    seasonId: number
    lastSync: string
  }
}

/**
 * Fetch team season statistics from CMS
 */
export const getTeamSeasonStats = async (
  teamId: number = KAISAR_TEAM_ID,
  params: { season_id?: number } = { season_id: CURRENT_SEASON_ID }
): Promise<TeamSeasonStats> => {
  const response = await cmsClient.get<CMSTeamStatsResponse>('/team-stats', {
    params: {
      teamId,
      seasonId: params.season_id,
    },
  })

  if (!response.data.success) {
    throw new Error('Failed to fetch team statistics from CMS')
  }

  const data = response.data.data

  // Map CMS format to existing TeamSeasonStats format
  return {
    // Performance
    goals: data.goals,
    goals_conceded: data.goalsConceded,
    goals_difference: data.goalsDifference,
    win: data.wins,
    draw: data.draws,
    match_loss: data.losses,
    points: data.points,
    games_played: data.gamesPlayed,
    games_total: data.gamesTotal,

    // Attack
    shots: data.attackStats.shots,
    assists: data.attackStats.assists,
    corners: data.attackStats.corners,

    // Extended attack stats
    shotsOnGoal: data.attackStats.shotsOnGoal,
    xg: data.attackStats.xg,
    crosses: data.attackStats.crosses,
    penalties: data.attackStats.penalties,
    keyPasses: data.attackStats.keyPasses,

    // Possession
    possession: data.possessionStats.possession,
    passes: data.possessionStats.passes,
    passAccuracy: data.possessionStats.passAccuracy,

    // Defense
    duels: data.defenseStats.duels,
    tackles: data.defenseStats.tackles,
    interceptions: data.defenseStats.interceptions,
    offsides: data.defenseStats.offsides,

    // Discipline
    fouls: data.disciplineStats.fouls,
    yellow_cards: data.disciplineStats.yellowCards,
    red_cards: data.disciplineStats.redCards,
    secondYellowCards: data.disciplineStats.secondYellowCards,

    // Attendance
    average_visitors: data.attendanceStats.averageVisitors,
    visitor_total: data.attendanceStats.totalVisitors,

    // Meta
    lastUpdated: data.lastSyncAt,
  }
}

/**
 * Process raw stats into computed metrics for UI
 */
export const processTeamStats = (stats: TeamSeasonStats): ProcessedTeamStats => {
  const gamesPlayed = stats.games_played || 1
  const totalGames = stats.games_total || 26

  // Calculate win/draw/loss rates
  const totalMatches = stats.win + stats.draw + stats.match_loss
  const winRate = totalMatches > 0 ? Math.round((stats.win / totalMatches) * 100) : 0
  const drawRate = totalMatches > 0 ? Math.round((stats.draw / totalMatches) * 100) : 0
  const lossRate = totalMatches > 0 ? Math.round((stats.match_loss / totalMatches) * 100) : 0

  // Calculate per-game metrics
  const pointsPerGame = +(stats.points / gamesPlayed).toFixed(2)
  const goalsPerGame = +(stats.goals / gamesPlayed).toFixed(2)
  const shotsPerGame = +(stats.shots / gamesPlayed).toFixed(1)
  const assistsPerGame = +(stats.assists / gamesPlayed).toFixed(2)
  const cornersPerGame = +(stats.corners / gamesPlayed).toFixed(1)
  const goalsConcededPerGame = +(stats.goals_conceded / gamesPlayed).toFixed(2)
  const cardsPerGame = +((stats.yellow_cards + stats.red_cards) / gamesPlayed).toFixed(1)
  const foulsPerGame = +(stats.fouls / gamesPlayed).toFixed(1)

  // Calculate advanced metrics
  const shotAccuracy =
    stats.shots > 0 ? Math.round((stats.goals / stats.shots) * 100) : 0
  const cleanSheetRate =
    gamesPlayed > 0
      ? Math.round(
          ((gamesPlayed - Math.ceil((stats.goals_conceded / gamesPlayed) * 0.7 * gamesPlayed)) /
            gamesPlayed) *
            100
        )
      : 0
  const seasonProgress = Math.round((gamesPlayed / totalGames) * 100)

  return {
    // Performance
    winRate,
    drawRate,
    lossRate,
    pointsPerGame,
    seasonProgress,

    // Attack
    goalsPerGame,
    shotsPerGame,
    assistsPerGame,
    cornersPerGame,
    shotAccuracy: Math.min(shotAccuracy, 100),

    // Defense
    goalsConcededPerGame,
    cleanSheetRate: Math.max(0, Math.min(cleanSheetRate, 100)),

    // Discipline
    cardsPerGame,
    foulsPerGame,

    // Form - placeholder, will be populated from matches API
    form: [],

    // Raw data
    raw: stats,
  }
}

/**
 * Get fully processed team statistics
 */
export const getProcessedTeamStats = async (
  teamId: number = KAISAR_TEAM_ID,
  params: { season_id?: number } = { season_id: CURRENT_SEASON_ID }
): Promise<ProcessedTeamStats> => {
  const rawStats = await getTeamSeasonStats(teamId, params)
  return processTeamStats(rawStats)
}

// Export constants for use in components
export { KAISAR_TEAM_ID, CURRENT_SEASON_ID }
