'use strict';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fx=(()=>{let ac,master,muz,muzOn=JSON.parse(localStorage.getItem('zw_muz')??'true'),vol=+(localStorage.getItem('zw_vol')??0.5),loopT;
 const init=()=>{if(ac)return;ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=vol;master.connect(ac.destination);muz=ac.createGain();muz.gain.value=muzOn?.35:0;muz.connect(master);loop()};
 const toon=(f,t,d,{type='sine',g=.3,dest=master,att=.01}={})=>{const o=ac.createOscillator(),v=ac.createGain();o.type=type;o.frequency.value=f;v.gain.setValueAtTime(0,t);v.gain.linearRampToValueAtTime(g,t+att);v.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(v);v.connect(dest);o.start(t);o.stop(t+d+.05)};
 const ruis=(d,fq,g=.3,sweep)=>{const n=ac.sampleRate*d,b=ac.createBuffer(1,n,ac.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=Math.random()*2-1;const s=ac.createBufferSource();s.buffer=b;const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=fq;f.Q.value=1.5;const t=ac.currentTime;if(sweep)f.frequency.exponentialRampToValueAtTime(sweep,t+d);const v=ac.createGain();v.gain.setValueAtTime(g,t);v.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(v);v.connect(master);s.start()};
 const N=m=>440*2**((m-69)/12);
 // Eigen compositie 'Kaslicht-wals' – 3/4, D-mineur, celesta + harp. Geen bestaande melodie.
 const BEAT=.55,MAAT=3*BEAT;
 const AKK=[[50,57,62,65],[46,53,58,62],[43,50,55,58],[45,52,57,61],[50,57,62,65],[41,48,53,57],[43,50,55,58],[45,49,52,57]];
 const MEL=[[74,0,2],[72,2,1],[70,3,2],[69,5,1],[70,6,1.5],[72,7.5,.5],[74,8,1],[77,9,3],[76,12,2],[74,14,1],[72,15,1],[70,16,1],[69,17,1],[67,18,3],[69,21,1.5],[70,22.5,.5],[69,23,1]];
 const cel=(f,t,d,g,dest)=>{toon(f,t,d*1.4,{g,dest});toon(f*4,t,d*.4,{g:g*.25,dest});toon(f*2.01,t,d*.8,{g:g*.3,dest})};
 // Thema's per ruimte (eigen composities: transpositie, tempo, toonsoort, spanning)
 const THEMA={zaal:{tr:0,bt:.55,maj:0,sp:0},kas:{tr:5,bt:.6,maj:1,sp:0},kerker:{tr:-5,bt:.68,maj:0,sp:1},bieb:{tr:2,bt:.62,maj:0,sp:0},toren:{tr:7,bt:.7,maj:1,sp:0},bos:{tr:-2,bt:.66,maj:0,sp:1},kamer:{tr:3,bt:.6,maj:1,sp:0},dorp:{tr:5,bt:.5,maj:1,sp:0},kaart:{tr:0,bt:.58,maj:0,sp:0},gang:{tr:-3,bt:.58,maj:0,sp:0}};
 let th=THEMA.zaal,spanning=0;
 const majeur=m=>{const r=((m-50)%12+12)%12;return r==5||r==10||r==3?m+(r==5?0:1):m};
 function loop(){const B=th.bt,M=3*B,T=th.tr;const t0=ac.currentTime+.1;const q=m=>N((th.maj?majeur(m):m)+T);
  AKK.forEach((a,i)=>{const t=t0+i*M;toon(q(a[0]-12),t,M,{type:'triangle',g:.09,dest:muz,att:.05});[1,2,3,2,1,3].forEach((j,n)=>toon(q(a[j]),t+n*B/2,1.2,{type:'triangle',g:.05,dest:muz}));
   if(th.sp||spanning){for(let n=0;n<6;n++)toon(q(a[0]-24),t+n*B/2,B/2.2,{type:'sawtooth',g:.018*(1+spanning),dest:muz})}});
  MEL.forEach(([m,b,d])=>cel(q(m+12),t0+b*B,d*B,.07,muz));loopT=setTimeout(loop,AKK.length*M*1000)}
 function wissel(naam){const n=THEMA[naam]||THEMA.zaal;if(n===th||!ac){th=n;return}const t=ac.currentTime;muz.gain.cancelScheduledValues(t);muz.gain.setValueAtTime(muz.gain.value,t);muz.gain.linearRampToValueAtTime(0,t+.9);clearTimeout(loopT);setTimeout(()=>{th=n;loop();const t2=ac.currentTime;muz.gain.linearRampToValueAtTime(muzOn?.35:0,t2+1.4)},950)}
 function bloei(){if(!ac)return;const t=ac.currentTime;[62,66,69,74,78].forEach((m,i)=>toon(N(m+th.tr),t+i*.07,2.4,{type:'triangle',g:.06,dest:muz,att:.3}))}
 const S={kras:()=>[0,.12,.26].forEach(d=>setTimeout(()=>ruis(.12,3000,.15,6000),d*1000)),
  munt:()=>{const t=ac.currentTime;[2093,2637,3136].forEach((f,i)=>toon(f,t+i*.06,.4,{g:.15}))},
  whoosh:()=>ruis(.5,400,.25,3000),
  goed:()=>{const t=ac.currentTime;[72,76,79,84].forEach((m,i)=>toon(N(m+12),t+i*.09,1,{type:'triangle',g:.2}))},
  fout:()=>{const t=ac.currentTime;toon(196,t,.35,{type:'sawtooth',g:.08});toon(185,t+.18,.45,{type:'sawtooth',g:.08})},
  fanfare:()=>{const t=ac.currentTime;[[60,0],[64,.15],[67,.3],[72,.45],[67,.7],[72,.85]].forEach(([m,d])=>{toon(N(m),t+d,.5,{type:'square',g:.08});toon(N(m+12),t+d,.5,{type:'triangle',g:.1})})},
  klik:()=>toon(1800,ac.currentTime,.08,{g:.06})};
 const speel=n=>{try{init();if(ac.state==='suspended')ac.resume();S[n]()}catch(e){}};
 return{duik:on=>{if(!ac)return;const t=ac.currentTime;muz.gain.cancelScheduledValues(t);muz.gain.setValueAtTime(muz.gain.value,t);muz.gain.linearRampToValueAtTime(on?.06:(muzOn?.35:0),t+.5)},thema:wissel,bloei,spanning:v=>{spanning=v?1:0},ctx:()=>{init();if(ac.state==='suspended')ac.resume();return{ac,master}},init,speel,muz:a=>{muzOn=a;localStorage.setItem('zw_muz',a);if(muz)muz.gain.value=a?.35:0},vol:v=>{vol=v;localStorage.setItem('zw_vol',v);if(master)master.gain.value=v},get muzOn(){return muzOn},get volv(){return vol}}})();
// overlay canvas: kaarsen, vonken, confetti
const cv=document.createElement('canvas');cv.id='fxc';document.body.appendChild(cv);const cx=cv.getContext('2d');
let W,H;const rs=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};rs();addEventListener('resize',rs);
const kaarsen=Array.from({length:0},(_,i)=>({x:Math.random(),y:Math.random()*.6+.05,p:Math.random()*6}));
let deel=[];
function vonk(x,y,n=30,kl=['#ffd700','#fff3b0','#ffb347'],v=4,conf=false){if(RM)n=Math.min(n,6);for(let i=0;i<n;i++){const a=Math.random()*6.28,s=Math.random()*v+1;deel.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-(conf?4:0),l:1,k:kl[i%kl.length],c:conf,r:Math.random()*6})}}
function teken(t){cx.clearRect(0,0,W,H);
 kaarsen.forEach(k=>{const x=k.x*W,y=(k.y*H)+Math.sin(t/1400+k.p)*10;cx.fillStyle='rgba(245,235,210,.85)';cx.fillRect(x-4,y,8,26);const f=1+Math.sin(t/120+k.p)*.15;const g=cx.createRadialGradient(x,y-6,0,x,y-6,26*f);g.addColorStop(0,'rgba(255,220,120,.55)');g.addColorStop(1,'rgba(255,180,60,0)');cx.fillStyle=g;cx.beginPath();cx.arc(x,y-6,26*f,0,6.28);cx.fill();cx.fillStyle='#ffcf5a';cx.beginPath();cx.ellipse(x,y-6,3,7*f,0,0,6.28);cx.fill()});
 deel=deel.filter(d=>d.l>0);deel.forEach(d=>{d.x+=d.vx;d.y+=d.vy;d.vy+=d.c?.12:.05;d.l-=d.c?.008:.02;cx.globalAlpha=Math.max(d.l,0);cx.fillStyle=d.k;if(d.c){d.r+=.2;cx.save();cx.translate(d.x,d.y);cx.rotate(d.r);cx.fillRect(-4,-2,8,4);cx.restore()}else{cx.beginPath();cx.arc(d.x,d.y,2,0,6.28);cx.fill()}});cx.globalAlpha=1;requestAnimationFrame(teken)}
requestAnimationFrame(teken);
// toverstok-cursor + vonkenspoor
if(matchMedia('(pointer:fine)').matches){addEventListener('mousemove',e=>{if(!RM&&Math.random()<.5)deel.push({x:e.clientX,y:e.clientY,vx:(Math.random()-.5),vy:Math.random(),l:.8,k:Math.random()<.5?'#ffd700':'#fff',c:false})})}
addEventListener('pointerdown',e=>{vonk(e.clientX,e.clientY,6,undefined,2)});
let lx=innerWidth/2,ly=innerHeight/2;addEventListener('pointerdown',e=>{lx=e.clientX;ly=e.clientY},true);
fx.goed=()=>{fx.speel('goed');try{fx.bloei()}catch(e){}navigator.vibrate&&navigator.vibrate([30,40,60]);vonk(lx,ly,50);if(!RM){const f=document.createElement('div');f.className='flits';document.body.appendChild(f);setTimeout(()=>f.remove(),700)}};
fx.fout=()=>{fx.speel('fout');navigator.vibrate&&navigator.vibrate([120,60,120]);const m=document.querySelector('#app .perkament')||document.querySelector('#app');if(!RM){m.classList.remove('schud');void m.offsetWidth;m.classList.add('schud')}const r=document.createElement('div');r.className='rook';r.textContent='💨';r.style.left=lx-20+'px';r.style.top=ly-30+'px';document.body.appendChild(r);setTimeout(()=>r.remove(),1400)};
fx.levelup=t=>{fx.speel('fanfare');navigator.vibrate&&navigator.vibrate([60,40,60,40,200]);for(let i=0;i<5;i++)setTimeout(()=>vonk(Math.random()*W,Math.random()*H*.5+50,60,['#ffd700','#ff6b6b','#7fdbff','#b6ff9e','#e0a6ff'],6),i*350);vonk(W/2,H*.8,120,['#ffd700','#ff6b6b','#7fdbff','#b6ff9e','#e0a6ff'],8,true);
 document.querySelectorAll('.lvlup').forEach(x=>x.remove());const d=document.createElement('div');d.className='lvlup';d.innerHTML='<div>🎓</div><h1>Nieuw niveau!</h1><h2>'+t+'</h2>';document.body.appendChild(d);d.onclick=()=>d.remove();setTimeout(()=>d.remove(),3800)};
fx.badge=(i,n)=>{fx.speel('goed');const d=document.createElement('div');d.className='badgepop';d.innerHTML='<b>'+i+'</b><span>Nieuwe badge<br><strong>'+n+'</strong></span>';document.body.appendChild(d);setTimeout(()=>d.remove(),4200)};
fx.woorden=(el,ms=160)=>{if(RM||!el)return;const w=el.textContent.split(' ');el.innerHTML=w.map((x,i)=>`<span class="wrd" style="animation-delay:${i*ms}ms">${x}</span>`).join(' ')};
// geluidspaneel
const gp=document.createElement('div');gp.id='geluid';gp.innerHTML=`<button id="mzk" aria-label="Muziek aan/uit">${fx.muzOn?'🎵':'🔇'}</button><input id="vol" type="range" min="0" max="1" step="0.05" value="${fx.volv}" aria-label="Volume">`;document.body.appendChild(gp);
document.getElementById('mzk').onclick=e=>{e.stopPropagation();fx.init();fx.muz(!fx.muzOn);e.target.textContent=fx.muzOn?'🎵':'🔇'};
document.getElementById('vol').oninput=e=>fx.vol(+e.target.value);
addEventListener('click',e=>{if(e.target.closest('nav button'))fx.speel('whoosh');else if(e.target.closest('button,.tegel,.memk,.ingr'))fx.speel('klik')});
// intro
fx.intro=klaar=>{const o=document.createElement('div');o.id='intro';o.innerHTML=`<div class="uil"><img class="uilfoto" src="img/sneeuwuil.webp" alt="Sneeuwuil"><div class="env"><img class="zg" src="img/lakzegel.webp" alt="Lakzegel"></div></div><p class="tik">Een uil brengt post voor jou…<br><b>Tik om de brief te openen</b></p>`;document.body.appendChild(o);
 o.onclick=()=>{fx.init();fx.speel('whoosh');o.classList.add('breek');setTimeout(()=>fx.speel('kras'),500);setTimeout(()=>{o.classList.add('weg');klaar();setTimeout(()=>o.remove(),800)},RM?100:1300)}};
