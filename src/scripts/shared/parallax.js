import { gsap } from "../core/gsap.js";

export function parallaxImage(target, amount = 8) {
  const element =
    typeof target === "string" ? document.querySelector(target) : target;

  if (!element) return null;

  return gsap.fromTo(
    element,
    { yPercent: -amount / 2 },
    {
      yPercent: amount / 2,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement || element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    },
  );
}
