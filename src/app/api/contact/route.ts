import { NextResponse, type NextRequest } from 'next/server';
import { isLocale } from '@/i18n/config';
import {
  LIMITS,
  normalizeContact,
  validateContact,
  type ContactResponse,
} from '@/lib/contact/validation';
import { deliverContact } from '@/lib/contact/delivery';
import { rateLimit } from '@/lib/contact/rate-limit';

/**
 * POST /api/contact — authoritative validation, spam mitigation and delivery.
 * Spam mitigation: honeypot field, minimum fill time, per-IP rate limit,
 * same-origin check and payload size cap. No secrets reach the client.
 */
export const dynamic = 'force-dynamic';

const json = (body: ContactResponse, status: number) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(req: NextRequest) {
  // Same-origin only.
  const origin = req.headers.get('origin');
  if (origin && origin !== req.nextUrl.origin) return json({ ok: false, error: 'badRequest' }, 403);

  const length = Number(req.headers.get('content-length') ?? 0);
  if (length > 20_000) return json({ ok: false, error: 'badRequest' }, 413);

  let raw: Record<string, unknown>;
  try {
    raw = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'badRequest' }, 400);
  }
  if (!raw || typeof raw !== 'object') return json({ ok: false, error: 'badRequest' }, 400);

  // Bots: filled honeypot or impossibly fast submission → accept silently, deliver nothing.
  const elapsed = Number(raw.elapsedMs);
  if (
    (typeof raw.website === 'string' && raw.website.trim() !== '') ||
    (Number.isFinite(elapsed) && elapsed < LIMITS.minFillMs)
  ) {
    return json({ ok: true }, 200);
  }

  const ip =
    (req.headers.get('x-forwarded-for') ?? '').split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  if (!rateLimit(`contact:${ip}`)) return json({ ok: false, error: 'rateLimited' }, 429);

  const input = normalizeContact(raw);
  const fields = validateContact(input);
  if (Object.keys(fields).length) return json({ ok: false, error: 'invalid', fields }, 422);

  const locale = typeof raw.locale === 'string' && isLocale(raw.locale) ? raw.locale : 'en';
  const result = await deliverContact({ ...input, locale });
  if (result.ok) return json({ ok: true }, 200);
  if (result.reason === 'notConfigured') return json({ ok: false, error: 'notConfigured' }, 503);
  return json({ ok: false, error: 'deliveryFailed' }, 502);
}

export function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}
