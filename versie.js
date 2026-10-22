/* ====== v125 Versielabel: klein in Meer en in het makermenu, zodat je kunt zien welke versie een telefoon draait ====== */
(function(){const VERSIE='v128';window.ZW_VERSIE=VERSIE;
 const label=()=>`<p class="zwversie">Zweinstein Luna ${VERSIE}</p>`;
 const _meer=V.meer;if(_meer)V.meer=(...a)=>{const r=_meer(...a);try{const app=$('#app');if(app&&!app.querySelector('.zwversie'))app.insertAdjacentHTML('beforeend',label())}catch(e){}return r};
 const _mk=V.maker;if(_mk)V.maker=(...a)=>{const r=_mk(...a);try{const h=$('#app h2');if(h&&!$('#app .zwversie'))h.insertAdjacentHTML('afterend',label())}catch(e){}return r};
})();
