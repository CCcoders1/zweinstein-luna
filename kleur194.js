'use strict';
/* v194: klas-kleurwereld op body/html, zodat de UI per les van palet wisselt */
(()=>{
  const VAKKEN=['herbologie','bezweringen','toverdranken','gedaante','astronomie','verweer'];
  function vakVanLevel(n){
    try{
      const v=typeof m3VakVoor==='function'?m3VakVoor(n||((typeof S!=='undefined'&&S.m3lvl)|0)||1):null;
      const id=(v&&(v.thema||v.id))||'herbologie';
      return VAKKEN.includes(id)?id:'herbologie';
    }catch(e){return 'herbologie'}
  }
  function vakNu(n){
    if(n)return vakVanLevel(n);
    const view=document.body.dataset.view||'';
    if(view==='match3'){
      const t=(document.querySelector('.m3voor h2,.m3titel')||{}).textContent||'';
      const m=/Level\s+(\d+)/i.exec(t);
      if(m)return vakVanLevel(+m[1]);
    }
    return vakVanLevel();
  }
  function zetVak(id){
    const k=VAKKEN.includes(id)?id:vakNu();
    const el=document.body, root=document.documentElement;
    el.classList.add('kleur194');root.classList.add('kleur194');
    if(el.dataset.vak===k&&root.dataset.vak===k)return;
    el.dataset.vak=k;root.dataset.vak=k;
    VAKKEN.forEach(v=>el.classList.toggle('vak-'+v,v===k));
  }
  window.zetKleurVak=zetVak;
  window.kleurVakNu=vakNu;
  zetVak();
  const _ga=typeof ga==='function'?ga:null;
  if(_ga){
    window.ga=function(s,...a){
      const r=_ga.apply(this,arguments);
      try{
        const n=(s==='match3'&&a[0])?a[0]:null;
        zetVak(vakNu(n));
      }catch(e){}
      return r;
    };
  }
  const hook=(obj,naam)=>{
    if(!obj||typeof obj[naam]!=='function')return;
    const oud=obj[naam];
    obj[naam]=function(...a){
      const r=oud.apply(this,arguments);
      const n=(naam==='match3'||naam==='m3Speel')?a[0]:null;
      const doe=()=>{try{zetVak(vakNu(n))}catch(e){}};
      if(r&&typeof r.then==='function')r.then(doe,doe);else doe();
      setTimeout(doe,80);setTimeout(doe,300);
      return r;
    };
  };
  hook(window,'m3Speel');
  if(typeof V!=='undefined'){
    ['match3','home','pad','meer','mijnkas','kas'].forEach(n=>hook(V,n));
  }
  try{
    new MutationObserver(()=>{try{zetVak(vakNu())}catch(e){}})
      .observe(document.body,{attributes:true,attributeFilter:['data-view']});
  }catch(e){}
  document.addEventListener('DOMContentLoaded',()=>zetVak());
  [0,200,800].forEach(t=>setTimeout(()=>zetVak(),t));
})();
