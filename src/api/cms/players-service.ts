/**
 * Players Service - Fetch players from Payload CMS
 */

import cmsApiClient from './cms-client';
import type {
  CMSPlayer,
  CMSPaginatedResponse,
  CMSQueryParams,
  PlayerItem,
  CMSMedia,
  CMSRichText,
  CMSRichTextNode,
} from './types';

const COLLECTION = 'players';

/**
 * Convert CMS rich text to plain text
 */
const richTextToPlainText = (richText: CMSRichText | undefined): string => {
  if (!richText?.root?.children) return '';

  const extractText = (nodes: CMSRichTextNode[]): string => {
    return nodes
      .map((node) => {
        if (node.text) return node.text;
        if (node.children) return extractText(node.children);
        return '';
      })
      .join(' ');
  };

  return extractText(richText.root.children).trim();
};

/**
 * Get media URL from CMS media object
 */
const getMediaUrl = (media: CMSMedia | string | undefined): string | undefined => {
  if (!media) return undefined;
  if (typeof media === 'string') return media;

  // Fix for incorrect CMS URLs
  if (media.url && media.url.startsWith('/api/media/file/')) {
    const filename = media.filename;
    return `/media/players/${filename}`;
  }

  return media.url;
};

/**
 * Get current football season string (e.g., "2025/26")
 * Football season runs August to May, so Dec 2025 = 2025/26 season
 */
const getCurrentSeason = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12

  // If before August, we're in previous year's season
  const startYear = month >= 8 ? year : year - 1;
  const endYear = startYear + 1;

  return `${startYear}/${String(endYear).slice(-2)}`;
};

/**
 * Transform CMS player to frontend format
 */
const transformPlayer = (cmsPlayer: CMSPlayer): PlayerItem => {
  const currentSeason = getCurrentSeason();
  // Try current season first, then fallback patterns, then most recent
  const currentSeasonStats = cmsPlayer.statistics?.find(
    (s) => s.season === currentSeason ||
           s.season === currentSeason.replace('/', '-') ||
           s.season === currentSeason.replace('/', '-20')
  ) || cmsPlayer.statistics?.[0]; // Fallback to first (most recent) if no match

  return {
    id: cmsPlayer.id,
    name: cmsPlayer.displayName,
    firstName: cmsPlayer.firstName,
    lastName: cmsPlayer.lastName,
    slug: cmsPlayer.slug,
    number: cmsPlayer.jerseyNumber,
    photoUrl: getMediaUrl(cmsPlayer.photo),
    position: cmsPlayer.position || 'Midfielder',
    positionKey: cmsPlayer.position || 'midfielder',
    nationality: cmsPlayer.nationality || 'Kazakhstan',
    dateOfBirth: cmsPlayer.dateOfBirth,
    height: cmsPlayer.height,
    weight: cmsPlayer.weight,
    biography: richTextToPlainText(cmsPlayer.biography),
    stats: currentSeasonStats
      ? {
        appearances: currentSeasonStats.appearances || 0,
        goals: currentSeasonStats.goals || 0,
        assists: currentSeasonStats.assists || 0,
        yellowCards: currentSeasonStats.yellowCards || 0,
        redCards: currentSeasonStats.redCards || 0,
      }
      : undefined,
    status: cmsPlayer.status,
  };
};

/**
 * Fetch all players
 */
export const fetchPlayers = async (params?: CMSQueryParams): Promise<{
  players: PlayerItem[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}> => {
  const response = await cmsApiClient.get<CMSPaginatedResponse<CMSPlayer>>(
    `/${COLLECTION}`,
    {
      params: {
        limit: params?.limit || 50,
        page: params?.page || 1,
        sort: params?.sort || 'jerseyNumber',
        depth: params?.depth || 1,
        'where[status][not_equals]': 'loaned',
        ...params?.where,
      },
    }
  );

  const { docs, totalDocs, page, totalPages, hasNextPage, hasPrevPage } = response.data;

  return {
    players: docs.map((p) => transformPlayer(p)),
    pagination: {
      total: totalDocs,
      page,
      totalPages,
      hasNext: hasNextPage,
      hasPrev: hasPrevPage,
    },
  };
};

/**
 * Fetch players by position
 */
export const fetchPlayersByPosition = async (
  position: 'goalkeeper' | 'defender' | 'midfielder' | 'forward'
): Promise<PlayerItem[]> => {
  const response = await cmsApiClient.get<CMSPaginatedResponse<CMSPlayer>>(
    `/${COLLECTION}`,
    {
      params: {
        limit: 50,
        'where[position][equals]': position,
        'where[status][not_equals]': 'loaned',
        sort: 'jerseyNumber',
        depth: 1,
      },
    }
  );

  return response.data.docs.map((p) => transformPlayer(p));
};

/**
 * Fetch single player by slug
 */
export const fetchPlayerBySlug = async (slug: string): Promise<PlayerItem | null> => {
  const response = await cmsApiClient.get<CMSPaginatedResponse<CMSPlayer>>(
    `/${COLLECTION}`,
    {
      params: {
        'where[slug][equals]': slug,
        depth: 2,
        limit: 1,
      },
    }
  );

  if (response.data.docs.length === 0) return null;
  return transformPlayer(response.data.docs[0]);
};

/**
 * Fetch single player by ID
 */
export const fetchPlayerById = async (id: string): Promise<PlayerItem | null> => {
  try {
    const response = await cmsApiClient.get<CMSPlayer>(`/${COLLECTION}/${id}`, {
      params: { depth: 2 },
    });

    return transformPlayer(response.data);
  } catch {
    return null;
  }
};

/**
 * Fetch hero player (isHero = true)
 */
export const fetchHeroPlayer = async (): Promise<PlayerItem | null> => {
  try {
    const response = await cmsApiClient.get<CMSPaginatedResponse<CMSPlayer>>(
      `/${COLLECTION}`,
      {
        params: {
          'where[isHero][equals]': true,
          limit: 1,
          depth: 2,
        },
      }
    );

    if (response.data.docs.length === 0) return null;
    return transformPlayer(response.data.docs[0]);
  } catch {
    return null;
  }
};
