'use strict';
/* ====== v126 Economie: één plek voor huisschilden en schooldagen ======
   Regels (zie ook README → Economie):
   - huisschilden komen ALLEEN uit gewonnen levels: 1 per ster, max 3 per level; opnieuw spelen geeft alleen het verschil
   - sterren komen uit de eindscore (huispunten.js); bestaande sterren gaan nooit omlaag
   - uitgeven alleen voor hersteldoelen (ECO.betaal), elk doel maar één keer
   - een schooldag gaat pas door als alle 10 doelen af zijn én het laatste level van de dag gewonnen is (schooldagen.js)
   - bij elke nieuwe schooldag hooguit 5 schilden mee, de rest 10 Smekkies per stuk (ECO.dagWissel, maar één keer per dag)
   - ranglijst = verdiende schilden = som van de beste sterren per level (ECO.verdiend), niet het saldo
   ECO.check() bewaakt de invarianten bij het laden en na elke economie-gebeurtenis en repareert stil (nooit sterren
   omlaag, nooit voortgang weg); afwijkingen komen als 'A'-regel in het speellog. */
(function(){
const MAXST=3,REST=5,WISSEL=10,LPD=20,DAGEN=150;
const int=(x,d=0)=>{const y=Math.floor(+x);return Number.isFinite(y)?y:d};
const nu=()=>Math.round(Date.now()/1000);
const log=r=>{try{if(!Array.isArray(S.log))S.log=[];S.log.push(r);if(S.log.length>500)S.log.splice(0,S.log.length-500)}catch(e){}};
const afw=t=>log(['A',nu(),String(t).slice(0,240)]);
const obj=x=>x&&typeof x=='object'&&!Array.isArray(x);
const maxDag=()=>Math.max(0,Math.min(DAGEN,Math.floor((Math.max(1,int(S.m3lvl,1))-1)/LPD)));
const sw=()=>{const m=S.wisselMelding;if(!m||document.querySelector('[data-pop=schildwissel]'))return;
 try{const o=document.createElement('div');o.className='modal';o.dataset.pop='schildwissel';const p=m.prof||'De professor';
  o.innerHTML=`<div class="modalin rococo keuze schildw"><h2>${p} wisselt je schilden om</h2><p>Je had nog ${m.had!=null?m.had:m.over+REST} huisschilden over van de vorige schooldag. ${m.mee!=null?m.mee:REST} neem je mee naar deze schooldag, de andere ${m.over} wisselt ${p} voor je om:</p><p style="font-size:1.4em;margin:.4em 0"><b>+${m.sm} Smekkies</b></p><p class="klein">Elke nieuwe schooldag neem je hooguit ${REST} huisschilden mee. Nieuwe schilden verdien je gewoon weer met levels.</p><button class="knop volgende">Dank je wel!</button></div>`;
  document.body.appendChild(o);o.querySelector('button').onclick=()=>{o.remove();delete S.wisselMelding;bewaar();try{stats()}catch(e){}};try{stats()}catch(e){}}catch(e){}};
const ECO={REST,WISSEL,MAXST,
 /* verdiende schilden (ranglijst) */
 verdiend(){let s=0;for(const k in S.lvSter||{}){const x=Math.min(MAXST,int(S.lvSter[k]));if(int(k)>0&&x>0)s+=x}return s},
 /* level gewonnen met st sterren → geeft alleen het verschil met wat dit level al opleverde */
 geefLevel(n,st){n=int(n);st=Math.max(1,Math.min(MAXST,int(st,1)));if(n<1)return 0;
  if(!obj(S.lvSter))S.lvSter={};if(!obj(S.lvSchild))S.lvSchild={};
  const oud=Math.min(MAXST,Math.max(0,int(S.lvSter[n])));if(st>oud)S.lvSter[n]=st;
  const al=Math.min(MAXST,Math.max(0,int(S.lvSchild[n])));const sch=Math.max(0,st-al);
  S.lvSchild[n]=Math.max(al,st);S.schilden=Math.max(0,int(S.schilden))+sch;
  ECO.check('winst',1);bewaar();return sch},
 /* hersteldoel betalen; false als het doel al af is of het saldo te laag */
 betaal(id,kost){kost=int(kost,-1);if(kost<0||!id)return false;S.taken=obj(S.taken)?S.taken:{};if(S.taken[id])return false;
  const s=Math.max(0,int(S.schilden));if(s<kost)return false;S.schilden=s-kost;log(['U',nu(),kost,int(S.schoolDag)]);return true},
 /* nieuwe schooldag 'dag' (index) begint: overschot boven 5 → Smekkies. Idempotent per dag. Roept geen bewaar() aan:
    de aanroeper bewaart dag + wissel in één keer, dus een gesloten app kan niet half wisselen. */
 dagWissel(dag,prof){dag=int(dag,-1);if(dag<1)return 0;if(int(S.wisselTot,-1)>=dag)return 0;S.wisselTot=dag;log(['D',nu(),dag]);
  const over=Math.max(0,int(S.schilden))-REST;if(over<=0)return 0;const sm=over*WISSEL;
  S.schilden=REST;S.galjoenen=Math.max(0,int(S.galjoenen))+sm;log(['W',nu(),over,sm,dag]);
  S.wisselMelding={over,sm,prof:prof||'',dag,had:over+REST,mee:REST};setTimeout(sw,1200);return over},
 /* eenmalige inhaalslag (v126, goedgekeurd): dag begon vóór de 5-schilden-regel bestond → nu alsnog voor de huidige dag:
    toegestaan = 5 + schilden die al met levels van déze dag verdiend zijn; de rest → 10 Smekkies. Daarna nooit meer. */
 inhalen(){if(Number.isInteger(S.wisselTot))return 0;const d=int(S.schoolDag,-1);if(d<0)return 0;
  let w=-1;(Array.isArray(S.log)?S.log:[]).forEach(r=>{if(r&&r[0]=='W')w=Math.max(w,int(r[4],-1))});
  if(d<1||w>=d){S.wisselTot=d;return 0}
  let b=d*LPD+1,e=b+LPD-1,prof='';try{const st=schoolDag(d);b=st.begin;e=st.einde;const vo=schoolDag(d-1);prof=vo&&vo.vak&&vo.vak.prof||''}catch(x){}
  let dagSch=0;const LS=obj(S.lvSchild)?S.lvSchild:{};for(let n=b;n<=e;n++)dagSch+=Math.min(MAXST,Math.max(0,int(LS[n])));
  const mag=REST+dagSch,had=Math.max(0,int(S.schilden));S.wisselTot=d;
  if(had<=mag){log(['A',nu(),'inhaal dag '+(d+1)+': '+had+' schilden ≤ '+mag+', niets omgewisseld']);return 0}
  const over=had-mag,sm=over*WISSEL;S.schilden=mag;S.galjoenen=Math.max(0,int(S.galjoenen))+sm;
  log(['W',nu(),over,sm,d]);S.wisselMelding={over,sm,prof,dag:d,had,mee:mag};setTimeout(sw,1200);return over},
 toonMelding:sw,
 /* invarianten; stil=1 → niet zelf bewaren */
 check(reden,stil){const a=[];
  const vroeg=reden==='laden';   /* vóór de migraties van kern/huispunten: niets aanmaken, alleen bestaande waarden netjes maken */
  if(!obj(S.lvSter)){if(vroeg&&S.lvSter==null)S.lvSter={};else{S.lvSter={};a.push('lvSter geen object')}}
  if(!obj(S.lvSchild)){if(!vroeg||S.lvSchild!=null){if(S.lvSchild!=null)a.push('lvSchild geen object');S.lvSchild=null}}
  const LS=S.lvSchild||{};
  const m=Math.max(1,int(S.m3lvl,1));if(!(vroeg&&S.m3lvl==null)&&m!==S.m3lvl){a.push('m3lvl '+S.m3lvl+'→'+m);S.m3lvl=m}
  for(const k of Object.keys(S.lvSter)){const n=int(k);const v0=S.lvSter[k];
   if(!(n>0)||String(n)!==k){delete S.lvSter[k];a.push('lvSter sleutel '+k);continue}
   let v=int(v0,-1);if(v<0)v=n<m?Math.max(1,int(LS[k])):0;if(v>MAXST)v=MAXST;
   if(v!==v0){S.lvSter[k]=v;a.push('lvSter['+k+'] '+v0+'→'+v)}}
  for(const k of Object.keys(LS)){const n=int(k);const v0=LS[k];
   if(!(n>0)||String(n)!==k){delete LS[k];a.push('lvSchild sleutel '+k);continue}
   let v=Math.min(MAXST,Math.max(0,int(v0)));if(v!==v0){LS[k]=v;a.push('lvSchild['+k+'] '+v0+'→'+v)}
   if(v>int(S.lvSter[k])){a.push('lvSter['+k+'] omhoog naar betaald '+v);S.lvSter[k]=v}}
  if(S.lvSchild==null&&!vroeg){S.lvSchild={};Object.keys(S.lvSter).forEach(k=>S.lvSchild[k]=S.lvSter[k]|0);a.push('lvSchild uit sterren')}
  if(S.lvSchild==null)delete S.lvSchild;
  const s=Math.max(0,int(S.schilden));if(!(vroeg&&S.schilden==null)&&s!==S.schilden){a.push('schilden '+S.schilden+'→'+s);S.schilden=s}
  const g=Math.max(0,int(S.galjoenen));if(g!==S.galjoenen){a.push('Smekkies '+S.galjoenen+'→'+g);S.galjoenen=g}
  if(S.schoolDag!=null){const d=Math.max(0,Math.min(DAGEN,int(S.schoolDag)));const md=maxDag();
   let d2=d>md?md:d;if(d2!==S.schoolDag){a.push('schoolDag '+S.schoolDag+'→'+d2);S.schoolDag=d2}}
  /* wisselTot = laatste dag waarvoor de overschot-regel al gedaan is. Ontbreekt hij (dag begon vóór v125/v126):
     na alle migraties (niet bij 'laden') één keer inhalen voor de huidige dag. */
  if(!vroeg&&!Number.isInteger(S.wisselTot)){const o=ECO.inhalen();if(o)a.push('inhaal dag '+(S.wisselTot+1)+': '+o+' schilden omgewisseld')}
  if(typeof window.schoolDagHerstel=='function'&&reden!=='winst'){try{const n=schoolDagHerstel();if(n)a.push('schooldag hersteld +'+n)}catch(e){}}
  if(a.length)afw((reden||'check')+': '+a.join('; '));
  if(a.length&&!stil)bewaar();return a}
};
window.ECO=ECO;
ECO.check('laden',1);   /* vóór de andere scripts: normaliseren + wisselTot-migratie */
/* na alle scripts: buitenste laag om m3Winst (dubbele winst-aanroep per bord telt niet), herstel, melding */
document.addEventListener('DOMContentLoaded',()=>{
 if(typeof m3Winst=='function'){const _w=m3Winst;window.m3Winst=m3Winst=function(n,b,...r){
  if(b&&typeof b=='object'){if(b._ecoWin){afw('dubbele winst genegeerd L'+n);return}b._ecoWin=1}
  return _w.call(this,n,b,...r)}}
 ECO.check('start');if(S.wisselMelding)setTimeout(sw,1500);
});
/* meerdere tabbladen: schrijft een ander tabblad de save, neem die over (geen dubbele winst, geen oude stand terugschrijven) */
/* NB: hier nooit bewaren of schermen opnieuw opbouwen (V.home bewaart) – anders schrijven twee tabbladen elkaar eindeloos over */
window.addEventListener('storage',e=>{if(e.key!==SK||!e.newValue)return;try{if(e.newValue===JSON.stringify(S))return;const d=JSON.parse(e.newValue);if(!obj(d))return;
 Object.assign(S,d);ECO.check('ander tabblad',1);window._ecoTabTeken=1;try{stats()}catch(x){}}catch(x){}});
})();
