/**
 * Leadership Service - Fetch leadership team photos from Payload CMS
 */

import cmsApiClient from './cms-client';
import type { CMSLeadership, CMSPaginatedResponse, LeadershipItem, CMSMedia } from './types';
import { logger } from '@/lib/logger';

const COLLECTION = 'leadership';

/**
 * Get media URL from CMS media object
 * Uses original URL directly (already URL-encoded)
 * Vite proxy handles /api/media → localhost:3000
 */
const getMediaUrl = (media: CMSMedia | string | undefined): string => {
  if (!media) return '/placeholder.svg';

  if (typeof media === 'string') {
    return media;
  }

  // Use original URL (already URL-encoded by CMS)
  return media.url;
};

/**
 * Transform CMS leadership to frontend format
 */
const transformLeadership = (cmsLeadership: CMSLeadership): LeadershipItem => ({
  id: cmsLeadership.id,
  key: cmsLeadership.key,
  photoUrl: getMediaUrl(cmsLeadership.photo),
  order: cmsLeadership.order,
});

/**
 * Fetch all active leadership members
 * Returns sorted by order field (ascending)
 */
export const fetchLeadership = async (): Promise<LeadershipItem[]> => {
  try {
    const response = await cmsApiClient.get<CMSPaginatedResponse<CMSLeadership>>(`/${COLLECTION}`, {
      params: {
        where: {
          isActive: {
            equals: true,
          },
        },
        sort: 'order',
        limit: 10, // Max 10 leaders
      },
    });

    if (!response.data?.docs) {
      logger.warn('No leadership data returned from CMS');
      return [];
    }

    return response.data.docs.map(leader => transformLeadership(leader));
  } catch (error) {
    logger.error('Error fetching leadership data:', error);
    throw error;
  }
};

/**
 * Fetch single leadership member by key
 */
export const fetchLeadershipByKey = async (key: string): Promise<LeadershipItem | null> => {
  try {
    const response = await cmsApiClient.get<CMSPaginatedResponse<CMSLeadership>>(`/${COLLECTION}`, {
      params: {
        where: {
          key: {
            equals: key,
          },
          isActive: {
            equals: true,
          },
        },
        limit: 1,
      },
    });

    if (!response.data?.docs || response.data.docs.length === 0) {
      logger.warn(`No leadership member found with key: ${key}`);
      return null;
    }

    return transformLeadership(response.data.docs[0]);
  } catch (error) {
    logger.error(`Error fetching leadership member with key ${key}:`, error);
    throw error;
  }
};
