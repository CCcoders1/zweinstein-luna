'use strict';
/* Smekkies-bonuskamer: lange gang in 3/4-bovenaanzicht met zijkamers achter deuren (Alohomora), vaste joystick, kisten, Spongify-kussens naar podia. */
(function(){
const T=48,COLS=24,ROWS=64,RW=COLS*T,RH=ROWS*T,DUUR=90;
const SK=['#ff5a6a','#ffb43a','#ffe24a','#6ad86a','#4ab8ff','#b07aff','#ff8ad8','#f4f0e0','#8a5a3a'];
const FB={kist:'goed',spreuk:'tover',pluis:'whoosh','verr-deur1':'kras','verr-deur2':'kras'};
const snd=(k,v)=>{try{if(window.zwSpeel&&zwSpeel(k,v))return}catch(e){}try{fx.speel(FB[k]||k)}catch(e){}};
const stil=()=>S.geluid===false||S.stil;
/* Harry roept 'Alohomora' (pakket), hooguit eens per 3 s. Alleen als de stem ontbreekt: spraaksynthese. */
let stemT=0;function stem(){if(stil()||S.stemmen===false)return;const n=performance.now();if(n-stemT<3000)return;stemT=n;let ok=false;
 try{ok=!!(window.zwSpeel&&((Math.random()<.5&&zwSpeel('stem-alohomora2',.8))||zwSpeel('stem-alohomora',.8)))}catch(e){}
 if(!ok){try{const u=new SpeechSynthesisUtterance('Alohomora');u.lang='en-GB';u.rate=.85;u.pitch=1.1;u.volume=.8;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}}
/* zacht 'plop' per Smekkie die uit de kist springt (klein synthgeluidje, telkens iets hoger) */
let AC=null;function plop(i){if(stil())return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state=='suspended')AC.resume();const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain(),f=520+Math.min(i,18)*36+Math.random()*30,v=.09*(S.fxVol==null?.8:S.fxVol)/.8;
 o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.9,t+.05);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.008);g.gain.exponentialRampToValueAtTime(.0005,t+.11);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+.12)}catch(e){}}
let G=null;
S.bonusKamer=S.bonusKamer||{gebruikt:0};
window.bonusKamerOpen=()=>Math.max(0,Math.floor(((S.m3lvl|0)-1)/100)-(S.bonusKamer.gebruikt|0));
V.bonuskamer=(test)=>{stop();const a=$('#app');a.innerHTML=`<div class="bk" id="bk"><canvas id="bkc"></canvas>
 <div class="bk-hud"><button class="bk-stop" id="bkstop">✕</button><div class="bk-tijd"><i id="bktijd"></i><span id="bktijdt">${DUUR}</span></div><div class="bk-teller"><span class="bk-boon"></span><b id="bkn">0</b></div></div>
 <div class="bk-combo" id="bkcombo"></div>
 <div class="bk-joy" id="bkjoy"><i></i></div><div class="bk-kaart" id="bkkaart"></div>
 <div class="bk-intro" id="bkintro"><div class="bk-perk"><h2>Smekkies-bonuskamer</h2><p>Verzamel in <b>${DUUR} seconden</b> zoveel mogelijk Smekkies in de lange gang van Zweinstein!</p>
 <ul><li>Lopen: zet je duim ergens op het scherm en schuif in een richting. Of tik kort op de vloer.</li><li>Bij een kist of een deur: tik erop voor <b>Alohomora</b> (staat ze te ver weg, dan loopt ze er eerst heen). Achter de deuren liggen kamers vol Smekkies.</li><li>Bij een geel-roze kussen: <b>Spongify</b>. Loop erop en spring naar het podium!</li><li>Snel achter elkaar toveren geeft een combo.</li></ul><button class="knop volgende" id="bkstart">Start!</button></div></div></div>`;
 G=bouw(!!test);const cv=$('#bkc');cv.onpointerdown=neer;cv.onpointermove=beweeg;cv.onpointerup=cv.onpointercancel=los;
 $('#bkstop').onclick=()=>{if(G&&G.fase=='spel')einde();else{stop();ga('home')}};
 $('#bkstart').onclick=()=>{$('#bkintro').remove();G.fase='spel';G.t0=performance.now();if(!G.test){S.bonusKamer.gebruikt=(S.bonusKamer.gebruikt|0)+1;bewaar()}snd('whoosh')};
 addEventListener('resize',maat);maat();G.raf=requestAnimationFrame(frame)};
function stop(){if(G&&G.raf)cancelAnimationFrame(G.raf);removeEventListener('resize',maat);G=null;BG=null}
function maat(){if(!G)return;const cv=$('#bkc');if(!cv)return;const d=Math.min(2,devicePixelRatio||1);G.W=innerWidth;G.H=innerHeight;G.d=d;cv.width=G.W*d;cv.height=G.H*d;cv.style.width=G.W+'px';cv.style.height=G.H+'px';G.s=Math.max(.62,Math.min(1.15,G.W/(9.2*T)))}

/* ---------- gang + zijkamers opbouwen (tegelraster) ----------
 0 muur · 1 vloer · 10+i deur i · 20+j podium j (boven) · 30+j podiumvoorkant j */
const NIS=[{kant:'l',R:50},{kant:'r',R:38},{kant:'l',R:26},{kant:'r',R:14}];
function bouw(test){const grid=[];for(let r=0;r<ROWS;r++)grid.push(new Array(COLS).fill(0));
 const vul=(c0,c1,r0,r1,v)=>{for(let r=r0;r<=r1;r++)for(let c=c0;c<=c1;c++)grid[r][c]=v};
 const g={test,fase:'intro',tijd:DUUR,n:0,kisten:0,deurOpen:0,combo:0,bestCombo:0,lastCast:0,grid,p:{x:11.5*T,y:60.5*T,vx:0,vy:0,dir:'b',stap:0,z:0,lv:0,sprong:null},bonen:[],kist:[],kus:[],zuil:[],deuren:[],kamers:[],pods:[],fakkels:[],part:[],ringen:[],joy:null,doel:null,kaart:null,cam:{x:0,y:0}};
 vul(8,15,2,62,1);
 NIS.forEach((a,i)=>{const c0=a.kant=='l'?1:17,c1=a.kant=='l'?6:22,cg=a.kant=='l'?7:16,dc=a.kant=='l'?3:20;
  vul(c0,c1,a.R,a.R+2,1);vul(cg,cg,a.R,a.R+2,1);vul(c0,c1,a.R-7,a.R-3,1);grid[a.R-2][dc]=10+i;grid[a.R-1][dc]=10+i;
  g.deuren.push({i,c:dc,r0:a.R-2,x:(dc+.5)*T,y:a.R*T+4,open:0,t:0});g.kamers.push({x:(c0-1)*T,y:(a.R-9)*T,w:(c1-c0+3)*T,h:7*T,deur:i});
  g.fakkels.push({x:(c0+.7)*T,y:(a.R-2)*T+16},{x:(c1+.3)*T,y:(a.R-2)*T+16},{x:((c0+c1+1)/2)*T,y:(a.R-9)*T+16})});
 g.pods=[{c0:12,c1:15,r0:44,r1:46},{c0:8,c1:11,r0:20,r1:22}];
 g.pods.forEach((P,j)=>{vul(P.c0,P.c1,P.r0,P.r1,20+j);vul(P.c0,P.c1,P.r1+1,P.r1+1,30+j);Object.assign(P,{x:P.c0*T,y:P.r0*T,w:(P.c1-P.c0+1)*T,h:(P.r1-P.r0+1)*T,lv:j+1})});
 g.kus=[[12.7,49,0],[14.7,49,0],[8.9,25,1],[10.9,25,1]].map(([c,r,pod])=>({x:c*T,y:r*T,pod,actief:false,t:0,wob:0}));
 g.zuil=[[8.6,56],[15.4,56],[8.6,34],[15.4,30],[8.6,10],[15.4,8]].map(([c,r])=>({x:c*T,y:r*T,r:20}));
 g.fakkels.push({x:9.5*T,y:T*.4+12},{x:14.5*T,y:T*.4+12});
 g.kist=[[10,58],[13.5,52.5],[9.4,41],[14,32],[11.5,37],[10.2,15.5],[13,6],[14.3,45.8,1],[9.6,21.8,2],
  [1.8,44.6],[5.4,46.2],[18.4,33],[21.8,34.6],[1.8,20.6],[5.4,22.2],[18.4,8.6],[21.6,9.8,0,1]].map(([c,r,lv,sp])=>({x:c*T,y:r*T,lv:lv|0,speciaal:!!sp,open:0,t:0,rest:0,tk:0,nr:0}));
 let s=7;const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647};
 const strooi=(n,x0,y0,x1,y1,lv)=>{for(let i=0;i<n;i++)for(let k=0;k<40;k++){const x=x0+rnd()*(x1-x0),y=y0+rnd()*(y1-y0);if(!botst(g,x,y,12,lv)&&Math.hypot(x-g.p.x,y-g.p.y)>60){g.bonen.push(boon(x,y,lv,rnd));break}}};
 strooi(110,8*T,2.4*T,16*T,62.8*T,0);
 NIS.forEach(a=>{const c0=a.kant=='l'?1:17;strooi(4,c0*T,a.R*T,(c0+6)*T,(a.R+3)*T,0);strooi(13,c0*T,(a.R-7)*T,(c0+6)*T,(a.R-2)*T,0)});
 g.pods.forEach(P=>{strooi(8,P.x+10,P.y+10,P.x+P.w-10,P.y+P.h-8,P.lv);g.bonen.push(Object.assign(boon(P.x+P.w*.3,P.y+P.h*.45,P.lv,rnd),{goud:true,w:10}))});
 g.bonen.push(Object.assign(boon(19.5*T,10.5*T,0,rnd),{goud:true,w:10}));
 return g}
function boon(x,y,lv,rnd){rnd=rnd||Math.random;return {x,y,z:0,vz:0,lv:lv|0,k:SK[(rnd()*SK.length)|0],w:1,ph:rnd()*6.28,rot:rnd()*3}}
function tegel(g,x,y){const c=Math.floor(x/T),r=Math.floor(y/T);if(c<0||r<0||c>=COLS||r>=ROWS)return 0;return g.grid[r][c]}
function loopbaar(g,lv,x,y){const t=tegel(g,x,y);if(lv)return t==19+lv;if(t==1)return true;if(t>=10&&t<20)return g.deuren[t-10].t>.35;return false}
function botst(g,x,y,r,lv){if(!loopbaar(g,lv,x-r,y-r*.5)||!loopbaar(g,lv,x+r,y-r*.5)||!loopbaar(g,lv,x-r,y+r*.4)||!loopbaar(g,lv,x+r,y+r*.4))return true;
 if(!lv)for(const z of g.zuil)if(Math.hypot(x-z.x,(y-z.y)*1.3)<z.r+r)return true;
 for(const k of g.kist)if(k.lv==lv&&Math.abs(x-k.x)<22+r&&Math.abs(y-k.y)<12+r*.6)return true;return false}

/* ---------- invoer: vaste joystick linksonder, tikken = lopen/toveren ---------- */
function scherm2wereld(x,y){return {x:x/G.s+G.cam.x,y:y/G.s+G.cam.y}}
/* overal op het scherm: duim neer en schuiven = zwevende stick vanaf dat punt; kort tikken = toveren / erheen lopen */
function neer(e){if(!G||G.fase!='spel')return;try{e.target.setPointerCapture(e.pointerId)}catch(x){}if(G.joy)return;G.druk={id:e.pointerId,x0:e.clientX,y0:e.clientY,t0:performance.now()}}
function tik(cx,cy){if(!G||G.fase!='spel')return;const w=scherm2wereld(cx,cy);
 const o=raak(w.x,w.y);if(o){const lv=soort(o)=='kist'?o.lv:0;if(lv==G.p.lv&&!G.p.sprong&&Math.hypot(o.x-G.p.x,o.y-G.p.y)<110&&(lv||regio(o.x,o.y)==regio(G.p.x,G.p.y))){G.tocht=null;tover(o);return}
  if(soort(o)=='kus'&&o.actief){plan(o.x,o.y,0,null);return}plan(o.x,o.y,lv,o);return}
 const t=tegel(G,w.x,w.y);plan(w.x,w.y,t>=20&&t<30?t-19:0,null)}
/* tikken op een kist/deur/kussen (ongeacht hoogte) */
function raak(x,y){const d=deurOp(x,y);if(d)return d;let best=null,bd=44;for(const k of G.kist){if(k.open)continue;const e=Math.hypot(k.x-x,k.y-12-y);if(e<bd){bd=e;best=k}}for(const k of G.kus){const e=Math.hypot(k.x-x,(k.y-y)*1.4);if(e<bd){bd=e;best=k}}return best}
/* in welke zijkamer ligt een punt (-1 = gang/nis) */
function regio(x,y){for(const k of G.kamers)if(x>k.x&&x<k.x+k.w&&y>k.y&&y<k.y+k.h+T)return k.deur;return -1}
const buiten=d=>({x:d.x,y:d.y+18}),mond=d=>({x:d.x<RW/2?8.6*T:15.4*T,y:(d.r0+3.5)*T}),binnen=d=>({x:d.x,y:d.r0*T-T*.6});
/* route: via deuropening (deur zo nodig eerst openen) of via een Spongify-kussen naar een podium; bij aankomst toveren */
/* kortste route over de tegels (gang, nissen, deuropeningen); dichte deur onderweg = eerst Alohomora */
function route(sx,sy,ex,ey){const sc=Math.floor(sx/T),sr=Math.floor(sy/T),ec=Math.floor(ex/T),er=Math.floor(ey/T),g=G.grid;
 const blok=new Set();for(const z of G.zuil)blok.add(Math.floor(z.y/T)*COLS+Math.floor(z.x/T));for(const k of G.kist)if(!k.lv)blok.add(Math.floor(k.y/T)*COLS+Math.floor(k.x/T));
 const ok=(c,r)=>{const t=g[r]&&g[r][c];if(!(t==1||(t>=10&&t<20)))return false;return (c==ec&&r==er)||!blok.has(r*COLS+c)};
 if(!ok(ec,er))return null;const prev=new Map(),st=sr*COLS+sc;prev.set(st,-1);const q=[st];
 while(q.length){const cur=q.shift();if(cur==er*COLS+ec)break;const c=cur%COLS,r=(cur/COLS)|0;
  for(const [dc,dr] of [[0,-1],[1,0],[0,1],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]){const nc=c+dc,nr=r+dr,k=nr*COLS+nc;if(prev.has(k)||!ok(nc,nr))continue;if(dc&&dr&&(!ok(c+dc,r)||!ok(c,r+dr)))continue;prev.set(k,cur);q.push(k)}}
 if(!prev.has(er*COLS+ec))return null;const tl=[];for(let k=er*COLS+ec;k!=-1;k=prev.get(k))tl.unshift(k);
 const pts=tl.map(k=>{const c=k%COLS,r=(k/COLS)|0,t=g[r][c];return {x:(c+.5)*T,y:(r+.5)*T,deur:t>=10&&t<20?G.deuren[t-10]:null}});pts.shift();
 const uit=[];for(let a=0;a<pts.length;a++){const q2=pts[a];if(q2.deur){const pv=uit[uit.length-1];if(!q2.deur.open&&!(pv&&pv.deur)){uit.push(Object.assign(buiten(q2.deur),{act:q2.deur}))}uit.push({x:q2.deur.x,y:q2.y,deur:q2.deur});continue}
  // overslaan als we in rechte lijn verder kunnen
  const pv=uit.length?uit[uit.length-1]:{x:sx,y:sy};const nx=pts[a+1];if(nx&&!nx.deur&&!(pv.deur)&&vrijeLijn(pv,nx))continue;uit.push(q2)}
 return uit}
function vrijeLijn(a,b){const d=Math.hypot(b.x-a.x,b.y-a.y),n=Math.ceil(d/8);for(let i=1;i<=n;i++){const x=a.x+(b.x-a.x)*i/n,y=a.y+(b.y-a.y)*i/n;if(botst(G,x,y,13,0))return false}return true}
function plan(ex,ey,lv,obj){const p=G.p;let pts=[];G.tocht={pts,obj,eind:{x:ex,y:ey,lv},stil:0,wacht:0,lx:p.x,ly:p.y};
 if(p.lv){if(lv!=p.lv){G.tocht.herplan=1;const P=G.pods[p.lv-1],fx=Math.max(P.x+24,Math.min(P.x+P.w-24,ex));pts.push({x:fx,y:P.y+P.h-10},{x:fx,y:P.y+P.h+60})}else if(!obj)pts.push({x:ex,y:ey});return}
 if(lv){let kus=null,bd=1e9;for(const k of G.kus)if(k.pod==lv-1){const e=Math.hypot(k.x-p.x,k.y-p.y);if(e<bd){bd=e;kus=k}}if(!kus)return;
  const r=route(p.x,p.y,kus.x,kus.y+46)||[];G.tocht.pts=pts=r;if(!kus.actief)pts.push({x:kus.x,y:kus.y+46,act:kus});pts.push({x:kus.x,y:kus.y,kus:1});G.tocht.herplan=1;return}
 let ty=ey;if(obj&&soort(obj)=='kist')ty=obj.y+30;const r=route(p.x,p.y,ex,ty);
 if(r){G.tocht.pts=pts=r;if(!obj)pts.push({x:ex,y:ey})}else pts.push({x:ex,y:ey})}
function tochtStap(dt){const tc=G.tocht,p=G.p;if(!tc||p.sprong)return null;
 if(tc.wacht>0){tc.wacht-=dt;return null}
 // voortgang bewaken: na 1,5 s vastzitten stoppen
 if(Math.hypot(p.x-tc.lx,p.y-tc.ly)>6){tc.lx=p.x;tc.ly=p.y;tc.stil=0}else if((tc.stil+=dt)>1.5){G.tocht=null;return null}
 const o=tc.obj;if(o&&!tc.pts.length){const lv=soort(o)=='kist'?o.lv:0;if(soort(o)=='kist'&&o.open||soort(o)=='deur'&&o.open||soort(o)=='kus'&&o.actief){G.tocht=null;return null}
  if(lv==p.lv&&Math.hypot(o.x-p.x,o.y-p.y)<90){G.tocht=null;tover(o);return null}return {x:o.x,y:o.y+(soort(o)=='kist'?20:0)}}
 const q=tc.pts[0];if(!q){G.tocht=null;return null}
 if(q.act&&Math.hypot(q.act.x-p.x,q.act.y-p.y)<95&&!(q.act.open||q.act.actief)){tover(q.act);tc.pts.shift();tc.wacht=.8;tc.stil=0;return null}
 if(Math.hypot(q.x-p.x,q.y-p.y)<(q.kus?6:12)){if(q.act&&!(q.act.open||q.act.actief)){tover(q.act);tc.wacht=.8}tc.pts.shift();tc.stil=0;if(!tc.pts.length&&!o){G.tocht=null}return null}
 return q}
function beweeg(e){if(!G)return;if(G.joy&&G.joy.id==e.pointerId){G.joy.x=e.clientX;G.joy.y=e.clientY;toonJoy();return}const d=G.druk;if(d&&d.id==e.pointerId&&Math.hypot(e.clientX-d.x0,e.clientY-d.y0)>10){G.joy={id:d.id,x0:d.x0,y0:d.y0,x:e.clientX,y:e.clientY};G.druk=null;G.tocht=null;toonJoy()}}
function los(e){if(!G)return;if(G.joy&&G.joy.id==e.pointerId){G.joy=null;toonJoy();return}const d=G.druk;if(d&&d.id==e.pointerId){G.druk=null;if(e.type!='pointercancel'&&performance.now()-d.t0<350&&Math.hypot(e.clientX-d.x0,e.clientY-d.y0)<=10)tik(d.x0,d.y0)}}
function toonJoy(){const j=$('#bkjoy');if(!j)return;if(!G||!G.joy){j.classList.remove('aan');return}j.classList.add('aan');j.style.left=G.joy.x0+'px';j.style.top=G.joy.y0+'px';let dx=G.joy.x-G.joy.x0,dy=G.joy.y-G.joy.y0;const m=Math.hypot(dx,dy);if(m>42){dx*=42/m;dy*=42/m}j.firstChild.style.transform=`translate(${dx}px,${dy}px)`}
function deurOp(x,y){for(const d of G.deuren)if(!d.open&&x>d.c*T-8&&x<d.c*T+T+8&&y>d.r0*T-10&&y<d.r0*T+2*T+20)return d;return null}
function dichtbij(x,y,max){let best=null,bd=max;const p=G.p;
 for(const k of G.kist){if(k.open||k.lv!=p.lv)continue;const d=Math.hypot(k.x-x,k.y-y);if(d<bd){bd=d;best=k}}
 if(!p.lv){for(const k of G.kus){if(k.actief)continue;const d=Math.hypot(k.x-x,k.y-y);if(d<bd){bd=d;best=k}}for(const k of G.deuren){if(k.open)continue;const d=Math.hypot(k.x-x,k.y-y);if(d<bd){bd=d;best=k}}}return best}
const soort=o=>o.rest!==undefined?'kist':o.r0!==undefined?'deur':'kus';

/* ---------- toveren ---------- */
function tover(doel){if(!G||G.fase!='spel')return;const p=G.p;doel=doel||dichtbij(p.x,p.y,105);const nu=performance.now();
 const wx=p.x+(p.dir=='l'?-14:p.dir=='r'?14:8),wy=p.y-30;
 if(!doel){for(let i=0;i<8;i++)G.part.push({x:wx,y:wy,z:0,vx:(Math.random()-.5)*80,vy:(Math.random()-.5)*80,l:.6,k:'#fff3b0',s:2});snd('klik',.3);return}
 const sr=soort(doel);p.dir=Math.abs(doel.x-p.x)>Math.abs(doel.y-p.y)?(doel.x<p.x?'l':'r'):(doel.y<p.y?'b':'o');
 G.combo=nu-G.lastCast<2600?G.combo+1:1;G.lastCast=nu;G.bestCombo=Math.max(G.bestCombo,G.combo);
 const c=$('#bkcombo');if(c&&G.combo>1){c.textContent='Combo ×'+G.combo+'!';c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop')}
 const ty=sr=='deur'?doel.r0*T+T:doel.y-14;G.ringen.push({x1:wx,y1:wy,x2:doel.x,y2:ty,t:0,k:sr=='kus'?'#ffe36a':'#ffd76a'});
 snd('spreuk',.55);if(sr!='kus')stem();try{vib(15)}catch(e){}
 if(sr=='deur')doel.open=1;else if(sr=='kist')doel.open=1;else doel.actief=true;
 setTimeout(()=>{if(!G)return;if(sr=='kist')openKist(doel);else if(sr=='deur')openDeur(doel);else{doel.wob=1;snd('pluis',.6);for(let i=0;i<18;i++)G.part.push({x:doel.x,y:doel.y,z:4,vx:(Math.random()-.5)*140,vy:(Math.random()-.5)*70,l:1,k:i%2?'#ffe36a':'#ff9ac8',s:3})}},260)}
function openKist(k){k.t=0;G.kisten++;snd('kist',.8);k.rest=(k.speciaal?10:14)+Math.max(0,G.combo-1)*3;k.tk=.12;k.nr=0;
 for(let i=0;i<18;i++)G.part.push({x:k.x,y:k.y-10,z:10,vx:(Math.random()-.5)*140,vy:(Math.random()-.5)*90,l:.9,k:i%2?'#fff3b0':'#ffd76a',s:2.5});
 if(k.speciaal)setTimeout(()=>chocokikker(k),900)}
function spring(k){const a=Math.random()*6.283,v=55+Math.random()*75;const b=boon(k.x,k.y-14,k.lv);b.z=26;b.vz=300+Math.random()*120;b.vx=Math.cos(a)*v;b.vy=Math.sin(a)*v*.75+18;b.vlieg=true;if(Math.random()<.07){b.goud=true;b.w=5}G.bonen.push(b);plop(k.nr++);
 for(let j=0;j<3;j++)G.part.push({x:k.x,y:k.y-20,z:12,vx:(Math.random()-.5)*60,vy:-30-Math.random()*40,l:.45,k:'#fff3b0',s:2})}
function openDeur(d){d.t=0;G.deurOpen++;snd(Math.random()<.5?'verr-deur1':'verr-deur2',.8);for(let i=0;i<20;i++)G.part.push({x:d.x,y:d.r0*T+T,z:0,vx:(Math.random()-.5)*120,vy:(Math.random()-.5)*80,l:1,k:i%2?'#fff3b0':'#ffd76a',s:2.5})}

function chocokikker(k){const pool=(window.KAARTEN||[]).filter(x=>x[3]);const kaart=pool.length?pool[Math.random()*pool.length|0]:null;G.tijd+=10;G.kaart=kaart?kaart[0]:'Chocokikker';
 if(kaart){S.kaarten=S.kaarten||{};S.kaarten[kaart[0]]=(S.kaarten[kaart[0]]||0)+1;bewaar()}const el=$('#bkkaart');if(el){el.innerHTML=`${kaart?`<img src="${kaart[3]}" alt="">`:''}<b>Chocokikkerkaart!</b><small>${kaart?kaart[0]:''}</small><i>Speciaal effect: +10 seconden</i>`;el.classList.add('aan');setTimeout(()=>el.classList.remove('aan'),3200)}snd('tover',.8)}


/* ---------- lus ---------- */
function frame(nu){if(!G||!$('#bkc')){stop();return}G.raf=requestAnimationFrame(frame);const dt=Math.min(.05,(nu-(G.tl||nu))/1000)||.016;G.tl=nu;
 if(G.fase=='spel'){G.tijd-=dt;if(G.tijd<=0){G.tijd=0;einde()}}stap(dt,nu);teken(nu)}
function schuif(p,nx,ny,dt){/* lopen met hulp bij hoekjes en deuropeningen */
 if(!botst(G,nx,p.y,14,p.lv))p.x=nx;else{let ok=false;for(const d of [4,8,12,16,20,24])for(const s of [-1,1])if(!ok&&!botst(G,nx,p.y+s*d,14,p.lv)){p.y+=s*Math.min(d,110*dt);ok=true}if(!ok)p.vx=0}
 if(!botst(G,p.x,ny,14,p.lv))p.y=ny;else{let ok=false;for(const d of [4,8,12,16,20,24])for(const s of [-1,1])if(!ok&&!botst(G,p.x+s*d,ny,14,p.lv)){p.x+=s*Math.min(d,110*dt);ok=true}if(!ok)p.vy=0}}
function stap(dt,nu){const p=G.p;let ix=0,iy=0;
 if(G.fase=='spel'){if(G.joy){ix=(G.joy.x-G.joy.x0)/42;iy=(G.joy.y-G.joy.y0)/42;const m=Math.hypot(ix,iy);if(m>1){ix/=m;iy/=m}if(m<.15){ix=iy=0}}
  else{const q=tochtStap(dt);if(q){const dx=q.x-p.x,dy=q.y-p.y,m=Math.hypot(dx,dy);if(m>1){ix=dx/m;iy=dy/m}}}}
 if(p.sprong){const s=p.sprong;s.t+=dt/s.d;const k=Math.min(1,s.t);p.x=s.x0+(s.x1-s.x0)*k;p.y=s.y0+(s.y1-s.y0)*k;p.z=Math.sin(k*Math.PI)*s.h;if(k>=1){p.sprong=null;p.z=0;p.lv=s.naarLv;snd('klik',.4);const tc=G.tocht;if(tc&&tc.herplan){const e=tc.eind,o=tc.obj;plan(e.x,e.y,e.lv,o)}}}
 else{const sp=180;p.vx+=(ix*sp-p.vx)*Math.min(1,dt*12);p.vy+=(iy*sp-p.vy)*Math.min(1,dt*12);const nx=p.x+p.vx*dt,ny=p.y+p.vy*dt;
  const im=Math.hypot(ix,iy);if(p.lv&&im>.5&&!loopbaar(G,p.lv,p.x+ix/im*20,p.y+iy/im*20)){/* van het podium af: spring naar beneden */const v=im;if(v>.5){const P=G.pods[p.lv-1],ux=ix/im,uy=iy/im;let x1=p.x+ux*70,y1=p.y+uy*70;if(uy>.5)y1=(P.r1+2)*T+20;let ok=!botst(G,x1,y1,14,0);if(!ok){x1=p.x+ux*100;y1=uy>.5?y1:p.y+uy*100;ok=!botst(G,x1,y1,14,0)}if(ok)p.sprong={x0:p.x,y0:p.y,x1,y1,t:0,d:.45,h:28,naarLv:0};else p.vx=p.vy=0}else p.vx=p.vy=0}
  else schuif(p,nx,ny,dt);
  const v=Math.hypot(p.vx,p.vy);if(v>20){p.stap+=dt*v/24;p.dir=Math.abs(p.vx)>Math.abs(p.vy)?(p.vx<0?'l':'r'):(p.vy<0?'b':'o')}else p.stap=0;
  for(const k of G.kus){if(G.tocht&&!(G.tocht.pts[0]&&G.tocht.pts[0].kus))continue;if(k.actief&&!p.lv&&Math.hypot(p.x-k.x,(p.y-k.y)*1.4)<30){const P=G.pods[k.pod];let x1=Math.max(P.x+30,Math.min(P.x+P.w-30,p.x)),y1=P.y+P.h*.55;for(const dx of [0,40,-40,80,-80])if(!botst(G,x1+dx,y1,14,P.lv)){x1+=dx;break}
    p.sprong={x0:p.x,y0:p.y,x1,y1,t:0,d:.75,h:120,naarLv:P.lv};k.wob=1;snd('pluis',.7);try{vib([10,30,10])}catch(e){}p.vx=p.vy=0;if(G.tocht&&G.tocht.pts[0]&&G.tocht.pts[0].kus)G.tocht.pts.shift();break}}}
 for(const k of G.kus)k.wob=Math.max(0,k.wob-dt*1.2);
 for(const d of G.deuren)if(d.open)d.t+=dt;
 for(const k of G.kist){k.t+=dt;if(k.rest>0){k.tk-=dt;while(k.tk<=0&&k.rest>0){k.rest--;k.tk+=.07+Math.random()*.03;spring(k)}}}
 // bonen
 for(const b of G.bonen){if(b.weg)continue;if(b.vlieg){b.vz-=900*dt;b.z+=b.vz*dt;const nx2=b.x+b.vx*dt,ny2=b.y+b.vy*dt;if(loopbaar(G,b.lv,nx2,ny2)&&loopbaar(G,b.lv,nx2,ny2+6)){b.x=nx2;b.y=ny2}else{b.vx*=-.4;b.vy*=-.4}
   if(b.z<=0){b.z=0;if(b.vz<-120){b.vz*=-.35;b.vx*=.5;b.vy*=.5}else{b.vlieg=false;b.vx=b.vy=0}}}
  if(G.fase=='spel'&&b.lv==p.lv&&!p.sprong&&b.z<10&&Math.abs(b.y-p.y)<40&&Math.hypot(b.x-p.x,(b.y-p.y)*1.3)<24){b.weg=1;G.n+=b.w;$('#bkn').textContent=G.n;snd('munt',.35);for(let i=0;i<5;i++)G.part.push({x:b.x,y:b.y,z:8,vx:(Math.random()-.5)*60,vy:-20-Math.random()*40,l:.5,k:b.k,s:2})}}
 if(G.bonen.length>600)G.bonen=G.bonen.filter(b=>!b.weg);
 G.part=G.part.filter(q=>{q.l-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;return q.l>0});G.ringen=G.ringen.filter(r=>(r.t+=dt*3.6)<1.4);
 // camera volgt Luna zacht
 const vw=G.W/G.s,vh=G.H/G.s;let cx=p.x-vw/2,cy=p.y-vh*.56;cx=Math.max(0,Math.min(RW-vw,cx));cy=Math.max(0,Math.min(RH-vh,cy));if(RW<vw)cx=(RW-vw)/2;
 const kk=G.camOk?Math.min(1,dt*5):1;G.cam.x+=(cx-G.cam.x)*kk;G.cam.y+=(cy-G.cam.y)*kk;G.camOk=1;
 const tb=$('#bktijd');if(tb){tb.style.width=Math.min(100,G.tijd/DUUR*100)+'%';$('#bktijdt').textContent=Math.ceil(G.tijd)}}

/* ---------- tekenen ---------- */
let BG=null;const BS={};
function boonSprite(k){if(BS[k])return BS[k];const c=document.createElement('canvas');c.width=26;c.height=18;const x=c.getContext('2d');const g=x.createRadialGradient(9,6,1,13,9,12);g.addColorStop(0,'#fff');g.addColorStop(.25,k);g.addColorStop(1,shade(k,-.45));x.fillStyle=g;x.beginPath();x.ellipse(13,9,11,7,0,0,6.283);x.fill();x.strokeStyle=shade(k,-.5);x.lineWidth=1;x.stroke();x.fillStyle='rgba(255,255,255,.7)';x.beginPath();x.ellipse(9,6,3.5,1.8,-.4,0,6.283);x.fill();x.strokeStyle='rgba(0,0,0,.18)';x.beginPath();x.moveTo(13,4);x.quadraticCurveTo(15,9,13,14);x.stroke();return BS[k]=c}
function shade(h,f){const n=parseInt(h.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const t=f<0?0:255,p=Math.abs(f);r=Math.round((t-r)*p+r);g=Math.round((t-g)*p+g);b=Math.round((t-b)*p+b);return `rgb(${r},${g},${b})`}
function achtergrond(){if(BG)return BG;const c=document.createElement('canvas');c.width=RW;c.height=RH;const x=c.getContext('2d');const g=G.grid;
 x.fillStyle='#0c0907';x.fillRect(0,0,RW,RH);let s=3;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};
 const tg=(rr,cc)=>(g[rr]&&g[rr][cc]!=null)?g[rr][cc]:0;const vloer=t=>t==1||(t>=20&&t<30);const muurOfDeur=t=>t==0||(t>=10&&t<20);
 const gevel=(X,Y,boven)=>{x.fillStyle='#3e352e';x.fillRect(X,Y,T,T);x.save();x.beginPath();x.rect(X,Y,T,T);x.clip();for(let wy=0;wy<T;wy+=12){const off=(((Y+wy)/12)%2)*12;for(let wx=-off;wx<T;wx+=24){const v=r()*.14;x.fillStyle=`rgb(${92+v*150|0},${82+v*130|0},${72+v*110|0})`;x.fillRect(X+wx+1,Y+wy+1,22,10)}}x.restore();
  if(boven){x.fillStyle='#8a7c6c';x.fillRect(X,Y,T,6);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(X,Y+6,T,2)}else{const gr=x.createLinearGradient(0,Y+T-16,0,Y+T);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.4)');x.fillStyle=gr;x.fillRect(X,Y+T-16,T,16)}};
 for(let rr=0;rr<ROWS;rr++)for(let cc=0;cc<COLS;cc++){const t=g[rr][cc],X=cc*T,Y=rr*T;
  if(t==1){const v=r()*.12;x.fillStyle=`rgb(${118+v*200|0},${108+v*180|0},${96+v*150|0})`;x.fillRect(X+1,Y+1,T-2,T-2);x.fillStyle='rgba(255,255,255,.06)';x.fillRect(X+1,Y+1,T-2,3);
   if(cc>=10&&cc<=13&&rr>=2&&rr<=62){x.fillStyle='rgba(120,20,30,.6)';x.fillRect(X,Y,T,T);x.fillStyle='rgba(230,180,70,.7)';if(cc==10)x.fillRect(X+5,Y,3,T);if(cc==13)x.fillRect(X+T-8,Y,3,T)}}
  else if(t>=20&&t<30){const v=r()*.1;x.fillStyle=`rgb(${156+v*200|0},${142+v*180|0},${122+v*150|0})`;x.fillRect(X+1,Y+1,T-2,T-2)}
  else if(t>=30){x.fillStyle='#6a5c50';x.fillRect(X,Y,T,T*.72);for(let i=0;i<T;i+=16){x.fillStyle='rgba(0,0,0,.2)';x.fillRect(X+i,Y,1.5,T*.72)}x.fillStyle='rgba(0,0,0,.4)';x.fillRect(X,Y+T*.72,T,T*.28)}
  else{const s1=tg(rr+1,cc),s2=tg(rr+2,cc);
   if(vloer(s1)||(t>=10&&t<20&&!muurOfDeur(s1)))gevel(X,Y,!muurOfDeur(tg(rr-1,cc)));
   else if(muurOfDeur(s1)&&vloer(s2)&&(muurOfDeur(tg(rr+1,cc))))gevel(X,Y,true);
   else{x.fillStyle='#2a221c';x.fillRect(X,Y,T,T);x.fillStyle='#5a4a3c';if(vloer(tg(rr,cc+1)))x.fillRect(X+T-5,Y,5,T);if(vloer(tg(rr,cc-1)))x.fillRect(X,Y,5,T);if(vloer(tg(rr-1,cc)))x.fillRect(X,Y,T,4)}}}
 // deuropeningen: donkere boog met stenen kozijn
 for(const d of G.deuren){const X=d.c*T,Y=d.r0*T;x.fillStyle='#8a7c6c';x.fillRect(X-6,Y-2,T+12,2*T+2);x.fillStyle='#0a0705';x.beginPath();x.moveTo(X,Y+2*T);x.lineTo(X,Y+18);x.quadraticCurveTo(X+T/2,Y-8,X+T,Y+18);x.lineTo(X+T,Y+2*T);x.fill()}
 // banieren op de gevels
 const ban=(bx,by,a,b)=>{x.fillStyle=a;x.beginPath();x.moveTo(bx,by);x.lineTo(bx+26,by);x.lineTo(bx+26,by+54);x.lineTo(bx+13,by+44);x.lineTo(bx,by+54);x.fill();x.fillStyle=b;x.beginPath();x.arc(bx+13,by+20,6,0,6.283);x.fill()};
 ban(10.6*T,6,'#e3b23c','#1c1c1c');ban(12.6*T,6,'#9c1b1b','#e3b23c');
 [['#1a5a3a','#c9ced4'],['#1d3a8a','#b07a3a'],['#e3b23c','#1c1c1c'],['#9c1b1b','#e3b23c']].forEach(([a,b],i)=>{const n=NIS[i],c0=n.kant=='l'?1:17;ban((c0+4.6)*T,(n.R-2)*T+8,a,b);ban((c0+1)*T,(n.R-9)*T+8,b=='#1c1c1c'?'#e3b23c':a,b)});
 // podiumranden
 for(const P of G.pods){x.strokeStyle='#c9a24a';x.lineWidth=3;x.strokeRect(P.x+1.5,P.y+1.5,P.w-3,P.h-3)}
 return BG=c}
function zichtbaar(X,Y,m){const vw=G.W/G.s,vh=G.H/G.s;return X>G.cam.x-m&&X<G.cam.x+vw+m&&Y>G.cam.y-m&&Y<G.cam.y+vh+m+60}
function teken(nu){const cv=$('#bkc');const x=cv.getContext('2d');x.setTransform(G.d,0,0,G.d,0,0);x.fillStyle='#0c0907';x.fillRect(0,0,G.W,G.H);
 x.save();x.scale(G.s,G.s);x.translate(-G.cam.x,-G.cam.y);const t=nu/1000;const bg=achtergrond();
 {const vw=G.W/G.s,vh=G.H/G.s;const sx=Math.max(0,Math.floor(G.cam.x)),sy=Math.max(0,Math.floor(G.cam.y)),sw=Math.min(RW-sx,Math.ceil(vw)+2),sh=Math.min(RH-sy,Math.ceil(vh)+2);if(sw>0&&sh>0)x.drawImage(bg,sx,sy,sw,sh,sx,sy,sw,sh)}
 for(const d of G.deuren)if(zichtbaar(d.x,d.y,120))tekDeur(x,d,t);
 for(const f of G.fakkels)if(zichtbaar(f.x,f.y,100))tekFakkel(x,f,t);
 for(const k of G.kus)if(zichtbaar(k.x,k.y,90))tekKus(x,k,t);
 const L=[];G.bonen.forEach(b=>{if(!b.weg&&zichtbaar(b.x,b.y,40))L.push({y:b.y,f:()=>tekBoon(x,b,t)})});G.kist.forEach(k=>{if(zichtbaar(k.x,k.y,80))L.push({y:k.y,f:()=>tekKist(x,k,t)})});G.zuil.forEach(z=>{if(zichtbaar(z.x,z.y,140))L.push({y:z.y,f:()=>tekZuil(x,z)})});
 L.push({y:G.p.y+(G.p.sprong?60:0),f:()=>tekLuna(x,G.p,t)});L.sort((a,b)=>a.y-b.y).forEach(o=>o.f());
 // kamers achter dichte deuren blijven in het donker
 for(const k of G.kamers){const d=G.deuren[k.deur];const a=d.open?Math.max(0,.92*(1-d.t*1.1)):.92;if(a<=0||!zichtbaar(k.x+k.w/2,k.y+k.h/2,k.h))continue;x.fillStyle=`rgba(10,7,5,${a})`;x.fillRect(k.x,k.y,k.w,k.h);
  if(!d.open){x.globalAlpha=.5+.3*Math.sin(t*2+k.deur);x.fillStyle='#ffd76a';x.font='bold 22px Georgia,serif';x.textAlign='center';x.fillText('✦ ? ✦',k.x+k.w/2,k.y+k.h*.55);x.globalAlpha=1}}
 for(const r of G.ringen){const k=Math.min(1,r.t);const X=r.x1+(r.x2-r.x1)*k,Y=r.y1+(r.y2-r.y1)*k-Math.sin(k*Math.PI)*30;x.fillStyle=r.k;x.globalAlpha=Math.max(0,1.4-r.t);x.beginPath();x.arc(X,Y,6,0,6.283);x.fill();x.globalAlpha=.4*Math.max(0,1.4-r.t);x.beginPath();x.arc(X,Y,13,0,6.283);x.fill();x.globalAlpha=1;if(r.t>1){x.strokeStyle=r.k;x.lineWidth=3;x.beginPath();x.ellipse(r.x2,r.y2+14,30*(r.t-.6),15*(r.t-.6),0,0,6.283);x.stroke()}}
 for(const q of G.part){x.globalAlpha=Math.max(0,Math.min(1,q.l*2));x.fillStyle=q.k;x.fillRect(q.x-q.s/2,q.y-(q.z||0)-q.s/2,q.s,q.s);}x.globalAlpha=1;x.restore()}
function tekFakkel(x,f,t){const X=f.x,Y=f.y;x.fillStyle='#3a2a1a';x.fillRect(X-3,Y,6,18);const fl=1+.15*Math.sin(t*13+X)+.1*Math.sin(t*7.3+Y);const g=x.createRadialGradient(X,Y-4,0,X,Y-4,80*fl);g.addColorStop(0,'rgba(255,170,60,.42)');g.addColorStop(1,'rgba(255,120,30,0)');x.fillStyle=g;x.fillRect(X-90,Y-90,180,190);x.fillStyle='#ffcf5a';x.beginPath();x.ellipse(X,Y-6,5*fl,10*fl,0,0,6.283);x.fill();x.fillStyle='#fff3c0';x.beginPath();x.ellipse(X,Y-4,2.4,5,0,0,6.283);x.fill()}
function tekDeur(x,d,t){const X=d.c*T,Y=d.r0*T,W=T,H=2*T;const k=d.open?Math.min(1,d.t/.8):0,e=1-Math.pow(1-k,3),a=e*1.45,ca=Math.cos(a),sa=Math.sin(a);
 if(d.open&&d.t<2.5){x.globalAlpha=Math.max(0,1-d.t/2.5);const g=x.createRadialGradient(X+W/2,Y+H*.5,0,X+W/2,Y+H*.5,80);g.addColorStop(0,'rgba(255,235,160,.7)');g.addColorStop(1,'rgba(255,220,120,0)');x.fillStyle=g;x.fillRect(X-60,Y-40,W+120,H+80);x.globalAlpha=1}
 const rx=X+3+(W-6)*ca,up=sa*16;x.beginPath();x.moveTo(X+3,Y+10);x.quadraticCurveTo(X+3+(rx-X-3)/2,Y-6-up*.5,rx,Y+10-up);x.lineTo(rx,Y+H-up);x.lineTo(X+3,Y+H);x.closePath();
 const sh=1-e*.45;x.fillStyle=`rgb(${122*sh|0},${74*sh|0},${36*sh|0})`;x.fill();x.save();x.clip();x.strokeStyle='rgba(40,20,8,.55)';x.lineWidth=2;for(let i=1;i<4;i++){const px=X+3+(rx-X-3)*i/4;x.beginPath();x.moveTo(px,Y-10);x.lineTo(px,Y+H);x.stroke()}
 x.fillStyle='#3a3a40';x.fillRect(X,Y+26-up*.4,rx-X,5);x.fillRect(X,Y+H-24-up*.8,rx-X,5);x.restore();
 if(!d.open){x.fillStyle='#e3b23c';x.beginPath();x.arc(X+W-12,Y+H*.58,4,0,6.283);x.fill();x.fillStyle='#1a1008';x.fillRect(X+W-13,Y+H*.58+2,2,6);
  if(!G.p.lv&&Math.hypot(d.x-G.p.x,d.y-G.p.y)<105){x.strokeStyle=`rgba(255,215,106,${.5+.4*Math.sin(t*6)})`;x.lineWidth=3;x.strokeRect(X-4,Y-8,W+8,H+10)}}}
let GATEN=null;
function tekKus(x,k,t){if(!GATEN){let s=11;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};GATEN=[];for(let i=0;i<16;i++){const a=r()*6.283,m=Math.sqrt(r());GATEN.push([Math.cos(a)*m*32,Math.sin(a)*m*16,1.5+r()*2.5])}}
 const pul=.5+.5*Math.sin(t*(k.actief?6:3)),w=1+k.wob*.18*Math.sin(t*30);x.save();x.translate(k.x,k.y);
 const g=x.createRadialGradient(0,0,8,0,0,k.actief?78:56);g.addColorStop(0,k.actief?`rgba(255,245,140,${.6+.25*pul})`:`rgba(255,200,120,${.18+.12*pul})`);g.addColorStop(1,'rgba(255,140,200,0)');x.fillStyle=g;x.beginPath();x.ellipse(0,0,k.actief?78:56,k.actief?44:32,0,0,6.283);x.fill();
 if(k.actief)for(let i=0;i<3;i++){const ph=(t*.9+i/3)%1;x.strokeStyle=`rgba(255,250,190,${(1-ph)*.85})`;x.lineWidth=2.5;x.beginPath();x.ellipse(0,-ph*20,40+ph*26,22+ph*13,0,0,6.283);x.stroke()}
 x.scale(w,2-w);x.fillStyle='#c8608e';x.beginPath();x.ellipse(0,5,40,22,0,0,6.283);x.fill();
 const sg=x.createRadialGradient(-10,-6,4,0,0,42);sg.addColorStop(0,'#fff38a');sg.addColorStop(.55,'#ffd24a');sg.addColorStop(1,'#ff8fc0');x.fillStyle=sg;x.beginPath();x.ellipse(0,0,40,22,0,0,6.283);x.fill();
 x.fillStyle='rgba(190,90,60,.38)';for(const [hx,hy,hr] of GATEN){x.beginPath();x.ellipse(hx,hy,hr,hr*.6,0,0,6.283);x.fill()}
 x.strokeStyle=k.actief?'#fffbe0':`rgba(255,110,185,${.6+.4*pul})`;x.lineWidth=2.5+pul*2;x.beginPath();x.ellipse(0,0,42+pul*2,24+pul,0,0,6.283);x.stroke();x.restore();
 x.font='bold 13px Georgia,serif';x.textAlign='center';x.lineWidth=3;x.strokeStyle='rgba(30,15,5,.85)';const tx=k.actief?'Spring!':'✦ Spongify';x.strokeText(tx,k.x,k.y-32);x.fillStyle=k.actief?'#fffbe0':'#ffe36a';x.fillText(tx,k.x,k.y-32)}
function tekKist(x,k,t){schaduw(x,k.x,k.y+4,28,.3);const X=k.x,Y=k.y;const o=Math.min(1,k.open?k.t*3:0);
 if(k.speciaal&&!k.open){const g=x.createRadialGradient(X,Y-16,0,X,Y-16,60);g.addColorStop(0,`rgba(200,140,255,${.35+.2*Math.sin(t*3)})`);g.addColorStop(1,'rgba(160,90,255,0)');x.fillStyle=g;x.fillRect(X-60,Y-76,120,100)}
 x.fillStyle=k.speciaal?'#6a3a8a':'#7a4a22';x.fillRect(X-24,Y-30,48,30);x.fillStyle=k.speciaal?'#e3b23c':'#c9a24a';x.fillRect(X-24,Y-30,48,4);x.fillRect(X-24,Y-4,48,4);x.fillRect(X-3,Y-22,6,10);
 x.save();x.translate(X,Y-30);x.rotate(-o*1.1);x.fillStyle=k.speciaal?'#7a4a9a':'#8a5a2a';x.beginPath();x.moveTo(-24,0);x.lineTo(24,0);x.lineTo(24,-10);x.quadraticCurveTo(0,-22,-24,-10);x.closePath();x.fill();x.strokeStyle=k.speciaal?'#e3b23c':'#c9a24a';x.lineWidth=3;x.stroke();x.restore();
 if(k.open&&(k.t<1.2||k.rest>0)){x.globalAlpha=k.rest>0?.8:Math.max(0,1-k.t);const g=x.createRadialGradient(X,Y-30,0,X,Y-30,60);g.addColorStop(0,'rgba(255,240,170,.9)');g.addColorStop(1,'rgba(255,220,100,0)');x.fillStyle=g;x.fillRect(X-60,Y-90,120,90);x.globalAlpha=1}
 if(!k.open&&k.lv==G.p.lv&&Math.hypot(k.x-G.p.x,k.y-G.p.y)<105){x.strokeStyle=`rgba(255,215,106,${.5+.4*Math.sin(t*6)})`;x.lineWidth=2;x.strokeRect(X-28,Y-34,56,38)}}

function schaduw(x,X,Y,rx,a){x.fillStyle=`rgba(0,0,0,${a||.28})`;x.beginPath();x.ellipse(X,Y,rx,rx*.42,0,0,6.283);x.fill()}
function tekBoon(x,b,t){const bob=b.vlieg?b.z:3+Math.sin(t*3+b.ph)*2.5;schaduw(x,b.x,b.y+2,b.goud?9:7,.22);const sp=boonSprite(b.goud?'#ffd34a':b.k);x.save();x.translate(b.x,b.y-bob-4);x.rotate(b.rot+(b.vlieg?t*8:0));const sc=b.goud?1.3:.9;x.drawImage(sp,-13*sc,-9*sc,26*sc,18*sc);x.restore();
 if(b.goud||(Math.sin(t*2+b.ph*3)>.97)){x.fillStyle='rgba(255,255,230,.9)';const s=b.goud?4+2*Math.sin(t*6):3;x.fillRect(b.x-s,b.y-bob-6,s*2,1.5);x.fillRect(b.x-.75,b.y-bob-6-s,1.5,s*2)}}
function tekZuil(x,z){schaduw(x,z.x,z.y+4,26,.3);const g=x.createLinearGradient(z.x-20,0,z.x+20,0);g.addColorStop(0,'#5a5048');g.addColorStop(.4,'#a89a88');g.addColorStop(1,'#4a4038');x.fillStyle=g;x.fillRect(z.x-18,z.y-120,36,120);x.fillStyle='#8a7c6c';x.fillRect(z.x-23,z.y-10,46,12);x.fillRect(z.x-23,z.y-128,46,12);x.fillStyle='rgba(0,0,0,.15)';for(let i=0;i<3;i++)x.fillRect(z.x-12+i*9,z.y-118,2,106)}
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
 const o=document.createElement('div');o.className='bk-intro';o.innerHTML=`<div class="bk-perk"><h2>Tijd is om!</h2><p class="bk-groot"><span class="bk-boon"></span> ${n} Smekkies</p><p>${G.kisten} ${G.kisten==1?'kist':'kisten'} en ${G.deurOpen} ${G.deurOpen==1?'deur':'deuren'} geopend · beste combo ×${G.bestCombo||0}${G.kaart?` · Chocokikkerkaart: ${G.kaart}`:''}</p><p class="klein">De Smekkies staan bij je totaal. Beste ooit: ${S.bonusKamer.beste}</p><button class="knop volgende" id="bkklaar">Terug naar De Hal</button></div>`;
 $('#bk').appendChild(o);$('#bkklaar').onclick=()=>{stop();ga('home')}}


/* ---------- ingangen: De Hal (na elke 100 levels) + makerscherm ---------- */
const _home=V.home;V.home=(...a)=>{const r=_home(...a);try{const n=bonusKamerOpen();if(n>0&&!document.getElementById('bkhal')){const na=document.querySelector('.hp-zaal')||document.querySelector('.halspel');const h=`<button class="knop volgende bkhal" id="bkhal" onclick="ga('bonuskamer')">🍬 De Smekkies-bonuskamer is open!${n>1?' (×'+n+')':''}</button>`;if(na)na.insertAdjacentHTML('afterend',h);else $('#app').insertAdjacentHTML('beforeend',h)}}catch(e){}return r};
const _mk=V.maker;if(_mk)V.maker=(...a)=>{const r=_mk(...a);$('#app').insertAdjacentHTML('beforeend',`<section class="kaart sierlijst"><h3>Smekkies-bonuskamer (test)</h3><p class="klein">Telt niet als gebruikt. Open na elke 100 levels: nu ${bonusKamerOpen()} keer beschikbaar.</p><button class="knop" onclick="ga('bonuskamer',1)">Probeer de bonuskamer</button></section>`);return r};
window.bonusTest={get G(){return G}};
})();
