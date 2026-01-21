// ฟังก์ชันกดเพื่อแสดงรายละเอียดติดต่อ
document.getElementById('btnContact').addEventListener('click', function() {
    const details = document.getElementById('contactDetails');
    if (details.classList.contains('hidden')) {
        details.classList.remove('hidden');
        this.textContent = 'ซ่อนช่องทางติดต่อ';
    } else {
        details.classList.add('hidden');
        this.textContent = 'แสดงช่องทางติดต่อ';
    }
});

// ฟังก์ชัน Scroll Reveal (แสดงผลเมื่อเลื่อนมาถึง)
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);

// เรียกใช้ครั้งแรกเพื่อแสดงข้อมูลที่อยู่ในหน้าจอตอนโหลด
reveal();