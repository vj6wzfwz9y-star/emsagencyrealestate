/* EMS Agency — four-language editorial experience. No external translation service. */
(function(){
  'use strict';
  const LANGUAGES = [
    {code:'fr',name:'Français',label:'FR'},
    {code:'en',name:'English',label:'EN'},
    {code:'es',name:'Español',label:'ES'},
    {code:'de',name:'Deutsch',label:'DE'}
  ];
  const FLAG_SVGS = {"fr":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 28\" aria-hidden=\"true\"><rect width=\"40\" height=\"28\" fill=\"#fff\"/><rect width=\"13.34\" height=\"28\" fill=\"#0055a4\"/><rect x=\"26.66\" width=\"13.34\" height=\"28\" fill=\"#ef4135\"/></svg>","en":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 28\" aria-hidden=\"true\"><rect width=\"40\" height=\"28\" fill=\"#012169\"/><path d=\"M-5 -3L45 31M45 -3L-5 31\" stroke=\"#fff\" stroke-width=\"9\"/><path d=\"M-5 -3L45 31M45 -3L-5 31\" stroke=\"#c8102e\" stroke-width=\"3.2\"/><path d=\"M20 -3V31M-3 14H43\" stroke=\"#fff\" stroke-width=\"10\"/><path d=\"M20 -3V31M-3 14H43\" stroke=\"#c8102e\" stroke-width=\"5\"/></svg>","es":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 28\" aria-hidden=\"true\"><rect width=\"40\" height=\"28\" fill=\"#aa151b\"/><rect y=\"7\" width=\"40\" height=\"14\" fill=\"#f1bf00\"/><rect x=\"11\" y=\"10\" width=\"4\" height=\"8\" rx=\".5\" fill=\"#aa151b\"/></svg>","de":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 28\" aria-hidden=\"true\"><rect width=\"40\" height=\"28\" fill=\"#ffce00\"/><rect width=\"40\" height=\"9.34\" fill=\"#151515\"/><rect y=\"9.34\" width=\"40\" height=\"9.34\" fill=\"#dd0000\"/></svg>"};
  const rows = [
    ["GLISSEZ POUR DÉCOUVRIR","SWIPE TO EXPLORE","DESLIZA PARA EXPLORAR","WISCHEN ZUM ENTDECKEN"],
    ["Photo précédente","Previous photo","Foto anterior","Vorheriges Foto"],
    ["Photo suivante","Next photo","Foto siguiente","Nächstes Foto"],
    ["Galerie du projet","Property gallery","Galería del proyecto","Projektgalerie"],
    ["Les lieux","Places","Lugares","Orte"],
    ["qui inspirent.","that inspire.","que inspiran.","die inspirieren."],
    ["MÉDITERRANÉE · MAROC","MEDITERRANEAN · MOROCCO","MEDITERRÁNEO · MARRUECOS","MITTELMEER · MAROKKO"],
    ["Fermer le menu","Close menu","Cerrar menú","Menü schließen"],
    ["UNE ATTENTION SUR MESURE","PERSONAL ATTENTION","ATENCIÓN A MEDIDA","INDIVIDUELLE BETREUUNG"],
    ["Faisons","Let's get","Vamos a","Lernen wir uns"],
    ["connaissance.","acquainted.","conocer.","kennen."],
    ["Chaque adresse commence par une rencontre.","Every home begins with a conversation.","Cada hogar empieza con un encuentro.","Jedes Zuhause beginnt mit einem Gespräch."],
    ["Votre nom *","Your name *","Su nombre *","Ihr Name *"],
    ["Adresse e-mail *","Email address *","Dirección de correo *","E-Mail-Adresse *"],
    ["Ville recherchée *","Preferred city *","Ciudad deseada *","Wunschstadt *"],
    ["Nature du projet *","Project type *","Tipo de proyecto *","Art des Vorhabens *"],
    ["Votre message *","Your message *","Su mensaje *","Ihre Nachricht *"],
    ["Parlez-nous de votre projet, de vos critères, de vos envies...","Tell us about your project and what you are looking for...","Cuéntenos su proyecto y qué está buscando...","Erzählen Sie uns von Ihrem Vorhaben und Ihren Wünschen..."],
    ["Accueil","Home","Inicio","Startseite"],
    ["Nos biens","Properties","Propiedades","Immobilien"],
    ["Destinations","Destinations","Destinos","Reiseziele"],
    ["L'agence","The agency","La agencia","Die Agentur"],
    ["L’agence","The agency","La agencia","Die Agentur"],
    ["Notre agence","Our agency","Nuestra agencia","Unsere Agentur"],
    ["Parlons de votre projet","Let's talk about your project","Hablemos de su proyecto","Sprechen wir über Ihr Projekt"],
    ["Contact","Contact","Contacto","Kontakt"],
    ["Espace privé","Private area","Área privada","Privater Bereich"],
    ["Espace privé ↗","Private area ↗","Área privada ↗","Privater Bereich ↗"],
    ["Voir les favoris","View favorites","Ver favoritos","Favoriten ansehen"],
    ["Mes favoris","My favorites","Mis favoritos","Meine Favoriten"],
    ["Favoris ♡","Favorites ♡","Favoritos ♡","Favoriten ♡"],
    ["Navigation principale","Main navigation","Navegación principal","Hauptnavigation"],
    ["Navigation mobile","Mobile navigation","Navegación móvil","Mobile Navigation"],
    ["Ouvrir le menu","Open menu","Abrir menú","Menü öffnen"],
    ["EMS Agency, accueil","EMS Agency, home","EMS Agency, inicio","EMS Agency, Startseite"],
    ["Mode clair","Light mode","Modo claro","Heller Modus"],
    ["Mode sombre","Dark mode","Modo oscuro","Dunkler Modus"],
    ["Activer le mode clair","Enable light mode","Activar modo claro","Hellen Modus aktivieren"],
    ["Activer le mode sombre","Enable dark mode","Activar modo oscuro","Dunklen Modus aktivieren"],
    ["EXPLORER","EXPLORE","EXPLORAR","ENTDECKEN"],
    ["CONNECTER","CONNECT","CONECTAR","KONTAKT"],
    ["Nous contacter","Contact us","Contáctenos","Kontaktieren Sie uns"],
    ["Instagram ↗","Instagram ↗","Instagram ↗","Instagram ↗"],
    ["RETOUR EN HAUT ↑","BACK TO TOP ↑","VOLVER ARRIBA ↑","NACH OBEN ↑"],
    ["DES LIEUX RARES. DES VIES SINGULIÈRES.","RARE PLACES. REMARKABLE LIVES.","LUGARES ÚNICOS. VIDAS EXTRAORDINARIAS.","SELTENE ORTE. BESONDERE LEBENSWEGE."],
    ["Une approche singulière de l’immobilier.","A distinctive approach to real estate.","Una visión singular del sector inmobiliario.","Ein besonderer Ansatz für Immobilien."],
    ["Entre mer, culture et architecture.","Between sea, culture and architecture.","Entre mar, cultura y arquitectura.","Zwischen Meer, Kultur und Architektur."],
    ["Nord du Maroc.","Northern Morocco.","Norte de Marruecos.","Nordmarokko."],
    ["EMS AGENCY. ALL RIGHTS RESERVED.","EMS AGENCY. ALL RIGHTS RESERVED.","EMS AGENCY. TODOS LOS DERECHOS RESERVADOS.","EMS AGENCY. ALLE RECHTE VORBEHALTEN."],
    ["L’ART DE VIVRE DANS LE NORD","THE ART OF LIVING IN THE NORTH","EL ARTE DE VIVIR EN EL NORTE","DIE KUNST, IM NORDEN ZU LEBEN"],
    ["Plus qu’un lieu.","More than a place.","Más que un lugar.","Mehr als ein Ort."],
    ["Une émotion.","A feeling.","Una emoción.","Ein Gefühl."],
    ["Des adresses choisies avec exigence. De Tanger à la côte méditerranéenne, l’immobilier comme un art de vivre.","Exceptional homes, carefully selected. From Tangier to the Mediterranean coast, real estate as a way of life.","Hogares elegidos con esmero. De Tánger a la costa mediterránea, el inmobiliario como arte de vivir.","Sorgfältig ausgewählte Immobilien. Von Tanger bis zur Mittelmeerküste: Wohnen als Lebenskunst."],
    ["Explorer nos biens","Explore our properties","Explorar propiedades","Immobilien entdecken"],
    ["Découvrir notre signature","Discover our vision","Descubrir nuestra esencia","Unsere Philosophie entdecken"],
    ["SCROLL POUR DÉCOUVRIR","SCROLL TO EXPLORE","DESLIZA PARA EXPLORAR","SCROLLEN ZUM ENTDECKEN"],
    ["01 / L’ESPRIT EMS","01 / THE EMS SPIRIT","01 / EL ESPÍRITU EMS","01 / DER EMS-GEIST"],
    ["L’ART DE CHOISIR UN LIEU","THE ART OF CHOOSING A PLACE","EL ARTE DE ELEGIR UN LUGAR","DIE KUNST, DEN RICHTIGEN ORT ZU FINDEN"],
    ["L’émotion","The feeling","La emoción","Das Gefühl"],
    ["avant l’adresse.","before the address.","antes que la dirección.","vor der Adresse."],
    ["Une lumière, un caractère, une sensation. Nous sélectionnons ces lieux qui font toute la différence.","A light, a character, a feeling. We curate the places that make all the difference.","Una luz, un carácter, una sensación. Seleccionamos lugares que marcan la diferencia.","Licht, Charakter, ein Gefühl. Wir wählen Orte, die den Unterschied machen."],
    ["DÉCOUVRIR NOTRE REGARD","DISCOVER OUR PERSPECTIVE","DESCUBRIR NUESTRA VISIÓN","UNSERE SICHTWEISE ENTDECKEN"],
    ["01 / UNE ÉMOTION À HABITER","01 / A FEELING TO LIVE IN","01 / UNA EMOCIÓN PARA HABITAR","01 / EIN GEFÜHL ZUM WOHNEN"],
    ["L’IMMOBILIER, AUTREMENT.","REAL ESTATE, DIFFERENTLY.","OTRA FORMA DE VIVIR EL INMOBILIARIO.","IMMOBILIEN NEU GEDACHT."],
    ["02 / PROPRIÉTÉS","02 / PROPERTIES","02 / PROPIEDADES","02 / IMMOBILIEN"],
    ["Notre sélection.","Our selection.","Nuestra selección.","Unsere Auswahl."],
    ["Votre horizon.","Your horizon.","Su horizonte.","Ihr Horizont."],
    ["Des maisons et villas choisies pour leur caractère, leur emplacement et leur singularité.","Homes and villas selected for their character, location and uniqueness.","Casas y villas elegidas por su carácter, ubicación y singularidad.","Häuser und Villen, ausgewählt wegen ihres Charakters, ihrer Lage und Einzigartigkeit."],
    ["TOUS LES BIENS","ALL PROPERTIES","TODAS LAS PROPIEDADES","ALLE IMMOBILIEN"],
    ["Notre collection arrive bientôt.","Our collection is coming soon.","Nuestra colección llegará pronto.","Unsere Kollektion folgt in Kürze."],
    ["Nous préparons les premières annonces. Contactez-nous pour nous parler de votre recherche.","We are preparing our first listings. Contact us to discuss what you are looking for.","Estamos preparando nuestros primeros anuncios. Contáctenos y cuéntenos qué busca.","Unsere ersten Angebote sind in Vorbereitung. Kontaktieren Sie uns zu Ihrer Immobiliensuche."],
    ["NOUS CONTACTER ↗","CONTACT US ↗","CONTÁCTENOS ↗","KONTAKTIEREN SIE UNS ↗"],
    ["DES LIEUX QUI ONT UNE ÂME","PLACES WITH SOUL","LUGARES CON ALMA","ORTE MIT SEELE"],
    ["LE NORD, AUTREMENT.","THE NORTH, REIMAGINED.","EL NORTE, DE OTRA MANERA.","DER NORDEN, NEU ERLEBT."],
    ["03 / LES DESTINATIONS","03 / DESTINATIONS","03 / DESTINOS","03 / REISEZIELE"],
    ["Cinq villes.","Five cities.","Cinco ciudades.","Fünf Städte."],
    ["Mille horizons.","Endless horizons.","Mil horizontes.","Tausend Horizonte."],
    ["Des ruelles de Tétouan aux rivages de M’diq, chaque destination révèle une nouvelle façon d’habiter le Nord.","From the alleys of Tétouan to the shores of M’diq, each destination offers a new way to experience the North.","De las callejuelas de Tetuán a las costas de M’diq, cada destino revela otra forma de vivir el Norte.","Von Tétouans Gassen bis zu den Küsten von M’diq: Jeder Ort zeigt eine neue Art, den Norden zu erleben."],
    ["ENTRE DEUX MERS","BETWEEN TWO SEAS","ENTRE DOS MARES","ZWISCHEN ZWEI MEEREN"],
    ["L’ART DE VIVRE","THE ART OF LIVING","EL ARTE DE VIVIR","DIE KUNST DES LEBENS"],
    ["DOUCEUR DU LITTORAL","COASTAL SERENITY","CALMA COSTERA","KÜSTENIDYLLE"],
    ["L’ESPRIT MARINA","MARINA LIFESTYLE","ESPÍRITU MARINA","MARINA-FLAIR"],
    ["L’HORIZON MÉDITERRANÉEN","THE MEDITERRANEAN HORIZON","EL HORIZONTE MEDITERRÁNEO","DER MITTELMEERHORIZONT"],
    ["EXPLORER LES DESTINATIONS","EXPLORE DESTINATIONS","EXPLORAR DESTINOS","REISEZIELE ENTDECKEN"],
    ["04 / L’EXPÉRIENCE EMS","04 / THE EMS EXPERIENCE","04 / LA EXPERIENCIA EMS","04 / DAS EMS-ERLEBNIS"],
    ["Le luxe de se sentir","The luxury of feeling","El lujo de sentirse","Der Luxus, sich"],
    ["chez soi.","at home.","en casa.","zu Hause zu fühlen."],
    ["Un regard singulier sur des biens uniques, et un accompagnement pensé autour de votre histoire.","An individual perspective on exceptional properties, with service shaped around your story.","Una mirada singular a propiedades únicas y un acompañamiento pensado para su historia.","Ein besonderer Blick auf einzigartige Immobilien – mit persönlicher Begleitung, die zu Ihrer Geschichte passt."],
    ["DÉCOUVRIR L’AGENCE","DISCOVER THE AGENCY","DESCUBRIR LA AGENCIA","DIE AGENTUR ENTDECKEN"],
    ["VOTRE HISTOIRE COMMENCE ICI","YOUR STORY STARTS HERE","SU HISTORIA EMPIEZA AQUÍ","IHRE GESCHICHTE BEGINNT HIER"],
    ["Entrons dans","Let's begin","Entremos en","Beginnen wir"],
    ["votre prochain","your next","su próximo","Ihr nächstes"],
    ["projet.","project.","proyecto.","Projekt."],
    ["votre prochain projet.","your next project.","su próximo proyecto.","Ihr nächstes Projekt."],
    ["Un échange, une visite privée, une sélection sur mesure. EMS Agency imagine une entrée en matière aussi élégante que les lieux que nous représentons.","A conversation, a private viewing, a curated selection. At EMS Agency, the first step is as thoughtful as the properties we represent.","Una conversación, una visita privada, una selección a medida. En EMS Agency, el primer paso es tan elegante como las propiedades que representamos.","Ein Gespräch, eine private Besichtigung, eine individuelle Auswahl. Bei EMS Agency ist schon der erste Schritt so stilvoll wie unsere Immobilien."],
    ["Planifier un échange","Schedule a conversation","Concertar una cita","Gespräch vereinbaren"],
    ["NOUS ÉCRIRE","WRITE TO US","ESCRÍBANOS","SCHREIBEN SIE UNS"],
    ["Parlez-nous de votre projet.","Tell us about your project.","Háblenos de su proyecto.","Erzählen Sie uns von Ihrem Projekt."],
    ["Résidence principale, investissement, pied-à-terre ou bien signature dans le Nord.","A primary home, an investment, a retreat or a signature property in the North.","Residencia habitual, inversión, segunda vivienda o propiedad exclusiva en el Norte.","Hauptwohnsitz, Investition, Zweitwohnsitz oder exklusive Immobilie im Norden."],
    ["Écoute attentive · Accompagnement sur mesure","Attentive listening · Tailored service","Atención personalizada · Servicio a medida","Wir hören zu · Individuelle Betreuung"],
    ["VISITE PRIVÉE","PRIVATE VIEWING","VISITA PRIVADA","PRIVATE BESICHTIGUNG"],
    ["ACCOMPAGNEMENT PERSONNALISÉ","PERSONALIZED SERVICE","ATENCIÓN PERSONALIZADA","INDIVIDUELLE BETREUUNG"],
    ["EMS AGENCY / LA COLLECTION","EMS AGENCY / THE COLLECTION","EMS AGENCY / LA COLECCIÓN","EMS AGENCY / DIE KOLLEKTION"],
    ["Des lieux à vivre.","Places to call home.","Lugares para vivir.","Orte zum Leben."],
    ["Des vies à imaginer.","Lives to imagine.","Vidas por imaginar.","Raum für neue Lebensentwürfe."],
    ["Parcourez notre sélection immobilière à Tanger, Tétouan et sur la côte méditerranéenne.","Explore our property selection in Tangier, Tétouan and along the Mediterranean coast.","Explore nuestra selección de inmuebles en Tánger, Tetuán y la costa mediterránea.","Entdecken Sie unsere Immobilien in Tanger, Tétouan und an der Mittelmeerküste."],
    ["01 / LES BIENS","01 / PROPERTIES","01 / PROPIEDADES","01 / IMMOBILIEN"],
    ["LA COLLECTION EMS","THE EMS COLLECTION","LA COLECCIÓN EMS","DIE EMS-KOLLEKTION"],
    ["Explorer les","Explore the","Explorar las","Entdecken Sie"],
    ["biens.","properties.","propiedades.","Immobilien."],
    ["— BIENS","— PROPERTIES","— PROPIEDADES","— IMMOBILIEN"],
    ["LOCALISATION","LOCATION","UBICACIÓN","STANDORT"],
    ["Toutes les villes","All cities","Todas las ciudades","Alle Städte"],
    ["TYPE DE BIEN","PROPERTY TYPE","TIPO DE INMUEBLE","IMMOBILIENTYP"],
    ["Tous les types","All types","Todos los tipos","Alle Typen"],
    ["Villa","Villa","Villa","Villa"],
    ["Appartement","Apartment","Apartamento","Wohnung"],
    ["Maison","House","Casa","Haus"],
    ["Penthouse","Penthouse","Ático","Penthouse"],
    ["Riad","Riad","Riad","Riad"],
    ["Terrain","Land","Terreno","Grundstück"],
    ["OPÉRATION","TRANSACTION","OPERACIÓN","VERMARKTUNG"],
    ["Achat & location","Buy & rent","Compra y alquiler","Kauf & Miete"],
    ["Vente","Sale","Venta","Verkauf"],
    ["Location","Rental","Alquiler","Vermietung"],
    ["BUDGET MAX","MAX BUDGET","PRESUPUESTO MÁX.","MAX. BUDGET"],
    ["Sans limite","No limit","Sin límite","Ohne Limit"],
    ["RECHERCHER","SEARCH","BUSCAR","SUCHEN"],
    ["Tous les biens","All properties","Todas las propiedades","Alle Immobilien"],
    ["À vendre","For sale","En venta","Zu verkaufen"],
    ["À louer","For rent","En alquiler","Zu vermieten"],
    ["TRIER PAR","SORT BY","ORDENAR POR","SORTIEREN NACH"],
    ["Notre sélection","Our selection","Nuestra selección","Unsere Auswahl"],
    ["Nouveautés","Newest","Novedades","Neueste"],
    ["Prix croissant","Price: low to high","Precio ascendente","Preis aufsteigend"],
    ["Prix décroissant","Price: high to low","Precio descendente","Preis absteigend"],
    ["Rien de disponible pour l’instant.","No properties available right now.","No hay propiedades disponibles por ahora.","Derzeit sind keine Immobilien verfügbar."],
    ["Notre collection évolue. Laissez-nous connaître vos envies et nous reviendrons vers vous.","Our collection keeps growing. Tell us what you are looking for and we will get back to you.","Nuestra colección sigue creciendo. Cuéntenos qué busca y nos pondremos en contacto.","Unser Angebot wächst. Teilen Sie uns Ihre Wünsche mit – wir melden uns bei Ihnen."],
    ["PARLER DE VOTRE PROJET","DISCUSS YOUR PROJECT","HABLAR DE SU PROYECTO","IHR PROJEKT BESPRECHEN"],
    ["EMS AGENCY / NOTRE VISION","EMS AGENCY / OUR VISION","EMS AGENCY / NUESTRA VISIÓN","EMS AGENCY / UNSERE VISION"],
    ["Bien plus","Much more","Mucho más","Weit mehr"],
    ["qu’une agence.","than an agency.","que una agencia.","als eine Agentur."],
    ["Le sens du lieu, le sens des rencontres. Et une vision de l'immobilier qui commence par l'humain.","A sense of place, a sense of connection. A human-first vision of real estate.","El valor de los lugares y de los encuentros. Una visión inmobiliaria que empieza por las personas.","Ein Gespür für Orte und Begegnungen. Eine Immobilienphilosophie, bei der Menschen im Mittelpunkt stehen."],
    ["01 / NOTRE SIGNATURE","01 / OUR SIGNATURE","01 / NUESTRA ESENCIA","01 / UNSERE HANDSCHRIFT"],
    ["L’élégance","The elegance","La elegancia","Die Eleganz"],
    ["de l’","of the","de lo","des"],
    ["de l’essentiel.","of simplicity.","esencial.","Wesentlichen."],
    ["EMS Agency imagine une autre manière de découvrir l’immobilier. Une manière plus sensible, plus précise, plus personnelle.","EMS Agency offers a different way to discover property: more intuitive, more precise, more personal.","EMS Agency propone otra forma de descubrir inmuebles: más sensible, más precisa y más personal.","EMS Agency bietet eine neue Art, Immobilien zu entdecken: einfühlsamer, präziser und persönlicher."],
    ["Nous mettons en lumière des lieux qui ont une identité, une architecture, un horizon. Des espaces dans lesquels on se projette avant même d’avoir les clés.","We bring to light places with identity, architecture and perspective. Spaces you can picture yourself in before you even hold the keys.","Damos protagonismo a lugares con identidad, arquitectura y horizonte. Espacios en los que uno se imagina viviendo antes de tener las llaves.","Wir zeigen Orte mit Identität, Architektur und Perspektive – Räume, in denen man sich zu Hause fühlt, noch bevor man den Schlüssel hat."],
    ["FAISONS CONNAISSANCE","LET'S GET ACQUAINTED","CONOZCÁMONOS","LERNEN WIR UNS KENNEN"],
    ["02 / CE QUI NOUS GUIDE","02 / WHAT GUIDES US","02 / LO QUE NOS GUÍA","02 / WAS UNS LEITET"],
    ["Une exigence.","One standard.","Una exigencia.","Ein Anspruch."],
    ["Trois convictions.","Three convictions.","Tres convicciones.","Drei Überzeugungen."],
    ["La singularité","Uniqueness","La singularidad","Einzigartigkeit"],
    ["Chaque propriété a sa propre histoire.","Every property has its own story.","Cada propiedad tiene su propia historia.","Jede Immobilie erzählt ihre eigene Geschichte."],
    ["La proximité","Local expertise","La cercanía","Regionale Nähe"],
    ["Une connaissance attentive de la région.","An attentive understanding of the region.","Un conocimiento profundo de la región.","Fundierte Kenntnis der Region."],
    ["La confiance","Trust","La confianza","Vertrauen"],
    ["Un accompagnement clair, à chaque étape.","Clear guidance at every step.","Un acompañamiento claro en cada etapa.","Transparente Begleitung bei jedem Schritt."],
    ["EMS AGENCY / LE NORD","EMS AGENCY / THE NORTH","EMS AGENCY / EL NORTE","EMS AGENCY / DER NORDEN"],
    ["Cinq destinations.","Five destinations.","Cinco destinos.","Fünf Reiseziele."],
    ["Un art de vivre.","A way of life.","Un arte de vivir.","Eine Lebensart."],
    ["La lumière, l'architecture, la mer. Découvrez les lieux qui dessinent notre univers.","Light, architecture, the sea. Discover the places that shape our world.","La luz, la arquitectura y el mar. Descubra los lugares que definen nuestro universo.","Licht, Architektur und Meer. Entdecken Sie die Orte, die unsere Welt prägen."],
    ["01 / CHOISIR SA DESTINATION","01 / CHOOSE YOUR DESTINATION","01 / ELIJA SU DESTINO","01 / IHR REISEZIEL WÄHLEN"],
    ["Le Nord,","The North,","El Norte,","Der Norden,"],
    ["sans limites.","without limits.","sin límites.","ohne Grenzen."],
    ["À chaque ville sa personnalité. De la vibration de Tanger à la douceur méditerranéenne de M'diq, découvrez les cinq territoires qui nous inspirent.","Every city has its own personality. From vibrant Tangier to the Mediterranean calm of M’diq, explore the five destinations that inspire us.","Cada ciudad tiene su personalidad. Del dinamismo de Tánger a la calma mediterránea de M’diq, explore los cinco destinos que nos inspiran.","Jede Stadt hat ihren eigenen Charakter. Vom lebhaften Tanger bis zur mediterranen Ruhe von M’diq: Entdecken Sie fünf inspirierende Orte."],
    ["01 / ENTRE DEUX MERS","01 / BETWEEN TWO SEAS","01 / ENTRE DOS MARES","01 / ZWISCHEN ZWEI MEEREN"],
    ["02 / L'ART DE VIVRE","02 / THE ART OF LIVING","02 / EL ARTE DE VIVIR","02 / DIE KUNST DES LEBENS"],
    ["03 / DOUCEUR DU LITTORAL","03 / COASTAL SERENITY","03 / CALMA COSTERA","03 / KÜSTENIDYLLE"],
    ["04 / L'ESPRIT MARINA","04 / MARINA LIFESTYLE","04 / ESPÍRITU MARINA","04 / MARINA-FLAIR"],
    ["05 / L'HORIZON MÉDITERRANÉEN","05 / THE MEDITERRANEAN HORIZON","05 / EL HORIZONTE MEDITERRÁNEO","05 / DER MITTELMEERHORIZONT"],
    ["EXPLORER ↗","EXPLORE ↗","EXPLORAR ↗","ENTDECKEN ↗"],
    ["01 / VOTRE DEMANDE","01 / YOUR INQUIRY","01 / SU SOLICITUD","01 / IHRE ANFRAGE"],
    ["Racontez-nous","Tell us about","Cuéntenos","Erzählen Sie uns"],
    ["votre recherche.","your search.","qué busca.","von Ihrer Suche."],
    ["Chaque projet commence par une conversation. Décrivez-nous le vôtre, nous prendrons le temps de vous répondre.","Every project begins with a conversation. Tell us about yours, and we will take the time to respond.","Cada proyecto comienza con una conversación. Cuéntenos el suyo y le responderemos con atención.","Jedes Projekt beginnt mit einem Gespräch. Erzählen Sie uns davon – wir nehmen uns Zeit für Ihre Antwort."],
    ["RÉGION","REGION","REGIÓN","REGION"],
    ["Tanger · Tétouan · Côte méditerranéenne","Tangier · Tétouan · Mediterranean coast","Tánger · Tetuán · Costa mediterránea","Tanger · Tétouan · Mittelmeerküste"],
    ["NOTRE PROMESSE","OUR PROMISE","NUESTRA PROMESA","UNSER VERSPRECHEN"],
    ["Une attention individuelle à chaque demande","Personal attention to every inquiry","Atención personalizada a cada solicitud","Persönliche Betreuung jeder Anfrage"],
    ["Préparation du formulaire…","Preparing the form…","Preparando el formulario…","Formular wird geladen…"],
    ["Le formulaire est temporairement fermé. Veuillez réessayer plus tard.","The form is temporarily closed. Please try again later.","El formulario está cerrado temporalmente. Inténtelo más tarde.","Das Formular ist vorübergehend geschlossen. Bitte versuchen Sie es später erneut."],
    ["Le formulaire est temporairement indisponible. Veuillez réessayer plus tard.","The form is temporarily unavailable. Please try again later.","El formulario no está disponible temporalmente. Inténtelo más tarde.","Das Formular ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut."],
    ["Message reçu.","Message received.","Mensaje recibido.","Nachricht erhalten."],
    ["Merci pour votre message. Nous reviendrons vers vous.","Thank you for your message. We will get back to you.","Gracias por su mensaje. Nos pondremos en contacto.","Vielen Dank für Ihre Nachricht. Wir melden uns bei Ihnen."],
    ["RETOUR À L’ACCUEIL ↗","BACK TO HOME ↗","VOLVER AL INICIO ↗","ZUR STARTSEITE ↗"],
    ["Sélectionner une option","Choose an option","Seleccione una opción","Bitte auswählen"],
    ["Envoyer ma demande","Send my inquiry","Enviar mi solicitud","Anfrage senden"],
    ["Envoyer","Send","Enviar","Senden"],
    ["Nom","Last name","Apellidos","Nachname"],
    ["Prénom","First name","Nombre","Vorname"],
    ["Nom complet","Full name","Nombre completo","Vollständiger Name"],
    ["Votre nom","Your name","Su nombre","Ihr Name"],
    ["Votre prénom","Your first name","Su nombre","Ihr Vorname"],
    ["Votre nom complet","Your full name","Su nombre completo","Ihr vollständiger Name"],
    ["E-mail","Email","Correo electrónico","E-Mail"],
    ["Email","Email","Correo electrónico","E-Mail"],
    ["Adresse e-mail","Email address","Correo electrónico","E-Mail-Adresse"],
    ["Votre e-mail","Your email","Su correo electrónico","Ihre E-Mail"],
    ["Téléphone","Phone","Teléfono","Telefon"],
    ["Numéro de téléphone","Phone number","Número de teléfono","Telefonnummer"],
    ["Votre téléphone","Your phone","Su teléfono","Ihre Telefonnummer"],
    ["Objet","Subject","Asunto","Betreff"],
    ["Message","Message","Mensaje","Nachricht"],
    ["Votre message","Your message","Su mensaje","Ihre Nachricht"],
    ["Comment pouvons-nous vous aider ?","How can we help you?","¿Cómo podemos ayudarle?","Wie können wir Ihnen helfen?"],
    ["Type de projet","Project type","Tipo de proyecto","Projektart"],
    ["Budget","Budget","Presupuesto","Budget"],
    ["Ville","City","Ciudad","Stadt"],
    ["Bien introuvable.","Property not found.","Propiedad no encontrada.","Immobilie nicht gefunden."],
    ["Cette annonce n’est plus disponible.","This listing is no longer available.","Este anuncio ya no está disponible.","Dieses Angebot ist nicht mehr verfügbar."],
    ["RETOUR AUX BIENS ↗","BACK TO PROPERTIES ↗","VOLVER A PROPIEDADES ↗","ZURÜCK ZU IMMOBILIEN ↗"],
    ["DÉCOUVRIR LE BIEN…","LOADING PROPERTY…","CARGANDO PROPIEDAD…","IMMOBILIE WIRD GELADEN…"],
    ["ACCUEIL","HOME","INICIO","STARTSEITE"],
    ["NOS BIENS","PROPERTIES","PROPIEDADES","IMMOBILIEN"],
    ["PROPRIÉTÉ","PROPERTY","PROPIEDAD","IMMOBILIE"],
    ["01 / GALERIE DU BIEN","01 / PROPERTY GALLERY","01 / GALERÍA","01 / IMMOBILIENGALERIE"],
    ["VOIR LES PHOTOS","VIEW PHOTOS","VER FOTOS","FOTOS ANSEHEN"],
    ["EMS AGENCY / CURATED PROPERTIES","EMS AGENCY / CURATED PROPERTIES","EMS AGENCY / PROPIEDADES SELECCIONADAS","EMS AGENCY / AUSGEWÄHLTE IMMOBILIEN"],
    ["LES DÉTAILS DU BIEN ↓","PROPERTY DETAILS ↓","DETALLES DE LA PROPIEDAD ↓","IMMOBILIENDETAILS ↓"],
    ["À PROPOS DE CE BIEN","ABOUT THIS PROPERTY","SOBRE ESTA PROPIEDAD","ÜBER DIESE IMMOBILIE"],
    ["Un lieu à découvrir.","A place to discover.","Un lugar por descubrir.","Ein Ort zum Entdecken."],
    ["chambres","bedrooms","habitaciones","Schlafzimmer"],
    ["salles de bain","bathrooms","baños","Badezimmer"],
    ["À LOUER","FOR RENT","EN ALQUILER","ZU VERMIETEN"],
    ["À VENDRE","FOR SALE","EN VENTA","ZU VERKAUFEN"],
    ["NOUVEAU","NEW","NUEVO","NEU"],
    ["PRIX DU BIEN","PROPERTY PRICE","PRECIO","IMMOBILIENPREIS"],
    ["PRIX SUR DEMANDE","PRICE ON REQUEST","PRECIO A CONSULTAR","PREIS AUF ANFRAGE"],
    ["Prix sur demande","Price on request","Precio a consultar","Preis auf Anfrage"],
    ["DÉCOUVRIR LE PROJET","EXPLORE THE PROJECT","DESCUBRIR EL PROYECTO","PROJEKT ENTDECKEN"],
    ["DÉTAILS SUR DEMANDE","DETAILS ON REQUEST","DETALLES A CONSULTAR","DETAILS AUF ANFRAGE"],
    ["CURATED / EMS AGENCY","CURATED / EMS AGENCY","SELECCIÓN / EMS AGENCY","AUSWAHL / EMS AGENCY"],
    ["03 / APERÇU DU PROJET","03 / PROJECT PREVIEW","03 / VISTA DEL PROYECTO","03 / PROJEKTEINBLICKE"],
    ["PLANIFIER UNE VISITE","SCHEDULE A VIEWING","CONCERTAR UNA VISITA","BESICHTIGUNG VEREINBAREN"],
    ["Contactez notre équipe pour en savoir plus sur ce bien.","Contact our team to learn more about this property.","Póngase en contacto con nuestro equipo para saber más sobre esta propiedad.","Kontaktieren Sie unser Team, um mehr über diese Immobilie zu erfahren."],
    ["À préciser","To be confirmed","Por confirmar","Noch anzugeben"],
    ["Piscine","Swimming pool","Piscina","Pool"],
    ["Balcon","Balcony","Balcón","Balkon"],
    ["Parking en sous-sol","Underground parking","Aparcamiento subterráneo","Tiefgarage"],
    ["Brouillon de démonstration. Remplacez les informations et ajoutez des photos vérifiées avant la publication.","Demo draft. Replace the details and add verified photos before publishing.","Borrador de demostración. Sustituya los datos y añada fotos verificadas antes de publicar.","Demoentwurf. Ersetzen Sie die Angaben und fügen Sie geprüfte Fotos vor der Veröffentlichung hinzu."],
    ["Découvrez notre projet immobilier Haut Standing à Martil, une résidence moderne offrant un cadre de vie élégant et confortable.","Discover our high-end property development in Martil, a contemporary residence designed for elegant, comfortable living.","Descubra nuestro proyecto residencial de alto nivel en Martil, una residencia moderna para disfrutar de un estilo de vida elegante y cómodo.","Entdecken Sie unser hochwertiges Wohnprojekt in Martil – eine moderne Residenz für stilvolles und komfortables Wohnen."],
    ["Appartements lumineux avec des superficies allant de 55 à 72 m², comprenant 2 à 3 chambres selon la configuration et une salle de bain.","Bright apartments ranging from 55 to 72 m², with two or three bedrooms depending on the layout and one bathroom.","Apartamentos luminosos de 55 a 72 m², con dos o tres dormitorios según la distribución y un baño.","Helle Wohnungen von 55 bis 72 m² mit zwei bis drei Schlafzimmern je nach Grundriss und einem Badezimmer."],
    ["La résidence dispose d'une piscine, de balcons et d'un parking en sous-sol, avec une architecture contemporaine et des finitions soignées.","The residence features a swimming pool, balconies and underground parking, with contemporary architecture and refined finishes.","La residencia cuenta con piscina, balcones y aparcamiento subterráneo, arquitectura contemporánea y acabados cuidados.","Die Wohnanlage bietet einen Pool, Balkone und eine Tiefgarage sowie zeitgemäße Architektur und hochwertige Ausstattungsdetails."],
    ["**Prix : À discuter.**","**Price: Negotiable.**","**Precio: A consultar.**","**Preis: Verhandelbar.**"],
    ["Prix : À discuter.","Price: Negotiable.","Precio: A consultar.","Preis: Verhandelbar."],
    ["Pour plus d'informations ou pour organiser une visite, contactez EMS Agency Real Estate au +212 7 13 25 34 00.","For more information or to arrange a viewing, contact EMS Agency Real Estate at +212 7 13 25 34 00.","Para obtener más información o concertar una visita, contacte con EMS Agency Real Estate en el +212 7 13 25 34 00.","Für weitere Informationen oder zur Vereinbarung eines Besichtigungstermins kontaktieren Sie EMS Agency Real Estate unter +212 7 13 25 34 00."],
    ["La singularité du lieu","A unique sense of place","La singularidad del lugar","Die Einzigartigkeit des Ortes"],
    ["Le catalogue est momentanément indisponible. Réessayez plus tard ou contactez-nous.","Our listings are temporarily unavailable. Please try again later or contact us.","Nuestro catálogo no está disponible temporalmente. Inténtelo más tarde o contáctenos.","Unsere Immobilienübersicht ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns."],
    ["DÉCOUVRIR","DISCOVER","DESCUBRIR","ENTDECKEN"],
    ["APPARTEMENT","APARTMENT","APARTAMENTO","WOHNUNG"],
    ["PROPRIÉTÉS","PROPERTIES","PROPIEDADES","IMMOBILIEN"],
    ["ÉDITION","EDITION","EDICIÓN","EDITION"],
    ["Référence","Reference","Referencia","Referenz"]
  ];
  const normalize = function(s){return String(s||'').replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();};
  const dictionary = new Map(rows.map(function(row){
    return [normalize(row[0]),{en:row[1],es:row[2],de:row[3]}];
  }));
  const titleRows = [
    ["L’art de bien vivre dans le Nord | EMS Agency","The art of living in Northern Morocco | EMS Agency","El arte de vivir en el norte de Marruecos | EMS Agency","Die Kunst des Wohnens in Nordmarokko | EMS Agency"],
    ["Nos biens immobiliers | EMS Agency","Our properties | EMS Agency","Nuestras propiedades | EMS Agency","Unsere Immobilien | EMS Agency"],
    ["Votre bien immobilier | EMS Agency","Property details | EMS Agency","Detalles de la propiedad | EMS Agency","Immobiliendetails | EMS Agency"],
    ["Notre agence | EMS Agency","Our agency | EMS Agency","Nuestra agencia | EMS Agency","Unsere Agentur | EMS Agency"],
    ["Nos destinations | EMS Agency","Our destinations | EMS Agency","Nuestros destinos | EMS Agency","Unsere Reiseziele | EMS Agency"],
    ["Contact & rendez-vous | EMS Agency","Contact & appointments | EMS Agency","Contacto y citas | EMS Agency","Kontakt & Termine | EMS Agency"]
  ];
  const titles = new Map(titleRows.map(function(row){return [normalize(row[0]),{en:row[1],es:row[2],de:row[3]}];}));
  const idxLabels = {
    en:{edition:'EDITION / ',photo:' PHOTO',photos:' PHOTOS',gallery:'PROPERTY GALLERY',discover:' PHOTOS TO EXPLORE ↗',enlarge:' PHOTOS · CLICK TO ENLARGE ↗',bedroom:' bedrooms',bathroom:' bathrooms',ref:'Reference: '},
    es:{edition:'EDICIÓN / ',photo:' FOTO',photos:' FOTOS',gallery:'GALERÍA',discover:' FOTOS PARA DESCUBRIR ↗',enlarge:' FOTOS · HAGA CLIC PARA AMPLIAR ↗',bedroom:' habitaciones',bathroom:' baños',ref:'Referencia: '},
    de:{edition:'EDITION / ',photo:' FOTO',photos:' FOTOS',gallery:'IMMOBILIENGALERIE',discover:' FOTOS ENTDECKEN ↗',enlarge:' FOTOS · ZUM VERGRÖSSERN KLICKEN ↗',bedroom:' Schlafzimmer',bathroom:' Badezimmer',ref:'Referenz: '}
  };
  let language = (function(){
    let saved = '';
    try{ saved=localStorage.getItem('ems-site-language-v1')||'';}catch(_){}
    let query='';
    try{query=new URLSearchParams(location.search).get('lang')||'';}catch(_){}
    const candidate = query || saved || 'fr';
    return LANGUAGES.some(function(v){return v.code===candidate;}) ? candidate : 'fr';
  })();
  const textRecords = new WeakMap();
  const attrRecords = new WeakMap();
  let selectorRoot=null, selectorButton=null, selectorPanel=null, observer=null, queued=false;
  const translate = function(original){
    if(language==='fr')return original;
    const input=normalize(original);
    if(!input)return original;
    const match=dictionary.get(input);
    if(match && match[language])return match[language];
    const labels=idxLabels[language];
    let m;
    if((m=input.match(/^(\d{1,3}) PHOTOS À DÉCOUVRIR ↗$/)))return m[1]+labels.discover;
    if((m=input.match(/^(\d{1,3}) PHOTOS · CLIQUEZ POUR AGRANDIR ↗$/)))return m[1]+labels.enlarge;
    if((m=input.match(/^ÉDITION \/ (\d+)$/)))return labels.edition+m[1];
    if((m=input.match(/^(\d+) BIENS?$/)))return m[1]+' '+(language==='en'?'PROPERTIES':language==='es'?'PROPIEDADES':'IMMOBILIEN');
    if((m=input.match(/^(\d+) CH\.$/)))return m[1]+' '+(language==='en'?'BED.':language==='es'?'HAB.':'SCHLAFZ.');
    if((m=input.match(/^(\d+) SDB\.$/)))return m[1]+' '+(language==='en'?'BATH.':language==='es'?'BAÑ.':'BAD.');
    if((m=input.match(/^([◧⌂]?\s*)(\d+) chambres?$/)))return m[1]+m[2]+labels.bedroom;
    if((m=input.match(/^([◧⌂]?\s*)(\d+) salles? de bain$/)))return m[1]+m[2]+labels.bathroom;
    if((m=input.match(/^Référence : (.+)$/)))return labels.ref+m[1];
    if((m=input.match(/^✳\s*(Piscine|Balcon|Parking en sous-sol)$/)))return '✳ '+(dictionary.get(m[1])||{})[language];
    if((m=input.match(/^Voir les photos de (.+)$/)))return (language==='en'?'View photos of ':language==='es'?'Ver fotos de ':'Fotos ansehen: ')+m[1];
    if((m=input.match(/^Découvrir (.+) — photo (\d+)$/)))return (language==='en'?'Explore ':language==='es'?'Descubrir ':'Entdecken: ')+m[1]+' · '+m[2];
    if((m=input.match(/^Agrandir la photo (\d+) sur (\d+) de (.+)$/)))return (language==='en'?'Enlarge photo ':language==='es'?'Ampliar foto ':'Foto vergrößern: ')+m[1]+' / '+m[2]+' · '+m[3];
    if((m=input.match(/^Photo (\d+) du bien (.+)$/)))return (language==='en'?'Property photo ':language==='es'?'Foto de la propiedad ':'Immobilienfoto ')+m[1]+' · '+m[2];
    if((m=input.match(/^Photo (\d+) sur (\d+)$/)))return (language==='en'?'Photo ':language==='es'?'Foto ':'Foto ')+m[1]+' / '+m[2];
    if((m=input.match(/^Photo (\d+) de (.+)$/)))return (language==='en'?'Photo ':language==='es'?'Foto ':'Foto ')+m[1]+' · '+m[2];
    if((m=input.match(/^(\d{2}) \/ GALERIE DU BIEN$/)))return m[1]+' / '+labels.gallery;
    if((m=input.match(/^([✳✦]\s+)(.+)$/))){
      const v=dictionary.get(m[2]);
      if(v&&v[language])return m[1]+v[language];
    }
    const arrow=input.match(/^(.*?)(\s+[↗↘→↓↑])$/);
    if(arrow){
      const v=dictionary.get(arrow[1]);if(v&&v[language])return v[language]+arrow[2];
    }
    return original;
  };
  function translateNode(node){
    if(!node || !node.parentElement)return;
    if(node.parentElement.closest('[data-ems-language-selector],script,style,noscript,textarea,[data-no-translation]'))return;
    const current=node.nodeValue;
    let st=textRecords.get(node);
    if(!st)st={original:current,rendered:current};
    else if(current!==st.rendered){st.original=current;st.rendered=current;}
    const raw=st.original;
    const core=normalize(raw);
    if(core && core.length<1400){
      const target=translate(core);
      const leading=(raw.match(/^\s*/)||[''])[0];
      const trailing=(raw.match(/\s*$/)||[''])[0];
      const result=target===core?raw:leading+target+trailing;
      if(node.nodeValue!==result)node.nodeValue=result;
      st.rendered=result;
    }
    textRecords.set(node,st);
  }
  const attributes=['placeholder','aria-label','title'];
  function translateAttributes(element){
    if(element.closest('[data-ems-language-selector],[data-no-translation]'))return;
    let saved=attrRecords.get(element)||{};
    for(const attr of attributes){
      if(!element.hasAttribute(attr))continue;
      const value=element.getAttribute(attr);
      let st=saved[attr];
      if(!st)st={original:value,rendered:value};
      else if(value!==st.rendered){st.original=value;st.rendered=value;}
      const translated=translate(st.original);
      if(value!==translated)element.setAttribute(attr,translated);
      st.rendered=translated;
      saved[attr]=st;
    }
    attrRecords.set(element,saved);
  }
  function rewriteLinks(){
    const links=document.querySelectorAll('a[href]');
    links.forEach(function(a){
      if(a.closest('[data-ems-language-selector]'))return;
      const href=a.getAttribute('href')||'';
      if(!href||href.charAt(0)==='#'||/^(mailto:|tel:|sms:|javascript:|data:)/i.test(href))return;
      try{
        const u=new URL(href,location.href);
        if(u.origin!==location.origin || !/\.html$|\/$/.test(u.pathname))return;
        if(u.searchParams.get('lang')===language)return;
        u.searchParams.set('lang',language);
        a.setAttribute('href',u.pathname.replace(/^.*\//,'')+u.search+u.hash);
      }catch(_){}
    });
  }
  function localizeTitle(){
    const title=document.title;
    if(!window.__emsOriginalPageTitle)window.__emsOriginalPageTitle=title;
    let base=window.__emsOriginalPageTitle;
    if(!titles.has(normalize(base)) && titles.has(normalize(title)))base=title;
    const row=titles.get(normalize(base));
    if(row && row[language])document.title=row[language];
    else if(language==='fr' && row)document.title=base;
  }
  function updateSelector(){
    if(!selectorRoot)return;
    document.documentElement.lang=language;
    selectorRoot.dataset.current=language;
    const names={fr:'Choisir la langue',en:'Choose language',es:'Elegir idioma',de:'Sprache wählen'};
    const headlines={fr:'CHOISISSEZ VOTRE LANGUE',en:'CHOOSE YOUR LANGUAGE',es:'ELIJA SU IDIOMA',de:'SPRACHE WÄHLEN'};
    const titles={fr:['Votre monde,','votre langue.'],en:['Your world,','your language.'],es:['Su mundo,','su idioma.'],de:['Ihre Welt,','Ihre Sprache.']};
    selectorButton.setAttribute('aria-label',names[language]);
    selectorPanel.querySelector('.ems-lang-label').textContent=headlines[language];
    selectorPanel.querySelector('.ems-lang-art-title-one').textContent=titles[language][0];
    selectorPanel.querySelector('.ems-lang-art-title-two').textContent=titles[language][1];
    selectorRoot.querySelectorAll('[data-select-language]').forEach(function(button){
      const selected=button.dataset.selectLanguage===language;
      button.setAttribute('aria-checked',String(selected));
      button.classList.toggle('is-current',selected);
      button.querySelector('.ems-lang-check').textContent=selected?'✓':'';
    });
  }
  function translateAll(){
    if(!document.body)return;
    if(observer)observer.disconnect();
    document.documentElement.lang=language;
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode()))translateNode(node);
    document.body.querySelectorAll('*').forEach(translateAttributes);
    rewriteLinks();
    localizeTitle();
    updateSelector();
    if(observer)observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['href','aria-label','title','placeholder']});
  }
  function schedule(){
    if(queued)return;
    queued=true;
    Promise.resolve().then(function(){queued=false;translateAll();});
  }
  function closeMenu(){
    if(!selectorRoot)return;
    selectorRoot.classList.remove('is-open');
    selectorButton.setAttribute('aria-expanded','false');
  }
  function setLanguage(next){
    if(!LANGUAGES.some(function(v){return v.code===next;}))return;
    language=next;
    try{localStorage.setItem('ems-site-language-v1',language);}catch(_){}
    try{
      const u=new URL(location.href);
      u.searchParams.set('lang',language);
      history.replaceState(history.state,'',u.pathname+u.search+u.hash);
    }catch(_){}
    closeMenu();
    translateAll();
    document.dispatchEvent(new CustomEvent('ems:language-changed',{detail:{language:language}}));
  }
  function createSelector(){
    const actions=document.querySelector('#global-header .head-actions');
    if(!actions || actions.querySelector('[data-ems-language-selector]'))return;
    const root=document.createElement('div');
    root.className='ems-lang-control';
    root.setAttribute('data-ems-language-selector','');
    root.innerHTML=
      '<button class="ems-lang-trigger" type="button" aria-haspopup="true" aria-expanded="false">'+
      '<span class="ems-lang-trigger-globe" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21M12 3C9.6 5.5 8.4 8.5 8.4 12S9.6 18.5 12 21"/></svg></span>'+
      '</button>'+
      '<div class="ems-lang-panel" role="group" aria-label="Language options">'+
        '<div class="ems-lang-art-top"><span>EMS <i>✳</i> INTERNATIONAL</span><span>01 — 04</span></div>'+
        '<div class="ems-lang-art-heading"><span class="ems-lang-label">CHOISISSEZ VOTRE LANGUE</span>'+
          '<span class="ems-lang-art-title"><span class="ems-lang-art-title-one">Votre monde,</span><em class="ems-lang-art-title-two">votre langue.</em></span>'+
        '</div>'+
        '<div class="ems-lang-art-options">'+LANGUAGES.map(function(lang,i){
          return '<button class="ems-lang-choice" type="button" data-select-language="'+lang.code+'" aria-checked="false" role="radio">'+
            '<span class="ems-lang-index">'+String(i+1).padStart(2,'0')+'</span>'+
            '<span class="ems-lang-flag" aria-hidden="true">'+FLAG_SVGS[lang.code]+'</span>'+
            '<span class="ems-lang-name">'+lang.name+'</span>'+
            '<span class="ems-lang-row-end"><span class="ems-lang-code">'+lang.label+'</span>'+
              '<span class="ems-lang-check" aria-hidden="true"></span></span></button>';
        }).join('')+'</div>'+
        '<div class="ems-lang-panel-foot"><span>EMS / GLOBAL EDITION</span><span class="ems-lang-foot-symbol" aria-hidden="true">✳</span></div>'+
      '</div>';
    const before=actions.querySelector('.fav-nav')||actions.querySelector('.head-cta')||actions.querySelector('.menu-btn');
    if(before)actions.insertBefore(root,before);
    else actions.appendChild(root);
    selectorRoot=root;
    selectorButton=root.querySelector('.ems-lang-trigger');
    selectorPanel=root.querySelector('.ems-lang-panel');
    selectorButton.addEventListener('click',function(event){
      event.stopPropagation();
      const opening=!root.classList.contains('is-open');
      root.classList.toggle('is-open',opening);
      selectorButton.setAttribute('aria-expanded',String(opening));
    });
    selectorPanel.addEventListener('click',function(event){
      const choice=event.target.closest('[data-select-language]');
      if(choice)setLanguage(choice.dataset.selectLanguage);
    });
    document.addEventListener('pointerdown',function(event){
      if(selectorRoot && !selectorRoot.contains(event.target))closeMenu();
    });
    document.addEventListener('keydown',function(event){
      if(event.key==='Escape' && root.classList.contains('is-open')){closeMenu();selectorButton.focus();}
      if((event.key==='ArrowDown'||event.key==='ArrowUp') && root.classList.contains('is-open')){
        const options=Array.from(root.querySelectorAll('.ems-lang-choice'));
        const index=options.indexOf(document.activeElement);
        const next=event.key==='ArrowDown'?(index+1)%options.length:(index<=0?options.length-1:index-1);
        options[next].focus();
        event.preventDefault();
      }
    });
    updateSelector();
  }
  function boot(){
    if(!document.body)return;
    createSelector();
    observer=new MutationObserver(schedule);
    translateAll();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  window.EMS_LANGUAGES={get current(){return language;},setLanguage:setLanguage,translate:translate};
})();
