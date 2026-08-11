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

    const $card = $(".standard-card");
    const $cards = $card.find("img");
    const $current = $(".page-number span").eq(0);

    let current = 0;
    let moving = false;

    const moveWidth = () =>
        $cards.eq(0).outerWidth() +
        (parseFloat($card.css("gap")) || 0);

    const update = () => {
        $current.text(current + 1);
    };

    const slide = (direction) => {

        if (moving) return;

        moving = true;

        const width = moveWidth();

        if (direction === 1) {
            current = (current + 1) % $cards.length;

            gsap.to($card, {
                x: -width,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => {
                    $card.append($card.find("img").first());
                    gsap.set($card, { x: 0 });
                    moving = false;
                }
            });

        } else {

            $card.prepend($card.find("img").last());

            gsap.set($card, { x: -width });

            current = (current - 1 + $cards.length) % $cards.length;

            gsap.to($card, {
                x: 0,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => {
                    moving = false;
                }
            });
        }

        update();
    };

    $(".slider-pagenation button").eq(0).on("click", () => slide(-1));
    $(".slider-pagenation button").eq(1).on("click", () => slide(1));

    update();

});