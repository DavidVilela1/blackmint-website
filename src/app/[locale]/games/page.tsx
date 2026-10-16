import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { gameHref } from '@/i18n/routes';
import { getDictionary } from '@/i18n/dictionaries';
import { games } from '@/content/games';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbLd, graph, webPageLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { PageIntro } from '@/components/ui/PageIntro';
import { Notice } from '@/components/ui/Notice';
import { Reveal } from '@/components/motion/Reveal';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getDictionary(locale).meta.pages.games;
  return buildMetadata({ locale, path: '/games', title: m.title, description: m.description });
}

export default async function GamesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.games;
  const crumbs = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.games, path: '/games' },
  ];
  const anyPlaceholder = games.some((g) => g.isPlaceholder);

  return (
    <>
      <JsonLd
        data={graph(
          webPageLd(
            locale,
            '/games',
            dict.meta.pages.games.title,
            dict.meta.pages.games.description,
          ),
          breadcrumbLd(locale, crumbs),
        )}
      />
      <section className="pt-[calc(var(--header-h)+3rem)] pb-16 sm:pb-24">
        <div className="container-bm">
          <Breadcrumbs locale={locale} items={crumbs} label={dict.a11y.breadcrumb} />
          <div className="mt-10">
            <PageIntro eyebrow={t.label} title={t.heading} intro={t.intro} />
          </div>
          {anyPlaceholder ? (
            <div className="mt-12 max-w-3xl">
              <Notice>{t.placeholderNotice}</Notice>
            </div>
          ) : null}
        </div>
      </section>

      <section aria-label={t.heading} className="pb-28">
        <div className="container-bm">
          {games.length === 0 ? (
            <p className="text-muted text-lg">{t.empty}</p>
          ) : (
            <ol className="grid gap-x-8 gap-y-20 md:grid-cols-2">
              {games.map((g, i) => (
                <li key={g.slug} className={i % 2 === 1 ? 'md:mt-32' : ''}>
                  <article className="group relative">
                    <Reveal variant="clip" className="relative aspect-[1200/950] overflow-hidden">
                      <Image
                        src={g.cover.src}
                        alt={g.cover.alt[locale]}
                        fill
                        sizes="(min-width: 768px) 46vw, 100vw"
                        priority={i === 0}
                        className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-brush)] group-hover:scale-[1.04]"
                      />
                      <span
                        aria-hidden
                        className="text-bone/80 absolute top-4 left-4 font-mono text-xs"
                      >
                        0{i + 1}
                      </span>
                    </Reveal>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      {g.isPlaceholder ? (
                        <span className="badge-placeholder">{dict.common.conceptPlaceholder}</span>
                      ) : null}
                      <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
                        {g.genre?.[locale] ?? dict.common.toBeConfirmed}
                      </span>
                    </div>
                    <h2 className="display distress mt-4 text-[clamp(2.8rem,5vw,4.6rem)]">
                      <Link
                        href={gameHref(locale, g.slug)}
                        className="group-hover:text-mint transition-colors after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                      >
                        {g.title}
                      </Link>
                    </h2>
                    <p className="text-bone/75 mt-3 max-w-lg text-lg leading-relaxed">
                      {g.tagline[locale]}
                    </p>
                    <dl className="border-bone/10 mt-6 grid max-w-lg grid-cols-2 gap-4 border-t pt-4 font-mono text-xs tracking-[0.1em] uppercase">
                      <div>
                        <dt className="text-muted">{t.platforms}</dt>
                        <dd className="text-bone mt-1">
                          {g.platforms?.join(', ') ?? dict.common.toBeConfirmed}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted">{t.status}</dt>
                        <dd className="text-bone mt-1">
                          {g.status ? t.statuses[g.status] : dict.common.toBeConfirmed}
                        </dd>
                      </div>
                    </dl>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
