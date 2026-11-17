'use strict';
/* v242: opdrachtkaart met portretlijst en lint */
(()=>{
  const bouw=window.m3OpdrachtVoorKaart;
  window.m3OpdrachtVoorKaart=function(n){
    if(bouw)bouw(n);
    const el=document.querySelector('.m3opdrachtkaart');
    if(!el||el.querySelector('.m3op-lint'))return;
    const port=el.querySelector('.pportret,.m3op-port');
    const b=el.querySelector('b');
    const p=el.querySelector('p');
    const titel=(b&&b.textContent)||'Opdracht';
    const zin=(p&&p.textContent)||'';
    el.innerHTML=
      (port?'<div class="m3op-lijst">'+port.outerHTML+'</div>':'')+
      '<div class="m3op-tekst">'+
        '<span class="m3op-lint"><b>'+titel+'</b></span>'+
        (zin?'<p>'+zin+'</p>':'')+
      '</div>'+
      '<i class="m3op-hoek tl"></i><i class="m3op-hoek tr"></i><i class="m3op-hoek bl"></i><i class="m3op-hoek br"></i>';
  };
})();
