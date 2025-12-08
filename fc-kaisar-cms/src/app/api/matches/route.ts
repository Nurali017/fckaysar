/**
 * Matches Public API
 * GET /api/matches - Returns list of matches
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

const DEFAULT_SEASON_ID = parseInt(process.env.SOTA_CURRENT_SEASON_ID || '61', 10)

// Team name mapping (EN -> RU for league-tables lookup)
const TEAM_NAME_MAP: Record<string, string> = {
  'Kaysar': 'Кайсар',
  'Astana': 'Астана',
  'Kairat': 'Кайрат',
  'Ordabasy': 'Ордабасы',
  'Tobol': 'Тобол',
  'Aktobe': 'Актобе',
  'Atyrau': 'Атырау',
  'Kyzylzhar': 'Кызылжар',
  'Jenis': 'Женис',
  'Jetisu': 'Жетысу',
  'Okzhetpes': 'Окжетпес',
  'Turan': 'Туран',
  'Elimai': 'Елимай',
  'Ulytau': 'Улытау',
}

/**
 * Get team logos from team-logos collection (local files)
 */
async function getTeamLogos(payload: any): Promise<Record<string, string>> {
  const logos: Record<string, string> = {}

  try {
    // First try to get logos from team-logos collection (local files)
    const teamLogos = await payload.find({
      collection: 'team-logos',
      limit: 50,
      depth: 1, // To get media.url
    })

    for (const teamLogo of teamLogos.docs) {
      // Use filename to build correct static URL (not API URL)
      if (teamLogo.teamName && teamLogo.logo?.filename) {
        logos[teamLogo.teamName] = `/media/${teamLogo.logo.filename}`
      }
    }

    // If no local logos found, fall back to league-table
    if (Object.keys(logos).length === 0) {
      const leagueTables = await payload.find({
        collection: 'league-table',
        limit: 20,
      })

      for (const team of leagueTables.docs) {
        if (team.teamLogo && team.teamName?.ru) {
          const baseUrl = team.teamLogo.split('?')[0]
          logos[team.teamName.ru] = baseUrl
        }
      }
    }
  } catch (error) {
    console.error('[API] Error fetching team logos:', error)
  }

  return logos
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const seasonId = parseInt(searchParams.get('seasonId') || String(DEFAULT_SEASON_ID), 10)
    const status = searchParams.get('status') // scheduled | live | finished
    const teamId = searchParams.get('teamId') // Team ID filter (e.g., 94 for Kaisar)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const page = parseInt(searchParams.get('page') || '1', 10)

    const payload = await getPayload({ config })

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      seasonId: { equals: seasonId },
    }

    // Filter by team: match where team is home OR away
    // Note: Using team name filter since team IDs are not stored in DB
    if (teamId) {
      // Map team ID to name (94 = Kaysar)
      const teamNames: Record<number, string> = {
        94: 'Kaysar',
        85: 'Astana',
        86: 'Kairat',
        87: 'Ordabasy',
        88: 'Tobol',
        89: 'Aktobe',
      }
      const teamIdNum = parseInt(teamId, 10)
      const teamName = teamNames[teamIdNum]

      if (teamName) {
        where.or = [
          { 'homeTeam.name': { equals: teamName } },
          { 'awayTeam.name': { equals: teamName } },
        ]
      }
    }

    if (status) {
      where.status = { equals: status }
    }

    const result = await payload.find({
      collection: 'matches',
      where,
      sort: '-matchDate',
      limit,
      page,
    })

    // Get team logos from league-tables (SOTA real logos)
    const teamLogos = await getTeamLogos(payload)

    // Check if logo path is valid URL (not Windows path)
    const isValidLogoUrl = (path?: string): boolean => {
      if (!path) return false
      return path.startsWith('http') || path.startsWith('/')
    }

    // Helper to get logo by EN team name
    const getLogoForTeam = (teamName: string, originalLogo?: string): string => {
      const ruName = TEAM_NAME_MAP[teamName]
      // First try local logo by team name
      if (ruName && teamLogos[ruName]) {
        return teamLogos[ruName]
      }
      // Fallback to original only if valid URL
      if (isValidLogoUrl(originalLogo)) {
        return originalLogo!
      }
      return ''
    }

    // Transform response to frontend format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matches = result.docs.map((match: any) => ({
      id: match.sotaId,
      date: match.matchDate,
      tour: match.tour,
      status: match.status,
      hasStats: match.hasStats,
      homeTeam: {
        ...match.homeTeam,
        logo: getLogoForTeam(match.homeTeam?.name, match.homeTeam?.logo),
      },
      awayTeam: {
        ...match.awayTeam,
        logo: getLogoForTeam(match.awayTeam?.name, match.awayTeam?.logo),
      },
      competition: match.competition,
      venue: match.venue,
      visitors: match.visitors,
    }))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstDoc = result.docs[0] as any

    return NextResponse.json({
      success: true,
      data: matches,
      meta: {
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
        limit: result.limit,
        seasonId,
        lastSync: firstDoc?.lastSyncAt || null,
      },
    })
  } catch (error) {
    console.error('[API] Error fetching matches:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch matches',
      },
      { status: 500 }
    )
  }
}
