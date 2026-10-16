/**
 * Central locale configuration. Add a locale here, add its dictionary and
 * localized content, and every route, sitemap entry and hreflang tag follows.
 */
export const locales = ['en', 'pt-pt'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Cookie that remembers an explicit language choice (Preferences consent only). */
export const LOCALE_COOKIE = 'bm_locale';

export const localeMeta: Record<
  Locale,
  {
    /** value for <html lang> */
    htmlLang: string;
    /** hreflang value */
    hreflang: string;
    /** Open Graph locale */
    ogLocale: string;
    /** Intl formatting locale */
    intl: string;
    /** Name of the language in that language */
    label: string;
    /** Short switcher label */
    short: string;
  }
> = {
  en: {
    htmlLang: 'en',
    hreflang: 'en',
    ogLocale: 'en_GB',
    intl: 'en-GB',
    label: 'English',
    short: 'EN',
  },
  'pt-pt': {
    htmlLang: 'pt-PT',
    hreflang: 'pt-PT',
    ogLocale: 'pt_PT',
    intl: 'pt-PT',
    label: 'Português (Portugal)',
    short: 'PT',
  },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/**
 * Resolve the best locale from an Accept-Language header. Any Portuguese
 * variant maps to European Portuguese (the only Portuguese edition we publish).
 * No IP geolocation is used.
 */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale;
  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag = '', ...params] = part.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      const quality = q ? Number.parseFloat(q.trim().slice(2)) : 1;
      return { tag: tag.toLowerCase(), quality: Number.isFinite(quality) ? quality : 0 };
    })
    .filter((x) => x.tag && x.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    if (tag === 'pt' || tag.startsWith('pt-')) return 'pt-pt';
    if (tag === 'en' || tag.startsWith('en-')) return 'en';
  }
  return defaultLocale;
}
