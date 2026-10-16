import { expect, test } from '@playwright/test';
import { decideConsent } from './helpers';

test.beforeEach(async ({ context, baseURL }) => decideConsent(context, baseURL!));

test.describe('contact form', () => {
  test('shows localized validation with an error summary @mobile', async ({ page }) => {
    await page.goto('/pt-pt/contact');
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();
    const summary = page.getByRole('alert').filter({ hasText: 'Corrija o seguinte' });
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
    await expect(summary).toContainText('Indique o seu nome.');
    await expect(page.getByLabel(/^Nome/)).toHaveAttribute('aria-invalid', 'true');
  });

  test('inline validation on blur', async ({ page }) => {
    await page.goto('/en/contact');
    const email = page.getByLabel(/^Email/);
    await email.fill('not-an-email');
    await email.blur();
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
    await email.fill('ada@example.com');
    await email.blur();
    await expect(page.getByText('Please enter a valid email address')).toHaveCount(0);
  });

  test('is honest when delivery is not configured', async ({ page }) => {
    await page.goto('/en/contact');
    await expect(page.getByText('This form is not connected yet')).toBeVisible();
    await page.getByLabel(/^Name/).fill('Ada Lovelace');
    await page.getByLabel(/^Email/).fill('ada@example.com');
    await page.getByLabel(/^Topic/).selectOption('press');
    await page
      .getByLabel(/^Message/)
      .fill('Hello BlackMint — this is a test message for the form.');
    await page.getByLabel(/I understand that my details/).check();
    await page.waitForTimeout(2600); // minimum human fill time
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(
      page.getByText(
        'Your message was not sent: the contact form is not connected to a mailbox yet.',
      ),
    ).toBeVisible();
  });

  test('privacy policy opens in a modal without losing form input', async ({ page }) => {
    await page.goto('/en/contact');
    await page.getByLabel(/^Name/).fill('Keep me');
    await page.getByRole('button', { name: 'Privacy policy' }).click();
    const dialog = page.getByRole('dialog', { name: 'Privacy policy' });
    await expect(dialog.getByRole('heading', { name: /Who is responsible/ })).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByLabel(/^Name/)).toHaveValue('Keep me');
  });

  test('API validates server-side and rejects bad input', async ({ request, baseURL }) => {
    const bad = await request.post('/api/contact', {
      data: { name: '', email: 'x', topic: 'zzz', message: '', elapsedMs: 9000 },
      headers: { Origin: baseURL! },
    });
    expect(bad.status()).toBe(422);
    expect((await bad.json()).fields).toMatchObject({
      name: 'nameRequired',
      email: 'emailInvalid',
    });
    const malformed = await request.post('/api/contact', {
      data: 'not json',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(malformed.status()).toBe(400);
    const foreign = await request.post('/api/contact', {
      data: {},
      headers: { Origin: 'https://evil.example' },
    });
    expect(foreign.status()).toBe(403);
    const honeypot = await request.post('/api/contact', {
      data: { website: 'spam', elapsedMs: 9000 },
    });
    expect(honeypot.status()).toBe(200); // silently dropped
    expect((await request.get('/api/contact')).status()).toBe(405);
  });
});
