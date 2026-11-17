'use strict';
/* v241: toverstaf-spoor en match-vonken in de kleur van de les */
(()=>{
  const PAL={
    herbologie:['#7adf4a','#eaffc4'],
    bezweringen:['#7ec8ff','#f3e8ff'],
    toverdranken:['#c89aff','#ffe7b8'],
    gedaante:['#5ee0d0','#e4fff9'],
    astronomie:['#ffe08a','#fff8dc'],
    verweer:['#ff6a6a','#ffd27a']
  };
  function lesId(){
    return document.body.dataset.m3les
      || (window.vakVan && vakVan((window.S && S.m3lvl) || 1).id)
      || 'herbologie';
  }
  function hexRgb(h){
    h=(h||'#ffe28a').replace('#','');
    if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    const n=parseInt(h,16);
    return [n>>16,(n>>8)&255,n&255];
  }
  function fxLes(){
    const p=PAL[lesId()]||PAL.herbologie;
    return {a:p[0],b:p[1]};
  }
  function fxRgba(al,licht){
    const {a,b}=fxLes();
    const [r,g,bl]=hexRgb(licht?b:a);
    return 'rgba('+r+','+g+','+bl+','+al+')';
  }
  window.fxLes=fxLes;
  window.fxRgba=fxRgba;
  window.LES_FX_PAL=PAL;
})();
