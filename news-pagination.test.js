const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const script = fs.readFileSync(path.join(__dirname, 'news-pagination.js'), 'utf8');

class MockButton {
    constructor() {
        this.dataset = {};
        this.listeners = {};
    }

    addEventListener(type, listener) {
        this.listeners[type] = listener;
    }

    setAttribute(name, value) {
        if (name === 'data-news-page') this.dataset.newsPage = value;
    }

    focus() {}

    click() {
        this.listeners.click?.();
    }
}

function createPagination({ width, cardCount, reducedMotion = false }) {
    let onReady;
    let scrollRequest;
    const buttons = [];
    const cards = Array.from({ length: cardCount }, () => ({ hidden: false }));
    const pages = {
        replaceChildren() {
            buttons.length = 0;
        },
        append(button) {
            buttons.push(button);
        },
        querySelector(selector) {
            const page = selector.match(/data-news-page="(\d+)"/)?.[1];
            return buttons.find((button) => button.dataset.newsPage === page) || null;
        }
    };
    const previousButton = { addEventListener() {} };
    const nextButton = { addEventListener() {} };
    const pagination = {
        querySelector(selector) {
            if (selector === '[data-news-pages]') return pages;
            if (selector === '[data-news-previous]') return previousButton;
            if (selector === '[data-news-next]') return nextButton;
            return null;
        }
    };
    const heading = { getBoundingClientRect: () => ({ top: 120 }) };
    const header = { getBoundingClientRect: () => ({ height: 80 }) };
    const document = {
        addEventListener(type, listener) {
            if (type === 'DOMContentLoaded') onReady = listener;
        },
        querySelector(selector) {
            if (selector === '.news-grid') return { querySelectorAll: () => cards };
            if (selector === '[data-news-pagination]') return pagination;
            if (selector === '.news-heading') return heading;
            if (selector === 'header') return header;
            return null;
        },
        createElement: () => new MockButton()
    };
    const window = {
        innerWidth: width,
        scrollY: 600,
        addEventListener() {},
        matchMedia: () => ({ matches: reducedMotion }),
        requestAnimationFrame: (callback) => callback(),
        scrollTo: (options) => {
            scrollRequest = options;
        }
    };

    vm.runInNewContext(script, { document, window, HTMLElement: MockButton });
    onReady();

    return {
        clickPage(page) {
            buttons.find((button) => button.dataset.newsPage === String(page)).click();
            return scrollRequest;
        }
    };
}

test('scrolls to the news heading after numbered-page navigation on mobile and desktop', () => {
    for (const width of [390, 1024]) {
        const pagination = createPagination({ width, cardCount: 13 });
        const scrollRequest = pagination.clickPage(2);

        assert.equal(scrollRequest.top, 624);
        assert.equal(scrollRequest.left, 0);
        assert.equal(scrollRequest.behavior, 'smooth');
    }
});

test('uses instant scrolling when reduced motion is preferred', () => {
    const pagination = createPagination({ width: 390, cardCount: 13, reducedMotion: true });
    const scrollRequest = pagination.clickPage(2);

    assert.equal(scrollRequest.top, 624);
    assert.equal(scrollRequest.left, 0);
    assert.equal(scrollRequest.behavior, 'instant');
});
