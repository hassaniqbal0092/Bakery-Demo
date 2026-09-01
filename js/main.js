/* =========================================================================
   MAIN — renders the shared header/footer from BAKERY_CONFIG (so nav,
   brand, hours, and contact details only need to be edited in one place),
   wires up the mobile nav toggle, and sets the active nav state.
   Every page provides `<body data-page="...">` plus empty
   `<div id="siteHeader">`, `<div id="siteFooter">`, and
   `<div id="cartMount">` mount points.
   ========================================================================= */

(function () {
  "use strict";

  const NAV_ITEMS = [
    { href: "index.html", label: "Home", page: "home" },
    { href: "menu.html", label: "Menu & Custom Cakes", page: "menu" },
    { href: "about.html", label: "About", page: "about" },
    { href: "contact.html", label: "Contact", page: "contact" },
    { href: "feedback.html", label: "Feedback", page: "feedback" },
    { href: "faq.html", label: "FAQs", page: "faq" },
  ];

  function renderHeader(config, currentPage) {
    const mount = document.getElementById("siteHeader");
    if (!mount) return;

    const navLinks = NAV_ITEMS.map(
      (item) => `<a href="${item.href}"${item.page === currentPage ? ' aria-current="page"' : ""}>${item.label}</a>`
    ).join("");

    mount.innerHTML = `
      <header class="site-header">
        <div class="site-header__bar">
          <a href="index.html" class="brand">
            <img src="images/logo-mark.svg" alt="" class="brand__mark" width="40" height="40">
            <span class="brand__text">
              <span class="brand__name">${config.business.shortName}</span>
              <span class="brand__tagline">Bakehouse</span>
            </span>
          </a>
          <nav class="main-nav" id="mainNav" aria-label="Primary">
            ${navLinks}
          </nav>
          <div class="header-actions">
            <button type="button" class="cart-btn" data-cart-open aria-label="Open cart">
              🛒 <span>Cart</span>
              <span class="cart-count" data-cart-count>0</span>
            </button>
            <button type="button" class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="mainNav" aria-label="Toggle menu">☰</button>
          </div>
        </div>
      </header>
      <div id="cartMount"></div>
    `;

    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("mainNav");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function renderFooter(config) {
    const mount = document.getElementById("siteFooter");
    if (!mount) return;

    const navLinks = NAV_ITEMS.map((item) => `<li><a href="${item.href}">${item.label}</a></li>`).join("");
    const hoursLines = config.hours.map((h) => `<li><strong style="color:var(--flour)">${h.days}</strong> ${h.time}</li>`).join("");

    mount.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-col">
              <h4>${config.business.name}</h4>
              <p>${config.business.tagline}. Baking wood-fired bread and scratch pastry in ${config.business.city} since ${config.business.founded}.</p>
              <p>
                <a href="${config.business.social.instagram}" target="_blank" rel="noopener">Instagram</a> ·
                <a href="${config.business.social.facebook}" target="_blank" rel="noopener">Facebook</a>
              </p>
            </div>
            <div class="footer-col">
              <h4>Explore</h4>
              <ul>${navLinks}</ul>
            </div>
            <div class="footer-col">
              <h4>Visit</h4>
              <p>${config.business.address.line1}<br>${config.business.address.line2}<br>${config.business.address.city}, ${config.business.address.state} ${config.business.address.zip}</p>
              <ul>${hoursLines}</ul>
            </div>
            <div class="footer-col">
              <h4>Contact</h4>
              <p><a href="tel:${config.business.phone.tel}">${config.business.phone.display}</a></p>
              <p><a href="mailto:${config.business.email}">${config.business.email}</a></p>
              <p><a href="feedback.html">Share feedback</a></p>
            </div>
          </div>
          <div class="footer-bottom">
            <span>&copy; <span id="footerYear"></span> ${config.business.name}. All rights reserved.</span>
            <span>${config.business.address.city}, ${config.business.address.state}</span>
          </div>
        </div>
      </footer>
    `;
    document.getElementById("footerYear").textContent = new Date().getFullYear();
  }

  function injectLocalBusinessSchema(config) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Bakery",
      name: config.business.name,
      description: config.business.tagline,
      image: window.location.origin + "/images/hero-oven.svg",
      telephone: config.business.phone.display,
      email: config.business.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: config.business.address.line1,
        addressLocality: config.business.address.city,
        addressRegion: config.business.address.state,
        postalCode: config.business.address.zip,
        addressCountry: "US",
      },
      openingHoursSpecification: config.hours
        .filter((h) => h.time !== "Closed")
        .map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days,
          opens: h.time.split("–")[0].trim(),
          closes: h.time.split("–")[1].trim(),
        })),
      sameAs: [config.business.social.instagram, config.business.social.facebook],
      url: window.location.origin + "/index.html",
    });
    document.head.appendChild(script);
  }

  function syncCartCount() {
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = window.Cart ? window.Cart.getCount() : 0;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const config = window.BAKERY_CONFIG;
    const page = document.body.dataset.page || "";
    renderHeader(config, page);
    renderFooter(config);
    injectLocalBusinessSchema(config);
    syncCartCount();
    document.addEventListener("cart:updated", syncCartCount);
  });
})();
