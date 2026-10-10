# ELYWARE Kit

A local library of page sections and starter pages for new ELYWARE builds. It's plain HTML and CSS with no framework and no build step, which matches how elyware.net is built.

This folder is not deployed. Netlify publishes `public/` only.

Open `index.html` in a browser to see everything in one gallery.

## What is here

| Path | What it is |
|---|---|
| `kit.css` | Design tokens (light and dark), layout, and every component style |
| `theme.js` | Sets `data-theme` before first paint. Load it in `<head>` |
| `kit.js` | Theme toggle, mobile menu, scroll reveal, countdown, Netlify email signup |
| `sections/` | 15 standalone sections. Copy the block between the `SECTION START` and `SECTION END` comments |
| `pages/` | Three full starters: `splash` (coming soon), `landing` (product or service), `venue` (shows and tickets) |
| `IDEAS.md` | UI ideas, sources worth watching, and the license rules for borrowing |

## Start a new site

1. Make a new repo with a `public/` folder and copy `kit.css`, `kit.js` and `theme.js` into it.
2. Copy the closest starter from `pages/` to `public/index.html`. Change the `../` asset paths to root-relative (`/kit.css`).
3. Rebrand. Edit the accent colors, `--font` and `--radius` in the first three blocks of `kit.css`. Nothing else should need a color change.
4. Swap the copy. Replace each `.media` placeholder with a real `<img>` (set `width`, `height` and `alt`).
5. Fix the head. Set the title, description, canonical, OG image and JSON-LD. Remove `noindex`.
6. Add `robots.txt`, `sitemap.xml` and `llms.txt` (see elyware.net's `public/` for working examples).
7. Connect to Netlify. Forms marked `data-netlify="true"` start collecting on the first deploy.

## Rules every section follows

- Colors come from CSS custom properties only. No hard-coded colors in markup.
- Light and dark themes both work. Check both before shipping.
- Layouts hold at 360px wide with no sideways scroll.
- `prefers-reduced-motion` turns off reveals and hover motion.
- Content stays visible without JavaScript. The scroll reveal only hides elements after `kit.js` loads.
- Visible focus rings, a skip link, labeled form fields, and `aria-live` form status.
- No em dashes in copy.

## Adding to the kit

1. Write the section as a standalone file in `sections/`, using the same `<head>` as the others and the `SECTION START`/`END` markers.
2. Put any new styles in `kit.css` under their own comment heading, built on the existing tokens.
3. Add a card for it in `index.html`.
4. If the idea came from somewhere else, log the source and license in `IDEAS.md`.

Everything in this kit is original code written for ELYWARE. Outside templates are reference only unless `IDEAS.md` records a license that allows reuse.
