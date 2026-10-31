// Showcase behaviors for the home and contact pages: work filters, command palette, copy email.
(() => {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Services, process and FAQ moved from the home page to /contact/. Keep old links working.
    const moved = { '#services': '#services', '#process': '#process', '#faq': '#faq' };
    if (window.location.pathname === '/' && moved[window.location.hash]) {
        window.location.replace(`/contact/${moved[window.location.hash]}`);
        return;
    }

    // Work wall filters. Each chip has data-filter; each card has data-tags.
    const cards = [...document.querySelectorAll('.wall-card')];
    const chips = [...document.querySelectorAll('.filter[data-filter]')];
    const status = document.getElementById('wall-status');

    const applyFilter = (tag) => {
        let shown = 0;
        chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.filter === tag)));
        cards.forEach((card) => {
            const match = tag === 'all' || card.dataset.tags.split(' ').includes(tag);
            card.hidden = !match;
            if (match) shown += 1;
        });
        if (status) status.textContent = `Showing ${shown} project${shown === 1 ? '' : 's'}.`;
    };

    chips.forEach((chip) => chip.addEventListener('click', () => applyFilter(chip.dataset.filter)));

    // Command palette. Items are any element with data-palette-item; links use their href, others their id.
    const palette = document.getElementById('palette');

    if (palette && typeof palette.showModal === 'function') {
        const input = palette.querySelector('input');
        const list = palette.querySelector('ul');
        const items = [...document.querySelectorAll('[data-palette-item]')].map((el) => ({
            label: el.dataset.paletteItem,
            hint: el.dataset.paletteHint || '',
            href: el.getAttribute('href') || `#${el.id}`
        }));
        let active = 0;
        let shown = [];

        const escapeHtml = (text) => text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

        const render = () => {
            const query = input.value.trim().toLowerCase();
            shown = items.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(query));
            active = Math.min(active, Math.max(0, shown.length - 1));
            list.innerHTML = shown.length
                ? shown.map((item, i) => `<li role="option" id="pal-${i}" aria-selected="${i === active}"><a href="${escapeHtml(item.href)}" tabindex="-1">${escapeHtml(item.label)}<small>${escapeHtml(item.hint)}</small></a></li>`).join('')
                : '<li class="empty">No matches. Try a venue, game or tool.</li>';
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

            if (!item.href.startsWith('#')) {
                window.location.href = item.href;
                return;
            }

            const target = document.querySelector(item.href);
            if (!target) return;
            if (target.hidden) applyFilter('all');
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
            history.replaceState(null, '', item.href);

            if (target.classList.contains('wall-card')) {
                target.classList.add('flash');
                setTimeout(() => target.classList.remove('flash'), 2200);
                target.querySelector('a')?.focus({ preventScroll: true });
            }
        };

        input.addEventListener('input', () => {
            active = 0;
            render();
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                if (!shown.length) return;
                active = (active + (event.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length;
                render();
                list.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
            }
            if (event.key === 'Enter') {
                event.preventDefault();
                go(shown[active]);
            }
            // A search field clears itself on the first Escape. Close the palette instead.
            if (event.key === 'Escape') {
                event.preventDefault();
                palette.close();
            }
        });

        list.addEventListener('click', (event) => {
            const option = event.target.closest('li[role="option"]');
            if (!option) return;
            event.preventDefault();
            go(shown[Number(option.id.slice(4))]);
        });

        palette.addEventListener('click', (event) => {
            if (event.target === palette) palette.close();
        });

        document.querySelectorAll('[data-palette-open]').forEach((button) => button.addEventListener('click', open));

        document.addEventListener('keydown', (event) => {
            const typing = event.target.closest?.('input, textarea, select, [contenteditable="true"]');
            const shortcut = ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') || (event.key === '/' && !typing);
            if (!shortcut || palette.open || document.querySelector('dialog[open]')) return;
            event.preventDefault();
            open();
        });
    }

    // Copy email buttons: data-copy holds the text.
    document.querySelectorAll('[data-copy]').forEach((button) => {
        const label = button.textContent;
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(button.dataset.copy);
                button.textContent = 'Copied';
            } catch (error) {
                button.textContent = 'Select and copy';
            }
            setTimeout(() => { button.textContent = label; }, 1800);
        });
    });
})();
