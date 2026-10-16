'use client';

import { type ReactNode, useRef } from 'react';
import { gsap, useGSAP, MQ } from '@/components/motion/gsap';

/**
 * Hero behaviour layer. The entrance choreography is pure CSS (it starts at
 * first paint, so the headline never waits for JavaScript — good for LCP).
 * GSAP adds what CSS cannot: depth-based scroll parallax and a subtle
 * pointer drift on desktop. Everything is reverted on unmount.
 */
export function HeroMotion({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const layers = gsap.utils.toArray<HTMLElement>('[data-depth]', root);
      const content = root.querySelector<HTMLElement>('[data-hero-content]');
      const mm = gsap.matchMedia();

      const scrollParallax = (factor: number) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        });
        layers.forEach((layer) => {
          const depth = Number(layer.dataset.depth ?? 0);
          tl.to(layer, { yPercent: depth * 30 * factor, ease: 'none' }, 0);
        });
        if (content) tl.to(content, { yPercent: -18 * factor, opacity: 0.15, ease: 'none' }, 0);
      };

      mm.add(MQ.desktop, () => scrollParallax(1));
      mm.add(MQ.mobile, () => scrollParallax(0.5));

      mm.add(MQ.finePointer, () => {
        const movers = layers.map((layer) => {
          const depth = Number(layer.dataset.depth ?? 0);
          return {
            depth,
            x: gsap.quickTo(layer, 'x', { duration: 1.2, ease: 'power3.out' }),
          };
        });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          movers.forEach((m) => {
            m.x(-nx * 36 * m.depth);
          });
        };
        root.addEventListener('pointermove', onMove);
        return () => root.removeEventListener('pointermove', onMove);
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className={className} data-hero>
      {children}
    </section>
  );
}
