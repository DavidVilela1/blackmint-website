# BlackMint Interactive — official website

> **Small team. Big worlds.** The bilingual (English / European Portuguese) website of BlackMint Interactive, an independent game studio.

This is a production-minded Next.js site. It has a GSAP motion system, consent-gated cookies, technical SEO (sitemap, robots, hreflang, JSON-LD, llms.txt), an accessible contact flow and honest placeholder content wherever studio facts haven't been confirmed yet.

---

## Contents

1. [Project overview](#1-project-overview)
2. [Technology stack](#2-technology-stack)
3. [Requirements](#3-requirements)
4. [Installation](#4-installation)
5. [Development, build & start](#5-development-build--start)
6. [Project structure](#6-project-structure)
7. [Routes & localization](#7-routes--localization)
8. [Editing content](#8-editing-content)
9. [Replacing brand assets](#9-replacing-brand-assets)
10. [Animation architecture](#10-animation-architecture)
11. [SEO implementation](#11-seo-implementation)
12. [Sitemap & robots](#12-sitemap--robots)
13. [LLM discovery files](#13-llm-discovery-files)
14. [Cookie consent architecture](#14-cookie-consent-architecture)
15. [Privacy & legal customization](#15-privacy--legal-customization)
16. [Contact form configuration](#16-contact-form-configuration)
17. [Environment variables](#17-environment-variables)
18. [Testing](#18-testing)
19. [Deployment](#19-deployment)
20. [Troubleshooting](#20-troubleshooting)
21. [Before launch: what still needs you](#21-before-launch-what-still-needs-you)

Further reading in [`docs/`](docs): `BRAND_GUIDELINES.md`, `CONTENT_AND_I18N.md`, `SEO.md`, `COOKIE_CONSENT.md`, `DEPLOYMENT.md`, `ASSET_INVENTORY.md`, `QA_REPORT.md`.

---

## 1. Project overview

The site is designed to feel like stepping into the studio's sketchbook. The supplied branding is the source of truth for every visual decision:

- obsidian backgrounds
- warm off-white
- a single mint accent
- the dry-brush leaf/controller emblem
- hand-lettered annotations
- grain and torn paper

The pages are:

- **Home:** a layered parallax moonlit scene with an oversized distressed headline, then a scroll-linked slogan band and a studio statement that "inks in" word by word. After that come the project index with floating previews, the studio teaser, a journal on torn paper and a final "Better worlds?" call to action.
- **Games:** an index page and a detail template with hero art, overview, world, gameplay, gallery lightbox, metadata and related projects.
- **Studio:** identity, a facts panel (shown as "to be confirmed" until filled), working approach and beliefs.
- **Journal:** an index and an article template.
- **Contact:** a validated form with server-side validation, spam mitigation and pluggable delivery.
- **Legal:** privacy, terms and cookies, as indexable pages and in-place modals.
- **404 pages:** localized, returning a real HTTP 404.

> **Honesty by design.** No awards, games, dates, people, emails or social profiles have been invented.
>
> - The three projects (Hollow Moon, Mint Static, Paper Kingdom) are **clearly labelled concept placeholders**.
> - Journal entries are **labelled samples**.
> - Both are `noindex` and excluded from the sitemap until you replace them.
> - The contact form says plainly when it isn't connected to a mailbox.

## 2. Technology stack

| Concern   | Choice                                                                                                     |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| Framework | **Next.js 16.4.2** (App Router, `proxy.ts`, static generation)                                             |
| UI        | **React 19.3**, **TypeScript 6.0** (`strict`, `noUncheckedIndexedAccess`)                                  |
| Styling   | **Tailwind CSS 4.3** with design tokens in `@theme` (`src/app/globals.css`)                                |
| Motion    | **GSAP 3.15** + ScrollTrigger + `@gsap/react` (`useGSAP`), plus CSS keyframes for above-the-fold entrances |
| Fonts     | Self-hosted with `next/font/local` (Anton, Patrick Hand, Archivo, JetBrains Mono; all SIL OFL)             |
| Images    | `next/image` (WebP, responsive `srcset`)                                                                   |
| Icons     | `lucide-react` (only close/chevron; the brand doodles do the rest)                                         |
| Quality   | ESLint 9.39 (`eslint-config-next` 16.4.2 core-web-vitals + TypeScript), Prettier 3                         |
| Tests     | Vitest 5 (unit), Playwright 1.64 + axe-core (end-to-end, accessibility, performance guards)                |

Runtime dependencies are kept to `next`, `react`, `react-dom`, `gsap`, `@gsap/react`, `lucide-react` and `server-only`.

## 3. Requirements

- **Node.js ≥ 22.12** (Node 24 LTS recommended; see `.nvmrc`)
- npm 10+
- For end-to-end tests only: a Chromium for Playwright (`npx playwright install chromium`)
- For regenerating artwork only (optional): Python 3.10+ with `numpy` and `Pillow`

## 4. Installation

```bash
unzip blackmint-interactive-website.zip
cd blackmint-interactive-website
npm ci                        # installs the exact versions from package-lock.json
cp .env.example .env.local    # then edit values (see §17)
```

## 5. Development, build & start

```bash
npm run dev          # http://localhost:3000 (redirects to /en or /pt-pt)
npm run typecheck    # next typegen + tsc --noEmit
npm run lint         # ESLint
npm run test         # Vitest unit tests
npm run build        # production build (static pages + proxy + API route)
npm run start        # serve the production build on :3000
npm run test:e2e     # Playwright (run `npm run build` first)
npm run check        # typecheck + lint + unit tests + build
```

`NEXT_PUBLIC_*` variables are inlined at build time, and pages are statically generated. **Rebuild after changing environment variables.**

## 6. Project structure

```
.
├── assets/                    # NOT served — source & kit files
│   ├── brand-source/          # the supplied moodboard images (originals)
│   ├── brand-kit/             # extra extracted logo variants (PNG/SVG, masks)
│   └── art/                   # hero composite used to render OG images
├── docs/                      # brand, SEO, consent, i18n, deployment, QA, assets
├── public/
│   ├── brand/                 # traced SVG logo + doodles used by the site
│   ├── images/{hero,games,studio}/
│   ├── textures/              # grain, distress & brush masks, torn edge
│   ├── icons/  og/
├── scripts/                   # optional asset generators (Python) + brand pipeline
├── src/
│   ├── app/
│   │   ├── [locale]/          # root layout per locale + every page
│   │   │   ├── layout.tsx     # <html lang>, fonts, header/footer, consent, motion
│   │   │   ├── template.tsx   # route transition
│   │   │   ├── page.tsx       # home
│   │   │   ├── games/ about/ journal/ contact/ privacy/ terms/ cookies/
│   │   │   ├── [...rest]/     # unknown paths → localized 404
│   │   │   ├── not-found.tsx  error.tsx
│   │   ├── api/contact/route.ts
│   │   ├── sitemap.ts robots.ts manifest.ts
│   │   ├── llms.txt/route.ts llms-full.txt/route.ts
│   │   ├── global-not-found.tsx globals.css favicon.ico icon.png apple-icon.png
│   ├── components/
│   │   ├── brand/  layout/  ui/  motion/  home/  games/  journal/
│   │   ├── consent/  legal/  contact/  seo/
│   ├── content/               # site.ts (studio facts), games.ts, journal.ts, legal/
│   ├── i18n/                  # config, routes, dictionaries (en, pt-pt), format
│   ├── lib/                   # env, fonts, seo/, consent/, contact/, llms.ts
│   ├── fonts/                 # woff2 + licences
│   └── proxy.ts               # locale negotiation & redirects
├── tests/unit/  tests/e2e/
└── next.config.ts  eslint.config.mjs  playwright.config.ts  vitest.config.mts  tsconfig.json
```

## 7. Routes & localization

| Path                                        | Page                    |
| ------------------------------------------- | ----------------------- |
| `/`                                         | 307 → `/en` or `/pt-pt` |
| `/{locale}`                                 | Home                    |
| `/{locale}/games`                           | Games overview          |
| `/{locale}/games/{slug}`                    | Game detail             |
| `/{locale}/about`                           | Studio                  |
| `/{locale}/journal`                         | Journal                 |
| `/{locale}/journal/{slug}`                  | Article                 |
| `/{locale}/contact`                         | Contact                 |
| `/{locale}/privacy` · `/terms` · `/cookies` | Legal                   |

`{locale}` is `en` or `pt-pt`.

- **Same path segments in both languages.** `/en/games/x` ↔ `/pt-pt/games/x`, so the language switcher always lands on the equivalent page. If a page ever has no translation, `switchLocalePath` falls back to the localized home.
- **Root resolution** happens in `src/proxy.ts`, in this order:
  1. A remembered choice (`bm_locale` cookie, only set with Preferences consent).
  2. `Accept-Language`, where any `pt-*` maps to `pt-pt`.
  3. Otherwise English.

  No IP geolocation is used. `/pt/...`, `/pt-br/...` and upper-case prefixes are normalized.

- **Language markup.** `<html lang>` is `en` or `pt-PT`. Every page emits reciprocal `hreflang` links (`en`, `pt-PT`, `x-default` → English).
- **Typed dictionaries.** `src/i18n/dictionaries/en.ts` defines the type. `pt-pt.ts` must match it exactly, which TypeScript enforces and `tests/unit/i18n.test.ts` checks too (same keys, same token placeholders, no Brazilian vocabulary).

See [`docs/CONTENT_AND_I18N.md`](docs/CONTENT_AND_I18N.md).

## 8. Editing content

| What                                         | Where                                                                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| UI copy, metadata, consent and form messages | `src/i18n/dictionaries/en.ts` and `pt-pt.ts`                                                                                          |
| Studio facts, socials, legal identity        | `src/content/site.ts` (everything is `null` until confirmed; values appear automatically in the UI, JSON-LD, legal docs and llms.txt) |
| Games                                        | `src/content/games.ts`                                                                                                                |
| Journal                                      | `src/content/journal.ts`                                                                                                              |
| Legal drafts                                 | `src/content/legal/en.ts`, `pt-pt.ts`                                                                                                 |

To publish a **real game**:

1. Add an entry with `isPlaceholder: false`.
2. Fill only confirmed data. Leave `genre` and `platforms` as `null` if unknown and they render as "To be confirmed".
3. Put artwork in `public/images/games/<slug>/` (`cover.jpg` 1200×950, `hero.jpg` and `gallery-0N.jpg` 1600×900).

It then appears in the sitemap and as `VideoGame` JSON-LD. Journal entries work the same way with `isSample: false`.

## 9. Replacing brand assets

The website uses the following files:

- `public/brand/logo-lockup.svg`, `wordmark.svg`, `symbol-mint.svg`, `symbol-offwhite.svg`: vector traces of the supplied logo, **not redrawn**.
- `public/brand/doodle-*.png`: the crown, star, X and controller doodles.

When the studio provides master artwork, overwrite these files and **keep the filenames**. If the aspect ratio changes, update the intrinsic sizes in `src/components/brand/Logo.tsx`.

Favicons live in `src/app/` (`favicon.ico`, `icon.png`, `apple-icon.png`) and `public/icons/`. OG images live in `public/og/` (regenerate with `scripts/generate-og-images.py`).

Full inventory and licensing actions: [`docs/ASSET_INVENTORY.md`](docs/ASSET_INVENTORY.md).

## 10. Animation architecture

All motion lives in `src/components/motion/`:

| Piece                | Role                                                                                                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gsap.ts`            | Single registration of `ScrollTrigger` + `useGSAP`, shared `matchMedia` queries                                                                                       |
| `MotionRoot`         | Marks GSAP as booted, refreshes ScrollTrigger after each route change, follows live OS reduced-motion changes                                                         |
| `Reveal`             | Scroll reveals: `up`, `fade`, `clip` (image wipe), `words` (headline), `stagger`. `start="load"` uses pure CSS keyframes so above-the-fold content paints immediately |
| `SplitWords`         | Server-rendered word masks (no DOM splitting; screen-reader friendly)                                                                                                 |
| `Parallax`           | Scrubbed transform drift on artwork (halved on mobile)                                                                                                                |
| `PinnedStatement`    | Statement "inks in" word by word; pinned on desktop, unpinned on mobile                                                                                               |
| `ScrollTicker`       | Slogan band that moves with scroll (never idles)                                                                                                                      |
| `ScrollProgress`     | Mint reading-progress bar                                                                                                                                             |
| `PageTransition`     | Restrained fade/rise on client navigation (skipped on first load)                                                                                                     |
| `HeroMotion`         | Hero depth parallax and pointer drift. Its entrance is CSS-only                                                                                                       |
| `games/ProjectIndex` | Cursor-following project previews (fine pointers ≥1024px only)                                                                                                        |

**Guarantees:**

- Every animation is scoped with `useGSAP({ scope })` and reverted on unmount. Strict Mode double-mounts and route changes leave no stale triggers (covered by an e2e test).
- Only `transform`, `opacity` and `clip-path` are animated. There is no scroll hijacking.
- Hidden initial states apply only under `html.motion`, which an inline pre-paint script sets when JS runs **and** the visitor does not prefer reduced motion. If GSAP fails to boot within 3.5 s the class is removed, so content can never stay invisible. Without JS everything is visible.
- `prefers-reduced-motion: reduce` disables every reveal, parallax, pin and CSS keyframe.

**Scroll & hover performance rules** (each one fixed a measured problem; see `docs/QA_REPORT.md` §9):

- No `mix-blend-mode` on large or fixed layers. The grain overlay is a static alpha texture on its own compositor layer.
- No CSS `filter` in entrance keyframes. Entrance animations use `animation-fill-mode: backwards`, so nothing stays "animating" after they end.
- Never transition `color` or `clip-path` on large or masked elements. Fade a pre-rendered copy's `opacity`, or clear the clip after the reveal.
- No React state on scroll or hover. The header and project previews update the DOM directly (data attributes / GSAP), and only when the state changes.
- Scrubbed effects only move `transform` on promoted layers. The statement's "ink-in" flips one word at a time instead of repainting the paragraph every frame.
- The header hides and shows with direction hysteresis (56 px down / 28 px up), so trackpad and inertia jitter can't make it flicker.
- `tests/e2e/performance.spec.ts` guards all of the above.

## 11. SEO implementation

- `buildMetadata()` (`src/lib/seo/metadata.ts`) gives every page a unique localized title and description, a canonical URL, hreflang alternates, Open Graph and Twitter cards, and robots directives.
- Structured data comes from `src/lib/seo/jsonld.ts`, one `@graph` per page:
  - `Organization` and `WebSite` (home, studio)
  - `WebPage` and `BreadcrumbList`
  - `VideoGame` (genre and platforms only when confirmed)
  - `Article`

  No ratings, offers or release dates are ever emitted.

- Semantic landmarks, a single `h1` per page, descriptive links and localized alt text.
- Non-production deployments are `noindex` everywhere. Placeholder and sample pages are `noindex` until replaced.

Details, plus how to submit to Google Search Console and Bing Webmaster Tools: [`docs/SEO.md`](docs/SEO.md).

## 12. Sitemap & robots

- **`/sitemap.xml`** (`src/app/sitemap.ts`) lists every indexable canonical URL in both locales, each with `en`, `pt-PT` and `x-default` alternates. `lastModified` is set only where a real content date exists. It is generated from the same content source as the pages.
- **`/robots.txt`** (`src/app/robots.ts`):
  - On production (`NEXT_PUBLIC_SITE_ENV=production`) it allows everything except `/api/` and points to the sitemap.
  - On any other environment it disallows all crawling. Those pages are also `noindex`, because robots.txt is not access control.

## 13. LLM discovery files

`/llms.txt` and `/llms-full.txt` are generated from the content source by `src/lib/llms.ts`:

- **`/llms.txt`** is a concise Markdown map of the studio and its key pages in both languages.
- **`/llms-full.txt`** is an expanded summary: studio text, principles, projects and journal, with placeholders labelled as such.

These files follow the community llms.txt proposal. They are **supplementary**, not an SEO standard, and they never contain facts the site doesn't publish.

## 14. Cookie consent architecture

The full write-up is in [`docs/COOKIE_CONSENT.md`](docs/COOKIE_CONSENT.md). In short:

- **Categories:** Strictly necessary (always on), Preferences, Analytics and Marketing. Analytics and Marketing have **no tools installed**, and the UI says so.
- **Banner:** "Accept all" and "Reject optional" are equal in weight, alongside "Customise". It is non-blocking, server-rendered and shown pre-paint only when no decision exists.
- **Preferences dialog:** granular switches. It can be reopened any time from **Cookie settings** in the footer to change or withdraw consent.
- **Storage:** the decision is kept in the first-party `bm_consent` cookie (180 days, versioned). Bumping `CONSENT_VERSION` asks everyone again.
- **Withdrawal:** deletes the category's cookies, and reloads the page if a script of that category had been loaded.
- **Third-party scripts:** only from `src/lib/consent/integrations.ts` (empty), and only after consent.

## 15. Privacy & legal customization

The privacy policy, terms and cookie policy exist in both languages as pages and in-place modals.

> ⚠️ **These are drafts.** They require completion and review by a qualified legal professional before launch. They do not guarantee compliance.

**Unconfirmed values render as highlighted `[placeholders]`.** Fill `studio.legal` in `src/content/site.ts` to replace them everywhere at once. The placeholders cover:

- legal name, address, company number and VAT
- privacy contact
- hosting and email providers
- retention periods
- governing law
- review date

The terms distinguish the website from any game, EULA or platform terms.

## 16. Contact form configuration

`/api/contact` validates on the server and mitigates spam with:

- a honeypot field
- a minimum fill time
- a per-IP rate limit
- a same-origin check
- a size cap

It then delivers through a pluggable provider (`src/lib/contact/delivery.ts`):

| `CONTACT_PROVIDER` | Required variables                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------- |
| `resend`           | `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (verified sender)                  |
| `webhook`          | `CONTACT_WEBHOOK_URL` (https), optional `CONTACT_WEBHOOK_SECRET` (sent as `X-Webhook-Secret`) |
| _(unset)_          | The form shows "not connected yet", and submissions return an honest error                    |

Secrets are server-only; nothing is exposed to the browser. The in-memory rate limiter suits a single Node instance. Use a shared store on serverless or multi-instance hosting (see `docs/DEPLOYMENT.md`).

## 17. Environment variables

| Variable                                         | Scope  | Purpose                                                            |
| ------------------------------------------------ | ------ | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                           | build  | Canonical origin, e.g. `https://www.blackmint.example`             |
| `NEXT_PUBLIC_SITE_ENV`                           | build  | `production` enables indexing; anything else is noindex + disallow |
| `NEXT_PUBLIC_CONTACT_EMAIL`                      | build  | Public address for footer/contact (optional)                       |
| `CONTACT_PROVIDER`                               | server | `resend` · `webhook` · empty                                       |
| `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL`        | server | Resend recipient / verified sender                                 |
| `RESEND_API_KEY`                                 | server | Resend key                                                         |
| `CONTACT_WEBHOOK_URL` / `CONTACT_WEBHOOK_SECRET` | server | Webhook delivery                                                   |
| `INDEX_PLACEHOLDER_CONTENT`                      | build  | `true` to index placeholder or sample entries (not recommended)    |

See `.env.example`. Never commit `.env.local`.

## 18. Testing

```bash
npm run test                                   # 45 unit tests (i18n parity, validation, consent, SEO, llms)
npm run build && npm run test:e2e              # 68 Playwright tests incl. axe WCAG 2.2 AA scans + perf guards
PW_CHROMIUM_PATH=/path/to/chrome npm run test:e2e   # reuse an installed Chromium
```

The e2e server starts on port 3100. For production-accurate SEO assertions, build with `NEXT_PUBLIC_SITE_ENV=production NEXT_PUBLIC_SITE_URL=http://localhost:3100`. Results of the last run are in [`docs/QA_REPORT.md`](docs/QA_REPORT.md).

### Dependency security & CI

- `npm audit` reports **0 vulnerabilities** (runtime and dev).
- `@next/eslint-plugin-next` (latest, 16.4.2) still pins `fast-glob@3.3.1` → `micromatch` → `braces@3.0.3`. That chain is flagged _high_ by [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), and no patched `braces` exists.
- The plugin only uses fast-glob to expand a monorepo `settings.next.rootDir`, which this project does not set. So `package.json` overrides `fast-glob` with a ~30-line local shim (`tooling/fast-glob-shim`) built on Node's `fs.globSync`. Remove the override once Next ships a fixed plugin.
- `.github/workflows/ci.yml` runs on Node 24, in this order: `npm audit --audit-level=high` → typecheck → lint → unit tests → build → Playwright.

## 19. Deployment

Any Node 20+ host works (`npm ci && npm run build && npm run start`), as does Vercel (zero config). Set the environment variables first.

Step-by-step instructions, the domain checklist, CSP notes and search-engine submission are in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## 20. Troubleshooting

| Symptom                                        | Fix                                                                               |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| Every page is `noindex` / robots disallows all | Set `NEXT_PUBLIC_SITE_ENV=production` and **rebuild**                             |
| Canonical URLs show `localhost`                | Set `NEXT_PUBLIC_SITE_URL` and rebuild                                            |
| Contact form says "not connected"              | Configure `CONTACT_PROVIDER` and its variables (server env), then rebuild/restart |
| Cookie banner never reappears                  | Delete the `bm_consent` cookie, or use **Cookie settings** in the footer          |
| Animations don't play                          | Check the OS "reduce motion" setting; the site respects it intentionally          |
| `tsc` complains about route types              | Run `npm run typecheck`, which runs `next typegen` first                          |
| Playwright can't find a browser                | `npx playwright install chromium`, or set `PW_CHROMIUM_PATH`                      |
| Port 3000 in use                               | `npm run start -- -p 3001`                                                        |

## 21. Before launch: what still needs you

**Studio and legal details:**

1. Real studio facts and verified social channels in `src/content/site.ts`.
2. Legal identity, processors and retention periods, plus **legal review** of all three documents.

**Configuration:**

3. Production domain: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_ENV=production`.
4. Contact delivery credentials (Resend or webhook) and, optionally, `NEXT_PUBLIC_CONTACT_EMAIL`.

**Content:**

5. Replace the placeholder games and sample journal entries (or delete them).
6. Higher-resolution originals of the moodboard photos (the supplied ones are ~400–460 px wide).
7. Master vector logo files, if they exist, to replace the traced SVGs.

**After deploying:**

8. Submit the sitemap in Google Search Console and Bing Webmaster Tools.
