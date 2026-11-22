/* EMS / upgrade property information into accessible interactive pills */
(function(){
 'use strict';
 function upgrade(){
   const host=document.getElementById('detail-host');
   if(!host)return;
   host.querySelectorAll('.detail-amenities > span, .detail-facilities > span').forEach(function(span){
     const button=document.createElement('button');
     button.type='button';
     button.className='ems-detail-pill';
     button.setAttribute('aria-pressed','false');
     button.textContent=span.textContent;
     span.replaceWith(button);
   });
 }
 function boot(){
   const host=document.getElementById('detail-host');
   if(!host)return;
   upgrade();
   const observer=new MutationObserver(upgrade);
   observer.observe(host,{childList:true,subtree:true});
   host.addEventListener('click',function(event){
     const button=event.target instanceof Element?event.target.closest('.ems-detail-pill'):null;
     if(!button||!host.contains(button))return;
     const selected=button.getAttribute('aria-pressed')==='true';
     button.setAttribute('aria-pressed',selected?'false':'true');
   });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
 else boot();
})();
