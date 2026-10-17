'use strict';
/* ====== Spel-achtergronden per vak achter het match-3-bord (ontworpen door de maker) ====== */
(()=>{const FOCUS={herbologie:[22,'img/laadschermen/herbologie'],toverdranken:[50,'img/spel/toverdranken'],gedaante:[31,'img/spel/gedaante'],bezweringen:[38,'img/spel/bezweringen'],verweer:[64,'img/spel/verweer'],astronomie:[28,'img/spel/astronomie']};
 const KL=innerWidth*(devicePixelRatio||1)>900?'':'-klein';const BEELD={};
 const laad=u=>BEELD[u]||(BEELD[u]=(()=>{const i=new Image();i.src=u;return (i.decode?i.decode():Promise.resolve()).catch(()=>{}).then(()=>u)})());
 const info=n=>{const id=window.vakVan?vakVan(n||S.m3lvl||1).id:'herbologie';const f=FOCUS[id]||FOCUS.herbologie;return{id,x:f[0],u:f[1]+KL+'.webp'}};
 function laag(){let d=document.getElementById('spelbg');if(!d){d=document.createElement('div');d.id='spelbg';d.innerHTML='<i></i>';document.body.insertBefore(d,document.body.firstChild)}return d}
 function toon(n){const f=info(n);const d=laag();laad(f.u).then(u=>{const i=d.querySelector('i');if(d.dataset.u!==u){d.dataset.u=u;i.style.backgroundImage=`url("${u}")`;i.style.backgroundPosition=`${f.x}% 30%`}requestAnimationFrame(()=>d.classList.add('aan'))})}
 function weg(){const d=document.getElementById('spelbg');if(d)d.classList.remove('aan')}
 const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
 /* lang laadscherm alleen bij het eerste level van een sessie of het eerste level van een vak; anders korte intro */
 function langeIntro(n,th){if(!LAADSCHERM[th])return false;const v=window.vakVan?vakVan(n):{van:1};if(n===v.van)return true;try{if(!sessionStorage.zw_ls){sessionStorage.zw_ls=1;return true}}catch(e){}return false}
 function korteIntro(n,th){const f=info(n);const d=laag();const app=document.getElementById('app');let klaar=false;
  d.classList.add('intro');document.body.classList.add('lvintro');
  const t=document.createElement('div');t.id='lvintro';const T=M3THEMA[th]||{};t.innerHTML=`<div class="lvi-in"><small>${T.n||''}</small><h2>Level ${n}</h2><i class="lvi-v"></i></div>`;document.body.appendChild(t);
  const t00=performance.now();const eind=()=>{if(klaar)return;if(performance.now()-t00<480){setTimeout(eind,480-(performance.now()-t00));return}klaar=true;clearTimeout(t1);clearTimeout(t2);d.classList.remove('intro');document.body.classList.remove('lvintro');t.classList.add('uit');setTimeout(()=>t.remove(),600)};
  const t1=setTimeout(()=>t.classList.add('zicht'),RM?200:2000);const t2=setTimeout(eind,RM?900:3400);
  t.addEventListener('pointerdown',eind);d.dataset.tik=1;window._lvSkip=eind}
 const _sp=m3Speel;m3Speel=function(n,th,...r){try{toon(n)}catch(e){}
  if(langeIntro(n,th))return _sp(n,th,...r);
  korteIntro(n,th);setTimeout(()=>{window._geenLaadscherm=true;try{_sp(n,th,...r)}catch(e){console.warn(e)}finally{window._geenLaadscherm=false}},RM?0:400)};
 const _ga=ga;ga=function(s,...a){if(s==='match3'){try{laad(info(a[0]).u)}catch(e){}}else weg();return _ga(s,...a)};
 setTimeout(()=>{try{laad(info(S.m3lvl).u)}catch(e){}},3000);
})();
/* Eenmalig op deze telefoon: alles open om te testen, met 10.000 Smekkies. */
function proefKist(){
 if(S.proefKist)return;
 S.proefKist=1;
 S.galjoenen=Math.max(S.galjoenen|0,10000);
 S.m3lvl=Math.max(S.m3lvl|0,560);
 S.potUpgrade=Math.max(S.potUpgrade|0,4);
 S.vloerpot=1;S.groteTafel=1;S.mkUitleg=1;S.kasVerhuisMeld=1;S.groenPoortUitleg=1;S.levUitleg=1;
 S.mest=Math.max(S.mest|0,15);
 S.harten=S.harten||{n:5,t:Date.now()};S.harten.n=5;S.harten.t=Date.now();
 S.ampul=S.ampul||{n:0,vol:0};S.ampul.vol=Math.max(S.ampul.vol|0,8);
 S.elfjes=S.elfjes||{};if((S.elfjes.pip||0)<Date.now())S.elfjes.pip=Date.now()+864e5;
 S.zaden=S.zaden||{};
 ['varkensgras','valeriaan','wolfsmelk','alsem','affodil','sodejus','kieuwwier','mandragora','tentacula','duivelsstrik'].forEach(z=>{S.zaden[z]=Math.max(S.zaden[z]|0,3)});
 S.kweek=S.kweek||{};
 if(!S.kweek[100])S.kweek[100]={z:'mandragora',t:Date.now()-8*36e5,bonus:0};
 if(!S.kweek[101])S.kweek[101]={z:'valeriaan',t:Date.now()-8*36e5,bonus:0};
 S.superzaad=S.superzaad||{};
 ['flessenbes','bomlicht','bliksemkristal','goudkristal','eigoud','spreukvaren'].forEach(z=>{S.superzaad[z]=Math.max(S.superzaad[z]|0,1)});
 S.bo=S.bo||{};
 ['bom','bliksem','kristal','ei','verdwijn'].forEach(k=>{S.bo[k]=Math.max(S.bo[k]|0,3)});
 S.bonusOpen=S.bonusOpen||{};
 ['memory','drank','lessen','snaai','spreuk','toverstok','mysterie','bonen'].forEach(k=>{S.bonusOpen[k]=1});
 S.lesBetaald=S.lesBetaald||{};S.vakIntro=S.vakIntro||{};
 try{M3VAKKEN.forEach(v=>{S.lesBetaald[v.id]=1;S.vakIntro[v.id]=1})}catch(e){}
 S.mega=S.mega||[];
 bewaar();
 try{stats()}catch(e){}
 if(S.naam&&S.huis){try{V.home()}catch(e){}}
}
proefKist();
