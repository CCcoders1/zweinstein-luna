'use strict';
/* Toverdranken brouwen: eigen ketel met echte vloeistof, een houten lepel die je vinger volgt, rimpels, draaikolk, bubbels en stoom. */
(function(){
const BEELD={ov:{src:'img/ketel/werkplaats.webp',e:[.3516,.3999,.2665,.0787]},cl:{src:'img/ketel/ketel.webp',e:[.5061,.4230,.4028,.1534]}};
const IW=768,IH=1152,WATER='#3f5a63',TAFEL=150;const TAFELIMG=new Image();TAFELIMG.src='img/ketel/tafel.webp';
const RECEPT=[
 {id:'slaap',naam:'Slaapdrankje',zin:'Een rustig paars drankje voor een goede nachtrust.',kl:['#6d6fa8','#9b86d6'],beloning:15,stap:[['in','valeriaan'],['roer',3,1],['in','varkensgras'],['roer',2,1]]},
 {id:'opkikker',naam:'Opkikkerdrankje',zin:'Warm je op als je verkouden bent. Er komt stoom uit je oren!',kl:['#c8693a','#ff8a3a'],beloning:20,stap:[['in','wolfsmelk'],['roer',3,1],['in','alsem'],['roer',3,1]]},
 {id:'felix',naam:'Felix Fortunatis',zin:'Vloeibaar geluk, glanzend als goud. Heel lastig om te brouwen.',kl:['#b98a3a','#d9b04a','#ffd95e'],beloning:40,slot:'Brouw eerst een Slaapdrankje en een Opkikkerdrankje.',stap:[['in','affodil'],['roer',3,1],['in','mandragora'],['roer',2,-1],['in','wolfsmelk'],['roer',3,1]]}];
const INGR=['valeriaan','varkensgras','wolfsmelk','alsem','affodil','mandragora'];
S.drank=S.drank&&typeof S.drank=='object'?S.drank:{};
const naam=i=>(window.ZADEN&&ZADEN[i]?ZADEN[i][0]:i);
const kleurI=i=>(window.ZADEN&&ZADEN[i]?ZADEN[i][4]:'#9fd8cb');
const ico=i=>{try{return plantSVG(4,kleurI(i),i)}catch(e){return '🌿'}};
const geluid=(k,v)=>{try{if(window.zwSpeel&&zwSpeel(k,v))return true}catch(e){}return false};
const slot=r=>r.slot&&!(S.drank.slaap&&S.drank.opkikker);
const hex=h=>{h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]};
const rustig=matchMedia('(prefers-reduced-motion: reduce)').matches;

let K=null; // toestand van de open ketel
V.ketel=()=>{stop();const a=$('#app');a.innerHTML=`<div class="kt" id="kt"><canvas id="ktc"></canvas><div class="kt-ov" id="ktov"></div>
 <div class="kt-top"><button class="knop klein kt-terug" id="ktterug">← Terug</button><div class="kt-kaart" id="ktkaart"></div></div><div class="kt-bank" id="ktbank"></div><div class="kt-tip" id="kttip"></div></div>`;
 const imgs={};let n=0;Object.entries(BEELD).forEach(([k,b])=>{const im=new Image();im.onload=()=>{if(++n==2&&K)K.klaar=1};im.src=b.src;imgs[k]=im});
 K={kort:innerHeight<720,imgs,modus:'ov',r:null,stap:0,acc:0,cur:hex(WATER),doel:hex(WATER),glans:0,vort:0,twist:0,bub:[],stoom:[],dr:[],ster:[],lepel:null,vinger:null,t0:performance.now(),rozet:0};
 $('#ktterug').onclick=()=>{if(K.modus=='cl')naarOv();else{stop();ga('meer')}};
 const cv=$('#ktc');cv.onpointerdown=e=>neer(e);cv.onpointermove=e=>beweeg(e);cv.onpointerup=cv.onpointercancel=e=>los(e);
 addEventListener('resize',lay);lay();naarOv(true);K.raf=requestAnimationFrame(frame);try{fx.speel('whoosh')}catch(e){}};
function stop(){if(K&&K.raf)cancelAnimationFrame(K.raf);removeEventListener('resize',lay);K=null}

/* ---------- opbouw ---------- */
function lay(){if(!K)return;const cv=$('#ktc');if(!cv)return;const W=innerWidth,H=innerHeight,d=Math.min(2,devicePixelRatio||1);cv.width=W*d;cv.height=H*d;cv.style.width=W+'px';cv.style.height=H+'px';K.W=W;K.H=H;K.d=d;
 let s,iw,ih,ix,iy;if(K.modus=='cl'){const TB=TAFEL,kb=$('#ktkaart'),cardB=(kb?kb.getBoundingClientRect().bottom:60)+10;K.cardB=cardB;s=Math.min(W/IW,Math.max(120,(H-TB-cardB)/.63)/IH);iw=IW*s;ih=IH*s;ix=(W-iw)/2;iy=H-TB-ih*.9}
 else{s=W/IW;if(IH*s>H)s=H/IH;iw=IW*s;ih=IH*s;ix=(W-iw)/2;iy=Math.max(0,(H-ih)*.75)}K.L={s,iw,ih,ix,iy};
 const e=BEELD[K.modus].e;K.E={cx:ix+e[0]*iw,cy:iy+e[1]*ih,rx:e[2]*iw,ry:e[3]*ih};if(!K.h||K.simM!==K.modus){K.simM=K.modus;maakSim()}if(K.modus=='ov')bankOv()}
function maakSim(){const GW=K.modus=='cl'?112:72,GH=Math.round(GW*.58);K.GW=GW;K.GH=GH;K.h=new Float32Array(GW*GH);K.hp=new Float32Array(GW*GH);K.mask=new Uint8Array(GW*GH);
 for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const u=(x+.5)/GW*2-1,v=(y+.5)/GH*2-1;K.mask[y*GW+x]=u*u+v*v<1.04?1:0}
 const c=document.createElement('canvas');c.width=GW;c.height=GH;K.oc=c;K.ox=c.getContext('2d');K.id=K.ox.createImageData(GW,GH)}
function naarOv(eerst){K.modus='ov';K.lepel=null;lay();$('#ktbank').innerHTML='';$('#ktbank').style.display='none';kaart();tip(eerst?'Tik op de ketel om te gaan brouwen.':'');K.doel=hex(WATER)}
function naarCl(){K.modus='cl';$('#ktov').innerHTML='';lay();const E=K.E;K.lepel={x:E.cx+E.rx*.35,y:E.cy+E.ry*.15,vx:0,vy:0,hx:0,hy:0,eind:null};K.vinger=null;bank();kaart();
 const kt=$('#kt');kt.classList.remove('zoom');void kt.offsetWidth;kt.classList.add('zoom');geluid('ketel',.35);tip(K.r?'':'Kies hierboven een drankje.')}
function bankOv(){const o=$('#ktov');if(!o)return;const L=K.L;const heb=INGR.filter(i=>(S.oogst&&S.oogst[i])|0);const lijst=(heb.length?heb:INGR.slice(0,4)).slice(0,6);
 o.style.cssText=`left:${L.ix+L.iw*.14}px;top:${L.iy+L.ih*.535}px;width:${L.iw*.8}px;height:${L.ih*.06}px`;
 o.innerHTML=lijst.map(i=>`<span class="kt-ovi" title="${naam(i)}">${ico(i)}<b>${(S.oogst&&S.oogst[i])|0}</b></span>`).join('')}
function bank(){const b=$('#ktbank');b.style.display='';const nodig=K.r&&!K.klaarT&&K.r.stap[K.stap]&&K.r.stap[K.stap][0]=='in'?K.r.stap[K.stap][1]:'';
 b.innerHTML=`<div class="kt-plank">${INGR.map(i=>{const n=(S.oogst&&S.oogst[i])|0;return `<button type="button" class="kt-ingr ${i==nodig?'nodig':''}" data-i="${i}" aria-label="${naam(i)}"><span class="kt-pot"><span class="kt-ico">${ico(i)}</span></span><span class="kt-label"><small>${naam(i)}</small><i>${n?n+'×':'uit de kast'}</i></span></button>`}).join('')}</div>`;
 b.querySelectorAll('.kt-ingr').forEach(el=>el.onpointerdown=e=>pak(e,el.dataset.i,el))}
function kaart(){kaart0();if(K&&K.modus=='cl'){const kb=$('#ktkaart'),b=kb?kb.getBoundingClientRect().bottom+10:0;if(Math.abs(b-(K.cardB||0))>3)lay()}}
function kaart0(){const k=$('#ktkaart');if(!k)return;if(K.modus=='ov'){k.innerHTML=`<b>Toverdranken</b><small>Je eigen ketel in de kerker</small>`;return}
 if(!K.r){k.innerHTML=`<b>Welk drankje ga je brouwen?</b><div class="kt-rk">${RECEPT.map((r,i)=>`<button type="button" class="knop klein ${slot(r)?'dicht':''}" data-r="${i}">${window.flesModel?flesModel(r.id,{h:34,label:false}):''}${slot(r)?'🔒 ':''}${r.naam}${S.drank[r.id]?` ✓ <small>×${S.drank[r.id]}</small>`:''}</button>`).join('')}</div>`;
  k.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const r=RECEPT[+b.dataset.r];if(slot(r)){toast(r.slot);return}if(S.drank[r.id]){const mist=r.stap.filter(s=>s[0]=='in'&&!((S.oogst&&S.oogst[s[1]])|0)).map(s=>naam(s[1]).toLowerCase());if(mist.length){toast('Voor nog een '+r.naam.toLowerCase()+' heb je '+[...new Set(mist)].join(' en ')+' nodig. Kweek het in je kas.');return}}kies(r)});return}
 const r=K.r,kort=K.kort;k.innerHTML=`<div class="kt-kop"><b>📜 ${r.naam}</b><button type="button" class="kt-klap" id="ktklap">${kort?'Alle stappen ▾':'Kleiner ▴'}</button></div>`+(kort?`<p class="kt-nu">Stap ${Math.min(K.stap+1,r.stap.length)} van ${r.stap.length}: <b>${r.stap[K.stap]?stapTekst(r.stap[K.stap],K.stap):'Klaar!'}</b></p>`:`<ol class="kt-stappen">${r.stap.map((s,i)=>`<li class="${i<K.stap?'af':i==K.stap?'nu':''}"><span class="kt-vink">${i<K.stap?'✓':i+1}</span><span>${stapTekst(s,i)}</span></li>`).join('')}</ol>`);
 $('#ktklap').onclick=()=>{K.kort=!K.kort;kaart()}}
function stapTekst(s,i){if(s[0]=='in')return 'Doe er '+naam(s[1]).toLowerCase()+' in';const n=i==K.stap?Math.max(0,Math.min(s[1],Math.floor(K.acc*s[2]/(2*Math.PI)))):0;return `Roer ${s[1]}× ${s[2]>0?'met de klok mee ↻':'tegen de klok in ↺'}${i==K.stap?` <span class="kt-tel">${n}/${s[1]}</span>`:''}`}
function kies(r){K.r=r;K.stap=0;K.lastN=-1;K.acc=0;K.glans=0;K.klaarT=0;K.doel=hex(WATER);kaart();bank();stapTip()}
function stapTip(){const s=K.r&&K.r.stap[K.stap];if(!s)return;tip(s[0]=='in'?'Sleep '+naam(s[1]).toLowerCase()+' van de tafel in de ketel.':'Pak de lepel en roer '+(s[2]>0?'met de klok mee ↻':'tegen de klok in ↺')+'.')}
function tip(t){const e=$('#kttip');if(!e)return;e.textContent=t||'';e.classList.toggle('aan',!!t)}

/* ---------- invoer ---------- */
const inE=(x,y,m)=>{const E=K.E;const u=(x-E.cx)/E.rx,v=(y-E.cy)/E.ry;return u*u+v*v<(m||1)};
function neer(e){if(!K||!K.klaar)return;if(K.modus=='ov'){const E=K.E;const u=(e.clientX-E.cx)/(E.rx*1.15),v=(e.clientY-E.cy-E.ry*1.2)/(E.ry*3.2);if(u*u+v*v<1||inE(e.clientX,e.clientY,1.3))naarCl();return}
 if(K.klaarT)return;K.vinger={x:e.clientX,y:e.clientY};try{e.target.setPointerCapture(e.pointerId)}catch(x){}}
function beweeg(e){if(K&&K.vinger){K.vinger.x=e.clientX;K.vinger.y=e.clientY}}
function los(){if(K)K.vinger=null}
function pak(e,i,el){if(!K||K.modus!='cl')return;e.preventDefault();const c=document.createElement('div');c.className='kt-vlieg';c.innerHTML=ico(i);document.body.appendChild(c);let x=e.clientX,y=e.clientY;const zet=()=>{c.style.transform=`translate(${x-30}px,${y-50}px)`};zet();el.classList.add('weg');
 const mv=ev=>{x=ev.clientX;y=ev.clientY;zet()};const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);el.classList.remove('weg');
  if(K&&inE(x,y+20,1.15)){c.style.transition='transform .28s ease-in,opacity .28s';c.style.transform=`translate(${x-30}px,${y-20}px) scale(.35)`;c.style.opacity='.4';setTimeout(()=>{c.remove();erin(i,x,y)},280)}
  else{const r=el.getBoundingClientRect();c.style.transition='transform .4s ease-out';c.style.transform=`translate(${r.left+r.width/2-30}px,${r.top}px) scale(.6)`;setTimeout(()=>c.remove(),420)}};
 addEventListener('pointermove',mv);addEventListener('pointerup',up);addEventListener('pointercancel',up)}
function erin(i,x,y){if(!K)return;const E=K.E;let u=(x-E.cx)/E.rx,v=(y-E.cy)/E.ry;const m=Math.hypot(u,v);if(m>.85){u*=.85/m;v*=.85/m}
 plons(u,v,1.4,kleurI(i));if(!geluid('verr-drup'+(1+Math.random()*3|0),.5))geluid('splat',.3);
 if(!K.r){K.doel=meng(K.doel,hex(kleurI(i)),.35);tip('Kies eerst een drankje, dan weet je wat erin moet.');return}
 const s=K.r.stap[K.stap];if(!s||s[0]!='in'||s[1]!=i){tip(s&&s[0]=='in'?'Dat hoort er nu niet in. Nu moet er '+naam(s[1]).toLowerCase()+' in.':'Eerst roeren!');K.doel=meng(K.doel,hex(kleurI(i)),.15);return}
 if(S.oogst&&S.oogst[i]>0){S.oogst[i]--;bewaar()}
 const ni=K.r.stap.slice(0,K.stap+1).filter(x=>x[0]=='in').length-1;K.doel=hex(K.r.kl[Math.min(K.r.kl.length-1,ni)]);volgende();bank()}
function volgende(){K.stap++;K.acc=0;if(K.stap>=K.r.stap.length){klaar();bank();return}try{fx.speel('klik')}catch(e){}kaart();stapTip();bank()}
function klaar(){const r=K.r;K.klaarT=performance.now();K.doel=hex(r.kl[r.kl.length-1]);kaart();tip('');geluid('tover',.8)||(()=>{try{fx.speel('tover')}catch(e){}})();try{vib([20,40,30])}catch(e){}
 const E=K.E;for(let i=0;i<60;i++)K.ster.push({x:E.cx+(Math.random()-.5)*E.rx*1.6,y:E.cy+(Math.random()-.5)*E.ry*1.2,vx:(Math.random()-.5)*60,vy:-30-Math.random()*90,l:1+Math.random(),k:Math.random()<.5?'#fff3b0':'#ffd76a'});
 setTimeout(()=>{if(!geluid('lof-'+(1+Math.random()*9|0),1))try{fx.speel('goed')}catch(e){}},1500);
 const eerst=!(S.drank[r.id]|0);if(eerst)S.galjoenen=(S.galjoenen|0)+r.beloning;S.drank[r.id]=(S.drank[r.id]|0)+1;bewaar();try{stats()}catch(e){}
 setTimeout(()=>{const k=$('#ktkaart');if(!k||!K||K.r!==r)return;k.innerHTML=`<div class="kt-gelukt">${window.flesModel?flesModel(r.id,{h:92}):''}<div><b>Gelukt! ✨</b><p>Je ${r.naam} glanst in het flesje. ${r.zin}</p>${(S.drank[r.id]|0)<=1?`<p class="kt-bel">+${r.beloning} Smekkies</p>`:`<p class="klein">Je hebt er nu ${S.drank[r.id]} gebrouwen.</p>`}</div></div><div class="kt-rk"><button class="knop klein" id="ktnog">Nog een drankje</button><button class="knop klein" id="ktwp">Naar de werkplaats</button></div>`;
  $('#ktnog').onclick=()=>{K.r=null;K.klaarT=0;K.glans=0;K.doel=hex(WATER);kaart();tip('Kies hierboven een drankje.')};$('#ktwp').onclick=()=>{K.r=null;K.klaarT=0;K.glans=0;naarOv()}},1800)}
const meng=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*t);

/* ---------- vloeistof ---------- */
function stoot(u,v,amp,rad){const GW=K.GW,GH=K.GH,gx=(u+1)/2*GW,gy=(v+1)/2*GH,R=Math.max(1,rad);for(let y=Math.max(1,gy-R|0);y<Math.min(GH-1,gy+R+1);y++)for(let x=Math.max(1,gx-R|0);x<Math.min(GW-1,gx+R+1);x++){const d=Math.hypot(x-gx,y-gy)/R;if(d<1)K.h[y*GW+x]+=amp*(1-d*d)}}
function plons(u,v,amp,kl){stoot(u,v,amp,K.GW*.06);const E=K.E,x=E.cx+u*E.rx,y=E.cy+v*E.ry;for(let i=0;i<16;i++){const a=-Math.PI*Math.random();K.dr.push({x,y,vx:Math.cos(a)*(40+Math.random()*90),vy:Math.sin(a)*(90+Math.random()*120),l:1,k:kl})}
 for(let i=0;i<10;i++)K.ster.push({x:x+(Math.random()-.5)*40,y:y-10,vx:(Math.random()-.5)*50,vy:-40-Math.random()*50,l:.9,k:'#fff3c0'});for(let i=0;i<5;i++)K.bub.push(nieuweBel(u+(Math.random()-.5)*.2,v+(Math.random()-.5)*.2))}
function simStap(){const {h,hp,GW,GH,mask}=K;for(let y=1;y<GH-1;y++)for(let x=1;x<GW-1;x++){const i=y*GW+x;if(!mask[i]){hp[i]=0;continue}const n=(h[i-1]+h[i+1]+h[i-GW]+h[i+GW])*.5-hp[i];hp[i]=n*.982}K.h=hp;K.hp=h}
function nieuweBel(u,v){if(u==null){const a=Math.random()*6.283,r=Math.sqrt(Math.random())*.85;u=Math.cos(a)*r;v=Math.sin(a)*r}return{u,v,s:0,max:.5+Math.random()*.9,l:0,dur:1.2+Math.random()*2}}
function tekenVloeistof(ctx,t,dt){const {GW,GH,h,mask,id}=K,D=id.data,E=K.E;
 K.cur=meng(K.cur,K.doel,Math.min(1,dt*1.6));const [cr,cg,cb]=K.cur,vd=Math.min(.7,Math.abs(K.vort)/5),sw=Math.min(1,Math.abs(K.vort)/2.2),gl=K.glans,tw=K.twist;
 for(let y=0;y<GH;y++){const v=(y+.5)/GH*2-1;for(let x=0;x<GW;x++){const i=y*GW+x,p=i*4;if(!mask[i]){D[p+3]=0;continue}const u=(x+.5)/GW*2-1,r2=u*u+v*v,r=Math.sqrt(r2);
  const dx=(x>0&&x<GW-1)?h[i+1]-h[i-1]:0,dy=(y>0&&y<GH-1)?h[i+GW]-h[i-GW]:0;
  let li=.82-Math.max(-.35,Math.min(.35,dy*.32+dx*.12))+vd*v*.45-vd*(1-r2)*.25+.05*Math.sin(u*3.1+t*.5)*Math.sin(v*4.3-t*.4);
  const th=Math.atan2(v,u),st=sw>.02?(.5+.5*Math.sin(th*3-tw*(1.6-r)*2.2+r*5))*sw*(1-r2)*.32:0;
  const rand=Math.min(1,Math.max(0,(r2-.62)/.42)),achter=v<0?.45:.25;li*=1-rand*achter;
  const spec=Math.max(0,li-1.0)*1.6+Math.max(0,1-Math.hypot(u+.28,v+.42)*3.2)*.18;
  const vuur=(v>.3?(v-.3)*.25*(.8+.2*Math.sin(t*9+u*4)):0);
  D[p]=Math.min(255,cr*li+st*90+spec*230+vuur*120+gl*30);D[p+1]=Math.min(255,cg*li+st*80+spec*225+vuur*60+gl*24);D[p+2]=Math.min(255,cb*li+st*70+spec*215+gl*4);D[p+3]=255}}
 K.ox.putImageData(id,0,0);ctx.save();ctx.beginPath();ctx.ellipse(E.cx,E.cy,E.rx,E.ry,0,0,6.283);ctx.clip();ctx.imageSmoothingEnabled=true;ctx.drawImage(K.oc,E.cx-E.rx,E.cy-E.ry,E.rx*2,E.ry*2);
 // binnenrand-schaduw
 const g=ctx.createRadialGradient(E.cx,E.cy+E.ry*.2,E.ry*.5,E.cx,E.cy,E.rx*1.02);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.85,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.45)');ctx.save();ctx.translate(E.cx,E.cy);ctx.scale(1,E.ry/E.rx);ctx.translate(-E.cx,-E.cy);ctx.fillStyle=g;ctx.fillRect(E.cx-E.rx,E.cy-E.rx,E.rx*2,E.rx*2);ctx.restore();
 if(gl>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=gl*(.1+.05*Math.sin(t*3));ctx.fillStyle='#ffcf5a';ctx.fillRect(E.cx-E.rx,E.cy-E.ry,E.rx*2,E.ry*2);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1}
 ctx.restore()}
function tekenBellen(ctx,dt){const E=K.E,w=K.vort*dt;if(Math.random()<dt*(K.modus=='cl'?5:2.5)*(1+Math.abs(K.vort)*.3))K.bub.push(nieuweBel());
 const [cr,cg,cb]=K.cur.map(x=>Math.min(255,x*1.5+40));K.bub=K.bub.filter(b=>{b.l+=dt;const r=Math.hypot(b.u,b.v)||.01,a=w*(1.3-r);const ca=Math.cos(a),sa=Math.sin(a);const u=b.u*ca-b.v*sa,v=b.u*sa+b.v*ca;b.u=u+(Math.random()-.5)*.004;b.v=v;
  const f=b.l/b.dur;if(f>=1){stoot(b.u,b.v,.18,2.2);return false}const R=E.ry*.07*b.max*Math.min(1,f*3),x=E.cx+b.u*E.rx,y=E.cy+b.v*E.ry;
  ctx.beginPath();ctx.ellipse(x,y,R,R*.72,0,0,6.283);ctx.fillStyle=`rgba(${cr|0},${cg|0},${cb|0},.55)`;ctx.fill();ctx.lineWidth=1;ctx.strokeStyle='rgba(255,255,255,.35)';ctx.stroke();ctx.beginPath();ctx.arc(x-R*.35,y-R*.3,R*.22,0,6.283);ctx.fillStyle='rgba(255,255,255,.7)';ctx.fill();return true})}
let STOOMSPR=null;function stoomSprite(){if(STOOMSPR)return STOOMSPR;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(235,235,240,.9)');g.addColorStop(1,'rgba(235,235,240,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return STOOMSPR=c}
function tekenStoom(ctx,dt,t){const E=K.E,sp=stoomSprite();if(!rustig&&Math.random()<dt*(K.modus=='cl'?6:3))K.stoom.push({x:E.cx+(Math.random()-.5)*E.rx*1.5,y:E.cy+(Math.random()-.3)*E.ry*.8,r:E.ry*(.25+Math.random()*.3),l:0,dur:3+Math.random()*2,ph:Math.random()*6});
 K.stoom=K.stoom.filter(s=>{s.l+=dt;const f=s.l/s.dur;if(f>=1)return false;s.y-=dt*E.ry*.35;s.x+=Math.sin(t*.8+s.ph)*dt*8;const a=Math.sin(f*Math.PI)*(.09+K.glans*.08);const R=s.r*(1+f*1.6);ctx.globalAlpha=a;ctx.drawImage(sp,s.x-R,s.y-R,R*2,R*2);return true});ctx.globalAlpha=1}
function tekenVuur(ctx,t){const L=K.L,fx=L.ix+L.iw*(K.modus=='cl'?.5:.4),fy=L.iy+L.ih*(K.modus=='cl'?.9:.76),R=L.iw*(K.modus=='cl'?.45:.3);const fl=.22+.07*Math.sin(t*7.3)+.05*Math.sin(t*13.1+1)+.04*Math.sin(t*2.1);
 ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(fx,fy,0,fx,fy,R);g.addColorStop(0,`rgba(255,140,40,${fl})`);g.addColorStop(.5,`rgba(255,90,20,${fl*.4})`);g.addColorStop(1,'rgba(255,60,0,0)');ctx.fillStyle=g;ctx.fillRect(fx-R,fy-R,R*2,R*2);ctx.restore()}

/* ---------- lepel ---------- */
function lepelStap(dt){const p=K.lepel,E=K.E;if(!p)return;let tx=p.x,ty=p.y;if(K.vinger){tx=K.vinger.x;ty=K.vinger.y+E.ry*.08}
 let u=(tx-E.cx)/E.rx,v=(ty-E.cy)/E.ry;const m=Math.hypot(u,v),M=.8;if(m>M){u*=M/m;v*=M/m}tx=E.cx+u*E.rx;ty=E.cy+v*E.ry;
 const k=1-Math.exp(-dt*12),ox=p.x,oy=p.y;p.x+=(tx-p.x)*k;p.y+=(ty-p.y)*k;const vx=(p.x-ox)/Math.max(dt,.001),vy=(p.y-oy)/Math.max(dt,.001),sp=Math.hypot(vx,vy);
 const pu=(p.x-E.cx)/E.rx,pv=(p.y-E.cy)/E.ry,pr=Math.hypot(pu,pv);
 if(sp>8){stoot(pu,pv,Math.min(.28,sp/1800),K.GW*.04);const bu=pu-vx/E.rx*.05,bv=pv-vy/E.ry*.05;stoot(bu,bv,-Math.min(.2,sp/2400),K.GW*.035)}
 const th=Math.atan2(pv,pu);if(p.th!=null&&pr>.15){let d=th-p.th;if(d>Math.PI)d-=6.283;if(d<-Math.PI)d+=6.283;K.acc+=d;const av=d/Math.max(dt,.001);K.vort+=(av*.55-K.vort)*Math.min(1,dt*1.6*(K.vinger?1:0));
  if(Math.abs(av)>2.5&&performance.now()-(K.roerT||0)>950){K.roerT=performance.now();geluid('verr-drup'+(1+Math.random()*3|0),.18)}}
 p.th=th;K.vort*=Math.exp(-dt*(K.vinger?.25:.55));K.twist+=K.vort*dt;K.twist*=Math.exp(-dt*.08);
 // handvat: helt naar boven-rechts, met wat traagheid
 const ex=E.cx+(p.x-E.cx)*.35+E.rx*1.05,ey=E.cy-E.ry*2.1+(p.y-E.cy)*.4;if(!p.eind)p.eind={x:ex,y:ey};const k2=1-Math.exp(-dt*6);p.eind.x+=(ex-p.eind.x)*k2;p.eind.y+=(ey-p.eind.y)*k2;
 // roer-stap tellen
 const s=K.r&&!K.klaarT&&K.r.stap[K.stap];if(s&&s[0]=='roer'){const n=Math.floor(K.acc*s[2]/6.283);if(K.acc*s[2]<-6.283*.75&&!K.wTip){K.wTip=1;tip('Andersom! Roer '+(s[2]>0?'met de klok mee ↻':'tegen de klok in ↺')+'.');K.acc=0}
  if(n!==K.lastN){K.lastN=n;kaart();if(n>0&&n<s[1])try{fx.speel('klik')}catch(e){}}if(n>=s[1]){K.wTip=0;K.lastN=-1;volgende()}}}
function hout(ctx,ax,ay,bx,by,w0,w1,nat){const dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
 ctx.beginPath();ctx.moveTo(ax+nx*w0/2,ay+ny*w0/2);ctx.lineTo(bx+nx*w1/2,by+ny*w1/2);ctx.arc(bx,by,w1/2,Math.atan2(ny,nx),Math.atan2(-ny,-nx));ctx.lineTo(ax-nx*w0/2,ay-ny*w0/2);ctx.closePath();
 const g=ctx.createLinearGradient(ax+nx*w0/2,ay+ny*w0/2,ax-nx*w0/2,ay-ny*w0/2);g.addColorStop(0,'#5a3a1e');g.addColorStop(.35,'#b07c46');g.addColorStop(.55,'#c99358');g.addColorStop(1,'#4a2e16');ctx.fillStyle=g;ctx.fill();
 ctx.save();ctx.clip();ctx.strokeStyle='rgba(60,35,15,.45)';ctx.lineWidth=.8;for(let j=-2;j<=2;j++){ctx.beginPath();for(let s=0;s<=1.0001;s+=.05){const w=(w0+(w1-w0)*s)*.18*j+Math.sin(s*23+j*2)*.8,x=ax+dx*s+nx*w,y=ay+dy*s+ny*w;s?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}
 if(nat){const gw=ctx.createLinearGradient(ax,ay,ax+dx*.35,ay+dy*.35);gw.addColorStop(0,'rgba(20,10,5,.55)');gw.addColorStop(1,'rgba(20,10,5,0)');ctx.fillStyle=gw;ctx.fillRect(Math.min(ax,bx)-30,Math.min(ay,by)-30,Math.abs(dx)+60,Math.abs(dy)+60)}ctx.restore()}
function tekenLepel(ctx){const p=K.lepel,E=K.E;if(!p||!p.eind)return;const ex=p.eind.x,ey=p.eind.y,dx=ex-p.x,dy=ey-p.y,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,sc=E.rx/170;
 const sub=Math.min(L*.4,E.ry*.42),sx=p.x+ux*sub,sy=p.y+uy*sub,an=Math.atan2(uy,ux);
 // onder water: verschoven, donker en doorschijnend
 ctx.save();ctx.beginPath();ctx.ellipse(E.cx,E.cy,E.rx,E.ry,0,0,6.283);ctx.clip();ctx.translate(0,3*sc);ctx.globalAlpha=.5;
 hout(ctx,sx,sy,p.x,p.y,11*sc,13*sc,0);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(an);ctx.beginPath();ctx.ellipse(-14*sc,0,22*sc,15*sc,0,0,6.283);ctx.fillStyle='#8a5e33';ctx.fill();ctx.restore();
 ctx.globalAlpha=.45;ctx.fillStyle=`rgb(${K.cur.map(x=>x|0).join(',')})`;ctx.beginPath();ctx.ellipse(p.x-ux*14*sc,p.y-uy*14*sc,30*sc,22*sc,an,0,6.283);ctx.fill();ctx.restore();
 // vloeistof-randje om de steel
 ctx.save();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(sx,sy+1,10*sc,3.5*sc,0,0,6.283);ctx.stroke();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(sx,sy+3,13*sc,4.5*sc,0,0,Math.PI);ctx.stroke();ctx.restore();
 // boven water
 ctx.save();ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=10*sc;ctx.shadowOffsetX=6*sc;ctx.shadowOffsetY=6*sc;hout(ctx,sx,sy,ex,ey,11*sc,16*sc,1);ctx.restore()}

function tekenTafel(ctx,t){const W=K.W,H=K.H,y=H-TAFEL;if(TAFELIMG.complete&&TAFELIMG.naturalWidth){const sw=Math.min(TAFELIMG.naturalWidth,TAFELIMG.naturalHeight*W/TAFEL);ctx.drawImage(TAFELIMG,(TAFELIMG.naturalWidth-sw)/2,0,sw,TAFELIMG.naturalHeight,0,y,W,TAFEL)}else{ctx.fillStyle='#3a2616';ctx.fillRect(0,y,W,TAFEL)}
 let g=ctx.createLinearGradient(0,y-18,0,y+26);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.42,'rgba(0,0,0,.55)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,y-18,W,44);
 const fl=.1+.03*Math.sin(t*7.3)+.02*Math.sin(t*12.7);g=ctx.createRadialGradient(W/2,y-30,0,W/2,y-30,W*.7);g.addColorStop(0,`rgba(255,140,50,${fl})`);g.addColorStop(1,'rgba(255,120,40,0)');ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=g;ctx.fillRect(0,y,W,TAFEL);ctx.restore()}
/* ---------- deeltjes ---------- */
function tekenDeeltjes(ctx,dt){K.dr=K.dr.filter(d=>{d.l-=dt*1.3;d.vy+=300*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;if(d.l<=0)return false;ctx.globalAlpha=Math.min(1,d.l*1.5);ctx.fillStyle=d.k;ctx.beginPath();ctx.arc(d.x,d.y,2.6,0,6.283);ctx.fill();return true});
 K.ster=K.ster.filter(s=>{s.l-=dt*.8;s.x+=s.vx*dt;s.y+=s.vy*dt;s.vy+=20*dt;if(s.l<=0)return false;ctx.globalAlpha=Math.min(1,s.l);ctx.fillStyle=s.k;const r=2+2*Math.sin(s.l*9);ctx.beginPath();ctx.moveTo(s.x,s.y-r*2);ctx.lineTo(s.x+r*.5,s.y);ctx.lineTo(s.x,s.y+r*2);ctx.lineTo(s.x-r*.5,s.y);ctx.closePath();ctx.fill();ctx.fillRect(s.x-r*1.6,s.y-.6,r*3.2,1.2);return true});ctx.globalAlpha=1}

/* ---------- lus ---------- */
function frame(nu){if(!K)return;if(document.body.dataset.view&&document.body.dataset.view!=='ketel'&&!$('#kt')){stop();return}if(!$('#ktc')){stop();return}K.raf=requestAnimationFrame(frame);if(!K.klaar)return;
 const dt=Math.min(.05,(nu-(K.tl||nu))/1000)||.016;K.tl=nu;const t=nu/1000,cv=$('#ktc'),ctx=cv.getContext('2d');ctx.setTransform(K.d,0,0,K.d,0,0);
 const L=K.L;ctx.fillStyle='#07060a';ctx.fillRect(0,0,K.W,K.H);ctx.drawImage(K.imgs[K.modus],L.ix,L.iy,L.iw,L.ih);
 if(L.iy>0){const g=ctx.createLinearGradient(0,L.iy,0,L.iy+50);g.addColorStop(0,'#07060a');g.addColorStop(1,'rgba(7,6,10,0)');ctx.fillStyle=g;ctx.fillRect(0,L.iy-1,K.W,51)}
 if(L.ix>0){ctx.fillStyle='#07060a';ctx.fillRect(0,0,L.ix,K.H);ctx.fillRect(L.ix+L.iw,0,K.W,K.H)}
 tekenVuur(ctx,t);lepelStap(dt);simStap();if(K.modus=='cl')simStap();
 if(K.klaarT)K.glans=Math.min(1,(nu-K.klaarT)/1200);
 tekenVloeistof(ctx,t,dt);tekenBellen(ctx,dt);if(K.modus=='cl'){tekenLepel(ctx);tekenTafel(ctx,t)}tekenStoom(ctx,dt,t);tekenDeeltjes(ctx,dt)}

/* ---------- ingang in Meer ---------- */
const _meer=V.meer;V.meer=(...a)=>{const r=_meer(...a);try{const h=document.querySelector('#app h1,#app h2');if(h&&!document.getElementById('meerkt'))h.insertAdjacentHTML('afterend',`<button class="knop volgende meerkt" id="meerkt" onclick="ga('ketel')">🧪 Toverdranken brouwen in je eigen ketel</button>`)}catch(e){}return r};
window.ketelTest={RECEPT,get K(){return K}};
})();
