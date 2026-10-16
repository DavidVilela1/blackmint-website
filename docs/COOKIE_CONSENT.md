# Cookie consent

## Goals

- Collect no optional cookies before consent.
- Load no third-party scripts at all unless they are configured **and** consented to.
- Make refusing as easy as accepting.
- Let visitors change or withdraw consent at any time.
- Support EU (GDPR + ePrivacy) and Portuguese requirements, subject to legal review.

## What the site actually sets

| Cookie       | Category           | Set when                                                              | Lifetime                          | Content                                |
| ------------ | ------------------ | --------------------------------------------------------------------- | --------------------------------- | -------------------------------------- |
| `bm_consent` | Strictly necessary | The visitor makes a choice                                            | 180 days (`CONSENT_MAX_AGE_DAYS`) | `version\|ISO timestamp\|p0a0m0` flags |
| `bm_locale`  | Preferences        | Only if Preferences is granted: on grant, and when switching language | 365 days (`LOCALE_MAX_AGE_DAYS`)  | `en` or `pt-pt`                        |

Both are first-party, `Path=/`, `SameSite=Lax`, and `Secure` on HTTPS. No analytics, marketing or social cookies exist, and no third-party requests are made (verified by an e2e test).

## Components

| File                                          | Role                                                                                                                                                                  |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/consent/config.ts`                   | Cookie names, version, lifetimes, categories, cookie patterns to purge per category                                                                                   |
| `src/lib/consent/cookie.ts`                   | Serialise, parse (rejects outdated versions), defaults                                                                                                                |
| `src/lib/consent/integrations.ts`             | Registry of consent-gated scripts (**empty**)                                                                                                                         |
| `components/consent/ConsentProvider.tsx`      | State via `useSyncExternalStore` over the cookie (static pages, no hydration mismatch). Exposes `acceptAll`, `rejectAll`, `save`, `openPreferences`, `rememberLocale` |
| `components/consent/CookieBanner.tsx`         | Non-blocking banner; "Accept all" and "Reject optional" share identical styling                                                                                       |
| `components/consent/CookiePreferences.tsx`    | Modal with granular `role="switch"` controls                                                                                                                          |
| `components/consent/CookieSettingsButton.tsx` | Footer "Cookie settings": reopen at any time                                                                                                                          |
| `components/consent/ConsentScripts.tsx`       | Injects registry scripts only for granted categories                                                                                                                  |

### Behaviour

1. **First paint.** An inline head script adds `html.bm-no-consent` when no `bm_consent` cookie exists. The server-rendered banner is then visible immediately: no wait for hydration, no layout shift.
2. **Decision.** Any choice writes `bm_consent`. Granting Preferences also stores the current language.
3. **Withdrawal.** Turning a category off deletes its cookies (`categoryCookies`). If that category had loaded a script, the page reloads so the script is gone.
4. **Re-consent.** Increase `CONSENT_VERSION` whenever the cookie policy changes materially. Old decisions are then ignored and the banner returns.

## Adding an analytics tool later

1. Choose the tool and confirm its legal basis and processor terms.
2. Add its cookies to the cookie table in `src/content/legal/{en,pt-pt}.ts`, and the processor to the privacy policy.
3. Add its cookie names or patterns to `categoryCookies.analytics`.
4. Add an entry to `integrations` with `category: 'analytics'`.
5. Extend `script-src` / `connect-src` in the CSP in `next.config.ts`.
6. Bump `CONSENT_VERSION`.

Consider a cookieless, EU-hosted analytics tool. It may reduce consent needs, but have that assessed legally.

## Accessibility of consent UI

- The banner is a labelled `<section>` placed first in the DOM. It never steals focus.
- Dialogs are native `<dialog>` + `showModal()`:
  - the background is inert
  - Escape closes them
  - focus moves into the dialog and returns to the trigger on close
  - they are named by their visible title
  - the content region scrolls and is focusable
- Switches use `role="switch"` and `aria-checked`, labelled and described by the category text.
- Saving is announced via a polite live region.

Tests: `tests/unit/consent.test.ts` and `tests/e2e/consent.spec.ts`.
