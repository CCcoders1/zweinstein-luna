'use strict';
/* Minigames als eenmalige verhaalmomenten op vaste levels. De eerste keer: een cadeau.
   Daarna oefenen, zonder beloning. Alleen levels (ook opnieuw spelen) geven Smekkies. */
(function(){
const T=(f,ms)=>setTimeout(()=>{try{f()}catch(e){console.warn(e)}},ms||0);
const port=k=>{try{return window.portret?portret(k,'mini'):''}catch(e){return ''}};
const modal=html=>{const o=document.createElement('div');o.className='modal';o.innerHTML=`<div class="modalin rococo mpmodal">${html}</div>`;document.body.appendChild(o);return o};
/* [spel, na level, wie, naam, zin, cadeau, naam van het spel] */
const MP=[
 ['drank',5,'sneep','Professor Sneep','Er borrelt een vergeten ketel in de kerker. Brouw één drankje, precies volgens het recept. Dan zien we of u talent heeft, juffrouw.',{smek:50},'Toverdranken brouwen'],
 ['memory',8,'hagrid','Hagrid','Ik vond een stapel kaartjes met plantentekeningen in de kas. Zoek jij de paren bij elkaar? Professor Stronk zou trots zijn.',{kik:2},'Kruidenkunde-memory'],
 ['spreuk',12,'banning','Professor Banning','Een paar raadsels over spreuken, juffrouw Luna! Raad er vier van de zes goed en u krijgt een beloning.',{smek:100},'Spreuken-raadsels'],
 ['snaai',18,'ron','Ron Wemel','Er zoemt een Gouden Snaai door de gang! Vang hem zo vaak je kunt in twintig seconden.',{bo:{knalpijl:1}},'Snaai vangen'],
 ['lessen',22,'anderling','Professor Anderling','De professoren geven extra lessen. Volg er één en haal een voldoende. Daarna kunt u de rest gerust op uw gemak doen.',{smek:120},'Lessen & examens'],
 ['bonen',27,'ron','Ron Wemel','Fred en George gaven me een zakje Smakkerbonen. Durf jij er een te proeven? Ik niet, er zat er laatst een met oorsmeer in.',{kik:2},'Smakkerbonen'],
 ['toverstok',35,'banning','Professor Banning','Vandaag tekenen we spreuken in de lucht. Volg de lijn met uw vinger.',{bo:{vuurpijl:1}},'Spreuken tekenen'],
 ['mysterie',42,'hagrid','Hagrid','Ik vond een briefje in vreemde letters bij de Maanbloem. Kun jij het ontcijferen? Ik snap er niks van.',{smek:200},'Geheimschrift-mysterie']];
const MPK=Object.fromEntries(MP.map(m=>[m[0],m]));window.MIJLPAAL=MPK;
S.mpAf=S.mpAf||{};S.mpPop=S.mpPop||{};
const open=k=>!!(S.bonusOpen&&S.bonusOpen[k]);
const bereikt=m=>(S.m3lvl|0)>m[1];
/* openen alleen via het level, niet meer via schooldagen of oude taken */
bonusVrij=b=>!!S.bonusOpen[b[0]];bonusCheck=function(){};
function zetOpen(){let v=0;MP.forEach(m=>{if(bereikt(m)&&!open(m[0])){S.bonusOpen[m[0]]=1;v=1}});if(v)bewaar()}
zetOpen();
const cadeauTekst=c=>{const d=[];if(c.smek)d.push(c.smek+' Smekkies');if(c.kik)d.push(c.kik+(c.kik==1?' Chocokikker':' Chocokikkers'));if(c.bo)Object.entries(c.bo).forEach(([k,n])=>d.push(n+'× '+((window.BOOSTERS&&BOOSTERS[k]&&BOOSTERS[k].naam)||k)));return d.join(' en ')};
function geef(c){if(c.smek)S.galjoenen=(S.galjoenen|0)+c.smek;if(c.kik)S.kikkers=(S.kikkers|0)+c.kik;if(c.bo){S.bo=S.bo||{};Object.entries(c.bo).forEach(([k,n])=>S.bo[k]=(S.bo[k]|0)+n)}bewaar();try{stats()}catch(e){}}
const wachtend=()=>MP.find(m=>open(m[0])&&!S.mpAf[m[0]]);
/* eerste keer gespeeld: cadeau */
function klaar(k){const m=MPK[k];if(!m||!open(k)||S.mpAf[k])return;S.mpAf[k]=1;geef(m[5]);
 const toon=(p=0)=>{if(document.querySelector('.modal')){if(p<40)T(()=>toon(p+1),1500);return}
  const o=modal(`<h2>Gelukt!</h2><p>${port(m[2])} <b>${m[3]}:</b> Prachtig gedaan, Luna! Dit is voor jou.</p><p class="mpcadeau">🎁 ${cadeauTekst(m[5])}</p><p class="klein">${m[6]} staat nu bij Spellen in De Hal. Daar kun je het altijd oefenen, maar dan zonder beloning.</p><button class="knop volgende" id="mpok">Dank je wel!</button>`);
  try{fx.speel('fanfare')}catch(e){}o.querySelector('#mpok').onclick=()=>o.remove()};T(()=>toon(),1800)}
window.mijlpaalKlaar=klaar;
const VIEW={memory:'memory',spreuk:'spreuk',mysterie:'mysterie',les:'lessen',lessen:'lessen',snaai:'snaai',bonen:'bonen',bertie:'bonen',toverstok:'toverstok'};
const huidig=()=>VIEW[document.body.dataset.view];
/* beloon (memory, raadsels, mysterie, lessen): herhalen = oefenen, geen Smekkies/huisschild/kist/punten */
const _bel=beloon;beloon=function(id,pt,gal,tekst){const k=huidig();
 if(!/^dag/.test(id)&&S.opgelost&&S.opgelost[id]){S.opgelost[id]++;bewaar();try{fx.goed()}catch(e){}if(k)klaar(k);return tilly((tekst||'Mooi gedaan!')+' Dit was een oefenronde, dus zonder beloning.')}
 const r=_bel(id,pt,gal,tekst);if(k)klaar(k);return r};
const _een=eenmalig;eenmalig=function(key){const r=_een(key);const k=huidig();if(k)klaar(k);return r};
/* ketel: eerste drankje telt */
setInterval(()=>{if(open('drank')&&!S.mpAf.drank&&S.drank&&Object.values(S.drank).some(x=>x>0))klaar('drank')},1500);
/* niet open: niet speelbaar */
const _ga=ga;ga=function(s,...a){if(s=='ketel'&&!open('drank')&&S.huis){toast('De ketel komt vrij vanaf level '+(MPK.drank[1]+1)+'.');return}return _ga(s,...a)};
/* Hal: knop + uitnodiging */
function nodig(m,verder){const o=modal(`<h2>Een bijzonder moment!</h2><p>${port(m[2])} <b>${m[3]}:</b> ${m[4]}</p><p class="mpcadeau">🎁 De eerste keer: ${cadeauTekst(m[5])}</p><button class="knop volgende" id="mpja">Speel nu</button><button class="linkknop" id="mpnee">${verder?'Straks, eerst verder spelen':'Straks'}</button>`);
 o.querySelector('#mpja').onclick=()=>{o.remove();ga(m[0])};o.querySelector('#mpnee').onclick=()=>{o.remove();if(verder)verder()}}
const _home=V.home;V.home=(...a)=>{const r=_home(...a);try{zetOpen();const m=wachtend();if(m&&!document.getElementById('mpknop')){const h=document.getElementById('nieuwles')||document.getElementById('halharten');const app=document.getElementById('app');
  const html=`<div style="text-align:center"><button class="knop volgende nieuwles mpknop" id="mpknop">✨ Bijzonder moment: ${m[6]}</button></div>`;
  if(h)(h.closest('div[style]')||h).insertAdjacentHTML('afterend',html);else app.insertAdjacentHTML('afterbegin',html);
  document.getElementById('mpknop').onclick=()=>nodig(m);
  if(!S.mpPop[m[0]]){let p=0;const toon=()=>{if(S.mpPop[m[0]]||S.mpAf[m[0]])return;if(document.querySelector('.modal,.verhaal')||document.body.dataset.view!=='home'){if(p++<40)setTimeout(toon,3000);return}S.mpPop[m[0]]=1;bewaar();nodig(m)};setTimeout(toon,2500)}}}catch(e){console.warn(e)}return r};
/* Spellen-rij in De Hal */
spellenHal=function(){const L=MP.filter(m=>m[0]!=='drank');const o=L.filter(m=>open(m[0]));const d=L.find(m=>!open(m[0]));
 return `<section class="halspel"><h3>Spellen</h3><div class="hs-rij"><button class="hs hs-hoofd" onclick="ga('match3')"><i class="rond">${icoon('ster')}</i><b>Level ${S.m3lvl}</b><small>${m3VakVoor(S.m3lvl).n}</small></button>${o.map(m=>{const b=BONUS.find(x=>x[0]==m[0]);return `<button class="hs" onclick="ga('${m[0]}')"><i class="rond">${icoon(b?b[2]:'ster')}</i><b>${m[6]}</b><small>${S.mpAf[m[0]]?'oefenen':'nieuw!'}</small></button>`}).join('')}${d?`<button class="hs dicht" onclick="toast('${d[6]} komt vanaf level ${d[1]+1}.')"><i class="rond">${icoon('slot')}</i><b>${d[6]}</b><small>🔒 Vanaf level ${d[1]+1}</small></button>`:''}</div></section>`};
V.bonus=()=>{app(`<h2>Spellen</h2>${tilly('Elk spel komt op een vast moment in je avontuur. De eerste keer krijg je een cadeau. Daarna kun je het oefenen, gewoon voor de lol. Smekkies verdien je met levels.')}
 <div class="raster bonusraster">${MP.filter(m=>m[0]!=='drank').map(m=>{const op=open(m[0]);const b=BONUS.find(x=>x[0]==m[0]);return `<button class="tegel ${op?'':'deur-dicht zwdicht'}" data-mp="${m[0]}"><span class="ico">${icoon(op?(b?b[2]:'ster'):'slot')}</span><b>${m[6]}</b><small>${op?(S.mpAf[m[0]]?'Oefenen':'Nieuw! Eerste keer: '+cadeauTekst(m[5])):'🔒 Vanaf level '+(m[1]+1)}</small></button>`}).join('')}</div>`);
 document.querySelectorAll('[data-mp]').forEach(t=>t.onclick=()=>{const k=t.dataset.mp;if(open(k))ga(k);else toast(MPK[k][6]+' komt vanaf level '+(MPK[k][1]+1)+'.')})};
/* ---------- nog niet van toepassing: gedimd, niet tikbaar, slotje + 'Vanaf level X' ---------- */
window.zwDicht=(el,label,hint)=>{if(!el||el.classList.contains('zwdicht'))return;el.classList.add('zwdicht');el.removeAttribute('onclick');el.onclick=null;el.setAttribute('aria-disabled','true');
 el.insertAdjacentHTML('beforeend',`<small class="zwslot">🔒 ${label}</small>`);el.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();toast(hint||label)},true)};
const VL=n=>'Vanaf level '+n;
const lesOpen=()=>!window.spreukOpen||spreukOpen('flipendo');
const lesVan=()=>(window.SPREUK_VAN&&SPREUK_VAN.flipendo)||3;
const moestuinOpen=()=>!!(S.pomp&&(S.pomp.melding||S.pomp.inh||(S.pomp.g||[]).every(x=>x>=20)));
const heeftKaart=()=>Object.keys(S.kaarten||{}).length>0;
function dimMeer(){const q=s=>document.querySelector(s);
 if(!open('drank'))zwDicht(q('#meerkt'),VL(MPK.drank[1]+1),'De ketel komt vrij vanaf level '+(MPK.drank[1]+1)+'.');
 if(!lesOpen())zwDicht(q('#meerspreuk'),VL(lesVan()),'Professor Banning geeft je eerste les vanaf level '+lesVan()+'.');
 if(!moestuinOpen())zwDicht(q('#meermt'),'Als de pompoenmeter vol is','Maak pompoen-combi’s in de levels. Als de pompoenmeter bovenin vol is, mag je naar Hagrids moestuin.');
 if(!heeftKaart())zwDicht(q('#app [onclick="ga(\'album\')"]'),VL(10),'Je eerste tovenaarskaart krijg je bij level 10.')}
const _meer=V.meer;V.meer=(...a)=>{const r=_meer(...a);try{dimMeer()}catch(e){console.warn(e)}return r};
const _home2=V.home;V.home=(...a)=>{const r=_home2(...a);try{if(!lesOpen())document.querySelectorAll('#app [onclick="ga(\'spreuken\')"]').forEach(b=>zwDicht(b,VL(lesVan()),'Professor Banning geeft je eerste les vanaf level '+lesVan()+'.'))}catch(e){}return r};
if(V.mijnkas){const _mk=V.mijnkas;V.mijnkas=(...a)=>{const r=_mk(...a);try{if(!(S.receptOpen&&S.receptOpen.licht))zwDicht(document.getElementById('balkrecept'),VL(23),'Recepten komen in je boek als je de eerste Duivelsstrik-les haalt (level 22).')}catch(e){}return r}}

/* ---------- winstscherm: 'Verder' speelt meteen het volgende level ---------- */
function speelVolgende(k){if(typeof schoolDagKanStarten=='function'&&!schoolDagKanStarten(k)){ga('pad');let st=null;try{st=schoolDag()}catch(e){}T(()=>toast(st&&k>st.einde?'Rond eerst de doelen van deze schooldag af, dan kun je verder.':'Level '+k+' kan nu nog niet. Kies een level op het pad.'),400);return}ga('match3',k)}
function naWinst(verder){
 zetOpen();const m=wachtend();if(m&&!S.mpPop[m[0]]){S.mpPop[m[0]]=1;bewaar();return nodig(m,()=>naWinst(verder))}
 const L=window.SPREUK_VAN||{};const k=Object.keys(L).find(x=>window.spreukOpen&&spreukOpen(x)&&!spreukGeleerd(x)&&!(S.lesPop||{})[x]);
 if(k&&window.SPREUK_LES){S.lesPop=S.lesPop||{};S.lesPop[k]=1;bewaar();const naam=SPREUK_LES[k].naam;
  const o=modal(`<h2>Nieuwe les!</h2><p>${port('banning')} <b>Professor Banning:</b> Goed gedaan! Je mag nu <b>${naam}</b> leren. Kom je naar mijn les?</p><button class="knop volgende" id="lesja">Naar de les</button><button class="linkknop" id="lesnee">Straks, eerst verder spelen</button>`);
  o.querySelector('#lesja').onclick=()=>{o.remove();ga('spreukles',0,k)};o.querySelector('#lesnee').onclick=()=>{o.remove();verder()};return}
 verder()}
function winKnoppen(n){const ms=[...document.querySelectorAll('.m3eind')];const m=ms[ms.length-1];if(!m)return;const o=m.closest('.modal');if(!o)return;
 o.dataset.geenverder=1;const pv=o.querySelector('.p-verder');if(pv)pv.remove();
 const volg=m.querySelector('#m3volg'),kas=m.querySelector('#m3verder');const leraar=volg&&/^Eerst naar/.test(volg.textContent);
 const weg=()=>{o.remove();document.querySelectorAll('.modal.wacht').length||0};
 if(volg&&!leraar){volg.className='knop volgende';volg.textContent='Verder › Level '+(n+1);volg.onclick=()=>{weg();naWinst(()=>speelVolgende(n+1))}}
 if(kas){kas.className='knop';kas.textContent='Naar de kas';kas.onclick=()=>{weg();naWinst(()=>ga('kas'))}}
 if(volg&&kas&&!leraar)kas.before(volg);
 const hal=document.createElement('button');hal.className='linkknop';hal.textContent='Naar De Hal';hal.onclick=()=>{weg();ga('home')};(kas||volg||m.lastChild).after(hal)}
const _mwV=m3Winst;m3Winst=function(n,b,...a){const r=_mwV.call(this,n,b,...a);try{winKnoppen(n)}catch(e){console.warn(e)}return r};

/* ---------- Alles resetten: alleen in het verborgen makerscherm (logo 3x + 9¾) ---------- */
const HOUD=['zw_muz','zw_vol','zw_stem','zw_sfeer','zw_weer','zw_persist'];
window.zwResetAlles=()=>new Promise(klaar=>{const geluid={stil:S.stil,geluid:S.geluid,gpMelding:S.gpMelding};
 Object.keys(localStorage).filter(k=>(k.startsWith('zw')||k.startsWith('zweinstein'))&&!HOUD.includes(k)).forEach(k=>localStorage.removeItem(k));
 Object.keys(S).forEach(k=>delete S[k]);Object.entries(geluid).forEach(([k,v])=>{if(v!==undefined)S[k]=v});bewaar();
 try{sessionStorage.clear()}catch(e){}
 let klaarGemeld=false;const af=()=>{if(klaarGemeld)return;klaarGemeld=true;klaar()};
 try{const q=indexedDB.open('zweinstein',1);q.onupgradeneeded=()=>q.result.createObjectStore('reserve');q.onsuccess=()=>{try{const db=q.result;const tx=db.transaction('reserve','readwrite');tx.objectStore('reserve').put([],'lijst');tx.oncomplete=af;tx.onerror=af}catch(e){af()}};q.onerror=af}catch(e){af()}
 setTimeout(af,2500)});
const _mkR=V.maker;if(_mkR)V.maker=(...a)=>{const r=_mkR(...a);try{$('#app').insertAdjacentHTML('beforeend',`<section class="kaart sierlijst"><h3>Alles resetten (alleen voor testen)</h3><p class="klein">Wist alle voortgang op deze telefoon: levels, sterren, huisschilden, Smekkies, kas, opdrachten en mijlpalen. Het geluidspakket en de geluidsinstellingen blijven bewaard. Niet op Luna's telefoon gebruiken.</p><button class="knop" id="mkreset">Alles resetten</button></section>`);
 $('#mkreset').onclick=async()=>{if(!confirm('Weet je het zeker? Alle voortgang op deze telefoon wordt gewist.'))return;const t=prompt('Typ RESET om alles te wissen:');if((t||'').trim().toUpperCase()!=='RESET'){toast('Niet gewist.');return}
  await zwResetAlles();location.reload()}}catch(e){console.warn(e)}return r};
})();
