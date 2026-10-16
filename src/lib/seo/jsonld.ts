import { type Locale, localeMeta, locales } from '@/i18n/config';
import { href, gameHref, articleHref } from '@/i18n/routes';
import { getDictionary } from '@/i18n/dictionaries';
import { absoluteUrl, publicContactEmail } from '@/lib/env';
import { studio } from '@/content/site';
import type { Game } from '@/content/games';
import type { Article } from '@/content/journal';

/**
 * JSON-LD generators. Only fields backed by real data (or explicitly labelled
 * placeholder content) are emitted — no ratings, offers, release dates or
 * invented claims.
 */
type JsonLd = Record<string, unknown>;

export const ORG_ID = () => absoluteUrl('/#organization');
export const SITE_ID = () => absoluteUrl('/#website');

export function organizationLd(): JsonLd {
  const sameAs = studio.socials.map((s) => s.href);
  return {
    '@type': 'Organization',
    '@id': ORG_ID(),
    name: studio.name,
    alternateName: studio.alternateName,
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icons/icon-512.png'),
      width: 512,
      height: 512,
    },
    slogan: studio.slogans.primary,
    ...(publicContactEmail ? { email: publicContactEmail } : {}),
    ...(studio.facts.founded ? { foundingDate: studio.facts.founded } : {}),
    ...(studio.legal.entityName ? { legalName: studio.legal.entityName } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteLd(locale: Locale): JsonLd {
  const dict = getDictionary(locale);
  return {
    '@type': 'WebSite',
    '@id': SITE_ID(),
    name: studio.name,
    url: absoluteUrl('/'),
    description: dict.meta.defaultDescription,
    inLanguage: locales.map((l) => localeMeta[l].htmlLang),
    publisher: { '@id': ORG_ID() },
  };
}

export function webPageLd(locale: Locale, path: string, name: string, description: string): JsonLd {
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(href(locale, path))}#webpage`,
    url: absoluteUrl(href(locale, path)),
    name,
    description,
    inLanguage: localeMeta[locale].htmlLang,
    isPartOf: { '@id': SITE_ID() },
    about: { '@id': ORG_ID() },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbLd(locale: Locale, crumbs: Crumb[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(href(locale, c.path)),
    })),
  };
}

export function videoGameLd(game: Game, locale: Locale): JsonLd {
  return {
    '@type': 'VideoGame',
    '@id': `${absoluteUrl(gameHref(locale, game.slug))}#game`,
    name: game.title,
    url: absoluteUrl(gameHref(locale, game.slug)),
    description: game.summary[locale],
    image: absoluteUrl(game.cover.src),
    inLanguage: localeMeta[locale].htmlLang,
    author: { '@id': ORG_ID() },
    publisher: { '@id': ORG_ID() },
    ...(game.genre && !game.isPlaceholder ? { genre: game.genre[locale] } : {}),
    ...(game.platforms?.length ? { gamePlatform: game.platforms } : {}),
  };
}

export function articleLd(article: Article, locale: Locale): JsonLd {
  return {
    '@type': 'Article',
    '@id': `${absoluteUrl(articleHref(locale, article.slug))}#article`,
    headline: article.title[locale],
    description: article.excerpt[locale],
    image: [absoluteUrl(article.cover.src)],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    inLanguage: localeMeta[locale].htmlLang,
    mainEntityOfPage: absoluteUrl(articleHref(locale, article.slug)),
    author: { '@id': ORG_ID() },
    publisher: { '@id': ORG_ID() },
  };
}

/** Wrap nodes in a single @graph so each page emits exactly one JSON-LD block. */
export function graph(...nodes: JsonLd[]): JsonLd {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** Safe serialisation for <script type="application/ld+json">. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function dictName(locale: Locale) {
  return getDictionary(locale).meta.siteName;
}
