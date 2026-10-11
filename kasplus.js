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
function potHTML(i){const p=pot(PIDX(i)),st=p?stadium(p):-1;return `<div class="kpot mk-pot ${st==4?'rijp':''}" data-i="${PIDX(i)}"><div class="kplant">${p?plantSVG(Math.max(0,st),ZADEN[p.z][4],p.z):''}</div><img class="potimg" src="img/kas/pot${i==0?0:i==1?1:i<5?2:i<7?3:4}.webp" alt=""><small class="mk-lab">${p?(st==4?'Oogsten!':ZADEN[p.z][0]):'Tik om te planten'}</small></div>`}
function plek(i){return lvl()>=(PLEK_VANAF[i]||GROTE_TAFEL)?potHTML(i):`<div class="mk-leeg"><span>Level ${PLEK_VANAF[i]||GROTE_TAFEL}</span></div>`}
V.mijnkas=()=>{VIEWDECOR.mijnkas='kas';const gt=lvl()>=GROTE_TAFEL;
 app(`<div class="mk-kop"><button class="knop klein" id="mkterug">‹ Terug naar de kassen</button><h2>Mijn eigen kas</h2></div>
 <div class="mk-scroll" id="mkscroll"><div class="mk-kamer ${siloAan()?'sproei':''}"><div class="mk-sproeiers"></div>
  <div class="mk-tafel klein"><div class="mk-rij">${[0,1,2].map(plek).join('')}</div><img src="img/kas/tafel1.webp" alt=""></div>
  ${gt?`<div class="mk-tafel groot"><div class="mk-rij">${[3,4,5,6].map(plek).join('')}</div><img src="img/kas/tafel2.webp" alt=""></div>`:`<div class="mk-hint t"><span>Hier is nog plek voor iets groots…</span></div>`}
  ${levHTML()}
  <div class="mk-mega">${MEGA_VANAF.map((v,i)=>lvl()>=v?`<button class="megapot ${mpSt(i)==4?'rijp':''}" data-m="${i}">${mp(i)?spImg(mp(i).z,mpSt(i)):''}<img class="gpimg" src="img/kas/grotepot.webp" alt=""><span class="gplabel">${mp(i)?(mpSt(i)==4?'Oogsten!':SUPERPLANTEN[mp(i).z].naam):'Megapot'}</span></button>`:`<div class="megapot dicht"><img class="gpimg" src="img/kas/grotepot.webp" alt=""><span class="gplabel">${i==0?'Een plek voor een megapot':'…'}</span></div>`).join('')}</div>
 </div></div>
 <p class="mk-veeg">‹ Veeg om verder de kas in te lopen</p>
 <div class="bokist">${Object.entries(BOOSTERS).map(([k,d])=>`<span class="${S.bo[k]?'':'nul'}" title="${d.naam}"><img src="img/pu/${d.img}.webp" alt="">${S.bo[k]||0}</span>`).join('')}</div>`);
 $('#mkterug').onclick=()=>ga('kas');
 bindLev();
 const lv=$('.mk-leviosa');new IntersectionObserver((en,ob)=>{if(en[0].isIntersecting&&!S.levUitleg){S.levUitleg=1;bewaar();ob.disconnect();try{gids('Herken je dit uit de Herbologie-les? Er zijn twee silo’s met elk een drukplaat, maar maar één blok. De silo onder het blok vult zich: van leeg tot vol duurt twee uur. Wissel het blok met <b>Wingardium Leviosa</b> naar de andere plaat. Met de sproeiknop geeft een volle silo je planten een half uur water, een halfvolle evenveel minder.',{})}catch(x){}}},{threshold:.6}).observe(lv);
 document.querySelectorAll('.mk-pot').forEach(k=>k.onclick=()=>{const i=+k.dataset.i,p=pot(i);if(!p)return plantKies(i);if(stadium(p)==4)return oogsten(i);const o=document.createElement('div');o.className='modal';o.innerHTML=`<div class="modalin rococo"><h3>${ZADEN[p.z][0]}</h3><p>${FASEN[stadium(p)]} · nog ${tijd(rest(p))}</p><button class="knop klein" id="mw" ${p.nat>Date.now()?'disabled':''}>Water</button> <button class="knop klein" id="mm" ${S.mest?'':'disabled'}>Drakenmest</button><p><button class="linkknop" id="mx">Sluiten</button></p></div>`;document.body.appendChild(o);
  o.querySelector('#mx').onclick=()=>o.remove();o.querySelector('#mw').onclick=()=>{p.bonus+=rest(p)*.25;p.nat=Date.now()+30*6e4;bewaar();fx.speel('whoosh');toast('Water gegeven: 25% sneller');o.remove();V.mijnkas()};o.querySelector('#mm').onclick=()=>{S.mest--;p.bonus+=rest(p)*.5;bewaar();toast('Drakenmest: de helft sneller!');o.remove();V.mijnkas()}});
 document.querySelectorAll('.megapot[data-m]').forEach(b=>b.onclick=()=>superModal(+b.dataset.m));
 const sc=$('#mkscroll');sc.scrollLeft=S.mkScroll!=null?S.mkScroll:sc.scrollWidth;sc.addEventListener('scroll',()=>{S.mkScroll=sc.scrollLeft;const v=$('.mk-veeg');if(v&&sc.scrollWidth-sc.clientWidth-sc.scrollLeft>40)v.classList.add('weg')},{passive:true});
 // Tilly-uitleg door progressie
 const g=t=>setTimeout(()=>{try{gids(t,{})}catch(e){}},700);
 if(!S.mkUitleg){S.mkUitleg=1;bewaar();g('Welkom in je eigen kas, Luna! Professor Stronk heeft deze ruimte speciaal voor jou vrijgemaakt. Op het tafeltje bij de deur staat je eerste pot; de andere plekjes speel je vrij. Loop maar eens verder de kas in, naar links: daar is ruimte voor megapotten, en helemaal achterin staat iets wat je misschien kent…')}
 else if(lvl()>=MEGA_VANAF[0]&&!S.superOpen){S.superOpen=1;S.superzaad.flessenbes=(S.superzaad.flessenbes||0)+1;S.superzaad.bomlicht=(S.superzaad.bomlicht||0)+1;bewaar();g('Kijk eens rechts in je kas: je eerste <b>megapot</b>! Daarin groeien superplanten met boosters voor je levels. Ik heb er alvast twee zaadjes bij gelegd.');setTimeout(()=>{const m=$('.mk-mega');m&&sc.scrollTo({left:m.offsetLeft-40,behavior:'smooth'})},900)}
 else if(gt&&!S.groteTafel){S.groteTafel=1;bewaar();g('Herbologie afgerond! Je hebt de <b>grote tafel</b> gewonnen, met plek voor nog vier potten.')}
};
if(typeof ga=='function'){const _ga=ga;ga=function(v,...a){if(v=='mijnkas'){document.body.dataset.view='mijnkas';try{fx.thema('kas')}catch(e){}$('#terug')&&$('#terug').classList.add('zien');window.scrollTo(0,0);return V.mijnkas()}return _ga(v,...a)}}
// kweek-functies roepen V.kas() aan: in de eigen kas blijven we daar
const _kasOrig=V.kas;V.kas=(...a)=>{if(document.body.dataset.view=='mijnkas')return V.mijnkas();_kasOrig(...a);deur()};
/* ---- Wingardium Leviosa-blok: 2 schakelaars, 2 silo's ---- */
const VUL=2*36e5,SPROEI=30*6e4;
S.water=S.water||{blok:0,sinds:Date.now(),lvl:[0,0],tot:0};delete S.silo;
const W=()=>S.water;
function niveau(i){const w=W();return i==w.blok?Math.min(1,w.lvl[i]+(Date.now()-w.sinds)/VUL):w.lvl[i]}
function vast(){const w=W();w.lvl=[niveau(0),niveau(1)];w.sinds=Date.now()}
function siloAan(){return W().tot>Date.now()}function siloRest(){return Math.max(0,W().tot-Date.now())}
function levHTML(){const w=W();return `<div class="mk-leviosa ${siloAan()?'aan':''}" data-b="${w.blok}">${[0,1].map(i=>{const n=niveau(i);return `<div class="mk-unit u${i}"><div class="mk-silo"><i style="height:${Math.round(n*100)}%"></i><span>${Math.round(n*100)}%</span></div><div class="mk-plaat ${w.blok==i?'in':''}"></div><button class="knop klein mk-spr" data-s="${i}" ${n<.02?'disabled':''}>Sproei ${Math.round(n*30)} min</button></div>`}).join('')}
 <button class="mk-blok" aria-label="Wingardium Leviosa: wissel het blok"><b>ᚹ</b></button><small class="mk-levtxt">${siloAan()?'Sproeiers aan · nog '+tijd(siloRest()):'Silo '+(w.blok+1)+' vult zich · tik op het blok om te wisselen'}</small>
 <label class="mk-meld"><input type="checkbox" id="mkmeld" ${S.siloMeld?'checked':''}> Seintje als een silo vol is</label></div>`}
function levitatie(blok){const r=blok.getBoundingClientRect();const t=document.createElement('div');t.className='m3spreuk';t.textContent='Wingardium Leviosa!';t.style.cssText=`left:${r.left+r.width/2}px;top:${r.top-30}px`;document.body.appendChild(t);setTimeout(()=>t.remove(),1800);
 try{fx.speel('tover')}catch(e){}vib([20,40,20]);const naar=1-W().blok;blok.classList.add(naar?'zweefR':'zweefL');
 for(let i=0;i<14;i++){const s=document.createElement('i');s.className='mk-ster';s.style.cssText=`left:${r.left+Math.random()*r.width}px;top:${r.top+Math.random()*r.height}px;--x:${(Math.random()-.5)*60}px;animation-delay:${i*60}ms`;document.body.appendChild(s);setTimeout(()=>s.remove(),1700)}
 setTimeout(()=>{vast();W().blok=naar;W().gemeld=0;bewaar();V.mijnkas()},1500)}
function sproeiSilo(i){const n=niveau(i);if(n<.02)return;vast();W().lvl[i]=0;W().tot=Math.max(Date.now(),W().tot)+n*SPROEI;bewaar();try{fx.speel('whoosh')}catch(e){}vib(30);toast(`Sproeiers aan: ${Math.round(n*30)} minuten water voor je planten.`);sproei();V.mijnkas()}
function sproei(){if(!siloAan())return;const nu=Date.now();let w=0;Object.keys(S.kweek||{}).forEach(i=>{if(+i<100)return;const p=S.kweek[i];if(p&&stadium(p)<4&&!(p.nat>nu)){p.bonus+=rest(p)*.25;p.nat=nu+30*6e4;w++}});
 S.mega.forEach((p,i)=>{if(p&&mpSt(i)<4&&!(p.nat>nu)){p.bonus=(p.bonus||0)+mpRest(i)*.15;p.nat=nu+30*6e4;w++}});if(w)bewaar()}
setInterval(()=>{sproei();const w=W();if(niveau(w.blok)>=1&&!w.gemeld){w.gemeld=1;bewaar();if(S.siloMeld){toast('Silo '+(w.blok+1)+' is vol! Wissel het blok of zet de sproeiers aan.');try{if(Notification.permission=='granted')navigator.serviceWorker.ready.then(r=>r.showNotification('Zweinstein',{body:'Een watersilo in je kas is vol.',icon:'img/icoon-192.png'}))}catch(e){}}}
 if(document.body.dataset.view=='mijnkas'&&!document.querySelector('.modal')){const l=$('.mk-leviosa');if(l){l.outerHTML=levHTML();bindLev()}}},30000);
setTimeout(sproei,3000);
function bindLev(){$('.mk-blok').onclick=e=>levitatie(e.currentTarget);document.querySelectorAll('.mk-spr').forEach(b=>b.onclick=()=>sproeiSilo(+b.dataset.s));
 $('#mkmeld').onchange=e=>{S.siloMeld=e.target.checked;bewaar();if(S.siloMeld&&window.Notification&&Notification.permission=='default')Notification.requestPermission().catch(()=>0)};
 const k=$('.mk-kamer');k&&k.classList.toggle('sproei',siloAan())}
/* ---- de deur in de originele kas ---- */
function deur(){const a=$('#app');if(!a||a.querySelector('.kasdeur'))return;const h=a.querySelector('.kweekbalk')||a.querySelector('h2');
 h.insertAdjacentHTML('afterend',`<button class="kasdeur" aria-label="Open de deur naar je eigen kas"><span class="kd-licht"></span><span class="kd-kozijn"><span class="kd-blad"><i class="kd-raam"></i><i class="kd-knop"></i></span></span><span class="kd-tekst"><b>Mijn eigen kas</b><small>Tik op de deur</small></span></button>`);
 const d=a.querySelector('.kasdeur');d.onclick=()=>{if(d.classList.contains('open'))return;d.classList.add('open');try{fx.speel('whoosh')}catch(e){}vib(25);
  const ov=document.createElement('div');ov.className='kd-overgang';document.body.appendChild(ov);
  setTimeout(()=>{ga('mijnkas');requestAnimationFrame(()=>ov.classList.add('uit'));setTimeout(()=>ov.remove(),900)},matchMedia('(prefers-reduced-motion: reduce)').matches?50:850)};
 if(!S.deurUitleg){S.deurUitleg=1;bewaar();setTimeout(()=>{try{gids('Zie je die grote deur? Daarachter ligt je <b>eigen kas</b>. Tik erop!',{})}catch(e){}},1200)}}
})();
