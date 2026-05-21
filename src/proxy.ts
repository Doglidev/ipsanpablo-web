import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Rutas que requieren rol ADMIN o EDITOR (no VIEWER)
const EDITOR_ROUTES = [
  '/admin/secciones',
  '/admin/noticias',
  '/admin/galeria',
  '/admin/configuracion',
]

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const role = req.nextauth.token?.role as string | undefined

    // Solo ADMIN puede acceder a usuarios
    if (pathname.startsWith('/admin/usuarios') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    // VIEWER solo puede ver el dashboard
    if (role === 'VIEWER' && EDITOR_ROUTES.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/admin/login',
    },
  }
)

export const config = {
  matcher: ['/admin/:path*'],
}
