/* EMS Agency: owner-managed text and photography from Wix CMS.
   Only pre-defined sections are editable; the layout stays protected. */
(async function(){
  'use strict';
  const page=document.body.dataset.page||'';
  const targets=(selector)=>Array.from(document.querySelectorAll(selector));
  const canon=(value)=>String(value||'').normalize('NFKD').replace(/[\p{M}\p{P}\p{S}\p{Z}]/gu,'').toLowerCase();
  try {
    const [{queryItems},{imgSrc}]=await Promise.all([
      import('/js/wix/items.js'),
      import('/js/wix/media.js')
    ]);
    const result=await queryItems('EMSPageContent',{limit:30});
    if(!result||!Array.isArray(result.items))return;
    const rows=new Map(result.items.map(x=>[String(x.slot||''),x]));
    const photoUrl=(v)=>{
      try{
        const raw=imgSrc(v,2000,1200);
        const u=new URL(raw);
        return u.protocol==='https:'&&['static.wixstatic.com','images.wixstatic.com'].includes(u.hostname)?u.href:'';
      }catch{return '';}
    };
    const setText=(selector,value)=>{
      const el=document.querySelector(selector);
      if(el&&typeof value==='string'&&value.trim())el.textContent=value.slice(0,1500);
    };
    const setTitle=(selector,item)=>{
      const el=document.querySelector(selector);
      if(!el||!item||typeof item.heading!=='string'||typeof item.accent!=='string')return;
      if(!item.heading.trim()||!item.accent.trim())return;
      const em=el.querySelector('em');
      const leading=el.firstChild?.textContent||'';
      if(canon(leading)===canon(item.heading)&&canon(em?.textContent)===canon(item.accent))return;
      const newEm=document.createElement('em');
      newEm.textContent=item.accent.slice(0,140);
      el.replaceChildren(document.createTextNode(item.heading.slice(0,140)),document.createElement('br'),newEm);
    };
    const setPhoto=(selector,item,asBackground)=>{
      const el=document.querySelector(selector);
      const url=photoUrl(item?.photo);
      if(!el||!url)return;
      if(asBackground)el.style.backgroundImage='url("'+url+'")';
      else el.src=url;
    };
    const setKicker=(selector,item)=>setText(selector,item?.kicker);
    const setDesc=(selector,item)=>setText(selector,item?.description);
    if(page==='home'){
      const hero=rows.get('home-hero');
      if(hero){
        setTitle('.hero-main h1',hero);
        setDesc('.hero-main >p',hero);
        if(hero.kicker){
          const label=document.querySelector('.hero-main .hero-label');
          if(label){
            const i=label.querySelector('i');
            label.replaceChildren();
            if(i)label.appendChild(i);
            label.appendChild(document.createTextNode(' '+hero.kicker.slice(0,110)));
          }
        }
      }
      const cinema=rows.get('home-cinema');
      if(cinema){
        setPhoto('.ems-cinema-picture img',cinema,false);
        setKicker('.ems-cinema-kicker',cinema);
        setTitle('#ems-cinema-title',cinema);
        setDesc('.ems-cinema-actionbar p',cinema);
      }
      const feature=rows.get('home-feature');
      if(feature){
        setKicker('.feature-inner .section-kicker',feature);
        setTitle('.feature-inner h2',feature);
        setDesc('.feature-inner >p',feature);
      }
      const ending=rows.get('home-contact');
      if(ending){
        setKicker('.ems-final-contact .contact-intro .section-kicker',ending);
        setTitle('.ems-final-contact .contact-intro h2',ending);
        setDesc('.ems-final-contact .contact-intro >p',ending);
      }
    }
    if(page==='biens'){
      const cover=rows.get('biens-hero');
      if(cover){
        setPhoto('.properties-hero .inner-hero-photo',cover,true);
        setKicker('.properties-hero .section-kicker',cover);
        setTitle('.properties-hero h1',cover);
        setDesc('.properties-hero .inner-hero-content >p',cover);
      }
    }
    if(page==='agence'||page==='agency'){
      const cover=rows.get('agency-hero');
      if(cover){
        setPhoto('.agency-hero .inner-hero-photo',cover,true);
        setKicker('.agency-hero .section-kicker',cover);
        setTitle('.agency-hero h1',cover);
        setDesc('.agency-hero .inner-hero-content >p',cover);
      }
      const story=rows.get('agency-story');
      if(story){
        setPhoto('.about-image img',story,false);
        setKicker('.about-copy .section-kicker',story);
        setTitle('.about-copy h2',story);
        setDesc('.about-copy p',story);
      }
    }
    if(page==='destinations'){
      const cover=rows.get('destinations-hero');
      if(cover){
        setPhoto('.dest-hero .inner-hero-photo',cover,true);
        setKicker('.dest-hero .section-kicker',cover);
        setTitle('.dest-hero h1',cover);
        setDesc('.dest-hero .inner-hero-content >p',cover);
      }
    }
    if(page==='contact'){
      const hero=rows.get('contact-hero');
      if(hero){
        setKicker('.contact-stage .contact-intro .section-kicker',hero);
        setTitle('.contact-stage .contact-intro h1',hero);
        setDesc('.contact-stage .contact-intro >p',hero);
      }
      const form=rows.get('contact-form');
      if(form){
        setKicker('.form-editorial .section-kicker',form);
        setTitle('.form-editorial h2',form);
        setDesc('.form-editorial >p',form);
      }
    }
    const social=rows.get('social-instagram');
    const href=social?.linkUrl;
    const display=social?.linkLabel;
    const validInstagram=()=>{
      try{
        const u=new URL(href);
        return u.protocol==='https:'&&
          (u.hostname==='www.instagram.com'||u.hostname==='instagram.com')&&
          /^\/[A-Za-z0-9._]+\/?$/.test(u.pathname);
      }catch{return false;}
    };
    if(validInstagram()){
      targets('[data-ems-instagram]').forEach(el=>{
        el.href=href;
        if(el.dataset.emsInstagram==='handle'&&typeof display==='string'&&display.trim()){
          el.textContent=display.slice(0,70)+' ↗';
        }
      });
    }
  }catch(error){
    console.warn('EMS Agency: current site text and default photographs retained',error);
  }
})();