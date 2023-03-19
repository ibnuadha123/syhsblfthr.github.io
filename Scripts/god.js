// Single Page Application Navigation //
"use strict";

const head = document.head;
const body = document.body;

class God {
    #dictionary;
    #instance;
    #hideBody; // HOLY!!!
    #showBody; // Lewd

    #updateInstance() {
        this.#instance = new this.#dictionary[window.location.pathname];
    }

    loadPage(evt, page) {
        if (this.#instance.saveState !== undefined)
            this.#instance.saveState();
        if (this.#instance.destroy !== undefined)
            this.#instance.destroy();

        // Execute loading animation
        this.#hideBody().finished.then(() => {
            fetch(page).then((response) => {
                const parser = new DOMParser;
                response.text().then((text) => {
                    const _document = parser.parseFromString(text, "text/html");
                    body.innerHTML = _document.body.innerHTML; // Load content
                    document.title = _document.title; // Update title
                    // Update the history stack and URL
                    window.history.pushState(null, null, page);

                    this.#updateInstance();

                    if (evt !== null)
                        this.#instance.popstateHandler(evt.state);
                    this.#showBody();
                });
            });
        });
    }

    constructor() {
        this.#hideBody = () => {
            return body.animate({opacity: 0}, {duration: 125, fill: "forwards"});
        };

        this.#showBody = () => {
            return body.animate({opacity: 1}, {duration: 125, fill: "forwards"});
        };

        this.#dictionary = {
            '/': IndexHandler,
            "/index.html": IndexHandler,
            "/about.html": Map
        };

        this.#updateInstance();

        window.onpopstate = (evt) => {
            this.loadPage(evt, "index.html");
        }
    }
};

const god = new God;
