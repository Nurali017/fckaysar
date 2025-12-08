import { LibreTranslateService } from './LibreTranslateService'
import { GoogleTranslateService } from './GoogleTranslateService'
import type { TranslationService } from './types'

/**
 * Get translation service instance based on environment configuration
 */
export function getTranslationService(): TranslationService {
  const provider = process.env.TRANSLATION_PROVIDER || 'google'

  switch (provider) {
    case 'libretranslate':
      return new LibreTranslateService()
    case 'google':
      return new GoogleTranslateService()
    // Future providers can be added here
    // case 'microsoft':
    //   return new MicrosoftTranslateService()
    default:
      console.warn(`Unknown translation provider: ${provider}, falling back to Google Translate`)
      return new GoogleTranslateService()
  }
}

// Export types and services
export * from './types'
export { LibreTranslateService, GoogleTranslateService }
