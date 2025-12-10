import { NextRequest } from 'next/server'
import { parseRequestBody, createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { createErrorResponse, handleDatabaseError } from '@/lib/api/handlers/error-handler'
import { validateRequiredFields } from '@/lib/api/validators/request-validator'
import { validateUUID } from '@/lib/api/validators/uuid-validator'
import { queryFirst, executeQuery } from '@/lib/api/database/query-helpers'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET - Get project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Validate UUID format
    try {
      validateUUID(id)
    } catch (error) {
      return createErrorResponse(
        error as Error,
        'Invalid project ID format',
        request,
        400
      )
    }

    const project = await queryFirst<{
      id: string
      title: string
      summary: string | null
      hero_image_url: string | null
      case_study_url: string | null
      tags_text: string[]
      created_at: Date
      updated_at: Date
    }>(`SELECT * FROM public.projects WHERE id = $1::uuid`, id)

    if (!project) {
      return createErrorResponse(
        new Error('Project not found'),
        'Project not found',
        request,
        404
      )
    }

    return createSuccessResponse(project, request, 200, { revalidate: 60 })
  } catch (error) {
    return handleDatabaseError(error, 'fetch project', request)
  }
}

// PUT - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Validate UUID format
    try {
      validateUUID(id)
    } catch (error) {
      return createErrorResponse(
        error as Error,
        'Invalid project ID format',
        request,
        400
      )
    }

    // Parse request body
    const parseResult = await parseRequestBody<{
      title?: string
      summary?: string | null
      hero_image_url?: string | null
      case_study_url?: string | null
      tags_text?: string[]
    }>(request)
    if (parseResult.error) {
      return parseResult.error
    }

    const body = parseResult.data
    const { title, summary, hero_image_url, case_study_url, tags_text } = body

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
      `UPDATE public.projects
       SET title = $1, summary = $2, hero_image_url = $3, case_study_url = $4,
           tags_text = $5::text[], updated_at = NOW()
       WHERE id = $6::uuid`,
      title,
      summary || null,
      hero_image_url || null,
      case_study_url || null,
      tags_text || [],
      id
    )

    const project = await queryFirst<{
      id: string
      title: string
      summary: string | null
      hero_image_url: string | null
      case_study_url: string | null
      tags_text: string[]
      created_at: Date
      updated_at: Date
    }>(`SELECT * FROM public.projects WHERE id = $1::uuid`, id)

    return createSuccessResponse(project, request)
  } catch (error) {
    return handleDatabaseError(error, 'update project', request)
  }
}

// DELETE - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Validate UUID format
    try {
      validateUUID(id)
    } catch (error) {
      return createErrorResponse(
        error as Error,
        'Invalid project ID format',
        request,
        400
      )
    }

    await executeQuery(`DELETE FROM public.projects WHERE id = $1::uuid`, id)

    return createSuccessResponse(
      { message: 'Project deleted successfully' },
      request
    )
  } catch (error) {
    return handleDatabaseError(error, 'delete project', request)
  }
}
