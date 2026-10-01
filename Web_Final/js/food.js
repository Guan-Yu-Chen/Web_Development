let is_edit = false;

document.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements
    const form = document.getElementById('restaurant-form');
    const listContainer = document.getElementById('restaurant-list');
    //const searchInput = document.getElementById('search-input');
    const searchInputTag = document.getElementById('search-input-tag');
    const searchInputName = document.getElementById('search-input-name');
    const pickBtn = document.getElementById('pick-btn');
    const pickerTag = document.getElementById('picker-tag');
    const pickerResult = document.getElementById('picker-result');
    const memoArea = document.getElementById('memo-area');
    const resetFormBtn = document.getElementById('reset-form');
    const formTitle = document.getElementById('form-title');

    // State
    let restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
    let memo = localStorage.getItem('foodMemo') || '';

    // 自動儲存相關變數
    let autoSaveTimer = null;
    let isDataChanged = false;
    const AUTO_SAVE_DELAY = 2000; // 2秒後自動儲存

    // Removed DEFAULT_CSV_FILE

    // File System Access API Handle
    let fileHandle = null;

    async function loadInitialData() {
        console.log('Loading initial data...');
        const localData = localStorage.getItem('restaurants');
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                // Check if it's the old format (just array) or new format (object)
                if (Array.isArray(parsed)) {
                    restaurants = parsed;
                } else if (parsed.restaurants && Array.isArray(parsed.restaurants)) {
                    restaurants = parsed.restaurants;
                    memo = parsed.memo || '';
                    memoArea.value = memo;
                }
                console.log('Loaded from localStorage');
            } catch (e) { console.error('LocalStorage parse error', e); }
        }
    }

    // --- 初始化函數 ---
    async function init() {
        console.log('初始化應用程式...');
        // 加載備忘錄
        memoArea.value = memo;
        // 添加控制按鈕（下載/上傳）
        addControlButtons();
        // 載入數據
        await loadInitialData();
        // 渲染列表
        renderList();
        console.log('初始化完成，餐廳數量:', restaurants.length);
    }

    // --- 添加控制按鈕（下載/上傳）---
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

    initAutoSave();

    async function loadInitialData() {
        console.log('Loading initial data...');
        // Only load from localStorage. No default fetch to avoid CORS/complexity.
        const localData = localStorage.getItem('restaurants');
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    restaurants = parsed;
                    console.log('Loaded from localStorage');
                }
            } catch (e) { console.error('LocalStorage parse error', e); }
        }

        renderList();
    }

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
        console.log('Local only mode: skipped sync save.');
    }

    // 保存事件（含自動儲存）
    function saveEvents() {
        saveToLocalStorage();
        markDataChanged(); // 標記數據已變更
    }

    // 保存到 localStorage
    function saveToLocalStorage() {
        localStorage.setItem('restaurants', JSON.stringify(restaurants));
        localStorage.setItem('restaurants_last_saved', new Date().toISOString());
    }

    // 保存到伺服器（非同步）
    async function saveToServer() {
        // Local only mode
        console.log('Local only mode: Data saved to localStorage.');
        isDataChanged = false;
        showAutoSaveNotification();
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

    // --- 下載 JSON 備份 ---
    function downloadJSONBackup() {
        const data = {
            memo: memo,
            restaurants: restaurants
        };
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `restaurants_backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // --- File System Access API Logic ---
    async function openLocalJSON() {
        try {
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
                // Expected format: { memo: "...", restaurants: [...] }
                if (data.restaurants && Array.isArray(data.restaurants)) {
                    restaurants = data.restaurants;
                    memo = data.memo || '';
                    saveData(); // Save to local storage
                    renderList();
                    showNotification(`已開啟: ${file.name}`, 'success');
                    document.getElementById('save-json-btn').style.display = 'inline-flex';
                    document.getElementById('open-json-btn').classList.remove('btn-primary');
                    document.getElementById('open-json-btn').classList.add('btn-secondary');
                } else {
                    alert('JSON 格式錯誤：找不到 restaurants 陣列');
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
            const data = {
                memo: memo,
                restaurants: restaurants
            };
            await writable.write(JSON.stringify(data, null, 2));
            await writable.close();
            console.log('File saved locally via API');
        } catch (err) {
            console.error('寫入檔案失敗:', err);
            showNotification('寫入檔案失敗 (可能無權限)', 'error');
        }
    }

    // --- 清除本地數據 ---
    function resetLocalData() {
        if (!confirm('確定要清除所有本地儲存的餐廳數據嗎？此操作無法恢復！')) {
            return;
        }

        localStorage.removeItem('restaurants');
        localStorage.removeItem('foodMemo');
        restaurants = [];
        memo = '';

        renderList();
    }

    // --- 數據保存函數（保存到 localStorage）---
    function saveData() {
        try {
            localStorage.setItem('restaurants', JSON.stringify(restaurants));
            console.log(memo);
            localStorage.setItem('foodMemo', memo);
            console.log(localStorage.getItem('foodMemo'));

            // 顯示保存成功提示
            showNotification('數據已保存到本地！', 'success');

            console.log('數據已保存到 localStorage，記錄數:', restaurants.length);
        } catch (error) {
            console.error('保存數據到 localStorage 失敗:', error);
            showNotification('保存數據失敗！', 'error');
        }
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

    // --- CRUD 操作（保持不變）---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('edit-id').value;
        const name = document.getElementById('res-name').value;
        const rating = document.getElementById('res-rating').value;
        const tags = document.getElementById('res-tags').value.split(',').map(t => t.trim()).filter(t => t);
        const distance = document.getElementById('res-distance').value;
        const website = document.getElementById('res-website').value;
        const note = document.getElementById('res-note').value;

        if (name.trim() == "") {
            alert("Restaurant Name can't be null");
            resetForm();
            return;
        }

        if (!is_edit) {
            if ((restaurants.filter(r => {
                if (!name) return true;
                return r.name.includes(name.toLowerCase());
            })).length !== 0) {
                alert("this restaurant have been saved");
                resetForm();
                return;
            }
        }

        const data = {
            id: id || Date.now().toString(),
            name,
            rating,
            tags,
            distance,
            website,
            note
        };

        if (id) {
            // Edit
            const index = restaurants.findIndex(r => r.id === id);
            if (index !== -1) restaurants[index] = data;
        } else {
            // Add
            restaurants.push(data);
        }

        saveData();
        renderList();
        resetForm();

        is_edit = false;
    });

    function deleteRestaurant(id) {
        if (confirm('Delete this restaurant?')) {
            restaurants = restaurants.filter(r => r.id !== id);
            saveData();
            renderList();
        }
    }

    function editRestaurant(id) {
        const r = restaurants.find(r => r.id === id);
        if (!r) return;

        document.getElementById('edit-id').value = r.id;
        document.getElementById('res-name').value = r.name;
        document.getElementById('res-rating').value = r.rating;
        document.getElementById('res-tags').value = r.tags.join(', ');
        document.getElementById('res-distance').value = r.distance;
        document.getElementById('res-website').value = r.website;
        document.getElementById('res-note').value = r.note;

        formTitle.textContent = 'Edit Restaurant';
        document.getElementById('res-name').focus();

        is_edit = true;
    }

    function resetForm() {
        form.reset();
        document.getElementById('edit-id').value = '';
        formTitle.textContent = 'Add Restaurant';
    }

    resetFormBtn.addEventListener('click', resetForm);

    // --- Rendering ---

    function renderList() {
        listContainer.innerHTML = '';
        let filterTag = document.getElementById("search-input-tag").value;
        let filterName = document.getElementById("search-input-name").value;

        const filtered = restaurants.filter(r => {
            if (!filterTag) return true;
            return r.tags.some(t => t.toLowerCase().includes(filterTag.toLowerCase()));
        }).filter(r => {
            if (!filterName) return true;
            return r.name.includes(filterName.toLowerCase());
        });

        filtered.forEach(r => {
            const item = document.createElement('div');
            item.className = 'restaurant-item';

            const tagsHtml = r.tags.map(t => `<span class="tag">${t}</span>`).join('');
            const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name)}`;

            let websiteLink = '';
            if (r.website) {
                websiteLink = `<a href="${r.website}" target="_blank" class="action-btn" title="Website"><i class="fa-solid fa-link"></i></a>`;
            }

            item.innerHTML = `
                <div class="restaurant-info">
                    <h4>${r.name} <span style="font-size:0.8rem; color:var(--accent-color);"><i class="fa-solid fa-star"></i> ${r.rating || '-'}</span></h4>
                    <div class="tags">${tagsHtml}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 5px;">
                        ${r.distance ? `<i class="fa-solid fa-person-walking"></i> ${r.distance}` : ''}
                        ${r.note ? ` | ${r.note}` : ''}
                    </div>
                </div>
                <div class="actions">
                    ${websiteLink}
                    <a href="${googleMapUrl}" target="_blank" class="action-btn" title="Google Maps"><i class="fa-solid fa-map-location-dot"></i></a>
                    <button class="action-btn edit-btn" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="action-btn delete-btn" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;

            item.querySelector('.edit-btn').addEventListener('click', () => editRestaurant(r.id));
            item.querySelector('.delete-btn').addEventListener('click', () => deleteRestaurant(r.id));

            listContainer.appendChild(item);
        });
    }

    // --- Search ---
    searchInputTag.addEventListener('input', (e) => {
        renderList();
    });
    searchInputName.addEventListener('input', (e) => {
        renderList();
    });

    // --- Picker ---
    pickBtn.addEventListener('click', () => {
        const tag = pickerTag.value.trim();
        let candidates = restaurants;

        if (tag) {
            candidates = restaurants.filter(r => r.tags.some(t => t.toLowerCase().includes(tag.toLowerCase())));
        }

        if (candidates.length === 0) {
            pickerResult.innerHTML = '<span style="color: #f87171;">No restaurants found!</span>';
            return;
        }

        // Animation effect
        let count = 0;
        const interval = setInterval(() => {
            const random = candidates[Math.floor(Math.random() * candidates.length)];
            pickerResult.innerHTML = `<h3>${random.name}</h3>`;
            count++;
            if (count > 10) {
                clearInterval(interval);
                // Final pick
                const winner = candidates[Math.floor(Math.random() * candidates.length)];
                const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(winner.name)}`;

                pickerResult.innerHTML = `
                    <h3>${winner.name}</h3>
                    <div class="tags">${winner.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
                    <div style="margin-top: 10px;">
                        <a href="${googleMapUrl}" target="_blank" class="btn btn-primary" style="font-size: 0.8rem; padding: 5px 10px;">Go!</a>
                    </div>
                `;
            }
        }, 100);
    });

    // --- Memo ---
    memoArea.addEventListener('input', (e) => {
        localStorage.setItem('foodMemo', e.target.value);
    });

    // --- Storage ---
    function saveData() {
        localStorage.setItem('restaurants', JSON.stringify(restaurants));
        memoArea.value = memo;
        localStorage.setItem('foodMemo', memoArea.value);

        saveToLocalStorage();
        markDataChanged();
    }

    //--- tagConsult ---
    const TagConsult = document.getElementById("btn-consult");
    TagConsult.addEventListener('click', SearchTag);

    function SearchTag() {
        try {
            // 1. 從 localStorage 讀取 restaurants 資料
            const restaurantsData = localStorage.getItem('restaurants');
            // 2. 檢查資料是否存在
            if (!restaurantsData) {
                console.log('LocalStorage 中沒有 restaurants 資料');
                return [];
            }
            // 3. 解析 JSON 資料
            let restaurants;
            try {
                restaurants = JSON.parse(restaurantsData);
            } catch (parseError) {
                console.error('解析 restaurants 資料失敗:', parseError);
                return [];
            }
            // 5. 收集所有 tags
            const allTags = [];
            restaurants.forEach(restaurant => {
                // 檢查是否有 tags 屬性且是陣列
                if (restaurant.tags && Array.isArray(restaurant.tags)) {
                    allTags.push(...restaurant.tags);
                }
            });
            // 6. 移除重複的 tags
            const uniqueTags = [...new Set(allTags)];
            // 7. 移除空字串或只有空白的 tag
            const filteredTags = uniqueTags
                .map(tag => tag?.toString().trim()) // 轉為字串並去除空白
                .filter(tag => tag && tag.length > 0); // 過濾空值

            CustomAlert(filteredTags, "Tag List");

            return filteredTags;
        } catch (error) {
            console.error('獲取 tags 時發生錯誤:', error);
            return [];
        }
    }

    //CustomAlert
    function CustomAlert(message, title) {
        let realtitle = document.title;
        document.title = title;
        alert(document.title);
        alert(message);
        document.title = realtitle;
    }

    // 啟動初始化
    init();
    loadEventsFromCSV();
});

