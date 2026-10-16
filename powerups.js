/* ====== Power-ups, boosters uit superplanten, kristallen & gouden eieren ====== */
(function(){
const PU=n=>{const i=new Image();i.src='img/pu/'+n+'.webp';return i};const IM={};
['drank-blauw','drank-paars','drank-rood','bom-rood','bom-blauw','bom-goud','bliksem','kristal-paars','kristal-blauw','kristal-groen','kristal-paars-b','kristal-blauw-b','kristal-groen-b','ei-dicht','ei-open','verdwijn','wervel'].forEach(n=>IM[n]=PU(n));
const ok=i=>i&&i.complete&&i.naturalWidth;
/* één config: boosters (oogst van superplanten) */
window.BOOSTERS={
 basis:{prijs:30,naam:'Toverdrankbasissen',kort:'3 drankbasissen',img:'drank-blauw',uitleg:'Drie toverdrankbasissen staan klaar op het bord: blauw wist een rij, paars een kolom en rood ontploft als een kleine ketelbom.'},
 bom:{prijs:50,naam:'Gekleurde bommen',kort:'3 bommen',img:'bom-rood',uitleg:'Na je eerste zet verschijnen er drie gekleurde bommen op het veld. Laat ze ontploffen met een match ernaast of door ze te verschuiven!'},
 bliksem:{prijs:60,naam:'Bliksemschicht',kort:'kruis wissen',img:'bliksem',uitleg:'De Bliksemschicht wist een hele rij én kolom tegelijk, in de vorm van een kruis. Net als Harry’s litteken, maar dan nuttig.'},
 kristal:{prijs:40,naam:'Magische kristallen',kort:'3 kristallen',img:'kristal-blauw',uitleg:'Magische kristallen! Raak ze twee keer met een match ernaast: eerst barsten ze, dan springen ze open met Smekkies of iets moois erin.'},
 ei:{prijs:60,naam:'Gouden ei',kort:'gouden ei',img:'ei-dicht',uitleg:'Een gouden ei, net als bij het Toverschool Toernooi! Eén tik en het gaat open, de tweede tik geeft je de schat die erin zit.'},
 verdwijn:{prijs:120,naam:'Zware Verdwijnspreuk',kort:'half bord weg',img:'verdwijn',uitleg:'De Zware Verdwijnspreuk! Verschuif hem en bijna de helft van het bord verdwijnt in één keer. Gebruik hem op het juiste moment.'}};
S.bo=S.bo||{};S.uitlegPU=S.uitlegPU||{};
const SPEC={rh:'drank-blauw',rv:'drank-paars',bom:'bom-rood',bom2:'bom-goud',dblauw:'drank-blauw',dpaars:'drank-paars',drood:'drank-rood',gbom:'bom-goud',kruis:'bliksem',kruis3:'bliksem',verdwijn:'verdwijn'};
const UITLEG={rh:'Vier op een rij maakt een toverstaf. Die wist vijf vakjes in een lijn, met de staf in het midden. Een hele rij veeg je leeg met een toverdrankbasis uit de kas.',rv:'Vier op een rij maakt een toverstaf. Die wist vijf vakjes in een lijn, met de staf in het midden. Een hele kolom veeg je leeg met een toverdrankbasis uit de kas.',bom:'Een T- of L-vorm maakt een rode bom. Die blaast alles om zich heen weg.',gbom:'Een gouden bom! Die maak je vanaf nu met een grote T- of L-vorm van zeven stukjes. Hij blaast een flink vierkant van vijf bij vijf weg.',kruis:'Een Bliksemschicht! Een T- of L-vorm van zes stukjes maakt er een. Hij wist een rij en een kolom tegelijk.',
 kristal:BOOSTERS.kristal.uitleg,ei:BOOSTERS.ei.uitleg,kbom:'Daar zijn je gekleurde bommen uit de kas! Laat ze ontploffen met een match ernaast of door ze te verschuiven.',dblauw:BOOSTERS.basis.uitleg,verdwijn:BOOSTERS.verdwijn.uitleg,
 combi:'Tip: verschuif twee power-ups tegen elkaar voor een extra sterke combinatie. Een Bliksemschicht met een bom wist zelfs drie rijen en drie kolommen!'};
let uq=[],ut=0;window.puUitleg=k=>{if(!UITLEG[k]||S.uitlegPU[k]||uq.includes(k))return;uq.push(k);loop()};
function loop(){if(!uq.length||Date.now()<ut)return;const k=uq.shift();S.uitlegPU[k]=1;bewaar();ut=Date.now()+7000;try{gids(UITLEG[k],{})}catch(e){}setTimeout(loop,7200)}
/* tekenen van speciale stukken */
window.puTeken=(ctx,t,cel,nu)=>{let n=SPEC[t.s];if(t.s=='kbom')n=['bom-rood','bom-blauw','bom-goud'][Math.abs(t.k)%3];if(!n)return false;const i=IM[n];if(!ok(i))return false;
 const z=cel*(t.s=='kruis3'||t.s=='gbom'?1.02:.92)*(1+.04*Math.sin(nu/220));ctx.save();ctx.shadowColor='rgba(255,230,140,.9)';ctx.shadowBlur=cel*.18;ctx.drawImage(i,-z/2,-z/2,z,z);ctx.restore();
 if(t.s=='rh'||t.s=='rv'||t.s=='bom'||t.s=='kruis'||t.s=='gbom'||t.s=='kbom'||t.s=='dblauw'||t.s=='verdwijn')puUitleg(t.s);return true};
window.schatSprite=(s,over,kl)=>s=='x'?IM['kristal-'+(kl||'blauw')+(over<2?'-b':'')]:IM[over<2?'ei-open':'ei-dicht'];
/* effecten */
function beeldFlits(n,x,y,z,ms,kl){const e=document.createElement('img');e.src='img/pu/'+n+'.webp';e.className='puflits '+(kl||'');e.style.cssText=`left:${x-z/2}px;top:${y-z/2}px;width:${z}px;height:${z}px;--ms:${ms}ms`;document.body.appendChild(e);setTimeout(()=>e.remove(),ms)}
function tekst(t,x,y){const e=document.createElement('div');e.className='puwinst';e.textContent=t;e.style.cssText=`left:${x}px;top:${y}px`;document.body.appendChild(e);setTimeout(()=>e.remove(),1300)}
window.m3PuFx=(f,x,y,cel)=>{const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(f.t=='pu'){if(f.s=='wervel'){beeldFlits('wervel',innerWidth/2,y,Math.min(innerWidth,520),1300,'draai');try{fx.speel('tover')}catch(e){}}else if(f.s=='bliksem'){beeldFlits('bliksem',x,y,cel*3.2,600,'schok')}else beeldFlits(f.s,x,y,cel*2,500,'boem')}
 if(f.t=='tik'){beeldFlits('wervel',x,y,cel*.9,350,'boem klein')}
 if(f.t=='schat'){beeldFlits(f.s=='x'?'kristal-'+(f.kl||'blauw')+'-b':'ei-open',x,y,cel*1.3,700,'open');
  const smk=f.s=='x'?3:8;S.galjoenen+=smk;bewaar();try{stats()}catch(e){}tekst('+'+smk+' Smekkies',x,y-cel*.4);
  if(Math.random()<(f.s=='e'?.6:.3)&&window.m3VliegItem&&window.M3ITEMS){const v=(window.vakVan&&M3.b)?vakVan(M3.b.L.n).id:'herbologie';const L=M3ITEMS[v]||M3ITEMS.herbologie;const it=L[Math.random()*L.length|0];S.verzameld=S.verzameld||{};S.verzameld[it[0]]=(S.verzameld[it[0]]||0)+1;bewaar();setTimeout(()=>{m3VliegItem(it[0],x,y,document.getElementById('tasknop')||document.querySelector('#m3d .m3ico'),RM?0:500);tekst(it[1]+'!',x,y-cel*.9)},250)}}};
/* boosters bij levelstart */
const rnd=a=>a[Math.random()*a.length|0];
const vrij=b=>{const L=[];for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=b.g[r][c];if(t&&t.k>=0&&!t.s&&!b.kist[r][c])L.push([r,c])}return L};
function reeksPlan(reeks){const n=reeks|0;if(n<1)return {bommen:0,snaai:false};return {bommen:Math.min(3,n),snaai:n>=5}}
function reeksVrij(b){const L=[];for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=b.g[r][c];if(t&&t.k>=0&&!t.s&&!b.kist[r][c]&&!(b.strik&&b.strik[r][c]))L.push([r,c])}return L}
function reeksNeem(vrij,lo,hi){let pool=vrij.filter(p=>p[0]>=lo&&p[0]<=hi);if(!pool.length)pool=vrij;if(!pool.length)return null;const p=pool[Math.random()*pool.length|0];vrij.splice(vrij.findIndex(x=>x[0]==p[0]&&x[1]==p[1]),1);return p}
function reeksOpBord(b){if(!b||b.sim||(b.L&&b.L.plaag&&b.L.plaag.intro))return {bommen:0,snaai:false};const plan=reeksPlan(S.winReeks);if(!plan.bommen&&!plan.snaai)return plan;const vrij=reeksVrij(b);const banden=[[1,2],[3,4],[5,6]];let gezet=0;for(let i=0;i<plan.bommen;i++){const p=reeksNeem(vrij,...(banden[i]||[0,7]));if(!p)break;b.g[p[0]][p[1]].s='bom';gezet++}let snaai=false;if(plan.snaai){const p=reeksNeem(vrij,2,5);if(p){b.g[p[0]][p[1]].s='bal';snaai=true}}if(gezet||snaai){const delen=[];if(gezet===1)delen.push('Een bom staat klaar');else if(gezet)delen.push(gezet+' bommen staan klaar');if(snaai)delen.push('een Gouden Snaai staat klaar');toast(delen.join(', en ').replace(/^een/,'Een')+'.')}return {bommen:gezet,snaai}}
window.reeksTekst=n=>{const plan=reeksPlan(S.winReeks);if(!plan.bommen)return '';const p=window.plaagVan&&plaagVan(+n);if(p&&p.intro)return '';const bom=plan.bommen===1?'één bom staat':plan.bommen===2?'twee bommen staan':'drie bommen staan';return `<p class="reekswinst">Reeks ${S.winReeks|0}: ${bom} klaar op het bord${plan.snaai?', plus een Gouden Snaai':''}.</p>`};
window.m3NaBord=(b,boost)=>{uq=[];b.kt=b.kt||Array.from({length:RIJEN},()=>Array(KOL).fill(0));b.ktk=b.ktk||Array.from({length:RIJEN},()=>Array(KOL).fill(0));
 try{reeksOpBord(b)}catch(e){}
 const bo=(boost&&boost.bo)||[];if(!bo.length)return;
 bo.forEach(k=>{if(!(S.bo[k]>0))return;S.bo[k]--;
  if(k=='basis')['dblauw','dpaars','drood'].forEach(s=>{const v=rnd(vrij(b));if(v)b.g[v[0]][v[1]].s=s});
  if(k=='bliksem'){const v=rnd(vrij(b));if(v)b.g[v[0]][v[1]].s='kruis'}
  if(k=='verdwijn'){const v=rnd(vrij(b).filter(([r])=>r>=2&&r<=5));if(v)b.g[v[0]][v[1]].s='verdwijn'}
  if(k=='kristal'||k=='ei'){const n=k=='ei'?1:3;for(let i=0;i<n;i++){const v=rnd(vrij(b).filter(([r])=>r>=1&&r<=RIJEN-2));if(!v)break;const[r,c]=v;b.g[r][c]=null;b.kist[r][c]=2;b.kt[r][c]=k=='ei'?'e':'x';b.ktk[r][c]=rnd(['paars','blauw','groen'])}setTimeout(()=>puUitleg(k=='ei'?'ei':'kristal'),1600)}
  if(k=='bom'){const w=b.wissel.bind(b);let klaar=false;b.wissel=async(...a)=>{const r=await w(...a);if(r&&!klaar){klaar=true;b.wissel=w;setTimeout(()=>{vrij(b).sort(()=>Math.random()-.5).slice(0,3).forEach(([r,c])=>{b.g[r][c].s='kbom';b.g[r][c].sc=1.6;b.fx.push({t:'pu',s:'bom-'+['rood','blauw','goud'][Math.abs(b.g[r][c].k)%3],r,c})});try{M3.toonFx&&M3.toonFx()}catch(e){}},500)}return r}}});
 bewaar();setTimeout(()=>{if(bo.length>1||Object.values(S.uitlegPU).length>3)puUitleg('combi')},12000)};
/* keuze in het level-intro */
let gekozen=new Set();
window.boosterKeuze=n=>{gekozen=new Set();
 return `<div class="bokeuze"><p class="klein">Boosters (optioneel): tik om mee te nemen. Uit je kas, of koop er een met Smekkies.</p><div class="borij">${Object.entries(BOOSTERS).map(([k,d])=>`<button class="bochip ${S.bo[k]>0?'':'koop'}" data-bo="${k}" aria-pressed="false"><img src="img/pu/${d.img}.webp" alt=""><b>${d.naam}</b><small>${S.bo[k]>0?'×'+S.bo[k]:d.prijs+' Smekkies'}</small></button>`).join('')}</div></div>`};
window.boosterGekozen=()=>[...gekozen];
document.addEventListener('click',e=>{const c=e.target.closest('.bochip');if(!c)return;const k=c.dataset.bo;if(!gekozen.has(k)&&!(S.bo[k]>0)){const d=BOOSTERS[k];if(S.galjoenen<d.prijs){toast('Niet genoeg Smekkies voor '+d.naam+'.');return}S.galjoenen-=d.prijs;S.bo[k]=1;bewaar();try{stats()}catch(x){}c.classList.remove('koop');c.querySelector('small').textContent='gekocht';}if(gekozen.has(k))gekozen.delete(k);else gekozen.add(k);c.setAttribute('aria-pressed',gekozen.has(k));c.classList.toggle('aan',gekozen.has(k));try{fx.speel('klik')}catch(x){}});
})();
