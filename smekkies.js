'use strict';
/* ====== Smekkies: valuta (intern S.galjoenen, 1:1 dus geen verlies), HUD-zakje, bonen-animaties ====== */
(()=>{const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 const KL=['rood','blauw','groen','geel','paars','oranje','roze','bruin'],SPEC=['gestipt','geblokt'];
 const SMAAK=['Oorsmeer!','Aardbei!','Spruitjes!','Zeep!','Toffee!','Kokosnoot!','Natte sok!','Gras!','Zwarte peper!','Kers!'];
 const IMG={};[...KL,...SPEC].forEach(k=>{const i=new Image();i.src=`img/smekkies/boon-${k}-64.webp`;IMG[k]=i});
 const zakNaam=v=>v<50?'leeg':v<300?'half':'vol';
 /* ---------- HUD ---------- */
 let toon=null,doelW=null;
 function badge(){let b=document.getElementById('smekbadge');if(b)return b;const h=document.querySelector('header');if(!h)return null;b=document.createElement('div');b.id='smekbadge';b.title='Smekkies';
  b.innerHTML=`<img class="zak" alt="Smekkies-zakje" src="img/smekkies/zak-leeg-128.webp"><b class="rol">0</b>`;const sb=document.getElementById('sterbadge');sb?h.insertBefore(b,sb):h.appendChild(b);return b}
 function rolZet(v){const b=badge();if(!b)return;const r=b.querySelector('.rol');const s=String(Math.max(0,Math.round(v)));if(r.textContent!==s){const omhoog=+s>+(r.textContent||0);r.textContent=s;if(!RM){r.classList.remove('op','neer');void r.offsetWidth;r.classList.add(omhoog?'op':'neer')}}
  const z=zakNaam(v),img=b.querySelector('.zak');if(img.dataset.z!==z){const eerste=!img.dataset.z;img.dataset.z=z;img.src=`img/smekkies/zak-${z}-128.webp`;if(!eerste&&!RM){b.classList.remove('poef');void b.offsetWidth;b.classList.add('poef');poef(b)}}}
 const wiebel=()=>{const b=badge();if(!b)return;b.classList.remove('wiebel');void b.offsetWidth;b.classList.add('wiebel')};
 const krimp=()=>{const b=badge();if(!b)return;b.classList.remove('krimp');void b.offsetWidth;b.classList.add('krimp')};
 const zakPunt=()=>{const b=badge();const i=b&&b.querySelector('.zak');if(!i)return[innerWidth-60,30];const r=i.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height*.45]};
 /* ---------- geluid + haptiek ---------- */
 let ac,laatstPlop=0,plopN=0,laatstVib=0;
 function plop(i){const nu=performance.now();if(nu-laatstPlop<45)return;laatstPlop=nu;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();const f=520*Math.pow(2,Math.min(18,i)/12);o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.6,t+.05);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.07,t+.006);g.gain.exponentialRampToValueAtTime(.001,t+.09);o.connect(g).connect(ac.destination);o.start(t);o.stop(t+.1)}catch(e){}
  if(nu-laatstVib>70){laatstVib=nu;try{navigator.vibrate&&navigator.vibrate(7)}catch(e){}}}
 /* ---------- deeltjeslaag ---------- */
 let cv,ctx,bonen=[],vonken=[],raf=0,W=0,H=0;const MAX=40;
 function laag(){if(cv&&cv.isConnected)return;cv=document.createElement('canvas');cv.id='smekcv';document.body.appendChild(cv);ctx=cv.getContext('2d');maat();addEventListener('resize',maat)}
 function maat(){if(!cv)return;const d=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0)}
 function start(){if(!raf){laatst=performance.now();raf=requestAnimationFrame(frame)}}
 let laatst=0;
 function frame(nu){const dt=Math.min(40,nu-laatst)/16.7;laatst=nu;ctx.clearRect(0,0,W,H);const [zx,zy]=zakPunt();
  for(let i=bonen.length-1;i>=0;i--){const b=bonen[i];b.t+=dt*16.7;
   if(b.t<0)continue;
   if(b.fase==='spring'){b.vy+=.42*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.rot+=b.vr*dt;
    if(b.y>b.vloer){b.y=b.vloer;if(Math.abs(b.vy)>2){b.sq=Math.min(.45,Math.abs(b.vy)*.05)}b.vy*=-.52;b.vx*=.8;b.vr*=.7}
    if(b.x<12||b.x>W-12){b.vx*=-.7;b.x=Math.max(12,Math.min(W-12,b.x))}
    if(b.t>b.springTot){b.fase='vlieg';b.t0=b.t;b.p0=[b.x,b.y];b.p1=[(b.x+zx)/2+(Math.random()-.5)*120,Math.min(b.y,zy)-80-Math.random()*120]}}
   else if(b.fase==='vlieg'){const p=Math.min(1,(b.t-b.t0)/b.duur),e=p*p*(3-2*p),q=1-e;b.x=q*q*b.p0[0]+2*q*e*b.p1[0]+e*e*zx;b.y=q*q*b.p0[1]+2*q*e*b.p1[1]+e*e*zy;b.rot+=.25*dt;b.schaal=1-.45*e;
    if(p>=1){bonen.splice(i,1);aankomst(b);continue}}
   else if(b.fase==='uit'){const p=Math.min(1,b.t/b.duur),e=p*p,q=1-e;b.x=q*q*b.p0[0]+2*q*e*b.p1[0]+e*e*b.p2[0];b.y=q*q*b.p0[1]+2*q*e*b.p1[1]+e*e*b.p2[1];b.rot+=.3*dt;b.schaal=.7+.3*Math.sin(p*Math.PI);if(p>=1){bonen.splice(i,1);vonk(b.x,b.y,'#ffe58a',5);continue}}
   b.sq*=Math.pow(.82,dt);const s=26*(b.schaal||1);ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.rot);ctx.scale(1+b.sq,1-b.sq);const im=IMG[b.k];if(im.complete)ctx.drawImage(im,-s/2,-s/2,s,s);ctx.restore();
   if(b.spec&&Math.random()<.3)vonk(b.x,b.y,'#fff6b0',1)}
  ctx.globalCompositeOperation='lighter';for(let i=vonken.length-1;i>=0;i--){const v=vonken[i];v.x+=v.vx*dt;v.y+=v.vy*dt;v.vy+=.08*dt;v.l-=.03*dt;if(v.l<=0){vonken.splice(i,1);continue}ctx.globalAlpha=v.l;ctx.fillStyle=v.k;ctx.beginPath();ctx.arc(v.x,v.y,2.2*v.l+.6,0,7);ctx.fill()}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  if(bonen.length||vonken.length)raf=requestAnimationFrame(frame);else{raf=0;ctx.clearRect(0,0,W,H)}}
 function vonk(x,y,k,n){for(let i=0;i<n&&vonken.length<160;i++)vonken.push({x,y,vx:(Math.random()-.5)*4,vy:(Math.random()-.8)*4,l:1,k})}
 function poef(b){const r=b.querySelector('.zak').getBoundingClientRect();laag();for(let i=0;i<14;i++)vonk(r.left+r.width/2,r.top+r.height/2,['#ffe58a','#ff9ad8','#9af0ff'][i%3],1);start()}
 /* bij aankomst in zakje: teller rolt een stapje, zakje wiebelt, plop met oplopende toon */
 function aankomst(b){toon=Math.min(doelW,toon+b.w);rolZet(toon);wiebel();plop(plopN++);if(b.spec){smaak(b.k)}if(!bonen.some(x=>x.fase!=='uit')){toon=doelW;rolZet(toon);plopN=0}}
 function smaak(k){const t=document.createElement('div');t.className='smaak';t.textContent=SMAAK[Math.random()*SMAAK.length|0];const [x,y]=zakPunt();t.style.left=(x-60)+'px';t.style.top=(y+26)+'px';document.body.appendChild(t);setTimeout(()=>t.remove(),1500)}
 const kleur=()=>Math.random()<.08?SPEC[Math.random()*2|0]:KL[Math.random()*KL.length|0];
 /* n = waarde; we tonen max ~MAX bonen, waarde gelijk verdeeld (elke Smekkie is 1; een boon draagt er soms meer) */
 function verdeel(n,max){const k=Math.max(1,Math.min(max,n));const per=Math.floor(n/k),rest=n%k;return Array.from({length:k},(_,i)=>per+(i<rest?1:0))}
 function spring(bron,n,o={}){laag();const vrij=Math.max(1,MAX-bonen.length);verdeel(n,Math.min(o.max||18,vrij)).forEach((w,i)=>{const k=kleur();
  bonen.push({k,spec:SPEC.includes(k),w,x:bron[0]+(Math.random()-.5)*(o.breed||40),y:bron[1]+(Math.random()-.5)*10,vx:(Math.random()-.5)*(o.vx||7),vy:-(o.kracht||9)-Math.random()*5,rot:Math.random()*6,vr:(Math.random()-.5)*.4,sq:0,vloer:o.vloer||Math.min(H-120,bron[1]+150),fase:'spring',t:-(o.stagger||45)*i,springTot:(o.springTot||900)+i*(o.stagger||45)*.6,duur:620+Math.random()*180})});start()}
 function regen(n){laag();const vrij=Math.max(1,MAX-bonen.length);verdeel(n,vrij).forEach((w,i)=>{const k=kleur();bonen.push({k,spec:SPEC.includes(k),w,x:Math.random()*W,y:-20-Math.random()*60,vx:(Math.random()-.5)*2,vy:2+Math.random()*3,rot:Math.random()*6,vr:(Math.random()-.5)*.3,sq:0,vloer:H*(.55+Math.random()*.25),fase:'spring',t:-i*55,springTot:1100+i*55*.6,duur:700})});start();groteTekst(n)}
 function groteTekst(n){const t=document.createElement('div');t.className='smekgroot';t.innerHTML=`+${n} <small>Smekkies</small>`;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
 function uitgeven(n,doel){laag();const [zx,zy]=zakPunt();krimp();verdeel(n,Math.min(10,MAX)).forEach((w,i)=>{bonen.push({k:kleur(),w:0,x:zx,y:zy,rot:0,vr:0,sq:0,fase:'uit',t:-i*60,duur:520,p0:[zx,zy],p1:[(zx+doel[0])/2+(Math.random()-.5)*80,Math.min(zy,doel[1])-60],p2:[doel[0]+(Math.random()-.5)*20,doel[1]]})});start()}
 /* bonus-bonen uit het zettenmedaillon over het bord (zoals 'Sugar Crush') */
 function bonusBonen(zet,waarde){const m=document.querySelector('.m3zet,.m3med,[class*=medaill]');const bord=document.getElementById('m3c');if(!m||!bord)return 0;laag();const r=m.getBoundingClientRect(),br=bord.getBoundingClientRect();const n=Math.min(zet,12);const ws=verdeel(waarde,n);
  ws.forEach((w,i)=>{const tx=br.left+Math.random()*br.width,ty=br.top+Math.random()*br.height;const k=kleur();bonen.push({k,spec:SPEC.includes(k),w,x:r.left+r.width/2,y:r.top+r.height/2,vx:(tx-(r.left+r.width/2))/38,vy:(ty-(r.top+r.height/2))/38-6,rot:0,vr:.3,sq:0,vloer:ty,fase:'spring',t:-i*140,springTot:700+i*140,duur:700})});start();return ws.length}
 /* ---------- koppeling: elke verandering van het saldo wordt een animatie ---------- */
 let laatsteTik=[innerWidth/2,innerHeight*.55,0];
 addEventListener('pointerdown',e=>{const el=e.target.closest&&e.target.closest('button,.tegel,.kaart,.zkies,.quest,.kpot')||e.target;const r=el.getBoundingClientRect?el.getBoundingClientRect():{left:e.clientX,top:e.clientY,width:0,height:0};laatsteTik=[r.left+r.width/2,r.top+r.height/2,performance.now()]},true);
 window.muntRegen=()=>{};window.telOp=()=>{};
 function verwerk(){const v=S.galjoenen||0;if(toon===null){toon=v;doelW=v;rolZet(v);return}
  if(v===doelW)return;const diff=v-doelW;doelW=v;
  if(RM){toon=v;rolZet(v);return}
  if(diff<0){toon=v;rolZet(v);const d=window._smekDoel||(performance.now()-laatsteTik[2]<4000?laatsteTik:[innerWidth/2,innerHeight/2]);window._smekDoel=null;uitgeven(-diff,d);return}
  setTimeout(()=>{const win=[...document.querySelectorAll('.m3eind h2')].pop();
   if(win&&win.isConnected&&/gehaald/i.test(win.textContent)){const r=win.getBoundingClientRect();win.classList.add('barst');const bonus=window._m3Bonus||0;window._m3Bonus=0;const hoofd=Math.max(1,diff-bonus);
    spring([r.left+r.width/2,r.top+r.height/2],hoofd,{breed:r.width*.8,kracht:10,vx:9,vloer:Math.min(H-110,r.bottom+220),max:22,stagger:40});if(bonus>0)setTimeout(()=>{if(!bonusBonen(window._m3Zet||bonus,bonus))spring([W/2,H*.4],bonus)},600);if(diff>=100)groteTekst(diff);return}
   if(diff>=100)return regen(diff);
   const bron=performance.now()-laatsteTik[2]<4000?laatsteTik:[W/2,H*.55];spring(bron,diff,{kracht:11,vx:5,breed:30,springTot:650,max:14,stagger:35})},80)}
 function plaats(){const b=badge(),s=document.getElementById('sterbadge');if(!b||!s)return;const r=s.getBoundingClientRect();if(r.width)b.style.right=(innerWidth-r.left+6)+'px'}
 addEventListener('resize',plaats);
 const _st=stats;stats=function(){_st();try{badge();plaats();setTimeout(plaats,700);verwerk()}catch(e){console.warn(e)}};
 /* match-3: resterende zetten → bonus-bonen; winstreeks ≥3 → dubbele beloning */
 if(typeof m3Winst==='function'){const _w=m3Winst;m3Winst=function(n,b){window._m3Zet=b.zet;window._m3Bonus=b.zet*2;S.winReeks=(S.winReeks||0)+1;const r=_w(n,b);
   return r}}
 if(typeof m3Verlies==='function'){const _v=m3Verlies;m3Verlies=function(...a){S.winReeks=0;bewaar();return _v(...a)}}
 window.smek={spring,regen,uitgeven,bonusBonen,groteTekst};
 try{stats()}catch(e){}
})();
