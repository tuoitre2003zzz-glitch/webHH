document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.slider-dot'));
    const heroTrack = document.querySelector('.hero-track');
    const heroPrevious = document.querySelector('.hero-arrow--prev');
    const heroNext = document.querySelector('.hero-arrow--next');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isVietnameseMobile = (value) => /^(03[2-9]|05[2568]|07[06789]|08[156789]|09[0-9])\d{7}$/.test(value);

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
    const interiorCards = Array.from(document.querySelectorAll('.product-card[data-interior-category]'));
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
    const estimateForm = document.querySelector('#house-estimate-form');
    const estimateTotal = document.querySelector('#estimate-total');
    const estimateArea = document.querySelector('#estimate-area');
    const estimateFloorDetail = document.querySelector('#estimate-floor-detail');
    const estimateFoundationDetail = document.querySelector('#estimate-foundation-detail');
    const estimateRoofDetail = document.querySelector('#estimate-roof-detail');
    const estimateFloorArea = document.querySelector('#estimate-floor-area');
    const estimateUnitPrice = document.querySelector('#estimate-unit-price');
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
        finishField.addEventListener('change', updateCustomPriceState);
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
        const productsPerPage = 9;
        let activeFilter = 'all';
        let currentProductPage = 1;

        const getProductPrice = (card) => Number((card.querySelector('.price')?.textContent || '').replace(/[^\d]/g, ''));
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

        document.querySelectorAll('.product-card[data-tile-size] img').forEach((image) => {
            image.src = 'img/gach.png';
            image.alt = `${image.alt} - ảnh minh họa gạch`;
        });

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
                if (materialSort?.value === 'size-asc') return (first.dataset.tileSize || '').localeCompare(second.dataset.tileSize || '', undefined, { numeric: true });
                return productCards.indexOf(first) - productCards.indexOf(second);
            });
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
                    document.querySelector('.catalog-intro')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

        const getInteriorPrice = (card) => Number((card.querySelector('.price')?.textContent || '').replace(/[^\d]/g, ''));
        const getInteriorText = (card) => card.textContent.toLowerCase();

        const renderInteriorCatalog = () => {
            const search = interiorSearch?.value.trim().toLowerCase() || '';
            const priceFilter = interiorPrice?.value || 'all';
            const visibleProducts = interiorCards.filter((card) => {
                const price = getInteriorPrice(card);
                const matchesPrice = priceFilter === 'all'
                    || (priceFilter === 'budget' && price < 5000000)
                    || (priceFilter === 'standard' && price >= 5000000 && price <= 15000000)
                    || (priceFilter === 'premium' && price > 15000000);
                return (activeCategory === 'all' || card.dataset.interiorCategory === activeCategory)
                    && (!interiorType || interiorType.value === 'all' || card.dataset.interiorCategory === interiorType.value)
                    && matchesPrice
                    && (!search || getInteriorText(card).includes(search));
            }).sort((first, second) => {
                if (interiorSort?.value === 'price-asc') return getInteriorPrice(first) - getInteriorPrice(second);
                if (interiorSort?.value === 'price-desc') return getInteriorPrice(second) - getInteriorPrice(first);
                if (interiorSort?.value === 'name-asc') return (first.querySelector('h3')?.textContent || '').localeCompare(second.querySelector('h3')?.textContent || '', 'vi');
                return interiorCards.indexOf(first) - interiorCards.indexOf(second);
            });
            const pageCount = Math.max(1, Math.ceil(visibleProducts.length / productsPerPage));
            currentPage = Math.min(currentPage, pageCount);

            if (interiorCount) interiorCount.textContent = visibleProducts.length;
            if (interiorEmpty) interiorEmpty.hidden = visibleProducts.length > 0;

            interiorCards.forEach((card) => card.classList.add('is-hidden'));
            const start = (currentPage - 1) * productsPerPage;
            visibleProducts.slice(start, start + productsPerPage).forEach((card) => card.classList.remove('is-hidden'));

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
                    document.querySelector('.interior-filters')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        mobileMenu.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }
});