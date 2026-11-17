/* v211: ontbrekende iconen in het Meer-menu */
(function(){
  const MAP={
    algemeen:'huis', huis:'huis', hkmeer:'huis',
    lijst:'lijst', boek:'boek', ster:'ster', hoed:'hoed', beker:'beker',
    ketel:'ketel', meerkt:'ketel',
    staf:'stok', spreuk:'stok',
    fop:'cadeau', meerfg:'cadeau',
    blad:'blad', meerkr:'blad',
    hart:'hart',
    muziek:'muziek', geluid:'muziek',
    kist:'schild', meerbk:'schild', backup:'schild',
    klok:'kalender', cadeau:'cadeau',
    uil:'uil', zon:'zon'
  };
  function naam(el){
    const d=el.getAttribute('data-tegel')||'';
    if(MAP[d])return MAP[d];
    if(el.id&&MAP[el.id])return MAP[el.id];
    const t=(el.innerText||'').toLowerCase();
    if(/huiskamer|huis/.test(t))return 'huis';
    if(/ketel|toverdrank/.test(t))return 'ketel';
    if(/spreuk/.test(t))return 'stok';
    if(/geluid|weergave|muziek/.test(t))return 'muziek';
    if(/voortgang|bewaren|backup/.test(t))return 'schild';
    if(/dagbeloning|beloning/.test(t))return 'cadeau';
    if(/vriend/.test(t))return 'hart';
    if(/kruid/.test(t))return 'blad';
    if(/fopshop/.test(t))return 'cadeau';
    if(/opdracht/.test(t))return 'lijst';
    if(/dagboek|boek/.test(t))return 'boek';
    if(/badge/.test(t))return 'ster';
    if(/beker/.test(t))return 'beker';
    if(/album|kaart/.test(t))return 'boek';
    return 'ster';
  }
  function zet(){
    if(document.body.dataset.view!=='meer')return;
    if(typeof icoon!=='function')return;
    document.querySelectorAll('#app .meer-tegel, #app .tegel.meer-tegel').forEach(el=>{
      if(el.querySelector('.ico,.meerico,img'))return;
      const s=document.createElement('span');
      s.className='ico meerico';
      s.setAttribute('aria-hidden','true');
      s.innerHTML=icoon(naam(el));
      const b=el.querySelector('b');
      if(b)el.insertBefore(s,b);
      else el.insertBefore(s,el.firstChild);
    });
  }
  const hook=()=>{
    if(typeof V==='undefined'||typeof V.meer!=='function'||V.meer._meer211){if(!V||!V.meer)setTimeout(hook,40);return}
    const _=V.meer;
    const w=function(){const r=_.apply(this,arguments);try{requestAnimationFrame(zet);setTimeout(zet,80)}catch(e){}return r};
    w._meer211=1;V.meer=w;
  };
  hook();
})();
