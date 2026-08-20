$(document).ready(function () {

    var SLIDE_MS = 600;
    var $pcPopupWrap = $(".recipe-popup-wrap");
    var $mobilePopupWrap = $(".mobile-recipe-popup-wrap");
    var $body = $("body");
    var $html = $("html");
    var $lists = $(".recipe-list");
    var $slides = $(".slide");
    var $btnWrap = $(".slide-btn-wrap");
    var $slideContents = $(".slide-contents");
    var menuNodes = $(".slide-menu").get();
    var totalMenus = menuNodes.length;
    var openedIndex = null;
    var openedType = null;
    var currentIndex = 0;
    var isAnimating = false;
    var scrollTop = 0;
    var popupResizeTimer = null;
    var slideResizeTimer = null;
    var swipeStartX = 0;
    var swipeStartY = 0;
    var swipeActive = false;
    var swipeLocked = false;
    var swipePointerId = null;

    function getViewportType() {
        var w = window.innerWidth;
        if (w <= 767) return "mobile";
        if (w <= 1024) return "tablet";
        return "desktop";
    }

    function getPopupWrap(type) {
        return type === "mobile" ? $mobilePopupWrap : $pcPopupWrap;
    }

    function getMenuIndex(el) {
        return menuNodes.indexOf(el);
    }

    function getVisibleMenu() {
        return $(".slide.active").children(".slide-menu").get(0);
    }

    function wrapIndex(index) {
        return ((index % totalMenus) + totalMenus) % totalMenus;
    }

    function syncCurrentIndex() {
        var el = getVisibleMenu();
        if (!el) return;
        currentIndex = getMenuIndex(el);
    }

    function syncCategory() {
        var el = getVisibleMenu();
        if (!el) return;
        var cat = $slides.index($(el).closest(".slide"));
        $lists.removeClass("active").eq(cat).addClass("active");
        $slides.removeClass("active").eq(cat).addClass("active");
    }

    function syncSlideChrome() {
        var el = getVisibleMenu();
        if (!el) return;
        var bg = window.getComputedStyle(el).backgroundColor;
        if (getViewportType() === "desktop") {
            $btnWrap.css("background-color", "");
            $slideContents.css("background-color", "");
            return;
        }
        $btnWrap.css("background-color", bg);
        $slideContents.css("background-color", bg);
    }

    function syncAll() {
        syncCurrentIndex();
        syncCategory();
        syncSlideChrome();
    }

    function clearTrackMotion($track) {
        if (!$track || !$track.length) return;
        $track.css({
            transition: "none",
            transform: "translateX(0)"
        });
        $track.children(".slide-menu").css("margin-left", "");
    }

    function finishSlide(index) {
        currentIndex = index;
        syncCategory();
        syncSlideChrome();
        isAnimating = false;
    }

    function animateSameTrack($track, dir, nextIndex) {
        if (dir > 0) {
            $track.css("transition", "transform " + SLIDE_MS + "ms ease");
            $track.css("transform", "translateX(-100%)");
            window.setTimeout(function () {
                $track.css("transition", "none");
                $track.children(".slide-menu").first().appendTo($track);
                $track.css("transform", "translateX(0)");
                finishSlide(nextIndex);
            }, SLIDE_MS);
            return;
        }

        var $last = $track.children(".slide-menu").last();
        $track.css("transition", "none");
        $last.prependTo($track);
        $track.css("transform", "translateX(-100%)");
        $track[0].offsetWidth;
        $track.css("transition", "transform " + SLIDE_MS + "ms ease");
        $track.css("transform", "translateX(0)");
        window.setTimeout(function () {
            $track.css("transition", "none");
            finishSlide(nextIndex);
        }, SLIDE_MS);
    }

    function placeMenuFirst($track, menuEl) {
        var $menu = $(menuEl);
        if ($track.children(".slide-menu").get(0) !== menuEl) {
            $track.prepend($menu);
        }
    }

    function animateOtherTrack($from, $to, dir, nextIndex) {
        var $contents = $slideContents;
        var fromHeight = $from.outerHeight();

        placeMenuFirst($to, menuNodes[nextIndex]);
        $contents.css("height", fromHeight + "px");

        $to.addClass("active");
        $to.css({
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transition: "none",
            transform: dir > 0 ? "translateX(100%)" : "translateX(-100%)"
        });
        $from.css({
            position: "relative",
            transition: "none",
            transform: "translateX(0)"
        });

        $from[0].offsetWidth;
        $to[0].offsetWidth;

        $from.css({
            transition: "transform " + SLIDE_MS + "ms ease",
            transform: dir > 0 ? "translateX(-100%)" : "translateX(100%)"
        });
        $to.css({
            transition: "transform " + SLIDE_MS + "ms ease",
            transform: "translateX(0)"
        });

        window.setTimeout(function () {
            $from.removeClass("active").css({
                position: "",
                transition: "none",
                transform: "translateX(0)"
            });
            $to.css({
                position: "",
                transition: "none",
                transform: "translateX(0)"
            });
            $contents.css("height", "");
            finishSlide(nextIndex);
        }, SLIDE_MS);
    }

    function goToSlide(index, direction) {
        if (isAnimating || !totalMenus) return;

        var nextIndex = wrapIndex(index);
        if (nextIndex === currentIndex) return;

        var dir = direction;
        if (!dir) {
            if (currentIndex === 0 && nextIndex === totalMenus - 1) dir = -1;
            else if (currentIndex === totalMenus - 1 && nextIndex === 0) dir = 1;
            else dir = nextIndex > currentIndex ? 1 : -1;
        }

        var $fromMenu = $(menuNodes[currentIndex]);
        var $toMenu = $(menuNodes[nextIndex]);
        var $fromSlide = $fromMenu.closest(".slide");
        var $toSlide = $toMenu.closest(".slide");

        isAnimating = true;

        if ($fromSlide[0] === $toSlide[0]) {
            animateSameTrack($fromSlide, dir, nextIndex);
            return;
        }

        animateOtherTrack($fromSlide, $toSlide, dir, nextIndex);
    }

    function lockBody() {
        scrollTop = $(window).scrollTop();
        $html.css("overflow-y", "scroll");
        $body.css({
            position: "fixed",
            top: -scrollTop,
            left: 0,
            width: "100%"
        });
    }

    function unlockBody() {
        $body.css({
            position: "",
            top: "",
            left: "",
            width: ""
        });
        $html.css("overflow-y", "");
        $(window).scrollTop(scrollTop);
    }

    function hideAllPopups() {
        $pcPopupWrap.hide();
        $mobilePopupWrap.hide();
        $pcPopupWrap.find(".popup").hide();
        $mobilePopupWrap.find(".popup").hide();
    }

    function openRecipePopup(index) {
        var type = getViewportType();
        var $wrap = getPopupWrap(type);
        var $popup = $wrap.find(".popup").eq(index);

        if (!$popup.length) return;

        var alreadyOpen = openedIndex !== null;

        hideAllPopups();

        if (!alreadyOpen) {
            lockBody();
        }

        $popup.css("display", "flex");
        $wrap.css("display", "flex");

        openedIndex = index;
        openedType = type;
    }

    function closeRecipePopup() {
        if (openedIndex === null) {
            hideAllPopups();
            unlockBody();
            return;
        }

        var $wrap = getPopupWrap(openedType);
        var $popup = $wrap.find(".popup").filter(":visible");

        $popup.stop(true, true).fadeOut(300, function () {
            hideAllPopups();
            openedIndex = null;
            openedType = null;
            unlockBody();
        });
    }

    function syncOpenPopupToViewport() {
        if (openedIndex === null) return;

        var type = getViewportType();
        if (type === openedType) return;

        openRecipePopup(openedIndex);
    }

    function resetSlideTrack() {
        var $track = $(".slide.active");
        if (!$track.length) return;
        clearTrackMotion($track);
        $slides.not(".active").each(function () {
            clearTrackMotion($(this));
        });
        isAnimating = false;
        syncAll();
    }

    function swipeThreshold() {
        return Math.max(48, Math.min(72, window.innerWidth * 0.14));
    }

    function onSwipePointerDown(e) {
        if (getViewportType() === "desktop") return;
        if (isAnimating) return;
        if (openedIndex !== null) return;
        if ($(e.target).closest("button").length) return;

        swipeActive = true;
        swipeLocked = false;
        swipePointerId = e.pointerId;
        swipeStartX = e.clientX;
        swipeStartY = e.clientY;
    }

    function onSwipePointerMove(e) {
        if (!swipeActive || swipePointerId !== e.pointerId) return;

        var dx = e.clientX - swipeStartX;
        var dy = e.clientY - swipeStartY;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
            e.preventDefault();
        }
    }

    function onSwipePointerUp(e) {
        if (!swipeActive || swipePointerId !== e.pointerId) return;

        var dx = e.clientX - swipeStartX;
        var dy = e.clientY - swipeStartY;
        swipeActive = false;
        swipePointerId = null;

        if (isAnimating) return;
        if (Math.abs(dx) < swipeThreshold()) return;
        if (Math.abs(dx) < Math.abs(dy)) return;

        swipeLocked = true;
        if (dx < 0) {
            goToSlide(currentIndex + 1, 1);
        } else {
            goToSlide(currentIndex - 1, -1);
        }
    }

    function firstMenuOfSlide($slide) {
        var node = $slide[0];
        var i;

        for (i = 0; i < totalMenus; i++) {
            if ($(menuNodes[i]).closest(".slide")[0] === node) {
                return menuNodes[i];
            }
        }

        return $slide.children(".slide-menu").get(0);
    }

    $lists.on("click", function () {
        if (isAnimating) return;

        var i = $(this).index();
        var $targetSlide = $slides.eq(i);
        var firstMenu = firstMenuOfSlide($targetSlide);

        $lists.removeClass("active").eq(i).addClass("active");
        $slides.removeClass("active").eq(i).addClass("active");
        if (firstMenu) {
            $targetSlide.prepend(firstMenu);
        }
        clearTrackMotion($targetSlide);
        currentIndex = getMenuIndex(firstMenu);
        syncSlideChrome();
    });

    $btnWrap.find("button").eq(0).on("click", function () {
        goToSlide(currentIndex - 1, -1);
    });

    $btnWrap.find("button").eq(1).on("click", function () {
        goToSlide(currentIndex + 1, 1);
    });

    $(".recipe-btn").on("click", function (e) {
        if (swipeLocked) {
            e.preventDefault();
            swipeLocked = false;
            return;
        }

        var $menu = $(this).closest(".slide-menu");
        var index = getMenuIndex($menu.get(0));
        if (index < 0) index = currentIndex;
        openRecipePopup(index);
    });

    $slideContents.on("pointerdown", onSwipePointerDown);
    $slideContents.on("pointermove", onSwipePointerMove);
    $slideContents.on("pointerup pointercancel", onSwipePointerUp);

    $pcPopupWrap.on("click", ".close-btn", function (e) {
        e.stopPropagation();
        closeRecipePopup();
    });

    $mobilePopupWrap.on("click", ".close-btn", function (e) {
        e.stopPropagation();
        closeRecipePopup();
    });

    $pcPopupWrap.on("click", function (e) {
        if (e.target === this) closeRecipePopup();
    });

    $mobilePopupWrap.on("click", function (e) {
        if (e.target === this) closeRecipePopup();
    });

    $(window).on("resize", function () {
        clearTimeout(slideResizeTimer);
        slideResizeTimer = setTimeout(resetSlideTrack, 50);

        clearTimeout(popupResizeTimer);
        popupResizeTimer = setTimeout(syncOpenPopupToViewport, 80);
    });

    syncAll();

});
