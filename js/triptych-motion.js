/* EMS Agency / fluid triptych motion.
   Keeps approved flat 3-photo lookbook design, but cycles all CMS images
   horizontally at one photo every ~3 seconds. No 3D, no snap-back. */
(function(){
 'use strict';
 const PACE_MS = 3000;
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
 const galleries = new WeakSet();

 function setup(gallery){
   if(galleries.has(gallery) || reduced.matches)return;
   const article=gallery.closest('.ems-lookbook-card');
   if(!article)return;
   const hero=gallery.querySelector('.ems-lookbook-tile--hero');
   const left=gallery.querySelector('.ems-lookbook-tile--left');
   const right=gallery.querySelector('.ems-lookbook-tile--right');
   const master=hero && hero.querySelector('.ems-lookbook-photo-link[data-ems-images]');
   if(!master || !left || !right)return;
   let photos=[];
   try{photos=JSON.parse(master.dataset.emsImages || '[]');}catch(_){return;}
   if(!Array.isArray(photos)||photos.length<3)return;
   photos=photos.filter(x=>typeof x==='string'&&/^https:\/\/(?:static|images)\.wixstatic\.com\//.test(x)).slice(0,25);
   if(photos.length<3)return;
   galleries.add(gallery);

   const href=master.getAttribute('href') || 'biens.html';
   const projectName=master.dataset.emsTitle || 'Projet EMS Agency';
   const photoLimit=String(photos.length).padStart(2,'0');

   // Preserve the visual arrangement the user approved:
   // photograph 02 on the left, 01 at center, 03 on the right.
   gallery.appendChild(left);
   gallery.appendChild(hero);
   gallery.appendChild(right);
   const cards=[left,hero,right];
   for(let i=3;i<photos.length;i++){
     const tile=document.createElement('div');
     tile.className='ems-lookbook-tile ems-lookbook-tile--extra';
     const link=document.createElement('a');
     link.className='ems-lookbook-photo-link';
     link.href=href;
     link.setAttribute('aria-label','Découvrir '+projectName+' — photo '+(i+1));
     const image=document.createElement('img');
     image.className='ems-lookbook-image';
     image.src=photos[i];
     image.alt='Photo '+(i+1)+' du bien '+projectName;
     image.loading='lazy';
     image.decoding='async';
     const index=document.createElement('span');
     index.className='ems-lookbook-photo-index';
     index.setAttribute('aria-hidden','true');
     index.textContent=String(i+1).padStart(2,'0')+' / '+photoLimit;
     const arrow=document.createElement('span');
     arrow.className='ems-lookbook-photo-arrow';
     arrow.setAttribute('aria-hidden','true');
     arrow.textContent='↗';
     link.append(image,index,arrow);
     tile.appendChild(link);
     gallery.appendChild(tile);
     cards.push(tile);
   }

   // Put the existing favorite control above the center photograph,
   // rather than letting it travel away with photograph 01.
   const favorite=hero.querySelector('.fav-btn[data-fav]');
   if(favorite)gallery.appendChild(favorite);
   // Disable the legacy touch image-swap handler; this lookbook now uses
   // real continuous positioning rather than replacing a single image SRC.
   master.classList.remove('ems-expo-visual');
   gallery.classList.add('ems-triptych-playing');

   let phase=1;
   let lastTime=0;
   let frameId=0;
   let visible=true;
   let pointer=null;
   let suppressClickUntil=0;
   let pauseUntil=0;
   let focusPaused=false;
   let cellWidth=350;
   let spacing=344;
   let currentCenter=-1;
   const total=cards.length;

   function measure(){
     if(!gallery.isConnected)return;
     const width=gallery.getBoundingClientRect().width;
     if(!width)return;
     const mobile=width<690;
     cellWidth=mobile?Math.min(275,Math.max(185,width*.65)):
       Math.min(357,Math.max(185,width*.357));
     spacing=mobile?cellWidth*.85:Math.min(cellWidth*.973,(width-cellWidth*.91)/2);
     gallery.style.setProperty('--ems-triptych-width',cellWidth.toFixed(2)+'px');
     gallery.style.setProperty('--ems-triptych-height',(cellWidth*4/3+38).toFixed(2)+'px');
     render();
   }

   function signedDistance(index){
     return ((index-phase+total*1.5)%total+total)%total-total/2;
   }

   function render(){
     if(!gallery.isConnected)return;
     for(let i=0;i<total;i++){
       const card=cards[i];
       const dist=signedDistance(i);
       const magnitude=Math.abs(dist);
       const x=dist*spacing;
       const y=-7 + magnitude*17;
       const scale=Math.max(.70,1-.105*magnitude);
       let opacity=1;
       if(magnitude>1.07){
         const t=Math.min(1,(magnitude-1.07)/.64);
         opacity=1-t*t*(3-2*t);
       }
       const tx='translate3d(-50%,-50%,0) translate3d('+
         x.toFixed(2)+'px,'+y.toFixed(2)+'px,0) scale('+scale.toFixed(4)+')';
       card.style.setProperty('transform',tx,'important');
       card.style.setProperty('opacity',String(Math.max(0,opacity)),'important');
       card.style.zIndex=String(Math.round(80-magnitude*15));
       card.style.pointerEvents=opacity>.13?'auto':'none';
     }
     const center=((Math.round(phase)%total)+total)%total;
     if(center!==currentCenter){
       currentCenter=center;
       cards.forEach((c,i)=>{
         const selected=i===center;
         c.classList.toggle('ems-triptych-center',selected);
         c.setAttribute('aria-hidden',selected?'false':'true');
         const link=c.querySelector('.ems-lookbook-photo-link');
         if(link)link.tabIndex=selected?0:-1;
       });
     }
   }

   function stop(){
     if(frameId)cancelAnimationFrame(frameId);
     frameId=0;
     lastTime=0;
   }

   function tick(now){
     frameId=0;
     if(!gallery.isConnected){stop();return;}
     if(reduced.matches || document.hidden || !visible){stop();return;}
     if(!pointer && !focusPaused && now>=pauseUntil){
       if(lastTime){
         const delta=Math.min(64,Math.max(0,now-lastTime));
         phase=(phase+delta/PACE_MS)%total;
       }
     }
     lastTime=now;
     render();
     frameId=requestAnimationFrame(tick);
   }

   function play(){
     if(reduced.matches||document.hidden||!visible||frameId)return;
     lastTime=0;
     frameId=requestAnimationFrame(tick);
   }

   // Hover never pauses the gallery. Dragging/swiping pauses only while
   // the visitor is interacting; afterwards it gently resumes.
   gallery.addEventListener('pointerdown',function(e){
     if(e.target.closest('[data-fav]'))return;
     if(e.pointerType==='mouse'&&e.button!==0)return;
     pointer={id:e.pointerId,x:e.clientX,y:e.clientY,phase:phase,moved:false};
     pauseUntil=performance.now()+1200;
   });
   gallery.addEventListener('pointermove',function(e){
     if(!pointer||e.pointerId!==pointer.id)return;
     const dx=e.clientX-pointer.x;
     const dy=e.clientY-pointer.y;
     if(!pointer.moved&&Math.abs(dx)<10)return;
     if(!pointer.moved&&Math.abs(dx)<Math.abs(dy)*1.2){
       pointer=null;return;
     }
     if(!pointer.moved){
       pointer.moved=true;
       gallery.classList.add('ems-triptych-dragging');
       try{gallery.setPointerCapture(e.pointerId);}catch(_){}
     }
     phase=pointer.phase - dx/Math.max(120,spacing);
     render();
     if(e.cancelable)e.preventDefault();
   });
   function release(e){
     if(!pointer||e.pointerId!==pointer.id)return;
     if(pointer.moved){
       suppressClickUntil=performance.now()+470;
       pauseUntil=performance.now()+1100;
     }
     pointer=null;
     gallery.classList.remove('ems-triptych-dragging');
     lastTime=0;
     play();
   }
   gallery.addEventListener('pointerup',release);
   gallery.addEventListener('pointercancel',release);
   gallery.addEventListener('lostpointercapture',release);
   gallery.addEventListener('click',function(e){
     if(performance.now()<suppressClickUntil &&
        e.target.closest('.ems-lookbook-photo-link')){
       e.preventDefault();
       e.stopPropagation();
       e.stopImmediatePropagation();
       return;
     }
     if(e.target.closest('.ems-lookbook-photo-link, .fav-btn')){
       stop();
     }
   },true);
   gallery.addEventListener('focusin',function(){
     focusPaused=true;
   });
   gallery.addEventListener('focusout',function(e){
     if(!e.relatedTarget||!gallery.contains(e.relatedTarget)){
       focusPaused=false;
       pauseUntil=performance.now()+800;
     }
   });
   document.addEventListener('visibilitychange',function(){
     if(document.hidden)stop();
     else play();
   });
   if('IntersectionObserver' in window){
     const observer=new IntersectionObserver(function(entries){
       visible=entries.some(x=>x.isIntersecting);
       if(visible)play();
       else stop();
     },{threshold:0.03});
     observer.observe(gallery);
   }
   if('ResizeObserver' in window){
     const ro=new ResizeObserver(measure);
     ro.observe(gallery);
   }else{
     window.addEventListener('resize',measure,{passive:true});
   }
   reduced.addEventListener?.('change',function(){
     if(reduced.matches)stop();else play();
   });

   measure();
   play();
 }

 function boot(){
   const roots=['home-grid','catalogue-grid']
     .map(id=>document.getElementById(id)).filter(Boolean);
   if(!roots.length)return;
   const scan=root=>{
     root.querySelectorAll('.ems-lookbook-gallery').forEach(setup);
   };
   roots.forEach(root=>{
     scan(root);
     new MutationObserver(()=>scan(root)).observe(root,{childList:true});
   });
 }
 if(document.readyState==='loading'){
   document.addEventListener('DOMContentLoaded',boot,{once:true});
 }else boot();
})();