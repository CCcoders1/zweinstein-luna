'use strict';
/* ====== Menu- en HUD-knoppen ontworpen door de maker ====== */
(()=>{const NI={pad:'kaart',kas:'kassen',home:'hal',boek:'boek',meer:'meer'};
 const src=(n,p)=>`img/ui/${n}-${p}.webp`;
 ['nav-kaart','nav-kassen','nav-hal','nav-boek','nav-meer'].forEach(n=>{const i=new Image();i.src=src(n,192)});
 const _nav=nav;nav=function(act){_nav(act);const el=document.getElementById('nav');if(!el)return;el.classList.add('uinav');
  el.querySelectorAll('button').forEach(b=>{const m=(b.getAttribute('onclick')||'').match(/ga\('(\w+)'\)/);const id=m&&m[1];if(!NI[id])return;
   const vak=b.querySelector('.halknop')||b.querySelector('.rond');if(vak&&!vak.querySelector('img.uiico'))vak.innerHTML=`<img class="uiico" alt="" src="${src('nav-'+NI[id],192)}" decoding="async">`})};
 const _stats=stats;stats=function(){_stats();try{hud()}catch(e){console.warn(e)}};
 function hud(){const lg=document.getElementById('logo');if(lg&&!lg.dataset.ui){lg.dataset.ui=1;lg.innerHTML=`<img class="uiframe" alt="Zweinstein" src="${src('kasteelframe',160)}">`}
  const st=document.getElementById('stats');if(st){const s=st.querySelector('.schild-t');if(s){const b=s.querySelector('b');const v=b?b.textContent.replace(/\s*pt/,'').trim():'';s.innerHTML=`<b>${v}</b>`;s.title='Afdelingspunten'}
   const v=st.querySelector('.vuur-t');if(v){const b=v.querySelector('b');v.innerHTML=`<img alt="" src="${src('vlam',64)}"><b>${b?b.textContent:''}</b>`;v.title='Dagen op rij'}}
  const l=document.getElementById('luid');if(l)l.classList.add('uiluid')}
 const t=setInterval(()=>{const l=document.getElementById('luid');if(l){l.classList.add('uiluid');clearInterval(t)}},300);setTimeout(()=>clearInterval(t),8000);
 try{stats();nav(document.querySelector('#nav .actief')?null:'home')}catch(e){}
})();
/* ====== Level-gehaald-achtergrond (klaslokaal, ontworpen door de maker) ====== */
(()=>{const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;const KL=(innerWidth*(devicePixelRatio||1)>900)?'':'-klein';const srcVan=n=>`img/winst/${(window.vakVan?vakVan(n||S.m3lvl||1).id:'herbologie')}${KL}.webp`;
 const BEELD={};const laad=n=>{const u=srcVan(n);if(BEELD[u])return BEELD[u];const i=new Image();i.src=u;return BEELD[u]=(i.decode?i.decode():Promise.resolve()).catch(()=>{}).then(()=>u)};
 if(typeof m3Speel==='function'){const _s=m3Speel;m3Speel=function(...a){laad(a[0]);return _s(...a)}}
 let laatstApplaus=0;
 function applaus(){const nu=Date.now();if(nu-laatstApplaus<4000)return;laatstApplaus=nu;try{if(window.fx&&fx.aan===false)return;const ac=window._pipAc||(window._pipAc=new (window.AudioContext||window.webkitAudioContext)());const t0=ac.currentTime;
   const len=Math.floor(ac.sampleRate*.03),buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,6);
   const uit=ac.createGain();uit.gain.setValueAtTime(0,t0);uit.gain.linearRampToValueAtTime(.16,t0+.3);uit.gain.setValueAtTime(.16,t0+1.3);uit.gain.linearRampToValueAtTime(0,t0+2.4);const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=1600;f.Q.value=.7;f.connect(uit).connect(ac.destination);
   for(let k=0;k<70;k++){const s=ac.createBufferSource();s.buffer=buf;s.playbackRate.value=.8+Math.random()*.5;const g=ac.createGain();g.gain.value=.4+Math.random()*.6;s.connect(g).connect(f);s.start(t0+Math.random()*2.3)}}catch(e){}}
 if(typeof m3Winst==='function'){const _w=m3Winst;m3Winst=function(...a){const r=_w(...a);const nLv=a[0];try{
   const h=[...document.querySelectorAll('.m3eind h2')].pop();const mod=h&&h.closest('.modal');if(mod&&!mod.querySelector('.winbg')){mod.classList.add('metwinbg');const bg=document.createElement('div');bg.className='winbg';mod.insertBefore(bg,mod.firstChild);
    laad(nLv).then(u=>{bg.style.backgroundImage=`url(${u})`;requestAnimationFrame(()=>bg.classList.add('zicht'))});applaus()}}catch(e){console.warn(e)}return r}}
})();
