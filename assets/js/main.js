// ============================================================
// LATIN FIXIN'S — MAIN JS v3
// ============================================================
(function () {
  'use strict';

  // ── Mobile nav ───────────────────────────────────────────
  const toggle     = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('nav-mobile-menu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // ── Cookie consent ──────────────────────────────────────
  const COOKIE_KEY = 'lf_cookie_consent';
  const banner     = document.getElementById('cookie-banner');

  function hasCookieConsent() {
    try { return !!localStorage.getItem(COOKIE_KEY); } catch { return false; }
  }
  function setCookieConsent(val) {
    try { localStorage.setItem(COOKIE_KEY, val); } catch {}
  }

  if (banner && !hasCookieConsent()) {
    banner.classList.add('visible');
    const acceptBtn  = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        setCookieConsent('accepted');
        banner.classList.remove('visible');
        // Fire any deferred analytics here
      });
    }
    if (declineBtn) {
      declineBtn.addEventListener('click', () => {
        setCookieConsent('declined');
        banner.classList.remove('visible');
      });
    }
  }

  // ── Contact forms ────────────────────────────────────────
  document.querySelectorAll('.lf-contact-form').forEach((form) => {
    const successEl = form.querySelector('.form-msg.success');
    const errorEl   = form.querySelector('.form-msg.error');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (successEl) successEl.style.display = 'none';
      if (errorEl)   errorEl.style.display   = 'none';

      const name    = form.querySelector('[name="name"]');
      const email   = form.querySelector('[name="email"]');
      const message = form.querySelector('[name="message"]');
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name?.value.trim() || !email?.value.trim() || !message?.value.trim()) {
        if (errorEl) { errorEl.textContent = 'Please fill in all required fields.'; errorEl.style.display = 'block'; }
        return;
      }
      if (!emailRe.test(email.value)) {
        if (errorEl) { errorEl.textContent = 'Please enter a valid email address.'; errorEl.style.display = 'block'; }
        return;
      }

      const btn = form.querySelector('.form-submit-btn');
      if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

      // TODO: replace setTimeout with Formspree/EmailJS fetch call
      setTimeout(() => {
        form.reset();
        if (btn) { btn.textContent = 'Send'; btn.disabled = false; }
        if (successEl) { successEl.style.display = 'block'; }
      }, 900);
    });
  });

  // ── ADA / Accessibility widget (UserWay) ─────────────────
  // NOTE: 'REPLACE_WITH_USERWAY_ACCOUNT_ID' must be swapped for the
  // client's real account ID from userway.org before this activates.
  // Left as a guarded no-op until then so it never throws in console.
  (function(d) {
    var ACCOUNT_ID = 'REPLACE_WITH_USERWAY_ACCOUNT_ID';
    if (!ACCOUNT_ID || ACCOUNT_ID.indexOf('REPLACE_WITH') === 0) {
      console.info('[Latin Fixins] UserWay accessibility widget not yet configured — set ACCOUNT_ID in main.js');
      return;
    }
    var s = d.createElement('script');
    s.setAttribute('data-account', ACCOUNT_ID);
    s.setAttribute('src', 'https://cdn.userway.org/widget.js');
    s.setAttribute('async', true);
    (d.body || d.head).appendChild(s);
  })(document);

})();
