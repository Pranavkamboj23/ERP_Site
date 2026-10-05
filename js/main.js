/* =========================================================
   SMOOTH SCROLL — SAME LENIS SETTINGS AS THE REFERENCE
========================================================= */

let lenis = null;

if (typeof Lenis !== "undefined") {
  lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1
  });

  window.lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  if (typeof ScrollTrigger !== "undefined") {
    lenis.on("scroll", ScrollTrigger.update);
  }
}


/* =========================================================
   MENU
========================================================= */

const menu = document.querySelector(".menu-overlay");
const openButton = document.querySelector("[data-menu-open]");
const closeButton = document.querySelector("[data-menu-close]");
const menuLinks = document.querySelectorAll(".menu-nav a");

let menuOpen = false;

function openMenu() {
  if (!menu || menuOpen) return;

  menuOpen = true;
  document.body.classList.add("menu-open");

  if (lenis) lenis.stop();

  gsap.timeline()
    .set(menu, {
      visibility: "visible",
      attr: { "aria-hidden": "false" }
    })
    .to(menu, {
      clipPath: "inset(0 0 0% 0)",
      duration: 0.8,
      ease: "power4.inOut"
    })
    .fromTo(
      ".menu-nav a",
      { y: 65, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.65,
        stagger: 0.05,
        ease: "power3.out"
      },
      "-=0.3"
    );
}

function closeMenu() {
  if (!menu || !menuOpen) return;

  menuOpen = false;

  gsap.to(menu, {
    clipPath: "inset(0 0 100% 0)",
    duration: 0.72,
    ease: "power4.inOut",
    onComplete: () => {
      gsap.set(menu, {
        visibility: "hidden",
        attr: { "aria-hidden": "true" }
      });

      document.body.classList.remove("menu-open");

      if (lenis) lenis.start();
    }
  });
}

if (openButton) openButton.addEventListener("click", openMenu);
if (closeButton) closeButton.addEventListener("click", closeMenu);

menuLinks.forEach(link => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});


/* =========================================================
   ANCHORS
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();

    if (lenis) {
      lenis.scrollTo(target, {
        duration: 1.2
      });
    } else {
      target.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});


/* =========================================================
   PROJECT BUTTONS
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
      scale: 1.12
    });
  }

  const tl = gsap.timeline({
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
  });

  tl.to(next, {
    clipPath: "inset(0 0 0 0)",
    duration: 0.85,
    ease: "power4.inOut"
  });

  if (nextImage) {
    tl.to(nextImage, {
      scale: 1,
      duration: 1.1,
      ease: "power3.out"
    }, 0);
  }
}

nextButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const nextIndex = (index + 1) % slides.length;
    showSlide(nextIndex);
  });
});


/* =========================================================
   BACK TO TOP
========================================================= */

const backTop = document.querySelector(".back-top");

if (backTop) {
  backTop.addEventListener("click", () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  });
}


/* =========================================================
   REFRESH
========================================================= */

let refreshTimer;

window.addEventListener("resize", () => {
  clearTimeout(refreshTimer);

  refreshTimer = setTimeout(() => {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }, 180);
});
