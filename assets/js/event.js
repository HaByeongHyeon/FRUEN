$(function () {

    const $wrap = $(".event-wrap");
    const $content = $(".event-content");

    const move = () =>
        $content.innerWidth() + (parseFloat($wrap.css("gap")) || 0);

    let current = 0;
    let moving = false;

    function slide() {

        if (moving) return;

        const distance = move();
        const maxMove = $wrap.outerWidth() - $content.innerWidth();

        if (maxMove < distance) return;

        moving = true;
        current = current ? 0 : 1;

        $wrap.stop(true, true).animate(
            { left: -distance * current },
            600,
            function () {
                moving = false;
            }
        );
    }

    $(".prev-btn, .next-btn").on("click", slide);


    // filter 효과
    const $filter = $(".filter-wrap button");
    const $groups = $(".event-wrap").children();

    $filter.on("click", function () {

        const index = $filter.index(this);

        $filter.removeClass("active");
        $(this).addClass("active");

        $groups.hide();

        if (index === 0) {
            $groups.show();
        } else {
            $groups.eq(index - 1).show();
        }

    });

    // 초기 상태
    $groups.show();
});