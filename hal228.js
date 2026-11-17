/* v228: twee kaarsjes in de groetkaart van de Hal */
(function(){
  function zet(){
    const g=document.querySelector('.groet.halbanner');
    if(!g||g.querySelector('.hal-kaars'))return;
    ['links','rechts'].forEach(k=>{
      const el=document.createElement('i');
      el.className='hal-kaars '+k;
      el.setAttribute('aria-hidden','true');
      g.appendChild(el);
    });
  }
  if(typeof V!=='undefined'&&typeof V.home==='function'&&!V.home._hal228){
    const o=V.home;
    V.home=function(){
      const r=o.apply(this,arguments);
      try{setTimeout(zet,0);setTimeout(zet,80)}catch(e){}
      return r;
    };
    V.home._hal228=1;
  }
  new MutationObserver(()=>{if(document.body.dataset.view==='home')zet()}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-view']});
  setTimeout(zet,400);
})();
