/**
 * Veterans Service - Fetch club veterans/legends from Payload CMS
 */

import cmsApiClient from './cms-client';
import type {
  CMSVeteran,
  CMSPaginatedResponse,
  VeteranItem,
  CMSMedia,
  CMSRichText,
  CMSRichTextNode,
} from './types';
import { logger } from '@/lib/logger';

const COLLECTION = 'veterans';

/**
 * Get media URL from CMS media object
 */
const getMediaUrl = (media: CMSMedia | string | undefined): string | undefined => {
  if (!media) return undefined;
  if (typeof media === 'string') return media;
  return media.url;
};

/**
 * Convert rich text to plain text
 */
const richTextToPlainText = (richText?: CMSRichText): string | undefined => {
  if (!richText?.root?.children) return undefined;

  const extractText = (nodes: CMSRichTextNode[]): string => {
    return nodes
      .map(node => {
        if (node.text) return node.text;
        if (node.children) return extractText(node.children);
        return '';
      })
      .join('\n');
  };

  return extractText(richText.root.children);
};

/**
 * Transform CMS veteran to frontend format
 */
const transformVeteran = (cms: CMSVeteran): VeteranItem => ({
  id: cms.id,
  firstName: cms.firstName,
  lastName: cms.lastName,
  displayName: cms.displayName,
  position: cms.position,
  positionKey: cms.position,
  yearsInClub: cms.yearsInClub,
  jerseyNumber: cms.jerseyNumber,
  photoUrl: getMediaUrl(cms.photo),
  achievements: cms.achievements,
  biography: richTextToPlainText(cms.biography),
  statistics: cms.statistics
    ? {
        matches: cms.statistics.matches || 0,
        goals: cms.statistics.goals || 0,
        assists: cms.statistics.assists || 0,
      }
    : undefined,
  isLegend: cms.isLegend,
});

/**
 * Fetch all veterans
 */
export const fetchVeterans = async (): Promise<VeteranItem[]> => {
  try {
    const response = await cmsApiClient.get<CMSPaginatedResponse<CMSVeteran>>(`/${COLLECTION}`, {
      params: {
        sort: 'order',
        limit: 100,
        depth: 2,
      },
    });

    if (!response.data?.docs) {
      logger.warn('No veterans data returned from CMS');
      return [];
    }

    return response.data.docs.map(item => transformVeteran(item));
  } catch (error) {
    logger.error('Error fetching veterans data:', error);
    throw error;
  }
};

/**
 * Fetch only legends
 */
export const fetchLegends = async (): Promise<VeteranItem[]> => {
  try {
    const response = await cmsApiClient.get<CMSPaginatedResponse<CMSVeteran>>(`/${COLLECTION}`, {
      params: {
        where: {
          isLegend: { equals: true },
        },
        sort: 'order',
        limit: 100,
        depth: 2,
      },
    });

    if (!response.data?.docs) {
      return [];
    }

    return response.data.docs.map(item => transformVeteran(item));
  } catch (error) {
    logger.error('Error fetching legends:', error);
    throw error;
  }
};

/**
 * Fetch veterans by position
 */
export const fetchVeteransByPosition = async (
  position: 'goalkeeper' | 'defender' | 'midfielder' | 'forward' | 'coach'
): Promise<VeteranItem[]> => {
  try {
    const response = await cmsApiClient.get<CMSPaginatedResponse<CMSVeteran>>(`/${COLLECTION}`, {
      params: {
        where: {
          position: { equals: position },
        },
        sort: 'order',
        limit: 100,
        depth: 2,
      },
    });

    if (!response.data?.docs) {
      return [];
    }

    return response.data.docs.map(item => transformVeteran(item));
  } catch (error) {
    logger.error(`Error fetching veterans by position ${position}:`, error);
    throw error;
  }
};

/**
 * Fetch single veteran by ID
 */
export const fetchVeteranById = async (id: string): Promise<VeteranItem | null> => {
  try {
    const response = await cmsApiClient.get<CMSVeteran>(`/${COLLECTION}/${id}`, {
      params: {
        depth: 2,
      },
    });

    if (!response.data) {
      logger.warn(`No veteran found with id: ${id}`);
      return null;
    }

    return transformVeteran(response.data);
  } catch (error) {
    logger.error(`Error fetching veteran with id ${id}:`, error);
    throw error;
  }
};
