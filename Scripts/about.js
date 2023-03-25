class AboutContents {
    #contentsContainer;
    #contents;
    #pageName;
    #contentNavigationIndex;
    #animations;

    constructor() {
        this.#contentsContainer = document.getElementById("aboutContents");
        this.#contents = this.#contentsContainer.children;
        this.#contentNavigationIndex = 0;
        this.#pageName = document.getElementById("page-name");

        this.#initializeAnimations();
    }

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

    #changeName(newName) {
        const duration = 150 / 2;
        const options = { duration: duration, easing: "ease-out", fill: "forwards" };
        this.#pageName.animate({
            opacity: [1, 0]
        }, { fill: options.fill } ).finished.then(() => {
            this.#pageName.textContent = newName;
            this.#pageName.animate({
                opacity: [0, 1]
            }, options);
        });
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
        const content = this.#contents[index];
        this.#changeName(content.dataset.name);
        content.classList.add("active");
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
};

class AboutHandler {
    #contentNavigation;
    #aboutContents;

    constructor() {
        this.#contentNavigation = document.getElementsByClassName("content-navigation");
        this.#aboutContents = new AboutContents;

        this.#aboutContents.init();

        this.#contentNavigation[0].addEventListener("click", this.#aboutContents.prev.bind(this.#aboutContents, this.#contentNavigation[0]));
        this.#contentNavigation[1].addEventListener("click", this.#aboutContents.next.bind(this.#aboutContents, this.#contentNavigation[1]));
    }
};
