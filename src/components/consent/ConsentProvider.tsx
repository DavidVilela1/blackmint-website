'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import { type Locale, LOCALE_COOKIE } from '@/i18n/config';
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_DAYS,
  LOCALE_MAX_AGE_DAYS,
  type ConsentState,
  type OptionalCategory,
  categoryCookies,
  optionalCategories,
} from '@/lib/consent/config';
import {
  allDenied,
  allGranted,
  makeConsent,
  parseConsent,
  readCookie,
  serializeConsent,
} from '@/lib/consent/cookie';
import { integrations } from '@/lib/consent/integrations';
import { CookieBanner } from './CookieBanner';
import { CookiePreferences } from './CookiePreferences';
import { ConsentScripts } from './ConsentScripts';
import type { LegalDialogStrings } from '@/components/legal/LegalDialogButton';

export interface ConsentStrings {
  consent: Dictionary['consent'];
  legal: LegalDialogStrings;
  linkTitles: { privacy: string; cookies: string };
}

interface ConsentContextValue {
  /** null until the visitor has decided (or while hydrating). */
  consent: ConsentState | null;
  ready: boolean;
  has: (category: OptionalCategory) => boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (choices: Record<OptionalCategory, boolean>) => void;
  openPreferences: () => void;
  /** Persist the language choice — only if Preferences consent was given. */
  rememberLocale: (locale: Locale) => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used inside <ConsentProvider>');
  return ctx;
}

const secure = () => (window.location.protocol === 'https:' ? '; Secure' : '');

function writeCookie(name: string, value: string, days: number) {
  document.cookie = `${name}=${value}; Max-Age=${days * 86400}; Path=/; SameSite=Lax${secure()}`;
}

/** Remove a cookie on every plausible domain/path variant. */
function deleteCookie(name: string) {
  const host = window.location.hostname;
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];
  for (const d of domains) {
    document.cookie = `${name}=; Max-Age=0; Path=/${d ? `; Domain=${d}` : ''}`;
  }
}

function purgeCategory(category: OptionalCategory) {
  const names = document.cookie.split(';').map((c) => c.trim().split('=')[0] ?? '');
  for (const pattern of categoryCookies[category]) {
    for (const n of names) {
      if (typeof pattern === 'string' ? n === pattern : pattern.test(n)) deleteCookie(n);
    }
  }
}

/* Tiny external store over the consent cookie: the server snapshot is null
   ("not known yet"), so pages stay static and the banner only appears after
   hydration, with no hydration mismatch. */
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const notify = () => listeners.forEach((l) => l());
const getSnapshot = () => readCookie(document.cookie, CONSENT_COOKIE) ?? '';
const getServerSnapshot = () => null;

export function ConsentProvider({
  locale,
  strings,
  children,
}: {
  locale: Locale;
  strings: ConsentStrings;
  children: ReactNode;
}) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = raw !== null;
  const consent = useMemo<ConsentState | null>(() => parseConsent(raw), [raw]);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const latest = useRef<ConsentState | null>(null);
  useEffect(() => {
    latest.current = consent;
  }, [consent]);

  const commit = useCallback(
    (choices: Record<OptionalCategory, boolean>) => {
      const next = makeConsent(choices);
      writeCookie(CONSENT_COOKIE, serializeConsent(next), CONSENT_MAX_AGE_DAYS);
      const before = latest.current;
      let needsReload = false;
      for (const c of optionalCategories) {
        if (!next[c]) {
          purgeCategory(c);
          // A previously granted category may have loaded scripts we cannot unload.
          if (before?.[c] && integrations.some((i) => i.category === c)) needsReload = true;
        }
      }
      if (next.preferences) writeCookie(LOCALE_COOKIE, locale, LOCALE_MAX_AGE_DAYS);
      latest.current = next;
      notify();
      setAnnouncement(strings.consent.preferences.saved);
      if (needsReload) window.location.reload();
    },
    [locale, strings.consent.preferences.saved],
  );

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      ready,
      has: (c) => !!consent?.[c],
      acceptAll: () => commit(allGranted()),
      rejectAll: () => commit(allDenied()),
      save: (choices) => commit(choices),
      openPreferences: () => setPrefsOpen(true),
      rememberLocale: (l) => {
        if (consent?.preferences) writeCookie(LOCALE_COOKIE, l, LOCALE_MAX_AGE_DAYS);
      },
    }),
    [commit, consent, ready],
  );

  return (
    <ConsentContext.Provider value={value}>
      {/* Before hydration the banner is server-rendered and shown by CSS only
          when the head bootstrap found no consent cookie (html.bm-no-consent),
          so it paints immediately without a layout shift or hydration mismatch. */}
      {!ready ? (
        <CookieBanner
          locale={locale}
          strings={strings}
          onCustomize={() => setPrefsOpen(true)}
          ssr
        />
      ) : !consent && !prefsOpen ? (
        <CookieBanner locale={locale} strings={strings} onCustomize={() => setPrefsOpen(true)} />
      ) : null}
      {children}
      <CookiePreferences
        open={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        locale={locale}
        strings={strings}
      />
      <ConsentScripts consent={consent} />
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </ConsentContext.Provider>
  );
}
