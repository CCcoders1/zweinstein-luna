/* In de pagina uitvoeren: speelt levels met de greedy bot (sim-modus) en rekent het eindfeest na. */
window.zwBot=async function(levels,per){
 const vrij=b=>{const L=[];for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=b.g[r][c];if(t&&t.k>=0&&!t.s&&!b.kist[r][c]&&!(b.strik&&b.strik[r][c]))L.push([r,c])}return L};
 const spec=b=>{const L=[];for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){const t=b.g[r][c];if(t&&t.s&&!b.kist[r][c]&&!(b.strik&&b.strik[r][c]))L.push([r,c])}return L};
 async function feestSim(b){const z0=b.zet;b.telDoel=()=>{};
  for(let i=1;i<=z0;i++){const v=vrij(b);if(!v.length)break;const [r,c]=v[b.rng()*v.length|0];
   if(i%5===0){let n=0;for(let rr=r-1;rr<=r+1;rr++)for(let cc=c-1;cc<=c+1;cc++)if(b.binnen(rr,cc)){const t=b.g[rr][cc];if(t&&t.k>=0&&!t.s&&!b.kist[rr][cc]&&!(b.strik&&b.strik[rr][cc])){b.g[rr][cc]=null;n++}}b.score+=60*n+200}
   else{b.g[r][c]=null;b.score+=100}
   b.val()}
  await b.oplossen(null,null,new Set(),{});
  let n=0;while(n<30){const L=spec(b);if(!L.length)break;const x=L.sort((p,q)=>p[0]-q[0]||p[1]-q[1])[0];await b.oplossen(null,null,new Set([x+'']),{});b.score+=150;n++}}
 const uit=[];
  for(const n of levels){const L=m3Level(n);const th=m3VakVoor(n).thema;const Z=L.zetten+(L.extra||0);const zw=(window.lvZwaar&&lvZwaar(n))|0;
  for(let p=1;p<=per;p++){const b=new Bord(L,th,p+1000);let veilig=0;while(b.zet>0&&!b.klaar()&&veilig++<120){const z=m3BesteZet(b);if(!z)break;await b.wissel(z[0],z[1])}
   const won=b.klaar();const r={n,Z,zw,won,over:b.zet,s0:b.score|0};if(won){await feestSim(b);r.s=b.score|0}uit.push(r)}}
 return uit};
