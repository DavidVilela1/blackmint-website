import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale, LOCALE_COOKIE, negotiateLocale } from '@/i18n/config';

/**
 * Locale routing (Next.js 16 "proxy", formerly middleware).
 *
 * Every page lives under /en or /pt-pt. A request without a locale prefix
 * (including the root "/") is redirected to:
 *   1. the language the visitor explicitly chose before (bm_locale cookie,
 *      only ever set with Preferences consent), otherwise
 *   2. the best match from the browser's Accept-Language header, otherwise
 *   3. the default locale (English).
 * No IP geolocation is used. Redirects are temporary (307) so crawlers keep
 * indexing the canonical locale URLs.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split('/')[1];

  // Locale-prefixed: render normally (unknown paths hit the localized 404 with status 404).
  if (isLocale(first)) return NextResponse.next();

  // Upper/mixed-case or legacy prefixes, e.g. /PT-PT/games or /pt/games
  const lower = first?.toLowerCase();
  let locale = isLocale(lower) ? lower : null;
  let rest = pathname;
  if (locale) rest = pathname.slice(first!.length + 1);
  else if (lower === 'pt' || lower === 'pt-br') {
    locale = 'pt-pt';
    rest = pathname.slice(first!.length + 1);
  }

  if (!locale) {
    const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
    locale = isLocale(cookie)
      ? cookie
      : (negotiateLocale(request.headers.get('accept-language')) ?? defaultLocale);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${rest === '/' ? '' : rest}`;
  url.search = search;
  const res = NextResponse.redirect(url, 307);
  res.headers.set('Vary', 'Accept-Language, Cookie');
  return res;
}

export const config = {
  // Skip Next internals, API routes and any file with an extension
  // (robots.txt, sitemap.xml, llms.txt, images, fonts…).
  matcher: ['/((?!_next/|api/|.*\\.[\\w]+$).*)'],
};
