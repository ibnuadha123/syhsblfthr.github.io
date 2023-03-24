// Single Page Application Navigation //
"use strict";

const content = document.body.firstElementChild;
const style = document.styleSheets[1];

class WorldHistory {
    #data;

    #getEntry(name) {
        return this.#data.find(entry => entry[0] === name);
    }

    get(name) {
        return this.#getEntry(name)?.[1];
    }

    set(name, data) {
        // Check if name exists
        let targetData = this.#getEntry(name);
        if (targetData === undefined)
            this.#data.push([name, data]);
        else
            targetData[1] = data;
    }

    constructor() {
        this.#data = [];
    }
};

class God {
    #location;
    #dictionary;
    #instance;
    #hideContent;
    #showContent;
    #styleSheet;
    #feet;
    #feetDict;
    #activeFooterItem;

    #updateInstance() {
        this.#instance = new this.#dictionary[this.#location];
    }

    #updateLocation() {
        return this.#location = content.dataset.location;
    }

    #updateStyleSheet(name) {
        fetch(`Styles/Compiled/${name}.css`).then((response) => {
            response.text().then((text) => {
                this.#styleSheet.replaceSync(text);
                this.#updateInstance();
                this.#showContent();
            });
        });
    }

    loadPage(name) {
        this.#enableFoot(this.#feetDict[name]);

        this.#instance.saveState?.();
        this.#instance.destroy?.();

        const html = name.concat(".html");

        // Execute loading animation
        this.#hideContent().finished.then(() => {
            fetch(`Styles/Compiled/${name}.css`).then((response) => {
                response.text().then((text) => {
                    this.#styleSheet.replaceSync(text);
                    fetch(html).then((response) => {
                        const parser = new DOMParser;
                        response.text().then((text) => {
                            const _document = parser.parseFromString(text, "text/html");
                            const _content = _document.body.firstElementChild;
                            content.innerHTML = _content.innerHTML; // Load content
                            document.title = _document.title; // Update title
                            // Update the history stack and URL
                            window.history.pushState({name: name}, null, html);
        
                            content.dataset.location = _content.dataset.location;
                            this.#updateLocation();
                            this.#updateInstance();
                            
                            const data = worldHistory.get(name);
                            if (data !== undefined)
                                this.#instance.cachedHandler(data);
                            this.#showContent();
                        });
                    });
                });
            });
        });
    }

    #enableFoot(index) {
        const foot = this.#feet[index];
        this.#activeFooterItem.classList.remove("active");
        (this.#activeFooterItem = foot).classList.add("active");
    }

    constructor() {
        this.#hideContent = () => {
            return content.animate({opacity: [1, 0]}, {duration: 125, fill: "forwards"});
        };

        this.#showContent = () => {
            return content.animate({opacity: [0, 1]}, {duration: 125, fill: "forwards"});
        };

        this.#dictionary = {
            "index": IndexHandler,
            "about": AboutHandler
        };

        this.#feet = Array.from(document.querySelector("footer").firstElementChild.children);
        Array.from(this.#feet).forEach((item, index) => {
            item.addEventListener("click", () => {
                this.loadPage(item.dataset.pageindex);
                this.#enableFoot(index);
            });
        });

        this.#feetDict = {
            "index": 0,
            "about": 1
        }

        this.#activeFooterItem = this.#feet.find(item => item.classList.contains("active"));
        
        this.#styleSheet = new CSSStyleSheet; // Define the stylesheet object
        document.adoptedStyleSheets = [this.#styleSheet]; // "Adopt" the stylesheet
        this.#updateStyleSheet(this.#updateLocation());
        
        window.history.replaceState({name: this.#location}, null);
        
        window.addEventListener("popstate", (evt) => {
            this.loadPage(evt.state.name);
        });

        window.addEventListener("load", document.body.animate.bind(document.body, { opacity: [0, 1], visibility: "visible" }, { duration: 1000, fill: "forwards" }));
    }
};

const worldHistory = new WorldHistory;
const god = new God;
