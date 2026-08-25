/**
 * EDITZAAR — Universal Theme Controller (v5.0)
 * Deep Blue Text in Light Mode for Maximum Visibility & Elegance
 */

(function () {
  var LIGHT_BLUE = '#0A2540'; // Deep Luxury Navy/Royal Blue for high visibility
  var LIGHT_GOLD = '#b88200'; // Rich Brand Gold Accent
  var STYLE_ID   = 'ez-light-mode-override';

  var LIGHT_CSS = [
    'html[data-theme="light"] body { color: ' + LIGHT_BLUE + ' !important; }',
    /* Headlines → Golden in light mode */
    'html[data-theme="light"] h1, html[data-theme="light"] h1 * { color: ' + LIGHT_GOLD + ' !important; -webkit-text-fill-color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] h2, html[data-theme="light"] h2 * { color: ' + LIGHT_GOLD + ' !important; -webkit-text-fill-color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] h3, html[data-theme="light"] h3 * { color: ' + LIGHT_GOLD + ' !important; -webkit-text-fill-color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] h4, html[data-theme="light"] h4 * { color: ' + LIGHT_GOLD + ' !important; -webkit-text-fill-color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] h5, html[data-theme="light"] h5 * { color: ' + LIGHT_GOLD + ' !important; -webkit-text-fill-color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] h6, html[data-theme="light"] h6 * { color: ' + LIGHT_GOLD + ' !important; -webkit-text-fill-color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] .hv2-headline { color: ' + LIGHT_GOLD + ' !important; -webkit-text-fill-color: ' + LIGHT_GOLD + ' !important; background: none !important; }',
    'html[data-theme="light"] .hv2-headline * { color: ' + LIGHT_GOLD + ' !important; -webkit-text-fill-color: ' + LIGHT_GOLD + ' !important; background: none !important; }',
    'html[data-theme="light"] .hv2-headline .typing-wrap { color: ' + LIGHT_GOLD + ' !important; -webkit-text-fill-color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] #typing-target { color: ' + LIGHT_GOLD + ' !important; -webkit-text-fill-color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] #typing-target * { color: ' + LIGHT_GOLD + ' !important; -webkit-text-fill-color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] .hv2-sub { color: #2D3748 !important; }',
    'html[data-theme="light"] p { color: #2D3748 !important; }',
    /* Gold brand accents */
    'html[data-theme="light"] .hv2-headline .gold-italic { color: ' + LIGHT_GOLD + ' !important; -webkit-text-fill-color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] em { color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] .gold-italic { color: ' + LIGHT_GOLD + ' !important; -webkit-text-fill-color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] .hv2-eyebrow { color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] .hv2-stat-n { color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] .c-val { color: ' + LIGHT_GOLD + ' !important; }',
    'html[data-theme="light"] .nav-logo em, html[data-theme="light"] .logo em { color: ' + LIGHT_GOLD + ' !important; }',
    /* Cursor Blink */
    'html[data-theme="light"] .cursor-blink { border-right: 2px solid ' + LIGHT_GOLD + ' !important; color: transparent !important; }',
    /* Preserved Dark Sections */
    'html[data-theme="light"] .pricing-cta-banner, html[data-theme="light"] .pricing-cta-banner * { color: #fff !important; }',
    'html[data-theme="light"] .hv2-right *, html[data-theme="light"] .hv2-right { color: #fff !important; }',
    'html[data-theme="light"] footer, html[data-theme="light"] footer * { color: rgba(255,255,255,0.7) !important; }',
    'html[data-theme="light"] footer h3, html[data-theme="light"] footer .footer-logo { color: #fff !important; }',
    'html[data-theme="light"] .btn-gold, html[data-theme="light"] .btn-gold * { color: #000 !important; }'
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

  function watchTypingTarget() {
    var typingTarget = document.getElementById('typing-target');
    if (!typingTarget) return;
    var obs = new MutationObserver(function () {
      var theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'light') {
        typingTarget.style.color = LIGHT_BLUE;
        typingTarget.querySelectorAll('*').forEach(function (el) {
          if (!el.classList.contains('cursor-blink')) {
            el.style.color = LIGHT_BLUE;
          }
        });
      }
    });
    obs.observe(typingTarget, { childList: true, subtree: true, characterData: true });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      injectLightStyleTag();
      watchTypingTarget();
    } else {
      removeLightStyleTag();
    }
  }

  // 1. Immediate Theme Application
  var saved = localStorage.getItem('editzaar_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  if (saved === 'light') injectLightStyleTag();

  // 2. DOM Ready
  document.addEventListener('DOMContentLoaded', function () {
    var theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light') {
      injectLightStyleTag();
      watchTypingTarget();
    }
  });

  // 3. Global Toggle Listener
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
