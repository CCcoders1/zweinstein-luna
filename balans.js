/* ====== Vooraf berekende balans voor alle 600 levels (zie balans-data.js) ======
   [extraZetten, mild(0/1), botWinkans] — berekend offline met de oplosbaarheidssimulatie */
(function(){
 window.M3BAL=window.M3BAL||{};
 const _lv=m3Level;m3Level=function(n){const L=_lv(n);const e=M3BAL[n];if(!e)return L;
  const m=e[1]|0;if(m){const f=[1,.7,.55,.45][m];L.doelen=L.doelen.map(x=>typeof x[0]=='number'?[x[0],Math.max(8,Math.round(x[1]*f))]:x[0]=='p'?['p',Math.max(2,x[1]-(m>1?2:1))]:x);
   if(m>=2){if(['vol','dambord','kruis'].includes(L.onkruid))L.onkruid='rand';if(L.kist=='dubbel')L.kist='rij'}else if(L.onkruid=='vol')L.onkruid='dambord';
   if(m>=3&&L.doelen.length>2){L.doelen=L.doelen.slice(0,2);if(!L.doelen.some(x=>x[0]=='o'))L.onkruid=0;if(!L.doelen.some(x=>['k','i','d'].includes(x[0])))L.kist=0}
   const p=L.doelen.find(x=>x[0]=='p');L.pot=p?p[1]:0;if(!p)delete L.dropInh}
  if(!window._balSim)L.zetten=Math.max(12,L.zetten+e[0]);return L};
 // geen kalibratie meer op de telefoon nodig
 const _k=m3Kalibreer;m3Kalibreer=async function(n,t){if(M3BAL[n]){S.m3kal=S.m3kal||{};S.m3kal[n]=0;return 0}return _k(n,t)};
 if(!S.kalV4&&Object.keys(M3BAL).length){S.kalV4=1;S.m3kal={};bewaar()}
})();
