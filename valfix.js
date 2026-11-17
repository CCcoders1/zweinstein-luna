/* v196: zwaartekracht, valroute voor potten, diagonaal schuiven, veiligheidsnet */
(function(){
  if(typeof Bord!=='function')return;
  const muur=(b,r,c)=>!!(b.strik&&b.strik[r]&&b.strik[r][c]);

  Bord.prototype.kolomExit=function(c,opt){
    const ignore=opt&&opt.ignoreKist;
    for(let r=RIJEN-1;r>=0;r--){
      if(this.gatCel(r,c))continue;
      if(!ignore&&(this.kist[r][c]||muur(this,r,c)))continue;
      return r;
    }
    return -1;
  };

  /* onderkant van het huidige kolomstuk: cel waar onder een gat, de rand, een kist of een muur zit */
  Bord.prototype.segmentExit=function(r,c,opt){
    const ignore=opt&&opt.ignoreKist;
    let last=-1;
    for(let rr=r;rr<RIJEN;rr++){
      if(this.gatCel(rr,c))break;
      if(!ignore&&(this.kist[rr][c]||muur(this,rr,c)))break;
      last=rr;
    }
    return last;
  };
  Bord.prototype.isSegmentExit=function(r,c,opt){
    return this.segmentExit(r,c,opt)===r;
  };

  Bord.prototype.valBuren=function(r,c,opt){
    const ignoreKist=opt&&opt.ignoreKist;
    const out=[];
    const mag=(rr,cc)=>{
      if(rr<0||rr>=RIJEN||cc<0||cc>=KOL)return false;
      if(!ignoreKist&&(muur(this,rr,cc)||this.kist[rr][cc]))return false;
      return true;
    };
    // naar beneden, gaten oversteken
    for(let rr=r+1;rr<RIJEN;rr++){
      if(!mag(rr,c))break;
      if(!this.gatCel(rr,c)){out.push([rr,c]);break}
    }
    // diagonaal omlaag naar een speelbaar vak
    for(const dc of[-1,1]){
      const rr=r+1,cc=c+dc;
      if(!mag(rr,cc))continue;
      if(!this.gatCel(rr,cc))out.push([rr,cc]);
    }
    return out;
  };

  Bord.prototype.kanValPad=function(r,c,opt){
    if(r<0||c<0||this.gatCel(r,c))return false;
    const ignoreKist=opt&&opt.ignoreKist;
    if(!ignoreKist&&(this.kist[r][c]||muur(this,r,c)))return false;
    const startExit=this.segmentExit(r,c,opt)===r;
    const q=[[r,c]], gezien=new Set([r+','+c]);
    let i=0;
    while(i<q.length){
      const[rr,cc]=q[i++];
      if(this.segmentExit(rr,cc,opt)===rr){
        if(!(opt&&opt.nietZelf&&rr===r&&cc===c))return true;
        if(startExit&&q.length===1){/* ga verder zoeken via schuiven */}
        else return true;
      }
      for(const[nr,nc] of this.valBuren(rr,cc,opt)){
        const k=nr+','+nc;
        if(gezien.has(k))continue;
        gezien.add(k);q.push([nr,nc]);
      }
    }
    if(opt&&opt.nietZelf&&startExit)return false;
    return this.segmentExit(r,c,opt)===r && !(opt&&opt.nietZelf);
  };

  Bord.prototype.kanPotSpawn=function(r,c){
    if(!this.binnen(r,c)||this.kist[r][c]||muur(this,r,c))return false;
    /* nooit op de uitgang zelf zetten: die wordt meteen verzameld, of lijkt vast te zitten */
    if(this.segmentExit(r,c)===r)return false;
    return this.kanValPad(r,c,{nietZelf:true});
  };

  Bord.prototype.packKolom=function(c){
    const bar=(r)=>muur(this,r,c)||this.kist[r][c];
    const einde=(r)=>r>=RIJEN||bar(r)||this.gatCel(r,c);
    let start=0;
    for(let r=0;r<=RIJEN;r++){
      if(r<RIJEN&&!einde(r))continue;
      const dests=[], tiles=[];
      for(let i=start;i<r;i++){
        if(this.gatCel(i,c)||bar(i))continue;
        dests.push(i);
        if(this.g[i][c])tiles.push(this.g[i][c]);
      }
      const n=tiles.length;
      const doel=dests.slice(dests.length-n);
      for(const i of dests)this.g[i][c]=null;
      for(let k=0;k<n;k++)this.g[doel[k]][c]=tiles[k];
      start=r+1;
    }
  };

  /* gewone tegels (geen potten) vallen wél door een gat naar het volgende stuk */
  Bord.prototype.valDoorGaten=function(){
    let iets=false;
    for(let c=0;c<KOL;c++){
      for(let r=RIJEN-2;r>=0;r--){
        const t=this.g[r][c];
        if(!t||t.k===-1)continue;
        if(this.gatCel(r,c)||this.kist[r][c]||muur(this,r,c))continue;
        if(r+1>=RIJEN||!this.gatCel(r+1,c))continue;
        for(let rr=r+2;rr<RIJEN;rr++){
          if(this.kist[rr][c]||muur(this,rr,c))break;
          if(this.gatCel(rr,c))continue;
          if(!this.g[rr][c]){this.g[rr][c]=t;this.g[r][c]=null;iets=true}
          break;
        }
      }
    }
    return iets;
  };

  Bord.prototype.schuifDiagonaal=function(){
    let iets=false;
    for(let r=RIJEN-2;r>=0;r--){
      for(let c=0;c<KOL;c++){
        const t=this.g[r][c];
        if(!t||this.gatCel(r,c)||this.kist[r][c]||muur(this,r,c))continue;
        if(t.k===-1&&this.segmentExit(r,c)===r)continue;
        if(t.k!==-1&&this.kolomExit(c)===r)continue;
        const onder=r+1;
        const vrijOnder=onder<RIJEN&&!this.gatCel(onder,c)&&!this.kist[onder][c]&&!muur(this,onder,c)&&!this.g[onder][c];
        if(vrijOnder)continue;
        // alleen schuiven als onder een gat of de rand is; kist en strik blijven staan
        const moetSchuiven=onder>=RIJEN||this.gatCel(onder,c);
        if(!moetSchuiven)continue;
        const dirs=(c+r)%2?[1,-1]:[-1,1];
        for(const dc of dirs){
          const rr=r+1,cc=c+dc;
          if(cc<0||cc>=KOL||rr>=RIJEN)continue;
          if(this.gatCel(rr,cc)||this.kist[rr][cc]||muur(this,rr,cc)||this.g[rr][cc])continue;
          this.g[rr][cc]=t;this.g[r][c]=null;
          iets=true;break;
        }
      }
    }
    return iets;
  };

  Bord.prototype.packSchuif=function(){
    let n=0;
    do{
      for(let c=0;c<KOL;c++)this.packKolom(c);
      let v=0;
      while(this.valDoorGaten()&&v++<12){
        for(let c=0;c<KOL;c++)this.packKolom(c);
      }
      n++;
    }while(this.schuifDiagonaal()&&n<24);
  };

  Bord.prototype.celVanafLucht=function(r,c,opt){
    const ignoreKist=!opt||opt.ignoreKist!==false;
    const mag=(rr,cc)=>{
      if(cc<0||cc>=KOL||rr>=RIJEN)return false;
      if(rr<0)return true;
      if(!ignoreKist&&(muur(this,rr,cc)||this.kist[rr][cc]))return false;
      return true;
    };
    const q=[],gezien=new Set();
    for(let cc=0;cc<KOL;cc++){q.push([-1,cc]);gezien.add('-1,'+cc)}
    let i=0;
    while(i<q.length){
      const[rr,cc]=q[i++];
      if(rr===r&&cc===c)return true;
      const next=[[rr+1,cc],[rr+1,cc-1],[rr+1,cc+1]];
      for(const[nr,nc] of next){
        if(!mag(nr,nc))continue;
        const k=nr+','+nc;
        if(gezien.has(k))continue;
        gezien.add(k);q.push([nr,nc]);
      }
    }
    return false;
  };

  Bord.prototype.vulGaten=function(){
    const muurC=(r,c)=>muur(this,r,c);
    const vast=(r,c)=>!!(this.kist[r][c]||muurC(r,c)||this.gatCel(r,c));
    for(let c=0;c<KOL;c++){
      let n=0;for(let r=RIJEN-1;r>=0;r--)if(!vast(r,c)&&!this.g[r][c])n++;
      let i=0;
      for(let r=0;r<RIJEN;r++){
        if(vast(r,c)||this.g[r][c])continue;
        let k=this.rng()*this.L.kleuren|0;
        if(this.potGeplaatst<this.L.pot){
          const op=this.g.flat().filter(t=>t&&t.k===-1).length;
          if(op<2&&this.kanPotSpawn(r,c)&&this.rng()<(op?.1:.45)){k=-1;this.potGeplaatst++}
        }
        const t=this.tegel(k,r,c);
        let onder=false;for(let q=0;q<r;q++)if(muurC(q,c))onder=true;
        t.y=sim0(this)||onder?r:(-n+i-.2);i++;this.g[r][c]=t;
      }
    }
  };

  Bord.prototype.plaatsStartPotten=function(){
    const L=this.L;if(!L||!L.pot)return;
    for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
      const t=this.g[r][c];
      if(t&&t.k===-1&&!this.kanPotSpawn(r,c)){
        this.g[r][c]=this.tegel(this.rng()*L.kleuren|0,r,c,r);
      }
    }
    let nu=this.g.flat().filter(t=>t&&t.k===-1).length;
    const max=Math.min(2,L.pot);
    if(nu>max){
      for(let r=RIJEN-1;r>=0&&nu>max;r--)for(let c=KOL-1;c>=0&&nu>max;c--){
        const t=this.g[r][c];
        if(t&&t.k===-1){this.g[r][c]=this.tegel(this.rng()*L.kleuren|0,r,c,r);nu--}
      }
    }
    if(nu<max){
      const kand=[];
      for(let c=0;c<KOL;c++){
        for(let r=0;r<RIJEN;r++){
          if(!this.g[r][c]||this.g[r][c].k<0)continue;
          if(!this.kanPotSpawn(r,c))continue;
          const len=Math.max(0,this.segmentExit(r,c)-r);
          kand.push([r,c,len]);
        }
      }
      kand.sort((a,b)=>a[2]-b[2]||Math.abs(a[1]-(KOL-1)/2)-Math.abs(b[1]-(KOL-1)/2));
      for(const[r,c] of kand){
        if(nu>=max)break;
        if(this.g[r][c]&&this.g[r][c].k===-1)continue;
        this.g[r][c]=this.tegel(-1,r,c,r);nu++;
      }
    }
    this.potGeplaatst=nu;
  };

  Bord.prototype.vangVastPotten=function(){
    let iets=false;
    for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
      const t=this.g[r][c];
      if(!t||t.k!==-1)continue;
      if(this.kanValPad(r,c,{ignoreKist:true}))continue;
      this.g[r][c]=null;
      this.telDoel('p');
      this.fx.push({t:'pot',r,c});
      iets=true;
    }
    if(iets)this._valNeed=true;
    return iets;
  };

  Bord.prototype.potten=function(){
    let iets=false;
    const pak=(r,c)=>{
      const t=this.g[r][c];if(!t||t.k!==-1)return;
      this.g[r][c]=null;this.telDoel('p');this.fx.push({t:'pot',r,c});iets=true;
    };
    for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
      if(this.gatCel(r,c)||this.kist[r][c]||muur(this,r,c))continue;
      if(this.segmentExit(r,c)===r)pak(r,c);
    }
    if(this.strik){
      for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
        const t=this.g[r][c];if(!t||t.k!==-1||this.kist[r][c]||this.strik[r][c])continue;
        if(r+1>=RIJEN||this.strik[r+1][c]||this.kist[r+1][c]||this.gatCel(r+1,c))pak(r,c);
      }
    }
    if(iets){
      if(this._inVal)this._valNeed=true;
      else this.val();
    }
  };

  Bord.prototype.val=function(){
    if(this._inVal){this._valNeed=true;return}
    this._inVal=true;
    try{
      let n=0;
      do{
        this._valNeed=false;
        this.packSchuif();
        this.vulGaten();
        this.packSchuif();
        this.potten();
        this.vangVastPotten();
        n++;
      }while(this._valNeed&&n<16);
    }finally{this._inVal=false}
  };

  if(Bord.prototype.laatVal){
    Bord.prototype.laatVal=function(){
      let n=0,iets=true;
      while(iets&&n++<8){
        iets=false;
        for(let c=0;c<KOL;c++){
          let r=RIJEN-1;
          while(r>=0&&(this.kist[r][c]||this.gatCel(r,c)||muur(this,r,c)))r--;
          const t=r>=0&&this.g[r][c];
          if(t&&t.k===-2){this.g[r][c]=null;this.telDoel('pak');this.fx.push({t:'pak',r,c});iets=true}
        }
        if(iets)this.val();
      }
    };
  }

  Bord.prototype.tekenPotUitgang=function(ctx,cel){
    if(!this.L||!(this.L.pot>0))return;
    for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
      if(this.gatCel(r,c)||this.kist[r][c]||muur(this,r,c))continue;
      if(this.segmentExit(r,c)!==r)continue;
      const x=c*cel+cel/2,y=r*cel+cel*.86;
      ctx.save();
      ctx.globalAlpha=.55;
      ctx.fillStyle='rgba(255,220,120,.4)';
      ctx.beginPath();ctx.ellipse(x,y-cel*.02,cel*.2,cel*.09,0,0,7);ctx.fill();
      ctx.strokeStyle='rgba(180,130,30,.9)';
      ctx.lineWidth=Math.max(1.5,cel*.045);
      ctx.lineCap='round';ctx.lineJoin='round';
      ctx.beginPath();
      ctx.moveTo(x-cel*.13,y-cel*.07);
      ctx.lineTo(x,y+cel*.05);
      ctx.lineTo(x+cel*.13,y-cel*.07);
      ctx.stroke();
      ctx.restore();
    }
  };

  window.m3ValCheck=function(n){
    const L=m3Level(n);
    const thema=(typeof m3VakVoor==='function'&&m3VakVoor(n).thema)||'herbologie';
    const issues=[];
    const b=new Bord(L,thema,n*17+3);
    const speel=[];
    for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
      if(b.gatCel(r,c)||b.kist[r][c]||muur(b,r,c))continue;
      speel.push([r,c]);
      if(!b.celVanafLucht(r,c,{ignoreKist:true}))issues.push({t:'onbereikbaar',r,c});
    }
    const potten=b.g.flat().map((t,i)=>t&&t.k===-1?i:null).filter(x=>x!=null);
    const coords=[];
    for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
      const t=b.g[r][c];if(t&&t.k===-1)coords.push([r,c]);
    }
    for(const[r,c] of coords){
      if(!b.kanValPad(r,c,{ignoreKist:true}))issues.push({t:'pot-vast-vorm',r,c});
      else if(!b.kanValPad(r,c)){/* kist/strik kan nog weg, geen harde fout */}
    }
    if(L.pot>0){
      let spawn=0;
      for(const[r,c] of speel){if(b.kanValPad(r,c,{ignoreKist:true,nietZelf:true}))spawn++}
      if(spawn===0)issues.push({t:'geen-pot-spawn'});
      // simuleer: pot op lastige plekken, val, check verzameld of pad
      const was=coords.map(([r,c])=>[r,c]);
      for(const[r,c] of speel){
        if(!b.kanPotSpawn(r,c)&&!b.kanValPad(r,c,{ignoreKist:true}))continue;
      }
      // zet een testpot op elk speelbaar vak (kopie) en kijk of val+pad hem haalt
      const teTesten=(L.vorm&&L.vorm!=='rechthoek')?speel:speel.filter(([r,c])=>r===0||c===((KOL/2)|0));
      let vast=0;
      for(const[sr,sc] of teTesten){
        const t=new Bord(L,thema,n*17+3);
        for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
          if(t.gatCel(r,c)||t.kist[r][c]||muur(t,r,c))continue;
          t.g[r][c]=null;
        }
        if(t.gatCel(sr,sc)||t.kist[sr][sc])continue;
        t.g[sr][sc]=t.tegel(-1,sr,sc,sr);
        t.packSchuif();
        t.potten();
        t.vangVastPotten();
        let plek=null;
        for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
          const x=t.g[r][c];if(x&&x.k===-1)plek=[r,c];
        }
        if(plek&&!t.kanValPad(plek[0],plek[1],{ignoreKist:true})){
          vast++;issues.push({t:'pot-sim-vast',r:sr,c:sc,na:plek});
          if(vast>8)break;
        }
      }
    }
    return {n,vorm:L.vorm||'rechthoek',R:RIJEN,K:KOL,pot:L.pot||0,issues,ok:!issues.length};
  };

  window.m3ValCheckAlles=function(van,tot){
    const uit=[];
    let fout=0;
    for(let n=van;n<=tot;n++){
      const r=window.m3ValCheck(n);
      if(!r.ok){fout++;uit.push(r)}
    }
    return {van,tot,fout,totaal:tot-van+1,levels:uit};
  };
})();
