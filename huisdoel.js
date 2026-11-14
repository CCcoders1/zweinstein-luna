/* Wekelijks Huffelpuf-huisdoel voor de echte spelers.
   Hergebruikt challenge_scores + submit_scores (challenge_id huis / huispomp).
   Beloning: titel, huiskamerdecoratie of albumkaart. Geen schilden, geen druk. */
(function(){
const TITEL='Huisgezel van Huffelpuf';
const DECO='huisvaan';
const KAART=['De gezamenlijke haard','Z','Een gele vaan boven de haard in de Huffelpuf-huiskamer. Jullie hebben hem samen verdiend, in jullie eigen tempo.','img/huiskamer/hoek.webp','Huis van Huffelpuf'];

function weekKey(){
  if(typeof zwWeekKey==='function')return zwWeekKey();
  const d=typeof zwNu==='function'?zwNu():new Date();
  const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
  t.setUTCDate(t.getUTCDate()+3-((t.getUTCDay()+6)%7));
  const j=t.getUTCFullYear();
  const w=Math.ceil(((t-Date.UTC(j,0,1))/864e5+1)/7);
  return 'w-'+j+'-W'+String(w).padStart(2,'0');
}
function hash(s){let h=7;for(const c of s)h=(Math.imul(h,31)+c.charCodeAt(0))>>>0;return h}
function doelVan(k){
  if(hash(k)%2===0)return {id:'huis',n:'sterren',eenheid:'sterren',doel:24,ico:'⭐',zin:'Samen sterren verzamelen, in jullie eigen tempo.'};
  return {id:'huispomp',n:"pompoen- of sneeuwvlokcombi's",eenheid:"combi's",doel:12,ico:'🎃',zin:'Elke speciale combi telt, ook van een vriend. Geen haast.'};
}
function H(){
  S.huisdoel=S.huisdoel||{kl:{}};
  if(!S.huisdoel.kl)S.huisdoel.kl={};
  return S.huisdoel;
}
function tel(ch,n){
  if(!(n>0))return;
  if(typeof zwTel==='function')zwTel(ch,n);
  else{
    S.vr=S.vr||{sc:{},kl:{}};
    const k=weekKey();
    const o=S.vr.sc[k]=S.vr.sc[k]||{};
    o[ch]=(o[ch]|0)+n;S.vr.vuil=1;
  }
}
function lokaal(id){
  try{return ((S.vr&&S.vr.sc&&S.vr.sc[weekKey()])||{})[id]|0}catch(e){return 0}
}

if(typeof m3Winst==='function'){
  const _w=m3Winst;
  window.m3Winst=m3Winst=function(n,b){
    const r=_w.apply(this,arguments);
    try{
      if(b&&!b.sim&&!b._hdWin&&document.body.dataset.view!=='maker'){
        b._hdWin=1;
        const st=typeof sterVan==='function'?sterVan(b,n):((S.lvSter&&S.lvSter[n])|0);
        if(st>0)tel('huis',st);
      }
    }catch(e){}
    return r;
  };
}

let p0=null,w0=null;
function kijkCombi(){
  try{
    if(document.body.dataset.view==='maker'){p0=null;w0=null;return}
    const p=((S.pomp&&S.pomp.g)||[]).reduce((a,b)=>a+(b|0),0);
    const w=(S.wm&&S.wm.tot)|0;
    if(p0==null){p0=p;w0=w;return}
    const dp=p-p0,dw=w-w0;
    if(dp>0&&dp<=6)tel('huispomp',dp);
    if(dw>0&&dw<=12)tel('huispomp',dw);
    p0=p;w0=w;
  }catch(e){}
}
setInterval(kijkCombi,2000);

async function stand(){
  const k=weekKey(),D=doelVan(k),mijn=lokaal(D.id);
  let som=mijn,anderen=0,net=0,rls=1;
  try{
    if(typeof zwScoresVan==='function'&&typeof zwOnlineStatus==='function'&&zwOnlineStatus()==='klaar'){
      const rows=await zwScoresVan([k]);
      const ik=typeof zwMijnId==='function'?zwMijnId():null;
      const huis=(rows||[]).filter(r=>r.period_key===k&&r.challenge_id===D.id);
      const mijner=huis.filter(r=>r.player_id===ik);
      const rest=huis.filter(r=>r.player_id!==ik);
      if(mijner.length)som=Math.max(som,mijner.reduce((a,r)=>a+(r.score|0),0));
      if(rest.length){anderen=rest.reduce((a,r)=>a+(r.score|0),0);som=som+anderen;net=1}
      else if(ik&&huis.length&&huis.every(r=>r.player_id===ik))rls=0;
    }
  }catch(e){rls=0}
  return {k,D,mijn,som,anderen,net,rls,klaar:som>=D.doel};
}

function geefBeloning(st){
  const h=H();
  if(h.kl[st.k])return;
  h.kl[st.k]=1;
  S.titels=Array.isArray(S.titels)?S.titels:[];
  const nieuwTitel=!S.titels.includes(TITEL);
  if(nieuwTitel)S.titels.push(TITEL);
  try{
    S.huiskamer=S.huiskamer||{week:'',verdiend:0,wacht:'',geplaatst:[],gehad:[]};
    const hk=S.huiskamer;
    if(!Array.isArray(hk.geplaatst))hk.geplaatst=[];
    if(!Array.isArray(hk.gehad))hk.gehad=[];
    if(!hk.geplaatst.includes(DECO)&&!hk.gehad.includes(DECO))hk.wacht=hk.wacht||DECO;
  }catch(e){}
  let nieuwKaart=0;
  try{
    if(typeof META==='object'&&META)META[KAART[0]]=[KAART[3],KAART[4]];
    if(typeof KAARTEN!=='undefined'&&!KAARTEN.some(x=>x[0]===KAART[0])){
      KAARTEN.push([KAART[0],KAART[1],KAART[2],KAART[3],KAART[4],1]);
      if(window.KAARTSERIES&&!KAARTSERIES.includes(KAART[4]))KAARTSERIES.push(KAART[4]);
    }
    S.kaarten=S.kaarten||{};
    nieuwKaart=!S.kaarten[KAART[0]];
    S.kaarten[KAART[0]]=(S.kaarten[KAART[0]]|0)+1;
    try{window.serieNaKaart&&serieNaKaart(nieuwKaart)}catch(e){}
  }catch(e){}
  try{bewaar()}catch(e){}
  setTimeout(()=>{
    try{
      const stuk=nieuwTitel?('de titel “'+TITEL+'”'):(nieuwKaart?'een kaart in je album':'een klein aandenken in de huiskamer');
      if(typeof toast==='function')toast('💛 Samen gehaald. Jullie krijgen '+stuk+'.');
    }catch(e){}
  },1200);
}

function tekst(st){
  const D=st.D,p=Math.min(100,Math.round(st.som/Math.max(1,D.doel)*100));
  const rest=Math.max(0,D.doel-st.som);
  if(st.klaar)return {kop:'💛 Huffelpuf-huisdoel',zin:'Samen gehaald. Wat fijn dat jullie dit samen deden.',p:100};
  let wie;
  if(st.net&&st.anderen)wie='Jullie hebben samen '+st.som+' van de '+D.doel+' '+D.eenheid+'.';
  else if(st.mijn)wie='Jij hebt al '+st.mijn+' '+D.eenheid+'. Samen streven jullie naar '+D.doel+'.'+(st.rls===0?' Als je vrienden ook spelen, komt hun aandeel erbij zodra het verbonden is.':'');
  else wie='Samen '+D.doel+' '+D.eenheid+' deze week, in jullie eigen tempo.';
  const staart=rest?(' Nog '+rest+', als jullie zin hebben.'):'';
  return {kop:'💛 Huffelpuf-huisdoel deze week',zin:D.ico+' '+D.zin+' '+wie+staart,p};
}

function teaserHtml(st,compact){
  const t=tekst(st);
  const zin=compact?(st.klaar?'💛 Samen gehaald. Wat fijn.':(st.D.ico+' Samen '+st.som+' van '+st.D.doel+' '+st.D.eenheid+'. Geen haast.')):t.zin;
  return `<section class="huisdoel" id="huisdoel" aria-label="Huffelpuf-huisdoel"><div class="hdkop"><b>${t.kop}</b></div><p class="hdzin">${zin}</p><div class="hdbalk" role="progressbar" aria-valuenow="${t.p}" aria-valuemin="0" aria-valuemax="100"><i style="width:${t.p}%"></i></div></section>`;
}

let bezig=0,wacht=0;
async function teken(){
  if(document.body.dataset.view!=='home'||!S.naam)return;
  if(bezig){wacht=1;return}
  bezig=1;
  try{
    const st=await stand();
    if(st.klaar)geefBeloning(st);
    const hal=document.getElementById('halvr');
    if(!hal)return;
    const compact=hal.classList.contains('rgkort');
    const html=teaserHtml(st,compact);
    let el=document.getElementById('huisdoel');
    if(!el){
      el=document.createElement('div');
      hal.appendChild(el);
    }else if(el.parentElement!==hal){
      hal.appendChild(el);
    }
    if(el.outerHTML!==html){
      const tmp=document.createElement('div');tmp.innerHTML=html;
      const nw=tmp.firstElementChild;
      el.replaceWith(nw);
    }
    const over=document.getElementById('rgover');
    if(over&&!over.querySelector('#huisdoelover')){
      const full=teaserHtml(st,false).replace('id="huisdoel"','id="huisdoelover"');
      const kop=over.querySelector('.rgoverkop');
      if(kop)kop.insertAdjacentHTML('afterend',full);
    }
  }catch(e){}
  finally{bezig=0;if(wacht){wacht=0;setTimeout(teken,0)}}
}
window.zwHuisTeken=teken;

const _hal=typeof window.zwHalVrienden==='function'?window.zwHalVrienden:null;
if(_hal)window.zwHalVrienden=function(){const r=_hal.apply(this,arguments);try{teken()}catch(e){}return r};
if(V.home){
  const _h=V.home;
  V.home=function(){const r=_h.apply(this,arguments);setTimeout(()=>{try{teken()}catch(e){}},80);return r};
}
setTimeout(()=>{try{teken()}catch(e){}},700);
setInterval(()=>{try{if(document.body.dataset.view==='home')teken()}catch(e){}},60e3);
})();
