'use client'

import { useState, useCallback } from 'react'
import type { SupportedLocale, TranslationResponse } from '@/lib/translation'

interface UseTranslationReturn {
  translateText: (
    text: string,
    sourceLang: SupportedLocale,
    targetLang: SupportedLocale,
  ) => Promise<TranslationResponse>
  isLoading: boolean
  error: string | null
}

export function useTranslation(): UseTranslationReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const translateText = useCallback(
    async (
      text: string,
      sourceLang: SupportedLocale,
      targetLang: SupportedLocale,
    ): Promise<TranslationResponse> => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            sourceLang,
            targetLang,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Translation failed')
        }

        const result: TranslationResponse = await response.json()
        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Translation failed'
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return {
    translateText,
    isLoading,
    error,
  }
}
