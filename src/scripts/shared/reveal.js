import { gsap, ScrollTrigger } from "../core/gsap.js";
import { splitChars, splitWords } from "./split-text.js";

let initialized = false;

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initSharedReveals() {
  if (initialized) return;
  initialized = true;

  if (reducedMotion()) {
    gsap.set("[data-reveal]", { clearProps: "all", autoAlpha: 1 });
    return;
  }

  document.querySelectorAll('[data-reveal="up"]').forEach((element) => {
    gsap.fromTo(
      element,
      { y: 42, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 86%",
          once: true,
        },
      },
    );
  });

  document.querySelectorAll('[data-reveal="chars"]').forEach((element) => {
    const chars = splitChars(element);
    if (!chars.length) return;

    gsap.set(chars, {
      yPercent: 108,
      autoAlpha: 0,
      willChange: "transform,opacity",
    });

    ScrollTrigger.create({
      trigger: element,
      start: "top 86%",
      once: true,
      onEnter: () => {
        gsap.to(chars, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.018,
          ease: "power4.out",
          clearProps: "willChange",
        });
      },
    });
  });

  document.querySelectorAll('[data-reveal="words"]').forEach((element) => {
    const words = splitWords(element);
    if (!words.length) return;

    gsap.set(words, { yPercent: 24, autoAlpha: 0 });

    ScrollTrigger.create({
      trigger: element,
      start: "top 86%",
      once: true,
      onEnter: () => {
        gsap.to(words, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.025,
          ease: "power3.out",
        });
      },
    });
  });

  document.querySelectorAll("[data-stagger]").forEach((group) => {
    const children = Array.from(group.children);
    if (!children.length) return;

    gsap.fromTo(
      children,
      { y: 40, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.75,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: group,
          start: "top 84%",
          once: true,
        },
      },
    );
  });
}
