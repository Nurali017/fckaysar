'use client'

import React from 'react'

interface TranslationButtonProps {
  onClick: () => void | Promise<void>
  isTranslating: boolean
  disabled?: boolean
  label?: string
}

export const TranslationButton: React.FC<TranslationButtonProps> = ({
  onClick,
  isTranslating,
  disabled = false,
  label = 'Перевести автоматически',
}) => {
  return (
    <button
      type="button"
      className="translation-button"
      onClick={onClick}
      disabled={disabled || isTranslating}
    >
      {isTranslating ? (
        <>
          <span className="translation-button__spinner" />
          <span>Переводим...</span>
        </>
      ) : (
        <>
          <span className="translation-button__icon">✨</span>
          <span>{label}</span>
        </>
      )}
    </button>
  )
}
