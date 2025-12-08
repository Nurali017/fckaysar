/**
 * Player Photos Migration Script
 * Migrates player photos from frontend public folder to Payload CMS
 *
 * Usage: npm run migrate:photos
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface PlayerMapping {
  [key: string]: string
}

interface MigrationResult {
  success: boolean
  totalPhotos: number
  uploaded: number
  linked: number
  skipped: number
  errors: number
  errorMessages: string[]
  duration: number
}

/**
 * Normalize player name for matching (with Kazakh transliteration)
 */
function normalizePlayerName(name: string): string {
  const transliterated = name
    .replace(/[әӘ]/g, 'а')
    .replace(/[ғҒ]/g, 'г')
    .replace(/[қҚ]/g, 'к')
    .replace(/[ңҢ]/g, 'н')
    .replace(/[өӨ]/g, 'о')
    .replace(/[ұҰ]/g, 'у')
    .replace(/[үҮ]/g, 'у')
    .replace(/[һҺ]/g, 'х')
    .replace(/[іІ]/g, 'и')

  return transliterated
    .replace(/[^a-zA-Zа-яА-Я0-9]/g, '')
    .toUpperCase()
}

/**
 * Extract first and last name from full name
 */
function extractNames(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/)

  if (parts.length >= 2) {
    // Format: "ФАМИЛИЯ Имя" or "Фамилия Имя"
    const lastName = parts[0]
    const firstName = parts.slice(1).join(' ')
    return { firstName, lastName }
  }

  return { firstName: fullName, lastName: '' }
}

/**
 * Main migration function
 */
async function migratePlayerPhotos(): Promise<MigrationResult> {
  const startTime = Date.now()

  console.log('=' .repeat(60))
  console.log('FC Kaisar - Player Photos Migration')
  console.log('=' .repeat(60))
  console.log('Migrating player photos from /public/images/players/ to CMS\n')

  let uploaded = 0
  let linked = 0
  let skipped = 0
  let errors = 0
  const errorMessages: string[] = []

  try {
    const payload = await getPayload({ config })

    // Load player name to photo mapping
    const cmsRoot = path.resolve(__dirname, '../../')
    const mappingPath = path.join(cmsRoot, 'media/kff-players-map.json')
    const photosDir = path.join(cmsRoot, 'media/players')

    console.log(`📂 CMS root: ${cmsRoot}`)
    console.log(`📄 Mapping file: ${mappingPath}`)
    console.log(`📁 Photos directory: ${photosDir}\n`)

    // Check if mapping file exists
    if (!fs.existsSync(mappingPath)) {
      throw new Error(`Mapping file not found: ${mappingPath}`)
    }

    // Check if photos directory exists
    if (!fs.existsSync(photosDir)) {
      throw new Error(`Photos directory not found: ${photosDir}`)
    }

    // Load mapping
    const mappingContent = fs.readFileSync(mappingPath, 'utf-8')
    const playerMapping: PlayerMapping = JSON.parse(mappingContent)

    const totalPhotos = Object.keys(playerMapping).length
    console.log(`📊 Found ${totalPhotos} player photo mappings\n`)

    // Get all players from CMS
    const allPlayers = await payload.find({
      collection: 'players',
      limit: 1000,
      where: {
        status: { equals: 'active' }
      }
    })

    console.log(`👥 Found ${allPlayers.docs.length} active players in CMS\n`)
    console.log('─'.repeat(60))

    // Process each player photo
    for (const [playerFullName, photoPath] of Object.entries(playerMapping)) {
      const photoFileName = path.basename(photoPath)
      const fullPhotoPath = path.join(photosDir, photoFileName)

      console.log(`\n🔍 Processing: ${playerFullName}`)
      console.log(`   Photo: ${photoFileName}`)

      // Check if photo file exists
      if (!fs.existsSync(fullPhotoPath)) {
        console.log(`   ⚠️  Photo file not found: ${fullPhotoPath}`)
        errors++
        errorMessages.push(`Photo not found for ${playerFullName}: ${photoFileName}`)
        continue
      }

      try {
        // Extract names
        const { firstName, lastName } = extractNames(playerFullName)
        console.log(`   Names: ${firstName} ${lastName}`)

        // Find matching player in CMS
        const normalizedFullName = normalizePlayerName(playerFullName)

        // Try multiple matching strategies
        let matchedPlayer = allPlayers.docs.find(p => {
          const cmsFullName = `${p.firstName} ${p.lastName}`.trim()
          const normalizedCMS = normalizePlayerName(cmsFullName)
          return normalizedCMS === normalizedFullName
        })

        // Try matching by last name only if full name didn't match
        if (!matchedPlayer) {
          matchedPlayer = allPlayers.docs.find(p => {
            const normalizedLastName = normalizePlayerName(lastName)
            const normalizedCMSLastName = normalizePlayerName(p.lastName)
            return normalizedCMSLastName === normalizedLastName
          })
        }

        if (!matchedPlayer) {
          console.log(`   ⚠️  Player not found in CMS`)
          skipped++
          continue
        }

        console.log(`   ✓ Matched player: ${matchedPlayer.firstName} ${matchedPlayer.lastName} (ID: ${matchedPlayer.id})`)

        // Check if player already has a photo
        if (matchedPlayer.photo) {
          console.log(`   ⏭️  Player already has a photo (skipping)`)
          skipped++
          continue
        }

        // Read photo file
        const photoBuffer = fs.readFileSync(fullPhotoPath)
        const fileExtension = path.extname(photoFileName)
        const mimeType = fileExtension === '.png' ? 'image/png' : 'image/webp'

        console.log(`   📤 Uploading photo (${(photoBuffer.length / 1024).toFixed(2)} KB)...`)

        // Create file object in Node.js format for Payload
        const fileToUpload = {
          data: photoBuffer,
          name: photoFileName,
          mimetype: mimeType,
          size: photoBuffer.length
        }

        // Upload to Media collection
        const mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: `${matchedPlayer.firstName} ${matchedPlayer.lastName} - FC Kaisar`
          },
          file: fileToUpload as any
        })

        console.log(`   ✓ Photo uploaded to Media (ID: ${mediaDoc.id})`)
        uploaded++

        // Link photo to player
        await payload.update({
          collection: 'players',
          id: matchedPlayer.id,
          data: {
            photo: mediaDoc.id
          }
        })

        console.log(`   ✓ Photo linked to player`)
        linked++

      } catch (error) {
        console.error(`   ❌ Error processing ${playerFullName}:`, error)
        errors++
        errorMessages.push(`Error for ${playerFullName}: ${error instanceof Error ? error.message : String(error)}`)
      }

      // Small delay to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    const duration = Date.now() - startTime

    console.log('\n' + '='.repeat(60))
    console.log('Migration Summary')
    console.log('='.repeat(60))
    console.log(`Total photos in mapping: ${totalPhotos}`)
    console.log(`✓ Uploaded: ${uploaded}`)
    console.log(`✓ Linked to players: ${linked}`)
    console.log(`⏭️  Skipped: ${skipped}`)
    console.log(`❌ Errors: ${errors}`)
    console.log(`⏱️  Duration: ${(duration / 1000).toFixed(2)}s`)

    if (errorMessages.length > 0) {
      console.log('\n❌ Errors:')
      errorMessages.forEach(msg => console.log(`   - ${msg}`))
    }

    console.log('\n' + '='.repeat(60))

    return {
      success: errors === 0,
      totalPhotos,
      uploaded,
      linked,
      skipped,
      errors,
      errorMessages,
      duration
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    return {
      success: false,
      totalPhotos: 0,
      uploaded: 0,
      linked: 0,
      skipped: 0,
      errors: 1,
      errorMessages: [error instanceof Error ? error.message : String(error)],
      duration: Date.now() - startTime
    }
  }
}

// Run migration
migratePlayerPhotos()
  .then((result) => {
    console.log(`\n${result.success ? '✅' : '❌'} Migration ${result.success ? 'completed successfully' : 'completed with errors'}!`)
    process.exit(result.success ? 0 : 1)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
