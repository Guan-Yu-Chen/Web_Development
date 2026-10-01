document.addEventListener('DOMContentLoaded', () => {
    const mapLayout = document.getElementById('map-wrapper'); // Changed to map-wrapper
    const lotList = document.getElementById('lot-list');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    let currentType = 'moto'; // 'moto' or 'car'

    // SVG Content (Embedded to avoid CORS)
    const svgContent = `
    <svg width="100%" height="100%" viewBox="0 0 1147 1028" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
            text {
                fill: #9ca3af;
                font-family: 'Noto Serif TC', serif;
                font-size: 40px;
                font-weight: bold;
                letter-spacing: 0em;
                white-space: pre;
            }
        </style>
        <path id="li-hsing" d="M498.528 37.4394L107.435 0L75.7454 187.821L490.026 222.764L498.528 37.4394Z" fill="none"/>
        <path id="cheng-hsing" d="M898.895 77.3746L527.898 41.8073L517.077 224.012L891.939 237.74L898.895 77.3746Z" fill="none"/>
        <path id="ching-yeh" d="M1147 101.71L937.541 81.7426L929.039 239.612L1140.04 247.1L1147 101.71Z" fill="none"/>
        <path id="kuang-fu" d="M487.707 243.356L71.1078 207.164L0 606.518L466.065 647.701L487.707 243.356Z" fill="none"/>
        <path id="cheng-kung" d="M889.621 260.827L516.304 247.1L494.663 650.197L868.752 668.916L889.621 260.827Z" fill="none"/>
        <path id="tzu-chiang" d="M1136.95 270.187L926.72 262.699L905.079 672.036L1116.08 683.268L1136.95 270.187Z" fill="none"/>
        <path id="sheng-li" d="M866.433 695.124L491.571 675.156L477.659 965.935L850.975 995.263L866.433 695.124Z" fill="none"/>
        <path id="tung-ning" d="M1113.76 708.228L902.76 696.996L888.075 999.007L1097.53 1027.09L1113.76 708.228Z" fill="none"/>
        <text xml:space="preserve"><tspan x="273" y="96">&#x529b;</tspan><tspan x="273" y="144">&#x884c;</tspan></text>
        <text xml:space="preserve"><tspan x="692" y="136">&#x6210;&#10;</tspan><tspan x="692" y="184">&#x674f;</tspan></text>
        <text xml:space="preserve"><tspan x="1021" y="156">&#x656c;</tspan><tspan x="1021" y="204">&#x696d;</tspan></text>
        <text xml:space="preserve"><tspan x="233" y="411">&#x5149;</tspan><tspan x="233" y="459">&#x5fa9;</tspan></text>
        <text xml:space="preserve"><tspan x="672" y="439">&#x6210;</tspan><tspan x="672" y="487">&#x529f;</tspan></text>
        <text xml:space="preserve"><tspan x="1001" y="453">&#x81ea;</tspan><tspan x="1001" y="501">&#x5f37;</tspan></text>
        <text xml:space="preserve"><tspan x="653" y="822">&#x52dd;</tspan><tspan x="653" y="870">&#x5229;</tspan></text>
        <text xml:space="preserve"><tspan x="981" y="847">&#x6771;</tspan><tspan x="981" y="895">&#x5be7;</tspan></text>
    </svg>
    `;

    // Configuration for Parking Lots with map positions (x, y in SVG viewBox coordinates)
    const motoLots = [
        { name: '光復前門地下', campus: '光復校區', campusId: 'kuang-fu', searchName: '光復前門地下機車停車場', x: 300, y: 600, totalSpots: 1454 },
        { name: '管理學院', campus: '光復校區', campusId: 'kuang-fu', searchName: '管理學院機車停車場', x: 450, y: 550, totalSpots: 327 },
        { name: '雲平東側', campus: '光復校區', campusId: 'kuang-fu', searchName: '雲平東側機車停車場', x: 450, y: 400, totalSpots: 479 },
        { name: '都計系地下', campus: '光復校區', campusId: 'kuang-fu', searchName: '都計系地下機車停車場', x: 200, y: 250, totalSpots: 298 },
        { name: '修齊大樓地下', campus: '光復校區', campusId: 'kuang-fu', searchName: '修齊大樓地下機車停車場', x: 400, y: 250, totalSpots: 441 },
        { name: '三系館地下', campus: '成功校區', campusId: 'cheng-kung', searchName: '三系館地下機車停車場', x: 850, y: 500, totalSpots: 680 },
        { name: '理學大樓地下', campus: '成功校區', campusId: 'cheng-kung', searchName: '理學大樓地下機車停車場', x: 550, y: 300, totalSpots: 745 },
        { name: '成功前門地下', campus: '成功校區', campusId: 'cheng-kung', searchName: '成功前門地下機車停車場', x: 700, y: 600, totalSpots: 663 },
        { name: '新園平面', campus: '成功校區', campusId: 'cheng-kung', searchName: '新園平面機車停車場', x: 550, y: 450, totalSpots: 114 },
        { name: '土木系平面', campus: '成功校區', campusId: 'cheng-kung', searchName: '土木系平面機車停車場', x: 850, y: 350, totalSpots: 204 },
        { name: '奇美樓地下', campus: '自強校區', campusId: 'tzu-chiang', searchName: '奇美樓地下機車停車場', x: 950, y: 600, totalSpots: 537 },
        { name: '林森路平面', campus: '自強校區', campusId: 'tzu-chiang', searchName: '林森路平面機車停車場', x: 1050, y: 500, totalSpots: 56 },
        { name: '成杏平面', campus: '成杏校區', campusId: 'cheng-hsing', searchName: '成杏平面機車停車場', x: 750, y: 150, totalSpots: 351 },
        { name: '生醫卓群地下', campus: '成杏校區', campusId: 'cheng-hsing', searchName: '生醫卓群地下機車停車場', x: 800, y: 50, totalSpots: 461 },
        { name: '社科院平面', campus: '力行校區', campusId: 'li-hsing', searchName: '社科院平面機車停車場', x: 250, y: 150, totalSpots: 398 },
        { name: '生科大樓地下', campus: '力行校區', campusId: 'li-hsing', searchName: '生科大樓地下機車停車場', x: 250, y: 50, totalSpots: 453 }
    ];

    const carLots = [
        { name: '管理學院地下', campus: '光復校區', campusId: 'kuang-fu', searchName: '管理學院地下汽車停車場', x: 450, y: 550, totalSpots: 69 },
        { name: '雲平地下', campus: '光復校區', campusId: 'kuang-fu', searchName: '雲平地下汽車停車場', x: 450, y: 400, totalSpots: 88 },
        { name: '都計系地下', campus: '光復校區', campusId: 'kuang-fu', searchName: '都計系地下汽車停車場', x: 200, y: 250, totalSpots: 35 },
        { name: '修齊大樓地下', campus: '光復校區', campusId: 'kuang-fu', searchName: '修齊大樓地下汽車停車場', x: 400, y: 250, totalSpots: 54 },
        { name: '三系館地下', campus: '成功校區', campusId: 'cheng-kung', searchName: '三系館地下汽車停車場', x: 850, y: 500, totalSpots: 166 },
        { name: '卓群大樓地下', campus: '成功校區', campusId: 'cheng-kung', searchName: '卓群大樓地下汽車停車場', x: 800, y: 300, totalSpots: 97 },
        { name: '圖書館地下', campus: '成功校區', campusId: 'cheng-kung', searchName: '圖書館地下汽車停車場', x: 650, y: 300, totalSpots: 135 },
        { name: '理學大樓地下', campus: '成功校區', campusId: 'cheng-kung', searchName: '理學大樓地下汽車停車場', x: 550, y: 300, totalSpots: 102 },
        { name: '儀設大樓地下', campus: '自強校區', campusId: 'tzu-chiang', searchName: '儀設大樓地下汽車停車場', x: 1050, y: 500, totalSpots: 30 },
        { name: '化工系地下', campus: '自強校區', campusId: 'tzu-chiang', searchName: '化工系地下汽車停車場', x: 950, y: 550, totalSpots: 194 },
        { name: '生醫卓群地下', campus: '成杏校區', campusId: 'cheng-hsing', searchName: '生醫卓群地下汽車停車場', x: 800, y: 50, totalSpots: 144 },
        { name: '成杏校區平面', campus: '成杏校區', campusId: 'cheng-hsing', searchName: '成杏校區平面汽車停車場', x: 750, y: 150, totalSpots: 199 },
        { name: '社科院地下', campus: '力行校區', campusId: 'li-hsing', searchName: '社科院地下汽車停車場', x: 250, y: 150, totalSpots: 67 },
        { name: '生科大樓地下', campus: '力行校區', campusId: 'li-hsing', searchName: '生科大樓地下汽車停車場', x: 250, y: 50, totalSpots: 78 },
        { name: '勝利後門平面', campus: '勝利校區', campusId: 'sheng-li', searchName: '勝利後門平面汽車停車場', x: 650, y: 950, totalSpots: 128 },
        { name: '旺宏館', campus: '勝利校區', campusId: 'sheng-li', searchName: '旺宏館汽車停車場', x: 650, y: 800, totalSpots: 47 }
    ];

    // Initialize
    mapLayout.innerHTML = svgContent;
    renderPlaceholders(); // Render immediately
    fetchParkingData();

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentType = btn.dataset.type;
            renderPlaceholders(); // Reset to placeholders on switch
            fetchParkingData();
        });
    });

    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const icon = refreshBtn.querySelector('i');
            if (icon) {
                icon.classList.add('fa-spin');
                setTimeout(() => icon.classList.remove('fa-spin'), 1000);
            }
            fetchParkingData();
        });
    }

    function renderPlaceholders() {
        const lots = currentType === 'moto' ? motoLots : carLots;
        const placeholderData = lots.map(lot => ({ ...lot, spots: -1 }));
        updateList(placeholderData);
        // Reset map with placeholder data
        updateMap(placeholderData);
    }

    async function fetchParkingData() {
        const url = "https://apss.oga.ncku.edu.tw/park/index.php/park11215/read";

        try {
            const formData = new FormData();
            formData.append('campus', 'all');
            formData.append('tab', currentType);

            const proxyURL = `https://curly-sky-5daa.h34121151.workers.dev/?url=https://apss.oga.ncku.edu.tw/park/index.php/park11215/read`;

            const response = await fetch(proxyURL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const parkDataElements = doc.querySelectorAll('.park-data');

            const lots = currentType === 'moto' ? motoLots : carLots;
            const lotsData = [];
            const campusAggregates = {};

            // Initialize campus aggregates
            lots.forEach(lot => {
                if (!campusAggregates[lot.campusId]) {
                    campusAggregates[lot.campusId] = { total: 0, count: 0 };
                }
            });

            // Parse HTML and map to lots
            parkDataElements.forEach(el => {
                const nameEl = el.querySelector('.mb-2');
                const numberEl = el.querySelector('.number');

                if (nameEl && numberEl) {
                    const fullName = nameEl.textContent.trim();
                    const spots = parseInt(numberEl.textContent.trim(), 10);

                    // Find matching lot
                    const matchedLot = lots.find(l => l.searchName === fullName);
                    if (matchedLot) {
                        lotsData.push({
                            ...matchedLot,
                            spots: isNaN(spots) ? -1 : spots
                        });

                        // Aggregate for map
                        if (!isNaN(spots) && spots !== -1) {
                            if (campusAggregates[matchedLot.campusId]) {
                                campusAggregates[matchedLot.campusId].total += spots;
                                campusAggregates[matchedLot.campusId].count += 1;
                            }
                        }
                    }
                }
            });

            // Sort lotsData to match the order of 'lots' array
            const sortedLotsData = lots.map(lot => {
                const found = lotsData.find(d => d.name === lot.name);
                return found || { ...lot, spots: -1 };
            });

            // Log parking data to console
            const vehicleType = currentType === 'moto' ? '機車' : '汽車';
            console.log(`=== ${vehicleType}停車場資料 ===`);
            sortedLotsData.forEach(lot => {
                const spotsDisplay = lot.spots !== -1 ? lot.spots : '--';
                console.log(`${lot.name}${vehicleType}停車場 ${spotsDisplay}`);
            });
            console.log('========================');

            updateList(sortedLotsData);
            updateMap(sortedLotsData);

        } catch (error) {
            console.warn('Fetch failed (likely CORS), using mock data or showing error:', error);
            // Fallback: show all as unknown
            const lots = currentType === 'moto' ? motoLots : carLots;
            const fallbackData = lots.map(lot => ({ ...lot, spots: -1 }));
            updateList(fallbackData);
            updateMap(fallbackData);
        }
    }

    function updateMap(lotsData) {
        // Remove old markers
        const oldMarkers = mapLayout.querySelectorAll('.parking-marker');
        oldMarkers.forEach(marker => marker.remove());

        // Create markers for each parking lot
        lotsData.forEach(lot => {
            if (!lot.x || !lot.y) return;

            const marker = document.createElement('div');
            marker.className = 'parking-marker';
            marker.dataset.lotName = lot.name; // For referencing

            // Determine status class
            let statusClass = 'unknown';
            if (lot.spots !== -1 && lot.totalSpots) {
                const percentage = (lot.spots / lot.totalSpots) * 100;
                if (percentage < 10) statusClass = 'danger';
                else if (percentage < 30) statusClass = 'warning';
                else statusClass = 'success';
            } else if (lot.spots !== -1) {
                // Fallback if totalSpots missing but spots exist (shouldn't happen with new data)
                if (lot.spots < 10) statusClass = 'danger';
                else if (lot.spots < 30) statusClass = 'warning';
                else statusClass = 'success';
            }
            marker.classList.add(statusClass);

            // Set content
            marker.textContent = lot.spots !== -1 ? lot.spots : '--';

            // Position the marker (convert SVG coordinates to percentage)
            // SVG viewBox is 0 0 1147 1028
            const xPercent = (lot.x / 1147) * 100;
            const yPercent = (lot.y / 1028) * 100;
            marker.style.left = `${xPercent}%`;
            marker.style.top = `${yPercent}%`;
            marker.style.transform = 'translate(-50%, -50%)';

            // Interaction: Map Marker Click
            marker.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent bubbling if needed

                // Find corresponding list item securely using data attribute
                const targetItem = lotList.querySelector(`.list-item[data-lot-name="${lot.name}"]`);

                if (targetItem) {
                    // Scroll to item
                    targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Highlight item
                    targetItem.classList.add('highlight-list-item');
                    setTimeout(() => {
                        targetItem.classList.remove('highlight-list-item');
                    }, 3000);
                }
            });

            mapLayout.appendChild(marker);
        });
    }

    function updateList(data) {
        lotList.innerHTML = '';

        data.forEach(lot => {
            const listItem = document.createElement('div');
            listItem.className = 'list-item';
            listItem.dataset.lotName = lot.name; // Add data attribute for easier lookup

            let statusColor = '#94a3b8'; // Grey for -1
            if (lot.spots !== -1 && lot.totalSpots) {
                const percentage = (lot.spots / lot.totalSpots) * 100;
                if (percentage < 10) statusColor = '#f87171'; // Red
                else if (percentage < 30) statusColor = '#fbbf24'; // Yellow
                else statusColor = '#4ade80'; // Green
            } else if (lot.spots !== -1) {
                if (lot.spots < 10) statusColor = '#f87171';
                else if (lot.spots < 30) statusColor = '#fbbf24';
                else statusColor = '#4ade80';
            }

            const totalDisplay = lot.totalSpots ? `(約${lot.totalSpots}格)` : '';

            listItem.innerHTML = `
                <div>
                    <div class="lot-name" style="font-weight: 500;">${lot.name}</div>
                    <div style="font-size: 0.8rem; color: #94a3b8;">${lot.campus} <span style="font-size: 0.75rem; opacity: 0.8; margin-left: 5px;">${totalDisplay}</span></div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-weight: 700; color: ${statusColor}">${lot.spots !== -1 ? lot.spots : '--'}</span>
                    <div class="status-indicator" style="background-color: ${statusColor}"></div>
                </div>
            `;

            // Interaction: List Item Click
            listItem.addEventListener('click', () => {
                const markers = mapLayout.querySelectorAll('.parking-marker');
                markers.forEach(m => {
                    if (m.dataset.lotName === lot.name) {
                        m.classList.add('highlight-marker');
                        setTimeout(() => {
                            m.classList.remove('highlight-marker');
                        }, 3000);
                    }
                });
            });

            lotList.appendChild(listItem);
        });
    }
});
