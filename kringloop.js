/* ====== v136 Kringloop: drankjes als optionele levelhulp, schooldagbonus, terugkeer zonder druk ====== */
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
    compactStart();
  }catch(e){console.warn(e)}
  return r;
};


/* v136: drankjes + Start blijven in beeld, ook op 360×740. */
function compactStart(){
  const v=document.querySelector('.m3voor');if(!v||v.dataset.compact)return;
  v.dataset.compact=1;
  const p=v.querySelector('.drankkeuze>p');
  if(p)p.textContent='Drankje meenemen? Hoeft niet.';
  const kort={opkikker:'Opkikker',felix:'Felix',slaap:'Slaapdrankje',wissel:'Wisselzalf'};
  v.querySelectorAll('.drankchip').forEach(c=>{const b=c.querySelector('b');if(b&&kort[c.dataset.dr])b.textContent=kort[c.dataset.dr]});
  v.querySelectorAll('p').forEach(el=>{
    if(/Binnenkort zie je hier/.test(el.textContent||''))el.classList.add('kortweg');
  });
  const rol=document.createElement('div');rol.className='m3voor-rol';
  const voet=document.createElement('div');voet.className='m3voor-vast';
  const drank=v.querySelector('.drankkeuze');
  const start=v.querySelector('#m3start');
  while(v.firstChild)rol.appendChild(v.firstChild);
  if(drank)voet.appendChild(drank);
  if(start)voet.appendChild(start);
  v.appendChild(rol);v.appendChild(voet);
  const pas=()=>{
    const nav=document.getElementById('nav');
    const top=v.getBoundingClientRect().top;
    const bot=(nav?nav.getBoundingClientRect().top:innerHeight-80)-6;
    const h=Math.max(240,bot-top);
    v.style.maxHeight=h+'px';
    v.style.overflow='hidden';
  };
  pas();requestAnimationFrame(pas);setTimeout(pas,200);
}

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
  const html=`<section class="morgenkaart rococo mkcompact" id="morgenkaart"><button type="button" class="mk-lijn" id="mklijn">Als je later zin hebt <span class="wmk-chev" aria-hidden="true">▾</span></button><div class="mk-extra" hidden><p>${morgenZin()}</p><p class="klein">Vandaag past <b>${dag.drankNaam}</b> bij de les, gebrouwen van ${dag.kruidNaam}. Alleen als je wilt.</p>${col.html}</div></section>`;
  const na=document.getElementById('halvr')||document.querySelector('.dagdoelen')||document.getElementById('wmkaart')||app.querySelector('.lokaal')||document.querySelector('.boekstuk')||document.getElementById('volgendestap');
  if(na)na.insertAdjacentHTML('afterend',html);else app.insertAdjacentHTML('beforeend',html);
  const lijn=document.getElementById('mklijn'), extra=document.querySelector('#morgenkaart .mk-extra');
  if(lijn&&extra)lijn.onclick=()=>{const openN=extra.hasAttribute('hidden');if(openN)extra.removeAttribute('hidden');else extra.setAttribute('hidden','');const k=document.getElementById('morgenkaart');if(k)k.classList.toggle('mkcompact',!openN);const ch=lijn.querySelector('.wmk-chev');if(ch)ch.textContent=openN?'▴':'▾'};
}

const _home=V.home;
V.home=function(...a){
  const r=_home.apply(this,a);
  try{
    setTimeout(()=>{
      try{zetHalExtra();kopOrde()}catch(e){}
      const v=dagVerras();
      if(v&&(document.body.dataset.view==='home'||document.body.dataset.view==='undefined'||!document.body.dataset.view)){
        setTimeout(()=>{
          if(document.querySelector('.modal,.verhaal'))return;
          if(!(document.body.dataset.view==='home'||document.body.dataset.view==='undefined'||!document.body.dataset.view))return;
          const app=document.getElementById('app');
          if(app&&!app.querySelector('.halverr')){
            const p=document.createElement('p');p.className='halverr klein';p.textContent=v;
            const na=document.getElementById('speelknop')||app.querySelector('.lokaal')||document.getElementById('volgendestap');
            if(na&&na.parentNode)na.parentNode.insertBefore(p,na.nextSibling);
            else app.appendChild(p);
          }
        },800);
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
  el.dataset.bonus=1; /* drankje staat in “Als je later zin hebt”, niet dubbel in Volgende stap */
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
  try{
    const les=document.getElementById('nieuwles');
    if(les&&!les.classList.contains('ookchip')){
      les.classList.add('ookchip');
      let tx=(les.textContent||'').replace(/\s+/g,' ').trim();
      tx=tx.replace(/^✨\s*/,'').replace(/^Nieuwe les!\s*/i,'Les: ');
      if(tx.length>42)tx=tx.slice(0,40)+'…';
      les.textContent=tx;
      let ook=document.getElementById('ookvandaag');
      if(!ook){ook=document.createElement('section');ook.id='ookvandaag';ook.className='ookvandaag';ook.innerHTML='<small>Ook vandaag</small><div class="ookrij"></div>';const groet=document.querySelector('.groet');if(groet)groet.after(ook);else if(app)app.insertBefore(ook,app.firstChild)}
      const rij=ook.querySelector('.ookrij');const wrap=les.closest('div[style]')||les;
      if(rij&&wrap.parentNode!==rij)rij.appendChild(wrap);
    }
  }catch(e){}
}
setInterval(()=>{try{kopOrde();if(document.body.classList.contains('halstrak')||document.body.dataset.view==='home'){if(!document.getElementById('morgenkaart'))zetHalExtra();vulStapBonus()}}catch(e){}},2500);

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

/* Win-viering: sterren en schilden eerst, daarna een warm verhaalhaakje. */
function mooiWinst(n,b){
  const eind=document.querySelector('.m3eind');if(!eind)return;
  eind.classList.add('has-winsterr');
  const sterEl=eind.querySelector('.m3ster');if(sterEl)sterEl.style.display='none';
  if(!eind.querySelector('.winsterr')){
    const st=typeof sterVan==='function'?sterVan(b,n):(S.lvSter&&S.lvSter[n]|0);
    const sterren='★'.repeat(Math.max(1,st||1))+'☆'.repeat(Math.max(0,3-(st||1)));
    let sch=window._schildTekst||'';
    sch=sch.replace(/\s*·\s*$/,'').trim();
    const blok=document.createElement('div');blok.className='winsterr';
    blok.innerHTML=`<span class="winsterr-sterren" aria-label="${st||1} sterren">${sterren}</span><p class="schildmoment">${sch||'Een ster voor de lokalen.'}</p>`;
    const h2=eind.querySelector('h2');if(h2)h2.after(blok);else eind.insertAdjacentElement('afterbegin',blok);
    const oud=eind.querySelector('.hp-sterren');if(oud){const p=oud.closest('p');if(p)p.style.display='none'}
    // verberg de oude schildregel, die staat nu in .schildmoment
    [...eind.querySelectorAll(':scope > p')].forEach(p=>{
      if(/huisschild/i.test(p.textContent||'')&&!p.classList.contains('schildmoment'))p.style.display='none';
    });
  }
  const zin=(typeof winHaakZin==='function'&&winHaakZin(n))||(typeof verhaalMorgen==='function'?verhaalMorgen():'');
  const kas=typeof kasMorgen==='function'&&S.kweek&&Object.keys(S.kweek).length?kasMorgen():'';
  const tekst=(zin||'Wat een les, Luna.')+(kas?' '+kas:'');
  let haak=eind.querySelector('.winhaak');
  const oud=eind.querySelector('.tilly');
  if(!haak&&oud){haak=oud;haak.classList.add('winhaak')}
  if(!haak){
    haak=document.createElement('div');haak.className='winhaak';
    const kn=eind.querySelector('button, .m3actie');if(kn)kn.before(haak);else eind.appendChild(haak);
  }
  const port=(typeof portret==='function'?portret('tilly','sm'):'');
  haak.className='winhaak';
  haak.innerHTML=port?('<div class="whport">'+port+'</div><p>'+tekst+'</p>'):('<p>'+tekst+'</p>');
  if(oud&&oud!==haak)oud.remove();
  if(!eind.querySelector('.m3actie')){
    const act=document.createElement('div');act.className='m3actie';
    [...eind.querySelectorAll(':scope > button, :scope > .knop, :scope > .linkknop')].forEach(b=>act.appendChild(b));
    if(act.children.length)eind.appendChild(act);
  }
  const hook=eind.querySelector('.winhaak'), gift=eind.querySelector('.fgcadeau'), act=eind.querySelector('.m3actie');
  if(hook&&act)act.before(hook);
  if(gift&&act)act.before(gift);
  if(hook&&gift)gift.before(hook);
  eind.querySelectorAll('.feli').forEach(el=>{el.style.display='none'});
}
const _w=typeof m3Winst==='function'?m3Winst:null;
if(_w)window.m3Winst=m3Winst=function(n,b,...a){
  const r=_w.apply(this,arguments);
  try{
    const wacht=k=>{
      const eind=document.querySelector('.m3eind');if(!eind){if(k<20)setTimeout(()=>wacht(k+1),400);return}
      mooiWinst(n,b);
    };
    setTimeout(()=>wacht(0),400);
    setTimeout(()=>wacht(0),900);
  }catch(e){}
  return r;
};

/* Verliesscherm: troostend, en duidelijk wanneer Tilly helpt. */
const _ver136=typeof m3Verlies==='function'?m3Verlies:null;
if(_ver136)window.m3Verlies=m3Verlies=function(n,b,...a){
  const r=_ver136.apply(this,arguments);
  try{
    const eind=document.querySelector('.m3eind');
    if(eind&&!eind.querySelector('.troost')){
      eind.classList.add('troostend');
      const h2=eind.querySelector('h2');if(h2)h2.textContent='Bijna, Luna';
      const pech=(S.m3pech&&S.m3pech[n])|0;
      let zin='Zo dichtbij. We kijken rustig nog een keer, ik help zoeken.';
      if(pech>=5)zin='Ik blijf bij je. Volgende keer lig er een bom, een streep én drie extra zetten voor je klaar.';
      else if(pech>=3)zin='Ik help je een handje: volgende keer krijg je een extra bom en drie zetten. We komen er wel.';
      eind.querySelectorAll('.tilly').forEach(el=>{if(!el.closest('.troost'))el.style.display='none'});
      const p=document.createElement('div');p.className='troost';
      p.innerHTML=typeof tilly==='function'?tilly(zin):('<p>'+zin+'</p>');
      const kn=eind.querySelector('button');if(kn)kn.before(p);else eind.appendChild(p);
      if(!eind.querySelector('.m3actie')){
        const act=document.createElement('div');act.className='m3actie';
        [...eind.querySelectorAll(':scope > button, :scope > .knop, :scope > .linkknop')].forEach(b=>act.appendChild(b));
        if(act.children.length)eind.appendChild(act);
      }
    }
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


/* v136: ontwerpregels altijd, ook als een eerdere laag potten/kleuren terugzet. */
const _lvl136=typeof m3Level==='function'?m3Level:null;
if(_lvl136){
  window.m3Level=m3Level=function(n){
    const L=_lvl136.apply(this,arguments);
    try{
      if(n>=151){
        const plek=((n-1)%10)+1, adem=plek===1||plek===6;
        if(adem)L.kleuren=Math.min(L.kleuren||7,6);
        if((L.kleuren|0)>=7&&(L.pot|0)>=3){L.pot=2; (L.doelen||[]).forEach(d=>{if(d[0]==='p')d[1]=2})}
        const typ=['o','k','p'].filter(x=>(L.doelen||[]).some(d=>d[0]===x));
        if(L.plaag)typ.push('plaag');
        if(typ.length>2&&typ.includes('k')){L.kist=0;L.doelen=(L.doelen||[]).filter(d=>d[0]!=='k')}
        if((L.kleuren|0)>=7){
          const zw=(typeof lvZwaar==='function'?lvZwaar(n):0)|0;
          const minZ=zw>=2?24:zw>=1?26:28;
          const Z0=(L.zetten|0)+(L.extra|0);
          if(Z0<minZ)L.zetten=(L.zetten|0)+(minZ-Z0);
          const Z=(L.zetten|0)+(L.extra|0), cap=Math.max(18,Z*9/10|0);
          (L.doelen||[]).forEach(d=>{if(typeof d[0]==='number'&&d[1]>cap)d[1]=cap});
          const obst=typ.length+((L.doelen||[]).some(d=>d[0]==='i'||d[0]==='d')?1:0);
          if(obst>=2){
            if(plek!==5&&plek!==10)L.kleuren=6;
            else L.zetten=(L.zetten|0)+6;
          }
        }
        const ZETPLUS={190:10,210:8,220:12,230:8,250:8,263:4,265:8,295:6,321:12,466:16,520:10};
        if(n>=301){
          const Z=(L.zetten|0)+(L.extra|0), cap=Math.max(18,Z*9/10|0);
          (L.doelen||[]).forEach(d=>{if(typeof d[0]==='number'&&d[1]>cap)d[1]=cap});
          const obst=['o','k','p','i','d'].filter(x=>(L.doelen||[]).some(d=>d[0]===x));
          if((L.pot|0)>=3&&obst.some(x=>x!=='p')){L.pot=2;(L.doelen||[]).forEach(d=>{if(d[0]==='p')d[1]=2})}
          if((L.kleuren|0)>=7&&obst.length){
            if(plek===5||plek===10)L.zetten=(L.zetten|0)+8;
            else L.kleuren=6;
          }
        }
        if(ZETPLUS[n])L.zetten=(L.zetten|0)+ZETPLUS[n];
      }
    }catch(e){}
    return L;
  };
}


/* Elke gewonnen les geeft de planten in de kas een beetje extra zon (2 min), zodat een schooldag voelbaar is. */
const KWEEK_LES=120000;
const _wKas=typeof m3Winst==='function'?m3Winst:null;
if(_wKas)window.m3Winst=m3Winst=function(n,b,...a){
  const r=_wKas.apply(this,arguments);
  try{
    if(S.kweek){let n2=0;Object.values(S.kweek).forEach(p=>{if(p&&p.z){p.bonus=(p.bonus|0)+KWEEK_LES;n2++}});if(n2)bewaar()}
  }catch(e){}
  return r;
};
window.zwKring={DRANKEN,dagBonus,collectie,morgenZin};
})();
