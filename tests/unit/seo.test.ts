import { afterEach, describe, expect, it, vi } from 'vitest';
import { serializeJsonLd, graph, videoGameLd, articleLd, organizationLd } from '@/lib/seo/jsonld';
import { games } from '@/content/games';
import { articles } from '@/content/journal';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('JSON-LD', () => {
  it('escapes HTML-significant characters', () => {
    const out = serializeJsonLd({ x: '</script><b>&' });
    expect(out).not.toContain('<');
    expect(out).not.toContain('>');
    expect(JSON.parse(out)).toEqual({ x: '</script><b>&' });
  });
  it('never invents ratings, offers or release dates', () => {
    const json = JSON.stringify(graph(organizationLd(), ...games.map((g) => videoGameLd(g, 'en'))));
    for (const forbidden of [
      'aggregateRating',
      'review',
      'offers',
      'datePublished',
      'gamePlatform',
    ]) {
      expect(json).not.toContain(forbidden);
    }
  });
  it('emits Article with dates from content', () => {
    const a = articleLd(articles[0]!, 'pt-pt');
    expect(a['@type']).toBe('Article');
    expect(a.inLanguage).toBe('pt-PT');
  });
});

describe('robots & sitemap', () => {
  it('blocks everything outside production', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_ENV', 'staging');
    const robots = (await import('@/app/robots')).default;
    expect(robots()).toEqual({ rules: [{ userAgent: '*', disallow: '/' }] });
  });
  it('allows crawling and references the sitemap in production', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.blackmint.example/');
    const robots = (await import('@/app/robots')).default;
    const r = robots();
    expect(r.sitemap).toBe('https://www.blackmint.example/sitemap.xml');
  });
  it('lists only indexable canonical URLs with reciprocal hreflang', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.blackmint.example');
    const sitemap = (await import('@/app/sitemap')).default;
    const entries = sitemap();
    expect(entries).toHaveLength(16); // 8 static pages × 2 locales; placeholders excluded
    expect(entries.some((e) => e.url.includes('hollow-moon'))).toBe(false);
    for (const e of entries) {
      const langs = e.alternates?.languages as Record<string, string>;
      expect(Object.keys(langs).sort()).toEqual(['en', 'pt-PT', 'x-default']);
      expect(Object.values(langs)).toContain(e.url);
    }
  });
  it('includes placeholders only when explicitly allowed', async () => {
    vi.stubEnv('INDEX_PLACEHOLDER_CONTENT', 'true');
    const sitemap = (await import('@/app/sitemap')).default;
    expect(sitemap()).toHaveLength(16 + games.length * 2 + articles.length * 2);
  });
});

describe('llms.txt', () => {
  it('describes placeholders honestly and links to both locales', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.blackmint.example');
    const { buildLlmsTxt, buildLlmsFullTxt } = await import('@/lib/llms');
    const txt = buildLlmsTxt();
    expect(txt.startsWith('# BlackMint Interactive')).toBe(true);
    expect(txt).toContain('no games have been publicly announced');
    expect(txt).toContain('https://www.blackmint.example/pt-pt/games');
    const full = buildLlmsFullTxt();
    expect(full).toContain('Concept placeholder');
    expect(full).toContain('Conceito provisório');
  });
});
