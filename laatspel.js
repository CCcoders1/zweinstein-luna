/* v140: rijp, uilenpost-pakketjes en vliegende sleutels na level 300.
   Bot speelt ze; max 2 obstakeltypen; ritme per 10 blijft. Geen economie. */
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
function laatVan(n){
  n=+n||0;if(n<302||n>600)return null;
  if(INTRO[n])return {soort:INTRO[n],intro:1};
  const plek=plekVan(n);
  if(plek===1||plek===6)return null;
  if(n<=311)return {soort:'ijs'};
  if(n<=321)return {soort:'pak'};
  if(n<=331)return {soort:'sleutel'};
  /* Na de intro-reeks: alleen op plek 2 en 7, zodat pieken en adem hun ritme houden. */
  if(plek!==2&&plek!==7)return null;
  const pool=['ijs','pak','sleutel'];
  return {soort:pool[(n*5+3)%3]};
}
window.laatVan=laatVan;

function typen(L){
  const t=new Set();
  if(L.onkruid)t.add('o');
  if(L.kist)t.add('k');
  if(L.pot)t.add('p');
  if(L.plaag)t.add('plaag');
  (L.doelen||[]).forEach(d=>{if(d[0]==='i'||d[0]==='d')t.add(d[0])});
  if(L.laat&&L.laat.soort)t.add(L.laat.soort);
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
    if(!(L.doelen||[]).some(d=>d[0]===info.soort))(L.doelen||(L.doelen=[])).push([info.soort]);
    stripTot(L, info.intro?1:2);
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
    const SZ={322:16,323:24,324:18,325:20,327:24,337:22,487:24,577:20};if(SZ[n])L.zetten=SZ[n];
    if(n===322)(L.doelen||[]).forEach(d=>{if(typeof d[0]==='number')d[1]=20});
    if(n===323||n===327||n===487){
      L.onkruid=0;L.doelen=(L.doelen||[]).filter(d=>d[0]!=='o');
      L.pot=2;if(!L.doelen.some(d=>d[0]==='p'))L.doelen.push(['p',2]);
    }
  }catch(e){}
  return L;
};

if(typeof Bord==='function'){
  Bord.prototype.laatInit=function(){
    const info=this.L&&this.L.laat;if(!info)return;
    const soort=info.soort,intro=!!info.intro;
    if(soort==='ijs'){
      this.ijs=[];
      for(let r=0;r<RIJEN;r++){this.ijs[r]=[];for(let c=0;c<KOL;c++){
        if(this.kist[r][c]||(this.strik&&this.strik[r][c])){this.ijs[r][c]=0;continue}
        let laag=0;
        if(intro)laag=(r>=2&&r<=5&&c>=1&&c<=5)?1:0;
        else laag=(r>=1&&r<=6&&c>=0&&c<=6&&((r+c)%2===0))?1:0;
        this.ijs[r][c]=laag;
      }}
    }
    if(soort==='pak'){
      const plekken=intro?[[2,1],[2,3],[2,5],[3,4]]:[[1,1],[1,3],[1,5],[2,2]];
      plekken.forEach(([r,c])=>{
        if(!this.binnen(r,c)||this.kist[r][c]||(this.strik&&this.strik[r][c]))return;
        const t=this.tegel(-2,r,c,r);t.pak=1;this.g[r][c]=t;
      });
    }
    if(soort==='sleutel'){
      this.sleutel=[];for(let r=0;r<RIJEN;r++){this.sleutel[r]=[];for(let c=0;c<KOL;c++)this.sleutel[r][c]=0}
      const plekken=intro?[[3,2],[4,4],[5,1],[2,5],[6,3],[3,6]]:[[2,3],[3,1],[4,5],[5,2],[3,4],[6,0],[1,6]];
      plekken.forEach(([r,c])=>{
        if(!this.binnen(r,c)||this.kist[r][c]||!this.g[r][c]||this.g[r][c].k<0)return;
        this.sleutel[r][c]=1;
      });
    }
    const tel=t=>{
      if(t==='ijs'&&this.ijs)return this.ijs.flat().reduce((a,b)=>a+b,0);
      if(t==='pak')return this.g.flat().filter(x=>x&&x.k===-2).length;
      if(t==='sleutel'&&this.sleutel)return this.sleutel.flat().reduce((a,b)=>a+b,0);
      return 0;
    };
    if(!this.doel.some(d=>d.t===soort))this.doel.push({t:soort,n:0,over:0});
    this.doel.forEach(d=>{if(d.t===soort){d.n=tel(soort);d.over=d.n}});
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
        g.addColorStop(0,'rgba(230,250,255,.92)');g.addColorStop(.55,'rgba(150,210,240,.7)');g.addColorStop(1,'rgba(70,150,210,.75)');
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
    if(info.soort==='ijs')return 'Weer een tegel rijp minder. De toren wordt er een beetje vriendelijker van.';
    if(info.soort==='pak')return 'Weer een groet uit het boswachtershuis, netjes op de onderste rij.';
    if(info.soort==='sleutel')return 'Die sleutel fladderde, en jij was geduldiger. Dat wint bijna altijd.';
  }
  if(typeof verhaalMorgen==='function'){
    const v=verhaalMorgen();if(v&&!/mysterie wacht in je dagboek/i.test(v))return v;
  }
  return TILLY[n%TILLY.length];
};

})();
