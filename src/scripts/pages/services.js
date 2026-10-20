(() => {
    if (!window.gsap || !window.ScrollTrigger) return;
  
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
  
    const q = (s, r = document) => r.querySelector(s);
    const qa = (s, r = document) => Array.from(r.querySelectorAll(s));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
    function splitChars(el) {
      if (!el || el.dataset.svcChars === "1") return [];
      const text = el.textContent || "";
      el.textContent = "";
      el.setAttribute("aria-label", text.trim());
      const chars = [];
      Array.from(text).forEach(ch => {
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
      el.dataset.svcChars = "1";
      return chars;
    }
  
    function splitWords(el) {
      if (!el || el.dataset.svcWords === "1") return [];
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
      el.dataset.svcWords = "1";
      return words;
    }
  
    function initHero() {
      const hero = q("[data-services-hero]");
      const headings = qa("[data-services-hero-line] h1");
      if (!hero) return;
  
      headings.forEach((heading, index) => {
        const chars = splitChars(heading);
        if (reduced) return;
        gsap.set(chars, { yPercent: 110, autoAlpha: 0 });
        gsap.to(chars, { yPercent: 0, autoAlpha: 1, duration: 1.05, delay: .12 + index * .08, stagger: .022, ease: "power4.out" });
      });
  
      gsap.matchMedia().add("(min-width: 1024px)", () => {
        if (reduced) return;
        const lines = qa("[data-services-hero-line]");
        const dirs = [-7, 7, -4];
        lines.forEach((line, i) => gsap.to(line, {
          xPercent: dirs[i] || 0,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true }
        }));
      });
    }
  
    function initDeck() {
      const theatre = q("[data-services-theatre]");
      const cards = qa("[data-service-card]");
      const current = q("[data-service-current]");
      const progress = q("[data-services-progress]");
      if (!theatre || !cards.length) return;
  
      const mm = gsap.matchMedia();
  
      mm.add("(min-width: 1024px)", () => {
        if (reduced) return;
  
        cards.forEach((card, index) => {
          gsap.set(card, {
            yPercent: index * 7,
            scale: 1 - index * .035,
            rotation: (index % 2 === 0 ? 1 : -1) * index * .75,
            autoAlpha: index === 0 ? 1 : .78,
            zIndex: cards.length - index,
          });
        });
  
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: theatre,
            start: "top top",
            end: "bottom bottom",
            scrub: .7,
            onUpdate: self => {
              const index = Math.min(cards.length - 1, Math.floor(self.progress * cards.length));
              if (current) current.textContent = String(index + 1).padStart(2, "0");
              if (progress) gsap.set(progress, { scaleX: self.progress });
            }
          }
        });
  
        cards.forEach((card, index) => {
          if (index === cards.length - 1) return;
          const next = cards[index + 1];
          const at = `service-${index}`;
          tl.addLabel(at);
  
          tl.to(card, {
            yPercent: -118,
            rotation: index % 2 === 0 ? -6 : 6,
            scale: .9,
            autoAlpha: .15,
            duration: .72,
            ease: "power2.inOut"
          }, at);
  
          tl.to(next, {
            yPercent: 0,
            rotation: 0,
            scale: 1,
            autoAlpha: 1,
            duration: .72,
            ease: "power2.inOut"
          }, at);
  
          cards.slice(index + 2).forEach((later, laterIndex) => {
            const depth = laterIndex + 1;
            tl.to(later, {
              yPercent: depth * 7,
              scale: 1 - depth * .035,
              rotation: ((laterIndex + index) % 2 === 0 ? 1 : -1) * depth * .75,
              duration: .72,
              ease: "power2.inOut"
            }, at);
          });
  
          const nextImage = q(".service-card__media img", next);
          if (nextImage) {
            tl.fromTo(nextImage, { scale: 1.1, yPercent: -3 }, { scale: 1, yPercent: 3, duration: .72, ease: "none" }, at);
          }
  
          tl.to({}, { duration: .22 });
        });
  
        return () => gsap.set(cards, { clearProps: "transform,opacity,visibility,zIndex" });
      });
  
      mm.add("(max-width: 1023px)", () => {
        if (reduced) return;
        cards.forEach((card, index) => {
          const image = q(".service-card__media img", card);
          gsap.fromTo(card,
            { y: 52, rotation: index % 2 === 0 ? -1.5 : 1.5, scale: .97, autoAlpha: .35 },
            { y: 0, rotation: 0, scale: 1, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: card, start: "top 92%", end: "top 35%", scrub: true } }
          );
          if (image) {
            gsap.fromTo(image, { yPercent: -4, scale: 1.07 }, { yPercent: 4, scale: 1, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
          }
        });
      });
    }
  
    function initReveals() {
      qa('[data-services-reveal="chars"]').forEach(el => {
        const chars = splitChars(el);
        if (reduced) return;
        gsap.set(chars, { yPercent: 105, autoAlpha: 0 });
        ScrollTrigger.create({ trigger: el, start: "top 86%", once: true, onEnter: () => gsap.to(chars, { yPercent: 0, autoAlpha: 1, duration: .92, stagger: .018, ease: "power4.out" }) });
      });
  
      qa('[data-services-reveal="words"]').forEach(el => {
        const words = splitWords(el);
        if (reduced) return;
        gsap.set(words, { yPercent: 22, autoAlpha: 0 });
        ScrollTrigger.create({ trigger: el, start: "top 86%", once: true, onEnter: () => gsap.to(words, { yPercent: 0, autoAlpha: 1, duration: .7, stagger: .02, ease: "power3.out" }) });
      });
    }
  
    function initMatrix() {
      if (reduced) return;
      qa("[data-service-row]").forEach((row, index) => {
        gsap.fromTo(row, { xPercent: index % 2 === 0 ? -2.5 : 2.5, autoAlpha: .25 }, { xPercent: 0, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: row, start: "top 90%", end: "top 55%", scrub: true } });
      });
    }
  
    function initNext() {
      const section = q("[data-services-next]");
      const link = q("[data-services-next-link]");
      if (!section || !link || reduced) return;
      gsap.fromTo(link, { y: 55, scale: .95, autoAlpha: .3 }, { y: 0, scale: 1, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: section, start: "top 82%", end: "top 18%", scrub: true } });
    }
  
    function init() {
      initHero();
      initDeck();
      initReveals();
      initMatrix();
      initNext();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
  })();
  