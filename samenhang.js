/* ====== v133 Samenhang: Volgende stap, ochtendpost, album-series ====== */
(function(){
'use strict';
def('serieBel',{});
const TITEL={Tovenaars:'Kenner van de Tovenaars',Heksen:'Kenner van de Heksen',Beesten:'Vriend van de Beesten',Draken:'Drakenkenner',Reuzen:'Reuzenkundige',Kobolden:'Koboldenkundige',Vampiers:'Vampierdeskundige',Zwerkbal:'Zwerkbalverzamelaar',Bonus:'Erekandidaat van het album'};

function series(){
  const namen=(typeof KAARTSERIES!=='undefined'&&KAARTSERIES)||window.KAARTSERIES||[];
  const alle=(typeof KAARTEN!=='undefined'&&KAARTEN)||window.KAARTEN||[];
  return namen.map(n=>{
    const kaarten=alle.filter(k=>k[4]===n);
    const heb=kaarten.filter(k=>S.kaarten&&S.kaarten[k[0]]);
    return {naam:n,kaarten,heb,klaar:kaarten.length>0&&heb.length===kaarten.length};
  });
}
function serieBeloon(s,opt={}){
  if(!s||!s.klaar||(S.serieBel||{})[s.naam])return false;
  S.serieBel=S.serieBel||{};S.serieBel[s.naam]=1;
  S.titels=S.titels||[];if(!S.titels.includes(TITEL[s.naam]||s.naam))S.titels.push(TITEL[s.naam]||s.naam);
  bewaar();
  let zaad='';
  try{if(window.zeldzaamZaad){const z=zeldzaamZaad('album',{stil:1});zaad=z&&z.naam?z.naam:(z||'');}}catch(e){}
  const titel=TITEL[s.naam]||s.naam;
  if(!opt.stil){
    const zin=zaad?`Tilly: “Een complete serie ${s.naam.toLowerCase()}! Je bent nu ${titel}. En kijk, er lag een zeldzaam zaadje bij.”`:`Tilly: “Een complete serie ${s.naam.toLowerCase()}! Je bent nu ${titel}.”`;
    try{verhaal([['Tilly',zin]],()=>{try{fx.speel('fanfare')}catch(e){}})}catch(e){try{toast('Serie '+s.naam+' compleet: '+titel)}catch(x){}}
  }
  return true;
}
window.serieNaKaart=function(nieuw){
  try{
    if(!nieuw&&window.ampulGeef)ampulGeef(3);
    series().forEach(s=>serieBeloon(s));
  }catch(e){console.warn(e)}
};

/* ---------- album met foto's en series ---------- */
const albumOud=V.album;
V.album=function(){
  const lijst=series();
  const alle=(typeof KAARTEN!=='undefined'&&KAARTEN)||window.KAARTEN||[];const totaal=alle.length,hebN=Object.keys(S.kaarten||{}).length;
  const blok=lijst.map(s=>{
    const bel=(S.serieBel||{})[s.naam];
    const kop=`<div class="aserkop"><h3>${s.naam}</h3><small>${s.heb.length}/${s.kaarten.length}${s.klaar?' · Compleet':''}${bel?' · '+(TITEL[s.naam]||''):''}</small></div>`;
    const kaarten=s.kaarten.map(k=>{
      const h=S.kaarten[k[0]]||0;
      const foto=h&&k[3]?`<img src="${k[3]}" alt="${k[0]}" loading="lazy">`:(h?k[0].split(' ').map(w=>w[0]).join(''):'?');
      return `<div class="akaart ${h?'heb r'+k[1]:''}" title="${h?(k[2]||k[0]).replace(/"/g,''):'Nog niet gevonden'}"><div class="kfoto">${foto}</div><b>${h?k[0]:'???'}</b><small>${h>1?'×'+h:h?'&nbsp;':'nog te vinden'}</small></div>`;
    }).join('');
    return `<section class="aserie ${s.klaar?'compleet':''}">${kop}<div class="album">${kaarten}</div></section>`;
  }).join('');
  app(`<h1>Kaartenalbum</h1><p>${hebN} van ${totaal} kaarten verzameld. Een complete serie geeft een titel, een korte scène en een zeldzaam zaadje. Dubbele kaarten worden toverpoeder voor de elfjes.</p>${blok}<p class="klein">Kaarten vind je in kistjes in de levels, als mijlpaal bij elk 10e level, als cadeau, in de bonuskamer en in Hagrids pompoenen.</p>`);
  try{lijst.forEach(s=>serieBeloon(s))}catch(e){}
};

/* ---------- ochtendpost: uilenbrief + dagbeloning ---------- */
const POSTREGELS=(typeof POST!=='undefined'&&POST)?POST:[['Tilly','Er kwam een uil voor je, Luna!']];
function postVerhaal(){
  try{
    const stage=typeof schoolDag==='function'?schoolDag():null;
    const dag=stage&&stage.inhoud?stage.inhoud.titel:'je schooldag';
    const basis=POSTREGELS[Math.floor(Date.now()/864e5)%POSTREGELS.length];
    const extra=stage?` Vandaag staat “${dag}” op het programma.`:'';
    let zin=basis[1]||'';zin=zin.replace(/\s*Er zaten 10 Smekkies bij\.?/gi,'').replace(/\s*Er zitten 10 Smekkies bij[,.]?/gi,'').replace(/\s*En hij stuurt 10 Smekkies mee\.?/gi,'').replace(/\s*alleen 10 glinsterende Smekkies en de woorden:/gi,' de woorden:').replace(/\s*en de kaart danst nog steeds een beetje\.?/gi,'.').trim();return [basis[0], zin+extra];
  }catch(e){return POSTREGELS[0]}
}
function uilenpostDue(){
  const nu=Date.now();
  if(!S.uilenpost){S.uilenpost=nu;bewaar();return false}
  return nu-S.uilenpost>=2*864e5;
}
function volgendeZin(){
  try{
    const s=volgendeStap({geenPost:true});
    return s?s.tekst:'';
  }catch(e){return ''}
}

const loginOud=V.login;
V.login=function(){
  const L=S.login||{dag:0,laatst:''};
  const geclaimd=L.laatst===vandaag();
  const d=geclaimd?(L.dag+6)%7:L.dag%7;
  if(document.querySelector('.modal[data-pop=login],.modal[data-pop=ochtend]'))return;
  const uil= !geclaimd && uilenpostDue();
  const LOGINLIJST=typeof LOGIN!=='undefined'?LOGIN:[['15 Smekkies',{g:15}]];const bel=LOGINLIJST[d];
  const [wie,zin]=postVerhaal();
  const volg=volgendeZin();
  const o=document.createElement('div');o.className='modal';o.dataset.pop='ochtend';
  o.innerHTML=`<div class="perkament modalin rococo ochtendpost">
    <p class="klein ochtenduil">Uilenpost</p>
    <h2>Ochtendpost</h2>
    <p><b>${wie}:</b> ${zin}</p>
    ${geclaimd?'':`<p class="opcadeau">Vandaag in je brief: <b>${bel[0]}</b>${uil?' en <b>10 extra Smekkies</b> van de uilenpost':''}.</p>`}
    <div class="kalender">${LOGINLIJST.map((x,i)=>{const b=x[1]||{};const kort=b.t?'⏳ +30':b.k?'🐸 +1':'15';return `<div class="kdag ${i<d||geclaimd&&i==d?'gehad':''} ${i==d&&!geclaimd?'nu':''}"><small>Dag ${i+1}</small><b>${kort}</b></div>`}).join('')}</div>
    <p class="klein">Tijdverdrijvers: ${S.tijdverdrijver||0} – bewaart je reeks als je één dag mist.</p>
    ${volg&&!geclaimd?`<p class="opvolg">Daarna: ${volg}</p>`:''}
    <button class="knop volgende" id="claim">${geclaimd?'Sluiten':'Brief openen'}</button>
  </div>`;
  document.body.appendChild(o);
  o.querySelector('#claim').onclick=()=>{
    try{
      if(!geclaimd&&L.laatst!==vandaag()){
        const b=bel[1];
        if(b.g)S.galjoenen=(S.galjoenen|0)+b.g;
        if(b.k&&window.kikkerKrijg)kikkerKrijg(1,{wacht:900});
        if(b.t)S.tijdverdrijver=(S.tijdverdrijver|0)+1;
        L.dag=d+1;L.laatst=vandaag();
        if(uil){S.galjoenen=(S.galjoenen|0)+10;S.uilenpost=Date.now()}
        bewaar();
      }
    }catch(x){console.warn(x)}
    try{stats();fx.speel('munt');fx.goed();vib([30,30,60])}catch(x){}
    try{popupSluit?popupSluit(o):o.remove()}catch(e){o.remove()}
  };
};

const loginCheckOud=window.loginCheck||loginCheck;
loginCheck=function(){
  const L=S.login||(S.login={dag:0,laatst:''});if(L.laatst===vandaag()||window._loginGepland===vandaag())return;window._loginGepland=vandaag();
  if(L.laatst&&L.laatst!==gisteren()){const gemist=Math.round((new Date(vandaag())-new Date(L.laatst))/864e5)-1;
    if(gemist==1&&S.tijdverdrijver>0){S.tijdverdrijver--;toast('Je Tijdverdrijver draaide de tijd terug: je reeks is bewaard!');if(S.dagKlaar===ymd(new Date(Date.now()-2*864e5)))S.dagKlaar=gisteren()}else{L.dag=0}}
  if(!L.laatst)return; /* eerste bezoek: Volgende stap wijst naar de brief, Spelen blijft zichtbaar */
  setTimeout(()=>V.login(),(typeof RMX!=='undefined'&&RMX)?200:1400);
};
window.loginCheck=loginCheck;

const uilOud=window.uilenpostCheck||(typeof uilenpostCheck==='function'?uilenpostCheck:null);
uilenpostCheck=function(){
  if(S.login&&S.login.laatst!==vandaag())return; // ochtendpost neemt het mee
  if(!uilenpostDue())return;
  const nu=Date.now();S.uilenpost=nu;S.galjoenen=(S.galjoenen|0)+10;bewaar();try{stats()}catch(e){};
  const [w,t]=postVerhaal();
  setTimeout(()=>verhaal([[w,t+' Er zaten 10 Smekkies bij.']]),700);
};
window.uilenpostCheck=uilenpostCheck;

/* ---------- één duidelijke volgende stap in de Hal ---------- */
function volgendeStap(opt){
  try{
    opt=opt||{};
    if(!opt.geenPost&&S.login&&S.login.laatst!==vandaag()){
      return {id:'post',titel:'Je ochtendpost is er',tekst:'Er ligt een uilenbrief voor je, met een cadeautje en het plan voor vandaag.',knop:'Open de brief',ga:()=>V.login()};
    }
    if(window.leraarPoort){const p=leraarPoort();if(p)return {id:'poort',titel:'Eerst deze opdracht',tekst:p.titel+(p.prof?(' · '+p.prof):''),knop:p.titel,ga:()=>ga('leraarpoort')}}
    const stage=typeof schoolDag==='function'?schoolDag():null;
    if(stage&&stage.v&&stage.v.taken){
      const vol=stage.v.taken.find(t=>!S.taken[t[0]]);
      const af=stage.v.taken.filter(t=>S.taken[t[0]]).length;
      if(vol){
        if((S.schilden|0)>=vol[2])return {id:'doel',titel:'Volgende hersteldoel',tekst:`“${vol[1]}” · ${vol[2]} huisschilden. Daarna speel je verder.`,knop:vol[1],ga:()=>{const b=document.getElementById('taakknop');b?b.click():ga('home')}};
        const nodig=vol[2]-(S.schilden|0);
        return {id:'level',titel:'Speel level '+(S.m3lvl||1),tekst:`Nog ${nodig} ${nodig===1?'huisschild':'huisschilden'} voor “${vol[1]}”.`,knop:'Spelen · Level '+(S.m3lvl||1),ga:()=>ga('match3')};
      }
      if((S.m3lvl||1)<=stage.einde)return {id:'level',titel:'Maak de schooldag af',tekst:`De tien doelen zijn klaar. Win level ${S.m3lvl} (de dag loopt tot ${stage.einde}).`,knop:'Spelen · Level '+(S.m3lvl||1),ga:()=>ga('match3')};
    }
    return {id:'level',titel:'Speel verder',tekst:'Level '+(S.m3lvl||1)+' wacht.',knop:'Spelen · Level '+(S.m3lvl||1),ga:()=>ga('match3')};
  }catch(e){return {id:'level',titel:'Speel verder',tekst:'',knop:'Spelen',ga:()=>ga('match3')}}
}

const homeOud=V.home;
V.home=function(...a){
  const r=homeOud.apply(this,a);
  try{
    if(document.body.dataset.view&&document.body.dataset.view!=='home')return r;
    const app=document.getElementById('app');if(!app||document.getElementById('volgendestap'))return r;
    const s=volgendeStap();if(!s)return r;
    const kaart=`<section class="volgestap rococo" id="volgendestap"><small>Volgende stap</small><h3>${s.titel}</h3><p>${s.tekst}</p><button type="button" class="knop volgende" id="stapknop">${s.knop}</button></section>`;
    const anker=app.querySelector('#halharten')||app.querySelector('.groet')||app.querySelector('.harten');
    if(anker)anker.insertAdjacentHTML('afterend',kaart);
    else app.insertAdjacentHTML('afterbegin',kaart);
    const kn=document.getElementById('stapknop');if(kn)kn.onclick=s.ga;
    /* één gouden pols: de stapkaart, niet alle banners tegelijk */
    app.querySelectorAll('#nieuwles,#bkhal,#halspreuk,.meerfg').forEach(b=>b.classList.remove('volgende'));
  }catch(e){console.warn(e)}
  return r;
};

/* Meer-menu: Dagbeloning heet nu Ochtendpost */
document.addEventListener('click',e=>{/* no-op, label is patched below */},true);
const meerOud=V.meer;
V.meer=function(...a){
  const r=meerOud.apply(this,a);
  try{
    document.querySelectorAll('#app .tegel, #app button').forEach(t=>{
      if(/Dagbeloning/.test(t.textContent||'')){t.innerHTML=t.innerHTML.replace('Dagbeloning','Ochtendpost');t.onclick=()=>V.login()}
    });
  }catch(e){}
  return r;
};
})();
