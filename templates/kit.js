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

    // Venue map: <g data-zone="Floor" data-price="$35" data-note="Standing room" tabindex="0" role="button">
    // inside .venue-map. The panel's [data-zone-name], [data-zone-price] and [data-zone-note] fill in on select.
    document.querySelectorAll('.venue-map').forEach((map) => {
        const zones = [...map.querySelectorAll('[data-zone]')];
        const fill = (key, value) => map.querySelectorAll(`[data-zone-${key}]`).forEach((el) => { el.textContent = value; });
        const select = (zone) => {
            zones.forEach((z) => z.setAttribute('aria-pressed', String(z === zone)));
            fill('name', zone.dataset.zone);
            fill('price', zone.classList.contains('sold') ? 'Sold out' : zone.dataset.price || '');
            fill('note', zone.dataset.note || '');
            const buy = map.querySelector('[data-zone-buy]');
            if (buy) {
                buy.hidden = zone.classList.contains('sold');
                if (zone.dataset.href) buy.href = zone.dataset.href;
            }
        };
        zones.forEach((zone) => {
            zone.setAttribute('aria-pressed', 'false');
            zone.addEventListener('click', () => select(zone));
            zone.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    select(zone);
                }
            });
        });
    });

    // Add to calendar: an element with data-cal-title, data-cal-start, data-cal-end (ISO with offset),
    // data-cal-location and data-cal-details. [data-cal-ics] downloads an .ics file, [data-cal-google] gets a link.
    const calStamp = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const icsEscape = (text = '') => text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
    document.querySelectorAll('[data-cal-title]').forEach((event) => {
        const d = event.dataset;
        const google = event.querySelector('[data-cal-google]');
        if (google) {
            const params = new URLSearchParams({
                action: 'TEMPLATE',
                text: d.calTitle,
                dates: `${calStamp(d.calStart)}/${calStamp(d.calEnd)}`,
                location: d.calLocation || '',
                details: d.calDetails || '',
            });
            google.href = `https://calendar.google.com/calendar/render?${params}`;
        }
        event.querySelectorAll('[data-cal-ics]').forEach((button) => {
            button.addEventListener('click', () => {
                const lines = [
                    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ELYWARE Kit//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
                    `UID:${calStamp(d.calStart)}-${d.calTitle.replace(/\W+/g, '-').toLowerCase()}@elyware-kit`,
                    `DTSTAMP:${calStamp(new Date().toISOString())}`,
                    `DTSTART:${calStamp(d.calStart)}`, `DTEND:${calStamp(d.calEnd)}`,
                    `SUMMARY:${icsEscape(d.calTitle)}`, `LOCATION:${icsEscape(d.calLocation)}`, `DESCRIPTION:${icsEscape(d.calDetails)}`,
                    'END:VEVENT', 'END:VCALENDAR',
                ];
                const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
                const link = Object.assign(document.createElement('a'), {
                    href: URL.createObjectURL(blob),
                    download: `${d.calTitle.replace(/[^\w ]+/g, '').trim().replace(/ +/g, '-').toLowerCase() || 'event'}.ics`,
                });
                link.click();
                setTimeout(() => URL.revokeObjectURL(link.href), 1000);
                button.closest('details')?.removeAttribute('open');
            });
        });
    });

    // Story strip: [data-story="viewer-id"] buttons open a dialog.story-viewer with .frame children.
    // Frames auto-advance every data-duration ms (default 5000). Taps on the left or right third step back or forward.
    document.querySelectorAll('dialog.story-viewer').forEach((viewer) => {
        const frames = [...viewer.querySelectorAll('.frame')];
        const bars = viewer.querySelector('.story-bars');
        bars.innerHTML = frames.map(() => '<span><i></i></span>').join('');
        const fills = [...bars.querySelectorAll('i')];
        const duration = Number(viewer.dataset.duration) || 5000;
        let index = 0;
        let started = 0;
        let raf = 0;
        const show = (i) => {
            if (i < 0) i = 0;
            if (i >= frames.length) { viewer.close(); return; }
            index = i;
            frames.forEach((f, n) => { f.hidden = n !== i; });
            fills.forEach((f, n) => f.style.setProperty('--fill', n < i ? 1 : 0));
            started = performance.now();
        };
        const tick = (now) => {
            if (!viewer.open) return;
            const t = Math.min(1, (now - started) / duration);
            fills[index].style.setProperty('--fill', t);
            if (t >= 1) show(index + 1);
            raf = requestAnimationFrame(tick);
        };
        viewer.querySelector('[data-story-prev]')?.addEventListener('click', () => show(index - 1));
        viewer.querySelector('[data-story-next]')?.addEventListener('click', () => show(index + 1));
        viewer.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') show(index + 1);
            if (event.key === 'ArrowLeft') show(index - 1);
        });
        viewer.addEventListener('close', () => cancelAnimationFrame(raf));
        viewer.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => viewer.close()));
        viewer.addEventListener('click', (event) => { if (event.target === viewer) viewer.close(); });
        document.querySelectorAll(`[data-story="${viewer.id}"]`).forEach((thumb) => {
            thumb.addEventListener('click', () => {
                viewer.showModal();
                show(Number(thumb.dataset.storyStart) || 0);
                thumb.classList.add('seen');
                // Under reduced motion the viewer waits for taps instead of auto-advancing.
                if (!reduceMotion) raf = requestAnimationFrame(tick);
            });
        });
    });

    // Waitlist: form[data-waitlist] posts JSON { email } to its action (a Netlify function, see functions/waitlist.mjs)
    // and expects { position }. The closest .waitlist gets .joined and [data-position] shows the number.
    // Opened from a local file there is no function, so it shows a sample position and says so.
    document.querySelectorAll('form[data-waitlist]').forEach((form) => {
        const box = form.closest('.waitlist');
        const status = box.querySelector('.form-status');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            let position;
            try {
                if (location.protocol === 'file:') throw new Error('local preview');
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: new FormData(form).get('email') }),
                });
                if (!response.ok) throw new Error(String(response.status));
                ({ position } = await response.json());
            } catch (error) {
                if (location.protocol !== 'file:') {
                    if (status) { status.textContent = 'That did not go through. Try again in a minute.'; status.className = 'form-status err'; }
                    return;
                }
                position = 128;
                if (status) { status.textContent = 'Local preview: sample position shown.'; status.className = 'form-status'; }
            }
            box.querySelectorAll('[data-position]').forEach((el) => { el.textContent = `#${Number(position).toLocaleString()}`; });
            box.classList.add('joined');
        });
    });

    // Command palette: dialog.palette with an <input> and <ul>. Items come from [data-palette-item] links
    // anywhere on the page (text from data-palette-item or the link text, hint from data-palette-hint).
    // Opens with Cmd+K, Ctrl+K, "/" or any [data-palette-open] button.
    document.querySelectorAll('dialog.palette').forEach((palette) => {
        const input = palette.querySelector('input');
        const list = palette.querySelector('ul');
        const items = [...document.querySelectorAll('[data-palette-item]')].map((a) => ({
            label: a.dataset.paletteItem || a.textContent.trim(),
            hint: a.dataset.paletteHint || '',
            href: a.getAttribute('href'),
        }));
        let active = 0;
        let shown = [];
        const escape = (text) => text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
        const render = () => {
            const q = input.value.trim().toLowerCase();
            shown = items.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(q));
            active = Math.min(active, Math.max(0, shown.length - 1));
            list.innerHTML = shown.length
                ? shown.map((item, i) => `<li role="option" id="pal-${i}" aria-selected="${i === active}"><a href="${escape(item.href)}" tabindex="-1">${escape(item.label)}<small>${escape(item.hint)}</small></a></li>`).join('')
                : '<li class="empty">No matches.</li>';
            input.setAttribute('aria-activedescendant', shown.length ? `pal-${active}` : '');
        };
        const open = () => {
            input.value = '';
            active = 0;
            render();
            palette.showModal();
            input.focus();
        };
        const go = (item) => {
            if (!item) return;
            palette.close();
            if (item.href.startsWith('#')) {
                document.querySelector(item.href)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
                history.replaceState(null, '', item.href);
            } else {
                window.location.href = item.href;
            }
        };
        input.addEventListener('input', () => { active = 0; render(); });
        input.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                if (!shown.length) return;
                active = (active + (event.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length;
                render();
                list.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
            }
            if (event.key === 'Enter') { event.preventDefault(); go(shown[active]); }
            // A search field clears itself on the first Escape. Close the palette instead.
            if (event.key === 'Escape') { event.preventDefault(); palette.close(); }
        });
        list.addEventListener('click', (event) => {
            const li = event.target.closest('li[role="option"]');
            if (!li) return;
            event.preventDefault();
            go(shown[Number(li.id.slice(4))]);
        });
        palette.addEventListener('click', (event) => { if (event.target === palette) palette.close(); });
        document.querySelectorAll('[data-palette-open]').forEach((b) => b.addEventListener('click', open));
        document.addEventListener('keydown', (event) => {
            const typing = event.target.closest?.('input, textarea, select, [contenteditable="true"]');
            if (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') || (event.key === '/' && !typing)) {
                if (palette.open) return;
                event.preventDefault();
                open();
            }
        });
    });
})();
