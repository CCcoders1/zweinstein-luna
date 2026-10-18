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
 try{if(!window._vrStil&&document.body.dataset.view!=='maker'){if(eerste)tel('lvl',1);const st=(S.lvSter&&S.lvSter[n])|0;if(st>=3&&oudSt<3)tel('ster3',1);if(st>0){const v=vr();v.lsq=v.lsq||{};if(st>(v.lsq[n]|0))v.lsq[n]=st}tel('schild',Math.max(0,(S.schilden|0)-oudSch));kijk();bewaar()}}catch(e){}
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
const fout=e=>{const was=ST;if(nietKlaar(e)){ST='nietklaar';laatsteNiet=Date.now()}else if(ST!=='klaar')ST='offline';if(was!==ST)try{halPaneel()}catch(x){}};
/* ---------- synchroniseren (wachtrij = lokale telling met vuil-vlag) ---------- */
let bezig=null;
async function sync(forceer){if(!AAN||!S.naam||!S.huis)return false;if(ST==='nietklaar'&&!forceer&&Date.now()-laatsteNiet<10*60e3)return false;if(typeof navigator!='undefined'&&navigator.onLine===false){ST=ST==='klaar'?'klaar':'offline';return false}
 if(bezig)return bezig;
 bezig=(async()=>{try{const v=vr();opruimen();const code=await rpc('upsert_me',{p_name:String(S.naam).slice(0,24),p_house:S.huis||'',p_level:S.m3lvl|0});if(code&&v.code!==code){v.code=code;bewaar()}
  const rows=[];Object.entries(v.sc).forEach(([k,o])=>Object.entries(o).forEach(([c,s])=>{if(s>0)rows.push({period_key:k,challenge_id:c,score:Math.min(s|0,1e6)})}));
  if(rows.length&&v.vuil!==0){await rpc('submit_scores',{rows});v.vuil=0;bewaar()}
  if(!v.lsInit){v.lsq=v.lsq||{};Object.entries(S.lvSter||{}).forEach(([l,x])=>{if((x|0)>0&&+l>0)v.lsq[l]=Math.max(v.lsq[l]|0,x|0)});v.lsInit=1}
  const ls=Object.entries(v.lsq||{}).map(([l,x])=>({level:+l,stars:Math.min(3,x|0)})).filter(r=>r.level>0);
  for(let i=0;i<ls.length;i+=400){await rpc('submit_level_stars',{rows:ls.slice(i,i+400)})}
  if(ls.length){ls.forEach(r=>{if((v.lsq[r.level]|0)<=r.stars)delete v.lsq[r.level]});bewaar()}
  try{const fr=await rpc('my_friends');v.fc=(fr||[]).map(x=>({id:x.id,name:x.name,house:x.house,level:x.level|0}));cache.vr=v.fc;bewaar()}catch(e){}
  ST='klaar';await claims();try{halPaneel()}catch(e){}return true}catch(e){fout(e);return false}finally{bezig=null}})();return bezig}
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
/* ---------- schermen: Hal-paneel, levelstart, Vrienden-menu ---------- */
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kroon=(h,w=34)=>{try{return HUIZEN[h]?schild(h,w):`<span class="vrgeenhuis" style="width:${w}px">🎩</span>`}catch(e){return ''}};
const ikRij=()=>({id:mijnId(),name:S.naam,house:S.huis,level:S.m3lvl|0,ik:1});
let cache={vr:null,sc:[]};
const vrLijst=()=>cache.vr||vr().fc||[];
const gereed=()=>AAN&&(ST==='klaar'||ST==='offline'&&!!vr().code||ST==='onbekend'&&!!vr().code);
const sterren=n=>'★'.repeat(n)+'☆'.repeat(Math.max(0,3-n));
const kop=()=>`<div class="mgkop"><img class="mgkopimg vrkopimg" src="img/ui/nav-vrienden-96.webp" alt=""><div><h2 class="mgtitel">Vrienden</h2><p class="mguitleg">Speel samen met vrienden die het spel ook hebben.</p></div></div>`;
const resterend=k=>{const nu=new Date(),eind=new Date(nu);eind.setHours(24,0,0,0);if(k[0]=='w')eind.setDate(eind.getDate()+(6-((nu.getDay()+6)%7)));const u=Math.max(0,Math.round((eind-nu)/36e5));return u<24?`nog ${u} uur`:`nog ${Math.round(u/24)} dagen`};
const uitnodig=(klein)=>`<section class="vruitnodig${klein?' klein':''}"><p>🦉 <b>Nodig je vrienden uit!</b><br>Stuur je vriendcode naar iemand die het spel ook speelt. Dan zie je hier hoe ver jullie zijn.</p><button class="knop volgende" data-naar="vr">Vriend uitnodigen</button></section>`;
const medaille=(plek,heeft)=>heeft?(['🥇','🥈','🥉'][plek-1]||plek+'.'):'·';
function rijen(L,waarde){let plek=0,vorige=null;return L.map((m,i)=>{const w=waarde(m);if(w!==vorige){plek=i+1;vorige=w}return `<li class="${m.ik?'vrik':''}"><span class="vrplek">${medaille(plek,w>0)}</span>${kroon(m.house)}<span class="vrnaam">${esc(m.name||'?')}${m.ik?' (jij)':''}</span><b class="vrscore">${typeof w=='number'?w:''}</b></li>`}).join('')}
function bord(k,vrienden,scores){const ik=mijnId(),v=vr(),b=BEL[k[0]];const mensen=[ikRij(),...vrienden];
 const sc=(id,c)=>((scores.find(r=>r.player_id===id&&r.period_key===k&&r.challenge_id===c)||{}).score|0);
 return kies(k).map(c=>{const u=UIT[c];const L=mensen.map(m=>({...m,s:m.ik?Math.max(((v.sc[k]||{})[c])|0,sc(ik,c)):sc(m.id,c)})).sort((a,z)=>z.s-a.s||(a.ik?-1:z.ik?1:0));
  return `<section class="vrbord"><h3>${u.i} ${u.n}</h3><ol>${rijen(L,m=>m.s)}</ol></section>`}).join('')+
  `<p class="klein vruitleg">⏳ ${resterend(k)}. Na afloop krijg je <b>+${b.mee} Smekkies</b> als je meedeed, en <b>+${b.win}</b> extra voor elke uitdaging waarin je bovenaan staat bij je vrienden.</p>`}
function rangHtml(){const L=[ikRij(),...vrLijst()].sort((a,z)=>z.level-a.level||(a.ik?-1:z.ik?1:0));
 return `<section class="vrbord"><h3>🏆 Wie is het verst?</h3><ol>${rijen(L,m=>m.level|0).replace(/<b class="vrscore">(\d+)<\/b>/g,'<b class="vrscore"><small>level</small> $1</b>')}</ol></section>`+(vrLijst().length?'':uitnodig())}
function vrHtml(){const v=vr(),code=v.code||'······',F=vrLijst();
 return `<section class="vrcode"><p>Jouw vriendcode</p><div class="vrcodeveld">${esc(code)}</div><div class="vrknoppen"><button class="knop" id="vrkopie" ${v.code?'':'disabled'}>📋 Kopiëren</button><button class="knop volgende" id="vrdeel" ${v.code?'':'disabled'}>💬 Delen via WhatsApp</button></div></section>
 <section class="vrnieuw"><label for="vrin">Vriend toevoegen met code</label><div class="vrknoppen"><input id="vrin" maxlength="6" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABC123"><button class="knop volgende" id="vradd">Toevoegen</button></div></section>
 <section class="vrlijst"><h3>Mijn vrienden</h3>${F.length?`<ul>${F.map(f=>`<li>${kroon(f.house)}<span class="vrnaam">${esc(f.name||'?')}</span><span class="vrlv">level ${f.level|0}</span><button class="linkknop vrweg" data-id="${esc(f.id)}" data-n="${esc(f.name)}" aria-label="Verwijderen">✕</button></li>`).join('')}</ul>`:'<p class="klein">Nog geen vrienden. Deel je code met iemand die het spel ook heeft!</p>'}</section>`}
function uitHtml(){const sub=V.samen.sub||'d';return `<div class="vrtabs vrsub"><button class="${sub=='d'?'actief':''}" data-s="d">Vandaag</button><button class="${sub=='w'?'actief':''}" data-s="w">Deze week</button></div>${bord(sub=='d'?dagKey():weekKey(),vrLijst(),cache.sc)}`}
function teken(){const app=$('#app');if(!app||document.body.dataset.view!=='samen')return;
 if(!gereed()){app.innerHTML=`<div class="perkament lijst mgkader vrkader">${kop()}<p class="vrbinnen">🦉 <b>Binnenkort!</b><br>De uilen worden nog getraind. Straks kun je hier vrienden toevoegen, zien wie het verst is en samen uitdagingen spelen.</p><button class="knop" onclick="ga('home')">Terug naar de Hal</button></div>`;return}
 const tab=V.samen.tab||'rang';
 app.innerHTML=`<div class="perkament lijst mgkader vrkader">${kop()}
 ${ST==='offline'?'<p class="klein vrlet">Even geen verbinding. Je voortgang wordt bewaard en later verstuurd.</p>':''}
 <div class="vrtabs vrhoofd"><button class="${tab=='rang'?'actief':''}" data-t="rang">Ranglijst</button><button class="${tab=='uit'?'actief':''}" data-t="uit">Uitdagingen</button><button class="${tab=='vr'?'actief':''}" data-t="vr">Vrienden</button></div>
 ${tab=='rang'?rangHtml():tab=='uit'?uitHtml():vrHtml()}
 <button class="knop" onclick="ga('home')">Terug naar de Hal</button></div>`;
 app.querySelectorAll('.vrhoofd button').forEach(b=>b.onclick=()=>{V.samen.tab=b.dataset.t;teken()});
 app.querySelectorAll('.vrsub button').forEach(b=>b.onclick=()=>{V.samen.sub=b.dataset.s;teken()});
 app.querySelectorAll('[data-naar]').forEach(b=>b.onclick=()=>{V.samen.tab=b.dataset.naar;teken()});
 if(tab!=='vr')return;const v=vr();
 const deelTekst=`Speel je mee in Zweinstein? Open ${LINK} en zet de app op je beginscherm. Voeg mij daarna toe als vriend: tik onderaan op Vrienden → Vrienden en vul mijn code in: ${v.code}`;
 $('#vrkopie').onclick=async()=>{try{await navigator.clipboard.writeText(v.code);toast('Code gekopieerd')}catch(e){prompt('Jouw vriendcode:',v.code)}};
 $('#vrdeel').onclick=async()=>{try{if(navigator.share){await navigator.share({text:deelTekst});return}}catch(e){if(e&&e.name==='AbortError')return}window.open('https://wa.me/?text='+encodeURIComponent(deelTekst),'_blank')};
 const inp=$('#vrin');inp.oninput=()=>{inp.value=inp.value.toUpperCase().replace(/[^A-Z0-9]/g,'')};
 $('#vradd').onclick=async()=>{const c=inp.value.trim();if(c.length!==6){toast('Een vriendcode heeft 6 tekens');return}$('#vradd').disabled=true;
  try{const r=await rpc('add_friend_by_code',{code:c});if(r&&r.ok){toast(`🦉 ${r.name||'Je vriend'} is nu je vriend!`);await laad()}else toast(({zelf:'Dat is je eigen code 🙂',onbekend:'Deze code kennen we niet. Klopt hij?',vol:'Je hebt al heel veel vrienden'})[r&&r.reden]||'Dat lukte niet')}
  catch(e){fout(e);toast('Dat lukte nu niet. Probeer het straks nog eens.')}finally{const b=$('#vradd');if(b)b.disabled=false}};
 app.querySelectorAll('.vrweg').forEach(b=>b.onclick=async()=>{if(!confirm(`${b.dataset.n||'Deze vriend'} verwijderen als vriend?`))return;try{await rpc('remove_friend',{fid:b.dataset.id});await laad()}catch(e){toast('Dat lukte nu niet')}})}
async function laad(){await sync(true);if(ST==='klaar'){try{const [s]=await Promise.all([scoresVan([dagKey(),weekKey()])]);cache={vr:vr().fc||[],sc:s||[]}}catch(e){fout(e)}}teken();toonPop()}
V.samen=(tab)=>{if(tab)V.samen.tab=tab;const app=$('#app');if(!AAN){teken();return}if(!vr().code||ST==='onbekend')app.innerHTML=`<div class="perkament lijst mgkader vrkader">${kop()}<p class="vrbinnen">🦉 De uilen vliegen…</p></div>`;else teken();laad()};
/* Hal: compacte strook */
function halPaneel(){if(!AAN||document.body.dataset.view!=='home'||!S.naam)return;const app=$('#app');if(!app)return;let el=document.getElementById('halvr');
 let html;if(!gereed())html=`<div class="halvrkop"><b>🦉 Vrienden</b><span>Binnenkort</span></div><p class="halvrtekst">Straks speel je hier samen met vrienden.</p>`;
 else{const F=vrLijst();const L=[ikRij(),...F].sort((a,z)=>z.level-a.level||(a.ik?-1:z.ik?1:0)).slice(0,5);
  html=`<div class="halvrkop"><b>🦉 Vrienden</b><span>Alles bekijken ›</span></div><div class="halvrrij">${L.map((m,i)=>`<div class="halvrp${m.ik?' ik':''}"><span class="halvrnr">${F.length?(['🥇','🥈','🥉'][i]||(i+1)+'.'):''}</span>${kroon(m.house,30)}<b>${esc(m.ik?'Jij':(m.name||'?'))}</b><small>level ${m.level|0}</small></div>`).join('')}${F.length?'':`<div class="halvrp nodig"><span class="halvrplus">＋</span><b>Nodig je vrienden uit</b></div>`}</div>`}
 if(!el){el=document.createElement('section');el.id='halvr';el.className='halvr rococo';el.setAttribute('role','button');const voor=app.querySelector('.dagdoelen');if(voor)voor.before(el);else app.appendChild(el);el.onclick=()=>ga('samen',vrLijst().length||!gereed()?'rang':'vr')}
 el.innerHTML=html}
window.zwHalVrienden=halPaneel;
if(V.home){const _h=V.home;V.home=function(...a){const r=_h.apply(this,a);try{halPaneel();setTimeout(halPaneel,50)}catch(e){}return r}}
/* Levelstart: vrienden rond dit level */
const lsCache={};
async function lvSterren(n){if(lsCache[n]&&Date.now()-lsCache[n].t<5*60e3)return lsCache[n].d;const d=(await http('/rest/v1/level_stars?select=player_id,stars&level=eq.'+(n|0)))||[];lsCache[n]={t:Date.now(),d};return d}
function lvBord(n){const voor=document.querySelector('.m3voor');if(!AAN||!voor||!S.naam||document.getElementById('vrlv'))return;
 const el=document.createElement('section');el.id='vrlv';el.className='vrlvbord';
 const plaats=voor.querySelector('.m3doelen-voor');(plaats&&plaats.nextElementSibling)?plaats.nextElementSibling.after(el):voor.appendChild(el);
 const zet=(st)=>{if(!gereed()){el.innerHTML=`<p class="vrlvleeg">🦉 Binnenkort zie je hier hoe ver je vrienden zijn.</p>`;return}
  const F=vrLijst();const ik=mijnId();const mijn=(S.lvSter&&S.lvSter[n])|0;
  const L=[{...ikRij(),stx:mijn},...F.map(f=>({...f,stx:((st||[]).find(r=>r.player_id===f.id)||{}).stars|0}))];
  const kies5=L.filter(m=>!m.ik).sort((a,z)=>Math.abs(a.level-n)-Math.abs(z.level-n)).slice(0,4);const toon=[L[0],...kies5].sort((a,z)=>z.level-a.level||(a.ik?-1:z.ik?1:0));
  const stand=m=>m.level>n?(m.stx?`<span class="vrst">${sterren(m.stx)}</span>`:'<span class="vrst">gehaald ✓</span>'):m.level==n?'<span class="vrnu">speelt dit level</span>':`<span class="vrlvn">bij level ${m.level|0}</span>`;
  el.innerHTML=`<h3>🦉 Vrienden bij level ${n}</h3><ol>${toon.map(m=>`<li class="${m.ik?'vrik':''}">${kroon(m.house,28)}<span class="vrnaam">${esc(m.ik?'Jij':(m.name||'?'))}</span>${stand(m)}</li>`).join('')}</ol>${F.length?'':'<p class="vrlvleeg">Nodig je vrienden uit via <b>Vrienden</b> onderaan, dan zie je wie dit level al gehaald heeft.</p>'}`};
 zet(null);if(gereed()&&vrLijst().length)lvSterren(n).then(st=>{if(el.isConnected)zet(st)}).catch(()=>{})}
if(V.match3){const _m=V.match3;V.match3=async function(n,...a){const r=await _m.call(this,n,...a);try{lvBord(n||S.m3lvl||1)}catch(e){}return r}}
/* Vaste knop in de menubalk (alleen als online is ingesteld) */
if(AAN){try{if(typeof NAV!=='undefined'&&!NAV.some(t=>t[0]==='samen')){const i=NAV.findIndex(t=>t[0]==='meer');NAV.splice(i<0?NAV.length:i,0,['samen','','Vrienden'])}}catch(e){}
 const _nav=nav;nav=function(act,...a){const r=_nav(act,...a);try{const el=document.getElementById('nav');el.classList.toggle('nav6',el.querySelectorAll('button').length>5);const b=el.querySelector('button[onclick="ga(\'samen\')"]');if(b){b.classList.add('glinster');const vak=b.querySelector('.rond');if(vak&&!vak.querySelector('img'))vak.innerHTML='<img class="uiico" alt="" src="img/ui/nav-vrienden-192.webp" decoding="async">';if(act==='samen')b.classList.add('actief')}}catch(e){}return r};
 try{nav(document.body.dataset.view||'home')}catch(e){}
 setTimeout(()=>sync(),2500);setInterval(()=>{if(vr().vuil||Object.keys(vr().lsq||{}).length)sync()},3*60e3);setInterval(()=>sync(),30*60e3);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(()=>sync(),1500)});window.addEventListener('online',()=>sync())}
})();
