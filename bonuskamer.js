'use strict';
/* Smekkies-bonuskamer: 3/4-bovenaanzicht, joystick, Smekkies rapen, kisten openen (Alohomora), Spongify-kussens om op het podium te springen. */
(function(){
const T=48,RW=16*T,RH=22*T,WAND=96,DUUR=60;
const SK=['#ff5a6a','#ffb43a','#ffe24a','#6ad86a','#4ab8ff','#b07aff','#ff8ad8','#f4f0e0','#8a5a3a'];
const POD={x:10*T,y:WAND+T*.6,w:5.4*T,h:4.2*T,f:34}; // verhoogd podium (rechtsboven), f = voorkant
const snd=(k,v)=>{try{if(window.zwSpeel&&zwSpeel(k,v))return}catch(e){}try{fx.speel(k=='kist'?'goed':k=='spreuk'?'tover':k=='pluis'?'whoosh':k)}catch(e){}};
const rustig=matchMedia('(prefers-reduced-motion: reduce)').matches;
let G=null;
S.bonusKamer=S.bonusKamer||{gebruikt:0};
window.bonusKamerOpen=()=>Math.max(0,Math.floor(((S.m3lvl|0)-1)/100)-(S.bonusKamer.gebruikt|0));
V.bonuskamer=(test)=>{stop();const a=$('#app');a.innerHTML=`<div class="bk" id="bk"><canvas id="bkc"></canvas>
 <div class="bk-hud"><button class="bk-stop" id="bkstop">✕</button><div class="bk-tijd"><i id="bktijd"></i><span id="bktijdt">60</span></div><div class="bk-teller"><span class="bk-boon"></span><b id="bkn">0</b></div></div>
 <div class="bk-combo" id="bkcombo"></div><button class="bk-spreuk" id="bkspreuk"><span>🪄</span><b id="bkspt">Spreuk</b></button>
 <div class="bk-joy" id="bkjoy"><i></i></div><div class="bk-kaart" id="bkkaart"></div>
 <div class="bk-intro" id="bkintro"><div class="bk-perk"><h2>Smekkies-bonuskamer</h2><p>Verzamel in <b>60 seconden</b> zoveel mogelijk Smekkies van Smekkie Bott!</p>
 <ul><li>Links op het scherm: duim neerzetten en schuiven om te lopen. Of tik ergens op de vloer.</li><li>Bij een kist: tik op de spreukknop voor <b>Alohomora</b>.</li><li>Bij een kussen: <b>Spongify</b>. Loop erop en spring naar het podium!</li><li>Snel achter elkaar toveren geeft een combo.</li></ul><button class="knop volgende" id="bkstart">Start!</button></div></div></div>`;
 G=bouw(!!test);const cv=$('#bkc');cv.onpointerdown=neer;cv.onpointermove=beweeg;cv.onpointerup=cv.onpointercancel=los;
 $('#bkspreuk').onpointerdown=e=>{e.preventDefault();e.stopPropagation();tover()};$('#bkstop').onclick=()=>{if(G&&G.fase=='spel')einde();else{stop();ga('home')}};
 $('#bkstart').onclick=()=>{$('#bkintro').remove();G.fase='spel';G.t0=performance.now();if(!G.test){S.bonusKamer.gebruikt=(S.bonusKamer.gebruikt|0)+1;bewaar()}snd('whoosh')};
 addEventListener('resize',maat);maat();G.raf=requestAnimationFrame(frame)};
function stop(){if(G&&G.raf)cancelAnimationFrame(G.raf);removeEventListener('resize',maat);G=null}
function maat(){if(!G)return;const cv=$('#bkc');if(!cv)return;const d=Math.min(2,devicePixelRatio||1);G.W=innerWidth;G.H=innerHeight;G.d=d;cv.width=G.W*d;cv.height=G.H*d;cv.style.width=G.W+'px';cv.style.height=G.H+'px';G.s=Math.max(.62,Math.min(1.15,G.W/(9.2*T)))}

/* ---------- kamer opbouwen ---------- */
function bouw(test){const g={test,fase:'intro',tijd:DUUR,n:0,kisten:0,combo:0,bestCombo:0,lastCast:0,p:{x:4*T,y:12*T,vx:0,vy:0,dir:'o',stap:0,z:0,hoog:false,sprong:null},bonen:[],kist:[],kus:[],zuil:[],part:[],ringen:[],joy:null,doel:null,kaart:null,cam:{x:0,y:0}};
 let r=7;const rnd=()=>{r=(r*16807)%2147483647;return r/2147483647};
 g.zuil=[{x:3*T,y:7*T},{x:3*T,y:17*T},{x:8*T,y:12.5*T}].map(z=>({...z,r:20}));
 g.kist=[{x:6*T,y:6.5*T},{x:13*T,y:11*T},{x:2.2*T,y:20*T},{x:12.5*T,y:19.5*T},{x:7.2*T,y:16.3*T},{x:POD.x+POD.w*.72,y:POD.y+POD.h*.55,hoog:true,speciaal:true}].map(k=>({...k,open:0,t:0}));
 g.kus=[{x:POD.x+.9*T,y:POD.y+POD.h+POD.f+T*.9},{x:POD.x+POD.w-1.1*T,y:POD.y+POD.h+POD.f+T*.9}].map(k=>({...k,actief:false,t:0,wob:0}));
 const vrij=(x,y,h)=>!botst(g,x,y,12,h)&&Math.hypot(x-g.p.x,y-g.p.y)>60;
 for(let i=0;i<46;i++){for(let k=0;k<30;k++){const x=T*.8+rnd()*(RW-T*1.6),y=WAND+T*.5+rnd()*(RH-WAND-T*1.3);if(vrij(x,y,false)){g.bonen.push(boon(x,y,false,rnd));break}}}
 for(let i=0;i<14;i++){const x=POD.x+20+rnd()*(POD.w-40),y=POD.y+16+rnd()*(POD.h-30);g.bonen.push(boon(x,y,true,rnd))}
 g.bonen.push(Object.assign(boon(POD.x+POD.w*.3,POD.y+POD.h*.4,true,rnd),{goud:true,w:10}));return g}
function boon(x,y,hoog,rnd){rnd=rnd||Math.random;return {x,y,z:0,vz:0,hoog,k:SK[(rnd()*SK.length)|0],w:1,ph:rnd()*6.28,rot:rnd()*3}}
function inPod(x,y,m){m=m||0;return x>POD.x-m&&x<POD.x+POD.w+m&&y>POD.y-m&&y<POD.y+POD.h+POD.f+m}
function botst(g,x,y,r,hoog){if(x<T*.5+r||x>RW-T*.5-r||y<WAND+r*.5||y>RH-T*.5-r)return true;
 if(!hoog&&inPod(x,y,r))return true;
 for(const z of g.zuil)if(!hoog&&Math.hypot(x-z.x,(y-z.y)*1.3)<z.r+r)return true;
 for(const k of g.kist)if(!!k.hoog==!!hoog&&Math.abs(x-k.x)<22+r&&Math.abs(y-k.y)<12+r*.6)return true;return false}

/* ---------- invoer ---------- */
function scherm2wereld(x,y){return {x:x/G.s+G.cam.x,y:y/G.s+G.cam.y}}
function neer(e){if(!G||G.fase!='spel')return;try{e.target.setPointerCapture(e.pointerId)}catch(x){}
 const w=scherm2wereld(e.clientX,e.clientY);const doelObj=dichtbij(w.x,w.y,40);if(doelObj&&Math.hypot(doelObj.x-G.p.x,doelObj.y-G.p.y)<110){tover(doelObj);return}
 if(e.clientX<G.W*.55){G.joy={id:e.pointerId,x0:e.clientX,y0:e.clientY,x:e.clientX,y:e.clientY};G.doel=null;toonJoy()}else G.doel=w}
function beweeg(e){if(G&&G.joy&&G.joy.id==e.pointerId){G.joy.x=e.clientX;G.joy.y=e.clientY;toonJoy()}}
function los(e){if(G&&G.joy&&G.joy.id==e.pointerId){G.joy=null;toonJoy()}}
function toonJoy(){const j=$('#bkjoy');if(!j)return;if(!G.joy){j.classList.remove('aan');return}j.classList.add('aan');j.style.left=G.joy.x0+'px';j.style.top=G.joy.y0+'px';let dx=G.joy.x-G.joy.x0,dy=G.joy.y-G.joy.y0;const m=Math.hypot(dx,dy);if(m>48){dx*=48/m;dy*=48/m}j.firstChild.style.transform=`translate(${dx}px,${dy}px)`}
function dichtbij(x,y,max){let best=null,bd=max;for(const k of G.kist){if(k.open||!!k.hoog!=G.p.hoog)continue;const d=Math.hypot(k.x-x,k.y-y);if(d<bd){bd=d;best=k}}for(const k of G.kus){if(k.actief||G.p.hoog)continue;const d=Math.hypot(k.x-x,k.y-y);if(d<bd){bd=d;best=k}}return best}

/* ---------- toveren ---------- */
function tover(doel){if(!G||G.fase!='spel')return;const p=G.p;doel=doel||dichtbij(p.x,p.y,105);const nu=performance.now();
 const wx=p.x+(p.dir=='l'?-14:p.dir=='r'?14:8),wy=p.y-30;
 if(!doel){for(let i=0;i<8;i++)G.part.push({x:wx,y:wy,z:0,vx:(Math.random()-.5)*80,vy:(Math.random()-.5)*80,l:.6,k:'#fff3b0',s:2});snd('klik',.3);return}
 p.dir=Math.abs(doel.x-p.x)>Math.abs(doel.y-p.y)?(doel.x<p.x?'l':'r'):(doel.y<p.y?'b':'o');
 G.combo=nu-G.lastCast<2600?G.combo+1:1;G.lastCast=nu;G.bestCombo=Math.max(G.bestCombo,G.combo);
 const c=$('#bkcombo');if(c&&G.combo>1){c.textContent='Combo ×'+G.combo+'!';c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop')}
 G.ringen.push({x1:wx,y1:wy,x2:doel.x,y2:doel.y-14,t:0,k:doel.open!==undefined?'#ffd76a':'#9affc8'});snd('spreuk',.55);try{vib(15)}catch(e){}
 setTimeout(()=>{if(!G)return;if(doel.open!==undefined)openKist(doel);else{doel.actief=true;doel.wob=1;snd('pluis',.6);for(let i=0;i<14;i++)G.part.push({x:doel.x,y:doel.y,z:4,vx:(Math.random()-.5)*120,vy:(Math.random()-.5)*60,l:.9,k:'#9affc8',s:3})}},260)}
function openKist(k){if(k.open)return;k.open=1;k.t=0;G.kisten++;snd('kist',.8);const extra=Math.max(0,G.combo-1)*3,n=(k.speciaal?10:14)+extra;
 for(let i=0;i<n;i++){const a=Math.random()*6.283,v=50+Math.random()*90;const b=boon(k.x,k.y-6,!!k.hoog);b.z=20;b.vz=260+Math.random()*180;b.vx=Math.cos(a)*v;b.vy=Math.sin(a)*v*.7;b.vlieg=true;if(Math.random()<.08){b.goud=true;b.w=5}G.bonen.push(b)}
 for(let i=0;i<22;i++)G.part.push({x:k.x,y:k.y-10,z:10,vx:(Math.random()-.5)*160,vy:(Math.random()-.5)*100,l:1,k:i%2?'#fff3b0':'#ffd76a',s:2.5});
 if(k.speciaal)setTimeout(()=>chocokikker(k),500)}
function chocokikker(k){const pool=(window.KAARTEN||[]).filter(x=>x[3]);const kaart=pool.length?pool[Math.random()*pool.length|0]:null;G.tijd+=10;G.kaart=kaart?kaart[0]:'Chocokikker';
 if(kaart){S.kaarten=S.kaarten||{};S.kaarten[kaart[0]]=(S.kaarten[kaart[0]]||0)+1;bewaar()}const el=$('#bkkaart');if(el){el.innerHTML=`${kaart?`<img src="${kaart[3]}" alt="">`:''}<b>Chocokikkerkaart!</b><small>${kaart?kaart[0]:''}</small><i>Speciaal effect: +10 seconden</i>`;el.classList.add('aan');setTimeout(()=>el.classList.remove('aan'),3200)}snd('tover',.8)}

/* ---------- lus ---------- */
function frame(nu){if(!G||!$('#bkc')){stop();return}G.raf=requestAnimationFrame(frame);const dt=Math.min(.05,(nu-(G.tl||nu))/1000)||.016;G.tl=nu;
 if(G.fase=='spel'){G.tijd-=dt;if(G.tijd<=0){G.tijd=0;einde()}}stap(dt,nu);teken(nu)}
function stap(dt,nu){const p=G.p;let ix=0,iy=0;
 if(G.fase=='spel'){if(G.joy){ix=(G.joy.x-G.joy.x0)/48;iy=(G.joy.y-G.joy.y0)/48;const m=Math.hypot(ix,iy);if(m>1){ix/=m;iy/=m}if(m<.15){ix=iy=0}}
  else if(G.doel){const dx=G.doel.x-p.x,dy=G.doel.y-p.y,m=Math.hypot(dx,dy);if(m<8)G.doel=null;else{ix=dx/m;iy=dy/m}}}
 if(p.sprong){const s=p.sprong;s.t+=dt/s.d;const k=Math.min(1,s.t);p.x=s.x0+(s.x1-s.x0)*k;p.y=s.y0+(s.y1-s.y0)*k;p.z=Math.sin(k*Math.PI)*s.h+(k>.5?s.zEind*(k-.5)*2:0);if(k>=1){p.sprong=null;p.z=0;p.hoog=s.naarHoog;snd('klik',.4)}return}
 const sp=175;const tx=ix*sp,ty=iy*sp;p.vx+=(tx-p.vx)*Math.min(1,dt*12);p.vy+=(ty-p.vy)*Math.min(1,dt*12);
 const nx=p.x+p.vx*dt,ny=p.y+p.vy*dt;
 if(p.hoog){if(!inPod(nx,ny)||ny>POD.y+POD.h-6){/* van het podium af: spring naar beneden */if(Math.hypot(p.vx,p.vy)>40){const dx=p.vx,dy=p.vy,m=Math.hypot(dx,dy);let x1=p.x+dx/m*70,y1=p.y+dy/m*70;if(dy>0)y1=POD.y+POD.h+POD.f+26;if(dx<0&&nx<POD.x)x1=POD.x-26;if(dx>0&&nx>POD.x+POD.w)x1=Math.min(RW-T,POD.x+POD.w+26);if(!botst(G,x1,y1,14,false))p.sprong={x0:p.x,y0:p.y,x1,y1,t:0,d:.45,h:28,zEind:0,naarHoog:false};else{p.vx=p.vy=0}}}else{p.x=nx;p.y=ny}}
 else{if(!botst(G,nx,p.y,14,false))p.x=nx;else p.vx=0;if(!botst(G,p.x,ny,14,false))p.y=ny;else p.vy=0}
 const v=Math.hypot(p.vx,p.vy);if(v>20){p.stap+=dt*v/24;p.dir=Math.abs(p.vx)>Math.abs(p.vy)?(p.vx<0?'l':'r'):(p.vy<0?'b':'o')}else p.stap=0;
 // kussens
 for(const k of G.kus){k.wob=Math.max(0,k.wob-dt*1.2);if(k.actief&&!p.hoog&&!p.sprong&&Math.hypot(p.x-k.x,(p.y-k.y)*1.4)<26){const x1=Math.max(POD.x+30,Math.min(POD.x+POD.w-30,p.x)),y1=POD.y+POD.h*.6;p.sprong={x0:p.x,y0:p.y,x1,y1,t:0,d:.75,h:120,zEind:0,naarHoog:true};k.wob=1;snd('pluis',.7);try{vib([10,30,10])}catch(e){}G.p.vx=G.p.vy=0}}
 // bonen
 for(const b of G.bonen){if(b.weg)continue;if(b.vlieg){b.vz-=900*dt;b.z+=b.vz*dt;let nx2=b.x+b.vx*dt,ny2=b.y+b.vy*dt;if(!b.hoog&&inPod(nx2,ny2,4)){b.vx*=-.5;b.vy*=-.5;nx2=b.x;ny2=b.y}if(b.hoog&&!inPod(nx2,ny2,-6)){b.vx=0;b.vy=0;nx2=b.x;ny2=b.y}nx2=Math.max(T*.7,Math.min(RW-T*.7,nx2));ny2=Math.max(WAND+10,Math.min(RH-T*.7,ny2));b.x=nx2;b.y=ny2;if(b.z<=0){b.z=0;if(b.vz<-120){b.vz*=-.35;b.vx*=.5;b.vy*=.5}else{b.vlieg=false;b.vx=b.vy=0}}}
  if(G.fase=='spel'&&!!b.hoog==p.hoog&&!p.sprong&&b.z<10&&Math.hypot(b.x-p.x,(b.y-p.y)*1.3)<24){b.weg=1;G.n+=b.w;$('#bkn').textContent=G.n;snd('munt',.35);for(let i=0;i<5;i++)G.part.push({x:b.x,y:b.y,z:8,vx:(Math.random()-.5)*60,vy:-20-Math.random()*40,l:.5,k:b.k,s:2})}}
 if(G.bonen.length>400)G.bonen=G.bonen.filter(b=>!b.weg);
 for(const k of G.kist)k.t+=dt;
 G.part=G.part.filter(q=>{q.l-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;return q.l>0});G.ringen=G.ringen.filter(r=>(r.t+=dt*3.6)<1.4);
 const vw=G.W/G.s,vh=G.H/G.s;G.cam.x=Math.max(-20,Math.min(RW-vw+20,p.x-vw/2));G.cam.y=Math.max(-30,Math.min(RH-vh+40,p.y-vh*.55));if(RW<vw)G.cam.x=(RW-vw)/2;
 const tb=$('#bktijd');if(tb){tb.style.width=(G.tijd/DUUR*100)+'%';$('#bktijdt').textContent=Math.ceil(G.tijd)}
 const sb=$('#bkspt');if(sb){const d=dichtbij(p.x,p.y,105);sb.textContent=d?(d.open!==undefined?'Alohomora':'Spongify'):'Spreuk';$('#bkspreuk').classList.toggle('klaar',!!d)}}

/* ---------- tekenen ---------- */
let BG=null;const BS={};
function boonSprite(k){if(BS[k])return BS[k];const c=document.createElement('canvas');c.width=26;c.height=18;const x=c.getContext('2d');const g=x.createRadialGradient(9,6,1,13,9,12);g.addColorStop(0,'#fff');g.addColorStop(.25,k);g.addColorStop(1,shade(k,-.45));x.fillStyle=g;x.beginPath();x.ellipse(13,9,11,7,0,0,6.283);x.fill();x.strokeStyle=shade(k,-.5);x.lineWidth=1;x.stroke();x.fillStyle='rgba(255,255,255,.7)';x.beginPath();x.ellipse(9,6,3.5,1.8,-.4,0,6.283);x.fill();x.strokeStyle='rgba(0,0,0,.18)';x.beginPath();x.moveTo(13,4);x.quadraticCurveTo(15,9,13,14);x.stroke();return BS[k]=c}
function shade(h,f){const n=parseInt(h.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const t=f<0?0:255,p=Math.abs(f);r=Math.round((t-r)*p+r);g=Math.round((t-g)*p+g);b=Math.round((t-b)*p+b);return `rgb(${r},${g},${b})`}
function achtergrond(){if(BG)return BG;const c=document.createElement('canvas');c.width=RW;c.height=RH;const x=c.getContext('2d');
 x.fillStyle='#4a4038';x.fillRect(0,0,RW,RH);let s=3;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};
 for(let ty=WAND;ty<RH;ty+=T)for(let tx=0;tx<RW;tx+=T){const v=r()*.12;x.fillStyle=`rgb(${118+v*200|0},${108+v*180|0},${96+v*150|0})`;x.fillRect(tx+1,ty+1,T-2,T-2);x.fillStyle='rgba(255,255,255,.06)';x.fillRect(tx+1,ty+1,T-2,4);x.fillStyle='rgba(0,0,0,.12)';x.fillRect(tx+1,ty+T-5,T-2,4);if(r()<.25){x.strokeStyle='rgba(0,0,0,.15)';x.beginPath();x.moveTo(tx+r()*T,ty+r()*T);x.lineTo(tx+r()*T,ty+r()*T);x.stroke()}}
 // loper in het midden
 x.fillStyle='rgba(120,20,30,.55)';x.fillRect(5.6*T,WAND,3.8*T,RH-WAND);x.strokeStyle='rgba(230,180,70,.6)';x.lineWidth=3;x.strokeRect(5.8*T,WAND-2,3.4*T,RH-WAND);
 // achterwand
 for(let wy=0;wy<WAND;wy+=16)for(let wx=(wy/16%2)*20-20;wx<RW;wx+=40){const v=r()*.15;x.fillStyle=`rgb(${84+v*160|0},${76+v*140|0},${70+v*120|0})`;x.fillRect(wx+1,wy+1,38,14)}
 const gr=x.createLinearGradient(0,WAND-24,0,WAND);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.45)');x.fillStyle=gr;x.fillRect(0,WAND-24,RW,24);
 // banieren
 [[2,'#e3b23c','#1c1c1c'],[5,'#9c1b1b','#e3b23c'],[13.2,'#1a5a3a','#c9ced4'],[15,'#1d3a8a','#b07a3a']].forEach(([bx,a,b])=>{bx*=T;if(bx>RW-30)bx=RW-60;x.fillStyle=a;x.beginPath();x.moveTo(bx,8);x.lineTo(bx+34,8);x.lineTo(bx+34,70);x.lineTo(bx+17,82);x.lineTo(bx,70);x.closePath();x.fill();x.strokeStyle=b;x.lineWidth=3;x.stroke();x.fillStyle=b;x.beginPath();x.arc(bx+17,40,8,0,6.283);x.fill()});
 // zijmuren
 x.fillStyle='#2a221c';x.fillRect(0,0,T*.45,RH);x.fillRect(RW-T*.45,0,T*.45,RH);x.fillRect(0,RH-T*.45,RW,T*.45);
 // podium: voorkant + bovenkant
 x.fillStyle='#5a4e44';x.fillRect(POD.x,POD.y+POD.h,POD.w,POD.f);for(let i=0;i<POD.w;i+=24){x.fillStyle='rgba(0,0,0,.18)';x.fillRect(POD.x+i,POD.y+POD.h,1.5,POD.f)}
 x.fillStyle='rgba(0,0,0,.35)';x.fillRect(POD.x,POD.y+POD.h+POD.f,POD.w,10);
 for(let ty=0;ty<POD.h;ty+=T*.7)for(let tx=0;tx<POD.w;tx+=T*.7){const v=r()*.1;x.fillStyle=`rgb(${150+v*200|0},${138+v*180|0},${120+v*150|0})`;x.fillRect(POD.x+tx+1,POD.y+ty+1,Math.min(T*.7,POD.w-tx)-2,Math.min(T*.7,POD.h-ty)-2)}
 x.strokeStyle='#c9a24a';x.lineWidth=3;x.strokeRect(POD.x+1.5,POD.y+1.5,POD.w-3,POD.h-3);return BG=c}
function teken(nu){const cv=$('#bkc');const x=cv.getContext('2d');x.setTransform(G.d,0,0,G.d,0,0);x.fillStyle='#120e0c';x.fillRect(0,0,G.W,G.H);
 x.save();x.scale(G.s,G.s);x.translate(-G.cam.x,-G.cam.y);x.drawImage(achtergrond(),0,0);const t=nu/1000;
 // fakkels
 [[3.5],[8],[11.6]].forEach(([fx2])=>{const X=fx2*T,Y=46;x.fillStyle='#3a2a1a';x.fillRect(X-3,Y,6,22);const fl=1+.15*Math.sin(t*13+fx2)+.1*Math.sin(t*7.3);const g=x.createRadialGradient(X,Y-4,0,X,Y-4,70*fl);g.addColorStop(0,'rgba(255,170,60,.45)');g.addColorStop(1,'rgba(255,120,30,0)');x.fillStyle=g;x.fillRect(X-80,Y-80,160,170);x.fillStyle='#ffcf5a';x.beginPath();x.ellipse(X,Y-6,5*fl,10*fl,0,0,6.283);x.fill();x.fillStyle='#fff3c0';x.beginPath();x.ellipse(X,Y-4,2.4,5,0,0,6.283);x.fill()});
 // kussens (plat, onder alles)
 for(const k of G.kus){const w=1+k.wob*.15*Math.sin(t*30);x.save();x.translate(k.x,k.y);x.scale(w,2-w);x.fillStyle=k.actief?'#5ad8a0':'#7a8a7a';x.beginPath();x.ellipse(0,0,26,14,0,0,6.283);x.fill();x.strokeStyle=k.actief?'#c8ffe0':'#4a5a4a';x.lineWidth=3;x.stroke();
  x.fillStyle='rgba(255,255,255,.25)';for(let i=0;i<5;i++){x.beginPath();x.arc(-14+i*7,-2+Math.sin(i)*3,2.5,0,6.283);x.fill()}if(k.actief){x.globalAlpha=.35+.2*Math.sin(t*5);x.fillStyle='#9affc8';x.beginPath();x.ellipse(0,0,34,19,0,0,6.283);x.fill();x.globalAlpha=1}x.restore()}
 // diepte-gesorteerde objecten
 const L=[];G.bonen.forEach(b=>{if(!b.weg)L.push({y:b.y,f:()=>tekBoon(x,b,t)})});G.kist.forEach(k=>L.push({y:k.y,f:()=>tekKist(x,k,t)}));G.zuil.forEach(z=>L.push({y:z.y,f:()=>tekZuil(x,z)}));
 L.push({y:G.p.y+(G.p.sprong?60:0),f:()=>tekLuna(x,G.p,t)});L.sort((a,b)=>a.y-b.y).forEach(o=>o.f());
 for(const r of G.ringen){const k=Math.min(1,r.t);const X=r.x1+(r.x2-r.x1)*k,Y=r.y1+(r.y2-r.y1)*k-Math.sin(k*Math.PI)*30;x.fillStyle=r.k;x.globalAlpha=Math.max(0,1.4-r.t);x.beginPath();x.arc(X,Y,6,0,6.283);x.fill();x.globalAlpha=.4*Math.max(0,1.4-r.t);x.beginPath();x.arc(X,Y,13,0,6.283);x.fill();x.globalAlpha=1;if(r.t>1){x.strokeStyle=r.k;x.lineWidth=3;x.beginPath();x.ellipse(r.x2,r.y2+14,30*(r.t-.6),15*(r.t-.6),0,0,6.283);x.stroke()}}
 for(const q of G.part){x.globalAlpha=Math.max(0,Math.min(1,q.l*2));x.fillStyle=q.k;x.fillRect(q.x-q.s/2,q.y-(q.z||0)-q.s/2,q.s,q.s);}x.globalAlpha=1;x.restore()}
function schaduw(x,X,Y,rx,a){x.fillStyle=`rgba(0,0,0,${a||.28})`;x.beginPath();x.ellipse(X,Y,rx,rx*.42,0,0,6.283);x.fill()}
function tekBoon(x,b,t){const bob=b.vlieg?b.z:3+Math.sin(t*3+b.ph)*2.5;schaduw(x,b.x,b.y+2,b.goud?9:7,.22);const sp=boonSprite(b.goud?'#ffd34a':b.k);x.save();x.translate(b.x,b.y-bob-4);x.rotate(b.rot+(b.vlieg?t*8:0));const sc=b.goud?1.3:.9;x.drawImage(sp,-13*sc,-9*sc,26*sc,18*sc);x.restore();
 if(b.goud||(Math.sin(t*2+b.ph*3)>.97)){x.fillStyle='rgba(255,255,230,.9)';const s=b.goud?4+2*Math.sin(t*6):3;x.fillRect(b.x-s,b.y-bob-6,s*2,1.5);x.fillRect(b.x-.75,b.y-bob-6-s,1.5,s*2)}}
function tekZuil(x,z){schaduw(x,z.x,z.y+4,26,.3);const g=x.createLinearGradient(z.x-20,0,z.x+20,0);g.addColorStop(0,'#5a5048');g.addColorStop(.4,'#a89a88');g.addColorStop(1,'#4a4038');x.fillStyle=g;x.fillRect(z.x-18,z.y-120,36,120);x.fillStyle='#8a7c6c';x.fillRect(z.x-23,z.y-10,46,12);x.fillRect(z.x-23,z.y-128,46,12);x.fillStyle='rgba(0,0,0,.15)';for(let i=0;i<3;i++)x.fillRect(z.x-12+i*9,z.y-118,2,106)}
function tekKist(x,k,t){schaduw(x,k.x,k.y+4,28,.3);const X=k.x,Y=k.y;const o=Math.min(1,k.open?k.t*3:0);
 x.fillStyle=k.speciaal?'#6a3a8a':'#7a4a22';x.fillRect(X-24,Y-30,48,30);x.fillStyle=k.speciaal?'#e3b23c':'#c9a24a';x.fillRect(X-24,Y-30,48,4);x.fillRect(X-24,Y-4,48,4);x.fillRect(X-3,Y-22,6,10);
 x.save();x.translate(X,Y-30);x.rotate(-o*1.1);x.fillStyle=k.speciaal?'#7a4a9a':'#8a5a2a';x.beginPath();x.moveTo(-24,0);x.lineTo(24,0);x.lineTo(24,-10);x.quadraticCurveTo(0,-22,-24,-10);x.closePath();x.fill();x.strokeStyle=k.speciaal?'#e3b23c':'#c9a24a';x.lineWidth=3;x.stroke();x.restore();
 if(k.open&&k.t<1.2){x.globalAlpha=Math.max(0,1-k.t);const g=x.createRadialGradient(X,Y-30,0,X,Y-30,60);g.addColorStop(0,'rgba(255,240,170,.9)');g.addColorStop(1,'rgba(255,220,100,0)');x.fillStyle=g;x.fillRect(X-60,Y-90,120,90);x.globalAlpha=1}
 if(!k.open&&!!k.hoog==G.p.hoog&&Math.hypot(k.x-G.p.x,k.y-G.p.y)<105){x.strokeStyle=`rgba(255,215,106,${.5+.4*Math.sin(t*6)})`;x.lineWidth=2;x.strokeRect(X-28,Y-34,56,38)}}
function tekLuna(x,p,t){const X=p.x,Y=p.y,z=p.z||0;schaduw(x,X,Y+2,15*(1-Math.min(.5,z/240)),.3);const bob=Math.abs(Math.sin(p.stap*Math.PI))*2.5,Yb=Y-z-bob;const zij=p.dir=='l'?-1:p.dir=='r'?1:0,rug=p.dir=='b';
 // voetjes
 const st=Math.sin(p.stap*Math.PI);x.fillStyle='#2a1a10';x.beginPath();x.ellipse(X-5+(zij?st*4:0),Y-z-1+(zij?0:st*2),4,2.5,0,0,6.283);x.ellipse(X+5-(zij?st*4:0),Y-z-1-(zij?0:st*2),4,2.5,0,0,6.283);x.fill();
 // gewaad (zwart met gele rand, Huffelpuf)
 x.fillStyle='#1e1a22';x.beginPath();x.moveTo(X-13,Yb-4);x.quadraticCurveTo(X-11,Yb-24,X,Yb-28);x.quadraticCurveTo(X+11,Yb-24,X+13,Yb-4);x.closePath();x.fill();x.strokeStyle='#e8b923';x.lineWidth=2;x.beginPath();x.moveTo(X-13,Yb-4);x.lineTo(X+13,Yb-4);x.stroke();
 if(!rug){x.fillStyle='#e8b923';x.beginPath();x.moveTo(X-3,Yb-26);x.lineTo(X+3,Yb-26);x.lineTo(X+2,Yb-12);x.lineTo(X-2,Yb-12);x.fill();x.fillStyle='#1c1c1c';x.fillRect(X-2,Yb-22,4,2);x.fillRect(X-2,Yb-17,4,2)}
 // arm + toverstok
 const ax=X+(zij||1)*10,ay=Yb-16;x.strokeStyle='#1e1a22';x.lineWidth=5;x.lineCap='round';x.beginPath();x.moveTo(X+(zij||1)*7,Yb-22);x.lineTo(ax,ay);x.stroke();x.fillStyle='#f1c9a5';x.beginPath();x.arc(ax,ay,3,0,6.283);x.fill();
 x.strokeStyle='#6a4020';x.lineWidth=2.4;x.beginPath();x.moveTo(ax,ay);x.lineTo(ax+(zij||1)*12,ay-8);x.stroke();if(performance.now()-G.lastCast<400){x.fillStyle='#fff3b0';x.beginPath();x.arc(ax+(zij||1)*13,ay-9,4,0,6.283);x.fill()}
 // hoofd
 const hy=Yb-36;x.fillStyle='#5a3418';x.beginPath();x.arc(X,hy+1,12,0,6.283);x.fill();
 if(!rug){x.fillStyle='#f6d2b0';x.beginPath();x.arc(X+zij*2,hy+2,9.5,0,6.283);x.fill();if(zij>=0||zij<=0){x.fillStyle='#2a1a10';const ox=zij*3;x.beginPath();x.arc(X-3.5+ox,hy+2,1.6,0,6.283);x.arc(X+3.5+ox,hy+2,1.6,0,6.283);x.fill();x.fillStyle='rgba(255,120,120,.45)';x.beginPath();x.arc(X-6+ox,hy+5.5,2,0,6.283);x.arc(X+6+ox,hy+5.5,2,0,6.283);x.fill();x.strokeStyle='#8a4a3a';x.lineWidth=1;x.beginPath();x.arc(X+ox,hy+5.5,2,.2,Math.PI-.2);x.stroke()}
  x.fillStyle='#5a3418';x.beginPath();x.ellipse(X-zij*2,hy-6,11,5,0,0,6.283);x.fill()}
 // hoed
 x.fillStyle='#1a1620';x.beginPath();x.ellipse(X,hy-8,16,4.5,0,0,6.283);x.fill();x.beginPath();x.moveTo(X-9,hy-9);x.quadraticCurveTo(X-2,hy-22,X+5-zij*2,hy-34);x.quadraticCurveTo(X+4,hy-20,X+9,hy-9);x.closePath();x.fill();x.fillStyle='#e8b923';x.fillRect(X-9,hy-12,18,3)}

/* ---------- einde ---------- */
function einde(){if(!G||G.fase=='klaar')return;G.fase='klaar';G.joy=null;toonJoy();const n=G.n;S.galjoenen=(S.galjoenen|0)+n;S.bonusKamer.beste=Math.max(S.bonusKamer.beste|0,n);bewaar();try{stats()}catch(e){}snd('fanfare',.7);setTimeout(()=>snd('tover',.6),600);
 const o=document.createElement('div');o.className='bk-intro';o.innerHTML=`<div class="bk-perk"><h2>Tijd is om!</h2><p class="bk-groot"><span class="bk-boon"></span> ${n} Smekkies</p><p>${G.kisten} ${G.kisten==1?'kist':'kisten'} geopend · beste combo ×${G.bestCombo||0}${G.kaart?` · Chocokikkerkaart: ${G.kaart}`:''}</p><p class="klein">De Smekkies staan bij je totaal. Beste ooit: ${S.bonusKamer.beste}</p><button class="knop volgende" id="bkklaar">Terug naar De Hal</button></div>`;
 $('#bk').appendChild(o);$('#bkklaar').onclick=()=>{stop();ga('home')}}

/* ---------- ingangen: De Hal (na elke 100 levels) + makerscherm ---------- */
const _home=V.home;V.home=(...a)=>{const r=_home(...a);try{const n=bonusKamerOpen();if(n>0&&!document.getElementById('bkhal')){const na=document.querySelector('.hp-zaal')||document.querySelector('.halspel');const h=`<button class="knop volgende bkhal" id="bkhal" onclick="ga('bonuskamer')">🍬 De Smekkies-bonuskamer is open!${n>1?' (×'+n+')':''}</button>`;if(na)na.insertAdjacentHTML('afterend',h);else $('#app').insertAdjacentHTML('beforeend',h)}}catch(e){}return r};
const _mk=V.maker;if(_mk)V.maker=(...a)=>{const r=_mk(...a);$('#app').insertAdjacentHTML('beforeend',`<section class="kaart sierlijst"><h3>Smekkies-bonuskamer (test)</h3><p class="klein">Telt niet als gebruikt. Open na elke 100 levels: nu ${bonusKamerOpen()} keer beschikbaar.</p><button class="knop" onclick="ga('bonuskamer',1)">Probeer de bonuskamer</button></section>`);return r};
window.bonusTest={get G(){return G}};
})();
