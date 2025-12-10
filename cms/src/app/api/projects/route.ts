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

// GET - Get all projects (uses projects table)
export async function GET(request: NextRequest) {
  try {
    const language = getLanguageFromRequest(request)
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
      title_i18n: unknown
      summary_i18n: unknown
    }>(`
      SELECT
        id,
        title,
        summary,
        hero_image_url,
        case_study_url,
        tags_text,
        created_at,
        updated_at,
        title_i18n,
        summary_i18n
      FROM public.projects
      ORDER BY created_at DESC
    `)

    // Transform i18n fields
    const transformed = transformI18nArray(projects, language, ['title', 'summary'])

    return createSuccessResponse(transformed, request, 200, { revalidate: 60 })
  } catch (error) {
    console.error('Error in GET /api/projects:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return handleDatabaseError(error, 'fetch projects', request)
  }
}

// POST - Create project
export async function POST(request: NextRequest) {
  try {
    const language = getLanguageFromRequest(request)
    
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
    }>(
      `INSERT INTO public.projects (title, summary, hero_image_url, case_study_url, tags_text, title_i18n, summary_i18n)
       VALUES ($1, $2, $3, $4, $5::text[], $6::jsonb, $7::jsonb)
       RETURNING id, title, summary, hero_image_url, case_study_url, tags_text, created_at, updated_at, title_i18n, summary_i18n`,
      titleText,
      summaryText,
      hero_image_url || null,
      case_study_url || null,
      tags_text || [],
      titleI18n,
      summaryI18n
    )

    if (!project) {
      throw new Error('Failed to create project')
    }

    // Transform i18n fields in response
    const transformed = transformI18nArray([project], language, ['title', 'summary'])[0]

    return createSuccessResponse(transformed, request, 201)
  } catch (error) {
    return handleDatabaseError(error, 'create project', request)
  }
}
