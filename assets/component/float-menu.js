(function () {
    var menu = document.querySelector(".float-menu");

    function isContactPage() {
        var file = (location.pathname || "").replace(/\\/g, "/").split("/").pop() || "";
        return file === "contact.html" || file === "contact";
    }

    if (isContactPage()) {
        if (menu) menu.remove();
        return;
    }
})();
