/**
 * Team Statistics Types
 * API: GET /teams/{team_id}/season_stats_v2/
 */

// Raw stat item from API response
export interface StatItem {
  name: string;
  key: string;
  value: number;
}

// API Response structure
export interface TeamSeasonStatsResponse {
  result: 'Success';
  data: {
    latest_update_date_time: string;
    stats: StatItem[];
  };
}

// Parsed team statistics
export interface TeamSeasonStats {
  // Performance
  goals: number;
  goals_conceded: number;
  goals_difference: number;
  win: number;
  draw: number;
  match_loss: number;
  points: number;
  games_played: number;
  games_total: number;

  // Attack
  shots: number;
  assists: number;
  corners: number;
  shotsOnGoal?: number;
  xg?: number;
  crosses?: number;
  penalties?: number;
  keyPasses?: number;

  // Possession
  possession?: number;
  passes?: number;
  passAccuracy?: number;

  // Defense
  duels?: number;
  tackles?: number;
  interceptions?: number;
  offsides?: number;

  // Discipline
  fouls: number;
  yellow_cards: number;
  red_cards: number;
  secondYellowCards?: number;

  // Attendance
  average_visitors: number;
  visitor_total: number;

  // Meta
  lastUpdated: string;
}

// Query parameters for API
export interface TeamStatsQueryParams {
  season_id: number;
  tour?: number;
  single_tour?: boolean;
}

// Processed/computed statistics for UI
export interface ProcessedTeamStats {
  // Performance metrics (computed)
  winRate: number;
  drawRate: number;
  lossRate: number;
  pointsPerGame: number;
  seasonProgress: number;

  // Attack metrics (computed)
  goalsPerGame: number;
  shotsPerGame: number;
  assistsPerGame: number;
  cornersPerGame: number;
  shotAccuracy: number;

  // Defense metrics (computed)
  goalsConcededPerGame: number;
  cleanSheetRate: number;

  // Discipline (computed)
  cardsPerGame: number;
  foulsPerGame: number;

  // Form (last 5 games) - will be computed from matches API
  form: ('W' | 'D' | 'L')[];

  // Raw data
  raw: TeamSeasonStats;
}

// Stat categories for DetailedStatsGrid tabs
export type StatCategory = 'attack' | 'defense' | 'discipline' | 'attendance';

// Individual stat for display
export interface DisplayStat {
  key: string;
  label: string;
  value: number | string;
  icon?: string;
  color?: 'green' | 'red' | 'yellow' | 'blue' | 'gray';
  suffix?: string;
  prefix?: string;
}
