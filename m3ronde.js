'use strict';
/* v191–v193: 4/5 kleuren, klas-tegelsets, opdrachten, vormborden, kaders */
(()=>{
  const HEX={herinnerbal:'#ff2d3a',drankje:'#19d35a',hedwig:'#e8eefc',pompoen:'#ffb008',
    chocokikker:'#c47a32',drakenei:'#e04aff',boterbier:'#f0b43a',feniksveer:'#ff5a24',
    toverstaf:'#d4a05a',ketelcake:'#2470e8',
    'h-oorwarmers':'#e02070','h-mandragora':'#3cb820','h-zaadzak':'#f0c220','h-gieter':'#2aa8b8','h-takje':'#a060d0','h-boek':'#2f6a3a',
    'b-veer':'#2aa8c8','b-staf':'#e0b030','b-boek':'#1e3a6e',
    't-lila':'#6a20d0','t-hart':'#ff5a8a',
    'g-kopje':'#cfe0f0','g-knoop':'#5a1020','g-lucifer':'#e8a020','g-vogel':'#6a92c0','g-naald':'#f02830',
    'a-ster':'#ffd24a','a-kijk':'#b07830','a-kaart':'#1a2a58','a-bol':'#6a90c0','a-maan':'#f0e8d0',
    'v-schild':'#1e4a9a','v-slang':'#3a9a3a','v-vonk':'#ffe680','v-wolf':'#9a38c8'};

  /* Per vak een vaste set van 5 themategels. Wisselt niet binnen het vak. */
  const KLAS_SET={
    herbologie:['h-oorwarmers','h-mandragora','h-zaadzak','h-gieter','h-takje'],
    bezweringen:['herinnerbal','b-veer','b-staf','hedwig','b-boek'],
    toverdranken:['drankje','ketelcake','boterbier','t-lila','t-hart'],
    gedaante:['g-kopje','g-knoop','g-lucifer','g-vogel','g-naald'],
    astronomie:['a-ster','a-kijk','a-kaart','a-bol','a-maan'],
    verweer:['v-schild','feniksveer','v-slang','v-vonk','v-wolf'],
    fabeldieren:['feniksveer','hedwig','chocokikker','pompoen','drankje']
  };
  window.m3KlasSet=th=> (KLAS_SET[th]||KLAS_SET.herbologie).slice();

  const PROF_PORT={herbologie:'stronk',bezweringen:'banning',toverdranken:'sneep',
    gedaante:'anderling',astronomie:'sinistra',verweer:'lupos'};

  const OPDRACHT_ZIN={
    'h-oorwarmers':(n,w)=>`Vang ${n} oorwarmers voor ${w}`,
    'h-mandragora':(n,w)=>`Oogst ${n} mandragora\u2019s voor ${w}`,
    'h-zaadzak':(n,w)=>`Verzamel ${n} zakken zaad voor ${w}`,
    'h-gieter':(n,w)=>`Zoek ${n} gieters voor ${w}`,
    'h-takje':(n,w)=>`Pluk ${n} duivelsstrik-takjes voor ${w}`,
    herinnerbal:(n,w)=>`Vang ${n} herinnerballen voor ${w}`,
    'b-veer':(n,w)=>`Verzamel ${n} veren voor ${w}`,
    'b-staf':(n,w)=>`Zoek ${n} toverstokken voor ${w}`,
    hedwig:(n,w)=>`Vang ${n} uilen voor ${w}`,
    'b-boek':(n,w)=>`Verzamel ${n} toverspreukboeken voor ${w}`,
    drankje:(n,w)=>`Brouw ${n} drankjes voor ${w}`,
    ketelcake:(n,w)=>`Verzamel ${n} ketelcakes voor ${w}`,
    boterbier:(n,w)=>`Zet ${n} bekers boterbier voor ${w}`,
    't-lila':(n,w)=>`Brouw ${n} lila drankjes voor ${w}`,
    't-hart':(n,w)=>`Verzamel ${n} hartflesjes voor ${w}`,
    'g-kopje':(n,w)=>`Verzamel ${n} theekopjes voor ${w}`,
    'g-knoop':(n,w)=>`Zoek ${n} knopen voor ${w}`,
    'g-lucifer':(n,w)=>`Verzamel ${n} luciferdoosjes voor ${w}`,
    'g-vogel':(n,w)=>`Vang ${n} vogeltjes voor ${w}`,
    'g-naald':(n,w)=>`Verzamel ${n} speldenkussens voor ${w}`,
    'a-ster':(n,w)=>`Vang ${n} sterren voor ${w}`,
    'a-kijk':(n,w)=>`Zoek ${n} telescopen voor ${w}`,
    'a-kaart':(n,w)=>`Verzamel ${n} sterrenkaarten voor ${w}`,
    'a-bol':(n,w)=>`Verzamel ${n} kristallen bollen voor ${w}`,
    'a-maan':(n,w)=>`Vang ${n} manen voor ${w}`,
    'v-schild':(n,w)=>`Verzamel ${n} schilden voor ${w}`,
    feniksveer:(n,w)=>`Verzamel ${n} feniksveren voor ${w}`,
    'v-slang':(n,w)=>`Vang ${n} slangen voor ${w}`,
    'v-vonk':(n,w)=>`Vang ${n} vonken voor ${w}`,
    'v-wolf':(n,w)=>`Brouw ${n} wolfsworteldrankjes voor ${w}`
  };

  function stukVan(alle,id){
    const r=alle[id];if(!r)return null;
    const x=r.slice();if(HEX[id])x[1]=HEX[id];return x;
  }
  function zetPalet(){
    if(typeof KU==='undefined'||!KU.RECEPT)return;
    const alle={};
    Object.values(KU.RECEPT).forEach(l=>l.forEach(r=>{if(r&&r[3])alle[r[3]]=r.slice()}));
    /* nieuwe klas-stukken uit m3kunst (KU.stuk) als ze nog niet in een recept zitten */
    const ids=new Set(Object.keys(HEX).concat(Object.values(KLAS_SET).flat()));
    ids.forEach(id=>{
      if(alle[id])return;
      if(typeof KU.stuk==='function'){
        try{const r=KU.stuk(id);if(r&&r[3])alle[id]=r}catch(e){}
      }
    });
    Object.keys(KLAS_SET).concat(Object.keys(KU.RECEPT)).filter((th,i,a)=>a.indexOf(th)===i).forEach(th=>{
      const ids=KLAS_SET[th]||KLAS_SET.herbologie;
      const l=ids.map(id=>stukVan(alle,id)||alle[id]).filter(Boolean);
      if(l.length<5)return;
      /* staart: extra stukken voor oude 6/7-kleuren-paden, niet zichtbaar bij 5 kleuren */
      const rest=Object.keys(alle).map(id=>alle[id]).filter(r=>!l.some(x=>x[3]===r[3]));
      while(l.length<7&&rest.length)l.push(rest.shift().slice());
      KU.RECEPT[th]=l.slice(0,7);
      if(typeof M3THEMA!=='undefined'&&M3THEMA[th])M3THEMA[th].t=KU.RECEPT[th].map(r=>[r[0],r[1],'M12 4v16']);
    });
    try{if(KU.wis)KU.wis()}catch(e){}
  }
  zetPalet();
  try{if(typeof zorgPomp==='function')Object.keys(KU.RECEPT).forEach(zorgPomp)}catch(e){}
  zetPalet(); /* klas-set blijft leidend; pompoen wordt niet meer in de eerste vijf gezet */

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
..1111.
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
    if(!S.kalV193){S.kalV193=1;S.m3kal={};try{bewaar()}catch(e){}}
  }
  try{herkalibreer()}catch(e){}

  const _lvl=typeof m3Level==='function'?m3Level:null;
  if(_lvl)m3Level=function(n){
    const L=_lvl(n);
    const oudK=L.kleuren|0;
    const kal=((S.m3kal||{})[n]||0)|0;
    const basis=Math.max(8,(L.zetten|0)-kal);
    L.kleuren=n<=10?4:5;
    (L.doelen||[]).forEach(d=>{if(typeof d[0]==='number')d[0]=((d[0]%L.kleuren)+L.kleuren)%L.kleuren});
    let z=basis;
    if(n>10){
      if(oudK>=7&&z>=18)z=Math.max(12,Math.round(z*0.90));
      else if(oudK>=6&&n>15&&z>=22)z=Math.max(14,Math.round(z*0.94));
    }
    L.zetten=z+kal;
    const v=m3VormVan(n);
    L.vorm=v.naam;L.rijen=v.R;L.kol=v.K;
    voegDoelen(L,n);
    return L;
  };

  function isOpdracht(n){
    n=n|0;
    if(n<12)return false;
    if(n%9!==3)return false;
    if(n>=23&&n%24===23)return false;
    if(n>=18&&n%20===18)return false;
    return true;
  }
  window.m3IsOpdracht=isOpdracht;
  function opdrachtVan(n){
    if(!isOpdracht(n))return null;
    const vak=typeof m3VakVoor==='function'?m3VakVoor(n):{thema:'herbologie',prof:'Professor Stronk',id:'herbologie'};
    const thema=vak.thema||'herbologie';
    const ids=KLAS_SET[thema]||KLAS_SET.herbologie;
    const idx=((Math.floor((n-12)/9))%ids.length+ids.length)%ids.length;
    const id=ids[idx];
    const wie=vak.prof||'de professor';
    const port=PROF_PORT[vak.id]||PROF_PORT[thema]||'stronk';
    return {wie:port,naam:wie,tegel:idx,id};
  }
  window.m3OpdrachtVan=opdrachtVan;

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
    /* speciale opdracht: ongeveer 1 op 9 levels, met een klas-tegel en de professor */
    const op=opdrachtVan(n);
    if(op){
      const aantal=Math.max(14,Math.min(50,Math.round(Z*(n<40?0.65:n<80?0.85:1.05))));
      L.doelen=L.doelen||[];
      L.doelen=L.doelen.filter(d=>typeof d[0]!=='number');
      L.doelen.unshift([op.tegel,aantal]);
      if(L.doelen.length>3)L.doelen=L.doelen.slice(0,3);
      const zin=(OPDRACHT_ZIN[op.id]||((k,w)=>`Verzamel ${k} voor ${w}`))(aantal,op.naam);
      L.opdracht={wie:op.wie,naam:op.naam,titel:'Opdracht van '+op.naam,zin,tegel:op.tegel,id:op.id,aantal};
    }else{
      L.opdracht=null;
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
    this.vormTekenRand=(ctx,cel)=>m3VormTekenRand(this,ctx,cel);
    this.vormClip=(ctx,cel)=>m3VormClip(ctx,this,cel);
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
  window.m3SpeelFn=function(b){
    return (r,c)=>r>=0&&r<RIJEN&&c>=0&&c<KOL&&b&&!b.gatCel(r,c);
  };
  window.m3SpeelBox=function(b){
    let r0=RIJEN,r1=-1,c0=KOL,c1=-1;
    for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
      if(b&&b.gatCel(r,c))continue;
      if(r<r0)r0=r;if(r>r1)r1=r;if(c<c0)c0=c;if(c>c1)c1=c;
    }
    if(r1<0){r0=0;r1=Math.max(0,RIJEN-1);c0=0;c1=Math.max(0,KOL-1)}
    return {r0,r1,c0,c1,R:r1-r0+1,K:c1-c0+1};
  };
  window.m3VormRingen=function(b){
    const speel=m3SpeelFn(b);
    const edges=[];
    for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
      if(!speel(r,c))continue;
      if(!speel(r-1,c))edges.push([c,r,c+1,r]);
      if(!speel(r,c+1))edges.push([c+1,r,c+1,r+1]);
      if(!speel(r+1,c))edges.push([c+1,r+1,c,r+1]);
      if(!speel(r,c-1))edges.push([c,r+1,c,r]);
    }
    const startAt={};
    edges.forEach((e,i)=>{const k=e[0]+','+e[1];(startAt[k]||(startAt[k]=[])).push(i)});
    const used=new Set(),ringen=[];
    for(let i=0;i<edges.length;i++){
      if(used.has(i))continue;
      const loop=[];
      let cur=i,guard=0;
      while(cur!=null&&!used.has(cur)&&guard++<4096){
        used.add(cur);
        const e=edges[cur];
        loop.push([e[0],e[1]]);
        const cands=startAt[e[2]+','+e[3]]||[];
        cur=cands.find(j=>!used.has(j));
      }
      if(loop.length>=4)ringen.push(loop);
    }
    return ringen;
  };
  window.m3VormPad=function(b,cel){
    const path=new Path2D();
    const rad=Math.min(cel*.22,16);
    const ringen=m3VormRingen(b);
    ringen.forEach(loop=>{
      const n=loop.length;if(n<2)return;
      for(let i=0;i<n;i++){
        const prev=loop[(i-1+n)%n],p=loop[i],next=loop[(i+1)%n];
        const ix=p[0]-prev[0],iy=p[1]-prev[1];
        const ox=next[0]-p[0],oy=next[1]-p[1];
        const dIn=Math.hypot(ix,iy)||1,dOut=Math.hypot(ox,oy)||1;
        const r=Math.min(rad,(dIn*cel)*.5-0.2,(dOut*cel)*.5-0.2);
        const x=p[0]*cel,y=p[1]*cel;
        const ax=x-(ix/dIn)*r,ay=y-(iy/dIn)*r;
        const bx=x+(ox/dOut)*r,by=y+(oy/dOut)*r;
        if(i===0)path.moveTo(ax,ay);else path.lineTo(ax,ay);
        path.quadraticCurveTo(x,y,bx,by);
      }
      path.closePath();
    });
    return path;
  };
  window.m3VormClip=function(ctx,b,cel){
    const st=m3VormStijl(b&&b.L);if(!st||st.naam==='groot')return;
    ctx.clip(m3VormPad(b,cel),'evenodd');
  };
  window.m3VormTeken=function(b,ctx,cel,nu){
    const st=m3VormStijl(b.L);if(!st||st.naam==='groot')return;
    const path=m3VormPad(b,cel);
    ctx.save();
    ctx.fillStyle=st.vulling&&st.vulling.replace('rgba','rgba')||'rgba(246,228,186,.94)';
    const cream=ctx.createLinearGradient(0,0,0,RIJEN*cel);
    cream.addColorStop(0,'#fff3d4');
    cream.addColorStop(.55,'#f4e0b0');
    cream.addColorStop(1,'#e8cb8a');
    ctx.fillStyle=cream;
    ctx.shadowColor='rgba(0,0,0,.38)';
    ctx.shadowBlur=Math.max(8,cel*.2);
    ctx.shadowOffsetY=Math.max(3,cel*.06);
    ctx.fill(path,'evenodd');
    ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    ctx.restore();
  };
  window.m3VormTekenRand=function(b,ctx,cel){
    const st=m3VormStijl(b.L);if(!st||st.naam==='groot')return;
    const path=m3VormPad(b,cel);
    ctx.save();
    ctx.lineJoin='round';ctx.lineCap='round';
    ctx.strokeStyle=st.rand;ctx.globalAlpha=.98;ctx.lineWidth=Math.max(3.2,cel*.1);
    ctx.stroke(path);
    ctx.strokeStyle=st.rand2;ctx.globalAlpha=.9;ctx.lineWidth=Math.max(1.4,cel*.04);
    ctx.stroke(path);
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
  window.m3OpdrachtVoorKaart=function(n){
    const L=typeof m3Level==='function'?m3Level(n):null;
    const voor=document.querySelector('.m3voor');if(!voor)return;
    if(voor.tagName==='P'||/klaargezet/.test(voor.textContent||''))return;
    const oude=voor.querySelector('.m3opdrachtkaart');
    if(!L||!L.opdracht){if(oude)oude.remove();return}
    const o=L.opdracht;
    const port=window.portret?portret(o.wie,'m3op-port'):'';
    const html=port+'<div><b>'+o.titel+'</b><p>'+o.zin+'</p></div>';
    if(oude){oude.innerHTML=html;return}
    const el=document.createElement('div');el.className='m3opdrachtkaart';
    el.innerHTML=html;
    const kop=voor.querySelector('.m3vak')||voor.querySelector('h2');
    if(kop&&kop.parentNode)kop.after(el);else voor.insertBefore(el,voor.firstChild);
  };
  const _vm=V.match3;
  if(_vm)V.match3=async function(n,...a){
    const r=await _vm.apply(this,arguments);
    const nr=n||((typeof S!=='undefined'&&S.m3lvl)|0)||1;
    m3Na(()=>{m3OpdrachtVoorKaart(nr);m3VormVoorKaart(nr)});
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
