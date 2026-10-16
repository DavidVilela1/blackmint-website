'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { gsap, MQ } from '@/components/motion/gsap';
import { Logo } from '@/components/brand/Logo';
import { Doodle } from '@/components/brand/Doodle';
import { NavLink } from './NavLink';
import { LanguageSwitcher } from './LanguageSwitcher';

export interface MenuItem {
  href: string;
  label: string;
}

/**
 * Full-screen mobile navigation on a native modal <dialog>: background is
 * inert, Escape closes, focus returns to the toggle. Links rise in with a
 * short stagger (skipped for reduced motion).
 */
export function MobileMenu({
  locale,
  items,
  strings,
}: {
  locale: Locale;
  items: MenuItem[];
  strings: {
    menu: string;
    close: string;
    openMenu: string;
    closeMenu: string;
    dialog: string;
    language: string;
    languageSwitcher: string;
    currentLanguage: string;
    tagline: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => {
      setOpen(false);
      document.documentElement.style.overflow = '';
      toggleRef.current?.focus();
    };
    d.addEventListener('close', onClose);
    return () => d.removeEventListener('close', onClose);
  }, []);

  // Close when the route changes (a link was followed).
  useEffect(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
  }, [pathname]);

  const openMenu = () => {
    const d = dialogRef.current;
    if (!d) return;
    d.showModal();
    setOpen(true);
    document.documentElement.style.overflow = 'hidden';
    if (window.matchMedia(MQ.motionOk).matches) {
      gsap.fromTo(
        d.querySelectorAll('[data-menu-item]'),
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'power4.out', delay: 0.05 },
      );
      gsap.fromTo(
        d.querySelector('[data-menu-emblem]'),
        { rotate: -8, opacity: 0, scale: 0.9 },
        { rotate: 0, opacity: 0.12, scale: 1, duration: 1.2 },
      );
    }
  };

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={openMenu}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={strings.openMenu}
        className="group inline-flex min-h-11 items-center gap-3 px-1 font-mono text-xs tracking-[0.18em] uppercase lg:hidden"
      >
        <span aria-hidden>{strings.menu}</span>
        <span aria-hidden className="flex w-7 flex-col gap-[5px]">
          <span className="bg-bone block h-[2px] w-full -rotate-2 transition-transform group-hover:translate-x-0.5" />
          <span className="bg-mint block h-[2px] w-4/5 rotate-1 transition-transform group-hover:w-full" />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={strings.dialog}
        className="bg-obsidian text-bone backdrop:bg-obsidian m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden p-0"
      >
        <div className="relative flex h-full flex-col overflow-y-auto px-[var(--gutter)] pt-5 pb-8">
          <div
            aria-hidden
            data-menu-emblem
            className="pointer-events-none absolute -right-16 bottom-10 w-[75vw] max-w-md opacity-[0.12]"
          >
            <Logo variant="symbol" decorative />
          </div>
          <div className="flex items-center justify-between">
            <Logo variant="lockup" className="h-10 w-auto" decorative />
            <button
              type="button"
              onClick={close}
              aria-label={strings.closeMenu}
              className="inline-flex min-h-11 items-center gap-3 font-mono text-xs tracking-[0.18em] uppercase"
            >
              <span aria-hidden>{strings.close}</span>
              <Doodle name="x" className="h-6 w-auto" />
            </button>
          </div>

          <nav aria-label={strings.dialog} className="mt-14 flex-1">
            <ol className="space-y-2">
              {items.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <NavLink
                    href={item.href}
                    exact={i === 0}
                    onClick={close}
                    className="group data-[active]:text-mint flex items-baseline gap-4 py-1"
                  >
                    <span data-menu-item className="flex items-baseline gap-4">
                      <span aria-hidden className="text-muted font-mono text-xs">
                        0{i + 1}
                      </span>
                      <span className="display distress group-hover:text-mint text-[clamp(3.25rem,15vw,6rem)] transition-colors">
                        {item.label}
                      </span>
                    </span>
                  </NavLink>
                </li>
              ))}
            </ol>
          </nav>

          <div className="border-bone/15 relative mt-10 flex items-end justify-between gap-6 border-t pt-6">
            <p className="hand text-mint max-w-[12rem] text-xl leading-tight">{strings.tagline}</p>
            <div>
              <p className="eyebrow mb-1">{strings.language}</p>
              <LanguageSwitcher
                locale={locale}
                label={strings.languageSwitcher}
                currentLabel={strings.currentLanguage}
                size="lg"
              />
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
