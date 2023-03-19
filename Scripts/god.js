// Single Page Application Navigation //
"use strict";

const head = document.head;
const body = document.body;

class God {
    #dictionary;
    #instance;

    #updateInstance() {
        this.#instance = new this.#dictionary[window.location.pathname];
    }

    loadPage(page) {
        this.#instance.destroy();

        // Execute loading animation
        body.classList.remove("loading");
        body.classList.add("loading");

        setTimeout(() => {
            fetch(page).then((response) => {
                const parser = new DOMParser;
                response.text().then((text) => {
                    const _document = parser.parseFromString(text, "text/html");
                    body.innerHTML = _document.body.innerHTML; // Load content
                    document.title = _document.title; // Update title
                    // Update the history stack and URL
                    window.history.pushState(null, null, page);

                    this.#updateInstance();
                })
            });
        }, 250 / 2); // (250 / 2)ms is when body's opacity = 0
    }

    constructor() {
        this.#dictionary = {
            '/': IndexHandler,
            "/index.html": IndexHandler,
            "/about.html": Map
        };

        this.#updateInstance();

        window.onpopstate = (evt) => {
            this.#updateInstance();
            this.#instance.popstateHandler(evt);
        };
    }
};

const god = new God;
