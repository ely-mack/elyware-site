# UI ideas and sources

Running log of what to borrow, where it came from, and whether we can reuse the code or only the idea.

## License rules

- **MIT, Apache 2.0, ISC, or public domain:** code can be adapted. Keep the license notice in a comment at the top of the copied block.
- **GPL:** idea only. Do not copy code into client sites.
- **"Free with attribution" or "do not redistribute":** idea only.
- **No license stated:** idea only. No license means all rights reserved.
- **Reddit posts, screenshots, Dribbble and Behance designs:** idea only. Rebuild from scratch in our tokens.

## Sources to watch

Checked 2026-10-08. Licenses are as reported by search results and still need confirming against each repo's LICENSE file before any code is copied.

| Source | Stack | License | Use for |
|---|---|---|---|
| r/vibecoding | Mixed | Per post | New patterns and AI-built splash pages. **Not reviewed yet: Reddit is blocked in the cloud environment.** |
| HyperUI | HTML + Tailwind | MIT (reported) | Section layouts. Convert classes to `kit.css` |
| Flowbite Blocks | HTML + Tailwind | Free tier | Section layouts. Convert classes to `kit.css` |
| AstroWind | Astro + Tailwind | MIT (reported) | Page structure, blog layout |
| ScrewFast | Astro + Tailwind | MIT (reported) | Product page structure |
| Launch UI | Next.js | MIT, some sections Pro | SaaS hero and pricing ideas |
| Cruip Open | Next.js | GPL + no redistribute | Idea only |
| Nova Landing | Bootstrap | Free with footer credit | Idea only |

## Ideas already in the kit

- Badge with a status dot above the hero headline ("Now booking", "On sale").
- Gradient text on the last phrase of the headline. Use it once per page.
- Email capture right in the hero for splash pages, with an inline success message instead of a redirect.
- Events list with a calendar date block. Built for BandWagon venues and launch dates. Pairs with `MusicEvent` JSON-LD.
- Countdown to doors or a launch time, with a fixed timezone offset.
- Native `<details>` FAQ that works without JavaScript and maps directly to FAQPage JSON-LD.
- Featured middle pricing tier with an accent border and glow.

## Ideas backlog

Add new finds here with the source link. Move them up once they are built.

- [ ] Before and after slider for site redesign case studies.
- [ ] Sticky mobile "Get tickets" bar that appears after scrolling past the hero.
- [ ] Bento grid feature layout (mixed card sizes).
- [ ] Video background hero with a poster image and a reduced-motion fallback.
- [ ] Lineup or artist grid with hover bios for festival and venue pages.
- [ ] Marquee strip of upcoming show names (paused under reduced motion).

## Review checklist for a new idea

1. Does it help someone take the main action (buy, sign up, contact)?
2. Does it work at 360px, in both themes, with reduced motion?
3. Can it be built with `kit.css` tokens and no new dependency?
4. Is the license clear for what we are taking?
