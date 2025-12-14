/**
 * React Query hook for partnership requests
 */

import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import {
  submitPartnershipRequest,
  type PartnershipRequestData,
  type SubmitPartnershipResponse,
} from '@/api/cms/partnership-service';

/**
 * Hook to submit partnership request
 */
export const useSubmitPartnershipRequest = (): UseMutationResult<
  SubmitPartnershipResponse,
  Error,
  PartnershipRequestData
> => {
  return useMutation({
    mutationFn: submitPartnershipRequest,
  });
};
