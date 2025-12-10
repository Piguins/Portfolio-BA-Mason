import { NextRequest } from 'next/server'
import { parseRequestBody, createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { createErrorResponse, handleDatabaseError } from '@/lib/api/handlers/error-handler'
import { validateRequiredFields, validateIntegerId } from '@/lib/api/validators/request-validator'
import { queryFirst, executeQuery } from '@/lib/api/database/query-helpers'
import { corsOptionsHandler } from '@/middleware/cors'

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
    }>(
      `SELECT id, number, title, description, icon_url, created_at, updated_at
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

    return createSuccessResponse(specialization, request, 200, { revalidate: 60 })
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

    await executeQuery(
      `UPDATE public.specializations
       SET number = $1, title = $2, description = $3, icon_url = $4, updated_at = NOW()
       WHERE id = $5`,
      number || null,
      title,
      description || null,
      icon_url || null,
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
    }>(
      `SELECT id, number, title, description, icon_url, created_at, updated_at
       FROM public.specializations WHERE id = $1`,
      idValidation.value
    )

    return createSuccessResponse(specialization, request)
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
