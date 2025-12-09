/**
 * React Query hook for player recommendations
 */

import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import {
  submitPlayerRecommendation,
  type PlayerRecommendationData,
  type SubmitRecommendationResponse,
} from '@/api/cms/player-recommendations-service';

/**
 * Hook to submit player recommendation
 */
export const useSubmitPlayerRecommendation = (): UseMutationResult<
  SubmitRecommendationResponse,
  Error,
  PlayerRecommendationData
> => {
  return useMutation({
    mutationFn: submitPlayerRecommendation,
    onSuccess: data => {
      if (data.success) {
        console.log('[usePlayerRecommendation] Submitted successfully:', data.data?.id);
      }
    },
    onError: error => {
      console.error('[usePlayerRecommendation] Error:', error);
    },
  });
};
