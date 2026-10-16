import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { href } from '@/i18n/routes';
import { absoluteUrl } from '@/lib/env';
import { languageAlternates } from '@/lib/seo/metadata';
import { indexableRoutes } from '@/lib/seo/routes';

/**
 * /sitemap.xml — every canonical, indexable URL in every locale, each with
 * reciprocal hreflang alternates (incl. x-default). lastModified is only set
 * where a defensible content date exists (journal entries).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes().flatMap((route) =>
    locales.map((locale) => ({
      url: absoluteUrl(href(locale, route.path)),
      ...(route.lastModified ? { lastModified: route.lastModified } : {}),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages: languageAlternates(route.path) },
    })),
  );
}
