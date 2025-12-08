/**
 * React Query Hook for Team Statistics
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import {
  getProcessedTeamStats,
  getTeamSeasonStats,
  KAISAR_TEAM_ID,
  CURRENT_SEASON_ID,
} from '@/api/services/team-stats-service';
import type { ProcessedTeamStats, TeamSeasonStats } from '@/api/types/team-stats-types'
import { useTeamMatches } from './useGames'

interface TeamStatsParams {
  season_id?: number
}

/**
 * Hook to fetch processed team statistics with computed metrics
 */
export const useTeamStats = (
  teamId: number = KAISAR_TEAM_ID,
  params: TeamStatsParams = { season_id: CURRENT_SEASON_ID }
): UseQueryResult<ProcessedTeamStats, Error> => {
  return useQuery({
    queryKey: ['team-stats', 'processed', teamId, params.season_id],
    queryFn: () => getProcessedTeamStats(teamId, params),
    staleTime: 30 * 60 * 1000, // 30 minutes - stats don't change frequently
    gcTime: 60 * 60 * 1000, // 1 hour cache
    retry: 2,
  })
}

/**
 * Hook to fetch raw team statistics without processing
 */
export const useRawTeamStats = (
  teamId: number = KAISAR_TEAM_ID,
  params: TeamStatsParams = { season_id: CURRENT_SEASON_ID }
): UseQueryResult<TeamSeasonStats, Error> => {
  return useQuery({
    queryKey: ['team-stats', 'raw', teamId, params.season_id],
    queryFn: () => getTeamSeasonStats(teamId, params),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
  })
}

/**
 * Hook to fetch team statistics with form (last 5 matches results)
 * Combines stats API with matches API to get complete picture
 */
export const useTeamStatsWithForm = (
  teamId: number = KAISAR_TEAM_ID,
  params: TeamStatsParams = { season_id: CURRENT_SEASON_ID }
) => {
  const statsQuery = useTeamStats(teamId, params);
  const matchesQuery = useTeamMatches(teamId);

  // Calculate form from finished matches
  const form: ('W' | 'D' | 'L')[] = [];

  if (matchesQuery.data) {
    const finishedMatches = matchesQuery.data
      .filter(match => match.status === 'finished')
      .slice(0, 5);

    finishedMatches.forEach(match => {
      const isKaysarHome =
        match.homeTeam.name.includes('Кайсар') ||
        match.homeTeam.name.includes('Kaysar') ||
        match.homeTeam.name.includes('Kaisar');

      const homeScore = match.homeTeam.score ?? 0;
      const awayScore = match.awayTeam.score ?? 0;

      if (isKaysarHome) {
        if (homeScore > awayScore) form.push('W');
        else if (homeScore < awayScore) form.push('L');
        else form.push('D');
      } else {
        if (awayScore > homeScore) form.push('W');
        else if (awayScore < homeScore) form.push('L');
        else form.push('D');
      }
    });
  }

  // Combine stats with form
  const data: ProcessedTeamStats | undefined = statsQuery.data
    ? { ...statsQuery.data, form }
    : undefined;

  return {
    data,
    isLoading: statsQuery.isLoading || matchesQuery.isLoading,
    error: statsQuery.error || matchesQuery.error,
    isError: statsQuery.isError || matchesQuery.isError,
    refetch: () => {
      statsQuery.refetch();
      matchesQuery.refetch();
    },
  };
};
