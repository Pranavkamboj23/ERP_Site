/* =========================================================
   GSAP SETUP
========================================================= */

gsap.registerPlugin(ScrollTrigger);

if (typeof SplitText !== "undefined") {
  gsap.registerPlugin(SplitText);
}

const q = selector => document.querySelector(selector);
const qa = selector => gsap.utils.toArray(selector);


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
      yPercent: 20,
      willChange: "transform,opacity",
      force3D: true,
      backfaceVisibility: "hidden",
      display: "inline-block"
    });

    ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(split.chars, {
          opacity: 1,
          yPercent: 0,
          duration: 1.5,
          stagger: 0.03,
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
      yPercent: 20,
      willChange: "transform,opacity",
      display: "inline-block"
    });

    ScrollTrigger.create({
      trigger: element,
      start: "top 82%",
      once: true,
      onEnter: () => {
        gsap.to(split.words, {
          opacity: 1,
          yPercent: 0,
          duration: 1.3,
          stagger: 0.03,
          ease: "power2.out",
          clearProps: "willChange"
        });
      }
    });
  });
}


/* =========================================================
   PRELOADER
   Matches the reference sequence:
   tiles separate -> text exits -> hero image grows
   4svw -> 42svw x 28svw -> 100svw x 100svh
========================================================= */

function initPreloader() {
  const preloader = q(".preloader");
  const imageHero = q(".image-hero");
  const heroImg = q(".hero-img");
  const heroContent = q(".hero-content");
  const header = q(".header");
  const preloaderCount = q(".preloader-count");

  if (!preloader || !imageHero) {
    if (header) header.classList.remove("is-hide");
    if (heroContent) gsap.set(heroContent, { autoAlpha: 1, y: 0 });
    return;
  }

  if (window.lenis) window.lenis.stop();

  gsap.set(imageHero, {
    position: "relative",
    width: "4svw",
    height: "4svw",
    overflow: "hidden",
    margin: "auto"
  });

  gsap.set(heroImg, {
    opacity: 1,
    filter: "none",
    scale: 1,
    transformOrigin: "center center"
  });

  gsap.set(heroContent, {
    opacity: 0,
    y: "3%"
  });

  if (header) header.classList.add("is-hide");

  const preloadHeadSplit = splitElement(q(".preloader-text p"), "chars");
  const preloadBodySplit = splitElement(q(".preloader-text > span"), "words");
  const heroHeadSplit = splitElement(q('[data-preload="main-head"]'), "chars");

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

  if (heroHeadSplit) {
    gsap.set(heroHeadSplit.chars, {
      opacity: 0,
      yPercent: 20,
      willChange: "transform,opacity",
      force3D: true,
      backfaceVisibility: "hidden",
      display: "inline-block"
    });
  }

  gsap.to({ value: 0 }, {
    value: 100,
    duration: 1.45,
    ease: "power2.inOut",
    onUpdate: function() {
      if (!preloaderCount) return;
      preloaderCount.textContent = String(Math.round(this.targets()[0].value)).padStart(2, "0");
    }
  });

  if (preloadHeadSplit) {
    gsap.to(preloadHeadSplit.chars, {
      opacity: 1,
      yPercent: 0,
      duration: 1.15,
      stagger: 0.025,
      ease: "power2.out"
    });
  }

  if (preloadBodySplit) {
    gsap.to(preloadBodySplit.words, {
      opacity: 1,
      yPercent: 0,
      duration: 1.1,
      stagger: 0.03,
      ease: "power2.out"
    });
  }

  const desktopOffsets = [
    30.8, -30.8,
    26.4, -26.4,
    22, -22,
    17.6, -17.6,
    13.2, -13.2,
    8.8, -8.8,
    4.4, -4.4
  ];

  const first = qa(".preload-tile.first");
  const second = qa(".preload-tile.second");
  const tiles = [];

  first.forEach((tile, index) => {
    tiles.push({ tile, x: desktopOffsets[index * 2] || 0 });
  });

  second.forEach((tile, index) => {
    tiles.push({ tile, x: desktopOffsets[index * 2 + 1] || 0 });
  });

  const tl = gsap.timeline({
    delay: 1,
    onComplete: () => {
      gsap.set(preloader, { display: "none" });

      if (header) header.classList.remove("is-hide");
      if (window.lenis) window.lenis.start();

      ScrollTrigger.refresh();
    }
  });

  tl.to(first, {
    y: "-2.2svw",
    duration: 0.608,
    ease: "power2.out"
  }, 0);

  tl.to(second, {
    y: "2.2svw",
    duration: 0.608,
    ease: "power2.out"
  }, 0.07);

  tiles.forEach((item, index) => {
    tl.to(item.tile, {
      x: `${item.x}svw`,
      opacity: index < 4 ? 0 : 1,
      duration: 0.52,
      ease: "power2.out"
    }, 1.05 + index * 0.02);
  });

  if (preloadHeadSplit) {
    tl.to(preloadHeadSplit.chars, {
      opacity: 0,
      yPercent: 20,
      duration: 0.7,
      stagger: {
        each: 0.03,
        from: "end"
      },
      ease: "power2.out"
    }, 1.53);
  }

  if (preloadBodySplit) {
    tl.to(preloadBodySplit.words, {
      opacity: 0,
      yPercent: 20,
      duration: 0.7,
      stagger: {
        each: 0.03,
        from: "end"
      },
      ease: "power2.out"
    }, 1.53);
  }

  tl.to(preloader, {
    backgroundColor: "transparent",
    duration: 0.35
  }, 1.9);

  tl.to(".preloader-back", {
    opacity: 0,
    duration: 0.35
  }, 1.9);

  tl.to(".preloader-grid", {
    opacity: 0,
    duration: 0.25
  }, 1.9);

  tl.to(imageHero, {
    width: "42svw",
    height: "28svw",
    duration: 0.77,
    ease: "power2.inOut"
  }, 1.9);

  tl.to(heroImg, {
    scale: 1.25,
    duration: 1.55,
    ease: "power3.inOut"
  }, 1.99);

  tl.to(imageHero, {
    width: "100svw",
    height: "100svh",
    duration: 0.76,
    ease: "power2.inOut"
  }, 2.68);

  tl.to(heroContent, {
    opacity: 1,
    y: "0%",
    duration: 0.45,
    ease: "power2.out"
  }, 2.76);

  if (heroHeadSplit) {
    tl.to(heroHeadSplit.chars, {
      opacity: 1,
      yPercent: 0,
      duration: 1.5,
      stagger: 0.03,
      ease: "power2.out",
      force3D: true,
      clearProps: "willChange"
    }, 2.76);
  }

  tl.to(".preloader-text", {
    opacity: 0,
    duration: 0.25
  }, 2.78);

  tl.call(() => {
    if (header) header.classList.remove("is-hide");
  }, null, 3.76);
}


/* =========================================================
   HERO SCROLL — reference uses -20% vertical movement
========================================================= */

gsap.to(".hero-img", {
  yPercent: -20,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top bottom",
    end: "bottom bottom",
    scrub: 0.8
  }
});


/* =========================================================
   COMPOSITION
========================================================= */

gsap.to(".composition-back", {
  x: "-145.5vw",
  ease: "none",
  scrollTrigger: {
    trigger: ".composition-section",
    start: "top -25%",
    end: "bottom bottom",
    scrub: 0.8
  }
});

[
  [".card-center", -16],
  [".card-left-a", -28],
  [".card-left-b", -18],
  [".card-right-a", -30],
  [".card-right-b", -22]
].forEach(([selector, yPercent]) => {
  gsap.to(selector, {
    yPercent,
    ease: "none",
    scrollTrigger: {
      trigger: ".composition-canvas",
      start: "top bottom",
      end: "bottom top",
      scrub: 0.8
    }
  });
});


/* =========================================================
   PROJECT REVEAL
   Same main values as the reference:
   background 0.65 -> 1.5 / 1.25
   slider 0.65 -> 1
========================================================= */

const projectRevealTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".project-reveal",
    start: "top -50%",
    end: "bottom bottom",
    scrub: 0.8
  }
});

projectRevealTL
  .fromTo(".project-back-two",
    { scale: 0.65 },
    { scale: 1.5, duration: 3, ease: "power2.inOut" },
    0
  )
  .fromTo(".project-back-one",
    { scale: 0.65 },
    { scale: 1.25, duration: 3, ease: "power2.inOut" },
    0.1
  )
  .fromTo(".project-slider",
    { scale: 0.65 },
    { scale: 1, duration: 3, ease: "power2.inOut" },
    0.2
  );

gsap.timeline({
  scrollTrigger: {
    trigger: ".project-reveal",
    start: "top bottom",
    end: "top 35%",
    scrub: 0.8
  }
})
.fromTo(".chess-left",
  { height: "65svh" },
  { height: "0svh", duration: 1, ease: "power2.inOut" },
  0
)
.fromTo(".chess-right",
  { height: "25svh" },
  { height: "0svh", duration: 1, ease: "power2.inOut" },
  0
);


/* =========================================================
   APPROACH
   Recreates the reference's core Webflow IX3 sequence:
   desktop/tablet:
   x -120svh -> -80svh, y 50% -> 0, scale 0 -> 1
   then x -80svh -> -260svh
   mobile:
   x -134svw -> -100svw, y 50svh -> 0, scale 0 -> 1
   then x -> -300svw
========================================================= */

function prepareApproachElements() {
  [
    ["head-1", "chars"],
    ["text-1", "words"],
    ["head-2", "chars"],
    ["text-2", "words"],
    ["head-3", "chars"],
    ["text-3", "words"]
  ].forEach(([name, type]) => {
    const element = q(`[data-approach="${name}"]`);
    if (!element) return;

    const split = splitElement(element, type);
    if (!split) return;

    const parts = type === "chars" ? split.chars : split.words;

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

function addApproachReveal(tl, number, at) {
  const head = q(`[data-approach="head-${number}"]`);
  const text = q(`[data-approach="text-${number}"]`);
  const tag = q(`[data-approach="tag-${number}"]`);

  if (head?.__split) {
    tl.to(head.__split.chars, {
      opacity: 1,
      xPercent: 0,
      duration: 0.38,
      stagger: {
        amount: 0.375
      },
      ease: "power2.out"
    }, at);
  }

  if (text?.__split) {
    tl.to(text.__split.words, {
      opacity: 1,
      xPercent: 0,
      duration: 0.38,
      stagger: {
        amount: 0.375
      },
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

    tl.fromTo(".approach-track",
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

    tl.to(".approach-track", {
      x: "-260svh",
      duration: 3,
      ease: "none"
    }, 1);

    addApproachReveal(tl, 1, 0.72);

    tl.to('[data-approach="image-1"]', {
      width: "100%",
      duration: 0.65,
      ease: "power2.out"
    }, 0.72);

    addApproachReveal(tl, 2, 1.6);

    [2,3,4,5,6].forEach((number, index) => {
      tl.to(`[data-approach="image-${number}"]`, {
        width: "100%",
        duration: 0.65,
        ease: "power2.out"
      }, 1.67 + index * 0.04);
    });

    addApproachReveal(tl, 3, 3.22);

    tl.to('[data-approach="image-7"]', {
      width: "100%",
      duration: 0.65,
      ease: "power2.out"
    }, 3.22);
  });

  mm.add("(max-width: 767px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".approach-section",
        start: "top -30%",
        end: "bottom bottom",
        scrub: 1
      }
    });

    tl.fromTo(".approach-track",
      {
        x: "-134svw",
        y: "50svh",
        scale: 0
      },
      {
        x: "-100svw",
        y: "0svh",
        scale: 1,
        duration: 0.8,
        ease: "none"
      },
      0
    );

    tl.to(".approach-track", {
      x: "-300svw",
      y: "0svh",
      duration: 3,
      ease: "none"
    }, 0.8);

    addApproachReveal(tl, 1, 0.72);

    tl.to('[data-approach="image-1"]', {
      width: "100%",
      duration: 0.65
    }, 0.72);

    addApproachReveal(tl, 2, 1.6);

    [2,3,4,5,6].forEach((number, index) => {
      tl.to(`[data-approach="image-${number}"]`, {
        width: "100%",
        duration: 0.65
      }, 1.67 + index * 0.04);
    });

    addApproachReveal(tl, 3, 3.22);

    tl.to('[data-approach="image-7"]', {
      width: "100%",
      duration: 0.65
    }, 3.22);
  });
}


/* =========================================================
   ABOUT HORIZONTAL STRIP
========================================================= */

const aboutTrack = q(".about-track");

if (aboutTrack) {
  gsap.to(aboutTrack, {
    x: () => {
      const overflow = Math.max(0, aboutTrack.scrollWidth - window.innerWidth + 60);
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
}


/* =========================================================
   COUNTERS
========================================================= */

qa("[data-counter]").forEach(element => {
  const target = Number(element.dataset.counter || 0);

  ScrollTrigger.create({
    trigger: element,
    start: "top 85%",
    once: true,
    onEnter: () => {
      const state = { value: 0 };

      gsap.to(state, {
        value: target,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => {
          element.textContent = Math.round(state.value);
        }
      });
    }
  });
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
  ScrollTrigger.refresh();
});
