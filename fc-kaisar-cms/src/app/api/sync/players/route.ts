/**
 * Players Sync API
 * POST /api/sync/players - Trigger manual sync
 * GET /api/sync/players - Get sync status
 */

import { NextResponse } from 'next/server'
import { syncPlayers, getPlayersSyncStatus } from '@/lib/sync/players-sync'

const SYNC_SECRET = process.env.SYNC_API_SECRET

/**
 * GET - Get sync status
 */
export async function GET(): Promise<NextResponse> {
  try {
    const status = await getPlayersSyncStatus()

    return NextResponse.json({
      success: true,
      data: status,
    })
  } catch (error) {
    console.error('[API] Error getting players sync status:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get sync status',
      },
      { status: 500 }
    )
  }
}

/**
 * POST - Trigger manual sync
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Check authorization if secret is configured
    if (SYNC_SECRET) {
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
    }

    // Parse options from body
    const body = await request.json().catch(() => ({}))
    const teamId = body.teamId ? parseInt(body.teamId, 10) : undefined
    const seasonId = body.seasonId ? parseInt(body.seasonId, 10) : undefined

    console.log('[API] Starting manual players sync...')
    const result = await syncPlayers({ teamId, seasonId })

    return NextResponse.json({
      success: result.success,
      data: result,
    })
  } catch (error) {
    console.error('[API] Error syncing players:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync players',
      },
      { status: 500 }
    )
  }
}
