/**
 * Season Types
 * Type definitions for season data
 */

export interface Season {
  id: string
  sotaId: number
  name: string
  startDate: string
  endDate: string
  isCurrent: boolean
  isNext: boolean
  tournamentId?: number
  tournamentName?: string
  lastSyncAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface SeasonsResponse {
  success: boolean
  data: {
    current: Season | null
    next: Season | null
    previous: Season | null
    all: Season[]
  }
  meta: {
    total: number
    timestamp: string
  }
}

export interface SeasonError {
  success: false
  error: string
  message?: string
}
