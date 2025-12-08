import { NextRequest, NextResponse } from 'next/server'
import { getTranslationService } from '@/lib/translation'
import type { SupportedLocale } from '@/lib/translation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, sourceLang, targetLang } = body

    // Validate required parameters
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid "text" parameter' }, { status: 400 })
    }

    if (!sourceLang || !targetLang) {
      return NextResponse.json(
        { error: 'Missing "sourceLang" or "targetLang" parameter' },
        { status: 400 },
      )
    }

    // Validate supported locales
    const supportedLocales: SupportedLocale[] = ['ru', 'kk', 'en']
    if (!supportedLocales.includes(sourceLang) || !supportedLocales.includes(targetLang)) {
      return NextResponse.json(
        { error: 'Unsupported language. Supported: ru, kk, en' },
        { status: 400 },
      )
    }

    // Prevent translating to the same language
    if (sourceLang === targetLang) {
      return NextResponse.json(
        {
          translatedText: text,
          sourceLang,
          targetLang,
          provider: 'none',
        },
        { status: 200 },
      )
    }

    // Get translation service and translate
    const service = getTranslationService()
    const result = await service.translate({ text, sourceLang, targetLang })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Translation API error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Translation failed'

    return NextResponse.json(
      {
        error: 'Translation failed',
        message: errorMessage,
      },
      { status: 500 },
    )
  }
}

// Optional: Support GET for health check
export async function GET() {
  try {
    const service = getTranslationService()
    const isAvailable = await service.isAvailable()

    return NextResponse.json(
      {
        status: isAvailable ? 'available' : 'unavailable',
        provider: 'LibreTranslate',
      },
      { status: isAvailable ? 200 : 503 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unavailable',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 },
    )
  }
}
