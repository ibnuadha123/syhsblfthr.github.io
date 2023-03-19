class AboutNavigationHandler {
    #navigation;
    #home;
    #portfolio;

    constructor() {
        this.#navigation = document.getElementById("navigation");
        this.#home = this.#navigation.firstElementChild;
        this.#portfolio = this.#home.nextElementSibling;

        this.#home.onclick = () => {
            const prevPage = (window.history.state?.prev) ?? null;
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
    #aboutNavigationHandler;
    #personalInfoContainers;
    #contentNavigation;
    #contentNavigationIndex;
    #contentsContainer;
    #contents;

    #animatePersonalInfos() {
        Array.from(this.#personalInfoContainers).forEach((personalInfo, index) => {
            personalInfo.animate({
                transform: ["translateY(-10%)", "translateY(0%)"],
                opacity: [0, 1]
            }, {duration: 1000, easing: "ease-out", delay: index * 200, fill: "forwards"});
        });
    }

    constructor() {
        this.#aboutNavigationHandler = new AboutNavigationHandler;
        this.#personalInfoContainers = document.getElementsByClassName("personalInfo");
        this.#contentNavigation = document.getElementsByClassName("content-navigation");
        this.#contentsContainer = document.getElementById("aboutContents");
        this.#contents = this.#contentsContainer.children;

        this.#contentNavigation[0].addEventListener("click", () => {

        });
    }
};
