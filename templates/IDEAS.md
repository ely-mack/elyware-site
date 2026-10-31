# UI ideas and sources

Running log of what to borrow, where it came from, and whether we can reuse the code or only the idea.

## License rules

- **MIT, Apache 2.0, ISC, or public domain:** code can be adapted. Keep the license notice in a comment at the top of the copied block.
- **GPL:** idea only. Do not copy code into client sites.
- **"Free with attribution" or "do not redistribute":** idea only.
- **No license stated:** idea only. No license means all rights reserved.
- **Reddit posts, screenshots, Dribbble and Behance designs:** idea only. Rebuild from scratch in our tokens.

## Sources to watch

Checked 2026-10-08, extended 2026-10-10. "Verified" means the repo's LICENSE file was read on 2026-10-31. "Reported" still needs that check before any code is copied.

| Source | Stack | License | Use for |
|---|---|---|---|
| r/vibecoding | Mixed | Per post | New patterns and AI-built splash pages. Scan with `tools/reddit-scan.mjs` once Reddit API credentials are set (see `.claude/skills/ui-scan/`). |
| HyperUI | HTML + Tailwind | MIT (verified) | Section layouts. Convert classes to `kit.css` |
| Flowbite Blocks | HTML + Tailwind | Core library MIT (verified). Paid blocks excluded | Section layouts. Convert classes to `kit.css` |
| AstroWind | Astro + Tailwind | MIT (verified) | Page structure, blog layout |
| ScrewFast | Astro + Tailwind | MIT (verified) | Product page structure |
| Launch UI | Next.js | MIT, some sections Pro | SaaS hero and pricing ideas |
| Cruip Open | Next.js | No LICENSE file in repo (checked); reported GPL + no redistribute | Idea only |
| Nova Landing | Bootstrap | Free with footer credit | Idea only |
| Tailkits UI | HTML + Tailwind | MIT free tier, rest paid | Marketing blocks |
| Preline UI | HTML + Tailwind + JS | Open source (check repo) | Dropdowns, modals, overlays |
| FlyonUI | Tailwind + JS plugins | MIT (reported) | Interactive component ideas |
| Ripple UI | Tailwind | MIT (reported) | Accessible form controls |
| daisyUI | Tailwind plugin | MIT (verified) | Theming and semantic class naming |
| Awesome CSS Frameworks list | Index | n/a | Discovery of new libraries |

## Ideas already in the kit

- Badge with a status dot above the hero headline ("Now booking", "On sale").
- Gradient text on the last phrase of the headline. Use it once per page.
- Email capture right in the hero for splash pages, with an inline success message instead of a redirect.
- Events list with a calendar date block. Built for BandWagon venues and launch dates. Pairs with `MusicEvent` JSON-LD.
- Countdown to doors or a launch time, with a fixed timezone offset.
- Native `<details>` FAQ that works without JavaScript and maps directly to FAQPage JSON-LD.
- Featured middle pricing tier with an accent border and glow.
- Bento grid with three to four tile sizes and a hover or focus reveal. Always visible on touch screens.
- Spotlight cards with a glow that follows the pointer.
- Accessible tabs, used for set times by day on the festival page.
- Monthly and yearly pricing switch.
- Before and after slider built on a range input, so arrow keys work.
- Scroll-snap carousel with no library.
- Marquee of upcoming names that pauses on hover and stops under reduced motion.
- Sticky phone ticket bar that appears after the hero scrolls away.
- Filterable photo gallery with a native `<dialog>` lightbox.
- Copyable promo code with a toast. Built for fan club presales.
- Lineup grid with set times and bios on hover or focus.
- Day-of-show timeline.
- Video hero with a pause button (WCAG 2.2.2).
- Scroll progress bar using CSS scroll timelines with a JS fallback.
- Count-up stats that keep the real number for screen readers and reduced motion.
- Cross-document view transitions, CSS only, off under reduced motion.
- Scroll-driven reveals, zooms and parallax with `animation-timeline: view()`. No JS, and nothing hidden in older browsers.
- Interactive SVG venue map with keyboard-selectable sections and a sold-out state.
- Add-to-calendar menu: .ics download plus a Google Calendar link, with correct time zones.
- Menu board with tabs, dotted price leaders, dietary tags and a specials badge.
- Story strip with a tap-through viewer that waits for taps under reduced motion.
- Waitlist that shows a live place in line, backed by a Netlify Blobs function template.
- Command palette on Ctrl+K, Cmd+K or /.

## Ideas backlog

Add new finds here with the source link. Move them up once they are built.

- [ ] Seat-level picking inside a venue map section (individual seats, not zones).
- [ ] Live "now playing" set time banner driven by the timeline data.
- [ ] Merch grid with variant pickers that hands off to Square or Shopify checkout.
- [ ] Photo booth style gallery uploads from fans (needs storage and moderation).
- [ ] Multi-language toggle for venue info pages.

Trend notes, 2026: bento grids are now standard. Scroll-driven animation is the pattern to watch. Scroll-jacking and generic AI imagery are fading. Keep tile sizes to three or four.

## Review checklist for a new idea

1. Does it help someone take the main action (buy, sign up, contact)?
2. Does it work at 360px, in both themes, with reduced motion?
3. Can it be built with `kit.css` tokens and no new dependency?
4. Is the license clear for what we are taking?
