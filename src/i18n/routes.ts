import { type Locale, locales, isLocale } from './config';

/**
 * Route keys shared by both locales. Paths are identical across locales
 * (e.g. /en/games ↔ /pt-pt/games) so equivalent pages are trivially mapped.
 */
export const staticRoutes = {
  home: '',
  games: '/games',
  about: '/about',
  journal: '/journal',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
} as const;

export type StaticRouteKey = keyof typeof staticRoutes;

/** Build a locale-prefixed path: href('pt-pt', '/games') → '/pt-pt/games' */
export function href(locale: Locale, path: string = ''): string {
  const clean = path === '/' ? '' : path;
  return `/${locale}${clean}`;
}

export function routeHref(locale: Locale, key: StaticRouteKey): string {
  return href(locale, staticRoutes[key]);
}

export const gameHref = (locale: Locale, slug: string) => href(locale, `/games/${slug}`);
export const articleHref = (locale: Locale, slug: string) => href(locale, `/journal/${slug}`);

/** Strip the locale prefix from a pathname: '/pt-pt/games/x' → '/games/x' */
export function stripLocale(pathname: string): { locale: Locale | null; path: string } {
  const segments = pathname.split('/');
  const first = segments[1];
  if (isLocale(first)) {
    const rest = '/' + segments.slice(2).join('/');
    return { locale: first, path: rest === '/' ? '' : rest.replace(/\/$/, '') };
  }
  return { locale: null, path: pathname };
}

/**
 * Equivalent path in another locale. Because slugs are shared, the equivalent
 * page always exists when the source page exists. `knownPaths` lets callers
 * fall back to the localized home when a page has no translation.
 */
export function switchLocalePath(
  pathname: string,
  target: Locale,
  hasTranslation: (path: string, locale: Locale) => boolean = () => true,
): string {
  const { path } = stripLocale(pathname);
  return hasTranslation(path, target) ? href(target, path) : href(target);
}

export function alternatePaths(path: string): Record<Locale, string> {
  return Object.fromEntries(locales.map((l) => [l, href(l, path)])) as Record<Locale, string>;
}
