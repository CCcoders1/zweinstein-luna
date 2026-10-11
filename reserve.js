/* ====== Opslagbescherming: validatie + automatische reservekopieën (vóór app.js geladen) ====== */
(function(){const SK='zweinstein_v1',RK='zw_reserve';
 const geldig=t=>{try{const o=JSON.parse(t);return o&&typeof o=='object'&&!Array.isArray(o)&&typeof (o.naam??'')=='string'}catch(e){return false}};
 const lijst=()=>{try{return JSON.parse(localStorage.getItem(RK)||'[]')}catch(e){return []}};
 const nu=localStorage.getItem(SK);
 if(nu!=null&&!geldig(nu)){const r=lijst().find(x=>geldig(x.d));if(r){localStorage.setItem(SK+'_kapot',nu);localStorage.setItem(SK,r.d);window._herstelMelding='Je voortgang was beschadigd en is hersteld uit de reservekopie van '+new Date(r.t).toLocaleString('nl-NL')+'.'}else localStorage.removeItem(SK)}
 /* IndexedDB-spiegel voor als localStorage helemaal leeg is */
 const idb=fn=>{try{const q=indexedDB.open('zweinstein',1);q.onupgradeneeded=()=>q.result.createObjectStore('reserve');q.onsuccess=()=>fn(q.result)}catch(e){}};
 window.zwReserve={lijst,
  maak(forceer){const d=localStorage.getItem(SK);if(!d||!geldig(d))return;const L=lijst();if(!forceer&&L[0]&&(L[0].d===d||Date.now()-L[0].t<30*60e3))return;L.unshift({t:Date.now(),d});const n=L.slice(0,3);try{localStorage.setItem(RK,JSON.stringify(n))}catch(e){}idb(db=>{const tx=db.transaction('reserve','readwrite');tx.objectStore('reserve').put(n,'lijst')})},
  idbHerstel(){if(localStorage.getItem(SK)||sessionStorage.zw_idbTry)return;sessionStorage.zw_idbTry=1;idb(db=>{const q=db.transaction('reserve').objectStore('reserve').get('lijst');q.onsuccess=()=>{const L=q.result||[];const r=L.find(x=>geldig(x.d));if(r){localStorage.setItem(SK,r.d);localStorage.setItem(RK,JSON.stringify(L));sessionStorage.zw_herstelIdb=1;location.reload()}}})}};
 zwReserve.idbHerstel();
 /* opslag laten beschermen tegen automatisch opruimen */
 const vraag=()=>{try{navigator.storage&&navigator.storage.persist&&navigator.storage.persisted().then(p=>{if(!p)navigator.storage.persist().then(x=>localStorage.setItem('zw_persist',x?'1':'0'));else localStorage.setItem('zw_persist','1')})}catch(e){}};
 vraag();addEventListener('pointerdown',vraag,{once:true});
 setTimeout(()=>zwReserve.maak(),5000);setInterval(()=>zwReserve.maak(),10*60e3);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)zwReserve.maak()});
})();
