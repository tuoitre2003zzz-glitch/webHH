const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const page = fs.readFileSync(path.join(__dirname, 'tin-tuc.html'), 'utf8');
const styles = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
const cards = [...page.matchAll(/<article\b[^>]*class="[^"]*\bnews-card\b[^"]*"[^>]*>[\s\S]*?<\/article>/g)]
    .map(([card]) => card);

test('shows ten original articles without publication dates or source links', () => {
    assert.equal(cards.length, 10);

    for (const card of cards) {
        assert.match(card, /href="bai-viet\/[^"]+\.html"/);
        assert.match(card, /aria-label="Đọc bài:/);
        assert.doesNotMatch(card, /news\.google\.com|Xem nguồn tin/);
        const category = card.match(/<span>([^<]*)<\/span>/)?.[1] ?? '';
        assert.doesNotMatch(category, /\b20\d{2}\b|\d{1,2}\/\d{1,2}\/\d{4}/);
        const title = card.match(/<h3>([^<]*)<\/h3>/)?.[1];
        const href = card.match(/href="bai-viet\/([^"]+\.html)"/)?.[1];
        assert.ok(title && href, 'each card has a title and an internal article');
        const article = fs.readFileSync(path.join(__dirname, 'bai-viet', href), 'utf8');
        assert.ok(article.includes(`<h1>${title}</h1>`), `${href} displays its card title`);
    }

    assert.doesNotMatch(page, /data-news-status/);
});

test('makes the full article card a clickable link target', () => {
    assert.match(styles, /\.news-card a::after\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;/s);

    for (const card of cards) {
        const href = card.match(/href="bai-viet\/([^"]+\.html)"/)?.[1];
        assert.ok(href, 'each card links to an internal article');
        assert.ok(fs.existsSync(path.join(__dirname, 'bai-viet', href)), `${href} exists`);
    }
});
