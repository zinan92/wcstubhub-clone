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

    // Admin route protection: check if user has admin role
    if (pathname.startsWith('/admin')) {
      // Allow /admin/login without authentication
      if (pathname === '/admin/login') {
        // If already authenticated as admin, redirect to dashboard
        if (token && token.role === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }
        // Otherwise allow access to login page
        return NextResponse.next();
      }
      
      if (!token) {
        // Not authenticated - redirect to admin login
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
      
      // Check if user has admin role
      const isAdmin = token.role === 'admin';
      if (!isAdmin) {
        // Authenticated but not admin - redirect to home
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes accessible to guests
        const publicRoutes = [
          '/',
          '/football',
          '/basketball',
          '/concert',
          '/login',
          '/register',
          '/admin/login',
        ];

        // Allow public routes without authentication
        if (publicRoutes.includes(pathname)) {
          return true;
        }

        // Allow public detail pages for products and events
        if (pathname.startsWith('/products/') || pathname.startsWith('/events/')) {
          return true;
        }

        // For admin routes, handle in middleware function above
        // Return true here to let middleware handle the role check
        if (pathname.startsWith('/admin')) {
          return true;
        }

        // Protect /my/** routes - require authentication
        if (pathname.startsWith('/my')) {
          if (!token) {
            return false; // This triggers redirect to signIn page with callbackUrl
          }
          return true;
        }

        // For all other routes, require authentication
        // If not authenticated, redirect to login with callbackUrl
        if (!token) {
          return false; // This triggers redirect to signIn page
        }

        return true;
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
     * - /api/products/* (public product APIs)
     * - /api/events/* (public event APIs)
     * - /api/search (public search API)
     * - /_next/* (Next.js internals)
     * - /favicon.ico, /robots.txt (static files)
     * - /public/* (static files)
     */
    '/((?!api/auth|api/products|api/events|api/search|_next|favicon.ico|robots.txt|.*\\..*$).*)',
  ],
};
