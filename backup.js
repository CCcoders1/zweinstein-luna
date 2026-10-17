/* ====== Back-up & herstel (bestand, delen, herstelcode) ====== */
(function(){const VERSIE=3;
 const pak=()=>({app:'zweinstein-luna',versie:VERSIE,gemaakt:new Date().toISOString(),data:JSON.parse(localStorage.getItem(SK)||'{}')});
 const migreer=o=>{if(!o||typeof o!='object')throw 'Dit is geen geldig back-upbestand.';
  if(!o.app&&o.naam!==undefined)o={app:'zweinstein-luna',versie:1,data:o};   // kale save
  if(o.app!='zweinstein-luna')throw 'Dit bestand hoort niet bij deze app.';
  if(!o.data||typeof o.data!='object'||Array.isArray(o.data))throw 'De back-up bevat geen voortgang.';
  if(o.versie>VERSIE)throw 'Deze back-up komt uit een nieuwere versie van de app. Werk de app eerst bij.';
  const d=Object.assign({},STD,o.data);
  if(o.versie<2){d.galjoenen=+d.galjoenen||0}       // v1: oude munten = Smekkies
  if(o.versie<3){delete d.m3kal;d.kalV4=0}           // v3: vaste levelbalans
  if(typeof d.naam!='string'||typeof d.galjoenen!='number')throw 'De back-up is beschadigd.';
  return d};
 const samenv=d=>`<b>${d.naam||'(geen naam)'}</b> · level ${d.m3lvl||1} · ${d.galjoenen||0} Smekkies · ${d.schilden!=null?d.schilden:(d.sterren||0)} huisschilden`;
 const herstel=d=>{const o=document.createElement('div');o.className='modal';o.innerHTML=`<div class="modalin rococo bkbev"><h2>Voortgang overschrijven?</h2><p>Nu: ${samenv(S)}</p><p>Back-up: ${samenv(d)}</p><p class="klein">De huidige voortgang wordt eerst nog als reservekopie bewaard.</p><div class="bkrij"><button class="knop" id="bkja">Ja, herstel</button><button class="knop klein" id="bknee">Annuleer</button></div></div>`;document.body.appendChild(o);
  o.querySelector('#bknee').onclick=()=>o.remove();o.querySelector('#bkja').onclick=()=>{zwReserve.maak(true);localStorage.setItem(SK,JSON.stringify(d));sessionStorage.zw_hersteld=1;location.reload()}};
 const b64=u=>{let s='';u.forEach(x=>s+=String.fromCharCode(x));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
 const unb64=s=>{s=s.replace(/\s/g,'').replace(/-/g,'+').replace(/_/g,'/');const b=atob(s);return Uint8Array.from(b,c=>c.charCodeAt(0))};
 const gz=async(txt,mode)=>{const st=new Blob([txt]).stream().pipeThrough(mode?new DecompressionStream('gzip'):new CompressionStream('gzip'));return new Uint8Array(await new Response(st).arrayBuffer())};
 window.zwCode=async()=>{const d=JSON.stringify(pak());return 'ZW3-'+b64(await gz(d,0))};
 window.zwUitCode=async c=>{c=c.trim();if(!/^ZW\d-/.test(c))throw 'Dit is geen herstelcode (die begint met ZW3-).';const u=await gz(unb64(c.slice(4)),1);return migreer(JSON.parse(new TextDecoder().decode(u)))};
 const naamBestand=()=>`zweinstein-backup-${new Date().toISOString().slice(0,10)}.json`;
 const gemaakt=()=>{S.laatsteBackup=Date.now();bewaar()};
 V.backup=()=>{const L=zwReserve.lijst();const p=localStorage.getItem('zw_persist');const lb=S.laatsteBackup?new Date(S.laatsteBackup).toLocaleDateString('nl-NL',{day:'numeric',month:'long'}):'nog nooit';
  app(`<div class="bkscherm"><h2>Voortgang bewaren</h2><p class="bkintro">Bewaar Luna’s avonturen veilig, zodat er nooit iets verloren gaat. Laatste back-up: <b>${lb}</b>.</p>
  <div class="bkstatus ${p=='1'?'ok':''}">${p=='1'?'✓ Deze telefoon beschermt de opslag van de app.':'De opslag is nog niet beschermd. Dat gebeurt meestal vanzelf als de app op het startscherm staat.'}</div>
  <section class="kaart sierlijst"><h3>Back-upbestand</h3><p class="klein">Een klein bestand met alle voortgang. Bewaar het bijvoorbeeld in Google Drive of stuur het naar jezelf.</p><div class="bkrij"><button class="knop" id="bkbestand">Bewaar / deel bestand</button><button class="knop klein" id="bkkies">Herstel uit bestand</button><input type="file" id="bkin" accept="application/json,.json" hidden></div></section>
  <section class="kaart sierlijst"><h3>Herstelcode</h3><p class="klein">Een code om te kopiëren en ergens te plakken (notitie, e-mail).</p><div class="bkrij"><button class="knop" id="bkcode">Maak herstelcode</button><button class="knop klein" id="bkplak">Code invoeren</button></div><textarea id="bktxt" class="bktxt" rows="4" placeholder="ZW3-…" hidden></textarea><button class="knop klein" id="bkgo" hidden>Herstel met deze code</button></section>
  <section class="kaart sierlijst"><h3>Automatische reservekopieën</h3><p class="klein">De app bewaart zelf de laatste drie standen op deze telefoon.</p>${L.length?L.map((r,i)=>{let d;try{d=JSON.parse(r.d)}catch(e){d={}}return `<div class="bkres"><span>${new Date(r.t).toLocaleString('nl-NL',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}<small>level ${d.m3lvl||1} · ${d.galjoenen||0} Smekkies</small></span><button class="knop klein" data-r="${i}">Terugzetten</button></div>`}).join(''):'<p class="klein">Nog geen reservekopie. Die wordt over een paar minuten gemaakt.</p>'}</section></div>`);
  $('#bkbestand').onclick=async()=>{const txt=JSON.stringify(pak(),null,1);const f=new File([txt],naamBestand(),{type:'application/json'});
   try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'Zweinstein back-up'});gemaakt();toast('Back-up gedeeld!');return}}catch(e){if(e&&e.name=='AbortError')return}
   const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=f.name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);gemaakt();toast('Back-up opgeslagen in Downloads')};
  $('#bkkies').onclick=()=>$('#bkin').click();
  $('#bkin').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{herstel(migreer(JSON.parse(await f.text())))}catch(x){toast(typeof x=='string'?x:'Dit bestand kan ik niet lezen.')}e.target.value=''};
  $('#bkcode').onclick=async()=>{const c=await zwCode();const t=$('#bktxt');t.hidden=false;t.value=c;t.select();try{await navigator.clipboard.writeText(c);toast('Herstelcode gekopieerd ('+c.length+' tekens)')}catch(e){toast('Selecteer en kopieer de code')}gemaakt()};
  $('#bkplak').onclick=()=>{const t=$('#bktxt');t.hidden=false;t.value='';t.focus();$('#bkgo').hidden=false};
  $('#bkgo').onclick=async()=>{try{herstel(await zwUitCode($('#bktxt').value))}catch(x){toast(typeof x=='string'?x:'Deze code klopt niet helemaal.')}};
  document.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const r=zwReserve.lijst()[+b.dataset.r];try{herstel(migreer(JSON.parse(r.d)))}catch(x){toast('Deze reservekopie is beschadigd.')}})};
 window.zwMigreer=migreer;
 /* knop in Meer en in het makerscherm */
 const _meer=V.meer;V.meer=(...a)=>{const r=_meer(...a);const h=document.querySelector('#app h1,#app h2');if(h&&!document.getElementById('meerbk'))h.parentElement.insertAdjacentHTML('beforeend',`<button class="knop klein meerbk" id="meerbk" onclick="ga('backup')">🛡️ Voortgang bewaren</button>`);return r};
 const _mk=V.maker;V.maker=(...a)=>{_mk(...a);$('#app').insertAdjacentHTML('beforeend',`<section class="kaart sierlijst"><h3>Back-up</h3><button class="knop" onclick="ga('backup')">Back-up & herstel</button></section>`)};
 /* meldingen + wekelijkse herinnering via Tilly */
 setTimeout(()=>{if(window._herstelMelding)toast(window._herstelMelding);if(sessionStorage.zw_hersteld){delete sessionStorage.zw_hersteld;toast('Voortgang hersteld!')}if(sessionStorage.zw_herstelIdb){delete sessionStorage.zw_herstelIdb;toast('Voortgang teruggezet uit de reservekopie.')}},2500);
 setTimeout(()=>{const w=7*864e5;if(!S.naam||document.body.dataset.view!='home')return;if(Date.now()-(S.laatsteBackup||S.bkStart||(S.bkStart=Date.now(),bewaar(),Date.now()))<w)return;if(Date.now()-(S.bkHerinnerd||0)<w)return;S.bkHerinnerd=Date.now();bewaar();try{gids('Psst, Luna… zullen we je voortgang even veilig bewaren? Dat kan bij <b>Meer → Voortgang bewaren</b>.',{})}catch(e){}},25000);
})();
