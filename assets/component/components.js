(function () {
    var script = document.currentScript;
    var base = new URL("./", script.src);

    function loadComponent(name, file) {
        var slots = document.querySelectorAll('[data-component="' + name + '"]');
        if (!slots.length) {
            return Promise.resolve();
        }

        var path = new URL(file, base).href;

        return fetch(path)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error(response.status + " " + response.statusText);
                }
                return response.text();
            })
            .then(function (html) {
                slots.forEach(function (slot) {
                    slot.outerHTML = html.trim();
                });
            })
            .catch(function (error) {
                console.error("Failed to load component:", path, error);
            });
    }

    window.componentsReady = Promise.all([
        loadComponent("header", "header.html"),
        loadComponent("footer", "footer.html"),
        loadComponent("float-menu", "float-menu.html"),
        loadComponent("privacy-popup", "privacy-popup.html")
    ]).then(function () {
        var headerScript = document.createElement("script");
        headerScript.src = new URL("header.js", base).href;
        document.body.appendChild(headerScript);

        var floatScript = document.createElement("script");
        floatScript.src = new URL("float-menu.js", base).href;
        document.body.appendChild(floatScript);

        var privacyScript = document.createElement("script");
        privacyScript.src = new URL("privacy-popup.js", base).href;
        document.body.appendChild(privacyScript);
    });
})();
