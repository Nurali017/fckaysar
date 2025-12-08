/**
 * Team Stats Public API
 * GET /api/team-stats - Returns cached team statistics
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

const DEFAULT_TEAM_ID = parseInt(process.env.FC_KAISAR_TEAM_ID || '94', 10)
const DEFAULT_SEASON_ID = parseInt(process.env.SOTA_CURRENT_SEASON_ID || '61', 10)

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const teamId = parseInt(searchParams.get('teamId') || String(DEFAULT_TEAM_ID), 10)
    const seasonId = parseInt(searchParams.get('seasonId') || String(DEFAULT_SEASON_ID), 10)

    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'team-stats',
      where: {
        and: [{ teamId: { equals: teamId } }, { seasonId: { equals: seasonId } }],
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Team stats not found',
          teamId,
          seasonId,
        },
        { status: 404 }
      )
    }

    const stats = result.docs[0]

    return NextResponse.json({
      success: true,
      data: stats,
      meta: {
        teamId,
        seasonId,
        lastSync: stats.lastSyncAt,
      },
    })
  } catch (error) {
    console.error('[API] Error fetching team stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch team stats',
      },
      { status: 500 }
    )
  }
}
