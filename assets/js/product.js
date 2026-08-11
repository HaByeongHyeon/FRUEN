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


// popup ==========================================================

$(function () {

    const $productLists = $(".product-list");
    const $popupWrap = $(".popup-wrap");
    const $popups = $(".popup");


    // =========================
    // COOL & FRESH
    // 상품 1~6 → popup 1~6
    // =========================

    const coolPopup = [
        0,
        1,
        2,
        3,
        4,
        5
    ];


    // =========================
    // WARM & COZY
    // 상품 1~4 → popup 9~12
    // 상품 5   → popup 2
    // =========================

    const warmPopup = [
        8,
        9,
        10,
        11,
        1
    ];


    // =========================
    // Product 클릭
    // =========================

    $(".product-btn").on("click", function () {

        const $productList = $(this).closest(".product-list");

        // product-list가 전체 목록 중 몇 번째인지 확인
        const listIndex = $productLists.index($productList);

        // 해당 product-list 안에서 몇 번째 상품인지
        const productIndex = $productList
            .find(".product-btn")
            .index(this);

        let popupIndex;


        // =========================
        // COOL & FRESH
        // =========================

        if (listIndex === 0) {

            popupIndex = coolPopup[productIndex];

        }


        // =========================
        // WARM & COZY
        // =========================

        else if (listIndex === 1) {

            popupIndex = warmPopup[productIndex];

        }


        // 연결되는 팝업이 없으면 종료
        if (popupIndex === undefined) return;


        // =========================
        // Popup 열기
        // =========================

        $popups
            .stop(true, true)
            .hide();

        $popupWrap
            .css("display", "flex");

        $("body").css("overflow", "hidden");

        $popups
            .eq(popupIndex)
            .stop(true, true)
            .fadeIn(400);
    });


    // =========================
    // Popup 닫기
    // =========================

    $(".close-btn").on("click", function () {

        $(this)
            .closest(".popup")
            .stop(true, true)
            .fadeOut(300, function () {

                $popupWrap.css("display", "none");

                $("body").css("overflow", "");

            });

    });

});