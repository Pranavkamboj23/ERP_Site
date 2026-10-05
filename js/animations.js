gsap.registerPlugin(
    ScrollTrigger
);


const q =
    selector =>
        document.querySelector(
            selector
        );


const qa =
    selector =>
        gsap.utils.toArray(
            selector
        );



/* =========================================================
   LOADER
========================================================= */

const loader =
    q(".loader");

const counter =
    q(".loader-counter");


const loaderValue = {
    value: 0
};


if (
    loader &&
    counter
) {

    gsap.to(
        loaderValue,
        {

            value: 100,

            duration: 1.45,

            ease:
                "power2.inOut",

            onUpdate: () => {

                counter.textContent =
                    Math.round(
                        loaderValue.value
                    )
                    .toString()
                    .padStart(
                        2,
                        "0"
                    );

            }

        }
    );

}



/* =========================================================
   HERO INTRO
========================================================= */

const heroIntro =
    gsap.timeline({
        delay: 1.25
    });


heroIntro

    .to(
        loader,
        {

            yPercent: -100,

            duration: 1,

            ease:
                "power4.inOut",

            onComplete: () => {

                if (loader) {

                    loader.style.display =
                        "none";

                }

            }

        }
    )


    .from(
        ".hero-media img",
        {

            scale: 1.35,

            duration: 1.8,

            ease:
                "power3.out"

        },

        "-=.55"
    )


    .from(
        ".hero-title-one",
        {

            yPercent: 120,

            duration: 1.15,

            ease:
                "power4.out"

        },

        "-=1.3"
    )


    .from(
        ".hero-title-two",
        {

            yPercent: 120,

            duration: 1.15,

            ease:
                "power4.out"

        },

        "-=1"
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

            duration: .75,

            stagger: .07,

            ease:
                "power3.out"

        },

        "-=.6"
    );



/* =========================================================
   HERO SCROLL
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


gsap.to(
    ".hero-bottom",
    {

        y: -45,

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
   INTRO
========================================================= */

gsap.from(
    ".intro .section-top",
    {

        opacity: 0,

        y: 30,

        duration: .8,

        scrollTrigger: {

            trigger: ".intro",

            start: "top 75%"

        }

    }
);


gsap.from(
    ".intro-line",
    {

        yPercent: 110,

        duration: 1.15,

        stagger: .1,

        ease:
            "power4.out",

        scrollTrigger: {

            trigger:
                ".intro-heading",

            start:
                "top 78%"

        }

    }
);


gsap.from(
    ".intro-copy > *",
    {

        opacity: 0,

        y: 45,

        duration: .9,

        stagger: .12,

        ease:
            "power3.out",

        scrollTrigger: {

            trigger:
                ".intro-copy",

            start:
                "top 82%"

        }

    }
);



/* =========================================================
   PROJECTS
========================================================= */

const projectImages =
    qa(".project-image");

const projectTitles =
    qa(".project-title");

const projectCurrent =
    q(".project-current");

const projectProgress =
    q(".project-progress-line");


let activeProject = 0;



projectImages.forEach(
    (image, index) => {

        gsap.set(
            image,
            {

                autoAlpha:
                    index === 0
                        ? 1
                        : 0,

                clipPath:
                    "inset(0 0 0 0)",

                zIndex:
                    index === 0
                        ? 2
                        : 1

            }
        );

    }
);


projectTitles.forEach(
    (title, index) => {

        gsap.set(
            title,
            {

                autoAlpha:
                    index === 0
                        ? 1
                        : 0,

                y:
                    index === 0
                        ? 0
                        : 80

            }
        );

    }
);



if (
    projectImages.length &&
    projectTitles.length
) {

    ScrollTrigger.create({

        trigger: ".projects",

        start: "top top",

        end: "bottom bottom",

        onUpdate: self => {

            if (projectProgress) {

                gsap.set(
                    projectProgress,
                    {
                        scaleX:
                            self.progress
                    }
                );

            }


            const count =
                projectImages.length;


            let index =
                Math.floor(
                    self.progress *
                    count
                );


            index =
                Math.min(
                    count - 1,
                    Math.max(
                        0,
                        index
                    )
                );


            if (
                index !==
                activeProject
            ) {

                changeProject(
                    activeProject,
                    index
                );


                activeProject =
                    index;

            }


            const currentImage =
                projectImages[
                    activeProject
                ];


            const image =
                currentImage
                    ?.querySelector(
                        "img"
                    );


            if (image) {

                const scaled =
                    self.progress *
                    count;


                const local =
                    scaled -
                    Math.floor(
                        scaled
                    );


                gsap.set(
                    image,
                    {

                        yPercent:
                            -3 +
                            local * 6

                    }
                );

            }

        }

    });

}



/* =========================================================
   PROJECT CHANGE
========================================================= */

function changeProject(
    oldIndex,
    newIndex
) {

    if (
        oldIndex ===
        newIndex
    ) {
        return;
    }


    const oldImage =
        projectImages[
            oldIndex
        ];

    const newImage =
        projectImages[
            newIndex
        ];

    const oldTitle =
        projectTitles[
            oldIndex
        ];

    const newTitle =
        projectTitles[
            newIndex
        ];


    if (
        !oldImage ||
        !newImage ||
        !oldTitle ||
        !newTitle
    ) {
        return;
    }


    const direction =
        newIndex >
        oldIndex
            ? 1
            : -1;


    gsap.killTweensOf(
        [
            oldImage,
            newImage,
            oldTitle,
            newTitle
        ]
    );


    gsap.set(
        newImage,
        {

            autoAlpha: 1,

            zIndex: 3,

            clipPath:
                direction > 0

                ? "inset(100% 0 0 0)"

                : "inset(0 0 100% 0)"

        }
    );


    gsap.set(
        oldImage,
        {
            zIndex: 2
        }
    );


    const image =
        newImage
            .querySelector(
                "img"
            );


    if (image) {

        gsap.set(
            image,
            {

                scale: 1.17,

                yPercent:
                    direction > 0
                        ? 5
                        : -5

            }
        );

    }


    const tl =
        gsap.timeline({

            onComplete: () => {

                projectImages
                    .forEach(
                        (
                            item,
                            index
                        ) => {

                            if (
                                index !==
                                newIndex
                            ) {

                                gsap.set(
                                    item,
                                    {
                                        autoAlpha:
                                            0,

                                        zIndex:
                                            1
                                    }
                                );

                            }

                        }
                    );


                gsap.set(
                    newImage,
                    {

                        zIndex: 2,

                        clipPath:
                            "inset(0 0 0 0)"

                    }
                );

            }

        });


    tl.to(
        newImage,
        {

            clipPath:
                "inset(0 0 0 0)",

            duration: .85,

            ease:
                "power4.inOut"

        }
    );


    if (image) {

        tl.to(
            image,
            {

                scale: 1.08,

                yPercent: 0,

                duration: 1.1,

                ease:
                    "power3.out"

            },

            0
        );

    }


    gsap.to(
        oldTitle,
        {

            y:
                direction > 0
                    ? -80
                    : 80,

            autoAlpha: 0,

            duration: .4,

            ease:
                "power3.in"

        }
    );


    gsap.fromTo(
        newTitle,

        {

            y:
                direction > 0
                    ? 90
                    : -90,

            autoAlpha: 0

        },

        {

            y: 0,

            autoAlpha: 1,

            duration: .75,

            delay: .12,

            ease:
                "power4.out"

        }
    );


    if (projectCurrent) {

        gsap.to(
            projectCurrent,
            {

                y:
                    direction > 0
                        ? -10
                        : 10,

                opacity: 0,

                duration: .15,

                onComplete: () => {

                    projectCurrent.textContent =
                        String(
                            newIndex + 1
                        )
                        .padStart(
                            2,
                            "0"
                        );


                    gsap.fromTo(
                        projectCurrent,

                        {

                            y:
                                direction > 0
                                    ? 10
                                    : -10,

                            opacity: 0

                        },

                        {

                            y: 0,

                            opacity: 1,

                            duration: .25

                        }

                    );

                }

            }
        );

    }

}



/* =========================================================
   PHILOSOPHY
========================================================= */

gsap.from(
    ".philosophy-title h2",
    {

        yPercent: 110,

        duration: 1.15,

        stagger: .1,

        ease:
            "power4.out",

        scrollTrigger: {

            trigger:
                ".philosophy-title",

            start:
                "top 80%"

        }

    }
);


gsap.from(
    ".philosophy-copy p",
    {

        y: 50,

        opacity: 0,

        duration: .9,

        stagger: .12,

        scrollTrigger: {

            trigger:
                ".philosophy-copy",

            start:
                "top 80%"

        }

    }
);



/* =========================================================
   EXPANSION
========================================================= */

const expansionTimeline =
    gsap.timeline({

        scrollTrigger: {

            trigger:
                ".expansion",

            start:
                "top top",

            end:
                "bottom bottom",

            scrub: 1

        }

    });


expansionTimeline

    .to(
        ".expansion-frame",
        {

            width:
                "100vw",

            height:
                "100vh",

            ease: "none"

        },

        0
    )


    .to(
        ".expansion-frame img",
        {

            scale: 1.12,

            yPercent: 5,

            ease: "none"

        },

        0
    )


    .to(
        ".expansion-word-left",
        {

            xPercent: -40,

            ease: "none"

        },

        0
    )


    .to(
        ".expansion-word-right",
        {

            xPercent: 40,

            ease: "none"

        },

        0
    )


    .to(
        ".expansion-word",
        {

            opacity: 0,

            duration: .22

        },

        .72
    );



/* =========================================================
   STATEMENT
========================================================= */

gsap.from(
    ".statement-copy h2",
    {

        yPercent: 110,

        duration: 1.15,

        stagger: .1,

        ease:
            "power4.out",

        scrollTrigger: {

            trigger:
                ".statement-copy",

            start:
                "top 82%"

        }

    }
);


gsap.from(
    ".statement-bottom > *",
    {

        y: 40,

        opacity: 0,

        duration: .8,

        stagger: .1,

        scrollTrigger: {

            trigger:
                ".statement-bottom",

            start:
                "top 85%"

        }

    }
);



/* =========================================================
   PROCESS
========================================================= */

gsap.from(
    ".process-intro h2",
    {

        y: 70,

        opacity: 0,

        duration: 1.1,

        ease:
            "power4.out",

        scrollTrigger: {

            trigger:
                ".process-intro",

            start:
                "top 80%"

        }

    }
);


gsap.from(
    ".process-item",
    {

        y: 60,

        opacity: 0,

        duration: .9,

        stagger: .12,

        ease:
            "power3.out",

        scrollTrigger: {

            trigger:
                ".process-grid",

            start:
                "top 82%"

        }

    }
);



/* =========================================================
   MARQUEE
========================================================= */

gsap.to(
    ".marquee-track",
    {

        xPercent: -50,

        ease: "none",

        scrollTrigger: {

            trigger:
                ".marquee-section",

            start:
                "top bottom",

            end:
                "bottom top",

            scrub: 1

        }

    }
);



/* =========================================================
   CONTACT
========================================================= */

gsap.from(
    ".contact-title",
    {

        y: 100,

        opacity: 0,

        duration: 1.1,

        ease:
            "power4.out",

        scrollTrigger: {

            trigger:
                ".contact",

            start:
                "top 70%"

        }

    }
);



/* =========================================================
   CURSOR
========================================================= */

const cursor =
    q(".cursor");


if (
    cursor &&
    window.matchMedia(
        "(pointer:fine)"
    ).matches
) {

    const moveX =
        gsap.quickTo(
            cursor,
            "x",
            {

                duration: .3,

                ease:
                    "power3"

            }
        );


    const moveY =
        gsap.quickTo(
            cursor,
            "y",
            {

                duration: .3,

                ease:
                    "power3"

            }
        );


    window.addEventListener(
        "mousemove",
        event => {

            moveX(
                event.clientX
            );

            moveY(
                event.clientY
            );


            gsap.to(
                cursor,
                {

                    opacity: 1,

                    duration: .15

                }
            );

        }
    );


    const projects =
        q(".projects-sticky");


    if (projects) {

        projects.addEventListener(
            "mouseenter",
            () => {

                gsap.to(
                    cursor,
                    {

                        scale: 1,

                        duration: .35,

                        ease:
                            "power3.out"

                    }
                );


                gsap.to(
                    ".cursor-label",
                    {
                        opacity: 1
                    }
                );


                gsap.to(
                    ".cursor-dot",
                    {
                        opacity: 0
                    }
                );

            }
        );


        projects.addEventListener(
            "mouseleave",
            () => {

                gsap.to(
                    cursor,
                    {

                        scale: .18,

                        duration: .35

                    }
                );


                gsap.to(
                    ".cursor-label",
                    {
                        opacity: 0
                    }
                );


                gsap.to(
                    ".cursor-dot",
                    {
                        opacity: 1
                    }
                );

            }
        );

    }

}



/* =========================================================
   MAGNETIC ELEMENTS
========================================================= */

if (
    window.matchMedia(
        "(pointer:fine)"
    ).matches
) {

    qa(".magnetic")
        .forEach(
            element => {

                element.addEventListener(
                    "mousemove",
                    event => {

                        const rect =
                            element
                                .getBoundingClientRect();


                        const x =
                            event.clientX -
                            rect.left -
                            rect.width / 2;


                        const y =
                            event.clientY -
                            rect.top -
                            rect.height / 2;


                        gsap.to(
                            element,
                            {

                                x:
                                    x * .06,

                                y:
                                    y * .1,

                                duration:
                                    .35,

                                ease:
                                    "power3.out"

                            }
                        );

                    }
                );


                element.addEventListener(
                    "mouseleave",
                    () => {

                        gsap.to(
                            element,
                            {

                                x: 0,

                                y: 0,

                                duration:
                                    .6,

                                ease:
                                    "elastic.out(1,.45)"

                            }
                        );

                    }
                );

            }
        );

}



/* =========================================================
   FINAL REFRESH
========================================================= */

window.addEventListener(
    "load",
    () => {

        ScrollTrigger.refresh();

    }
);