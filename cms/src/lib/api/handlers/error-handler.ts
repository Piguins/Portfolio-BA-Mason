import { NextResponse } from 'next/server'
import { corsHeaders } from '@/middleware/cors'
import { sanitizeError } from '@/lib/security'
import type { NextRequest } from 'next/server'

export interface ApiError {
  message: string
  statusCode: number
  code?: string
  details?: unknown
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
  error: unknown,
  defaultMessage: string,
  request: NextRequest,
  statusCode: number = 500
): NextResponse {
  // Log full error for debugging (server-side only)
  console.error(`[API Error] ${defaultMessage}:`, error)

  // Extract error details
  let errorMessage = defaultMessage
  let errorCode: string | undefined
  let errorDetails: unknown = undefined

  if (error instanceof Error) {
    errorMessage = error.message || defaultMessage
    errorCode = error.name
    errorDetails = process.env.NODE_ENV === 'development' ? error.stack : undefined
  } else if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>
    errorMessage = (err.message as string) || defaultMessage
    errorCode = (err.code as string) || err.name as string
  }

  // Sanitize error message for production
  const sanitizedMessage = 
    process.env.NODE_ENV === 'production' 
      ? sanitizeError(error) 
      : errorMessage

  const responseBody: Record<string, unknown> = {
    error: sanitizedMessage,
  }

  if (process.env.NODE_ENV === 'development') {
    if (errorCode) {
      responseBody.code = errorCode
    }
    if (errorDetails) {
      responseBody.details = errorDetails
    }
  }

  return NextResponse.json(
    responseBody,
    {
      status: statusCode,
      headers: corsHeaders(request),
    }
  )
}

/**
 * Handle common database errors
 */
export function handleDatabaseError(
  error: unknown,
  operation: string,
  request: NextRequest
): NextResponse {
  if (error instanceof Error) {
    // Prisma/PostgreSQL specific errors
    if (error.message.includes('Unique constraint')) {
      return createErrorResponse(
        error,
        'Resource already exists',
        request,
        409
      )
    }

    if (error.message.includes('Foreign key constraint')) {
      return createErrorResponse(
        error,
        'Invalid reference to related resource',
        request,
        400
      )
    }

    if (error.message.includes('invalid input syntax')) {
      return createErrorResponse(
        error,
        'Invalid data format',
        request,
        400
      )
    }

    if (
      error.message.includes('connection') || 
      error.message.includes('timeout') ||
      error.message.includes('DATABASE_URL') ||
      error.message.includes('Can\'t reach database server') ||
      error.message.includes('P1001') ||
      error.message.includes('P1000')
    ) {
      return createErrorResponse(
        error,
        'Database connection error. Please try again later.',
        request,
        503
      )
    }

    if (error.message.includes('Record to update not found') || error.message.includes('Record to delete does not exist')) {
      return createErrorResponse(
        error,
        'Resource not found',
        request,
        404
      )
    }
  }

  return createErrorResponse(
    error,
    `Failed to ${operation}`,
    request,
    500
  )
}

