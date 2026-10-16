import type { Metadata } from 'next';
import { type Locale, locales, localeMeta, defaultLocale } from '@/i18n/config';
import { href } from '@/i18n/routes';
import { getDictionary } from '@/i18n/dictionaries';
import { absoluteUrl, isIndexable, siteUrl } from '@/lib/env';

export interface PageSeo {
  locale: Locale;
  /** Locale-independent path, e.g. '' (home), '/games', '/games/hollow-moon'. */
  path: string;
  /** Page title (without the site suffix). Omit on the home page. */
  title?: string;
  description: string;
  image?: { src: string; width: number; height: number; alt: string };
  /** Force noindex (placeholders, utility pages…). */
  noindex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

/** hreflang map for a path, including x-default → default-locale URL. */
export function languageAlternates(path: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of locales) map[localeMeta[l].hreflang] = absoluteUrl(href(l, path));
  map['x-default'] = absoluteUrl(href(defaultLocale, path));
  return map;
}

/** Build complete, localized metadata for a page. */
export function buildMetadata(seo: PageSeo): Metadata {
  const dict = getDictionary(seo.locale);
  const url = absoluteUrl(href(seo.locale, seo.path));
  const image = seo.image ?? {
    src: `/og/og-default-${seo.locale}.jpg`,
    width: 1200,
    height: 630,
    alt: dict.meta.ogImageAlt,
  };
  const index = isIndexable && !seo.noindex;
  const fullTitle = seo.title
    ? dict.meta.titleTemplate.replace('%s', seo.title)
    : dict.meta.defaultTitle;

  return {
    metadataBase: new URL(siteUrl),
    title: seo.title ? seo.title : { absolute: dict.meta.defaultTitle },
    description: seo.description,
    alternates: {
      canonical: url,
      languages: languageAlternates(seo.path),
    },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
        }
      : { index: false, follow: true },
    openGraph: {
      type: seo.type ?? 'website',
      url,
      siteName: dict.meta.siteName,
      title: fullTitle,
      description: seo.description,
      locale: localeMeta[seo.locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== seo.locale).map((l) => localeMeta[l].ogLocale),
      images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }],
      ...(seo.type === 'article'
        ? { publishedTime: seo.publishedTime, modifiedTime: seo.modifiedTime ?? seo.publishedTime }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: seo.description,
      images: [{ url: image.src, alt: image.alt }],
    },
  };
}
