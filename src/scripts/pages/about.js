/* =========================================================
   ABOUT PAGE — GSAP / ScrollTrigger
   Uses the shared site scroll system. No second Lenis instance.
========================================================= */

(() => {
    if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") return;
  
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
  
    const q = (selector, root = document) => root.querySelector(selector);
    const qa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
    function splitChars(element){
      if (!element || element.dataset.aboutCharSplit === "true") return [];
      const text = element.textContent || "";
      element.textContent = "";
      element.setAttribute("aria-label", text.replace(/\s+/g," ").trim());
      const chars = [];
  
      Array.from(text).forEach(character => {
        const span = document.createElement("span");
        span.setAttribute("aria-hidden","true");
        span.style.display = "inline-block";
  
        if (/\s/.test(character)) {
          span.innerHTML = "&nbsp;";
          span.style.width = ".28em";
        } else {
          span.textContent = character;
          chars.push(span);
        }
  
        element.appendChild(span);
      });
  
      element.dataset.aboutCharSplit = "true";
      return chars;
    }
  
    function splitWords(element){
      if (!element || element.dataset.aboutWordSplit === "true") return [];
      const text = (element.textContent || "").replace(/\s+/g," ").trim();
      if (!text) return [];
  
      element.textContent = "";
      element.setAttribute("aria-label",text);
      const words = [];
  
      text.split(" ").forEach((word,index,all) => {
        const span = document.createElement("span");
        span.setAttribute("aria-hidden","true");
        span.style.display = "inline-block";
        span.textContent = word;
        element.appendChild(span);
        words.push(span);
        if (index < all.length - 1) element.appendChild(document.createTextNode(" "));
      });
  
      element.dataset.aboutWordSplit = "true";
      return words;
    }
  
    function initHero(){
      const hero = q("[data-about-hero]");
      if (!hero) return;
  
      const headings = qa("[data-about-hero-line] h1");
      headings.forEach((heading,index) => {
        const chars = splitChars(heading);
        if (reducedMotion || !chars.length) return;
        gsap.set(chars,{yPercent:110,autoAlpha:0});
        gsap.to(chars,{yPercent:0,autoAlpha:1,duration:1.05,delay:.12+index*.08,stagger:.022,ease:"power4.out"});
      });
  
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)",() => {
        if (reducedMotion) return;
        const lines = qa("[data-about-hero-line]");
        const offsets = [-7,6,-4];
        lines.forEach((line,index) => {
          gsap.to(line,{xPercent:offsets[index] || 0,ease:"none",scrollTrigger:{trigger:hero,start:"top top",end:"bottom top",scrub:true}});
        });
      });
    }
  
    function initFeature(){
      const frame = q("[data-about-image-reveal]");
      if (!frame || reducedMotion) return;
      const image = q("img",frame);
  
      gsap.fromTo(frame,{clipPath:window.innerWidth < 768 ? "inset(8% 5%)" : "inset(16% 18%)"},{clipPath:"inset(0% 0%)",ease:"none",scrollTrigger:{trigger:frame,start:"top 90%",end:"top 20%",scrub:true}});
  
      if (image) gsap.fromTo(image,{scale:1.12,yPercent:-3},{scale:1,yPercent:5,ease:"none",scrollTrigger:{trigger:frame,start:"top bottom",end:"bottom top",scrub:true}});
    }
  
    function initTextReveals(){
      qa('[data-about-reveal="chars"]').forEach(element => {
        const chars = splitChars(element);
        if (reducedMotion || !chars.length) return;
        gsap.set(chars,{yPercent:105,autoAlpha:0});
        ScrollTrigger.create({trigger:element,start:"top 86%",once:true,onEnter:()=>gsap.to(chars,{yPercent:0,autoAlpha:1,duration:.92,stagger:.018,ease:"power4.out"})});
      });
  
      qa('[data-about-reveal="words"]').forEach(element => {
        const words = splitWords(element);
        if (reducedMotion || !words.length) return;
        gsap.set(words,{yPercent:22,autoAlpha:0});
        ScrollTrigger.create({trigger:element,start:"top 86%",once:true,onEnter:()=>gsap.to(words,{yPercent:0,autoAlpha:1,duration:.7,stagger:.02,ease:"power3.out"})});
      });
    }
  
    function initPrinciples(){
      const cards = qa(".about-principle");
      if (!cards.length || reducedMotion) return;
      gsap.fromTo(cards,{y:50,autoAlpha:0},{y:0,autoAlpha:1,duration:.8,stagger:.09,ease:"power3.out",scrollTrigger:{trigger:".about-principles__grid",start:"top 84%",once:true}});
    }
  
    function initStory(){
      const section = q("[data-about-story]");
      const track = q("[data-about-story-track]");
      const intro = q(".about-story__intro");
      if (!section || !track) return;
  
      const mm = gsap.matchMedia();
  
      mm.add("(min-width: 1024px)",() => {
        if (reducedMotion) return;
        const timeline = gsap.timeline({scrollTrigger:{trigger:section,start:"top top",end:"bottom bottom",scrub:true}});
        timeline.to(intro,{autoAlpha:0,scale:.965,duration:.45,ease:"none"},0)
                .fromTo(track,{x:"100vw"},{x:"-200vw",duration:3,ease:"none"},.32);
  
        return () => gsap.set(track,{clearProps:"transform"});
      });
  
      mm.add("(max-width: 1023px)",() => {
        if (reducedMotion) return;
        qa(".about-story__panel").forEach(panel => {
          gsap.fromTo(panel,{y:42,autoAlpha:.35},{y:0,autoAlpha:1,ease:"none",scrollTrigger:{trigger:panel,start:"top 92%",end:"top 35%",scrub:true}});
          const image = q(".about-story__media img",panel);
          if (image) gsap.fromTo(image,{yPercent:-4},{yPercent:4,ease:"none",scrollTrigger:{trigger:panel,start:"top bottom",end:"bottom top",scrub:true}});
        });
      });
    }
  
    function initCounters(){
      qa("[data-about-counter]").forEach(element => {
        const target = Number(element.dataset.aboutCounter || 0);
        ScrollTrigger.create({trigger:element,start:"top 88%",once:true,onEnter:()=>{
          if (reducedMotion){ element.textContent = String(target).padStart(2,"0"); return; }
          const state = {value:0};
          gsap.to(state,{value:target,duration:1.15,ease:"power2.out",onUpdate:()=>{element.textContent=String(Math.round(state.value)).padStart(2,"0");}});
        }});
      });
    }
  
    function initField(){
      if (reducedMotion) return;
      qa("[data-about-field-card]").forEach((card,index) => {
        gsap.fromTo(card,{y:index===0?70:110,autoAlpha:0,scale:.97},{y:0,autoAlpha:1,scale:1,ease:"none",scrollTrigger:{trigger:card,start:"top 94%",end:"top 44%",scrub:true}});
        const image = q(".about-field__image img",card);
        if (image) gsap.fromTo(image,{yPercent:-4,scale:1.07},{yPercent:4,scale:1,ease:"none",scrollTrigger:{trigger:card,start:"top bottom",end:"bottom top",scrub:true}});
      });
    }
  
    function initNext(){
      const section = q("[data-about-next]");
      const link = q("[data-about-next-link]");
      if (!section || !link || reducedMotion) return;
      gsap.fromTo(link,{y:55,scale:.95,autoAlpha:.3},{y:0,scale:1,autoAlpha:1,ease:"none",scrollTrigger:{trigger:section,start:"top 82%",end:"top 18%",scrub:true}});
    }
  
    function init(){
      initHero();
      initFeature();
      initTextReveals();
      initPrinciples();
      initStory();
      initCounters();
      initField();
      initNext();
      requestAnimationFrame(()=>ScrollTrigger.refresh());
    }
  
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",init,{once:true});
    else init();
  })();
  