/* EMS Agency – permanent, accessible light/dark appearance selection. */
(function () {
  'use strict';
  const key = 'ems_site_appearance_v1';
  const root = document.documentElement;
  const cssMode = () => root.getAttribute('data-ems-theme') === 'light' ? 'light' : 'dark';
  const target = mode => mode === 'light' ? 'light' : 'dark';
  const setTheme = (value, remember) => {
    const mode = target(value);
    root.setAttribute('data-ems-theme', mode);
    root.style.colorScheme = mode;
    if (remember) {
      try { localStorage.setItem(key, mode); } catch (_) { /* not available in private mode */ }
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#191610' : '#f7f3ed');
    document.querySelectorAll('[data-ems-theme-set]').forEach(button => {
      const active = button.getAttribute('data-ems-theme-set') === mode;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-active', active);
    });
    document.querySelectorAll('img[data-ems-theme-footer]').forEach(img => {
      const wanted = mode === 'light'
        ? 'assets/brand/ems-wordmark-charcoal.png'
        : 'assets/brand/ems-wordmark-white.png';
      if (img.getAttribute('src') !== wanted) img.setAttribute('src', wanted);
    });
    document.querySelectorAll('img[data-ems-theme-admin-logo]').forEach(img => {
      const wanted = mode === 'dark'
        ? 'assets/brand/ems-wordmark-white.png'
        : 'assets/brand/ems-wordmark-charcoal.png';
      if (img.getAttribute('src') !== wanted) img.setAttribute('src', wanted);
    });
  };
  const initialize = () => {
    setTheme(cssMode(), false);
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-ems-theme-set]');
      if (!button) return;
      setTheme(button.getAttribute('data-ems-theme-set'), true);
    });
    window.addEventListener('storage', event => {
      if (event.key === key && (event.newValue === 'dark' || event.newValue === 'light')) {
        setTheme(event.newValue, false);
      }
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
