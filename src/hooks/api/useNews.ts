/**
 * React Query hooks for CMS news data
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  fetchNews,
  fetchFeaturedNews,
  fetchRegularNews,
  fetchNewsBySlug,
  fetchNewsByCategory,
  type NewsItem,
} from '@/api/cms';

/**
 * Hook to get paginated news
 */
export const useNews = (
  page: number = 1,
  limit: number = 10
): UseQueryResult<
  {
    news: NewsItem[];
    pagination: {
      total: number;
      page: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  },
  Error
> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'news', 'list', page, limit, i18n.language],
    queryFn: () => fetchNews({ page, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook to get featured news
 */
export const useFeaturedNews = (limit: number = 5): UseQueryResult<NewsItem[], Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'news', 'featured', limit, i18n.language],
    queryFn: () => fetchFeaturedNews(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

/**
 * Hook to get regular (non-featured) news
 */
export const useRegularNews = (limit: number = 4): UseQueryResult<NewsItem[], Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'news', 'regular', limit, i18n.language],
    queryFn: () => fetchRegularNews(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

/**
 * Hook to get news by slug
 */
export const useNewsBySlug = (slug: string): UseQueryResult<NewsItem | null, Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'news', 'slug', slug, i18n.language],
    queryFn: () => fetchNewsBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook to get news by category
 */
export const useNewsByCategory = (
  category: string,
  limit: number = 10
): UseQueryResult<NewsItem[], Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'news', 'category', category, limit, i18n.language],
    queryFn: () => fetchNewsByCategory(category, limit),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};
