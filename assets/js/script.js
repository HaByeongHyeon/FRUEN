// slider =======================================

$(function () {
    var sec = document.querySelector(".slider-sec");
    if (!sec) return;

    var slides = Array.prototype.filter.call(sec.children, function (el) {
        return el.classList && el.classList.contains("slider-wrap");
    });
    var total = slides.length;
    if (total < 2) return;

    var currentIndex = 0;
    var isAnimating = false;

    var DUR_BG = 0.9;
    var DUR_CUP = 0.7;
    var DUR_FRUIT = 0.6;
    var DUR_TEXT = 0.4;
    var CONTENT_DELAY = 0.22;

    var EASE_BG = "power2.inOut";
    var EASE_CUP = "sine.inOut";
    var EASE_FRUIT = "power3.out";
    var EASE_TEXT = "power2.out";

    var SWIPE_THRESHOLD = 56;

    function fruitFromY() {
        return Math.min(140, Math.max(72, window.innerHeight * 0.12));
    }

    function textFromY() {
        return Math.min(56, Math.max(32, window.innerHeight * 0.05));
    }

    function parts(slide) {
        return {
            slide: slide,
            cup: slide.querySelector(".main-cup-img img") || slide.querySelector(".main-cup-img"),
            fruit: slide.querySelector(".fruit-effect"),
            text: slide.querySelector(".slider-text-wrap")
        };
    }

    function setBgX(slide, value) {
        slide.style.setProperty("--bg-x", String(value));
    }

    function tweenBg(tl, slide, fromX, toX) {
        var state = { x: fromX };
        setBgX(slide, fromX);
        tl.to(state, {
            x: toX,
            duration: DUR_BG,
            ease: EASE_BG,
            onUpdate: function () {
                setBgX(slide, state.x);
            }
        }, 0);
    }

    function restSlide(slide, isActive) {
        var el = parts(slide);

        setBgX(slide, 0);
        gsap.set(el.cup, { opacity: isActive ? 1 : 0, force3D: false });
        gsap.set(el.fruit, {
            y: isActive ? 0 : fruitFromY(),
            opacity: isActive ? 1 : 0
        });
        gsap.set(el.text, {
            y: isActive ? 0 : textFromY(),
            opacity: isActive ? 1 : 0,
            force3D: false
        });

        slide.classList.toggle("is-active", isActive);
        slide.classList.remove("is-transition");
    }

    slides.forEach(function (slide, i) {
        restSlide(slide, i === currentIndex);
    });
    sec.classList.add("is-ready");

    function goToSlide(index, direction) {
        if (isAnimating) return;

        var nextIndex = ((index % total) + total) % total;
        if (nextIndex === currentIndex) return;

        isAnimating = true;

        var current = parts(slides[currentIndex]);
        var next = parts(slides[nextIndex]);
        var bgOut = direction === "next" ? -100 : 100;
        var bgInFrom = direction === "next" ? 100 : -100;
        var fruitY = fruitFromY();
        var textY = textFromY();

        setBgX(next.slide, bgInFrom);
        gsap.set(next.cup, { opacity: 0, force3D: false });
        gsap.set(next.fruit, { y: fruitY, opacity: 0 });
        gsap.set(next.text, { y: textY, opacity: 0, force3D: false });
        gsap.set(current.text, { opacity: 0, y: 0, force3D: false });
        gsap.set(current.fruit, { opacity: 0 });

        current.slide.classList.add("is-transition");
        next.slide.classList.add("is-transition");

        var tl = gsap.timeline({
            defaults: { overwrite: "auto" },
            onComplete: function () {
                slides.forEach(function (slide, i) {
                    restSlide(slide, i === nextIndex);
                });
                currentIndex = nextIndex;
                isAnimating = false;
            }
        });

        tweenBg(tl, current.slide, 0, bgOut);
        tweenBg(tl, next.slide, bgInFrom, 0);

        tl.addLabel("content", CONTENT_DELAY);

        tl.to(current.cup, {
            opacity: 0,
            duration: DUR_CUP,
            ease: EASE_CUP,
            force3D: false
        }, "content");

        tl.to(next.cup, {
            opacity: 1,
            duration: DUR_CUP,
            ease: EASE_CUP,
            force3D: false
        }, "content");

        tl.to(next.fruit, {
            y: 0,
            opacity: 1,
            duration: DUR_FRUIT,
            ease: EASE_FRUIT
        }, "content");

        tl.to(next.text, {
            y: 0,
            opacity: 1,
            duration: DUR_TEXT,
            ease: EASE_TEXT,
            force3D: false
        }, "content");
    }

    $(sec).on("click", ".next-btn", function () {
        goToSlide(currentIndex + 1, "next");
    });

    $(sec).on("click", ".prev-btn", function () {
        goToSlide(currentIndex - 1, "prev");
    });

    var swipeStartX = 0;
    var swipeStartY = 0;
    var swipePointerId = null;

    sec.addEventListener("pointerdown", function (e) {
        if (isAnimating) return;
        if (e.pointerType === "mouse") return;

        swipePointerId = e.pointerId;
        swipeStartX = e.clientX;
        swipeStartY = e.clientY;
    });

    sec.addEventListener("pointerup", function (e) {
        if (swipePointerId !== e.pointerId) return;
        swipePointerId = null;
        if (isAnimating) return;

        var dx = e.clientX - swipeStartX;
        var dy = e.clientY - swipeStartY;

        if (Math.abs(dx) < SWIPE_THRESHOLD) return;
        if (Math.abs(dx) <= Math.abs(dy)) return;

        if (dx < 0) {
            goToSlide(currentIndex + 1, "next");
        } else {
            goToSlide(currentIndex - 1, "prev");
        }
    });

    sec.addEventListener("pointercancel", function (e) {
        if (swipePointerId === e.pointerId) swipePointerId = null;
    });

    window.addEventListener("resize", function () {
        if (isAnimating) return;

        slides.forEach(function (slide, i) {
            restSlide(slide, i === currentIndex);
        });
    });
});


gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
});


// History ======================================================

(function () {
    var section = document.querySelector(".history-sec");
    if (!section) return;

    var wrap = section.querySelector(".history-img-wrap");
    var track = section.querySelector(".history-track");
    var progress = section.querySelector(".history-progress");
    var svg = section.querySelector(".history-progress-svg");
    var pointer = section.querySelector(".scrollbar-pointer");
    var bar = section.querySelector(".progress-bar");
    var texts = section.querySelectorAll(".history-text-list");
    var images = track ? track.querySelectorAll("img") : [];
    var total = texts.length;

    if (!wrap || !track || !progress || !pointer || total < 2 || images.length < total) return;

    var mm = gsap.matchMedia();
    var pointerStops = [0.11, 0.31, 0.51, 0.705, 1];
    var STEP_DUR = 0.7;
    var STEP_EASE = "power2.inOut";
    var WHEEL_MIN = 12;
    var SWIPE_MIN = 56;
    var PC_QUERY = "(min-width: 1025px)";

    function lastIndex() {
        return total - 1;
    }

    function getImageWidth() {
        var width = images[0].getBoundingClientRect().width;

        return width > 1 ? width : wrap.clientWidth;
    }

    function isHistoryPc() {
        return window.innerWidth >= 1025;
    }

    function getPointerStop(index) {
        var stop = pointerStops[index];

        if (typeof stop !== "number") stop = pointerStops[pointerStops.length - 1];

        return stop;
    }

    function getTrackX(index) {
        return -getImageWidth() * index;
    }

    function getPointerMax() {
        return Math.max(0, progress.clientWidth - pointer.offsetWidth);
    }

    function getTouchProgressLayout() {
        var progressRect = progress.getBoundingClientRect();
        var svgRect = (svg || progress).getBoundingClientRect();

        return {
            left: svgRect.left - progressRect.left,
            width: svgRect.width,
            pointerWidth: pointer.offsetWidth || 0
        };
    }

    function getPointerX(index) {
        var stop = getPointerStop(index);
        var layout;
        var travel;

        if (isHistoryPc()) {
            return getPointerMax() * stop;
        }

        layout = getTouchProgressLayout();
        travel = Math.max(0, layout.width - layout.pointerWidth);

        return layout.left + travel * stop;
    }

    function getBarLength() {
        return bar && typeof bar.getTotalLength === "function" ? bar.getTotalLength() : 1920;
    }

    function getBarOffset(index) {
        return getBarLength() * (1 - getPointerStop(index));
    }

    function setActiveText(index) {
        texts.forEach(function (el, i) {
            el.classList.toggle("active", i === index);
        });
    }

    function updateHistoryText(currentIndex) {
        setActiveText(currentIndex);
    }

    function resetHistoryVisual() {
        gsap.set(track, { x: getTrackX(0), y: 0, force3D: false });
        gsap.set(pointer, { x: getPointerX(0), yPercent: -50, y: 0, force3D: false });
        setActiveText(0);

        if (bar) {
            gsap.set(bar, {
                strokeDasharray: getBarLength(),
                strokeDashoffset: getBarOffset(0)
            });
        }
    }

    function destroyHistoryVisual() {
        gsap.set(track, { clearProps: "transform,x,y" });
        gsap.set(pointer, { clearProps: "transform,x,y" });
        setActiveText(0);

        if (bar) {
            gsap.set(bar, { clearProps: "strokeDasharray,strokeDashoffset" });
        }
    }

    resetHistoryVisual();

    function initHistoryPin(triggerEl) {
        var isPinned = false;
        var isAnimating = false;
        var historyTl = null;
        var pinTrigger = null;
        var stepIndex = 0;
        var maxStep = pointerStops.length - 1;

        triggerEl = triggerEl || wrap;

        function buildHistoryTl() {
            var length = getBarLength();
            var i;
            var tlProgress = maxStep ? stepIndex / maxStep : 0;

            if (historyTl) historyTl.kill();

            gsap.set(track, { x: getTrackX(0), y: 0, force3D: false });
            gsap.set(pointer, { x: getPointerX(0), yPercent: -50, y: 0, force3D: false });

            if (bar) {
                gsap.set(bar, {
                    strokeDasharray: length,
                    strokeDashoffset: getBarOffset(0)
                });
            }

            historyTl = gsap.timeline({ paused: true, defaults: { ease: "none" } });

            for (i = 1; i < pointerStops.length; i++) {
                historyTl.to(track, {
                    x: getTrackX(Math.min(i, lastIndex())),
                    y: 0,
                    force3D: false,
                    duration: 1
                }, i - 1);
                historyTl.to(pointer, {
                    x: getPointerX(i),
                    yPercent: -50,
                    y: 0,
                    force3D: false,
                    duration: 1
                }, i - 1);

                if (bar) {
                    historyTl.to(bar, {
                        strokeDasharray: length,
                        strokeDashoffset: getBarLength() * (1 - pointerStops[i]),
                        duration: 1
                    }, i - 1);
                }
            }

            historyTl.progress(tlProgress);
        }

        function applyStep(index, immediate) {
            var tlProgress;

            stepIndex = index;
            tlProgress = maxStep ? index / maxStep : 0;

            updateHistoryText(Math.min(index, lastIndex()));

            if (!historyTl) return;

            gsap.killTweensOf(historyTl);

            if (immediate) {
                historyTl.progress(tlProgress);
                isAnimating = false;
                return;
            }

            isAnimating = true;
            gsap.to(historyTl, {
                progress: tlProgress,
                duration: STEP_DUR,
                ease: STEP_EASE,
                overwrite: true,
                onComplete: function () {
                    isAnimating = false;
                }
            });
        }

        function leavePin(goingDown) {
            isPinned = false;
            isAnimating = false;
            gsap.killTweensOf(historyTl);

            if (!pinTrigger) return;

            window.scrollTo(0, goingDown ? pinTrigger.end + 1 : Math.max(0, pinTrigger.start - 1));
        }

        function goStep(direction) {
            var next = stepIndex + direction;

            if (next < 0) {
                leavePin(false);
                return;
            }

            if (next > maxStep) {
                leavePin(true);
                return;
            }

            applyStep(next, false);
        }

        buildHistoryTl();
        applyStep(0, true);

        pinTrigger = ScrollTrigger.create({
            trigger: triggerEl,
            start: "top top",
            end: function () {
                return "+=" + window.innerHeight * maxStep;
            },
            pin: section,
            pinSpacing: true,
            pinType: "fixed",
            anticipatePin: 0,
            invalidateOnRefresh: true,
            onRefresh: function () {
                buildHistoryTl();
                applyStep(stepIndex, true);
            },
            onToggle: function (self) {
                isPinned = self.isActive;
                section.classList.toggle("is-pinned", self.isActive);
            },
            onEnter: function (self) {
                if (self.direction === 1) applyStep(0, true);
            },
            onEnterBack: function (self) {
                if (self.direction === -1) applyStep(maxStep, true);
            },
            onLeave: function () {
                applyStep(maxStep, true);
            },
            onLeaveBack: function () {
                applyStep(0, true);
            }
        });

        function onWheel(e) {
            if (!isPinned) return;
            if (Math.abs(e.deltaY) < WHEEL_MIN) return;

            e.preventDefault();

            if (isAnimating) return;

            goStep(e.deltaY > 0 ? 1 : -1);
        }

        var swipeStartX = 0;
        var swipeStartY = 0;
        var swipePointerId = null;

        function onPointerDown(e) {
            if (!isPinned) return;
            if (e.pointerType === "mouse") return;

            swipePointerId = e.pointerId;
            swipeStartX = e.clientX;
            swipeStartY = e.clientY;
        }

        function onPointerUp(e) {
            if (swipePointerId !== e.pointerId) return;
            swipePointerId = null;
            if (!isPinned || isAnimating) return;

            var dx = e.clientX - swipeStartX;
            var dy = e.clientY - swipeStartY;

            if (Math.abs(dy) < SWIPE_MIN) return;
            if (Math.abs(dy) <= Math.abs(dx)) return;

            goStep(dy < 0 ? 1 : -1);
        }

        function onPointerCancel(e) {
            if (swipePointerId === e.pointerId) swipePointerId = null;
        }

        function onTouchMove(e) {
            if (!isPinned) return;
            e.preventDefault();
        }

        var resizeTimer = null;

        function onResize() {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(function () {
                ScrollTrigger.refresh();
            }, 120);
        }

        function onImageLoad() {
            ScrollTrigger.refresh();
        }

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        section.addEventListener("pointerdown", onPointerDown);
        section.addEventListener("pointerup", onPointerUp);
        section.addEventListener("pointercancel", onPointerCancel);
        window.addEventListener("resize", onResize);

        images.forEach(function (img) {
            if (img.complete) return;
            img.addEventListener("load", onImageLoad);
        });

        return function () {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchmove", onTouchMove);
            section.removeEventListener("pointerdown", onPointerDown);
            section.removeEventListener("pointerup", onPointerUp);
            section.removeEventListener("pointercancel", onPointerCancel);
            window.removeEventListener("resize", onResize);

            gsap.killTweensOf(historyTl);
            if (historyTl) historyTl.kill();
            if (pinTrigger) pinTrigger.kill();
            section.classList.remove("is-pinned");
            destroyHistoryVisual();
        };
    }

    mm.add(PC_QUERY, function () {
        return initHistoryPin(wrap);
    });

    mm.add("(min-width: 768px) and (max-width: 1024px)", function () {
        return initHistoryPin(track);
    });

    mm.add("(max-width: 767px)", function () {
        return initHistoryPin(section);
    });
})();


// Prove marquee / Brand marquee / SNS marquee ==================

function duplicateMarqueeChildren(selector) {
    var wrap = document.querySelector(selector);
    if (!wrap || wrap.getAttribute("data-marquee") === "1") return;

    var nodes = Array.prototype.slice.call(wrap.children);
    if (!nodes.length) return;

    nodes.forEach(function (node) {
        wrap.appendChild(node.cloneNode(true));
    });

    wrap.setAttribute("data-marquee", "1");
}

duplicateMarqueeChildren(".product-wrap");
duplicateMarqueeChildren(".brand-wrap");
duplicateMarqueeChildren(".sns-wrap");


// Prove countUp =================================================

(function () {
    var proveSec = document.querySelector(".prove-sec");
    if (!proveSec) return;

    var spans = proveSec.querySelectorAll(".count span");
    if (!spans.length) return;

    var items = [];
    var started = false;

    spans.forEach(function (span) {
        var sample = (span.textContent || "").trim();
        var numeric = parseFloat(sample.replace(/,/g, ""));
        if (isNaN(numeric)) return;

        items.push({
            el: span,
            sample: sample,
            target: numeric
        });

        span.textContent = formatCount(0, sample);
    });

    function formatCount(value, sample) {
        var hasComma = sample.indexOf(",") !== -1;
        var decimals = 0;

        if (sample.indexOf(".") !== -1) {
            decimals = (sample.split(".")[1] || "").replace(/\D/g, "").length;
        }

        var rounded = value.toFixed(decimals);

        if (!hasComma) return rounded;

        var parts = rounded.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    function playCountUp() {
        if (started) return;
        started = true;

        items.forEach(function (item) {
            var state = { val: 0 };

            gsap.to(state, {
                val: item.target,
                duration: 0.5,
                ease: "none",
                onUpdate: function () {
                    item.el.textContent = formatCount(state.val, item.sample);
                },
                onComplete: function () {
                    item.el.textContent = item.sample;
                }
            });
        });
    }

    ScrollTrigger.create({
        trigger: proveSec,
        start: "top top",
        once: true,
        onEnter: playCountUp
    });
})();


// Problem ===============================================================

$(function () {
    $(".problem-sec button").on("click", function () {
        location.href = "/brand.html";
    });
});


// Recipe ===============================================================

$(function () {
    $(".icon-wrap button").on("click", function () {
        var i = $(this).closest("li").index();

        $(".icon-wrap button").removeClass("active");
        $(this).addClass("active");

        $(".recipe-img-wrap img").removeClass("active").eq(i).addClass("active");
        $(".recipe-list").removeClass("recipe-active").eq(i).addClass("recipe-active");
    });

    $(".recipe-sec .preview-btn").on("click", function () {
        location.href = "/recipe.html";
    });

    $(".flavor-sec .preview-btn").on("click", function () {
        location.href = "/product.html";
    });
});
