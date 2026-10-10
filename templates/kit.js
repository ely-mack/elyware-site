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

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Toasts: window.kitToast('Copied') from anywhere.
    let toastStack;
    window.kitToast = (message) => {
        if (!toastStack) {
            toastStack = document.createElement('div');
            toastStack.className = 'toast-stack';
            toastStack.setAttribute('role', 'status');
            toastStack.setAttribute('aria-live', 'polite');
            document.body.append(toastStack);
        }
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toastStack.append(toast);
        setTimeout(() => toast.remove(), 2600);
    };

    document.querySelectorAll('[data-toast]').forEach((button) => {
        button.addEventListener('click', () => window.kitToast(button.dataset.toast));
    });

    // Tabs: [role="tablist"] with [role="tab"] buttons whose aria-controls name a [role="tabpanel"].
    document.querySelectorAll('[role="tablist"]').forEach((list) => {
        const tabs = [...list.querySelectorAll('[role="tab"]')];
        const select = (tab) => {
            tabs.forEach((t) => {
                const on = t === tab;
                t.setAttribute('aria-selected', String(on));
                t.tabIndex = on ? 0 : -1;
                document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
            });
        };
        tabs.forEach((tab, i) => {
            tab.addEventListener('click', () => select(tab));
            tab.addEventListener('keydown', (event) => {
                const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
                if (event.key === 'Home' || event.key === 'End' || step) {
                    event.preventDefault();
                    const next = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1) : tabs[(i + step + tabs.length) % tabs.length];
                    select(next);
                    next.focus();
                }
            });
        });
    });

    // Switch: <button role="switch" data-switch="yearly"> toggles data-period on its [data-switch-scope].
    // Elements with data-monthly / data-yearly attributes swap their text.
    document.querySelectorAll('[role="switch"][data-switch]').forEach((button) => {
        const scope = button.closest('[data-switch-scope]') || document;
        const apply = (on) => {
            button.setAttribute('aria-checked', String(on));
            scope.querySelectorAll('[data-monthly]').forEach((el) => {
                el.textContent = on ? el.dataset.yearly : el.dataset.monthly;
            });
        };
        button.addEventListener('click', () => apply(button.getAttribute('aria-checked') !== 'true'));
        apply(button.getAttribute('aria-checked') === 'true');
    });

    // Before and after: <div class="compare"> with an <input type="range">.
    document.querySelectorAll('.compare input[type="range"]').forEach((range) => {
        const box = range.closest('.compare');
        const update = () => box.style.setProperty('--pos', `${range.value}%`);
        range.addEventListener('input', update);
        update();
    });

    // Carousel buttons: [data-carousel-prev] / [data-carousel-next] inside .carousel.
    document.querySelectorAll('.carousel').forEach((carousel) => {
        const track = carousel.querySelector('.carousel-track');
        const move = (dir) => {
            const item = track.firstElementChild;
            const step = item ? item.getBoundingClientRect().width + 16 : track.clientWidth;
            track.scrollBy({ left: dir * step, behavior: reduceMotion ? 'auto' : 'smooth' });
        };
        carousel.querySelector('[data-carousel-prev]')?.addEventListener('click', () => move(-1));
        carousel.querySelector('[data-carousel-next]')?.addEventListener('click', () => move(1));
    });

    // Spotlight: pointer position feeds the glow in .spotlight cards.
    document.querySelectorAll('.spotlight').forEach((card) => {
        card.addEventListener('pointermove', (event) => {
            const box = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${event.clientX - box.left}px`);
            card.style.setProperty('--my', `${event.clientY - box.top}px`);
        });
    });

    // Dialogs: [data-open="dialog-id"] opens, [data-close] closes, a click on the backdrop closes.
    document.querySelectorAll('[data-open]').forEach((opener) => {
        opener.addEventListener('click', () => {
            const dialog = document.getElementById(opener.dataset.open);
            if (!dialog) return;
            if (opener.dataset.caption !== undefined) {
                const caption = dialog.querySelector('figcaption');
                if (caption) caption.textContent = opener.dataset.caption;
            }
            dialog.showModal();
        });
    });
    document.querySelectorAll('dialog.modal').forEach((dialog) => {
        dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
        dialog.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => dialog.close()));
    });

    // Filter chips: [data-filter-group] holds chips with data-filter="all|tag"; items carry data-tags="a b".
    document.querySelectorAll('[data-filter-group]').forEach((group) => {
        const items = document.querySelectorAll(group.dataset.filterGroup);
        const chips = group.querySelectorAll('[data-filter]');
        chips.forEach((chip) => chip.addEventListener('click', () => {
            const tag = chip.dataset.filter;
            chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
            items.forEach((item) => {
                item.hidden = tag !== 'all' && !item.dataset.tags.split(' ').includes(tag);
            });
        }));
    });

    // Copy: [data-copy="text"] copies the text and shows a toast.
    document.querySelectorAll('[data-copy]').forEach((button) => {
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(button.dataset.copy);
                window.kitToast(button.dataset.copied || 'Copied');
            } catch (error) {
                window.kitToast('Copy failed. Select the text instead.');
            }
        });
    });

    // Sticky bar: .sticky-bar shows once the element named in data-sticky-after leaves the screen.
    document.querySelectorAll('.sticky-bar[data-sticky-after]').forEach((bar) => {
        const marker = document.querySelector(bar.dataset.stickyAfter);
        if (!marker || !('IntersectionObserver' in window)) return;
        new IntersectionObserver(([entry]) => {
            bar.classList.toggle('show', !entry.isIntersecting && entry.boundingClientRect.top < 0);
        }).observe(marker);
    });

    // Video hero: pause button, and no autoplay under reduced motion.
    document.querySelectorAll('[data-video-toggle]').forEach((button) => {
        const video = document.getElementById(button.getAttribute('aria-controls'));
        if (!video || !video.play) return;
        const label = (playing) => {
            button.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
            button.setAttribute('aria-pressed', String(!playing));
        };
        if (reduceMotion) video.pause();
        label(!video.paused && !reduceMotion);
        button.addEventListener('click', () => {
            if (video.paused) video.play(); else video.pause();
            label(!video.paused);
        });
    });

    // Scroll progress fallback for browsers without CSS scroll timelines.
    const progress = document.querySelector('.scroll-progress');
    if (progress && !CSS.supports('animation-timeline: scroll()')) {
        const update = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.setProperty('--progress', max > 0 ? window.scrollY / max : 0);
        };
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    // Counters: <strong data-count="1200" data-suffix="+">1200+</strong> counts up once when visible.
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
        const run = (el) => {
            const end = Number(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            const start = performance.now();
            const frame = (now) => {
                const t = Math.min(1, (now - start) / 1400);
                const eased = 1 - Math.pow(1 - t, 3);
                el.textContent = `${Math.round(end * eased).toLocaleString()}${suffix}`;
                if (t < 1) requestAnimationFrame(frame);
            };
            requestAnimationFrame(frame);
        };
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    run(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        counters.forEach((el) => {
            // Screen readers get the final number. The visible text starts at zero.
            el.setAttribute('aria-label', el.textContent.trim());
            el.textContent = `0${el.dataset.suffix || ''}`;
            counterObserver.observe(el);
        });
    }
})();
