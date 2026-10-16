import type { ReactNode } from 'react';
import { Doodle } from '@/components/brand/Doodle';

/** Honest, highly visible notice for placeholder / sample / unconfigured content. */
export function Notice({
  title,
  children,
  tone = 'night',
}: {
  title?: string;
  children: ReactNode;
  tone?: 'night' | 'paper';
}) {
  return (
    <aside
      className={`relative flex gap-4 border border-dashed p-4 sm:p-5 ${
        tone === 'paper' ? 'border-mint-ink/70 text-ink' : 'border-mint/50 text-bone/85'
      }`}
    >
      <Doodle name="star" className="mt-0.5 h-6 w-auto shrink-0" />
      <div className="text-[0.95rem] leading-relaxed">
        {title ? (
          <p className="mb-1 font-mono text-xs tracking-[0.14em] uppercase">{title}</p>
        ) : null}
        {children}
      </div>
    </aside>
  );
}
