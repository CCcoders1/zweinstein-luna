/* ====== v123 Speellog: alleen op deze telefoon (geen server). Ringbuffer van 500 regels in de save (S.log),
   dus mee in back-up en reservekopie, maar nooit gesynchroniseerd. Leesbaar in het makerscherm.
   Regels (compact):  ['L',t,level,uitslag w/v/a,score,sterren,zettenOver,boosters,duurSec,schildenErbij,spijbel]
                      ['S',start,eind]  ['U',t,schildenUitgegeven,dag]  ['D',t,nieuweDag]  ['W',t,schildenOmgewisseld,smekkies,nieuweDag]   (t = seconden sinds 1970) */
(function(){const MAX=500,nu=()=>Math.round(Date.now()/1000);
 const L=()=>{if(!Array.isArray(S.log))S.log=[];return S.log};
 const zet=r=>{const a=L();a.push(r);if(a.length>MAX)a.splice(0,a.length-MAX);return r};
 /* ---- sessies: nieuwe sessie bij openen of na 10+ min weg ---- */
 let ses=null;const begin=()=>{ses=zet(['S',nu(),nu()])};
 const bij=()=>{if(ses)ses[2]=nu()};
 begin();
 document.addEventListener('visibilitychange',()=>{if(document.hidden){bij();try{bewaar()}catch(e){}}else if(!ses||nu()-ses[2]>600)begin();else bij()});
 setInterval(()=>{if(!document.hidden)bij()},30000);
 /* ---- schilden uitgegeven & dagvoortgang (vergelijk met vorige stand) ---- */
 let sch=S.schilden|0,dag=S.schoolDag|0;
 setInterval(()=>{const s=S.schilden|0,d=S.schoolDag|0;
  /* v126: 'U' (uitgeven), 'D' (nieuwe dag) en 'W' (wissel) schrijft economie.js zelf; hier alleen nog onverklaarde dalingen */
  sch=s;dag=d},1500);
 /* ---- levelpogingen ---- */
 const voorraad=()=>Object.assign({},S.bo||{});
 const gebruikt=v=>{const o=[];const b=S.bo||{};for(const k in v){const x=(v[k]|0)-(b[k]|0);if(x>0)o.push(x>1?k+'×'+x:k)}return o.join('+')};
 let wacht=null;
 const koppel=b=>{if(!b)return null;if(!b._logP&&wacht&&!wacht.b){wacht.b=b;b._logP=wacht}return b._logP||null};
 const afgebroken=()=>{const b=M3&&M3.b;if(!b||b.sim||b._logR||!(b.score>0))return;const p=koppel(b);if(!p)return;
  b._logR=1;zet(['L',nu(),p.n,'a',b.score|0,0,b.zet|0,gebruikt(p.v),nu()-p.t0,0,p.sp|0])};
 if(typeof m3Speel==='function'){const _s=m3Speel;m3Speel=function(n,thema,boost){
  if(!(boost&&boost._stronkKlaar)){try{afgebroken()}catch(e){}wacht={n:+n,t0:nu(),v:voorraad(),sp:0}}
  return _s.apply(this,arguments)}}
 if(typeof m3Verlies==='function'){const _v=m3Verlies;m3Verlies=function(n,b){const r=_v.apply(this,arguments);
  try{if(b&&!b.sim){const p=koppel(b)||{n:+n,t0:nu(),v:voorraad()};const sp0=(S.bo&&S.bo.spijbel)|0;
   if(p.rij){p.rij[1]=nu();p.rij[4]=b.score|0;p.rij[6]=0;p.rij[8]=nu()-p.t0}
   else p.rij=zet(['L',nu(),+n,'v',b.score|0,0,0,gebruikt(p.v),nu()-p.t0,0,0]);
   b._logR=1;bewaar();
   const k=document.getElementById('m3plus5');if(k)k.addEventListener('click',()=>{if(((S.bo&&S.bo.spijbel)|0)<sp0){b._logR=0;p.sp=(p.sp|0)+1}})}}catch(e){}
  return r}}
 if(typeof m3Winst==='function'){const _w=m3Winst;m3Winst=function(n,b){const s0=(S.lvSchild&&S.lvSchild[n])|0;const r=_w.apply(this,arguments);
  try{if(b&&!b.sim&&!b._logW){b._logW=1;const p=koppel(b)||{n:+n,t0:nu(),v:voorraad()};const st=window.m3SterVan?m3SterVan(b,n):1;const erbij=Math.max(0,((S.lvSchild&&S.lvSchild[n])|0)-s0);sch=S.schilden|0;
   const rij=['L',nu(),+n,'w',b.score|0,st,b.zet|0,gebruikt(p.v),nu()-p.t0,erbij,p.sp|0];
   if(p.rij)p.rij.splice(0,rij.length,...rij);else zet(rij);
   b._logR=1;wacht=null;bewaar()}}catch(e){}
  return r}}
 /* ---- samenvatting ---- */
 const BANDEN=[[1,30],[31,60],[61,100],[101,150],[151,200],[201,1e9]];
 const dagS=t=>new Date(t*1000).toLocaleDateString('nl-NL',{weekday:'short',day:'numeric',month:'short'});
 const tijd=t=>new Date(t*1000).toLocaleString('nl-NL',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
 const min=s=>s<90?s+' s':Math.round(s/60)+' min';
 const pct=(a,b)=>b?Math.round(100*a/b)+'%':'–';
 window.zwLogSamen=()=>{const a=L(),P=a.filter(r=>r[0]=='L'),W=P.filter(r=>r[3]=='w'),Ses=a.filter(r=>r[0]=='S'&&r[2]-r[1]>=10);
  const band=BANDEN.map(([v,t])=>{const p=P.filter(r=>r[2]>=v&&r[2]<=t);const w=p.filter(r=>r[3]=='w');return {naam:t>999?v+'+':v+'–'+t,p:p.length,w:w.length,s3:w.filter(r=>r[5]>=3).length}}).filter(x=>x.p);
  const per={};P.forEach(r=>{const o=per[r[2]]=per[r[2]]||{n:r[2],p:0,v:0,w:0};o.p++;r[3]=='w'?o.w++:o.v++});
  const lv=Object.values(per);
  const vast=lv.filter(o=>o.v>0).sort((x,y)=>y.v-x.v||y.n-x.n).slice(0,5);
  const dagen=new Set(Ses.map(r=>new Date(r[1]*1000).toDateString()));
  const duur=Ses.reduce((s,r)=>s+r[2]-r[1],0);
  const U=a.filter(r=>r[0]=='U'),D=a.filter(r=>r[0]=='D');
  return {regels:a.length,pogingen:P.length,winst:W.length,band,gemPog:lv.length?(P.length/lv.length):0,s3:W.filter(r=>r[5]>=3).length,
   sessies:Ses.length,dagen:dagen.size,gemSes:Ses.length?duur/Ses.length:0,vast,schErbij:W.reduce((s,r)=>s+(r[9]|0),0),schUit:U.reduce((s,r)=>s+r[2],0),dag:D,
   van:a.length?a[0][1]:0,laatste:P.slice(-8).reverse()}};
 const UIT={w:'gewonnen',v:'verloren',a:'gestopt'};
 window.zwLogTekst=()=>{const z=zwLogSamen(),a=L();const r=[];
  r.push(`Zweinstein Luna – speellog (${S.naam||'speler'}) · gemaakt ${tijd(nu())}`);
  r.push(`Level nu: ${S.m3lvl||1} · schooldag ${(S.schoolDag|0)+1} · ${S.schilden|0} schilden · ${S.galjoenen|0} Smekkies · app v126`);
  r.push(`Periode: vanaf ${z.van?tijd(z.van):'–'} · ${z.regels} regels (max ${MAX})`,'');
  r.push(`Pogingen ${z.pogingen}, gewonnen ${z.winst} (${pct(z.winst,z.pogingen)}) · gem. ${z.gemPog.toFixed(1)} pogingen per level · 3★ ${pct(z.s3,z.winst)} van de winsten`);
  z.band.forEach(b=>r.push(`  levels ${b.naam}: ${b.p} pogingen, winst ${pct(b.w,b.p)}, 3★ ${pct(b.s3,b.w)}`));
  r.push(`Sessies ${z.sessies} op ${z.dagen} dag(en) · ${z.dagen?(z.sessies/z.dagen).toFixed(1):'–'} per dag · gem. ${min(Math.round(z.gemSes))}`);
  r.push(`Schilden verdiend ${z.schErbij}, uitgegeven ${z.schUit}`);
  r.push(`Vastgelopen (meeste verliezen): ${z.vast.map(o=>`L${o.n} ${o.v}× (${o.w?'gehaald':'nog niet'})`).join(', ')||'geen'}`,'');
  r.push('--- regels (oud → nieuw) ---');
  a.forEach(x=>{if(x[0]=='L')r.push(`${tijd(x[1])}  L${x[2]} ${UIT[x[3]]||x[3]}  score ${x[4]}  ${x[3]=='w'?x[5]+'★ ':''}zetten over ${x[6]}  ${min(x[8])}${x[7]?'  boosters '+x[7]:''}${x[9]?'  +'+x[9]+' schild':''}${x[10]?'  spijbel×'+x[10]:''}`);
   else if(x[0]=='S')r.push(`${tijd(x[1])}  sessie ${min(x[2]-x[1])}`);
   else if(x[0]=='U')r.push(`${tijd(x[1])}  ${x[2]} schild(en) uitgegeven (dag ${x[3]+1})`);
   else if(x[0]=='D')r.push(`${tijd(x[1])}  naar schooldag ${x[2]+1}`);
   else if(x[0]=='A')r.push(`${tijd(x[1])}  ⚠ hersteld: ${x[2]}`);
   else if(x[0]=='W')r.push(`${tijd(x[1])}  ${x[2]} overgebleven schild(en) omgewisseld voor ${x[3]} Smekkies (naar dag ${x[4]+1})`)});
  return r.join('\n')};
 const html=()=>{const z=zwLogSamen();return `<section class="kaart sierlijst logkaart"><h3>Speellog</h3>
  <p class="klein">${z.regels} regels sinds ${z.van?dagS(z.van):'–'} · alleen op deze telefoon, niet verstuurd; wel in de back-up.</p>
  <div class="logcijfers"><span><b>${pct(z.winst,z.pogingen)}</b>winst</span><span><b>${z.gemPog?z.gemPog.toFixed(1):'–'}</b>pogingen/level</span><span><b>${pct(z.s3,z.winst)}</b>3★ van winst</span><span><b>${z.dagen?(z.sessies/z.dagen).toFixed(1):'–'}</b>sessies/dag</span><span><b>${z.sessies?min(Math.round(z.gemSes)):'–'}</b>per sessie</span><span><b>${z.schErbij}/${z.schUit}</b>schild +/−</span></div>
  ${z.band.length?`<table class="logtab"><tr><th>Levels</th><th>Pog.</th><th>Winst</th><th>3★</th></tr>${z.band.map(b=>`<tr><td>${b.naam}</td><td>${b.p}</td><td>${pct(b.w,b.p)}</td><td>${pct(b.s3,b.w)}</td></tr>`).join('')}</table>`:'<p class="klein">Nog geen levels gespeeld.</p>'}
  <p class="klein"><b>Vastgelopen:</b> ${z.vast.map(o=>`L${o.n} ${o.v}×${o.w?' ✓':''}`).join(' · ')||'nergens'}</p>
  ${z.laatste.length?`<p class="klein"><b>Laatste pogingen:</b><br>${z.laatste.map(x=>`L${x[2]} ${x[3]=='w'?'✓ '+'★'.repeat(x[5]):x[3]=='v'?'✗':'–'} ${x[4].toLocaleString('nl-NL')}`).join(' · ')}</p>`:''}
  <div class="bkrij"><button class="knop" id="logexp">Exporteer als tekst</button></div><textarea id="logtxt" class="bktxt" rows="5" hidden></textarea></section>`};
 const _mk=V.maker;if(_mk)V.maker=(...a)=>{const r=_mk(...a);try{const app=$('#app');const h2=app.querySelector('h2');
  (h2?h2:app.firstElementChild||app).insertAdjacentHTML(h2?'afterend':'beforeend',html());
  $('#logexp').onclick=async()=>{const t=zwLogTekst();const ta=$('#logtxt');
   try{if(navigator.share){await navigator.share({title:'Zweinstein speellog',text:t});toast('Speellog gedeeld');return}}catch(e){if(e&&e.name=='AbortError')return}
   ta.hidden=false;ta.value=t;ta.select();try{await navigator.clipboard.writeText(t);toast('Speellog gekopieerd')}catch(e){toast('Selecteer en kopieer de tekst')}}}catch(e){}
  return r};
})();
