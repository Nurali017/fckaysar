/**
 * React Query hooks for CMS gallery data
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  fetchGallery,
  fetchFeaturedGallery,
  fetchGalleryByCategory,
  fetchGalleryByType,
  fetchGalleryById,
  type GalleryItem,
} from '@/api/cms';

/**
 * Hook to get paginated gallery
 */
export const useGallery = (
  page: number = 1,
  limit: number = 12
): UseQueryResult<{
  items: GalleryItem[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}, Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'gallery', 'list', page, limit, i18n.language],
    queryFn: () => fetchGallery({ page, limit }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to get featured gallery items
 */
export const useFeaturedGallery = (limit: number = 8): UseQueryResult<GalleryItem[], Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'gallery', 'featured', limit, i18n.language],
    queryFn: () => fetchFeaturedGallery(limit),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook to get gallery by category
 */
export const useGalleryByCategory = (
  category: 'match' | 'training' | 'event',
  limit: number = 12
): UseQueryResult<GalleryItem[], Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'gallery', 'category', category, limit, i18n.language],
    queryFn: () => fetchGalleryByCategory(category, limit),
    enabled: !!category,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook to get gallery by type (photo/video)
 */
export const useGalleryByType = (
  type: 'photo' | 'video',
  limit: number = 12
): UseQueryResult<GalleryItem[], Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'gallery', 'type', type, limit, i18n.language],
    queryFn: () => fetchGalleryByType(type, limit),
    enabled: !!type,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook to get single gallery item by ID
 */
export const useGalleryById = (id: string): UseQueryResult<GalleryItem | null, Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'gallery', 'id', id, i18n.language],
    queryFn: () => fetchGalleryById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
