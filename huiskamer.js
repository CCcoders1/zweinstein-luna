'use strict';
/* Wekelijkse Huffelpuf-huiskamer: één decoratie per week na een levelwinst.
   Geen schilden, geen tijdsdruk, geen Smekkies. */
(()=>{
const STUK=[
  {id:'stoel',n:'De gele leunstoel',img:'img/huiskamer/hoek.webp',zin:'Een zachte stoel bij de haard. Ga maar zitten, als je wilt.'},
  {id:'kussen',n:'Het gestreepte kussen',img:'img/huiskamer/kussen.webp',zin:'Mosterd en antraciet, met een takje erop geborduurd.'},
  {id:'ketel',n:'De koperen ketel',ico:'🫖',zin:'Altijd een fluitje water klaar, voor als iemand langskomt.'},
  {id:'lamp',n:'De honinglamp',ico:'🏮',zin:'Warm licht, alsof de avond alvast begint.'},
  {id:'kruid',n:'Vensterkruid',ico:'🌿',zin:'Een potje op de vensterbank. Het ruikt naar thuis.'},
  {id:'plaid',n:'De mosterdplaid',ico:'🧶',zin:'Gebreid, een beetje te groot, precies goed.'},
  {id:'vuur',n:'Het haardvuur',ico:'🔥',zin:'Het knettert zacht. Niemand hoeft te haasten.'},
  {id:'kop',n:'De theekop',ico:'☕',zin:'Er blijft altijd een slok over voor een vriendin.'},
  {id:'huisvaan',n:'De huisvaan van Huffelpuf',ico:'💛',zin:'Een gele vaan boven de haard. Jullie hebben hem samen verdiend, in jullie eigen tempo.',huis:1}
];
function weekKey(){
  const d=(typeof zwNu==='function'?zwNu():new Date());
  const x=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
  const dag=x.getUTCDay()||7;
  x.setUTCDate(x.getUTCDate()+4-dag);
  const y0=new Date(Date.UTC(x.getUTCFullYear(),0,1));
  const w=Math.ceil((((x-y0)/864e5)+1)/7);
  return x.getUTCFullYear()+'-W'+String(w).padStart(2,'0');
}
function H(){
  const w=weekKey();
  S.huiskamer=S.huiskamer||{week:'',verdiend:0,wacht:'',geplaatst:[],gehad:[]};
  const h=S.huiskamer;
  if(!Array.isArray(h.geplaatst))h.geplaatst=[];
  if(!Array.isArray(h.gehad))h.gehad=h.geplaatst.slice();
  if(h.week!==w){h.week=w;h.verdiend=0;if(!h.wacht)h.wacht=''}
  return h;
}
function zoek(id){return STUK.find(s=>s.id===id)}
function volgende(){const h=H();return STUK.find(s=>!s.huis&&!h.gehad.includes(s.id))}
function naWinst(){
  try{
    const h=H();
    if(h.verdiend||h.wacht)return;
    const s=volgende();
    if(!s)return;
    h.verdiend=1;h.wacht=s.id;if(typeof bewaar==='function')bewaar();
    setTimeout(()=>{
      if(document.querySelector('.modal,.verhaal'))return;
      if(typeof toast==='function')toast('🛋️ In de huiskamer ligt iets klaar, als je zin hebt.');
    },2000);
  }catch(e){}
}
if(typeof m3Winst==='function'){
  const _w=m3Winst;
  m3Winst=function(n,b){
    const r=_w.apply(this,arguments);
    try{if(b&&!b.sim&&!b._hkWin){b._hkWin=1;naWinst()}}catch(e){}
    return r;
  };
}

function plaats(id){
  const h=H();const s=zoek(id);if(!s)return;
  if(!h.geplaatst.includes(id))h.geplaatst.push(id);
  if(!h.gehad.includes(id))h.gehad.push(id);
  if(h.wacht===id)h.wacht='';
  if(typeof bewaar==='function')bewaar();
}

V.huiskamer=function(){
  const h=H();
  const wacht=h.wacht?zoek(h.wacht):null;
  const klaar=h.gehad.length>=STUK.length;
  const heeftStoel=h.geplaatst.includes('stoel');
  const items=h.geplaatst.map((id,i)=>{
    const s=zoek(id);if(!s||s.id==='stoel')return '';
    const pos=[['14%','60%'],['64%','64%'],['76%','40%'],['16%','26%'],['70%','20%'],['8%','44%'],['48%','34%']][i%7];
    if(s.img)return `<figure class="hkstuk" style="left:${pos[0]};top:${pos[1]}" title="${s.n}"><img src="${s.img}" alt="${s.n}" loading="lazy" width="120" height="160"></figure>`;
    return `<span class="hkstuk hkemo" style="left:${pos[0]};top:${pos[1]}" title="${s.n}">${s.ico||'✨'}<small>${s.n}</small></span>`;
  }).join('');
  const lijst=STUK.map(s=>{
    const er=h.geplaatst.includes(s.id);
    const wait=h.wacht===s.id;
    return `<li class="${er?'heb':wait?'wacht':'dicht'}">${s.ico||'🖼️'} <b>${er||wait?s.n:'Iets voor later'}</b>${wait?' · klaar om neer te zetten':er?'':' · komt in een andere week'}</li>`;
  }).join('');
  app(`<div class="hkscherm"><h1>Huffelpuf-huiskamer</h1>
    <p class="klein">Elke week kun je, als je een level wint, één ding inrichten. Geen haast, en geen schilden: alleen een hoekje dat van jou is.</p>
    <section class="hkamer ${heeftStoel?'metstoel':''}" aria-label="De huiskamer">${heeftStoel?`<img class="hkbg" src="img/huiskamer/hoek.webp" alt="De gele leunstoel bij de haard" loading="lazy" width="560" height="747">`:'<div class="hkbgleeg" aria-hidden="true"></div>'}${items}</section>
    ${wacht?`<section class="kaart rococo hkklaar"><h3>${wacht.ico||'🛋️'} ${wacht.n}</h3><p>${wacht.zin}</p><button type="button" class="knop volgende" id="hkzet">Zet neer in de huiskamer</button></section>`:
      klaar?`<section class="kaart rococo"><p>Je huiskamer is helemaal ingericht. Kom hier gerust nog eens kijken, als je zin hebt.</p></section>`:
      `<section class="kaart rococo"><p>${h.geplaatst.length?((zoek(h.geplaatst[h.geplaatst.length-1])||{}).n||'Iets leuks')+' staat in de huiskamer. Kom gerust nog eens kijken.':h.verdiend?'Voor deze week is er al iets verdiend.':'Win deze week een level, als je wilt. Dan ligt er iets klaar voor de huiskamer.'}</p></section>`}
    <section class="kaart"><h3>In de kamer</h3><ul class="hklijst">${lijst}</ul></section>
    <p><button type="button" class="knop" onclick="ga('home')">Terug naar de Hal</button></p>
  </div>`);
  const kn=document.getElementById('hkzet');
  if(kn)kn.onclick=()=>{plaats(h.wacht);try{if(window.fx&&fx.speel)fx.speel('goed')}catch(e){}V.huiskamer()};
};

function chipHtml(){
  const h=H();
  if(!h.wacht&&!h.geplaatst.length)return '';
  const txt=h.wacht?'Iets staat klaar in de huiskamer':'Huffelpuf-huiskamer';
  return `<button type="button" class="ookchip" id="hkchip">${h.wacht?'🛋️':'🏡'} ${txt}</button>`;
}
function zetChip(){
  if(document.body.dataset.view&&document.body.dataset.view!=='home')return;
  const html=chipHtml();
  let c=document.getElementById('hkchip');
  if(!html){if(c)c.remove();return}
  if(c){c.remove();c=null}
  const rij=document.querySelector('#ookvandaag .ookrij');
  if(rij)rij.insertAdjacentHTML('beforeend',html);
  else{
    const root=document.getElementById('app');if(!root)return;
    const na=document.getElementById('ookvandaag')||document.getElementById('wmkaart')||root.querySelector('.lokaal');
    const wrap=`<section class="ookvandaag" id="ookvandaag"><small>Ook vandaag</small><div class="ookrij">${html}</div></section>`;
    if(na)na.insertAdjacentHTML('afterend',wrap);else root.insertAdjacentHTML('beforeend',wrap);
  }
  c=document.getElementById('hkchip');
  if(c)c.onclick=()=>ga('huiskamer');
}

const _home=V.home;
V.home=function(){const r=_home.apply(this,arguments);try{setTimeout(zetChip,60);setTimeout(zetChip,240)}catch(e){}return r};

const _meer=V.meer;
if(_meer)V.meer=function(){
  const r=_meer.apply(this,arguments);
  try{
    const root=document.getElementById('app');
    if(root&&!document.getElementById('hkmeer')){
      const grid=root.querySelector('.meerblok .raster')||root.querySelector('.raster');
      const btn=`<button type="button" class="tegel knop" id="hkmeer">🏡 <b>Huffelpuf-huiskamer</b></button>`;
      if(grid)grid.insertAdjacentHTML('afterbegin',btn);
      else root.insertAdjacentHTML('beforeend',btn);
      const b=document.getElementById('hkmeer');if(b)b.onclick=()=>ga('huiskamer');
    }
  }catch(e){}
  return r;
};
})();
