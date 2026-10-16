/**
 * Typed access to public environment configuration.
 * Server-only secrets live in `src/lib/contact/delivery.ts` and are never
 * imported by client components.
 */
function trimSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

export const siteUrl: string = trimSlash(
  process.env.NEXT_PUBLIC_SITE_URL && /^https?:\/\//.test(process.env.NEXT_PUBLIC_SITE_URL)
    ? process.env.NEXT_PUBLIC_SITE_URL
    : 'http://localhost:3000',
);

export const siteEnv: string = process.env.NEXT_PUBLIC_SITE_ENV ?? 'development';

/** Only a production deployment may be indexed by search engines. */
export const isIndexable: boolean = siteEnv === 'production';

/** Whether placeholder games / sample journal entries may be indexed. */
export const indexPlaceholderContent: boolean = process.env.INDEX_PLACEHOLDER_CONTENT === 'true';

const rawEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? '';
export const publicContactEmail: string | null = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)
  ? rawEmail
  : null;

export function absoluteUrl(path: string = '/'): string {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
