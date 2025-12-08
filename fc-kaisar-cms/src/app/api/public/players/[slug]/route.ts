/**
 * Single Player Public API
 * GET /api/players/:slug - Returns player details
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { slug } = await params

    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'players',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
      depth: 1, // Load photo relationship
    })

    if (result.docs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Player not found',
          slug,
        },
        { status: 404 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const player = result.docs[0] as any

    // Build photo URL from Payload Media object
    // Return relative URL so frontend can use it through proxy or directly
    let photoUrl = null
    if (player.photo && typeof player.photo === 'object' && player.photo.filename) {
      // Photos are served from CMS public/media/players folder
      // Use relative URL for frontend flexibility (works with proxy)
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
      },
      meta: {
        lastSync: player.lastSyncAt,
      },
    })
  } catch (error) {
    console.error('[API] Error fetching player:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch player',
      },
      { status: 500 }
    )
  }
}
