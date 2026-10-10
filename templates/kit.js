// ELYWARE Kit behaviors. Load with <script src="kit.js" defer></script>.
// Load theme.js in <head> first so the page never flashes the wrong theme.
(function () {
    document.documentElement.classList.add('js');

    // Theme toggle: any button with [data-theme-toggle].
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
        button.addEventListener('click', () => {
            const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.dataset.theme = next;
            try {
                localStorage.setItem('elyware_theme', next);
            } catch (error) {
                // Storage can be blocked. The toggle still works for this visit.
            }
        });
    });

    // Mobile menu: [data-menu-toggle] controls the element named in aria-controls.
    document.querySelectorAll('[data-menu-toggle]').forEach((button) => {
        const menu = document.getElementById(button.getAttribute('aria-controls'));
        if (!menu) return;
        button.addEventListener('click', () => {
            const open = menu.classList.toggle('open');
            button.setAttribute('aria-expanded', String(open));
        });
        menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
            menu.classList.remove('open');
            button.setAttribute('aria-expanded', 'false');
        }));
    });

    // Scroll reveal: add data-reveal to any element.
    const revealed = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });
        revealed.forEach((el) => observer.observe(el));
    } else {
        revealed.forEach((el) => el.classList.add('is-visible'));
    }

    // Countdown: <div class="countdown" data-countdown="2026-12-31T20:00:00-07:00">.
    document.querySelectorAll('[data-countdown]').forEach((el) => {
        const target = new Date(el.dataset.countdown).getTime();
        const parts = ['days', 'hours', 'minutes', 'seconds'].map((unit) => el.querySelector(`[data-unit="${unit}"]`));
        const tick = () => {
            const left = Math.max(0, target - Date.now());
            const values = [
                Math.floor(left / 86400000),
                Math.floor(left / 3600000) % 24,
                Math.floor(left / 60000) % 60,
                Math.floor(left / 1000) % 60,
            ];
            parts.forEach((part, i) => { if (part) part.textContent = String(values[i]).padStart(2, '0'); });
            if (left === 0) clearInterval(timer);
        };
        const timer = setInterval(tick, 1000);
        tick();
    });

    // Email signup: forms with [data-signup] post to Netlify Forms without leaving the page.
    // Netlify only detects forms in deployed HTML, so this works on a deploy, not from a local file.
    document.querySelectorAll('form[data-signup]').forEach((form) => {
        const status = form.parentElement.querySelector('.form-status');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const say = (text, kind) => {
                if (!status) return;
                status.textContent = text;
                status.className = `form-status ${kind}`;
            };
            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(new FormData(form)).toString(),
                });
                if (!response.ok) throw new Error(response.statusText);
                form.reset();
                say(form.dataset.success || 'You are on the list.', 'ok');
            } catch (error) {
                say('That did not go through. Try again in a minute.', 'err');
            }
        });
    });
})();
