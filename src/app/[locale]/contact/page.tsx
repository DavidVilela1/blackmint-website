import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { format } from '@/i18n/format';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbLd, graph, webPageLd } from '@/lib/seo/jsonld';
import { isContactConfigured } from '@/lib/contact/delivery';
import { publicContactEmail } from '@/lib/env';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { PageIntro } from '@/components/ui/PageIntro';
import { Notice } from '@/components/ui/Notice';
import { ContactForm } from '@/components/contact/ContactForm';
import { Doodle } from '@/components/brand/Doodle';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getDictionary(locale).meta.pages.contact;
  return buildMetadata({ locale, path: '/contact', title: m.title, description: m.description });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.contact;
  const configured = isContactConfigured();
  const crumbs = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.contact, path: '/contact' },
  ];
  return (
    <>
      <JsonLd
        data={graph(
          webPageLd(
            locale,
            '/contact',
            dict.meta.pages.contact.title,
            dict.meta.pages.contact.description,
          ),
          breadcrumbLd(locale, crumbs),
        )}
      />
      <section className="pt-[calc(var(--header-h)+3rem)] pb-28">
        <div className="container-bm">
          <Breadcrumbs locale={locale} items={crumbs} label={dict.a11y.breadcrumb} />
          <div className="mt-10 grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <PageIntro eyebrow={t.label} title={t.heading} size="lg" />
              <p className="text-bone/85 mt-8 text-lg leading-relaxed">{t.intro}</p>
              {publicContactEmail ? (
                <p className="text-bone/80 mt-6">
                  {format(t.direct, { email: '' })}
                  <a className="text-link" href={`mailto:${publicContactEmail}`}>
                    {publicContactEmail}
                  </a>
                </p>
              ) : null}
              <Doodle name="controller" className="mt-12 hidden h-16 w-auto -rotate-6 lg:block" />
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              {!configured ? (
                <div className="mb-10">
                  <Notice title={t.notConnectedTitle}>{t.notConnectedBody}</Notice>
                </div>
              ) : null}
              <ContactForm
                locale={locale}
                strings={t}
                privacyTitle={dict.meta.pages.privacy.title}
                legal={{
                  close: dict.common.close,
                  openFullPage: dict.legal.openFullPage,
                  loading: dict.common.loading,
                  draftNotice: dict.legal.draftNotice,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
