/**
 * HUG PHRAE - Official Website Script
 * รวมฟังก์ชัน: Video Modal, Contact Reveal, Scroll Animation, และ Smooth Scroll
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. ฟังก์ชันจัดการ Video Modal ---
    const modal = document.getElementById("videoModal");
    const videoPlayer = document.getElementById("videoPlayer");
    const closeBtn = document.querySelector(".close-modal");
    const videoButtons = document.querySelectorAll(".video-btn, .btn-video");

    // ฟังก์ชันเปิด Modal
    const openVideo = (videoId) => {
        if (!videoId || !videoPlayer || !modal) return;
        videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // ป้องกันการ Scroll พื้นหลัง
    };

    // ฟังก์ชันปิด Modal
    const closeModal = () => {
        if (!modal) return;
        modal.style.display = "none";
        videoPlayer.src = ""; // หยุดการเล่นวิดีโอ
        document.body.style.overflow = "auto"; // คืนค่าการ Scroll
    };

    // ผูกเหตุการณ์กับปุ่มวิดีโอทั้งหมด
    videoButtons.forEach(button => {
        button.addEventListener("click", () => {
            const videoId = button.getAttribute("data-video-id") || button.getAttribute("data-video");
            openVideo(videoId);
        });
    });

    // เหตุการณ์การปิด Modal (คลิก X, คลิกพื้นหลัง, กด Esc)
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    
    window.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });


    // --- 2. ฟังก์ชันกดเพื่อแสดงรายละเอียดติดต่อ ---
    const btnContact = document.getElementById('btnContact');
    const contactDetails = document.getElementById('contactDetails');

    if (btnContact && contactDetails) {
        btnContact.addEventListener('click', () => {
            const isHidden = contactDetails.classList.contains('hidden');
            
            if (isHidden) {
                contactDetails.classList.remove('hidden');
                contactDetails.style.opacity = "0";
                // ใช้ RequestAnimationFrame แทน setTimeout เพื่อความลื่นไหล
                requestAnimationFrame(() => {
                    contactDetails.style.transition = "opacity 0.5s ease";
                    contactDetails.style.opacity = "1";
                });
                btnContact.textContent = 'ซ่อนช่องทางติดต่อ';
            } else {
                contactDetails.classList.add('hidden');
                btnContact.textContent = 'แสดงช่องทางติดต่อ';
            }
        });
    }


    // --- 3. ฟังก์ชัน Scroll Reveal (Animation เมื่อเลื่อนจอ) ---
    const reveal = () => {
        const reveals = document.querySelectorAll(".reveal");
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add("active");
            }
        });
    };


    // --- 4. ฟังก์ชัน Smooth Scroll สำหรับ Navigation ---
    const setupSmoothScroll = () => {
        document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // --- เริ่มทำงานฟังก์ชันพื้นฐาน ---
    window.addEventListener("scroll", reveal);
    reveal(); // เรียกใช้งานทันทีหนึ่งครั้งเพื่อแสดงส่วนที่อยู่ในจออยู่แล้ว
    setupSmoothScroll();
});