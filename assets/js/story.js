/* 기업 연혁 =============================================================== */
$(function () {

    const $yearBtns = $(".year-text-wrap > span");
    const $yearImgs = $(".year-img-wrap");

    // 1번 이미지는 페이지 접속 시 표시
    $yearImgs.css("opacity", 0);
    $yearImgs.eq(0).css("opacity", 1);

    $yearBtns.on("mouseenter", function () {

        const index = $yearBtns.index(this);

        // 전체 이미지 숨김
        $yearImgs.stop(true, true).animate({
            opacity: 0
        }, 200);

        // 선택한 이미지 표시
        $yearImgs.eq(index)
            .stop(true, true)
            .animate({
                opacity: 1
            }, 300);

    });

});


/* 문제 제기 =============================================================== */


gsap.registerPlugin(ScrollTrigger);

$(function () {

    const solutionSec = document.querySelector(".solution-sec");
    const solutionImg = document.querySelector(".solution-img-wrap");

    function solutionAnimation() {

        const secHeight = solutionSec.offsetHeight;

        // 이미지 초기 위치
        gsap.set(solutionImg, {
            y: secHeight,
            autoAlpha: 0
        });

        /*
        이미지가 이동해야 하는 거리

        시작:
        solution-img-wrap bottom
        ↓
        화면 아래

        종료:
        solution-img-wrap bottom
        ↓
        화면 중앙
        */

        const imgRect = solutionImg.getBoundingClientRect();
        const screenCenter = window.innerHeight / 2;

        const moveDistance = imgRect.bottom - screenCenter - 1500;

        gsap.timeline({
            scrollTrigger: {
                trigger: solutionSec,

                // solution-sec 중앙 = 화면 중앙
                start: "center center",

                // 이미지 bottom = 화면 중앙
                end: "+=" + moveDistance,

                pin: true,
                pinSpacing: true,

                scrub: true,

                invalidateOnRefresh: true,

                onEnter: function () {

                    gsap.set(solutionImg, {
                        autoAlpha: 1
                    });

                },

                onLeaveBack: function () {

                    gsap.set(solutionImg, {
                        autoAlpha: 0
                    });

                }
            }
        })

            .to(solutionImg, {
                y: -moveDistance,
                ease: "none"
            });

    }

    solutionAnimation();

});


/* 해결책 =============================================================== */

$(function () {

    let current = 0;

    const $slider = $(".philosophy-slider-wrap");
    const $slides = $slider.find("img");

    const $prevBtn = $(".page-btn-wrap button").eq(0);
    const $nextBtn = $(".page-btn-wrap button").eq(1);

    const $pagination = $(".page-pagination span");


    // =========================
    // 다음 버튼
    // =========================

    $nextBtn.on("click", function () {

        current++;

        // 3번 → 1번
        if (current >= $slides.length) {
            current = 0;
        }

        $slides.css(
            "transform",
            "translateX(-" + (current * 100) + "%)"
        );

        $pagination
            .removeClass("active")
            .eq(current)
            .addClass("active");

    });


    // =========================
    // 이전 버튼
    // =========================

    $prevBtn.on("click", function () {

        current--;

        // 1번 → 3번
        if (current < 0) {
            current = $slides.length - 1;
        }

        $slides.css(
            "transform",
            "translateX(-" + (current * 100) + "%)"
        );

        $pagination
            .removeClass("active")
            .eq(current)
            .addClass("active");

    });

});



/* 기준 =============================================================== */

$(function () {

    const $wrap = $(".standard-card-wrap");
    const $card = $(".standard-card");

    const $prevBtn = $(".slider-pagenation button").eq(0);
    const $nextBtn = $(".slider-pagenation button").eq(1);
    const $current = $(".page-number span").eq(0);

    let current = 0;
    let moving = false;

    let startX = 0;
    let dragX = 0;
    let isDragging = false;


    // =========================
    // 카드 이동 거리
    // =========================

    function getMoveWidth() {

        const cardWidth = $card.find("img").eq(0).outerWidth();
        const gap = parseFloat($card.css("gap")) || 0;

        return cardWidth + gap;
    }


    // =========================
    // 숫자 변경
    // =========================

    function updateNumber() {

        $current.text(current + 1);

    }


    // =========================
    // 다음
    // =========================

    function nextSlide() {

        if (moving) return;

        moving = true;

        const moveWidth = getMoveWidth();

        current++;

        if (current >= $card.find("img").length) {
            current = 0;
        }

        updateNumber();

        gsap.to($wrap, {

            x: -moveWidth,

            duration: 0.6,

            ease: "power2.out",

            onComplete: function () {

                $card.append(
                    $card.find("img").first()
                );

                gsap.set($wrap, {
                    x: 0
                });

                moving = false;

            }

        });

    }


    // =========================
    // 이전
    // =========================

    function prevSlide() {

        if (moving) return;

        moving = true;

        const moveWidth = getMoveWidth();

        $card.prepend(
            $card.find("img").last()
        );

        gsap.set($wrap, {
            x: -moveWidth
        });

        current--;

        if (current < 0) {
            current = $card.find("img").length - 1;
        }

        updateNumber();

        gsap.to($wrap, {

            x: 0,

            duration: 0.6,

            ease: "power2.out",

            onComplete: function () {

                moving = false;

            }

        });

    }


    // =========================
    // Button
    // =========================

    $nextBtn.on("click", function () {
        nextSlide();
    });

    $prevBtn.on("click", function () {
        prevSlide();
    });


    // =========================
    // Drag Start
    // =========================

    $wrap.on("mousedown", function (e) {

        if (moving) return;

        isDragging = true;

        startX = e.clientX;
        dragX = 0;

        gsap.killTweensOf($wrap);

        e.preventDefault();

    });


    // =========================
    // Drag Move
    // =========================

    $(document).on("mousemove", function (e) {

        if (!isDragging) return;

        dragX = e.clientX - startX;

        gsap.set($wrap, {
            x: dragX
        });

    });


    // =========================
    // Drag End
    // =========================

    $(document).on("mouseup", function () {

        if (!isDragging) return;

        isDragging = false;

        const moveWidth = getMoveWidth();

        // -------------------------
        // 다음
        // -------------------------

        if (dragX < -moveWidth * 0.2) {

            moving = true;

            current++;

            if (current >= $card.find("img").length) {
                current = 0;
            }

            updateNumber();

            gsap.to($wrap, {

                x: -moveWidth,

                duration: 0.4,

                ease: "power2.out",

                onComplete: function () {

                    $card.append(
                        $card.find("img").first()
                    );

                    gsap.set($wrap, {
                        x: 0
                    });

                    moving = false;

                }

            });

        }

        // -------------------------
        // 이전
        // -------------------------

        else if (dragX > moveWidth * 0.2) {

            moving = true;

            $card.prepend(
                $card.find("img").last()
            );

            gsap.set($wrap, {
                x: dragX - moveWidth
            });

            current--;

            if (current < 0) {
                current = $card.find("img").length - 1;
            }

            updateNumber();

            gsap.to($wrap, {

                x: 0,

                duration: 0.4,

                ease: "power2.out",

                onComplete: function () {

                    moving = false;

                }

            });

        }

        // -------------------------
        // 이동량 부족
        // -------------------------

        else {

            gsap.to($wrap, {

                x: 0,

                duration: 0.3,

                ease: "power2.out"

            });

        }

        dragX = 0;

    });


    // =========================
    // Touch Start
    // =========================

    $wrap.on("touchstart", function (e) {

        if (moving) return;

        isDragging = true;

        startX =
            e.originalEvent.touches[0].clientX;

        dragX = 0;

        gsap.killTweensOf($wrap);

    });


    // =========================
    // Touch Move
    // =========================

    $wrap.on("touchmove", function (e) {

        if (!isDragging) return;

        dragX =
            e.originalEvent.touches[0].clientX - startX;

        gsap.set($wrap, {
            x: dragX
        });

    });


    // =========================
    // Touch End
    // =========================

    $wrap.on("touchend", function () {

        if (!isDragging) return;

        isDragging = false;

        const moveWidth = getMoveWidth();

        if (dragX < -moveWidth * 0.2) {

            nextSlide();

        } else if (dragX > moveWidth * 0.2) {

            prevSlide();

        } else {

            gsap.to($wrap, {
                x: 0,
                duration: 0.3,
                ease: "power2.out"
            });

        }

        dragX = 0;

    });

});