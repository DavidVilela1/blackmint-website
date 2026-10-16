import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { sortedArticles } from '@/content/journal';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbLd, graph, webPageLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { PageIntro } from '@/components/ui/PageIntro';
import { Notice } from '@/components/ui/Notice';
import { ArticleList } from '@/components/journal/ArticleList';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getDictionary(locale).meta.pages.journal;
  return buildMetadata({ locale, path: '/journal', title: m.title, description: m.description });
}

export default async function JournalPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.journal;
  const crumbs = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.journal, path: '/journal' },
  ];
  const list = sortedArticles();
  return (
    <>
      <JsonLd
        data={graph(
          webPageLd(
            locale,
            '/journal',
            dict.meta.pages.journal.title,
            dict.meta.pages.journal.description,
          ),
          breadcrumbLd(locale, crumbs),
        )}
      />
      <section className="pt-[calc(var(--header-h)+3rem)] pb-16">
        <div className="container-bm">
          <Breadcrumbs locale={locale} items={crumbs} label={dict.a11y.breadcrumb} />
          <div className="mt-10">
            <PageIntro eyebrow={t.label} title={t.heading} intro={t.intro} />
          </div>
          {list.some((a) => a.isSample) ? (
            <div className="mt-12 max-w-3xl">
              <Notice>{t.sampleNotice}</Notice>
            </div>
          ) : null}
        </div>
      </section>
      <section aria-label={t.heading} className="pb-28">
        <div className="container-bm">
          {list.length ? (
            <ArticleList
              locale={locale}
              dict={dict}
              articles={list}
              headingLevel={2}
              layout="rows"
              priorityFirst
            />
          ) : (
            <p className="text-muted text-lg">{t.empty}</p>
          )}
        </div>
      </section>
    </>
  );
}
