/* EMS Agency — interactive, dependency-free front end. */
(() => {
  'use strict';
  const $ = (q, scope = document) => scope.querySelector(q);
  const $$ = (q, scope = document) => Array.from(scope.querySelectorAll(q));
  let properties = [];
  let catalogueMode = 'offline'; // 'live' or 'offline'
  const config = window.EMS_CONFIG || {};
  const params = new URLSearchParams(window.location.search);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cityLabels = {Tanger:'Tanger',Tetouan:'Tétouan',Martil:'Martil',Mdiq:'M’diq',Fnideq:'Fnideq'};
  const fmt = amount => new Intl.NumberFormat('fr-FR', {maximumFractionDigits:0}).format(amount) + ' DH';
  const escapeHTML = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const fallback = 'assets/images/architecture.svg';
  let favorites = new Set();
  try { favorites = new Set(JSON.parse(localStorage.getItem('ems-favorites') || '[]')); } catch (_) { favorites = new Set(); }
  const saveFavorites = () => { try { localStorage.setItem('ems-favorites', JSON.stringify([...favorites])); } catch (_) {} };

  function initShell(){
    $$('.current-year').forEach(el => el.textContent = String(new Date().getFullYear()));
    const header = $('#header');
    const progress = $('.scroll-progress');
    let ticking = false;
    const onScroll = () => {
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if(header) header.classList.toggle('is-scrolled', window.scrollY > 24);
        if(progress){
          const denom = Math.max(document.documentElement.scrollHeight - innerHeight,1);
          progress.style.transform = `scaleX(${Math.max(0, Math.min(1, window.scrollY / denom))})`;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll',onScroll,{passive:true});
    onScroll();
    const toggle = $('.menu-toggle');
    const menu = $('.mobile-nav');
    if(toggle && menu){
      const close = () => {menu.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');};
      toggle.addEventListener('click',() => {const open = menu.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));});
      $$('.mobile-nav a').forEach(a => a.addEventListener('click', close));
      document.addEventListener('keydown',event => {if(event.key==='Escape') close();});
      document.addEventListener('click',event => {if(!menu.contains(event.target) && !toggle.contains(event.target)) close();});
    }
    if('IntersectionObserver' in window && !reducedMotion){
      const observer = new IntersectionObserver(entries => {for(const entry of entries) if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}, {threshold:.075,rootMargin:'0px 0px 40px 0px'});
      $$('.reveal').forEach((el,i) => {el.style.transitionDelay = `${Math.min((i%3)*90,180)}ms`; observer.observe(el);});
    }else{$$('.reveal').forEach(el=>el.classList.add('in-view'));}
    if(!reducedMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
      $$('.magnetic').forEach(el => {
        el.addEventListener('pointermove', event => {
          const b=el.getBoundingClientRect();
          const x=(event.clientX-b.left-b.width/2)*.12;
          const y=(event.clientY-b.top-b.height/2)*.12;
          el.style.transform=`translate3d(${x}px,${y}px,0)`;
        });
        el.addEventListener('pointerleave',()=>{el.style.transform='';});
      });
    }
  }

  function updateFavoriteUI(){
    $$('.fav-count').forEach(el => el.textContent = String(favorites.size));
    $$('[data-favorite-id]').forEach(button => {
      const active=favorites.has(button.dataset.favoriteId);
      button.classList.toggle('is-saved',active);
      button.setAttribute('aria-pressed',String(active));
      button.setAttribute('aria-label',active?'Retirer des favoris':'Ajouter aux favoris');
    });
  }
  function toggleFavorite(id){
    if(favorites.has(id)) favorites.delete(id);else favorites.add(id);
    saveFavorites();updateFavoriteUI();
    document.dispatchEvent(new CustomEvent('ems-favorites-updated'));
  }
  document.addEventListener('click',e=>{
    const button = e.target.closest('[data-favorite-id]');
    if(!button)return;
    e.preventDefault();e.stopPropagation();toggleFavorite(button.dataset.favoriteId);
  });

  function card(p,index=0){
    const location = cityLabels[p.city] || p.city;
    const status = p.transaction==='Location'?'À LOUER':'À VENDRE';
    return `<article class="property-card reveal in-view" style="transition-delay:${Math.min(index*60,180)}ms">
      <a class="property-image-wrap" href="bien.html?id=${encodeURIComponent(p.id)}" aria-label="Découvrir ${escapeHTML(p.title)}">
        <img src="${escapeHTML(p.images[0])}" alt="${catalogueMode==='live'?'Photo du bien':'Photo illustrative'} : ${escapeHTML(p.title)}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${fallback}'">
        <span class="property-status ${p.new?'is-new':''}">${status}</span><span class="property-look" aria-hidden="true">↗</span>
      </a>
      <button class="property-fav ${favorites.has(p.id)?'is-saved':''}" type="button" data-favorite-id="${escapeHTML(p.id)}" aria-label="${favorites.has(p.id)?'Retirer des favoris':'Ajouter aux favoris'}" aria-pressed="${favorites.has(p.id)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.6c0 4.2-8.8 10.5-8.8 10.5S3.2 12.8 3.2 8.6a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z"/></svg></button>
      <div class="property-info"><div class="property-location">⌖ ${escapeHTML(location)} · ${escapeHTML(p.district)}</div><h3 class="property-name"><a href="bien.html?id=${encodeURIComponent(p.id)}">${escapeHTML(p.title)}</a></h3>
      <div class="property-specs"><span>▧ ${p.area} m²</span><span>⌂ ${p.beds} chambres</span><span>◇ ${p.baths} SDB</span></div>
      <div class="property-info-bottom"><span class="property-price">${fmt(p.price)}${p.transaction==='Location'?'<small> / mois</small>':''}</span><a class="property-details-link" href="bien.html?id=${encodeURIComponent(p.id)}">Voir le bien <span>↗</span></a></div></div>
    </article>`;
  }

  function initHero(){
    const hero = $('.hero');
    if(!hero) return;
    const slides = $$('.hero-slide',hero);
    if(slides.length){
      const label = $('.current-slide',hero),fill=$('.slide-progress-fill',hero);
      let active=0,timer;
      const setSlide=(n)=>{
        active=(n+slides.length)%slides.length;
        slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===active));
        if(label)label.textContent=String(active+1).padStart(2,'0');
        if(fill){fill.style.animation='none';void fill.offsetWidth;fill.style.animation='';}
      };
      const stop=()=>clearInterval(timer);
      const start=()=>{stop();if(!reducedMotion && !document.hidden)timer=setInterval(()=>setSlide(active+1),6800);};
      $('.hero-next',hero)?.addEventListener('click',()=>{setSlide(active+1);start();});
      $('.hero-prev',hero)?.addEventListener('click',()=>{setSlide(active-1);start();});
      hero.addEventListener('pointerenter',stop);
      hero.addEventListener('pointerleave',start);
      document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
      setSlide(0);start();
    }
    const canvas = $('#blueprint-canvas');
    if(canvas && !reducedMotion && window.matchMedia('(min-width:960px)').matches){
      const ctx=canvas.getContext('2d');
      if(ctx){
        let w=0,h=0,dpr=1,moveX=0,moveY=0,raf=0,frame=0;
        const resize=()=>{const r=hero.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);};
        const paint=()=>{
          frame++;
          if(frame%2===0){
            ctx.clearRect(0,0,w,h);
            ctx.strokeStyle='rgba(221,191,133,.16)';ctx.lineWidth=.7;ctx.setLineDash([4,9]);
            const x=w*.755+moveX*18,y=h*.53+moveY*12;
            for(let i=0;i<3;i++){const r=90+i*70;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();}
            ctx.setLineDash([]);ctx.strokeStyle='rgba(221,191,133,.25)';
            ctx.beginPath();ctx.moveTo(x-260,y);ctx.lineTo(x+260,y);ctx.moveTo(x,y-260);ctx.lineTo(x,y+260);ctx.stroke();
            const t=(Date.now()/1800)% (Math.PI*2);
            ctx.fillStyle='#d5b77b';ctx.beginPath();ctx.arc(x+160*Math.cos(t),y+160*Math.sin(t),3.5,0,Math.PI*2);ctx.fill();
          }
          raf=requestAnimationFrame(paint);
        };
        resize();paint();
        hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();moveX=(e.clientX-r.left)/r.width-.5;moveY=(e.clientY-r.top)/r.height-.5;});
        window.addEventListener('resize',resize,{passive:true});
        document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else if(!raf){paint();}});
      }
    }
    $$('.destination-card').forEach(cardEl => {
      const activate=()=>{$$('.destination-card').forEach(el=>el.classList.toggle('is-expanded',el===cardEl));};
      cardEl.addEventListener('pointerenter',activate);
      cardEl.addEventListener('focus',activate);
    });
    const feature=$('#featured-grid');
    if(feature){
      const featured = properties.filter(p=>p.featured).slice(0,4);
      feature.innerHTML=featured.length?featured.map(card).join(''):
        '<div class="empty-state" style="grid-column:1/-1;width:100%;max-width:none;text-align:center;padding:56px"><span style="color:#b59560;font-size:22px">✳</span><h3>Notre sélection arrive bientôt.</h3><p>De nouvelles adresses à découvrir très prochainement.</p><a href="biens.html">Explorer le catalogue ↗</a></div>';
      updateFavoriteUI();
    }
    const parallax=$('.fullbleed-image');
    if(parallax && !reducedMotion){
      let locked=false;
      const update=()=>{if(locked)return;locked=true;requestAnimationFrame(()=>{const rect=parallax.parentElement.getBoundingClientRect();const amt=(innerHeight/2-rect.top-rect.height/2)*.055;parallax.style.transform=`translateY(${Math.max(-65,Math.min(65,amt))}px)`;locked=false;});};
      window.addEventListener('scroll',update,{passive:true});update();
    }
  }

  function initCatalogue(){
    const grid=$('#catalogue-grid'),form=$('#catalogue-filters');
    if(!grid || !form)return;
    const city=$('#filter-city'),type=$('#filter-type'),transaction=$('#filter-transaction'),budget=$('#filter-budget'),onlyFav=$('#only-favorites'),sort=$('#sort-order');
    city.value=params.get('ville')||'';
    type.value=params.get('type')||'';
    transaction.value=params.get('transaction')||'';
    budget.value=params.get('budget')||'';
    onlyFav.checked=params.get('favoris')==='1';
    const render=()=>{
      let result=properties.filter(p=>{
        if(city.value && p.city!==city.value)return false;
        if(type.value && p.type!==type.value)return false;
        if(transaction.value && p.transaction!==transaction.value)return false;
        if(budget.value && p.price>Number(budget.value))return false;
        if(onlyFav.checked && !favorites.has(p.id))return false;
        return true;
      });
      if(sort.value==='price-asc')result.sort((a,b)=>a.price-b.price);
      if(sort.value==='price-desc')result.sort((a,b)=>b.price-a.price);
      if(sort.value==='area-desc')result.sort((a,b)=>b.area-a.area);
      $('#result-count').textContent = `${result.length} bien${result.length===1?'':'s'} disponible${result.length===1?'':'s'}${catalogueMode==='demo'?' en démonstration':''}${catalogueMode==='offline'?' · service indisponible':''}`;
      $('#active-filter-note').textContent = onlyFav.checked?'Votre sélection de favoris':'Une sélection à explorer';
      grid.innerHTML=result.length?result.map(card).join(''):
        `<div class="empty-state"><div style="font-size:42px;color:#b9965e">⌕</div><h3>Aucun bien trouvé</h3><p>Essayez une autre combinaison de critères ou réinitialisez les filtres.</p><a href="biens.html">Voir tous les biens ↗</a></div>`;
      updateFavoriteUI();
      const next=new URLSearchParams();
      if(city.value)next.set('ville',city.value);
      if(type.value)next.set('type',type.value);
      if(transaction.value)next.set('transaction',transaction.value);
      if(budget.value)next.set('budget',budget.value);
      if(onlyFav.checked)next.set('favoris','1');
      // The catalogue also works when opened directly from disk (file://).
      try { history.replaceState(null,'',`biens.html${next.toString()?'?'+next.toString():''}`); } catch (_) {}
    };
    form.addEventListener('submit',e=>{e.preventDefault();render();});
    [city,type,transaction,budget,onlyFav,sort].forEach(input=>input.addEventListener('change',render));
    form.addEventListener('reset',()=>{setTimeout(()=>{onlyFav.checked=false;sort.value='featured';render();},0);});
    document.addEventListener('ems-favorites-updated',render);
    render();
  }

  function initDetail(){
    const main=$('#property-detail');if(!main)return;
    const property=properties.find(p=>p.id===params.get('id'));
    if(!property){main.innerHTML=`<div class="container" style="padding:180px 0 100px;min-height:65vh"><span class="small-label dark-label">EMS AGENCY</span><h1 style="font:600 clamp(42px,6vw,80px)/1.1 var(--display)">Bien introuvable.</h1><p>Cette référence ne figure pas dans notre catalogue.</p><a class="agency-cta" href="biens.html">Retour aux annonces ↗</a></div>`;return;}
    document.title=`${property.title} | EMS Agency`;
    const location=cityLabels[property.city]||property.city;
    const photo=(src,index)=>`<button class="detail-photo" type="button" data-photo="${index}" aria-label="Agrandir la photo ${index+1}"><img src="${escapeHTML(src)}" alt="${catalogueMode==='live'?'Vue':'Vue illustrative'} ${index+1} de ${escapeHTML(property.title)}" loading="${index?'lazy':'eager'}" onerror="this.onerror=null;this.src='${fallback}'">${index===0?'<span class="detail-photo-label">GALERIE / CLIQUEZ POUR AGRANDIR ↗</span>':''}</button>`;
    main.innerHTML=`<div class="detail-top container"><div class="breadcrumbs"><a href="index.html">Accueil</a><span>↗</span><a href="biens.html">Nos biens</a><span>↗</span><b>${escapeHTML(property.title)}</b></div>
      <div class="detail-top-heading"><div><span>${escapeHTML(property.type.toUpperCase())} · ${escapeHTML(property.transaction.toUpperCase())} · ${escapeHTML(property.ref)}</span><h1>${escapeHTML(property.title)}</h1><p>⌖ ${escapeHTML(location)} · ${escapeHTML(property.district)}</p></div><div class="detail-price">${fmt(property.price)}${property.transaction==='Location'?' / mois':''}</div></div></div>
      <div class="container"><div class="detail-gallery">${property.images.map(photo).join('')}</div>
      <div class="detail-layout"><div class="detail-primary"><section class="detail-section"><h2>À propos de ce bien</h2><p>${escapeHTML(property.description)}</p>${catalogueMode==='live'?'':'<p>Les photos et caractéristiques sont proposées pour présenter le concept graphique EMS Agency. Demandez une fiche vérifiée avant toute décision.</p>'}</section>
      <section class="detail-section"><h2>En quelques chiffres</h2><div class="detail-spec-grid"><div class="detail-spec-item"><strong>${property.area} m²</strong><span>Surface</span></div><div class="detail-spec-item"><strong>${property.beds}</strong><span>Chambres</span></div><div class="detail-spec-item"><strong>${property.baths}</strong><span>Salles de bain</span></div><div class="detail-spec-item"><strong>${escapeHTML(property.type)}</strong><span>Catégorie</span></div></div></section>
      <section class="detail-section"><h2>Les points forts</h2><ul class="detail-bullets">${property.features.map(f=>`<li>${escapeHTML(f)}</li>`).join('')}</ul></section></div>
      <aside class="detail-sidebar"><div class="inquiry-card"><span class="small-label">UN COUP DE CŒUR ?</span><h3>Faisons-en votre prochain chez-vous.</h3><p>Décrivez votre projet et précisez la référence ${escapeHTML(property.ref)} pour demander une information.</p>
      <a href="contact.html?bien=${encodeURIComponent(property.title+' ('+property.ref+')')}">Demander des informations <span>↗</span></a>
      <button type="button" data-favorite-id="${escapeHTML(property.id)}" aria-pressed="${favorites.has(property.id)}">♡ ${favorites.has(property.id)?'Retirer des favoris':'Ajouter aux favoris'}</button>
      </div></aside></div></div>`;
    const fav=$('[data-favorite-id]',main);
    const setFav=()=>{if(fav)fav.textContent=(favorites.has(property.id)?'♥ Retirer des favoris':'♡ Ajouter aux favoris');};
    document.addEventListener('ems-favorites-updated',setFav);
    updateFavoriteUI();
    // Clickable property gallery. Focus and Escape operate the same as pointer controls.
    let active=0;
    const lightbox=document.createElement('div');lightbox.className='lightbox';lightbox.hidden=true;
    const close=()=>{lightbox.hidden=true;lightbox.innerHTML='';document.body.style.overflow='';};
    const show=n=>{active=(n+property.images.length)%property.images.length;lightbox.hidden=false;lightbox.innerHTML=`<button type="button" class="lightbox-close" aria-label="Fermer">×</button><button type="button" class="lightbox-prev" aria-label="Photo précédente">←</button><img src="${escapeHTML(property.images[active])}" alt="Photo ${active+1} sur ${property.images.length}" onerror="this.onerror=null;this.src='${fallback}'"><button type="button" class="lightbox-next" aria-label="Photo suivante">→</button>`;document.body.style.overflow='hidden';$('.lightbox-close',lightbox).focus();};
    main.appendChild(lightbox);
    $$('.detail-photo',main).forEach(button=>button.addEventListener('click',()=>show(Number(button.dataset.photo))));
    lightbox.addEventListener('click',e=>{if(e.target===lightbox||e.target.closest('.lightbox-close'))close();else if(e.target.closest('.lightbox-prev'))show(active-1);else if(e.target.closest('.lightbox-next'))show(active+1);});
    document.addEventListener('keydown',e=>{if(lightbox.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(active-1);if(e.key==='ArrowRight')show(active+1);});
  }

  function initContact(){
    const form=$('#inquiry-form');if(!form)return;
    if(params.get('bien')) $('#contact-property').value=params.get('bien').slice(0,150);
    const status=$('#form-status');
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      if(!form.reportValidity())return;
      status.classList.remove('is-error');
      const values=Object.fromEntries(new FormData(form).entries());
      if(!config.formEndpoint){status.classList.add('is-error');status.textContent="Ce formulaire est une démonstration : aucun message n'a été envoyé. Configurez formEndpoint dans js/config.js pour activer l'envoi.";return;}
      const button=$('.form-submit',form);button.disabled=true;button.setAttribute('aria-busy','true');status.textContent='Envoi en cours…';
      try{
        const response=await fetch(config.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...values,source:'ems-agency-website',date:new Date().toISOString()})});
        if(!response.ok)throw new Error('http_'+response.status);
        status.textContent='Votre demande a été transmise. Nous vous répondrons dès que possible.';
        form.reset();
      }catch(_){status.classList.add('is-error');status.textContent="Impossible d'envoyer votre demande. Réessayez ou utilisez le contact direct de l'agence.";}
      finally{button.disabled=false;button.removeAttribute('aria-busy');}
    });
  }

  async function loadCatalogue() {
    try {
      const [{ queryItems }, { imgSrc }] = await Promise.all([import('/js/wix/items.js'), import('/js/wix/media.js')]);
      const response = await queryItems('EMSProperties', { limit: 100 });
      if(!response || !Array.isArray(response.items)) throw Error('Unexpected CMS data');
      properties = response.items.filter(p => p.status === 'published' && p.title && p.photo)
        .map(p => ({
          id: p._id, title: p.title || '', city: p.city || 'Tetouan', district: p.district || '',
          type: p.type || 'Appartement', transaction: p.transaction === 'Location' ? 'Location' : 'Vente',
          price: Number(p.price) || 0, area: Number(p.area) || 0, beds: Number(p.beds) || 0,
          baths: Number(p.baths) || 0, featured: !!p.featured, new: !!p.new,
          ref: p.ref || 'EMS',
          images: [...new Set(['photo','photo2','photo3','photo4','photo41','image',...Object.keys(p).filter(k=>/^(?:photo\d+|image\d+)$/.test(k) && !['photo','photo2','photo3','photo4','photo41','image'].includes(k)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}))].map(k=>imgSrc(p[k],1800,1200)).filter(url=>typeof url==='string' && /^https:\/\//i.test(url)))],
          description: p.description || '',
          features: String(p.features || '').split(',').map(x=>x.trim()).filter(Boolean)
        })).filter(p=>p.images.length);
      catalogueMode = 'live';
    } catch (error) {
      catalogueMode = 'offline';
      properties = [];
      console.error('Impossible de charger le catalogue EMS.',error);
    }
    document.querySelectorAll('.demo-note').forEach(note=>{
      note.hidden = catalogueMode === 'live';
      if(catalogueMode === 'offline') note.textContent = 'Catalogue momentanément indisponible. Veuillez réessayer.';
    });
    document.querySelectorAll('.footer-bottom > span').forEach(span=>{
      if(span.textContent.includes('Annonces et tarifs illustratifs.'))
        span.textContent = catalogueMode === 'live' ? 'Catalogue immobilier EMS Agency.' : 'Catalogue temporairement indisponible.';
    });
  }
  async function init(){
    initShell();updateFavoriteUI();
    const page=document.body.dataset.page;
    if(page==='contact')initContact();
    if(page==='home' || page==='catalogue' || page==='detail') await loadCatalogue();
    if(page==='home')initHero();
    if(page==='catalogue')initCatalogue();
    if(page==='detail')initDetail();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* Ambient pointer lighting and viewport-linked architectural depth. */
(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero=document.querySelector('.hero');
  if(hero){
    let raf=0;
    hero.addEventListener('pointermove',(e)=>{
      if(e.pointerType==='touch') return;
      if(raf)cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{
        const r=hero.getBoundingClientRect();
        hero.style.setProperty('--mouse-x',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
        hero.style.setProperty('--mouse-y',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
      });
    },{passive:true});
    let scrollLock=false;
    window.addEventListener('scroll',()=>{
      if(scrollLock)return;scrollLock=true;
      requestAnimationFrame(()=>{
        const rect=hero.getBoundingClientRect();
        if(rect.bottom>0 && rect.top<window.innerHeight){
          const scrolled=Math.min(Math.max(-rect.top,0),500);
          const inner=hero.querySelector('.hero-content');
          if(inner)inner.style.transform='translate3d(0,'+(scrolled*.13).toFixed(1)+'px,0)';
        }
        scrollLock=false;
      });
    },{passive:true});
  }
  document.addEventListener('pointermove',(e)=>{
    if(e.pointerType==='touch')return;
    const frame=e.target.closest('.property-image-wrap');
    if(!frame)return;
    const r=frame.getBoundingClientRect();
    frame.style.setProperty('--shine-x',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
    frame.style.setProperty('--shine-y',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
  },{passive:true});
})();
