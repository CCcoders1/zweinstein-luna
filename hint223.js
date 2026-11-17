/* v223: na stilstand een duidelijke gouden hint met een streep tussen de tegels */
(function(){
  function teken(fx){
    if(!fx)return;
    fx.querySelectorAll('.m3hintpad,.m3hintpijl').forEach(x=>x.remove());
    const g=[...fx.querySelectorAll('.m3hintgloed')];
    if(g.length<2)return;
    const a=g[0].getBoundingClientRect(),b=g[1].getBoundingClientRect(),fr=fx.getBoundingClientRect();
    const x1=a.left+a.width/2-fr.left,y1=a.top+a.height/2-fr.top;
    const x2=b.left+b.width/2-fr.left,y2=b.top+b.height/2-fr.top;
    const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),hoek=Math.atan2(dy,dx)*180/Math.PI;
    const pad=document.createElement('i');
    pad.className='m3hintpad';
    pad.style.cssText=`left:${x1}px;top:${y1-4}px;width:${len}px;transform:rotate(${hoek}deg)`;
    fx.appendChild(pad);
    const pijl=document.createElement('i');
    pijl.className='m3hintpijl';
    pijl.style.cssText=`left:${(x1+x2)/2}px;top:${(y1+y2)/2}px`;
    fx.appendChild(pijl);
  }
  function koppel(fx){
    if(!fx||fx._hint223)return;
    fx._hint223=1;
    const mo=new MutationObserver(()=>requestAnimationFrame(()=>teken(fx)));
    mo.observe(fx,{childList:true});
  }
  function zoek(){const f=document.getElementById('m3fx');if(f)koppel(f)}
  if(typeof m3Speel==='function'&&!m3Speel._hint223){
    const o=m3Speel;
    const n=function(){const r=o.apply(this,arguments);try{setTimeout(zoek,0)}catch(e){}return r};
    n._hint223=1;n._combo222=o._combo222;window.m3Speel=m3Speel=n;
  }
  new MutationObserver(zoek).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(zoek,400);
})();
