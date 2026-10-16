import { type Locale, locales, localeMeta } from '@/i18n/config';
import { href, gameHref, articleHref } from '@/i18n/routes';
import { getDictionary } from '@/i18n/dictionaries';
import { games } from '@/content/games';
import { sortedArticles } from '@/content/journal';
import { studio } from '@/content/site';
import { absoluteUrl, publicContactEmail } from '@/lib/env';

/**
 * /llms.txt and /llms-full.txt — supplementary, machine-readable summaries
 * for AI tools (see https://llmstxt.org — a community proposal, not an
 * official SEO standard). Generated from the same content source as the site,
 * so they never drift. Placeholder content is described as placeholder.
 */
const L = (locale: Locale, path: string) => absoluteUrl(href(locale, path));

export function buildLlmsTxt(): string {
  const en = getDictionary('en');
  const realGames = games.filter((g) => !g.isPlaceholder);
  const lines: string[] = [
    `# ${studio.name}`,
    '',
    `> ${en.meta.defaultDescription}`,
    '',
    `${studio.name} is an independent video game studio. Slogans: "${studio.slogans.primary}" and "${studio.slogans.secondary}". The website is published in English (/en) and European Portuguese (/pt-pt); every page exists in both languages at the same path.`,
    '',
    realGames.length
      ? `Announced projects: ${realGames.map((g) => g.title).join(', ')}.`
      : 'Status: no games have been publicly announced yet. Projects shown on the website (Hollow Moon, Mint Static, Paper Kingdom) are clearly labelled illustrative concept placeholders, not real or announced games. Journal entries are currently samples.',
    '',
    '## Main pages',
    '',
    `- [Home](${L('en', '')}): studio introduction and overview`,
    `- [Games](${L('en', '/games')}): projects; only confirmed details are published`,
    `- [Studio](${L('en', '/about')}): who the studio is and how it works`,
    `- [Journal](${L('en', '/journal')}): development updates and notes`,
    `- [Contact](${L('en', '/contact')}): collaboration, press and playtesting enquiries`,
    '',
    '## Portuguese (Portugal)',
    '',
    `- [Início](${L('pt-pt', '')})`,
    `- [Jogos](${L('pt-pt', '/games')})`,
    `- [Estúdio](${L('pt-pt', '/about')})`,
    `- [Diário](${L('pt-pt', '/journal')})`,
    `- [Contacto](${L('pt-pt', '/contact')})`,
    '',
    '## Legal',
    '',
    `- [Privacy policy](${L('en', '/privacy')})`,
    `- [Terms of use](${L('en', '/terms')})`,
    `- [Cookie policy](${L('en', '/cookies')})`,
    '',
    '## Optional',
    '',
    `- [Full text summary](${absoluteUrl('/llms-full.txt')}): expanded, plain-text description of the studio, projects and journal`,
    `- [Sitemap](${absoluteUrl('/sitemap.xml')})`,
  ];
  return lines.join('\n') + '\n';
}

export function buildLlmsFullTxt(): string {
  const out: string[] = [];
  const push = (...l: string[]) => out.push(...l);
  push(`# ${studio.name} — full summary`, '');
  push(
    'This file is generated from the website content. Facts that have not been confirmed by the studio are omitted or marked as placeholders.',
    '',
  );

  for (const locale of locales) {
    const d = getDictionary(locale);
    push(`## ${localeMeta[locale].label}`, '');
    push(
      `### ${d.about.heading}`,
      '',
      d.about.intro,
      '',
      ...d.about.whoBody.flatMap((p) => [p, '']),
    );
    push(`### ${d.home.statement.label}`, '', d.home.statement.text, '');
    for (const p of d.home.statement.principles) push(`- **${p.title}** — ${p.body}`);
    push('');
    push(`### ${d.games.heading}`, '');
    for (const g of games) {
      push(
        `- [${g.title}](${absoluteUrl(gameHref(locale, g.slug))})${g.isPlaceholder ? ` — ${d.common.conceptPlaceholder}` : ''}: ${g.summary[locale]}`,
      );
    }
    push('', `### ${d.journal.heading}`, '');
    for (const a of sortedArticles()) {
      push(
        `- [${a.title[locale]}](${absoluteUrl(articleHref(locale, a.slug))})${a.isSample ? ` — ${d.common.sampleEntry}` : ''}: ${a.excerpt[locale]}`,
      );
    }
    push('');
  }

  push('## Studio facts', '');
  push(`- Founded: ${studio.facts.founded ?? 'not published'}`);
  push(`- Based in: ${studio.facts.basedIn ?? 'not published'}`);
  push(`- Team size: ${studio.facts.teamSize ?? 'not published'}`);
  push(`- Contact: ${publicContactEmail ?? `contact form at ${absoluteUrl('/en/contact')}`}`);
  push(
    `- Official channels: ${studio.socials.length ? studio.socials.map((s) => `${s.label} (${s.href})`).join(', ') : 'none published yet'}`,
  );
  return out.join('\n') + '\n';
}
