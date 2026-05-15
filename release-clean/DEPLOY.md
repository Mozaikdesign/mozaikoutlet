# Publishing the Outlet Catalogue

## Easiest: Netlify Drop (2 minutes, free)

1. Go to **https://app.netlify.com/drop**
2. Drag this entire project folder into the browser window
3. You'll get a public URL like `mozaik-outlet-xyz.netlify.app` instantly
4. Optional: Sign up for free to rename it (e.g. `mozaikdesign-outlet.netlify.app`) or connect a custom domain

## Alternative: Vercel / Cloudflare Pages

Same drag-and-drop flow. All three are free for static sites.

## Custom domain (e.g. `outlet.mozaikdesign.com`)

After publishing to Netlify/Vercel:
1. In your domain registrar (where mozaikdesign.com is managed), add a CNAME record:
   `outlet` → `your-site.netlify.app`
2. In Netlify → Site settings → Domain management → add `outlet.mozaikdesign.com`
3. SSL is automatic (free, via Let's Encrypt)

## Files that matter
- `index.html` — the main page
- `styles.css`
- `components/` — React code
- `data/catalogue.json` — product database
- `photos/` — all product imagery

The `uploads/` folder (PDFs, raw photos) can be deleted before publishing if you want to shrink the deploy.
