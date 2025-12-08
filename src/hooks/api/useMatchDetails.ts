/**
 * React Query hooks for match details data
 * Uses CMS API instead of direct SOTA calls
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { format, parseISO, isValid } from 'date-fns';
import { kk, ru, enUS } from 'date-fns/locale';
import { cmsClient } from '@/api/cms/cms-client';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';
import type {
  MatchDetails,
  PreGameLineupResponse,
  MatchPlayer,
  TeamMatchStats,
  MatchReferees,
  LineupPlayer,
} from '@/api/types/match-details-types';

// In development, use relative paths (Vite proxy handles them)
// In production, use full CMS URL
const isDev = import.meta.env.DEV;
const CMS_MEDIA_URL = isDev ? '' : (env.VITE_CMS_BASE_URL || 'http://localhost:3000');

/**
 * Convert relative logo path to full URL
 */
const getFullLogoUrl = (logoPath: string | null | undefined): string => {
  if (!logoPath) return '';

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
 * CMS Match Detail response type
 */
interface CMSMatchDetailResponse {
  success: boolean;
  data: {
    id: string;
    date: string;
    tour: number;
    status: 'scheduled' | 'live' | 'finished';
    hasStats: boolean;
    homeTeam: {
      id: number;
      name: string;
      shortName?: string;
      logo?: string;
      score?: number;
      brandColor?: string;
    };
    awayTeam: {
      id: number;
      name: string;
      shortName?: string;
      logo?: string;
      score?: number;
      brandColor?: string;
    };
    competition?: string;
    venue?: string;
    visitors?: number;
    teamStats?: {
      home: {
        possession?: number;
        shots?: number;
        shotsOnGoal?: number;
        shotsOffGoal?: number;
        passes?: number;
        fouls?: number;
        corners?: number;
        offsides?: number;
        yellowCards?: number;
        redCards?: number;
      };
      away: {
        possession?: number;
        shots?: number;
        shotsOnGoal?: number;
        shotsOffGoal?: number;
        passes?: number;
        fouls?: number;
        corners?: number;
        offsides?: number;
        yellowCards?: number;
        redCards?: number;
      };
    };
    referees?: {
      main?: string;
      firstAssistant?: string;
      secondAssistant?: string;
      fourthReferee?: string;
      var?: string;
      varAssistant?: string;
    };
    homeLineup?: Array<{
      playerId: string;
      number: number;
      fullName: string;
      lastName: string;
      isGk: boolean;
      isCaptain: boolean;
      photo?: string;
    }>;
    awayLineup?: Array<{
      playerId: string;
      number: number;
      fullName: string;
      lastName: string;
      isGk: boolean;
      isCaptain: boolean;
      photo?: string;
    }>;
    homeCoach?: { name: string; photo?: string };
    awayCoach?: { name: string; photo?: string };
    homePlayers?: Array<{
      playerId: string;
      name: string;
      number: number;
      shots?: number;
      shotsOnGoal?: number;
      passes?: number;
      fouls?: number;
      yellowCards?: number;
      redCards?: number;
      duels?: number;
      tackles?: number;
      offsides?: number;
      corners?: number;
    }>;
    awayPlayers?: Array<{
      playerId: string;
      name: string;
      number: number;
      shots?: number;
      shotsOnGoal?: number;
      passes?: number;
      fouls?: number;
      yellowCards?: number;
      redCards?: number;
      duels?: number;
      tackles?: number;
      offsides?: number;
      corners?: number;
    }>;
  };
  meta: {
    lastSync: string | null;
  };
}

/**
 * Get date-fns locale by language code
 */
const getDateLocale = (lang: string) => {
  switch (lang) {
    case 'kk': return kk;
    case 'ru': return ru;
    case 'en': return enUS;
    default: return ru;
  }
};

/**
 * Transform CMS lineup to app format
 */
const transformLineup = (
  cmsLineup?: CMSMatchDetailResponse['data']['homeLineup']
): LineupPlayer[] => {
  if (!cmsLineup) return [];

  return cmsLineup.map((player) => ({
    id: player.playerId,
    number: player.number,
    full_name: player.fullName,
    last_name: player.lastName,
    is_gk: player.isGk,
    is_captain: player.isCaptain,
    bas_image_path: player.photo || null,
  }));
};

/**
 * Transform CMS referees to app format
 */
const transformReferees = (
  refs?: CMSMatchDetailResponse['data']['referees']
): MatchReferees | undefined => {
  if (!refs) return undefined;

  return {
    main: refs.main || '',
    '1st_assistant': refs.firstAssistant || '',
    '2nd_assistant': refs.secondAssistant || '',
    '4th_referee': refs.fourthReferee || '',
    video_assistant_1: refs.varAssistant || '',
    video_assistant_main: refs.var || '',
    match_inspector: '',
  };
};

/**
 * Transform CMS team stats to app format
 */
const transformTeamStats = (
  cmsStats?: CMSMatchDetailResponse['data']['teamStats']
): { home: TeamMatchStats; away: TeamMatchStats } | undefined => {
  if (!cmsStats) return undefined;

  return {
    home: {
      possession: cmsStats.home.possession || 0,
      shot: cmsStats.home.shots || 0,
      shots_on_goal: cmsStats.home.shotsOnGoal || 0,
      shots_off_goal: cmsStats.home.shotsOffGoal || 0,
      foul: cmsStats.home.fouls || 0,
      yellow_cards: cmsStats.home.yellowCards || 0,
      red_cards: cmsStats.home.redCards || 0,
      pass: cmsStats.home.passes || 0,
      offside: cmsStats.home.offsides || 0,
      corner: cmsStats.home.corners || 0,
    },
    away: {
      possession: cmsStats.away.possession || 0,
      shot: cmsStats.away.shots || 0,
      shots_on_goal: cmsStats.away.shotsOnGoal || 0,
      shots_off_goal: cmsStats.away.shotsOffGoal || 0,
      foul: cmsStats.away.fouls || 0,
      yellow_cards: cmsStats.away.yellowCards || 0,
      red_cards: cmsStats.away.redCards || 0,
      pass: cmsStats.away.passes || 0,
      offside: cmsStats.away.offsides || 0,
      corner: cmsStats.away.corners || 0,
    },
  };
};

/**
 * Transform CMS player stats to app format
 */
const transformPlayerStats = (
  homePlayers?: CMSMatchDetailResponse['data']['homePlayers'],
  awayPlayers?: CMSMatchDetailResponse['data']['awayPlayers'],
  homeTeamName?: string,
  awayTeamName?: string
): MatchPlayer[] | undefined => {
  const result: MatchPlayer[] = [];

  homePlayers?.forEach((player) => {
    result.push({
      id: player.playerId,
      team: homeTeamName || '',
      number: player.number,
      first_name: player.name.split(' ')[0] || '',
      last_name: player.name.split(' ').slice(1).join(' ') || '',
      stats: {
        shot: player.shots || 0,
        shots_on_goal: player.shotsOnGoal || 0,
        shots_off_goal: (player.shots || 0) - (player.shotsOnGoal || 0),
        foul: player.fouls || 0,
        yellow_cards: player.yellowCards || 0,
        red_cards: player.redCards || 0,
        pass: player.passes || 0,
        offside: player.offsides || 0,
        corner: player.corners || 0,
        duel: player.duels || 0,
        tackle: player.tackles || 0,
      },
    });
  });

  awayPlayers?.forEach((player) => {
    result.push({
      id: player.playerId,
      team: awayTeamName || '',
      number: player.number,
      first_name: player.name.split(' ')[0] || '',
      last_name: player.name.split(' ').slice(1).join(' ') || '',
      stats: {
        shot: player.shots || 0,
        shots_on_goal: player.shotsOnGoal || 0,
        shots_off_goal: (player.shots || 0) - (player.shotsOnGoal || 0),
        foul: player.fouls || 0,
        yellow_cards: player.yellowCards || 0,
        red_cards: player.redCards || 0,
        pass: player.passes || 0,
        offside: player.offsides || 0,
        corner: player.corners || 0,
        duel: player.duels || 0,
        tackle: player.tackles || 0,
      },
    });
  });

  return result.length > 0 ? result : undefined;
};

/**
 * Transform CMS response to MatchDetails
 */
const transformCMSMatchDetail = (
  data: CMSMatchDetailResponse['data'],
  locale: string
): MatchDetails => {
  try {
    const dateLocale = getDateLocale(locale);
    const gameDate = parseISO(data.date);

    // Validate date
    if (!isValid(gameDate)) {
      logger.warn('[Match] Invalid date in CMS data, using fallback', { date: data.date, matchId: data.id });
    }

    const status: 'upcoming' | 'live' | 'finished' =
      data.status === 'scheduled' ? 'upcoming' : data.status;

  // Build lineup if available
  let lineup: PreGameLineupResponse | undefined;
  if (data.homeLineup || data.awayLineup) {
    lineup = {
      date: data.date,
      referees: transformReferees(data.referees) || {
        main: '',
        '1st_assistant': '',
        '2nd_assistant': '',
        '4th_referee': '',
        video_assistant_1: '',
        video_assistant_main: '',
        match_inspector: '',
      },
      home_team: {
        id: String(data.homeTeam.id ?? ''),
        name: data.homeTeam.name,
        short_name: data.homeTeam.shortName || data.homeTeam.name?.slice(0, 3).toUpperCase() || '',
        bas_logo_path: getFullLogoUrl(data.homeTeam.logo) || null,
        brand_color: data.homeTeam.brandColor || '#dc2626',
        coach: data.homeCoach
          ? {
              first_name: data.homeCoach.name.split(' ')[0] || '',
              last_name: [data.homeCoach.name.split(' ').slice(1).join(' ') || ''],
            }
          : { first_name: '', last_name: [''] },
        first_assistant: { first_name: '', last_name: '' },
        second_assistant: { first_name: '', last_name: '' },
        lineup: transformLineup(data.homeLineup),
      },
      away_team: {
        id: String(data.awayTeam.id ?? ''),
        name: data.awayTeam.name,
        short_name: data.awayTeam.shortName || data.awayTeam.name?.slice(0, 3).toUpperCase() || '',
        bas_logo_path: getFullLogoUrl(data.awayTeam.logo) || null,
        brand_color: data.awayTeam.brandColor || '#3b82f6',
        coach: data.awayCoach
          ? {
              first_name: data.awayCoach.name.split(' ')[0] || '',
              last_name: [data.awayCoach.name.split(' ').slice(1).join(' ') || ''],
            }
          : { first_name: '', last_name: [''] },
        first_assistant: { first_name: '', last_name: '' },
        second_assistant: { first_name: '', last_name: '' },
        lineup: transformLineup(data.awayLineup),
      },
    };
  }

    // Format date safely
    const formattedDate = isValid(gameDate)
      ? format(gameDate, 'd MMMM yyyy', { locale: dateLocale })
      : data.date || 'TBD';

    return {
      id: data.id,
      date: formattedDate,
      time: status === 'finished' ? 'FT' : status === 'live' ? 'LIVE' : 'TBD',
      stadium: data.venue || `Тур ${data.tour}`,
      competition: data.competition || 'Премьер-Лига',
      tour: data.tour,
      status,
      hasStats: data.hasStats,
      homeTeam: {
        id: data.homeTeam.id,
        name: data.homeTeam.name,
        shortName: data.homeTeam.shortName || data.homeTeam.name.slice(0, 3).toUpperCase(),
        logo: getFullLogoUrl(data.homeTeam.logo),
        score: data.homeTeam.score,
        brandColor: data.homeTeam.brandColor || '#dc2626',
      },
      awayTeam: {
        id: data.awayTeam.id,
        name: data.awayTeam.name,
        shortName: data.awayTeam.shortName || data.awayTeam.name.slice(0, 3).toUpperCase(),
        logo: getFullLogoUrl(data.awayTeam.logo),
        score: data.awayTeam.score,
        brandColor: data.awayTeam.brandColor || '#3b82f6',
      },
      lineup,
      playerStats: transformPlayerStats(
        data.homePlayers,
        data.awayPlayers,
        data.homeTeam.name,
        data.awayTeam.name
      ),
      teamStats: transformTeamStats(data.teamStats),
      referees: transformReferees(data.referees),
    };
  } catch (error) {
    logger.error('[Match] Transform error', { error, matchId: data.id, date: data.date });
    throw error;
  }
};

/**
 * Fetch match details from CMS
 */
const fetchMatchDetails = async (matchId: string): Promise<CMSMatchDetailResponse['data'] | null> => {
  try {
    const response = await cmsClient.get<CMSMatchDetailResponse>(`/matches/${matchId}`);

    if (!response.data.success) {
      logger.warn('[Match] CMS returned unsuccessful response', { matchId });
      return null;
    }

    return response.data.data;
  } catch (error) {
    logger.error('[Match] Failed to fetch from CMS', { matchId, error });
    throw error;
  }
};

/**
 * Main hook for match details page
 */
export const useMatchDetails = (
  matchId: string | undefined
): UseQueryResult<MatchDetails | null, Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['match', 'details', matchId, i18n.language],
    queryFn: async () => {
      if (!matchId) return null;

      logger.info('[Match] Fetching match details from CMS...', { matchId });
      const data = await fetchMatchDetails(matchId);

      if (!data) {
        logger.warn('[Match] Match not found in CMS', { matchId });
        return null;
      }

      // Transform data first
      const result = transformCMSMatchDetail(data, i18n.language);

      // Log success AFTER transformation completed
      logger.info('[Match] Successfully loaded and transformed', {
        matchId,
        hasLineup: !!result.lineup?.home_team?.lineup?.length,
        hasStats: !!result.teamStats,
      });

      return result;
    },
    enabled: !!matchId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get lineup data (uses same cache as useMatchDetails)
 */
export const useMatchLineup = (
  matchId: string | undefined
): UseQueryResult<PreGameLineupResponse | null, Error> => {
  const matchDetails = useMatchDetails(matchId);

  return {
    ...matchDetails,
    data: matchDetails.data?.lineup || null,
  } as UseQueryResult<PreGameLineupResponse | null, Error>;
};

/**
 * Hook to get team stats (uses same cache as useMatchDetails)
 */
export const useMatchTeamStats = (
  matchId: string | undefined
): UseQueryResult<{ home: TeamMatchStats; away: TeamMatchStats } | null, Error> => {
  const matchDetails = useMatchDetails(matchId);

  return {
    ...matchDetails,
    data: matchDetails.data?.teamStats || null,
  } as UseQueryResult<{ home: TeamMatchStats; away: TeamMatchStats } | null, Error>;
};

/**
 * Hook to get player stats (uses same cache as useMatchDetails)
 */
export const useMatchPlayerStats = (
  matchId: string | undefined
): UseQueryResult<MatchPlayer[] | null, Error> => {
  const matchDetails = useMatchDetails(matchId);

  return {
    ...matchDetails,
    data: matchDetails.data?.playerStats || null,
  } as UseQueryResult<MatchPlayer[] | null, Error>;
};
