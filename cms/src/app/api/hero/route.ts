import { NextRequest } from 'next/server'
import { parseRequestBody, createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { createErrorResponse, handleDatabaseError } from '@/lib/api/handlers/error-handler'
import { queryFirst, executeQuery } from '@/lib/api/database/query-helpers'

// GET - Get hero section (singleton) - Uses hero_content table
export async function GET(request: NextRequest) {
  try {
    const hero = await queryFirst<{
      id: number
      greeting: string
      greeting_part2: string
      name: string
      title: string
      description: string | null
      linkedin_url: string | null
      github_url: string | null
      email_url: string | null
      profile_image_url: string | null
      created_at: Date
      updated_at: Date
    }>(`SELECT * FROM public.hero_content WHERE id = 1 LIMIT 1`)

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
      }, request)
    }

    return createSuccessResponse(hero, request)
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
    // Parse request body
    const parseResult = await parseRequestBody<{
      greeting?: string
      greeting_part2?: string
      name?: string
      title?: string
      description?: string | null
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

    await executeQuery(
      `INSERT INTO public.hero_content (
        id, greeting, greeting_part2, name, title, description,
        linkedin_url, github_url, email_url, profile_image_url, updated_at
      )
      VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      ON CONFLICT (id) DO UPDATE SET
        greeting = EXCLUDED.greeting,
        greeting_part2 = EXCLUDED.greeting_part2,
        name = EXCLUDED.name,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        linkedin_url = EXCLUDED.linkedin_url,
        github_url = EXCLUDED.github_url,
        email_url = EXCLUDED.email_url,
        profile_image_url = EXCLUDED.profile_image_url,
        updated_at = NOW()`,
      greeting || 'Hey!',
      greeting_part2 || "I'm",
      name || 'Thế Kiệt (Mason)',
      title || 'Business Analyst',
      description || null,
      linkedin_url || null,
      github_url || null,
      email_url || null,
      profile_image_url || null
    )

    const hero = await queryFirst<{
      id: number
      greeting: string
      greeting_part2: string
      name: string
      title: string
      description: string | null
      linkedin_url: string | null
      github_url: string | null
      email_url: string | null
      profile_image_url: string | null
      created_at: Date
      updated_at: Date
    }>(`SELECT * FROM public.hero_content WHERE id = 1 LIMIT 1`)

    return createSuccessResponse(hero, request)
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
