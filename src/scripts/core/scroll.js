import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "./gsap.js";

let lenis = null;
let initialized = false;
let lastViewportWidth = 0;

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function getLenis() {
  return lenis;
}

export function refreshScroll() {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

export function initScroll() {
  if (initialized) return lenis;
  initialized = true;
  lastViewportWidth = window.innerWidth;

  if (!reducedMotion()) {
    lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      autoRaf: false,
      anchors: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    window.__v4Lenis = lenis;
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(refreshScroll).catch(() => {});
  }

  window.addEventListener(
    "resize",
    () => {
      const widthDelta = Math.abs(window.innerWidth - lastViewportWidth);

      // Mobile browser chrome often changes only the viewport height.
      // Refresh only when the layout width actually changes meaningfully.
      if (widthDelta > 48) {
        lastViewportWidth = window.innerWidth;
        refreshScroll();
      }
    },
    { passive: true },
  );

  window.addEventListener(
    "orientationchange",
    () => {
      window.setTimeout(() => {
        lastViewportWidth = window.innerWidth;
        refreshScroll();
      }, 420);
    },
    { passive: true },
  );

  return lenis;
}
