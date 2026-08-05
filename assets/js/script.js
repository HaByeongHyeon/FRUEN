
// slider =======================================

$(function () {

    const $slides = $(".slider-img");

    const $fruitWrap = $(".fruit-name-wrap");
    const $fruitNames = $(".fruit-name");

    const $currentWrap = $(".current-wrap");
    const $currentNumbers = $(".current");

    // Color Target
    const $colorTitle = $(".color-title");
    const $sliderBtn = $(".slider-btn a");

    const colorClasses = [
        "grapefruit",
        "lemon",
        "shinemuscat",
        "peach",
        "blueberry"
    ];

    let current = 0;

    const interval = 3000;
    const fadeSpeed = 800;

    const totalSlides = $slides.length;

    const fruitHeight = $fruitNames.outerHeight();
    const currentHeight = $currentNumbers.outerHeight();

    // ==========================
    // 초기 설정
    // ==========================

    $slides.css({
        opacity: 0,
        zIndex: 1
    });

    $slides.eq(0).css({
        opacity: 1,
        zIndex: 2
    }).addClass("active");

    $fruitWrap.css({
        position: "relative",
        top: 0
    });

    $currentWrap.css({
        position: "relative",
        top: 0
    });

    // 첫 번째 색상 적용
    $colorTitle.addClass(colorClasses[0]);
    $sliderBtn.addClass(colorClasses[0]);

    // ==========================
    // 자동 슬라이드
    // ==========================

    setInterval(function () {

        const next = (current + 1) % totalSlides;

        // --------------------------
        // Color Change
        // --------------------------

        $colorTitle
            .removeClass(colorClasses.join(" "))
            .addClass(colorClasses[next]);

        $sliderBtn
            .removeClass(colorClasses.join(" "))
            .addClass(colorClasses[next]);

        // --------------------------
        // Fruit Name
        // --------------------------

        if (next === 0) {

            $fruitWrap.stop().animate({
                top: -(totalSlides * fruitHeight)
            }, fadeSpeed, function () {

                $(this).css("top", 0);

            });

        } else {

            $fruitWrap.stop().animate({
                top: -(next * fruitHeight)
            }, fadeSpeed);

        }

        // --------------------------
        // Current Number
        // --------------------------

        if (next === 0) {

            $currentWrap.stop().animate({
                top: -(totalSlides * currentHeight)
            }, fadeSpeed, function () {

                $(this).css("top", 0);

            });

        } else {

            $currentWrap.stop().animate({
                top: -(next * currentHeight)
            }, fadeSpeed);

        }

        // --------------------------
        // Image Fade
        // --------------------------

        $slides.eq(next)
            .css("z-index", 3)
            .stop(true)
            .animate({
                opacity: 1
            }, fadeSpeed);

        $slides.eq(current)
            .css("z-index", 2)
            .stop(true)
            .animate({
                opacity: 0
            }, fadeSpeed, function () {

                $(this)
                    .removeClass("active")
                    .css("z-index", 1);

            });

        $slides.eq(next).addClass("active");

        current = next;

    }, interval);

});


// ========================================================================

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
// ========================================================================


// Prove ========================================================================


// ========================================================================

$(function () {

    $(".answer").hide();

    $(".btn-answer").on("click", function () {

        const $btn = $(this);
        const $icon = $btn.find("img");
        const $faq = $btn.closest(".faq-list");
        const $answer = $faq.find(".answer");

        const isOpen = $answer.is(":visible");

        // 다른 답변 닫기
        $(".faq-list").not($faq).each(function () {

            const $otherAnswer = $(this).find(".answer");
            const $otherBtn = $(this).find(".btn-answer");
            const $otherIcon = $otherBtn.find("img");

            $otherAnswer.stop(true, true).slideUp(300);

            $otherBtn.removeClass("active");

            $otherIcon.stop(true).animate({
                deg: 0
            }, {
                duration: 300,
                step: function (now) {
                    $(this).css("transform", "rotate(" + now + "deg)");
                }
            });

        });

        // 현재 답변 토글
        if (isOpen) {

            $answer.stop(true, true).slideUp(300);

            $btn.removeClass("active");

            $icon.stop(true).animate({
                deg: 0
            }, {
                duration: 300,
                step: function (now) {
                    $(this).css("transform", "rotate(" + now + "deg)");
                }
            });

        } else {

            $answer.stop(true, true).slideDown(300);

            $btn.addClass("active");

            $icon.stop(true).animate({
                deg: 45
            }, {
                duration: 300,
                step: function (now) {
                    $(this).css("transform", "rotate(" + now + "deg)");
                }
            });

        }

    });

});


// ========================================================================

