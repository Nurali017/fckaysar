/**
 * Fill Missing Translations via Claude API
 * Translates ru values to kk/en using Anthropic Claude API.
 *
 * Env: DATABASE_URI, ANTHROPIC_API_KEY (or CLAUDE_API_KEY)
 *
 * Usage:
 *   npx tsx src/scripts/fill-missing-translations.ts          # dry-run
 *   npx tsx src/scripts/fill-missing-translations.ts --apply   # apply changes
 */

import 'dotenv/config'
import { MongoClient } from 'mongodb'

const DATABASE_URI = process.env.DATABASE_URI
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY

if (!DATABASE_URI) {
  console.error('DATABASE_URI not found in .env')
  process.exit(1)
}
if (!ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY (or CLAUDE_API_KEY) not found in .env')
  process.exit(1)
}

const DRY_RUN = !process.argv.includes('--apply')
const FORCE_EN = process.argv.includes('--force-en') // Overwrite en even if exists (for bad data)
const FORCE_RU = process.argv.includes('--force-ru') // Overwrite ru (for collections where ru has kk text)

const COLLECTIONS_CONFIG: Record<string, string[]> = {
  players: ['displayName', 'position', 'nationality', 'biography'],
  news: ['title', 'slug', 'excerpt', 'content'],
  veterans: ['displayName', 'achievements', 'biography'],
  polls: ['question', 'description'],
  infrastructures: ['name', 'description', 'shortDescription', 'address', 'fieldType'],
}

// Collections where en/ru locale contains wrong data (kk text in wrong locale)
// For these, translate from kk source when available
const EN_FROM_KK_COLLECTIONS = new Set(['news', 'infrastructures'])

// Fields that are slugs — transliterate, don't translate
const SLUG_FIELDS = new Set(['slug'])

// Fields with Lexical rich text JSON
const RICH_TEXT_FIELDS = new Set(['biography', 'content', 'description', 'achievements'])

const LOCALE_NAMES: Record<string, string> = {
  kk: 'Kazakh (Қазақша)',
  en: 'English',
}

interface FillStats {
  collection: string
  translated: number
  skipped: number
  noSource: number
  errors: number
}

function hasValue(val: unknown): boolean {
  if (val === undefined || val === null) return false
  if (typeof val === 'string' && val.trim() === '') return false
  if (Array.isArray(val) && val.length === 0) return false
  if (typeof val === 'object' && val !== null && 'root' in (val as Record<string, unknown>)) {
    const root = (val as { root?: { children?: unknown[] } }).root
    if (!root?.children || root.children.length === 0) return false
  }
  return true
}

/**
 * Extract plain text from Lexical rich text JSON
 */
function richTextToPlain(richText: unknown): string {
  if (!richText || typeof richText !== 'object') return ''
  const root = (richText as { root?: { children?: unknown[] } }).root
  if (!root?.children) return ''

  function extract(nodes: unknown[]): string {
    return nodes
      .map((node: unknown) => {
        const n = node as { text?: string; children?: unknown[] }
        if (n.text) return n.text
        if (n.children) return extract(n.children)
        return ''
      })
      .join(' ')
  }

  return extract(root.children).trim()
}

/**
 * Replace text content in Lexical rich text JSON while preserving structure
 */
function replaceRichTextContent(original: unknown, translatedPlain: string): unknown {
  if (!original || typeof original !== 'object') return original

  // Deep clone
  const cloned = JSON.parse(JSON.stringify(original))
  const root = cloned.root
  if (!root?.children) return cloned

  // Collect all text segments from translated text
  const segments = translatedPlain.split(/\s+/)
  let segIdx = 0

  function replaceTexts(nodes: unknown[]) {
    for (const node of nodes) {
      const n = node as { text?: string; children?: unknown[] }
      if (typeof n.text === 'string' && n.text.trim()) {
        // Count words in original text node to take same number from translation
        const origWordCount = n.text.trim().split(/\s+/).length
        const chunk = segments.slice(segIdx, segIdx + origWordCount)
        n.text = chunk.join(' ') || n.text
        segIdx += origWordCount
      }
      if (n.children) replaceTexts(n.children)
    }
  }

  replaceTexts(root.children)

  // If there are remaining segments, append to last text node
  if (segIdx < segments.length) {
    const remaining = segments.slice(segIdx).join(' ')
    function findLastText(nodes: unknown[]): { text?: string } | null {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i] as { text?: string; children?: unknown[] }
        if (typeof n.text === 'string') return n
        if (n.children) {
          const found = findLastText(n.children)
          if (found) return found
        }
      }
      return null
    }
    const last = findLastText(root.children)
    if (last) last.text = (last.text || '') + ' ' + remaining
  }

  return cloned
}

/**
 * Call Claude API to translate text
 */
async function translateWithClaude(
  text: string,
  targetLocale: string,
  context: string,
): Promise<string> {
  const langName = LOCALE_NAMES[targetLocale] || targetLocale

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Translate the following text to ${langName}. The source text is in ${context.includes('from Kazakh') ? 'Kazakh' : 'Russian'}. Context: this is for a football club website (FC Kaisar, Kazakhstan). Field: ${context.replace(' (from Kazakh)', '')}.

Return ONLY the translation, no explanations.

Text: ${text}`,
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Claude API error ${response.status}: ${err}`)
  }

  const data = (await response.json()) as {
    content: { type: string; text: string }[]
  }

  return data.content[0]?.text?.trim() || ''
}

/**
 * Translate a slug (transliterate to Latin for kk/en)
 */
async function translateSlug(ruSlug: string, targetLocale: string): Promise<string> {
  const langName = LOCALE_NAMES[targetLocale] || targetLocale

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: `Convert this Russian URL slug to a ${langName} URL slug for a football club news article. Use lowercase Latin letters, hyphens only, no special chars.

Return ONLY the slug, nothing else.

Slug: ${ruSlug}`,
        },
      ],
    }),
  })

  if (!response.ok) throw new Error(`Claude API error ${response.status}`)

  const data = (await response.json()) as {
    content: { type: string; text: string }[]
  }

  return (data.content[0]?.text?.trim() || ruSlug)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
}

// Rate limit: small delay between API calls
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fillTranslations() {
  console.log(DRY_RUN ? '=== DRY RUN (use --apply to write) ===' : '=== APPLYING CHANGES ===')
  if (FORCE_EN) console.log('>>> FORCE-EN mode: overwriting en translations')
  if (FORCE_RU) console.log('>>> FORCE-RU mode: overwriting ru translations (from kk source)')
  console.log()

  const client = new MongoClient(DATABASE_URI!)
  await client.connect()
  console.log('Connected to MongoDB\n')

  const db = client.db()
  const allStats: FillStats[] = []

  for (const [collectionName, fields] of Object.entries(COLLECTIONS_CONFIG)) {
    const collection = db.collection(collectionName)
    const docs = await collection.find({}).toArray()

    const stats: FillStats = {
      collection: collectionName,
      translated: 0,
      skipped: 0,
      noSource: 0,
      errors: 0,
    }

    console.log(`--- ${collectionName.toUpperCase()} (${docs.length} docs) ---`)

    if (docs.length === 0) {
      console.log('  (empty)\n')
      allStats.push(stats)
      continue
    }

    for (const doc of docs) {
      const updates: Record<string, unknown> = {}
      const docLabel = doc.displayName?.ru || doc.title?.ru || doc.question?.ru || String(doc._id)

      for (const field of fields) {
        const fieldValue = doc[field]

        if (!fieldValue || typeof fieldValue !== 'object') {
          stats.noSource++
          continue
        }

        const ruValue = fieldValue.ru
        const kkValue = fieldValue.kk

        // Force-ru: overwrite ru from kk for collections with wrong ru data
        if (FORCE_RU && EN_FROM_KK_COLLECTIONS.has(collectionName) && hasValue(kkValue)) {
          try {
            const ruTranslated = await translateWithClaude(
              String(typeof kkValue === 'object' ? richTextToPlain(kkValue) : kkValue),
              'ru',
              `${field} of ${collectionName} (from Kazakh)`,
            )
            if (RICH_TEXT_FIELDS.has(field) && typeof kkValue === 'object') {
              updates[`${field}.ru`] = replaceRichTextContent(kkValue, ruTranslated)
            } else {
              updates[`${field}.ru`] = ruTranslated
            }
            console.log(
              `  [${docLabel}] ${field}.ru = "${String(ruTranslated).slice(0, 60)}" (from kk)`,
            )
            stats.translated++
            await delay(300)
          } catch (err) {
            console.error(`  [${docLabel}] ERROR ${field}.ru: ${err}`)
            stats.errors++
          }
        }

        // Need at least kk or ru as source
        if (!hasValue(ruValue) && !hasValue(kkValue)) {
          stats.noSource++
          continue
        }

        for (const locale of ['kk', 'en'] as const) {
          const forceOverwrite =
            locale === 'en' && FORCE_EN && EN_FROM_KK_COLLECTIONS.has(collectionName)
          if (hasValue(fieldValue[locale]) && !forceOverwrite) {
            stats.skipped++
            continue
          }

          // Determine source text and language
          const useKkSource = locale === 'en' && EN_FROM_KK_COLLECTIONS.has(collectionName)
          const sourceValue = useKkSource ? kkValue || ruValue : ruValue || kkValue
          const sourceLang = (useKkSource && kkValue) || (!ruValue && kkValue) ? 'kk' : 'ru'

          if (!hasValue(sourceValue)) {
            stats.noSource++
            continue
          }

          try {
            let translated: unknown
            const sourceText = sourceValue

            if (SLUG_FIELDS.has(field)) {
              translated = await translateSlug(String(sourceText), locale)
              console.log(`  [${docLabel}] ${field}.${locale} = "${translated}"`)
            } else if (RICH_TEXT_FIELDS.has(field) && typeof sourceText === 'object') {
              const plainSource = richTextToPlain(sourceText)
              if (!plainSource) {
                stats.noSource++
                continue
              }
              const plainTranslated = await translateWithClaude(
                plainSource,
                locale,
                `${field} of ${collectionName}${sourceLang === 'kk' ? ' (from Kazakh)' : ''}`,
              )
              translated = replaceRichTextContent(sourceText, plainTranslated)
              console.log(
                `  [${docLabel}] ${field}.${locale} = "${plainTranslated.slice(0, 60)}..."`,
              )
            } else {
              translated = await translateWithClaude(
                String(sourceText),
                locale,
                `${field} of ${collectionName}${sourceLang === 'kk' ? ' (from Kazakh)' : ''}`,
              )
              console.log(`  [${docLabel}] ${field}.${locale} = "${translated}"`)
            }

            updates[`${field}.${locale}`] = translated
            stats.translated++

            await delay(300) // rate limit
          } catch (err) {
            console.error(`  [${docLabel}] ERROR ${field}.${locale}: ${err}`)
            stats.errors++
          }
        }
      }

      if (Object.keys(updates).length > 0 && !DRY_RUN) {
        await collection.updateOne({ _id: doc._id }, { $set: updates })
      }
    }

    allStats.push(stats)
    console.log()
  }

  // Summary
  console.log('='.repeat(60))
  console.log('SUMMARY')
  console.log('='.repeat(60))

  let totalTranslated = 0
  let totalErrors = 0
  for (const s of allStats) {
    console.log(
      `  ${s.collection}: ${s.translated} translated, ${s.skipped} already OK, ${s.noSource} no ru source, ${s.errors} errors`,
    )
    totalTranslated += s.translated
    totalErrors += s.errors
  }

  console.log(`\nTotal translated: ${totalTranslated}, errors: ${totalErrors}`)
  if (DRY_RUN) {
    console.log('\nThis was a DRY RUN. Run with --apply to write changes.')
  }

  await client.close()
  process.exit(0)
}

fillTranslations().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
