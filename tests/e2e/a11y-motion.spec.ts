import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { decideConsent } from './helpers';

test.describe('accessibility (axe, WCAG 2.2 AA rules)', () => {
  for (const path of [
    '/en',
    '/pt-pt/games',
    '/en/games/paper-kingdom',
    '/pt-pt/about',
    '/en/journal/from-sketchbook-to-prototype',
    '/en/contact',
    '/pt-pt/cookies',
    '/en/missing-page',
  ]) {
    test(`no serious violations on ${path}`, async ({ page, context, baseURL }) => {
      await decideConsent(context, baseURL!);
      await page.emulateMedia({ reducedMotion: 'reduce' }); // audit final, settled state
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const serious = results.violations.filter((v) =>
        ['serious', 'critical'].includes(v.impact ?? ''),
      );
      expect(
        serious.map(
          (v) =>
            `${v.id}: ${v.nodes
              .map((n) => n.target.join(' '))
              .slice(0, 3)
              .join(' | ')}`,
        ),
      ).toEqual([]);
    });
  }

  test('banner state passes axe too', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/pt-pt');
    await expect(page.getByRole('region', { name: 'Cookies, com franqueza.' })).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(
      results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')),
    ).toEqual([]);
  });

  test('skip link moves focus to main content', async ({ page, context, baseURL }) => {
    await decideConsent(context, baseURL!);
    await page.goto('/en/about');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe('motion', () => {
  test('reduced motion: no motion class, everything visible immediately', async ({
    page,
    context,
    baseURL,
  }) => {
    await decideConsent(context, baseURL!);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/en');
    await expect(page.locator('html')).not.toHaveClass(/(^|\s)motion(\s|$)/);
    for (const sel of ['[data-reveal]', '[data-reveal-stagger] > *']) {
      const opacities = await page
        .locator(sel)
        .evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
      expect(opacities.every((o) => o === '1')).toBe(true);
    }
  });

  test('with motion: GSAP boots and scroll reveals complete', async ({
    page,
    context,
    baseURL,
  }) => {
    await decideConsent(context, baseURL!);
    await page.goto('/en/games');
    await expect(page.locator('html')).toHaveClass(/gsap-ok/);
    await expect(page.locator('html')).toHaveClass(/(^|\s)motion(\s|$)/);
    const card = page.locator('[data-reveal="clip"]').first();
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveCSS('clip-path', /inset\(0px( 0px)* 0%\)|none/, { timeout: 5000 });
  });

  test('client-side navigation leaves no stale pins or errors', async ({
    page,
    context,
    baseURL,
  }) => {
    await decideConsent(context, baseURL!);
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto('/en');
    await page.mouse.wheel(0, 2500);
    await page.waitForTimeout(600);
    await page.mouse.wheel(0, -400); // scrolling up reveals the tucked-away header
    await page.waitForTimeout(700);
    await page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: /Journal/ })
      .click();
    await expect(page).toHaveURL(/\/en\/journal$/);
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    await page.goBack();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('.pin-spacer')).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test('content stays visible without JavaScript', async ({ browser, baseURL }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    await ctx.addCookies([
      {
        name: 'bm_consent',
        value: encodeURIComponent('1|2026-10-01T00:00:00.000Z|p0a0m0'),
        url: baseURL!,
      },
    ]);
    const page = await ctx.newPage();
    await page.goto('/en');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Worlds we are sketching' })).toBeVisible();
    await ctx.close();
  });
});
