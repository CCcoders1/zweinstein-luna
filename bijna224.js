/* v224: markeer de allerlaatste zet duidelijk */
(function(){
  function sync(){
    if(!document.body.classList.contains('m3aan'))return;
    const z=document.getElementById('m3z');
    const n=z?parseInt(z.textContent,10):0;
    const bijna=document.body.classList.contains('m3bijna')||(n>0&&n<=5);
    document.body.classList.toggle('m3laatste',bijna&&n===1);
    if(n>0)document.body.dataset.zetten=String(n);
    const bn=document.getElementById('m3bijna');
    if(bn&&n===1&&!/laatste/i.test(bn.textContent||''))bn.textContent='Laatste zet';
  }
  const mo=new MutationObserver(sync);
  function start(){
    const z=document.getElementById('m3z');
    if(z&&!z._bijna224){z._bijna224=1;mo.observe(z,{childList:true,characterData:true,subtree:true});mo.observe(document.body,{attributes:true,attributeFilter:['class']})}
    sync();
  }
  if(typeof m3Speel==='function'&&!m3Speel._bijna224){
    const o=m3Speel;
    const n=function(){const r=o.apply(this,arguments);try{setTimeout(start,0);setTimeout(start,80)}catch(e){}return r};
    n._bijna224=1;n._combo222=o._combo222;n._hint223=o._hint223;window.m3Speel=m3Speel=n;
  }
  new MutationObserver(start).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(start,400);
})();
