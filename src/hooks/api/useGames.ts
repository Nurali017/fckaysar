/**
 * React Query hooks for games/matches data
 * Uses CMS API instead of direct SOTA calls
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { kk, ru, enUS } from 'date-fns/locale';
import { cmsClient } from '@/api/cms/cms-client';
import type { Match } from '@/types';
import { getTeamLogo, FC_KAISAR_TEAM_ID } from '@/data/teamLogos';
import { env } from '@/lib/env';

// In development, use relative paths (Vite proxy handles them)
// In production, use full CMS URL from env
const isDev = import.meta.env.DEV;
const CMS_MEDIA_URL = isDev ? '' : env.VITE_CMS_BASE_URL;

/**
 * CMS Match response type
 */
interface CMSMatch {
  id: string;
  date: string;
  tour: number;
  status: 'scheduled' | 'live' | 'finished';
  hasStats: boolean;
  homeTeam: {
    id: number;
    name: string;
    logo?: string;
    score?: number;
  };
  awayTeam: {
    id: number;
    name: string;
    logo?: string;
    score?: number;
  };
  competition?: string;
  venue?: string;
  visitors?: number;
}

interface CMSMatchesResponse {
  success: boolean;
  data: CMSMatch[];
  meta: {
    totalDocs: number;
    totalPages: number;
    page: number;
    limit: number;
    seasonId: number;
    lastSync: string | null;
  };
}

/**
 * Get date-fns locale by language code
 */
const getDateLocale = (lang: string) => {
  switch (lang) {
    case 'kk':
      return kk;
    case 'ru':
      return ru;
    case 'en':
      return enUS;
    default:
      return ru;
  }
};

/**
 * Map CMS status to frontend status
 */
const mapStatus = (status: CMSMatch['status']): Match['status'] => {
  if (status === 'scheduled') return 'upcoming';
  return status;
};

/**
 * Check if logo URL is valid (not a Windows path)
 */
const isValidLogoUrl = (url?: string): boolean => {
  if (!url) return false;
  return url.startsWith('http') || url.startsWith('/');
};

/**
 * Convert relative logo path to full URL
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

/**
 * Transform CMS match to frontend Match type
 */
const transformCMSMatch = (match: CMSMatch, locale: string): Match => {
  const dateLocale = getDateLocale(locale);
  const gameDate = parseISO(match.date);
  const status = mapStatus(match.status);

  // Format date
  const formattedDate = format(gameDate, 'd MMMM', { locale: dateLocale });

  // Get time display based on status
  const getTimeDisplay = () => {
    switch (status) {
      case 'finished':
        return 'FT';
      case 'live':
        return 'LIVE';
      default:
        return 'TBD';
    }
  };

  return {
    id: match.id,
    homeTeam: {
      name: match.homeTeam.name,
      logo: isValidLogoUrl(match.homeTeam.logo)
        ? getFullLogoUrl(match.homeTeam.logo!)
        : getTeamLogo(0, match.homeTeam.name),
      score: match.homeTeam.score,
    },
    awayTeam: {
      name: match.awayTeam.name,
      logo: isValidLogoUrl(match.awayTeam.logo)
        ? getFullLogoUrl(match.awayTeam.logo!)
        : getTeamLogo(0, match.awayTeam.name),
      score: match.awayTeam.score,
    },
    date: formattedDate,
    time: getTimeDisplay(),
    stadium: match.venue || `Тур ${match.tour}`,
    league: match.competition || 'Премьер-Лига',
    status,
  };
};

/**
 * Fetch matches from CMS
 */
const fetchMatches = async (params?: {
  status?: 'scheduled' | 'live' | 'finished';
  limit?: number;
  page?: number;
  teamId?: number;
}): Promise<CMSMatch[]> => {
  const response = await cmsClient.get<CMSMatchesResponse>('/matches', {
    params: {
      status: params?.status,
      limit: params?.limit || 50,
      page: params?.page || 1,
      teamId: params?.teamId,
    },
  });

  if (!response.data.success) {
    throw new Error('Failed to fetch matches from CMS');
  }

  return response.data.data;
};

/**
 * Hook to get upcoming matches
 */
export const useUpcomingMatches = (
  teamId: number = FC_KAISAR_TEAM_ID,
  limit: number = 10
): UseQueryResult<Match[], Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['matches', 'upcoming', teamId, limit, i18n.language],
    queryFn: async () => {
      const matches = await fetchMatches({ status: 'scheduled', limit, teamId });
      // Sort by date ascending (nearest first)
      const sorted = [...matches].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      return sorted.map(match => transformCMSMatch(match, i18n.language));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get finished matches
 */
export const useFinishedMatches = (
  teamId: number = FC_KAISAR_TEAM_ID,
  limit: number = 10
): UseQueryResult<Match[], Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['matches', 'finished', teamId, limit, i18n.language],
    queryFn: async () => {
      const matches = await fetchMatches({ status: 'finished', limit, teamId });
      // Sort by date descending (most recent first)
      const sorted = [...matches].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return sorted.map(match => transformCMSMatch(match, i18n.language));
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes
  });
};

/**
 * Hook to get all matches for a team
 */
export const useTeamMatches = (
  teamId: number = FC_KAISAR_TEAM_ID,
  limit?: number
): UseQueryResult<Match[], Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['matches', 'all', teamId, limit, i18n.language],
    queryFn: async () => {
      const matches = await fetchMatches({ limit: limit || 50, teamId });
      return matches.map(match => transformCMSMatch(match, i18n.language));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
