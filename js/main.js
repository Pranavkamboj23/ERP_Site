/* =========================================================
   LENIS
========================================================= */

let lenis = null;


if (typeof Lenis !== "undefined") {

    lenis = new Lenis({

        duration: 1.05,

        smoothWheel: true,

        wheelMultiplier: 0.9,

        touchMultiplier: 1.1

    });


    lenis.on(
        "scroll",
        ScrollTrigger.update
    );


    gsap.ticker.add(
        (time) => {

            lenis.raf(
                time * 1000
            );

        }
    );


    gsap.ticker.lagSmoothing(0);

}



/* =========================================================
   MENU
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


    gsap.timeline()

        .set(
            menuOverlay,
            {
                visibility: "visible"
            }
        )

        .to(
            menuOverlay,
            {

                clipPath:
                    "inset(0 0 0% 0)",

                duration: .85,

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

                duration: .7,

                stagger: .05,

                ease:
                    "power4.out"

            },

            "-=.3"
        );

}



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

            duration: .75,

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


                document.body.classList.remove(
                    "menu-open"
                );


                if (lenis) {
                    lenis.start();
                }

            }

        }
    );

}



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
    link => {

        link.addEventListener(
            "click",
            closeMenu
        );

    }
);



document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeMenu();

        }

    }
);



/* =========================================================
   ANCHOR SCROLLING
========================================================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

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
                                duration:
                                    1.25
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
   BACK TO TOP
========================================================= */

const backTop =
    document.querySelector(
        ".back-top"
    );


if (backTop) {

    backTop.addEventListener(
        "click",
        () => {

            if (lenis) {

                lenis.scrollTo(
                    0,
                    {
                        duration: 1.4
                    }
                );

            } else {

                window.scrollTo({

                    top: 0,

                    behavior:
                        "smooth"

                });

            }

        }
    );

}



/* =========================================================
   RESIZE
========================================================= */

let resizeTimer;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(
                () => {

                    ScrollTrigger.refresh();

                },
                200
            );

    }
);