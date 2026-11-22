/* Gentle scroll reveal for CMS listing cards after render/filter changes. */
(function(){
 'use strict';
 function init(){
   const roots=[document.getElementById('home-grid'),document.getElementById('catalogue-grid')].filter(Boolean);
   if(!roots.length)return;
   const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   const io=!reduced&&'IntersectionObserver' in window?new IntersectionObserver(entries=>{
     for(const entry of entries)if(entry.isIntersecting){
       entry.target.classList.add('ems-expo-visible');
       io.unobserve(entry.target);
     }
   },{threshold:.08,rootMargin:'0px 0px 35px 0px'}):null;
   const seen=new WeakSet();
   function apply(root){
     for(const item of root.querySelectorAll('.ems-expo-reveal')){
       if(seen.has(item))continue;
       seen.add(item);
       if(io)io.observe(item);
       else item.classList.add('ems-expo-visible');
     }
   }
   for(const root of roots){
     apply(root);
     new MutationObserver(()=>apply(root)).observe(root,{childList:true});
   }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
