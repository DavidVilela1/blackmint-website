/**
 * Studio facts and channels — the single place to fill in confirmed details.
 *
 * Everything here is `null` / empty on purpose: nothing has been confirmed yet,
 * and the site must never invent facts, profiles or addresses. As soon as a
 * value is set, it appears automatically in the UI, footer, JSON-LD, legal
 * documents and llms.txt.
 */
export type SocialPlatform =
  | 'bluesky'
  | 'discord'
  | 'instagram'
  | 'mastodon'
  | 'steam'
  | 'tiktok'
  | 'twitch'
  | 'x'
  | 'youtube'
  | 'itchio';

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string; // must be a verified, official URL
}

export interface StudioFacts {
  /** Year the studio was founded, e.g. "2024". */
  founded: string | null;
  /** City / country, e.g. "Lisbon, Portugal". */
  basedIn: string | null;
  /** Free text, e.g. "4 people". */
  teamSize: string | null;
}

/** Legal identity used by the privacy policy, terms and cookie policy. */
export interface LegalDetails {
  /** Registered legal name of the entity operating the website (data controller). */
  entityName: string | null;
  /** Registered address. */
  registeredAddress: string | null;
  /** Company registration number (e.g. NIPC in Portugal). */
  companyNumber: string | null;
  /** VAT number. */
  vatNumber: string | null;
  /** Mailbox for privacy / data-protection requests. */
  privacyEmail: string | null;
  /** Hosting provider (processor) and where data is hosted. */
  hostingProvider: string | null;
  /** Email delivery provider used by the contact form (processor). */
  emailProvider: string | null;
  /** How long contact-form messages are kept. */
  contactRetention: string | null;
  /** How long server/access logs are kept by the hosting provider. */
  logRetention: string | null;
  /** Governing law and competent courts for the website terms. */
  governingLaw: string | null;
  /** Date the legal documents were last reviewed (ISO yyyy-mm-dd). */
  lastReviewed: string | null;
}

export const studio = {
  name: 'BlackMint Interactive',
  alternateName: 'BlackMint',
  slogans: {
    primary: 'Small team. Big worlds.',
    secondary: 'Indie games for curious people.',
  },
  facts: {
    founded: null,
    basedIn: null,
    teamSize: null,
  } satisfies StudioFacts as StudioFacts,
  /** Add only verified official channels. Empty list = no social links rendered. */
  socials: [] as SocialLink[],
  legal: {
    entityName: null,
    registeredAddress: null,
    companyNumber: null,
    vatNumber: null,
    privacyEmail: null,
    hostingProvider: null,
    emailProvider: null,
    contactRetention: null,
    logRetention: null,
    governingLaw: null,
    lastReviewed: null,
  } satisfies LegalDetails as LegalDetails,
} as const;
