/**
 * Seed Infrastructure - Load training base/academy data with photos
 * Run: npx tsx src/scripts/seed-infrastructure.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MATERIAL_DIR = path.resolve(__dirname, '../../../material')

/**
 * Helper: Create media from local file
 */
const createMediaFromFile = async (
  payload: any,
  filePath: string,
  alt: string,
): Promise<string | null> => {
  try {
    console.log(`  📥 Loading image: ${path.basename(filePath)}`)

    if (!fs.existsSync(filePath)) {
      console.error(`  ❌ File not found: ${filePath}`)
      return null
    }

    const buffer = fs.readFileSync(filePath)
    const filename = path.basename(filePath).replace(/\s+/g, '-').toLowerCase()

    // Determine mime type
    const ext = path.extname(filePath).toLowerCase()
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
    }
    const mimetype = mimeTypes[ext] || 'image/jpeg'

    const media = await payload.create({
      collection: 'media',
      data: {
        alt,
      },
      file: {
        data: buffer,
        mimetype,
        name: filename,
        size: buffer.length,
      },
    })

    console.log(`  ✅ Created media: ${alt} (ID: ${media.id})`)
    return media.id
  } catch (error: any) {
    console.error(`  ❌ Failed to create media:`, error.message)
    return null
  }
}

/**
 * Helper: Create rich text content
 */
const createRichText = (text: string) => ({
  root: {
    type: 'root',
    children: text.split('\n\n').map((paragraph) => ({
      type: 'paragraph',
      children: [{ type: 'text', text: paragraph }],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    })),
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

const seed = async () => {
  console.log('🏟️  Starting infrastructure seed...')
  console.log(`📁 Material directory: ${MATERIAL_DIR}`)

  const payload = await getPayload({ config })

  // Check for existing infrastructure
  const existing = await payload.find({
    collection: 'infrastructure',
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log('⚠️  Infrastructure already exists. Clearing...')
    await payload.delete({ collection: 'infrastructure', where: {} })
  }

  // Get all images from material folder
  const imageFiles = fs
    .readdirSync(MATERIAL_DIR)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort()

  console.log(`📷 Found ${imageFiles.length} images:`)
  imageFiles.forEach((f) => console.log(`   - ${f}`))

  // Upload all images
  const mediaIds: string[] = []
  let mainImageId: string | null = null

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i]
    const filePath = path.join(MATERIAL_DIR, file)
    const mediaId = await createMediaFromFile(
      payload,
      filePath,
      `Тренировочная база и академия Кайсара - фото ${i + 1}`,
    )
    if (mediaId) {
      if (!mainImageId) mainImageId = mediaId
      mediaIds.push(mediaId)
    }
  }

  if (mediaIds.length === 0) {
    console.log('❌ No images uploaded, exiting...')
    process.exit(1)
  }

  // Description text from staduim file
  const descriptionRu = `Футбольный клуб «Кайсар» активно развивает свою инфраструктуру. В планах — строительство современной тренировочной базы и футбольной академии мирового уровня.

Проект включает:
• Несколько полноразмерных тренировочных полей с натуральным и искусственным покрытием
• Современный учебно-тренировочный центр с залами для физической подготовки
• Интернат для воспитанников академии
• Медицинский и восстановительный центр
• Административные здания

База станет центром подготовки молодых футболистов региона и поможет клубу растить собственных звёзд.`

  const descriptionKk = `«Қайсар» футбол клубы өз инфрақұрылымын белсенді дамытуда. Жоспарларда — әлемдік деңгейдегі заманауи жаттығу базасы мен футбол академиясын салу.

Жоба құрамына кіреді:
• Табиғи және жасанды жабындысы бар бірнеше толық өлшемді жаттығу алаңдары
• Дене шынықтыру залдары бар заманауи оқу-жаттығу орталығы
• Академия тәрбиеленушілері үшін интернат
• Медициналық және қалпына келтіру орталығы
• Әкімшілік ғимараттар

База аймақтың жас футболшыларын даярлау орталығына айналып, клубқа өз жұлдыздарын өсіруге көмектеседі.`

  const descriptionEn = `FC Kaisar is actively developing its infrastructure. Plans include construction of a modern training base and world-class football academy.

The project includes:
• Several full-size training fields with natural and artificial turf
• Modern training center with fitness facilities
• Boarding school for academy players
• Medical and recovery center
• Administrative buildings

The base will become a center for training young footballers in the region and help the club develop its own stars.`

  // Create infrastructure entry
  console.log('\n🏗️  Creating infrastructure entry...')

  const infrastructure = await payload.create({
    collection: 'infrastructure',
    data: {
      name: 'Тренировочная база и Академия',
      type: 'academy',
      status: 'construction',
      shortDescription: 'Современная тренировочная база и футбольная академия ФК Кайсар',
      description: createRichText(descriptionRu),
      mainImage: mainImageId,
      gallery: mediaIds,
      features: [
        {
          title: 'Тренировочные поля',
          description: 'Несколько полноразмерных полей с натуральным и искусственным покрытием',
        },
        {
          title: 'Учебный центр',
          description: 'Современные залы для физической подготовки и теоретических занятий',
        },
        {
          title: 'Интернат',
          description: 'Комфортное проживание для воспитанников академии',
        },
        {
          title: 'Медицинский центр',
          description: 'Полный спектр медицинских и восстановительных услуг',
        },
      ],
      address: 'г. Кызылорда, Казахстан',
      order: 1,
    },
    locale: 'ru',
  })

  console.log(`  ✅ Created: ${infrastructure.id}`)

  // Update with kk locale
  await payload.update({
    collection: 'infrastructure',
    id: infrastructure.id,
    data: {
      name: 'Жаттығу базасы және Академия',
      shortDescription: '«Қайсар» ФК-нің заманауи жаттығу базасы мен футбол академиясы',
      description: createRichText(descriptionKk),
      features: [
        {
          title: 'Жаттығу алаңдары',
          description: 'Табиғи және жасанды жабындысы бар бірнеше толық өлшемді алаңдар',
        },
        {
          title: 'Оқу орталығы',
          description: 'Дене шынықтыру және теориялық сабақтарға арналған заманауи залдар',
        },
        {
          title: 'Интернат',
          description: 'Академия тәрбиеленушілері үшін жайлы тұру',
        },
        {
          title: 'Медициналық орталық',
          description: 'Медициналық және қалпына келтіру қызметтерінің толық спектрі',
        },
      ],
      address: 'Қызылорда қ., Қазақстан',
    },
    locale: 'kk',
  })

  // Update with en locale
  await payload.update({
    collection: 'infrastructure',
    id: infrastructure.id,
    data: {
      name: 'Training Base and Academy',
      shortDescription: 'Modern training base and football academy of FC Kaisar',
      description: createRichText(descriptionEn),
      features: [
        {
          title: 'Training Fields',
          description: 'Several full-size fields with natural and artificial turf',
        },
        {
          title: 'Training Center',
          description: 'Modern facilities for physical training and theoretical sessions',
        },
        {
          title: 'Boarding School',
          description: 'Comfortable accommodation for academy players',
        },
        {
          title: 'Medical Center',
          description: 'Full range of medical and recovery services',
        },
      ],
      address: 'Kyzylorda, Kazakhstan',
    },
    locale: 'en',
  })

  console.log('  ✅ Added kk/en translations')

  console.log('\n✅ Infrastructure seed completed!')
  console.log(`   - Uploaded ${mediaIds.length} images`)
  console.log('   - Created Training Base & Academy entry')
  console.log('   Note: Stadium has separate page at /stadium')

  process.exit(0)
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error)
  process.exit(1)
})
