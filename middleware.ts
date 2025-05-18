import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// PUBLIC_PATHS'den "/" kaldırıldı
const PUBLIC_PATHS = ['/login', '/producer-login', '/customer-login']

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || ''
  const { pathname } = request.nextUrl
  // Public sayfalar için KESİN EŞLEŞME kontrolü
  if (PUBLIC_PATHS.some(publicPath => pathname === publicPath)) {
    return NextResponse.next()
  }

  // Ana sayfa (/) için özel kontrol
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Korumalı alanlar
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    await jwtVerify(token, new TextEncoder().encode("supersecretkey"))
    return NextResponse.next()
  } catch (err) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/', '/customer/:path*', '/seller-panel/:path*', '/dashboard/:path*']
}