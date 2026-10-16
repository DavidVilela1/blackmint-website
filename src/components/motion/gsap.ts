'use client';

/**
 * Single registration point for GSAP + plugins. Import gsap/ScrollTrigger
 * from here (never directly) so plugins are registered exactly once,
 * including under React Strict Mode and Fast Refresh.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: 'power3.out', duration: 0.9 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Media queries used by gsap.matchMedia() across the motion system. */
export const MQ = {
  motionOk: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)',
  finePointer: '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
} as const;

export { gsap, ScrollTrigger, useGSAP };
