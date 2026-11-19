# ELYWARE project registry

Every site and app ELYWARE has built. It covers where each one lives, how it deploys, what runs behind it, and what we learned from it.

Sources, pulled 2026-11-19: the Netlify team (37 sites, read-only), the current production deploy of each site, the elyware.net work wall, and this repo's git history. "Repo: none" means Netlify has no linked commit for the live deploy, so the source is on someone's machine.

Refresh it when a site is added, retired or moves repos. Re-pull the Netlify facts rather than editing them by hand.

**Side:** BWP is BandWagon Ltd (promotion, booking, magazine). Crew is The Crew Presents Inc. (the Greeley campus). Client means built for someone outside both. A `?` means the side is a guess. Confirm it before this file is used for anything financial or contractual.

## At a glance

- 37 Netlify sites. 32 are published and 5 are empty shells that never deployed.
- 16 published sites have no linked repo. That is the biggest risk in this list (see Risks).
- 11 GitHub repos back the other 16 sites. Two repos are monorepos that each serve three sites.
- The heaviest backends are Crewbase (11 functions, 9 schedules), the Promoter Dashboard (11 functions, 7 schedules), Stella's (9 functions) and BandWagon Magazine (7 functions).
- Not on Netlify: Video Mixer, Stock Bridge, Stick Figure Army and AutomouTown (all in this repo). Stella's Tycoon lives in the Stella's repo.

## Platforms and apps

| Project | Live URL | Netlify site | Repo | Last deploy | Stack | Backend | Side |
|---|---|---|---|---|---|---|---|
| Crewbase | crewbase.work | crewbase | ely-mack/crewbase | 2026-11-18 | Next.js | 11 functions, 9 schedules (shift reminders and notifications every minute, sales sync every 15 min, tip ledger, photo purge) | Crew |
| Promoter Dashboard | bwp-promoter-dashboard.netlify.app | bwp-promoter-dashboard | ely-mack/bwp-promoter-dashboard | 2026-11-18 | Next.js | 11 functions, 7 schedules (audience, Gmail, social and ticket reports every 5 min, meeting secretary) | BWP |
| The Crew Presents KPI Dashboard | crew-kpi.netlify.app | crew-kpi | none (CLI deploy) | 2026-11-18 | Static + functions | 3 functions (today, labor, forgot), Netlify Forms | Crew |
| BandWagon Presents | bandwagonpresents.com | bandwagon-presents-staging | ely-mack/bandwagon-presents-website | 2026-11-18 | Next.js | Hourly TIXR catalog refresh | BWP |
| BandWagon Fan Club | bandwagonfan.club | bwp-fan-club-live | ely-mack/bandwagon-fan-club | 2026-11-19 | Next.js | Next handlers only | BWP |
| BandWagon Magazine | bandwagmag.com | bandwagmag | none | 2026-11-18 | Server + functions | 7 functions: concert sync (daily), Instagram sync (hourly), thumbnail subject | BWP |
| BandWagon Magazine (preview) | bandwagmag-preview.netlify.app | bandwagmag-preview | none | 2026-11-04 | Same as above | Runs the same schedules as production | BWP |
| BandWagon Concert Map | bandwagmag-concert-map.netlify.app | bandwagmag-concert-map | ely-mack/bandwagmag-concert-map (public) | 2026-05-05 | Next.js | None | BWP |
| Casper Entertainment | casperentertainment.com | casper-entertainment-preview | ely-mack/casper-websites | 2026-11-18 | Next.js | Hourly event refresh, Forms | BWP (CEG) |
| Screenfolk | screenfolk.com | screenfolk | none | 2026-11-03 | Next.js | Server handler | Partner ? |
| Ghost Towns of the Rockies | ghosttownsoftherockies.com | ghosttownsoftherockies | none | 2026-09-14 | Static | None | ? |
| HACKERZ | hackerz.tech | hackerz-tech | ely-mack/hackerz | 2026-06-23 | Expo (web) | None | ? |

## Venues

| Project | Live URL | Netlify site | Repo | Last deploy | Stack | Backend | Side |
|---|---|---|---|---|---|---|---|
| Stella's Pinball Arcade & Lounge | stellaspinball.com | stellaspinball | ely-mack/stellas-pinball-website | 2026-11-19 | Static + functions | 9 functions: arcade scores, comedy pages (refresh every 15 min), newsletter, party booking (AI, email webhook, ops), Broncos | Crew |
| Moxi Theater | moxitheater.com | moxi-theater-mockup | ely-mack/bandwagon-presents-website | 2026-11-11 | Next.js | Hourly catalog refresh, job notification retries, Spotify playlist sync (twice daily), form handler | Crew |
| Spotlight Café & Creamery | spotlightgreeley.com | spotlight-cafe-greeley | ely-mack/spotlight-cafe-website | 2026-11-17 | Static | Forms | Crew |
| The Gaslight Social | thegaslightsocial.com | gaslightsocialmock | ely-mack/casper-websites | 2026-11-18 | Next.js | Hourly event refresh, TIXR feed monitor every 6 h, Forms | BWP (booking) |
| The Rialto Casper | rialtocasper.com | rialto-casper-preview | ely-mack/casper-websites | 2026-11-18 | Next.js | Hourly event refresh, Forms | BWP (booking) |
| The Black Buzzard | black-buzzard-preview.netlify.app | black-buzzard-preview | ely-mack/bandwagon-presents-website | 2026-11-04 | Next.js | ISR, Battle pages regenerate daily | BWP (booking) |

## Festivals and events

| Project | Live URL | Netlify site | Repo | Last deploy | Stack | Notes | Side |
|---|---|---|---|---|---|---|---|
| Greeley Blues Jam | greeleybluesjam.org | greeley-blues-jam-2026-preview | none | 2026-11-12 | Static (12 pages) | Hive signup, 2026 lineup recap, booking callout | BWP (GBJ) ? |
| Come As You Are Fest | comeasyouarefest.com | comeasyouarefest | ely-mack/comeasyouarefest | 2026-11-06 | Static | Form handler, Know Before You Go | BWP ? |
| Come As You Are Fest (clone) | cayaclone.netlify.app | cayaclone | ely-mack/comeasyouarefest | 2026-10-11 | Static | Design branch (castle windows). Likely stale | BWP ? |
| My Favorite Bands | myfavoritebands.org | my-favorite-bands-fest | none | 2026-08-06 | Static (3 pages) | Privacy choices and GPC baseline | BWP ? |
| Greeley Block Party | greeleyblockparty.com | greeley-block-party | none | 2026-08-12 | Static (1 page) | Memoriam archive, 2006 to 2025 | ? |
| Red, White & Vroom | redwhiteandvroom.com | redwhiteandvroom | none | 2026-07-04 | Static | Off-season mode: register CTA goes to a signup list | ? |
| Battle of the Bands | Served at /battle on the Black Buzzard site | (bwp-battle-2026 is empty) | ely-mack/bandwagon-presents-website | 2026-11-04 | Next.js | JSON-LD carries TIXR door and show times | BWP |
| Forkaround archive | bandwagon-forkaround-archive-2026.netlify.app | bandwagon-forkaround-archive-2026 | none | 2026-10-19 | Static (1 page) | Unlisted archive | BWP |

## Local business (clients)

| Project | Live URL | Netlify site | Repo | Last deploy | Stack | Backend | Side |
|---|---|---|---|---|---|---|---|
| All About Home Services | mrallabout.com | mrallabout | none | 2026-10-13 | Static (20 pages, city and service pages) | Forms | Client |
| Luna's Tacos & Tequila | lunas-tacos-windsor-preview.netlify.app | lunas-tacos-windsor-preview | none | 2026-08-20 | Static + functions | 5 functions: admin login, export, catering | Client |
| Tres Amigos | tres-amigos-preview.netlify.app | tres-amigos-preview | none | 2026-08-20 | Next.js | Server handler | Client |

## Ticket campaigns

| Project | Live URL | Netlify site | Repo | Last deploy | Notes | Side |
|---|---|---|---|---|---|---|
| Moxi Theater BOGO | moxi-july-bogo.netlify.app | moxi-july-bogo | none (drag and drop) | 2026-07-25 | Single page | BWP |
| LuLu's Downtown BOGO | lulus-july-bogo.netlify.app | lulus-july-bogo | none (drag and drop) | 2026-07-25 | Single page | BWP |
| The Black Buzzard BOGO | black-buzzard-bogo.netlify.app | black-buzzard-bogo | none (drag and drop) | 2026-07-25 | Single page | BWP |

## ELYWARE products (this repo)

| Project | Where | Notes |
|---|---|---|
| elyware.net | splendorous-chebakia-9e86f4, ely-mack/elyware-site | Showcase, analytics and telemetry functions |
| Video Mixer v4.6.1 | /video-mixer/ | Free VJ app. Mac app is unsigned (Gatekeeper warning) |
| Stock Bridge for Resolume v1.0.1 | /resolume-stock-bridge/ | Pixabay to Resolume clip slots |
| Stick Figure Army, AutomouTown | /games/ | Browser games |
| Stella's Tycoon and the Stella's arcade | stellaspinball.com | Lives in the Stella's repo |

## Empty Netlify sites (never published)

bwp-buzzard-bogo, bwp-battle-2026, bwp-ad-assets, bwp-automations, moxi-drag-bingo. No current deploy on any of them. Delete them, or note what each was meant for.

## Repos that serve more than one site

- **ely-mack/bandwagon-presents-website:** bandwagonpresents.com, moxitheater.com and the Black Buzzard site (with /battle).
- **ely-mack/casper-websites:** Casper Entertainment, The Rialto and The Gaslight Social. One commit fixed the hero on two sites at once on 2026-11-18.
- **ely-mack/comeasyouarefest:** the live fest site and cayaclone.

## Risks found in the data

1. **16 live sites have no repo.** They were deployed from a local folder, the CLI or drag and drop: BandWagon Magazine and its preview, the KPI dashboard, Greeley Blues Jam, Screenfolk, Ghost Towns, All About Home Services, Luna's, Tres Amigos, Block Party, My Favorite Bands, Red White & Vroom, the three BOGOs and the Forkaround archive. elyware.net already got burned by this: v4.2 was rolled back when main fell behind the live site (see PR #5 in this repo). Put each one in a repo and let main deploy it.
2. **The BandWagon Magazine preview runs production jobs.** bandwagmag-preview has the same concert sync and hourly Instagram sync as bandwagmag.com. If they write to the same store or API, they double up. Turn off schedules on the preview.
3. **Production sites carry preview names.** moxitheater.com is "moxi-theater-mockup", bandwagonpresents.com is "bandwagon-presents-staging", and the Gaslight, Rialto, Casper and Blues Jam sites carry "mock" or "preview" names too. Someone cleaning up "previews" could delete a live venue site. Rename them in Netlify (the site name, not the domain).
4. **Crewbase functions run on Node 20.** Node 20 reached end of life in April 2026. The other sites run Node 22. Crewbase also runs two functions every minute, which is the biggest invocation cost in the team.
5. **Deploys with no message.** The Promoter Dashboard and Crewbase ship as "Ship <hash>", so their deploy history says nothing about what changed.
6. **The showcase is missing projects.** BandWagon Magazine (bandwagmag.com) is not on the elyware.net work wall. HACKERZ has a placeholder description.
7. **The Black Buzzard, Luna's and Tres Amigos are on .netlify.app addresses.** Confirm whether they are live client sites, pitches or retired.

## What worked

Patterns the deploy history shows paying off. Each is a candidate for the ELYWARE Kit in `templates/`.

- **One repo for a family of sites.** The Casper and BWP monorepos share components and ship fixes to several venues in one commit.
- **Event data refreshed from TIXR on a schedule.** Hourly refresh functions keep venue calendars current with no hand edits.
- **Structured data audits.** The Battle JSON-LD fix (real door and show times, past rounds handled) came from an audit. That audit should run on every venue site.
- **Image weight passes.** The Gaslight photos went from 41.2 MB to 9.2 MB with no visual change. BandWagon Magazine had a bandwidth fix too. The kit has no image pipeline yet.
- **Bot playtesting for games.** About 100 bot games and 120-day Tycoon runs drove the last Stella's tuning pass.
- **Off-season mode for event sites.** Red, White & Vroom swaps register and sponsor CTAs for a signup list and email.
- **Privacy and GPC baseline.** My Favorite Bands has one. Every site with tracking needs it.

## What didn't

- Deploying from a local folder (Risk 1). It caused the only rollback on record.
- Drag and drop campaign pages. They are fast to ship but there is no source to reuse for the next BOGO.
- The Decap CMS on elyware.net. It points at the old file layout and edits nothing live.
- Preview sites that run production schedules (Risk 2).

## Needs your input

The data can't answer these:

- [ ] Confirm the Side column, mostly the `?` rows.
- [ ] Status of Luna's, Tres Amigos and the Black Buzzard site: live, pitch or retired?
- [ ] What the five empty sites were for, and whether to delete them.
- [ ] Your own verdict on each project: what worked and what you'd do differently.
- [ ] Where the source lives for the 16 sites without a repo (Dropbox folder names are enough).
