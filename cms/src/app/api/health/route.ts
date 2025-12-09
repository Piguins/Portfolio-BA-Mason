import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { corsHeaders } from '@/middleware/cors'
import { createErrorResponse } from '@/lib/api/handlers/error-handler'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Health check endpoint
 * Tests database connection and returns status
 */
export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const hasDatabaseUrl = !!process.env.DATABASE_URL
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Test database connection
    let dbStatus = 'unknown'
    let dbError: string | null = null
    let dbResponseTime: number | null = null

    if (hasDatabaseUrl) {
      try {
        const startTime = Date.now()
        // Use $queryRawUnsafe to avoid prepared statement issues with connection pooling
        await prisma.$queryRawUnsafe('SELECT 1 as test')
        const endTime = Date.now()
        dbResponseTime = endTime - startTime
        dbStatus = 'connected'
      } catch (error) {
        dbStatus = 'error'
        if (error instanceof Error) {
          dbError = error.message
          console.error('[Health Check] Database error:', {
            message: error.message,
            code: (error as any).code,
            meta: (error as any).meta,
          })
        } else {
          dbError = String(error)
        }
      }
    } else {
      dbStatus = 'not_configured'
      dbError = 'DATABASE_URL is not set'
    }

    const health = {
      status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV || 'unknown',
        hasDatabaseUrl,
        hasSupabaseUrl,
        hasSupabaseKey,
      },
      database: {
        status: dbStatus,
        responseTime: dbResponseTime,
        error: dbError,
      },
    }

    const statusCode = dbStatus === 'connected' ? 200 : 503

    return NextResponse.json(health, {
      status: statusCode,
      headers: corsHeaders(request),
    })
  } catch (error) {
    return createErrorResponse(
      error,
      'Health check failed',
      request,
      500
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request),
  })
}

