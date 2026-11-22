/* EMS Agency — authentic password-protected content editor. Data lives on Netlify, not in localStorage. */
(() => {
  'use strict';
  const $ = (q, within=document) => within.querySelector(q);
  const $$ = (q, within=document) => [...within.querySelectorAll(q)];
  const API = '/.netlify/functions/';
  const state = { items:[], initialized:false, filter:'all', term:'', editingId:null,
    images:[], uploadCount:0, saving:false, opening:false };
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const money = value => new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0}).format(value||0)+' DH';
  const img = src => typeof src==='string' && src.startsWith('assets/') ? '../'+src : (src||'../assets/images/architecture.svg');
  let toastTimer;

  async function callAPI(endpoint, method='GET', payload, isForm=false) {
    const options = {method, credentials:'same-origin', cache:'no-store', headers:{'Accept':'application/json'}};
    if(isForm) options.body=payload;
    else if(payload !== undefined) {options.headers['Content-Type']='application/json';options.body=JSON.stringify(payload);}
    let response;
    try { response=await fetch(API+endpoint,options); }
    catch { throw new Error('Connexion impossible. Vérifiez votre connexion et le déploiement Netlify.'); }
    const data=await response.json().catch(()=>({}));
    if(!response.ok) {
      if(response.status===401 && endpoint!=='session') showLogin('Votre session a expiré. Reconnectez-vous.');
      throw new Error(data.error || `Erreur ${response.status}. Vérifiez la configuration Netlify.`);
    }
    return data;
  }
  function hideLoader(){ $('#loading-view').hidden=true; }
  function showLogin(message='') {
    hideLoader();$('#login-view').hidden=false;$('#dashboard-view').hidden=true;
    $('#login-message').textContent=message;
  }
  async function showDashboard() {
    hideLoader();$('#login-view').hidden=true;$('#dashboard-view').hidden=false;
    await refresh();
  }
  function toast(message) {
    const box=$('#toast');box.textContent=message;box.classList.add('shown');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.classList.remove('shown'),3900);
  }
  function editorMessage(message, good=false) {
    const box=$('#editor-message');box.textContent=message;box.style.color=good?'#47804b':'#a34d3c';
  }
  async function checkSession() {
    try {
      const data=await callAPI('session');
      if(!data.configured) return showLogin('Activation requise : configurez EMS_ADMIN_PASSWORD et EMS_SESSION_SECRET sur Netlify (voir le guide).');
      if(!data.authenticated) return showLogin();
      await showDashboard();
    } catch(e){showLogin(e.message+' Ouvrir seulement index.html ne suffit pas : il faut déployer les Functions Netlify.');}
  }
  async function refresh() {
    const data=await callAPI('admin-properties');
    state.items=Array.isArray(data.items)?data.items:[];
    state.initialized=Boolean(data.initialized);
    renderStats();renderList();
  }
  function renderStats() {
    const items=state.items;
    $('#stat-total').textContent=String(items.length).padStart(2,'0');
    $('#stat-published').textContent=String(items.filter(p=>p.status!=='draft').length).padStart(2,'0');
    $('#stat-featured').textContent=String(items.filter(p=>p.featured && p.status!=='draft').length).padStart(2,'0');
    $('#stat-drafts').textContent=String(items.filter(p=>p.status==='draft').length).padStart(2,'0');
    $('#sidebar-count').textContent=String(items.length).padStart(2,'0');
    $('#demo-banner').hidden=state.initialized;
    $('#last-updated').textContent=`${items.length} annonce${items.length>1?'s':''} dans votre espace`;
  }
  function filteredItems() {
    const q=state.term.toLocaleLowerCase('fr');
    return state.items.filter(p=> {
      if(state.filter==='published' && p.status==='draft')return false;
      if(state.filter==='draft' && p.status!=='draft')return false;
      return [p.title,p.ref,p.city,p.district].some(v=>String(v||'').toLocaleLowerCase('fr').includes(q));
    });
  }
  function renderList() {
    const items=filteredItems();
    $('#list-count').textContent=`${items.length} BIEN${items.length!==1?'S':''}`;
    const list=$('#property-list');
    if(!items.length) {
      list.innerHTML=`<div class="empty-list"><div class="empty-symbol">⌂</div><h3>${state.items.length?'Aucun résultat.':'Une page à écrire.'}</h3><p>${state.items.length?'Essayez une autre recherche ou un autre filtre.':'Votre collection est prête à accueillir son premier bien immobilier.'}</p><button type="button" data-action="create">＋ Ajouter un bien</button></div>`;
      return;
    }
    list.innerHTML=items.map(p=>`<article class="property-row ${state.editingId===p.id?'row-current':''}">
      <img class="row-cover" src="${esc(img(p.images?.[0]))}" alt="" loading="lazy" onerror="this.onerror=null;this.src='../assets/images/architecture.svg'">
      <div class="row-body"><div class="row-meta"><span>${esc(p.ref)}</span><span>·</span><span>${esc(p.city)}</span>${p.featured?'<span>✧ À LA UNE</span>':''}</div>
      <h3 title="${esc(p.title)}">${esc(p.title)}</h3><div class="row-bottom"><span class="row-price">${money(p.price)}</span><span>${esc(p.area)} m²</span><span>${esc(p.type)}</span></div></div>
      <div class="row-action"><span class="status-badge ${p.status==='draft'?'draft':'published'}">${p.status==='draft'?'◌ BROUILLON':'● PUBLIÉ'}</span><button type="button" class="edit-row" data-action="edit" data-id="${esc(p.id)}">Modifier ↗</button></div>
    </article>`).join('');
  }
  function toggleEditor(show) {
    $('#editor-panel').hidden=!show;
    $('.workspace').classList.toggle('has-editor',show);
    $('#nav-create').classList.toggle('active',show);
    $('#nav-properties').classList.toggle('active',!show);
    if(!show)state.editingId=null;
    renderList();
  }
  function openEditor(id=null) {
    const p=id?state.items.find(item=>item.id===id):null;
    if(id && !p)return toast('Ce bien est introuvable.');
    state.editingId=p?.id||null;
    state.images=[...(p?.images||[])];
    const form=$('#property-form');form.reset();
    const values=p||{ title:'',ref:'',city:'Tetouan',district:'',type:'Villa',transaction:'Vente',price:'',area:'',beds:3,baths:2,description:'',features:[],status:'draft',featured:false,new:true };
    for(const name of ['title','ref','city','district','type','transaction','price','area','beds','baths','description','status']) {
      form.elements.namedItem(name).value=values[name]??'';
    }
    form.elements.namedItem('features').value=(values.features||[]).join(', ');
    form.elements.namedItem('featured').checked=Boolean(values.featured);
    form.elements.namedItem('new').checked=Boolean(values.new);
    $('#editor-heading').innerHTML=p?'Modifier <em>ce bien.</em>':'Nouveau <em>bien.</em>';
    $('#editor-index').textContent=p?'PROPERTY EDITOR / MODIFICATION':'PROPERTY EDITOR / NEW LISTING';
    $('#delete-property').hidden=!p;
    $('#image-input').value='';
    $('#upload-status').textContent='';editorMessage('');
    toggleEditor(true);renderGallery();
    if(window.innerWidth<1100)$('#editor-panel').scrollIntoView({behavior:'smooth',block:'start'});
    else form.elements.namedItem('title').focus({preventScroll:true});
  }
  function renderGallery() {
    $('#editor-gallery').innerHTML=state.images.map((src,i)=>`<div class="gallery-item"><img src="${esc(img(src))}" alt="Photo ${i+1}" loading="lazy"><span class="gallery-label">${i===0?'COUVERTURE':String(i+1).padStart(2,'0')}</span><div class="gallery-tools"><button type="button" data-image-index="${i}" data-image-action="left" aria-label="Déplacer à gauche" ${i===0?'disabled':''}>←</button><button type="button" data-image-index="${i}" data-image-action="right" aria-label="Déplacer à droite" ${i===state.images.length-1?'disabled':''}>→</button><button type="button" data-image-index="${i}" data-image-action="remove" aria-label="Retirer la photo">×</button></div></div>`).join('');
  }
  async function compressImage(file) {
    if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Format non accepté : '+file.name);
    let bitmap;
    try{bitmap=await createImageBitmap(file);}catch{throw new Error('Impossible de lire : '+file.name);}
    try{
      const ratio=Math.min(1,1920/Math.max(bitmap.width,bitmap.height));
      const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));
      const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Compression indisponible.');
      ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
      let blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',0.84));
      if(!blob||blob.type!=='image/webp')blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.80));
      if(!blob||blob.size>3900000)blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.63));
      if(!blob||blob.size>3900000)throw new Error('Photo trop volumineuse : '+file.name);
      const extension=blob.type==='image/webp'?'webp':'jpg';
      return new File([blob],`ems-${Date.now()}.${extension}`,{type:blob.type});
    } finally {bitmap.close?.();}
  }
  async function addPhotos(files) {
    if(!files?.length)return;
    const selected=[...files].slice(0,Math.max(0,15-state.images.length));
    if(!selected.length)return toast('Maximum 15 photos par bien.');
    state.uploadCount++;
    const label=$('#upload-status'),button=$('#save-property');button.disabled=true;
    try{
      for(let i=0;i<selected.length;i++) {
        label.textContent=`Optimisation & upload : ${i+1} / ${selected.length}…`;
        const compressed=await compressImage(selected[i]);
        const form=new FormData();form.append('file',compressed);
        const response=await callAPI('upload','POST',form,true);
        state.images.push(response.url);renderGallery();
      }
      label.textContent=`✓ ${selected.length} photo${selected.length>1?'s':''} importée${selected.length>1?'s':''}. Enregistrez le bien pour publier les images.`;
      toast('Vos photos sont ajoutées à la galerie.');
    }catch(e){label.textContent='Erreur : '+e.message;toast(e.message);}
    finally{state.uploadCount=Math.max(0,state.uploadCount-1);button.disabled=state.uploadCount>0;$('#image-input').value='';}
  }
  function formDataProperty() {
    const form=$('#property-form');const data=new FormData(form);
    return {title:data.get('title'),ref:data.get('ref'),city:data.get('city'),district:data.get('district'),
      type:data.get('type'),transaction:data.get('transaction'),price:Number(data.get('price')),
      area:Number(data.get('area')),beds:Number(data.get('beds')),baths:Number(data.get('baths')),
      description:data.get('description'),features:String(data.get('features')||'').split(/[,\n]+/).map(s=>s.trim()).filter(Boolean),
      status:data.get('status'),featured:data.has('featured'),new:data.has('new'),images:[...state.images]};
  }
  async function saveProperty(e) {
    e.preventDefault();
    if(state.saving || state.uploadCount>0)return editorMessage('Attendez la fin de l’upload avant de publier.');
    const p=formDataProperty();
    if(p.status==='published' && !p.images.length)return editorMessage('Ajoutez au moins une photo pour publier cette annonce.');
    state.saving=true;const button=$('#save-property');button.disabled=true;editorMessage('Enregistrement en cours…',true);
    try {
      const result=await callAPI('admin-properties',state.editingId?'PUT':'POST',state.editingId?{id:state.editingId,property:p}:{property:p});
      await refresh();
      state.editingId=result.property.id;
      openEditor(state.editingId);
      editorMessage('✓ Enregistré. '+(p.status==='draft'?'Votre brouillon reste privé.':'Le bien est visible sur le site.'),true);
      toast('Bien enregistré avec succès.');
    } catch(error){editorMessage(error.message);toast(error.message);}
    finally{state.saving=false;button.disabled=false;}
  }
  async function deleteProperty() {
    if(!state.editingId)return;
    const p=state.items.find(it=>it.id===state.editingId);
    if(!confirm(`Supprimer définitivement « ${p?.title||'ce bien'} » du catalogue ?`))return;
    try{await callAPI('admin-properties','DELETE',{id:state.editingId});toggleEditor(false);await refresh();toast('Bien supprimé du catalogue.');}
    catch(e){editorMessage(e.message);}
  }
  async function setupCatalogue(action) {
    const isImport=action==='import-demo';
    if(!confirm(isImport?'Importer les 10 biens fictifs du site comme annonces modifiables ?':'Retirer les biens de démonstration du site et commencer avec un catalogue vide ?'))return;
    const items = isImport ? (window.EMS_PROPERTIES||[]).map(p=>({...p,status:'published'})) : undefined;
    try{
      await callAPI('admin-properties','POST',isImport?{action,items}:{action});
      await refresh();toast(isImport?'10 exemples importés. Modifiez leurs photos et leurs informations.':'Catalogue activé. Les exemples ne sont plus affichés.');
    } catch(e){toast(e.message);}
  }
  function bindEvents(){
    $('#login-form').addEventListener('submit',async event=>{
      event.preventDefault();const button=$('#login-button');button.disabled=true;
      $('#login-message').textContent='Vérification des accès…';
      try {await callAPI('session','POST',{action:'login',username:$('#username').value.trim(),password:$('#password').value});
        $('#password').value='';await showDashboard();}
      catch(e){$('#login-message').textContent=e.message;}
      finally{button.disabled=false;}
    });
    $('#toggle-password').addEventListener('click',()=>{
      const pass=$('#password');pass.type=pass.type==='password'?'text':'password';
      $('#toggle-password').textContent=pass.type==='password'?'Voir':'Masquer';
    });
    async function logout(){try{await callAPI('session','POST',{action:'logout'});}catch{}state.items=[];toggleEditor(false);showLogin('Vous êtes déconnecté.');}
    $('#logout-button').addEventListener('click',logout);
    $('#mobile-logout').addEventListener('click',logout);
    $('#add-property-btn').addEventListener('click',()=>openEditor());
    $('#nav-create').addEventListener('click',()=>openEditor());
    $('#nav-properties').addEventListener('click',()=>{toggleEditor(false);$('.workspace').scrollIntoView({behavior:'smooth',block:'start'});});
    $('#close-editor').addEventListener('click',()=>toggleEditor(false));
    $('#search-properties').addEventListener('input',e=>{state.term=e.target.value.trim();renderList();});
    $$('.filter-tabs button').forEach(button=>button.addEventListener('click',()=>{
      state.filter=button.dataset.filter;$$('.filter-tabs button').forEach(btn=>btn.classList.toggle('active',btn===button));renderList();
    }));
    $('#property-list').addEventListener('click',e=>{
      const button=e.target.closest('[data-action]');if(!button)return;
      if(button.dataset.action==='create')openEditor();
      if(button.dataset.action==='edit')openEditor(button.dataset.id);
    });
    $('#property-form').addEventListener('submit',saveProperty);
    $('#delete-property').addEventListener('click',deleteProperty);
    $('#editor-gallery').addEventListener('click',e=>{
      const button=e.target.closest('[data-image-action]');if(!button)return;
      const idx=Number(button.dataset.imageIndex),action=button.dataset.imageAction;
      if(action==='remove')state.images.splice(idx,1);
      else {const other=idx+(action==='left'?-1:1);if(other>=0&&other<state.images.length)[state.images[idx],state.images[other]]=[state.images[other],state.images[idx]];}
      renderGallery();
    });
    $('#image-input').addEventListener('change',e=>addPhotos(e.target.files));
    const zone=$('#upload-zone');
    zone.addEventListener('click',()=>$('#image-input').click());
    zone.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('#image-input').click();}});
    ['dragenter','dragover'].forEach(type=>zone.addEventListener(type,e=>{e.preventDefault();zone.classList.add('drag-over');}));
    ['dragleave','drop'].forEach(type=>zone.addEventListener(type,e=>{e.preventDefault();zone.classList.remove('drag-over');}));
    zone.addEventListener('drop',e=>addPhotos(e.dataTransfer.files));
    $('#import-demos').addEventListener('click',()=>setupCatalogue('import-demo'));
    $('#initialize-empty').addEventListener('click',()=>setupCatalogue('initialize-empty'));
  }
  document.addEventListener('DOMContentLoaded',()=>{bindEvents();checkSession();});
})();
