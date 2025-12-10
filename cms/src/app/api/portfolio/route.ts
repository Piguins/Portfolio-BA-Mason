import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { handleDatabaseError, createErrorResponse } from '@/lib/api/handlers/error-handler'
import { parseRequestBody } from '@/lib/api/handlers/request-handler'
import { validateRequiredFields } from '@/lib/api/validators/request-validator'
import { corsOptionsHandler } from '@/middleware/cors'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return corsOptionsHandler(request)
}

// GET - Get all portfolio projects
export async function GET(request: NextRequest) {
  try {
    const portfolios = await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return createSuccessResponse(portfolios, request, 200, { revalidate: 60 })
  } catch (error) {
    return handleDatabaseError(error, 'fetch portfolios', request)
  }
}

// POST - Create portfolio project
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const parseResult = await parseRequestBody<{
      title?: string
      tagRole?: string
      description?: string | null
      imageUrl?: string | null
      projectUrl?: string | null
    }>(request)
    if (parseResult.error) {
      return parseResult.error
    }

    const body = parseResult.data
    const { title, tagRole, description, imageUrl, projectUrl } = body

    // Validate required fields
    const validation = validateRequiredFields(body as Record<string, unknown>, ['title', 'tagRole'])
    if (!validation.isValid) {
      return createErrorResponse(
        new Error(`Missing required fields: ${validation.missingFields.join(', ')}`),
        `Missing required fields: ${validation.missingFields.join(', ')}`,
        request,
        400
      )
    }

    // Type assertion after validation
    if (!title || !tagRole) {
      return createErrorResponse(
        new Error('Title and tagRole are required'),
        'Title and tagRole are required',
        request,
        400
      )
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        title,
        tagRole,
        description: description || null,
        imageUrl: imageUrl || null,
        projectUrl: projectUrl || null,
      },
    })

    return createSuccessResponse(portfolio, request, 201)
  } catch (error) {
    return handleDatabaseError(error, 'create portfolio', request)
  }
}
