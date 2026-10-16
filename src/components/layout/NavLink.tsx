'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** Link that exposes aria-current for the active section. */
export function NavLink({
  href,
  children,
  className,
  exact = false,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  exact?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname() ?? '';
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      data-active={active || undefined}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
