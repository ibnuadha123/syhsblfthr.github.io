// Single Page Application Navigation //
"use strict";

const head = document.head;
const body = document.body;

class God {
    #location;
    #dictionary;
    #instance;
    #hideBody;
    #showBody;

    #updateInstance() {
        this.#instance = new this.#dictionary[this.#location];
    }

    #updateLocation() {
        this.#location = body.dataset.location;
    }

    loadPage(evt, page) {
        this.#instance.saveState?.();
        this.#instance.destroy?.();

        // Execute loading animation
        this.#hideBody().finished.then(() => {
            fetch(page).then((response) => {
                const parser = new DOMParser;
                response.text().then((text) => {
                    const _document = parser.parseFromString(text, "text/html");
                    body.innerHTML = _document.body.innerHTML; // Load content
                    document.title = _document.title; // Update title
                    // Update the history stack and URL
                    window.history.pushState({prev: window.location.pathname}, null, page);

                    body.dataset.location = _document.body.dataset.location;
                    this.#updateLocation();
                    this.#updateInstance();
                    
                    if (evt) {
                        this.#instance.popstateHandler(evt.state);
                    }
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
            "index": IndexHandler,
            "about": AboutHandler
        };

        this.#updateLocation();

        this.#updateInstance();

        window.onpopstate = (evt) => {
            this.loadPage(evt, "index.html");
        }
    }
};

const god = new God;
