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

  // ── Hero banner video ────────────────────────────────────
  // Deferred load: only fetch the 12MB reel when motion is OK.
  // The poster <img> underneath stays as the fallback on
  // reduced-motion, save-data, or if playback is blocked.
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo && heroVideo.dataset.src) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (!reducedMotion && !saveData) {
      heroVideo.src = heroVideo.dataset.src;
      heroVideo.play().catch(() => { heroVideo.removeAttribute('src'); });
    }
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

  // ── Contact forms → open the visitor's email client (mailto) ──
  // No backend: on submit we build a pre-filled email to
  // info@latinfixins.com and hand it to the visitor's mail app.
  // They review and press send. (Swap to Formspree/Pages Function
  // later if we want submissions to arrive without that step.)
  const LF_INBOX = 'info@latinfixins.com';
  document.querySelectorAll('.lf-contact-form').forEach((form) => {
    const successEl = form.querySelector('.form-msg.success');
    const errorEl   = form.querySelector('.form-msg.error');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (successEl) successEl.style.display = 'none';
      if (errorEl)   errorEl.style.display   = 'none';

      const name    = form.querySelector('[name="name"]');
      const phone   = form.querySelector('[name="phone"]');
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

      const subject = `Event Inquiry from ${name.value.trim()}`;
      const body = [
        `Name: ${name.value.trim()}`,
        phone?.value.trim() ? `Phone: ${phone.value.trim()}` : null,
        `Email: ${email.value.trim()}`,
        '',
        message.value.trim(),
      ].filter((line) => line !== null).join('\n');

      const mailto = `mailto:${LF_INBOX}`
        + `?subject=${encodeURIComponent(subject)}`
        + `&body=${encodeURIComponent(body)}`;

      // Opens the default mail app with everything pre-filled.
      window.location.href = mailto;

      if (successEl) {
        successEl.textContent = `✓ Opening your email app — just press send and your message is on its way. If nothing opened, email us directly at ${LF_INBOX}.`;
        successEl.style.display = 'block';
      }
    });
  });

  // ── ADA / Accessibility widget ───────────────────────────
  // Fully self-contained, first-party widget — see assets/js/a11y.js.
  // (Replaces the old UserWay placeholder; no third-party account needed.)

})();
