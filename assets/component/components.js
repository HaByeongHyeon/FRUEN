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
        loadComponent("footer", "footer.html")
    ]);
})();
