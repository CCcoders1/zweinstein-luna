'use strict';
/* ====== Toverpoeder-ampul & elfjes in de kas ====== */
def('ampul',{n:0,vol:0});def('ampulBasis',20);def('elfjes',{});def('elfOpen',false);def('elfT',Date.now());
const ELFJES_ALLE=[
 {id:'pip',n:'Pip',k:'#ffb0e0',kar:'giechelig en altijd te vroeg op',plant:'mandragora'},
 {id:'fenna',n:'Fenna',k:'#a8f0ff',kar:'dromerig, praat tegen bladeren',plant:'valeriaan'},
 {id:'bram',n:'Bram',k:'#c8ff8a',kar:'stoer, maar bang voor slakken',plant:'varkensgras'},
 {id:'lotje',n:'Lotje',k:'#ffe28a',kar:'nieuwsgierig, verzamelt glimmers',plant:'wolfsmelk'},
 {id:'mier',n:'Miertje',k:'#d6b0ff',kar:'precies en een tikje bazig',plant:'mandragora'},
 {id:'roosje',n:'Roosje',k:'#ffb48a',kar:'zingt zachtjes tijdens het werk',plant:'valeriaan'}];
/* config: voorlopig 1 elfje actief (data van de rest blijft bewaard) */
const ELF_ACTIEF=1;const ELF_CAPACITEIT=3;/* 1 elfje helpt tot 3 groeiende planten */
const ELFJES=ELFJES_ALLE.slice(0,ELF_ACTIEF);
(()=>{let m=0;Object.keys(S.elfjes||{}).forEach(id=>{if(!ELFJES.some(e=>e.id==id)){delete S.elfjes[id];m=1}});if(m)bewaar()})();
const ampulDoel=()=>{let j=1;try{j=jaar()}catch(e){}return Math.max(3,(+S.ampulBasis||20)+2*(j-1)+actieveElfjes().length)};
const elfjesOpen=()=>!!S.elfOpen||(S.m3lvl||1)>15;
const actieveElfjes=()=>ELFJES.filter(e=>(S.elfjes[e.id]||0)>Date.now());
const groeiend=()=>Object.values(S.kweek||{}).filter(p=>p&&stadium(p)<4).length;
function elfBalans(){const a=actieveElfjes().length,p=groeiend(),cap=a*ELF_CAPACITEIT,een=ELF_ACTIEF==1;
 if(!a)return{z:'geen',f:1,t:p?(een?'Pip fladdert onderaan het hoofdscherm. Met een volle ampul vliegt ze levend in de kas.':'Nog geen elfjes aan het werk. Met een volle ampul huur je er één in.'):'Plant iets, dan heeft Pip straks werk. Tot die tijd fladdert ze onderaan het hoofdscherm.'};
 if(!p)return{z:'veel',f:1,t:een?'Pip verveelt zich: er groeit niets! Plant snel een zaadje.':'De elfjes vervelen zich: er groeit niets!'};
 if(p>cap)return{z:'weinig',f:1+.6*cap/p,t:`${een?'Pip':'De elfjes'} kan maar ${cap} planten tegelijk verzorgen; je hebt er ${p}. Het groeit wat sneller, maar niet overal.`};
 return{z:'goed',f:1.6,goud:.12,t:een?`Perfecte balans! Pip verzorgt je ${p} plant${p>1?'en':''}: gouden glans en meer kans op een gouden oogst.`:'Perfecte balans! Gouden glans op je planten en meer kans op een gouden oogst.'}}
/* groeibonus toepassen */
function elfTick(){const nu=Date.now(),dt=Math.min(864e5,nu-(S.elfT||nu));S.elfT=nu;if(!elfjesOpen()||dt<=0)return;const b=elfBalans();if(b.f<=1)return;
 Object.values(S.kweek||{}).forEach(p=>{if(!p||stadium(p)>=4)return;p.bonus=(p.bonus||0)+Math.min(rest(p),dt*(b.f-1));if(b.goud&&!p.elfRol){p.elfRol=1;if(Math.random()<b.goud)p.goud=true}});bewaar()}
setInterval(()=>{try{elfTick()}catch(e){}},5000);setTimeout(()=>{try{elfTick()}catch(e){}},500);
/* ---------- ampul ---------- */
function ampulSVG(cls=''){const d=ampulDoel(),p=Math.min(1,S.ampul.n/d);return `<div class="ampul ${cls}" title="Toverpoeder ${S.ampul.n}/${d}"><svg viewBox="0 0 40 64"><defs><linearGradient id="apg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7a2ad0"/><stop offset=".6" stop-color="#c58aff"/><stop offset="1" stop-color="#ffe58a"/></linearGradient><clipPath id="apc"><path d="M15 14v8C7 26 5 33 5 41c0 10 7 18 15 18s15-8 15-18c0-8-2-15-10-19v-8z"/></clipPath></defs>
 <path d="M15 14v8C7 26 5 33 5 41c0 10 7 18 15 18s15-8 15-18c0-8-2-15-10-19v-8z" fill="rgba(220,235,255,.25)"/>
 <g clip-path="url(#apc)"><rect class="apvul" x="0" y="${(59-45*p).toFixed(1)}" width="40" height="64" fill="url(#apg)"/><g class="apglim" fill="#fff">${[[12,48],[24,52],[18,42],[28,44],[10,54]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i%2?.9:1.3}" style="animation-delay:${-i*.4}s"/>`).join('')}</g></g>
 <path d="M15 14v8C7 26 5 33 5 41c0 10 7 18 15 18s15-8 15-18c0-8-2-15-10-19v-8z" fill="none" stroke="#2a1a4a" stroke-width="1.6"/><path d="M10 34c-2 4-2 10 1 14" stroke="rgba(255,255,255,.7)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
 <rect x="12" y="6" width="16" height="9" rx="2" fill="#a8743a" stroke="#4a2c0a" stroke-width="1.2"/><rect x="11" y="13" width="18" height="3" rx="1.5" fill="#d4af37"/></svg>${S.ampul.vol?`<b class="apvolle">${S.ampul.vol}</b>`:''}</div>`}
function ampulUpdate(){const d=ampulDoel(),p=Math.min(1,S.ampul.n/d);document.querySelectorAll('.ampul').forEach(a=>{const r=a.querySelector('.apvul');if(r)r.setAttribute('y',(59-45*p).toFixed(1));a.title=`Toverpoeder ${S.ampul.n}/${d}`;let v=a.querySelector('.apvolle');if(S.ampul.vol){if(!v){v=document.createElement('b');v.className='apvolle';a.appendChild(v)}v.textContent=S.ampul.vol}else if(v)v.remove()});document.querySelectorAll('.aptekst').forEach(t=>t.textContent=`${S.ampul.n}/${d}`)}
function tink(h=0){try{const{ac,master}=fx.ctx();const t=ac.currentTime;[1760,2637].forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f*2**(h/12);g.gain.setValueAtTime(0,t+i*.03);g.gain.linearRampToValueAtTime(.05,t+i*.03+.005);g.gain.exponentialRampToValueAtTime(.0008,t+.6);o.connect(g);g.connect(master);o.start(t+i*.03);o.stop(t+.65)})}catch(e){}}
let tinkT=0;
function ampulLaad(punten){const a=document.querySelector('.m3 .ampul')||document.querySelector('.ampul');
 const tel=()=>{S.ampul.n++;const d=ampulDoel();let vol=false;if(S.ampul.n>=d){S.ampul.n=0;S.ampul.vol++;vol=true}bewaar();ampulUpdate();
  if(a){a.classList.remove('vult');void a.offsetWidth;a.classList.add('vult')}const nu=performance.now();if(nu-tinkT>120){tinkT=nu;tink(Math.min(12,S.ampul.n%12))}
  if(vol){try{fx.speel('fanfare')}catch(e){}vib([30,40,30,40,90]);toast('De ampul is vol! Toverpoeder voor een elfje.');if(a){a.classList.add('volglans');setTimeout(()=>a.classList.remove('volglans'),2500)}}};
 if(!a||RMP){tel();return}const r=a.getBoundingClientRect(),tx=r.left+r.width/2,ty=r.top+r.height*.7;let n=0;
 punten.slice(0,10).forEach(([x,y],i)=>{for(let k=0;k<2;k++){const s=document.createElement('i');s.className='apdeeltje'+(k?' goud':'');s.style.left=x+'px';s.style.top=y+'px';document.body.appendChild(s);const dx=tx-x,dy=ty-y,bh=-80-Math.random()*60;
  s.animate([{transform:'translate(0,0) scale(1.2)',opacity:1},{transform:`translate(${dx*.3+(Math.random()-.5)*40}px,${dy*.3+bh}px) scale(1)`,opacity:1,offset:.4},{transform:`translate(${dx}px,${dy}px) scale(.4)`,opacity:.9}],{duration:900+i*60+k*90,delay:250,easing:'cubic-bezier(.5,0,.3,1)',fill:'forwards'}).onfinish=()=>{s.remove();if(!k&&i==0)tel();if(a&&!k){a.classList.remove('tik');void a.offsetWidth;a.classList.add('tik')}}}})}
/* HUD in match-3 */
const _m3s=m3Speel;m3Speel=function(...a){_m3s(...a);const m=document.querySelector('.m3mid');if(m){m.insertAdjacentHTML('afterbegin',ampulSVG('m3amp'))}};
/* Hal: ampulkaartje + inactieve elfjes onderaan */
function elfOpHome(){if(document.body.dataset.view!=='home')return;const app=$('#app');if(!app)return;if(!app.querySelector('.ampulkaart')){const dd=app.querySelector('.dagdoelen');const html=`<div class="ampulkaart">${ampulSVG('klein')}<div><b>Toverpoeder</b><small><span class="aptekst">${S.ampul.n}/${ampulDoel()}</span> · ${S.ampul.vol} volle ampul${S.ampul.vol==1?'':'len'}</small><small class="klein2">Wis 5+ voorwerpen in één keer om te vullen</small></div></div>`;dd?dd.insertAdjacentHTML('afterend',html):app.insertAdjacentHTML('afterbegin',html)}elfStart('home')}
const _homeE=V.home;V.home=(...a)=>{_homeE(...a);elfOpHome()};
/* ---------- Kas: paneel ---------- */
const _kasE=V.kas;V.kas=(...a)=>{_kasE(...a);const app=$('#app');if(!app.querySelector('.kweekbalk')&&!app.querySelector('.kassen'))return;elfTick();
 const open=elfjesOpen(),b=elfBalans(),act=actieveElfjes();
 const meter=`<div class="balans"><div class="bzones"><span>te veel planten</span><span>goed</span><span>verveelt zich</span></div><div class="bbalk"><i style="left:${{geen:4,weinig:22,goed:50,veel:84}[b.z]}%"></i></div></div>`;
 const kaarten=ELFJES.map(e=>{const t=(S.elfjes[e.id]||0)-Date.now(),aan=t>0;return `<div class="elfkaart ${aan?'aan':'sloom'}" style="--ek:${e.k}"><div class="elfico"><i></i></div><b>${e.n}</b><small>${e.kar}</small><small>Lievelingsplant: ${(ZADEN[e.plant]||[e.plant])[0]}</small>${aan?`<em>aan het werk · nog ${tijd(t)}</em>`:`<button class="knop klein huur" data-e="${e.id}" ${S.ampul.vol?'':'disabled'}>Inhuren · 1 ampul</button>`}</div>`}).join('');
 const html=open?`<section class="elfpaneel rococo"><div class="elfkop">${ampulSVG('klein')}<div><h3>${ELF_ACTIEF==1?"Pip, het kaself":"Elfjes van de kas"}</h3><small><span class="aptekst">${S.ampul.n}/${ampulDoel()}</span> poeder · ${S.ampul.vol} volle ampul${S.ampul.vol==1?'':'len'} · ${act.length} aan het werk</small></div></div>${meter}<p class="balanstekst">${b.t}</p><div class="elfrij">${kaarten}</div><p class="klein">1 volle ampul = 1 dag hulp. Pip verzorgt tot ${ELF_CAPACITEIT} groeiende planten. Zonder poeder fladdert ze onderaan het hoofdscherm. Is de ampul gebruikt, dan vliegt ze levend in de kas.</p></section>`
  :`<section class="elfpaneel teaser rococo"><div class="elfkop">${ampulSVG('klein')}<div><h3>Er fladdert iets…</h3><small><span class="aptekst">${S.ampul.n}/${ampulDoel()}</span> toverpoeder verzameld</small></div></div><p class="balanstekst">Tilly: "Zag je dat lichtje bij de potten? Ik denk dat er elfjes wonen! Speel verder (level 16) en spaar toverpoeder, dan durven ze misschien te blijven."</p></section>`;
 const anker=app.querySelector('.kweekbalk')||app.querySelector('.kassen');anker.insertAdjacentHTML('afterend',html);
 app.querySelectorAll('.huur').forEach(k=>k.onclick=()=>{if(S.ampul.vol<1){toast('Je hebt nog geen volle ampul.');return}const e=ELFJES.find(x=>x.id==k.dataset.e);S.ampul.vol--;S.elfjes[e.id]=Math.max(Date.now(),S.elfjes[e.id]||0)+864e5;S.elfT=Date.now();sessionStorage.pipDans=1;bewaar();try{fx.speel('goed')}catch(x){}vib(30);toast(`${e.n} komt helpen! ${e.n} houdt van ${(ZADEN[e.plant]||[e.plant])[0]}.`);V.kas()});
 elfStart('kas')};
/* ---------- elfjes-animatie (canvas) ---------- */
const GLOED={};function elfGloed(k){if(GLOED[k])return GLOED[k];const c=document.createElement('canvas');c.width=c.height=48;const x=c.getContext('2d');const g=x.createRadialGradient(24,24,0,24,24,24);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,k);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,48,48);return GLOED[k]=c}
let elfRaf=0;
/* Inactief: onderaan het hoofdscherm. Ampul gebruikt: levend in de kas. */
function elfStart(plek){if(window._elfStop)window._elfStop();
 const view=plek==='home'?'home':'kas';const open=elfjesOpen();let lijst;
 if(view==='home'){if(!open)return;lijst=ELFJES.filter(e=>!((S.elfjes[e.id]||0)>Date.now())).map(e=>({e,aan:false,rust:true}));if(!lijst.length)return}
 else if(!open)lijst=[{e:{id:'teaser',n:'?',k:'#bff7ff'},aan:true,teaser:true}];
 else{lijst=ELFJES.filter(e=>(S.elfjes[e.id]||0)>Date.now()).map(e=>({e,aan:true}));if(!lijst.length)return}
 const cv=document.createElement('canvas');cv.id='elfcv';document.body.appendChild(cv);const ctx=cv.getContext('2d');const dpr=Math.min(2,devicePixelRatio||1);let W,H;const maat=()=>{W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};maat();addEventListener('resize',maat);
 const band=()=>{const nav=document.querySelector('#nav');const top=nav?nav.getBoundingClientRect().top:H-88;const onder=Math.max(130,top-52);const boven=Math.max(88,onder-Math.min(150,H*.18));return [boven,onder]};
 const [b0,o0]=band();
 const elf=lijst.map((o,i)=>({...o,x:o.rust?W*(.18+.64*i/Math.max(1,lijst.length-1||1)):Math.random()*W,y:o.rust?b0+Math.random()*Math.max(24,o0-b0):H*.3+Math.random()*H*.4,vx:0,vy:0,tx:0,ty:0,fase:Math.random()*9,spoor:[],wacht:0,mode:'vlieg',t0:performance.now()+(o.teaser?3000:0),zit:null}));
 const potDoelen=()=>[...document.querySelectorAll('.kpot')].map(p=>{const r=p.getBoundingClientRect();return[r.left+r.width/2+(Math.random()-.5)*r.width*.3,r.top+r.height*.35]}).filter(([x,y])=>y>60&&y<H-90);
 const nieuwDoel=f=>{const pd=potDoelen();if(f.teaser){f.tx=Math.random()<.5?-40:W+40;f.ty=H*(.25+Math.random()*.4);return}
  if(f.rust){const [boven,onder]=band();f.mode=Math.random()<.18?'zwaai':'vlieg';f.tx=28+Math.random()*Math.max(40,W-56);f.ty=boven+Math.random()*Math.max(20,onder-boven);return}
  if(!f.aan){const p=pd[f.e.id.length%Math.max(1,pd.length)];[f.tx,f.ty]=p||[W*.2+Math.random()*W*.6,H*.6];f.mode='naarzit';return}
  const r=Math.random();if(r<.12){f.mode='zwaai';f.tx=W*(.35+Math.random()*.3);f.ty=H*.42;return}if(r<.5&&pd.length){[f.tx,f.ty]=pd[Math.random()*pd.length|0];f.mode='land';return}f.mode='vlieg';f.tx=W*(.1+Math.random()*.8);f.ty=H*(.18+Math.random()*.5)};
 elf.forEach(nieuwDoel);const vonk=[];let laatst=performance.now();
 if(view==='kas'&&sessionStorage.pipDans){const f=elf.find(x=>x.aan&&!x.teaser);if(f){sessionStorage.removeItem('pipDans');f.x=W/2;f.y=H*.42;f.t0=0;f.dans=performance.now()+2400;f.mode='zwaai';f.tx=W/2;f.ty=H*.42;f.wacht=2400;setTimeout(()=>pipBubbel(f,'Joepie! Ik ga voor je planten zorgen!'),400)}}
 const tik=ev=>{const p=ev.touches?ev.touches[0]:ev;for(const f of elf){if(performance.now()<f.t0)continue;if(Math.hypot(p.clientX-f.x,p.clientY-(f.y-8))<34){if(f.teaser){pipBubbel(f,'…?');f.tx=f.x<W/2?-40:W+40;return}pipGiechel();vib(15);if(f.aan){f.pir=performance.now()+900;for(let i=0;i<10;i++)vonk.push({x:f.x+(Math.random()-.5)*30,y:f.y+(Math.random()-.5)*30,vy:-.3+Math.random()*.8,l:1,k:f.e.k})}pipBubbel(f,(f.aan?PIPZIN:PIPSLAAP)[Math.random()*(f.aan?PIPZIN:PIPSLAAP).length|0]);ev.stopPropagation();return}}};
 document.addEventListener('pointerdown',tik,true);window._pipTik=elf;
 const ruim=()=>{cancelAnimationFrame(elfRaf);cv.remove();removeEventListener('resize',maat);document.removeEventListener('pointerdown',tik,true);document.querySelectorAll('.pipbubbel').forEach(e=>e.remove());if(window._elfStop===stop)window._elfStop=null};
 const stop=()=>ruim();window._elfStop=stop;
 const frame=nu=>{if(document.body.dataset.view!==view||!document.body.contains(cv)){ruim();return}const dt=Math.min(40,nu-laatst)/16.7;laatst=nu;ctx.clearRect(0,0,W,H);
  for(const f of elf){if(nu<f.t0)continue;
   if(f.teaser&&f.mode!=='weg'&&(f.x<-30||f.x>W+30)&&nu-f.t0>3000){f.t0=nu+18000+Math.random()*12000;f.x=f.tx<0?W+30:-30;f.y=H*(.3+Math.random()*.3);nieuwDoel(f);continue}
   const dx=f.tx-f.x,dy=f.ty-f.y,d=Math.hypot(dx,dy);
   if(f.wacht>0){f.wacht-=dt*16.7;if(f.mode=='land'&&Math.random()<.15)vonk.push({x:f.x+(Math.random()-.5)*14,y:f.y+4,vy:.4+Math.random()*.6,l:1,k:f.e.k});if(f.wacht<=0)nieuwDoel(f)}
   else if(d<8){if(f.mode=='land'){f.wacht=1500+Math.random()*2000}else if(f.mode=='zwaai'){f.wacht=1600}else if(f.mode=='naarzit'){f.mode='zit';f.wacht=1e12}else nieuwDoel(f)}
   else{const sp=f.teaser?2.4:f.aan?1.7:f.rust?1.25:.6;const ax=dx/d*sp-f.vx,ay=dy/d*sp-f.vy;f.vx+=ax*.04*dt;f.vy+=ay*.04*dt;f.vx+=Math.sin(nu/400+f.fase)*.03;f.vy+=Math.cos(nu/330+f.fase)*.03}
   if(f.wacht>0&&f.mode!=='zit'){f.vx*=.85;f.vy*=.85}if(f.mode=='zit'){f.vx=0;f.vy=0}
   f.x+=f.vx*dt;f.y+=f.vy*dt+(f.wacht>0&&f.mode!=='zit'?Math.sin(nu/300+f.fase)*.25:0);
   if(f.rust){const [boven,onder]=band();if(f.y<boven){f.y=boven;f.vy=Math.abs(f.vy)*.4}if(f.y>onder){f.y=onder;f.vy=-Math.abs(f.vy)*.4}if(f.x<18){f.x=18;f.vx=Math.abs(f.vx)}if(f.x>W-18){f.x=W-18;f.vx=-Math.abs(f.vx)}}
   if(f.aan&&!RMP){f.spoor.push([f.x,f.y+6]);if(f.spoor.length>22)f.spoor.shift();if(Math.random()<.35*dt||f.extraVonk){f.extraVonk=0;vonk.push({x:f.x+(Math.random()-.5)*10,y:f.y+8,vy:.25+Math.random()*.4,l:1,k:Math.random()<.5?'#ffe58a':f.e.k})}}else if(f.rust&&!RMP){f.spoor.push([f.x,f.y+6]);if(f.spoor.length>8)f.spoor.shift()}else f.spoor.length=0;
   ctx.globalCompositeOperation='lighter';f.spoor.forEach(([x,y],i)=>{const a=i/f.spoor.length;ctx.globalAlpha=a*.5;const z=4+a*10;ctx.drawImage(elfGloed(f.teaser?'#bff7ff':f.e.k),x-z/2,y-z/2,z,z)});ctx.globalAlpha=1;
   const sc=f.mode=='zwaai'&&f.wacht>0?1.7:1;elfTeken(ctx,f,nu,sc)}
  ctx.globalCompositeOperation='lighter';for(let i=vonk.length-1;i>=0;i--){const v=vonk[i];v.y+=v.vy*dt;v.l-=.012*dt;v.x+=Math.sin(nu/200+v.y)*.15;if(v.l<=0){vonk.splice(i,1);continue}ctx.globalAlpha=v.l;const vz=3+v.l*6;ctx.drawImage(elfGloed(v.k),v.x-vz/2,v.y-vz/2,vz,vz);if(v.l>.6){ctx.fillStyle='#fff';ctx.fillRect(v.x-.4,v.y-vz*.6,.8,vz*1.2);ctx.fillRect(v.x-vz*.6,v.y-.4,vz*1.2,.8)}}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
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
function elfTeken(c,f,nu,sc){const ts=!!f.teaser,sl=!f.aan&&!f.rust&&!ts,zw=f.mode=='zwaai'&&f.wacht>0;const k=f.e.k||'#ffb0e0';
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
function pipGiechel(){try{const A=window._pipAc||(window._pipAc=new (window.AudioContext||window.webkitAudioContext)());const t=A.currentTime;[0,.07,.14,.22].forEach((d,i)=>{const o=A.createOscillator(),g=A.createGain();o.type='sine';o.frequency.setValueAtTime(1400+i*180,t+d);o.frequency.exponentialRampToValueAtTime(1900+i*200,t+d+.05);g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(.06,t+d+.01);g.gain.exponentialRampToValueAtTime(.001,t+d+.07);o.connect(g).connect(A.destination);o.start(t+d);o.stop(t+d+.08)})}catch(e){}}
function pipBubbel(f,t){document.querySelectorAll('.pipbubbel').forEach(e=>e.remove());const b=document.createElement('div');b.className='pipbubbel';b.textContent=t;document.body.appendChild(b);const w=b.offsetWidth;b.style.left=Math.max(8,Math.min(innerWidth-w-8,f.x-w/2))+'px';b.style.top=Math.max(60,f.y-78)+'px';setTimeout(()=>b.classList.add('weg'),2200);setTimeout(()=>b.remove(),2700)}
/* ---------- makerscherm ---------- */
const _mkE=V.maker;V.maker=(...a)=>{_mkE(...a);$('#app').insertAdjacentHTML('beforeend',`<section class="kaart sierlijst makerelf"><h3>Toverpoeder & elfjes</h3><label>Ampul-basis (5+-combi's per ampul): <input id="mkamp" type="number" min="3" max="200" value="${S.ampulBasis}"></label><p class="klein">Huidig doel: ${ampulDoel()} (basis + 2 per leerjaar + 1 per werkend elfje)</p><label><input type="checkbox" id="mkelf" ${S.elfOpen?'checked':''}> Elfjes direct ontgrendelen (test)</label><p><button class="knop klein" id="mkvul">+1 volle ampul (test)</button></p></section>`);
 $('#mkamp').onchange=e=>{S.ampulBasis=Math.max(3,+e.target.value||20);bewaar();toast('Ampul-doel: '+ampulDoel())};$('#mkelf').onchange=e=>{S.elfOpen=e.target.checked;bewaar();toast(S.elfOpen?'Elfjes ontgrendeld':'Elfjes weer op slot')};$('#mkvul').onclick=()=>{S.ampul.vol++;bewaar();toast('Volle ampul toegevoegd')}};
if(document.body.dataset.view==='home')elfOpHome();
