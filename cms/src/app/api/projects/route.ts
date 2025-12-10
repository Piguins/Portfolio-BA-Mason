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

// GET - Get all projects (uses projects table)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')

    // Optimized query: Use index idx_projects_created_at for ORDER BY
    const projects = await queryAll<{
      id: string
      title: string
      summary: string | null
      hero_image_url: string | null
      case_study_url: string | null
      tags_text: string[]
      created_at: Date
      updated_at: Date
    }>(`
      SELECT
        id,
        title,
        summary,
        hero_image_url,
        case_study_url,
        tags_text,
        created_at,
        updated_at
      FROM public.projects
      ORDER BY created_at DESC
    `)

    return createSuccessResponse(projects, request, 200, { revalidate: 60 })
  } catch (error) {
    return handleDatabaseError(error, 'fetch projects', request)
  }
}

// POST - Create project
export async function POST(request: NextRequest) {
  try {
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

    const project = await queryFirst<{
      id: string
      title: string
      summary: string | null
      hero_image_url: string | null
      case_study_url: string | null
      tags_text: string[]
      created_at: Date
      updated_at: Date
    }>(
      `INSERT INTO public.projects (title, summary, hero_image_url, case_study_url, tags_text)
       VALUES ($1, $2, $3, $4, $5::text[])
       RETURNING id, title, summary, hero_image_url, case_study_url, tags_text, created_at, updated_at`,
      title,
      summary || null,
      hero_image_url || null,
      case_study_url || null,
      tags_text || []
    )

    if (!project) {
      throw new Error('Failed to create project')
    }

    return createSuccessResponse(project, request, 201)
  } catch (error) {
    return handleDatabaseError(error, 'create project', request)
  }
}
