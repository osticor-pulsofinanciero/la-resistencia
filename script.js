/* =========================================================
   TCP LA RESISTENCIA — Lógica e interacciones
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Año dinámico en el footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menú lateral ---------- */
  const body = document.body;
  const menuToggle = document.getElementById("menuToggle");
  const menuClose = document.getElementById("menuClose");
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");
  const sideLinks = document.querySelectorAll(".side-nav__link");

  function openMenu() {
    body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
    sideMenu.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    sideMenu.setAttribute("aria-hidden", "true");
  }

  if (menuToggle && sideMenu && overlay && menuClose) {
    menuToggle.addEventListener("click", function () {
      body.classList.contains("menu-open") ? closeMenu() : openMenu();
    });

    menuClose.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    sideLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Barra de progreso de scroll ---------- */
  const progressBar = document.getElementById("progressBar");

  function updateProgress() {
    if (!progressBar) return;
    const doc = document.documentElement;
    const total = doc.scrollHeight - doc.clientHeight;
    const pct = total > 0 ? (doc.scrollTop / total) * 100 : 0;
    progressBar.style.width = pct + "%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  /* ---------- Stagger automático ---------- */
  // Elementos con [data-stagger] reciben un retraso incremental
  document.querySelectorAll("[data-stagger]").forEach(function (parent) {
    const children = parent.querySelectorAll(".reveal");
    children.forEach(function (child, i) {
      if (!child.style.getPropertyValue("--d")) {
        child.style.setProperty("--d", i * 90 + "ms");
      }
    });
  });

  /* ---------- Animación de revelado al hacer scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObs.observe(el);
    });
  } else {
    // Fallback para navegadores antiguos
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Contadores animados ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const startTime = performance.now();

    function tick(now) {
      const t = Math.min((now - startTime) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll("[data-count]");

  if (counters.length) {
    if ("IntersectionObserver" in window) {
      const countObs = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach(function (c) {
        countObs.observe(c);
      });
    } else {
      counters.forEach(function (el) {
        el.textContent = (el.dataset.count || "0") + (el.dataset.suffix || "");
      });
    }
  }

  /* ---------- Navegación activa según scroll ---------- */
  const sections = document.querySelectorAll("main section[id], main header[id]");
  const navLinks = document.querySelectorAll(".side-nav__link");

  function setActiveNav() {
    const scrollY = window.scrollY + 140;
    let current = "";

    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });

    navLinks.forEach(function (link) {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === "#" + current
      );
    });
  }

  if (sections.length && navLinks.length) {
    window.addEventListener("scroll", setActiveNav, { passive: true });
    setActiveNav();
  }

  /* ---------- Enlaces de rutas → WhatsApp con mensaje prellenado ---------- */
  const WA_PRINCIPAL = "5358213831";

  document.querySelectorAll(".route-card__link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const ruta = link.dataset.ruta || "un destino";
      const mensaje = encodeURIComponent(
        "Hola, TCP La Resistencia 👋 Quisiera consultar disponibilidad y precio para viajar a " +
          ruta +
          " desde Cárdenas."
      );
      window.open(
        "https://wa.me/" + WA_PRINCIPAL + "?text=" + mensaje,
        "_blank",
        "noopener"
      );
    });
  });

  /* ---------- Cierre del menú al hacer click en overlay/ESC ya cubierto ---------- */
  // (incluido arriba)

  /* ---------- Pequeño fix: recalcular progreso al cargar fuentes ---------- */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateProgress);
  }
})();