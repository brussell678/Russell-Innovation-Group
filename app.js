(function () {
  var themeToggle = document.getElementById("theme-toggle");
  var storedTheme = localStorage.getItem("rig-theme");
  var prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var currentTheme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : prefersDark ? "dark" : "light";

  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (!themeToggle) return;
    var isDark = currentTheme === "dark";
    themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.textContent = isDark ? "Light" : "Dark";
  }

  applyTheme(currentTheme);
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var nextTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem("rig-theme", nextTheme);
      applyTheme(nextTheme);
    });
  }

  var brandLogos = document.querySelectorAll(".brand-logo");
  brandLogos.forEach(function (logo) {
    var tried = 0;
    var fallbacks = [
      "assets/logo-light.png",
      "assets/logo-light.jpg",
      "assets/logo-light.jpeg",
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

  var form = document.getElementById("contact-form");
  if (!form) return;

  var fields = ["name", "email", "organization", "message"];
  var thankYou = document.getElementById("form-success");
  var endpoint = form.getAttribute("data-endpoint");

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
    if (honeypot && honeypot.value.trim()) {
      valid = false;
    }

    if (!valid) return;

    var payload = {};
    fields.forEach(function (id) {
      var input = document.getElementById(id);
      payload[id] = input ? input.value.trim() : "";
    });

    if (!endpoint || endpoint.indexOf("your_form_id") !== -1) {
      form.reset();
      if (thankYou) {
        thankYou.hidden = false;
        thankYou.textContent =
          "Thank you. Form endpoint is not configured yet, but validation is working.";
      }
      return;
    }

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Submission failed");
        form.reset();
        if (thankYou) {
          thankYou.hidden = false;
          thankYou.textContent = "Thank you. Your message has been received.";
        }
      })
      .catch(function () {
        if (thankYou) {
          thankYou.hidden = false;
          thankYou.textContent =
            "We could not submit the form right now. Please email contact@russellinnovationgroup.com.";
        }
      });
  });
})();
