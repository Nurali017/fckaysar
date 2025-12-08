/**
 * Cleanup Old Players Script
 * Removes or deactivates players who are not in current Kaisar squad
 *
 * Usage: npm run cleanup:old-players
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

// Current Kaisar squad (players with photos + known active players)
const CURRENT_KAISAR_SQUAD = [
  'Нурымжан Салайдин',
  'Александр Мокин',
  'Никита Губарев',
  'Данияр Семченков',
  'Оркен Махан',
  'Елжас Алтынбеков',
  'Азамат Серикбаев',
  'Ален Айманов',
  // Add more current players if known
]

async function main() {
  console.log('=' .repeat(60))
  console.log('FC Kaisar - Cleanup Old Players')
  console.log('=' .repeat(60))

  const payload = await getPayload({ config })

  // Get all Kaisar players
  const allPlayers = await payload.find({
    collection: 'players',
    where: {
      teamId: { equals: 94 },
    },
    limit: 1000
  })

  console.log(`\n📊 Всего игроков с teamId=94: ${allPlayers.docs.length}`)

  // Get current season ID
  const currentSeasonId = parseInt(process.env.SOTA_CURRENT_SEASON_ID || '61', 10)
  console.log(`🗓️  Текущий сезон ID: ${currentSeasonId}`)

  // Find players to keep (current squad)
  const playersToKeep = allPlayers.docs.filter(player => {
    const fullName = `${player.firstName} ${player.lastName}`

    // Keep if:
    // 1. Has a photo (confirmed current player)
    if (player.photo) return true

    // 2. Is in current squad list
    if (CURRENT_KAISAR_SQUAD.includes(fullName)) return true

    // 3. Has recent stats for current season
    if (player.currentSeasonStats?.seasonId === currentSeasonId &&
        player.currentSeasonStats?.appearances > 0) return true

    return false
  })

  const playersToRemove = allPlayers.docs.filter(player => {
    return !playersToKeep.find(p => p.id === player.id)
  })

  console.log(`\n✅ Игроков для сохранения: ${playersToKeep.length}`)
  console.log(`❌ Игроков для удаления: ${playersToRemove.length}`)

  console.log('\n' + '-'.repeat(60))
  console.log('ТЕКУЩИЙ СОСТАВ (будут сохранены):')
  console.log('-'.repeat(60))
  playersToKeep.forEach((player, index) => {
    const fullName = `${player.firstName} ${player.lastName}`
    const number = player.jerseyNumber ? `#${player.jerseyNumber}` : '---'
    const hasPhoto = player.photo ? '📸' : '  '
    console.log(`${(index + 1).toString().padStart(2)}. ${hasPhoto} ${number.padEnd(5)} ${fullName}`)
  })

  // Ask for confirmation
  console.log('\n' + '='.repeat(60))
  console.log('⚠️  ВНИМАНИЕ: Будет удалено ' + playersToRemove.length + ' игроков!')
  console.log('='.repeat(60))

  const { createInterface } = await import('readline')
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const answer = await new Promise<string>(resolve => {
    readline.question('\nПродолжить? (yes/no): ', resolve)
  })

  readline.close()

  if (answer.toLowerCase() !== 'yes') {
    console.log('\n❌ Операция отменена')
    process.exit(0)
  }

  // Delete old players
  console.log('\n🗑️  Удаление старых игроков...')
  let deleted = 0
  let errors = 0

  for (const player of playersToRemove) {
    try {
      await payload.delete({
        collection: 'players',
        id: player.id
      })
      deleted++
      if (deleted % 50 === 0) {
        console.log(`   Удалено: ${deleted}/${playersToRemove.length}`)
      }
    } catch (error) {
      errors++
      console.error(`   ❌ Ошибка удаления игрока ${player.firstName} ${player.lastName}:`, error)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('Результат:')
  console.log('='.repeat(60))
  console.log(`✅ Удалено: ${deleted}`)
  console.log(`❌ Ошибок: ${errors}`)
  console.log(`📊 Осталось игроков: ${playersToKeep.length}`)
  console.log('='.repeat(60))

  // Show final stats
  const finalCount = await payload.count({
    collection: 'players',
    where: {
      teamId: { equals: 94 }
    }
  })

  console.log(`\n✅ Всего игроков Кайсара в базе: ${finalCount.totalDocs}`)

  process.exit(0)
}

main()
