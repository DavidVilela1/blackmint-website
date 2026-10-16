'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { gsap, useGSAP, MQ } from '@/components/motion/gsap';

export interface ProjectRow {
  slug: string;
  href: string;
  title: string;
  tagline: string;
  genre: string;
  status: string;
  isPlaceholder: boolean;
  placeholderLabel: string;
  cover: { src: string; width: number; height: number; alt: string };
}

/**
 * Editorial project index. With a fine pointer (≥1024px), hovering or
 * focusing a row floats its key art beside the cursor; on touch devices and
 * small screens each row shows its art inline instead. Every row is a single,
 * fully descriptive link.
 *
 * Performance notes (hover must stay at 60 fps):
 * - No React state on hover: GSAP drives the preview directly, so hovering
 *   never re-renders the list.
 * - Only transform and opacity are animated (compositor-only). The old
 *   clip-path transition repainted a large image every frame.
 * - The mint title colour is a pre-rendered copy whose opacity fades, instead
 *   of transitioning `color` on huge masked text (a full repaint per frame).
 * - The preview follows the cursor with gsap.quickTo (one tween, reused).
 */
export function ProjectIndex({ rows, viewLabel }: { rows: ProjectRow[]; viewLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const api = useRef<{ show: (i: number | null, el?: HTMLElement | null) => void } | null>(null);

  useGSAP(
    () => {
      const preview = previewRef.current;
      const root = ref.current;
      if (!preview || !root) return;
      const cards = gsap.utils.toArray<HTMLElement>('[data-preview-card]', preview);
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px) and (hover: hover) and (pointer: fine)', () => {
        gsap.set(preview, { xPercent: -50, yPercent: -50 });
        gsap.set(cards, { autoAlpha: 0, scale: 0.86, rotation: 2 });
        const moveX = gsap.quickTo(preview, 'x', { duration: 0.55, ease: 'power3.out' });
        const moveY = gsap.quickTo(preview, 'y', { duration: 0.55, ease: 'power3.out' });
        let current: number | null = null;
        let rect = root.getBoundingClientRect();
        const refreshRect = () => (rect = root.getBoundingClientRect());

        const show = (i: number | null, el?: HTMLElement | null) => {
          if (i === current) return;
          const prev = current !== null ? cards[current] : undefined;
          if (prev) {
            gsap.to(prev, {
              autoAlpha: 0,
              scale: 0.9,
              rotation: 3,
              duration: 0.35,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
          current = i;
          const next = i !== null ? cards[i] : undefined;
          if (next) {
            gsap.to(next, {
              autoAlpha: 1,
              scale: 1,
              rotation: -2,
              duration: 0.55,
              ease: 'power3.out',
              overwrite: 'auto',
            });
            // Keyboard focus: park the preview beside the focused row.
            if (el) {
              refreshRect();
              const b = el.getBoundingClientRect();
              moveX(b.right - rect.left - 260);
              moveY(b.top - rect.top + b.height / 2);
            }
          }
        };
        api.current = { show };

        const onMove = (e: PointerEvent) => {
          moveX(e.clientX - rect.left);
          moveY(e.clientY - rect.top);
        };
        const onEnter = (e: PointerEvent) => {
          refreshRect();
          gsap.set(preview, { x: e.clientX - rect.left, y: e.clientY - rect.top });
        };
        const onLeave = () => show(null);
        root.addEventListener('pointerenter', onEnter);
        root.addEventListener('pointermove', onMove, { passive: true });
        root.addEventListener('pointerleave', onLeave);
        window.addEventListener('scroll', refreshRect, { passive: true });
        window.addEventListener('resize', refreshRect);
        return () => {
          api.current = null;
          root.removeEventListener('pointerenter', onEnter);
          root.removeEventListener('pointermove', onMove);
          root.removeEventListener('pointerleave', onLeave);
          window.removeEventListener('scroll', refreshRect);
          window.removeEventListener('resize', refreshRect);
        };
      });

      mm.add(MQ.motionOk, () => {
        gsap.from(root.querySelectorAll('[data-row]'), {
          yPercent: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.9,
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: root, start: 'top 80%', once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const show = (i: number | null, el?: HTMLElement | null) => api.current?.show(i, el);

  return (
    <div ref={ref} className="relative">
      <ol className="border-bone/15 border-t">
        {rows.map((row, i) => (
          <li key={row.slug} data-row className="border-bone/15 border-b">
            <Link
              href={row.href}
              className="group grid gap-5 py-8 sm:py-10 lg:grid-cols-12 lg:items-center lg:gap-8"
              onPointerEnter={() => show(i)}
              onFocus={(e) => show(i, e.currentTarget)}
              onBlur={() => show(null)}
            >
              <span className="relative block aspect-[4/3] overflow-hidden pointer-fine:lg:hidden">
                <Image
                  src={row.cover.src}
                  alt={row.cover.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-brush)] group-hover:scale-105"
                />
              </span>
              <span aria-hidden className="text-muted font-mono text-xs lg:col-span-1">
                0{i + 1}
              </span>
              <span className="lg:col-span-7">
                <span className="display distress relative block text-[clamp(3rem,8vw,7rem)] transition-transform duration-500 ease-[var(--ease-brush)] will-change-transform group-hover:translate-x-3 group-focus-visible:translate-x-3">
                  <span className="text-bone block">{row.title}</span>
                  <span
                    aria-hidden
                    className="text-mint absolute inset-0 block opacity-0 transition-opacity duration-300 will-change-[opacity] group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    {row.title}
                  </span>
                </span>
                <span className="text-bone/75 mt-3 block max-w-xl">{row.tagline}</span>
              </span>
              <span className="flex flex-wrap items-center gap-3 lg:col-span-4 lg:flex-col lg:items-end lg:text-right">
                <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
                  {row.genre}
                </span>
                {row.isPlaceholder ? (
                  <span className="badge-placeholder">{row.placeholderLabel}</span>
                ) : (
                  <span className="text-mint font-mono text-xs uppercase">{row.status}</span>
                )}
                <span className="link-scribble text-bone/80 group-hover:text-mint mt-1 !py-0">
                  {viewLabel} <span aria-hidden>→</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {/* Floating preview (fine pointers, ≥1024px) — moved and faded by GSAP only. */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-20 hidden aspect-[4/3] w-[22rem] will-change-transform lg:block"
      >
        {rows.map((row) => (
          <div
            key={row.slug}
            data-preview-card
            className="border-bone/20 invisible absolute inset-0 overflow-hidden border opacity-0 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] will-change-transform"
          >
            <Image src={row.cover.src} alt="" fill sizes="22rem" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
