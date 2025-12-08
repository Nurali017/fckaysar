import type { TranslationService, TranslationRequest, TranslationResponse } from './types'

/**
 * Google Translate service implementation
 * Uses free Google Translate API (unofficial endpoint)
 *
 * Note: This uses the free endpoint which has limitations.
 * For production, consider using official Google Cloud Translation API.
 */
export class GoogleTranslateService implements TranslationService {
  private timeout: number

  constructor(timeout: number = 10000) {
    this.timeout = timeout
  }

  /**
   * Translate a single text using Google Translate free API
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      // Using free Google Translate API endpoint
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${request.sourceLang}&tl=${request.targetLang}&dt=t&q=${encodeURIComponent(request.text)}`

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`)
      }

      const data = await response.json()

      // Google Translate response format: [[[translatedText, originalText, null, null, num]]]
      if (!data || !data[0] || !data[0][0] || !data[0][0][0]) {
        throw new Error('Invalid response from Google Translate')
      }

      // Combine all translation parts (for longer texts split into multiple parts)
      const translatedText = data[0]
        .map((item: any[]) => item[0])
        .filter(Boolean)
        .join('')

      return {
        translatedText,
        sourceLang: request.sourceLang,
        targetLang: request.targetLang,
        provider: 'Google Translate',
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
   * Check if Google Translate service is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Simple test translation
      const result = await this.translate({
        text: 'test',
        sourceLang: 'en',
        targetLang: 'ru',
      })
      return !!result.translatedText
    } catch {
      return false
    }
  }
}
