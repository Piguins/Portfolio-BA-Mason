import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

export async function middleware(request: NextRequest) {
  try {
    // Check if Supabase env vars are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      // If env vars not set, just allow access (for development)
      // In production, these should always be set
      console.warn('Supabase env vars not set, skipping auth check')
      
      // Still handle redirects
      if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      return NextResponse.next()
    }

    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            )
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          } catch (error) {
            // Ignore cookie setting errors in middleware
            console.error('Cookie setting error:', error)
          }
        },
      },
    })

    let user = null
    try {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser()

      if (!error && authUser) {
        user = authUser
      }
    } catch (error) {
      // If auth check fails, treat as not authenticated
      console.error('Auth check error:', error)
      user = null
    }

    // Protect /dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect authenticated users away from /login
    if (request.nextUrl.pathname === '/login' && user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect root to login or dashboard based on auth status
    if (request.nextUrl.pathname === '/') {
      if (user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    return response
  } catch (error) {
    // If middleware fails completely, log and allow request through
    console.error('Middleware error:', error)
    
    // Fallback: redirect root to login
    if (request.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    return NextResponse.next()
  }
}

