/**
 * SOTA API Client for Payload CMS
 * Server-side implementation (no browser APIs)
 */

import axios, { AxiosInstance, AxiosError } from 'axios'

// Types
export interface SotaAuthResponse {
  access: string
  refresh: string
}

export interface ScoreTableTeam {
  id: number
  name: string
  logo?: string
  matches: number
  wins: number
  draws: number
  losses: number
  goals: string // "53:19"
  rg: number // goal difference
  points: number
}

export interface ScoreTableResponse {
  result: string
  data: {
    latest_update_date_time?: string
    table: ScoreTableTeam[]
  }
}

export interface TeamStanding {
  position: number
  teamId: number
  teamName: string
  teamLogo: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

// Team Stats types
export interface StatItem {
  name: string
  key: string
  value: number
}

// ============================================
// Match Types
// ============================================

export interface SotaTeamSimple {
  id: number
  name: string
  score?: number | null
}

export interface SotaGame {
  id: string // UUID
  date: string // YYYY-MM-DD
  tournament_id: number
  home_team: SotaTeamSimple
  away_team: SotaTeamSimple
  tour: number
  has_stats: boolean
  season_id: number
  season_name: string
  visitors: number | null
}

// Pre-game lineup types
export interface MatchReferees {
  main: string
  '1st_assistant': string
  '2nd_assistant': string
  '4th_referee': string
  video_assistant_1: string
  video_assistant_main: string
  match_inspector?: string
}

export interface MatchCoach {
  first_name: string
  last_name: string[]
}

export interface MatchAssistant {
  first_name: string
  last_name: string
}

export interface LineupPlayer {
  id: string
  number: number
  full_name: string
  last_name: string
  is_gk: boolean
  is_captain: boolean
  bas_image_path: string | null
}

export interface LineupTeam {
  id: string
  name: string
  short_name: string
  bas_logo_path: string | null
  brand_color: string
  coach: MatchCoach
  first_assistant?: MatchAssistant
  second_assistant?: MatchAssistant
  lineup: LineupPlayer[]
}

export interface PreGameLineupResponse {
  date: string
  referees: MatchReferees
  home_team: LineupTeam
  away_team: LineupTeam
}

// Team match stats types
export interface TeamMatchStats {
  possession: number
  possession_percent?: number
  shot: number
  shots_on_goal: number
  shots_off_goal: number
  foul: number
  yellow_cards: number
  red_cards: number
  pass: number
  offside: number
  corner: number
}

export interface MatchTeamStatsItem {
  id: number
  name: string
  stats: TeamMatchStats
}

export interface TeamsStatsResponse {
  result: string
  data: {
    latest_update_date_time: string
    teams: MatchTeamStatsItem[]
  }
}

// Player match stats types
export interface PlayerMatchStats {
  shot: number
  shots_on_goal: number
  shots_off_goal: number
  foul: number
  yellow_cards: number
  red_cards: number
  pass: number
  offside: number
  corner: number
  duel: number
  tackle: number
}

export interface MatchPlayer {
  id: string
  team: string
  number: number
  first_name: string
  last_name: string
  stats: PlayerMatchStats
}

export interface PlayersStatsResponse {
  result: string
  data: {
    latest_update_date_time: string
    players: MatchPlayer[]
  }
}

export interface TeamStatsResponse {
  result: string
  data: {
    latest_update_date_time: string
    stats: StatItem[]
  }
}

export interface ParsedTeamStats {
  // Identity
  teamId: number
  seasonId: number

  // Performance
  gamesPlayed: number
  gamesTotal: number
  wins: number
  draws: number
  losses: number
  points: number

  // Goals
  goals: number
  goalsConceded: number
  goalsDifference: number

  // Attack
  shots: number
  shotsOnGoal: number
  xg: number
  assists: number
  corners: number
  crosses: number
  penalties: number
  keyPasses: number

  // Possession
  possession: number
  passes: number
  passAccuracy: number

  // Defense
  duels: number
  tackles: number
  interceptions: number
  offsides: number

  // Discipline
  fouls: number
  yellowCards: number
  secondYellowCards: number
  redCards: number

  // Attendance
  averageVisitors: number
  totalVisitors: number
}

// ============================================
// Player Types
// ============================================

export interface PlayerListItem {
  id: string
  first_name: string
  last_name: string
  teams: number[]
  birthday: string | null
  type: string // 'offence', 'defence', 'goalkeeper', etc.
  country_name: string
}

export interface PlayersListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PlayerListItem[]
}

export interface PlayerSeasonStats {
  first_name: string
  last_name: string
  time_on_field_avg: number
  time_on_field_total: number
  shot: number
  foul: number
  yellow_cards: number
  red_cards: number
  pass: number
  duel: number
  tackle: number
  goal?: number
  goal_pass?: number // assists
  games_played?: number
  clean_sheet?: number
}

export interface PlayerSeasonStatsResponse {
  result: string
  data: PlayerSeasonStats
}

// V2 API types - more complete stats
export interface PlayerSeasonStatsV2 {
  first_name: string
  last_name: string
  stats: Array<{ name: string; key: string; value: number }>
}

export interface PlayerSeasonStatsV2Response {
  result: string
  data: PlayerSeasonStatsV2
}

// vMix best players response (for getting goals per match)
export interface VmixBestPlayerItem {
  position: string
  metric_en: string
  metric_kz: string
  image_bas: string | null
  name_en: string
  name_kz: string
  value: number
  main_team_en?: string
}

// Configuration
const SOTA_API_CONFIG = {
  baseURL: process.env.SOTA_API_BASE_URL || 'https://sota.id',
  timeout: 30000,
  defaultSeasonId: parseInt(process.env.SOTA_CURRENT_SEASON_ID || '61', 10),
  teamId: parseInt(process.env.FC_KAISAR_TEAM_ID || '94', 10),
}

class SotaApiClient {
  private client: AxiosInstance
  private token: string | null = null
  private tokenExpiry: number = 0
  private readonly TOKEN_LIFETIME_MS = 23 * 60 * 60 * 1000 // 23 hours (safe margin)

  constructor() {
    this.client = axios.create({
      baseURL: SOTA_API_CONFIG.baseURL,
      timeout: SOTA_API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Get valid auth token (fetch new if expired)
   */
  private async getToken(): Promise<string> {
    // Check if current token is still valid
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token
    }

    // Get credentials from environment
    const email = process.env.SOTA_API_EMAIL
    const passwordBase64 = process.env.SOTA_API_PASSWORD_BASE64

    if (!email || !passwordBase64) {
      throw new Error(
        'SOTA API credentials not configured. Set SOTA_API_EMAIL and SOTA_API_PASSWORD_BASE64'
      )
    }

    // Decode password
    const password = Buffer.from(passwordBase64, 'base64').toString('utf-8')

    try {
      console.log('[SOTA] Authenticating with SOTA API...')

      const response = await this.client.post<SotaAuthResponse>('/api/auth/token/', {
        email,
        password,
      })

      this.token = response.data.access
      this.tokenExpiry = Date.now() + this.TOKEN_LIFETIME_MS

      console.log('[SOTA] Authentication successful')
      return this.token
    } catch (error) {
      const axiosError = error as AxiosError
      console.error('[SOTA] Authentication failed:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      })
      throw new Error('Failed to authenticate with SOTA API')
    }
  }

  /**
   * Make authenticated request
   */
  private async request<T>(
    method: 'GET' | 'POST',
    url: string,
    data?: unknown,
    language: string = 'ru'
  ): Promise<T> {
    const token = await this.getToken()

    const response = await this.client.request<T>({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': language === 'en' ? 'ru' : language, // Fallback en -> ru
      },
    })

    return response.data
  }

  /**
   * Get league standings for a season
   */
  async getScoreTable(
    seasonId: number = SOTA_API_CONFIG.defaultSeasonId,
    language: string = 'ru'
  ): Promise<TeamStanding[]> {
    console.log(`[SOTA] Fetching score table for season ${seasonId}...`)

    const response = await this.request<ScoreTableResponse>(
      'GET',
      `/api/public/v1/seasons/${seasonId}/score_table/`,
      undefined,
      language
    )

    if (response.result !== 'success' || !response.data?.table) {
      throw new Error('Failed to fetch score table from SOTA API')
    }

    console.log(`[SOTA] Received ${response.data.table.length} teams`)

    return response.data.table.map((team, index) => {
      // Parse goals string "53:19"
      const [goalsFor, goalsAgainst] = (team.goals || '0:0').split(':').map(Number)

      return {
        position: index + 1,
        teamId: team.id,
        teamName: team.name,
        teamLogo: team.logo || '',
        played: team.matches,
        won: team.wins,
        drawn: team.draws,
        lost: team.losses,
        goalsFor: goalsFor || 0,
        goalsAgainst: goalsAgainst || 0,
        goalDifference: team.rg,
        points: team.points,
      }
    })
  }

  /**
   * Get team season stats
   */
  async getTeamStats(
    teamId: number = SOTA_API_CONFIG.teamId,
    seasonId: number = SOTA_API_CONFIG.defaultSeasonId
  ): Promise<ParsedTeamStats> {
    console.log(`[SOTA] Fetching team stats for team ${teamId}, season ${seasonId}...`)

    const response = await this.request<TeamStatsResponse>(
      'GET',
      `/api/public/v1/teams/${teamId}/season_stats_v2/?season_id=${seasonId}`,
      undefined,
      'ru'
    )

    if (response.result !== 'Success' || !response.data?.stats) {
      throw new Error('Failed to fetch team stats from SOTA API')
    }

    console.log(`[SOTA] Received ${response.data.stats.length} stat items`)

    // Parse stats array into structured object
    const statsMap = new Map<string, number>()
    for (const stat of response.data.stats) {
      statsMap.set(stat.key, stat.value)
    }

    const getValue = (key: string): number => statsMap.get(key) || 0

    return {
      teamId,
      seasonId,

      // Performance
      gamesPlayed: getValue('games_played'),
      gamesTotal: getValue('games_total'),
      wins: getValue('win'),
      draws: getValue('draw'),
      losses: getValue('match_loss'),
      points: getValue('points'),

      // Goals
      goals: getValue('goal'),
      goalsConceded: getValue('goals_conceded'),
      goalsDifference: getValue('goals_difference'),

      // Attack
      shots: getValue('shot'),
      shotsOnGoal: getValue('shots_on_goal'),
      xg: getValue('xg'),
      assists: getValue('goal_pass'),
      corners: getValue('corner'),
      crosses: getValue('pass_cross'),
      penalties: getValue('penalty'),
      keyPasses: getValue('key_pass'),

      // Possession
      possession: getValue('possession_percent_average'),
      passes: getValue('pass'),
      passAccuracy: getValue('pass_ratio'),

      // Defense
      duels: getValue('duel'),
      tackles: getValue('tackle'),
      interceptions: getValue('interception'),
      offsides: getValue('offside'),

      // Discipline
      fouls: getValue('foul'),
      yellowCards: getValue('yellow_cards'),
      secondYellowCards: getValue('second_yellow_cards'),
      redCards: getValue('red_cards'),

      // Attendance
      averageVisitors: getValue('average_visitors'),
      totalVisitors: getValue('visitor_total'),
    }
  }

  /**
   * Check API health
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.getToken()
      return true
    } catch {
      return false
    }
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return {
      baseURL: SOTA_API_CONFIG.baseURL,
      defaultSeasonId: SOTA_API_CONFIG.defaultSeasonId,
      teamId: SOTA_API_CONFIG.teamId,
    }
  }

  // ============================================
  // Match Methods
  // ============================================

  /**
   * Get all matches for a team in a season
   */
  async getTeamMatches(
    teamId: number = SOTA_API_CONFIG.teamId,
    seasonId: number = SOTA_API_CONFIG.defaultSeasonId
  ): Promise<SotaGame[]> {
    console.log(`[SOTA] Fetching matches for team ${teamId}, season ${seasonId}...`)

    const response = await this.request<SotaGame[]>(
      'GET',
      `/api/public/v1/games/?team_id=${teamId}&season_id=${seasonId}`,
      undefined,
      'ru'
    )

    console.log(`[SOTA] Received ${response.length} matches`)
    return response
  }

  /**
   * Get match lineup (formations, players, referees, coaches)
   */
  async getMatchLineup(gameId: string): Promise<PreGameLineupResponse | null> {
    console.log(`[SOTA] Fetching lineup for game ${gameId}...`)

    try {
      const response = await this.request<PreGameLineupResponse>(
        'GET',
        `/api/public/v1/games/${gameId}/pre_game_lineup/`,
        undefined,
        'ru'
      )
      return response
    } catch (error) {
      console.warn(`[SOTA] Lineup not available for game ${gameId}`)
      return null
    }
  }

  /**
   * Get team statistics for a match
   */
  async getMatchTeamStats(
    gameId: string
  ): Promise<{ home: TeamMatchStats; away: TeamMatchStats } | null> {
    console.log(`[SOTA] Fetching team stats for game ${gameId}...`)

    try {
      const response = await this.request<TeamsStatsResponse>(
        'GET',
        `/api/public/v1/games/${gameId}/teams/`,
        undefined,
        'ru'
      )

      if (response.result === 'Success' && response.data?.teams?.length >= 2) {
        const teams = response.data.teams
        return {
          home: teams[0].stats,
          away: teams[1].stats,
        }
      }
      return null
    } catch (error) {
      console.warn(`[SOTA] Team stats not available for game ${gameId}`)
      return null
    }
  }

  /**
   * Get player statistics for a match
   */
  async getMatchPlayerStats(gameId: string): Promise<MatchPlayer[] | null> {
    console.log(`[SOTA] Fetching player stats for game ${gameId}...`)

    try {
      const response = await this.request<PlayersStatsResponse>(
        'GET',
        `/api/public/v1/games/${gameId}/players/`,
        undefined,
        'ru'
      )

      if (response.result === 'Success' && response.data?.players) {
        return response.data.players
      }
      return null
    } catch (error) {
      console.warn(`[SOTA] Player stats not available for game ${gameId}`)
      return null
    }
  }

  /**
   * Get complete match details (all data in parallel)
   */
  async getCompleteMatchDetails(gameId: string) {
    console.log(`[SOTA] Fetching complete details for game ${gameId}...`)

    const [lineup, teamStats, playerStats] = await Promise.all([
      this.getMatchLineup(gameId),
      this.getMatchTeamStats(gameId),
      this.getMatchPlayerStats(gameId),
    ])

    return { lineup, teamStats, playerStats }
  }

  // ============================================
  // Player Methods
  // ============================================

  /**
   * Get list of players for a team in a season
   */
  async getTeamPlayers(
    teamId: number = SOTA_API_CONFIG.teamId,
    seasonId: number = SOTA_API_CONFIG.defaultSeasonId
  ): Promise<PlayerListItem[]> {
    console.log(`[SOTA] Fetching players for team ${teamId}, season ${seasonId}...`)

    const allPlayers: PlayerListItem[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      try {
        const response = await this.request<PlayersListResponse>(
          'GET',
          `/api/public/v1/players/?team_id=${teamId}&season_id=${seasonId}&page=${page}&page_size=100`,
          undefined,
          'ru'
        )

        if (response.results && response.results.length > 0) {
          allPlayers.push(...response.results)
          hasMore = response.next !== null
          page++
        } else {
          hasMore = false
        }
      } catch (error) {
        console.warn(`[SOTA] Error fetching players page ${page}:`, error)
        hasMore = false
      }
    }

    console.log(`[SOTA] Received ${allPlayers.length} players`)
    return allPlayers
  }

  /**
   * Get season statistics for a specific player
   */
  async getPlayerSeasonStats(
    playerId: string,
    seasonId: number = SOTA_API_CONFIG.defaultSeasonId
  ): Promise<PlayerSeasonStats | null> {
    console.log(`[SOTA] Fetching season stats for player ${playerId}, season ${seasonId}...`)

    try {
      const response = await this.request<PlayerSeasonStatsResponse>(
        'GET',
        `/api/public/v1/players/${playerId}/season_stats/?season_id=${seasonId}`,
        undefined,
        'ru'
      )

      if (response.result === 'Success' && response.data) {
        return response.data
      }
      return null
    } catch (error) {
      console.warn(`[SOTA] Season stats not available for player ${playerId}`)
      return null
    }
  }

  /**
   * Get season statistics for a specific player (V2 API - more complete)
   */
  async getPlayerSeasonStatsV2(
    playerId: string,
    seasonId: number = SOTA_API_CONFIG.defaultSeasonId
  ): Promise<PlayerSeasonStatsV2 | null> {
    try {
      const response = await this.request<PlayerSeasonStatsV2Response>(
        'GET',
        `/api/public/v2/players/${playerId}/season_stats/?season_id=${seasonId}`,
        undefined,
        'ru'
      )

      if (response.result === 'Success' && response.data) {
        return response.data
      }
      return null
    } catch (error) {
      console.warn(`[SOTA] V2 Season stats not available for player ${playerId}`)
      return null
    }
  }

  /**
   * Get goals for a team in a specific match (using vMix endpoint)
   */
  async getMatchGoalsForTeam(
    gameId: string,
    teamId: number = SOTA_API_CONFIG.teamId
  ): Promise<Map<string, number>> {
    const goalsMap = new Map<string, number>()

    try {
      const token = await this.getToken()
      const response = await this.request<VmixBestPlayerItem[]>(
        'GET',
        `/api/public/v1/games/vmix/${gameId}/best-players/${teamId}/?metric=goal&token=${token.substring(0, 10)}`,
        undefined,
        'ru'
      )

      if (Array.isArray(response)) {
        // Skip the header row (first item) and aggregate goals by player name
        for (let i = 1; i < response.length; i++) {
          const item = response[i]
          if (item.name_kz && item.value > 0) {
            // Use Kazakh name as key (matches with our player names)
            const currentGoals = goalsMap.get(item.name_kz) || 0
            goalsMap.set(item.name_kz, currentGoals + item.value)
          }
        }
      }
    } catch (error) {
      // Silently fail - not all matches have vMix data
    }

    return goalsMap
  }

  /**
   * Get assists for a team in a specific match (using vMix endpoint)
   */
  async getMatchAssistsForTeam(
    gameId: string,
    teamId: number = SOTA_API_CONFIG.teamId
  ): Promise<Map<string, number>> {
    const assistsMap = new Map<string, number>()

    try {
      const token = await this.getToken()
      const response = await this.request<VmixBestPlayerItem[]>(
        'GET',
        `/api/public/v1/games/vmix/${gameId}/best-players/${teamId}/?metric=goal_pass&token=${token.substring(0, 10)}`,
        undefined,
        'ru'
      )

      if (Array.isArray(response)) {
        // Skip the header row (first item) and aggregate assists by player name
        for (let i = 1; i < response.length; i++) {
          const item = response[i]
          if (item.name_kz && item.value > 0) {
            const currentAssists = assistsMap.get(item.name_kz) || 0
            assistsMap.set(item.name_kz, currentAssists + item.value)
          }
        }
      }
    } catch (error) {
      // Silently fail - not all matches have vMix data
    }

    return assistsMap
  }
}

// Singleton instance
export const sotaClient = new SotaApiClient()
