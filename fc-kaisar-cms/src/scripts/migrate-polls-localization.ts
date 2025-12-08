/**
 * Migration script to convert existing polls to localized structure
 *
 * Run with: npx tsx src/scripts/migrate-polls-localization.ts
 */

import payload from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function migratePollsToLocalized() {
  console.log('🔄 Starting polls localization migration...')

  try {
    // Load environment variables
    const dotenv = await import('dotenv')
    dotenv.config()

    // Initialize Payload with config
    const config = (await import('../payload.config.js')).default

    await payload.init({
      config,
      secret: process.env.PAYLOAD_SECRET || '',
      local: true,
    })

    console.log('✅ Payload initialized')

    // Fetch all polls
    const polls = await payload.find({
      collection: 'polls',
      limit: 1000,
    })

    console.log(`📊 Found ${polls.docs.length} polls to migrate`)

    let migratedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const poll of polls.docs) {
      try {
        console.log(`\n📝 Processing poll: ${poll.id}`)

        // Check if question is already localized
        if (typeof poll.question === 'object' && poll.question !== null) {
          console.log(`  ⏭️  Already localized, skipping...`)
          skippedCount++
          continue
        }

        // Convert to localized structure
        const localizedData: any = {}

        // Migrate question
        if (poll.question && typeof poll.question === 'string') {
          localizedData.question = {
            ru: poll.question,
            kk: '', // Will need manual translation
            en: '', // Will need manual translation
          }
        }

        // Migrate description
        if (poll.description && typeof poll.description === 'string') {
          localizedData.description = {
            ru: poll.description,
            kk: '',
            en: '',
          }
        }

        // Migrate options
        if (poll.options && Array.isArray(poll.options)) {
          localizedData.options = poll.options.map((option: any) => {
            if (typeof option.optionText === 'string') {
              return {
                ...option,
                optionText: {
                  ru: option.optionText,
                  kk: '',
                  en: '',
                },
              }
            }
            return option
          })
        }

        // Update the poll
        await payload.update({
          collection: 'polls',
          id: poll.id,
          data: localizedData,
        })

        console.log(`  ✅ Successfully migrated`)
        migratedCount++
      } catch (error) {
        console.error(`  ❌ Error migrating poll ${poll.id}:`, error)
        errorCount++
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('📊 Migration Summary:')
    console.log(`  ✅ Migrated: ${migratedCount}`)
    console.log(`  ⏭️  Skipped: ${skippedCount}`)
    console.log(`  ❌ Errors: ${errorCount}`)
    console.log('='.repeat(50))

    if (migratedCount > 0) {
      console.log(
        '\n⚠️  Note: Migrated polls have empty kk and en translations.',
      )
      console.log('   Please use the auto-translation feature to fill them.')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migratePollsToLocalized()
