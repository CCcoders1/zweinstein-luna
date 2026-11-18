/* v261: stengelvoet gemeten per sprite, geplaatst op 70% naar voren in de aarde-ellips */
(function(){
  const OPENING={
    pot0:{back:0.083,front:0.193},
    pot1:{back:0.036,front:0.129},
    pot2:{back:0.035,front:0.118},
    pot3:{back:0.058,front:0.199},
    pot4:{back:0.063,front:0.177},
    grotepot:{back:0.058,front:0.140}
  };
  const NAAR_VOREN=0.70;
  const ZADEN={affodil:1,wolfsmelk:1,alsem:1,varkensgras:1,sodejus:1};
  /* Echte stengelvoet: onderkant dekkende pixels, bij een aardkluit de overgang plant/aarde. */
  const VOET={
    'affodil-0.webp':0.944,'affodil-1.webp':0.976,'affodil-2.webp':0.975,'affodil-3.webp':0.90,
    'wolfsmelk-0.webp':0.943,'wolfsmelk-1.webp':0.953,'wolfsmelk-2.webp':0.94,'wolfsmelk-3.webp':0.90,
    'alsem-0.webp':0.894,'alsem-1.webp':0.94,'alsem-2.webp':0.94,'alsem-3.webp':0.90,
    'varkensgras-0.webp':0.944,'varkensgras-1.webp':0.94,'varkensgras-2.webp':0.94,'varkensgras-3.webp':0.93,
    'sodejus-0.webp':0.925,'sodejus-1.webp':0.966,'sodejus-2.webp':0.967,'sodejus-3.webp':0.93,
    'mandragora-0.webp':0.63,'mandragora-1.webp':0.72,'mandragora-2.webp':0.73,'mandragora-3.webp':0.73,'mandragora-4.webp':0.75,
    'tentacula-0.webp':0.63,'tentacula-1.webp':0.86,'tentacula-2.webp':0.85,'tentacula-3.webp':0.86,'tentacula-4.webp':0.90,
    'duivelsstrik-0.webp':0.80,'duivelsstrik-1.webp':0.84,'duivelsstrik-2.webp':0.83,'duivelsstrik-3.webp':0.82,'duivelsstrik-4.webp':0.90
  };
  const voetCache=Object.create(null);

  function naamVan(img){
    const s=(img.currentSrc||img.src||'').split('?')[0];
    return s.split('/').pop();
  }
  function openingVan(el){
    const pot=el.closest('[data-pot]');
    return OPENING[pot&&pot.dataset.pot]||null;
  }
  function aardePct(op){
    const y=op.back+NAAR_VOREN*(op.front-op.back);
    return (100-y*100).toFixed(1)+'%';
  }

  function meetVoetRaw(img){
    try{
      const w=img.naturalWidth,h=img.naturalHeight;
      if(!w||!h) return 0.98;
      const c=document.createElement('canvas');
      c.width=w;c.height=h;
      const g=c.getContext('2d',{willReadFrequently:true});
      g.drawImage(img,0,0);
      const d=g.getImageData(0,0,w,h).data;
      const x0=Math.floor(w*0.20),x1=Math.ceil(w*0.80);
      let last=0;
      for(let y=h-1;y>=0;y--){
        for(let x=x0;x<x1;x++){
          const i=(y*w+x)*4,a=d[i+3];
          if(a<180) continue;
          const lum=0.3*d[i]+0.59*d[i+1]+0.11*d[i+2];
          if(lum>=210 && a<240) continue;
          last=y+1; break;
        }
        if(last) break;
      }
      return last?last/h:0.98;
    }catch(e){return 0.98}
  }

  function meetVoet(img){
    const key=naamVan(img);
    if(voetCache[key]!=null) return Promise.resolve(voetCache[key]);
    if(VOET[key]!=null){
      voetCache[key]=VOET[key];
      return Promise.resolve(VOET[key]);
    }
    return new Promise(res=>{
      const klaar=()=>{
        const f=meetVoetRaw(img);
        voetCache[key]=f;
        res(f);
      };
      if(img.complete&&img.naturalWidth) klaar();
      else img.addEventListener('load',klaar,{once:true});
    });
  }

  function zetEen(wrap){
    const pot=wrap.closest('[data-pot]');
    const op=openingVan(wrap);
    if(!pot||!op) return Promise.resolve();
    const z=pot.dataset.z||'';
    const isMand=z==='mandragora';
    const yDoel=op.back+(isMand?0.80:NAAR_VOREN)*(op.front-op.back);
    const aarde=(100-yDoel*100).toFixed(1)+'%';
    pot.style.setProperty('--aarde',aarde);
    wrap.style.setProperty('--aarde',aarde);
    const zaad=!!(ZADEN[z]&&wrap.querySelector('.kst0,.st0'));
    const img=wrap.querySelector('.plantimg,.superimg');
    if(!img) return Promise.resolve();
    return meetVoet(img).then(f=>{
      img.style.setProperty('--voet',String(f));
      wrap.style.setProperty('--voet',String(f));
      const ty=((1-f)*100).toFixed(2)+'%';
      const mega=wrap.classList.contains('gpwrap');
      img.style.setProperty('transform', (mega?'translateX(-50%) ':'')+'translateY('+ty+')', 'important');
      if(zaad){
        const y=op.back+0.75*(op.front-op.back);
        const zAarde=(100-y*100).toFixed(1)+'%';
        pot.style.setProperty('--aarde',zAarde);
        wrap.style.setProperty('--aarde',zAarde);
      }
    });
  }

  function plaatsAlle(){
    const jobs=[];
    try{
      document.querySelectorAll('.potwrap,.gpwrap').forEach(w=>{
        const p=zetEen(w);
        if(p&&p.then) jobs.push(p);
      });
    }catch(e){}
    return Promise.all(jobs);
  }

  function hook(){
    if(typeof V!=='undefined'&&typeof V.mijnkas==='function'&&!V.mijnkas._kas261){
      const o=V.mijnkas;
      V.mijnkas=function(){
        const r=o.apply(this,arguments);
        requestAnimationFrame(()=>{plaatsAlle();setTimeout(plaatsAlle,80)});
        return r;
      };
      V.mijnkas._kas261=1;
    }
    if(document.body&&document.body.dataset.view==='mijnkas') plaatsAlle();
  }
  hook();
  document.addEventListener('DOMContentLoaded',hook);
  window.ZW_KAS261={OPENING,NAAR_VOREN,VOET,ZADEN,plaatsAlle,meetVoet,voetCache,aardePct};
})();
