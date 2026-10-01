document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initWeeklySkeleton();
    loadWeather();

    async function loadWeather() {
        try {
            const res = await fetch("https://weather.h34121151.workers.dev/");
            if (!res.ok) throw new Error('Weather fetch failed');

            const data = await res.json();
            console.log("Weather Data Fetched:", data);

            // Interpolation Logic for Current Data
            const current = calculateCurrent(data.today || []);
            renderCurrent(current);

            render24hChart(data.today || []);
            renderWeekly(data.week || []);

        } catch (e) {
            console.error(e);
            renderCurrent(null);
            render24hChart([]);
        }
    }

    // --- Core Logic ---

    function initClock() {
        const timeEl = document.getElementById('time-display');
        const ampmEl = document.getElementById('time-ampm');
        const dateEl = document.getElementById('date-display');

        function update() {
            const now = new Date();
            const hours = now.getHours();
            const mins = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'pm' : 'am';
            const displayHour = hours % 12 || 12;

            if (timeEl) timeEl.textContent = `${displayHour}:${mins}`;
            if (ampmEl) ampmEl.textContent = ampm;

            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const date = now.getDate().toString().padStart(2, '0');
            const dayName = now.toLocaleDateString('en-US', { weekday: 'short' });

            if (dateEl) {
                dateEl.innerHTML = `
                    <span>${month}.${date}</span>
                    <span>${dayName}.</span>
                `;
            }
        }
        update();
        setInterval(update, 1000);
    }

    function initWeeklySkeleton() {
        const grid = document.getElementById('weekly-grid');
        if (!grid) return;
        grid.innerHTML = '';
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const monthDay = `${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`;
            const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });

            grid.innerHTML += `
                <div class="day-column">
                    <div class="day-header">
                        <span>${monthDay}</span>
                        <span style="opacity: 0.7; font-size: 0.9em; margin-left: 5px;">${weekday}</span>
                    </div>
                    <div class="day-cell"></div>
                    <div class="day-cell"></div>
                </div>
            `;
        }
    }

    function calculateCurrent(hourlyData) {
        if (!hourlyData || hourlyData.length === 0) return null;

        const now = new Date();
        // Construct full timestamps for hourly data
        const parseTime = (dStr, tStr) => {
            return new Date(`${dStr}T${tStr}:00`).getTime();
        };

        let t1 = null, t2 = null;
        let d1 = null, d2 = null;

        // Find the slot
        for (let i = 0; i < hourlyData.length - 1; i++) {
            const currentItem = hourlyData[i];
            const nextItem = hourlyData[i + 1];

            const time1 = parseTime(currentItem.date, currentItem.time);
            const time2 = parseTime(nextItem.date, nextItem.time);
            const nowTime = now.getTime();

            if (nowTime >= time1 && nowTime < time2) {
                t1 = time1;
                t2 = time2;
                d1 = currentItem;
                d2 = nextItem;
                break;
            }
        }

        let result = {};

        if (d1 && d2) {
            // Found sandwich
            // 1. Interpolate Temp
            const getTemp = (d) => (Number(d.minT) + Number(d.maxT)) / 2;
            const temp1 = getTemp(d1);
            const temp2 = getTemp(d2);

            const total = t2 - t1;
            const elapsed = now.getTime() - t1;
            const ratio = elapsed / total;

            const interpTemp = temp1 + (temp2 - temp1) * ratio;
            result.temp = Math.round(interpTemp);

            // 2. Wx and Pop from Previous Slot (d1)
            result.wx = d1.Wx;
            result.pop = d1.PoP;
            result.time = d1.time; // Used for icon logic
        } else {
            // Fallback: use first available or closest
            const first = hourlyData[0];
            if (first) {
                const t = (Number(first.minT) + Number(first.maxT)) / 2;
                result.temp = Math.round(t);
                result.wx = first.Wx;
                result.pop = first.PoP;
                result.time = first.time;
            } else {
                return null;
            }
        }

        return result;
    }

    function getWeatherIcon(wx, timeString) {
        if (!timeString) return 'fa-sun';
        try {
            let hour = 12;
            if (timeString.includes(' ')) {
                const parts = timeString.split(' ');
                if (parts.length >= 2) hour = parseInt(parts[1].split(':')[0], 10);
            } else if (timeString.includes(':')) {
                hour = parseInt(timeString.split(':')[0], 10);
            }
            if (isNaN(hour)) hour = 12;
            const isNight = hour >= 18 || hour < 6;
            const wxStr = wx || "";

            if (wxStr.includes('雨')) return 'fa-cloud-showers-heavy';
            if (wxStr.includes('陰')) return 'fa-cloud';
            if (wxStr.includes('雲') && wxStr.includes('晴')) return isNight ? 'fa-cloud-moon' : 'fa-cloud-sun';
            if (wxStr.includes('雲')) return 'fa-cloud';
            if (wxStr.includes('晴')) return isNight ? 'fa-moon' : 'fa-sun';
            return isNight ? 'fa-moon' : 'fa-sun';
        } catch (error) { return 'fa-sun'; }
    }

    function renderCurrent(current) {
        if (!current) return;
        const tempEl = document.getElementById('temp-display');
        const rainEl = document.getElementById('rain-chance');
        const iconEl = document.getElementById('current-icon');

        tempEl.textContent = `${current.temp}°C`;
        rainEl.textContent = `${current.pop ?? '--'}%`;
        const iconClass = getWeatherIcon(current.wx, current.time);
        iconEl.className = `fa-solid ${iconClass} condition-icon`;

        if (iconClass.includes('sun')) iconEl.style.color = '#fbbf24';
        else if (iconClass.includes('rain') || iconClass.includes('showers')) iconEl.style.color = '#60a5fa';
        else if (iconClass.includes('cloud')) iconEl.style.color = '#94a3b8';
        else iconEl.style.color = '#fcd34d';
    }

    function render24hChart(hourlyData) {
        const container = document.getElementById('chart-wrapper');
        const width = container.clientWidth || 800;
        const height = container.clientHeight || 300;

        if (!hourlyData || hourlyData.length === 0) {
            container.innerHTML = '<div style="height:100%; display:flex; justify-content:center; align-items:center;">No Data</div>';
            return;
        }

        const padding = { top: 10, bottom: 60, left: 30, right: 30 }; // Reduced top padding to 10
        const chartHeight = height - padding.top - padding.bottom;
        const chartWidth = width - padding.left - padding.right;

        const dataPoints = hourlyData.map(d => {
            return {
                temp: Math.ceil((Number(d.minT) + Number(d.maxT)) / 2),
                time: d.time,
                date: d.date,
                wx: d.Wx,
                pop: d.PoP
            };
        });

        const validTemps = dataPoints.map(d => d.temp).filter(t => !isNaN(t));
        if (validTemps.length === 0) return;

        let minTemp = Math.min(...validTemps) - 1;
        let maxTemp = Math.max(...validTemps) + 1;
        if (minTemp === maxTemp) { minTemp -= 2; maxTemp += 2; }

        const getX = (i) => padding.left + (i / (dataPoints.length - 1)) * chartWidth;
        const getY = (t) => padding.top + chartHeight - ((t - minTemp) / (maxTemp - minTemp)) * chartHeight;

        let dPath = '';
        dataPoints.forEach((p, i) => {
            const x = getX(i);
            const y = getY(p.temp);
            if (i === 0) dPath += `M ${x} ${y}`;
            else {
                const prevX = getX(i - 1);
                const prevY = getY(dataPoints[i - 1].temp);
                const cp1x = prevX + (x - prevX) * 0.4;
                const cp1y = prevY;
                const cp2x = x - (x - prevX) * 0.4;
                const cp2y = y;
                dPath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
            }
        });

        let svgInnerHTML = `
            <style>
                @keyframes dash {
                    to { stroke-dashoffset: 0; }
                }
                .chart-line {
                    stroke-dasharray: 3000;
                    stroke-dashoffset: 3000;
                    animation: dash 3.5s ease-out forwards; /* Increased duration to 3.5s */
                }
            </style>
            <defs>
                <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="rgba(56, 189, 248, 0.5)" />
                    <stop offset="100%" stop-color="rgba(56, 189, 248, 0)" />
                </linearGradient>
            </defs>
            <path d="${dPath}" class="chart-line" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        `;

        dataPoints.forEach((p, i) => {
            const x = getX(i);
            const y = getY(p.temp);

            // Point
            svgInnerHTML += `<circle cx="${x}" cy="${y}" r="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>`;

            // Temp Label (Size 18)
            svgInnerHTML += `<text x="${x}" y="${y - 15}" fill="white" font-size="20" text-anchor="middle" font-weight="600">${p.temp}°</text>`; // Font 20

            // Icon
            const iconClass = getWeatherIcon(p.wx, p.time);
            const iconY = y + 15;
            svgInnerHTML += `
                <foreignObject x="${x - 12}" y="${iconY}" width="24" height="24">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; justify-content:center; align-items:center; height:100%;">
                        <i class="fa-solid ${iconClass}" style="color: #fbbf24; font-size: 18px;"></i>
                    </div>
                </foreignObject>
            `;

            // Rain
            const rainY = iconY + 28;
            svgInnerHTML += `
                <foreignObject x="${x - 20}" y="${rainY}" width="40" height="20">
                     <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:row; align-items:center; justify-content:center; gap:3px;">
                        <i class="fa-solid fa-umbrella" style="font-size: 10px; color: #e2e8f0;"></i>
                        <span style="font-size: 11px; color: #e2e8f0; font-weight:500;">${p.pop}%</span>
                    </div>
                </foreignObject>
            `;

            // Axis Labels: Swap Date (Top) and Time (Bottom)
            const labelBottomY = height - 15;
            const labelTopY = labelBottomY - 14;

            const timeParts = p.time.split(':');
            const timeLabel = `${timeParts[0]}:${timeParts[1]}`;
            // Time (Bottom)
            svgInnerHTML += `<text x="${x}" y="${labelBottomY}" fill="#94a3b8" font-size="12" text-anchor="middle">${timeLabel}</text>`;

            // Date (Top)
            // Date (Top) - Removed as per user request
            /* if (p.time === "00:00") {
                const parts = p.date.split('-');
                if (parts.length === 3) {
                    const m = parts[1];
                    const d = parts[2];
                    svgInnerHTML += `<text x="${x}" y="${labelTopY}" fill="#64748b" font-size="11" text-anchor="middle">${m}/${d}</text>`;
                }
            } */
        });

        container.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}">${svgInnerHTML}</svg>`;
    }

    function renderWeekly(weekData) {
        const grid = document.getElementById('weekly-grid');
        grid.innerHTML = '';
        if (!weekData || weekData.length === 0) return;

        const grouped = {};
        weekData.forEach(item => {
            const date = item.date;
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(item);
        });
        const dates = Object.keys(grouped).slice(0, 7);

        dates.forEach(dateStr => {
            const methods = grouped[dateStr];
            const dayData = methods.find(m => m.time === "06:00");
            const nightData = methods.find(m => m.time === "18:00");
            if (!dayData && !nightData) return;

            const d = new Date(dateStr);
            const monthDay = `${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`;
            const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });

            const col = document.createElement('div');
            col.className = 'day-column';
            col.innerHTML = `
                <div class="day-header">
                    <span>${monthDay}</span>
                    <span style="opacity: 0.7; font-size: 0.9em; margin-left: 5px;">${weekday}</span>
                </div>
            `;

            const createRow = (data) => {
                if (!data) return `<div class="day-cell">--</div>`;
                const icon = getWeatherIcon(data.Wx, `${dateStr} ${data.time}`);
                let color = '#fbbf24';
                if (icon.includes('rain') || icon.includes('showers')) color = '#60a5fa';
                else if (icon.includes('cloud') && !icon.includes('sun')) color = '#94a3b8';

                return `
                    <div class="day-cell">
                        <i class="fa-solid ${icon} weather-icon-cell" style="color: ${color};"></i>
                        <div class="day-info">
                             <div class="temp-range">${data.minT}-${data.maxT}°C</div>
                             <div class="pop-display">
                                <i class="fa-solid fa-umbrella"></i>
                                ${data.PoP ?? 0}%
                             </div>
                        </div>
                    </div>
                `;
            };
            col.innerHTML += createRow(dayData);
            col.innerHTML += createRow(nightData);
            grid.appendChild(col);
        });
    }
});
