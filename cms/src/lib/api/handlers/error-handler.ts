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
  // Log full error details for debugging
  console.error(`[Database Error] ${operation}:`, error)
  
  // Check if DATABASE_URL is missing
  if (!process.env.DATABASE_URL) {
    console.error('[Database Error] DATABASE_URL is not set in environment variables')
    return createErrorResponse(
      new Error('DATABASE_URL environment variable is not configured'),
      'Database configuration error. Please contact administrator.',
      request,
      503
    )
  }

  if (error instanceof Error) {
    const errorMsg = error.message.toLowerCase()
    
    // Prisma/PostgreSQL specific errors
    if (errorMsg.includes('unique constraint') || errorMsg.includes('duplicate key')) {
      return createErrorResponse(
        error,
        'Resource already exists',
        request,
        409
      )
    }

    if (errorMsg.includes('foreign key constraint')) {
      return createErrorResponse(
        error,
        'Invalid reference to related resource',
        request,
        400
      )
    }

    if (errorMsg.includes('invalid input syntax')) {
      return createErrorResponse(
        error,
        'Invalid data format',
        request,
        400
      )
    }

    // Database connection errors
    if (
      errorMsg.includes('connection') || 
      errorMsg.includes('timeout') ||
      errorMsg.includes('database_url') ||
      errorMsg.includes("can't reach database server") ||
      errorMsg.includes('p1001') ||
      errorMsg.includes('p1000') ||
      errorMsg.includes('p1017') ||
      errorMsg.includes('server closed the connection') ||
      errorMsg.includes('connection refused') ||
      errorMsg.includes('econnrefused') ||
      errorMsg.includes('enotfound')
    ) {
      // Log connection error details (not exposed to client)
      console.error('[Database Error] Connection failed:', {
        message: error.message,
        code: (error as any).code,
        meta: (error as any).meta,
      })
      
      return createErrorResponse(
        error,
        'Database connection error. Please try again later.',
        request,
        503
      )
    }

    if (errorMsg.includes('record to update not found') || errorMsg.includes('record to delete does not exist') || errorMsg.includes('p2025')) {
      return createErrorResponse(
        error,
        'Resource not found',
        request,
        404
      )
    }
  }

  // Log unknown errors
  console.error('[Database Error] Unknown error type:', {
    error,
    operation,
    type: typeof error,
  })

  return createErrorResponse(
    error,
    `Failed to ${operation}`,
    request,
    500
  )
}

