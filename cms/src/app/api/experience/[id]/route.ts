import { NextRequest } from 'next/server'
import { parseRequestBody, createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { createErrorResponse, handleDatabaseError } from '@/lib/api/handlers/error-handler'
import { validateRequiredFields } from '@/lib/api/validators/request-validator'
import { validateUUID } from '@/lib/api/validators/uuid-validator'
import { queryFirst, executeTransaction } from '@/lib/api/database/query-helpers'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET - Get experience by ID (with bullets from experience_bullets)
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
        'Invalid experience ID format',
        request,
        400
      )
    }

    const experience = await queryFirst<{
      id: string
      company: string
      role: string
      location: string | null
      start_date: Date
      end_date: Date | null
      is_current: boolean
      description: string | null
      created_at: Date
      updated_at: Date
      skills_text: string[]
      bullets: Array<{ id: string; text: string }>
    }>(
      `SELECT
        e.id,
        e.company,
        e.role,
        e.location,
        e.start_date,
        e.end_date,
        e.is_current,
        e.description,
        e.created_at,
        e.updated_at,
        e.skills_text,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', eb.id, 'text', eb.text)) 
          FILTER (WHERE eb.id IS NOT NULL),
          '[]'
        ) AS bullets
       FROM public.experience e
       LEFT JOIN public.experience_bullets eb ON eb.experience_id = e.id
       WHERE e.id = $1::uuid
       GROUP BY e.id, e.company, e.role, e.location, e.start_date, e.end_date, 
                e.is_current, e.description, e.created_at, e.updated_at, e.skills_text`,
      id
    )

    if (!experience) {
      return createErrorResponse(
        new Error('Experience not found'),
        'Experience not found',
        request,
        404
      )
    }

    return createSuccessResponse(experience, request)
  } catch (error) {
    return handleDatabaseError(error, 'fetch experience', request)
  }
}

// PUT - Update experience (with bullets in experience_bullets table)
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
        'Invalid experience ID format',
        request,
        400
      )
    }

    // Parse request body
    const parseResult = await parseRequestBody<{
      company?: string
      role?: string
      location?: string
      start_date?: string
      end_date?: string | null
      is_current?: boolean
      description?: string | null
      bullets?: Array<{ text?: string } | string>
      skills_text?: string[]
    }>(request)
    if (parseResult.error) {
      return parseResult.error
    }

    const body = parseResult.data
    const {
      company,
      role,
      location,
      start_date,
      end_date,
      is_current,
      description,
      bullets = [],
      skills_text = [],
    } = body

    // Validate required fields
    const validation = validateRequiredFields(body as Record<string, unknown>, ['company', 'role', 'start_date'])
    if (!validation.isValid) {
      return createErrorResponse(
        new Error(`Missing required fields: ${validation.missingFields.join(', ')}`),
        `Missing required fields: ${validation.missingFields.join(', ')}`,
        request,
        400
      )
    }

    // Use transaction
    const experience = await executeTransaction(async (tx) => {
      // Update experience
      await tx.$executeRawUnsafe(
        `UPDATE public.experience 
         SET company = $1, role = $2, location = $3, start_date = $4, 
             end_date = $5, is_current = $6, description = $7,
             skills_text = $8::text[], updated_at = NOW()
         WHERE id = $9::uuid`,
        company,
        role,
        location || null,
        start_date,
        end_date || null,
        is_current || false,
        description || null,
        Array.isArray(skills_text) ? skills_text : [],
        id
      )

      // Delete old bullets
      await tx.$executeRawUnsafe(
        `DELETE FROM public.experience_bullets WHERE experience_id = $1::uuid`,
        id
      )

      // Insert new bullets
      if (bullets.length > 0) {
        for (const bullet of bullets) {
          const bulletText = typeof bullet === 'string' ? bullet : (bullet.text || '')
          await tx.$executeRawUnsafe(
            `INSERT INTO public.experience_bullets (experience_id, text) VALUES ($1::uuid, $2)`,
            id,
            bulletText
          )
        }
      }

      // Return full experience with bullets
      const fullExp = await tx.$queryRawUnsafe(
        `SELECT
          e.id,
          e.company,
          e.role,
          e.location,
          e.start_date,
          e.end_date,
          e.is_current,
          e.description,
          e.created_at,
          e.updated_at,
          e.skills_text,
          COALESCE(
            json_agg(DISTINCT jsonb_build_object('id', eb.id, 'text', eb.text)) 
            FILTER (WHERE eb.id IS NOT NULL),
            '[]'::json
          ) AS bullets
         FROM public.experience e
         LEFT JOIN public.experience_bullets eb ON eb.experience_id = e.id
         WHERE e.id = $1::uuid
         GROUP BY e.id, e.company, e.role, e.location, e.start_date, e.end_date, 
                  e.is_current, e.description, e.created_at, e.updated_at, e.skills_text`,
        id
      ) as Array<{
        id: string
        company: string
        role: string
        location: string | null
        start_date: Date
        end_date: Date | null
        is_current: boolean
        description: string | null
        created_at: Date
        updated_at: Date
        skills_text: string[]
        bullets: Array<{ id: string; text: string }>
      }>

      return fullExp[0]
    })

    return createSuccessResponse(experience, request)
  } catch (error) {
    return handleDatabaseError(error, 'update experience', request)
  }
}

// DELETE - Delete experience (cascades to experience_bullets)
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
        'Invalid experience ID format',
        request,
        400
      )
    }

    // Use transaction to delete bullets first, then experience
    await executeTransaction(async (tx) => {
      await tx.$executeRawUnsafe(
        `DELETE FROM public.experience_bullets WHERE experience_id = $1::uuid`,
        id
      )
      await tx.$executeRawUnsafe(`DELETE FROM public.experience WHERE id = $1::uuid`, id)
    })

    return createSuccessResponse(
      { message: 'Experience deleted successfully' },
      request
    )
  } catch (error) {
    return handleDatabaseError(error, 'delete experience', request)
  }
}
