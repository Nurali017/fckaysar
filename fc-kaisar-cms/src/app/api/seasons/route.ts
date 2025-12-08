/**
 * Seasons API Endpoint
 * GET /api/seasons - Get current and next seasons
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(_request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get all seasons, sorted by start date
    const seasonsResponse = await payload.find({
      collection: 'seasons',
      sort: '-startDate',
      limit: 100,
    })

    const seasons = seasonsResponse.docs

    // Get current date
    const now = new Date()

    // Find current season (where now is between startDate and endDate)
    const currentSeason = seasons.find((season: any) => {
      const start = new Date(season.startDate)
      const end = new Date(season.endDate)
      return start <= now && now <= end
    })

    // Find next season (first season that starts after now)
    const nextSeason = seasons
      .filter((season: any) => new Date(season.startDate) > now)
      .sort(
        (a: any, b: any) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      )[0]

    // Find previous season (last season that ended before now)
    const previousSeason = seasons
      .filter((season: any) => new Date(season.endDate) < now)
      .sort(
        (a: any, b: any) =>
          new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
      )[0]

    return NextResponse.json(
      {
        success: true,
        data: {
          current: currentSeason || null,
          next: nextSeason || null,
          previous: previousSeason || null,
          all: seasons,
        },
        meta: {
          total: seasons.length,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error('[API] Error fetching seasons:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch seasons',
        message: error.message,
      },
      { status: 500 },
    )
  }
}
