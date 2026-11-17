'use strict';
/* v247: late stadia van valeriaan en kieuwwier, en plantplaatjes altijd laden */
(function(){
  const _ps=typeof plantSVG==='function'?plantSVG:null;
  if(_ps){
    plantSVG=function(st,kl,z){
      if((z==='valeriaan'||z==='kieuwwier')&&st>=3){
        const id=z==='valeriaan'?'p-valeriaan':'p-kieuwkruid';
        return '<img class="plantimg kst'+st+'" src="img/doel/'+id+'.webp" alt="" loading="eager" decoding="sync">';
      }
      return _ps.apply(this,arguments);
    };
  }
  function laadPlanten(){
    try{
      document.querySelectorAll('.mk-pot .plantimg, .mk-vloer .plantimg, .kplant img').forEach(img=>{
        img.loading='eager';
        img.decoding='sync';
        if(!img.complete&&img.src){const s=img.src;img.src=s}
      });
    }catch(e){}
  }
  if(typeof V!=='undefined'&&typeof V.mijnkas==='function'){
    const o=V.mijnkas;
    V.mijnkas=function(){const r=o.apply(this,arguments);try{laadPlanten()}catch(e){}return r};
  }
})();
