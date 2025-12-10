import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/middleware/cors'
import { createErrorResponse } from './error-handler'

/**
 * Safely parse JSON from request body
 */
export async function parseRequestBody<T = unknown>(
  request: NextRequest
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const contentType = request.headers.get('content-type')
    
    if (!contentType || !contentType.includes('application/json')) {
      return {
        data: null,
        error: createErrorResponse(
          new Error('Content-Type must be application/json'),
          'Invalid content type',
          request,
          400
        ),
      }
    }

    const text = await request.text()
    
    if (!text || text.trim() === '') {
      return {
        data: null,
        error: createErrorResponse(
          new Error('Request body is empty'),
          'Request body is required',
          request,
          400
        ),
      }
    }

    const data = JSON.parse(text) as T
    
    return { data, error: null }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        data: null,
        error: createErrorResponse(
          error,
          'Invalid JSON format',
          request,
          400
        ),
      }
    }

    return {
      data: null,
      error: createErrorResponse(
        error,
        'Failed to parse request body',
        request,
        400
      ),
    }
  }
}

/**
 * Create success response with CORS headers and optional caching
 */
export function createSuccessResponse<T>(
  data: T,
  request: NextRequest,
  statusCode: number = 200,
  options?: {
    revalidate?: number // Cache revalidation time in seconds
    cacheControl?: string // Custom Cache-Control header
  }
): NextResponse {
  const headers = new Headers(corsHeaders(request))
  
  // Add caching headers if specified
  if (options?.revalidate) {
    headers.set('Cache-Control', `public, s-maxage=${options.revalidate}, stale-while-revalidate=${options.revalidate * 2}`)
  } else if (options?.cacheControl) {
    headers.set('Cache-Control', options.cacheControl)
  }
  
  return NextResponse.json(data, {
    status: statusCode,
    headers,
  })
}

