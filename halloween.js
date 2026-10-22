/* ====== v124 Halloweenweek: Haast Onthoofde Henks sterfdagfeest ======
   Rustig seizoensevent volgens de echte kalender (datum van het toestel): za 24 okt t/m zo 1 nov, 31 okt is het feest.
   Daarna gaat de versiering vanzelf weg; verdiende spullen blijven. Geen aftelklok, geen huisschilden (die komen alleen uit levels).
   Testen: makerscherm (logo 3x, 9¾) → datum voor Halloween (localStorage zw_hwdatum, niet in de save). */
(function(){
const pad=n=>String(n).padStart(2,'0');
const hwNu=()=>{const o=localStorage.getItem('zw_hwdatum');const n=new Date();if(o&&/^\d{4}-\d\d-\d\d$/.test(o)){const[y,m,d]=o.split('-').map(Number);return new Date(y,m-1,d,n.getHours(),n.getMinutes())}return n};
const dagVan=(d,i)=>new Date(d.getFullYear(),9,24+i);
const stand=()=>{const d=hwNu();const i=Math.round((new Date(d.getFullYear(),d.getMonth(),d.getDate())-dagVan(d,0))/864e5);return {d,i,j:d.getFullYear(),aan:i>=0&&i<=8,feest:i===7,voor:i<0&&i>=-2?-i:0,na:i>8}};
window.hwStand=stand;
const dagNaam=(j,i)=>new Date(j,9,24+i).toLocaleDateString('nl-NL',{weekday:'short',day:'numeric',month:'short'});
const H=()=>{const j=stand().j;if(!S.hw||S.hw.j!==j)S.hw={j,tot:0,stap:0,raad:{},sc:{},feest:0,lv:0};return S.hw};
const x2=()=>stand().feest?2:1;
/* ---------- beeld ---------- */
const SNOEP=`<svg class="hwsnoep" viewBox="0 0 44 26" aria-hidden="true"><path d="M9 13 1 4v18z" fill="#8b4fc9"/><path d="M35 13l8-9v18z" fill="#8b4fc9"/><ellipse cx="22" cy="13" rx="13" ry="10" fill="#f28a1d"/><path d="M14 6q8 7 0 14M22 3.5q6 9.5 0 19M30 6q-8 7 0 14" stroke="#c95f0c" stroke-width="1.6" fill="none"/><ellipse cx="18" cy="8.5" rx="4" ry="2" fill="#ffd9a6" opacity=".8"/></svg>`;
const LANT=(k='')=>`<svg class="hwlant ${k}" viewBox="0 0 60 60" aria-hidden="true"><defs><radialGradient id="hwg${k}" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#ffe7a1"/><stop offset=".55" stop-color="#ff9a2b"/><stop offset="1" stop-color="#c2410c"/></radialGradient></defs><path d="M30 12q2-7 8-8" stroke="#4d6b2a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M30 12C12 10 4 22 6 36s14 20 24 20 22-6 24-20-6-26-24-24z" fill="url(#hwg${k})"/><path d="M20 13q-6 20 2 42M40 13q6 20-2 42M30 12v44" stroke="#b4500f" stroke-width="1.4" fill="none" opacity=".6"/><path d="M17 28l6-5 4 6zM43 28l-6-5-4 6z" fill="#5a1f05"/><path d="M15 38q15 12 30 0l-5 2-3-3-4 4-3-3-3 3-4-4-3 3z" fill="#5a1f05"/></svg>`;
const BAT=`<svg class="hwbat" viewBox="0 0 64 28" aria-hidden="true"><path d="M32 10c-2-5-5-6-5-6l2 6c-6-6-16-8-27-3 6 1 9 5 9 9 4-3 9-2 11 2 2-3 6-4 10-2 4-2 8-1 10 2 2-4 7-5 11-2 0-4 3-8 9-9-11-5-21-3-27 3l2-6s-3 1-5 6z" fill="#2a1638"/></svg>`;
const WEB=k=>`<svg class="hwweb ${k}" viewBox="0 0 100 100" aria-hidden="true"><g stroke="rgba(255,255,255,.55)" stroke-width=".8" fill="none"><path d="M0 0L100 30M0 0L75 75M0 0L30 100M0 0L100 0M0 0L0 100"/><path d="M28 0q4 12-6 22q12-2 6 10q10-8 4 16"/><path d="M50 0q2 18-10 32q18-4 8 18q16-10 2 30"/><path d="M74 0q0 24-16 44q24-6 10 28q22-14 4 28"/></g></svg>`;
/* ---------- beloningen (geen huisschilden!) ---------- */
const kik=n=>{try{const r=window.kikkerKrijg?kikkerKrijg(n,{stil:1}):{};return window.kikkerZin?kikkerZin(r):'+'+n+' hartje'}catch(e){return ''}};
const bo=(k,n)=>{S.bo=S.bo||{};S.bo[k]=(S.bo[k]|0)+n};
const KAART='Haast Onthoofde Henk';
const STAP=[
 {n:20,ico:'🍬',t:'25 Smekkies',g:()=>{S.galjoenen+=25;return '+25 Smekkies'}},
 {n:50,ico:'🐸',t:'Chocokikker',g:()=>'Een Chocokikker: '+kik(1)},
 {n:90,ico:'🎆',t:'Kleine Knalpijl',g:()=>{bo('knalpijl',1);return 'Een Kleine Knalpijl voor je volgende level'}},
 {n:140,ico:'🎃',t:'Pompoenlantaarn voor Mijn kamer',g:()=>{S.kamer=S.kamer||[];S.kamer.push('🎃');return 'Een pompoenlantaarn staat nu in je slaapzaal'}},
 {n:200,ico:'🍬',t:'40 Smekkies',g:()=>{S.galjoenen+=40;return '+40 Smekkies'}},
 {n:270,ico:'🃏',t:'Halloweenkaart: '+KAART,g:()=>{S.kaarten=S.kaarten||{};S.kaarten[KAART]=(S.kaarten[KAART]||0)+1;return 'De kaart '+KAART+' zit nu in je album (serie Feestdagen)'}},
 {n:350,ico:'🚀',t:'Grote Weasley-Vuurpijl',g:()=>{bo('vuurpijl',1);return 'Een Grote Weasley-Vuurpijl van Fred en George'}},
 {n:440,ico:'🦇',t:'Vleermuizen en kaarsen voor Mijn kamer',g:()=>{S.kamer=S.kamer||[];S.kamer.push('🦇','🕯️');return 'Vleermuizen en een kaars sieren nu je slaapzaal'}},
 {n:520,ico:'🐸',t:'Twee Chocokikkers',g:()=>'Twee Chocokikkers: '+kik(2)},
 {n:600,ico:'🏆',t:'De Gouden Pompoen (aandenken)',g:()=>{S.hwTrofee=S.hwTrofee||[];if(!S.hwTrofee.includes(H().j))S.hwTrofee.push(H().j);S.galjoenen+=50;return 'De Gouden Pompoen staat voor altijd in Mijn kamer. En +50 Smekkies!'}},
];
const volgende=()=>STAP[H().stap]||null;
const open=()=>{const h=H();return h.stap<STAP.length&&h.tot>=STAP[h.stap].n};
/* ---------- verhaal ---------- */
const POR={Henk:'<img src="img/hw/henk-128.webp" alt="">',Hagrid:'<img src="img/personages/hagrid-128.webp" alt="">',Ron:'<img src="img/personages/ron-128.webp" alt="">',Hermelien:'<img src="img/personages/hermelien-128.webp" alt="">'};
const SC=[
 {d:0,t:'Een uitnodiging met een wiebelend hoofd',r:[['Henk','Goedenavond, juffrouw Leeflang! Sta mij toe dat ik buig… ah, mijn hoofd zakt weer een tikje opzij. Zo. Ik ben Haast Onthoofde Henk, het spook van Griffoendor.'],['Henk','Op 31 oktober vier ik mijn vijfhonderdste sterfdag. Een echt sterfdagfeest, beneden in de kerkers. Ik zou het een eer vinden als u komt.'],['Tilly','Een feest voor spoken? O Luna, daar moeten we heen! Ik heb nog nooit een spook taart zien eten.'],['Henk','Eten doen wij niet, lieve Tilly, wij ruiken alleen. Maar voor de levenden liggen er overal in het kasteel pompoensnoepjes verstopt.'],['Tilly','Afgesproken! Elke keer als we een level spelen, houd ik mijn ogen open. Hoe mooier we spelen, hoe meer snoepjes we vinden.']]},
 {d:2,t:'Hagrids reuzenpompoenen',r:[['Hagrid','Kijk eens wat er in m’n moestuin staat, Luna! Pompoenen zo groot als m’n hut. Een beetje geholpen, maar dat zeg je tegen niemand, hè?'],['Tilly','Ze zijn enorm! Gaan ze naar de Grote Zaal?'],['Hagrid','Voor het feest op 31 oktober. Ze worden uitgehold, met kaarsen erin. En Henk vroeg of er eentje naar de kerkers mag.'],['Tilly','Een pompoen voor een spookfeest. Ik denk dat Henk hem het mooiste vindt als hij een beetje scheef staat.']]},
 {d:4,t:'De Hoofdloze Jacht',r:[['Tilly','Henk zit zo somber bij het raam. Wat is er aan de hand?'],['Henk','De Hoofdloze Jacht komt ook op mijn feest. Ze rijden op spookpaarden en spelen hoofd-polo. Ik mag nooit meedoen: mijn hoofd zit er nog net aan vast, ziet u.'],['Tilly','Maar dat is toch juist knap? Vijfhonderd jaar en nog bijna helemaal in één stuk!'],['Henk','Ha! Zo had ik het nog nooit bekeken. U bent een schat, juffrouw Tilly.']]},
 {d:6,t:'Fred en George helpen mee',r:[['Fred & George','Wij hebben de vleermuizen voor de Grote Zaal geregeld. Echte. Nou ja, bijna echte.'],['Tilly','Bijna echte vleermuizen?'],['Fred & George','Ze knallen een klein beetje als je ze aanraakt. Feestelijk knallen. Niet tegen Anderling zeggen, hoor.'],['Tilly','Luna, ik heb helemaal niets gehoord. Jij ook niet, toch?']]},
 {d:7,t:'Het sterfdagfeest',r:[['Henk','Welkom, welkom in mijn kerker! Pas op voor de tafel: de vis is vijfhonderd jaar oud, maar ruikt nog voortreffelijk.'],['Tilly','Brr, wat is het hier koud. Maar wat mooi: zwarte kaarsen met blauwe vlammen!'],['Ron','Ik ruik vooral rotte vis. Gaan we zo naar boven? Daar staat pompoentaart.'],['Henk','Kijk eens wie daar binnenrijdt: de Hoofdloze Jacht! En ze vragen… of ík vanavond de eregast ben!'],['Tilly','Hoera voor Henk! En nu snel naar de Grote Zaal, Luna. Daar staat het echte Halloweenfeest klaar.']]},
 {d:8,t:'Een kleine dankjewel',r:[['Henk','Juffrouw Leeflang, wat een avond. Dank u dat u er was. Een spook vergeet zoiets nooit, en wij hebben veel tijd om te onthouden.'],['Hermelien','Hagrid haalt morgen de pompoenen weer op en de kaarsen gaan uit. Maar alles wat je hebt verdiend, mag je houden.'],['Henk','Tot volgend jaar. Dan word ik vijfhonderd-en-één!']]},
];
const speel=(s,klaar)=>{let i=0;const o=document.createElement('div');o.className='modal hwscene';o.dataset.pop='hwscene';document.body.appendChild(o);
 const toon=()=>{const[w,t]=s.r[i];const p=w=='Tilly'?(window.tillySVG?tillySVG(i%2?'blij':'praat'):''):POR[w]||`<div class="hwico">${w.startsWith('Fred')?'🎆':'👻'}</div>`;
  o.innerHTML=`<div class="modalin rococo hwsc"><div class="hwsc-kop"><small>Halloweenverhaal</small><h3>${s.t}</h3></div><div class="hwsc-rij"><div class="hwsc-p ${w=='Henk'?'spook':''}">${p}</div><div class="hwsc-t"><b>${w}</b><p>${t}</p></div></div><button class="knop volgende" id="hwv">${i<s.r.length-1?'Verder':'Oké!'}</button></div>`;
  try{fx.speel('kras')}catch(e){}o.querySelector('#hwv').onclick=()=>{i++;if(i<s.r.length)toon();else{o.remove();klaar&&klaar()}}};toon()};
/* ---------- raadsels (meerkeuze, zonder straf) ---------- */
const RA=[
 ['Mijn hoofd zit er nog maar net aan, ik zweef door muren en ik woon in de toren van Griffoendor. Wie ben ik?',['Haast Onthoofde Henk','Foppe de klopgeest','De Grijze Dame'],0,'Henk lacht zo hard dat zijn hoofd ervan wiebelt.'],
 ['Hoe meer je van mij weghaalt, hoe groter ik word. Wat ben ik?',['Een pompoen','Een kuil','Een schaduw'],1,'Hagrid graaft er elk jaar een paar voor zijn pompoenen.'],
 ['Ik ben oranje, ik heb een gezicht, en ik brand van binnen zonder dat het pijn doet. Wat ben ik?',['Een feniks','Een vuurpad','Een pompoenlantaarn'],2,'Kijk maar eens naar de lantaarns boven De Hal!'],
 ['Ik vlieg ’s nachts, hang overdag ondersteboven en zie met mijn oren. Wat ben ik?',['Een vleermuis','Een uil','Een Gouden Snaai'],0,'Zelfs de bijna echte vleermuizen van Fred en George.'],
 ['Wat kun je wel vangen, maar nooit gooien?',['Een Snaai','Een verkoudheid','Een Slurk'],1,'Daarom draagt Stronk in oktober altijd een sjaal.'],
 ['Bij welke club wil Henk zo graag horen, maar mag hij niet meedoen omdat zijn hoofd niet helemaal los is?',['De Hoofdloze Jacht','Het Zwerkbalteam','De Slakkenclub'],0,'Hoofd-polo spelen, stel je voor!'],
 ['Ik loop altijd met je mee, ik doe alles na, maar ik maak nooit geluid. Wat ben ik?',['Een spook','Je schaduw','Een huiself'],1,'In het kaarslicht van de kerker is hij extra lang.'],
 ['Wat staat er op 31 oktober zo groot als een schuur in de Grote Zaal?',['Hagrids reuzenpompoen','De Sorteerhoed','Een drakenei'],0,'Vandaag is het feest! Ga gauw kijken.'],
 ['Wat heeft een hals, maar geen hoofd?',['Henk','Een fles','Een spook'],1,'Al zegt Henk dat hij zelf ook bijna geen hoofd heeft.'],
];
const raadVrij=()=>{const st=stand(),h=H();const l=[];for(let i=0;i<=Math.min(8,st.i);i++)if(!h.raad[i])l.push(i);return l};
const raadNu=()=>{const st=stand(),l=raadVrij();return l.includes(st.i)?st.i:l[0]};
/* ---------- snoep geven ---------- */
const geef=(n,waar)=>{const h=H();h.tot+=n;bewaar();kaartVerf();if(open())wijsOpen()};
let wijsT=0;const wijsOpen=()=>{if(Date.now()-wijsT<6000)return;wijsT=Date.now();setTimeout(()=>{try{toast('🎃 Er ligt een Halloweenbeloning voor je klaar in De Hal')}catch(e){}},1200)};
/* ---------- snoepjes tijdens levels: hoe hoger de score, hoe meer ---------- */
const PER=650,MAXLV=12;
const chip=()=>{let c=document.getElementById('hwchip');const hud=document.querySelector('.m3hud');if(!hud)return null;if(!c){hud.insertAdjacentHTML('beforeend',`<div id="hwchip" class="hwchip" title="Pompoensnoepjes">${SNOEP}<b>0</b></div>`);c=document.getElementById('hwchip')}return c};
const vlieg=(b)=>{const c=chip();const cv=document.getElementById('m3c');if(!c||!cv)return;const r=cv.getBoundingClientRect(),t=c.getBoundingClientRect();
 const e=document.createElement('div');e.className='hwvlieg';e.innerHTML=SNOEP;const x=r.left+r.width*(.15+Math.random()*.7),y=r.top+r.height*(.2+Math.random()*.6);e.style.left=x+'px';e.style.top=y+'px';document.body.appendChild(e);
 requestAnimationFrame(()=>{e.style.transform=`translate(${t.left+t.width/2-x-14}px,${t.top+t.height/2-y-9}px) scale(.6) rotate(200deg)`;e.style.opacity='.9'});
 setTimeout(()=>{e.remove();const s=c.querySelector('b');if(s)s.textContent=b._hwN*x2()+(b._hwW|0);c.classList.remove('tik');void c.offsetWidth;c.classList.add('tik')},matchMedia('(prefers-reduced-motion: reduce)').matches?50:850)};
setInterval(()=>{try{if(!stand().aan||document.body.dataset.view!=='match3'||typeof M3==='undefined')return;const b=M3.b;if(!b||b.sim)return;chip();
 if(b._hwN==null){b._hwN=0}const doel=Math.min(MAXLV,Math.floor((b.score|0)/PER));
 if(b._hwN<doel){b._hwN++;geef(x2(),'level');vlieg(b)}}catch(e){}},420);
if(typeof m3Winst==='function'){const _w=m3Winst;window.m3Winst=m3Winst=function(n,b,...a){const r=_w.call(this,n,b,...a);
 try{if(stand().aan&&b&&!b.sim&&!b._hwWin){b._hwWin=1;const k=3*x2();b._hwW=k;H().lv++;geef(k,'winst');const c=document.getElementById('hwchip');if(c){const s=c.querySelector('b');if(s)s.textContent=(b._hwN|0)*x2()+k}}}catch(e){}return r}}
/* ---------- versiering ---------- */
const decor=()=>{let d=document.getElementById('hwdecor');if(!d){d=document.createElement('div');d.id='hwdecor';d.setAttribute('aria-hidden','true');
 d.innerHTML=`${WEB('l')}${WEB('r')}<div class="hwlanten">${[0,1,2,3,4].map(i=>`<span class="hwl l${i}">${LANT('k'+i)}</span>`).join('')}</div>${[0,1,2].map(i=>`<span class="hwb b${i}">${BAT}</span>`).join('')}<div class="hwkaarsen">${[0,1,2,3,4,5].map(i=>`<i class="hwk k${i}"></i>`).join('')}</div>`;
 document.body.insertBefore(d,document.getElementById('app'));const t=document.createElement('div');t.id='hwtint';document.body.appendChild(t)}return d};
const zet=()=>{const st=stand();document.body.classList.toggle('hw',st.aan);document.body.classList.toggle('hwfeest',st.aan&&st.feest);if(st.aan)decor()};
setInterval(zet,1500);zet();
if(typeof ga==='function'){const _ga=ga;ga=function(...a){const r=_ga.apply(this,a);try{zet()}catch(e){}return r}}
const SLINGER=()=>`<div class="hwslinger" aria-hidden="true"><svg class="hwtouw" viewBox="0 0 360 30" preserveAspectRatio="none"><path d="M0 4Q45 30 90 8T180 8T270 8T360 4" stroke="#3a2412" stroke-width="1.6" fill="none"/></svg>${[0,1,2,3,4,5,6].map(i=>i%2?`<span class="hws s${i}">${BAT}</span>`:`<span class="hws s${i}">${LANT('s'+i)}</span>`).join('')}</div>`;
/* ---------- kaart in de Hal ---------- */
const dagenTxt=st=>{const r=9-st.i;return r<=1?'laatste dag':'nog '+r+' dagen'};
const kaartHtml=()=>{const st=stand(),h=H();
 if(!st.aan){if(st.voor)return `<section class="hwkaart hwteaser rococo" id="hwkaart" onclick="toast('🎃 Vanaf zaterdag 24 oktober: de Halloweenweek!')"><div class="hwk-kop"><span class="hwk-pomp">${LANT('t')}</span><div><h3>Bijna Halloween…</h3><small>${st.voor==1?'Morgen':'Zaterdag'} begint de Halloweenweek in Zweinstein</small></div></div></section>`;return ''}
 const v=volgende(),vorig=h.stap?STAP[h.stap-1].n:0,p=v?Math.min(100,(h.tot-vorig)/(v.n-vorig)*100):100;
 const nieuwSc=SC.some((s,i)=>s.d<=st.i&&!h.sc[i]),raad=raadNu()!=null;
 return `<section class="hwkaart rococo ${st.feest?'hwfk':''}" id="hwkaart" onclick="ga('halloween')"><div class="hwk-kop"><span class="hwk-pomp">${LANT('h')}</span><div><h3>${st.feest?'Vandaag: Halloweenfeest!':'Halloweenweek'}</h3><small>Henks sterfdagfeest · ${dagenTxt(st)}</small></div><span class="hwk-snoep">${SNOEP}<b>${h.tot}</b></span></div>
  <div class="hwk-balk"><i style="width:${p.toFixed(0)}%"></i></div>
  <p class="hwk-volg">${open()?'<b class="hwk-klaar">✨ Beloning klaar om te openen!</b>':v?`Volgende: ${v.ico} ${v.t} <b>bij ${v.n}</b>`:'Alle beloningen verdiend! 🏆'}</p>
  ${nieuwSc||raad||(st.feest&&!h.feest)?`<div class="hwk-tags">${st.feest&&!h.feest?'<span>🍽️ Feestmaal</span>':''}${nieuwSc?'<span>📜 Nieuw verhaal</span>':''}${raad?'<span>❓ Raadsel</span>':''}</div>`:''}</section>`};
function kaartVerf(){const k=document.getElementById('hwkaart');if(k&&document.body.dataset.view==='home'){const h=kaartHtml();if(h)k.outerHTML=h}}
const _home=V.home;V.home=(...a)=>{const r=_home(...a);try{const app=$('#app');if(app&&!document.getElementById('hwkaart')){const h=kaartHtml();if(!app.querySelector('.hwslinger')&&stand().aan)app.insertAdjacentHTML('afterbegin',SLINGER());if(h){const na=app.querySelector('.rgstrook')||app.querySelector('.halh');if(na)na.insertAdjacentHTML('afterend',h);else app.insertAdjacentHTML('afterbegin',h)}}
 feestPopup();naEvent()}catch(e){console.warn(e)}return r};
const _kt=V.kaart;if(_kt)V.kaart=(...a)=>{const r=_kt(...a);try{if(stand().aan){const k=$('#app').firstElementChild;if(k&&!k.querySelector('.hwslinger')){k.style.position=k.style.position||'relative';k.insertAdjacentHTML('afterbegin',SLINGER())}}}catch(e){}return r};
/* ---------- 31 oktober: feest in de Grote Zaal ---------- */
const feestGeef=()=>{const h=H();if(h.feest)return '';h.feest=1;S.galjoenen+=30;const k=kik(1);geef(50*1,'feest');bewaar();try{stats()}catch(e){}return `+50 Pompoensnoepjes · +30 Smekkies · een Chocokikker (${k})`};
const feestScherm=()=>{const o=document.createElement('div');o.className='modal hwfeestm';o.dataset.pop='hwfeest';
 o.innerHTML=`<div class="modalin rococo hwfm"><div class="hwfm-beeld"><img src="img/hw/zaal-klein.webp" alt="De Grote Zaal met zwevende pompoenen">${[0,1,2,3].map(i=>`<span class="hwfz z${i}">${LANT('f'+i)}</span>`).join('')}</div><h2>Halloweenfeest in de Grote Zaal!</h2><p>Honderden kaarsen zweven onder het sterrenplafond, Hagrids reuzenpompoenen grijnzen vanaf de tafels en Henk zweeft trots voorbij.</p><p class="klein">Vandaag tellen alle Pompoensnoepjes dubbel.</p><div id="hwfmres"></div><button class="knop volgende" id="hwaan">Aan tafel!</button></div>`;
 document.body.appendChild(o);try{fx.speel('fanfare')}catch(e){}
 o.querySelector('#hwaan').onclick=()=>{const h=H();if(h.feest){o.remove();return}const t=feestGeef();o.querySelector('#hwfmres').innerHTML=`<p class="hwres">🎉 ${t}</p>`;try{fx.speel('munt');vib([30,30,60])}catch(e){}const k=o.querySelector('#hwaan');k.textContent='Heerlijk!';k.onclick=()=>{o.remove();if(document.body.dataset.view==='halloween')V.halloween();else kaartVerf()}}};
window.hwFeest=feestScherm;
const feestPopup=()=>{const st=stand(),h=H();if(!st.feest||h.feest||h.feestGezien===st.d.toDateString())return;h.feestGezien=st.d.toDateString();bewaar();
 setTimeout(()=>{if(document.body.dataset.view==='home')feestScherm();else{h.feestGezien='';bewaar()}},1200)};
/* ---------- na het event: bereikte beloningen alsnog geven ---------- */
const naEvent=()=>{const st=stand();if(st.aan||!S.hw||S.hw.j!==st.j||!st.na)return;const h=S.hw;const l=[];while(open()){l.push(STAP[h.stap].ico+' '+STAP[h.stap].g());h.stap++}if(!l.length)return;bewaar();try{stats()}catch(e){}
 setTimeout(()=>{const o=document.createElement('div');o.className='modal';o.innerHTML=`<div class="modalin rococo hwfm"><h2>Henk heeft iets voor je bewaard</h2><p>De Halloweenweek is voorbij, maar deze beloningen had je nog verdiend:</p><ul class="hwlijst">${l.map(x=>`<li>${x}</li>`).join('')}</ul><button class="knop volgende">Dank je, Henk!</button></div>`;document.body.appendChild(o);o.querySelector('button').onclick=()=>o.remove()},1500)};
/* ---------- het eventscherm ---------- */
const claim=()=>{const h=H();if(!open())return;const s=STAP[h.stap];const t=s.g();h.stap++;bewaar();try{stats()}catch(e){}
 const o=document.createElement('div');o.className='modal';o.innerHTML=`<div class="modalin rococo hwfm hwopen"><div class="hwopen-ico">${s.ico=='🏆'?'<img src="img/hw/trofee-256.webp" alt="Gouden Pompoen">':s.ico=='🃏'?'<img src="img/kaarten/haast-onthoofde-henk.webp" alt="">':`<span>${s.ico}</span>`}</div><h2>${s.t}</h2><p>${t}</p><button class="knop volgende">Mooi!</button></div>`;
 document.body.appendChild(o);try{fx.speel(s.ico=='🏆'?'fanfare':'tover');vib([30,30,60])}catch(e){}o.querySelector('button').onclick=()=>{o.remove();V.halloween()}};
V.halloween=()=>{const st=stand(),h=H();if(!st.aan&&!st.na)return V.home();
 const rn=raadNu();
 app(`<div class="hwscherm"><div class="hwkop"><img src="img/hw/zaal-klein.webp" alt=""><div class="hwkop-t"><small>Halloweenweek in Zweinstein</small><h1>Henks sterfdagfeest</h1><p>${st.aan?(st.feest?'Vandaag is het feest! Alle snoepjes tellen dubbel.':dagenTxt(st)+' · feest op za 31 okt'):'De week is voorbij. Tot volgend jaar!'}</p></div></div>
 ${st.feest?`<section class="kaart hwblok hwfeestblok"><h3>🍽️ Feest in de Grote Zaal</h3>${h.feest?'<p>Je hebt aangeschoven bij het feestmaal. Wat een avond!</p>':'<p>Het feestmaal staat klaar.</p><button class="knop volgende" onclick="hwFeest()">Aan tafel!</button>'}</section>`:''}
 <section class="kaart hwblok"><div class="hwstand">${SNOEP}<div><b>${h.tot}</b> Pompoensnoepjes</div></div><p class="klein">Je vindt ze in elk level: hoe hoger je score, hoe meer snoepjes eruit springen. Elke winst geeft er 3 extra. Raadsels en verhalen leveren ook snoep op.</p>
  <ol class="hwpad">${STAP.map((s,i)=>{const kl=i<h.stap,kan=i===h.stap&&h.tot>=s.n;return `<li class="${kl?'klaar':kan?'kan':'dicht'}"><span class="hwp-ico">${s.ico}</span><span class="hwp-t">${s.t}<small>${s.n} snoepjes</small></span>${kl?'<span class="hwp-s">✓</span>':kan?'<button class="knop klein" id="hwclaim">Openen</button>':h.tot>=s.n?'<span class="hwp-s">✨ bereikt</span>':`<span class="hwp-s">${s.n-h.tot} te gaan</span>`}</li>`}).join('')}</ol></section>
 ${rn!=null&&st.aan?`<section class="kaart hwblok hwraad"><h3>❓ Tilly’s raadsel ${rn===st.i?'van vandaag':'van '+dagNaam(st.j,rn)}</h3><p class="hwvraag">${RA[rn][0]}</p><div class="hwopties">${RA[rn][1].map((o,i)=>`<button class="knop" data-o="${i}">${o}</button>`).join('')}</div><div id="hwraadres"></div></section>`:`<section class="kaart hwblok hwraad"><h3>❓ Tilly’s raadsel</h3><p>${st.aan?'Alle raadsels opgelost! Morgen heeft Tilly een nieuwe.':'Alle raadsels van dit jaar zijn voorbij.'}</p></section>`}
 <section class="kaart hwblok"><h3>📜 Het verhaal</h3><ul class="hwverh">${SC.map((s,i)=>{const vrij=s.d<=st.i;return `<li class="${vrij?'':'dicht'}">${vrij?`<button class="linkknop" data-sc="${i}">${h.sc[i]?'':'<b class="hwnieuw">Nieuw</b> '}${s.t}</button>`:`<span>🔒 ${s.t}</span><small>vanaf ${dagNaam(st.j,s.d)}</small>`}</li>`}).join('')}</ul></section>
 </div>`);
 const c=$('#hwclaim');if(c)c.onclick=claim;
 document.querySelectorAll('[data-sc]').forEach(b=>b.onclick=()=>{const i=+b.dataset.sc;speel(SC[i],()=>{if(!h.sc[i]){h.sc[i]=1;geef(10,'verhaal');toast('📜 +10 Pompoensnoepjes van Henk')}V.halloween()})});
 document.querySelectorAll('.hwopties [data-o]').forEach(b=>b.onclick=()=>{const k=+b.dataset.o,R=RA[rn];const res=$('#hwraadres');
  if(k===R[2]){h.raad[rn]=1;geef(15,'raadsel');S.galjoenen+=10;bewaar();try{stats();fx.speel('goed');vib([20,30,40])}catch(e){}res.innerHTML=`<div class="hwgoed">${window.tilly?tilly('<b>Goed zo!</b> '+R[3]):''}<p>+15 Pompoensnoepjes · +10 Smekkies</p><button class="knop klein" id="hwrv">Verder</button></div>`;document.querySelectorAll('.hwopties button').forEach(x=>x.disabled=true);$('#hwrv').onclick=()=>V.halloween()}
  else{b.disabled=true;b.classList.add('mis');try{fx.speel('kras')}catch(e){}res.innerHTML=`<p class="klein hwhint">Hmm, dat is het niet. Probeer gerust nog eens, er is geen haast.</p>`}});
};
/* ---------- Mijn kamer: de Gouden Pompoen ---------- */
const _k=V.kamer;if(_k)V.kamer=(...a)=>{const r=_k(...a);try{const k=document.querySelector('.kamer');if(k&&(S.hwTrofee||[]).length&&!k.querySelector('.hwtrofee'))k.insertAdjacentHTML('beforeend',`<div class="hwtrofee" title="Gouden Pompoen ${S.hwTrofee.join(', ')}"><img src="img/hw/trofee-256.webp" alt="Gouden Pompoen"><small>Halloween ${S.hwTrofee.join(' · ')}</small></div>`)}catch(e){}return r};
/* ---------- kaart in het album (serie Feestdagen), nooit uit gewone trekkingen ---------- */
try{if(typeof KAARTEN!=='undefined'&&!KAARTEN.some(k=>k[0]==KAART)){KAARTEN.push([KAART,'Z','Het huisspook van Griffoendor. Zijn hoofd hangt nog aan één reepje vel. Op 31 oktober vierde hij zijn vijfhonderdste sterfdag, en jij was erbij.','img/kaarten/haast-onthoofde-henk.webp','Feestdagen',1]);if(window.KAARTSERIES&&!KAARTSERIES.includes('Feestdagen'))KAARTSERIES.push('Feestdagen')}
 if(typeof trekKaart==='function'){const _t=trekKaart;trekKaart=function(){let k;for(let i=0;i<30;i++){k=_t();if(!k||!k[5])return k}return KAARTEN.find(x=>!x[5])}}}catch(e){console.warn(e)}
/* ---------- makerscherm: datum voor Halloween ---------- */
const _mk=V.maker;if(_mk)V.maker=(...a)=>{const r=_mk(...a);try{const st=stand(),o=localStorage.getItem('zw_hwdatum')||'';
 $('#app').insertAdjacentHTML('beforeend',`<section class="kaart sierlijst"><h3>Halloween (test)</h3><p class="klein">Nu: ${st.d.toLocaleDateString('nl-NL',{weekday:'long',day:'numeric',month:'long'})} · ${st.aan?'event AAN (dag '+(st.i+1)+' van 9'+(st.feest?', feestdag':'')+')':'event uit'}${o?' · <b>testdatum</b>':''} · ${(S.hw&&S.hw.tot)|0} snoepjes, stap ${(S.hw&&S.hw.stap)|0}/10</p>
  <p><input type="date" id="hwdat" value="${o||st.d.getFullYear()+'-'+pad(st.d.getMonth()+1)+'-'+pad(st.d.getDate())}"> <button class="knop klein" id="hwzet">Gebruik datum</button> <button class="knop klein" id="hwecht">Echte datum</button></p>
  <p><button class="knop klein" id="hw100">+100 snoepjes</button> <button class="knop klein" id="hwwis">Halloween-voortgang wissen</button></p></section>`);
 $('#hwzet').onclick=()=>{localStorage.setItem('zw_hwdatum',$('#hwdat').value);zet();V.maker()};
 $('#hwecht').onclick=()=>{localStorage.removeItem('zw_hwdatum');zet();V.maker()};
 $('#hw100').onclick=()=>{geef(100,'test');V.maker()};
 $('#hwwis').onclick=()=>{delete S.hw;bewaar();V.maker()}}catch(e){console.warn(e)}return r};
})();
