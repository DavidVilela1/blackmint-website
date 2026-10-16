import { staticRoutes } from '@/i18n/routes';
import { games } from '@/content/games';
import { articles } from '@/content/journal';
import { isArticleIndexable, isGameIndexable } from '@/lib/content-index';

export interface IndexableRoute {
  path: string;
  lastModified?: string;
  priority: number;
  changeFrequency: 'weekly' | 'monthly' | 'yearly';
}

/**
 * Canonical, indexable, locale-independent paths. Single source for the
 * sitemap and llms.txt. Placeholder/sample content is excluded until it is
 * replaced with real content (or INDEX_PLACEHOLDER_CONTENT=true).
 */
export function indexableRoutes(): IndexableRoute[] {
  const statics: IndexableRoute[] = (Object.entries(staticRoutes) as [string, string][]).map(
    ([key, path]) => ({
      path,
      priority: key === 'home' ? 1 : ['privacy', 'terms', 'cookies'].includes(key) ? 0.3 : 0.8,
      changeFrequency: ['privacy', 'terms', 'cookies'].includes(key) ? 'yearly' : 'monthly',
    }),
  );
  const gameRoutes: IndexableRoute[] = games.filter(isGameIndexable).map((g) => ({
    path: `/games/${g.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly',
  }));
  const articleRoutes: IndexableRoute[] = articles.filter(isArticleIndexable).map((a) => ({
    path: `/journal/${a.slug}`,
    lastModified: a.updatedAt ?? a.publishedAt,
    priority: 0.6,
    changeFrequency: 'yearly',
  }));
  return [...statics, ...gameRoutes, ...articleRoutes];
}
