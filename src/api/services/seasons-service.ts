/**
 * Seasons Service
 * Fetches season data from CMS
 */

import { cmsClient } from '../cms/cms-client'
import type { SeasonsResponse, Season } from '../types/season-types'

/**
 * Get all seasons with current and next season info
 */
export const getSeasons = async (): Promise<SeasonsResponse> => {
  const response = await cmsClient.get<SeasonsResponse>('/seasons')
  return response.data
}

/**
 * Get current season only
 */
export const getCurrentSeason = async (): Promise<Season | null> => {
  const response = await getSeasons()
  return response.data.current
}

/**
 * Get next season only
 */
export const getNextSeason = async (): Promise<Season | null> => {
  const response = await getSeasons()
  return response.data.next
}

/**
 * Get previous season only
 */
export const getPreviousSeason = async (): Promise<Season | null> => {
  const response = await getSeasons()
  return response.data.previous
}
