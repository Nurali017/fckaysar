/**
 * React Query hooks for Players API
 * Uses CMS API exclusively (no direct SOTA calls)
 */

import { useQuery } from '@tanstack/react-query';
import { cmsClient } from '@/api/cms/cms-client';
import type { PlayerItem } from '@/types/player';

/**
 * CMS Players response type
 */
interface CMSPlayersResponse {
  success: boolean;
  data: Array<{
    id: string;
    slug: string;
    firstName: string;
    lastName: string;
    displayName: string;
    jerseyNumber?: number;
    position: string;
    isGoalkeeper: boolean;
    nationality?: string;
    dateOfBirth?: string;
    height?: number;
    weight?: number;
    photo?: string;
    status: string;
    currentSeasonStats?: {
      appearances?: number;
      games_played?: number;
      goals?: number;
      assists?: number;
      yellowCards?: number;
      yellow_cards?: number;
      redCards?: number;
      red_cards?: number;
      cleanSheets?: number;
      clean_sheets?: number;
      minutesPlayed?: number;
      minutes_played?: number;
      // V2 данные для радарной диаграммы
      shots?: number;
      shot?: number;
      shotsOnGoal?: number;
      shots_on_goal?: number;
      passes?: number;
      pass?: number;
      duels?: number;
      duel?: number;
      tackles?: number;
      tackle?: number;
    };
    socialMedia?: {
      instagram?: string;
      twitter?: string;
    };
  }>;
  meta: {
    totalDocs: number;
    totalPages: number;
    page: number;
    limit: number;
    teamId: number;
    lastSync: string | null;
  };
}

/**
 * CMS Single Player response type
 */
interface CMSPlayerResponse {
  success: boolean;
  data: {
    id: string;
    slug: string;
    firstName: string;
    lastName: string;
    displayName: string;
    jerseyNumber?: number;
    position: string;
    isGoalkeeper: boolean;
    nationality?: string;
    dateOfBirth?: string;
    height?: number;
    weight?: number;
    photo?: string;
    actionPhotos?: string[];
    biography?: object;
    status: string;
    currentSeasonStats?: {
      appearances?: number;
      games_played?: number;
      goals?: number;
      assists?: number;
      yellowCards?: number;
      yellow_cards?: number;
      redCards?: number;
      red_cards?: number;
      cleanSheets?: number;
      clean_sheets?: number;
      minutesPlayed?: number;
      minutes_played?: number;
      // V2 данные для радарной диаграммы
      shots?: number;
      shot?: number;
      shotsOnGoal?: number;
      shots_on_goal?: number;
      passes?: number;
      pass?: number;
      duels?: number;
      duel?: number;
      tackles?: number;
      tackle?: number;
    };
    statistics?: Array<{
      season: string;
      appearances?: number;
      goals?: number;
      assists?: number;
    }>;
    socialMedia?: {
      instagram?: string;
      twitter?: string;
    };
  };
  meta: {
    lastSync: string | null;
  };
}

/**
 * Map position string to position key
 */
const mapPositionKey = (position: string | undefined, isGoalkeeper?: boolean): 'goalkeeper' | 'defender' | 'midfielder' | 'forward' => {
  // Fallback for players without position field
  if (!position) {
    return isGoalkeeper ? 'goalkeeper' : 'midfielder';
  }
  const lower = position.toLowerCase();
  if (lower.includes('goalkeeper') || lower.includes('gk') || lower.includes('вратарь')) {
    return 'goalkeeper';
  }
  if (lower.includes('defender') || lower.includes('защитник') || lower.includes('defence')) {
    return 'defender';
  }
  if (lower.includes('midfielder') || lower.includes('полузащитник') || lower.includes('midfield')) {
    return 'midfielder';
  }
  return 'forward';
};

/**
 * Transform CMS player to PlayerItem
 */
const transformCMSPlayer = (player: CMSPlayersResponse['data'][0]): PlayerItem => {
  const stats = player.currentSeasonStats;

  return {
    id: player.id,
    name: player.displayName,
    firstName: player.firstName,
    lastName: player.lastName,
    slug: player.slug,
    number: player.jerseyNumber,
    photoUrl: player.photo,
    position: player.position || (player.isGoalkeeper ? 'Goalkeeper' : 'Midfielder'),
    positionKey: mapPositionKey(player.position, player.isGoalkeeper),
    nationality: player.nationality,
    dateOfBirth: player.dateOfBirth,
    height: player.height,
    weight: player.weight,
    status: (player.status || 'active') as PlayerItem['status'],
    stats: stats ? {
      appearances: stats.appearances ?? stats.games_played ?? 0,
      goals: stats.goals ?? 0,
      assists: stats.assists ?? 0,
      yellowCards: stats.yellowCards ?? stats.yellow_cards ?? 0,
      redCards: stats.redCards ?? stats.red_cards ?? 0,
      minutesPlayed: stats.minutesPlayed ?? stats.minutes_played ?? 0,
      cleanSheets: stats.cleanSheets ?? stats.clean_sheets ?? 0,
      // V2 данные для радарной диаграммы
      shots: stats.shots ?? stats.shot ?? 0,
      shotsOnGoal: stats.shotsOnGoal ?? stats.shots_on_goal ?? 0,
      passes: stats.passes ?? stats.pass ?? 0,
      duels: stats.duels ?? stats.duel ?? 0,
      tackles: stats.tackles ?? stats.tackle ?? 0,
    } : undefined,
  };
};

/**
 * Fetch team players from CMS
 */
const fetchTeamPlayers = async (): Promise<PlayerItem[]> => {
  const response = await cmsClient.get<CMSPlayersResponse>('/public/players', {
    params: { limit: 100 },
  });

  if (!response.data.success) {
    throw new Error('Failed to fetch players from CMS');
  }

  return response.data.data.map(transformCMSPlayer);
};

/**
 * Fetch hero player from CMS
 */
const fetchHeroPlayer = async (): Promise<PlayerItem | null> => {
  try {
    const response = await cmsClient.get<CMSPlayerResponse>('/public/players/hero');

    if (!response.data.success || !response.data.data) {
      return null;
    }

    return transformCMSPlayer(response.data.data);
  } catch {
    return null;
  }
};

/**
 * Fetch player by slug from CMS
 */
const fetchPlayerBySlug = async (slug: string): Promise<PlayerItem | null> => {
  try {
    const response = await cmsClient.get<CMSPlayerResponse>(`/public/players/${slug}`);

    if (!response.data.success || !response.data.data) {
      return null;
    }

    return transformCMSPlayer(response.data.data);
  } catch {
    return null;
  }
};

/**
 * Hook to fetch single player statistics
 * Now uses CMS data which already includes currentSeasonStats
 */
export const useSotaPlayerStats = (
  playerId: string,
  _seasonId?: number
) => {
  return useQuery({
    queryKey: ['player-stats', playerId],
    queryFn: async () => {
      // Find player in team list (CMS already has stats)
      const players = await fetchTeamPlayers();
      const player = players.find(p => p.id === playerId);

      if (!player) {
        return null;
      }

      return {
        result: 'Success' as const,
        data: {
          first_name: player.firstName || '',
          last_name: player.lastName || '',
          stats: player.stats ? [
            { name: 'Matches', key: 'games_played', value: player.stats.appearances ?? 0 },
            { name: 'Goals', key: 'goal', value: player.stats.goals ?? 0 },
            { name: 'Assists', key: 'goal_pass', value: player.stats.assists ?? 0 },
            { name: 'Yellow Cards', key: 'yellow_cards', value: player.stats.yellowCards ?? 0 },
            { name: 'Red Cards', key: 'red_cards', value: player.stats.redCards ?? 0 },
            { name: 'Minutes Played', key: 'time_on_field_total', value: player.stats.minutesPlayed ?? 0 },
            { name: 'Clean Sheets', key: 'clean_sheet', value: player.stats.cleanSheets ?? 0 },
          ] : [],
        },
      };
    },
    enabled: !!playerId,
    staleTime: 1000 * 60 * 1, // 1 minute for development
  });
};

/**
 * Hook to fetch player by slug from CMS
 */
export const usePlayerBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['player', 'slug', slug],
    queryFn: () => fetchPlayerBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 1, // 1 minute for development
    gcTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to fetch hero player (for landing page)
 */
export const useHeroPlayer = () => {
  return useQuery({
    queryKey: ['player', 'hero'],
    queryFn: fetchHeroPlayer,
    staleTime: 1000 * 60 * 1, // 1 minute for development
    gcTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to fetch all team players (for team page)
 */
export const useTeamPlayers = () => {
  return useQuery({
    queryKey: ['cms', 'players', 'team'],
    queryFn: fetchTeamPlayers,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
