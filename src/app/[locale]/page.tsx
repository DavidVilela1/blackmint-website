import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { buildMetadata } from '@/lib/seo/metadata';
import { graph, organizationLd, websiteLd, webPageLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Hero } from '@/components/home/Hero';
import { Statement } from '@/components/home/Statement';
import { FeaturedGames } from '@/components/home/FeaturedGames';
import { StudioTeaser } from '@/components/home/StudioTeaser';
import { JournalTeaser } from '@/components/home/JournalTeaser';
import { FinalCta } from '@/components/home/FinalCta';
import { ScrollTicker } from '@/components/motion/ScrollTicker';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: '', description: dict.meta.defaultDescription });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <>
      <JsonLd
        data={graph(
          organizationLd(),
          websiteLd(locale),
          webPageLd(locale, '', dict.meta.defaultTitle, dict.meta.defaultDescription),
        )}
      />
      <Hero locale={locale} dict={dict} />
      <ScrollTicker items={dict.home.ticker} />
      <Statement dict={dict} />
      <FeaturedGames locale={locale} dict={dict} />
      <StudioTeaser locale={locale} dict={dict} />
      <JournalTeaser locale={locale} dict={dict} />
      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
