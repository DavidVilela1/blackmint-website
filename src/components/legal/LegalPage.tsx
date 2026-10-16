import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { routeHref } from '@/i18n/routes';
import { getDictionary } from '@/i18n/dictionaries';
import { formatDate } from '@/i18n/format';
import { getLegal, type LegalDocKey } from '@/content/legal';
import { studio } from '@/content/site';
import { breadcrumbLd, graph, webPageLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Notice } from '@/components/ui/Notice';
import { LegalDocumentBody } from './LegalDocumentBody';

/** Shared template for /privacy, /terms and /cookies (indexable canonical versions). */
export function LegalPage({ locale, doc }: { locale: Locale; doc: LegalDocKey }) {
  const dict = getDictionary(locale);
  const content = getLegal(locale);
  const document = content.documents[doc];
  const page = dict.meta.pages[doc];
  const crumbs = [
    { name: dict.nav.home, path: '' },
    { name: page.title, path: `/${doc}` },
  ];
  const others = (['privacy', 'terms', 'cookies'] as const).filter((d) => d !== doc);
  return (
    <>
      <JsonLd
        data={graph(
          webPageLd(locale, `/${doc}`, page.title, page.description),
          breadcrumbLd(locale, crumbs),
        )}
      />
      <section className="pt-[calc(var(--header-h)+3rem)] pb-28">
        <div className="container-bm">
          <Breadcrumbs locale={locale} items={crumbs} label={dict.a11y.breadcrumb} />
          <div className="mt-10 grid gap-14 lg:grid-cols-12">
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <p className="eyebrow hidden lg:flex">{dict.legal.contents}</p>
                <nav aria-label={dict.legal.contents} className="mt-4 hidden lg:block">
                  <ol className="space-y-1 text-sm">
                    {document.sections.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#legal-${s.id}`}
                          className="text-bone/70 hover:text-mint inline-flex min-h-9 items-center transition-colors"
                        >
                          {s.heading}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
                <p className="eyebrow lg:mt-10">{dict.legal.related}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {others.map((o) => (
                    <li key={o}>
                      <Link
                        href={routeHref(locale, o)}
                        className="text-bone/70 hover:text-mint inline-flex min-h-9 items-center"
                      >
                        {dict.meta.pages[o].title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
            <div className="lg:col-span-8 lg:col-start-5">
              <h1 className="display distress text-[clamp(3rem,7vw,6rem)]">{document.title}</h1>
              <p className="text-muted mt-4 font-mono text-xs tracking-[0.14em] uppercase">
                {dict.legal.lastUpdated}:{' '}
                {studio.legal.lastReviewed ? (
                  <time dateTime={studio.legal.lastReviewed}>
                    {formatDate(studio.legal.lastReviewed, locale)}
                  </time>
                ) : (
                  <mark className="legal-placeholder">[{dict.common.toBeConfirmed}]</mark>
                )}
              </p>
              <div className="mt-8">
                <Notice title={dict.legal.draftTitle}>{dict.legal.draftNotice}</Notice>
              </div>
              <div className="mt-10">
                <LegalDocumentBody doc={document} content={content} locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
