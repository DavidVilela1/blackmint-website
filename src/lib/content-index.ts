import { indexPlaceholderContent } from '@/lib/env';
import type { Game } from '@/content/games';
import type { Article } from '@/content/journal';

/** Placeholder / sample content is kept out of search indexes until replaced. */
export const isGameIndexable = (g: Game) => !g.isPlaceholder || indexPlaceholderContent;
export const isArticleIndexable = (a: Article) => !a.isSample || indexPlaceholderContent;
