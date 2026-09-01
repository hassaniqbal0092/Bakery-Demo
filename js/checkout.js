/* =========================================================================
   CHECKOUT — hands off the cart to Stripe Checkout.

   This file intentionally never touches a Stripe secret key and never
   collects card details itself. It:
     1. Reads the cart from js/cart.js.
     2. POSTs a plain description of the cart to
        BAKERY_CONFIG.stripe.checkoutSessionEndpoint — a backend/serverless
        endpoint that YOU deploy (this file does not implement it; see
        /server/create-checkout-session.example.js for a reference
        implementation).
     3. Expects that endpoint to respond with either a Stripe Checkout
        Session `id` or a ready-to-use `url`, then redirects the browser
        there. All card entry happens on Stripe's own hosted page.

   If no real endpoint has been deployed yet (the common case for this
   template out of the box), the fetch will fail — that's expected, and
   we show an explanatory notice instead of a silent/broken button.
   ========================================================================= */

(function () {
  "use strict";

  function money(n) {
    return `$${n.toFixed(2)}`;
  }

  function showCheckoutNotice(message, isError) {
    let toast = document.getElementById("checkoutToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "checkoutToast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.background = isError ? "var(--error)" : "var(--ink)";
    toast.classList.add("is-visible");
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.remove("is-visible"), 5200);
  }

  async function startStripeCheckout() {
    const config = window.BAKERY_CONFIG;
    const lines = window.Cart.getLines();

    if (!lines.length) {
      showCheckoutNotice("Your cart is empty — add something from the menu first.", true);
      return;
    }

    const btn = document.getElementById("checkoutBtn");
    const originalLabel = btn ? btn.textContent : "";
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Connecting to Stripe…";
    }

    // The line-item shape a real backend would need to turn into Stripe
    // price_data (or looked-up Price IDs). We send the itemId so the
    // server can re-validate against its own trusted catalog rather than
    // trusting the price/name the browser sends.
    const payload = {
      currency: config.stripe.currency,
      connectedAccountId: config.stripe.connectedAccountId,
      successUrl: window.location.origin + config.stripe.successUrl,
      cancelUrl: window.location.origin + config.stripe.cancelUrl,
      lineItems: lines.map((l) => ({
        itemId: l.itemId,
        variant: l.variant,
        name: l.name,
        unitPrice: l.price,
        quantity: l.qty,
      })),
    };

    try {
      const res = await fetch(config.stripe.checkoutSessionEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Checkout endpoint responded with ${res.status}`);

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      if (data.id && window.Stripe && config.stripe.publishableKey) {
        const stripe = window.Stripe(config.stripe.publishableKey, {
          stripeAccount: config.stripe.connectedAccountId || undefined,
        });
        const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
        if (error) throw error;
        return;
      }

      throw new Error("Checkout endpoint did not return a session id or url.");
    } catch (err) {
      console.warn("[Ember & Oak] Stripe Checkout is not connected in this demo:", err.message);
      showCheckoutNotice(
        `Demo mode: no live Stripe backend is connected. In production this button posts the cart (total ${money(
          window.Cart.getTotal()
        )}) to ${config.stripe.checkoutSessionEndpoint}, which creates a Stripe Checkout Session server-side and redirects here to pay.`,
        true
      );
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = originalLabel;
      }
    }
  }

  window.startStripeCheckout = startStripeCheckout;
})();
