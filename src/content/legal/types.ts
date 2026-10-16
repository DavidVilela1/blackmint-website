/**
 * Legal document model.
 *
 * Text may contain tokens that are resolved at render time:
 *  - {{entityName}}, {{registeredAddress}}, {{companyNumber}}, {{vatNumber}},
 *    {{privacyEmail}}, {{hostingProvider}}, {{emailProvider}},
 *    {{contactRetention}}, {{logRetention}}, {{governingLaw}}
 *      → value from `studio.legal` in src/content/site.ts, or a highlighted
 *        [placeholder] when the value has not been confirmed yet.
 *  - {{siteUrl}} → canonical site origin.
 *  - {{link:privacy}}, {{link:terms}}, {{link:cookies}}, {{link:contact}}
 *      → localized internal links.
 *  - {{consentDays}}, {{localeDays}} → actual cookie lifetimes from code.
 */
export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; caption: string; head: string[]; rows: string[][] };

export interface LegalSection {
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  title: string;
  intro: string;
  sections: LegalSection[];
}

export type LegalDocKey = 'privacy' | 'terms' | 'cookies';

export type PlaceholderKey =
  | 'entityName'
  | 'registeredAddress'
  | 'companyNumber'
  | 'vatNumber'
  | 'privacyEmail'
  | 'hostingProvider'
  | 'emailProvider'
  | 'contactRetention'
  | 'logRetention'
  | 'governingLaw';

export interface LegalLocaleContent {
  documents: Record<LegalDocKey, LegalDocument>;
  placeholders: Record<PlaceholderKey, string>;
  links: Record<'privacy' | 'terms' | 'cookies' | 'contact', string>;
}
