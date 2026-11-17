/* v210: huidige levelknop op de Kaart blijft boven de navigatie */
(function(){
  function ruimte(){
    const pad=document.querySelector('.pad');
    if(!pad)return;
    const extra=130;
    const h=parseInt(pad.style.height||'0',10);
    if(h && pad.dataset.padruimte!=='1'){
      pad.style.height=(h+extra)+'px';
      pad.dataset.padruimte='1';
    }else if(!h){
      pad.style.paddingBottom=extra+'px';
    }
  }
  function vrij(){
    try{
      if(document.body.dataset.view!=='pad')return;
      ruimte();
      const n=document.querySelector('.padlvl.nu')||document.querySelector('.pad .padlvl.af:last-of-type');
      if(n) n.scrollIntoView({block:'end',inline:'nearest',behavior:'auto'});
    }catch(e){}
  }
  function koppel(){
    if(typeof V!=='undefined'&&typeof V.pad==='function'&&!V.pad._pad210){
      const _=V.pad;
      const w=function(){
        const r=_.apply(this,arguments);
        try{requestAnimationFrame(vrij);setTimeout(vrij,80);setTimeout(vrij,300)}catch(e){}
        return r;
      };
      w._pad210=1;
      V.pad=w;
    }
    if(typeof ga==='function'&&!ga._pad210){
      const g=ga;
      const w=function(s){
        const r=g.apply(this,arguments);
        if(s==='pad'||(typeof document!=='undefined'&&document.body&&document.body.dataset.view==='pad')){
          try{requestAnimationFrame(vrij);setTimeout(vrij,80);setTimeout(vrij,300)}catch(e){}
        }
        return r;
      };
      w._pad210=1;
      window.ga=w;
    }
  }
  koppel();
  setTimeout(koppel,0);
  setTimeout(koppel,200);
  setTimeout(vrij,400);
})();
