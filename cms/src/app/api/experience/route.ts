import { NextRequest } from 'next/server'
import { corsOptionsHandler } from '@/middleware/cors'
import { parseRequestBody, createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { handleDatabaseError, createErrorResponse } from '@/lib/api/handlers/error-handler'
import { validateRequiredFields } from '@/lib/api/validators/request-validator'
import { queryAll, executeTransaction } from '@/lib/api/database/query-helpers'
import { getLanguageFromRequest, transformI18nArray, transformI18nResponse } from '@/lib/i18n/api-helpers'
import { getI18nText } from '@/lib/i18n/helpers'

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
    const language = getLanguageFromRequest(request)
    
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
      company_i18n: unknown
      role_i18n: unknown
      location_i18n: unknown
      description_i18n: unknown
      bullets: Array<{ id: string; text: string; text_i18n?: unknown }>
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
        e.company_i18n,
        e.role_i18n,
        e.location_i18n,
        e.description_i18n,
        COALESCE(
          json_agg(
            jsonb_build_object('id', eb.id, 'text', eb.text, 'text_i18n', eb.text_i18n)
            ORDER BY eb.id
          ) FILTER (WHERE eb.id IS NOT NULL),
          '[]'::json
        ) AS bullets
      FROM public.experience e
      LEFT JOIN public.experience_bullets eb ON eb.experience_id = e.id
      GROUP BY e.id, e.company, e.role, e.location, e.start_date, e.end_date, 
               e.is_current, e.description, e.created_at, e.updated_at, e.skills_text,
               e.company_i18n, e.role_i18n, e.location_i18n, e.description_i18n
      ORDER BY e.start_date DESC
    `)
    
    // Transform i18n fields and bullets
    const transformedExperiences = experiences.map(exp => {
      // Transform main i18n fields
      const transformed = transformI18nArray(
        [exp],
        language,
        ['company', 'role', 'location', 'description']
      )[0]
      
      // Transform bullets i18n
      let bullets = exp.bullets
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
      if (!Array.isArray(bullets)) {
        bullets = []
      }
      
      // Transform each bullet's text_i18n
      const transformedBullets = bullets.map((bullet: { id: string; text: string; text_i18n?: unknown }) => {
        // Use text_i18n if available, otherwise fallback to text
        const i18nValue = bullet.text_i18n && typeof bullet.text_i18n === 'object' && Object.keys(bullet.text_i18n).length > 0
          ? bullet.text_i18n
          : bullet.text
        return {
          id: bullet.id,
          text: getI18nText(i18nValue as any, language, bullet.text || '')
        }
      })
      
      return {
        ...transformed,
        bullets: transformedBullets
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
    const language = getLanguageFromRequest(request)
    
    // Parse request body - supports both i18n format and plain text (backward compatible)
    const parseResult = await parseRequestBody<{
      company?: Record<string, string> | string
      role?: Record<string, string> | string
      location?: Record<string, string> | string
      start_date?: string
      end_date?: string | null
      is_current?: boolean
      description?: Record<string, string> | string | null
      bullets?: Array<{ text?: Record<string, string> | string } | string>
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

    // Convert i18n data to JSONB format
    const companyI18n = typeof company === 'object' 
      ? JSON.stringify(company) 
      : company 
        ? JSON.stringify({ en: company }) 
        : null
    
    const roleI18n = typeof role === 'object'
      ? JSON.stringify(role)
      : role
        ? JSON.stringify({ en: role })
        : null
    
    const locationI18n = location
      ? typeof location === 'object'
        ? JSON.stringify(location)
        : location.trim() !== ''
          ? JSON.stringify({ en: location })
          : null
      : null
    
    const descriptionI18n = description
      ? typeof description === 'object'
        ? JSON.stringify(description)
        : description.trim() !== ''
          ? JSON.stringify({ en: description })
          : null
      : null

    // Get plain text values for backward compatibility (old columns)
    const companyText = getI18nText(company, 'en', '')
    const roleText = getI18nText(role, 'en', '')
    const locationText = getI18nText(location, 'en') || null
    const descriptionText = getI18nText(description, 'en') || null

    // Normalize empty strings to null for optional fields
    const normalizedEndDate = end_date && typeof end_date === 'string' && end_date.trim() !== '' ? end_date : null

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
        location: locationText,
        start_date,
        end_date: normalizedEndDate,
        is_current,
        description: descriptionText,
        bullets_count: bullets.length,
        skills_text_count: Array.isArray(skills_text) ? skills_text.length : 0,
      })
    }

    // Use transaction for atomicity
    const experience = await executeTransaction(async (tx) => {
      // Insert experience and get ID (with i18n fields)
      const expResult = await tx.$queryRawUnsafe(
        `INSERT INTO public.experience 
         (company, role, location, start_date, end_date, is_current, description, skills_text,
          company_i18n, role_i18n, location_i18n, description_i18n)
         VALUES ($1, $2, $3, $4::date, $5::date, $6, $7, $8::text[],
                 $9::jsonb, $10::jsonb, $11::jsonb, $12::jsonb)
         RETURNING id`,
        companyText,
        roleText,
        locationText,
        start_date,
        normalizedEndDate,
        is_current || false,
        descriptionText,
        Array.isArray(skills_text) ? skills_text : [],
        companyI18n,
        roleI18n,
        locationI18n,
        descriptionI18n
      ) as Array<{ id: string }>

      if (!expResult || expResult.length === 0) {
        throw new Error('Failed to create experience: No ID returned')
      }

      const exp = expResult[0]
      const expId = exp.id

      // Insert bullets (with i18n support)
      if (bullets.length > 0) {
        for (const bullet of bullets) {
          const bulletData = typeof bullet === 'string' ? { text: bullet } : bullet
          const bulletText = typeof bulletData.text === 'string' ? bulletData.text : getI18nText(bulletData.text, 'en', '')
          const bulletTextI18n = typeof bulletData.text === 'object'
            ? JSON.stringify(bulletData.text)
            : bulletText.trim() !== ''
              ? JSON.stringify({ en: bulletText })
              : null
          
          if (bulletText.trim()) {
            await tx.$executeRawUnsafe(
              `INSERT INTO public.experience_bullets (experience_id, text, text_i18n) 
               VALUES ($1::uuid, $2, $3::jsonb)`,
              expId,
              bulletText,
              bulletTextI18n
            )
          }
        }
      }

      // Get the created experience with all fields (including i18n)
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
          skills_text,
          company_i18n,
          role_i18n,
          location_i18n,
          description_i18n
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
        company_i18n: unknown
        role_i18n: unknown
        location_i18n: unknown
        description_i18n: unknown
      }>

      if (!fullExpResult || fullExpResult.length === 0) {
        throw new Error('Failed to retrieve created experience')
      }

      const experienceData = fullExpResult[0]

      // Get bullets separately (with i18n)
      const bulletsResult = await tx.$queryRawUnsafe(
        `SELECT id, text, text_i18n FROM public.experience_bullets WHERE experience_id = $1::uuid ORDER BY id`,
        expId
      ) as Array<{ id: string; text: string; text_i18n?: unknown }>

      // Transform i18n fields
      const transformed = transformI18nResponse(
        experienceData,
        language,
        ['company', 'role', 'location', 'description']
      )

      // Transform bullets i18n
      const transformedBullets = bulletsResult.map(bullet => ({
        id: bullet.id,
        text: getI18nText(bullet.text_i18n || bullet.text, language, bullet.text || '')
      }))

      // Build response object with proper date serialization
      return {
        ...transformed,
        start_date: experienceData.start_date.toISOString().split('T')[0],
        end_date: experienceData.end_date ? experienceData.end_date.toISOString().split('T')[0] : null,
        created_at: experienceData.created_at.toISOString(),
        updated_at: experienceData.updated_at.toISOString(),
        bullets: transformedBullets
      }
    })

    return createSuccessResponse(experience, request, 201)
  } catch (error) {
    return handleDatabaseError(error, 'create experience', request)
  }
}
