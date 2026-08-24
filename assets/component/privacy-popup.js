(function () {
    var overlay = document.querySelector(".privacy-popup-overlay");
    var popup = overlay ? overlay.querySelector(".privacy-popup") : null;
    var closeBtn = overlay ? overlay.querySelector(".privacy-popup-close") : null;
    var isOpen = false;
    var isAnimating = false;
    var lockedScrollY = 0;
    var closeTimer = null;

    if (!overlay || !popup) return;

    function lockPageScroll() {
        var gutter;

        lockedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        gutter = Math.max(0, window.innerWidth - document.documentElement.clientWidth);

        document.documentElement.style.setProperty("--privacy-scrollbar-gutter", gutter + "px");
        document.documentElement.classList.add("is-privacy-popup-open");
        document.body.classList.add("is-privacy-popup-open");
        document.body.style.top = "-" + lockedScrollY + "px";
    }

    function unlockPageScroll() {
        document.documentElement.classList.remove("is-privacy-popup-open");
        document.body.classList.remove("is-privacy-popup-open");
        document.body.style.top = "";
        document.documentElement.style.removeProperty("--privacy-scrollbar-gutter");
        window.scrollTo(0, lockedScrollY);
    }

    function openPrivacyPopup() {
        if (isOpen || isAnimating) return;

        isOpen = true;
        isAnimating = true;
        overlay.hidden = false;
        overlay.offsetWidth;
        overlay.classList.add("is-open");
        lockPageScroll();

        window.setTimeout(function () {
            isAnimating = false;
        }, 220);
    }

    function closePrivacyPopup() {
        if (!isOpen || isAnimating) return;

        isAnimating = true;
        overlay.classList.remove("is-open");

        window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(function () {
            overlay.hidden = true;
            isOpen = false;
            isAnimating = false;
            unlockPageScroll();
        }, 220);
    }

    document.addEventListener("click", function (event) {
        var trigger = event.target.closest(".js-privacy-popup-open");
        if (!trigger) return;

        event.preventDefault();
        openPrivacyPopup();
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            closePrivacyPopup();
        });
    }

    window.openPrivacyPopup = openPrivacyPopup;
    window.closePrivacyPopup = closePrivacyPopup;
})();
