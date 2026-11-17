'use strict';
/* v243: doelstand telt zichtbaar af op de mini-medaille */
(()=>{
  const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function tel(el,van,naar,ms){
    if(RM||van<=naar||van-naar>30){el.textContent=naar<=0?'':naar;return}
    if(el._tel)cancelAnimationFrame(el._tel);
    const t0=performance.now();
    const stap=nu=>{
      const p=Math.min(1,(nu-t0)/ms);
      const v=Math.round(van+(naar-van)*(1-Math.pow(1-p,3)));
      el.textContent=v<=0?'':v;
      if(p<1)el._tel=requestAnimationFrame(stap);
      else{el.textContent=naar<=0?'':naar;el._tel=0}
    };
    el._tel=requestAnimationFrame(stap);
  }
  function wrap(){
    if(typeof M3==='undefined'||typeof M3.doelUI!=='function'||M3.doelUI._tel243)return false;
    const oud=M3.doelUI;
    M3.doelUI=function(){
      const box=document.getElementById('m3d');
      const voor=box?[...box.children].map(k=>{
        const b=k.querySelector('b');
        const t=b&&b.textContent;
        return t===''?0:parseInt(t,10);
      }):[];
      const r=oud.apply(this,arguments);
      if(!box)return r;
      [...box.children].forEach((k,i)=>{
        const b=k.querySelector('b');if(!b)return;
        const t=b.textContent;
        const naar=t===''?0:parseInt(t,10);
        const van=voor[i];
        if(van==null||!(van>naar))return;
        b.textContent=String(van);
        tel(b,van,naar,320);
      });
      return r;
    };
    M3.doelUI._tel243=1;
    return true;
  }
  function haakSpeel(fn){
    return function(){
      const r=fn.apply(this,arguments);
      const doe=()=>wrap();
      if(r&&typeof r.then==='function')r.then(doe,doe);else doe();
      [80,200,450].forEach(t=>setTimeout(doe,t));
      return r;
    };
  }
  const _sp=typeof m3Speel==='function'?m3Speel:window.m3Speel;
  if(typeof _sp==='function'){
    const hooked=haakSpeel(_sp);
    try{m3Speel=hooked}catch(e){}
    window.m3Speel=hooked;
  }
  let n=0;
  const iv=setInterval(()=>{
    if(wrap()||++n>40)clearInterval(iv);
  },250);
})();
