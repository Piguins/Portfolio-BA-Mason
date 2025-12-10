/**
 * i18n Helper Functions
 * Utilities for handling multi-language data stored as JSONB
 */

export type SupportedLanguage = 'en' | 'vi'
export type I18nText = Record<SupportedLanguage, string> | string

/**
 * Get text value from i18n object or fallback to string
 * @param i18nText - Can be JSONB object {en: "...", vi: "..."} or plain string
 * @param language - Target language (default: 'en')
 * @param fallback - Fallback value if not found
 */
export function getI18nText(
  i18nText: I18nText | null | undefined,
  language: SupportedLanguage = 'en',
  fallback: string = ''
): string {
  if (!i18nText) {
    return fallback
  }

  // If it's already a string (backward compatibility)
  if (typeof i18nText === 'string') {
    return i18nText
  }

  // If it's an object with language keys
  if (typeof i18nText === 'object') {
    // Try requested language first
    if (i18nText[language]) {
      return i18nText[language]
    }
    // Fallback to English
    if (i18nText.en) {
      return i18nText.en
    }
    // Fallback to Vietnamese
    if (i18nText.vi) {
      return i18nText.vi
    }
    // Fallback to first available value
    const firstValue = Object.values(i18nText)[0]
    if (typeof firstValue === 'string') {
      return firstValue
    }
  }

  return fallback
}

/**
 * Convert plain text to i18n object format
 * @param text - Plain text string
 * @param defaultLanguage - Language to use for the text (default: 'en')
 */
export function textToI18n(
  text: string | null | undefined,
  defaultLanguage: SupportedLanguage = 'en'
): Record<SupportedLanguage, string> | null {
  if (!text || text.trim() === '') {
    return null
  }
  return {
    [defaultLanguage]: text.trim(),
  }
}

/**
 * Convert i18n object to plain text (for backward compatibility)
 * @param i18nText - i18n object or string
 * @param language - Language to extract (default: 'en')
 */
export function i18nToText(
  i18nText: I18nText | null | undefined,
  language: SupportedLanguage = 'en'
): string {
  return getI18nText(i18nText, language)
}

/**
 * Merge i18n objects, keeping all languages
 * @param existing - Existing i18n object
 * @param updates - Updates to apply
 */
export function mergeI18n(
  existing: I18nText | null | undefined,
  updates: Partial<Record<SupportedLanguage, string>>
): Record<SupportedLanguage, string> {
  const existingObj: Record<string, string> =
    typeof existing === 'string'
      ? { en: existing }
      : existing || {}

  return {
    ...existingObj,
    ...updates,
  } as Record<SupportedLanguage, string>
}

/**
 * Validate i18n object structure
 * @param i18nText - Object to validate
 */
export function isValidI18n(i18nText: unknown): i18nText is Record<SupportedLanguage, string> {
  if (!i18nText || typeof i18nText !== 'object') {
    return false
  }

  const obj = i18nText as Record<string, unknown>
  // Must have at least one language key
  return Object.keys(obj).some(key => key === 'en' || key === 'vi')
}

