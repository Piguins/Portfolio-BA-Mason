import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseRequestBody, createSuccessResponse } from '@/lib/api/handlers/request-handler'
import { createErrorResponse, handleDatabaseError } from '@/lib/api/handlers/error-handler'
import { validateRequiredFields } from '@/lib/api/validators/request-validator'
import { validateUUID } from '@/lib/api/validators/uuid-validator'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET - Get portfolio project by ID
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
        'Invalid portfolio ID format',
        request,
        400
      )
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
    })

    if (!portfolio) {
      return createErrorResponse(
        new Error('Portfolio project not found'),
        'Portfolio project not found',
        request,
        404
      )
    }

    return createSuccessResponse(portfolio, request, 200, { revalidate: 60 })
  } catch (error) {
    return handleDatabaseError(error, 'fetch portfolio', request)
  }
}

// PUT - Update portfolio project
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
        'Invalid portfolio ID format',
        request,
        400
      )
    }

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

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        title,
        tagRole,
        description: description || null,
        imageUrl: imageUrl || null,
        projectUrl: projectUrl || null,
      },
    })

    return createSuccessResponse(portfolio, request)
  } catch (error) {
    return handleDatabaseError(error, 'update portfolio', request)
  }
}

// DELETE - Delete portfolio project
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
        'Invalid portfolio ID format',
        request,
        400
      )
    }

    await prisma.portfolio.delete({
      where: { id },
    })

    return createSuccessResponse(
      { message: 'Portfolio project deleted successfully' },
      request
    )
  } catch (error) {
    return handleDatabaseError(error, 'delete portfolio', request)
  }
}
