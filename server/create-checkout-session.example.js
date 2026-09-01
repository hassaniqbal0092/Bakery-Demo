/* =========================================================================
   REFERENCE IMPLEMENTATION — NOT EXECUTED BY THIS SITE.
   =========================================================================
   This file is documentation, not a running server. It shows what the
   backend/serverless endpoint at BAKERY_CONFIG.stripe.checkoutSessionEndpoint
   (see js/config.js) needs to do so js/checkout.js can hand off to Stripe
   Checkout for real payments.

   Static HTML/CSS/JS alone cannot process a real card payment — Stripe's
   secret key must never be shipped to the browser, and something has to
   own creating the Checkout Session server-side. This file is written in
   a generic Node/serverless handler style (works nearly as-is as a Vercel
   or Netlify Function; adapt the request/response plumbing for Express,
   AWS Lambda, Cloudflare Workers, etc.).

   WHAT A REAL DEPLOYMENT NEEDS:
     1. Node.js (or any language with a Stripe SDK) hosting environment —
        a Vercel/Netlify Function, a small Express app, AWS Lambda, etc.
     2. The Stripe SECRET key (sk_live_... / sk_test_...) stored ONLY as
        a server-side environment variable (e.g. STRIPE_SECRET_KEY),
        never committed to source control and never sent to the browser.
     3. A copy of (or shared import from) the bakery's menu/pricing data,
        so line-item prices can be re-validated server-side rather than
        trusted from the client's request body — the browser payload is
        just a hint of what the customer wants, never a source of truth
        for price.
     4. This endpoint deployed at the exact path configured in
        BAKERY_CONFIG.stripe.checkoutSessionEndpoint.
   ========================================================================= */

// npm install stripe
// const Stripe = require("stripe");
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Mirrors js/config.js menu catalog for server-side price validation.
// In a real deployment, import this from one shared source instead of
// duplicating it, so the catalog can't drift between client and server.
const CATALOG_PRICES = {
  "country-sourdough": 9.0,
  "rye-caraway": 10.0,
  "garlic-herb-levain": 11.0,
  "seeded-multigrain": 10.0,
  "daily-baguette": 5.0,
  "butter-croissant": 4.5,
  "almond-croissant": 5.5,
  "pain-au-chocolat": 5.0,
  "kouign-amann": 6.0,
  "morning-bun": 4.75,
  "cardamom-sticky-bun": 5.25,
  "vanilla-bean-cake": 6.5,
  "chocolate-stout-cake": 7.0,
  "lemon-olive-oil-cake": 6.0,
  "carrot-cake": 6.5,
  // Note: items with size-based pricing (whole cakes) would need their
  // variant/size folded into this lookup in a real implementation.
};

/**
 * Generic handler signature — adapt to your platform's request/response
 * shape (e.g. Vercel: `export default async function handler(req, res)`,
 * Netlify: `exports.handler = async (event) => {...}`, Express:
 * `app.post("/api/create-checkout-session", async (req, res) => {...})`).
 */
async function createCheckoutSessionHandler(req, res) {
  try {
    const { lineItems, currency, connectedAccountId, successUrl, cancelUrl } = req.body;

    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      res.status(400).json({ error: "No line items provided." });
      return;
    }

    // Re-validate every price against the trusted server-side catalog —
    // never trust `unitPrice` from the client payload directly.
    const stripeLineItems = lineItems.map((item) => {
      const trustedPrice = CATALOG_PRICES[item.itemId];
      if (trustedPrice === undefined) {
        throw new Error(`Unknown item id: ${item.itemId}`);
      }
      return {
        quantity: item.quantity,
        price_data: {
          currency: currency || "usd",
          unit_amount: Math.round(trustedPrice * 100), // Stripe expects cents
          product_data: {
            name: item.variant ? `${item.name} (${item.variant})` : item.name,
          },
        },
      };
    });

    // const session = await stripe.checkout.sessions.create(
    //   {
    //     mode: "payment",
    //     line_items: stripeLineItems,
    //     success_url: successUrl,
    //     cancel_url: cancelUrl,
    //   },
    //   connectedAccountId ? { stripeAccount: connectedAccountId } : undefined
    // );
    //
    // res.status(200).json({ id: session.id, url: session.url });

    throw new Error(
      "This is a reference implementation only — wire up the Stripe SDK call above and deploy it to enable real checkout."
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// module.exports = createCheckoutSessionHandler;
