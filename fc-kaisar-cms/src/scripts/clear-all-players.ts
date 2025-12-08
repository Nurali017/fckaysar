/**
 * Clear All Players Script
 * Removes ALL players from database
 *
 * Usage: npm run clear:players
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  console.log('=' .repeat(60))
  console.log('⚠️  ОЧИСТКА ВСЕХ ИГРОКОВ')
  console.log('=' .repeat(60))

  const payload = await getPayload({ config })

  // Get all players
  const allPlayers = await payload.find({
    collection: 'players',
    limit: 1000
  })

  console.log(`\n📊 Всего игроков в базе: ${allPlayers.docs.length}`)

  if (allPlayers.docs.length === 0) {
    console.log('✅ База уже пустая')
    process.exit(0)
  }

  // Ask for confirmation
  const { createInterface } = await import('readline')
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const answer = await new Promise<string>(resolve => {
    readline.question(`\n⚠️  Удалить ${allPlayers.docs.length} игроков? (yes/no): `, resolve)
  })

  readline.close()

  if (answer.toLowerCase() !== 'yes') {
    console.log('\n❌ Операция отменена')
    process.exit(0)
  }

  // Delete all
  console.log('\n🗑️  Удаление игроков...')
  let deleted = 0
  let errors = 0

  for (const player of allPlayers.docs) {
    try {
      await payload.delete({
        collection: 'players',
        id: player.id
      })
      deleted++
      if (deleted % 50 === 0) {
        console.log(`   Удалено: ${deleted}/${allPlayers.docs.length}`)
      }
    } catch (error) {
      errors++
      console.error(`   ❌ Ошибка удаления игрока:`, error)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('Результат:')
  console.log('='.repeat(60))
  console.log(`✅ Удалено: ${deleted}`)
  console.log(`❌ Ошибок: ${errors}`)
  console.log('='.repeat(60))

  // Verify
  const remaining = await payload.count({
    collection: 'players'
  })

  console.log(`\n📊 Осталось игроков: ${remaining.totalDocs}`)

  process.exit(0)
}

main()
