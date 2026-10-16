import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { routeHref } from '@/i18n/routes';
import type { Dictionary } from '@/i18n/dictionaries';
import { Logo } from '@/components/brand/Logo';
import { HeaderShell } from './HeaderShell';
import { NavLink } from './NavLink';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = [
    { href: routeHref(locale, 'games'), label: dict.nav.games },
    { href: routeHref(locale, 'about'), label: dict.nav.about },
    { href: routeHref(locale, 'journal'), label: dict.nav.journal },
    { href: routeHref(locale, 'contact'), label: dict.nav.contact },
  ];
  return (
    <HeaderShell>
      <div className="container-bm flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link
          href={routeHref(locale, 'home')}
          aria-label={dict.a11y.homeLink}
          className="group -ml-1 block p-1"
        >
          <Logo
            variant="lockup"
            className="h-9 w-auto transition-transform duration-500 group-hover:-rotate-1 sm:h-10"
            priority
            decorative
          />
        </Link>

        <nav aria-label={dict.a11y.primaryNav} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item, i) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="group text-bone/80 hover:text-bone data-[active]:text-bone relative inline-flex min-h-11 items-center gap-2 px-4 font-mono text-[0.78rem] tracking-[0.16em] uppercase transition-colors"
                >
                  <span
                    aria-hidden
                    className="text-muted group-hover:text-mint group-data-[active]:text-mint text-[0.65rem] transition-colors"
                  >
                    0{i + 1}
                  </span>
                  {item.label}
                  <span
                    aria-hidden
                    className="bg-mint absolute inset-x-4 bottom-2 h-[2px] origin-left scale-x-0 -rotate-1 transition-transform duration-500 ease-[var(--ease-brush)] group-hover:scale-x-100 group-data-[active]:scale-x-100"
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher
            locale={locale}
            label={dict.a11y.languageSwitcher}
            currentLabel={dict.a11y.currentLanguage}
            className="hidden sm:block"
          />
          <MobileMenu
            locale={locale}
            items={[{ href: routeHref(locale, 'home'), label: dict.nav.home }, ...items]}
            strings={{
              menu: dict.nav.menu,
              close: dict.nav.close,
              openMenu: dict.a11y.openMenu,
              closeMenu: dict.a11y.closeMenu,
              dialog: dict.a11y.menuDialog,
              language: dict.nav.language,
              languageSwitcher: dict.a11y.languageSwitcher,
              currentLanguage: dict.a11y.currentLanguage,
              tagline: dict.footer.tagline,
            }}
          />
        </div>
      </div>
    </HeaderShell>
  );
}
