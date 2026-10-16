import type { BrowserContext } from '@playwright/test';

export const pages = [
  '',
  '/games',
  '/games/hollow-moon',
  '/games/paper-kingdom',
  '/about',
  '/journal',
  '/journal/designing-with-grain',
  '/contact',
  '/privacy',
  '/terms',
  '/cookies',
];
export const locales = ['en', 'pt-pt'] as const;

/** Pre-set a "reject optional" decision so the banner does not cover the page. */
export async function decideConsent(context: BrowserContext, baseURL: string, flags = 'p0a0m0') {
  await context.addCookies([
    {
      name: 'bm_consent',
      value: encodeURIComponent(`1|2026-10-01T00:00:00.000Z|${flags}`),
      url: baseURL,
    },
  ]);
}
