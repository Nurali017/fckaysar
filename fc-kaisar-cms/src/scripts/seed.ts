/**
 * Seed Script - Populate CMS with test data
 * Run: pnpm seed
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import axios from 'axios'
import { Readable } from 'stream'

/**
 * Helper: Download image from URL and create media in CMS
 */
const createMediaFromUrl = async (payload: any, url: string, alt: string): Promise<string | null> => {
  try {
    console.log(`  📥 Downloading image: ${alt}`)

    // Download image as buffer
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
    })

    // Get filename from URL or generate one
    const urlParts = url.split('/')
    const filename = urlParts[urlParts.length - 1] || `image-${Date.now()}.jpg`

    // Convert buffer to stream (Payload expects stream or file)
    const buffer = Buffer.from(response.data)
    const stream = Readable.from(buffer)

    // Create media in Payload
    const media = await payload.create({
      collection: 'media',
      data: {
        alt,
      },
      file: {
        data: buffer,
        mimetype: response.headers['content-type'] || 'image/jpeg',
        name: filename,
        size: buffer.length,
      },
    })

    console.log(`  ✅ Created media: ${alt} (ID: ${media.id})`)
    return media.id
  } catch (error: any) {
    console.error(`  ❌ Failed to download ${alt}:`, error.message)
    return null
  }
}

const seed = async () => {
  console.log('🌱 Starting seed...')

  const payload = await getPayload({ config })

  // Clear existing test data (optional - be careful in production!)
  console.log('🗑️  Clearing existing data...')
  try {
    await payload.delete({ collection: 'polls', where: {} })
    await payload.delete({ collection: 'gallery', where: {} })
    await payload.delete({ collection: 'news', where: {} })
    await payload.delete({ collection: 'media', where: {} })
  } catch (e) {
    console.log('Some collections may not exist yet, continuing...')
  }

  // ============================================
  // 1. Seed Media (images for news/gallery)
  // ============================================
  console.log('📷 Seeding media...')

  // For simplicity, we'll create placeholder media entries
  // In production, you'd upload actual files
  const mediaItems = [
    { alt: 'Матч Кайсар - Астана', filename: 'match-kaisar-astana.jpg' },
    { alt: 'Тренировка команды', filename: 'training-session.jpg' },
    { alt: 'Пресс-конференция', filename: 'press-conference.jpg' },
    { alt: 'Фанаты на стадионе', filename: 'fans-stadium.jpg' },
    { alt: 'Гол Кайсара', filename: 'kaisar-goal.jpg' },
    { alt: 'Команда после победы', filename: 'team-celebration.jpg' },
  ]

  // Note: In Payload CMS, media upload requires actual file
  // For seed script, we'll skip media and create news without images
  // Or use external URLs if configured

  // ============================================
  // 2. Seed Polls
  // ============================================
  console.log('📊 Seeding polls...')

  const polls = [
    {
      question: 'Кто станет лучшим бомбардиром сезона?',
      slug: 'best-scorer-2025',
      description: 'Голосуйте за игрока, который забьёт больше всех голов в этом сезоне',
      options: [
        { optionText: 'Ислам Чесноков', votes: 145 },
        { optionText: 'Валерий Громыко', votes: 89 },
        { optionText: 'Руслан Юденцов', votes: 67 },
        { optionText: 'Другой игрок', votes: 23 },
      ],
      status: 'active' as const,
      featured: true,
      totalVotes: 324,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days
    },
    {
      question: 'Какой матч был самым захватывающим?',
      slug: 'best-match-autumn-2024',
      description: 'Выберите самый запоминающийся матч осеннего сезона',
      options: [
        { optionText: 'Кайсар - Астана (3:2)', votes: 234 },
        { optionText: 'Кайрат - Кайсар (1:1)', votes: 156 },
        { optionText: 'Кайсар - Ордабасы (2:0)', votes: 89 },
      ],
      status: 'closed' as const,
      featured: false,
      totalVotes: 479,
      startDate: new Date('2024-11-01').toISOString(),
      endDate: new Date('2024-12-01').toISOString(),
    },
    {
      question: 'Какую форму предпочитаете?',
      slug: 'favorite-jersey-2025',
      description: 'Голосуйте за вашу любимую форму команды',
      options: [
        { optionText: 'Домашняя (красная)', votes: 0 },
        { optionText: 'Гостевая (белая)', votes: 0 },
        { optionText: 'Третья (чёрная)', votes: 0 },
      ],
      status: 'active' as const,
      featured: false,
      totalVotes: 0,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // +60 days
    },
  ]

  for (const poll of polls) {
    await payload.create({
      collection: 'polls',
      data: poll,
    })
    console.log(`  ✓ Created poll: ${poll.question}`)
  }

  // ============================================
  // 3. Seed News (with images from URLs)
  // ============================================
  console.log('📰 Seeding news...')

  // Helper function to create rich text content
  const createRichText = (text: string) => ({
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text }],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  })

  // News items with multilingual content and external images
  const newsItems = [
    // Farewell News #1: Viktor Kumykov
    {
      imageUrl: 'https://vesti.kz/userdata/news/2025/news_372838/crop_amp/photo_243961.jpg',
      imageAlt: 'Виктор Кумыков',
      title: {
        kk: 'Рахмет, Виктор Кумыков!',
        ru: 'Спасибо, Виктор Кумыков!',
        en: 'Thank You, Viktor Kumykov!',
      },
      slug: {
        kk: 'rahmet-viktor-kumykov',
        ru: 'spasibo-viktor-kumykov',
        en: 'thank-you-viktor-kumykov',
      },
      excerpt: {
        kk: 'Кәсіпқойлық, мінез және клубқа адалдығыңыз үшін рахмет. Сіз мәңгі "Қайсар" тарихының бір бөлігі боласыз.',
        ru: 'Спасибо за профессионализм, характер и преданность клубу. Вы навсегда останетесь частью истории "Кайсара".',
        en: 'Thank you for professionalism, character and dedication to the club. You will forever remain part of Kaisar\'s history.',
      },
      content: {
        kk: createRichText('Бас бапкер Виктор Кумыков 2023-2025 жылдары командаға көшбасшылық етті. 65 матчта 21 жеңіс. Кәсіпқойлық, мінез және клубқа адалдығыңыз үшін рахмет. Сіз мәңгі "Қайсар" тарихының бір бөлігі боласыз.'),
        ru: createRichText('Главный тренер Виктор Кумыков руководил командой в 2023-2025 годах. 65 матчей, 21 победа. Спасибо за профессионализм, характер и преданность клубу. Вы навсегда останетесь частью истории "Кайсара".'),
        en: createRichText('Head coach Viktor Kumykov led the team in 2023-2025. 65 matches, 21 wins. Thank you for professionalism, character and dedication to the club. You will forever remain part of Kaisar\'s history.'),
      },
      category: 'interview',
      featured: true,
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      tags: [{ tag: 'тренер' }, { tag: 'прощание' }],
    },
    // Farewell News #2: Aibар Zhaksylykov
    {
      imageUrl: 'https://vesti.kz/userdata/news/2025/news_373036/crop_b/photo_244162.jpg',
      imageAlt: 'Айбар Жаксылыков',
      title: {
        kk: 'Рахмет, Айбар Жаксылыков!',
        ru: 'Спасибо, Айбар Жаксылыков!',
        en: 'Thank You, Aibar Zhaksylykov!',
      },
      slug: {
        kk: 'rahmet-aibar-zhaksylykov',
        ru: 'spasibo-aibar-zhaksylykov',
        en: 'thank-you-aibar-zhaksylykov',
      },
      excerpt: {
        kk: 'Біздің капитанымыз, біздің көшбасшымыз, біздің тәрбиеленушіміз. Жаңа қызметте сәттілік! Туған клубының есігі әрқашан ашық.',
        ru: 'Наш капитан, наш лидер, наш воспитанник. Удачи в новом вызове! Двери родного клуба всегда открыты.',
        en: 'Our captain, our leader, our academy graduate. Good luck in your new challenge! The doors of your home club are always open.',
      },
      content: {
        kk: createRichText('Капитан және шабуылшы Айбар Жаксылыков. 120 матч, 35 гол. Біздің капитанымыз, біздің көшбасшымыз, біздің тәрбиеленушіміз. Жаңа қызметте сәттілік! Туған клубының есігі әрқашан ашық.'),
        ru: createRichText('Капитан и нападающий Айбар Жаксылыков. 120 матчей, 35 голов. Наш капитан, наш лидер, наш воспитанник. Удачи в новом вызове! Двери родного клуба всегда открыты.'),
        en: createRichText('Captain and forward Aibar Zhaksylykov. 120 matches, 35 goals. Our captain, our leader, our academy graduate. Good luck in your new challenge! The doors of your home club are always open.'),
      },
      category: 'news',
      featured: true,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      tags: [{ tag: 'капитан' }, { tag: 'прощание' }],
    },
    // Mock News #1
    {
      imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
      imageAlt: 'Футбольная тренировка',
      title: {
        kk: 'Kaysar жаңа маусымға дайындалуды бастады',
        ru: 'Кайсар начал подготовку к новому сезону',
        en: 'Kaisar started preparation for the new season',
      },
      slug: {
        kk: 'kaysar-zhana-mausymga-dayindaludi-bastadi',
        ru: 'kaisar-nachal-podgotovku',
        en: 'kaisar-started-preparation',
      },
      excerpt: {
        kk: 'Команда алдағы маусымға қарсаңындағы алғашқы жаттығуын өткізді',
        ru: 'Команда провела первую тренировку перед началом нового сезона',
        en: 'The team held its first training session before the start of the new season',
      },
      content: {
        kk: createRichText('ФК Қайсар жаңа маусымға дайындықты бастады. Команда алдағы маусымға қарсаңындағы алғашқы жаттығуын өткізді. Жаттығулар қарқынды режимде өтеді.'),
        ru: createRichText('ФК Кайсар начал подготовку к новому сезону. Команда провела первую тренировку перед началом нового сезона. Тренировки проходят в интенсивном режиме.'),
        en: createRichText('FC Kaisar started preparation for the new season. The team held its first training session before the start of the new season. Training sessions are held in an intensive mode.'),
      },
      category: 'news',
      featured: false,
      publishedAt: new Date('2025-11-18').toISOString(),
      tags: [{ tag: 'тренировка' }],
    },
    // Mock News #2
    {
      imageUrl: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800',
      imageAlt: 'Интервью футболиста',
      title: {
        kk: 'Нәрзілдаев: "Біз жеңуге дайынбыз"',
        ru: 'Нарзилдаев: "Мы готовы побеждать"',
        en: 'Narzildayev: "We are ready to win"',
      },
      slug: {
        kk: 'narzildaev-biz-zhenguge-dayinbiz',
        ru: 'narzildaev-gotovy-pobezhdat',
        en: 'narzildayev-ready-to-win',
      },
      excerpt: {
        kk: 'Команда капитаны алдағы маусым туралы пікірін білдірді',
        ru: 'Капитан команды высказался о предстоящем сезоне',
        en: 'Team captain spoke about the upcoming season',
      },
      content: {
        kk: createRichText('Команда капитаны Думан Нәрзілдаев алдағы маусым туралы пікірін білдірді. "Біз жеңуге дайынбыз және әр матчта барлығымызды береміз", - деді ол.'),
        ru: createRichText('Капитан команды Думан Нарзилдаев высказался о предстоящем сезоне. "Мы готовы побеждать и будем выкладываться в каждом матче", - сказал он.'),
        en: createRichText('Team captain Duman Narzildayev spoke about the upcoming season. "We are ready to win and will give our all in every match", - he said.'),
      },
      category: 'interview',
      featured: false,
      publishedAt: new Date('2025-11-15').toISOString(),
      tags: [{ tag: 'интервью' }],
    },
    // Mock News #3
    {
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      imageAlt: 'Футбольная академия',
      title: {
        kk: 'Kaysar академиясы жаңа таланттарды іздеуде',
        ru: 'Академия Кайсара ищет новые таланты',
        en: 'Kaisar Academy is looking for new talents',
      },
      slug: {
        kk: 'kaysar-akademiyasy-zhana-talanttardi-izdeude',
        ru: 'akademiya-kaisara-ishchet-talanti',
        en: 'kaisar-academy-looking-for-talents',
      },
      excerpt: {
        kk: 'Клубтың академиясы жас футболшыларға есігін ашты',
        ru: 'Академия клуба открыла двери для юных футболистов',
        en: 'The club\'s academy has opened its doors to young footballers',
      },
      content: {
        kk: createRichText('ФК Қайсар академиясы жаңа таланттарды іздеуде. Клубтың академиясы жас футболшыларға есігін ашты. Сынақтар келесі аптада басталады.'),
        ru: createRichText('Академия ФК Кайсар ищет новые таланты. Академия клуба открыла двери для юных футболистов. Просмотры начнутся на следующей неделе.'),
        en: createRichText('FC Kaisar Academy is looking for new talents. The club\'s academy has opened its doors to young footballers. Trials will begin next week.'),
      },
      category: 'news',
      featured: false,
      publishedAt: new Date('2025-11-10').toISOString(),
      tags: [{ tag: 'академия' }],
    },
    // Mock News #4
    {
      imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800',
      imageAlt: 'Футбольный билет',
      title: {
        kk: 'Абонементтер сатылымда',
        ru: 'Абонементы в продаже',
        en: 'Season tickets on sale',
      },
      slug: {
        kk: 'abonementtter-satilimda',
        ru: 'abonementy-v-prodazhe',
        en: 'season-tickets-on-sale',
      },
      excerpt: {
        kk: 'Маусымдық абонементтерді қазір тиімді бағамен алуға болады',
        ru: 'Сезонные абонементы доступны по выгодной цене',
        en: 'Season tickets available at a favorable price',
      },
      content: {
        kk: createRichText('ФК Қайсар маусымдық абонементтерді сатуды бастады. Маусымдық абонементтерді қазір тиімді бағамен алуға болады. Ерте сатып алғандарға жеңілдік бар.'),
        ru: createRichText('ФК Кайсар начал продажу сезонных абонементов. Сезонные абонементы доступны по выгодной цене. Есть скидка для тех, кто покупает рано.'),
        en: createRichText('FC Kaisar has started selling season tickets. Season tickets are available at a favorable price. There is a discount for early purchasers.'),
      },
      category: 'news',
      featured: false,
      publishedAt: new Date('2025-11-08').toISOString(),
      tags: [{ tag: 'билеты' }],
    },
  ]

  // Create news with images
  for (const newsData of newsItems) {
    try {
      console.log(`\n📄 Creating news: ${newsData.title.ru}`)

      // Download and create media
      const mediaId = await createMediaFromUrl(payload, newsData.imageUrl, newsData.imageAlt)

      if (!mediaId) {
        console.log(`  ⚠️  Skipping news "${newsData.title.ru}" - failed to download image`)
        continue
      }

      // Create news with all locales
      await payload.create({
        collection: 'news',
        data: {
          title: newsData.title.ru, // Default locale (ru)
          slug: newsData.slug.ru,
          excerpt: newsData.excerpt.ru,
          content: newsData.content.ru,
          featuredImage: mediaId,
          category: newsData.category,
          status: 'published',
          featured: newsData.featured,
          publishedAt: newsData.publishedAt,
          tags: newsData.tags,
        },
        locale: 'ru',
      })

      // Update with kk locale
      const createdNews = await payload.find({
        collection: 'news',
        where: {
          slug: {
            equals: newsData.slug.ru,
          },
        },
        limit: 1,
      })

      if (createdNews.docs.length > 0) {
        const newsId = createdNews.docs[0].id

        // Update with kk translations
        await payload.update({
          collection: 'news',
          id: newsId,
          data: {
            title: newsData.title.kk,
            slug: newsData.slug.kk,
            excerpt: newsData.excerpt.kk,
            content: newsData.content.kk,
          },
          locale: 'kk',
        })

        // Update with en translations
        await payload.update({
          collection: 'news',
          id: newsId,
          data: {
            title: newsData.title.en,
            slug: newsData.slug.en,
            excerpt: newsData.excerpt.en,
            content: newsData.content.en,
          },
          locale: 'en',
        })

        console.log(`  ✅ Created news: ${newsData.title.ru} (with kk/ru/en translations)`)
      }
    } catch (error: any) {
      console.error(`  ❌ Failed to create news "${newsData.title.ru}":`, error.message)
    }
  }

  // ============================================
  // 4. Seed Gallery
  // ============================================
  console.log('🖼️  Seeding gallery...')

  const galleryItems = [
    {
      title: 'Матч против Астаны - фотоотчёт',
      description: 'Лучшие моменты матча Кайсар - Астана (3:2)',
      type: 'photo' as const,
      category: 'match' as const,
      featured: true,
      uploadDate: new Date().toISOString(),
      tags: [{ tag: 'матч' }, { tag: 'Астана' }],
    },
    {
      title: 'Тренировка команды',
      description: 'Подготовка к важному матчу',
      type: 'photo' as const,
      category: 'training' as const,
      featured: false,
      uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      tags: [{ tag: 'тренировка' }],
    },
    {
      title: 'Встреча с болельщиками',
      description: 'Автограф-сессия в торговом центре',
      type: 'photo' as const,
      category: 'event' as const,
      featured: true,
      uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      tags: [{ tag: 'мероприятие' }, { tag: 'болельщики' }],
    },
  ]

  // Note: Gallery requires media files
  // For seed, we'll skip the media field
  for (const gallery of galleryItems) {
    try {
      await payload.create({
        collection: 'gallery',
        data: gallery as any, // Type assertion needed since we're missing media
      })
      console.log(`  ✓ Created gallery: ${gallery.title}`)
    } catch (error: any) {
      console.log(`  ⚠ Skipped gallery "${gallery.title}": ${error.message}`)
    }
  }

  // ============================================
  console.log('')
  console.log('✅ Seed completed successfully!')
  console.log('')
  console.log('📝 Note: News and Gallery items were created without images.')
  console.log('   To add images, upload them through the admin panel.')
  console.log('')

  process.exit(0)
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error)
  process.exit(1)
})
