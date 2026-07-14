import { getStore } from '@netlify/blobs';

const STORE_NAME = 'elyware-analytics';
const PAGE_KEYS = ['home', 'video-mixer', 'privacy', 'stick-figure-army', 'thanks'];
const DOWNLOAD_KEYS = ['mac', 'windows', 'linux-web'];

const safeCount = (value) => Number.isSafeInteger(value) && value >= 0 ? value : 0;
const safeTimestamp = (value) => typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : null;

function emptySummary() {
    return {
        visits: 0,
        pageViews: 0,
        downloadClicks: 0,
        pages: Object.fromEntries(PAGE_KEYS.map((key) => [key, 0])),
        downloads: Object.fromEntries(DOWNLOAD_KEYS.map((key) => [key, 0]))
    };
}

function normalizeDay(value, date) {
    const summary = emptySummary();
    summary.date = date;
    summary.visits = safeCount(value?.visits);
    summary.pageViews = safeCount(value?.pageViews);
    summary.downloadClicks = safeCount(value?.downloadClicks);

    for (const key of PAGE_KEYS) summary.pages[key] = safeCount(value?.pages?.[key]);
    for (const key of DOWNLOAD_KEYS) summary.downloads[key] = safeCount(value?.downloads?.[key]);
    summary.lastPageViewAt = safeTimestamp(value?.lastPageViewAt);
    summary.lastDownloadClickAt = safeTimestamp(value?.lastDownloadClickAt);
    return summary;
}

function addSummary(target, source) {
    target.visits += source.visits;
    target.pageViews += source.pageViews;
    target.downloadClicks += source.downloadClicks;
    for (const key of PAGE_KEYS) target.pages[key] += source.pages[key];
    for (const key of DOWNLOAD_KEYS) target.downloads[key] += source.downloads[key];
}

async function readDays(store) {
    const { blobs } = await store.list({ prefix: 'production/daily/' });
    const entries = blobs
        .filter(({ key }) => /^production\/daily\/\d{4}-\d{2}-\d{2}$/.test(key))
        .sort((a, b) => a.key.localeCompare(b.key));
    const days = [];

    for (let index = 0; index < entries.length; index += 20) {
        const batch = entries.slice(index, index + 20);
        const values = await Promise.all(batch.map(async ({ key }) => {
            try {
                return await store.get(key, { type: 'json', consistency: 'strong' });
            } catch (error) {
                return null;
            }
        }));

        values.forEach((value, offset) => {
            if (!value) return;
            const date = batch[offset].key.slice(-10);
            days.push(normalizeDay(value, date));
        });
    }

    return days;
}

const jsonResponse = (body, status = 200, extraHeaders = {}) => new Response(JSON.stringify(body), {
    status,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'private, no-store',
        'X-Robots-Tag': 'noindex, nofollow',
        ...extraHeaders
    }
});

export default async (request) => {
    const expectedKey = process.env.ELYWARE_ANALYTICS_KEY;
    const suppliedKey = request.headers.get('authorization');

    if (!expectedKey) return jsonResponse({ error: 'Analytics access is not configured.' }, 503);
    if (suppliedKey !== `Bearer ${expectedKey}`) {
        return jsonResponse(
            { error: 'Incorrect analytics key.' },
            401,
            { 'WWW-Authenticate': 'Bearer realm="ELYWARE analytics"' }
        );
    }

    const store = getStore({ name: STORE_NAME, consistency: 'strong' });
    const days = await readDays(store);
    const allTime = emptySummary();
    const last30Days = emptySummary();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const firstDay = new Date(today);
    firstDay.setUTCDate(firstDay.getUTCDate() - 29);
    const firstDayLabel = firstDay.toISOString().slice(0, 10);

    for (const day of days) {
        addSummary(allTime, day);
        if (day.date >= firstDayLabel) addSummary(last30Days, day);
    }

    return jsonResponse({
        generatedAt: new Date().toISOString(),
        trackingStartedAt: days[0]?.date ?? null,
        lastActivity: {
            pageViewAt: [...days].reverse().find((day) => day.lastPageViewAt)?.lastPageViewAt ?? null,
            downloadClickAt: [...days].reverse().find((day) => day.lastDownloadClickAt)?.lastDownloadClickAt ?? null
        },
        allTime,
        last30Days,
        daily: days.filter((day) => day.date >= firstDayLabel).reverse()
    });
};

export const config = {
    path: '/api/analytics',
    method: 'GET',
    rateLimit: {
        windowLimit: 30,
        windowSize: 60,
        aggregateBy: ['ip', 'domain']
    }
};
