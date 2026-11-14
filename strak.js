'use strict';
/* v138: grotere tekst, Hal-meting, instellingen */
(()=>{
function zetTekst(aan){
  const v=!!aan;
  try{S.groteTekst=v;if(typeof bewaar==='function')bewaar()}catch(e){}
  document.documentElement.classList.toggle('groottekst',v);
  if(document.body)document.body.classList.toggle('groottekst',v);
}
function leesTekst(){
  try{
    if(typeof S!=='undefined'&&S&&S.groteTekst)return true;
    const ruw=JSON.parse(localStorage.getItem('zweinstein_v1')||'{}');
    return !!ruw.groteTekst;
  }catch(e){return false}
}
zetTekst(leesTekst());
addEventListener('DOMContentLoaded',()=>zetTekst(leesTekst()));
if(typeof stats==='function'){
  const _st=stats;
  stats=function(){
    const keep=[...document.body.classList].filter(c=>c!=='huis-geen'&&!/^huis-/.test(c));
    const r=_st.apply(this,arguments);
    keep.forEach(c=>document.body.classList.add(c));
    if(leesTekst()){document.documentElement.classList.add('groottekst');document.body.classList.add('groottekst')}
    return r;
  };
}


function instellingIn(sel){
  const host=document.querySelector(sel)||document.querySelector('#app .perkament')||document.getElementById('app');
  if(!host||document.getElementById('grootvak'))return;
  const vak=document.createElement('section');
  vak.id='grootvak';vak.className='kaart rococo';
  vak.innerHTML='<label class="grootlabel" for="gpgroot"><input type="checkbox" id="gpgroot"> <span>Grotere tekst</span></label><p class="klein">Letters en knoppen worden groter. Fijn als je de tekst liever wat ruimer ziet.</p>';
  const h=host.querySelector('h2');
  if(h){h.textContent='Geluid en weergave';h.insertAdjacentElement('afterend',vak)}
  else host.insertAdjacentElement('afterbegin',vak);
  const box=document.getElementById('gpgroot');
  if(box){box.checked=leesTekst();box.onchange=()=>zetTekst(box.checked)}
}

function wrap(n){
  const oud=V[n];if(!oud)return;
  V[n]=function(){const r=oud.apply(this,arguments);try{instellingIn('#app')}catch(e){}return r};
}
wrap('geluid');wrap('geluidstap');

const _meer=V.meer;
if(_meer)V.meer=function(){
  const r=_meer.apply(this,arguments);
  try{
    const b=document.getElementById('meergp');
    if(b){b.textContent='🔊 Geluid en weergave';b.onclick=()=>ga('geluid')}
    document.querySelectorAll('#app button,#app .tegel').forEach(el=>{
      if(/Geluiden toevoegen/.test(el.textContent||'')){
        const bb=el.querySelector('b');if(bb)bb.textContent='Geluid en weergave';
        else if(!el.querySelector('b')){/* knoptekst */}
      }
    });
  }catch(e){}
  return r;
};

/* Meet of Spelen en Volgende stap boven de vouw staan (voor tests). */
window.zwHalBovenVouw=function(){
  const nav=document.getElementById('nav');
  const vouw=(nav?nav.getBoundingClientRect().top:innerHeight);
  const ids=['volgendestap','speelknop'];
  const uit={};
  ids.forEach(id=>{
    const el=document.getElementById(id);
    if(!el){uit[id]={aanwezig:false};return}
    const r=el.getBoundingClientRect();
    uit[id]={aanwezig:true,top:Math.round(r.top),bottom:Math.round(r.bottom),boven:r.bottom<=vouw-4};
  });
  uit.vouw=Math.round(vouw);
  return uit;
};
})();
