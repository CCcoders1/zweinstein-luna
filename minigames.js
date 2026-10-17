'use strict';
/* Minigames: nieuwe Kruidenkunde-memory (robuust op telefoon) + gezamenlijke HP-stijl voor de andere spellen.
   Beloningen blijven precies zoals ze waren (beloon / eenmalig in de bestaande spellen). */
(function(){
const MGVIEW=['memory','spreuk','snaai','bonen','toverstok','mysterie','lessen','les'];
/* ---------- Kruidenkunde-memory ---------- */
const MEMPL=[['mandragora','Mandragora'],['duivelsstrik','Duivelsstrik'],['affodil','Affodil'],['alsem','Alsem'],['varkensgras','Varkensgras'],['wolfsmelk','Wolfsmelk'],['sodejus','Sodejusplant'],['tentacula','Tentacula']];
const RMG=matchMedia('(prefers-reduced-motion: reduce)').matches;
V.memory=()=>{const kaarten=[...MEMPL,...MEMPL].map(p=>({z:p[0],n:p[1]})).sort(()=>Math.random()-.5);let open=[],klaar=0,zetten=0,lock=false,eind=false;
 app(lijst(`<div class="mgkop"><img class="mgkopimg" src="img/kas/mandragora-3.webp" alt=""><div><h2 class="mgtitel">Kruidenkunde-memory</h2><p class="mguitleg">Tik twee kaarten om. Zoek de twee dezelfde planten.</p></div></div>
 <div class="mgtel"><span>Zetten <b id="zt">0</b></span><span>Paren <b id="pr">0</b>/8</span></div>
 <div class="mem2">${kaarten.map((k,j)=>`<button type="button" class="mk2" data-j="${j}" aria-label="Kaart ${j+1}"><span class="mk2-in"><span class="mk2-achter"><img src="img/ui/nav-hal-96.webp" alt=""></span><span class="mk2-voor"><img src="img/kas/${k.z}-3.webp" alt=""><b>${k.n}</b></span></span></button>`).join('')}</div><div id="mr"></div>`)+tilly('Weetje: het gekrijs van een volgroeide Mandragora is gevaarlijk; daarom dragen leerlingen oorwarmers bij het verpotten. Duivelsstrik laat los in licht en warmte.'));
 const grid=document.querySelector('.mem2');
 const draai=e=>{const c=e.target.closest('.mk2');if(!c||lock||eind||c.classList.contains('om')||c.classList.contains('klaar'))return;e.preventDefault();
  c.classList.add('om');try{fx.speel('klik')}catch(x){}open.push(c);
  if(open.length<2)return;zetten++;$('#zt').textContent=zetten;const[a,b]=open;open=[];
  if(kaarten[a.dataset.j].z===kaarten[b.dataset.j].z){klaar++;$('#pr').textContent=klaar;setTimeout(()=>{[a,b].forEach(x=>{x.classList.add('klaar');const r=x.getBoundingClientRect();try{vonk(r.left+r.width/2,r.top+r.height/2,RMG?4:12)}catch(y){}});try{fx.speel('munt')}catch(y){}},420);
   if(klaar===8){eind=true;setTimeout(()=>{const t=beloon('memory',zetten<=14?40:25,25,'Alle planten gevonden in '+zetten+' zetten!');$('#mr').innerHTML=`<div class="mgeind"><h3>Alle paren gevonden!</h3><p>${zetten} zetten${zetten<=14?' · knap gedaan':''}</p>${t}<div class="mgknoppen"><button class="knop volgende" id="mnog">Nog een keer</button><button class="knop" id="mhal">Naar De Hal</button></div></div>`;$('#mnog').onclick=()=>V.memory();$('#mhal').onclick=()=>ga('home');$('#mr').scrollIntoView({behavior:RMG?'auto':'smooth',block:'center'})},1100)}}
  else{lock=true;setTimeout(()=>{a.classList.remove('om');b.classList.remove('om');lock=false},1000)}};
 grid.addEventListener('pointerdown',draai);grid.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')draai(e)})};
V._memSolve=()=>{};
/* ---------- andere spellen: perkament-kader + nette kop ---------- */
const KOP={snaai:['img/stukken/snaai-128.webp','Snaai vangen','Tik op Start en tik de Gouden Snaai zo vaak als je kunt in 20 seconden.'],
 bonen:['img/smekkies/boon-oranje-128.webp','Smakkerbonen','Kies een boon uit het zakje. Lekker of vies? Je mag er drie per dag proeven.'],
 toverstok:['img/stukken/toverstaf-128.webp','Spreuken tekenen','Teken de beweging met je vinger in het vak.']};
function kader(v){const app=$('#app');if(!app||app.querySelector('.mgkader'))return;const k=KOP[v];if(!k)return;
 const h=app.querySelector('h1');const d=document.createElement('div');d.className='perkament lijst mgkader';while(app.firstChild)d.appendChild(app.firstChild);app.appendChild(d);
 if(h){const kop=document.createElement('div');kop.className='mgkop';kop.innerHTML=`<img class="mgkopimg" src="${k[0]}" alt=""><div><h2 class="mgtitel">${k[1]}</h2><p class="mguitleg">${k[2]}</p></div>`;h.replaceWith(kop)}
 if(v==='snaai'){const sc=$('#sc');const p=sc&&sc.closest('p');if(p){const d2=document.createElement('div');d2.className='mgtel';d2.innerHTML='<span>Gevangen <b id="sc">0</b></span><span>Tijd <b id="tl">20</b> s</span>';p.replaceWith(d2)}const s=$('#snaai');if(s)s.innerHTML='<img src="img/stukken/snaai-128.webp" alt="Gouden Snaai">';const g=$('#go');if(g)g.classList.add('volgende')}}
const _ga=ga;ga=function(s,...a){const r=_ga(s,...a);try{if(KOP[s])kader(s)}catch(e){console.warn(e)}return r};
const _bon=V.bonen;V.bonen=(...a)=>{const r=_bon(...a);try{kader('bonen')}catch(e){}return r};
})();
