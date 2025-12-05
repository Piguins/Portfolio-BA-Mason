import { NextRequest, NextResponse } from 'next/server'

// CORS middleware for API routes
export function corsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  // Allow requests from portfolio frontend domains
  const allowedOrigins = [
    'https://mason.id.vn',
    'https://www.mason.id.vn',
    'http://localhost:5173',
    'http://localhost:3000',
  ]

  const isAllowedOrigin = origin && allowedOrigins.includes(origin)
  const corsOrigin = isAllowedOrigin ? origin : allowedOrigins[0]

  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}

// CORS handler for OPTIONS requests
export function corsOptionsHandler(request: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders(request) })
}

