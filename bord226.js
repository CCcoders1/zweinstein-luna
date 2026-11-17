/* v226: het bord weet welke les je speelt, zodat de viltkleur klopt */
(function(){
  function zet(n,thema){
    try{
      const vak=(typeof m3VakVoor==='function'&&m3VakVoor(n))||{};
      document.body.dataset.m3les=vak.id||thema||'';
      document.body.dataset.m3thema=thema||'';
    }catch(e){}
  }
  function wis(){
    if(!document.body.classList.contains('m3aan')){
      delete document.body.dataset.m3les;
      delete document.body.dataset.m3thema;
    }
  }
  if(typeof m3Speel==='function'&&!m3Speel._bord226){
    const o=m3Speel;
    const n=function(lvl,thema,boost){
      zet(lvl,thema);
      const r=o.apply(this,arguments);
      return r;
    };
    n._bord226=1;n._combo222=o._combo222;n._hint223=o._hint223;n._bijna224=o._bijna224;n._start225=o._start225;
    window.m3Speel=m3Speel=n;
  }
  new MutationObserver(wis).observe(document.body,{attributes:true,attributeFilter:['class']});
})();
