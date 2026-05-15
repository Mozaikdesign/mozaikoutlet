# Mozaikdesign — Outlet Catalogue

Interactive catalogue for the Mozaik Design Istanbul outlet — 200 ex-display pieces from B&B Italia, Cassina, Maxalto, Flexform, Paola Lenti, Vitra, Knoll and other Italian houses.

## Files

- `index.html` — the interactive web catalogue (open in any browser)
- `Mozaikdesign Outlet Catalogue.html` — self-contained print-ready version (standalone, single file, ~900KB — good for email / sharing)
- `dekupe Catalogue-print.html` — source of the print version (depends on `photos/` and `styles.css`)
- `styles.css` — shared stylesheet
- `components/` — React components for the interactive catalogue
- `data/catalogue.json` — product data (200 items: brand, name, prices, dimensions, photo paths)
- `photos/dekupe/` — cutout (découpé) product photos
- `photos/life/` — lifestyle / in-situ product photos

## Running locally

Just open `index.html` in a browser. No build step. No server needed (unless the browser blocks local `fetch()` for JSON — in which case use any static server, e.g. `python3 -m http.server` in this folder).

## Deploying

This is a static site. Deploy anywhere:
- **GitHub Pages**: Settings → Pages → Source: `main` / root → live at `https://<user>.github.io/outlet-catalogue/`
- **Netlify / Vercel / Cloudflare Pages**: drag-and-drop the folder
- **Any static host**: upload the whole folder as-is

## Printing the catalogue as a PDF

Open `dekupe Catalogue-print.html` (or the bundled standalone version). It auto-triggers the print dialog — choose "Save as PDF".

## Features (interactive version)

- 3 views: Grid, Editorial (magazine-style), List (table)
- Filters: section (Indoor / Outdoor), category, brand/house, minimum-discount slider, search, sort
- Quick-view modal per product: gallery, condition report, pricing breakdown, reserve
- Save list + cart, persists to localStorage
- Tweakable accent color, typography, density, card style (toggle Tweaks in toolbar)

## Data source

Products extracted from the Spring 2026 outlet price list PDF. Prices in EUR, VAT included. All pieces are ex-display — one of each available.
