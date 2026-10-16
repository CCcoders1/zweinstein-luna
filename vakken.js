'use strict';
/* ====== 600 levels in 6 vakken van 100; elk volgend vak is een betaalde les (Smekkies) ====== */
const M3VAKKEN=[
 {id:'herbologie',n:'Herbologie',prof:'Professor Stronk',thema:'herbologie',van:1,prijs:0,ls:'herbologie'},
 {id:'bezweringen',n:'Bezweringen',prof:'Professor Banning',thema:'bezweringen',van:101,prijs:250,ls:'bezweringen'},
 {id:'toverdranken',n:'Toverdranken',prof:'Professor Sneep',thema:'toverdranken',van:201,prijs:400,ls:'toverdranken'},
 {id:'gedaante',n:'Gedaanteverwisselingen',prof:'Professor Anderling',thema:'gedaante',van:301,prijs:600,ls:'gedaanteverwisselingen'},
 {id:'astronomie',n:'Astronomie',prof:'Professor Sinistra',thema:'astronomie',van:401,prijs:800,ls:'astronomie'},
 {id:'verweer',n:'Verweer tegen de Zwarte Kunsten',prof:'Professor Lupos',thema:'verweer',van:501,prijs:1000,ls:'verweer'}];
const VAK_LEVELS=100;
/* Later in te schakelen: betaalde les per vak (prijzen staan al in M3VAKKEN). Nu: vakken gaan gratis open bij het halen van level 100, 200, … */
const LES_KOSTEN=false;
(()=>{
 /* --- thema's + speelstukken voor de nieuwe vakken --- */
 const basis=M3THEMA.herbologie;
 const TH={bezweringen:['Bezweringen','Rondzwevende veren','Betoverde kist','Zwevende kandelaar'],gedaante:['Gedaanteverwisselingen','Versteende tegel','Theekopkist','Muizenkooi'],
  astronomie:['Astronomie','Sterrenstofwolk','Sterrenkist','Hemelbol'],verweer:['Verweer tegen de Zwarte Kunsten','Zwarte nevel','Boemankast','Schildkristal'],toverdranken:['Toverdranken']};
 const MV={herbologie:['kistjes','mandragorapotten'],toverdranken:['ingrediëntenkisten','ketels'],bezweringen:['betoverde kisten','zwevende kandelaars'],gedaante:['theekopkisten','muizenkooien'],astronomie:['sterrenkisten','hemelbollen'],verweer:['boemankasten','schildkristallen']};
 Object.entries(TH).forEach(([id,[n,o,k,p]])=>{if(!M3THEMA[id])M3THEMA[id]={...basis,t:basis.t.slice()};const T=M3THEMA[id];T.n=n;T.id=id;if(o){T.onkruid=o;T.kist=k;T.pot=p}});
 Object.entries(MV).forEach(([id,[k,p]])=>{if(M3THEMA[id]){M3THEMA[id].kistMv=k;M3THEMA[id].potMv=p}});
 const alle={};Object.values(KU.RECEPT).forEach(l=>l.forEach(r=>{if(r[3])alle[r[3]]=r}));
 const SET={gedaante:['herinnerbal','hedwig','chocokikker','ketelcake','toverstaf','pompoen','feniksveer'],verweer:['herinnerbal','feniksveer','toverstaf','drakenei','drankje','hedwig','boterbier']};
 Object.entries(SET).forEach(([th,l])=>{if(l.every(x=>alle[x])){KU.RECEPT[th]=l.map(x=>alle[x]);M3THEMA[th].t=KU.RECEPT[th].map(r=>[r[0],r[1],'M12 4v16'])}});
 /* --- vak per level --- */
 window.vakVan=n=>M3VAKKEN[Math.min(M3VAKKEN.length-1,Math.floor((Math.max(1,n)-1)/VAK_LEVELS))];
 const decorVan=id=>{const v=[...(window.VAK1||[]),...(window.VAK_EXTRA||[])].find(x=>x.id==id);return v?v.decor:'zaal'};
 m3VakVoor=function(n){const v=vakVan(n||1);return{...([...(window.VAK1||[]),...(window.VAK_EXTRA||[])].find(x=>x.id==v.id)||{}),...v,decor:decorVan(v.id)}};
 /* --- moeilijkheid en obstakels per vak (levels 1-30 handgemaakt blijven) --- */
 const _lvl=m3Level;m3Level=function(n){const L=_lvl(n);const vi=Math.floor((n-1)/VAK_LEVELS);if(n<=30||vi<1)return L;
  const d=(n-1)%VAK_LEVELS;const r=rngVan(n*131+7);
  L.zetten=Math.max(16,L.zetten-Math.min(4,vi)+((S.m3kal||{})[n]?0:0));if(vi>=2)L.kleuren=7;
  const pat=[null,['rand','kruis'],['onder','midden'],['dambord','vol'],['kruis','vol'],['dambord','vol','rand']][vi];const kp=[null,['rij'],['hoeken'],['rij','dubbel'],['dubbel'],['hoeken','dubbel']][vi];
  const heeft=t=>L.doelen.some(x=>x[0]==t);
  if(!heeft('o')&&r()<.35+vi*.08){L.onkruid=pat[r()*pat.length|0];L.doelen.push(['o'])}
  if(!heeft('k')&&vi>=1&&r()<.25+vi*.08){L.kist=kp[r()*kp.length|0];L.doelen.push(['k'])}
  if(L.doelen.length>3)L.doelen=L.doelen.slice(-3);
  if(!L.doelen.some(x=>x[0]=='o'))L.onkruid=0;if(!L.doelen.some(x=>x[0]=='k'))L.kist=0;if(!L.doelen.some(x=>x[0]=='p'))L.pot=0;
  L.doelen.forEach(x=>{if(typeof x[0]=='number'){x[0]=x[0]%L.kleuren;x[1]=Math.min(45,x[1]+vi*2+(d/25|0))}});
  return L};
 if(!S.kalV2){S.kalV2=1;if(S.m3kal)Object.keys(S.m3kal).forEach(n=>{try{if(m3Level(+n).kist)delete S.m3kal[n]}catch(e){}});bewaar()}
 /* --- betaalde lessen --- */
 S.lesBetaald=S.lesBetaald||{};
 M3VAKKEN.forEach(v=>{if(v.prijs&&(S.m3lvl||1)>v.van)S.lesBetaald[v.id]=1});bewaar();   // migratie: al voorbij het begin → open
 const open=v=>!LES_KOSTEN||!v.prijs||S.lesBetaald[v.id];S.vakIntro=S.vakIntro||{};M3VAKKEN.forEach(v=>{if((S.m3lvl||1)>v.van)S.vakIntro[v.id]=1});window.vakOpen=open;
 const _ga=ga;ga=function(s,...a){if(s=='match3'){const n=a[0]||S.m3lvl||1;const v=vakVan(n);if(!open(v)||(v.van>1&&!S.vakIntro[v.id]&&(S.m3lvl||1)>=v.van))return _ga('lesdeur',v.id)}return _ga(s,...a)};
 const ls=v=>`img/laadschermen/${v.ls}${innerWidth<=600?'-klein':''}.webp`;
 V.lesdeur=(id)=>{const v=M3VAKKEN.find(x=>x.id==(id||vakVan(S.m3lvl).id))||M3VAKKEN[1];if(!LES_KOSTEN)return nieuwVak(v);const heb=S.galjoenen||0;const p=Math.min(100,Math.round(heb/v.prijs*100));const kan=heb>=v.prijs;
  app(`<section class="lesdeur rococo"><div class="ld-bord" style="background-image:url('${ls(v)}')"><div class="ld-deur l"></div><div class="ld-deur r"></div><div class="ld-slot">${icoon('slot')}</div></div>
   <small class="ld-nr">Les ${M3VAKKEN.indexOf(v)+1}</small><h2>${v.n}</h2><p>${v.prof} wacht achter deze deur. Koop de les, dan gaat het lokaal open.</p>
   <div class="ld-zak"><img src="img/smekkies/zak-${heb<50?'leeg':heb<300?'half':'vol'}-128.webp" alt=""><div class="ld-balk"><i style="width:${p}%"></i></div><b>${heb} / ${v.prijs}</b></div>
   <button class="knop ${kan?'volgende':''}" id="ldkoop">Les ontgrendelen · ${v.prijs} Smekkies</button>${kan?'':`<p class="klein">Nog ${v.prijs-heb} Smekkies nodig. Speel bonusspellen of oogst in de kas, dan heb je ze zo.</p>`}</section>`);
  $('#ldkoop').onclick=()=>{if((S.galjoenen||0)<v.prijs){toast(`Nog ${v.prijs-(S.galjoenen||0)} Smekkies nodig voor deze les.`);try{fx.fout()}catch(e){}const z=document.querySelector('.ld-zak');z.classList.remove('schud');void z.offsetWidth;z.classList.add('schud');return}
   const bord=document.querySelector('.ld-bord').getBoundingClientRect();window._smekDoel=[bord.left+bord.width/2,bord.top+bord.height/2];
   S.galjoenen-=v.prijs;S.lesBetaald[v.id]=1;bewaar();stats();ontgrendel(v)}};
 function nieuwVak(v){app(`<section class="lesdeur rococo gratis"><div class="ld-bord" style="background-image:url('${ls(v)}')"><div class="ld-deur l"></div><div class="ld-deur r"></div></div><small class="ld-nr">Nieuw vak!</small><h2>${v.n}</h2><p>${v.prof} opent de deur van het lokaal…</p></section>`);
  S.vakIntro[v.id]=1;bewaar();ontgrendel(v)}
 function ontgrendel(v){const sec=document.querySelector('.lesdeur');setTimeout(()=>{sec.classList.add('open');try{fx.speel('fanfare')}catch(e){}try{navigator.vibrate&&navigator.vibrate([30,40,90])}catch(e){}},900);
  setTimeout(()=>{try{confetti&&confetti()}catch(e){}const k=document.createElement('div');k.className='ld-feest';k.innerHTML=`<h3>${v.n} is open!</h3><p><b>${v.prof}:</b> “Welkom in mijn les, juffrouw Leeflang. Ik heb er zin in.”</p><p class="klein">Tilly: “Luna! Een heel nieuw vak, en nieuwe voorwerpen op het bord. Kom op!”</p><button class="knop volgende" id="ldverder">Naar level ${v.van}</button>`;sec.appendChild(k);
   $('#ldverder').onclick=()=>ga('match3',Math.max(v.van,Math.min(S.m3lvl,v.van+VAK_LEVELS-1)))},2100)}
 /* --- laadschermen per vak --- */
 const TIPS={bezweringen:['Banning: “Zwaaien en tikken, niet vergeten: zwaaien en tikken!”','Tip: Wingardium Leviósa – de klemtoon ligt op de ó.','Tilly: “Ik liet gisteren per ongeluk mijn inktpot zweven. Hij hangt er nog.”','Tip: zwevende veren breek je door ernaast te matchen.'],
  toverdranken:['Sneep: “Ik verwacht stilte… en precisie.”','Tip: de Kalmeringsdrank roer je met de klok mee.','Tilly: “Fluister maar even, in de kerkers galmt alles.”','Tip: vijf of meer in één keer vult je toverpoeder-ampul.'],
  gedaanteverwisselingen:['Anderling: “Gedaanteverwisselingen is een van de lastigste en gevaarlijkste vakken.”','Tip: een muis wordt een theekop, maar zonder snorharen graag.','Tilly: “Zag je die kat op haar bureau? Ik zweer dat hij knipoogde.”','Tip: versteende tegels hebben soms twee lagen.'],
  astronomie:['Tip: de manen van Jupiter: Europa, Io, Ganymedes en Callisto.','Tilly: “Kijk, de Grote Beer! Of is dat een koekenpan?”','Tip: sterrenstofwolken verdwijnen als je ernaast matcht.','Sinistra: “Sterren liegen niet, ze wachten alleen.”'],
  verweer:['Tip: een Boeman verjaag je met Ridiculus, en gelach.','Lupos: “Verweer begint met moed, niet met toverkracht.”','Tilly: “Ik heb een chocoladekikker bij me, voor na de les. Helpt echt.”','Tip: zwarte nevel breek je door er vlak naast te matchen.']};
 const PAN={bezweringen:[34,86],toverdranken:[8,60],gedaanteverwisselingen:[8,66],astronomie:[40,92],verweer:[6,62]};
 const thLS={bezweringen:'bezweringen',toverdranken:'toverdranken',gedaante:'gedaanteverwisselingen',astronomie:'astronomie',verweer:'verweer'};
 Object.entries(thLS).forEach(([th,f])=>{LAADSCHERM[th]={img:'img/laadschermen/'+f,klein:'img/laadschermen/'+f+'-klein',pan:PAN[f],duur:6000,tips:TIPS[f]}});
 /* --- levelpad: per les een thema, vijf levels vooruit, daarna nevel --- */
 const PAD_VOORUIT=19;
 function padCadeau(n){if(n===22)return 'Lichtbrouwsel';if(n===222)return 'Vocht van de Levende Dood';if(n===16)return 'Een elfje';if(n===30)return 'Groene pot';if(n===60)return 'Diep Lichtbrouwsel';if(n===150||n===250||n===350||n===450||n===550)return 'Een nieuw elfje';return ''}
 function padPlaag(n){return window.plaagVan&&plaagVan(n)}
 function padZwaar(n){const e=window.M3BAL&&M3BAL[n];if(e)return +e[2]<=.5;let L;try{L=m3Level(n)}catch(err){return false}const d=L.doelen||[];const soorten=new Set(d.map(x=>typeof x[0]=='number'?'kleur':x[0]));return soorten.size>=3&&(L.onkruid=='vol'||L.onkruid=='dambord'||L.kist=='dubbel')}
 function padScan(v,van,tot,fn){for(let L=van;L<=tot;L++){const r=fn(L);if(r)return r}return null}
 function padTeken(soort,titel,sub){return `<span class="pad-teken ${soort}"><i class="pad-gloed ${soort}" aria-hidden="true"></i><span><b>${titel}</b>${sub?`<small>${sub}</small>`:''}</span></span>`}
 let padVak=null;
 V.pad=(vid)=>{const hier=S.m3lvl||1;const nu=vakVan(hier);const v=M3VAKKEN.find(x=>x.id==(vid||padVak))||nu;padVak=v.id;
  const eindex=v.van+VAK_LEVELS-1,bereikt=hier>=v.van,klaar=hier>eindex,bezig=bereikt&&!klaar;
  const kop=M3VAKKEN.map(x=>{const xEinde=x.van+VAK_LEVELS-1;const xBereikt=hier>=x.van,xKlaar=hier>xEinde;const st=x===v?'actief':xKlaar?'af':xBereikt?'open':'dicht';
   const pestVooruit=xBereikt&&!xKlaar&&padScan(x,Math.max(x.van,hier+1),xEinde,L=>padPlaag(L));
   const wacht=!xBereikt||!!pestVooruit;
   const klein=st=='af'?'klaar':st=='dicht'?'nog dicht':st=='actief'?'nu':'';
   return `<button class="pv ${st}${wacht?' wacht':''}${pestVooruit?' wacht-plaag':''}" data-v="${x.id}"><img src="img/laadschermen/${x.ls}-klein.webp" alt="" loading="lazy"><span>${x.n}</span><small>${klein}</small></button>`}).join('');
  const isOpen=open(v);
  let knoppen='',lijn='',nevel='',H=300,metNevel=false;
  if(!bereikt||!isOpen){
   const eerstPlaag=padScan(v,v.van,eindex,L=>padPlaag(L));
   metNevel=true;
   nevel=`<div class="pad-nevel">${padTeken('cadeau','Er wacht iets','in deze les')}${eerstPlaag?padTeken('plaag',eerstPlaag.kaart+' nadert',''):''}</div>`;
   lijn=`<svg class="padlijn sluierlijn" viewBox="0 0 100 240" preserveAspectRatio="none" aria-hidden="true"><path d="M50 210 C 28 170, 74 140, 50 100 C 30 70, 70 40, 50 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="2 2.6" vector-effect="non-scaling-stroke"/></svg>`;
   H=320;
  }else{
  const dag=window.schoolDagen&&schoolDagen.huidig();
  const dagActief=dag&&dag.vak.id===v.id;
  const begin=dagActief?dag.begin:v.van;
  const grens=dagActief?dag.einde:eindex;
  const tot=klaar?eindex:Math.min(grens,hier+PAD_VOORUIT);
  const niveaus=[];for(let L=begin;L<=tot;L++)niveaus.push(L);
   const mist=!klaar&&tot<eindex;
   let plaagVer=null,giftVer='';
   if(mist){const verderVan=tot+1;plaagVer=padScan(v,verderVan,eindex,L=>padPlaag(L));giftVer=padScan(v,verderVan,eindex,L=>padCadeau(L))||'';metNevel=true}
   const top=mist?(plaagVer&&giftVer?176:128):52,rij=82,n=niveaus.length;
   const pts=niveaus.map((L,i)=>{const vanOnder=n-1-i;return {L,x:50+Math.sin(vanOnder*.95)*22,y:top+vanOnder*rij}});
   H=top+Math.max(0,n-1)*rij+64;
  lijn=`<svg class="padlijn" viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="M${pts.map(p=>p.x+' '+p.y).join(' L')}" fill="none" stroke="#d4af37" stroke-width="1.8" stroke-dasharray="2 2.4" vector-effect="non-scaling-stroke"/></svg>`;
   knoppen=pts.map(p=>{const L=p.L,d=L-hier;const st=L<hier?'af':L==hier?'nu':'vooruit';
    const plaag=padPlaag(L),cadeau=padCadeau(L),zwaar=!plaag&&padZwaar(L);
    const cls=[st,plaag?'plaag':'',cadeau?'cadeau':'',zwaar?'zwaar':'',L>=100?'lang':'','v'+Math.max(0,d)].filter(Boolean).join(' ');
    const tip=plaag&&cadeau?(plaag.soort==='damp'?plaag.kaart+', recept: '+cadeau:'Duivelsstrik, recept: '+cadeau):plaag?(plaag.soort==='damp'?'Plaaglevel, '+plaag.kaart:'Plaaglevel, Duivelsstrik'):cadeau?('Hier krijg je: '+cadeau):zwaar?'Extra lastig level':'';
    return `<button class="padlvl ${cls}" data-l="${L}"${tip?` title="${tip}"`:''} style="left:${p.x}%;top:${p.y}px${d>0?';--v:'+d:''}">${L}${L==hier?'<span class="luna">L</span>':''}</button>`}).join('');
   if(mist)nevel=`<div class="pad-nevel">${plaagVer?padTeken('plaag',plaagVer.kaart+' nadert',''):''}${giftVer?padTeken('cadeau',giftVer,'dat krijg je'):''}</div>`;
  }
  const deur=!isOpen?`<div class="paddeur"><div class="pd-deur">${icoon('slot')}</div><p>Deze les is nog dicht.</p><b>${S.galjoenen||0} / ${v.prijs} Smekkies</b><div class="ld-balk"><i style="width:${Math.min(100,(S.galjoenen||0)/v.prijs*100)}%"></i></div><button class="knop volgende" id="naardeur">Bekijk de les</button></div>`:(!bereikt?`<div class="paddeur"><div class="pd-deur">${icoon('slot')}</div><p>Deze les is nog dicht. Maak eerst de les ervoor af.</p></div>`:'');
  app(`<div class="vakbalk">${kop}</div><div class="padkopbeeld" style="background-image:url('img/laadschermen/${v.ls}-klein.webp')"><div><small>Les ${M3VAKKEN.indexOf(v)+1}</small><h2>${v.n}</h2><p>${v.prof}</p></div></div>
   ${deur}<div class="pad thema thema-${v.id}${metNevel?' met-nevel':''}" style="height:${H}px">${lijn}${knoppen}${nevel}</div>`);
  document.querySelectorAll('.pv').forEach(b=>b.onclick=()=>{const x=M3VAKKEN.find(y=>y.id==b.dataset.v);if(!open(x)&&x.van>hier&&vakVan(hier)!==x&&M3VAKKEN.indexOf(x)>M3VAKKEN.indexOf(vakVan(hier))+1){toast('Eerst de vorige les afmaken.');}V.pad(x.id)});
  const nd=$('#naardeur');if(nd)nd.onclick=()=>{if(M3VAKKEN.indexOf(v)>M3VAKKEN.indexOf(nu)&&hier<v.van){toast('Eerst de vorige les afmaken.');return}ga('lesdeur',v.id)};
  document.querySelectorAll('.padlvl').forEach(b=>b.onclick=()=>{const L=+b.dataset.l;if(!open(vakVan(L)))return ga('lesdeur',vakVan(L).id);if(L<=hier)ga('match3',L);else{const p=padPlaag(L),c=padCadeau(L);toast(p&&c?(p.soort==='damp'?'Hier bevrijd je het recept voor '+c+'. Eerst level '+hier+' afmaken.':'Hier bevrijd je het recept tegen de duivelsstrik. Eerst level '+hier+' afmaken.'):p?(p.soort==='damp'?'Dit is een plaaglevel. Gestold brouwsel groeit over het bord.':'Dit is een plaaglevel. Duivelsstrik groeit over het bord.'):c?('Hier krijg je: '+c+'. Eerst level '+hier+' afmaken.'):padZwaar(L)?'Dit level is extra lastig. Eerst level '+hier+' afmaken.':'Speel eerst level '+hier)}});
  setTimeout(()=>{const a=document.querySelector('.pv.actief');a&&a.scrollIntoView({inline:'center',block:'nearest'});
   const n=$('.padlvl.nu');
   if(n){const nav=$('#nav');const onder=nav?nav.getBoundingClientRect().height:0;const r=n.getBoundingClientRect();window.scrollTo(0,Math.max(0,window.scrollY+r.bottom-(window.innerHeight-onder-18)))}
   else{const m=$('.pad-nevel');m&&m.scrollIntoView({block:'center'})}},RMP?0:350)};
})();
