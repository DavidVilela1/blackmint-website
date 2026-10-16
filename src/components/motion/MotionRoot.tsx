'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollTrigger, MQ } from './gsap';

/**
 * Mounted once in the root layout.
 * - Signals the inline bootstrap that GSAP initialised (cancels the failsafe).
 * - Refreshes ScrollTrigger after client-side navigations so no stale
 *   positions survive a route change (component-level triggers are reverted
 *   by useGSAP on unmount).
 * - Reacts live to the OS "reduce motion" setting.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('gsap-ok');
    const mq = window.matchMedia(MQ.reduce);
    const sync = () => root.classList.toggle('motion', !mq.matches);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    // Wait for the new route's layout & images to settle before measuring.
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => {
      window.cancelAnimationFrame(id);
      window.clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
