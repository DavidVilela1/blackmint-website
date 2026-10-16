'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { defaultLocale, isLocale } from '@/i18n/config';
import { errorStrings } from '@/i18n/client-strings';

/** Localized error boundary for every page under /[locale]. */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params?.locale) ? params.locale : defaultLocale;
  const t = errorStrings[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section role="alert" className="relative flex min-h-[80svh] items-center pt-[var(--header-h)]">
      <div className="container-bm py-24">
        <p className="eyebrow">500</p>
        <h1 className="display distress mt-6 text-[clamp(3.4rem,11vw,9rem)]">{t.title}</h1>
        <p className="text-bone/80 mt-6 max-w-xl text-xl">{t.body}</p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <button type="button" onClick={() => reset()} className="btn-brush">
            {t.retry}
          </button>
          <Link href={`/${locale}`} className="link-scribble">
            {t.home} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
