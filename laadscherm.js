'use strict';
/* ====== Laadschermen per vak (generiek; config per thema) ====== */
const LAADSCHERM={
 herbologie:{img:'img/laadschermen/herbologie',klein:'img/laadschermen/herbologie-klein',
  /* Ken Burns: background-position x van → naar (Stronk links → mandragora/bloemen rechts) */
  pan:[22,80],duur:6000,
  tips:['Tip: mandragora’s gillen alleen als je ze uit de pot trekt. Oorwarmers op!','Tilly: “Kijk, die mandragora zwaait naar je! Of… schreeuwt hij?”','Tip: Duivelsstrik houdt niet van licht. Lumos!','Tilly: “Professor Stronk zegt: een gelukkige plant is een plant die praat.”','Tip: vijf of meer in één keer? Dan vult je toverpoeder-ampul.','Tilly: “Ik heb mijn handschoenen van drakenleer aan. Jij ook?”','Tip: water geven en drakenmest laten je kasplanten sneller groeien.']}
};
(()=>{const RMPL=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 const KLAAR={};const url=c=>(innerWidth<=600?c.klein:c.img)+'.webp';
 const laad=c=>{const u=url(c);if(KLAAR[u])return KLAAR[u];const i=new Image();i.src=u;return KLAAR[u]=i.decode().then(()=>u).catch(()=>u)};
 /* alvast vooraf laden zodra de app rustig is */
 setTimeout(()=>Object.values(LAADSCHERM).forEach(laad),2500);
 const doelTekst=(d,T)=>typeof d[0]=='number'?`${d[1]} × ${T.t[d[0]][0]}`:d[0]=='o'?`Ruim al het ${T.onkruid.toLowerCase()} op`:d[0]=='k'?`Breek alle ${T.kistMv||T.kist.toLowerCase()+'s'}`:d[0]=='p'?`Laat ${d[1]} ${T.potMv||T.pot.toLowerCase()+(/pot$/.test(T.pot)?'ten':'en')} zakken`:'';
 window.toonLaadscherm=(thema,n,bouw)=>{const c=LAADSCHERM[thema];if(!c){bouw&&bouw();return}
  const T=M3THEMA[thema];const L=m3Level(n);const tip=c.tips[(n+Math.floor(Date.now()/864e5))%c.tips.length];
  const o=document.createElement('div');o.id='laadscherm';o.className='ls';o.style.setProperty('--ls0',c.pan[0]+'%');o.style.setProperty('--ls1',c.pan[1]+'%');o.style.setProperty('--lsduur',c.duur+'ms');
  o.innerHTML=`<div class="ls-beeld"></div><div class="ls-vignet"></div><div class="ls-kop"><small>${T.n}</small><h2>Level ${n}</h2><p class="ls-doel">${L.doelen.map(d=>`<span>${doelTekst(d,T)}</span>`).join('')}</p><div class="ls-balk"><i></i></div></div><div class="ls-strook"><p>${tip}</p><small class="ls-tik">Tik om te beginnen</small></div>`;
  document.body.appendChild(o);requestAnimationFrame(()=>requestAnimationFrame(()=>o.classList.add('aan')));
  /* bord pas bouwen als het laadscherm dekkend is (geen harde wissel zichtbaar) */
  setTimeout(()=>{try{bouw&&bouw()}catch(e){console.warn(e)}},650);
  /* beeld pas tonen na decode, dan zacht infaden en pannen */
  Promise.race([laad(c),new Promise(r=>setTimeout(()=>r(url(c)),2000))]).then(u=>{o.querySelector('.ls-beeld').style.backgroundImage=`url("${u}")`;requestAnimationFrame(()=>o.classList.add('beeld'))});
  let weg=false;const t0=performance.now();const sluit=()=>{if(weg)return;weg=true;o.classList.add('uit');setTimeout(()=>o.remove(),800)};
  const tm=setTimeout(sluit,c.duur);setTimeout(()=>o.classList.add('tikbaar'),2000);
  o.addEventListener('pointerdown',()=>{if(performance.now()-t0>=2000){clearTimeout(tm);sluit()}})};
 const _sp=m3Speel;m3Speel=function(n,thema,...r){if(window._geenLaadscherm||!LAADSCHERM[thema]||document.getElementById('laadscherm'))return _sp(n,thema,...r);toonLaadscherm(thema,n,()=>_sp(n,thema,...r))};
})();
