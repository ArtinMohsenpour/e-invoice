import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Run next-intl middleware first
  const response = intlMiddleware(request);

  // If next-intl redirects (e.g. / -> /en), return immediately
  // and let the browser make the new request.
  if (response.headers.get('location')) {
    return response;
  }

  // 2. Setup Supabase client
  // Pass the 'response' object so Supabase can set cookies on it
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => 
             request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Check Auth
  const { 
    data: { user }, 
  } = await supabase.auth.getUser();

  // 4. Protect Routes
  const { pathname } = request.nextUrl;
  
  // Extract locale from pathname (e.g. /en/dashboard -> en)
  // We assume the first segment is the locale because intlMiddleware 
  // would have redirected if it wasn't (and we handled that above).
  // However, for API routes or public files ignored by matcher, we might be careful.
  // But our matcher excludes those.
  const locale = pathname.split('/')[1]; 
  const isValidLocale = routing.locales.includes(locale as any);
  const currentLocale = isValidLocale ? locale : routing.defaultLocale;

  // Paths to check
  // Note: pathname includes the locale, e.g. /en/dashboard
  const isDashboard = pathname.includes('/dashboard');
  const isAuthPage = pathname.includes('/auth/');

  if (isDashboard && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${currentLocale}/auth/login`;
    return NextResponse.redirect(url);
  }

  if (isAuthPage && !pathname.includes('reset-password') && user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${currentLocale}/dashboard`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\..*).*)',
  ],
};