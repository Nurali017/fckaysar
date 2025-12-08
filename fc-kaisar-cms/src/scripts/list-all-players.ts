/**
 * List All Players
 * Показывает всех игроков Кайсара в базе
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })

  const players = await payload.find({
    collection: 'players',
    where: { teamId: { equals: 94 } },
    limit: 100,
    sort: 'jerseyNumber'
  })

  console.log('\n' + '='.repeat(70))
  console.log('Все игроки Кайсара в базе данных')
  console.log('='.repeat(70))

  players.docs.forEach((p, i) => {
    const hasPhoto = p.photo ? '✓' : '✗'
    const num = (p.jerseyNumber || '').toString().padStart(2, ' ')
    console.log(`${(i + 1).toString().padStart(2)}. [${hasPhoto}] #${num} ${p.firstName} ${p.lastName}`)
  })

  console.log('='.repeat(70))
  console.log(`Всего: ${players.docs.length} игроков`)
  console.log(`С фото: ${players.docs.filter(p => p.photo).length}`)
  console.log(`Без фото: ${players.docs.filter(p => !p.photo).length}`)
  console.log('='.repeat(70))

  process.exit(0)
}

main()
