'use strict';
/* Pompoenmeter: pompoen-combi's laten 5 pompoenen groeien. Vol = naar Hagrids moestuin. */
(function(){
S.pomp=S.pomp||{g:[0,0,0,0,0]};if(S.pomp.g.every(x=>x<=4)&&S.pomp.g.some(x=>x>0)&&!S.pomp.v2)S.pomp.g=S.pomp.g.map(x=>x*5);S.pomp.v2=1;const MAX=20;
/* pompoen als 5e stuk, zodat hij ook in vroege levels (5 kleuren) meedoet */
function pompIdx(th){const l=KU.RECEPT[th];return l?l.findIndex(r=>r[3]=='pompoen'):-1}
Object.keys(KU.RECEPT).forEach(th=>{const l=KU.RECEPT[th],p=pompIdx(th);if(p>4){[l[4],l[p]]=[l[p],l[4]];if(M3THEMA[th])M3THEMA[th].t=l.map(r=>[r[0],r[1],'M12 4v16'])}});try{KU.wis()}catch(e){}
const vol=()=>S.pomp.g.every(x=>x>=MAX);
function pompSvg(c){if(c<=0)return `<svg viewBox="0 0 60 60" class="pp-knop"><path d="M30 44c-6 0-9-6-6-11 2-3 4-4 6-4s4 1 6 4c3 5 0 11-6 11z" fill="#9ccf5a" stroke="#4e7a22" stroke-width="2"/><path d="M30 29v-6" stroke="#4e7a22" stroke-width="3" stroke-linecap="round"/></svg>`;
 const f=Math.min(1,c/MAX),s=.3+.7*f,mix=(a,b)=>Math.round(a+(b-a)*f),kl=`rgb(${mix(168,255)},${mix(207,127)},${mix(74,20)})`,sk=`rgb(${mix(95,168)},${mix(138,70)},${mix(32,10)})`;
 return `<svg viewBox="0 0 60 60" class="pp-pomp"><g transform="translate(30 52) scale(${s.toFixed(3)}) translate(-30 -52)"><ellipse cx="18" cy="38" rx="11" ry="15" fill="${kl}" stroke="${sk}" stroke-width="2"/><ellipse cx="42" cy="38" rx="11" ry="15" fill="${kl}" stroke="${sk}" stroke-width="2"/><ellipse cx="30" cy="38" rx="12" ry="17" fill="${kl}" stroke="${sk}" stroke-width="2"/><path d="M30 22c0-5 2-7 5-9" stroke="#4e7a22" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="25" cy="31" rx="3" ry="6" fill="#fff" opacity=".25"/></g></svg>`}
function meterHTML(){return `<div class="pompmeter" id="pompmeter" title="Pompoenmeter: maak combi's met pompoenen"><svg class="pp-rank" viewBox="0 0 300 40" preserveAspectRatio="none"><path d="M4 22 C40 8 70 34 110 20 S180 8 220 22 S275 30 296 16" stroke="#4e7a22" stroke-width="4" fill="none" stroke-linecap="round"/>${[30,90,150,210,265].map((x,i)=>`<path d="M${x} ${i%2?24:18} q10 -14 22 -6 q-8 12 -22 6z" fill="#5fa034" stroke="#3a6a18" stroke-width="1"/>`).join('')}</svg>${S.pomp.g.map((g,i)=>`<span class="pp-plek" data-i="${i}">${pompSvg(g)}<small class="pp-tel"></small></span>`).join('')}</div>`}
function teken(groei){const m=document.getElementById('pompmeter');if(!m)return;const cur=S.pomp.g.findIndex(x=>x<MAX);m.querySelectorAll('.pp-plek').forEach((el,i)=>{el.innerHTML=pompSvg(S.pomp.g[i])+`<small class="pp-tel">${i===cur?S.pomp.g[i]+'/'+MAX:''}</small>`;if(i===groei){el.classList.remove('groei');void el.offsetWidth;el.classList.add('groei')}})}
function groei(){const i=S.pomp.g.findIndex(x=>x<MAX);if(i<0)return;S.pomp.g[i]++;teken(i)}
window.pompGroei=groei;
function thVan(b){return Object.keys(M3THEMA).find(k=>M3THEMA[k]===b.T)}
const _td=Bord.prototype.telDoel;Bord.prototype.telDoel=function(t){try{if(!this.sim&&typeof M3!="undefined"&&this===M3.b&&typeof t=='number'){if(this._pi==null)this._pi=pompIdx(thVan(this));if(t===this._pi)groei()}}catch(e){}return _td.apply(this,arguments)};
const _opl=Bord.prototype.oplossen;Bord.prototype.oplossen=async function(){const r=await _opl.apply(this,arguments);if(!this.sim)bewaar();return r};
const POMP=['Pompoen','#ff8a1a',c=>{const i=window._ppImg||(window._ppImg=Object.assign(new Image(),{src:'img/stukken/pompoen-256.webp'}));if(i.complete&&i.naturalWidth)c.drawImage(i,-50,-50,100,100)},'pompoen'];
function zorgPomp(th){const l=KU.RECEPT[th];if(!l)return;let p=pompIdx(th);if(p<0){l[0]=POMP;p=0}else if(p>4){[l[4],l[p]]=[l[p],l[4]]}else return;if(M3THEMA[th])M3THEMA[th].t=l.map(r=>[r[0],r[1],'M12 4v16']);try{KU.wis()}catch(e){}}
const _sp=m3Speel;m3Speel=function(n,thema){try{zorgPomp(thema)}catch(e){}const r=_sp.apply(this,arguments);let t=0;const zet=()=>{const h=document.querySelector('.m3hud');if(h){if(!document.getElementById('pompmeter'))h.insertAdjacentHTML('afterend',meterHTML())}else if(t++<40)setTimeout(zet,150)};zet();return r};
const _w=m3Winst;m3Winst=function(n,b){const r=_w.apply(this,arguments);if(vol()&&!S.pomp.melding){S.pomp.melding=1;bewaar();setTimeout(()=>hagridRijp(),2600)}return r};
function hagridRijp(){if(document.querySelector('.modal'))return setTimeout(hagridRijp,900);const o=document.createElement('div');o.className='modal';
 o.innerHTML=`<div class="modalin rococo pp-hagrid">${window.portret?portret('hagrid'):''}<h2>Hagrid</h2><p>"Luna! Je pompoenen zijn rijp! Zo groot heb ik ze sinds Halloween niet meer gezien. Kom maar naar m'n moestuin achter de hut. Muil blijft binnen, beloofd."</p><p class="klein">Tik drie pompoenen open. In elke pompoen zit iets.</p><div class="stronk-knoppen"><button class="knop volgende" id="ppga">Naar Hagrids moestuin</button><button class="knop" id="pplater">Straks</button></div></div>`;
 document.body.appendChild(o);o.querySelector('#ppga').onclick=()=>{o.remove();ga('moestuin')};o.querySelector('#pplater').onclick=()=>o.remove()}
window.hagridRijp=hagridRijp;
function beloning(){const r=Math.random();
 if(r<.3){const pool=KAARTEN.filter(k=>k[3]);const k=pool[Math.random()*pool.length|0];return {t:'kaart',n:k[0],img:k[3],zin:'Tovenaarskaart: '+k[0]}}
 if(r<.6){const n=[20,30,40,60][Math.random()*4|0];return {t:'smek',n,img:'img/smekkies/zak-vol-128.webp',zin:n+' Smekkies'}}
 if(r<.72){const ks=Object.keys(BOOSTERS);const k=ks[Math.random()*ks.length|0];return {t:'bo',n:k,img:'img/pu/'+BOOSTERS[k].img+'.webp',zin:'Booster: '+BOOSTERS[k].naam}}
 if(r<.86&&(S.m3lvl|0)>=40&&window.SUPERPLANTEN){const z=zeldzaamKies(),d=SUPERPLANTEN[z];return {t:'zaad',z,img:`img/kas/${d.beeld}-4.webp`,zin:'Zeldzaam zaadje: '+d.naam}}
 return {t:'kikker',img:'img/stukken/chocokikker-128.webp',zin:'Chocokikker: +1 hart'}}
function geef(b){if(b.t=='zaad'&&window.zeldzaamZaad)zeldzaamZaad('pompoen',{stil:1,z:b.z});if(b.t=='kaart')S.kaarten[b.n]=(S.kaarten[b.n]||0)+1;if(b.t=='smek')S.galjoenen+=b.n;if(b.t=='bo')S.bo[b.n]=(S.bo[b.n]|0)+1;if(b.t=='kikker'){try{levens();if(S.harten.n<5)S.harten.n++}catch(e){}}bewaar();try{stats()}catch(e){}}
function splat(el){const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
 for(let i=0;i<(RM?4:16);i++){const d=document.createElement('i');const pit=i%3==0;d.className='pp-stuk'+(pit?' pit':'');const a=Math.random()*6.283,v=60+Math.random()*90;d.style.cssText=`left:${cx}px;top:${cy}px;--dx:${Math.cos(a)*v}px;--dy:${Math.sin(a)*v-40}px;--r:${Math.random()*540-270}deg`;document.body.appendChild(d);setTimeout(()=>d.remove(),1300)}
 try{fx.speel('splat')}catch(e){}try{vib(30)}catch(e){}}
V.moestuin=()=>{VIEWDECOR.moestuin='bos';if(!S.pomp.inh)S.pomp.inh=Array.from({length:5},beloning);S.pomp.open=S.pomp.open||[];bewaar();
 const klaar=vol();
 app(`<div class="pp-tuin"><h2>Hagrids moestuin</h2><p class="pp-zeg">${portret?portret('hagrid','mini'):''}<span id="ppzin">${klaar?'Kies er drie. Niet te hard slaan, hè, het blijven pompoenen.':'De pompoenen zijn nog niet rijp. Maak pompoen-combi\'s in de levels!'}</span></p>
 <div class="pp-veld">${S.pomp.g.map((g,i)=>`<button class="pp-groot ${S.pomp.open.includes(i)?'open':''}" data-i="${i}" ${klaar?'':'disabled'}>${pompSvg(g)}<span class="pp-in"></span></button>`).join('')}</div>
 <div class="pp-rest" id="pprest"></div><button class="knop" onclick="ga('match3')">Terug naar de levels</button></div>`);
 const toon=(btn,b,echt)=>{btn.classList.add('open');btn.querySelector('.pp-in').innerHTML=`<img src="${b.img}" alt=""><small>${b.zin}</small>`;if(!echt)btn.classList.add('gemist')};
 S.pomp.open.forEach(i=>toon(document.querySelector(`.pp-groot[data-i="${i}"]`),S.pomp.inh[i],1));
 document.querySelectorAll('.pp-groot').forEach(btn=>btn.onclick=()=>{const i=+btn.dataset.i;if(!vol()||S.pomp.open.includes(i)||S.pomp.open.length>=3)return;S.pomp.open.push(i);const b=S.pomp.inh[i];geef(b);splat(btn);toon(btn,b,1);
  if(S.pomp.open.length>=3){$('#ppzin').textContent='Goed gedaan! Kijk, dit zat er in de andere twee. Volgend jaar groeien ze weer.';setTimeout(()=>{document.querySelectorAll('.pp-groot:not(.open)').forEach(x=>toon(x,S.pomp.inh[+x.dataset.i],0));S.pomp={g:[0,0,0,0,0],v2:1};bewaar()},1400)}else bewaar()})};
})();
