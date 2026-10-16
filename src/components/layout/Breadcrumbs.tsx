import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { href } from '@/i18n/routes';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/** Visible breadcrumb trail; pair with breadcrumbLd() for structured data. */
export function Breadcrumbs({
  locale,
  items,
  label,
}: {
  locale: Locale;
  items: BreadcrumbItem[];
  label: string;
}) {
  return (
    <nav aria-label={label} className="font-mono text-[0.7rem] tracking-[0.16em] uppercase">
      <ol className="text-muted flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-bone">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={href(locale, item.path)}
                    className="hover:text-mint inline-flex min-h-9 items-center transition-colors"
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden className="text-mint">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
