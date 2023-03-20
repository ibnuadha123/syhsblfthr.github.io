// Single Page Application Navigation //
"use strict";

const head = document.head;
const body = document.body;
const style = document.styleSheets[1];

class God {
    #location;
    #dictionary;
    #instance;
    #hideBody;
    #showBody;
    #styleSheet;

    #updateInstance() {
        this.#instance = new this.#dictionary[this.#location];
    }

    #updateLocation() {
        this.#location = body.dataset.location;
    }

    #updateStyleSheet(name) {
        fetch(`Styles/Compiled/${name}.css`).then((response) => {
            response.text().then((text) => {
                this.#styleSheet.replaceSync(text);
            });
        });
    }

    loadPage(evt, name) {
        this.#instance.saveState?.();
        this.#instance.destroy?.();

        const html = name.concat(".html");

        // Execute loading animation
        this.#hideBody().finished.then(() => {
            this.#updateStyleSheet(name);
            fetch(html).then((response) => {
                const parser = new DOMParser;
                response.text().then((text) => {
                    const _document = parser.parseFromString(text, "text/html");
                    body.innerHTML = _document.body.innerHTML; // Load content
                    document.title = _document.title; // Update title
                    // Update the history stack and URL
                    window.history.pushState({prev: window.location.pathname}, null, html);

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

        this.#styleSheet = new CSSStyleSheet;

        document.adoptedStyleSheets = [this.#styleSheet];

        this.#updateStyleSheet(this.#location);

        window.onpopstate = (evt) => {
            this.loadPage(evt, "index");
        }
    }
};

const god = new God;
