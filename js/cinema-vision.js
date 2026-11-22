(function(){
  'use strict';
  function init(){
    const section=document.querySelector('.ems-cinema-story');
    if(!section||!('IntersectionObserver' in window))return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    section.classList.add('cinema-ready');
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(entry.isIntersecting){
          section.classList.add('cinema-visible');
          observer.disconnect();
        }
      }
    },{threshold:.13});
    observer.observe(section);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();