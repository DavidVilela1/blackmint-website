import type { Locale } from './config';
import { en } from './dictionaries/en';
import { ptPt } from './dictionaries/pt-pt';

/**
 * The few strings needed by components that cannot receive props from a
 * Server Component (error boundaries). Only these small slices are bundled.
 */
export const errorStrings: Record<Locale, (typeof en)['error']> = {
  en: en.error,
  'pt-pt': ptPt.error,
};
