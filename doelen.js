/* ====== Verzamel- en bevrijd-doelen: thema-items, dieren, spreuk-kisten, vlieg-animaties ====== */
(function(){
const W='Wingardium Leviosa!',A='Accio!',AL='Alohomora!',L='Lumos!',R='Reparo!',RI='Riddikulus!',P='Protego!';
// [id, naam, emoji, soort, spreuk]
const ITEMS={
 herbologie:[['mandr','Mandragorawortel','🌱','ding',W],['oorw','Oorwarmers','🎧','ding',A],['gieter','Gieter','🪣','fles',W],['zaad','Zaadzakje','🌰','ding',A],['duiv','Duivelsstrik-takje','🌿','veer',L],['hboek','Duizend Magische Kruiden en Zwammen','📗','boek',W]],
 bezweringen:[['veer','Veer','🪶','veer',W],['sleutel','Gevleugelde sleutel','🗝️','sleutel',AL],['ananas','Ananas','🍍','ding',A],['kopje','Theekopje','☕','ding',R],['bboek','Standaardspreukenboek','📘','boek',A]],
 toverdranken:[['bezoar','Bezoar','🪨','ding',A],['gaas','Potje gaasvliegjes','🫙','fles',W],['twee','Tweehoornpoeder','🧂','fles',A],['felix','Flesje Felix Fortunatis','🧪','fles',L],['dboek','Toverdranken voor Gevorderden','📕','boek',A]],
 gedaante:[['theekop','Theepot','🫖','ding',R],['naald','Lucifer-naald','🪡','veer',A],['knoop','Kever-knoop','🔘','ding',A],['gboek','Gedaanteverwisselingen voor Beginners','📙','boek',W]],
 astronomie:[['kaart','Sterrenkaart','🗺️','boek',A],['lens','Telescooplensje','🔭','ding',R],['maan','Maansteentje','🌙','fles',L],['aboek','Sterrenatlas','📘','boek',L]],
 verweer:[['choco','Chocolade','🍫','ding',A],['kast','Boeman-kastsleuteltje','🔑','sleutel',RI],['amulet','Schildamulet','🧿','ding',P],['vboek','Duistere Wezens','📕','boek',A]]};
// [id, naam, emoji, beweging]
const DIEREN={
 herbologie:[['trevor','Trevor de pad','🐸','spring'],['pufpeul','Pufpeul','🐹','rol']],
 bezweringen:[['hedwig','Hedwig-kuiken','🦉','vlieg'],['pufpeul','Pufpeul','🐹','rol']],
 toverdranken:[['schurfie','Schurfie','🐀','ren'],['trevor','Trevor de pad','🐸','spring']],
 gedaante:[['kat','Gestreepte kat','🐈','ren'],['schurfie','Schurfie','🐀','ren']],
 astronomie:[['hedwig','Hedwig-kuiken','🦉','vlieg'],['pluisje','Pluisje-puppy','🐕','ren']],
 verweer:[['norbert','Norbert (babydraak)','🐉','vlieg'],['pluisje','Pluisje-puppy','🐕','ren']]};
const vk=t=>ITEMS[t]?t:'herbologie';
window.M3ITEMS=ITEMS;window.M3DIEREN=DIEREN;
const alle={};Object.values(ITEMS).flat().forEach(x=>alle[x[0]]={id:x[0],naam:x[1],emo:x[2],soort:x[3],spreuk:x[4]});Object.values(DIEREN).flat().forEach(x=>alle[x[0]]={id:x[0],naam:x[1],emo:x[2],soort:'dier',bew:x[3]});
window.m3Ding=id=>alle[id];
/* vooraf gerenderde sprites (gecachet) */
const SC={};
window.itemSprite=function(id,px){const k=id+px;if(SC[k])return SC[k];const d=alle[id];const cv=document.createElement('canvas');cv.width=cv.height=px;const c=cv.getContext('2d');
 const g=c.createRadialGradient(px/2,px/2,px*.05,px/2,px/2,px/2);g.addColorStop(0,'rgba(255,236,170,.75)');g.addColorStop(.55,'rgba(255,210,110,.25)');g.addColorStop(1,'rgba(255,210,110,0)');c.fillStyle=g;c.fillRect(0,0,px,px);
 c.font=`${px*.62}px "Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif`;c.textAlign='center';c.textBaseline='middle';c.shadowColor='rgba(60,30,0,.55)';c.shadowBlur=px*.06;c.shadowOffsetY=px*.03;c.fillText(d?d.emo:'✨',px/2,px*.54);
 return SC[k]=cv};
window.itemUrl=(id,px=96)=>{const k='u'+id+px;return SC[k]||(SC[k]=itemSprite(id,px).toDataURL())};
window.kooiSprite=function(n,id,px){const k='k'+n+id+px;if(SC[k])return SC[k];const cv=document.createElement('canvas');cv.width=cv.height=px;const c=cv.getContext('2d');const s=px/100;
 c.fillStyle='rgba(40,20,5,.3)';c.beginPath();c.ellipse(px/2,px*.93,px*.4,px*.06,0,0,7);c.fill();
 c.fillStyle='rgba(30,40,70,.35)';c.fillRect(12*s,14*s,76*s,76*s);
 c.drawImage(itemSprite(id,px),px*.14,px*.18,px*.72,px*.72);
 const goud=(x,y,w,h)=>{const g=c.createLinearGradient(x,y,x+w,y);g.addColorStop(0,'#8a6a1f');g.addColorStop(.5,'#ffe08a');g.addColorStop(1,'#8a6a1f');c.fillStyle=g;c.fillRect(x,y,w,h)};
 const tralies=n>=2?[16,30,44,58,72,84]:[16,44,84];tralies.forEach(x=>goud(x*s,14*s,3.4*s,76*s));
 goud(10*s,10*s,80*s,7*s);goud(10*s,86*s,80*s,7*s);
 c.fillStyle='#d4af37';c.beginPath();c.arc(50*s,8*s,5*s,Math.PI,0);c.lineWidth=2.5*s;c.strokeStyle='#d4af37';c.stroke();
 if(n<2){c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=1.2*s;c.beginPath();c.moveTo(30*s,20*s);c.lineTo(38*s,34*s);c.lineTo(33*s,46*s);c.stroke()}
 return SC[k]=cv};
/* rune per spreuk (getekend achter de kieren) */
const RUNE={[W]:'ᛉ',[A]:'ᚨ',[AL]:'ᛟ',[L]:'ᛋ',[R]:'ᚱ',[RI]:'ᚷ',[P]:'ᛗ'};
window.runeVan=id=>{const d=alle[id];return RUNE[d&&d.spreuk]||'ᛉ'};
/* doelkaartjes */
window.doelIco=function(t,thema,L){const id=t=='d'?(L&&L.kistInh&&L.kistInh[0])||DIEREN[vk(thema)][0][0]:t=='i'?(L&&L.kistInh&&L.kistInh[0])||ITEMS[vk(thema)][0][0]:(L&&L.dropInh&&L.dropInh[0])||ITEMS[vk(thema)][0][0];
 return `<img class="m3ico m3ico-it" src="${itemUrl(id)}" alt="" style="background:${t=='d'?'#4a6aa8':t=='i'?'#7a4ab0':'#3f7a4a'}">`};
window.doelNaam=t=>t=='i'?'spreuk-kistjes':t=='d'?'dieren bevrijden':'items naar beneden';
/* ---------- levels: nieuwe doeltypes verdelen (na level 30) ---------- */
const _lv=m3Level;m3Level=function(n){const L=_lv(n);if(n<=30)return L;const T=vakVan(n).id,t=vk(T);const r=rngVan(n*977+3);
 const i=L.doelen.findIndex(x=>x[0]=='k');
 if(i>=0){const kans=r();const d=(n-1)%100;
  if(kans<.4){L.kistSoort='i';L.doelen[i]=['i'];const it=ITEMS[t];L.kistInh=[it[(n*7)%it.length][0],it[(n*7+1)%it.length][0]]}
  else if(kans<.75&&(d>=15||n>100)){L.kistSoort='d';L.doelen[i]=['d'];const dd=DIEREN[t];L.kistInh=[dd[n%dd.length][0]]}}
 const p=L.doelen.findIndex(x=>x[0]=='p');
 if(p<0&&L.doelen.length<3&&r()<.3){L.pot=3+(n>200?1:0);L.doelen.push(['p',L.pot])}
 if(L.doelen.some(x=>x[0]=='p')){const it=ITEMS[t];L.dropInh=[it[(n*3)%it.length][0],it[(n*3+2)%it.length][0]]}
 return L};
if(!S.kalV3){S.kalV3=1;if(S.m3kal)Object.keys(S.m3kal).forEach(n=>{try{const L=m3Level(+n);if(L.kistSoort||L.dropInh)delete S.m3kal[n]}catch(e){}});bewaar()}
/* ---------- animaties ---------- */
const RMP=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
let spreukTot=0;
function spreukTekst(txt,x,y){const nu=performance.now();const vol=nu>spreukTot;spreukTot=nu+(vol?1400:300);
 const f=document.createElement('div');f.className='m3flits';f.style.cssText=`left:${x}px;top:${y}px`;document.body.appendChild(f);setTimeout(()=>f.remove(),700);
 if(!vol)return;const el=document.createElement('div');el.className='m3spreuk';el.innerHTML=`<svg class="staf" viewBox="0 0 100 20"><path d="M2 12 L88 7" stroke="#3a2412" stroke-width="5" stroke-linecap="round"/><path d="M2 12 L20 11" stroke="#6b4423" stroke-width="7" stroke-linecap="round"/><circle cx="92" cy="7" r="4" fill="#fff6c8"/></svg><span>${txt}</span>`;document.body.appendChild(el);setTimeout(()=>el.remove(),1500);try{fx.speel('tover')}catch(e){}}
function piep(){try{const ac=window._pipAc||(window._pipAc=new AudioContext());const t=ac.currentTime;[0,.12].forEach((d,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(1300+i*300,t+d);o.frequency.exponentialRampToValueAtTime(2200+i*300,t+d+.08);g.gain.setValueAtTime(.0001,t+d);g.gain.exponentialRampToValueAtTime(.12,t+d+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d+.11);o.connect(g).connect(ac.destination);o.start(t+d);o.stop(t+d+.13)})}catch(e){}}
function spoor(x,y,veer){const s=document.createElement('span');s.className='m3spoor';s.textContent=veer?'🪶':(Math.random()<.5?'✦':'✧');s.style.cssText=`left:${x}px;top:${y}px;--dx:${(Math.random()-.5)*30}px;--r:${(Math.random()-.5)*160}deg;font-size:${veer?14:10+Math.random()*8}px`;document.body.appendChild(s);setTimeout(()=>s.remove(),900)}
/* item vliegt van (x,y) naar doelkaart; zweef = tijd boven de kist */
window.m3VliegItem=function(id,x,y,doelEl,zweef){const d=alle[id]||{soort:'ding'};const el=document.createElement('img');el.src=itemUrl(id,128);el.className='m3item';const z=54;el.style.cssText=`left:${x-z/2}px;top:${y-z/2}px;width:${z}px;height:${z}px`;document.body.appendChild(el);
 if(RMP()){setTimeout(()=>el.remove(),400);return}
 const kr=doelEl?doelEl.getBoundingClientRect():{left:innerWidth-40,top:60,width:30,height:30};const x1=kr.left+kr.width/2,y1=kr.top+kr.height/2;
 const t0=performance.now(),Z=zweef||0,DUUR=850+Math.hypot(x1-x,y1-y)*.6;let laatst=0;
 const stap=nu=>{const t=nu-t0;let px=x,py=y,sx=1,sy=1,rot=0,sc=1;
  if(t<Z){const k=t/Z;py=y-22*Math.min(1,k*3)+Math.sin(t/120)*3;sc=1+.15*Math.min(1,k*3);el.style.filter=`drop-shadow(0 0 ${8+4*Math.sin(t/90)}px #ffe9a0)`}
  else{const k=Math.min(1,(t-Z)/DUUR),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2,y0=Z?y-22:y;
   px=x+(x1-x)*e;py=y0+(y1-y0)*e-Math.sin(k*Math.PI)*90;sc=1.15-.55*k;
   const s=d.soort,b=d.bew;
   if(s=='boek'||s=='sleutel'){sx=.35+.65*Math.abs(Math.cos(t/55));py+=Math.sin(t/55)*3}
   if(s=='veer'){rot=Math.sin(t/140)*35;px+=Math.sin(t/160)*14}
   if(s=='fles'){rot=Math.sin(t/200)*10}
   if(b=='vlieg'){sy=.8+.2*Math.abs(Math.sin(t/70));py+=Math.sin(t/70)*4}
   if(b=='spring'){py=y0+(y1-y0)*e-Math.abs(Math.sin(k*Math.PI*3))*60;sy=1-.15*Math.abs(Math.cos(k*Math.PI*3))}
   if(b=='rol')rot=k*720;if(b=='ren'){py+=-Math.abs(Math.sin(t/60))*6;sx=x1<x?-1:1}
   if(nu-laatst>45){laatst=nu;spoor(px,py,s=='veer'||(s!='dier'&&Math.random()<.25))}
   if(k>=1){el.remove();if(doelEl){const kt=doelEl.closest('.m3kaart')||doelEl;kt.classList.remove('m3pop');void kt.offsetWidth;kt.classList.add('m3pop')}try{fx.speel('munt')}catch(e){}return}}
  el.style.transform=`rotate(${rot}deg) scale(${sc*sx},${sc*sy})`;requestAnimationFrame(stap)};requestAnimationFrame(stap)};
let rij=0;
window.m3Spreuk=function(id,x,y,doelEl){const d=alle[id]||{spreuk:W};const wacht=Math.max(0,rij-performance.now());rij=performance.now()+wacht+350;
 setTimeout(()=>{spreukTekst(d.spreuk,x,y);m3VliegItem(id,x,y,doelEl,RMP()?0:(wacht?600:850))},wacht)};
window.m3Bevrijd=function(id,x,y,doelEl){const wacht=Math.max(0,rij-performance.now());rij=performance.now()+wacht+300;
 setTimeout(()=>{piep();const s=document.createElement('span');s.className='m3dank';s.textContent='♥';s.style.cssText=`left:${x}px;top:${y-30}px`;document.body.appendChild(s);setTimeout(()=>s.remove(),900);m3VliegItem(id,x,y,doelEl,RMP()?0:500)},wacht)};
})();
