// @ts-expect-error - Type definitions may not be available, but module is installed
import { createServerClient } from '@supabase/ssr'
// @ts-expect-error - Type definitions may not be available, but module is installed  
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

interface CookieItem {
  name: string
  value: string
}

interface CookieToSet {
  name: string
  value: string
  options?: any
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
    // @ts-ignore - process is available in Node.js runtime
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    // @ts-ignore - process is available in Node.js runtime
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase env vars not set, skipping auth check')
      if (pathname === '/') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      return NextResponse.next()
    }

    // PERFORMANCE: Fast path - check for Supabase auth cookies
    // Supabase SSR uses cookies like: sb-<project-ref>-auth-token
    // Check for any Supabase auth-related cookies
    const allCookies = request.cookies.getAll()
    const hasAuthCookie = allCookies.some((cookie: CookieItem) => 
      cookie.name.includes('sb-') && cookie.name.includes('auth-token')
    )
    
    // If no auth cookie and accessing protected route, redirect immediately
    if (!hasAuthCookie && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // If no auth cookie and on login page, allow access
    if (!hasAuthCookie && pathname === '/login') {
      return NextResponse.next()
    }

    // If no auth cookie and on root, redirect to login
    if (!hasAuthCookie && pathname === '/') {
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
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach((cookie) => {
              request.cookies.set(cookie.name, cookie.value)
            })
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach((cookie) => {
              response.cookies.set(cookie.name, cookie.value, cookie.options)
            })
          } catch (error) {
            console.error('Cookie setting error:', error)
          }
        },
      },
    })

    // PERFORMANCE: Only check auth if we have a cookie (avoid unnecessary Supabase calls)
    let user = null
    if (hasAuthCookie) {
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
