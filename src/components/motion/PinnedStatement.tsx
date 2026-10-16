'use client';

import { useRef } from 'react';
import { ScrollTrigger, gsap, useGSAP, MQ } from './gsap';

/**
 * Studio statement that "inks in" word by word as you scroll.
 * Desktop: the section pins briefly while the text fills (no scroll
 * hijacking — native scrolling drives the progress).
 * Mobile: same fill without pinning. Reduced motion / no JS: fully legible.
 *
 * Performance: instead of tweening the opacity of ~50 inline spans on every
 * frame (a full text repaint per frame), progress is mapped to a word count
 * and only the words whose state actually changes get a `data-lit` flag;
 * CSS handles the short colour transition.
 */
export function PinnedStatement({ text, label }: { text: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const words = text.split(/\s+/);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const paragraph = el.querySelector<HTMLElement>('[data-ink]');
      const targets = Array.from(el.querySelectorAll<HTMLElement>('[data-w]'));
      if (!paragraph || !targets.length) return;
      let lit = -1;
      const paint = (progress: number) => {
        const next = Math.round(progress * targets.length);
        if (next === lit) return;
        const [from, to] = next > lit ? [Math.max(lit, 0), next] : [next, lit];
        for (let i = from; i < to; i++) targets[i]?.toggleAttribute('data-lit', i < next);
        lit = next;
      };

      const mm = gsap.matchMedia();
      const setup = (vars: ScrollTrigger.Vars) => {
        paragraph.setAttribute('data-ink', 'on');
        const st = ScrollTrigger.create({
          trigger: el,
          ...vars,
          onUpdate: (self) => paint(self.progress),
        });
        paint(st.progress);
        return () => {
          paragraph.setAttribute('data-ink', '');
          targets.forEach((t) => t.removeAttribute('data-lit'));
          lit = -1;
        };
      };
      mm.add(MQ.desktop, () =>
        setup({ start: 'top 18%', end: '+=110%', pin: true, pinSpacing: true }),
      );
      mm.add(MQ.mobile, () => setup({ start: 'top 75%', end: 'bottom 45%' }));
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="py-4">
      <p className="eyebrow mb-8">{label}</p>
      <p
        data-ink=""
        className="font-display text-bone max-w-[22ch] text-[clamp(2.2rem,5.6vw,5.4rem)] leading-[0.98] tracking-[0.005em] uppercase sm:max-w-[26ch]"
      >
        {words.map((w, i) => (
          <span key={i} data-w className="inline">
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>
    </div>
  );
}
