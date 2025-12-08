/**
 * Analyze Kaisar Players
 * Shows statistics about players in database
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })
  const currentSeasonId = parseInt(process.env.SOTA_CURRENT_SEASON_ID || '61', 10)

  // Get all Kaisar players
  const allPlayers = await payload.find({
    collection: 'players',
    where: {
      teamId: { equals: 94 },
    },
    limit: 1000
  })

  console.log('\n' + '='.repeat(70))
  console.log('FC Kaisar - Анализ игроков в базе')
  console.log('='.repeat(70))
  console.log(`📊 Всего игроков с teamId=94: ${allPlayers.docs.length}`)
  console.log(`🗓️  Текущий сезон ID: ${currentSeasonId}\n`)

  // Group players by criteria
  const withPhotos = allPlayers.docs.filter(p => p.photo)
  const withCurrentSeasonStats = allPlayers.docs.filter(p =>
    p.currentSeasonStats?.seasonId === currentSeasonId &&
    p.currentSeasonStats?.appearances > 0
  )
  const withJerseyNumber = allPlayers.docs.filter(p => p.jerseyNumber)
  const activeStatus = allPlayers.docs.filter(p => p.status === 'active')

  console.log('Категории игроков:')
  console.log('-'.repeat(70))
  console.log(`📸 С фотографиями:                    ${withPhotos.length}`)
  console.log(`⚽ Играли в текущем сезоне (${currentSeasonId}):     ${withCurrentSeasonStats.length}`)
  console.log(`🔢 С номерами на форме:               ${withJerseyNumber.length}`)
  console.log(`✅ Со статусом 'active':              ${activeStatus.length}`)

  // Find players who match multiple criteria (likely current squad)
  const likelyCurrentSquad = allPlayers.docs.filter(p => {
    const hasPhoto = !!p.photo
    const playedThisSeason = p.currentSeasonStats?.seasonId === currentSeasonId &&
                              p.currentSeasonStats?.appearances > 0
    const hasNumber = !!p.jerseyNumber

    // Player is in current squad if they match at least 2 criteria
    let score = 0
    if (hasPhoto) score++
    if (playedThisSeason) score++
    if (hasNumber) score++

    return score >= 1 // At least 1 criterion
  })

  console.log(`\n🎯 Вероятный текущий состав:          ${likelyCurrentSquad.length}`)
  console.log('-'.repeat(70))

  // Show likely current squad
  console.log('\nВероятный текущий состав Кайсара:')
  console.log('='.repeat(70))
  likelyCurrentSquad
    .sort((a, b) => (a.jerseyNumber || 999) - (b.jerseyNumber || 999))
    .forEach((player, index) => {
      const fullName = `${player.firstName} ${player.lastName}`
      const number = player.jerseyNumber ? `#${player.jerseyNumber.toString().padStart(2, ' ')}` : '---'
      const hasPhoto = player.photo ? '📸' : '  '
      const appearances = player.currentSeasonStats?.appearances || 0
      const stats = appearances > 0 ? `(${appearances} игр)` : ''

      console.log(
        `${(index + 1).toString().padStart(2)}. ${hasPhoto} ${number} ${fullName.padEnd(35)} ${stats}`
      )
    })

  // Players to potentially remove
  const toRemove = allPlayers.docs.filter(p => !likelyCurrentSquad.includes(p))

  console.log('\n' + '='.repeat(70))
  console.log(`❌ Игроков для удаления: ${toRemove.length}`)
  console.log('   (игроки без фото, номера и без игр в текущем сезоне)')
  console.log('='.repeat(70))

  console.log('\n💡 Рекомендация:')
  console.log(`   Оставить: ${likelyCurrentSquad.length} игроков`)
  console.log(`   Удалить: ${toRemove.length} старых игроков`)

  process.exit(0)
}

main()
