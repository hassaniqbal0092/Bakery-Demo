/* =========================================================================
   CART — localStorage-backed shopping cart for regular menu items.
   Custom cake orders are handled separately as a quote-request form
   (see the Custom Cakes section of menu.html + js/forms.js) since their
   final price isn't fixed catalog pricing.
   ========================================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "emberoak_cart";

  function readCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function writeCart(lines) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    document.dispatchEvent(new CustomEvent("cart:updated", { detail: { lines } }));
  }

  function lineKey(itemId, variant) {
    return variant ? `${itemId}::${variant}` : itemId;
  }

  const Cart = {
    getLines() {
      return readCart();
    },
    addItem({ itemId, name, price, variant, icon, qty }) {
      const lines = readCart();
      const key = lineKey(itemId, variant);
      const existing = lines.find((l) => l.key === key);
      if (existing) {
        existing.qty += qty || 1;
      } else {
        lines.push({
          key,
          itemId,
          name,
          price,
          variant: variant || null,
          icon,
          qty: qty || 1,
        });
      }
      writeCart(lines);
    },
    updateQty(key, qty) {
      let lines = readCart();
      if (qty <= 0) {
        lines = lines.filter((l) => l.key !== key);
      } else {
        const line = lines.find((l) => l.key === key);
        if (line) line.qty = qty;
      }
      writeCart(lines);
    },
    removeItem(key) {
      const lines = readCart().filter((l) => l.key !== key);
      writeCart(lines);
    },
    clear() {
      writeCart([]);
    },
    getCount() {
      return readCart().reduce((sum, l) => sum + l.qty, 0);
    },
    getTotal() {
      return readCart().reduce((sum, l) => sum + l.qty * l.price, 0);
    },
  };

  window.Cart = Cart;

  /* ---- Cart UI: header button, drawer, overlay ------------------------ */
  function formatPrice(n) {
    return `$${n.toFixed(2)}`;
  }

  function buildDrawerMarkup() {
    return `
      <div class="cart-overlay" id="cartOverlay"></div>
      <aside class="cart-drawer" id="cartDrawer" aria-label="Shopping cart" aria-hidden="true">
        <div class="cart-drawer__head">
          <h2>Your Order</h2>
          <button type="button" class="cart-close" id="cartClose" aria-label="Close cart">&times;</button>
        </div>
        <div class="cart-drawer__items" id="cartItems"></div>
        <div class="cart-drawer__foot">
          <div class="cart-total-row">
            <span>Subtotal</span>
            <span id="cartSubtotal">$0.00</span>
          </div>
          <button type="button" class="btn btn-primary btn-block" id="checkoutBtn">Checkout with Stripe</button>
          <p class="cart-note">Pickup at 214 Depot Street, Asheville · Taxes calculated at checkout</p>
        </div>
      </aside>
    `;
  }

  function renderDrawer() {
    const itemsEl = document.getElementById("cartItems");
    const subtotalEl = document.getElementById("cartSubtotal");
    const countEls = document.querySelectorAll("[data-cart-count]");
    if (!itemsEl) return;

    const lines = Cart.getLines();
    countEls.forEach((el) => (el.textContent = Cart.getCount()));

    if (lines.length === 0) {
      itemsEl.innerHTML = `<div class="cart-empty">Your cart is empty.<br>Add something fresh from the <a href="menu.html">menu</a>.</div>`;
      subtotalEl.textContent = formatPrice(0);
      return;
    }

    itemsEl.innerHTML = lines
      .map(
        (l) => `
      <div class="cart-line" data-key="${l.key}">
        <div class="cart-line__icon"><img src="images/${l.icon}" alt="" width="28" height="28" loading="lazy"></div>
        <div class="cart-line__body">
          <div class="cart-line__title">${l.name}</div>
          ${l.variant ? `<div class="cart-line__variant">${l.variant}</div>` : ""}
          <div class="cart-line__controls">
            <div class="qty-stepper">
              <button type="button" data-action="dec" aria-label="Decrease quantity">&minus;</button>
              <span>${l.qty}</span>
              <button type="button" data-action="inc" aria-label="Increase quantity">&plus;</button>
            </div>
            <button type="button" class="cart-line__remove" data-action="remove">Remove</button>
          </div>
        </div>
        <div class="cart-line__price">${formatPrice(l.price * l.qty)}</div>
      </div>`
      )
      .join("");

    subtotalEl.textContent = formatPrice(Cart.getTotal());
  }

  function openDrawer() {
    document.getElementById("cartDrawer").classList.add("is-open");
    document.getElementById("cartOverlay").classList.add("is-open");
    document.getElementById("cartDrawer").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    document.getElementById("cartDrawer").classList.remove("is-open");
    document.getElementById("cartOverlay").classList.remove("is-open");
    document.getElementById("cartDrawer").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function initCartUI() {
    const mount = document.getElementById("cartMount");
    if (!mount) return;
    mount.innerHTML = buildDrawerMarkup();
    renderDrawer();

    document.querySelectorAll("[data-cart-open]").forEach((btn) => {
      btn.addEventListener("click", openDrawer);
    });
    document.getElementById("cartClose").addEventListener("click", closeDrawer);
    document.getElementById("cartOverlay").addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });

    document.getElementById("cartItems").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const key = btn.closest(".cart-line").dataset.key;
      const lines = Cart.getLines();
      const line = lines.find((l) => l.key === key);
      if (!line) return;
      if (btn.dataset.action === "inc") Cart.updateQty(key, line.qty + 1);
      if (btn.dataset.action === "dec") Cart.updateQty(key, line.qty - 1);
      if (btn.dataset.action === "remove") Cart.removeItem(key);
    });

    document.addEventListener("cart:updated", renderDrawer);

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn && window.startStripeCheckout) {
      checkoutBtn.addEventListener("click", window.startStripeCheckout);
    }
  }

  document.addEventListener("DOMContentLoaded", initCartUI);
})();
