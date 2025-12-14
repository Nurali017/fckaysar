/**
 * Partnership Requests Service - Submit partnership/sponsorship requests to Payload CMS
 */

import { env } from '@/lib/env';

const cmsBaseUrl = env.VITE_CMS_BASE_URL;
const CMS_BASE_URL = cmsBaseUrl ? `${cmsBaseUrl}/api` : '/cms-api';

export interface PartnershipRequestData {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  partnershipType: 'sponsor' | 'media' | 'technical' | 'other';
  proposal: string;
  website?: string;
}

export interface SubmitPartnershipResponse {
  success: boolean;
  data?: { id: string };
  message?: string;
  error?: string;
}

/**
 * Submit a partnership request
 */
export const submitPartnershipRequest = async (
  data: PartnershipRequestData
): Promise<SubmitPartnershipResponse> => {
  try {
    const response = await fetch(`${CMS_BASE_URL}/partnership-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit partnership request');
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
