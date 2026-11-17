/* v221: confetti valt niet over de cijfers in de bovenbalk */
(function(){
  const _c=window.confetti;
  if(!_c||_c._eind221)return;
  function confetti(){
    const r=_c.apply(this,arguments);
    try{
      document.querySelectorAll('.zwconf i').forEach(s=>{
        const x=parseFloat(s.style.getPropertyValue('--x'))||50;
        /* badges staan rechtsboven; houd 32–96vw in de eerste val vrij */
        if(x>32&&x<96)s.style.setProperty('--x',(3+Math.random()*26)+'vw');
      });
    }catch(e){}
    return r;
  }
  confetti._eind221=1;
  window.confetti=confetti;
})();
