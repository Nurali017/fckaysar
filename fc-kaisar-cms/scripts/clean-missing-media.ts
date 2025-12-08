/**
 * Clean Missing Media Files
 * Removes media records from database where files don't exist on disk
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'

const MEDIA_DIR = path.join(process.cwd(), 'public/media')

async function cleanMissingMedia() {
  console.log('🧹 Starting media cleanup...')

  const payload = await getPayload({ config })

  // Get all media records
  const { docs: mediaFiles } = await payload.find({
    collection: 'media',
    limit: 1000,
    depth: 0,
  })

  console.log(`📊 Found ${mediaFiles.length} media records in database`)

  let removedCount = 0
  let keptCount = 0

  for (const media of mediaFiles) {
    // @ts-expect-error - filename exists on media
    const filename = media.filename

    if (!filename) {
      console.log(`⚠️  Skipping record ${media.id} - no filename`)
      continue
    }

    const filePath = path.join(MEDIA_DIR, filename)
    const exists = fs.existsSync(filePath)

    if (!exists) {
      console.log(`❌ Removing: ${filename} (file not found)`)
      await payload.delete({
        collection: 'media',
        id: media.id,
      })
      removedCount++
    } else {
      keptCount++
    }
  }

  console.log('\n✅ Cleanup complete!')
  console.log(`   - Removed: ${removedCount} missing files`)
  console.log(`   - Kept: ${keptCount} existing files`)

  process.exit(0)
}

cleanMissingMedia().catch((error) => {
  console.error('❌ Error during cleanup:', error)
  process.exit(1)
})
