"use strict";

const intersectionObserver = new IntersectionObserver((entries) => {
	entries.forEach(({target: {classList}, intersectionRatio}) => {
		if (intersectionRatio >= 0.5) {
			classList.add("aos");
		}
	});
}, {threshold: [0.25, 0.5, 0.75]});

const observationItems = document.getElementsByClassName("aos-observe");
Array.from(observationItems).forEach(observationItem => intersectionObserver.observe(observationItem));