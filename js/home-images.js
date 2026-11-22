/* EMS Agency — Wix CMS managed homepage photography.
   This script changes image URLs only, preserving the original slideshow CSS
   transitions, auto-advance and existing editorial layout. */
(async function () {
  'use strict';
  try {
    const [{ queryItems }, { imgSrc }] = await Promise.all([import('/js/wix/items.js'), import('/js/wix/media.js')]);
    const { items } = await queryItems('EMSHomeImages', { limit: 20 });
    if (!Array.isArray(items)) throw new Error('No CMS images');
    const trustedHosts = new Set(['static.wixstatic.com','images.wixstatic.com']);
    const background = (item) => {
      if (!item || !item.photo) return null;
      try {
        const url = new URL(imgSrc(item.photo, 2000, 1200));
        if (url.protocol !== 'https:' || !trustedHosts.has(url.hostname)) return null;
        return 'url("' + url.href.replace(/["\\()]/g,'') + '")';
      } catch (_) { return null; }
    };
    const keyed = new Map(items.map(item => [String(item.slot || ''), item]));
    const slides = document.querySelectorAll('.hero-slides .hero-slide');
    for (let i = 0; i < Math.min(3, slides.length); i++) {
      const photo = background(keyed.get('slide-' + (i+1)));
      if (photo) slides[i].style.setProperty('--photo', photo);
    }
    const feature = document.querySelector('.fullbleed-feature .fullbleed-image');
    const featurePhoto = background(keyed.get('feature'));
    if (feature && featurePhoto)
      feature.style.backgroundImage = featurePhoto + ",url('assets/images/architecture.svg')";
  } catch (error) {
    console.warn('EMS photos: les images par défaut restent affichées.', error);
  }
})();