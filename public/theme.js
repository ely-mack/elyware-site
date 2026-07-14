(function initializePage() {
    try {
        const savedTheme = localStorage.getItem('elyware_theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            document.documentElement.dataset.theme = savedTheme;
            return;
        }
    } catch (error) {
        // Local storage can be unavailable in strict privacy modes.
    }

    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    document.documentElement.dataset.theme = prefersLight ? 'light' : 'dark';
})();
