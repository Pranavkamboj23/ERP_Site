/* =========================================================
   ABOUT PAGE ANIMATIONS
   Desktop = richer scroll movement.
   Mobile = natural flow, no pinning.
========================================================= */

(() => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }
  
    gsap.registerPlugin(ScrollTrigger);
  
    if (typeof SplitText !== "undefined") {
      gsap.registerPlugin(SplitText);
    }
  
    const q = selector => document.querySelector(selector);
    const qa = selector => gsap.utils.toArray(selector);
    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
  
    function split(element, type = "chars") {
      if (!element || typeof SplitText === "undefined") return null;
  
      const instance = new SplitText(element, {
        type: type === "words" ? "words" : "words,chars",
        charsClass: "about-char",
        wordsClass: "about-word"
      });
  
      gsap.set(instance.words, {
        display: "inline-block",
        whiteSpace: "nowrap"
      });
  
      return instance;
    }
  
  
    /* =======================================================
       HERO TITLE
    ======================================================== */
  
    const heroTitles = qa("[data-about-hero-title]");
  
    heroTitles.forEach((element, index) => {
      const splitTitle = split(element, "chars");
  
      if (!splitTitle) return;
  
      gsap.set(splitTitle.chars, {
        yPercent: 115,
        opacity: 0,
        display: "inline-block"
      });
  
      gsap.to(splitTitle.chars, {
        yPercent: 0,
        opacity: 1,
        duration: isMobile() ? 0.9 : 1.25,
        delay: 0.2 + index * 0.08,
        stagger: isMobile() ? 0.018 : 0.028,
        ease: "power4.out"
      });
    });
  
  
    /* =======================================================
       BODY COPY REVEALS
    ======================================================== */
  
    qa("[data-about-copy]").forEach(element => {
      const words = split(element, "words");
  
      if (!words) return;
  
      gsap.set(words.words, {
        opacity: 0,
        yPercent: 18
      });
  
      ScrollTrigger.create({
        trigger: element,
        start: "top 84%",
        once: true,
  
        onEnter: () => {
          gsap.to(words.words, {
            opacity: 1,
            yPercent: 0,
            duration: 0.8,
            stagger: 0.018,
            ease: "power2.out"
          });
        }
      });
    });
  
  
    /* =======================================================
       HERO IMAGE
    ======================================================== */
  
    const imageFrame = q("[data-about-image-reveal]");
  
    if (imageFrame) {
      const image = imageFrame.querySelector("img");
  
      gsap.fromTo(
        imageFrame,
        {
          clipPath: isMobile()
            ? "inset(8% 6% 8% 6%)"
            : "inset(16% 18% 16% 18%)"
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
  
          scrollTrigger: {
            trigger: imageFrame,
            start: "top 88%",
            end: "top 22%",
            scrub: true
          }
        }
      );
  
      if (image) {
        gsap.fromTo(
          image,
          {
            scale: 1.12,
            yPercent: -2
          },
          {
            scale: 1,
            yPercent: 6,
            ease: "none",
  
            scrollTrigger: {
              trigger: imageFrame,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      }
    }
  
  
    /* =======================================================
       PHILOSOPHY HEADING
    ======================================================== */
  
    const philosophyHeading = q("[data-about-heading]");
  
    if (philosophyHeading) {
      const headingSplit = split(philosophyHeading, "chars");
  
      if (headingSplit) {
        gsap.set(headingSplit.chars, {
          opacity: 0,
          yPercent: 18
        });
  
        ScrollTrigger.create({
          trigger: philosophyHeading,
          start: "top 82%",
          once: true,
  
          onEnter: () => {
            gsap.to(headingSplit.chars, {
              opacity: 1,
              yPercent: 0,
              duration: 1,
              stagger: 0.02,
              ease: "power3.out"
            });
          }
        });
      }
    }
  
  
    /* =======================================================
       PRINCIPLES
    ======================================================== */
  
    qa("[data-about-principle]").forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: isMobile() ? 34 : 56,
          autoAlpha: 0,
          scale: isMobile() ? 1 : 0.985
        },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.85,
          delay: index * 0.05,
          ease: "power3.out",
  
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true
          }
        }
      );
    });
  
  
    /* =======================================================
       FIELD / PEOPLE MEDIA
    ======================================================== */
  
    qa("[data-about-media]").forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: index === 0 ? 70 : 110,
          autoAlpha: 0,
          scale: 0.97
        },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          ease: "none",
  
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            end: "top 44%",
            scrub: true
          }
        }
      );
    });
  
  
    /* =======================================================
       CTA
    ======================================================== */
  
    const cta = q("[data-about-cta]");
  
    if (cta) {
      gsap.fromTo(
        cta,
        {
          y: 50,
          scale: 0.95,
          autoAlpha: 0.35
        },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          ease: "none",
  
          scrollTrigger: {
            trigger: ".about-cta",
            start: "top 78%",
            end: "top 18%",
            scrub: true
          }
        }
      );
    }
  
  
    /* =======================================================
       DESKTOP-ONLY PARALLAX
    ======================================================== */
  
    const mm = gsap.matchMedia();
  
    mm.add("(min-width: 768px)", () => {
      gsap.to(".about-title-line:nth-child(1)", {
        xPercent: -7,
        ease: "none",
  
        scrollTrigger: {
          trigger: ".about-hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.7
        }
      });
  
      gsap.to(".about-title-line:nth-child(2)", {
        xPercent: 6,
        ease: "none",
  
        scrollTrigger: {
          trigger: ".about-hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.7
        }
      });
  
      gsap.to(".about-title-line:nth-child(3)", {
        xPercent: -4,
        ease: "none",
  
        scrollTrigger: {
          trigger: ".about-hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.7
        }
      });
    });
  
  
    /* =======================================================
       FINAL REFRESH
    ======================================================== */
  
    window.addEventListener("load", () => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
  
  })();
  