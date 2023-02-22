const fFrameContainer = document.querySelector(".frame:first-child > div");
const fFrameContainerHeight = parseFloat(getComputedStyle(fFrameContainer).height) * (90 / 100);
const fFrameBarInterpolationVariable = fFrameContainerHeight / 500;
const fFrameBar = fFrameContainer.children[1];

/*
    (0, 0), (500, fFrameContainerHeight)
    elapsed * (fFrameContainerHeight / 500)
    elapsed * fFrameBarInterpolationVariable
*/
// let callbackStart = -1; Already declared in ./scroll.js
const fFrameBarAnimateCallback = (time) => {
    if (callbackStart < 0)
        callbackStart = time;
    const elapsed = time - callbackStart;

    const change = elapsed * fFrameBarInterpolationVariable;
    fFrameBar.style.height = Math.min(change, fFrameContainerHeight) + "px";
    if (elapsed <= 500)
        window.requestAnimationFrame(fFrameBarAnimateCallback);
    else
        callbackStart = -1;
};

const fFrameBarAnimate = () => {
    window.requestAnimationFrame(fFrameBarAnimateCallback);
};

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        fFrameBarAnimate();
    }, 500);
});
