/* EMS Agency — property lookbook carousel. Keeps the existing property lightbox. */
(function(){
  'use strict';
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  function start(root){
    if(root.dataset.emsCarouselReady==='true')return;
    const viewport=root.querySelector('[data-ems-carousel-viewport]');
    const cards=Array.from(root.querySelectorAll('.ems-carousel-track [data-ems-detail-index]'));
    const prev=root.querySelector('[data-ems-carousel-prev]');
    const next=root.querySelector('[data-ems-carousel-next]');
    const counter=root.querySelector('[data-ems-carousel-current]');
    const progress=root.querySelector('[data-ems-carousel-progress]');
    if(!viewport||!cards.length||!prev||!next)return;
    root.dataset.emsCarouselReady='true';
    let active=0,raf=0,lastInteraction=0,isVisible=false,hovered=false;
    let glideFrame=0,autoDirection=1;
    let pointer=null,suppressClick=false;
    function stopGlide(){
      if(glideFrame)cancelAnimationFrame(glideFrame);
      glideFrame=0;
      viewport.style.scrollSnapType='';
    }
    function markInteraction(){lastInteraction=performance.now();stopGlide();}
    function setActive(i){
      active=Math.max(0,Math.min(cards.length-1,i));
      cards.forEach(function(card,n){
        const selected=n===active;
        card.classList.toggle('is-active',selected);
        if(selected)card.setAttribute('aria-current','true');
        else card.removeAttribute('aria-current');
      });
      if(counter)counter.textContent=String(active+1).padStart(2,'0');
      if(progress)progress.style.width=(((active+1)/cards.length)*100)+'%';
      root.style.setProperty('--ems-carousel-current',String(active));
    }
    function centerCard(i,smooth){
      const n=(i+cards.length)%cards.length;
      const c=cards[n].getBoundingClientRect();
      const v=viewport.getBoundingClientRect();
      const offset=viewport.scrollLeft + (c.left-v.left) - (v.width-c.width)/2;
      setActive(n);
      viewport.scrollTo({left:Math.max(0,offset),behavior:smooth&&!reduceMotion.matches?'smooth':'auto'});
    }
    function nearest(){
      const midpoint=viewport.getBoundingClientRect().left+viewport.clientWidth/2;
      let nearestIndex=0,minimum=Infinity;
      cards.forEach(function(c,i){
        const rect=c.getBoundingClientRect();
        const distance=Math.abs(rect.left+rect.width/2-midpoint);
        if(distance<minimum){minimum=distance;nearestIndex=i;}
      });
      setActive(nearestIndex);
    }
    const move=function(step){
      markInteraction();
      centerCard(active+step,true);
    };
    prev.addEventListener('click',function(){move(-1)});
    next.addEventListener('click',function(){move(1)});
    viewport.addEventListener('scroll',function(){
      if(raf)return;
      raf=requestAnimationFrame(function(){raf=0;nearest()});
    },{passive:true});
    viewport.addEventListener('keydown',function(e){
      if(e.target.closest('[data-ems-detail-index]'))return;
      if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
        e.preventDefault();move(e.key==='ArrowRight'?1:-1);
      }
    });
    viewport.addEventListener('pointerenter',function(){hovered=true;});
    viewport.addEventListener('pointerleave',function(){hovered=false;});
    viewport.addEventListener('pointerdown',function(e){
      if(e.pointerType!=='mouse'||e.button!==0)return;
      pointer={id:e.pointerId,x:e.clientX,left:viewport.scrollLeft,moved:false};
      markInteraction();
    });
    viewport.addEventListener('pointermove',function(e){
      if(!pointer||pointer.id!==e.pointerId)return;
      const dx=e.clientX-pointer.x;
      if(!pointer.moved&&Math.abs(dx)<7)return;
      if(!pointer.moved){
        pointer.moved=true;viewport.classList.add('is-dragging');
        viewport.style.scrollSnapType='none';
        try{viewport.setPointerCapture(e.pointerId);}catch(_){}
      }
      viewport.scrollLeft=pointer.left-dx;
      e.preventDefault();
    });
    function finishPointer(){
      if(!pointer)return;
      const dragged=pointer.moved;
      pointer=null;
      viewport.classList.remove('is-dragging');
      viewport.style.scrollSnapType='';
      if(dragged){
        suppressClick=true;
        window.setTimeout(function(){suppressClick=false;},250);
        requestAnimationFrame(function(){nearest();centerCard(active,true)});
      }
    }
    viewport.addEventListener('pointerup',finishPointer);
    viewport.addEventListener('pointercancel',finishPointer);
    viewport.addEventListener('lostpointercapture',finishPointer);
    root.addEventListener('click',function(e){
      if(suppressClick&&e.target.closest('[data-ems-detail-index]')){
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
        suppressClick=false;
      }
    },true);
    cards.forEach(function(card){card.querySelectorAll('img').forEach(function(img){img.draggable=false;});});
    root.addEventListener('focusin',markInteraction);
    root.addEventListener('touchstart',markInteraction,{passive:true});
    root.addEventListener('wheel',function(e){
      if(Math.abs(e.deltaX)>Math.abs(e.deltaY))markInteraction();
    },{passive:true});
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(function(entries){
        isVisible=entries.some(function(e){return e.isIntersecting});
      },{threshold:.3});
      observer.observe(root);
    }else isVisible=true;
    if('ResizeObserver' in window){
      const ro=new ResizeObserver(function(){
        if(!pointer)requestAnimationFrame(function(){centerCard(active,false)});
      });
      ro.observe(viewport);
    }
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        centerCard(cards.length>4?2:Math.min(1,cards.length-1),false);
      });
    });
    // Smooth, slow automatic gallery movement: three seconds per card.
    // Reverse at either end so the carousel never jumps abruptly.
    function glideTo(index){
      if(glideFrame)return;
      const n=Math.max(0,Math.min(cards.length-1,index));
      const card=cards[n].getBoundingClientRect();
      const view=viewport.getBoundingClientRect();
      const maxScroll=Math.max(0,viewport.scrollWidth-viewport.clientWidth);
      const target=Math.min(maxScroll,Math.max(0,
        viewport.scrollLeft+(card.left-view.left)-(view.width-card.width)/2));
      const begin=viewport.scrollLeft;
      const delta=target-begin;
      if(Math.abs(delta)<2){setActive(n);return;}
      const duration=3000;
      let started=null;
      viewport.style.scrollSnapType='none';
      function frame(now){
        if(reduceMotion.matches||document.hidden||!isVisible||pointer){
          stopGlide();
          return;
        }
        if(started===null)started=now;
        const t=Math.min(1,(now-started)/duration);
        const eased=t*t*(3-2*t);
        viewport.scrollLeft=begin+delta*eased;
        if(t<1)glideFrame=requestAnimationFrame(frame);
        else{
          glideFrame=0;
          viewport.style.scrollSnapType='';
          setActive(n);
        }
      }
      glideFrame=requestAnimationFrame(frame);
    }
    if(cards.length>1){
      window.setInterval(function(){
        if(reduceMotion.matches||document.hidden||!isVisible||pointer||glideFrame)return;
        if(performance.now()-lastInteraction<10000)return;
        const focused=document.activeElement;
        if(focused&&root.contains(focused))return;
        if(active>=cards.length-1)autoDirection=-1;
        else if(active<=0)autoDirection=1;
        glideTo(active+autoDirection);
      },3600);
    }
  }
  function boot(){
    const host=document.getElementById('detail-host');
    if(!host)return;
    const mount=function(){host.querySelectorAll('.ems-detail-carousel').forEach(start);};
    mount();
    const observer=new MutationObserver(mount);
    observer.observe(host,{childList:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();