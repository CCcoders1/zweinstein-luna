/* v252: in de korte level-intro verschijnen de doelen één voor één */
(()=>{
  const RM=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}})();

  function naam(d,T,L){
    const k=d[0];
    if(k==='score')return 'Punten';
    if(k==='kaars')return 'Kaarsen';
    if(k==='ijs')return 'Rijp';
    if(k==='pak')return 'Uilenpost';
    if(k==='sleutel')return 'Vliegende sleutels';
    if(k==='recept')return 'Recept';
    if((k==='i'||k==='d'||(k==='p'&&L&&L.dropInh))&&typeof doelNaam==='function')return doelNaam(k)||'';
    if(k==='o')return (T&&T.onkruid)||'Onkruid';
    if(k==='k')return (T&&T.kist)||'Kisten';
    if(k==='p'){
      if(T&&T.potMv)return T.potMv;
      const pot=(T&&T.pot)||'Pot';
      return /pot$/i.test(pot)?pot+'ten':pot+'en';
    }
    if(T&&T.t&&T.t[k]&&T.t[k][0])return T.t[k][0];
    return '';
  }
  function aantal(d){
    if(d[1]==null||d[1]==='')return '';
    const n=+d[1];
    if(d[0]==='score'&&isFinite(n))return n.toLocaleString('nl-NL');
    return isFinite(n)?String(n):String(d[1]);
  }
  function htmlDoelen(n,th){
    try{
      if(typeof m3Level!=='function')return '';
      const L=m3Level(n);
      const thema=th||((typeof m3VakVoor==='function'&&m3VakVoor(n)||{}).thema)||'herbologie';
      const T=(typeof M3THEMA==='object'&&M3THEMA[thema])||{};
      const lijst=L&&L.doelen||[];
      if(!lijst.length)return '';
      return '<div class="lvi-doelen">'+lijst.map(d=>{
        const ico=typeof m3DoelIco==='function'?m3DoelIco(d,T,L):'';
        const a=aantal(d);
        const nm=naam(d,T,L);
        return `<span class="lvi-doel">${ico}${a!==''?`<b>${a}</b>`:''}${nm?`<small>${nm}</small>`:''}</span>`;
      }).join('')+'</div>';
    }catch(e){return ''}
  }
  function nVan(t){
    const h=t.querySelector('h2');
    const m=(h&&h.textContent||'').match(/(\d+)/);
    return m?+m[1]:0;
  }
  function themaVan(t,n){
    const sm=t.querySelector('small');
    const label=(sm&&sm.textContent||'').trim();
    if(label&&typeof M3THEMA==='object'){
      const hit=Object.keys(M3THEMA).find(k=>(M3THEMA[k]||{}).n===label);
      if(hit)return hit;
    }
    try{return (m3VakVoor(n)||{}).thema}catch(e){return 'herbologie'}
  }
  function vul(t){
    if(!t||t.querySelector('.lvi-doelen'))return;
    const box=t.querySelector('.lvi-in');if(!box)return;
    const n=nVan(t);if(!n)return;
    const html=htmlDoelen(n,themaVan(t,n));
    if(!html)return;
    const zin=box.querySelector('.lvi-zin');
    const vonk=box.querySelector('.lvi-v');
    if(zin)zin.insertAdjacentHTML('beforebegin',html);
    else if(vonk)vonk.insertAdjacentHTML('beforebegin',html);
    else box.insertAdjacentHTML('beforeend',html);
    box.querySelectorAll('img').forEach(im=>{im.loading='eager';im.decoding='sync'});
    if(!box.querySelector('.lvi-tik')){
      const p=document.createElement('p');
      p.className='lvi-tik';
      p.textContent='Tik om te beginnen';
      box.appendChild(p);
    }
  }
  function vroegZicht(t){
    if(!t||t.classList.contains('zicht')||t.classList.contains('uit'))return;
    setTimeout(()=>t.classList.add('zicht'),RM?80:450);
  }
  function zie(el){
    if(!el||el.id!=='lvintro')return;
    vul(el);vroegZicht(el);
  }
  const mo=new MutationObserver(muts=>{
    muts.forEach(m=>{
      m.addedNodes&&m.addedNodes.forEach(n=>{
        if(n.nodeType!==1)return;
        if(n.id==='lvintro')zie(n);
        else{
          const t=n.querySelector&&n.querySelector('#lvintro');
          if(t)zie(t);
        }
      });
    });
  });
  const start=()=>{try{mo.observe(document.body,{childList:true,subtree:true});const t=document.getElementById('lvintro');if(t)zie(t)}catch(e){}};
  if(document.body)start();else document.addEventListener('DOMContentLoaded',start);
})();
