# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

ELYWARE's marketing site (elyware.net) — a single-page product landing site for Mac creative tools (currently just Video Mixer). It is a plain static site: no build step, no package manager, no tests, no framework. Three files do all the work:

- `index.html` — all page content (nav, hero, product card, about, contact/footer)
- `style.css` — all styling, uses CSS custom properties defined in `:root` for the dark theme
- `main.js` — vanilla JS for mobile menu, scroll-triggered fade-ins (IntersectionObserver), navbar background swap, smooth anchor scroll, and a waitlist email form that currently stores submissions in `localStorage`

## Running locally

Open `index.html` directly in a browser, or serve the directory with any static server (e.g. `python3 -m http.server`). There is nothing to install or build.

## Content management (Decap CMS)

`admin/` hosts a [Decap CMS](https://decapcms.org/) instance for non-developer editing:

- `admin/index.html` loads Decap from the unpkg CDN.
- `admin/config.yml` declares a `github` backend pointing at `ely-mack/elyware-site` on `main`, and exposes `index.html`, `style.css`, and `main.js` as editable "code" fields (full-file replace, `output_code_only: true`).

Consequences to be aware of:

- Editing these three files is effectively a live CMS surface. Don't split them into many new files without updating `admin/config.yml` to match, or the CMS will silently stop exposing the new content.
- The CMS commits directly to `main` via GitHub OAuth, so anything merged there ships.
- Media uploads go to `images/` (`media_folder: "images"`, `public_folder: "/images"`).

## Deployment

Commits to `main` are the source of truth for the live site. There is no CI config checked in; assume static hosting serves the repo root as-is. Keep paths relative (e.g. `images/foo.jpg`, `style.css`) — absolute/host-prefixed paths will break previews.

## Conventions

- **Single-file rule**: keep new styles in `style.css` and new behavior in `main.js` unless there's a strong reason otherwise (see CMS note above).
- **Theme tokens**: use the CSS variables in `:root` (`--bg`, `--bg-2`, `--bg-3`, `--text`, `--text-dim`, `--accent`, `--accent-2`, `--radius*`, `--font`) rather than hard-coding colors or radii.
- **Fade-in on scroll**: any element in the selector list at the top of `main.js` (`.product-card, .coming-soon-section, .about-text, .about-values, .value-card`) gets the `fade-in` class + IntersectionObserver treatment automatically. Add new sections to that selector instead of reimplementing.
- **Reduced-motion**: the `@media (prefers-reduced-motion: reduce)` block in `style.css` collapses all animations. Don't introduce motion that bypasses it.
- **Payment link**: "Buy Now" points at a Payhip URL hard-coded in `index.html` (`https://payhip.com/b/CU9QK`). The shop links and demo download are placeholders wired up in `main.js`.
- **Waitlist form**: currently client-side only (localStorage). If wiring to a real service (Mailchimp/etc.), replace the handler in `main.js`; there is no backend.

## SEO / social

`index.html` contains the canonical `<meta>` set: description, keywords, Open Graph (`og:image` → `images/og-image.jpg`, 1200×630), and Twitter Card. Update all three blocks together when changing title/description copy so previews stay consistent.
