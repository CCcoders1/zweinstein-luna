/* ====== Persoonlijke kassen, tafels, potten, grote pot & superplanten ====== */
(function(){
/* ---- ÉÉN CONFIG voor de superplanten: namen/oogst hier aanpassen ---- */
window.SUPERPLANTEN={
 flessenbes:{naam:'Flessenbessenstruik',latijn:'Ampulla Fructus',oogst:{basis:3},oogstTekst:'3 Toverdrankbasissen',info:'Essences en basissen die je direct kunt gebruiken om toverdranken te mixen.',beeld:'flessenbes',uren:2,prijs:60,vanaf:60},
 bomlicht:{naam:'Bomlichtwortel',latijn:'Lux Bombae',oogst:{bom:3},oogstTekst:'3 Gekleurde Bommen',info:'Deze verschijnen aan het begin van je volgende beurt op je veld.',beeld:'bomlicht',uren:3,prijs:80,vanaf:60},
 bliksemkristal:{naam:'Bliksemkristalplant',latijn:'Fulgur Crystallum',oogst:{bliksem:1},oogstTekst:'Bliksemschicht',info:'Verwijdert alle horizontale én verticale vakjes in een kruis.',beeld:'bliksemkristal',uren:3,prijs:90,vanaf:70},
 goudkristal:{naam:'Goudkristalstruik',latijn:'Aureum Crystallum',oogst:{kristal:3},oogstTekst:'3 Magische Kristallen',info:'Kunnen Smekkies of verzamelitems bevatten.',beeld:'goudkristal',uren:4,prijs:100,vanaf:80},
 eigoud:{naam:'Ei-van-Goudplant',latijn:'Ovum Aureum',oogst:{ei:1},oogstTekst:'Gouden Ei',info:'Bevat een verzamelitem of Smekkies.',beeld:'eigoud',uren:5,prijs:120,vanaf:100},
 spreukvaren:{naam:'Zware Spreukvaren',latijn:'Gravitas Incantatio',oogst:{verdwijn:1},oogstTekst:'Zware Verdwijnspreuk',info:'Tovert bijna de helft van het bord in één keer weg.',beeld:'eigoud',filter:'hue-rotate(150deg) saturate(1.3) brightness(.85)',uren:8,prijs:200,vanaf:150}};
const GROTEPOT_VANAF=60,GROTE_TAFEL_VANAF=101;
const KAMERS=[{id:'oefen',naam:'Stronks oefenkas',van:1,filter:''},{id:'zon',naam:'De Zonnekas',van:200,filter:'sepia(.25) saturate(1.2) brightness(1.04)'},{id:'maan',naam:'De Maanlichtkas',van:350,filter:'hue-rotate(185deg) saturate(.7) brightness(.62)'}];
const lvl=()=>S.m3lvl||1;
S.superzaad=S.superzaad||{};S.superpot=S.superpot||null;
/* ---- nieuwe zaden + plaatjes per groeistadium ---- */
if(typeof ZADEN!='undefined'){ZADEN.tentacula=ZADEN.tentacula||['Giftige Tentacula','tentacula',200,35,'#7ab04a',[1,2]];ZADEN.duivelsstrik=ZADEN.duivelsstrik||['Duivelsstrik','duivelsstrik',150,30,'#7a5aa8',[1,2]]}
const STADIA={varkensgras:[0,1,2,3,3],wolfsmelk:[0,1,2,3,3],alsem:[0,1,2,3,3],affodil:[0,1,2,3,3],sodejus:[0,1,2,3,3],mandragora:[0,1,2,3,4],tentacula:[0,1,2,3,4],duivelsstrik:[0,1,2,3,4]};
const _ps=plantSVG;plantSVG=function(st,kl,z){const m=z&&STADIA[z];if(m)return `<img class="plantimg kst${st}" src="img/kas/${z}-${m[Math.max(0,Math.min(4,st))]}.webp" alt="">`;return _ps.apply(this,arguments)};
/* ---- herbologie-spelstukken (nieuwe stijl; Herinnerbal blijft het rode stuk) ---- */
(function(){if(typeof KU=='undefined')return;const L=[['Herinnerbal','#ff3a40','herinnerbal'],['Mandragora','#d8b070','h-mandragora'],['Gieter','#8fa0a8','h-gieter'],['Zaadzakje','#c8a060','h-zaadzak'],['Oorwarmers','#5a7a3a','h-oorwarmers'],['Duivelsstrik-takje','#a080d0','h-takje'],['Herbologieboek','#2f6a3a','h-boek']];
 const IM={};const r=L.map(([n,k,f])=>{const i=new Image();i.src=`img/stukken/${f}-256.webp`;IM[f]=i;return [n,k,c=>{if(i.complete&&i.naturalWidth)c.drawImage(i,-50,-50,100,100)},f]});
 KU.RECEPT.herbologie=r;if(M3THEMA.herbologie)M3THEMA.herbologie.t=r.map(x=>[x[0],x[1],'M12 4v16']);Promise.all(Object.values(IM).map(i=>i.decode().catch(()=>0))).then(()=>KU.wis&&KU.wis())})();
/* ---- doelkaart-iconen onkruid & kist ---- */
const _di=m3DoelIco;m3DoelIco=function(d,T,L){if(d[0]=='o')return `<img class="m3ico m3ico-it" src="img/doel/icoon-onkruid.webp" alt="onkruid" style="background:#4f7a3a">`;if(d[0]=='k')return `<img class="m3ico m3ico-it" src="img/doel/icoon-kist.webp" alt="kistjes" style="background:#8a5a2b">`;return _di.apply(this,arguments)};
/* ---- persoonlijke kas achter de deur ---- */
const MEGA_VANAF=[60,150,300],PLEK_VANAF=[1,20,40],GROTE_TAFEL=101;
// migratie oude saves
if(S.superpot&&!S.mega){S.mega=[S.superpot];delete S.superpot}S.mega=S.mega||[];
const mp=i=>S.mega[i]||null;
const mpSt=i=>{const p=mp(i);if(!p)return -1;const tot=SUPERPLANTEN[p.z].uren*36e5,v=Date.now()-p.t+(p.bonus||0);return v>=tot?4:Math.min(3,Math.floor(v/tot*4))};
const mpRest=i=>{const p=mp(i);return Math.max(0,SUPERPLANTEN[p.z].uren*36e5-(Date.now()-p.t+(p.bonus||0)))};
const spImg=(z,st)=>{const d=SUPERPLANTEN[z];return `<img class="superimg" src="img/kas/${d.beeld}-${Math.max(0,st)}.webp" alt="" style="${d.filter?'filter:'+d.filter:''}">`};
function superModal(mi){const o=document.createElement('div');o.className='modal';const teken=()=>{const p=mp(mi),st=mpSt(mi);
 o.innerHTML=`<div class="modalin rococo supermodal"><h2>Megapot</h2>${p?`<div class="spnu">${spImg(p.z,st)}<h3>${SUPERPLANTEN[p.z].naam} <small><i>${SUPERPLANTEN[p.z].latijn}</i></small></h3><p>Oogst: <b>${SUPERPLANTEN[p.z].oogstTekst}</b></p>${st==4?'<button class="knop volgende" id="spoogst">Oogsten</button>':`<p class="klein">${FASEN[Math.max(0,st)]} · nog ${tijd(mpRest(mi))}</p><button class="knop klein" id="spmest" ${S.mest?'':'disabled'}>Drakenmest (${S.mest})</button>`}</div>`:
 `<p class="klein">Superplanten groeien alleen in een megapot. Hun oogst neem je mee een level in.</p><div class="splijst">${Object.entries(SUPERPLANTEN).map(([z,d])=>{const open=lvl()>=d.vanaf,heb=S.superzaad[z]||0;return `<div class="spkaart ${open?'':'dicht'}">${spImg(z,4)}<b>${d.naam}</b><small><i>${d.latijn}</i></small><small>Oogst: ${d.oogstTekst} · ${d.uren} uur</small><small class="spinfo">${d.info}</small>${open?(heb?`<button class="knop klein" data-plant="${z}">Planten (×${heb})</button>`:`<button class="knop klein" data-koop="${z}">Zaadje ${d.prijs} Smekkies</button>`):`<span class="slot">Vrij bij level ${d.vanaf}</span>`}</div>`}).join('')}</div>`}<button class="knop klein" id="spdicht">Sluiten</button></div>`;
 o.querySelector('#spdicht').onclick=()=>{o.remove();V.mijnkas()};
 o.querySelectorAll('[data-koop]').forEach(b=>b.onclick=()=>{const z=b.dataset.koop,d=SUPERPLANTEN[z];if(S.galjoenen<d.prijs)return toast('Niet genoeg Smekkies.');S.galjoenen-=d.prijs;S.superzaad[z]=(S.superzaad[z]||0)+1;bewaar();stats();fx.speel('munt');teken()});
 o.querySelectorAll('[data-plant]').forEach(b=>b.onclick=()=>{const z=b.dataset.plant;S.superzaad[z]--;S.mega[mi]={z,t:Date.now(),bonus:0};bewaar();fx.speel('goed');vib(30);toast(SUPERPLANTEN[z].naam+' geplant!');teken()});
 const m=o.querySelector('#spmest');if(m)m.onclick=()=>{S.mest--;S.mega[mi].bonus=(S.mega[mi].bonus||0)+mpRest(mi)*.5;bewaar();toast('Drakenmest: de helft sneller!');teken()};
 const og=o.querySelector('#spoogst');if(og)og.onclick=()=>{const d=SUPERPLANTEN[S.mega[mi].z];Object.entries(d.oogst).forEach(([k,n])=>S.bo[k]=(S.bo[k]||0)+n);S.mega[mi]=null;S.xp+=15;bewaar();stats();fx.speel('munt');vib([30,30,60]);
  const r=og.getBoundingClientRect();Object.keys(d.oogst).forEach(k=>{const e=document.createElement('img');e.src='img/pu/'+BOOSTERS[k].img+'.webp';e.className='puvlieg';e.style.cssText=`left:${r.left+r.width/2-30}px;top:${r.top-20}px`;document.body.appendChild(e);setTimeout(()=>e.remove(),1500)});
  toast('Geoogst: '+d.oogstTekst+'!');setTimeout(()=>{try{gids(`Kijk eens, Luna! ${d.oogstTekst}. Bij het begin van een level kun je ze kiezen. ${BOOSTERS[Object.keys(d.oogst)[0]].uitleg}`,{})}catch(e){}},900);teken()};
 };teken();document.body.appendChild(o);const t=setInterval(()=>{if(!o.isConnected)return clearInterval(t);if(mp(mi)&&mpSt(mi)<4)teken()},5000)}
const PIDX=i=>100+i; // potindexen van de persoonlijke kas (los van de gewone kassen)
const POT_UP=[
 {naam:'Kruidenpot',prijs:500,img:'pot1',tekst:'Groene krullen. Je tweede pot op de tafel. Duivelsstrik, Tentacula en Sodejus groeien alleen hier.'},
 {naam:'Edelsteenpot',prijs:800,img:'pot2',tekst:'Paarse stenen. Weer een plek om te zaaien.'},
 {naam:'Kristalpot',prijs:1200,img:'pot3',tekst:'Blauwe kristallen, voor op de grote tafel.'},
 {naam:'Hartpot',prijs:1600,img:'pot4',tekst:'Donker goud met een hart. De mooiste plek.'}];
const VLOERPOT_PRIJS=300;
S.potUpgrade=S.potUpgrade|0;if(!S.vloerpot&&(S.mega||[]).some(Boolean))S.vloerpot=1;
function slotOpen(i){if(i<0||i>6)return false;if(pot(PIDX(i)))return true;if(i===0)return true;return i<=(S.potUpgrade|0)}
function potImg(i){return 'pot'+Math.min(4,i)}
function verhuisPotten(){if(!S.kweek)return 0;const vrij=[];for(let i=0;i<7;i++)if(!S.kweek[100+i])vrij.push(100+i);
 const oud=Object.keys(S.kweek).map(Number).filter(i=>i<100&&S.kweek[i]).sort((a,b)=>a-b);let n=0;
 oud.forEach(i=>{if(!vrij.length)return;const naar=vrij.shift();S.kweek[naar]=S.kweek[i];delete S.kweek[i];n++});
 if(n){bewaar();if(!S.kasVerhuisMeld)window._kasVersMeld=1}return n}
verhuisPotten();
function potHTML(i){const p=pot(PIDX(i)),st=p?stadium(p):-1;return `<div class="kpot mk-pot ${st==4?'rijp':''}" data-i="${PIDX(i)}"><div class="kplant">${p?plantSVG(Math.max(0,st),ZADEN[p.z][4],p.z):''}</div><img class="potimg" src="img/kas/${potImg(i)}.webp" alt=""><small class="mk-lab">${p?(st==4?'Oogsten!':ZADEN[p.z][0]):'Tik om te planten'}</small></div>`}
function plek(i){return slotOpen(i)?potHTML(i):''}
function vloerHTML(){if(!S.vloerpot&&!mp(0))return '';const st=mp(0)?mpSt(0):-1;return `<button type="button" class="mk-vloer ${st==4?'rijp':''}" data-m="0">${mp(0)?spImg(mp(0).z,st):''}<img class="gpimg" src="img/kas/grotepot.webp" alt=""><span class="gplabel">${mp(0)?(st==4?'Oogsten!':SUPERPLANTEN[mp(0).z].naam):'Vloerpot'}</span></button>`}
function megaZicht(i){return !!(mp(i)||(S.vloerpot&&lvl()>=MEGA_VANAF[i]))}
V.mijnkas=()=>{VIEWDECOR.mijnkas='kas';verhuisPotten();const klein=[0,1,2].filter(slotOpen),groot=[3,4,5,6].filter(slotOpen);const gt=lvl()>=GROTE_TAFEL||groot.length;
 app(`<h2 class="mk-titel">Mijn eigen kas</h2>
 <div class="mk-scroll" id="mkscroll"><div class="mk-kamer ${siloAan()?'sproei':''}"><div class="mk-leiding"><b class="lv"></b><b class="lh"></b><i class="kop" style="left:16%"></i><i class="kop" style="left:24%"></i><i class="kop" style="left:32%"></i><i class="kop" style="left:40%"></i><i class="kop" style="left:48%"></i><i class="kop" style="left:56%"></i><i class="kop" style="left:64%"></i><i class="kop" style="left:72%"></i><i class="kop" style="left:80%"></i><i class="kop" style="left:88%"></i></div>
  <div class="mk-tafel klein"><div class="mk-rij">${klein.map(plek).join('')}</div><img src="img/kas/tafel1.webp" alt=""></div>
  ${gt?`<div class="mk-tafel groot"><div class="mk-rij">${groot.map(plek).join('')}</div><img src="img/kas/tafel2.webp" alt=""></div>`:(S.vloerpot?'':`<div class="mk-hint t"><span>De grote vloerpot koop je in Potten, voor 300 Smekkies.</span></div>`)}
  ${vloerHTML()}${levHTML()}<button class="mk-deur" id="mkterug" aria-label="Door de deur terug naar de kassen"><span>Terug</span></button>
  ${[1,2].some(megaZicht)?`<div class="mk-mega">${[1,2].filter(megaZicht).map(i=>`<button class="megapot ${mpSt(i)==4?'rijp':''}" data-m="${i}">${mp(i)?spImg(mp(i).z,mpSt(i)):''}<img class="gpimg" src="img/kas/grotepot.webp" alt=""><span class="gplabel">${mp(i)?(mpSt(i)==4?'Oogsten!':SUPERPLANTEN[mp(i).z].naam):'Megapot'}</span></button>`).join('')}</div>`:''}
 </div></div>
 <p class="mk-veeg">‹ Veeg om verder de kas in te lopen</p>
 <div class="mk-balk"><button type="button" id="potwinkel">Potten</button><span><img src="img/smekkies/boon-oranje-64.webp" alt="">${S.galjoenen}</span><span title="zaadjes">${icoon('blad')} ${Object.values(S.zaden||{}).reduce((a,b)=>a+b,0)}</span><span title="drakenmest">${icoon('vuur')} ${S.mest||0}</span><span title="superzaden">${icoon('ster')} ${Object.values(S.superzaad||{}).reduce((a,b)=>a+b,0)}</span>${Object.entries(BOOSTERS).map(([k,d])=>`<span class="${S.bo[k]?'':'nul'}" title="${d.naam}"><img src="img/pu/${d.img}.webp" alt="">${S.bo[k]||0}</span>`).join('')}</div>`);
 $('#mkterug').onclick=()=>{const d=$('#mkterug');if(d.classList.contains('open'))return;d.classList.add('open');try{fx.speel('whoosh')}catch(e){}vib(25);const ov=document.createElement('div');ov.className='kd-overgang';document.body.appendChild(ov);setTimeout(()=>{ga('kas');requestAnimationFrame(()=>ov.classList.add('uit'));setTimeout(()=>ov.remove(),900)},matchMedia('(prefers-reduced-motion: reduce)').matches?50:800)};
 bindLev();
 const lv=$('.mk-leviosa');new IntersectionObserver((en,ob)=>{if(en[0].isIntersecting&&!S.levUitleg){S.levUitleg=1;bewaar();ob.disconnect();try{gids('Twee silo’s links, twee knoppen ernaast, en één blok. Staat het blok op een knop én is die silo vol, dan gaat de knop aan en geeft hij licht. De silo loopt in een half uur leeg en je planten krijgen water. Daarna vult hij zich vanzelf, dat duurt twee uur. Is hij leeg, tik dan op het blok: <b>Wingardium Leviosa</b> laat het naar de knop ernaast zweven.',{})}catch(x){}}},{threshold:.25}).observe(lv);
 document.querySelectorAll('.mk-pot').forEach(k=>k.onclick=()=>{const i=+k.dataset.i,p=pot(i);if(!p)return plantKies(i);if(stadium(p)==4)return oogsten(i);const o=document.createElement('div');o.className='modal';o.innerHTML=`<div class="modalin rococo"><h3>${ZADEN[p.z][0]}</h3><p>${FASEN[stadium(p)]} · nog ${tijd(rest(p))}</p><button class="knop klein" id="mw" ${p.nat>Date.now()?'disabled':''}>Water</button> <button class="knop klein" id="mm" ${S.mest?'':'disabled'}>Drakenmest</button><p><button class="linkknop" id="mx">Sluiten</button></p></div>`;document.body.appendChild(o);
  o.querySelector('#mx').onclick=()=>o.remove();o.querySelector('#mw').onclick=()=>{p.bonus+=rest(p)*.25;p.nat=Date.now()+30*6e4;bewaar();fx.speel('whoosh');toast('Water gegeven: 25% sneller');o.remove();V.mijnkas()};o.querySelector('#mm').onclick=()=>{S.mest--;p.bonus+=rest(p)*.5;bewaar();toast('Drakenmest: de helft sneller!');o.remove();V.mijnkas()}});
 $('#potwinkel').onclick=()=>potWinkel();
 document.querySelectorAll('.megapot[data-m],.mk-vloer[data-m]').forEach(b=>b.onclick=()=>superModal(+b.dataset.m));
 const sc=$('#mkscroll');sc.scrollLeft=S.mkScroll!=null?S.mkScroll:sc.scrollWidth-sc.clientWidth-sc.scrollWidth*.012;sc.addEventListener('scroll',()=>{S.mkScroll=sc.scrollLeft;const v=$('.mk-veeg');if(v&&sc.scrollWidth-sc.clientWidth-sc.scrollLeft>40)v.classList.add('weg')},{passive:true});
 // Tilly-uitleg door progressie
 const g=t=>setTimeout(()=>{try{gids(t,{})}catch(e){}},700);
 if(window._kasVersMeld){window._kasVersMeld=0;S.kasVerhuisMeld=1;bewaar();const rest=Object.keys(S.kweek||{}).some(i=>+i<100&&S.kweek[i]);toast(rest?'Je planten staan in je eigen kas. De rest schuift op als er een pot vrijkomt.':'Je planten staan nu in de potten van je eigen kas.')}
 if(!S.mkUitleg){S.mkUitleg=1;bewaar();g('Welkom in je eigen kas, Luna! Op het tafeltje bij de deur staat je standaardpot. Tik erop en plant een zaadje uit de zadenwinkel. Mooiere potten en de grote vloerpot koop je met de knop Potten.')}
 else if(leraarPoort()&&!S.groenPoortUitleg){S.groenPoortUitleg=1;bewaar();g('Professor Stronk houdt het volgende level tegen tot de <b>groene kruidenpot</b> op je tafel staat. Tik op Potten. Die pot wordt je tweede, en daarin groeien de bijzondere kruiden.')}
 else if(lvl()>=MEGA_VANAF[0]&&!S.superOpen){S.superOpen=1;S.superzaad.flessenbes=(S.superzaad.flessenbes||0)+1;S.superzaad.bomlicht=(S.superzaad.bomlicht||0)+1;bewaar();g('Superplanten! Koop de <b>grote vloerpot</b> in Potten voor 300 Smekkies. Ik heb er twee zaadjes bij gelegd.')}
 else if(lvl()>=GROTE_TAFEL&&!S.groteTafel){S.groteTafel=1;bewaar();g('Herbologie afgerond! Je hebt de <b>grote tafel</b> gewonnen. Extra potten koop je in het menu Potten.')}
 poortBanner();
 try{ if(typeof elfStart==='function') elfStart('mijnkas') }catch(e){}
};
/* Leraar-opdrachten: eerst afronden, dan pas het volgende level.
   Een nieuwe mijlpaal is een extra regel in deze lijst. */
const LERAAR_OPDRACHTEN=[
 {id:'groene-pot',na:30,prof:'Professor Stronk',titel:'De groene kruidenpot',
  zin:'Level 30 is gehaald. Voor we verdergaan wil ik eerst iets in de kas.',
  uitleg:'Koop de groene kruidenpot. Die wordt je tweede pot op de tafel. Deze drie kruiden groeien alleen daarin.',
  knop:'Naar de potten',klaar:()=>heeftGroenePot(),
  ga:()=>{ga('mijnkas');setTimeout(()=>{try{potWinkel()}catch(e){}},700)}}];
function leraarPoort(){const n=S.m3lvl||1;return LERAAR_OPDRACHTEN.find(o=>n>o.na&&!o.klaar())||null}
function poortBanner(){const p=leraarPoort();if(!p)return;const a=$('#app');if(!a||a.querySelector('#poortbanner'))return;const h=a.querySelector('h2');if(!h)return;
 const inKas=document.body.dataset.view==='mijnkas';
 h.insertAdjacentHTML('afterend',inKas?`<button type="button" class="poortregel" id="poortbanner"><b>${p.prof}:</b> ${p.titel}. Daarna gaat level ${p.na+1} open.</button>`:`<button type="button" class="kweekopdr stronkbord poortbanner" id="poortbanner"><small>Opdracht · daarna level ${p.na+1}</small><b>${p.titel}</b><small>Tik op het bord</small></button>`);
 $('#poortbanner').onclick=()=>ga('leraarpoort');const pw=$('#potwinkel');if(pw)pw.classList.add('opdracht')}
V.leraarpoort=()=>{const p=leraarPoort();if(!p)return ga('match3');try{nav('kas')}catch(e){}VIEWDECOR.leraarpoort='kas';
 const heb=S.galjoenen||0,prijs=POT_UP[0].prijs,kan=heb>=prijs;
 const kruiden=[...GROEN_KRUID].filter(z=>ZADEN[z]).map(z=>`<span class="poortkruid">${plantSVG(4,ZADEN[z][4],z)}<small>${ZADEN[z][0]}</small></span>`).join('');
 app(`<section class="lesdeur rococo poortles"><div class="ld-bord" style="background-image:url('img/laadschermen/herbologie${innerWidth<=600?'-klein':''}.webp')"><img class="poortpot" src="img/kas/pot1.webp" alt="Groene kruidenpot"></div>
  <small class="ld-nr">Opdracht van ${p.prof} · na level ${p.na}</small><h2>${p.titel}</h2>
  <p><b>${p.prof}:</b> ${p.zin} ${p.uitleg}</p>
  <button class="knop volgende" id="poortga">${p.knop}</button>
  <div class="poortkruiden">${kruiden}</div>
  <p class="klein">Je hebt ${heb} Smekkies. De pot kost ${prijs}. <button type="button" class="linkknop" id="poortpad">Eerdere levels</button></p>
  ${kan?'':`<p class="klein">Nog ${prijs-heb} Smekkies. Herhaal een eerder level, die geven ook Smekkies.</p>`}</section>`);
 $('#poortga').onclick=()=>p.ga();$('#poortpad').onclick=()=>ga('pad')};
let kasNaarMenu=0;
if(typeof ga=='function'){const _ga=ga;ga=function(v,...a){if(v=='match3'){const n=a[0]||S.m3lvl||1,p=leraarPoort();if(p&&n>=(S.m3lvl||1)&&n>p.na)return _ga('leraarpoort')}if(v=='mijnkas'){document.body.dataset.view='mijnkas';try{fx.thema('kas')}catch(e){}$('#terug')&&$('#terug').classList.add('zien');window.scrollTo(0,0);V.mijnkas();poortBanner();return}if(v=='kas')kasNaarMenu=1;try{return _ga(v,...a)}finally{kasNaarMenu=0}}}
// kweek-functies roepen V.kas() aan: in de eigen kas blijven we daar. ga('kas') zet kasNaarMenu, anders bleef de kas staan.
const _kasOrig=V.kas;V.kas=(...a)=>{if(document.body.dataset.view=='mijnkas'&&!kasNaarMenu)return V.mijnkas();_kasOrig(...a);deur();poortBanner()};
const _homePoort=V.home;V.home=function(...a){const r=_homePoort.apply(this,a);const p=leraarPoort();if(p){const b=$('#speelknop');if(b){b.textContent='Eerst: '+p.titel;b.classList.add('volgende');b.onclick=()=>ga('leraarpoort')}const hs=document.querySelector('.hs-hoofd');if(hs){const sm=hs.querySelector('small');if(sm)sm.textContent=p.prof;const bt=hs.querySelector('b');if(bt)bt.textContent='Opdracht';hs.onclick=()=>ga('leraarpoort')}}return r};
const _padPoort=V.pad;V.pad=function(...a){const r=_padPoort.apply(this,a);const p=leraarPoort();if(p){const kop=document.querySelector('.padkopbeeld')||document.querySelector('h2');if(kop){kop.insertAdjacentHTML('afterend',`<button class="knop volgende poortknop" id="poortknop">Opdracht van ${p.prof}</button>`);const k=$('#poortknop');if(k)k.onclick=()=>ga('leraarpoort')}}return r};
if(typeof m3Winst==='function'){const _mw=m3Winst;m3Winst=function(n,b){const r=_mw(n,b);try{const p=LERAAR_OPDRACHTEN.find(o=>n===o.na&&!o.klaar());if(p){const btn=$('#m3volg');if(btn){btn.textContent='Eerst naar '+p.prof;btn.onclick=()=>{const m=btn.closest('.modal');if(m)m.remove();ga('leraarpoort')}}}}catch(e){}return r}}
/* ---- 2 silo's links, 2 knoppen ernaast, 1 blok ---- */
const VUL=2*36e5,LEEG=30*6e4;
S.water=S.water||{blok:0,sinds:Date.now(),lvl:[1,1]};delete S.silo;
(function(){const w=S.water;if(!w.modus){const oud=2*36e5,nu=Date.now();w.lvl=[0,1].map(i=>Math.min(1,Math.max(0,i==w.blok?(w.lvl&&w.lvl[i]||0)+(nu-(w.sinds||nu))/oud:(w.lvl&&w.lvl[i]||0))));w.blok=w.blok?1:0;w.modus=w.lvl.map((n,i)=>i==w.blok&&n>=.999?'leeg':'vul');w.sinds=nu;w.gemeld=w.modus[w.blok]==='leeg'?w.blok:-1;delete w.tot}if(!w.modus||w.modus.length<2)w.modus=['vul','vul'];if(!w.lvl||w.lvl.length<2)w.lvl=[0,0]})();
const W=()=>S.water;
function niveau(i){const w=W(),dt=Date.now()-w.sinds;if(w.modus[i]==='leeg')return Math.max(0,w.lvl[i]-dt/LEEG);return Math.min(1,w.lvl[i]+dt/VUL)}
function siloAan(){const w=W();return w.modus[w.blok]==='leeg'&&niveau(w.blok)>0.01}
function dtTotEvent(){const w=W(),a=w.blok;if(w.modus[a]==='leeg')return w.lvl[a]<=0?Infinity:w.lvl[a]*LEEG;if(w.lvl[a]>=1)return 0;return (1-w.lvl[a])*VUL}
function snap(dt){const w=W();if(!(dt>0))return;w.lvl=[0,1].map(i=>w.modus[i]==='leeg'?Math.max(0,w.lvl[i]-dt/LEEG):Math.min(1,w.lvl[i]+dt/VUL));w.sinds+=dt}
function gebeurtenis(){const w=W(),a=w.blok,b=1-a;if(w.modus[b]==='leeg')w.modus[b]='vul';if(w.modus[a]==='leeg'){w.lvl[a]=0;return 'wacht'}w.lvl[a]=1;w.modus[a]='leeg';return 'aan'}
function wisselBlok(){const w=W(),a=w.blok,b=1-a;w.lvl[a]=0;w.modus[a]='vul';w.blok=b;if(w.lvl[b]>=.999){w.lvl[b]=1;w.modus[b]='leeg'}else w.modus[b]='vul';w.sinds=Date.now();w.gemeld=-1}
function simuleer(tot){let g=0;while(g++<2000){const w=W(),b=1-w.blok;if(w.modus[b]==='leeg')w.modus[b]='vul';const dt=dtTotEvent();if(dt<=0){gebeurtenis();continue}if(w.sinds>=tot)break;const ruimte=tot-w.sinds;if(dt>ruimte){snap(ruimte);break}snap(dt);gebeurtenis()}
 const w=W();if(w.modus[1-w.blok]==='leeg')w.modus[1-w.blok]='vul'}
function statusTekst(){const w=W(),i=w.blok,n=niveau(i);if(w.modus[i]==='leeg'&&n<=0.01)return `Silo ${i+1} is leeg · tik op het blok`;return w.modus[i]==='leeg'?`Silo ${i+1} loopt leeg · nog ${tijd(n*LEEG)}`:`Silo ${i+1} vult zich · nog ${tijd(Math.max(0,1-n)*VUL)}`}
function plaatAan(i){const w=W();return w.blok==i&&w.modus[i]==='leeg'&&niveau(i)>0.01}
function levHTML(){if(!W().zweeft)simuleer(Date.now());const w=W();return `<div class="mk-leviosa ${siloAan()?'aan':''}" data-b="${w.blok}"><div class="mk-silos">${[0,1].map(i=>{const pct=Math.round(niveau(i)*100);return `<div class="mk-unit u${i}" data-i="${i}"><div class="mk-silo"><div class="mk-glas"><i style="height:${pct}%"></i></div><img src="img/kas/silo.webp" alt=""><span>${pct}%</span></div></div>`}).join('')}</div><div class="mk-knoppen">${[0,1].map(i=>{const aan=plaatAan(i);return `<div class="mk-knoop k${i}"><div class="mk-plaat ${w.blok==i?'in':''} ${aan?'aan':''}"><img src="img/kas/knop-${aan?'aan':'uit'}.webp" alt="${aan?'Knop aan':'Knop uit'}"></div></div>`}).join('')}</div>
 <button type="button" class="mk-blok" aria-label="Wingardium Leviosa-blok"><img src="img/kas/leviosa-blok.webp" alt=""></button><small class="mk-levtxt">${statusTekst()}</small>
 <label class="mk-meld"><input type="checkbox" id="mkmeld" ${S.siloMeld?'checked':''}> Seintje als een silo vol is</label></div>`}
function levitatieAuto(){const blok=$('.mk-blok');if(!blok){afrondenWissel();return}const r=blok.getBoundingClientRect();const t=document.createElement('div');t.className='m3spreuk';t.textContent='Wingardium Leviosa!';t.style.cssText=`left:${r.left+r.width/2}px;top:${r.top-30}px`;document.body.appendChild(t);setTimeout(()=>t.remove(),1800);
 try{fx.speel('tover')}catch(e){}try{vib([20,40,20])}catch(e){}const naar=1-W().blok;blok.classList.add(naar?'zweefR':'zweefL');
 document.querySelectorAll('.mk-plaat.aan').forEach(p=>{p.classList.remove('aan');const im=p.querySelector('img');if(im)im.src='img/kas/knop-uit.webp'});
 for(let i=0;i<14;i++){const s=document.createElement('i');s.className='mk-ster';s.style.cssText=`left:${r.left+Math.random()*r.width}px;top:${r.top+Math.random()*r.height}px;--x:${(Math.random()-.5)*60}px;animation-delay:${i*60}ms`;document.body.appendChild(s);setTimeout(()=>s.remove(),1700)}
 setTimeout(afrondenWissel,1500)}
function afrondenWissel(){const w=W();if(!w.zweeft)return;w.zweeft=0;simuleer(Date.now());wisselBlok();bewaar();meldVol();if(document.body.dataset.view=='mijnkas')ververs()}
function meldVol(){const w=W();if(w.modus[w.blok]==='leeg'){if(w.gemeld!==w.blok){w.gemeld=w.blok;bewaar();if(S.siloMeld){toast('Silo '+(w.blok+1)+' is vol. De knop brandt en het water loopt leeg.');try{if(Notification.permission=='granted')navigator.serviceWorker.ready.then(r=>r.showNotification('Zweinstein',{body:'Een watersilo is vol. De knop geeft licht.',icon:'img/icoon-192.png'}))}catch(e){}}}}else if(w.gemeld===w.blok)w.gemeld=-1}
function sproei(){if(!siloAan())return;const nu=Date.now();let w=0;Object.keys(S.kweek||{}).forEach(i=>{if(+i<100)return;const p=S.kweek[i];if(p&&stadium(p)<4&&!(p.nat>nu)){p.bonus+=rest(p)*.25;p.nat=nu+30*6e4;w++}});
 S.mega.forEach((p,i)=>{if(p&&mpSt(i)<4&&!(p.nat>nu)){p.bonus=(p.bonus||0)+mpRest(i)*.15;p.nat=nu+30*6e4;w++}});if(w)bewaar()}
function ververs(){const l=$('.mk-leviosa');if(!l)return;l.outerHTML=levHTML();bindLev()}
function tekenStand(){document.querySelectorAll('.mk-silos .mk-unit').forEach(u=>{const i=+u.dataset.i,pct=Math.round(niveau(i)*100);const bar=u.querySelector('.mk-glas i');if(bar)bar.style.height=pct+'%';const sp=u.querySelector('span');if(sp)sp.textContent=pct+'%'});const t=$('.mk-levtxt');if(t)t.textContent=statusTekst();const k=$('.mk-kamer');if(k)k.classList.toggle('sproei',siloAan())}
function sleutel(){const w=W();return w.blok+'|'+w.modus.join(',')+'|'+(siloAan()?1:0)}
function tik(){const w=W();if(w.zweeft){const b=$('.mk-blok');if(!b||!(b.classList.contains('zweefR')||b.classList.contains('zweefL')))afrondenWissel();return}const voor=sleutel();simuleer(Date.now());sproei();if(document.body.dataset.view=='mijnkas'&&!document.querySelector('.modal')){meldVol();if(sleutel()!=voor){bewaar();ververs()}else tekenStand()}}
setInterval(tik,1000);setTimeout(tik,400);
function bindLev(){const b=$('.mk-blok');if(b)b.onclick=()=>{const w=W();if(w.zweeft)return;simuleer(Date.now());if(!(w.modus[w.blok]==='leeg'&&niveau(w.blok)<=0.01)){toast('Tik op het blok als de silo leeg is. Dan zweeft het naar de andere knop.');tekenStand();return}w.zweeft=1;levitatieAuto()};
 const m=$('#mkmeld');if(m)m.onchange=e=>{S.siloMeld=e.target.checked;bewaar();if(S.siloMeld&&window.Notification&&Notification.permission=='default')Notification.requestPermission().catch(()=>0)};
 const k=$('.mk-kamer');k&&k.classList.toggle('sproei',siloAan())}
/* ---- de deur in de originele kas ---- */
function deur(){const a=$('#app');if(!a||a.querySelector('.kasdeur'))return;const h=a.querySelector('.kweekbalk')||a.querySelector('h2');
 h.insertAdjacentHTML('afterend',`<button class="kasdeur" aria-label="Open de deur naar je eigen kas"><span class="kd-licht"></span><span class="kd-kozijn"><span class="kd-blad"><i class="kd-raam"></i><i class="kd-knop"></i></span></span><span class="kd-tekst"><b>Mijn eigen kas</b><small>Tik op de deur</small></span></button>`);
 const d=a.querySelector('.kasdeur');d.onclick=()=>{if(d.classList.contains('open'))return;d.classList.add('open');try{fx.speel('whoosh')}catch(e){}vib(25);
  const ov=document.createElement('div');ov.className='kd-overgang';document.body.appendChild(ov);
  setTimeout(()=>{ga('mijnkas');requestAnimationFrame(()=>ov.classList.add('uit'));setTimeout(()=>ov.remove(),900)},matchMedia('(prefers-reduced-motion: reduce)').matches?50:850)};
 if(!S.deurUitleg){S.deurUitleg=1;bewaar();setTimeout(()=>{try{gids('Zie je die grote deur? Daarachter ligt je <b>eigen kas</b>. Tik erop!',{})}catch(e){}},1200)}}
function potWinkel(){const o=document.createElement('div');o.className='modal';const teken=()=>{const n=S.potUpgrade|0;
 o.innerHTML=`<div class="modalin rococo"><h2>Potten</h2><p class="klein">Je hebt ${S.galjoenen} Smekkies. De standaardpot staat al op je tafel.</p><div class="zlijst"><div class="zkoop vanjou"><img src="img/kas/pot0.webp" alt=""><b>Standaardpot</b><small>van jou</small><small>Tik erop en plant een zaadje uit de winkel.</small></div>${POT_UP.map((d,i)=>{const heb=n>i,aan=n===i,teVroeg=i===0&&!heb&&(S.m3lvl||1)<=30,opdracht=i===0&&aan&&!teVroeg;return `<button class="zkoop ${teVroeg?'potslot':''} ${opdracht?'opdracht':''}" data-up="${i}" ${heb||(!aan&&!teVroeg)?'disabled':''}><img src="img/kas/${d.img}.webp" alt=""><b>${d.naam}</b><small>${heb?'in je kas':teVroeg?'na level 30':d.prijs+' Smekkies'}</small><small>${teVroeg?'Opdracht van professor Stronk':opdracht?'Dit vraagt professor Stronk':d.tekst}</small></button>`}).join('')}<button class="zkoop" data-vloer="1" ${S.vloerpot?'disabled':''}><img src="img/kas/grotepot.webp" alt=""><b>Grote vloerpot</b><small>${S.vloerpot?'in je kas':VLOERPOT_PRIJS+' Smekkies'}</small><small>Staat links naast je tafel. Voor superplanten.</small></button></div><button class="knop" id="potdicht">Klaar</button></div>`;
 o.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{const i=+b.dataset.up,d=POT_UP[i];if(i===0&&(S.potUpgrade|0)<1&&(S.m3lvl||1)<=30){toast('Professor Stronk vraagt deze pot pas na level 30.');try{fx.speel('fout')}catch(e){}return}if((S.potUpgrade|0)!==i)return;if(S.galjoenen<d.prijs){toast(i===0&&(S.m3lvl||1)>30?'Nog '+(d.prijs-S.galjoenen)+' Smekkies. Herhaal een eerder level, die geven ook Smekkies.':'Niet genoeg Smekkies. Speel een level!');fx.speel('fout');return}const wasOpdracht=i===0&&!!leraarPoort();S.galjoenen-=d.prijs;S.potUpgrade=i+1;bewaar();stats();fx.speel('munt');vib(15);if(wasOpdracht){o.remove();if(document.body.dataset.view==='mijnkas')V.mijnkas();verhaal([['Professor Stronk','Prachtig. De groene pot staat als tweede op je tafel. Duivelsstrik, de Giftige Tentacula en de Sodejusplant willen nergens anders groeien.'],['Tilly','Nu kunnen we door naar het volgende level.']],()=>ga('match3'));return}toast(d.naam+' staat in je kas');teken()});
 const vb=o.querySelector('[data-vloer]');if(vb)vb.onclick=()=>{if(S.vloerpot)return;if(S.galjoenen<VLOERPOT_PRIJS){toast('Niet genoeg Smekkies. Speel een level!');fx.speel('fout');return}S.galjoenen-=VLOERPOT_PRIJS;S.vloerpot=1;bewaar();stats();fx.speel('munt');vib(15);toast('De grote vloerpot staat naast je tafel');teken()};
 o.querySelector('#potdicht').onclick=()=>{o.remove();if(document.body.dataset.view==='mijnkas')V.mijnkas();else V.kas()}};teken();document.body.appendChild(o)}
window.potWinkel=potWinkel;
window.leraarPoort=leraarPoort;
if(document.body.dataset.view==='home'&&leraarPoort()){try{V.home()}catch(e){}}
})();
