/* v262: jonge planten en zaadjes staan in de voorste zichtbare aarde.
   Rijpe planten en mandragora houden de v261-plaats (70%/80%). */
(function(){
  const JONG=1.45;
  const ZAAD=1.15;
  function stageVan(wrap){
    const img=wrap.querySelector('.plantimg,.superimg');
    const m=(img&&img.className||'').match(/kst(\d)|(?:^|\s)st(\d)/);
    return m?+(m[1]||m[2]):4;
  }
  function zetJong(wrap){
    const api=window.ZW_KAS261;
    if(!api||!api.OPENING) return;
    const pot=wrap.closest('[data-pot]');
    if(!pot) return;
    const z=pot.dataset.z||'';
    const st=stageVan(wrap);
    const op=api.OPENING[pot.dataset.pot];
    if(!op) return;
    const zaad=!!(api.ZADEN&&api.ZADEN[z]&&st===0);
    let t=null;
    if(zaad) t=ZAAD;
    else if(z==='tentacula'||z==='duivelsstrik') t=JONG;
    else if(st<=2 && z!=='mandragora') t=JONG;
    if(t==null) return;
    const y=op.back+t*(op.front-op.back);
    const aarde=(100-y*100).toFixed(1)+'%';
    pot.style.setProperty('--aarde',aarde);
    wrap.style.setProperty('--aarde',aarde);
  }
  function plaats262(){
    try{document.querySelectorAll('.potwrap,.gpwrap').forEach(zetJong)}catch(e){}
  }
  function hook(){
    const api=window.ZW_KAS261;
    if(!api) return;
    if(!api.plaatsAlle._kas262){
      const orig=api.plaatsAlle.bind(api);
      api.plaatsAlle=function(){
        return Promise.resolve(orig()).then(()=>{plaats262();});
      };
      api.plaatsAlle._kas262=1;
    }
    if(document.body&&document.body.dataset.view==='mijnkas'){
      Promise.resolve(api.plaatsAlle()).then(plaats262);
    }
  }
  hook();
  document.addEventListener('DOMContentLoaded',hook);
  window.ZW_KAS262={JONG,ZAAD,plaats:plaats262};
})();
