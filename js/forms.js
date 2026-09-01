/* =========================================================================
   FORMS — shared validation + submission handling for Contact, Feedback,
   and the Custom Cake request form.

   Submission model: each form POSTs JSON to a config-driven endpoint
   (BAKERY_CONFIG.forms.*) intended to be a form backend that emails the
   bakery (Formspree, Netlify Forms, or a custom serverless mailer all
   work with this same POST-JSON pattern). Until a real endpoint is
   configured, submissions are stored in localStorage under
   "emberoak_submissions" so the form is fully testable without a
   backend, and the user still sees a normal success confirmation.
   ========================================================================= */

(function () {
  "use strict";

  const SUBMISSIONS_KEY = "emberoak_submissions";

  function isPlaceholderEndpoint(url) {
    return !url || url.includes("REPLACE_WITH");
  }

  function storeLocalSubmission(formName, payload) {
    let all = [];
    try {
      all = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY)) || [];
    } catch (e) {
      all = [];
    }
    all.push({ formName, payload, submittedAt: new Date().toISOString() });
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(all));
  }

  function validateField(field) {
    const wrapper = field.closest(".field");
    if (!wrapper) return true;
    let valid = field.checkValidity();

    // Custom rule: at least one checkbox in a required checkbox group
    if (field.type === "checkbox" && field.dataset.groupRequired) {
      const group = field.closest("form").querySelectorAll(`input[name="${field.name}"]`);
      valid = Array.from(group).some((c) => c.checked);
    }

    wrapper.classList.toggle("has-error", !valid);
    return valid;
  }

  function validateForm(form) {
    const fields = form.querySelectorAll("input, textarea, select");
    let allValid = true;
    fields.forEach((field) => {
      // Radio groups: the WHATWG "required" constraint is only meaningful
      // on the radio that actually carries the `required` attribute — every
      // other radio in the group is trivially valid and would otherwise
      // clobber the group's error state when validated in DOM order.
      if (field.type === "radio" && !field.required) return;

      if (field.type === "checkbox" && field.dataset.groupRequired) {
        if (field.dataset.groupValidated) return;
        field.dataset.groupValidated = "1";
      }
      if (!validateField(field)) allValid = false;
    });
    fields.forEach((f) => delete f.dataset.groupValidated);
    return allValid;
  }

  function collectPayload(form) {
    const data = new FormData(form);
    const payload = {};
    for (const [key, value] of data.entries()) {
      if (payload[key] !== undefined) {
        payload[key] = Array.isArray(payload[key]) ? [...payload[key], value] : [payload[key], value];
      } else {
        payload[key] = value;
      }
    }
    return payload;
  }

  async function submitPayload(endpoint, payload) {
    if (isPlaceholderEndpoint(endpoint)) {
      return { ok: true, local: true };
    }
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      return { ok: res.ok, local: false };
    } catch (e) {
      return { ok: false, local: false, error: e };
    }
  }

  /**
   * Wires a <form> up to validate on submit and show a success panel.
   * options: { endpoint, formName, statusEl, successEl }
   */
  function initForm(form, options) {
    if (!form) return;
    const statusEl = options.statusEl ? document.querySelector(options.statusEl) : null;
    const successEl = options.successEl ? document.querySelector(options.successEl) : null;

    form.setAttribute("novalidate", "novalidate");

    form.querySelectorAll("input, textarea, select").forEach((field) => {
      if (field.type === "radio" && !field.required) return;
      field.addEventListener("blur", () => validateField(field));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (statusEl) statusEl.classList.remove("is-visible");

      if (!validateForm(form)) {
        if (statusEl) {
          statusEl.textContent = "Please check the highlighted fields and try again.";
          statusEl.classList.add("is-visible", "form-status--error");
        }
        const firstError = form.querySelector(".has-error input, .has-error textarea, .has-error select");
        if (firstError) firstError.focus();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      const payload = collectPayload(form);
      const result = await submitPayload(options.endpoint, payload);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }

      if (result.ok) {
        storeLocalSubmission(options.formName, payload);
        form.hidden = true;
        if (successEl) successEl.classList.add("is-visible");
        if (typeof options.onSuccess === "function") options.onSuccess(payload);
      } else {
        if (statusEl) {
          statusEl.textContent =
            "We couldn't send that just now. Please try again, or reach us directly at " +
            window.BAKERY_CONFIG.business.email + ".";
          statusEl.classList.add("is-visible", "form-status--error");
        }
      }
    });
  }

  window.EmberForms = { initForm, validateField };
})();
