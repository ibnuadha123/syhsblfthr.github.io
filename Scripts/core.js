// Single Page Application Navigation //
"use strict";

class LoadingScreen {
    #element;
    #progress;

    show() {
        return this.#element.animate({ opacity: 1, visibility: "visible" }, { duration: 500, fill: "forwards" }).finished;
    }

    hide() {
        return new Promise((resolve) => {
            content.animate({ opacity: [0, 1] }, { duration: 500, fill: "forwards" });
            this.#element.animate({ opacity: [1, 0], visibility: "hidden" }, { duration: 250, delay: 750, fill: "forwards" }).finished.then(() => {
                this.#progress.style.width = "0%";
                resolve();
            });
        });
    }

    #getContentLength(responsesArray) {
        return responsesArray.map(response => parseFloat(response.headers.get("Content-Length"))).reduce((prev, curr) => prev + curr);
    }

    #getReaders(responsesArray) {
        return responsesArray.map(response => response.body.getReader());
    }

    #cleanReadersArray(readersArray) {
        readersArray = readersArray.filter(reader => reader !== undefined);
    }

    #getTotalDownload(readersArray, values) {
        return new Promise(async (resolve) => {
            let resolveValue = 0;
            const readersArrayLength = readersArray.length;
            let readersIndex = 0;
            do {
                const { done, value } = await readersArray[readersIndex].read();
                if (done)
                    readersArray[readersIndex] = undefined;
                else {
                    values[readersIndex] = value;
                    resolveValue += value.length;
                }
            } while (++readersIndex < readersArrayLength);

            this.#cleanReadersArray(readersArray);
            resolve(resolveValue);
        });
    }
    
    track(responsesArray) {
        // Reset progress
        return new Promise(async (resolve) => {
            // Total size to download
            const contentLength = this.#getContentLength(responsesArray);

            let readersArray = this.#getReaders(responsesArray);

            let data = [null, null], percentage;
            do {
                this.#progress.style.width = `${percentage = (100 * (await this.#getTotalDownload(readersArray, data)) / contentLength)}%`;
            } while (percentage < 100);

            resolve(data);
        });
    }

    constructor(core) {
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

class FooterHandler {
    #buttons = [... document.querySelectorAll("[data-pageIndex]")];
    #active = this.#buttons.findIndex(button => button.classList.contains("active"));
    #indexMap = {
        "index": 0,
        "about": 1,

        0: "index",
        1: "about"
    };

    #numericIndex(strIndex) {
        return this.#indexMap[strIndex];
    }

    #getElement(index) {
        return this.#buttons[typeof(index) === "string" ? this.#numericIndex(index) : index];
    }

    enableButton(index) {
        console.log("Pass, index", index);
        if (index === this.#active)
            return;
        this.#getElement(this.#active).classList.remove("active");
        this.#getElement(this.#active = index).classList.add("active");
    }

    constructor(core) {
        this.#buttons.forEach((button, index) => {
            button.addEventListener("click", this.enableButton.bind(this, index));
            button.addEventListener("click", core.loadPage.bind(core, this.#indexMap[index]));
        });
    }
}

class InstanceHandler {
    #core;
    #instance;

    #instanceMap = {
        "index": IndexHandler,
        "about": AboutHandler
    };

    updateInstance(name) {
        this.#instance?.destroy?.();
        this.#instance = new this.#instanceMap[name](this.#core);
    }

    constructor(core) {
        this.#core = core;
    }
};

class Core {
    #contentElement = document.getElementById("content");
    #location = this.#contentElement.dataset.location;

    #loadingScreen = new LoadingScreen(this);
    #instanceHandler = new InstanceHandler(this);
    #footerHandler = new FooterHandler(this);

    #styleSheet = (document.adoptedStyleSheets = [new CSSStyleSheet])[0];

    #updateLocation() {
        this.#location = this.#contentElement.dataset.location;
    }

    #loadHTML(html) {
        const newContent = html.body.children[1];
        this.#contentElement.dataset.location = newContent.dataset.location;
        this.#contentElement.innerHTML = newContent.innerHTML;
    }

    #loadCSS = 
        this.#styleSheet.replaceSync;

    async loadPage(name) {
        window.history.replaceState({name: name}, ""); // For popstate event
        await this.#loadingScreen.show();

        const html = await fetch(`${name}.html`);
        const css = await fetch(`Styles/Compiled/${name}.css`);

        this.#loadingScreen.track([html, css]).then((args) => {
            const decoder = new TextDecoder("utf-8"), domParser = new DOMParser;
            this.#loadHTML(domParser.parseFromString(decoder.decode(args[0]), "text/html"));
            this.#styleSheet.replaceSync(decoder.decode(args[1]));

            this.#updateLocation();

            this.#footerHandler.enableButton(this.#location);

            this.#loadingScreen.hide().then(() => {
                window.history.pushState(null, null, `${name}.html`);
                this.#instanceHandler.updateInstance(this.#location);
            });
        });
    }

    constructor() {
        this.loadPage(this.#location);
    }
};

window.addEventListener("load", () => {
    const worldHistory = new WorldHistory;
    const core = new Core;
});
