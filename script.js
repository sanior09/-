/**
 * HUG PHRAE - Optimized Script
 * ประสิทธิภาพสูงขึ้นด้วย Intersection Observer และโค้ดที่กระชับกว่าเดิม
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // === 1. VIDEO MODAL LOGIC ===
    const modal = document.getElementById("videoModal");
    const videoPlayer = document.getElementById("videoPlayer");
    const closeBtn = document.querySelector(".close-modal");
    const videoButtons = document.querySelectorAll(".btn-video, .video-btn");

    const toggleModal = (show = false, videoId = "") => {
        if (!modal || !videoPlayer) return;

        if (show && videoId) {
            videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        } else {
            modal.style.display = "none";
            videoPlayer.src = ""; // ปิดวิดีโอทันที
            document.body.style.overflow = "";
        }
    };

    videoButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.dataset.video || button.dataset.videoId;
            toggleModal(true, id);
        });
    });

    // ปิด Modal ด้วยวิธีต่างๆ
    closeBtn?.addEventListener("click", () => toggleModal(false));
    window.addEventListener("click", (e) => e.target === modal && toggleModal(false));
    window.addEventListener("keydown", (e) => e.key === "Escape" && toggleModal(false));


    // === 2. CONTACT REVEAL (Simple Toggle) ===
    const btnContact = document.getElementById('btnContact');
    const contactDetails = document.getElementById('contactDetails');

    if (btnContact && contactDetails) {
        btnContact.addEventListener('click', () => {
            const isHidden = contactDetails.classList.toggle('hidden');
            
            // ปรับแต่ง UI เล็กน้อย
            btnContact.textContent = isHidden ? 'แสดงช่องทางติดต่อ' : 'ซ่อนช่องทางติดต่อ';
        });
    }


    // === 3. SCROLL REVEAL (Intersection Observer API) ===
    // วิธีนี้ดีกว่าการใช้ window.addEventListener('scroll') เพราะไม่กินสเปคเครื่อง
    const revealOption = {
        threshold: 0.15, // เริ่มแสดงเมื่อ Element โผล่มา 15%
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // ทำงานครั้งเดียวแล้วเลิกตาม (Performance)
            }
        });
    }, revealOption);

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));


    // === 4. SMOOTH SCROLL & ACTIVE NAV ===
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - (navHeight - 10);

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === 5. BACK TO TOP BUTTON ===
    const backToTopBtn = document.getElementById("backToTop");

    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});
// --- ฟังก์ชันนาฬิกาและวันที่ ---
    const updateDateTime = () => {
        const now = new Date();
        const dayNames = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
        const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

        const dayName = dayNames[now.getDay()];
        const day = now.getDate();
        const month = monthNames[now.getMonth()];
        const year = now.getFullYear() + 543; // แปลงเป็น พ.ศ.
        
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        if(document.getElementById('dayName')) {
            document.getElementById('dayName').textContent = dayName;
            document.getElementById('fullDate').textContent = `ที่ ${day} ${month} ${year}`;
            document.getElementById('liveTime').textContent = `🕒 ${hours}:${minutes}:${seconds}`;
        }
    };

    updateDateTime();
    setInterval(updateDateTime, 1000); // อัปเดตทุกวินาที
    // เพิ่มฟังก์ชันดึงสภาพอากาศ
const updateWeather = async () => {
    try {
        // พิกัดละติจูด/ลองจิจูด ของ จ.แพร่
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=18.1446&longitude=100.1403&current_weather=true');
        const data = await response.json();
        
        const temp = Math.round(data.current_weather.temperature);
        const code = data.current_weather.weathercode;
        
        // อัปเดตตัวเลขหน้าเว็บ
        document.getElementById('tempValue').textContent = temp;
        
        // เปลี่ยนไอคอนและคำอธิบายตามสภาพอากาศจริง
        let icon = "☀️";
        let desc = "ท้องฟ้าแจ่มใส";

        if (code > 0 && code <= 3) { icon = "⛅"; desc = "มีเมฆบางส่วน"; }
        else if (code >= 45 && code <= 48) { icon = "🌫️"; desc = "มีหมอกลง"; }
        else if (code >= 51 && code <= 67) { icon = "🌧️"; desc = "ฝนตกโปรยปราย"; }
        else if (code >= 71) { icon = "⛈️"; desc = "ฝนฟ้าคะนอง"; }

        document.getElementById('weatherIcon').textContent = icon;
        document.getElementById('weatherDesc').textContent = desc;

    } catch (error) {
        document.getElementById('weatherDesc').textContent = "เช็คสภาพอากาศไม่ได้";
    }
};

// เรียกใช้งาน
updateWeather();
setInterval(updateWeather, 600000); // อัปเดตทุก 10 นาที

// === 6. LOADING SCREEN ===
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        // หน่วงเวลาเล็กน้อยเพื่อให้เห็น Animation (0.5 วินาที)
        setTimeout(() => loadingScreen.classList.add('loaded'), 500);
    }
});
    