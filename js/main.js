(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Navigation ---------------------------------------------------------- */

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }

    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
    });

    var links = Array.prototype.slice.call(nav.querySelectorAll('.site-nav__list a[href^="#"]'));
    var sections = links
      .map(function (link) { return document.querySelector(link.getAttribute("href")); })
      .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      sections.forEach(function (section) { observer.observe(section); });
    }
  }

  /* Hero-Slider --------------------------------------------------------- */

  function initSlider() {
    var hero = document.querySelector(".hero");
    if (!hero) return;

    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero__slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero__dots [role="tab"]'));
    var toggleButton = hero.querySelector('[data-slider="toggle"]');
    if (slides.length < 2) return;

    var INTERVAL = 7000;
    var current = 0;
    var timer = null;
    var userPaused = reduceMotion.matches;
    var hovered = false;
    var focused = false;

    function setFocusable(slide, enabled) {
      slide.querySelectorAll("a, button").forEach(function (el) {
        if (enabled) el.removeAttribute("tabindex");
        else el.setAttribute("tabindex", "-1");
      });
    }

    function show(index) {
      index = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        var active = i === index;
        if (active) {
          slide.hidden = false;
          // Reflow erzwingen, damit die Opacity-Transition nach dem Einblenden greift
          void slide.offsetWidth;
        }
        slide.classList.toggle("is-active", active);
        setFocusable(slide, active);
        if (!active) {
          if (reduceMotion.matches) {
            slide.hidden = true;
          } else {
            window.setTimeout(function () {
              if (!slide.classList.contains("is-active")) slide.hidden = true;
            }, 600);
          }
        }
      });
      dots.forEach(function (dot, i) {
        var active = i === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", String(active));
        dot.setAttribute("tabindex", active ? "0" : "-1");
      });
      current = index;
    }

    function shouldRun() {
      return !userPaused && !hovered && !focused && !document.hidden;
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function restartProgress() {
      var bar = hero.querySelector(".hero__dots .is-active .hero__progress");
      if (!bar) return;
      bar.style.animation = "none";
      void bar.offsetWidth;
      bar.style.animation = "";
    }

    function update() {
      stop();
      var running = shouldRun();
      hero.classList.toggle("is-playing", running);
      if (running) {
        restartProgress();
        timer = window.setInterval(function () {
          show(current + 1);
          restartProgress();
        }, INTERVAL);
      }
    }

    function setUserPaused(paused) {
      userPaused = paused;
      if (toggleButton) {
        toggleButton.setAttribute("aria-pressed", String(paused));
        toggleButton.setAttribute("aria-label", paused ? "Automatischen Wechsel fortsetzen" : "Automatischen Wechsel pausieren");
      }
      update();
    }

    hero.querySelector('[data-slider="prev"]').addEventListener("click", function () {
      show(current - 1);
      update();
    });
    hero.querySelector('[data-slider="next"]').addEventListener("click", function () {
      show(current + 1);
      update();
    });
    if (toggleButton) {
      toggleButton.addEventListener("click", function () { setUserPaused(!userPaused); });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        update();
      });
      dot.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight") next = i + 1;
        if (event.key === "ArrowLeft") next = i - 1;
        if (next === null) return;
        event.preventDefault();
        show(next);
        dots[current].focus();
        update();
      });
    });

    hero.addEventListener("mouseenter", function () { hovered = true; update(); });
    hero.addEventListener("mouseleave", function () { hovered = false; update(); });
    hero.addEventListener("focusin", function () { focused = true; update(); });
    hero.addEventListener("focusout", function (event) {
      if (!hero.contains(event.relatedTarget)) {
        focused = false;
        update();
      }
    });
    document.addEventListener("visibilitychange", update);

    show(0);
    setUserPaused(userPaused);
  }

  /* Kontaktformular (nur Validierung, kein Versand) --------------------- */

  function initForm() {
    var form = document.getElementById("anfrage");
    if (!form) return;

    var status = form.querySelector(".form__status");
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(input, message) {
      var field = input.closest(".form__field");
      var error = field.querySelector(".form__error");
      field.classList.toggle("has-error", Boolean(message));
      input.setAttribute("aria-invalid", message ? "true" : "false");
      if (error) error.textContent = message || "";
    }

    function validate(input) {
      var value = input.value.trim();
      if (input.required && !value) return "Bitte füllen Sie dieses Feld aus.";
      if (input.type === "email" && value && !emailPattern.test(value)) return "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
      if (input.name === "message" && value && value.length < 10) return "Bitte beschreiben Sie Ihr Anliegen etwas genauer (mindestens 10 Zeichen).";
      return "";
    }

    var inputs = Array.prototype.slice.call(form.querySelectorAll("input[required], textarea[required], input[type=email]"));

    inputs.forEach(function (input) {
      input.addEventListener("blur", function () { setError(input, validate(input)); });
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") setError(input, validate(input));
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var firstInvalid = null;

      inputs.forEach(function (input) {
        var message = validate(input);
        setError(input, message);
        if (message && !firstInvalid) firstInvalid = input;
      });

      status.classList.remove("is-success", "is-error");
      if (firstInvalid) {
        status.classList.add("is-error");
        status.textContent = "Bitte korrigieren Sie die markierten Felder.";
        firstInvalid.focus();
        return;
      }

      status.classList.add("is-success");
      status.textContent = "Eingaben geprüft. Im Entwurf werden keine Nachrichten versendet.";
    });
  }

  /* Google Maps erst nach Zustimmung ------------------------------------ */

  function initMap() {
    var button = document.querySelector("[data-map-load]");
    var map = document.querySelector(".map");
    if (!button || !map) return;

    button.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.google.com/maps?q=Exerzierplatzstra%C3%9Fe+85%2C+8051+Graz&output=embed";
      iframe.title = "Google Maps: Standort HAN Anlagenbau GmbH, Exerzierplatzstraße 85, 8051 Graz";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.setAttribute("allowfullscreen", "");
      map.replaceChildren(iframe);
      iframe.focus();
    });
  }

  /* Dezentes Einblenden beim Scrollen ----------------------------------- */

  function initReveal() {
    var items = document.querySelectorAll("[data-animate]");
    if (!items.length) return;
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { observer.observe(el); });
  }

  initNav();
  initSlider();
  initForm();
  initMap();
  initReveal();
})();
