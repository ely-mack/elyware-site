const form = document.getElementById('analytics-login');
const keyInput = document.getElementById('analytics-key');
const status = document.getElementById('analytics-status');
const dashboard = document.getElementById('analytics-dashboard');
const numberFormat = new Intl.NumberFormat();

const setNumber = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = numberFormat.format(value ?? 0);
};

const renderDays = (days) => {
    const body = document.getElementById('analytics-days');
    body.replaceChildren();

    if (!days.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 4;
        cell.textContent = 'No activity recorded yet.';
        row.append(cell);
        body.append(row);
        return;
    }

    days.forEach((day) => {
        const row = document.createElement('tr');
        [day.date, day.visits, day.pageViews, day.downloadClicks].forEach((value, index) => {
            const cell = document.createElement('td');
            cell.textContent = index === 0 ? value : numberFormat.format(value ?? 0);
            row.append(cell);
        });
        body.append(row);
    });
};

const renderReport = (report) => {
    setNumber('month-visits', report.last30Days.visits);
    setNumber('month-page-views', report.last30Days.pageViews);
    setNumber('month-downloads', report.last30Days.downloadClicks);
    setNumber('all-visits', report.allTime.visits);
    setNumber('all-page-views', report.allTime.pageViews);
    setNumber('all-downloads', report.allTime.downloadClicks);
    setNumber('download-mac', report.allTime.downloads.mac);
    setNumber('download-windows', report.allTime.downloads.windows);
    setNumber('download-linux-web', report.allTime.downloads['linux-web']);

    const start = document.getElementById('tracking-start');
    start.textContent = report.trackingStartedAt ?? 'tracking began';
    const lastEvents = document.getElementById('analytics-last-events');
    const pageViewAt = report.lastActivity?.pageViewAt
        ? new Date(report.lastActivity.pageViewAt).toLocaleString()
        : 'none yet';
    const downloadAt = report.lastActivity?.downloadClickAt
        ? new Date(report.lastActivity.downloadClickAt).toLocaleString()
        : 'none yet';
    lastEvents.textContent = `Last page view: ${pageViewAt} · Last download click: ${downloadAt}`;
    renderDays(report.daily ?? []);
    dashboard.hidden = false;
};

form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    dashboard.hidden = true;
    status.textContent = 'Loading report…';

    try {
        const response = await fetch('/api/analytics', {
            headers: { Authorization: `Bearer ${keyInput.value}` },
            credentials: 'omit',
            cache: 'no-store',
            referrerPolicy: 'no-referrer'
        });
        const report = await response.json();
        if (!response.ok) throw new Error(report.error || 'Could not load analytics.');

        renderReport(report);
        status.textContent = `Updated ${new Date(report.generatedAt).toLocaleString()}.`;
        keyInput.value = '';
    } catch (error) {
        status.textContent = error instanceof Error ? error.message : 'Could not load analytics.';
    }
});
