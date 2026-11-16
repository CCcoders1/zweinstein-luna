'use strict';
/* v191–v192: 3/4 kleuren, vormborden, doelen, kaders en introkaart */
(()=>{
  const HEX={herinnerbal:'#ff2d3a',drankje:'#19d35a',hedwig:'#3d8cff',pompoen:'#ffb008',
    chocokikker:'#c47a32',drakenei:'#8b6ad4',boterbier:'#f0b43a',feniksveer:'#ff5a24',
    toverstaf:'#d4a05a',ketelcake:'#2a9ad4'};

  function stukVan(alle,id){
    const r=alle[id];if(!r)return null;
    const x=r.slice();if(HEX[id])x[1]=HEX[id];return x;
  }
  function zetPalet(){
    if(typeof KU==='undefined'||!KU.RECEPT)return;
    const alle={};
    Object.values(KU.RECEPT).forEach(l=>l.forEach(r=>{if(r&&r[3])alle[r[3]]=r.slice()}));
    const kern=['herinnerbal','drankje','pompoen','hedwig'].map(id=>stukVan(alle,id)).filter(Boolean);
    if(kern.length<4)return;
    const staart={
      herbologie:['h-takje','h-mandragora','h-boek'],
      bezweringen:['toverstaf','chocokikker','drakenei'],
      fabeldieren:['feniksveer','chocokikker','boterbier'],
      toverdranken:['ketelcake','boterbier','feniksveer'],
      astronomie:['ketelcake','toverstaf','drakenei'],
      gedaante:['ketelcake','toverstaf','feniksveer'],
      verweer:['feniksveer','toverstaf','drakenei']
    };
    Object.keys(KU.RECEPT).forEach(th=>{
      const extra=(staart[th]||[]).map(id=>stukVan(alle,id)||alle[id]).filter(Boolean);
      const l=kern.map(x=>x.slice()).concat(extra.map(x=>x.slice()));
      while(l.length<7){
        const rest=Object.keys(alle).map(id=>alle[id]).filter(r=>!l.some(x=>x[3]===r[3]));
        if(!rest.length)break;l.push(rest[0].slice());
      }
      KU.RECEPT[th]=l.slice(0,7);
      if(typeof M3THEMA!=='undefined'&&M3THEMA[th])M3THEMA[th].t=KU.RECEPT[th].map(r=>[r[0],r[1],'M12 4v16']);
    });
    try{if(KU.wis)KU.wis()}catch(e){}
  }
  zetPalet();
  try{if(typeof zorgPomp==='function')Object.keys(KU.RECEPT).forEach(zorgPomp)}catch(e){}
  zetPalet(); /* pompoen blijft index 2, zorgPomp mag hem niet naar 0 halen */

  /* ---- bordvormen: 1 in de tekening = speelbaar, . = gat ---- */
  const TEKEN={
    hart:`
.11.11.
1111111
1111111
1111111
.11111.
..111..
...1...
...1...`,
    hart9:`
..11.11.
.1111111
11111111
11111111
11111111
.111111.
..1111..
...11...
....1...`,
    bliksem:`
..11111
.11111.
.1111..
.11111.
..1111.
.1111..
.111...
111....`,
    kasteel:`
1.1.1.1
1111111
1111111
11...11
11...11
1111111
1111111
1111111`,
    ketel:`
.11111.
1111111
1111111
1111111
1111111
.11111.
..111..
...1...`
  };
  function leesMasker(s,R,K){
    const regels=s.trim().split(/\n/).map(x=>x.trim());
    const m=Array.from({length:R},()=>Array(K).fill(1));
    for(let r=0;r<Math.min(R,regels.length);r++){
      const row=regels[r];
      for(let c=0;c<Math.min(K,row.length);c++)m[r][c]=row[c]==='.'?1:0;
    }
    return m;
  }
  window.m3VormVan=function(n){
    n=n|0;
    if(n<=20)return{naam:'rechthoek',R:8,K:7};
    const t=n%16;
    if(t===3)return{naam:'hart',R:8,K:7};
    if(t===7)return{naam:'bliksem',R:8,K:7};
    if(t===11)return{naam:'kasteel',R:8,K:7};
    if(t===15)return{naam:'ketel',R:8,K:7};
    if(n>=40&&t===1)return{naam:'groot',R:9,K:8};
    if(n>=80&&t===5)return{naam:'groot',R:10,K:8};
    if(n>=120&&t===9)return{naam:'hart',R:9,K:8};
    return{naam:'rechthoek',R:8,K:7};
  };
  window.m3BordMaat=function(L){
    const v=L&&L.vorm?{naam:L.vorm,R:L.rijen||8,K:L.kol||7}:m3VormVan(L&&L.n||1);
    RIJEN=Math.max(6,Math.min(12,v.R|0||8));
    KOL=Math.max(6,Math.min(10,v.K|0||7));
  };
  window.m3BordGat=function(L){
    const naam=L&&L.vorm||'rechthoek';
    if(!naam||naam==='rechthoek'||naam==='groot')return null;
    const key=naam==='hart'&&RIJEN>=9?'hart9':naam;
    const s=TEKEN[key];if(!s)return null;
    return leesMasker(s,RIJEN,KOL);
  };

  function herkalibreer(){
    if(typeof S==='undefined')return;
    if(!S.kalV191){S.kalV191=1;S.m3kal={};try{bewaar()}catch(e){}}
  }
  try{herkalibreer()}catch(e){}

  const _lvl=typeof m3Level==='function'?m3Level:null;
  if(_lvl)m3Level=function(n){
    const L=_lvl(n);
    const oudK=L.kleuren|0;
    const kal=((S.m3kal||{})[n]||0)|0;
    const basis=Math.max(8,(L.zetten|0)-kal);
    L.kleuren=n<=10?3:4;
    (L.doelen||[]).forEach(d=>{if(typeof d[0]==='number')d[0]=((d[0]%L.kleuren)+L.kleuren)%L.kleuren});
    let z=basis;
    if(oudK>=7&&z>=18)z=Math.max(12,Math.round(z*0.80));
    else if(oudK>=6&&n>15&&z>=22)z=Math.max(14,Math.round(z*0.88));
    L.zetten=z+kal;
    const v=m3VormVan(n);
    L.vorm=v.naam;L.rijen=v.R;L.kol=v.K;
    voegDoelen(L,n);
    return L;
  };

  function voegDoelen(L,n){
    const heeft=t=>(L.doelen||[]).some(d=>d[0]===t);
    const Z=L.zetten+(L.extra||0);
    /* punten in N zetten: elke 24e, vanaf 23, niet op de allereerste */
    if(n>=23&&n%24===23&&!heeft('score')){
      L.doelen=(L.doelen||[]).filter(d=>typeof d[0]!=='number');
      L.doelen.unshift(['score',Math.max(700,Math.round(Z*48))]);
      if(L.doelen.length>3)L.doelen=L.doelen.slice(0,3);
    }
    /* kaarsen aansteken: elke 20e vanaf 18 */
    if(n>=18&&n%20===18&&!heeft('kaars')){
      L.doelen=L.doelen||[];
      L.doelen.push(['kaars',6]);
      if(L.doelen.length>3){
        const i=L.doelen.findIndex(d=>typeof d[0]==='number');
        if(i>=0)L.doelen.splice(i,1);else L.doelen=L.doelen.slice(0,3);
      }
    }
  }

  Bord.prototype.noodZet=function(){
    if(this.heeftZet())return;
    this.schud();
    if(this.heeftZet())return;
    for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
      const t=this.g[r][c];
      if(t&&t.k>=0&&!this.kist[r][c]&&!this.gatCel(r,c)&&!(this.strik&&this.strik[r]&&this.strik[r][c])&&!(this.ijs&&this.ijs[r]&&this.ijs[r][c])){t.s='bom';return}
    }
  };

  /* ---- kaarsen + score-teller op het bord ---- */
  if(typeof Bord!=='undefined')Bord.prototype.rondeInit=function(){
    const prevW=this.laatNaWis;
    this.laatNaWis=wis=>{
      if(prevW)prevW.call(this,wis);
      const scoreWas=(this.doel.find(d=>d.t==='score')||{}).over;
      this.doel.forEach(d=>{if(d.t==='score')d.over=Math.max(0,d.n-(this.score|0))});
      const scoreNu=this.doel.find(d=>d.t==='score');
      if(scoreNu&&scoreWas>0&&scoreNu.over<=0)this.fx.push({t:'scoreklaar',r:RIJEN>>1,c:KOL>>1});
      if(this.kaars&&wis){const aan=[];
        wis.forEach(x=>{
          const[r,c]=String(x).split(',').map(Number);
          if(this.kaars[r]&&this.kaars[r][c]===1){this.kaars[r][c]=2;aan.push([r,c])}
        });
        const kd=this.doel.find(x=>x.t==='kaars');
        if(kd)kd.over=this.kaars.flat().filter(v=>v===1).length;
        aan.forEach(([r,c],i)=>this.fx.push({t:'kaars',r,c,laatste:!!(kd&&kd.over<=0&&i===aan.length-1)}));
      }
    };
    this.vormTekenAchter=(ctx,cel,nu)=>m3VormTeken(this,ctx,cel,nu);
    const prevT=this.laatTeken;
    this.laatTeken=(ctx,cel,nu)=>{
      this.kaarsTeken&&this.kaarsTeken(ctx,cel,nu);
      if(prevT)prevT.call(this,ctx,cel,nu);
    };
    if(this.doel.some(d=>d.t==='kaars'))this.zetKaarsen();
    this.doel.forEach(d=>{if(d.t==='score')d.over=Math.max(0,d.n-(this.score|0))});
  };

  Bord.prototype.zetKaarsen=function(){
    this.kaars=Array.from({length:RIJEN},()=>Array(KOL).fill(0));
    const plek=[];
    const n=this.L.n|0;
    for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
      if(this.gatCel(r,c)||this.kist[r][c])continue;
      if(((r*5+c*3+n*7)%7)===0)plek.push([r,c]);
    }
    if(plek.length<4){
      for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
        if(this.gatCel(r,c)||this.kist[r][c])continue;
        if((r+c+n)%3===0)plek.push([r,c]);
      }
    }
    const max=6;let i=0;
    plek.forEach(([r,c])=>{if(i>=max||this.kaars[r][c])return;this.kaars[r][c]=1;i++});
    const d=this.doel.find(x=>x.t==='kaars');
    if(d){d.n=d.over=this.kaars.flat().filter(v=>v===1).length}
  };

  Bord.prototype.kaarsTeken=function(ctx,cel,nu){
    if(!this.kaars)return;
    for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
      const k=this.kaars[r][c];if(!k)continue;
      const x=c*cel+cel*.78,y=r*cel+cel*.2,s=cel*.26;
      ctx.save();ctx.translate(x,y);
      ctx.fillStyle='#f4e0b0';ctx.fillRect(-s*.22,0,s*.44,s*1.15);
      ctx.fillStyle='#c9a227';ctx.fillRect(-s*.3,s*1.1,s*.6,s*.18);
      if(k===2){
        const f=.85+.15*Math.sin(nu/80+r+c);
        ctx.globalCompositeOperation='lighter';
        const g=ctx.createRadialGradient(0,-s*.45,0,0,-s*.45,s*1.15*f);
        g.addColorStop(0,'#fffce0');g.addColorStop(.25,'#ffe08a');g.addColorStop(.55,'#ffb024');g.addColorStop(1,'rgba(255,80,0,0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,-s*.45,s*1.15*f,0,7);ctx.fill();
        ctx.shadowColor='#ffb024';ctx.shadowBlur=s*1.4;
        ctx.fillStyle='#fff3a0';ctx.beginPath();ctx.ellipse(0,-s*.4,s*.16,s*.42,0,0,7);ctx.fill();
      }else{
        ctx.fillStyle='#9a6a20';ctx.beginPath();ctx.moveTo(0,-s*.15);ctx.lineTo(s*.1,s*.05);ctx.lineTo(-s*.05,s*.05);ctx.fill();
      }
      ctx.restore();
    }
  };


  const VORMSTIJL={
    hart:{rand:'#c45a78',rand2:'#fff0f4',vulling:'rgba(200,80,110,.13)',gat:'rgba(120,40,60,.16)',titel:'Een hartvormig bord',zin:'Alleen de vakjes in het hart tellen. Tegels vallen door de openingen.'},
    bliksem:{rand:'#e8c44a',rand2:'#fff8d0',vulling:'rgba(230,190,40,.14)',gat:'rgba(70,50,10,.16)',titel:'Een bliksemschicht',zin:'Het bord volgt de bliksem. Spring van vak naar vak.'},
    kasteel:{rand:'#c9a227',rand2:'#efe0b8',vulling:'rgba(90,70,40,.12)',gat:'rgba(40,30,18,.2)',titel:'Een kasteelbord',zin:'Speel in de torens en muren van het kasteel.'},
    ketel:{rand:'#8a5a2b',rand2:'#f0d9a8',vulling:'rgba(70,110,50,.12)',gat:'rgba(40,30,16,.18)',titel:'Een ketelbord',zin:'De vakjes vormen een ketel. Laat de tegels naar de bodem vallen.'},
    groot:{rand:'#7a5ad4',rand2:'#efe6ff',vulling:'rgba(90,70,180,.1)',gat:'rgba(30,22,60,.12)',titel:'Een groot bord',zin:'Meer ruimte, meer mogelijkheden. Neem de tijd.'}
  };
  function m3VormStijl(L){
    const naam=(L&&L.vorm)||'rechthoek';
    if(naam==='hart'||naam==='bliksem'||naam==='kasteel'||naam==='ketel')return {naam,...VORMSTIJL[naam]};
    if(naam==='groot'||(L&&((L.rijen|0)>8||(L.kol|0)>7)))return {naam:'groot',...VORMSTIJL.groot};
    return null;
  }
  window.m3VormStijl=m3VormStijl;
  window.m3VormTeken=function(b,ctx,cel,nu){
    const st=m3VormStijl(b.L);if(!st)return;
    const speel=(r,c)=>r>=0&&r<RIJEN&&c>=0&&c<KOL&&!b.gatCel(r,c);
    ctx.save();
    /* zachte vulling in de gaten, zodat de vorm zich aftekent */
    for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
      if(speel(r,c))continue;
      ctx.fillStyle=st.gat;
      ctx.beginPath();ctx.roundRect(c*cel+1,r*cel+1,cel-2,cel-2,cel*.12);ctx.fill();
    }
    /* gouden/thema-rand langs de buitenkant van de vorm */
    ctx.lineJoin='round';ctx.lineCap='round';
    const teken= (kleur,dik,alpha)=>{
      ctx.strokeStyle=kleur;ctx.globalAlpha=alpha;ctx.lineWidth=dik;
      ctx.beginPath();
      for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
        if(!speel(r,c))continue;
        const x=c*cel,y=r*cel,m=cel*.16;
        if(!speel(r-1,c)){ctx.moveTo(x+m,y+1.5);ctx.lineTo(x+cel-m,y+1.5)}
        if(!speel(r+1,c)){ctx.moveTo(x+m,y+cel-1.5);ctx.lineTo(x+cel-m,y+cel-1.5)}
        if(!speel(r,c-1)){ctx.moveTo(x+1.5,y+m);ctx.lineTo(x+1.5,y+cel-m)}
        if(!speel(r,c+1)){ctx.moveTo(x+cel-1.5,y+m);ctx.lineTo(x+cel-1.5,y+cel-m)}
      }
      ctx.stroke();
    };
    teken(st.rand,Math.max(3,cel*.08),.95);
    teken(st.rand2,Math.max(1.4,cel*.035),.85);
    ctx.globalAlpha=1;
    /* kleine nopjes op de hoeken */
    ctx.fillStyle=st.rand2;
    for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
      if(!speel(r,c))continue;
      const hoek=[[-1,-1],[-1,1],[1,-1],[1,1]];
      hoek.forEach(([dr,dc])=>{
        if(speel(r+dr,c)||speel(r,c+dc))return;
        ctx.beginPath();ctx.arc(c*cel+(dc<0?4:cel-4),r*cel+(dr<0?4:cel-4),Math.max(1.6,cel*.05),0,7);ctx.fill();
      });
    }
    ctx.restore();
  };
  window.m3VormVoorKaart=function(n){
    const L=typeof m3Level==='function'?m3Level(n):null;const st=m3VormStijl(L);
    const voor=document.querySelector('.m3voor');if(!voor)return;
    if(voor.tagName==='P'||/klaargezet/.test(voor.textContent||''))return;
    const oude=voor.querySelector('.m3vormkaart');
    if(!st){if(oude)oude.remove();return}
    if(oude){if(oude.classList.contains('vorm-'+st.naam))return;oude.remove()}
    const doelen=voor.querySelector('.m3doelen-voor')||voor.querySelector('h2');
    const el=document.createElement('div');el.className='m3vormkaart vorm-'+st.naam;
    el.innerHTML='<i class="m3vormico" aria-hidden="true"></i><div><b>'+st.titel+'</b><p>'+st.zin+'</p></div>';
    if(doelen&&doelen.parentNode)doelen.after(el);else voor.appendChild(el);
  };
  function m3VormSpeel(n){
    const L=typeof m3Level==='function'?m3Level(n):null;const st=m3VormStijl(L);
    const bord=document.querySelector('.m3bord');
    const root=document.querySelector('.m3');
    if(bord){
      [...bord.classList].filter(c=>c==='m3vorm'||c.startsWith('m3vorm-')).forEach(c=>bord.classList.remove(c));
      if(st){bord.classList.add('m3vorm','m3vorm-'+st.naam)}
    }
    if(root){
      [...root.classList].filter(c=>c==='m3heeftvorm'||c.startsWith('m3vorm-')).forEach(c=>root.classList.remove(c));
      if(st){root.classList.add('m3heeftvorm','m3vorm-'+st.naam)}
    }
    const oude=document.getElementById('m3vormintro');
    if(!st){if(oude)oude.remove();return}
    if(oude){if(oude.classList.contains('vorm-'+st.naam))return;oude.remove()}
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    try{if(sessionStorage.getItem('zw_vorm_'+st.naam))return}catch(e){}
    const d=document.createElement('div');d.id='m3vormintro';d.className='m3vormintro vorm-'+st.naam;
    d.innerHTML='<div class="m3vormintro-in"><i class="m3vormico" aria-hidden="true"></i><b>'+st.titel+'</b><p>'+st.zin+'</p><small>Tik om verder te gaan</small></div>';
    (bord||document.body).appendChild(d);
    const weg=()=>{if(!d.parentNode)return;d.classList.add('uit');try{sessionStorage.setItem('zw_vorm_'+st.naam,'1')}catch(e){}setTimeout(()=>d.remove(),400)};
    d.addEventListener('pointerdown',weg);
    setTimeout(weg,2400);
  }
  function m3Na(fn){try{fn()}catch(e){}[80,200,450].forEach(t=>setTimeout(()=>{try{fn()}catch(e){}},t))}
  const _vm=V.match3;
  if(_vm)V.match3=async function(n,...a){
    const r=await _vm.apply(this,arguments);
    m3Na(()=>m3VormVoorKaart(n||((typeof S!=='undefined'&&S.m3lvl)|0)||1));
    return r;
  };
  const _sp=m3Speel;
  if(_sp)m3Speel=function(n,thema){
    const r=_sp.apply(this,arguments);
    const doe=()=>{try{m3VormSpeel(n)}catch(e){}};
    if(r&&typeof r.then==='function')r.then(doe,doe);else doe();
    [80,200,450].forEach(t=>setTimeout(doe,t));
    return r;
  };

  const _ico=typeof m3DoelIco==='function'?m3DoelIco:null;
  m3DoelIco=function(d,T,L){
    if(d[0]==='score')return `<svg viewBox="0 0 24 24" class="m3ico" style="background:#c9a227"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="#fff8d0" stroke="#5a3404" stroke-width="1.2"/></svg>`;
    if(d[0]==='kaars')return `<svg viewBox="0 0 24 24" class="m3ico" style="background:#5a2a12"><path d="M12 3c2 3 3 4.5 3 6.2 0 1.7-1.3 3-3 3s-3-1.3-3-3c0-1.7 1-3.2 3-6.2z" fill="#ffb024"/><path d="M10 12h4v8h-4z" fill="#f4e0b0"/><path d="M8.5 20h7v2h-7z" fill="#c9a227"/></svg>`;
    return _ico?_ico(d,T,L):'';
  };
})();
