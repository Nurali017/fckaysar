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
  });
};
