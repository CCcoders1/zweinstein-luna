'use strict';
/* De Groene Alruin: kruidenwinkel op de Wegisweg. Verkoopt de zaden, mest, superplantzaden en ingrediënten die al in de kas en het receptenboek bestaan. */
(function(){
const ZEG=['Welkom in De Groene Alruin! Ik ben Mevrouw Varenkamp. Professor Stronk was vroeger mijn lerares.','Valeriaan, alsem en affodil: daar maak je Lichtbrouwsel van. Zo staat het in je receptenboek.','Mandragora’s eerst laten groeien, liefje. En altijd je oorwarmers op.','Drakenmest ruikt niet lekker, maar je plantjes groeien twee keer zo snel.','Duivelsstrik? Rustig blijven. Hij houdt niet van licht, en ook niet van paniek.','Grijze zaadjes willen een grotere pot. Ze worden een beetje… ruim.','Superplantzaadjes komen uit verre kassen. Ze geven boosters in plaats van kruiden.'];
const lvl=()=>S.m3lvl|0;
function aanbod(){const L=[];
 Object.entries(ZADEN).filter(([z])=>!(window.SUPERPLANTEN&&SUPERPLANTEN[z])).forEach(([z,d])=>L.push({id:'z-'+z,groep:'Zaadjes',naam:d[0]+'-zaadje',prijs:d[3],ico:plantSVG(4,d[4],z),tekst:'Groeit in '+tijd(d[2]*6e4)+', levert '+buitNaam(d[1])+'.',slot:kruidSlot(z)?'Hiervoor heb je eerst een grotere pot nodig.':'',koop:()=>{S.zaden[z]=(S.zaden[z]||0)+1},heb:()=>S.zaden[z]|0}));
 L.push({id:'mest',groep:'Zaadjes',naam:'Drakenmest',prijs:20,ico:`<div class="mestico">${icoon('vuur')}</div>`,tekst:'Halveert de groeitijd van één plant.',koop:()=>{S.mest=(S.mest|0)+1},heb:()=>S.mest|0});
 Object.entries(SUPERPLANTEN).forEach(([z,p])=>L.push({id:'s-'+z,groep:'Superplantzaden',naam:p.naam,prijs:p.prijs,ico:`<img src="img/kas/${p.beeld}-4.webp" alt="" style="${p.filter?'filter:'+p.filter:''}">`,tekst:'Oogst: '+p.oogstTekst+'.',slot:ALLEEN_CADEAU,koop:()=>{},heb:()=>S.zaden[z]|0}));
 const ingr=new Set();(typeof MIXEN!="undefined"?MIXEN:[]).forEach(m=>m.nodig.forEach(([i])=>{if(ZADEN[i])ingr.add(i)}));
 ingr.forEach(i=>{const d=ZADEN[i];L.push({id:'i-'+i,groep:'Gedroogde kruiden (voor je receptenboek)',naam:'Gedroogde '+d[0].toLowerCase(),prijs:d[3]*3,ico:plantSVG(4,d[4],i),tekst:'Telt als één oogst voor je recepten.',koop:()=>{S.oogst[i]=(S.oogst[i]|0)+1},heb:()=>S.oogst[i]|0})});
 return L}
function vlieg(van){const doel=document.getElementById('krmand');if(!van||!doel)return;const a=van.getBoundingClientRect(),b=doel.getBoundingClientRect();const c=van.cloneNode(true);c.className='krvlieg';c.style.cssText=`left:${a.left}px;top:${a.top}px;width:${a.width}px;height:${a.height}px`;document.body.appendChild(c);
 requestAnimationFrame(()=>{c.style.transform=`translate(${b.left+b.width/2-a.left-a.width/2}px,${b.top+b.height/2-a.top-a.height/2}px) scale(.3)`;c.style.opacity='.2'});setTimeout(()=>{c.remove();doel.classList.remove('hup');void doel.offsetWidth;doel.classList.add('hup')},800)}
function zeg(t){const e=document.getElementById('krpraat');if(e)e.innerHTML='<b>Mevrouw Varenkamp:</b> '+(t||ZEG[1+Math.random()*(ZEG.length-1)|0])}
function teken(){const box=document.getElementById('kritems');if(!box)return;const L=aanbod();let g='';
 box.innerHTML=L.map(it=>{const kop=it.groep!=g?`<h3 class="krgroep">${it.groep}</h3>`:'';g=it.groep;return kop+`<div class="kritem ${it.slot?'slot':''}"><div class="krico">${it.ico}</div><div class="krtxt"><b>${it.naam}</b><small>${it.slot||it.tekst}</small><small class="krheb">In voorraad: ${it.heb()}</small></div><button class="knop klein krkoop" data-id="${it.id}" ${it.slot?'disabled':''}><img src="img/smekkies/boon-oranje-64.webp" alt="">${it.prijs}</button></div>`}).join('');
 const sm=document.getElementById('krsmek');if(sm)sm.textContent=(S.galjoenen|0).toLocaleString('nl-NL');
 box.querySelectorAll('.krkoop').forEach(b=>b.onclick=()=>{const it=L.find(x=>x.id==b.dataset.id);if(!it||it.slot)return;if(S.galjoenen<it.prijs){zeg('Oei, daar heb je nog niet genoeg Smekkies voor. Speel nog een level, dan leg ik hem apart.');try{fx.speel('fout')}catch(e){}return}
  S.galjoenen-=it.prijs;it.koop();bewaar();try{stats()}catch(e){}try{fx.speel('munt')}catch(e){}vlieg(b.closest('.kritem').querySelector('.krico'));zeg('Alsjeblieft! '+it.naam+' ligt in je voorraadmand.');setTimeout(teken,820)})}
V.kruidwinkel=()=>{VIEWDECOR.kruidwinkel='kas';const kl=innerWidth<=700?'winkel-klein':'winkel';
 app(`<div class="krwinkel"><div class="krscene" style="background-image:url('img/kruid/${kl}.webp')">
  <div class="krgloed l1"></div><div class="krgloed l2"></div>
  <div class="krbord b1"><small>Zorg goed voor kleine kiempjes,</small><small>dan worden ze groot</small></div>
  <div class="krbord b2"><small>Nieuw binnen:</small><b>Alruin · Valeriaan · Affodil</b><small>vers uit de kassen</small></div>
  <div class="kruithang"><b>De Groene Alruin</b><small>Kruiden &amp; zaden · Wegisweg</small></div>
  <div class="krblad">${Array.from({length:7},(_,i)=>`<i style="left:${6+i*13}%;animation-delay:${-i*2.3}s;animation-duration:${11+i%3*3}s"></i>`).join('')}</div>
  <div class="krmand" id="krmand" title="Je voorraad">${icoon('blad')}<span>Voorraad</span></div>
  <div class="fgpraat krpraat" id="krpraat"></div></div>
 <h2 class="fgtitel">De Groene Alruin</h2><p class="klein fgsub"><img src="img/smekkies/boon-oranje-64.webp" alt="" style="width:18px;vertical-align:middle"> <b id="krsmek"></b> Smekkies</p>
 <div id="kritems" class="fgitems"></div><button class="knop" onclick="ga('mijnkas')">Naar mijn kas</button> <button class="knop" onclick="ga('meer')">Terug</button></div>`);
 zeg(ZEG[0]);teken();document.querySelector('.krscene').onclick=()=>zeg()};
const _meer=V.meer;V.meer=(...a)=>{const r=_meer(...a);try{const fg=document.getElementById('meerfg');if(fg&&!document.getElementById('meerkr')){fg.insertAdjacentHTML('afterend',`<button class="knop volgende meerkr" id="meerkr" onclick="ga('kruidwinkel')"><img src="img/kruid/medaillon-klein.webp" alt=""> De Groene Alruin (kruidenwinkel)</button><button class="knop volgende meerkr" id="meermt" onclick="ga('moestuin')"><span class="mtico">🎃</span> Hagrids moestuin</button>`)}}catch(e){}return r};
})();
