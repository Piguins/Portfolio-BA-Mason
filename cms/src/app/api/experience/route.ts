import { NextRequest } from 'next/server'
import { corsOptionsHandler } from '@/middleware/cors'
import { parseRequestBody, createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { handleDatabaseError } from '@/lib/api/handlers/error-handler'
import { validateRequiredFields } from '@/lib/api/validators/request-validator'
import { queryAll, executeTransaction } from '@/lib/api/database/query-helpers'
import { createErrorResponse } from '@/lib/api/handlers/error-handler'

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return corsOptionsHandler(request)
}

// GET - Get all experiences (with bullets from experience_bullets)
export async function GET(request: NextRequest) {
  try {
    const experiences = await queryAll<{
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
    }>(`
      SELECT
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
          json_agg(DISTINCT jsonb_build_object(
            'id', eb.id,
            'text', eb.text
          )) FILTER (WHERE eb.id IS NOT NULL),
          '[]'
        ) AS bullets
      FROM public.experience e
      LEFT JOIN public.experience_bullets eb ON eb.experience_id = e.id
      GROUP BY e.id, e.company, e.role, e.location, e.start_date, e.end_date, 
               e.is_current, e.description, e.created_at, e.updated_at, e.skills_text
      ORDER BY e.start_date DESC
    `)

    return createSuccessResponse(experiences, request)
  } catch (error) {
    return handleDatabaseError(error, 'fetch experiences', request)
  }
}

// POST - Create experience (with bullets in experience_bullets table)
export async function POST(request: NextRequest) {
  try {
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

    // Use transaction for atomicity
    const experience = await executeTransaction(async (tx) => {
      // Insert experience and get ID
      const expResult = await tx.$queryRawUnsafe<Array<{ id: string }>>(
        `INSERT INTO public.experience 
         (company, role, location, start_date, end_date, is_current, description, skills_text)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::text[])
         RETURNING id`,
        company,
        role,
        location || null,
        start_date,
        end_date || null,
        is_current || false,
        description || null,
        Array.isArray(skills_text) ? skills_text : []
      )

      const exp = expResult[0]
      const expId = exp.id

      // Insert bullets
      if (bullets.length > 0) {
        for (const bullet of bullets) {
          const bulletText = typeof bullet === 'string' ? bullet : (bullet.text || '')
          await tx.$executeRawUnsafe(
            `INSERT INTO public.experience_bullets (experience_id, text) VALUES ($1::uuid, $2)`,
            expId,
            bulletText
          )
        }
      }

      // Return full experience with bullets
      const fullExp = await tx.$queryRawUnsafe<Array<{
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
      }>>(
        `SELECT
          e.*,
          COALESCE(
            json_agg(DISTINCT jsonb_build_object('id', eb.id, 'text', eb.text)) 
            FILTER (WHERE eb.id IS NOT NULL),
            '[]'
          ) AS bullets
         FROM public.experience e
         LEFT JOIN public.experience_bullets eb ON eb.experience_id = e.id
         WHERE e.id = $1::uuid
         GROUP BY e.id`,
        expId
      )

      return fullExp[0]
    })

    return createSuccessResponse(experience, request, 201)
  } catch (error) {
    return handleDatabaseError(error, 'create experience', request)
  }
}
