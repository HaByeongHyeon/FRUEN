(function () {
    var header = document.querySelector(".header");
    var hamburger = document.querySelector(".hamburger-menu");
    var button = document.querySelector(".hamburger-menu-btn");
    var menu = document.querySelector(".slide-menu");
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
        if (event.key === "Escape") closeMenu();
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
})();
