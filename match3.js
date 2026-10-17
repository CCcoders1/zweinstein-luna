'use strict';(()=>{const l=n=>{const i=new Image();i.src=`img/stukken/${n}-128.webp`;return i};window._rank1=l('rank1');window._rank2=l('rank2')})();
/* ====== Match-3 hoofdspel (eigen engine, canvas) ====== */

/* ====== kistjes met planken: vooraf gerenderde sprites per staat (2-3 planken) ====== */
const KIST_CACHE={};
function kistSprite(n,thema,px){const key=n+thema+px;if(KIST_CACHE[key])return KIST_CACHE[key];const cv=document.createElement('canvas');cv.width=cv.height=px;const c=cv.getContext('2d');const s=px/100;c.scale(s,s);
 const rnd=(()=>{let x=7;return()=>(x=(x*16807)%2147483647)/2147483647})();
 // schaduw
 c.fillStyle='rgba(40,20,5,.35)';c.beginPath();c.ellipse(50,93,40,6,0,0,7);c.fill();
 // binnenkant (donker) met themavulling
 c.fillStyle='#3a210e';c.fillRect(10,12,80,78);
 const inh={toverdranken:'fles',gedaante:'kop',astronomie:'ster',bezweringen:'veer',verweer:'kaars'}[thema]||'stro';
 if(inh=='stro'){c.strokeStyle='#c9a24a';c.lineWidth=2;for(let i=0;i<26;i++){const x=14+rnd()*72,y=40+rnd()*46;c.beginPath();c.moveTo(x,y);c.lineTo(x+(rnd()-.5)*18,y-6-rnd()*10);c.stroke()}}
 if(inh=='fles')[[28,'#36d05a'],[50,'#c43a3a'],[72,'#4a7ae0']].forEach(([x,k])=>{c.fillStyle=k;c.beginPath();c.arc(x,66,11,0,7);c.fill();c.fillRect(x-4,42,8,16);c.fillStyle='#8a5a2a';c.fillRect(x-4,38,8,6);c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.arc(x-4,62,3,0,7);c.fill()});
 if(inh=='kop')[[30,62],[68,66]].forEach(([x,y])=>{c.fillStyle='#f4eee0';c.beginPath();c.moveTo(x-13,y-10);c.lineTo(x+13,y-10);c.lineTo(x+9,y+10);c.lineTo(x-9,y+10);c.fill();c.strokeStyle='#f4eee0';c.lineWidth=3;c.beginPath();c.arc(x+14,y-1,5,-1.4,1.4);c.stroke();c.fillStyle='#4a7ae0';c.fillRect(x-11,y-6,22,3)});
 if(inh=='ster'){c.fillStyle='#ffe58a';[[30,55],[62,70],[70,45]].forEach(([x,y])=>{c.beginPath();for(let i=0;i<10;i++){const r=i%2?4:10,a=i*Math.PI/5-Math.PI/2;c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}c.fill()})}
 if(inh=='veer'){c.strokeStyle='#f0ece4';c.lineWidth=7;c.lineCap='round';[[25,80,45,40],[55,82,75,42]].forEach(([a,b,d,e])=>{c.beginPath();c.moveTo(a,b);c.quadraticCurveTo(a+5,e+10,d,e);c.stroke()})}
 if(inh=='kaars'){[[32,'#efe6d0'],[62,'#efe6d0']].forEach(([x,k])=>{c.fillStyle=k;c.fillRect(x-5,48,10,36);c.fillStyle='#ffb84a';c.beginPath();c.ellipse(x,42,4,7,0,0,7);c.fill()})}
 // zijkanten (staanders) met nerf
 const hout=(x,y,w,h,licht)=>{const g=c.createLinearGradient(x,y,x,y+h);g.addColorStop(0,licht?'#e2aa6a':'#c98a4a');g.addColorStop(.5,licht?'#c98a4a':'#b0733a');g.addColorStop(1,'#8a5426');c.fillStyle=g;c.fillRect(x,y,w,h);c.strokeStyle='rgba(90,45,15,.35)';c.lineWidth=.8;for(let i=0;i<4;i++){c.beginPath();const yy=y+h*(.2+i*.2)+(rnd()-.5)*2;c.moveTo(x+2,yy);c.bezierCurveTo(x+w*.3,yy-2,x+w*.6,yy+2,x+w-2,yy);c.stroke()}c.strokeStyle='rgba(60,28,8,.75)';c.lineWidth=1.4;c.strokeRect(x+.7,y+.7,w-1.4,h-1.4)};
 hout(6,8,12,84);hout(82,8,12,84);hout(6,6,88,12,1);hout(6,82,88,12);
 // planken voorkant: n van 3 posities (bovenste eerst weg)
 const pos=[26,44,62],toon=n>=3?[0,1,2]:n==2?[1,2]:[2];
 toon.forEach(i=>{hout(15,pos[i],70,16,i==0);c.fillStyle='#5a5f6a';[[20,pos[i]+8],[80,pos[i]+8]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,1.8,0,7);c.fill();c.fillStyle='#9aa0aa';c.fillRect(x-.6,y-1.2,1,1);c.fillStyle='#5a5f6a'})});
 // ijzeren hoekbeslag
 c.fillStyle='#4a4f58';c.strokeStyle='#2a2d33';c.lineWidth=1;[[6,6,1,1],[94,6,-1,1],[6,94,1,-1],[94,94,-1,-1]].forEach(([x,y,dx,dy])=>{c.beginPath();c.moveTo(x,y);c.lineTo(x+16*dx,y);c.lineTo(x+16*dx,y+5*dy);c.lineTo(x+5*dx,y+5*dy);c.lineTo(x+5*dx,y+16*dy);c.lineTo(x,y+16*dy);c.closePath();c.fill();c.stroke();c.fillStyle='#9aa0aa';c.beginPath();c.arc(x+3.5*dx,y+3.5*dy,1.6,0,7);c.fill();c.fillStyle='#4a4f58'});
 // ingebrand runensymbool op de middelste/onderste plank
 if(n>=1){const y=n>=2?pos[1]+8:pos[2]+8;c.strokeStyle='rgba(60,25,5,.75)';c.lineWidth=1.8;c.beginPath();c.moveTo(44,y-5);c.lineTo(50,y+5);c.lineTo(56,y-5);c.moveTo(47,y);c.lineTo(53,y);c.stroke();c.strokeStyle='rgba(255,210,120,.35)';c.lineWidth=.8;c.stroke()}
 return KIST_CACHE[key]=cv}
function krak(groot){const ac=window._pipAc||(window._pipAc=new (window.AudioContext||window.webkitAudioContext)());const now=performance.now();if(now-(krak.t||0)<70)return;krak.t=now;if(window.fx&&fx.aan===false)return;const t=ac.currentTime,len=Math.floor(ac.sampleRate*(groot?.22:.1)),buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,groot?3:5)*(Math.random()<.15?1:.35);const s=ac.createBufferSource();s.buffer=buf;const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=groot?900:1500;f.Q.value=1.2;const g=ac.createGain();g.gain.value=groot?.35:.22;s.connect(f).connect(g).connect(ac.destination);s.start(t);try{navigator.vibrate&&navigator.vibrate(groot?[20,20,30]:12)}catch(e){}}
const M3THEMA={
 herbologie:{n:'Herbologie',onkruid:'Onkruid',kist:'Kistje',pot:'Mandragorapot',t:[
  ['Mandragora','#4f9a3c','M12 21V11M12 11c-5 0-7-4-7-8 4 0 7 2 7 8zM12 11c5 0 7-4 7-8-4 0-7 2-7 8zM9 21h6'],
  ['Zaadje','#b0773a','M12 3c4 4 5 9 0 18-5-9-4-14 0-18zM12 7v10'],
  ['Bloempot','#cf5f33','M5 8h14l-2 12H7zM4 5h16v3H4z'],
  ['Gieter','#3b80c4','M4 10h11v9H4zM15 12l5-4M7 10V7a3 3 0 016 0'],
  ['Bloesem','#d65b98','M12 12m-2.5 0a2.5 2.5 0 105 0 2.5 2.5 0 10-5 0M12 3a3 3 0 010 6M12 15a3 3 0 010 6M3 12a3 3 0 016 0M15 12a3 3 0 016 0'],
  ['Varenblad','#d9b42c','M12 21V4M12 7l-4-2M12 7l4-2M12 11l-5-2M12 11l5-2M12 15l-5-2M12 15l5-2']]},
 toverdranken:{n:'Toverdranken',onkruid:'Gemorst brouwsel',kist:'Ingrediëntenkist',pot:'Ketel',t:[
  ['Groen flesje','#3f9e57','M10 3h4M10 3v5l-4 7a4 4 0 004 6h4a4 4 0 004-6l-4-7V3'],
  ['Bezoar','#9a7a55','M6 10l4-5h5l4 5-2 8H8z'],
  ['Rood flesje','#c4413b','M9 3h6M10 3v4a6 6 0 104 0V3'],
  ['Florfliegen','#3b80c4','M12 8a2 2 0 110 4 2 2 0 010-4zM12 12v8M10 9C6 5 3 6 3 9s4 3 7 1M14 9c4-4 7-3 7 0s-4 3-7 1'],
  ['Hoornpoeder','#8b5cc4','M5 20c2-8 6-14 15-17-3 5-5 10-6 17z'],
  ['Feniksveer','#e0a92c','M5 20L19 6M19 6c-6 0-11 3-12 10 5-1 10-4 12-10z']]},
};
M3THEMA.bezweringen={n:'Bezweringen',onkruid:'Spinrag',kist:'Boekenkist',pot:'Zwevende veer',t:[['Veer','#4f9a3c',M3THEMA.toverdranken.t[5][2]],['Boek','#b0773a','M4 5h7a2 2 0 012 2v12a2 2 0 00-2-2H4zM20 5h-7v14h7z'],['Ster','#cf5f33','M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z'],['Toverstok','#3b80c4','M4 20L18 6M16 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1z'],['Kaars','#d65b98','M10 9h4v12h-4zM12 3c2 2 2 4 0 5-2-1-2-3 0-5z'],['Sleutel','#d9b42c','M8 14a4 4 0 110-.1M11 13h10M18 13v3M21 13v2']]};
M3THEMA.fabeldieren={n:'Verzorging van Fabeldieren',onkruid:'Modder',kist:'Voerkist',pot:'Drakenei',t:M3THEMA.herbologie.t.map((x,i)=>i==1?['Uilenveer','#b0773a',M3THEMA.toverdranken.t[5][2]]:x)};
M3THEMA.astronomie={n:'Astronomie',onkruid:'Sterrenstof',kist:'Telescoopkist',pot:'Hemelbol',t:M3THEMA.bezweringen.t.map((x,i)=>i==4?['Maan','#d65b98','M15 4a8 8 0 100 16 7 7 0 010-16z']:x)};
const P2D={};const TB={};
function tegelVorm(c,k,r){c.beginPath();switch(k%6){case 0:c.arc(0,0,r,0,7);break;case 1:c.moveTo(0,-r*1.05);c.lineTo(r*.95,0);c.lineTo(0,r*1.05);c.lineTo(-r*.95,0);c.closePath();break;case 2:c.roundRect(-r*.9,-r*.9,r*1.8,r*1.8,r*.35);break;case 3:for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath();break;case 4:c.moveTo(0,-r);c.bezierCurveTo(r*.9,-r*.1,r*.85,r*.95,0,r*.95);c.bezierCurveTo(-r*.85,r*.95,-r*.9,-r*.1,0,-r);break;case 5:for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*.62:r;c.lineTo(Math.cos(a)*q,Math.sin(a)*q)}c.closePath();break}}
function meng(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const t=f<0?0:255,p=Math.abs(f);r=Math.round((t-r)*p+r);g=Math.round((t-g)*p+g);b=Math.round((t-b)*p+b);return `rgb(${r},${g},${b})`}
function tegelBeeld(T,k,cel){const key=T.n+k+'_'+cel;if(TB[key])return TB[key];const d=2,cv=document.createElement('canvas');cv.width=cv.height=cel*d;const c=cv.getContext('2d');c.scale(d,d);c.translate(cel/2,cel/2);const r=cel*.42,[,kl,pd]=T.t[k];
 // schaduw
 c.save();c.translate(0,r*.1);c.fillStyle='rgba(0,0,0,.45)';c.filter='blur(2px)';tegelVorm(c,k,r);c.fill();c.restore();c.filter='none';
 // gouden rand
 const gr=c.createLinearGradient(-r,-r,r,r);gr.addColorStop(0,'#fff2b8');gr.addColorStop(.5,'#c9a227');gr.addColorStop(1,'#7a5a10');c.fillStyle=gr;tegelVorm(c,k,r);c.fill();
 // edelsteen-body
 const g=c.createRadialGradient(-r*.3,-r*.4,r*.05,0,0,r*1.05);g.addColorStop(0,meng(kl,.55));g.addColorStop(.45,kl);g.addColorStop(1,meng(kl,-.55));c.fillStyle=g;tegelVorm(c,k,r*.86);c.fill();
 // facetten
 c.save();tegelVorm(c,k,r*.86);c.clip();c.fillStyle='rgba(255,255,255,.12)';c.beginPath();c.moveTo(-r,-r);c.lineTo(r,-r);c.lineTo(0,0);c.fill();c.fillStyle='rgba(0,0,0,.14)';c.beginPath();c.moveTo(-r,r);c.lineTo(r,r);c.lineTo(0,0);c.fill();c.restore();
 // embleem
 c.save();const sc=r*1.05/24;c.scale(sc,sc);c.translate(-12,-12);c.lineCap='round';c.lineJoin='round';c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=3.6;c.translate(.4,.8);c.stroke(pad(pd));c.translate(-.4,-.8);c.strokeStyle='#fffaf0';c.lineWidth=2.3;c.stroke(pad(pd));c.fillStyle='rgba(255,255,255,.25)';c.fill(pad(pd));c.restore();
 // glazen highlight
 c.save();tegelVorm(c,k,r*.86);c.clip();const h=c.createLinearGradient(0,-r,0,0);h.addColorStop(0,'rgba(255,255,255,.75)');h.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=h;c.beginPath();c.ellipse(-r*.15,-r*.5,r*.6,r*.3,-.3,0,7);c.fill();c.restore();
 c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.arc(-r*.42,-r*.42,r*.07,0,7);c.fill();
 return TB[key]=cv}const pad=s=>P2D[s]||(P2D[s]=new Path2D(s));
/* deterministische rng */
const rngVan=seed=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
/* ---------- levels ---------- */
const HANDGEMAAKT=[ // [zetten, kleuren, doelen, onkruid-patroon, kisten, potten]
 [20,5,[[0,10]],0,0,0],[20,5,[[1,12],[3,12]],0,0,0],[18,5,[[2,18]],0,0,0],[20,5,[['o']],'midden',0,0],[22,5,[['o'],[0,10]],'rand',0,0],
 [20,5,[[4,20]],0,0,0],[22,5,[['o']],'kruis',0,0],[22,5,[['k']],0,'rij',0],[22,5,[['k'],[1,15]],0,'hoeken',0],[24,5,[['o'],['k']],'midden','rij',0],
 [22,5,[['p',2]],0,0,2],[24,5,[['p',3],[0,15]],0,0,3],[24,5,[['o'],['p',2]],'onder',0,2],[22,6,[[2,16],[5,16]],0,0,0],[24,5,[['k'],['p',2]],0,'hoeken',2],
 [24,6,[['o']],'vol',0,0],[25,6,[['k']],0,'dubbel',0],[24,6,[['p',4]],0,0,4],[25,6,[['o'],['k']],'kruis','hoeken',0],[26,6,[['o'],['p',3]],'vol',0,3],
 [24,6,[[0,25],[3,25]],0,0,0],[26,6,[['k'],['o']],'rand','dubbel',0],[25,6,[['p',5]],0,'rij',5],[26,6,[['o']],'dambord',0,0],[27,6,[['k'],['p',3],[1,15]],0,'dubbel',3],
 [26,6,[['o'],['k']],'vol','rij',0],[25,6,[[4,30]],'midden',0,0],[27,6,[['p',4],['o']],'dambord',0,4],[28,6,[['k'],['o'],['p',2]],'vol','dubbel',2],[30,6,[['o'],['k'],['p',4]],'dambord','dubbel',4]];
const RIJEN=8,KOL=7;
async function m3Kalibreer(n,thema){S.m3kal=S.m3kal||{};if(S.m3kal[n]!=null)return S.m3kal[n];const L={...m3Level(n)};L.zetten-=0;for(const e of [0,3,6,10,15,20,30]){if(await m3Oplosbaar({...L,zetten:L.zetten+e},thema)>=1){S.m3kal[n]=e;bewaar();return e}}S.m3kal[n]=30;bewaar();return 30}
function m3Level(n){// n vanaf 1
 const r=rngVan(n*7919+13);let L;
 if(n<=HANDGEMAAKT.length)L=HANDGEMAAKT[n-1];
 else{const d=n-30,ok=['midden','rand','kruis','onder','vol','dambord'],kk=['rij','hoeken','dubbel'];const doelen=[];
  const typ=[r()<.6?'o':null,r()<.5?'k':null,r()<.4?'p':null].filter(Boolean);if(!typ.length||r()<.3)doelen.push([r()*6|0,15+Math.min(25,d/2|0)]);
  typ.forEach(t=>doelen.push(t=='p'?['p',2+Math.min(4,d/10|0)]:[t]));
  L=[Math.max(18,30-Math.min(10,d/12|0))+(n>45?3:0),n>45?7:6,doelen,typ.includes('o')?ok[r()*ok.length|0]:0,typ.includes('k')?kk[r()*kk.length|0]:0,typ.includes('p')?2+Math.min(4,d/10|0):0]}
 return{n,zetten:L[0]+((S.m3kal||{})[n]||0),kleuren:L[1],doelen:L[2],onkruid:L[3],kist:L[4],pot:L[5],extra:+(S.m3extra||{})[n]||0}}
function patroon(p,r,c){if(!p)return 0;switch(p){case 'midden':return r>=2&&r<=5&&c>=2&&c<=4?1:0;case 'rand':return r==0||r==RIJEN-1||c==0||c==KOL-1?1:0;case 'kruis':return r==3||r==4||c==3?1:0;case 'onder':return r>=5?1:0;case 'vol':return r>=1?(r>=5?2:1):0;case 'dambord':return (r+c)%2&&r>=1?2:0}return 0}
function kistPat(p,r,c){if(!p)return 0;if(p=='rij')return r==4&&c%2==1?2:0;if(p=='hoeken')return (r==6||r==7)&&(c<=1||c>=5)?2:0;if(p=='dubbel')return r==4&&c>=1&&c<=5?3:0;return 0}
/* ---------- bord ---------- */
class Bord{
 constructor(L,thema,sim){this.L=L;this.T=M3THEMA[thema]||M3THEMA.herbologie;this.sim=sim;this.rng=sim?rngVan(L.n*31+(sim|0)):Math.random;this.zet=L.zetten+(L.extra||0);
  this.g=[];this.lay=[];this.kist=[];this.score=0;this.combo=0;this.doel=L.doelen.map(d=>({t:d[0],n:d[1]||0,over:0}));this.potOver=L.pot;this.ksoort=L.kistSoort||'k';this.potGeplaatst=0;this.fx=[];
  for(let r=0;r<RIJEN;r++){this.g.push([]);this.lay.push([]);this.kist.push([]);for(let c=0;c<KOL;c++){this.lay[r][c]=patroon(L.onkruid,r,c);this.kist[r][c]=kistPat(L.kist,r,c);if(L.kistSoort=='d'&&this.kist[r][c])this.kist[r][c]=Math.min(2,this.kist[r][c]);this.g[r][c]=null}}
  for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++)if(!this.kist[r][c]){let k;do k=this.rng()*L.kleuren|0;while((c>=2&&this.k(r,c-1)==k&&this.k(r,c-2)==k)||(r>=2&&this.k(r-1,c)==k&&this.k(r-2,c)==k));this.g[r][c]=this.tegel(k,r,c,r)}
  // potten bovenaan
  for(let i=0;i<Math.min(2,L.pot);i++){const c=1+i*4;this.g[0][c]=this.tegel(-1,0,c,0);this.potGeplaatst++}
  this.doel.forEach(d=>{if(d.t=='o')d.n=this.lay.flat().reduce((a,b)=>a+b,0);if(d.t=='k'||d.t=='i'||d.t=='d')d.n=this.kist.flat().filter(v=>v>0).length;d.over=d.n});
  if(typeof this.strikInit==='function')this.strikInit();
  if(!this.heeftZet())this.schud()}
 tegel(k,r,c,van){return{k,s:null,x:c,y:sim0(this)?r:(van===undefined?r:van-RIJEN),sc:1,vy:0,id:Math.random()}}
 k(r,c){const t=this.g[r]&&this.g[r][c];return t?t.k:-9}
 binnen(r,c){return r>=0&&r<RIJEN&&c>=0&&c<KOL}
 runs(){const res=[];for(let r=0;r<RIJEN;r++){let c=0;while(c<KOL){const k=this.k(r,c);let e=c;while(e+1<KOL&&this.k(r,e+1)==k)e++;if(k>=0&&e-c>=2)res.push({h:1,cel:Array.from({length:e-c+1},(_,i)=>[r,c+i])});c=e+1}}
  for(let c=0;c<KOL;c++){let r=0;while(r<RIJEN){const k=this.k(r,c);let e=r;while(e+1<RIJEN&&this.k(e+1,c)==k)e++;if(k>=0&&e-r>=2)res.push({h:0,cel:Array.from({length:e-r+1},(_,i)=>[r+i,c])});r=e+1}}
  for(let r=0;r<RIJEN-1;r++)for(let c=0;c<KOL-1;c++){const k=this.k(r,c);if(k>=0&&this.k(r,c+1)==k&&this.k(r+1,c)==k&&this.k(r+1,c+1)==k)res.push({sq:1,cel:[[r,c],[r,c+1],[r+1,c],[r+1,c+1]]})}
  return res}
 groepen(rs){const gs=[];rs.forEach(run=>{const key=run.cel.map(x=>x+'');const g=gs.find(g=>run.cel.some(x=>g.set.has(x+'')));if(g){run.cel.forEach(x=>g.set.add(x+''));g.runs.push(run)}else gs.push({set:new Set(key),runs:[run]})});
  // samenvoegen
  for(let i=0;i<gs.length;i++)for(let j=gs.length-1;j>i;j--)if([...gs[j].set].some(x=>gs[i].set.has(x))){gs[j].set.forEach(x=>gs[i].set.add(x));gs[i].runs.push(...gs[j].runs);gs.splice(j,1)}
  return gs}
 heeftZet(){for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=this.g[r][c];if(!t)continue;if(t.s)return true;for(const[dr,dc]of[[0,1],[1,0]]){const r2=r+dr,c2=c+dc;if(!this.binnen(r2,c2)||!this.g[r2][c2])continue;this.wis(r,c,r2,c2);const ok=this.runs().length>0;this.wis(r,c,r2,c2);if(ok)return[[r,c],[r2,c2]]}}return false}
 wis(a,b,c,d){const t=this.g[a][b];this.g[a][b]=this.g[c][d];this.g[c][d]=t}
 schud(){const vrij=(r,c)=>!(this.strik&&this.strik[r][c]);const ts=[];for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=this.g[r][c];if(t&&t.k>=0&&!t.s&&vrij(r,c))ts.push(t)}let p=0;do{for(let i=ts.length-1;i>0;i--){const j=this.rng()*(i+1)|0;[ts[i],ts[j]]=[ts[j],ts[i]]}let i=0;for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=this.g[r][c];if(t&&t.k>=0&&!t.s&&vrij(r,c)){this.g[r][c]=ts[i++];this.g[r][c].x=c;this.g[r][c].y=r}}p++}while((this.runs().length||!this.heeftZet())&&p<40)}
 async wissel(a,b,hooks={}){// a,b = [r,c]
  const ta=this.g[a[0]][a[1]],tb=this.g[b[0]][b[1]];if(!ta||!tb)return false;
  if(this.strik&&(this.strik[a[0]][a[1]]||this.strik[b[0]][b[1]]))return false;
  this.wis(a[0],a[1],b[0],b[1]);await this.wacht(160);
  let effect=null;
  if(ta.s&&tb.s)effect='combi';else if(ta.s=='bal'||tb.s=='bal')effect='bal';
  if(!effect&&!this.runs().length&&(ta.s||tb.s))effect='los';
  if(!effect&&!this.runs().length){this.wis(a[0],a[1],b[0],b[1]);await this.wacht(160);return false}
  this.zet--;this.combo=0;const extra=new Set();
  if(effect=='bal'){const bal=ta.s=='bal'?b:a,ander=ta.s=='bal'?tb:ta;bal.toString();const pos=ta.s=='bal'?b:a;extra.add(pos+'');
   if(ander.s){/* bal+special: alle tegels van die kleur worden die special */const k=ander.k;for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=this.g[r][c];if(t&&t.k==k){t.s=t.s||ander.s;extra.add([r,c]+'')}}}
   else{const k=ander.k;for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++)if(this.k(r,c)==k)extra.add([r,c]+'')}
   this.fx.push({t:'straal',van:pos,k:ander.k});this.fx.push({t:'bal',r:pos[0],c:pos[1],doel:[...extra].map(x=>x.split(',').map(Number))})}
  const NW=/^(kruis|gbom|dblauw|dpaars|drood|kbom|verdwijn)$/;if(effect=='combi'&&(NW.test(ta.s)||NW.test(tb.s))&&ta.s!='bal'&&tb.s!='bal'){effect='nieuwcombi';extra.add(a+'');extra.add(b+'');if(ta.s=='verdwijn'||tb.s=='verdwijn'){ta.s='verdwijn';tb.s=null}else{const g=(ta.s+tb.s).includes('gbom');ta.s='kruis3';tb.s=g?'gbom':'kbom'}}
  if(effect=='combi'){if(ta.s=='bal'&&tb.s=='bal'){for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++)if(this.g[r][c])extra.add([r,c]+'')}
   else{extra.add(a+'');extra.add(b+'');if((ta.s+tb.s).includes('bom')&&(ta.s+tb.s).match(/r[hv]/)){ // groot kruis
     for(let d=-1;d<=1;d++){for(let c=0;c<KOL;c++)extra.add([b[0]+d,c]+'');for(let r=0;r<RIJEN;r++)extra.add([r,b[1]+d]+'')}}
    else if(ta.s.match(/r[hv]/)&&tb.s.match(/r[hv]/)){ta.s='rh';tb.s='rv'}else if(ta.s=='bom'&&tb.s=='bom'){ta.s='bom2';tb.s='bom2'}}}
  if(effect=='los'){if(ta.s)extra.add(b+'');if(tb.s)extra.add(a+'')}
  await this.oplossen(a,b,extra,hooks);return true}
 async oplossen(a,b,extra,hooks){
  let eerste=true;
  while(true){const rs=this.runs();const wis=new Set(eerste?extra:[]);const nieuw=[];
   const gs=this.groepen(rs);
   gs.forEach(g=>{g.set.forEach(x=>wis.add(x));const lang=Math.max(...g.runs.filter(r=>!r.sq).map(r=>r.cel.length),0);const hv=new Set(g.runs.filter(r=>!r.sq).map(r=>r.h));const sq=g.runs.some(r=>r.sq);
    let s=null;if(lang>=5)s='bal';else if(hv.size==2)s=(this.L.n>=55&&!this.sim0x)?(g.set.size>=7?'gbom':g.set.size>=6?'kruis':'bom'):'bom';else if(lang==4)s=g.runs.find(r=>r.cel.length==4).h?'rv':'rh';else if(sq&&lang<4)s='uil';
    if(s){const cel=[...g.set].map(x=>x.split(',').map(Number));let p=cel.find(x=>eerste&&((a&&x[0]==a[0]&&x[1]==a[1])||(b&&x[0]==b[0]&&x[1]==b[1])))||cel[cel.length>>1];const t=this.g[p[0]][p[1]];nieuw.push([p,s,t.k,cel])}});
   if(!wis.size)break;
   this.combo++;hooks.combo&&hooks.combo(this.combo);
   // specials kettingreactie
   const rij=[...wis];const gedaan=new Set();
   while(rij.length){const x=rij.shift();if(gedaan.has(x))continue;gedaan.add(x);const[r,c]=x.split(',').map(Number);if(!this.binnen(r,c))continue;const t=this.g[r][c];if(!t||!t.s)continue;
    const ad=(rr,cc)=>{if(this.binnen(rr,cc)){const k=[rr,cc]+'';wis.add(k);rij.push(k)}};
    if(t.s=='rh'){for(let dc=-2;dc<=2;dc++)ad(r,c+dc);this.fx.push({t:'rh',r,c,bereik:2})}
    if(t.s=='rv'){for(let dr=-2;dr<=2;dr++)ad(r+dr,c);this.fx.push({t:'rv',r,c,bereik:2})}
    if(t.s=='bom'||t.s=='bom2'){const R=t.s=='bom2'?2:1;for(let rr=r-R;rr<=r+R;rr++)for(let cc=c-R;cc<=c+R;cc++)ad(rr,cc);this.fx.push({t:'bom',r,c,R})}
    if(t.s=='dblauw'){for(let cc=0;cc<KOL;cc++)ad(r,cc);this.fx.push({t:'rh',r,c})}
    if(t.s=='dpaars'){for(let rr=0;rr<RIJEN;rr++)ad(rr,c);this.fx.push({t:'rv',r,c})}
    if(t.s=='kruis'){for(let cc=0;cc<KOL;cc++)ad(r,cc);for(let rr=0;rr<RIJEN;rr++)ad(rr,c);this.fx.push({t:'rh',r,c});this.fx.push({t:'rv',r,c});this.fx.push({t:'pu',s:'bliksem',r,c})}
    if(t.s=='kruis3'){for(let d=-1;d<=1;d++){for(let cc=0;cc<KOL;cc++)ad(r+d,cc);for(let rr=0;rr<RIJEN;rr++)ad(rr,c+d)}this.fx.push({t:'pu',s:'bliksem',r,c})}
    if(t.s=='gbom'||t.s=='drood'||t.s=='kbom'){const R=t.s=='gbom'?2:1;for(let rr=r-R;rr<=r+R;rr++)for(let cc=c-R;cc<=c+R;cc++)ad(rr,cc);this.fx.push({t:'bom',r,c,R});this.fx.push({t:'pu',s:t.s=='gbom'?'bom-goud':'bom-rood',r,c})}
    if(t.s=='verdwijn'){for(let rr=0;rr<RIJEN;rr++)for(let cc=0;cc<KOL;cc++)if((rr>=RIJEN/2)||((rr*3+cc*5)%4==0))ad(rr,cc);this.fx.push({t:'pu',s:'wervel',r,c,groot:1})}
    if(t.s=='uil'){const doel=this.uilDoel(wis);if(doel){ad(doel[0],doel[1]);this.fx.push({t:'uil',van:[r,c],naar:doel})}}
    if(t.s=='bal'){const k=t.k,dl=[];for(let rr=0;rr<RIJEN;rr++)for(let cc=0;cc<KOL;cc++)if(this.k(rr,cc)==k){ad(rr,cc);dl.push([rr,cc])}this.fx.push({t:'bal',r,c,doel:dl})}
    t.s=null}
   // wis + schade
   const geraakteKist=new Set();
   wis.forEach(x=>{const[r,c]=x.split(',').map(Number);if(!this.binnen(r,c))return;
    if(this.kist[r][c]){geraakteKist.add(x);return}
    const t=this.g[r][c];if(!t||t.k<0)return;
    if(nieuw.some(([p])=>p[0]==r&&p[1]==c))return;
    if(this.lay[r][c]){this.lay[r][c]--;this.telDoel('o');this.fx.push({t:'blad',r,c})}
    if(this.strik&&this.strik[r][c]==1){this.strik[r][c]=0;this.fx.push({t:'strik',r,c})}
    this.telDoel(t.k);this.score+=10*this.combo;t.weg=1;this.fx.push({t:'pof',r,c,k:t.k});this.g[r][c]=null;
    [[0,1],[1,0],[0,-1],[-1,0]].forEach(([dr,dc])=>{const rr=r+dr,cc=c+dc;if(!this.binnen(rr,cc))return;if(this.kist[rr][cc])geraakteKist.add([rr,cc]+'');if(this.strik&&this.strik[rr][cc]==1){this.strik[rr][cc]=0;this.fx.push({t:'strik',r:rr,c:cc})}})});
   geraakteKist.forEach(x=>{const[r,c]=x.split(',').map(Number);if(this.kist[r][c]>0){this.kist[r][c]--;if(this.kt&&this.kt[r][c]){if(this.kist[r][c]==0){this.fx.push({t:'schat',r,c,s:this.kt[r][c],kl:this.ktk[r][c]});this.kt[r][c]=0}else this.fx.push({t:'tik',r,c,s:this.kt[r][c]});return}if(this.kist[r][c]==0){this.telDoel(this.ksoort);if(this.ksoort!='d')this.fx.push({t:'kist',r,c});if(this.ksoort=='k'&&!this.zaadKist&&(S.m3lvl|0)>=60&&window.zeldzaamZaad&&Math.random()<.02){this.zaadKist=1;zeldzaamZaad('kistje',{wacht:300})}if(this.ksoort!='k'){const ih=this.L.kistInh||[];this.fx.push({t:'vrij',r,c,s:this.ksoort,it:ih[(r*7+c)%Math.max(1,ih.length)]})}}else this.fx.push({t:'plank',r,c,over:this.kist[r][c]})}});
   nieuw.forEach(([p,s,k,cl])=>{const t=this.g[p[0]][p[1]];if(t){t.s=s;t.k=k;t.sc=1.5}else{const nt=this.tegel(k,p[0],p[1],p[0]);nt.s=s;nt.sc=1.5;this.g[p[0]][p[1]]=nt}if(s)this.fx.push({t:'nieuw',r:p[0],c:p[1],s,cel:cl})});
   hooks.wis&&hooks.wis(wis.size,this.combo);
   await this.wacht(200);
   this.val();await this.wacht(320);
   this.potten();
   eerste=false}
  if(this.g.some((rw,r)=>rw.some((t,c)=>!t&&!this.kist[r][c]))){this.val();this.potten()}
  if(!this.heeftZet()){this.schud();hooks.geschud&&hooks.geschud()}}
 uilDoel(wis){const kans=[];for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){if(wis.has([r,c]+''))continue;if(this.kist[r][c])kans.push([r,c,3]);else if(this.lay[r][c]&&this.g[r][c])kans.push([r,c,2]);else{const t=this.g[r][c];if(t&&this.doel.some(d=>d.t===t.k&&d.over>0))kans.push([r,c,1])}}
  if(!kans.length)return null;const m=Math.max(...kans.map(k=>k[2]));const b=kans.filter(k=>k[2]==m);const x=b[this.rng()*b.length|0];return[x[0],x[1]]}
 telDoel(t){this.doel.forEach(d=>{if(d.t===t&&d.over>0)d.over--})}
 val(){const muur=(r,c)=>!!(this.strik&&this.strik[r][c]);const vast=(r,c)=>!!(this.kist[r][c]||muur(r,c));for(let c=0;c<KOL;c++){let leeg=0;for(let r=RIJEN-1;r>=0;r--){if(muur(r,c)){leeg=0;continue}if(this.kist[r][c])continue;const t=this.g[r][c];if(!t)leeg++;else if(leeg){
     let rr=r,nn=leeg;while(nn>0){const nxt=rr+1;if(nxt>=RIJEN||muur(nxt,c))break;rr=nxt;if(!this.kist[rr][c])nn--}if(rr!==r&&!this.kist[rr][c]){this.g[rr][c]=t;this.g[r][c]=null}}}
   let n=0;for(let r=RIJEN-1;r>=0;r--)if(!vast(r,c)&&!this.g[r][c])n++;let i=0;
   for(let r=0;r<RIJEN;r++)if(!vast(r,c)&&!this.g[r][c]){let k=this.rng()*this.L.kleuren|0;
     if(this.potGeplaatst<this.L.pot){const op=this.g.flat().filter(t=>t&&t.k<0).length;if(op<2&&this.rng()<(op?.1:.45)){k=-1;this.potGeplaatst++}}
     const t=this.tegel(k,r,c);let onder=false;for(let q=0;q<r;q++)if(muur(q,c))onder=true;t.y=sim0(this)||onder?r:(-n+i-.2);i++;this.g[r][c]=t}}}
 potOpBord(){return this.g.flat().some(t=>t&&t.k<0)}
 potten(){for(let c=0;c<KOL;c++){let r=RIJEN-1;while(r>=0&&(this.kist[r][c]||(this.strik&&this.strik[r][c])))r--;const t=r>=0&&this.g[r][c];if(t&&t.k<0){this.g[r][c]=null;this.telDoel('p');this.fx.push({t:'pot',r,c});this.val()}}}
 klaar(){return this.doel.every(d=>d.over<=0)}
 wacht(ms){return this.sim?Promise.resolve():new Promise(r=>setTimeout(r,ms))}
}
function sim0(b){return !!b.sim}
/* oplosbaarheidscheck: greedy bot speelt het level een paar keer na */
async function m3Oplosbaar(L,thema){let win=0;for(let p=1;p<=3;p++){const b=new Bord(L,thema,p);let veilig=0;while(b.zet>0&&!b.klaar()&&veilig++<80){const z=m3BesteZet(b);if(!z)break;await b.wissel(z[0],z[1])}if(b.klaar())win++}return win}
function m3BesteZet(b){let best=null,bs=-1;for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++)for(const[dr,dc]of[[0,1],[1,0]]){const r2=r+dr,c2=c+dc;if(!b.binnen(r2,c2)||!b.g[r][c]||!b.g[r2][c2])continue;if(b.strik&&((b.strik[r]&&b.strik[r][c])||(b.strik[r2]&&b.strik[r2][c2])))continue;
  const ta=b.g[r][c],tb=b.g[r2][c2];let s=0;if(ta.s||tb.s)s=5+(ta.s&&tb.s?10:0);b.wis(r,c,r2,c2);const rs=b.runs();b.wis(r,c,r2,c2);
  rs.forEach(x=>{s+=x.cel.length;x.cel.forEach(([rr,cc])=>{if(b.lay[rr][cc])s+=2;const t=b.g[rr][cc];const k=(rr==r&&cc==c)?tb:(rr==r2&&cc==c2)?ta:t;if(k&&b.doel.some(d=>d.t===k.k&&d.over>0))s+=2})});
  rs.forEach(x=>x.cel.forEach(([rr,cc])=>{for(let q=rr-1;q>=0;q--){const t=b.g[q][cc];if(t&&t.k<0){s+=4;break}}if([[0,1],[1,0],[0,-1],[-1,0]].some(([a,d])=>b.binnen(rr+a,cc+d)&&b.kist[rr+a][cc+d]))s+=3;if(b.strik){if(b.strik[rr][cc]==1)s+=6;[[0,1],[1,0],[0,-1],[-1,0]].forEach(([a,d])=>{const r3=rr+a,c3=cc+d;if(b.binnen(r3,c3)&&b.strik[r3]&&b.strik[r3][c3]==1)s+=4})}}));
  if(rs.length||ta.s||tb.s){s+=r*0.1;if(s>bs){bs=s;best=[[r,c],[r2,c2]]}}}return best}
/* ---------- weergave ---------- */
const M3={};
V.match3=async(n)=>{n=n||S.m3lvl||1;if((S.m3kal||{})[n]==null){app('<p class="m3voor">Het level wordt klaargezet…</p>');await m3Kalibreer(n,m3VakVoor(n).thema);if(document.body.dataset.view!=='match3')return}const L=m3Level(n);const vak=m3VakVoor(n);const thema=vak.thema;const T=M3THEMA[thema];
 const doelTxt=d=>d[0]=='recept'?'Recept':(['i','d'].includes(d[0])||(d[0]=='p'&&L.dropInh))&&window.doelNaam?doelNaam(d[0]):d[0]=='o'?T.onkruid:d[0]=='k'?T.kist:d[0]=='p'?(T.potMv||(/pot$/.test(T.pot)?T.pot+'ten':T.pot+'en')):(T.t[d[0]]&&T.t[d[0]].map)?T.t[d[0]][0]:'';
 app(`<div class="m3voor rococo"><h2>Level ${n}</h2><p class="m3vak">${T.n}</p><div class="m3doelen-voor">${L.doelen.map(d=>`<span>${m3DoelIco(d,T,L)}<b>${doelTxt(d)}</b></span>`).join('')}</div>
 <p>${L.zetten} zetten</p>${L.zwaar?`<p class="zwaarhint ${L.zwaar>1?'super':''}">${L.zwaar>1?'💀 Heel zwaar level.':'🔥 Zwaar level.'} Dit lukt bijna niet zonder hulp: neem boosters mee uit je kas of uit de <button class="bolink" onclick="document.querySelectorAll('.modal').forEach(m=>m.remove());ga('fopshop')">Fopshop</button>.</p>`:''}
 ${window.reeksTekst?reeksTekst(n):''}
 ${window.boosterKeuze?boosterKeuze(n):''}<p class="harten">${harten()}</p><button class="knop volgende" id="m3start">Spelen</button></div>`);
 $('#m3start').onclick=()=>{const b1=false,b2=false,kost=0;if(levens()<1){if(window.hartTik)hartTik();else toast('Je harten laden weer op.');return}S.galjoenen-=kost;bewaar();stats();m3Speel(n,thema,{b1,b2,bo:window.boosterGekozen?boosterGekozen():[]})}};
function m3DoelIco(d,T,L){if(window.doelIco&&(d[0]=='i'||d[0]=='d'||(d[0]=='p'&&L&&L.dropInh)))return doelIco(d[0],T.id,L);const kleur=typeof d[0]=='number'?T.t[d[0]][1]:d[0]=='o'?'#6b8f3a':d[0]=='k'?'#8a5a2b':'#c9a227';const p=typeof d[0]=='number'?T.t[d[0]][2]:d[0]=='o'?M3THEMA.herbologie.t[5][2]:d[0]=='k'?'M4 7h16v13H4zM4 7l2-3h12l2 3M4 12h16':'M5 8h14l-2 12H7zM4 5h16v3H4z';
 return `<svg viewBox="0 0 24 24" class="m3ico" style="background:${kleur}"><path d="${p}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
function m3Speel(n,thema,boost){const L=m3Level(n);const T=M3THEMA[thema];const b=new Bord(L,thema,0);M3.b=b;b._boost=boost||{};
 if(boost.b1){const r=b.g[5][3];if(r)r.s='rh'}if(boost.b2){const r=b.g[6][1];if(r)r.s='bom'}
 const init0=b.doel.map(d=>d.n||d.over||1);const TH=T.id||thema;const sterSVG='<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z"/></svg>';
 app(`<div class="m3"><div class="m3hud"><div class="m3med"><svg viewBox="0 0 100 100" class="medring"><defs><linearGradient id="mdg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c0"/><stop offset=".5" stop-color="#d4a020"/><stop offset="1" stop-color="#7a5408"/></linearGradient><radialGradient id="mdb" cx=".4" cy=".35"><stop offset="0" stop-color="#5a6cc0"/><stop offset="1" stop-color="#1e2660"/></radialGradient></defs>${Array.from({length:12},(_,i)=>`<circle cx="${(50+43*Math.cos(i*Math.PI/6)).toFixed(1)}" cy="${(50+43*Math.sin(i*Math.PI/6)).toFixed(1)}" r="6" fill="url(#mdg)" stroke="#5a3a04" stroke-width="1"/>`).join('')}<circle cx="50" cy="50" r="40" fill="url(#mdg)" stroke="#5a3a04" stroke-width="1.5"/><circle cx="50" cy="50" r="33" fill="url(#mdb)" stroke="#fff3c0" stroke-width="1.5"/></svg><b id="m3z">${b.zet}</b><small>zetten</small></div>
 <div class="m3mid"><div class="m3titel">Level ${n}</div><div class="m3balk"><i id="m3bv"></i>${[1,2,3].map(i=>`<span class="m3bs" style="left:calc(${(i*33.33).toFixed(1)}% - 11px)">${sterSVG}</span>`).join('')}</div><div class="m3vaknaam">${T.n}</div></div>
 <div class="m3doel" id="m3d"></div></div><div class="m3bord"><canvas id="m3c"></canvas><div id="m3fx"></div></div></div>`);
 document.body.classList.add('m3aan');
 const cv=$('#m3c'),ctx=cv.getContext('2d');const dpr=Math.min(2,devicePixelRatio||1);let cel,W,H;
 const maat=()=>{cel=Math.floor(Math.min((innerWidth-18)/KOL,(innerHeight-250)/RIJEN,66));W=cel*KOL;H=cel*RIJEN;cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);try{m3Voorrender(T.id||thema,cel,b.L.kleuren)}catch(e){for(let k=0;k<b.L.kleuren;k++)tegelBeeld(T,k,cel)}};maat();addEventListener('resize',maat);
 const deeltjes=[],geesten=[],fxs=[],planken=[];let slowTot=0,schud=0,sel=null,hintT=Date.now(),hint=null,bezig=false,vliegers=0;
 const vorig=b.doel.map(d=>d.over);
 const doelUI=()=>{const el=$('#m3d');if(!el)return;if(!el.children.length)el.innerHTML=b.doel.map((d,i)=>`<div class="m3kaart">${m3DoelIco(L.doelen[i],T,L)}<b></b></div>`).join('');
  b.doel.forEach((d,i)=>{const k=el.children[i];if(!k)return;k.querySelector('b').textContent=d.over<=0?'':d.over;k.classList.toggle('af',d.over<=0);if(d.over<vorig[i]){k.classList.remove('bump');void k.offsetWidth;k.classList.add('bump')}vorig[i]=d.over});
  const z=$('#m3z');z.textContent=b.zet;z.parentNode.classList.toggle('weinig',b.zet<=5);
  const tot=init0.reduce((a,x)=>a+x,0),ged=b.doel.reduce((a,d,i)=>a+Math.max(0,init0[i]-Math.max(0,d.over)),0),p=Math.min(1,ged/tot);$('#m3bv').style.width=(p*100)+'%';document.querySelectorAll('.m3bs').forEach((s,i)=>s.classList.toggle('aan',p>=(i+1)/3-.001))};doelUI();
 const vlieg=(k,r,c)=>{if(RMP||vliegers>12)return;const i=b.doel.findIndex(d=>d.t===k);if(i<0)return;const kaart=$('#m3d')&&$('#m3d').children[i];if(!kaart)return;const ico=kaart.querySelector('.m3ico');const cr=cv.getBoundingClientRect(),kr=ico.getBoundingClientRect();
  const el=ico.cloneNode(true);el.classList.add('m3vlieg');const z=cel*.9,x0=cr.left+(c+.5)*cel-z/2,y0=cr.top+(r+.5)*cel-z/2,x1=kr.left+kr.width/2-z/2,y1=kr.top+kr.height/2-z/2;el.style.cssText=`left:${x0}px;top:${y0}px;width:${z}px;height:${z}px`;document.body.appendChild(el);vliegers++;setTimeout(()=>{if(el.isConnected){el.remove();vliegers=Math.max(0,vliegers-1)}},1400);
  const dx=x1-x0,dy=y1-y0,sc=kr.width/z;el.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx*.35-30}px,${dy*.35-40}px) scale(1.25) rotate(-12deg)`,opacity:1,offset:.35},{transform:`translate(${dx}px,${dy}px) scale(${sc})`,opacity:.9}],{duration:620+Math.random()*220,easing:'cubic-bezier(.45,0,.25,1)',fill:'forwards'}).onfinish=()=>{if(!el.isConnected)return;el.remove();vliegers--;kaart.classList.remove('bump');void kaart.offsetWidth;kaart.classList.add('bump');try{fx.speel('klik')}catch(e){}}};
 const stofW=(x,y,kl,n)=>{if(deeltjes.length>260)n=Math.min(n,2);for(let i=0;i<n;i++){const a=Math.random()*6.283,v=.6+Math.random()*2.6;deeltjes.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-.8,l:1,k:i%3?kl:'#fff6d0',r:2+Math.random()*3.2,st:1})}};
 const combo=txt=>{const f=$('#m3fx');if(!f||RMP)return;f.querySelectorAll('.m3combo').forEach(x=>x.remove());const d=document.createElement('div');d.className='m3combo';d.textContent=txt;f.appendChild(d);setTimeout(()=>d.remove(),1400)};
 const gloed=a=>{const f=$('#m3fx');if(!f||RMP)return;const g=document.createElement('div');g.className='m3gloed';g.style.setProperty('--a',a);f.appendChild(g);setTimeout(()=>g.remove(),800)};
 const C=(r,c)=>[(c+.5)*cel,(r+.5)*cel];
 const toonFx=()=>{let groot=0;const poef=[];b.fx.splice(0).forEach(f=>{const[px,py]=C(f.r,f.c);if(f.t=='strik'||f.t=='strikgroei'){const kleur=b.L&&b.L.plaag&&b.L.plaag.soort==='damp'?'#7ddea0':'#c084fc';for(let i=0;i<(RMP?2:7);i++)deeltjes.push({x:px,y:py,vx:(Math.random()-.5)*3,vy:-1-Math.random()*2,l:1,k:kleur,r:2.5,sq:1});return}if((f.t=='pu'||f.t=='schat'||f.t=='tik')&&window.m3PuFx){const cr=cv.getBoundingClientRect();m3PuFx(f,cr.left+(f.c+.5)*cel,cr.top+(f.r+.5)*cel,cel);if(f.t=='tik'){schud=Math.max(schud,2);try{krak(0)}catch(e){}}if(f.t=='schat'){schud=Math.max(schud,4);stofW(px,py,'#fff6d0',RMP?2:14)}return}if(f.t=='pof')poef.push([px,py,T.t[f.k]?T.t[f.k][1]:'#fff']);
  if(f.t=='pof'){const kl=T.t[f.k]?T.t[f.k][1]:'#fff';geesten.push({x:px,y:py,k:f.k,l:1});stofW(px,py,kl,RMP?2:10);vlieg(f.k,f.r,f.c)}
  if(f.t=='vrij'){const i=b.doel.findIndex(d=>d.t===f.s),kaart=$('#m3d')&&$('#m3d').children[i],ico=kaart&&kaart.querySelector('.m3ico'),cr=cv.getBoundingClientRect(),X=cr.left+(f.c+.5)*cel,Y=cr.top+(f.r+.5)*cel;if(f.s=='d'){for(let j=0;j<(RMP?2:14);j++)deeltjes.push({x:px,y:py,vx:(Math.random()-.5)*6,vy:-Math.random()*5,l:1,k:'#ffe08a',r:2.5,sq:1});schud=Math.max(schud,3);try{krak(0)}catch(e){};window.m3Bevrijd&&m3Bevrijd(f.it,X,Y,ico)}else window.m3Spreuk&&m3Spreuk(f.it,X,Y,ico);return}
  if(f.t=='plank'||f.t=='kist'){const n=f.t=='kist'?(RMP?2:6):1;for(let i=0;i<n;i++)planken.push({x:px+(Math.random()-.5)*cel*.4,y:py+(f.t=='plank'?cel*(.15-.25*(f.over||0)):0),vx:(Math.random()-.5)*(f.t=='kist'?9:5)+(f.t=='plank'?(Math.random()<.5?-3:3):0),vy:-4-Math.random()*4,a:0,va:(Math.random()-.5)*.5,w:cel*.8,h:cel*.2,l:1.3});if(f.t=='kist')for(let i=0;i<(RMP?0:5);i++)planken.push({spijker:1,x:px,y:py,vx:(Math.random()-.5)*8,vy:-3-Math.random()*5,a:Math.random()*6,va:(Math.random()-.5)*.8,l:1.1});
   for(let i=0;i<(RMP?2:f.t=='kist'?16:7);i++)deeltjes.push({x:px,y:py,vx:(Math.random()-.5)*5,vy:-Math.random()*4,l:1,k:i%3?'#c8955a':'#e8d0a8',r:i%2?2:3,sq:1});if(f.t=='kist'&&!RMP)for(let i=0;i<10;i++)deeltjes.push({x:px,y:py,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,l:1,k:'rgba(200,180,150,.6)',r:6,st:1});schud=Math.max(schud,f.t=='kist'?5:2.5);try{krak(f.t=='kist')}catch(e){}if(f.t=='plank')return}
  if(f.t=='blad'||f.t=='kist'){for(let i=0;i<(RMP?2:8);i++)deeltjes.push({x:px,y:py,vx:(Math.random()-.5)*4,vy:-Math.random()*4,l:1.2,k:f.t=='kist'?'#a0703a':'#7fae4a',r:3,sq:1});vlieg(f.t=='blad'?'o':'k',f.r,f.c)}
  if(f.t=='rh'||f.t=='rv'){fxs.push({t:f.t,x:px,y:py,l:0});schud=Math.max(schud,5);groot++;try{fx.speel('whoosh')}catch(e){}vib(35)}
  if(f.t=='bom'){schud=13;fxs.push({t:'bom',x:px,y:py,R:(f.R+.5)*cel,l:0});vib(70);groot+=2;gloed(.32)}
  if(f.t=='uil'){const[x2,y2]=C(...f.naar),[x1,y1]=C(...f.van);fxs.push({t:'uil',x:x1,y:y1,x2,y2,l:0});groot++}
  if(f.t=='bal'){fxs.push({t:'snaai',x:px,y:py,doel:(f.doel||[]).map(([r,c])=>C(r,c)),l:0});groot+=2;gloed(.28);vib([20,30,20,30,20])}
  if(f.t=='straal')schud=6;
  if(f.t=='pot'){if(L.dropInh&&window.m3VliegItem){const i=b.doel.findIndex(d=>d.t==='p'),kaart=$('#m3d')&&$('#m3d').children[i],cr=cv.getBoundingClientRect();const d=m3Ding(L.dropInh[0]);toast((d?d.naam:'Item')+' verzameld!');m3VliegItem(L.dropInh[0],cr.left+(f.c+.5)*cel,cr.top+(f.r+.5)*cel,kaart&&kaart.querySelector('.m3ico'),0)}else{toast(T.pot+' verzameld!');vlieg('p',f.r,f.c)}fx.speel('munt')}
  if(f.t=='nieuw'){fx.speel('goed');vib(30);fxs.push({t:'zwiep',x:px,y:py,s:f.s,run:(f.cel||[]).map(([r,c])=>C(r,c)),l:0});if(f.s=='bal')combo('Magisch!')}});
  if(groot>=2)combo('Betoverend!');
  if(poef.length>=5){const cx=poef.reduce((a,p)=>a+p[0],0)/poef.length,cy=poef.reduce((a,p)=>a+p[1],0)/poef.length;fxs.push({t:'zwiep',x:cx,y:cy,run:poef.map(p=>[p[0],p[1]]),l:0,slow:1});slowTot=performance.now()+(RMP?0:750);poef.forEach(p=>{stofW(p[0],p[1],'#c58aff',RMP?1:5);stofW(p[0],p[1],'#ffd84a',RMP?0:3)});combo(poef.length>=8?'Fenomenaal!':'Toverpoeder!');const cr=cv.getBoundingClientRect();try{ampulLaad(poef.map(p=>[cr.left+p[0],cr.top+p[1]]))}catch(e){}}};
 const staf=()=>KU.speciaal('staf',Math.round(cel*2));
 const tekenTegel=(t,x,y,s,nu)=>{if(t.k<0&&L.dropInh&&window.itemSprite){const z=cel*1.05;ctx.save();ctx.translate(x,y+Math.sin(nu/400+t.x)*cel*.03);ctx.scale(s,s);ctx.drawImage(itemSprite(L.dropInh[(t.x+(t.id*10|0))%L.dropInh.length],Math.round(cel*2)),-z/2,-z/2,z,z);ctx.restore();return}if(t.k<0){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#c27a3a';ctx.beginPath();ctx.moveTo(-cel*.32,-cel*.15);ctx.lineTo(cel*.32,-cel*.15);ctx.lineTo(cel*.24,cel*.35);ctx.lineTo(-cel*.24,cel*.35);ctx.fill();ctx.fillStyle='#e09a55';ctx.fillRect(-cel*.38,-cel*.3,cel*.76,cel*.16);ctx.strokeStyle='#4f9a3c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-cel*.3);ctx.quadraticCurveTo(-cel*.2,-cel*.5,-cel*.25,-cel*.42);ctx.moveTo(0,-cel*.3);ctx.quadraticCurveTo(cel*.2,-cel*.55,cel*.22,-cel*.45);ctx.stroke();ctx.restore();return}
  ctx.save();ctx.translate(x,y);const bob=RMP?0:Math.sin(nu/650+t.id*20)*cel*.018,adem=RMP?1:1+Math.sin(nu/900+t.id*13)*.015;ctx.translate(0,bob);ctx.scale(s*adem,s*adem);
  const kl=T.t[t.k]?T.t[t.k][1]:'#fff';
  if(!t.s){if(window.STUK_FOTO&&!RMP){const ph=nu/1000+t.id*.61;ctx.save();ctx.translate(0,Math.sin(ph*1.6)*cel*.025);const sc=1+Math.sin(ph*2.1)*.025;ctx.rotate(Math.sin(ph*1.1)*.035);ctx.scale(sc,sc);ctx.drawImage(tegelBeeld(T,t.k,cel),-cel/2,-cel/2,cel,cel);const g=(ph*.35)%3;if(g<.6){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.sin(g/.6*Math.PI)*.35;const x=-cel*.6+g/.6*cel*1.2;const gr=ctx.createLinearGradient(x-cel*.15,0,x+cel*.15,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,250,220,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,cel*.36,0,7);ctx.fill()}ctx.restore()}else ctx.drawImage(tegelBeeld(T,t.k,cel),-cel/2,-cel/2,cel,cel)}
  else{ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.5+.25*Math.sin(nu/200);ctx.drawImage(KU.stof(kl),-cel*.62,-cel*.62,cel*1.24,cel*1.24);ctx.restore();
   if(window.puTeken&&puTeken(ctx,t,cel,nu)){}else{
   if(t.s=='rh'||t.s=='rv'){ctx.globalAlpha=.9;ctx.drawImage(tegelBeeld(T,t.k,cel),-cel*.3,-cel*.3,cel*.6,cel*.6);ctx.globalAlpha=1;ctx.save();ctx.rotate(t.s=='rh'?3*Math.PI/4:Math.PI/4);ctx.drawImage(staf(),-cel*.55,-cel*.55,cel*1.1,cel*1.1);ctx.restore();
    const f=(nu/500)%1;ctx.save();ctx.globalCompositeOperation='lighter';[-1,1].forEach(d=>{const q=(cel*.32+f*cel*.18)*d;ctx.globalAlpha=1-f;const[x2,y2]=t.s=='rh'?[q,0]:[0,q];ctx.drawImage(KU.stof('#fff3a0'),x2-cel*.12,y2-cel*.12,cel*.24,cel*.24)});ctx.restore()}
   if(t.s=='bom'||t.s=='bom2'){const z=t.s=='bom2'?1.15:1;ctx.drawImage(KU.speciaal('ketel',Math.round(cel*2)),-cel*.5*z,-cel*.5*z,cel*z,cel*z);ctx.fillStyle='rgba(200,255,200,.85)';for(let i=0;i<3;i++){const q=((nu/900)+i/3)%1;ctx.globalAlpha=1-q;ctx.beginPath();ctx.arc((i-1)*cel*.1,-cel*.12-q*cel*.3,cel*.035*(1+q),0,7);ctx.fill()}ctx.globalAlpha=1}
   if(t.s=='uil')KU.uil(ctx,cel*.36,RMP?.3:Math.sin(nu/150)*.5+.5);
   if(t.s=='bal'){const f=RMP?.4:Math.sin(nu/45)*.5+.5;ctx.save();ctx.translate(-cel*.13,-cel*.02);KU.vleugel(ctx,cel*.3,f,-1);ctx.restore();ctx.save();ctx.translate(cel*.13,-cel*.02);KU.vleugel(ctx,cel*.3,f,1);ctx.restore();ctx.drawImage(KU.speciaal('snaai',Math.round(cel*2)),-cel*.42,-cel*.42,cel*.84,cel*.84)}}}
  if(!RMP){const gl=((nu/1000+t.id*37)%6);if(gl<.5){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.sin(gl/.5*Math.PI);ctx.drawImage(KU.stof('#fff8d0'),-cel*.4,-cel*.42,cel*.3,cel*.3);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1}}
  ctx.restore()};
 const ease=p=>1-Math.pow(1-p,3);
 const fxTeken=(dt,nu)=>{for(let i=fxs.length-1;i>=0;i--){const e=fxs[i];e.l+=dt*(e.slow?.0105:({snaai:.009,uil:.018,zwiep:.026,bom:.022}[e.t]||.022));const p=Math.min(1,e.l);ctx.save();
  if(e.t=='rh'||e.t=='rv'){const h=e.t=='rh',Lg=(e.bereik?e.bereik*cel:Math.max(W,H))*ease(Math.min(1,p*1.4)),a=p<.7?1:1-(p-.7)/.3;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;const kl=T.t[0]?'#ffe58a':'#fff';
   [-1,1].forEach(d=>{const hx=h?e.x+d*Lg:e.x,hy=h?e.y:e.y+d*Lg;const g=ctx.createLinearGradient(e.x,e.y,hx,hy);g.addColorStop(0,'rgba(255,240,180,.15)');g.addColorStop(.75,'rgba(255,220,120,.7)');g.addColorStop(1,'rgba(255,255,255,1)');ctx.strokeStyle=g;ctx.lineCap='round';ctx.lineWidth=cel*.6*(1-p*.5);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(hx,hy);ctx.stroke();ctx.lineWidth=cel*.16;ctx.strokeStyle='rgba(255,255,255,.9)';ctx.stroke();
    if(p<.75&&Math.random()<.8)deeltjes.push({x:hx,y:hy,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,l:1,k:'#ffe07a',r:2+Math.random()*3,st:1});
    if(p<.8){ctx.save();ctx.globalCompositeOperation='source-over';ctx.translate(hx,hy);ctx.rotate((h?(d>0?0:Math.PI):(d>0?Math.PI/2:-Math.PI/2))+3*Math.PI/4);ctx.drawImage(staf(),-cel*.7,-cel*.7,cel*1.4,cel*1.4);ctx.restore()}})}
  if(e.t=='bom'){const q=ease(p);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1-p;const g=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,e.R*1.4);g.addColorStop(0,'rgba(255,255,230,1)');g.addColorStop(.35,'rgba(140,255,150,.7)');g.addColorStop(1,'rgba(40,160,80,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(e.x,e.y,e.R*1.4,0,7);ctx.fill();
   ctx.strokeStyle='rgba(255,240,170,1)';for(let k=0;k<14;k++){const a=k*Math.PI/7+nu/900;ctx.lineWidth=cel*.12*(1-p);ctx.beginPath();ctx.moveTo(e.x+Math.cos(a)*e.R*.3*q,e.y+Math.sin(a)*e.R*.3*q);ctx.lineTo(e.x+Math.cos(a)*e.R*2*q,e.y+Math.sin(a)*e.R*2*q);ctx.stroke()}
   [[1.7,'rgba(255,230,140,1)',12],[1.15,'rgba(150,255,170,1)',8]].forEach(([m,k,w])=>{ctx.strokeStyle=k;ctx.lineWidth=w*(1-p);ctx.beginPath();ctx.arc(e.x,e.y,e.R*m*q,0,7);ctx.stroke()});
   if(e.l<.05)for(let k=0;k<(RMP?3:26);k++){const a=Math.random()*6.283,v=2+Math.random()*5;deeltjes.push({x:e.x,y:e.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1.2,k:k%2?'#9aff9a':'#ffe07a',r:2.5+Math.random()*3,st:1})}}
  if(e.t=='uil'){const q=ease(p),mx=(e.x+e.x2)/2,my=Math.min(e.y,e.y2)-cel*2.2,x=(1-q)*(1-q)*e.x+2*(1-q)*q*mx+q*q*e.x2,y=(1-q)*(1-q)*e.y+2*(1-q)*q*my+q*q*e.y2;
   if(Math.random()<.6)deeltjes.push({x,y,vx:(Math.random()-.5),vy:Math.random()*.8,l:1,k:'#ffffff',r:2+Math.random()*2,st:1});ctx.translate(x,y);ctx.scale(1+.3*Math.sin(p*Math.PI),1+.3*Math.sin(p*Math.PI));KU.uil(ctx,cel*.55,Math.sin(nu/55)*.5+.5);
   if(p>=1)stofW(e.x2,e.y2,'#ffffff',RMP?2:16)}
  if(e.t=='snaai'){const pts=[[e.x,e.y],...e.doel];const seg=pts.length-1;if(seg<1){e.l=1}else{const f=Math.min(seg-.0001,p*seg),i0=Math.floor(f),u=ease(f-i0),[ax,ay]=pts[i0],[bx,by]=pts[i0+1],x=ax+(bx-ax)*u,y=ay+(by-ay)*u;
    if(e.lastI!==i0){e.lastI=i0;stofW(ax,ay,'#ffd84a',RMP?1:7);e.spoor=[[ax,ay]]}
    ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';const sp=(e.spoor||[]).concat([[x,y]]);ctx.strokeStyle='rgba(255,215,90,.8)';ctx.lineWidth=cel*.12;ctx.beginPath();sp.forEach(([a,b2],k)=>k?ctx.lineTo(a,b2):ctx.moveTo(a,b2));ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=cel*.04;ctx.stroke();
    ctx.globalCompositeOperation='source-over';ctx.translate(x,y);const fl=Math.sin(nu/30)*.5+.5;[-1,1].forEach(d=>{ctx.save();ctx.translate(d*cel*.14,0);KU.vleugel(ctx,cel*.34,fl,d);ctx.restore()});ctx.drawImage(KU.speciaal('snaai',Math.round(cel*2)),-cel*.45,-cel*.45,cel*.9,cel*.9)}}
  if(e.t=='zwiep'){const q=ease(Math.min(1,p*1.3));if(e.run&&p<.6){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1-p/.6;e.run.forEach(([x,y])=>ctx.drawImage(KU.stof('#ffe9a0'),x-cel*.6,y-cel*.6,cel*1.2,cel*1.2));ctx.globalAlpha=1}
   const zz=e.slow?1.6:1,px=e.x-cel*.9*zz,py=e.y+cel*.9*zz,a0=-2.4,a1=-.35,a=a0+(a1-a0)*q,Rr=cel*1.6*zz;if(e.slow&&p<.7){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.35*(1-p/.7);const gg=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,cel*3);gg.addColorStop(0,'rgba(220,170,255,.9)');gg.addColorStop(1,'rgba(255,215,90,0)');ctx.fillStyle=gg;ctx.fillRect(e.x-cel*3,e.y-cel*3,cel*6,cel*6);ctx.restore()}ctx.globalCompositeOperation='lighter';ctx.globalAlpha=p<.75?1:1-(p-.75)/.25;ctx.lineCap='round';
   for(let k=0;k<3;k++){ctx.strokeStyle=['rgba(255,220,120,.35)','rgba(255,240,180,.7)','rgba(255,255,255,.95)'][k];ctx.lineWidth=[cel*.38,cel*.18,cel*.06][k];ctx.beginPath();ctx.arc(px,py,Rr,Math.max(a0,a-1.2),a);ctx.stroke()}
   const tx=px+Math.cos(a)*Rr,ty=py+Math.sin(a)*Rr;if(p<.8&&Math.random()<.9)deeltjes.push({x:tx,y:ty,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,l:1,k:'#fff0a0',r:2+Math.random()*2.5,st:1});
   ctx.globalCompositeOperation='source-over';ctx.save();ctx.translate((px+tx)/2,(py+ty)/2);ctx.rotate(a+Math.PI/2+Math.PI/4+Math.PI);ctx.drawImage(staf(),-cel*.85*zz,-cel*.85*zz,cel*1.7*zz,cel*1.7*zz);ctx.restore();
   if(p>.55&&!e.knal){e.knal=1;stofW(e.x,e.y,'#ffe58a',RMP?2:18)}
   if(p>.55){const r2=(p-.55)/.45;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1-r2;ctx.strokeStyle='#fff3b0';ctx.lineWidth=4*(1-r2);ctx.beginPath();ctx.arc(e.x,e.y,cel*(.4+r2*.9),0,7);ctx.stroke()}}
  ctx.restore();if(e.l>=1)fxs.splice(i,1)}};
 let laatst=performance.now();
 const frame=nu=>{if(!document.body.contains(cv)){if(!document.getElementById('m3c'))document.body.classList.remove('m3aan');removeEventListener('resize',maat);return}let dt=Math.min(40,nu-laatst)/16.7;if(nu<slowTot)dt*=.35;laatst=nu;
  ctx.clearRect(0,0,W,H);ctx.save();if(schud>0){ctx.translate((Math.random()-.5)*schud,(Math.random()-.5)*schud);schud*=.85;if(schud<.5)schud=0}
  for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){if(b.kist[r][c]===undefined)continue;ctx.fillStyle=(r+c)%2?'rgba(150,110,50,.13)':'rgba(255,255,255,.28)';ctx.beginPath();ctx.roundRect(c*cel+1.5,r*cel+1.5,cel-3,cel-3,cel*.18);ctx.fill();
   if(b.lay[r][c]){const R1=window._rank1,R2=window._rank2,x=c*cel+cel/2,y=r*cel+cel/2;ctx.fillStyle=b.lay[r][c]>1?'rgba(70,110,40,.28)':'rgba(110,150,60,.18)';ctx.beginPath();ctx.roundRect(c*cel+2,r*cel+2,cel-4,cel-4,8);ctx.fill();
   }}
  for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=b.g[r][c];if(!t)continue;
   if(t.sleep)continue;if(t.zw){const k=Math.min(1,.07*dt);t.x+=(c-t.x)*k;t.y+=(r-t.y)*k;t.lift=(t.lift||0)+((t.zw==1?1:0)-(t.lift||0))*Math.min(1,.06*dt);if(t.zw==2&&t.lift<.03&&Math.abs(t.x-c)<.02&&Math.abs(t.y-r)<.02){t.x=c;t.y=r;t.lift=0;delete t.zw}
    const X=(t.x+.5)*cel,Y=(t.y+.5)*cel-t.lift*cel*(.3+.06*Math.sin(nu/260));ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.max(0,.5*t.lift+.15*Math.sin(nu/200)*t.lift);ctx.drawImage(KU.stof('#ffd76a'),X-cel*.85,Y-cel*.85,cel*1.7,cel*1.7);ctx.restore();ctx.save();ctx.translate(X,Y);tekenTegel(t,0,0,1+.12*t.lift,nu);ctx.restore();
    if(t.lift>.3&&Math.random()<.3)deeltjes.push({x:X+(Math.random()-.5)*cel*.7,y:Y+cel*.35,vx:(Math.random()-.5)*.3,vy:-.5,r:1.5+Math.random()*2,l:1,st:1,k:'#ffe28a'});continue}
   if(t.y<r||t.vy){t.vy+=.045*dt;t.y+=t.vy*dt;if(t.y>=r){t.y=r;if(t.vy>.12){t.vy=-t.vy*.28}else t.vy=0}}else if(t.y>r){t.y+=(r-t.y)*Math.min(1,.35*dt);if(t.y-r<.01)t.y=r}
   t.x+=(c-t.x)*Math.min(1,.35*dt);if(Math.abs(t.x-c)<.01)t.x=c;t.sc+=(1-t.sc)*.18*dt;
   let s=t.sc;const gek=sel&&sel[0]==r&&sel[1]==c;if(gek)s*=1.16+Math.sin(nu/120)*.03;if(hint&&hint.some(h=>h[0]==r&&h[1]==c))s*=1+Math.sin(nu/150)*.07;
   const sq=t.vy?1+Math.min(.15,Math.abs(t.vy)*.4):1;const X=(t.x+.5)*cel,Y=(t.y+.5)*cel;
   if(gek&&t.k>=0){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.75+.2*Math.sin(nu/120);ctx.drawImage(KU.stof(T.t[t.k][1]),X-cel*.75,Y-cel*.75,cel*1.5,cel*1.5);ctx.restore()}
   ctx.save();ctx.translate(X,Y);ctx.scale(1/sq,sq);tekenTegel(t,0,0,s,nu);ctx.restore()}
  for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++)if(b.kist[r][c]){if(b.kt&&b.kt[r][c]&&window.schatSprite){const z=cel*.92;ctx.drawImage(schatSprite(b.kt[r][c],b.kist[r][c],b.ktk[r][c]),c*cel+(cel-z)/2,r*cel+(cel-z)/2+Math.sin(nu/500+c)*cel*.02,z,z);continue}const ih=L.kistInh||[],it=ih[(r*7+c)%Math.max(1,ih.length)];if(b.ksoort=='d'&&window.kooiSprite){ctx.drawImage(kooiSprite(b.kist[r][c],it,Math.round(cel*2)),c*cel,r*cel,cel,cel);continue}const sp=kistSprite(b.kist[r][c],b.T.id||'herbologie',Math.round(cel*2));ctx.drawImage(sp,c*cel,r*cel,cel,cel);if(b.ksoort=='i'&&window.runeImg&&runeImg(it)){const ri=runeImg(it),z=cel*.62;ctx.save();ctx.globalAlpha=.55+.3*Math.sin(nu/300+c);ctx.shadowColor='#ffb020';ctx.shadowBlur=cel*.3;ctx.beginPath();[.26,.44,.62].forEach(f=>ctx.rect(c*cel+cel*.15,r*cel+cel*(f-.02),cel*.7,cel*.05));ctx.rect(c*cel+cel*.15,r*cel+cel*.12,cel*.7,cel*.12);ctx.clip();ctx.drawImage(ri,c*cel+(cel-z)/2,r*cel+cel*.52-z/2,z,z);ctx.restore();ctx.save();ctx.globalAlpha=.35+.2*Math.sin(nu/300+c);ctx.globalCompositeOperation='lighter';ctx.drawImage(ri,c*cel+(cel-z)/2,r*cel+cel*.52-z/2,z,z);ctx.restore()}else if(b.ksoort=='i'&&window.runeVan){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.5+.25*Math.sin(nu/300+c);ctx.fillStyle='#ffd36a';ctx.shadowColor='#ffb020';ctx.shadowBlur=cel*.3;ctx.font=`bold ${cel*.62}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(runeVan(it),c*cel+cel/2,r*cel+cel*.55);ctx.restore()}}
  for(let i=geesten.length-1;i>=0;i--){const g=geesten[i];g.l-=.065*dt;if(g.l<=0){geesten.splice(i,1);continue}const z=cel*(1+(1-g.l)*.45);ctx.globalAlpha=g.l*.85;ctx.drawImage(tegelBeeld(T,g.k,cel),g.x-z/2,g.y-z/2,z,z);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=g.l*.6;ctx.drawImage(KU.stof(T.t[g.k]?T.t[g.k][1]:'#fff'),g.x-z*.6,g.y-z*.6,z*1.2,z*1.2);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1}
  if(M3.sleepTeken)M3.sleepTeken(ctx,nu);fxTeken(dt,nu);
  {const R1=window._rank1,R2=window._rank2;if(R1&&R1.complete&&R1.naturalWidth)for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++)if(b.lay[r][c]){const x=c*cel+cel/2,y=r*cel+cel/2,h=cel*1.2,w=h*R1.naturalWidth/R1.naturalHeight;ctx.save();ctx.globalAlpha=.78;ctx.translate(x,y);ctx.rotate(-.7);ctx.drawImage(R1,-w/2,-h/2,w,h);ctx.restore();if(b.lay[r][c]>1&&R2.complete){const w2=h*R2.naturalWidth/R2.naturalHeight;ctx.save();ctx.globalAlpha=.78;ctx.translate(x,y);ctx.rotate(.7);ctx.drawImage(R2,-w2/2,-h/2,w2,h);ctx.restore()}}if(window.tekenStrik)tekenStrik(ctx,b,cel)}
  for(let i=planken.length-1;i>=0;i--){const q=planken[i];q.vy+=.35*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.a+=q.va*dt;q.l-=.012*dt;if(q.l<=0||q.y>H+40){planken.splice(i,1);continue}ctx.save();ctx.globalAlpha=Math.min(1,q.l*1.5);ctx.translate(q.x,q.y);ctx.rotate(q.a);if(q.spijker){ctx.fillStyle='#7a7f8a';ctx.fillRect(-1.5,-4,3,8);ctx.fillStyle='#b8bcc6';ctx.fillRect(-3,-5,6,2)}else{const g=ctx.createLinearGradient(0,-q.h/2,0,q.h/2);g.addColorStop(0,'#d9a066');g.addColorStop(.5,'#b97a3e');g.addColorStop(1,'#8a5426');ctx.fillStyle=g;ctx.fillRect(-q.w/2,-q.h/2,q.w,q.h);ctx.strokeStyle='rgba(70,35,10,.6)';ctx.lineWidth=1;ctx.strokeRect(-q.w/2,-q.h/2,q.w,q.h);ctx.fillStyle='#5a5f6a';ctx.fillRect(-q.w/2+3,-1.5,3,3);ctx.fillRect(q.w/2-6,-1.5,3,3)}ctx.restore()}
  for(const p of deeltjes){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=p.st?.97:1;p.vy=p.st?p.vy*.97-.02*dt:p.vy+.2*dt;p.l-=(p.st?.024:.03)*dt;const a=Math.max(0,p.l);
   if(p.st){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(1,a)*(.65+.35*Math.sin(nu/50+p.r*9));const z=p.r*4.2*(.5+Math.min(1,a)*.6);ctx.drawImage(KU.stof(p.k),p.x-z/2,p.y-z/2,z,z);ctx.globalCompositeOperation='source-over'}
   else{ctx.globalAlpha=Math.min(1,a);ctx.fillStyle=p.k;ctx.fillRect(p.x,p.y,p.r*2,p.r)}}ctx.globalAlpha=1;
  for(let i=deeltjes.length-1;i>=0;i--)if(deeltjes[i].l<=0)deeltjes.splice(i,1);
  ctx.restore();
  if(!bezig&&Date.now()-hintT>6000&&!hint){hint=b.heeftZet();if(hint===true)hint=null}
  requestAnimationFrame(frame)};requestAnimationFrame(frame);
 const blip=(n)=>{try{const{ac,master}=fx.ctx();const t=ac.currentTime;[0,7].forEach((iv,j)=>{const o=ac.createOscillator(),g=ac.createGain();o.type=j?'sine':'triangle';o.frequency.value=523*2**((Math.min(n,12)*2+iv)/12);g.gain.setValueAtTime(0,t+j*.04);g.gain.linearRampToValueAtTime(j?.06:.13,t+j*.04+.01);g.gain.exponentialRampToValueAtTime(.001,t+.45);o.connect(g);g.connect(master);o.start(t+j*.04);o.stop(t+.5)})}catch(e){}};
 setTimeout(()=>{try{window.m3NaBord&&m3NaBord(b,boost||{})}catch(e){console.error(e)}},0);
 const hooks={combo:n=>{blip(n);if(n>=3)combo(['','','','Prachtig!','Magisch!','Betoverend!','Fenomenaal!'][Math.min(6,n)])},wis:()=>{toonFx();doelUI()},geschud:()=>toast('Geen zetten meer: de voorwerpen worden opnieuw geschud.')};
 const cel_=e=>{const r=cv.getBoundingClientRect();return[Math.floor((e.clientY-r.top)/cel),Math.floor((e.clientX-r.left)/cel)]};
 async function probeer(a,c){if(bezig||!b.binnen(...c)||Math.abs(a[0]-c[0])+Math.abs(a[1]-c[1])!=1)return;if(window.strikTegen&&strikTegen(b,a,c,cel)){sel=null;hint=null;hintT=Date.now();return}bezig=true;sel=null;hint=null;
  const ok=await b.wissel(a,c,hooks);toonFx();doelUI();if(!ok){fx.speel('fout');vib(20)}bezig=false;hintT=Date.now();einde()}
 M3.probeer=probeer;M3.toonFx=toonFx;
 let lev=null;M3.leviosa=()=>{lev={f:'kies'};sel=null;toast('Wingardium Leviosa! Pak een blok vast en sleep het.')};
 const vastC=(rr,cc)=>(b.kist[rr]&&b.kist[rr][cc])||(b.strik&&b.strik[rr][cc]);
 const posPx=e=>{const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
 function levDown(e){const p=cel_(e);if(!b.binnen(...p))return;const t=b.g[p[0]][p[1]];if(!t||vastC(...p)){toast('Dat kan niet zweven. Pak een ander blok.');return}
  try{cv.setPointerCapture(e.pointerId)}catch(x){}const [x,y]=posPx(e);lev={f:'sleep',src:p,t,fx:x,fy:y,P:zwPendel()};t.sleep=1;try{fx.speel('whoosh')}catch(x){}}
 function levMove(e){if(lev&&lev.f=='sleep'){const [x,y]=posPx(e);lev.fx=x;lev.fy=y}}
 async function levUp(){if(!lev||lev.f!='sleep')return;const {src:a,t,P}=lev;const th=P.th,cx=lev.fx+Math.sin(th)*cel*.5,cy=lev.fy+Math.cos(th)*cel*.5+cel*.12;const d=[Math.floor(cy/cel),Math.floor(cx/cel)];lev=null;t.sleep=0;
  if(!b.binnen(...d)||vastC(...d)||!b.g[d[0]][d[1]]||(d[0]==a[0]&&d[1]==a[1])){t.zw=2;t.lift=.6;toast(d[0]==a[0]&&d[1]==a[1]?'Het blok staat weer op zijn plek.':'Daar kan het niet. Het blok zweeft terug.');lev={f:'kies'};return}
  bezig=true;const tb=b.g[d[0]][d[1]];b.wis(a[0],a[1],d[0],d[1]);t.x=cx/cel-.5;t.y=cy/cel-.5;t.zw=2;t.lift=.5;tb.zw=2;tb.lift=0;try{fx.speel('klik')}catch(x){}await b.wacht(700);
  await b.oplossen(d,a,new Set(),hooks);toonFx();doelUI();bezig=false;hintT=Date.now();einde()}
 M3.knal=async cel=>{if(bezig||!b)return false;bezig=true;try{await b.oplossen(null,null,new Set(cel.map(x=>x+'')),hooks)}catch(e){console.warn(e)}toonFx();doelUI();bezig=false;hintT=Date.now();einde();return true};
 M3.levState=()=>lev;M3.sleepTeken=(ctx,nu)=>{if(!lev||lev.f!='sleep')return;const L=cel*.9,th=lev.P.stap(lev.fx,lev.fy,L);ctx.save();ctx.strokeStyle='rgba(255,220,120,.7)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(lev.fx,lev.fy-cel*.35);ctx.lineTo(lev.fx,lev.fy);ctx.stroke();
  ctx.translate(lev.fx,lev.fy);ctx.rotate(-th);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.55;ctx.drawImage(KU.stof('#ffd76a'),-cel*.85,-cel*.35,cel*1.7,cel*1.7);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.translate(0,cel*.5);tekenTegel(lev.t,0,0,1.1,nu);ctx.restore();
  if(Math.random()<.35)deeltjes.push({x:lev.fx+(Math.random()-.5)*cel*.6,y:lev.fy+cel*.8,vx:(Math.random()-.5)*.3,vy:-.4,r:1.5+Math.random()*2,l:1,st:1,k:'#ffe28a'})};
 let start=null;
 cv.onpointerdown=e=>{if(lev&&lev.f=='kies'&&!bezig){levDown(e);return}if(bezig)return;try{cv.setPointerCapture(e.pointerId)}catch(x){}const p=cel_(e);if(window.strikTik&&strikTik(b,p,cel))return;if(window.strikVast&&strikVast(b,p)){window.strikAuw&&strikAuw(p,cel);return}start={p,x:e.clientX,y:e.clientY};
  if(sel&&(sel[0]!=p[0]||sel[1]!=p[1])&&Math.abs(sel[0]-p[0])+Math.abs(sel[1]-p[1])==1){const a=sel;sel=null;start=null;probeer(a,p);return}sel=p;{const t=b.g[p[0]]&&b.g[p[0]][p[1]];if(t&&t.s&&window.zwKies)zwKies.start();else fx.speel(t&&t.s?'kies':'klik')}};
 cv.onpointermove=e=>{if(lev&&lev.f=='sleep'){levMove(e);return}if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.hypot(dx,dy)>cel*.35){const p=start.p;const d=Math.abs(dx)>Math.abs(dy)?[0,Math.sign(dx)]:[Math.sign(dy),0];start=null;probeer(p,[p[0]+d[0],p[1]+d[1]])}};
 cv.onpointerup=cv.onpointercancel=()=>{start=null;if(lev&&lev.f=='sleep')levUp()};
 function einde(){if(b.af)return;if(b.klaar()){b.af=1;m3Winst(n,b)}else if(b.zet<=0)m3Verlies(n,b)}
 M3.einde=einde}
function m3Winst(n,b){const sterBonus=b.zet>=5?1:0;const gal=10+b.zet*2+((window.lvZwaar&&lvZwaar(n))|0)*10;S.schilden=(S.schilden||0)+1;S.galjoenen+=gal;S.xp+=10;S.m3lvl=Math.max(S.m3lvl||1,n+1);delete (S.m3extra||{})[n];tel('opgelost');tel('m3');tel('sterren');bewaar();stats();fx.speel('fanfare');vib([40,30,40,30,120]);try{confetti&&confetti()}catch(e){}
 try{buitVoor('memory')}catch(e){}
 const o=document.createElement('div');o.className='modal';o.innerHTML=`<div class="modalin rococo m3eind"><h2>Level ${n} gehaald!</h2><div class="m3ster">${schildSVG('groot')}</div><p><b>+1 huisschild</b> voor de lokalen · +${gal} Smekkies${b.zet?` (${b.zet} zetten over)`:''}</p>${tilly(m3Zin(true))}<button class="knop volgende" id="m3verder">Naar mijn kas</button><button class="knop" id="m3volg">Volgend level</button></div>`;
 document.body.appendChild(o);$('#m3verder').onclick=()=>{o.remove();ga('home')};$('#m3volg').onclick=()=>{o.remove();ga('match3',n+1)};try{kernNa&&kernNa()}catch(e){}}
function m3Verlies(n,b){const o=document.createElement('div');o.className='modal';o.innerHTML=`<div class="modalin rococo m3eind"><h2>Bijna!</h2><p>Nog ${b.doel.filter(d=>d.over>0).map(d=>d.over).join(' + ')} te gaan.</p>${tilly(m3Zin(false))}${(S.bo&&S.bo.spijbel>0)?`<button class="knop volgende" id="m3plus5">Spijbelsnoepdoos eten: +5 zetten (nog ${S.bo.spijbel})</button>`:''}<button class="knop" id="m3opn">Opnieuw</button><button class="linkknop" id="m3stop">Stoppen</button></div>`;
 document.body.appendChild(o);
 const p5=$('#m3plus5');if(p5)p5.onclick=()=>{if(!(S.bo.spijbel>0))return;S.bo.spijbel--;bewaar();b.zet+=5;$('#m3z').textContent=b.zet;o.remove()};
 $('#m3opn').onclick=()=>{o.remove();verliesLeven();ga('match3',n)};$('#m3stop').onclick=()=>{o.remove();verliesLeven();ga('home')}}
function m3Zin(w){const W=['Ja! Zag je die raket door de rij gaan? Ik kreeg kippenvel.','Wauw, Luna. Professor Stronk gaat dit horen, echt waar.','Die combinatie was briljant. Nog eentje?','Zo, dat was een ster. Wat gaan we ermee doen in de kas?'],L=['Zo dichtbij! Ik denk dat die onderste rij de sleutel is.','Bijna, echt waar. Zullen we het nog eens proberen? Ik help mee zoeken.','Hmm, die kistjes waren koppig. Een ketelbom zou wonderen doen.'];const a=w?W:L;return a[Math.random()*a.length|0]}
/* milde levens */
def('harten',{n:5,t:Date.now()});
function levens(){const h=S.harten;while(h.n<5&&Date.now()-h.t>20*6e4){h.n++;h.t+=20*6e4}if(h.n>=5)h.t=Date.now();return h.n}
function verliesLeven(){levens();if(S.harten.n>=5)S.harten.t=Date.now();S.harten.n=Math.max(0,S.harten.n-1);bewaar()}
function harten(){const n=levens();return Array.from({length:5},(_,i)=>`<span class="hart ${i<n?'vol':''}">${icoon('hart')}</span>`).join('')+(n<5?` <small>+1 over ${Math.ceil((20*6e4-(Date.now()-S.harten.t))/6e4)} min</small>`:'')}
