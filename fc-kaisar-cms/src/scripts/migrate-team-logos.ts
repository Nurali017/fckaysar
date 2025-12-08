/**
 * Team Logos Migration Script
 * Downloads team logos from SOTA API and uploads them to Payload CMS
 *
 * Usage: npm run migrate:team-logos
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sotaClient } from '../lib/sota-client'

interface MigrationResult {
  success: boolean
  totalTeams: number
  uploaded: number
  skipped: number
  errors: number
  errorMessages: string[]
  duration: number
}

/**
 * Download image from URL and return as Buffer
 */
async function downloadImage(url: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
  try {
    // Handle relative URLs
    const fullUrl = url.startsWith('http') ? url : `https://sota.id${url}`

    console.log(`   📥 Downloading: ${fullUrl}`)

    const response = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'FC-Kaisar-CMS/1.0',
      },
    })

    if (!response.ok) {
      console.log(`   ⚠️  Failed to download: ${response.status} ${response.statusText}`)
      return null
    }

    const contentType = response.headers.get('content-type') || 'image/png'
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log(`   ✓ Downloaded ${(buffer.length / 1024).toFixed(2)} KB`)

    return {
      buffer,
      mimeType: contentType.split(';')[0].trim(),
    }
  } catch (error) {
    console.error(`   ❌ Download error:`, error)
    return null
  }
}

/**
 * Get file extension from mime type
 */
function getExtension(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'image/gif': '.gif',
  }
  return mimeToExt[mimeType] || '.png'
}

/**
 * Main migration function
 */
async function migrateTeamLogos(): Promise<MigrationResult> {
  const startTime = Date.now()

  console.log('='.repeat(60))
  console.log('FC Kaisar - Team Logos Migration')
  console.log('='.repeat(60))
  console.log('Downloading team logos from SOTA API and uploading to CMS\n')

  let uploaded = 0
  let skipped = 0
  let errors = 0
  const errorMessages: string[] = []

  try {
    const payload = await getPayload({ config })

    // Get teams from SOTA API
    console.log('📡 Fetching teams from SOTA API...')
    const standings = await sotaClient.getScoreTable(61, 'ru')
    const totalTeams = standings.length

    console.log(`📊 Found ${totalTeams} teams\n`)
    console.log('─'.repeat(60))

    // Process each team
    for (const team of standings) {
      console.log(`\n🔍 Processing: ${team.teamName} (ID: ${team.teamId})`)

      // Check if logo already exists
      const existing = await payload.find({
        collection: 'team-logos',
        where: {
          teamId: { equals: team.teamId },
        },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`   ⏭️  Logo already exists (skipping)`)
        skipped++
        continue
      }

      // Check if team has logo URL
      if (!team.teamLogo) {
        console.log(`   ⚠️  No logo URL available`)
        skipped++
        continue
      }

      try {
        // Download logo
        const downloaded = await downloadImage(team.teamLogo)

        if (!downloaded) {
          errors++
          errorMessages.push(`Failed to download logo for ${team.teamName}`)
          continue
        }

        const { buffer, mimeType } = downloaded
        const extension = getExtension(mimeType)
        const filename = `team-logo-${team.teamId}${extension}`

        // Upload to Media collection
        const fileToUpload = {
          data: buffer,
          name: filename,
          mimetype: mimeType,
          size: buffer.length,
        }

        console.log(`   📤 Uploading to Media...`)

        const mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: `${team.teamName} logo`,
          },
          file: fileToUpload as any,
        })

        console.log(`   ✓ Media created (ID: ${mediaDoc.id})`)

        // Create TeamLogos entry
        await payload.create({
          collection: 'team-logos',
          data: {
            teamId: team.teamId,
            teamName: team.teamName,
            logo: mediaDoc.id,
          },
        })

        console.log(`   ✓ TeamLogo entry created`)
        uploaded++
      } catch (error) {
        console.error(`   ❌ Error processing ${team.teamName}:`, error)
        errors++
        errorMessages.push(`Error for ${team.teamName}: ${error instanceof Error ? error.message : String(error)}`)
      }

      // Small delay to avoid overwhelming the system
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    const duration = Date.now() - startTime

    console.log('\n' + '='.repeat(60))
    console.log('Migration Summary')
    console.log('='.repeat(60))
    console.log(`Total teams: ${totalTeams}`)
    console.log(`✓ Uploaded: ${uploaded}`)
    console.log(`⏭️  Skipped: ${skipped}`)
    console.log(`❌ Errors: ${errors}`)
    console.log(`⏱️  Duration: ${(duration / 1000).toFixed(2)}s`)

    if (errorMessages.length > 0) {
      console.log('\n❌ Errors:')
      errorMessages.forEach((msg) => console.log(`   - ${msg}`))
    }

    console.log('\n' + '='.repeat(60))

    return {
      success: errors === 0,
      totalTeams,
      uploaded,
      skipped,
      errors,
      errorMessages,
      duration,
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    return {
      success: false,
      totalTeams: 0,
      uploaded: 0,
      skipped: 0,
      errors: 1,
      errorMessages: [error instanceof Error ? error.message : String(error)],
      duration: Date.now() - startTime,
    }
  }
}

// Run migration
migrateTeamLogos()
  .then((result) => {
    console.log(`\n${result.success ? '✅' : '❌'} Migration ${result.success ? 'completed successfully' : 'completed with errors'}!`)
    process.exit(result.success ? 0 : 1)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
