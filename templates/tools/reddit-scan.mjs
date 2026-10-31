#!/usr/bin/env node
// Scan a subreddit for free templates and UI ideas through Reddit's official API.
// Writes templates/scans/YYYY-MM-DD.md with only the posts not seen in earlier scans,
// and checks the license of every GitHub repo a post links to.
//
// Needs (environment variables, never committed):
//   REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET  from a Reddit app at https://www.reddit.com/prefs/apps
//   REDDIT_USER_AGENT                       e.g. "web:elyware-ui-scan:1.0 (by /u/yourname)"
//   GITHUB_TOKEN (optional)                 raises the GitHub API rate limit for license checks
// Network: www.reddit.com (token), oauth.reddit.com (data), api.github.com (licenses).
//
// Usage: node templates/tools/reddit-scan.mjs [--sub vibecoding] [--window week|month|year] [--min-score 10]
//        [--fixture listing.json --out dir]  offline test against a saved listing, writes nothing to scans/

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const scansDir = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : join(here, '..', 'scans');
const seenFile = join(scansDir, 'seen.json');

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, arg, i, all) => {
    if (arg.startsWith('--')) pairs.push([arg.slice(2), all[i + 1]?.startsWith('--') ? true : all[i + 1] ?? true]);
    return pairs;
}, []));
const SUB = args.sub || 'vibecoding';
const WINDOW = args.window || 'month';
const MIN_SCORE = Number(args['min-score'] ?? 10);

const QUERIES = ['landing page', 'template', 'splash page', 'ui kit', 'components', 'design system', 'portfolio site', 'open source site'];
const MATCH = /landing|template|splash|\bui\b|component|design system|portfolio|tailwind|animation|hero section|bento|website/i;
const REUSABLE = new Set(['MIT', 'Apache-2.0', 'ISC', 'BSD-2-Clause', 'BSD-3-Clause', '0BSD', 'Unlicense', 'CC0-1.0']);
const LINK_HOSTS = /github\.com|gitlab\.com|codepen\.io|codesandbox\.io|stackblitz\.com|vercel\.app|netlify\.app|figma\.com|gumroad\.com|framer\.(com|website)/i;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function redditToken() {
    const { REDDIT_CLIENT_ID: id, REDDIT_CLIENT_SECRET: secret, REDDIT_USER_AGENT: agent } = process.env;
    if (!id || !secret || !agent) {
        throw new Error('Set REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET and REDDIT_USER_AGENT in the environment first.');
    }
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': agent
        },
        body: 'grant_type=client_credentials'
    });
    if (!response.ok) throw new Error(`Reddit token request failed: HTTP ${response.status}`);
    return (await response.json()).access_token;
}

async function redditGet(token, path) {
    const response = await fetch(`https://oauth.reddit.com${path}`, {
        headers: { Authorization: `Bearer ${token}`, 'User-Agent': process.env.REDDIT_USER_AGENT }
    });
    if (!response.ok) throw new Error(`Reddit ${path} failed: HTTP ${response.status}`);
    // Stay well under the 100 requests per minute allowance.
    await sleep(700);
    return response.json();
}

async function fetchPosts() {
    if (args.fixture) {
        const listing = JSON.parse(await readFile(args.fixture, 'utf8'));
        return listing.data.children.map((child) => child.data);
    }
    const token = await redditToken();
    const posts = new Map();
    const paths = [
        `/r/${SUB}/top?t=${WINDOW}&limit=100&raw_json=1`,
        ...QUERIES.map((q) => `/r/${SUB}/search?q=${encodeURIComponent(q)}&restrict_sr=1&sort=top&t=${WINDOW}&limit=50&raw_json=1`)
    ];
    for (const path of paths) {
        const listing = await redditGet(token, path);
        for (const child of listing.data.children) posts.set(child.data.id, child.data);
    }
    return [...posts.values()];
}

function linksIn(post) {
    const found = new Set();
    if (post.url && !post.url.includes('reddit.com') && !post.url.includes('redd.it')) found.add(post.url);
    for (const match of (post.selftext || '').matchAll(/https?:\/\/[^\s)\]>"']+/g)) found.add(match[0].replace(/[.,]+$/, ''));
    return [...found].filter((url) => LINK_HOSTS.test(url));
}

async function githubLicense(url) {
    const match = url.match(/github\.com\/([\w.-]+)\/([\w.-]+)/);
    if (!match) return null;
    const repo = `${match[1]}/${match[2].replace(/\.git$/, '')}`;
    if (args.fixture) return { repo, license: 'unchecked (fixture run)', stars: null, pushed: null };
    const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'elyware-ui-scan' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const response = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (response.ok) {
        const data = await response.json();
        if (data.license?.spdx_id && data.license.spdx_id !== 'NOASSERTION') {
            return { repo, license: data.license.spdx_id, stars: data.stargazers_count, pushed: data.pushed_at?.slice(0, 10) };
        }
    }
    // The API can be unavailable (rate limit, restricted network). Read the license file itself instead.
    return { repo, license: await licenseFromFile(repo), stars: null, pushed: null };
}

// Identify a license from the text of LICENSE, LICENSE.md or LICENSE.txt on the default branch.
async function licenseFromFile(repo) {
    for (const name of ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'license', 'COPYING']) {
        const response = await fetch(`https://raw.githubusercontent.com/${repo}/HEAD/${name}`);
        if (!response.ok) continue;
        const text = (await response.text()).slice(0, 4000);
        if (/GNU AFFERO GENERAL PUBLIC LICENSE/i.test(text)) return 'AGPL';
        if (/GNU LESSER GENERAL PUBLIC LICENSE/i.test(text)) return 'LGPL';
        if (/GNU GENERAL PUBLIC LICENSE/i.test(text)) return 'GPL';
        if (/Apache License[\s\S]{0,40}Version 2\.0/i.test(text)) return 'Apache-2.0';
        if (/MIT License|Permission is hereby granted, free of charge/i.test(text)) return 'MIT';
        if (/ISC License|Permission to use, copy, modify, and\/or distribute/i.test(text)) return 'ISC';
        if (/free and unencumbered software released into the public domain/i.test(text)) return 'Unlicense';
        if (/CC0 1\.0/i.test(text)) return 'CC0-1.0';
        if (/Redistribution and use in source and binary forms/i.test(text)) {
            return /Neither the name/i.test(text) ? 'BSD-3-Clause' : 'BSD-2-Clause';
        }
        return `unrecognized (${name}, read it before reuse)`;
    }
    return 'none stated';
}

const verdict = (license) => (REUSABLE.has(license) ? 'Code can be adapted (keep the notice)' : 'Idea only');

async function main() {
    await mkdir(scansDir, { recursive: true });
    let seen = [];
    try {
        seen = JSON.parse(await readFile(seenFile, 'utf8'));
    } catch (error) {
        // First run: nothing seen yet.
    }
    const seenIds = new Set(seen);

    const posts = (await fetchPosts())
        .filter((post) => !post.stickied && !post.over_18)
        .filter((post) => post.score >= MIN_SCORE)
        .filter((post) => MATCH.test(`${post.title} ${post.selftext || ''} ${post.link_flair_text || ''}`))
        .filter((post) => !seenIds.has(post.id))
        .sort((a, b) => b.score - a.score);

    const day = new Date().toISOString().slice(0, 10);
    const lines = [
        `# r/${SUB} scan, ${day}`,
        '',
        `Window: top of the past ${WINDOW}. Minimum score: ${MIN_SCORE}. New posts only: ${posts.length}.`,
        'Reddit posts and screenshots are idea only. Linked code follows its own license, checked below.',
        ''
    ];

    for (const post of posts) {
        const links = linksIn(post);
        lines.push(`## ${post.title.replace(/\s+/g, ' ').trim()}`, '');
        lines.push(`- ${post.score} points, ${post.num_comments} comments, ${new Date(post.created_utc * 1000).toISOString().slice(0, 10)}${post.link_flair_text ? `, flair: ${post.link_flair_text}` : ''}`);
        lines.push(`- Thread: https://www.reddit.com${post.permalink}`);
        for (const url of links) {
            const gh = await githubLicense(url);
            lines.push(gh
                ? `- Repo: ${url} (license: ${gh.license}${gh.stars != null ? `, ${gh.stars} stars` : ''}${gh.pushed ? `, last push ${gh.pushed}` : ''}). ${verdict(gh.license)}.`
                : `- Link: ${url}`);
        }
        const excerpt = (post.selftext || '').replace(/\s+/g, ' ').trim().slice(0, 280);
        if (excerpt) lines.push(`- Excerpt: ${excerpt}${post.selftext.length > 280 ? '...' : ''}`);
        lines.push('');
    }

    if (!posts.length) lines.push('Nothing new since the last scan.', '');

    const out = join(scansDir, `${day}.md`);
    await writeFile(out, lines.join('\n'));
    if (!args.fixture) await writeFile(seenFile, `${JSON.stringify([...seenIds, ...posts.map((p) => p.id)], null, 2)}\n`);
    console.log(`${posts.length} new post${posts.length === 1 ? '' : 's'} -> ${out}`);
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
