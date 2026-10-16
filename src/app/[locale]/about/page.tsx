import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { routeHref } from '@/i18n/routes';
import { getDictionary } from '@/i18n/dictionaries';
import { studio } from '@/content/site';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbLd, graph, organizationLd, webPageLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { PageIntro } from '@/components/ui/PageIntro';
import { Reveal } from '@/components/motion/Reveal';
import { Parallax } from '@/components/motion/Parallax';
import { SplitWords } from '@/components/motion/SplitWords';
import { Doodle, type DoodleName } from '@/components/brand/Doodle';
import { Logo } from '@/components/brand/Logo';
import { TornEdge } from '@/components/brand/TornEdge';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getDictionary(locale).meta.pages.about;
  return buildMetadata({ locale, path: '/about', title: m.title, description: m.description });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.about;
  const crumbs = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.about, path: '/about' },
  ];
  const facts = [
    { label: t.facts.founded, value: studio.facts.founded },
    { label: t.facts.based, value: studio.facts.basedIn },
    { label: t.facts.team, value: studio.facts.teamSize },
  ];
  const doodles: DoodleName[] = ['star', 'controller', 'crown'];

  return (
    <>
      <JsonLd
        data={graph(
          organizationLd(),
          webPageLd(
            locale,
            '/about',
            dict.meta.pages.about.title,
            dict.meta.pages.about.description,
          ),
          breadcrumbLd(locale, crumbs),
        )}
      />
      <section className="relative overflow-hidden pt-[calc(var(--header-h)+3rem)] pb-20 sm:pb-28">
        <Parallax
          speed={0.15}
          className="pointer-events-none absolute top-24 -right-20 w-[55vw] max-w-lg opacity-[0.08]"
        >
          <Logo variant="symbol" decorative priority />
        </Parallax>
        <div className="container-bm relative">
          <Breadcrumbs locale={locale} items={crumbs} label={dict.a11y.breadcrumb} />
          <div className="mt-10">
            <PageIntro eyebrow={t.label} title={t.heading} intro={t.intro} />
          </div>
        </div>
      </section>

      {/* Moodboard strip */}
      <section aria-label={t.gallery.caption} className="pb-24">
        <div className="container-bm">
          <div className="grid gap-4 md:grid-cols-12 md:items-end">
            <Reveal
              variant="clip"
              className="relative aspect-[920/440] overflow-hidden md:col-span-7"
            >
              <Image
                src="/images/studio/studio-setup.jpg"
                alt={t.gallery.setupAlt}
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
              />
            </Reveal>
            <Reveal
              variant="clip"
              delay={0.15}
              className="relative aspect-[744/866] overflow-hidden md:col-span-3"
            >
              <Image
                src="/images/studio/hoodie.jpg"
                alt={t.gallery.hoodieAlt}
                fill
                sizes="(min-width: 768px) 25vw, 100vw"
                className="object-cover"
              />
            </Reveal>
            <div className="md:col-span-2">
              <p className="hand text-mint -rotate-2 text-2xl leading-tight">{t.gallery.caption}</p>
              <Doodle name="x" className="mt-4 h-8 w-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section aria-labelledby="who" className="border-bone/10 border-t py-24 sm:py-32">
        <div className="container-bm grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal
              as="h2"
              variant="words"
              id="who"
              className="display distress text-[clamp(2.8rem,6vw,5.5rem)]"
            >
              <SplitWords text={t.whoTitle} />
            </Reveal>
            <Reveal variant="clip" className="relative mt-10 aspect-[920/418] overflow-hidden">
              <Image
                src="/images/studio/desk-notebook.jpg"
                alt={t.gallery.notebookAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal variant="stagger" className="text-bone/85 space-y-6 text-lg leading-relaxed">
              {t.whoBody.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p className="border-mint text-muted border-l-2 pl-4 text-base">{t.teamPending}</p>
            </Reveal>
            <h3 className="eyebrow mt-14">{t.factsTitle}</h3>
            <dl className="border-bone/10 bg-bone/10 mt-5 grid gap-px border sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="bg-obsidian p-5">
                  <dt className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
                    {f.label}
                  </dt>
                  <dd className={`mt-2 ${f.value ? 'display text-2xl' : 'text-bone/60 text-sm'}`}>
                    {f.value ?? dict.common.toBeConfirmed}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section
        data-surface="paper"
        aria-labelledby="approach"
        className="bg-paper text-obsidian relative py-24 sm:py-32"
      >
        <TornEdge position="top" className="text-obsidian" />
        <div className="container-bm">
          <Reveal
            as="h2"
            variant="words"
            id="approach"
            className="display text-[clamp(2.8rem,6vw,5.5rem)]"
          >
            <SplitWords text={t.approachTitle} />
          </Reveal>
          <Reveal
            as="ol"
            variant="stagger"
            className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4"
          >
            {t.approach.map((s, i) => (
              <li key={s.step} className="border-obsidian border-t-2 pt-6">
                <span className="text-mint-ink font-mono text-xs">0{i + 1}</span>
                <h3 className="display mt-3 text-4xl">{s.step}</h3>
                <p className="text-ink mt-4 leading-relaxed">{s.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
        <TornEdge position="bottom" className="text-obsidian" />
      </section>

      {/* Beliefs */}
      <section aria-labelledby="beliefs" className="py-24 sm:py-32">
        <div className="container-bm">
          <Reveal
            as="h2"
            variant="words"
            id="beliefs"
            className="display distress text-[clamp(2.8rem,6vw,5.5rem)]"
          >
            <SplitWords text={t.beliefsTitle} />
          </Reveal>
          <Reveal
            as="ul"
            variant="stagger"
            className="divide-bone/10 border-bone/10 mt-14 divide-y border-y"
          >
            {t.beliefs.map((b, i) => (
              <li key={b.title} className="grid gap-4 py-10 md:grid-cols-12 md:items-baseline">
                <Doodle name={doodles[i] ?? 'x'} className="h-9 w-auto md:col-span-1" />
                <h3 className="display text-[clamp(2rem,3.6vw,3.2rem)] md:col-span-5">{b.title}</h3>
                <p className="text-bone/80 text-lg leading-relaxed md:col-span-6">{b.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-bone/10 bg-charcoal border-t py-24">
        <div className="container-bm flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="display distress text-[clamp(2.4rem,5vw,4.5rem)]">{t.cta.title}</h2>
            <p className="text-bone/80 mt-4 text-lg">{t.cta.body}</p>
          </div>
          <Link href={routeHref(locale, 'contact')} className="btn-brush shrink-0">
            {t.cta.button} <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
