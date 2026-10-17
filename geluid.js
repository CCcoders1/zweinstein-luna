'use strict';
/* Optioneel geluidspakket (zip met m4a + index.json). Wordt lokaal in IndexedDB bewaard, niet in de backup (te groot). Zonder pakket blijven de gewone geluiden. */
(function(){
const DB='zw_geluid';let ac=null,buf={},lus=null;
const db=()=>new Promise((ok,nee)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('g');r.onsuccess=()=>ok(r.result);r.onerror=()=>nee(r.error)});
const zet=async(k,v)=>{const d=await db();return new Promise(ok=>{const t=d.transaction('g','readwrite');t.objectStore('g').put(v,k);t.oncomplete=ok})};
const alle=async()=>{const d=await db();return new Promise(ok=>{const o={};const c=d.transaction('g').objectStore('g').openCursor();c.onsuccess=()=>{const x=c.result;if(x){o[x.key]=x.value;x.continue()}else ok(o)}})};
const wis=async()=>{const d=await db();return new Promise(ok=>{const t=d.transaction('g','readwrite');t.objectStore('g').clear();t.oncomplete=ok})};
/* kleine zip-lezer: opgeslagen (0) en deflate (8, via DecompressionStream) */
async function unzip(ab){const v=new DataView(ab),u=new Uint8Array(ab);let e=u.length-22;while(e>=0&&v.getUint32(e,true)!==0x06054b50)e--;if(e<0)throw new Error('geen zip');
 const n=v.getUint16(e+10,true);let p=v.getUint32(e+16,true);const out={};
 for(let i=0;i<n;i++){const m=v.getUint16(p+10,true),cs=v.getUint32(p+20,true),nl=v.getUint16(p+28,true),xl=v.getUint16(p+30,true),cl=v.getUint16(p+32,true),lo=v.getUint32(p+42,true);const naam=new TextDecoder().decode(u.subarray(p+46,p+46+nl));p+=46+nl+xl+cl;
  const ln=v.getUint16(lo+26,true),lx=v.getUint16(lo+28,true),st=lo+30+ln+lx,data=u.slice(st,st+cs);
  if(m===0)out[naam]=data;else if(m===8&&window.DecompressionStream){out[naam]=new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer())}}
 return out}
function ctx(){if(!ac)ac=new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();return ac}
async function laadBuffers(){const g=await alle();const idx=g['index.json']?JSON.parse(new TextDecoder().decode(g['index.json'])):null;if(!idx)return 0;window._zwPak=idx;buf={};
 for(const [k,inf] of Object.entries(idx.geluiden)){const f=g[k+'.'+(inf.bestand_ext||'m4a')];if(!f)continue;try{buf[k]=await ctx().decodeAudioData(f.buffer.slice(0))}catch(e){}}return Object.keys(buf).length}
function speelPak(k,vol){const b=buf[k];if(!b||S.geluid===false||S.stil)return false;const c=ctx(),s=c.createBufferSource(),g=c.createGain();g.gain.value=(vol||.7)*(S.fxVol==null?.8:S.fxVol)/.8;s.buffer=b;s.connect(g).connect(c.destination);s.start();return true}
window.pakSpeel=speelPak;
/* fx.speel omleiden als het pakket dit geluid heeft */
let klaar=false;const start=()=>{if(klaar)return;klaar=true;laadBuffers().then(n=>{if(n)pas()}).catch(()=>0)};
const hang=()=>{if(typeof fx==='undefined'||fx._pak)return;const org=fx.speel;fx.speel=n=>{if(speelPak(n))return;if(/^stem-/.test(n))return;const FB={splat:'whoosh',kassa:'munt',kaart:'goed',winst:'fanfare',verlies:'fout',vuurwerk:'tover',combi:'tover',kies:'klik',spreuk:'tover',kist:'klik',kikker:'goed'};if(FB[n])return org(FB[n]);return org(n)};fx._pak=1};
hang();addEventListener('pointerdown',start,{once:true});
/* extra momenten in het spel */
try{const _td=Bord.prototype.telDoel;Bord.prototype.telDoel=function(t){if(!this.sim&&typeof M3!='undefined'&&this===M3.b&&t===this.ksoort&&buf.kist)speelPak('kist',.5);return _td.apply(this,arguments)};
 const _op=Bord.prototype.oplossen;Bord.prototype.oplossen=async function(){if(!this.sim&&typeof M3!='undefined'&&this===M3.b)speelPak('match',.45);return _op.apply(this,arguments)};
 const _w=m3Winst;m3Winst=function(){speelPak('winst');return _w.apply(this,arguments)};const _v=m3Verlies;m3Verlies=function(){speelPak('verlies');return _v.apply(this,arguments)};}catch(e){}
try{const _v=V.moestuin;if(_v)V.moestuin=(...a)=>{const r=_v(...a);setTimeout(()=>speelPak('hagrid',.5),400);return r}}catch(e){}
try{const _v=V.fopshop;if(_v)V.fopshop=(...a)=>{const r=_v(...a);setTimeout(()=>speelPak('vuurwerk',.35),600);return r}}catch(e){}
/* ===== mixlaag: ambiance + muziek tegelijk, balans per scène, zachte crossfades ===== */
if(S.sfeerAan==null)S.sfeerAan=true;if(S.sfeerVol==null)S.sfeerVol=.5;if(S.muziekAan==null)S.muziekAan=true;if(S.muziekVol==null)S.muziekVol=.5;if(S.fxVol==null)S.fxVol=.8;
const SCENE={hal:['amb-hal',.35,'mus-hal',1],kas:['amb-kas',1,'mus-kas',.25],winkel:['amb-winkel',.6,'mus-winkel',.8],moestuin:['amb-buiten',.5,'mus-moestuin',1],
 level:['amb-level',.8,'mus-level',.35],bos:['donker-bos',1,'mus-donker',.3],plaag:['donker-plaag',1,'mus-plaag',.35],kerker:['donker-kerker',1,'mus-kerker',.3]};
const TIJD={gesprek:[.35,'mus-gesprek',1],intro:[.3,'mus-intro',1]};
const KAN={amb:{k:null,n:null,niv:0},mus:{k:null,n:null,niv:0},rz:{k:null,n:null,niv:0}};/* rz = leerlingen-geroezemoes in de Hal */
function doel(kan){return kan!=='mus'?(S.sfeerAan?.4*S.sfeerVol:0):(S.muziekAan?.45*S.muziekVol:0)}
function kanZet(kan,k,niv,fade){const K=KAN[kan];fade=fade||1.8;try{const c=ctx(),t=c.currentTime;
 if(K.k===k&&K.n){K.niv=niv;K.n.g.gain.cancelScheduledValues(t);K.n.g.gain.setValueAtTime(K.n.g.gain.value,t);K.n.g.gain.linearRampToValueAtTime(doel(kan)*niv,t+fade);return}
 if(K.n){const o=K.n;o.g.gain.cancelScheduledValues(t);o.g.gain.setValueAtTime(o.g.gain.value,t);o.g.gain.linearRampToValueAtTime(0,t+fade);setTimeout(()=>{try{o.s.stop()}catch(e){}},fade*1000+200);K.n=null}
 K.k=k;K.niv=niv;if(!k||!buf[k])return;const s=c.createBufferSource(),g=c.createGain();g.gain.value=0;s.buffer=buf[k];s.loop=true;s.connect(g).connect(c.destination);s.start();g.gain.linearRampToValueAtTime(doel(kan)*niv,t+fade+.4);K.n={s,g}}catch(e){}}
let basis='hal';const stapel=[];
/* Tijd van de dag (klok van het toestel): ochtend 6-11, middag 11-18, avond 18-22, nacht 22-6 */
const dagdeel=()=>{const h=new Date().getHours();return h>=6&&h<11?'ochtend':h<18&&h>=11?'middag':h>=18&&h<22?'avond':'nacht'};
const NACHTMUS={};/* Hal/menu's houden 's nachts hun eigen (thema)muziek, alleen zachter */
function variant(k){const d=dagdeel();if(d=='ochtend'&&buf[k+'-ochtend'])return k+'-ochtend';if((d=='avond'||d=='nacht')&&buf[k+'-nacht'])return k+'-nacht';return k}
function tint(){const d=dagdeel();if(!document.getElementById('zwtint')){const t=document.createElement('div');t.id='zwtint';document.body.appendChild(t)}document.body.classList.toggle('zw-avond',d=='avond');document.body.classList.toggle('zw-nacht',d=='nacht')}
function pas(){tint();if(!Object.keys(buf).length)return;const sc=SCENE[basis]||SCENE.hal;const tmp=stapel.length?TIJD[stapel[stapel.length-1]]:null;const laat=/avond|nacht/.test(dagdeel());
 const ak=variant(sc[0]);kanZet('amb',ak,sc[1]*(tmp?tmp[0]:1)*(/hal-nacht/.test(ak)?.45:1));const dd=dagdeel(),rzN=basis=='hal'?({ochtend:.27,middag:.27,avond:.16,nacht:0})[dd]*(tmp?tmp[0]:1):0;kanZet('rz',rzN?'amb-winkel':null,rzN,2.5);const mk=sc[2]=='mus-hal'&&buf['mus-titel']?'mus-titel':sc[2];kanZet('mus',tmp?tmp[1]:mk,(tmp?tmp[2]:sc[3])*(laat&&!tmp?.8:1))}
setInterval(()=>{try{pas()}catch(e){}},300000);setTimeout(tint,500);
/* Verrassingsgeluiden: zeldzaam, zacht, per locatie, nooit tijdens gesprekken */
const VERR={hal:['spook1','spook2','henk','foppe1','foppe2','foppe3','uil1','bel','deur1','deur2','kat'],level:['spook1','foppe1','foppe2','uil2','deur1','kat','bel'],kas:['uil1','uil2','kikker','vleugels','deur2'],moestuin:['fang1','fang2','norbert','uil3','vleugels'],winkel:['deur1','deur2','foppe1','kat','bel'],kerker:['drup1','drup2','drup3','spook2'],plaag:['drup1','drup2','drup3'],bos:['uil1','uil3','krekel','vleugels']};
function uilVlucht(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const u=document.createElement('div');u.textContent='🦉';u.style.cssText='position:fixed;top:'+(12+Math.random()*25)+'%;left:-60px;font-size:34px;z-index:50;pointer-events:none;opacity:.85;transition:transform 6s linear,opacity 1s';document.body.appendChild(u);requestAnimationFrame(()=>requestAnimationFrame(()=>u.style.transform=`translate(${innerWidth+120}px,-40px)`));setTimeout(()=>u.remove(),6200)}
function verrassing(){setTimeout(verrassing,45000+Math.random()*75000);try{if(S.verrassingen===false||!Object.keys(buf).length||stapel.length||document.hidden||document.querySelector('.modal'))return;
 let l=(VERR[basis]||VERR.hal).slice();if(/avond|nacht/.test(dagdeel())&&basis!='kerker'&&basis!='plaag')l.push('uil1','uil2','krekel');const k=l[Math.random()*l.length|0];if(!buf['verr-'+k])return;speelPak('verr-'+k,.35);if(/^uil|vleugels/.test(k))uilVlucht()}catch(e){}}
setTimeout(verrassing,60000);
const sfeer=sc=>{basis=sc;pas()};
function tijdelijk(k){stapel.push(k);pas()}function terug(){stapel.pop();pas()}
function volNu(){['amb','mus','rz'].forEach(k=>{const K=KAN[k];if(K.n){const c=ctx();K.n.g.gain.setTargetAtTime(doel(k)*K.niv,c.currentTime,.3)}})}
window.zwSfeer={zet:sfeer,tijdelijk,terug};
const SCHERM={kas:'kas',mijnkas:'kas',leraarpoort:'kas',kruidwinkel:'winkel',fopshop:'winkel',moestuin:'moestuin',kaart:'moestuin'};
const _ga=window.ga;window.ga=function(s,...a){if(stapel.length&&!document.querySelector('.verhaal,.modal'))stapel.length=0;sfeer(SCHERM[s]||'hal');return _ga.call(this,s,...a)};
try{const _ms=m3Speel;m3Speel=function(n,thema,boost){try{const p=window.plaagVan&&plaagVan(n);sfeer(p?(p.soort==='damp'?'kerker':'plaag'):thema==='verweer'?'bos':'level')}catch(e){}return _ms.apply(this,arguments)}}catch(e){}
try{const _vh=verhaal;verhaal=function(regels,klaar){let intro=false;try{intro=!!document.querySelector('.m3voor')||/Professor|Sneep|Stronk/.test(JSON.stringify(regels||[]).slice(0,200))}catch(e){}tijdelijk(intro?'intro':'gesprek');let weg=false;return _vh.call(this,regels,(...x)=>{if(!weg){weg=true;terug()}return klaar&&klaar(...x)})}}catch(e){}
/* overwinning: muziek even weg, fanfare voorop, dan terug */
function winstMuziek(){const b=buf['mus-winst'];if(!b||!S.muziekAan)return false;const K=KAN.mus;try{const c=ctx(),t=c.currentTime;if(K.n){K.n.g.gain.cancelScheduledValues(t);K.n.g.gain.setValueAtTime(K.n.g.gain.value,t);K.n.g.gain.linearRampToValueAtTime(0,t+.4)}
 const s=c.createBufferSource(),g=c.createGain();g.gain.value=.5*S.muziekVol+.1;s.buffer=b;s.connect(g).connect(c.destination);s.start(t+.3);
 setTimeout(()=>{if(K.n){const t2=ctx().currentTime;K.n.g.gain.linearRampToValueAtTime(doel('mus')*K.niv,t2+2.5)}},(b.duration+.4)*1000)}catch(e){}return true}
try{const _w2=m3Winst;m3Winst=function(){winstMuziek();return _w2.apply(this,arguments)}}catch(e){}
document.addEventListener('visibilitychange',()=>{try{if(!ac)return;document.hidden?ac.suspend():ac.resume()}catch(e){}});
V.geluid=()=>{app(`<div class="perkament" style="max-width:560px;margin:0 auto"><h2>Geluidspakket</h2><p>Heb je een bestand <b>zweinstein-geluiden.zip</b>? Laad het hier, dan krijgt het spel extra geluiden. Zonder pakket blijven de gewone geluiden.</p><p class="klein">Het pakket blijft op dit apparaat. Het zit <b>niet</b> in de backup, omdat het te groot is. Na een nieuwe telefoon laad je het opnieuw.</p><p id="gpstatus" class="klein">Even kijken…</p><input type="file" id="gpbestand" accept=".zip,application/zip" hidden><button class="knop volgende" id="gpkies">Geluidspakket laden</button> <button class="knop" id="gptest">Proef</button> <button class="knop" id="gpwis">Verwijderen</button><div class="gpsfeer"><label><input type="checkbox" id="gpmaan" ${S.muziekAan?'checked':''}> Muziek aan</label><label>Muziek <input type="range" id="gpmvol" min="0" max="1" step="0.05" value="${S.muziekVol}"></label><label><input type="checkbox" id="gpsaan" ${S.sfeerAan?'checked':''}> Sfeer (ambiance) aan</label><label><input type="checkbox" id="gpverr" ${S.verrassingen!==false?'checked':''}> Verrassingsgeluiden</label><label>Sfeer <input type="range" id="gpsvol" min="0" max="1" step="0.05" value="${S.sfeerVol}"></label><label>Effecten <input type="range" id="gpfvol" min="0" max="1" step="0.05" value="${S.fxVol}"></label></div><br><br><button class="knop" onclick="ga('meer')">Terug</button></div>`);
 const st=t=>{$('#gpstatus').textContent=t};laadBuffers().then(n=>st(n?`Pakket geladen: ${n} geluiden.`:'Nog geen pakket geladen.')).catch(()=>st('Nog geen pakket geladen.'));
 const ch=(id,k)=>$(id).onchange=e=>{S[k]=e.target.checked;bewaar();pas();volNu()};ch('#gpsaan','sfeerAan');$('#gpverr').onchange=e=>{S.verrassingen=e.target.checked;bewaar()};ch('#gpmaan','muziekAan');const sl=(id,k)=>$(id).oninput=e=>{S[k]=+e.target.value;bewaar();volNu()};sl('#gpsvol','sfeerVol');sl('#gpmvol','muziekVol');sl('#gpfvol','fxVol');
 $('#gpkies').onclick=()=>$('#gpbestand').click();
 $('#gpbestand').onchange=async e=>{const f=e.target.files[0];if(!f)return;st('Uitpakken…');try{const z=await unzip(await f.arrayBuffer());if(!z['index.json'])throw new Error('index.json ontbreekt');await wis();for(const [k,v] of Object.entries(z))await zet(k,v);const n=await laadBuffers();st(`Klaar! ${n} geluiden geladen.`);speelPak('fanfare');sfeer('hal')}catch(x){st('Dat lukte niet: '+x.message)}};
 $('#gptest').onclick=()=>{ctx();const ks=Object.keys(buf).filter(k=>!(window._zwPak&&_zwPak.geluiden[k].lus)&&k!='mus-winst');if(!ks.length){st('Nog geen pakket geladen.');return}speelPak(ks[Math.random()*ks.length|0])};
 $('#gpwis').onclick=async()=>{await wis();kanZet('amb',null,0);kanZet('mus',null,0);buf={};st('Pakket verwijderd. De gewone geluiden zijn terug.')}};
const _meer=V.meer;V.meer=(...a)=>{const r=_meer(...a);try{const m=document.getElementById('meermt')||document.querySelector('#app h1,#app h2');if(m&&!document.getElementById('meergp'))m.insertAdjacentHTML('afterend',`<button class="knop volgende" id="meergp" style="font-size:1.25em;padding:.7em 1.2em" onclick="ga('geluidstap')">🔊 Geluiden toevoegen</button>`)}catch(e){}return r};

/* Selecteergeluid in 2 delen: kies-loop zolang ze vasthoudt, kies-uit bij loslaten. Zonder die bestanden: gewone 'kies'. */
const KIES={n:null,t0:0};
window.zwSpeel=(k,v)=>speelPak(k,v);
window.zwKies={start(f){f=f||1;if(KIES.n)return;if(!buf['kies-loop']||!buf['kies-uit']||S.geluid===false||S.stil){try{fx.speel('kies')}catch(e){}return}
 const c=ctx(),s=c.createBufferSource(),g=c.createGain(),v=f*.7*(S.fxVol==null?.8:S.fxVol)/.8;s.buffer=buf['kies-loop'];s.loop=true;g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(v,c.currentTime+.012);s.connect(g).connect(c.destination);s.start();KIES.n={s,g,v};KIES.t0=performance.now()},
 stop(){const k=KIES.n;if(!k)return;KIES.n=null;const wacht=Math.max(0,130-(performance.now()-KIES.t0));setTimeout(()=>{try{const c=ctx(),t=c.currentTime,u=c.createBufferSource(),g=c.createGain();k.g.gain.cancelScheduledValues(t);k.g.gain.setValueAtTime(k.g.gain.value,t);k.g.gain.linearRampToValueAtTime(0,t+.06);k.s.stop(t+.08);u.buffer=buf['kies-uit'];g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(k.v,t+.04);u.connect(g).connect(c.destination);u.start(t)}catch(e){}},wacht)},
 tik(){this.start();this.stop()}};
['pointerup','pointercancel'].forEach(ev=>addEventListener(ev,()=>zwKies.stop(),true));
/* Spreukstemmen (Engels, uit het pakket): zacht, hooguit eens per 12 s en niet elke keer. */
let stemT=0;window.zwStem=s=>{const k=/wervel/.test(s)?'leviosa':/bliksem/.test(s)?'flipendo':/bom/.test(s)?'incendio':/verdwijn/.test(s)?'lumos':/drank|kristal/.test(s)?'alohomora':null;if(!k||S.stemmen===false)return;const n=Date.now();if(n-stemT<12000||Math.random()>.4)return;const naam='stem-'+k+(Math.random()<.5&&buf['stem-'+k+'2']?'2':'');if(buf[naam]){stemT=n;setTimeout(()=>speelPak(naam,.4),120)}};
/* Telefoon-stappenplan. Alleen de LINK staat in de code, nooit audio. Vul de Drive-id in zodra het bestand gedeeld is. */
const GELUID_LINK='https://drive.google.com/uc?export=download&id=1D62HNPcHEF3S9rQ_hbAwfk2l-O51DAUG';
/* Direct laden werkt niet: Drive weigert browserverzoeken (Sec-Fetch-Site cross-site geeft 403, zonder CORS). Uitgeschakeld; zet DIRECT_AAN=true als er ooit een CORS-host is. */
const DIRECT_AAN=false;const GELUID_DIRECT=DIRECT_AAN&&(()=>{const m=/id=([\w-]+)/.exec(GELUID_LINK);return m?`https://drive.usercontent.google.com/download?id=${m[1]}&export=download&confirm=t`:''})();
async function laadPakket(ab,st){st('Uitpakken…');const z=await unzip(ab);if(!z['index.json'])throw new Error('dit is niet het geluidspakket');await wis();for(const [k,v] of Object.entries(z))await zet(k,v);const n=await laadBuffers();st(`Klaar! ${n} geluiden geladen. 🎉`);speelPak('fanfare');sfeer('hal');return n}
async function laadLos(files,st){files=[...files];if(!files.length)return;st('Bestanden lezen…');const ij=files.find(f=>/(^|\/)index[^/]*\.json$/i.test(f.name));let idx=ij?JSON.parse(await ij.text()):null;const los={};
 for(const f of files){const m=/^(.*?)(?: \(\d+\))?\.(m4a|mp3|ogg|wav|aac|mp4)$/i.exec(f.name.split('/').pop());if(m)los[m[1].toLowerCase()]={f,ext:m[2].toLowerCase()}}
 if(!idx){idx={naam:'Zweinstein geluidspakket',versie:0,geluiden:{}};for(const [k,v] of Object.entries(los))idx.geluiden[k]={bestand_ext:v.ext,lus:/^(amb-|donker-|ketel$)|^mus-(?!winst)/.test(k)}}
 let n=0;const tot=Object.keys(idx.geluiden).length;await wis();
 for(const [k,inf] of Object.entries(idx.geluiden)){const v=los[k.toLowerCase()];if(!v)continue;inf.bestand_ext=v.ext;await zet(k+'.'+v.ext,new Uint8Array(await v.f.arrayBuffer()));n++}
 if(!n){st('Geen geluiden herkend. Kies de bestanden uit de uitgepakte map (zoals klik.m4a).');return}
 await zet('index.json',new TextEncoder().encode(JSON.stringify(idx)));const ok=await laadBuffers();st(`Klaar! ${ok} van ${Math.max(tot,71)} geluiden geladen. 🎉`);speelPak('fanfare');sfeer('hal')}
window.zwLaadLos=laadLos;
window.zwGeluidDirect=async(st,balk)=>{const r=await fetch(GELUID_DIRECT);if(!r.ok)throw new Error('download mislukt ('+r.status+')');const tot=+r.headers.get('content-length')||6.6e6,rd=r.body.getReader(),delen=[];let n=0;for(;;){const {done,value}=await rd.read();if(done)break;delen.push(value);n+=value.length;const pc=Math.min(100,Math.round(n/tot*100));balk&&(balk.style.width=pc+'%');st('Downloaden… '+pc+'%')}const u=new Uint8Array(n);let o=0;for(const d of delen){u.set(d,o);o+=d.length}return laadPakket(u.buffer,st)};
V.geluidstap=()=>{const heeft=Object.keys(buf).length>0;const L=GELUID_LINK;app(`<div class="perkament" style="max-width:560px;margin:0 auto;font-size:1.15em"><h2>🔊 Geluiden toevoegen</h2>${heeft?'<p><b>Er is al een geluidspakket geladen.</b> Je kunt het opnieuw doen als je wilt.</p>':''}
${GELUID_DIRECT?`<button class="knop volgende" id="gsdirect" style="font-size:1.35em;padding:.7em 1.2em">🔊 Geluiden laden (één tik)</button><div style="height:12px;background:rgba(0,0,0,.15);border-radius:6px;margin:.6em 0;overflow:hidden"><div id="gsbalk" style="height:100%;width:0;background:#c9a23a"></div></div><p id="gsdst" style="font-size:1.2em"></p><details><summary>Lukt het niet? Doe het met de hand</summary>`:''}<p><b>Stap 1</b></p>${L?`<a class="knop volgende" style="font-size:1.2em;display:inline-block" href="${L}" target="_blank" rel="noopener">Download geluidspakket</a>`:'<p class="klein">De downloadlink is nog niet ingesteld.</p>'}
<p style="margin-top:1.2em"><b>Stap 2</b></p><p style="font-size:1.3em"><b>Het bestand staat in Downloads</b><br>(zweinstein-geluiden.zwp)</p><p style="font-size:1.3em;margin-top:1em"><b>Pakte je telefoon het uit?</b><br>Open de uitgepakte map in Downloads en selecteer alle bestanden.</p><input type="file" id="gslos" multiple accept="audio/*,.m4a,.json" hidden><button class="knop volgende" style="font-size:1.2em" id="gsloskies">Kies alle losse bestanden</button> ${'webkitdirectory' in document.createElement('input')?'<input type="file" id="gsmap" webkitdirectory multiple hidden><button class="knop" style="font-size:1.2em" id="gsmapkies">Kies de hele map</button>':''}<p class="klein" style="margin-top:.8em">Of het ingepakte bestand (.zip of .zwp):</p><input type="file" id="gsbestand" accept=".zip,.zwp,.bin,application/zip,application/octet-stream" hidden><button class="knop volgende" style="font-size:1.2em" id="gskies">Kies het ingepakte bestand</button>
<p style="margin-top:1.2em"><b>Stap 3</b></p><p id="gsstatus" style="font-size:1.3em">…</p><br>${GELUID_DIRECT?'</details>':''}<br><button class="knop" onclick="ga('geluid')">Instellingen</button> <button class="knop" onclick="ga('meer')">Terug</button></div>`);
 const st=t=>$('#gsstatus').textContent=t;$('#gsloskies').onclick=()=>$('#gslos').click();$('#gslos').onchange=e=>laadLos(e.target.files,st).catch(x=>st('Dat lukte niet: '+x.message));if($('#gsmap')){$('#gsmapkies').onclick=()=>$('#gsmap').click();$('#gsmap').onchange=e=>laadLos(e.target.files,st).catch(x=>st('Dat lukte niet: '+x.message))}const db=$('#gsdirect');if(db)db.onclick=async()=>{db.disabled=true;const s2=t=>$('#gsdst').textContent=t;try{await zwGeluidDirect(s2,$('#gsbalk'))}catch(x){s2('Dat lukte niet: '+x.message+'. Probeer het met de hand hieronder.')}db.disabled=false};$('#gskies').onclick=()=>$('#gsbestand').click();
 $('#gsbestand').onchange=async e=>{const f=e.target.files[0];if(!f)return;st('Uitpakken…');try{const z=await unzip(await f.arrayBuffer());if(!z['index.json'])throw new Error('dit is niet het geluidspakket');await wis();for(const [k,v] of Object.entries(z))await zet(k,v);const n=await laadBuffers();st(`Klaar! ${n} geluiden geladen. 🎉`);speelPak('fanfare');sfeer('hal')}catch(x){st('Dat lukte niet: '+x.message)}}};
setTimeout(()=>{try{if(S.gpMelding||Object.keys(buf).length)return;S.gpMelding=1;bewaar();const d=document.createElement('div');d.id='gpmelding';d.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:9999;max-width:92vw';d.innerHTML=`<div class="perkament" style="font-size:1.1em;text-align:center">🔊 Wil je extra geluiden en muziek?<br><button class="knop volgende" id="gpmja">Geluiden toevoegen</button> <button class="knop" id="gpmnee">Later</button></div>`;document.body.appendChild(d);$('#gpmja').onclick=()=>{d.remove();ga('geluidstap')};$('#gpmnee').onclick=()=>d.remove()}catch(e){}},5000);
})();
