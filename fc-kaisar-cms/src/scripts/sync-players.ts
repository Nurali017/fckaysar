/**
 * Manual Players Sync Script
 * Usage: npm run sync:players
 */

import 'dotenv/config'
import { syncPlayers } from '../lib/sync/players-sync'

async function main() {
  console.log('='.repeat(50))
  console.log('FC Kaisar - Players Sync')
  console.log('='.repeat(50))

  const teamId = parseInt(process.env.FC_KAISAR_TEAM_ID || '94', 10)
  const seasonId = parseInt(process.env.SOTA_CURRENT_SEASON_ID || '61', 10)

  console.log(`Team ID: ${teamId}`)
  console.log(`Season ID: ${seasonId}`)
  console.log('-'.repeat(50))

  try {
    const startTime = Date.now()
    const result = await syncPlayers({ teamId, seasonId })

    console.log('\nSync Result:')
    console.log(`  Success: ${result.success}`)
    console.log(`  Players Processed: ${result.playersProcessed}`)
    console.log(`  Created: ${result.created}`)
    console.log(`  Updated: ${result.updated}`)
    console.log(`  Unchanged: ${result.unchanged}`)
    console.log(`  Errors: ${result.errors}`)
    console.log(`  Duration: ${result.duration}ms`)

    console.log('\n' + '='.repeat(50))
    console.log(`Sync completed in ${Date.now() - startTime}ms!`)
    process.exit(result.success ? 0 : 1)
  } catch (error) {
    console.error('\nSync failed:', error)
    process.exit(1)
  }
}

main()
