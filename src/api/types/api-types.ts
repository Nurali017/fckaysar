/**
 * TypeScript types for sota.id API responses
 * Based on actual API testing on 2025-12-02
 */

// Authentication
export interface SotaAuthResponse {
  access: string;
  refresh: string;
  multi_token?: string;
}

// Team (simplified structure from API)
export interface SotaTeamSimple {
  id: number;
  name: string;
  score?: number | null;
}

// Season
export interface SotaSeason {
  id: number;
  name: string;
}

// Tournament
export interface SotaTournament {
  id: number;
  name: string;
  seasons?: SotaSeason[];
}

// Game/Match (actual structure from API testing)
export interface SotaGame {
  id: string; // UUID
  date: string; // YYYY-MM-DD
  tournament_id: number;
  home_team: SotaTeamSimple;
  away_team: SotaTeamSimple;
  tour: number; // Match week
  has_stats: boolean;
  season_id: number;
  season_name: string;
  visitors: number | null;
}

// Full Team (from teams endpoint)
export interface SotaTeam {
  id: number;
  name: string;
  tournaments: SotaTournament[];
  seasons: number[];
}

// Query Parameters for /api/public/v1/games/
export interface GamesQueryParams {
  team?: number;        // Team ID filter
  season_id?: number;
  tournament?: number;  // Tournament ID filter
  date_from?: string;   // YYYY-MM-DD
  date_to?: string;     // YYYY-MM-DD
  limit?: number;
  offset?: number;
}

export interface TeamsQueryParams {
  search?: string;
  limit?: number;
  offset?: number;
}

// Score Table (from /api/public/v1/seasons/{id}/score_table/)
export interface ScoreTableTeam {
  id: number;
  name: string;
  logo: string;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goals: string;  // "53:19"
  rg: number;     // goal difference
  points: number;
}

export interface ScoreTableResponse {
  result: string;
  data: {
    latest_update_date_time?: string;
    table: ScoreTableTeam[];
  };
}
