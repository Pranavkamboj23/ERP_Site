/* =========================================================
   LENIS SMOOTH SCROLL
========================================================= */

const lenis = new Lenis({

    duration: 1.15,

    smoothWheel: true,

    wheelMultiplier: 0.9,

    touchMultiplier: 1.2

});


lenis.on("scroll", ScrollTrigger.update);


gsap.ticker.add((time) => {

    lenis.raf(time * 1000);

});


gsap.ticker.lagSmoothing(0);



/* =========================================================
   MENU
========================================================= */

const menuButton =
    document.querySelector(".menu-button");

const menuClose =
    document.querySelector(".menu-close");

const menuOverlay =
    document.querySelector(".menu-overlay");

const menuLinks =
    document.querySelectorAll(".menu-nav a");


let menuOpen = false;



function openMenu() {

    if (menuOpen) return;

    menuOpen = true;

    document.body.classList.add(
        "menu-open"
    );

    lenis.stop();


    const timeline = gsap.timeline();


    timeline

        .set(menuOverlay, {
            visibility: "visible"
        })

        .to(menuOverlay, {

            clipPath:
                "inset(0 0 0% 0)",

            duration: 0.9,

            ease: "power4.inOut"

        })

        .from(
            ".menu-nav a",
            {

                y: 70,

                opacity: 0,

                duration: 0.8,

                stagger: 0.07,

                ease: "power4.out"

            },
            "-=.35"
        );

}



function closeMenu() {

    if (!menuOpen) return;

    menuOpen = false;


    gsap.to(menuOverlay, {

        clipPath:
            "inset(0 0 100% 0)",

        duration: 0.8,

        ease: "power4.inOut",

        onComplete: () => {

            gsap.set(
                menuOverlay,
                {
                    visibility: "hidden"
                }
            );

            document.body.classList.remove(
                "menu-open"
            );

            lenis.start();

        }

    });

}



menuButton.addEventListener(
    "click",
    openMenu
);


menuClose.addEventListener(
    "click",
    closeMenu
);


menuLinks.forEach(link => {

    link.addEventListener(
        "click",
        closeMenu
    );

});