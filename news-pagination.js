document.addEventListener('DOMContentLoaded', () => {
    const newsGrid = document.querySelector('.news-grid');
    const pagination = document.querySelector('[data-news-pagination]');

    if (!newsGrid || !pagination) return;

    const cards = Array.from(newsGrid.querySelectorAll('.news-card'));
    const pages = pagination.querySelector('[data-news-pages]');
    const previousButton = pagination.querySelector('[data-news-previous]');
    const nextButton = pagination.querySelector('[data-news-next]');

    if (!cards.length || !pages || !previousButton || !nextButton) return;

    const getPageSize = () => {
        if (window.innerWidth <= 600) return 6;
        if (window.innerWidth <= 900) return 9;
        return 12;
    };
    const newsHeading = document.querySelector('.news-heading');
    const scrollToNewsHeading = () => {
        if (!newsHeading) return;

        window.requestAnimationFrame(() => {
            const headerHeight = document.querySelector('header')?.getBoundingClientRect().height || 0;
            const headingPosition = newsHeading.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
            const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
            window.scrollTo({ top: headingPosition, left: 0, behavior });
        });
    };

    let pageSize = getPageSize();
    let currentPage = 1;

    const renderPage = (restorePageFocus = false) => {
        pageSize = getPageSize();
        const pageCount = Math.max(1, Math.ceil(cards.length / pageSize));
        currentPage = Math.min(currentPage, pageCount);

        const start = (currentPage - 1) * pageSize;
        const end = Math.min(start + pageSize, cards.length);
        cards.forEach((card, index) => {
            card.hidden = index < start || index >= end;
        });

        pagination.hidden = pageCount <= 1;
        previousButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === pageCount;
        pages.replaceChildren();

        for (let page = 1; page <= pageCount; page += 1) {
            const pageButton = document.createElement('button');
            pageButton.type = 'button';
            pageButton.textContent = String(page);
            pageButton.setAttribute('aria-label', `Trang ${page}`);
            pageButton.dataset.newsPage = String(page);

            if (page === currentPage) {
                pageButton.setAttribute('aria-current', 'page');
            }

            pageButton.addEventListener('click', () => {
                currentPage = page;
                renderPage(true);
                scrollToNewsHeading();
            });
            pages.append(pageButton);
        }

        if (restorePageFocus) {
            pages.querySelector(`[data-news-page="${currentPage}"]`)?.focus({ preventScroll: true });
        }
    };

    previousButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage -= 1;
            renderPage();
            scrollToNewsHeading();
        }
    });

    nextButton.addEventListener('click', () => {
        const pageCount = Math.ceil(cards.length / pageSize);
        if (currentPage < pageCount) {
            currentPage += 1;
            renderPage();
            scrollToNewsHeading();
        }
    });

    window.addEventListener('resize', () => {
        const nextPageSize = getPageSize();
        if (nextPageSize !== pageSize) {
            const activeElement = document.activeElement;
            const focusedCardIndex = cards.findIndex(card => card.contains(activeElement));
            currentPage = focusedCardIndex >= 0
                ? Math.floor(focusedCardIndex / nextPageSize) + 1
                : 1;

            renderPage(activeElement instanceof HTMLElement && activeElement.hasAttribute('data-news-page'));
        }
    }, { passive: true });

    renderPage();
});
