/**
 * EDITZAAR — Universal Theme Controller (v4.0)
 * GUARANTEED LIGHT MODE FIX:
 * - Injects a dynamic <style> tag as the LAST stylesheet (highest cascade priority)
 * - Also applies inline styles directly via JS for 100% guarantee
 * - MutationObserver watches typing animation to keep it dark
 */

(function () {

  var LIGHT_BLACK = '#111116';
  var LIGHT_GOLD  = '#b88200';
  var STYLE_ID    = 'ez-light-mode-override';

  // ── CSS rules injected dynamically (beat everything because they come last) ──
  var LIGHT_CSS = [
    /* Universal text: everything becomes dark */
    'html[data-theme="light"] body { color: ' + LIGHT_BLACK + ' !important; }',
    'html[data-theme="light"] h1, html[data-theme="light"] h1 * { color: ' + LIGHT_BLACK + ' !important; }',
    'html[data-theme="light"] h2, html[data-theme="light"] h2 * { color: ' + LIGHT_BLACK + ' !important; }',
    'html[data-theme="light"] h3, html[data-theme="light"] h3 * { color: ' + LIGHT_BLACK + ' !important; }',
    'html[data-theme="light"] h4, html[data-theme="light"] h4 * { color: ' + LIGHT_BLACK + ' !important; }',
    'html[data-theme="light"] h5, html[data-theme="light"] h5 * { color: ' + LIGHT_BLACK + ' !important; }',
    'html[data-theme="light"] h6, html[data-theme="light"] h6 * { color: ' + LIGHT_BLACK + ' !important; }',
    'html[data-theme="light"] p { color: ' + LIGHT_BLACK + ' !important; }',
    'html[data-theme="light"] span { color: ' + LIGHT_BLACK + ' !important; }',
    'html[data-theme="light"] li { color: ' + LIGHT_BLACK + ' !important; }',
    'html[data-theme="light"] td, html[data-theme="light"] th { color: ' + LIGHT_BLACK + ' !important; }',
    'html[data-theme="light"] label { color: ' + LIGHT_BLACK + ' !important; }',
    /* Hero headline & typing target */
    'html[data-theme="light"] .hv2-headline { color: ' + LIGHT_BLACK + ' !important; }',
    'html[data-theme="light"] .hv2-headline .typing-wrap { color: ' + LIGHT_BLACK + ' !important; }',
    'html[data-theme="light"] #typing-target { color: ' + LIGHT_BLACK + ' !important; }',
    'html[data-theme="light"] #typing-target * { color: ' + LIGHT_BLACK + ' !important; }',
    'html[data-theme="light"] .hv2-sub { color: rgba(17,17,22,0.72) !important; }',
    /* Gold exceptions — keep brand gold */
    'html[data-theme="light"] .hv2-headline .gold-italic { color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] em { color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] .gold-italic { color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] .hv2-eyebrow { color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] .hv2-stat-n { color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] .c-val { color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] .nav-logo em, html[data-theme="light"] .logo em { color: ' + LIGHT_GOLD + ' !important; }',
    /* White-on-dark exceptions: pricing banner, footer dark sections, video right panel */
    'html[data-theme="light"] .hv2-right *, html[data-theme="light"] .hv2-right { color: #fff !important; }',
    'html[data-theme="light"] .pricing-cta-banner, html[data-theme="light"] .pricing-cta-banner * { color: #fff !important; }',
    'html[data-theme="light"] footer, html[data-theme="light"] footer * { color: rgba(255,255,255,0.65) !important; }',
    'html[data-theme="light"] footer h3, html[data-theme="light"] footer .footer-logo { color: #fff !important; }',
    /* Buttons */
    'html[data-theme="light"] .btn-gold, html[data-theme="light"] .btn-gold * { color: #000 !important; }',
    /* Nav gold link */
    'html[data-theme="light"] .nav-cta { color: #000 !important; }',
    /* Cursor blink */
    'html[data-theme="light"] .cursor-blink { border-right-color: ' + LIGHT_BLACK + ' !important; color: transparent !important; }'
  ].join('\n');

  function injectLightStyleTag() {
    var existing = document.getElementById(STYLE_ID);
    if (!existing) {
      var style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = LIGHT_CSS;
      document.head.appendChild(style);
    }
  }

  function removeLightStyleTag() {
    var existing = document.getElementById(STYLE_ID);
    if (existing) existing.parentNode.removeChild(existing);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      injectLightStyleTag();
      // Also watch typing animation
      watchTypingTarget();
    } else {
      removeLightStyleTag();
    }
  }

  function watchTypingTarget() {
    var typingTarget = document.getElementById('typing-target');
    if (!typingTarget) return;
    var obs = new MutationObserver(function () {
      var theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'light') {
        typingTarget.style.color = LIGHT_BLACK;
        typingTarget.querySelectorAll('*').forEach(function (el) {
          // Skip cursor-blink (it should be transparent)
          if (!el.classList.contains('cursor-blink')) {
            el.style.color = LIGHT_BLACK;
          }
        });
      }
    });
    obs.observe(typingTarget, { childList: true, subtree: true, characterData: true });
  }

  // ── 1. Immediate Theme Application (Anti-flash) ──
  var saved = localStorage.getItem('editzaar_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  if (saved === 'light') {
    // Inject style tag immediately — even before body loads
    injectLightStyleTag();
  }

  // ── 2. After DOM loads: watch typing target ──
  document.addEventListener('DOMContentLoaded', function () {
    var theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light') {
      injectLightStyleTag(); // re-ensure it's there
      watchTypingTarget();
    }
  });

  // ── 3. Global Toggle Button Listener ──
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-toggle], .theme-toggle-btn, .dash-theme-toggle');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('editzaar_theme', next);
    applyTheme(next);
    console.log('[Editzaar Theme] Switched to:', next);
  });

})();
