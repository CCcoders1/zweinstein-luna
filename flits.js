'use strict';
/* ====== Flitsvrij: decors vooraf decoderen, achtergrond-crossfade ====== */
(()=>{try{const seen=new Set();Object.values(DECORS).forEach(c=>{if(!c.bg||seen.has(c.bg))return;seen.add(c.bg);const i=new Image();i.decoding='async';i.src=`img/${c.bg}.webp`;i.decode&&i.decode().catch(()=>{})})}catch(e){}
 const _zd=zetDecor;zetDecor=function(k){const d=$('#decor'),oud=d&&d.querySelector('.bg');if(!oud||RMP){return _zd(k)}const voor=oud.style.backgroundImage;
  const cs=getComputedStyle(oud),r=oud.getBoundingClientRect(),dr=d.getBoundingClientRect();const geest=document.createElement('div');geest.className='bgoud';Object.assign(geest.style,{position:'absolute',left:(r.left-dr.left)+'px',top:(r.top-dr.top)+'px',width:r.width+'px',height:r.height+'px',backgroundImage:cs.backgroundImage,backgroundSize:cs.backgroundSize,backgroundPosition:cs.backgroundPosition,backgroundRepeat:cs.backgroundRepeat,filter:cs.filter,opacity:cs.opacity,zIndex:cs.zIndex,pointerEvents:'none'});
  _zd(k);if(oud.style.backgroundImage===voor){return}
  oud.after(geest);geest.animate([{opacity:geest.style.opacity},{opacity:0}],{duration:650,easing:'ease',fill:'forwards'}).onfinish=()=>geest.remove()}})();
/* oude scherminhoud zacht laten uitfaden i.p.v. hard te verwisselen */
(()=>{const _g=ga;ga=function(s,...a){const app=$('#app');const voor=document.body.dataset.view;if(RMP||!app||!app.firstElementChild){return _g(s,...a)}
 const r=app.getBoundingClientRect();const g=app.cloneNode(true);g.removeAttribute('id');g.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));g.querySelectorAll('canvas').forEach(c=>c.remove());g.classList.remove('inkomen','vervaag');g.classList.add('appgeest');
 Object.assign(g.style,{position:'fixed',left:r.left+'px',top:r.top+'px',width:r.width+'px',margin:'0',pointerEvents:'none',zIndex:'1'});
 _g(s,...a);if(document.body.dataset.view===voor){return}document.body.appendChild(g);g.animate([{opacity:1},{opacity:0}],{duration:560,easing:'ease-in-out',fill:'forwards'}).onfinish=()=>g.remove()}})();
