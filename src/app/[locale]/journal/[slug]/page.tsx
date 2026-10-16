import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, locales } from '@/i18n/config';
import { articleHref, routeHref } from '@/i18n/routes';
import { getDictionary } from '@/i18n/dictionaries';
import { format, formatDate } from '@/i18n/format';
import { articles, getArticle, sortedArticles } from '@/content/journal';
import { buildMetadata } from '@/lib/seo/metadata';
import { articleLd, breadcrumbLd, graph } from '@/lib/seo/jsonld';
import { isArticleIndexable } from '@/lib/content-index';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Notice } from '@/components/ui/Notice';
import { ScribbleLink } from '@/components/ui/ScribbleLink';
import { Reveal } from '@/components/motion/Reveal';
import { SplitWords } from '@/components/motion/SplitWords';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => articles.map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const a = getArticle(slug);
  if (!isLocale(locale) || !a) return {};
  return buildMetadata({
    locale,
    path: `/journal/${a.slug}`,
    title: a.title[locale],
    description: a.excerpt[locale],
    image: {
      src: a.cover.src,
      width: a.cover.width,
      height: a.cover.height,
      alt: a.cover.alt[locale],
    },
    type: 'article',
    publishedTime: a.publishedAt,
    modifiedTime: a.updatedAt,
    noindex: !isArticleIndexable(a),
  });
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const a = getArticle(slug);
  if (!isLocale(locale) || !a) notFound();
  const dict = getDictionary(locale);
  const t = dict.journal;
  const crumbs = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.journal, path: '/journal' },
    { name: a.title[locale], path: `/journal/${a.slug}` },
  ];
  const more = sortedArticles()
    .filter((x) => x.slug !== a.slug)
    .slice(0, 2);

  return (
    <article>
      <JsonLd data={graph(articleLd(a, locale), breadcrumbLd(locale, crumbs))} />
      <header className="pt-[calc(var(--header-h)+3rem)]">
        <div className="container-bm">
          <Breadcrumbs locale={locale} items={crumbs} label={dict.a11y.breadcrumb} />
          <div className="mt-10 max-w-5xl">
            <p className="text-muted flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs tracking-[0.14em] uppercase">
              <span>{t.tags[a.tag]}</span>
              <span aria-hidden>·</span>
              <span>
                {t.published}{' '}
                <time dateTime={a.publishedAt}>{formatDate(a.publishedAt, locale)}</time>
              </span>
              <span aria-hidden>·</span>
              <span>{format(dict.common.minutesRead, { n: a.readingMinutes })}</span>
              {a.isSample ? (
                <span className="badge-placeholder">{dict.common.sampleEntry}</span>
              ) : null}
            </p>
            <Reveal
              as="h1"
              variant="words"
              start="load"
              className="display distress mt-6 text-[clamp(2.8rem,7vw,6.5rem)]"
            >
              <SplitWords text={a.title[locale]} />
            </Reveal>
            <p className="text-bone/80 mt-6 max-w-2xl text-xl leading-relaxed">
              {a.excerpt[locale]}
            </p>
          </div>
        </div>
        <div className="container-bm mt-12">
          <Reveal variant="clip" start="load" className="relative aspect-[21/9] overflow-hidden">
            <Image
              src={a.cover.src}
              alt={a.cover.alt[locale]}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </header>

      <div className="container-bm grid gap-12 py-20 lg:grid-cols-12">
        <div className="lg:col-span-8 lg:col-start-3">
          {a.isSample ? (
            <div className="mb-12">
              <Notice>{t.entrySampleNotice}</Notice>
            </div>
          ) : null}
          <div className="prose-bm">
            {a.body[locale].map((block, i) => {
              switch (block.type) {
                case 'h2':
                  return <h2 key={i}>{block.text}</h2>;
                case 'quote':
                  return <blockquote key={i}>{block.text}</blockquote>;
                case 'list':
                  return (
                    <ul key={i}>
                      {block.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  );
                case 'image':
                  return (
                    <figure key={i} className="!my-12">
                      <div
                        className="relative overflow-hidden"
                        style={{ aspectRatio: `${block.image.width}/${block.image.height}` }}
                      >
                        <Image
                          src={block.image.src}
                          alt={block.image.alt[locale]}
                          fill
                          sizes="(min-width: 1024px) 44rem, 100vw"
                          className="object-cover"
                        />
                      </div>
                      {block.caption ? (
                        <figcaption className="hand text-mint mt-3 text-lg">
                          {block.caption[locale]}
                        </figcaption>
                      ) : null}
                    </figure>
                  );
                default:
                  return <p key={i}>{block.text}</p>;
              }
            })}
          </div>
        </div>
      </div>

      <aside aria-labelledby="keep-reading" className="border-bone/10 bg-charcoal border-t py-20">
        <div className="container-bm">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="keep-reading" className="display text-[clamp(2.2rem,4vw,3.6rem)]">
              {t.more}
            </h2>
            <ScribbleLink href={routeHref(locale, 'journal')}>{t.back}</ScribbleLink>
          </div>
          <ul className="mt-10 grid gap-8 md:grid-cols-2">
            {more.map((m) => (
              <li key={m.slug}>
                <Link
                  href={articleHref(locale, m.slug)}
                  className="group border-bone/15 block border-t pt-6"
                >
                  <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
                    {t.tags[m.tag]}
                  </span>
                  <span className="display group-hover:text-mint mt-3 block text-3xl transition-colors">
                    {m.title[locale]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </article>
  );
}
