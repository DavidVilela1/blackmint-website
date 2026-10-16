/**
 * Consent model shared by the banner, the preferences dialog, the script gate
 * and the language-preference cookie.
 */
export const CONSENT_COOKIE = 'bm_consent';

/** Bump when the cookie policy changes materially → everyone is asked again. */
export const CONSENT_VERSION = 1;

/** Lifetime of the consent record. After this we ask again. */
export const CONSENT_MAX_AGE_DAYS = 180;

/** Lifetime of the optional language-preference cookie. */
export const LOCALE_MAX_AGE_DAYS = 365;

export const optionalCategories = ['preferences', 'analytics', 'marketing'] as const;
export type OptionalCategory = (typeof optionalCategories)[number];
export type ConsentCategory = 'necessary' | OptionalCategory;

export interface ConsentState {
  v: number;
  /** ISO timestamp of the decision. */
  ts: string;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

/** Cookies that belong to each optional category and must be removed on withdrawal. */
export const categoryCookies: Record<OptionalCategory, (string | RegExp)[]> = {
  preferences: ['bm_locale'],
  // Add analytics/marketing cookie names here when such a tool is introduced,
  // e.g. /^_ga/, '_gid', '_fbp'.
  analytics: [],
  marketing: [],
};
