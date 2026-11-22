/* EMS Agency — live destination image and label management via Wix CMS. */
(async function () {
  'use strict';
  try {
    const [{ queryItems }, { imgSrc }] = await Promise.all([import('/js/wix/items.js'), import('/js/wix/media.js')]);
    const response = await queryItems('EMSDestinations', { limit: 20 });
    if (!response || !Array.isArray(response.items)) throw Error('Destination content unavailable');
    const allowed = new Set(['static.wixstatic.com', 'images.wixstatic.com']);
    for (const item of response.items) {
      const slug = String(item.slug || '');
      if (!['Tanger', 'Tetouan', 'Martil', 'Mdiq', 'Fnideq'].includes(slug)) continue;
      const card = Array.from(document.querySelectorAll('.destination-card')).find(el => {
        try { return new URL(el.href, location.href).searchParams.get('ville') === slug; } catch { return false; }
      });
      if (!card) continue;
      if (item.photo) {
        try {
          const address = new URL(imgSrc(item.photo, 1400, 1100));
          if (address.protocol === 'https:' && allowed.has(address.hostname)) {
            card.style.setProperty('--bg', 'url("' + address.href.replace(/["\\()]/g, '') + '")');
          }
        } catch (_) { /* original static city photo remains as fallback */ }
      }
      if (typeof item.subtitle === 'string') {
        const subtitle = card.querySelector('.destination-meta');
        if (subtitle) subtitle.textContent = item.subtitle.slice(0, 90);
      }
      if (typeof item.title === 'string') {
        const title = card.querySelector('strong');
        if (title) title.textContent = item.title.slice(0, 65);
      }
    }
  } catch (error) {
    console.warn('Destination images: default visuals retained.', error);
  }
})();