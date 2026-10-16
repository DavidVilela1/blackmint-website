import Link from 'next/link';
import { locale as rootLocale } from 'next/root-params';
import { defaultLocale, isLocale, type Locale } from '@/i18n/config';
import { routeHref } from '@/i18n/routes';
import { getDictionary } from '@/i18n/dictionaries';
import { Logo } from '@/components/brand/Logo';
import { Doodle } from '@/components/brand/Doodle';

/**
 * Localized 404. not-found.js receives no params, so the locale is read with
 * the root-param getter (the root layout lives in app/[locale]).
 */
export default async function NotFound() {
  let raw: string | undefined;
  try {
    raw = await rootLocale();
  } catch {
    raw = undefined;
  }
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getDictionary(locale);
  const t = dict.notFound;
  return (
    <section className="relative flex min-h-[85svh] items-center overflow-hidden pt-[var(--header-h)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 w-[60vw] max-w-xl opacity-[0.07]"
      >
        <Logo variant="symbol-bone" decorative priority />
      </div>
      <div className="container-bm relative py-24">
        <p className="eyebrow">{t.code}</p>
        <h1 className="display distress mt-6 text-[clamp(3.6rem,12vw,10rem)]">{t.title}</h1>
        <p className="text-bone/80 mt-6 max-w-xl text-xl leading-relaxed">{t.body}</p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link href={routeHref(locale, 'home')} className="btn-brush">
            {t.home}
          </Link>
          <Link href={routeHref(locale, 'games')} className="link-scribble">
            {t.games} <span aria-hidden>→</span>
          </Link>
          <Doodle name="x" className="h-10 w-auto" />
        </div>
      </div>
    </section>
  );
}
