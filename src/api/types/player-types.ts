/**
 * TypeScript types for SOTA Players API endpoints
 */

// ============================================
// GET /players/?team_id=X&season_id=Y
// ============================================

export interface SotaPlayer {
    id: string;              // UUID
    first_name: string;
    last_name: string;
    teams: number[];
    birthday: string;        // "2003-10-27"
    type: 'offence' | 'defence' | 'midfield' | 'goalkeeper';
    country_name: string;
}

export interface SotaPlayersResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: SotaPlayer[];
}

// ============================================
// GET /v2/players/{id}/season_stats/?season_id=Y
// ============================================

export interface SotaPlayerStatItem {
    name: string;
    key: string;
    value: number;
}

export interface SotaPlayerStatsResponse {
    result: 'Success';
    data: {
        first_name: string;
        last_name: string;
        stats: SotaPlayerStatItem[];
    };
}

// ============================================
// Combined Types for UI
// ============================================

export interface SotaPlayerFull extends SotaPlayer {
    number?: number;                 // from lineup
    photoUrl?: string;               // transformed bas_image_path
    stats?: Record<string, number>;  // { goal: 5, goal_pass: 3, ... }
}
