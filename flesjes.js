'use strict';
/* Flesjesmodellen voor de toverdranken en de elixers, plus glanzende harten (levens). */
(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const P={
 slaap:{n:'Slaapdrankje',vorm:'rond',kl:['#b6a2ec','#4b3d8a'],gl:'#a58cff',dop:'kurk',lv:.42},
 opkikker:{n:'Opkikker',vorm:'hoog',kl:['#ffc070','#c8501f'],gl:'#ff8a3a',dop:'was',was:'#a3262a',lv:.3,stoom:1},
 felix:{n:'Felix',vorm:'klein',kl:['#fff0a0','#b98a1a'],gl:'#ffd95e',dop:'goud',lv:.25,goud:1},
 licht:{n:'Lichtbrouwsel',vorm:'peer',kl:['#fffbd0','#7fd0a0'],gl:'#f0ffb0',dop:'kurk',lv:.38,kern:'#fffbe0'},
 diep:{n:'Diep Licht',vorm:'hart',kl:['#a8c8ff','#3a2a8a'],gl:'#7aa0ff',dop:'was',was:'#2c2a6a',lv:.34,kern:'#d8e6ff'},
 vocht:{n:'Levende Dood',vorm:'vierkant',kl:['#8fb89a','#1f3b2e'],gl:'#6fbf9a',dop:'was',was:'#1d1d1d',lv:.32}};
window.FLESJES=P;
/* silhouet in een 100×140 vak */
function vorm(g,v){g.beginPath();
 if(v=='rond'){g.moveTo(43,14);g.lineTo(43,52);g.bezierCurveTo(18,58,10,80,12,96);g.bezierCurveTo(14,124,34,134,50,134);g.bezierCurveTo(66,134,86,124,88,96);g.bezierCurveTo(90,80,82,58,57,52);g.lineTo(57,14)}
 else if(v=='hoog'){g.moveTo(44,10);g.lineTo(44,26);g.quadraticCurveTo(33,30,33,40);g.lineTo(33,118);g.quadraticCurveTo(33,134,50,134);g.quadraticCurveTo(67,134,67,118);g.lineTo(67,40);g.quadraticCurveTo(67,30,56,26);g.lineTo(56,10)}
 else if(v=='klein'){g.moveTo(45,34);g.lineTo(45,50);g.quadraticCurveTo(38,54,38,62);g.lineTo(38,120);g.quadraticCurveTo(38,134,50,134);g.quadraticCurveTo(62,134,62,120);g.lineTo(62,62);g.quadraticCurveTo(62,54,55,50);g.lineTo(55,34)}
 else if(v=='peer'){g.moveTo(44,14);g.lineTo(44,44);g.bezierCurveTo(36,54,30,62,24,80);g.bezierCurveTo(14,112,30,134,50,134);g.bezierCurveTo(70,134,86,112,76,80);g.bezierCurveTo(70,62,64,54,56,44);g.lineTo(56,14)}
 else if(v=='hart'){g.moveTo(44,14);g.lineTo(44,52);g.bezierCurveTo(36,46,14,46,12,68);g.bezierCurveTo(10,92,36,112,50,134);g.bezierCurveTo(64,112,90,92,88,68);g.bezierCurveTo(86,46,64,46,56,52);g.lineTo(56,14)}
 else {g.moveTo(43,26);g.lineTo(43,44);g.lineTo(32,48);g.lineTo(26,56);g.lineTo(26,124);g.lineTo(32,132);g.lineTo(68,132);g.lineTo(74,124);g.lineTo(74,56);g.lineTo(68,48);g.lineTo(57,44);g.lineTo(57,26)}
 g.closePath()}
const TOP={rond:52,hoog:30,klein:54,peer:50,hart:50,vierkant:48},HAL={rond:14,hoog:10,klein:34,peer:14,hart:14,vierkant:26};
function teken(id,ph,px,lb){const d=P[id]||P.slaap;const W=Math.round(px*100/140),H=px;const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');const s=H/140;g.scale(s,s);
 const t=ph*Math.PI*2,top=TOP[d.vorm],hals=HAL[d.vorm];
 // schaduw
 g.fillStyle='rgba(30,15,5,.28)';g.beginPath();g.ellipse(50,136,30,3.5,0,0,6.283);g.fill();
 // gloed achter de fles
 const gr=g.createRadialGradient(50,95,4,50,95,52);gr.addColorStop(0,hexa(d.gl,.35+.12*Math.sin(t)));gr.addColorStop(1,hexa(d.gl,0));g.fillStyle=gr;g.fillRect(0,30,100,110);
 // glas achterkant
 vorm(g,d.vorm);g.fillStyle='rgba(215,235,255,.16)';g.fill();
 g.save();vorm(g,d.vorm);g.clip();
 // vloeistof met golvend oppervlak
 const yl=top+(134-top)*d.lv,tilt=Math.sin(t)*.07;
 const lg=g.createLinearGradient(0,yl,0,134);lg.addColorStop(0,d.kl[0]);lg.addColorStop(1,d.kl[1]);g.fillStyle=lg;
 g.beginPath();g.moveTo(0,140);for(let x=0;x<=100;x+=5)g.lineTo(x,yl+tilt*(x-50)+Math.sin(x*.12+t*2)*1.1);g.lineTo(100,140);g.closePath();g.fill();
 if(d.kern){const k=g.createRadialGradient(48,104,2,48,104,30);k.addColorStop(0,hexa(d.kern,.85+.1*Math.sin(t*2)));k.addColorStop(1,hexa(d.kern,0));g.fillStyle=k;g.fillRect(0,yl,100,140-yl)}
 // meniscus
 g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1.6;g.beginPath();for(let x=10;x<=90;x+=5){const y=yl+tilt*(x-50)+Math.sin(x*.12+t*2)*1.1;x==10?g.moveTo(x,y):g.lineTo(x,y)}g.stroke();
 g.fillStyle='rgba(255,255,255,.12)';g.beginPath();g.ellipse(50,yl+2,34,3,tilt,0,6.283);g.fill();
 // belletjes
 for(let i=0;i<6;i++){const q=(ph+i/6)%1;const bx=34+((i*37)%32)+Math.sin(q*9+i)*2,by=132-q*(132-yl-4);g.fillStyle=`rgba(255,255,255,${.45*(1-q)})`;g.beginPath();g.arc(bx,by,1+((i*7)%3)*.5,0,6.283);g.fill()}
 // Felix: draaiend goud
 if(d.goud){for(let i=0;i<14;i++){const a=t+i*.9,r=3+i*.75,y=118-i*3.6;g.fillStyle=`rgba(255,245,190,${.75-i*.04})`;g.beginPath();g.arc(50+Math.cos(a)*r*.8,y+Math.sin(a)*1.5,1.3,0,6.283);g.fill()}}
 // breking: donkere rand binnen het glas
 vorm(g,d.vorm);g.lineWidth=7;g.strokeStyle='rgba(0,10,30,.16)';g.stroke();g.lineWidth=2.5;g.strokeStyle='rgba(255,255,255,.18)';g.stroke();
 g.restore();
 // glasrand
 vorm(g,d.vorm);g.lineWidth=1.6;g.strokeStyle='rgba(60,70,90,.55)';g.stroke();
 // glimlichten
 const hl=g.createLinearGradient(20,0,40,0);hl.addColorStop(0,'rgba(255,255,255,0)');hl.addColorStop(.5,'rgba(255,255,255,.7)');hl.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=hl;
 g.beginPath();const lx=d.vorm=='hoog'?37:d.vorm=='klein'?41:d.vorm=='vierkant'?30:22;g.moveTo(lx,top+12);g.quadraticCurveTo(lx-2,top+40,lx+1,top+64);g.lineTo(lx+6,top+62);g.quadraticCurveTo(lx+3,top+40,lx+6,top+12);g.fill();
 g.fillStyle='rgba(255,255,255,.75)';g.beginPath();g.ellipse(d.vorm=='hoog'?60:d.vorm=='klein'?57:68,top+14,2.4,4,-.4,0,6.283);g.fill();
 g.fillStyle='rgba(255,255,255,.5)';g.fillRect(45,hals+4,2,top-hals-8);
 // rand van de hals
 g.fillStyle='rgba(225,235,245,.9)';g.beginPath();g.ellipse(50,hals+2,8.5,2.6,0,0,6.283);g.fill();g.strokeStyle='rgba(60,70,90,.6)';g.lineWidth=1;g.stroke();
 // dop
 if(d.dop=='kurk'){const kg=g.createLinearGradient(43,0,57,0);kg.addColorStop(0,'#8a5a2b');kg.addColorStop(.5,'#c89058');kg.addColorStop(1,'#7a4a20');g.fillStyle=kg;g.beginPath();g.moveTo(43.5,hals+3);g.lineTo(42,hals-9);g.quadraticCurveTo(50,hals-12,58,hals-9);g.lineTo(56.5,hals+3);g.closePath();g.fill();g.strokeStyle='rgba(70,40,15,.5)';g.lineWidth=.8;for(let i=0;i<3;i++){g.beginPath();g.moveTo(45+i*4,hals-7);g.lineTo(46+i*4,hals);g.stroke()}g.beginPath();g.moveTo(43,hals-3);g.lineTo(57,hals-3);g.stroke()}
 else if(d.dop=='goud'){const kg=g.createLinearGradient(43,0,57,0);kg.addColorStop(0,'#7a5408');kg.addColorStop(.5,'#ffe9a0');kg.addColorStop(1,'#8a6410');g.fillStyle=kg;g.beginPath();g.ellipse(50,hals-2,7,5,0,0,6.283);g.fill();g.beginPath();g.arc(50,hals-9,3.2,0,6.283);g.fill();g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.arc(48.6,hals-10,1,0,6.283);g.fill()}
 else {g.fillStyle=d.was;g.beginPath();g.ellipse(50,hals,10,6,0,0,6.283);g.fill();g.beginPath();g.moveTo(41,hals+2);g.quadraticCurveTo(40,hals+9,42.5,hals+10);g.quadraticCurveTo(44,hals+8,44,hals+4);g.moveTo(55,hals+3);g.quadraticCurveTo(56,hals+12,58,hals+12);g.quadraticCurveTo(60,hals+9,59,hals+3);g.fill();
  g.fillStyle='rgba(255,255,255,.28)';g.beginPath();g.ellipse(47,hals-2,4,1.6,-.3,0,6.283);g.fill();g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=.8;g.beginPath();g.arc(50,hals,3.5,0,6.283);g.stroke()}
 // stoom (Opkikker)
 if(d.stoom)for(let i=0;i<3;i++){const q=(ph+i/3)%1;g.fillStyle=`rgba(255,255,255,${.35*(1-q)})`;g.beginPath();g.arc(50+Math.sin(q*6+i)*4,hals-12-q*10,2+q*3,0,6.283);g.fill()}
 // etiket
 if(lb){const ly=Math.max(top+16,Math.min(110,top+(134-top)*.5)),lw=d.vorm=='klein'?28:d.vorm=='hoog'?36:44,lh=d.vorm=='klein'?18:16;g.save();g.translate(50,ly);g.rotate(-.04);
  const pg=g.createLinearGradient(0,-lh/2,0,lh/2);pg.addColorStop(0,'#f8ecc8');pg.addColorStop(1,'#e2cc96');g.fillStyle=pg;rr(g,-lw/2,-lh/2,lw,lh,3);g.fill();g.strokeStyle='#8a6a34';g.lineWidth=.9;g.stroke();g.strokeStyle='rgba(138,106,52,.5)';g.lineWidth=.5;rr(g,-lw/2+2,-lh/2+2,lw-4,lh-4,2);g.stroke();
  g.fillStyle='#4a2a10';g.textAlign='center';g.textBaseline='middle';const woorden=d.n.split(' ');let fs=8;g.font=`bold ${fs}px Georgia,serif`;
  if(woorden.length>1&&d.vorm!='hoog'){g.font='bold 6.4px Georgia,serif';g.fillText(woorden[0],0,-3.2);g.fillText(woorden.slice(1).join(' '),0,4)}else{while(g.measureText(d.n).width>lw-5&&fs>4.5){fs-=.4;g.font=`bold ${fs}px Georgia,serif`}g.fillText(d.n,0,.5)}g.restore()}
 return c}
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function hexa(h,a){const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${Math.max(0,Math.min(1,a)).toFixed(3)})`}
const NF=16,CACHE={};
function frame(id,i,px,lb){const k=id+'|'+px+'|'+lb;const a=CACHE[k]||(CACHE[k]=[]);return a[i]||(a[i]=teken(id,i/NF,px,lb))}
window.flesModel=(id,o={})=>{const d=P[id]||P.slaap;const h=o.h||64,lb=o.label!=null?o.label:h>=56;return `<span class="fm fm-${id} ${o.cls||''}" style="--fmh:${h}px;--gl:${d.gl}" title="${d.n}"><canvas class="fmc" data-fm="${id}" data-lb="${lb?1:0}" data-h="${h}" aria-label="${d.n}"></canvas></span>`};
let fi=0;
function tik(){fi=(fi+1)%NF;const dpr=Math.min(2,devicePixelRatio||1);document.querySelectorAll('canvas.fmc').forEach(c=>{if(!c.isConnected||(!c.offsetParent&&c.dataset.ok))return;const px=Math.round((+c.dataset.h||64)*dpr);
 if(!c.dataset.ok){c.width=Math.round(px*100/140);c.height=px;c.dataset.ok=1;c.dataset.o=Math.random()*NF|0}else if(RM)return;
 const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.drawImage(frame(c.dataset.fm,(fi+(+c.dataset.o))%NF,px,c.dataset.lb=='1'),0,0)})}
setInterval(tik,90);new MutationObserver(()=>{if(document.querySelector('canvas.fmc:not([data-ok])'))tik()}).observe(document.body,{childList:true,subtree:true});

/* ---------- plaatsen ---------- */
// level-start van een plaaglevel: welk flesje hoort erbij
if(typeof V!=='undefined'&&V.match3){const _m=V.match3;V.match3=async function(n,...a){const r=await _m.call(this,n,...a);try{const p=window.plaagVan&&plaagVan(n);const h=document.querySelector('.m3voor h2');if(p&&h&&!document.querySelector('.fmintro')){const heb=(S.flesjes&&S.flesjes[p.id])|0;h.insertAdjacentHTML('afterend',`<div class="fmintro">${flesModel(p.id,{h:84})}<small>${P[p.id]?P[p.id].n:''}<b>${heb?'×'+heb+' in je kist':'nog niet gebrouwen'}</b></small></div>`)}}catch(e){console.warn(e)}return r}}

/* ---------- harten ---------- */
let hid=0;
window.hartSVG=(st,p)=>{const i=++hid;const vol=st=='vol';const f=st=='laad'?Math.max(.06,Math.min(1,p||0)):vol?1:0;
 return `<svg class="hsvg" viewBox="0 0 40 36" aria-hidden="true"><defs><linearGradient id="hg${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8fa6"/><stop offset=".45" stop-color="#ec2f55"/><stop offset="1" stop-color="#9c0f2e"/></linearGradient>
 <clipPath id="hc${i}"><rect x="0" y="${(36*(1-f)).toFixed(1)}" width="40" height="36"/></clipPath></defs>
 <path d="M20 33C9 25 2 18 2 10.5 2 5.5 6 2 10.6 2c3.9 0 7 2.4 9.4 5.6C22.4 4.4 25.5 2 29.4 2 34 2 38 5.5 38 10.5 38 18 31 25 20 33z" fill="rgba(120,40,60,.18)" stroke="#8a2a40" stroke-width="1.6" stroke-opacity=".55"/>
 <g clip-path="url(#hc${i})"><path d="M20 33C9 25 2 18 2 10.5 2 5.5 6 2 10.6 2c3.9 0 7 2.4 9.4 5.6C22.4 4.4 25.5 2 29.4 2 34 2 38 5.5 38 10.5 38 18 31 25 20 33z" fill="url(#hg${i})" stroke="#7a0c24" stroke-width="1.4"/>
 <ellipse cx="11.5" cy="9.5" rx="4.6" ry="3" fill="#fff" opacity=".7" transform="rotate(-30 11.5 9.5)"/><circle cx="29" cy="8.5" r="1.4" fill="#fff" opacity=".55"/></g>
 ${vol?'<path class="hglint" d="M6 14 L14 6" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity="0"/>':''}</svg>`};
function minTot(){return Math.max(1,Math.ceil((20*6e4-(Date.now()-S.harten.t))/6e4))}
window.harten=function(o={}){const n=levens();const p=n<5?Math.min(1,(Date.now()-S.harten.t)/(20*6e4)):0;
 return `<span class="hrij ${n>=5?'allevol':''}">${Array.from({length:5},(_,i)=>`<span class="hart2 ${i<n?'vol':i==n?'laad':'leeg'} ${o.wankel===i?'wankel':''}" style="--d:${i*.12}s">${hartSVG(i<n?'vol':i==n?'laad':'leeg',p)}${i<n&&n>=5?'<i class="hvonk"></i>':''}</span>`).join('')}</span>${n<5?`<span class="htimer"><i></i>volgend hart over <b>${minTot()} min</b></span>`:`<span class="htimer vol">alle harten vol</span>`}`};
// verliesscherm: het hart dat je kwijt bent breekt
if(typeof m3Verlies==='function'){const _v=m3Verlies;m3Verlies=function(n,b){const r=_v(n,b);try{const p=document.querySelector('.m3eind p');const nu=levens();if(p)p.insertAdjacentHTML('afterend',`<p class="harten groot hverlies">${harten({wankel:nu-1})}</p><p class="klein hkost">Opnieuw proberen of stoppen kost één hart.</p>`);
  ['m3opn','m3stop'].forEach(id=>{const k=document.getElementById(id);if(!k||!k.onclick)return;const orig=k.onclick;k.onclick=e=>{if(k.dataset.bezig)return;k.dataset.bezig=1;const h=document.querySelector('.hverlies .hart2.wankel');if(h&&!RM){h.classList.remove('wankel');h.classList.add('breekt');try{fx.speel('fout')}catch(x){}setTimeout(()=>orig.call(k,e),800)}else orig.call(k,e)}})}catch(e){console.warn(e)}return r}}
// Hal: harten zichtbaar bovenin
if(typeof V!=='undefined'&&V.home){const _h=V.home;V.home=(...a)=>{const r=_h(...a);try{const app=document.getElementById('app');if(app&&!document.getElementById('halharten'))app.insertAdjacentHTML('afterbegin',`<div id="halharten" class="harten halh">${harten()}</div>`)}catch(e){console.warn(e)}return r}}
setInterval(()=>{document.querySelectorAll('#halharten,.m3voor .harten').forEach(e=>{if(e.isConnected)e.innerHTML=harten()})},30000);
})();
