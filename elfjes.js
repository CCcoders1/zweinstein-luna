'use strict';
/* ====== Toverpoeder-ampul & elfjes in de kas ====== */
def('ampul',{n:0,vol:0});def('ampulBasis',20);def('elfjes',{});def('elfOpen',false);def('elfT',Date.now());
const ELFJES=[
 {id:'pip',n:'Pip',k:'#ffb0e0',kar:'giechelig en altijd te vroeg op',plant:'mandragora'},
 {id:'fenna',n:'Fenna',k:'#a8f0ff',kar:'dromerig, praat tegen bladeren',plant:'valeriaan'},
 {id:'bram',n:'Bram',k:'#c8ff8a',kar:'stoer, maar bang voor slakken',plant:'varkensgras'},
 {id:'lotje',n:'Lotje',k:'#ffe28a',kar:'nieuwsgierig, verzamelt glimmers',plant:'wolfsmelk'},
 {id:'mier',n:'Miertje',k:'#d6b0ff',kar:'precies en een tikje bazig',plant:'mandragora'},
 {id:'roosje',n:'Roosje',k:'#ffb48a',kar:'zingt zachtjes tijdens het werk',plant:'valeriaan'}];
const ampulDoel=()=>{let j=1;try{j=jaar()}catch(e){}return Math.max(3,(+S.ampulBasis||20)+2*(j-1)+actieveElfjes().length)};
const elfjesOpen=()=>!!S.elfOpen||(S.m3lvl||1)>15;
const actieveElfjes=()=>ELFJES.filter(e=>(S.elfjes[e.id]||0)>Date.now());
const groeiend=()=>Object.values(S.kweek||{}).filter(p=>p&&stadium(p)<4).length;
function elfBalans(){const a=actieveElfjes().length,p=groeiend();if(!a)return{z:'geen',f:1,t:p?'Nog geen elfjes aan het werk. Met een volle ampul huur je er één in.':'Plant iets, dan hebben de elfjes werk.'};
 if(!p)return{z:'veel',f:1,t:'De elfjes vervelen zich: er groeit niets! Plant snel een zaadje.'};
 const goed=Math.ceil(p/2);if(a<goed)return{z:'weinig',f:1+.2*a,t:`Te weinig handjes: ${a} elfje${a>1?'s':''} voor ${p} planten. Het groeit, maar langzaam.`};
 if(a>p)return{z:'veel',f:1.6,t:`Te veel elfjes voor ${p} plant${p>1?'en':''}. Ze vervelen zich (en eten toch poeder).`};
 return{z:'goed',f:1.6,goud:.12,t:'Perfecte balans! Gouden glans op je planten en meer kans op een gouden oogst.'}}
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
/* Hal: ampulkaartje */
const _homeE=V.home;V.home=(...a)=>{_homeE(...a);const app=$('#app');const dd=app.querySelector('.dagdoelen');const html=`<div class="ampulkaart">${ampulSVG('klein')}<div><b>Toverpoeder</b><small><span class="aptekst">${S.ampul.n}/${ampulDoel()}</span> · ${S.ampul.vol} volle ampul${S.ampul.vol==1?'':'len'}</small><small class="klein2">Wis 5+ voorwerpen in één keer om te vullen</small></div></div>`;dd?dd.insertAdjacentHTML('afterend',html):app.insertAdjacentHTML('afterbegin',html)};
/* ---------- Kas: paneel ---------- */
const _kasE=V.kas;V.kas=(...a)=>{_kasE(...a);const app=$('#app');if(!app.querySelector('.kassen'))return;elfTick();
 const open=elfjesOpen(),b=elfBalans(),act=actieveElfjes();
 const meter=`<div class="balans"><div class="bzones"><span>te weinig</span><span>goed</span><span>te veel</span></div><div class="bbalk"><i style="left:${{geen:4,weinig:22,goed:50,veel:84}[b.z]}%"></i></div></div>`;
 const kaarten=ELFJES.map(e=>{const t=(S.elfjes[e.id]||0)-Date.now(),aan=t>0;return `<div class="elfkaart ${aan?'aan':'sloom'}" style="--ek:${e.k}"><div class="elfico"><i></i></div><b>${e.n}</b><small>${e.kar}</small><small>Lievelingsplant: ${(ZADEN[e.plant]||[e.plant])[0]}</small>${aan?`<em>aan het werk · nog ${tijd(t)}</em>`:`<button class="knop klein huur" data-e="${e.id}" ${S.ampul.vol?'':'disabled'}>Inhuren · 1 ampul</button>`}</div>`}).join('');
 const html=open?`<section class="elfpaneel rococo"><div class="elfkop">${ampulSVG('klein')}<div><h3>Elfjes van de kas</h3><small><span class="aptekst">${S.ampul.n}/${ampulDoel()}</span> poeder · ${S.ampul.vol} volle ampul${S.ampul.vol==1?'':'len'} · ${act.length} aan het werk</small></div></div>${meter}<p class="balanstekst">${b.t}</p><div class="elfrij">${kaarten}</div><p class="klein">1 volle ampul = 1 elfje voor 1 dag. Onbetaalde elfjes doen een dutje, maar blijven gewoon bij je.</p></section>`
  :`<section class="elfpaneel teaser rococo"><div class="elfkop">${ampulSVG('klein')}<div><h3>Er fladdert iets…</h3><small><span class="aptekst">${S.ampul.n}/${ampulDoel()}</span> toverpoeder verzameld</small></div></div><p class="balanstekst">Tilly: "Zag je dat lichtje bij de potten? Ik denk dat er elfjes wonen! Speel verder (level 16) en spaar toverpoeder, dan durven ze misschien te blijven."</p></section>`;
 const anker=app.querySelector('.kassen');anker.insertAdjacentHTML('afterend',html);
 app.querySelectorAll('.huur').forEach(k=>k.onclick=()=>{if(S.ampul.vol<1){toast('Je hebt nog geen volle ampul.');return}const e=ELFJES.find(x=>x.id==k.dataset.e);S.ampul.vol--;S.elfjes[e.id]=Math.max(Date.now(),S.elfjes[e.id]||0)+864e5;S.elfT=Date.now();bewaar();try{fx.speel('goed')}catch(x){}vib(30);toast(`${e.n} komt helpen! ${e.n} houdt van ${(ZADEN[e.plant]||[e.plant])[0]}.`);V.kas()});
 elfStart()};
/* ---------- elfjes-animatie (canvas) ---------- */
const GLOED={};function elfGloed(k){if(GLOED[k])return GLOED[k];const c=document.createElement('canvas');c.width=c.height=48;const x=c.getContext('2d');const g=x.createRadialGradient(24,24,0,24,24,24);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,k);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,48,48);return GLOED[k]=c}
let elfRaf=0;
function elfStart(){if(document.getElementById('elfcv'))return;const cv=document.createElement('canvas');cv.id='elfcv';document.body.appendChild(cv);const ctx=cv.getContext('2d');const dpr=Math.min(2,devicePixelRatio||1);let W,H;const maat=()=>{W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};maat();addEventListener('resize',maat);
 const open=elfjesOpen();const lijst=open?ELFJES.map(e=>({e,aan:(S.elfjes[e.id]||0)>Date.now()})):[{e:{id:'teaser',n:'?',k:'#bff7ff'},aan:true,teaser:true}];
 const elf=lijst.map((o,i)=>({...o,x:Math.random()*W,y:H*.3+Math.random()*H*.4,vx:0,vy:0,tx:0,ty:0,fase:Math.random()*9,spoor:[],wacht:0,mode:'vlieg',t0:performance.now()+(o.teaser?3000:0),zit:null}));
 const potDoelen=()=>[...document.querySelectorAll('.kpot')].map(p=>{const r=p.getBoundingClientRect();return[r.left+r.width/2+(Math.random()-.5)*r.width*.3,r.top+r.height*.35]}).filter(([x,y])=>y>60&&y<H-90);
 const nieuwDoel=f=>{const pd=potDoelen();if(f.teaser){f.tx=Math.random()<.5?-40:W+40;f.ty=H*(.25+Math.random()*.4);return}
  if(!f.aan){const p=pd[f.e.id.length%Math.max(1,pd.length)];[f.tx,f.ty]=p||[W*.2+Math.random()*W*.6,H*.6];f.mode='naarzit';return}
  const r=Math.random();if(r<.12){f.mode='zwaai';f.tx=W*(.35+Math.random()*.3);f.ty=H*.42;return}if(r<.5&&pd.length){[f.tx,f.ty]=pd[Math.random()*pd.length|0];f.mode='land';return}f.mode='vlieg';f.tx=W*(.1+Math.random()*.8);f.ty=H*(.15+Math.random()*.6)};
 elf.forEach(nieuwDoel);const vonk=[];let laatst=performance.now();
 const frame=nu=>{if(document.body.dataset.view!=='kas'||!document.body.contains(cv)){cv.remove();removeEventListener('resize',maat);return}const dt=Math.min(40,nu-laatst)/16.7;laatst=nu;ctx.clearRect(0,0,W,H);
  for(const f of elf){if(nu<f.t0)continue;
   if(f.teaser&&f.mode!=='weg'&&(f.x<-30||f.x>W+30)&&nu-f.t0>3000){f.t0=nu+18000+Math.random()*12000;f.x=f.tx<0?W+30:-30;f.y=H*(.3+Math.random()*.3);nieuwDoel(f);continue}
   const dx=f.tx-f.x,dy=f.ty-f.y,d=Math.hypot(dx,dy);
   if(f.wacht>0){f.wacht-=dt*16.7;if(f.mode=='land'&&Math.random()<.15)vonk.push({x:f.x+(Math.random()-.5)*14,y:f.y+4,vy:.4+Math.random()*.6,l:1,k:f.e.k});if(f.wacht<=0)nieuwDoel(f)}
   else if(d<8){if(f.mode=='land'){f.wacht=1500+Math.random()*2000}else if(f.mode=='zwaai'){f.wacht=1600}else if(f.mode=='naarzit'){f.mode='zit';f.wacht=1e12}else nieuwDoel(f)}
   else{const sp=f.aan?(f.teaser?2.4:1.7):.6;const ax=dx/d*sp-f.vx,ay=dy/d*sp-f.vy;f.vx+=ax*.04*dt;f.vy+=ay*.04*dt;f.vx+=Math.sin(nu/400+f.fase)*.03;f.vy+=Math.cos(nu/330+f.fase)*.03}
   if(f.wacht>0&&f.mode!=='zit'){f.vx*=.85;f.vy*=.85}if(f.mode=='zit'){f.vx=0;f.vy=0}
   f.x+=f.vx*dt;f.y+=f.vy*dt+(f.wacht>0&&f.mode!=='zit'?Math.sin(nu/300+f.fase)*.25:0);
   if(f.aan&&!RMP){f.spoor.push([f.x,f.y]);if(f.spoor.length>14)f.spoor.shift()}else f.spoor.length=0;
   ctx.globalCompositeOperation='lighter';f.spoor.forEach(([x,y],i)=>{const a=i/f.spoor.length;ctx.globalAlpha=a*.5;const z=4+a*8;ctx.drawImage(elfGloed(f.e.k),x-z/2,y-z/2,z,z)});ctx.globalAlpha=1;
   const sc=f.mode=='zwaai'&&f.wacht>0?1.7:1;elfTeken(ctx,f,nu,sc)}
  ctx.globalCompositeOperation='lighter';for(let i=vonk.length-1;i>=0;i--){const v=vonk[i];v.y+=v.vy*dt;v.l-=.02*dt;if(v.l<=0){vonk.splice(i,1);continue}ctx.globalAlpha=v.l;ctx.drawImage(elfGloed(v.k),v.x-4,v.y-4,8,8)}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  elfRaf=requestAnimationFrame(frame)};elfRaf=requestAnimationFrame(frame)}
function elfTeken(c,f,nu,sc){const sloom=!f.aan,zw=f.mode=='zwaai'&&f.wacht>0;c.save();c.translate(f.x,f.y);c.scale(sc*1.7,sc*1.7);
 c.globalCompositeOperation='lighter';c.globalAlpha=sloom?.35:.9;const z=sloom?26:36;c.drawImage(elfGloed(f.e.k),-z/2,-z/2,z,z);c.globalCompositeOperation='source-over';c.globalAlpha=1;
 const fl=sloom?Math.sin(nu/600)*.15:Math.sin(nu/38+f.fase);
 [-1,1].forEach(k=>{c.save();c.scale(k,1);c.fillStyle=sloom?'rgba(190,200,220,.45)':'rgba(230,250,255,.6)';c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=.6;c.save();c.rotate(-.5-fl*.5);c.beginPath();c.ellipse(5,-4,6,3.2,-.5,0,7);c.fill();c.stroke();c.restore();c.save();c.rotate(.2-fl*.35);c.beginPath();c.ellipse(4.5,2,4.5,2.4,.4,0,7);c.fill();c.stroke();c.restore();c.restore()});
 c.fillStyle=sloom?'#b8b0c8':f.e.k;c.beginPath();c.moveTo(0,-1.5);c.lineTo(3.2,5);c.lineTo(-3.2,5);c.closePath();c.fill();
 c.fillStyle='#ffe8d8';c.beginPath();c.arc(0,-3.6,2.4,0,7);c.fill();c.fillStyle=sloom?'#7a6a8a':'#6a3a1a';c.beginPath();c.arc(0,-4.4,2.5,Math.PI,0);c.fill();
 if(zw){c.strokeStyle='#ffe8d8';c.lineWidth=1.1;c.beginPath();c.moveTo(2,0);const a=Math.sin(nu/120)*.6;c.lineTo(2+Math.cos(-1.2+a)*4,Math.sin(-1.2+a)*4);c.stroke()}
 if(sloom&&f.mode=='zit'){c.fillStyle='rgba(255,255,255,.7)';c.font='bold 6px serif';c.fillText('z',4,-7-Math.sin(nu/500)*2);c.font='bold 4px serif';c.fillText('z',8,-11-Math.sin(nu/500+1)*2)}
 c.restore()}
/* ---------- makerscherm ---------- */
const _mkE=V.maker;V.maker=(...a)=>{_mkE(...a);$('#app').insertAdjacentHTML('beforeend',`<section class="kaart sierlijst makerelf"><h3>Toverpoeder & elfjes</h3><label>Ampul-basis (5+-combi's per ampul): <input id="mkamp" type="number" min="3" max="200" value="${S.ampulBasis}"></label><p class="klein">Huidig doel: ${ampulDoel()} (basis + 2 per leerjaar + 1 per werkend elfje)</p><label><input type="checkbox" id="mkelf" ${S.elfOpen?'checked':''}> Elfjes direct ontgrendelen (test)</label><p><button class="knop klein" id="mkvul">+1 volle ampul (test)</button></p></section>`);
 $('#mkamp').onchange=e=>{S.ampulBasis=Math.max(3,+e.target.value||20);bewaar();toast('Ampul-doel: '+ampulDoel())};$('#mkelf').onchange=e=>{S.elfOpen=e.target.checked;bewaar();toast(S.elfOpen?'Elfjes ontgrendeld':'Elfjes weer op slot')};$('#mkvul').onclick=()=>{S.ampul.vol++;bewaar();toast('Volle ampul toegevoegd')}};
