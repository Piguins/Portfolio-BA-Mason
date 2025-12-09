import { NextRequest } from 'next/server'
import { parseRequestBody, createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { handleDatabaseError, createErrorResponse } from '@/lib/api/handlers/error-handler'
import { validateRequiredFields } from '@/lib/api/validators/request-validator'
import { queryAll, queryFirst, executeQuery } from '@/lib/api/database/query-helpers'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET - Get all skills
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const highlight = searchParams.get('highlight')

    let query = `
      SELECT
        id,
        name,
        slug,
        category,
        level,
        icon_url,
        description,
        order_index,
        is_highlight,
        created_at,
        updated_at
      FROM public.skills
      WHERE 1=1
    `
    const params: unknown[] = []
    let paramIndex = 1

    if (category) {
      query += ` AND category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    if (highlight !== null && highlight !== undefined) {
      query += ` AND is_highlight = $${paramIndex}`
      params.push(highlight === 'true')
      paramIndex++
    }

    query += ` ORDER BY order_index ASC, name ASC`

    const skills = await queryAll<{
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
    }>(query, ...params)

    return createSuccessResponse(skills, request)
  } catch (error) {
    return handleDatabaseError(error, 'fetch skills', request)
  }
}

// POST - Create skill
export async function POST(request: NextRequest) {
  try {
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

    const result = await queryFirst<{ id: number }>(
      `INSERT INTO public.skills (name, slug, category, level, icon_url, description, order_index, is_highlight)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      name,
      slug || null,
      category,
      level || null,
      icon_url || null,
      description || null,
      order_index || 0,
      is_highlight || false
    )

    if (!result) {
      throw new Error('Failed to create skill')
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
    }>(`SELECT * FROM public.skills WHERE id = $1`, result.id)

    return createSuccessResponse(skill, request, 201)
  } catch (error) {
    return handleDatabaseError(error, 'create skill', request)
  }
}
