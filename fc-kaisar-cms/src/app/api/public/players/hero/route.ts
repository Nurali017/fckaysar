/**
 * Hero Player Public API
 * GET /api/players/hero - Returns the hero player for landing page
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

const DEFAULT_TEAM_ID = parseInt(process.env.FC_KAISAR_TEAM_ID || '94', 10)

export async function GET(): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config })

    // Find hero player
    const result = await payload.find({
      collection: 'players',
      where: {
        teamId: { equals: DEFAULT_TEAM_ID },
        isHero: { equals: true },
        status: { equals: 'active' },
      },
      limit: 1,
      depth: 1, // Load photo relationship
    })

    if (result.docs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No hero player found',
        },
        { status: 404 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const player = result.docs[0] as any

    // Build photo URL from Payload Media object
    let photoUrl = null
    if (player.photo && typeof player.photo === 'object' && player.photo.filename) {
      photoUrl = `/media/players/${player.photo.filename}`
    }

    const actionPhotos = player.actionPhotos?.map((p: any) => {
      if (p && typeof p === 'object' && p.filename) {
        return `/media/players/${p.filename}`
      }
      return null
    }).filter(Boolean) || []

    return NextResponse.json({
      success: true,
      data: {
        id: player.sotaId || player.id,
        slug: player.slug,
        firstName: player.firstName,
        lastName: player.lastName,
        displayName: player.displayName,
        jerseyNumber: player.jerseyNumber,
        position: player.position,
        isGoalkeeper: player.isGoalkeeper,
        nationality: player.nationality,
        dateOfBirth: player.dateOfBirth,
        height: player.height,
        weight: player.weight,
        photo: photoUrl,
        actionPhotos,
        biography: player.biography,
        status: player.status,
        currentSeasonStats: player.currentSeasonStats,
        statistics: player.statistics,
        socialMedia: player.socialMedia,
        isHero: player.isHero,
      },
      meta: {
        lastSync: player.lastSyncAt,
      },
    })
  } catch (error) {
    console.error('[API] Error fetching hero player:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch hero player',
      },
      { status: 500 }
    )
  }
}
