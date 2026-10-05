/* =========================================================
   REGISTER GSAP
========================================================= */

gsap.registerPlugin(
    ScrollTrigger
);



/* =========================================================
   HELPERS
========================================================= */

const q = (selector) =>
    document.querySelector(selector);


const qa = (selector) =>
    gsap.utils.toArray(selector);



/* =========================================================
   LOADER
========================================================= */

const loader =
    q(".loader");

const counter =
    q(".loader-counter");


const loaderObject = {
    value: 0
};


if (
    loader &&
    counter
) {

    gsap.to(
        loaderObject,
        {

            value: 100,

            duration: 1.6,

            ease:
                "power2.inOut",

            onUpdate: () => {

                counter.textContent =
                    Math.round(
                        loaderObject.value
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

const introTimeline =
    gsap.timeline({

        delay: 1.35,

        defaults: {
            ease:
                "power4.out"
        }

    });


if (loader) {

    introTimeline.to(
        loader,
        {

            yPercent: -100,

            duration: 1.05,

            ease:
                "power4.inOut",

            onComplete: () => {

                gsap.set(
                    loader,
                    {
                        display:
                            "none"
                    }
                );

            }

        }
    );

}


introTimeline

    .from(
        ".hero-media img",
        {

            scale: 1.35,

            duration: 1.8

        },

        "-=.55"
    )


    .from(
        ".hero-title-one",
        {

            yPercent: 120,

            duration: 1.2

        },

        "-=1.3"
    )


    .from(
        ".hero-title-two",
        {

            yPercent: 120,

            duration: 1.2

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

            duration: .8,

            stagger: .08,

            ease:
                "power3.out"

        },

        "-=.65"
    );



/* =========================================================
   HERO IMAGE PARALLAX
========================================================= */

gsap.to(
    ".hero-media img",
    {

        yPercent: 12,

        scale: 1.03,

        ease: "none",

        scrollTrigger: {

            trigger:
                ".hero",

            start:
                "top top",

            end:
                "bottom top",

            scrub: true

        }

    }
);



/* =========================================================
   HERO TEXT MOVEMENT
========================================================= */

gsap.to(
    ".hero-title-one",
    {

        xPercent: -12,

        ease: "none",

        scrollTrigger: {

            trigger:
                ".hero",

            start:
                "top top",

            end:
                "bottom top",

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

            trigger:
                ".hero",

            start:
                "top top",

            end:
                "bottom top",

            scrub: 1

        }

    }
);



/* =========================================================
   HERO OVERLAY
========================================================= */

gsap.to(
    ".hero-overlay",
    {

        backgroundColor:
            "rgba(0,0,0,.72)",

        ease: "none",

        scrollTrigger: {

            trigger:
                ".hero",

            start:
                "20% top",

            end:
                "bottom top",

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

            trigger:
                ".hero",

            start:
                "15% top",

            end:
                "60% top",

            scrub: true

        }

    }
);



/* =========================================================
   INTRO TOP
========================================================= */

gsap.from(
    ".intro-top",
    {

        opacity: 0,

        y: 30,

        duration: .8,

        ease:
            "power3.out",

        scrollTrigger: {

            trigger:
                ".intro",

            start:
                "top 75%"

        }

    }
);



/* =========================================================
   INTRO HEADLINE
========================================================= */

gsap.from(
    ".intro-line",
    {

        yPercent: 110,

        duration: 1.2,

        stagger: .12,

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



/* =========================================================
   INTRO COPY
========================================================= */

gsap.from(
    ".intro-copy > *",
    {

        opacity: 0,

        y: 45,

        duration: 1,

        stagger: .13,

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

let projectAnimating = false;



/* =========================================================
   PROJECT INITIAL STATES
========================================================= */

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



/* =========================================================
   PROJECT MASTER SCROLL
========================================================= */

if (
    projectImages.length &&
    projectTitles.length
) {

    ScrollTrigger.create({

        trigger:
            ".projects",

        start:
            "top top",

        end:
            "bottom bottom",

        onUpdate:
            (self) => {

                /*
                Progress bar
                */

                if (projectProgress) {

                    gsap.set(
                        projectProgress,
                        {

                            scaleX:
                                self.progress

                        }
                    );

                }


                /*
                Calculate project index.

                progress:
                0.00 -> project 0
                0.20 -> project 1
                etc.
                */

                const count =
                    projectImages.length;


                let newIndex =
                    Math.floor(
                        self.progress *
                        count
                    );


                newIndex =
                    Math.min(
                        count - 1,
                        Math.max(
                            0,
                            newIndex
                        )
                    );


                if (
                    newIndex !==
                    activeProject
                ) {

                    changeProject(
                        activeProject,
                        newIndex
                    );


                    activeProject =
                        newIndex;

                }

            }

    });

}



/* =========================================================
   CHANGE PROJECT
========================================================= */

function changeProject(
    oldIndex,
    newIndex
) {

    if (
        oldIndex === newIndex
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


    projectAnimating = true;


    /*
    Stop previous animations
    */

    gsap.killTweensOf(
        [
            oldImage,
            newImage,
            oldTitle,
            newTitle
        ]
    );


    /*
    --------------------------------------------
    IMAGE
    --------------------------------------------
    */

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


    const newImg =
        newImage
            .querySelector(
                "img"
            );


    if (newImg) {

        gsap.set(
            newImg,
            {

                scale: 1.18,

                yPercent:
                    direction > 0
                        ? 5
                        : -5

            }
        );

    }


    const imageTimeline =
        gsap.timeline({

            onComplete: () => {

                /*
                Hide all except
                current image
                */

                projectImages
                    .forEach(
                        (
                            image,
                            index
                        ) => {

                            if (
                                index !==
                                newIndex
                            ) {

                                gsap.set(
                                    image,
                                    {

                                        autoAlpha: 0,

                                        zIndex: 1

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


                projectAnimating =
                    false;

            }

        });


    imageTimeline

        .to(
            newImage,
            {

                clipPath:
                    "inset(0% 0 0 0)",

                duration: .95,

                ease:
                    "power4.inOut"

            }
        );


    if (newImg) {

        imageTimeline.to(
            newImg,
            {

                scale: 1.08,

                yPercent: 0,

                duration: 1.25,

                ease:
                    "power3.out"

            },

            0
        );

    }



    /*
    --------------------------------------------
    OLD TITLE OUT
    --------------------------------------------
    */

    gsap.to(
        oldTitle,
        {

            y:
                direction > 0
                    ? -90
                    : 90,

            autoAlpha: 0,

            duration: .45,

            ease:
                "power3.in"

        }
    );



    /*
    --------------------------------------------
    NEW TITLE
    --------------------------------------------
    */

    gsap.fromTo(
        newTitle,

        {

            y:
                direction > 0
                    ? 100
                    : -100,

            autoAlpha: 0

        },

        {

            y: 0,

            autoAlpha: 1,

            duration: .8,

            delay: .15,

            ease:
                "power4.out"

        }

    );



    /*
    --------------------------------------------
    NUMBER
    --------------------------------------------
    */

    if (projectCurrent) {

        gsap.killTweensOf(
            projectCurrent
        );


        gsap.to(
            projectCurrent,
            {

                y:
                    direction > 0
                        ? -10
                        : 10,

                opacity: 0,

                duration: .18,

                onComplete: () => {

                    projectCurrent
                        .textContent =
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

                            duration: .28,

                            ease:
                                "power2.out"

                        }

                    );

                }

            }
        );

    }

}



/* =========================================================
   PROJECT INTERNAL IMAGE MOVEMENT
========================================================= */

/*
Instead of applying a separate ScrollTrigger
to every invisible image, we move the visible
image slightly based on overall project progress.
*/

ScrollTrigger.create({

    trigger:
        ".projects",

    start:
        "top top",

    end:
        "bottom bottom",

    onUpdate:
        (self) => {

            if (
                !projectImages.length
            ) {
                return;
            }


            const current =
                projectImages[
                    activeProject
                ];


            if (!current) {
                return;
            }


            const image =
                current
                    .querySelector(
                        "img"
                    );


            if (!image) {
                return;
            }


            /*
            Local progress within
            current project.
            */

            const count =
                projectImages.length;


            const scaledProgress =
                self.progress *
                count;


            const localProgress =
                scaledProgress -
                Math.floor(
                    scaledProgress
                );


            const y =
                -3 +
                (
                    localProgress *
                    6
                );


            gsap.set(
                image,
                {
                    yPercent: y
                }
            );

        }

});



/* =========================================================
   PROJECT UI ENTRANCE
========================================================= */

gsap.from(
    [
        ".projects-top",
        ".project-number-wrap",
        ".projects-bottom"
    ],
    {

        opacity: 0,

        y: 20,

        duration: .8,

        stagger: .08,

        ease:
            "power3.out",

        scrollTrigger: {

            trigger:
                ".projects",

            start:
                "top 75%"

        }

    }
);



/* =========================================================
   PHILOSOPHY TOP
========================================================= */

gsap.from(
    ".philosophy-top",
    {

        opacity: 0,

        y: 30,

        duration: .8,

        ease:
            "power3.out",

        scrollTrigger: {

            trigger:
                ".philosophy",

            start:
                "top 75%"

        }

    }
);



/* =========================================================
   PHILOSOPHY TITLE
========================================================= */

gsap.from(
    ".philosophy-title h2",
    {

        yPercent: 110,

        duration: 1.2,

        stagger: .12,

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



/* =========================================================
   PHILOSOPHY COPY
========================================================= */

gsap.from(
    ".philosophy-copy p",
    {

        y: 60,

        opacity: 0,

        duration: 1,

        stagger: .15,

        ease:
            "power3.out",

        scrollTrigger: {

            trigger:
                ".philosophy-copy",

            start:
                "top 80%"

        }

    }
);



/* =========================================================
   PHILOSOPHY INDEX
========================================================= */

gsap.from(
    ".philosophy-index",
    {

        opacity: 0,

        y: 30,

        duration: .8,

        ease:
            "power3.out",

        scrollTrigger: {

            trigger:
                ".philosophy-grid",

            start:
                "top 82%"

        }

    }
);



/* =========================================================
   REFRESH
========================================================= */

window.addEventListener(
    "load",
    () => {

        ScrollTrigger.refresh();

    }
);