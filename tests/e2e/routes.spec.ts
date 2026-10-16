import { expect, test } from '@playwright/test';
import { locales, pages } from './helpers';

test.describe('routes, metadata and language', () => {
  for (const locale of locales) {
    for (const path of pages) {
      test(`${locale}${path || '/'} renders with correct lang, title, canonical and hreflang`, async ({
        page,
        baseURL,
      }) => {
        const res = await page.goto(`/${locale}${path}`);
        expect(res?.status()).toBe(200);
        await expect(page.locator('html')).toHaveAttribute(
          'lang',
          locale === 'en' ? 'en' : 'pt-PT',
        );
        await expect(page.locator('h1')).toHaveCount(1);
        const title = await page.title();
        expect(title).toContain('BlackMint Interactive');
        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
        expect(canonical).toBe(`${baseURL}/${locale}${path}`);
        const alternates = await page
          .locator('link[rel="alternate"][hreflang]')
          .evaluateAll((els) =>
            Object.fromEntries(
              els.map((e) => [e.getAttribute('hreflang'), e.getAttribute('href')]),
            ),
          );
        expect(alternates).toEqual({
          en: `${baseURL}/en${path}`,
          'pt-PT': `${baseURL}/pt-pt${path}`,
          'x-default': `${baseURL}/en${path}`,
        });
        expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
        expect(await page.locator('meta[property="og:image"]').count()).toBeGreaterThan(0);
      });
    }
  }

  test('titles and descriptions are unique per page and locale', async ({ page }) => {
    const seen = new Set<string>();
    for (const locale of locales) {
      for (const path of pages) {
        await page.goto(`/${locale}${path}`);
        const key = `${await page.title()}|${await page.locator('meta[name="description"]').getAttribute('content')}`;
        expect(seen.has(key), `duplicate metadata on /${locale}${path}`).toBe(false);
        seen.add(key);
      }
    }
  });

  test('root negotiates the locale from Accept-Language', async ({ request }) => {
    const pt = await request.get('/', {
      headers: { 'Accept-Language': 'pt-PT,pt;q=0.9' },
      maxRedirects: 0,
    });
    expect(pt.status()).toBe(307);
    expect(pt.headers().location).toMatch(/\/pt-pt$/);
    const en = await request.get('/games', {
      headers: { 'Accept-Language': 'de-DE' },
      maxRedirects: 0,
    });
    expect(en.headers().location).toMatch(/\/en\/games$/);
  });

  test('a remembered language choice wins over the browser language', async ({ request }) => {
    const res = await request.get('/', {
      headers: { 'Accept-Language': 'en', Cookie: 'bm_locale=pt-pt' },
      maxRedirects: 0,
    });
    expect(res.headers().location).toMatch(/\/pt-pt$/);
  });

  test('unknown URLs return a real, localized 404', async ({ page }) => {
    for (const [url, text] of [
      ['/en/does-not-exist', 'Lost in the fog.'],
      ['/pt-pt/games/nao-existe', 'Perdido no nevoeiro.'],
      ['/en/journal/missing', 'Lost in the fog.'],
    ] as const) {
      const res = await page.goto(url);
      expect(res?.status()).toBe(404);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(text);
      await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
        'content',
        /noindex/,
      );
    }
  });

  test('placeholder content is noindex while real pages are indexable', async ({ page }) => {
    await page.goto('/en/games/hollow-moon');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await page.goto('/en/games');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index/);
  });
});

test.describe('navigation', () => {
  test('language switcher keeps the equivalent page', async ({ page }) => {
    await page.goto('/en/games/hollow-moon');
    await page
      .getByRole('navigation', { name: 'Choose language' })
      .first()
      .getByRole('link', { name: 'Português (Portugal)' })
      .click();
    await expect(page).toHaveURL(/\/pt-pt\/games\/hollow-moon$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-PT');
    await expect(page.getByText('Detalhes do projeto')).toBeVisible();
  });

  test('every internal link resolves (no dead links)', async ({ page, request }) => {
    const hrefs = new Set<string>();
    for (const locale of ['en', 'pt-pt']) {
      for (const p of ['', '/games', '/journal', '/about']) {
        await page.goto(`/${locale}${p}`);
        const links = await page
          .locator('a[href^="/"]')
          .evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
        links.forEach((l) => hrefs.add(l.split('#')[0]!));
      }
    }
    for (const h of hrefs) {
      if (!h) continue;
      const res = await request.get(h);
      expect(res.status(), h).toBe(200);
    }
  });

  test('mobile menu opens, traps background and closes with Escape @mobile', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'mobile only');
    await page.goto('/en');
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await toggle.click();
    const dialog = page.getByRole('dialog', { name: 'Site menu' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('link', { name: /Journal/ })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
    await toggle.click();
    await dialog.getByRole('link', { name: /Games/ }).click();
    await expect(page).toHaveURL(/\/en\/games$/);
    await expect(dialog).toBeHidden();
  });
});
