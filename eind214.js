/* v214: confetti en sierlijke sterren op het resultaatscherm */
(function(){
  function confetti(){
    try{
      document.querySelectorAll('.zwconf').forEach(e=>e.remove());
      if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
      const box=document.createElement('div');
      box.className='zwconf';
      box.setAttribute('aria-hidden','true');
      const kleuren=['#ffd84a','#ff6b6b','#7fdbff','#b6ff9e','#e0a6ff','#fff8e0','#c9a227','#ff9f43'];
      for(let i=0;i<56;i++){
        const s=document.createElement('i');
        const dx=(Math.random()-.5)*80;
        s.style.setProperty('--x',(6+Math.random()*88)+'vw');
        s.style.setProperty('--k',kleuren[i%kleuren.length]);
        s.style.setProperty('--d',(Math.random()*.55)+'s');
        s.style.setProperty('--t',(1.5+Math.random()*1.3)+'s');
        s.style.setProperty('--dx',dx+'px');
        s.style.setProperty('--r',((Math.random()*.8-.4)*180)+'deg');
        box.appendChild(s);
      }
      document.body.appendChild(box);
      setTimeout(()=>{try{box.remove()}catch(e){}},3200);
    }catch(e){}
  }
  window.confetti=confetti;

  function mooiSterren(){
    const el=document.querySelector('.m3eind .hp-sterren');
    if(!el||el.dataset.eind214)return;
    const t=el.textContent||'';
    const vol=(t.match(/★/g)||[]).length;
    if(!vol&&!t.includes('☆'))return;
    el.dataset.eind214='1';
    el.innerHTML=[0,1,2].map(i=>'<span class="eindster '+(i<vol?'aan':'uit')+'" aria-hidden="true">★</span>').join('');
    el.setAttribute('aria-label',vol+' van 3 sterren');
  }

  function hook(fn){
    if(!fn||fn._eind214)return fn;
    const w=function(){
      const r=fn.apply(this,arguments);
      try{confetti();mooiSterren();setTimeout(mooiSterren,50);setTimeout(mooiSterren,200)}catch(e){}
      return r;
    };
    w._eind214=1;
    return w;
  }
  if(typeof m3Winst==='function')window.m3Winst=m3Winst=hook(m3Winst);
})();
