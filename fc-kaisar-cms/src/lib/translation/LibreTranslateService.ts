import type { TranslationService, TranslationRequest, TranslationResponse } from './types'

/**
 * LibreTranslate service implementation
 * Uses free and open-source LibreTranslate API
 */
export class LibreTranslateService implements TranslationService {
  private baseUrl: string
  private apiKey?: string
  private timeout: number

  constructor(baseUrl?: string, apiKey?: string, timeout: number = 10000) {
    // Default to public LibreTranslate instance
    this.baseUrl = baseUrl || process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com'
    this.apiKey = apiKey || process.env.LIBRETRANSLATE_API_KEY
    this.timeout = timeout
  }

  /**
   * Translate a single text
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify({
          q: request.text,
          source: request.sourceLang,
          target: request.targetLang,
          format: 'text',
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.translatedText) {
        throw new Error('Invalid response from translation service')
      }

      return {
        translatedText: data.translatedText,
        sourceLang: request.sourceLang,
        targetLang: request.targetLang,
        provider: 'LibreTranslate',
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Translation request timed out')
        }
        throw new Error(`Translation failed: ${error.message}`)
      }
      throw new Error('Translation failed: Unknown error')
    }
  }

  /**
   * Translate multiple texts in parallel
   */
  async translateBatch(requests: TranslationRequest[]): Promise<TranslationResponse[]> {
    return Promise.all(requests.map((req) => this.translate(req)))
  }

  /**
   * Check if LibreTranslate service is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/languages`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      })
      return response.ok
    } catch {
      return false
    }
  }
}
