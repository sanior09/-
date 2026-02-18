// ฟังก์ชันหลักที่จะทำงานเมื่อ DOM พร้อม
function initWebsite() {
    // --- ฟังก์ชันสำหรับเลื่อนหน้าจอแบบนุ่มนวล (Reusable) ---
    function smoothScrollTo(targetY, duration = 1000) {
        const startPosition = window.pageYOffset;
        const distance = targetY - startPosition;
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            // Easing function: Ease Out Cubic (เริ่มเร็ว จบช้า นุ่มนวล)
            const ease = (t) => (--t) * t * t + 1; 
            
            const y = startPosition + distance * ease(Math.min(progress / duration, 1));
            window.scrollTo(0, y);
            
            if (progress < duration) window.requestAnimationFrame(step);
        }
        
        window.requestAnimationFrame(step);
    }

    // --- 1. Animation เมื่อเลื่อนหน้าจอ (Scroll Reveal) ---
    // เลือก element ทั้งหมดที่มี class 'reveal'
    const reveals = document.querySelectorAll('.reveal');

    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const elementVisible = 150; // ระยะห่างจากขอบล่างที่ต้องการให้เริ่มแสดง

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
            // หากต้องการให้ซ่อนเมื่อเลื่อนกลับ ให้เพิ่ม else { reveal.classList.remove('active'); }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // --- 2. ปุ่มกลับขึ้นด้านบน (Back to Top) ---
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // ฟังก์ชันตรวจสอบการแสดงผลปุ่ม
        const toggleBackToTop = () => {
            // ใช้ window.scrollY หรือ document.documentElement.scrollTop เพื่อรองรับทุก Browser
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (scrollTop > 300) {
                backToTopBtn.classList.add('show'); // ใช้ Class show เพื่อแสดงปุ่ม
            } else {
                backToTopBtn.classList.remove('show'); // ลบ Class show เพื่อซ่อน
            }
        };

        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop(); // เรียกทำงานทันที 1 ครั้งเพื่อเช็คสถานะเริ่มต้น

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // เล่นเสียงกดปุ่ม (ถ้ามี)
            const clickSound = document.getElementById('clickSound');
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(() => {});
            }

            smoothScrollTo(0, 1000); // เลื่อนไปบนสุดใน 1 วินาที
        });
    }

    // --- 3. Loading Screen ---
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1500); // แสดง Loading 1.5 วินาที
        });
    }

    // --- 4. เมนู Hamburger (Mobile) ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // --- 5. Video Modal ---
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const closeBtn = document.querySelector('.close-modal');
    const videoButtons = document.querySelectorAll('.btn-video');

    if (modal && videoPlayer) {
        videoButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const videoId = btn.getAttribute('data-video');
                if (videoId) {
                    videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                    modal.style.display = 'block';
                }
            });
        });

        const closeModal = () => {
            modal.style.display = 'none';
            videoPlayer.src = '';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // --- 6. วันที่และเวลา ---
    function updateDateTime() {
        const now = new Date();
        const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
        const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

        const dayEl = document.getElementById('dayName');
        const dateEl = document.getElementById('fullDate');
        const timeEl = document.getElementById('liveTime');

        if (dayEl) dayEl.innerText = 'วัน' + days[now.getDay()];
        if (dateEl) dateEl.innerText = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear() + 543}`;
        if (timeEl) timeEl.innerText = now.toLocaleTimeString('th-TH');
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // --- 7. Contact Toggle ---
    const btnContact = document.getElementById('btnContact');
    const contactDetails = document.getElementById('contactDetails');
    if (btnContact && contactDetails) {
        btnContact.addEventListener('click', () => {
            contactDetails.classList.toggle('hidden');
            if (contactDetails.classList.contains('hidden')) {
                contactDetails.style.display = 'none';
                btnContact.innerText = 'แสดงช่องทางติดต่อ';
            } else {
                contactDetails.style.display = 'block';
                btnContact.innerText = 'ซ่อนช่องทางติดต่อ';
            }
        });
    }

    // --- 8. Weather API (Open-Meteo) ---
    function fetchWeather() {
        // พิกัดจังหวัดแพร่: 18.1446° N, 100.1403° E
        const lat = 18.1446;
        const lon = 100.1403;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!data.current_weather) return;

                const temp = data.current_weather.temperature;
                const weatherCode = data.current_weather.weathercode;
                
                const tempEl = document.getElementById('tempValue');
                const descEl = document.getElementById('weatherDesc');
                const iconEl = document.getElementById('weatherIcon');

                if (tempEl) tempEl.innerText = temp;

                // แปลงรหัสสภาพอากาศ (WMO Weather interpretation codes)
                let weatherText = 'มีเมฆมาก';
                let weatherIcon = '☁️';

                if (weatherCode === 0) {
                    weatherText = 'ฟ้าโปร่ง';
                    weatherIcon = '☀️';
                } else if (weatherCode >= 1 && weatherCode <= 3) {
                    weatherText = 'มีเมฆบางส่วน';
                    weatherIcon = '⛅';
                } else if (weatherCode >= 45 && weatherCode <= 48) {
                    weatherText = 'มีหมอก';
                    weatherIcon = '🌫️';
                } else if (weatherCode >= 51 && weatherCode <= 67 || (weatherCode >= 80 && weatherCode <= 82)) {
                    weatherText = 'ฝนตก';
                    weatherIcon = '🌧️';
                } else if (weatherCode >= 95 && weatherCode <= 99) {
                    weatherText = 'พายุฝนฟ้าคะนอง';
                    weatherIcon = '⚡';
                }

                if (descEl) descEl.innerText = weatherText;
                if (iconEl) iconEl.innerText = weatherIcon;
            })
            .catch(error => {
                console.error('Error fetching weather:', error);
            });
    }

    // เรียกใช้ฟังก์ชันทันทีและอัปเดตทุก 15 นาที
    fetchWeather();
    setInterval(fetchWeather, 900000);

    // --- 9. ทำให้ลิงก์ภายในหน้าเว็บทั้งหมด (เช่น Navbar, ปุ่ม CTA) เลื่อนแบบ Smooth ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const targetId = anchor.getAttribute('href');
        // ตรวจสอบว่ามี element ที่ตรงกับ href อยู่จริง และไม่ใช่แค่ # เปล่าๆ
        if (targetId.length > 1 && document.querySelector(targetId)) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                // คำนวณตำแหน่งเป้าหมาย โดยหักความสูงของ Navbar และเว้นระยะเพิ่มเล็กน้อย
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                
                smoothScrollTo(targetPosition, 1000);
            });
        }
    });
}

// ตรวจสอบสถานะการโหลดของหน้าเว็บเพื่อให้มั่นใจว่าโค้ดทำงานแน่นอน
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWebsite);
} else {
    initWebsite();
}