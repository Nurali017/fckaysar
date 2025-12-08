/**
 * TypeScript types for Match Details API endpoints
 * Based on sota.id API documentation
 */

// ============================================
// GET /games/{game_id}/pre_game_lineup/
// ============================================

export interface MatchReferees {
  main: string;
  '1st_assistant': string;
  '2nd_assistant': string;
  '4th_referee': string;
  video_assistant_1: string;
  video_assistant_main: string;
  match_inspector: string;
}

export interface MatchCoach {
  first_name: string;
  last_name: string[]; // API returns array
}

export interface MatchAssistant {
  first_name: string;
  last_name: string;
}

export interface LineupPlayer {
  id: string;
  number: number;
  full_name: string;
  last_name: string;
  is_gk: boolean;
  is_captain: boolean;
  bas_image_path: string | null;
}

export interface LineupTeam {
  id: string;
  name: string;
  short_name: string;
  bas_logo_path: string | null;
  brand_color: string;
  coach: MatchCoach;
  first_assistant: MatchAssistant;
  second_assistant: MatchAssistant;
  lineup: LineupPlayer[];
}

export interface PreGameLineupResponse {
  date: string;
  referees: MatchReferees;
  home_team: LineupTeam;
  away_team: LineupTeam;
}

// ============================================
// GET /games/{game_id}/players/
// ============================================

export interface PlayerMatchStats {
  shot: number;
  shots_on_goal: number;
  shots_off_goal: number;
  foul: number;
  yellow_cards: number;
  red_cards: number;
  pass: number;
  offside: number;
  corner: number;
  duel: number;
  tackle: number;
}

export interface MatchPlayer {
  id: string;
  team: string; // team name
  number: number;
  first_name: string;
  last_name: string;
  stats: PlayerMatchStats;
}

export interface PlayersStatsResponse {
  result: 'Success';
  data: {
    latest_update_date_time: string;
    players: MatchPlayer[];
  };
}

// ============================================
// GET /games/{game_id}/teams/
// ============================================

export interface TeamMatchStats {
  possession: number;
  shot: number;
  shots_on_goal: number;
  shots_off_goal: number;
  foul: number;
  yellow_cards: number;
  red_cards: number;
  pass: number;
  offside: number;
  corner: number;
}

export interface MatchTeamStats {
  id: number;
  name: string;
  stats: TeamMatchStats;
}

export interface TeamsStatsResponse {
  result: 'Success';
  data: {
    latest_update_date_time: string;
    teams: MatchTeamStats[];
  };
}

// ============================================
// Combined Match Details Type
// ============================================

export interface MatchDetails {
  id: string;
  date: string;
  time: string;
  stadium: string;
  competition: string;
  tour: number;
  status: 'upcoming' | 'live' | 'finished';
  hasStats: boolean;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    logo: string;
    score?: number;
    brandColor: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    logo: string;
    score?: number;
    brandColor: string;
  };
  lineup?: PreGameLineupResponse;
  playerStats?: MatchPlayer[];
  teamStats?: {
    home: TeamMatchStats;
    away: TeamMatchStats;
  };
  referees?: MatchReferees;
}

// ============================================
// Utility Functions
// ============================================

/**
 * Transform image path to displayable URL
 * Handles: local paths (/media/...), Windows paths, and URLs
 */
export const transformImagePath = (basPath: string | null): string => {
  if (!basPath) return '/images/default-player.png';

  // Already a local or absolute URL
  if (basPath.startsWith('/') || basPath.startsWith('http')) {
    return basPath;
  }

  // Map Windows paths to SOTA URL (fallback for old data)
  return basPath
    .replace('C:\\KPL_FINAL\\SOTA_PHOTO_PLAYER\\', 'https://sota.id/media/players/')
    .replace(/\\/g, '/');
};

/**
 * Get coach full name from API structure
 */
export const getCoachFullName = (coach: MatchCoach): string => {
  if (!coach.first_name) return '—';
  const lastName = Array.isArray(coach.last_name)
    ? coach.last_name[0]
    : coach.last_name;
  return `${coach.first_name} ${lastName || ''}`.trim();
};

/**
 * Split lineup into goalkeepers and field players
 */
export const splitLineup = (lineup: LineupPlayer[]) => ({
  goalkeepers: lineup.filter(p => p.is_gk),
  fieldPlayers: lineup.filter(p => !p.is_gk),
});
