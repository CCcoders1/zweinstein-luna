/* v225: korte titel bij de start van een level */
(function(){
  function toon(){
    const fx=document.getElementById('m3fx');
    if(!fx||fx.querySelector('.m3startbanier'))return;
    let lvl='',vak='';
    try{
      if(typeof M3!=='undefined'&&M3.b){
        lvl=M3.b.L&&M3.b.L.n?M3.b.L.n:'';
        vak=(M3.b.T&&M3.b.T.n)||'';
      }
    }catch(e){}
    const titel=document.querySelector('.m3titel');
    if(!lvl&&titel)lvl=(titel.textContent||'').replace(/Level\s*/i,'').trim();
    const el=document.createElement('div');
    el.className='m3startbanier';
    el.setAttribute('aria-hidden','true');
    el.innerHTML='<div><b>Level '+(lvl||'')+'</b><i></i><span>'+(vak||'')+'</span></div>';
    fx.appendChild(el);
    setTimeout(()=>{try{el.remove()}catch(e){}},1100);
  }
  if(typeof m3Speel==='function'&&!m3Speel._start225){
    const o=m3Speel;
    const n=function(){
      const r=o.apply(this,arguments);
      try{setTimeout(toon,40)}catch(e){}
      return r;
    };
    n._start225=1;n._combo222=o._combo222;n._hint223=o._hint223;n._bijna224=o._bijna224;
    window.m3Speel=m3Speel=n;
  }
})();
