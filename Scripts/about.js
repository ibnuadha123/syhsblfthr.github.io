class AboutNavigationHandler {
    #navigation;
    #home;
    #portfolio;

    constructor() {
        this.#navigation = document.getElementById("navigation");
        this.#home = this.#navigation.firstElementChild;
        this.#portfolio = this.#home.nextElementSibling;

        this.#home.onclick = () => {
            const prevPage = (window.history?.state.prev) ?? null;
            if (prevPage === '/' || prevPage === "/index.html") {
                window.history.back();
            }
            else {
                god.loadPage(null, "index.html");
            }
        };
    }
};

class AboutHandler {
    
};
