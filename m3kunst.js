'use strict';
/* ====== Match-3: vrijstaande, geïllustreerde magische voorwerpen (canvas, vooraf gerenderd) ====== */
const KU=(()=>{
const lg=(c,x0,y0,x1,y1,st)=>{const g=c.createLinearGradient(x0,y0,x1,y1);st.forEach(([o,k])=>g.addColorStop(o,k));return g};
const rg=(c,x,y,r0,x1,y1,r1,st)=>{const g=c.createRadialGradient(x,y,r0,x1,y1,r1);st.forEach(([o,k])=>g.addColorStop(o,k));return g};
let SK=1; // schaal voor schaduw-pixels
function glim(c,x,y,rx,ry,rot=-.6,a=.85){c.save();c.translate(x,y);c.rotate(rot);c.scale(rx,ry);c.fillStyle=rg(c,0,0,0,0,0,1,[[0,`rgba(255,255,255,${a})`],[.5,`rgba(255,255,255,${a*.35})`],[1,'rgba(255,255,255,0)']]);c.beginPath();c.arc(0,0,1,0,7);c.fill();c.restore()}
function punt(c,x,y,r,a=1){c.save();c.translate(x,y);c.fillStyle=`rgba(255,255,255,${a})`;c.beginPath();for(let i=0;i<8;i++){const q=i%2?r*.22:r,an=i*Math.PI/4;c.lineTo(Math.cos(an)*q,Math.sin(an)*q)}c.fill();c.restore()}
// binnenrand: licht van linksboven, donker rechtsonder (rim light)
function rand(c,vorm,licht='rgba(255,255,255,.55)',donker='rgba(0,0,0,.35)'){[[licht,-1],[donker,1]].forEach(([k,d])=>{c.save();c.beginPath();vorm(c);c.clip();c.beginPath();c.rect(-300,-300,600,600);vorm(c);c.shadowColor=k;c.shadowBlur=7*SK;c.shadowOffsetX=d*3*SK;c.shadowOffsetY=d*3.5*SK;c.fillStyle='#000';c.fill('evenodd');c.restore()})}
function vul(c,vorm,stijl,lijn,lw=2.6){c.beginPath();vorm(c);c.fillStyle=stijl;c.fill();if(lijn){c.lineWidth=lw;c.strokeStyle=lijn;c.lineJoin='round';c.stroke()}}
function blad(c,x,y,rot,l,b,k1,k2,lijn){c.save();c.translate(x,y);c.rotate(rot);const v=c=>{c.moveTo(0,0);c.bezierCurveTo(b,-l*.25,b*.8,-l*.8,0,-l);c.bezierCurveTo(-b*.8,-l*.8,-b,-l*.25,0,0)};vul(c,v,lg(c,-b,0,b,-l,[[0,k2],[1,k1]]),lijn,2);rand(c,v,'rgba(255,255,255,.4)','rgba(0,0,0,.25)');c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=1.4;c.beginPath();c.moveTo(0,-2);c.quadraticCurveTo(b*.15,-l*.5,0,-l*.92);c.stroke();c.restore()}
function schaduw(c,y=44,rx=30,ry=6){c.save();c.filter=`blur(${3*SK}px)`;c.fillStyle='rgba(20,10,0,.38)';c.beginPath();c.ellipse(0,y,rx,ry,0,0,7);c.fill();c.restore();c.filter='none'}
const D={
/* ---- Herbologie ---- */
mandragora(c){schaduw(c);
 [[-.95,30],[-.5,34],[0,36],[.5,34],[.95,30]].forEach(([a,l],i)=>blad(c,0,-14,a,l,11,'#a8ee6a','#2e7a2a','#1f4f1a'));
 c.strokeStyle='#a8406e';c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(-16,12);c.quadraticCurveTo(-28,14,-33,24);c.moveTo(16,12);c.quadraticCurveTo(28,14,33,24);c.moveTo(-5,38);c.lineTo(-10,46);c.moveTo(5,38);c.lineTo(9,46);c.stroke();
 const v=c=>{c.moveTo(0,-17);c.bezierCurveTo(25,-17,31,8,15,27);c.quadraticCurveTo(7,35,0,43);c.quadraticCurveTo(-7,35,-15,27);c.bezierCurveTo(-31,8,-25,-17,0,-17)};
 vul(c,v,rg(c,-9,-6,2,0,6,32,[[0,'#ffe0ec'],[.35,'#ff8fbd'],[1,'#b0306a']]),'#6e1a40');rand(c,v);
 c.strokeStyle='rgba(120,30,70,.35)';c.lineWidth=1.5;[18,26].forEach(y=>{c.beginPath();c.moveTo(-12+y*.2,y);c.quadraticCurveTo(0,y+3,12-y*.2,y);c.stroke()});
 c.fillStyle='rgba(255,120,150,.6)';[-12,12].forEach(x=>{c.beginPath();c.ellipse(x,8,5,3,0,0,7);c.fill()});
 c.strokeStyle='#4a0f28';c.lineWidth=2.2;[-8,8].forEach(x=>{c.beginPath();c.arc(x,1,3.5,Math.PI*.15,Math.PI*.85,false);c.stroke()});
 c.fillStyle='#5a0f22';c.beginPath();c.ellipse(0,12,4.5,5.5,0,0,7);c.fill();c.fillStyle='#ff6a7a';c.beginPath();c.ellipse(0,14.5,2.6,2,0,0,7);c.fill();
 glim(c,-10,-6,9,5)},
maanbloem(c){schaduw(c,44,26,5);
 for(let i=0;i<6;i++){c.save();c.rotate(i*Math.PI/3);const v=c=>{c.moveTo(0,0);c.bezierCurveTo(-17,-12,-14,-40,0,-45);c.bezierCurveTo(14,-40,17,-12,0,0)};vul(c,v,lg(c,0,0,0,-45,[[0,'#163a9a'],[.5,'#3d7cf0'],[1,'#bfe2ff']]),'#0e2466',2.2);rand(c,v,'rgba(255,255,255,.45)','rgba(0,0,40,.3)');c.strokeStyle='rgba(220,240,255,.55)';c.lineWidth=1.2;c.beginPath();c.moveTo(0,-6);c.lineTo(0,-36);c.stroke();c.restore()}
 for(let i=0;i<6;i++){c.save();c.rotate(i*Math.PI/3+Math.PI/6);const v=c=>{c.moveTo(0,0);c.bezierCurveTo(-9,-8,-8,-24,0,-27);c.bezierCurveTo(8,-24,9,-8,0,0)};vul(c,v,lg(c,0,0,0,-27,[[0,'#3a6ae0'],[1,'#e6f4ff']]),'#1a3a90',1.6);c.restore()}
 c.save();c.shadowColor='#fff4a0';c.shadowBlur=12*SK;vul(c,c=>c.arc(0,0,10,0,7),rg(c,-3,-3,1,0,0,10,[[0,'#ffffff'],[.4,'#fff3a0'],[1,'#e0a820']]),'#8a6410',1.6);c.restore();
 c.fillStyle='#fff8d8';c.beginPath();c.arc(0,0,6,0,7);c.arc(2.5,-1.5,5,0,7,true);c.fill('evenodd');glim(c,-14,-22,7,4)},
fladderbloem(c){schaduw(c,44,26,5);
 [[16,46,0,'#e09a10','#ffd84a'],[16,36,Math.PI/16,'#f0b020','#fff0a0']].forEach(([n,l,o,k1,k2])=>{for(let i=0;i<n;i++){c.save();c.rotate(o+i*2*Math.PI/n);const v=c=>{c.moveTo(-5,-10);c.quadraticCurveTo(-7,-l*.6,0,-l);c.quadraticCurveTo(7,-l*.6,5,-10);c.closePath()};vul(c,v,lg(c,0,-10,0,-l,[[0,k1],[1,k2]]),'#8a5a08',1.6);c.restore()}});
 const v=c=>c.arc(0,0,16,0,7);vul(c,v,rg(c,-4,-4,1,0,0,16,[[0,'#9a6a2a'],[.6,'#5a3410'],[1,'#2a1606']]),'#1e0f04',2);
 c.fillStyle='rgba(255,210,120,.55)';for(let i=0;i<34;i++){const a=i*2.4,r=Math.sqrt(i)*2.5;c.beginPath();c.arc(Math.cos(a)*r,Math.sin(a)*r,1.1,0,7);c.fill()}
 rand(c,v,'rgba(255,220,150,.4)','rgba(0,0,0,.4)');glim(c,-20,-20,8,4)},
varenblad(c){schaduw(c,44,22,5);c.save();c.rotate(.18);
 const pad=t=>{const x=-6+Math.sin(t*2.6)*9,y=44-t*84;return[x,y]};
 for(let i=1;i<=9;i++){const t=i/10.5,[x,y]=pad(t),l=24*(1-t*.6);blad(c,x,y,-1.25+t*.25,l,7,'#b6f07a','#2f8a34','#1b5a20');blad(c,x,y,1.25-t*.25,l,7,'#a6e86a','#287a2e','#1b5a20')}
 c.strokeStyle='#1b5a20';c.lineWidth=6;c.lineCap='round';c.beginPath();for(let t=0;t<=1;t+=.05){const[x,y]=pad(t);t?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();c.strokeStyle='#5cbf4a';c.lineWidth=3;c.stroke();
 const[tx,ty]=pad(1);c.strokeStyle='#2f8a34';c.lineWidth=5;c.beginPath();for(let a=0;a<9;a+=.3){const r=9-a;c.lineTo(tx+3+Math.cos(a)*r,ty+4+Math.sin(a)*r)}c.stroke();c.strokeStyle='#a6e86a';c.lineWidth=2;c.stroke();c.restore();glim(c,-8,-10,6,10,.2,.5)},
strikbes(c){schaduw(c,44,26,5);
 c.strokeStyle='#1e3a1a';c.lineWidth=4.5;c.lineCap='round';c.beginPath();c.moveTo(0,-14);c.bezierCurveTo(-4,-30,14,-34,10,-42);c.moveTo(4,-26);c.bezierCurveTo(14,-24,22,-30,24,-38);c.stroke();c.strokeStyle='#4a7a2a';c.lineWidth=2;c.stroke();
 blad(c,-2,-22,-1.1,22,9,'#8acc5a','#2a5a1e','#173a10');
 [[-14,10,16],[14,10,16],[0,-10,16],[0,24,13]].sort((a,b)=>a[1]-b[1]).forEach(([x,y,r])=>{const v=c=>c.arc(x,y,r,0,7);vul(c,v,rg(c,x-r*.35,y-r*.4,1,x,y,r,[[0,'#f2d4ff'],[.35,'#b060f0'],[1,'#4a1080']]),'#2a0650',2.2);rand(c,v,'rgba(255,230,255,.5)','rgba(30,0,60,.4)');glim(c,x-r*.38,y-r*.42,r*.38,r*.22);c.fillStyle='rgba(40,0,70,.5)';c.beginPath();c.arc(x+r*.25,y+r*.15,1.2,0,7);c.fill()})},
pompoen(c){schaduw(c,44,34,6);
 [[-24,15,24],[24,15,24],[-12,16,28],[12,16,28],[0,15,30]].forEach(([x,rx,ry],i)=>{const v=c=>c.ellipse(x,10,rx,ry,0,0,7);vul(c,v,rg(c,x-rx*.4,0,2,x,10,ry,[[0,'#ffd08a'],[.45,'#ff8a1e'],[1,'#b04a08']]),'#6a2a04',2.2);rand(c,v,'rgba(255,240,200,.35)','rgba(80,20,0,.35)')});
 c.fillStyle=lg(c,-4,-26,4,-12,[[0,'#8a6a3a'],[1,'#4a3216']]);c.beginPath();c.moveTo(-5,-14);c.quadraticCurveTo(-6,-26,2,-32);c.lineTo(7,-29);c.quadraticCurveTo(2,-24,4,-14);c.fill();c.strokeStyle='#2e1e0a';c.lineWidth=1.6;c.stroke();
 c.strokeStyle='#3e8a2a';c.lineWidth=2.4;c.beginPath();c.moveTo(4,-22);for(let a=0;a<10;a+=.4)c.lineTo(10+a*1.6+Math.cos(a*1.6)*3,-24-Math.sin(a*1.6)*3);c.stroke();blad(c,-6,-18,-1.3,16,8,'#9ee060','#2e7a2a','#1b4f1a');glim(c,-8,-2,7,11,.15,.6)},
uilenveer(c){schaduw(c,44,20,5);c.save();c.rotate(.5);
 const v=c=>{c.moveTo(0,44);c.bezierCurveTo(-20,20,-18,-30,0,-46);c.bezierCurveTo(20,-30,18,20,0,44)};vul(c,v,lg(c,-18,0,18,0,[[0,'#8a6038'],[.5,'#e8d4b0'],[1,'#9a7048']]),'#4a2e14');
 c.save();c.beginPath();v(c);c.clip();c.strokeStyle='rgba(90,55,25,.75)';c.lineWidth=4;for(let y=-34;y<40;y+=10){c.beginPath();c.moveTo(-20,y+6);c.quadraticCurveTo(0,y-4,20,y+6);c.stroke()}c.restore();rand(c,v);
 c.strokeStyle='#f4ead8';c.lineWidth=2.4;c.beginPath();c.moveTo(0,46);c.lineTo(0,-40);c.stroke();c.restore();glim(c,-8,-12,5,10,.5,.6)},
/* ---- Toverdranken ---- */
fles(c,vorm,k1,k2,k3){schaduw(c,45,24,5);const V={
  rond:c=>{c.moveTo(-6,-32);c.lineTo(-6,-14);c.arc(0,12,28,-Math.PI/2-.21,-Math.PI/2+.21+Math.PI*2-0.01,true);c.lineTo(6,-32);c.closePath()},
  slank:c=>{c.moveTo(-6,-36);c.lineTo(-6,-28);c.quadraticCurveTo(-14,-26,-14,-16);c.lineTo(-14,34);c.quadraticCurveTo(-14,44,0,44);c.quadraticCurveTo(14,44,14,34);c.lineTo(14,-16);c.quadraticCurveTo(14,-26,6,-28);c.lineTo(6,-36);c.closePath()},
  kegel:c=>{c.moveTo(-7,-36);c.lineTo(-7,-12);c.lineTo(-30,32);c.quadraticCurveTo(-33,42,-22,42);c.lineTo(22,42);c.quadraticCurveTo(33,42,30,32);c.lineTo(7,-12);c.lineTo(7,-36);c.closePath()},
  hart:c=>{c.moveTo(-6,-34);c.lineTo(-6,-16);c.bezierCurveTo(-18,-28,-38,-14,-30,6);c.bezierCurveTo(-24,20,-6,32,0,42);c.bezierCurveTo(6,32,24,20,30,6);c.bezierCurveTo(38,-14,18,-28,6,-16);c.lineTo(6,-34);c.closePath()},
  ruit:c=>{c.moveTo(-6,-36);c.lineTo(-6,-22);c.lineTo(-30,6);c.lineTo(0,42);c.lineTo(30,6);c.lineTo(6,-22);c.lineTo(6,-36);c.closePath()}}[vorm];
 c.save();c.shadowColor=k2;c.shadowBlur=10*SK;vul(c,V,'rgba(220,240,255,.28)');c.restore();
 c.save();c.beginPath();V(c);c.clip();const top=vorm=='slank'?-6:-6;c.fillStyle=lg(c,0,top,0,44,[[0,k1],[.5,k2],[1,k3]]);c.fillRect(-40,top,80,60);
 c.fillStyle=k1;c.globalAlpha=.9;c.beginPath();c.ellipse(0,top,40,3.5,0,0,7);c.fill();c.globalAlpha=1;
 c.fillStyle='rgba(255,255,255,.55)';[[-8,22,2.6],[6,30,2],[2,12,1.6],[10,18,1.2],[-4,34,1.4]].forEach(([x,y,r])=>{c.beginPath();c.arc(x,y,r,0,7);c.fill()});
 c.fillStyle='rgba(255,255,255,.22)';c.fillRect(-40,-50,80,12);c.restore();
 c.beginPath();V(c);c.lineWidth=2.6;c.strokeStyle='rgba(30,30,60,.85)';c.stroke();rand(c,V,'rgba(255,255,255,.7)','rgba(0,0,30,.35)');
 c.save();c.beginPath();V(c);c.clip();c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.ellipse(-14,8,3.5,18,.15,0,7);c.fill();c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.ellipse(16,14,2,12,-.1,0,7);c.fill();c.restore();
 c.fillStyle=lg(c,-8,-46,8,-34,[[0,'#d8a868'],[1,'#7a4a1e']]);c.beginPath();c.roundRect(-8,-46,16,13,3);c.fill();c.strokeStyle='#3e220a';c.lineWidth=1.8;c.stroke();c.fillStyle='rgba(255,230,180,.6)';c.fillRect(-6,-44,4,9);
 c.fillStyle='#e9d9b0';c.strokeStyle='#8a6a30';c.lineWidth=1.2;c.beginPath();c.roundRect(-8,-31,16,4,2);c.fill();c.stroke();punt(c,-16,-4,4,.9)},
ketel(c){schaduw(c,44,32,6);
 c.strokeStyle='#3a2410';c.lineWidth=4;c.beginPath();c.arc(0,-6,30,Math.PI*1.08,Math.PI*1.92);c.stroke();c.strokeStyle='#c98a4a';c.lineWidth=1.6;c.stroke();
 c.fillStyle='#3a2410';[[-20,36],[20,36],[0,40]].forEach(([x,y])=>{c.beginPath();c.roundRect(x-4,y,8,8,2);c.fill()});
 const v=c=>{c.moveTo(-32,-6);c.bezierCurveTo(-38,30,-20,42,0,42);c.bezierCurveTo(20,42,38,30,32,-6);c.closePath()};vul(c,v,rg(c,-12,4,2,0,10,40,[[0,'#ffd0a0'],[.35,'#e0803a'],[1,'#7a3410']]),'#3e1a06');rand(c,v,'rgba(255,230,190,.55)');
 c.fillStyle=lg(c,0,-14,0,0,[[0,'#d08a50'],[1,'#7a3a14']]);c.beginPath();c.ellipse(0,-6,35,9,0,0,7);c.fill();c.strokeStyle='#3e1a06';c.lineWidth=2.4;c.stroke();
 c.save();c.shadowColor='#7aff9a';c.shadowBlur=12*SK;c.fillStyle=rg(c,0,-6,1,0,-6,30,[[0,'#d8ffc0'],[.5,'#5ae07a'],[1,'#1e8a4a']]);c.beginPath();c.ellipse(0,-6,29,6,0,0,7);c.fill();c.restore();
 c.fillStyle='rgba(230,255,220,.85)';[[-10,-10,4],[6,-12,5],[16,-9,3],[0,-20,3],[-4,-28,2]].forEach(([x,y,r])=>{c.beginPath();c.arc(x,y,r,0,7);c.fill()});c.strokeStyle='rgba(30,100,50,.6)';c.lineWidth=1;
 glim(c,-16,10,6,12,.2,.6)},
/* ---- Bezweringen / Astronomie ---- */
veer(c){schaduw(c,44,18,4);c.save();c.rotate(.55);
 const v=c=>{c.moveTo(0,42);c.bezierCurveTo(-22,10,-20,-28,2,-48);c.bezierCurveTo(14,-30,22,0,0,42)};vul(c,v,lg(c,-20,0,20,0,[[0,'#1a8aa0'],[.5,'#9af0ff'],[1,'#2ab0c8']]),'#0a4a5a');
 c.save();c.beginPath();v(c);c.clip();c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=1.2;for(let y=-40;y<40;y+=5){c.beginPath();c.moveTo(0,y+8);c.lineTo(-24,y-6);c.moveTo(0,y+8);c.lineTo(24,y-4);c.stroke()}c.fillStyle='rgba(0,0,0,.0)';c.restore();rand(c,v);
 c.strokeStyle='#fffbe8';c.lineWidth=3;c.beginPath();c.moveTo(0,48);c.quadraticCurveTo(-2,0,2,-44);c.stroke();c.fillStyle='#2a2a3a';c.beginPath();c.moveTo(-2,46);c.lineTo(0,54);c.lineTo(2,46);c.fill();c.restore();glim(c,-6,-14,5,12,.55,.6)},
boek(c){schaduw(c,44,32,6);c.save();c.rotate(-.12);
 c.fillStyle='#f4ead0';c.strokeStyle='#8a7450';c.lineWidth=1.5;c.beginPath();c.roundRect(-26,-30,56,64,4);c.fill();c.stroke();c.strokeStyle='rgba(140,110,60,.5)';c.lineWidth=1;for(let i=0;i<5;i++){c.beginPath();c.moveTo(29,-26+i*12);c.lineTo(29,-20+i*12);c.stroke()}
 const v=c=>c.roundRect(-30,-36,56,66,5);vul(c,v,lg(c,-30,-36,26,30,[[0,'#5ad07a'],[.5,'#228a44'],[1,'#0e4a22']]),'#06301a');rand(c,v);
 c.fillStyle='#0e4a22';c.fillRect(-30,-36,8,66);c.strokeStyle='#ffd34d';c.lineWidth=2;c.beginPath();c.roundRect(-18,-28,38,50,3);c.stroke();
 c.fillStyle=lg(c,0,-12,0,8,[[0,'#fff3b0'],[1,'#c08a10']]);c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?4.5:10;c.lineTo(1+Math.cos(a)*q,-4+Math.sin(a)*q)}c.fill();c.strokeStyle='#6a4a08';c.lineWidth=1;c.stroke();
 c.fillStyle='#ffd34d';[[-30,-36],[26,-36],[-30,30],[26,30]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,4.5,0,7);c.fill()});c.restore();glim(c,-14,-22,10,5)},
ster(c){schaduw(c,44,24,5);c.save();c.shadowColor='#ffe070';c.shadowBlur=14*SK;
 const P=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?19:44;P.push([Math.cos(a)*q,Math.sin(a)*q+3])}
 const v=c=>{P.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath()};vul(c,v,'#f0b020','#7a5004',3);c.restore();
 for(let i=0;i<10;i++){const[a1,b1]=P[i],[a2,b2]=P[(i+1)%10];c.fillStyle=i%2?'#ffe57a':'#e09a10';c.beginPath();c.moveTo(0,3);c.lineTo(a1,b1);c.lineTo(a2,b2);c.fill()}
 c.beginPath();v(c);c.strokeStyle='#7a5004';c.lineWidth=2.6;c.lineJoin='round';c.stroke();rand(c,v,'rgba(255,255,230,.7)','rgba(120,60,0,.3)');glim(c,-8,-12,10,5);punt(c,-12,-16,5)},
toverstok(c){schaduw(c,44,26,5);c.save();c.rotate(-.78);
 c.save();c.shadowColor='#9ad8ff';c.shadowBlur=20*SK;c.fillStyle=rg(c,0,-40,0,0,-40,16,[[0,'rgba(255,255,255,1)'],[.3,'rgba(170,220,255,.9)'],[1,'rgba(120,180,255,0)']]);c.beginPath();c.arc(0,-40,16,0,7);c.fill();c.restore();
 const v=c=>{c.moveTo(-2,-38);c.lineTo(2,-38);c.lineTo(5.5,26);c.lineTo(-5.5,26);c.closePath()};vul(c,v,lg(c,-5,0,5,0,[[0,'#5a2e10'],[.45,'#c48a50'],[1,'#4a240a']]),'#2a1404',2);
 const h=c=>{c.moveTo(-6,22);c.quadraticCurveTo(-9,36,-7,46);c.quadraticCurveTo(0,50,7,46);c.quadraticCurveTo(9,36,6,22);c.closePath()};vul(c,h,lg(c,-7,0,7,0,[[0,'#3a1a06'],[.45,'#8a5428'],[1,'#2a1204']]),'#1a0a02',2);
 c.fillStyle='#e8c040';[24,34,44].forEach(y=>{c.beginPath();c.roundRect(-7.5,y-1.5,15,3,1.5);c.fill()});c.restore();
 c.save();c.translate(Math.cos(-.78-Math.PI/2)*40,Math.sin(-.78-Math.PI/2)*40);punt(c,0,0,14);c.rotate(.4);punt(c,0,0,8,.8);c.restore()},
bol(c){schaduw(c,46,26,5);
 c.fillStyle=lg(c,-20,30,20,46,[[0,'#ffe58a'],[.5,'#c9a227'],[1,'#7a5a10']]);c.beginPath();c.moveTo(-14,26);c.lineTo(14,26);c.lineTo(22,42);c.quadraticCurveTo(0,48,-22,42);c.closePath();c.fill();c.strokeStyle='#4a3404';c.lineWidth=2;c.stroke();
 const v=c=>c.arc(0,-4,30,0,7);c.save();c.shadowColor='#c8a0ff';c.shadowBlur=14*SK;vul(c,v,rg(c,-10,-14,2,0,-4,30,[[0,'#f6ecff'],[.45,'#a07aff'],[1,'#3a1a8a']]),'#1e0a50');c.restore();
 c.save();c.beginPath();v(c);c.clip();c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=5;c.beginPath();for(let a=0;a<12;a+=.2){const r=a*2.2;c.lineTo(Math.cos(a)*r,-4+Math.sin(a)*r*.6)}c.stroke();c.restore();
 rand(c,v,'rgba(255,255,255,.6)','rgba(20,0,60,.4)');glim(c,-12,-16,10,6);punt(c,10,6,3,.8)},
boon(c){schaduw(c,44,30,6);
 const v2=c=>c.ellipse(16,18,14,10,.5,0,7);vul(c,v2,rg(c,12,14,1,16,18,14,[[0,'#fff6c8'],[.5,'#f2d24a'],[1,'#a08010']]),'#6a5208');rand(c,v2);glim(c,12,13,5,3);
 const v=c=>{c.moveTo(-30,-6);c.bezierCurveTo(-34,-30,0,-38,14,-22);c.bezierCurveTo(22,-14,32,-6,26,14);c.bezierCurveTo(20,30,-6,26,-10,14);c.bezierCurveTo(-14,4,-26,14,-30,-6)};
 vul(c,v,rg(c,-12,-18,2,-2,-4,36,[[0,'#ffd0dc'],[.4,'#ff5a7a'],[1,'#a01436']]),'#5a0418');rand(c,v);
 c.fillStyle='rgba(120,0,30,.55)';[[-16,-16],[-4,-24],[6,-10],[16,0],[-20,-2],[8,8],[-6,4]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,1.8,0,7);c.fill()});glim(c,-14,-20,11,5,-.4)},
maan(c){schaduw(c,44,22,5);const t=document.createElement('canvas');t.width=t.height=216;const m=t.getContext('2d');m.translate(108,108);m.scale(2,2);const o=SK;SK=o;
 const v=c=>c.arc(0,0,37,0,7);vul(m,v,rg(m,12,0,2,12,6,42,[[0,'#ffffff'],[.5,'#c8dcff'],[1,'#6a86c8']]),'#2a3a6a',3);m.fillStyle='rgba(80,100,160,.35)';[[18,-14,5],[24,8,4],[10,24,3.5],[28,-2,2.5]].forEach(([x,y,r])=>{m.beginPath();m.arc(x,y,r,0,7);m.fill()});rand(m,v);
 m.globalCompositeOperation='destination-out';m.fillStyle='#000';m.beginPath();m.arc(-16,-12,31,0,7);m.fill();m.globalCompositeOperation='source-over';m.strokeStyle='rgba(42,58,106,.9)';m.lineWidth=2.4;m.save();m.beginPath();m.arc(0,0,37,0,7);m.clip();m.beginPath();m.arc(-16,-12,31,0,7);m.stroke();m.restore();
 c.save();c.shadowColor='#d8e8ff';c.shadowBlur=16*SK;c.drawImage(t,-54,-54,108,108);c.restore();glim(c,22,-14,6,3,.6,.7);punt(c,-22,-26,6);punt(c,-12,26,3.5,.8)}
};
const RECEPT={
 herbologie:[['Mandragora','#ff6fa8','mandragora'],['Maanbloem','#3d7cf0','maanbloem'],['Fladderbloem','#ffc21a','fladderbloem'],['Varenblad','#3fb34a','varenblad'],['Duivelsstrik-bes','#a24ae0','strikbes'],['Pompoen','#ff7f1a','pompoen']],
 toverdranken:[['Rood flesje','#ff3a40',c=>D.fles(c,'rond','#ff9a9a','#e8202a','#7a0410')],['Groen flesje','#36d05a',c=>D.fles(c,'slank','#b8ffb0','#2ac04a','#0a5a20')],['Blauw flesje','#3a8cff',c=>D.fles(c,'kegel','#bfe2ff','#2a7aff','#0a2a8a')],['Gouden flesje','#ffc22a',c=>D.fles(c,'hart','#fff6b0','#ffc21a','#a06a04')],['Paars flesje','#b04ae8',c=>D.fles(c,'ruit','#f0c8ff','#a83ae8','#4a0a7a')],['Ketel','#d9783a','ketel']],
 bezweringen:[['Veer','#4ad0e8','veer'],['Toverboek','#2aa84e','boek'],['Ster','#ffc21a','ster'],['Toverstok','#b07040','toverstok'],['Kristallen bol','#a07aff','bol'],['Smakkerboon','#ff4a6a','boon']]};
RECEPT.astronomie=RECEPT.bezweringen.map((x,i)=>i==1?['Maan','#b8d0ff','maan']:x);
RECEPT.fabeldieren=RECEPT.herbologie.map((x,i)=>i==3?['Uilenveer','#c9a070','uilenveer']:x);
const CACHE={};
function teken(c,f){typeof f=='function'?f(c):D[f](c)}
function beeld(thema,k,px){const key=thema+k+'_'+px;if(CACHE[key])return CACHE[key];const cv=document.createElement('canvas');cv.width=cv.height=px;const c=cv.getContext('2d');SK=px/100;c.translate(px/2,px/2);c.scale(px/108,px/108);const R=(RECEPT[thema]||RECEPT.herbologie)[k];if(R)teken(c,R[2]);return CACHE[key]=cv}
const URL_={};function url(thema,k){const key=thema+k;return URL_[key]||(URL_[key]=beeld(thema,k,128).toDataURL())}
/* power-ups */
function speciaal(s,px){const key='sp'+s+px;if(CACHE[key])return CACHE[key];const cv=document.createElement('canvas');cv.width=cv.height=px;const c=cv.getContext('2d');SK=px/100;c.translate(px/2,px/2);c.scale(px/108,px/108);
 if(s=='staf'){c.scale(.78,.78);c.rotate(-Math.PI/4);c.save();c.shadowColor='#fff3a0';c.shadowBlur=18*SK;const v=c=>{c.moveTo(-3,-44);c.lineTo(3,-44);c.lineTo(7,30);c.lineTo(-7,30);c.closePath()};vul(c,v,lg(c,-7,0,7,0,[[0,'#f0e0c0'],[.5,'#fffaf0'],[1,'#c8b088']]),'#6a4a18',2.4);c.restore();
  const h=c=>{c.moveTo(-8,24);c.quadraticCurveTo(-11,40,-8,50);c.quadraticCurveTo(0,54,8,50);c.quadraticCurveTo(11,40,8,24);c.closePath()};vul(c,h,lg(c,-8,0,8,0,[[0,'#7a5a10'],[.5,'#ffe58a'],[1,'#7a5a10']]),'#4a3404',2);c.fillStyle='#c0392b';c.beginPath();c.arc(0,38,3.5,0,7);c.fill();c.translate(0,-46);punt(c,0,0,16);c.rotate(.4);punt(c,0,0,9)}
 if(s=='ketel'){c.scale(.92,.92);D.ketel(c)}
 if(s=='snaai'){c.save();c.shadowColor='#ffe58a';c.shadowBlur=16*SK;const v=c=>c.arc(0,0,20,0,7);vul(c,v,rg(c,-7,-7,1,0,0,20,[[0,'#fffbe0'],[.4,'#ffd84a'],[1,'#a06a04']]),'#5a3a02',2);c.restore();c.strokeStyle='rgba(120,70,0,.7)';c.lineWidth=1.4;c.beginPath();c.arc(0,0,20,-.4,1.2);c.moveTo(-20,0);c.quadraticCurveTo(0,8,20,0);c.stroke();rand(c,c=>c.arc(0,0,20,0,7));glim(c,-7,-8,7,4)}
 return CACHE[key]=cv}
function vleugel(c,R,f,kant){c.save();c.scale(kant,1);c.rotate(-.3-f*.6);const g=lg(c,0,0,R*1.3,0,[[0,'rgba(255,255,255,.95)'],[1,'rgba(220,230,255,.6)']]);c.fillStyle=g;c.strokeStyle='rgba(120,120,150,.8)';c.lineWidth=1.2;c.beginPath();c.moveTo(0,0);c.bezierCurveTo(R*.4,-R*.6,R*1.2,-R*.7,R*1.4,-R*.35);c.bezierCurveTo(R*1.1,-R*.2,R*1.2,0,R*.9,R*.1);c.bezierCurveTo(R*.6,0,R*.4,R*.1,0,0);c.fill();c.stroke();c.strokeStyle='rgba(150,150,180,.6)';for(let i=1;i<4;i++){c.beginPath();c.moveTo(R*.1,0);c.lineTo(R*(.4+i*.3),-R*(.5-i*.08));c.stroke()}c.restore()}
function uil(c,R,f){// sneeuwuil, live getekend
 c.save();c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(0,R*.95,R*.6,R*.12,0,0,7);c.fill();c.restore();
 [-1,1].forEach(k=>{c.save();c.scale(k,1);c.translate(R*.3,R*.05);c.rotate(-f*.8);c.fillStyle=lg(c,0,0,R*.9,0,[[0,'#ffffff'],[1,'#d8d8e8']]);c.strokeStyle='#6a6a7a';c.lineWidth=1.4;c.beginPath();c.moveTo(0,-R*.3);c.bezierCurveTo(R*.6,-R*.55,R*1.05,-R*.1,R*.95,R*.45);c.bezierCurveTo(R*.6,R*.3,R*.3,R*.5,0,R*.4);c.closePath();c.fill();c.stroke();c.fillStyle='#4a4a5a';[[.5,0],[.7,.15],[.45,.25]].forEach(([x,y])=>{c.beginPath();c.arc(R*x,R*y,R*.04,0,7);c.fill()});c.restore()});
 const v=c=>c.ellipse(0,R*.15,R*.5,R*.72,0,0,7);vul(c,v,rg(c,-R*.2,-R*.2,1,0,R*.1,R*.8,[[0,'#ffffff'],[.6,'#f0f0f6'],[1,'#b8b8c8']]),'#5a5a6a',1.6);
 c.fillStyle='#5a5a6a';[[-.2,.4],[.15,.55],[-.05,.7],[.25,.3],[-.28,.62]].forEach(([x,y])=>{c.beginPath();c.ellipse(R*x,R*y,R*.05,R*.03,0,0,7);c.fill()});
 c.fillStyle='#ffffff';c.beginPath();c.ellipse(0,-R*.22,R*.42,R*.32,0,0,7);c.fill();c.strokeStyle='#8a8a9a';c.lineWidth=1;c.stroke();
 [-1,1].forEach(k=>{c.fillStyle=rg(c,k*R*.17,-R*.24,0,k*R*.17,-R*.24,R*.13,[[0,'#ffe680'],[1,'#e0a010']]);c.beginPath();c.arc(k*R*.17,-R*.24,R*.12,0,7);c.fill();c.fillStyle='#111';c.beginPath();c.arc(k*R*.17,-R*.23,R*.06,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(k*R*.15,-R*.27,R*.025,0,7);c.fill()});
 c.fillStyle='#3a3a3a';c.beginPath();c.moveTo(-R*.05,-R*.12);c.lineTo(R*.05,-R*.12);c.lineTo(0,-R*.02);c.fill()}
/* sterrenstof-sprites per kleur */
const STOF={};function stof(kl){if(STOF[kl])return STOF[kl];const cv=document.createElement('canvas');cv.width=cv.height=32;const c=cv.getContext('2d');c.translate(16,16);c.fillStyle=rg(c,0,0,0,0,0,16,[[0,'rgba(255,255,255,1)'],[.25,kl],[1,'rgba(0,0,0,0)']]);c.beginPath();c.arc(0,0,16,0,7);c.fill();c.fillStyle='rgba(255,255,255,.95)';c.beginPath();for(let i=0;i<8;i++){const q=i%2?2:15,a=i*Math.PI/4;c.lineTo(Math.cos(a)*q,Math.sin(a)*q)}c.fill();return STOF[kl]=cv}
return{D,RECEPT,beeld,url,speciaal,uil,vleugel,stof,punt,glim}})();
/* thema's aanpassen: namen + kleuren (paden blijven voor oude iconen) */
Object.entries(KU.RECEPT).forEach(([th,lijst])=>{const T=M3THEMA[th];if(!T)return;T.id=th;T.t=lijst.map((r,i)=>[r[0],r[1],(T.t[i]||[])[2]||'M12 4v16'])});
tegelBeeld=function(T,k,cel){return KU.beeld(T.id||'herbologie',k,Math.round(cel*2))};
m3DoelIco=function(d,T){if(typeof d[0]=='number')return `<img class="m3ico m3stuk" src="${KU.url(T.id||'herbologie',d[0])}" alt="${T.t[d[0]][0]}">`;const kleur=d[0]=='o'?'#6b8f3a':d[0]=='k'?'#8a5a2b':'#c9a227';const p=d[0]=='o'?'M12 21V4M12 7l-4-2M12 7l4-2M12 11l-5-2M12 11l5-2M12 15l-5-2M12 15l5-2':d[0]=='k'?'M4 7h16v13H4zM4 7l2-3h12l2 3M4 12h16':'M5 8h14l-2 12H7zM4 5h16v3H4z';
 return `<svg viewBox="0 0 24 24" class="m3ico" style="background:${kleur}"><path d="${p}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`};
/* Sterren rechtsboven, telt geanimeerd op */
(()=>{const _s=stats;let getoond=null,anim=null;stats=function(){_s();const h=document.querySelector('header');if(!h)return;let b=$('#sterbadge');if(!b){b=document.createElement('div');b.id='sterbadge';b.innerHTML=`<svg viewBox="0 0 24 24"><defs><linearGradient id="sbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6b0"/><stop offset=".5" stop-color="#ffc21a"/><stop offset="1" stop-color="#b07a04"/></linearGradient></defs><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="url(#sbg)" stroke="#7a5004" stroke-width="1.2" stroke-linejoin="round"/></svg><b>0</b>`;b.title='Sterren';const l=$('#luid');l?h.insertBefore(b,l):h.appendChild(b)}
 const n=S.sterren||0;if(getoond==null){getoond=+(sessionStorage.getItem('zw_sterg')??n);if(getoond>n)getoond=n}
 if(n>getoond&&!anim){const van=getoond,t0=performance.now(),dur=RMP?1:Math.min(1600,500+(n-van)*250);b.classList.add('telt');let laatste=van;
  const stap=t=>{const p=Math.min(1,(t-t0)/dur),v=Math.round(van+(n-van)*(1-Math.pow(1-p,3)));if(v!==laatste){laatste=v;try{fx.speel('munt')}catch(e){}b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}b.querySelector('b').textContent=v;if(p<1)anim=requestAnimationFrame(stap);else{anim=null;getoond=n;sessionStorage.setItem('zw_sterg',n);b.classList.remove('telt')}};anim=requestAnimationFrame(stap)}
 else if(!anim){getoond=n;sessionStorage.setItem('zw_sterg',n);b.querySelector('b').textContent=n}};
 try{stats()}catch(e){}})();
