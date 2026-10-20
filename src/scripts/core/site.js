/* =========================================================
   SMOOTH SCROLL
   Desktop: Lenis.
   Mobile / touch: native scrolling for better performance.
========================================================= */

let lenis = null;

const useNativeScroll = window.matchMedia(
  "(max-width: 767px), (pointer: coarse)"
).matches;

if (!useNativeScroll && typeof Lenis !== "undefined") {
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
} else {
  window.lenis = null;
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
      duration: 0.78,
      ease: "power4.inOut"
    })
    .fromTo(
      ".menu-nav a",
      {
        y: 48,
        autoAlpha: 0
      },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.56,
        stagger: 0.045,
        ease: "power3.out"
      },
      "-=0.28"
    );
}

function closeMenu() {
  if (!menu || !menuOpen) return;

  menuOpen = false;

  gsap.to(menu, {
    clipPath: "inset(0 0 100% 0)",
    duration: 0.68,
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

menuLinks.forEach(link => {
  link.addEventListener("click", event => {
    const href = link.getAttribute("href") || "";

    if (href.startsWith("#")) {
      closeMenu();
      return;
    }

    // Multi-page links navigate normally. We do not preventDefault(),
    // so routing can never be blocked by the menu animation.
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});


/* =========================================================
   ANCHOR NAVIGATION
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
        duration: 1.15,
        offset: 0
      });
    } else {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});


/* =========================================================
   BACK TO TOP
========================================================= */

const backTop = document.querySelector(".back-top");

if (backTop) {
  backTop.addEventListener("click", () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.3 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  });
}


/* =========================================================
   RESIZE / ORIENTATION
   Do not refresh ScrollTrigger for mobile browser chrome
   height-only resizes while the user is scrolling.
========================================================= */

let refreshTimer;
let lastViewportWidth = window.innerWidth;

function refreshScrollSystem() {
  clearTimeout(refreshTimer);

  refreshTimer = setTimeout(() => {
    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  }, 260);
}

window.addEventListener("resize", () => {
  const widthDelta = Math.abs(window.innerWidth - lastViewportWidth);

  if (widthDelta > 48) {
    lastViewportWidth = window.innerWidth;
    refreshScrollSystem();
  }
});

window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    lastViewportWidth = window.innerWidth;
    refreshScrollSystem();
  }, 420);
});
