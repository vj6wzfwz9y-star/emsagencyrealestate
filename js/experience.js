/* EMS Agency — intro, architectural transitions & understated cursor movement. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const qs = (selector, parent = document) => parent.querySelector(selector);
  const body = document.body;
  const loader = qs('.site-loader');
  const isHome = body.dataset.page === 'home';
  let introTimer = null;
  let finishing = false;

  function entrance(){body.classList.add('entrance-complete');}
  function finishIntro(){
    if (finishing || !loader) return;
    finishing = true;
    if (introTimer) clearTimeout(introTimer);
    const counter = qs('.intro-counter',loader);
    const bar = qs('.intro-meter-bar',loader);
    if (counter) counter.textContent = '100';
    if (bar) bar.style.width = '100%';
    loader.classList.add('is-exiting');
    document.documentElement.classList.remove('intro-lock');
    window.setTimeout(entrance,reduce?0:260);
    window.setTimeout(() => {
      loader.classList.add('is-gone');
      loader.setAttribute('aria-hidden','true');
    },reduce?180:1170);
    try{sessionStorage.setItem('ems-intro-seen','1');}catch(_){}
  }

  function initIntro(){
    if (!isHome) {entrance();return;}
    if (!loader){entrance();return;}
    let hasSeen = false;
    try{hasSeen=sessionStorage.getItem('ems-intro-seen')==='1';}catch(_){}
    if (reduce || hasSeen){
      loader.classList.add('is-gone');
      loader.setAttribute('aria-hidden','true');
      entrance();
      return;
    }
    document.documentElement.classList.add('intro-lock');
    const skip = qs('.intro-skip',loader);
    skip?.addEventListener('click',finishIntro,{once:true});
    const counter = qs('.intro-counter',loader);
    const bar = qs('.intro-meter-bar',loader);
    const duration = 2400;
    const start = performance.now();
    const tick = now => {
      if (finishing)return;
      const progress = Math.min((now-start)/duration,1);
      // Ease-out progress for a polished deliberate reveal.
      const eased = 1-Math.pow(1-progress,1.8);
      if(counter)counter.textContent=String(Math.min(99,Math.floor(eased*100))).padStart(2,'0');
      if(bar)bar.style.width = (eased*100).toFixed(1)+'%';
      if(progress<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    introTimer = setTimeout(finishIntro,duration);
  }

  function initWipe(){
    const wipe=document.createElement('div');wipe.className='page-wipe';wipe.setAttribute('aria-hidden','true');document.body.appendChild(wipe);
    document.addEventListener('click',event=>{
      if(reduce || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)return;
      const link=event.target.closest('a[href]');
      if(!link || link.hasAttribute('download') || link.target==='_blank')return;
      const destination=new URL(link.href,location.href);
      if(destination.protocol !== location.protocol || destination.host !== location.host)return;
      if(destination.pathname===location.pathname && destination.search===location.search && destination.hash)return;
      if(!destination.pathname.endsWith('.html') && !destination.pathname.endsWith('/'))return;
      event.preventDefault();
      wipe.classList.add('is-covering');
      setTimeout(()=>{location.href=destination.href;},520);
    });
  }

  function initCursor(){
    if(reduce || !matchMedia('(hover: hover) and (pointer: fine)').matches)return;
    const circle=document.createElement('div');circle.className='ems-cursor';circle.setAttribute('aria-hidden','true');body.appendChild(circle);
    let px=-90,py=-90,cx=-90,cy=-90,active=false;
    window.addEventListener('pointermove',event=>{
      if(event.pointerType==='touch')return;
      px=event.clientX;py=event.clientY;
      if(!active){circle.classList.add('is-visible');active=true;}
      circle.classList.toggle('is-hovering',Boolean(event.target.closest('a,button,.property-card,.destination-card')));
    },{passive:true});
    document.addEventListener('pointerleave',()=>{circle.classList.remove('is-visible');active=false;});
    const render=()=>{cx+=(px-cx)*.16;cy+=(py-cy)*.16;circle.style.left=cx+'px';circle.style.top=cy+'px';requestAnimationFrame(render);};
    render();
  }

  function initScrollStagger(){
    if(reduce || !('IntersectionObserver' in window))return;
    const eligible=[...document.querySelectorAll('.property-card,.agency-principles>div,.contact-info-row')];
    const observer=new IntersectionObserver(entries=>{
      for(const e of entries)if(e.isIntersecting){e.target.classList.add('ems-appeared');observer.unobserve(e.target);}
    },{threshold:.06,rootMargin:'0px 0px 20px 0px'});
    eligible.forEach((element,index)=>{
      // Cards generated dynamically are already visible; only add a restrained transition.
      element.classList.add('ems-stagger');
      element.style.setProperty('--ems-index', String(index%4));
      observer.observe(element);
    });
  }

  function init(){initIntro();initWipe();initCursor();initScrollStagger();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
