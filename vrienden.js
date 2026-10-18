/* Vrienden-uitdagingen: vriendcode, vriendenlijst, dag- en weekuitdagingen via Supabase (kleine fetch-client).
   Nooit blokkerend: alles stil op de achtergrond, fouten worden ingeslikt. */
(()=>{const CF=window.ZW_ONLINE||{};const AAN=!!(CF.url&&CF.key);const BASIS=(CF.url||'').replace(/\/$/,'');const AK='zw_online';
const LINK='https://cccoders1.github.io/zweinstein-luna/';
/* ---------- periodes (lokale tijd) ---------- */
const p2=n=>String(n).padStart(2,'0');
const dagKey=(d=new Date())=>`d-${d.getFullYear()}-${p2(d.getMonth()+1)}-${p2(d.getDate())}`;
const weekKey=(d=new Date())=>{const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));t.setUTCDate(t.getUTCDate()+3-((t.getUTCDay()+6)%7));const j=t.getUTCFullYear();const w=Math.ceil(((t-Date.UTC(j,0,1))/864e5+1)/7);return `w-${j}-W${p2(w)}`};
const keyDatum=k=>{if(k[0]=='d')return new Date(k.slice(2)+'T12:00:00');const [j,w]=[+k.slice(2,6),+k.slice(8)];const t=new Date(Date.UTC(j,0,4));t.setUTCDate(t.getUTCDate()-((t.getUTCDay()+6)%7)+(w-1)*7+6);return new Date(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate(),12)};
/* ---------- uitdagingen (zelfde voor iedereen, afgeleid van de datum) ---------- */
const UIT={smek:{n:'Meeste Smekkies verdiend',i:'🪙',e:'Smekkies'},ster3:{n:'Meeste levels met 3 sterren',i:'⭐',e:'×3★'},kik:{n:'Meeste chocokikkers verzameld',i:'🐸',e:'kikkers'},lvl:{n:'Meeste nieuwe levels gewonnen',i:'🏆',e:'levels'},schild:{n:'Meeste huisschilden verdiend',i:'🛡️',e:'schilden'}};
const POOL={d:['smek','ster3','kik','lvl'],w:['lvl','schild','ster3','smek']};
const BEL={d:{mee:10,win:10},w:{mee:30,win:25}};
const hash=s=>{let h=7;for(const c of s)h=(Math.imul(h,31)+c.charCodeAt(0))>>>0;return h};
const kies=k=>{const P=POOL[k[0]],h=hash(k),a=h%P.length,b=(a+1+(h>>>8)%(P.length-1))%P.length;return [P[a],P[b]]};
window.zwUitdagingen=k=>kies(k||dagKey());
/* ---------- lokale telling (in de save, dus 'Alles resetten' wist dit mee) ---------- */
const vr=()=>{if(!S.vr||typeof S.vr!='object')S.vr={sc:{},gl:S.galjoenen|0,kk:S.kikkers|0,kl:{}};S.vr.sc=S.vr.sc||{};S.vr.kl=S.vr.kl||{};return S.vr};
const tel=(ch,n)=>{if(!(n>0))return;const v=vr();[dagKey(),weekKey()].forEach(k=>{const o=v.sc[k]=v.sc[k]||{};o[ch]=(o[ch]|0)+n});v.vuil=1};
const opruimen=()=>{const v=vr(),grens=Date.now()-21*864e5;Object.keys(v.sc).forEach(k=>{if(keyDatum(k)<grens)delete v.sc[k]});Object.keys(v.kl).forEach(k=>{if(keyDatum(k)<grens-30*864e5)delete v.kl[k]})};
// Smekkies en kikkers: alleen stijgingen tellen, niet in het testmenu, geen sprongen (back-up terugzetten)
const kijk=()=>{try{if(!S||!S.naam)return;const v=vr();const g=S.galjoenen|0,kk=S.kikkers|0;const bv=document.body.dataset.view;
 const tellen=bv!=='maker'&&bv!=='backup'&&!window._vrStil;let ver=false;
 if(g!==v.gl){const d=g-v.gl;if(tellen&&d>0&&d<=1500){tel('smek',d);ver=true}v.gl=g}
 if(kk!==v.kk){const d=kk-v.kk;if(tellen&&d>0&&d<=50){tel('kik',d);ver=true}v.kk=kk}
 if(ver)bewaar()}catch(e){}};
setInterval(kijk,3000);
// Levels: alleen echte nieuwe winst; 3★ alleen als het level voor het eerst 3★ krijgt; schilden zijn al per level begrensd
if(typeof m3Winst==='function'){const _w=m3Winst;window.m3Winst=m3Winst=function(n,b,...a){let eerste=false,oudSt=0,oudSch=0;try{eerste=n>=(S.m3lvl|0);oudSt=(S.lvSter&&S.lvSter[n])|0;oudSch=S.schilden|0}catch(e){}
 const r=_w.call(this,n,b,...a);
 try{if(!window._vrStil&&document.body.dataset.view!=='maker'){if(eerste)tel('lvl',1);const st=(S.lvSter&&S.lvSter[n])|0;if(st>=3&&oudSt<3)tel('ster3',1);tel('schild',Math.max(0,(S.schilden|0)-oudSch));kijk();bewaar()}}catch(e){}
 return r}}
/* ---------- kleine Supabase-client ---------- */
let ST=AAN?'onbekend':'uit',laatsteNiet=0;window.zwOnlineStatus=()=>ST;
const sess=()=>{try{return JSON.parse(localStorage.getItem(AK)||'null')}catch(e){return null}};
const zetSess=j=>{const s={at:j.access_token,rt:j.refresh_token,exp:j.expires_at||Math.floor(Date.now()/1e3)+(j.expires_in|0),uid:j.user&&j.user.id};localStorage.setItem(AK,JSON.stringify(s));return s};
class Fout extends Error{constructor(m,st,c){super(m);this.status=st;this.code=c}}
async function http(pad,{method='GET',body,auth=true,prefer}={}){const ac=new AbortController(),to=setTimeout(()=>ac.abort(),9000);
 try{const h={apikey:CF.key};if(body!==undefined)h['Content-Type']='application/json';if(auth)h.Authorization='Bearer '+await token();if(prefer)h.Prefer=prefer;
  const r=await fetch(BASIS+pad,{method,headers:h,body:body!==undefined?JSON.stringify(body):undefined,signal:ac.signal,cache:'no-store'});
  const tx=await r.text();let j=null;try{j=tx?JSON.parse(tx):null}catch(e){}
  if(!r.ok)throw new Fout((j&&(j.msg||j.message||j.error_description||j.error))||('HTTP '+r.status),r.status,j&&(j.code||j.error_code));return j}
 finally{clearTimeout(to)}}
let tokBezig=null;
const token=()=>tokBezig||(tokBezig=(async()=>{let s=sess();const nu=Date.now()/1e3;if(s&&s.at&&s.exp-60>nu)return s.at;
 if(s&&s.rt){try{return zetSess(await http('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:s.rt},auth:false})).at}catch(e){if(!e.status||e.status>=500||e.status==429)throw e}}
 const inst=await http('/auth/v1/settings',{auth:false});if(!(inst&&inst.external&&inst.external.anonymous_users))throw new Fout('anoniem uit',403,'anonymous_provider_disabled');
 return zetSess(await http('/auth/v1/signup',{method:'POST',body:{data:{}},auth:false})).at})().finally(()=>{tokBezig=null}));
const rpc=(f,args={})=>http('/rest/v1/rpc/'+f,{method:'POST',body:args});
const mijnId=()=>{const s=sess();return s&&s.uid};
const nietKlaar=e=>e&&(e.code==='anonymous_provider_disabled'||e.status===404||e.status===401&&!sess()||['PGRST202','PGRST205','42P01','42883','PGRST106'].includes(e.code)||/anonymous/i.test(e.message||''));
const fout=e=>{if(nietKlaar(e)){ST='nietklaar';laatsteNiet=Date.now()}else if(ST!=='klaar')ST='offline'};
/* ---------- synchroniseren (wachtrij = lokale telling met vuil-vlag) ---------- */
let bezig=null;
async function sync(forceer){if(!AAN||!S.naam||!S.huis)return false;if(ST==='nietklaar'&&!forceer&&Date.now()-laatsteNiet<10*60e3)return false;if(typeof navigator!='undefined'&&navigator.onLine===false){ST=ST==='klaar'?'klaar':'offline';return false}
 if(bezig)return bezig;
 bezig=(async()=>{try{const v=vr();opruimen();const code=await rpc('upsert_me',{p_name:String(S.naam).slice(0,24),p_house:S.huis||'',p_level:S.m3lvl|0});if(code&&v.code!==code){v.code=code;bewaar()}
  const rows=[];Object.entries(v.sc).forEach(([k,o])=>Object.entries(o).forEach(([c,s])=>{if(s>0)rows.push({period_key:k,challenge_id:c,score:Math.min(s|0,1e6)})}));
  if(rows.length&&v.vuil!==0){await rpc('submit_scores',{rows});v.vuil=0;bewaar()}
  ST='klaar';await claims();return true}catch(e){fout(e);return false}finally{bezig=null}})();return bezig}
window.zwVrSync=sync;
const scoresVan=async keys=>(await http('/rest/v1/challenge_scores?select=player_id,period_key,challenge_id,score&period_key=in.('+keys.map(encodeURIComponent).join(',')+')'))||[];
/* ---------- beloningen na afloop van een periode ---------- */
let wachtPop=[];
async function claims(){const v=vr(),nu={d:dagKey(),w:weekKey()},grens=Date.now()-14*864e5;
 const open=Object.keys(v.sc).filter(k=>!v.kl[k]&&k!==nu[k[0]]&&keyDatum(k)<new Date()&&keyDatum(k)>=grens&&kies(k).some(c=>(v.sc[k][c]|0)>0));if(!open.length)return;
 const alle=await scoresVan(open);const ik=mijnId();
 for(const k of open){const mijn=v.sc[k],gekozen=kies(k),b=BEL[k[0]];let win=[];
  for(const c of gekozen){const m=mijn[c]|0;const anderen=alle.filter(r=>r.period_key===k&&r.challenge_id===c&&r.player_id!==ik);if(m>0&&anderen.length&&anderen.every(r=>r.score<=m))win.push(c)}
  const g=b.mee+b.win*win.length;
  try{await http('/rest/v1/challenge_claims',{method:'POST',body:{period_key:k,reward:g},prefer:'return=minimal'});}catch(e){if(e.status===409||e.code==='23505'){v.kl[k]=1;bewaar();continue}throw e}
  v.kl[k]=1;window._vrStil=1;S.galjoenen=(S.galjoenen|0)+g;v.gl=S.galjoenen|0;bewaar();try{stats()}catch(e){}window._vrStil=0;wachtPop.push({k,g,win})}
 toonPop()}
const periodeTekst=k=>k[0]=='d'?'van '+keyDatum(k).toLocaleDateString('nl-NL',{weekday:'long',day:'numeric',month:'long'}):'van week '+(+k.slice(8));
function toonPop(){if(!wachtPop.length)return;if(document.querySelector('.modal,.verhaal')||document.body.dataset.view!=='home'&&document.body.dataset.view!=='samen'){clearTimeout(toonPop.t);toonPop.t=setTimeout(toonPop,4000);return}
 const p=wachtPop.shift();const o=document.createElement('div');o.className='modal';
 o.innerHTML=`<div class="modalin rococo mpmodal vrpop"><h2>🦉 Uilenpost van je vrienden</h2><p>De uitdagingen ${periodeTekst(p.k)} zijn afgelopen.</p>${p.win.length?`<p>Je stond bovenaan bij: <b>${p.win.map(c=>UIT[c].n.toLowerCase()).join('</b> en <b>')}</b>! 🥇</p>`:'<p>Fijn dat je meedeed!</p>'}<p class="vrbel">+${p.g} Smekkies</p><button class="knop volgende" data-geenverder="1">Dankjewel!</button></div>`;
 document.body.appendChild(o);o.querySelector('button').onclick=()=>{o.remove();try{fx.speel('munt')}catch(e){}setTimeout(toonPop,600)}}
/* ---------- scherm ---------- */
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kroon=h=>{try{return HUIZEN[h]?schild(h,34):'<span class="vrgeenhuis">🎩</span>'}catch(e){return ''}};
const kop=()=>`<div class="mgkop"><img class="mgkopimg" src="img/ui/nav-hal-96.webp" alt=""><div><h2 class="mgtitel">Vrienden-uitdagingen</h2><p class="mguitleg">Speel samen met vrienden die het spel ook hebben. Elke dag en elke week een nieuwe uitdaging.</p></div></div>`;
const resterend=k=>{const nu=new Date();let eind;if(k[0]=='d'){eind=new Date(nu);eind.setHours(24,0,0,0)}else{eind=new Date(nu);eind.setHours(24,0,0,0);eind.setDate(eind.getDate()+((7-((nu.getDay()+6)%7))-1))}const u=Math.max(0,Math.round((eind-nu)/36e5));return u<24?`nog ${u} uur`:`nog ${Math.round(u/24)} dagen`};
let cache={vr:[],sc:[]};
function bord(k,vrienden,scores){const ik=mijnId(),v=vr(),b=BEL[k[0]];
 const mensen=[{id:ik,name:S.naam,house:S.huis,level:S.m3lvl|0,ik:1},...vrienden];
 return kies(k).map(c=>{const u=UIT[c];const rij=mensen.map(m=>({...m,s:m.ik?Math.max(((v.sc[k]||{})[c])|0,(scores.find(r=>r.player_id===ik&&r.period_key===k&&r.challenge_id===c)||{}).score|0):((scores.find(r=>r.player_id===m.id&&r.period_key===k&&r.challenge_id===c)||{}).score|0)})).sort((a,z)=>z.s-a.s||(a.ik?-1:z.ik?1:0));
  let plek=0,vorige=null;return `<section class="vrbord"><h3>${u.i} ${u.n}</h3><ol>${rij.map((m,i)=>{if(m.s!==vorige){plek=i+1;vorige=m.s}const med=m.s>0?(['🥇','🥈','🥉'][plek-1]||plek+'.'):'·';return `<li class="${m.ik?'vrik':''}"><span class="vrplek">${med}</span>${kroon(m.house)}<span class="vrnaam">${esc(m.name||'?')}${m.ik?' (jij)':''}</span><b class="vrscore">${m.s}</b></li>`}).join('')}</ol></section>`}).join('')+
  `<p class="klein vruitleg">⏳ ${resterend(k)}. Na afloop krijg je <b>+${b.mee} Smekkies</b> als je meedeed, en <b>+${b.win}</b> extra voor elke uitdaging waarin je bovenaan staat bij je vrienden.</p>`}
function teken(){const app=$('#app');if(!app||document.body.dataset.view!=='samen')return;const tab=V.samen.tab||'d';const v=vr();
 if(!AAN||ST==='nietklaar'){app.innerHTML=`<div class="perkament lijst mgkader vrkader">${kop()}<p class="vrbinnen">🦉 <b>Binnenkort!</b><br>De uilen worden nog getraind. Straks kun je hier vrienden toevoegen en samen uitdagingen spelen.</p><button class="knop" onclick="ga('meer')">Terug</button></div>`;return}
 const code=v.code||'······';
 app.innerHTML=`<div class="perkament lijst mgkader vrkader">${kop()}
 ${ST==='offline'?'<p class="klein vrlet">Even geen verbinding. Je voortgang wordt bewaard en later verstuurd.</p>':''}
 <section class="vrcode"><p>Jouw vriendcode</p><div class="vrcodeveld">${esc(code)}</div><div class="vrknoppen"><button class="knop" id="vrkopie" ${v.code?'':'disabled'}>📋 Kopiëren</button><button class="knop volgende" id="vrdeel" ${v.code?'':'disabled'}>💬 Delen via WhatsApp</button></div></section>
 <section class="vrnieuw"><label for="vrin">Vriend toevoegen met code</label><div class="vrknoppen"><input id="vrin" maxlength="6" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABC123"><button class="knop volgende" id="vradd">Toevoegen</button></div></section>
 <section class="vrlijst"><h3>Mijn vrienden</h3>${cache.vr.length?`<ul>${cache.vr.map(f=>`<li>${kroon(f.house)}<span class="vrnaam">${esc(f.name||'?')}</span><span class="vrlv">level ${f.level|0}</span><button class="linkknop vrweg" data-id="${esc(f.id)}" data-n="${esc(f.name)}" aria-label="Verwijderen">✕</button></li>`).join('')}</ul>`:'<p class="klein">Nog geen vrienden. Deel je code met iemand die het spel ook heeft!</p>'}</section>
 <div class="vrtabs"><button class="${tab=='d'?'actief':''}" data-t="d">Vandaag</button><button class="${tab=='w'?'actief':''}" data-t="w">Deze week</button></div>
 ${bord(tab=='d'?dagKey():weekKey(),cache.vr,cache.sc)}
 <button class="knop" onclick="ga('meer')">Terug</button></div>`;
 const deelTekst=`Speel je mee in Zweinstein? Open ${LINK} en zet de app op je beginscherm. Voeg mij daarna toe als vriend: Meer → Vrienden-uitdagingen, code ${v.code}`;
 $('#vrkopie').onclick=async()=>{try{await navigator.clipboard.writeText(v.code);toast('Code gekopieerd')}catch(e){prompt('Jouw vriendcode:',v.code)}};
 $('#vrdeel').onclick=async()=>{try{if(navigator.share){await navigator.share({text:deelTekst});return}}catch(e){if(e&&e.name==='AbortError')return}window.open('https://wa.me/?text='+encodeURIComponent(deelTekst),'_blank')};
 const inp=$('#vrin');inp.oninput=()=>{inp.value=inp.value.toUpperCase().replace(/[^A-Z0-9]/g,'')};
 $('#vradd').onclick=async()=>{const c=inp.value.trim();if(c.length!==6){toast('Een vriendcode heeft 6 tekens');return}$('#vradd').disabled=true;
  try{const r=await rpc('add_friend_by_code',{code:c});if(r&&r.ok){toast(`🦉 ${r.name||'Je vriend'} is nu je vriend!`);await laad()}else toast(({zelf:'Dat is je eigen code 🙂',onbekend:'Deze code kennen we niet. Klopt hij?',vol:'Je hebt al heel veel vrienden'})[r&&r.reden]||'Dat lukte niet')}
  catch(e){fout(e);toast('Dat lukte nu niet. Probeer het straks nog eens.')}finally{const b=$('#vradd');if(b)b.disabled=false}};
 app.querySelectorAll('.vrweg').forEach(b=>b.onclick=async()=>{if(!confirm(`${b.dataset.n||'Deze vriend'} verwijderen als vriend?`))return;try{await rpc('remove_friend',{fid:b.dataset.id});await laad()}catch(e){toast('Dat lukte nu niet')}});
 app.querySelectorAll('.vrtabs button').forEach(b=>b.onclick=()=>{V.samen.tab=b.dataset.t;teken()})}
async function laad(){await sync(true);if(ST==='klaar'){try{const [f,s]=await Promise.all([rpc('my_friends'),scoresVan([dagKey(),weekKey()])]);cache={vr:f||[],sc:s||[]}}catch(e){fout(e)}}teken();toonPop()}
V.samen=(tab)=>{if(tab)V.samen.tab=tab;const app=$('#app');app.innerHTML=`<div class="perkament lijst mgkader vrkader">${kop()}<p class="vrbinnen">🦉 De uilen vliegen…</p></div>`;if(!AAN){teken();return}laad()};
/* ---------- knop in Meer ---------- */
if(AAN){const _meer=V.meer;V.meer=(...a)=>{const r=_meer(...a);try{const h=document.querySelector('#app h1,#app h2');if(h&&!document.getElementById('meeron'))h.insertAdjacentHTML('afterend',`<button class="knop volgende meeron" id="meeron" onclick="ga('samen')">🦉 Vrienden-uitdagingen</button>`)}catch(e){}return r};
 setTimeout(()=>sync(),6000);setInterval(()=>{if(vr().vuil)sync()},3*60e3);setInterval(()=>sync(),30*60e3);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(()=>sync(),1500)});window.addEventListener('online',()=>sync())}
})();
