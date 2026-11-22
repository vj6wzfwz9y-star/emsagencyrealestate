/* EMS Agency | Editorial mobile navigation (keeps native page links and i18n). */
(function(){
  'use strict';
  function boot(){
    const nav=document.getElementById('mobile-menu');
    const toggle=document.getElementById('menu-btn');
    if(!nav||!toggle||nav.classList.contains('ems-mobile-editorial'))return;

    nav.classList.add('ems-mobile-editorial');
    toggle.classList.add('ems-mobile-toggle');
    toggle.setAttribute('type','button');
    toggle.setAttribute('aria-controls','mobile-menu');

    const intro=document.createElement('div');
    intro.className='ems-menu-intro';
    intro.innerHTML=
      '<div class="ems-menu-masthead"><span>EMS / SIGNATURE COLLECTION</span><span>01 — 06</span></div>'+
      '<div class="ems-menu-heading"><em>Les lieux</em><strong>qui inspirent.</strong></div>'+
      '<div class="ems-menu-eyebrow"><span class="ems-menu-line"></span><span>✳</span></div>';

    const links=document.createElement('div');
    links.className='ems-menu-links';
    const originalLinks=Array.from(nav.querySelectorAll(':scope > a'));
    const currentPath=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    originalLinks.forEach(function(link,index){
      const label=Array.from(link.childNodes)
        .filter(function(node){return node.nodeType===3})
        .map(function(node){return node.nodeValue||''})
        .join(' ').trim()||link.textContent.replace('↗','').trim();
      Array.from(link.childNodes).filter(function(node){return node.nodeType===3}).forEach(function(node){node.remove()});
      const arrow=link.querySelector('span');
      if(arrow)arrow.className='ems-menu-arrow';
      const count=document.createElement('span');
      count.className='ems-menu-count';
      count.textContent=String(index+1).padStart(2,'0');
      count.setAttribute('aria-hidden','true');
      const title=document.createElement('span');
      title.className='ems-menu-title';
      title.textContent=label;
      link.insertBefore(title,arrow);
      link.insertBefore(count,title);
      link.classList.add('ems-menu-link');
      const path=(link.getAttribute('href')||'').split('?')[0].split('#')[0].toLowerCase();
      if(path===currentPath){
        link.classList.add('is-current');
        link.setAttribute('aria-current','page');
      }
      if(path==='admin.html')link.classList.add('ems-menu-private');
      links.appendChild(link);
    });

    const footer=document.createElement('div');
    footer.className='ems-menu-bottom';
    footer.innerHTML=
      '<span>EMS AGENCY <i>✳</i> REAL ESTATE</span>'+
      '<span class="ems-menu-region">MÉDITERRANÉE · MAROC</span>';
    nav.appendChild(intro);
    nav.appendChild(links);
    nav.appendChild(footer);

    function sync(){
      const open=toggle.getAttribute('aria-expanded')==='true';
      nav.classList.toggle('ems-menu-visible',open);
      toggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
    }
    const observer=new MutationObserver(sync);
    observer.observe(toggle,{attributes:true,attributeFilter:['aria-expanded']});
    sync();
    document.addEventListener('keydown',function(event){
      if(event.key==='Escape'&&nav.classList.contains('open')){
        event.preventDefault();
        toggle.click();
        toggle.focus();
      }
    });
    window.addEventListener('resize',function(){
      if(window.innerWidth>800&&nav.classList.contains('open'))toggle.click();
    },{passive:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();