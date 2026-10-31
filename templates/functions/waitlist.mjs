// ELYWARE Kit waitlist function. Template only: this folder is not deployed.
// To use it on a site, copy this file to that site's netlify/functions/ and add "@netlify/blobs" to package.json.
// The form posts JSON { email } to /api/waitlist and gets back { position }.
// Joining twice with the same email returns the original position instead of a new one.
import { getStore } from '@netlify/blobs';

const STORE_NAME = 'waitlist';
const MAX_BODY_BYTES = 512;
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

const json = (status, body) => new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
});

async function emailKey(email) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email));
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Optimistic counter: retry when another request bumped it first.
async function nextPosition(store) {
    for (let attempt = 0; attempt < 8; attempt += 1) {
        const current = await store.getWithMetadata('counter', { type: 'json', consistency: 'strong' });
        if (current === null) {
            const { modified } = await store.setJSON('counter', { count: 1 }, { onlyIfNew: true });
            if (modified) return 1;
            continue;
        }
        const count = current.data.count + 1;
        const { modified } = await store.setJSON('counter', { count }, { onlyIfMatch: current.etag });
        if (modified) return count;
    }
    throw new Error('counter contention');
}

export default async (request) => {
    if (request.method !== 'POST') return json(405, { error: 'POST only' });
    if (request.headers.get('origin') !== new URL(request.url).origin) return json(403, { error: 'Wrong origin' });

    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return json(413, { error: 'Too large' });

    let email;
    try {
        email = String(JSON.parse(raw).email || '').trim().toLowerCase();
    } catch (error) {
        return json(400, { error: 'Bad JSON' });
    }
    if (!EMAIL.test(email)) return json(400, { error: 'Enter a valid email' });

    const store = getStore({ name: STORE_NAME, consistency: 'strong' });
    const key = `people/${await emailKey(email)}`;
    const existing = await store.get(key, { type: 'json' });
    if (existing) return json(200, { position: existing.position, returning: true });

    const position = await nextPosition(store);
    const { modified } = await store.setJSON(key, { email, position, joinedAt: new Date().toISOString() }, { onlyIfNew: true });
    if (!modified) {
        // A second tab beat this one. Report the position that tab saved.
        const saved = await store.get(key, { type: 'json' });
        return json(200, { position: saved.position, returning: true });
    }
    return json(201, { position });
};

export const config = { path: '/api/waitlist' };
