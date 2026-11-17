/* v219: pittig-hint blijft zichtbaar boven de drankjes, niet onder de kaart */
(function(){
  function zet(){
    try{
      const v=document.querySelector('.m3voor');
      if(!v)return;
      const voet=v.querySelector('.m3voor-vast');
      const hint=v.querySelector('.zwaarhint');
      if(voet&&hint&&hint.parentElement!==voet){
        voet.insertBefore(hint,voet.firstChild);
      }
    }catch(e){}
  }
  if(typeof V!=='undefined'&&typeof V.match3==='function'&&!V.match3._pittig219){
    const _=V.match3;
    V.match3=async function(){
      const r=await _.apply(this,arguments);
      try{zet();setTimeout(zet,60);setTimeout(zet,220)}catch(e){}
      return r;
    };
    V.match3._pittig219=1;
  }
  setTimeout(zet,400);
})();
