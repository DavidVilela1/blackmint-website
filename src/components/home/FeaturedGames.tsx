import type { Locale } from '@/i18n/config';
import { gameHref, routeHref } from '@/i18n/routes';
import type { Dictionary } from '@/i18n/dictionaries';
import { games } from '@/content/games';
import { ProjectIndex, type ProjectRow } from '@/components/games/ProjectIndex';
import { Reveal } from '@/components/motion/Reveal';
import { SplitWords } from '@/components/motion/SplitWords';
import { ScribbleLink } from '@/components/ui/ScribbleLink';

export function toProjectRows(locale: Locale, dict: Dictionary): ProjectRow[] {
  return games.map((g) => ({
    slug: g.slug,
    href: gameHref(locale, g.slug),
    title: g.title,
    tagline: g.tagline[locale],
    genre: g.genre?.[locale] ?? dict.common.toBeConfirmed,
    status: g.status ? dict.games.statuses[g.status] : dict.common.toBeConfirmed,
    isPlaceholder: g.isPlaceholder,
    placeholderLabel: dict.common.conceptPlaceholder,
    cover: { ...g.cover, alt: g.cover.alt[locale] },
  }));
}

export function FeaturedGames({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.games;
  return (
    <section aria-labelledby="featured-games" className="bg-obsidian relative pt-10 pb-28 sm:pb-36">
      <div className="container-bm">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal variant="fade">
              <p className="eyebrow">{t.label}</p>
            </Reveal>
            <Reveal
              as="h2"
              variant="words"
              id="featured-games"
              className="display distress mt-5 text-[clamp(2.8rem,7vw,6.5rem)]"
            >
              <SplitWords text={t.title} />
            </Reveal>
          </div>
          <Reveal variant="up" className="lg:col-span-5">
            <p className="text-bone/75 leading-relaxed">{t.intro}</p>
            <p className="text-muted mt-3 hidden font-mono text-[0.7rem] tracking-[0.14em] uppercase pointer-fine:lg:block">
              {t.previewHint}
            </p>
          </Reveal>
        </div>
        <div className="mt-14">
          <ProjectIndex rows={toProjectRows(locale, dict)} viewLabel={t.viewProject} />
        </div>
        <div className="mt-10 flex justify-end">
          <ScribbleLink href={routeHref(locale, 'games')}>{t.viewAll}</ScribbleLink>
        </div>
      </div>
    </section>
  );
}
