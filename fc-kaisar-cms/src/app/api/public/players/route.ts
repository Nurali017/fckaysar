/**
 * Players Public API
 * GET /api/players - Returns list of players
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

const DEFAULT_TEAM_ID = parseInt(process.env.FC_KAISAR_TEAM_ID || '94', 10)

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position') // goalkeeper | defender | midfielder | forward
    const status = searchParams.get('status') // active | injured | loaned | left
    const limit = parseInt(searchParams.get('limit') || '100', 10)
    const page = parseInt(searchParams.get('page') || '1', 10)

    const payload = await getPayload({ config })

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      teamId: { equals: DEFAULT_TEAM_ID },
    }

    if (position) {
      where.position = { equals: position }
    }

    if (status) {
      where.status = { equals: status }
    } else {
      // Default to active players only
      where.status = { equals: 'active' }
    }

    const result = await payload.find({
      collection: 'players',
      where,
      sort: 'jerseyNumber',
      limit,
      page,
      depth: 1, // Load photo relationship
    })

    // Transform response to frontend format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const players = result.docs.map((player: any) => {
      // Build photo URL from Payload Media object
      // Return relative URL so frontend can use it through proxy or directly
      let photoUrl = null
      if (player.photo && typeof player.photo === 'object') {
        // Payload automatically provides the URL field for media
        photoUrl = player.photo.url
      }

      return {
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
        status: player.status,
        currentSeasonStats: player.currentSeasonStats,
        socialMedia: player.socialMedia,
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstDoc = result.docs[0] as any

    return NextResponse.json({
      success: true,
      data: players,
      meta: {
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
        limit: result.limit,
        teamId: DEFAULT_TEAM_ID,
        lastSync: firstDoc?.lastSyncAt || null,
      },
    })
  } catch (error) {
    console.error('[API] Error fetching players:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch players',
      },
      { status: 500 }
    )
  }
}
