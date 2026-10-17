'use strict';
/* Spreuklessen: Flipendo. Teken het gebaar na; score = bedekking, inkt = 110% van het teken. */
(()=>{
const LES={flipendo:{naam:'Flipendo',uitleg:'Een duw-spreuk: hij stoot dingen weg.',
 /* benadering van het Flipendo-gebaar uit de game: zigzag met krul aan het eind */
 pad:[[.2,.2],[.5,.16],[.8,.22],[.55,.42],[.3,.6],[.55,.62],[.8,.66],[.78,.8],[.62,.86],[.5,.78]],
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
 const cv=$('#splc'),W=Math.min(innerWidth-16,520),H=Math.round(W*1.05),dpr=devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';const c=cv.getContext('2d');c.scale(dpr,dpr);
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
  const st=T*.45;for(let d=0;d<=lengte;d+=st){const [x,y]=punt(d/lengte);c.fillStyle='rgba(235,240,255,.28)';c.beginPath();c.ellipse(x,y,T*.55,T*.42,0,0,7);c.fill()}
  const [sx,sy]=P[0];c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.arc(sx,sy,T*.28,0,7);c.fill();c.font=`${T*.7}px serif`;c.fillText('🪄',sx-T*1.1,sy+T*.25);
  const [ax,ay]=punt(.06),[bx,by]=punt(.12),an=Math.atan2(by-ay,bx-ax);c.save();c.translate(bx,by);c.rotate(an);c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.moveTo(T*.35,0);c.lineTo(-T*.2,-T*.25);c.lineTo(-T*.2,T*.25);c.fill();c.restore();
  c.lineCap=c.lineJoin='round';c.lineWidth=T;c.strokeStyle='rgba(255,60,50,.38)';c.shadowColor='rgba(255,40,30,.8)';c.shadowBlur=12;lijnen.forEach(l=>{c.beginPath();l.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.stroke()});c.shadowBlur=0;
  if(fase=='demo'){const [x,y]=punt(Math.min(1,demoT));const g=c.createRadialGradient(x,y,0,x,y,T);g.addColorStop(0,'rgba(255,255,230,1)');g.addColorStop(1,'rgba(255,255,200,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,T,0,7);c.fill()}}
 const meet=()=>{const d=ux.getImageData(0,0,mw,mh).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>128&&td[i]>128)n++;bed=Math.round(n/opp*100);$('#splbed').textContent=bed+'%'};
 const inktUI=()=>{const r=Math.max(0,110-inkt);$('#splinkt').textContent=Math.round(r)+'%';$('#splinktb').style.width=(r/110*100)+'%'};
 teken();speel('stem-flipendo-q');
 const ds=performance.now();(function anim(n){if(fase!='demo')return;demoT=(n-ds)/2200;teken();if(demoT<1.15)requestAnimationFrame(anim);else{fase='teken';t0=Date.now();$('#splmsg').textContent='Nu jij! Begin bij de toverstok.';teken();tik()}})(ds);
 let tmr;const tik=()=>{tmr=setInterval(()=>{if(!document.body.contains(cv))return clearInterval(tmr);const r=lv.tijd-Math.floor((Date.now()-t0)/1000);$('#spltijd').textContent=Math.max(0,r);if(r<=0)klaar()},250)};
 const pos=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
 cv.onpointerdown=e=>{if(fase!='teken'||inkt>=110)return;cv.setPointerCapture(e.pointerId);huidig=[pos(e)];lijnen.push(huidig)};
 cv.onpointermove=e=>{if(!huidig||fase!='teken')return;const p=pos(e),q=huidig[huidig.length-1],d=Math.hypot(p[0]-q[0],p[1]-q[1]);if(d<2)return;inkt+=d*T/(opp/sc/sc)*100;huidig.push(p);ux.beginPath();ux.moveTo(...q);ux.lineTo(...p);ux.stroke();teken();inktUI();if(huidig.length%3==0)meet();if(inkt>=110){huidig=null;meet();klaar('inkt')}};
 cv.onpointerup=cv.onpointercancel=()=>{if(huidig){huidig=null;meet();if(bed>=lv.nodig&&bed>=98)klaar()}};
 const knop=$('.spl-knop');knop.insertAdjacentHTML('afterbegin','<button class="knop volgende" id="splklaar">Klaar!</button> ');$('#splklaar').onclick=()=>fase=='teken'&&klaar();
 function klaar(why){if(fase!='teken')return;fase='uit';clearInterval(tmr);meet();const ok=bed>=lv.nodig;const v=sp().flipendo=sp().flipendo||{s:[]};
  if(ok){const ster=1+(bed>=Math.min(99,lv.nodig+8)?1:0)+(bed>=Math.min(100,lv.nodig+15)||bed>=97?1:0);const nieuw=Math.max(0,ster-(v.s[li]|0));v.s[li]=Math.max(v.s[li]|0,ster);const gal=lv.beloning+nieuw*5;S.galjoenen+=gal;bewaar();try{stats()}catch(e){}
   speel('spreuk');setTimeout(()=>speel('stem-flipendo'),150);setTimeout(()=>speel(rnd('lof',9)),1500);golf();
   $('#splmsg').innerHTML=`Flipendo! ${bed}% bedekt. ${'★'.repeat(ster)} +${gal} Smekkies`;knop.innerHTML=`${li<2?`<button class="knop volgende" onclick="ga('spreukles',${li+1})">Volgende les</button> `:''}<button class="knop" onclick="ga('spreukles',${li})">Nog eens</button> <button class="knop" onclick="ga('spreuken')">Terug</button>`}
  else{speel(rnd('aanm',6));$('#splmsg').innerHTML=(why=='inkt'?'De inkt is op! ':'')+`${bed}% bedekt, je had ${lv.nodig}% nodig. Bijna! Probeer het nog eens.`;knop.innerHTML=`<button class="knop volgende" onclick="ga('spreukles',${li})">Opnieuw</button> <button class="knop" onclick="ga('spreuken')">Terug</button>`}}
 function golf(){const b=document.createElement('div');b.className='spl-boek';b.textContent='📕';cv.parentElement.appendChild(b);const g=document.createElement('div');g.className='spl-golf';cv.parentElement.appendChild(g);setTimeout(()=>{b.remove();g.remove()},1800)}
};
const _h=V.home;V.home=(...a)=>{const r=_h(...a);try{if(!document.getElementById('halspreuk'))$('#app').insertAdjacentHTML('beforeend',`<div style="text-align:center;margin:1em 0"><button class="knop volgende" id="halspreuk" onclick="ga('spreuken')">🪄 Spreuklessen</button></div>`)}catch(e){}return r};
const _m=V.meer;V.meer=(...a)=>{const r=_m(...a);try{const h=document.querySelector('#app h1,#app h2');if(h&&!document.getElementById('meerspreuk'))h.insertAdjacentHTML('afterend',`<button class="knop volgende" id="meerspreuk" onclick="ga('spreuken')">🪄 Spreuklessen</button>`)}catch(e){}return r};
})();
