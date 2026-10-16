# QA report

**Date:** 15 October 2026 (v1.0) · **updated 16 October 2026 (v1.1: dependency security + scroll/hover performance)**
**Environment:** Linux container, Node.js 22.22, Next.js 16.4.2, TypeScript 6.0.3, Chromium 141 (Playwright 1.64.1), Lighthouse 12
**Build under test:** production build (`next build` + `next start`) with `NEXT_PUBLIC_SITE_ENV=production` and `NEXT_PUBLIC_SITE_URL=http://localhost:3100`.

Every result below was produced by actually running the tool in this environment. Nothing was deployed, and nothing was submitted to search engines.

## 1. Summary

| Check                                                | Result                                                                                                          |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `npm ci` / dependency install                        | ✅                                                                                                              |
| TypeScript (`next typegen && tsc --noEmit`, strict)  | ✅ 0 errors                                                                                                     |
| ESLint (next core-web-vitals + typescript)           | ✅ 0 errors, 0 warnings                                                                                         |
| Prettier check                                       | ✅ clean                                                                                                        |
| Unit tests (Vitest)                                  | ✅ **45 / 45 passed**                                                                                           |
| Production build                                     | ✅ 38 static pages, proxy, 1 API route                                                                          |
| End-to-end tests (Playwright, desktop + Pixel 7)     | ✅ **68 passed**, 1 skipped (mobile-only test in the desktop project; it runs and passes in the mobile project) |
| axe-core WCAG 2.0/2.1/2.2 A+AA scans (9 page states) | ✅ no serious or critical violations                                                                            |
| Lighthouse                                           | Desktop 97–100 performance, 100 accessibility, 100 best practices, 100 SEO on indexable pages. Mobile: see §4   |
| Clean-room check (unzip → `npm ci` → build)          | ✅ see §6                                                                                                       |
| `npm audit` (all dependencies, incl. dev)            | ✅ **0 vulnerabilities** (v1.1, see §6)                                                                         |
| Scroll & hover smoothness                            | ✅ home page long frames while scrolling 46–52 → 2–4; p95 frame 66 ms → 17 ms (see §9)                          |

## 2. Functional checks (automated unless noted)

| #   | Requirement                                       | How it was verified                                                                                                                                                  | Result               |
| --- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| 1   | Install                                           | `npm ci`                                                                                                                                                             | ✅                   |
| 2   | TypeScript                                        | `npm run typecheck`                                                                                                                                                  | ✅                   |
| 3   | ESLint                                            | `npm run lint`                                                                                                                                                       | ✅                   |
| 4   | Production build                                  | `npm run build`                                                                                                                                                      | ✅                   |
| 5   | Build-breaking issues                             | None outstanding                                                                                                                                                     | ✅                   |
| 6   | Every route in both languages                     | e2e `routes.spec`: 22 page/locale combinations → 200, one `h1`, correct `lang`, canonical, reciprocal hreflang, description, og:image                                | ✅                   |
| 7   | Language switching keeps the page                 | e2e: `/en/games/hollow-moon` → `/pt-pt/games/hollow-moon`, `lang=pt-PT`, PT content                                                                                  | ✅                   |
| 8   | Cookie banner and preferences modal               | e2e `consent.spec`: equal-weight buttons, reject, customise, Escape, focus return                                                                                    | ✅                   |
| 9   | Consent persistence and withdrawal                | e2e: grant Preferences → `bm_consent=p1` + `bm_locale` set; withdraw via footer → `p0` + `bm_locale` deleted; reload keeps the decision                              | ✅                   |
| 10  | Legal links and modals                            | e2e: cookie policy modal from the banner; privacy modal from the contact form keeps form input; footer legal pages are 200                                           | ✅                   |
| 11  | Form validation and errors                        | e2e: localized PT error summary (focused, `role=alert`), inline blur validation, `aria-invalid`, honest "not connected" error; API: 422 / 400 / 403 / honeypot / 405 | ✅                   |
| 12  | Sitemap                                           | e2e + unit: valid `urlset`, 16 URLs, x-default alternates, placeholders excluded, every `<loc>` returns 200                                                          | ✅                   |
| 13  | robots.txt                                        | e2e (production) + unit (staging disallows all)                                                                                                                      | ✅                   |
| 14  | LLM discovery files                               | e2e + unit: `/llms.txt`, `/llms-full.txt` served, placeholders described honestly                                                                                    | ✅                   |
| 15  | Metadata and canonicals                           | e2e: unique title+description across all 22 pages; canonical = self                                                                                                  | ✅                   |
| 16  | JSON-LD                                           | e2e: exactly one block per page, parses, expected `@type`s, no duplicates; unit: no ratings/offers/dates, injection-safe                                             | ✅                   |
| 17  | Internal links and 404                            | e2e: every internal link on 8 pages returns 200; unknown URLs → **HTTP 404** with localized page + noindex                                                           | ✅                   |
| 18  | Reduced motion                                    | e2e: no `motion` class, all reveal targets at opacity 1                                                                                                              | ✅                   |
| 19  | Responsive layouts                                | Manual screenshot review at 390×844 and 1440×900 (home, games, game detail ×2, studio, journal, article, contact, legal, 404, menu, banner, preferences)             | ✅ after fixes below |
| 20  | Browser console                                   | e2e navigation test asserts no page/console errors; screenshot runs logged none                                                                                      | ✅                   |
| 21  | Broken assets and dead controls                   | Link crawl, manifest/icon/OG checks, axe `button-name` / `link-name`                                                                                                 | ✅                   |
| —   | No-JS rendering                                   | e2e with JavaScript disabled: hero and sections visible                                                                                                              | ✅                   |
| —   | No third-party requests or cookies before consent | e2e network + cookie assertion                                                                                                                                       | ✅                   |
| —   | Motion boots and cleans up                        | e2e: `gsap-ok`, clip reveals complete; client nav to Journal leaves 0 pin-spacers; back to Home restores exactly 1                                                   | ✅                   |
| —   | Mobile menu                                       | e2e (Pixel 7): opens as modal dialog, Escape closes, focus returns, link navigates and closes                                                                        | ✅                   |

## 3. Issues found during QA and fixed

1. **Image reveals stayed invisible.** A CSS specificity clash kept `opacity:0` on clip-reveal images. Fixed, and covered by an e2e test.
2. **Unknown URLs returned HTTP 200 (soft 404).** A `loading.tsx` Suspense boundary started streaming before `notFound()`. Removed; real 404s are now asserted in e2e.
3. **Hydration error (React #418).** A `<dialog>` was nested inside `<p>` (the legal modal triggers). Dialogs are now portalled to `<body>` and mounted on demand.
4. **Error summary appeared before submitting.** It now shows only after a submit attempt.
5. **Contact headline was clipped in a narrow column.** Added a smaller `PageIntro` size and made word masks clip only vertically.
6. **Lighthouse flagged low contrast on the statement's dimmed words.** The starting opacity was raised to 0.4 (≥ 3:1 for large text).
7. **The cookie banner was the late LCP element.** It is now server-rendered and revealed pre-paint by CSS; on-load headline reveals are CSS-only. Home mobile LCP dropped from 5.7 s to ~1.8 s in favourable runs.
8. **Texture PNGs (184 KB grain)** converted to WebP; doodles now go through `next/image`.
9. **Distress texture was too heavy on headlines.** Lightened and enlarged.

## 4. Lighthouse (local production server, single run each — v1.1 build)

| Page                    | Device  | Perf | A11y | Best practices | SEO | LCP   | CLS   | TBT    |
| ----------------------- | ------- | ---- | ---- | -------------- | --- | ----- | ----- | ------ |
| `/en`                   | mobile  | 82   | 100  | 100            | 100 | 4.1 s | 0.026 | 240 ms |
| `/en`                   | desktop | 98   | 100  | 100            | 100 | 1.1 s | 0.002 | 20 ms  |
| `/pt-pt`                | mobile  | 78   | 100  | 100            | 100 | 4.9 s | 0     | 160 ms |
| `/pt-pt`                | desktop | 99   | 100  | 100            | 100 | 1.0 s | 0     | 20 ms  |
| `/en/games`             | mobile  | 89   | 100  | 100            | 100 | 3.6 s | 0.026 | 150 ms |
| `/en/games`             | desktop | 99   | 100  | 100            | 100 | 1.0 s | 0     | 0 ms   |
| `/en/games/hollow-moon` | mobile  | 82   | 100  | 100            | 69  | 4.6 s | 0.026 | 110 ms |
| `/en/games/hollow-moon` | desktop | 100  | 100  | 100            | 69  | 0.8 s | 0     | 0 ms   |
| `/pt-pt/about`          | mobile  | 79   | 100  | 100            | 100 | 5.0 s | 0     | 200 ms |
| `/pt-pt/about`          | desktop | 99   | 100  | 100            | 100 | 1.0 s | 0     | 10 ms  |
| `/en/journal`           | mobile  | 82   | 100  | 100            | 100 | 4.6 s | 0.026 | 160 ms |
| `/en/journal`           | desktop | 99   | 100  | 100            | 100 | 1.0 s | 0     | 10 ms  |
| `/en/contact`           | mobile  | 93   | 100  | 100            | 100 | 3.1 s | 0.026 | 100 ms |
| `/en/contact`           | desktop | 100  | 100  | 100            | 100 | 0.7 s | 0     | 20 ms  |
| `/pt-pt/cookies`        | mobile  | 89   | 100  | 100            | 100 | 3.6 s | 0     | 90 ms  |
| `/pt-pt/cookies`        | desktop | 100  | 100  | 100            | 100 | 0.8 s | 0     | 0 ms   |

Notes:

- **SEO 69 on `/en/games/hollow-moon` is intentional.** Placeholder pages carry `noindex` until real content replaces them.
- **Mobile numbers use Lighthouse's simulated slow 4G and 4× CPU throttling on a shared container.** They varied by up to ±15 points between identical runs; `/en` mobile scored 89 in one run and 73 in another. Observed (unthrottled) FCP/LCP was ~0.25–0.5 s.
- **What dominates simulated mobile LCP:**
  - on first visit, the consent banner paragraph
  - otherwise, the first above-the-fold image
  - the cost of React + GSAP JavaScript
- **Ideas if the mobile target must reach ≥ 90 on every page:**
  - serve from a CDN (HTTP/2, Brotli)
  - use a single flattened hero image on small screens instead of 4 layers
  - lazy-load GSAP on routes without motion above the fold
  - shorten the banner copy

## 5. Accessibility notes

- Target: WCAG 2.2 AA.
- **Automated:** axe scans on 8 pages plus the banner state show no serious or critical violations. Lighthouse accessibility scores 100 on all audited pages.
- **Keyboard:**
  - the skip link works
  - all menus and dialogs are operable and close with Escape
  - focus is visible (2 px mint outline) and returns to the trigger
- **Not done (no assistive technology available in this environment):** manual screen-reader testing with NVDA, VoiceOver or TalkBack. Recommended before launch.

## 6. Packaging verification

`blackmint-interactive-website.zip` was created and verified as follows:

- `unzip -t` → _No errors detected_.
- The root folder is `blackmint-interactive-website/`.
- Excluded: `node_modules/`, `.next/`, test outputs, `.env.local` and build info. No secrets are included; only `.env.example` with empty placeholders.
- Extracted into an empty directory, then ran `npm ci` → `npm run typecheck` ✅ → `npm run lint` ✅ → `npm run test` (45/45) ✅ → `npm run build` (38 static pages) ✅.
- `npm run start` in the extracted copy:

  | URL                                        | Response    |
  | ------------------------------------------ | ----------- |
  | `/`                                        | 307 → `/en` |
  | `/en`                                      | 200         |
  | `/pt-pt/games/paper-kingdom`               | 200         |
  | `/en/nope`                                 | 404         |
  | `/sitemap.xml`, `/robots.txt`, `/llms.txt` | 200         |

  `robots.txt` correctly disallowed all crawling because no production env was set.

### Dependency audit (v1.1)

`npm audit` → **found 0 vulnerabilities**, for runtime _and_ development dependencies. The CI's `npm audit --audit-level=high` step now passes.

**What CI flagged in v1.0:** 5 _high_ findings. They were one chain, not outdated frameworks:

```
eslint-config-next → @next/eslint-plugin-next → fast-glob@3.3.1 → micromatch@4.0.8 → braces@3.0.3
```

The root advisory is [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) (_braces_ stack-exhaustion DoS, affects ≤ 3.0.3). **No patched `braces` release exists**, and even the newest Next.js lint plugin (16.4.2, published 15 Oct 2026) still pins `fast-glob@3.3.1`. So upgrading alone cannot clear it.

**Fix:**

1. The plugin only calls `fast-glob.globSync` to expand a monorepo `settings.next.rootDir`, which this project doesn't set.
2. `package.json` now overrides `fast-glob` with a ~30-line local shim (`tooling/fast-glob-shim/`) built on Node's built-in `fs.globSync`. It was tested to return the same directories for a sample `rootDir` glob.
3. The vulnerable packages are no longer installed (`npm ls micromatch braces` → empty).
4. Remove the override when Next.js ships a plugin without the chain.

**Also upgraded:**

| Package                      | Before | After                 |
| ---------------------------- | ------ | --------------------- |
| `next`, `eslint-config-next` | 16.4.1 | 16.4.2 (latest patch) |
| `typescript`                 | 5.9.3  | 6.0.3                 |
| `@playwright/test`           | 1.56.1 | 1.64.1                |
| `@types/node`                | 22     | 24                    |
| `lucide-react`               | 1.57   | 1.58                  |
| `vitest`                     | 3      | 5 (earlier)           |

Node is now `>= 22.12` (`.nvmrc` → 24 LTS).

**Still on ESLint 9.39.5 (latest 9.x), deliberately:** ESLint 10's peer ranges are not yet accepted by `eslint-plugin-react`, `jsx-a11y` or `import` (all bundled by `eslint-config-next`). Forcing it would break `npm ci` in CI with peer conflicts.

## 7. Known limitations

| Area    | Limitation                                                                                                |
| ------- | --------------------------------------------------------------------------------------------------------- |
| Content | Games and journal entries are labelled placeholders/samples; studio facts, team and socials are unset     |
| Legal   | Drafts with placeholders; require professional review                                                     |
| Contact | No mailbox configured (form reports this honestly); in-memory rate limiter is per instance                |
| Imagery | Moodboard photos are 380–460 px originals upscaled ×2; supply higher resolution                           |
| Logo    | Vector trace of a raster; replace with master files if available                                          |
| Testing | Chromium only (no WebKit/Firefox runs); no manual screen-reader pass; Lighthouse is local, not field data |
| CSP     | Uses `'unsafe-inline'` for scripts (static pages; nonce-based CSP would require dynamic rendering)        |

## 8. Recommended launch tasks

1. Fill `src/content/site.ts` (facts, socials, legal identity) and have the legal drafts reviewed.
2. Configure contact delivery (`CONTACT_PROVIDER`) and test a real submission.
3. Replace the placeholder games and sample posts; add higher-resolution photography.
4. Deploy with `NEXT_PUBLIC_SITE_ENV=production` and the real `NEXT_PUBLIC_SITE_URL`; add HSTS at the edge.
5. Submit the sitemap to Google Search Console and Bing Webmaster Tools; validate JSON-LD with the Rich Results Test.
6. Run a manual screen-reader pass and a Safari/Firefox smoke test.

## 9. Scroll & hover performance (v1.1)

**Problem reported:** scrolling felt heavy, the navbar flickered, and hover animations weren't fluid.

**Method:** a scripted benchmark in Chromium.

- **Scroll:** a wheel scroll of 210 steps (slow down, back up, fast down) on `/en` at 1440×900. It recorded every animation frame plus a DevTools trace.
- **Toggling suspects:** each suspect was switched off individually to find what actually cost time. The container renders without a GPU, so absolute numbers are pessimistic, but before/after comparisons are valid.
- **Hover:** a cursor sweep across the project list, 3 passes.

**Root causes found:**

| Cause                                                                                         | Effect                                                                                                                                            | Fix                                                                                                                                                         |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero entrance keyframes animated `filter: brightness()` with `fill-mode: both`                | The 4 full-screen parallax layers stayed in an "animated filter" state forever, so every scroll frame re-composited them. **Biggest single cost** | Entrance uses transform only, plus a separate obsidian shade fading `opacity`. All entrances use `fill-mode: backwards`, so no animation effect outlives it |
| Full-viewport grain overlay with `mix-blend-mode: overlay`                                    | The whole page had to be blended under a fixed layer on every frame                                                                               | Static alpha grain texture, normal blending, own compositor layer (`contain: strict`)                                                                       |
| Scroll ticker rows: 3× repeated, huge masked (distress) text                                  | Very large mask layers re-rasterised as they moved                                                                                                | Rows are 2× long and unmasked; they slide as pre-rasterised textures                                                                                        |
| Statement "ink-in" tweened the opacity of ~50 inline words every frame                        | A full paragraph repaint per frame while pinned                                                                                                   | Progress maps to a word count; only words that change get `data-lit` (a short CSS colour transition)                                                        |
| `will-change: transform` on every headline word site-wide                                     | Dozens of permanent GPU layers                                                                                                                    | Removed (animations promote layers only while running); distress mask applied per word                                                                      |
| Header: React state on every scroll frame + toggle logic with a 4 px threshold                | Re-renders while scrolling; trackpad/inertia deltas toggled hide/show back and forth (**the flicker**)                                            | DOM data attributes only when state changes; direction hysteresis (hide after 56 px down, show after 28 px up); backgrounds cross-fade with opacity         |
| Project hover: React state per hover, `clip-path` + `color` transitions on huge masked titles | Re-render of the list, and a big repaint every frame                                                                                              | GSAP drives the preview (transform/opacity only, `quickTo` follow); mint title is a pre-rendered copy whose opacity fades                                   |
| Clip reveals kept an inline `clip-path` after finishing                                       | Image hover-zoom ran under a clip on every frame                                                                                                  | Clip and inline transforms cleared on completion                                                                                                            |
| Primary button hover transitioned `background-color` on a masked brush shape                  | Mask repaint per frame                                                                                                                            | Transform-only transition on a promoted layer                                                                                                               |
| Progress bar wrote `aria-valuenow` every frame                                                | Accessibility-tree churn while scrolling                                                                                                          | Written only when the integer value changes                                                                                                                 |

**Results:** same benchmark, production builds, v1.0 vs v1.1.

| Metric (home `/en`)                                  | v1.0          | v1.1                                |
| ---------------------------------------------------- | ------------- | ----------------------------------- |
| Long frames (> 34 ms) during scroll                  | 46–52         | **2–4**                             |
| 95th-percentile frame time during scroll             | 66 ms         | **17 ms** (≈ 60 fps)                |
| Header state changes in the jittery slow-scroll test | flicker-prone | **exactly 3** (solid → hide → show) |
| Paint time during the hover sweep                    | 164 ms        | **84 ms**                           |
| `/en/games` long frames during scroll                | 0             | 0                                   |

**Guarded by `tests/e2e/performance.spec.ts`:**

- the header doesn't flicker (exact state sequence)
- no large blend-mode layers
- no promoted headline words
- no lingering hero animations or filters
- hovering a project doesn't re-render the list

**Caveat:** the benchmark ran on software rendering in a container. Feel on real hardware should improve at least as much, but re-check on the team's own machines, particularly 4K screens and low-end Android.
