/**
 * Match Service - Fetch match data from CMS
 */

import { format, parseISO } from 'date-fns';
import { kk, ru, enUS } from 'date-fns/locale';
import cmsApiClient from './cms-client';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';
import type {
  CMSMatch,
  CMSPaginatedResponse,
  CMSQueryParams,
} from './types';
import type {
  MatchDetails,
  PreGameLineupResponse,
  MatchReferees,
  LineupPlayer,
  MatchPlayer,
  TeamMatchStats,
} from '@/api/types/match-details-types';

const COLLECTION = 'matches';

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
 * Transform CMS lineup to SOTA format
 */
const transformLineup = (
  cmsLineup?: Array<{
    playerId: string;
    number: number;
    fullName: string;
    lastName: string;
    isGk: boolean;
    isCaptain: boolean;
    photo?: string;
  }>
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
 * Transform CMS referees to SOTA format
 */
const transformReferees = (cmsReferees?: CMSMatch['referees']): MatchReferees | undefined => {
  if (!cmsReferees) return undefined;

  return {
    main: cmsReferees.main || '',
    '1st_assistant': cmsReferees.firstAssistant || '',
    '2nd_assistant': cmsReferees.secondAssistant || '',
    '4th_referee': cmsReferees.fourthReferee || '',
    video_assistant_1: cmsReferees.varAssistant || '',
    video_assistant_main: cmsReferees.var || '',
    match_inspector: '',
  };
};

/**
 * Transform CMS player stats to SOTA format
 */
const transformPlayerStats = (
  homePlayers?: CMSMatch['homePlayers'],
  awayPlayers?: CMSMatch['awayPlayers'],
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
 * Transform CMS team stats to SOTA format
 */
const transformTeamStats = (
  cmsStats?: CMSMatch['teamStats']
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
 * Transform CMS match to MatchDetails format
 */
const transformMatch = (cmsMatch: CMSMatch, language: string): MatchDetails => {
  const dateLocale = getDateLocale(language);
  const gameDate = parseISO(cmsMatch.matchDate);

  // Map status
  const status: 'upcoming' | 'live' | 'finished' =
    cmsMatch.status === 'scheduled' ? 'upcoming' : cmsMatch.status;

  // Build lineup if available
  let lineup: PreGameLineupResponse | undefined;
  if (cmsMatch.homeLineup || cmsMatch.awayLineup) {
    lineup = {
      date: cmsMatch.matchDate,
      referees: transformReferees(cmsMatch.referees) || ({} as MatchReferees),
      home_team: {
        id: cmsMatch.homeTeam.id.toString(),
        name: cmsMatch.homeTeam.name,
        short_name: cmsMatch.homeTeam.shortName,
        bas_logo_path: getFullLogoUrl(cmsMatch.homeTeam.logo),
        brand_color: cmsMatch.homeTeam.brandColor,
        coach: cmsMatch.homeCoach
          ? {
              first_name: cmsMatch.homeCoach.name.split(' ')[0] || '',
              last_name: [cmsMatch.homeCoach.name.split(' ').slice(1).join(' ') || ''],
            }
          : { first_name: '', last_name: [''] },
        first_assistant: { first_name: '', last_name: '' },
        second_assistant: { first_name: '', last_name: '' },
        lineup: transformLineup(cmsMatch.homeLineup),
      },
      away_team: {
        id: cmsMatch.awayTeam.id.toString(),
        name: cmsMatch.awayTeam.name,
        short_name: cmsMatch.awayTeam.shortName,
        bas_logo_path: getFullLogoUrl(cmsMatch.awayTeam.logo),
        brand_color: cmsMatch.awayTeam.brandColor,
        coach: cmsMatch.awayCoach
          ? {
              first_name: cmsMatch.awayCoach.name.split(' ')[0] || '',
              last_name: [cmsMatch.awayCoach.name.split(' ').slice(1).join(' ') || ''],
            }
          : { first_name: '', last_name: [''] },
        first_assistant: { first_name: '', last_name: '' },
        second_assistant: { first_name: '', last_name: '' },
        lineup: transformLineup(cmsMatch.awayLineup),
      },
    };
  }

  return {
    id: cmsMatch.sotaId,
    date: format(gameDate, 'd MMMM yyyy', { locale: dateLocale }),
    time: status === 'finished' ? 'FT' : status === 'live' ? 'LIVE' : 'TBD',
    stadium: cmsMatch.venue || `Тур ${cmsMatch.tour}`,
    competition: cmsMatch.competition || '',
    tour: cmsMatch.tour,
    status,
    hasStats: cmsMatch.hasStats,
    homeTeam: {
      id: cmsMatch.homeTeam.id,
      name: cmsMatch.homeTeam.name,
      shortName: cmsMatch.homeTeam.shortName,
      logo: getFullLogoUrl(cmsMatch.homeTeam.logo),
      score: cmsMatch.homeTeam.score,
      brandColor: cmsMatch.homeTeam.brandColor,
    },
    awayTeam: {
      id: cmsMatch.awayTeam.id,
      name: cmsMatch.awayTeam.name,
      shortName: cmsMatch.awayTeam.shortName,
      logo: getFullLogoUrl(cmsMatch.awayTeam.logo),
      score: cmsMatch.awayTeam.score,
      brandColor: cmsMatch.awayTeam.brandColor,
    },
    lineup,
    playerStats: transformPlayerStats(
      cmsMatch.homePlayers,
      cmsMatch.awayPlayers,
      cmsMatch.homeTeam.name,
      cmsMatch.awayTeam.name
    ),
    teamStats: transformTeamStats(cmsMatch.teamStats),
    referees: transformReferees(cmsMatch.referees),
  };
};

/**
 * Fetch match by SOTA ID from CMS
 */
export const fetchMatchBySotaId = async (
  sotaId: string,
  language: string = 'ru'
): Promise<MatchDetails | null> => {
  try {
    logger.info('[Match] Fetching from CMS', { sotaId });

    const response = await cmsApiClient.get<CMSPaginatedResponse<CMSMatch>>(`/${COLLECTION}`, {
      params: {
        'where[sotaId][equals]': sotaId,
        depth: 1,
        limit: 1,
      },
    });

    if (response.data.docs.length === 0) {
      logger.info('[Match] Not found in CMS', { sotaId });
      return null;
    }

    const cmsMatch = response.data.docs[0];
    const transformed = transformMatch(cmsMatch, language);

    logger.info('[Match] Successfully loaded from CMS', {
      sotaId,
      hasLineup: !!transformed.lineup,
      hasStats: !!transformed.teamStats,
    });

    return transformed;
  } catch (error) {
    logger.error('[Match] CMS fetch failed', { sotaId, error });
    return null;
  }
};

/**
 * Fetch matches with query parameters
 */
export const fetchMatches = async (params?: CMSQueryParams): Promise<CMSMatch[]> => {
  const response = await cmsApiClient.get<CMSPaginatedResponse<CMSMatch>>(`/${COLLECTION}`, {
    params,
  });

  return response.data.docs;
};
