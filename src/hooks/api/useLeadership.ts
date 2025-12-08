/**
 * React Query hooks for CMS leadership data
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchLeadership, fetchLeadershipByKey, type LeadershipItem } from '@/api/cms';

/**
 * Hook to get all active leadership members
 * Returns sorted by order field (ascending)
 * Photos change rarely, so we cache for 30 minutes
 */
export const useLeadership = (): UseQueryResult<LeadershipItem[], Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'leadership', 'list', i18n.language],
    queryFn: fetchLeadership,
    staleTime: 30 * 60 * 1000, // 30 minutes - photos don't change often
    gcTime: 60 * 60 * 1000, // 60 minutes
  });
};

/**
 * Hook to get single leadership member by key
 */
export const useLeadershipByKey = (key: string): UseQueryResult<LeadershipItem | null, Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'leadership', 'key', key, i18n.language],
    queryFn: () => fetchLeadershipByKey(key),
    enabled: !!key,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};
