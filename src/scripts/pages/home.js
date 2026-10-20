/* =========================================================
   HOME PAGE — RESTORED ORIGINAL INTERACTIONS
========================================================= */

/* =========================================================
   PROJECT SLIDES
========================================================= */

const slides = [...document.querySelectorAll(".project-slide")];
const nextButtons = document.querySelectorAll(".project-next");

let activeSlide = 0;
let slideAnimating = false;

function showSlide(nextIndex) {
  if (!slides.length || slideAnimating) return;

  const current = slides[activeSlide];
  const next = slides[nextIndex];

  if (!current || !next || current === next) return;

  slideAnimating = true;

  gsap.set(next, {
    visibility: "visible",
    autoAlpha: 1,
    zIndex: 3,
    clipPath: "inset(100% 0 0 0)"
  });

  gsap.set(current, {
    zIndex: 2
  });

  const nextImage = next.querySelector("img");

  if (nextImage) {
    gsap.set(nextImage, {
      scale: 1.1
    });
  }

  gsap.timeline({
    onComplete: () => {
      slides.forEach((slide, index) => {
        if (index !== nextIndex) {
          gsap.set(slide, {
            visibility: "hidden",
            autoAlpha: 0,
            zIndex: 1
          });
        }
      });

      gsap.set(next, {
        clipPath: "inset(0 0 0 0)",
        zIndex: 2
      });

      activeSlide = nextIndex;
      slideAnimating = false;
    }
  })
  .to(next, {
    clipPath: "inset(0 0 0 0)",
    duration: 0.82,
    ease: "power4.inOut"
  })
  .to(nextImage, {
    scale: 1,
    duration: 1,
    ease: "power3.out"
  }, 0)
  .fromTo(
    next.querySelector(".project-copy"),
    {
      y: 34,
      autoAlpha: 0
    },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.55,
      ease: "power3.out"
    },
    0.25
  );
}

nextButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const nextIndex = (index + 1) % slides.length;
    showSlide(nextIndex);
  });
});


/* =========================================================
   HOME PAGE — RESTORED ORIGINAL GSAP / SCROLLTRIGGER MOTION
========================================================= */

/* =========================================================
   GSAP SETUP
========================================================= */

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize"
});

if (typeof SplitText !== "undefined") {
  gsap.registerPlugin(SplitText);
}

const q = selector => document.querySelector(selector);
const qa = selector => gsap.utils.toArray(selector);

const isMobile = () => window.matchMedia("(max-width: 767px)").matches;


/* =========================================================
   SPLIT HELPERS
========================================================= */

function splitElement(element, type = "chars") {
  if (!element || typeof SplitText === "undefined") return null;

  const split = new SplitText(element, {
    type: type === "words" ? "words" : "words,chars",
    charsClass: "char-wrap",
    wordsClass: "word-wrap"
  });

  element.__split = split;

  gsap.set(split.words, {
    display: "inline-block",
    whiteSpace: "nowrap"
  });

  return split;
}

function prepareSplitReveals() {
  qa('[data-reveal="chars"]').forEach(element => {
    const split = splitElement(element, "chars");
    if (!split) return;

    gsap.set(split.chars, {
      opacity: 0,
      yPercent: isMobile() ? 12 : 20,
      willChange: "transform,opacity",
      force3D: true,
      backfaceVisibility: "hidden",
      display: "inline-block"
    });

    ScrollTrigger.create({
      trigger: element,
      start: "top 84%",
      once: true,
      onEnter: () => {
        gsap.to(split.chars, {
          opacity: 1,
          yPercent: 0,
          duration: isMobile() ? 0.9 : 1.35,
          stagger: isMobile() ? 0.015 : 0.028,
          ease: "power2.out",
          force3D: true,
          clearProps: "willChange"
        });
      }
    });
  });

  qa('[data-reveal="words"]').forEach(element => {
    const split = splitElement(element, "words");
    if (!split) return;

    gsap.set(split.words, {
      opacity: 0,
      yPercent: isMobile() ? 10 : 20,
      willChange: "transform,opacity",
      display: "inline-block"
    });

    ScrollTrigger.create({
      trigger: element,
      start: "top 86%",
      once: true,
      onEnter: () => {
        gsap.to(split.words, {
          opacity: 1,
          yPercent: 0,
          duration: isMobile() ? 0.75 : 1.15,
          stagger: isMobile() ? 0.015 : 0.025,
          ease: "power2.out",
          clearProps: "willChange"
        });
      }
    });
  });
}


/* =========================================================
   PRELOADER -> HERO
========================================================= */

function initPreloader() {
  const preloader = q(".preloader");
  const imageHero = q(".image-hero");
  const heroImg = q(".hero-img");
  const heroContent = q(".hero-content");
  const header = q(".header");
  const preloaderCount = q(".preloader-count");
  const heroTitles = qa('[data-preload="main-head"]');

  if (!preloader || !imageHero) {
    if (header) header.classList.remove("is-hide");
    if (heroContent) gsap.set(heroContent, { autoAlpha: 1, y: 0 });
    return;
  }

  if (window.lenis) window.lenis.stop();

  const mobile = isMobile();

  gsap.set(imageHero, {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: mobile ? "11svw" : "4svw",
    height: mobile ? "11svw" : "4svw",
    overflow: "hidden",
    xPercent: -50,
    yPercent: -50
  });

  gsap.set(heroImg, {
    opacity: 1,
    filter: "none",
    scale: 1,
    transformOrigin: "center center"
  });

  gsap.set(heroContent, {
    opacity: 0,
    y: mobile ? "1.5%" : "3%"
  });

  if (header) header.classList.add("is-hide");

  const preloadHeadSplit = splitElement(q(".preloader-text p"), "chars");
  const preloadBodySplit = splitElement(q(".preloader-text > span"), "words");
  const heroSplits = heroTitles
    .map(element => splitElement(element, "chars"))
    .filter(Boolean);

  if (preloadHeadSplit) {
    gsap.set(preloadHeadSplit.chars, {
      opacity: 0,
      yPercent: 20,
      display: "inline-block"
    });
  }

  if (preloadBodySplit) {
    gsap.set(preloadBodySplit.words, {
      opacity: 0,
      yPercent: 20,
      display: "inline-block"
    });
  }

  heroSplits.forEach(split => {
    gsap.set(split.chars, {
      opacity: 0,
      yPercent: mobile ? 70 : 115,
      willChange: "transform,opacity",
      force3D: true,
      backfaceVisibility: "hidden",
      display: "inline-block"
    });
  });

  const counter = { value: 0 };

  gsap.to(counter, {
    value: 100,
    duration: mobile ? 0.95 : 1.45,
    ease: "power2.inOut",
    onUpdate: () => {
      if (preloaderCount) {
        preloaderCount.textContent =
          String(Math.round(counter.value)).padStart(2, "0");
      }
    }
  });

  if (preloadHeadSplit) {
    gsap.to(preloadHeadSplit.chars, {
      opacity: 1,
      yPercent: 0,
      duration: mobile ? 0.7 : 1.05,
      stagger: mobile ? 0.012 : 0.022,
      ease: "power2.out"
    });
  }

  if (preloadBodySplit && !mobile) {
    gsap.to(preloadBodySplit.words, {
      opacity: 1,
      yPercent: 0,
      duration: 0.95,
      stagger: 0.025,
      ease: "power2.out"
    });
  }

  const first = qa(".preload-tile.first");
  const second = qa(".preload-tile.second");

  const offsets = mobile
    ? [22,-22,18,-18,14,-14,10,-10,7,-7,4,-4,2,-2]
    : [30.8,-30.8,26.4,-26.4,22,-22,17.6,-17.6,13.2,-13.2,8.8,-8.8,4.4,-4.4];

  const tiles = [];

  first.forEach((tile,index) => {
    tiles.push({ tile, x: offsets[index * 2] || 0 });
  });

  second.forEach((tile,index) => {
    tiles.push({ tile, x: offsets[index * 2 + 1] || 0 });
  });

  const tl = gsap.timeline({
    delay: mobile ? 0.55 : 0.95,
    onComplete: () => {
      gsap.set(preloader, { display: "none" });

      if (header) header.classList.remove("is-hide");
      if (window.lenis) window.lenis.start();

      ScrollTrigger.refresh();
    }
  });

  tl.to(first, {
    y: mobile ? "-4vw" : "-2.2svw",
    duration: mobile ? 0.35 : 0.58,
    ease: "power2.out"
  }, 0);

  tl.to(second, {
    y: mobile ? "4vw" : "2.2svw",
    duration: mobile ? 0.35 : 0.58,
    ease: "power2.out"
  }, 0.05);

  tiles.forEach((item,index) => {
    tl.to(item.tile, {
      x: mobile ? `${item.x}vw` : `${item.x}svw`,
      opacity: index < 4 ? 0 : 1,
      duration: mobile ? 0.28 : 0.48,
      ease: "power2.out"
    }, (mobile ? 0.55 : 0.98) + index * (mobile ? 0.01 : 0.018));
  });

  if (preloadHeadSplit) {
    tl.to(preloadHeadSplit.chars, {
      opacity: 0,
      yPercent: 20,
      duration: mobile ? 0.35 : 0.65,
      stagger: {
        each: mobile ? 0.01 : 0.026,
        from: "end"
      },
      ease: "power2.out"
    }, mobile ? 0.9 : 1.45);
  }

  tl.to(".preloader-back, .preloader-grid", {
    opacity: 0,
    duration: mobile ? 0.2 : 0.28
  }, mobile ? 1.05 : 1.82);

  tl.to(preloader, {
    backgroundColor: "transparent",
    duration: mobile ? 0.2 : 0.28
  }, mobile ? 1.05 : 1.82);

  tl.to(imageHero, {
    width: mobile ? "68vw" : "42svw",
    height: mobile ? "38vh" : "28svw",
    duration: mobile ? 0.48 : 0.72,
    ease: "power2.inOut"
  }, mobile ? 1.05 : 1.82);

  tl.to(heroImg, {
    scale: mobile ? 1.12 : 1.25,
    duration: mobile ? 0.75 : 1.45,
    ease: "power3.inOut"
  }, mobile ? 1.08 : 1.9);

  tl.to(imageHero, {
    top: 0,
    left: 0,
    xPercent: 0,
    yPercent: 0,
    width: "100svw",
    height: "100svh",
    duration: mobile ? 0.48 : 0.72,
    ease: "power2.inOut"
  }, mobile ? 1.48 : 2.5);

  tl.to(heroContent, {
    opacity: 1,
    y: "0%",
    duration: mobile ? 0.3 : 0.4,
    ease: "power2.out"
  }, mobile ? 1.7 : 2.62);

  heroSplits.forEach((split,index) => {
    tl.to(split.chars, {
      opacity: 1,
      yPercent: 0,
      duration: mobile ? 0.7 : 1.1,
      stagger: mobile ? 0.014 : 0.024,
      ease: "power4.out",
      force3D: true,
      clearProps: "willChange"
    }, (mobile ? 1.7 : 2.62) + index * 0.06);
  });

  tl.to(".preloader-text, .preloader-head", {
    opacity: 0,
    duration: 0.18
  }, mobile ? 1.7 : 2.62);

  tl.call(() => {
    if (header) header.classList.remove("is-hide");
  }, null, mobile ? 2.1 : 3.45);
}


/* =========================================================
   HERO SCROLL
========================================================= */

const heroMM = gsap.matchMedia();

heroMM.add("(min-width: 768px)", () => {
  gsap.to(".hero-img", {
    yPercent: 10,
    scale: 1.04,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.8
    }
  });

  gsap.to(".hero-title-one", {
    xPercent: -12,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.8
    }
  });

  gsap.to(".hero-title-two", {
    xPercent: 12,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.8
    }
  });

  gsap.to(".hero-bottom", {
    y: -45,
    autoAlpha: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "15% top",
      end: "70% top",
      scrub: 0.8
    }
  });
});

heroMM.add("(max-width: 767px)", () => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.55,
      invalidateOnRefresh: true
    }
  });

  tl.to(".hero-img", {
    yPercent: 9,
    scale: 1.07,
    ease: "none"
  }, 0)
  .to(".hero-title-one", {
    xPercent: -18,
    ease: "none"
  }, 0)
  .to(".hero-title-two", {
    xPercent: 18,
    ease: "none"
  }, 0)
  .to(".hero-meta", {
    y: -18,
    autoAlpha: 0,
    ease: "none"
  }, 0.08)
  .to(".hero-bottom", {
    y: -38,
    autoAlpha: 0,
    ease: "none"
  }, 0.12);
});


/* =========================================================
   INTRO HORIZONTAL STORY
========================================================= */

const introMM = gsap.matchMedia();

function getViewportHeight() {
  return Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
}



introMM.add("(min-width: 768px)", () => {
  const section = q(".intro-horizontal");
  const track = q(".intro-horizontal-track");
  const progress = q(".intro-horizontal-progress-fill");

  if (!section || !track) return;

  const tween = gsap.to(track, {
    x: () => {
      const maxTravel = Math.max(
        0,
        track.scrollWidth - window.innerWidth + window.innerWidth * 0.04
      );

      return -maxTravel;
    },
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      invalidateOnRefresh: true,
      onUpdate: self => {
        if (progress) {
          gsap.set(progress, { scaleX: self.progress });
        }
      }
    }
  });

  qa(".intro-h-image img").forEach(image => {
    const card = image.closest(".intro-h-card");

    gsap.fromTo(
      image,
      { xPercent: -4 },
      {
        xPercent: 4,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          containerAnimation: tween,
          start: "left right",
          end: "right left",
          scrub: true
        }
      }
    );
  });
});

introMM.add("(max-width: 767px)", () => {
  const section = q(".intro-horizontal");
  const track = q(".intro-horizontal-track");
  const progress = q(".intro-horizontal-progress-fill");

  if (!section || !track) return;

  const travel = () => Math.max(
    0,
    Math.min(
      track.scrollWidth - window.innerWidth * 0.92,
      window.innerWidth * 2.55
    )
  );

  gsap.fromTo(
    track,
    { x: 0 },
    {
      x: () => -travel(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 92%",
        end: "bottom 8%",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: self => {
          if (progress) {
            gsap.set(progress, {
              scaleX: self.progress
            });
          }
        }
      }
    }
  );

  qa(".intro-h-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        y: index % 2 === 0 ? 36 : -24
      },
      {
        y: index % 2 === 0 ? -20 : 18,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );
  });

  qa(".intro-h-image img").forEach(image => {
    gsap.fromTo(
      image,
      { xPercent: -5, scale: 1.06 },
      {
        xPercent: 5,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );
  });
});


/* =========================================================
   SERVICES
========================================================= */

gsap.from(".service-card", {
  y: 42,
  autoAlpha: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".services-grid",
    start: "top 84%",
    once: true
  }
});


/* =========================================================
   PROJECT REVEAL
   Desktop keeps the premium scale sequence.
   Mobile shows the slider full-screen without heavy pinning.
========================================================= */

const projectMM = gsap.matchMedia();

projectMM.add("(min-width: 768px)", () => {
  gsap.set(".project-slide.is-active .project-copy", {
    autoAlpha: 0,
    y: 55
  });

  gsap.set(".project-slide.is-active .project-next", {
    autoAlpha: 0
  });

  const projectRevealTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".project-reveal",
      start: "top -50%",
      end: "bottom bottom",
      scrub: 0.8
    }
  });

  projectRevealTL
    .fromTo(
      ".project-back-two",
      { scale: 0.65 },
      {
        scale: 1.5,
        duration: 3,
        ease: "power2.inOut"
      },
      0
    )
    .fromTo(
      ".project-back-one",
      { scale: 0.65 },
      {
        scale: 1.25,
        duration: 3,
        ease: "power2.inOut"
      },
      0.1
    )
    .fromTo(
      ".project-slider",
      { scale: 0.65 },
      {
        scale: 1,
        duration: 3,
        ease: "power2.inOut"
      },
      0.2
    )
    .to(
      ".project-slide.is-active .project-copy",
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out"
      },
      2.18
    )
    .to(
      ".project-slide.is-active .project-next",
      {
        autoAlpha: 1,
        duration: 0.35
      },
      2.35
    );

  gsap.timeline({
    scrollTrigger: {
      trigger: ".project-reveal",
      start: "top bottom",
      end: "top 35%",
      scrub: 0.8
    }
  })
  .fromTo(
    ".chess-left",
    { height: "65svh" },
    {
      height: "0svh",
      duration: 1,
      ease: "power2.inOut"
    },
    0
  )
  .fromTo(
    ".chess-right",
    { height: "25svh" },
    {
      height: "0svh",
      duration: 1,
      ease: "power2.inOut"
    },
    0
  );
});

projectMM.add("(max-width: 767px)", () => {
  const section = q(".project-reveal");

  if (!section) return;

  gsap.set(".project-slide.is-active .project-copy", {
    autoAlpha: 0,
    y: 38
  });

  gsap.set(".project-slide.is-active .project-next", {
    autoAlpha: 0,
    y: 14
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 82%",
      end: "bottom 18%",
      scrub: true
    }
  });

  tl.fromTo(
    ".project-back-two",
    { scale: 0.74 },
    { scale: 1.28, duration: 1.25, ease: "none" },
    0
  )
  .fromTo(
    ".project-back-one",
    { scale: 0.77 },
    { scale: 1.14, duration: 1.25, ease: "none" },
    0
  )
  .fromTo(
    ".project-slider",
    { scale: 0.80 },
    { scale: 1, duration: 1.25, ease: "none" },
    0
  )
  .fromTo(
    ".project-slide.is-active > img",
    { scale: 1.10 },
    { scale: 1, duration: 1.25, ease: "none" },
    0
  )
  .fromTo(
    ".chess-left",
    { height: "35svh" },
    { height: "0svh", duration: 0.55, ease: "none" },
    0
  )
  .fromTo(
    ".chess-right",
    { height: "15svh" },
    { height: "0svh", duration: 0.55, ease: "none" },
    0
  )
  .to(
    ".project-slide.is-active .project-copy",
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.28,
      ease: "power2.out"
    },
    0.74
  )
  .to(
    ".project-slide.is-active .project-next",
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.22,
      ease: "power2.out"
    },
    0.84
  );
});


/* =========================================================
   APPROACH HELPERS
========================================================= */

function prepareApproachElements() {
  [
    ["head-1","chars"],
    ["text-1","words"],
    ["head-2","chars"],
    ["text-2","words"],
    ["head-3","chars"],
    ["text-3","words"]
  ].forEach(([name,type]) => {
    const element = q(`[data-approach="${name}"]`);
    if (!element) return;

    const split = splitElement(element,type);
    if (!split) return;

    const parts = type === "chars"
      ? split.chars
      : split.words;

    gsap.set(parts, {
      opacity: 0,
      xPercent: -5,
      display: "inline-block"
    });
  });

  qa('[data-approach^="tag-"]').forEach(element => {
    gsap.set(element, {
      opacity: 0,
      yPercent: 10
    });
  });

  qa('[data-approach^="image-"]').forEach(image => {
    gsap.set(image, {
      width: "0%"
    });
  });
}

function addApproachReveal(tl,number,at) {
  const head = q(`[data-approach="head-${number}"]`);
  const text = q(`[data-approach="text-${number}"]`);
  const tag = q(`[data-approach="tag-${number}"]`);

  if (head?.__split) {
    tl.to(head.__split.chars, {
      opacity: 1,
      xPercent: 0,
      duration: 0.38,
      stagger: { amount: 0.375 },
      ease: "power2.out"
    }, at);
  }

  if (text?.__split) {
    tl.to(text.__split.words, {
      opacity: 1,
      xPercent: 0,
      duration: 0.38,
      stagger: { amount: 0.375 },
      ease: "power2.out"
    }, at);
  }

  if (tag) {
    tl.to(tag, {
      opacity: 1,
      yPercent: 0,
      duration: 0.58,
      ease: "power2.out"
    }, at);
  }
}

function revealApproachPanelMobile(panel,index) {
  const head = panel.querySelector(`[data-approach="head-${index}"]`);
  const text = panel.querySelector(`[data-approach="text-${index}"]`);
  const tag = panel.querySelector(`[data-approach="tag-${index}"]`);
  const images = panel.querySelectorAll(`[data-approach^="image-"]`);

  if (head?.__split) {
    gsap.to(head.__split.chars, {
      opacity: 1,
      xPercent: 0,
      duration: 0.75,
      stagger: 0.015,
      ease: "power2.out"
    });
  }

  if (text?.__split) {
    gsap.to(text.__split.words, {
      opacity: 1,
      xPercent: 0,
      duration: 0.65,
      stagger: 0.012,
      ease: "power2.out"
    });
  }

  if (tag) {
    gsap.to(tag, {
      opacity: 1,
      yPercent: 0,
      duration: 0.45
    });
  }

  gsap.to(images, {
    width: "100%",
    duration: 0.72,
    stagger: 0.05,
    ease: "power3.out"
  });
}

function initApproach() {
  prepareApproachElements();

  const mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".approach-section",
        start: "top -30%",
        end: "bottom bottom",
        scrub: 1
      }
    });

    tl.fromTo(
      ".approach-track",
      {
        x: "-120svh",
        y: "50%",
        scale: 0
      },
      {
        x: "-80svh",
        y: "0%",
        scale: 1,
        duration: 1,
        ease: "none"
      },
      0
    );

    tl.to(
      ".approach-track",
      {
        x: "-260svh",
        duration: 3,
        ease: "none"
      },
      1
    );

    addApproachReveal(tl,1,0.72);

    tl.to('[data-approach="image-1"]', {
      width: "100%",
      duration: 0.65,
      ease: "power2.out"
    },0.72);

    addApproachReveal(tl,2,1.6);

    [2,3,4,5,6].forEach((number,index) => {
      tl.to(`[data-approach="image-${number}"]`, {
        width: "100%",
        duration: 0.65,
        ease: "power2.out"
      },1.67 + index * 0.04);
    });

    addApproachReveal(tl,3,3.22);

    tl.to('[data-approach="image-7"]', {
      width: "100%",
      duration: 0.65,
      ease: "power2.out"
    },3.22);
  });

  mm.add("(max-width: 767px)", () => {
    const intro = q(".approach-intro");

    if (intro) {
      gsap.fromTo(
        intro,
        { y: 30, autoAlpha: 0.7 },
        {
          y: 0,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            trigger: intro,
            start: "top 90%",
            end: "top 30%",
            scrub: true
          }
        }
      );
    }

    qa(".approach-panel").forEach((panel, index) => {
      const number = index + 1;
      const head = panel.querySelector(`[data-approach="head-${number}"]`);
      const text = panel.querySelector(`[data-approach="text-${number}"]`);
      const tag = panel.querySelector(`[data-approach="tag-${number}"]`);
      const images = panel.querySelectorAll('[data-approach^="image-"]');

      gsap.fromTo(
        panel,
        {
          xPercent: index % 2 === 0 ? 8 : -8
        },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top 92%",
            end: "top 35%",
            scrub: true
          }
        }
      );

      ScrollTrigger.create({
        trigger: panel,
        start: "top 74%",
        once: true,
        onEnter: () => {
          if (head?.__split) {
            gsap.to(head.__split.chars, {
              opacity: 1,
              xPercent: 0,
              duration: 0.72,
              stagger: 0.014,
              ease: "power2.out"
            });
          }

          if (text?.__split) {
            gsap.to(text.__split.words, {
              opacity: 1,
              xPercent: 0,
              duration: 0.62,
              stagger: 0.012,
              ease: "power2.out"
            });
          }

          if (tag) {
            gsap.to(tag, {
              opacity: 1,
              yPercent: 0,
              duration: 0.42,
              ease: "power2.out"
            });
          }

          gsap.to(images, {
            width: "100%",
            duration: 0.72,
            stagger: 0.045,
            ease: "power3.out"
          });
        }
      });

      const media = panel.querySelector(
        ".approach-image-wrap, .design-strip"
      );

      if (media) {
        gsap.fromTo(
          media,
          { yPercent: 6 },
          {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      }
    });
  });
}


/* =========================================================
   STUDIO CARD STRIP
========================================================= */

const studioMM = gsap.matchMedia();

studioMM.add("(min-width: 768px)", () => {
  const aboutTrack = q(".about-track");

  if (!aboutTrack) return;

  gsap.to(aboutTrack, {
    x: () => {
      const overflow = Math.max(
        0,
        aboutTrack.scrollWidth - window.innerWidth + 60
      );

      return -overflow;
    },
    ease: "none",
    scrollTrigger: {
      trigger: ".about-section",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      invalidateOnRefresh: true
    }
  });
});

studioMM.add("(max-width: 767px)", () => {
  qa(".about-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        y: 34,
        autoAlpha: 0.45,
        scale: 0.97
      },
      {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.65,
        delay: index * 0.03,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          once: true
        }
      }
    );
  });
});


/* =========================================================
   COUNTERS
========================================================= */

qa("[data-counter]").forEach(element => {
  const target = Number(element.dataset.counter || 0);

  ScrollTrigger.create({
    trigger: element,
    start: "top 88%",
    once: true,
    onEnter: () => {
      const state = { value: 0 };

      gsap.to(state, {
        value: target,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => {
          element.textContent =
            Math.round(state.value);
        }
      });
    }
  });
});


/* =========================================================
   TEAM
========================================================= */

gsap.from(".team-card", {
  y: 42,
  autoAlpha: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".team-grid",
    start: "top 84%",
    once: true
  }
});


/* =========================================================
   MOBILE SECTION MOTION — LIGHTWEIGHT
========================================================= */

const mobileExtrasMM = gsap.matchMedia();

mobileExtrasMM.add("(max-width: 767px)", () => {
  gsap.to(".intro-title", {
    yPercent: -6,
    ease: "none",
    scrollTrigger: {
      trigger: ".intro-section",
      start: "top 20%",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.fromTo(
    ".contact-title",
    {
      scale: 0.92,
      y: 34
    },
    {
      scale: 1,
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".contact",
        start: "top 82%",
        end: "top 30%",
        scrub: true
      }
    }
  );
});


/* =========================================================
   INIT
========================================================= */

async function init() {
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch (error) {}
  }

  prepareSplitReveals();
  initApproach();
  initPreloader();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  });
});





