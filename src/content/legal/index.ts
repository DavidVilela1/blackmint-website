import type { Locale } from '@/i18n/config';
import { legalEn } from './en';
import { legalPtPt } from './pt-pt';
import type { LegalLocaleContent } from './types';

export * from './types';

const legal: Record<Locale, LegalLocaleContent> = { en: legalEn, 'pt-pt': legalPtPt };

export function getLegal(locale: Locale): LegalLocaleContent {
  return legal[locale];
}
