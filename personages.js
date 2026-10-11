'use strict';
/* ====== Personages (illustraties ontworpen door de maker): portretten, dialogen, verhaallijnen per vak, Vrienden & leraren ====== */
const PERS={
 tilly:{n:'Tilly',rol:'Je klasgenoot',b:'Dol op planten, rococo en mysteries. Ze heeft altijd aarde onder haar nagels en een bloemetje op haar hoed.'},
 ron:{n:'Ron Wemel',rol:'Vriend · Griffoendor',b:'Zesde zoon van de Wemels, onverslaanbaar met toverschaak, bang voor spinnen en altijd trek. Zijn oude toverstok zat ooit vast met plakband.'},
 hermelien:{n:'Hermelien Griffel',rol:'Vriendin · Griffoendor',b:'De slimste heks van haar jaar. Ze heeft alle schoolboeken al uit vóór 1 september en richtte de S.H.I.T. op, voor de rechten van huiselfen.'},
 hagrid:{n:'Hagrid',rol:'Hoeder van de Sleutels',b:'Halfreus, hoeder van de sleutels en terreinen van Zweinstein. Hij heeft een zwak voor “onbegrepen” beesten: Pluisje, Norbert, Scheurbek…'},
 sneep:{n:'Professor Sneep',rol:'Toverdranken · hoofd van Zwadderich',b:'Streng, sarcastisch en meester in de toverdrankkunst. Achter die zwarte gewaden zit meer dan iedereen denkt.',vak:'toverdranken'},
 anderling:{n:'Professor Anderling',rol:'Gedaanteverwisselingen · hoofd van Griffoendor',b:'Adjunct-schoolhoofd, streng maar rechtvaardig, en een Faunaat: ze kan in een cyperse kat veranderen.',vak:'gedaante'},
 banning:{n:'Professor Banning',rol:'Bezweringen · hoofd van Ravenklauw',b:'Een piepkleine tovenaar met een reuzenhart. Hij staat op een stapel boeken om over zijn bureau te kunnen kijken.',vak:'bezweringen'},
 lupos:{n:'Professor Lupos',rol:'Verweer tegen de Zwarte Kunsten',b:'Vriendelijk, een beetje haveloos en de beste Verweer-leraar die Zweinstein ooit had. Hij heeft altijd chocola bij zich.',vak:'verweer'},
 zwamdrift:{n:'Professor Zwamdrift',rol:'Waarzeggerij · gast bij Astronomie',b:'Woont boven in de Noordtoren tussen sjaals, theekopjes en kristallen bollen. Ziet overal onheil in, vooral in theeblaadjes.',vak:'astronomie'}};
const PERS_VRIEND=['tilly','ron','hermelien','hagrid'],PERS_LERAAR=['sneep','anderling','banning','lupos','zwamdrift'];
(()=>{const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const src=(k,w)=>`img/personages/${k}-${w}.webp`;
 window.portret=(k,cls='')=>PERS[k]?`<img class="pportret ${cls}" src="${src(k,128)}" srcset="${src(k,128)} 1x, ${src(k,256)} 2x" alt="${PERS[k].n}" decoding="async">`:'';
 const staand=(cls='')=>`<img class="tstaand ${cls}" src="img/personages/tilly-staand-240.webp" srcset="img/personages/tilly-staand-240.webp 1x, img/personages/tilly-staand-480.webp 2x" alt="Tilly">`;
 window.wieIs=n=>{n=(n||'').toLowerCase();return n.includes('tilly')?'tilly':n.includes('ron')?'ron':n.includes('hermelien')?'hermelien':n.includes('hagrid')?'hagrid':n.includes('sneep')?'sneep':n.includes('anderling')?'anderling':n.includes('banning')?'banning':n.includes('lupos')?'lupos':n.includes('zwamdrift')?'zwamdrift':null};
 Object.values(PERS).forEach((_,i)=>{});['tilly','tilly-staand','ron','hermelien','hagrid'].forEach(k=>{const i=new Image();i.src=k=='tilly-staand'?'img/personages/tilly-staand-240.webp':src(k,128)});
 /* vriendschap: alleen cosmetisch */
 S.vriend=S.vriend||{};const groei=(k,n=1)=>{if(!PERS[k])return;S.vriend[k]=(S.vriend[k]||0)+n;bewaar()};window.vriendGroei=groei;
 const niveau=k=>{const x=S.vriend[k]||0;return Math.min(5,Math.floor(Math.sqrt(x/3)))};
 const TITEL=['Kennis','Klasgenoot','Maatje','Goede vriend','Boezemvriend','Vriend voor altijd'],TITEL_L=['Onbekende leerling','Bekend gezicht','Veelbelovend','Favoriete leerling','Uitblinker','Bijzondere band'];
 /* --- Tilly: portret i.p.v. getekend figuurtje --- */
 tillySVG=function(mood='praat'){return `<img class="tportret m-${mood}" src="${src('tilly',128)}" srcset="${src('tilly',128)} 1x, ${src('tilly',256)} 2x" alt="Tilly">`};
 /* gids/onboarding: Tilly ten voeten uit */
 const _gids=gids;gids=function(t,o={}){const r=_gids(t,o);try{const G=document.getElementById('gids');G.classList.add('metstaand');G.querySelector('.gav').innerHTML=staand('m-'+(o.mood||'praat'))}catch(e){}return r};
 /* --- dialogen: portret per spreker --- */
 const _vh=verhaal;
 verhaal=function(regels,klaar){if(document.querySelector('.modal'))return setTimeout(()=>verhaal(regels,klaar),800);let i=0;const o=document.createElement('div');o.className='modal verhaalm';document.body.appendChild(o);
  const toon=()=>{const[w,t]=regels[i];const k=wieIs(w);if(k)groei(k,1);
   o.innerHTML=`<div class="modalin rococo vh"><div class="vh-p">${k?portret(k,'vh-port '+(i%2?'m-blij':'m-praat')):`<div class="vh-ico">${icoon((typeof SPREKER!='undefined'&&SPREKER[w])||'hoed')}</div>`}</div><div class="vh-t"><b>${w}</b><p>${t}</p></div><button class="knop volgende" id="vhv">${i<regels.length-1?'Verder':'Oké!'}</button></div>`;
   try{fx.speel('kras')}catch(e){}o.querySelector('#vhv').onclick=()=>{i++;if(i<regels.length)toon();else{o.remove();klaar&&klaar()}}};toon()};
 /* --- welkom & afscheid: Tilly glijdt binnen + voorspelling van Zwamdrift / briefje van Hagrid --- */
 const VOORSPEL=['Ik zie… ik zie… de Grim! Of is het een theevlek? Pas vandaag goed op uw ketel, lieverd.','Mijn geestesoog vertelt mij dat u vandaag iets verliest. Waarschijnlijk een Smekkie. Of uw geduld.','De kristallen bol is troebel… Ach, daar is het: u zult vandaag sterven. Van verveling, als u níet speelt.','Mars staat helder vanavond. Dat betekent onrust… of gewoon een heel goede match-drie.','Ik voorspelde al jaren geleden dat u zou komen. Ik zei het alleen niet, om u niet te laten schrikken.','Uw theeblaadjes vormen… een valk. Of een wortel. Hoe dan ook: een gunstige dag voor de kas.','Iemand in deze kamer zal vandaag iets prachtigs vinden. Ik kijk niet naar u. Ik kijk wél naar u.'];
 const HAGRIDPOST=['Beste Luna, kom gerust eens thee drinken in m’n huisje. Ik heb rotskoekjes gebakken (niet bijten op de harde stukjes). – Hagrid','Luna! Je bent een heks, en een goeie ook. Professor Stronk vertelde over je kas. Ik ben trots, echt waar. – Hagrid','Psst. Ik heb iets… bijzonders in een ei gekregen. Niks tegen Perkamentus zeggen, hè? – Hagrid','Pluisje laat de groeten doen. Nou ja, twee van z’n drie koppen. De derde sliep. – Hagrid'];
 const dag=()=>Math.floor(Date.now()/864e5);
 function welkomVerrijk(){const o=document.querySelector('.ritueel .r-brief');if(o&&!o.querySelector('.tstaand')){o.insertAdjacentHTML('afterbegin',staand('r-tilly'));
   const p=dag()%2?['zwamdrift','Voorspelling van de dag',VOORSPEL[dag()%VOORSPEL.length]]:['hagrid','Uilenpost van Hagrid',HAGRIDPOST[dag()%HAGRIDPOST.length]];
   const knop=o.querySelector('#rin');(knop||o.lastChild).insertAdjacentHTML('beforebegin',`<div class="r-gast">${portret(p[0])}<div><b>${p[1]}</b><p>${p[2]}</p></div></div>`)}}
 window._welkomVerrijk=welkomVerrijk;
 if(typeof afscheid=='function'){const _af=afscheid;afscheid=function(...a){const r=_af(...a);try{const t=document.querySelector('.afsch .tavatar');if(t)t.outerHTML=staand('afsch-tilly')}catch(e){}return r}}
 /* --- per vak: wie hoort erbij --- */
 const VAKP={herbologie:{prof:null,vriend:'hagrid'},bezweringen:{prof:'banning',vriend:'hermelien'},toverdranken:{prof:'sneep',vriend:'ron'},gedaante:{prof:'anderling',vriend:'hermelien'},astronomie:{prof:'zwamdrift',vriend:'ron'},verweer:{prof:'lupos',vriend:'ron'}};
 const vakNu=n=>(window.vakVan?vakVan(n||S.m3lvl||1):{id:'herbologie'}).id;
 /* --- doorlopende verhaallijn per vak (mijlpalen binnen de 100 levels) --- */
 const LIJN={
  herbologie:{10:[['Hagrid','Luna! Ik kwam net langs met een paar Fladderzwammen voor Stronk. Je bent een heks, wist je dat? En een hartstikke goeie tuinierster ook.'],['Tilly','Hagrid zegt dat Pluisje vroeger onder deze kas lag te snurken. Ik hoop maar dat dat een grapje was.']],
   25:[['Tilly','Duivelsstrik! Niet bewegen… Hermelien zei: hij houdt niet van licht.'],['Hermelien Griffel','Lumos Solem! Zie je wel, het staat gewoon in “Duizend Magische Kruiden en Zwammen”.'],['Ron Wemel','Gelukkig dat we niet in paniek raakten. Nou ja… ík niet.']],
   50:[['Hagrid','Ik heb een ei gewonnen in de Drie Bezemstelen. Het moet warm blijven… mag ik het even bij jullie drakenmest leggen?'],['Tilly','Hagrid, dat is toch geen… is dat een DRAKENEI?'],['Hagrid','Ssst! Hij heet al Norbert. Of zij. Ik moet nog kijken.']],
   75:[['Tilly','Mijn mandragora’s zijn in de puberteit. Ze willen elkaars potten in, en ze geven feestjes.'],['Hermelien Griffel','Zodra ze kunnen verhuizen, zijn ze rijp voor de Mandragora-drank. Daarmee genees je iedereen die versteend is.']],
   99:[['Hagrid','Nog één level, Luna, en de hele kas is weer van ons. Van jóu, bedoel ik.'],['Tilly','Ik heb er bijna tranen van in m’n ogen. Of dat is de drakenmest.']]},
  bezweringen:{10:[['Professor Banning','Zwaaien en tikken, juffrouw Leeflang! En spreek het goed uit: het is Levi-ó-sa.'],['Hermelien Griffel','Niet Levio-sá. Dat zei ik ook steeds tegen Ron.'],['Ron Wemel','Ja ja. Ze is een nachtmerrie, eerlijk waar. Maar ze heeft wel gelijk.']],
   25:[['Tilly','Banning viel weer van zijn stapel boeken. Ik heb hem opgevangen met een zweefspreuk!'],['Professor Banning','Tien punten, juffrouw Tilly! Wat een reflexen.']],
   50:[['Ron Wemel','TROL IN DE KERKERS! Professor Krinkel kwam het net melden… en toen viel hij flauw.'],['Hermelien Griffel','Hij zit op de meisjes-wc! Wingardium Leviosa, Ron, nu!'],['Ron Wemel','Ik heb ’m z’n eigen knots tegen z’n kop laten vallen. Verdorie, Luna, het werkte écht.']],
   75:[['Hermelien Griffel','Weet je, er zijn belangrijker dingen dan boeken en slim zijn. Vriendschap. En moed.'],['Tilly','Dat zeg jij? Dan schrijf ik het op. In een boek.']],
   99:[['Professor Banning','Nog één bezwering en u heeft het vak gehaald. Ik heb mijn mooiste stapel boeken klaargezet om op te springen van vreugde.']]},
  toverdranken:{1:[['Professor Sneep','Er zal hier weinig onnozel zwaaien met toverstokken plaatsvinden. Maar ik kan u leren hoe u roem brouwt… en zelfs de dood kunt kurken.'],['Ron Wemel','(fluistert) Is hij altijd zo vrolijk?']],
   10:[['Professor Sneep','Juffrouw Leeflang. Wat krijg ik als ik affodilwortel toevoeg aan een aftreksel van alsem?'],['Tilly','(fluistert) De Levende Doods-drank…'],['Professor Sneep','Vijf punten af voor voorzeggen, juffrouw Tilly. Kalmte, juffrouw Leeflang. Kalmte.']],
   25:[['Ron Wemel','Mijn ketel smolt. Alwéér. Neville zit in de ziekenzaal met puisten in zijn nek.'],['Hermelien Griffel','Je moet het stekelvarkensstekels pas toevoegen als de ketel van het vuur is, Ron!']],
   50:[['Professor Sneep','Uw Kalmeringsdrank heeft precies de juiste zilveren damp. Hm. Dat is… niet onacceptabel.'],['Tilly','Luna! Dat is het grootste compliment dat hij ooit heeft gegeven!']],
   75:[['Ron Wemel','Ik zag Sneep op de gang staren naar een oude foto. Toen hij me zag, deed hij heel snel weer chagrijnig.'],['Tilly','Er zit meer achter hem dan je denkt, Ron. Dat zeg ik al de hele tijd.']],
   99:[['Professor Sneep','Na al dit werk, juffrouw Leeflang… blijft u nog steeds brouwen?'],['Tilly','(zachtjes) Altijd.'],['Professor Sneep','…Tien punten voor uw afdeling. Vertel het aan niemand.']]},
  gedaante:{1:[['Tilly','Er zit een cyperse kat op de lessenaar. Ze kijkt heel… streng.'],['Professor Anderling','(verandert van kat in heks) Gedaanteverwisselingen is een van de lastigste en gevaarlijkste vakken die u op Zweinstein krijgt. Wie hier gekheid uithaalt, komt er niet meer in.'],['Ron Wemel','Verdorie. Dat was cool.']],
   10:[['Professor Anderling','Een muis wordt een theekop, juffrouw Leeflang. Zónder staart en zónder snorharen, alstublieft.'],['Hermelien Griffel','Het geheim is: je moet het eindresultaat heel precies voor je zien.']],
   25:[['Hermelien Griffel','Ik moet je iets vertellen, maar zeg het tegen niemand. Ik heb een Tijdverdrijver. Daarom zit ik bij drie lessen tegelijk.'],['Tilly','Dus dáárom zag ik je gisteren twee keer in de bibliotheek!']],
   50:[['Professor Anderling','Vijftig punten voor Griffoendor… en de rest van Zweinstein. Voor het werk in de kas en de kerkers. U heeft het verdiend.'],['Ron Wemel','Vijftig! Van Anderling! Ik ga zitten.']],
   75:[['Professor Anderling','Ik heb mijn hoed nog nooit zo dicht bij een glimlach gehad, juffrouw Leeflang.']],
   99:[['Professor Anderling','Uw laatste gedaanteverwisseling van dit vak. Laat me zien wat u kunt. En… neem daarna een gemberkoekje.']]},
  astronomie:{1:[['Professor Zwamdrift','Welkom, mijn lieve kind. Ik zag u al aankomen… in mijn geestesoog, tussen de sterren.'],['Ron Wemel','(fluistert) Zij voorspelt ieder jaar dat er iemand doodgaat.'],['Professor Zwamdrift','Ik voorspel dat u sterft, juffrouw Leeflang. Van verveling, als u níet blijft spelen.']],
   10:[['Tilly','Kijk door de telescoop: Jupiter en z’n manen! Europa, Io, Ganymedes, Callisto…'],['Hermelien Griffel','Professor Sinistra wil dat we ze om middernacht in kaart brengen. Het staat in ons rooster.']],
   25:[['Professor Zwamdrift','Ik zie… een grote zwarte hond. De Grim! Het voorteken van de dood!'],['Ron Wemel','Of het is Hagrids hond Muil. Die zit daar gewoon. Op het gazon.']],
   50:[['Tilly','Op de Astronomietoren zie je het hele terrein. Het Verboden Bos, het Meer, Hagrids huisje… en de lichtjes van Zweinsveld.'],['Ron Wemel','Mooi hoor. Is er hier ergens ook een snoepkarretje? Zoals in de Zweinsteinexpres?']],
   75:[['Professor Zwamdrift','Mijn bol is helder vandaag. Er komt een overwinning. Een grote. En… thee.']],
   99:[['Professor Zwamdrift','De sterren buigen voor u, lieverd. Nou ja, ze twinkelen. Dat is hetzelfde.']]},
  verweer:{1:[['Professor Lupos','Goedemiddag. Laat uw boeken maar in de tas. Vandaag gaan we iets doen.'],['Ron Wemel','Eindelijk een leraar die géén klok verstopt in z’n tulband. Ik bedoel: die normaal is.']],
   10:[['Professor Lupos','In die oude kleerkast zit een Boeman. Hij neemt de vorm aan van wat u het meest vreest. De spreuk is: Riddikulus. En dan lachen.'],['Ron Wemel','Spinnen. Waarom moet het nou weer spinnen zijn… Riddikulus! Ha, ze hebben rolschaatsen aan!']],
   25:[['Tilly','Brr, het werd ineens zo koud. Alle kaarsen gingen uit…'],['Professor Lupos','Een Dementor bij het hek. Hier, neem een stuk chocola. Echt, het helpt.']],
   50:[['Hermelien Griffel','Protego is een schildspreuk. Hoe sterker je eraan gelooft, hoe sterker hij is.'],['Ron Wemel','Of je gooit gewoon een schaakstuk. Werkt ook. Soms.']],
   75:[['Professor Lupos','Ik heb nog nooit een leerling gezien die zo standvastig bleef, juffrouw Leeflang. Dertig punten.'],['Tilly','Luna, hij heeft volgens mij heel erg moe gekeken. Ik ga hem morgen kruidenthee brengen.']],
   99:[['Professor Lupos','Laatste les van het vak. Wat er ook komt: u weet nu dat moed niet betekent dat je niet bang bent.'],['Ron Wemel','Bloedig goed gedaan, Luna. Eh… ik bedoel: verdorie goed gedaan!']]}};
 S.lijnGezien=S.lijnGezien||{};
 /* felicitaties bij level gehaald */
 const FELI={ron:['Verdorie, Luna! Dat was beter dan mijn schaakspel tegen Anderlings schaakstukken.','Wil je een Chocokikker? Ik heb er nog drie. Twee. Eén. Hier, deze is voor jou.','Fred en George zouden zeggen: “Dat was briljant!” En ik ook.'],
  hermelien:['Briljant gedaan! Ik heb het opgeschreven in mijn planning.','Wist je dat dit in “Geschiedenis van Zweinstein” zou passen? Echt waar.','Het zijn de kleine dingen, Luna. Een slimme zet hier, een goede keuze daar.'],
  hagrid:['Nou zeg! Dat verdient een rotskoekje. Niet op de harde stukken bijten, hè.','Pluisje zou kwispelen als ie het zag. Met drie staarten. Of één.','Ik zei het toch: je bent een heks, Luna!'],
  tilly:['We doen het samen, Luna. Op naar de volgende!','Ik krijg er rode wangen van. Echt.']};
 if(typeof m3Winst=='function'){const _w=m3Winst;m3Winst=function(n,b){const r=_w(n,b);try{const vk=vakNu(n);const vp=VAKP[vk]||VAKP.herbologie;
   if(Math.random()<.5){const k=Math.random()<.65?vp.vriend:['ron','hermelien','hagrid'][n%3];groei(k,2);const h=[...document.querySelectorAll('.m3eind')].pop();
    if(h&&!h.querySelector('.feli')){const z=FELI[k][(n+dag())%FELI[k].length];const ref=h.querySelector('.knop');(ref||h.lastChild).insertAdjacentHTML('beforebegin',`<div class="feli">${portret(k)}<p><b>${PERS[k].n}:</b> ${z}</p></div>`)}}
   const v=window.vakVan?vakVan(n):{van:1};const rel=n-v.van+1;const lijn=(LIJN[vk]||{})[rel];const sleutel=vk+':'+rel;
   if(lijn&&!S.lijnGezien[sleutel]){S.lijnGezien[sleutel]=1;bewaar();setTimeout(()=>{const wacht=()=>document.querySelector('.modal')?setTimeout(wacht,700):verhaal(lijn);wacht()},1200)}}catch(e){console.warn(e)}return r}}
 /* --- observer: nieuw-vak-moment, dagdoelen, laadschermen --- */
 const DDW=['tilly','hagrid','ron','hermelien'];
 function verrijk(){try{welkomVerrijk()}catch(e){}
  document.querySelectorAll('.lesdeur:not(.pk)').forEach(s=>{s.classList.add('pk');const v=window.vakVan?M3VAKKEN.find(x=>s.textContent.includes(x.n))||vakVan(S.m3lvl):null;const vp=VAKP[v&&v.id]||{};
   s.insertAdjacentHTML('beforeend',`${staand('ld-tilly')}${vp.prof?`<div class="ld-prof">${portret(vp.prof)}</div>`:''}`);
   const lijn=(LIJN[v&&v.id]||{})[1];const obs=new MutationObserver(()=>{const f=s.querySelector('.ld-feest');if(f&&!f.dataset.p){f.dataset.p=1;if(lijn&&!S.lijnGezien[v.id+':1']){S.lijnGezien[v.id+':1']=1;bewaar();f.insertAdjacentHTML('afterbegin',`<div class="feli">${portret(wieIs(lijn[0][0]))}<p><b>${lijn[0][0]}:</b> ${lijn[0][1]}</p></div>`)}
     const fr=vp.vriend;if(fr)f.querySelector('.klein')&&f.querySelector('.klein').insertAdjacentHTML('afterend',`<div class="feli">${portret(fr)}<p><b>${PERS[fr].n}:</b> ${fr=='ron'?'Nieuw vak! Hopelijk zonder spinnen. Ik ga naast je zitten.':fr=='hermelien'?'Ik heb het boek al gelezen. Twee keer. Vraag het me gerust!':'Kom na de les maar thee drinken, hoor!'}</p></div>`);obs.disconnect()}});obs.observe(s,{childList:true,subtree:true})});
  document.querySelectorAll('.dagdoelen .dd:not(.pk)').forEach((d,i)=>{d.classList.add('pk');const k=DDW[(i+dag())%DDW.length];d.insertAdjacentHTML('afterbegin',`<span class="dd-wie" title="Gevraagd door ${PERS[k].n}">${portret(k)}</span>`)});
  const ls=document.getElementById('laadscherm');if(ls&&!ls.dataset.pk){ls.dataset.pk=1;const th=(ls.querySelector('.ls-kop small')||{}).textContent||'';const vk=Object.keys(VAKP).find(k=>(M3THEMA[k]||{}).n==th)||'herbologie';const pr=VAKP[vk].prof;
   if(pr)ls.querySelector('.ls-kop').insertAdjacentHTML('afterbegin',`<div class="ls-prof">${portret(pr)}</div>`);const p=ls.querySelector('.ls-strook p');if(p){const k=wieIs(p.textContent.split(':')[0])||'tilly';p.insertAdjacentHTML('beforebegin',portret(k,'ls-wie'))}}}
 new MutationObserver(verrijk).observe(document.body,{childList:true,subtree:true});
 /* --- laadscherm-tips met herkenbare momenten --- */
 const TIPS={herbologie:['Tilly: “Oorwarmers op! Een volwassen mandragora gilt zo hard dat je er ziek van wordt.”','Hermelien: “Duivelsstrik houdt niet van licht. Lumos Solem!”','Hagrid: “Ik heb ’n paar Fladderzwammen voor Stronk. Niet laten wegfladderen, hè.”','Tip: vijf of meer in één keer vult je toverpoeder-ampul.'],
  bezweringen:['Banning: “Zwaaien en tikken! En het is Levi-ó-sa.”','Hermelien: “Niet Levio-sá, Ron.”','Ron: “Trol in de kerkers! Of… op de meisjes-wc?”','Tip: zwevende veren breek je door ernaast te matchen.'],
  toverdranken:['Sneep: “Weinig onnozel gezwaai met toverstokken hier.”','Sneep: “Kalmte, juffrouw Leeflang. Kalmte.”','Ron: “Mijn ketel smolt. Alwéér.”','Tip: een bezoar redt je van de meeste vergiften. Staat gewoon in je boek.'],
  gedaanteverwisselingen:['Anderling: “Wie gekheid uithaalt, komt er niet meer in.”','Tilly: “Die kat op de lessenaar? Dat ís Anderling!”','Hermelien: “Zie het eindresultaat heel precies voor je.”','Tip: versteende tegels hebben soms twee lagen.'],
  astronomie:['Zwamdrift: “Mijn geestesoog ziet… de Grim!”','Ron: “Het is gewoon Muil, Hagrids hond.”','Tilly: “Europa, Io, Ganymedes, Callisto. Ik ken ze uit m’n hoofd!”','Tip: sterrenstofwolken verdwijnen als je ernaast matcht.'],
  verweer:['Lupos: “Riddikulus! En dan lachen.”','Lupos: “Neem een stuk chocola. Echt, het helpt.”','Ron: “Waarom moet het altijd spinnen zijn?”','Tip: zwarte nevel breek je door er vlak naast te matchen.']};
 const thLS={herbologie:'herbologie',bezweringen:'bezweringen',toverdranken:'toverdranken',gedaante:'gedaanteverwisselingen',astronomie:'astronomie',verweer:'verweer'};
 Object.entries(thLS).forEach(([th,f])=>{if(LAADSCHERM[th])LAADSCHERM[th].tips=TIPS[f]});
 /* --- Vrienden & leraren --- */
 V.vrienden=()=>{const kaart=(k,leraar)=>{const nv=niveau(k);return `<div class="vrkaart">${portret(k)}<div><h3>${PERS[k].n}</h3><small>${PERS[k].rol}</small><p>${PERS[k].b}</p><div class="vrniv"><span class="harten">${'♥'.repeat(nv)}<i>${'♥'.repeat(5-nv)}</i></span> ${(leraar?TITEL_L:TITEL)[nv]}</div></div></div>`};
  app(`<h1>Vrienden & leraren</h1>${tilly('Hoe vaker je samen iets doet, hoe hechter de band. Gewoon omdat het fijn is: hier zijn geen punten mee te verdienen.')}<h2 class="vrkop">Vrienden</h2>${PERS_VRIEND.map(k=>kaart(k)).join('')}<h2 class="vrkop">Leraren</h2>${PERS_LERAAR.map(k=>kaart(k,1)).join('')}<p class="klein">Professor Stronk (Herbologie) en Professor Sinistra (Astronomie) hebben nog geen portret.</p>`)};
 const _meer=V.meer;V.meer=(...a)=>{const r=_meer(...a);try{const h=document.querySelector('#app h1');if(h&&!document.getElementById('meervr'))h.insertAdjacentHTML('afterend',`<button class="knop volgende" id="meervr" onclick="ga('vrienden')">${portret('ron','mini')}${portret('hermelien','mini')}${portret('hagrid','mini')} Vrienden & leraren</button>`)}catch(e){}return r};
})();
