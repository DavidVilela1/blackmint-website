import type { Locale } from '@/i18n/config';
import { routeHref } from '@/i18n/routes';
import type { Dictionary } from '@/i18n/dictionaries';
import { sortedArticles } from '@/content/journal';
import { TornEdge } from '@/components/brand/TornEdge';
import { Reveal } from '@/components/motion/Reveal';
import { SplitWords } from '@/components/motion/SplitWords';
import { ScribbleLink } from '@/components/ui/ScribbleLink';
import { ArticleList } from '@/components/journal/ArticleList';

/** Light "paper" section — breaks the dark rhythm like a page torn from the sketchbook. */
export function JournalTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.journal;
  const latest = sortedArticles().slice(0, 3);
  return (
    <section
      data-surface="paper"
      aria-labelledby="journal-teaser"
      className="bg-paper text-obsidian relative py-28 sm:py-36"
    >
      <TornEdge position="top" className="text-charcoal" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "url('/textures/grain-dark.webp')", backgroundSize: '256px' }}
      />
      <div className="container-bm relative">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal variant="fade">
              <p className="eyebrow">{t.label}</p>
            </Reveal>
            <Reveal
              as="h2"
              variant="words"
              id="journal-teaser"
              className="display mt-5 text-[clamp(2.8rem,7vw,6.5rem)]"
            >
              <SplitWords text={t.title} />
            </Reveal>
            <p className="text-ink mt-5 max-w-md text-lg">{t.intro}</p>
          </div>
          <ScribbleLink href={routeHref(locale, 'journal')}>{t.cta}</ScribbleLink>
        </div>
        <div className="mt-16">
          <ArticleList locale={locale} dict={dict} articles={latest} />
        </div>
      </div>
      <TornEdge position="bottom" className="text-obsidian" />
    </section>
  );
}
