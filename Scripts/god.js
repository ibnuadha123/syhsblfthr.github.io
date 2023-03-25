// Single Page Application Navigation //
"use strict";

const content = document.querySelector("[data-location]");
const style = document.styleSheets[1];

class LoadingScreen {
    #element;
    #progress;

    show() {
        content.animate({ opacity: 0 }, { fill: "forwards" });
        this.#element.animate({ opacity: 1, visibility: "visible" }, { fill: "forwards" });
    }

    async hide() {
        return new Promise((resolve) => {
            content.animate({ opacity: [0, 1] }, { duration: 500, fill: "forwards" });
            this.#element.animate({ opacity: [1, 0], visibility: "hidden" }, { duration: 100, delay: 750, fill: "forwards" }).finished.then(() => {
                this.#progress.style.width = "0%";
                resolve();
            });
        });
    }
    
    track(responses) {
        // Reset progress
        console.log(this.#progress.style.width);
        return new Promise(async (resolve) => {
            // total size to download
            const ContentLength =
                responses.map(response => parseFloat(response.headers.get("Content-Length")))
                .reduce((prev, curr) => prev + curr);

            let readers =
                responses.map(response => response.body.getReader());

            const data = [null, null];
            let totalDownloaded = 0;
            do {
                for (let readersIndex = 0; readersIndex < readers.length; ++readersIndex) {
                    const stream = await readers[readersIndex].read();
                    if (stream.done) {
                        readers[readersIndex] = undefined;
                        continue;
                    }
                    data[readersIndex] = stream.value;
                    totalDownloaded += data[readersIndex].length;
                }

                // Clear closed readers
                readers = readers.filter(reader => reader !== undefined);

                // Render progress
                this.#progress.style.width = `${100 * totalDownloaded / ContentLength}%`;
                console.log(100 * totalDownloaded / ContentLength);
                if (totalDownloaded >= ContentLength)
                    break;
            } while (1);

            const decoder = new TextDecoder("utf-8");
            const domParser = new DOMParser;
            resolve([decoder.decode(data[0]), domParser.parseFromString(decoder.decode(data[1]), "text/html")]);
        });
    }

    constructor() {
        this.#element = document.getElementById("loading-page");
        this.#progress = this.#element.querySelector("#loading-progress");
    }
};

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
    #styleSheet;
    #feet;
    #feetDict;
    #loadingScreen;
    #activeFooterItem;

    #updateInstance() {
        this.#instance = new this.#dictionary[this.#location];
    }

    #updateLocation() {
        this.#location = content.dataset.location;
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

    #hideContent() {
        return content.animate({opacity: [1, 0]}, {duration: 125, fill: "forwards"});
    };

    #showContent() {
        content.animate({opacity: [0, 1]}, {duration: 125, fill: "forwards"});
    };

    async loadPage(name) {
        const url = `${name}.html`;
        window.history.replaceState({name: name}, "", url); // For popstate event
        this.#loadingScreen.show();

        const css = await fetch(`Styles/Compiled/${name}.css`);
        const html = await fetch(url);

        this.#loadingScreen.track([css, html]).then((args) => {
            const _content = args[1].querySelector("[data-location]");
            content.innerHTML = _content.innerHTML;
            content.dataset.location = _content.dataset.location;
            this.#styleSheet.replaceSync(args[0]);
            this.#loadingScreen.hide().then(() => {
                this.#updateLocation();
                this.#updateInstance();
            });
        });
    }

    #enableFoot(index) {
        const foot = this.#feet[index];
        this.#activeFooterItem.classList.remove("active");
        (this.#activeFooterItem = foot).classList.add("active");
    }

    constructor() {
        window.addEventListener("popstate", (evt) => {
            this.loadPage(evt.state.name);
        });
        
        // Initialize properties
        this.#loadingScreen = new LoadingScreen;

        this.#dictionary = {
            "index": IndexHandler,
            "about": AboutHandler
        };

        this.#feet = Array.from(document.querySelector("footer").firstElementChild.children);
        this.#feet.forEach((foot, index) => {
            foot.addEventListener("click", () => {
                this.loadPage(foot.dataset.pageindex);
                this.#enableFoot(index);
            });
        });
        this.#activeFooterItem = this.#feet.find(item => item.classList.contains("active"));

        this.#feetDict = {
            "index": 0,
            "about": 1
        };

        this.#updateLocation(); // Get current location
        // Create stylesheet and adopt it
        this.#styleSheet = new CSSStyleSheet;
        document.adoptedStyleSheets = [this.#styleSheet];
        this.loadPage(this.#location); // Load the page

        window.addEventListener("load", this.#showContent.bind(this));
    }
};

const worldHistory = new WorldHistory;
const god = new God;
