import { describe, expect, it } from 'vitest';
import { en } from '@/i18n/dictionaries/en';
import { ptPt } from '@/i18n/dictionaries/pt-pt';
import { negotiateLocale, isLocale } from '@/i18n/config';
import { stripLocale, switchLocalePath, href } from '@/i18n/routes';
import { format, formatDate } from '@/i18n/format';
import { games } from '@/content/games';
import { articles } from '@/content/journal';
import { getLegal } from '@/content/legal';

type Tree = Record<string, unknown>;
function shape(obj: unknown, path = ''): string[] {
  if (Array.isArray(obj))
    return [`${path}[${obj.length}]`, ...obj.flatMap((v, i) => shape(v, `${path}[${i}]`))];
  if (obj && typeof obj === 'object')
    return Object.entries(obj as Tree).flatMap(([k, v]) => shape(v, path ? `${path}.${k}` : k));
  return [path];
}
function strings(obj: unknown): string[] {
  if (typeof obj === 'string') return [obj];
  if (Array.isArray(obj)) return obj.flatMap(strings);
  if (obj && typeof obj === 'object') return Object.values(obj).flatMap(strings);
  return [];
}

describe('dictionaries', () => {
  it('PT-PT has exactly the same keys and array lengths as EN', () => {
    expect(shape(ptPt)).toEqual(shape(en));
  });
  it('has no empty strings', () => {
    for (const s of [...strings(en), ...strings(ptPt)]) expect(s.trim().length).toBeGreaterThan(0);
  });
  it('keeps interpolation tokens consistent between languages', () => {
    const tokens = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');
    const a = strings(en);
    const b = strings(ptPt);
    a.forEach((s, i) => expect(tokens(b[i] ?? '')).toBe(tokens(s)));
  });
  it('uses European rather than Brazilian Portuguese vocabulary', () => {
    const all = strings(ptPt).join(' ').toLowerCase();
    for (const br of [
      ' time pequeno',
      'tela',
      'usuário',
      'cadastro',
      'contato',
      'você',
      'equipe',
    ]) {
      expect(all).not.toContain(br);
    }
  });
});

describe('content is fully bilingual', () => {
  it('every game and article field exists in both locales', () => {
    for (const g of games) {
      for (const field of [
        g.tagline,
        g.summary,
        g.overview,
        g.world,
        g.gameplay,
        g.cover.alt,
        g.hero.alt,
      ]) {
        expect(field.en).toBeTruthy();
        expect(field['pt-pt']).toBeTruthy();
      }
    }
    for (const a of articles) {
      expect(a.body.en.length).toBe(a.body['pt-pt'].length);
      expect(a.title['pt-pt']).toBeTruthy();
    }
  });
  it('legal documents have matching structure in both locales', () => {
    const en = getLegal('en');
    const pt = getLegal('pt-pt');
    for (const key of ['privacy', 'terms', 'cookies'] as const) {
      expect(pt.documents[key].sections.map((s) => s.id)).toEqual(
        en.documents[key].sections.map((s) => s.id),
      );
    }
  });
});

describe('locale negotiation (no geolocation)', () => {
  it.each([
    [null, 'en'],
    ['', 'en'],
    ['pt-PT,pt;q=0.9', 'pt-pt'],
    ['pt-BR', 'pt-pt'],
    ['en-GB,en;q=0.8', 'en'],
    ['fr-FR,pt;q=0.5,en;q=0.4', 'pt-pt'],
    ['de-DE', 'en'],
    ['en;q=0.2,pt;q=0.9', 'pt-pt'],
  ])('%s → %s', (header, expected) => {
    expect(negotiateLocale(header)).toBe(expected);
  });
  it('validates locales', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('pt')).toBe(false);
  });
});

describe('routes', () => {
  it('builds and strips locale prefixes', () => {
    expect(href('pt-pt', '/games')).toBe('/pt-pt/games');
    expect(href('en', '')).toBe('/en');
    expect(stripLocale('/pt-pt/games/hollow-moon')).toEqual({
      locale: 'pt-pt',
      path: '/games/hollow-moon',
    });
    expect(stripLocale('/en')).toEqual({ locale: 'en', path: '' });
  });
  it('switches to the equivalent page', () => {
    expect(switchLocalePath('/en/games/hollow-moon', 'pt-pt')).toBe('/pt-pt/games/hollow-moon');
    expect(switchLocalePath('/pt-pt', 'en')).toBe('/en');
    expect(switchLocalePath('/en/journal/x', 'pt-pt', () => false)).toBe('/pt-pt');
  });
});

describe('formatting', () => {
  it('interpolates tokens', () => {
    expect(format('{n} min read', { n: 4 })).toBe('4 min read');
    expect(format('keep {unknown}', {})).toBe('keep {unknown}');
  });
  it('formats dates deterministically per locale', () => {
    expect(formatDate('2026-09-24', 'en')).toBe('24 September 2026');
    expect(formatDate('2026-09-24', 'pt-pt')).toBe('24 de setembro de 2026');
  });
});
