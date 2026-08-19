
// slider =======================================



// History ======================================================

gsap.registerPlugin(ScrollTrigger);

// 요소 선택
const progressBar = document.querySelector(".progress-bar");
const pointer = document.querySelector(".scrollbar-pointer");

// SVG 길이
const totalLength = progressBar.getTotalLength();

// 초기 상태
gsap.set(progressBar, {
    strokeDasharray: totalLength,
    strokeDashoffset: totalLength
});

gsap.set(pointer, {
    x: 0
});

// Timeline
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".history-track",
        pin: ".history-sec",
        start: "top top",
        end: "+=4000",
        scrub: true,
        // markers: true
    }
});

// 노란 선 채우기
tl.to(progressBar, {
    strokeDashoffset: 0,
    ease: "none"
}, 0);

// 포인터 이동
tl.to(pointer, {
    x: () => {
        const svg = document.querySelector(".history-progress-svg");
        return svg.getBoundingClientRect().width - pointer.offsetWidth;
    },
    ease: "none"
}, 0);

// ===== 텍스트 Active 변경 =====

const textItems = document.querySelectorAll(".history-text-list");

ScrollTrigger.create({

    trigger: ".history-sec",

    start: "top top",

    end: "+=4000",

    scrub: true,

    onUpdate: (self) => {

        const progress = self.progress;

        textItems.forEach(item => item.classList.remove("active"));

        if (progress < 0.315625) {

            textItems[0].classList.add("active");

        } else if (progress < 0.507812) {

            textItems[1].classList.add("active");

        } else if (progress < 0.697916) {

            textItems[2].classList.add("active");

        } else {

            textItems[3].classList.add("active");

        }

    }

});


// Problem ===============================================================

$(function () {
    $(".problem-sec button").on("click", function () {
        location.href = "/brand.html";
    });
});


// Prove ========================================================================





// ========================================================================

