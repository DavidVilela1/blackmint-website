'use client';

import { type ElementType, type ComponentPropsWithoutRef, type ReactNode, useRef } from 'react';
import { gsap, useGSAP, MQ } from './gsap';

type Variant = 'up' | 'fade' | 'clip' | 'words' | 'stagger';

type RevealProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  delay?: number;
  stagger?: number;
  /** ScrollTrigger start, e.g. 'top 85%'. Use 'load' to play immediately. */
  start?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>;

/**
 * Scroll-triggered entrance. Content is server-rendered and readable without
 * JS; the hidden initial state only applies under `html.motion` (see
 * globals.css). Animations are scoped to this component and reverted on
 * unmount, so route changes never leave stale ScrollTriggers behind.
 *
 *  up      – fade + rise            (data-reveal="up")
 *  fade    – fade only              (data-reveal="fade")
 *  clip    – vertical clip-path wipe, inner <img> settles from 1.12 scale
 *  words   – each .word-mask > span rises (pair with <SplitWords/>)
 *  stagger – direct children rise one after another
 *
 * start="load" plays immediately via CSS keyframes (no JS wait).
 */
export function Reveal<T extends ElementType = 'div'>({
  as,
  variant = 'up',
  delay = 0,
  stagger = 0.08,
  start = 'top 86%',
  children,
  ...rest
}: RevealProps<T>) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement>(null);

  const onLoad = start === 'load';

  useGSAP(
    () => {
      const el = ref.current;
      // On-load entrances are pure CSS (globals.css → [data-load]) so above-the-fold
      // content paints at first render instead of waiting for hydration (LCP).
      if (!el || onLoad) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        const trigger = { trigger: el, start, once: true };
        const base = { delay, scrollTrigger: trigger };
        switch (variant) {
          case 'words':
            gsap.to(el.querySelectorAll('.word-mask > span'), {
              ...base,
              y: 0,
              duration: 1,
              stagger: 0.06,
              ease: 'power4.out',
            });
            break;
          case 'stagger':
            gsap.to(el.children, { ...base, opacity: 1, y: 0, duration: 0.8, stagger });
            break;
          case 'clip': {
            const img = el.querySelector('img');
            const tl = gsap.timeline(base);
            tl.to(el, { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power4.inOut' });
            if (img)
              tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0);
            // Once revealed, drop the clip-path and inline transforms entirely so
            // later hover effects only touch composited transforms.
            tl.eventCallback('onComplete', () => {
              el.setAttribute('data-revealed', '');
              gsap.set(el, { clearProps: 'clipPath' });
              if (img) gsap.set(img, { clearProps: 'transform,scale' });
            });
            break;
          }
          case 'fade':
            gsap.to(el, { ...base, opacity: 1, duration: 1.1 });
            break;
          default:
            gsap.to(el, { ...base, opacity: 1, y: 0 });
        }
      });
      return () => {
        mm.revert();
        el.removeAttribute('data-revealed');
      };
    },
    { scope: ref, dependencies: [variant, delay, stagger, start] },
  );

  const dataAttr = onLoad
    ? {
        'data-load': variant,
        style: { ['--d' as string]: `${delay}s`, ...((rest as { style?: object }).style ?? {}) },
      }
    : variant === 'words'
      ? { 'data-reveal-words': '' }
      : variant === 'stagger'
        ? { 'data-reveal-stagger': '' }
        : { 'data-reveal': variant };

  return (
    <Tag ref={ref} {...rest} {...dataAttr}>
      {children}
    </Tag>
  );
}
