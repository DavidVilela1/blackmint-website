/**
 * Contact form validation shared by the client (instant feedback) and the
 * server (authoritative). Returns error CODES; the UI maps codes to localized
 * messages, so the server never needs to know the visitor's language.
 */
export const contactTopics = ['general', 'collaboration', 'press', 'playtesting', 'other'] as const;
export type ContactTopic = (typeof contactTopics)[number];

export const LIMITS = {
  nameMax: 120,
  emailMax: 254,
  messageMin: 20,
  messageMax: 5000,
  /** Submissions faster than this after render are treated as bots. */
  minFillMs: 2500,
} as const;

export interface ContactInput {
  name: string;
  email: string;
  topic: string;
  message: string;
  acknowledgement: boolean;
}

export type ContactErrorCode =
  | 'nameRequired'
  | 'nameTooLong'
  | 'emailRequired'
  | 'emailInvalid'
  | 'topicInvalid'
  | 'messageRequired'
  | 'messageTooShort'
  | 'messageTooLong'
  | 'acknowledgementRequired';

export type ContactField = 'name' | 'email' | 'topic' | 'message' | 'acknowledgement';
export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>;

// Pragmatic email check: one @, no spaces, a dot in the domain, sane length.
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function normalizeContact(raw: Partial<Record<keyof ContactInput, unknown>>): ContactInput {
  const str = (v: unknown) => (typeof v === 'string' ? v : '');
  return {
    name: str(raw.name).trim().replace(/\s+/g, ' '),
    email: str(raw.email).trim().toLowerCase(),
    topic: str(raw.topic).trim(),
    message: str(raw.message).replace(/\r\n/g, '\n').trim(),
    acknowledgement:
      raw.acknowledgement === true ||
      raw.acknowledgement === 'on' ||
      raw.acknowledgement === 'true',
  };
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  if (!input.name) errors.name = 'nameRequired';
  else if (input.name.length > LIMITS.nameMax) errors.name = 'nameTooLong';

  if (!input.email) errors.email = 'emailRequired';
  else if (input.email.length > LIMITS.emailMax || !EMAIL_RE.test(input.email))
    errors.email = 'emailInvalid';

  if (!(contactTopics as readonly string[]).includes(input.topic)) errors.topic = 'topicInvalid';

  if (!input.message) errors.message = 'messageRequired';
  else if (input.message.length < LIMITS.messageMin) errors.message = 'messageTooShort';
  else if (input.message.length > LIMITS.messageMax) errors.message = 'messageTooLong';

  if (!input.acknowledgement) errors.acknowledgement = 'acknowledgementRequired';
  return errors;
}

export type ContactResponse =
  | { ok: true }
  | {
      ok: false;
      error: 'invalid' | 'notConfigured' | 'rateLimited' | 'deliveryFailed' | 'badRequest';
      fields?: ContactErrors;
    };
