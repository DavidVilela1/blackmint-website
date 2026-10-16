'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type Locale, locales, localeMeta } from '@/i18n/config';
import { switchLocalePath } from '@/i18n/routes';
import { useConsent } from '@/components/consent/ConsentProvider';

/**
 * Switches to the equivalent page in the other language (slugs are shared
 * across locales, so every page has a counterpart). The choice is remembered
 * in a cookie only when the visitor allowed Preferences cookies.
 */
export function LanguageSwitcher({
  locale,
  label,
  currentLabel,
  className,
  size = 'sm',
}: {
  locale: Locale;
  label: string;
  currentLabel: string;
  className?: string;
  size?: 'sm' | 'lg';
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const { rememberLocale } = useConsent();
  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-1">
        {locales.map((l, i) => {
          const active = l === locale;
          const meta = localeMeta[l];
          return (
            <li key={l} className="flex items-center gap-1">
              {i > 0 ? (
                <span aria-hidden className="text-bone/30">
                  /
                </span>
              ) : null}
              {active ? (
                <span
                  aria-current="true"
                  className={`text-mint inline-flex min-h-11 min-w-11 items-center justify-center font-mono tracking-[0.14em] ${size === 'lg' ? 'text-lg' : 'text-xs'}`}
                >
                  <abbr title={meta.label} className="no-underline">
                    {meta.short}
                  </abbr>
                  <span className="sr-only"> ({currentLabel})</span>
                </span>
              ) : (
                <Link
                  href={switchLocalePath(pathname, l)}
                  hrefLang={meta.hreflang}
                  lang={meta.htmlLang}
                  onClick={() => rememberLocale(l)}
                  className={`text-bone/70 hover:text-bone inline-flex min-h-11 min-w-11 items-center justify-center font-mono tracking-[0.14em] transition-colors ${size === 'lg' ? 'text-lg' : 'text-xs'}`}
                >
                  <span aria-hidden>{meta.short}</span>
                  <span className="sr-only">{meta.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
