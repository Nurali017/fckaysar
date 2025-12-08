/**
 * Single Match Public API
 * GET /api/matches/:id - Returns match details with full stats
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import type { Media } from '../../../../payload-types'

interface RouteParams {
  params: Promise<{ id: string }>
}

// Team name mapping (EN -> RU) for logo lookup
const TEAM_NAME_MAP: Record<string, string> = {
  Kaysar: 'Кайсар',
  Astana: 'Астана',
  Kairat: 'Кайрат',
  Ordabasy: 'Ордабасы',
  Tobol: 'Тобол',
  Aktobe: 'Актобе',
  Atyrau: 'Атырау',
  Kyzylzhar: 'Кызылжар',
  Jenis: 'Женис',
  Jetisu: 'Жетысу',
  Okzhetpes: 'Окжетпес',
  Turan: 'Туран',
  Elimai: 'Елимай',
  Ulytau: 'Улытау',
}

/**
 * Check if logo path is valid URL (not Windows path)
 */
const isValidLogoUrl = (path?: string): boolean => {
  if (!path) return false
  return path.startsWith('http') || path.startsWith('/')
}

export async function GET(request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = await params

    const payload = await getPayload({ config })

    // Get local team logos
    const teamLogos = await payload.find({
      collection: 'team-logos',
      limit: 100,
      depth: 1,
    })

    // Create lookup maps
    const logoByTeamId = new Map<number, string>()
    const logoByTeamName = new Map<string, string>()

    for (const teamLogo of teamLogos.docs) {
      const media = teamLogo.logo as Media
      if (media?.filename) {
        const logoUrl = `/media/${media.filename}`
        logoByTeamId.set(teamLogo.teamId, logoUrl)
        if (teamLogo.teamName) {
          logoByTeamName.set(teamLogo.teamName, logoUrl)
        }
      }
    }

    /**
     * Get logo URL by team ID, name, or original path
     */
    const getLogoUrl = (
      teamId: number | undefined,
      teamName: string | undefined,
      originalLogo: string | undefined
    ): string => {
      // Try by teamId first
      if (teamId && logoByTeamId.has(teamId)) {
        return logoByTeamId.get(teamId)!
      }

      // Try by team name (RU)
      if (teamName) {
        const ruName = TEAM_NAME_MAP[teamName] || teamName
        if (logoByTeamName.has(ruName)) {
          return logoByTeamName.get(ruName)!
        }
      }

      // Fallback to original only if valid URL
      if (isValidLogoUrl(originalLogo)) {
        return originalLogo!
      }

      return ''
    }

    const result = await payload.find({
      collection: 'matches',
      where: {
        sotaId: { equals: id },
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Match not found',
          matchId: id,
        },
        { status: 404 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const match = result.docs[0] as any

    // Get proper logo URLs (by ID, name, or fallback)
    const homeLogoUrl = getLogoUrl(match.homeTeam?.id, match.homeTeam?.name, match.homeTeam?.logo)
    const awayLogoUrl = getLogoUrl(match.awayTeam?.id, match.awayTeam?.name, match.awayTeam?.logo)

    // Transform lineup player fields for frontend compatibility (camelCase)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapLineupPlayer = (player: any) => ({
      playerId: player.playerId,
      number: player.number,
      fullName: player.fullName,
      lastName: player.lastName,
      isGk: player.isGk,
      isCaptain: player.isCaptain,
      photo: player.photo || null,
    })

    return NextResponse.json({
      success: true,
      data: {
        id: match.sotaId,
        date: match.matchDate,
        tour: match.tour,
        status: match.status,
        hasStats: match.hasStats,
        homeTeam: {
          ...match.homeTeam,
          logo: homeLogoUrl,
        },
        awayTeam: {
          ...match.awayTeam,
          logo: awayLogoUrl,
        },
        competition: match.competition,
        venue: match.venue,
        visitors: match.visitors,
        teamStats: match.teamStats,
        referees: match.referees,
        homeLineup: match.homeLineup?.map(mapLineupPlayer) || [],
        awayLineup: match.awayLineup?.map(mapLineupPlayer) || [],
        homeCoach: match.homeCoach,
        awayCoach: match.awayCoach,
        homePlayers: match.homePlayers,
        awayPlayers: match.awayPlayers,
      },
      meta: {
        lastSync: match.lastSyncAt,
      },
    })
  } catch (error) {
    console.error('[API] Error fetching match:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch match',
      },
      { status: 500 }
    )
  }
}
