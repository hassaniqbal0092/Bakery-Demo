/* =========================================================================
   EMBER & OAK BAKEHOUSE — SITE CONFIG
   =========================================================================
   This file is the ONLY place that should contain client-specific content:
   business info, hours, menu/pricing, and payment credentials. Every page
   and script reads from window.BAKERY_CONFIG. To re-skin this template for
   a different bakery/client:

     1. Edit the values below (business, hours, menu, stripe, forms).
     2. Replace files in /images with the new client's icons/photos.
     3. Update css/styles.css custom properties (:root) for brand colors
        and swap the Google Fonts <link> tags in each HTML <head> if the
        new client wants a different typeface pairing.

   No application logic in js/*.js or the HTML pages should ever need to
   change for a re-skin — everything client-specific funnels through here.
   ========================================================================= */

window.BAKERY_CONFIG = {

  /* -----------------------------------------------------------------------
     BUSINESS IDENTITY
     --------------------------------------------------------------------- */
  business: {
    name: "Ember & Oak Bakehouse",
    shortName: "Ember & Oak",
    tagline: "Wood-fired sourdough & scratch-made pastry",
    founded: 2018,
    city: "Asheville, NC",
    address: {
      line1: "214 Depot Street",
      line2: "River Arts District",
      city: "Asheville",
      state: "NC",
      zip: "28801",
    },
    // Standard placeholder exchange for demo/template purposes — replace
    // with the real client phone number before launch.
    phone: {
      display: "(828) 555-0142",
      tel: "+18285550142",
    },
    email: "hello@emberandoak.example",
    social: {
      instagram: "https://instagram.com/emberandoak",
      facebook: "https://facebook.com/emberandoak",
    },
    // Used for the Google Maps iframe embed on the Contact page — no API
    // key required for the basic maps.google.com/maps?q= embed format.
    mapEmbedQuery: "214 Depot Street, Asheville, NC 28801",
    mapsLink: "https://maps.google.com/?q=214+Depot+Street+Asheville+NC+28801",
  },

  /* -----------------------------------------------------------------------
     HOURS
     --------------------------------------------------------------------- */
  hours: [
    { days: "Tuesday – Friday", time: "7:00 AM – 3:00 PM" },
    { days: "Saturday", time: "7:00 AM – 2:00 PM" },
    { days: "Sunday – Monday", time: "Closed" },
  ],
  hoursNote: "Our ovens run in small daily batches — popular breads and pastries often sell out by early afternoon.",

  /* -----------------------------------------------------------------------
     TEAM / ABOUT
     --------------------------------------------------------------------- */
  team: [
    {
      name: "Maren Kessler",
      role: "Founder & Head Baker",
      bio: "Maren trained in bread kitchens in Lyon before returning home to Asheville, where she baked her first loaves for friends out of a countertop oven. Ember & Oak grew from that kitchen table into a wood-fired hearth bakery built around long fermentation and honest ingredients.",
    },
    {
      name: "Diego Solis",
      role: "Pastry Chef & Cake Designer",
      bio: "Diego heads up viennoiserie and all custom cake work, from birthday orders to multi-tier wedding cakes. He trained in restaurant pastry kitchens in Charleston and joined Ember & Oak in 2020 to build out the custom cake program.",
    },
    {
      name: "Priya Anand",
      role: "Bakery Manager",
      bio: "Priya keeps the front counter, custom orders, and delivery schedule running, and is usually the friendly voice you'll reach by phone or email.",
    },
  ],

  /* -----------------------------------------------------------------------
     MENU — organized by category. Each item: id, name, description, price
     (in USD), icon (references an SVG in /images), and tags for allergens.
     `sizes` (optional) supports simple size-based pricing (e.g. cake by
     the slice vs. whole).
     --------------------------------------------------------------------- */
  menu: {
    categories: [
      {
        id: "breads",
        name: "Wood-Fired Breads",
        description: "Naturally leavened with our house sourdough culture and baked in small batches in our wood-fired hearth oven.",
        items: [
          {
            id: "country-sourdough",
            name: "Country Sourdough Loaf",
            description: "Our signature loaf — a 60-hour cold ferment, open crumb, and a deeply blistered crust from the wood-fired hearth.",
            price: 9.0,
            icon: "icon-loaf.svg",
            tags: ["contains wheat", "vegan"],
            featured: true,
          },
          {
            id: "rye-caraway",
            name: "Rye & Caraway Loaf",
            description: "Dark rye blended with our sourdough starter, toasted caraway, and a touch of molasses.",
            price: 10.0,
            icon: "icon-loaf.svg",
            tags: ["contains wheat", "vegan"],
          },
          {
            id: "garlic-herb-levain",
            name: "Roasted Garlic & Herb Levain",
            description: "Slow-fermented levain folded with roasted garlic, rosemary, and thyme from our rooftop planters.",
            price: 11.0,
            icon: "icon-loaf.svg",
            tags: ["contains wheat", "vegan"],
          },
          {
            id: "seeded-multigrain",
            name: "Seeded Multigrain Boule",
            description: "A hearty blend of whole wheat, oats, flax, and sunflower seed, soaked overnight for a moist crumb.",
            price: 10.0,
            icon: "icon-loaf.svg",
            tags: ["contains wheat", "contains seeds", "vegan"],
          },
          {
            id: "daily-baguette",
            name: "Daily Baguette",
            description: "Classic lean-dough baguette, baked fresh in three rounds each morning until it's gone.",
            price: 5.0,
            icon: "icon-baguette.svg",
            tags: ["contains wheat", "vegan"],
          },
        ],
      },
      {
        id: "pastries",
        name: "Viennoiserie & Pastries",
        description: "Laminated by hand in-house, baked fresh from 7 AM.",
        items: [
          {
            id: "butter-croissant",
            name: "Butter Croissant",
            description: "36 layers of European-style cultured butter, proofed slow and baked to a deep amber.",
            price: 4.5,
            icon: "icon-croissant.svg",
            tags: ["contains wheat", "contains dairy"],
          },
          {
            id: "almond-croissant",
            name: "Almond Croissant",
            description: "Day-two croissant soaked in orange-blossom syrup, filled and topped with almond cream.",
            price: 5.5,
            icon: "icon-croissant.svg",
            tags: ["contains wheat", "contains dairy", "contains tree nuts"],
          },
          {
            id: "pain-au-chocolat",
            name: "Pain au Chocolat",
            description: "Dark chocolate batons rolled into our laminated dough.",
            price: 5.0,
            icon: "icon-croissant.svg",
            tags: ["contains wheat", "contains dairy"],
          },
          {
            id: "kouign-amann",
            name: "Kouign-Amann",
            description: "Caramelized layers of butter and sugar, crisp at the edges and soft in the center.",
            price: 6.0,
            icon: "icon-bun.svg",
            tags: ["contains wheat", "contains dairy"],
            featured: true,
          },
          {
            id: "morning-bun",
            name: "Morning Bun",
            description: "Orange-zest croissant dough rolled with cinnamon sugar, baked in a muffin tin until sticky-edged.",
            price: 4.75,
            icon: "icon-bun.svg",
            tags: ["contains wheat", "contains dairy"],
          },
          {
            id: "cardamom-sticky-bun",
            name: "Cardamom Sticky Bun",
            description: "Brioche swirled with cardamom sugar, finished in brown-butter caramel and toasted pecans.",
            price: 5.25,
            icon: "icon-bun.svg",
            tags: ["contains wheat", "contains dairy", "contains tree nuts"],
          },
        ],
      },
      {
        id: "cakes",
        name: "Everyday Cakes",
        description: "Baked daily by the slice, or order a whole cake with 48 hours' notice. Looking for a birthday or wedding cake? See Custom Cakes below.",
        items: [
          {
            id: "vanilla-bean-cake",
            name: "Classic Vanilla Bean Layer Cake",
            description: "Malted vanilla sponge, Tahitian vanilla bean buttercream.",
            price: 6.5,
            icon: "icon-cake-slice.svg",
            tags: ["contains wheat", "contains dairy", "contains eggs"],
            sizes: [
              { label: "Slice", price: 6.5 },
              { label: "Whole 8\"", price: 42 },
            ],
          },
          {
            id: "chocolate-stout-cake",
            name: "Chocolate Fudge Stout Cake",
            description: "Dark chocolate stout cake with a whipped dark-chocolate ganache.",
            price: 7.0,
            icon: "icon-cake-slice.svg",
            tags: ["contains wheat", "contains dairy", "contains eggs"],
            featured: true,
            sizes: [
              { label: "Slice", price: 7.0 },
              { label: "Whole 8\"", price: 46 },
            ],
          },
          {
            id: "lemon-olive-oil-cake",
            name: "Lemon Olive Oil Cake",
            description: "Extra-virgin olive oil cake, lemon curd filling, mascarpone frosting.",
            price: 6.0,
            icon: "icon-cake-slice.svg",
            tags: ["contains wheat", "contains dairy", "contains eggs"],
            sizes: [
              { label: "Slice", price: 6.0 },
              { label: "Whole 8\"", price: 38 },
            ],
          },
          {
            id: "carrot-cake",
            name: "Carrot Cake with Brown Butter Frosting",
            description: "Spiced carrot cake, toasted walnuts, brown-butter cream cheese frosting.",
            price: 6.5,
            icon: "icon-cake-slice.svg",
            tags: ["contains wheat", "contains dairy", "contains eggs", "contains tree nuts"],
            sizes: [
              { label: "Slice", price: 6.5 },
              { label: "Whole 8\"", price: 42 },
            ],
          },
        ],
      },
    ],

    /* -----------------------------------------------------------------
       CUSTOM CAKES — configuration for the custom cake request form.
       This is a quote-request flow, not an add-to-cart flow, since
       final pricing depends on design complexity and is confirmed by
       the team after review.
       ------------------------------------------------------------- */
    customCake: {
      intro: "Tell us about the cake you're picturing and we'll follow up within two business days with a quote and available dates. We recommend booking at least 2 weeks ahead for birthday/celebration cakes and 6–8 weeks ahead for wedding cakes.",
      sizes: [
        "6\" round (serves 8–10)",
        "8\" round (serves 14–18)",
        "10\" round (serves 24–30)",
        "Two-tier (serves 30–40)",
        "Three-tier (serves 50–70)",
      ],
      flavors: [
        "Vanilla Bean",
        "Chocolate Fudge",
        "Lemon Olive Oil",
        "Carrot",
        "Red Velvet",
        "Funfetti",
        "Other / ask me about a custom flavor",
      ],
      fillings: [
        "Vanilla Buttercream",
        "Dark Chocolate Ganache",
        "Seasonal Fruit Compote",
        "Lemon Curd",
        "Cream Cheese",
      ],
      occasions: ["Birthday", "Wedding", "Anniversary", "Baby Shower", "Corporate Event", "Other"],
    },
  },

  /* -----------------------------------------------------------------------
     PAYMENTS — Stripe Checkout configuration.
     -------------------------------------------------------------------
     STRIPE INTEGRATION MODEL (read before wiring up a real client):

     This site never handles card details directly and never touches a
     Stripe secret key in the browser. The publishable key below is safe
     to expose client-side by design.

     Checkout flow:
       1. Customer builds a cart in the browser (js/cart.js).
       2. On "Checkout", js/checkout.js POSTs the cart contents to
          `checkoutSessionEndpoint` (a serverless/backend endpoint you
          control — NOT a Stripe URL).
       3. That backend endpoint creates a Stripe Checkout Session using
          the Stripe SECRET key (which lives ONLY in server-side
          environment variables, never in this repo) and re-validates
          each line item's price against this same menu config server
          -side, rather than trusting prices sent from the browser.
       4. The backend returns the Checkout Session `id` (or `url`).
       5. The browser redirects to Stripe-hosted Checkout using that
          session — this is where the customer actually enters card
          details, on Stripe's domain, under Stripe's PCI compliance.

     See /server/create-checkout-session.example.js for a fully
     annotated reference implementation of step 3 (Node/serverless
     style — adapt to whatever backend runtime the client hosts on:
     Vercel/Netlify Functions, AWS Lambda, a small Express app, etc.).
     That file is illustrative only and is not invoked by this site.

     Until a real `checkoutSessionEndpoint` is deployed, js/checkout.js
     detects the placeholder value below and shows an inline notice
     instead of attempting a real redirect, so the demo site doesn't
     silently fail.

     To re-point this whole site at a different client's Stripe
     account: change `publishableKey`, `checkoutSessionEndpoint`, and
     (if using Stripe Connect) `connectedAccountId` below. Nothing else
     in the codebase references Stripe credentials directly.
     --------------------------------------------------------------- */
  stripe: {
    // Safe to expose client-side. Replace with the client's real
    // publishable key (starts with "pk_live_" or "pk_test_").
    publishableKey: "pk_test_PLACEHOLDER_REPLACE_WITH_CLIENT_KEY",

    // Only needed if the client's payments flow through Stripe Connect
    // (e.g. a marketplace/platform setup). Leave null for a standard
    // single-account Stripe integration.
    connectedAccountId: null,

    // Your backend/serverless endpoint that creates a Checkout Session.
    // MUST be replaced with a real, deployed endpoint before this site
    // can process real payments. See server/create-checkout-session.example.js.
    checkoutSessionEndpoint: "/api/create-checkout-session",

    currency: "usd",
    successUrl: "/menu.html?checkout=success",
    cancelUrl: "/menu.html?checkout=cancelled",
  },

  /* -----------------------------------------------------------------------
     FORMS — where Contact / Feedback / Custom Cake submissions go.
     -------------------------------------------------------------------
     Each endpoint should point to a form backend (e.g. Formspree,
     Netlify Forms, a custom serverless mailer) that emails the bakery.
     Until a real endpoint is configured (the placeholder values below),
     js/forms.js falls back to storing the submission in the browser's
     localStorage (namespaced under "emberoak_submissions") and still
     shows the user a success confirmation, so the template is fully
     testable with no backend deployed. Replace each endpoint with a
     real URL to enable actual email delivery.
     --------------------------------------------------------------- */
  forms: {
    contactEndpoint: "https://formspree.io/f/REPLACE_WITH_CONTACT_FORM_ID",
    feedbackEndpoint: "https://formspree.io/f/REPLACE_WITH_FEEDBACK_FORM_ID",
    customCakeEndpoint: "https://formspree.io/f/REPLACE_WITH_CUSTOM_CAKE_FORM_ID",
    recipientDisplay: "hello@emberandoak.example",
  },

  /* -----------------------------------------------------------------------
     ORDERING / DELIVERY POLICY (surfaced on FAQ + Menu pages)
     --------------------------------------------------------------------- */
  policy: {
    pickupOnly: true,
    deliveryMinimum: 75,
    deliveryRadiusMiles: 10,
    deliveryFee: 15,
    customCakeDepositPercent: 50,
    customCakeBalanceDueDays: 3,
  },
};
