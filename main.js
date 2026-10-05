{
    const pageLoadingStartedAt = performance.now();
    let pageLoadingFinished = false;

    const finishPageLoading = () => {
        if (pageLoadingFinished) return;
        pageLoadingFinished = true;
        const minimumDisplayTime = 750;
        const remainingDisplayTime = Math.max(0, minimumDisplayTime - (performance.now() - pageLoadingStartedAt));
        window.setTimeout(() => document.documentElement.classList.add('page-loaded'), remainingDisplayTime);
    };

    window.addEventListener('load', finishPageLoading, { once: true });
    window.setTimeout(finishPageLoading, 3000);
    if (document.readyState === 'complete') finishPageLoading();
}

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.slider-dot'));
    const heroTrack = document.querySelector('.hero-track');
    const heroPrevious = document.querySelector('.hero-arrow--prev');
    const heroNext = document.querySelector('.hero-arrow--next');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const catalogReturnKey = 'catalog-return-position';
    window.addEventListener('pageshow', (event) => {
        const navigationType = performance.getEntriesByType('navigation')[0]?.type;
        if (navigationType !== 'back_forward' && !event.persisted) return;

        const savedPosition = JSON.parse(sessionStorage.getItem(catalogReturnKey) || 'null');
        if (!savedPosition
            || savedPosition.page !== window.location.pathname
            || Date.now() - savedPosition.savedAt > 10 * 60 * 1000) return;

        sessionStorage.removeItem(catalogReturnKey);
        window.requestAnimationFrame(() => {
            window.scrollTo({ top: savedPosition.scrollY, left: 0, behavior: 'instant' });
        });
    });
    const isVietnameseMobile = (value) => /^(03[2-9]|05[2568]|07[06789]|08[156789]|09[0-9])\d{7}$/.test(value);
    let scrollAnimationId = 0;
    const smoothScrollTo = (targetY, duration = 650) => {
        window.cancelAnimationFrame(scrollAnimationId);
        const startY = window.scrollY;
        const distance = targetY - startY;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || Math.abs(distance) < 1) {
            window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
            return;
        }

        const startTime = performance.now();
        const animate = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = 1 - ((1 - progress) ** 3);
            window.scrollTo({ top: startY + (distance * easedProgress), left: 0, behavior: 'instant' });
            if (progress < 1) {
                scrollAnimationId = window.requestAnimationFrame(animate);
            } else {
                scrollAnimationId = 0;
            }
        };
        scrollAnimationId = window.requestAnimationFrame(animate);
    };
    const reloadScrollKey = 'site-page-reload-scroll';
    history.scrollRestoration = 'manual';
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem(reloadScrollKey, String(window.scrollY));
    });
    if (performance.getEntriesByType('navigation')[0]?.type === 'reload') {
        const previousScrollY = Number(sessionStorage.getItem(reloadScrollKey));
        sessionStorage.removeItem(reloadScrollKey);
        window.addEventListener('pageshow', () => {
            if (Number.isFinite(previousScrollY) && previousScrollY > 0) {
                window.scrollTo({ top: previousScrollY, left: 0, behavior: 'instant' });
            }
            window.requestAnimationFrame(() => smoothScrollTo(0));
        }, { once: true });
    } else {
        sessionStorage.removeItem(reloadScrollKey);
    }

    document.querySelectorAll('.brand-marquee-track').forEach((track) => {
        Array.from(track.children).forEach((set) => {
            track.appendChild(set.cloneNode(true));
        });
    });

    const articleWrap = document.querySelector('.article-wrap');
    if (articleWrap) {
        const articlePathPrefix = currentPage.startsWith('bai-viet-') ? '' : 'bai-viet/';
        const articleRootPrefix = currentPage.startsWith('bai-viet-') ? '../' : '';
        const articleBack = articleWrap.querySelector('.article-back:not(.article-back--bottom)');
        const articleBottomBack = articleWrap.querySelector('.article-back--bottom');
        const articleCategory = articleWrap.querySelector('.article-meta span:first-child');
        if (articleBack) articleBack.textContent = '← Quay lại danh sách bài viết';
        if (articleBottomBack) articleBottomBack.remove();
        if (articleCategory) articleCategory.outerHTML = `<a class="article-category" href="${articleRootPrefix}tin-tuc.html">Tin tức</a>`;
        if (!articleWrap.querySelector('.article-related')) {
            articleWrap.insertAdjacentHTML('beforeend', `<section class="article-related"><h2>Bài viết khác</h2><div class="article-related-grid"><a href="${articlePathPrefix}bai-viet-vat-lieu.html"><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=500&q=80" alt="Không gian phòng khách với vật liệu hoàn thiện"><span>Tin tức</span><strong>Chọn vật liệu theo cách bạn muốn sống</strong><em>Đọc bài ↗</em></a><a href="${articlePathPrefix}bai-viet-noi-that.html"><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=500&q=80" alt="Nội thất phòng ngủ thanh lịch"><span>Tin tức</span><strong>Ba lớp tạo nên một căn nhà dễ chịu</strong><em>Đọc bài ↗</em></a><a href="${articlePathPrefix}bai-viet-xay-dung.html"><img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=500&q=80" alt="Đội ngũ thi công tại công trình"><span>Tin tức</span><strong>Vì sao một đầu mối giúp dự án nhẹ hơn?</strong><em>Đọc bài ↗</em></a></div></section>`);
        }
    }

    const productCards = Array.from(document.querySelectorAll('.product-card[data-tile-size]'));
    const tileFilters = Array.from(document.querySelectorAll('.tile-filter'));
    const pagination = document.querySelector('.catalog-pagination');
    const materialSearch = document.querySelector('#material-search');
    const materialSize = document.querySelector('#material-size');
    const materialType = document.querySelector('#material-type');
    const materialPrice = document.querySelector('#material-price');
    const materialSort = document.querySelector('#material-sort');
    const materialApply = document.querySelector('#material-apply');
    const materialReset = document.querySelector('#material-reset');
    const materialCount = document.querySelector('#material-count');
    const materialSummary = document.querySelector('#material-summary');
    const materialEmpty = document.querySelector('#material-empty');
    const interiorProductGrid = document.querySelector('#interior-product-grid');
    if (interiorProductGrid) {
        const interiorProducts = [
            ['living-room', 'Phòng khách · Ghế thư giãn', 'Ghế thư giãn lưng gỗ', 'UPH-425V-134-A', 132760000, true, '21691/uph-425v-134-a_main-600x600-bc87582.jpg', 'living-room-5/chairs-2/fleur-wood-back-lounge-chair'],
            ['living-room', 'Phòng khách · Ghế thư giãn', 'Ghế thư giãn bọc vải màu kem', 'UPH-425V-031-A', 81530000, true, '21738/uph-425v-031-a_main-600x600-bc87582.jpg', 'living-room-5/chairs-2/seta-chair-oatmeal'],
            ['living-room', 'Phòng khách · Ghế thư giãn', 'Ghế bọc nệm nâu xám', 'UPH-425V-032-A', 91030000, true, '21748/uph-425v-032-a-600x600-bc87582.jpg', 'living-room-5/chairs-2/overlap-chair-dark-taupe'],
            ['living-room', 'Phòng khách · Ghế thư giãn', 'Ghế thư giãn dài nâu xám', 'UPH-425V-072-A', 222750000, true, '21758/uph-425v-072-a_main-600x600-bc87582.jpg', 'living-room-5/chairs-2/overlap-bedroom-chaise-dark-taupe'],
            ['living-room', 'Phòng khách · Ghế thư giãn', 'Ghế bọc nệm màu be', 'UPH-425V-032-B', 107370000, true, '21810/uph-425v-032-b_main-600x600-bc87582.jpg', 'living-room-5/chairs-2/overlap-chair-ecru'],
            ['living-room', 'Phòng khách · Ghế thư giãn', 'Ghế thư giãn dài màu be', 'UPH-425V-072-B', 260770000, true, '21811/uph-425v-072-b_main-600x600-bc87582.jpg', 'living-room-5/chairs-2/overlap-bedroom-chaise-ecru'],
            ['living-room', 'Phòng khách · Ghế thư giãn', 'Ghế thư giãn dáng ôm', 'UPH-425V-071-A', 219480000, true, '21850/uph-425v-071-a_main-600x600-bc87582.jpg', 'living-room-5/chairs-2/echo-lounge'],
            ['living-room', 'Phòng khách · Ghế thư giãn', 'Ghế thư giãn xanh ngọc', 'UPH-024-131-A', 118950000, true, '21443/uph-024-131-a.jpg', 'living-room-5/chairs-2/gelee-accent-chair-apatite'],
            ['dining-room', 'Phòng ăn · Ghế ăn', 'Ghế ăn lưng gỗ', 'UPH-425V-135-A', 85540000, true, '21672/uph-425v-135-a_main-600x600-bc87582.jpg', 'dinning-room/dining-chairs/fleur-wood-back-dining-chair'],
            ['dining-room', 'Phòng ăn · Ghế ăn', 'Ghế ăn có tay vịn', 'CLA-425V-272', 46330000, true, '21763/cla-425v-272_main-600x600-bc87582.jpg', 'dinning-room/dining-chairs/overlap-arm-dining-chair'],
            ['dining-room', 'Phòng ăn · Ghế ăn', 'Ghế ăn bọc nệm màu xanh lá', 'CLA-425V-291C', 38160000, true, '21808/cla-425v-291c_main-600x600-bc87582.jpg', 'dinning-room/dining-chairs/precipice-uph-dining-chair-eucalyptus'],
            ['dining-room', 'Phòng ăn · Ghế ăn', 'Ghế ăn bọc nệm màu vàng nghệ', 'CLA-425V-291A', 38160000, true, '21823/cla-425v-291a_main-600x600-bc87582.jpg', 'dinning-room/dining-chairs/precipice-uph-dining-chair-saffron'],
            ['dining-room', 'Phòng ăn · Ghế ăn', 'Ghế ăn bọc nệm màu kem', 'CLA-425V-291B', 38160000, true, '21824/cla-425v-291b_main-600x600-bc87582.jpg', 'dinning-room/dining-chairs/precipice-uph-dining-chair-oatmeal'],
            ['dining-room', 'Phòng ăn · Ghế quầy bar', 'Ghế bar Overlap màu trắng ngà', 'CLA-425V-301', 94890000, true, '21764/cla-425v-301_main-600x600-bc87582.jpg', 'dinning-room/bars-counter-stools-1/overlap-bar-stool-ivory'],
            ['dining-room', 'Phòng ăn · Ghế quầy bar', 'Ghế quầy thấp màu trắng ngà', 'CLA-425V-311', 92660000, true, '21765/cla-425v-311_main-600x600-bc87582.jpg', 'dinning-room/bars-counter-stools-1/overlap-counter-stool-ivory'],
            ['dining-room', 'Phòng ăn · Ghế quầy bar', 'Ghế bar dáng tròn', 'CLA-024-301', 61780000, true, '21481/cla-024-301.jpg', 'dinning-room/bars-counter-stools-1/another-round-bar-stool'],
            ['dining-room', 'Phòng ăn · Ghế quầy bar', 'Ghế quầy thấp dáng tròn', 'CLA-024-311', 58660000, true, '21482/cla-024-311.jpg', 'dinning-room/bars-counter-stools-1/another-round-counter-stool'],
            ['living-room', 'Phòng khách · Ghế băng', 'Sofa cong 2,2 m màu kem', 'UPH-025-017-A', 160680000, false, '22140/uph-025-017-a_main-600x600-bc87582.jpg', 'living-room-5/sofas/altura-88-sofa-pearl'],
            ['living-room', 'Phòng khách · Ghế băng', 'Sofa dài 2,6 m màu kem', 'UPH-025-015-A', 179690000, false, '22141/uph-025-015-a_main-600x600-bc87582.jpg', 'living-room-5/sofas/altura-104-sofa-pearl'],
            ['living-room', 'Phòng khách · Ghế băng', 'Sofa màu xanh lá', 'UPH-025-016-C', 233740000, false, '22125/uph-025-016-c_main-600x600-bc87582.jpg', 'living-room-5/sofas/chyrsalis-sofa-eucalyptus'],
            ['living-room', 'Phòng khách · Ghế băng', 'Sofa màu đỏ rượu', 'UPH-025-016-B', 233740000, false, '22132/uph-025-016-b_main-600x600-bc87582.jpg', 'living-room-5/sofas/chrysalis-sofa-rouge'],
            ['living-room', 'Phòng khách · Ghế băng', 'Sofa màu kem', 'UPH-025-115-A', 217700000, false, '22135/uph-025-115-a_main-600x600-bc87582.jpg', 'living-room-5/sofas/madera-sofa-oatmeal'],
            ['living-room', 'Phòng khách · Ghế băng ghép góc', 'Sofa góc không tay màu kem', 'UPH-025-ALH3-A', 161420000, true, '22126/uph-025-alh3-a_main-600x600-bc87582.jpg', 'living-room-5/sofas-module/madera-armless-laf-bumper-oatmeal'],
            ['living-room', 'Phòng khách · Bàn trang trí', 'Bàn trang trí tròn màu caramel', 'CLA-024-424', 116870000, true, '21450/cla-024-424.jpg', 'living-room-5/benches-ottomans-2/gelee-round-accent-table-caramello'],
            ['living-room', 'Phòng khách · Đôn', 'Đôn bọc nệm màu sáng', 'UPH-024-041-B', 74100000, true, '21493/uph-024-041-b.jpg', 'living-room-5/benches-ottomans-2/bello-ottoman'],
            ['living-room', 'Phòng khách · Đôn', 'Đôn bọc nệm màu tối', 'UPH-024-041-A', 73060000, true, '21509/uph-024-041-a.jpg', 'living-room-5/benches-ottomans-2/bello-ottoman-2'],
            ['living-room', 'Phòng khách · Đôn', 'Đôn tròn bọc vải', 'CLA-023-081', 34824000, true, '21120/cla-023-081.jpg', 'living-room-5/benches-ottomans-2/ritz'],
            ['bedroom', 'Phòng ngủ · Ghế băng cuối giường', 'Ghế băng cuối giường', 'CLA-424-083', 99350000, true, '21136/cla-424-083.jpg', 'living-room-5/benches-ottomans-2/for-the-love-of-bed-bench'],
            ['living-room', 'Phòng khách · Bàn trà', 'Bàn trà có kệ gỗ', 'CLA-425V-4027', 175820000, true, '21680/cla-425v-4027_main.jpg', 'living-room-5/cocktail-tables-2/fleur-open-cocktail-table-wwood-shelf'],
            ['living-room', 'Phòng khách · Bàn trà', 'Bàn trà tròn màu sáng', 'CLA-425V-4025', 160680000, true, '21719/cla-425v-4025_main-600x600-bc87582.jpg', 'living-room-5/cocktail-tables-2/overlap-round-cocktail-table-light'],
            ['living-room', 'Phòng khách · Bàn trà', 'Bàn trà dáng thấp', 'CLA-425V-4011', 190080000, true, '21732/cla-425v-4011_main-600x600-bc87582.jpg', 'living-room-5/cocktail-tables-2/counter-balance-cocktail-table'],
            ['living-room', 'Phòng khách · Bàn trà', 'Bàn trà vuông vân đá', 'CLA-425V-403', 86280000, true, '21736/cla-425v-403_main-600x600-bc87582.jpg', 'living-room-5/cocktail-tables-2/seta-square-cocktail-table-craze'],
            ['bedroom', 'Phòng ngủ · Giường', 'Giường bọc nệm cỡ lớn', 'CLA-425V-104', 209980000, true, '21717/cla-425v-104_main-600x600-bc87582.jpg', 'bed-room/beds/fleur-uph-queen-bed'],
            ['bedroom', 'Phòng ngủ · Giường', 'Giường bọc nệm cỡ đại', 'CLA-425V-124', 229140000, true, '21718/cla-425v-104_main-600x600-bc87582.jpg', 'bed-room/beds/fleur-uph-king-bed'],
            ['bedroom', 'Phòng ngủ · Giường', 'Giường dáng thấp cỡ lớn', 'CLA-425V-102', 143900000, true, '21726/cla-425v-102_main-600x600-bc87582.jpg', 'bed-room/beds/counter-balance-queen-bed'],
            ['bedroom', 'Phòng ngủ · Giường', 'Giường dáng thấp cỡ đại', 'CLA-425V-122', 160970000, true, '21727/cla-425v-102_main-600x600-bc87582.jpg', 'bed-room/beds/counter-balance-king-bed'],
            ['bedroom', 'Phòng ngủ · Tủ đầu giường', 'Tủ đầu giường cỡ nhỏ', 'CLA-425V-0610', 86430000, true, '21696/cla-425v-0610_main-600x600-bc87582.jpg', 'bed-room/nightstands/fleur-small-nightstand'],
            ['bedroom', 'Phòng ngủ · Tủ đầu giường', 'Tủ đầu giường kệ mở', 'CLA-425V-0611', 81680000, true, '21709/cla-425v-0611_main-600x600-bc87582.jpg', 'bed-room/nightstands/fleur-open-nightstand'],
            ['bedroom', 'Phòng ngủ · Tủ đầu giường', 'Tủ đầu giường cỡ lớn', 'CLA-425V-069', 101570000, true, '21716/cla-425v-069_main-600x600-bc87582.jpg', 'bed-room/nightstands/fleur-large-nightstand'],
            ['bedroom', 'Phòng ngủ · Bàn trang điểm', 'Bàn trang điểm màu tối', 'CLA-425V-075', 170180000, true, '21771/cla-425v-075_main-600x600-bc87582.jpg', 'bed-room/dressing-table/overlap-vanity-dark'],
            ['bedroom', 'Phòng ngủ · Bàn trang điểm', 'Bàn trang điểm màu sáng', 'CLA-425V-072', 170180000, true, '21801/cla-425v-072_main-600x600-bc87582.jpg', 'bed-room/dressing-table/overlap-vanity-light'],
            ['bedroom', 'Phòng ngủ · Bàn trang điểm', 'Bàn trang điểm nhiều ngăn', 'CLA-425V-073', 541130000, true, '21847/cla-425v-073_main-600x600-bc87582.jpg', 'bed-room/dressing-table/monaco-vanity'],
            ['bedroom', 'Phòng ngủ · Bàn trang điểm', 'Bàn trang điểm hiện đại', 'CLA-425V-074', 172410000, true, '21849/cla-425v-074_front-600x600-bc87582.jpg', 'bed-room/dressing-table/absinthe-vanity'],
            ['dining-room', 'Phòng ăn · Bàn ăn', 'Bàn ăn gỗ hiện đại', 'CLA-425V-2014', 304130000, true, '21669/cla-425v-2014c.jpg', 'dinning-room/dining-tables/fleur-dining-table'],
            ['dining-room', 'Phòng ăn · Bàn ăn', 'Bàn ăn chữ nhật màu tối', 'CLA-425V-2011', 331750000, true, '21762/cla-425v-2011_main-600x600-bc87582.jpg', 'dinning-room/dining-tables/overlap-rectangle-dining-table-dark'],
            ['dining-room', 'Phòng ăn · Bàn ăn', 'Bàn ăn tròn 152 cm màu sáng', 'CLA-425V-2021', 243090000, true, '21789/cla-425v-2021_main-600x600-bc87582.jpg', 'dinning-room/dining-tables/wish-you-were-here-60-rnd-dining-tbl-lt'],
            ['dining-room', 'Phòng ăn · Bàn ăn', 'Bàn ăn chữ nhật màu sáng', 'CLA-425V-2024', 331750000, true, '21806/cla-425v-2024_main-600x600-bc87582.jpg', 'dinning-room/dining-tables/overlap-rectangle-dinig-tbl-light'],
            ['dining-room', 'Phòng ăn · Tủ buffet', 'Tủ buffet dáng thanh lịch', 'CLA-425V-256', 275620000, true, '21675/cla-425v-256_main-600x600-bc87582.jpg', 'dinning-room/sideboards-1/fleur-sideboard'],
            ['dining-room', 'Phòng ăn · Tủ buffet', 'Tủ buffet kệ mở', 'CLA-425V-2511', 351650000, true, '21678/cla-425v-2511_main-600x600-bc87582.jpg', 'dinning-room/sideboards-1/fleur-open-sideboard'],
            ['dining-room', 'Phòng ăn · Tủ buffet', 'Tủ buffet màu tối', 'CLA-425V-254', 322250000, true, '21761/cla-425v-254_main-600x600-bc87582.jpg', 'dinning-room/sideboards-1/overlap-sideboard-dark'],
            ['working-room', 'Phòng làm việc · Bàn làm việc', 'Bàn làm việc thanh mảnh', 'CLA-023-532', 113900000, true, '21135/cla-023-532.jpg', 'working-room/consoles-desks-1/axis'],
            ['decor', 'Gương & phụ kiện · Gương soi', 'Gương toàn thân khung tối', 'CLA-425V-042', 256460000, true, '21767/cla-425v-042_main-600x600-bc87582.jpg', 'decor-accessories/mirrors/overlap-floor-mirror-dark'],
            ['decor', 'Gương & phụ kiện · Gương soi', 'Gương treo tường khung tối', 'CLA-425V-043', 94890000, true, '21768/cla-425v-043_main-600x600-bc87582.jpg', 'decor-accessories/mirrors/overlap-wall-mirror-dark'],
            ['decor', 'Gương & phụ kiện · Gương soi', 'Gương toàn thân khung sáng', 'CLA-425V-044', 256460000, true, '21796/cla-425v-044_main-600x600-bc87582.jpg', 'decor-accessories/mirrors/overlap-floor-mirror-light']
        ];
        const productNumberFormat = new Intl.NumberFormat('vi-VN');
        const productImageRoot = 'https://cdchomedesigncenter.com/Data/Sites/1/Product/';

        interiorProductGrid.replaceChildren(...interiorProducts.map(([category, room, name, , price, isPriceFrom, imagePath]) => {
            const card = document.createElement('article');
            card.className = 'card product-card interior-product-card';
            card.dataset.interiorCategory = category;
            card.dataset.interiorPrice = String(price);

            const image = document.createElement('img');
            image.src = productImageRoot + imagePath;
            image.alt = name;
            image.loading = 'lazy';
            image.decoding = 'async';
            card.appendChild(image);

            const content = document.createElement('div');
            content.className = 'card-content';
            const topline = document.createElement('div');
            topline.className = 'product-topline';
            const title = document.createElement('h3');
            title.textContent = name;
            const priceLabel = document.createElement('span');
            priceLabel.className = 'price';
            priceLabel.textContent = `${isPriceFrom ? 'Từ ' : ''}${productNumberFormat.format(price)} ₫`;
            topline.append(title, priceLabel);

            const categoryLabel = document.createElement('span');
            categoryLabel.className = 'interior-product-room';
            categoryLabel.textContent = room;
            content.append(topline, categoryLabel);
            card.appendChild(content);
            return card;
        }));
        interiorProductGrid.hidden = false;
    }

    const interiorCards = Array.from(document.querySelectorAll('#interior-product-grid .product-card[data-interior-category]'));
    const buildProductDetailUrl = (type, card) => {
        const image = card.querySelector('img');
        const name = card.querySelector('h3')?.textContent.trim() || '';
        const priceText = type === 'vat-lieu'
            ? card.querySelector('.material-price-value')?.textContent
            : card.dataset.interiorPrice;
        const price = Number((priceText || '').replace(/[^\d]/g, ''));
        const params = new URLSearchParams({
            nhom: type,
            ten: name,
            loai: type === 'vat-lieu'
                ? 'Gạch ốp lát'
                : card.querySelector('.interior-product-room')?.textContent.trim() || '',
            gia: String(price),
            anh: image?.getAttribute('src') || '',
            nguon: type === 'vat-lieu' ? 'vat-lieu.html' : 'noi-that.html'
        });

        if (type === 'vat-lieu') {
            params.set('kich-thuoc', card.dataset.tileSize || '');
            params.set('don-vi', card.querySelector('.material-price-unit')?.textContent.trim() || '');
        } else {
            params.set('gia-tu', card.querySelector('.price')?.textContent.trim().startsWith('Từ ') ? '1' : '0');
        }
        params.set('v', '20261005-site');

        return `chi-tiet-san-pham.html?${params.toString()}`;
    };

    const enableProductDetailNavigation = (cards, type) => {
        cards.forEach((card) => {
            card.tabIndex = 0;
            card.setAttribute('role', 'link');
            card.setAttribute('aria-label', `Xem thông tin ${card.querySelector('h3')?.textContent.trim() || 'sản phẩm'}`);
            const rememberCatalogPosition = () => {
                sessionStorage.setItem(catalogReturnKey, JSON.stringify({
                    page: window.location.pathname,
                    url: window.location.href,
                    scrollY: window.scrollY,
                    savedAt: Date.now()
                }));
            };
            card.addEventListener('click', () => {
                rememberCatalogPosition();
                window.location.href = buildProductDetailUrl(type, card);
            });
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    rememberCatalogPosition();
                    window.location.href = buildProductDetailUrl(type, card);
                }
            });
        });
    };

    enableProductDetailNavigation(productCards, 'vat-lieu');
    enableProductDetailNavigation(interiorCards, 'noi-that');

    const productDetail = document.querySelector('#product-detail');
    if (productDetail) {
        const params = new URLSearchParams(window.location.search);
        const type = params.get('nhom');
        const name = params.get('ten')?.trim();
        const category = params.get('loai')?.trim();
        const imagePath = params.get('anh')?.trim();
        const price = Number(params.get('gia'));
        const sourcePage = params.get('nguon');
        const isValidImage = (value) => {
            if (!value || value.startsWith('/') || value.includes('\\') || /(^|\/)\.\.(\/|$)/.test(value)) return false;
            try {
                const imageUrl = new URL(value, document.baseURI);
                if (imageUrl.origin === window.location.origin) {
                    const siteRoot = new URL('.', document.baseURI).pathname;
                    return imageUrl.pathname.startsWith(siteRoot);
                }
                if (imageUrl.protocol === 'https:') {
                    if (imageUrl.hostname === 'cdchomedesigncenter.com') {
                        return imageUrl.pathname.startsWith('/Data/Sites/1/Product/');
                    }
                    return ['hailinh.com.vn', 'www.hailinh.com.vn', 'images.hailinh.com.vn'].includes(imageUrl.hostname)
                        && imageUrl.pathname.startsWith('/uploads/shops/');
                }
                return !/^[a-z][a-z\d+.-]*:/i.test(value) && !value.startsWith('//');
            } catch {
                return false;
            }
        };
        const isValidProduct = (['vat-lieu', 'noi-that'].includes(type || '')
            && Boolean(name)
            && Boolean(category)
            && Number.isFinite(price)
            && price > 0
            && isValidImage(imagePath));

        const detailContent = document.querySelector('#product-detail-content');
        const errorContent = document.querySelector('#product-detail-error');
        const backLink = document.querySelector('#product-detail-back');
        if (isValidProduct && detailContent && errorContent && backLink) {
            const safeSourcePage = sourcePage === 'noi-that.html' ? sourcePage : 'vat-lieu.html';
            const image = document.querySelector('#product-detail-image');
            const contactLink = document.querySelector('#product-detail-contact');
            const priceValue = document.querySelector('#product-detail-price');
            const priceUnit = document.querySelector('#product-detail-unit');
            const facts = document.querySelector('#product-detail-facts');
            const priceLabel = document.querySelector('#product-detail-price-label');
            const note = document.querySelector('#product-detail-note');
            const description = document.querySelector('#product-detail-description');
            const usesList = document.querySelector('#product-detail-uses');
            const thumbnails = document.querySelector('#product-gallery-thumbnails');
            const size = params.get('kich-thuoc');
            const unit = params.get('don-vi');
            const isPriceFrom = params.get('gia-tu') === '1';
            const formatter = new Intl.NumberFormat('vi-VN');

            backLink.href = safeSourcePage;
            backLink.addEventListener('click', (event) => {
                const savedPosition = JSON.parse(sessionStorage.getItem(catalogReturnKey) || 'null');
                const sourcePath = new URL(safeSourcePage, window.location.href).pathname;
                const savedUrl = savedPosition?.url ? new URL(savedPosition.url) : null;
                if (history.length > 1
                    && savedPosition?.page === sourcePath
                    && savedUrl?.pathname === sourcePath
                    && Date.now() - savedPosition.savedAt <= 10 * 60 * 1000) {
                    event.preventDefault();
                    history.back();
                }
            });
            document.querySelector('#product-detail-eyebrow').textContent = type === 'vat-lieu' ? 'VẬT LIỆU XÂY DỰNG' : 'SẢN PHẨM NỘI THẤT';
            document.querySelector('#product-detail-name').textContent = name;
            document.querySelector('#product-detail-category').textContent = category;
            image.src = imagePath;
            image.alt = name;
            priceValue.textContent = formatter.format(price) + ' ₫';
            priceUnit.textContent = unit || '';
            priceLabel.textContent = type === 'vat-lieu' ? 'Giá tham khảo' : isPriceFrom ? 'Giá từ' : 'Giá tham khảo';
            note.textContent = type === 'vat-lieu'
                ? 'Giá vật liệu mang tính tham khảo; vui lòng liên hệ để xác nhận theo số lượng và thời điểm.'
                : 'Vui lòng liên hệ để xác nhận giá và thông tin sản phẩm mới nhất.';

            const getProductGuidance = () => {
                if (type === 'vat-lieu') {
                    const isOutdoor = /sân|ngoài trời|ban công/i.test(name);
                    return {
                        description: `Gạch ${size ? `khổ ${size} cm ` : ''}dùng để hoàn thiện bề mặt sàn hoặc tường, tạo lớp phủ dễ vệ sinh và đồng bộ với phong cách không gian. Nên chọn bề mặt và quy cách theo vị trí thi công thực tế.`,
                        uses: isOutdoor
                            ? ['Lát sân vườn, hiên nhà hoặc ban công', 'Tham khảo bề mặt phù hợp khu vực ngoài trời']
                            : ['Lát nền phòng khách, phòng ngủ hoặc khu sinh hoạt', 'Có thể tham khảo để ốp tường trang trí']
                    };
                }

                const normalizedCategory = category.toLowerCase();
                if (/ghế thư giãn/.test(normalizedCategory)) {
                    return {
                        description: 'Ghế tạo chỗ ngồi riêng để đọc sách, nghỉ ngơi hoặc tiếp khách. Kiểu dáng và màu sắc giúp bổ sung điểm nhấn cho khu vực sinh hoạt.',
                        uses: ['Đặt tại phòng khách hoặc góc đọc sách', 'Phối cùng sofa, bàn phụ và đèn đứng']
                    };
                }
                if (/ghế ăn/.test(normalizedCategory)) {
                    return {
                        description: 'Ghế dùng cho khu vực ăn uống, hỗ trợ tư thế ngồi thoải mái trong bữa ăn và có thể phối cùng bàn ăn phù hợp.',
                        uses: ['Bố trí quanh bàn ăn gia đình', 'Dùng trong phòng ăn hoặc khu vực dùng bữa']
                    };
                }
                if (/ghế quầy bar/.test(normalizedCategory)) {
                    return {
                        description: 'Ghế quầy cao dùng tại bàn bar hoặc quầy bếp. Nên đối chiếu chiều cao ghế với mặt quầy trước khi lựa chọn.',
                        uses: ['Bố trí tại quầy bar gia đình', 'Dùng cạnh đảo bếp hoặc quầy cao phù hợp']
                    };
                }
                if (/ghế băng cuối giường/.test(normalizedCategory)) {
                    return {
                        description: 'Ghế băng bổ sung chỗ ngồi và bề mặt đặt đồ ở cuối giường, đồng thời hoàn thiện bố cục phòng ngủ.',
                        uses: ['Đặt ở cuối giường', 'Dùng trong phòng ngủ hoặc phòng thay đồ']
                    };
                }
                if (/ghế|sofa|đôn/.test(normalizedCategory)) {
                    return {
                        description: 'Sản phẩm tạo chỗ ngồi tiện nghi cho sinh hoạt, tiếp khách và thư giãn. Có thể phối cùng bàn trà để hoàn thiện khu vực tiếp khách.',
                        uses: ['Bố trí trong phòng khách hoặc không gian sinh hoạt chung', 'Dùng làm chỗ ngồi thư giãn hằng ngày']
                    };
                }
                if (/giường|tủ đầu giường|bàn trang điểm/.test(normalizedCategory)) {
                    return {
                        description: 'Sản phẩm phục vụ sinh hoạt và lưu trữ trong phòng ngủ, giúp sắp xếp không gian nghỉ ngơi gọn gàng, thuận tiện.',
                        uses: ['Bố trí trong phòng ngủ gia đình hoặc phòng nghỉ', 'Phối hợp với giường và nội thất phòng ngủ']
                    };
                }
                if (/bàn ăn|tủ buffet/.test(normalizedCategory)) {
                    return {
                        description: 'Sản phẩm hỗ trợ sinh hoạt, dùng bữa và sắp xếp vật dụng trong khu vực ăn uống; phù hợp để phối đồng bộ cùng bộ bàn ghế.',
                        uses: ['Bố trí tại phòng ăn hoặc khu vực sinh hoạt chung', 'Dùng làm nơi dùng bữa hoặc lưu trữ đồ dùng']
                    };
                }
                if (/bàn trà|bàn trang trí/.test(normalizedCategory)) {
                    return {
                        description: 'Món nội thất bổ trợ giúp đặt đồ dùng thường ngày và cân đối bố cục khu vực tiếp khách.',
                        uses: ['Bố trí cạnh sofa hoặc ghế thư giãn', 'Dùng đặt sách, khay trà và vật dụng trang trí']
                    };
                }
                if (/bàn làm việc/.test(normalizedCategory)) {
                    return {
                        description: 'Bề mặt làm việc giúp sắp xếp máy tính, tài liệu và vật dụng cần thiết cho công việc hoặc học tập.',
                        uses: ['Bố trí trong phòng làm việc hoặc góc học tập', 'Kết hợp cùng ghế và đèn bàn phù hợp']
                    };
                }
                if (/gương/.test(normalizedCategory)) {
                    return {
                        description: 'Gương hỗ trợ nhu cầu soi và góp phần tạo cảm giác sáng, thoáng cho không gian.',
                        uses: ['Bố trí tại phòng ngủ, lối vào hoặc khu vực thay đồ', 'Chọn vị trí lắp đặt phù hợp với diện tích và ánh sáng']
                    };
                }
                return {
                    description: 'Sản phẩm nội thất có thể kết hợp cùng các món đồ phù hợp để hoàn thiện công năng và bố cục không gian.',
                    uses: ['Tham khảo bố trí tại không gian gia đình phù hợp', 'Liên hệ để được tư vấn kích thước và cách phối hợp']
                };
            };
            const guidance = getProductGuidance();
            description.textContent = guidance.description;
            usesList.replaceChildren(...guidance.uses.map((use) => {
                const item = document.createElement('li');
                item.textContent = use;
                return item;
            }));

            const getImageIdentity = (src) => {
                const imageUrl = new URL(src, document.baseURI);
                return imageUrl.pathname.toLowerCase().replace(/\.(?:jpe?g|png|webp)$/i, '');
            };
            const imageViews = [{ src: imagePath }];
            const imageIdentities = new Set([getImageIdentity(imagePath)]);
            const supplementaryImages = type === 'noi-that'
                ? (() => {
                    const productFolder = imagePath.match(/\/Product\/(\d+)\//)?.[1];
                    return window.productGalleryImages?.interior?.[productFolder] || [];
                })()
                : window.productGalleryImages?.tiles?.[imagePath] || [];
            supplementaryImages.filter(isValidImage).forEach((src) => {
                const identity = getImageIdentity(src);
                if (imageIdentities.has(identity)) return;
                imageIdentities.add(identity);
                imageViews.push({ src });
            });

            const selectImageView = (view, selectedButton) => {
                image.src = view.src;
                image.alt = name;
                thumbnails.querySelectorAll('.product-gallery-thumbnail').forEach((button) => {
                    const isSelected = button === selectedButton;
                    button.classList.toggle('is-active', isSelected);
                    button.setAttribute('aria-pressed', String(isSelected));
                });
            };

            thumbnails.replaceChildren(...imageViews.map((view, index) => {
                const button = document.createElement('button');
                button.className = `product-gallery-thumbnail${index === 0 ? ' is-active' : ''}`;
                button.type = 'button';
                button.setAttribute('aria-label', `Ảnh ${index + 1} của ${name}`);
                button.setAttribute('aria-pressed', String(index === 0));
                const thumbnailImage = document.createElement('img');
                thumbnailImage.src = view.src;
                thumbnailImage.alt = '';
                thumbnailImage.loading = 'eager';
                thumbnailImage.addEventListener('error', () => {
                    if (index === 0) return;
                    const wasSelected = button.classList.contains('is-active');
                    button.remove();
                    if (wasSelected) {
                        selectImageView(imageViews[0], thumbnails.querySelector('.product-gallery-thumbnail'));
                    }
                }, { once: true });
                button.appendChild(thumbnailImage);
                button.addEventListener('click', () => selectImageView(view, button));
                return button;
            }));
            selectImageView(imageViews[0], thumbnails.querySelector('.product-gallery-thumbnail'));

            const factValues = [
                ['Danh mục', category],
                ...(size ? [['Kích thước', `${size} cm`]] : [])
            ];
            facts.replaceChildren(...factValues.map(([label, value]) => {
                const fact = document.createElement('div');
                fact.className = 'product-detail-fact';
                const factLabel = document.createElement('span');
                factLabel.textContent = label;
                const factValue = document.createElement('strong');
                factValue.textContent = value;
                fact.append(factLabel, factValue);
                return fact;
            }));

            const contactParams = new URLSearchParams({
                'san-pham': name,
                'dich-vu': type === 'vat-lieu' ? 'Tư vấn vật liệu xây dựng' : 'Tư vấn Thiết kế Nội thất'
            });
            contactLink.href = `lien-he.html?${contactParams.toString()}`;
            document.title = `${name} | Hoàng Hải Luxury`;
            detailContent.hidden = false;
            errorContent.hidden = true;
        } else {
            detailContent?.setAttribute('hidden', '');
            errorContent?.removeAttribute('hidden');
            if (backLink) backLink.hidden = true;
        }
    }

    const interiorFilters = Array.from(document.querySelectorAll('.interior-filter'));
    const interiorPagination = document.querySelector('.interior-pagination');
    const interiorSearch = document.querySelector('#interior-search');
    const interiorType = document.querySelector('#interior-type');
    const interiorPrice = document.querySelector('#interior-price');
    const interiorSort = document.querySelector('#interior-sort');
    const interiorApply = document.querySelector('#interior-apply');
    const interiorReset = document.querySelector('#interior-reset');
    const interiorSummary = document.querySelector('#interior-summary');
    const interiorCount = document.querySelector('#interior-count');
    const interiorEmpty = document.querySelector('#interior-empty');
    const contactForm = document.querySelector('#contact-form');
    const formStatus = document.querySelector('#form-status');
    if (contactForm) {
        const contactParams = new URLSearchParams(window.location.search);
        const requestedProduct = contactParams.get('san-pham')?.trim();
        const requestedService = contactParams.get('dich-vu');
        if (requestedProduct) {
            const serviceField = contactForm.elements['Dịch vụ quan tâm'];
            const messageField = contactForm.elements['Nội dung yêu cầu'];
            if (serviceField && Array.from(serviceField.options).some((option) => option.value === requestedService)) {
                serviceField.value = requestedService;
            }
            if (messageField) {
                messageField.value = `Tôi muốn được tư vấn về mẫu: ${requestedProduct.slice(0, 120)}`;
            }
        }
    }
    const estimateForm = document.querySelector('#house-estimate-form');
    const estimateTotal = document.querySelector('#estimate-total');
    const estimateArea = document.querySelector('#estimate-area');
    const estimateFloorDetail = document.querySelector('#estimate-floor-detail');
    const estimateFoundationDetail = document.querySelector('#estimate-foundation-detail');
    const estimateRoofDetail = document.querySelector('#estimate-roof-detail');
    const estimateFloorArea = document.querySelector('#estimate-floor-area');
    const estimateUnitPrice = document.querySelector('#estimate-unit-price');
    const promoCountdown = document.querySelector('[data-promo-countdown]');
    const promoHours = document.querySelector('[data-promo-hours]');
    const promoMinutes = document.querySelector('[data-promo-minutes]');
    const promoSeconds = document.querySelector('[data-promo-seconds]');
    const packagePreview = document.querySelector('#estimate-package-preview');
    const packageList = document.querySelector('#estimate-package-list');
    const packageTableWrap = document.querySelector('#estimate-package-table-wrap');
    const packageNotes = document.querySelector('#estimate-package-notes');

    if (packagePreview) {
        packagePreview.hidden = true;
    }
    if (packageTableWrap) {
        packageTableWrap.hidden = true;
    }
    if (packageNotes) {
        packageNotes.hidden = true;
    }

    if (promoCountdown && promoHours && promoMinutes && promoSeconds) {
        const getVietnamNow = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));

        const updatePromoCountdown = () => {
            const now = getVietnamNow();
            const nextMidnight = new Date(now);
            nextMidnight.setDate(nextMidnight.getDate() + 1);
            nextMidnight.setHours(0, 0, 0, 0);

            const remaining = Math.max(0, nextMidnight.getTime() - now.getTime());
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            promoHours.textContent = String(hours).padStart(2, '0');
            promoMinutes.textContent = String(minutes).padStart(2, '0');
            promoSeconds.textContent = String(seconds).padStart(2, '0');

            if (remaining <= 0) {
                promoCountdown.classList.add('is-expired');
                if (promoCountdown.querySelector('p')) {
                    promoCountdown.querySelector('p').textContent = 'Ưu đãi đã kết thúc, vui lòng liên hệ để được tư vấn.';
                }
            }
        };

        updatePromoCountdown();
        window.setInterval(updatePromoCountdown, 1000);
    }

    const finishingMaterialsTemplate = [
        { name: 'Gạch lát nền phòng khách, sinh hoạt chung, bếp - Gạch ceramic 60x60', image: 'img/gach60x60.jpg' },
        { name: 'Gạch lát nền phòng ngủ - Gạch ceramic 60x60', image: 'img/gach60x60.jpg' },
        { name: 'Gạch lát nền vệ sinh chống trơn - Gạch ceramic 30x30', image: 'img/img_bangvattu/gach chong tron cmc 30x30 DG3036.png' },
        { name: 'Gạch ốp tường vệ sinh - Gạch ceramic 30x60', image: 'img/img_bangvattu/gach-op-tuong-30x60-mo-5355.jpg' },
        { name: 'Gạch lát balcon + sân thượng - 40x40 chống trơn', image: 'img/img_bangvattu/gach40x40 gạch lát ban công sân thượng.jpg' },
        { name: 'Đá lát tam cấp + cầu thang + mặt bếp - Đen Campuchia / Nâu Anh Quốc', image: 'img/img_bangvattu/đá lát tam cấp đen campuchia.png' },
        { name: 'Gạch trang trí', image: '', imageText: 'Theo phối cảnh' },
        { name: 'Cửa đi chính, cửa hậu, cửa balcon, cửa vệ sinh + khóa - Nhôm Namsung hệ 1000 + Khóa tay gạt', image: 'img/img_bangvattu/của nhôm xinfa namsung.jpg' },
        { name: 'Cửa đi phòng ngủ + khóa - Nhôm Namsung hệ 1000 + Khóa tay gạt + kính mờ', image: 'img/img_bangvattu/của nhôm xinfa kính mờ.jpg' },
        { name: 'CB, công tắc, ổ cắm, tủ điện, đế âm, mặt - SINO vanlock', image: 'img/img_bangvattu/sino vanlock.jpg' },
        { name: 'Đèn trang trí vách - Khách hàng chọn', image: 'img/img_bangvattu/đèn_trang_trí_treo_vách-removebg-preview.png' },
        { name: 'Đèn vách cầu thang - Khách hàng chọn', image: 'img/img_bangvattu/đèn vách cầu thang.webp' },
        { name: 'Đèn phòng ngủ - Khách hàng chọn', image: 'img/img_bangvattu/đèn phòng ngủ.png' },
        { name: 'Đèn led âm trần, ánh sáng trắng, một chế độ - MPE 7W', image: 'img/img_bangvattu/Den-LED-am-tran-7W-MPE-RPL3-73C-3-mau.jpg' },
        { name: 'Đèn led ốp trần nổi phòng vệ sinh - MPE 18W', image: 'img/img_bangvattu/mpe 18w.webp' },
        { name: 'Chậu rửa chén - INOX 304', image: 'img/img_bangvattu/chau-rua-chen-gorlde-gd-0293-king-home.jpg1664289400' },
        { name: 'Vòi rửa nóng lạnh - INOX 304', image: 'img/img_bangvattu/big_voi-bep-inax-sfv-21_f1d7128f6d334d4f91f2eaf6c6f664fd_grande.webp' },
        { name: 'Lavabo rửa mặt', image: 'img/img_bangvattu/châb treo lavabo.jpg' },
        { name: 'Bồn cầu khối', image: 'img/img_bangvattu/bon-cau-1-khoi-gia-re.jpg' },
        { name: 'Vòi rửa mặt nóng lạnh - INOX 304', image: 'img/img_bangvattu/voi-chau-rua-mat-viglacera-VG315.jpg' },
        { name: 'Vòi sen tắm nóng lạnh - INOX 304', image: 'img/img_bangvattu/vòi sen tắm.webp' },
        { name: 'Gương + kệ kính + móc treo', image: 'img/img_bangvattu/gương nhà tắm.jpg' },
        { name: 'Lan can tay vịn - Thép hộp sơn tĩnh điện', image: 'img/img_bangvattu/lan-can-cau-thang-sat_1.jpg' },
        { name: 'Trụ đề pa', image: '', imageText: 'Không có' },
        { name: 'Bồn nước Đại Thành 1.000m³ - Không bao gồm tháp bồn nước đặt bên ngoài khối nhà', image: 'img/img_bangvattu/bon-nuoc-inox-304-dai-thanh-500l-ngang-1090x1090.jpg' },
        { name: 'Máy bơm 1HP', image: 'img/img_bangvattu/máy bơm.jpg' }
    ];

    const packageDetails = {
        '5700000': {
            name: 'Gói 5,7 triệu/m² – phần thô',
            summary: 'Bao gồm vật tư thô cơ bản theo tiêu chuẩn gói 5,7 triệu/m², phù hợp với công trình cần tối ưu chi phí nhưng vẫn đảm bảo kết cấu và vật liệu nền tảng.',
            materials: [
                { name: 'Gạch Tuynel', image: 'https://khatra.com.vn/wp-content/uploads/2020/04/gach-tuynel-gia-re.jpg' },
                { name: 'Cát vàng Tân Châu, Lòng Hồ', image: 'https://thegioivatlieuxaydung.vn/wp-content/uploads/2023/11/cat-vang-xay-dung.jpeg' },
                { name: 'Đá xanh Đồng Nai hoặc tương đương', image: 'https://vatlieuxaydungbienhoa.com/wp-content/uploads/2025/10/gi%C3%A1-%C4%91%C3%A1-x%C3%A2y-d%E1%BB%B1ng-1x2-t%E1%BA%A1i-Bi%C3%AAn-H%C3%B2a-Đồng-Nai-2.jpg' },
                { name: 'Xi măng Fico / INSEE / Hà Tiên', image: 'https://cdn-vn.fico-ytl.com/ytl-production-media/ytl-media/assets/Supreme_Standard_mockup_2024_7c16907060.png' },
                { name: 'Bê tông tươi M250 R28, Khối lượng lớn và có thể thi công đồng loạt', image: 'https://bizweb.dktcdn.net/100/084/618/products/xe-tron-be-tong-howo-cabin-a7.jpg?v=1464936275450' },
                { name: 'Bê tông cột, đà trộn bằng cối tại công trình', image: 'https://dienmaythanhloi.vn/uploads/maytronbetong250lit.jpg' },
                { name: 'Thép tròn, thép hình Việt Mỹ', image: 'https://thepduylinh.vn/Files/374/san-pham/thep-my-shengli-vms/vmsdh-2-.jpg' },
                { name: 'Xà gồ thép hộp tráng kẽm 1,4 ly, Li tô 1,2 ly', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV4-P_JAgG3bUowmxQMbqGuI131DApCiy7TbhbhQRDMm1BN0iLkMU6OPCP&s=10' },
                { name: 'Tôn lợp - Tôn lạnh màu Nam Kim 4 dem', image: 'https://thephinh24h.com/wp-content/uploads/2019/10/roof-and-wall-material-galvanized-corrugated16118475400.jpg' },
                { name: 'Ngói RUBY / SUNRISE', image: 'https://noithatstore.com/UserUpload/Product/Ngoi-mau-Sunrise-da-tron-S11.jpg?Watermark=' },
                { name: 'Sơn phủ Juton', image: 'img/img_bangvattu/sơn juton phủ.jpg' },
                { name: 'Bột trét cao cấp Việt Mỹ', image: 'img/img_bangvattu/bột_trét_việt_mỹ-removebg-preview.png' },
                { name: 'Sơn chống thấm Sika', image: 'https://dienmayhoanggiaphat.com.vn/wp-content/uploads/2023/07/son-chong-tham-ngoai-troi-sika-hgp.jpg' },
                { name: 'Trần thạch cao 9mm', image: 'https://images.kingled.vn/data/Product/E4BF391A-8059-4BC2-976C-3598025296AA/den-tran-thach-cao-4.jpg' },
                { name: 'Dây cáp điện CADIVI', image: 'https://codienhaiau.com/wp-content/uploads/2023/01/day-cap-dien-mot-loi-cadivi-cv-vang.jpg' },
                { name: 'Ống luồn ruột gà', image: 'https://hulatech.vn/wp-content/uploads/2026/08/ong-ruot-ga-sino-vanlock-sp-d16-sp9016cm-7-600x600.webp' },
                { name: 'Ống nhựa, co, van khóa Bình Minh', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6GjlmBKWTFZmjRbe3WQK9rfbQbt16ls2oNGCOJJveLuZ3Wl0CuN9qdzg&s=10' },
                { name: 'Ống chịu nhiệt, co, van khóa Đại Thành', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRIGOptThqHvUhY-zddRFwqPmhbYrh64lCVipC6ljnWKYXKHNtux1ZHKz_&s=10' }
            ],
            finishingMaterials: finishingMaterialsTemplate
        },

        '6000000-6199000': {
            name: 'Gói 6,0–6,199 triệu/m²',
            summary: 'Danh mục vật tư riêng cho gói xây dựng từ 6,0 đến 6,199 triệu/m².',
            materials: [
                { name: 'Gạch Tuynel', image: 'https://khatra.com.vn/wp-content/uploads/2020/04/gach-tuynel-gia-re.jpg' },
                { name: 'Cát vàng Tân Châu, Lòng Hồ', image: 'https://thegioivatlieuxaydung.vn/wp-content/uploads/2023/11/cat-vang-xay-dung.jpeg' },
                { name: 'Đá xanh Đồng Nai hoặc tương đương', image: 'https://vatlieuxaydungbienhoa.com/wp-content/uploads/2025/10/gi%C3%A1-%C4%91%C3%A1-x%C3%A2y-d%E1%BB%B1ng-1x2-t%E1%BA%A1i-Bi%C3%AAn-H%C3%B2a-%C4%90%E1%BB%93ng-Nai-2.jpg' },
                { name: 'Xi măng Fico / INSEE / Hà Tiên', image: 'https://cdn-vn.fico-ytl.com/ytl-production-media/ytl-media/assets/Supreme_Standard_mockup_2024_7c16907060.png' },
                { name: 'Bê tông tươi M250 R28, Khối lượng lớn và có thể thi công đồng loạt', image: 'https://bizweb.dktcdn.net/100/084/618/products/xe-tron-be-tong-howo-cabin-a7.jpg?v=1464936275450' },
                { name: 'Bê tông cột, đà trộn bằng cối tại công trình', image: 'https://dienmaythanhloi.vn/uploads/maytronbetong250lit.jpg' },
                { name: 'Thép tròn, thép hình Pomina', image: 'img/img_bangvattu_6tr/THEP-VAN-POMINA.jpg' },
                { name: 'Xà gồ thép hộp tráng kẽm 1,4 ly, Li tô 1,2 ly', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV4-P_JAgG3bUowmxQMbqGuI131DApCiy7TbhbhQRDMm1BN0iLkMU6OPCP&s=10' },
                { name: 'Tôn lợp - Tôn lạnh màu Nam Kim 4 dem', image: 'https://thephinh24h.com/wp-content/uploads/2019/10/roof-and-wall-material-galvanized-corrugated16118475400.jpg' },
                { name: 'Ngói RUBY / SUNRISE', image: 'https://noithatstore.com/UserUpload/Product/Ngoi-mau-Sunrise-da-tron-S11.jpg?Watermark=' },
                { name: 'Sơn phủ Juton', image: 'img/img_bangvattu_6tr/essence dễ lau chùi.png' },
                { name: 'Bột trét cao cấp JOTUN', image: 'img/img_bangvattu_6tr/bot-tret-tuong-noi-that-jotun-01-500x500.jpg' },
                { name: 'Sơn chống thấm Sika', image: 'https://dienmayhoanggiaphat.com.vn/wp-content/uploads/2023/07/son-chong-tham-ngoai-troi-sika-hgp.jpg' },
                { name: 'Trần thạch cao 9mm chống ấm', image: 'img/img_bangvattu_6tr/kich-thuoc-tran-thach-cao-giat-cap-1.webp' },
                { name: 'Dây cáp điện CADIVI', image: 'https://codienhaiau.com/wp-content/uploads/2023/01/day-cap-dien-mot-loi-cadivi-cv-vang.jpg' },
                { name: 'Ống luồn ruột gà', image: 'https://hulatech.vn/wp-content/uploads/2026/08/ong-ruot-ga-sino-vanlock-sp-d16-sp9016cm-7-600x600.webp' },
                { name: 'Ống nhựa, co, van khóa Bình Minh', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6GjlmBKWTFZmjRbe3WQK9rfbQbt16ls2oNGCOJJveLuZ3Wl0CuN9qdzg&s=10' },
                { name: 'Ống chịu nhiệt, co, van khóa Bình Minh', image: 'img/img_bangvattu_6tr/catalogue-ong-nhua-ppr-binh-minh.jpg' }
            ],
            finishingMaterials: [
                { name: 'Gạch lát nền phòng khách, sinh hoạt chung, bếp - Gạch granite 60x60', image: 'img/img_bangvattu_6tr/gach-granite-mai-bong-60x60--thach-ban-TGB60-0041_0.jpg' },
                { name: 'Gạch lát nền phòng ngủ - Gạch granite 60x60', image: 'img/img_bangvattu_6tr/gạch lát nền phòng ngủ.jpg' },
                { name: 'Gạch lát nền vệ sinh chống trơn - Gạch ceramic 30x30', image: 'img/img_bangvattu_6tr/gạch lát nền nhà vệ sinh.jpg' },
                { name: 'Gạch ốp tường vệ sinh - Gạch ceramic 30x60', image: 'img/img_bangvattu_6tr/gạch 30x60.jpg' },
                { name: 'Gạch lát balcon + sân thượng - 40x40 chống trơn', image: 'img/img_bangvattu/gach40x40 gạch lát ban công sân thượng.jpg' },
                { name: 'Đá lát tam cấp + cầu thang + mặt bếp - Đen Kim Sa, Trắng Nhân tạo', image: 'img/img_bangvattu_6tr/đá kim sa.jpg' },
                { name: 'Gạch trang trí', image: '', imageText: 'Theo phối cảnh' },
                { name: 'Cửa đi chính, cửa hậu, cửa balcon, cửa vệ sinh + khóa - Nhôm Xingfa Việt Nam hệ 55 + Khóa tay gạt', image: 'img/img_bangvattu_6tr/cua_nhom_xingfa_2_grande.webp' },
                { name: 'Cửa đi phòng ngủ + khóa - Nhôm Xingfa Việt Nam hệ 55 + Khóa tay gạt + kính cường lực 8 ly', image: 'img/img_bangvattu/của nhôm xinfa kính mờ.jpg' },
                { name: 'CB, công tắc, ổ cắm, tủ điện, đế âm, mặt - SINO vanlock', image: 'img/img_bangvattu/sino vanlock.jpg' },
                { name: 'Đèn trang trí vách - Khách hàng chọn', image: 'img/img_bangvattu_6tr/TD778.jpg' },
                { name: 'Đèn vách cầu thang - Khách hàng chọn', image: 'img/img_bangvattu_6tr/đèn vách cầu thang.webp' },
                { name: 'Đèn phòng ngủ - Khách hàng chọn', image: 'img/img_bangvattu_6tr/đèn_phòng_ngủ-removebg-preview.png' },
                { name: 'Đèn led âm trần, ánh sáng trắng, một chế độ - MPE 9W', image: 'img/img_bangvattu_6tr/den-led-mpe-rpl-9w-am-tran-1090x1090.jpg' },
                { name: 'Đèn led ốp trần nổi phòng vệ sinh - MPE 18W', image: 'img/img_bangvattu/mpe 18w.webp' },
                { name: 'Chậu rửa chén - INOX 304', image: 'img/img_bangvattu_6tr/chậu rửa chén.jpg' },
                { name: 'Vòi rửa nóng lạnh - INOX 304', image: 'img/img_bangvattu_6tr/big_voi-bep-inax-sfv-17_896ebd67a79b4a77a94ef83cfa078a7b_master.webp' },
                { name: 'Lavabo rửa mặt - Lavabo mặt đá nhân tạo', image: 'img/img_bangvattu_6tr/lavabo rửa mặt.png' },
                { name: 'Bồn cầu khối', image: 'img/img_bangvattu_6tr/bon-cau-inax-ac-700van-500x500.jpg' },
                { name: 'Vòi rửa mặt nóng lạnh - INOX 304', image: 'img/img_bangvattu_6tr/vòi rửa mặt.jpg' },
                { name: 'Vòi sen tắm nóng lạnh - INOX 304', image: 'img/img_bangvattu_6tr/Sen-cay-tam-dung-vuong-inox-304-Royal-sanp-111.png.webp' },
                { name: 'Gương + kệ kính + móc treo', image: 'img/img_bangvattu_6tr/gương.jpg' },
                { name: 'Lan can tay vịn - Tay vịn INOX + kính cường lực 10 ly', image: 'img/img_bangvattu_6tr/mau-cau-thang-kinh-cuong-luc-dep-2.jpg' },
                { name: 'Trụ đề pa', image: '', imageText: 'Không có' },
                { name: 'Bồn nước Đại Thành 1.000m³ - Không bao gồm tháp bồn nước đặt bên ngoài khối nhà', image: 'img/img_bangvattu/bon-nuoc-inox-304-dai-thanh-500l-ngang-1090x1090.jpg' },
                { name: 'Máy bơm 1,5HP', image: 'img/img_bangvattu_6tr/may-bom-cao-ap-superwin-0.5hp-2.webp' }
            ]
        },

        '6200000-6990000': {
            name: 'Gói 6,2–6,99 triệu/m²',
            summary: 'Danh mục vật tư riêng cho gói xây dựng từ 6,2 đến 6,99 triệu/m².',
            materials: [
                { name: 'Gạch Tuynel', image: 'https://khatra.com.vn/wp-content/uploads/2020/04/gach-tuynel-gia-re.jpg' },
                { name: 'Cát vàng Tân Châu, Lòng Hồ', image: 'https://thegioivatlieuxaydung.vn/wp-content/uploads/2023/11/cat-vang-xay-dung.jpeg' },
                { name: 'Đá xanh Đồng Nai hoặc tương đương', image: 'https://vatlieuxaydungbienhoa.com/wp-content/uploads/2025/10/gi%C3%A1-%C4%91%C3%A1-x%C3%A2y-d%E1%BB%B1ng-1x2-t%E1%BA%A1i-Bi%C3%AAn-H%C3%B2a-%C4%90%E1%BB%93ng-Nai-2.jpg' },
                { name: 'Xi măng Fico / INSEE / Hà Tiên', image: 'img/img_bangvattu6tr2/thiet-ke-chua-co-ten-5-8990.png' },
                { name: 'Bê tông tươi M250 R28, Khối lượng lớn và có thể thi công đồng loạt', image: 'https://bizweb.dktcdn.net/100/084/618/products/xe-tron-be-tong-howo-cabin-a7.jpg?v=1464936275450' },
                { name: 'Bê tông cột, đà trộn bằng cối tại công trình', image: 'https://dienmaythanhloi.vn/uploads/maytronbetong250lit.jpg' },
                { name: 'Thép tròn, thép hình Pomina', image: 'img/img_bangvattu_6tr/THEP-VAN-POMINA.jpg' },
                { name: 'Xà gồ thép hộp tráng kẽm 1,4 ly, Li tô 1,2 ly', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV4-P_JAgG3bUowmxQMbqGuI131DApCiy7TbhbhQRDMm1BN0iLkMU6OPCP&s=10' },
                { name: 'Tôn lợp - Tôn lạnh màu Nam Kim 4,5 dem', image: 'https://thephinh24h.com/wp-content/uploads/2019/10/roof-and-wall-material-galvanized-corrugated16118475400.jpg' },
                { name: 'Ngói RUBY / SUNRISE', image: 'img/img_bangvattu6tr2/ngói RA.png' },
                { name: 'Sơn phủ Juton', image: 'img/img_bangvattu_6tr/essence dễ lau chùi.png' },
                { name: 'Bột trét cao cấp JOTUN', image: 'img/img_bangvattu_6tr/bot-tret-tuong-noi-that-jotun-01-500x500.jpg' },
                { name: 'Sơn chống thấm Sika', image: 'https://dienmayhoanggiaphat.com.vn/wp-content/uploads/2023/07/son-chong-tham-ngoai-troi-sika-hgp.jpg' },
                { name: 'Trần thạch cao 9mm chống ấm', image: 'img/img_bangvattu_6tr/kich-thuoc-tran-thach-cao-giat-cap-1.webp' },
                { name: 'Dây cáp điện CADIVI', image: 'https://codienhaiau.com/wp-content/uploads/2023/01/day-cap-dien-mot-loi-cadivi-cv-vang.jpg' },
                { name: 'Ống luồn - ống cứng', image: 'img/img_bangvattu6tr2/ống cứng.jpg' },
                { name: 'Ống nhựa, co, van khóa Bình Minh', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6GjlmBKWTFZmjRbe3WQK9rfbQbt16ls2oNGCOJJveLuZ3Wl0CuN9qdzg&s=10' },
                { name: 'Ống chịu nhiệt, co, van khóa Bình Minh', image: 'img/img_bangvattu_6tr/catalogue-ong-nhua-ppr-binh-minh.jpg' }
            ],
            finishingMaterials: [
                { name: 'Gạch lát nền phòng khách, sinh hoạt chung, bếp - Gạch granite 80x80', image: 'img/img_bangvattu6tr2/gạch 80x80.webp' },
                { name: 'Gạch lát nền phòng ngủ - Gạch granite 80x80', image: 'img/img_bangvattu6tr2/gạch lát nền 80x80.jpg' },
                { name: 'Gạch lát nền vệ sinh chống trơn - Gạch ceramic 30x60', image: 'img/img_bangvattu6tr2/gạch lát nền 30x60.jpg' },
                { name: 'Gạch ốp tường vệ sinh - Gạch ceramic 30x60', image: 'img/img_bangvattu6tr2/gạch ốp tường nhà vệ sinh 30x60.jpg' },
                { name: 'Gạch lát balcon + sân thượng - 40x40 chống trơn', image: 'img/img_bangvattu6tr2/gạch lát ban công.jpg' },
                { name: 'Đá lát tam cấp + cầu thang + mặt bếp - Đen Kim Sa, Trắng Nhân tạo', image: 'img/img_bangvattu_6tr/đá kim sa.jpg' },
                { name: 'Gạch trang trí', image: '', imageText: 'Theo phối cảnh' },
                { name: 'Cửa đi chính, cửa hậu, cửa balcon, cửa vệ sinh + khóa - Nhôm Xingfa Việt Nam hệ 55 + Khóa tay gạt', image: 'img/img_bangvattu6tr2/cửa nhôm xingffa.jpeg' },
                { name: 'Cửa đi phòng ngủ + khóa - Gỗ căm xe + Khóa tay gạt', image: 'img/img_bangvattu6tr2/cửa gỗ căm xe.webp' },
                { name: 'CB, công tắc, ổ cắm, tủ điện, đế âm, mặt - SINO vanlock/ MPE', image: 'img/img_bangvattu6tr2/cong-tac-3-sino-s18.jpg' },
                { name: 'Đèn trang trí vách - Khách hàng chọn', image: 'img/img_bangvattu6tr2/đèn_trang_trí_vách-removebg-preview.png' },
                { name: 'Đèn vách cầu thang - Khách hàng chọn', image: 'img/img_bangvattu6tr2/đèn vách cầu tháng.jpeg' },
                { name: 'Đèn phòng ngủ - Khách hàng chọn', image: 'img/img_bangvattu6tr2/đèn phòng ngủ.png' },
                { name: 'Đèn led âm trần, ánh sáng trắng, một chế độ - MPE 9W', image: 'img/img_bangvattu_6tr/den-led-mpe-rpl-9w-am-tran-1090x1090.jpg' },
                { name: 'Đèn led ốp trần nổi phòng vệ sinh - MPE 18W', image: 'img/img_bangvattu/mpe 18w.webp' },
                { name: 'Chậu rửa chén - INOX 304', image: 'img/img_bangvattu_6tr/chậu rửa chén.jpg' },
                { name: 'Vòi rửa nóng lạnh - INOX 304', image: 'img/img_bangvattu6tr2/vòi rửa nóng lạnh.jpg' },
                { name: 'Lavabo rửa mặt - Lavabo thùng nhôm + gương', image: 'img/img_bangvattu6tr2/lavabo.png' },
                { name: 'Bồn cầu khối -  INAX', image: 'img/img_bangvattu6tr2/bồn câu khối.jpg' },
                { name: 'Vòi rửa mặt nóng lạnh - KASSANI', image: 'img/img_bangvattu6tr2/vòi rửa mặt.jpg' },
                { name: 'Vòi sen tắm nóng lạnh - KASSANI', image: 'img/img_bangvattu6tr2/vòi sen tắm.png' },
                { name: 'Gương + kệ kính + móc treo', imageText: 'Đã bao gồm' },
                { name: 'Lan can tay vịn - Tay vịn gỗ Căm xe 5x5cm hoặc tay vịn nhôm + kính cường lực 10 ly', image: 'img/img_bangvattu6tr2/cầu thang tay vịn.png' },
                { name: 'Trụ đề pa - Căm xe', image: 'img/img_bangvattu6tr2/căm xe.png', imageText: '' },
                { name: 'Bồn nước Đại Thành 1.500m³ - Không bao gồm tháp bồn nước đặt bên ngoài khối nhà', image: 'img/img_bangvattu/bon-nuoc-inox-304-dai-thanh-500l-ngang-1090x1090.jpg' },
                { name: 'Máy bơm 1,5HP', image: 'img/img_bangvattu_6tr/may-bom-cao-ap-superwin-0.5hp-2.webp' }
            ]
        },
        '6200000': {
            name: 'Gói Khá',
            summary: 'Nâng cấp vật liệu và chi tiết hoàn thiện để căn nhà trông hiện đại, ấm cúng hơn.',
            image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
            materials: [
                'Bê tông cốt thép đạt tiêu chuẩn cao hơn, gia cường thêm cột và dầm',
                'Gạch porcelain, gạch men cao cấp cho sàn và tường',
                'Sàn nhà có thể dùng gạch 60x60, 80x80 và vật liệu nâng cấp',
                'Mái ngói hoặc BTCT hoàn thiện đẹp, chống thấm tốt',
                'Cửa gỗ sồi, cửa nhôm kính cao cấp, phụ kiện hệ thống',
                'Vật liệu ốp tường, ốp gỗ, ốp đá trang trí',
                'Thiết bị vệ sinh nước nóng, bồn rửa, bàn cầu cao cấp',
                'Hệ thống điện, điều hòa, chiếu sáng cao cấp hơn'
            ],
            finishingMaterials: finishingMaterialsTemplate
        },
        '7000000': {
            name: 'Gói Cao cấp - từ 7 triệu/m²',
            summary: 'Danh mục vật tư phần thô và hoàn thiện cho gói Cao cấp từ 7 triệu/m² trở lên.',
            image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
            materials: [
                { name: 'Gạch Tuynel', image: 'https://khatra.com.vn/wp-content/uploads/2020/04/gach-tuynel-gia-re.jpg' },
                { name: 'Cát vàng Tân Châu, Lòng Hồ', image: 'https://thegioivatlieuxaydung.vn/wp-content/uploads/2023/11/cat-vang-xay-dung.jpeg' },
                { name: 'Đá xanh Đồng Nai hoặc tương đương', image: 'https://vatlieuxaydungbienhoa.com/wp-content/uploads/2025/10/gi%C3%A1-%C4%91%C3%A1-x%C3%A2y-d%E1%BB%B1ng-1x2-t%E1%BA%A1i-Bi%C3%AAn-H%C3%B2a-Đồng-Nai-2.jpg' },
                { name: 'Xi măng Fico / INSEE / Hà Tiên', image: 'img/img_bangvattu6tr2/thiet-ke-chua-co-ten-5-8990.png' },
                { name: 'Bê tông tươi M250 R28, Khối lượng lớn và có thể thi công đồng loạt', image: 'https://bizweb.dktcdn.net/100/084/618/products/xe-tron-be-tong-howo-cabin-a7.jpg?v=1464936275450' },
                { name: 'Bê tông cột, đà trộn bằng cối tại công trình', image: 'https://dienmaythanhloi.vn/uploads/maytronbetong250lit.jpg' },
                { name: 'Thép tròn, thép hình Việt Nhật', image: 'img/img_bangvattu7tr/thep-viet-nhat.jpg' },
                { name: 'Xà gồ thép hộp tráng kẽm dày 1,4 ly, li tô dày 1,2 ly', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV4-P_JAgG3bUowmxQMbqGuI131DApCiy7TbhbhQRDMm1BN0iLkMU6OPCP&s=10' },
                { name: 'Tôn lạnh màu Nam Kim dày 5 dem', image: 'https://thephinh24h.com/wp-content/uploads/2019/10/roof-and-wall-material-galvanized-corrugated16118475400.jpg' },
                { name: 'Ngói RUBY / SUNRISE', image: 'img/img_bangvattu6tr2/ngói RA.png' },
                { name: 'Sơn phủ JUTON', image: 'img/img_bangvattu7tr/sơn_jotun-removebg-preview.png' },
                { name: 'Bột trét cao cấp JOTUN', image: 'img/img_bangvattu7tr/sonw jotun nội & ngoại thất.jpg' },
                { name: 'Sơn chống thấm thương hiệu SIKA', image: 'https://dienmayhoanggiaphat.com.vn/wp-content/uploads/2023/07/son-chong-tham-ngoai-troi-sika-hgp.jpg' },
                { name: 'Trần thạch cao dày 9mm chống ẩm', image: 'img/img_bangvattu7tr/trần thạch cao.jpg' },
                { name: 'Dây cáp điện CADIVI, tiết diện dây theo thiết kế', image: 'https://codienhaiau.com/wp-content/uploads/2023/01/day-cap-dien-mot-loi-cadivi-cv-vang.jpg' },
                { name: 'Ống luồn - Ống cứng', image: 'img/img_bangvattu6tr2/ống cứng.jpg' },
                { name: 'Ống nhựa, co, van khóa - PPR cấp nước lạnh', image: 'img/img_bangvattu7tr/ong-nhua-binh-minh-pho-75.png' },
                { name: 'Ống chịu nhiệt, co, van khóa', image: 'img/img_bangvattu_6tr/catalogue-ong-nhua-ppr-binh-minh.jpg' }
            ],
            finishingMaterials: [
                { name: 'Gạch lát nền phòng khách, sinh hoạt chung, bếp - Gạch granite 80x80', image: 'img/img_bangvattu7tr/gạch 80xx80.jpg' },
                { name: 'Gạch lát nền phòng ngủ - Gạch 15x80 giả gỗ', image: 'img/img_bangvattu7tr/gạck 15x80.jpg' },
                { name: 'Gạch lát nền vệ sinh chống trơn - Gạch granite 30x60', image: 'img/img_bangvattu7tr/gach-op-granite-300x600-Thach-Ban-TGB36-0232-removebg-preview.png' },
                { name: 'Gạch ốp tường vệ sinh 30x60', image: 'img/img_bangvattu7tr/gạch ốp  tường nvs 30x60.png' },
                { name: 'Gạch lát ban công + sân thượng 40x40 chống trơn', image: 'img/img_bangvattu7tr/gạch lát ban công.jpeg' },
                { name: 'Đá lát tam cấp + cầu thang + mặt bếp - Đá đen, đỏ Ấn Độ, vàng Ai Cập', image: 'img/img_bangvattu7tr/da-do-ruby1_thumb.jpg' },
                { name: 'Gạch trang trí theo phối cảnh', image: '', imageText: 'Theo phối cảnh' },
                { name: 'Cửa đi chính, cửa hậu, cửa ban công, cửa vệ sinh + khóa - Nhôm Xingfa nhập khẩu hệ 55 + khóa tay gạt', image: 'img/img_bangvattu7tr/cửa nhôm xinfa.jpg' },
                { name: 'Cửa đi phòng ngủ + khóa - Gỗ Gõ Đỏ + khóa tay gạt ', image: 'img/img_bangvattu7tr/cua-go-phong-ngu-tu-go-lim.jpg' },
                { name: 'CB, công tắc, ổ cắm, tủ điện, đế âm, mặt - Panasonic', image: 'img/img_bangvattu7tr/cong-tac-dien-loai-nao-tot-nhat.jpg' },
                { name: 'Đèn trang trí vách - Theo thiết kế', image: 'img/img_bangvattu7tr/đèn_vách-removebg-preview.png' },
                { name: 'Đèn vách cầu thang - Theo thiết kế', image: 'img/img_bangvattu7tr/đèn cầu thang.jpeg' },
                { name: 'Đèn phòng ngủ - Theo thiết kế', image: 'img/img_bangvattu7tr/đèn_ngủ-removebg-preview.png' },
                { name: 'Đèn led âm trần - Panasonic 9W', image: 'img/img_bangvattu7tr/đèn panasonic.png' },
                { name: 'Đèn led ốp trần nổi phòng vệ sinh - Panasonic 18W', image: 'img/img_bangvattu7tr/đèn 18w panasonic.jpg' },
                { name: 'Chậu rửa chén - Đá nhân tạo', image: 'img/img_bangvattu7tr/bồn rửa chén.jpg' },
                { name: 'Vòi rửa nóng lạnh INOX 304', image: 'img/img_bangvattu7tr/vòi rửa nóng lạnh.jpg' },
                { name: 'Lavabo kệ đá 2 tầng + gương LED', image: 'img/img_bangvattu7tr/lavabo rửa mặt.jpg' },
                { name: 'Bồn cầu khối - INAX', image: 'img/img_bangvattu6tr2/bồn câu khối.jpg' },
                { name: 'Vòi rửa mặt nóng lạnh INAX', image: 'img/img_bangvattu7tr/vòi rửa mặt nóng lạnh.webp' },
                { name: 'Vòi sen tắm nóng lạnh', image: 'img/img_bangvattu7tr/vòi sen tắm nóng lạnh.webp' },
                { name: 'Gương + kệ kính + móc treo', image: 'img/img_bangvattu_6tr/gương.jpg' },
                { name: 'Lan can + tay vịn gỗ Gõ Đỏ 7x7cm hoặc 6x8cm, trụ tiện hoặc sắt uốn nghệ thuật', image: 'img/img_bangvattu7tr/lan can tay vịn.png' },
                { name: 'Trụ đề pa Gõ Đỏ (Bên)', image: 'img/img_bangvattu7tr/trụ đề ba.jpg' },
                { name: 'Bồn nước Đại Thành 1.500m³ - Không bao gồm tháp bồn nước đặt bên ngoài khối nhà', image: 'img/img_bangvattu/bon-nuoc-inox-304-dai-thanh-500l-ngang-1090x1090.jpg' },
                { name: 'Máy bơm Panasonic 1,5HP', image: 'img/img_bangvattu7tr/máy bơm.jpg' }
            ],
        },
        custom: {
            name: 'Gói Giá khác',
            summary: 'Gói tùy chỉnh theo yêu cầu riêng, áp dụng đơn giá do khách hàng đặt ra.',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
            materials: [
                'Vật liệu kết cấu theo yêu cầu từng hạng mục riêng',
                'Thép, bê tông, cát, đá, xi măng theo đơn vị tính riêng',
                'Gạch ốp lát, sơn, phụ kiện, bảng điện và đường ống theo yêu cầu',
                'Cửa, kính, inox, phụ kiện hoàn thiện tùy chỉnh',
                'Ốp tường, ốp đá, gỗ, vật liệu décor theo mẫu riêng',
                'Thiết bị vệ sinh, công tắc, ổ cắm, đèn và phụ kiện theo khách hàng',
                'Tùy chọn tăng giảm vật tư theo tiến độ và ngân sách',
                'Tham khảo bảng giá chi tiết trước khi chốt thi công'
            ],
            finishingMaterials: finishingMaterialsTemplate
        }
    };
    let hasCalculatedPackage = false;
    const resolvePackageKeyForPreview = () => {
        const finishValue = estimateForm?.elements.finish?.value || '';
        const customPriceRaw = String(estimateForm?.elements.customFinishPrice?.value || '').replace(/\D/g, '');
        const customPriceValue = customPriceRaw ? Number(customPriceRaw) : NaN;

        if (finishValue === '5700000') {
            return '5700000';
        }

        if (finishValue === '6000000' || (finishValue === 'custom' && Number.isFinite(customPriceValue) && customPriceValue >= 6000000 && customPriceValue <= 6199000)) {
            return '6000000-6199000';
        }

        if (finishValue === '6200000' || (finishValue === 'custom' && Number.isFinite(customPriceValue) && customPriceValue >= 6200000 && customPriceValue <= 6990000)) {
            return '6200000-6990000';
        }

        if (finishValue === '7000000' || (finishValue === 'custom' && Number.isFinite(customPriceValue) && customPriceValue >= 7000000)) {
            return '7000000';
        }

        if (finishValue === 'custom' && Number.isFinite(customPriceValue) && customPriceValue > 0 && customPriceValue < 6000000) {
            return '5700000';
        }

        return null;
    };
    const updatePackagePreview = () => {
        const selectedPackage = resolvePackageKeyForPreview();
        const packageData = selectedPackage && packageDetails[selectedPackage] ? packageDetails[selectedPackage] : null;
        if (!packagePreview || !packageList || !packageTableWrap) {
            return;
        }
        if (!hasCalculatedPackage || !packageData) {
            packagePreview.hidden = true;
            packageTableWrap.hidden = true;
            if (packageNotes) {
                packageNotes.hidden = true;
            }
            packageList.innerHTML = '';
            return;
        }
        const getMaterialImage = (name) => {
            const normalizedName = name.toLowerCase();
            if (normalizedName.includes('thép') || normalizedName.includes('dầm') || normalizedName.includes('cột')) {
                return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80';
            }
            if (normalizedName.includes('gạch') || normalizedName.includes('ốp')) {
                return 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80';
            }
            if (normalizedName.includes('sơn')) {
                return 'https://images.unsplash.com/photo-1581092921461-eab62e97a6a7?auto=format&fit=crop&w=900&q=80';
            }
            if (normalizedName.includes('mái') || normalizedName.includes('ngói')) {
                return 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=900&q=80';
            }
            if (normalizedName.includes('cửa')) {
                return 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80';
            }
            if (normalizedName.includes('ống') || normalizedName.includes('nước') || normalizedName.includes('bồn') || normalizedName.includes('lavabo')) {
                return 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80';
            }
            if (normalizedName.includes('trần') || normalizedName.includes('thạch')) {
                return 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80';
            }
            return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80';
        };
        const sections = [
            { title: 'Phần thô', items: packageData.materials || [] },
            { title: 'Phần hoàn thiện', items: packageData.finishingMaterials || [] }
        ];

        const rowsHtml = sections.flatMap((section) => {
            const items = section.items || [];
            if (!items.length) {
                return [];
            }
            const sectionRows = [];
            if (section.title) {
                sectionRows.push(`
                    <tr class="estimate-package-section-row">
                        <td colspan="3">${section.title}</td>
                    </tr>
                `);
            }
            items.forEach((item, index) => {
                const material = typeof item === 'string' ? { name: item, image: getMaterialImage(item) } : item;
                const materialImage = material.image || (material.imageText ? '' : getMaterialImage(material.name || 'vật liệu'));
                const materialVisual = materialImage
                    ? `<img src="${materialImage}" alt="${material.name}" loading="lazy">`
                    : `<span class="estimate-package-thumb-note">${material.imageText || 'Không có hình ảnh'}</span>`;
                sectionRows.push(`
                    <tr class="estimate-package-item">
                        <td class="estimate-package-index">${index + 1}</td>
                        <td class="estimate-package-name"><span title="${material.name}">${material.name}</span></td>
                        <td class="estimate-package-thumb">
                            ${materialVisual}
                        </td>
                    </tr>
                `);
            });
            return sectionRows;
        }).join('');

        packageList.innerHTML = rowsHtml;
        packageList.querySelectorAll('.estimate-package-item').forEach((row, index) => {
            row.classList.toggle('estimate-package-item--uniform-image', index < 3);
        });
        packagePreview.hidden = false;
        packageTableWrap.hidden = false;
        if (packageNotes) {
            packageNotes.hidden = false;
        }
    };
    const fengShuiForm = document.querySelector('#feng-shui-form');
    const compassFace = document.querySelector('#compass-face');
    const compassNeedle = document.querySelector('#compass-needle');
    const compassCaption = document.querySelector('#compass-caption');
    const compassDirection = document.querySelector('#compass-direction');
    const compassElement = document.querySelector('#compass-element');
    const compassFaceElement = document.querySelector('#compass-face-element');
    const compassBearing = document.querySelector('#compass-bearing');
    const resultTitle = document.querySelector('#result-title');
    const resultSummary = document.querySelector('#result-summary');
    const resultElement = document.querySelector('#result-element');
    const resultElementText = document.querySelector('#result-element-text');
    const resultGoodDirections = document.querySelector('#result-good-directions');
    const resultLayout = document.querySelector('#result-layout');
    const resultGuidanceTitle = document.querySelector('#result-guidance-title');
    const resultGuidanceText = document.querySelector('#result-guidance-text');
    const compassInsight = document.querySelector('#compass-insight');
    const compassInsightName = document.querySelector('#compass-insight-name');
    const compassInsightElement = document.querySelector('#compass-insight-element');
    const compassInsightGood = document.querySelector('#compass-insight-good');
    const compassInsightHouse = document.querySelector('#compass-insight-house');
    const compassInsightScale = document.querySelector('#compass-insight-scale');
    const compassInsightMessage = document.querySelector('#compass-insight-message');
    const fengMapForm = document.querySelector('#feng-shui-form');
    const fengMapGrid = document.querySelector('#feng-map-grid');
    const fengMapCaption = document.querySelector('#map-caption');
    const fengMapResultTitle = document.querySelector('#map-result-title');
    const fengMapResultText = document.querySelector('#map-result-text');
    const oracleForm = document.querySelector('#feng-shui-form');
    const oraclePanel = document.querySelector('.oracle-panel');
    const oracleCard = document.querySelector('#oracle-card');
    const oracleStatus = document.querySelector('#oracle-status');
    const oracleCode = document.querySelector('#oracle-code');
    const oracleTitle = document.querySelector('#oracle-title');
    const oracleVerdict = document.querySelector('#oracle-verdict');
    const oracleAge = document.querySelector('#oracle-age');
    const oracleYear = document.querySelector('#oracle-year');
    const oracleDirection = document.querySelector('#oracle-direction');
    const oracleReading = document.querySelector('#oracle-reading-text');
    const baguaWheel = document.querySelector('.bagua-wheel');
    const baguaTrigrams = document.querySelector('.bagua-trigrams');
    const baguaYinYang = document.querySelector('.bagua-yin-yang');
    let oracleRevealTimer;

    if (oracleForm && oracleCard && oracleTitle && oracleVerdict && oracleReading && oracleAge && oracleYear && oracleDirection && baguaWheel && baguaTrigrams && baguaYinYang) {
        const validationYear = new Date().getFullYear();
        const birthYearInput = oracleForm.elements.birthYear;
        birthYearInput.min = String(validationYear - 100);
        birthYearInput.max = String(validationYear - 18);
        birthYearInput.addEventListener('input', (event) => {
            event.target.value = event.target.value.replace(/\D/g, '').slice(0, 4);
            const enteredYear = Number(event.target.value);
            const isValidAgeYear = /^\d{4}$/.test(event.target.value)
                && enteredYear >= validationYear - 100
                && enteredYear <= validationYear - 18;
            event.target.setCustomValidity(isValidAgeYear ? '' : `Tuổi phải từ 18 đến 100 (${validationYear - 100}-${validationYear - 18}).`);
        });
        const savedProfilePrefix = 'hoang-hai-feng-shui-profile:';
        const newProfileButton = document.querySelector('#feng-shui-new-profile');
        const getSavedProfile = (phone) => {
            try {
                return JSON.parse(localStorage.getItem(`${savedProfilePrefix}${phone}`) || 'null');
            } catch (error) {
                return null;
            }
        };
        const saveProfile = (data) => {
            try {
                const profile = Object.fromEntries(['fullName', 'direction', 'birthDay', 'birthMonth', 'birthYear', 'gender', 'houseType', 'phone'].map((field) => [field, data[field] || '']));
                localStorage.setItem(`${savedProfilePrefix}${data.phone}`, JSON.stringify(profile));
            } catch (error) {
            }
        };
        const restoreProfile = (phone) => {
            const profile = getSavedProfile(phone);
            if (!profile) return;
            Object.entries(profile).forEach(([field, value]) => {
                if (field !== 'phone' && oracleForm.elements[field]) oracleForm.elements[field].value = value;
            });
        };
        let restoredPhone = '';
        oracleForm.elements.phone.addEventListener('input', (event) => {
            event.target.value = event.target.value.replace(/\D/g, '').slice(0, 10);
            const phone = event.target.value.trim();
            event.target.setCustomValidity(phone.length === 10 && isVietnameseMobile(phone) ? '' : 'Số điện thoại phải đủ 10 số di động Việt Nam hợp lệ.');
            if (isVietnameseMobile(phone) && phone !== restoredPhone) {
                restoredPhone = phone;
                const profile = getSavedProfile(phone);
                if (profile) {
                    restoreProfile(phone);
                }
            } else if (!isVietnameseMobile(phone)) {
                restoredPhone = '';
            }
        });

        newProfileButton?.addEventListener('click', () => {
            oracleForm.reset();
            oracleForm.querySelectorAll('input, select').forEach((field) => field.setCustomValidity(''));
            oracleStatus.textContent = 'CHƯA MỞ QUẺ';
            oracleCode.textContent = 'HH · 01';
            oracleTitle.textContent = 'Nhập hồ sơ để mở quẻ';
            oracleVerdict.textContent = 'Một bản phán ngắn về dáng nhà, nhịp xây và cách công trình đón người ở.';
            oracleAge.textContent = '--';
            oracleYear.textContent = '--';
            oracleDirection.textContent = '--';
            oracleReading.textContent = 'Kết quả sẽ xuất hiện ở đây sau khi bạn gửi hồ sơ gia chủ và công trình.';
            oracleCard.classList.remove('is-spinning', 'is-revealed', 'is-revealing');
            restoredPhone = '';
        });

        oracleForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = Object.fromEntries(new FormData(oracleForm));
            const currentYear = validationYear;
            const birthYear = Number(data.birthYear);
            const birthMonth = Number(data.birthMonth || 0);
            const birthDay = Number(data.birthDay || 0);
            const phone = data.phone?.trim() || '';
            const birthYearField = oracleForm.elements.birthYear;
            const phoneField = oracleForm.elements.phone;
            const birthYearIsValid = /^\d{4}$/.test(data.birthYear || '') && Number.isInteger(birthYear) && birthYear >= currentYear - 100 && birthYear <= currentYear - 18;
            const phoneIsValid = isVietnameseMobile(phone);
            const birthDayIsValid = !birthDay || (birthMonth && birthDay >= 1 && birthDay <= new Date(birthYear, birthMonth, 0).getDate());
            birthYearField.setCustomValidity(birthYearIsValid ? '' : `Tuổi phải từ 18 đến 100 (${currentYear - 100}-${currentYear - 18}).`);
            phoneField.setCustomValidity(phoneIsValid ? '' : 'Nhập số di động Việt Nam hợp lệ gồm 10 số, ví dụ 0912345678.');
            if (!birthDayIsValid) {
                oracleForm.elements.birthDay.setCustomValidity('Ngày sinh cần đi cùng tháng sinh và phải hợp lệ.');
            } else {
                oracleForm.elements.birthDay.setCustomValidity('');
            }
            if (!birthYearIsValid || !phoneIsValid || !birthDayIsValid) return;
            saveProfile(data);
            if (window.matchMedia('(max-width: 768px)').matches) {
                window.setTimeout(() => {
                    oraclePanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 80);
            }
            const directionLabels = {
                north: 'Bắc',
                northeast: 'Đông Bắc',
                east: 'Đông',
                southeast: 'Đông Nam',
                south: 'Nam',
                southwest: 'Tây Nam',
                west: 'Tây',
                northwest: 'Tây Bắc',
                unknown: 'Chưa xác định'
            };
            const emailData = new FormData();
            emailData.append('_subject', `Hồ sơ xem phong thủy: ${data.fullName || 'Khách hàng'}`);
            emailData.append('_template', 'table');
            emailData.append('_captcha', 'false');
            emailData.append('Số điện thoại', phone);
            emailData.append('Họ và tên', data.fullName || 'Chưa cung cấp');
            emailData.append('Hướng nhà', directionLabels[data.direction] || 'Chưa xác định');
            emailData.append('Ngày tháng năm sinh', `${birthDay ? String(birthDay).padStart(2, '0') + '/' : ''}${birthMonth ? String(birthMonth).padStart(2, '0') + '/' : ''}${birthYear}`);
            emailData.append('Giới tính', data.gender || 'Chưa cung cấp');
            emailData.append('Loại công trình', data.houseType || 'Chưa cung cấp');
            fetch('https://formsubmit.co/ajax/pndat171203@gmail.com', {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: emailData
            }).catch(() => {});
            const birthDate = `${birthYear}-${birthMonth ? String(birthMonth).padStart(2, '0') : '01'}-${birthDay ? String(birthDay).padStart(2, '0') : '01'}`;
            const name = data.fullName?.trim() || 'gia chủ';
            const profileSignature = [name, phone, birthDate, data.gender, data.direction, data.houseType].join('|');
            let profileHash = 2166136261;
            Array.from(profileSignature).forEach((character) => {
                profileHash ^= character.codePointAt(0);
                profileHash = Math.imul(profileHash, 16777619);
            });
            const seed = Math.abs(profileHash >>> 0);
            const stems = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
            const branches = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
            const stemElements = ['Mộc', 'Mộc', 'Hỏa', 'Hỏa', 'Thổ', 'Thổ', 'Kim', 'Kim', 'Thủy', 'Thủy'];
            const birthStemIndex = Number.isFinite(birthYear) ? (birthYear - 4) % 10 : 0;
            const birthBranchIndex = Number.isFinite(birthYear) ? (birthYear - 4) % 12 : 0;
            const birthStem = stems[(birthStemIndex + 10) % 10];
            const birthBranch = branches[(birthBranchIndex + 12) % 12];
            const birthElement = stemElements[(birthStemIndex + 10) % 10];
            const directions = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
            const directionElements = { Bắc: 'Thủy', 'Đông Bắc': 'Thổ', Đông: 'Mộc', 'Đông Nam': 'Mộc', Nam: 'Hỏa', 'Tây Nam': 'Thổ', Tây: 'Kim', 'Tây Bắc': 'Kim' };
            const houseDirection = data.direction === 'unknown'
                ? directions[seed % directions.length]
                : ({ north: 'Bắc', northeast: 'Đông Bắc', east: 'Đông', southeast: 'Đông Nam', south: 'Nam', southwest: 'Tây Nam', west: 'Tây', northwest: 'Tây Bắc' }[data.direction] || directions[seed % directions.length]);
            const directionElement = directionElements[houseDirection];
            const yearElement = (year) => stemElements[((year - 4) % 10 + 10) % 10];
            const yearCandidates = Array.from({ length: 5 }, (_, index) => new Date().getFullYear() + index + 1);
            const compatibleYear = yearCandidates.sort((first, second) => {
                const firstDistance = Math.abs(((first - 4) % 12) - birthBranchIndex);
                const secondDistance = Math.abs(((second - 4) % 12) - birthBranchIndex);
                const firstElementBonus = yearElement(first) === birthElement ? 2 : 0;
                const secondElementBonus = yearElement(second) === birthElement ? 2 : 0;
                return (secondElementBonus - Math.min(secondDistance, 6)) - (firstElementBonus - Math.min(firstDistance, 6));
            })[0];
            const suggestedMonth = (seed % 9) + 2;
            const suggestedDay = (seed % 19) + 3;
            const suggestedDate = `${String(suggestedDay).padStart(2, '0')}/${String(suggestedMonth).padStart(2, '0')}/${compatibleYear}`;
            const fortuneLevels = [
                { label: 'QUẺ TỐT', opening: 'Mạch quẻ hanh thông', verdict: 'Hồ sơ có nhiều điểm thuận: công trình dễ tạo cảm giác sáng, rõ và có nhịp sinh hoạt ổn định nếu gia chủ giữ quyết định nhất quán.', advice: 'Có thể ưu tiên triển khai theo kế hoạch đã chốt, nhưng vẫn cần kiểm tra kỹ nền đất, kết cấu và ngân sách.' },
                { label: 'QUẺ TỐT', opening: 'Khí quẻ vượng', verdict: 'Quẻ cho thấy nền tảng khá sáng, hợp với cách tổ chức không gian thoáng, lối vào rõ và các hạng mục được triển khai đúng nhịp.', advice: 'Nên tận dụng đà thuận này để hoàn thiện thiết kế và giữ chất lượng thi công thay vì chạy theo tiến độ quá nhanh.' },
                { label: 'QUẺ KHÁ', opening: 'Quẻ hiện thế vững', verdict: 'Tổng thể có hướng phát triển tốt nhưng vẫn còn vài điểm cần cân bằng giữa công năng, chi phí và thói quen sống của gia đình.', advice: 'Giữ phần tốt của phương án hiện tại, đồng thời dành thêm thời gian rà soát mặt bằng, thông gió và thoát nước.' },
                { label: 'QUẺ KHÁ', opening: 'Mạch nhà có điểm sáng', verdict: 'Quẻ có điểm sáng ở sự ổn định và khả năng tích lũy, nhưng kết quả chỉ tốt khi gia chủ tránh thay đổi phương án liên tục.', advice: 'Chốt một người quyết định chính, lập ngân sách dự phòng và kiểm tra từng mốc trước khi chuyển bước.' },
                { label: 'QUẺ TRUNG BÌNH', opening: 'Quẻ đang chuyển', verdict: 'Hồ sơ ở thế cân bằng: chưa thấy dấu hiệu quá xấu nhưng cũng chưa đủ thuận để vội vàng khởi công hoặc chốt mọi hạng mục.', advice: 'Nên khảo sát thực địa, làm rõ hướng nhà và hoàn thiện thiết kế trước khi chọn ngày triển khai.' },
                { label: 'QUẺ TRUNG BÌNH', opening: 'Khí quẻ phân tán', verdict: 'Công trình có thể làm được, nhưng dễ phát sinh điều chỉnh nếu phần nền, công năng và ngân sách chưa được thống nhất từ đầu.', advice: 'Ưu tiên xử lý các điểm thực tế như nền móng, thoát nước, ánh sáng và luồng đi trước phần trang trí.' },
                { label: 'QUẺ XẤU', opening: 'Quẻ báo nhiều trở ngại', verdict: 'Quẻ cho thấy nhiều điểm chưa ổn định; nếu vội triển khai, công trình có thể gặp sửa đổi, đội chi phí hoặc bất tiện trong quá trình sử dụng.', advice: 'Nên tạm chậm lại để kiểm tra nền đất, pháp lý, ngân sách và phương án thiết kế cùng người có chuyên môn.' },
                { label: 'QUẺ XẤU', opening: 'Mạch quẻ bất thuận', verdict: 'Hồ sơ đang có thế xung: hướng đi, công năng hoặc quyết định của gia chủ chưa đồng nhất, dễ tạo áp lực cho cả quá trình xây dựng.', advice: 'Không nên xem đây là thời điểm chốt vội; hãy rà soát lại các điểm bất đồng và chỉ khởi công khi phương án đã rõ ràng.' }
            ];
            const fortune = fortuneLevels[seed % fortuneLevels.length];
            const queName = `${fortune.opening} · ${birthStem} ${birthBranch}`;
            const shape = data.houseType === 'Nhà phố' ? 'Gọn sâu' : 'Ấm vững';
            const codeNumber = String(seed % 99).padStart(2, '0');
            const currentOuterAngle = Number(baguaTrigrams.dataset.angle || 0);
            const currentInnerAngle = Number(baguaYinYang.dataset.angle || 0);
            const stopOuterAngle = currentOuterAngle + 1440 + ((seed % 8) * 45);
            const stopInnerAngle = currentInnerAngle - 1440 - ((seed % 8) * 4);

            window.clearTimeout(oracleRevealTimer);
            baguaTrigrams.style.setProperty('--bagua-start-angle', `${currentOuterAngle}deg`); 
            baguaTrigrams.style.setProperty('--bagua-stop-angle', `${stopOuterAngle}deg`);
            baguaYinYang.style.setProperty('--bagua-start-angle', `${currentInnerAngle}deg`);
            baguaYinYang.style.setProperty('--bagua-stop-angle', `${stopInnerAngle}deg`);
            oracleCard.classList.add('is-spinning');
            oracleCard.classList.remove('is-revealing');
            oracleReading.classList.remove('is-revealing');
            oracleStatus.textContent = 'ĐANG LẬP QUẺ';
            oracleRevealTimer = window.setTimeout(() => {
                oracleCard.classList.add('is-revealing');
                oracleReading.classList.add('is-revealing');
                oracleCode.textContent = `HH · ${codeNumber}`;
                oracleTitle.textContent = queName;
                oracleVerdict.textContent = `${name}, hồ sơ ${data.gender.toLowerCase()} cho thấy: ${fortune.verdict}`;
                oracleAge.textContent = `${birthStem} ${birthBranch} · ${birthElement}`;
                oracleYear.textContent = suggestedDate;
                oracleDirection.textContent = `${houseDirection} · ${directionElement}`;
                oracleReading.textContent = `${fortune.advice} Nhà ${data.houseType.toLowerCase()} nên giữ dáng ${shape.toLowerCase()}, ưu tiên hướng ${houseDirection}. Ngày ${suggestedDate} chỉ là mốc tham khảo theo bộ quy tắc trong trang; cần người có chuyên môn kiểm tra ngày giờ và pháp lý trước khi khởi công.`;
                oracleStatus.textContent = fortune.label;
                baguaTrigrams.dataset.angle = String(stopOuterAngle);
                baguaYinYang.dataset.angle = String(stopInnerAngle);
                baguaTrigrams.style.transform = `rotate(${stopOuterAngle}deg)`;
                baguaYinYang.style.transform = `rotate(${stopInnerAngle}deg)`;
                oracleCard.classList.remove('is-spinning');
                oracleCard.classList.add('is-revealed');
                window.requestAnimationFrame(() => {
                    oracleCard.classList.remove('is-revealing');
                    oracleReading.classList.remove('is-revealing');
                });
            }, 3000);
        });
    }

    if (fengMapForm && fengMapGrid && fengMapResultTitle && fengMapResultText) {
        const zoneGuidance = {
            'nhip-khoi-cong': ['Nhịp khởi công · Khi nào nên bắt đầu', 'Dáng vận của công trình bắt đầu tốt khi gia chủ đã chốt được thiết kế, ngân sách và người đứng tên. Ngày giờ chỉ nên chọn sau khi ba nền tảng này đã ổn.'],
            'mach-dat': ['Mạch đất · Nền, sáng & thông thoáng', 'Mạch đất đẹp là nền ổn, thoát nước tốt, mặt tiền có khoảng thở và nhà nhận được ánh sáng vừa đủ. Đây là phần cần khảo sát thực tế trước mọi luận giải phong thủy.'],
            'khi-don-nha': ['Khí đón nhà · Cổng, cửa & khoảng đệm', 'Ngôi nhà có khí đón tốt khi lối vào rõ ràng, cửa chính sáng và có khoảng chuyển tiếp. Tránh để cửa mở thẳng vào cầu thang, bếp hoặc khu vệ sinh.'],
            'nhip-song': ['Nhịp sống · Công năng & thói quen', 'Một mặt bằng có vận tốt là mặt bằng giúp người ở đi lại thuận, ngủ yên, bếp thoáng và trung tâm nhà không bị chất đồ. Công năng thực tế luôn đứng trước vật phẩm phong thủy.']
        };
        const mapZones = Array.from(fengMapGrid.querySelectorAll('.feng-zone'));
        let currentProfile = 'gia chủ';
        let currentProject = { houseType: 'công trình', area: '' };

        const showZone = (zoneName) => {
            const guidance = zoneGuidance[zoneName] || zoneGuidance['nhip-khoi-cong'];
            mapZones.forEach((zone) => zone.classList.toggle('is-active', zone.dataset.zone === zoneName));
            fengMapResultTitle.textContent = guidance[0];
            const details = {
                'nhip-khoi-cong': (() => {
                    const birthYear = Number(currentProject.birthYear);
                    const currentYear = new Date().getFullYear();
                    const offset = Number.isFinite(birthYear) ? (birthYear % 3) : 0;
                    const firstYear = currentYear + 1 + offset;
                    return `Mốc khởi công tham khảo: ${firstYear} hoặc ${firstYear + 3}. Nên tránh động thổ trong năm gia chủ đang có việc lớn chưa ổn định; ngày giờ cụ thể cần người xem tuổi kiểm tra riêng.`;
                })(),
                'mach-dat': 'Mạch đất đẹp là nền ổn, thoát nước tốt, mặt tiền có khoảng thở và nhà nhận được ánh sáng vừa đủ. Đây là phần cần khảo sát thực tế trước mọi luận giải phong thủy.',
                'khi-don-nha': currentProject.houseType === 'Nhà phố'
                    ? 'Dáng nhà phố hợp với một lớp đệm trước cửa, lối vào rõ và cầu thang không đập thẳng vào cửa chính.'
                    : `Với ${currentProject.houseType.toLowerCase()}, nên tạo khoảng đệm, cửa mở vào vùng sáng và tránh để vật lớn chặn lối đón khách.`,
                'nhip-song': `Với ${currentProject.houseType.toLowerCase()}: bếp ở phía kín, phòng ngủ tránh luồng đi, phòng thờ ở nơi sạch và trung tâm nhà không làm kho hoặc khu ướt.`
            };
            fengMapResultText.textContent = `${currentProfile}: ${guidance[1]} ${details[zoneName] || ''}`;
        };

        mapZones.forEach((zone) => zone.addEventListener('click', () => showZone(zone.dataset.zone)));
        fengMapForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = Object.fromEntries(new FormData(fengMapForm));
            currentProfile = data.fullName?.trim() || 'Gia chủ';
            currentProject = {
                houseType: data.houseType || 'Công trình',
                birthYear: data.birthYear || ''
            };
            mapZones.forEach((zone) => {
                zone.disabled = false;
                zone.classList.remove('is-active');
                const status = zone.querySelector('small em');
                if (status) {
                    status.textContent = 'Sẵn sàng';
                }
            });
            fengMapCaption.textContent = `Đã sẵn sàng phân tích 4 hạng mục cho ${currentProfile}`;
            showZone('nhip-khoi-cong');
        });
    }

    if (fengShuiForm && compassFace && compassNeedle && resultTitle && resultSummary && resultElement && resultElementText && resultGoodDirections && resultLayout && resultGuidanceTitle && resultGuidanceText) {
        const labelRadii = new Map([
            ['luopan-ring--outer', 42],
            ['luopan-ring--mountain', 46],
            ['luopan-ring--degrees', 48],
            ['luopan-ring--trigram', 29],
            ['luopan-ring--element', 20],
            ['luopan-ring--inner', 13]
        ]);

        compassFace.querySelectorAll('.luopan-ring span').forEach((label) => {
            const ringClass = Array.from(label.parentElement.classList).find((className) => labelRadii.has(className));
            const radius = labelRadii.get(ringClass) || 20;
            const angle = Number.parseFloat(label.style.getPropertyValue('--a')) * Math.PI / 180;
            label.style.left = `${50 + (Math.sin(angle) * radius)}%`;
            label.style.top = `${50 - (Math.cos(angle) * radius)}%`;
            label.style.transform = 'translate(-50%, -50%)';
        });

        const directionData = {
            north: { label: 'Bắc', angle: 0, element: 'Thủy', good: 'Bắc · Đông · Đông Nam', layout: 'Bếp nên giữ thế tựa vững, ưu tiên đón sáng phía Đông.', guidance: 'Đo lại trục Bắc bằng la bàn thật trước khi chốt cửa chính.' },
            northeast: { label: 'Đông Bắc', angle: 45, element: 'Thổ', good: 'Đông Bắc · Tây · Tây Bắc', layout: 'Khu vực sinh hoạt chung nên thông thoáng, hạn chế bí khí ở trung tâm nhà.', guidance: 'Kiểm tra nền đất và cao độ thoát nước trước khi triển khai móng.' },
            east: { label: 'Đông', angle: 90, element: 'Mộc', good: 'Đông · Bắc · Đông Nam', layout: 'Ưu tiên khoảng mở và cây xanh ở hướng Đông, bếp tránh đặt giữa nhà.', guidance: 'Kiểm tra nắng buổi sáng và vị trí cửa sổ trên mặt bằng sơ bộ.' },
            southeast: { label: 'Đông Nam', angle: 135, element: 'Mộc', good: 'Đông Nam · Đông · Bắc', layout: 'Tạo khoảng đệm xanh và luồng gió nhẹ ở mặt tiền nếu điều kiện cho phép.', guidance: 'Đối chiếu hướng gió, mưa tạt và lối tiếp cận thực tế của khu đất.' },
            south: { label: 'Nam', angle: 180, element: 'Hỏa', good: 'Nam · Đông · Đông Nam', layout: 'Cân bằng nắng hướng Nam bằng hiên, lam che hoặc lớp đệm mặt tiền.', guidance: 'Làm rõ hướng nắng và giải pháp chống nóng cùng kiến trúc sư.' },
            southwest: { label: 'Tây Nam', angle: 225, element: 'Thổ', good: 'Tây Nam · Tây · Tây Bắc', layout: 'Mặt Tây cần lớp đệm nhiệt; phòng ngủ nên tránh nhận nắng gắt trực tiếp.', guidance: 'Ưu tiên khảo sát nhiệt và thông gió trước khi bố trí phòng ngủ.' },
            west: { label: 'Tây', angle: 270, element: 'Kim', good: 'Tây · Tây Bắc · Tây Nam', layout: 'Mặt Tây nên có lam, ban công hoặc không gian phụ để giảm bức xạ.', guidance: 'Kiểm tra cao độ, nắng chiều và vị trí cây xanh che chắn.' },
            northwest: { label: 'Tây Bắc', angle: 315, element: 'Kim', good: 'Tây Bắc · Tây · Đông Bắc', layout: 'Giữ mặt tiền có lớp đệm; ưu tiên thông gió chéo thay vì đóng kín.', guidance: 'Đo hướng bằng nhiều thời điểm trong ngày để tránh sai số từ thiết bị.' },
            unknown: { label: 'Chưa xác định', angle: 0, element: 'Cần đo thực tế', good: 'Chờ xác định hướng', layout: 'Chưa nên chốt cửa chính và trục nhà khi chưa có hướng chuẩn.', guidance: 'Dùng la bàn điện thoại ở ngoài khu đất, tránh đứng gần kim loại hoặc thiết bị điện.' }
        };

        fengShuiForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = Object.fromEntries(new FormData(fengShuiForm));
            const direction = directionData[data.direction] || directionData.unknown;
            const birthYear = Number(data.birthYear);
            const lifeNumber = Number.isFinite(birthYear) ? (birthYear % 9 || 9) : 1;
            const elementNames = ['Kim', 'Thủy', 'Mộc', 'Hỏa', 'Thổ'];
            const personalElement = elementNames[(lifeNumber + (data.gender === 'Nữ' ? 1 : 0)) % elementNames.length];
            const personalIndex = (lifeNumber - 1) % 8;
            const personalDirections = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
            const personalDirection = personalDirections[personalIndex];
            const name = data.fullName.trim() || 'gia chủ';
            const enteredBearing = Number(data.bearing);
            const hasBearing = Number.isFinite(enteredBearing) && enteredBearing >= 0 && enteredBearing < 360;
            const targetAngle = hasBearing ? enteredBearing : (data.direction === 'unknown' ? personalIndex * 45 : direction.angle);
            const directionKeys = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
            const resolvedDirection = hasBearing
                ? directionData[directionKeys[Math.round(targetAngle / 45) % directionKeys.length]]
                : (data.direction === 'unknown' ? directionData[directionKeys[personalIndex]] : direction);
            const mountainNames = ['Tý', 'Quý', 'Sửu', 'Cấn', 'Dần', 'Giáp', 'Mão', 'Ất', 'Thìn', 'Tốn', 'Tỵ', 'Bính', 'Ngọ', 'Đinh', 'Mùi', 'Khôn', 'Thân', 'Canh', 'Dậu', 'Tân', 'Tuất', 'Càn', 'Hợi', 'Nhâm'];
            const mountainIndex = Math.floor((targetAngle + 7.5) / 15) % mountainNames.length;
            const mountainName = mountainNames[mountainIndex];
            const bearingDegrees = targetAngle.toFixed(1).replace('.0', '');
            const bearingDirection = hasBearing ? `Góc đo ${bearingDegrees}°` : (data.direction === 'unknown' ? personalDirection : direction.label);

            compassCaption.textContent = `Đã căn chỉnh theo hồ sơ của ${name}`;
            compassBearing.textContent = `${bearingDegrees}° · ${bearingDirection} (${mountainName})`;
            compassFace.style.transform = `rotate(${360 - targetAngle}deg)`;
            compassDirection.textContent = mountainName;
            compassElement.textContent = `Ngũ hành hướng: ${resolvedDirection.element} · Cung tham khảo: ${personalElement}`;
            compassFaceElement.textContent = `${personalElement} / ${resolvedDirection.element} · ${mountainName}`;
            compassInsight.classList.add('is-ready');
            compassInsightName.textContent = name;
            compassInsightElement.textContent = `${personalElement} · ${personalDirection}`;
            compassInsightGood.textContent = resolvedDirection.good;
            compassInsightHouse.textContent = data.houseType;
            compassInsightScale.textContent = `${data.direction === 'unknown' ? 'Hướng chưa xác định' : (directionData[data.direction]?.label || 'Hướng nhà')} · ${data.houseType}`;
            compassInsightMessage.textContent = `${resolvedDirection.layout} Dự kiến xây vào ${data.buildYear || 'thời gian chưa xác định'} nên được đối chiếu thêm với hướng nắng, gió và hiện trạng khu đất.`;
            resultTitle.textContent = `Bản đồ phong thủy của ${name}`;
            resultSummary.textContent = `${data.houseType}, hướng ${directionData[data.direction]?.label || 'chưa xác định'}.`;
            resultElement.textContent = personalElement;
            resultElementText.textContent = `Hồ sơ năm sinh cho thấy nhóm năng lượng ${personalElement}. Đây là điểm tham chiếu để trao đổi thêm, không phải kết luận cố định.`;
            resultGoodDirections.textContent = resolvedDirection.good;
            resultLayout.textContent = resolvedDirection.layout;
            resultGuidanceTitle.textContent = resolvedDirection.label === 'Chưa xác định' ? 'Xác định hướng trước khi chốt bản vẽ' : `Kiểm tra kỹ trục ${resolvedDirection.label}`;
            resultGuidanceText.textContent = resolvedDirection.guidance;
        });
    }

    if (estimateForm && estimateTotal && estimateArea && estimateFloorDetail && estimateFoundationDetail && estimateRoofDetail && estimateFloorArea && estimateUnitPrice) {
        const groundFloorsField = estimateForm.elements.groundFloors;
        const upperFloorsField = estimateForm.elements.upperFloors;
        const roofField = estimateForm.elements.roof;
        const widthField = estimateForm.elements.width;
        const lengthField = estimateForm.elements.namedItem('length');
        const foundationField = estimateForm.elements.foundation;
        const finishField = estimateForm.elements.finish;
        const customFinishInput = estimateForm.elements.customFinishPrice;
        const customPricePanel = document.querySelector('#estimate-custom-price-panel');
        const includeExtraArea = estimateForm.elements.includeExtraArea;
        const extraBathArea = document.querySelector('#estimate-bath-area');
        const extraSeNoArea = document.querySelector('#estimate-se-no-area');
        const extraTotalArea = document.querySelector('#estimate-extra-total');
        const extraSummaryArea = document.querySelector('#estimate-extra-summary');
        const extraPanel = document.querySelector('#estimate-extra-panel');
        const estimateReset = document.querySelector('#estimate-reset');
        const formatArea = (value) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value);
        const MAX_CUSTOM_PRICE_DIGITS = 8;
        const getTotalFloors = () => {
            const groundFloors = Number(groundFloorsField.value || 1);
            const upperFloors = Number(upperFloorsField.value || 0);
            return groundFloors + upperFloors;
        };
        const getRoofLoadFactor = () => Number(roofField.selectedOptions[0]?.dataset.roofLoad || 0);
        const getAdditionalArea = () => {
            const width = Number(widthField.value || 0);
            if (!Number.isFinite(width) || width <= 0) {
                return 0;
            }

            const bathArea = width * 1.5 * 0.5;
            const seNoArea = width * 1 * 0.5;
            const totalArea = (bathArea + seNoArea) * 0.5;
            return totalArea;
        };
        const updateEstimateOptions = () => {
            const floors = getTotalFloors();
            const upperFloors = Number(upperFloorsField.value || 0);
            const width = Number(widthField.value);
            const length = Number(lengthField.value);
            const roofLoad = getRoofLoadFactor();
            const hasCompleteInputs = [width, length].every((value) => Number.isFinite(value) && value > 0) && floors > 0 && roofField.value;

            if (!hasCompleteInputs) {
                Array.from(foundationField.options).forEach((option) => {
                    if (option.dataset.maxFloors || option.dataset.maxLoad) {
                        option.disabled = false;
                    }
                });
                foundationField.classList.remove('has-locked-options');
                return;
            }

            let hasLockedOption = false;
            Array.from(foundationField.options).forEach((option) => {
                if (!option.dataset.maxFloors && !option.dataset.maxLoad) {
                    return;
                }

                const maxFloors = Number(option.dataset.maxFloors);
                const maxLoad = Number(option.dataset.maxLoad);
                let disabled = false;

                if (option.value === '0.15') {
                    disabled = upperFloors > 1 || (upperFloors === 1 && roofLoad > 2.5);
                }

                if (option.value === '0.5') {
                    disabled = upperFloors > 2 || (upperFloors === 2 && roofLoad > 2.5);
                }

                if (Number.isFinite(maxFloors) && Number.isFinite(maxLoad)) {
                    disabled = disabled || upperFloors > maxFloors || (upperFloors + roofLoad) > maxLoad;
                }

                option.disabled = disabled;
                hasLockedOption = hasLockedOption || option.disabled;
            });

            if (foundationField.selectedOptions[0]?.disabled) {
                foundationField.value = '';
            }
            foundationField.classList.toggle('has-locked-options', hasLockedOption);
        };

        const updateExtraAreaDisplay = () => {
            const width = Number(widthField.value || 0);
            const bathArea = Number.isFinite(width) && width > 0 ? (width * 1.5 * 0.5) : 0;
            const seNoArea = Number.isFinite(width) && width > 0 ? (width * 1 * 0.5) : 0;
            const totalArea = (bathArea + seNoArea) * 0.5;
            const selectedRoofValue = Number(roofField.value || 0);
            const isBtctRoof = selectedRoofValue === 0.4 || selectedRoofValue === 0.5;
            const extraToggle = document.querySelector('.estimate-extra-toggle');

            if (includeExtraArea) {
                includeExtraArea.disabled = isBtctRoof;
                if (isBtctRoof) {
                    includeExtraArea.checked = false;
                }

                if (extraToggle) {
                    extraToggle.classList.toggle('is-disabled', isBtctRoof);
                }
            }

            if (extraBathArea) {
                extraBathArea.textContent = Number.isFinite(width) && width > 0 ? `${formatArea(bathArea)} m²` : '--';
            }
            if (extraSeNoArea) {
                extraSeNoArea.textContent = Number.isFinite(width) && width > 0 ? `${formatArea(seNoArea)} m²` : '--';
            }
            if (extraTotalArea) {
                extraTotalArea.textContent = Number.isFinite(width) && width > 0 ? `${formatArea(totalArea)} m²` : '--';
            }
            if (extraPanel && includeExtraArea) {
                extraPanel.hidden = !includeExtraArea.checked || isBtctRoof;
            }
        };

        let customPriceDigitsBuffer = '';

        const updateCustomPriceState = () => {
            const shouldUseCustomPrice = finishField.value === 'custom';
            if (customPricePanel) {
                customPricePanel.hidden = !shouldUseCustomPrice;
            }
            if (customFinishInput) {
                customFinishInput.disabled = !shouldUseCustomPrice;
                if (!shouldUseCustomPrice) {
                    customPriceDigitsBuffer = '';
                    customFinishInput.value = '';
                }
            }
        };

        widthField.addEventListener('input', () => {
            updateEstimateOptions();
            updateExtraAreaDisplay();
        });
        lengthField.addEventListener('input', updateEstimateOptions);
        groundFloorsField.addEventListener('input', updateEstimateOptions);
        upperFloorsField.addEventListener('input', updateEstimateOptions);
        groundFloorsField.addEventListener('change', updateEstimateOptions);
        upperFloorsField.addEventListener('change', updateEstimateOptions);
        roofField.addEventListener('change', () => {
            updateEstimateOptions();
            updateExtraAreaDisplay();
        });
        foundationField.addEventListener('change', updateEstimateOptions);
        finishField.addEventListener('change', () => {
            updateCustomPriceState();
            hasCalculatedPackage = false;
            updatePackagePreview();
        });
        customFinishInput?.addEventListener('focus', () => {
            customPriceDigitsBuffer = String(customFinishInput.value || '').replace(/\D/g, '');
            customFinishInput.value = customPriceDigitsBuffer;
        });
        customFinishInput?.addEventListener('input', () => {
            const digits = String(customFinishInput.value || '').replace(/\D/g, '').slice(0, MAX_CUSTOM_PRICE_DIGITS);
            customPriceDigitsBuffer = digits;
            customFinishInput.value = digits;
        });
        customFinishInput?.addEventListener('blur', () => {
            const digits = String(customFinishInput.value || '').replace(/\D/g, '');
            customPriceDigitsBuffer = digits;
            customFinishInput.value = digits ? Number(digits).toLocaleString('vi-VN') : '';
        });
        includeExtraArea?.addEventListener('change', updateExtraAreaDisplay);
        updateExtraAreaDisplay();
        updateCustomPriceState();
        updateEstimateOptions();
        estimateReset?.addEventListener('click', () => {
            estimateForm.reset();
            groundFloorsField.value = '1';
            estimateTotal.textContent = '--';
            estimateArea.textContent = 'Nhập thông tin để bắt đầu tính.';
            estimateFloorDetail.textContent = '--';
            estimateFoundationDetail.textContent = '--';
            estimateRoofDetail.textContent = '--';
            estimateFloorArea.textContent = '--';
            estimateUnitPrice.textContent = '--';
            if (extraSummaryArea) {
                extraSummaryArea.textContent = '--';
            }
            customPriceDigitsBuffer = '';
            updateCustomPriceState();
            updateExtraAreaDisplay();
            hasCalculatedPackage = false;
            updatePackagePreview();
            updateEstimateOptions();
        });
        estimateForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(estimateForm);
            const length = Number(formData.get('length'));
            const width = Number(formData.get('width'));
            const groundFloors = Number(formData.get('groundFloors') || 1);
            const upperFloors = Number(formData.get('upperFloors') || 0);
            const floors = groundFloors + upperFloors;
            const roofRate = Number(formData.get('roof'));
            const foundationRate = Number(formData.get('foundation'));
            const finishValue = formData.get('finish');
            const selectedPackagePrice = finishValue === null || finishValue === '' ? NaN : Number(finishValue);
            const rawCustomFinishPrice = String(formData.get('customFinishPrice') || '').replace(/\D/g, '');
            const customFinishPrice = rawCustomFinishPrice ? Number(rawCustomFinishPrice) : NaN;
            const shouldUseCustomPrice = finishValue === 'custom';
            const unitPrice = shouldUseCustomPrice && Number.isFinite(customFinishPrice) && customFinishPrice > 0 ? customFinishPrice : selectedPackagePrice;
            const style = formData.get('style');
            const includeExtra = includeExtraArea?.checked;
            const extraArea = includeExtra ? getAdditionalArea() : 0;

            if (![length, width, floors, roofRate, foundationRate, unitPrice].every(Number.isFinite) || floors <= 0 || !style) {
                hasCalculatedPackage = false;
                updatePackagePreview();
                estimateTotal.textContent = '--';
                estimateArea.textContent = 'Vui lòng điền và chọn đầy đủ thông tin để tính, không cần tải lại trang.';
                estimateFloorDetail.textContent = '--';
                estimateFoundationDetail.textContent = '--';
                estimateRoofDetail.textContent = '--';
                estimateFloorArea.textContent = '--';
                estimateUnitPrice.textContent = '--';
                return;
            }

            const footprint = length * width;
            const floorArea = footprint * floors;
            const roofArea = footprint * roofRate;
            const foundationArea = footprint * foundationRate;
            const convertedArea = Number((floorArea + foundationArea + roofArea + extraArea).toFixed(2));
            const estimatedTotal = convertedArea * unitPrice;
            const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(Math.round(value));
            const formatPercent = (value) => `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value * 100)}%`;

            estimateTotal.textContent = `${formatNumber(estimatedTotal)} đ`;
            estimateArea.textContent = `Diện tích xây dựng cơ bản: ${formatArea(footprint)} m²`;
            estimateFloorDetail.textContent = `${formatArea(footprint)} × ${floors} tầng = ${formatArea(floorArea)} m²`;
            estimateFoundationDetail.textContent = `${formatArea(footprint)} × ${formatPercent(foundationRate)} = ${formatArea(foundationArea)} m²`;
            estimateRoofDetail.textContent = `${formatArea(footprint)} × ${formatPercent(roofRate)} = ${formatArea(roofArea)} m²`;
            if (extraSummaryArea) {
                extraSummaryArea.textContent = includeExtra ? `${formatArea(extraArea)} m²` : '0 m²';
            }
            estimateFloorArea.textContent = `${formatArea(convertedArea)} m²`;
            estimateUnitPrice.textContent = `${formatNumber(unitPrice)} đ/m²`;
            hasCalculatedPackage = true;
            updatePackagePreview();
        });
    }

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nameField = contactForm.elements['Họ và tên'];
            const phoneField = contactForm.elements['Số điện thoại'];
            const name = nameField.value.trim().replace(/\s+/g, ' ');
            const phone = phoneField.value.trim();
            const validName = /^[A-Za-zÀ-ỹĐđ]+(?:[ '\-][A-Za-zÀ-ỹĐđ]+)+$/.test(name) && name.length <= 60;
            const validPhone = isVietnameseMobile(phone);

            nameField.value = name;

            if (!validName) {
                formStatus.classList.add('error');
                formStatus.textContent = 'Tên chưa hợp lệ. Ví dụ: Nguyễn Văn A.';
                nameField.focus();
                return;
            }

            if (!validPhone) {
                formStatus.classList.add('error');
                formStatus.textContent = 'Nhập số di động Việt Nam hợp lệ gồm 10 số, ví dụ 0912345678.';
                phoneField.focus();
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Đang gửi...';
            formStatus.classList.remove('error');
            formStatus.textContent = 'Đang chuyển yêu cầu đến email...';

            try {
                const response = await fetch('https://formsubmit.co/ajax/pndat171203@gmail.com', {
                    method: 'POST',
                    headers: { Accept: 'application/json' },
                    body: new FormData(contactForm)
                });

                if (!response.ok) {
                    throw new Error('Form submission failed');
                }

                formStatus.textContent = 'Đã gửi yêu cầu thành công. Chúng tôi sẽ liên hệ lại sớm.';
                contactForm.reset();
            } catch (error) {
                formStatus.classList.add('error');
                formStatus.textContent = 'Chưa gửi được. Vui lòng kiểm tra kết nối mạng và thử lại.';
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });

        const setFieldMessage = () => {
            const name = contactForm.elements['Họ và tên'];
            const phone = contactForm.elements['Số điện thoại'];
            phone.value = phone.value.replace(/\D/g, '').slice(0, 10);
            const validPhone = isVietnameseMobile(phone.value.trim());
            const validName = /^[A-Za-zÀ-ỹĐđ]+(?:[ '\-][A-Za-zÀ-ỹĐđ]+)+$/.test(name.value.trim());

            phone.setCustomValidity(phone.value && !validPhone ? 'Nhập số di động Việt Nam hợp lệ gồm 10 số, ví dụ 0912345678.' : '');
            name.setCustomValidity(name.value && !validName ? 'Tên chưa hợp lệ. Ví dụ: Nguyễn Văn A.' : '');

            if (phone.value && !validPhone) {
                formStatus.classList.add('error');
                formStatus.textContent = 'Nhập số di động Việt Nam hợp lệ gồm 10 số, ví dụ 0912345678.';
            } else if (name.value && !validName) {
                formStatus.classList.add('error');
                formStatus.textContent = 'Tên chưa hợp lệ. Ví dụ: Nguyễn Văn A.';
            } else {
                formStatus.classList.remove('error');
                formStatus.textContent = '';
            }
        };

        contactForm.elements['Họ và tên'].addEventListener('input', setFieldMessage);
        contactForm.elements['Số điện thoại'].addEventListener('input', setFieldMessage);
    }

    if (productCards.length > 0 && pagination) {
        const productsPerPage = 12;
        let activeFilter = 'all';
        let currentProductPage = 1;

        const getProductPrice = (card) => Number((card.querySelector('.price')?.textContent || '').replace(/[^\d]/g, ''));
        const getTileArea = (card) => {
            const [width, height] = (card.dataset.tileSize || '').split('x').map(Number);
            return width * height;
        };
        const getProductText = (card) => card.textContent.toLowerCase();
        const typeMatches = (card, type) => {
            if (type === 'all') return true;
            const text = getProductText(card);
            if (type === 'ceramic') return /ceramic|men bóng/.test(text);
            if (type === 'porcelain') return text.includes('porcelain');
            if (type === 'marble') return text.includes('marble');
            if (type === 'slab') return text.includes('slab');
            return /chống trơn|ngoài trời|sân vườn|ban công/.test(text);
        };

        const getVisibleProducts = () => productCards.filter((card) => {
            const price = getProductPrice(card);
            const priceFilter = materialPrice?.value || 'all';
            const matchesPrice = priceFilter === 'all'
                || (priceFilter === 'budget' && price < 400000)
                || (priceFilter === 'standard' && price >= 400000 && price <= 800000)
                || (priceFilter === 'premium' && price > 800000);
            const search = materialSearch?.value.trim().toLowerCase() || '';
            return (activeFilter === 'all' || card.dataset.tileSize === activeFilter)
                && (!materialSize || materialSize.value === 'all' || card.dataset.tileSize === materialSize.value)
                && (!materialType || typeMatches(card, materialType.value))
                && matchesPrice
                && (!search || getProductText(card).includes(search));
        });

        const renderCatalog = () => {
            const visibleProducts = getVisibleProducts().sort((first, second) => {
                if (materialSort?.value === 'price-asc') return getProductPrice(first) - getProductPrice(second);
                if (materialSort?.value === 'price-desc') return getProductPrice(second) - getProductPrice(first);
                if (materialSort?.value === 'size-asc') return getTileArea(first) - getTileArea(second);
                if (materialSort?.value === 'size-desc') return getTileArea(second) - getTileArea(first);
                return productCards.indexOf(first) - productCards.indexOf(second);
            });
            const productGrid = productCards[0].parentElement;
            if (productGrid) {
                visibleProducts.forEach((card) => productGrid.appendChild(card));
                productCards.filter((card) => !visibleProducts.includes(card)).forEach((card) => productGrid.appendChild(card));
            }
            const pageCount = Math.max(1, Math.ceil(visibleProducts.length / productsPerPage));
            currentProductPage = Math.min(currentProductPage, pageCount);

            if (materialCount) materialCount.textContent = visibleProducts.length;
            if (materialEmpty) materialEmpty.hidden = visibleProducts.length > 0;

            productCards.forEach((card) => card.classList.add('is-hidden'));
            const start = (currentProductPage - 1) * productsPerPage;
            visibleProducts.slice(start, start + productsPerPage).forEach((card) => {
                card.classList.remove('is-hidden');
            });

            pagination.innerHTML = '';
            for (let page = 1; page <= pageCount; page += 1) {
                const pageButton = document.createElement('button');
                pageButton.type = 'button';
                pageButton.className = `catalog-page${page === currentProductPage ? ' active' : ''}`;
                pageButton.textContent = page;
                pageButton.setAttribute('aria-label', `Trang ${page}`);
                pageButton.addEventListener('click', () => {
                    currentProductPage = page;
                    renderCatalog();
                    const catalogToolbar = document.querySelector('.catalog-toolbar');
                    if (catalogToolbar) {
                        const scrollTop = window.scrollY
                            + catalogToolbar.getBoundingClientRect().top
                            - Number.parseFloat(window.getComputedStyle(catalogToolbar).scrollMarginTop);
                        smoothScrollTo(scrollTop);
                    }
                });
                pagination.appendChild(pageButton);
            }
        };

        tileFilters.forEach((filterButton) => {
            filterButton.addEventListener('click', () => {
                activeFilter = filterButton.dataset.tileFilter;
                currentProductPage = 1;
                tileFilters.forEach((button) => button.classList.toggle('active', button === filterButton));
                renderCatalog();
            });
        });

        const applyCatalogFilters = () => {
            currentProductPage = 1;
            if (materialSummary) materialSummary.hidden = false;
            renderCatalog();
        };

        materialApply?.addEventListener('click', applyCatalogFilters);
        materialSort?.addEventListener('change', applyCatalogFilters);
        materialSearch?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                applyCatalogFilters();
            }
        });

        materialReset?.addEventListener('click', () => {
            if (materialSearch) materialSearch.value = '';
            [materialSize, materialType, materialPrice, materialSort].forEach((select) => {
                if (select) select.value = select.id === 'material-sort' ? 'default' : 'all';
            });
            activeFilter = 'all';
            tileFilters.forEach((button) => button.classList.toggle('active', button.dataset.tileFilter === 'all'));
            currentProductPage = 1;
            if (materialSummary) materialSummary.hidden = true;
            renderCatalog();
        });

        renderCatalog();
    }

    if (interiorCards.length > 0 && interiorPagination) {
        const productsPerPage = 9;
        let activeCategory = 'all';
        let currentPage = 1;

        const getInteriorPrice = (card) => Number(card.dataset.interiorPrice);
        const getInteriorText = (card) => card.textContent.toLowerCase();

        const renderInteriorCatalog = () => {
            const search = interiorSearch?.value.trim().toLowerCase() || '';
            const priceFilter = interiorPrice?.value || 'all';
            const visibleProducts = interiorCards.filter((card) => {
                const price = getInteriorPrice(card);
                const matchesPrice = priceFilter === 'all'
                    || (priceFilter === 'budget' && price < 50000000)
                    || (priceFilter === 'standard' && price >= 50000000 && price <= 150000000)
                    || (priceFilter === 'premium' && price > 150000000);
                return (activeCategory === 'all' || card.dataset.interiorCategory === activeCategory)
                    && (!interiorType || interiorType.value === 'all' || card.dataset.interiorCategory === interiorType.value)
                    && matchesPrice
                    && (!search || getInteriorText(card).includes(search));
            });
            const sortMode = interiorSort?.value || 'default';
            visibleProducts.sort((first, second) => {
                if (sortMode === 'price-asc') return getInteriorPrice(first) - getInteriorPrice(second);
                if (sortMode === 'price-desc') return getInteriorPrice(second) - getInteriorPrice(first);
                if (sortMode === 'name-asc') {
                    return (first.querySelector('h3')?.textContent || '').localeCompare(second.querySelector('h3')?.textContent || '', 'vi');
                }
                return interiorCards.indexOf(first) - interiorCards.indexOf(second);
            });
            const pageCount = Math.max(1, Math.ceil(visibleProducts.length / productsPerPage));
            currentPage = Math.min(currentPage, pageCount);

            if (interiorCount) interiorCount.textContent = visibleProducts.length;
            if (interiorEmpty) interiorEmpty.hidden = visibleProducts.length > 0;

            const start = (currentPage - 1) * productsPerPage;
            const pageProducts = visibleProducts.slice(start, start + productsPerPage);
            interiorProductGrid.append(...pageProducts, ...interiorCards.filter((card) => !pageProducts.includes(card)));
            interiorCards.forEach((card) => card.classList.add('is-hidden'));
            pageProducts.forEach((card) => card.classList.remove('is-hidden'));

            interiorPagination.innerHTML = '';
            for (let page = 1; page <= pageCount; page += 1) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `catalog-page${page === currentPage ? ' active' : ''}`;
                button.textContent = page;
                button.setAttribute('aria-label', `Trang nội thất ${page}`);
                button.addEventListener('click', () => {
                    currentPage = page;
                    renderInteriorCatalog();
                    const interiorToolbar = document.querySelector('.catalog-toolbar[aria-label="Bộ lọc nội thất"]');
                    if (interiorToolbar) {
                        const scrollTop = window.scrollY
                            + interiorToolbar.getBoundingClientRect().top
                            - Number.parseFloat(window.getComputedStyle(interiorToolbar).scrollMarginTop);
                        smoothScrollTo(scrollTop);
                    }
                });
                interiorPagination.appendChild(button);
            }
        };

        const applyInteriorFilters = () => {
            activeCategory = 'all';
            currentPage = 1;
            if (interiorSummary) interiorSummary.hidden = false;
            renderInteriorCatalog();
        };

        interiorApply?.addEventListener('click', applyInteriorFilters);
        interiorSearch?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                applyInteriorFilters();
            }
        });

        interiorReset?.addEventListener('click', () => {
            if (interiorSearch) interiorSearch.value = '';
            [interiorType, interiorPrice, interiorSort].forEach((select) => {
                if (select) select.value = select.id === 'interior-sort' ? 'default' : 'all';
            });
            activeCategory = 'all';
            currentPage = 1;
            if (interiorSummary) interiorSummary.hidden = true;
            renderInteriorCatalog();
        });

        renderInteriorCatalog();
    }

    const lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Đóng ảnh">&times;</button><img alt="Hình ảnh xem toàn màn hình">';
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
    };

    const openLightbox = (image) => {
            lightboxImage.src = image.currentSrc || image.src;
            lightboxImage.alt = image.alt || 'Hình ảnh xem toàn màn hình';
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
    };

    document.querySelectorAll('.card img:not(.map-link img):not(.activity-card img), .hero-slide img, .page-header img').forEach((image) => {
        if (image.closest('.materials-page .card, .interior-page .card')) return;
        image.addEventListener('click', () => openLightbox(image));
    });

    document.querySelectorAll('.playground-card').forEach((card) => {
        card.addEventListener('click', () => {
            const image = card.querySelector('img');
            if (image) {
                openLightbox(image);
            }
        });
    });

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    lightboxClose.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeLightbox();
        }
    });

    document.querySelectorAll('.nav-list a').forEach((link) => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('current');
        }
    });

    const revealItems = document.querySelectorAll('.section, .card, .info-card, .stat-box, .contact-item, .cta-banner');
    revealItems.forEach((item, index) => {
        item.classList.add('reveal');
        item.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
    });

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add('visible'));
    }

    if (slides.length > 0 && heroTrack) {
        let currentIndex = 0;
        let heroTimer;
        let isHeroMoving = false;
        let heroMoveDirection = '';

        const updateHeroState = () => {
            const visibleSlide = heroTrack.firstElementChild;
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', slide === visibleSlide);
                slide.setAttribute('aria-hidden', slide === visibleSlide ? 'false' : 'true');
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const moveHeroNext = () => {
            if (isHeroMoving) {
                return;
            }

            isHeroMoving = true;
            heroMoveDirection = 'next';
            heroTrack.style.transform = 'translateX(-100%)';
        };

        const moveHeroPrevious = () => {
            if (isHeroMoving) {
                return;
            }

            isHeroMoving = true;
            heroMoveDirection = 'previous';
            heroTrack.style.transition = 'none';
            heroTrack.insertBefore(heroTrack.lastElementChild, heroTrack.firstElementChild);
            heroTrack.style.transform = 'translateX(-100%)';
            heroTrack.offsetWidth;
            heroTrack.style.transition = '';
            heroTrack.style.transform = 'translateX(0)';
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateHeroState();
            heroTrack.addEventListener('transitionend', () => {
                isHeroMoving = false;
                heroMoveDirection = '';
            }, { once: true });
        };

        heroTrack.addEventListener('transitionend', (event) => {
            if (event.propertyName !== 'transform' || !isHeroMoving || heroMoveDirection !== 'next') {
                return;
            }

            heroTrack.style.transition = 'none';
            heroTrack.appendChild(heroTrack.firstElementChild);
            heroTrack.style.transform = 'translateX(0)';
            heroTrack.offsetWidth;
            heroTrack.style.transition = '';
            currentIndex = (currentIndex + 1) % slides.length;
            updateHeroState();
            isHeroMoving = false;
            heroMoveDirection = '';
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (isHeroMoving || index === currentIndex) {
                    return;
                }

                heroTrack.style.transition = 'none';
                while (slides[index] !== heroTrack.firstElementChild) {
                    heroTrack.appendChild(heroTrack.firstElementChild);
                }
                heroTrack.style.transform = 'translateX(0)';
                heroTrack.offsetWidth;
                heroTrack.style.transition = '';
                currentIndex = index;
                updateHeroState();
            });
        });

        heroPrevious?.addEventListener('click', moveHeroPrevious);
        heroNext?.addEventListener('click', moveHeroNext);

        updateHeroState();
        heroTimer = window.setInterval(moveHeroNext, 2600);
    }

    const activityTrack = document.querySelector('.activity-track');
    const activityPrevious = document.querySelector('.activity-arrow--prev');
    const activityNext = document.querySelector('.activity-arrow--next');

    if (activityTrack && activityTrack.querySelectorAll('.activity-card').length > 1) {
        let activityTimer;
        let isMoving = false;
        const getActivityStep = () => activityTrack.querySelector('.activity-card').getBoundingClientRect().width + 24;

        const startActivitySlider = () => {
            window.clearInterval(activityTimer);
            activityTimer = window.setInterval(moveActivityNext, 2600);
        };

        const moveActivityNext = () => {
            if (isMoving) {
                return;
            }

            isMoving = true;
            activityTrack.style.transform = `translate3d(-${getActivityStep()}px, 0, 0)`;
        };

        const moveActivityPrevious = () => {
            if (isMoving) {
                return;
            }

            const cards = activityTrack.querySelectorAll('.activity-card');
            activityTrack.style.transition = 'none';
            activityTrack.insertBefore(cards[cards.length - 1], cards[0]);
            activityTrack.style.transform = `translate3d(-${getActivityStep()}px, 0, 0)`;
            activityTrack.offsetWidth;
            activityTrack.style.transition = '';
            activityTrack.style.transform = 'translate3d(0, 0, 0)';
            startActivitySlider();
        };

        activityTrack.addEventListener('transitionend', (event) => {
            if (event.propertyName !== 'transform' || !isMoving) {
                return;
            }

            activityTrack.style.transition = 'none';
            activityTrack.appendChild(activityTrack.querySelector('.activity-card'));
            activityTrack.style.transform = 'translate3d(0, 0, 0)';
            activityTrack.offsetWidth;
            activityTrack.style.transition = '';
            isMoving = false;
        });

        activityPrevious?.addEventListener('click', moveActivityPrevious);
        activityNext?.addEventListener('click', moveActivityNext);
        startActivitySlider();
    }

    if (mobileMenu && navList) {
        const mobileNav = navList.closest('nav');
        const mobileNavClose = document.createElement('button');
        mobileNavClose.className = 'mobile-nav-close';
        mobileNavClose.type = 'button';
        mobileNavClose.setAttribute('aria-label', 'Đóng menu');
        mobileNavClose.innerHTML = '&times;';
        mobileNav?.appendChild(mobileNavClose);

        mobileMenu.setAttribute('role', 'button');
        mobileMenu.setAttribute('tabindex', '0');
        mobileMenu.setAttribute('aria-expanded', 'false');

        const setMobileMenu = (isOpen) => {
            navList.classList.toggle('active', isOpen);
            mobileMenu.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        const toggleMobileMenu = () => {
            setMobileMenu(!navList.classList.contains('active'));
        };

        mobileMenu.addEventListener('click', () => {
            toggleMobileMenu();
        });

        mobileMenu.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleMobileMenu();
            }
        });

        mobileNavClose.addEventListener('click', () => {
            setMobileMenu(false);
            mobileMenu.focus();
        });

        navList.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                setMobileMenu(false);
            });
        });
    }
});