// Theme control
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        const nextTheme = html.dataset.theme === 'dark' ? 'light' : 'dark';
        html.dataset.theme = nextTheme;

        try {
            localStorage.setItem('elyware_theme', nextTheme);
        } catch (error) {
            // The selected theme still applies for the current page view.
        }
    });
}

// Mobile navigation
const menuButton = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuButton && mobileMenu) {
    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        menuButton.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open menu');
    };

    menuButton.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        menuButton.classList.toggle('active', isOpen);
        menuButton.setAttribute('aria-expanded', String(isOpen));
        menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
            menuButton.focus();
        }
    });
}

// Reveal enhancements. Content remains visible when JavaScript is unavailable.
document.documentElement.classList.add('js');
const reveals = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

    reveals.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.classList.add('visible');
        } else {
            observer.observe(element);
        }
    });
} else {
    reveals.forEach((element) => element.classList.add('visible'));
}

// Smooth in-page navigation, while respecting reduced-motion preferences.
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', href);
    });
});

// Anonymous first-party measurement. No cookies, identities, referrers or media data.
(() => {
    const productionHosts = new Set(['elyware.net', 'www.elyware.net']);
    const pages = new Map([
        ['/', 'home'],
        ['/video-mixer/', 'video-mixer'],
        ['/privacy/', 'privacy'],
        ['/games/stick-figure-army/', 'stick-figure-army'],
        ['/thanks/', 'thanks']
    ]);

    const page = pages.get(window.location.pathname);
    const privacyOptOut = navigator.globalPrivacyControl === true
        || navigator.doNotTrack === '1'
        || navigator.doNotTrack === 'yes'
        || window.doNotTrack === '1';

    if (!productionHosts.has(window.location.hostname) || !page || privacyOptOut) return;

    const sendMetric = (payload) => {
        const body = JSON.stringify(payload);
        let queued = false;

        if (typeof navigator.sendBeacon === 'function') {
            queued = navigator.sendBeacon(
                '/api/telemetry',
                new Blob([body], { type: 'application/json' })
            );
        }

        if (!queued && typeof window.fetch === 'function') {
            void fetch('/api/telemetry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body,
                credentials: 'omit',
                keepalive: true,
                referrerPolicy: 'no-referrer'
            }).catch(() => {});
        }
    };

    let newVisit = true;
    try {
        const visitKey = 'elyware_visit_counted';
        newVisit = sessionStorage.getItem(visitKey) !== '1';
        if (newVisit) sessionStorage.setItem(visitKey, '1');
    } catch (error) {
        // A page view can still be counted when storage is unavailable.
    }

    sendMetric({ event: 'page_view', page, new_visit: newVisit });

    document.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        const link = target?.closest('a[data-download]');
        if (!link) return;

        sendMetric({
            event: 'download_click',
            download: link.dataset.download
        });
    });
})();
