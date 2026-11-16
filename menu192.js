'use strict';
/* v192: levendiger Hal, Kaart en Meer; grote duidelijke knoppen */
(()=>{
  const RMP=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const VAKKLEUR={herbologie:'kruid',bezweringen:'goud',toverdranken:'ketel',gedaante:'lila',astronomie:'nacht',verweer:'steen'};
  const TEGEL={
    'Dagboek':['boek','#c9a227'],
    'Luna’s dagboek':['boek','#c9a227'],
    'Dagbeloning':['zon','#e08a2a'],
    'Ochtendpost':['uil','#e08a2a'],
    'Opdrachten':['lijst','#3d8cff'],
    'Badges':['ster','#c9a227'],
    'Ontwikkeling':['hoed','#c9a227'],
    'Kaartenalbum':['boek','#7a5ad4'],
    'Album':['boek','#7a5ad4'],
    'Afdelingsbeker':['beker','#c9a227'],
    'Ketel':['ketel','#3a8a4a'],
    'Fopshop':['fop','#d45a8a'],
    'Kruidenwinkel':['blad','#3a8a4a'],
    'Moestuin':['blad','#3a8a4a'],
    'Vrienden':['hart','#d45a8a'],
    'Spreuklessen':['staf','#7a5ad4'],
    'Huiskamer':['huis','#c9a227'],
    'Geluid':['klok','#3d8cff'],
    'Voortgang':['kist','#8a5a2b']
  };

  function vakId(){
    try{return (typeof m3VakVoor==='function'&&m3VakVoor((S.m3lvl||1)).thema)||'herbologie'}catch(e){return 'herbologie'}
  }
  function halSfeer(){
    const app=document.getElementById('app');
    if(!app||(document.body.dataset.view||'')!=='home')return;
    app.classList.add('hal192');
    document.body.classList.add('hal192');
    const vak=vakId();
    app.dataset.halvak=vak;
    const groet=app.querySelector('.groet');
    if(groet&&!groet.querySelector('.halbanner-bg')){
      groet.classList.add('halbanner');
      const uur=new Date().getHours();
      groet.dataset.tijd=uur<6?'nacht':uur<12?'ochtend':uur<18?'middag':'avond';
      groet.insertAdjacentHTML('afterbegin','<i class="halbanner-bg" aria-hidden="true"></i>');
    }
    const stap=document.getElementById('volgendestap');
    if(stap){
      stap.classList.add('halstap');
      const kn=stap.querySelector('#stapknop,.knop');
      if(kn)kn.classList.add('knop-groot');
    }
    const lok=app.querySelector('.lokaal');
    if(lok){
      lok.classList.add('hallokaal','lok-'+vak);
      if(!lok.querySelector('.lokbeeld')){
        const ls=(typeof m3VakVoor==='function'&&m3VakVoor(S.m3lvl||1).ls)||vak;
        const kop=lok.querySelector('.lk-kop');
        const strip=document.createElement('div');
        strip.className='lokbeeld';
        strip.style.backgroundImage="url('img/laadschermen/"+(ls||'herbologie')+"-klein.webp')";
        if(kop)kop.before(strip);else lok.insertBefore(strip,lok.firstChild);
      }
      const speel=lok.querySelector('#speelknop, #taakknop');
      if(speel)speel.classList.add('knop-groot');
    }
    const tuin=document.getElementById('tuinknop');
    if(tuin){tuin.classList.add('haltuin','knop-groot')}
    const ook=document.getElementById('ookvandaag');
    if(ook){
      ook.classList.add('halook');
      [...ook.querySelectorAll('.ookchip,.knop,button')].forEach((b,i)=>b.style.setProperty('--chip',String(i%4)));
    }
    const dd=app.querySelector('.dagdoelen');
    if(dd)dd.classList.add('haldoelen');
    const hs=app.querySelector('.halspel');
    if(hs)hs.classList.add('halspellen');
    const vr=document.getElementById('halvr')||app.querySelector('.halvr');
    if(vr)vr.classList.add('halrang');
  }

  function meerSfeer(){
    const app=document.getElementById('app');
    if(!app||(document.body.dataset.view||'')!=='meer')return;
    app.classList.add('meer192');
    document.body.classList.add('meer192');
    const kop=app.querySelector('#meerkop,h1.pagkop,h1');
    if(kop&&!kop.querySelector('.meerkop-bg')){
      kop.classList.add('meer-koph');
      kop.insertAdjacentHTML('afterbegin','<i class="meerkop-bg" aria-hidden="true"></i>');
    }
    app.querySelectorAll('.meerblok').forEach(sec=>{
      const titel=((sec.querySelector('h3')||{}).textContent||'').trim();
      const slug=titel.toLowerCase().replace(/[^a-z]+/g,'-').replace(/^-|-$/g,'')||'blok';
      sec.classList.add('meer192-blok','meer-'+slug);
      if(!sec.querySelector('.meerblok-ico')){
        const ico=document.createElement('i');ico.className='meerblok-ico';ico.setAttribute('aria-hidden','true');
        const h=sec.querySelector('h3');if(h)h.prepend(ico);
      }
    });
    app.querySelectorAll('.meerblok .tegel, .meerblok button.knop').forEach(el=>{
      el.classList.add('meer-tegel','knop-groot');
      const ruw=((el.querySelector('b')||el).textContent||'').replace(/\s+/g,' ').trim();
      let thema='algemeen';
      for(const [naam,val] of Object.entries(TEGEL)){
        if(ruw.includes(naam)){thema=val[0];break}
      }
      el.dataset.tegel=thema;
    });
  }

  const PADZIN={
    herbologie:'De kas is open. De planten wachten al.',
    bezweringen:'Een veer trilt boven de lessenaar.',
    toverdranken:'De ketels tikken zacht, klaar voor de les.',
    gedaante:'Een theekopje piept. Of was het een muis?',
    astronomie:'Boven de toren is de lucht even stiller.',
    verweer:'De kast bromt, maar jij mag rustig ademhalen.'
  };
  function padSfeer(){
    const app=document.getElementById('app');
    if(!app)return;
    const view=document.body.dataset.view||'';
    if(view&&view!=='pad')return;
    if(!app.querySelector('.vakbalk,.padkopbeeld,.pad'))return;
    app.classList.add('pad192');
    document.body.classList.add('pad192');
    const vak=document.querySelector('.pad.thema')?(document.querySelector('.pad').className.match(/thema-([a-z]+)/)||[])[1]:vakId();
    if(vak)app.dataset.padvak=vak;
    const kop=app.querySelector('.padkopbeeld');
    if(kop){
      kop.classList.add('pad192-kop');
      if(!kop.querySelector('.padkop-zin')){
        const p=document.createElement('p');p.className='padkop-zin';
        p.textContent=PADZIN[vak]||'Kies een level en speel verder.';
        const box=kop.querySelector('div');if(box)box.appendChild(p);else kop.appendChild(p);
      }
    }
    app.querySelectorAll('.pv').forEach(b=>{
      const id=b.dataset.v;if(id)b.classList.add('pv-'+id);
    });
    const pad=app.querySelector('.pad');
    if(pad)pad.classList.add('pad192-pad');
  }

  function zet(fn){try{fn()}catch(e){console.warn(e)}[80,200,450].forEach(t=>setTimeout(()=>{try{fn()}catch(e){}},t))}

  const _home=V.home;
  if(_home)V.home=function(){const r=_home.apply(this,arguments);zet(halSfeer);return r};
  const _meer=V.meer;
  if(_meer)V.meer=function(){const r=_meer.apply(this,arguments);zet(meerSfeer);return r};
  const _pad=V.pad;
  if(_pad)V.pad=function(){const r=_pad.apply(this,arguments);zet(padSfeer);return r};

  window.zwHal192=halSfeer;
  window.zwMeer192=meerSfeer;
  window.zwPad192=padSfeer;
})();
