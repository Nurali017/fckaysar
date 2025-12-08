/**
 * React Query Hooks for Seasons
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import {
  getSeasons,
  getCurrentSeason,
  getNextSeason,
  getPreviousSeason,
} from '@/api/services/seasons-service'
import type { SeasonsResponse, Season } from '@/api/types/season-types'

/**
 * Hook to fetch all seasons data (current, next, previous, all)
 */
export const useSeasons = (): UseQueryResult<SeasonsResponse, Error> => {
  return useQuery({
    queryKey: ['seasons'],
    queryFn: getSeasons,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - seasons don't change often
    gcTime: 48 * 60 * 60 * 1000, // 48 hours cache
    retry: 2,
  })
}

/**
 * Hook to fetch current season only
 */
export const useCurrentSeason = (): UseQueryResult<Season | null, Error> => {
  return useQuery({
    queryKey: ['seasons', 'current'],
    queryFn: getCurrentSeason,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    retry: 2,
  })
}

/**
 * Hook to fetch next season only
 */
export const useNextSeason = (): UseQueryResult<Season | null, Error> => {
  return useQuery({
    queryKey: ['seasons', 'next'],
    queryFn: getNextSeason,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    retry: 2,
  })
}

/**
 * Hook to fetch previous season only
 */
export const usePreviousSeason = (): UseQueryResult<Season | null, Error> => {
  return useQuery({
    queryKey: ['seasons', 'previous'],
    queryFn: getPreviousSeason,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    retry: 2,
  })
}
