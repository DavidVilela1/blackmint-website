import {
  CONSENT_VERSION,
  type ConsentState,
  type OptionalCategory,
  optionalCategories,
} from './config';

/** Serialise consent into a compact cookie value: v1.ts.p1a0m0 */
export function serializeConsent(state: ConsentState): string {
  const flags = optionalCategories.map((c) => `${c[0]}${state[c] ? 1 : 0}`).join('');
  return encodeURIComponent(`${state.v}|${state.ts}|${flags}`);
}

/** Parse a stored cookie value. Returns null when missing, malformed or outdated. */
export function parseConsent(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null;
  }
  const [v, ts, flags] = decoded.split('|');
  const version = Number(v);
  if (!Number.isInteger(version) || version !== CONSENT_VERSION || !ts || !flags) return null;
  if (Number.isNaN(Date.parse(ts))) return null;
  const read = (c: OptionalCategory) => new RegExp(`${c[0]}1`).test(flags);
  return {
    v: version,
    ts,
    preferences: read('preferences'),
    analytics: read('analytics'),
    marketing: read('marketing'),
  };
}

export function makeConsent(
  choices: Record<OptionalCategory, boolean>,
  now = new Date(),
): ConsentState {
  return { v: CONSENT_VERSION, ts: now.toISOString(), ...choices };
}

export const allGranted = (): Record<OptionalCategory, boolean> => ({
  preferences: true,
  analytics: true,
  marketing: true,
});

export const allDenied = (): Record<OptionalCategory, boolean> => ({
  preferences: false,
  analytics: false,
  marketing: false,
});

/** Read a cookie by name from a `document.cookie`-style string. */
export function readCookie(cookieString: string, name: string): string | undefined {
  const match = cookieString
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : undefined;
}
