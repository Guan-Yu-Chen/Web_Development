const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const YEAR = 2025;
const MONTH_INDEX = 11; // 11 = December
const START_DAY = 1;
const END_DAY = 31;
const CLASS_DURATION = 50;

// Time Mapping
const TIME_SLOTS = {
    "1": "08:00",
    "2": "09:00",
    "3": "10:10",
    "4": "11:10",
    "N": "12:10",
    "5": "13:10",
    "6": "14:10",
    "7": "15:20",
    "8": "16:20",
    "9": "17:30",
    "A": "18:25",
    "B": "19:20",
    "C": "20:15",
    "D": "21:10"
};

const COLORS = {
    BLUE: "#38bdf8",
    ORANGE: "#fbbf24", // Adjusted to match user's Web Dev color
    GREEN: "#4ade80",
    RED: "#f87171",
    PURPLE: "#a78bfa"
};

// Redefined Schedule with durations
const FINAL_SCHEDULE = {
    1: [ // Mon
        { period: "5", name: "系統分析與設計", color: COLORS.BLUE, duration: 2 } // 13:10-15:00
    ],
    2: [ // Tue
        { period: "1", name: "網頁程式開發", color: COLORS.ORANGE, duration: 1 }, // 08:00-08:50
        { period: "3", name: "隨機過程", color: COLORS.RED, duration: 2 }, // 10:10-12:00
        { period: "5", name: "品質管理", color: COLORS.GREEN, duration: 2 }, // 13:10-15:00
        { period: "7", name: "機率論", color: COLORS.PURPLE, duration: 2 } // 15:20-17:10
    ],
    3: [ // Wed
        { period: "3", name: "生產與作業管理", color: COLORS.BLUE, duration: 2 }, // 10:10-12:00
        { period: "7", name: "系統分析與設計", color: COLORS.BLUE, duration: 1 }, // 15:20-16:10
        { period: "8", name: "人因工程學", color: COLORS.RED, duration: 1 } // 16:20-17:10
    ],
    4: [ // Thu
        { period: "2", name: "隨機過程", color: COLORS.RED, duration: 1 }, // 09:00-09:50
        { period: "3", name: "網頁程式開發", color: COLORS.ORANGE, duration: 2 } // 10:10-12:00
    ],
    5: [ // Fri
        { period: "2", name: "生產與作業管理", color: COLORS.BLUE, duration: 1 }, // 09:00-09:50
        { period: "5", name: "人因工程學", color: COLORS.RED, duration: 2 }, // 13:10-15:00
        { period: "7", name: "機率論", color: COLORS.PURPLE, duration: 1 }, // 15:20-16:10
        { period: "8", name: "品質管理", color: COLORS.GREEN, duration: 1 } // 16:20-17:10
    ]
};

function generate() {
    const events = [];
    const startDate = new Date(YEAR, MONTH_INDEX, START_DAY);
    const endDate = new Date(YEAR, MONTH_INDEX, END_DAY);

    console.log(`Generating schedule for ${YEAR}/${MONTH_INDEX + 1} from ${START_DAY} to ${END_DAY}...`);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay();

        if (FINAL_SCHEDULE[dayOfWeek]) {
            FINAL_SCHEDULE[dayOfWeek].forEach(course => {
                const startTimeStr = TIME_SLOTS[course.period];
                if (!startTimeStr) return;

                // Calculate End Time
                const [h, m] = startTimeStr.split(':').map(Number);
                const startTotal = h * 60 + m;

                // Duration calculation: 50min per period, plus 10min gap if > 1 period
                // 1 period = 50 min.
                // 2 periods = 50 + 10 (break) + 50 = 110 min.
                let durationMin = (course.duration * 50) + ((course.duration - 1) * 10);

                const endTotal = startTotal + durationMin;
                const endH = Math.floor(endTotal / 60);
                const endM = endTotal % 60;
                const endTimeStr = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

                const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

                events.push({
                    id: Date.now() + Math.random(),
                    name: course.name,
                    date: dateStr,
                    start: startTimeStr,
                    end: endTimeStr,
                    note: course.note || "",
                    color: course.color
                });
            });
        }
    }

    const outputPath = path.join(__dirname, '../data/course.json');
    fs.writeFileSync(outputPath, JSON.stringify(events, null, 2), 'utf8');
    console.log(`Successfully generated ${events.length} events to ${outputPath}`);
}

generate();
