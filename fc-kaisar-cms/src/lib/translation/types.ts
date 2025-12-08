/**
 * Supported locales for translation
 */
export type SupportedLocale = 'ru' | 'kk' | 'en'

/**
 * Translation request payload
 */
export interface TranslationRequest {
  text: string
  sourceLang: SupportedLocale
  targetLang: SupportedLocale
}

/**
 * Translation response with metadata
 */
export interface TranslationResponse {
  translatedText: string
  sourceLang: SupportedLocale
  targetLang: SupportedLocale
  provider: string
}

/**
 * Translation error details
 */
export interface TranslationError {
  message: string
  code?: string
  provider: string
}

/**
 * Abstract base class for translation services
 */
export abstract class TranslationService {
  /**
   * Translate a single text from source to target language
   */
  abstract translate(request: TranslationRequest): Promise<TranslationResponse>

  /**
   * Translate multiple texts in batch
   */
  abstract translateBatch(requests: TranslationRequest[]): Promise<TranslationResponse[]>

  /**
   * Check if the translation service is available
   */
  abstract isAvailable(): Promise<boolean>
}
