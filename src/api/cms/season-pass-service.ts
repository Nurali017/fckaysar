/**
 * Season Pass Requests Service - Submit season pass booking requests to Payload CMS
 */

import { env } from '@/lib/env';

const cmsBaseUrl = env.VITE_CMS_BASE_URL;
const CMS_BASE_URL = cmsBaseUrl ? `${cmsBaseUrl}/api` : '/cms-api';

export interface SeasonPassRequestData {
  name: string;
  phone: string;
  email?: string;
  seatPreference?: string;
  quantity: number;
  comment?: string;
}

export interface SubmitSeasonPassResponse {
  success: boolean;
  data?: { id: string };
  message?: string;
  error?: string;
}

/**
 * Submit a season pass request
 */
export const submitSeasonPassRequest = async (
  data: SeasonPassRequestData
): Promise<SubmitSeasonPassResponse> => {
  try {
    const response = await fetch(`${CMS_BASE_URL}/season-pass-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit season pass request');
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
