import type { OptionalCategory } from './config';

/**
 * Third-party integrations gated by consent.
 *
 * EMPTY BY DEFAULT — no analytics, advertising or social scripts are loaded.
 * To add one (after updating the cookie & privacy policies and the CSP in
 * next.config.ts), append an entry, e.g.:
 *
 *   { id: 'plausible', category: 'analytics', src: 'https://plausible.io/js/script.js',
 *     attributes: { 'data-domain': 'example.com' } }
 *
 * Scripts are injected only after the visitor grants that category and are
 * never loaded merely because an entry exists.
 */
export interface Integration {
  id: string;
  category: OptionalCategory;
  src: string;
  attributes?: Record<string, string>;
}

export const integrations: Integration[] = [];
