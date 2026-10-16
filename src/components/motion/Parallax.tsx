'use client';

import { type ReactNode, useRef } from 'react';
import { gsap, useGSAP, MQ } from './gsap';

/**
 * Scroll-linked vertical drift for artwork. Transform-only, scrubbed,
 * disabled for reduced motion and halved on small screens.
 */
export function Parallax({
  children,
  speed = 0.12,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      const run = (amount: number) => {
        gsap.fromTo(
          el,
          { yPercent: -amount * 100 },
          {
            yPercent: amount * 100,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      };
      mm.add(MQ.desktop, () => run(speed));
      mm.add(MQ.mobile, () => run(speed / 2));
      return () => mm.revert();
    },
    { scope: ref, dependencies: [speed] },
  );
  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
