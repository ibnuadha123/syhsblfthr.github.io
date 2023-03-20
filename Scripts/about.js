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
                god.loadPage(null, "index");
            }
        };
    }
};

class AboutContents {
    #contentsContainer;
    #contents;
    #contentNavigationIndex;
    #animations;

    init() {
        this.#enableContent(0);
    }

    prev(btn) {
        btn.nextElementSibling.classList.add("active");
        this.#disableContent(this.#contentNavigationIndex--);
        this.#enableContent(this.#contentNavigationIndex);
        if (this.#contentNavigationIndex === 0)
            btn.classList.remove("active");
    }

    next(btn) {
        btn.previousElementSibling.classList.add("active");
        this.#disableContent(this.#contentNavigationIndex++);
        this.#enableContent(this.#contentNavigationIndex);
        if (this.#contentNavigationIndex === this.#contents.length - 1)
            btn.classList.remove("active");
    }

    #disableContent(index) {
        this.#contents[index].classList.remove("active");
        switch (index) {
            case 0:
                this.#animations[0].forEach((animation) => {
                    animation.cancel();
                });
                break;
            case 1:
                this.#animations[1].forEach((animations) => {
                    animations[0].cancel();
                    animations[1].cancel();
                });
                break;
            default:
                break;
        }
    }

    #enableContent(index) {
        this.#contents[index].classList.add("active");
        switch (index) {
            case 0:
                this.#animations[0].forEach((animation) => {
                    animation.play();
                });
                break;
            case 1:
                this.#animations[1].forEach((animations) => {
                    animations[0].play();
                    animations[1].play();
                });
                break;
            default:
                break;
        }
    }

    #initializeAnimations() {
        this.#animations = [];

        this.#animations.push([]);
        Array.from(this.#contents[0].getElementsByClassName("personalInfo"))
            .forEach((pInfo, index) => {
                this.#animations[0].push(new Animation(new KeyframeEffect(pInfo, {
                    opacity: [0, 1],
                    transform: ["translateY(-10%)", "translateY(0%)"]
                }, { duration: 1000, easing: "ease-out", delay: index * 200, fill: "forwards" })));
            });

        this.#animations.push([]);
        Array.from(this.#contents[1].getElementsByClassName("skill"))
            .forEach((skill, index) => {
                const skillAnimation = new Animation(new KeyframeEffect(skill, {
                    opacity: [0, 1],
                    transform: ["translateY(-10%)", "translateY(0%)"]
                }, { duration: 1000, easing: "ease-out", delay: index * 200, fill: "forwards" }));

                const thumb = skill.children[1].firstElementChild;
                const thumbAnimation = new Animation(new KeyframeEffect(thumb, {
                    width: ["0%", thumb.dataset.fill]
                }, { duration: 500, easing: "ease-out", delay: 1000, fill: "forwards"}));

                this.#animations[1].push([skillAnimation, thumbAnimation]);
            });
    }

    constructor() {
        this.#contentsContainer = document.getElementById("aboutContents");
        this.#contents = this.#contentsContainer.children;
        this.#contentNavigationIndex = 0;

        this.#initializeAnimations();
    }
};

class AboutHandler {
    #aboutNavigationHandler;
    #contentNavigation;
    #aboutContents;

    constructor() {
        this.#aboutNavigationHandler = new AboutNavigationHandler;
        this.#contentNavigation = document.getElementsByClassName("content-navigation");
        this.#aboutContents = new AboutContents;

        this.#aboutContents.init();

        this.#contentNavigation[0].addEventListener("click", this.#aboutContents.prev.bind(this.#aboutContents, this.#contentNavigation[0]));
        this.#contentNavigation[1].addEventListener("click", this.#aboutContents.next.bind(this.#aboutContents, this.#contentNavigation[1]));
    }
};
