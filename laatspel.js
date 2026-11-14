/* v141: rijp, uilenpost en sleutels; vanaf 401 combinaties (max 2 typ) en seizoenskleur. Geen economie. */
(function(){
const INTRO={302:'ijs',312:'pak',322:'sleutel'};
const KAART={
  ijs:['Rijp op de sterrenkaart','Z','Een laagje rijp op Sinistra’s kaart, precies in de vorm van een ontbrekend sterrenbeeld. Als je ernaast een les wint, smelt het vriendelijk weg.','img/kaarten/rijp-op-de-sterrenkaart.webp','Torenlessen'],
  pak:['Uilenpost uit het boswachtershuis','Z','Een bruin pakketje met lak en een veer. Hagrid zegt: laat het naar beneden vallen, niet openrukken. Onderin de les wacht de groet.','img/kaarten/uilenpost-uit-het-boswachtershuis.webp','Torenlessen'],
  sleutel:['De gevleugelde sleutel','Z','Een gouden sleutel met kleine vleugels. Banning liet hem ooit een rondje vliegen en zei: vang hem met een match ernaast, niet met je handen.','img/kaarten/de-gevleugelde-sleutel.webp','Torenlessen']
};
const LES={
  ijs:{wie:'Professor Sinistra',tekst:'Zien jullie die rijp op de tegels, Luna? Je kunt een bevroren tegel niet wisselen. Maak er wél een rij mee, door een buur te schuiven. Eén goede match smelt het laagje.',tilly:'Ik heb mijn sjaal meegenomen. En mijn vingers. We doen dit rustig, tegeltje voor tegeltje.'},
  pak:{wie:'Hagrid',tekst:'Uilenpost, Luna. Klein pakketje, lakzegel, een veer erop. Je kunt het niet wisselen. Ruim het vak eronder op, dan valt hij naar beneden. Als hij de onderste rij raakt, is hij binnen.',tilly:'Niet openmaken onderweg. Hagrid wordt daar zenuwachtig van, en de uil ook.'},
  sleutel:{wie:'Professor Banning',tekst:'Dit is een gevleugelde sleutel. Hij zit op een tegel en fladdert na elke zet naar een tegel ernaast. Maak een match op de tegel onder hem, dan vang je hem. Niet achternazitten met je handen.',tilly:'Ik hou mijn ogen erbij. Als hij wegfladdert, wijs ik gewoon naar de nieuwe plek.'}
};

function plekVan(n){return ((n-1)%10)+1}
function seizoenVan(n,d){
  d=d||(typeof zwNu==='function'?zwNu():new Date());
  const m=d.getMonth(), day=d.getDate();
  const winterKal=(m===11)||(m===0&&day<=6);
  let prim,sec,band;
  if(n<=450){prim='pak';sec='ijs';band='herfst'}
  else if(n<=500){prim='ijs';sec='sleutel';band='winter'}
  else if(n<=550){prim='pak';sec='sleutel';band='lente'}
  else {prim='sleutel';sec='ijs';band='zomer'}
  if(winterKal){if(prim!=='ijs'){sec=prim;prim='ijs'}band='winter'}
  return {prim,sec,band,winterKal};
}
function laatVan(n){
  n=+n||0;if(n<302||n>600)return null;
  if(INTRO[n])return {soort:INTRO[n],intro:1};
  const plek=plekVan(n);
  if(plek===1||plek===6)return null;
  if(n<=311)return {soort:'ijs'};
  if(n<=321)return {soort:'pak'};
  if(n<=331)return {soort:'sleutel'};
  /* 302–400: alleen plek 2 en 7, één type, ritme intact. */
  if(n<401){
    if(plek!==2&&plek!==7)return null;
    const pool=['ijs','pak','sleutel'];
    return {soort:pool[(n*5+3)%3]};
  }
  /* 401–600: combinaties (max 2 typ) op 2 en 7, één seizoenstype op 3 en 8. */
  const sz=seizoenVan(n);
  const derde=['ijs','pak','sleutel'].find(x=>x!==sz.prim&&x!==sz.sec);
  if(plek===2||plek===7)return {soort:sz.prim,extra:sz.sec,seizoen:sz.band,winter:sz.winterKal};
  if(plek===3||plek===8)return {soort:plek===3?sz.prim:(derde||sz.sec),seizoen:sz.band,winter:sz.winterKal};
  return null;
}
window.laatVan=laatVan;
window.seizoenVan=seizoenVan;

function typen(L){
  const t=new Set();
  if(L.onkruid)t.add('o');
  if(L.kist)t.add('k');
  if(L.pot)t.add('p');
  if(L.plaag)t.add('plaag');
  (L.doelen||[]).forEach(d=>{if(d[0]==='i'||d[0]==='d')t.add(d[0])});
  if(L.laat&&L.laat.soort)t.add(L.laat.soort);
  if(L.laat&&L.laat.extra)t.add(L.laat.extra);
  return t;
}
function stripTot(L,max){
  const drop=()=>{
    if(L.kist){L.kist=0;L.doelen=(L.doelen||[]).filter(d=>d[0]!=='k'&&d[0]!=='i'&&d[0]!=='d');return 1}
    if(L.pot){L.pot=0;L.doelen=(L.doelen||[]).filter(d=>d[0]!=='p');return 1}
    if(L.onkruid){L.onkruid=0;L.doelen=(L.doelen||[]).filter(d=>d[0]!=='o');return 1}
    return 0;
  };
  let w=0;while(typen(L).size>max&&drop()&&w++<6){}
}

const _lv=typeof m3Level==='function'?m3Level:null;
if(_lv)window.m3Level=m3Level=function(n){
  const L=_lv.apply(this,arguments);
  try{
    const info=laatVan(n);if(!info)return L;
    L.laat=info;
    if(info.intro){
      L.onkruid=0;L.kist=0;L.pot=0;L.plaag=null;L.kistSoort=null;
      L.doelen=[];
      L.kleuren=Math.min(L.kleuren||7,6);
      if((L.zetten|0)>32)L.zetten=32;
      if((L.zetten|0)<28)L.zetten=28;
    }
    const soorten=[info.soort,info.extra].filter(Boolean);
    soorten.forEach(s=>{if(!(L.doelen||[]).some(d=>d[0]===s))(L.doelen||(L.doelen=[])).push([s])});
    stripTot(L, info.intro?1:2);
    if(info.extra){
      L.zetten=(L.zetten|0)+8;
      if((L.zetten|0)>48)L.zetten=48;
      if((L.zetten|0)<32)L.zetten=32;
    }
    if((L.kleuren|0)>=7)L.kleuren=6;
    if(info.soort==='pak'){
      if(info.intro){if((L.zetten|0)<40)L.zetten=40}
      else{
        if(L.onkruid==='vol'||L.onkruid==='dambord'||L.onkruid==='kruis'||L.onkruid==='onder')L.onkruid='rand';
        L.zetten=(L.zetten|0)+12;
        (L.doelen||[]).forEach(d=>{if(typeof d[0]==='number'&&d[1]>16)d[1]=16});
      }
    }
    const plek=((n-1)%10)+1, piek=plek===5||plek===10;
    if(info.soort==='ijs'){
      if(info.intro)L.zetten=24;
      else{
        const bodem=L.onkruid||L.kist||L.pot?34:28;
        const cap=n>350?(piek?34:32):(piek?36:34);
        if((L.zetten|0)<bodem)L.zetten=bodem;
        if((L.zetten|0)>cap)L.zetten=cap;
        if(n===308)L.zetten=(L.zetten|0)+6;
        if(n===402)L.zetten=(L.zetten|0)+4;
        if(n===582)L.zetten=30;
      }
    }
    if(info.soort==='sleutel'){
      const heeftKleur=(L.doelen||[]).some(d=>typeof d[0]==='number');
      const heeftPot=!!(L.pot)||(L.doelen||[]).some(d=>d[0]==='p');
      if(!heeftKleur)L.doelen.push([(n*3)%Math.max(2,L.kleuren||6), info.intro?14:16]);
      if(info.intro)L.zetten=22;
      else if(heeftPot){
        const bodem=28, cap=piek?34:32;
        if((L.zetten|0)<bodem)L.zetten=bodem;
        if((L.zetten|0)>cap)L.zetten=cap;
      }else{
        const bodem=24, cap=piek?26:24;
        if((L.zetten|0)<bodem)L.zetten=bodem;
        if((L.zetten|0)>cap)L.zetten=cap;
      }
    }
    if(info.soort==='pak'&&!info.intro&&(L.zetten|0)>50)L.zetten=50;
    const SZ={322:16,323:24,324:18,325:20,327:24,337:22,577:20,
      462:30,467:28,492:30,507:36,513:40,522:44,532:44,537:42,583:16};
    if(n===487&&!info.extra)SZ[487]=24;
    if(SZ[n])L.zetten=SZ[n];
    if(n===322)(L.doelen||[]).forEach(d=>{if(typeof d[0]==='number')d[1]=20});
    if(n===583)(L.doelen||[]).forEach(d=>{if(typeof d[0]==='number')d[1]=20});
    if(n===323||n===327||(n===487&&!info.extra)){
      L.onkruid=0;L.doelen=(L.doelen||[]).filter(d=>d[0]!=='o');
      L.pot=2;if(!L.doelen.some(d=>d[0]==='p'))L.doelen.push(['p',2]);
    }
    if(n===413||(n===487&&info.extra)){
      L.pot=0;L.doelen=(L.doelen||[]).filter(d=>d[0]!=='p');
    }
  }catch(e){}
  return L;
};

if(typeof Bord==='function'){
  Bord.prototype.laatInit=function(){
    const info=this.L&&this.L.laat;if(!info)return;
    const intro=!!info.intro;
    const soorten=[info.soort,info.extra].filter(Boolean);
    /* Pakketjes eerst, zodat rijp en sleutels die vakken overslaan. */
    if(soorten.includes('pak')){
      const plekken=intro?[[2,1],[2,3],[2,5],[3,4]]:(info.extra?[[1,1],[1,4],[2,2]]:[[1,1],[1,3],[1,5],[2,2]]);
      plekken.forEach(([r,c])=>{
        if(!this.binnen(r,c)||this.kist[r][c]||(this.strik&&this.strik[r][c]))return;
        const t=this.tegel(-2,r,c,r);t.pak=1;this.g[r][c]=t;
      });
    }
    if(soorten.includes('ijs')){
      this.ijs=[];
      const combo=soorten.length>1;
      for(let r=0;r<RIJEN;r++){this.ijs[r]=[];for(let c=0;c<KOL;c++){
        if(this.kist[r][c]||(this.strik&&this.strik[r][c])||(this.g[r][c]&&this.g[r][c].k===-2)){this.ijs[r][c]=0;continue}
        let laag=0;
        if(intro)laag=(r>=2&&r<=5&&c>=1&&c<=5)?1:0;
        else if(combo)laag=(r>=3&&r<=6&&c>=0&&c<=6&&((r+c)%2===0))?1:0;
        else laag=(r>=1&&r<=6&&c>=0&&c<=6&&((r+c)%2===0))?1:0;
        this.ijs[r][c]=laag;
      }}
    }
    if(soorten.includes('sleutel')){
      this.sleutel=[];for(let r=0;r<RIJEN;r++){this.sleutel[r]=[];for(let c=0;c<KOL;c++)this.sleutel[r][c]=0}
      const plekken=intro?[[3,2],[4,4],[5,1],[2,5],[6,3],[3,6]]:[[2,3],[3,1],[4,5],[5,2],[3,4],[6,0],[1,6]];
      plekken.forEach(([r,c])=>{
        if(!this.binnen(r,c)||this.kist[r][c]||!this.g[r][c]||this.g[r][c].k<0)return;
        if(this.ijs&&this.ijs[r]&&this.ijs[r][c])return;
        this.sleutel[r][c]=1;
      });
    }
    const tel=t=>{
      if(t==='ijs'&&this.ijs)return this.ijs.flat().reduce((a,b)=>a+b,0);
      if(t==='pak')return this.g.flat().filter(x=>x&&x.k===-2).length;
      if(t==='sleutel'&&this.sleutel)return this.sleutel.flat().reduce((a,b)=>a+b,0);
      return 0;
    };
    soorten.forEach(soort=>{
      if(!this.doel.some(d=>d.t===soort))this.doel.push({t:soort,n:0,over:0});
      this.doel.forEach(d=>{if(d.t===soort){d.n=tel(soort);d.over=d.n}});
    });
  };
  Bord.prototype.laatVoorWis=function(r,c,wis){
    if(!this.ijs||!this.ijs[r]||!this.ijs[r][c])return false;
    this.ijs[r][c]--;this.telDoel('ijs');this.fx.push({t:'ijs',r,c});
    return this.ijs[r][c]>0;
  };
  Bord.prototype.laatVang=function(r,c){
    if(!this.sleutel||!this.binnen(r,c)||!this.sleutel[r][c])return;
    this.sleutel[r][c]--;this.telDoel('sleutel');this.fx.push({t:'sleutel',r,c});
  };
  Bord.prototype.laatNaWis=function(wis){
    const seen=new Set();
    wis.forEach(x=>{
      const[r,c]=x.split(',').map(Number);
      this.laatVang(r,c);
    });
  };
  Bord.prototype.laatVal=function(){
    let n=0,iets=true;
    while(iets&&n++<8){
      iets=false;
      for(let c=0;c<KOL;c++){
        let r=RIJEN-1;while(r>=0&&(this.kist[r][c]||(this.strik&&this.strik[r][c])))r--;
        const t=r>=0&&this.g[r][c];
        if(t&&t.k===-2){this.g[r][c]=null;this.telDoel('pak');this.fx.push({t:'pak',r,c});iets=true}
      }
      if(iets)this.val();
    }
  };
  Bord.prototype.laatZetEinde=function(){
    if(!this.sleutel)return;
    const keys=[];
    for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++)if(this.sleutel[r][c])keys.push([r,c]);
    const bezet=new Set(keys.map(p=>p+''));
    keys.forEach(([r,c])=>{
      const nab=[];
      [[0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr,dc])=>{
        const rr=r+dr,cc=c+dc;if(!this.binnen(rr,cc))return;
        if(this.kist[rr][cc]||(this.strik&&this.strik[rr][cc])||(this.ijs&&this.ijs[rr]&&this.ijs[rr][cc])||bezet.has(rr+','+cc))return;
        const t=this.g[rr][cc];if(!t||t.k<0)return;
        nab.push([rr,cc]);
      });
      if(!nab.length)return;
      const[rr,cc]=nab[this.rng()*nab.length|0];
      this.sleutel[r][c]=0;this.sleutel[rr][cc]=1;
      bezet.delete(r+','+c);bezet.add(rr+','+cc);
      this.fx.push({t:'sleutelvlieg',van:[r,c],naar:[rr,cc]});
    });
  };
  Bord.prototype.laatTeken=function(ctx,cel,nu){
    if(this.ijs){
      for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++)if(this.ijs[r][c]){
        const x=c*cel,y=r*cel,t=this.g[r][c];
        const yy=t&&t.y!=null?(t.y*cel):y;
        ctx.save();
        ctx.globalAlpha=.92;
        const g=ctx.createLinearGradient(x,yy,x+cel,yy+cel);
        const sz=(this.L&&this.L.laat&&this.L.laat.seizoen)||'';
        const winter=this.L&&this.L.laat&&this.L.laat.winter;
        let c0='rgba(230,250,255,.92)',c1='rgba(150,210,240,.7)',c2='rgba(70,150,210,.75)';
        if(sz==='herfst'){c0='rgba(255,236,210,.9)';c1='rgba(180,200,220,.7)';c2='rgba(90,140,180,.75)'}
        else if(sz==='lente'){c0='rgba(230,255,240,.9)';c1='rgba(160,220,200,.7)';c2='rgba(70,160,150,.75)'}
        else if(sz==='zomer'){c0='rgba(255,248,220,.9)';c1='rgba(180,210,230,.7)';c2='rgba(80,150,200,.75)'}
        if(sz==='winter'||winter){c0='rgba(240,252,255,.96)';c1='rgba(170,220,250,.8)';c2='rgba(80,160,230,.8)'}
        g.addColorStop(0,c0);g.addColorStop(.55,c1);g.addColorStop(1,c2);
        ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(x+1,yy+1,cel-2,cel-2,cel*.18);ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,.95)';ctx.lineWidth=Math.max(2,cel*.07);
        ctx.stroke();
        ctx.strokeStyle='rgba(80,160,210,.9)';ctx.lineWidth=Math.max(1.2,cel*.035);
        ctx.beginPath();ctx.roundRect(x+3,yy+3,cel-6,cel-6,cel*.14);ctx.stroke();
        ctx.strokeStyle='#fff';ctx.lineWidth=2;
        ctx.beginPath();
        const cx=x+cel*.5,cy=yy+cel*.42;
        for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*cel*.22,cy+Math.sin(a)*cel*.22)}
        ctx.stroke();
        ctx.globalAlpha=.8+.2*Math.sin((nu||0)/280+c+r);
        ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x+cel*.78,yy+cel*.2,cel*.07,0,7);ctx.fill();
        ctx.beginPath();ctx.arc(x+cel*.2,yy+cel*.78,cel*.05,0,7);ctx.fill();
        ctx.restore();
      }
    }
    if(this.sleutel){
      for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++)if(this.sleutel[r][c]){
        const t=this.g[r][c];
        const x=((t&&t.x!=null)?t.x:c)*cel+cel/2;
        const y=((t&&t.y!=null)?t.y:r)*cel+cel/2+Math.sin((nu||0)/260+c)*cel*.06;
        tekenSleutel(ctx,x,y,cel,(nu||0)/400+c);
      }
    }
  };
}

function tekenSleutel(ctx,x,y,cel,a){
  ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(a)*.15);
  ctx.shadowColor='#ffe08a';ctx.shadowBlur=cel*.18;
  ctx.fillStyle='#e8c44a';ctx.strokeStyle='#7a5a10';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.arc(0,-cel*.16,cel*.13,0,7);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.arc(0,-cel*.16,cel*.06,0,7);ctx.fillStyle='#fff6d0';ctx.fill();
  ctx.fillStyle='#e8c44a';ctx.fillRect(-cel*.04,-cel*.06,cel*.08,cel*.32);
  ctx.fillRect(cel*.02,cel*.14,cel*.14,cel*.06);ctx.fillRect(cel*.08,cel*.2,cel*.08,cel*.05);
  ctx.strokeStyle='#d8e8ff';ctx.lineWidth=1.5;ctx.beginPath();
  ctx.moveTo(-cel*.16,-cel*.22);ctx.quadraticCurveTo(-cel*.32,-cel*.38,-cel*.08,-cel*.42);
  ctx.moveTo(cel*.16,-cel*.22);ctx.quadraticCurveTo(cel*.32,-cel*.38,cel*.08,-cel*.42);
  ctx.stroke();ctx.restore();
}
window.laatPakTeken=function(ctx,x,y,s,cel,nu){
  ctx.save();ctx.translate(x,y+Math.sin((nu||0)/380)*cel*.03);ctx.scale(s,s);
  ctx.fillStyle='#b87333';ctx.beginPath();ctx.roundRect(-cel*.32,-cel*.26,cel*.64,cel*.52,cel*.06);ctx.fill();
  ctx.fillStyle='#8a4e1c';ctx.fillRect(-cel*.32,-cel*.04,cel*.64,cel*.08);
  ctx.fillStyle='#c9a227';ctx.beginPath();ctx.arc(0,-cel*.02,cel*.08,0,7);ctx.fill();
  ctx.strokeStyle='#3d6b2a';ctx.lineWidth=2;ctx.beginPath();
  ctx.moveTo(cel*.18,-cel*.26);ctx.quadraticCurveTo(cel*.34,-cel*.46,cel*.28,-cel*.18);ctx.stroke();
  ctx.restore();
};
window.laatZetScore=function(b,r,c,r2,c2,rs){
  let s=0;
  const nab=(rr,cc)=>Math.abs(rr-r)+Math.abs(cc-c)===1||Math.abs(rr-r2)+Math.abs(cc-c2)===1||(rr===r&&cc===c)||(rr===r2&&cc===c2);
  if(b.ijs)rs.forEach(x=>x.cel.forEach(([rr,cc])=>{
    if(b.ijs[rr]&&b.ijs[rr][cc])s+=5;
    [[0,1],[1,0],[0,-1],[-1,0]].forEach(([dr,dc])=>{const a=rr+dr,d=cc+dc;if(b.binnen(a,d)&&b.ijs[a]&&b.ijs[a][d])s+=4});
  }));
  if(b.sleutel)rs.forEach(x=>x.cel.forEach(([rr,cc])=>{
    if(b.sleutel[rr]&&b.sleutel[rr][cc])s+=7;
    [[0,1],[1,0],[0,-1],[-1,0]].forEach(([dr,dc])=>{const a=rr+dr,d=cc+dc;if(b.binnen(a,d)&&b.sleutel[a]&&b.sleutel[a][d])s+=5});
  }));
  rs.forEach(x=>x.cel.forEach(([rr,cc])=>{
    for(let q=rr-1;q>=0;q--){const t=b.g[q][cc];if(t&&t.k===-2){s+=5;break}}
  }));
  return s;
};

const _ico=typeof m3DoelIco==='function'?m3DoelIco:null;
if(_ico)window.m3DoelIco=m3DoelIco=function(d,T,L){
  if(d&&(d[0]==='ijs'||d[0]==='pak'||d[0]==='sleutel')){
    const klas=d[0], p=d[0]==='ijs'?'M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7z':d[0]==='pak'?'M5 8h14v10H5zM5 8l2-3h10l2 3M5 12h14':'M8 8a3 3 0 1 1 3 3v8h2l1 2h-6l1-2h2V11a3 3 0 0 1-3-3z';
    return `<svg viewBox="0 0 24 24" class="m3ico ${klas}"><path d="${p}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  return _ico.apply(this,arguments);
};

function voegSerie(){try{
  Object.values(KAART).forEach(k=>{
    if(typeof META==='object'&&META)META[k[0]]=[k[3],k[4]];
    const al=typeof KAARTEN!=='undefined'&&KAARTEN.find(x=>x[0]===k[0]);
    if(al){al[3]=k[3];al[4]=k[4];if(al[5]==null)al[5]=1}
    else if(typeof KAARTEN!=='undefined')KAARTEN.push([k[0],k[1],k[2],k[3],k[4],1]);
  });
  if(window.KAARTSERIES&&!KAARTSERIES.includes('Torenlessen'))KAARTSERIES.push('Torenlessen');
}catch(e){}}
voegSerie();

function geefKaart(naam){
  S.kaarten=S.kaarten||{};const nw=!S.kaarten[naam];
  S.kaarten[naam]=(S.kaarten[naam]|0)+1;
  try{bewaar();window.serieNaKaart&&serieNaKaart(nw)}catch(e){}
  return nw;
}

const _speel=typeof m3Speel==='function'?m3Speel:null;
if(_speel)window.m3Speel=m3Speel=function(n,thema,boost){
  try{
    const info=laatVan(n);
    if(info&&info.intro&&!(S.laatLes&&S.laatLes[info.soort])&&typeof verhaal==='function'){
      const les=LES[info.soort];
      verhaal([[les.wie,les.tekst],['Tilly',les.tilly]],()=>{
        S.laatLes=S.laatLes||{};S.laatLes[info.soort]=1;try{bewaar()}catch(e){}
        _speel(n,thema,boost);
      });
      return;
    }
  }catch(e){}
  return _speel.apply(this,arguments);
};

const _w=typeof m3Winst==='function'?m3Winst:null;
if(_w)window.m3Winst=m3Winst=function(n){
  const r=_w.apply(this,arguments);
  try{
    const info=laatVan(n||S.m3lvl||1);
    if(info&&info.intro){
      const k=KAART[info.soort];
      if(k&&geefKaart(k[0]))setTimeout(()=>{try{toast('Nieuw in je album: '+k[0]+'.')}catch(e){}},1000);
    }
  }catch(e){}
  return r;
};

const HAAK={
  10:'Dat blaadje in je zak is nog warm, Luna. We bewaren het.',
  20:'Hagrid heeft thee, en een briefje van B.L. Dat hoort in je dagboek.',
  30:'Die pot zonder etiket… ik denk dat hij ons al een tijdje kent.',
  40:'De zevende kaars knikte, echt waar. Ik zwaaide terug.',
  50:'Hermelien zoekt verder. Jij speelt verder. Samen komen we er.',
  60:'Als een lijst je groet, groet je terug. Voor de zekerheid.',
  70:'De veer ligt weer op je lessenaar. Banning doet alsof hij niets ziet.',
  80:'We zijn nog lang niet klaar, en dat is juist fijn.',
  90:'Ik houd je dagboek bij. Jij houdt de lessen bij. Een goed team.',
  100:'Honderd lessen, Luna. Kas zeven fluistert al een beetje harder.',
  150:'De helft van het jaar is geen einde. Het is een mooie adem.',
  200:'Tweehonderd. De aanwijzingen liggen netjes. Wij ook, min of meer.',
  250:'Ik ben trots op je, stilletjes. Dat mag je weten.',
  290:'De toren wenkt. Ik neem een sjaal mee, en het dagboek.',
  300:'Driehonderd lessen. De lijst is minder leeg, en boven wacht rijp op de ramen.',
  310:'Sinistra had een ster te weinig op haar kaart, onder een laagje rijp. Jij zag hem eerst.',
  312:'Uilenpost van Hagrid: laat het pakketje zakken, niet openrukken.',
  320:'Zwamdrift zag zilveren paden, en pakketjes die als post naar beneden dwarrelen.',
  322:'Een gevleugelde sleutel, Luna. Vang hem met een match, niet met je handen.',
  330:'Het sterrenbeeld lijkt op een gieter. Of een tros sleutels, als je Tilly heet.',
  350:'We weten meer dan toen we begonnen, en minder dan we denken. Dat is goed.',
  400:'De Astronomietoren ruikt naar kou en koffie. Sinistra zegt bijna niets, en dat zegt veel.',
  450:'Elke les een stukje, elke kaart een groet. Kas zeven wacht geduldig.',
  500:'Vijfhonderd. Ik zou een taart willen, maar een ster is ook goed.',
  550:'De zevende kaars is dichterbij dan hij was. Niet rennen. Gewoon blijven komen.',
  600:'De laatste kaars, bijna. Jij hebt het hele jaar gedragen, Luna. Ik ook, een beetje.'
};
const TILLY=[
  'Wat een les, Luna. Ik bewaar dit gevoel even in je dagboek.',
  'Een ster verder, een stap dichter bij kas zeven.',
  'Ik was een beetje zenuwachtig, maar jij niet. Mooi gedaan.',
  'Als we later terugkijken, is dit zo’n stille, goede middag geweest.',
  'Kom, we drinken iets warms. De volgende les komt vanzelf.',
  'Je speelt rustig, en dat is precies hoe een jaar groeit.'
];
window.winHaakZin=function(n){
  n=+n||S.m3lvl||1;
  const info=laatVan(n);
  if(info&&info.intro){
    if(info.soort==='ijs')return 'Die rijp smolt netjes, Luna. Sinistra zou trots zijn, en een beetje jaloers op je vingers.';
    if(info.soort==='pak')return 'Het pakketje is binnen, lak en al. Hagrid zal tevreden zijn, en de uil ook.';
    if(info.soort==='sleutel')return 'Gevangen, zonder hem achterna te rennen. Banning zou een punt geven, stilletjes.';
  }
  if(HAAK[n])return HAAK[n];
  const tien=Math.floor(n/10)*10;
  if(HAAK[tien]&&n-tien<=2)return HAAK[tien];
  if(info){
    if(info.extra){
      if(info.seizoen==='herfst')return 'Oogstpost en een eerste laagje rijp, allebei netjes. De kas ruikt al naar later.';
      if(info.seizoen==='winter')return 'Rijp én een fladderende sleutel, en jij bleef rustig. Dat is winteren als een heks.';
      if(info.seizoen==='lente')return 'Een pakketje en een sleutel, alsof de gang weer opengaat. Mooi gedaan.';
      if(info.seizoen==='zomer')return 'Een zomersleutel, een laat laagje rijp, en jij hield ze allebei bij.';
      return 'Twee lessen tegelijk, en jij hield ze allebei bij.';
    }
    if(info.soort==='ijs')return 'Weer een tegel rijp minder. De toren wordt er een beetje vriendelijker van.';
    if(info.soort==='pak')return 'Weer een groet uit het boswachtershuis, netjes op de onderste rij.';
    if(info.soort==='sleutel')return 'Die sleutel fladderde, en jij was geduldiger. Dat wint bijna altijd.';
  }
  if(typeof verhaalMorgen==='function'){
    const v=verhaalMorgen();if(v&&!/mysterie wacht in je dagboek/i.test(v))return v;
  }
  return TILLY[n%TILLY.length];
};


/* v147: één pop-up tegelijk. Schildwissel blijft in de DOM (economietest),
   maar is verborgen tot de vorige brief of het ritueel weg is. Geen economie. */
(function(){
  const PRI={'ochtend':0,'login':1,'schildwissel':2,'welkom':4};
  function rijEl(el){
    if(!el||!el.classList)return false;
    if(el.querySelector&&el.querySelector('.m3eind,.m3voor'))return false;
    if(el.classList.contains('m3eind')||el.classList.contains('m3voor'))return false;
    const pop=el.dataset&&el.dataset.pop;
    if(pop&&['ochtend','login','schildwissel','welkom'].indexOf(pop)>=0)return true;
    if(el.classList.contains('ritueel')||el.classList.contains('verhaalm'))return true;
    if(el.classList.contains('modal')&&el.querySelector&&el.querySelector('.ochtendpost,.schildw,.vh'))return true;
    return false;
  }
  function zichtbaar(el){
    if(!el||el.classList.contains('zw-wacht'))return false;
    try{
      const st=getComputedStyle(el);
      return st.display!=='none'&&st.visibility!=='hidden';
    }catch(e){return !!el.isConnected}
  }
  function ietsZichtbaar(){
    return [...document.querySelectorAll('.modal,.verhaal,.ritueel,#intro')].some(zichtbaar);
  }
  function verberg(el){if(!el||el.classList.contains('zw-wacht'))return;el.classList.add('zw-wacht');el.setAttribute('aria-hidden','true')}
  function toon(el){if(!el)return;el.classList.remove('zw-wacht');el.removeAttribute('aria-hidden')}
  function rang(el){const p=el&&el.dataset&&el.dataset.pop;return PRI.hasOwnProperty(p)?PRI[p]:(el.classList.contains('verhaalm')?3:5)}
  function volgende(){
    if(ietsZichtbaar())return;
    const wacht=[...document.querySelectorAll('.modal.zw-wacht,.verhaal.zw-wacht,.ritueel.zw-wacht')].filter(el=>el.isConnected);
    if(!wacht.length)return;
    wacht.sort((a,b)=>rang(a)-rang(b));
    toon(wacht[0]);
  }
  function aanmelden(el){
    if(!rijEl(el)||el._zwq)return;
    el._zwq=1;
    const anderen=[...document.querySelectorAll('.modal,.verhaal,.ritueel,#intro')].filter(x=>x!==el&&zichtbaar(x));
    if(anderen.length)verberg(el);
  }
  const mo=new MutationObserver(muts=>{
    let weg=false;
    muts.forEach(m=>{
      m.addedNodes.forEach(n=>{
        if(n.nodeType!==1)return;
        if(rijEl(n))aanmelden(n);
        n.querySelectorAll&&n.querySelectorAll('.modal,.ritueel,.verhaalm').forEach(aanmelden);
      });
      m.removedNodes.forEach(n=>{
        if(n.nodeType===1&&(n.classList&&(n.classList.contains('modal')||n.classList.contains('ritueel')||n.classList.contains('verhaal')||n.classList.contains('verhaalm'))))weg=true;
      });
    });
    if(weg)setTimeout(volgende,40);
  });
  mo.observe(document.body,{childList:true,subtree:true});
  window.zwPopVolgende=volgende;
})();


/* v148: Tilly onthoudt gisteren; zeldzame knipoog op het bord (geen economie). */
(function(){
  function gisterTel(){
    try{
      const d=typeof gisteren==='function'?gisteren():'';
      return (S.tel&&d&&S.tel[d])||{};
    }catch(e){return {}}
  }
  function hashZin(s,n){
    let h=7;s=String(s||'');
    for(let i=0;i<s.length;i++)h=(Math.imul(h,31)+s.charCodeAt(i))>>>0;
    return h%(n||1);
  }
  const GISTER=[
    [t=> (t.m3|0)>=3, 'Gisteren drie levels, en je bleef kalm. De zevende kaars leek even te knikken.'],
    [t=> (t.les|0)>=1, 'Die les van gisteren zit nog in mijn hoofd. Jij ook?'],
    [t=> (t.oogst|0)>=1 || (t.plant|0)>=1, 'De kas rook vanmorgen naar jouw gieter van gisteren.'],
    [t=> (t.taak|0)>=1, 'Het lokaal is stiller sinds gisteren. Alsof de stoelen blij zijn.'],
    [t=> (t.water|0)>=1, 'De varens staan rechter dan gisteren. Ze hebben je onthouden.'],
    [t=> (t.dier|0)>=1, 'Je huisdier keek vanmorgen al naar de deur, op jou.'],
    [t=> (t.m3|0)>=1, 'Ik dacht nog aan dat level van gisteren. Je gaf niet op.']
  ];
  const _hal=typeof zwHalSfeer==='function'?zwHalSfeer:null;
  window.zwHalSfeer=function(){
    try{
      if(typeof zwTerug==='function'&&zwTerug())return 'Fijn dat je er weer bent. Je ochtendpost wacht.';
      const t=gisterTel();
      for(const [ok,zin] of GISTER){if(ok(t))return zin}
    }catch(e){}
    return _hal?_hal():'In de Hal ruikt het naar bijenwas en een beetje monnikskap.';
  };

  const KLAAR=[
    'Alles klaar hier! Ik ben zo benieuwd wat er achter de volgende deur zit.',
    'Dit lokaal glimt. Zullen we kijken wat de volgende kamer voor ons bewaart?',
    'Af, en netjes ook. Ik sta al bij de volgende deur te wachten.'
  ];
  const GENOEG=[
    n=>`We hebben genoeg huisschilden! Zullen we “${n}”? Ik heb er zin in.`,
    n=>`De schilden zijn er. “${n}” wacht, en ik sta al klaar.`,
    n=>`Genoeg schilden voor “${n}”. Zal ik meesjouwen?`
  ];
  const TEKORT=[
    (n,x,w)=>`Nog ${x} ${w} nodig voor “${n}”. Eén level en we zijn er bijna. Kom!`,
    (n,x,w)=>`Voor “${n}” missen we nog ${x} ${w}. De speelknop is vlakbij.`,
    (n,x,w)=>`Nog ${x} ${w}, dan “${n}”. Ik blijf ernaast staan.`
  ];
  const _tz=typeof tillyZin==='function'?tillyZin:null;
  if(_tz) window.tillyZin=function(v,vol){
    try{
      const sleutel=(typeof vandaag==='function'?vandaag():'')+'-'+(S.schoolDag|0)+'-'+(vol&&vol[0]||'klaar');
      if(!vol)return KLAAR[hashZin(sleutel,KLAAR.length)];
      const naam=String(vol[1]||'').toLowerCase();
      if(S.schilden>=vol[2])return GENOEG[hashZin(sleutel,GENOEG.length)](naam);
      const x=vol[2]-S.schilden, w=x==1?'huisschild':'huisschilden';
      const t=gisterTel();
      if((t.m3|0)>=1) return `Gisteren ging het goed. Nog ${x} ${w}, dan “${naam}”.`;
      return TEKORT[hashZin(sleutel,TEKORT.length)](naam,x,w);
    }catch(e){return _tz(v,vol)}
  };

  const KNIP=[
    {id:'veer', cls:'knip-veer', zin:'Een veer dwarrelt langs je bord. Niet van een schooluil. Iemand groet ons, denk ik.'},
    {id:'blad', cls:'knip-blad', zin:'Er zweeft een blaadje over het bord. Hetzelfde groen als in je zak, die eerste avond.'},
    {id:'glim', cls:'knip-glim', zin:'Iets glimmends bewoog langs de rand. Het zocht geen Smekkies. Alleen gezelschap.'},
    {id:'vlam', cls:'knip-vlam', zin:'De rand van het bord gloeide even, als een zevende vlam die niet wil storen.'}
  ];
  function zwKnipoog(){
    try{
      if(window._zwSim)return;if(window._lvSkip&&!window._zwKnipForce)return;
      if(typeof RMP==='boolean'&&RMP)return;
      if(document.body.dataset.view!=='match3')return;
      if(document.body.classList.contains('lvintro')||document.getElementById('lvintro')||document.querySelector('#laadscherm.aan')){
        setTimeout(zwKnipoog,500);return;
      }
      if(!document.getElementById('m3c')||!document.querySelector('.m3bord'))return;
      if(document.querySelector('.m3eind,.m3voor,#zwknip'))return;
      const dag=typeof vandaag==='function'?vandaag():'';
      if(!window._zwKnipForce){
        if(S.knipDag===dag)return;
        const sleutel=dag+'-'+(S.m3lvl|0);
        let h=11;for(const c of sleutel)h=(Math.imul(h,31)+c.charCodeAt(0))>>>0;
        if((h%8)!==0)return; // ongeveer 1 op 8 levels, max één keer per dag
      }
      S.knipDag=dag;try{bewaar()}catch(e){}
      const k=KNIP[hashZin(dag+(S.m3lvl|0),KNIP.length)];
      const o=document.createElement('div');
      o.id='zwknip';o.className='zwknip '+k.cls;o.setAttribute('aria-live','polite');
      o.style.cssText='background:#fff6d8;color:#2a1c0c;z-index:50';
      o.innerHTML=`<i></i><p style="color:#2a1c0c;margin:0">${k.zin}</p>`;
      document.body.appendChild(o);
      setTimeout(()=>{try{o.classList.add('weg')}catch(e){}},5200);
      setTimeout(()=>{try{o.remove()}catch(e){}},6400);
    }catch(e){}
  }
  if(typeof m3Speel==='function'){
    const _sp=m3Speel;
    m3Speel=function(){
      const r=_sp.apply(this,arguments);
      try{setTimeout(zwKnipoog,1400)}catch(e){}
      return r;
    };
  }
  window.zwKnipoog=zwKnipoog;
})();

})();

/* v149: Akte II-halsfeer, zichtbare plantgroei, tuinbed in de eigen kas */
(function(){
  const TUINZIN=[
    'Achter het portret ruikt het naar regen die nog moet vallen.',
    'Lindaroos knikte vanochtend, heel klein, toen we de Hal in kwamen.',
    'De tuin wacht. Niet ongeduldig. Gewoon, als een bed dat net is opgemaakt.',
    'Er ligt nog een zakje zonder naam, ergens onder een plank. We hoeven niet te rennen.',
    'De zevende kaars brandt nog. Precies genoeg om verder te lezen.'
  ];
  const _hal=typeof zwHalSfeer==='function'?zwHalSfeer:null;
  window.zwHalSfeer=function(){
    try{
      if(typeof zwTerug==='function'&&zwTerug())return _hal?_hal():'Fijn dat je er weer bent. Je ochtendpost wacht.';
      if((S.m3lvl|0)>=600 || (S.dagboek&&S.dagboek.gezien&&S.dagboek.gezien[30])){
        const dag=(typeof vandaag==='function'?vandaag():'')||'';
        const i=Math.abs((dag+'tuin').split('').reduce((a,c)=>((a<<5)-a)+c.charCodeAt(0)|0,0))%TUINZIN.length;
        if((dag.charCodeAt(dag.length-1)||0)%3===0) return TUINZIN[i];
      }
    }catch(e){}
    return _hal?_hal():'In de Hal ruikt het naar bijenwas en een beetje monnikskap.';
  };

  function groeiDeel(p){
    if(!p||typeof ZADEN==='undefined'||!ZADEN[p.z])return 0;
    const tot=ZADEN[p.z][2]*6e4;
    if(!tot)return 0;
    return Math.max(0,Math.min(1,(Date.now()-p.t+(p.bonus||0))/tot));
  }
  function zwKasGroei(root){
    try{
      const r=root||document;
      r.querySelectorAll('.kpot[data-i],.mk-pot[data-i],.mk-vloer[data-i]').forEach(k=>{
        const i=+k.dataset.i;
        const p=typeof pot==='function'?pot(i):(S.kweek||{})[i];
        const g=p?groeiDeel(p):0;
        k.style.setProperty('--groei', g.toFixed(3));
        let b=k.querySelector('.kpot-groei');
        if(!p){if(b)b.style.width='0';return}
        if(!b){b=document.createElement('span');b.className='kpot-groei';b.setAttribute('aria-hidden','true');k.appendChild(b)}
        b.style.width=(g*100).toFixed(1)+'%';
        const st=typeof stadium==='function'?stadium(p):-1;
        b.classList.toggle('klaar',st===4);
        const lab=k.querySelector('.mk-lab');
        if(lab&&p&&st>=0&&st<4){
          const naam=(ZADEN[p.z]&&ZADEN[p.z][0])||'';
          lab.textContent=naam?naam+' · '+Math.round(g*100)+'%':'';
        }
      });
    }catch(e){}
  }
  function zwTuinBed(){
    try{
      if(((S.m3lvl|0)<600)&&!(S.dagboek&&S.dagboek.gezien&&S.dagboek.gezien[30]))return '';
      const L=window.zwDagboekHfd||[];
      const start=31,n=Math.max(0,L.length-start);
      if(!n)return '';
      let gezien=0,open=0;
      for(let i=start;i<L.length;i++){
        if(typeof window.zwHfdOpen==='function'&&window.zwHfdOpen(i))open++;
        if(S.dagboek&&S.dagboek.gezien&&S.dagboek.gezien[i])gezien++;
      }
      const plantjes=Array.from({length:n},(_,i)=>{
        const st=i<gezien?'aan':i<open?'wacht':'dicht';
        return '<i class="mk-tuinplant '+st+'" style="--n:'+i+'"></i>';
      }).join('');
      return '<div class="mk-tuin" aria-label="Tuin van Lindaroos: '+gezien+' van '+n+' bladen verzorgd"><p>De tuin van Lindaroos</p><div class="mk-tuinbed">'+plantjes+'</div><small>'+gezien+' van '+n+' bladen verzorgd'+(open>gezien?' · er staat iets nieuw te groeien':'')+'</small></div>';
    }catch(e){return ''}
  }
  const _mk=V.mijnkas;
  if(_mk)V.mijnkas=function(){
    const r=_mk.apply(this,arguments);
    try{
      const bed=zwTuinBed();
      if(bed&&!document.querySelector('.mk-tuin')){
        const sc=document.getElementById('mkscroll');
        const titel=document.querySelector('#app .mk-titel, #app h2.mk-titel');
        if(sc)sc.insertAdjacentHTML('beforebegin',bed);
        else if(titel)titel.insertAdjacentHTML('afterend',bed);
      }
      zwKasGroei();
      clearInterval(V.mijnkas._groei);
      V.mijnkas._groei=setInterval(()=>{
        if(document.body.dataset.view!=='mijnkas'){clearInterval(V.mijnkas._groei);return}
        zwKasGroei();
      },8000);
    }catch(e){}
    return r;
  };
  const _kas=V.kas;
  if(_kas)V.kas=function(){
    const r=_kas.apply(this,arguments);
    try{
      zwKasGroei();
      const akte2=((S.m3lvl|0)>=600)||!!(S.dagboek&&S.dagboek.gezien&&S.dagboek.gezien[30]);
      if(akte2){
        document.body.classList.add('akte2-kas');
        const zetZin=()=>{
          if(document.body.dataset.view!=='kas'||document.querySelector('.kas-aktezin'))return;
          const zin='<p class="kas-aktezin klein">Kas zeven is open. In je eigen kas groeit de tuin van Lindaroos mee, blad voor blad.</p>';
          const anker=document.querySelector('#app .kweekopdr, #app h2.pagkop, #app .pagkop, #app h2');
          if(anker)anker.insertAdjacentHTML(anker.classList.contains('kweekopdr')?'beforebegin':'afterend',zin);
        };
        zetZin();
        setTimeout(zetZin,80);
        setTimeout(zetZin,250);
      }
      clearInterval(V.kas._groei);
      V.kas._groei=setInterval(()=>{
        if(document.body.dataset.view!=='kas'){clearInterval(V.kas._groei);return}
        zwKasGroei();
      },8000);
    }catch(e){}
    return r;
  };
  window.zwKasGroei=zwKasGroei;
})();


/* v149: verhaalkaart niet laten staan als je naar een ander scherm tikt */
(function(){
  function zwSluitVerhaal(){
    try{
      document.querySelectorAll('.verhaal,.verhaalm,.ritueel').forEach(el=>{
        if(el.classList.contains('zw-wacht'))return;
        try{el.remove()}catch(e){}
      });
    }catch(e){}
  }
  const _ga=typeof ga==='function'?ga:null;
  if(_ga)window.ga=function(s,...a){
    try{
      const nu=document.body&&document.body.dataset.view;
      if(s&&s!==nu&&s!=='home')zwSluitVerhaal();
    }catch(e){}
    return _ga.apply(this,arguments);
  };
})();

/* v150: verantwoorde reeks 601–800 (Akte II). Bestaande generator crashte of gaf te weinig zetten. Geen economie. */
(function(){
  const PAT=['rand','kruis','midden','onder'];
  const KP=['rij','hoeken'];
  function plekVan(n){return ((n-1)%10)+1}
  function rng(n){return (typeof rngVan==='function'?rngVan(n*7919+17):Math.random)}
  function kleurCap(L){
    const Z=(L.zetten|0)+(L.extra|0);
    const cap=Math.max(12, Math.floor(Z*0.65));
    (L.doelen||[]).forEach(d=>{if(typeof d[0]==='number'&&d[1]>cap)d[1]=cap});
  }
  function herbDrops(L,n){
    try{
      const ITEMS=window.M3ITEMS, DIEREN=window.M3DIEREN;
      const it=(ITEMS&&ITEMS.herbologie)||[];
      const dd=(DIEREN&&DIEREN.herbologie)||[];
      if(L.kistSoort==='i'&&it.length)L.kistInh=[it[(n*7)%it.length][0],it[(n*7+1)%it.length][0]];
      if(L.kistSoort==='d'&&dd.length)L.kistInh=[dd[n%dd.length][0]];
      if(L.pot&&it.length)L.dropInh=[it[(n*3)%it.length][0],it[(n*3+2)%it.length][0]];
    }catch(e){}
  }
  function bouwAkte2(n,L){
    const plek=plekVan(n);
    const adem=plek===1||plek===6;
    const piek=plek===5||plek===10;
    const zwaar=plek===10;
    const r=rng(n);
    const rnd=()=> (typeof r==='function'?r():Math.random());

    L.plaag=null;
    L.laat=null;
    L.kistSoort=null;
    L.kistInh=null;
    L.dropInh=null;
    L.zwaar=zwaar?2:piek?1:0;
    L.kleuren=6;
    L.onkruid=0;L.kist=0;L.pot=0;
    L.doelen=[];

    const kleurId=(n*3)%6;
    if(adem){
      L.zetten=26;
      L.doelen.push([kleurId,16]);
      L.onkruid='rand';L.doelen.push(['o'])
    }else if(plek===2||plek===7){
      const laat=['ijs','pak','sleutel'][(n*5+3)%3];
      L.laat={soort:laat};
      L.doelen.push([laat]);
      L.doelen.push([kleurId, laat==='pak'?14:16]);
      if(laat==='pak'){L.zetten=40;L.onkruid=0}
      else if(laat==='ijs'){L.zetten=30;if(rnd()<.5){L.onkruid='rand';L.doelen.push(['o'])}}
      else {L.zetten=24}
    }else if(plek===3||plek===8){
      L.zetten=26;
      L.onkruid=PAT[n%PAT.length];
      L.doelen.push([kleurId,18]);
      L.doelen.push(['o']);
    }else if(plek===4||plek===9){
      L.zetten=26;
      L.kist=['rij','hoeken','dubbel'][n%3];
      L.doelen.push([kleurId,17]);
      L.doelen.push(['k']);
      if(rnd()<.45){L.kistSoort='i';L.doelen[L.doelen.length-1]=['i']}
      else if(rnd()<.5){L.kistSoort='d';L.doelen[L.doelen.length-1]=['d']}
    }else if(plek===5){
      L.zetten=34;
      L.onkruid=PAT[(n+1)%PAT.length];
      L.doelen.push([kleurId,16]);
      L.doelen.push(['o']);
      if(rnd()<.6){L.pot=2;L.doelen.push(['p',2])}
      else {L.kist='rij';L.doelen.push(['k'])}
    }else{
      L.zetten=32;
      L.onkruid='kruis';
      L.kist='hoeken';
      L.doelen.push([kleurId,17]);
      L.doelen.push(['o']);
      L.doelen.push(['k']);
    }
    if((S.m3kal||{})[n])L.zetten+=(S.m3kal[n]|0);
    kleurCap(L);
    herbDrops(L,n);
    return L;
  }

  const _lv=typeof m3Level==='function'?m3Level:null;
  if(_lv) window.m3Level=m3Level=function(n){
    let L;
    try{L=_lv.apply(this,arguments)}catch(e){L={n:+n||1,zetten:32,kleuren:6,doelen:[[0,14]],onkruid:0,kist:0,pot:0,extra:+((S.m3extra||{})[n])||0}}
    try{
      n=+n||1;
      if(n>=601){
        if(!L||typeof L!=='object')L={n,extra:+((S.m3extra||{})[n])||0};
        L.n=n;
        if(L.extra==null)L.extra=+((S.m3extra||{})[n])||0;
        bouwAkte2(n,L);
      }
    }catch(e){}
    return L;
  };

  const _mv=typeof m3VakVoor==='function'?m3VakVoor:null;
  if(_mv) window.m3VakVoor=m3VakVoor=function(n){
    const v=_mv.apply(this,arguments);
    try{
      n=+n||1;
      if(n>=601){
        const basis=_mv(1)||v||{};
        return Object.assign({},basis,{
          id:'herbologie',
          n:n<=800?'De tuin van Lindaroos':'Meester-tovenares',
          prof:'Professor Stronk',
          thema:'herbologie',
          decor:basis.decor||'kas',
          van:601
        });
      }
    }catch(e){}
    return v;
  };
})();


/* v150: hal, kaart en preview na het schooljaar */
(()=>{
  const AKTE2=[
    {id:'lindaroos1',n:'De tuin van Lindaroos',prof:'Professor Stronk',ls:'herbologie',van:601,tot:700},
    {id:'lindaroos2',n:'Een zaad voor later',prof:'Professor Stronk',ls:'herbologie',van:701,tot:800}
  ];
  const jaarKlaar=()=>{const dagen=(typeof M3VAKKEN!=='undefined'&&typeof SCHOOL_DAGEN_PER_VAK==='number')?M3VAKKEN.length*SCHOOL_DAGEN_PER_VAK:30;return (S.schoolDag|0)>=dagen};

  const _hv=typeof huidigVak==='function'?huidigVak:null;
  if(_hv) window.huidigVak=huidigVak=function(){
    if(jaarKlaar()){
      const naam=(S.m3lvl|0)<=800?'De tuin van Lindaroos':'Meester-tovenares';
      const v={id:'lindaroos',n:naam,lokaal:naam,prof:'Professor Stronk',thema:'herbologie',decor:'kas',img:'decor-kas',taken:[],intro:[['Tilly','Kas zeven is achter ons. De tuin van Lindaroos ligt open, Luna. Elke les is weer een nieuw bed.'],['Professor Stronk','Wees zuinig met de bladeren. Wat je hier zaait, groeit het hele jaar mee.']],outro:[]};
      return{j:7,vs:[v],v};
    }
    return _hv.apply(this,arguments);
  };

  function tekenAkte2Pad(vid){
    const hier=S.m3lvl||1;
    const v=AKTE2.find(x=>x.id===vid)||AKTE2.find(x=>hier>=x.van&&hier<=x.tot)||(hier>800?AKTE2[1]:AKTE2[0]);
    const kop=M3VAKKEN.map(x=>'<button class="pv af" data-v="'+x.id+'"><img src="img/laadschermen/'+x.ls+'-klein.webp" alt="" loading="lazy"><span>'+x.n+'</span><small>klaar</small></button>').join('')
      +AKTE2.map(x=>{
        const st=x===v?'actief':hier>x.tot?'af':hier>=x.van?'open':'dicht';
        const klein=st==='af'?'klaar':st==='actief'?'nu':hier<x.van?'wacht':'';
        return '<button class="pv '+st+'" data-akte="'+x.id+'"><img src="img/laadschermen/'+x.ls+'-klein.webp" alt="" loading="lazy"><span>'+x.n+'</span><small>'+klein+'</small></button>';
      }).join('');
    const inVak=hier>=v.van&&hier<=v.tot;
    const van=inVak?Math.max(v.van,hier-5):v.van;
    const tot=inVak?Math.min(v.tot,hier+19):Math.min(v.tot,v.van+19);
    const niveaus=[];for(let L=van;L<=tot;L++)niveaus.push(L);
    const mist=tot<v.tot;
    const top=mist?128:52,rij=82,n=niveaus.length;
    const pts=niveaus.map((L,i)=>{const vanOnder=n-1-i;return{L,x:50+Math.sin(vanOnder*.95)*22,y:top+vanOnder*rij}});
    const H=top+Math.max(0,n-1)*rij+64;
    const lijn='<svg class="padlijn" viewBox="0 0 100 '+H+'" preserveAspectRatio="none" aria-hidden="true"><path d="M'+pts.map(p=>p.x+' '+p.y).join(' L')+'" fill="none" stroke="#d4af37" stroke-width="1.8" stroke-dasharray="2 2.4" vector-effect="non-scaling-stroke"/></svg>';
    const knoppen=pts.map(p=>{
      const L=p.L,d=L-hier,st=L<hier?'af':L===hier?'nu':'vooruit';
      const plaag=typeof padPlaag==='function'?padPlaag(L):null;
      const cadeau=typeof padCadeau==='function'?padCadeau(L):null;
      const zwaar=(!plaag&&typeof padZwaar==='function')?padZwaar(L):0;
      const cls=[st,plaag?'plaag':'',cadeau?'cadeau':'',zwaar?(zwaar>1?'zwaar superzwaar':'zwaar'):'',L>=100?'lang':'','v'+Math.max(0,d)].filter(Boolean).join(' ');
      return '<button class="padlvl '+cls+'" data-l="'+L+'" style="left:'+p.x+'%;top:'+p.y+'px'+(d>0?';--v:'+d:'')+'">'+L+(L===hier?'<span class="luna">L</span>':'')+'</button>';
    }).join('');
    const nevel=mist?'<div class="pad-nevel">'+(typeof padTeken==='function'?padTeken('cadeau','Er wacht iets','in de tuin'):'')+'</div>':'';
    const lesNr=v.id==='lindaroos2'?8:7;
    app('<div class="vakbalk">'+kop+'</div><div class="padkopbeeld" style="background-image:url(\'img/laadschermen/'+v.ls+'-klein.webp\')"><div><small>Akte II · Les '+lesNr+'</small><h2>'+v.n+'</h2><p>'+v.prof+'</p></div></div>'
     +'<div class="pad thema thema-herbologie'+(mist?' met-nevel':'')+'" style="height:'+H+'px">'+lijn+knoppen+nevel+'</div>');
    document.querySelectorAll('.pv[data-v]').forEach(b=>b.onclick=()=>{if(typeof _padOud==='function')_padOud.call(V,b.dataset.v)});
    document.querySelectorAll('.pv[data-akte]').forEach(b=>b.onclick=()=>tekenAkte2Pad(b.dataset.akte));
    document.querySelectorAll('.padlvl').forEach(b=>b.onclick=()=>{
      const L=+b.dataset.l;
      if(L<=hier)ga('match3',L);
      else toast('Eerst het level ervoor spelen.');
    });
    try{
      const oud=document.getElementById('plekkaart');if(oud)oud.remove();
      if(typeof htmlPlekKaart==='function'){
        document.body.insertAdjacentHTML('beforeend',htmlPlekKaart());
        document.querySelectorAll('#plekkaart .plekpin').forEach(b=>{
          b.onclick=()=>typeof tikPlek==='function'&&tikPlek(b.dataset.soort,b.dataset.ga);
        });
      }
    }catch(e){}
    setTimeout(()=>{
      try{
        const a=document.querySelector('.pv.actief');if(a)a.scrollIntoView({inline:'center',block:'nearest'});
        const n=document.querySelector('.padlvl.nu');
        if(n){
          const nav=document.getElementById('nav');
          const onder=nav?nav.getBoundingClientRect().height:0;
          const r=n.getBoundingClientRect();
          window.scrollTo(0,Math.max(0,window.scrollY+r.bottom-(window.innerHeight-onder-18)));
        }
      }catch(e){}
    },typeof RMP!=='undefined'&&RMP?0:350);
  }

  const _padOud=typeof V!=='undefined'&&V.pad?V.pad:null;
  if(_padOud) V.pad=function(vid,...a){
    try{
      if(jaarKlaar()&&(!vid||AKTE2.some(x=>x.id===vid)||vid==='verweer'||vid==='lindaroos')){
        tekenAkte2Pad(vid);
        return;
      }
    }catch(e){}
    const r=_padOud.apply(this,arguments);
    try{
      if(jaarKlaar()){
        const balk=document.querySelector('.vakbalk');
        if(balk&&!balk.querySelector('[data-akte]')){
          balk.insertAdjacentHTML('beforeend',AKTE2.map(x=>'<button class="pv '+( (S.m3lvl||1)>=x.van?'open':'dicht')+'" data-akte="'+x.id+'"><img src="img/laadschermen/'+x.ls+'-klein.webp" alt="" loading="lazy"><span>'+x.n+'</span><small>'+( (S.m3lvl||1)>x.tot?'klaar':(S.m3lvl||1)>=x.van?'nu':'wacht')+'</small></button>').join(''));
          document.querySelectorAll('.pv[data-akte]').forEach(b=>b.onclick=()=>tekenAkte2Pad(b.dataset.akte));
        }
      }
    }catch(e){}
    return r;
  };

  const _m3=typeof V!=='undefined'&&V.match3?V.match3:null;
  if(_m3) V.match3=async function(n,...a){
    const r=await _m3.apply(this,arguments);
    try{
      n=n||S.m3lvl||1;
      const vak=typeof m3VakVoor==='function'?m3VakVoor(n):null;
      const el=document.querySelector('.m3vak');
      if(el&&vak&&vak.n)el.textContent=vak.n;
    }catch(e){}
    return r;
  };

  const _vh=typeof verhaal==='function'?verhaal:null;
  if(_vh) window.verhaal=verhaal=function(regels,klaar){
    if(!regels||!regels.length){if(typeof klaar==='function')try{klaar()}catch(e){}return}
    return _vh.apply(this,arguments);
  };

})();

/* v151: wekelijkse verhaalbrief van Tilly, terugblik op Luna's week. Geen economie. */
(function(){
  const MAAND=['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
  function dagNu(){return typeof vandaag==='function'?vandaag():new Date().toISOString().slice(0,10)}
  function ymdPlus(iso,n){
    const d=new Date(iso+'T12:00:00Z');
    d.setUTCDate(d.getUTCDate()+n);
    return d.toISOString().slice(0,10);
  }
  function isoWeekKey(iso){
    const d=new Date(iso+'T12:00:00Z');
    const day=(d.getUTCDay()+6)%7;
    const thu=new Date(d.getTime());
    thu.setUTCDate(d.getUTCDate()-day+3);
    const year=thu.getUTCFullYear();
    const jan4=new Date(Date.UTC(year,0,4));
    const week=1+Math.round((+thu-+jan4)/6048e5);
    return year+'-W'+String(week).padStart(2,'0');
  }
  function dagenVanWeek(key){
    const m=String(key||'').match(/^(\d{4})-W(\d{2})$/);
    if(!m)return [];
    const year=+m[1],week=+m[2];
    const jan4=new Date(Date.UTC(year,0,4));
    const day=(jan4.getUTCDay()+6)%7;
    const mo=new Date(jan4.getTime());
    mo.setUTCDate(jan4.getUTCDate()-day+(week-1)*7);
    const out=[];
    for(let i=0;i<7;i++)out.push(new Date(mo.getTime()+i*864e5).toISOString().slice(0,10));
    return out;
  }
  function prevIsoWeek(key){
    const dagen=dagenVanWeek(key);
    if(!dagen.length)return key;
    return isoWeekKey(ymdPlus(dagen[0],-1));
  }
  function nlDag(iso){
    const p=String(iso||'').split('-').map(Number);
    if(p.length<3)return iso||'';
    return p[2]+' '+MAAND[p[1]-1];
  }
  function periodeVan(dagen){
    if(!dagen||!dagen.length)return '';
    const a=nlDag(dagen[0]),b=nlDag(dagen[dagen.length-1]);
    return a===b?a:(a+' – '+b);
  }
  function telVanDagen(dagen){
    const som={};
    (dagen||[]).forEach(d=>{
      const t=(S.tel&&S.tel[d])||{};
      Object.keys(t).forEach(k=>{if(typeof t[k]==='number')som[k]=(som[k]|0)+(t[k]|0)});
    });
    return som;
  }
  function ooitGespeeld(){
    const t=S.tel||{};
    return Object.keys(t).some(k=>{
      const v=t[k];
      if(!v||typeof v!=='object')return false;
      return Object.keys(v).some(x=>(v[x]|0)>0);
    });
  }
  function briefTekst(som,lvl){
    const m3=som.m3|0,oogst=som.oogst|0,plant=som.plant|0,kas=som.kas|0,les=som.les|0,taak=som.taak|0,water=som.water|0;
    const delen=[];
    if(m3>=15)delen.push('Wat een week, Luna. '+m3+' lessen, en je bleef rustig komen. De lokalen ruiken er nog naar.');
    else if(m3>=6)delen.push('Deze week speelde je '+m3+' lessen. Dat is een ritme waar een kas van opknapt.');
    else if(m3>=3)delen.push('Drie, vier lessen deze week — precies '+m3+' — en de kaarsen bleven vriendelijk branden.');
    else if(m3>=1)delen.push('Een paar lessen deze week, '+m3+' in getal, en dat was genoeg om de hal warm te houden.');
    else delen.push('Het was stil in de lokalen. Ik heb je stoel toch afgestoft. Fijn dat je er weer bent.');
    if(oogst)delen.push('Je oogstte in de kas. De lucht rook naar aarde, en Stronk zou instemmend hebben gezwegen.');
    else if(plant||water||kas)delen.push('Je was in de kassen. Alleen al langskomen doet de potten goed.');
    if(les||taak)delen.push('Je was ook in een lokaal, niet alleen op het bord. Dat telt mee, al zegt niemand het hardop.');
    if((lvl|0)>=601)delen.push('In de tuin van Lindaroos staat het werk niet stil. Zelfs een rustige week telt daar, blad voor blad.');
    else if((lvl|0)>=500)delen.push('Kas zeven is dichtbij. Ik bewaar je briefjes, voor als de deur opengaat.');
    delen.push('Ik leg dit briefje in je dagboek, bij de andere post. Volgende week schrijf ik weer — of je nu veel of weinig doet.');
    return delen.join(' ');
  }
  function portHtml(){
    try{if(typeof portret==='function')return '<div class="whport">'+portret('tilly','sm')+'</div>'}catch(e){}
    return '';
  }
  function toonBrief(entry){
    if(document.querySelector('[data-pop="weekbrief"]'))return;
    const o=document.createElement('div');
    o.className='modal verhaalm';
    o.dataset.pop='weekbrief';
    const port=portHtml();
    o.innerHTML='<div class="perkament modalin rococo weekbrief"><h2>Een weekbrief van Tilly</h2>'
      +(entry.periode?'<p class="wbperiode">'+entry.periode+'</p>':'')
      +'<div class="wbport">'+(port||'')+'<p>'+entry.tekst+'</p></div>'
      +'<button type="button" class="knop volgende" id="wbok">Bewaren in mijn dagboek</button></div>';
    document.body.appendChild(o);
    const kn=o.querySelector('#wbok');
    if(kn)kn.onclick=()=>{try{if(typeof popupSluit==='function')popupSluit(o);else o.remove()}catch(e){try{o.remove()}catch(x){}}};
  }
  function weekBriefCheck(){
    try{
      const nu=dagNu();
      const w=isoWeekKey(nu);
      if(!S||typeof S!=='object')return;
      if(!Array.isArray(S.weekBrieven))S.weekBrieven=[];
      if(S.weekBrief===w)return;
      if(!ooitGespeeld()&&(S.m3lvl|0)<=2){S.weekBrief=w;if(typeof bewaar==='function')bewaar();return}
      const vorige=prevIsoWeek(w);
      const dagen=dagenVanWeek(vorige);
      const som=telVanDagen(dagen);
      const entry={w:vorige,periode:periodeVan(dagen),tekst:briefTekst(som,S.m3lvl||1),t:Date.now()};
      S.weekBrieven.push(entry);
      if(S.weekBrieven.length>24)S.weekBrieven=S.weekBrieven.slice(-24);
      S.weekBrief=w;
      if(typeof bewaar==='function')bewaar();
      setTimeout(()=>toonBrief(entry),900);
    }catch(e){}
  }
  function htmlWeekBrieven(){
    const lijst=(S.weekBrieven||[]).slice().reverse();
    if(!lijst.length)return '';
    return lijst.map(b=>{
      const per=b.periode||b.w||'';
      return '<details class="kaart hfdkaart weekbriefkaart"><summary>'+portHtml()+'<div><b>Een weekbrief van Tilly</b><small> '+(per||'Tilly')+'</small></div></summary><p>'+(b.tekst||'')+'</p></details>';
    }).join('');
  }
  window.zwWeekBriefCheck=weekBriefCheck;

  const _home=typeof V!=='undefined'&&V.home?V.home:null;
  if(_home)V.home=function(){
    const r=_home.apply(this,arguments);
    try{weekBriefCheck()}catch(e){}
    return r;
  };

  const _db=typeof V!=='undefined'&&V.dagboek?V.dagboek:null;
  if(_db)V.dagboek=V.verhaal=function(){
    const r=_db.apply(this,arguments);
    try{
      if(document.querySelector('.weekbriefkaart'))return r;
      const html=htmlWeekBrieven();
      if(!html)return r;
      const kop=[...document.querySelectorAll('#app h3')].find(h=>/Brieven/.test(h.textContent||''));
      if(!kop)return r;
      const sect=kop.closest('section')||kop.parentElement;
      const leeg=sect&&sect.querySelector('.hfdslot');
      if(leeg)leeg.remove();
      kop.insertAdjacentHTML('afterend',html);
    }catch(e){}
    return r;
  };
})();
