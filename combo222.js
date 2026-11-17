/* v222: elk type speciale combinatie krijgt een eigen flits op het bord */
(function(){
  const SOORT={
    'Kruisraket!':'kruis',
    'Dubbele ketel!':'ketel',
    'Ketel + streep!':'ketelstreep',
    'Gouden Snaai!':'snaai',
    'Dubbele Snaai!':'dsnaai',
    'Grote ster!':'ster',
    'Combinatie!':'combi'
  };
  const GENERIEK=/^(Fenomenaal!|Betoverend!|Toverpoeder!|Magisch!|Punten gehaald!|Alle kaarsen!|×\d)/;
  let laatsteTxt='', laatsteSoort='', laatsteT=0;
  function vonken(host,n){
    for(let i=0;i<n;i++){
      const v=document.createElement('i');
      v.className='m3combi-vonk';
      v.style.left=(18+Math.random()*64)+'%';
      v.style.top=(18+Math.random()*64)+'%';
      const a=Math.random()*Math.PI*2,d=40+Math.random()*70;
      v.style.setProperty('--dx',Math.cos(a)*d+'px');
      v.style.setProperty('--dy',Math.sin(a)*d+'px');
      host.appendChild(v);
    }
  }
  function flits(fx,txt){
    const soort=SOORT[txt];
    if(!soort||!fx)return;
    fx.querySelectorAll('.m3combi-fx').forEach(x=>x.remove());
    const el=document.createElement('div');
    el.className='m3combi-fx m3combi-'+soort;
    el.setAttribute('aria-hidden','true');
    vonken(el,soort==='dsnaai'||soort==='snaai'?14:8);
    fx.appendChild(el);
    setTimeout(()=>{try{el.remove()}catch(e){}},900);
  }
  function koppel(fx){
    if(!fx||fx._combo222)return;
    fx._combo222=1;
    new MutationObserver(muts=>{
      muts.forEach(m=>m.addedNodes.forEach(n=>{
        if(!n||!n.classList||!n.classList.contains('m3combo'))return;
        let txt=(n.textContent||'').trim();
        if(GENERIEK.test(txt)&&laatsteSoort&&Date.now()-laatsteT<1200){
          n.textContent=laatsteTxt;
          n.dataset.soort=laatsteSoort;
          return;
        }
        const soort=SOORT[txt];
        if(soort){
          n.dataset.soort=soort;
          laatsteTxt=txt;laatsteSoort=soort;laatsteT=Date.now();
          flits(fx,txt);
        }
      }));
    }).observe(fx,{childList:true});
  }
  function zoek(){const f=document.getElementById('m3fx');if(f)koppel(f)}
  if(typeof m3Speel==='function'&&!m3Speel._combo222){
    const o=m3Speel;
    const n=function(){const r=o.apply(this,arguments);try{setTimeout(zoek,0)}catch(e){}return r};
    n._combo222=1;window.m3Speel=m3Speel=n;
  }
  new MutationObserver(zoek).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(zoek,400);
})();
