import { gsap } from "./gsap.js";
import { getLenis } from "./scroll.js";

let initialized = false;

export function initMenu() {
  if (initialized) return;
  initialized = true;

  const overlay = document.querySelector("[data-menu-overlay]");
  const openButton = document.querySelector("[data-menu-open]");
  const closeButton = document.querySelector("[data-menu-close]");

  if (!overlay || !openButton || !closeButton) return;

  const links = Array.from(overlay.querySelectorAll(".site-menu__link"));

  gsap.set(overlay, {
    visibility: "hidden",
    clipPath: "inset(0 0 100% 0)",
  });

  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: "power4.inOut" },
    onStart: () => {
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      openButton.setAttribute("aria-expanded", "true");
      document.documentElement.classList.add("menu-open");
      getLenis()?.stop();
    },
    onReverseComplete: () => {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      openButton.setAttribute("aria-expanded", "false");
      document.documentElement.classList.remove("menu-open");
      getLenis()?.start();
      gsap.set(overlay, { visibility: "hidden" });
    },
  });

  timeline
    .set(overlay, { visibility: "visible" })
    .to(overlay, {
      clipPath: "inset(0 0 0% 0)",
      duration: 0.7,
    })
    .fromTo(
      links,
      { y: 28, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.5,
        stagger: 0.035,
        ease: "power3.out",
      },
      "-=0.32",
    )
    .fromTo(
      ".site-menu__bottom",
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
      "-=0.2",
    );

  const open = () => {
    if (timeline.progress() === 1) return;
    timeline.timeScale(1).play();
  };

  const close = () => {
    if (timeline.progress() === 0) return;
    timeline.timeScale(1.15).reverse();
  };

  openButton.addEventListener("click", open);
  closeButton.addEventListener("click", close);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      // Normal multi-page navigation is intentionally left to the browser.
      // If the target is the current page, close the overlay instead.
      const target = new URL(link.href, window.location.href);
      if (
        target.pathname === window.location.pathname &&
        target.hash === window.location.hash
      ) {
        close();
      }
    });
  });
}
