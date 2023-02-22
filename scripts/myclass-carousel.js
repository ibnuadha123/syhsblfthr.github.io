"use strict";

const leftNavigation = document.querySelector(".myclass-navigation:nth-child(1)");
const rightNavigation = leftNavigation.nextElementSibling.nextElementSibling;
const carousel = leftNavigation.parentElement;
const carouselImage = document.getElementById("myclass-image");
const carouselText = document.getElementById("myclass-description").firstElementChild;

let index = 1;

const description = {
	1: "Me Eating",
	2: "Me After Eating",
	3: "My Class",
	4: "My Ceiling",
	5: "My Classmates",
	6: "My Class' IPAS Projects",
	7: "Aril"
};

leftNavigation.addEventListener("click", () => {
	if (index === 1)
		return;
	
	carouselImage.style.backgroundImage = `url("assets/myclass/${--index}.jpg`;
	carouselText.innerText = description[index];
});

rightNavigation.addEventListener("click", () => {
	if (index === 7)
		return;
	carouselImage.style.backgroundImage = `url("assets/myclass/${++index}.jpg`;
	carouselText.innerText = description[index];
});