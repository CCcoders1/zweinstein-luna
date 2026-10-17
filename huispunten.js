'use strict';
/* Huispunten: vier zandlopers in De Hal. Haar huis verdient punten met levelsterren; de andere huizen groeien mee met haar voortgang. */
(function(){
const HP={griffoendor:{gem:'#d0142c',gem2:'#ff6a7a',metaal:'#d9a93a',metaal2:'#7a5410',naam:'Griffoendor',steen:'robijnen'},
 zwadderich:{gem:'#14a050',gem2:'#7af0a8',metaal:'#c9ced4',metaal2:'#5a6068',naam:'Zwadderich',steen:'smaragden'},
 ravenklauw:{gem:'#2456d6',gem2:'#8ab4ff',metaal:'#c08a4a',metaal2:'#5a3a18',naam:'Ravenklauw',steen:'saffieren'},
 huffelpuf:{gem:'#f2c418',gem2:'#fff3a0',metaal:'#3a332a',metaal2:'#c9962a',naam:'Huffelpuf',steen:'gele diamanten'}};
const VOLG=['griffoendor','zwadderich','ravenklauw','huffelpuf'];
const PUNT={3:10,2:5,1:1},DOEL=.75*10+.25*5;
S.lvSter=S.lvSter&&typeof S.lvSter=='object'?S.lvSter:{};
/* bestaande levels zonder sterrendata tellen als 2 sterren */
(function(){const t=(S.m3lvl|0)-1;let g=0;for(let n=1;n<=t;n++)if(!S.lvSter[n]){S.lvSter[n]=2;g=1}if(g)bewaar()})();
/* huisschilden per level = beste aantal sterren (max 3); bij opnieuw spelen alleen het verschil */
if(!S.lvSchild||typeof S.lvSchild!='object'){S.lvSchild={};Object.keys(S.lvSter).forEach(k=>S.lvSchild[k]=S.lvSter[k]|0);bewaar()}
const sterVan=b=>{const z=b&&b.zet|0;return z>=5?3:z>=2?2:1};
if(typeof m3Winst=='function'){const _w=m3Winst;window.m3Winst=m3Winst=function(n,b,...a){const st=sterVan(b),oud=S.lvSter[n]|0;if(st>oud)S.lvSter[n]=st;const al=S.lvSchild[n]|0,sch=Math.max(0,st-al);S.lvSchild[n]=Math.max(al,st);S.schilden=(S.schilden|0)+sch;bewaar();window._schildTekst=sch?`<b>+${sch} ${sch==1?'huisschild':'huisschilden'}</b> voor de lokalen · `:`<b>Maximaal aantal huisschilden voor dit level al gehaald</b> · `;const r=_w.call(this,n,b,...a);
 try{const h=HP[S.huis];const p=document.querySelector('.m3eind p');if(p&&h){const erbij=Math.max(0,PUNT[st]-(PUNT[oud]||0));p.insertAdjacentHTML('afterend',`<p class="hp-winst"><span class="hp-sterren">${'★'.repeat(st)}${'☆'.repeat(3-st)}</span><br>${erbij?`+${erbij} huispunten voor ${h.naam}`:`Je beste score blijft ${'★'.repeat(oud)}`}<br><small>3 sterren: win met 5 of meer zetten over · 2 sterren: 2 of meer</small></p>`)}}catch(e){}return r}}
function stand(){const L=Object.keys(S.lvSter).filter(k=>S.lvSter[k]>0);const n=L.length;let eigen=0,c3=0,c2=0;L.forEach(k=>{const s=S.lvSter[k];eigen+=PUNT[s]||0;if(s==3)c3++;if(s==2)c2++});
 const hash=x=>{x=Math.sin(x*12.9898+78.233)*43758.5453;return x-Math.floor(x)};const f=[.965,.94,.915];const pts={};let j=0;
 VOLG.forEach(h=>{if(h==S.huis){pts[h]=eigen;return}const k=f[j]+(hash(n+j*7)-.5)*.02;pts[h]=Math.round(n*DOEL*k)+(j*7+3)*(n>0?1:0);j++});
 return {pts,n,p3:n?Math.round(c3/n*100):0,p2:n?Math.round(c2/n*100):0}}
window.huispuntenStand=stand;
function zandloper(h,pts,max,id){const c=HP[h],fr=Math.max(.04,Math.min(1,max?pts/max:0)),top=1-fr*.85;
 const gems=(cx,cy,w,hh,k,seed)=>{let s='';let r=seed;const rnd=()=>{r=(r*9301+49297)%233280;return r/233280};for(let i=0;i<k;i++){const x=cx-w/2+rnd()*w,y=cy+rnd()*hh,rr=2.2+rnd()*1.6;s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${rnd()<.3?c.gem2:c.gem}"/>`}return s};
 const tY=92-68*((1-fr)*.8+.06),bh=78,by=104+bh*(1-fr);/* onderbol vult van onder (182) naar boven (104) */
 return `<svg viewBox="0 0 120 210" class="hp-svg" aria-hidden="true"><defs>
 <linearGradient id="m${id}" x1="0" x2="1"><stop offset="0" stop-color="${c.metaal2}"/><stop offset=".45" stop-color="${c.metaal}"/><stop offset=".55" stop-color="#fff8e0" stop-opacity=".9"/><stop offset=".7" stop-color="${c.metaal}"/><stop offset="1" stop-color="${c.metaal2}"/></linearGradient>
 <radialGradient id="g${id}" cx=".4" cy=".35"><stop offset="0" stop-color="${c.gem2}"/><stop offset=".6" stop-color="${c.gem}"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
 <clipPath id="o${id}"><path d="M30 104 C30 104 22 140 26 160 C30 180 44 186 60 186 C76 186 90 180 94 160 C98 140 90 104 90 104 C80 98 66 98 64 96 L56 96 C54 98 40 98 30 104Z"/></clipPath>
 <clipPath id="b${id}"><path d="M26 24 C24 50 34 70 56 92 L64 92 C86 70 96 50 94 24Z"/></clipPath></defs>
 <g clip-path="url(#b${id})"><rect x="20" y="${tY.toFixed(1)}" width="80" height="80" fill="url(#g${id})"/>${gems(60,tY+2,50,Math.max(4,90-tY),12,id*13+3)}</g>
 <g clip-path="url(#o${id})"><rect x="20" y="${by.toFixed(1)}" width="80" height="${(190-by).toFixed(1)}" fill="url(#g${id})"/>${gems(60,by+2,64,Math.max(6,186-by-4),Math.round(10+fr*40),id*7+1)}<ellipse cx="60" cy="${by.toFixed(1)}" rx="30" ry="3" fill="${c.gem2}" opacity=".5"/></g>
 <g class="hp-val" style="--kl:${c.gem};--kl2:${c.gem2}"><circle cx="60" cy="96" r="2.4" fill="${c.gem2}"/><circle cx="60" cy="96" r="2" fill="${c.gem}"/><circle cx="60" cy="96" r="2.2" fill="${c.gem2}"/></g>
 <path d="M26 24 C24 50 34 70 56 92 L56 98 C40 98 30 104 30 104 C22 140 26 160 26 160 C30 180 44 186 60 186 C76 186 90 180 94 160 C98 140 90 104 90 104 C80 98 64 98 64 98 L64 92 C86 70 96 50 94 24Z" fill="rgba(220,235,255,.10)" stroke="rgba(255,255,255,.55)" stroke-width="1.4"/>
 <path d="M34 30 C33 50 40 64 52 80" stroke="rgba(255,255,255,.45)" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M34 120 C30 140 32 160 40 172" stroke="rgba(255,255,255,.35)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
 <rect x="12" y="10" width="96" height="14" rx="4" fill="url(#m${id})" stroke="${c.metaal2}"/><rect x="12" y="186" width="96" height="14" rx="4" fill="url(#m${id})" stroke="${c.metaal2}"/>
 <rect x="8" y="196" width="104" height="8" rx="3" fill="url(#m${id})"/><rect x="8" y="6" width="104" height="7" rx="3" fill="url(#m${id})"/>
 ${[14,100].map(x=>`<rect x="${x}" y="22" width="6" height="166" rx="3" fill="url(#m${id})" stroke="${c.metaal2}" stroke-width=".6"/><circle cx="${x+3}" cy="104" r="5" fill="url(#m${id})"/>`).join('')}
 <circle cx="60" cy="17" r="4" fill="${c.gem}" stroke="${c.metaal2}"/><circle cx="60" cy="193" r="4" fill="${c.gem}" stroke="${c.metaal2}"/></svg>`}
function telOp(el,van,naar){const t0=performance.now(),d=1600;const f=nu=>{const k=Math.min(1,(nu-t0)/d),e=1-Math.pow(1-k,3);el.textContent=Math.round(van+(naar-van)*e).toLocaleString('nl-NL');if(k<1&&el.isConnected)requestAnimationFrame(f)};requestAnimationFrame(f)}
function sectie(){const st=stand(),max=Math.max(1,...Object.values(st.pts))*1.15;const eerste=VOLG.slice().sort((a,b)=>st.pts[b]-st.pts[a])[0];
 return `<section class="hp-zaal"><h3>De Afdelingsbeker</h3><div class="hp-rij">${VOLG.map((h,i)=>{const c=HP[h];const hz=window.HUIZEN&&HUIZEN[h];return `<div class="hp-huis" data-h="${h}"><div class="hp-kop" style="--kl:${c.gem};--m:${h=='huffelpuf'?c.gem:c.metaal}"><span>${hz?hz.i:''}</span><b>${c.naam}</b></div><div class="hp-glas">${zandloper(h,st.pts[h],max,i+1)}<i class="hp-glans"></i></div><div class="hp-bord" style="--m:${c.metaal};--m2:${c.metaal2}"><b class="hp-num" data-p="${st.pts[h]}">0</b><small>punten</small></div></div>`}).join('')}</div>
 <p class="hp-doel">Om voor te staan: 75% van je levels 3 sterren, 25% 2 sterren. Nu: <b>${st.p3}%</b> 3 sterren, <b>${st.p2}%</b> 2 sterren.${S.huis&&eerste===S.huis&&st.n?' '+HP[S.huis].naam+' staat bovenaan!':''}</p></section>`}
function plaats(){try{const app=$('#app');if(!app||app.querySelector('.hp-zaal'))return;const na=app.querySelector('.halspel');const html=sectie();if(na)na.insertAdjacentHTML('afterend',html);else app.insertAdjacentHTML('beforeend',html);
 S.hpGezien=S.hpGezien||{};const zaal=app.querySelector('.hp-zaal');zaal.querySelectorAll('.hp-huis').forEach(el=>{const h=el.dataset.h,n=el.querySelector('.hp-num'),p=+n.dataset.p,oud=Math.min(p,S.hpGezien[h]==null?Math.round(p*.85):S.hpGezien[h]);
  if(p>oud){el.classList.add('valt');setTimeout(()=>el.classList.remove('valt'),3200)}setTimeout(()=>telOp(n,oud,p),300);S.hpGezien[h]=p});bewaar()}catch(e){console.warn('huispunten',e)}}
const _pad=V.pad;if(_pad)V.pad=(...a)=>{const r=_pad(...a);try{document.querySelectorAll('.padlvl.af').forEach(b=>{const st=S.lvSter[+b.dataset.l]|0;if(st&&!b.querySelector('.padster'))b.insertAdjacentHTML('beforeend',`<span class="padster">${'★'.repeat(st)}<i>${'★'.repeat(3-st)}</i></span>`)})}catch(e){}return r};
const _home=V.home;V.home=(...a)=>{const r=_home(...a);plaats();setTimeout(plaats,60);return r};
})();
