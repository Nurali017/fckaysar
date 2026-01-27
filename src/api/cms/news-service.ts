/**
 * News Service - Fetch news from Payload CMS
 */

import cmsApiClient from './cms-client';
import type {
  CMSNews,
  CMSPaginatedResponse,
  CMSQueryParams,
  NewsItem,
  CMSMedia,
  CMSRichText,
  CMSRichTextNode,
} from './types';

const COLLECTION = 'news';

/**
 * Convert CMS rich text to plain text
 */
const richTextToPlainText = (richText: CMSRichText | undefined): string => {
  if (!richText?.root?.children) return '';

  const extractText = (nodes: CMSRichTextNode[]): string => {
    return nodes
      .map(node => {
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
 * Transform CMS news to frontend format
 */
const transformNews = (cmsNews: CMSNews): NewsItem => ({
  id: cmsNews.id,
  title: cmsNews.title,
  slug: cmsNews.slug,
  excerpt: cmsNews.excerpt,
  content: richTextToPlainText(cmsNews.content),
  imageUrl: getMediaUrl(cmsNews.featuredImage),
  category: cmsNews.category,
  tags: cmsNews.tags?.map(t => t.tag) || [],
  publishedAt: cmsNews.publishedAt || cmsNews.createdAt,
  featured: cmsNews.featured,
});

/**
 * Fetch paginated news list
 */
export const fetchNews = async (
  params?: CMSQueryParams
): Promise<{
  news: NewsItem[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}> => {
  const response = await cmsApiClient.get<CMSPaginatedResponse<CMSNews>>(`/${COLLECTION}`, {
    params: {
      limit: params?.limit || 10,
      page: params?.page || 1,
      sort: params?.sort || '-publishedAt',
      depth: params?.depth || 1,
      'where[status][equals]': 'published',
      ...params?.where,
    },
  });

  const { docs, totalDocs, page, totalPages, hasNextPage, hasPrevPage } = response.data;

  return {
    news: docs.map(n => transformNews(n)),
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
 * Fetch featured news
 */
export const fetchFeaturedNews = async (limit = 5): Promise<NewsItem[]> => {
  const response = await cmsApiClient.get<CMSPaginatedResponse<CMSNews>>(`/${COLLECTION}`, {
    params: {
      limit,
      'where[status][equals]': 'published',
      'where[featured][equals]': true,
      sort: '-publishedAt',
      depth: 1,
    },
  });

  return response.data.docs.map(n => transformNews(n));
};

/**
 * Fetch regular (non-featured) news
 */
export const fetchRegularNews = async (limit = 4): Promise<NewsItem[]> => {
  const response = await cmsApiClient.get<CMSPaginatedResponse<CMSNews>>(`/${COLLECTION}`, {
    params: {
      limit,
      'where[status][equals]': 'published',
      'where[featured][not_equals]': true,
      sort: '-publishedAt',
      depth: 1,
    },
  });

  return response.data.docs.map(n => transformNews(n));
};

/**
 * Fetch single news by slug
 */
export const fetchNewsBySlug = async (slug: string): Promise<NewsItem | null> => {
  const response = await cmsApiClient.get<CMSPaginatedResponse<CMSNews>>(`/${COLLECTION}`, {
    params: {
      'where[slug][equals]': slug,
      'where[status][equals]': 'published',
      depth: 2,
      limit: 1,
    },
  });

  if (response.data.docs.length === 0) return null;
  return transformNews(response.data.docs[0]);
};

/**
 * Fetch news by category
 */
export const fetchNewsByCategory = async (category: string, limit = 10): Promise<NewsItem[]> => {
  const response = await cmsApiClient.get<CMSPaginatedResponse<CMSNews>>(`/${COLLECTION}`, {
    params: {
      limit,
      'where[status][equals]': 'published',
      'where[category][equals]': category,
      sort: '-publishedAt',
      depth: 1,
    },
  });

  return response.data.docs.map(n => transformNews(n));
};
