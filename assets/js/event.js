$(function () {

    const $wrap = $(".event-wrap");
    const $content = $(".event-content");
    const $prev = $(".prev-btn");
    const $next = $(".next-btn");
    const SLIDE_DURATION = 600;

    let page = 0;
    let moving = false;
    let resizeTimer = null;

    function getViewportType() {
        const width = window.innerWidth;

        if (width <= 767) return "mobile";
        if (width <= 1024) return "tablet";
        return "desktop";
    }

    function getVisibleCardCount() {
        const type = getViewportType();

        if (type === "mobile") return 2;
        if (type === "tablet") return 3;

        const cardWidth = getCardWidth();
        const gap = getCardGap();
        const viewport = $content.innerWidth();

        if (!cardWidth) return 3;

        return Math.max(1, Math.round((viewport + gap) / (cardWidth + gap)));
    }

    function getVisibleItems() {
        return $wrap.find(".event-list li").filter(function () {
            const $item = $(this);
            const $group = $item.closest(".event-soon, .event-ing, .event-end");

            return $item.is(":visible") && $group.is(":visible");
        });
    }

    function getCardWidth() {
        const $item = getVisibleItems().first();

        return $item.length ? $item.outerWidth() : 0;
    }

    function getCardGap() {
        const $list = $wrap.find(".event-list:visible").first();

        if ($list.length) {
            const listGap = parseFloat(window.getComputedStyle($list[0]).gap);

            if (!isNaN(listGap) && listGap > 0) return listGap;
        }

        return parseFloat(window.getComputedStyle($wrap[0]).gap) || 0;
    }

    function getPageDistance() {
        return getVisibleCardCount() * (getCardWidth() + getCardGap());
    }

    function getMaxPage() {
        const total = getVisibleItems().length;
        const visibleCount = getVisibleCardCount();

        return Math.max(0, Math.ceil(total / visibleCount) - 1);
    }

    function getMaxLeft() {
        return Math.max(0, $wrap.outerWidth() - $content.innerWidth());
    }

    function getPageLeft(targetPage) {
        const maxLeft = getMaxLeft();
        const left = targetPage * getPageDistance();

        return Math.min(Math.max(0, left), maxLeft);
    }

    function updateButtons() {
        const maxPage = getMaxPage();

        $prev.toggleClass("active", page > 0);
        $next.toggleClass("active", page < maxPage);
    }

    function goTo(targetPage, animate) {
        const maxPage = getMaxPage();

        page = Math.max(0, Math.min(targetPage, maxPage));

        const left = -getPageLeft(page);

        $wrap.stop(true, true);

        if (animate) {
            moving = true;
            $wrap.animate(
                { left: left },
                SLIDE_DURATION,
                function () {
                    moving = false;
                    updateButtons();
                }
            );
            return;
        }

        $wrap.css("left", left);
        updateButtons();
    }

    function slide(dir) {
        if (moving) return;
        if ((dir < 0 && page <= 0) || (dir > 0 && page >= getMaxPage())) return;

        goTo(page + dir, true);
    }

    $prev.on("click", function () {
        slide(-1);
    });

    $next.on("click", function () {
        slide(1);
    });

    const $filter = $(".filter-wrap button");
    const $groups = $(".event-wrap").children();

    $filter.on("click", function () {
        if (moving) return;

        const index = $filter.index(this);

        $filter.removeClass("active");
        $(this).addClass("active");

        $groups.hide();

        if (index === 0) {
            $groups.show();
        } else {
            $groups.eq(index - 1).show();
        }

        goTo(0, false);
    });

    $(window).on("resize.eventSlider", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            moving = false;
            $wrap.stop(true, true);
            goTo(page, false);
        }, 150);
    });

    $groups.show();
    goTo(0, false);

    $(window).on("load.eventSlider", function () {
        goTo(page, false);
    });

});
