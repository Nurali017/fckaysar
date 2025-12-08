/**
 * Manual League Table Sync Script
 * Run with: npx ts-node --esm src/scripts/sync-league-table.ts
 * Or add to package.json scripts
 */

import 'dotenv/config'
import { syncLeagueTable } from '../lib/sync/league-table-sync'

async function main() {
  console.log('Starting manual league table sync...')
  console.log('Season ID:', process.env.SOTA_CURRENT_SEASON_ID || '61')

  try {
    const result = await syncLeagueTable()

    console.log('\n=== Sync Result ===')
    console.log('Success:', result.success)
    console.log('Message:', result.message)
    console.log('Teams Created:', result.teamsCreated)
    console.log('Teams Updated:', result.teamsUpdated)
    console.log('Duration:', result.duration, 'ms')

    if (result.errors?.length) {
      console.log('\nErrors:')
      result.errors.forEach((err) => console.log('  -', err))
    }

    process.exit(result.success ? 0 : 1)
  } catch (error) {
    console.error('Sync failed:', error)
    process.exit(1)
  }
}

main()
