(function () {
    var header = document.querySelector(".header");
    var hamburger = document.querySelector(".hamburger-menu");
    var button = document.querySelector(".hamburger-menu-btn");
    var menu = document.querySelector("#slide-menu");
    var dim = document.querySelector(".slide-menu-dim");
    var mqDesktop = window.matchMedia("(min-width: 1025px)");
    var isOpen = false;

    if (!header || !hamburger || !button || !menu) return;

    function isDesktop() {
        return mqDesktop.matches;
    }

    function lockScroll() {
        document.documentElement.classList.add("is-slide-menu-open");
        document.body.classList.add("is-slide-menu-open");
    }

    function unlockScroll() {
        document.documentElement.classList.remove("is-slide-menu-open");
        document.body.classList.remove("is-slide-menu-open");
    }

    function openMenu() {
        if (isOpen || isDesktop()) return;

        isOpen = true;
        hamburger.classList.add("is-open");
        menu.classList.add("is-open");

        if (dim) {
            dim.hidden = false;
            dim.classList.add("is-open");
        }

        menu.setAttribute("aria-hidden", "false");
        button.setAttribute("aria-expanded", "true");
        button.setAttribute("aria-label", "메뉴 닫기");
        lockScroll();
    }

    function closeMenu() {
        if (!isOpen) return;

        isOpen = false;
        hamburger.classList.remove("is-open");
        menu.classList.remove("is-open");

        if (dim) {
            dim.classList.remove("is-open");
            dim.hidden = true;
        }

        menu.setAttribute("aria-hidden", "true");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "메뉴 열기");
        unlockScroll();
    }

    function toggleMenu() {
        if (isOpen) closeMenu();
        else openMenu();
    }

    function onGuardScroll(event) {
        if (!isOpen) return;
        if (menu.contains(event.target)) return;
        event.preventDefault();
    }

    button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        toggleMenu();
    });

    if (dim) {
        dim.addEventListener("click", closeMenu);
    }

    menu.addEventListener("click", function (event) {
        var link = event.target.closest("a");
        if (!link) return;

        var href = link.getAttribute("href");
        if (!href || href === "#") {
            event.preventDefault();
            closeMenu();
            return;
        }

        try {
            var url = new URL(link.href, window.location.href);
            var samePage = url.origin === window.location.origin && url.pathname === window.location.pathname;

            if (samePage) closeMenu();
        } catch (error) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
            closeShopPopup();
        }
    });

    window.addEventListener("wheel", onGuardScroll, { passive: false });
    window.addEventListener("touchmove", onGuardScroll, { passive: false });

    function onViewportChange() {
        if (isDesktop()) closeMenu();
    }

    if (typeof mqDesktop.addEventListener === "function") {
        mqDesktop.addEventListener("change", onViewportChange);
    } else if (typeof mqDesktop.addListener === "function") {
        mqDesktop.addListener(onViewportChange);
    }

    var currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (!currentPage || currentPage.indexOf(".") === -1) {
        currentPage = "index.html";
    }
    document.querySelectorAll(".header-nav a, .slide-menu-list a").forEach(function (link) {
        var href = (link.getAttribute("href") || "").split("/").pop().toLowerCase();
        if (href && href === currentPage) {
            link.setAttribute("aria-current", "page");
        }
    });


    var overlay = document.querySelector(".shop-popup-overlay");
    var closeBtn = overlay ? overlay.querySelector(".shop-popup-close") : null;
    var shopTriggers = document.querySelectorAll(".shop-btn, .shop-btn a, .slide-menu-shop");
    var isPopupOpen = false;
    var isPopupAnimating = false;
    var lockedScrollY = 0;
    var closeTimer = null;

    function lockPageScroll() {
        var gutter;

        lockedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        gutter = Math.max(0, window.innerWidth - document.documentElement.clientWidth);

        document.documentElement.style.setProperty("--shop-scrollbar-gutter", gutter + "px");
        document.documentElement.classList.add("is-shop-popup-open");
        document.body.classList.add("is-shop-popup-open");
        document.body.style.top = "-" + lockedScrollY + "px";
    }

    function unlockPageScroll() {
        document.documentElement.classList.remove("is-shop-popup-open");
        document.body.classList.remove("is-shop-popup-open");
        document.body.style.top = "";
        document.documentElement.style.removeProperty("--shop-scrollbar-gutter");
        window.scrollTo(0, lockedScrollY);
    }

    function openShopPopup() {
        if (!overlay || isPopupOpen || isPopupAnimating) return;

        closeMenu();
        isPopupOpen = true;
        isPopupAnimating = true;
        overlay.hidden = false;
        overlay.offsetWidth;
        overlay.classList.add("is-open");
        lockPageScroll();

        window.setTimeout(function () {
            isPopupAnimating = false;
        }, 220);
    }

    function closeShopPopup() {
        if (!overlay || !isPopupOpen || isPopupAnimating) return;

        isPopupAnimating = true;
        overlay.classList.remove("is-open");

        window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(function () {
            overlay.hidden = true;
            isPopupOpen = false;
            isPopupAnimating = false;
            unlockPageScroll();
        }, 220);
    }

    Array.prototype.forEach.call(shopTriggers, function (el) {
        el.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            openShopPopup();
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            closeShopPopup();
        });
    }
})();
