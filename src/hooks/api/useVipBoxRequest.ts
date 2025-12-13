/**
 * React Query hook for VIP box requests
 */

import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import {
  submitVipBoxRequest,
  type VipBoxRequestData,
  type SubmitVipBoxResponse,
} from '@/api/cms/vip-box-service';

/**
 * Hook to submit VIP box booking request
 */
export const useSubmitVipBoxRequest = (): UseMutationResult<
  SubmitVipBoxResponse,
  Error,
  VipBoxRequestData
> => {
  return useMutation({
    mutationFn: submitVipBoxRequest,
  });
};
