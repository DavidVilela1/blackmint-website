import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { normalizeContact, validateContact, LIMITS } from '@/lib/contact/validation';
import { rateLimit, __resetRateLimit } from '@/lib/contact/rate-limit';

const valid = {
  name: 'Ada',
  email: 'ada@example.com',
  topic: 'press',
  message: 'Hello there, this is a long enough message.',
  acknowledgement: true,
};

describe('contact validation', () => {
  it('accepts a valid message', () => {
    expect(validateContact(normalizeContact(valid))).toEqual({});
  });
  it('reports each problem with a code', () => {
    const errors = validateContact(
      normalizeContact({
        name: '  ',
        email: 'nope',
        topic: 'x',
        message: 'short',
        acknowledgement: false,
      }),
    );
    expect(errors).toEqual({
      name: 'nameRequired',
      email: 'emailInvalid',
      topic: 'topicInvalid',
      message: 'messageTooShort',
      acknowledgement: 'acknowledgementRequired',
    });
  });
  it('enforces maximum lengths', () => {
    const e = validateContact(
      normalizeContact({
        ...valid,
        name: 'a'.repeat(LIMITS.nameMax + 1),
        message: 'm'.repeat(LIMITS.messageMax + 1),
      }),
    );
    expect(e.name).toBe('nameTooLong');
    expect(e.message).toBe('messageTooLong');
  });
  it('normalises input and ignores non-string values', () => {
    const n = normalizeContact({
      name: '  Ada   Lovelace ',
      email: ' ADA@Example.com ',
      topic: 'general',
      message: 42,
      acknowledgement: 'on',
    });
    expect(n).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: '',
      acknowledgement: true,
    });
  });
  it.each(['a@b', 'a b@c.com', '@x.com', 'a@.com', 'a@b.'])('rejects %s', (email) => {
    expect(validateContact(normalizeContact({ ...valid, email })).email).toBe('emailInvalid');
  });
});

describe('rate limit', () => {
  beforeEach(() => __resetRateLimit());
  it('allows 5 per window then blocks', () => {
    for (let i = 0; i < 5; i++) expect(rateLimit('ip', 5, 1000, 0)).toBe(true);
    expect(rateLimit('ip', 5, 1000, 10)).toBe(false);
    expect(rateLimit('ip', 5, 1000, 2000)).toBe(true);
  });
});

describe('delivery configuration', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });
  it('is not configured without credentials (honest default)', async () => {
    vi.stubEnv('CONTACT_PROVIDER', '');
    const mod = await import('@/lib/contact/delivery');
    expect(mod.isContactConfigured()).toBe(false);
    expect(await mod.deliverContact({ ...normalizeContact(valid), locale: 'en' })).toEqual({
      ok: false,
      reason: 'notConfigured',
    });
  });
  it('requires all Resend variables', async () => {
    vi.stubEnv('CONTACT_PROVIDER', 'resend');
    vi.stubEnv('RESEND_API_KEY', 'test');
    const mod = await import('@/lib/contact/delivery');
    expect(mod.isContactConfigured()).toBe(false);
  });
  it('accepts a webhook over https and posts JSON', async () => {
    vi.stubEnv('CONTACT_PROVIDER', 'webhook');
    vi.stubEnv('CONTACT_WEBHOOK_URL', 'https://hooks.example.com/x');
    const fetchMock = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const mod = await import('@/lib/contact/delivery');
    expect(mod.isContactConfigured()).toBe(true);
    expect(await mod.deliverContact({ ...normalizeContact(valid), locale: 'pt-pt' })).toEqual({
      ok: true,
    });
    const body = JSON.parse(fetchMock.mock.calls[0]![1].body);
    expect(body).toMatchObject({ email: 'ada@example.com', locale: 'pt-pt' });
    vi.unstubAllGlobals();
  });
});
