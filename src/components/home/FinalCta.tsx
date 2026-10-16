import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { routeHref } from '@/i18n/routes';
import type { Dictionary } from '@/i18n/dictionaries';
import { studio } from '@/content/site';
import { Logo } from '@/components/brand/Logo';
import { Doodle } from '@/components/brand/Doodle';
import { Reveal } from '@/components/motion/Reveal';
import { Parallax } from '@/components/motion/Parallax';
import { SplitWords } from '@/components/motion/SplitWords';
import { ScribbleLink } from '@/components/ui/ScribbleLink';

export function FinalCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.final;
  return (
    <section
      aria-labelledby="final-cta"
      className="bg-obsidian relative overflow-hidden py-32 sm:py-44"
    >
      <Parallax
        speed={0.18}
        className="pointer-events-none absolute top-1/2 right-[-10%] w-[70vw] max-w-[44rem] -translate-y-1/2 opacity-[0.09]"
      >
        <Logo variant="symbol" decorative />
      </Parallax>
      <div className="container-bm relative">
        <Doodle name="crown" className="h-12 w-auto -rotate-6 sm:h-16" />
        <Reveal
          as="h2"
          variant="words"
          id="final-cta"
          className="display distress text-bone mt-6 text-[clamp(4rem,15vw,14rem)]"
        >
          <SplitWords text={t.title} />
        </Reveal>
        <Reveal variant="up" className="mt-8 grid gap-10 lg:grid-cols-12">
          <p className="text-bone/85 max-w-xl text-xl leading-relaxed lg:col-span-6">{t.body}</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5 lg:col-span-6 lg:justify-end">
            <Link href={routeHref(locale, 'games')} className="btn-brush">
              {t.ctaGames} <span aria-hidden>→</span>
            </Link>
            <ScribbleLink href={routeHref(locale, 'contact')}>{t.ctaContact}</ScribbleLink>
          </div>
        </Reveal>
        <div className="border-bone/10 mt-16 border-t pt-6">
          {studio.socials.length ? (
            <div>
              <p className="eyebrow mb-3">{t.follow}</p>
              <ul className="flex flex-wrap gap-6">
                {studio.socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      rel="me noopener noreferrer"
                      target="_blank"
                      className="link-scribble"
                    >
                      {s.label}
                      <span className="sr-only"> {dict.a11y.opensNewTab}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-muted font-mono text-xs tracking-[0.12em] uppercase">
              {t.channelsPending}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
