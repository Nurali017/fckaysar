/**
 * Matches Sync API
 * POST /api/sync/matches - Trigger manual sync
 */

import { NextResponse } from 'next/server'
import { syncMatches, syncMatchById, getMatchesSyncStatus } from '@/lib/sync/matches-sync'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => ({}))
    const { matchId, syncDetails = true } = body

    // If matchId provided, sync single match
    if (matchId) {
      console.log(`[API] Syncing single match: ${matchId}`)
      const result = await syncMatchById(matchId)

      return NextResponse.json({
        success: result.action !== 'error',
        data: result,
      })
    }

    // Otherwise sync all matches
    console.log('[API] Starting full matches sync...')
    const result = await syncMatches({ syncDetails })

    return NextResponse.json({
      success: result.success,
      data: result,
    })
  } catch (error) {
    console.error('[API] Sync failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Sync failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const status = await getMatchesSyncStatus()

    return NextResponse.json({
      success: true,
      data: status,
    })
  } catch (error) {
    console.error('[API] Error fetching sync status:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sync status',
      },
      { status: 500 }
    )
  }
}
