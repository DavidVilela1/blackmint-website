'use client';

import { type ReactNode, useRef } from 'react';
import { gsap, useGSAP, MQ } from './gsap';

let hasNavigated = false;

/**
 * Restrained route transition used by app/[locale]/template.tsx.
 * Skipped on the very first load (the hero has its own choreography and we
 * never want to hide server-rendered content before hydration).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!hasNavigated) {
        hasNavigated = true;
        return;
      }
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', clearProps: 'transform,opacity' },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return <div ref={ref}>{children}</div>;
}
