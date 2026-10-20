import { ScrollTrigger } from "./gsap.js";
import { initScroll, refreshScroll } from "./scroll.js";
import { initMenu } from "./menu.js";
import { initSharedReveals } from "../shared/reveal.js";

function initHeaderState() {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;

  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function start() {
  initScroll();
  initMenu();
  initHeaderState();
  initSharedReveals();

  requestAnimationFrame(() => {
    refreshScroll();
    window.dispatchEvent(new CustomEvent("v4:core-ready"));
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}

window.addEventListener("load", () => {
  requestAnimationFrame(() => ScrollTrigger.refresh());
});
