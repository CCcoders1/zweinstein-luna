'use strict';
/* Spreuklessen: Flipendo. Teken het gebaar na; score = bedekking, inkt = 110% van het teken. */
(()=>{
const LES={flipendo:{naam:'Flipendo',uitleg:'Een duw-spreuk: hij stoot dingen weg.',
 /* Flipendo: spiraal linksom, start rechtsboven bij de toverstok, eindigt midden-links binnenin */
 pad:[[0.455,0.13],[0.442,0.131],[0.425,0.131],[0.404,0.131],[0.381,0.131],[0.357,0.133],[0.333,0.135],[0.311,0.139],[0.29,0.145],[0.271,0.153],[0.252,0.162],[0.233,0.173],[0.215,0.184],[0.198,0.197],[0.182,0.212],[0.167,0.227],[0.155,0.243],[0.144,0.26],[0.135,0.279],[0.128,0.3],[0.121,0.321],[0.116,0.343],[0.113,0.365],[0.111,0.387],[0.11,0.408],[0.111,0.429],[0.113,0.451],[0.116,0.472],[0.121,0.494],[0.128,0.515],[0.135,0.536],[0.144,0.555],[0.155,0.573],[0.167,0.59],[0.18,0.605],[0.195,0.62],[0.211,0.634],[0.229,0.646],[0.248,0.658],[0.268,0.669],[0.29,0.678],[0.314,0.687],[0.34,0.694],[0.368,0.7],[0.397,0.706],[0.427,0.71],[0.457,0.713],[0.487,0.715],[0.515,0.716],[0.544,0.715],[0.574,0.714],[0.604,0.711],[0.634,0.707],[0.663,0.702],[0.691,0.695],[0.717,0.687],[0.741,0.678],[0.763,0.667],[0.784,0.655],[0.804,0.64],[0.822,0.625],[0.839,0.609],[0.854,0.592],[0.866,0.575],[0.876,0.558],[0.883,0.54],[0.888,0.522],[0.89,0.502],[0.89,0.482],[0.888,0.462],[0.885,0.443],[0.881,0.425],[0.876,0.408],[0.869,0.392],[0.861,0.377],[0.852,0.362],[0.841,0.348],[0.829,0.335],[0.816,0.323],[0.801,0.312],[0.786,0.303],[0.769,0.295],[0.749,0.288],[0.729,0.283],[0.707,0.279],[0.685,0.276],[0.663,0.274],[0.641,0.273],[0.621,0.273],[0.601,0.274],[0.581,0.276],[0.561,0.279],[0.541,0.283],[0.522,0.289],[0.503,0.295],[0.486,0.302],[0.47,0.31],[0.456,0.32],[0.441,0.331],[0.427,0.343],[0.415,0.357],[0.403,0.37],[0.394,0.384],[0.386,0.396],[0.38,0.408],[0.378,0.419],[0.378,0.429],[0.38,0.44],[0.384,0.45],[0.388,0.46],[0.394,0.468],[0.399,0.476],[0.403,0.483],[0.407,0.488],[0.412,0.493],[0.417,0.496],[0.423,0.499],[0.428,0.501],[0.433,0.503],[0.437,0.504],[0.44,0.505]],
 levels:[{nodig:50,tijd:20,beloning:10},{nodig:80,tijd:16,beloning:20},{nodig:90,tijd:14,beloning:35}]}};
const sp=()=>{S.spreuken=S.spreuken||{};return S.spreuken};
const speel=n=>{try{fx.speel(n)}catch(e){}};
const rnd=(p,n)=>p+'-'+(1+Math.random()*n|0);
V.spreuken=()=>{const L=LES.flipendo,v=sp().flipendo||{s:[]};
 app(`<div class="perkament" style="max-width:560px;margin:0 auto"><h2>Spreuklessen</h2><p>Professor Krinkel leert je spreuken. Kijk goed hoe het lichtje het teken voordoet, en teken het dan na met je vinger.</p>
 <h3>🪄 ${L.naam}</h3><p class="klein">${L.uitleg}</p><div class="spl-rij">${L.levels.map((l,i)=>{const open=i==0||(v.s[i-1]|0)>0;return `<button class="knop ${open?'volgende':''}" ${open?`onclick="ga('spreukles',${i})"`:'disabled'} style="font-size:1.1em;margin:.3em">Les ${i+1}<br><small>${l.nodig}% bedekken</small><br>${'★'.repeat(v.s[i]|0)}${'☆'.repeat(3-(v.s[i]|0))}</button>`}).join('')}</div><br><button class="knop" onclick="ga('home')">Terug</button></div>`)};
V.spreukles=(li)=>{li=+li||0;const L=LES.flipendo,lv=L.levels[li];
 app(`<div class="spl"><div class="spl-top"><span>Les ${li+1}: ${L.naam}</span><span>Nodig: ${lv.nodig}%</span></div>
 <div class="spl-meters"><div>Bedekt <b id="splbed">0%</b></div><div>Inkt <b id="splinkt">110%</b><i class="spl-balk"><i id="splinktb"></i></i></div><div>⏳ <b id="spltijd">${lv.tijd}</b></div></div>
 <canvas id="splc"></canvas><div class="spl-msg" id="splmsg">Kijk goed…</div>
 <div class="spl-knop"><button class="knop" onclick="ga('spreuken')">Stoppen</button></div></div>`);
 const cv=$('#splc'),W=Math.min(innerWidth-16,520),H=Math.round(Math.min(W*1.05,innerHeight-400)),dpr=devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';const c=cv.getContext('2d');c.scale(dpr,dpr);
 const T=W*.1,P=L.pad.map(([x,y])=>[x*W,y*H]);
 const sc=.25,mw=Math.round(W*sc),mh=Math.round(H*sc);const mk=()=>{const o=document.createElement('canvas');o.width=mw;o.height=mh;const x=o.getContext('2d');x.scale(sc,sc);x.lineCap=x.lineJoin='round';x.lineWidth=T;return [o,x]};
 const [tm,tx]=mk();tx.beginPath();P.forEach((p,i)=>i?tx.lineTo(...p):tx.moveTo(...p));tx.stroke();
 const td=tx.getImageData(0,0,mw,mh).data;let opp=0;for(let i=3;i<td.length;i+=4)if(td[i]>128)opp++;
 const [um,ux]=mk();ux.strokeStyle='#000';
 const lijnen=[];let fase='demo',inkt=0,bed=0,demoT=0,t0=0,huidig=null;
 const lengte=P.reduce((s,p,i)=>i?s+Math.hypot(p[0]-P[i-1][0],p[1]-P[i-1][1]):0,0);
 const punt=f=>{let d=f*lengte;for(let i=1;i<P.length;i++){const l=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);if(d<=l){const k=d/l;return [P[i-1][0]+(P[i][0]-P[i-1][0])*k,P[i-1][1]+(P[i][1]-P[i-1][1])*k]}d-=l}return P[P.length-1]};
 function teken(){c.clearRect(0,0,W,H);
  /* teken: dikke semi-transparante zilveren ovale stippen */
  const st=T*.22;for(let d=0;d<=lengte;d+=st){const [x,y]=punt(d/lengte),[x2,y2]=punt(Math.min(1,(d+2)/lengte)),a=Math.atan2(y2-y,x2-x);c.save();c.translate(x,y);c.rotate(a);c.fillStyle='rgba(240,242,255,.3)';c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1.2;c.beginPath();c.ellipse(0,0,T*.2,T*.5,0,0,7);c.fill();c.stroke();c.restore()}
  const [sx,sy]=P[0];c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.arc(sx,sy,T*.28,0,7);c.fill();c.save();c.translate(sx,sy);c.rotate(-.9);c.fillStyle='#3a2414';c.fillRect(0,-T*.09,T*1.3,T*.18);c.fillStyle='#e8d9b0';c.fillRect(T*1.05,-T*.1,T*.25,T*.2);c.restore();
  const [ax,ay]=punt(.06),[bx,by]=punt(.12),an=Math.atan2(by-ay,bx-ax);c.save();c.translate(bx,by);c.rotate(an);c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.moveTo(T*.35,0);c.lineTo(-T*.2,-T*.25);c.lineTo(-T*.2,T*.25);c.fill();c.restore();
  c.lineCap=c.lineJoin='round';c.lineWidth=T;c.strokeStyle='rgba(255,60,50,.38)';c.shadowColor='rgba(255,40,30,.8)';c.shadowBlur=12;lijnen.forEach(l=>{c.beginPath();l.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.stroke()});c.shadowBlur=0;
  if(fase=='demo'){const [x,y]=punt(Math.min(1,demoT));const g=c.createRadialGradient(x,y,0,x,y,T);g.addColorStop(0,'rgba(255,255,230,1)');g.addColorStop(1,'rgba(255,255,200,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,T,0,7);c.fill()}}
 const meet=()=>{const d=ux.getImageData(0,0,mw,mh).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>128&&td[i]>128)n++;bed=Math.round(n/opp*100);$('#splbed').textContent=bed+'%'};
 const inktUI=()=>{const r=Math.max(0,110-inkt);$('#splinkt').textContent=Math.round(r)+'%';$('#splinktb').style.width=(r/110*100)+'%'};
 teken();speel('stem-flipendo-q');$('#splmsg').textContent='Kijk goed: een spiraal, linksom!';
 const ds=performance.now();(function anim(n){if(fase!='demo')return;demoT=(n-ds)/2200;teken();if(demoT<1.15)requestAnimationFrame(anim);else{fase='teken';t0=Date.now();$('#splmsg').textContent='Nu jij! Begin bij de toverstok.';teken();tik()}})(ds);
 let tmr;const tik=()=>{tmr=setInterval(()=>{if(!document.body.contains(cv))return clearInterval(tmr);const r=lv.tijd-Math.floor((Date.now()-t0)/1000);$('#spltijd').textContent=Math.max(0,r);if(r<=0)klaar()},250)};
 const pos=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
 cv.onpointerdown=e=>{if(fase!='teken'||inkt>=110)return;cv.setPointerCapture(e.pointerId);huidig=[pos(e)];lijnen.push(huidig);window.zwKies&&zwKies.start(.6)};
 cv.onpointermove=e=>{if(!huidig||fase!='teken')return;const p=pos(e),q=huidig[huidig.length-1],d=Math.hypot(p[0]-q[0],p[1]-q[1]);if(d<2)return;inkt+=d*T/(opp/sc/sc)*100;huidig.push(p);ux.beginPath();ux.moveTo(...q);ux.lineTo(...p);ux.stroke();teken();inktUI();if(huidig.length%3==0)meet();if(inkt>=110){huidig=null;meet();klaar('inkt')}};
 cv.onpointerup=cv.onpointercancel=()=>{if(huidig){huidig=null;meet();if(bed>=lv.nodig&&bed>=98)klaar()}};
 const knop=$('.spl-knop');knop.insertAdjacentHTML('afterbegin','<button class="knop volgende" id="splklaar">Klaar!</button> ');$('#splklaar').onclick=()=>fase=='teken'&&klaar();
 function klaar(why){if(fase!='teken')return;fase='uit';clearInterval(tmr);meet();const ok=bed>=lv.nodig;const v=sp().flipendo=sp().flipendo||{s:[]};
  if(ok){const ster=1+(bed>=Math.min(99,lv.nodig+8)?1:0)+(bed>=Math.min(100,lv.nodig+15)||bed>=97?1:0);const nieuw=Math.max(0,ster-(v.s[li]|0));v.s[li]=Math.max(v.s[li]|0,ster);const gal=lv.beloning+nieuw*5;S.galjoenen+=gal;bewaar();try{stats()}catch(e){}
   speel('tover');setTimeout(()=>{if(!(window.zwSpeel&&zwSpeel('stem-flipendo',1))){try{if(!S.stil&&S.geluid!==false){const u=new SpeechSynthesisUtterance('Flipendo!');u.lang='en-GB';u.rate=.9;speechSynthesis.speak(u)}}catch(e){}}},300);setTimeout(()=>speel(rnd('lof',9)),1500);vier(true);setTimeout(golf,RM?200:1300);
   $('#splmsg').innerHTML=`Flipendo! ${bed}% · ${'★'.repeat(ster)} · +${gal} Smekkies`;knop.innerHTML=`${li<2?`<button class="knop volgende" onclick="ga('spreukles',${li+1})">Volgende les</button> `:''}<button class="knop" onclick="ga('spreukles',${li})">Nog eens</button> <button class="knop" onclick="ga('spreuken')">Terug</button>`}
  else{speel(rnd('aanm',6));vier(false);$('#splmsg').innerHTML=(why=='inkt'?'De inkt is op! ':'')+`${bed}% bedekt, je had ${lv.nodig}% nodig. Bijna! Probeer het nog eens.`;knop.innerHTML=`<button class="knop volgende" onclick="ga('spreukles',${li})">Opnieuw</button> <button class="knop" onclick="ga('spreuken')">Terug</button>`}}
 const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const mini=(x,y,r,rot,kleur,a)=>{c.save();c.translate(x,y);c.rotate(rot);c.globalAlpha=a;c.strokeStyle=kleur;c.lineWidth=Math.max(1.8,r*.22);c.lineCap='round';c.beginPath();L.pad.forEach(([px,py],i)=>{const X=(px-.5)*r*2,Y=(py-.5)*r*2;i?c.lineTo(X,Y):c.moveTo(X,Y)});c.stroke();c.restore()};
 function vier(ok){const n0=performance.now(),D=ok?(RM?900:2200):1400,N=ok?(RM?10:48):6,ps=[],gl=[];
  for(let i=0;i<N;i++){const f=ok?i/(N-1):Math.random(),[x,y]=punt(f),a=Math.random()*6.28,v=40+Math.random()*60;ps.push({x,y,vx:Math.cos(a)*v*.6+(x-W/2)*.25,vy:ok?-60-Math.random()*70:10,d:ok?f*700:i*120,r:ok?10+Math.random()*9:11,rot:Math.random()*6,vr:(Math.random()-.5)*5})}
  if(ok&&!RM)for(let i=0;i<14;i++){const [x,y]=punt(Math.random());gl.push({x:x+(Math.random()-.5)*T,y:y+(Math.random()-.5)*T,d:300+Math.random()*1400})}
  (function stap(n){const t=n-n0;if(!document.body.contains(cv))return;teken();
   if(ok){const g=Math.min(1,t/900);if(g<1||t<1200){const al=t<900?.35:.35*(1-(t-900)/300);c.save();c.lineCap=c.lineJoin='round';c.lineWidth=T*.9;c.strokeStyle=`rgba(255,215,120,${Math.max(0,al)})`;c.beginPath();for(let k=0;k<=60*g;k++){const [x,y]=punt(k/60);k?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();c.restore()}
    if(!RM&&t>200&&t<1300){const k=(t-200)/1100,[cx,cy]=punt(.5);c.save();c.strokeStyle=`rgba(255,230,170,${.4*(1-k)})`;c.lineWidth=3;c.beginPath();c.arc(W/2,H*.5,30+k*W*.55,0,7);c.stroke();c.restore()}
    gl.forEach(s=>{const k=(t-s.d)/500;if(k<0||k>1)return;const r=4*Math.sin(k*Math.PI);c.save();c.globalAlpha=.7*Math.sin(k*Math.PI);c.fillStyle='#ffe9a8';c.translate(s.x,s.y);c.beginPath();for(let j=0;j<8;j++){const rr=j%2?r*.35:r*1.6,aa=j*Math.PI/4;c.lineTo(Math.cos(aa)*rr,Math.sin(aa)*rr)}c.fill();c.restore()})}
   ps.forEach(p=>{const k=(t-p.d)/1000;if(k<0||k>1)return;const x=p.x+p.vx*k,y=p.y+p.vy*k+(ok?110:160)*k*k,s=ok?(1-k*.7):1;mini(x,y,p.r*s,p.rot+p.vr*k,ok?'#f3cf6b':'#9a9a9a',(ok?.85:.6)*(1-k))});
   if(t<D)requestAnimationFrame(stap);else teken()})(n0)}
 function golf(){const b=document.createElement('div');b.className='spl-boek';b.textContent='📕';cv.parentElement.appendChild(b);const g=document.createElement('div');g.className='spl-golf';cv.parentElement.appendChild(g);setTimeout(()=>{b.remove();g.remove()},1800)}
};
const _h=V.home;V.home=(...a)=>{const r=_h(...a);try{if(!document.getElementById('halspreuk'))$('#app').insertAdjacentHTML('beforeend',`<div style="text-align:center;margin:1em 0"><button class="knop volgende" id="halspreuk" onclick="ga('spreuken')">🪄 Spreuklessen</button></div>`)}catch(e){}return r};
const _m=V.meer;V.meer=(...a)=>{const r=_m(...a);try{const h=document.querySelector('#app h1,#app h2');if(h&&!document.getElementById('meerspreuk'))h.insertAdjacentHTML('afterend',`<button class="knop volgende" id="meerspreuk" onclick="ga('spreuken')">🪄 Spreuklessen</button>`)}catch(e){}return r};
})();
