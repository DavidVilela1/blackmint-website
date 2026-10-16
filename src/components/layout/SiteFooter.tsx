import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { routeHref } from '@/i18n/routes';
import type { Dictionary } from '@/i18n/dictionaries';
import { format } from '@/i18n/format';
import { studio } from '@/content/site';
import { publicContactEmail } from '@/lib/env';
import { Logo } from '@/components/brand/Logo';
import { Doodle } from '@/components/brand/Doodle';
import { TornEdge } from '@/components/brand/TornEdge';
import { CookieSettingsButton } from '@/components/consent/CookieSettingsButton';
import { LanguageSwitcher } from './LanguageSwitcher';

const linkCls =
  'inline-flex min-h-11 items-center text-bone/80 transition-colors hover:text-mint sm:min-h-9';

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getUTCFullYear();
  return (
    <footer className="bg-charcoal relative mt-auto pt-24 pb-10" aria-labelledby="footer-title">
      <TornEdge position="top" className="text-obsidian" />
      <div className="container-bm">
        <h2 id="footer-title" className="sr-only">
          {dict.meta.siteName}
        </h2>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo variant="lockup" className="h-14 w-auto sm:h-16" decorative />
            <p className="display distress text-bone mt-8 max-w-sm text-5xl sm:text-6xl">
              {dict.footer.tagline}
            </p>
            <p className="hand text-mint mt-4 flex items-center gap-3 text-2xl">
              {dict.footer.note}
              <Doodle name="crown" className="h-7 w-auto" />
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            <nav aria-label={dict.a11y.footerNav}>
              <h3 className="eyebrow mb-4">{dict.footer.explore}</h3>
              <ul className="space-y-1">
                <li>
                  <Link className={linkCls} href={routeHref(locale, 'home')}>
                    {dict.nav.home}
                  </Link>
                </li>
                <li>
                  <Link className={linkCls} href={routeHref(locale, 'games')}>
                    {dict.nav.games}
                  </Link>
                </li>
                <li>
                  <Link className={linkCls} href={routeHref(locale, 'about')}>
                    {dict.nav.about}
                  </Link>
                </li>
                <li>
                  <Link className={linkCls} href={routeHref(locale, 'journal')}>
                    {dict.nav.journal}
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label={dict.a11y.legalNav}>
              <h3 className="eyebrow mb-4">{dict.footer.legal}</h3>
              <ul className="space-y-1">
                <li>
                  <Link className={linkCls} href={routeHref(locale, 'privacy')}>
                    {dict.meta.pages.privacy.title}
                  </Link>
                </li>
                <li>
                  <Link className={linkCls} href={routeHref(locale, 'terms')}>
                    {dict.meta.pages.terms.title}
                  </Link>
                </li>
                <li>
                  <Link className={linkCls} href={routeHref(locale, 'cookies')}>
                    {dict.meta.pages.cookies.title}
                  </Link>
                </li>
                <li>
                  <CookieSettingsButton
                    label={dict.consent.settings}
                    className={`${linkCls} text-left`}
                  />
                </li>
              </ul>
            </nav>
            <div>
              <h3 className="eyebrow mb-4">{dict.footer.contact}</h3>
              <ul className="space-y-1">
                {publicContactEmail ? (
                  <li>
                    <a className={`${linkCls} break-all`} href={`mailto:${publicContactEmail}`}>
                      {publicContactEmail}
                    </a>
                  </li>
                ) : null}
                <li>
                  <Link className={linkCls} href={routeHref(locale, 'contact')}>
                    {dict.footer.contactForm}
                  </Link>
                </li>
              </ul>
              {studio.socials.length ? (
                <>
                  <h3 className="eyebrow mt-8 mb-4">{dict.footer.follow}</h3>
                  <ul className="space-y-1">
                    {studio.socials.map((s) => (
                      <li key={s.href}>
                        <a
                          className={linkCls}
                          href={s.href}
                          target="_blank"
                          rel="me noopener noreferrer"
                        >
                          {s.label} <span className="sr-only">{dict.a11y.opensNewTab}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
            <div>
              <h3 className="eyebrow mb-3">{dict.footer.language}</h3>
              <LanguageSwitcher
                locale={locale}
                label={dict.a11y.languageSwitcher}
                currentLabel={dict.a11y.currentLanguage}
                size="lg"
              />
            </div>
          </div>
        </div>

        <hr className="rule mt-16" />
        <div className="text-muted mt-6 flex flex-col gap-4 font-mono text-xs tracking-[0.12em] uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>{format(dict.footer.rights, { year })}</p>
          <a
            href="#top"
            className="hover:text-mint inline-flex min-h-11 items-center gap-2 transition-colors"
          >
            {dict.common.backToTop} <span aria-hidden>↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
