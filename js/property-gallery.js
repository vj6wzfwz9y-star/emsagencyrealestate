/* EMS AGENCY / PHOTO STORIES — genuine Wix CMS photographs, keyboard and touch accessible */
(function(){
'use strict';
const $=(sel,root=document)=>root.querySelector(sel);
const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
const safe=(arr)=>{
 if(!Array.isArray(arr))return [];
 return arr.filter(v=>typeof v==='string'&&(
  /^https:\/\/(?:static|images)\.wixstatic\.com\//.test(v)||
  /^assets\/images\/[A-Za-z0-9/_\-.]+$/.test(v)
 )).slice(0,20);
};
const parse=(value)=>{
 try{return safe(JSON.parse(value||'[]'))}catch{return []}
};
function cardInfo(node){
 const card=node.closest('.ems-expo');
 if(!card)return null;
 const a=$('.ems-expo-visual[data-ems-images]',card);
 if(!a)return null;
 return {card,a,photos:parse(a.dataset.emsImages),title:a.dataset.emsTitle||'Galerie EMS'};
}
function updateCard(info,step){
 if(!info||info.photos.length<2)return;
 const {card,a,photos}=info;
 const current=Number(a.dataset.emsIndex)||0;
 const next=(current+step%photos.length+photos.length)%photos.length;
 a.dataset.emsIndex=String(next);
 a.setAttribute('data-ems-gallery-used','true');
 const cover=$('.ems-expo-cover',card);
 if(cover)cover.src=photos[next];
 const count=$('.ems-photo-count',card);
 if(count)count.textContent=String(next+1).padStart(2,'0')+' / '+String(photos.length).padStart(2,'0');
}
let modal=null;
let gallery={photos:[],index:0,title:'',lastFocus:null,oldOverflow:''};
function ensureModal(){
 if(modal)return modal;
 modal=document.createElement('dialog');
 modal.className='ems-gallery-lightbox';
 modal.setAttribute('aria-label','Galerie photographique EMS Agency');
 modal.innerHTML=[
  '<div class="ems-lightbox-shell">',
   '<header class="ems-lightbox-head">',
    '<div><span class="ems-lightbox-eyebrow">EMS AGENCY / COLLECTION PRIVÉE</span><strong class="ems-lightbox-title"></strong></div>',
    '<button type="button" class="ems-lightbox-close" aria-label="Fermer la galerie">×</button>',
   '</header>',
   '<div class="ems-lightbox-stage" tabindex="0" aria-label="Photographie, balayez pour changer">',
    '<button type="button" class="ems-lightbox-arrow ems-lightbox-prev" aria-label="Photo précédente">←</button>',
    '<img class="ems-lightbox-image" alt="" decoding="async">',
    '<button type="button" class="ems-lightbox-arrow ems-lightbox-next" aria-label="Photo suivante">→</button>',
   '</div>',
   '<footer class="ems-lightbox-foot">',
    '<span class="ems-lightbox-note">GLISSEZ POUR EXPLORER</span>',
    '<span class="ems-lightbox-counter" aria-live="polite"></span>',
   '</footer>',
   '<div class="ems-lightbox-thumbnails" aria-label="Toutes les photographies"></div>',
  '</div>'
 ].join('');
 document.body.appendChild(modal);
 $('.ems-lightbox-close',modal).addEventListener('click',closeModal);
 $('.ems-lightbox-prev',modal).addEventListener('click',()=>go(-1));
 $('.ems-lightbox-next',modal).addEventListener('click',()=>go(1));
 modal.addEventListener('click',(event)=>{if(event.target===modal)closeModal()});
 modal.addEventListener('close',restoreOverflow);
 $('.ems-lightbox-thumbnails',modal).addEventListener('click',event=>{
  const button=event.target.closest('button[data-gallery-index]');
  if(button){gallery.index=Number(button.dataset.galleryIndex)||0;render()}
 });
 const stage=$('.ems-lightbox-stage',modal);
 let startX=0,startY=0;
 stage.addEventListener('touchstart',event=>{
  if(!event.touches.length)return;
  startX=event.touches[0].clientX;startY=event.touches[0].clientY;
 },{passive:true});
 stage.addEventListener('touchend',event=>{
  if(!event.changedTouches.length)return;
  const dx=event.changedTouches[0].clientX-startX;
  const dy=event.changedTouches[0].clientY-startY;
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.3)go(dx<0?1:-1);
 },{passive:true});
 let lastWheel=0;
 stage.addEventListener('wheel',event=>{
  const dx=event.deltaX,dy=event.deltaY;
  if(Math.max(Math.abs(dx),Math.abs(dy))<12)return;
  event.preventDefault();
  const now=Date.now();
  if(now-lastWheel<520)return;
  lastWheel=now;
  const delta=Math.abs(dx)>Math.abs(dy)?dx:dy;
  go(delta>0?1:-1);
 },{passive:false});
 return modal;
}
function render(){
 if(!modal||!gallery.photos.length)return;
 const index=((gallery.index%gallery.photos.length)+gallery.photos.length)%gallery.photos.length;
 gallery.index=index;
 const url=gallery.photos[index];
 const img=$('.ems-lightbox-image',modal);
 img.src=url;
 img.alt=gallery.title+' — photo '+(index+1)+' sur '+gallery.photos.length;
 $('.ems-lightbox-title',modal).textContent=gallery.title;
 $('.ems-lightbox-counter',modal).textContent=String(index+1).padStart(2,'0')+' / '+String(gallery.photos.length).padStart(2,'0');
 const buttons=$$('[data-gallery-index]',modal);
 for(const button of buttons){
  const selected=Number(button.dataset.galleryIndex)===index;
  button.classList.toggle('selected',selected);
  button.setAttribute('aria-current',selected?'true':'false');
 }
 const one=gallery.photos.length<2;
 $('.ems-lightbox-prev',modal).hidden=one;
 $('.ems-lightbox-next',modal).hidden=one;
 if(buttons[index])buttons[index].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
}
function openModal(photos,title,index=0){
 const clean=safe(photos);
 if(!clean.length)return;
 ensureModal();
 gallery.photos=clean;
 gallery.index=index;
 gallery.title=title||'EMS Agency';
 gallery.lastFocus=document.activeElement;
 gallery.oldOverflow=document.documentElement.style.overflow;
 const strip=$('.ems-lightbox-thumbnails',modal);
 strip.replaceChildren();
 clean.forEach((url,i)=>{
  const button=document.createElement('button');
  button.type='button';
  button.dataset.galleryIndex=String(i);
  button.setAttribute('aria-label','Voir photo '+(i+1));
  const image=document.createElement('img');
  image.src=url;
  image.alt='';
  image.loading='lazy';
  button.appendChild(image);
  strip.appendChild(button);
 });
 render();
 document.documentElement.style.overflow='hidden';
 try{modal.showModal()}catch{modal.setAttribute('open','')}
 $('.ems-lightbox-close',modal).focus();
}
function restoreOverflow(){
 document.documentElement.style.overflow=gallery.oldOverflow;
 if(gallery.lastFocus&&typeof gallery.lastFocus.focus==='function')gallery.lastFocus.focus();
}
function closeModal(){
 if(!modal)return;
 if(typeof modal.close==='function'&&modal.open)modal.close();
 else{modal.removeAttribute('open');restoreOverflow()}
}
function go(direction){
 if(!gallery.photos.length)return;
 gallery.index=(gallery.index+direction+gallery.photos.length)%gallery.photos.length;
 render();
}
document.addEventListener('keydown',event=>{
 if(!modal||!modal.open)return;
 if(event.key==='ArrowRight'){event.preventDefault();go(1)}
 if(event.key==='ArrowLeft'){event.preventDefault();go(-1)}
 if(event.key==='Escape'&&typeof modal.close!=='function'){event.preventDefault();closeModal()}
});
document.addEventListener('click',event=>{
 const node=event.target;
 if(!(node instanceof Element))return;
 const step=node.closest('button[data-ems-step]');
 if(step){
  event.preventDefault();
  const info=cardInfo(step);
  updateCard(info,Number(step.dataset.emsStep)||1);
  return;
 }
 const photo=node.closest('.ems-expo-visual[data-ems-images]');
 if(photo){
  // A property cover opens the PROJECT PAGE, never the lightbox.
  // Swipes still rotate the preview without accidental navigation.
  if(photo.dataset.emsIgnoreClick==='true'){
   event.preventDefault();
   photo.dataset.emsIgnoreClick='false';
  }
  return;
 }
 const grid=node.closest('.detail-photo-grid[data-ems-detail-images]');
 if(grid){
  const tile=node.closest('button[data-ems-detail-index]');
  if(!tile||!grid.contains(tile))return;
  event.preventDefault();
  const images=parse(grid.dataset.emsDetailImages);
  if(!images.length)return;
  const index=Math.max(0,Math.min(images.length-1,Number(tile.dataset.emsDetailIndex)||0));
  openModal(images,grid.dataset.emsDetailTitle,index);
 }
});
// Mobile horizontal swipe on property cards, without interrupting vertical scroll.
let touch=null;
document.addEventListener('touchstart',event=>{
 const el=event.target instanceof Element?event.target.closest('.ems-expo-visual[data-ems-images]'):null;
 if(!el||!event.touches.length)return;
 touch={el,x:event.touches[0].clientX,y:event.touches[0].clientY};
},{passive:true});
document.addEventListener('touchend',event=>{
 if(!touch||!event.changedTouches.length)return;
 const current=touch;touch=null;
 const dx=event.changedTouches[0].clientX-current.x;
 const dy=event.changedTouches[0].clientY-current.y;
 if(Math.abs(dx)<42||Math.abs(dx)<Math.abs(dy)*1.3)return;
 const info=cardInfo(current.el);
 if(!info||info.photos.length<2)return;
 current.el.dataset.emsIgnoreClick='true';
 updateCard(info,dx<0?1:-1);
 setTimeout(()=>{current.el.dataset.emsIgnoreClick='false'},500);
},{passive:true});
/* Detail photos open through click on an existing mosaic tile only. */
})();
