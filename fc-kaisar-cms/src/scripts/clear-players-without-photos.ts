/**
 * Clear Players Without Photos
 * Удаляет только игроков БЕЗ фотографий (оставляет 8 игроков с фото)
 *
 * Usage: npm run clear:players-no-photos
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  console.log('=' .repeat(60))
  console.log('⚠️  ОЧИСТКА ИГРОКОВ БЕЗ ФОТО')
  console.log('=' .repeat(60))

  const payload = await getPayload({ config })

  // Get players WITH photos (to keep)
  const playersWithPhotos = await payload.find({
    collection: 'players',
    where: {
      teamId: { equals: 94 },
      photo: { exists: true }
    },
    limit: 100
  })

  // Get players WITHOUT photos (to delete)
  const playersWithoutPhotos = await payload.find({
    collection: 'players',
    where: {
      teamId: { equals: 94 },
      photo: { exists: false }
    },
    limit: 1000
  })

  console.log(`\n📊 Игроков С фото (оставить): ${playersWithPhotos.docs.length}`)
  console.log(`📊 Игроков БЕЗ фото (удалить): ${playersWithoutPhotos.docs.length}`)

  if (playersWithoutPhotos.docs.length === 0) {
    console.log('✅ Нет игроков для удаления')
    process.exit(0)
  }

  console.log('\n✅ ОСТАВИМ:')
  playersWithPhotos.docs.forEach((p, i) => {
    console.log(`   ${i + 1}. #${p.jerseyNumber} ${p.firstName} ${p.lastName}`)
  })

  // Delete players without photos
  console.log('\n🗑️  Удаление игроков без фото...')
  let deleted = 0
  let errors = 0

  for (const player of playersWithoutPhotos.docs) {
    try {
      await payload.delete({
        collection: 'players',
        id: player.id
      })
      deleted++
      if (deleted % 50 === 0) {
        console.log(`   Удалено: ${deleted}/${playersWithoutPhotos.docs.length}`)
      }
    } catch (error) {
      errors++
      console.error(`   ❌ Ошибка:`, error)
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
    collection: 'players',
    where: {
      teamId: { equals: 94 }
    }
  })

  console.log(`\n📊 Осталось игроков Кайсара: ${remaining.totalDocs}`)

  process.exit(0)
}

main()
