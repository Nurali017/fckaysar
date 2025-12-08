/**
 * Team Stats Sync API
 * POST /api/sync/team-stats - Manually trigger team stats sync
 */

import { NextResponse } from 'next/server'
import { syncTeamStats, getTeamStatsSyncStatus } from '@/lib/sync/team-stats-sync'

const SYNC_SECRET = process.env.SYNC_SECRET || 'dev-secret'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization')
    const providedSecret = authHeader?.replace('Bearer ', '')

    if (providedSecret !== SYNC_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    // Parse options from body
    const body = await request.json().catch(() => ({}))
    const { teamId, seasonId } = body

    // Run sync
    const result = await syncTeamStats({ teamId, seasonId })

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] Sync error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Sync failed',
        message: String(error),
      },
      { status: 500 }
    )
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const status = await getTeamStatsSyncStatus()
    return NextResponse.json({
      success: true,
      ...status,
    })
  } catch (error) {
    console.error('[API] Status error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get sync status',
      },
      { status: 500 }
    )
  }
}
