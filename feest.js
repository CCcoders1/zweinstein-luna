/* Eindfeest na winst met zetten over: elke zet ruimt een stukje op (elke 5e een explosie), daarna gaan alle
   overgebleven specials af. Score telt zichtbaar op. Tikken = sneller (niet overslaan).
   Sterren, Smekkies en huisschilden worden berekend met het aantal zetten van VOOR het feest (b.zet blijft ongewijzigd). */
(()=>{if(typeof m3Winst!=='function'||typeof Bord==='undefined')return;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const slaap=ms=>new Promise(r=>setTimeout(r,ms));
/* ---------- score in de HUD ---------- */
let getoond=0,scoreDoel=0;
function scoreEl(){let e=document.getElementById('m3sc');if(!e){const t=document.querySelector('.m3mid .m3titel');if(!t)return null;t.insertAdjacentHTML('afterend','<div class="m3score">Score <b id="m3sc">0</b></div>');e=document.getElementById('m3sc');getoond=0}return e}
setInterval(()=>{try{if(typeof M3==='undefined'||!M3.b||M3.b.sim||document.body.dataset.view!=='match3')return;const e=scoreEl();if(!e)return;scoreDoel=M3.b.score|0;
 if(getoond>scoreDoel)getoond=scoreDoel;if(getoond<scoreDoel){getoond=Math.min(scoreDoel,getoond+Math.max(5,Math.ceil((scoreDoel-getoond)/4)));e.textContent=getoond.toLocaleString('nl-NL')}}catch(e){}},60);
/* ---------- hulpjes ---------- */
const vrijeTegels=b=>{const L=[];for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=b.g[r][c];if(t&&t.k>=0&&!t.s&&!b.kist[r][c]&&!(b.strik&&b.strik[r][c]))L.push([r,c])}return L};
const specials=b=>{const L=[];for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=b.g[r][c];if(t&&t.s&&!b.kist[r][c]&&!(b.strik&&b.strik[r][c]))L.push([r,c])}return L};
function vonk(van,naar,ms){if(RM||!van||!naar)return;const e=document.createElement('div');e.className='m3vonk';document.body.appendChild(e);
 const dx=naar[0]-van[0],dy=naar[1]-van[1];e.style.left=van[0]+'px';e.style.top=van[1]+'px';
 e.animate([{transform:'translate(-50%,-50%) scale(.6)',opacity:.2},{transform:`translate(calc(${dx*.5}px - 50%),calc(${dy*.5-40}px - 50%)) scale(1.1)`,opacity:1,offset:.5},{transform:`translate(calc(${dx}px - 50%),calc(${dy}px - 50%)) scale(.7)`,opacity:.9}],{duration:ms,easing:'cubic-bezier(.4,0,.3,1)',fill:'forwards'}).onfinish=()=>e.remove();setTimeout(()=>e.remove(),ms+400)}
function plusje(x,y,t){const e=document.createElement('div');e.className='m3plus';e.textContent=t;e.style.left=x+'px';e.style.top=y+'px';document.body.appendChild(e);setTimeout(()=>e.remove(),900)}
/* ---------- het feest ---------- */
async function feest(b){const log={pop:0,boem:0,spec:0,score0:b.score|0};window._feestLog=log;
 const cv=document.getElementById('m3c'),zEl=document.getElementById('m3z');if(!cv||!zEl)return;
 const zet0=b.zet;let over=zet0,sp=1,taps=0;
 // geen bijeffecten: geen doel-telling (pompoengroei), geen schatkist-beloningen, geen zeldzame zaadjes
 b.telDoel=()=>{};b.zaadKist=1;const push=b.fx.push;b.fx.push=function(...f){return push.apply(this,f.map(x=>x&&x.t=='schat'?{t:'tik',r:x.r,c:x.c,s:x.s}:x&&x.t=='vrij'?{t:'plank',r:x.r,c:x.c,over:0}:x))};
 b.wacht=ms=>new Promise(r=>setTimeout(r,ms/sp));
 const laag=document.createElement('div');laag.id='m3feest';laag.innerHTML='<span>Tik om te versnellen</span>';document.body.appendChild(laag);
 laag.addEventListener('pointerdown',e=>{e.preventDefault();taps++;sp=Math.min(12,taps==1?3.5:sp*1.7);laag.classList.add('snel');laag.querySelector('span').textContent=sp>=6?'⏩⏩ Supersnel':'⏩ Sneller';try{fx.speel('whoosh')}catch(x){}});
 const cr=()=>cv.getBoundingClientRect(),celW=()=>cr().width/KOL;
 const midden=(r,c)=>{const R=cr(),w=R.width/KOL;return [R.left+(c+.5)*w,R.top+(r+.5)*w]};
 const zR=()=>{const R=zEl.getBoundingClientRect();return [R.left+R.width/2,R.top+R.height/2]};
 const stap=Math.max(70,Math.min(170,4200/Math.max(1,zet0)));
 try{
  // fase 1: elke zet een stukje (elke 5e zet een explosie)
  for(let i=1;i<=zet0;i++){const vrij=vrijeTegels(b);if(!vrij.length)break;const d=stap/sp;
   const doel=vrij[Math.random()*vrij.length|0];vonk(zR(),midden(...doel),Math.max(60,d*1.1));
   over--;zEl.textContent=over;zEl.parentNode.classList.toggle('weinig',false);
   await slaap(Math.max(40,d*1.05));
   const [r,c]=doel;
   if(i%5===0){const cellen=[];for(let rr=r-1;rr<=r+1;rr++)for(let cc=c-1;cc<=c+1;cc++)if(b.binnen(rr,cc)){const t=b.g[rr][cc];if(t&&t.k>=0&&!t.s&&!b.kist[rr][cc]&&!(b.strik&&b.strik[rr][cc]))cellen.push([rr,cc,t.k])}
    cellen.forEach(([rr,cc,k])=>{b.g[rr][cc].weg=1;b.g[rr][cc]=null;b.fx.push({t:'pof',r:rr,c:cc,k})});b.fx.push({t:'bom',r,c,R:1});
    const pt=60*cellen.length+200;b.score+=pt;log.boem++;const m=midden(r,c);plusje(m[0],m[1],'+'+pt);try{fx.speel('kist')}catch(x){}}
   else{const t=b.g[r][c];if(t){t.weg=1;b.g[r][c]=null;b.fx.push({t:'pof',r,c,k:t.k})}b.score+=100;log.pop++;const m=midden(r,c);if(i%2)plusje(m[0],m[1],'+100');try{fx.speel('klik')}catch(x){}}
   try{M3.toonFx()}catch(x){}b.val();
  }
  zEl.textContent=0;await slaap(Math.max(60,260/sp));
  // tussenstand oplossen (rijen die door het vallen ontstonden)
  await M3.knal([]);
  // fase 2: alle specials gaan één voor één af
  const t0=Date.now();let n=0;
  while(n<30&&Date.now()-t0<9000){const L=specials(b);if(!L.length)break;const x=L.sort((p,q)=>p[0]-q[0]||p[1]-q[1])[0];const m=midden(...x);
   const voor=b.score;const ok=await M3.knal([x]);if(!ok){await slaap(120);n++;continue}
   b.score+=150;log.spec++;n++;plusje(m[0],m[1],'+'+((b.score-voor)|0));try{fx.speel('tover')}catch(e){}
   await slaap(Math.max(40,180/sp))}
  await slaap(Math.max(80,350/sp));
 }catch(e){console.warn(e)}
 finally{laag.remove();delete b.telDoel;delete b.wacht;b.fx.push=push;zEl.textContent=zet0;log.score=b.score|0;log.sp=sp;
  const e=scoreEl();if(e){getoond=b.score|0;e.textContent=getoond.toLocaleString('nl-NL')}}}
/* ---------- in m3Winst haken (buitenste laag) ---------- */
const _w=m3Winst;
window.m3Winst=m3Winst=function(n,b,...a){
 let doen=false;try{doen=!!(b&&!b.sim&&!b._feest&&b.zet>0&&typeof M3!=='undefined'&&M3.b===b&&M3.knal&&document.getElementById('m3c')&&document.body.dataset.view==='match3')}catch(e){}
 const klaar=()=>{const r=_w.call(this,n,b,...a);try{const sc=b.score|0;const h=document.querySelector('.m3eind h2');if(h&&sc&&!document.querySelector('.m3eindscore'))h.insertAdjacentHTML('afterend',`<p class="m3eindscore">Score <b>${sc.toLocaleString('nl-NL')}</b></p>`)}catch(e){}return r};
 if(!doen)return klaar();
 b._feest=1;let gedaan=false;const af=()=>{if(gedaan)return;gedaan=true;klaar()};
 feest(b).catch(e=>console.warn(e)).finally(af);setTimeout(af,30000);
};
})();
