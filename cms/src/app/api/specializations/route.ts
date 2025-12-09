import { NextRequest } from 'next/server'
import { parseRequestBody, createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { handleDatabaseError, createErrorResponse } from '@/lib/api/handlers/error-handler'
import { validateRequiredFields } from '@/lib/api/validators/request-validator'
import { queryAll, queryFirst, executeQuery } from '@/lib/api/database/query-helpers'
import { corsOptionsHandler } from '@/middleware/cors'

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
    const specializations = await queryAll<{
      id: number
      number: number | null
      title: string
      description: string | null
      icon_url: string | null
      created_at: Date
      updated_at: Date
    }>(`
      SELECT id, number, title, description, icon_url, created_at, updated_at
      FROM public.specializations
      ORDER BY id ASC
    `)

    return createSuccessResponse(specializations, request)
  } catch (error) {
    return handleDatabaseError(error, 'fetch specializations', request)
  }
}

// POST - Create specialization
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const parseResult = await parseRequestBody<{
      number?: number | null
      title?: string
      description?: string | null
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

    const result = await queryFirst<{ id: number }>(
      `INSERT INTO public.specializations (number, title, description, icon_url)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      number || null,
      title,
      description || null,
      icon_url || null
    )

    if (!result) {
      throw new Error('Failed to create specialization')
    }

    const specialization = await queryFirst<{
      id: number
      number: number | null
      title: string
      description: string | null
      icon_url: string | null
      created_at: Date
      updated_at: Date
    }>(
      `SELECT id, number, title, description, icon_url, created_at, updated_at
       FROM public.specializations WHERE id = $1`,
      result.id
    )

    return createSuccessResponse(specialization, request, 201)
  } catch (error) {
    return handleDatabaseError(error, 'create specialization', request)
  }
}
