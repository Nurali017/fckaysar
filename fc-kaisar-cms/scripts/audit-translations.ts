/**
 * Audit Translations
 * Checks all localized collections for missing kk/en translations
 *
 * Usage: npx tsx scripts/audit-translations.ts
 */

import 'dotenv/config'
import { MongoClient } from 'mongodb'

const DATABASE_URI = process.env.DATABASE_URI
if (!DATABASE_URI) {
  console.error('DATABASE_URI not found in .env')
  process.exit(1)
}

// Collections and their localized fields
const COLLECTIONS_CONFIG: Record<string, string[]> = {
  news: ['title', 'slug', 'excerpt', 'content'],
  'league-table': ['teamName'],
  players: ['displayName', 'position', 'nationality', 'biography'],
  achievements: ['title', 'competition', 'description'],
  infrastructure: ['name', 'description', 'shortDescription', 'features', 'address', 'fieldType'],
  veterans: ['displayName', 'achievements', 'biography'],
  gallery: ['title', 'description'],
  polls: ['question', 'description'],
}

const LOCALES = ['ru', 'kk', 'en'] as const

interface AuditResult {
  collection: string
  totalDocs: number
  fields: Record<
    string,
    { total: number; missing: Record<string, number>; empty: Record<string, number> }
  >
}

async function auditTranslations() {
  console.log('=== Translation Audit ===\n')

  const client = new MongoClient(DATABASE_URI!)
  await client.connect()
  console.log('Connected to MongoDB\n')

  const db = client.db()
  const results: AuditResult[] = []

  for (const [collectionName, localizedFields] of Object.entries(COLLECTIONS_CONFIG)) {
    const collection = db.collection(collectionName)
    const docs = await collection.find({}).toArray()

    const result: AuditResult = {
      collection: collectionName,
      totalDocs: docs.length,
      fields: {},
    }

    for (const field of localizedFields) {
      const fieldResult = {
        total: docs.length,
        missing: {} as Record<string, number>,
        empty: {} as Record<string, number>,
      }

      for (const locale of LOCALES) {
        let missingCount = 0
        let emptyCount = 0

        for (const doc of docs) {
          const fieldValue = doc[field]

          if (!fieldValue || typeof fieldValue !== 'object') {
            // Field itself is missing or not an object (not localized structure)
            missingCount++
            continue
          }

          const localeValue = fieldValue[locale]

          if (localeValue === undefined || localeValue === null) {
            missingCount++
          } else if (
            localeValue === '' ||
            (typeof localeValue === 'string' && localeValue.trim() === '') ||
            (Array.isArray(localeValue) && localeValue.length === 0) ||
            (typeof localeValue === 'object' && localeValue?.root?.children?.length === 0)
          ) {
            emptyCount++
          }
        }

        if (missingCount > 0) fieldResult.missing[locale] = missingCount
        if (emptyCount > 0) fieldResult.empty[locale] = emptyCount
      }

      result.fields[field] = fieldResult
    }

    results.push(result)
  }

  // Print report
  console.log('='.repeat(80))
  console.log('TRANSLATION AUDIT REPORT')
  console.log('='.repeat(80))

  let totalMissing = 0

  for (const result of results) {
    console.log(`\n--- ${result.collection.toUpperCase()} (${result.totalDocs} docs) ---`)

    if (result.totalDocs === 0) {
      console.log('  (empty collection)')
      continue
    }

    for (const [field, data] of Object.entries(result.fields)) {
      const hasMissing = Object.keys(data.missing).length > 0
      const hasEmpty = Object.keys(data.empty).length > 0

      if (!hasMissing && !hasEmpty) {
        console.log(`  ${field}: OK`)
        continue
      }

      console.log(`  ${field}:`)

      for (const locale of LOCALES) {
        const missing = data.missing[locale] || 0
        const empty = data.empty[locale] || 0
        const ok = data.total - missing - empty

        if (missing > 0 || empty > 0) {
          console.log(`    ${locale}: ${ok}/${data.total} OK | ${missing} missing | ${empty} empty`)
          totalMissing += missing + empty
        } else {
          console.log(`    ${locale}: ${data.total}/${data.total} OK`)
        }
      }
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log(`TOTAL MISSING/EMPTY TRANSLATIONS: ${totalMissing}`)
  console.log('='.repeat(80))

  await client.close()
  console.log('\nDone.')
  process.exit(0)
}

auditTranslations().catch((error) => {
  console.error('Error during audit:', error)
  process.exit(1)
})
