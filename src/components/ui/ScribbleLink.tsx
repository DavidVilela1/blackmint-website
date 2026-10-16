import Link from 'next/link';
import type { ReactNode } from 'react';
import { Scribble } from '@/components/brand/Scribble';

/** Secondary call to action with a hand-drawn underline. */
export function ScribbleLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`link-scribble ${className}`}>
      {children}
      <span aria-hidden>→</span>
      <Scribble />
    </Link>
  );
}
