import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import { routeHref } from '@/i18n/routes';
import type { Dictionary } from '@/i18n/dictionaries';
import { Reveal } from '@/components/motion/Reveal';
import { Parallax } from '@/components/motion/Parallax';
import { SplitWords } from '@/components/motion/SplitWords';
import { ScribbleLink } from '@/components/ui/ScribbleLink';
import { Doodle } from '@/components/brand/Doodle';

export function StudioTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.studio;
  return (
    <section
      aria-labelledby="studio-teaser"
      className="bg-charcoal relative overflow-hidden py-28 sm:py-36"
    >
      <div className="container-bm grid gap-16 lg:grid-cols-12 lg:items-center">
        <div className="relative lg:col-span-7">
          <Reveal variant="clip" className="relative aspect-[920/440] overflow-hidden">
            <Parallax speed={0.06} className="absolute inset-[-8%]">
              <Image
                src="/images/studio/studio-setup.jpg"
                alt={t.secondaryImageAlt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </Parallax>
          </Reveal>
          <Reveal
            variant="clip"
            delay={0.25}
            className="border-charcoal relative -mt-16 ml-auto aspect-[920/418] w-[62%] overflow-hidden border-4 sm:-mt-24"
          >
            <Image
              src="/images/studio/desk-notebook.jpg"
              alt={t.imageAlt}
              fill
              sizes="(min-width: 1024px) 36vw, 62vw"
              className="object-cover"
            />
          </Reveal>
          <Doodle
            name="crown"
            className="absolute -top-8 left-4 h-14 w-auto -rotate-12 sm:-left-6"
          />
        </div>
        <div className="lg:col-span-5">
          <Reveal variant="fade">
            <p className="eyebrow">{t.label}</p>
          </Reveal>
          <Reveal
            as="h2"
            variant="words"
            id="studio-teaser"
            className="display distress mt-5 text-[clamp(2.6rem,5.4vw,5rem)]"
          >
            <SplitWords text={t.quote} />
          </Reveal>
          <Reveal variant="up">
            <p className="text-bone/80 mt-8 text-lg leading-relaxed">{t.body}</p>
            <div className="mt-8">
              <ScribbleLink href={routeHref(locale, 'about')}>{t.cta}</ScribbleLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
