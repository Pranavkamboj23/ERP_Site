/* =========================================================
   APPROACH PAGE
   Uses existing shared GSAP / ScrollTrigger / Lenis.
========================================================= */

(() => {
    if (!window.gsap || !window.ScrollTrigger) return;
  
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
  
    const q = (s, r = document) => r.querySelector(s);
    const qa = (s, r = document) => Array.from(r.querySelectorAll(s));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
    function splitChars(el) {
      if (!el || el.dataset.apChars === "1") return [];
      const text = el.textContent || "";
      el.textContent = "";
      el.setAttribute("aria-label", text.trim());
      const chars = [];
  
      Array.from(text).forEach(ch => {
        const span = document.createElement("span");
        span.setAttribute("aria-hidden", "true");
  
        if (/\s/.test(ch)) {
          span.innerHTML = "&nbsp;";
          span.style.display = "inline-block";
          span.style.width = ".28em";
        } else {
          span.textContent = ch;
          span.style.display = "inline-block";
          chars.push(span);
        }
  
        el.appendChild(span);
      });
  
      el.dataset.apChars = "1";
      return chars;
    }
  
    function splitWords(el) {
      if (!el || el.dataset.apWords === "1") return [];
      const text = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (!text) return [];
  
      el.textContent = "";
      el.setAttribute("aria-label", text);
      const words = [];
  
      text.split(" ").forEach((word, i, all) => {
        const span = document.createElement("span");
        span.textContent = word;
        span.setAttribute("aria-hidden", "true");
        span.style.display = "inline-block";
        words.push(span);
        el.appendChild(span);
        if (i < all.length - 1) el.appendChild(document.createTextNode(" "));
      });
  
      el.dataset.apWords = "1";
      return words;
    }
  
    function initHero() {
      const hero = q("[data-approach-hero]");
      const headings = qa("[data-approach-hero-line] h1");
      if (!hero) return;
  
      headings.forEach((heading, i) => {
        const chars = splitChars(heading);
        if (reduced) return;
  
        gsap.set(chars, { yPercent: 110, autoAlpha: 0 });
        gsap.to(chars, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.05,
          delay: .12 + i * .08,
          stagger: .022,
          ease: "power4.out",
        });
      });
  
      gsap.matchMedia().add("(min-width: 1024px)", () => {
        if (reduced) return;
        const lines = qa("[data-approach-hero-line]");
        const directions = [-7, 6, -4];
  
        lines.forEach((line, i) => {
          gsap.to(line, {
            xPercent: directions[i] || 0,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      });
    }
  
    function initReveals() {
      qa('[data-approach-reveal="chars"]').forEach(el => {
        const chars = splitChars(el);
        if (reduced) return;
  
        gsap.set(chars, { yPercent: 105, autoAlpha: 0 });
  
        ScrollTrigger.create({
          trigger: el,
          start: "top 86%",
          once: true,
          onEnter: () => gsap.to(chars, {
            yPercent: 0,
            autoAlpha: 1,
            duration: .92,
            stagger: .018,
            ease: "power4.out",
          }),
        });
      });
  
      qa('[data-approach-reveal="words"]').forEach(el => {
        const words = splitWords(el);
        if (reduced) return;
  
        gsap.set(words, { yPercent: 22, autoAlpha: 0 });
  
        ScrollTrigger.create({
          trigger: el,
          start: "top 86%",
          once: true,
          onEnter: () => gsap.to(words, {
            yPercent: 0,
            autoAlpha: 1,
            duration: .7,
            stagger: .02,
            ease: "power3.out",
          }),
        });
      });
    }
  
    function initProcess() {
      const section = q("[data-process-section]");
      const track = q("[data-process-track]");
      const intro = q(".approach-process__intro");
      if (!section || !track) return;
  
      const mm = gsap.matchMedia();
  
      mm.add("(min-width: 1024px)", () => {
        if (reduced) return;
  
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
  
        tl.to(intro, {
          autoAlpha: 0,
          scale: .965,
          duration: .42,
          ease: "none",
        }, 0);
  
        tl.fromTo(track, {
          x: "100vw",
        }, {
          x: "-400vw",
          duration: 5,
          ease: "none",
        }, .3);
  
        qa(".approach-process__media img").forEach(image => {
          gsap.fromTo(image, {
            xPercent: -4,
            scale: 1.06,
          }, {
            xPercent: 4,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: image.closest(".approach-process__panel"),
              containerAnimation: tl,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          });
        });
  
        return () => gsap.set(track, { clearProps: "transform" });
      });
  
      mm.add("(max-width: 1023px)", () => {
        if (reduced) return;
  
        qa(".approach-process__panel").forEach(panel => {
          gsap.fromTo(panel, {
            y: 44,
            autoAlpha: .35,
          }, {
            y: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top 92%",
              end: "top 35%",
              scrub: true,
            },
          });
  
          const image = q(".approach-process__media img", panel);
          if (image) {
            gsap.fromTo(image, { yPercent: -4 }, {
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          }
        });
      });
    }
  
    function initCards() {
      if (reduced) return;
  
      gsap.fromTo("[data-approach-card]", {
        y: 45,
        autoAlpha: 0,
      }, {
        y: 0,
        autoAlpha: 1,
        duration: .8,
        stagger: .08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".approach-principles__grid",
          start: "top 84%",
          once: true,
        },
      });
    }
  
    function initTimeline() {
      if (reduced) return;
  
      qa("[data-timeline-row]").forEach((row, i) => {
        gsap.fromTo(row, {
          xPercent: i % 2 === 0 ? -2.5 : 2.5,
          autoAlpha: .25,
        }, {
          xPercent: 0,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top 90%",
            end: "top 55%",
            scrub: true,
          },
        });
      });
    }
  
    function initNext() {
      const section = q("[data-approach-next]");
      const link = q("[data-approach-next-link]");
      if (!section || !link || reduced) return;
  
      gsap.fromTo(link, {
        y: 55,
        scale: .95,
        autoAlpha: .3,
      }, {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          end: "top 18%",
          scrub: true,
        },
      });
    }
  
    function init() {
      initHero();
      initReveals();
      initProcess();
      initCards();
      initTimeline();
      initNext();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
      init();
    }
  })();
  