/**
 * React Query hook for season pass requests
 */

import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import {
  submitSeasonPassRequest,
  type SeasonPassRequestData,
  type SubmitSeasonPassResponse,
} from '@/api/cms/season-pass-service';

/**
 * Hook to submit season pass request
 */
export const useSubmitSeasonPassRequest = (): UseMutationResult<
  SubmitSeasonPassResponse,
  Error,
  SeasonPassRequestData
> => {
  return useMutation({
    mutationFn: submitSeasonPassRequest,
  });
};
