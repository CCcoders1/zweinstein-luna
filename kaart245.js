'use strict';
/* v245: tik-feedback en een klein popover bij een level-medaille op de Kaart */
(()=>{
  function weg(){
    document.querySelectorAll('.pad-pop').forEach(x=>x.remove());
    document.removeEventListener('pointerdown',buiten,true);
  }
  function buiten(e){
    if(e.target.closest('.pad-pop')||e.target.closest('.padlvl'))return;
    weg();
  }
  function zin(L,hier){
    try{
      if(typeof padPlaag==='function'&&padPlaag(L)){
        const p=padPlaag(L);
        if(p&&p.soort==='damp')return 'Een plaaglevel. Eerst level '+hier+' afmaken.';
        return 'Een plaaglevel met Incendio. Eerst level '+hier+' afmaken.';
      }
      if(typeof padCadeau==='function'&&padCadeau(L))return 'Hier krijg je: '+padCadeau(L)+'. Eerst level '+hier+' afmaken.';
      if(typeof padZwaar==='function'&&padZwaar(L))return (padZwaar(L)>1?'Dit level is heel zwaar. ':'Dit level is zwaar. ')+'Eerst level '+hier+' afmaken.';
    }catch(e){}
    return 'Eerst level '+hier+' afmaken.';
  }
  function toon(btn){
    weg();
    const L=+btn.dataset.l;
    const hier=(window.S&&S.m3lvl)|1;
    const ster=(window.S&&S.lvSter&&S.lvSter[L])|0;
    const open=L<=hier;
    const vak=(typeof vakVan==='function'&&vakVan(L))||{};
    const el=document.createElement('div');
    el.className='pad-pop';
    el.innerHTML=
      '<b>Level '+L+'</b>'+
      '<span class="pad-pop-sterren">'+'<span>★</span>'.repeat(ster)+'<i>★</i>'.repeat(Math.max(0,3-ster))+'</span>'+
      (vak.n?'<small>'+vak.n+'</small>':'')+
      (open
        ?'<button type="button" class="knop volgende pad-pop-speel">Spelen</button>'
        :'<p>'+zin(L,hier)+'</p>');
    document.body.appendChild(el);
    const r=btn.getBoundingClientRect();
    const w=el.offsetWidth,h=el.offsetHeight;
    let left=r.left+r.width/2-w/2;
    left=Math.max(10,Math.min(innerWidth-w-10,left));
    const boven=r.top-h-12;
    const top=boven>=70?boven:r.bottom+12;
    el.style.left=Math.round(left)+'px';
    el.style.top=Math.round(top)+'px';
    if(open){
      const sp=el.querySelector('.pad-pop-speel');
      if(sp)sp.onclick=()=>{weg();ga('match3',L)};
    }
    document.addEventListener('pointerdown',buiten,true);
  }
  function haak(){
    document.querySelectorAll('.padlvl').forEach(b=>{
      if(b._pop245)return;
      b._pop245=1;
      const oud=b.onclick;
      b.onclick=e=>{
        e.preventDefault();
        b.classList.remove('pad-tik');
        void b.offsetWidth;
        b.classList.add('pad-tik');
        setTimeout(()=>b.classList.remove('pad-tik'),320);
        toon(b);
      };
    });
  }
  const _pad=V.pad;
  if(_pad)V.pad=function(){
    const r=_pad.apply(this,arguments);
    const doe=()=>haak();
    if(r&&typeof r.then==='function')r.then(doe,doe);else doe();
    [80,200,450].forEach(t=>setTimeout(doe,t));
    return r;
  };
})();
