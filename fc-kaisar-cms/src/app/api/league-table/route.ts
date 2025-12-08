/**
 * Public League Table API Endpoint
 * GET - Fetch current league standings
 */

import { NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'
import type { Media } from '../../../payload-types'

/**
 * GET /api/league-table
 * Public endpoint to fetch league standings
 *
 * Query params:
 * - seasonId: number (optional, default: 61)
 * - locale: string (optional, default: ru)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const seasonId = parseInt(searchParams.get('seasonId') || '61', 10)
    const locale = (searchParams.get('locale') || 'ru') as 'ru' | 'kk' | 'en'

    const payload = await getPayload({ config })

    // Get league standings
    const standings = await payload.find({
      collection: 'league-table',
      where: {
        seasonId: { equals: seasonId },
      },
      sort: 'position',
      limit: 100,
      locale,
    })

    // Get local team logos
    const teamLogos = await payload.find({
      collection: 'team-logos',
      limit: 100,
      depth: 1, // To get media.url
    })

    // Create lookup map: teamId -> local logo URL
    const logoMap = new Map<number, string>()
    for (const teamLogo of teamLogos.docs) {
      const media = teamLogo.logo as Media
      // Use filename to build correct static URL (not API URL)
      if (media?.filename) {
        logoMap.set(teamLogo.teamId, `/media/${media.filename}`)
      }
    }

    return NextResponse.json({
      success: true,
      seasonId,
      total: standings.totalDocs,
      standings: standings.docs.map((doc) => ({
        position: doc.position,
        teamId: doc.teamId,
        teamName: doc.teamName,
        // Use local logo if available, fallback to external URL
        teamLogo: logoMap.get(doc.teamId) || doc.teamLogo,
        played: doc.played,
        won: doc.won,
        drawn: doc.drawn,
        lost: doc.lost,
        goalsFor: doc.goalsFor,
        goalsAgainst: doc.goalsAgainst,
        goalDifference: doc.goalDifference,
        points: doc.points,
        isKaisar: doc.isKaisar,
      })),
      lastSync: standings.docs[0]?.lastSyncAt || null,
    })
  } catch (error) {
    console.error('[API] League table endpoint error:', error)
    return NextResponse.json({ error: 'Failed to fetch league table' }, { status: 500 })
  }
}
