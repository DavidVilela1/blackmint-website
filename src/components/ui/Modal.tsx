'use client';

import { type ReactNode, useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Accessible modal built on the native <dialog> element.
 *
 * - showModal() makes the rest of the page inert (no background interaction)
 *   and gives us top-layer stacking for nested dialogs.
 * - Escape closes (unless `dismissible={false}`), via the native `cancel` event.
 * - Focus moves into the dialog on open and returns to the invoking element on close.
 * - Page scroll is locked while open; the body region scrolls internally.
 * - Accessible name comes from the visible title (aria-labelledby).
 */
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Optional element shown above the title (e.g. an eyebrow). */
  kicker?: ReactNode;
  closeLabel: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'md' | 'lg' | 'full';
  dismissible?: boolean;
  /** CSS selector inside the dialog to receive initial focus. */
  initialFocus?: string;
  className?: string;
  /** Visual tone. */
  tone?: 'night' | 'paper';
}

export function Modal({
  open,
  onClose,
  title,
  kicker,
  closeLabel,
  children,
  footer,
  size = 'md',
  dismissible = true,
  initialFocus,
  className,
  tone = 'night',
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
      const target =
        (initialFocus && dialog.querySelector<HTMLElement>(initialFocus)) ||
        dialog.querySelector<HTMLElement>('[data-autofocus]') ||
        dialog.querySelector<HTMLElement>('[data-modal-close]');
      target?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, initialFocus]);

  // Restore scroll + focus whenever the dialog closes (by any means).
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      if (!document.querySelector('dialog[open]')) document.documentElement.style.overflow = '';
      const el = returnFocus.current;
      if (el && document.contains(el)) el.focus();
      if (open) onClose();
    };
    const handleCancel = (e: Event) => {
      if (!dismissible) e.preventDefault();
    };
    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose, open, dismissible]);

  // Safety: unlock scroll if unmounted while open.
  useEffect(
    () => () => {
      if (!document.querySelector('dialog[open]')) document.documentElement.style.overflow = '';
    },
    [],
  );

  const widths = { md: 'max-w-xl', lg: 'max-w-3xl', full: 'max-w-none w-full h-full max-h-none' };
  const surface = tone === 'paper' ? 'bg-paper text-obsidian' : 'bg-charcoal text-bone';

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      data-surface={tone === 'paper' ? 'paper' : undefined}
      className={`m-auto w-[calc(100%-2rem)] ${widths[size]} border-bone/15 backdrop:bg-obsidian/80 max-h-[min(90svh,52rem)] overflow-hidden border p-0 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] backdrop:backdrop-grayscale open:flex open:flex-col ${surface} ${className ?? ''}`}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself, outside content) closes.
        if (dismissible && e.target === e.currentTarget) ref.current?.close();
      }}
    >
      <div className="flex items-start justify-between gap-6 border-b border-current/10 px-5 pt-5 pb-4 sm:px-8 sm:pt-7">
        <div>
          {kicker}
          <h2 id={titleId} className="display mt-1 text-3xl sm:text-4xl">
            {title}
          </h2>
        </div>
        {dismissible ? (
          <button
            type="button"
            data-modal-close
            onClick={() => ref.current?.close()}
            className="hover:text-mint -mr-2 inline-flex size-11 shrink-0 items-center justify-center text-current transition-colors"
            aria-label={closeLabel}
          >
            <X aria-hidden className="size-6" strokeWidth={1.75} />
          </button>
        ) : null}
      </div>
      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8"
        tabIndex={0}
        role="region"
        aria-labelledby={titleId}
      >
        {children}
      </div>
      {footer ? <div className="border-t border-current/10 px-5 py-4 sm:px-8">{footer}</div> : null}
    </dialog>
  );
}
