/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'pizzeria-doc-lorenteggio',
    whatsapp: {
      number: '', // WhatsApp non dichiarato: si chiama (02 3293 8520 · 353 341 9125)
      message: '',
      ids: [],
    },
    /* Google (28/9/2026): lunedì 12–15:30 (la sera chiuso, «Chiuso il lunedì sera» sul loro Instagram);
       da martedì a domenica 12–15 e 19–23 */
    hours: {
      0: [['12:00', '15:00'], ['19:00', '23:00']],
      1: [['12:00', '15:30']],
      2: [['12:00', '15:00'], ['19:00', '23:00']],
      3: [['12:00', '15:00'], ['19:00', '23:00']],
      4: [['12:00', '15:00'], ['19:00', '23:00']],
      5: [['12:00', '15:00'], ['19:00', '23:00']],
      6: [['12:00', '15:00'], ['19:00', '23:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1100,
    EN: {
      "m.salta": "Skip to the regulations",
      "m.top": "Ristorante Pizzeria DOC, back to the top",
      "m.spec": "Meat and fish specialities",
      "m.nav": "The titles of the regulations",
      "m.lingua": "Language",
      "m.menu": "Open the index",
      "m.articoli": "Index of the articles",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "m.succ": "next article",
      "m.nota": "Note.",
      "m.avvertenza": "Warning:",
      "n.t1": "The pizza",
      "n.t2": "The kitchen",
      "n.t3": "The restaurant",
      "n.orari": "Hours",
      "t.prenota": "Book",
      "i.t1": "Title I · Of the pizza",
      "i.t2": "Title II · Of the kitchen",
      "i.t3": "Title III · Of the restaurant",
      "i.articoli": "Articles",
      "i.segue": "(continued)",
      "i.n2": "Title II",
      "i.nome2": "Of the kitchen",
      "i.motto2": "“Meat and fish specialities”, as the sign says.",
      "i.n3": "Title III",
      "i.nome3": "Of the restaurant",
      "i.motto3": "Via Lorenteggio 47, between Tolstoj and Piazza Frattini.",
      "a1.r": "The Pizza DOC",
      "a2.r": "Ingredients",
      "a3.r": "Types",
      "a4.r": "From the sea",
      "a5.r": "From the land",
      "a6.r": "Pasta, desserts and wine",
      "a7.r": "Where to eat it",
      "a8.r": "Inspections",
      "a9.r": "Hours and bookings",
      "al.r": "Photographs",
      "al.t": "Annex A · Photographs",
      "al.n": "Annex A",
      "fi.r": "Final provisions",
      "h.estremi": "House regulations · Via Lorenteggio, no. 47",
      "h.titolo": "Regulations on the pizza, the meat and the fish of the <b>Ristorante Pizzeria DOC</b>.",
      "h.vigore": "First anniversary:",
      "h.data": "Sunday 9 November 2025",
      "h.p1": "<span class=\"vc\">Having regard to</span> the oven, the dining room and the kitchen at Via Lorenteggio 47, Milan;",
      "h.p2": "<span class=\"vc\">considering</span> 172 reviews on Google, with an average rating of 4.7;",
      "h.p3": "the house adopts the following regulations.",
      "a1.c1": "The Pizza DOC is the house pizza. It is made as follows:",
      "a1.a": "the disc of dough is stretched;",
      "a1.b": "ricotta and cooked ham are laid along the edge;",
      "a1.c": "the crust is folded over the filling and closed;",
      "a1.d": "San Marzano DOP tomato is spread;",
      "a1.e": "fior di latte, sausage, gorgonzola and peppers are added;",
      "a1.f": "it goes into the oven.",
      "a1.nota": "«Ottima la DOC con cornicione farcito!» <span class=\"cit-tr\">(“The DOC with the stuffed crust is excellent!”)</span>",
      "r.google": "on Google",
      "f.titolo": "The Pizza DOC on the peel, seen from above",
      "f.desc": "A pizza on the floured wooden peel, made as article 1 says: the disc is stretched, ricotta and cooked ham are laid along the edge, the crust is folded over the filling, then tomato, fior di latte, sausage, gorgonzola and peppers; in the oven the crust puffs up and browns.",
      "f.esito": "Compliant with art. 1.",
      "f.rifai": "Another one, by the rules",
      "h.prenota": "Book",
      "h.orari": "Opening hours",
      "h.dove": "Where we are",
      "h.chiama": "Call",
      "h.cell": "Mobile",
      "h.strada": "Directions",
      "a2.c1": "Pizzas and calzoni are made only with <b>San Marzano DOP tomato</b> and <b>fior di latte mozzarella from Agerola</b>.",
      "a2.c2": "The Vesuvio gets the red and yellow Piennolo cherry tomatoes; the Pistacchina gets mortadella, pistachio pesto and chopped pistachios.",
      "a2.c3": "For everything else, what the house says about itself applies: «ingredienti freschi e di alta qualità» (fresh, high-quality ingredients), and «ogni piatto è un omaggio ai sapori della nostra terra» (every dish is a tribute to the flavours of our land).",
      "a.pomodorini": "A pizza with cherry tomatoes, black olives and fior di latte, with a high, spotted crust.",
      "c.pomodorini": "Cherry tomatoes, black olives and fior di latte.",
      "a.forno": "Golden loaves of bread in front of the glowing mouth of the mosaic oven.",
      "c.forno": "The mosaic oven: in front of its mouth, the bread.",
      "a3.c1": "<b>The classics</b>: Marinara, Margherita, Bufala, Napoli, Diavola, Ham and mushrooms, Four seasons, Four cheeses, Siciliana, Pugliese, Bismark.",
      "a3.c2": "<b>The specials</b>:",
      "a3.a": "<b>Pistacchina</b>: fior di latte, mortadella, pistachio pesto and chopped pistachios;",
      "a3.b": "<b>Vesuvio</b>: red and yellow Piennolo cherry tomatoes, anchovies;",
      "a3.c": "<b>Totò</b>: smoked provola and black pepper;",
      "a3.d": "<b>Crocchè</b>: fior di latte, cooked ham and potato croquettes;",
      "a3.e": "<b>Nerano</b>: courgette cream, courgettes, pancetta and grana;",
      "a3.f": "<b>Spilinga</b>: ’nduja, tomato and buffalo stracciatella;",
      "a3.g": "<b>Fornella</b>: smoked provola, knife-cut sausage and roast potatoes;",
      "a3.h": "<b>Sausage and friarielli</b>.",
      "a3.c3": "<b>The teams</b>: the Milan (spicy salami, onion, olives), the Inter (shrimps, rocket, grana) and the Juve (provola, cooked ham, spinach, gorgonzola) come out of the same oven.",
      "a3.c4": "<b>The stuffed ones</b>, fried or baked: the classic, the Masaniello (buffalo ricotta and Neapolitan salami), the Pulcinella, the friariello. And the focacce: house, ortolana, caprese, with prosciutto.",
      "a3.c5": "All of them can be taken away.",
      "a.pistacchina": "Two pizzas seen from above with slices of mortadella, chopped pistachios and basil.",
      "c.pistacchina": "The Pistacchina.",
      "a.crocche": "A white pizza with cooked ham, potato croquettes and basil, on the counter with the Christmas decorations.",
      "c.crocche": "The Crocchè.",
      "a.pescatora": "A seafood pizza: a ring of mussels, prawns, squid and basil.",
      "c.pescatora": "Seafood.",
      "a.crudo": "A pizza with prosciutto, rocket and mozzarella, held above the terrazzo floor.",
      "c.crudo": "Prosciutto, rocket and mozzarella.",
      "a.salmone": "A pizza with smoked salmon, rocket, cherry tomatoes and dollops of stracciatella.",
      "c.salmone": "Salmon, rocket, cherry tomatoes and stracciatella.",
      "a.salame": "A pizza with spicy salami, mushrooms and basil, with a spotted crust.",
      "c.salame": "Spicy salami and mushrooms.",
      "a4.c1": "<b>Starters</b>: tender octopus with potatoes, mussel soup and sauté, Tropea-style king prawns, warm mixed seafood.",
      "a4.c2": "<b>First courses</b>: the linguine DOC (lobster, mussels, clams and shrimps), linguine with lobster, spaghetti with seafood and with clams, seafood risotto, paccheri with seafood and tomato.",
      "a4.c3": "<b>Main courses</b>: mixed grilled fish, grilled king prawns, grilled sea bass or sea bream, Sicilian-style swordfish, salmon in a pistachio crust, turbot with artichokes and potatoes.",
      "a.grigliata": "Mixed grilled fish: squid rings, king prawns, steaks and fillets, with lemon.",
      "c.grigliata": "Mixed grilled fish.",
      "a.cozze": "A dish of mussels, clams and squid in tomato with a king prawn on top.",
      "c.cozze": "Mussels, clams and a king prawn.",
      "a.spaghetti": "Spaghetti with seafood, mussels and cherry tomatoes, in a grey bowl.",
      "c.spaghetti": "Spaghetti with seafood.",
      "a.paccherimare": "Paccheri with seafood and mussels, in the white fish-shaped dish.",
      "c.paccherimare": "Paccheri with seafood.",
      "a.gamberoni": "Butterflied grilled king prawns arranged in a circle with lemon.",
      "c.gamberoni": "Grilled king prawns.",
      "a.pesce": "A whole grilled fish with lemon, carried through the dining room above the terrazzo floor.",
      "c.pesce": "Grilled fish.",
      "a5.c1": "<b>Starters</b>: mixed cold cuts, mixed cheeses, bresaola with rocket and grana, gnocco fritto with Parma ham, aubergine balls.",
      "a5.c2": "<b>Main courses</b>: the old-style rib steak with vegetables, the grilled rib steak, the tagliata (with rocket and grana or with porcini), beef fillet with green pepper, mixed grilled meat, the Milanese cutlet, the scaloppine.",
      "a5.c3": "The rib steak is served cooked the way you like it.",
      "a.costatagriglia": "A bone-in rib steak on the grill, with the dark grill marks.",
      "c.costatagriglia": "The rib steak on the grill.",
      "a.costataverdure": "The rib steak on an oval plate, surrounded by grilled courgettes, aubergines and peppers.",
      "c.costataverdure": "Rib steak with grilled vegetables.",
      "a.costata": "A grilled rib steak with lemon and parsley, on a white plate.",
      "c.costata": "The rib steak.",
      "a.cotoletta": "A golden Milanese cutlet as wide as the plate, with lemon.",
      "c.cotoletta": "Milanese cutlet.",
      "a.affettati": "The board of mixed cold cuts with cherry tomatoes, olives, rocket and a ring of grapes.",
      "c.affettati": "Mixed cold cuts.",
      "a.grigliapatate": "Grilled meat with roast potatoes, on a pale green plate.",
      "c.grigliapatate": "From the grill, with roast potatoes.",
      "a6.c1": "<b>First courses</b>: carbonara, amatriciana, pappardelle with ragù, paccheri with sausage and datterini tomatoes, gnocchi alla sorrentina, risotto alla milanese.",
      "a6.c2": "The desserts are homemade.",
      "a6.c3": "To drink, «una selezione di vini italiani» (a selection of Italian wines): Falanghina, Greco di Tufo, Ribolla Gialla, Chianti, Montepulciano d’Abruzzo, Valdobbiadene.",
      "a.amatriciana": "Spaghetti all’amatriciana on a white plate with a brown rim.",
      "c.amatriciana": "Spaghetti all’amatriciana.",
      "a.paccheri": "Paccheri in tomato sauce with parsley, on a rectangular plate.",
      "c.paccheri": "Paccheri in tomato sauce.",
      "a.torta": "A chocolate cake cut into slices, with chopped pistachios, hazelnuts and icing sugar.",
      "c.torta": "A homemade dessert.",
      "a7.c1": "<b>The dining room</b>: blue velvet armchairs, marble tables, the terrazzo floor. In the other room, white and blue tablecloths and bentwood chairs.",
      "a7.c2": "<b>Football matches</b> are shown on the big screen.",
      "a7.c3": "<b>Takeaway</b>: the pizza is collected at the counter. <b>Delivery</b>: with <a href=\"https://deliveroo.it/it/menu/milano/giambellino-moncucco/ristorante-pizzeria-doc-lorenteggio\" target=\"_blank\" rel=\"noopener\">Deliveroo</a> and <a href=\"https://www.justeat.it/restaurants-pizza-doc---pizzeria-napoletana-contemporanea/menu\" target=\"_blank\" rel=\"noopener\">Just Eat</a>.",
      "a7.c4": "<b>Birthdays, group dinners and parties</b> are arranged by phone.",
      "a.velluto": "A marble table set between four blue velvet armchairs, on the terrazzo floor.",
      "c.velluto": "Blue velvet and marble.",
      "a.tovaglie": "The other room: tables with white and blue tablecloths, bentwood chairs, the wines and the oven at the back.",
      "c.tovaglie": "The other room, with the oven at the back.",
      "a.asporto": "A pizza with grilled vegetables in the takeaway box.",
      "c.asporto": "Takeaway, in the box.",
      "a.feste": "The trays of a party: crostini, bresaola with oranges, smoked fish, seafood salad, prawn cocktail.",
      "c.feste": "A party: the trays.",
      "a8.c1": "Compliance with these regulations is checked by the customers.",
      "a8.c2": "Result:",
      "r.voto": "on Google, 172 reviews",
      "r.verbale": "Report",
      "r.s5": "5 stars out of 5",
      "r.s4": "4 stars out of 5",
      "r.m8": "8 months ago",
      "r.m9": "9 months ago",
      "r.m11": "11 months ago",
      "r.a1": "a year ago",
      "r.nota": "From the Google reviews, as they were written (in Italian).",
      "r.tutte": "All the reviews",
      "a9.c1": "The restaurant is open for lunch every day and for dinner from Tuesday to Sunday:",
      "o.cap": "Opening hours",
      "o.pranzo": "Lunch",
      "o.cena": "Dinner",
      "o.mappa": "Map: Ristorante Pizzeria DOC, Via Lorenteggio 47, Milan",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "a9.c2": "Bookings by phone: <a href=\"tel:+390232938520\" class=\"intero\">+39 02 3293 8520</a> or <a href=\"tel:+393533419125\" class=\"intero\">+39 353 341 9125</a>.",
      "a9.c3": "The restaurant is at Via Lorenteggio 47, 20146 Milan. The M4 metro stops at Tolstoj, 190 metres away, and at Frattini, 300 metres away; bus 58 stops 40 metres away, on Via Lorenteggio at the corner of Via Vignoli.",
      "a9.avv": "on Monday evenings the restaurant is closed.",
      "a.facciata": "The front at night: the illuminated signs RISTORANTE, PIZZERIA and DOC with the Italian tricolour, Christmas lights on the pillars.",
      "c.facciata": "The front, at night.",
      "a.apertura": "The front on opening day, at night, with columns of coloured balloons in front of the windows.",
      "c.apertura": "Opening day.",
      "a.bresaola": "A pizza with bresaola, rocket, cherry tomatoes and shavings of grana.",
      "c.bresaola": "Bresaola, rocket and grana.",
      "a.patatine": "A white pizza covered in chips, with two basil leaves.",
      "c.patatine": "With chips.",
      "q.1": "Is it open on Mondays?",
      "q.1r": "Yes, for lunch, from 12 to 3:30 pm. On Monday evenings it is closed; from Tuesday to Sunday it is also open in the evening, from 7 to 11 pm.",
      "q.2": "How do I book?",
      "q.2r": "By phone: +39 02 3293 8520 or +39 353 341 9125.",
      "q.3": "Do you do takeaway and delivery?",
      "q.3r": "Yes: the pizza is collected at the counter; delivery with Deliveroo and Just Eat.",
      "q.4": "Can we watch the match?",
      "q.4r": "Yes, on the big screen in the dining room.",
      "q.5": "Are there vegetarian dishes?",
      "q.5r": "Yes: among the pizzas the Margherita, the Marinara, the Parmigiana, the Vegetariana with grilled vegetables and the Liguria with pesto; among the pasta dishes, penne with pesto and with tomato.",
      "q.6": "How do I get there?",
      "q.6r": "By the M4 metro: Tolstoj is 190 metres away, Frattini 300. Bus 58 stops 40 metres away, on Via Lorenteggio at the corner of Via Vignoli.",
      "z.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · photos from the Google listing (by the restaurant and by customers) and from the restaurant’s Instagram, reviews from Google, the menu from Deliveroo and Just Eat (September 2026). The pizza on the peel is drawn.",
      "z.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ RISTORANTE PIZZERIA DOC — «Solo pomodoro San Marzano DOP e fiordilatte d'Agerola.» ══════════
     La pagina è il disciplinare della casa: intestazione dell'atto, premesse, Titoli, articoli, commi e lettere.
     la FIRMA — la Pizza DOC sulla pala, fatta come dice l'art. 1, lettera per lettera (l'evidenziatore passa sulla
     riga, poi resta la spunta): a) il disco si stende; b) ricotta e cotto lungo il bordo; c) il cornicione si chiude,
     lembo dopo lembo (la piega vista dall'alto: un punto a distanza r dal centro va a RF + (r − RF)·cos(π·p)); d) il
     pomodoro a spirale; e) fiordilatte, salsiccia, zola e peperoni; f) in forno: il bagliore, il cornicione si colora,
     le macchie, il formaggio si scioglie. «Conforme all'art. 1.»
     Stato finale = l'HTML/SVG. Senza JS e con reduced-motion: lo stato finale. L'attesa è la classe firma-attesa
     dell'head (il disco da stendere coi lembi aperti, via CSS), tolta dall'head dopo 2,5 s se il codice non arriva.
     Un rAF a tempo: la firma non dipende da GSAP. I dati vengono da _pdl_pizza.mjs. */
  var DATI = {"C":{"x":320,"y":316},"RF":212,"lembi":[{"a0":-1.396,"a1":-1.047,"esterno":[{"a":-1.396,"r":236.8},{"a":-1.371,"r":238.8},{"a":-1.346,"r":240.8},{"a":-1.321,"r":242.5},{"a":-1.297,"r":243.9},{"a":-1.272,"r":245},{"a":-1.247,"r":245.6},{"a":-1.222,"r":245.8},{"a":-1.197,"r":245.6},{"a":-1.172,"r":245},{"a":-1.147,"r":243.9},{"a":-1.122,"r":242.5},{"a":-1.097,"r":240.8},{"a":-1.072,"r":238.8},{"a":-1.047,"r":236.8}]},{"a0":-1.047,"a1":-0.698,"esterno":[{"a":-1.047,"r":233.7},{"a":-1.022,"r":235.7},{"a":-0.997,"r":237.6},{"a":-0.972,"r":239.3},{"a":-0.947,"r":240.8},{"a":-0.923,"r":241.8},{"a":-0.898,"r":242.5},{"a":-0.873,"r":242.7},{"a":-0.848,"r":242.5},{"a":-0.823,"r":241.8},{"a":-0.798,"r":240.8},{"a":-0.773,"r":239.3},{"a":-0.748,"r":237.6},{"a":-0.723,"r":235.7},{"a":-0.698,"r":233.7}]},{"a0":-0.698,"a1":-0.349,"esterno":[{"a":-0.698,"r":235.1},{"a":-0.673,"r":237.1},{"a":-0.648,"r":239},{"a":-0.623,"r":240.7},{"a":-0.598,"r":242.1},{"a":-0.573,"r":243.2},{"a":-0.549,"r":243.9},{"a":-0.524,"r":244.1},{"a":-0.499,"r":243.9},{"a":-0.474,"r":243.2},{"a":-0.449,"r":242.1},{"a":-0.424,"r":240.7},{"a":-0.399,"r":239},{"a":-0.374,"r":237.1},{"a":-0.349,"r":235.1}]},{"a0":-0.349,"a1":0,"esterno":[{"a":-0.349,"r":236.1},{"a":-0.324,"r":238.1},{"a":-0.299,"r":240},{"a":-0.274,"r":241.7},{"a":-0.249,"r":243.2},{"a":-0.224,"r":244.2},{"a":-0.199,"r":244.9},{"a":-0.175,"r":245.1},{"a":-0.15,"r":244.9},{"a":-0.125,"r":244.2},{"a":-0.1,"r":243.2},{"a":-0.075,"r":241.7},{"a":-0.05,"r":240},{"a":-0.025,"r":238.1},{"a":0,"r":236.1}]},{"a0":0,"a1":0.349,"esterno":[{"a":0,"r":234.7},{"a":0.025,"r":236.7},{"a":0.05,"r":238.6},{"a":0.075,"r":240.3},{"a":0.1,"r":241.8},{"a":0.125,"r":242.8},{"a":0.15,"r":243.5},{"a":0.175,"r":243.7},{"a":0.199,"r":243.5},{"a":0.224,"r":242.8},{"a":0.249,"r":241.8},{"a":0.274,"r":240.3},{"a":0.299,"r":238.6},{"a":0.324,"r":236.7},{"a":0.349,"r":234.7}]},{"a0":0.349,"a1":0.698,"esterno":[{"a":0.349,"r":234.6},{"a":0.374,"r":236.6},{"a":0.399,"r":238.5},{"a":0.424,"r":240.2},{"a":0.449,"r":241.6},{"a":0.474,"r":242.7},{"a":0.499,"r":243.4},{"a":0.524,"r":243.6},{"a":0.549,"r":243.4},{"a":0.573,"r":242.7},{"a":0.598,"r":241.6},{"a":0.623,"r":240.2},{"a":0.648,"r":238.5},{"a":0.673,"r":236.6},{"a":0.698,"r":234.6}]},{"a0":0.698,"a1":1.047,"esterno":[{"a":0.698,"r":233.3},{"a":0.723,"r":235.3},{"a":0.748,"r":237.2},{"a":0.773,"r":238.9},{"a":0.798,"r":240.3},{"a":0.823,"r":241.4},{"a":0.848,"r":242},{"a":0.873,"r":242.3},{"a":0.898,"r":242},{"a":0.923,"r":241.4},{"a":0.947,"r":240.3},{"a":0.972,"r":238.9},{"a":0.997,"r":237.2},{"a":1.022,"r":235.3},{"a":1.047,"r":233.3}]},{"a0":1.047,"a1":1.396,"esterno":[{"a":1.047,"r":235},{"a":1.072,"r":237},{"a":1.097,"r":238.9},{"a":1.122,"r":240.6},{"a":1.147,"r":242},{"a":1.172,"r":243.1},{"a":1.197,"r":243.7},{"a":1.222,"r":244},{"a":1.247,"r":243.7},{"a":1.272,"r":243.1},{"a":1.297,"r":242},{"a":1.321,"r":240.6},{"a":1.346,"r":238.9},{"a":1.371,"r":237},{"a":1.396,"r":235}]},{"a0":1.396,"a1":1.745,"esterno":[{"a":1.396,"r":233},{"a":1.421,"r":235},{"a":1.446,"r":236.9},{"a":1.471,"r":238.6},{"a":1.496,"r":240},{"a":1.521,"r":241.1},{"a":1.546,"r":241.8},{"a":1.571,"r":242},{"a":1.596,"r":241.8},{"a":1.621,"r":241.1},{"a":1.646,"r":240},{"a":1.671,"r":238.6},{"a":1.695,"r":236.9},{"a":1.72,"r":235},{"a":1.745,"r":233}]},{"a0":1.745,"a1":2.094,"esterno":[{"a":1.745,"r":235.5},{"a":1.77,"r":237.5},{"a":1.795,"r":239.4},{"a":1.82,"r":241.1},{"a":1.845,"r":242.6},{"a":1.87,"r":243.6},{"a":1.895,"r":244.3},{"a":1.92,"r":244.5},{"a":1.945,"r":244.3},{"a":1.97,"r":243.6},{"a":1.995,"r":242.6},{"a":2.02,"r":241.1},{"a":2.045,"r":239.4},{"a":2.069,"r":237.5},{"a":2.094,"r":235.5}]},{"a0":2.094,"a1":2.443,"esterno":[{"a":2.094,"r":236.7},{"a":2.119,"r":238.7},{"a":2.144,"r":240.6},{"a":2.169,"r":242.3},{"a":2.194,"r":243.7},{"a":2.219,"r":244.8},{"a":2.244,"r":245.4},{"a":2.269,"r":245.7},{"a":2.294,"r":245.4},{"a":2.319,"r":244.8},{"a":2.344,"r":243.7},{"a":2.369,"r":242.3},{"a":2.394,"r":240.6},{"a":2.419,"r":238.7},{"a":2.443,"r":236.7}]},{"a0":2.443,"a1":2.793,"esterno":[{"a":2.443,"r":234.7},{"a":2.468,"r":236.7},{"a":2.493,"r":238.6},{"a":2.518,"r":240.3},{"a":2.543,"r":241.7},{"a":2.568,"r":242.8},{"a":2.593,"r":243.5},{"a":2.618,"r":243.7},{"a":2.643,"r":243.5},{"a":2.668,"r":242.8},{"a":2.693,"r":241.7},{"a":2.718,"r":240.3},{"a":2.743,"r":238.6},{"a":2.768,"r":236.7},{"a":2.793,"r":234.7}]},{"a0":2.793,"a1":3.142,"esterno":[{"a":2.793,"r":234},{"a":2.817,"r":236},{"a":2.842,"r":237.9},{"a":2.867,"r":239.6},{"a":2.892,"r":241},{"a":2.917,"r":242.1},{"a":2.942,"r":242.8},{"a":2.967,"r":243},{"a":2.992,"r":242.8},{"a":3.017,"r":242.1},{"a":3.042,"r":241},{"a":3.067,"r":239.6},{"a":3.092,"r":237.9},{"a":3.117,"r":236},{"a":3.142,"r":234}]},{"a0":3.142,"a1":3.491,"esterno":[{"a":3.142,"r":235.2},{"a":3.167,"r":237.2},{"a":3.191,"r":239.1},{"a":3.216,"r":240.8},{"a":3.241,"r":242.2},{"a":3.266,"r":243.3},{"a":3.291,"r":243.9},{"a":3.316,"r":244.2},{"a":3.341,"r":243.9},{"a":3.366,"r":243.3},{"a":3.391,"r":242.2},{"a":3.416,"r":240.8},{"a":3.441,"r":239.1},{"a":3.466,"r":237.2},{"a":3.491,"r":235.2}]},{"a0":3.491,"a1":3.84,"esterno":[{"a":3.491,"r":236.9},{"a":3.516,"r":238.9},{"a":3.541,"r":240.8},{"a":3.565,"r":242.5},{"a":3.59,"r":243.9},{"a":3.615,"r":245},{"a":3.64,"r":245.7},{"a":3.665,"r":245.9},{"a":3.69,"r":245.7},{"a":3.715,"r":245},{"a":3.74,"r":243.9},{"a":3.765,"r":242.5},{"a":3.79,"r":240.8},{"a":3.815,"r":238.9},{"a":3.84,"r":236.9}]},{"a0":3.84,"a1":4.189,"esterno":[{"a":3.84,"r":233.7},{"a":3.865,"r":235.7},{"a":3.89,"r":237.6},{"a":3.915,"r":239.3},{"a":3.939,"r":240.7},{"a":3.964,"r":241.8},{"a":3.989,"r":242.5},{"a":4.014,"r":242.7},{"a":4.039,"r":242.5},{"a":4.064,"r":241.8},{"a":4.089,"r":240.7},{"a":4.114,"r":239.3},{"a":4.139,"r":237.6},{"a":4.164,"r":235.7},{"a":4.189,"r":233.7}]},{"a0":4.189,"a1":4.538,"esterno":[{"a":4.189,"r":235.9},{"a":4.214,"r":237.9},{"a":4.239,"r":239.8},{"a":4.264,"r":241.5},{"a":4.289,"r":243},{"a":4.313,"r":244},{"a":4.338,"r":244.7},{"a":4.363,"r":244.9},{"a":4.388,"r":244.7},{"a":4.413,"r":244},{"a":4.438,"r":243},{"a":4.463,"r":241.5},{"a":4.488,"r":239.8},{"a":4.513,"r":237.9},{"a":4.538,"r":235.9}]},{"a0":4.538,"a1":4.887,"esterno":[{"a":4.538,"r":234},{"a":4.563,"r":236},{"a":4.588,"r":237.9},{"a":4.613,"r":239.6},{"a":4.638,"r":241},{"a":4.663,"r":242.1},{"a":4.687,"r":242.8},{"a":4.712,"r":243},{"a":4.737,"r":242.8},{"a":4.762,"r":242.1},{"a":4.787,"r":241},{"a":4.812,"r":239.6},{"a":4.837,"r":237.9},{"a":4.862,"r":236},{"a":4.887,"r":234}]}],"tempi":{"a":[200,1000],"b":[1000,1900],"c":[1900,3400],"d":[3400,4300],"e":[4300,5500],"f":[5500,7000],"pezzo":260,"piega":520,"fior":[4300,4950],"salsiccia":[4550,5150],"zola":[4800,5300],"peperoni":[5000,5500],"bagliore":[5500,5900,6500,7000],"cuoce":[5700,6600],"macchie":[5900,6700],"scioglie":[5800,6600],"sugoCotto":[5800,6500],"esito":7000,"fine":7100},"stendi":{"rot":-18,"scala":0.84}};
  var figuraP = document.getElementById('pala');
  var svgP = figuraP && figuraP.querySelector('.pala__svg');
  var q1 = function (sel) { return svgP ? svgP.querySelector(sel) : null; };
  var qa = function (sel, dove) { return (dove || svgP) ? [].slice.call((dove || svgP).querySelectorAll(sel)) : []; };
  var pizzaG = q1('#pizza');
  var lembiEl = qa('#lembi .lembo'), bordiEl = qa('#lembi .lembo__bordo');
  var lembiD0 = lembiEl.map(function (el) { return el.getAttribute('d'); });
  var bordiD0 = bordiEl.map(function (el) { return el.getAttribute('d'); });
  var ombraG = q1('#lembiOmbra'), cottiG = q1('#lembiCotti'), lucidiP = q1('#lucidi'), pizzichiP = q1('#pizzichi');
  var macchieG = q1('#macchie'), discoCotto = q1('#discoCotto'), sugoCotto = q1('#sugoCotto'), bagliore = q1('#bagliore');
  var spirale = q1('.spirale');
  var ripienoEl = qa('#ripieno .pezzo');
  var fiorEl = qa('.pezzo--fior'), salsEl = qa('.pezzo--salsiccia'), zolaEl = qa('.pezzo--zola'), pepEl = qa('.pezzo--peperone');
  var fiorCrudo = qa('.pezzo--fior .fior'), fiorSciolto = qa('.pezzo--fior .fior-sciolto');
  var macchieEl = qa('.macchia');
  var pezziTutti = ripienoEl.concat(fiorEl, salsEl, zolaEl, pepEl);
  var gruppiCottura = [cottiG, lucidiP, discoCotto, sugoCotto];
  var lettereEl = [].slice.call(document.querySelectorAll('.art1 .lettere > li'));
  var spunteEl = lettereEl.map(function (li) { return li.querySelector('.spunta'); });
  var esitoEl = document.querySelector('.pala__esito');
  var rifaiP = document.getElementById('rifaiPizza');
  var TP = DATI.tempi, C0 = DATI.C, RF = DATI.RF, LEMBI = DATI.lembi, ST = DATI.stendi;
  var PASSI = ['a', 'b', 'c', 'd', 'e', 'f'];
  var faseP = 'fatta', rafP = 0, guardiaP = 0, larghezzaAvvio = 0, corse = 0, ultimoP = [];
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var esce = function (t) { return 1 - Math.pow(1 - t, 3); };
  var dolce = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var r1 = function (n) { return Math.round(n * 10) / 10; };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var PP = function (q) { return r1(q[0]) + ' ' + r1(q[1]); };
  var polare = function (r, a) { return [C0.x + r * Math.cos(a), C0.y + r * Math.sin(a)]; };
  /* il lembo e il suo bordo piegati di p: la stessa proiezione del generatore */
  function dLembo(L, p) {
    var k = Math.cos(Math.PI * p), fuori = [], piega = [], M = L.esterno.length - 1;
    L.esterno.forEach(function (q) { fuori.push(PP(polare(RF + (q.r - RF) * k, q.a))); });
    for (var j = 0; j <= M; j++) piega.push(PP(polare(RF, L.a1 - (L.a1 - L.a0) * j / M)));
    return 'M' + fuori.join('L') + 'L' + piega.join('L') + 'Z';
  }
  function dBordo(L, p) {
    var k = Math.cos(Math.PI * p);
    return 'M' + L.esterno.map(function (q) { return PP(polare(RF + (q.r - RF) * k, q.a)); }).join('L');
  }
  function stendi(k) {
    var sc = ST.scala + (1 - ST.scala) * k, a = ST.rot * (1 - k);
    return 'translate(' + C0.x + 'px,' + C0.y + 'px) rotate(' + r1(a) + 'deg) scale(' + r3(sc) + ') translate(' + (-C0.x) + 'px,' + (-C0.y) + 'px)';
  }
  /* la guardia: se i fotogrammi smettono di arrivare per 1,5 s (scheda in background) la pagina va allo stato finale;
     si riarma a ogni fotogramma (#229) */
  function sorveglia() { clearTimeout(guardiaP); guardiaP = setTimeout(chiudiPizza, 1500); }
  /* la spirale del pomodoro disegnata fino a p: il trattino parte mezzo punto prima, niente puntino a p = 0 (#230) */
  function segna(el, p) {
    if (el.__p === p) return;
    el.__p = p;
    el.style.strokeDasharray = '100 101';
    el.style.strokeDashoffset = (100.5 * (1 - p)).toFixed(2);
  }
  /* un pezzo che cade sulla pizza: compare e si posa (più grande = più vicino, poi a posto) */
  function cade(g, q) {
    var dentro = g.firstElementChild;
    if (g.__q === q) return;
    g.__q = q;
    g.style.opacity = q > 0 ? Math.min(1, q * 2.2).toFixed(3) : '0';
    if (q > 0 && q < 1) dentro.setAttribute('transform', 'scale(' + r3(1 + 0.42 * (1 - esce(q))) + ')');
    else dentro.removeAttribute('transform');
  }
  function gruppo(els, fin, t) {
    var n = els.length, dur = 300;
    for (var i = 0; i < n; i++) cade(els[i], c01((t - (fin[0] + (n > 1 ? (fin[1] - fin[0] - dur) * i / (n - 1) : 0))) / dur));
  }
  function chiudiPizza() {
    cancelAnimationFrame(rafP); rafP = 0;
    clearTimeout(guardiaP);
    if (pizzaG) pizzaG.style.removeProperty('transform');
    lembiEl.forEach(function (el, i) { el.setAttribute('d', lembiD0[i]); el.style.removeProperty('fill'); });
    bordiEl.forEach(function (el, i) { el.setAttribute('d', bordiD0[i]); });
    ultimoP = [];
    [ombraG, pizzichiP, macchieG, bagliore].concat(gruppiCottura, fiorCrudo, fiorSciolto, macchieEl).forEach(function (el) { if (el) el.style.removeProperty('opacity'); });
    pezziTutti.forEach(function (g) { g.style.removeProperty('opacity'); g.__q = undefined; if (g.firstElementChild) g.firstElementChild.removeAttribute('transform'); });
    if (spirale) { spirale.style.removeProperty('stroke-dasharray'); spirale.style.removeProperty('stroke-dashoffset'); spirale.__p = undefined; }
    lettereEl.forEach(function (li) { li.style.removeProperty('--k'); li.style.removeProperty('--o'); });
    spunteEl.forEach(function (s) { if (s) s.style.removeProperty('opacity'); });
    if (esitoEl) esitoEl.style.removeProperty('visibility');
    if (figuraP) figuraP.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseP = 'fatta';
    if (rifaiP) rifaiP.disabled = false;
  }
  function fotogrammaPizza(t) {
    var k, i;
    /* a) il disco si stende */
    pizzaG.style.transform = stendi(esce(c01((t - TP.a[0]) / (TP.a[1] - TP.a[0]))));
    /* b) ricotta e cotto, in giro */
    var nr = ripienoEl.length;
    for (i = 0; i < nr; i++) cade(ripienoEl[i], c01((t - (TP.b[0] + (TP.b[1] - TP.b[0] - TP.pezzo) * i / (nr - 1))) / TP.pezzo));
    /* c) il cornicione si chiude: un'onda fa il giro dei lembi */
    for (i = 0; i < LEMBI.length; i++) {
      var s0 = TP.c[0] + (TP.c[1] - TP.c[0] - TP.piega) * i / (LEMBI.length - 1);
      var p = dolce(c01((t - s0) / TP.piega));
      if (p === ultimoP[i]) continue;
      ultimoP[i] = p;
      lembiEl[i].setAttribute('d', dLembo(LEMBI[i], p));
      bordiEl[i].setAttribute('d', dBordo(LEMBI[i], p));
      /* il lembo mostra la faccia di sopra finché non passa in piedi, poi quella di sotto */
      if (p < 0.5) lembiEl[i].style.fill = 'url(#g-pasta)'; else lembiEl[i].style.removeProperty('fill');
    }
    k = c01((t - (TP.c[1] - 350)) / 450);
    ombraG.style.opacity = k.toFixed(3); pizzichiP.style.opacity = k.toFixed(3);
    /* d) il pomodoro a spirale */
    segna(spirale, dolce(c01((t - TP.d[0]) / (TP.d[1] - TP.d[0]))));
    /* e) i condimenti */
    gruppo(fiorEl, TP.fior, t); gruppo(salsEl, TP.salsiccia, t); gruppo(zolaEl, TP.zola, t); gruppo(pepEl, TP.peperoni, t);
    /* f) in forno: il bagliore sale e scende, il cornicione si colora, le macchie, il formaggio si scioglie */
    var B = TP.bagliore;
    k = t < B[2] ? c01((t - B[0]) / (B[1] - B[0])) : 1 - c01((t - B[2]) / (B[3] - B[2]));
    bagliore.style.opacity = k.toFixed(3);
    k = dolce(c01((t - TP.cuoce[0]) / (TP.cuoce[1] - TP.cuoce[0])));
    gruppiCottura.forEach(function (el) { el.style.opacity = k.toFixed(3); });
    var nm = macchieEl.length;
    for (i = 0; i < nm; i++) macchieEl[i].style.opacity = c01((t - (TP.macchie[0] + (TP.macchie[1] - TP.macchie[0] - 260) * i / (nm - 1))) / 260).toFixed(3);
    k = dolce(c01((t - TP.scioglie[0]) / (TP.scioglie[1] - TP.scioglie[0])));
    fiorCrudo.forEach(function (el) { el.style.opacity = (1 - k).toFixed(3); });
    fiorSciolto.forEach(function (el) { el.style.opacity = k.toFixed(3); });
    /* le lettere dell'art. 1: l'evidenziatore passa sulla riga della fase, poi sbiadisce e resta la spunta */
    PASSI.forEach(function (X, j) {
      var w = TP[X], li = lettereEl[j];
      if (!li) return;
      var q = c01((t - w[0]) / (w[1] - w[0]));
      li.style.setProperty('--k', (q > 0 ? Math.min(1, q * 1.6) : 0).toFixed(3));
      li.style.setProperty('--o', (t < w[0] ? 0 : t < w[1] ? 1 : 1 - c01((t - w[1]) / 500)).toFixed(3));
      if (spunteEl[j]) spunteEl[j].style.opacity = c01((t - w[1] + 150) / 250).toFixed(3);
    });
    if (esitoEl && t >= TP.esito) esitoEl.style.removeProperty('visibility');
  }
  function avviaPizza() {
    /* dalla classe d'attesa agli stili in linea senza cambiare un pixel: il disco da stendere, i lembi aperti */
    pizzaG.style.transform = stendi(0);
    ultimoP = [];
    lembiEl.forEach(function (el, i) { el.setAttribute('d', dLembo(LEMBI[i], 0)); el.style.fill = 'url(#g-pasta)'; ultimoP[i] = 0; });
    bordiEl.forEach(function (el, i) { el.setAttribute('d', dBordo(LEMBI[i], 0)); });
    [ombraG, pizzichiP].concat(gruppiCottura).forEach(function (el) { el.style.opacity = '0'; });
    macchieG.style.opacity = '1';
    macchieEl.forEach(function (el) { el.style.opacity = '0'; });
    pezziTutti.forEach(function (g) { g.__q = undefined; cade(g, 0); });
    fiorCrudo.forEach(function (el) { el.style.opacity = '1'; });
    fiorSciolto.forEach(function (el) { el.style.opacity = '0'; });
    bagliore.style.opacity = '0';
    spirale.__p = undefined; segna(spirale, 0);
    lettereEl.forEach(function (li) { li.style.setProperty('--k', '0'); li.style.setProperty('--o', '0'); });
    spunteEl.forEach(function (s) { if (s) s.style.opacity = '0'; });
    if (esitoEl) esitoEl.style.visibility = 'hidden';
    root.classList.remove('firma-attesa');
    faseP = 'corre'; figuraP.setAttribute('data-firma', 'corre');
    larghezzaAvvio = window.innerWidth;
    if (rifaiP) rifaiP.disabled = true;
    var t0 = null, corsa = ++corse;
    function fotogramma(ts) {
      rafP = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseP !== 'corre' || corsa !== corse) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaPizza(t);
      if (t >= TP.fine) { chiudiPizza(); return; }
      sorveglia();
      rafP = requestAnimationFrame(fotogramma);
    }
    sorveglia();
    rafP = requestAnimationFrame(fotogramma);
  }
  function inVistaPala() {
    if (!svgP) return false;
    var r = svgP.getBoundingClientRect(), vh = window.innerHeight || 800;
    return r.top < vh * 0.85 && r.bottom > vh * 0.2;
  }

  /* l'indice degli articoli (e i titoli della testata) segnano dove ti trovi */
  var linkIndice = [].slice.call(document.querySelectorAll('.indice-atto a'));
  var bersagli = linkIndice.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var linkTitoli = [].slice.call(document.querySelectorAll('#mainNav a'));
  var titoliDi = function (id) { return /^art[123]$/.test(id) ? 0 : /^art[456]$/.test(id) ? 1 : /^art[78]$/.test(id) ? 2 : id === 'art9' ? 3 : -1; };
  function aggiornaIndice() {
    var y = (document.getElementById('testata') || { offsetHeight: 64 }).offsetHeight + 60, ora = -1;
    for (var i = 0; i < bersagli.length; i++) { if (bersagli[i] && bersagli[i].getBoundingClientRect().top <= y) ora = i; }
    linkIndice.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    var tt = ora >= 0 && bersagli[ora] ? titoliDi(bersagli[ora].id) : -1;
    linkTitoli.forEach(function (a, k) { if (k === tt) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickIndice = 0;
  window.addEventListener('scroll', function () {
    if (tickIndice) return;
    tickIndice = requestAnimationFrame(function () { tickIndice = 0; aggiornaIndice(); });
  }, { passive: true });
  aggiornaIndice();

  /* lo stato degli orari anche nell'art. 9, col pallino verde quando è aperto */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  new MutationObserver(copiaStato).observe(root, { attributes: true, attributeFilter: ['lang'] });

  if (figuraP && svgP && pizzaG && lembiEl.length && bordiEl.length === lembiEl.length && spirale && ripienoEl.length && macchieG && bagliore) {
    try { clearTimeout(window.__attesaPizza); } catch (e) {}
    window.__pizza = {
      stato: function () { return { fase: faseP, trasformazione: pizzaG.style.transform || '' }; },
      tempi: TP,
    };
    var daFare = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su un articolo (#art9): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancora = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaPala();
    /* perché la firma è partita o no (lo legge il check) */
    window.__pizza.avvio = { daFare: daFare, ancora: !!ancora, inVista: inVista, top: svgP.getBoundingClientRect().top, vh: window.innerHeight };
    if (!daFare || ancora || !inVista) chiudiPizza();
    else avviaPizza();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () { if (faseP === 'corre' && Math.abs(window.innerWidth - larghezzaAvvio) > 1) chiudiPizza(); });
    if (rifaiP) rifaiP.addEventListener('click', function () { if (faseP === 'fatta' && !reducedMotion) avviaPizza(); });
  }
})();
