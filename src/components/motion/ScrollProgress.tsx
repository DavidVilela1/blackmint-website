'use client';

import { useRef } from 'react';
import { gsap, useGSAP, MQ } from './gsap';

/** Thin mint reading-progress bar pinned to the top of the viewport. */
export function ScrollProgress({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    let last = -1;
    const mm = gsap.matchMedia();
    mm.add(MQ.motionOk, () => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
            // Only touch the DOM (and the accessibility tree) when the value changes.
            onUpdate: (self) => {
              const v = Math.round(self.progress * 100);
              if (v !== last) {
                last = v;
                el.setAttribute('aria-valuenow', String(v));
              }
            },
          },
        },
      );
    });
    return () => mm.revert();
  });
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="bg-mint pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] origin-left scale-x-0 motion-reduce:hidden"
    />
  );
}
