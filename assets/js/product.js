
function getViewportType() {
    const width = window.innerWidth;

    if (width <= 767) return "mobile";
    if (width <= 1024) return "tablet";
    return "desktop";
}


$(function () {

    const $filterBtn = $(".filter-btn");
    const $productLists = $(".product-list");
    const $prev = $(".prev-btn");
    const $next = $(".next-btn");

    const SLIDE_DURATION = 400;
    const SLIDE_EASING = "cubic-bezier(0.22, 0.61, 0.36, 1)";

    let page = 0;
    let moving = false;
    let resizeTimer = null;

    function getCols() {
        return getViewportType() === "mobile" ? 2 : 3;
    }

    function getPageSize() {
        return getViewportType() === "mobile" ? 4 : 6;
    }

    function getActiveList() {
        return $productLists.filter(".active").first();
    }

    function getItems($list) {
        return $list.children(".product-btn");
    }

    function maxPageOf($list) {
        const total = getItems($list).length;
        return Math.max(0, Math.ceil(total / getPageSize()) - 1);
    }

    function getColumnGap($list) {
        return parseFloat(window.getComputedStyle($list[0]).columnGap) || 0;
    }

    function getCardWidth($list) {
        const tracks = window.getComputedStyle($list[0]).gridTemplateColumns
            .split(/\s+/)
            .map(function (track) {
                return parseFloat(track);
            })
            .filter(function (value) {
                return value > 0;
            });

        if (tracks.length) {
            return tracks[0];
        }

        const $item = getItems($list).filter(":visible").first();
        if ($item.length) {
            return $item.outerWidth();
        }

        const $hidden = getItems($list).first();
        const prevDisplay = $hidden.css("display");
        $hidden.css("display", "block");
        const width = $hidden.outerWidth();
        $hidden.css("display", prevDisplay);
        return width;
    }

    function getPageWidth($list) {
        const cols = getCols();
        const gap = getColumnGap($list);

        return getCardWidth($list) * cols + gap * (cols - 1);
    }

    function clearItemPlacement($items) {
        $items.css({
            gridColumn: "",
            gridRow: "",
            width: ""
        });
    }

    function resetTrack($list) {
        clearItemPlacement(getItems($list));

        $list.css({
            transition: "none",
            transform: "translate3d(0, 0, 0)",
            width: "",
            marginLeft: "",
            marginRight: "",
            gridTemplateColumns: ""
        });
    }

    function showActiveList() {
        $productLists.each(function () {
            const $list = $(this);

            resetTrack($list);
            $list.css("display", "");

            if ($list.hasClass("active")) {
                $list.css("display", "grid");
            }
        });
    }

    function render() {
        const $list = getActiveList();
        const $items = getItems($list);
        const pageSize = getPageSize();
        const maxPage = maxPageOf($list);

        if (page > maxPage) page = maxPage;
        if (page < 0) page = 0;

        $items.hide();
        $items
            .slice(page * pageSize, page * pageSize + pageSize)
            .css("display", "block");

        $prev.toggleClass("active", page > 0);
        $next.toggleClass("active", page < maxPage);
    }

    function layoutAdjacentPages($list, fromPage, toPage, dir) {
        const pageSize = getPageSize();
        const cols = getCols();
        const columnGap = getColumnGap($list);
        const cardWidth = getCardWidth($list);
        const pageWidth = getPageWidth($list);
        const $items = getItems($list);
        const $from = $items.slice(fromPage * pageSize, fromPage * pageSize + pageSize);
        const $to = $items.slice(toPage * pageSize, toPage * pageSize + pageSize);
        const $left = dir > 0 ? $from : $to;
        const $right = dir > 0 ? $to : $from;
        const parentWidth = $list.parent().innerWidth();
        const startMargin = Math.max(0, (parentWidth - pageWidth) / 2);

        $items.hide();
        $from.add($to).css({
            display: "block",
            width: cardWidth + "px"
        });

        function place($set, colOffset) {
            $set.each(function (index) {
                this.style.gridColumn = String((index % cols) + 1 + colOffset);
                this.style.gridRow = String(Math.floor(index / cols) + 1);
            });
        }

        place($left, 0);
        place($right, cols);

        $list.css({
            width: pageWidth * 2 + columnGap + "px",
            marginLeft: startMargin + "px",
            marginRight: 0,
            gridTemplateColumns: "repeat(" + (cols * 2) + ", " + cardWidth + "px)"
        });

        return pageWidth + columnGap;
    }

    function slide(dir) {
        if (moving) return;

        const $list = getActiveList();
        const maxPage = maxPageOf($list);
        const nextPage = page + dir;

        if (nextPage < 0 || nextPage > maxPage) return;

        moving = true;

        const distance = layoutAdjacentPages($list, page, nextPage, dir);
        const listEl = $list[0];
        const startX = dir > 0 ? 0 : -distance;
        const endX = dir > 0 ? -distance : 0;

        $list.css({
            transition: "none",
            transform: "translate3d(" + startX + "px, 0, 0)"
        });
        listEl.offsetWidth;

        $list.css({
            transition: "transform " + SLIDE_DURATION + "ms " + SLIDE_EASING,
            transform: "translate3d(" + endX + "px, 0, 0)"
        });

        let finished = false;

        function onSlideEnd(event) {
            if (event && event.originalEvent && event.originalEvent.propertyName !== "transform") {
                return;
            }

            if (finished) return;
            finished = true;

            $list.off("transitionend.productSlide");
            page = nextPage;
            resetTrack($list);
            render();
            moving = false;
        }

        $list.on("transitionend.productSlide", onSlideEnd);
        setTimeout(onSlideEnd, SLIDE_DURATION + 80);
    }

    function resetList() {
        page = 0;
        moving = false;
        $productLists.off("transitionend.productSlide");
        showActiveList();
        render();
    }

    $filterBtn.on("click", function () {
        if ($(this).hasClass("active")) return;

        const index = $filterBtn.index(this);

        $filterBtn.removeClass("active");
        $(this).addClass("active");

        $productLists.removeClass("active");
        $productLists.eq(index).addClass("active");

        resetList();
    });

    $prev.on("click", function () {
        slide(-1);
    });

    $next.on("click", function () {
        slide(1);
    });

    $(window).on("resize.productSlider", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            moving = false;
            $productLists.off("transitionend.productSlide");
            showActiveList();
            render();
        }, 150);
    });

    resetList();

});


$(function () {

    const $lists = $(".product-list");
    const popupMap = [
        [0, 1, 2, 3, 4, 5, 6, 7],
        [8, 9, 10, 11, 1]
    ];
    const popupConfig = {
        desktop: {
            wrap: ".popup-wrap",
            item: ".popup"
        },
        tablet: {
            wrap: ".tablet-popup-wrap",
            item: ".tablet-popup"
        },
        mobile: {
            wrap: ".mobile-popup-wrap",
            item: ".mobile-popup"
        }
    };

    let scrollTop = 0;
    let openedIndex = null;
    let openedType = null;
    let popupResizeTimer = null;

    function getPopupSet(type) {
        const config = popupConfig[type] || popupConfig.desktop;
        return {
            $wrap: $(config.wrap),
            $items: $(config.wrap).find(config.item)
        };
    }

    function lockBody() {
        scrollTop = $(window).scrollTop();
        $("html").css("overflow-y", "scroll");
        $("body").css({
            position: "fixed",
            top: -scrollTop,
            left: 0,
            width: "100%"
        });
    }

    function unlockBody() {
        $("body").css({
            position: "",
            top: "",
            left: "",
            width: ""
        });
        $("html").css("overflow-y", "");
        $(window).scrollTop(scrollTop);
    }

    function closeAllPopups() {
        $(".popup-wrap, .tablet-popup-wrap, .mobile-popup-wrap").hide();
        $(".popup, .tablet-popup, .mobile-popup").hide();
    }

    function openResponsivePopup(index) {
        const type = getViewportType();
        const set = getPopupSet(type);
        const $item = set.$items.eq(index);

        if (!$item.length) return;

        closeAllPopups();

        if (openedIndex === null) {
            lockBody();
        }

        $item.css("display", "block");
        set.$wrap.css("display", "flex");

        openedIndex = index;
        openedType = type;
    }

    function closeResponsivePopup($fromItem) {
        const $item = $fromItem && $fromItem.length
            ? $fromItem
            : $(".popup:visible, .tablet-popup:visible, .mobile-popup:visible");

        $item.stop(true, true).fadeOut(300, function () {
            closeAllPopups();
            openedIndex = null;
            openedType = null;
            unlockBody();
        });
    }

    $(".product-btn").on("click", function () {
        const $list = $(this).closest(".product-list");
        const i = $lists.index($list);
        const j = $list.find(".product-btn").index(this);
        const popupIndex = popupMap[i]?.[j];

        if (popupIndex === undefined) return;

        openResponsivePopup(popupIndex);
    });

    $(document).on("click", ".close-btn", function () {
        const $item = $(this).closest(".popup, .tablet-popup, .mobile-popup");
        closeResponsivePopup($item);
    });

    $(window).on("resize.productPopup", function () {
        if (openedIndex === null) return;

        clearTimeout(popupResizeTimer);
        popupResizeTimer = setTimeout(function () {
            const nextType = getViewportType();

            if (nextType === openedType) return;

            openResponsivePopup(openedIndex);
        }, 150);
    });

});
