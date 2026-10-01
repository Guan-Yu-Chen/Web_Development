document.addEventListener('DOMContentLoaded', () => {
    // Valid Categories
    const CATEGORIES = {
        weather: 'Weather',
        parking: 'Parking',
        calendar: 'Date & Time',
        schedule: 'Schedule',
        photo: 'Photo'
    };

    // --- Configuration Data (From parking.js) ---
    const motoLots = [
        { name: '光復前門地下', campus: '光復校區', id: 'm1', type: 'moto', searchName: '光復前門地下機車停車場', totalSpots: 1454 },
        { name: '管理學院', campus: '光復校區', id: 'm2', type: 'moto', searchName: '管理學院機車停車場', totalSpots: 327 },
        { name: '雲平東側', campus: '光復校區', id: 'm3', type: 'moto', searchName: '雲平東側機車停車場', totalSpots: 479 },
        { name: '都計系地下', campus: '光復校區', id: 'm4', type: 'moto', searchName: '都計系地下機車停車場', totalSpots: 298 },
        { name: '修齊大樓地下', campus: '光復校區', id: 'm5', type: 'moto', searchName: '修齊大樓地下機車停車場', totalSpots: 441 },
        { name: '三系館地下', campus: '成功校區', id: 'm6', type: 'moto', searchName: '三系館地下機車停車場', totalSpots: 680 },
        { name: '理學大樓地下', campus: '成功校區', id: 'm7', type: 'moto', searchName: '理學大樓地下機車停車場', totalSpots: 745 },
        { name: '成功前門地下', campus: '成功校區', id: 'm8', type: 'moto', searchName: '成功前門地下機車停車場', totalSpots: 663 },
        { name: '新園平面', campus: '成功校區', id: 'm9', type: 'moto', searchName: '新園平面機車停車場', totalSpots: 114 },
        { name: '土木系平面', campus: '成功校區', id: 'm10', type: 'moto', searchName: '土木系平面機車停車場', totalSpots: 204 },
        { name: '奇美樓地下', campus: '自強校區', id: 'm11', type: 'moto', searchName: '奇美樓地下機車停車場', totalSpots: 537 },
        { name: '林森路平面', campus: '自強校區', id: 'm12', type: 'moto', searchName: '林森路平面機車停車場', totalSpots: 56 },
        { name: '成杏平面', campus: '成杏校區', id: 'm13', type: 'moto', searchName: '成杏平面機車停車場', totalSpots: 351 },
        { name: '生醫卓群地下', campus: '成杏校區', id: 'm14', type: 'moto', searchName: '生醫卓群地下機車停車場', totalSpots: 461 },
        { name: '社科院平面', campus: '力行校區', id: 'm15', type: 'moto', searchName: '社科院平面機車停車場', totalSpots: 398 },
        { name: '生科大樓地下', campus: '力行校區', id: 'm16', type: 'moto', searchName: '生科大樓地下機車停車場', totalSpots: 453 }
    ];

    const carLots = [
        { name: '管理學院地下', campus: '光復校區', id: 'c1', type: 'car', searchName: '管理學院地下汽車停車場', totalSpots: 69 },
        { name: '雲平地下', campus: '光復校區', id: 'c2', type: 'car', searchName: '雲平地下汽車停車場', totalSpots: 88 },
        { name: '都計系地下', campus: '光復校區', id: 'c3', type: 'car', searchName: '都計系地下汽車停車場', totalSpots: 35 },
        { name: '修齊大樓地下', campus: '光復校區', id: 'c4', type: 'car', searchName: '修齊大樓地下汽車停車場', totalSpots: 54 },
        { name: '三系館地下', campus: '成功校區', id: 'c5', type: 'car', searchName: '三系館地下汽車停車場', totalSpots: 166 },
        { name: '卓群大樓地下', campus: '成功校區', id: 'c6', type: 'car', searchName: '卓群大樓地下汽車停車場', totalSpots: 97 },
        { name: '圖書館地下', campus: '成功校區', id: 'c7', type: 'car', searchName: '圖書館地下汽車停車場', totalSpots: 135 },
        { name: '理學大樓地下', campus: '成功校區', id: 'c8', type: 'car', searchName: '理學大樓地下汽車停車場', totalSpots: 102 },
        { name: '儀設大樓地下', campus: '自強校區', id: 'c9', type: 'car', searchName: '儀設大樓地下汽車停車場', totalSpots: 30 },
        { name: '化工系地下', campus: '自強校區', id: 'c10', type: 'car', searchName: '化工系地下汽車停車場', totalSpots: 194 },
        { name: '生醫卓群地下', campus: '成杏校區', id: 'c11', type: 'car', searchName: '生醫卓群地下汽車停車場', totalSpots: 144 },
        { name: '成杏校區平面', campus: '成杏校區', id: 'c12', type: 'car', searchName: '成杏校區平面汽車停車場', totalSpots: 199 },
        { name: '社科院地下', campus: '力行校區', id: 'c13', type: 'car', searchName: '社科院地下汽車停車場', totalSpots: 67 },
        { name: '生科大樓地下', campus: '力行校區', id: 'c14', type: 'car', searchName: '生科大樓地下汽車停車場', totalSpots: 78 },
        { name: '勝利後門平面', campus: '勝利校區', id: 'c15', type: 'car', searchName: '勝利後門平面汽車停車場', totalSpots: 128 },
        { name: '旺宏館', campus: '勝利校區', id: 'c16', type: 'car', searchName: '旺宏館汽車停車場', totalSpots: 47 }
    ];

    // State
    let currentCategory = 'calendar';
    let isToolboxCollapsed = false;
    let gridState = new Array(24).fill(null);
    const GRID_COLS = 6;
    const GRID_ROWS = 4;
    let draggedItem = null;

    // Live Data Cache
    let parkingDataCache = {};
    let weatherDataCache = null;
    let weatherWidgetCache = { current: null, hourly: [] }; // New cache for widgets

    // DOM Elements
    const toolboxPanel = document.getElementById('toolbox-panel');
    const toggleBtn = document.getElementById('toggle-toolbox-btn');
    const canvasArea = document.getElementById('canvas-area');
    const widgetList = document.getElementById('widget-list');
    const toolboxTitle = document.getElementById('toolbox-title');
    const catBtns = document.querySelectorAll('.cat-btn');
    const gridOverlay = document.getElementById('grid-overlay');
    const widgetsLayer = document.getElementById('widgets-layer');
    const trashZone = document.getElementById('trash-zone');

    initClock();
    initToolbox();
    initGrid();
    loadCategoryItems('calendar');
    initTrashZone();

    // Fetch Data
    fetchParkingData();
    loadWeatherDataForWidgets(); // Ensure this is also called safely (it was async and independent)

    // Load layout or Initialize Grid
    loadLayout();

    // --- Grid Logic ---
    function initGrid() {
        gridOverlay.innerHTML = '';
        for (let i = 0; i < GRID_COLS * GRID_ROWS; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.index = i;

            // Drag Events
            cell.addEventListener('dragover', handleDragOver);
            cell.addEventListener('dragleave', handleDragLeave);
            cell.addEventListener('drop', handleDrop);

            gridOverlay.appendChild(cell);
        }

        // Also add drag events to the overlay itself to catch events when hovering over widgets
        gridOverlay.addEventListener('dragover', handleDragOver);
        gridOverlay.addEventListener('drop', handleDrop);
    }

    // --- Trash Zone Logic ---
    function initTrashZone() {
        trashZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            trashZone.classList.add('drag-over');
        });

        trashZone.addEventListener('dragleave', () => {
            trashZone.classList.remove('drag-over');
        });

        trashZone.addEventListener('drop', (e) => {
            e.preventDefault();
            trashZone.classList.remove('drag-over');

            if (!draggedItem) return;

            // If widget is from grid, remove it
            if (draggedItem.sourceIndex !== null) {
                removeWidgetFromGrid(draggedItem.sourceIndex);
            }

            clearHighlights();
            draggedItem = null;
        });
    }

    // --- Drag and Drop ---
    function handleDragStart(e) {
        const sourceIndex = e.currentTarget.classList.contains('grid-widget') ? parseInt(e.currentTarget.dataset.index) : null;
        const w = parseInt(e.currentTarget.dataset.w);
        const h = parseInt(e.currentTarget.dataset.h);

        // Pre-calculate all cells occupied by this widget
        let occupiedCells = [];
        if (sourceIndex !== null) {
            const x = sourceIndex % GRID_COLS;
            const y = Math.floor(sourceIndex / GRID_COLS);
            for (let row = 0; row < h; row++) {
                for (let col = 0; col < w; col++) {
                    occupiedCells.push((y + row) * GRID_COLS + (x + col));
                }
            }
        }

        draggedItem = {
            type: e.currentTarget.dataset.type,
            w: w,
            h: h,
            data: e.currentTarget.dataset.widgetData ? JSON.parse(e.currentTarget.dataset.widgetData) : {},
            sourceIndex: sourceIndex,
            occupiedCells: occupiedCells
        };
        e.dataTransfer.setData('text/plain', JSON.stringify(draggedItem));
        e.dataTransfer.effectAllowed = 'copyMove';

        // Add dragging class to hide element from mouse events so it doesn't block drop zones
        const element = e.currentTarget;
        setTimeout(() => {
            if (element) element.classList.add('dragging');
        }, 0);
    }

    function handleDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';

        if (!draggedItem) return;

        // Always calculate from mouse position for consistency
        const rect = gridOverlay.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cellWidth = rect.width / GRID_COLS;
        const cellHeight = rect.height / GRID_ROWS;
        const col = Math.floor(x / cellWidth);
        const row = Math.floor(y / cellHeight);
        const targetIndex = row * GRID_COLS + col;

        if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) {
            clearHighlights();
            return;
        }

        const index = row * GRID_COLS + col;
        const isValid = isValidPosition(index, draggedItem.w, draggedItem.h, draggedItem.occupiedCells);

        // Highlight area
        highlightArea(index, draggedItem.w, draggedItem.h, isValid);
    }

    function handleDragLeave(e) {
        // Clear highlights handled by dragover updates or global clear?
        // simple hack: if leaving grid, clear.
        // But dragleave fires when entering child. 
    }

    function handleDrop(e) {
        e.preventDefault();
        clearHighlights();

        if (!draggedItem) return;

        // Always calculate from mouse position for consistency
        const rect = gridOverlay.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cellWidth = rect.width / GRID_COLS;
        const cellHeight = rect.height / GRID_ROWS;
        const col = Math.floor(x / cellWidth);
        const row = Math.floor(y / cellHeight);

        if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) {
            draggedItem = null;
            return;
        }

        const index = row * GRID_COLS + col;
        const w = draggedItem.w;
        const h = draggedItem.h;
        const type = draggedItem.type;
        const data = draggedItem.data;

        if (isValidPosition(index, w, h, draggedItem.occupiedCells)) {
            // Remove from old pos if move
            if (draggedItem.sourceIndex !== null) {
                removeWidgetFromGrid(draggedItem.sourceIndex);
            }
            addWidgetToGrid(index, w, h, type, data);
            saveLayout(); // Save after drop
        }
        draggedItem = null;
    }

    function isValidPosition(index, w, h, ignoreCells = []) {
        const x = index % GRID_COLS;
        const y = Math.floor(index / GRID_COLS);

        // Check if widget would go out of bounds
        if (x + w > GRID_COLS || y + h > GRID_ROWS) return false;

        // Check each cell the widget would occupy
        for (let row = 0; row < h; row++) {
            for (let col = 0; col < w; col++) {
                const checkIndex = (y + row) * GRID_COLS + (x + col);

                // Skip if this cell is part of the dragged widget's original position
                if (ignoreCells.includes(checkIndex)) continue;

                // Check if cell is occupied by another widget
                if (gridState[checkIndex] !== null) {
                    return false;
                }
            }
        }
        return true;
    }

    function highlightArea(index, w, h, isValid) {
        // Clear all first
        clearHighlights();
        const x = index % GRID_COLS;
        const y = Math.floor(index / GRID_COLS);

        const highlightedCells = [];
        for (let row = 0; row < h; row++) {
            for (let col = 0; col < w; col++) {
                if (x + col >= GRID_COLS || y + row >= GRID_ROWS) continue;
                const i = (y + row) * GRID_COLS + (x + col);
                highlightedCells.push(i);
                // Query the grid-cell by its data-index instead of using children array
                const cell = gridOverlay.querySelector(`.grid-cell[data-index="${i}"]`);

                // Debug: verify we found the right cell
                if (cell) {
                    const actualIndex = cell.dataset.index;
                    console.log(`Looking for cell ${i}, found cell with data-index="${actualIndex}"`);

                    if (isValid) {
                        cell.classList.add('active-drag');
                        cell.style.backgroundColor = 'rgba(56, 189, 248, 0.2)';
                    } else {
                        cell.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                    }
                }
            }
        }
    }

    function clearHighlights() {
        // Only clear highlights from grid cells, not widgets
        gridOverlay.querySelectorAll('.grid-cell').forEach(cell => {
            cell.classList.remove('active-drag');
            cell.style.backgroundColor = '';
        });
    }

    // Refactored Helper to place widget and update state
    function addWidgetToGrid(index, w, h, type, data) {
        // Update State
        const x = index % GRID_COLS;
        const y = Math.floor(index / GRID_COLS);

        for (let row = 0; row < h; row++) {
            for (let col = 0; col < w; col++) {
                const i = (y + row) * GRID_COLS + (x + col);
                gridState[i] = index; // Mark occupied by widget at 'index'
            }
        }

        renderWidgetElement(index, w, h, type, data);
    }

    function removeWidgetFromGrid(index) {
        // If gridState has the START index of the widget at this cell
        const startIndex = gridState[index];
        if (startIndex === null || startIndex === undefined) return;

        // Find the element with that start index in the widgets layer
        const el = widgetsLayer.querySelector(`.grid-widget[data-index="${startIndex}"]`);
        if (el) {
            removeWidgetElement(el);
        }
    }

    function removeWidgetElement(el) {
        const index = parseInt(el.dataset.index);
        const w = parseInt(el.dataset.w);
        const h = parseInt(el.dataset.h);

        // Clear State
        const x = index % GRID_COLS;
        const y = Math.floor(index / GRID_COLS);
        for (let row = 0; row < h; row++) {
            for (let col = 0; col < w; col++) {
                const i = (y + row) * GRID_COLS + (x + col);
                gridState[i] = null;
            }
        }
        el.remove();
        saveLayout(); // Save after remove
    }

    function renderWidgetElement(index, w, h, type, data) {
        const x = index % GRID_COLS;
        const y = Math.floor(index / GRID_COLS);

        const el = document.createElement('div');
        el.className = 'grid-widget';
        el.dataset.index = index;
        el.dataset.type = type;
        el.dataset.w = w;
        el.dataset.h = h;
        el.dataset.widgetData = JSON.stringify(data);
        el.draggable = true;

        // Position
        el.style.gridColumnStart = x + 1;
        el.style.gridColumnEnd = `span ${w}`;
        el.style.gridRowStart = y + 1;
        el.style.gridRowEnd = `span ${h}`;

        // Content
        el.innerHTML = getWidgetHTML(type, data, w, h);

        // Delete button removed - use trash zone instead

        el.addEventListener('dragstart', handleDragStart);
        el.addEventListener('dragend', handleDragEnd);

        widgetsLayer.appendChild(el); // Append to widgets layer, not grid overlay
    }

    // --- Toolbox Logic ---
    function initToolbox() {
        toggleBtn.addEventListener('click', () => {
            isToolboxCollapsed = !isToolboxCollapsed;
            toolboxPanel.classList.toggle('collapsed', isToolboxCollapsed);
            canvasArea.classList.toggle('centered', isToolboxCollapsed);
        });

        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                catBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const cat = btn.dataset.cat;
                currentCategory = cat;
                toolboxTitle.innerText = CATEGORIES[cat];
                loadCategoryItems(cat);
            });
        });
    }

    // --- Widget Content Generators (Same as before) ---
    // Global cache moved to top

    function getWidgetHTML(type, data, w, h) {
        // WEATHER
        if (type === 'weather') {
            if (!weatherDataCache) {
                return `<div class="widget-content"><i class="fa-solid fa-spinner fa-spin"></i></div>`;
            }
            const current = weatherDataCache.current || {};
            const iconClass = getWeatherIcon(current.wx, current.time);
            if (w === 1 && h === 1) {
                return `
                    <div class="widget-content" style="display:flex; flex-direction:column; align-items:center;">
                        <i class="fa-solid ${iconClass}" style="font-size: 2rem; margin-bottom: 5px;"></i>
                        <div style="font-size: 1.2rem; font-weight:700;">${current.temp ?? '--'}°</div>
                    </div>`;
            } else if (w === 2 && h === 1) {
                return `
                    <div class="widget-content" style="display:flex; align-items:center; justify-content:space-around; width:100%;">
                        <i class="fa-solid ${iconClass}" style="font-size: 2.5rem;"></i>
                        <div style="text-align:left;">
                            <div style="font-size: 1.5rem; font-weight:700;">${current.temp ?? '--'}°C</div>
                            <div style="font-size: 0.8rem; opacity:0.8;"><i class="fa-solid fa-umbrella"></i> ${current.pop ?? 0}%</div>
                        </div>
                    </div>`;
            }
            return `
                <div class="widget-content" style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%;">
                     <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                        <i class="fa-solid ${iconClass}" style="font-size: 2rem;"></i>
                        <div style="font-size: 1.5rem; font-weight:700;">${current.temp ?? '--'}°C</div>
                     </div>
                     <div style="font-size:0.8rem; opacity:0.7;">Forecast Available in App</div>
                </div>`;
        }

        // PARKING
        if (type === 'parking') {
            const spots = parkingDataCache[data.searchName] ?? (data.spots ?? '--');
            const total = data.totalSpots || 0;
            let color = '#94a3b8';
            let iconColor = '#cbd5e1';
            if (spots !== '--' && total > 0) {
                const pct = (spots / total) * 100;
                if (pct < 10) { color = '#f87171'; iconColor = '#f87171'; }
                else if (pct < 30) { color = '#fbbf24'; iconColor = '#fbbf24'; }
                else { color = '#4ade80'; iconColor = '#4ade80'; }
            }
            const icon = data.type === 'car' ? 'fa-car' : 'fa-motorcycle';
            return `
                <div class="widget-content" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding: 5px;">
                    <div style="font-size: 0.8rem; font-weight:600; margin-bottom:5px; line-height:1.2; word-break: break-all;">${data.name}</div>
                    <div style="display:flex; align-items:center; gap:8px;">
                         <i class="fa-solid ${icon}" style="font-size:1rem; color:${iconColor}"></i>
                         <span style="font-size: 1.4rem; font-weight:700; color:${color}">${spots}</span>
                    </div>
                </div>`;
        }

        if (type === 'clock') {
            return `<div class="widget-content" style="font-size:1.5rem; font-weight:700;">${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>`;
        }

        // --- New Date & Time Widgets ---

        if (type === 'analog-clock') {
            // Generate 12 markers
            let markers = '';
            for (let i = 0; i < 12; i++) {
                const rotation = i * 30;
                markers += `<div class="marker" style="transform: translateX(-50%) rotate(${rotation}deg); transform-origin: 50% 666.6%;"></div>`;
                // Note: The CSS transform-origin logic might need adjustment.
                // Simplified approach: Absolute position based on sine/cosine or just rotation.
                // Re-using CSS approach: 
                // .marker { top: 10px; height: 10px; transform-origin: center 60px; } - this depends on size.

                // Let's rely on updateClock for dynamic generation if needed, or static here.
                // Using a simpler DOM structure and CSS rotation.
                // Actually the CSS I wrote: `transform-origin: 50% 500%;` assumes the marker is at the top edge.
                // Let's stick to the generated HTML.
            }

            return `
                <div class="analog-clock">
                    ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg =>
                `<div class="marker" style="transform: translateX(-50%) rotate(${deg}deg); transform-origin: 50% 666.6%;"></div>`
                // Hardcoding origin distance based on ~150px widget size assumption? 
                // Actually widget size is responsive. Better to use % relative to container.
                // Correct CSS approach:
                // .marker { top: 5%; height: 10%; transform-origin: 50% (50% - 5% + 50%); } -> transform-origin: 50% 450%
                // Let's explicitly set the origin in the style tag for safety or rely on CSS class if fixed.
            ).join('')}
                    <div class="hand hour" id="hour-hand"></div>
                    <div class="hand minute" id="minute-hand"></div>
                    <div class="center-dot"></div>
                </div>`;
        }

        if (type === 'digital-stacked') {
            const now = new Date();
            let h = now.getHours();
            const m = now.getMinutes().toString().padStart(2, '0');
            const ampm = h >= 12 ? 'pm' : 'am';
            h = h % 12;
            h = h ? h : 12; // the hour '0' should be '12'
            const hStr = h.toString().padStart(2, '0');
            return `
                <div class="digital-stacked">
                    <div class="hour-num">${hStr}</div>
                    <div class="minute-num">${m}</div>
                    <div class="ampm">${ampm}</div>
                </div>`;
        }

        if (type === 'calendar-month') {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const today = now.getDate();

            const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            let gridHTML = '';
            // Empty slots
            for (let i = 0; i < firstDay; i++) {
                gridHTML += `<div class="cal-day empty"></div>`;
            }
            // Days
            for (let d = 1; d <= daysInMonth; d++) {
                const isToday = d === today ? 'today' : '';
                gridHTML += `<div class="cal-day ${isToday}">${d}</div>`;
            }

            return `
                <div class="calendar-month">
                    <div class="cal-header-row">
                        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                    </div>
                    <div class="cal-grid">
                        ${gridHTML}
                    </div>
                </div>`;
        }

        if (type === 'date-big') {
            const now = new Date();
            const day = now.getDate();
            const month = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const weekday = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
            return `
                <div class="date-big">
                    <span class="month-label">${month}</span>
                    <span class="display-day">${day}</span>
                    <span class="weekday-label">${weekday}</span>
                </div>`;
        }

        if (type === 'schedule-upcoming') {
            const eventsStr = localStorage.getItem('events');
            let events = eventsStr ? JSON.parse(eventsStr) : [];
            const now = new Date();

            // Filter future events
            // Event date is "YYYY-MM-DD", time is "HH:MM"
            const upcoming = events.filter(e => {
                const startDateTime = new Date(`${e.date}T${e.start}`);
                return startDateTime > now;
            }).sort((a, b) => {
                return new Date(`${a.date}T${a.start}`) - new Date(`${b.date}T${b.start}`);
            }).slice(0, 3);

            if (upcoming.length === 0) {
                return `<div class="widget-content" style="font-size:0.8rem; opacity:0.7;">No upcoming events</div>`;
            }

            const listHTML = upcoming.map(e => `
                <div style="background-color:${e.color}; color:white; padding:2px 5px; border-radius:3px; margin-bottom:2px; font-size:0.75rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${e.name}
                </div>
            `).join('');

            const nowStr = `${now.getMonth() + 1}/${now.getDate()}`;

            return `
                <div class="widget-content" style="display:flex; flex-direction:column; justify-content:flex-start; width:100%; height:100%; padding:5px;">
                    <div style="font-size:0.7rem; font-weight:bold; margin-bottom:5px; opacity:0.8;">UPCOMING ${nowStr}</div>
                    ${listHTML}
                </div>`;
        }

        if (type === 'schedule-daily') {
            const eventsStr = localStorage.getItem('events');
            let events = eventsStr ? JSON.parse(eventsStr) : [];
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            const todayEvents = events.filter(e => e.date === todayStr).sort((a, b) => a.start.localeCompare(b.start));
            const tomorrowEvents = events.filter(e => e.date === tomorrowStr).sort((a, b) => a.start.localeCompare(b.start));

            const todayDateStr = `${now.getMonth() + 1}/${now.getDate()}`;
            const tomorrowDateStr = `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}`;

            const renderEventRow = (e) => `
                <div style="display:flex; align-items:center; margin-bottom:4px; font-size:0.8rem;">
                    <div style="background-color:${e.color}; width:4px; height:100%; min-height:12px; border-radius:2px; margin-right:5px;"></div>
                    <span style="font-weight:bold; margin-right:5px; font-size:0.75rem;">${e.start}</span>
                    <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; opacity:0.9;">${e.name}</span>
                </div>
            `;

            return `
                <div class="widget-content schedule-daily-content" style="display:flex; flex-direction:column; width:100%; height:100%; padding:10px; overflow-y:auto; align-items:start;">
                    <div style="font-size:0.9rem; font-weight:bold; margin-bottom:5px; color:var(--text-primary);">Today ${todayDateStr}</div>
                    <div style="width:100%; margin-bottom:10px;">
                        ${todayEvents.length ? todayEvents.map(renderEventRow).join('') : '<div style="opacity:0.5; font-size:0.8rem;">No events</div>'}
                    </div>
                    
                    <div style="width:100%; height:1px; background-color:var(--border-color); margin-bottom:10px;"></div>
                    
                    <div style="font-size:0.9rem; font-weight:bold; margin-bottom:5px; color:var(--text-primary);">Tomorrow ${tomorrowDateStr}</div>
                    <div style="width:100%;">
                        ${tomorrowEvents.length ? tomorrowEvents.map(renderEventRow).join('') : '<div style="opacity:0.5; font-size:0.8rem;">No events</div>'}
                    </div>
                </div>`;
        }

        if (type === 'photo') {
            if (data.imageSrc) {
                return `<div class="photo-widget"><img src="${data.imageSrc}" class="photo-content"></div>`;
            } else {
                return `<div class="photo-widget">
                            <div class="photo-upload-btn" onclick="triggerPhotoUpload(this)" onmousedown="event.stopPropagation()">+</div>
                        </div>`;
            }
        }

        if (type === 'weather-current') {
            const current = weatherWidgetCache.current;
            const temp = current ? `${current.temp}°C` : '--°C';
            const pop = current ? `${current.pop}%` : '--%';
            const iconClass = current ? getWeatherIconClass(current.wx, current.time) : 'fa-sun';
            let iconColor = '#94a3b8';
            if (current) {
                if (iconClass.includes('sun')) iconColor = '#fbbf24';
                else if (iconClass.includes('rain')) iconColor = '#60a5fa';
            }

            return `
                <div class="weather-current-widget">
                    <div class="wx-left">
                        <i class="fa-solid fa-temperature-quarter temp-icon"></i>
                        <span class="temp-val">${temp}</span>
                    </div>
                    <div class="wx-right">
                        <i class="fa-solid ${iconClass} wx-icon" style="color:${iconColor}"></i>
                        <div class="pop-row">
                             <i class="fa-solid fa-umbrella"></i>
                             <span class="pop-val">${pop}</span>
                        </div>
                    </div>
                </div>`;
        }

        if (type === 'weather-chart') {
            // Can't easily pre-render SVG string here without duplicating logic or making it global.
            // We'll leave it as Loading... and trust the fast update loop.
            const hourlyData = weatherWidgetCache.hourly;
            if (hourlyData && hourlyData.length > 0) {
                // Render with placeholder dimensions, will be updated by updateWeatherWidgets
                return `<div class="weather-chart-widget" style="width:100%; height:100%; position:relative;">${generateMiniChartSVG(hourlyData, 200, 100)}</div>`;
            }
            return `<div class="weather-chart-widget" style="width:100%; height:100%; position:relative;">Loading...</div>`;
        }

        return `
            <div class="widget-content" style="display:flex; flex-direction:column; align-items:center;">
                 <i class="fa-solid ${getIconForType(type)}"></i>
                 <span>${type}</span>
            </div>`;
    }

    function getIconForType(type) {
        if (type === 'calendar') return 'fa-calendar';
        if (type === 'schedule') return 'fa-calendar-days';
        if (type === 'photo') return 'fa-image';
        return 'fa-box';
    }

    // --- Interaction Logic ---
    window.triggerPhotoUpload = function (btn) {
        // Create invisible input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (evt) {
                const base64 = evt.target.result;
                // Find parent widget
                const widgetEl = btn.closest('.grid-widget');
                if (widgetEl) {
                    // Update data
                    const currentData = JSON.parse(widgetEl.dataset.widgetData || '{}');
                    currentData.imageSrc = base64;
                    widgetEl.dataset.widgetData = JSON.stringify(currentData);

                    // Re-render
                    const w = parseInt(widgetEl.dataset.w);
                    const h = parseInt(widgetEl.dataset.h);
                    const type = widgetEl.dataset.type;
                    widgetEl.innerHTML = getWidgetHTML(type, currentData, w, h);

                    // Save
                    saveLayout();
                }
            };
            reader.readAsDataURL(file);
        };

        input.click();
    };

    // --- Loading Categories ---
    async function loadCategoryItems(category) {
        widgetList.innerHTML = '';
        let itemsHTML = '';

        switch (category) {
            case 'parking':
                if (Object.keys(parkingDataCache).length === 0) {
                    fetchParkingData().then(() => {
                        if (currentCategory === 'parking') loadCategoryItems('parking');
                    });
                }
                itemsHTML += `<div style="grid-column: span 2; font-size:0.9rem; opacity:0.7; margin-top:10px;">Motorcycle</div>`;
                itemsHTML += motoLots.map(lot => createToolboxWidgetHTML('parking', 1, 1, lot, lot.name)).join('');
                itemsHTML += `<div style="grid-column: span 2; font-size:0.9rem; opacity:0.7; margin-top:10px;">Car</div>`;
                itemsHTML += carLots.map(lot => createToolboxWidgetHTML('parking', 1, 1, lot, lot.name)).join('');
                break;
            case 'weather':
                itemsHTML += createToolboxWidgetHTML('weather-current', 1, 1, {}, 'Current');
                itemsHTML += createToolboxWidgetHTML('weather-chart', 3, 2, {}, '24h Forecast');
                break;
            case 'calendar':
                // Date & Time Widgets
                itemsHTML += createToolboxWidgetHTML('analog-clock', 1, 1, {}, 'Analog Clock');
                itemsHTML += createToolboxWidgetHTML('digital-stacked', 1, 1, {}, 'Digital (Stacked)');
                itemsHTML += createToolboxWidgetHTML('calendar-month', 1, 1, {}, 'Month View');
                itemsHTML += createToolboxWidgetHTML('date-big', 1, 1, {}, 'Big Date');
                break;
            case 'photo':
                itemsHTML += createToolboxWidgetHTML('photo', 1, 1, {}, 'Photo 1x1');
                itemsHTML += createToolboxWidgetHTML('photo', 2, 2, {}, 'Photo 2x2');
                itemsHTML += createToolboxWidgetHTML('photo', 3, 2, {}, 'Photo 3x2');
                break;
            case 'schedule':
                itemsHTML += createToolboxWidgetHTML('schedule-upcoming', 1, 1, {}, 'Upcoming');
                itemsHTML += createToolboxWidgetHTML('schedule-daily', 2, 2, {}, 'Daily Lists');
                break;
            default:
                itemsHTML += createToolboxWidgetHTML(category, 1, 1, {}, category);
                itemsHTML += createToolboxWidgetHTML(category, 2, 1, {}, category + ' Wide');
                itemsHTML += createToolboxWidgetHTML(category, 2, 2, {}, category + ' Large');
                break;
        }
        widgetList.innerHTML = itemsHTML;
        const newItems = widgetList.querySelectorAll('.toolbox-widget');
        newItems.forEach(item => {
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragend', handleDragEnd);
        });
    }

    function createToolboxWidgetHTML(type, w, h, data, label) {
        const dataStr = JSON.stringify(data).replace(/"/g, '&quot;');
        let inner = '';
        let extraClass = '';

        // For new date/time and schedule widgets, show actual preview instead of icon
        if (type === 'analog-clock' || type === 'digital-stacked' || type === 'calendar-month' || type === 'date-big' || type.startsWith('schedule-')) {
            // Generate the actual widget HTML as preview
            inner = getWidgetHTML(type, data, w, h);
            extraClass = 'large-preview';
        } else if (type.startsWith('weather-')) {
            // New weather widgets are also complex/visual
            inner = getWidgetHTML(type, data, w, h);
            if (type === 'weather-chart') extraClass = 'large-preview'; // Chart needs height
        } else if (type === 'parking') {
            const spots = parkingDataCache[data.searchName];
            let color = '#94a3b8';
            if (spots !== undefined) {
                const total = data.totalSpots || 100;
                const pct = (spots / total) * 100;
                if (pct < 10) color = '#f87171';
                else if (pct < 30) color = '#fbbf24';
                else color = '#4ade80';
            }
            inner = `
                <i class="fa-solid ${data.type === 'car' ? 'fa-car' : 'fa-motorcycle'}" style="color:${color}; font-size:1.2rem; margin-bottom:5px;"></i>
                <span style="font-size:0.8rem; text-align:center;">${label}</span>`;
        } else {
            inner = `
                <i class="fa-solid ${getIconForType(type)}" style="font-size:1.5rem; color:var(--text-secondary); margin-bottom:5px;"></i>
                <span style="font-size:0.8rem; text-align:center;">${label}</span>
                <span style="font-size:0.6rem; opacity:0.5;">${w}x${h}</span>`;
        }
        return `
            <div class="toolbox-widget ${extraClass}" draggable="true" 
                 data-type="${type}" data-w="${w}" data-h="${h}" data-widget-data="${dataStr}">
                <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%;">${inner}</div>
            </div>`;
    }

    async function fetchParkingData() {
        try {
            const proxyURL = `https://curly-sky-5daa.h34121151.workers.dev/?url=https://apss.oga.ncku.edu.tw/park/index.php/park11215/read`;
            const [motoRes, carRes] = await Promise.all([
                fetch(proxyURL, { method: 'POST', body: createFormData('moto') }),
                fetch(proxyURL, { method: 'POST', body: createFormData('car') })
            ]);
            const motoText = await motoRes.text();
            const carText = await carRes.text();
            parseParkingHTML(motoText);
            parseParkingHTML(carText);
        } catch (e) {
            console.warn("Parking fetch failed", e);
        }
    }

    function createFormData(type) {
        const fd = new FormData();
        fd.append('campus', 'all');
        fd.append('tab', type);
        return fd;
    }

    function parseParkingHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const items = doc.querySelectorAll('.park-data');
        items.forEach(el => {
            const nameEl = el.querySelector('.mb-2');
            const numEl = el.querySelector('.number');
            if (nameEl && numEl) {
                const name = nameEl.textContent.trim();
                const spots = parseInt(numEl.textContent.trim(), 10);
                if (!isNaN(spots)) parkingDataCache[name] = spots;
            }
        });
        updateParkingWidgets(); // Update grid widgets with new data
    }

    function updateParkingWidgets() {
        // Find all parking widgets on grid
        const widgets = document.querySelectorAll('.grid-widget[data-type="parking"]');
        widgets.forEach(w => {
            const data = JSON.parse(w.dataset.widgetData);
            const width = parseInt(w.dataset.w);
            const height = parseInt(w.dataset.h);
            w.innerHTML = getWidgetHTML('parking', data, width, height);
        });
    }

    async function fetchWeatherData() {
        try {
            const res = await fetch("https://weather.h34121151.workers.dev/");
            if (!res.ok) throw new Error('Weather fetch failed');
            const data = await res.json();
            const currentItem = (data.today || []).find(d => true);
            if (currentItem) {
                weatherDataCache = {
                    current: {
                        temp: Math.ceil((Number(currentItem.minT) + Number(currentItem.maxT)) / 2),
                        wx: currentItem.Wx,
                        pop: currentItem.PoP,
                        time: currentItem.time
                    },
                    today: data.today,
                    week: data.week
                };
            }
        } catch (e) { console.warn("Weather fetch failed", e); }
    }

    function getWeatherIcon(wx, timeString) {
        if (!wx) return 'fa-sun';
        if (wx.includes('雨')) return 'fa-cloud-showers-heavy';
        if (wx.includes('陰')) return 'fa-cloud';
        if (wx.includes('雲')) return 'fa-cloud-sun';
        return 'fa-sun';
    }

    function initClock() {
        const clk = document.getElementById('clock');
        if (!clk) return;
        setInterval(() => {
            const now = new Date();

            // 1. Existing simple clock
            clk.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            document.querySelectorAll('.grid-widget[data-type="clock"] .widget-content').forEach(el => {
                el.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            });

            // 2. Analog Clock
            const seconds = now.getSeconds();
            const minutes = now.getMinutes();
            const hours = now.getHours();

            const minDeg = ((minutes / 60) * 360) + ((seconds / 60) * 6);
            const hourDeg = ((hours / 12) * 360) + ((minutes / 60) * 30);

            document.querySelectorAll('.analog-clock').forEach(el => {
                const hourHand = el.querySelector('.hand.hour');
                const minHand = el.querySelector('.hand.minute');
                if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
                if (minHand) minHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
            });

            // 3. Digital Stacked
            let h = hours % 12;
            h = h ? h : 12;
            const hStr = h.toString().padStart(2, '0');
            const mStr = minutes.toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'pm' : 'am';

            document.querySelectorAll('.digital-stacked').forEach(el => {
                el.querySelector('.hour-num').textContent = hStr;
                el.querySelector('.minute-num').textContent = mStr;
                el.querySelector('.ampm').textContent = ampm;
            });

            // 4. Update Date Widgets (Big Date & Calendar) - Optional: Update only if day changes
            // For simplicity, we can just check if date text needs update or re-render.
            // Since date changes rarely, we can optimize or just leave it since getWidgetHTML uses 'new Date()' on creation.
            // But for long-running pages, we should update the DOM.

            document.querySelectorAll('.date-big').forEach(el => {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const days = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
                el.querySelector('.display-day').textContent = now.getDate();
                el.querySelector('.month-label').textContent = months[now.getMonth()];
                el.querySelector('.weekday-label').textContent = days[now.getDay()];
            });

            // Calendar Month: highlighting 'today'
            // This is trickier to update without fully re-rendering. 
            // We can just find the .cal-day with textContent == now.getDate() and ensure it has 'today' class.
            document.querySelectorAll('.calendar-month').forEach(el => {
                const todayNum = now.getDate();
                el.querySelectorAll('.cal-day').forEach(day => {
                    if (day.textContent == todayNum) day.classList.add('today');
                    else day.classList.remove('today');
                });
            });

        }, 1000);

        // Add a secondary frequent loop to ensure dropped widgets get populated fast
        setInterval(() => {
            if (weatherWidgetCache.current) {
                updateWeatherWidgets(weatherWidgetCache.current, weatherWidgetCache.hourly);
            }
        }, 2000);
    }

    // --- Persistence Logic ---

    function saveLayout() {
        const widgets = [];
        document.querySelectorAll('.grid-widget').forEach(el => {
            widgets.push({
                index: parseInt(el.dataset.index),
                type: el.dataset.type,
                w: parseInt(el.dataset.w),
                h: parseInt(el.dataset.h),
                data: JSON.parse(el.dataset.widgetData || '{}')
            });
        });
        localStorage.setItem('personal_dashboard_layout', JSON.stringify(widgets));
    }

    function loadLayout() {
        const saved = localStorage.getItem('personal_dashboard_layout');
        if (saved) {
            try {
                const widgets = JSON.parse(saved);
                // Clear existing state just in case (though on load it's empty)
                gridState.fill(null);
                widgetsLayer.innerHTML = '';

                widgets.forEach(w => {
                    // Re-validate bounds just in case grid changed size? 
                    // Assume saved data is valid for now.
                    addWidgetToGrid(w.index, w.w, w.h, w.type, w.data);
                });
            } catch (e) {
                console.error("Failed to load layout", e);
            }
        }
    }

    // --- Weather Data Logic for Personal Dashboard ---

    async function loadWeatherDataForWidgets() {
        try {
            const res = await fetch("https://weather.h34121151.workers.dev/");
            if (!res.ok) throw new Error('Weather fetch failed');
            const data = await res.json();

            // Calculate Current
            const current = calculateWidgetCurrent(data.today || []);
            weatherWidgetCache = { current: current, hourly: data.today || [] }; // Update Cache
            updateWeatherWidgets(current, data.today || []);

        } catch (e) {
            console.error("Widget Weather Error:", e);
        }
    }

    function calculateWidgetCurrent(hourlyData) {
        if (!hourlyData || hourlyData.length === 0) return null;
        const now = new Date();
        const parseTime = (dStr, tStr) => new Date(`${dStr}T${tStr}:00`).getTime();

        // Find current slot logic (simplified from weather.js)
        let found = null;
        for (let i = 0; i < hourlyData.length - 1; i++) {
            const curr = hourlyData[i];
            const next = hourlyData[i + 1];
            const t1 = parseTime(curr.date, curr.time);
            const t2 = parseTime(next.date, next.time);
            if (now.getTime() >= t1 && now.getTime() < t2) {
                found = curr;
                break;
            }
        }
        if (!found) found = hourlyData[0];

        return {
            temp: Math.round((Number(found.minT) + Number(found.maxT)) / 2),
            wx: found.Wx,
            pop: found.PoP,
            time: found.time
        };
    }

    function getWeatherIconClass(wx, timeString) {
        if (!timeString) return 'fa-sun';
        let hour = 12;
        if (timeString.includes(':')) hour = parseInt(timeString.split(':')[0], 10);
        const isNight = hour >= 18 || hour < 6;
        const wxStr = wx || "";
        if (wxStr.includes('雨')) return 'fa-cloud-showers-heavy';
        if (wxStr.includes('雲') && wxStr.includes('晴')) return isNight ? 'fa-cloud-moon' : 'fa-cloud-sun';
        if (wxStr.includes('雲')) return 'fa-cloud';
        if (wxStr.includes('晴')) return isNight ? 'fa-moon' : 'fa-sun';
        return isNight ? 'fa-moon' : 'fa-sun';
    }

    function updateWeatherWidgets(current, hourlyData) {
        // Update 1x1 Current Weather Widgets
        document.querySelectorAll('.weather-current-widget').forEach(el => {
            if (current) {
                el.querySelector('.temp-val').textContent = `${current.temp}°C`;
                el.querySelector('.pop-val').textContent = `${current.pop}%`;

                const iconClass = getWeatherIconClass(current.wx, current.time);
                const iconEl = el.querySelector('.wx-icon');
                iconEl.className = `wx-icon fa-solid ${iconClass}`;

                // Color logic
                if (iconClass.includes('sun')) iconEl.style.color = '#fbbf24';
                else if (iconClass.includes('rain')) iconEl.style.color = '#60a5fa';
                else iconEl.style.color = '#94a3b8';
            }
        });

        // Update 2x3 Chart Widgets
        document.querySelectorAll('.weather-chart-widget').forEach(el => {
            el.innerHTML = generateMiniChartSVG(hourlyData, el.clientWidth, el.clientHeight);
        });
    }

    function generateMiniChartSVG(hourlyData, w, h) {
        if (!hourlyData || hourlyData.length === 0) return 'No Data';
        // Simpler chart mainly
        const padding = { top: 15, bottom: 20, left: 25, right: 25 }; // Increased side padding
        const chartH = h - padding.top - padding.bottom;
        const chartW = w - padding.left - padding.right;

        const points = hourlyData.map(d => ({
            temp: Math.ceil((Number(d.minT) + Number(d.maxT)) / 2),
            time: d.time,
            pop: d.PoP,
            wx: d.Wx
        }));

        const validTemps = points.map(p => p.temp).filter(t => !isNaN(t));
        if (validTemps.length === 0) return 'No Data';
        const minT = Math.min(...validTemps) - 1;
        const maxT = Math.max(...validTemps) + 1;

        const getX = (i) => padding.left + (i / (points.length - 1)) * chartW;
        const getY = (t) => padding.top + chartH - ((t - minT) / (maxT - minT)) * chartH;

        let path = '';
        points.forEach((p, i) => {
            const x = getX(i);
            const y = getY(p.temp);
            if (i === 0) path += `M ${x} ${y}`;
            else {
                const preX = getX(i - 1);
                const preY = getY(points[i - 1].temp);
                const cp1x = preX + (x - preX) * 0.4;
                const cp2x = x - (x - preX) * 0.4;
                path += ` C ${cp1x} ${preY}, ${cp2x} ${y}, ${x} ${y}`;
            }
        });

        let svgContent = `<path d="${path}" fill="none" stroke="#38bdf8" stroke-width="2" />`;

        // Adaptive sampling for labels
        // If we have <= 8 points, show all. If > 8 (e.g. 24), show every 3rd.
        let step = 1;
        if (points.length > 12) step = 3;

        points.forEach((p, i) => {
            if (i % step !== 0 && i !== points.length - 1) return; // Ensure last point is shown if possible? Or strictly by step.
            const x = getX(i);
            const y = getY(p.temp);

            svgContent += `<circle cx="${x}" cy="${y}" r="3" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>`;
            svgContent += `<text x="${x}" y="${y - 10}" fill="white" font-size="14" font-weight="600" text-anchor="middle">${p.temp}°</text>`; // Temp larger

            const icon = getWeatherIconClass(p.wx, p.time);
            let iconColor = '#94a3b8';
            if (icon.includes('sun')) iconColor = '#fbbf24';
            else if (icon.includes('rain')) iconColor = '#60a5fa';

            // Larger Icon
            svgContent += `<foreignObject x="${x - 9}" y="${y + 6}" width="18" height="18"><div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;justify-content:center;"><i class="fa-solid ${icon}" style="font-size:16px; color:${iconColor}"></i></div></foreignObject>`;

            // Time label HH:MM
            svgContent += `<text x="${x}" y="${h - 5}" fill="#94a3b8" font-size="10" text-anchor="middle">${p.time}</text>`;
        });

        return `<svg width="100%" height="100%">${svgContent}</svg>`;
    }

    // Initial fetch
    loadWeatherDataForWidgets();
    setInterval(loadWeatherDataForWidgets, 600000); // 10 min loop

});
