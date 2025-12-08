import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })

  // Get Kaisar players only (teamId: 94)
  const kaisarPlayers = await payload.find({
    collection: 'players',
    where: {
      teamId: { equals: 94 },
      status: { equals: 'active' }
    },
    limit: 1000,
    sort: 'lastName'
  })

  // Get only players with photos
  const playersWithPhotos = await payload.find({
    collection: 'players',
    where: {
      teamId: { equals: 94 },
      status: { equals: 'active' },
      photo: { exists: true }
    },
    limit: 100
  })

  console.log(`\nКоманда Кайсар - Всего игроков в CMS: ${kaisarPlayers.docs.length}`)
  console.log(`Игроков с фото: ${playersWithPhotos.docs.length}`)
  console.log(`Игроков без фото: ${kaisarPlayers.docs.length - playersWithPhotos.docs.length}\n`)

  // Show players with photos
  console.log('='.repeat(60))
  console.log('ИГРОКИ С ФОТО:')
  console.log('='.repeat(60))
  playersWithPhotos.docs.forEach((player, index) => {
    const fullName = `${player.firstName} ${player.lastName}`
    const number = player.jerseyNumber ? `#${player.jerseyNumber}` : '---'
    const photoId = typeof player.photo === 'string' ? player.photo : (player.photo as any)?.id
    console.log(`${index + 1}. ${number.padEnd(5)} ${fullName.padEnd(30)} Photo ID: ${photoId}`)
  })
  console.log('='.repeat(60))

  process.exit(0)
}

main()
