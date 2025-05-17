// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = ['/', '/login', '/producer-login', '/customer-login']

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || ''
  const { pathname } = request.nextUrl

  // Public sayfalara erişim izni ver
  if (PUBLIC_PATHS.some(publicPath => pathname.startsWith(publicPath))) {
    return NextResponse.next()
  }

  // /customer, /producer, /dashboard gibi korumalı alanlara erişimde token kontrolü yap
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/customer/:path*', '/seller-panel/:path*', '/dashboard/:path*']
}
