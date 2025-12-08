/**
 * React Query hooks for CMS polls data
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  fetchActivePolls,
  fetchFeaturedPoll,
  fetchPollById,
  submitPollVote,
  type PollItem,
} from '@/api/cms';

/**
 * Hook to get all active polls
 */
export const useActivePolls = (limit: number = 10): UseQueryResult<PollItem[], Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'polls', 'active', limit, i18n.language],
    queryFn: () => fetchActivePolls(limit, i18n.language),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get featured poll (for homepage)
 */
export const useFeaturedPoll = (): UseQueryResult<PollItem | null, Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'polls', 'featured', i18n.language],
    queryFn: () => fetchFeaturedPoll(i18n.language),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get poll by ID
 */
export const usePollById = (id: string | undefined): UseQueryResult<PollItem | null, Error> => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['cms', 'polls', 'id', id, i18n.language],
    queryFn: () => (id ? fetchPollById(id, i18n.language) : null),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to submit poll vote
 */
export const useSubmitPollVote = (): UseMutationResult<
  PollItem | null,
  Error,
  { pollId: string; optionIndex: number; lang?: string }
> => {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  return useMutation({
    mutationFn: ({ pollId, optionIndex, lang }) =>
      submitPollVote(pollId, optionIndex, lang || i18n.language),
    onSuccess: (updatedPoll, { pollId }) => {
      // Update the poll in cache
      if (updatedPoll) {
        queryClient.setQueryData(
          ['cms', 'polls', 'id', pollId],
          updatedPoll
        );
      }
      // Invalidate polls lists to refetch
      queryClient.invalidateQueries({ queryKey: ['cms', 'polls'] });
    },
  });
};
