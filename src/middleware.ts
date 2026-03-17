import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const role = req.nextauth.token?.role as string | undefined

    // Only ADMIN can access /admin/usuarios
    if (pathname.startsWith('/admin/usuarios') && role !== 'ADMIN') {
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
