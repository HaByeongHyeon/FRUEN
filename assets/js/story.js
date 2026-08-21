/* 기업 연혁 =============================================================== */
$(function () {

    const $yearBtns = $(".year-text-wrap > span");
    const $yearImgs = $(".year-img-wrap");
    const isDesktop = () => window.innerWidth >= 1025;

    function syncHistoryDisplay() {
        $yearImgs.stop(true, true);

        if (isDesktop()) {
            $yearImgs.css("opacity", 0);
            $yearImgs.eq(0).css("opacity", 1);
            return;
        }

        $yearImgs.css("opacity", 1);
    }

    syncHistoryDisplay();

    $yearBtns.on("mouseenter", function () {

        if (!isDesktop()) {
            return;
        }

        const index = $yearBtns.index(this);

        $yearImgs.stop(true, true).animate({
            opacity: 0
        }, 200);

        $yearImgs.eq(index)
            .stop(true, true)
            .animate({
                opacity: 1
            }, 300);

    });

    let wasDesktop = isDesktop();

    $(window).on("resize.storyHistory", function () {
        const nowDesktop = isDesktop();

        if (nowDesktop !== wasDesktop) {
            syncHistoryDisplay();
            wasDesktop = nowDesktop;
        }
    });

});


/* 문제 제기 =============================================================== */


gsap.registerPlugin(ScrollTrigger);

$(function () {

    const solutionSec = document.querySelector(".solution-sec");
    const solutionImg = document.querySelector(".solution-img-wrap");

    if (!solutionSec || !solutionImg) {
        return;
    }

    function getMoveDistance() {
        const secHeight = solutionSec.offsetHeight;
        const imgHeight = solutionImg.scrollHeight;
        const screenCenter = window.innerHeight / 2;

        let sectionTop = 0;
        let el = solutionSec;

        while (el) {
            sectionTop += el.offsetTop;
            el = el.offsetParent;
        }

        return Math.max(sectionTop + secHeight + imgHeight - screenCenter - 1500, 400);
    }

    gsap.set(solutionImg, {
        y: () => solutionSec.offsetHeight,
        autoAlpha: 0
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: solutionSec,
            start: "center center",
            end: () => "+=" + getMoveDistance(),
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
    }).to(solutionImg, {
        y: () => -getMoveDistance(),
        ease: "none"
    });

    $(window).on("resize.storySolution", function () {
        ScrollTrigger.refresh();
    });

    $(window).on("load.storySolution", function () {
        ScrollTrigger.refresh();
    });

});


/* 해결책 =============================================================== */

$(function () {

    let current = 0;

    const $slider = $(".philosophy-slider-wrap");
    const $slides = $slider.find("img");

    const $prevBtn = $(".page-btn-wrap button").eq(0);
    const $nextBtn = $(".page-btn-wrap button").eq(1);

    const $pagination = $(".page-pagination span");

    const isDesktop = () => window.innerWidth >= 1025;

    function goTo(index) {
        current = (index + $slides.length) % $slides.length;

        $slides.css(
            "transform",
            "translateX(-" + (current * 100) + "%)"
        );

        $pagination
            .removeClass("active")
            .eq(current)
            .addClass("active");
    }

    $nextBtn.on("click", function () {
        goTo(current + 1);
    });

    $prevBtn.on("click", function () {
        goTo(current - 1);
    });

    let swipeActive = false;
    let swipePointerId = null;
    let swipeStartX = 0;
    let swipeStartY = 0;

    function swipeThreshold() {
        return Math.max(48, Math.min(72, window.innerWidth * 0.14));
    }

    $slider.on("pointerdown", function (e) {
        if (isDesktop()) return;
        if ($(e.target).closest("button").length) return;

        swipeActive = true;
        swipePointerId = e.pointerId;
        swipeStartX = e.clientX;
        swipeStartY = e.clientY;
    });

    $slider.on("pointermove", function (e) {
        if (!swipeActive || swipePointerId !== e.pointerId) return;

        const dx = e.clientX - swipeStartX;
        const dy = e.clientY - swipeStartY;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
            e.preventDefault();
        }
    });

    $slider.on("pointerup pointercancel", function (e) {
        if (!swipeActive || swipePointerId !== e.pointerId) return;

        const dx = e.clientX - swipeStartX;
        const dy = e.clientY - swipeStartY;

        swipeActive = false;
        swipePointerId = null;

        if (Math.abs(dx) < swipeThreshold()) return;
        if (Math.abs(dx) < Math.abs(dy)) return;

        if (dx < 0) {
            goTo(current + 1);
        } else {
            goTo(current - 1);
        }
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

    let swipeActive = false;
    let swipePointerId = null;
    let swipeStartX = 0;
    let swipeStartY = 0;

    const isDesktop = () => window.innerWidth >= 1025;

    function swipeThreshold() {
        return Math.max(48, Math.min(72, window.innerWidth * 0.14));
    }

    const $cardWrap = $(".standard-card-wrap");

    $cardWrap.on("pointerdown", function (e) {
        if (isDesktop()) return;
        if (moving) return;
        if ($(e.target).closest("button").length) return;

        swipeActive = true;
        swipePointerId = e.pointerId;
        swipeStartX = e.clientX;
        swipeStartY = e.clientY;
    });

    $cardWrap.on("pointermove", function (e) {
        if (!swipeActive || swipePointerId !== e.pointerId) return;

        const dx = e.clientX - swipeStartX;
        const dy = e.clientY - swipeStartY;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
            e.preventDefault();
        }
    });

    $cardWrap.on("pointerup pointercancel", function (e) {
        if (!swipeActive || swipePointerId !== e.pointerId) return;

        const dx = e.clientX - swipeStartX;
        const dy = e.clientY - swipeStartY;

        swipeActive = false;
        swipePointerId = null;

        if (moving) return;
        if (Math.abs(dx) < swipeThreshold()) return;
        if (Math.abs(dx) < Math.abs(dy)) return;

        if (dx < 0) {
            slide(1);
        } else {
            slide(-1);
        }
    });

    update();

});