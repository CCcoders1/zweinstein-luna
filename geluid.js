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
function speelPak(k,vol){const b=buf[k];if(!b||S.geluid===false||S.stil)return false;const c=ctx(),s=c.createBufferSource(),g=c.createGain();g.gain.value=vol||.7;s.buffer=b;s.connect(g).connect(c.destination);s.start();return true}
window.pakSpeel=speelPak;
/* fx.speel omleiden als het pakket dit geluid heeft */
let klaar=false;const start=()=>{if(klaar)return;klaar=true;laadBuffers().then(n=>{if(n)sfeer(basis||'amb-hal')}).catch(()=>0)};
const hang=()=>{if(!window.fx||fx._pak)return;const org=fx.speel;fx.speel=n=>{if(speelPak(n))return;const FB={splat:'whoosh',kassa:'munt',kaart:'goed',winst:'fanfare',verlies:'fout',vuurwerk:'tover',combi:'tover',kist:'klik',kikker:'goed'};if(FB[n])return org(FB[n]);return org(n)};fx._pak=1};
hang();addEventListener('pointerdown',start,{once:true});
/* extra momenten in het spel */
try{const _td=Bord.prototype.telDoel;Bord.prototype.telDoel=function(t){if(!this.sim&&typeof M3!='undefined'&&this===M3.b&&t===this.ksoort&&buf.kist)speelPak('kist',.5);return _td.apply(this,arguments)};
 const _op=Bord.prototype.oplossen;Bord.prototype.oplossen=async function(){if(!this.sim&&typeof M3!='undefined'&&this===M3.b)speelPak('match',.45);return _op.apply(this,arguments)};
 const _w=m3Winst;m3Winst=function(){speelPak('winst');return _w.apply(this,arguments)};const _v=m3Verlies;m3Verlies=function(){speelPak('verlies');return _v.apply(this,arguments)};}catch(e){}
try{const _v=V.moestuin;if(_v)V.moestuin=(...a)=>{const r=_v(...a);setTimeout(()=>speelPak('hagrid',.5),400);return r}}catch(e){}
try{const _v=V.fopshop;if(_v)V.fopshop=(...a)=>{const r=_v(...a);setTimeout(()=>speelPak('vuurwerk',.35),600);return r}}catch(e){}
/* ===== sfeer: één lus tegelijk, zachte crossfade ===== */
if(S.sfeerAan==null)S.sfeerAan=true;if(S.sfeerVol==null)S.sfeerVol=.5;
let nu=null,nuK=null,stapel=[];
function sfeerZet(k){if(k===nuK)return;nuK=k;try{const c=ctx(),t=c.currentTime;if(nu){const o=nu;o.g.gain.cancelScheduledValues(t);o.g.gain.setValueAtTime(o.g.gain.value,t);o.g.gain.linearRampToValueAtTime(0,t+1.8);setTimeout(()=>{try{o.s.stop()}catch(e){}},2000);nu=null}
 if(!k||!buf[k]||!S.sfeerAan||S.geluid===false)return;const s=c.createBufferSource(),g=c.createGain();g.gain.value=0;s.buffer=buf[k];s.loop=true;s.connect(g).connect(c.destination);s.start();g.gain.linearRampToValueAtTime(.35*S.sfeerVol,t+2.2);nu={s,g}}catch(e){}}
function sfeerVol(){if(nu){const c=ctx();nu.g.gain.setTargetAtTime(S.sfeerAan?.35*S.sfeerVol:0,c.currentTime,.3)}}
let basis=null;const sfeer=k=>{basis=k;if(!stapel.length)sfeerZet(k)};
function tijdelijk(k){stapel.push(k);sfeerZet(k)}function terug(){stapel.pop();sfeerZet(stapel.length?stapel[stapel.length-1]:basis)}
window.zwSfeer={zet:sfeer,tijdelijk,terug};
const SCHERM={kas:'amb-kas',mijnkas:'amb-kas',leraarpoort:'amb-kas',kruidwinkel:'amb-winkel',fopshop:'amb-winkel',moestuin:'amb-buiten',kaart:'amb-buiten'};
const _ga=window.ga;window.ga=function(s,...a){if(Object.keys(buf).length)sfeer(SCHERM[s]||'amb-hal');return _ga.call(this,s,...a)};
try{const _ms=m3Speel;m3Speel=function(n,thema,boost){try{const p=window.plaagVan&&plaagVan(n);sfeer(p?(p.soort==='damp'?'donker-kerker':'donker-plaag'):thema==='verweer'?'donker-bos':'amb-level')}catch(e){}return _ms.apply(this,arguments)}}catch(e){}
try{const _vh=verhaal;verhaal=function(regels,klaar){let intro=false;try{intro=!!document.querySelector('.m3voor')||/Professor|Sneep|Stronk/.test(JSON.stringify(regels||[]).slice(0,200))}catch(e){}tijdelijk(intro?'amb-intro':'amb-gesprek');let weg=false;return _vh.call(this,regels,(...x)=>{if(!weg){weg=true;terug()}return klaar&&klaar(...x)})}}catch(e){}
document.addEventListener('visibilitychange',()=>{try{if(!ac)return;document.hidden?ac.suspend():ac.resume()}catch(e){}});
V.geluid=()=>{app(`<div class="perkament" style="max-width:560px;margin:0 auto"><h2>Geluidspakket</h2><p>Heb je een bestand <b>zweinstein-geluiden.zip</b>? Laad het hier, dan krijgt het spel extra geluiden. Zonder pakket blijven de gewone geluiden.</p><p class="klein">Het pakket blijft op dit apparaat. Het zit <b>niet</b> in de backup, omdat het te groot is. Na een nieuwe telefoon laad je het opnieuw.</p><p id="gpstatus" class="klein">Even kijken…</p><input type="file" id="gpbestand" accept=".zip,application/zip" hidden><button class="knop volgende" id="gpkies">Geluidspakket laden</button> <button class="knop" id="gptest">Proef</button> <button class="knop" id="gpwis">Verwijderen</button><div class="gpsfeer"><label><input type="checkbox" id="gpsaan" ${S.sfeerAan?'checked':''}> Sfeer (ambiance) aan</label><label>Sfeer-volume <input type="range" id="gpsvol" min="0" max="1" step="0.05" value="${S.sfeerVol}"></label></div><br><br><button class="knop" onclick="ga('meer')">Terug</button></div>`);
 const st=t=>{$('#gpstatus').textContent=t};laadBuffers().then(n=>st(n?`Pakket geladen: ${n} geluiden.`:'Nog geen pakket geladen.')).catch(()=>st('Nog geen pakket geladen.'));
 $('#gpsaan').onchange=e=>{S.sfeerAan=e.target.checked;bewaar();if(S.sfeerAan){const k=nuK;nuK=null;sfeerZet(k||'amb-hal')}else sfeerZet(null)};$('#gpsvol').oninput=e=>{S.sfeerVol=+e.target.value;bewaar();sfeerVol()};
 $('#gpkies').onclick=()=>$('#gpbestand').click();
 $('#gpbestand').onchange=async e=>{const f=e.target.files[0];if(!f)return;st('Uitpakken…');try{const z=await unzip(await f.arrayBuffer());if(!z['index.json'])throw new Error('index.json ontbreekt');await wis();for(const [k,v] of Object.entries(z))await zet(k,v);const n=await laadBuffers();st(`Klaar! ${n} geluiden geladen.`);speelPak('fanfare');nuK=null;sfeerZet('amb-hal')}catch(x){st('Dat lukte niet: '+x.message)}};
 $('#gptest').onclick=()=>{ctx();const ks=Object.keys(buf).filter(k=>!(window._zwPak&&_zwPak.geluiden[k].lus));if(!ks.length){st('Nog geen pakket geladen.');return}speelPak(ks[Math.random()*ks.length|0])};
 $('#gpwis').onclick=async()=>{await wis();sfeerZet(null);buf={};st('Pakket verwijderd. De gewone geluiden zijn terug.')}};
const _meer=V.meer;V.meer=(...a)=>{const r=_meer(...a);try{const m=document.getElementById('meermt')||document.querySelector('#app h1,#app h2');if(m&&!document.getElementById('meergp'))m.insertAdjacentHTML('afterend',`<button class="knop volgende" id="meergp" onclick="ga('geluid')">🔊 Geluidspakket</button>`)}catch(e){}return r};
})();
