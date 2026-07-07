// ============================================================
// LATIN FIXIN'S — ACCESSIBILITY WIDGET (first-party, no deps)
// A floating toolbar that lets visitors adjust the page for
// their needs: text size, contrast, grayscale, link highlight,
// readable font, text spacing, paused motion, big cursor, and
// a reading guide. All choices persist in localStorage.
// ============================================================
(function () {
  'use strict';

  var STORE_KEY = 'lf_a11y';
  var html = document.documentElement;

  // Toggle options rendered in the panel grid: key + label + icon.
  var OPTIONS = [
    { key: 'contrast',       label: 'High Contrast',  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v18" fill="currentColor"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>' },
    { key: 'grayscale',      label: 'Grayscale',      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="12" r="7"/><circle cx="15" cy="12" r="7"/></svg>' },
    { key: 'highlightLinks', label: 'Highlight Links',icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>' },
    { key: 'readableFont',   label: 'Readable Font',  icon: '<svg viewBox="0 0 24 24" fill="currentColor"><text x="2" y="19" font-family="Arial" font-size="20" font-weight="700">A</text><text x="13" y="19" font-family="Arial" font-size="14">a</text></svg>' },
    { key: 'spacing',        label: 'Text Spacing',   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/><path d="M6 3L3 6l3 3M18 3l3 3-3 3" stroke-width="1.5"/></svg>' },
    { key: 'pauseAnim',      label: 'Pause Motion',   icon: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>' },
    { key: 'bigCursor',      label: 'Big Cursor',     icon: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="#fff" stroke-width="1"><path d="M4 2l16 8-6.5 1.5L11 19z"/></svg>' },
    { key: 'readingGuide',   label: 'Reading Guide',  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h18M3 16h18"/><rect x="3" y="11" width="18" height="2" fill="currentColor" stroke="none"/></svg>' },
  ];

  var ACCESS_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="4" r="2" fill="currentColor" stroke="none"/><path d="M4 8h16"/><path d="M12 8v6"/><path d="M9 20l3-6 3 6"/></svg>';

  var FONT_STEPS = [100, 112, 125, 140, 160];

  var defaults = {
    fontPct: 100, contrast: false, grayscale: false, highlightLinks: false,
    readableFont: false, spacing: false, pauseAnim: false, bigCursor: false,
    readingGuide: false,
  };

  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      return Object.assign({}, defaults, saved);
    } catch (e) { return Object.assign({}, defaults); }
  }
  function save(state) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  var state = load();

  // ── Build DOM ────────────────────────────────────────────
  var fab = document.createElement('button');
  fab.className = 'a11y-fab';
  fab.id = 'a11y-fab';
  fab.setAttribute('aria-label', 'Accessibility menu');
  fab.setAttribute('aria-expanded', 'false');
  fab.setAttribute('aria-controls', 'a11y-panel');
  fab.innerHTML = ACCESS_ICON;

  var panel = document.createElement('div');
  panel.className = 'a11y-panel';
  panel.id = 'a11y-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-label', 'Accessibility settings');

  var optButtons = OPTIONS.map(function (o) {
    return '<button class="a11y-opt" type="button" data-key="' + o.key + '" aria-pressed="false">'
      + o.icon + '<span>' + o.label + '</span></button>';
  }).join('');

  panel.innerHTML =
    '<div class="a11y-panel-head">'
    + '<h2>Accessibility</h2>'
    + '<button class="a11y-close" type="button" aria-label="Close accessibility menu">&times;</button>'
    + '</div>'
    + '<div class="a11y-panel-body">'
    + '<div class="a11y-fontsize">'
    + '<span class="lbl">Text Size</span>'
    + '<button class="a11y-step" type="button" data-font="down" aria-label="Decrease text size">A&minus;</button>'
    + '<span class="a11y-pct" id="a11y-pct">100%</span>'
    + '<button class="a11y-step" type="button" data-font="up" aria-label="Increase text size">A+</button>'
    + '</div>'
    + '<div class="a11y-grid">' + optButtons + '</div>'
    + '<button class="a11y-reset" type="button">Reset All</button>'
    + '</div>'
    + '<div class="a11y-panel-foot">Your settings are saved on this device.</div>';

  var guide = document.createElement('div');
  guide.className = 'a11y-guide';
  guide.setAttribute('aria-hidden', 'true');

  document.body.appendChild(fab);
  document.body.appendChild(panel);
  document.body.appendChild(guide);

  var pctEl = panel.querySelector('#a11y-pct');

  // ── Reading guide follows the pointer ────────────────────
  function onMove(e) { guide.style.top = (e.clientY - 22) + 'px'; }

  // ── Apply state to the page ──────────────────────────────
  function apply() {
    // Text size
    html.style.fontSize = state.fontPct + '%';
    if (pctEl) pctEl.textContent = state.fontPct + '%';

    // Composited filters (contrast + grayscale)
    var filters = [];
    if (state.contrast)  filters.push('contrast(1.4)');
    if (state.grayscale) filters.push('grayscale(1)');
    html.style.filter = filters.join(' ');

    // Body state classes
    document.body.classList.toggle('a11y-highlight-links', state.highlightLinks);
    document.body.classList.toggle('a11y-readable-font', state.readableFont);
    document.body.classList.toggle('a11y-spacing', state.spacing);
    document.body.classList.toggle('a11y-pause-anim', state.pauseAnim);
    document.body.classList.toggle('a11y-big-cursor', state.bigCursor);
    document.body.classList.toggle('a11y-reading-guide', state.readingGuide);

    // Reading guide listener
    if (state.readingGuide) document.addEventListener('mousemove', onMove);
    else document.removeEventListener('mousemove', onMove);

    // Pause / resume the hero video with motion setting
    var video = document.getElementById('hero-video');
    if (video) {
      if (state.pauseAnim) { try { video.pause(); } catch (e) {} }
      else if (video.src) { video.play().catch(function () {}); }
    }

    // Reflect pressed state on option buttons
    OPTIONS.forEach(function (o) {
      var btn = panel.querySelector('[data-key="' + o.key + '"]');
      if (btn) btn.setAttribute('aria-pressed', state[o.key] ? 'true' : 'false');
    });

    save(state);
  }

  // ── Panel open / close with focus handling ───────────────
  function openPanel() {
    panel.classList.add('open');
    fab.setAttribute('aria-expanded', 'true');
    var first = panel.querySelector('button');
    if (first) first.focus();
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onOutside, true);
  }
  function closePanel() {
    panel.classList.remove('open');
    fab.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('click', onOutside, true);
    fab.focus();
  }
  function togglePanel() {
    if (panel.classList.contains('open')) closePanel(); else openPanel();
  }
  function onOutside(e) {
    if (!panel.contains(e.target) && e.target !== fab && !fab.contains(e.target)) closePanel();
  }
  function onKeydown(e) {
    if (e.key === 'Escape') { closePanel(); return; }
    if (e.key !== 'Tab') return;
    // Simple focus trap within the panel
    var focusables = panel.querySelectorAll('button');
    if (!focusables.length) return;
    var firstEl = focusables[0];
    var lastEl = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
    else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
  }

  // ── Wire events ──────────────────────────────────────────
  fab.addEventListener('click', togglePanel);
  panel.querySelector('.a11y-close').addEventListener('click', closePanel);

  panel.querySelectorAll('.a11y-opt').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-key');
      state[key] = !state[key];
      apply();
    });
  });

  panel.querySelectorAll('.a11y-step').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dir = btn.getAttribute('data-font');
      var idx = FONT_STEPS.indexOf(state.fontPct);
      if (idx === -1) idx = 0;
      idx = dir === 'up' ? Math.min(idx + 1, FONT_STEPS.length - 1) : Math.max(idx - 1, 0);
      state.fontPct = FONT_STEPS[idx];
      apply();
    });
  });

  panel.querySelector('.a11y-reset').addEventListener('click', function () {
    state = Object.assign({}, defaults);
    apply();
  });

  // ── Stay clear of the cookie-consent bar ─────────────────
  // While the cookie banner is visible, lift the button (and its
  // panel) above it; once dismissed, drop back to the corner.
  var cookieBanner = document.getElementById('cookie-banner');
  function clearCookieBar() {
    if (cookieBanner && cookieBanner.classList.contains('visible')) {
      var lift = cookieBanner.offsetHeight + 16;
      fab.style.bottom = lift + 'px';
      panel.style.bottom = (lift + 66) + 'px';
    } else {
      fab.style.bottom = '';
      panel.style.bottom = '';
    }
  }
  if (cookieBanner) {
    clearCookieBar();
    new MutationObserver(clearCookieBar).observe(cookieBanner, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('resize', clearCookieBar);
  }

  // Apply any persisted settings on load
  apply();
})();
