'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import './LanguageTabs.css'

export type SupportedLanguage = 'en' | 'vi'

interface LanguageTabsProps {
  activeLanguage: SupportedLanguage
  onLanguageChange: (lang: SupportedLanguage) => void
  className?: string
}

export default function LanguageTabs({
  activeLanguage,
  onLanguageChange,
  className = '',
}: LanguageTabsProps) {
  return (
    <div className={`language-tabs ${className}`}>
      <button
        type="button"
        className={`language-tab ${activeLanguage === 'en' ? 'active' : ''}`}
        onClick={() => onLanguageChange('en')}
      >
        English
      </button>
      <button
        type="button"
        className={`language-tab ${activeLanguage === 'vi' ? 'active' : ''}`}
        onClick={() => onLanguageChange('vi')}
      >
        Tiếng Việt
      </button>
    </div>
  )
}

