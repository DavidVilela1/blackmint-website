import type { Locale } from '../config';
import { en, type Dictionary } from './en';
import { ptPt } from './pt-pt';

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = {
  en,
  'pt-pt': ptPt,
};

/** Server-side dictionary lookup. Pass only the slices client components need. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
