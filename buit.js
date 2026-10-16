'use strict';
/* ====== Buit, verzamelboek en voorleesstem ====== */
var ITEMS={
 // ingrediënten (canon)
 affodil:['i','Poeder van affodilwortel','G','blad','Fijngemalen wortel van de affodil. Met een aftreksel van alsem vormt het de basis van het Vocht van de Levende Dood.'],
 alsem:['i','Alsemaftreksel','G','fles','Een bittere, groene vloeistof getrokken uit alsem. Professor Sneep noemde het al in zijn allereerste les.'],
 valeriaan:['i','Valeriaanwortels','G','blad','Kalmerende wortels die slaap brengen. Onmisbaar in slaapdranken.'],
 sodejus:['i','Sodejusboon','Z','boon','Een taaie boon. Wie haar plet met de platte kant van het mes, krijgt veel meer sap dan wie haar snijdt.'],
 gaasvlieg:['i','Gaasvliegjes','G','vlieg','Fijne, doorschijnende vliegjes. In de Wisseldrank moeten ze eenentwintig dagen trekken.'],
 bloedzuiger:['i','Bloedzuigers','G','fles','Glibberige bloedzuigers, in stukjes gesneden voor de Wisseldrank.'],
 wolfsmelk:['i','Wolfsmelk','G','blad','Bij volle maan geplukte wolfsmelk, een van de kruiden in de Wisseldrank.'],
 varkensgras:['i','Varkensgras','G','blad','Een taai kruid dat in de Wisseldrank gaat. Het groeit gewoon langs de paden.'],
 tweehoorn:['i','Gemalen hoorn van een Tweehoorn','Z','hoorn','Zeldzaam en kostbaar poeder. Hermelien moest het uit de voorraadkast van Sneep halen.'],
 boomslang:['i','Geraspte boomslanghuid','L','slang','De huid van een boomslang, zeer zeldzaam. Ook die kwam uit de privévoorraad van professor Sneep.'],
 bezoar:['i','Bezoar','Z','steen','Een steen uit de maag van een geit. Hij beschermt tegen de meeste vergiften.'],
 mandragora:['i','Mandragorawortel','L','blad','De wortel van een volgroeide Mandragora. Het sap herstelt wie versteend is.'],
 kieuwwier:['i','Kieuwwier','Z','blad','Wie het eet, krijgt kieuwen en zwemvliezen – voor ongeveer een uur.'],
 tentacula:['i','Tentaculablad','Z','blad','Een blad van de giftige tentacula. Voorzichtig aanraken.'],
 duivelsstrik:['i','Duivelsstrikscheut','Z','blad','Een scheut duivelsstrik. Blijf kalm, dan laat hij los.'],
 feniksveer:['i','Feniksveer','L','veer','Een gloeiende veer van een feniks. Fenikstranen genezen, en een veer kan de kern van een toverstok zijn.'],
 // verzamelvoorwerpen
 smakker:['v','Bertie Botts Smakkerbonen','G','boon','Echt élke smaak: van aardbei tot oorsmeer. Perkamentus at eens een met de smaak van oorsmeer.'],
 uilenveer:['v','Sneeuwwitte uilenveer','G','veer','Een zachte witte veer, achtergelaten door een postuil in de Uilenvleugel.'],
 hulst:['v','Stukje hulsthout','Z','stok','Hulst wordt gebruikt voor toverstokken. De toverstok van Harry is van hulst, achtentwintig centimeter.'],
 snaairep:['v','Gouden Snaai-replica','L','snaai','Een glanzende replica van de Gouden Snaai, met trillende zilveren vleugeltjes.'],
 perkament:['v','Stuk oud perkament','G','rol','Een verkreukeld stuk perkament. Misschien staat er iets op als je de juiste woorden spreekt…'],
 ganzenveer:['v','Ganzenveer','G','veer','Een ganzenveer om mee te schrijven, met een klein inktpotje.'],
 knikker:['v','Fluimstenen-knikker','Z','steen','Een knikker uit het Fluimsteenspel. Verliezers krijgen een straal stinkend vocht in hun gezicht.'],
 chocokikker:['v','Chocokikker-doosje','G','kikker','Een leeg doosje. De kikker is weggesprongen, maar de doos ruikt nog naar chocolade.'],
 sikkel:['v','Zilveren Sikkel','G','munt','Zeventien Sikkels gaan er in één Galjoen.'],
 tijdverdrijver:['v','Mini-zandloper','L','kalender','Een piepklein zandlopertje, net zoals de Tijdverdrijver die Hermelien in haar derde jaar droeg.']};
const LOOT={drank:['affodil','alsem','valeriaan','sodejus','gaasvlieg','bloedzuiger','wolfsmelk','varkensgras','tweehoorn','boomslang','bezoar'],memory:['mandragora','kieuwwier','wolfsmelk','varkensgras','valeriaan','affodil','alsem'],spreuk:['hulst','ganzenveer','perkament','uilenveer','feniksveer'],mysterie:['perkament','ganzenveer','uilenveer','tijdverdrijver','sikkel'],les:['ganzenveer','perkament','bezoar','hulst','sikkel','affodil','alsem'],dag:['uilenveer','sikkel','smakker','chocokikker'],mini:['smakker','snaairep','knikker','sikkel','chocokikker'],verhaal:['perkament','uilenveer']};
const KANS={G:1,Z:.32,L:.09};const RNAAM={G:'Gewoon',Z:'Zeldzaam',L:'Legendarisch'};
def('tas',{});def('nieuwBuit',0);
function trek(pool){for(let t=0;t<8;t++){const id=pool[Math.random()*pool.length|0];if(Math.random()<KANS[ITEMS[id][2]])return id}return pool[0]}
function buitVoor(id){const k=id.startsWith('drank')?'drank':id.startsWith('memory')?'memory':id.startsWith('spreuk')?'spreuk':id.startsWith('mysterie')?'mysterie':id.startsWith('dag')?'dag':id.startsWith('verhaal')?'verhaal':/-(1|2|slijm)$|puist/.test(id)?'les':'mini';
 const n=1+(Math.random()<.35?1:0);const items=[];for(let i=0;i<n;i++){const it=trek(LOOT[k]);S.tas[it]=(S.tas[it]||0)+1;items.push(it)}
 if(Math.random()<.12){const kr=trekKaart();S.kaarten[kr[0]]=(S.kaarten[kr[0]]||0)+1;items.push('kaart:'+kr[0])}
 S.nieuwBuit+=items.length;bewaar();setTimeout(()=>items.forEach((it,i)=>setTimeout(()=>buitVlucht(it),i*350)),900);return items}
/* tasknop */
document.body.insertAdjacentHTML('beforeend',`<button id="tasknop" aria-label="Verzamelboek"><svg class="icn" viewBox="0 0 24 24"><path d="M5 9h14l-1 11H6zM9 9V7a3 3 0 016 0v2M5 9c0-2 2-3 3-3M19 9c0-2-2-3-3-3"/></svg><span id="tasn"></span></button>`);
$('#tasknop').onclick=()=>ga('boek');
function tasTeller(){const n=S.nieuwBuit;$('#tasn').textContent=n?n:'';$('#tasknop').classList.toggle('nieuw',n>0)}
IP.vlieg='M12 8a2 2 0 110 4 2 2 0 010-4zM12 12v8M10 9C6 5 3 6 3 9s4 3 7 1M14 9c4-4 7-3 7 0s-4 3-7 1';IP.fles='M10 3h4M10 3v5l-4 7a4 4 0 004 6h4a4 4 0 004-6l-4-7V3M7 15h10';IP.hoorn='M5 20c2-8 6-14 15-17-3 5-5 10-6 17z';IP.slang='M4 18c4 0 4-4 8-4s4 4 8 4M4 12c4 0 4-4 8-4s4 4 8 4M17 6l3-2';IP.steen='M6 10l4-5h5l4 5-2 8H8z';IP.veer='M5 20L19 6M19 6c-6 0-11 3-12 10 5-1 10-4 12-10zM9 15h4';
function buitIcoon(it){if(it.startsWith('kaart:'))return icoon('kikker');return icoon(ITEMS[it][3])}
function buitVlucht(it){const naam=it.startsWith('kaart:')?it.slice(6):ITEMS[it][1];const zr=it.startsWith('kaart:')?'Z':ITEMS[it][2];
 toast((it.startsWith('kaart:')?'Tovenaarskaart: ':'Gevonden: ')+naam+(zr!='G'?' ('+RNAAM[zr]+')':''));try{fx.speel(zr=='L'?'fanfare':'munt')}catch(e){}navigator.vibrate&&navigator.vibrate(zr=='L'?[40,30,120]:25);
 if(RMP){tasTeller();return}const e=document.createElement('div');e.className='buitvlieg r'+zr;e.innerHTML=buitIcoon(it);document.body.appendChild(e);const d=$('#tasknop').getBoundingClientRect();
 e.animate([{transform:`translate(${innerWidth/2}px,${innerHeight/2}px) scale(.2)`,opacity:0},{transform:`translate(${innerWidth/2}px,${innerHeight/2-80}px) scale(1.8)`,opacity:1,offset:.3},{transform:`translate(${innerWidth/2}px,${innerHeight/2-80}px) scale(1.6) rotate(10deg)`,offset:.5},{transform:`translate(${d.left+d.width/2}px,${d.top+d.height/2}px) scale(.4)`,opacity:.8}],{duration:1500,easing:'cubic-bezier(.5,0,.3,1)'}).onfinish=()=>{e.remove();tasTeller();const t=$('#tasknop');t.classList.remove('pof');void t.offsetWidth;t.classList.add('pof')}}
const _bel3=beloon;beloon=function(id,...a){const r=_bel3(id,...a);try{buitVoor(id)}catch(e){}return r};
/* ingrediënten echt gebruiken in de ketel */
const INGR_ID={'Gaasvliegjes':'gaasvlieg','Bloedzuigers':'bloedzuiger','Wolfsmelk':'wolfsmelk','Varkensgras':'varkensgras','Gemalen hoorn':'tweehoorn','Geraspte huid':'boomslang','Alsemaftreksel':'alsem','Poeder van affodilwortel':'affodil','Valeriaanwortels':'valeriaan','Sodejusboon':'sodejus'};
const idVan=txt=>{for(const k in INGR_ID)if(txt.includes(k))return INGR_ID[k];return null};
function ketelVoorraad(){document.querySelectorAll('.ingr:not([data-vr])').forEach(b=>{b.dataset.vr=1;const id=idVan(b.textContent);if(id){const n=S.tas[id]||0;b.insertAdjacentHTML('beforeend',`<span class="vr ${n?'heb':''}">${n}</span>`)}})}
const _bel4=beloon;beloon=function(id,pt,gal,tekst){if(id=='drank'&&$('.ketelfoto')){const R=RECEPTEN.find(r=>$('#app h2')&&$('#app h2').textContent.includes(r.n));if(R){const ids=R.r.map(idVan).filter(Boolean);const alles=ids.every(i=>S.tas[i]>0);if(alles){ids.forEach(i=>S.tas[i]--);gal=Math.round(gal*1.5);tekst=(tekst||'')+' Je gebruikte je eigen ingrediënten uit je verzamelboek: anderhalf keer zoveel Smekkies!'}}}return _bel4(id,pt,gal,tekst)};
/* ---------- voorleesstem ---------- */
let stemAudio=null;
function voorlezen(id,tekst){stopStem();try{fx.duik(true)}catch(e){}
 const a=new Audio('audio/'+id+'.mp3');stemAudio=a;a.volume=+(localStorage.getItem('zw_stem')??1);a.onended=()=>{try{fx.duik(false)}catch(e){}};
 a.play().catch(()=>{stemAudio=null;if(!('speechSynthesis' in window)){fx.duik(false);return}const u=new SpeechSynthesisUtterance(tekst);u.lang='nl-NL';u.volume=+(localStorage.getItem('zw_stem')??1);u.rate=.85;u.pitch=.7;const vs=speechSynthesis.getVoices().filter(v=>/^nl/i.test(v.lang));u.voice=vs.find(v=>/male|man|frank|willem|xander|maarten|daan/i.test(v.name))||vs[0]||null;u.onend=()=>{try{fx.duik(false)}catch(e){}};speechSynthesis.speak(u)})}
function stopStem(){if(stemAudio){stemAudio.pause();stemAudio=null}try{speechSynthesis.cancel()}catch(e){}}
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
/* ---------- verzamelboek ---------- */
function bladGeluid(){try{const{ac,master}=fx.ctx();const n=ac.sampleRate*.35,b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(Math.sin(Math.PI*i/n),.6)*(.4+.6*Math.random());const s=ac.createBufferSource();s.buffer=b;const f=ac.createBiquadFilter();f.type='highpass';f.frequency.value=1800;const g=ac.createGain();g.gain.value=.12;s.connect(f);f.connect(g);g.connect(master);s.start()}catch(e){}}
let boekTab='kaarten';
V.boek=(tab=boekTab)=>{boekTab=tab;S.nieuwBuit=0;bewaar();tasTeller();
 const lijst_=tab=='kaarten'?KAARTEN.map(k=>({id:'kaart-'+slug(k[0]),n:k[0],r:k[1],t:k[2],heb:S.kaarten[k[0]]||0,ic:'kikker',img:k[3],se:k[4]})):Object.entries(ITEMS).filter(([,v])=>v[0]==(tab=='ingr'?'i':'v')).map(([id,v])=>({id:'item-'+id,n:v[1],r:v[2],t:v[4],heb:S.tas[id]||0,ic:v[3]}));
 const heb=lijst_.filter(x=>x.heb).length;
 app(`<div class="boek"><div class="boekrug"></div><div class="tabs">${[['kaarten','Kaarten'],['ingr','Ingrediënten'],['verz','Verzamelingen']].map(([k,n])=>`<button class="tab ${k==tab?'actief':''}" data-tab="${k}">${n}</button>`).join('')}</div>
 <div class="blad ${RMP?'':'omslaan'}"><h2>${tab=='kaarten'?'Tovenaarskaarten':tab=='ingr'?'Ingrediënten':'Verzamelingen'}</h2><p class="telling">${heb} van ${lijst_.length} gevonden</p>
 <div class="vakjes">${lijst_.map((x,i)=>`${x.se&&(i==0||lijst_[i-1].se!=x.se)?`<h4 class="kserie">${x.se}</h4>`:''}<button class="vakje ${x.heb?'heb r'+x.r:'leeg'}" data-id="${x.id}">${x.heb&&x.img?`<img class="kimg" src="${x.img}" alt="">`:icoon(x.ic)}<b>${x.heb?x.n:'?'}</b>${x.heb>1?`<small>×${x.heb}</small>`:''}</button>`).join('')}</div><div id="vdetail"></div></div></div>`);
 document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{bladGeluid();V.boek(b.dataset.tab)});
 document.querySelectorAll('.vakje').forEach(b=>b.onclick=()=>{const x=lijst_.find(y=>y.id==b.dataset.id);if(!x.heb){$('#vdetail').innerHTML=`<div class="detail"><p><i>Dit vakje is nog leeg. ${tab=='kaarten'?'Kaarten vind je in Chocokikkers en soms als beloning.':tab=='ingr'?'Ingrediënten vind je bij toverdranken, Kruidenkunde en lessen.':'Verzamelvoorwerpen vind je bij raadsels, mini-games en het verhaal.'}</i></p></div>`;return}
  $('#vdetail').innerHTML=`<div class="detail r${x.r}">${x.img?`<img class="kgroot" src="${x.img}" alt="${x.n}">`:`<div class="dico">${icoon(x.ic)}</div>`}<h3>${x.n}</h3><small>${RNAAM[x.r]}</small><p>${x.t}</p><button class="knop klein" id="lees">Voorlezen</button></div>`;$('#lees').onclick=()=>voorlezen(x.id,x.n+'. '+x.t);voorlezen(x.id,x.n+'. '+x.t);$('#vdetail').scrollIntoView({block:'nearest',behavior:'smooth'})})};
/* kaarten openen → ook voorlezen bij tik */
document.addEventListener('click',e=>{const k=e.target.closest('.kkaart');if(k){const n=k.querySelector('h3')?.textContent;const kk=KAARTEN.find(x=>x[0]==n);if(kk)voorlezen('kaart-'+slug(kk[0]),kk[0]+'. '+kk[2])}});
/* integratie met sturing */
VIEWDECOR.boek='bieb';UITLEG.boek=['Je verzamelboek','Alles wat je verdient, komt hierin: tovenaarskaarten, ingrediënten en verzamelvoorwerpen. Tik op een vakje om het te bekijken en te laten voorlezen. Ingrediënten kun je ook echt gebruiken in de ketel.'];HINT.boek='Tip: grijze silhouetten heb je nog niet; ze komen uit spellen, lessen en Chocokikkers.';
const _doelen=doelen;doelen=function(){const d=_doelen();if(S.nieuwBuit>0)d.splice(3,0,['Bekijk je nieuwe buit in je verzamelboek',false,()=>ga('boek'),'boek']);return d};
setInterval(()=>{const o=new MutationObserver(()=>{});},1e9);
new MutationObserver(()=>{clearTimeout(window._bv);window._bv=setTimeout(ketelVoorraad,0)}).observe($('#app'),{childList:true,subtree:true});
tasTeller();

