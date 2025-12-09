import { NextRequest } from 'next/server'
import { parseRequestBody, createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { createErrorResponse, handleDatabaseError } from '@/lib/api/handlers/error-handler'
import { validateRequiredFields, validateIntegerId } from '@/lib/api/validators/request-validator'
import { queryFirst, executeQuery } from '@/lib/api/database/query-helpers'

// GET - Get skill by ID
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

    const skill = await queryFirst<{
      id: number
      name: string
      slug: string | null
      category: string
      level: string | null
      icon_url: string | null
      description: string | null
      order_index: number
      is_highlight: boolean
      created_at: Date
      updated_at: Date
    }>(`SELECT * FROM public.skills WHERE id = $1`, idValidation.value)

    if (!skill) {
      return createErrorResponse(
        new Error('Skill not found'),
        'Skill not found',
        request,
        404
      )
    }

    return createSuccessResponse(skill, request)
  } catch (error) {
    return handleDatabaseError(error, 'fetch skill', request)
  }
}

// PUT - Update skill
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
      name?: string
      slug?: string
      category?: string
      level?: string
      icon_url?: string
      description?: string
      order_index?: number
      is_highlight?: boolean
    }>(request)
    if (parseResult.error) {
      return parseResult.error
    }

    const body = parseResult.data
    const { name, slug, category, level, icon_url, description, order_index, is_highlight } = body

    // Validate required fields
    const validation = validateRequiredFields(body as Record<string, unknown>, ['name', 'category'])
    if (!validation.isValid) {
      return createErrorResponse(
        new Error(`Missing required fields: ${validation.missingFields.join(', ')}`),
        `Missing required fields: ${validation.missingFields.join(', ')}`,
        request,
        400
      )
    }

    await executeQuery(
      `UPDATE public.skills
       SET name = $1, slug = $2, category = $3, level = $4, icon_url = $5,
           description = $6, order_index = $7, is_highlight = $8, updated_at = NOW()
       WHERE id = $9`,
      name,
      slug || null,
      category,
      level || null,
      icon_url || null,
      description || null,
      order_index || 0,
      is_highlight || false,
      idValidation.value
    )

    const skill = await queryFirst<{
      id: number
      name: string
      slug: string | null
      category: string
      level: string | null
      icon_url: string | null
      description: string | null
      order_index: number
      is_highlight: boolean
      created_at: Date
      updated_at: Date
    }>(`SELECT * FROM public.skills WHERE id = $1`, idValidation.value)

    return createSuccessResponse(skill, request)
  } catch (error) {
    return handleDatabaseError(error, 'update skill', request)
  }
}

// DELETE - Delete skill
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

    await executeQuery(`DELETE FROM public.skills WHERE id = $1`, idValidation.value)

    return createSuccessResponse(
      { message: 'Skill deleted successfully' },
      request
    )
  } catch (error) {
    return handleDatabaseError(error, 'delete skill', request)
  }
}
