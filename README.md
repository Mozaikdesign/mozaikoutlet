# Mozaikdesign — Outlet Catalogue

Interactive catalogue for the Mozaik Design Istanbul outlet. Italian and Northern European pieces from B&B Italia, Cassina, Maxalto, Flexform, Paola Lenti, Vitra, Knoll, Driade, Paola C, Roda and others.

Live at **[mozaikoutlet.com](https://mozaikoutlet.com)**.

## Files

```
index.html              Entry point — loads React/Babel + components
styles.css              All styling
components/             React components (loaded as Babel JSX)
  App.jsx               App shell + state + filtering + pagination
  Card.jsx              Product cards (grid / editorial / list)
  Chrome.jsx            Header / hero / brand strip / footer
  Data.jsx              Image helper + EUR formatter
  Filters.jsx           Sidebar filters
  I18n.jsx              EN / TR copy
  Modal.jsx             Product quick-view dialog
data/catalogue.json     All product entries
photos/                 Product imagery
  dekupe/               Cut-out cover photos
  life/                 Lifestyle / in-situ photos
assets/                 Logo & brand assets
CNAME                   Custom domain for GitHub Pages
.nojekyll               Tells GitHub Pages to skip Jekyll processing
```

## Deploying to GitHub Pages

1. **Create a public GitHub repo** (e.g. `mozaikoutlet`).
2. **Upload all files** from this folder to the repo root.
3. **Settings → Pages**: Source = `Deploy from a branch`, Branch = `main`, Folder = `/ (root)` → Save.
4. **Custom domain**: enter `mozaikoutlet.com` on the same Pages page.
5. **DNS** (at your GitHub Domains DNS settings, or wherever the domain is registered): add 4 A-records to:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
   And a `CNAME` for `www` → `<your-username>.github.io`.
6. Wait 5 min–24 h for DNS, then tick **Enforce HTTPS** on the Pages page.

## Editing the catalogue

Product data lives in `data/catalogue.json`. Each entry:

```json
{
  "id": 162,
  "brand": "Roda",
  "name": "Lawrence Stool",
  "section": "OUTDOOR",
  "category": "Stools",
  "qty": 1,
  "listEur": 1572,
  "outletEur": 1100,
  "saleEur": 865,
  "discountPct": 45,
  "dims": "76 x 50cm H:45cm",
  "dekupe": "photos/dekupe/roda-lawrence-stool.webp",
  "lifes": ["photos/life/roda-lawrence-stool-life.webp"]
}
```

Add new photos to `photos/dekupe/` and `photos/life/`. WebP is preferred (smaller); PNG/JPG also work.

## Local preview

It's plain HTML — open `index.html` in any browser. To avoid CORS issues when fetching `catalogue.json` locally, serve via:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then visit `http://localhost:8000`.
