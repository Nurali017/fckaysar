/**
 * React Query hooks for teams data
 * Uses CMS league-table endpoint which includes team data
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { cmsClient } from '@/api/cms/cms-client';

/**
 * Team type from CMS league table
 */
export interface Team {
  id: number;
  name: string;
  logo?: string;
  isKaisar: boolean;
}

/**
 * CMS League Table response type
 */
interface CMSLeagueTableResponse {
  success: boolean;
  seasonId: number;
  total: number;
  standings: Array<{
    position: number;
    teamId: number;
    teamName: string;
    teamLogo?: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    isKaisar: boolean;
  }>;
  lastSync: string | null;
}

/**
 * Fetch teams from league table
 */
const fetchTeams = async (): Promise<Team[]> => {
  const response = await cmsClient.get<CMSLeagueTableResponse>('/league-table');

  if (!response.data.success) {
    throw new Error('Failed to fetch teams from CMS');
  }

  return response.data.standings.map((team) => ({
    id: team.teamId,
    name: team.teamName,
    logo: team.teamLogo,
    isKaisar: team.isKaisar,
  }));
};

/**
 * Hook to get all teams
 */
export const useTeams = (): UseQueryResult<Team[], Error> => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
    staleTime: 60 * 60 * 1000, // 1 hour (teams data doesn't change often)
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
};

/**
 * Hook to get a specific team
 */
export const useTeam = (
  teamId?: number
): UseQueryResult<Team | null, Error> => {
  const teamsQuery = useTeams();

  return {
    ...teamsQuery,
    data: teamsQuery.data?.find(t => t.id === teamId) || null,
  } as UseQueryResult<Team | null, Error>;
};

/**
 * Hook to search teams
 */
export const useTeamsSearch = (
  query: string
): UseQueryResult<Team[], Error> => {
  const teamsQuery = useTeams();

  return {
    ...teamsQuery,
    data: teamsQuery.data?.filter(t =>
      t.name.toLowerCase().includes(query.toLowerCase())
    ) || [],
  } as UseQueryResult<Team[], Error>;
};
