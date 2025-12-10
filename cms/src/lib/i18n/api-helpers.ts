/**
 * API Helper Functions for i18n
 * Utilities for API routes to handle i18n data
 */

import { NextRequest } from 'next/server'
import { SupportedLanguage, I18nText, getI18nText } from './helpers'

/**
 * Get language from request (query param, header, or default)
 * @param request - Next.js request object
 */
export function getLanguageFromRequest(request: NextRequest): SupportedLanguage {
  // Check query parameter first
  const langParam = request.nextUrl.searchParams.get('lang')
  if (langParam === 'vi' || langParam === 'en') {
    return langParam
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    if (acceptLanguage.includes('vi')) {
      return 'vi'
    }
    if (acceptLanguage.includes('en')) {
      return 'en'
    }
  }

  // Default to English
  return 'en'
}

/**
 * Transform API response to include i18n data
 * Converts JSONB fields to plain text based on requested language
 */
export function transformI18nResponse<T extends Record<string, unknown>>(
  data: T,
  language: SupportedLanguage,
  i18nFields: string[]
): T {
  const transformed = { ...data }

  for (const field of i18nFields) {
    const i18nField = `${field}_i18n`
    if (i18nField in transformed) {
      const i18nValue = transformed[i18nField] as I18nText | null | undefined
      const textValue = getI18nText(i18nValue, language)
      
      // Replace _i18n field with plain text field
      delete transformed[i18nField]
      transformed[field] = textValue
    }
  }

  return transformed
}

/**
 * Transform array of objects with i18n fields
 */
export function transformI18nArray<T extends Record<string, unknown>>(
  data: T[],
  language: SupportedLanguage,
  i18nFields: string[]
): T[] {
  return data.map(item => transformI18nResponse(item, language, i18nFields))
}

