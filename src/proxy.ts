import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ROUTES } from './constants/routes'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value
  const { pathname } = request.nextUrl

  // Define public and auth pages using ROUTES constants
  const authRoutes = [
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.REGISTER,
    ROUTES.AUTH.FORGOT_PASSWORD,
    ROUTES.AUTH.VERIFY_OTP,
    ROUTES.AUTH.RESET_PASSWORD,
  ]

  const isAuthPage = (authRoutes as string[]).includes(pathname)
  const isDashboardPage = pathname.startsWith(ROUTES.DASHBOARD)
  const isApiRoute = pathname.startsWith('/api/')

  // Bypass API routes
  if (isApiRoute) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to login if they try to access protected pages
  if (!token && isDashboardPage) {
    return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, request.url))
  }

  // Redirect authenticated users to dashboard if they try to access auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url))
  }

  // Handle root path redirect if token exists or rely on next.config.ts if not
  if (pathname === ROUTES.HOME && token) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
