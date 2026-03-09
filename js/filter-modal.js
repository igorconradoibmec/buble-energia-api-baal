document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('filter-modal');
    const overlay = document.getElementById('filter-modal-overlay');
    const openButtons = document.querySelectorAll('.filter-btn');
    const closeButton = document.getElementById('filter-modal-close');
    const clearButton = document.getElementById('filter-clear-btn');
    const applyButton = document.getElementById('filter-apply-btn');
    const filterForm = document.getElementById('filter-form');

    if (!modal || !overlay || !openButtons.length) {
        return;
    }

    const setModalState = (isOpen) => {
        modal.classList.toggle('active', isOpen);
        overlay.classList.toggle('active', isOpen);
        modal.setAttribute('aria-hidden', String(!isOpen));
        overlay.setAttribute('aria-hidden', String(!isOpen));
        document.body.classList.toggle('filter-modal-open', isOpen);
    };

    const openModal = () => setModalState(true);
    const closeModal = () => setModalState(false);

    openButtons.forEach((btn) => {
        btn.addEventListener('click', openModal);
    });

    overlay.addEventListener('click', closeModal);
    closeButton?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    clearButton?.addEventListener('click', () => {
        filterForm?.reset();
    });

    applyButton?.addEventListener('click', () => {
        if (filterForm) {
            const formData = new FormData(filterForm);
            const filters = {};
            formData.forEach((value, key) => {
                if (filters[key]) {
                    if (Array.isArray(filters[key])) {
                        filters[key].push(value);
                    } else {
                        filters[key] = [filters[key], value];
                    }
                } else {
                    filters[key] = value;
                }
            });

            document.dispatchEvent(new CustomEvent('filters:apply', {
                detail: { filters }
            }));
        }
        closeModal();
    });
});
