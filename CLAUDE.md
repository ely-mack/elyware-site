# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

elyware.net: ELYWARE's site for custom AI, marketing and software services, plus the free Video Mixer app and the Stock Bridge for Resolume companion. It is a plain static site with no build step and no framework. Netlify serves `public/` and runs two functions from `netlify/functions/`.

Pages in `public/`:

- `/` home page (services, work, software). Styles: `style.css`, `agency.css`, `newsprint.css`. Scripts: `main.js`, `newsprint.js`, `portfolio.js`, `theme.js`.
- `/video-mixer/` product page with downloads, FAQ and Screenfolk wireless casting.
- `/resolume-stock-bridge/` companion app page.
- `/privacy/`, `/thanks/`, `/games/stick-figure-army/`, `/games/automotown/`, `/404.html`.
- `/analytics/` private dashboard (reads `/api/analytics`).
- `/custom-web-development/` is retired and 301-redirects to `/` (see `netlify.toml`).

Outside `public/` (not deployed):

- `templates/` ELYWARE Kit: reusable sections, starter pages (splash, landing, venue) and a UI ideas log for new builds. Start any new site from here. See `templates/README.md`.
- `prototype/` UI prototypes.

## Deployment

Netlify site `splendorous-chebakia-9e86f4` (id `a874eb4a-f569-4ca5-8a96-ca567ea6f9cc`) builds production automatically from `main`. **A push or merge to `main` is the deploy.** Pull requests get deploy previews.

Do not deploy with `netlify deploy --prod` from a local folder. The next push to `main` overwrites it, and a stale local copy can roll back pages other people changed. If a CLI deploy is ever unavoidable, always pass `--site a874eb4a-f569-4ca5-8a96-ca567ea6f9cc`. A stray parent `.netlify/state.json` in the owner's Dropbox points the CLI at a different site (spotlightgreeley.com).

## Downloads and checksums

Release zips live in `public/downloads/` and are linked from the product pages along with published SHA-256 checksums. On every release, recompute each checksum from the actual file and update every page that shows it (`video-mixer/`, `resolume-stock-bridge/`, `llms.txt`). Keep old versioned zips, since emailed links point at them.

## Analytics

Self-hosted, no Google Analytics. `netlify/functions/telemetry.mjs` counts page views and download clicks into the Netlify Blobs store `elyware-analytics` (`production/daily/YYYY-MM-DD`). `netlify/functions/analytics.mjs` serves `/api/analytics` behind `Authorization: Bearer $ELYWARE_ANALYTICS_KEY`. Adding a page or a download means updating the page map in `public/main.js`, `PAGES`/`DOWNLOADS` in `telemetry.mjs`, and `PAGE_KEYS`/`DOWNLOAD_KEYS` in `analytics.mjs`.

## SEO / AEO

Keep these in sync with page and release changes:

- `public/llms.txt`: machine-readable summary of the services and products.
- `public/robots.txt`: explicitly allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.).
- `public/sitemap.xml`: bump `lastmod` on changed pages.
- JSON-LD on each page (Organization, SoftwareApplication, FAQPage, HowTo).
- IndexNow key file `public/ae4d399badbb99daedb502e86f6e968a.txt`. POST new or changed URLs to `https://api.indexnow.org/IndexNow` with that key.

## Conventions

- Writing style: no em dashes. Short, direct sentences.
- Theme: light and dark via `data-theme` on `<html>` (set early by `theme.js`). Use the CSS custom properties, not hard-coded colors.
- Respect `prefers-reduced-motion`.
- Use root-relative paths (`/images/...`, `/style.css`).

## Known issue: Decap CMS

`public/admin/` hosts a Decap CMS whose `config.yml` still points at root-level `index.html`, `style.css` and `main.js` and an `images` media folder. Those files moved under `public/`, so the CMS no longer edits the live files. Fix the paths or remove the CMS before relying on it.
