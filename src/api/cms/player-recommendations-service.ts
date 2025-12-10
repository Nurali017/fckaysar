/**
 * Player Recommendations Service - Submit player recommendations to Payload CMS
 */

import { env } from '@/lib/env';

const cmsBaseUrl = env.VITE_CMS_BASE_URL;
const CMS_BASE_URL = cmsBaseUrl ? `${cmsBaseUrl}/api` : '/cms-api';

export interface PlayerRecommendationData {
  // Player info
  playerFullName: string;
  birthYear: number;
  position: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
  currentClub?: string;
  city: string;
  playerContact: string; // Smart field: phone or email

  // Recommender info
  recommenderName: string;
  recommenderRelation: 'coach' | 'agent' | 'family' | 'fan' | 'self';
  recommenderContact: string; // Smart field: phone or email

  // Additional info
  videoUrl?: string;
  comment?: string; // Now optional
  consentGiven: boolean;
}

export interface SubmitRecommendationResponse {
  success: boolean;
  data?: { id: string };
  message?: string;
  error?: string;
}

/**
 * Submit a player recommendation
 */
export const submitPlayerRecommendation = async (
  data: PlayerRecommendationData
): Promise<SubmitRecommendationResponse> => {
  try {
    const response = await fetch(`${CMS_BASE_URL}/player-recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit recommendation');
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
