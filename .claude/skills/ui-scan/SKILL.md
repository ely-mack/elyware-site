---
name: ui-scan
description: Scan r/vibecoding (or another subreddit) and other sources for free templates, splash pages and UI ideas, check licenses, and fold the good finds into the ELYWARE Kit in templates/. Use when asked to scan, gather or monitor templates, UI ideas, splash pages or "what's new on vibecoding", or when the weekly UI scan routine fires.
---

# UI scan

Turns outside inspiration into kit improvements without copying anything we are not allowed to copy.

## Requirements

- Environment variables: `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_USER_AGENT` (format `web:elyware-ui-scan:1.0 (by /u/USERNAME)`). They come from a Reddit app at https://www.reddit.com/prefs/apps. Never paste them into chat or commit them.
- Network access to `www.reddit.com`, `oauth.reddit.com`, `api.github.com` and `raw.githubusercontent.com`.
- Use only the official API through `templates/tools/reddit-scan.mjs`. Do not scrape Reddit pages or drive a headless browser at them.

## Steps

1. Run `node templates/tools/reddit-scan.mjs` (defaults: r/vibecoding, top of the past month, score 10 or more). Add `--window week` for weekly runs.
2. Read the new digest in `templates/scans/YYYY-MM-DD.md`. It lists only posts not seen before and marks each linked repo "Code can be adapted" or "Idea only" from its license.
3. Pick at most three finds that pass the review checklist at the bottom of `templates/IDEAS.md` (helps the main action, works at 360px in both themes with reduced motion, buildable with kit tokens, license clear).
4. For each pick, add a backlog line to `templates/IDEAS.md` with the thread link and license. Add new reusable sources to the "Sources to watch" table.
5. Build a pick into the kit only when asked, or when it is small and clearly useful. Write it from scratch in `kit.css` tokens. If MIT/Apache/ISC/BSD code is adapted, keep its license notice in a comment at the top of the block. GPL, no-license and Reddit screenshots are idea only.
6. Test any new section the same way as the rest of the kit (both themes, 360px and 1280px, reduced motion, keyboard), update `templates/index.html` and `templates/README.md`, then commit the digest, `seen.json` and any kit changes on a branch and open a draft PR.

## Writing style

No em dashes. Short, direct sentences. Let facts carry the weight.
