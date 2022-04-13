let slideIndex = 0;
let slideTimer;
const slideDelay = 3;
const slides = document.getElementsByClassName("slide");

ShowSlide = (index) => {
	if (index == slides.length) slideIndex = 0;
	else if (index < 0) slideIndex = slides.length - 1;
	else slideIndex = index;

	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";
	}

	SlideReset();
	slides[slideIndex].style.display = "block";
};

SlideReset = () => {
	window.clearInterval(slideTimer);
	setTimeout(function () {
		slideTimer = window.setInterval(function () {
			ShowSlide((slideIndex += 1));
		}, slideDelay * 1000);
	}, 10);
};

neg.addEventListener("click", function () {
	ShowSlide((slideIndex -= 1));
});
pos.addEventListener("click", function () {
	ShowSlide((slideIndex += 1));
});

ShowSlide(slideIndex);
