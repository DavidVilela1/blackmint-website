# BlackMint Interactive — web brand guidelines

The supplied branding sheet (`assets/brand-source/`) is the source of truth. This document translates it into rules for the website.

## Personality

- **Independent:** small, DIY and opinionated, never corporate.
- **Atmospheric:** dark, cinematic, quiet. The world matters more than the UI.
- **Tactile:** grain, scratches, dry brush, torn paper, hand lettering.
- **Rebellious, but warm:** short sentences, honest claims, a little humour.

The site should be recognisable as BlackMint even with the logo hidden. The things that make it so are the **mint-on-obsidian contrast**, the **distressed condensed display type**, **hand-written mint annotations** and the **doodles in the margins**.

## Logo

| File                               | Use                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `public/brand/logo-lockup.svg`     | Primary lockup (emblem + BLACKMINT + INTERACTIVE). Header, footer, menu  |
| `public/brand/symbol-mint.svg`     | Emblem alone: big background stamps, loading states                      |
| `public/brand/symbol-offwhite.svg` | Emblem on mint or for low-key watermarks                                 |
| `public/brand/wordmark.svg`        | Wordmark alone                                                           |
| `assets/brand-kit/*`               | Additional variants (obsidian for light backgrounds, masks, raster PNGs) |

Follow these rules:

- **Never redraw, re-letter, stretch, recolour or outline the logo.** The SVGs are vector traces of `01_logo_principal.png`, made to preserve the brush silhouette.
- Minimum height in UI is 36 px for the lockup and 24 px for the emblem. Keep clear space of at least the emblem's d-pad width around it.
- On light ("paper") surfaces use `assets/brand-kit/wordmark-obsidian.svg`.

## Colour tokens

These are defined once in `src/app/globals.css` (`@theme`) and used as Tailwind classes (`bg-obsidian`, `text-mint`, …).

| Token         | Hex       | Use                                                            |
| ------------- | --------- | -------------------------------------------------------------- |
| `obsidian`    | `#090A09` | Page background                                                |
| `charcoal`    | `#151615` | Alternate sections, dialogs, footer                            |
| `ash`         | `#1F201E` | Raised panels                                                  |
| `smoke`       | `#2B2C29` | Hairlines on dark                                              |
| `grey`        | `#777873` | Decorative lines and large text only (fails AA for small text) |
| `muted`       | `#9A9B95` | Secondary text on dark (≥ 6.6:1)                               |
| `bone`        | `#E8E3D8` | Primary text, warm off-white                                   |
| `paper`       | `#DED8CB` | Light "torn page" sections                                     |
| `ink`         | `#2D2E2A` | Secondary text on paper                                        |
| `mint`        | `#5FDEA3` | The one accent: CTAs, annotations, focus rings, active states  |
| `mint-bright` | `#7FF0BB` | Hover on mint surfaces                                         |
| `mint-ink`    | `#146A46` | Mint for text on paper (≥ 5:1)                                 |

How the palette was refined from the brief's provisional values:

- **Mint** moved from the brief's `#42DDA0` to the logo's measured `#5FDEA3`. It was sampled from the 90th-percentile brightness of mint pixels in the logo.
- **Off-white** became `#E8E3D8`, between the brief's value and the sampled one.

**Mint is a light switched on in a dark room.** Use it sparingly: at most one mint CTA per viewport, plus annotations and doodles. No gradients, no neon glow, no purple or blue.

## Typography

| Role             | Family                          | Notes                                                                                                 |
| ---------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Display          | **Anton** (`.display`)          | Uppercase, line-height 0.88. Add `.distress` for the dry-brush mask on large headlines                |
| Hand annotations | **Patrick Hand** (`.hand`)      | Mint, slightly rotated (−1° to −4°). Echoes the sheet's lettering ("Indie games for curious people.") |
| Body             | **Archivo** (variable)          | 16–20 px, line-height 1.6–1.75                                                                        |
| Labels and meta  | **JetBrains Mono** (`.eyebrow`) | Uppercase, 0.14–0.18 em tracking, prefixed with a mint `//` like a dev log                            |

All four are SIL OFL 1.1 (licences in `src/fonts/`) and self-hosted.

## Texture and graphic devices

| Device             | Source                                             | Use                                                                     |
| ------------------ | -------------------------------------------------- | ----------------------------------------------------------------------- |
| Grain              | `textures/grain.webp`                              | Fixed global overlay at 7.5% opacity, never animated                    |
| Distress           | `textures/distress-mask.webp`                      | `.distress` mask on display type: specks and scratches, never illegible |
| Torn edge          | `<TornEdge>`                                       | Transitions between dark and paper sections                             |
| Brush swatch       | `.btn-brush`                                       | Primary CTA; a mint dry-brush mask, not a pill                          |
| Scribble underline | `.link-scribble`                                   | Secondary CTA; redraws on hover                                         |
| Doodles            | `<Doodle name="crown \| star \| x \| controller">` | Margins, list markers, notices. Decorative only                         |

The ✕ list bullet in `.prose-bm` comes from the doodle set.

## Layout

- Asymmetric 12-column editorial grid. Large type is allowed to dominate.
- Prefer borders, hairlines and negative space over rounded cards. **Nothing on the site uses large border radii.**
- Alternate dark sections (`obsidian` / `charcoal`) with occasional `paper` sections for rhythm.
- Gutter: `clamp(1rem, 4vw, 3rem)`. Container max width 96 rem.

## Motion principles

1. **Ink, not glitter.** Reveals wipe, rise or "ink in", like a sketchbook page.
2. **Scroll is the clock.** Parallax, ticker and statement are scrubbed by scroll. Nothing loops while idle except a 3-cycle scroll cue.
3. **Fast in, never in the way.** Entrances take 0.8–1.2 s with `--ease-brush` (`cubic-bezier(.22,1,.36,1)`). Content is never hidden waiting on JS above the fold.
4. **Respect the visitor.** Reduced motion turns everything off. Mobile gets lighter parallax and no pinning.
5. **Cheap to scroll.** Only `transform` and `opacity` move. No blend modes on large layers, and no `filter`, `color` or `clip-path` transitions on big or masked elements. Nothing re-renders React on scroll or hover (README §10).

## Voice

| Do                                     | Don't                                                     |
| -------------------------------------- | --------------------------------------------------------- |
| "Small team. Big worlds."              | "We are a leading provider of interactive entertainment." |
| Concrete, sensory, first person plural | Superlatives, hype, invented stats                        |
| Mark placeholders honestly             | Present concepts as announced games                       |

European Portuguese copy uses EU norms: _equipa_, _ecrã_, _contacto_, _utilizador_, _registo_. Guillemets «…» are used for quotes.
