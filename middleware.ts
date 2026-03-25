import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // If user is authenticated and trying to access login or register
    // Redirect them to home
    if (token && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to login and register pages without authentication
        if (pathname === '/login' || pathname === '/register') {
          return true;
        }

        // For all other routes, require authentication
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api/auth/* (NextAuth API routes)
     * - /api/auth/register (registration endpoint)
     * - /_next/* (Next.js internals)
     * - /favicon.ico, /robots.txt (static files)
     * - /public/* (static files)
     */
    '/((?!api/auth|_next|favicon.ico|robots.txt|.*\\..*$).*)',
  ],
};
