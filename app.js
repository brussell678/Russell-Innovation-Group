(function () {

  // ── Hamburger nav toggle ──────────────────────────────────────────
  var navToggle = document.getElementById('nav-toggle');
  var siteNav   = document.getElementById('primary-nav');

  if (navToggle && siteNav) {
    var navOriginalParent = siteNav.parentNode;
    var navTeleported = false;

    // Inject a dedicated close button inside the overlay so it stays visible
    // above the dark backdrop regardless of stacking context
    var navCloseBtn = document.createElement('button');
    navCloseBtn.className = 'nav-close-btn';
    navCloseBtn.setAttribute('aria-label', 'Close menu');
    navCloseBtn.textContent = '✕'; // ✕
    siteNav.appendChild(navCloseBtn);

    function closeNav() {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('nav-open');
      document.body.style.overflow = '';
      // Teleport nav back to header so desktop layout is unaffected
      if (navTeleported) {
        navOriginalParent.appendChild(siteNav);
        navTeleported = false;
      }
    }

    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeNav();
      } else {
        navToggle.setAttribute('aria-expanded', 'true');
        // Teleport nav to <body> so position:fixed uses the viewport as its
        // containing block — backdrop-filter on .site-header would otherwise
        // trap position:fixed children inside the header's stacking context
        document.body.appendChild(siteNav);
        navTeleported = true;
        siteNav.classList.add('nav-open');
        document.body.style.overflow = 'hidden';
      }
    });

    navCloseBtn.addEventListener('click', closeNav);

    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && siteNav.classList.contains('nav-open')) {
        closeNav();
      }
    });

    // Tap on the backdrop (not a link or button) also closes
    siteNav.addEventListener('click', function (e) {
      if (e.target === siteNav) { closeNav(); }
    });

    // If the viewport is resized to desktop while the nav is open, close cleanly
    window.addEventListener('resize', function () {
      if (navTeleported && window.innerWidth > 640) { closeNav(); }
    });
  }

  // ── Scroll reveal ─────────────────────────────────────────────────
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  // ── Tab navigation ────────────────────────────────────────────────
  var tabBtns    = document.querySelectorAll('.tab-btn');
  var tabPanels  = document.querySelectorAll('.tab-panel');

  if (tabBtns.length) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab');

        tabBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach(function (p) {
          p.classList.remove('active');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        var panel = document.getElementById('panel-' + target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ── Brand logo fallbacks ──────────────────────────────────────────
  var brandLogos = document.querySelectorAll(".brand-logo");
  brandLogos.forEach(function (logo) {
    var tried = 0;
    var fallbacks = [
      "browserlogo.png",
      "assets/logo-light.png",
      "assets/logo-light.png",
      "assets/logo.png",
      "logo-light.png"
    ];

    function tryNextLogo() {
      tried += 1;
      if (tried < fallbacks.length) {
        logo.src = fallbacks[tried];
      } else {
        logo.style.display = "none";
      }
    }

    logo.addEventListener("error", tryNextLogo);

    // Handle cases where the initial load already failed before listeners were attached.
    if (logo.complete && logo.naturalWidth === 0) {
      tryNextLogo();
    }
  });

  var path = window.location.pathname.replace(/\/+$/, "");
  if (!path || path === "/") path = "/index.html";
  var links = document.querySelectorAll("[data-nav]");

  links.forEach(function (link) {
    var href = link.getAttribute("href") || "";
    if (!href) return;
    var target = new URL(href, window.location.href).pathname.replace(/\/+$/, "");
    if (!target || target === "/") target = "/index.html";
    if (target.toLowerCase() === path.toLowerCase()) link.classList.add("active");
  });

  var lightbox = document.getElementById("image-lightbox");
  var lightboxImg = document.getElementById("image-lightbox-img");
  var lightboxClose = document.getElementById("image-lightbox-close");
  var lightboxTriggers = document.querySelectorAll("[data-lightbox-trigger]");
  var lightboxFallbackSrc = "";
  var lightboxFallbackUsed = false;

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    if (lightboxImg) lightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
  }

  if (lightbox && lightboxImg) {
    lightboxImg.addEventListener("error", function () {
      if (!lightboxFallbackUsed && lightboxFallbackSrc) {
        lightboxFallbackUsed = true;
        lightboxImg.src = lightboxFallbackSrc;
        return;
      }
      closeLightbox();
    });

    lightboxTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var thumbnail = trigger.querySelector("img");
        var src =
          (thumbnail && (thumbnail.currentSrc || thumbnail.src)) ||
          trigger.getAttribute("data-lightbox-src");
        if (!src) return;
        lightboxFallbackSrc = trigger.getAttribute("data-lightbox-fallback") || "";
        lightboxFallbackUsed = false;
        lightboxImg.src = src;
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  var form = document.getElementById("contact-form");
  if (!form) return;

  var fields = ["name", "email", "organization", "message"];
  var thankYou = document.getElementById("form-success");
  var endpoint = form.getAttribute("data-endpoint") || "/api/contact";

  function setError(id, message) {
    var slot = document.querySelector('[data-error-for="' + id + '"]');
    if (slot) slot.textContent = message || "";
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var valid = true;

    fields.forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) return;
      var value = input.value.trim();
      var message = "";

      if (!value) message = "This field is required.";
      if (id === "email" && value && !isEmail(value)) {
        message = "Enter a valid email address.";
      }
      if (id === "message" && value.length < 20) {
        message = "Please include at least 20 characters.";
      }
      setError(id, message);
      if (message) valid = false;
    });

    var honeypot = document.getElementById("website");
    var honeypotValue = honeypot ? honeypot.value.trim() : "";
    if (honeypotValue) {
      valid = false;
    }

    if (!valid) return;

    var payload = {};
    fields.forEach(function (id) {
      var input = document.getElementById(id);
      payload[id] = input ? input.value.trim() : "";
    });
    payload.website = honeypotValue;

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        return response
          .json()
          .catch(function () {
            return {};
          })
          .then(function (data) {
            if (!response.ok) {
              var detail = data && (data.details || data.error);
              throw new Error(detail || "Submission failed");
            }
            form.reset();
            if (thankYou) {
              thankYou.hidden = false;
              thankYou.textContent = "Thank you. Your message has been received.";
            }
          });
      })
      .catch(function (error) {
        if (thankYou) {
          thankYou.hidden = false;
          thankYou.textContent = "Submission failed: " + (error && error.message
            ? error.message
            : "Please email contact@russell-innovation-group.com.");
        }
      });
  });
})();

