import 'server-only';
import type { ContactInput } from './validation';

/**
 * Pluggable delivery for contact messages. Configure with environment
 * variables (see .env.example). Nothing here is ever sent to the browser.
 *
 *   CONTACT_PROVIDER=resend   → Resend HTTP API (RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL)
 *   CONTACT_PROVIDER=webhook  → JSON POST to CONTACT_WEBHOOK_URL (+ optional CONTACT_WEBHOOK_SECRET)
 *   (unset)                   → not configured: the UI says so honestly.
 */
export type DeliveryResult = { ok: true } | { ok: false; reason: 'notConfigured' | 'failed' };

interface Provider {
  configured(): boolean;
  send(msg: ContactInput & { locale: string }): Promise<DeliveryResult>;
}

const env = (k: string) => process.env[k]?.trim() || '';

const resend: Provider = {
  configured: () =>
    !!(env('RESEND_API_KEY') && env('CONTACT_TO_EMAIL') && env('CONTACT_FROM_EMAIL')),
  async send(msg) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env('CONTACT_FROM_EMAIL'),
        to: [env('CONTACT_TO_EMAIL')],
        reply_to: msg.email,
        subject: `[BlackMint website] ${msg.topic} — ${msg.name}`,
        text: [
          `Name: ${msg.name}`,
          `Email: ${msg.email}`,
          `Topic: ${msg.topic}`,
          `Site language: ${msg.locale}`,
          '',
          msg.message,
        ].join('\n'),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok ? { ok: true } : { ok: false, reason: 'failed' };
  },
};

const webhook: Provider = {
  configured: () => /^https:\/\//.test(env('CONTACT_WEBHOOK_URL')),
  async send(msg) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (env('CONTACT_WEBHOOK_SECRET')) headers['X-Webhook-Secret'] = env('CONTACT_WEBHOOK_SECRET');
    const res = await fetch(env('CONTACT_WEBHOOK_URL'), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        source: 'blackmint-website',
        receivedAt: new Date().toISOString(),
        name: msg.name,
        email: msg.email,
        topic: msg.topic,
        message: msg.message,
        locale: msg.locale,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok ? { ok: true } : { ok: false, reason: 'failed' };
  },
};

const providers: Record<string, Provider> = { resend, webhook };

function activeProvider(): Provider | null {
  const p = providers[env('CONTACT_PROVIDER').toLowerCase()];
  return p && p.configured() ? p : null;
}

export function isContactConfigured(): boolean {
  return activeProvider() !== null;
}

export async function deliverContact(
  msg: ContactInput & { locale: string },
): Promise<DeliveryResult> {
  const provider = activeProvider();
  if (!provider) return { ok: false, reason: 'notConfigured' };
  try {
    return await provider.send(msg);
  } catch (err) {
    console.error('[contact] delivery error', err instanceof Error ? err.message : err);
    return { ok: false, reason: 'failed' };
  }
}
