'use client';

import type { Locale } from '@/i18n/config';
import { Doodle } from '@/components/brand/Doodle';
import { LegalDialogButton } from '@/components/legal/LegalDialogButton';
import { useConsent, type ConsentStrings } from './ConsentProvider';

/**
 * Non-blocking consent banner. "Accept all" and "Reject optional" share the
 * exact same visual weight — no dark patterns. It is placed first in the DOM
 * so keyboard and screen-reader users meet it early, but it never steals focus.
 */
export function CookieBanner({
  locale,
  strings,
  onCustomize,
  ssr = false,
}: {
  locale: Locale;
  strings: ConsentStrings;
  onCustomize: () => void;
  /** Pre-hydration copy, revealed by CSS only if no decision cookie exists. */
  ssr?: boolean;
}) {
  const { acceptAll, rejectAll } = useConsent();
  const b = strings.consent.banner;
  const btn =
    'min-h-11 border border-bone/40 px-4 py-2.5 font-mono text-[0.78rem] tracking-[0.12em] uppercase transition-colors hover:border-mint hover:text-mint';
  return (
    <section
      data-consent-banner
      data-ssr={ssr || undefined}
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-body"
      className="border-bone/20 bg-charcoal/[0.98] fixed inset-x-3 bottom-3 z-[80] border p-5 shadow-[0_30px_80px_-10px_rgba(0,0,0,0.85)] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-[30rem] sm:p-6"
    >
      <div className="flex items-start gap-4">
        <Doodle name="x" className="mt-1 hidden h-7 w-auto shrink-0 sm:block" />
        <div>
          <h2 id="cookie-banner-title" className="display text-2xl">
            {b.title}
          </h2>
          <p id="cookie-banner-body" className="text-bone/85 mt-2 text-[0.95rem] leading-relaxed">
            {b.body}{' '}
            <LegalDialogButton
              doc="cookies"
              locale={locale}
              title={strings.linkTitles.cookies}
              strings={strings.legal}
            >
              {b.policy}
            </LegalDialogButton>
          </p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button type="button" className={btn} onClick={acceptAll} data-consent-action="accept">
          {b.acceptAll}
        </button>
        <button type="button" className={btn} onClick={rejectAll} data-consent-action="reject">
          {b.rejectAll}
        </button>
        <button
          type="button"
          className={`${btn} col-span-2 sm:col-span-1`}
          onClick={onCustomize}
          aria-haspopup="dialog"
          data-consent-action="customize"
        >
          {b.customize}
        </button>
      </div>
    </section>
  );
}
