(() => {
  "use strict";

  const config = window.SEGCON_CONFIG;
  if (config) {
    const links = {
      email: "mailto:" + config.email,
      phone: "tel:" + config.phoneE164,
      whatsapp: "https://wa.me/" + config.whatsappNumber
    };
    const labels = { email: config.email, phone: config.phoneDisplay };
    document.querySelectorAll("[data-contact]").forEach((link) => {
      const href = links[link.dataset.contact];
      if (href) link.href = href;
    });
    document.querySelectorAll("[data-contact-label]").forEach((label) => {
      const value = labels[label.dataset.contactLabel];
      if (value) label.textContent = value;
    });
  }
  document.querySelectorAll("[data-current-year]").forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const mobile = window.matchMedia("(max-width: 1000px)");
  const closeMenu = (restoreFocus = false) => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.querySelector(".menu-label").textContent = "Menú";
    if (restoreFocus && mobile.matches) toggle.focus();
  };

  if (toggle && nav) {
    document.documentElement.classList.add("js");
    toggle.hidden = false;
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.querySelector(".menu-label").textContent = isOpen ? "Menú" : "Cerrar";
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu(true);
      }
    });
    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    nav.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
        const target = document.getElementById(link.hash.slice(1));
        if (target && mobile.matches) {
          if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      });
    });
    mobile.addEventListener("change", () => closeMenu());
  }

  if ("IntersectionObserver" in window && nav) {
    const sectionLinks = Array.from(nav.querySelectorAll('a[href^="#"]:not(.button)'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => {
          if (link.hash === "#" + entry.target.id) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-15% 0px -60% 0px", threshold: 0 });
    ["inicio", "nosotros", "servicios", "terreno", "contacto"].forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }
})();
