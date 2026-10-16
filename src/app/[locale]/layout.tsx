import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import '../globals.css';
import { fontVariables } from '@/lib/fonts';
import { isLocale, locales, localeMeta, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { isIndexable, siteUrl } from '@/lib/env';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ConsentProvider } from '@/components/consent/ConsentProvider';
import { MotionRoot } from '@/components/motion/MotionRoot';
import { ScrollProgress } from '@/components/motion/ScrollProgress';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#090a09',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  // Site-wide defaults only. Every page supplies its own canonical, hreflang,
  // description and Open Graph data through buildMetadata().
  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.defaultTitle, template: dict.meta.titleTemplate },
    description: dict.meta.defaultDescription,
    applicationName: dict.meta.siteName,
    manifest: '/manifest.webmanifest',
    formatDetection: { email: false, telephone: false, address: false },
    robots: isIndexable ? undefined : { index: false, follow: false },
    openGraph: { siteName: dict.meta.siteName, locale: localeMeta[locale].ogLocale },
  };
}

/**
 * Tiny pre-paint bootstrap: flags a missing consent decision (so the
 * server-rendered cookie banner can paint immediately) and enables motion initial states only when JS runs
 * and the visitor has not requested reduced motion. If GSAP fails to boot
 * within 3.5 s, the class is removed so content can never stay hidden.
 */
const motionBootstrap = `(function(){var d=document.documentElement;d.classList.add('js');if(!/(^|;\\s*)bm_consent=/.test(document.cookie))d.classList.add('bm-no-consent');try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion');setTimeout(function(){if(!d.classList.contains('gsap-ok'))d.classList.remove('motion')},3500)}}catch(e){}})();`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  return (
    <html lang={localeMeta[locale].htmlLang} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      </head>
      <body className="bg-obsidian text-bone flex min-h-svh flex-col antialiased">
        <div id="top" />
        <a
          href="#main"
          className="sr-only-focusable bg-mint text-obsidian fixed top-3 left-3 z-[90] px-4 py-3 font-mono text-sm tracking-[0.12em] uppercase"
        >
          {dict.a11y.skipToContent}
        </a>
        <ConsentProvider
          locale={locale}
          strings={{
            consent: dict.consent,
            legal: {
              close: dict.common.close,
              openFullPage: dict.legal.openFullPage,
              loading: dict.common.loading,
              draftNotice: dict.legal.draftNotice,
            },
            linkTitles: {
              privacy: dict.meta.pages.privacy.title,
              cookies: dict.meta.pages.cookies.title,
            },
          }}
        >
          <ScrollProgress label={dict.a11y.scrollProgress} />
          <SiteHeader locale={locale} dict={dict} />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter locale={locale} dict={dict} />
        </ConsentProvider>
        <MotionRoot />
        <div aria-hidden className="grain-overlay" />
      </body>
    </html>
  );
}
