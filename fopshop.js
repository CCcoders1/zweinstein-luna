'use strict';
/* Tovertweelings Topfopshop van Fred en George Wemel (Wegisweg 93). */
(function(){
S.fg=S.fg||{pluis:[],bezoek:0};
const PLUISKL=[['roze','#ff8fc8'],['paars','#b07cff'],['geel','#ffd34d'],['blauw','#6fc8ff'],['groen','#7ee08a']];
window.pluisSvg=(kl,cls)=>`<svg class="${cls||'pluis'}" viewBox="0 0 100 100" aria-hidden="true"><g fill="${kl}">${Array.from({length:18},(_,i)=>{const a=i/18*6.283;return `<circle cx="${50+Math.cos(a)*30}" cy="${54+Math.sin(a)*28}" r="15"/>`}).join('')}<circle cx="50" cy="54" r="34"/></g><ellipse cx="38" cy="50" rx="7" ry="9" fill="#2a1630"/><ellipse cx="62" cy="50" rx="7" ry="9" fill="#2a1630"/><circle cx="40" cy="47" r="2.6" fill="#fff"/><circle cx="64" cy="47" r="2.6" fill="#fff"/><path d="M42 66 Q50 73 58 66" stroke="#2a1630" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="30" cy="62" rx="5" ry="3" fill="#ff5fa2" opacity=".45"/><ellipse cx="70" cy="62" rx="5" ry="3" fill="#ff5fa2" opacity=".45"/></svg>`;
/* boosters erbij in het bestaande boostersysteem */
Object.assign(BOOSTERS,{
 wildvuur:{prijs:60,naam:'Wildvuur Wonderknallers',kort:'4 knalbommen',img:'fg-wildvuur',uitleg:'Weasleys’ Wildvuur Wonderknallers! Vier knalbommen staan op het bord. Laat ze afgaan met een match ernaast.'},
 spijbel:{prijs:50,naam:'Spijbelsnoepdoos',kort:'+5 zetten',img:'fg-spijbel',uitleg:'Eén hapje van de Spijbelsnoepdoos en je krijgt vijf extra zetten. Niet aan Anderling vertellen.'},
 peru:{prijs:90,naam:'Instant Duisternispoeder',kort:'Verdwijnspreuk',img:'fg-peru',uitleg:'Instant Duisternispoeder uit Peru. Even is alles donker… en dan ligt er een Zware Verdwijnspreuk op het bord.'}});
const _nb=window.m3NaBord;
window.m3NaBord=(b,boost)=>{const bo=(boost&&boost.bo)||[];const heb={};bo.forEach(k=>heb[k]=S.bo[k]>0);_nb(b,boost);
 const vrij=()=>{const L=[];for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=b.g[r][c];if(t&&t.k>=0&&!t.s&&!b.kist[r][c]&&!(b.strik&&b.strik[r][c]))L.push([r,c])}return L};
 const rnd=a=>a.splice(Math.random()*a.length|0,1)[0];
 if(heb.wildvuur){const v=vrij();for(let i=0;i<4&&v.length;i++){const[r,c]=rnd(v);b.g[r][c].s='kbom'}vuurwerk(document.getElementById('m3d')||document.body,7);try{fx.speel('tover')}catch(e){}}
 if(heb.spijbel){b.zet+=5;try{toast('Spijbelsnoepdoos: +5 zetten!')}catch(e){}}
 if(heb.peru){const d=document.createElement('div');d.className='fgduister';document.body.appendChild(d);setTimeout(()=>{const v=vrij().filter(([r])=>r>=2&&r<=5);if(v.length){const[r,c]=rnd(v);b.g[r][c].s='verdwijn'}d.classList.add('weg');setTimeout(()=>d.remove(),1400)},1300)}
 try{M3.toonFx&&M3.toonFx()}catch(e){}};
/* rustig vuurwerk (geen flitsen: zachte fade, lage helderheid) */
function vuurwerk(host,n){if(matchMedia('(prefers-reduced-motion: reduce)').matches)n=Math.min(n,2);const r=host.getBoundingClientRect();
 for(let i=0;i<n;i++)setTimeout(()=>{const e=document.createElement('img');e.src='img/fg/fireworks-sparks-'+(1+(i%2))+'.webp';e.className='fgknal';const z=90+Math.random()*90;e.style.cssText=`left:${r.left+Math.random()*(r.width-z)}px;top:${r.top+Math.random()*Math.max(40,r.height*.6)}px;width:${z}px;filter:hue-rotate(${Math.random()*360|0}deg)`;document.body.appendChild(e);setTimeout(()=>e.remove(),1700)},i*260)}
window.fgVuurwerk=vuurwerk;
const GRAP=[['Fred','Waarom ben je zo verdrietig, Gred?'],['George','Ik weet het niet, Feorge. Misschien omdat ze nog niets gekocht heeft.'],['George','Ik ben Fred niet, ik ben George!'],['Fred','Eerlijk, mens. Noem jij jezelf een tovenares?'],['George','Ik ben zo heilig als een gatenkaas. Snap je? Ik heb een oor kwijt!'],['Fred','Weasleys’ Wildvuur Wonderknallers. Anderling vond ze stiekem prachtig.'],['George','Klanten van Zweinstein krijgen geen korting. Grapje. Ook niet.'],['Fred','Dwergpluisjes! Ze zingen niet, maar ze zijn wel heel zacht.'],['George','Spijbelsnoepdozen: de ene kant maakt je ziek, de andere weer beter.'],['Fred','Wie heeft er gezegd dat jij een kanariecreme mocht pakken?']];
const ITEMS=[
 {id:'wildvuur',naam:'Wildvuur Wonderknallers',prijs:60,img:'img/pu/fg-wildvuur.webp',tekst:'Booster: vier knalbommen en vuurwerk over het bord.',soort:'bo'},
 {id:'spijbel',naam:'Spijbelsnoepdoos',prijs:50,img:'img/pu/fg-spijbel.webp',tekst:'Booster: vijf extra zetten.',soort:'bo'},
 {id:'peru',naam:'Instant Duisternispoeder',prijs:90,img:'img/pu/fg-peru.webp',tekst:'Booster uit Peru: even donker, dan een Zware Verdwijnspreuk.',soort:'bo'},
 {id:'kikker',naam:'Chocokikker',prijs:25,img:'img/stukken/chocokikker-128.webp',tekst:'Een extra hart én een tovenaarskaart.',soort:'nu'},
 {id:'fopstok',naam:'Fopstokje',prijs:10,img:'img/stukken/toverstaf-128.webp',tekst:'Lijkt een echte toverstok… tot je zwaait.',soort:'nu'},
 {id:'pluis',naam:'Dwergpluisje',prijs:40,img:'',tekst:'Een zacht huisdiertje in je eigen kleur. Woont op de toonbank.',soort:'pluis'}];
function kassa(){const k=document.getElementById('fgkassa');if(k){k.classList.remove('rinkel');void k.offsetWidth;k.classList.add('rinkel')}try{fx.speel('kassa')}catch(e){}}
function zeg(i){const g=i!=null?GRAP[i]:GRAP[Math.random()*GRAP.length|0];const el=document.getElementById('fgpraat');if(el)el.innerHTML=`<b>${g[0]}:</b> ${g[1]}`}
function koop(it,kl){if(S.galjoenen<it.prijs){zeg();const el=document.getElementById('fgpraat');if(el)el.innerHTML='<b>George:</b> Daar heb je niet genoeg Smekkies voor. Geen zorgen, wij geven ook geen krediet.';return}
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
 box.innerHTML=ITEMS.map(it=>`<div class="fgitem"><div class="fgbeeld">${it.soort=='pluis'?pluisSvg(PLUISKL[pluisKeuze][1]):`<img src="${it.img}" alt="">`}</div><div class="fgtxt"><b>${it.naam}</b><small>${it.tekst}${it.soort=='bo'&&S.bo[it.id]?` In je kist: ${S.bo[it.id]}.`:''}</small>${it.soort=='pluis'?`<div class="fgkl">${PLUISKL.map(([n,k],i)=>`<button class="fgklb ${i==pluisKeuze?'aan':''}" data-kl="${i}" style="background:${k}" aria-label="${n}"></button>`).join('')}</div>`:''}</div><button class="knop klein fgkoop" data-id="${it.id}"><img src="img/smekkies/boon-oranje-64.webp" alt="">${it.prijs}</button></div>`).join('');
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
