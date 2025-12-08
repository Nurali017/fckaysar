'use client'

import React, { useState, useCallback } from 'react'
import { useField, TextareaInput, useLocale } from '@payloadcms/ui'
import type { TextareaFieldClientComponent } from 'payload'
import { LanguageTabs } from '../ui/LanguageTabs'
import { TranslationButton } from '../ui/TranslationButton'
import { useTranslation } from '@/hooks/useTranslation'
import type { SupportedLocale } from '@/lib/translation'
import '../styles/multilingual-fields.css'

export const MultilingualTextAreaField: TextareaFieldClientComponent = ({ field, path }) => {
  const [activeLocale, setActiveLocale] = useState<SupportedLocale>('ru')
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationError, setTranslationError] = useState<string | null>(null)
  const [ruValue, setRuValue] = useState<string>('')

  const { translateText } = useTranslation()
  const _locale = useLocale()

  // Get current field value for active locale
  const { value, setValue } = useField<string>({ path })

  const handleAutoTranslate = useCallback(async () => {
    if (!ruValue || ruValue.trim() === '') {
      setTranslationError('Сначала заполните русский текст')
      return
    }

    setIsTranslating(true)
    setTranslationError(null)

    try {
      // Translate to Kazakh and English
      const [kkResult, enResult] = await Promise.all([
        translateText(ruValue, 'ru', 'kk'),
        translateText(ruValue, 'ru', 'en'),
      ])

      // Store translated values
      console.log('Translations:', {
        kk: kkResult.translatedText,
        en: enResult.translatedText,
      })

      // For now, we'll just show a success message
      alert(
        `Переводы созданы:\nКазахский: ${kkResult.translatedText}\nEnglish: ${enResult.translatedText}`,
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка перевода'
      setTranslationError(errorMessage)
    } finally {
      setIsTranslating(false)
    }
  }, [ruValue, translateText])

  const handleLocaleChange = useCallback((newLocale: SupportedLocale) => {
    setActiveLocale(newLocale)
    // In Payload CMS 3.x, locale switching is handled differently
  }, [])

  const handleValueChange = useCallback(
    (newValue: string) => {
      setValue(newValue)
      if (activeLocale === 'ru') {
        setRuValue(newValue)
      }
    },
    [setValue, activeLocale],
  )

  const fieldLabel = typeof field.label === 'string' ? field.label : field.label?.en || 'Field'

  return (
    <div className="multilingual-field">
      <div className="multilingual-field__header">
        <label className="field-label">
          {fieldLabel}
          {field.required && <span className="required">*</span>}
        </label>
        <TranslationButton
          onClick={handleAutoTranslate}
          isTranslating={isTranslating}
          disabled={!ruValue || isTranslating}
        />
      </div>

      {translationError && (
        <div className="multilingual-field__error">{translationError}</div>
      )}

      <LanguageTabs activeLocale={activeLocale} onChange={handleLocaleChange} />

      <div className="multilingual-field__inputs">
        <div className="multilingual-field__input-wrapper">
          <TextareaInput
            path={path}
            value={value || ''}
            onChange={(e) => {
              const newValue = e.target?.value || ''
              handleValueChange(newValue)
            }}
            placeholder={
              typeof field.admin?.placeholder === 'string'
                ? field.admin.placeholder
                : undefined
            }
            label=""
            rows={4}
          />
          <div className="multilingual-field__locale-indicator">
            {activeLocale === 'ru'
              ? '🇷🇺 Русский'
              : activeLocale === 'kk'
                ? '🇰🇿 Қазақша'
                : '🇬🇧 English'}
          </div>
        </div>
      </div>
    </div>
  )
}
