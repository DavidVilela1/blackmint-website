import { type Locale, localeMeta } from './config';

/** Replace {tokens} in a translated string. Unknown tokens are left untouched. */
export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/**
 * Deterministic date formatting (UTC) so server and client output match.
 * EN → "12 September 2026", PT-PT → "12 de setembro de 2026".
 */
export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeMeta[locale].intl, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
}
