/* EMS Agency — interactive editorial approach. Native <details> handles accessibility. */
(function () {
  'use strict';
  const group = document.querySelectorAll('.ems-process-new .process-principle');
  const image = document.querySelector('.ems-process-new [data-process-image]');
  const index = document.querySelector('.ems-process-new [data-process-index]');
  if (!group.length || !image || !index) return;
  let loadSequence = 0;
  for (const item of group) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      for (const other of group) if (other !== item && other.open) other.open = false;
      const url = item.getAttribute('data-photo');
      const number = item.getAttribute('data-index') || '01';
      if (!url) return;
      index.textContent = number + ' / 03';
      const current = ++loadSequence;
      const preload = new Image();
      preload.onload = function () {
        if (current !== loadSequence || !item.open) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduced) image.style.opacity = '.2';
        image.src = url;
        image.alt = 'Un lieu singulier sélectionné dans le Nord du Maroc';
        requestAnimationFrame(function () {
          if (current === loadSequence) image.style.opacity = '1';
        });
      };
      preload.onerror = function () { /* Keep last available photograph. */ };
      preload.src = url;
    });
  }
})();