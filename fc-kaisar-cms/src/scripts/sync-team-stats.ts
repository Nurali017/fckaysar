/**
 * Manual Team Stats Sync Script
 * Usage: npm run sync:team-stats
 */

import 'dotenv/config'
import { syncTeamStats } from '../lib/sync/team-stats-sync'

async function main() {
  console.log('='.repeat(50))
  console.log('FC Kaisar - Team Stats Sync')
  console.log('='.repeat(50))

  const teamId = parseInt(process.env.FC_KAISAR_TEAM_ID || '94', 10)
  const seasonId = parseInt(process.env.SOTA_CURRENT_SEASON_ID || '61', 10)

  console.log(`Team ID: ${teamId}`)
  console.log(`Season ID: ${seasonId}`)
  console.log('-'.repeat(50))

  try {
    const result = await syncTeamStats({ teamId, seasonId })

    console.log('\nSync Result:')
    console.log(`  Success: ${result.success}`)
    console.log(`  Action: ${result.action}`)
    console.log(`  Message: ${result.message}`)
    console.log(`  Duration: ${result.duration}ms`)

    if (result.stats) {
      console.log('\nTeam Stats:')
      console.log(`  Games Played: ${result.stats.gamesPlayed}/${result.stats.gamesTotal}`)
      console.log(`  Record: ${result.stats.wins}W ${result.stats.draws}D ${result.stats.losses}L`)
      console.log(`  Points: ${result.stats.points}`)
      console.log(`  Goals: ${result.stats.goals} / ${result.stats.goalsConceded} (${result.stats.goalsDifference > 0 ? '+' : ''}${result.stats.goalsDifference})`)
      console.log(`  xG: ${result.stats.xg}`)
      console.log(`  Possession: ${result.stats.possession}%`)
      console.log(`  Pass Accuracy: ${result.stats.passAccuracy}%`)
      console.log(`  Cards: ${result.stats.yellowCards}Y ${result.stats.redCards}R`)
      console.log(`  Avg Visitors: ${result.stats.averageVisitors}`)
    }

    console.log('\n' + '='.repeat(50))
    console.log('Sync completed!')
    process.exit(result.success ? 0 : 1)
  } catch (error) {
    console.error('\nSync failed:', error)
    process.exit(1)
  }
}

main()
