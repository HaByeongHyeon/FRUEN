

// product-filter ==========================================================

$(function () {

    const $filterBtn = $(".filter-btn");
    const $productList = $(".product-list");
    const $page = $(".page");

    $filterBtn.on("click", function () {

        const index = $(this).index();

        // 이미 선택된 버튼이면 실행하지 않음
        if ($(this).hasClass("active")) return;


        // =========================
        // Filter Button
        // =========================

        $filterBtn.removeClass("active");
        $(this).addClass("active");


        // =========================
        // Product List
        // =========================

        $productList
            .removeClass("active")
            .hide()
            .eq(index)
            .addClass("active")
            .show();


        // =========================
        // Pagination
        // =========================

        $page.removeClass("active");
        $page.eq(index).addClass("active");

    });

});


// product ========================================================

$(function () {

    const $list = $(".product-list.active");
    const $items = $list.children(".product-btn");
    const $prev = $(".prev-btn");
    const $next = $(".next-btn");

    const pageSize = 6;

    let page = 0;
    let moving = false;

    const listWidth = $list.outerWidth();

    $list.css({
        width: listWidth,
        minWidth: listWidth
    });


    function render() {

        $items.hide().css({
            position: "",
            top: 0,
            left: 0
        });

        $items
            .slice(page * pageSize, page * pageSize + pageSize)
            .css("display", "block");

        if (page === 1) {
            $items.slice(6, 8).css({
                position: "relative",
                top: 0,
                left: 0
            });
        }

        const maxPage = Math.ceil($items.length / pageSize) - 1;

        $prev.toggleClass("active", page > 0);
        $next.toggleClass("active", page < maxPage);
    }


    function slide(dir) {

        if (moving) return;

        const maxPage = Math.ceil($items.length / pageSize) - 1;
        const nextPage = page + dir;

        if (nextPage < 0 || nextPage > maxPage) return;

        moving = true;
        page = nextPage;

        const move = listWidth * dir;

        $list.animate(
            { left: -move },
            600,
            function () {

                $list.css("left", 0);

                render();

                moving = false;
            }
        );
    }


    $prev.on("click", function () {
        slide(-1);
    });

    $next.on("click", function () {
        slide(1);
    });


    render();

});



// popup ==========================================================

$(function () {

    const $lists = $(".product-list"),
        $wrap = $(".popup-wrap"),
        $popups = $(".popup"),
        map = [
            [0, 1, 2, 3, 4, 5, 6, 7],
            [8, 9, 10, 11, 1]
        ];


    let scrollTop = 0;


    $(".product-btn").on("click", function () {

        const $list = $(this).closest(".product-list"),
            i = $lists.index($list),
            j = $list.find(".product-btn").index(this),
            popup = map[i]?.[j];

        if (popup === undefined) return;

        scrollTop = $(window).scrollTop();

        $popups.hide().eq(popup).stop(true, true).fadeIn(400);
        $wrap.css("display", "flex");

        $("html").css("overflow-y", "scroll");

        $("body").css({
            position: "fixed",
            top: -scrollTop,
            left: 0,
            width: "100%"
        });

    });


    $(".close-btn").on("click", function () {

        $(this).closest(".popup").stop(true, true).fadeOut(300, function () {

            $wrap.hide();

            $("body").css({
                position: "",
                top: "",
                left: "",
                width: ""
            });

            $("html").css("overflow-y", "");
            $(window).scrollTop(scrollTop);

        });

    });

});