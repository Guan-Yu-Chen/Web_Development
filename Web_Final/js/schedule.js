//event position level
let doing_event_number = [];
//clear all event bar
function doing_event_number_ini() {
    //alert('ini!');
    for (let i = 0; i < 7; i++) {
        doing_event_number.push([]);
        for (let j = 0; j < 24; j++) {
            doing_event_number[i].push([0, 0]);
            //doing_event_number[i][j]+=[i+','+j];
        }
    }
}
let event_start = [];
function event_start_ini() {
    for (let i = 0; i < 7; i++) {
        event_start.push([]);
        for (let j = 0; j < 24; j++) {
            event_start[i].push([]);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const calendarBody = document.getElementById('calendar-body');
    const timeColumn = calendarBody.querySelector('.time-column');
    const modal = document.getElementById('event-modal');
    const openModalBtn = document.getElementById('open-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const eventForm = document.getElementById('event-form');
    const colorPicker = document.getElementById('color-picker');

    let selectedColor = '#38bdf8';
    let selectedColor_detail;
    let fixing_event = 0;
    let if_detail_sideboard_open = false;

    // 自動儲存相關變數
    let autoSaveTimer = null;
    let isDataChanged = false;
    const AUTO_SAVE_DELAY = 2000; // 2秒後自動儲存
    // Removed DEFAULT_CSV_FILE

    // File System Access API Handle
    let fileHandle = null;

    function timeSlotForm() {
        for (let i = 0; i < 24; i++) {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.id = "time-slot-" + i;
            slot.dataset.time = i;
            slot.textContent = `${String(i).padStart(2, '0')}:00`;
            slot.addEventListener('click', function (e) {
                e.target.style.height = (e.target.style.height == "60px" ? "20px" : "60px");
                //ini();
                //renderEvents();
                for (let j = 0; j < 7; j++) {
                    let same_time = document.getElementById("day-column-" + j + '-hr-' + e.target.dataset.time);
                    //console.log(document.getElementById("day-column-"+i+'-hr-'+ e.target.dataset.time));
                    same_time.style.height = e.target.style.height;//e....已有px字尾
                    same_time.style.top = e.target.offsetTop;
                    for (let k = (e.target.dataset.time > 0 ? e.target.dataset.time : 1); k < 24; k++) {
                        document.getElementById("day-column-" + j + '-hr-' + k).style.top = (document.getElementById("day-column-" + j + '-hr-' + (k - 1)).offsetHeight + document.getElementById("day-column-" + j + '-hr-' + (k - 1)).offsetTop) + 'px';
                    }
                    //console.log(e.target.style.height);
                }
                ini();
                //timeForm();
                renderEvents();
            })
            timeColumn.appendChild(slot);
        }
    }

    timeSlotForm();

    // Day columns
    const dayColumns = [];
    for (let i = 0; i < 7; i++) {
        const col = document.createElement('div');
        col.className = 'day-column';
        col.id = "day-column-" + i;
        col.dataset.day = i;
        col.style.position = 'relative';
        document.getElementById("day" + i).getBoundingClientRect().width;

        calendarBody.appendChild(col);

        for (let j = 0; j < 24; j++) {
            let subcol = document.createElement('div');
            subcol.className = 'day-column-hr';
            subcol.id = 'day-column-' + i + '-hr-' + j;
            subcol.style.position = 'absolute';
            //subcol.style.zIndex=2;
            subcol.style.width = document.getElementById("day" + i).offsetWidth + 'px';
            //subcol.style.height = document.getElementById('time-slot-'+j).getBoundingClientRect.height + 'px';
            subcol.style.top = (document.getElementById('time-slot-' + j).offsetTop) + 'px';
            //console.log(subcol.style.height);
            col.appendChild(subcol);
        }
    }

    function timeForm() {
        Array.from(document.getElementsByClassName('day-column')).forEach((dc, i) => {
            dc.innerHTML = [];
        })
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 24; j++) {
                let subcol = document.createElement('div');
                subcol.className = 'day-column-hr';
                subcol.id = 'day-column-' + i + '-hr-' + j;
                subcol.style.position = 'absolute';
                //subcol.style.zIndex=9;
                //subcol.style.backgroundColor = 'white';
                subcol.style.width = document.getElementById("day" + i).getBoundingClientRect().width + 'px';
                subcol.style.height = document.getElementById('time-slot-' + j).offsetHeight + 'px';
                subcol.style.top = (document.getElementById('time-slot-' + j).offsetTop) + 'px';
                document.getElementById('day-column-' + i).appendChild(subcol);
            }
        }
    }
    //timeForm();

    // Load Events
    let events = JSON.parse(localStorage.getItem('events')) || [];

    // 初始化自動儲存
    initAutoSave();

    async function loadInitialData() {
        try {
            console.log('正在從預設變數載入事件數據...');

            // Check for embedded variable first
            let csvText = '';
            if (typeof DEFAULT_EVENTS_CSV_CONTENT !== 'undefined') {
                csvText = DEFAULT_EVENTS_CSV_CONTENT;
                console.log('使用內嵌 CSV 數據');
            } else {
                // Fallback to fetch if variable missing (unlikely if script loaded)
                try {
                    const response = await fetch(DEFAULT_CSV_FILE);
                    if (response.ok) {
                        csvText = await response.text();
                    }
                } catch (e) {
                    console.warn('Fetch failed, using local storage.');
                }
            }

            if (!csvText) {
                console.warn(`無法載入預設CSV`);
                // 使用本地儲存的數據
                const localEvents = localStorage.getItem('events');
                if (localEvents && JSON.parse(localEvents).length > 0) {
                    showNotification('使用本地儲存的數據', 'info');
                }
                return;
            }

            // const csvText = await response.text(); // Removed
            console.log('成功載入預設數據，內容長度:', csvText.length);


            // 解析 CSV 數據
            const newEvents = parseCSV(csvText);

            // 處理事件數據格式
            const processedEvents = newEvents.map(event => {
                // 確保事件有所有必要字段
                return {
                    id: event.id || Date.now() + Math.random(),
                    name: event.name || '未命名事件',
                    date: event.date || new Date().toISOString().split('T')[0],
                    start: event.start || '09:00',
                    end: event.end || '10:00',
                    note: event.note || '',
                    color: event.color || '#38bdf8'
                };
            });

            // 如果成功解析到事件
            if (processedEvents.length > 0) {
                events = processedEvents;
                saveToLocalStorage(); // 保存到 localStorage

                console.log(`成功從預設CSV載入 ${processedEvents.length} 個事件`);
                showNotification(`已從預設檔案載入 ${processedEvents.length} 個事件`, 'success');

                // 重新渲染日曆
                renderEvents();
            } else {
                console.warn('預設CSV檔案中沒有有效的事件數據');
            }

            /* Fetch removed to prevent CORS errors on local file system */
        } catch (error) {
            console.error('Initial load failed:', error);
        }
    }

    function renderEvents() {
        let alive_event = document.getElementsByClassName('event-item');
        let alive_event_array = Array.from(alive_event);
        alive_event_array.forEach(ae => {
            ae.remove();
        });
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 24; j++) {
                //document.getElementById('day-column-'+i+'-hr-'+j).innerHTML = "";
            }
        }

        // 初始化事件位置計數器
        doing_event_number_ini();
        event_start_ini();

        // sort by start time
        events.sort((a, b) => {
            const aStart = parseInt(a.start.split(':')[0]) * 60 + parseInt(a.start.split(':')[1]);
            const bStart = parseInt(b.start.split(':')[0]) * 60 + parseInt(b.start.split(':')[1]);
            //console.log(aStart+','+bStart+','+(aStart - bStart))
            return aStart - bStart;
        });

        // 為每個事件計算位置和寬度
        const dayEvents = {};
        events.forEach((event, index) => {
            let eventdate = new Date(event.date);
            const day = eventdate.getDay();
            if (!dayEvents[day]) dayEvents[day] = [];
            dayEvents[day].push(event);
        });

        // 為每一天的事件計算重疊和位置
        for (const day in dayEvents) {
            const eventsInDay = dayEvents[day];
            const col = document.getElementById('day-column-' + day);
            if (!col) continue;

            // 計算每個事件的位置
            const eventPositions = [];
            eventsInDay.forEach((event, index) => {

                // Fix: Manual Date Parsing to ensure Local Time (ignoring UTC offsets)
                const ymd = event.date.split('-'); // "2025-12-09"
                const eventdate = new Date(parseInt(ymd[0]), parseInt(ymd[1]) - 1, parseInt(ymd[2]));

                // Compare timestamps (Local 00:00 vs Local 00:00)
                const weekStartLimit = new Date(this_week_Start);
                weekStartLimit.setHours(0, 0, 0, 0);
                const weekEndLimit = new Date(this_week_Last);
                weekEndLimit.setHours(23, 59, 59, 999);

                if (eventdate < weekStartLimit || eventdate > weekEndLimit) {
                    // console.log(`Event ${event.name} out of range: ${event.date}`);
                    // console.log(`Range: ${weekStartLimit.toDateString()} - ${weekEndLimit.toDateString()}`);
                    return;
                }

                // Debug Log
                console.log(`Rendering Event: ${event.name} on ${event.date}`);

                const startParts = event.start.split(':');
                const endParts = event.end.split(':');
                const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
                const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
                const duration = endMinutes - startMinutes;

                if (duration <= 0) return;

                // 計算重疊
                let position = 0;
                let maxOverlap = 1;

                // 找到適合的列位置
                while (true) {
                    let overlap = false;

                    for (const posEvent of eventPositions) {
                        if (posEvent.position === position) {
                            // 檢查時間是否重疊
                            const posStart = parseInt(posEvent.event.start.split(':')[0]) * 60 + parseInt(posEvent.event.start.split(':')[1]);
                            const posEnd = parseInt(posEvent.event.end.split(':')[0]) * 60 + parseInt(posEvent.event.end.split(':')[1]);

                            if (!(endMinutes <= posStart || startMinutes >= posEnd)) {
                                overlap = true;
                                break;
                            }
                        }
                    }

                    if (!overlap) break;
                    position++;
                    if (position > maxOverlap) maxOverlap = position;
                }

                eventPositions.push({
                    event: event,
                    position: position,
                    maxOverlap: maxOverlap + 1
                });

                // 重新計算所有事件的最大重疊數
                eventPositions.forEach(ep => {
                    // Check overlaps against ALL other events in this day to find max density
                    // Simple shared maxOverlap for the group approach
                    let groupMax = 1;
                    eventPositions.forEach(other => {
                        const currentStart = parseInt(other.event.start.split(':')[0]) * 60 + parseInt(other.event.start.split(':')[1]);
                        const currentEnd = parseInt(other.event.end.split(':')[0]) * 60 + parseInt(other.event.end.split(':')[1]);
                        const epStart = parseInt(ep.event.start.split(':')[0]) * 60 + parseInt(ep.event.start.split(':')[1]);
                        const epEnd = parseInt(ep.event.end.split(':')[0]) * 60 + parseInt(ep.event.end.split(':')[1]);

                        // If they overlap
                        if (!(currentEnd <= epStart || currentStart >= epEnd)) {
                            // Assuming simple column packing, we might just track the max position seen so far?
                            // Logic here was trying to update *previous* events too.
                            if (other.position + 1 > groupMax) groupMax = other.position + 1;
                        }
                    });
                    ep.maxOverlap = groupMax;
                });
            });

            // 渲染事件
            eventPositions.forEach(ep => {
                const event = ep.event;
                const position = ep.position;
                const maxOverlap = ep.maxOverlap; // Not strictly used for width calc below, but used for logic?

                // Fix: Date parsing for day column lookup
                const ymd = event.date.split('-');
                const eventdate = new Date(parseInt(ymd[0]), parseInt(ymd[1]) - 1, parseInt(ymd[2]));

                const startParts = event.start.split(':');
                const endParts = event.end.split(':');
                const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
                const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

                let el = document.createElement('div');
                el.className = 'event-item';
                el.id = 'event-item-' + event.id;
                el.style.position = 'absolute';
                el.style.zIndex = 50 + position; // Stack based on position

                let start_slot = Math.floor(startMinutes / 60);
                let esh = document.getElementById('time-slot-' + start_slot);
                let start_moment = startMinutes % 60;

                // Safety check for invalid times
                if (!esh) return;

                el.style.marginTop = ((start_moment) / 60) * esh.offsetHeight + `px`;
                el.style.top = esh.offsetTop + 'px';

                let end_slot = Math.floor(endMinutes / 60);
                let eeh = document.getElementById('time-slot-' + end_slot);
                // Handle end time 24:00 or overflow (though end_slot 24 doesn't exist, time-slot-23 is last)
                if (!eeh) {
                    eeh = document.getElementById('time-slot-23');
                    // Treat as end of day
                }

                let end_moment = endMinutes % 60;
                el.style.marginBottom = ((60 - end_moment) / 60) * eeh.offsetHeight + `px`;

                // Calculate Height
                // Note: Logic relying on offsets might be fragile if layout changes, but keeping for now.
                // Assuming slots are stacked.
                let height = (endMinutes - startMinutes) * (esh.offsetHeight / 60);
                el.style.height = height + 'px';

                // 根據重疊數計算寬度和左邊距
                const columnWidth = document.getElementById('day-column-' + eventdate.getDay()).offsetWidth;

                // Dynamic Width Calculation based on overlap
                // If we have overlaps, share the width.
                // Position 0..N.
                // Width = 100% / maxOverlap?
                // Original logic used 10% fixed width? (columnWidth / 10)
                // Let's make it responsive to overlaps.

                // REVERTED to match original logic but fixed:
                const eventWidth = columnWidth / 10; // Keeping original sizing style preference
                // But we must offset correctly
                el.style.width = (columnWidth - (eventWidth * position)) + 'px';
                el.style.left = (position * eventWidth) + 'px';

                el.style.backgroundColor = `${event.color}33`;
                el.style.borderLeftColor = event.color;

                let el_bar = document.createElement('div');
                el_bar.style.width = (eventWidth / 3) + 'px';
                el_bar.style.height = (height - 10) + 'px'; // Simplified height
                el_bar.style.left = (eventWidth / 3) + 'px';
                el_bar.style.top = '5px';
                el_bar.id = 'ebi' + event.id;
                el_bar.style.float = 'left';
                el_bar.style.position = 'absolute';
                el_bar.style.zIndex = 100;
                el_bar.style.backgroundColor = event.color;

                let el_bar_ball_up = document.createElement('div');
                el_bar_ball_up.style.width = (eventWidth / 3) + 'px';
                el_bar_ball_up.id = 'ebbu' + event.id;
                el_bar_ball_up.style.height = (eventWidth / 3) + 'px';
                el_bar_ball_up.style.borderRadius = '100%';
                el_bar_ball_up.style.top = '-' + (eventWidth / 6) + 'px';
                el_bar_ball_up.style.position = 'absolute';
                el_bar_ball_up.style.backgroundColor = event.color;
                el_bar.appendChild(el_bar_ball_up);

                let el_bar_ball_down = document.createElement('div');
                el_bar_ball_down.style.width = (eventWidth / 3) + 'px';
                el_bar_ball_down.id = 'ebbd' + event.id;
                el_bar_ball_down.style.height = (eventWidth / 3) + 'px';
                el_bar_ball_down.style.borderRadius = '100%';
                el_bar_ball_down.style.bottom = '-' + (eventWidth / 6) + 'px'; // Fix positioning
                el_bar_ball_down.style.position = 'absolute';
                el_bar_ball_down.style.backgroundColor = event.color;
                el_bar.appendChild(el_bar_ball_down);

                // Event on click
                el.addEventListener('click', () => {
                    document.getElementById('event-detail-id').classList.add('active');
                    let eventIndex = events.findIndex(e => e.id === event.id);
                    let edited_event = events[eventIndex];
                    document.getElementById('event-name-detail').value = edited_event.name;
                    document.getElementById('event-day-detail').value = edited_event.date;
                    document.getElementById('event-start-detail').value = edited_event.start;
                    document.getElementById('event-end-detail').value = edited_event.end;
                    document.getElementById('event-note-detail').value = edited_event.note;
                    document.getElementById('color-picker-detail').querySelectorAll('.color-option-detail').forEach(o => o.classList.remove('selected'));
                    Array.from(document.getElementsByClassName('color-option-detail')).forEach((color, i) => {
                        if (color.dataset.color === edited_event.color) {
                            color.classList.add('selected');
                            selectedColor_detail = edited_event.color;
                        }
                    })
                    fixing_event = eventIndex;
                    if_detail_sideboard_open = true;
                });

                document.getElementById('day-column-' + eventdate.getDay()).appendChild(el);
                document.getElementById('event-item-' + event.id).appendChild(el_bar);
                //document.getElementById('ebi'+event.id)
                document.getElementById('event-item-' + event.id).innerHTML += (`<strong id='sid${event.id}' class = 'event_title'>${event.name}</strong>`);
                let E_T = document.getElementById('sid' + event.id);
                E_T.style.color = event.color;
                E_T.style.position = 'absolute';
                E_T.style.left = (columnWidth / 10) + 'px';
                E_T.style.top = (height / 100 + (eventWidth / 3)) + 'px';
            });
        }
    }

    //button for detail
    document.getElementById('event-detail-sideform').addEventListener('submit', (e) => {
        e.preventDefault();

        const newEvent = {
            id: events[fixing_event].id,
            name: document.getElementById('event-name-detail').value,
            date: (document.getElementById('event-day-detail').value),
            start: document.getElementById('event-start-detail').value,
            end: document.getElementById('event-end-detail').value,
            note: document.getElementById('event-note-detail').value,
            color: selectedColor_detail
        };

        events[fixing_event] = newEvent;
        saveEvents();
        renderEvents();

    });
    //cancel, delete button for detail
    document.getElementById('close-detail').addEventListener('click', () => {
        document.getElementById('event-detail-id').classList.remove('active');
    });
    document.getElementById('delete-detail').addEventListener('click', () => {
        if (confirm("sure to delete event?")) {
            //let eventList = Array.from(events);
            events.splice(fixing_event, 1);
            saveEvents();
            renderEvents();
        }
    });

    // 標記數據已變更並安排自動儲存
    function markDataChanged() {
        isDataChanged = true;
        scheduleAutoSave();
    }

    // 安排自動儲存
    function scheduleAutoSave() {
        if (autoSaveTimer) {
            clearTimeout(autoSaveTimer);
        }
        autoSaveTimer = setTimeout(() => {
            if (isDataChanged) {
                saveToServer();
            }
        }, AUTO_SAVE_DELAY);
    }

    // 初始化自動儲存
    function initAutoSave() {
        // 監聽頁面卸載事件
        window.addEventListener('beforeunload', () => {
            if (isDataChanged) {
                // 同步保存到伺服器
                saveToServerSync();
            }
        });
    }

    // 同步保存到伺服器（用於頁面卸載時）
    function saveToServerSync() {
        // Disabled for pure JS version
        console.log('Local only mode: skipped sync save to server.');
    }

    // 保存事件（含自動儲存）
    function saveEvents() {
        saveToLocalStorage();
        markDataChanged(); // 標記數據已變更
    }

    // 保存到 localStorage
    function saveToLocalStorage() {
        localStorage.setItem('events', JSON.stringify(events));
        localStorage.setItem('events_last_saved', new Date().toISOString());
    }

    // 保存到伺服器（非同步）
    // 保存到伺服器（非同步）
    async function saveToServer() {
        // Local only mode
        console.log('Local only mode: Data saved to localStorage.');
        isDataChanged = false;
        showAutoSaveNotification();
        /* PHP Fetch removed
        try {
           ...
        } catch (error) { ... }
        */
    }

    // 顯示自動儲存通知
    function showAutoSaveNotification() {
        const notification = document.getElementById('auto-save-notification');
        if (notification) {
            notification.textContent = `已自動儲存 (${new Date().toLocaleTimeString()})`;
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2000);
        }
    }

    //another colorpicker
    document.getElementById('color-picker-detail').querySelectorAll('.color-option-detail').forEach(opt => {
        opt.addEventListener('click', () => {
            document.getElementById('color-picker-detail').querySelectorAll('.color-option-detail').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedColor_detail = opt.dataset.color;
        });
    });

    // Modal Logic
    openModalBtn.addEventListener('click', () => {
        modal.classList.add('active');
        colorPicker.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));

    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Color Picker
    colorPicker.querySelectorAll('.color-option').forEach(opt => {
        opt.addEventListener('click', () => {
            colorPicker.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedColor = opt.dataset.color;
        });
    });

    // Form Submit
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newEvent = {
            id: Date.now(),
            name: document.getElementById('event-name').value,
            date: (document.getElementById('event-day').value),
            start: document.getElementById('event-start').value,
            end: document.getElementById('event-end').value,
            note: document.getElementById('event-note').value,
            color: selectedColor
        };

        events.push(newEvent);
        saveEvents();
        modal.classList.remove('active');
        eventForm.reset();
        renderEvents();
    });

    //added functions
    let today = new Date();
    let daylist = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let this_week_Start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    let this_week_Last = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay()));
    //initial day
    function ini() {
        this_week_Start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        this_week_Last = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
        for (let i = 0; i < 7; i++) {
            let that_day = new Date(this_week_Start.getFullYear(), this_week_Start.getMonth(), this_week_Start.getDate() + i);
            document.getElementById("day" + i).innerText = (that_day.getMonth() + 1) + "/" + that_day.getDate() + "\n" + daylist[i];
        }

        document.getElementById("title-w").innerText = (this_week_Start.getMonth() + 1) + "/" + this_week_Start.getDate() + " - " + (this_week_Last.getMonth() + 1) + "/" + this_week_Last.getDate();
        document.getElementById("event-day").value = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + (today.getDate() >= 10 ? today.getDate() : "0" + today.getDate());

        //timeForm();
        renderEvents();
    }
    ini();
    // --- File System Access API Logic ---
    async function openLocalJSON() {
        try {
            // Check support
            if (!window.showOpenFilePicker) {
                alert('您的瀏覽器不支援 File System Access API (請使用 Chrome/Edge)。');
                return;
            }

            [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'JSON Files',
                    accept: { 'application/json': ['.json'] }
                }],
                multiple: false
            });

            const file = await fileHandle.getFile();
            const text = await file.text();

            try {
                const data = JSON.parse(text);
                if (Array.isArray(data)) {
                    events = data;
                    saveToLocalStorage();
                    renderEvents();
                    showNotification(`已開啟: ${file.name}`, 'success');
                    document.getElementById('save-json-btn').style.display = 'inline-flex';
                    document.getElementById('open-json-btn').classList.remove('btn-primary');
                    document.getElementById('open-json-btn').classList.add('btn-secondary');
                } else {
                    alert('JSON 格式錯誤：必須是陣列 (Array)');
                }
            } catch (e) {
                alert('解析 JSON 失敗: ' + e.message);
            }

        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('開啟檔案失敗:', err);
                alert('開啟檔案失敗');
            }
        }
    }

    async function saveToLocalFile() {
        if (!fileHandle) return;
        try {
            const writable = await fileHandle.createWritable();
            await writable.write(JSON.stringify(events, null, 2)); // Pretty print
            await writable.close();
            console.log('File saved locally via API');
        } catch (err) {
            console.error('寫入檔案失敗:', err);
            showNotification('寫入檔案失敗 (可能無權限)', 'error');
        }
    }

    addControlButtons();
    loadInitialData(); // Rename call
    //week change
    document.getElementById("btn-lw").addEventListener('click', WeekBack);
    function WeekBack() {
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        ini();
    }

    document.getElementById("btn-nw").addEventListener('click', WeekUpon)
    function WeekUpon() {
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
        ini();
    }

    function addControlButtons() {
        // File System API Buttons
        const openBtn = document.getElementById('open-json-btn');
        if (openBtn) openBtn.addEventListener('click', openLocalJSON);

        const saveJsonBtn = document.getElementById('save-json-btn');
        if (saveJsonBtn) saveJsonBtn.addEventListener('click', async () => {
            await saveToLocalFile(); // Manual save
            showNotification('已儲存變更到檔案', 'success');
        });

        // JSON Backup Download
        const downloadBtn = document.getElementById('download-json-backup-btn');
        if (downloadBtn) downloadBtn.addEventListener('click', downloadJSONBackup);

        // Reset Data
        const resetBtn = document.getElementById('reset-data-btn');
        if (resetBtn) resetBtn.addEventListener('click', resetLocalData);
    }

    // --- 下載 JSON 備份 ---
    function downloadJSONBackup() {
        const jsonStr = JSON.stringify(events, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `events_backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 手動保存
    async function manualSave() {
        try {
            await saveToServer();
            showNotification('數據已手動保存到伺服器！', 'success');
        } catch (error) {
            console.error('手動保存失敗:', error);
            showNotification('手動保存失敗', 'error');
        }
    }

    /* CSV Parser Functions Removed */



    // --- 清除本地數據 ---
    function resetLocalData() {
        if (!confirm('確定要清除所有本地儲存的餐廳數據嗎？此操作無法恢復！')) {
            return;
        }

        localStorage.removeItem('events');
        events = [];
        isDataChanged = false;

        renderEvents();
        showNotification('所有數據已清除！', 'info');
    }

    // --- 顯示通知 ---
    function showNotification(message, type = 'info') {
        // 移除現有通知
        const existing = document.getElementById('data-notification');
        if (existing) existing.remove();

        // 創建新通知
        const notification = document.createElement('div');
        notification.id = 'data-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: fadeInOut 3s ease-in-out;
            background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        `;

        // 添加動畫樣式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                10% { opacity: 1; transform: translateY(0); }
                90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(notification);

        // 3秒後移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // 創建自動儲存通知元素
    function createAutoSaveNotification() {
        const notification = document.createElement('div');
        notification.id = 'auto-save-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 8px 16px;
            background-color: #10b981;
            color: white;
            border-radius: 4px;
            font-size: 12px;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s, transform 0.3s;
            z-index: 999;
        `;

        document.body.appendChild(notification);

        // 添加 CSS 類
        const style = document.createElement('style');
        style.textContent = `
            #auto-save-notification.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    // 在初始化時創建自動儲存通知
    createAutoSaveNotification();
});