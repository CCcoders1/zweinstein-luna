/* v227: lantaarns en planten langs het pad */
(function(){
  function versier(){
    const pad=document.querySelector('.pad');
    if(!pad||pad.querySelector('.pad-sier'))return;
    const knoppen=[...pad.querySelectorAll('.padlvl')];
    knoppen.forEach((b,i)=>{
      if(i%3!==1)return;
      if(b.classList.contains('nu'))return;
      const left=parseFloat(b.style.left)||50;
      const top=parseFloat(b.style.top)||0;
      const kant=left>=50?-1:1;
      const el=document.createElement('i');
      el.className='pad-sier '+(i%6===1?'pad-lantaarn':'pad-plant');
      el.style.left=(left+kant*18)+'%';
      el.style.top=top+'px';
      el.setAttribute('aria-hidden','true');
      pad.appendChild(el);
    });
  }
  if(typeof V!=='undefined'&&typeof V.pad==='function'&&!V.pad._pad227){
    const o=V.pad;
    V.pad=function(){
      const r=o.apply(this,arguments);
      try{setTimeout(versier,0);setTimeout(versier,80)}catch(e){}
      return r;
    };
    V.pad._pad227=1;
  }
  new MutationObserver(()=>{if(document.querySelector('.pad')&&!document.querySelector('.pad-sier'))versier()}).observe(document.documentElement,{childList:true,subtree:true});
})();
