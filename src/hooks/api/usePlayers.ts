/**
 * React Query hooks for CMS players data
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  fetchPlayers,
  fetchPlayersByPosition,
  fetchPlayerBySlug,
  fetchPlayerById,
  type PlayerItem,
} from '@/api/cms';

/**
 * Hook to get all players
 */
export const usePlayers = (
  page: number = 1,
  limit: number = 50
): UseQueryResult<{
  players: PlayerItem[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}, Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'players', 'list', page, limit, i18n.language],
    queryFn: () => fetchPlayers({ page, limit }),
    staleTime: 30 * 60 * 1000, // 30 minutes (players don't change often)
    gcTime: 60 * 60 * 1000, // 60 minutes
  });
};

/**
 * Hook to get players by position
 */
export const usePlayersByPosition = (
  position: 'goalkeeper' | 'defender' | 'midfielder' | 'forward'
): UseQueryResult<PlayerItem[], Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'players', 'position', position, i18n.language],
    queryFn: () => fetchPlayersByPosition(position),
    enabled: !!position,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

/**
 * Hook to get player by slug
 */
export const usePlayerBySlug = (slug: string): UseQueryResult<PlayerItem | null, Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'players', 'slug', slug, i18n.language],
    queryFn: () => fetchPlayerBySlug(slug),
    enabled: !!slug,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

/**
 * Hook to get player by ID
 */
export const usePlayerById = (id: string): UseQueryResult<PlayerItem | null, Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'players', 'id', id, i18n.language],
    queryFn: () => fetchPlayerById(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

/**
 * Hook to get all players grouped by position
 */
export const usePlayersGroupedByPosition = (): UseQueryResult<{
  goalkeepers: PlayerItem[];
  defenders: PlayerItem[];
  midfielders: PlayerItem[];
  forwards: PlayerItem[];
}, Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'players', 'grouped', i18n.language],
    queryFn: async () => {
      const { players } = await fetchPlayers({ limit: 100 });
      return {
        goalkeepers: players.filter((p) => p.positionKey === 'goalkeeper'),
        defenders: players.filter((p) => p.positionKey === 'defender'),
        midfielders: players.filter((p) => p.positionKey === 'midfielder'),
        forwards: players.filter((p) => p.positionKey === 'forward'),
      };
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};
