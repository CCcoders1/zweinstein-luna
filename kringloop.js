/* ====== v135 Kringloop: drankjes als optionele levelhulp, schooldagbonus, terugkeer zonder druk ====== */
(function(){
'use strict';
S.drank=S.drank&&typeof S.drank=='object'?S.drank:{};
S.titels=Array.isArray(S.titels)?S.titels:[];

const DRANKEN=[
  {id:'opkikker',naam:'Opkikkerdrankje',kort:'+3 zetten',zin:'Stoom uit je oren: drie extra zetten. De extra punten tellen niet mee voor 3 sterren.'},
  {id:'felix',naam:'Felix Fortunatis',kort:'startbom',zin:'Vloeibaar geluk: er ligt meteen een bom klaar op het bord.'},
  {id:'slaap',naam:'Slaapdrankje',kort:'geen hartje kwijt',zin:'Een rustige slaap: bij verlies houd je je hartje.'},
  {id:'wissel',naam:'Wisselzalf',kort:'een zet zien',zin:'Een heldere blik: je ziet meteen een zet die werkt.'}
];
const DNAM=Object.fromEntries(DRANKEN.map(d=>[d.id,d]));
const KRUID_NM=id=>{try{return (typeof ZADEN!=='undefined'&&ZADEN[id]&&ZADEN[id][0])||id}catch(e){return id}};

/* Schooldag 0–29: kruid + drankje van de dag (bonus, nooit verplicht). */
const DAG_BONUS=[
  ['valeriaan','slaap'],['varkensgras','slaap'],['wolfsmelk','opkikker'],['valeriaan','wissel'],['alsem','opkikker'],
  ['varkensgras','slaap'],['wolfsmelk','wissel'],['alsem','opkikker'],['valeriaan','slaap'],['affodil','wissel'],
  ['wolfsmelk','opkikker'],['alsem','wissel'],['valeriaan','slaap'],['affodil','opkikker'],['varkensgras','wissel'],
  ['alsem','slaap'],['wolfsmelk','opkikker'],['affodil','wissel'],['valeriaan','opkikker'],['mandragora','felix'],
  ['alsem','wissel'],['wolfsmelk','opkikker'],['affodil','slaap'],['valeriaan','wissel'],['mandragora','felix'],
  ['wolfsmelk','opkikker'],['alsem','wissel'],['affodil','felix'],['valeriaan','slaap'],['mandragora','felix']
];
function dagIndex(){try{const s=typeof schoolDag==='function'?schoolDag():null;return s&&s.index!=null?s.index:0}catch(e){return 0}}
function dagBonus(){
  const i=Math.max(0,dagIndex())%DAG_BONUS.length;
  let [kruid,drank]=DAG_BONUS[i];
  if(drank==='felix'&&!((S.drank.slaap|0)&&(S.drank.opkikker|0)))drank='opkikker';
  const d=DNAM[drank];
  return {kruid,drank,kruidNaam:KRUID_NM(kruid),drankNaam:d?d.naam:drank,kort:d?d.kort:'',zin:d?d.zin:''};
}
window.zwDagBonus=dagBonus;

/* ---------- keuze op het startscherm (max 1, optioneel) ---------- */
let gekozen=null;
window.zwDrankGekozen=()=>gekozen;
function heb(id){return (S.drank[id]|0)>0}
function fles(id,h){return window.flesModel?flesModel(id,{h:h||52}):''}
function keuzeHTML(){
  const dag=dagBonus();
  const rij=DRANKEN.map(d=>{
    const n=S.drank[d.id]|0, tip=n?('×'+n+' in je voorraad'):'Brouw dit in je ketel', vanDag=d.id===dag.drank;
    return `<button type="button" class="drankchip ${n?'':'op'} ${vanDag?'vandag':''}" data-dr="${d.id}" aria-pressed="false">${fles(d.id,44)}<b>${d.naam}</b><small>${d.kort} · ${tip}${vanDag?' · past bij vandaag':''}</small></button>`;
  }).join('');
  return `<div class="drankkeuze" id="drankkeuze"><p class="klein">Drankje meenemen? Tik er één aan. Het hoeft niet, en je kunt er altijd eentje overslaan.</p><div class="drankrij">${rij}</div><p class="klein drankketel"><button type="button" class="bolink" id="naarketel">Naar je ketel</button></p></div>`;
}
function bindKeuze(){
  const box=document.getElementById('drankkeuze');if(!box)return;
  const k=document.getElementById('naarketel');if(k)k.onclick=()=>{document.querySelectorAll('.modal').forEach(m=>m.remove());ga('ketel')};
  box.querySelectorAll('.drankchip').forEach(c=>{
    c.onclick=()=>{
      const id=c.dataset.dr;
      if(!heb(id)){toast(DNAM[id].naam+' brouw je in je ketel, van kruiden uit de kas.');try{fx.speel('klik')}catch(e){}return}
      if(gekozen===id){gekozen=null;c.setAttribute('aria-pressed','false');c.classList.remove('aan')}
      else{gekozen=id;box.querySelectorAll('.drankchip').forEach(x=>{x.classList.toggle('aan',x===c);x.setAttribute('aria-pressed',x===c?'true':'false')})}
      try{fx.speel('klik')}catch(e){}
    };
  });
}
const _m3=V.match3;
V.match3=async function(n,...a){
  gekozen=null;
  const r=await _m3.call(this,n,...a);
  try{
    const voor=document.querySelector('.m3voor');
    if(voor&&!document.getElementById('drankkeuze')){
      const h=voor.querySelector('.zwaarhint')||voor.querySelector('.bokeuze')||voor.querySelector('.reekswinst')||voor.querySelector('.harten')||voor.querySelector('#m3start');
      if(h)h.insertAdjacentHTML('beforebegin',keuzeHTML());
      else voor.insertAdjacentHTML('beforeend',keuzeHTML());
      bindKeuze();
    }
  }catch(e){console.warn(e)}
  return r;
};

/* ---------- toepassen bij start van het bord ---------- */
function volgSter(b){
  if(!b||b.sim||b._sterVolg)return;
  b._sterVolg=1;
  let sc=b.score|0;b._sterScore=sc;
  const P=()=>b._drankZet|0;
  Object.defineProperty(b,'score',{configurable:true,get(){return sc},set(v){const d=(v|0)-sc;sc=v|0;if(d>0&&(b._feest||(b.zet|0)>=P()))b._sterScore=(b._sterScore|0)+d;}});
}
function vrijCel(b,lo,hi){
  const L=[];for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=b.g[r][c];if(t&&t.k>=0&&!t.s&&!b.kist[r][c]&&!(b.strik&&b.strik[r][c])&&r>=lo&&r<=hi)L.push([r,c])}
  return L.length?L[Math.random()*L.length|0]:null;
}
function pasDrank(b,id){
  if(!b||b.sim||!id||!heb(id))return;
  S.drank[id]=(S.drank[id]|0)-1;if(S.drank[id]<0)S.drank[id]=0;bewaar();
  b._drank=id;
  if(id==='opkikker'){b.zet=(b.zet|0)+3;b._drankZet=3;const z=document.getElementById('m3z');if(z)z.textContent=b.zet;toast('Opkikker: +3 zetten. De extra punten tellen niet mee voor 3 sterren.')}
  if(id==='felix'){const p=vrijCel(b,3,5);if(p){b.g[p[0]][p[1]].s='bom';toast('Felix: er ligt een bom klaar.')}else toast('Felix glimt, maar het bord was te vol voor een bom.')}
  if(id==='slaap'){b._slaap=1;S._slaapBeurt=1;toast('Slaapdrankje: bij verlies houd je je hartje.')}
  if(id==='wissel'){try{const zet=b.heeftZet&&b.heeftZet();if(zet&&zet!==true&&window.M3){/* hint verschijnt via het bord */}b._wissel=1;toast('Wisselzalf: kijk goed, een zet licht op.')}catch(e){toast('Wisselzalf is aangebracht.')}}
  const hud=document.querySelector('.m3hud');if(hud&&!hud.querySelector('.drankactief'))hud.insertAdjacentHTML('beforeend',`<span class="drankactief" title="${DNAM[id].naam}">${fles(id,36)}</span>`);
}
const _nb=window.m3NaBord;
window.m3NaBord=function(b,boost){
  const r=_nb?_nb(b,boost):undefined;
  try{
    const id=(boost&&boost.drank)||gekozen;
    if(id)pasDrank(b,id);
    b._feestZet=Math.max(0,(b.zet|0)-(b._drankZet|0));
    volgSter(b);
    if(b._wissel){try{const h=b.heeftZet&&b.heeftZet();if(h&&h!==true){/* het frame in match3 pakt hint na 6s; zet de timer terug */}if(typeof M3!=='undefined'){/* forceer hint door hintT te vervangen via een klein treintje */setTimeout(()=>{const ev=new Event('zw-hint');document.dispatchEvent(ev)},200)}}catch(e){}}
  }catch(e){console.warn(e)}
  return r;
};

/* Wisselzalf: verkort de hint-wacht tot 1,2 s (match3.js gebruikt 6000 ms). */
(function(){
  const orig=setTimeout;
  /* we zetten geen globale setTimeout om; we tikken het bord na start aan via een interval-eenmalig */
})();
const _speel=typeof m3Speel==='function'?m3Speel:null;
if(_speel)window.m3Speel=m3Speel=function(n,thema,boost){
  boost=boost||{};if(!boost.drank&&gekozen)boost.drank=gekozen;
  const r=_speel.call(this,n,thema,boost);
  try{
    if(boost.drank==='wissel'||gekozen==='wissel'){
      const zoek=()=>{
        try{
          const b=window.M3&&M3.b;if(!b)return;
          const h=b.heeftZet&&b.heeftZet();if(!h||h===true)return;
          const cv=document.getElementById('m3c'),fx=document.getElementById('m3fx');if(!cv||!fx)return;
          const R=cv.getBoundingClientRect(),cel=R.width/KOL;
          fx.querySelectorAll('.wisselgloed').forEach(x=>x.remove());
          h.forEach(([r,c])=>{const d=document.createElement('div');d.className='wisselgloed';d.style.cssText=`left:${c*cel}px;top:${r*cel}px;width:${cel}px;height:${cel}px`;fx.appendChild(d)});
        }catch(e){}
      };
      setTimeout(zoek,500);setTimeout(zoek,1400);
    }
  }catch(e){}
  return r;
};

/* Slaapdrankje: één verlies zonder hartje. */
const _vl=typeof verliesLeven==='function'?verliesLeven:null;
if(_vl)window.verliesLeven=verliesLeven=function(){
  if(S._slaapBeurt||(window.M3&&M3.b&&M3.b._slaap)){S._slaapBeurt=0;try{if(M3.b)M3.b._slaap=0}catch(e){}toast('Het Slaapdrankje deed zijn werk: je hartje blijft.');return}
  return _vl.apply(this,arguments);
};

/* Titel als alle vier de drankjes minstens eens gebrouwen zijn. */
function kijkTitels(){
  const alle=DRANKEN.every(d=>(S.drank[d.id]|0)>0||(S.drankOoit&&S.drankOoit[d.id]));
  if(!alle)return;
  const t='Brouwster van de Kerker';
  if(!S.titels.includes(t)){S.titels.push(t);bewaar();try{toast('Nieuwe titel: '+t)}catch(e){}}
}
const _klaarDrink=()=>{try{
  Object.keys(S.drank||{}).forEach(id=>{if((S.drank[id]|0)>0){S.drankOoit=S.drankOoit||{};S.drankOoit[id]=1}});
  kijkTitels();
}catch(e){}};
setInterval(_klaarDrink,8000);

/* ---------- terugkeer zonder druk, collectie, morgen ---------- */
function kasMorgen(){
  try{
    if(typeof rest!=='function'||typeof stadium!=='function'||!S.kweek)return '';
    const lijst=Object.keys(S.kweek).map(i=>S.kweek[i]).filter(Boolean);
    const rijp=lijst.filter(p=>stadium(p)==4).length;
    if(rijp)return rijp===1?'In je kas staat iets klaar om te oogsten.':'In je kas staan '+rijp+' planten klaar om te oogsten.';
    let best=null;
    lijst.forEach(p=>{const r=rest(p);if(r>0&&(!best||r<best.r))best={r,p}});
    if(!best)return 'Een lege pot is een belofte. Plant iets wanneer je zin hebt.';
    const uur=Math.round(best.r/36e5), min=Math.round(best.r/6e4);
    const naam=KRUID_NM(best.p.z);
    if(min<=90)return 'Je '+naam.toLowerCase()+' is straks rijp om te oogsten.';
    if(uur<=20)return 'Je '+naam.toLowerCase()+' is morgen waarschijnlijk rijp.';
    return 'In je kas groeit rustig '+naam.toLowerCase()+'. Geen haast.';
  }catch(e){return ''}
}
function uilMorgen(){
  try{
    const due=typeof uilenpostDue==='function'?uilenpostDue():(!S.uilenpost||Date.now()-S.uilenpost>=2*864e5);
    return due?'Er kan zo een uil op het raam tikken.':'De uil rust nog even. Hij komt wanneer het uitkomt.';
  }catch(e){return ''}
}
function verhaalMorgen(){
  try{
    if(typeof hfdNieuw==='function'){const i=hfdNieuw();if(i>=0)return 'In je dagboek wacht een nieuw hoofdstuk.'}
    const n=S.m3lvl|1, rest=10-(n%10||10);
    if(rest<=3)return 'Over een paar levels vertelt Tilly weer een stukje van het mysterie.';
    return 'Het mysterie van Kas Zeven wacht rustig in je dagboek.';
  }catch(e){return 'Het mysterie wacht rustig in je dagboek.'}
}
function morgenZin(){
  return [kasMorgen(),verhaalMorgen(),uilMorgen()].filter(Boolean)[0]||'Morgen is er weer een schooldag, in je eigen tempo.';
}
function collectie(){
  const clues=(((S.dagboek||{}).clues)||[]);
  const clueN=Array.isArray(clues)?clues.length:Object.keys(clues||{}).length;
  const hfd=Object.keys(((S.dagboek||{}).gezien)||{}).length;
  const album=Object.keys(S.kaarten||{}).length, albumT=(typeof KAARTEN!=='undefined'&&KAARTEN.length)||0;
  const brouw=Object.keys(S.drankOoit||S.drank||{}).filter(k=>((S.drankOoit||{})[k]||(S.drank[k]|0)>0)).length;
  const tit=S.titels.length;
  return {clueN,hfd,album,albumT,brouw,tit,
    html:`<div class="collestrook" id="collestrook"><small>Je collectie</small><p>Dagboek ${hfd}/31 · Aanwijzingen ${clueN}/23 · Drankjes ${brouw}/4 · Album ${album}${albumT?'/'+albumT:''}${tit?(' · '+tit+' titels'):''}</p></div>`};
}
window.zwMorgen=morgenZin;

/* Dagelijkse verrassing: alleen een warm zinnetje, geen beloning, geen klokdruk. */
const VERRAS=[
  'Tilly vond een droog bloemblaadje in haar zak. “Bewaar het maar, Luna. Je weet maar nooit.”',
  'Op de vensterbank van de Hal lag een veer. Wit, bijna zilver.',
  'Hagrid zwaaide in de verte, met aarde aan zijn baard.',
  'De zevende kaars wiegde even, alsof iemand groette.',
  'Er rook even naar valeriaan in de gang. Niemand die het wilde toegeven.'
];
function dagVerras(){
  const dag=(typeof vandaag==='function'?vandaag():new Date().toISOString().slice(0,10));
  if(S.dagVerras===dag)return null;
  S.dagVerras=dag;bewaar();
  const zin=VERRAS[Math.abs((Date.parse(dag)/864e5|0))%VERRAS.length];
  return zin;
}

function zetHalExtra(){
  const app=document.getElementById('app');if(!app||!document.body.classList.contains('halstrak')&&document.body.dataset.view&&document.body.dataset.view!=='home'&&document.body.dataset.view!=='undefined')return;
  if(document.body.dataset.view&&document.body.dataset.view!=='home'&&document.body.dataset.view!=='undefined'&&!document.body.classList.contains('halstrak'))return;
  if(document.getElementById('morgenkaart'))return;
  const dag=dagBonus();
  const col=collectie();
  const html=`<section class="morgenkaart rococo" id="morgenkaart"><small>Als je later zin hebt</small><p>${morgenZin()}</p><p class="klein">Vandaag past <b>${dag.drankNaam}</b> bij de les, gebrouwen van ${dag.kruidNaam}. Alleen als je wilt.</p>${col.html}</section>`;
  const na=app.querySelector('.lokaal')||document.getElementById('halvr')||document.querySelector('.boekstuk')||document.getElementById('volgendestap');
  if(na)na.insertAdjacentHTML('afterend',html);else app.insertAdjacentHTML('beforeend',html);
}

const _home=V.home;
V.home=function(...a){
  const r=_home.apply(this,a);
  try{
    setTimeout(()=>{
      try{zetHalExtra();kopOrde()}catch(e){}
      const v=dagVerras();
      if(v&&(document.body.dataset.view==='home'||document.body.dataset.view==='undefined'||!document.body.dataset.view)){
        setTimeout(()=>{if(!document.querySelector('.modal,.verhaal')&&(document.body.dataset.view==='home'||document.body.dataset.view==='undefined'||!document.body.dataset.view))toast(v)},2200);
      }
    },200);
  }catch(e){}
  return r;
};

/* Volgende stap: noem het drankje van de dag zachtjes. */
const _vs=window.volgendeStap;
/* volgendeStap is niet op window; we haken de kaarttekst na. */
function vulStapBonus(){
  const el=document.querySelector('#volgendestap p');if(!el||el.dataset.bonus)return;
  const d=dagBonus();el.dataset.bonus=1;
  el.insertAdjacentHTML('beforeend',` Vandaag past een ${d.drankNaam} bij de les, als je er een hebt.`);
}

/* ---------- kop opruimen: hartjes in de header, tas kleiner ---------- */
function kopOrde(){
  const h=document.querySelector('header');if(!h)return;
  let rij=document.getElementById('koprit');
  if(!rij){rij=document.createElement('div');rij.id='koprit';h.appendChild(rij)}
  const hh=document.getElementById('halharten');
  if(hh){hh.classList.add('in-kop');if(hh.parentNode!==rij)rij.appendChild(hh)}
  const tas=document.getElementById('tasknop');
  if(tas)tas.classList.add('koptas');
  document.body.classList.add('kopstrak');
  document.querySelectorAll('#stats .schild-t,#stats .vuur-t,#stats .hoed-t,#weer').forEach(e=>{e.style.display='none'});
  const app=document.getElementById('app');
  document.querySelectorAll('header #nieuwles,header .nieuwles,header #mpknop,#koprit #nieuwles,#koprit .nieuwles,#koprit #mpknop,#koprit .mpknop').forEach(el=>{if(app&&el.parentNode!==app)app.insertBefore(el,app.firstChild)});
}
setInterval(()=>{try{if(document.body.classList.contains('halstrak')||document.body.dataset.view==='home'){if(!document.getElementById('morgenkaart'))zetHalExtra();kopOrde();vulStapBonus()}}catch(e){}},2500);

/* Ochtendpost: extra regel over kruid/drank van de dag. */
const _login=V.login;
V.login=function(){
  const r=_login.apply(this,arguments);
  try{
    setTimeout(()=>{
      const post=document.querySelector('.ochtendpost');if(!post||post.querySelector('.dagbonusps'))return;
      const d=dagBonus();
      const ps=document.createElement('p');ps.className='dagbonusps klein';
      ps.textContent='P.S. Als je zin hebt: vandaag past een '+d.drankNaam+', van '+d.kruidNaam+'. Alleen als je wilt.';
      const kn=post.querySelector('button');if(kn)kn.before(ps);else post.appendChild(ps);
    },60);
  }catch(e){}
  return r;
};

/* Ketel + kas: zacht duwtje naar het kruid/drankje van de dag. */
function plekZin(waar){
  const d=dagBonus();
  if(waar==='ketel')return 'Vandaag past een '+d.drankNaam+' bij de les. Alleen als je wilt.';
  return 'Stronk zou vandaag '+d.kruidNaam+' in de kas mooi vinden. Geen verplichting.';
}
['ketel','kas','mijnkas'].forEach(vn=>{
  const oud=V[vn];if(typeof oud!=='function')return;
  V[vn]=function(){const r=oud.apply(this,arguments);try{
    if(document.getElementById('dagplekzin'))return r;
    const app=document.getElementById('app')||document.getElementById('kt');
    const host=document.getElementById('ktkaart')||app;
    if(host)host.insertAdjacentHTML(host.id==='ktkaart'?'beforeend':'afterbegin',`<p class="dagplekzin klein" id="dagplekzin">${plekZin(vn==='ketel'?'ketel':'kas')}</p>`);
  }catch(e){}return r};
});

/* Win-viering: een verhaalhaakje. */
const _w=typeof m3Winst==='function'?m3Winst:null;
if(_w)window.m3Winst=m3Winst=function(n,b,...a){
  const r=_w.apply(this,arguments);
  try{
    const zin=verhaalMorgen();
    const wacht=()=>{
      const eind=document.querySelector('.m3eind');if(!eind){setTimeout(wacht,400);return}
      if(eind.querySelector('.winhaak'))return;
      eind.insertAdjacentHTML('beforeend',`<p class="winhaak">${zin} ${kasMorgen()&&(S.kweek&&Object.keys(S.kweek).length)?' '+kasMorgen():''}</p>`);
    };
    setTimeout(wacht,500);
  }catch(e){}
  return r;
};

/* Lazy: late plaatjes in album en lijsten. */
function luiBeeld(){
  document.querySelectorAll('img:not([loading])').forEach(im=>{
    if(im.closest('header,nav,#gids,#laadscherm,.pportret, .tportret,.tstaand'))return;
    const src=im.getAttribute('src')||'';
    if(/icoon-|nav-|pil-|lakzegel|sneeuwuil|schild-64/.test(src))return;
    im.setAttribute('loading','lazy');im.setAttribute('decoding','async');
  });
}
if(typeof MutationObserver==='function'){
  const mo=new MutationObserver(()=>luiBeeld());
  addEventListener('load',()=>{try{mo.observe(document.body,{childList:true,subtree:true});luiBeeld()}catch(e){}});
}

window.zwKring={DRANKEN,dagBonus,collectie,morgenZin};
})();
