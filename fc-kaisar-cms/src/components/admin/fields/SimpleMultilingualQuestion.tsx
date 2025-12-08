'use client'

import React, { useState } from 'react'
import type { TextFieldClientComponent } from 'payload'

export const SimpleMultilingualQuestion: TextFieldClientComponent = (props) => {
  const { value, setValue, path: _path } = props

  const [ruText, setRuText] = useState(typeof value === 'object' ? value?.ru || '' : value || '')
  const [kkText, setKkText] = useState(typeof value === 'object' ? value?.kk || '' : '')
  const [enText, setEnText] = useState(typeof value === 'object' ? value?.en || '' : '')
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslate = async () => {
    if (!ruText) {
      alert('Заполните русский текст!')
      return
    }

    setIsTranslating(true)

    try {
      // Translate to Kazakh
      const kkResponse = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: ruText,
          sourceLang: 'ru',
          targetLang: 'kk'
        })
      })
      const kkData = await kkResponse.json()

      // Translate to English
      const enResponse = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: ruText,
          sourceLang: 'ru',
          targetLang: 'en'
        })
      })
      const enData = await enResponse.json()

      setKkText(kkData.translatedText)
      setEnText(enData.translatedText)

      // Update Payload field value
      setValue({
        ru: ruText,
        kk: kkData.translatedText,
        en: enData.translatedText
      })

    } catch (error) {
      console.error('Translation failed:', error)
      alert('Ошибка перевода!')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleRuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setRuText(newValue)
    setValue({
      ru: newValue,
      kk: kkText,
      en: enText
    })
  }

  const handleKkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setKkText(newValue)
    setValue({
      ru: ruText,
      kk: newValue,
      en: enText
    })
  }

  const handleEnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setEnText(newValue)
    setValue({
      ru: ruText,
      kk: kkText,
      en: newValue
    })
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
        Вопрос опроса (3 языка)
      </label>

      <div style={{ border: '1px solid #e0e0e0', borderRadius: '4px', padding: '1rem', backgroundColor: '#fafafa' }}>
        {/* Russian */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#666' }}>
            🇷🇺 Русский
          </label>
          <input
            type="text"
            value={ruText}
            onChange={handleRuChange}
            placeholder="Например: Кто станет лучшим бомбардиром сезона?"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        {/* Kazakh */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#666' }}>
            🇰🇿 Қазақша
          </label>
          <input
            type="text"
            value={kkText}
            onChange={handleKkChange}
            placeholder="Автоматически переведется или введите вручную"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        {/* English */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#666' }}>
            🇬🇧 English
          </label>
          <input
            type="text"
            value={enText}
            onChange={handleEnChange}
            placeholder="Will be auto-translated or enter manually"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        {/* Translate button */}
        <button
          type="button"
          onClick={handleTranslate}
          disabled={isTranslating || !ruText}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: isTranslating || !ruText ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isTranslating || !ruText ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500
          }}
        >
          {isTranslating ? '⏳ Перевод...' : '✨ Перевести с русского'}
        </button>

        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#666' }}>
          💡 Заполните русский текст и нажмите &quot;Перевести&quot; для автоматического перевода
        </div>
      </div>
    </div>
  )
}
