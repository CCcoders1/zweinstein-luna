/* v232: meer versiering verderop het pad, ook rond het begin en het einde */
(function(){
  function bezet(pad,left,top){
    return [...pad.querySelectorAll('.pad-sier')].some(el=>{
      const l=parseFloat(el.style.left)||0, t=parseFloat(el.style.top)||0;
      return Math.abs(t-top)<26 && Math.abs(l-left)<10;
    });
  }
  function zet(pad,cls,left,top){
    if(left<6||left>94)return;
    if(bezet(pad,left,top))return;
    const el=document.createElement('i');
    el.className='pad-sier pad-sier232 '+cls;
    el.style.left=left+'%';
    el.style.top=top+'px';
    el.setAttribute('aria-hidden','true');
    pad.appendChild(el);
  }
  function buitenkant(left){return left>=50?-1:1}
  function versier(){
    const pad=document.querySelector('.pad');
    if(!pad||pad.querySelector('.pad-sier232'))return;
    const knoppen=[...pad.querySelectorAll('.padlvl')];
    if(knoppen.length<2)return;
    knoppen.forEach((b,i)=>{
      const left=parseFloat(b.style.left)||50;
      const top=parseFloat(b.style.top)||0;
      const kant=buitenkant(left);
      const isEinde=i<2||i>=knoppen.length-2;
      if(!isEinde && i%2!==0)return;
      if(b.classList.contains('nu')&&!isEinde)return;
      /* naast de medaille, nooit eroverheen */
      const dx=isEinde?20:18;
      const soort=isEinde?(i%2?'pad-lantaarn':'pad-struik'):(i%4===0?'pad-lantaarn':'pad-plant');
      zet(pad,soort,left+kant*dx,top+(isEinde?6:0));
    });
    /* poort van twee lantaarns boven de laatste medaille (einde van de les) */
    const last=knoppen[knoppen.length-1];
    const lx=parseFloat(last.style.left)||50, ly=parseFloat(last.style.top)||0;
    /* naast de laatste medaille, iets omhoog, binnen het bord (overflow:hidden) */
    zet(pad,'pad-lantaarn',lx-19,ly-8);
    zet(pad,'pad-lantaarn',lx+19,ly-8);
    zet(pad,'pad-poort',lx,ly-22);
    /* struikgewas onderaan, bij de eerste medaille van deze les */
    const first=knoppen[0];
    const fx=parseFloat(first.style.left)||50, fy=parseFloat(first.style.top)||0;
    const fk=buitenkant(fx);
    zet(pad,'pad-struik',fx+fk*22,fy+10);
    zet(pad,'pad-lantaarn',fx+fk*22,fy-16);
    zet(pad,'pad-plant',fx-fk*16,fy+18);
  }
  if(typeof V!=='undefined'&&typeof V.pad==='function'&&!V.pad._pad232){
    const o=V.pad;
    V.pad=function(){
      const r=o.apply(this,arguments);
      try{setTimeout(versier,0);setTimeout(versier,120)}catch(e){}
      return r;
    };
    V.pad._pad232=1;
  }
  new MutationObserver(()=>{if(document.querySelector('.pad')&&!document.querySelector('.pad-sier232'))versier()}).observe(document.documentElement,{childList:true,subtree:true});
})();
