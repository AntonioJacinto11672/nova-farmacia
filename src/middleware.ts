import { NextRequest, NextResponse } from 'next/server'

// Rotas que requerem autenticação
const PROTECTED_ROUTES = [
  '/admin',
  '/dashboard',
  '/orders',
  '/invoice'
]

// Rotas de autenticação (login/register)
const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register'
]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get('auth_token')?.value
  const userData = request.cookies.get('user_data')?.value

  // Se tenta acessar rota protegida sem token
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!token || !userData) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Validar se está tentando acessar /admin sem permissão
    if (pathname.startsWith('/admin')) {
      try {
        const user = JSON.parse(userData)
        if (user.role !== 'Administrador' && user.role !== 'Admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      } catch (error) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }
  }

  // Se já autenticado e tenta acessar login/register
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        const redirectTo = user.role === 'Administrador' ? '/admin' : '/dashboard'
        return NextResponse.redirect(new URL(redirectTo, request.url))
      } catch (error) {
        // Continuar normalmente se não conseguir fazer parse
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/orders/:path*',
    '/invoice/:path*',
    '/auth/login',
    '/auth/register'
  ]
}
