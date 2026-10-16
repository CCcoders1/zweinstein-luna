'use strict';
/* Plaaglevels en het ingrediëntenboek in de kas.
   Herbologie: duivelsstrik. Toverdranken: gestold brouwsel, zelfde kist en boek. */
const PLAAG={22:'licht',35:'licht',48:'licht',61:'licht',74:'diep',88:'diep',100:'diep',222:'vocht',235:'vocht',248:'vocht',261:'vocht'};
const MIXEN=[
 {id:'licht',naam:'Lichtbrouwsel',na:12,slot:'Komt in het boek als je de eerste Duivelsstrik-les haalt.',zin:'Valeriaan zodat je kalm blijft, alsem voor de warmte, affodil voor het licht. Haalt driekwart van de duivelsstrik weg. De rest groeit elke beurt.',nodig:[['valeriaan',1],['alsem',1],['affodil',1]]},
 {id:'diep',naam:'Diep Lichtbrouwsel',na:60,zin:'Een Lichtbrouwsel plus een mandragora, voor de zware plaag. De rest groeit twee vakjes per beurt.',nodig:[['licht',1],['mandragora',1]]},
 {id:'vocht',naam:'Vocht van de Levende Dood',na:222,slot:'Komt in het boek als je Sneeps eerste kerkerles haalt.',zin:'Affodilwortel in een aftreksel van alsem. Een slaapdrank zo krachtig dat de drinker lijkt te sterven. Haalt driekwart van het gestolde brouwsel weg. De rest groeit elke beurt. Monnikskap en wolfswortel zijn dezelfde plant, akoniet. Dat is de strikvraag van Sneep.',nodig:[['affodil',1],['alsem',1]]}];
function plaagVan(n){const id=PLAAG[n];if(!id)return null;const m=MIXEN.find(x=>x.id===id),zwaar=id==='diep',intro=n===22||n===222,damp=id==='vocht';
 return {id,naam:m.naam,zwaar,intro,groei:zwaar?2:1,soort:damp?'damp':'strik',prof:damp?'Professor Sneep':'Professor Stronk',beeld:damp?'toverdranken':'herbologie',kaart:damp?'Gestold brouwsel':'Duivelsstrik',over:damp?'het stolsel':'de strik',groeiZin:zwaar?'De strik groeit twee vakjes per beurt.':damp?'Het stolsel groeit elke beurt.':'De strik groeit elke beurt.',dicht:damp?'Het gestolde brouwsel hield de stukken vast.':'De stekels hielden de stukken vast.',auw:damp?'HET BRANDT!':'AUW!',vast:damp?'Eerst de vier korsten om het recept weg.':'Eerst de vier ranken om het recept weg.',regel:intro?(damp?'Vier korsten houden het recept vast. Bevrijd het, dan komt het Vocht van de Levende Dood in je boek.':'Vier ranken duivelsstrik houden het recept vast. Bevrijd het, dan komt Lichtbrouwsel in je boek.'):(damp?'Gestold brouwsel kruipt over het bord. '+m.naam+' haalt driekwart weg. Zonder flesje is het te veel.':'Duivelsstrik kruipt over het bord. '+m.naam+' haalt driekwart weg. Zonder flesje is het te veel.')}}
window.plaagVan=plaagVan;
S.flesjes=S.flesjes||{};S.oogst=S.oogst||{};S.receptOpen=S.receptOpen||{};
if((S.m3lvl|0)>22&&!S.receptOpen.licht){S.receptOpen.licht=1;bewaar()}
if((S.m3lvl|0)>222&&!S.receptOpen.vocht){S.receptOpen.vocht=1;bewaar()}
function isFles(id){return id==='licht'||id==='diep'||id==='vocht'}
function voorraad(id){if(isFles(id))return S.flesjes[id]|0;return S.oogst[id]|0}
function kruidNaam(id){const m=MIXEN.find(x=>x.id===id);if(m)return m.naam;return (ZADEN[id]&&ZADEN[id][0])||id}
function mixOpen(m){if(m.id==='licht'||m.id==='vocht')return !!(S.receptOpen&&S.receptOpen[m.id]);return (S.m3lvl|0)>m.na||!!(S.receptOpen&&S.receptOpen[m.id])}
function mixStatus(m){if(!mixOpen(m))return {open:0,miss:[],klaar:0};const miss=m.nodig.filter(([id,n])=>voorraad(id)<n);return {open:1,miss,klaar:!miss.length}}
function flesTotaal(){return (S.flesjes.licht|0)+(S.flesjes.diep|0)+(S.flesjes.vocht|0)}

/* Paarse, dikkere rank dan het gewone onkruid, met stekels. */
let strikKlaar=0;
function maakStrik(img){const w=img.naturalWidth,h=img.naturalHeight,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(img,0,0);const src=x.getImageData(0,0,w,h).data,out=x.createImageData(w,h),o=out.data,rad=3;
 for(let y=0;y<h;y++)for(let x0=0;x0<w;x0++){let a=0,r=0,g=0,b=0,n=0;for(let dy=-rad;dy<=rad;dy++){const yy=y+dy;if(yy<0||yy>=h)continue;for(let dx=-rad;dx<=rad;dx++){if(dx*dx+dy*dy>rad*rad)continue;const xx=x0+dx;if(xx<0||xx>=w)continue;const i=(yy*w+xx)*4;if(src[i+3]>28){a=Math.max(a,src[i+3]);r+=src[i];g+=src[i+1];b+=src[i+2];n++}}}
  const i=(y*w+x0)*4;if(!n)continue;const blad=g/n>r/n+8&&g/n>b/n;if(blad){o[i]=176;o[i+1]=78;o[i+2]=222}else{o[i]=72;o[i+1]=24;o[i+2]=108}o[i+3]=Math.min(255,a)}
 x.putImageData(out,0,0);x.fillStyle='#f0dcff';x.strokeStyle='#3a1058';x.lineWidth=Math.max(2,w*.06);
 for(let y=h*.14;y<h*.88;y+=h*.1){const dir=(y/h*10|0)%2?1:-1,cx=w*.52;x.beginPath();x.moveTo(cx,y);x.lineTo(cx+dir*w*.46,y-h*.012);x.lineTo(cx+dir*w*.14,y+h*.018);x.closePath();x.fill();x.stroke()}
 return c}
function zorgStrik(){if(strikKlaar)return;const a=window._rank1,b=window._rank2;if(!a||!a.complete||!a.naturalWidth)return;window._strik1=maakStrik(a);if(b&&b.complete&&b.naturalWidth)window._strik2=maakStrik(b);strikKlaar=1}
/* 1 = rank (AUW, vast). 2 = het recept, alleen op de introductieles. */
const RECEPT=[3,3],RING=[[2,3],[4,3],[3,2],[3,4]];
function strikVeld(n){const p=plaagVan(n);return !!(p&&!p.intro)}
function ringVast(b){return RING.filter(([r,c])=>b.strik&&b.strik[r][c]==1).length}
function houdtKistDicht(b,r,c){for(const [dr,dc] of [[0,1],[1,0],[0,-1],[-1,0]]){const rr=r+dr,cc=c+dc;if(rr<0||rr>=RIJEN||cc<0||cc>=KOL||!b.kist[rr][cc])continue;let ander=0;for(const [a,d] of [[0,1],[1,0],[0,-1],[-1,0]]){const r2=rr+a,c2=cc+d;if(r2==r&&c2==c)continue;if(r2<0||r2>=RIJEN||c2<0||c2>=KOL||b.kist[r2][c2]||b.strik[r2][c2]==1)continue;ander++}if(!ander)return true}return false}
function afstandKist(b,r,c){let m=-1;for(let rr=0;rr<RIJEN;rr++)for(let cc=0;cc<KOL;cc++)if(b.kist[rr][cc]){const d=Math.abs(rr-r)+Math.abs(cc-c);if(m<0||d<m)m=d}return m}
function strikTel(b){let n=0;if(!b.strik)return 0;for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++)if(b.strik[r][c]==1)n++;return n}
function dunStrik(b){const cel=[],doel=[];for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){if(b.strik[r][c]==1)cel.push([r,c]);if(b.kist[r][c])doel.push([r,c])}if(!cel.length)return;const houden=Math.max(1,Math.floor(cel.length*.25));
 const ver=(r,c)=>doel.length?doel.reduce((m,[rr,cc])=>Math.min(m,Math.abs(rr-r)+Math.abs(cc-c)),99):r;
 cel.sort((a,d)=>ver(d[0],d[1])-ver(a[0],a[1])||d[0]-a[0]);cel.slice(houden).forEach(([r,c])=>{b.strik[r][c]=0});b.gedund=1;
 for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++)if(b.kist[r][c]){for(const [dr,dc] of [[-1,0],[0,-1],[0,1],[1,0]]){const rr=r+dr,cc=c+dc;if(rr>=0&&rr<RIJEN&&cc>=0&&cc<KOL&&b.strik[rr][cc]==1){b.strik[rr][cc]=0;break}}}}
Bord.prototype.strikInit=function(){const p=this.L&&this.L.plaag;if(!p){this.strik=null;return}this.strik=[];
 for(let r=0;r<RIJEN;r++){this.strik.push([]);for(let c=0;c<KOL;c++){const t=this.g[r][c];let v=0;
  if(p.intro){if(r==RECEPT[0]&&c==RECEPT[1])v=2;else if(RING.some(([rr,cc])=>rr==r&&cc==c))v=1}
  else if(strikVeld(this.L.n)&&!this.kist[r][c]&&t&&t.k>=0)v=1;
  if(v==1&&(!t||t.k<0||this.kist[r][c]))v=0;this.strik[r][c]=v}}
 if(p.intro){const d=this.doel.find(x=>x.t=='recept');const n=ringVast(this);if(d){d.n=n||4;d.over=n}}
 if(window._strikWeg&&!p.intro)dunStrik(this);
 if(!this.sim)window._strikWeg=0};
Bord.prototype.strikGroei=function(){const p=this.L.plaag;if(!p||!this.strik)return;
 if(p.intro){const nog=ringVast(this);if(nog==0){const d=this.doel.find(x=>x.t=='recept');if(d)d.over=0;this.strik[RECEPT[0]][RECEPT[1]]=0;this.fx.push({t:'recept',r:RECEPT[0],c:RECEPT[1]});if(!this.sim)toast('Het recept is vrij!');return}}
 const n=p.groei||1,plafond=this.gedund?(p.zwaar?24:20):RIJEN*KOL;
 for(let i=0;i<n;i++){if(strikTel(this)>=plafond)break;const kand=[];for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=this.g[r][c];if(this.strik[r][c]||this.kist[r][c]||!t||t.k<0)continue;if([[0,1],[1,0],[0,-1],[-1,0]].some(([dr,dc])=>this.binnen(r+dr,c+dc)&&this.strik[r+dr]&&this.strik[r+dr][c+dc]))kand.push([r,c])}
  if(!kand.length)break;let pool=kand.filter(([r,c])=>!houdtKistDicht(this,r,c));if(!pool.length)break;if(p.intro){const buiten=pool.filter(([r,c])=>!RING.some(([rr,cc])=>rr==r&&cc==c));if(buiten.length)pool=buiten}
  else if(this.gedund){const af=pool.map(p=>afstandKist(this,p[0],p[1]));if(af[0]>=0){const top=Math.max(...af);pool=pool.filter((_,i)=>af[i]>=top-1)}else{const bodem=Math.max(...pool.map(x=>x[0]));const front=pool.filter(x=>x[0]>=bodem-1);if(front.length)pool=front}}
  const k=pool[this.rng()*pool.length|0];this.strik[k[0]][k[1]]=1;this.fx.push({t:'strikgroei',r:k[0],c:k[1]})}
 if(p.intro){const d=this.doel.find(x=>x.t=='recept');if(d&&d.over>0)d.over=ringVast(this)}
 if(!this.heeftZet()){this.schud();if(!this.heeftZet()){this.strikDicht=1;if(!this.sim)this.zet=0}}};
const _runsP=Bord.prototype.runs;
Bord.prototype.runs=function(){if(!this.strik)return _runsP.call(this);const vrij=(r,c)=>this.k(r,c)>=0&&!this.strik[r][c];const res=[];
 for(let r=0;r<RIJEN;r++){let c=0;while(c<KOL){if(!vrij(r,c)){c++;continue}const k=this.k(r,c);let e=c;while(e+1<KOL&&vrij(r,e+1)&&this.k(r,e+1)===k)e++;if(e-c>=2)res.push({h:1,cel:Array.from({length:e-c+1},(_,i)=>[r,c+i])});c=e+1}}
 for(let c=0;c<KOL;c++){let r=0;while(r<RIJEN){if(!vrij(r,c)){r++;continue}const k=this.k(r,c);let e=r;while(e+1<RIJEN&&vrij(e+1,c)&&this.k(e+1,c)===k)e++;if(e-r>=2)res.push({h:0,cel:Array.from({length:e-r+1},(_,i)=>[r+i,c])});r=e+1}}
 for(let r=0;r<RIJEN-1;r++)for(let c=0;c<KOL-1;c++){const k=this.k(r,c);if(vrij(r,c)&&vrij(r,c+1)&&vrij(r+1,c)&&vrij(r+1,c+1)&&this.k(r,c+1)===k&&this.k(r+1,c)===k&&this.k(r+1,c+1)===k)res.push({sq:1,cel:[[r,c],[r,c+1],[r+1,c],[r+1,c+1]]})}
 return res};
const _heeftP=Bord.prototype.heeftZet;
Bord.prototype.heeftZet=function(){if(!this.strik)return _heeftP.call(this);
 for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){if(this.strik[r][c])continue;const t=this.g[r][c];if(!t)continue;
  if(t.s){if([[0,1],[1,0],[0,-1],[-1,0]].some(([dr,dc])=>{const r2=r+dr,c2=c+dc;return this.binnen(r2,c2)&&this.g[r2][c2]&&!this.strik[r2][c2]}))return true;continue}
  for(const [dr,dc] of [[0,1],[1,0]]){const r2=r+dr,c2=c+dc;if(!this.binnen(r2,c2)||!this.g[r2][c2]||this.strik[r2][c2])continue;this.wis(r,c,r2,c2);const ok=this.runs().length>0;this.wis(r,c,r2,c2);if(ok)return [[r,c],[r2,c2]]}}
 return false};
const _oplP=Bord.prototype.oplossen;
Bord.prototype.oplossen=async function(){const r=await _oplP.apply(this,arguments);if(this.L&&this.L.plaag)this.strikGroei();return r};
const _potP=Bord.prototype.potten;
Bord.prototype.potten=function(){if(!this.strik)return _potP.call(this);_potP.call(this);let veilig=0;
 while(veilig++<8){const pak=[];for(let c=0;c<KOL;c++)for(let r=0;r<RIJEN;r++){const t=this.g[r][c];if(!t||t.k>=0||this.kist[r][c]||this.strik[r][c])continue;if(r+1>=RIJEN||this.strik[r+1][c]||this.kist[r+1][c])pak.push([r,c])}
  if(!pak.length)break;pak.forEach(([r,c])=>{const t=this.g[r][c];if(!t||t.k>=0)return;this.g[r][c]=null;this.telDoel('p');this.fx.push({t:'pot',r,c})});this.val()}};

function tekenPerkament(ctx,cel,c,r,drup){ctx.save();ctx.fillStyle='#f4e2bc';ctx.strokeStyle='#6b3a12';ctx.lineWidth=Math.max(1.5,cel*.04);ctx.beginPath();ctx.roundRect(c*cel+cel*.16,r*cel+cel*.14,cel*.68,cel*.72,5);ctx.fill();ctx.stroke();ctx.fillStyle='#8a5a28';ctx.fillRect(c*cel+cel*.26,r*cel+cel*.3,cel*.46,cel*.045);ctx.fillRect(c*cel+cel*.26,r*cel+cel*.4,cel*.34,cel*.04);ctx.fillStyle=drup;ctx.beginPath();ctx.arc(c*cel+cel*.5,r*cel+cel*.64,cel*.11,0,7);ctx.fill();ctx.fillStyle='#f0dcff';ctx.font=`700 ${Math.max(8,cel*.16)}px Georgia,serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('✦',c*cel+cel*.5,r*cel+cel*.65);ctx.restore()}
function tekenDamp(ctx,b,cel){for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){if(b.strik[r][c]==2){tekenPerkament(ctx,cel,c,r,'#1f8a4c');continue}if(b.strik[r][c]!=1)continue;const x=c*cel,y=r*cel;ctx.save();ctx.fillStyle='rgba(12,42,28,.72)';ctx.beginPath();ctx.roundRect(x+1,y+1,cel-2,cel-2,8);ctx.fill();ctx.fillStyle='#1c6b3a';ctx.beginPath();ctx.roundRect(x+cel*.1,y+cel*.16,cel*.8,cel*.68,10);ctx.fill();ctx.fillStyle='#8ee0a8';[[.28,.34],[.62,.42],[.44,.62]].forEach(([dx,dy],i)=>{ctx.globalAlpha=.85;ctx.beginPath();ctx.arc(x+cel*dx,y+cel*dy,cel*(.07+i*.015),0,7);ctx.fill()});ctx.globalAlpha=.55;ctx.fillStyle='#d9ffe6';ctx.beginPath();ctx.ellipse(x+cel*.4,y+cel*.32,cel*.16,cel*.07,0,0,7);ctx.fill();ctx.restore()}}
function tekenStrik(ctx,b,cel){if(!b.strik)return;if(b.L&&b.L.plaag&&b.L.plaag.soort==='damp')return tekenDamp(ctx,b,cel);zorgStrik();const A=window._strik1,B=window._strik2;
 for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){if(b.strik[r][c]==2){tekenPerkament(ctx,cel,c,r,'#7a2ea8');continue}if(b.strik[r][c]!=1)continue;const x=c*cel+cel/2,y=r*cel+cel/2;
  ctx.save();ctx.fillStyle='rgba(88,28,140,.38)';ctx.beginPath();ctx.roundRect(c*cel+1,r*cel+1,cel-2,cel-2,8);ctx.fill();ctx.restore();
  if(A){const h=cel*1.62,w=h*A.width/A.height;ctx.save();ctx.translate(x,y);ctx.rotate(-.62);ctx.drawImage(A,-w/2,-h/2,w,h);ctx.restore();
   if(B){const w2=h*B.width/B.height;ctx.save();ctx.translate(x,y);ctx.rotate(.72);ctx.drawImage(B,-w2/2,-h/2,w2,h);ctx.restore()}}
  else{ctx.save();ctx.strokeStyle='#6d2ca0';ctx.lineWidth=cel*.24;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y-cel*.4);ctx.quadraticCurveTo(x+cel*.28,y,x,y+cel*.4);ctx.stroke();ctx.fillStyle='#e4c6ff';[[-.2,-.1],[.22,.05],[-.16,.2]].forEach(([dx,dy])=>{ctx.beginPath();ctx.moveTo(x,y+dy*cel);ctx.lineTo(x+dx*cel,y+(dy-.16)*cel);ctx.lineTo(x+dx*cel*.3,y+(dy+.08)*cel);ctx.fill()});ctx.restore()}}}
window.tekenStrik=tekenStrik;
function strikVast(b,p){return !!(b.strik&&b.strik[p[0]]&&b.strik[p[0]][p[1]])}
window.strikVast=strikVast;
function strikAuw(p,cel){const f=$('#m3fx');const damp=(()=>{try{return M3.b&&M3.b.L&&M3.b.L.plaag&&M3.b.L.plaag.soort==='damp'}catch(e){return false}})();const tekst=damp?'HET BRANDT!':'AUW!';try{fx.speel('fout')}catch(e){}try{vib(36)}catch(e){}
 if(!f||!cel){toast(tekst);return}const d=document.createElement('div');d.className='m3auw'+(damp?' brand':'');d.textContent=tekst;d.style.left=(p[1]+.5)*cel+'px';d.style.top=(p[0]+.35)*cel+'px';f.appendChild(d);setTimeout(()=>d.remove(),1200)}
window.strikAuw=strikAuw;
function strikSoort(b,p){return b.strik&&b.strik[p[0]]?b.strik[p[0]][p[1]]||0:0}
function strikVastzin(b){return (b.L&&b.L.plaag&&b.L.plaag.vast)||'Eerst de vier ranken om het recept weg.'}
function strikTik(b,p,cel){const v=strikSoort(b,p);if(v==2){toast(strikVastzin(b));return true}if(v==1){strikAuw(p,cel);return true}return false}
window.strikTik=strikTik;
function strikTegen(b,a,c,cel){const va=strikSoort(b,a),vc=strikSoort(b,c);if(va==2||vc==2){toast(strikVastzin(b));return true}if(va==1||vc==1){strikAuw(va==1?a:c,cel);return true}return false}
window.strikTegen=strikTegen;

const _lvP=m3Level;m3Level=function(n){const L=_lvP(n);const p=plaagVan(n);if(!p)return L;L.plaag=p;L.onkruid=0;
 if(p.intro){L.doelen=[['recept',4]];L.kist=0;L.pot=0;delete L.dropInh;L.kleuren=5;L.zetten=Math.max(L.zetten|0,24);return L}
 L.doelen=(L.doelen||[]).filter(d=>d[0]!=='o').map(d=>d.slice());if(!L.doelen.length)L.doelen=[[0,18]];if(p.soort==='damp')L.kleuren=Math.max(L.kleuren|0,7);else L.kleuren=p.zwaar?Math.max(L.kleuren|0,7):Math.min(L.kleuren|0||6,6);return L};
const _kalP=m3Kalibreer;m3Kalibreer=async function(n,th){if(!plaagVan(n))return _kalP(n,th);S.m3kal=S.m3kal||{};if(S.m3kal[n]==null||S.m3kal[n]>6){S.m3kal[n]=6;bewaar()}return Math.min(6,S.m3kal[n])};
const _vm3=V.match3;V.match3=async function(n,...a){n=n||S.m3lvl||1;const p=plaagVan(n);if(p){S.m3kal=S.m3kal||{};if(S.m3kal[n]==null||S.m3kal[n]>6){S.m3kal[n]=6;bewaar()}}
 const r=await _vm3.call(this,n,...a);const h=document.querySelector('.m3voor h2');if(p&&h&&!document.querySelector('.plaagregel'))h.insertAdjacentHTML('afterend',`<p class="plaagregel">${p.regel}</p>`);return r};
const _verP=m3Verlies;m3Verlies=function(n,b){const r=_verP(n,b);if(b&&b.strikDicht){const el=document.querySelector('.m3eind p');if(el)el.insertAdjacentHTML('afterend','<p>'+((b.L&&b.L.plaag&&b.L.plaag.dicht)||'De stekels hielden de stukken vast.')+'</p>')}return r};

function stronkVraag(n,thema,boost){const p=plaagVan(n),heb=voorraad(p.id);const o=document.createElement('div');o.className='modal';
 const beeld=innerWidth<=700?`img/laadschermen/${p.beeld}-klein.webp`:`img/laadschermen/${p.beeld}.webp`;
 const ja=heb?`<button class="knop volgende" id="stronkja">Ja, ik heb het bij me</button>`:'';
 o.innerHTML=`<div class="modalin rococo stronk-in"><div class="stronk-beeld" style="background-image:url('${beeld}')"></div><h2>${p.prof}</h2><p>${naam()}, heb je je ${p.naam} meegenomen?</p><p class="klein">${p.groeiZin} Zonder het flesje blijft alles staan. Dat is te veel om te winnen. ${heb?`In je kist: ${heb} ${heb===1?'flesje':'flesjes'}.`:'Het flesje staat niet in je kist.'}</p><div class="stronk-knoppen">${ja}<button class="knop" id="stronktoch">Toch starten</button><button class="knop" id="stronkkas">Naar de kas</button></div></div>`;
 document.body.appendChild(o);
 const verder=weg=>{o.remove();window._strikWeg=weg;m3Speel(n,thema,Object.assign({},boost,{_stronkKlaar:1}))};
 const jb=$('#stronkja');if(jb)jb.onclick=()=>{if(voorraad(p.id)<1){toast('Het flesje is er niet.');return}S.flesjes[p.id]--;bewaar();toast(p.naam+' giet over '+p.over+'.');verder(.75)};
 $('#stronktoch').onclick=()=>verder(0);
 $('#stronkkas').onclick=()=>{o.remove();ga('mijnkas');setTimeout(()=>{try{ingredientenBoek()}catch(e){}},700)}}
function introLes(n,thema,boost){const p=plaagVan(n),al=!!(S.receptOpen&&S.receptOpen[p.id]);
 const regels=p.soort==='damp'?(al?[['Tilly','De korst staat er weer. Niet aantikken, het brandt.'],['Professor Sneep',naam()+', het recept staat al in uw boek. Bevrijd het perkament nog een keer.']]:[['Tilly',naam()+', niet op die groene korst tikken. Het brouwsel brandt, en de stukken eronder zitten vast.'],['Professor Sneep','Iemand heeft in mijn kerker gemorst. Het stolsel groeit na elke beurt. Eronder verschuift u niets.'],['Tilly','In het midden ligt het recept. Vier korsten houden het vast. Maak die vrij.'],['Professor Sneep','Affodilwortel in een aftreksel van alsem. Dat is het Vocht van de Levende Dood. Daarmee gaat later driekwart van het stolsel weg. Zonder dat flesje is de echte plaag te veel om te winnen.'],['Professor Sneep','En onthoud dit: monnikskap en wolfswortel zijn dezelfde plant. Akoniet. Wie daar verschil in ziet, heeft niet opgelet.']]):al?[['Tilly','De ranken staan er weer. Niet op de stekels tikken, dat doet zeer.'],['Professor Stronk',naam()+', het recept heb je al. Bevrijd het perkament nog een keer, dan oefen je voor de echte plaag.']]:[['Tilly',naam()+', niet op die paarse ranken tikken. De stekels doen zeer, en de stukken eronder zitten vast.'],['Professor Stronk','Dit is duivelsstrik. Hij houdt van donker en vochtig, en hij groeit na elke beurt. Eronder kun je niets verschuiven.'],['Tilly','In het midden ligt het recept voor Lichtbrouwsel. Vier ranken houden het vast. Maak die vrij.'],['Professor Stronk','Daarna brouw je het in de kas: valeriaan, alsem en affodil. Zonder dat flesje is een echte plaag te veel om te winnen.']];
 verhaal(regels,()=>m3Speel(n,thema,Object.assign({},boost,{_stronkKlaar:1})))}
const _speelP=m3Speel;m3Speel=function(n,thema,boost){boost=boost||{};const p=plaagVan(n);
 if(p&&p.intro&&!boost._stronkKlaar)return introLes(n,thema,boost);
 if(p&&!boost._stronkKlaar)return stronkVraag(n,thema,boost);
 return _speelP(n,thema,boost)};
const _naB=window.m3NaBord;window.m3NaBord=function(b,boost){if(_naB)try{_naB(b,boost)}catch(e){}
 if(b&&b.L&&b.L.plaag&&!b.L.plaag.intro&&b.strik&&!b.heeftZet()){b.strikDicht=1;b.zet=0;setTimeout(()=>{try{M3.einde&&M3.einde()}catch(e){}},500)}};

function nodigHtml(m){return `<span class="mixnodig">${m.nodig.map(([id,n])=>{const heb=voorraad(id);const pl=isFles(id)?`<i class="flesje"></i>`:plantSVG(3,(ZADEN[id]||[])[4],id);return `<span>${pl}<small>${kruidNaam(id)}</small><b>${heb}/${n}</b></span>`}).join('')}</span>`}
function voorraadStrip(){const ids=Object.keys(ZADEN);const rij=ids.map(id=>`<span>${plantSVG(3,ZADEN[id][4],id)}<small>${kruidNaam(id)}</small><b>${voorraad(id)}</b></span>`).join('');const fles=MIXEN.map(m=>`<span><i class="flesje"></i><small>${m.naam}</small><b>${voorraad(m.id)}</b></span>`).join('');return `<p class="klein">Zoveel heb je van elk voorwerp.</p><div class="mixnodig voorraadstrip">${rij}${fles}</div>`}
function ingredientenBoek(){const o=document.createElement('div');o.className='modal';
 const teken=()=>{o.innerHTML=`<div class="modalin rococo kasblad"><h2>Recepten</h2>${voorraadStrip()}<p class="klein">Tik een mix aan als je alles hebt.</p><div class="zlijst">${MIXEN.map(m=>{const st=mixStatus(m);if(!st.open)return `<button class="zkoop dicht" disabled><b>${m.naam}</b><small>${m.slot||('Komt in het boek na level '+m.na+'.')}</small></button>`;return `<button class="zkoop ${st.klaar?'klaar':''}" data-mix="${m.id}"><b>${m.naam}</b>${nodigHtml(m)}<small>${m.zin}</small><small class="mixheb">${st.klaar?'Je hebt alles':'Je mist nog '+st.miss.map(([id])=>kruidNaam(id)).join(' en ')}</small></button>`}).join('')}</div><button class="knop" id="boekdicht">Sluiten</button></div>`;
  o.querySelectorAll('[data-mix]').forEach(b=>b.onclick=()=>brouw(b.dataset.mix,teken));
  o.querySelector('#boekdicht').onclick=()=>o.remove()};
 teken();document.body.appendChild(o)}
function brouw(id,teken){const m=MIXEN.find(x=>x.id===id);const st=mixStatus(m);if(!st.open)return;if(!st.klaar){toast('Je mist nog '+st.miss.map(([i])=>kruidNaam(i)).join(' en ')+'.');try{fx.speel('fout')}catch(e){}return}
 m.nodig.forEach(([i,n])=>{if(isFles(i))S.flesjes[i]-=n;else S.oogst[i]=(S.oogst[i]|0)-n});S.flesjes[m.id]=(S.flesjes[m.id]|0)+1;bewaar();try{fx.speel('munt')}catch(e){}try{vib([20,30,40])}catch(e){}toast(m.naam+' staat in de kist.');teken()}
function ingredientenKist(){const o=document.createElement('div');o.className='modal';
 const oogst=Object.keys(ZADEN).filter(id=>voorraad(id)>0).map(id=>`<div class="zkoop vanjou">${plantSVG(3,ZADEN[id][4],id)}<b>${kruidNaam(id)}</b><small>${voorraad(id)} geoogst</small></div>`).join('')||'<p class="klein">Nog geen oogst in de kist.</p>';
 const fles=MIXEN.map(m=>`<div class="zkoop vanjou"><i class="flesje"></i><b>${m.naam}</b><small>${voorraad(m.id)} ${voorraad(m.id)===1?'flesje':'flesjes'}</small></div>`).join('');
 const zaad=Object.entries(S.zaden||{}).filter(([,n])=>n>0).map(([z,n])=>ZADEN[z]?`<div class="zkoop vanjou">${plantSVG(0,ZADEN[z][4],z)}<b>${ZADEN[z][0]}</b><small>${n} ${n===1?'zaadje':'zaadjes'}</small></div>`:'').join('')||'<p class="klein">Geen zaadjes.</p>';
 const superz=Object.entries(S.superzaad||{}).filter(([,n])=>n>0).map(([z,n])=>{const d=window.SUPERPLANTEN&&window.SUPERPLANTEN[z];return d?`<div class="zkoop vanjou"><b>${d.naam}</b><small>${n} superzaad</small></div>`:''}).join('');
 const boost=typeof BOOSTERS=='undefined'?'':Object.entries(BOOSTERS).map(([k,d])=>`<span class="${S.bo[k]?'':'nul'}"><img src="img/pu/${d.img}.webp" alt="">${d.naam} ${S.bo[k]||0}</span>`).join('');
 o.innerHTML=`<div class="modalin rococo kasblad"><h2>Inventaris</h2><p class="klein">Drakenmest: ${S.mest||0}. Brouwen doe je bij Recepten.</p><h3>Oogst</h3><div class="zlijst">${oogst}${fles}</div><h3>Zaadjes</h3><div class="zlijst">${zaad}</div>${superz?`<h3>Superzaad</h3><div class="zlijst">${superz}</div>`:''}${boost?`<h3>Extra’s</h3><div class="bokist">${boost}</div>`:''}<button class="knop" id="kistdicht">Sluiten</button></div>`;
 document.body.appendChild(o);o.querySelector('#kistdicht').onclick=()=>o.remove()}
window.ingredientenBoek=ingredientenBoek;window.ingredientenKist=ingredientenKist;

const _icoP=m3DoelIco;m3DoelIco=function(d,T,L){if(d[0]=='recept'){const groen=L&&L.plaag&&L.plaag.soort==='damp';return `<svg viewBox="0 0 24 24" class="m3ico" style="background:${groen?'#1d6b45':'#7a3ea8'}"><path d="M6 3h9l3 3v15H6z" fill="#f3e2b8" stroke="#fff" stroke-width="1.4"/><path d="M15 3v3h3" fill="none" stroke="#fff" stroke-width="1.4"/><circle cx="12" cy="14" r="2.2" fill="${groen?'#b6f0c8':'#c45cff'}"/></svg>`}return _icoP.apply(this,arguments)};
const _winstP=m3Winst;m3Winst=function(n,b){let vers='';const p=plaagVan(n);if(p&&p.intro&&!(S.receptOpen&&S.receptOpen[p.id])){S.receptOpen[p.id]=1;vers=p.naam}const r=_winstP(n,b);
 if(vers){const h=document.querySelector('.m3eind');const kn=h&&h.querySelector('.knop');if(kn)kn.insertAdjacentHTML('beforebegin','<p class="klein">'+vers+' staat in je receptenboek.</p>')}return r};
/* Telefoon die de testkist al kreeg: oogst erbij, zodat de mixpen te proberen zijn. */
function proefMix(){if(S.proefMix||!S.proefKist)return;S.proefMix=1;S.oogst=S.oogst||{};['valeriaan','alsem','affodil','mandragora'].forEach(z=>{S.oogst[z]=Math.max(S.oogst[z]|0,3)});S.flesjes=S.flesjes||{};S.flesjes.licht=Math.max(S.flesjes.licht|0,1);S.flesjes.diep=Math.max(S.flesjes.diep|0,1);S.flesjes.vocht=Math.max(S.flesjes.vocht|0,1);bewaar()}
proefMix();
