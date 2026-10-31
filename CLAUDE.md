# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

elyware.net: ELYWARE's studio showcase (browser games, the free Video Mixer and Stock Bridge for Resolume apps, and 28 web projects), with custom AI, marketing and software services on `/contact/`. It is a plain static site with no build step and no framework. Netlify serves `public/` and runs two functions from `netlify/functions/`.

Pages in `public/`:

- `/` home page: a showcase of games, free software and the work wall (28 projects with filters, a screenshot lightbox and a `/` or Ctrl+K command palette). No sales pitch here. Styles: `style.css`, `showcase.css`. Scripts: `theme.js`, `main.js`, `showcase.js`.
- `/contact/` custom project development: services, process, FAQ and the email call to action. Every Contact link points here. Same styles and scripts as the home page.
- `/video-mixer/` product page with downloads, FAQ and Screenfolk wireless casting.
- `/resolume-stock-bridge/` companion app page.
- `/privacy/`, `/thanks/`, `/games/stick-figure-army/`, `/games/automotown/`, `/404.html`.
- `/analytics/` private dashboard (reads `/api/analytics`).
- `/custom-web-development/` is retired and 301-redirects to `/contact/` (see `netlify.toml`). Its old file and `agency.css`, `newsprint.css`, `newsprint.js` and `portfolio.js` are only used by that unreachable page.

Home page notes:

- Project thumbnails live in `public/images/newsprint/projects/thumbs/` (720x493 WebP) and the hero strip uses `river/` (400x274 WebP). Generate both from the full 1440x985 JPG when adding a project, and update the filter counts, the `#work` ItemList JSON-LD and the "28" counts in the page, `llms.txt` and the meta description.
- Old home anchors `#services`, `#process` and `#faq` forward to the same anchors on `/contact/` (in `showcase.js`).

Outside `public/` (not deployed):

- `templates/` ELYWARE Kit: reusable sections, starter pages (splash, landing, venue, festival), interactive components and a UI ideas log for new builds. Start any new site from here. See `templates/README.md`.
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
