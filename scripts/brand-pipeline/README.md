# Brand asset pipeline (reference)

These scripts document exactly how the clean website assets in `public/brand/`
were derived from the supplied moodboard images in `assets/brand-source/`.
They are **not** needed to run the website — the outputs are committed.

| Step | Script | Output |
| --- | --- | --- |
| 1 | `01_extract_raster.py <source_dir> <out_dir>` | Transparent PNGs (logo lockup, wordmark, doodles, slogans) keyed out of the dark background |
| 2 | `02_refine_symbol.py <source_dir> <out_dir>` | Mint / off-white / obsidian emblem PNGs isolated by hue (no stray wordmark pixels) |
| 3 | `03_threshold_for_trace.py <source_dir> <work_dir>` | 4× upscaled binary bitmaps of the emblem, BLACKMINT and INTERACTIVE |
| 4 | `node 04_trace.cjs <bitmap.png> <out.svg>` | Vector traces (requires `npm i potrace@2.1.8` in a scratch folder) |
| 5 | `05_compose_svgs.py <out_dir>` (run inside the work dir) | `logo-lockup.svg`, `wordmark*.svg`, `symbol*.svg` |

The logo was **traced, not redrawn**: proportions and the dry-brush silhouette
come straight from `01_logo_principal.png`. Interior grain is not part of the
vector; the site adds grain globally. When the studio supplies master vector
files, simply replace the SVGs in `public/brand/` (keep the filenames).

Placeholder artwork and textures: `../generate-placeholder-art.py`.
OG images: `../generate-og-images.py`.
