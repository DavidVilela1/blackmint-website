import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, locales } from '@/i18n/config';
import { gameHref, routeHref } from '@/i18n/routes';
import { getDictionary } from '@/i18n/dictionaries';
import { format } from '@/i18n/format';
import { games, getGame } from '@/content/games';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbLd, graph, videoGameLd, webPageLd } from '@/lib/seo/jsonld';
import { isGameIndexable } from '@/lib/content-index';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Notice } from '@/components/ui/Notice';
import { ScribbleLink } from '@/components/ui/ScribbleLink';
import { Reveal } from '@/components/motion/Reveal';
import { Parallax } from '@/components/motion/Parallax';
import { SplitWords } from '@/components/motion/SplitWords';
import { Gallery } from '@/components/games/Gallery';
import { TornEdge } from '@/components/brand/TornEdge';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => games.map((g) => ({ locale, slug: g.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const game = getGame(slug);
  if (!isLocale(locale) || !game) return {};
  return buildMetadata({
    locale,
    path: `/games/${game.slug}`,
    title: game.title,
    description: game.summary[locale],
    image: {
      src: game.hero.src,
      width: game.hero.width,
      height: game.hero.height,
      alt: game.hero.alt[locale],
    },
    noindex: !isGameIndexable(game),
  });
}

export default async function GamePage({ params }: Props) {
  const { locale, slug } = await params;
  const game = getGame(slug);
  if (!isLocale(locale) || !game) notFound();
  const dict = getDictionary(locale);
  const t = dict.games;
  const d = t.detail;
  const paper = game.tone === 'paper';
  const crumbs = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.games, path: '/games' },
    { name: game.title, path: `/games/${game.slug}` },
  ];
  const others = games.filter((g) => g.slug !== game.slug);

  const meta: { label: string; value: string }[] = [
    { label: t.genre, value: game.genre?.[locale] ?? dict.common.toBeConfirmed },
    { label: t.platforms, value: game.platforms?.join(', ') ?? dict.common.toBeConfirmed },
    { label: t.status, value: game.status ? t.statuses[game.status] : dict.common.toBeConfirmed },
  ];

  return (
    <article>
      <JsonLd
        data={graph(
          webPageLd(locale, `/games/${game.slug}`, game.title, game.summary[locale]),
          videoGameLd(game, locale),
          breadcrumbLd(locale, crumbs),
        )}
      />

      {/* Hero artwork */}
      <header className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden pt-[var(--header-h)]">
        <div aria-hidden={false} className="absolute inset-0 -z-10">
          <Parallax speed={0.1} className="absolute inset-[-10%]">
            <Image
              src={game.hero.src}
              alt={game.hero.alt[locale]}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </Parallax>
          <div className="from-obsidian via-obsidian/45 to-obsidian/10 absolute inset-0 bg-gradient-to-t" />
        </div>
        <div className="container-bm pb-16 sm:pb-20">
          <Breadcrumbs locale={locale} items={crumbs} label={dict.a11y.breadcrumb} />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {game.isPlaceholder ? (
              <span className="badge-placeholder">{dict.common.conceptPlaceholder}</span>
            ) : null}
          </div>
          <Reveal
            as="h1"
            variant="words"
            start="load"
            className="display distress mt-4 text-[clamp(3.6rem,12vw,11rem)]"
          >
            <SplitWords text={game.title} />
          </Reveal>
          <Reveal variant="up" start="load" delay={0.3}>
            <p className="hand text-mint mt-4 max-w-3xl -rotate-1 text-[clamp(1.5rem,2.6vw,2.2rem)] leading-tight">
              {game.tagline[locale]}
            </p>
          </Reveal>
        </div>
      </header>

      {/* Overview + metadata */}
      <section aria-labelledby="overview" className="bg-obsidian relative py-20 sm:py-28">
        <div className="container-bm grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {game.isPlaceholder ? (
              <div className="mb-10">
                <Notice>{format(d.placeholderNotice, { title: game.title })}</Notice>
              </div>
            ) : null}
            <p className="eyebrow">{d.overview}</p>
            <h2 id="overview" className="sr-only">
              {d.overview}
            </h2>
            <Reveal variant="up" className="prose-bm mt-6 text-lg">
              {game.overview[locale].map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
          </div>
          <aside aria-labelledby="details" className="lg:col-span-4 lg:col-start-9">
            <h2 id="details" className="eyebrow">
              {d.details}
            </h2>
            <dl className="divide-bone/10 border-bone/10 mt-6 divide-y border-y">
              {meta.map((m) => (
                <div key={m.label} className="flex justify-between gap-6 py-4">
                  <dt className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
                    {m.label}
                  </dt>
                  <dd className="text-bone text-right">{m.value}</dd>
                </div>
              ))}
            </dl>
            <h3 className="eyebrow mt-10">{d.links}</h3>
            {game.links.length ? (
              <ul className="mt-4 space-y-2">
                {game.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="link-scribble"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {l.label[locale]} <span className="sr-only">{dict.a11y.opensNewTab}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mt-4 text-sm">{d.noLinks}</p>
            )}
          </aside>
        </div>
      </section>

      {/* World + gameplay */}
      <section
        data-surface={paper ? 'paper' : undefined}
        className={`relative py-24 sm:py-32 ${paper ? 'bg-paper text-obsidian' : 'bg-charcoal'}`}
      >
        <TornEdge position="top" className="text-obsidian" />
        <div className="container-bm grid gap-16 md:grid-cols-2">
          <Reveal variant="up">
            <p className="eyebrow">01</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,4.5vw,4rem)]">{d.world}</h2>
            <div
              className={`mt-6 space-y-5 text-lg leading-relaxed ${paper ? 'text-ink' : 'text-bone/80'}`}
            >
              {game.world[locale].map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal variant="up" delay={0.15}>
            <p className="eyebrow">02</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,4.5vw,4rem)]">{d.gameplay}</h2>
            <div
              className={`mt-6 space-y-5 text-lg leading-relaxed ${paper ? 'text-ink' : 'text-bone/80'}`}
            >
              {game.gameplay[locale].map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
        <TornEdge position="bottom" className="text-obsidian" />
      </section>

      {/* Gallery */}
      <section aria-labelledby="gallery" className="bg-obsidian py-24 sm:py-32">
        <div className="container-bm">
          <h2 id="gallery" className="display distress text-[clamp(2.4rem,5vw,4.5rem)]">
            {d.gallery}
          </h2>
          <div className="mt-10">
            <Gallery
              images={game.gallery.map((g) => ({ ...g, alt: g.alt[locale] }))}
              title={format(d.galleryDialog, { title: game.title })}
              strings={{
                close: dict.common.close,
                previous: dict.common.previous,
                next: dict.common.next,
                imageCount: dict.common.imageCount,
                openImage: d.openImage,
              }}
            />
          </div>
        </div>
      </section>

      {/* CTA + other projects */}
      <section className="border-bone/10 bg-obsidian border-t py-24">
        <div className="container-bm grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="display text-[clamp(2.2rem,4vw,3.6rem)]">{d.ctaTitle}</h2>
            <p className="text-bone/80 mt-4 text-lg">{d.ctaBody}</p>
            <Link href={routeHref(locale, 'contact')} className="btn-brush mt-8">
              {d.ctaButton} <span aria-hidden>→</span>
            </Link>
          </div>
          <nav aria-labelledby="more-worlds" className="lg:col-span-5 lg:col-start-8">
            <h2 id="more-worlds" className="eyebrow">
              {d.more}
            </h2>
            <ul className="divide-bone/10 border-bone/10 mt-6 divide-y border-y">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={gameHref(locale, o.slug)}
                    className="group flex items-center justify-between gap-4 py-5"
                  >
                    <span className="display group-hover:text-mint text-3xl transition-colors">
                      {o.title}
                    </span>
                    <span
                      aria-hidden
                      className="text-mint transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <ScribbleLink href={routeHref(locale, 'games')}>{d.back}</ScribbleLink>
            </div>
          </nav>
        </div>
      </section>
    </article>
  );
}
