# Asset inventory

Naming convention: `kebab-case`, grouped by purpose (`brand/`, `images/<section>/<slug>/`, `textures/`, `icons/`, `og/`). Game art uses the same name in every slug folder: `cover.jpg` (1200×950), `hero.jpg` and `gallery-0N.jpg` (1600×900).

Origin legend:

- **S:** supplied by the studio (moodboard).
- **D:** derived from supplied artwork (extracted, traced, upscaled).
- **G:** original, generated for this project by `scripts/` (no third-party art).
- **F:** open-licence font.

## Supplied originals (`assets/brand-source/`, not served)

| File                                                                  | Content                                          |
| --------------------------------------------------------------------- | ------------------------------------------------ |
| `01_logo_principal.png` (1254×445)                                    | Primary logo + "Small team. Big worlds." + crown |
| `02_simbolo_mint.png`, `04_simbolo_claro.png`, `05_icone_app.png`     | Emblem variants, app icon                        |
| `03_wordmark_horizontal.png`                                          | Wordmark                                         |
| `06_paleta_cores.png`, `07_tipografia.png`                            | Palette swatches, hand-lettered alphabet         |
| `08_simbolos_graficos.png`                                            | Crown, star, X, controller doodles               |
| `09_slogan.png`                                                       | "Indie games for curious people."                |
| `10_key_art_jogo.png`                                                 | Key art: traveller, moon, castle (with logo)     |
| `11_hoodie.png`, `12_secretaria_e_comando.png`, `13_setup_gaming.png` | Merch and studio photography                     |

## Served assets (`public/`)

| File                                                               | Origin                          | Purpose                                                                                | Action needed                                                 |
| ------------------------------------------------------------------ | ------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `brand/logo-lockup.svg`                                            | D (vector trace of 01)          | Header, footer, menu                                                                   | Replace with master vector if available                       |
| `brand/wordmark.svg`                                               | D                               | Wordmark-only uses                                                                     | ↑                                                             |
| `brand/symbol-mint.svg`, `symbol-offwhite.svg`                     | D                               | Emblem stamps, loading, 404                                                            | ↑                                                             |
| `brand/doodle-{crown,star,x,controller}.png`                       | D (from 08)                     | Decorative margins, bullets, notices                                                   | —                                                             |
| `images/hero/hero-{sky.jpg,far,mid,near}.webp` (2560×1440)         | G                               | Home hero parallax layers (original moon/castle scene in the brand style)              | Optional: replace with real key art layers                    |
| `images/games/hollow-moon/cover.jpg`, `hero.jpg`, `gallery-03.jpg` | D (crops of 10, 2× upscale)     | Placeholder project art                                                                | Replace with real game art                                    |
| `images/games/hollow-moon/gallery-0{1,2}.jpg`                      | G                               | Placeholder                                                                            | ↑                                                             |
| `images/games/mint-static/*`                                       | G                               | Placeholder project art                                                                | ↑                                                             |
| `images/games/paper-kingdom/*`                                     | G (crown from 08)               | Placeholder project art                                                                | ↑                                                             |
| `images/studio/studio-setup.jpg`                                   | D (13, 2× upscale)              | Studio teaser, about, journal                                                          | **Supply higher-resolution original** (source is 460 px wide) |
| `images/studio/desk-notebook.jpg`                                  | D (12, 2×)                      | ↑                                                                                      | ↑                                                             |
| `images/studio/hoodie.jpg`                                         | D (11, 2×)                      | About, journal                                                                         | ↑                                                             |
| `images/studio/key-art-moodboard.jpg`                              | D (10, 2×)                      | Journal article image                                                                  | ↑                                                             |
| `textures/grain.webp`                                              | G                               | Global grain overlay (alpha texture, normal blending — no blend modes for performance) | —                                                             |
| `textures/grain-dark.webp`                                         | G                               | Grain on light “paper” sections                                                        | —                                                             |
| `textures/distress-mask.webp`                                      | G                               | Distressed display type                                                                | —                                                             |
| `textures/brush-mask.webp`                                         | G                               | Primary button brush swatch                                                            | —                                                             |
| `textures/torn-edge.webp`                                          | G                               | Torn-paper section edges                                                               | —                                                             |
| `icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png`      | D (emblem on obsidian, like 05) | PWA manifest                                                                           | —                                                             |
| `og/og-default-en.jpg`, `og-default-pt-pt.jpg`                     | D + G                           | Default social share images                                                            | Regenerate if the slogan changes                              |
| `src/app/favicon.ico`, `icon.png`, `apple-icon.png`                | D                               | Favicons                                                                               | —                                                             |

## Kit and source (`assets/`, not served)

- `assets/brand-kit/`:
  - transparent PNG lockup and wordmark
  - obsidian (for light backgrounds) and off-white variants
  - single-colour masks
  - the "Small team. Big worlds." and "Indie games for curious people." lettering
- `assets/art/hero-composite.jpg`: flattened hero scene used by the OG generator.

## Fonts (`src/fonts/`)

| Font                               | Licence     | File                            |
| ---------------------------------- | ----------- | ------------------------------- |
| Anton                              | SIL OFL 1.1 | `anton-400.woff2`               |
| Patrick Hand                       | SIL OFL 1.1 | `patrick-hand-400.woff2`        |
| Archivo (variable, roman + italic) | SIL OFL 1.1 | `archivo-variable*.woff2`       |
| JetBrains Mono (variable)          | SIL OFL 1.1 | `jetbrains-mono-variable.woff2` |

Licence texts sit next to the files. The fonts were obtained from the Fontsource npm packages (latin subset).

## Licensing actions

1. **Studio artwork.** Confirm the studio owns, or has licensed, every image on the supplied moodboard. This covers the key art and the photography (desk, setup, hoodie). If any was AI-generated or stock, verify its terms before public use.
2. **Logo.** The website logo is a trace of the supplied raster. Replace it with the official master files when available.
3. **No remote or hot-linked images are used.** All assets ship inside the project.
