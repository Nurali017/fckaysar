/**
 * Gallery Service - Fetch gallery items from Payload CMS
 */

import cmsApiClient from './cms-client';
import type {
  CMSGallery,
  CMSPaginatedResponse,
  CMSQueryParams,
  GalleryItem,
  CMSMedia,
} from './types';

const COLLECTION = 'gallery';

/**
 * Get media URLs from CMS media array
 */
const getMediaUrls = (media: (CMSMedia | string)[] | undefined): string[] => {
  if (!media || media.length === 0) return [];

  return media.map((item) => {
    if (typeof item === 'string') return item;
    return item.url;
  });
};

/**
 * Transform CMS gallery to frontend format
 */
const transformGallery = (cmsGallery: CMSGallery): GalleryItem => ({
  id: cmsGallery.id,
  title: cmsGallery.title,
  description: cmsGallery.description,
  images: getMediaUrls(cmsGallery.media),
  type: cmsGallery.type,
  category: cmsGallery.category,
  uploadDate: cmsGallery.uploadDate || cmsGallery.createdAt,
  featured: cmsGallery.featured,
  tags: cmsGallery.tags?.map((t) => t.tag) || [],
});

/**
 * Fetch paginated gallery list
 */
export const fetchGallery = async (params?: CMSQueryParams): Promise<{
  items: GalleryItem[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}> => {

  const response = await cmsApiClient.get<CMSPaginatedResponse<CMSGallery>>(
    `/${COLLECTION}`,
    {
      params: {
        limit: params?.limit || 12,
        page: params?.page || 1,
        sort: params?.sort || '-uploadDate',
        depth: params?.depth || 1,
        ...params?.where,
      },
    }
  );

  const { docs, totalDocs, page, totalPages, hasNextPage, hasPrevPage } = response.data;

  return {
    items: docs.map((g) => transformGallery(g)),
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
 * Fetch featured gallery items
 */
export const fetchFeaturedGallery = async (limit = 8): Promise<GalleryItem[]> => {

  const response = await cmsApiClient.get<CMSPaginatedResponse<CMSGallery>>(
    `/${COLLECTION}`,
    {
      params: {
        limit,
        'where[featured][equals]': true,
        sort: '-uploadDate',
        depth: 1,
      },
    }
  );

  return response.data.docs.map((g) => transformGallery(g));
};

/**
 * Fetch gallery by category
 */
export const fetchGalleryByCategory = async (
  category: 'match' | 'training' | 'event',
  limit = 12
): Promise<GalleryItem[]> => {

  const response = await cmsApiClient.get<CMSPaginatedResponse<CMSGallery>>(
    `/${COLLECTION}`,
    {
      params: {
        limit,
        'where[category][equals]': category,
        sort: '-uploadDate',
        depth: 1,
      },
    }
  );

  return response.data.docs.map((g) => transformGallery(g));
};

/**
 * Fetch gallery by type (photo/video)
 */
export const fetchGalleryByType = async (
  type: 'photo' | 'video',
  limit = 12
): Promise<GalleryItem[]> => {

  const response = await cmsApiClient.get<CMSPaginatedResponse<CMSGallery>>(
    `/${COLLECTION}`,
    {
      params: {
        limit,
        'where[type][equals]': type,
        sort: '-uploadDate',
        depth: 1,
      },
    }
  );

  return response.data.docs.map((g) => transformGallery(g));
};

/**
 * Fetch single gallery item by ID
 */
export const fetchGalleryById = async (id: string): Promise<GalleryItem | null> => {

  try {
    const response = await cmsApiClient.get<CMSGallery>(`/${COLLECTION}/${id}`, {
      params: { depth: 2 },
    });

    return transformGallery(response.data, CMS_MEDIA_BASE_URL);
  } catch {
    return null;
  }
};
