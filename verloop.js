'use strict';
/* Spelverloop: Chocokikkers eten, kaartenbronnen, spreukvolgorde, cadeaus op mijlpalen,
   strikflesje terug bij verlies, en de winreeks van Fred & George. */
(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const T=(f,ms)=>setTimeout(()=>{try{f()}catch(e){console.warn(e)}},ms||0);
const modal=html=>{const o=document.createElement('div');o.className='modal';o.innerHTML=`<div class="perkament modalin rococo">${html}</div>`;document.body.appendChild(o);return o};
const port=k=>{try{return window.portret?portret(k,'mini'):''}catch(e){return ''}};

/* ---------- Chocokikkers: niet te sparen. Elke kikker geeft meteen +1 hartje; zijn je levens vol, dan 15 Smekkies. ---------- */
const KIK_SMEK=15,KIK_PRIJS=60,HMAX=5;
const hartVerf=()=>{try{document.querySelectorAll('#halharten,.m3voor .harten,.modal[data-pop=kikker] .harten').forEach(h=>h.innerHTML=harten())}catch(e){}try{stats()}catch(e){}};
function kikZin(r){const d=[];if(r.hart)d.push('+'+r.hart+(r.hart==1?' hartje':' hartjes'));if(r.smek)d.push((r.hart?'levens vol: ':'Levens vol: ')+'+'+r.smek+' Smekkies');return d.join(', ')}
/* n kikkers ontvangen: opt.stil = geen melding, opt.tel=false = niet meetellen voor uitdagingen */
window.kikkerKrijg=(n,opt={})=>{n=n|0;const r={hart:0,smek:0};if(n<=0)return r;S.harten=S.harten||{n:HMAX,t:Date.now()};
 for(let i=0;i<n;i++){if(levens()<HMAX){S.harten.n=Math.min(HMAX,S.harten.n+1);if(S.harten.n>=HMAX)S.harten.t=Date.now();r.hart++}else{S.galjoenen=(S.galjoenen|0)+KIK_SMEK;r.smek+=KIK_SMEK}}
 if(opt.tel!==false)S.kikTot=(S.kikTot|0)+n;S.kikkers=0;bewaar();hartVerf();
 if(!opt.stil)setTimeout(()=>{try{toast('🐸 '+(n>1?n+' Chocokikkers: ':'Chocokikker: ')+kikZin(r))}catch(e){}},opt.wacht|0);return r};
window.kikkerZin=kikZin;
/* oude voorraad (en oud tegoed) één keer omzetten */
{const oud=(S.kikkers|0)+(S.kikkersTegoed|0);delete S.kikkersTegoed;S.kikkers=0;if(oud>0){const r=kikkerKrijg(oud,{stil:1,tel:false});S.kikOmgezet=oud;setTimeout(()=>{try{toast(`🐸 Je ${oud} bewaarde ${oud==1?'Chocokikker is':'Chocokikkers zijn'} opgegeten: ${kikZin(r)}.`)}catch(e){}},3500)}else bewaar()}
/* vangnet: komt er toch ergens een kikker in S.kikkers, dan meteen toepassen */
setInterval(()=>{if((S.kikkers|0)>0){const n=S.kikkers|0;S.kikkers=0;kikkerKrijg(n)}},1000);
const wachtTijd=()=>{const h=S.harten;if(levens()>=HMAX)return 0;return Math.max(1,Math.ceil((20*6e4-(Date.now()-h.t))/6e4))};
window.hartTik=()=>{if(document.querySelector('.modal[data-pop=kikker]'))return;const n=levens(),vol=n>=HMAX,genoeg=(S.galjoenen|0)>=KIK_PRIJS;
 const o=modal(`<h2>Je levens</h2><p class="harten groot">${harten()}</p>
 ${vol?`<p>Je levens zijn vol. Veel speelplezier!</p>`:`<p>${n<1?'Je hartjes zijn op. ':''}Over ongeveer <b>${wachtTijd()} min</b> komt er vanzelf een hartje bij.</p>
 <p><img src="img/stukken/chocokikker-128.webp" alt="" style="width:56px;vertical-align:middle"> Of koop een Chocokikker: die geeft meteen <b>+1 hartje</b>.</p>
 <button class="knop volgende${genoeg?'':' kikvol'}" id="kikkoop"${genoeg?'':' disabled'}>🐸 Koop een Chocokikker (${KIK_PRIJS} Smekkies)</button>${genoeg?'':`<p class="klein">Daar heb je nog niet genoeg Smekkies voor.</p>`}`}
 <button class="linkknop" id="kikdicht">Sluiten</button>`);o.dataset.pop='kikker';
 const e=o.querySelector('#kikkoop');if(e)e.onclick=()=>{if(levens()>=HMAX){toast('Je levens zijn vol.');o.remove();return}if((S.galjoenen|0)<KIK_PRIJS)return;S.galjoenen-=KIK_PRIJS;kikkerKrijg(1,{stil:1});try{fx.speel('goed')}catch(x){}try{vib([20,30,40])}catch(x){}
  toast('Mmm, chocola! +1 hartje');o.remove();hartVerf()};
 o.querySelector('#kikdicht').onclick=()=>o.remove()};
document.addEventListener('click',e=>{const h=e.target.closest('#halharten,.m3voor .harten');if(h)hartTik()});
/* geen kikkervoorraad meer naast de harten */
V.kikker=()=>V.album();

/* ---------- kaarten: eigen bronnen ---------- */
function geefKaart(wie,zin){let k;try{k=trekKaart()}catch(e){return}const nieuw=!S.kaarten[k[0]];S.kaarten[k[0]]=(S.kaarten[k[0]]||0)+1;bewaar();
 T(()=>{const o=modal(`<h2>Een tovenaarskaart!</h2>${wie?`<p><b>${wie}:</b> ${zin}</p>`:''}<p class="kaartnieuw"><b>${k[0]}</b><br><small>${nieuw?'Nieuw in je album!':'Die had je al. Hij staat nu dubbel in je album.'}</small></p><button class="knop volgende" id="kaalb">Naar mijn album</button><button class="linkknop" id="kadi">Verder</button>`);try{fx.speel('fanfare')}catch(e){}
  o.querySelector('#kaalb').onclick=()=>{document.querySelectorAll('.modal').forEach(m=>m.remove());ga('album')};o.querySelector('#kadi').onclick=()=>o.remove()},2600)}
const KAARTCADEAU={10:['Hagrid','Ik vond deze kaart in een oude Chocokikkerdoos. Die is voor jou, hè.'],25:['Fred en George','Psst! Een kaart uit onze geheime voorraad. Niet aan Ma vertellen.'],50:['Mevrouw Varenkamp','Voor mijn beste klant. Deze kaart lag nog onder de toonbank.']};

/* ---------- spreuken: “Nieuwe les!” in de Hal ---------- */
function nieuweLes(){const L=window.SPREUK_VAN||{};return Object.keys(L).find(k=>spreukOpen(k)&&!spreukGeleerd(k))}
const _home=V.home;V.home=(...a)=>{const r=_home(...a);try{const k=nieuweLes();if(k&&!document.getElementById('nieuwles')){const naam=SPREUK_LES[k].naam;const app=document.getElementById('app');const h=document.getElementById('halharten');
  (h||app.firstChild).insertAdjacentHTML(h?'afterend':'beforebegin',`<div style="text-align:center"><button class="knop volgende nieuwles" id="nieuwles" onclick="ga('spreukles',0,'${k}')">✨ Nieuwe les! ${naam} bij Professor Banning</button></div>`);
  S.lesPop=S.lesPop||{};if(!S.lesPop[k]){let poging=0;const toon=()=>{if(S.lesPop[k])return;if(document.querySelector('.modal,.verhaal')||document.body.dataset.view!=='home'){if(poging++<40)setTimeout(toon,3000);return}S.lesPop[k]=1;bewaar();const wat={flipendo:'Daarmee open je straks de kooi bij het water in je kas.',leviosa:'Daarmee laat je in de levels een stuk zweven en wegzetten. Je krijgt er meteen drie ladingen bij.',alohomora:'Daarmee open je deuren en sloten, ook in de bonuskamer.'}[k]||'';
   const o=modal(`<h2>Nieuwe les!</h2><p>${port('banning')} <b>Professor Banning:</b> Goed gedaan! Vandaag leer ik je <b>${naam}</b>. ${wat}</p><button class="knop volgende" id="lesja">Naar de les</button><button class="linkknop" id="lesnee">Straks</button>`);o.querySelector('#lesja').onclick=()=>{o.remove();ga('spreukles',0,k)};o.querySelector('#lesnee').onclick=()=>o.remove()};setTimeout(toon,1200)}}}catch(e){console.warn(e)}return r};
// Leviosa geleerd: drie ladingen
setInterval(()=>{if(window.spreukGeleerd&&spreukGeleerd('leviosa')&&!S.levStart){S.levStart=1;S.levLad=Math.max(3,S.levLad|0);bewaar()}},2000);

/* ---------- Gouden Snaai booster ---------- */
function wachtVrij(b,fn,w){if(typeof M3==='undefined'||M3.b!==b)return;if(document.body.classList.contains('lvintro')||document.querySelector('.modal')||document.querySelector('#gids.zien button')){setTimeout(()=>wachtVrij(b,fn,1),300);return}if(w){setTimeout(()=>wachtVrij(b,fn,0),600);return}fn()}
function snaaiVlucht(b){const cv0=document.getElementById('m3c');if(!cv0||!M3.knal)return;const R0=cv0.getBoundingClientRect(),ch=R0.height/RIJEN,cw=R0.width/KOL;
 const cv=document.createElement('canvas');cv.className='fgraket';const dpr=Math.min(2,devicePixelRatio||1),pad=50;cv.style.cssText=`left:${R0.left-pad}px;top:${R0.top-pad}px;width:${R0.width+pad*2}px;height:${R0.height+pad*2}px`;cv.width=(R0.width+pad*2)*dpr;cv.height=(R0.height+pad*2)*dpr;document.body.appendChild(cv);
 const g=cv.getContext('2d');g.scale(dpr,dpr);const img=new Image();img.src='img/stukken/snaai-128.webp';const D=RM?900:2600,t0=performance.now(),cel=new Set(),spoor=[],ringen=[];
 try{if(!(window.zwSpeel&&zwSpeel('whoosh',.7)))fx.speel('tover')}catch(e){}
 const pos=p=>[pad+R0.width*(.5+.42*Math.sin(p*Math.PI*2*1.5+.4)),pad+R0.height*(.5+.42*Math.sin(p*Math.PI*2*2.5))];
 const stap=nu=>{const t=nu-t0,p=Math.min(1,t/D);g.clearRect(0,0,cv.width,cv.height);const[x,y]=pos(p);
  const c=Math.floor((x-pad)/cw),r=Math.floor((y-pad)/ch);for(let dr=-1;dr<=0;dr++)for(let dc=-1;dc<=0;dc++){const rr=r+dr*(dr&&(t|0)%2),cc=c;if(rr>=0&&rr<RIJEN&&cc>=0&&cc<KOL){const k=rr+','+cc;if(!cel.has(k)){cel.add(k);ringen.push({x:pad+(cc+.5)*cw,y:pad+(rr+.5)*ch,t})}}}
  spoor.push([x,y]);if(spoor.length>26)spoor.shift();spoor.forEach(([sx,sy],i)=>{g.fillStyle=`rgba(255,215,110,${i/spoor.length*.5})`;g.beginPath();g.arc(sx,sy,2+i/spoor.length*5,0,6.283);g.fill()});
  ringen.forEach(q=>{const k=(t-q.t)/600;if(k>1)return;g.strokeStyle=`rgba(255,220,120,${.6*(1-k)})`;g.lineWidth=2;g.beginPath();g.arc(q.x,q.y,cw*.2+k*cw*.4,0,6.283);g.stroke()});
  const z=ch*1.3,vl=Math.sin(t/40)*.25;g.save();g.translate(x,y);g.rotate(vl*.3);if(img.complete&&img.naturalWidth)g.drawImage(img,-z/2,-z/2,z,z);else{g.fillStyle='#e8c24a';g.beginPath();g.arc(0,0,z/4,0,6.283);g.fill()}g.restore();
  if(p<1)requestAnimationFrame(stap);else{try{if(!(window.zwSpeel&&zwSpeel('vuurwerk',.7)))fx.speel('fanfare')}catch(e){}
   const lijst=[...cel].map(k=>k.split(',').map(Number));while(lijst.length<30){const q=[Math.random()*RIJEN|0,Math.random()*KOL|0];if(!cel.has(q+'')){cel.add(q+'');lijst.push(q)}}
   let poging=0;const knal=async()=>{const ok=await M3.knal(lijst);if(!ok&&poging++<20)setTimeout(knal,250)};knal();setTimeout(()=>cv.remove(),400)}};
 requestAnimationFrame(stap)}
window.fgSnaai=snaaiVlucht;
const _nb=window.m3NaBord;window.m3NaBord=(b,boost)=>{const bo=(boost&&boost.bo)||[];const heb=bo.includes('snaai')&&S.bo.snaai>0;_nb(b,boost);if(heb)setTimeout(()=>wachtVrij(b,()=>snaaiVlucht(b)),900)};

/* ---------- winreeks: cadeaus van Fred & George ---------- */
const REEKS=[null,{knalpijl:1},{knalpijl:3},{vuurpijl:1},{vuurpijl:1,knalpijl:2},{snaai:1}];
const NAAM={knalpijl:['Kleine Knalpijl','Kleine Knalpijlen'],vuurpijl:['Grote Weasley-Vuurpijl','Grote Weasley-Vuurpijlen'],snaai:['Gouden Snaai','Gouden Snaaien']};
const giftTekst=g=>Object.entries(g).map(([k,n])=>n+' '+NAAM[k][n>1?1:0]).join(' en ');
const giftIco=g=>Object.entries(g).map(([k,n])=>Array.from({length:n},()=>`<img src="img/pu/fg-${k}.webp" alt="">`).join('')).join('');
const meter=v=>`<span class="fgmeter">${[1,2,3,4,5].map(i=>`<i class="${i<=v?'aan':''}">${i==5?'⚡':i}</i>`).join('')}</span>`;
S.fgReeks=S.fgReeks|0;
const _vm=V.match3;V.match3=async function(n,...a){const r=await _vm.call(this,n,...a);try{n=n||S.m3lvl||1;const h=document.querySelector('.m3voor .harten');if(h&&!document.querySelector('.m3voor .fgreeks')){const nieuw=n>=(S.m3lvl|0);const v=S.fgReeks|0;
  h.insertAdjacentHTML('afterend',`<div class="fgreeks"><b>Reeks van Fred &amp; George</b> ${meter(v)}<small>${nieuw?`Win dit level voor: ${giftIco(REEKS[v+1])} ${giftTekst(REEKS[v+1])}`:'Een level opnieuw spelen telt niet mee voor de reeks.'}</small></div>`)}}catch(e){console.warn(e)}return r};
const _mv=m3Verlies;m3Verlies=function(n,b){const was=S.fgReeks|0;S.fgReeks=0;
 // strikflesje terug
 if(window._flesInzet&&window._flesInzet.n==n){const id=window._flesInzet.id;S.flesjes[id]=(S.flesjes[id]|0)+1;window._flesInzet=null;T(()=>toast('Je flesje is terug in je kist. Probeer het gerust nog eens.'),1200)}
 bewaar();const r=_mv(n,b);try{if(was>0){const p=document.querySelector('.m3eind p');if(p)p.insertAdjacentHTML('afterend',`<p class="klein fgweg">De reeks van Fred &amp; George begint weer bij 1.</p>`)}}catch(e){}return r};
const _ga=ga;ga=function(s,...a){if(window._flesInzet&&s!=='match3'&&document.body.dataset.view==='match3'&&!document.querySelector('.m3eind')){const id=window._flesInzet.id;S.flesjes[id]=(S.flesjes[id]|0)+1;window._flesInzet=null;bewaar();T(()=>toast('Je flesje staat weer in je kist.'),600)}return _ga(s,...a)};
const _mw=m3Winst;m3Winst=function(n,b){const eerste=n>=(S.m3lvl|0);window._flesInzet=null;let gift=null,stand=0;
 if(eerste){stand=(S.fgReeks|0)+1;gift=REEKS[stand];Object.entries(gift).forEach(([k,x])=>S.bo[k]=(S.bo[k]|0)+x);S.fgReeks=stand>=5?0:stand}
 // mijlpalen
 if(eerste&&n===30&&!heeftGroenePot()){S.potUpgrade=Math.max(1,S.potUpgrade|0);S.groenGift=1}
 if(eerste&&n===20){S.bo.bom=(S.bo.bom|0)+1;S.gift20=1}
 bewaar();const r=_mw(n,b);
 try{const m=document.querySelector('.m3eind');if(m&&gift){const vol=stand>=5;const zin=vol?'Vijf op rij! Hier is de Gouden Snaai. Pak hem voor hij wegvliegt!':['','Eén op rij! Een Kleine Knalpijl van het huis.','Twee op rij! Drie Knalpijlen, want wij zijn gul.','Drie op rij! Een Grote Weasley-Vuurpijl. Draken inbegrepen.','Vier op rij! Een Grote én twee Kleine. Nog één en je krijgt iets heel bijzonders.'][stand];
   const knop=m.querySelector('#m3verder');(knop||m.lastChild).insertAdjacentHTML('beforebegin',`<div class="fgcadeau"><div class="fgcico">${giftIco(gift)}</div><p><b>${stand%2?'Fred':'George'}:</b> ${zin}</p>${meter(stand)}<small>${vol?'De reeks begint weer bij 1.':'Ligt bij je boosters.'}</small></div>`)}}catch(e){console.warn(e)}
 if(eerste&&n%10===0)geefKaart('','Een mijlpaal! Bij elk 10e level krijg je een tovenaarskaart.');
 if(eerste&&KAARTCADEAU[n])geefKaart(...KAARTCADEAU[n]);
 if(S.groenGift===1){S.groenGift=2;bewaar();T(()=>{const o=modal(`<h2>Een cadeau van Professor Stronk</h2><img src="img/kas/pot1.webp" alt="" style="width:96px;display:block;margin:.3em auto"><p><b>Professor Stronk:</b> Level 30, knap gedaan! Hier is de groene <b>Kruidenpot</b>. Hij staat al op je tafel. Daarin groeien Duivelsstrik, Tentacula en Sodejus.</p><button class="knop volgende" id="grok">Dank u, professor!</button>`);o.querySelector('#grok').onclick=()=>o.remove()},2200)}
 if(S.gift20===1){S.gift20=2;bewaar();T(()=>{const o=modal(`<h2>Pas op: zware levels!</h2><img src="img/pu/bom-rood.webp" alt="" style="width:80px;display:block;margin:.3em auto"><p><b>Tilly:</b> Na level 20 komen er zware levels (🔥) en heel zware levels (💀). Die lukken bijna niet zonder hulp. Hier heb je alvast een <b>Gekleurde bommen</b>-booster. Kies hem bij de start van een zwaar level!</p><button class="knop volgende" id="g20ok">Begrepen</button>`);o.querySelector('#g20ok').onclick=()=>o.remove()},2200)}
 if(!S.uitleg||!S.uitleg.schild){S.uitleg=S.uitleg||{};S.uitleg.schild=1;bewaar();T(()=>{try{gids('<b>Huisschilden</b><br>Elk level geeft één huisschild per ster, dus 1 tot 3. Speel je een level later beter, dan krijg je alleen de extra sterren erbij. Daarmee knap je de lokalen op in de Hal.',{knop:'Begrepen',mood:'praat'})}catch(e){}},3200)}
 return r};
// oude saves voorbij level 30 zonder groene pot: alsnog het cadeau
if((S.m3lvl|0)>30&&!heeftGroenePot()){S.potUpgrade=Math.max(1,S.potUpgrade|0);bewaar();T(()=>toast('Professor Stronk zette de groene Kruidenpot op je tafel. Een cadeau!'),4000)}

/* ---------- eerste bezoek: één zin van Tilly ---------- */
try{Object.assign(UITLEG,{
 ketel:['De ketel','Kies een recept, sleep de kruiden in de ketel en roer met je vinger. Elk drankje dat je voor het eerst brouwt, geeft Smekkies.'],
 fopshop:['De Fopshop','Hier verkopen Fred en George boosters en Chocokikkers (+1 hartje, alleen als je een hartje mist). Nieuwe spullen komen vrij als je verder komt.'],
 kruidwinkel:['De Groene Alruin','Hier koop je zaadjes, drakenmest en gedroogde kruiden voor je recepten. Sommige zaadjes komen pas later vrij.'],
 spreuken:['Spreuklessen','Kijk hoe het lichtje het teken voordoet en teken het na met je vinger. Professor Banning geeft steeds een nieuwe spreuk als je verder komt.'],
 beker:['De Afdelingsbeker','Elk level levert punten op voor je afdeling. Hier zie je wie er voor de beker gaat.'],
 moestuin:['Hagrids moestuin','Hagrid kweekt reuzenpompoenen. Als er een rijp is, zit er een verrassing in.']})}catch(e){}
})();
