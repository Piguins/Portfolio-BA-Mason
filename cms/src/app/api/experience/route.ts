import { NextRequest } from 'next/server'
import { corsOptionsHandler } from '@/middleware/cors'
import { parseRequestBody, createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { handleDatabaseError } from '@/lib/api/handlers/error-handler'
import { validateRequiredFields } from '@/lib/api/validators/request-validator'
import { queryAll, executeTransaction } from '@/lib/api/database/query-helpers'
import { createErrorResponse } from '@/lib/api/handlers/error-handler'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return corsOptionsHandler(request)
}

// GET - Get all experiences (with bullets from experience_bullets)
export async function GET(request: NextRequest) {
  try {
    // Optimized query: Use index on start_date for ORDER BY
    // Index idx_experience_start_date should be used for ORDER BY e.start_date DESC
    // Index idx_experience_bullets_experience_id should be used for JOIN
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
          json_agg(
            jsonb_build_object('id', eb.id, 'text', eb.text)
            ORDER BY eb.id
          ) FILTER (WHERE eb.id IS NOT NULL),
          '[]'::json
        ) AS bullets
      FROM public.experience e
      LEFT JOIN public.experience_bullets eb ON eb.experience_id = e.id
      GROUP BY e.id, e.company, e.role, e.location, e.start_date, e.end_date, 
               e.is_current, e.description, e.created_at, e.updated_at, e.skills_text
      ORDER BY e.start_date DESC
    `)
    
    // Transform bullets from JSON string to array if needed
    const transformedExperiences = experiences.map(exp => {
      let bullets = exp.bullets
      // Handle case where bullets might be a JSON string
      if (typeof bullets === 'string') {
        try {
          bullets = JSON.parse(bullets)
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[Experience GET] Error parsing bullets:', e)
          }
          bullets = []
        }
      }
      // Ensure bullets is an array
      if (!Array.isArray(bullets)) {
        bullets = []
      }
      return {
        ...exp,
        bullets
      }
    })

    return createSuccessResponse(transformedExperiences, request, 200, { revalidate: 60 })
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

    // Normalize empty strings to null for optional fields
    const normalizedEndDate = end_date && typeof end_date === 'string' && end_date.trim() !== '' ? end_date : null
    const normalizedDescription = description && typeof description === 'string' && description.trim() !== '' ? description : null
    const normalizedLocation = location && typeof location === 'string' && location.trim() !== '' ? location : null

    // Validate start_date format
    if (!start_date || typeof start_date !== 'string' || start_date.trim() === '') {
      return createErrorResponse(
        new Error('start_date is required and must be a valid date string'),
        'start_date is required and must be a valid date string',
        request,
        400
      )
    }

    // Log values for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Experience POST] Values:', {
        company,
        role,
        location: normalizedLocation,
        start_date,
        end_date: normalizedEndDate,
        is_current,
        description: normalizedDescription,
        bullets_count: bullets.length,
        skills_text_count: Array.isArray(skills_text) ? skills_text.length : 0,
      })
    }

    // Use transaction for atomicity
    const experience = await executeTransaction(async (tx) => {
      // Insert experience and get ID
      const expResult = await tx.$queryRawUnsafe(
        `INSERT INTO public.experience 
         (company, role, location, start_date, end_date, is_current, description, skills_text)
         VALUES ($1, $2, $3, $4::date, $5::date, $6, $7, $8::text[])
         RETURNING id`,
        company,
        role,
        normalizedLocation,
        start_date,
        normalizedEndDate,
        is_current || false,
        normalizedDescription,
        Array.isArray(skills_text) ? skills_text : []
      ) as Array<{ id: string }>

      if (!expResult || expResult.length === 0) {
        throw new Error('Failed to create experience: No ID returned')
      }

      const exp = expResult[0]
      const expId = exp.id

      // Insert bullets
      if (bullets.length > 0) {
        for (const bullet of bullets) {
          const bulletText = typeof bullet === 'string' ? bullet : (bullet.text || '')
          if (bulletText.trim()) {
            await tx.$executeRawUnsafe(
              `INSERT INTO public.experience_bullets (experience_id, text) VALUES ($1::uuid, $2)`,
              expId,
              bulletText
            )
          }
        }
      }

      // Get the created experience with all fields
      const fullExpResult = await tx.$queryRawUnsafe(
        `SELECT
          id,
          company,
          role,
          location,
          start_date,
          end_date,
          is_current,
          description,
          created_at,
          updated_at,
          skills_text
         FROM public.experience
         WHERE id = $1::uuid`,
        expId
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
      }>

      if (!fullExpResult || fullExpResult.length === 0) {
        throw new Error('Failed to retrieve created experience')
      }

      const experienceData = fullExpResult[0]

      // Get bullets separately to avoid complex aggregation in transaction
      const bulletsResult = await tx.$queryRawUnsafe(
        `SELECT id, text FROM public.experience_bullets WHERE experience_id = $1::uuid ORDER BY id`,
        expId
      ) as Array<{ id: string; text: string }>

      // Build response object with proper date serialization
      return {
        ...experienceData,
        start_date: experienceData.start_date.toISOString().split('T')[0],
        end_date: experienceData.end_date ? experienceData.end_date.toISOString().split('T')[0] : null,
        created_at: experienceData.created_at.toISOString(),
        updated_at: experienceData.updated_at.toISOString(),
        bullets: bulletsResult || []
      }
    })

    return createSuccessResponse(experience, request, 201)
  } catch (error) {
    return handleDatabaseError(error, 'create experience', request)
  }
}
