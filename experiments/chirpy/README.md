# NuclearSoap / Chirpy edition

An isolated edition at `/chirpy/`. The existing Fuwari edition at `/` is not replaced.

## Theme provenance

- Original theme: https://github.com/cotes2020/jekyll-theme-chirpy
- Demo: https://chirpy.cotes.page/
- Vendored stylesheet: https://chirpy.cotes.page/assets/css/jekyll-theme-chirpy.css
- Demo version at import: **7.6.0**, imported 2026-11-07 (Asia/Shanghai).
- MIT license: `vendor/LICENSE`. The stylesheet also retains its Bootstrap license header.

This edition reuses Chirpy's original compiled stylesheet and its sidebar / topbar / main-column / right-panel HTML structure. It adapts the Jekyll layout to the existing static build; it does not run Jekyll or claim to be an unmodified Jekyll installation. No demo analytics, tracking scripts, service workers, sample posts, or external font dependencies are imported.

## Build

From the repository root, `npm run build` builds both editions. For this edition alone (after Fuwari is built), run `node experiments/chirpy/build.mjs`.

`build.mjs` reads only the audited public HTML from `experiments/fuwari/dist`. It shares the existing homepage picks, public contact information, directory and taxonomy, welcome screen, notebook interaction, formula output, wallpaper, and Swarm animation assets. It never reads the original Obsidian directory or unpublished notes.

New HTML and client assets are written only to `dist/chirpy`. Internal note links are remapped to `/chirpy/`; static shared assets remain at their existing locations. This edition has its own theme preference, canonical links, RSS feed, and `noindex` metadata for comparison without competing with the main edition.

## Verify

`npm --prefix experiments/chirpy run check` validates all local links, note counts, formulas, and verifies the original Fuwari output remains byte-identical outside the new directory.
