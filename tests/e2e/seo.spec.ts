import { expect, test } from '@playwright/test';

test.describe('SEO & discovery files', () => {
  test('sitemap.xml is valid and lists canonical URLs with alternates', async ({
    request,
    baseURL,
  }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('xml');
    const xml = await res.text();
    expect(xml).toContain('<urlset');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toHaveLength(16);
    expect(locs).toContain(`${baseURL}/pt-pt/games`);
    expect(xml).toContain('hreflang="x-default"');
    expect(xml).not.toContain('hollow-moon'); // placeholder excluded
    for (const loc of locs) expect((await request.get(loc!)).status()).toBe(200);
  });

  test('robots.txt references the sitemap and does not block assets', async ({
    request,
    baseURL,
  }) => {
    const txt = await (await request.get('/robots.txt')).text();
    expect(txt).toContain(`Sitemap: ${baseURL}/sitemap.xml`);
    expect(txt).toMatch(/Allow: \//);
    expect(txt).not.toMatch(/Disallow: \/\s*$/m);
  });

  test('llms.txt and llms-full.txt are served as markdown', async ({ request }) => {
    const llms = await request.get('/llms.txt');
    expect(llms.status()).toBe(200);
    const body = await llms.text();
    expect(body).toMatch(/^# BlackMint Interactive/);
    expect(body).toContain('## Main pages');
    const full = await request.get('/llms-full.txt');
    expect(await full.text()).toContain('Português (Portugal)');
  });

  test('manifest and icons exist', async ({ request }) => {
    expect((await request.get('/manifest.webmanifest')).status()).toBe(200);
    for (const p of [
      '/icon.png',
      '/apple-icon.png',
      '/favicon.ico',
      '/icons/icon-192.png',
      '/og/og-default-en.jpg',
      '/og/og-default-pt-pt.jpg',
    ]) {
      expect((await request.get(p)).status(), p).toBe(200);
    }
  });

  for (const path of [
    '/en',
    '/pt-pt/games/mint-static',
    '/en/journal/small-team-big-worlds',
    '/pt-pt/about',
  ]) {
    test(`exactly one valid JSON-LD block on ${path}`, async ({ page }) => {
      await page.goto(path);
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(blocks).toHaveLength(1);
      const data = JSON.parse(blocks[0]!);
      expect(data['@context']).toBe('https://schema.org');
      expect(Array.isArray(data['@graph'])).toBe(true);
      const types = data['@graph'].map((n: { '@type': string }) => n['@type']);
      if (path === '/en')
        expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite']));
      if (path.includes('games/')) expect(types).toContain('VideoGame');
      if (path.includes('journal/')) expect(types).toContain('Article');
      expect(types.length).toBe(new Set(types).size);
    });
  }
});
