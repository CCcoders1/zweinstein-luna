'use strict';
/* ====== Kernervaring: leerjaren, vakken, restauratietaken, levelpad, bonus ====== */
const VAK1=[
 {id:'herbologie',n:'Herbologie',lokaal:'De Kas',decor:'kas',img:'decor-kas',prof:'Professor Stronk',thema:'herbologie',
  intro:[['Tilly','Luna! Kijk nou… de oude Kas. Overal spinrag en kapotte ruiten. Maar ruik je dat? Er leeft hier nog iets.'],['Professor Stronk','Ah, juffrouw Leeflang en juffrouw Tilly. Deze kas is jarenlang verwaarloosd. Als jullie hem opknappen, mogen jullie er je eigen planten kweken.'],['Tilly','Doen we! Elke ster die we verdienen, stoppen we hierin. Zullen we beginnen met een level?']],
  outro:[['Professor Stronk','Wel, wel. Zo mooi heb ik deze kas sinds mijn eigen schooltijd niet gezien.'],['Tilly','En er groeit écht weer iets, Luna. Zie je die mandragora wiebelen? Ik geloof dat hij naar je zwaait.'],['Tilly','O! Professor Sneep zoekt hulp in de kerkers. Spannend… en een beetje eng.']],
  taken:[['web','Veeg de spinnenwebben weg',1,'blad',[18,30],'Hatsjoe! Er zat een spin zo groot als een Galjoen. Ik heb hem netjes naar buiten gebracht.'],
   ['ruit','Repareer de glazen dakpanelen',2,'zon',[50,14],'Het licht valt weer naar binnen. De varens strekken zich al uit!',['Helder kasglas','Groen glas-in-lood','Rococo-sponningen van goud']],
   ['potten','Verzamel de mandragorapotten voor de les',1,'bloem',[78,44],'Twintig potten op een rij. Professor Stronk zal blij zijn.'],
   ['oor','Zet de oorwarmers klaar',1,'hart',[30,62],'Niet vergeten op te zetten, hè? Het gekrijs van een mandragora is niet iets om mee te spotten.',['Roze pluizige oorwarmers','Groen fluweel','Gouden borduursel']],
   ['mest','Vul de kas met drakenmest',2,'ster',[66,76],'Bah, wat een geur! Maar Professor Stronk zweert erbij.']]},
 {id:'toverdranken',n:'Toverdranken',lokaal:'Het Toverdrankenlokaal',decor:'kerker',img:'decor-kerker',prof:'Professor Sneep',thema:'toverdranken',
  intro:[['Tilly','De kerkers… Het is hier kil, en die potten met dingen erin staren terug.'],['Professor Sneep','Onnozel gegiechel zal hier niet nodig zijn. Ruim dit lokaal op, en misschien – misschien – mag u er brouwen.'],['Tilly','(fluistert) Hij is minder eng als je ziet hoe zorgvuldig hij zijn flesjes etiketteert.']],
  outro:[['Professor Sneep','Hm. Acceptabel.'],['Tilly','Acceptabel! Van Sneep! Dat is zoiets als een staande ovatie, Luna.']],
  taken:[['bank','Schrob de stenen werkbanken',1,'schild',[22,58],'Onder de vlekken zat prachtig marmer. Wie had dat gedacht?'],
   ['ketel','Zet de ketel terug op het vuur',2,'ketel',[50,48],'Een standaardmaat 2, precies zoals op de schoollijst.',['Tinnen ketel','Messing ketel','Koperen ketel']],
   ['kast','Vul de voorraadkast met ingrediënten',1,'boek',[80,30],'Gaasvliegjes, affodilwortel, Tweehoornpoeder… allemaal netjes op alfabet.'],
   ['weeg','Hang de koperen weegschalen op',1,'beker',[30,26],'Zo kunnen we straks precies afwegen. Sneep let op elke korrel.'],
   ['vuur','Steek de vuurkorven aan',2,'vuur',[70,72],'Gezellig is het nog steeds niet, maar wel warm.',['Groene vlammen','Blauwe belvlammetjes','Gouden vuur']]]},
 {id:'bezweringen',n:'Bezweringen',lokaal:'Het Bezweringenlokaal',decor:'bieb',img:'decor-bibliotheek',prof:'Professor Banning',thema:'bezweringen',
  intro:[['Professor Banning','Welkom, welkom! Ik ben zo blij met hulp! Er is hier een klein ongelukje gebeurd met een zweefspreuk…'],['Tilly','Alle boeken hangen tegen het plafond! Luna, dit wordt geweldig.']],
  outro:[['Professor Banning','Schitterend! Wingardium Leviosa – het is Levi-ó-sa, niet Levio-sá. Maar dat wisten jullie al.'],['Tilly','Ik hoorde Hagrid net iets roepen over een ontsnapte… wat was het? Iets met tanden.']],
  taken:[['veer','Leg de veren klaar voor de zweefspreuk',1,'stok',[26,50],'Eén veer per leerling. Ik heb er stiekem een extra mooie voor jou gelegd.'],
   ['plank','Herstel de boekenplanken',2,'boek',[74,32],'Alle boeken staan weer. Eentje fluisterde “dank je”.',['Eiken planken','Mahonie met krullen','Wit en goud']],
   ['opstap','Zet de stapel boeken voor Professor Banning klaar',1,'lijst',[50,70],'Hij staat er weer bovenop en zwaait vrolijk naar ons.'],
   ['kroon','Hang de kroonluchter op',2,'kaars',[50,14],'Honderd kaarsjes, en ze gingen tegelijk aan. Kippenvel!',['Kristallen kroon','Gouden rococo-kroon','Zwevende kaarsen']],
   ['raam','Poets de hoge ramen',1,'maan',[16,24],'Nu zie je het meer glinsteren vanaf hier.']]},
 {id:'fabeldieren',n:'Verzorging van Fabeldieren',lokaal:'Hagrids moestuin',decor:'bos',img:'decor-bos',prof:'Hagrid',thema:'fabeldieren',
  intro:[['Hagrid','Ah, daar zijn jullie! Kom maar, kom maar. Niks aan de hand hoor, die Flubberwurm doet niks.'],['Tilly','Luna… volgens mij is dat geen Flubberwurm.']],
  outro:[['Hagrid','Prachtig gedaan. Echt. Nou moeten jullie maar ’ns een kopje thee komen drinken, met rotsjes erbij.'],['Tilly','(fluistert) Die rotsjes zijn echt van steen. Doe maar alsof je ze opeet.']],
  taken:[['hek','Repareer het hek van de wei',1,'huis',[20,62],'Zo kan niemand meer ontsnappen. Hoop ik.'],
   ['voer','Vul de voerbakken',1,'hart',[48,72],'Hagrid gaf het eten namen. Allemaal. Eén heette “Pluis”.'],
   ['nest','Bouw een nestkast voor de uilen',2,'uil',[78,30],'Er zit al een sneeuwuil op! Hij kijkt heel deftig.',['Rustieke houten kast','Torentje met dakpannen','Rococo-paleisje']],
   ['pomp','Zet Hagrids pompoenen in de moestuin',1,'bloem',[34,82],'Hij zegt dat ze tegen Halloween zo groot als een koets zijn.'],
   ['lamp','Steek de lantaarns langs het pad aan',2,'kaars',[64,46],'Het Verboden Bos lijkt nu iets minder… verboden.',['IJzeren lantaarns','Pompoenlantaarns','Lantaarns met vuurvliegjes']]]},
 {id:'astronomie',n:'Astronomie',lokaal:'De Astronomietoren',decor:'toren',img:'decor-telescoop',prof:'Professor Sinistra',thema:'astronomie',
  intro:[['Tilly','Honderden treden… Maar kijk eens naar boven, Luna. Al die sterren.'],['Professor Sinistra','Elke woensdag om middernacht bestuderen we hier de hemel. Als de toren klaar is, tenminste.']],
  outro:[['Professor Sinistra','Een uitstekend observatorium. De sterren zullen het jullie lang niet vergeten.'],['Tilly','Luna… ons eerste jaar is voorbij. Maar ik heb gehoord dat er in het tweede jaar nog veel meer kamers op ons wachten.']],
  taken:[['trap','Veeg de torentrap',1,'pijl',[20,76],'Driehonderd treden. Ik heb ze geteld. Twee keer.'],
   ['tele','Zet de telescopen op',2,'telescoop',[50,40],'Ik zie de maan! En… is dat een kraterhoed?',['Koperen telescoop','Zilveren telescoop','Gouden telescoop']],
   ['kaart','Hang de sterrenkaarten op',1,'rol',[78,26],'Daar is Sirius, de helderste ster aan de hemel.'],
   ['kussen','Leg kussens neer voor de nachtles',1,'bed',[30,30],'Stiekem een beetje te comfortabel voor een les om middernacht.'],
   ['globe','Plaats de hemelglobe',2,'maan',[70,70],'Hij draait langzaam mee met de echte hemel. Magisch.',['Messing armillairsfeer','Blauwe hemelbol','Gouden sterrenbol']]]}];
const VAK_EXTRA=[{id:'gedaante',n:'Gedaanteverwisselingen',lokaal:'Het lokaal van Professor Anderling',decor:'gang',img:'decor-gang',prof:'Professor Anderling',thema:'bezweringen'},{id:'geschiedenis',n:'Geschiedenis van de Toverkunst',lokaal:'De Bibliotheek',decor:'bieb',img:'oude-boeken',prof:'Professor Kist',thema:'bezweringen'},{id:'verweer',n:'Verweer tegen de Zwarte Kunsten',lokaal:'Het Verweerlokaal',decor:'gang',img:'decor-glas',prof:'de professor van dit jaar',thema:'toverdranken'},{id:'meer',n:'Het Meer',lokaal:'De Meeroever',decor:'dorp',img:'decor-meer',prof:'Hagrid',thema:'fabeldieren'}];
const SJABLOON=[['Vernieuw de {o}',['banken','gordijnen','tapijten','lampen','kasten']],['Plant {o} langs de muur',['klimrozen','klimop','lavendel','varens','blauweregen']],['Hang {o} op',['portretten','wandtapijten','slingers','vaandels']],['Zet {o} neer',['bankjes','beelden','bloembakken','fonteinen']]];
const VARIANT=[['Klassiek','Rococo met krullen','Betoverd en glinsterend'],['Eikenhout','Marmer','Goud en glas'],['Rozenrood','Smaragdgroen','Middernachtblauw']];
function vakkenVan(j){if(j==1)return VAK1;const r=rngVan(j*977);const lijst=[...VAK1,...VAK_EXTRA].sort(()=>r()-.5).slice(0,5);
 return lijst.map((v,vi)=>({...v,intro:[['Tilly',`Leerjaar ${j}! ${v.lokaal} ziet er weer heel anders uit dan vorig jaar. Zullen we het samen ${j%2?'opfleuren':'betoveren'}?`]],outro:[['Tilly',`${v.lokaal} is klaar. Ik zou hier wel kunnen wonen, Luna.`]],
  taken:Array.from({length:5},(_,i)=>{const s=SJABLOON[(i+vi+j)%SJABLOON.length];const o=s[1][(i*3+j+vi)%s[1].length];const kost=Math.min(4,2+((j+i)%3==0?1:0)+(j>4?1:0));
   return['j'+j+v.id+i,s[0].replace('{o}',o),kost,['bloem','kaars','ster','boek','lijst','spiegel'][(i+vi)%6],[[20,30],[70,24],[50,55],[24,74],[76,70]][i],`Wat mooi, Luna. ${['Dit had ik nooit zelf bedacht.','De professoren gaan dit zeker opmerken.','Ik voel de magie al in de muren.','Nog even en het is helemaal af.','Wat een kleuren!'][(i+j)%5]}`,i%2?VARIANT[(i+j)%3]:null]})}))}
/* positie */
def('sterren',Math.min(8,Object.keys(S.opgelost||{}).length));def('m3lvl',1);def('taken',{});def('keuze',{});def('bonusOpen',{});def('verhaalGezien',{});def('dagBel',{});def('pottenGezien',0);def('uilenpost',0);
// migratie: spellen die al gespeeld zijn blijven open
['drank','memory','spreuk','mysterie','snaai','toverstok','bonen','lessen'].forEach(k=>{if((S.opgelost||{})[k]||(S.opgelost||{})[k+'0']||(S.bezocht||{})[k])S.bonusOpen[k]=1});
function jaar(){let j=1;while(vakkenVan(j).every(v=>v.taken.every(t=>S.taken[t[0]])))j++;return j}
function huidigVak(){const j=jaar();const vs=vakkenVan(j);return{j,vs,v:vs.find(v=>v.taken.some(t=>!S.taken[t[0]]))||vs[vs.length-1]}}
function m3VakVoor(n){const j=Math.ceil(n/30),i=Math.min(4,Math.floor(((n-1)%30)/6));return vakkenVan(j)[i]}
function takenKlaar(){return Object.keys(S.taken).length}
/* bonusspellen, één voor één via het verhaal */
const BONUS=[['memory','Kruidenkunde-memory','blad','herbologie',2,'Er lag een stapel kaartjes met plantentekeningen in de kas…'],['drank','Toverdranken brouwen','ketel','herbologie',5,'Professor Sneep heeft een recept voor ons achtergelaten.'],['lessen','Lessen & examens','les','herbologie',1,'De professoren geven extra lessen voor wie nieuwsgierig is.'],
 ['snaai','Snaai vangen','snaai','toverdranken',5,'Er zoemt iets goudkleurigs door de gang…'],['spreuk','Spreuken-raadsels','stok','bezweringen',3,'Professor Banning heeft raadsels over spreuken.'],['toverstok','Spreuken tekenen','stok','bezweringen',5,'Teken een spreuk in de lucht met je toverstok.'],
 ['mysterie','Geheimschrift-mysterie','loep','fabeldieren',5,'Hagrid vond een briefje in vreemde letters bij de Maanbloem…'],['bonen','Smakkerbonen','boon','astronomie',5,'Een zakje Bertie Botts Smakkerbonen. Durf jij?']];
function bonusVrij(b){if(S.bonusOpen[b[0]])return true;const v=VAK1.find(x=>x.id==b[3]);const n=v.taken.filter(t=>S.taken[t[0]]).length;return n>=b[4]}
function bonusCheck(){BONUS.forEach(b=>{if(!S.bonusOpen[b[0]]&&bonusVrij(b)){S.bonusOpen[b[0]]=1;bewaar();setTimeout(()=>verhaal([['Tilly',`${b[5]} Luna, we hebben iets nieuws ontdekt: <b>${b[1]}</b>! Je vindt het onder Bonus. Daar verdien je extra Galjoenen, kaarten en soms een ster.`]],()=>{}),700)}})}
/* verhaalmoment */
const SPREKER={Tilly:'tilly','Professor Stronk':'blad','Professor Sneep':'ketel','Professor Banning':'stok','Hagrid':'huis','Professor Sinistra':'telescoop','Professor Anderling':'hoed'};
function verhaal(regels,klaar){if(document.querySelector('.modal')){return setTimeout(()=>verhaal(regels,klaar),800)}let i=0;const o=document.createElement('div');o.className='modal verhaalm';document.body.appendChild(o);
 const toon=()=>{const[w,t]=regels[i];o.innerHTML=`<div class="modalin rococo vh"><div class="vh-p">${w=='Tilly'?tillySVG(i%2?'blij':'praat'):`<div class="vh-ico">${icoon(SPREKER[w]||'hoed')}</div>`}</div><div class="vh-t"><b>${w}</b><p>${t}</p></div><button class="knop volgende" id="vhv">${i<regels.length-1?'Verder':'Oké!'}</button></div>`;
  try{fx.speel('kras')}catch(e){}$('#vhv').onclick=()=>{i++;if(i<regels.length)toon();else{o.remove();klaar&&klaar()}}};toon()}
/* kweekpotten */
const POTSOORT=[['Basispot van terracotta','#b8673a'],['Geglazuurde groene pot','#4f8a5a'],['Koperen pot','#c07a3a'],['Blauw-wit porselein','#4c6fb0'],['Rococo-pot met krullen','#d4af37'],['Gouden pot','#e9c64a']];
function kweekPotten(){return Math.min(12,1+Math.floor(takenKlaar()/3)+(jaar()-1)*2)}
V.kas=()=>{VIEWDECOR.kas='kas';const n=kweekPotten();const kl=['#c8b6ff','#f4a6c0','#9fd8cb','#fff1b8','#e6c35c','#88c999','#ff9e6b','#b6c8ff','#ffd1dc','#b0e0a8','#ffe08a','#d0b8ff'];
 app(`<h2>De Kassen</h2>${tilly(n==1?'Eén pot om mee te beginnen. Wat we hierin kweken, wordt iets heel bijzonders. Meer potten komen als we de lokalen opknappen.':`${n} potten al! Ik praat elke ochtend even tegen ze. Dat helpt echt, zegt Professor Stronk.`)}
 <div class="kas">${Array.from({length:n},(_,i)=>{const pt=POTSOORT[Math.min(POTSOORT.length-1,Math.floor(i/2))];const f=Math.max(0,Math.min(4,Math.floor((S.xp-i*40)/25)));return `<div class="pot" style="--pot:${pt[1]}">${plantSVG(f,kl[i%kl.length])}<div><b>${(PLANT_NAMEN[i%PLANT_NAMEN.length])}</b><br><small>${pt[0]} · ${['Zaadje','Kiemplantje','Jonge plant','Knop','Bloeiend'][f]}</small></div></div>`}).join('')}</div>
 <p class="klein">Volgende pot na ${3-takenKlaar()%3} voltooide ${3-takenKlaar()%3==1?'taak':'taken'}.</p>`)};
function potCheck(){const n=kweekPotten();if(n>S.pottenGezien){const eerste=!S.pottenGezien;S.pottenGezien=n;bewaar();if(eerste)return;const pt=POTSOORT[Math.min(POTSOORT.length-1,Math.floor((n-1)/2))];
 const o=document.createElement('div');o.className='modal';o.innerHTML=`<div class="modalin rococo nieuwepot"><h2>Een nieuwe pot!</h2><div class="np-pot" style="--pot:${pt[1]}">${plantSVG(0,'#9fd8cb')}</div><p><b>${pt[0]}</b></p>${tilly('Kijk wat ik vond achter de kas, Luna! Nog een pot. Wat zullen we erin zaaien?')}<button class="knop volgende" id="npok">Naar mijn potten</button><button class="linkknop" id="npl">Later</button></div>`;document.body.appendChild(o);fx.speel('fanfare');vib([40,30,80]);try{const r=o.querySelector('.np-pot').getBoundingClientRect();vonk(r.left+r.width/2,r.top+r.height/2,40)}catch(e){}
 $('#npok').onclick=()=>{o.remove();ga('kas')};$('#npl').onclick=()=>o.remove()}}
/* dagdoelen (3) */
function dagDoelen(){const d=vandaag(),{v}=huidigVak();const t=v.taken.find(x=>!S.taken[x[0]]);const tv=k=>((S.tel[d]||{})[k]||0);
 const lijst=[[`Verdien 2 sterren${t?' voor “'+t[1].toLowerCase()+'”':''}`,tv('sterren'),2,()=>ga('match3'),'ster'],
  S.bonusOpen.drank?['Brouw een drankje voor '+v.prof,tv('drank'),1,()=>ga('drank'),'ketel']:S.bonusOpen.memory?['Help Professor Stronk met de plantenkaartjes',tv('memory'),1,()=>ga('memory'),'blad']:['Speel 2 levels',tv('m3'),2,()=>ga('match3'),'spel'],
  [`Voltooi een taak in ${v.lokaal.replace(/^De |^Het /,'de ').toLowerCase()}`,tv('taak'),1,()=>{const b=$('#taakknop');b?b.click():ga('home')},'huis']];
 return lijst.map(([n,h,m,f,i],k)=>({n,h:Math.min(h,m),m,f,i,af:h>=m,k:d+k}))}
function dagBeloon(){dagDoelen().forEach(g=>{if(g.af&&!S.dagBel[g.k]){S.dagBel[g.k]=1;S.sterren++;S.galjoenen+=15;bewaar();stats();toast('Dagdoel gehaald: +1 ster, +15 Galjoenen');fx.speel('munt')}})}
// polish/welkomRitueel gebruikt doelen(): koppel aan de nieuwe dagdoelen
doelen=function(){return dagDoelen().map(g=>[g.n,g.af,g.f,g.i])};
/* beloon-koppeling: bonusspellen leveren extra's en soms een ster */
const _belK=beloon;beloon=function(id,...a){const r=_belK(id,...a);const p=(id.match(/^[a-z]+/)||[''])[0];tel(p);if(!/^m3/.test(id)&&Math.random()<.35){S.sterren++;bewaar();setTimeout(()=>toast('Bonus: +1 ster!'),1400)}setTimeout(()=>{dagBeloon();stats()},50);return r};
function kernNa(){dagBeloon();potCheck()}
/* ---------- hoofdscherm: het actieve lokaal ---------- */
function sterTeller(){return `<span class="sterteller">${icoon('ster')}<b>${S.sterren}</b></span>`}
V.home=()=>{const{j,vs,v}=huidigVak();VIEWDECOR.home=v.decor;try{zetDecor(v.decor)}catch(e){}
 const klaar=v.taken.filter(t=>S.taken[t[0]]).length;const vol=v.taken.find(t=>!S.taken[t[0]]);const dd=dagDoelen();
 app(`<section class="dagdoelen">${dd.map(g=>`<button class="dd ${g.af?'af':''}" data-k="${g.k}">${icoon(g.af?'vinkje':g.i)}<span>${g.n}</span><small>${g.h}/${g.m}</small></button>`).join('')}</section>
 <section class="lokaal rococo"><div class="lk-kop"><small>Leerjaar ${j} · ${v.n}</small><h2>${v.lokaal}</h2></div>
 <div class="scene" style="background-image:url(img/${v.img}.webp)">${v.taken.map(t=>{const h=S.taken[t[0]];const k=S.keuze[t[0]];return `<div class="obj ${h?'hersteld':'stoffig'} ${M3.nieuw==t[0]?'net':''}" style="left:${t[4][0]}%;top:${t[4][1]}%" title="${t[1]}">${icoon(t[3])}${h&&k!=null&&t[6]?`<small>${t[6][k]}</small>`:''}</div>`}).join('')}<div class="scene-mist" style="opacity:${1-klaar/5}"></div></div>
 <div class="voortgang"><div style="width:${klaar/v.taken.length*100}%"></div></div><p class="lk-tel">${klaar} van ${v.taken.length} taken · ${sterTeller()}</p>
 ${vol?`<button class="knop taak ${S.sterren>=vol[2]?'volgende':''}" id="taakknop">${vol[1]} <span class="kost">${icoon('ster')}${vol[2]}</span></button>`:''}
 <button class="knop speel ${vol&&S.sterren<vol[2]?'volgende':''}" id="speelknop">Spelen · Level ${S.m3lvl}</button></section>
 ${spellenHal()}
 ${tilly(tillyZin(v,vol))}
 <div class="kleinrij"><button class="linkknop" onclick="ga('kas')">Naar de Kassen (${kweekPotten()} ${kweekPotten()==1?'pot':'potten'})</button><button class="linkknop" id="afscheid">Voor nu stoppen</button></div>
 <p class="bronlink"><a href="CREDITS.txt" target="_blank">Bronnen & licenties</a> · weer: <a href="https://open-meteo.com/" target="_blank">Open-Meteo</a></p>`);
 M3.nieuw=null;
 document.querySelectorAll('.dd').forEach(b=>b.onclick=()=>{const g=dd.find(x=>x.k==b.dataset.k);if(!g.af)g.f()});
 $('#speelknop').onclick=()=>ga('match3');$('#afscheid').onclick=()=>{try{afscheid()}catch(e){}};
 const tk=$('#taakknop');if(tk)tk.onclick=()=>doeTaak(v,vol);
 try{loginCheck&&loginCheck()}catch(e){}
 if(!S.verhaalGezien[v.id+j]){S.verhaalGezien[v.id+j]=1;bewaar();setTimeout(()=>verhaal(v.intro),RMP?50:600)}
 else uilenpostCheck();
 potCheck();stats()};
function spellenHal(){const open=BONUS.filter(b=>S.bonusOpen[b[0]]);const dicht=BONUS.find(b=>!S.bonusOpen[b[0]]);return `<section class="halspel"><h3>Spellen</h3><div class="hs-rij"><button class="hs hs-hoofd" onclick="ga('match3')"><i class="rond">${icoon('ster')}</i><b>Level ${S.m3lvl}</b><small>${m3VakVoor(S.m3lvl).n}</small></button>${open.map(b=>`<button class="hs" onclick="ga('${b[0]}')"><i class="rond">${icoon(b[2])}</i><b>${b[1]}</b></button>`).join('')}${dicht?`<button class="hs dicht" onclick="toast('Nog op slot: ${dicht[5].replace(/'/g,'’')}')"><i class="rond">${icoon('slot')}</i><b>${dicht[1]}</b><small>binnenkort</small></button>`:''}</div></section>`}
function tillyZin(v,vol){if(!vol)return 'Alles klaar hier! Ik ben zo benieuwd wat er achter de volgende deur zit.';if(S.sterren>=vol[2])return `We hebben genoeg sterren! Zullen we “${vol[1].toLowerCase()}”? Ik heb er zin in.`;return `Nog ${vol[2]-S.sterren} ${vol[2]-S.sterren==1?'ster':'sterren'} nodig voor “${vol[1].toLowerCase()}”. Eén level en we zijn er bijna. Kom!`}
function doeTaak(v,t){if(S.sterren<t[2]){toast(`Je hebt nog ${t[2]-S.sterren} ster(ren) nodig. Speel een level!`);const b=$('#speelknop');b&&b.classList.add('wijs');return}
 const rond=k=>{S.sterren-=t[2];S.taken[t[0]]=1;if(k!=null)S.keuze[t[0]]=k;tel('taak');S.xp+=15;bewaar();stats();M3.nieuw=t[0];fx.speel('goed');vib([30,40,80]);V.home();
  const o=document.querySelector('.obj.net');if(o){const r=o.getBoundingClientRect();setTimeout(()=>vonk(r.left+r.width/2,r.top+r.height/2,40),300)}
  setTimeout(()=>verhaal([['Tilly',t[5]]],()=>{dagBeloon();bonusCheck();potCheck();if(v.taken.every(x=>S.taken[x[0]]))setTimeout(()=>verhaal(v.outro,()=>{fx.speel('fanfare');V.home()}),300)}),RMP?100:1300)};
 if(t[6]){const o=document.createElement('div');o.className='modal';o.innerHTML=`<div class="modalin rococo keuze"><h2>Kies een stijl</h2><p>${t[1]}</p><div class="kz">${t[6].map((n,i)=>`<button class="kzopt" data-i="${i}"><span class="kzico kz${i}">${icoon(t[3])}</span><b>${n}</b></button>`).join('')}</div>${tilly('O, ik kan niet kiezen! Ze zijn alle drie prachtig. Jij beslist.')}</div>`;document.body.appendChild(o);
  o.querySelectorAll('.kzopt').forEach(b=>b.onclick=()=>{o.remove();rond(+b.dataset.i)})}else rond(null)}
/* elke paar dagen: uilenpost met een extra verhaalmoment */
const POST=[['Tilly','Er kwam een uil voor je, Luna! Een briefje van Professor Stronk: “Voor de beste helpster van de kas.” Er zaten twee sterren bij.'],['Tilly','Uilenpost! Hagrid schrijft dat zijn pompoenen al zo groot zijn als een kruiwagen. En hij stuurt twee sterren mee.'],['Tilly','Een geheimzinnig briefje zonder afzender… alleen twee glinsterende sterren en de woorden: “Kijk vannacht omhoog.”'],['Tilly','Professor Banning stuurt een zwevende kaart: “Bedankt voor de hulp!” Hij danst nog steeds een beetje.']];
function uilenpostCheck(){const nu=Date.now();if(!S.uilenpost){S.uilenpost=nu;bewaar();return}if(nu-S.uilenpost<2*864e5)return;S.uilenpost=nu;S.sterren+=2;bewaar();stats();setTimeout(()=>verhaal([POST[Math.floor(nu/864e5)%POST.length]]),700)}
/* ---------- levelpad ---------- */
V.pad=()=>{const j=Math.max(1,Math.ceil(S.m3lvl/30));const start=(j-1)*30+1;const n=30;const pts=[];for(let i=0;i<n;i++){const y=60+i*86;const x=50+Math.sin(i*.9)*28;pts.push([x,y])}pts.reverse();
 const H=60+n*86;const vs=vakkenVan(j);
 app(`<h2 class="padkop">Leerjaar ${j}</h2><div class="pad" style="height:${H}px"><svg class="padlijn" viewBox="0 0 100 ${H}" preserveAspectRatio="none"><path d="M${pts.map(p=>p.join(' ')).join(' L')}" fill="none" stroke="rgba(246,227,161,.55)" stroke-width="1.6" stroke-dasharray="2 2.5" vector-effect="non-scaling-stroke"/></svg>
 ${pts.map((p,i)=>{const L=start+i;const st=L<S.m3lvl?'af':L==S.m3lvl?'nu':'dicht';const vak=i%6==0?`<div class="padvak" style="top:${p[1]-48}px">${vs[Math.floor(i/6)].n}</div>`:'';return vak+`<button class="padlvl ${st}" data-l="${L}" style="left:${p[0]}%;top:${p[1]}px">${st=='dicht'?icoon('slot'):L}${st=='nu'?`<span class="luna">L</span>`:''}</button>`}).join('')}</div>`);
 document.querySelectorAll('.padlvl').forEach(b=>b.onclick=()=>{const L=+b.dataset.l;if(L<=S.m3lvl)ga('match3',L);else toast('Speel eerst level '+S.m3lvl)});
 setTimeout(()=>{const nu=$('.padlvl.nu');nu&&nu.scrollIntoView({block:'center'})},RMP?0:350)};
/* ---------- bonus ---------- */
V.bonus=()=>{app(`<h2>Bonusspellen</h2>${tilly('Hier spelen we tussendoor. Niet nodig voor de lokalen, maar wel goed voor Galjoenen, kaarten en soms een ster.')}
 <div class="raster bonusraster">${BONUS.map(b=>{const open=S.bonusOpen[b[0]];const v=VAK1.find(x=>x.id==b[3]);return `<button class="tegel ${open?'':'deur-dicht'}" data-b="${b[0]}"><span class="ico">${icoon(open?b[2]:'slot')}</span><b>${b[1]}</b><small>${open?b[5]:`Ontgrendel via ${v.n} (${b[4]} ${b[4]==1?'taak':'taken'})`}</small></button>`}).join('')}</div>`);
 document.querySelectorAll('[data-b]').forEach(t=>t.onclick=()=>{if(S.bonusOpen[t.dataset.b])ga(t.dataset.b);else{t.classList.remove('schud');void t.offsetWidth;t.classList.add('schud');toast('Deze deur is nog op slot. Knap eerst het lokaal verder op!')}})};
const BONUSID=new Set(BONUS.map(b=>b[0]));
/* ---------- meer ---------- */
V.meer=()=>{const T=[['bonus','spel','Alle extra spellen'],['kaart','kaart','Kaart van Zweinstein'],['winkel','winkel','Beloningswinkel'],['groei','hoed','Ontwikkeling & badges'],['kamer','bed','Mijn kamer & huisdier'],['kikker','kikker','Chocokikkers'],['quests','lijst','Opdrachten'],['beker','beker','Afdelingsbeker'],['verhaal','rol','Het verhaal van dit jaar'],['login','kalender','Dagbeloning']];
 app(`<h2>Meer</h2><div class="raster">${T.map(t=>`<button class="tegel" onclick="ga('${t[0]}')"><span class="ico">${icoon(t[1])}</span><b>${t[2]}</b></button>`).join('')}</div>`)};
/* ---------- navigatie (max 5) ---------- */
def('menuVariant','B');const NAV=[['pad','kaart','Kaart'],['kas','bloem','Kassen'],['home','','Hal'],['boek','boek','Boek'],['meer','lijst','Meer']];
nav=function(act){const m={match3:'home',lessen:'meer',les:'meer',bonus:'meer'};const a=BONUSID.has(act)?'home':(m[act]||act);$('#nav').className='menu'+S.menuVariant;$('#nav').innerHTML=NAV.map(t=>t[0]=='home'?`<button class="hal ${a=='home'?'actief':''}" aria-label="Hal" onclick="ga('home')"><span class="halknop">${wapen(46)}</span><span>Hal</span></button>`:`<button class="${t[0]==a?'actief':''}" aria-label="${t[2]}" onclick="ga('${t[0]}')"><i class="rond">${icoon(t[1])}</i><span>${t[2]}</span></button>`).join('')};
const _gaK=ga;ga=function(s,...a){if(BONUSID.has(s)&&!S.bonusOpen[s]&&S.huis){s='bonus';a=[]}if(s=='spel')s='bonus';if(s=='match3'){const v=m3VakVoor(a[0]||S.m3lvl);VIEWDECOR.match3=v.decor}return _gaK(s,...a)};
Object.assign(VIEWDECOR,{pad:'kaart',bonus:'gang',meer:'zaal'});
Object.assign(UITLEG,{match3:['Een level spelen','Veeg een tegel naar een buur om ze te wisselen. Drie of meer op een rij verdwijnen. Vier op een rij geeft een raket, een blok van 2×2 een uil, een L of T een ketelbom en vijf op een rij een regenboogbal. Haal de doelen bovenaan voordat je zetten op zijn.'],pad:['Het levelpad','Elk level levert een ster op. Met sterren knap je de lokalen op.'],bonus:['Bonusspellen','Extra spellen voor tussendoor, met extra beloningen. Nieuwe spellen ontdek je via het verhaal.']});
Object.assign(HINT,{match3:'Tip: kijk onderaan het bord. Daar ontstaan de meeste kettingreacties.',home:'Tip: de gouden knop is altijd je volgende stap.'});
S.tut=Math.max(S.tut||0,9);
// tegels: verticaal wisselen ook vloeiend
bewaar();
if(S.naam&&S.huis)ga('home');
requestAnimationFrame(()=>requestAnimationFrame(()=>document.documentElement.classList.add('klaar')));setTimeout(()=>document.documentElement.classList.add('klaar'),1500);
const _maker=V.maker;V.maker=()=>{_maker();$('#app').insertAdjacentHTML('beforeend',`<div class="kaart"><h3>Menu-stijl</h3><p>Onderbalk: <button class="knop klein" id="mvA">A · alleen iconen</button> <button class="knop klein" id="mvB">B · icoon met tekst</button></p><p class="klein">Nu: variant ${S.menuVariant}</p></div>`);['A','B'].forEach(x=>$('#mv'+x).onclick=()=>{S.menuVariant=x;bewaar();nav('maker');V.maker()})};
