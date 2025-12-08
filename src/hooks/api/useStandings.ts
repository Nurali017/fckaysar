/**
 * React Query hooks for league standings
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getCurrentSeasonStandings, type TeamStanding } from '@/api/services/standings-service';

/**
 * Get current season league standings
 */
export const useLeagueStandings = (): UseQueryResult<TeamStanding[], Error> => {
  return useQuery({
    queryKey: ['standings', 'current-season'],
    queryFn: getCurrentSeasonStandings,
    staleTime: 30 * 60 * 1000, // 30 minutes - standings don't change often
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
};
