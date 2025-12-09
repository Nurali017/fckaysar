/**
 * Standings Service - Fetches league standings from CMS
 */

import { cmsClient } from '../cms/cms-client';
import { env } from '@/lib/env';

const SEASON_ID = 61; // Premier League 2025

// In development, use relative paths (Vite proxy handles them)
// In production, use full CMS URL from env
const isDev = import.meta.env.DEV;
const CMS_MEDIA_URL = isDev ? '' : env.VITE_CMS_BASE_URL;

/**
 * Helper function to get full logo URL
 */
const getFullLogoUrl = (logoPath: string): string => {
  // If already a full URL, return as-is
  if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
    // In dev, convert absolute CMS URLs to relative for proxy
    if (isDev && logoPath.includes('localhost:3000')) {
      return logoPath.replace('http://localhost:3000', '');
    }
    return logoPath;
  }

  // In dev, return relative path (Vite proxy handles it)
  // In prod, prepend CMS base URL
  return `${CMS_MEDIA_URL}${logoPath.startsWith('/') ? '' : '/'}${logoPath}`;
};

export interface TeamStanding {
  rank: number;
  teamId: number;
  teamName: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  isKaisar?: boolean;
}

/**
 * CMS League Table Response type
 */
interface CMSLeagueTableResponse {
  success: boolean;
  seasonId: number;
  total: number;
  standings: Array<{
    teamId: number;
    teamName: string;
    teamLogo: string;
    position: number;
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
 * Get current season standings from CMS
 */
export const getCurrentSeasonStandings = async (): Promise<TeamStanding[]> => {
  const response = await cmsClient.get<CMSLeagueTableResponse>('/league-table', {
    params: { seasonId: SEASON_ID },
  });

  if (!response.data.success) {
    throw new Error('Failed to fetch league table from CMS');
  }

  return response.data.standings.map(team => ({
    rank: team.position,
    teamId: team.teamId,
    teamName: team.teamName,
    logo: getFullLogoUrl(team.teamLogo),
    played: team.played,
    won: team.won,
    drawn: team.drawn,
    lost: team.lost,
    goalsFor: team.goalsFor,
    goalsAgainst: team.goalsAgainst,
    goalDifference: team.goalDifference,
    points: team.points,
    isKaisar: team.isKaisar,
  }));
};

/**
 * Get league standings for a specific season
 */
export const getLeagueStandings = async (seasonId: number = SEASON_ID): Promise<TeamStanding[]> => {
  const response = await cmsClient.get<CMSLeagueTableResponse>('/league-table', {
    params: { seasonId },
  });

  if (!response.data.success) {
    throw new Error('Failed to fetch league table from CMS');
  }

  return response.data.standings.map(team => ({
    rank: team.position,
    teamId: team.teamId,
    teamName: team.teamName,
    logo: getFullLogoUrl(team.teamLogo),
    played: team.played,
    won: team.won,
    drawn: team.drawn,
    lost: team.lost,
    goalsFor: team.goalsFor,
    goalsAgainst: team.goalsAgainst,
    goalDifference: team.goalDifference,
    points: team.points,
    isKaisar: team.isKaisar,
  }));
};

export { SEASON_ID };
