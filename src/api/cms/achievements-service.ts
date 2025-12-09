/**
 * Achievements Service - Fetch club achievements from Payload CMS
 */

import cmsApiClient from './cms-client';
import type {
  CMSAchievement,
  CMSPaginatedResponse,
  AchievementItem,
  CMSMedia,
  CMSRichText,
  CMSRichTextNode,
} from './types';
import { logger } from '@/lib/logger';

const COLLECTION = 'achievements';

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
 * Transform CMS achievement to frontend format
 */
const transformAchievement = (cms: CMSAchievement): AchievementItem => ({
  id: cms.id,
  title: cms.title,
  type: cms.type,
  year: cms.year,
  place: cms.place,
  competition: cms.competition,
  description: richTextToPlainText(cms.description),
  imageUrl: getMediaUrl(cms.image),
});

/**
 * Fetch all achievements
 */
export const fetchAchievements = async (): Promise<AchievementItem[]> => {
  try {
    const response = await cmsApiClient.get<CMSPaginatedResponse<CMSAchievement>>(
      `/${COLLECTION}`,
      {
        params: {
          sort: '-year,order',
          limit: 100,
          depth: 2,
        },
      }
    );

    if (!response.data?.docs) {
      logger.warn('No achievements data returned from CMS');
      return [];
    }

    return response.data.docs.map(item => transformAchievement(item));
  } catch (error) {
    logger.error('Error fetching achievements data:', error);
    throw error;
  }
};

/**
 * Fetch achievements by type
 */
export const fetchAchievementsByType = async (
  type: 'championship' | 'cup' | 'eurocup' | 'award' | 'other'
): Promise<AchievementItem[]> => {
  try {
    const response = await cmsApiClient.get<CMSPaginatedResponse<CMSAchievement>>(
      `/${COLLECTION}`,
      {
        params: {
          where: {
            type: { equals: type },
          },
          sort: '-year,order',
          limit: 100,
          depth: 2,
        },
      }
    );

    if (!response.data?.docs) {
      return [];
    }

    return response.data.docs.map(item => transformAchievement(item));
  } catch (error) {
    logger.error(`Error fetching achievements by type ${type}:`, error);
    throw error;
  }
};

/**
 * Group achievements by year
 */
export const groupAchievementsByYear = (
  achievements: AchievementItem[]
): Record<number, AchievementItem[]> => {
  return achievements.reduce(
    (acc, achievement) => {
      const year = achievement.year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(achievement);
      return acc;
    },
    {} as Record<number, AchievementItem[]>
  );
};
