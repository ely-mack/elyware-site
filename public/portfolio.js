// Image links still open the preview when JavaScript is unavailable.
(() => {
    const dialog = document.getElementById('project-preview-dialog');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const image = document.getElementById('preview-dialog-image');
    const title = document.getElementById('preview-dialog-title');
    const caption = document.getElementById('preview-dialog-caption');
    let opener;

    document.querySelectorAll('.project-preview').forEach((link) => {
        link.addEventListener('click', (event) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            opener = link;
            image.src = link.href;
            image.alt = link.querySelector('img').alt;
            title.textContent = link.dataset.previewTitle;
            caption.textContent = link.dataset.previewCaption;
            dialog.showModal();
            document.documentElement.classList.add('preview-open');
        });
    });

    dialog.querySelector('.preview-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
        document.documentElement.classList.remove('preview-open');
        image.removeAttribute('src');
        opener?.focus({ preventScroll: true });
    });
})();
