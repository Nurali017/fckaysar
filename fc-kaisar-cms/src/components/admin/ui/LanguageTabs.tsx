'use client'

import React from 'react'
import type { SupportedLocale } from '@/lib/translation'

interface LanguageTabsProps {
  activeLocale: SupportedLocale
  onChange: (locale: SupportedLocale) => void
}

const languages: { code: SupportedLocale; label: string; flag: string }[] = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'kk', label: 'Қазақша', flag: '🇰🇿' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
]

export const LanguageTabs: React.FC<LanguageTabsProps> = ({ activeLocale, onChange }) => {
  return (
    <div className="language-tabs">
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          className={`language-tab ${activeLocale === lang.code ? 'active' : ''}`}
          onClick={() => onChange(lang.code)}
        >
          <span className="language-tab__flag">{lang.flag}</span>
          <span className="language-tab__label">{lang.label}</span>
        </button>
      ))}
    </div>
  )
}
