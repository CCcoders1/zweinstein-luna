'use strict';
/* ====== Extra: ambiance, decors, weer, verjaardag, PWA, mobiele-game-lagen ====== */
const RMX=matchMedia('(prefers-reduced-motion: reduce)').matches;
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const D0=()=>new Date();const ymd=d=>d.toISOString().slice(0,10);
const gisteren=()=>ymd(new Date(Date.now()-864e5));
const def=(k,v)=>{if(S[k]===undefined)S[k]=v};
def('start',vandaag());def('login',{dag:0,laatst:''});def('tijdverdrijver',1);def('kaarten',{});def('kamer',[]);def('dier',null);def('tel',{});def('kist',2);def('combo',0);def('verjaardag',0);def('questKlaar',{});def('lessen',{});def('bertie',{d:'',n:0});
const tel=(t,n=1)=>{const d=vandaag();S.tel[d]=S.tel[d]||{};S.tel[d][t]=(S.tel[d][t]||0)+n;const w='w'+weekNr();S.tel[w]=S.tel[w]||{};S.tel[w][t]=(S.tel[w][t]||0)+n};
const telV=(t,w)=>((S.tel[w?'w'+weekNr():vandaag()]||{})[t]||0);
function weekNr(){return Math.floor((Date.now()-new Date(S.start).getTime())/6048e5)}
/* ---------- aanspreken ---------- */
function aanspreek(){const p=naam().trim().split(/\s+/);return p.length>1?'juffrouw '+p.slice(1).join(' '):p[0]}
function groet(){const h=D0().getHours();return h<6?'Goedenacht':h<12?'Goedemorgen':h<18?'Goedemiddag':'Goedenavond'}
/* ---------- dag/nacht + seizoen ---------- */
function tijdSfeer(){const h=D0().getHours()+D0().getMinutes()/60;return h<5.5||h>=22?'nacht':h<9?'ochtend':h<17?'dag':h<20.5?'gouden':'schemer'}
function seizoen(){const d=D0(),m=d.getMonth()+1,dd=d.getDate();if(m==12&&dd>=10||m==1&&dd<=6)return'kerst';if(m==10&&dd>=1||m==11&&dd<=2)return'herfst';if(m>=9&&m<=11)return'herfst';if(m>=3&&m<=5)return'lente';if(m>=6&&m<=8)return'zomer';return'winter'}
function feestdag(){const d=D0(),m=d.getMonth()+1,dd=d.getDate();
 if(m==3&&dd==9)return{k:'verjaardag',t:'🎂 Gefeliciteerd met je verjaardag!'};
 if(m==10&&dd>=1||m==11&&dd<=1)return{k:'halloween',t:'🎃 Halloweenfeest in de Grote Zaal: dubbele Galjoenen bij mini-games!'};
 if(m==12&&dd>=10||m==1&&dd<=6)return{k:'kerst',t:'🎄 Het Kerstbal komt eraan: dubbele Galjoenen bij mini-games!'};
 if(m==12&&dd==5)return{k:'sint',t:'🎁 Pakjesavond! Tilly heeft iets in je schoen gestopt.'};
 if(m==4&&dd==27)return{k:'koning',t:'🧡 Fijne Koningsdag!'};
 if(m==2&&dd==14)return{k:'valentijn',t:'💌 Er hangt Amortentia in de lucht…'};
 if(m==1&&dd==1)return{k:'nieuwjaar',t:'🎆 Gelukkig nieuwjaar!'};
 if(m>=4&&m<=5)return{k:'zwerkbal',t:'🏆 Het Zwerkbaltoernooi is begonnen: dubbele Galjoenen bij Snaai vangen!'};return null}
const evtBonus=()=>{const f=feestdag();return f&&['halloween','kerst','zwerkbal'].includes(f.k)?2:1};
/* ---------- lagen in de DOM ---------- */
document.body.insertAdjacentHTML('afterbegin',`<div id="decor"><div class="laag bg"></div><div class="laag mid"></div><div class="stralen"></div><div class="mist"></div><div class="laag fg"></div></div><canvas id="amb"></canvas><div id="tint"></div><div id="vignet"></div><div id="flakker"></div>`);
const DECORS={
 zaal:{bg:'hal-zaal',plafond:1,mid:['kaarsen'],licht:'warm',stof:1},
 kaart:{bg:'perkament',mid:[],licht:'warm'},
 kerker:{bg:'decor-kerker',mid:['img:ketel-foto:ketel','img:flesjes-foto:fles'],licht:'groen',mist:1},
 kas:{bg:'kas-licht',mid:['img:venusvliegenval:plant1','img:alruinwortel:plant2'],licht:'dag',vuurvlieg:1,stralen:1},
 bieb:{bg:'decor-bibliotheek',mid:['img:decor-glas:raam'],licht:'warm',stralen:1,stof:1},
 gang:{bg:'decor-gang',mid:['kaarsen'],licht:'warm',stof:1},
 toren:{bg:'sterrenhemel',mid:['img:decor-telescoop:telescoop','img:decor-meer:horizon'],licht:'maan'},
 kamer:{bg:'decor-haard',mid:['kaarsen'],licht:'vuur'},
 bos:{bg:'decor-bos',mid:[],licht:'maan',mist:1,vuurvlieg:1},
 dorp:{bg:'kasteel',mid:['img:oude-boeken:boeken'],licht:'warm'},
};
const VIEWDECOR={home:'zaal',kaart:'kaart',drank:'kerker',herken:'kerker',memory:'kas',kas:'kas',spreuk:'bieb',mysterie:'bieb',lessen:'gang',les:'gang',groei:'toren',kamer:'kamer',dier:'kamer',verhaal:'bos',snaai:'toren',bertie:'dorp',toverstok:'bieb',winkel:'dorp',kikker:'dorp',album:'dorp',quests:'zaal',beker:'zaal',spel:'gang',brief:'kaart',sorteer:'zaal',maker:'kaart',login:'zaal'};
let huidigDecor='';let decorCfg={};
function zetDecor(k){if(k===huidigDecor)return;huidigDecor=k;const c=DECORS[k]||DECORS.zaal;decorCfg=c;const d=$('#decor');
 d.className='decor-'+k+' licht-'+c.licht+(c.mist?' metmist':'')+(c.stralen?' metstralen':'')+(c.plafond?' plafond':'');
 d.querySelector('.bg').style.backgroundImage=`url(img/${c.bg}.webp)`;
 d.querySelector('.mid').innerHTML=c.mid.map(m=>m=='kaarsen'?Array.from({length:7},(_,i)=>`<img class="zkaars" loading="lazy" src="img/kaars-foto.webp" style="left:${8+i*13}%;top:${6+(i%3)*7}%;animation-delay:-${i*0.7}s" alt="">`).join(''):`<img class="midobj ${m.split(':')[2]}" loading="lazy" src="img/${m.split(':')[1]}.webp" alt="">`).join('');
 d.querySelector('.fg').innerHTML=k=='kaart'?'':`<svg class="rankfg l" viewBox="0 0 120 400"><path d="M0 400C60 330 10 260 50 200S20 80 70 10" stroke="#3d6b2a" stroke-width="5" fill="none"/>${[340,270,200,130,60].map((y,i)=>`<path class="blad" style="animation-delay:${i*.8}s" d="M${40+(i%2)*15} ${y}q26 -10 36 -32q-30 6 -36 32" fill="#4f8a37"/>`).join('')}<circle cx="70" cy="12" r="8" fill="#e9a8c4"/><circle cx="48" cy="205" r="6" fill="#f3d6e4"/></svg><svg class="rankfg r" viewBox="0 0 120 400"><path d="M0 400C60 330 10 260 50 200S20 80 70 10" stroke="#3d6b2a" stroke-width="5" fill="none"/>${[320,240,160,90].map((y,i)=>`<path class="blad" style="animation-delay:${i*.6}s" d="M${42+(i%2)*12} ${y}q26 -10 36 -32q-30 6 -36 32" fill="#5a9a40"/>`).join('')}<circle cx="70" cy="12" r="7" fill="#f7e3a1"/></svg>`;
 if(k=='kamer'&&S.huis)d.querySelector('.bg').style.filter=`sepia(.3) hue-rotate(${{griffoendor:-10,huffelpuf:20,ravenklauw:180,zwadderich:90}[S.huis]}deg) saturate(1.1) brightness(.75)`;else d.querySelector('.bg').style.filter='';
 amb.room(k)}
function zetTijd(){const t=tijdSfeer();document.body.dataset.tijd=t;document.body.dataset.seizoen=seizoen();document.body.dataset.weer=weer.soort||'onbekend'}
/* ---------- parallax ---------- */
let px=0,py=0,tx=0,ty=0;
if(!RMX){addEventListener('mousemove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5});
 addEventListener('deviceorientation',e=>{if(e.gamma==null)return;tx=Math.max(-.5,Math.min(.5,e.gamma/40));ty=Math.max(-.5,Math.min(.5,(e.beta-40)/40))})}
/* ---------- ambient canvas: seizoen, weer, stof, vuurvliegjes ---------- */
const ac2=$('#amb'),g2=ac2.getContext('2d');let AW,AH;const rs2=()=>{AW=ac2.width=innerWidth;AH=ac2.height=innerHeight};rs2();addEventListener('resize',rs2);
let P=[];const MAXP=RMX?0:(innerWidth<700?55:110);
function spawn(){const z=seizoen(),w=weer.soort;let s=w=='regen'||w=='onweer'?'regen':w=='sneeuw'||z=='kerst'?'sneeuw':z=='herfst'?'blad':z=='lente'?'bloesem':null;const r=Math.random();
 if(decorCfg.vuurvlieg&&r<.35)return{t:'vuur',x:Math.random()*AW,y:AH*(.4+Math.random()*.6),vx:0,vy:0,a:Math.random()*6};
 if(decorCfg.stof&&r<.5)return{t:'stof',x:AW*(.2+Math.random()*.6),y:Math.random()*AH,vx:(Math.random()-.5)*.15,vy:-.05-Math.random()*.1,a:Math.random()*6};
 if(!s)return{t:'stof',x:Math.random()*AW,y:Math.random()*AH,vx:(Math.random()-.5)*.1,vy:-.05,a:Math.random()*6};
 const wind=(weer.wind||8)/15;
 if(s=='regen')return{t:s,x:Math.random()*AW*1.2,y:-20,vx:-wind*2,vy:9+Math.random()*6,a:0};
 if(s=='sneeuw')return{t:s,x:Math.random()*AW,y:-10,vx:wind*.5,vy:.6+Math.random()*.8,a:Math.random()*6,r:1+Math.random()*2.5};
 return{t:s,x:Math.random()*AW,y:-20,vx:wind*.8+Math.random()*.5,vy:.6+Math.random()*.7,a:Math.random()*6,r:5+Math.random()*5,k:s=='blad'?['#c4622d','#d9962b','#8f3b1b','#e0b04a'][Math.random()*4|0]:['#f7d6e4','#fbe8ef','#f2b8cf'][Math.random()*3|0]}}
let laatste=0,fpsLaag=0;
function ambLoop(t){const dt=t-laatste;laatste=t;if(dt>40)fpsLaag++;else fpsLaag=Math.max(0,fpsLaag-1);
 px+=(tx-px)*.06;py+=(ty-py)*.06;document.documentElement.style.setProperty('--px',px.toFixed(3));document.documentElement.style.setProperty('--py',py.toFixed(3));
 g2.clearRect(0,0,AW,AH);const doel=weer.soort=='regen'||weer.soort=='onweer'?Math.min(MAXP*2,40+weer.mm*60):MAXP;const lim=fpsLaag>20?doel/2:doel;
 while(P.length<lim)P.push(spawn());
 P.forEach(p=>{p.a+=.02;if(p.t=='regen'){g2.strokeStyle='rgba(200,215,255,.35)';g2.lineWidth=1;g2.beginPath();g2.moveTo(p.x,p.y);g2.lineTo(p.x+p.vx*2,p.y+p.vy*2);g2.stroke()}
  else if(p.t=='sneeuw'){p.x+=Math.sin(p.a)*.3;g2.fillStyle='rgba(255,255,255,.85)';g2.beginPath();g2.arc(p.x,p.y,p.r,0,6.28);g2.fill()}
  else if(p.t=='blad'||p.t=='bloesem'){p.x+=Math.sin(p.a)*.8;g2.save();g2.translate(p.x,p.y);g2.rotate(p.a);g2.fillStyle=p.k;g2.beginPath();g2.ellipse(0,0,p.r,p.r/2.2,0,0,6.28);g2.fill();g2.restore()}
  else if(p.t=='vuur'){p.vx+=(Math.random()-.5)*.08;p.vy+=(Math.random()-.5)*.08;p.vx*=.97;p.vy*=.97;const al=.4+.6*Math.abs(Math.sin(p.a*2));const gr=g2.createRadialGradient(p.x,p.y,0,p.x,p.y,8);gr.addColorStop(0,`rgba(230,255,140,${al})`);gr.addColorStop(1,'rgba(230,255,140,0)');g2.fillStyle=gr;g2.beginPath();g2.arc(p.x,p.y,8,0,6.28);g2.fill()}
  else{g2.fillStyle=`rgba(255,235,190,${.25+.25*Math.sin(p.a)})`;g2.beginPath();g2.arc(p.x,p.y,1.2,0,6.28);g2.fill()}
  p.x+=p.vx;p.y+=p.vy;if(p.y>AH+30||p.y<-40||p.x<-60||p.x>AW+60)p.dead=1;if(p.t=='stof'&&Math.random()<.002)p.dead=1});
 P=P.filter(p=>!p.dead);if(!RMX||P.length)requestAnimationFrame(ambLoop)}
requestAnimationFrame(ambLoop);
/* ---------- ruimtelijk geluid ---------- */
const amb=(()=>{let ctx,uit,rev,nodes=[],kamer='',vol=+(localStorage.getItem('zw_sfeer')??.5),tmr=[];
 const ok=()=>{if(ctx)return true;try{const c=fx.ctx();ctx=c.ac;uit=ctx.createGain();uit.gain.value=vol;rev=ctx.createConvolver();
  const len=ctx.sampleRate*2.8,ir=ctx.createBuffer(2,len,ctx.sampleRate);for(let ch=0;ch<2;ch++){const a=ir.getChannelData(ch);for(let i=0;i<len;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2)}rev.buffer=ir;
  const wet=ctx.createGain();wet.gain.value=.45;rev.connect(wet);wet.connect(uit);uit.connect(c.master);return true}catch(e){return false}};
 const ruisBuf=()=>{const n=ctx.sampleRate*2,b=ctx.createBuffer(1,n,ctx.sampleRate),a=b.getChannelData(0);let l=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;l=(l+.02*w)/1.02;a[i]=l*3.5}return b};
 const pan=(x,dest)=>{const p=ctx.createStereoPanner?ctx.createStereoPanner():ctx.createGain();if(p.pan)p.pan.value=x;p.connect(dest);return p};
 function stop(){nodes.forEach(n=>{try{n.stop?n.stop():n.disconnect()}catch(e){}});nodes=[];tmr.forEach(clearInterval);tmr=[]}
 function brom(fq,g,pn=0){const s=ctx.createBufferSource();s.buffer=ruisBuf();s.loop=true;const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=fq;const v=ctx.createGain();v.gain.value=g;s.connect(f);f.connect(v);v.connect(pan(pn,uit));v.connect(rev);s.start();nodes.push(s);return v}
 function knetter(){const t=ctx.currentTime;const o=ctx.createBufferSource();o.buffer=ruisBuf();const f=ctx.createBiquadFilter();f.type='highpass';f.frequency.value=1500+Math.random()*2500;const v=ctx.createGain();v.gain.setValueAtTime(.25*Math.random(),t);v.gain.exponentialRampToValueAtTime(.001,t+.04+Math.random()*.06);o.connect(f);f.connect(v);v.connect(pan(Math.random()*.6-.3,uit));o.start(t,Math.random());o.stop(t+.12)}
 function bubbel(){const t=ctx.currentTime,o=ctx.createOscillator(),v=ctx.createGain();o.frequency.setValueAtTime(200+Math.random()*300,t);o.frequency.exponentialRampToValueAtTime(600+Math.random()*500,t+.08);v.gain.setValueAtTime(.08,t);v.gain.exponentialRampToValueAtTime(.001,t+.12);o.connect(v);v.connect(pan(Math.random()-.5,uit));v.connect(rev);o.start(t);o.stop(t+.15)}
 function oehoe(){const t=ctx.currentTime,p=pan(Math.random()*1.6-.8,rev);[[0,.35],[.5,.9]].forEach(([d,l])=>{const o=ctx.createOscillator(),v=ctx.createGain();o.frequency.setValueAtTime(390,t+d);o.frequency.linearRampToValueAtTime(340,t+d+l);v.gain.setValueAtTime(0,t+d);v.gain.linearRampToValueAtTime(.05,t+d+.05);v.gain.linearRampToValueAtTime(0,t+d+l);o.connect(v);v.connect(p);o.start(t+d);o.stop(t+d+l+.05)})}
 function druppel(){const t=ctx.currentTime,o=ctx.createOscillator(),v=ctx.createGain();o.frequency.setValueAtTime(1800+Math.random()*1500,t);o.frequency.exponentialRampToValueAtTime(500,t+.05);v.gain.setValueAtTime(.04,t);v.gain.exponentialRampToValueAtTime(.001,t+.08);o.connect(v);v.connect(pan(Math.random()*2-1,uit));o.start(t);o.stop(t+.1)}
 function donder(){if(!ctx)return;const t=ctx.currentTime;const s=ctx.createBufferSource();s.buffer=ruisBuf();const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=180;const v=ctx.createGain();v.gain.setValueAtTime(0,t);v.gain.linearRampToValueAtTime(.7,t+.15);v.gain.exponentialRampToValueAtTime(.001,t+3.5);s.connect(f);f.connect(v);v.connect(uit);v.connect(rev);s.start(t);s.stop(t+3.6)}
 function bouw(){if(!ctx)return;stop();const k=kamer;
  if(['zaal','gang','kamer','dorp','kaart'].includes(k)){brom(400,.05);tmr.push(setInterval(()=>Math.random()<.6&&knetter(),110))}
  if(k=='kerker'){brom(250,.06);tmr.push(setInterval(()=>Math.random()<.5&&bubbel(),180))}
  if(k=='kas'){brom(900,.03);tmr.push(setInterval(()=>Math.random()<.3&&druppel(),400))}
  if(k=='bos'||k=='toren'){brom(600,.04,-.3);tmr.push(setInterval(()=>Math.random()<.25&&oehoe(),6000))}
  if(k=='bieb')brom(300,.035);
  if(weer.soort=='regen'||weer.soort=='onweer'){brom(2500,Math.min(.18,.04+weer.mm*.05),.2);tmr.push(setInterval(()=>Math.random()<.7&&druppel(),120))}
  if(tijdSfeer()=='nacht'&&k!='bos')tmr.push(setInterval(()=>Math.random()<.15&&oehoe(),9000))}
 return{room(k){kamer=k;if(window.MUZIEK_UIT)return;bouw()},start(){if(!window.MUZIEK_UIT&&ok())bouw()},donder,vol(v){vol=v;localStorage.setItem('zw_sfeer',v);if(uit)uit.gain.value=v},get v(){return vol},herbouw:()=>{if(!window.MUZIEK_UIT)bouw()}}})();
addEventListener('pointerdown',()=>amb.start(),{once:true});
$('#geluid').insertAdjacentHTML('beforeend','<div class="grij"><label for="sfeer">Sfeer</label><span hidden><svg class="icn" viewBox="0 0 24 24" style="width:20px;height:20px;fill:none;stroke:#efd27a;stroke-width:1.6"><path d="M12 3c1 4 5 6 5 11a5 5 0 01-10 0c0-3 2-4 2-7 1 1 2 2 3 4 0-3 0-5 0-8z"/></svg></span><input id="sfeer" type="range" min="0" max="1" step="0.05"></div><div class="grij"><label for="stemv">Stem</label><input id="stemv" type="range" min="0" max="1" step="0.05"></div>');$('#stemv').value=localStorage.getItem('zw_stem')??1;$('#stemv').oninput=e=>localStorage.setItem('zw_stem',e.target.value);
$('#sfeer').value=amb.v;$('#sfeer').oninput=e=>amb.vol(+e.target.value);
/* ---------- live weer Open-Meteo (Wulpstraat 15, Enschede) ---------- */
const weer={soort:'',mm:0,wind:0,code:-1,tekst:'',ok:false};
const WCODE=c=>c==0?['helder','☀️','helder']:c<=2?['licht','⛅','licht bewolkt']:c==3?['bewolkt','☁️','bewolkt']:c<=48?['mist','🌫️','mistig']:c<=57?['regen','🌦️','motregen']:c<=67?['regen','🌧️','regen']:c<=77?['sneeuw','❄️','sneeuw']:c<=82?['regen','🌧️','regenbuien']:c<=86?['sneeuw','🌨️','sneeuwbuien']:['onweer','⛈️','onweer'];
async function haalWeer(){try{const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.2364&longitude=6.8947&current=weather_code,precipitation,rain,snowfall,cloud_cover,wind_speed_10m,is_day&timezone=Europe%2FAmsterdam',{cache:'no-store'});const j=await r.json();const c=j.current;const w=WCODE(c.weather_code);
 Object.assign(weer,{soort:w[0],ico:w[1],tekst:w[2],mm:c.precipitation||c.rain||0,wind:c.wind_speed_10m||0,wolk:c.cloud_cover,dag:c.is_day,code:c.weather_code,ok:true});localStorage.setItem('zw_weer',JSON.stringify({...weer,t:Date.now()}))}
 catch(e){const o=JSON.parse(localStorage.getItem('zw_weer')||'null');if(o&&Date.now()-o.t<3*36e5)Object.assign(weer,o);else weer.ok=false}
 toonWeer();zetTijd();amb.herbouw()}
function toonWeer(){let e=$('#weer');if(!e){$('#stats').insertAdjacentHTML('beforeend','<span id="weer"></span>');e=$('#weer')}
 e.innerHTML=weer.ok?`<span title="Live weer in Enschede · bron: Open-Meteo.com">${weer.ico} ${weer.tekst}</span>`:`<span title="Geen live weer: seizoenssfeer">🍂</span>`;
 document.documentElement.style.setProperty('--wind',Math.min(1,(weer.wind||0)/40).toFixed(2));document.documentElement.style.setProperty('--wolk',weer.ok?(weer.wolk||0)/100:0)}
function weerZin(){if(!weer.ok)return'';const z={regen:'Het regent ook in Enschede – heerlijk om binnen in de kas te blijven en de druppels op het glas te horen.',onweer:'Er rommelt onweer boven Enschede! Blijf lekker binnen, het kasteel is stevig.',sneeuw:'Het sneeuwt in Enschede! De kas is gelukkig lekker warm.',helder:weer.dag?'De zon schijnt in Enschede; zelfs de Mandragora’s draaien hun blaadjes ernaartoe.':'Een heldere nacht boven Enschede – perfect voor de Astronomietoren.',bewolkt:'Grijs boven Enschede, maar hier branden de kaarsen.',mist:'Mist in Enschede… zoals in het Verboden Bos. Spannend!',licht:'Een paar wolkjes boven Enschede, verder prima toverweer.'};return z[weer.soort]||''}
setInterval(()=>{if(weer.soort=='onweer'&&!RMX&&Math.random()<.25){const f=document.createElement('div');f.className='bliksem';document.body.appendChild(f);setTimeout(()=>f.remove(),900);setTimeout(()=>amb.donder(),700+Math.random()*1500)}},5000);
/* ---------- combo & beloon-wrapper ---------- */
const _beloon=beloon;
beloon=function(id,pt,gal,tekst){const m=1+Math.min(2,Math.floor(S.combo/3))*.5;tel('opgelost');S.kist=(S.kist||0)+1;
 const r=_beloon(id,Math.round(pt*m),Math.round(gal*m),(m>1?`<b>Combo ×${m}!</b> `:'')+(tekst||''));kistCheck();questCheck();return r};
const _goed=fx.goed,_fout=fx.fout;fx.goed=()=>{S.combo++;_goed();comboToon()};fx.fout=()=>{S.combo=0;_fout();comboToon()};
function comboToon(){let e=$('#combo');if(!e){document.body.insertAdjacentHTML('beforeend','<div id="combo"></div>');e=$('#combo')}if(S.combo<2){e.classList.remove('zien');return}e.textContent='🔥 '+S.combo+' op rij'+(S.combo>=3?' · ×'+(1+Math.min(2,Math.floor(S.combo/3))*.5):'');e.classList.remove('pop');void e.offsetWidth;e.classList.add('zien','pop')}
/* beloningskist: altijd bijna vol (start op 2/5) */
function kistCheck(){if(S.kist>=5){S.kist=2;S.kikkersTegoed=(S.kikkersTegoed||0)+1;bewaar();setTimeout(()=>toast('🎁 Beloningskist vol! Gratis Chocokikker in Zweinsveld.'),2600)}}
const kistMeter=()=>`<div class="kaart kist"><b>🎁 Beloningskist</b> <small>nog ${5-S.kist} puzzel${5-S.kist==1?'':'s'} tot een gratis Chocokikker</small><div class="balk"><div style="width:${S.kist/5*100}%"></div></div></div>`;
/* ---------- quests ---------- */
const QPOOL=[['opgelost',2,'Los 2 puzzels of lessen op',20],['kikker',1,'Open een Chocokikker',15],['dier',1,'Verzorg je huisdier',10],['mini',2,'Speel 2 mini-games',15],['les',1,'Volg een les',15],['kas',1,'Bezoek de Magische Kas',5]];
function dagQuests(){const n=+vandaag().replace(/-/g,'');return[0,1,2].map(i=>QPOOL[(n+i*2)%QPOOL.length])}
const WEEKQ=[['opgelost',12,'Los deze week 12 puzzels of lessen op',80],['mini',8,'Speel deze week 8 mini-games',60]];
function questCheck(){const qs=[...dagQuests().map(q=>[q,vandaag()]),...WEEKQ.map(q=>[q,'w'+weekNr()])];qs.forEach(([q,d])=>{const k=d+q[0];if(!S.questKlaar[k]&&telV(q[0],d[0]=='w')>=q[1]){S.questKlaar[k]=1;S.galjoenen+=q[3];bewaar();stats();setTimeout(()=>{toast('✅ Quest voltooid: '+q[2]+' (+'+q[3]+' 🪙)');fx.speel('munt');vib(40)},3200)}})}
V.quests=()=>{const qr=(q,w)=>{const v=Math.min(q[1],telV(q[0],w));return `<div class="quest ${v>=q[1]?'klaar':''}"><span>${v>=q[1]?'✅':'🔸'} ${q[2]}</span><small>🪙 ${q[3]}</small><div class="balk"><div style="width:${v/q[1]*100}%"></div></div><small>${v}/${q[1]}</small></div>`};
 app(`<h1>📋 Opdrachten</h1>${tilly('Elke dag drie nieuwe opdrachten. Zullen we ze samen afvinken?')}<div class="kaart"><h3>Vandaag</h3>${dagQuests().map(q=>qr(q,0)).join('')}</div><div class="kaart"><h3>Deze week</h3>${WEEKQ.map(q=>qr(q,1)).join('')}</div>`)};
/* ---------- afdelingsbeker ---------- */
V.beker=()=>{const dagen=Math.max(1,(Date.now()-new Date(S.start).getTime())/864e5+1);const seed=k=>[...k].reduce((a,c)=>a+c.charCodeAt(0),0);
 const rij=Object.keys(HUIZEN).map(k=>({k,p:k==S.huis?S.punten:Math.round(dagen*(28+seed(k)%17)+Math.sin(dagen+seed(k))*20+S.punten*.75)})).sort((a,b)=>b.p-a.p);const max=rij[0].p||1;
 app(`<h1>🏆 Afdelingsbeker</h1>${tilly(rij[0].k==S.huis?'Jouw afdeling staat bovenaan! Professor Perkamentus knikt goedkeurend.':'Nog '+(rij[0].p-S.punten+1)+' punten om '+HUIZEN[rij[0].k].n+' in te halen. Dat lukt jou wel!')}<div class="kaart">${rij.map((r,i)=>`<div class="beker ${r.k==S.huis?'mijn':''}">${schild(r.k,40)}<b>${i+1}. ${HUIZEN[r.k].n}</b><div class="balk"><div style="width:${r.p/max*100}%;background:${HUIZEN[r.k].k1}"></div></div><span>${r.p}</span></div>`).join('')}</div><p><small>De andere afdelingen worden door het kasteel zelf gesimuleerd.</small></p>`)};
/* ---------- dagelijkse login-kalender + Tijdverdrijver ---------- */
const LOGIN=[['🪙 10',{g:10}],['🪙 15',{g:15}],['🪙 20',{g:20}],['🐸 Chocokikker',{k:1}],['🪙 30',{g:30}],['🪙 40',{g:40}],['⏳ Tijdverdrijver + 🪙 50',{g:50,t:1}]];
function loginCheck(){const L=S.login;if(L.laatst===vandaag()||window._loginGepland===vandaag())return;window._loginGepland=vandaag();
 if(L.laatst&&L.laatst!==gisteren()){const gemist=Math.round((new Date(vandaag())-new Date(L.laatst))/864e5)-1;
  if(gemist==1&&S.tijdverdrijver>0){S.tijdverdrijver--;toast('⏳ Je Tijdverdrijver draaide de tijd terug: je reeks is bewaard!');if(S.dagKlaar===ymd(new Date(Date.now()-2*864e5)))S.dagKlaar=gisteren()}else{L.dag=0}}
 setTimeout(()=>V.login(),RMX?200:1400)}
V.login=()=>{const L=S.login;const geclaimd=L.laatst===vandaag();const d=geclaimd?(L.dag+6)%7:L.dag%7;
 if(document.querySelector('.modal[data-pop=login]'))return;const o=document.createElement('div');o.className='modal';o.dataset.pop='login';o.innerHTML=`<div class="perkament modalin"><h2>📅 Dagelijkse beloning</h2><p>${groet()}, ${aanspreek()}! Kom elke dag terug voor een grotere beloning.</p><div class="kalender">${LOGIN.map((x,i)=>`<div class="kdag ${i<d||geclaimd&&i==d?'gehad':''} ${i==d&&!geclaimd?'nu':''}"><small>Dag ${i+1}</small><b>${x[0]}</b></div>`).join('')}</div><p><small>⏳ Tijdverdrijvers: ${S.tijdverdrijver} – bewaart je reeks als je één dag mist.</small></p><button class="knop" id="claim">${geclaimd?'Sluiten':'Ophalen!'}</button></div>`;document.body.appendChild(o);
 o.querySelector('#claim').onclick=()=>{try{if(!geclaimd&&L.laatst!==vandaag()){const b=LOGIN[d][1];S.galjoenen+=b.g||0;if(b.k)S.kikkersTegoed=(S.kikkersTegoed||0)+1;if(b.t)S.tijdverdrijver++;L.dag=d+1;L.laatst=vandaag();bewaar()}}catch(x){console.warn(x)}try{stats();fx.speel('munt');fx.goed();vib([30,30,60])}catch(x){}popupSluit?popupSluit(o):o.remove()}};
/* ---------- Chocokikkerkaarten ---------- */
const KAARTEN=[['Albus Perkamentus','L','Schoolhoofd van Zweinstein, versloeg Grindelwald in 1945 en ontdekte de twaalf toepassingen van drakenbloed. Houdt van kamermuziek en tienpinbowlen.'],['Merlijn','L','De beroemdste tovenaar aller tijden, in zijn tijd een leerling van Zwadderich.'],['Goderic Griffoendor','L','Stichter van Griffoendor, bekend om zijn moed en zijn zwaard.'],['Helga Huffelpuf','L','Stichter van Huffelpuf, die iedere leerling met open armen ontving.'],['Rowena Ravenklauw','L','Stichter van Ravenklauw; “Een ongeëvenaard verstand is de mens zijn grootste schat.”'],['Zalazar Zwadderich','L','Stichter van Zwadderich en Sisseltong; liet de Geheime Kamer achter.'],
['Nicolaas Flamel','Z','Alchemist en maker van de Steen der Wijzen; werd meer dan zeshonderd jaar oud.'],['Minerva Anderling','Z','Adjunct-schoolhoofd en geregistreerd Animagus (een cyperse kat).'],['Severus Sneep','Z','Meester in Toverdranken en de Occlumentie. Altijd.'],['Pomona Stronk','Z','Professor Kruidenkunde en hoofd van Huffelpuf; kweekt de beste Mandragora’s.'],['Filius Banning','Z','Professor Bezweringen, voormalig kampioen duelleren.'],['Morgana','Z','Machtige middeleeuwse tovenares en tegenspeelster van Merlijn.'],['Paracelsus','Z','Beroemde alchemist en geneesheer; zijn borstbeeld staat op Zweinstein.'],
['Hildebrand Slakhoorn','G','Professor Toverdranken die graag talentvolle leerlingen verzamelt.'],['Rubeus Hagrid','G','Hoeder van de Sleutels en Terreinen, dol op gevaarlijke beesten.'],['Remus Lupos','G','Vriendelijke leraar Verweer tegen de Zwarte Kunsten en een van de Sluipers.'],['Hermelien Griffel','G','De slimste heks van haar jaar, met een Tijdverdrijver in haar derde jaar.'],['Loena Leeflang','G','Ravenklauwer die gelooft in Snorkackers en altijd haar eigen pad loopt.'],['Marcel Lubbermans','G','Werd later professor Kruidenkunde; trok het zwaard van Griffoendor uit de Sorteerhoed.'],['Poppy Plijster','G','Verpleegster van Zweinstein; Peperdrankje en Bottengroei staan altijd klaar.'],['Newt Scamander','G','Magizoöloog en schrijver van Fabeldieren en Waar Ze te Vinden.'],['Gladianus Smalhart','G','Schrijver van veel boeken en winnaar van de Charmantste Glimlach-prijs. Vergeetachtig.'],['Bathilda Belladonna','G','Historica en schrijfster van Geschiedenis der Toverkunst.'],['Cornelis Droebel','G','Minister van Toverkunst die liever niet wilde zien wat er gebeurde.']];
const RAR={L:['Legendarisch','#e8c35a',.08],Z:['Zeldzaam','#9fb8ff',.27],G:['Gewoon','#d9c9a3',1]};
function trekKaart(){const r=Math.random();const zr=r<RAR.L[2]?'L':r<RAR.Z[2]?'Z':'G';const pool=KAARTEN.filter(k=>k[1]==zr);return pool[Math.random()*pool.length|0]}
V.kikker=()=>{const prijs=15,tegoed=S.kikkersTegoed||0;
 app(`<h1>🐸 Chocokikkers</h1>${tilly('Pas op: ze springen echt weg! Maar de kaart blijft gelukkig liggen.')}<div class="kikkerdoos" id="doos"><div class="doos">🟪<span>Choco<br>kikker</span></div></div><p style="text-align:center">${tegoed?`<button class="knop" id="open">Gratis openen (${tegoed})</button>`:''}<button class="knop" id="koop" ${S.galjoenen<prijs?'disabled':''}>Kopen en openen 🪙 ${prijs}</button><button class="knop" onclick="ga('album')">📖 Album (${Object.keys(S.kaarten).length}/${KAARTEN.length})</button></p><div id="kres"></div>`);
 const open=gratis=>{if(gratis)S.kikkersTegoed--;else S.galjoenen-=prijs;tel('kikker');const k=trekKaart();const nieuw=!S.kaarten[k[0]];S.kaarten[k[0]]=(S.kaarten[k[0]]||0)+1;if(!nieuw)S.galjoenen+=5;bewaar();stats();questCheck();
  const d=$('#doos');d.classList.add('schudt');fx.speel('kras');vib([20,30,20,30,20]);
  setTimeout(()=>{d.classList.remove('schudt');d.innerHTML='<div class="kikkerweg">🐸</div>';fx.speel('whoosh');},RMX?50:900);
  setTimeout(()=>{const r=RAR[k[1]];$('#kres').innerHTML=`<div class="kkaart r${k[1]}"><div class="kbin"><div class="kvoor" style="border-color:${r.join?'':r[1]}"><div class="kfoto">${k[0].split(' ').map(w=>w[0]).join('')}</div><h3>${k[0]}</h3><small class="rar" style="color:${r[1]}">${r[0]}</small><p>${k[2]}</p></div><div class="kachter">🐸</div></div></div><p style="text-align:center">${nieuw?'✨ Nieuw in je album!':'Dubbel – ingeruild voor 5 Galjoenen'}</p>`;
   fx.speel(k[1]=='L'?'fanfare':'goed');if(k[1]!='G')fx.goed();vib(k[1]=='L'?[60,40,60,40,200]:40);
   $('#kres .kkaart').addEventListener('pointermove',e=>{const b=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--hx',((e.clientX-b.left)/b.width*100)+'%');e.currentTarget.style.setProperty('--hy',((e.clientY-b.top)/b.height*100)+'%')});
   setTimeout(()=>V.kikker&&$('#doos')&&($('#doos').innerHTML='<div class="doos">🟪<span>Choco<br>kikker</span></div>'),1200)},RMX?100:1700)};
 $('#open')&&($('#open').onclick=()=>open(true));$('#koop').onclick=()=>open(false)};
V.album=()=>{app(`<h1>📖 Kaartenalbum</h1><p>${Object.keys(S.kaarten).length} van ${KAARTEN.length} kaarten verzameld.</p><div class="album">${KAARTEN.map(k=>{const h=S.kaarten[k[0]];const r=RAR[k[1]];return `<div class="akaart ${h?'heb r'+k[1]:''}" title="${h?k[2].replace(/"/g,''):'Nog niet gevonden'}"><div class="kfoto">${h?k[0].split(' ').map(w=>w[0]).join(''):'?'}</div><b>${h?k[0]:'???'}</b><small style="color:${r[1]}">${r[0]}${h>1?' ×'+h:''}</small></div>`}).join('')}</div><button class="knop" onclick="ga('kikker')">🐸 Meer kikkers</button>`)};
/* ---------- verhaal: wekelijks hoofdstuk ---------- */
const VERHAAL=[['De fluisterende kas','Op je eerste avond hoor je iets fluisteren tussen de varens in kas zeven – een kas die volgens professor Stronk al jaren op slot zit. Op de deur zit een vers bloemblaadje van een plant die niet zou mogen bestaan…','Wie heeft er een sleutel?'],['Het herbarium van Lindaroos','In de bibliotheek vind je een oud herbarium met de initialen B.L. Eén pagina is eruit gescheurd; alleen een gedroogde ranken-krul is achtergebleven. Madame Rommella zegt dat het boek “niet uitgeleend kan worden, want het bestaat niet”.','Waarom liegt de bibliothecaresse?'],['Voetstappen in de dauw','Bij zonsopgang zie je kleine voetstappen in de dauw van de moestuin. Ze leiden naar de Beukwilg… en houden daar plotseling op.','Wie loopt er ’s nachts rond?'],['De brief zonder afzender','Een sneeuwwitte uil laat een envelop vallen met slechts één zin: “Wat bloeit bij maanlicht, verwelkt bij leugens.”','Is dit een waarschuwing of een uitnodiging?'],['Mist in het Verboden Bos','Hagrid vertelt dat er in het Bos een lichtje is gezien, laag bij de grond, dat “zingt als een kristallen bel”. Hij kijkt je ernstig aan: “Ga d’r niet alleen heen.”','Natuurlijk ga je toch…'],['De Maanbloem','Tussen de varens staat een plant met zilveren blaadjes die opengaan wanneer jij dichterbij komt. In haar kelk ligt een klein messing sleuteltje met een gegraveerde B.','Past het op kas zeven?'],['Kas zeven','De deur zwaait open. Binnen groeit een complete tuin uit een andere eeuw, rococo-krullen in het smeedijzer, en midden in de kas zit iemand met zijn rug naar je toe…','Wie is het?'],['De verborgen hovenier','Het is het portret van een hovenier dat weggelopen is uit zijn lijst om zijn tuin te verzorgen. “Eindelijk iemand met groene vingers,” zegt hij. “Wil jij hem van mij overnemen?” Je kas krijgt er een geheime vleugel bij – en het mysterie van B.L. begint pas…','Wordt vervolgd in het volgende seizoen…']];
V.verhaal=()=>{const open=Math.min(VERHAAL.length,weekNr()+1);const vlgd=new Date(new Date(S.start).getTime()+open*6048e5).toLocaleDateString('nl-NL',{weekday:'long',day:'numeric',month:'long'});
 app(`<h1>📖 Het Mysterie van Kas Zeven</h1>${tilly('Elke week een nieuw hoofdstuk. Ik kan bijna niet wachten!')}${VERHAAL.slice(0,open).map((h,i)=>`<details class="kaart hfd" ${i==open-1?'open':''}><summary><b>Hoofdstuk ${i+1}: ${h[0]}</b></summary><p>${h[1]}</p><p class="cliff"><i>${h[2]}</i></p></details>`).join('')}${open<VERHAAL.length?`<div class="kaart slot">🔒 Hoofdstuk ${open+1} opent op ${vlgd}.</div>`:''}`);
 if(!S.opgelost['verhaal'+open]){S.opgelost['verhaal'+open]=1;S.galjoenen+=10;bewaar();stats()}};
/* ---------- kaart van Zweinstein (Sluipwegwijzer) ---------- */
const LOC=[['Grote Zaal','home',0,50,20,'🕯️'],['Kerkers','drank',0,25,68,'⚗️'],['Kassen','kas',0,82,62,'🌸'],['Bibliotheek','spreuk',30,30,38,'📚'],['Klaslokalen','lessen',0,62,40,'📜'],['Slaapzaal','kamer',0,70,22,'🛏️'],['Zweinsveld','kikker',20,88,88,'🐸'],['Uilenvleugel','verhaal',0,14,22,'🦉'],['Zwerkbalveld','snaai',40,12,86,'🏟️'],['Astronomietoren','groei',60,46,8,'🔭'],['Verboden Bos','toverstok',90,50,90,'🌲'],['Mini-games','bertie',0,40,60,'🫘']];
V.kaart=()=>{const open=sessionStorage.zw_kaart;
 if(!open){app(`<div class="sluip perkament" id="sluip"><h2>Sluipwegwijzer</h2><p class="eed">Tik op het perkament met je toverstok en spreek:</p><button class="knop" id="zweer">“Ik zweer plechtig dat ik snode plannen heb.”</button></div>`);$('#zweer').onclick=()=>{fx.speel('kras');sessionStorage.zw_kaart=1;$('#sluip').classList.add('inkt');setTimeout(V.kaart,RMX?0:700)};return}
 app(`<div class="sluip perkament open"><h2>Messrs. Maanling, Wormstaart, Sluipvoet & Gaffel<br><small>presenteren met trots</small><br>De Sluipwegwijzer</h2><div class="kaartvlak">${LOC.map(l=>{const ok=S.xp>=l[2];return `<button class="loc ${ok?'':'dicht'}" style="left:${l[3]}%;top:${l[4]}%" ${ok?`onclick="ga('${l[1]}')"`:''}><span>${ok?l[5]:'🔒'}</span><small>${l[0]}${ok?'':' ('+l[2]+' XP)'}</small></button>`}).join('')}<div class="voetjes" style="--x1:20%;--y1:30%;--x2:70%;--y2:70%"><span>👣</span></div><div class="voetjes v2" style="--x1:80%;--y1:20%;--x2:30%;--y2:80%"><span>👣</span><em>${aanspreek()}</em></div></div><button class="knop" onclick="delete sessionStorage.zw_kaart;fx.speel('whoosh');ga('kaart')">“Snode plannen uitgevoerd!”</button></div>${kistMeter()}`)};
/* ---------- eigen kamer + huisdier ---------- */
const DECO=[['🪴','Varen in pot',20],['🕯️','Kandelaar',15],['📚','Stapel toverboeken',25],['🌹','Vaas rozen',30],['🔮','Kristallen bol',45],['🖼️','Rococo-spiegel',60],['🧸','Teddybeer',20],['🌙','Maanlamp',40],['🎻','Viool',50],['🦢','Zwanenveer-pen',15],['🧺','Picknickmand',25],['🌿','Hangende klimop',30]];
const DIEREN={uil:['🦉','Uil'],kat:['🐈','Kat'],pad:['🐸','Pad']};
const fase=g=>g<5?'baby':g<15?'jong':'volwassen';
V.kamer=()=>{const d=S.dier;const huis=HUIZEN[S.huis];
 app(`<h1>🛏️ ${huis.n}-slaapzaal</h1>${tilly('Een kamer is pas af met planten. En met een huisdier om tegen te praten.')}
 <div class="kamer huis-${S.huis}"><div class="bed">🛏️</div>${S.kamer.map((k,i)=>`<span class="deco" style="left:${(i*37)%86+4}%;top:${20+((i*23)%55)}%">${k}</span>`).join('')}${d?`<div class="dier ${fase(d.g)}" id="dier">${d.s=='uil'?'<img src="img/sneeuwuil.webp" alt="">':DIEREN[d.s][0]}</div>`:''}</div>
 ${d?`<div class="kaart"><b>${DIEREN[d.s][0]} ${d.n}</b> – ${fase(d.g)} <small>(groei ${d.g})</small><div class="balk"><div style="width:${Math.min(100,(d.g%5)/5*100+8)}%"></div></div><button class="knop" id="voer" ${d.v==vandaag()?'disabled':''}>🍖 Voeren ${d.v==vandaag()?'(morgen weer)':''}</button><button class="knop" id="aai">💛 Aaien</button></div>`:
 `<div class="kaart"><h3>Kies je huisdier</h3><p>Volgens de toelatingsbrief mag je een uil, een kat óf een pad meenemen.</p>${Object.entries(DIEREN).map(([k,v])=>`<button class="knop" onclick="kiesDier('${k}')">${v[0]} ${v[1]}</button>`).join('')}</div>`}
 <div class="kaart"><h3>Inrichten</h3><div class="raster">${DECO.map(x=>`<div class="tegel"><div class="ico">${x[0]}</div>${x[1]}<br><button class="knop" ${S.galjoenen<x[2]?'disabled':''} onclick="koopDeco('${x[0]}',${x[2]})">🪙 ${x[2]}</button></div>`).join('')}</div></div>`);
 if(d){$('#voer').onclick=()=>{d.v=vandaag();d.g+=1;tel('dier');bewaar();questCheck();fx.speel('munt');vib(30);V.kamer();$('#dier').classList.add('blij')};$('#aai').onclick=()=>{fx.speel('goed');vib(15);const e=$('#dier');e.classList.remove('blij');void e.offsetWidth;e.classList.add('blij');fx.goed&&0}}};
window.kiesDier=s=>{const n=prompt('Hoe heet je '+DIEREN[s][1].toLowerCase()+'?',s=='uil'?'Sneeuwvlok':s=='kat'?'Saffier':'Mos');if(!n)return;S.dier={s,n,g:0,v:''};bewaar();fx.goed();V.kamer()};
window.koopDeco=(e,p)=>{if(S.galjoenen<p)return;S.galjoenen-=p;S.kamer.push(e);bewaar();stats();fx.speel('munt');vib(30);V.kamer()};
/* ---------- mini-games ---------- */
V.bertie=()=>{app(`<h1>🎮 Mini-games</h1>${tilly('Even iets snels tussendoor? Ik daag je uit!')}<div class="raster"><div class="tegel" onclick="ga('snaai')"><div class="ico">🟡</div><b>Snaai vangen</b><br><small>20 seconden tikken</small></div><div class="tegel" onclick="V.bonen()"><div class="ico">🫘</div><b>Smakkerbonen</b><br><small>Bertie Botts – elke smaak!</small></div><div class="tegel" onclick="ga('toverstok')"><div class="ico">🪄</div><b>Toverstokbewegingen</b><br><small>Teken de spreuk</small></div><div class="tegel" onclick="ga('quests')"><div class="ico">📋</div><b>Opdrachten</b></div><div class="tegel" onclick="ga('beker')"><div class="ico">🏆</div><b>Afdelingsbeker</b></div><div class="tegel" onclick="ga('verhaal')"><div class="ico">📖</div><b>Verhaal</b></div></div>`)};
V.snaai=()=>{app(`<h1>🟡 Snaai vangen</h1><p>Tik de Gouden Snaai zo vaak mogelijk in 20 seconden. <b id="sc">0</b> gevangen · <b id="tl">20</b>s</p><div id="veld" class="veld"><div id="snaai" class="snaaiel">🟡<i></i><i></i></div></div><button class="knop" id="go">Start!</button>`);
 let sc=0,tl=20,run=false,x=50,y=50,vx=1.2,vy=.9,raf,tm;const s=$('#snaai'),veld=$('#veld');
 const stap=()=>{if(!run)return;const sp=1+sc*.08;x+=vx*sp;y+=vy*sp;if(Math.random()<.03){vx=(Math.random()-.5)*3;vy=(Math.random()-.5)*3}if(x<3||x>92)vx*=-1;if(y<5||y>85)vy*=-1;x=Math.max(3,Math.min(92,x));y=Math.max(5,Math.min(85,y));s.style.transform=`translate(${x/100*veld.clientWidth}px,${y/100*veld.clientHeight}px)`;raf=requestAnimationFrame(stap)};
 s.onpointerdown=e=>{if(!run)return;e.stopPropagation();sc++;$('#sc').textContent=sc;fx.speel('munt');vib(20);s.classList.remove('pak');void s.offsetWidth;s.classList.add('pak');vx=(Math.random()-.5)*4;vy=(Math.random()-.5)*4};
 veld.onpointerdown=()=>{if(run){fx.speel('klik')}};
 $('#go').onclick=()=>{if(run)return;run=true;sc=0;tl=20;$('#go').disabled=true;stap();tm=setInterval(()=>{if(!$('#tl')){clearInterval(tm);run=false;cancelAnimationFrame(raf);return}tl--;$('#tl').textContent=tl;if(tl<=0){clearInterval(tm);run=false;cancelAnimationFrame(raf);tel('mini');const g=Math.round(sc*2*evtBonus());S.galjoenen+=g;S.xp+=sc;bewaar();stats();questCheck();$('#app').insertAdjacentHTML('beforeend',tilly(`${sc} keer gevangen! Dat levert ${g} Galjoenen op${evtBonus()>1?' (evenementbonus!)':''}. ${sc>=15?'Je bent een geboren Zoeker.':'Volgende keer nog sneller!'}`));fx.goed();$('#go').disabled=false}},1000)};
 addEventListener('hashchange',()=>{run=false},{once:true})};
const BONEN=[['aardbei',1],['karamel',1],['toffee',1],['kaneel',1],['honing',1],['marshmallow',1],['oorsmeer',0],['spruitjes',0],['zeep',0],['aardworm',0],['vuil sokje',0],['peper',0],['gras',0],['kokos',1]];
V.bonen=()=>{const b=S.bertie;if(b.d!==vandaag()){b.d=vandaag();b.n=0}const rest=3-b.n;
 app(`<h1>🫘 Bertie Botts Smakkerbonen</h1><p>“Elke smaak!” – en dat bedoelen ze letterlijk. Kies een boon. Lekker = Galjoenen, vies = gelach. Nog <b>${rest}</b> bonen vandaag.</p><div class="bonen">${Array.from({length:8},(_,i)=>`<button class="boon" data-i="${i}" style="--h:${i*45}deg" ${rest<=0?'disabled':''}></button>`).join('')}</div><div id="br"></div>`);
 document.querySelectorAll('.boon').forEach(e=>e.onclick=()=>{if(b.n>=3)return;b.n++;tel('mini');const s=BONEN[Math.random()*BONEN.length|0];e.classList.add('gegeten');
  if(s[1]){const g=8*evtBonus();S.galjoenen+=g;fx.goed();fx.speel('munt');vib(40);$('#br').innerHTML=tilly(`Mmm, <b>${s[0]}</b>! +${g} Galjoenen.`)}else{fx.fout();$('#br').innerHTML=tilly(`Bah, <b>${s[0]}</b>! Perkamentus had ooit oorsmeer… je bent in goed gezelschap.`)}
  bewaar();stats();questCheck();document.querySelectorAll('.boon').forEach(x=>x.disabled=b.n>=3)})};
const GEBAAR=[['Lumos','cirkel','Teken een cirkel – het licht dat rond de punt opgloeit.'],['Wingardium Leviosa','v','“Zwaaien en tikken!”: een V-vorm, omlaag en weer omhoog.'],['Expelliarmus','streep','Een snelle rechte haal, zoals een duelleur.'],['Paralitis','zigzag','Een bliksemsnelle zigzag.'],['Reparo','zigzag','Heen-en-weer, alsof je de stukjes terugveegt.'],['Accio','streep','Een rechte lijn naar je toe.']];
function herken(pts){if(pts.length<8)return'';const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);const w=Math.max(...xs)-Math.min(...xs),h=Math.max(...ys)-Math.min(...ys),diag=Math.hypot(w,h);
 const eind=Math.hypot(pts[0][0]-pts.at(-1)[0],pts[0][1]-pts.at(-1)[1]);let len=0,wissel=0,vorige=0;
 for(let i=1;i<pts.length;i++){len+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1])}
 const hoofd=w>=h?1:0;let wx=0,vx2=0;for(let i=4;i<pts.length;i+=4){const dx=pts[i][0]-pts[i-4][0],dy=pts[i][1]-pts[i-4][1];const s=Math.sign(hoofd?dy:dx),s2=Math.sign(hoofd?dx:dy);if(s&&vorige&&s!=vorige&&Math.abs(hoofd?dy:dx)>3)wissel++;if(s)vorige=s;if(s2&&vx2&&s2!=vx2)wx++;if(s2)vx2=s2}
 if(eind<diag*.3&&len>diag*2)return'cirkel';if(len<diag*1.25)return'streep';const ymax=ys.indexOf(Math.max(...ys));if(wissel==1&&ymax>pts.length*.2&&ymax<pts.length*.8&&h>w*.3)return'v';if(wissel>=2)return'zigzag';
 const minY=ys.indexOf(Math.max(...ys));if(minY>pts.length*.2&&minY<pts.length*.8&&h>w*.4)return'v';return wissel>=1?'zigzag':'streep'}
V.toverstok=()=>{let doel=GEBAAR[Math.random()*GEBAAR.length|0],pts=[],tek=false;
 app(`<h1>🪄 Toverstokbewegingen</h1><div class="perkament"><p>Spreuk: <b id="sp">${doel[0]}</b></p><p><small id="sh">${doel[2]}</small></p><canvas id="teken" width="600" height="380"></canvas><button class="knop" id="nw">Andere spreuk</button></div><div id="tr"></div>`);
 const c=$('#teken'),g=c.getContext('2d');const pos=e=>{const b=c.getBoundingClientRect();return[(e.clientX-b.left)/b.width*600,(e.clientY-b.top)/b.height*380]};
 c.onpointerdown=e=>{tek=true;pts=[pos(e)];g.clearRect(0,0,600,380);c.setPointerCapture(e.pointerId)};
 c.onpointermove=e=>{if(!tek)return;const p=pos(e);const q=pts.at(-1);pts.push(p);g.strokeStyle='#d4af37';g.lineWidth=6;g.lineCap='round';g.shadowColor='#ffd700';g.shadowBlur=12;g.beginPath();g.moveTo(q[0],q[1]);g.lineTo(p[0],p[1]);g.stroke();if(Math.random()<.3)fx.speel&&0};
 c.onpointerup=()=>{tek=false;const v=herken(pts);if(!v)return;tel('mini');if(v==doel[1]){S.galjoenen+=6*evtBonus();S.xp+=4;bewaar();stats();questCheck();fx.goed();vib([30,30,80]);$('#tr').innerHTML=tilly(`<b>${doel[0]}!</b> Prachtig uitgevoerd. +${6*evtBonus()} Galjoenen.`);setTimeout(()=>$('#nw')&&$('#nw').click(),1500)}else{fx.fout();$('#tr').innerHTML=foutT('Dat leek meer op een '+v+'. '+doel[2])}questCheck()};
 $('#nw').onclick=()=>{doel=GEBAAR[Math.random()*GEBAAR.length|0];$('#sp').textContent=doel[0];$('#sh').textContent=doel[2];g.clearRect(0,0,600,380);fx.speel('whoosh')}};
/* ---------- gouden snaai verrassing ---------- */
function gouden(){if(Math.random()>.05||$('.goudsnaai'))return;const e=document.createElement('button');e.className='goudsnaai';e.setAttribute('aria-label','Gouden Snaai');e.innerHTML='🟡<i></i><i></i>';e.style.top=(15+Math.random()*55)+'%';document.body.appendChild(e);
 e.onclick=()=>{S.galjoenen+=25;bewaar();stats();fx.goed();fx.speel('fanfare');vib([40,30,40,30,120]);toast('✨ Je ving een zeldzame Gouden Snaai! +25 Galjoenen');e.remove()};setTimeout(()=>e.remove(),7000)}
/* ---------- portretten die knipogen ---------- */
function portretten(){return `<div class="portretten"><figure class="portret"><img src="img/sneeuwuil-portret.webp" alt="Portret van een sneeuwuil"><span class="ooglid l"></span><span class="ooglid r"></span><figcaption>Sir Veder van Sneeuwberg</figcaption></figure><figure class="portret tilly-p"><div class="tgez" data-svg="">${typeof tillySVG=="function"?tillySVG("blij"):""}</div><figcaption>Tilly, kruidenkundige</figcaption></figure></div>`}
setInterval(()=>{const t=$('.tilly-p .tgez');if(t&&!t.querySelector('svg')){t.dataset.svg=1;t.innerHTML=tillySVG('blij')}document.querySelectorAll('.portret').forEach(p=>{if(Math.random()<.5){p.classList.add('knipoog');setTimeout(()=>p.classList.remove('knipoog'),300)}})},6000);
/* ---------- verjaardag 9 maart ---------- */
function verjaardag(force){const d=D0();if(!force&&!(d.getMonth()==2&&d.getDate()==9))return;const jaar=d.getFullYear();
 const o=document.createElement('div');o.className='modal verj';o.innerHTML=`<img class="uilfeest" src="img/sneeuwuil.webp" alt="Uil met brief"><div class="perkament modalin brief"><h2>🎂 Hartelijk gefeliciteerd, ${aanspreek()}!</h2><p>Lieve ${naam()},</p><p>Het hele kasteel is in rep en roer: de kaarsen in de Grote Zaal branden vandaag roze, Foppe heeft beloofd zich te gedragen en in de kas is speciaal voor jou een Maanbloem opengegaan.</p><p>Wij wensen je een jaar vol nieuwsgierigheid, mooie planten, opgeloste raadsels en heel veel liefde.</p><p style="text-align:right"><i>Met warme groet,<br>Tilly 🌿, Albus Perkamentus, Minerva Anderling, Pomona Stronk, Filius Banning en Rubeus Hagrid<br><small>(Severus Sneep heeft ook getekend. Met tegenzin. Maar toch.)</small></i></p>
 <div class="taart"><div class="kaarsjes">${Array.from({length:6},(_,i)=>`<button class="kaarsje" aria-label="Kaarsje"><span class="vlam"></span></button>`).join('')}</div><div class="taartlaag">🎂</div></div><p><small>Blaas de kaarsjes uit door erop te tikken${navigator.mediaDevices?' – of <button class="knop klein" id="mic">🎤 echt blazen</button>':''}.</small></p><div id="vres"></div><button class="knop" id="vsluit">Dank je wel! 💛</button></div>`;
 document.body.appendChild(o);fx.levelup('Gefeliciteerd!');setTimeout(()=>document.querySelector('.lvlup')&&document.querySelector('.lvlup').remove(),2500);
 const check=()=>{if(!o.querySelector('.vlam:not(.uit)')){fx.speel('fanfare');fx.goed();vib([60,40,60,40,300]);let t='Alle kaarsjes uit – doe een wens! 🌟';if(S.verjaardag!==jaar){S.verjaardag=jaar;S.galjoenen+=100;bewaar();stats();t+=' Je krijgt 100 verjaardags-Galjoenen!'}o.querySelector('#vres').innerHTML=tilly(t);for(let i=0;i<4;i++)setTimeout(()=>fx.levelup&&0,i*300)}};
 o.querySelectorAll('.kaarsje').forEach(k=>k.onclick=()=>{k.querySelector('.vlam').classList.add('uit');fx.speel('whoosh');vib(20);check()});
 const mic=o.querySelector('#mic');if(mic)mic.onclick=async()=>{try{const st=await navigator.mediaDevices.getUserMedia({audio:true});const c=fx.ctx().ac,an=c.createAnalyser();c.createMediaStreamSource(st).connect(an);const buf=new Uint8Array(an.fftSize);const lp=()=>{an.getByteTimeDomainData(buf);let m=0;buf.forEach(v=>m=Math.max(m,Math.abs(v-128)));if(m>60){const v=o.querySelector('.vlam:not(.uit)');if(v){v.classList.add('uit');check()}}if(o.querySelector('.vlam:not(.uit)')&&document.body.contains(o))requestAnimationFrame(lp);else st.getTracks().forEach(t=>t.stop())};lp();mic.textContent='🎤 Blaas maar!'}catch(e){mic.textContent='Microfoon niet beschikbaar – tik maar'}};
 o.querySelector('#vsluit').onclick=()=>o.remove()}
/* ---------- PWA / installeren ---------- */
let installEvt=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;toonInstall()});
function toonInstall(){if(!installEvt||$('#installeer'))return;document.body.insertAdjacentHTML('beforeend','<button id="installeer" class="knop">📲 Installeer de app</button>');$('#installeer').onclick=async()=>{installEvt.prompt();const r=await installEvt.userChoice;if(r.outcome==='accepted'){toast('✨ Zweinstein staat nu op je startscherm!');vib(60)}installEvt=null;$('#installeer').remove()}}
if('serviceWorker' in navigator&&location.protocol.startsWith('http')){const had=!!navigator.serviceWorker.controller;navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(r=>r.update&&r.update()).catch(()=>{});let herl=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!had||herl||sessionStorage.zw_swHerl===String(Date.now()/6e4|0))return;herl=true;sessionStorage.zw_swHerl=String(Date.now()/6e4|0);/* nieuwe versie actief: één keer zacht herladen, niet midden in een spel */const v=document.body.dataset.view;if(v==='match3'||document.querySelector('.modal:not(.wacht)'))return;location.reload()})}
/* ---------- integratie met bestaande app ---------- */
const _ga=ga;ga=function(s,...a){_ga(s,...a);const v=!S.naam?'brief':!S.huis&&s!=='sorteer'?'sorteer':s;zetDecor(VIEWDECOR[v]||'zaal');document.body.dataset.view=v;$('#app').classList.remove('inkomen');void $('#app').offsetWidth;$('#app').classList.add('inkomen');gouden();
 if(v=='kas'){tel('kas');questCheck()}if(v=='les'||v=='lessen'){}};
const _les=V.les;V.les=(...a)=>{tel('les');questCheck();return _les(...a)};
const _home=V.home;V.home=()=>{_home();const f=feestdag();const ex=`<div class="groet"><h2>${groet()}, ${aanspreek()}</h2>${f?`<div class="feest">${f.t}</div>`:''}${weerZin()?tilly(weerZin()):''}${portretten()}</div>`;$('#app').insertAdjacentHTML('afterbegin',ex);$('#app h1').remove();
 $('#app').insertAdjacentHTML('beforeend',`${kistMeter()}<div class="raster"><div class="tegel" onclick="ga('kaart')"><div class="ico">🗺️</div>Sluipwegwijzer</div><div class="tegel" onclick="ga('quests')"><div class="ico">📋</div>Opdrachten</div><div class="tegel" onclick="ga('beker')"><div class="ico">🏆</div>Afdelingsbeker</div><div class="tegel" onclick="ga('kikker')"><div class="ico">🐸</div>Chocokikkers</div><div class="tegel" onclick="ga('kamer')"><div class="ico">🛏️</div>Mijn kamer</div><div class="tegel" onclick="ga('verhaal')"><div class="ico">📖</div>Verhaal</div><div class="tegel" onclick="ga('bertie')"><div class="ico">🎮</div>Mini-games</div><div class="tegel" onclick="V.login()"><div class="ico">📅</div>Dagbeloning</div></div><p class="bronlink"><a href="CREDITS.txt" target="_blank">Bronnen &amp; licenties</a> · weer: <a href="https://open-meteo.com" target="_blank">Open-Meteo</a></p>`)};
TABS.splice(0,TABS.length,['kaart','🗺️','Kaart'],['home','🏰','Hal'],['spel','🧩','Spellen'],['lessen','📚','Lessen'],['winkel','🛍️','Winkel']);
zetTijd();setInterval(zetTijd,6e4);haalWeer();setInterval(haalWeer,15*6e4);
startApp();
if(S.naam&&S.huis){loginCheck();setTimeout(()=>verjaardag(),800)}
window.testVerjaardag=()=>verjaardag(true);
