/* v254: de eerste dertig levels rustiger en duidelijker voor mama */
(()=>{
  const ZACHT={
    11:{z:3},
    12:{z:2},
    15:{z:6,pot:1},
    23:{z:4,pot:0,kist:0},
    25:{z:5,pot:1},
    27:{z:6,f:.75},
    30:{z:8}
  };
  const UITLEG={
    4:'Veeg het onkruid weg door een tegel ernaast te wisselen.',
    8:'Breek een kist open met een wissel ernaast of een speciale tegel.',
    11:'Laat de potten naar beneden glijden, tot ze van het bord af vallen.',
    15:'Eerst de kisten, dan kunnen de potten naar beneden.',
    23:'Alleen het bliksemveld telt. Haal de punten voordat je zetten op zijn.'
  };
  window.m3LesTip=n=>UITLEG[n|0]||((typeof m3Level==='function'&&m3Level(n)||{}).lesTip)||'';

  const _lv=typeof m3Level==='function'?m3Level:null;
  if(_lv)m3Level=function(n){
    const L=_lv.apply(this,arguments);
    try{
      const M=ZACHT[n|0];
      if(L&&M){
        if(M.z)L.zetten=(L.zetten|0)+M.z;
        if(M.kist===0){
          L.kist=0;
          L.doelen=(L.doelen||[]).filter(d=>d[0]!=='k'&&d[0]!=='i'&&d[0]!=='d');
        }
        if(M.pot!=null){
          if(M.pot<=0){L.pot=0;L.doelen=(L.doelen||[]).filter(d=>d[0]!=='p')}
          else{L.pot=M.pot;L.doelen=(L.doelen||[]).map(d=>d[0]==='p'?['p',M.pot]:d)}
        }
        if(M.f)L.doelen=(L.doelen||[]).map(d=>typeof d[0]==='number'?[d[0],Math.max(8,Math.round(d[1]*M.f))]:d);
      }
      if(L&&UITLEG[n|0])L.lesTip=UITLEG[n|0];
    }catch(e){}
    return L;
  };

  function zetTip(n){
    n=n|0;
    const tip=UITLEG[n]||'';
    const voor=document.querySelector('.m3voor');
    if(!voor||!tip||voor.querySelector('.m3lestip'))return;
    const p=document.createElement('p');
    p.className='m3lestip';
    p.textContent=tip;
    const plaats=voor.querySelector('.m3doelen-voor')||voor.querySelector('.zwaarhint')||voor.querySelector('.m3vak');
    if(plaats)plaats.after(p);
    else{
      const voet=voor.querySelector('.m3voor-vast');
      if(voet)voet.before(p);else voor.appendChild(p);
    }
  }
  const _m=typeof V!=='undefined'?V.match3:null;
  if(_m)V.match3=async function(n,...a){
    const r=await _m.apply(this,arguments);
    try{zetTip(n||((typeof S!=='undefined'&&S.m3lvl)|0)||1)}catch(e){}
    return r;
  };
})();
