(() => {
    if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") return;
  
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
  
    const q = (s, r = document) => r.querySelector(s);
    const qa = (s, r = document) => Array.from(r.querySelectorAll(s));
    const rows = qa("[data-project-row]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
    function splitChars(el) {
      if (!el || el.dataset.workSplit === "true") return [];
      const text = el.textContent || "";
      el.textContent = "";
      el.setAttribute("aria-label", text.trim());
      const chars = [];
      Array.from(text).forEach((ch) => {
        const span = document.createElement("span");
        span.setAttribute("aria-hidden", "true");
        span.style.display = "inline-block";
        if (/\s/.test(ch)) {
          span.innerHTML = "&nbsp;";
          span.style.width = ".28em";
        } else {
          span.textContent = ch;
          chars.push(span);
        }
        el.appendChild(span);
      });
      el.dataset.workSplit = "true";
      return chars;
    }
  
    function initIntro() {
      const intro = q("[data-work-intro]");
      const title = q("[data-work-intro-title]");
      const count = q("[data-work-intro-count]");
      if (!intro || !title || !count) return;
  
      const chars = splitChars(title);
  
      if (!reduced) {
        gsap.set(chars, { yPercent: 110, autoAlpha: 0 });
        gsap.to(chars, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.05,
          delay: .12,
          stagger: .028,
          ease: "power4.out"
        });
  
        gsap.fromTo(count, { y: 35, autoAlpha: 0 }, {
          y: 0,
          autoAlpha: 1,
          duration: .75,
          delay: .18,
          ease: "power3.out"
        });
      }
  
      gsap.matchMedia().add("(min-width: 1024px)", () => {
        if (reduced) return;
        gsap.to(title, {
          xPercent: -7,
          ease: "none",
          scrollTrigger: { trigger: intro, start: "top top", end: "bottom top", scrub: true }
        });
        gsap.to(count, {
          xPercent: 48,
          yPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: intro, start: "top top", end: "bottom top", scrub: true }
        });
      });
    }
  
    function initGalleryControls() {
      qa("[data-project-gallery]").forEach((gallery) => {
        const viewport = q(".project-gallery__viewport", gallery);
        const track = q("[data-gallery-track]", gallery);
        const slides = qa("[data-gallery-slide]", gallery);
        const prev = q("[data-gallery-prev]", gallery);
        const next = q("[data-gallery-next]", gallery);
        const position = q("[data-gallery-position]", gallery);
        const progress = q("[data-gallery-progress]", gallery);
        if (!viewport || !track || !slides.length) return;
  
        let active = 0;
  
        const updateUI = (index) => {
          active = Math.max(0, Math.min(index, slides.length - 1));
          if (position) {
            position.textContent = `${String(active + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
          }
          if (progress) {
            gsap.to(progress, {
              scaleX: (active + 1) / slides.length,
              duration: .4,
              ease: "power3.out",
              overwrite: true
            });
          }
        };
  
        const goTo = (index) => {
          const nextIndex = (index + slides.length) % slides.length;
          const target = slides[nextIndex];
  
          if (window.innerWidth < 1024) {
            viewport.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
            updateUI(nextIndex);
            return;
          }
  
          const maxTravel = Math.max(0, track.scrollWidth - viewport.clientWidth);
          const centered = target.offsetLeft - (viewport.clientWidth - target.offsetWidth) / 2;
          const targetX = -Math.max(0, Math.min(centered, maxTravel));
  
          gsap.to(track, { x: targetX, duration: .8, ease: "power4.inOut", overwrite: true });
          gsap.fromTo(
            q(".project-gallery__image", target),
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: .7, ease: "power4.out" }
          );
          updateUI(nextIndex);
        };
  
        prev?.addEventListener("click", () => goTo(active - 1));
        next?.addEventListener("click", () => goTo(active + 1));
  
        let raf = 0;
        viewport.addEventListener("scroll", () => {
          if (window.innerWidth >= 1024) return;
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            const center = viewport.scrollLeft + viewport.clientWidth / 2;
            let nearest = 0;
            let distance = Infinity;
            slides.forEach((slide, index) => {
              const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
              const d = Math.abs(center - slideCenter);
              if (d < distance) {
                distance = d;
                nearest = index;
              }
            });
            updateUI(nearest);
          });
        }, { passive: true });
  
        updateUI(0);
      });
    }
  
    function initRows() {
      const mm = gsap.matchMedia();
  
      rows.forEach((row, rowIndex) => {
        const title = q("[data-project-title]", row);
        const chars = splitChars(title);
        const description = q(".project-row__description", row);
        const meta = qa("[data-project-meta] > div", row);
        const slides = qa("[data-gallery-slide]", row);
        const images = qa(".project-gallery__image img", row);
        const gallery = q(".project-gallery", row);
  
        if (reduced) return;
  
        gsap.set(chars, { yPercent: 115, autoAlpha: 0 });
        gsap.set(description, { y: 20, autoAlpha: 0 });
        gsap.set(meta, { y: 18, autoAlpha: 0 });
        gsap.set(slides, { y: rowIndex % 2 ? 34 : 50, autoAlpha: 0 });
  
        ScrollTrigger.create({
          trigger: row,
          start: "top 72%",
          once: true,
          onEnter: () => {
            gsap.to(chars, {
              yPercent: 0,
              autoAlpha: 1,
              duration: .9,
              stagger: .018,
              ease: "power4.out"
            });
            gsap.to(description, {
              y: 0,
              autoAlpha: 1,
              duration: .7,
              delay: .15,
              ease: "power3.out"
            });
            gsap.to(meta, {
              y: 0,
              autoAlpha: 1,
              duration: .6,
              delay: .18,
              stagger: .045,
              ease: "power3.out"
            });
            gsap.to(slides, {
              y: 0,
              autoAlpha: 1,
              duration: .85,
              delay: .08,
              stagger: .075,
              ease: "power3.out"
            });
          }
        });
  
        mm.add("(min-width: 1024px)", () => {
          if (gallery) {
            gsap.fromTo(gallery, { clipPath: "inset(0 7% 0 7%)" }, {
              clipPath: "inset(0 0% 0 0%)",
              ease: "none",
              scrollTrigger: { trigger: row, start: "top 88%", end: "top 26%", scrub: true }
            });
          }
  
          images.forEach((image, i) => {
            gsap.fromTo(image, { yPercent: -5, xPercent: i % 2 ? 2 : -2 }, {
              yPercent: 5,
              xPercent: i % 2 ? -2 : 2,
              ease: "none",
              scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true }
            });
          });
  
          gsap.to(row, {
            scale: .975,
            autoAlpha: .72,
            ease: "none",
            transformOrigin: "center bottom",
            scrollTrigger: { trigger: row, start: "70% top", end: "bottom top", scrub: true }
          });
        });
  
        mm.add("(max-width: 1023px)", () => {
          images.forEach((image) => {
            gsap.fromTo(image, { yPercent: -3 }, {
              yPercent: 3,
              ease: "none",
              scrollTrigger: {
                trigger: image.closest(".project-gallery__image"),
                start: "top bottom",
                end: "bottom top",
                scrub: true
              }
            });
          });
        });
      });
    }
  
    function initCounter() {
      const counter = q("[data-work-fixed-counter]");
      const current = q("[data-work-current]");
      if (!counter || !current) return;
  
      gsap.matchMedia().add("(min-width: 1024px)", () => {
        rows.forEach((row, index) => {
          ScrollTrigger.create({
            trigger: row,
            start: "top center",
            end: "bottom center",
            onEnter: () => {
              current.textContent = String(index + 1).padStart(2, "0");
              gsap.to(counter, { autoAlpha: 1, duration: .25 });
            },
            onEnterBack: () => {
              current.textContent = String(index + 1).padStart(2, "0");
              gsap.to(counter, { autoAlpha: 1, duration: .25 });
            },
            onLeave: () => {
              if (index === rows.length - 1) gsap.to(counter, { autoAlpha: 0, duration: .25 });
            }
          });
        });
      });
    }
  
    function initCTA() {
      const cta = q("[data-work-cta]");
      const link = q("[data-work-cta-link]");
      if (!cta || !link || reduced) return;
  
      gsap.fromTo(link, { y: 55, scale: .95, autoAlpha: .3 }, {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        ease: "none",
        scrollTrigger: { trigger: cta, start: "top 82%", end: "top 18%", scrub: true }
      });
    }
  
    function init() {
      initIntro();
      initGalleryControls();
      initRows();
      initCounter();
      initCTA();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
      init();
    }
  })();
  