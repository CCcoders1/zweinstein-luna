/* v256: startboog, naambordje en bloemen bij het begin van een les */
(function(){
  function bezet(pad,left,top,min){
    return [...pad.querySelectorAll('.pad-sier')].some(el=>{
      const l=parseFloat(el.style.left)||0, t=parseFloat(el.style.top)||0;
      return Math.abs(t-top)<(min||22) && Math.abs(l-left)<12;
    });
  }
  function zet(pad,cls,left,top,tekst,force){
    if(left<4||left>96)return;
    if(!force && bezet(pad,left,top, cls.indexOf('bloem')>=0||cls.indexOf('struik')>=0?18:28))return;
    const el=document.createElement(tekst?'b':'i');
    el.className='pad-sier pad-sier256 '+cls;
    el.style.left=left+'%';
    el.style.top=top+'px';
    el.setAttribute('aria-hidden','true');
    if(tekst)el.textContent=tekst;
    pad.appendChild(el);
  }
  function hoeken(){
    const kop=document.querySelector('.padkopbeeld');
    if(!kop||kop.querySelector('.pk-hoek'))return;
    ['tl','tr','bl','br'].forEach(k=>{
      const i=document.createElement('i');
      i.className='pk-hoek '+k;
      i.setAttribute('aria-hidden','true');
      kop.appendChild(i);
    });
  }
  function start(){
    hoeken();
    const pad=document.querySelector('.pad');
    if(!pad||pad.querySelector('.pad-sier256'))return;
    const knoppen=[...pad.querySelectorAll('.padlvl')];
    if(!knoppen.length)return;
    const first=knoppen.reduce((a,b)=>(parseFloat(b.style.top)||0)>(parseFloat(a.style.top)||0)?b:a);
    const fx=parseFloat(first.style.left)||50;
    const fy=parseFloat(first.style.top)||0;
    zet(pad,'pad-start-mos',fx,fy+10,null,1);
    zet(pad,'pad-start-boog',fx,fy-44,null,1);
    zet(pad,'pad-start-bord',fx,fy+48,'Begin van de les',1);
    zet(pad,'pad-lantaarn',fx-20,fy-14);
    zet(pad,'pad-lantaarn',fx+20,fy-14);
    zet(pad,'pad-bloem',fx-22,fy+22,null,1);
    zet(pad,'pad-bloem',fx+24,fy+20,null,1);
    zet(pad,'pad-bloem',fx-32,fy+6,null,1);
    zet(pad,'pad-bloem',fx+34,fy+4,null,1);
    zet(pad,'pad-struik',fx-30,fy+32);
    zet(pad,'pad-struik',fx+32,fy+30);
  }
  function koppel(){
    if(typeof V!=='undefined'&&typeof V.pad==='function'&&!V.pad._pad256){
      const o=V.pad;
      V.pad=function(){
        const r=o.apply(this,arguments);
        try{setTimeout(start,0);setTimeout(start,140)}catch(e){}
        return r;
      };
      V.pad._pad256=1;
    }
  }
  koppel();
  setTimeout(koppel,0);
  setTimeout(koppel,200);
  new MutationObserver(()=>{if(document.querySelector('.pad')&&!document.querySelector('.pad-sier256'))start()}).observe(document.documentElement,{childList:true,subtree:true});
})();
