/* =========================================================
   CHECK REQUIRED LIBRARIES
========================================================= */

if (
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
) {

    console.error(
        "GSAP or ScrollTrigger failed to load."
    );

}



/* =========================================================
   LENIS
========================================================= */

let lenis = null;


if (typeof Lenis !== "undefined") {

    lenis = new Lenis({

        duration: 1.1,

        smoothWheel: true,

        wheelMultiplier: 0.9,

        touchMultiplier: 1.1

    });


    /*
    Keep ScrollTrigger synced
    */

    lenis.on(
        "scroll",
        ScrollTrigger.update
    );


    /*
    Drive Lenis using GSAP ticker
    */

    gsap.ticker.add(
        (time) => {

            lenis.raf(
                time * 1000
            );

        }
    );


    /*
    Prevent lag smoothing from
    fighting Lenis
    */

    gsap.ticker.lagSmoothing(0);

}



/* =========================================================
   MENU ELEMENTS
========================================================= */

const menuButton =
    document.querySelector(
        ".menu-button"
    );

const menuClose =
    document.querySelector(
        ".menu-close"
    );

const menuOverlay =
    document.querySelector(
        ".menu-overlay"
    );

const menuLinks =
    document.querySelectorAll(
        ".menu-nav a"
    );


let menuOpen = false;



/* =========================================================
   OPEN MENU
========================================================= */

function openMenu() {

    if (
        menuOpen ||
        !menuOverlay
    ) {
        return;
    }


    menuOpen = true;


    document.body.classList.add(
        "menu-open"
    );


    if (lenis) {
        lenis.stop();
    }


    const timeline =
        gsap.timeline();


    timeline

        .set(
            menuOverlay,
            {
                visibility:
                    "visible"
            }
        )

        .to(
            menuOverlay,
            {

                clipPath:
                    "inset(0 0 0% 0)",

                duration: .9,

                ease:
                    "power4.inOut"

            }
        )

        .fromTo(
            ".menu-nav a",

            {
                y: 70,
                opacity: 0
            },

            {

                y: 0,

                opacity: 1,

                duration: .75,

                stagger: .06,

                ease:
                    "power4.out"

            },

            "-=.35"
        );

}



/* =========================================================
   CLOSE MENU
========================================================= */

function closeMenu() {

    if (
        !menuOpen ||
        !menuOverlay
    ) {
        return;
    }


    menuOpen = false;


    gsap.to(
        menuOverlay,
        {

            clipPath:
                "inset(0 0 100% 0)",

            duration: .8,

            ease:
                "power4.inOut",

            onComplete: () => {

                gsap.set(
                    menuOverlay,
                    {
                        visibility:
                            "hidden"
                    }
                );


                document.body
                    .classList
                    .remove(
                        "menu-open"
                    );


                if (lenis) {
                    lenis.start();
                }

            }

        }
    );

}



/* =========================================================
   MENU EVENTS
========================================================= */

if (menuButton) {

    menuButton.addEventListener(
        "click",
        openMenu
    );

}


if (menuClose) {

    menuClose.addEventListener(
        "click",
        closeMenu
    );

}


menuLinks.forEach(
    (link) => {

        link.addEventListener(
            "click",
            closeMenu
        );

    }
);



/* =========================================================
   ESCAPE CLOSE
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "Escape"
        ) {

            closeMenu();

        }

    }
);



/* =========================================================
   SMOOTH ANCHOR LINKS
========================================================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !href ||
                        href === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            href
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    if (lenis) {

                        lenis.scrollTo(
                            target,
                            {

                                offset: 0,

                                duration:
                                    1.3

                            }
                        );

                    } else {

                        target.scrollIntoView({
                            behavior:
                                "smooth"
                        });

                    }

                }
            );

        }
    );



/* =========================================================
   REFRESH AFTER LOAD
========================================================= */

window.addEventListener(
    "load",
    () => {

        ScrollTrigger.refresh();

    }
);