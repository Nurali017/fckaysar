/**
 * Script to set a hero player for the landing page
 * Usage: npm run set-hero -- <jerseyNumber>
 */

import dotenv from 'dotenv'
import { getPayload } from 'payload'
import config from '@payload-config'

// Load environment variables
dotenv.config()

const DEFAULT_TEAM_ID = parseInt(process.env.FC_KAISAR_TEAM_ID || '94', 10)

async function setHeroPlayer() {
  const jerseyNumber = process.argv[2] ? parseInt(process.argv[2]) : 35 // Default: Mokin (#35)

  console.log(`\n🎯 Setting hero player with jersey number: ${jerseyNumber}\n`)

  try {
    const payload = await getPayload({ config })

    // 1. Remove hero status from all players
    console.log('📝 Removing hero status from all players...')
    const allPlayers = await payload.find({
      collection: 'players',
      where: {
        teamId: { equals: DEFAULT_TEAM_ID },
        isHero: { equals: true },
      },
      limit: 100,
    })

    for (const player of allPlayers.docs) {
      await payload.update({
        collection: 'players',
        id: player.id,
        data: {
          isHero: false,
        },
      })
    }

    console.log(`   ✅ Removed hero status from ${allPlayers.docs.length} player(s)\n`)

    // 2. Find player by jersey number
    console.log(`🔍 Finding player with jersey number ${jerseyNumber}...`)
    const result = await payload.find({
      collection: 'players',
      where: {
        teamId: { equals: DEFAULT_TEAM_ID },
        jerseyNumber: { equals: jerseyNumber },
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      console.error(`❌ Player with jersey number ${jerseyNumber} not found!`)
      process.exit(1)
    }

    const player = result.docs[0]
    console.log(`   ✅ Found: ${player.firstName} ${player.lastName}\n`)

    // 3. Set as hero
    console.log('⭐ Setting as hero player...')
    await payload.update({
      collection: 'players',
      id: player.id,
      data: {
        isHero: true,
      },
    })

    console.log(`   ✅ ${player.firstName} ${player.lastName} is now the hero player!\n`)
    console.log('═══════════════════════════════════════════════════════')
    console.log(`🎉 Hero player set successfully!`)
    console.log(`   Name: ${player.firstName} ${player.lastName}`)
    console.log(`   Jersey: #${player.jerseyNumber}`)
    console.log(`   Position: ${player.position}`)
    console.log('═══════════════════════════════════════════════════════\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error setting hero player:', error)
    process.exit(1)
  }
}

setHeroPlayer()
