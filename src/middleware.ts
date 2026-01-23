import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const handleI18nRouting = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Execute next-intl middleware first to handle locale resolution and redirects
  const response = handleI18nRouting(request);

  // If next-intl redirects (e.g. root to /en, or correcting locale), allow it to pass
  if (response.headers.get('Location')) {
    return response;
  }

  // 2. Parse locale from path to ensure we redirect to correct language prefix
  // "en", "de", or default if missing (though next-intl usually enforces it)
  const segments = pathname.split('/');
  const firstSegment = segments[1]; // segments[0] is empty string
  const isLocale = routing.locales.includes(firstSegment as any);
  const locale = isLocale ? firstSegment : routing.defaultLocale;
  
  // Clean path without locale for route matching
  const pathWithoutLocale = isLocale 
    ? '/' + segments.slice(2).join('/')
    : pathname;

  // 3. Auth Protection Logic
  if (token) {
    // If logged in, prevent access to auth pages (login, signup, forgot-password, reset-password)
    // Redirect to dashboard
    if (['/login', '/signup', '/forgot-password', '/reset-password'].includes(pathWithoutLocale)) {
       return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
  } else {
    // If NOT logged in, prevent access to protected pages
    // Redirect to login
    if (pathWithoutLocale.startsWith('/dashboard') || 
        pathWithoutLocale.startsWith('/account') || 
        pathWithoutLocale.startsWith('/invoices')) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return response;
}

export const config = {
  // Match all pathnames except for:
  // - /api, /admin, /_next, /_vercel
  // - static files (favicons, etc.)
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)']
};