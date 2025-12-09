/**
 * Polls Service - Fetch and vote on polls from Payload CMS
 */

import cmsApiClient from './cms-client';
import type { CMSPoll, CMSPaginatedResponse, PollItem, PollOptionItem } from './types';
import { env } from '@/lib/env';

const COLLECTION = 'polls';
// If CMS base URL is set (direct access), use /api path
// If not set (going through Vite proxy), use /cms-api which gets rewritten to /api
const cmsBaseUrl = env.VITE_CMS_BASE_URL;
const CMS_BASE_URL = cmsBaseUrl ? `${cmsBaseUrl}/api` : '/cms-api';

/**
 * Get localized text with fallback to Russian
 * Priority: current lang → ru → kk → en → empty string
 */
const getLocalizedText = (
  value: string | Record<string, string> | undefined,
  lang: string
): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value['ru'] || value['kk'] || value['en'] || '';
};

/**
 * Transform CMS poll to frontend format
 */
const transformPoll = (cmsPoll: CMSPoll, lang: string = 'ru'): PollItem => {
  const totalVotes = cmsPoll.totalVotes || 0;

  const options: PollOptionItem[] = cmsPoll.options.map((opt, index) => ({
    id: opt.id || `option-${index}`,
    text: opt.optionText,
    votes: opt.votes || 0,
    percentage: totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0,
  }));

  return {
    id: cmsPoll.id,
    question: getLocalizedText(cmsPoll.question, lang),
    slug: cmsPoll.slug,
    description: getLocalizedText(cmsPoll.description, lang),
    options,
    totalVotes,
    status: cmsPoll.status,
    featured: cmsPoll.featured,
  };
};

/**
 * Fetch all active polls
 */
export const fetchActivePolls = async (limit = 10, lang = 'ru'): Promise<PollItem[]> => {
  const response = await cmsApiClient.get<CMSPaginatedResponse<CMSPoll>>(`/${COLLECTION}`, {
    params: {
      limit,
      'where[status][equals]': 'active',
      sort: '-createdAt',
      depth: 1,
    },
  });

  return response.data.docs.map(poll => transformPoll(poll, lang));
};

/**
 * Fetch featured poll (for homepage)
 */
export const fetchFeaturedPoll = async (lang = 'ru'): Promise<PollItem | null> => {
  const response = await cmsApiClient.get<CMSPaginatedResponse<CMSPoll>>(`/${COLLECTION}`, {
    params: {
      limit: 1,
      'where[status][equals]': 'active',
      'where[featured][equals]': true,
      sort: '-createdAt',
      depth: 1,
    },
  });

  if (response.data.docs.length === 0) return null;
  return transformPoll(response.data.docs[0], lang);
};

/**
 * Fetch poll by ID
 */
export const fetchPollById = async (id: string, lang = 'ru'): Promise<PollItem | null> => {
  try {
    const response = await cmsApiClient.get<CMSPoll>(`/${COLLECTION}/${id}`);
    return transformPoll(response.data, lang);
  } catch {
    return null;
  }
};

/**
 * Submit vote to poll
 */
export const submitPollVote = async (
  pollId: string,
  optionIndex: number,
  lang = 'ru'
): Promise<PollItem | null> => {
  try {
    const response = await fetch(`${CMS_BASE_URL}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ optionIndex }),
    });

    if (!response.ok) {
      throw new Error('Vote failed');
    }

    const data = await response.json();
    return transformPoll(data.poll, lang);
  } catch {
    return null;
  }
};
