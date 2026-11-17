/* v257: groene hoofdactie en gouden secundaire knop, op basis van het opschrift */
(function(){
  const PRIM=/^(spelen|verder\b|openen|start\b|naar binnen|doorgaan|naar de les|opnieuw\b)/i;
  const SEC=/^(←\s*)?(terug|proef|verwijderen|straks|later|annuleer|annuleren|sluiten|stoppen)\b/i;
  function tekst(btn){return (btn.textContent||'').replace(/\s+/g,' ').trim()}
  function tag(){
    try{
      document.querySelectorAll('button.knop, a.knop, button.linkknop, .linkknop, #m3start, #speelknop, #rin, #terug, #gptest, #gpwis, #gpkies, #m3opn, #m3verder, #m3volg, #wbok').forEach(btn=>{
        if(btn.closest && btn.closest('#nav'))return;
        const t=tekst(btn);
        const id=btn.id||'';
        if(id==='terug'||id==='gptest'||id==='gpwis'||SEC.test(t)){
          btn.classList.add('knop-sec');
          btn.classList.remove('volgende');
          if(btn.classList.contains('linkknop')){
            btn.classList.add('knop');
            btn.classList.remove('linkknop');
          }
        }else if(id==='m3start'||id==='speelknop'||id==='rin'||id==='gpkies'||id==='m3opn'||PRIM.test(t)){
          if(!btn.classList.contains('knop') && (btn.tagName==='BUTTON'||btn.tagName==='A'))btn.classList.add('knop');
          btn.classList.add('volgende');
          btn.classList.remove('knop-sec');
        }
      });
    }catch(e){}
  }
  function koppel(){
    if(typeof ga==='function'&&!ga._knop257){
      const g=ga;
      const w=function(){
        const r=g.apply(this,arguments);
        try{setTimeout(tag,0);setTimeout(tag,120);setTimeout(tag,400)}catch(e){}
        return r;
      };
      w._knop257=1;
      window.ga=w;
    }
  }
  koppel();
  setTimeout(koppel,0);
  setTimeout(koppel,200);
  setTimeout(tag,300);
  new MutationObserver(()=>tag()).observe(document.documentElement,{childList:true,subtree:true});
})();
