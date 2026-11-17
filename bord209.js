/* v209: sierlijke hoekornamenten op het vormkader */
(function(){
  function ornamenten(b,ctx,cel){
    if(typeof m3VormRingen!=='function'||typeof m3VormStijl!=='function')return;
    const st=m3VormStijl(b&&b.L);if(!st||st.naam==='groot')return;
    const ringen=m3VormRingen(b);if(!ringen||!ringen[0]||!ringen[0].length)return;
    const loop=ringen[0];
    const pts=loop.map(p=>({x:p[0]*cel,y:p[1]*cel}));
    const pick=[];
    const add=fn=>{
      let best=pts[0];
      for(let i=1;i<pts.length;i++)if(fn(pts[i],best))best=pts[i];
      if(best&&!pick.includes(best))pick.push(best);
    };
    add((a,b)=>a.y<b.y||(a.y===b.y&&a.x<b.x));
    add((a,b)=>a.y>b.y||(a.y===b.y&&a.x>b.x));
    add((a,b)=>a.x<b.x||(a.x===b.x&&a.y<b.y));
    add((a,b)=>a.x>b.x||(a.x===b.x&&a.y>b.y));
    const s=Math.max(3.4,cel*.1);
    ctx.save();
    ctx.lineJoin='round';
    pick.forEach(p=>{
      ctx.beginPath();
      ctx.moveTo(p.x,p.y-s);
      ctx.lineTo(p.x+s*.72,p.y);
      ctx.lineTo(p.x,p.y+s);
      ctx.lineTo(p.x-s*.72,p.y);
      ctx.closePath();
      ctx.fillStyle=st.rand2||'#fff8d0';
      ctx.strokeStyle=st.rand||'#c9a227';
      ctx.lineWidth=Math.max(1.1,cel*.032);
      ctx.fill();
      ctx.stroke();
    });
    ctx.restore();
  }
  const wacht=()=>{
    if(typeof window.m3VormTekenRand!=='function'){setTimeout(wacht,40);return}
    const _r=window.m3VormTekenRand;
    window.m3VormTekenRand=function(b,ctx,cel){
      _r.apply(this,arguments);
      try{ornamenten(b,ctx,cel)}catch(e){}
    };
  };
  wacht();
})();
