/**
 * Sync Seasons Script
 * Fetches seasons from SOTA API and syncs to CMS
 * Run with: npm run sync:seasons
 */

import 'dotenv/config'
import { syncSeasons } from '../lib/sync/seasons-sync'

async function main() {
  console.log('Starting manual seasons sync...')

  try {
    const result = await syncSeasons()

    console.log('\n=== Sync Result ===')
    console.log('Success:', result.success)
    console.log('Message:', result.message)
    console.log('Created:', result.created)
    console.log('Updated:', result.updated)
    console.log('Errors:', result.errors)

    if (result.success) {
      console.log('\n✅ Seasons sync completed successfully!')
      process.exit(0)
    } else {
      console.log('\n❌ Seasons sync failed')
      process.exit(1)
    }
  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message)
    process.exit(1)
  }
}

main()
