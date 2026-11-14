'use strict';
/* Wintermagie: 1 december t/m 6 januari, zonder tijdsdruk.
   Testdatum: localStorage zw_testdatum (of oude zw_hwdatum), via het makerscherm. */
(()=>{
const pad=n=>String(n).padStart(2,'0');
window.zwNu=function(){
  const o=localStorage.getItem('zw_testdatum')||localStorage.getItem('zw_hwdatum');
  const n=new Date();
  if(o&&/^\d{4}-\d\d-\d\d$/.test(o)){const[y,m,d]=o.split('-').map(Number);return new Date(y,m-1,d,n.getHours(),n.getMinutes())}
  return n};
const dag0=d=>{const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setHours(0,0,0,0);return x};
function seizoenVan(d){
  const x=dag0(d),y=x.getFullYear(),m=x.getMonth(),dd=x.getDate();
  const start= (m===0&&dd<=6) ? new Date(y-1,11,1) : new Date(y,11,1);
  start.setHours(0,0,0,0);
  const eind=new Date(start.getFullYear()+1,0,6);eind.setHours(23,59,59,0);
  const teaserVan=new Date(start.getFullYear(),10,14);
  const i=Math.round((x-start)/864e5);
  const aan=x>=start&&x<=eind;
  const voor=x>=teaserVan&&x<start?Math.round((start-x)/864e5):0;
  const na=x>eind&&x.getFullYear()===eind.getFullYear()&&x.getMonth()===0&&dd<=20;
  return {d,x,start,eind,j:start.getFullYear(),i,aan,voor,na,sint:aan&&x.getMonth()===11&&x.getDate()===5,kerst:aan&&x.getMonth()===11&&x.getDate()===25,dagen:37};
}
const stand=()=>seizoenVan(zwNu());
window.zwWinterStand=stand;

const W=()=>{const st=stand();if(!S.wm||S.wm.j!==st.j)S.wm={j:st.j,tot:0,stap:0,raad:{},sc:{},feest:0,sint:0,lv:0};return S.wm};
const x2=()=>stand().kerst?2:1;

const VLOK=`<svg class="wmvlok" viewBox="0 0 32 32" aria-hidden="true"><g fill="none" stroke="#d7eefe" stroke-width="1.6" stroke-linecap="round"><path d="M16 3v26M5 9.5l22 13M5 22.5l22-13"/><path d="M16 7l-3-3M16 7l3-3M16 25l-3 3M16 25l3 3M8 11l-4 0M8 11l-2-3M24 21h4M24 21l2 3M8 21H4M8 21l-2 3M24 11h4M24 11l2-3"/></g></svg>`;

const KAARTEN_WM=[
  ['De Winteruil','Z','Een sneeuwwitte uil met rijp op de veren. In de winter brengt hij post die naar dennen en kaneel ruikt.','img/kaarten/de-winteruil.webp','Feestdagen'],
  ['Sinterklaas op Zweinstein','Z','Op 5 december zet Hagrid stiekem een schoen bij de haard van de Hal. De volgende ochtend ligt er altijd een rotskoekje in, en soms een briefje.','img/kaarten/sinterklaas-op-zweinstein.webp','Feestdagen'],
  ['Het Kerstfeest in de Grote Zaal','L','Twaalf kerstbomen, berijpt fruit en een plafond vol sneeuw dat binnen niet smelt. De zevende kaars knipoogt extra vriendelijk.','img/kaarten/het-kerstfeest-in-de-grote-zaal.webp','Feestdagen'],
  ['De Sneeuwbloem van Kas Zeven','Z','Een bloem die alleen bloeit als er sneeuw op het glas van kas zeven ligt. In haar kelk zit een zilveren druppel, als een bevroren groet van B.L.','img/kaarten/de-sneeuwbloem-van-kas-zeven.webp','Feestdagen'],
  ['Rijp op kas zeven','Z','Op een winterochtend lag het rijp in de vorm van een hartje op het glas. Niemand veegde het weg.','img/kaarten/rijp-op-kas-zeven.webp','Feestdagen'],
  ['De zevende kaars','L','Zes vlammen branden, de zevende wacht. Onder het sterrenplafond lijkt ze toch te groeten.','img/kaarten/de-zevende-kaars.webp','Feestdagen']
];
function zetKaart(naam){S.kaarten=S.kaarten||{};const nw=!S.kaarten[naam];S.kaarten[naam]=(S.kaarten[naam]||0)+1;try{window.serieNaKaart&&serieNaKaart(nw)}catch(e){}return (nw?'Nieuw in je album: ':'Die had je al: ')+naam}
function voegSerie(){try{
  KAARTEN_WM.forEach(k=>{
    if(typeof META==='object'&&META)META[k[0]]=[k[3],k[4]];
    const al=typeof KAARTEN!=='undefined'&&KAARTEN.find(x=>x[0]===k[0]);
    if(al){al[3]=k[3];al[4]=k[4];if(al[5]==null)al[5]=1}
    else if(typeof KAARTEN!=='undefined')KAARTEN.push([k[0],k[1],k[2],k[3],k[4],1]);
  });
  if(window.KAARTSERIES&&!KAARTSERIES.includes('Feestdagen'))KAARTSERIES.push('Feestdagen');
}catch(e){}}
voegSerie();

const STAP=[
  {n:40,ico:'✨',t:'Een handvol Smekkies',g:()=>{S.galjoenen+=15;return '+15 Smekkies, als rijp in je zakje.'}},
  {n:90,ico:'🃏',t:'Kaart: De Winteruil',g:()=>zetKaart('De Winteruil')},
  {n:160,ico:'✨',t:'Smekkies uit de sneeuw',g:()=>{S.galjoenen+=20;return '+20 Smekkies.'}},
  {n:240,ico:'🃏',t:'Kaart: Sinterklaas op Zweinstein',g:()=>zetKaart('Sinterklaas op Zweinstein')},
  {n:360,ico:'✨',t:'Een warme slok Smekkies',g:()=>{S.galjoenen+=25;return '+25 Smekkies.'}},
  {n:480,ico:'🃏',t:'Kaart: Het Kerstfeest in de Grote Zaal',g:()=>zetKaart('Het Kerstfeest in de Grote Zaal')},
  {n:650,ico:'🏆',t:'De Sneeuwbloem en een titel',g:()=>{const k=zetKaart('De Sneeuwbloem van Kas Zeven');S.galjoenen+=40;S.titels=S.titels||[];if(!S.titels.includes('Wintertuinierster'))S.titels.push('Wintertuinierster');S.wmTrofee=S.wmTrofee||[];if(!S.wmTrofee.includes(W().j))S.wmTrofee.push(W().j);return k+' · titel Wintertuinierster · +40 Smekkies. De sneeuwbloem staat in je kamer.'}}
];
const volgende=()=>STAP[W().stap]||null;
const open=()=>{const h=W();return h.stap<STAP.length&&h.tot>=STAP[h.stap].n};

const SC=[
  {d:0,t:'Rijp op kas zeven',w:'Tilly',x:'Vanmorgen lag er rijp op het glas van kas zeven, in de vorm van een hartje. Precies zoals dat eerste blaadje. Ik heb het niet weggeveegd.',c:'Hij laat een groet achter in de kou. We groeten terug, en we haasten ons niet.'},
  {d:4,t:'Een schoen bij de haard',w:'Hagrid',x:'Ik zet elk jaar een schoen bij de haard, Luna. Voor de Sint, of voor wie er maar langs komt. Vorig jaar zat er een rotskoekje in. En een briefje: “Voor de tuinman, als hij het koud heeft.”',c:'Ik bewaar die briefjes bij de pompoenzaden. Sommige tradities zijn gewoon vriendelijkheid met een datum.'},
  {d:14,t:'De sneeuwbloem',w:'Professor Stronk',x:'Er is een bloem die alleen bloeit als er sneeuw op kas zeven ligt. Lindaroos kende haar. U hoeft haar niet te plukken. Kijken is al genoeg.',c:'Sommige planten zijn een brief. Die lees je, en dan laat je ze staan.'},
  {d:24,t:'Kerstavond in de kas',w:'Tilly',x:'Het plafond in de Hal sneeuwt, en in de kas is het stil en warm. De zevende kaars heeft vanavond een heel klein sterretje van rijp op de houder.',c:'Ik denk dat hij kerstfeest viert, op zijn eigen manier. Wij ook, gewoon door te blijven verzorgen.'},
  {d:30,t:'Een druppel in de kelk',w:'Bartholomeus Lindaroos',x:'Als de sneeuw smelt, blijft er een zilveren druppel in de sneeuwbloem achter. Dat is geen toverdrank. Dat is een dank je wel, bewaard tot iemand de tuin weer kent.',c:'Jij kende haar al. Drink de druppel niet op. Bewaar het gevoel.'}
];
const RA=[
  ['Wat ligt er in de winter op het glas van kas zeven, in de vorm van een hartje?','Rijp','IJspegels','Chocokikkers',0,'Kijk maar, Luna. Het is vriendelijk, niet koud.'],
  ['Op welke datum zet Hagrid een schoen bij de haard?','5 december','24 december','31 oktober',0,'Sinterklaas. Een Nederlandse knipoog, midden in een Engels kasteel.'],
  ['Welke bloem bloeit alleen als er sneeuw op kas zeven ligt?','De sneeuwbloem','Mandragora','Duivelsstrik',0,'Stronk zei: kijken is al genoeg.'],
  ['Wat sneeuwt er in de Grote Zaal met Kerst, zonder nat te worden?','Het plafond','De kerstbomen','De ketels',0,'Toverij, en een beetje huiselijkheid.'],
  ['Hoe roerde Lindaroos bij extracten die van de maan hielden?','Linksom','Rechtsom','Helemaal niet',0,'Sneep zei het bijna per ongeluk.'],
  ['Wat ontbreekt er aan de kandelaar, boven en beneden?','De zevende vlam','De gieter','Het etiket',0,'Eén vlam, twee hemelen.'],
  ['Wat hoort er bij Sinterklaas, en soms in Hagrids schoen?','Een rotskoekje','Een draak','Een Tijdverdrijver',0,'Niet bijten op de harde stukjes.'],
  ['Welke titel past bij iemand die een wintertuin verzorgt?','Wintertuinierster','Sneeuwjager','IJskoningin',0,'Verzorgen klinkt mooier dan winnen.'],
  ['Wat verwelkt bij leugens, en bloeit bij maanlicht?','Wat in het briefje stond','Duivelsstrik','Een Smekkie',0,'We blijven eerlijk, ook in de winter.'],
  ['Wanneer is het Kerstfeest in de Grote Zaal?','25 december','5 december','1 januari',0,'Twaalf bomen, en een kaars die knipoogt.'],
  ['Wie vroeg Hagrid te letten op een lichtje in de moestuin?','Een tuinman, B.L.','Professor Sneep','De Sint',0,'Hagrid heeft woord gehouden, de hele winter door.'],
  ['Wat zeg je tegen een deur die op een kier gaat?','We komen helpen','Open sesam','Alohomora, en vlug',0,'Lupos gaf ons die zin. Hij past ook in de sneeuw.']
];

const geef=(n)=>{const h=W();h.tot+=n;bewaar();kaartVerf();if(open())wijsOpen()};
function wijsOpen(){try{if(document.body.dataset.view==='winter')V.winter()}catch(e){}}

/* vlokken in levels */
const chip=()=>{if(!stand().aan)return null;let c=document.getElementById('wmchip');const hud=document.querySelector('.m3hud');if(!hud)return null;if(!c){hud.insertAdjacentHTML('beforeend',`<div id="wmchip" class="wmchip" title="Sneeuwvlokjes">${VLOK}<b>0</b></div>`);c=document.getElementById('wmchip')}return c};
if(typeof m3Winst==='function'){const _w=m3Winst;m3Winst=function(n,b){const r=_w.apply(this,arguments);try{if(stand().aan&&b&&!b.sim&&!b._wmWin){b._wmWin=1;const k=3*x2();geef(k);W().lv++;const c=chip();if(c){const s=c.querySelector('b');if(s)s.textContent=(hTot())}} }catch(e){}return r}}
function hTot(){return (W().tot)|0}
setInterval(()=>{try{if(!stand().aan||document.body.dataset.view!=='match3'||typeof M3==='undefined')return;const b=M3.b;if(!b||b.sim)return;const c=chip();if(c){const s=c.querySelector('b');if(s)s.textContent=hTot()}}catch(e){}},2000);
if(typeof Bord==='function'&&Bord.prototype.telDoel){const _td=Bord.prototype.telDoel;Bord.prototype.telDoel=function(t){try{if(!this.sim&&stand().aan&&typeof M3!=='undefined'&&this===M3.b&&this._wmN==null)this._wmN=0;if(!this.sim&&stand().aan&&typeof t==='number'&&Math.random()<.12){const n=1*x2();W().tot+=n;this._wmN=(this._wmN|0)+n}}catch(e){}return _td.apply(this,arguments)}}

/* sneeuw in de Hal */
function sneeuw(){
  const st=stand();
  let d=document.getElementById('wmdecor');
  document.body.classList.toggle('winter',!!(st.aan||st.voor));
  document.body.classList.toggle('wmfeest',!!(st.aan&&st.kerst));
  document.body.classList.toggle('wmsint',!!(st.aan&&st.sint));
  if(!(st.aan||st.voor)){if(d)d.remove();return}
  if(!d){d=document.createElement('div');d.id='wmdecor';d.setAttribute('aria-hidden','true');document.body.appendChild(d)}
  if(!d.childElementCount){const n=(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)?8:12;d.innerHTML=Array.from({length:n},(_,i)=>`<i style="--i:${i};--d:${(i*1.7%7).toFixed(1)}s;--x:${(i*17%100)}%"></i>`).join('')}
}
setInterval(sneeuw,2000);sneeuw();

const dagenTxt=st=>{if(st.kerst)return 'vandaag is het Kerstfeest';if(st.sint)return 'vandaag is het Sinterklaas';const rest=Math.max(0,36-st.i);return rest<=1?'laatste winterdag':'nog '+rest+' dagen winter'};
function kaartOpen(){try{return sessionStorage.getItem('wmkaartOpen')==='1'}catch(e){return false}}
function zetKaartOpen(v){try{sessionStorage.setItem('wmkaartOpen',v?'1':'0')}catch(e){}}
function kaartHtml(){
  const st=stand(),h=W();
  const bel=st.aan&&open();
  const wijd=kaartOpen()||bel;
  const chev=wijd?'▴':'▾';
  if(!st.aan){if(st.voor)return `<section class="wmkaart wmteaser rococo ${wijd?'':'wmcompact'}" id="wmkaart"><button type="button" class="wmk-lijn" id="wmklijn">${VLOK}<div><h3>Wintermagie komt eraan</h3><small>Vanaf 1 december</small></div><span class="wmk-chev" aria-hidden="true">${chev}</span></button><div class="wmk-extra"${wijd?'':' hidden'}><p class="klein">Sneeuw, Sinterklaas en Kerst in de Hal. Geen haast, het komt vanzelf.</p><button type="button" class="knop klein" id="wmnaar">Kijk alvast</button></div></section>`;return ''}
  const v=volgende(),vorig=h.stap?STAP[h.stap-1].n:0,p=v?Math.min(100,(h.tot-vorig)/Math.max(1,v.n-vorig)*100):100;
  const nieuwSc=SC.some((s,i)=>s.d<=st.i&&!h.sc[i]),raad=raadNu()!=null;
  const kop=st.kerst?'Kerstfeest':st.sint?'Sinterklaas':'Wintermagie';
  return `<section class="wmkaart rococo ${st.kerst?'wmfk':''} ${st.sint?'wmsfk':''} ${wijd?'':'wmcompact'}" id="wmkaart"><button type="button" class="wmk-lijn" id="wmklijn">${VLOK}<div><h3>${kop}</h3><small>${dagenTxt(st)}${bel?' · beloning klaar':''}</small></div><span class="wmk-tel">${VLOK}<b>${h.tot}</b></span><span class="wmk-chev" aria-hidden="true">${chev}</span></button>
    <div class="wmk-extra"${wijd?'':' hidden'}>
    <div class="wmk-balk"><i style="width:${p.toFixed(0)}%"></i></div>
    <p class="wmk-volg">${bel?'<b class="wmk-klaar">✨ Een beloning is klaar!</b>':v?`Volgende: ${v.ico} ${v.t} <b>bij ${v.n} vlokjes</b>`:'Alle winterbeloningen verdiend.'}</p>
    ${nieuwSc||raad||(st.kerst&&!h.feest)||(st.sint&&!h.sint)?`<div class="wmk-tags">${st.kerst&&!h.feest?'<span>🎄 Kerstfeest</span>':''}${st.sint&&!h.sint?'<span>🎁 Sinterklaas</span>':''}${nieuwSc?'<span>📜 Verhaal</span>':''}${raad?'<span>❓ Raadsel</span>':''}</div>`:''}
    <button type="button" class="knop klein" id="wmnaar">Naar Wintermagie</button>
    </div></section>`}
function bindWmKaart(){
  const k=document.getElementById('wmkaart');if(!k)return;
  const extra=k.querySelector('.wmk-extra');
  const lijn=document.getElementById('wmklijn');
  if(lijn)lijn.onclick=e=>{e.preventDefault();e.stopPropagation();if(!extra)return;const openN=extra.hasAttribute('hidden');if(openN)extra.removeAttribute('hidden');else extra.setAttribute('hidden','');k.classList.toggle('wmcompact',!openN);zetKaartOpen(openN);const ch=lijn.querySelector('.wmk-chev');if(ch)ch.textContent=openN?'▴':'▾'};
  const naar=document.getElementById('wmnaar');if(naar)naar.onclick=e=>{e.preventDefault();e.stopPropagation();ga('winter')};
}
function kaartVerf(){const k=document.getElementById('wmkaart');if(k&&document.body.dataset.view==='home'){const h=kaartHtml();if(h){k.outerHTML=h;bindWmKaart()}else k.remove()}}

const raadVrij=()=>{const st=stand(),h=W();if(!st.aan)return [];const l=[];const max=Math.min(36,st.i);for(let i=0;i<=max;i++)if(!h.raad[i])l.push(i);return l};
const raadNu=()=>{const st=stand(),l=raadVrij();return l.includes(st.i)?st.i:l[0]};

function speel(s,klaar){let i=0;const regels=[[s.w,s.x],['Tilly',s.c]];
  if(typeof verhaal==='function')return verhaal(regels,klaar);
  klaar&&klaar()}

const feestGeef=()=>{const h=W();if(h.feest)return '';h.feest=1;S.galjoenen+=30;geef(40);const k=zetKaart('De zevende kaars');bewaar();try{stats()}catch(e){}return '+40 Sneeuwvlokjes · +30 Smekkies · '+k};
const sintGeef=()=>{const h=W();if(h.sint)return '';h.sint=1;S.galjoenen+=15;geef(20);bewaar();try{stats()}catch(e){}return '+20 Sneeuwvlokjes · +15 Smekkies, en een denkbeeldig rotskoekje'};
function feestScherm(){const o=document.createElement('div');o.className='modal wmfeestm';
  o.innerHTML=`<div class="modalin rococo wmfm"><h2>Kerstfeest in de Grote Zaal</h2><p>Twaalf bomen, berijpt fruit, en sneeuw die van het plafond dwarrelt zonder nat te worden. De zevende kaars houdt zich stil, en knipoogt toch.</p><div id="wmfmres"></div><button class="knop volgende" id="wmaan">Aanschuiven</button></div>`;
  document.body.appendChild(o);try{fx.speel('fanfare')}catch(e){}
  o.querySelector('#wmaan').onclick=()=>{const h=W();if(h.feest){o.remove();return}const t=feestGeef();o.querySelector('#wmfmres').innerHTML=`<p class="hwres">${t}</p>`;const k=o.querySelector('#wmaan');k.textContent='Wat fijn';k.onclick=()=>{o.remove();kaartVerf()}}};
function sintScherm(){const o=document.createElement('div');o.className='modal';
  o.innerHTML=`<div class="modalin rococo wmfm"><h2>Een schoen bij de haard</h2><p>${typeof portret==='function'?portret('hagrid','mini'):''} Hagrid heeft weer een schoen gezet. “Voor de Sint, of voor wie er maar langs komt.” Vanmorgen lag er een rotskoekje in, en dit voor jou.</p><div id="wmsintres"></div><button class="knop volgende" id="wmsintja">Kijken</button></div>`;
  document.body.appendChild(o);
  o.querySelector('#wmsintja').onclick=()=>{const h=W();if(h.sint){o.remove();return}const t=sintGeef();o.querySelector('#wmsintres').innerHTML=`<p>${t}</p>`;o.querySelector('#wmsintja').textContent='Dank je, Hagrid';o.querySelector('#wmsintja').onclick=()=>{o.remove();kaartVerf()}};}
const feestPopup=()=>{const st=stand(),h=W();
  if(st.kerst&&!h.feest&&h.feestGezien!==st.x.toDateString()){h.feestGezien=st.x.toDateString();bewaar();setTimeout(()=>{if(document.body.dataset.view==='home')feestScherm()},1100)}
  if(st.sint&&!h.sint&&h.sintGezien!==st.x.toDateString()){h.sintGezien=st.x.toDateString();bewaar();setTimeout(()=>{if(document.body.dataset.view==='home')sintScherm()},1100)}
};
const naEvent=()=>{const st=stand();if(st.aan||!S.wm||S.wm.j!==st.j||!st.na)return;const h=S.wm;const l=[];while(open()){l.push(STAP[h.stap].ico+' '+STAP[h.stap].g());h.stap++}if(!l.length)return;bewaar();try{stats()}catch(e){}
  setTimeout(()=>{const o=document.createElement('div');o.className='modal';o.innerHTML=`<div class="modalin rococo wmfm"><h2>Bewaard tot de dooi</h2><p>De winter is voorbij, maar dit had je nog verdiend:</p><ul class="hwlijst">${l.map(x=>`<li>${x}</li>`).join('')}</ul><button class="knop volgende">Dank je</button></div>`;document.body.appendChild(o);o.querySelector('button').onclick=()=>o.remove()},1400)};

function zetKaartOpHal(){sneeuw();const app=document.getElementById('app');if(!app||document.body.dataset.view!=='home')return;const h=kaartHtml();if(!h){const o=document.getElementById('wmkaart');if(o)o.remove();return}let k=document.getElementById('wmkaart');if(k){k.outerHTML=h;k=document.getElementById('wmkaart')}else{const na=app.querySelector('.lokaal')||document.getElementById('volgendestap')||app.querySelector('.groet')||app.firstChild;if(na)na.insertAdjacentHTML('afterend',h);else app.insertAdjacentHTML('afterbegin',h);k=document.getElementById('wmkaart')}
  bindWmKaart()}
const _home=V.home;V.home=(...a)=>{const r=_home(...a);try{zetKaartOpHal();setTimeout(zetKaartOpHal,80);setTimeout(zetKaartOpHal,220);feestPopup();naEvent()}catch(e){console.warn(e)}return r};

const claim=()=>{const h=W();if(!open())return;const s=STAP[h.stap];const t=s.g();h.stap++;bewaar();try{stats()}catch(e){}
  const o=document.createElement('div');o.className='modal';o.innerHTML=`<div class="modalin rococo wmfm"><h2>${s.t}</h2><p>${t}</p><button class="knop volgende">Mooi!</button></div>`;
  document.body.appendChild(o);try{fx.speel('tover')}catch(e){}o.querySelector('button').onclick=()=>{o.remove();V.winter()}};

V.winter=()=>{
  const st=stand(),h=W();
  if(!st.aan&&!st.na&&!st.voor)return V.home();
  voegSerie();
  const rn=raadNu();
  const Ri=rn==null?null:RA[rn%RA.length];
  app(`<div class="wmscherm"><div class="wmkop"><div class="wmkop-t"><small>Wintermagie in Zweinstein</small><h1>${st.kerst?'Kerstfeest':st.sint?'Sinterklaas':'Wintermagie'}</h1><p>${st.aan?dagenTxt(st):st.voor?'Vanaf 1 december. Tot die tijd mag je alvast kijken.':'De winter is voorbij. Tot volgend jaar.'}</p></div></div>
  ${st.kerst?`<section class="kaart hwblok"><h3>🎄 Feest in de Grote Zaal</h3>${h.feest?'<p>Je hebt aangeschenen. Wat een zachte avond.</p>':'<p>Het feestmaal staat klaar. Er is geen haast.</p><button class="knop volgende" id="wmfeestbtn">Aanschuiven</button>'}</section>`:''}
  ${st.sint?`<section class="kaart hwblok"><h3>🎁 Sinterklaas</h3>${h.sint?'<p>De schoen is bekeken. Hagrid was er als een kind zo blij mee.</p>':'<p>Hagrid heeft een schoen bij de haard gezet.</p><button class="knop volgende" id="wmsintbtn">Kijken</button>'}</section>`:''}
  <section class="kaart hwblok"><div class="hwstand">${VLOK}<div><b>${h.tot}</b> Sneeuwvlokjes</div></div><p class="klein">Je vindt ze in levels, zonder haast. Een winst geeft er 3, met Kerst 6. Raadsels en verhalen geven er ook. Geen tijdsdruk, en geen huisschilden: alleen iets warms voor erbij.</p>
    <ol class="hwpad">${STAP.map((s,i)=>{const kl=i<h.stap,kan=i===h.stap&&h.tot>=s.n;return `<li class="${kl?'klaar':kan?'kan':'dicht'}"><span class="hwp-ico">${s.ico}</span><span class="hwp-t">${s.t}<small>${s.n} vlokjes</small></span>${kl?'<span class="hwp-s">✓</span>':kan?'<button class="knop klein" id="wmclaim">Openen</button>':`<span class="hwp-s">${Math.max(0,s.n-h.tot)} te gaan</span>`}</li>`}).join('')}</ol></section>
  ${Ri&&st.aan?`<section class="kaart hwblok hwraad"><h3>❓ Tilly’s winterraadsel</h3><p class="hwvraag">${Ri[0]}</p><div class="hwopties">${[Ri[1],Ri[2],Ri[3]].map((o,i)=>`<button class="knop" data-o="${i}">${o}</button>`).join('')}</div><div id="wmraadres"></div></section>`:`<section class="kaart hwblok hwraad"><h3>❓ Tilly’s winterraadsel</h3><p>${st.aan?'Voor vandaag ben je klaar. Morgen ligt er een nieuwe, als je zin hebt.':'De raadsels van deze winter zijn voorbij.'}</p></section>`}
  <section class="kaart hwblok"><h3>📜 Winter en kas zeven</h3><ul class="hwverh">${SC.map((s,i)=>{const vrij=st.aan?s.d<=st.i:!!h.sc[i];return `<li class="${vrij?'':'dicht'}">${vrij?`<button class="linkknop" data-sc="${i}">${h.sc[i]?'':'<b class="hwnieuw">Nieuw</b> '}${s.t}</button>`:`<span>🔒 ${s.t}</span>`}</li>`}).join('')}</ul></section>
  </div>`);
  const c=document.getElementById('wmclaim');if(c)c.onclick=claim;
  const fb=document.getElementById('wmfeestbtn');if(fb)fb.onclick=feestScherm;
  const sb=document.getElementById('wmsintbtn');if(sb)sb.onclick=sintScherm;
  document.querySelectorAll('[data-sc]').forEach(b=>b.onclick=()=>{const i=+b.dataset.sc;speel(SC[i],()=>{if(!h.sc[i]){h.sc[i]=1;geef(10);let extra='📜 +10 Sneeuwvlokjes';if(i===0)extra+=' · '+zetKaart('Rijp op kas zeven');if(i===3||i===4)extra+=' · '+zetKaart('De zevende kaars');toast(extra)}V.winter()})});
  document.querySelectorAll('.hwopties [data-o]').forEach(b=>b.onclick=()=>{if(rn==null)return;const k=+b.dataset.o,R=RA[rn%RA.length];const res=document.getElementById('wmraadres');
    if(k===R[4]){h.raad[rn]=1;geef(15);S.galjoenen+=10;bewaar();try{stats();fx.speel('goed')}catch(e){}res.innerHTML=`<div class="hwgoed">${typeof tilly==='function'?tilly('<b>Goed zo!</b> '+R[5]):R[5]}<p>+15 Sneeuwvlokjes · +10 Smekkies</p><button class="knop klein" id="wmrv">Verder</button></div>`;document.querySelectorAll('.hwopties button').forEach(x=>x.disabled=true);document.getElementById('wmrv').onclick=()=>V.winter()}
    else{b.disabled=true;b.classList.add('mis');try{fx.speel('kras')}catch(e){}res.innerHTML='<p class="klein hwhint">Hmm, dat is het niet. Probeer gerust nog eens, er is geen haast.</p>'}});
};

const _k=V.kamer;if(_k)V.kamer=(...a)=>{const r=_k(...a);try{const k=document.querySelector('.kamer');if(k&&(S.wmTrofee||[]).length&&!k.querySelector('.wmtrofee'))k.insertAdjacentHTML('beforeend',`<div class="wmtrofee" title="Sneeuwbloem ${S.wmTrofee.join(', ')}">${VLOK}<small>Wintermagie ${S.wmTrofee.join(' · ')}</small></div>`)}catch(e){}return r};

/* album: Feestdagen-archief voor Halloween + winter */
const _alb=V.album;if(_alb)V.album=(...a)=>{const r=_alb(...a);try{voegSerie();const app=document.getElementById('app');if(app&&!document.getElementById('feestarchief')){
  const hw=S.hw, wm=S.wm;
  const stukken=[];
  if(hw&&(hw.tot|0))stukken.push(`Halloween ${hw.j}: ${(hw.tot|0)} pompoensnoepjes, ${(hw.stap|0)} beloningen`);
  if((S.hwTrofee||[]).length)stukken.push('Gouden Pompoen in je kamer');
  if(S.kaarten&&S.kaarten['Haast Onthoofde Henk'])stukken.push('Kaart van Haast Onthoofde Henk');
  if(wm&&(wm.tot|0))stukken.push(`Winter ${wm.j}–${wm.j+1}: ${(wm.tot|0)} sneeuwvlokjes`);
  if((S.wmTrofee||[]).length)stukken.push('Sneeuwbloem in je kamer');
  if(stukken.length)app.insertAdjacentHTML('beforeend',`<section class="kaart feestarchief" id="feestarchief"><h3>Feestdagen-archief</h3><p class="klein">${stukken.join(' · ')}. Geen haast, het blijft bewaard.</p>${stand().aan||stand().voor||stand().na?`<p><button class="knop klein" onclick="ga('winter')">Naar Wintermagie</button></p>`:''}${hw&&(hw.j)?`<p><button class="knop klein" id="hwarchiefbtn">Halloween teruglezen</button></p>`:''}</section>`);
  const b=document.getElementById('hwarchiefbtn');if(b)b.onclick=()=>{try{if(typeof V.halloween==='function'){localStorage.setItem('zw_hwarchief','1');V.halloween()}}catch(e){toast('Het Halloween-archief staat in je album.')}}
}}catch(e){}return r};

const _mk=V.maker;if(_mk)V.maker=(...a)=>{const r=_mk(...a);try{const st=stand(),o=localStorage.getItem('zw_testdatum')||localStorage.getItem('zw_hwdatum')||'';
  const app=document.getElementById('app');if(app&&!document.getElementById('wmmaker'))app.insertAdjacentHTML('beforeend',`<section class="kaart sierlijst" id="wmmaker"><h3>Testdatum (events)</h3><p class="klein">Nu: ${st.d.toLocaleDateString('nl-NL',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · winter ${st.aan?'AAN (dag '+(st.i+1)+')':st.voor?'teaser':'uit'}${st.sint?' · Sinterklaas':''}${st.kerst?' · Kerst':''}${o?' · <b>testdatum</b>':''}</p>
    <p><input type="date" id="wmdat" value="${o||st.d.getFullYear()+'-'+pad(st.d.getMonth()+1)+'-'+pad(st.d.getDate())}"> <button class="knop klein" id="wmzet">Gebruik datum</button> <button class="knop klein" id="wmecht">Echte datum</button></p>
    <p><button class="knop klein" id="wm100">+80 vlokjes</button> <button class="knop klein" id="wmwis">Wintervoortgang wissen</button></p></section>`);
  const zetD=v=>{if(v)localStorage.setItem('zw_testdatum',v);sneeuw();V.maker()};
  document.getElementById('wmzet').onclick=()=>zetD(document.getElementById('wmdat').value);
  document.getElementById('wmecht').onclick=()=>{localStorage.removeItem('zw_testdatum');localStorage.removeItem('zw_hwdatum');sneeuw();V.maker()};
  document.getElementById('wm100').onclick=()=>{geef(80);V.maker()};
  document.getElementById('wmwis').onclick=()=>{delete S.wm;bewaar();V.maker()}}catch(e){console.warn(e)}return r};
})();
