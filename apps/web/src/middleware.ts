import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register', '/auth/reset-password', '/auth/forgot-password']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If user has token and tries to access auth pages, redirect to dashboard
  if (refreshToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user has no token and tries to access protected pages, redirect to login
  if (!refreshToken && !isPublicRoute && pathname !== '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Allow the request to continue
  return NextResponse.next()
}

export const config = {
  // Match all routes except static files and API routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
}
