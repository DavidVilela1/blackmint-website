'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/** Distance (px) the visitor must scroll in one direction before the header reacts. */
const HIDE_AFTER = 56;
const SHOW_AFTER = 28;
/** Never hide while the hero / top of the page is in view. */
const TOP_ZONE = 140;
const SOLID_AFTER = 24;

/**
 * Behaviour wrapper for the site header: transparent over the hero, solid once
 * scrolled, tucked away while scrolling down and revealed when scrolling up.
 *
 * Why it is written this way (it used to flicker):
 * - No React state on scroll: the header DOM is updated through data
 *   attributes, so nothing re-renders while scrolling.
 * - Direction changes use accumulated distance with hysteresis, so tiny
 *   trackpad/inertia deltas (1–4 px) can no longer toggle it back and forth.
 * - Attributes are written only when the state actually changes.
 * - It never hides while it contains keyboard focus or while a menu is open.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    let lastY = window.scrollY;
    let travel = 0; // signed distance accumulated in the current direction
    let hidden = false;
    let solid = false;
    let frame = 0;

    const setHidden = (value: boolean) => {
      if (value === hidden) return;
      hidden = value;
      header.toggleAttribute('data-hidden', value);
    };
    const setSolid = (value: boolean) => {
      if (value === solid) return;
      solid = value;
      header.toggleAttribute('data-solid', value);
    };

    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const dy = y - lastY;
      lastY = y;
      setSolid(y > SOLID_AFTER);

      if (y < TOP_ZONE || header.contains(document.activeElement)) {
        travel = 0;
        setHidden(false);
        return;
      }
      if (dy === 0) return;
      // Reset the accumulator when the direction flips.
      if ((dy > 0 && travel < 0) || (dy < 0 && travel > 0)) travel = 0;
      travel += dy;
      if (travel > HIDE_AFTER) setHidden(true);
      else if (travel < -SHOW_AFTER) setHidden(false);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    // Route change: start visible, sync solid state.
    hidden = true;
    setHidden(false);
    solid = !(window.scrollY > SOLID_AFTER);
    setSolid(window.scrollY > SOLID_AFTER);

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <header
      ref={ref}
      data-site-header
      onFocusCapture={() => ref.current?.removeAttribute('data-hidden')}
      className="group/header fixed inset-x-0 top-0 z-50 translate-y-0 border-b border-transparent transition-transform duration-500 ease-[var(--ease-brush)] will-change-transform data-[hidden]:-translate-y-full"
    >
      {/* Backgrounds are separate layers that cross-fade with opacity
          (compositor-only) instead of animating background-color. */}
      <div
        aria-hidden
        className="from-obsidian/70 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b to-transparent transition-opacity duration-300 group-data-[solid]/header:opacity-0"
      />
      <div
        aria-hidden
        className="bg-obsidian/95 border-bone/10 pointer-events-none absolute inset-0 -z-10 border-b opacity-0 transition-opacity duration-300 group-data-[solid]/header:opacity-100"
      />
      {children}
    </header>
  );
}
