import { describe, expect, it } from 'vitest';
import {
  makeConsent,
  parseConsent,
  serializeConsent,
  readCookie,
  allDenied,
  allGranted,
} from '@/lib/consent/cookie';
import { CONSENT_VERSION } from '@/lib/consent/config';
import { integrations } from '@/lib/consent/integrations';

describe('consent cookie', () => {
  it('round-trips choices', () => {
    const c = makeConsent(
      { preferences: true, analytics: false, marketing: true },
      new Date('2026-10-01T10:00:00Z'),
    );
    expect(parseConsent(serializeConsent(c))).toEqual(c);
  });
  it('rejects malformed, empty or outdated values', () => {
    expect(parseConsent(undefined)).toBeNull();
    expect(parseConsent('garbage')).toBeNull();
    expect(parseConsent('%E0%A4%A')).toBeNull();
    expect(
      parseConsent(encodeURIComponent(`${CONSENT_VERSION + 1}|2026-01-01T00:00:00Z|p1a1m1`)),
    ).toBeNull();
  });
  it('reject-all denies every optional category', () => {
    expect(allDenied()).toEqual({ preferences: false, analytics: false, marketing: false });
    expect(allGranted()).toEqual({ preferences: true, analytics: true, marketing: true });
  });
  it('reads cookies by exact name', () => {
    expect(readCookie('a=1; bm_consent=x; bm_consent_old=y', 'bm_consent')).toBe('x');
    expect(readCookie('', 'bm_consent')).toBeUndefined();
  });
  it('ships with no third-party integrations', () => {
    expect(integrations).toHaveLength(0);
  });
});
