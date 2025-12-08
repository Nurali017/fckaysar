/**
 * Seasons Sync Service
 * Syncs season data from SOTA API to CMS
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { sotaClient } from '../sota-client'

interface SotaSeason {
  id: number
  name: string
  start_date: string
  end_date: string
  tournament_id?: number
  tournament_name?: string
}

interface SyncResult {
  success: boolean
  message: string
  created: number
  updated: number
  errors: number
}

/**
 * Sync seasons from SOTA API
 */
export async function syncSeasons(): Promise<SyncResult> {
  console.log('[SYNC] Starting seasons sync...')

  try {
    const payload = await getPayload({ config })

    // Fetch seasons from SOTA API
    const response = await sotaClient.get<{ data: SotaSeason[] }>('/api/public/v1/seasons/', {
      params: {
        tournament_id: 7, // Kazakhstan Premier League
      },
    })

    const sotaSeasons = response.data.data || []

    if (sotaSeasons.length === 0) {
      return {
        success: true,
        message: 'No seasons found in SOTA API',
        created: 0,
        updated: 0,
        errors: 0,
      }
    }

    let created = 0
    let updated = 0
    let errors = 0

    // Process each season
    for (const sotaSeason of sotaSeasons) {
      try {
        // Check if season already exists
        const existing = await payload.find({
          collection: 'seasons',
          where: {
            sotaId: {
              equals: sotaSeason.id,
            },
          },
          limit: 1,
        })

        const seasonData = {
          sotaId: sotaSeason.id,
          name: sotaSeason.name,
          startDate: new Date(sotaSeason.start_date).toISOString(),
          endDate: new Date(sotaSeason.end_date).toISOString(),
          tournamentId: sotaSeason.tournament_id,
          tournamentName: sotaSeason.tournament_name,
          lastSyncAt: new Date().toISOString(),
        }

        if (existing.docs.length > 0) {
          // Update existing season
          await payload.update({
            collection: 'seasons',
            id: existing.docs[0].id,
            data: seasonData,
          })
          updated++
        } else {
          // Create new season
          await payload.create({
            collection: 'seasons',
            data: seasonData,
          })
          created++
        }
      } catch (error: any) {
        errors++
        console.error(`[SYNC] Error processing season ${sotaSeason.name}:`, error.message)
      }
    }

    // Update isCurrent and isNext flags
    await updateSeasonFlags(payload)

    const message = `Synced ${sotaSeasons.length} seasons (created: ${created}, updated: ${updated}, errors: ${errors})`
    console.log(`[SYNC] ${message}`)

    return {
      success: true,
      message,
      created,
      updated,
      errors,
    }
  } catch (error: any) {
    console.error('[SYNC] Error syncing seasons:', error.message)
    return {
      success: false,
      message: `Error syncing seasons: ${error.message}`,
      created: 0,
      updated: 0,
      errors: 1,
    }
  }
}

/**
 * Update isCurrent and isNext flags for all seasons
 */
async function updateSeasonFlags(payload: any) {
  const now = new Date()

  // Get all seasons
  const allSeasons = await payload.find({
    collection: 'seasons',
    limit: 100,
    sort: 'startDate',
  })

  const seasons = allSeasons.docs

  // Find current season
  const currentSeason = seasons.find((season: any) => {
    const start = new Date(season.startDate)
    const end = new Date(season.endDate)
    return start <= now && now <= end
  })

  // Find next season
  const nextSeason = seasons
    .filter((season: any) => new Date(season.startDate) > now)
    .sort(
      (a: any, b: any) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )[0]

  // Update flags for all seasons
  for (const season of seasons) {
    const isCurrent = currentSeason && season.id === currentSeason.id
    const isNext = nextSeason && season.id === nextSeason.id

    if (season.isCurrent !== isCurrent || season.isNext !== isNext) {
      await payload.update({
        collection: 'seasons',
        id: season.id,
        data: {
          isCurrent,
          isNext,
        },
      })
    }
  }
}
