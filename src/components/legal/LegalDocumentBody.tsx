import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import { routeHref } from '@/i18n/routes';
import { studio } from '@/content/site';
import type { LegalDocument, LegalLocaleContent, PlaceholderKey } from '@/content/legal/types';
import { CONSENT_MAX_AGE_DAYS, LOCALE_MAX_AGE_DAYS } from '@/lib/consent/config';
import { siteUrl } from '@/lib/env';

/**
 * Renders a legal document. Safe in Server and Client Components (used by the
 * legal pages and lazily by the legal dialog). Unconfirmed values render as
 * highlighted [placeholders] — nothing is invented.
 */
function resolveTokens(
  text: string,
  locale: Locale,
  content: LegalLocaleContent,
  onNavigate?: () => void,
): ReactNode[] {
  const parts = text.split(/(\{\{[\w:]+\}\})/g);
  return parts.map((part, i) => {
    const m = part.match(/^\{\{([\w:]+)\}\}$/);
    if (!m) return <Fragment key={i}>{part}</Fragment>;
    const token = m[1] as string;
    if (token.startsWith('link:')) {
      const key = token.slice(5) as keyof LegalLocaleContent['links'];
      return (
        <Link key={i} href={routeHref(locale, key)} className="text-link" onClick={onNavigate}>
          {content.links[key]}
        </Link>
      );
    }
    if (token === 'siteUrl')
      return <Fragment key={i}>{siteUrl.replace(/^https?:\/\//, '')}</Fragment>;
    if (token === 'consentDays') return <Fragment key={i}>{CONSENT_MAX_AGE_DAYS}</Fragment>;
    if (token === 'localeDays') return <Fragment key={i}>{LOCALE_MAX_AGE_DAYS}</Fragment>;
    const key = token as PlaceholderKey;
    const value = studio.legal[key];
    if (value) return <Fragment key={i}>{value}</Fragment>;
    return (
      <mark key={i} className="legal-placeholder" data-placeholder={key}>
        [{content.placeholders[key] ?? key}]
      </mark>
    );
  });
}

export function LegalDocumentBody({
  doc,
  content,
  locale,
  headingLevel = 2,
  onNavigate,
}: {
  doc: LegalDocument;
  content: LegalLocaleContent;
  locale: Locale;
  headingLevel?: 2 | 3;
  onNavigate?: () => void;
}) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  const t = (s: string) => resolveTokens(s, locale, content, onNavigate);
  return (
    <div className="prose-bm max-w-none">
      <p className="text-bone text-lg">{t(doc.intro)}</p>
      {doc.sections.map((section) => (
        <section key={section.id} aria-labelledby={`legal-${section.id}`}>
          <H id={`legal-${section.id}`} className="!mt-10 scroll-mt-28">
            {section.heading}
          </H>
          {section.blocks.map((block, bi) => {
            if (block.type === 'p')
              return (
                <p key={bi} className="mt-4">
                  {t(block.text)}
                </p>
              );
            if (block.type === 'list')
              return (
                <ul key={bi} className="mt-4">
                  {block.items.map((item, ii) => (
                    <li key={ii}>{t(item)}</li>
                  ))}
                </ul>
              );
            return (
              <div
                key={bi}
                className="mt-6 overflow-x-auto"
                tabIndex={0}
                role="region"
                aria-label={block.caption}
              >
                <table className="w-full min-w-[34rem] border-collapse text-left text-[0.95rem]">
                  <caption className="text-muted mb-3 text-left text-sm">{block.caption}</caption>
                  <thead>
                    <tr>
                      {block.head.map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="border-bone/25 text-muted border-b py-2 pr-4 font-mono text-xs tracking-[0.12em] uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri} className="align-top">
                        {row.map((cell, ci) =>
                          ci === 0 ? (
                            <th
                              key={ci}
                              scope="row"
                              className="border-bone/10 text-mint border-b py-3 pr-4 font-mono text-sm font-normal"
                            >
                              {t(cell)}
                            </th>
                          ) : (
                            <td key={ci} className="border-bone/10 border-b py-3 pr-4">
                              {t(cell)}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
