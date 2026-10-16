'use client';

import { Fragment, useRef } from 'react';
import { gsap, useGSAP, MQ } from './gsap';
import { Doodle, type DoodleName } from '@/components/brand/Doodle';

/**
 * Oversized slogan band that slides horizontally *with* the scroll (scrubbed,
 * not a perpetual marquee — nothing animates while the page is idle).
 * Decorative: the slogans also appear as real text elsewhere.
 * Performance: rows are plain (unmasked) text on their own compositor layers,
 * so scrolling only moves pre-rasterised textures.
 */
export function ScrollTicker({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const doodles: DoodleName[] = ['x', 'crown', 'star', 'controller'];

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const rows = el.querySelectorAll<HTMLElement>('[data-row]');
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        rows.forEach((row, i) => {
          gsap.fromTo(
            row,
            { xPercent: i % 2 ? -30 : 0 },
            {
              xPercent: i % 2 ? 0 : -30,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const row = (key: string, outline: boolean) => (
    <div
      key={key}
      data-row
      className="flex w-max items-center gap-8 whitespace-nowrap will-change-transform"
    >
      {[...items, ...items].map((t, i) => (
        <Fragment key={i}>
          <span
            className={`display text-[clamp(3rem,9vw,7.5rem)] ${outline ? 'text-transparent opacity-40 [-webkit-text-stroke:1.5px_var(--color-bone)]' : 'text-bone'}`}
          >
            {t}
          </span>
          <Doodle
            name={doodles[i % doodles.length] ?? 'x'}
            className="h-[clamp(2rem,5vw,3.75rem)] w-auto shrink-0"
          />
        </Fragment>
      ))}
    </div>
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="border-bone/10 bg-obsidian relative overflow-hidden border-y py-6 sm:py-10"
    >
      {row('a', false)}
      <div className="mt-2 sm:mt-4">{row('b', true)}</div>
    </div>
  );
}
