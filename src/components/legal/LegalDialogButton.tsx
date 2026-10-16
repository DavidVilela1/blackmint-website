'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { routeHref } from '@/i18n/routes';
import type { LegalDocKey, LegalLocaleContent } from '@/content/legal/types';
import { Modal } from '@/components/ui/Modal';
import { LegalDocumentBody } from './LegalDocumentBody';

export interface LegalDialogStrings {
  close: string;
  openFullPage: string;
  loading: string;
  draftNotice: string;
}

/**
 * Opens a legal document in an accessible modal without leaving the page
 * (useful from the cookie banner and the contact form, where navigating away
 * would lose context). The document text is code-split and loaded on demand;
 * the dedicated, indexable page remains the canonical version.
 */
export function LegalDialogButton({
  doc,
  locale,
  title,
  strings,
  children,
  className = 'text-link',
}: {
  doc: LegalDocKey;
  locale: Locale;
  title: string;
  strings: LegalDialogStrings;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  // The dialog is mounted (in a portal on <body>) only once first requested:
  // no extra markup on page load, and never nested inside the trigger's <p>.
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState<LegalLocaleContent | null>(null);

  const openDialog = useCallback(async () => {
    setMounted(true);
    setOpen(true);
    if (!content) {
      const mod = await import('@/content/legal');
      setContent(mod.getLegal(locale));
    }
  }, [content, locale]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button type="button" className={className} onClick={openDialog} aria-haspopup="dialog">
        {children}
      </button>
      {mounted
        ? createPortal(
            <Modal
              open={open}
              onClose={close}
              title={title}
              closeLabel={strings.close}
              size="lg"
              footer={
                <Link href={routeHref(locale, doc)} className="link-scribble" onClick={close}>
                  {strings.openFullPage} <span aria-hidden>→</span>
                </Link>
              }
            >
              <p className="border-mint text-muted mb-6 border-l-2 pl-4 text-sm">
                {strings.draftNotice}
              </p>
              {content ? (
                <LegalDocumentBody
                  doc={content.documents[doc]}
                  content={content}
                  locale={locale}
                  headingLevel={3}
                  onNavigate={close}
                />
              ) : (
                <p role="status" className="text-muted">
                  {strings.loading}
                </p>
              )}
            </Modal>,
            document.body,
          )
        : null}
    </>
  );
}
