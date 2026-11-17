/* v197: tijdens het spel alleen het speelscherm, geen Hal-banners; bord vult het scherm */
(function(){
  function inSpel(){
    return !!(document.body.classList.contains('m3aan')||document.body.dataset.view==='match3'||document.getElementById('m3c'));
  }
  function startScherm(){
    document.body.dataset.view='match3';
    document.body.classList.add('m3aan','m3grootbord');
    document.body.classList.remove('halstrak','hal192','pad192','meer192');
    const app=document.getElementById('app');
    if(app)app.classList.remove('hal192','pad192','meer192');
  }
  function schoonHal(){
    if(!inSpel())return;
    startScherm();
    const keep=el=>el&&el.closest&&el.closest('.m3,.m3hud,.m3bord,.m3levrij,#pompmeter');
    ['#wmkaart','#ookvandaag','#morgenkaart','#tuinknop','#hwkaart','#halvr','#volgendestap',
     '.groet','.halbanner','.lokaal','.dagdoelen','.halspel','.halook','#halnaarbuiten'].forEach(sel=>{
      document.querySelectorAll(sel).forEach(el=>{if(!keep(el))try{el.remove()}catch(e){}});
    });
  }
  function wikkel(naam){
    const fn=window[naam];
    if(typeof fn!=='function')return;
    window[naam]=function(){
      if(inSpel()&&(naam==='kopOrde'||naam==='zetHalExtra'||naam==='zetKaartOpHal'||naam==='zwHal192'))return;
      return fn.apply(this,arguments);
    };
  }
  ['kopOrde','zetHalExtra','zetKaartOpHal','zwHal192'].forEach(wikkel);

  if(typeof m3Speel==='function'){
    const _sp=m3Speel;
    m3Speel=function(){
      startScherm();
      const r=_sp.apply(this,arguments);
      schoonHal();
      [80,200,500,1200,2600].forEach(t=>setTimeout(schoonHal,t));
      return r;
    };
  }
})();
