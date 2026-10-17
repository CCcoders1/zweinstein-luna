'use strict';
/* ====== De Kassen: kweeksysteem ====== */
const ZADEN={ // id: [naam, ingrediënt-id, groeitijd (min), prijs, kleur, opbrengst]
 varkensgras:['Varkensgras','varkensgras',5,12,'#9fd8cb',[2,3]],
 valeriaan:['Valeriaan','valeriaan',15,20,'#c8b6ff',[2,3]],
 wolfsmelk:['Wolfsmelk','wolfsmelk',30,25,'#fff1b8',[2,3]],
 alsem:['Alsem','alsem',45,30,'#88c999',[2,3]],
 affodil:['Affodil','affodil',60,40,'#f4a6c0',[2,3]],
 sodejus:['Sodejusplant','sodejus',120,50,'#e6c35c',[1,2]],
 kieuwwier:['Kieuwwier','kieuwwier',180,60,'#9fd8cb',[1,2]],
 mandragora:['Mandragora','mandragora',240,80,'#b6c8ff',[1,2]]};
/* Vanaf welk level een zaadje te koop is (net op tijd voor het recept of de plaag waarvoor het nodig is) */
const ZAAD_VAN={varkensgras:1,valeriaan:1,wolfsmelk:6,alsem:10,affodil:14,sodejus:40,kieuwwier:55,mandragora:58,duivelsstrik:120,tentacula:150,mest:5};window.ZAAD_VAN=ZAAD_VAN;
window.zaadDicht=z=>(S.m3lvl|0)<(ZAAD_VAN[z]||1)?ZAAD_VAN[z]:0;
/* Alleen in de groene pot (tweede pot op de tafel) of een latere pot. */
const GROEN_KRUID=new Set(['duivelsstrik','tentacula','sodejus']);
const POT_BETER_ZIN='Volgens mij heb ik een betere pot nodig hiervoor.';
function potPlek(i){return i>=100?i-100:i}
function heeftGroenePot(){return (S.potUpgrade|0)>=1}
function potIsBeter(i){return potPlek(i)>=1}
function kruidMag(z,i){return !GROEN_KRUID.has(z)||potIsBeter(i)}
function kruidSlot(z){return GROEN_KRUID.has(z)&&!heeftGroenePot()}
function potMelding(b){toast(POT_BETER_ZIN);try{fx.speel('fout')}catch(e){}if(b){b.classList.add('schud');setTimeout(()=>b.classList.remove('schud'),400)}}
const FASEN=['Zaadje','Kiemplantje','Jonge plant','Knop','Bloeiend – klaar om te oogsten'];
def('kweek',{});def('zaden',{varkensgras:1});def('mest',1);def('oogst',{});def('kweekOpdr',0);
const KOPDR=[['mandragora',3,'Kweek 3 Mandragora’s voor Professor Stronk','Professor Stronk','Drie gezonde Mandragora’s! Daar kan de hele klas mee oefenen. Dank je wel, juffrouw Leeflang.',[3,40]],
 ['valeriaan',4,'Kweek 4 bossen valeriaan voor de ziekenzaal','Tilly','Madame Plijster was er zó blij mee. Ze gaat er slaapdrankjes van maken.',[2,25]],
 ['alsem',3,'Kweek 3 keer alsem voor Professor Sneep','Professor Sneep','Hm. Bruikbaar. Zeer… bruikbaar.',[2,30]],
 ['affodil',3,'Kweek 3 keer affodil voor het Vocht van de Levende Dood','Tilly','Nu hebben we álles voor het Vocht van de Levende Dood. Spannend!',[3,30]],
 ['kieuwwier',2,'Kweek 2 kieuwwier voor de toverwedstrijd bij het meer','Tilly','Wie dit eet, kan een uur onder water ademen. Zullen we het niet uitproberen in de vijver?',[3,40]]];
function kOpdr(){for(let i=0;i<KOPDR.length;i++){const o=KOPDR[(S.kweekOpdr+i)%KOPDR.length];if(!kruidSlot(o[0]))return o}return KOPDR[S.kweekOpdr%KOPDR.length]}
function kOpdrTel(){const o=kOpdr();return Math.min(o[1],(S.oogst[o[0]+'#'+S.kweekOpdr]||0))}
function pot(i){return S.kweek[i]||null}
function stadium(p){if(!p)return -1;const tot=ZADEN[p.z][2]*6e4;const gedaan=Date.now()-p.t+p.bonus;return Math.min(4,Math.floor(gedaan/tot*4+(gedaan>=tot?1:0)))}
function rest(p){const tot=ZADEN[p.z][2]*6e4;return Math.max(0,tot-(Date.now()-p.t+p.bonus))}
const tijd=ms=>{const m=Math.ceil(ms/6e4);return m>=60?`${Math.floor(m/60)} u ${m%60?m%60+' min':''}`:`${m} min`};
function buitNaam(id){try{const it=ITEMS[id];if(it&&it[1])return it[1]}catch(e){}return (ZADEN[id]&&ZADEN[id][0])||'oogst'}
V.kas=()=>{VIEWDECOR.kas='kas';const o=kOpdr();
 app(`<h2>De Kassen</h2>
 <section class="kweekopdr rococo"><small>Opdracht van ${o[3]}</small><b>${o[2]}</b><div class="voortgang"><div style="width:${kOpdrTel()/o[1]*100}%"></div></div><small>${kOpdrTel()} van ${o[1]} · beloning ${o[5][0]} sterren + ${o[5][1]} Smekkies</small></section>
 <div class="kweekbalk"><button class="knop klein" id="zwinkel">${icoon('winkel')} Zadenwinkel</button><button class="knop klein" id="potwinkel">Potten</button><span class="voorraad">${icoon('blad')} ${Object.values(S.zaden).reduce((a,b)=>a+b,0)} zaadjes · ${icoon('vuur')} ${S.mest} drakenmest</span></div>
 <p class="klein kasverwijs">Koop hier je zaadjes. In je eigen kas tik je op de standaardpot en kies je een zaadje. Mooiere potten en de grote vloerpot staan in Potten.</p>
 ${tilly(kweekZin())}`);
 $('#zwinkel').onclick=()=>zadenwinkel();const pw=$('#potwinkel');if(pw)pw.onclick=()=>window.potWinkel&&window.potWinkel();
 clearTimeout(V.kas._t);V.kas._t=setTimeout(()=>{if(document.body.dataset.view=='kas'&&!document.querySelector('.modal'))V.kas()},30000)};
function spat(el,kl){try{const r=el.getBoundingClientRect();vonk(r.left+r.width/2,r.top,14,kl,3)}catch(e){}}
function kweekZin(){const rijp=Object.keys(S.kweek).filter(i=>stadium(S.kweek[i])==4).length;if(rijp)return `Luna! Er ${rijp==1?'is iets':'zijn '+rijp+' planten'} klaar om te oogsten. Ik hoor de bladeren ritselen van ongeduld.`;
 if(!Object.keys(S.kweek).length)return 'Een lege pot is eigenlijk een belofte. Koop een zaadje en plant het in je eigen kas, achter de deur. Varkensgras groeit lekker snel.';return 'In je eigen kas geef je water en drakenmest. Dat helpt echt, al knijp ik bij mest wel mijn neus dicht.'}
function plantKies(i){const o=document.createElement('div');o.className='modal';const teken=()=>{
 o.innerHTML=`<div class="modalin rococo"><h2>Wat planten we?</h2><p class="klein">${i>=200?'Deze Megapot is voor de Vleesetende plant en Duivelsstrik.':potPlek(i)>=3?'Power-upplanten groeien in de Kristalpot en Hartpot.':potIsBeter(i)?'In deze pot mogen ook de bijzondere kruiden.':'Een paar kruiden willen een grotere pot. Die staan grijs.'}</p><div class="zlijst">${Object.entries(ZADEN).filter(([z])=>i>=200?MEGAPOT_ZADEN.has(z):!MEGAPOT_ZADEN.has(z)).map(([z,d])=>{const n=S.zaden[z]||0,mag=kruidMag(z,i);return `<button class="zkies ${mag?'':'potslot'}" data-z="${z}">${plantSVG(4,d[4],z)}<b>${d[0]}</b><small>${mag?(n?`×${n} · ${tijd(d[2]*6e4)}`:'nog geen zaadje'):'andere pot nodig'}</small></button>`}).join('')}</div><p class="potmelding" id="potmelding"></p><button class="knop klein" id="naarwinkel">${icoon('winkel')} Zadenwinkel</button><button class="linkknop" id="zx">Toch niet</button></div>`;
 o.querySelector('#naarwinkel').onclick=()=>{o.remove();zadenwinkel(()=>plantKies(i))};o.querySelector('#zx').onclick=()=>o.remove();
 o.querySelectorAll('.zkies').forEach(b=>b.onclick=()=>{const z=b.dataset.z;if(!kruidMag(z,i)){const m=o.querySelector('#potmelding');if(m)m.textContent=POT_BETER_ZIN;potMelding(b);return}if(!S.zaden[z]){toast(window.SUPERPLANTEN&&SUPERPLANTEN[z]?'Dit zaadje koop je niet. '+ALLEEN_CADEAU:'Eerst een zaadje kopen in de zadenwinkel.');try{fx.speel('fout')}catch(e){}return}S.zaden[z]--;S.kweek[i]={z,t:Date.now(),bonus:0,nat:0,goud:Math.random()<.08};tel('plant');bewaar();o.remove();fx.speel('goed');vib(30);(document.body.dataset.view==='mijnkas'&&V.mijnkas?V.mijnkas:V.kas)();const k=document.querySelector(`.kpot[data-i="${i}"]`);k&&(k.classList.add('nieuw'),spat(k,['#a8ffcf','#e8fff0']))})};document.body.appendChild(o);teken()}
function zadenwinkel(daarna){const o=document.createElement('div');o.className='modal';const teken=()=>{o.innerHTML=`<div class="modalin rococo"><h2>Zadenwinkel</h2><p class="klein smekwinkel"><img src="img/smekkies/boon-oranje-64.webp" alt=""> Je hebt ${S.galjoenen} Smekkies.</p><div class="zlijst">${Object.entries(ZADEN).filter(([z])=>!(window.SUPERPLANTEN&&SUPERPLANTEN[z])).map(([z,d])=>{const dicht=zaadDicht(z),slot=!dicht&&kruidSlot(z);return `<button class="zkoop ${slot||dicht?'potslot':''}" data-z="${z}">${plantSVG(4,d[4],z)}<b>${d[0]}</b><small>${dicht?'vanaf level '+dicht:slot?'grotere pot nodig':(GROEN_KRUID.has(z)?'alleen een grotere pot · ':'')+tijd(d[2]*6e4)+' · '+d[3]+' Smekkies'}</small><small>${dicht?'nog niet te koop':slot?'niet in een kleine pot':'levert '+buitNaam(d[1])}</small></button>`}).join('')}<button class="zkoop ${zaadDicht('mest')?'potslot':''}" data-z="mest"><div class="mestico">${icoon('vuur')}</div><b>Drakenmest</b><small>${zaadDicht('mest')?'vanaf level '+zaadDicht('mest'):'halveert groeitijd · 50 Smekkies'}</small></button></div><p class="potmelding" id="potmelding"></p>${tilly(heeftGroenePot()?'De groene pot kan Duivelsstrik, Tentacula en Sodejus aan. De kleine standaardpot niet.':'Psst, de grijze zaadjes willen niet in een kleine pot. Volgens mij heb ik een betere pot nodig hiervoor.')}<button class="knop" id="zwk">Klaar</button></div>`;
  o.querySelectorAll('.zkoop').forEach(b=>b.onclick=()=>{const z=b.dataset.z;if(zaadDicht(z)){toast('Dit is te koop vanaf level '+zaadDicht(z)+'.');return}if(z!='mest'&&kruidSlot(z)){const m=o.querySelector('#potmelding');if(m)m.textContent=POT_BETER_ZIN;potMelding(b);return}const prijs=z=='mest'?50:ZADEN[z][3];if(S.galjoenen<prijs){toast('Niet genoeg Smekkies. Speel een level!');fx.speel('fout');return}S.galjoenen-=prijs;if(z=='mest')S.mest++;else S.zaden[z]=(S.zaden[z]||0)+1;bewaar();stats();fx.speel('munt');vib(15);toast((z=='mest'?'Drakenmest':ZADEN[z][0]+'-zaadje')+' gekocht');teken()});o.querySelector('#zwk').onclick=()=>{o.remove();if(typeof daarna==='function')daarna();else V.kas()}};teken();document.body.appendChild(o)}
function oogsten(i){if(pot(i)&&pot(i).z=='flessenbes'){try{const k=document.querySelector(`.kpot[data-i="${i}"]`);if(k){spat(k,['#ff3a5a','#a05aff','#ffd76a','#4aa8ff']);k.classList.add('knal');fx.speel('splat')}}catch(e){}}const p=pot(i),d=ZADEN[p.z],power=SUPERPLANTEN&&SUPERPLANTEN[p.z];let n=power?0:d[5][0]+Math.round(Math.random()*(d[5][1]-d[5][0]));if(p.goud&&!power)n*=2;
 if(power)Object.entries(power.oogst).forEach(([k,v])=>S.bo[k]=(S.bo[k]||0)+v*(p.goud?2:1));else{S.tas[d[1]]=(S.tas[d[1]]||0)+n;S.nieuwBuit=(S.nieuwBuit||0)+n;S.oogst[p.z]=(S.oogst[p.z]||0)+1}const o=kOpdr();if(!power&&o[0]==p.z)S.oogst[p.z+'#'+S.kweekOpdr]=(S.oogst[p.z+'#'+S.kweekOpdr]||0)+1;
 if(p.goud){S.schilden++}tel('oogst');delete S.kweek[i];S.xp+=5;bewaar();stats();
 const k=document.querySelector(`.kpot[data-i="${i}"]`);if(k){k.classList.add('oogsten');spat(k,p.goud?['#ffd700','#fff3b0']:['#a8ffcf','#e8fff0'])}
 fx.speel(p.goud?'fanfare':'goed');vib(p.goud?[40,30,120]:[30,30]);
 for(let j=0;j<Math.min(n,4);j++)if(!power)setTimeout(()=>{try{buitVlucht(d[1])}catch(e){}},300+j*250);
 setTimeout(()=>{if(power){const beloning=Object.entries(power.oogst).map(([k,v])=>`${v*(p.goud?2:1)} ${BOOSTERS[k].naam}`).join(', ');try{gids(`${power.naam} geoogst! Je hebt nu ${beloning} klaar voor een volgende ronde.`,{})}catch(e){toast(`Geoogst: ${beloning}`)}}if(p.goud)verhaal([['Tilly',`Luna… kijk! Een <b>gouden oogst</b>! ${n}× ${buitNaam(d[1])}, en de bladeren glanzen als Smekkies. Dat zie je maar zelden. (+1 huisschild, +25 Smekkies)`]]);
  if(kOpdrTel()>=o[1]){S.kweekOpdr++;S.schilden+=o[5][0];S.galjoenen+=o[5][1];bewaar();stats();verhaal([[o[3],o[4]],['Tilly',`Opdracht klaar! +${o[5][0]} sterren en +${o[5][1]} Smekkies.`]])}
  try{dagBeloon()}catch(e){}V.kas()},RMP?100:1100)}
/* ingrediënten ook bruikbaar bij taken: Herbologie-mesttaak kan met drakenmest */
/* dagdoel koppeling */
const _dd=dagDoelen;dagDoelen=function(){const l=_dd();const d=vandaag();const h=((S.tel[d]||{}).oogst)||0;const o=kOpdr();
 l.splice(1,1,{n:new Date().getDate()%2?`Oogst iets in de Kassen voor ${o[3]}`:'Oogst een plant in de Kassen',h:Math.min(h,1),m:1,f:()=>ga('kas'),i:'bloem',af:h>=1,k:d+1});return l};
/* melding in de Hal als er iets rijp is */
function rijpTeller(){return Object.keys(S.kweek).filter(i=>S.kweek[i]&&stadium(S.kweek[i])==4).length}
const _navK=nav;nav=function(a){_navK(a);const n=rijpTeller();const b=document.querySelector('#nav button[onclick*="kas"] .rond');if(b&&n)b.insertAdjacentHTML('beforeend',`<em class="rijp-badge">${n}</em>`)};
setInterval(()=>{if(rijpTeller()&&!document.querySelector('.rijp-badge'))nav(document.body.dataset.view)},60000);
/* ---------- klasgenoot-toon voor oude teksten ---------- */
Object.assign(UITLEG,{drank:['Toverdranken brouwen','Kijk, het recept staat boven de ketel. Tikken we de ingrediënten in de goede volgorde erin? Daarna roeren met je vinger, in rondjes. Ik hou de hint-knop voor ons in de gaten.'],
 herken:['Welke drank is dit?','Ik lees de beschrijving voor, jij raadt welke drank het is. Ik denk dat ik het weet, maar ik zeg niks!'],
 memory:['Plantenkaartjes','Professor Stronk heeft kaartjes met planten omgedraaid. Twee dezelfde vinden? Dan blijven ze open. Jij links, ik rechts… grapje, jij mag alles.'],
 spreuk:['Spreuken raden','Ik lees voor wat een spreuk doet, en jij kiest welke het is. Ik oefen stiekem mee.'],
 mysterie:['Het mysterie','Er liggen geheime boodschappen verstopt. Samen ontcijferen? De hint verklapt welk soort code het is.'],
 lessen:['Lessen','Extra lessen, voor als we nieuwsgierig zijn. Les 1 en 2 halen, dan mogen we zelfs examen doen!'],
 les:['Samen in de les','De professor vertelt eerst iets en dan komen de vragen. Na elk antwoord krijgen we uitleg. Ik zit naast je.'],
 snaai:['Snaai vangen','Hij is zó snel! Druk op Start en tik zo vaak je kunt op die Snaai.'],
 toverstok:['Spreuken tekenen','Teken met je vinger de beweging onder de spreuk, groot en in één keer. Zwiepen en tikken!'],
 kikker:['Chocokikkers','Voorzichtig openmaken: ze springen echt weg! De kaart mogen we houden.'],
 kamer:['Onze slaapzaal','Kies een huisdier en zorg er elke dag even voor. En maak het gezellig, met planten natuurlijk.'],
 winkel:['De winkel','Hier ruil je je Smekkies voor échte beloningen. Ik ben benieuwd wat jij kiest!'],
 kaart:['De Sluipwegwijzer','Tik op een plek en we gaan erheen. De grijze plekken gaan open als we verder komen.'],
 kas:['De Kassen','In de zadenwinkel koop je zaadjes. Achter de deur, in je eigen kas, plant je ze in een pot, geef je water en oogst je als ze bloeien.']});
Object.assign(HINT,{drank:'Psst… kijk naar het recept boven de ketel. De volgorde staat er gewoon! Of zullen we op Hint tikken?',memory:'Volgens mij lag de Mandragora ergens in een hoek. Zullen we rij voor rij zoeken?',spreuk:'Ik denk aan het Latijn: “lumen” is licht, “reparare” is herstellen. Helpt dat?',mysterie:'Zullen we op Hint tikken? Daar staat hoe ver de letters verschoven zijn.',les:'Lees de vraag nog eens rustig. De uitleg van de vorige vraag hielp mij ook.',toverstok:'Groot tekenen, midden op het perkament, in één beweging. Zo lukt het mij ook.',kaart:'Die plekken met een gouden rand, daar kunnen we heen!',herken:'Felix Fortunatis is vloeibaar geluk. Amortentia ruikt naar wat jij het lekkerst vindt. Ik ruik… versgemaaid gras.',kas:'Koop een zaadje in de winkel en plant het in je eigen kas, achter de deur. Water maakt het 25% sneller.'});
