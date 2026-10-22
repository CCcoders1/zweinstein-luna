/* In de pagina: per level kenmerken + greedy-bot winkans (geen hulp / hulp = +5 zetten + bom + streep) + 3★-kans. */
window.zwSpeel=async function(levels,per,hulpPer){
 const vrij=b=>{const L=[];for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=b.g[r][c];if(t&&t.k>=0&&!t.s&&!b.kist[r][c]&&!(b.strik&&b.strik[r][c]))L.push([r,c])}return L};
 const spec=b=>{const L=[];for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=b.g[r][c];if(t&&t.s&&!b.kist[r][c]&&!(b.strik&&b.strik[r][c]))L.push([r,c])}return L};
 async function feest(b){const z0=b.zet;b.telDoel=()=>{};
  for(let i=1;i<=z0;i++){const v=vrij(b);if(!v.length)break;const [r,c]=v[b.rng()*v.length|0];
   if(i%5===0){let n=0;for(let rr=r-1;rr<=r+1;rr++)for(let cc=c-1;cc<=c+1;cc++)if(b.binnen(rr,cc)){const t=b.g[rr][cc];if(t&&t.k>=0&&!t.s&&!b.kist[rr][cc]&&!(b.strik&&b.strik[rr][cc])){b.g[rr][cc]=null;n++}}b.score+=60*n+200}
   else{b.g[r][c]=null;b.score+=100}b.val()}
  await b.oplossen(null,null,new Set(),{});let n=0;while(n<30){const L=spec(b);if(!L.length)break;const x=L.sort((p,q)=>p[0]-q[0]||p[1]-q[1])[0];await b.oplossen(null,null,new Set([x+'']),{});b.score+=150;n++}}
 async function speel(L,th,seed,hulp){const b=new Bord(L,th,seed);
  if(hulp){const v=vrij(b).filter(p=>p[0]>=2&&p[0]<=6);if(v.length>1){const a=v.splice(b.rng()*v.length|0,1)[0];b.g[a[0]][a[1]].s='bom';const c=v[b.rng()*v.length|0];b.g[c[0]][c[1]].s=b.rng()<.5?'rh':'rv'}}
  let veilig=0;while(b.zet>0&&!b.klaar()&&veilig++<160){const z=m3BesteZet(b);if(!z)break;await b.wissel(z[0],z[1])}
  const won=b.klaar(),over=b.zet,rest=b.doel.reduce((a,d)=>a+Math.max(0,d.over),0),tot=b.doel.reduce((a,d)=>a+d.n,0);let s3=0;
  if(won){await feest(b);const g=m3SterGrens(L.n,L);s3=b.score>=g[1]?1:0}return{won,over,rest:tot?rest/tot:0,s3}}
 const uit={};
 for(const n of levels){const L=m3Level(n);const th=m3VakVoor(n).thema;
  const b0=new Bord(L,th,1);const cnt=(g,f)=>g.flat().filter(f).length,sum=g=>g.flat().reduce((a,v)=>a+(+v||0),0);
  const kl=L.doelen.filter(d=>typeof d[0]=='number');
  const f={n,Z:L.zetten+(L.extra||0),kleuren:L.kleuren,zw:(window.lvZwaar?lvZwaar(n):0)|0,plaag:L.plaag?(L.plaag.id||'ja'):'',
   doelen:L.doelen.map(d=>d[0]+(d[1]!=null?':'+d[1]:'')).join(' '),nDoel:L.doelen.length,
   kleurN:kl.reduce((a,d)=>a+d[1],0),onkruidCel:cnt(b0.lay,v=>v>0),onkruidLaag:sum(b0.lay),kistCel:cnt(b0.kist,v=>v>0),kistLaag:sum(b0.kist),
   pot:L.doelen.some(d=>d[0]=='p')?(L.pot|0):0,strik:b0.strik?cnt(b0.strik,v=>!!v):0,
   overig:L.doelen.filter(d=>typeof d[0]!='number'&&!['o','k','i','d','p'].includes(d[0])).map(d=>d[0]).join(','),
   doelN:b0.doel.reduce((a,d)=>a+d.n,0)};
  f.sig=zwSig([n])[n];
  let w=0,s3=0,ov=0,rs=0;for(let p=1;p<=per;p++){const r=await speel(L,th,p+1000,0);if(r.won){w++;s3+=r.s3;ov+=r.over}else rs+=r.rest}
  f.win=w/per;f.s3=s3/per;f.over=w?ov/w:0;f.restVerlies=per-w?rs/(per-w):0;
  if(hulpPer){const Lh={...L,extra:(L.extra||0)+5};let wh=0;for(let p=1;p<=hulpPer;p++){const r=await speel(Lh,th,p+5000,1);if(r.won)wh++}f.hulp=wh/hulpPer}
  uit[n]=f}
 return uit};
/* alleen kenmerken (snel, voor de release-check) */
window.zwSig=function(levels){const o={};for(const n of levels){const L=m3Level(n);const b0=new Bord(L,m3VakVoor(n).thema,1);const sum=g=>g.flat().reduce((a,v)=>a+(+v||0),0);
 o[n]=JSON.stringify([L.zetten+(L.extra||0),L.kleuren,(window.lvZwaar?lvZwaar(n):0)|0,L.doelen.map(d=>d[0]+(d[1]!=null?':'+d[1]:'')).join(' '),sum(b0.lay),sum(b0.kist),L.doelen.some(d=>d[0]=='p')?(L.pot|0):0,b0.strik?b0.strik.flat().filter(v=>!!v).length:0,L.onkruid,L.kist,L.kistSoort||'',L.plaag?(L.plaag.id||'ja'):''])}return o};
