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
    // PERFORMANCE: Skip auth check for static assets and API routes
    const pathname = request.nextUrl.pathname
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/i)
    ) {
      return NextResponse.next()
    }

    // Check if Supabase env vars are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase env vars not set, skipping auth check')
      if (pathname === '/') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      return NextResponse.next()
    }

    // PERFORMANCE: Fast path - check for auth cookie first before Supabase call
    const authToken = request.cookies.get('sb-access-token') || 
                     request.cookies.get('sb-auth-token')
    
    // If no auth token and accessing protected route, redirect immediately
    if (!authToken && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // If no auth token and on login page, allow access
    if (!authToken && pathname === '/login') {
      return NextResponse.next()
    }

    // If no auth token and on root, redirect to login
    if (!authToken && pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url))
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
            console.error('Cookie setting error:', error)
          }
        },
      },
    })

    // PERFORMANCE: Only check auth if we have a token (avoid unnecessary Supabase calls)
    let user = null
    if (authToken) {
      try {
        const {
          data: { user: authUser },
          error,
        } = await supabase.auth.getUser()

        if (!error && authUser) {
          user = authUser
        }
      } catch (error) {
        console.error('Auth check error:', error)
        user = null
      }
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

