/* Seamless EMS marquee: keep each identical loop at least as wide as the viewport.
   The two copies are exact twins, so translateX(-50%) has no seam or blank tail. */
(function(){
  'use strict';
  function init(){
    const ribbon=document.querySelector('.ems-marquee-infinite');
    if(!ribbon)return;
    const track=ribbon.querySelector('.ems-marquee-track');
    const groups=Array.from(ribbon.querySelectorAll('.ems-marquee-copy'));
    if(!track||groups.length!==2)return;
    const seed=groups[0].querySelector('.ems-marquee-unit');
    if(!seed)return;
    const template=seed.cloneNode(true);
    let last=0;
    function render(){
      const unit=groups[0].querySelector('.ems-marquee-unit');
      const unitWidth=unit ? (unit.getBoundingClientRect().width || 640) : 640;
      const minimum=Math.max(ribbon.clientWidth*1.2,ribbon.clientWidth+unitWidth);
      const count=Math.min(100,Math.max(4,Math.ceil(minimum/unitWidth)+1));
      if(count===last)return;
      for(const group of groups){
        const fragment=document.createDocumentFragment();
        for(let i=0;i<count;i++)fragment.appendChild(template.cloneNode(true));
        group.replaceChildren(fragment);
      }
      last=count;
      const width=groups[0].getBoundingClientRect().width;
      track.style.setProperty('--ems-marquee-duration',(width/88).toFixed(2)+'s');
    }
    render();
    if(document.fonts&&document.fonts.ready){
      document.fonts.ready.then(function(){last=0;render()}).catch(function(){});
    }
    let pending=false;
    function onResize(){
      if(pending)return;
      pending=true;
      requestAnimationFrame(function(){pending=false;render()});
    }
    window.addEventListener('resize',onResize,{passive:true});
    if(typeof ResizeObserver!=='undefined'){
      const observer=new ResizeObserver(onResize);
      observer.observe(ribbon);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();