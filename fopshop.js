'use strict';
/* Tovertweelings Topfopshop van Fred en George Wemel (Wegisweg 93). */
(function(){
S.fg=S.fg||{pluis:[],bezoek:0};
const PLUISKL=[['roze','#ff8fc8'],['paars','#b07cff'],['geel','#ffd34d'],['blauw','#6fc8ff'],['groen','#7ee08a']];
window.pluisSvg=(kl,cls)=>`<svg class="${cls||'pluis'}" viewBox="0 0 100 100" aria-hidden="true"><g fill="${kl}">${Array.from({length:18},(_,i)=>{const a=i/18*6.283;return `<circle cx="${50+Math.cos(a)*30}" cy="${54+Math.sin(a)*28}" r="15"/>`}).join('')}<circle cx="50" cy="54" r="34"/></g><ellipse cx="38" cy="50" rx="7" ry="9" fill="#2a1630"/><ellipse cx="62" cy="50" rx="7" ry="9" fill="#2a1630"/><circle cx="40" cy="47" r="2.6" fill="#fff"/><circle cx="64" cy="47" r="2.6" fill="#fff"/><path d="M42 66 Q50 73 58 66" stroke="#2a1630" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="30" cy="62" rx="5" ry="3" fill="#ff5fa2" opacity=".45"/><ellipse cx="70" cy="62" rx="5" ry="3" fill="#ff5fa2" opacity=".45"/></svg>`;
/* boosters erbij in het bestaande boostersysteem */
Object.assign(BOOSTERS,{
 wildvuur:{prijs:160,van:30,fop:1,naam:'Wildvuur Wonderknallers',kort:'4 knalbommen',img:'fg-wildvuur',uitleg:'Weasleys’ Wildvuur Wonderknallers! Vier knalbommen staan op het bord. Laat ze afgaan met een match ernaast.'},
 spijbel:{prijs:140,van:10,fop:1,naam:'Spijbelsnoepdoos',kort:'+5 zetten',img:'fg-spijbel',uitleg:'Eén hapje van de Spijbelsnoepdoos en je krijgt vijf extra zetten. Niet aan Anderling vertellen.'},
 peru:{prijs:240,van:50,fop:1,naam:'Instant Duisternispoeder',kort:'Verdwijnspreuk',img:'fg-peru',uitleg:'Instant Duisternispoeder uit Peru. Even is alles donker… en dan ligt er een Evanesco Maxima (zware spreuk) op het bord.'},
 knalpijl:{prijs:120,van:25,fop:1,naam:'Kleine Knalpijl',kort:'1 rij weg',img:'fg-knalpijl',uitleg:'Een Kleine Knalpijl van Fred en George. Bij de start schiet hij omhoog en knalt één hele rij leeg. Je hoeft niets te doen.'},
 vuurpijl:{prijs:300,van:60,fop:1,naam:'Grote Weasley-Vuurpijl',kort:'3 rijen + vuurdraak',img:'fg-vuurpijl',uitleg:'De Grote Weasley-Vuurpijl! Er komt een vuurdraak uit die drie rijen tegelijk wegbrandt. Precies zoals in de Grote Zaal bij Omber.'}});
const _nb=window.m3NaBord;
window.m3NaBord=(b,boost)=>{const bo=(boost&&boost.bo)||[];const heb={};bo.forEach(k=>heb[k]=S.bo[k]>0);_nb(b,boost);
 const vrij=()=>{const L=[];for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=b.g[r][c];if(t&&t.k>=0&&!t.s&&!b.kist[r][c]&&!(b.strik&&b.strik[r][c]))L.push([r,c])}return L};
 const rnd=a=>a.splice(Math.random()*a.length|0,1)[0];
 if(heb.wildvuur){const v=vrij();for(let i=0;i<4&&v.length;i++){const[r,c]=rnd(v);b.g[r][c].s='kbom'}vuurwerk(document.getElementById('m3d')||document.body,7);try{fx.speel('tover')}catch(e){}}
 if(heb.knalpijl||heb.vuurpijl)setTimeout(()=>raket(b,heb.vuurpijl?'groot':'klein',heb.knalpijl&&heb.vuurpijl),900);
 if(heb.spijbel){b.zet+=5;try{toast('Spijbelsnoepdoos: +5 zetten!')}catch(e){}}
 if(heb.peru){const d=document.createElement('div');d.className='fgduister';document.body.appendChild(d);setTimeout(()=>{const v=vrij().filter(([r])=>r>=2&&r<=5);if(v.length){const[r,c]=rnd(v);b.g[r][c].s='verdwijn'}d.classList.add('weg');setTimeout(()=>d.remove(),1400)},1300)}
 try{M3.toonFx&&M3.toonFx()}catch(e){}};
/* rustig vuurwerk (geen flitsen: zachte fade, lage helderheid) */
function vuurwerk(host,n){if(matchMedia('(prefers-reduced-motion: reduce)').matches)n=Math.min(n,2);const r=host.getBoundingClientRect();
 for(let i=0;i<n;i++)setTimeout(()=>{const e=document.createElement('img');e.src='img/fg/fireworks-sparks-'+(1+(i%2))+'.webp';e.className='fgknal';const z=90+Math.random()*90;e.style.cssText=`left:${r.left+Math.random()*(r.width-z)}px;top:${r.top+Math.random()*Math.max(40,r.height*.6)}px;width:${z}px;filter:hue-rotate(${Math.random()*360|0}deg)`;document.body.appendChild(e);setTimeout(()=>e.remove(),1700)},i*260)}
window.fgVuurwerk=vuurwerk;
/* Kleine Knalpijl en Grote Weasley-Vuurpijl: schieten bij de start vanzelf, zachte kleuren, geen witte flitsen */
function raket(b,soort,ookKlein,w){const cv0=document.getElementById('m3c');if(!cv0||typeof M3==='undefined'||!M3.knal||M3.b!==b)return;
 if(document.body.classList.contains('lvintro')||document.querySelector('.modal')||document.querySelector('#gids.zien button')){setTimeout(()=>raket(b,soort,ookKlein,1),300);return}if(w){setTimeout(()=>raket(b,soort,ookKlein,0),600);return}
 const rust=matchMedia('(prefers-reduced-motion: reduce)').matches;const R0=cv0.getBoundingClientRect();const ch=R0.height/RIJEN,cw=R0.width/KOL;
 const groot=soort=='groot';const mid=groot?3+(Math.random()*2|0):2+(Math.random()*4|0);const rijen=groot?[mid-1,mid,mid+1]:[mid];if(ookKlein){const x=mid>3?1:6;if(!rijen.includes(x))rijen.push(x)}
 const cel=[];rijen.forEach(r=>{for(let c=0;c<KOL;c++)cel.push([r,c])});
 const cv=document.createElement('canvas');cv.className='fgraket';const dpr=Math.min(2,devicePixelRatio||1);const pad=40;
 cv.style.cssText=`left:${R0.left-pad}px;top:${R0.top-pad}px;width:${R0.width+pad*2}px;height:${R0.height+pad*2}px`;cv.width=(R0.width+pad*2)*dpr;cv.height=(R0.height+pad*2)*dpr;document.body.appendChild(cv);
 const g=cv.getContext('2d');g.scale(dpr,dpr);const W=R0.width,H=R0.height;const ty=pad+(mid+.5)*ch;const x0=pad+W*(groot?.15:.5);
 const vonk=[];const kl=groot?['#ffb347','#ff7a45','#ffd97a','#9be08a']:['#ffcf6a','#ff9a5a','#ffe7a3'];
 try{if(!(window.zwSpeel&&zwSpeel('whoosh',.8)))fx.speel('tover')}catch(e){}
 const T1=rust?250:700,T2=rust?300:(groot?1100:750),t0=performance.now();let geknald=false;
 const stap=nu=>{const t=nu-t0;g.clearRect(0,0,W+pad*2,H+pad*2);
  if(t<T1){const p=t/T1,e=1-Math.pow(1-p,2);const y=pad+H+20-(pad+H+20-ty)*e;const x=x0+Math.sin(p*9)*4;
   for(let i=0;i<3;i++)vonk.push({x:x+(Math.random()-.5)*6,y:y+14,vx:(Math.random()-.5)*.6,vy:1+Math.random()*1.5,l:1,k:kl[Math.random()*kl.length|0],r:2+Math.random()*2});
   g.save();g.translate(x,y);g.fillStyle=groot?'#7a3aa8':'#c94a3c';g.fillRect(-5,-14,10,24);g.fillStyle='#ffc94d';g.beginPath();g.moveTo(-5,-14);g.lineTo(5,-14);g.lineTo(0,-24);g.fill();g.restore()}
  else{const p=Math.min(1,(t-T1)/T2);
   if(!geknald){geknald=true;try{if(!(window.zwSpeel&&zwSpeel('vuurwerk',.8)))fx.speel('fanfare')}catch(e){}navigator.vibrate&&navigator.vibrate(groot?[30,40,60]:30)}
   rijen.forEach((r,ri)=>{const y=pad+(r+.5)*ch;const xs=groot?pad+W*p:(pad+W/2);const xl=groot?xs:pad+W/2-W/2*p,xr=groot?xs:pad+W/2+W/2*p;
    for(const xx of groot?[xs]:[xl,xr])for(let i=0;i<(rust?1:4);i++)vonk.push({x:xx,y:y+(Math.random()-.5)*ch*.6,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,l:1,k:kl[Math.random()*kl.length|0],r:2+Math.random()*3});
    g.fillStyle=`rgba(255,170,80,${.22*(1-p*.5)})`;g.fillRect(groot?pad:xl,y-ch*.45,groot?xs-pad:xr-xl,ch*.9)});
   if(groot){const hx=pad+W*p,hy=ty+Math.sin(p*12)*ch*.6;g.save();g.translate(hx,hy);g.fillStyle='rgba(255,140,60,.85)';g.beginPath();g.ellipse(0,0,ch*.55,ch*.38,0,0,6.283);g.fill();
     g.fillStyle='rgba(255,200,90,.85)';g.beginPath();g.moveTo(-ch*.2,-ch*.3);g.lineTo(-ch*.05,-ch*.75);g.lineTo(ch*.1,-ch*.3);g.fill();g.fillStyle='#3a1a0a';g.beginPath();g.arc(ch*.22,-ch*.08,ch*.07,0,6.283);g.fill();
     g.fillStyle='rgba(255,220,120,.7)';g.beginPath();g.moveTo(ch*.5,0);g.lineTo(ch*1.1,-ch*.25);g.lineTo(ch*1.1,ch*.25);g.fill();g.restore();
     for(let k=1;k<9;k++){const q=Math.max(0,p-k*.03);const bx=pad+W*q,by=ty+Math.sin(q*12)*ch*.6;g.fillStyle=`rgba(${255-k*8},${150-k*6},${60+k*4},${.6-k*.06})`;g.beginPath();g.arc(bx,by,ch*(.4-k*.03),0,6.283);g.fill()}}
   if(p>=1&&!raket.weg){raket.weg=1}}
  for(let i=vonk.length-1;i>=0;i--){const v=vonk[i];v.x+=v.vx;v.y+=v.vy;v.vy+=.03;v.l-=.025;if(v.l<=0){vonk.splice(i,1);continue}g.globalAlpha=Math.max(0,v.l*.85);g.fillStyle=v.k;g.beginPath();g.arc(v.x,v.y,v.r*v.l,0,6.283);g.fill()}g.globalAlpha=1;
  if(t<T1+T2+900)requestAnimationFrame(stap);else cv.remove()};
 requestAnimationFrame(stap);
 let poging=0;const knal=async()=>{const ok=await M3.knal(cel);if(!ok&&poging++<20)setTimeout(knal,250)};setTimeout(knal,T1+T2*.6)}
window.fgRaket=raket;
/* nieuw in de winkel: Fred en George laten het weten zodra iets vrijkomt */
S.fgOpen=S.fgOpen||{};setTimeout(()=>{const lv=S.m3lvl|0;let nieuw=false;ITEMS_VAN().forEach(it=>{if(lv>=it.van&&!S.fgOpen[it.id]){S.fgOpen[it.id]=1;nieuw=true}});if(nieuw)bewaar()},0);
function ITEMS_VAN(){return ITEMS.filter(it=>it.van>1)}
function fgOpenCheck(){const lv=S.m3lvl|0;const it=ITEMS_VAN().find(it=>lv>=it.van&&!S.fgOpen[it.id]);if(!it)return;S.fgOpen[it.id]=1;bewaar();
 const o=document.createElement('div');o.className='modal';o.dataset.pop='fgnieuw';o.innerHTML=`<div class="modalin rococo"><h2>Nieuw bij Fred en George!</h2><img src="${it.img||'img/pu/fg-wildvuur.webp'}" alt="" style="width:96px;height:96px;object-fit:contain;display:block;margin:.3em auto"><p><b>Fred:</b> Psst! Vanaf nu verkopen we je ook ${it.naam}.</p><p><b>George:</b> ${it.tekst} Voor maar ${it.prijs} Smekkies. Spotgoedkoop. Nou ja.</p><button class="knop volgende" id="fgnaar">Naar de Fopshop</button><button class="linkknop" id="fglater">Later</button></div>`;
 document.body.appendChild(o);try{fx.speel('fanfare')}catch(e){}o.querySelector('#fgnaar').onclick=()=>{document.querySelectorAll('.modal').forEach(m=>m.remove());ga('fopshop')};o.querySelector('#fglater').onclick=()=>o.remove()}
const _mw=window.m3Winst;if(typeof _mw==='function'){m3Winst=function(...a){const r=_mw.apply(this,a);setTimeout(()=>{try{fgOpenCheck()}catch(e){}},1600);return r}}
window.fgOpenCheck=fgOpenCheck;
const GRAP=[['Fred','Waarom ben je zo verdrietig, Gred?'],['George','Ik weet het niet, Feorge. Misschien omdat ze nog niets gekocht heeft.'],['George','Ik ben Fred niet, ik ben George!'],['Fred','Eerlijk, mens. Noem jij jezelf een tovenares?'],['George','Ik ben zo heilig als een gatenkaas. Snap je? Ik heb een oor kwijt!'],['Fred','Weasleys’ Wildvuur Wonderknallers. Anderling vond ze stiekem prachtig.'],['George','Klanten van Zweinstein krijgen geen korting. Grapje. Ook niet.'],['Fred','Dwergpluisjes! Ze zingen niet, maar ze zijn wel heel zacht.'],['George','Spijbelsnoepdozen: de ene kant maakt je ziek, de andere weer beter.'],['Fred','Wie heeft er gezegd dat jij een kanariecreme mocht pakken?']];
const ITEMS=[
 {id:'wildvuur',naam:'Wildvuur Wonderknallers',prijs:160,van:30,img:'img/pu/fg-wildvuur.webp',tekst:'Booster: vier knalbommen op het bord. Je laat ze zelf afgaan met een match ernaast.',soort:'bo'},
 {id:'spijbel',naam:'Spijbelsnoepdoos',prijs:140,van:10,img:'img/pu/fg-spijbel.webp',tekst:'Booster: vijf extra zetten.',soort:'bo'},
 {id:'peru',naam:'Instant Duisternispoeder',prijs:240,van:50,img:'img/pu/fg-peru.webp',tekst:'Booster uit Peru: even donker, dan een Evanesco Maxima.',soort:'bo'},
 {id:'knalpijl',naam:'Kleine Knalpijl',prijs:120,van:25,img:'img/pu/fg-knalpijl.webp',tekst:'Booster: schiet bij de start vanzelf één hele rij leeg.',soort:'bo'},
 {id:'vuurpijl',naam:'Grote Weasley-Vuurpijl',prijs:300,van:60,img:'img/pu/fg-vuurpijl.webp',tekst:'Booster: een vuurdraak brandt bij de start drie rijen weg.',soort:'bo'},
 {id:'kikker',naam:'Chocokikker',prijs:60,img:'img/stukken/chocokikker-128.webp',tekst:'Een extra hart én een tovenaarskaart.',soort:'nu'},
 {id:'fopstok',naam:'Fopstokje',prijs:25,img:'img/stukken/toverstaf-128.webp',tekst:'Lijkt een echte toverstok… tot je zwaait.',soort:'nu'},
 {id:'pluis',naam:'Dwergpluisje',prijs:100,van:5,img:'',tekst:'Een zacht huisdiertje in je eigen kleur. Woont op de toonbank.',soort:'pluis'}];
function kassa(){const k=document.getElementById('fgkassa');if(k){k.classList.remove('rinkel');void k.offsetWidth;k.classList.add('rinkel')}try{fx.speel('kassa')}catch(e){}}
function zeg(i){const g=i!=null?GRAP[i]:GRAP[Math.random()*GRAP.length|0];const el=document.getElementById('fgpraat');if(el)el.innerHTML=`<b>${g[0]}:</b> ${g[1]}`}
function koop(it,kl){if(it.van&&(S.m3lvl|0)<it.van){fgZeg('Die verkopen we je pas vanaf level '+it.van+'. Eerst nog even oefenen!');return}if(S.galjoenen<it.prijs){zeg();const el=document.getElementById('fgpraat');if(el)el.innerHTML='<b>George:</b> Daar heb je niet genoeg Smekkies voor. Geen zorgen, wij geven ook geen krediet.';return}
 S.galjoenen-=it.prijs;
 if(it.soort=='bo'){S.bo[it.id]=(S.bo[it.id]|0)+1;fgZeg(`Ligt klaar bij je boosters. Kies hem voor een level!`)}
 if(it.id=='kikker'){try{levens();if(S.harten.n<5)S.harten.n++}catch(e){}let n='',im='';try{const pool=KAARTEN.filter(k=>k[3]);let kr=trekKaart();if(!kr[3])kr=pool[Math.random()*pool.length|0];S.kaarten[kr[0]]=(S.kaarten[kr[0]]||0)+1;n=kr[0];im=kr[3]}catch(e){}kikkerShow(n,im);fgZeg(`Een extra hart${n?' en de kaart van '+n:''}! Hij springt wel, dus pak hem snel.`)}
 if(it.id=='fopstok'){fopstok()}
 if(it.id=='pluis'){S.fg.pluis.push(kl);fgZeg('Een Dwergpluisje! Hij heet nog niets. Wij stellen "Arnold" voor.')}
 bewaar();try{stats()}catch(e){}kassa();teken()}
function fgZeg(t){const el=document.getElementById('fgpraat');if(el)el.innerHTML=`<b>${Math.random()<.5?'Fred':'George'}:</b> ${t}`}
function kikkerShow(n,im){const d=document.createElement('div');d.className='fgkik';d.innerHTML=`<img class="kik" src="img/stukken/chocokikker-256.webp" alt=""><div class="kaart">${im?`<img src="${im}" alt="">`:''}<b>${n}</b><small>+1 hart</small></div>`;document.body.appendChild(d);requestAnimationFrame(()=>d.classList.add('spring'));d.onclick=()=>d.remove();setTimeout(()=>{d.classList.add('weg');setTimeout(()=>d.remove(),600)},3600)}
function fopstok(){const d=document.createElement('div');d.className='fgfop';d.innerHTML='<img src="img/stukken/toverstaf-128.webp" alt=""><span>🐔</span>';document.body.appendChild(d);setTimeout(()=>d.classList.add('kip'),700);setTimeout(()=>d.remove(),2600);fgZeg('Piep! Een rubberen kip. Die is nooit oud.')}
let pluisKeuze=0;
function teken(){const box=document.getElementById('fgitems');if(!box)return;
 box.innerHTML=ITEMS.map(it=>`<div class="fgitem ${it.van&&(S.m3lvl|0)<it.van?'dicht':''}"><div class="fgbeeld">${it.soort=='pluis'?pluisSvg(PLUISKL[pluisKeuze][1]):`<img src="${it.img}" alt="">`}</div><div class="fgtxt"><b>${it.naam}</b><small>${it.tekst}${it.soort=='bo'&&S.bo[it.id]?` In je kist: ${S.bo[it.id]}.`:''}</small>${it.soort=='pluis'?`<div class="fgkl">${PLUISKL.map(([n,k],i)=>`<button class="fgklb ${i==pluisKeuze?'aan':''}" data-kl="${i}" style="background:${k}" aria-label="${n}"></button>`).join('')}</div>`:''}</div>${it.van&&(S.m3lvl|0)<it.van?`<span class="fgslot">Vanaf level ${it.van}</span>`:`<button class="knop klein fgkoop" data-id="${it.id}"><img src="img/smekkies/boon-oranje-64.webp" alt="">${it.prijs}</button>`}</div>`).join('');
 const t=document.getElementById('fgtoonbank');if(t)t.innerHTML=S.fg.pluis.slice(-6).map((k,i)=>pluisSvg(k,'pluis zit p'+i)).join('');
 box.querySelectorAll('.fgkoop').forEach(b=>b.onclick=()=>koop(ITEMS.find(x=>x.id==b.dataset.id),PLUISKL[pluisKeuze][1]));
 box.querySelectorAll('.fgklb').forEach(b=>b.onclick=()=>{pluisKeuze=+b.dataset.kl;teken()})}
V.fopshop=()=>{VIEWDECOR.fopshop='zaal';S.fg.bezoek=(S.fg.bezoek|0)+1;bewaar();
 const kl=innerWidth<=700?'winkel-klein':'winkel';
 app(`<div class="fgwinkel"><div class="fgscene" id="fgscene" style="background-image:url('img/fg/${kl}.webp')">
  <div class="fglaag fgbellen">${Array.from({length:9},(_,i)=>`<i style="left:${8+i*10}%;animation-delay:${-i*1.7}s;--h:${120+i*17}%"></i>`).join('')}</div>
  <img class="fglaag fgbord" src="img/fg/bord.webp" alt="Weasleys’ Wizard Wheezes">
  <img class="fgkassa" id="fgkassa" src="img/fg/kassa.webp" alt="kassa">
  <div class="fgtoonbank" id="fgtoonbank"></div>
  <div class="fgpraat" id="fgpraat" role="status"></div>
 </div>
 <h2 class="fgtitel">Tovertweelings Topfopshop</h2><p class="klein fgsub">Wegisweg 93 · eigenaars: Fred en George Wemel</p>
 <div id="fgitems" class="fgitems"></div><button class="knop" onclick="ga('meer')">Terug</button></div>`);
 zeg(S.fg.bezoek<=1?0:null);teken();
 const sc=document.getElementById('fgscene');sc.onclick=e=>{if(e.target.closest('.fgkassa')){kassa();zeg();return}vuurwerk(sc,2);zeg()};
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const lag=[...sc.querySelectorAll('.fglaag')];const mv=e=>{const r=sc.getBoundingClientRect();const x=((e.clientX-r.left)/r.width-.5),y=((e.clientY-r.top)/r.height-.5);lag.forEach((l,i)=>l.style.transform=`translate(${x*(8+i*6)}px,${y*(6+i*4)}px)`)};sc.addEventListener('pointermove',mv)}
 const iv=setInterval(()=>{if(!document.getElementById('fgscene')){clearInterval(iv);return}vuurwerk(document.getElementById('fgscene'),1)},4200)};
const _meer=V.meer;V.meer=(...a)=>{const r=_meer(...a);try{const h=document.querySelector('#app h1,#app h2');if(h&&!document.getElementById('meerfg'))h.insertAdjacentHTML('afterend',`<button class="knop volgende meerfg" id="meerfg" onclick="ga('fopshop')"><img src="img/pu/fg-wildvuur.webp" alt=""> Tovertweelings Topfopshop</button>`)}catch(e){}return r};
})();
