/* EMS Agency: section-aware header colors.
   The header samples the actual section passing underneath it, never a global scroll threshold. */
(function(){
  'use strict';
  function init(){
    const header=document.getElementById('global-header');
    const main=document.querySelector('main');
    if(!header||!main)return;
    const lightClasses=[
      'ems-signature-new','destinations-section','collection-section',
      'dest-editorial','about-section','contact-form-section','detail-page'
    ];
    const sections=[...main.querySelectorAll('section'),...document.querySelectorAll('footer.global-footer')];
    const lightSelector=lightClasses.map(s=>'.'+s).join(',');
    let pending=false;
    function update(){
      pending=false;
      const y=Math.min(Math.round(header.getBoundingClientRect().height*.54),window.innerHeight-1);
      let section=null;
      for(const item of sections){
        const rect=item.getBoundingClientRect();
        if(rect.top<=y&&rect.bottom>y){
          section=item;
          break;
        }
      }
      // Explicit color themes keep text readable on sections with photos or gradients.
      // The hero, listings dark panel, large photo feature and footer are dark by default.
      const light=!!(section&&section.matches(lightSelector));
      header.classList.toggle('nav-on-light',light);
      header.classList.toggle('nav-on-dark',!light);
    }
    function schedule(){
      if(!pending){pending=true;requestAnimationFrame(update);}
    }
    update();
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule,{passive:true});
    window.addEventListener('pageshow',schedule);
    document.fonts?.ready?.then(schedule).catch(()=>{});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();