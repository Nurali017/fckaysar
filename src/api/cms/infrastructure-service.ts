/**
 * Infrastructure Service - Fetch stadium, training base, academy data from Payload CMS
 */

import cmsApiClient from './cms-client';
import type {
  CMSInfrastructure,
  CMSPaginatedResponse,
  InfrastructureItem,
  CMSMedia,
  CMSRichText,
  CMSRichTextNode,
} from './types';
import { logger } from '@/lib/logger';

const COLLECTION = 'infrastructure';

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
 * Transform CMS infrastructure to frontend format
 */
const transformInfrastructure = (cms: CMSInfrastructure): InfrastructureItem => ({
  id: cms.id,
  name: cms.name,
  type: cms.type,
  status: cms.status,
  description: richTextToPlainText(cms.description),
  shortDescription: cms.shortDescription,
  mainImageUrl: getMediaUrl(cms.mainImage),
  galleryUrls: cms.gallery?.map(m => getMediaUrl(m)).filter((url): url is string => !!url) || [],
  features: cms.features || [],
  address: cms.address,
  coordinates: cms.coordinates,
  capacity: cms.capacity,
  uefaCategory: cms.uefaCategory,
  fieldType: cms.fieldType,
  lightingLux: cms.lightingLux,
  parkingSpaces: cms.parkingSpaces,
  fieldsCount: cms.fieldsCount,
  yearBuilt: cms.yearBuilt,
});

/**
 * Fetch all infrastructure items
 */
export const fetchInfrastructure = async (): Promise<InfrastructureItem[]> => {
  try {
    const response = await cmsApiClient.get<CMSPaginatedResponse<CMSInfrastructure>>(
      `/${COLLECTION}`,
      {
        params: {
          sort: 'order',
          limit: 20,
          depth: 2,
        },
      }
    );

    if (!response.data?.docs) {
      logger.warn('No infrastructure data returned from CMS');
      return [];
    }

    return response.data.docs.map(item => transformInfrastructure(item));
  } catch (error) {
    logger.error('Error fetching infrastructure data:', error);
    throw error;
  }
};

/**
 * Fetch infrastructure by type
 */
export const fetchInfrastructureByType = async (
  type: 'stadium' | 'training_base' | 'academy' | 'office'
): Promise<InfrastructureItem[]> => {
  try {
    const response = await cmsApiClient.get<CMSPaginatedResponse<CMSInfrastructure>>(
      `/${COLLECTION}`,
      {
        params: {
          where: {
            type: { equals: type },
          },
          sort: 'order',
          limit: 20,
          depth: 2,
        },
      }
    );

    if (!response.data?.docs) {
      return [];
    }

    return response.data.docs.map(item => transformInfrastructure(item));
  } catch (error) {
    logger.error(`Error fetching infrastructure by type ${type}:`, error);
    throw error;
  }
};

/**
 * Fetch single infrastructure item by ID
 */
export const fetchInfrastructureById = async (id: string): Promise<InfrastructureItem | null> => {
  try {
    const response = await cmsApiClient.get<CMSInfrastructure>(`/${COLLECTION}/${id}`, {
      params: {
        depth: 2,
      },
    });

    if (!response.data) {
      logger.warn(`No infrastructure found with id: ${id}`);
      return null;
    }

    return transformInfrastructure(response.data);
  } catch (error) {
    logger.error(`Error fetching infrastructure with id ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch stadium data (shortcut)
 */
export const fetchStadium = async (): Promise<InfrastructureItem | null> => {
  const items = await fetchInfrastructureByType('stadium');
  return items[0] || null;
};

/**
 * Fetch academy/training base data
 */
export const fetchAcademy = async (): Promise<InfrastructureItem | null> => {
  const items = await fetchInfrastructureByType('academy');
  return items[0] || null;
};
