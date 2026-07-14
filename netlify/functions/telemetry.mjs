import { getStore } from '@netlify/blobs';

const STORE_NAME = 'elyware-analytics';
const MAX_BODY_BYTES = 1024;
const PAGES = new Set(['home', 'video-mixer', 'privacy', 'stick-figure-army', 'thanks']);
const DOWNLOADS = new Set(['mac', 'windows', 'linux-web']);
const PRODUCTION_HOSTS = new Set(['elyware.net', 'www.elyware.net']);
const PREVIEW_SUFFIX = '--splendorous-chebakia-9e86f4.netlify.app';

const emptyResponse = (status) => new Response(null, {
    status,
    headers: { 'Cache-Control': 'no-store' }
});

const safeCount = (value) => Number.isSafeInteger(value) && value >= 0 ? value : 0;
const safeTimestamp = (value) => typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : null;

function normalizedDaily(value, day) {
    const pages = value?.pages ?? {};
    const downloads = value?.downloads ?? {};

    return {
        schema: 1,
        date: day,
        visits: safeCount(value?.visits),
        pageViews: safeCount(value?.pageViews),
        downloadClicks: safeCount(value?.downloadClicks),
        pages: Object.fromEntries([...PAGES].map((page) => [page, safeCount(pages[page])])),
        downloads: Object.fromEntries([...DOWNLOADS].map((platform) => [platform, safeCount(downloads[platform])])),
        lastPageViewAt: safeTimestamp(value?.lastPageViewAt),
        lastDownloadClickAt: safeTimestamp(value?.lastDownloadClickAt),
        updatedAt: new Date().toISOString()
    };
}

function applyMetric(daily, metric) {
    if (metric.event === 'page_view') {
        daily.pageViews += 1;
        daily.pages[metric.page] += 1;
        if (metric.newVisit) daily.visits += 1;
        daily.lastPageViewAt = new Date().toISOString();
    } else {
        daily.downloadClicks += 1;
        daily.downloads[metric.download] += 1;
        daily.lastDownloadClickAt = new Date().toISOString();
    }

    daily.updatedAt = new Date().toISOString();
    return daily;
}

async function incrementDaily(store, key, day, metric) {
    for (let attempt = 0; attempt < 8; attempt += 1) {
        const current = await store.getWithMetadata(key, { type: 'json', consistency: 'strong' });

        if (current === null) {
            const next = applyMetric(normalizedDaily(null, day), metric);
            const { modified } = await store.setJSON(key, next, { onlyIfNew: true });
            if (modified) return next;
            continue;
        }

        const next = applyMetric(normalizedDaily(current.data, day), metric);
        const { modified } = await store.setJSON(key, next, { onlyIfMatch: current.etag });
        if (modified) return next;
    }

    throw new Error('counter contention');
}

function requestScope(url, origin) {
    if (origin !== url.origin) return null;
    if (PRODUCTION_HOSTS.has(url.hostname)) return 'production';

    if (url.hostname === 'splendorous-chebakia-9e86f4.netlify.app'
        || url.hostname.endsWith(PREVIEW_SUFFIX)) {
        return 'test';
    }

    return null;
}

function parseMetric(body) {
    if (body?.event === 'page_view'
        && PAGES.has(body.page)
        && typeof body.new_visit === 'boolean') {
        return { event: 'page_view', page: body.page, newVisit: body.new_visit };
    }

    if (body?.event === 'download_click' && DOWNLOADS.has(body.download)) {
        return { event: 'download_click', download: body.download };
    }

    return null;
}

export default async (request, context) => {
    const url = new URL(request.url);
    const scope = requestScope(url, request.headers.get('origin'));
    if (!scope) return emptyResponse(403);

    const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim();
    if (contentType !== 'application/json') return emptyResponse(415);

    const declaredLength = request.headers.get('content-length');
    if (declaredLength && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_BODY_BYTES)) {
        return emptyResponse(413);
    }

    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return emptyResponse(413);

    let body;
    try {
        body = JSON.parse(raw);
    } catch (error) {
        return emptyResponse(400);
    }

    const metric = parseMetric(body);
    if (!metric) return emptyResponse(400);

    const day = new Date().toISOString().slice(0, 10);
    const key = `${scope}/daily/${day}`;
    const store = getStore({ name: STORE_NAME, consistency: 'strong' });
    const task = incrementDaily(store, key, day, metric)
        .then((daily) => {
            console.log(JSON.stringify({
                schema: 1,
                type: 'anonymous_aggregate',
                scope,
                day,
                event: metric.event,
                count: metric.event === 'page_view' ? daily.pageViews : daily.downloadClicks
            }));
        })
        .catch((error) => {
            console.error(JSON.stringify({
                schema: 1,
                type: 'analytics_counter_error',
                scope,
                day,
                message: error instanceof Error ? error.message : 'unknown'
            }));
        });

    if (typeof context.waitUntil === 'function') {
        context.waitUntil(task);
    } else {
        await task;
    }

    return emptyResponse(204);
};

export const config = {
    path: '/api/telemetry',
    method: 'POST',
    rateLimit: {
        windowLimit: 120,
        windowSize: 60,
        aggregateBy: ['ip', 'domain']
    }
};
