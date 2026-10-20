import { gsap } from "../core/gsap.js";

export function imageReveal(target, options = {}) {
  const element =
    typeof target === "string" ? document.querySelector(target) : target;

  if (!element) return null;

  const image = element.querySelector("img");

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: element,
      start: options.start || "top 86%",
      end: options.end || "top 28%",
      scrub: options.scrub ?? true,
    },
  });

  timeline.fromTo(
    element,
    { clipPath: "inset(10% 8% 10% 8%)" },
    { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 },
    0,
  );

  if (image) {
    timeline.fromTo(
      image,
      { scale: 1.1 },
      { scale: 1, ease: "none", duration: 1 },
      0,
    );
  }

  return timeline;
}
