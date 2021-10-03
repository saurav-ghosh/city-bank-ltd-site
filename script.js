"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnsOpenModal = document.querySelectorAll(".btn__show__modal");
const btnCloseModal = document.querySelector(".btn__close__modal");
const backCloseModal = document.querySelector(".overlay");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const btnScrollTo = document.querySelector(".btn__scroll__to");
const section1 = document.querySelector("#section__1");
const tabs = document.querySelectorAll(".operations__tab");
const tabContainer = document.querySelector(".operations__tab__container");
const contents = document.querySelectorAll(".operations__content");

//MODAL WINDOW
const openModal = () => {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

const closeModal = () => {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => {
    btn.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
backCloseModal.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});

//Smooth scrolling for Learn more button
btnScrollTo.addEventListener("click", (e) => {
    section1.scrollIntoView({ behavior: "smooth" });

    //SUPPORTED BY OLD BROWSERS
    // const s1Coords = section1.getBoundingClientRect();

    // window.scrollTo({
    //     left: s1Coords.left + window.pageXOffset,
    //     top: s1Coords.top + window.pageYOffset,
    //     behavior: "smooth",
    // });
});

//PAGE NAVIGATION WITH SMOOTH SCROLLING USING EVENT DELEGATION
document.querySelector(".nav__links").addEventListener("click", function (e) {
    e.preventDefault();

    //MATCHING STRATEGY
    if (e.target.classList.contains("nav__link")) {
        const id = e.target.getAttribute("href");
        if (id !== "#") {
            document.querySelector(id).scrollIntoView({ behavior: "smooth" });
        }
    }
});
// WITHOUT EVENT DELEGATION
// document.querySelectorAll(".nav__link").forEach((el) => {
//     el.addEventListener("click", function (e) {
//         e.preventDefault();
//         const id = this.getAttribute("href");
//         document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//     });
// });

//Menu fade animation
const handleHover = function (e) {
    if (e.target.classList.contains("nav__link")) {
        const link = e.target;
        const siblings = link.closest(".nav").querySelectorAll(".nav__link");
        const logo = link.closest(".nav").querySelector("img");

        siblings.forEach((el) => {
            if (el !== link) el.style.opacity = this;
        });

        logo.style.opacity = this;
    }
};

//Passing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

//Sticky navigation using intersection observer API
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add("sticky");
    else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//Sticky navigation following old way
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener("scroll", function () {
//     if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
//     else nav.classList.remove("sticky");
// });

//Reveal section with animation
const sections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove("section__hidden");

    observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

sections.forEach((section) => {
    sectionObserver.observe(section);
    section.classList.add("section__hidden");
});

//Lazy loading images
const images = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener("load", function () {
        entry.target.classList.remove("lazy__img");
    });

    observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: "200px",
});
images.forEach((img) => imgObserver.observe(img));

//Operations tabbed component
tabContainer.addEventListener("click", function (e) {
    const clicked = e.target.closest(".operations__tab");

    if (!clicked) return;

    //Remove active classes
    tabs.forEach((t) => t.classList.remove("operations__tab__active"));
    contents.forEach((e) => e.classList.remove("operations__content__active"));

    //Activate tab
    clicked.classList.add("operations__tab__active");

    //Activate content
    document
        .querySelector(`.operations__content__${clicked.dataset.tab}`)
        .classList.add("operations__content__active");
});

//Testimonial sliders
const slider = function () {
    const slides = document.querySelectorAll(".slide");
    const btnLeft = document.querySelector(".slider__btn__left");
    const btnRight = document.querySelector(".slider__btn__right");
    const dotContainer = document.querySelector(".dots");

    let currentSlide = 0;
    const maxSlide = slides.length;

    const createDots = function () {
        slides.forEach((_, i) => {
            dotContainer.insertAdjacentHTML(
                "beforeend",
                `<button class="dots__dot" data-slide=${i}></button>`
            );
        });
    };

    const activateDot = function (slide) {
        document
            .querySelectorAll(".dots__dot")
            .forEach((dot) => dot.classList.remove("dots__dot__active"));

        document
            .querySelector(`.dots__dot[data-slide="${slide}"]`)
            .classList.add("dots__dot__active");
    };

    const goToSlide = function (slide) {
        slides.forEach((s, i) => {
            s.style.transform = `translateX(${100 * (i - slide)}%)`;
        });
    };

    const init = () => {
        goToSlide(0);
        createDots();

        activateDot(0);
    };
    init();

    //Show the next slider
    const nextSlide = function () {
        if (currentSlide === maxSlide - 1) {
            currentSlide = 0;
        } else {
            currentSlide++;
        }

        goToSlide(currentSlide);
        activateDot(currentSlide);
    };

    //Show the previous slider
    const prevSlide = function () {
        if (currentSlide === 0) {
            currentSlide = maxSlide - 1;
        } else {
            currentSlide--;
        }

        goToSlide(currentSlide);
        activateDot(currentSlide);
    };

    btnRight.addEventListener("click", nextSlide);
    btnLeft.addEventListener("click", prevSlide);

    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") nextSlide();
        if (e.key === "ArrowLeft") prevSlide();
    });

    dotContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("dots__dot")) {
            const { slide } = e.target.dataset;
            goToSlide(slide);
            activateDot(slide);
        }
    });
};
slider();

// //COOKIE COLLECTION MESSAGE
// const header = document.querySelector(".header");

// const message = document.createElement("div");
// message.innerHTML =
//     'We use cookie for better functionality and analytics.<button class="btn btn__close__cookie">Got it</button>';
// message.classList.add("cookie__message");
// header.prepend(message);

// document.querySelector(".btn__close__cookie").addEventListener("click", () => {
//     message.remove();
// });

// document.addEventListener("DOMContentLoaded", function (e) {
//     console.log("html parsed and dom tree built!", e);
// });

// window.addEventListener("load", function (e) {
//     console.log("page fully loaded", e);
// });

// window.addEventListener("beforeunload", function (e) {
//     e.preventDefault();
//     console.log(e);
//     e.returnValue = "";
// });
