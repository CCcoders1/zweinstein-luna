'use strict';
/* ====== Spel-achtergronden per vak achter het match-3-bord (ontworpen door de maker) ====== */
(()=>{const FOCUS={herbologie:[22,'img/laadschermen/herbologie'],toverdranken:[24,'img/spel/toverdranken'],gedaante:[46,'img/spel/gedaante'],bezweringen:[22,'img/spel/bezweringen'],verweer:[62,'img/spel/verweer'],astronomie:[32,'img/spel/astronomie']};
 const KL=innerWidth*(devicePixelRatio||1)>900?'':'-klein';const BEELD={};
 const laad=u=>BEELD[u]||(BEELD[u]=(()=>{const i=new Image();i.src=u;return (i.decode?i.decode():Promise.resolve()).catch(()=>{}).then(()=>u)})());
 const info=n=>{const id=window.vakVan?vakVan(n||S.m3lvl||1).id:'herbologie';const f=FOCUS[id]||FOCUS.herbologie;return{id,x:f[0],u:f[1]+KL+'.webp'}};
 function laag(){let d=document.getElementById('spelbg');if(!d){d=document.createElement('div');d.id='spelbg';d.innerHTML='<i></i>';document.body.insertBefore(d,document.body.firstChild)}return d}
 function toon(n){const f=info(n);const d=laag();laad(f.u).then(u=>{const i=d.querySelector('i');if(d.dataset.u!==u){d.dataset.u=u;i.style.backgroundImage=`url("${u}")`;i.style.backgroundPosition=`${f.x}% 30%`}requestAnimationFrame(()=>d.classList.add('aan'))})}
 function weg(){const d=document.getElementById('spelbg');if(d)d.classList.remove('aan')}
 const _sp=m3Speel;m3Speel=function(n,...r){try{toon(n)}catch(e){}return _sp(n,...r)};
 const _ga=ga;ga=function(s,...a){if(s==='match3'){try{laad(info(a[0]).u)}catch(e){}}else weg();return _ga(s,...a)};
 setTimeout(()=>{try{laad(info(S.m3lvl).u)}catch(e){}},3000);
})();
