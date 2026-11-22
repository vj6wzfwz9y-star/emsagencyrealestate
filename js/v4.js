/* EMS Agency — 2026 / digital flagship. CMS data served through Wix's verified client modules. */
(() => {
'use strict';
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const page=document.body.dataset.page||'';
const esc=(value)=>String(value==null?'':value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const money=(value)=>Number(value)>0?new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0}).format(Number(value))+' DH':'Prix sur demande';
/* Wix image:// values are CMS data, not browser-ready URLs. */
const photoSrc=(value,width=1400,height=920)=>{
 if(typeof value!=='string')return '';
 const v=value.trim();
 if(v.startsWith('wix:image://v1/')){
   const file=v.slice('wix:image://v1/'.length).split(/[/?#]/)[0];
   if(!/^[a-z0-9_.~-]+\.(?:webp|png|jpe?g)$/i.test(file))return '';
   const extension=file.split('.').pop().toLowerCase();
   return 'https://static.wixstatic.com/media/'+file+'/v1/fit/w_'+Math.floor(width)+',h_'+Math.floor(height)+'/file.'+extension;
 }
 try{
   const u=new URL(v);
   if(u.protocol==='https:'&&['static.wixstatic.com','images.wixstatic.com'].includes(u.hostname))return u.href;
 }catch{}
 return '';
};
const validPhoto=(value)=>!!photoSrc(value);
const img=(value)=>photoSrc(value,1100,800)||'assets/images/virtual/a1.webp';
const cityNames={Tanger:'Tanger',Tetouan:'Tétouan',Martil:'Martil',Mdiq:'M’diq',Fnideq:'Fnideq'};
let properties=[];let propertyError=false;
let favorites=new Set();try{favorites=new Set(JSON.parse(localStorage.getItem('ems-v4-favorites')||'[]'));}catch{}
const saveFavorites=()=>{try{localStorage.setItem('ems-v4-favorites',JSON.stringify([...favorites]));}catch{}};
const setFavoriteCount=()=>{if($('#favorite-count'))$('#favorite-count').textContent=String(favorites.size);};
function toast(message){const el=$('#toast');if(!el)return;el.textContent=message;el.classList.add('on');setTimeout(()=>el.classList.remove('on'),3200);}
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function reveal(){const all=$$('.reveal');if(!('IntersectionObserver'in window)||reduced){all.forEach(el=>el.classList.add('seen'));return;}const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('seen');observer.unobserve(entry.target);}},{rootMargin:'0px 0px -45px 0px',threshold:.05});all.forEach(el=>observer.observe(el));}
function shell(){setFavoriteCount();$$('.this-year').forEach(el=>el.textContent=String(new Date().getFullYear()));
 const curtain=$('#loading-curtain');if(curtain){window.setTimeout(()=>curtain.classList.add('gone'),page==='home'?850:340);window.setTimeout(()=>curtain.remove(),2500);}
 const header=$('#global-header'),track=$('#progress-line');let scheduled=false;
 const update=()=>{if(header)header.classList.toggle('scrolled',scrollY>35);if(track){const height=document.documentElement.scrollHeight-innerHeight;track.style.width=(height>0?100*scrollY/height:0)+'%';}scheduled=false;};
 addEventListener('scroll',()=>{if(!scheduled){requestAnimationFrame(update);scheduled=true;}},{passive:true});update();
 const menu=$('#menu-btn');menu?.addEventListener('click',()=>{const nav=$('#mobile-menu');if(!nav)return;const on=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(on));document.body.classList.toggle('menu-open',on);});
 if(!reduced){const halo=$('#cursor-light');if(halo&&window.matchMedia('(pointer:fine)').matches){addEventListener('pointermove',e=>{halo.style.left=e.clientX+'px';halo.style.top=e.clientY+'px';halo.style.opacity='.85';},{passive:true});}}
 document.addEventListener('click',e=>{const btn=e.target.closest('[data-fav]');if(!btn)return;e.preventDefault();const id=btn.dataset.fav;if(favorites.has(id))favorites.delete(id);else favorites.add(id);saveFavorites();setFavoriteCount();$$('[data-fav]').filter(b=>b.dataset.fav===id).forEach(b=>{b.classList.toggle('active',favorites.has(id));b.setAttribute('aria-label',favorites.has(id)?'Retirer des favoris':'Ajouter aux favoris');b.textContent=favorites.has(id)?'♥':'♡';});document.dispatchEvent(new CustomEvent('ems:favorites'));toast(favorites.has(id)?'Bien ajouté à vos favoris':'Bien retiré de vos favoris');});
 reveal();}
function initSlider(){const slides=$$('.hero-slide');if(!slides.length)return;let idx=0;let timer=null;
 const show=n=>{idx=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle('on',i===idx));const number=$('.hero-current');if(number)number.textContent=String(idx+1).padStart(2,'0');const line=$('#pager-line');if(line){line.style.animation='none';line.offsetHeight;line.style.animation='progress 7s linear infinite';}};
 const next=()=>show(idx+1);const restart=()=>{if(timer)clearInterval(timer);if(!reduced)timer=setInterval(next,7000);};
 $('#hero-next')?.addEventListener('click',()=>{next();restart();});$('#hero-prev')?.addEventListener('click',()=>{show(idx-1);restart();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&timer)clearInterval(timer);else restart();});restart();}
async function cms(collection,limit=100){const {queryItems}=await import('/js/wix/items.js');const response=await queryItems(collection,{limit});if(!response||!Array.isArray(response.items))throw Error('Unrecognized CMS response');return response.items;}
function propertyImages(raw){const preferred=['photo','photo2','photo3','photo4','photo41','image'];const extras=Object.keys(raw).filter(key=>/^(?:photo\d+|image\d+)$/.test(key)&&!preferred.includes(key)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));return [...new Set([...preferred,...extras].map(key=>photoSrc(raw[key],1800,2600)).filter(Boolean))];}
function normalize(raw){const photos=propertyImages(raw);return {id:String(raw._id||''),title:String(raw.title||''),city:String(raw.city||''),district:String(raw.district||''),type:String(raw.type||''),transaction:raw.transaction==='Location'?'Location':'Vente',price:Number(raw.price)||0,area:Number(raw.area)||0,beds:Number(raw.beds)||0,baths:Number(raw.baths)||0,ref:String(raw.ref||''),description:String(raw.description||''),features:String(raw.features||'').split(',').map(x=>x.trim()).filter(Boolean),images:photos,new:!!raw.new,featured:!!raw.featured,created:raw._createdDate||''};}
async function loadProperties(){try{properties=(await cms('EMSProperties',100)).filter(x=>x.title&&propertyImages(x).length>0).map(normalize);propertyError=false;}catch(e){properties=[];propertyError=true;console.error('Catalogue EMS:',e);}return properties;}
function card(p,i=0,mode='collection'){
 const href='bien.html?id='+encodeURIComponent(p.id);
 const n=String(i+1).padStart(2,'0');
 const originalTitle=String(p.title||'Un lieu singulier').trim();
 const title=esc(originalTitle);
 const nameParts=originalTitle.split(/\s+/);
 const editorialTitle=nameParts.length>1?
   esc(nameParts.slice(0,-1).join(' '))+' <em>'+esc(nameParts[nameParts.length-1])+'</em>':title;
 const city=esc(cityNames[p.city]||p.city||'Le Nord');
 const district=p.district&&p.district!=='À compléter'?' / '+esc(p.district):'';
 const photos=Array.isArray(p.images)?p.images.filter(Boolean):[];
 const total=String(photos.length).padStart(2,'0');
 const price=Number(p.price)>0?esc(money(p.price)):'PRIX SUR DEMANDE';
 const specs=[
   Number(p.area)>0?esc(p.area)+' m²':'',
   Number(p.beds)>0?esc(p.beds)+' CH.':'',
   Number(p.baths)>0?esc(p.baths)+' SDB.':''
 ].filter(Boolean);
 const fav=favorites.has(p.id);
 const photosMarkup=photos.slice(0,3).map((src,j)=>{
   const primary=j===0;
   const position=primary?'hero':j===1?'left':'right';
   const data=primary?
     ' data-ems-images="'+esc(JSON.stringify(photos))+'" data-ems-title="'+title+'" aria-label="Voir les photos de '+title+'"':
     ' aria-label="Découvrir '+title+' — photo '+(j+1)+'"';
   return '<div class="ems-lookbook-tile ems-lookbook-tile--'+position+'">'+
     '<a class="'+(primary?'ems-expo-visual ':'')+'ems-lookbook-photo-link" href="'+href+'"'+data+'>'+
      '<img class="'+(primary?'ems-expo-cover ':'')+'ems-lookbook-image" src="'+esc(img(src))+'" alt="Photo '+(j+1)+' du bien '+title+'" loading="'+(i===0&&primary?'eager':'lazy')+'" decoding="async">'+
      '<span class="ems-lookbook-photo-index" aria-hidden="true">'+String(j+1).padStart(2,'0')+' / '+total+'</span>'+
      '<span class="ems-lookbook-photo-arrow" aria-hidden="true">↗</span>'+
     '</a>'+
     (primary?
       '<button type="button" class="fav-btn ems-expo-fav'+(fav?' active':'')+'" data-fav="'+esc(p.id)+'" aria-label="'+(fav?'Retirer des favoris':'Ajouter aux favoris')+'">'+(fav?'♥':'♡')+'</button>':'')+
   '</div>';
 }).join('');
 const specLabel=specs.length?specs.map(x=>'<span>'+x+'</span>').join('<b aria-hidden="true">·</b>'):'<span>DÉTAILS SUR DEMANDE</span>';
 const countText=photos.length>1?total+' PHOTOS À DÉCOUVRIR ↗':'EMS AGENCY';
 return '<article class="ems-expo ems-expo--'+mode+' ems-expo-reveal ems-lookbook-card ems-lookbook-card--'+Math.min(photos.length,3)+'">'+
   '<header class="ems-lookbook-head">'+
     '<div class="ems-lookbook-kicker"><span>ÉDITION / '+n+'</span><span>CURATED / EMS AGENCY</span></div>'+
     '<div class="ems-lookbook-head-row">'+
       '<div class="ems-lookbook-name">'+
         '<span class="ems-lookbook-location">✳ &nbsp; '+city+district+'</span>'+
         '<h3>'+editorialTitle+'</h3>'+
       '</div>'+
       '<div class="ems-lookbook-price"><small>PRIX DU BIEN</small><strong>'+price+'</strong></div>'+
     '</div>'+
   '</header>'+
   '<div class="ems-lookbook-gallery" aria-label="'+title+'">'+photosMarkup+'</div>'+
   '<footer class="ems-lookbook-foot">'+
     '<div class="ems-lookbook-facts">'+
       '<div class="ems-lookbook-tags"><span>'+esc(p.type||'PROPRIÉTÉ')+'</span><span>'+(p.transaction==='Location'?'À LOUER':'À VENDRE')+'</span>'+(p.new?'<span>NOUVEAU</span>':'')+'</div>'+
       '<div class="ems-lookbook-specs">'+specLabel+'</div>'+
     '</div>'+
     '<div class="ems-lookbook-foot-right"><span class="ems-lookbook-count">'+countText+'</span>'+
     '<a class="ems-lookbook-cta" href="'+href+'">DÉCOUVRIR LE PROJET <span aria-hidden="true">↗</span></a></div>'+
   '</footer>'+
 '</article>';
}

function homeProperties(){const box=$('#home-grid');if(!box)return;const data=[...properties].sort((a,b)=>Number(b.featured)-Number(a.featured)).slice(0,3);box.innerHTML=data.map((p,i)=>card(p,i,'home')).join('');box.hidden=!data.length;$('#home-empty').hidden=!!data.length;const message=$('#home-empty p');if(message&&propertyError)message.textContent='Le catalogue est momentanément indisponible. Réessayez plus tard ou contactez-nous.';}
function catalogue(){const box=$('#catalogue-grid');if(!box)return;
 const params=new URLSearchParams(location.search);const city=$('#filter-city'),type=$('#filter-type'),transaction=$('#filter-transaction'),price=$('#filter-price'),sort=$('#sort');let tab=params.get('favoris')==='1'?'fav':'all';city.value=params.get('ville')||'';type.value=params.get('type')||'';transaction.value=params.get('transaction')||'';
 const update=()=>{let data=properties.filter(p=>{if(city.value&&p.city!==city.value)return false;if(type.value&&p.type!==type.value)return false;if(transaction.value&&p.transaction!==transaction.value)return false;if(price.value&&p.price>Number(price.value))return false;if(tab==='fav'&&!favorites.has(p.id))return false;if(tab==='sale'&&p.transaction!=='Vente')return false;if(tab==='rent'&&p.transaction!=='Location')return false;return true;});if(sort.value==='low')data.sort((a,b)=>a.price-b.price);else if(sort.value==='high')data.sort((a,b)=>b.price-a.price);else if(sort.value==='new')data.sort((a,b)=>Number(b.new)-Number(a.new));else data.sort((a,b)=>Number(b.featured)-Number(a.featured));box.innerHTML=data.map((p,i)=>card(p,i,'collection')).join('');box.hidden=!data.length;$('#collection-empty').hidden=!!data.length;$('#catalogue-count').textContent=String(data.length).padStart(2,'0')+' BIEN'+(data.length>1?'S':'');const text=$('#collection-empty p');if(propertyError&&text)text.textContent='Le catalogue est momentanément indisponible. Réessayez plus tard ou contactez-nous.';$$('[data-tab]').forEach(b=>b.classList.toggle('chosen',b.dataset.tab===tab));};
 $('#filters')?.addEventListener('submit',e=>{e.preventDefault();const q=new URLSearchParams();if(city.value)q.set('ville',city.value);if(type.value)q.set('type',type.value);if(transaction.value)q.set('transaction',transaction.value);if(tab==='fav')q.set('favoris','1');history.replaceState(null,'','biens.html'+(q.size?'?'+q:''));update();});[city,type,transaction,price,sort].forEach(el=>el.addEventListener('change',update));$$('[data-tab]').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.tab;update();}));document.addEventListener('ems:favorites',update);update();}
function renderDetailMosaic(p){
 const photos=(Array.isArray(p.images)?p.images:[]).filter(Boolean).slice(0,24);
 if(!photos.length)return '';
 const total=String(photos.length).padStart(2,'0');
 const title=esc(p.title||'EMS Agency');
 return '<div class="container detail-photo-grid ems-detail-mosaic ems-detail-carousel" data-ems-detail-images="'+esc(JSON.stringify(photos))+'" data-ems-detail-title="'+title+'">'+
   '<div class="ems-detail-mosaic-top"><span>01 / GALERIE DU BIEN</span><span>'+total+' PHOTOS · CLIQUEZ POUR AGRANDIR ↗</span></div>'+
   '<div class="ems-carousel-viewport" data-ems-carousel-viewport tabindex="0" role="region" aria-roledescription="carousel" aria-label="Galerie du projet">'+
      '<div class="ems-carousel-track">'+
        photos.map((src,i)=>'<button type="button" class="ems-detail-tile ems-carousel-card" data-ems-detail-index="'+i+'" aria-label="Agrandir la photo '+(i+1)+' sur '+photos.length+' de '+title+'">'+
          '<img src="'+esc(img(src))+'" alt="Photo '+(i+1)+' du bien '+title+'" '+(i<3?'fetchpriority="high"':'loading="lazy"')+' decoding="async" draggable="false">'+
          '<span class="ems-carousel-card-index" aria-hidden="true">'+String(i+1).padStart(2,'0')+'</span></button>').join('')+
      '</div></div>'+
   '<div class="ems-carousel-controls">'+
      '<span class="ems-carousel-label">GLISSEZ POUR DÉCOUVRIR</span>'+
      '<span class="ems-carousel-progress" aria-hidden="true"><span data-ems-carousel-progress></span></span>'+
      '<span class="ems-carousel-counter" aria-live="polite"><b data-ems-carousel-current>01</b><span>/</span><span>'+total+'</span></span>'+
      '<div class="ems-carousel-buttons"><button type="button" data-ems-carousel-prev aria-label="Photo précédente">←</button><button type="button" data-ems-carousel-next aria-label="Photo suivante">→</button></div>'+
   '</div>'+
   '<div class="ems-detail-mosaic-bottom"><span>EMS AGENCY / CURATED PROPERTIES</span><span>LES DÉTAILS DU BIEN ↓</span></div>'+
 '</div>';
}
function detail(){const host=$('#detail-host');if(!host)return;const id=new URLSearchParams(location.search).get('id')||'';const p=properties.find(x=>x.id===id);if(!p){host.innerHTML='<div class="container detail-intro"><span class="section-kicker dark">EMS AGENCY</span><h1>Bien introuvable.</h1><p>Cette annonce n’est plus disponible.</p><a class="btn-dark" href="biens.html">RETOUR AUX BIENS ↗</a></div>';return;}
 document.title=p.title+' | EMS Agency';const descriptions=p.description?'<p>'+esc(p.description).replace(/\n/g,'<br>')+'</p>':'<p>Contactez notre équipe pour en savoir plus sur ce bien.</p>';host.innerHTML=`<section class="container detail-intro"><div class="detail-crumbs"><a href="index.html">ACCUEIL</a><span>/</span><a href="biens.html">NOS BIENS</a><span>/</span><span>${esc(p.ref||'PROPRIÉTÉ')}</span></div><h1>${esc(p.title)}</h1><p class="detail-location">⌖ ${esc(cityNames[p.city]||p.city)} ${p.district?' · '+esc(p.district):''}</p></section>${renderDetailMosaic(p)}<div class="container detail-info"><div><span class="section-kicker dark">À PROPOS DE CE BIEN</span><h2>Un lieu à découvrir.</h2><div class="detail-amenities"><span>◫ ${esc(p.area)} m²</span><span>⌂ ${esc(p.beds)} chambres</span><span>◧ ${esc(p.baths)} salles de bain</span><span>${esc(p.type)}</span></div>${descriptions}${p.features.length?'<div class="detail-facilities">'+p.features.map(f=>'<span>✳ '+esc(f)+'</span>').join('')+'</div>':''}</div><aside class="detail-aside"><small>${p.transaction==='Location'?'À LOUER':'À VENDRE'} · EMS AGENCY</small><strong>${money(p.price)}</strong><p>Référence : ${esc(p.ref||'EMS')}</p><a href="contact.html?bien=${encodeURIComponent(p.ref||p.title)}">PLANIFIER UNE VISITE <span>↗</span></a></aside></div>`;}
async function livePhotos(){try{const items=await cms('EMSHomeImages',20);const allowed=new Map(items.map(x=>[x.slot,photoSrc(x.photo,2000,1250)]).filter(([,url])=>!!url));$$('.hero-slide').forEach((el,i)=>{if(allowed.has('slide-'+(i+1)))el.style.backgroundImage=`url("${allowed.get('slide-'+(i+1))}")`;});if(allowed.has('feature')&&$('#feature-bg'))$('#feature-bg').style.backgroundImage=`url("${allowed.get('feature')}")`;}catch(e){console.warn('Photos EMS par défaut conservées',e);}}
async function cities(){try{const list=await cms('EMSDestinations',20);const byCity=new Map(list.map(x=>[x.slug,{...x,photo:photoSrc(x.photo,1600,1100)}]));$$('.city-card').forEach(el=>{const item=byCity.get(el.dataset.city);if(!item)return;if(validPhoto(item.photo))el.style.setProperty('--city-bg',`url("${item.photo}")`);const title=$('h3',el),sub=$('.city-overline',el);if(title&&item.title)title.textContent=item.title;if(sub&&item.subtitle)sub.textContent=item.subtitle;});$$('.dest-row').forEach(el=>{const item=byCity.get(el.dataset.dest);if(!item)return;const image=$('img',el),title=$('h3',el);if(image&&validPhoto(item.photo))image.src=item.photo;if(title&&item.title)title.textContent=item.title;});}catch(e){console.warn('Destinations EMS par défaut conservées',e);}}
function accordion(){$$('.city-card').forEach(card=>{const activate=()=>{$$('.city-card').forEach(c=>c.classList.toggle('expanded',c===card));};card.addEventListener('pointerenter',activate);card.addEventListener('focus',activate);});}
// Wix forms store handles schema-driven validation, visitor consent and submissions.
async function contact(){const host=$('#wix-form-host');if(!host)return;let store;try{const mod=await import('/js/wix/form-store.js');store=mod.createFormStore({formId:'78d918e1-fc4b-4e35-8993-70d755282f0f'});const ERROR=mod.FORM_ERROR;let lastRenderSignature='';
 const render=s=>{if(s.outcome){host.innerHTML=`<div class="form-success"><span>✳</span><h3>Message reçu.</h3><p>${esc(s.outcome.message||'Merci pour votre message. Nous reviendrons vers vous.')}</p><a href="index.html" class="line-link">RETOUR À L’ACCUEIL ↗</a></div>`;return;}
 if(!s.form){host.innerHTML='<div class="form-loading">'+esc(s.errors[ERROR]||'Préparation du formulaire…')+'</div>';return;}if(s.closed){host.innerHTML='<div class="form-loading">Le formulaire est temporairement fermé. Veuillez réessayer plus tard.</div>';return;}
 // Only rebuild if field schema changes, not on every keystroke.
 const fields=s.form.fields.filter(f=>!s.form.steps?.length||!f.stepId||f.stepId===s.form.steps[s.step]?.id);const signature=fields.map(f=>f.target+':'+f.control+':'+f.required).join('|');
 if(signature!==lastRenderSignature||!$('#wix-cms-form')){lastRenderSignature=signature;let fieldsHtml=fields.map((f,i)=>{const target=esc(f.target),label=esc(f.label),value=s.values[f.target]??'';const wide=f.control==='textarea'||(fields.length%2&&i===fields.length-1);let control='';if(f.control==='textarea')control=`<textarea id="form-${target}" name="${target}" ${f.required?'required':''} placeholder="${esc(f.placeholder||'')}" rows="5">${esc(value)}</textarea>`;else if(f.control==='select'){control=`<select id="form-${target}" name="${target}" ${f.required?'required':''}><option value="">Sélectionner une option</option>${(f.choices||[]).map(c=>`<option value="${esc(c.value)}" ${String(value)===String(c.value)?'selected':''}>${esc(c.label)}</option>`).join('')}</select>`;}else if(f.control==='checkbox'){control=`<input id="form-${target}" type="checkbox" name="${target}" ${value?'checked':''}>`;}else{const type=({email:'email',phone:'tel',number:'number',url:'url',date:'date'})[f.control]||'text';control=`<input id="form-${target}" name="${target}" type="${type}" ${f.required?'required':''} value="${esc(value)}" placeholder="${esc(f.placeholder||'')}">`;}return `<div class="field ${wide?'wide':''}"><label for="form-${target}">${label}${f.required?' *':''}</label>${control}<p class="field-error" data-error="${target}" role="alert"></p></div>`;}).join('');host.innerHTML=`<form id="wix-cms-form" class="wix-live-form" novalidate>${fieldsHtml}<div class="form-action-row"><div class="form-global-error" id="form-global-error" role="alert"></div><button id="form-submit" type="submit">${esc(s.form.submitText||'Envoyer ma demande')} <span>↗</span></button></div></form>`;const form=$('#wix-cms-form');form.addEventListener('input',event=>{if(!event.target.name)return;store.setValue(event.target.name,event.target.type==='checkbox'?event.target.checked:event.target.value);});form.addEventListener('change',event=>{if(!event.target.name)return;store.setValue(event.target.name,event.target.type==='checkbox'?event.target.checked:event.target.value);});form.addEventListener('focusout',event=>{if(event.target.name)store.validate(event.target.name);});form.addEventListener('submit',event=>{event.preventDefault();const state=store.getState();if(state.form?.steps?.length&&state.step<state.form.steps.length-1)store.next(event);else store.submit(event);});}
 fields.forEach(f=>{const error=host.querySelector('[data-error="'+CSS.escape(f.target)+'"]');if(error)error.textContent=s.errors[f.target]||'';});const global=$('#form-global-error');if(global)global.textContent=s.errors[ERROR]||'';const submit=$('#form-submit');if(submit)submit.disabled=!!s.loading;
 };store.subscribe(render);render(store.getState());store.start();}catch(error){console.error('EMS Forms:',error);host.innerHTML='<div class="form-global-error">Le formulaire est temporairement indisponible. Veuillez réessayer plus tard.</div>';}}
async function init(){shell();if(page==='home'){initSlider();accordion();livePhotos();cities();await loadProperties();homeProperties();}else if(page==='biens'){await loadProperties();catalogue();}else if(page==='bien'){await loadProperties();detail();}else if(page==='destinations'){cities();}else if(page==='contact'){contact();}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
