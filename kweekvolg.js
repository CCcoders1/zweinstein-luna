/* Kweekopdrachten in een logische volgorde: altijd een plant die ze nu al kan kweken.
   Beloningen en de opdrachten zelf (KOPDR) blijven gelijk; alleen de keuze van de actieve opdracht verandert. */
(()=>{if(typeof KOPDR==='undefined'||typeof kOpdr!=='function')return;
const oud=kOpdr;
const vanaf=z=>(window.ZAAD_VAN&&ZAAD_VAN[z])||1;
const kan=z=>!(window.zaadDicht&&zaadDicht(z))&&!(typeof kruidSlot==='function'&&kruidSlot(z));
const volgorde=()=>KOPDR.map((o,i)=>({o,i})).sort((a,b)=>vanaf(a.o[0])-vanaf(b.o[0])||a.i-b.i);
const bij=z=>KOPDR.find(o=>o[0]===z);
function kies(){S.kweekGedaan=S.kweekGedaan||{};const L=volgorde().filter(x=>kan(x.o[0]));if(!L.length)return volgorde()[0].o;
 // minst vaak gedaan eerst; bij gelijk: de vroegst beschikbare plant (makkelijk → moeilijk)
 L.sort((a,b)=>(S.kweekGedaan[a.o[0]]|0)-(S.kweekGedaan[b.o[0]]|0)||vanaf(a.o[0])-vanaf(b.o[0])||a.i-b.i);return L[0].o}
function actief(){const n=S.kweekOpdr|0;let a=S.kweekAct;
 if(a&&a.n!==n){if(a.n<n){S.kweekGedaan=S.kweekGedaan||{};S.kweekGedaan[a.z]=(S.kweekGedaan[a.z]|0)+(n-a.n)}a=null}
 if(a&&!bij(a.z))a=null;
 if(a&&!kan(a.z)&&!((S.oogst||{})[a.z+'#'+n]>0))a=null; // op slot en nog niets gedaan: wisselen
 if(!a){a={z:kies()[0],n};S.kweekAct=a;try{bewaar()}catch(e){}}
 return bij(a.z)}
// migratie: bestaande opdracht met voortgang houden, anders (op slot én 0 voortgang) wisselen
if(!S.kweekAct){try{const o=oud(),n=S.kweekOpdr|0,prog=(S.oogst||{})[o[0]+'#'+n]|0;if(prog>0||kan(o[0]))S.kweekAct={z:o[0],n};bewaar()}catch(e){}}
kOpdr=function(){try{return actief()}catch(e){return oud()}};
window.zwKweekVolgorde=()=>volgorde().map(x=>x.o[0]+'@'+vanaf(x.o[0]));
})();
