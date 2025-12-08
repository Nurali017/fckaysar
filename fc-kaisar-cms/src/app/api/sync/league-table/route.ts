/**
 * League Table Sync API Endpoint
 * POST - Trigger manual sync
 * GET - Get sync status
 */

import { NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'
import { syncLeagueTable, getSyncStatus } from '@/lib/sync/league-table-sync'

/**
 * POST /api/sync/league-table
 * Trigger manual league table sync
 *
 * Body (optional):
 * - seasonId: number (default: 61)
 * - forceUpdate: boolean (default: false)
 *
 * Headers:
 * - Authorization: Bearer <token> (required)
 */
export async function POST(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 })
    }

    // Validate admin access using Payload
    const payload = await getPayload({ config })

    // Extract token from Bearer header
    const token = authHeader.replace('Bearer ', '')

    // Verify user (this will throw if invalid)
    const { user } = await payload.auth({
      headers: new Headers({ Authorization: `Bearer ${token}` }),
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    // Parse request body
    let body: { seasonId?: number; forceUpdate?: boolean } = {}
    try {
      body = await request.json()
    } catch {
      // Empty body is OK, use defaults
    }

    console.log(`[API] Manual sync triggered by user: ${user.email}`)

    // Run sync
    const result = await syncLeagueTable({
      seasonId: body.seasonId,
      forceUpdate: body.forceUpdate,
    })

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    })
  } catch (error) {
    console.error('[API] Sync endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET /api/sync/league-table
 * Get current sync status
 */
export async function GET() {
  try {
    const status = await getSyncStatus()

    return NextResponse.json({
      status: 'ok',
      ...status,
    })
  } catch (error) {
    console.error('[API] Status endpoint error:', error)
    return NextResponse.json({ error: 'Failed to get sync status' }, { status: 500 })
  }
}
