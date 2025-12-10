import { NextRequest } from 'next/server'
import { parseRequestBody, createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { createErrorResponse, handleDatabaseError } from '@/lib/api/handlers/error-handler'
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

// GET - Get hero section (singleton) - Uses hero_content table
export async function GET(request: NextRequest) {
  try {
    const language = getLanguageFromRequest(request)
    
    const hero = await queryFirst<{
      id: number
      greeting: string
      greeting_part2: string
      name: string
      title: string
      description: string | null
      greeting_i18n: unknown
      greeting_part2_i18n: unknown
      name_i18n: unknown
      title_i18n: unknown
      description_i18n: unknown
      linkedin_url: string | null
      github_url: string | null
      email_url: string | null
      profile_image_url: string | null
      created_at: Date
      updated_at: Date
    }>(`
      SELECT 
        id,
        greeting, greeting_part2, name, title, description,
        greeting_i18n, greeting_part2_i18n, name_i18n, title_i18n, description_i18n,
        linkedin_url, github_url, email_url, profile_image_url,
        created_at, updated_at
      FROM public.hero_content 
      WHERE id = 1 
      LIMIT 1
    `)

    if (!hero) {
      // Return default if not exists
      return createSuccessResponse({
        id: 1,
        greeting: 'Hey!',
        greeting_part2: "I'm",
        name: 'Thế Kiệt (Mason)',
        title: 'Business Analyst',
        description: 'Agency-quality business analysis with the personal touch of a freelancer.',
        linkedin_url: null,
        github_url: null,
        email_url: null,
        profile_image_url: null,
        created_at: new Date(),
        updated_at: new Date(),
      }, request, 200, { revalidate: 60 })
    }

    // Transform i18n fields to plain text based on language
    const transformed = transformI18nResponse(
      hero,
      language,
      ['greeting', 'greeting_part2', 'name', 'title', 'description']
    )

    return createSuccessResponse(transformed, request, 200, { revalidate: 60 })
  } catch (error) {
    return handleDatabaseError(error, 'fetch hero section', request)
  }
}

// POST - Not used (hero is singleton, use PUT instead)
export async function POST(request: NextRequest) {
  return createErrorResponse(
    new Error('Use PUT to update hero content'),
    'Use PUT to update hero content',
    request,
    405
  )
}

// PUT - Update hero section (singleton - always updates id = 1)
export async function PUT(request: NextRequest) {
  try {
    // Parse request body - supports both i18n format and plain text (backward compatible)
    const parseResult = await parseRequestBody<{
      // i18n format: {en: "...", vi: "..."}
      greeting?: Record<string, string> | string
      greeting_part2?: Record<string, string> | string
      name?: Record<string, string> | string
      title?: Record<string, string> | string
      description?: Record<string, string> | string | null
      // Plain fields
      linkedin_url?: string | null
      github_url?: string | null
      email_url?: string | null
      profile_image_url?: string | null
    }>(request)
    if (parseResult.error) {
      return parseResult.error
    }

    const body = parseResult.data
    const {
      greeting,
      greeting_part2,
      name,
      title,
      description,
      linkedin_url,
      github_url,
      email_url,
      profile_image_url,
    } = body

    // Convert to JSONB format if needed
    const greetingI18n = typeof greeting === 'object' 
      ? JSON.stringify(greeting) 
      : greeting 
        ? JSON.stringify({ en: greeting }) 
        : JSON.stringify({ en: 'Hey!' })
    
    const greetingPart2I18n = typeof greeting_part2 === 'object'
      ? JSON.stringify(greeting_part2)
      : greeting_part2
        ? JSON.stringify({ en: greeting_part2 })
        : JSON.stringify({ en: "I'm" })
    
    const nameI18n = typeof name === 'object'
      ? JSON.stringify(name)
      : name
        ? JSON.stringify({ en: name })
        : JSON.stringify({ en: 'Thế Kiệt (Mason)' })
    
    const titleI18n = typeof title === 'object'
      ? JSON.stringify(title)
      : title
        ? JSON.stringify({ en: title })
        : JSON.stringify({ en: 'Business Analyst' })
    
    const descriptionI18n = description
      ? typeof description === 'object'
        ? JSON.stringify(description)
        : JSON.stringify({ en: description })
      : null

    await executeQuery(
      `INSERT INTO public.hero_content (
        id, 
        greeting, greeting_part2, name, title, description,
        greeting_i18n, greeting_part2_i18n, name_i18n, title_i18n, description_i18n,
        linkedin_url, github_url, email_url, profile_image_url, updated_at
      )
      VALUES (1, $1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb, $9::jsonb, $10::jsonb, $11, $12, $13, $14, NOW())
      ON CONFLICT (id) DO UPDATE SET
        greeting = EXCLUDED.greeting,
        greeting_part2 = EXCLUDED.greeting_part2,
        name = EXCLUDED.name,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        greeting_i18n = EXCLUDED.greeting_i18n,
        greeting_part2_i18n = EXCLUDED.greeting_part2_i18n,
        name_i18n = EXCLUDED.name_i18n,
        title_i18n = EXCLUDED.title_i18n,
        description_i18n = EXCLUDED.description_i18n,
        linkedin_url = EXCLUDED.linkedin_url,
        github_url = EXCLUDED.github_url,
        email_url = EXCLUDED.email_url,
        profile_image_url = EXCLUDED.profile_image_url,
        updated_at = NOW()`,
      getI18nText(greeting, 'en', 'Hey!'),
      getI18nText(greeting_part2, 'en', "I'm"),
      getI18nText(name, 'en', 'Thế Kiệt (Mason)'),
      getI18nText(title, 'en', 'Business Analyst'),
      getI18nText(description, 'en') || null,
      greetingI18n,
      greetingPart2I18n,
      nameI18n,
      titleI18n,
      descriptionI18n,
      linkedin_url || null,
      github_url || null,
      email_url || null,
      profile_image_url || null
    )

    const language = getLanguageFromRequest(request)
    const hero = await queryFirst<{
      id: number
      greeting: string
      greeting_part2: string
      name: string
      title: string
      description: string | null
      greeting_i18n: unknown
      greeting_part2_i18n: unknown
      name_i18n: unknown
      title_i18n: unknown
      description_i18n: unknown
      linkedin_url: string | null
      github_url: string | null
      email_url: string | null
      profile_image_url: string | null
      created_at: Date
      updated_at: Date
    }>(`
      SELECT 
        id,
        greeting, greeting_part2, name, title, description,
        greeting_i18n, greeting_part2_i18n, name_i18n, title_i18n, description_i18n,
        linkedin_url, github_url, email_url, profile_image_url,
        created_at, updated_at
      FROM public.hero_content 
      WHERE id = 1 
      LIMIT 1
    `)

    if (!hero) {
      throw new Error('Failed to retrieve updated hero')
    }

    // Transform i18n fields to plain text based on language
    const transformed = transformI18nResponse(
      hero,
      language,
      ['greeting', 'greeting_part2', 'name', 'title', 'description']
    )

    return createSuccessResponse(transformed, request)
  } catch (error) {
    return handleDatabaseError(error, 'update hero section', request)
  }
}

// DELETE - Not allowed (hero is singleton)
export async function DELETE(request: NextRequest) {
  return createErrorResponse(
    new Error('Cannot delete hero content (singleton)'),
    'Cannot delete hero content (singleton)',
    request,
    405
  )
}
