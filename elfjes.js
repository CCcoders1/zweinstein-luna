'use strict';
/* ====== Elfjes: één per 100 levels, blijvend actief. Geen ampullen. ====== */
def('elfjes',{});def('elfT',Date.now());
const ELFJES_ALLE=[
 {id:'pip',n:'Pip',k:'#ffb0e0',kar:'giechelig en altijd te vroeg op',plant:'mandragora'},
 {id:'fenna',n:'Fenna',k:'#a8f0ff',kar:'dromerig, praat tegen bladeren',plant:'valeriaan'},
 {id:'bram',n:'Bram',k:'#c8ff8a',kar:'stoer, maar bang voor slakken',plant:'varkensgras'},
 {id:'lotje',n:'Lotje',k:'#ffe28a',kar:'nieuwsgierig, verzamelt glimmers',plant:'wolfsmelk'},
 {id:'mier',n:'Miertje',k:'#d6b0ff',kar:'precies en een tikje bazig',plant:'mandragora'},
 {id:'roosje',n:'Roosje',k:'#ffb48a',kar:'zingt zachtjes tijdens het werk',plant:'valeriaan'}];
const ELF_GRENS=3; /* vanaf 3 potten per werkend elfje, of 1 megaplant per elfje, wordt het te veel */
(()=>{let m=0;Object.keys(S.elfjes||{}).forEach(id=>{if(!ELFJES_ALLE.some(e=>e.id==id)){delete S.elfjes[id];m=1}});if(m)bewaar()})();
function elfAantal(){return Math.min(ELFJES_ALLE.length,Math.max(0,Math.floor((S.m3lvl||1)/100)))}
function elfRoster(){return ELFJES_ALLE.slice(0,elfAantal())}
function volgendElf(){const n=elfAantal();return n<ELFJES_ALLE.length?{e:ELFJES_ALLE[n],lvl:(n+1)*100}:null}
const elfjesOpen=()=>elfAantal()>0;
const elfAan=e=>elfRoster().some(x=>x.id===e.id);
const actieveElfjes=()=>elfRoster();
function syncElfjes(melden){
  const n=elfAantal();
  const bekend=S.elfAantal;
  S.elfjes=S.elfjes||{};
  elfRoster().forEach(e=>{if(!S.elfjes[e.id])S.elfjes[e.id]=1});
  if(bekend==null){S.elfAantal=n;bewaar();return n}
  if(n>bekend){
    const nieuw=ELFJES_ALLE.slice(bekend,n);
    S.elfAantal=n;bewaar();
    if(melden&&nieuw.length){
      const namen=nieuw.map(e=>e.n).join(' en ');
      try{toast(nieuw.length===1?namen+' komt in je kas helpen, en blijft.':'Nieuwe elfjes: '+namen+'. Ze blijven je helpen.')}catch(e){}
      try{fx.speel('goed')}catch(e){}
    }
  }
  return n;
}
window.ampulGeef=function(){};
window.ampulLaad=function(){};
const pottenMetPlant=()=>Object.keys(S.kweek||{}).filter(i=>S.kweek[i]&&S.kweek[i].z).length;
const megaAantal=()=>(S.mega||[]).filter(Boolean).length;
function elfLast(){const a=Math.max(1,actieveElfjes().length||1);return {potten:pottenMetPlant(),mega:megaAantal(),n:actieveElfjes().length||1,teVeel:pottenMetPlant()>=a*ELF_GRENS||megaAantal()>=a}}
function elfBalans(){const a=actieveElfjes().length,L=elfLast(),volg=volgendElf(),een=a<=1,wie=a===1?actieveElfjes()[0].n:'De elfjes';
 const werk=[L.potten?`${L.potten} pot${L.potten===1?'':'ten'}`:'',L.mega?`${L.mega} megaplant${L.mega>1?'en':''}`:''].filter(Boolean).join(' en ');
 const extra=volg?` ${volg.e.n} komt erbij op level ${volg.lvl}.`:'';
 if(!a)return{z:'geen',f:1,t:`Je begint zonder elfje. Elke 100 levels komt er één bij, en die blijft.${extra}`};
 if(L.teVeel)return{z:'weinig',f:.7,t:`${wie} heeft te veel werk: ${werk}. Alles groeit langzamer.${extra||' Maak een pot leeg, dan wordt het weer lichter.'}`};
 if(!L.potten&&!L.mega)return{z:'veel',f:1,t:een?`${wie} verveelt zich: er staat niets in de potten. Plant een zaadje.`:'De elfjes vervelen zich: er staat niets in de potten.'};
 return{z:'goed',f:1.6,goud:.12,t:`${wie} is tevreden en helpt je ${werk}. Vanaf ${a*ELF_GRENS} potten of ${a} megaplant${a>1?'en':''} wordt het te veel.`}}
function megaRestElf(p){const d=window.SUPERPLANTEN&&SUPERPLANTEN[p.z];if(!d)return 0;return Math.max(0,d.uren*36e5-(Date.now()-p.t+(p.bonus||0)))}
function elfTick(){const nu=Date.now(),dt=Math.min(864e5,nu-(S.elfT||nu));S.elfT=nu;if(!elfjesOpen()||dt<=0||!actieveElfjes().length)return;const b=elfBalans();if(b.f===1)return;const stap=dt*(b.f-1);
 Object.values(S.kweek||{}).forEach(p=>{if(!p||stadium(p)>=4)return;p.bonus=(p.bonus||0)+(stap>0?Math.min(rest(p),stap):stap);if(b.goud&&!p.elfRol){p.elfRol=1;if(Math.random()<b.goud)p.goud=true}});
 (S.mega||[]).forEach(p=>{if(!p||megaRestElf(p)<=0)return;p.bonus=(p.bonus||0)+(stap>0?Math.min(megaRestElf(p),stap):stap)});bewaar()}
setInterval(()=>{try{elfTick()}catch(e){}},5000);setTimeout(()=>{try{syncElfjes(false);elfTick()}catch(e){}},500);
try{const _mw=typeof m3Winst==='function'?m3Winst:null;if(_mw)m3Winst=function(){const r=_mw.apply(this,arguments);try{syncElfjes(true)}catch(e){}return r}}catch(e){}
/* ---------- elfjes-animatie (canvas) ---------- */
const GLOED={};function elfGloed(k){if(GLOED[k])return GLOED[k];const c=document.createElement('canvas');c.width=c.height=48;const x=c.getContext('2d');const g=x.createRadialGradient(24,24,0,24,24,24);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,k);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,48,48);return GLOED[k]=c}
let elfRaf=0;
/* Tijd om: donker model in het kasmenu, bij de ampulknop. Ampul in gebruik: levend in de eigen kas. */
function elfStart(plek){if(window._elfStop)window._elfStop();
 const view=plek==='mijnkas'?'mijnkas':'';if(view!=='mijnkas')return;const lijst=elfRoster().filter(elfAan).map(e=>({e,aan:true}));if(!lijst.length)return
 const camera=view==='mijnkas'?document.querySelector('.mk-kamer'):null,scroller=camera&&camera.closest('.mk-scroll'),host=camera||(view==='kas'?document.querySelector('#app'):null);
 const cv=document.createElement('canvas');cv.id='elfcv';if(host){cv.classList.add(camera?'in-kas':'in-menu');host.classList.add('elf-host');host.appendChild(cv)}else document.body.appendChild(cv);const ctx=cv.getContext('2d',{alpha:true,desynchronized:true});const dpr=Math.min(host?1:1.25,devicePixelRatio||1);let W,H;const maat=()=>{W=host?host.clientWidth:innerWidth;H=host?Math.max(host.scrollHeight,innerHeight):innerHeight;cv.width=W*dpr;cv.height=H*dpr;if(host){cv.style.width=W+'px';cv.style.height=H+'px'}ctx.setTransform(dpr,0,0,dpr,0,0)};maat();addEventListener('resize',maat);
 const band=()=>{const nav=document.querySelector('#nav');const top=nav?nav.getBoundingClientRect().top:H-88;const onder=Math.max(130,top-52);const boven=Math.max(88,onder-Math.min(150,H*.18));return [boven,onder]};
 const [b0,o0]=band();
 const viewLeft=scroller?scroller.scrollLeft:0,viewWidth=scroller?scroller.clientWidth:Math.min(W,innerWidth),hostRect=()=>host&&host.getBoundingClientRect(),viewTop=()=>host?Math.max(0,-hostRect().top):0,startX=viewLeft+viewWidth*.5,startY=viewTop()+Math.min(innerHeight,H-viewTop())*.5;
 const elf=lijst.map((o,i)=>({...o,x:o.rust?viewLeft+W*(.18+.64*i/Math.max(1,lijst.length-1||1)):viewLeft+Math.random()*viewWidth,y:o.rust?b0+Math.random()*Math.max(24,o0-b0):viewTop()+Math.random()*Math.min(innerHeight,H-viewTop()),vx:0,vy:0,tx:0,ty:0,fase:Math.random()*9,spoor:[],wacht:0,mode:'vlieg',t0:performance.now()+(o.teaser?3000:0),zit:null}));
 const potDoelen=()=>[...document.querySelectorAll('.kpot,.mk-vloer,.megapot')].map(p=>{const r=p.getBoundingClientRect(),basis=hostRect();return[r.left+r.width/2+(Math.random()-.5)*r.width*.3-(basis?basis.left:0),r.top+r.height*.35-(basis?basis.top:0)]}).filter(([x,y])=>x>20&&x<W-20&&y>60&&y<H-90);
 const nieuwDoel=f=>{const pd=potDoelen();if(f.teaser){f.tx=Math.random()<.5?-40:W+40;f.ty=H*(.25+Math.random()*.4);return}
  if(f.donker){const paneel=document.querySelector('.elfpaneel'),r=paneel&&paneel.getBoundingClientRect(),basis=hostRect(),links=r?r.left-(basis?basis.left:0):0,boven=r?r.top-(basis?basis.top:0):0,zicht=r&&r.bottom>0&&r.top<innerHeight;f.mode='vlieg';
   if(zicht&&Math.random()<.75){f.tx=Math.max(28,Math.min(W-28,links+24+Math.random()*Math.max(36,r.width-48)));f.ty=Math.max(88,Math.min(H-96,boven+36+Math.random()*Math.min(150,Math.max(48,r.height*.45))))}else{f.tx=36+Math.random()*(W-72);f.ty=96+Math.random()*Math.max(40,H-210)}return}
  if(f.rust){const [boven,onder]=band();f.mode=Math.random()<.18?'zwaai':'vlieg';f.tx=28+Math.random()*Math.max(40,W-56);f.ty=boven+Math.random()*Math.max(20,onder-boven);return}
  if(!f.aan){const p=pd[f.e.id.length%Math.max(1,pd.length)];[f.tx,f.ty]=p||[W*.2+Math.random()*W*.6,H*.6];f.mode='naarzit';return}
  const r=Math.random();if(r<.12){f.mode='zwaai';f.tx=W*(.35+Math.random()*.3);f.ty=H*.42;return}if(r<.5&&pd.length){[f.tx,f.ty]=pd[Math.random()*pd.length|0];f.mode='land';return}f.mode='vlieg';f.tx=W*(.1+Math.random()*.8);f.ty=H*(.18+Math.random()*.5)};
 elf.forEach(nieuwDoel);const vonk=[];let laatst=performance.now(),scrollTimer=0;
 const zichtbaar=()=>{const r=hostRect();const x=scroller?scroller.scrollLeft:0,y=camera?0:host?Math.max(0,-r.top):0;return{x,y,w:scroller?scroller.clientWidth:Math.min(W,innerWidth),h:Math.min(innerHeight,H-y)}};
 if(view==='mijnkas'&&sessionStorage.pipDans){const f=elf.find(x=>x.aan&&x.e.id===sessionStorage.pipDans)||elf.find(x=>x.aan);if(f){sessionStorage.removeItem('pipDans');f.x=startX;f.y=startY;f.t0=0;f.dans=performance.now()+2400;f.mode='zwaai';f.tx=startX;f.ty=startY;f.wacht=2400;setTimeout(()=>pipBubbel(f,'Joepie! Ik ga voor je planten zorgen!'),400)}}
 const tik=ev=>{const p=ev.touches?ev.touches[0]:ev,basis=hostRect(),px=p.clientX-(basis?basis.left:0),py=p.clientY-(basis?basis.top:0);for(const f of elf){if(performance.now()<f.t0)continue;if(Math.hypot(px-f.x,py-(f.y-8))<34){if(f.teaser){pipBubbel(f,'…?');f.tx=f.x<W/2?-40:W+40;return}if(f.donker){pipBubbel(f,PIPDONKER[Math.random()*PIPDONKER.length|0]);ev.stopPropagation();return}pipGiechel();vib(15);if(f.aan){f.pir=performance.now()+900;for(let i=0;i<10;i++)vonk.push({x:f.x+(Math.random()-.5)*30,y:f.y+(Math.random()-.5)*30,vy:-.3+Math.random()*.8,l:1,k:f.e.k})}pipBubbel(f,(f.aan?PIPZIN:PIPSLAAP)[Math.random()*(f.aan?PIPZIN:PIPSLAAP).length|0]);ev.stopPropagation();return}}};
 document.addEventListener('pointerdown',tik,true);window._pipTik=elf;
 const scrollTarget=scroller||(view==='kas'?window:null);
 let scrollDraw=0;
 const scrollPauze=()=>{cancelAnimationFrame(elfRaf);elfRaf=0;clearTimeout(scrollTimer);if(!scrollDraw)scrollDraw=requestAnimationFrame(()=>{scrollDraw=0;const r=zichtbaar(),klem=(n,a,b)=>Math.max(a,Math.min(b,n));for(const f of elf){const links=f.x<r.x+32,rechts=f.x>r.x+r.w-32,boven=f.y<r.y+48,onder=f.y>r.y+r.h-48;if(!links&&!rechts&&!boven&&!onder)continue;if(links)f.x=r.x+36;if(rechts)f.x=r.x+r.w-36;if(boven)f.y=r.y+52;if(onder)f.y=r.y+r.h-52;f.x=klem(f.x,0,W);f.y=klem(f.y,0,H);f.tx=r.x+36+Math.random()*Math.max(1,r.w-72);f.ty=r.y+48+Math.random()*Math.max(1,r.h-96);f.vx=0;f.vy=0;f.wacht=0;f.mode='vlieg'}ctx.clearRect(r.x,r.y,r.w,r.h);ctx.save();ctx.beginPath();ctx.rect(r.x,r.y,r.w,r.h);ctx.clip();const nu=performance.now();elf.forEach(f=>{if(f.x>=r.x-48&&f.x<=r.x+r.w+48&&f.y>=r.y-48&&f.y<=r.y+r.h+48)elfTeken(ctx,f,nu,1)});ctx.restore()});scrollTimer=setTimeout(()=>{laatst=performance.now();elfRaf=requestAnimationFrame(frame)},180)};
 if(scrollTarget)scrollTarget.addEventListener('scroll',scrollPauze,{passive:true});
 const ruim=()=>{cancelAnimationFrame(elfRaf);cancelAnimationFrame(scrollDraw);clearTimeout(scrollTimer);cv.remove();if(host&&!host.querySelector('#elfcv'))host.classList.remove('elf-host');removeEventListener('resize',maat);if(scrollTarget)scrollTarget.removeEventListener('scroll',scrollPauze);document.removeEventListener('pointerdown',tik,true);document.querySelectorAll('.pipbubbel').forEach(e=>e.remove());if(window._pipTik===elf)window._pipTik=null;if(window._elfStop===stop)window._elfStop=null};
 const stop=()=>ruim();window._elfStop=stop;
 const frame=nu=>{if(document.body.dataset.view!==view||!document.body.contains(cv)){ruim();return}const dt=Math.min(40,nu-laatst)/16.7;laatst=nu;const zicht=zichtbaar();ctx.clearRect(zicht.x,zicht.y,zicht.w,zicht.h);ctx.save();ctx.beginPath();ctx.rect(zicht.x,zicht.y,zicht.w,zicht.h);ctx.clip();
  for(const f of elf){if(nu<f.t0)continue;
   if(f.teaser&&f.mode!=='weg'&&(f.x<-30||f.x>W+30)&&nu-f.t0>3000){f.t0=nu+18000+Math.random()*12000;f.x=f.tx<0?W+30:-30;f.y=H*(.3+Math.random()*.3);nieuwDoel(f);continue}
   const dx=f.tx-f.x,dy=f.ty-f.y,d=Math.hypot(dx,dy);
   if(f.wacht>0){f.wacht-=dt*16.7;if(f.mode=='land'&&Math.random()<.15)vonk.push({x:f.x+(Math.random()-.5)*14,y:f.y+4,vy:.4+Math.random()*.6,l:1,k:f.e.k});if(f.wacht<=0)nieuwDoel(f)}
   else if(d<8){if(f.mode=='land'){f.wacht=1500+Math.random()*2000}else if(f.mode=='zwaai'){f.wacht=1600}else if(f.mode=='naarzit'){f.mode='zit';f.wacht=1e12}else nieuwDoel(f)}
   else{const sp=f.teaser?2.4:f.donker?1.5:f.aan?1.7:f.rust?1.25:.6;const ax=dx/d*sp-f.vx,ay=dy/d*sp-f.vy;f.vx+=ax*.04*dt;f.vy+=ay*.04*dt;f.vx+=Math.sin(nu/400+f.fase)*.03;f.vy+=Math.cos(nu/330+f.fase)*.03}
   if(f.wacht>0&&f.mode!=='zit'){f.vx*=.85;f.vy*=.85}if(f.mode=='zit'){f.vx=0;f.vy=0}
   f.x+=f.vx*dt;f.y+=f.vy*dt+(f.wacht>0&&f.mode!=='zit'?Math.sin(nu/300+f.fase)*.25:0);
   if(f.rust){const [boven,onder]=band();if(f.y<boven){f.y=boven;f.vy=Math.abs(f.vy)*.4}if(f.y>onder){f.y=onder;f.vy=-Math.abs(f.vy)*.4}if(f.x<18){f.x=18;f.vx=Math.abs(f.vx)}if(f.x>W-18){f.x=W-18;f.vx=-Math.abs(f.vx)}}
   if(f.donker){if(f.x<24){f.x=24;f.vx=Math.abs(f.vx)}if(f.x>W-24){f.x=W-24;f.vx=-Math.abs(f.vx)}if(f.y<84){f.y=84;f.vy=Math.abs(f.vy)}if(f.y>H-96){f.y=H-96;f.vy=-Math.abs(f.vy)}}
   if(f.aan&&!RMP){f.spoor.push([f.x,f.y+6]);if(f.spoor.length>22)f.spoor.shift();if(Math.random()<.35*dt||f.extraVonk){f.extraVonk=0;vonk.push({x:f.x+(Math.random()-.5)*10,y:f.y+8,vy:.25+Math.random()*.4,l:1,k:Math.random()<.5?'#ffe58a':f.e.k})}}else if(f.rust&&!RMP){f.spoor.push([f.x,f.y+6]);if(f.spoor.length>8)f.spoor.shift()}else f.spoor.length=0;
  if(f.x<zicht.x-60||f.x>zicht.x+zicht.w+60||f.y<zicht.y-60||f.y>zicht.y+zicht.h+60)continue;
  ctx.globalCompositeOperation='lighter';f.spoor.forEach(([x,y],i)=>{const a=i/f.spoor.length;ctx.globalAlpha=a*.5;const z=4+a*10;ctx.drawImage(elfGloed(f.teaser?'#bff7ff':f.e.k),x-z/2,y-z/2,z,z)});ctx.globalAlpha=1;
   const sc=f.mode=='zwaai'&&f.wacht>0?1.7:1;elfTeken(ctx,f,nu,sc)}
  ctx.globalCompositeOperation='lighter';for(let i=vonk.length-1;i>=0;i--){const v=vonk[i];v.y+=v.vy*dt;v.l-=.012*dt;v.x+=Math.sin(nu/200+v.y)*.15;if(v.l<=0){vonk.splice(i,1);continue}if(v.x<zicht.x-10||v.x>zicht.x+zicht.w+10||v.y<zicht.y-10||v.y>zicht.y+zicht.h+10)continue;ctx.globalAlpha=v.l;const vz=3+v.l*6;ctx.drawImage(elfGloed(v.k),v.x-vz/2,v.y-vz/2,vz,vz);if(v.l>.6){ctx.fillStyle='#fff';ctx.fillRect(v.x-.4,v.y-vz*.6,.8,vz*1.2);ctx.fillRect(v.x-vz*.6,v.y-.4,vz*1.2,.8)}}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.restore();
  elfRaf=requestAnimationFrame(frame)};elfRaf=requestAnimationFrame(frame)}
/* ---------- Pip: vooraf gerenderde lichaam-sprite + live vleugels ---------- */
const PIPSPR={};const PSD=2;
function pipSprite(k,st){const key=k+st;if(PIPSPR[key])return PIPSPR[key];const c=document.createElement('canvas');c.width=c.height=80*PSD;const x=c.getContext('2d');x.scale(PSD,PSD);x.translate(40,40);
 const sl=st=='slaap',ts=st=='teaser';const huid=ts?'#2a2340':'#ffe3d2',haar=ts?'#1d1830':'#8a4a22';
 const rg=(x0,y0,r,stops)=>{const g=x.createRadialGradient(x0,y0,0,x0,y0,r);stops.forEach(([o,c])=>g.addColorStop(o,c));return g};
 const kleur=ts?'#2c2448':k;
 /* beentjes */
 x.strokeStyle=huid;x.lineWidth=2.2;x.lineCap='round';x.beginPath();x.moveTo(-2.5,9);x.quadraticCurveTo(-4,15,-6,19);x.moveTo(2.5,9);x.quadraticCurveTo(3,15,1,20);x.stroke();
 x.fillStyle=ts?'#1d1830':'#5a8a3a';[[-6.5,19.5],[1,20.5]].forEach(([a,b2])=>{x.beginPath();x.ellipse(a,b2,2.4,1.3,-.3,0,7);x.fill()});
 /* jurk van bloemblaadjes (3 lagen) */
 const blaadje=(ang,len,w,c1,c2)=>{x.save();x.translate(0,-3);x.rotate(ang);const g=x.createLinearGradient(0,0,0,len);g.addColorStop(0,c1);g.addColorStop(1,c2);x.fillStyle=g;x.beginPath();x.moveTo(0,0);x.bezierCurveTo(w,len*.35,w*.8,len*.85,0,len);x.bezierCurveTo(-w*.8,len*.85,-w,len*.35,0,0);x.fill();x.strokeStyle=ts?'rgba(0,0,0,0)':'rgba(255,255,255,.5)';x.lineWidth=.5;x.beginPath();x.moveTo(0,1);x.lineTo(0,len*.8);x.stroke();x.restore()};
 const licht=ts?'#3a3060':'#fff4fb',donker=ts?'#1d1830':'#c0407e';
 [-.85,-.45,0,.45,.85].forEach(a=>blaadje(a,15,5.5,kleur,donker));[-.6,-.2,.2,.6].forEach(a=>blaadje(a,13,4.6,licht,kleur));
 /* lijfje */
 x.fillStyle=rg(-1,-6,6,[[0,licht],[1,kleur]]);x.beginPath();x.ellipse(0,-5,3.6,5,0,0,7);x.fill();
 if(!ts){x.fillStyle='#ffd84a';x.beginPath();x.arc(0,-1.5,1.1,0,7);x.fill()}
 /* armpjes */
 x.strokeStyle=huid;x.lineWidth=1.8;x.beginPath();x.moveTo(-3,-7);x.quadraticCurveTo(-7,-3,-8,1);x.stroke();
 if(!sl){x.beginPath();x.moveTo(3,-7);x.quadraticCurveTo(7,-4,8,0);x.stroke()}
 /* hoofd */
 x.fillStyle=rg(-2,-16,7,[[0,ts?'#3a3060':'#fff4ec'],[1,huid]]);x.beginPath();x.arc(0,-14,6,0,7);x.fill();
 /* haar met knotje */
 x.fillStyle=rg(-2,-21,9,[[0,ts?'#2a2340':'#c77a3e'],[1,haar]]);x.beginPath();x.arc(0,-15.2,6.4,Math.PI*1.02,Math.PI*1.98);x.quadraticCurveTo(6.5,-10,5.2,-8.5);x.quadraticCurveTo(4.2,-13,1,-15.5);x.quadraticCurveTo(-3,-12.5,-5.5,-9);x.quadraticCurveTo(-6.6,-12,-6.3,-15);x.fill();
 x.beginPath();x.arc(0,-22,3.4,0,7);x.fill();
 /* bloemhoedje op het knotje */
 if(!ts){for(let i=0;i<5;i++){const a=i/5*Math.PI*2;x.fillStyle=i%2?'#fff':licht;x.beginPath();x.ellipse(3.6+Math.cos(a)*1.9,-22.5+Math.sin(a)*1.9,1.5,1,a,0,7);x.fill()}x.fillStyle='#ffd84a';x.beginPath();x.arc(3.6,-22.5,1,0,7);x.fill();
  x.fillStyle='#6fbf4a';x.beginPath();x.ellipse(-3,-24.2,2.6,1.1,-.5,0,7);x.fill()}
 /* gezichtje */
 if(!ts){x.fillStyle='rgba(255,130,150,.45)';[-3.4,3.4].forEach(a=>{x.beginPath();x.ellipse(a,-12.3,1.3,.8,0,0,7);x.fill()});
  if(sl){x.strokeStyle='#4a2a18';x.lineWidth=.7;[-2.2,2.2].forEach(a=>{x.beginPath();x.arc(a,-14,1.1,.2,Math.PI-.2);x.stroke()})}
  else{x.fillStyle='#3a2014';[-2.2,2.2].forEach(a=>{x.beginPath();x.ellipse(a,-14,1,1.3,0,0,7);x.fill()});x.fillStyle='#fff';[-1.9,2.5].forEach(a=>{x.beginPath();x.arc(a,-14.5,.4,0,7);x.fill()})}
  x.strokeStyle='#b0485a';x.lineWidth=.7;x.beginPath();x.arc(0,-11.6,1.3,.25,Math.PI-.25);x.stroke()}
 return PIPSPR[key]=c}
function pipVleugels(c,nu,f,sl,ts){const fl=sl?Math.sin(nu/900)*.12:Math.sin(nu/(f.rust?80:34)+f.fase);const hue=(nu/20)%360;
 [-1,1].forEach(k=>{c.save();c.translate(0,-6);c.scale(k,1);
  const vl=(rot,sx,rx,ry,ang,a)=>{c.save();c.rotate(rot);c.scale(1-Math.abs(fl)*sx,1);const g=c.createLinearGradient(0,-ry,rx*2,ry);
   if(ts){g.addColorStop(0,'rgba(190,240,255,.25)');g.addColorStop(1,'rgba(190,240,255,.05)')}else{g.addColorStop(0,`hsla(${hue},90%,85%,${.55*a})`);g.addColorStop(.5,`hsla(${(hue+80)%360},90%,85%,${.35*a})`);g.addColorStop(1,`hsla(${(hue+170)%360},90%,90%,${.5*a})`)}
   c.fillStyle=g;c.strokeStyle=ts?'rgba(200,240,255,.35)':'rgba(255,255,255,.85)';c.lineWidth=.6;c.beginPath();c.ellipse(rx,0,rx,ry,ang,0,7);c.fill();c.stroke();
   if(!ts){c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=.35;c.beginPath();c.moveTo(1,0);c.lineTo(rx*1.6,Math.sin(ang)*rx*.8-ry*.3);c.moveTo(1,0);c.lineTo(rx*1.7,Math.sin(ang)*rx*.9+ry*.2);c.stroke();c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.arc(rx*1.3,Math.sin(ang)*rx*.6-ry*.3,.8,0,7);c.fill()}
   c.restore()};
  vl(-.35-fl*.25,.55,10,5,-.55,1);vl(.25-fl*.18,.45,7.5,3.6,.45,.9);c.restore()})}
function elfTeken(c,f,nu,sc){const ts=!!(f.teaser||f.donker),sl=!f.aan&&!f.rust&&!ts,zw=f.mode=='zwaai'&&f.wacht>0;const k=f.e.k||'#ffb0e0';
 c.save();c.translate(f.x,f.y);const S2=(f.rust?.95:window.innerWidth<370?1.05:1.15)*sc;c.scale(S2,S2);
 /* aura */
 c.globalCompositeOperation='lighter';c.globalAlpha=sl?.3:f.rust?.55:ts?.85:.75;const z=sl?40:f.rust?44:ts?46:58;c.drawImage(elfGloed(ts?'#bff7ff':k),-z/2,-z/2-4,z,z);c.globalCompositeOperation='source-over';c.globalAlpha=1;
 if(sl){/* slaapt op een blad */c.save();c.translate(0,18);const g=c.createLinearGradient(-16,0,16,0);g.addColorStop(0,'#3f8a2e');g.addColorStop(1,'#8fd060');c.fillStyle=g;c.beginPath();c.moveTo(-18,2);c.quadraticCurveTo(0,-8,18,0);c.quadraticCurveTo(0,8,-18,2);c.fill();c.strokeStyle='rgba(220,255,200,.6)';c.lineWidth=.6;c.beginPath();c.moveTo(-16,2);c.quadraticCurveTo(0,-1,16,0);c.stroke();c.restore()}
 /* pirouette / dansje: horizontaal schalen als rondje draaien */
 let rx=1,dy=0;if(f.pir&&nu<f.pir){const p=1-(f.pir-nu)/900;rx=Math.cos(p*Math.PI*4);dy=-Math.sin(p*Math.PI)*8}
 if(f.dans&&nu<f.dans){const p=(f.dans-nu)/2400;rx=Math.cos(nu/90);dy=-Math.abs(Math.sin(nu/160))*10;if(Math.random()<.4)f.extraVonk=1}
 c.translate(0,dy+(sl?Math.sin(nu/1200)*.6:0));if(sl)c.rotate(-.25);
 c.save();c.scale(Math.max(.15,Math.abs(rx)),1);pipVleugels(c,nu,f,sl,ts);c.restore();
 c.save();c.scale(rx<0?-Math.max(.15,-rx):Math.max(.15,rx),1);c.drawImage(pipSprite(k,ts?'teaser':sl?'slaap':'wakker'),-40,-40,80,80);
 /* knipperen */
 if(!sl&&!ts&&(nu+f.fase*1000)%3800<130){c.fillStyle='#ffe3d2';[-2.2,2.2].forEach(a=>{c.beginPath();c.ellipse(a,-14,1.4,1.5,0,0,7);c.fill()});c.strokeStyle='#4a2a18';c.lineWidth=.6;[-2.2,2.2].forEach(a=>{c.beginPath();c.moveTo(a-1.1,-13.8);c.lineTo(a+1.1,-13.8);c.stroke()})}
 if(zw){c.strokeStyle='#ffe3d2';c.lineWidth=1.8;c.lineCap='round';const a=Math.sin(nu/110)*.7;c.beginPath();c.moveTo(3,-7);c.lineTo(3+Math.cos(-1.3+a)*8,-7+Math.sin(-1.3+a)*8);c.stroke()}
 c.restore();
 if(sl&&f.mode=='zit'){c.fillStyle='rgba(255,255,255,.85)';c.font='italic bold 9px Georgia,serif';const t=nu/700;for(let i=0;i<3;i++){const q=(t+i/3)%1;c.globalAlpha=1-q;c.font=`italic bold ${6+q*6}px Georgia,serif`;c.fillText('z',8+q*8,-18-q*16)}c.globalAlpha=1}
 c.restore()}
/* tik op Pip: giechel + pirouette + zinnetje */
const PIPZIN=['Hihi, dat kietelt!','Je mandragora zegt hallo!','Ik heb glinster gestrooid, zie je het?','Psst… de valeriaan groeit lekker.','Nog even, dan bloeit hij!','Ik ben Pip! Fijn dat je er bent.'];
const PIPSLAAP=['Mmm… vijf minuutjes nog…','Zzz… toverpoeder… zzz','*gaapt* Een volle ampul en ik vlieg weer!'];
const PIPDONKER=['Mijn tijd is om…','Een nieuwe ampul, alsjeblieft.','Tik op Ampul gebruiken, dan vlieg ik weer in je kas.'];
function pipGiechel(){try{const A=window._pipAc||(window._pipAc=new (window.AudioContext||window.webkitAudioContext)());const t=A.currentTime;[0,.07,.14,.22].forEach((d,i)=>{const o=A.createOscillator(),g=A.createGain();o.type='sine';o.frequency.setValueAtTime(1400+i*180,t+d);o.frequency.exponentialRampToValueAtTime(1900+i*200,t+d+.05);g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(.06,t+d+.01);g.gain.exponentialRampToValueAtTime(.001,t+d+.07);o.connect(g).connect(A.destination);o.start(t+d);o.stop(t+d+.08)})}catch(e){}}
function pipBubbel(f,t){document.querySelectorAll('.pipbubbel').forEach(e=>e.remove());const host=document.querySelector('#elfcv.in-kas,#elfcv.in-menu')?.parentElement,r=host&&host.getBoundingClientRect(),x=f.x+(r?r.left:0),y=f.y+(r?r.top:0),b=document.createElement('div');b.className='pipbubbel';b.textContent=t;document.body.appendChild(b);const w=b.offsetWidth;b.style.left=Math.max(8,Math.min(innerWidth-w-8,x-w/2))+'px';b.style.top=Math.max(60,y-78)+'px';setTimeout(()=>b.classList.add('weg'),2200);setTimeout(()=>b.remove(),2700)}

/* ---------- makerscherm ---------- */
const _mkE=V.maker;V.maker=(...a)=>{_mkE(...a);const n=elfAantal(),volg=volgendElf(),namen=elfRoster().map(e=>e.n).join(', ');
 $('#app').insertAdjacentHTML('beforeend',`<section class="kaart sierlijst makerelf"><h3>Elfjes</h3><p class="klein">Je begint zonder. Elke 100 levels komt er één bij, en die blijft actief. Nu: ${n} van ${ELFJES_ALLE.length}${namen?(' · '+namen):''}.${volg?(' Volgende: '+volg.e.n+' op level '+volg.lvl+'.'):''}</p></section>`)};
syncElfjes(false);
