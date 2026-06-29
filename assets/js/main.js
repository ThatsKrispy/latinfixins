// ============================================================
// LATIN FIXIN'S — MAIN JS
// ============================================================
(function () {
  'use strict';

  // ── Mobile nav ───────────────────────────────────────────
  const toggle = document.getElementById('nav-toggle');
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
      if (e.key === 'Escape') {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Header scroll shadow ─────────────────────────────────
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 4
        ? '0 2px 12px rgba(0,0,0,0.12)'
        : '0 2px 8px rgba(0,0,0,0.07)';
    }, { passive: true });
  }

  // ── Contact form ─────────────────────────────────────────
  const forms = document.querySelectorAll('.lf-contact-form');
  forms.forEach((form) => {
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

      // TODO: replace with Formspree action or EmailJS
      setTimeout(() => {
        form.reset();
        if (btn) { btn.textContent = 'Send'; btn.disabled = false; }
        if (successEl) { successEl.style.display = 'block'; }
      }, 900);
    });
  });

})();
