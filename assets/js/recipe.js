$(function () {

    const $lists = $(".recipe-list");
    const $groups = $(".slide-contents > .slide");
    const $btns = $(".slide-btn-wrap button");

    let moving = false;


    // =========================
    // 카테고리 변경
    // =========================

    $lists.on("click", function () {

        const index = $lists.index(this);

        if (!$groups.eq(index).length) return;

        $lists.removeClass("active");
        $(this).addClass("active");

        $groups.removeClass("active");
        $groups.eq(index).addClass("active");

        // 해당 카테고리 첫 번째 슬라이드부터 시작
        $groups.eq(index)
            .children(".slide-menu")
            .css("margin-left", 0);

        moving = false;
    });


    // =========================
    // 슬라이드
    // =========================

    function slide(dir) {

        if (moving) return;

        const $group = $(".slide-contents > .slide.active");
        const $slides = $group.children(".slide-menu");

        if (!$slides.length) return;

        moving = true;

        const $target = dir > 0
            ? $slides.first()
            : $slides.last();


        // 이전
        if (dir < 0) {

            $group.prepend($target);

            $target.css("margin-left", "-100%");
        }


        $target.animate(
            {
                marginLeft: dir > 0 ? "-100%" : 0
            },
            600,
            function () {

                // 다음
                if (dir > 0) {

                    $group.append($target);
                    $target.css("margin-left", 0);
                }

                moving = false;
            }
        );
    }


    // =========================
    // 버튼
    // =========================

    $btns.eq(0).on("click", function () {
        slide(-1);
    });

    $btns.eq(1).on("click", function () {
        slide(1);
    });

});


// 팝업창 =====================================================

$(function () {

    const $wrap = $(".recipe-popup-wrap");
    const $popups = $wrap.find(".popup");
    const $menus = $(".slide-menu");
    let scrollTop = 0;

    const $overlay = $("<div>").css({
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        zIndex: 0
    });

    $wrap.css({
        display: "none",
        position: "fixed",
        inset: 0,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999
    }).prepend($overlay);

    $popups.hide().css({
        position: "relative",
        zIndex: 1
    });


    // Popup 열기
    $(".recipe-btn").on("click", function (e) {

        e.preventDefault();

        const index = $menus.index($(this).closest(".slide-menu"));

        if (index < 0 || index >= $popups.length) return;

        scrollTop = $(window).scrollTop();

        $popups.hide().eq(index).stop(true, true).fadeIn(300);
        $wrap.css("display", "flex");

        $("html").css("overflow-y", "scroll");

        $("body").css({
            position: "fixed",
            top: -scrollTop,
            left: 0,
            width: "100%"
        });

    });


    // Popup 닫기
    $(".close-btn").on("click", closePopup);
    $overlay.on("click", closePopup);


    function closePopup() {

        $wrap.fadeOut(300, function () {

            $popups.hide();

            $("body").css({
                position: "",
                top: "",
                left: "",
                width: ""
            });

            $("html").css("overflow-y", "");

            $(window).scrollTop(scrollTop);

        });

    }

});