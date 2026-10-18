/* Volgende stap in de eigen kas: één duidelijke taak bovenaan, uitklapbaar lijstje met andere kas-taken.
   Leest alleen bestaande spelstatus; beloningen veranderen niet. */
(()=>{if(typeof V==='undefined'||!V.mijnkas)return;
const has=f=>typeof f==='function';
const lv=()=>S.m3lvl|0;
const naamVan=z=>(typeof ZADEN!=='undefined'&&ZADEN[z])?ZADEN[z][0]:z;
const NU=()=>Date.now();
const POTPRIJS=[1000,1600,2400,3200],POTNAAM=['de groene kruidenpot','de Edelsteenpot','de Kristalpot','de Hartpot'];
function potten(){const L=[];document.querySelectorAll('.mk-pot[data-i]').forEach(el=>L.push({i:+el.dataset.i,el,sel:`.mk-pot[data-i="${el.dataset.i}"]`}));
 document.querySelectorAll('.mk-vloer[data-m]').forEach(el=>{const m=+el.dataset.m;if(S.mega&&S.mega[m])return;L.push({i:200+m,el,sel:`.mk-vloer[data-m="${m}"]`})});return L}
const pl=i=>(S.kweek||{})[i]||null;
const st=p=>has(window.stadium)||typeof stadium==='function'?stadium(p):-1;
function zaadVoor(i){return Object.keys(S.zaden||{}).filter(z=>(S.zaden[z]|0)>0&&typeof ZADEN!=='undefined'&&ZADEN[z]&&(typeof kruidMag!=='function'||kruidMag(z,i)))}
function goedkoopsteZaad(){if(typeof ZADEN==='undefined')return null;let best=null;Object.entries(ZADEN).forEach(([z,d])=>{if(window.SUPERPLANTEN&&SUPERPLANTEN[z])return;if(window.zaadDicht&&zaadDicht(z))return;if(typeof kruidSlot==='function'&&kruidSlot(z))return;if(!best||d[3]<best[1])best=[z,d[3]]});return best}
function taken(){const T=[];const P=potten();const leeg=P.filter(p=>!pl(p.i)),groei=P.filter(p=>pl(p.i)&&st(pl(p.i))<4),rijp=P.filter(p=>pl(p.i)&&st(pl(p.i))==4);
 const smek=S.galjoenen|0;
 // 1. poort van Professor Stronk (houdt het volgende level tegen)
 const poort=window.leraarPoort&&leraarPoort();
 if(poort){const prijs=POTPRIJS[0];T.push({id:'poort',ico:'🪴',wie:poort.prof,tekst:smek>=prijs?`Koop ${POTNAAM[0]} bij Potten. Dan gaat level ${poort.na+1} open.`:`Spaar voor ${POTNAAM[0]}. Daarna gaat level ${poort.na+1} open.`,tel:`${Math.min(smek,prijs)}/${prijs}`,doel:'#potwinkel',doen:smek>=prijs})}
 // 2. rijpe planten
 if(rijp.length){const p=rijp[0];T.push({id:'oogst',ico:'🌿',tekst:rijp.length>1?`Oogst je planten! ${naamVan(pl(p.i).z)} is klaar, en nog ${rijp.length-1} andere.`:`Oogst je ${naamVan(pl(p.i).z)}. Hij is klaar!`,tel:null,doel:p.sel,doen:true})}
 // 3. opdracht van een professor (kweekopdracht)
 if(has(window.kOpdr)||typeof kOpdr==='function'){try{const o=kOpdr(),z=o[0],dicht=window.zaadDicht&&zaadDicht(z),slot=typeof kruidSlot==='function'&&kruidSlot(z);const tel=kOpdrTel();
  if(dicht||slot)T.push({id:'opdr',ico:'📜',wie:o[3],tekst:o[2],tel:`${tel}/${o[1]}`,dicht:dicht?`Vanaf level ${dicht}`:'Eerst de groene kruidenpot'});
  else{const groeitAl=groei.find(p=>pl(p.i).z===z);const lp=leeg.find(p=>!(typeof kruidMag==='function')||kruidMag(z,p.i));let stap,doel=null,doen=false;
   if(rijp.some(p=>pl(p.i).z===z)){stap=`Oogst je ${naamVan(z)}.`;doel=rijp.find(p=>pl(p.i).z===z).sel;doen=true}
   else if(groeitAl){stap=`Je ${naamVan(z)} groeit. Nog ${tijd(rest(pl(groeitAl.i)))}.`;doel=groeitAl.sel}
   else if((S.zaden[z]|0)>0&&lp){stap=`Plant een ${naamVan(z)}-zaadje.`;doel=lp.sel;doen=true}
   else if((S.zaden[z]|0)>0){stap=`Plant een ${naamVan(z)}-zaadje zodra er een pot vrij is.`}
   else if(smek>=ZADEN[z][3]){stap=`Koop een ${naamVan(z)}-zaadje in de Winkel.`;doel='#balkwinkel';doen=true}
   else stap=`Speel een level voor Smekkies voor een ${naamVan(z)}-zaadje.`;
   T.push({id:'opdr',ico:'📜',wie:o[3],tekst:`${o[2]}. ${stap}`,tel:`${tel}/${o[1]}`,doel,doen})}}catch(e){}}
 // 4. lege pot vullen
 if(leeg.length){const p=leeg[0],z=zaadVoor(p.i);if(z.length)T.push({id:'plant',ico:'🌱',tekst:'Plant een zaadje in je lege pot.',tel:null,doel:p.sel,doen:true});
  else{const g=goedkoopsteZaad();if(g&&smek>=g[1])T.push({id:'zaad',ico:'🛍️',tekst:`Koop zaadjes in de Winkel (${naamVan(g[0])} kost ${g[1]} Smekkies).`,doel:'#balkwinkel',doen:true})}}
 // 5. water aanzetten: Flipendo, Leviosa, kooi, blok
 const leer=k=>window.spreukGeleerd&&spreukGeleerd(k),open=k=>!window.spreukOpen||spreukOpen(k);const SV=window.SPREUK_VAN||{flipendo:3,leviosa:6};
 if(!(window.waterMag&&waterMag())){for(const [k,n] of [['flipendo','Flipendo'],['leviosa','Wingardium Leviosa']]){if(leer(k))continue;
   if(open(k))T.push({id:'les-'+k,ico:'🪄',wie:'Professor Banning',tekst:`Leer ${n} bij Professor Banning. Dan kan het water in je kas aan.`,doel:'.mk-leviosa .knop',doen:true});
   else T.push({id:'les-'+k,ico:'🪄',wie:'Professor Banning',tekst:`Leer ${n} voor de sproeiers.`,dicht:`Vanaf level ${SV[k]}`});break}}
 else if(!S.kooiOpen)T.push({id:'kooi',ico:'🔓',tekst:'Open de kooi: tik op de knop met Flipendo naast het blok.',doel:'.mk-kooiknop',doen:true});
 else{const kamer=document.querySelector('.mk-kamer');const sproeit=kamer&&kamer.classList.contains('sproei');const w=S.water||{};const ander=1-(w.blok|0);const u=document.querySelector(`.mk-silos .mk-unit[data-i="${ander}"] span`);const vol=u&&parseInt(u.textContent)>=100;
  if(!sproeit&&vol)T.push({id:'blok',ico:'💧',tekst:'Een silo is vol! Laat het blok met Wingardium Leviosa naar de knop bij die silo zweven.',doel:'.mk-blok',doen:true})}
 // 6. water geven (alleen als de sproeiers uit staan)
 const sproeit=document.querySelector('.mk-kamer.sproei');if(!sproeit){const dorst=groei.find(p=>!(pl(p.i).nat>NU()));if(dorst)T.push({id:'water',ico:'💦',tekst:`Geef je ${naamVan(pl(dorst.i).z)} water. Dan groeit hij 25% sneller.`,doel:dorst.sel,doen:true})}
 // 7. opdrachten en dagdoel die over de kas gaan (voortgang)
 try{const tv=(w)=>typeof telV==='function'?telV('oogst',w):0;
  if(typeof dagQuests==='function'){const q=dagQuests().find(q=>q[0]==='oogst');if(q&&!(S.questKlaar||{})[vandaag()+'oogst']&&tv(0)<q[1])T.push({id:'quest',ico:'📋',tekst:q[2]+'.',tel:`${Math.min(q[1],tv(0))}/${q[1]}`,info:1})}
  const d=((S.tel||{})[vandaag()]||{}).oogst|0;if(d<1)T.push({id:'dagdoel',ico:'⭐',tekst:'Dagdoel: oogst vandaag een plant.',tel:'0/1',info:1});
  if(typeof WEEKQ!=='undefined'){const q=WEEKQ.find(q=>q[0]==='oogst');if(q&&tv(1)<q[1])T.push({id:'week',ico:'📅',tekst:q[2]+'.',tel:`${Math.min(q[1],tv(1))}/${q[1]}`,info:1})}}catch(e){}
 // 8. een nieuwe pot kopen
 if(!poort){const n=S.potUpgrade|0;const groot=lv()>=101||!!S.groteTafel||n>=3;if(n<4){const mag=n<2||groot;if(mag&&smek>=POTPRIJS[n])T.push({id:'pot',ico:'🏺',tekst:`Je kunt ${POTNAAM[n]} kopen bij Potten (${POTPRIJS[n]} Smekkies). Dan heb je plek voor een plant meer.`,doel:'#potwinkel',doen:true})}}
 return {T,groei}}
function wachtTekst(groei){if(!groei.length)return 'Alles gedaan! Speel een level, dan verdien je Smekkies voor nieuwe zaadjes.';const ms=Math.min(...groei.map(p=>rest(pl(p.i))));return `Alles gedaan! Kom terug als je planten klaar zijn (over ${tijd(ms)}).`}
/* ---------- tekenen ---------- */
let open=false,sleutel='';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function teken(forceer){if(document.body.dataset.view!=='mijnkas')return;const app=document.getElementById('app');if(!app||!app.querySelector('.mk-kamer'))return;
 const {T,groei}=taken();const doe=T.filter(t=>t.doen&&!t.dicht);const hoofd=doe[0]||null;const rest_=T.filter(t=>t!==hoofd);
 const k=JSON.stringify([open,T.map(t=>[t.id,t.tekst,t.tel,t.dicht]),hoofd?'':wachtTekst(groei)]);if(!forceer&&k===sleutel&&document.getElementById('kastaak'))return;sleutel=k;
 let el=document.getElementById('kastaak');if(!el){el=document.createElement('section');el.id='kastaak';el.className='kastaak';app.appendChild(el)}
 const rij=t=>`<li class="${t.dicht?'dicht':''}${t.info?' info':''}"><span class="kt-ico">${t.ico}</span><span class="kt-txt">${t.wie&&!t.tekst.includes(t.wie)?`<b>${esc(t.wie)}:</b> `:''}${esc(t.tekst)}${t.dicht?` <em class="kt-slot">🔒 ${esc(t.dicht)}</em>`:''}</span>${t.tel?`<span class="kt-tel">${t.tel}</span>`:''}${t.doel&&!t.dicht?`<button type="button" class="kt-wijs" data-doel="${esc(t.doel)}" aria-label="Laat zien waar">➜</button>`:''}</li>`;
 el.innerHTML=`<div class="kt-kop" role="button" aria-expanded="${open}"><span class="kt-label">${hoofd?'Volgende stap':'Klaar voor nu'}</span>${rest_.length?`<span class="kt-meer">${open?'Minder ▴':`Nog ${rest_.length} ▾`}</span>`:''}</div>
 <div class="kt-hoofd">${hoofd?`<span class="kt-ico">${hoofd.ico}</span><span class="kt-txt">${hoofd.wie&&!hoofd.tekst.includes(hoofd.wie)?`<b>${esc(hoofd.wie)}:</b> `:''}${esc(hoofd.tekst)}</span>${hoofd.tel?`<span class="kt-tel">${hoofd.tel}</span>`:''}${hoofd.doel?`<button type="button" class="kt-wijs groot" data-doel="${esc(hoofd.doel)}" aria-label="Laat zien waar">➜</button>`:''}`:`<span class="kt-ico">✨</span><span class="kt-txt">${esc(wachtTekst(groei))}</span>`}</div>
 ${open&&rest_.length?`<ul class="kt-lijst">${rest_.map(rij).join('')}</ul>`:''}`;
 el.querySelector('.kt-kop').onclick=()=>{open=!open;teken(true)};
 el.querySelector('.kt-hoofd').onclick=e=>{if(e.target.closest('.kt-wijs'))return;if(rest_.length){open=!open;teken(true)}else if(hoofd&&hoofd.doel)wijs(hoofd.doel)};
 el.querySelectorAll('.kt-wijs').forEach(b=>b.onclick=e=>{e.stopPropagation();wijs(b.dataset.doel)});
 if(hoofd&&hoofd.doel&&!wijs.gedaan){wijs.gedaan=1;setTimeout(()=>wijs(hoofd.doel,1),900)}}
function wijs(sel,zacht){const d=document.querySelector(sel);if(!d)return;try{d.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',inline:'center',block:'nearest'})}catch(e){}
 document.querySelectorAll('.kt-gloed').forEach(x=>x.classList.remove('kt-gloed'));d.classList.add('kt-gloed');clearTimeout(wijs.t);wijs.t=setTimeout(()=>d.classList.remove('kt-gloed'),zacht?3500:5000);
 if(!zacht){if(open){open=false;teken(true)}try{fx.speel('klik')}catch(e){}}}
window.zwKasTaken=()=>taken();
const _mk=V.mijnkas;V.mijnkas=(...a)=>{const r=_mk(...a);try{sleutel='';teken(true)}catch(e){console.warn(e)}return r};
const _ga=ga;ga=function(s,...a){if(s==='mijnkas')wijs.gedaan=0;return _ga(s,...a)};
setInterval(()=>{try{if(document.body.dataset.view==='mijnkas'&&!document.querySelector('.modal'))teken()}catch(e){}},2000);
})();
