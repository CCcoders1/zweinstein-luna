'use strict';
/* ====== Popup-wachtrij + veiligheidsnet ======
   - Altijd maar één overlay zichtbaar; volgorde: welkom → dagbeloning → uilenpost/verhaal → overig
   - Dubbele popups (zelfde data-pop) worden genegeerd
   - Elke popup krijgt een 'Verder'-knop; bij een fout na een tik wordt de popup gesloten en gaat de app door */
(()=>{const B=document.body,orig=B.appendChild.bind(B);
 const isPop=e=>e&&e.nodeType===1&&e.classList&&(e.classList.contains('modal')||e.classList.contains('ritueel'));
 const prio=e=>e.classList.contains('ritueel')?0:e.dataset.pop==='login'?1:e.classList.contains('verhaalm')?2:3;
 const pops=()=>[...B.children].filter(isPop);
 const zichtbaar=()=>pops().filter(e=>!e.classList.contains('wacht')&&!e.classList.contains('weg'));
 function toon(e){e.classList.remove('wacht');e.style.removeProperty('visibility');veilig(e)}
 function volgende(){if(zichtbaar().length)return;const w=pops().filter(e=>e.classList.contains('wacht')).sort((a,b)=>prio(a)-prio(b))[0];if(w)toon(w)}
 B.appendChild=function(e){if(!isPop(e))return orig(e);
  const key=e.dataset.pop;if(key&&pops().some(x=>x.dataset.pop===key))return e;/* dubbel: niet tonen */
  if(zichtbaar().length){e.classList.add('wacht');orig(e)}else{orig(e);veilig(e)}return e};
 new MutationObserver(()=>{requestAnimationFrame(volgende)}).observe(B,{childList:true,attributes:true,subtree:false,attributeFilter:['class']});
 function sluit(e){if(!e||!e.isConnected)return;e.classList.add('weg');e.style.pointerEvents='none';setTimeout(()=>{e.remove();volgende()},350)}
 window.popupSluit=sluit;
 function veilig(e){if(e._veilig)return;e._veilig=1;
  if(!e.dataset.geenverder&&!e.querySelector('.p-verder')){const k=document.createElement('button');k.type='button';k.className='p-verder';k.textContent='Verder ›';k.onclick=ev=>{ev.stopPropagation();sluit(e)};e.appendChild(k)}
  e.addEventListener('pointerdown',()=>{window._popTik=[Date.now(),e]},true)}
 /* globale foutafhandeling: app loopt nooit vast */
 const fout=(msg)=>{try{console.warn('[veiligheidsnet]',msg);const t=window._popTik;if(t&&Date.now()-t[0]<2000&&t[1].isConnected)sluit(t[1]);
  document.documentElement.classList.add('klaar');B.style.removeProperty('opacity')}catch(x){}};
 addEventListener('error',ev=>fout(ev.message));addEventListener('unhandledrejection',ev=>fout(ev.reason&&ev.reason.message||ev.reason));
 /* laatste vangnet: als er 6 s na een tik nog steeds dezelfde popup staat zonder werkende knop → Verder blijft altijd beschikbaar (zie boven) */
})();
