import { NextRequest } from 'next/server'
import { parseRequestBody, createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { createErrorResponse, handleDatabaseError } from '@/lib/api/handlers/error-handler'
import { validateRequiredFields } from '@/lib/api/validators/request-validator'
import { validateUUID } from '@/lib/api/validators/uuid-validator'
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

// GET - Get project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const raw = searchParams.get('raw') === 'true' // For CMS to get raw i18n data
    const language = getLanguageFromRequest(request)

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
      title_i18n: unknown
      summary_i18n: unknown
    }>(`
      SELECT 
        id, title, summary, hero_image_url, case_study_url, tags_text,
        created_at, updated_at, title_i18n, summary_i18n
      FROM public.projects 
      WHERE id = $1::uuid
    `, id)

    if (!project) {
      return createErrorResponse(
        new Error('Project not found'),
        'Project not found',
        request,
        404
      )
    }

    // If raw=true, return i18n data as-is for CMS editing
    if (raw) {
      // Serialize dates for JSON response
      const serializedProject = {
        ...project,
        created_at: project.created_at.toISOString(),
        updated_at: project.updated_at.toISOString(),
      }
      return createSuccessResponse(serializedProject, request, 200, { revalidate: 60 })
    }

    // Transform i18n fields (only if i18n columns exist)
    const transformed = ('title_i18n' in project || 'summary_i18n' in project)
      ? transformI18nResponse(project, language, ['title', 'summary'])
      : project

    return createSuccessResponse(transformed, request, 200, { revalidate: 60 })
  } catch (error) {
    console.error('Error in GET /api/projects/[id]:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
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
    const language = getLanguageFromRequest(request)

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

    // Parse request body - supports both i18n format and plain text (backward compatible)
    const parseResult = await parseRequestBody<{
      title?: Record<string, string> | string
      summary?: Record<string, string> | string | null
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

    // Convert i18n data to JSONB format
    const titleI18n = typeof title === 'object' 
      ? JSON.stringify(title) 
      : title 
        ? JSON.stringify({ en: title }) 
        : null
    
    const summaryI18n = summary
      ? typeof summary === 'object'
        ? JSON.stringify(summary)
        : summary.trim() !== ''
          ? JSON.stringify({ en: summary })
          : null
      : null

    // Get plain text values for backward compatibility
    const titleText = getI18nText(title, 'en', '')
    const summaryText = getI18nText(summary, 'en') || null

    await executeQuery(
      `UPDATE public.projects
       SET title = $1, summary = $2, hero_image_url = $3, case_study_url = $4,
           tags_text = $5::text[], 
           title_i18n = $6::jsonb, summary_i18n = $7::jsonb,
           updated_at = NOW()
       WHERE id = $8::uuid`,
      titleText,
      summaryText,
      hero_image_url || null,
      case_study_url || null,
      tags_text || [],
      titleI18n,
      summaryI18n,
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
      title_i18n: unknown
      summary_i18n: unknown
    }>(`
      SELECT 
        id, title, summary, hero_image_url, case_study_url, tags_text,
        created_at, updated_at, title_i18n, summary_i18n
      FROM public.projects 
      WHERE id = $1::uuid
    `, id)

    if (!project) {
      throw new Error('Failed to retrieve updated project')
    }

    // Transform i18n fields in response
    const transformed = transformI18nResponse(project, language, ['title', 'summary'])

    return createSuccessResponse(transformed, request)
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
