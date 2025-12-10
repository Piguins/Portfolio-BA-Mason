import { NextRequest } from 'next/server'
import { parseRequestBody, createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { createErrorResponse, handleDatabaseError } from '@/lib/api/handlers/error-handler'
import { validateRequiredFields, validateIntegerId } from '@/lib/api/validators/request-validator'
import { queryFirst, executeQuery } from '@/lib/api/database/query-helpers'
import { corsOptionsHandler } from '@/middleware/cors'
import { getLanguageFromRequest, transformI18nResponse } from '@/lib/i18n/api-helpers'
import { getI18nText } from '@/lib/i18n/helpers'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return corsOptionsHandler(request)
}

// GET - Get specialization by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const raw = searchParams.get('raw') === 'true' // For CMS to get raw i18n data
    const language = getLanguageFromRequest(request)

    // Validate integer ID
    const idValidation = validateIntegerId(id)
    if (!idValidation.isValid) {
      return createErrorResponse(
        new Error(idValidation.error),
        idValidation.error,
        request,
        400
      )
    }

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
      `SELECT 
        id, number, title, description, icon_url, created_at, updated_at,
        title_i18n, description_i18n
       FROM public.specializations WHERE id = $1`,
      idValidation.value
    )

    if (!specialization) {
      return createErrorResponse(
        new Error('Specialization not found'),
        'Specialization not found',
        request,
        404
      )
    }

    // If raw=true, return i18n data as-is for CMS editing
    if (raw) {
      return createSuccessResponse(specialization, request, 200, { revalidate: 60 })
    }

    // Transform i18n fields
    const transformed = transformI18nResponse(specialization, language, ['title', 'description'])

    return createSuccessResponse(transformed, request, 200, { revalidate: 60 })
  } catch (error) {
    return handleDatabaseError(error, 'fetch specialization', request)
  }
}

// PUT - Update specialization
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const language = getLanguageFromRequest(request)

    // Validate integer ID
    const idValidation = validateIntegerId(id)
    if (!idValidation.isValid) {
      return createErrorResponse(
        new Error(idValidation.error),
        idValidation.error,
        request,
        400
      )
    }

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

    await executeQuery(
      `UPDATE public.specializations
       SET number = $1, title = $2, description = $3, icon_url = $4,
           title_i18n = $5::jsonb, description_i18n = $6::jsonb,
           updated_at = NOW()
       WHERE id = $7`,
      number || null,
      titleText,
      descriptionText,
      icon_url || null,
      titleI18n,
      descriptionI18n,
      idValidation.value
    )

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
      `SELECT 
        id, number, title, description, icon_url, created_at, updated_at,
        title_i18n, description_i18n
       FROM public.specializations WHERE id = $1`,
      idValidation.value
    )

    if (!specialization) {
      throw new Error('Failed to retrieve updated specialization')
    }

    // Transform i18n fields in response
    const transformed = transformI18nResponse(specialization, language, ['title', 'description'])

    return createSuccessResponse(transformed, request)
  } catch (error) {
    return handleDatabaseError(error, 'update specialization', request)
  }
}

// DELETE - Delete specialization
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Validate integer ID
    const idValidation = validateIntegerId(id)
    if (!idValidation.isValid) {
      return createErrorResponse(
        new Error(idValidation.error),
        idValidation.error,
        request,
        400
      )
    }

    await executeQuery(`DELETE FROM public.specializations WHERE id = $1`, idValidation.value)

    return createSuccessResponse(
      { message: 'Specialization deleted successfully' },
      request
    )
  } catch (error) {
    return handleDatabaseError(error, 'delete specialization', request)
  }
}
