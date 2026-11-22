/* EMS Agency | WhatsApp Private Line · editorial direct-contact experience.
   Link opens WhatsApp only on user activation; never sends a message itself.
   FR / EN / ES / DE copy and draft are adapted to site's current language. */
(function(){
  'use strict';

  const NUMBER='212713253400';
  const ICON="<img class=\"ems-wa-official-logo\" src=\"https://static.pib.gov.in/WriteReadData/userfiles/socialmedianew/whatsapp1.png\" alt=\"\" aria-hidden=\"true\" decoding=\"async\">";
  const COPY={
    fr:{
      eyebrow:'EMS / LIGNE PRIVÉE',
      title:'WhatsApp',
      action:'Discuter sur WhatsApp',
      label:'Contacter EMS Agency sur WhatsApp au +212 713 25 34 00',
      panelLabel:'02 / CONCIERGERIE PRIVÉE',
      heading:'Un échange,',
      headingEm:'en direct.',
      description:'Pour une question ou une visite privée, parlons directement sur WhatsApp.',
      open:'OUVRIR WHATSAPP',
      message:"Bonjour EMS Agency, je souhaite échanger avec vous au sujet d’un projet immobilier."
    },
    en:{
      eyebrow:'EMS / PRIVATE LINE',
      title:'WhatsApp',
      action:'Chat on WhatsApp',
      label:'Contact EMS Agency on WhatsApp at +212 713 25 34 00',
      panelLabel:'02 / PRIVATE CONCIERGE',
      heading:'A personal',
      headingEm:'conversation.',
      description:'Have a question or want to arrange a private viewing? Let’s talk directly on WhatsApp.',
      open:'OPEN WHATSAPP',
      message:"Hello EMS Agency, I would like to discuss a real estate project with you."
    },
    es:{
      eyebrow:'EMS / LÍNEA PRIVADA',
      title:'WhatsApp',
      action:'Hablar por WhatsApp',
      label:'Contactar con EMS Agency por WhatsApp al +212 713 25 34 00',
      panelLabel:'02 / ATENCIÓN PRIVADA',
      heading:'Hablemos',
      headingEm:'directamente.',
      description:'Para cualquier consulta o visita privada, hablemos directamente por WhatsApp.',
      open:'ABRIR WHATSAPP',
      message:"Hola EMS Agency, me gustaría hablar sobre un proyecto inmobiliario."
    },
    de:{
      eyebrow:'EMS / PRIVATE LINIE',
      title:'WhatsApp',
      action:'Auf WhatsApp schreiben',
      label:'EMS Agency über WhatsApp unter +212 713 25 34 00 kontaktieren',
      panelLabel:'02 / PRIVATE BETREUUNG',
      heading:'Ein persönliches',
      headingEm:'Gespräch.',
      description:'Für Fragen oder eine private Besichtigung schreiben Sie uns direkt auf WhatsApp.',
      open:'WHATSAPP ÖFFNEN',
      message:"Guten Tag EMS Agency, ich möchte mit Ihnen über ein Immobilienprojekt sprechen."
    }
  };

  const makeHref=(language)=>'https://wa.me/'+NUMBER+'?text='+encodeURIComponent(COPY[language].message);
  function initialLanguage(){
    let lang='';
    try{
      lang=new URLSearchParams(location.search).get('lang')||'';
      if(!COPY[lang])lang=localStorage.getItem('ems-site-language-v1')||'';
    }catch(_){}
    if(!COPY[lang])lang=(document.documentElement.lang||'').toLowerCase().slice(0,2);
    return COPY[lang]?lang:'fr';
  }
  function create(){
    if(document.querySelector('[data-ems-whatsapp-contact]'))return;

    let contact=null;
    const editorial=document.querySelector('body[data-page="contact"] .contact-form-section .form-editorial');
    if(!editorial)return;
    if(editorial){
      contact=document.createElement('aside');
      contact.className='ems-wa-private-line';
      contact.setAttribute('data-ems-whatsapp-contact','');
      contact.setAttribute('data-no-translation','');
      contact.innerHTML=
        '<div class="ems-wa-private-top"><span class="ems-wa-private-kicker"></span>'+
          '<span class="ems-wa-private-mark" aria-hidden="true">✳</span></div>'+
        '<div class="ems-wa-private-content">'+
          '<h3><span class="ems-wa-private-title"></span> <em class="ems-wa-private-em"></em></h3>'+
          '<p class="ems-wa-private-description"></p>'+
        '</div>'+
        '<a class="ems-wa-private-action" target="_blank" rel="noopener noreferrer">'+
          '<span class="ems-wa-private-action-icon" aria-hidden="true">'+ICON+'</span>'+
          '<span class="ems-wa-private-action-text"></span>'+
          '<span class="ems-wa-private-action-arrow" aria-hidden="true">↗</span>'+
        '</a>'+
        '<div class="ems-wa-private-bottom"><span>EMS / WHATSAPP</span>'+
         '<span>+212 713 25 34 00</span></div>';
      editorial.appendChild(contact);
    }
    function update(language){
      const lang=COPY[language]?language:'fr';
      const c=COPY[lang];
      const href=makeHref(lang);
      if(contact){
        const action=contact.querySelector('.ems-wa-private-action');
        action.href=href;
        action.setAttribute('aria-label',c.label);
        contact.querySelector('.ems-wa-private-kicker').textContent=c.panelLabel;
        contact.querySelector('.ems-wa-private-title').textContent=c.heading;
        contact.querySelector('.ems-wa-private-em').textContent=c.headingEm;
        contact.querySelector('.ems-wa-private-description').textContent=c.description;
        contact.querySelector('.ems-wa-private-action-text').textContent=c.open;
      }
    }
    update(initialLanguage());
    document.addEventListener('ems:language-changed',function(event){
      update(event && event.detail && event.detail.language);
    });
    window.addEventListener('popstate',function(){update(initialLanguage())});
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',create,{once:true});
  }else create();
})();