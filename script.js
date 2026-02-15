// พิกัดจังหวัดแพร่ (Latitude, Longitude)
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast?latitude=18.1446&longitude=100.1403&current_weather=true&timezone=Asia%2FBangkok";

document.addEventListener('DOMContentLoaded', () => {
    // 1. เริ่มทำงานนาฬิกา
    updateClock();
    setInterval(updateClock, 1000);

    // 2. ดึงข้อมูลสภาพอากาศ
    getWeather();

    // 3. ตั้งค่าการทำงานของปุ่มต่างๆ
    setupUI();

    // 4. เพิ่มข้อมูลเวลาเปิด-ปิด
    addOpeningHours();
});

window.addEventListener('load', () => {
    // ซ่อนหน้า Loading Screen เมื่อโหลดเสร็จ
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.2s ease';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 200);
        }, 500); // ลดเวลาการรอจาก 2 วินาที เหลือ 0.5 วินาที
    }
});

// ฟังก์ชันนาฬิกา
function updateClock() {
    const now = new Date();
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

    const dayName = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear() + 543; // พ.ศ.

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const dayNameEl = document.getElementById('dayName');
    const fullDateEl = document.getElementById('fullDate');
    const liveTimeEl = document.getElementById('liveTime');

    if (dayNameEl) dayNameEl.textContent = `วัน${dayName}`;
    if (fullDateEl) fullDateEl.textContent = `${date} ${month} ${year}`;
    if (liveTimeEl) liveTimeEl.textContent = `${hours}:${minutes}:${seconds}`;
}

// ฟังก์ชันดึงสภาพอากาศ
async function getWeather() {
    try {
        const response = await fetch(WEATHER_API_URL);
        const data = await response.json();
        
        if (data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const weatherCode = data.current_weather.weathercode;
            
            document.getElementById('tempValue').textContent = temp;
            document.getElementById('weatherDesc').textContent = interpretWeatherCode(weatherCode);
            document.getElementById('weatherIcon').textContent = getWeatherIcon(weatherCode);
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
        document.getElementById('weatherDesc').textContent = "ไม่สามารถโหลดข้อมูล";
    }
}

function interpretWeatherCode(code) {
    const codes = {
        0: "ท้องฟ้าแจ่มใส", 1: "มีเมฆบางส่วน", 2: "มีเมฆเป็นส่วนมาก", 3: "มีเมฆมากปกคลุม",
        45: "มีหมอก", 48: "มีหมอกหนาจัด", 51: "มีฝนปรอยๆ", 53: "มีฝนตกปานกลาง",
        55: "มีฝนตกหนัก", 61: "มีฝนตกเล็กน้อย", 63: "มีฝนตกปานกลาง", 65: "มีฝนตกหนัก",
        80: "มีฝนตกเป็นระลอก", 81: "มีฝนตกหนัก", 82: "มีฝนตกหนักมาก",
        95: "มีฝนฟ้าคะนอง", 96: "ฝนฟ้าคะนองและลูกเห็บ", 99: "ฝนฟ้าคะนองรุนแรง"
    };
    return codes[code] || "ไม่มีข้อมูล";
}

function getWeatherIcon(code) {
    if (code === 0) return "☀️";
    if ([1, 2, 3].includes(code)) return "⛅";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
    if ([95, 96, 99].includes(code)) return "⚡";
    return "☁️";
}

function setupUI() {
    // ปุ่มติดต่อ
    const btnContact = document.getElementById('btnContact');
    const contactDetails = document.getElementById('contactDetails');
    if (btnContact && contactDetails) {
        btnContact.addEventListener('click', () => {
            contactDetails.classList.toggle('hidden');
            btnContact.textContent = contactDetails.classList.contains('hidden') ? 'แสดงช่องทางติดต่อ' : 'ซ่อนช่องทางติดต่อ';
        });
    }

    // Hamburger Menu (เมนูมือถือ)
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        // ปิดเมนูเมื่อคลิกลิงก์
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backToTop.classList.add('show');
            else backToTop.classList.remove('show');
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Video Modal Logic
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const closeModal = document.querySelector('.close-modal');
    
    document.querySelectorAll('.btn-video').forEach(btn => {
        btn.addEventListener('click', () => {
            const videoId = btn.getAttribute('data-video');
            if (videoId && modal && videoPlayer) {
                videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                modal.style.display = 'block';
            }
        });
    });

    if (closeModal && modal && videoPlayer) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            videoPlayer.src = '';
        });
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                videoPlayer.src = '';
            }
        });
    }

    // Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load
}

// ฟังก์ชันเพิ่มเวลาเปิด-ปิด ให้กับการ์ดสถานที่
function addOpeningHours() {
    const cards = document.querySelectorAll('#places .card');
    
    const placesData = {
        "วัดพระธาตุช่อแฮ": { time: "06:00 - 18:00 น.", days: "เปิดทุกวัน", phone: "054-599-209" },
        "คุ้มวงศ์บุรี": { time: "09:00 - 17:00 น.", days: "เปิดทุกวัน", phone: "054-620-153" },
        "อุทยานแพะเมืองผี": { time: "08:30 - 16:30 น.", days: "เปิดทุกวัน", phone: "054-511-162" },
        "พิพิธภัณฑ์คุ้มเจ้าหลวง": { time: "08:30 - 16:30 น.", days: "เปิดทุกวัน", phone: "054-511-411" },
        "วัดพระธาตุสุโทนฯ": { time: "06:00 - 18:00 น.", days: "เปิดทุกวัน", phone: "054-645-263" },
        "บ้านนาคูหา": { time: "08:00 - 17:00 น.", days: "เปิดทุกวัน", phone: "084-047-6460" },
        "กาดพระนอน": { time: "15:00 - 20:00 น.", days: "เฉพาะวันเสาร์", phone: "054-511-060" },
        "วัดจอมสวรรค์": { time: "08:00 - 17:00 น.", days: "เปิดทุกวัน", phone: "054-521-127" },
        "อ่างเก็บน้ำแม่สาย": { time: "06:00 - 18:00 น.", days: "เปิดทุกวัน", phone: "054-521-127" },
        "บ้านทุ่งโฮ้ง": { time: "08:00 - 17:00 น.", days: "เปิดทุกวัน", phone: "054-624-377" },
        "น้ำตกแม่เกิ๋ง": { time: "08:00 - 16:30 น.", days: "เปิดทุกวัน", phone: "054-556-763" },
        "ถ้ำผานางคอย": { time: "08:30 - 17:00 น.", days: "เปิดทุกวัน", phone: "054-501-722" }
    };

    const locationLinks = {
        "วัดพระธาตุช่อแฮ": "https://maps.app.goo.gl/9A1RbyZhDxWiWXbX8",
        "คุ้มวงศ์บุรี": "https://maps.app.goo.gl/7gTsbGHqNHeYcfFz6",
        "อุทยานแพะเมืองผี": "https://maps.app.goo.gl/BtpUfwjE2qcrvfCx9",
        "พิพิธภัณฑ์คุ้มเจ้าหลวง": "https://maps.app.goo.gl/CnHk1zmoSPsZV57M7",
        "วัดพระธาตุสุโทนฯ": "https://maps.app.goo.gl/y6yMMMhpUvhgTW388",
        "บ้านนาคูหา": "https://maps.app.goo.gl/e7tsYsLKa9o4i1j16",
        "กาดพระนอน": "https://maps.app.goo.gl/HHooDh9hFZjgyP4z7",
        "วัดจอมสวรรค์": "https://maps.app.goo.gl/ruV3hxYkufX5qqVs6",
        "อ่างเก็บน้ำแม่สาย": "https://maps.app.goo.gl/W7jJX4JjmW1ZvWBA8",
        "บ้านทุ่งโฮ้ง": "https://maps.app.goo.gl/6RudnF6aiuATVjeP9",
        "น้ำตกแม่เกิ๋ง": "https://maps.app.goo.gl/hgezCeLfG6EPPeV58",
        "ถ้ำผานางคอย": "https://maps.app.goo.gl/wppJEQEFgMFmUQj88"
    };

    cards.forEach(card => {
        const titleEl = card.querySelector('h3');
        if (!titleEl) return;
        
        const title = titleEl.textContent.trim();
        const body = card.querySelector('.card-body');
        // หาปุ่มวิดีโอเพื่อจะแทรกข้อมูลไว้ข้างบนปุ่ม
        const btn = card.querySelector('.btn-video') || card.querySelector('.video-btn'); 

        const cleanTitle = title.replace(/^\d+\.\s*/, '').trim(); // ตัดเลขลำดับออก เช่น "1. "
        
        // ดึงข้อมูลจาก placesData ถ้าไม่มีให้ใช้ค่า Default
        const data = placesData[cleanTitle] || { 
            time: "08:00 - 17:00 น.", 
            days: "เปิดทุกวัน", 
            phone: "054-521-127" // เบอร์ ททท. แพร่
        };

        // สร้างลิงก์ Google Maps (ใช้ลิงก์ที่กำหนดไว้ หรือค้นหาถ้าไม่มี)
        const mapUrl = locationLinks[cleanTitle] || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanTitle + ' แพร่')}`;

        // ตรวจสอบว่าเป็นวันเสาร์-อาทิตย์หรือไม่ ถ้าใช่ให้เปลี่ยนสีเป็นแดง ถ้าวันธรรมดาให้เป็นสีเขียว
        const isWeekend = data.days.includes('เสาร์') || data.days.includes('อาทิตย์');
        const color = isWeekend ? '#d32f2f' : '#2e7d32'; // แดง หรือ เขียว
        const daysStyle = `style="color: ${color}; font-weight: bold;"`;

        // ตรวจสอบสถานะ เปิด/ปิด (Real-time)
        let statusHtml = '';
        try {
            const now = new Date();
            const currentDay = now.getDay(); // 0 = อาทิตย์, 6 = เสาร์
            const currentTime = now.getHours() * 60 + now.getMinutes();

            // ตรวจสอบวันเปิด (รองรับ "ทุกวัน", "เสาร์", "อาทิตย์")
            let isDayOpen = data.days.includes("ทุกวัน") || 
                           (data.days.includes("เสาร์") && currentDay === 6) ||
                           (data.days.includes("อาทิตย์") && currentDay === 0);

            // ตรวจสอบเวลา (ดึงตัวเลขจาก string เช่น "06:00 - 18:00")
            const timeMatch = data.time.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
            if (timeMatch && isDayOpen) {
                const openTime = parseInt(timeMatch[1]) * 60 + parseInt(timeMatch[2]);
                const closeTime = parseInt(timeMatch[3]) * 60 + parseInt(timeMatch[4]);
                
                if (currentTime >= openTime && currentTime < closeTime) {
                    statusHtml = '<div style="width: 100%; text-align: center; color: #2e7d32; font-weight: bold; font-size: 0.9rem; margin-top: 5px; display: flex; align-items: center; justify-content: center;"><span class="status-dot"></span> เปิดอยู่ (Open Now)</div>';
                } else {
                    statusHtml = '<div style="width: 100%; text-align: center; color: #d32f2f; font-weight: bold; font-size: 0.9rem; margin-top: 5px;">● ปิดทำการ (Closed)</div>';
                }
            } else {
                statusHtml = '<div style="width: 100%; text-align: center; color: #d32f2f; font-weight: bold; font-size: 0.9rem; margin-top: 2px;">● ปิดทำการ (Closed)</div>';
            }
        } catch (e) { console.error(e); }

        const infoDiv = document.createElement('div');
        infoDiv.className = 'opening-info';
        infoDiv.innerHTML = `
            <div class="info-item"><span class="icon">📅</span> <span ${daysStyle}>${data.days}</span></div>
            <div class="info-item" style="flex-wrap: wrap;"><span class="icon">⏰</span> ${data.time} ${statusHtml}</div>
            <div class="info-item">
                <span class="icon">📞</span> <a href="tel:${data.phone.replace(/-/g,'')}">${data.phone}</a>
                <a href="${mapUrl}" target="_blank" class="map-link" title="ดูแผนที่">📍 แผนที่</a>
            </div>
        `;
        
        if (btn && body) body.insertBefore(infoDiv, btn);
        else if (body) body.appendChild(infoDiv);
    });
}