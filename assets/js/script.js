// slider =======================================

$(function () {
    var $sec = $(".slider-sec");
    var $slides = $sec.children(".slider-wrap");
    var total = $slides.length;
    var index = 0;
    var animating = false;
    var DURATION = 600;

    if (!$sec.length || total < 2) return;

    $slides.css("transition", "transform " + DURATION + "ms ease");

    function go(dir) {
        if (animating) return;
        animating = true;
        index = (index + dir + total) % total;
        $slides.css("transform", "translateX(" + (-index * 100) + "%)");
        window.setTimeout(function () {
            animating = false;
        }, DURATION);
    }

    $sec.on("click", ".next-btn", function () {
        go(1);
    });

    $sec.on("click", ".prev-btn", function () {
        go(-1);
    });
});


gsap.registerPlugin(ScrollTrigger);


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
