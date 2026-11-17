/* v236: streep, bom en kleurbom krijgen per les een eigen gloed, bovenop de bestaande tekeningen */
(()=>{
  const KLEUR={
    herbologie:{a:'#7adf4a',b:'#c8f08a'},
    bezweringen:{a:'#7ec8ff',b:'#f0c8ff'},
    toverdranken:{a:'#c89aff',b:'#ffd27a'},
    gedaante:{a:'#5ee0d0',b:'#c8fff4'},
    astronomie:{a:'#ffe08a',b:'#fff6d0'},
    verweer:{a:'#ff6a6a',b:'#ffd27a'},
    fabeldieren:{a:'#ffb24a',b:'#ffe08a'}
  };
  function lesKleur(){
    return KLEUR[document.body.dataset.m3les]||KLEUR.herbologie;
  }
  const SOORT=['rh','rv','bom','bom2','bal','kruis','kruis3','gbom','dblauw','dpaars','drood','kbom'];
  const vorige=window.puTeken;
  window.puTeken=function(ctx,t,cel,nu){
    const kl=lesKleur();
    if(t.s&&SOORT.includes(t.s)){
      const g=ctx.createRadialGradient(0,0,cel*.08,0,0,cel*.6);
      g.addColorStop(0,kl.b+'99');
      g.addColorStop(.5,kl.a+'55');
      g.addColorStop(1,kl.a+'00');
      ctx.save();
      ctx.globalCompositeOperation='lighter';
      ctx.globalAlpha=.6+.2*Math.sin((nu||0)/200);
      ctx.fillStyle=g;
      ctx.beginPath();ctx.arc(0,0,cel*.6,0,7);ctx.fill();
      ctx.restore();
    }
    if(vorige&&vorige(ctx,t,cel,nu)){
      if(t.s&&SOORT.includes(t.s)){
        ctx.save();
        ctx.globalCompositeOperation='lighter';
        ctx.strokeStyle=kl.b;
        ctx.lineWidth=Math.max(1.6,cel*.04);
        ctx.globalAlpha=.4+.3*Math.sin((nu||0)/160);
        ctx.beginPath();ctx.arc(0,0,cel*.46,0,7);ctx.stroke();
        ctx.restore();
      }
      return true;
    }
    if(t.s==='bal'){
      const f=typeof RMP!=='undefined'&&RMP?.4:Math.sin((nu||0)/45)*.5+.5;
      ctx.save();ctx.translate(-cel*.13,-cel*.02);KU.vleugel(ctx,cel*.3,f,-1);ctx.restore();
      ctx.save();ctx.translate(cel*.13,-cel*.02);KU.vleugel(ctx,cel*.3,f,1);ctx.restore();
      ctx.save();ctx.shadowColor=kl.a;ctx.shadowBlur=cel*.28;
      ctx.drawImage(KU.speciaal('snaai',Math.round(cel*2)),-cel*.42,-cel*.42,cel*.84,cel*.84);
      ctx.restore();
      return true;
    }
    return false;
  };
})();
