/**
 * React Query hook for team logos
 * Uses CMS league-table endpoint which includes team logos
 */

import { useQuery } from '@tanstack/react-query';
import { cmsClient } from '@/api/cms/cms-client';

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
 * Fetch team logos from league table
 */
const fetchTeamLogos = async (): Promise<Map<number, string>> => {
  const response = await cmsClient.get<CMSLeagueTableResponse>('/league-table');

  if (!response.data.success) {
    throw new Error('Failed to fetch league table from CMS');
  }

  const logosMap = new Map<number, string>();

  response.data.standings.forEach((team) => {
    if (team.teamLogo) {
      logosMap.set(team.teamId, team.teamLogo);
    }
  });

  return logosMap;
};

/**
 * Hook to get all team logos
 */
export const useTeamLogos = () => {
  return useQuery({
    queryKey: ['team-logos'],
    queryFn: fetchTeamLogos,
    staleTime: 60 * 60 * 1000, // 1 hour - logos rarely change
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Hook to get a single team logo
 */
export const useTeamLogo = (teamId: number) => {
  const { data: logosMap } = useTeamLogos();
  return logosMap?.get(teamId) || null;
};
