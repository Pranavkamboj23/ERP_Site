/* =========================================================
   VERTICAL 4 — CORE JS
   Shared across every page.

   Handles:
   - Desktop Lenis smooth scroll
   - Mobile native scrolling
   - Menu open / close
   - Multi-page navigation
   - Same-page anchor navigation
   - Escape key
   - Back to top
========================================================= */

(() => {

  "use strict";


  /* =====================================================
     HELPERS
  ===================================================== */

  const q = selector =>
      document.querySelector(selector);

  const qa = selector =>
      Array.from(document.querySelectorAll(selector));

  const isMobile = () =>
      window.matchMedia("(max-width: 767px)").matches;

  const isCoarse = () =>
      window.matchMedia("(pointer: coarse)").matches;

  const useNativeScroll =
      isMobile() || isCoarse();


  /* =====================================================
     LENIS
     DESKTOP ONLY
  ===================================================== */

  let lenis = null;


  if (
      !useNativeScroll &&
      typeof Lenis !== "undefined"
  ) {

      lenis = new Lenis({

          duration: 1.15,

          smoothWheel: true,

          smoothTouch: false,

          wheelMultiplier: 0.9,

          touchMultiplier: 1

      });


      window.lenis = lenis;


      function raf(time) {

          lenis.raf(time);

          requestAnimationFrame(raf);

      }


      requestAnimationFrame(raf);


      if (
          typeof ScrollTrigger !== "undefined"
      ) {

          lenis.on(
              "scroll",
              ScrollTrigger.update
          );

      }

  }


  /* =====================================================
     MENU
  ===================================================== */

  const menu =
      q(".menu-overlay");

  const menuOpenButton =
      q("[data-menu-open]");

  const menuCloseButton =
      q("[data-menu-close]");


  let menuIsOpen = false;


  function openMenu() {

      if (
          !menu ||
          menuIsOpen
      ) {
          return;
      }


      menuIsOpen = true;


      menu.setAttribute(
          "aria-hidden",
          "false"
      );


      document.body
          .classList
          .add("menu-open");


      if (lenis) {

          lenis.stop();

      }


      if (
          typeof gsap !== "undefined"
      ) {

          gsap.killTweensOf(menu);


          gsap.set(
              menu,
              {
                  display: "block"
              }
          );


          gsap.fromTo(
              menu,

              {
                  clipPath:
                      "inset(0% 0% 100% 0%)"
              },

              {
                  clipPath:
                      "inset(0% 0% 0% 0%)",

                  duration:
                      0.75,

                  ease:
                      "power4.inOut"
              }

          );


          gsap.fromTo(

              ".menu-nav a",

              {
                  y: 35,
                  opacity: 0
              },

              {
                  y: 0,
                  opacity: 1,

                  duration:
                      0.65,

                  stagger:
                      0.045,

                  delay:
                      0.2,

                  ease:
                      "power3.out"
              }

          );

      }
      else {

          menu.style.display =
              "block";

      }

  }


  function closeMenu(callback) {

      if (
          !menu ||
          !menuIsOpen
      ) {

          if (callback) {
              callback();
          }

          return;

      }


      menuIsOpen = false;


      document.body
          .classList
          .remove("menu-open");


      if (
          typeof gsap !== "undefined"
      ) {

          gsap.to(
              menu,
              {

                  clipPath:
                      "inset(0% 0% 100% 0%)",

                  duration:
                      0.6,

                  ease:
                      "power4.inOut",


                  onComplete:
                      () => {

                          menu.style.display =
                              "none";

                          menu.setAttribute(
                              "aria-hidden",
                              "true"
                          );


                          if (lenis) {

                              lenis.start();

                          }


                          if (callback) {

                              callback();

                          }

                      }

              }
          );

      }
      else {

          menu.style.display =
              "none";


          menu.setAttribute(
              "aria-hidden",
              "true"
          );


          if (lenis) {

              lenis.start();

          }


          if (callback) {

              callback();

          }

      }

  }


  if (menu) {

      gsap.set(
          menu,
          {
              display:
                  "none",

              clipPath:
                  "inset(0% 0% 100% 0%)"
          }
      );

  }


  if (menuOpenButton) {

      menuOpenButton
          .addEventListener(
              "click",
              openMenu
          );

  }


  if (menuCloseButton) {

      menuCloseButton
          .addEventListener(
              "click",
              () => closeMenu()
          );

  }


  /* =====================================================
     ESCAPE KEY
  ===================================================== */

  document.addEventListener(
      "keydown",
      event => {

          if (
              event.key === "Escape" &&
              menuIsOpen
          ) {

              closeMenu();

          }

      }
  );


  /* =====================================================
     NAVIGATION

     IMPORTANT:
     Normal HTML links such as:
     ./about.html
     ./services.html

     are NOT prevented.

     Only same-page #anchors are handled
     with smooth scrolling.
  ===================================================== */

  qa("a[href]").forEach(link => {

      link.addEventListener(
          "click",
          event => {

              const href =
                  link.getAttribute("href");


              if (
                  !href ||
                  href === "#" ||
                  href.startsWith("javascript:")
              ) {

                  return;

              }


              /*
               * NORMAL PAGE LINK
               *
               * Examples:
               * ./about.html
               * ./services.html
               * ./work.html
               *
               * Let the browser navigate normally.
               */

              if (
                  !href.startsWith("#")
              ) {

                  if (
                      menuIsOpen &&
                      link.closest(
                          ".menu-overlay"
                      )
                  ) {

                      event.preventDefault();


                      closeMenu(
                          () => {

                              window.location.href =
                                  href;

                          }
                      );

                  }


                  return;

              }


              /*
               * SAME PAGE ANCHOR
               */

              const target =
                  q(href);


              if (!target) {

                  return;

              }


              event.preventDefault();


              const scrollToTarget =
                  () => {

                      if (lenis) {

                          lenis.scrollTo(
                              target,
                              {

                                  offset:
                                      -70,

                                  duration:
                                      1.15

                              }
                          );

                      }
                      else {

                          target
                              .scrollIntoView(
                                  {

                                      behavior:
                                          "smooth",

                                      block:
                                          "start"

                                  }
                              );

                      }

                  };


              if (menuIsOpen) {

                  closeMenu(
                      scrollToTarget
                  );

              }
              else {

                  scrollToTarget();

              }

          }

      );

  });


  /* =====================================================
     BACK TO TOP
  ===================================================== */

  qa(
      "[data-back-top]"
  )
  .forEach(button => {

      button.addEventListener(
          "click",
          event => {

              event.preventDefault();


              if (lenis) {

                  lenis.scrollTo(
                      0,
                      {
                          duration:
                              1.1
                      }
                  );

              }
              else {

                  window.scrollTo(
                      {

                          top:
                              0,

                          behavior:
                              "smooth"

                      }
                  );

              }

          }

      );

  });


  /* =====================================================
     PAGE LOAD
  ===================================================== */

  window.addEventListener(
      "load",
      () => {

          if (
              typeof ScrollTrigger !==
              "undefined"
          ) {

              requestAnimationFrame(
                  () => {

                      ScrollTrigger.refresh();

                  }
              );

          }

      }
  );


  /* =====================================================
     ORIENTATION CHANGE

     We deliberately DO NOT refresh ScrollTrigger every
     mobile resize because browser address bars trigger
     resize repeatedly while scrolling.
  ===================================================== */

  window.addEventListener(
      "orientationchange",
      () => {

          setTimeout(
              () => {

                  if (
                      typeof ScrollTrigger !==
                      "undefined"
                  ) {

                      ScrollTrigger.refresh();

                  }

              },
              450
          );

      }
  );

})();