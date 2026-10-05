gsap.registerPlugin(
    ScrollTrigger
);



/* =========================================================
   LOADER
========================================================= */

const counter =
    document.querySelector(
        ".loader-counter"
    );


const loaderObject = {
    value: 0
};



gsap.to(
    loaderObject,
    {

        value: 100,

        duration: 1.7,

        ease: "power2.inOut",

        onUpdate: () => {

            counter.textContent =
                Math.round(
                    loaderObject.value
                )
                .toString()
                .padStart(2, "0");

        }

    }
);



/* =========================================================
   INITIAL HERO TIMELINE
========================================================= */

const introTimeline =
    gsap.timeline({
        delay: 1.5
    });



introTimeline

    .to(
        ".loader",
        {

            yPercent: -100,

            duration: 1.1,

            ease: "power4.inOut"

        }
    )


    .from(
        ".hero-media img",
        {

            scale: 1.35,

            duration: 1.8,

            ease: "power3.out"

        },
        "-=.55"
    )


    .from(
        ".hero-title-one",
        {

            yPercent: 120,

            duration: 1.2,

            ease: "power4.out"

        },
        "-=1.3"
    )


    .from(
        ".hero-title-two",
        {

            yPercent: 120,

            duration: 1.2,

            ease: "power4.out"

        },
        "-=1.05"
    )


    .from(
        [
            ".hero-meta",
            ".hero-description",
            ".scroll-indicator",
            ".hero-index"
        ],
        {

            y: 20,

            opacity: 0,

            duration: 0.8,

            stagger: 0.08,

            ease: "power3.out"

        },
        "-=.65"
    );



/* =========================================================
   HERO PARALLAX
========================================================= */

gsap.to(
    ".hero-media img",
    {

        yPercent: 12,

        scale: 1.03,

        ease: "none",

        scrollTrigger: {

            trigger: ".hero",

            start: "top top",

            end: "bottom top",

            scrub: true

        }

    }
);



/* =========================================================
   HERO TEXT SCROLL
========================================================= */

gsap.to(
    ".hero-title-one",
    {

        xPercent: -12,

        ease: "none",

        scrollTrigger: {

            trigger: ".hero",

            start: "top top",

            end: "bottom top",

            scrub: 1

        }

    }
);



gsap.to(
    ".hero-title-two",
    {

        xPercent: 12,

        ease: "none",

        scrollTrigger: {

            trigger: ".hero",

            start: "top top",

            end: "bottom top",

            scrub: 1

        }

    }
);



/* =========================================================
   HERO DARKEN ON EXIT
========================================================= */

gsap.to(
    ".hero-overlay",
    {

        backgroundColor:
            "rgba(0,0,0,.7)",

        ease: "none",

        scrollTrigger: {

            trigger: ".hero",

            start: "20% top",

            end: "bottom top",

            scrub: true

        }

    }
);



/* =========================================================
   HERO BOTTOM EXIT
========================================================= */

gsap.to(
    ".hero-bottom",
    {

        y: -50,

        opacity: 0,

        ease: "none",

        scrollTrigger: {

            trigger: ".hero",

            start: "15% top",

            end: "60% top",

            scrub: true

        }

    }
);



/* =========================================================
   INTRO TEXT REVEAL
========================================================= */

gsap.from(
    ".intro-line",
    {

        yPercent: 110,

        duration: 1.2,

        stagger: 0.12,

        ease: "power4.out",

        scrollTrigger: {

            trigger:
                ".intro-heading",

            start:
                "top 78%"

        }

    }
);



/* =========================================================
   INTRO SMALL LABELS
========================================================= */

gsap.from(
    ".intro-top",
    {

        opacity: 0,

        y: 30,

        duration: 0.8,

        ease: "power3.out",

        scrollTrigger: {

            trigger: ".intro",

            start:
                "top 75%"

        }

    }
);



/* =========================================================
   INTRO COPY
========================================================= */

gsap.from(
    ".intro-copy > *",
    {

        opacity: 0,

        y: 45,

        duration: 1,

        stagger: 0.13,

        ease: "power3.out",

        scrollTrigger: {

            trigger:
                ".intro-copy",

            start:
                "top 82%"

        }

    }
);



/* =========================================================
   NEXT SECTION
========================================================= */

gsap.from(
    ".projects-placeholder h2",
    {

        y: 130,

        opacity: 0,

        duration: 1.3,

        ease: "power4.out",

        scrollTrigger: {

            trigger:
                ".projects-placeholder",

            start:
                "top 70%"

        }

    }
);