import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import { routeHref } from '@/i18n/routes';
import type { Dictionary } from '@/i18n/dictionaries';
import { BrushUnderline } from '@/components/brand/Scribble';
import { Doodle } from '@/components/brand/Doodle';
import { ScribbleLink } from '@/components/ui/ScribbleLink';
import { HeroMotion } from './HeroMotion';
import Link from 'next/link';

/**
 * Home opening. Layered, original moonlit scene (parallax depths) with
 * oversized distressed headline and a hand-lettered annotation.
 * Artwork: /public/images/hero/* — replaceable, see docs/ASSET_INVENTORY.md.
 */
const layers = [
  { src: '/images/hero/hero-sky.jpg', depth: 0.25, priority: true },
  { src: '/images/hero/hero-far.webp', depth: 0.45 },
  { src: '/images/hero/hero-mid.webp', depth: 0.7 },
  { src: '/images/hero/hero-near.webp', depth: 1 },
];

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = dict.home.hero;
  const lineOne = h.titleLineOne.split(' ');
  const lineTwo = h.titleLineTwo.split(' ');
  let wi = 0;
  const word = (w: string) => {
    const i = wi++;
    return (
      <span key={`${w}-${i}`} className="word-mask hero-word" style={{ ['--i' as string]: i }}>
        <span>{w}</span>
      </span>
    );
  };

  return (
    <HeroMotion className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pt-[var(--header-h)]">
      {/* Scene */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {layers.map((l, i) => (
          <div
            key={l.src}
            data-depth={l.depth}
            className="absolute inset-[-4%] will-change-transform"
          >
            <Image
              src={l.src}
              alt=""
              fill
              priority={l.priority}
              loading="eager"
              sizes="108vw"
              quality={75}
              className="hero-layer object-cover object-[62%_50%]"
              style={{ ['--d' as string]: `${i * 0.12}s` }}
            />
          </div>
        ))}
        {/* Entrance "lights up" by fading this shade (opacity is compositor-only). */}
        <div className="hero-shade bg-obsidian absolute inset-0 opacity-0" />
        <div className="from-obsidian via-obsidian/55 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="from-obsidian/85 via-obsidian/30 absolute inset-0 bg-gradient-to-r to-transparent" />
      </div>

      <div data-hero-content className="container-bm relative pb-24 will-change-transform sm:pb-28">
        <p className="eyebrow hero-fade" style={{ ['--d' as string]: '0.1s' }}>
          {h.eyebrow}
        </p>

        <h1 className="display distress text-bone mt-5 text-[clamp(3.6rem,13.5vw,12.5rem)]">
          <span className="sr-only">BlackMint Interactive — </span>
          <span className="block">
            {lineOne.map((w, i) => [word(w), i < lineOne.length - 1 ? ' ' : null])}
          </span>
          <span className="text-bone block">
            {lineTwo.map((w, i) => [word(w), i < lineTwo.length - 1 ? ' ' : null])}
          </span>
        </h1>

        <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-12 lg:items-end">
          <p className="hero-annotation hand text-mint relative inline-block w-fit -rotate-3 text-[clamp(1.6rem,3.2vw,2.6rem)] leading-none lg:col-span-5">
            {h.annotation}
            <BrushUnderline className="hero-underline text-mint/80 absolute -bottom-3 left-0 h-3 w-full" />
            <Doodle
              name="star"
              className="absolute -top-7 -right-10 hidden h-8 w-auto rotate-12 sm:block"
            />
          </p>

          <div
            className="hero-fade lg:col-span-6 lg:col-start-7"
            style={{ ['--d' as string]: '0.75s' }}
          >
            <p className="text-bone/85 max-w-xl text-[1.05rem] leading-relaxed sm:text-lg">
              {h.body}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href={routeHref(locale, 'games')} className="btn-brush">
                {h.primaryCta}
                <span aria-hidden>→</span>
              </Link>
              <ScribbleLink href={routeHref(locale, 'about')}>{h.secondaryCta}</ScribbleLink>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#statement"
        className="hero-fade text-muted absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 font-mono text-[0.65rem] tracking-[0.3em] uppercase sm:flex"
        style={{ ['--d' as string]: '1.2s' }}
      >
        {h.scroll}
        <span aria-hidden className="bg-bone/15 relative block h-10 w-px overflow-hidden">
          <span className="scroll-cue-line bg-mint absolute inset-0" />
        </span>
      </a>
    </HeroMotion>
  );
}
