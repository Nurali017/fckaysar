/**
 * VIP Box Requests Service - Submit VIP box booking requests to Payload CMS
 */

import { env } from '@/lib/env';

const cmsBaseUrl = env.VITE_CMS_BASE_URL;
const CMS_BASE_URL = cmsBaseUrl ? `${cmsBaseUrl}/api` : '/cms-api';

export interface VipBoxRequestData {
  name: string;
  phone: string;
  email?: string;
  guests: number;
  matchDate?: string;
  comment?: string;
}

export interface SubmitVipBoxResponse {
  success: boolean;
  data?: { id: string };
  message?: string;
  error?: string;
}

/**
 * Submit a VIP box booking request
 */
export const submitVipBoxRequest = async (
  data: VipBoxRequestData
): Promise<SubmitVipBoxResponse> => {
  try {
    const response = await fetch(`${CMS_BASE_URL}/vip-box-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit VIP box request');
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
