// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Players } from './collections/Players'
import { Matches } from './collections/Matches'
import { Gallery } from './collections/Gallery'
import { Polls } from './collections/Polls'
import { LeagueTable } from './collections/LeagueTable'
import { TeamStats } from './collections/TeamStats'
import { Seasons } from './collections/Seasons'
import { Leadership } from './collections/Leadership'
import { TeamLogos } from './collections/TeamLogos'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  cors: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173'],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- FC Kaisar CMS',
    },
  },
  collections: [Users, Media, News, Players, Matches, Gallery, Polls, LeagueTable, TeamStats, Seasons, Leadership, TeamLogos],
  localization: {
    locales: [
      {
        label: 'Русский',
        code: 'ru',
      },
      {
        label: 'Қазақша',
        code: 'kk',
      },
      {
        label: 'English',
        code: 'en',
      },
    ],
    defaultLocale: 'ru',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
})
