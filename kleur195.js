'use strict';
/* v195: rijke, cozy kleurlaag boven v194; hergebruikt data-vak */
(()=>{
  function zet(){
    document.documentElement.classList.add('kleur194','kleur195');
    document.body.classList.add('kleur194','kleur195');
  }
  zet();
  document.addEventListener('DOMContentLoaded',zet);
  [0,200,800].forEach(t=>setTimeout(zet,t));
})();
