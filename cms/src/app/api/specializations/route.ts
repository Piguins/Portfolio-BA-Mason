import { NextRequest } from 'next/server'
import { parseRequestBody, createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { handleDatabaseError, createErrorResponse } from '@/lib/api/handlers/error-handler'
import { validateRequiredFields } from '@/lib/api/validators/request-validator'
import { queryAll, queryFirst, executeQuery } from '@/lib/api/database/query-helpers'
import { corsOptionsHandler } from '@/middleware/cors'
import { getLanguageFromRequest, transformI18nArray } from '@/lib/i18n/api-helpers'
import { getI18nText } from '@/lib/i18n/helpers'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return corsOptionsHandler(request)
}

// GET - Get all specializations (uses specializations table)
export async function GET(request: NextRequest) {
  try {
    const language = getLanguageFromRequest(request)
    
    const specializations = await queryAll<{
      id: number
      number: number | null
      title: string
      description: string | null
      icon_url: string | null
      created_at: Date
      updated_at: Date
      title_i18n: unknown
      description_i18n: unknown
    }>(`
      SELECT 
        id, number, title, description, icon_url, created_at, updated_at,
        title_i18n, description_i18n
      FROM public.specializations
      ORDER BY id ASC
    `)

    // Transform i18n fields
    const transformed = transformI18nArray(specializations, language, ['title', 'description'])

    return createSuccessResponse(transformed, request, 200, { revalidate: 60 })
  } catch (error) {
    return handleDatabaseError(error, 'fetch specializations', request)
  }
}

// POST - Create specialization
export async function POST(request: NextRequest) {
  try {
    const language = getLanguageFromRequest(request)
    
    // Parse request body - supports both i18n format and plain text (backward compatible)
    const parseResult = await parseRequestBody<{
      number?: number | null
      title?: Record<string, string> | string
      description?: Record<string, string> | string | null
      icon_url?: string | null
    }>(request)
    if (parseResult.error) {
      return parseResult.error
    }

    const body = parseResult.data
    const { number, title, description, icon_url } = body

    // Validate required fields
    const validation = validateRequiredFields(body as Record<string, unknown>, ['title'])
    if (!validation.isValid) {
      return createErrorResponse(
        new Error(`Missing required fields: ${validation.missingFields.join(', ')}`),
        `Missing required fields: ${validation.missingFields.join(', ')}`,
        request,
        400
      )
    }

    // Convert i18n data to JSONB format
    const titleI18n = typeof title === 'object' 
      ? JSON.stringify(title) 
      : title 
        ? JSON.stringify({ en: title }) 
        : null
    
    const descriptionI18n = description
      ? typeof description === 'object'
        ? JSON.stringify(description)
        : description.trim() !== ''
          ? JSON.stringify({ en: description })
          : null
      : null

    // Get plain text values for backward compatibility
    const titleText = getI18nText(title, 'en', '')
    const descriptionText = getI18nText(description, 'en') || null

    const specialization = await queryFirst<{
      id: number
      number: number | null
      title: string
      description: string | null
      icon_url: string | null
      created_at: Date
      updated_at: Date
      title_i18n: unknown
      description_i18n: unknown
    }>(
      `INSERT INTO public.specializations (number, title, description, icon_url, title_i18n, description_i18n)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb)
       RETURNING id, number, title, description, icon_url, created_at, updated_at, title_i18n, description_i18n`,
      number || null,
      titleText,
      descriptionText,
      icon_url || null,
      titleI18n,
      descriptionI18n
    )

    if (!specialization) {
      throw new Error('Failed to create specialization')
    }

    // Transform i18n fields in response
    const transformed = transformI18nArray([specialization], language, ['title', 'description'])[0]

    return createSuccessResponse(transformed, request, 201)
  } catch (error) {
    return handleDatabaseError(error, 'create specialization', request)
  }
}
