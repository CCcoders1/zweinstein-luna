/* v177: 3D-testtuin. Vaste volgcamera, camerajoystick, hogere hagen, fade bij occlusie. CC0/zelfgemaakt. Geen EA/Warner-assets. */
(function(){
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('tuin');
  const hintEl = $('hint');
  const fpsEl = $('fps');
  const deurKaart = $('deurkaart');
  const debugAan=/\bdebug=1\b/.test(location.search||'');
  const debugEl=$('tuindebug');
  if(debugAan){document.body.classList.add('debug');if(debugEl)debugEl.hidden=false}

  const deurBtn = $('deurbtn');
  const overgang = $('overgang');
  const noGl = $('nowebgl');
  const geluidBtn = $('geluid');

  if('serviceWorker' in navigator){
    try{navigator.serviceWorker.register('sw.js')}catch(e){}
  }

  function heeftWebGL(){
    try{
      const c=document.createElement('canvas');
      return !!(c.getContext('webgl2')||c.getContext('webgl')||c.getContext('experimental-webgl'));
    }catch(e){return false}
  }
  if(!window.THREE || !heeftWebGL()){
    if(noGl)noGl.hidden=false;
    if(canvas)canvas.style.display='none';
    return;
  }
  const THREE=window.THREE;
  const RMP=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}})();
  const TMP=new THREE.Vector3();
  const LOOK=new THREE.Vector3();

  function rnd(s){s=Math.sin(s*127.1+311.7)*43758.5453;return s-Math.floor(s)}
  function tex(teken, maat, herhaal, grof){
    const c=document.createElement('canvas');
    c.width=c.height=maat||64;
    const g=c.getContext('2d');
    g.imageSmoothingEnabled=!grof;
    teken(g,c.width);
    const t=new THREE.CanvasTexture(c);
    t.wrapS=t.wrapT=THREE.RepeatWrapping;
    if(grof){
      t.magFilter=t.minFilter=THREE.NearestFilter;
      t.generateMipmaps=false;
    }else{
      t.magFilter=THREE.LinearFilter;
      t.minFilter=THREE.LinearMipmapLinearFilter;
    }
    if(herhaal)t.repeat.set(herhaal[0],herhaal[1]);
    t.needsUpdate=true;
    return t;
  }
  function cvTex(teken,w,h,opt){
    opt=opt||{};
    const c=document.createElement('canvas');
    c.width=w;c.height=h;
    const g=c.getContext('2d');
    g.imageSmoothingEnabled=opt.smooth!==false;
    teken(g,w,h);
    const tx=new THREE.CanvasTexture(c);
    tx.wrapS=tx.wrapT=opt.repeat?THREE.RepeatWrapping:THREE.ClampToEdgeWrapping;
    if(opt.repeat)tx.repeat.set(opt.repeat[0],opt.repeat[1]);
    if(opt.scherp){
      tx.magFilter=tx.minFilter=THREE.LinearFilter;
      tx.generateMipmaps=false;
    }else if(opt.grof){
      tx.magFilter=tx.minFilter=THREE.NearestFilter;
      tx.generateMipmaps=false;
    }else{
      tx.magFilter=THREE.LinearFilter;
      tx.minFilter=THREE.LinearMipmapLinearFilter;
    }
    tx.needsUpdate=true;
    return tx;
  }

  const T={
    gras: tex((g,n)=>{
      g.fillStyle='#2a5a10';g.fillRect(0,0,n,n);
      for(let i=0;i<220;i++){
        const x=rnd(i+1)*n,y=rnd(i+9)*n,s=4+rnd(i+3)*12;
        const k=rnd(i+7);
        g.fillStyle=k>.7?'#7a9a28':k>.45?'#4a7a18':k>.22?'#2e5e10':'#1a3e0a';
        g.beginPath();g.ellipse(x,y,s,s*0.7,rnd(i)*3,0,Math.PI*2);g.fill();
      }
      for(let i=0;i<500;i++){
        const x=rnd(i+21)*n,y=rnd(i+29)*n,s=1+rnd(i+3)*2.4;
        g.fillStyle=rnd(i+11)>.6?'#c8b850':rnd(i+4)>.4?'#6a8a22':'#24580e';
        g.fillRect(x,y,s,s+1);
      }
    },128,[10,12],false),
    haag: tex((g,n)=>{
      g.fillStyle='#030701';g.fillRect(0,0,n,n);
      // diepe schaduwgaten tussen de bladclusters
      for(let i=0;i<110;i++){
        const x=rnd(i+2)*n,y=rnd(i+5)*n,s=12+rnd(i+3)*22;
        g.fillStyle=rnd(i)>.5?'#020501':'#081606';
        g.beginPath();g.ellipse(x,y,s,s*0.72,rnd(i)*4,0,Math.PI*2);g.fill();
      }
      // meer gewicht in donker- en middengroen, highlights spaarzaam
      const pal=['#041006','#0a2208','#14380c','#1c5410','#2a7014','#4a9818','#7ed024','#d4f848'];
      for(let c=0;c<90;c++){
        const cx=rnd(c+3)*n,cy=rnd(c+7)*n,R=14+rnd(c+11)*16,nBlad=8+Math.floor(rnd(c+13)*8);
        for(let k=0;k<nBlad;k++){
          const a=rnd(c*17+k)*6.28, r=rnd(c*9+k)*R;
          const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r*0.8;
          // bias naar de donkere helft van het palet
          const kcol=rnd(c*5+k+2)*0.78;
          g.fillStyle=pal[Math.min(7,Math.floor(kcol*8))];
          g.save();g.translate(x,y);g.rotate(a+rnd(k+4));
          g.beginPath();g.ellipse(0,0,4+rnd(k+8)*7,2+rnd(k+6)*4.2,0,0,Math.PI*2);g.fill();
          g.restore();
        }
      }
      // felle bladhighlights, minder talrijk zodat het contrast blijft
      for(let i=0;i<90;i++){
        if(rnd(i+21)<.50)continue;
        g.fillStyle=rnd(i)>.5?'#e8ff6a':'#b4e830';
        g.save();g.translate(rnd(i+2)*n,rnd(i+8)*n);g.rotate(rnd(i+5)*6.28);
        g.beginPath();g.ellipse(0,0,3+rnd(i)*5,1.4+rnd(i+3)*2.6,0,0,Math.PI*2);g.fill();
        g.restore();
      }
    },256,[2.1,2.4],false),
    baksteen: tex((g,n)=>{
      g.fillStyle='#6a3a28';g.fillRect(0,0,n,n);
      const cw=16,ch=8;
      for(let y=0,rij=0;y<n;y+=ch,rij++){
        const off=(rij%2)*(cw/2);
        for(let x=-cw;x<n;x+=cw){
          const v=rnd(x*3+y*7+2);
          g.fillStyle=v>.65?'#c47a48':v>.3?'#a85a32':'#8a4024';
          g.fillRect(x+off+1,y+1,cw-2,ch-2);
        }
      }
    },64,[1,2],true),
    zandsteen: tex((g,n)=>{
      g.fillStyle='#8a6a40';g.fillRect(0,0,n,n);
      for(let i=0;i<400;i++){
        g.fillStyle=rnd(i)>.5?'#d2b07a':'#b8945a';
        g.fillRect(rnd(i+3)*n,rnd(i+8)*n,3,2);
      }
      g.strokeStyle='rgba(70,40,16,.35)';g.lineWidth=2;
      for(let y=0;y<n;y+=16){g.beginPath();g.moveTo(0,y);g.lineTo(n,y);g.stroke()}
    },64,[2,2],true),
    pad: tex((g,n)=>{
      g.fillStyle='#3a3e42';g.fillRect(0,0,n,n);
      const cell=16;
      for(let y=0;y<n;y+=cell){
        const off=(Math.floor(y/cell)%2)*(cell/2);
        for(let x=-cell;x<n;x+=cell){
          const v=rnd(x*5+y*3+2);
          g.fillStyle=v>.78?'#c8c8c0':v>.55?'#9aa0a4':v>.32?'#7a8086':v>.16?'#5c5a56':'#4a4844';
          const ix=x+off+1,iy=y+1,iw=cell-2-(rnd(x+y)>.85?2:0),ih=cell-2-(rnd(x+y+3)>.8?2:0);
          g.fillRect(ix,iy,iw,ih);
          if(rnd(x*7+y)>.65){g.fillStyle='rgba(40,70,80,.22)';g.fillRect(ix+1,iy+1,iw-2,ih-2)}
          if(rnd(x*3+y*5)>.8){g.strokeStyle='rgba(30,32,36,.45)';g.strokeRect(ix+1,iy+1,iw-3,ih-3)}
        }
      }
    },64,[4,10],true),
    grind: tex((g,n)=>{
      g.fillStyle='#7a6a50';g.fillRect(0,0,n,n);
      for(let i=0;i<800;i++){
        const k=rnd(i+4);
        g.fillStyle=k>.7?'#d8c8a8':k>.4?'#b8a078':k>.2?'#8a7048':'#5a4a32';
        g.fillRect(rnd(i+2)*n,rnd(i+6)*n,1+rnd(i)*2,1+rnd(i+3)*2);
      }
    },64,[8,8],true),
    aarde: tex((g,n)=>{
      g.fillStyle='#5a3a18';g.fillRect(0,0,n,n);
      for(let i=0;i<500;i++){
        g.fillStyle=rnd(i)>.5?'#7a5428':'#3a2410';
        g.fillRect(rnd(i+2)*n,rnd(i+6)*n,2,2);
      }
    },64,[6,6],true),
    hout: tex((g,n)=>{
      g.fillStyle='#6a3e18';g.fillRect(0,0,n,n);
      for(let x=0;x<n;x+=4){
        g.fillStyle=rnd(x)>.5?'#8a5a28':'#5a3010';
        g.fillRect(x,0,3,n);
      }
      g.strokeStyle='rgba(30,16,4,.35)';g.lineWidth=1;
      for(let y=8;y<n;y+=16){g.beginPath();g.moveTo(0,y);g.lineTo(n,y);g.stroke()}
    },64,[2,2],true),
    lucht: cvTex((g,w,h)=>{
      // v=0 is zenit, v=0.5 de horizon. Helder HP1-daglicht: rijk blauw, zachte witte wolken.
      const lg=g.createLinearGradient(0,0,0,h);
      // bijna vlak, verzadigd HP1-blauw (lage R, hoge B)
      lg.addColorStop(0,'#1a4ec4');
      lg.addColorStop(.36,'#1e56cc');
      lg.addColorStop(.46,'#2460d2');
      lg.addColorStop(.50,'#3a78d8');
      lg.addColorStop(.54,'#7a9888');
      lg.addColorStop(.70,'#5a7a48');
      lg.addColorStop(1,'#2a4a24');
      g.fillStyle=lg;g.fillRect(0,0,w,h);
      function bol(x,y,rx,ry,a,c0,c1){
        const grd=g.createRadialGradient(x,y-ry*0.28,0,x,y,rx);
        grd.addColorStop(0,c0.replace('A',''+a));
        grd.addColorStop(.42,c1.replace('A',''+(a*0.55)));
        grd.addColorStop(.78,c1.replace('A',''+(a*0.12)));
        grd.addColorStop(1,'rgba(30,80,200,0)');
        g.fillStyle=grd;
        g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();
      }
      function stapel(cx,cy,s,a){
        // compacte cumulus met blauwe lucht ertussen, geen melkband
        const stukken=[[0,0,1,0.62],[0.42,0.10,0.62,0.48],[-0.40,0.10,0.58,0.46],[0.12,-0.28,0.50,0.42],[-0.18,-0.22,0.46,0.38],[0.50,-0.08,0.36,0.32],[-0.50,-0.04,0.34,0.30]];
        stukken.forEach(([dx,dy,sx,sy])=>{
          const donker=dy>0;
          bol(cx+dx*s,cy+dy*s,s*sx,s*sy,a*(donker?0.75:1),
            donker?'rgba(210,220,232,A)':'rgba(255,255,255,A)',
            donker?'rgba(170,196,226,A)':'rgba(220,234,250,A)');
        });
      }
      stapel(0.13*w,0.445*h,0.075*w,0.92);
      stapel(0.37*w,0.428*h,0.090*w,0.90);
      stapel(0.72*w,0.438*h,0.085*w,0.90);
      stapel(0.90*w,0.452*h,0.060*w,0.80);
    },512,512,{scherp:true}),
    wolk: cvTex((g,w,h)=>{
      g.clearRect(0,0,w,h);
      function bol(x,y,rx,ry,a,c0,c1){
        const grd=g.createRadialGradient(x,y-ry*0.32,0,x,y+ry*0.15,rx);
        grd.addColorStop(0,c0);
        grd.addColorStop(.45,c1.replace('A',''+(a*0.75)));
        grd.addColorStop(.78,'rgba(186,206,226,'+(a*0.28)+')');
        grd.addColorStop(1,'rgba(160,200,240,0)');
        g.fillStyle=grd;
        g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();
      }
      bol(w*.50,h*.62,w*.42,h*.28,.85,'rgba(210,222,236,.7)','rgba(200,214,230,A)');
      bol(w*.32,h*.50,w*.30,h*.26,.88,'rgba(255,255,255,.95)','rgba(232,240,250,A)');
      bol(w*.68,h*.52,w*.32,h*.24,.88,'rgba(255,255,255,.95)','rgba(230,238,250,A)');
      bol(w*.50,h*.36,w*.28,h*.24,.95,'rgba(255,255,255,1)','rgba(240,246,255,A)');
      bol(w*.44,h*.58,w*.22,h*.18,.7,'rgba(255,255,255,.8)','rgba(220,232,246,A)');
    },256,160,{scherp:true}),
    bladKaart: cvTex((g,w,h)=>{
      g.clearRect(0,0,w,h);
      function blad(x,y,s,rot,col){
        g.save();g.translate(x,y);g.rotate(rot);
        g.fillStyle=col;
        g.beginPath();g.ellipse(0,0,s,s*0.48,0,0,Math.PI*2);g.fill();
        g.restore();
      }
      blad(w*.50,h*.52,w*.36,-0.4,'#7ad022');
      blad(w*.38,h*.42,w*.28,0.5,'#c4f040');
      blad(w*.62,h*.40,w*.30,-1.1,'#9ee028');
      blad(w*.52,h*.32,w*.22,0.2,'#e8ff6a');
      blad(w*.44,h*.60,w*.24,1.0,'#4aa018');
    },64,64,{scherp:true}),
    hek: cvTex((g,w,h)=>{
      g.clearRect(0,0,w,h);
      const inkt='#16161a';
      g.strokeStyle=inkt;g.fillStyle=inkt;g.lineCap='round';g.lineJoin='round';
      function staaf(x,y0,y1,dik){
        g.lineWidth=dik;g.beginPath();g.moveTo(x,y0);g.lineTo(x,y1);g.stroke();
      }
      function spits(x,y,s){
        g.beginPath();g.moveTo(x,y-s*1.4);g.lineTo(x-s*0.45,y);g.lineTo(x+s*0.45,y);g.closePath();g.fill();
      }
      function krul(x,y,r,a0,a1,dik){
        g.lineWidth=dik;g.beginPath();g.arc(x,y,r,a0,a1);g.stroke();
      }
      function S(x1,y1,cx1,cy1,cx2,cy2,x2,y2,dik){
        g.lineWidth=dik;g.beginPath();g.moveTo(x1,y1);g.bezierCurveTo(cx1,cy1,cx2,cy2,x2,y2);g.stroke();
      }
      // verticale stijlen
      const nBar=11;
      for(let i=0;i<nBar;i++){
        const x=w*(0.08+i*0.084);
        staaf(x,h*0.20,h*0.92,3.0);
        spits(x,h*0.20,8);
      }
      // horizontale rails
      g.lineWidth=4;
      g.beginPath();g.moveTo(w*0.08,h*0.38);g.lineTo(w*0.92,h*0.38);g.stroke();
      g.beginPath();g.moveTo(w*0.08,h*0.70);g.lineTo(w*0.92,h*0.70);g.stroke();
      g.beginPath();g.moveTo(w*0.08,h*0.92);g.lineTo(w*0.92,h*0.92);g.stroke();
      // krullen tussen de stijlen
      for(let i=0;i<nBar-1;i++){
        const x=w*(0.15+i*0.10);
        krul(x,h*0.54,w*0.045,-0.2,Math.PI*1.2,2.4);
        S(x-w*0.04,h*0.30, x-w*0.02,h*0.18, x+w*0.06,h*0.18, x+w*0.04,h*0.32, 2.2);
        krul(x,h*0.80,w*0.038,0.3,Math.PI*1.5,2.2);
      }
      // bovenboog met krullen
      g.lineWidth=5;
      g.beginPath();g.arc(w/2,h*0.22,w*0.42,Math.PI,0);g.stroke();
      g.lineWidth=3;
      g.beginPath();g.arc(w/2,h*0.22,w*0.36,Math.PI+0.1,-0.1);g.stroke();
      krul(w*0.22,h*0.14,w*0.07,0.2,Math.PI*1.6,2.6);
      krul(w*0.78,h*0.14,w*0.07,-0.4,Math.PI*1.2,2.6);
      // middenrozet
      krul(w/2,h*0.54,w*0.07,0,Math.PI*2,2.8);
      krul(w/2,h*0.54,w*0.04,0,Math.PI*2,2);
      spits(w/2,h*0.08,10);
    },256,512,{scherp:true}),
    hekBoog: cvTex((g,w,h)=>{
      g.clearRect(0,0,w,h);
      const inkt='#16161a';
      g.strokeStyle=inkt;g.fillStyle=inkt;g.lineCap='round';g.lineJoin='round';
      function krul(x,y,r,a0,a1,dik){g.lineWidth=dik;g.beginPath();g.arc(x,y,r,a0,a1);g.stroke()}
      function spits(x,y,s){g.beginPath();g.moveTo(x,y-s*1.4);g.lineTo(x-s*0.45,y);g.lineTo(x+s*0.45,y);g.closePath();g.fill()}
      // alleen de bovenboog, midden open om doorheen te lopen
      g.lineWidth=7;
      g.beginPath();g.arc(w/2,h*0.82,w*0.46,Math.PI,0);g.stroke();
      g.lineWidth=3.5;
      g.beginPath();g.arc(w/2,h*0.82,w*0.39,Math.PI+0.05,-0.05);g.stroke();
      // dichtere krullen aan de boog, onderkant vrij zodat het bord leesbaar blijft
      for(let i=1;i<=11;i++){
        const a=Math.PI+Math.PI*i/12;
        const x=w/2+Math.cos(a)*w*0.425,y=h*0.82+Math.sin(a)*w*0.425;
        krul(x,y+h*0.008,w*0.038,0.15,Math.PI*1.35,2.2);
        if(i!==6){
          krul(x+(i%2?0.02:-0.02)*w,y+h*0.035,w*0.022,0.2,Math.PI*1.2,1.7);
          spits(x,y-1,5+i%3);
        }
      }
      // schouderkrullen
      krul(w*0.16,h*0.70,w*0.09,-0.2,Math.PI*1.4,3);
      krul(w*0.22,h*0.66,w*0.05,0.4,Math.PI*1.6,2.2);
      krul(w*0.84,h*0.70,w*0.09,0.2,Math.PI*1.5,3);
      krul(w*0.78,h*0.66,w*0.05,-0.4,Math.PI*1.4,2.2);
      // middenrozet + spits
      g.lineWidth=3;
      g.beginPath();g.arc(w/2,h*0.52,w*0.05,0,Math.PI*2);g.stroke();
      spits(w/2,h*0.32,13);
    },256,256,{scherp:true}),
        rimpel: cvTex((g,w,h)=>{
      g.fillStyle='#1a8a8a';g.fillRect(0,0,w,h);
      for(let i=1;i<=7;i++){
        g.strokeStyle='rgba(200,245,250,'+(0.28-i*0.03)+')';
        g.lineWidth=2;
        g.beginPath();g.ellipse(w/2,h/2,i*w/13,i*h/16,0,0,Math.PI*2);g.stroke();
      }
      g.fillStyle='rgba(255,255,255,.28)';
      g.beginPath();g.ellipse(w*.32,h*.32,w*.2,h*.07, -0.4,0,Math.PI*2);g.fill();
    },64,64,{repeat:[3,2]}),
    water: cvTex((g,w,h)=>{
      const lg=g.createLinearGradient(0,0,0,h);
      lg.addColorStop(0,'#7ee8e0');
      lg.addColorStop(.35,'#3ec8c4');
      lg.addColorStop(.7,'#1a9aaa');
      lg.addColorStop(1,'#0e6e80');
      g.fillStyle=lg;g.fillRect(0,0,w,h);
      for(let i=0;i<18;i++){
        g.strokeStyle='rgba(255,255,255,'+(0.08+rnd(i)*0.12)+')';
        g.lineWidth=1+rnd(i+3);
        const y=rnd(i+5)*h;
        g.beginPath();g.moveTo(0,y);g.quadraticCurveTo(w*.5,y+(rnd(i+8)-.5)*8,w,y+(rnd(i+2)-.5)*6);g.stroke();
      }
    },64,64,{repeat:[4,2]}),
    glinster: cvTex((g,w,h)=>{
      g.clearRect(0,0,w,h);
      for(let i=0;i<40;i++){
        const x=rnd(i+2)*w,y=rnd(i+9)*h,r=0.6+rnd(i)*1.4;
        const grd=g.createRadialGradient(x,y,0,x,y,r*3);
        grd.addColorStop(0,'rgba(255,255,255,.9)');
        grd.addColorStop(1,'rgba(200,255,255,0)');
        g.fillStyle=grd;g.beginPath();g.arc(x,y,r*3,0,Math.PI*2);g.fill();
      }
    },64,64,{repeat:[2,2]}),
    rank: cvTex((g,w,h)=>{
      g.clearRect(0,0,w,h);
      for(let k=0;k<8;k++){
        const x0=w*(0.06+k*0.12+rnd(k)*0.03);
        const len=h*(0.55+rnd(k+2)*0.4);
        // stengel
        g.strokeStyle=rnd(k)>.5?'#1a4a10':'#0e3010';
        g.lineWidth=2;
        g.beginPath();g.moveTo(x0,0);
        for(let y=0;y<len;y+=5){
          g.lineTo(x0+Math.sin(y*0.08+k)*6+(rnd(k*20+y)-.5)*3,y);
        }
        g.stroke();
        // bladclusters, dichter bovenin
        const n=22+Math.floor(rnd(k+4)*10);
        for(let i=0;i<n;i++){
          const yy=rnd(k*11+i)*len;
          const xx=x0+(rnd(k+i+7)-.5)*16;
          const s=3+rnd(i)*5*(1-yy/h);
          const c=rnd(i+3);
          g.fillStyle=c>.7?'#6aad32':c>.4?'#3d8a22':'#1a5a14';
          g.beginPath();g.ellipse(xx,yy,s,s*0.7,rnd(i)*2.8,0,Math.PI*2);g.fill();
        }
      }
    },128,256,{scherp:true}),
    nevel: cvTex((g,w,h)=>{
      g.clearRect(0,0,w,h);
      const lg=g.createLinearGradient(0,0,0,h);
      lg.addColorStop(0,'rgba(255,200,150,0)');
      lg.addColorStop(.45,'rgba(180,120,140,.42)');
      lg.addColorStop(1,'rgba(60,30,50,0)');
      g.fillStyle=lg;g.fillRect(0,0,w,h);
    },128,64,{scherp:true}),
    glas: tex((g,n)=>{
      g.fillStyle='#7eb898';g.fillRect(0,0,n,n);
      g.strokeStyle='rgba(20,40,20,.55)';g.lineWidth=3;
      for(let i=0;i<=4;i++){g.beginPath();g.moveTo(i*n/4,0);g.lineTo(i*n/4,n);g.stroke()}
      for(let i=0;i<=6;i++){g.beginPath();g.moveTo(0,i*n/6);g.lineTo(n,i*n/6);g.stroke()}
      g.fillStyle='rgba(255,240,180,.28)';g.fillRect(6,6,n*.3,n*.2);
    },64,null,true),
    klimop: tex((g,n)=>{
      g.clearRect(0,0,n,n);
      for(let k=0;k<7;k++){
        const x0=n*(0.08+k*0.13+rnd(k)*0.04);
        g.strokeStyle=rnd(k)>.5?'#1a4a12':'#0c3010';
        g.lineWidth=1.2;
        g.beginPath();g.moveTo(x0,0);
        for(let y=0;y<=n;y+=4)g.lineTo(x0+Math.sin(y*0.09+k)*5+(rnd(k*17+y)-.5)*2,y);
        g.stroke();
        for(let i=0;i<36;i++){
          const yy=rnd(k*13+i)*n,xx=x0+(rnd(k+i+3)-.5)*11,s=1.4+rnd(i)*2.8;
          const c=rnd(i+5);
          g.fillStyle=c>.75?'#6aaa32':c>.45?'#3d8a22':c>.2?'#1e5a14':'#0e3010';
          g.save();g.translate(xx,yy);g.rotate(rnd(i+8)*6.28);
          g.beginPath();g.ellipse(0,0,s,s*0.55,0,0,Math.PI*2);g.fill();
          g.restore();
        }
      }
    },128,null,true),
    bloem: tex((g,n)=>{
      g.clearRect(0,0,n,n);
      const kleuren=['#d4a017','#d45a20','#f0e8c0','#c03020','#e8d060'];
      g.fillStyle='#2a6a18';
      g.fillRect(n*.45,n*.4,n*.1,n*.6);
      g.fillStyle=kleuren[Math.floor(rnd(3)*kleuren.length)];
      for(let i=0;i<5;i++){
        const a=i/5*Math.PI*2;
        g.beginPath();g.ellipse(n*.5+Math.cos(a)*8,n*.32+Math.sin(a)*8,6,4,a,0,Math.PI*2);g.fill();
      }
      g.fillStyle='#f0d060';g.beginPath();g.arc(n*.5,n*.32,3.5,0,Math.PI*2);g.fill();
    },32,null,true),
    sjaal: tex((g,n)=>{
      const band=n/4;
      for(let y=0;y<n;y+=band){
        g.fillStyle=(Math.floor(y/band)%2)?'#1a140c':'#e8b41c';
        g.fillRect(0,y,n,band);
      }
      // lichte breisteek
      g.fillStyle='rgba(255,255,255,.12)';
      for(let y=2;y<n;y+=4)g.fillRect(0,y,n,1);
    },64,[1,1],true),
    mantelPlooi: tex((g,n)=>{
      for(let x=0;x<n;x++){
        const u=x/n;
        const plooi=0.55+0.45*Math.pow(Math.abs(Math.sin(u*Math.PI*10)),0.65);
        const c=Math.floor(48+plooi*90);
        g.fillStyle='rgb('+c+','+(c+6)+','+(c-2)+')';
        g.fillRect(x,0,1,n);
      }
      // lichte zoomrand bovenaan (v=1 bij lathe is boven? wissel: lichte baan aan beide uiteinden)
      g.fillStyle='rgba(220,230,240,.18)';
      g.fillRect(0,0,n,3);g.fillRect(0,n-4,n,4);
    },64,null,false),
    pollen: tex((g,n)=>{
      g.clearRect(0,0,n,n);
      const lg=g.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);
      lg.addColorStop(0,'rgba(255,230,120,.95)');
      lg.addColorStop(.5,'rgba(255,200,60,.45)');
      lg.addColorStop(1,'rgba(255,200,60,0)');
      g.fillStyle=lg;g.fillRect(0,0,n,n);
    },32,null,false),
    vonk: tex((g,n)=>{
      g.clearRect(0,0,n,n);
      const lg=g.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);
      lg.addColorStop(0,'rgba(255,240,180,1)');
      lg.addColorStop(.35,'rgba(255,160,40,.85)');
      lg.addColorStop(1,'rgba(255,80,0,0)');
      g.fillStyle=lg;g.fillRect(0,0,n,n);
    },32,null,false),
    vlam: cvTex((g,w,h)=>{
      g.clearRect(0,0,w,h);
      function vlamVorm(cx,cy,rx,ry,c0,c1){
        const grd=g.createRadialGradient(cx,cy+ry*0.35,0,cx,cy,ry);
        grd.addColorStop(0,c0);grd.addColorStop(.55,c1);grd.addColorStop(1,'rgba(255,80,0,0)');
        g.fillStyle=grd;
        g.beginPath();
        g.moveTo(cx,cy-ry);
        g.bezierCurveTo(cx+rx,cy-ry*0.2,cx+rx*0.7,cy+ry*0.4,cx,cy+ry);
        g.bezierCurveTo(cx-rx*0.7,cy+ry*0.4,cx-rx,cy-ry*0.2,cx,cy-ry);
        g.fill();
      }
      vlamVorm(w*.5,h*.52,w*.42,h*.46,'rgba(255,250,220,1)','rgba(255,140,30,.85)');
      vlamVorm(w*.5,h*.42,w*.22,h*.38,'rgba(255,255,240,1)','rgba(255,200,80,.7)');
    },64,96,{scherp:true}),
    halo: cvTex((g,w,h)=>{
      g.clearRect(0,0,w,h);
      const grd=g.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);
      grd.addColorStop(0,'rgba(255,230,160,.95)');
      grd.addColorStop(.3,'rgba(255,160,50,.45)');
      grd.addColorStop(.65,'rgba(255,90,20,.12)');
      grd.addColorStop(1,'rgba(255,40,0,0)');
      g.fillStyle=grd;g.beginPath();g.arc(w/2,h/2,w/2,0,Math.PI*2);g.fill();
    },64,64,{scherp:true}),
    blad: cvTex((g,w,h)=>{
      g.clearRect(0,0,w,h);
      g.save();g.translate(w/2,h/2);g.rotate(-0.4);
      g.fillStyle='#8a3a16';
      g.beginPath();g.ellipse(0,0,w*0.38,h*0.16,0,0,Math.PI*2);g.fill();
      g.strokeStyle='rgba(40,16,4,.45)';g.lineWidth=1.2;
      g.beginPath();g.moveTo(-w*0.36,0);g.lineTo(w*0.36,0);g.stroke();
      g.restore();
    },32,32,{scherp:true}),
    straal: cvTex((g,w,h)=>{
      g.clearRect(0,0,w,h);
      const lg=g.createLinearGradient(0,0,0,h);
      lg.addColorStop(0,'rgba(255,220,150,0)');
      lg.addColorStop(.35,'rgba(255,200,120,.28)');
      lg.addColorStop(.6,'rgba(255,180,100,.16)');
      lg.addColorStop(1,'rgba(255,160,80,0)');
      g.fillStyle=lg;g.fillRect(0,0,w,h);
      const rg=g.createRadialGradient(w/2,h*0.45,0,w/2,h*0.45,w*0.5);
      rg.addColorStop(0,'rgba(255,230,170,.22)');
      rg.addColorStop(1,'rgba(255,200,120,0)');
      g.fillStyle=rg;g.fillRect(0,0,w,h);
    },64,256,{scherp:true}),
    gezicht: tex((g,n)=>{
      g.clearRect(0,0,n,n);
      const cx=n/2,cy=n*0.52;
      const huid=g.createRadialGradient(cx,cy-n*0.02,n*0.06,cx,cy,n*0.48);
      huid.addColorStop(0,'#f3c8a0');
      huid.addColorStop(.65,'#e2b089');
      huid.addColorStop(1,'rgba(190,130,90,0)');
      g.fillStyle=huid;
      g.beginPath();g.ellipse(cx,cy,n*0.42,n*0.48,0,0,Math.PI*2);g.fill();
      g.fillStyle='rgba(214,108,90,.2)';
      g.beginPath();g.ellipse(cx-n*0.15,cy+n*0.08,n*0.08,n*0.055,0,0,Math.PI*2);g.fill();
      g.beginPath();g.ellipse(cx+n*0.15,cy+n*0.08,n*0.08,n*0.055,0,0,Math.PI*2);g.fill();
      // natuurlijke wenkbrauwen
      g.strokeStyle='#4a3018';g.lineWidth=n*0.016;g.lineCap='round';
      g.beginPath();g.moveTo(cx-n*0.20,cy-n*0.02);g.quadraticCurveTo(cx-n*0.13,cy-n*0.07,cx-n*0.06,cy-n*0.02);g.stroke();
      g.beginPath();g.moveTo(cx+n*0.20,cy-n*0.02);g.quadraticCurveTo(cx+n*0.13,cy-n*0.07,cx+n*0.06,cy-n*0.02);g.stroke();
      function oog(ox){
        g.fillStyle='#f7f2ea';
        g.beginPath();g.ellipse(cx+ox,cy+n*0.04,n*0.052,n*0.028,0,0,Math.PI*2);g.fill();
        g.fillStyle='#6a4a28';
        g.beginPath();g.ellipse(cx+ox,cy+n*0.04,n*0.026,n*0.026,0,0,Math.PI*2);g.fill();
        g.fillStyle='#1a120c';
        g.beginPath();g.ellipse(cx+ox,cy+n*0.04,n*0.013,n*0.013,0,0,Math.PI*2);g.fill();
        g.fillStyle='#fff';
        g.beginPath();g.arc(cx+ox-n*0.008,cy+n*0.032,n*0.006,0,Math.PI*2);g.fill();
      }
      oog(-n*0.11);oog(n*0.11);
      // neus met schaduw
      g.fillStyle='rgba(150,80,55,.28)';
      g.beginPath();g.ellipse(cx+n*0.012,cy+n*0.11,n*0.028,n*0.04,0.2,0,Math.PI*2);g.fill();
      g.fillStyle='rgba(240,200,170,.45)';
      g.beginPath();g.ellipse(cx-n*0.008,cy+n*0.08,n*0.016,n*0.03,0,0,Math.PI*2);g.fill();
      // kleine mond
      g.strokeStyle='#a05048';g.lineWidth=n*0.012;g.lineCap='round';
      g.beginPath();g.moveTo(cx-n*0.05,cy+n*0.20);g.quadraticCurveTo(cx,cy+n*0.23,cx+n*0.05,cy+n*0.20);g.stroke();
    },256,null,false)
  };
  T.lucht.wrapS=T.lucht.wrapT=THREE.ClampToEdgeWrapping;
  T.wolk.wrapS=T.wolk.wrapT=THREE.ClampToEdgeWrapping;
  T.klimop.wrapS=T.klimop.wrapT=THREE.RepeatWrapping;T.klimop.repeat.set(2.4,2.4);
  T.bladKaart.wrapS=T.bladKaart.wrapT=THREE.ClampToEdgeWrapping;
  T.hek.wrapS=T.hek.wrapT=THREE.ClampToEdgeWrapping;
  T.hekBoog.wrapS=T.hekBoog.wrapT=THREE.ClampToEdgeWrapping;
  T.rank.wrapS=T.rank.wrapT=THREE.RepeatWrapping;T.rank.repeat.set(3.2,2.2);
  T.nevel.wrapS=T.nevel.wrapT=THREE.ClampToEdgeWrapping;
  T.bloem.wrapS=T.bloem.wrapT=THREE.ClampToEdgeWrapping;
  T.pollen.wrapS=T.pollen.wrapT=THREE.ClampToEdgeWrapping;
  T.vonk.wrapS=T.vonk.wrapT=THREE.ClampToEdgeWrapping;
  T.vlam.wrapS=T.vlam.wrapT=THREE.ClampToEdgeWrapping;
  T.halo.wrapS=T.halo.wrapT=THREE.ClampToEdgeWrapping;
  T.blad.wrapS=T.blad.wrapT=THREE.ClampToEdgeWrapping;
  T.straal.wrapS=T.straal.wrapT=THREE.ClampToEdgeWrapping;
  T.gezicht.wrapS=T.gezicht.wrapT=THREE.ClampToEdgeWrapping;
  T.glas.wrapS=T.glas.wrapT=THREE.ClampToEdgeWrapping;

  function bordTex(tekst){
    return cvTex((g,w,h)=>{
      g.fillStyle='#16110a';g.fillRect(0,0,w,h);
      g.fillStyle='#2a2014';g.fillRect(14,14,w-28,h-28);
      g.strokeStyle='#c9a227';g.lineWidth=10;g.strokeRect(10,10,w-20,h-20);
      g.strokeStyle='#7a5a14';g.lineWidth=3;g.strokeRect(22,22,w-44,h-44);
      const regels=tekst.split('\n');
      g.textAlign='center';g.textBaseline='middle';
      g.font=regels.length>1?'bold 92px Georgia,Palatino,serif':'bold 128px Georgia,Palatino,serif';
      g.lineJoin='round';
      const stap=regels.length>1?108:0;
      regels.forEach((r,i)=>{
        const y=h/2+(i-(regels.length-1)/2)*stap;
        g.lineWidth=8;g.strokeStyle='#1a1004';g.strokeText(r,w/2,y);
        g.fillStyle='#f0d056';g.fillText(r,w/2,y);
      });
    },1024,256,{scherp:true,smooth:true});
  }
  T.bordKas=bordTex('DE KASSEN');
  T.bordHagrid=bordTex('HAGRIDS\nMOESTUIN');
  T.bordHal=bordTex('GROTE HAL');

  const mat={
    gras: new THREE.MeshLambertMaterial({map:T.gras}),
    haag: new THREE.MeshLambertMaterial({map:T.haag,color:0xf4ffe0}),
    baksteen: new THREE.MeshLambertMaterial({map:T.baksteen}),
    zandsteen: new THREE.MeshPhongMaterial({map:T.zandsteen,color:0xffffff,shininess:8,specular:0x332820}),
    pad: new THREE.MeshPhongMaterial({map:T.pad,color:0xffffff,shininess:10,specular:0x333333}),
    aarde: new THREE.MeshLambertMaterial({map:T.aarde}),
    hout: new THREE.MeshLambertMaterial({map:T.hout}),
    sokkel: new THREE.MeshPhongMaterial({map:T.zandsteen,color:0xe8d8b0,shininess:8,specular:0x332820}),
    ijzer: new THREE.MeshPhongMaterial({color:0x3c3c44,shininess:48,specular:0x9aa8b8,emissive:0x08080c,emissiveIntensity:0.15}),
    grind: new THREE.MeshLambertMaterial({map:T.grind}),
    water: new THREE.MeshPhongMaterial({map:T.water,color:0xb8fff0,transparent:true,opacity:0.92,depthWrite:false,shininess:120,specular:0xffffff,emissive:0x1a8890,emissiveIntensity:0.28}),
    rimpel: new THREE.MeshBasicMaterial({map:T.rimpel,transparent:true,opacity:0.35,depthWrite:false,side:THREE.DoubleSide}),
    glinster: new THREE.MeshBasicMaterial({map:T.glinster,transparent:true,opacity:0.7,depthWrite:false,side:THREE.DoubleSide}),
    wolk: new THREE.MeshBasicMaterial({map:T.wolk,transparent:true,opacity:0.88,depthWrite:false,fog:false,side:THREE.DoubleSide,toneMapped:false}),
    rank: new THREE.MeshLambertMaterial({map:T.rank,transparent:true,depthWrite:false,side:THREE.DoubleSide}),
    nevel: new THREE.MeshBasicMaterial({map:T.nevel,transparent:true,opacity:0.65,depthWrite:false,fog:false,side:THREE.DoubleSide}),
    voering: new THREE.MeshLambertMaterial({color:0xd4a017,side:THREE.DoubleSide}),
    mantel: new THREE.MeshLambertMaterial({map:T.mantelPlooi,color:0x8a9488,side:THREE.FrontSide,emissive:0x1a2218,emissiveIntensity:0.2}),
    kasteel: new THREE.MeshLambertMaterial({color:0x24344c}),
    daksteen: new THREE.MeshLambertMaterial({color:0x1a2436}),
    druppel: new THREE.MeshBasicMaterial({color:0xc8eef6,transparent:true,opacity:0.7,depthWrite:false}),
    glas: new THREE.MeshLambertMaterial({map:T.glas,transparent:true,opacity:0.62,depthWrite:false,side:THREE.DoubleSide}),
    klimop: new THREE.MeshLambertMaterial({map:T.klimop,transparent:true,depthWrite:false,side:THREE.DoubleSide}),
    bloem: new THREE.MeshLambertMaterial({map:T.bloem,transparent:true,depthWrite:false,side:THREE.DoubleSide}),
    sjaal: new THREE.MeshLambertMaterial({map:T.sjaal}),
    pompoen: new THREE.MeshLambertMaterial({color:0xe07018}),
    steel: new THREE.MeshLambertMaterial({color:0x2a5a14}),
    huid: new THREE.MeshLambertMaterial({color:0xe6b892}),
    haar: new THREE.MeshLambertMaterial({color:0x3a2210}),
    gewaad: new THREE.MeshLambertMaterial({color:0x3a3e34}),
    zwart: new THREE.MeshLambertMaterial({color:0x1a140c}),
    oogwit: new THREE.MeshLambertMaterial({color:0xf4efe6}),
    schaduw: new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.42,depthWrite:false}),
    grondSchaduw: new THREE.MeshLambertMaterial({color:0x2a3a18}),
    glow: new THREE.MeshBasicMaterial({color:0xffd070,transparent:true,opacity:0.55,depthWrite:false,side:THREE.DoubleSide}),
    gezicht: new THREE.MeshLambertMaterial({map:T.gezicht,transparent:true,depthWrite:false}),
    leisteen: new THREE.MeshLambertMaterial({color:0x2a2824}),
    vonk: new THREE.MeshBasicMaterial({map:T.vonk,transparent:true,depthWrite:false,opacity:0.9}),
    vlam: new THREE.MeshBasicMaterial({map:T.vlam,transparent:true,depthWrite:false,side:THREE.DoubleSide,fog:false,blending:THREE.AdditiveBlending,toneMapped:false,opacity:0.85}),
    halo: new THREE.MeshBasicMaterial({map:T.halo,transparent:true,depthWrite:false,side:THREE.DoubleSide,fog:false,blending:THREE.AdditiveBlending,toneMapped:false,opacity:0.4}),
    blad: new THREE.MeshBasicMaterial({map:T.blad,transparent:true,depthWrite:false,side:THREE.DoubleSide}),
    straal: new THREE.MeshBasicMaterial({map:T.straal,transparent:true,depthWrite:false,side:THREE.DoubleSide,fog:true,blending:THREE.AdditiveBlending,opacity:0.22,toneMapped:false}),
    bladHaag: new THREE.MeshLambertMaterial({map:T.bladKaart,alphaTest:0.4,side:THREE.DoubleSide,color:0xe8ff78,emissive:0x1a3008,emissiveIntensity:0.18,depthWrite:true}),
    hekIJzer: new THREE.MeshLambertMaterial({map:T.hek,alphaTest:0.35,side:THREE.DoubleSide,color:0x2a2a30,depthWrite:true}),
    hekBoog: new THREE.MeshLambertMaterial({map:T.hekBoog,alphaTest:0.35,side:THREE.DoubleSide,color:0x2a2a30,depthWrite:true})
  };
  mat.bordKas=new THREE.MeshBasicMaterial({map:T.bordKas,side:THREE.DoubleSide});
  mat.bordHagrid=new THREE.MeshBasicMaterial({map:T.bordHagrid,side:THREE.DoubleSide});
  mat.bordHal=new THREE.MeshBasicMaterial({map:T.bordHal,side:THREE.DoubleSide});
  const haagTinten=[0xffffff,0xf6ffe8,0xeeffd8,0xfffff0,0xf2ffdc];
  const haagMats=haagTinten.map(c=>new THREE.MeshLambertMaterial({map:T.haag,color:c,emissive:0x1c3010,emissiveIntensity:0.14}));
  const haagTopMat=new THREE.MeshLambertMaterial({map:T.haag,color:0xffffe8,emissive:0x243814,emissiveIntensity:0.16});
  const haagOnderMat=new THREE.MeshLambertMaterial({map:T.haag,color:0x5a7028,emissive:0x101808,emissiveIntensity:0.08});
  const haagToppen=[];
  mat.padSlijt=new THREE.MeshPhongMaterial({map:T.pad,vertexColors:true,shininess:10,specular:0x333333});
  mat.padRand=new THREE.MeshPhongMaterial({map:T.pad,transparent:true,depthWrite:false,shininess:6,specular:0x222222,vertexColors:true});
  mat.padRand.onBeforeCompile=function(sh){
    sh.fragmentShader=sh.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.a *= vColor.r;');
  };
  mat.steenAO=new THREE.MeshLambertMaterial({map:T.zandsteen,vertexColors:true});
  mat.steenInst=new THREE.MeshLambertMaterial({map:T.zandsteen,color:0xffffff});
  mat.steenMuur=new THREE.MeshPhongMaterial({map:T.zandsteen,color:0xffffff,shininess:12,specular:0x3a3028,vertexColors:true,normalScale:new THREE.Vector2(0.75,0.75)});

  mat.kopSteen=new THREE.MeshPhongMaterial({map:T.zandsteen,color:0xd0c8bc,shininess:18,specular:0x555550});

  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x2a62d4);
  scene.fog=new THREE.Fog(0x6a9ae0,130,210);

  const camera=new THREE.PerspectiveCamera(56,innerWidth/Math.max(1,innerHeight),0.28,180);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:false,alpha:false,powerPreference:'high-performance'});
  renderer.setClearColor(0x2a62d4,1);
  if(THREE.ACESFilmicToneMapping!=null){
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=0.94;
  }
  let licht=false;
  function pixelRatio(w,h){
    const cap=licht?0.72:1;
    const pix=licht?180000:320000;
    return Math.min(cap,window.devicePixelRatio||1,Math.sqrt(pix/Math.max(1,w*h)));
  }
  function maat(){
    const w=innerWidth,h=Math.max(1,innerHeight);
    renderer.setPixelRatio(pixelRatio(w,h));
    renderer.setSize(w,h,false);
    camera.aspect=w/h;camera.updateProjectionMatrix();
  }
  maat();
  addEventListener('resize',maat,{passive:true});

  const hemel=new THREE.HemisphereLight(0x9ec8f4,0x2a3e18,0.92);
  scene.add(hemel);
  const zon=new THREE.DirectionalLight(0xffffff,1.00);
  zon.position.set(-14,24,10);
  scene.add(zon);
  const tegenZon=new THREE.DirectionalLight(0xe8eef2,0.16);
  tegenZon.position.set(16,9,-8);
  scene.add(tegenZon);
  scene.add(new THREE.AmbientLight(0xdce0e6,0.30));

  const hemelkoepel=new THREE.Mesh(
    new THREE.SphereGeometry(110,16,12),
    new THREE.MeshBasicMaterial({map:T.lucht,side:THREE.BackSide,depthWrite:false,fog:false,toneMapped:false})
  );
  scene.add(hemelkoepel);

  const world=new THREE.Group();
  scene.add(world);
  const col=[];

  function voeg(mesh,ouder){
    (ouder||world).add(mesh);
    return mesh;
  }
  function box(m,x,y,z,w,h,d,rotY,ouder){
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
    mesh.position.set(x,y,z);
    if(rotY)mesh.rotation.y=rotY;
    return voeg(mesh,ouder);
  }
  function cyl(m,x,y,z,rB,rT,h,seg,ouder){
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rT,rB,h,seg||8),m);
    mesh.position.set(x,y,z);
    return voeg(mesh,ouder);
  }
  function schijf(m,x,z,r,ouder){
    const s=new THREE.Mesh(new THREE.CircleGeometry(r,10),mat.schaduw);
    s.rotation.x=-Math.PI/2;s.position.set(x,0.045,z);
    return voeg(s,ouder);
  }
  function solid(x,z,w,d,h){
    col.push({minx:x-w/2,maxx:x+w/2,minz:z-d/2,maxz:z+d/2,h:h||3.6});
  }
  function zetAO(geom,h){
    const pos=geom.attributes.position;
    const colr=new Float32Array(pos.count*3);
    for(let i=0;i<pos.count;i++){
      const y=pos.getY(i);
      const t=h?Math.max(0,Math.min(1,(y+h/2)/Math.max(0.001,h))):0.8;
      const a=0.48+0.52*t;
      colr[i*3]=a;colr[i*3+1]=a;colr[i*3+2]=a;
    }
    geom.setAttribute('color',new THREE.BufferAttribute(colr,3));
    return geom;
  }
  const speerPos=[];
  const haagBladPos=[];
  const haagFade=[];
  function maakFadeMesh(mesh){
    if(!mesh||!mesh.material)return mesh;
    const m=mesh.material.clone();
    mesh.material=m;
    mesh.userData.fadeOc=1;
    mesh.userData.fadeMat=m;
    mesh.userData.fadeOp=1;
    haagFade.push(mesh);
    return mesh;
  }
  function smeltInGroep(grp){
    grp.updateMatrixWorld(true);
    const groepen=new Map();
    const kind=[...grp.children];
    kind.forEach(o=>{
      if(!o.isMesh||!o.material)return;
      const g=o.geometry.clone();
      o.updateWorldMatrix(true,false);
      g.applyMatrix4(o.matrixWorld);
      const k=o.material.uuid;
      if(!groepen.has(k))groepen.set(k,{mat:o.material,geos:[],meshes:[]});
      groepen.get(k).geos.push(g);
      groepen.get(k).meshes.push(o);
    });
    groepen.forEach(gr=>{
      const geom=gr.geos.length>1?voegGeos(gr.geos):gr.geos[0];
      const mesh=new THREE.Mesh(geom,gr.mat);
      mesh.matrixAutoUpdate=false;
      scene.add(mesh);
      maakFadeMesh(mesh);
      gr.meshes.forEach(o=>{if(o.parent)o.parent.remove(o)});
    });
  }
  function muur(x,z,w,d,h,y0){
    h=(h||3.2)+1.9;y0=y0||0;
    const tint=haagMats[Math.floor(rnd(x*9+z*13)*haagMats.length)%haagMats.length];
    const grp=new THREE.Group();
    // blokvormig zoals HP1, scherpe randen; bladkaarten maken de silhouet oneffen
    box(tint,x,y0+h/2,z,w,h,d,0,grp);
    box(haagOnderMat,x,y0+0.14,z,w*1.02,0.28,d*1.02,0,grp);
    box(mat.grondSchaduw,x,0.03,z,w+0.50,0.06,d+0.50);
    const langs=w>=d?w:d, dwars=w>=d?d:w, alongX=w>=d;
    // bobbelige, klonterige kam zoals HP1
    const nCl=Math.max(2,Math.round(langs/0.7));
    for(let i=0;i<nCl;i++){
      const tt=(i+0.3+rnd(x+i)*0.4)/nCl-0.5;
      const hh=0.16+rnd(x*3+i)*0.26;
      const ww=0.48+rnd(i+2)*0.50;
      const dd=dwars*(0.86+rnd(i+4)*0.30);
      const px=alongX?x+tt*langs:x+(rnd(i+6)-.5)*dwars*0.18;
      const pz=alongX?z+(rnd(i+7)-.5)*dwars*0.18:z+tt*langs;
      box(tint,px,y0+h+hh*0.32,pz,alongX?ww:dd,hh,alongX?dd:ww,0,grp);
    }
    if(langs>=2.4){
      const ns=Math.max(2,Math.round(langs/0.7));
      for(let i=0;i<=ns;i++){
        const tt=i/ns-0.5;
        const px=alongX?x+tt*langs:x;
        const pz=alongX?z:z+tt*langs;
        speerPos.push(px,y0+h+0.28,pz);
      }
    }
    // bladkaarten langs de bovenrand en de lange zijden, voor een bobbelige silhouet
    const stap=0.42;
    const nTop=Math.max(2,Math.round(langs/stap));
    for(let i=0;i<nTop;i++){
      const tt=(i+0.5)/nTop-0.5;
      const px=alongX?x+tt*langs:x;
      const pz=alongX?z:z+tt*langs;
      // één rij op de kam (silhouet) en één zijkant, zuinig voor fps
      haagBladPos.push(px+(rnd(i)-.5)*dwars*0.2, y0+h+0.22+rnd(x+i)*0.20, pz+(rnd(i+2)-.5)*dwars*0.2, alongX?0:Math.PI/2, 1.05+rnd(i)*0.55);
      const side=(i%2?1:-1)*dwars*0.52;
      haagBladPos.push(alongX?px:x+side,y0+h-0.04,alongX?z+side:pz, alongX?0:Math.PI/2, 0.7+rnd(i+3)*0.45);
    }
    smeltInGroep(grp);
    solid(x,z,w,d,y0+h+0.45);
  }

  /* stapelwolken: gelaagde puf-kaarten, alleen om de Y-as naar de camera (geen lookAt-kruisen) */
  const wolken=[];
  const wolkDum=new THREE.Object3D();
  let wolkInst=null,wolkInstO=null,wolkPufs=null,wolkPufsO=null;
  function maakCumulus(){
    const geo=new THREE.PlaneGeometry(1,0.72);
    const matTop=new THREE.MeshBasicMaterial({map:T.wolk,color:0xffffff,transparent:true,opacity:0.9,depthWrite:false,fog:true,toneMapped:true});
    const tops=[];
    const nCloud=6;
    for(let i=0;i<nCloud;i++){
      const a=(i+0.25)/nCloud*Math.PI*1.15-0.2;
      const R=62+rnd(i*3)*18;
      const cx=Math.sin(a)*R, cz=28+Math.cos(a)*R;
      const cy=18+rnd(i+4)*6;
      const s0=1.25;
      const stukken=[[0,0,0,14*s0,7.2*s0,0],[-4.2,1.1,1.8,10*s0,5.2*s0,0.08],[4.0,0.9,-1.4,9.5*s0,5.0*s0,-0.08],[0.6,2.4,0.4,8.0*s0,4.4*s0,0]];
      stukken.forEach((s,k)=>{
        tops.push({x:cx+s[0],y:cy+s[1],z:cz+s[2],sx:s[3]*(0.85+rnd(i*7+k)*0.25),sy:s[4]*(0.85+rnd(i*9+k)*0.2),rx:s[5],rz:(rnd(i+k)-.5)*0.1});
      });
    }
    wolkInst=new THREE.InstancedMesh(geo,matTop,tops.length);
    wolkInst.frustumCulled=true;wolkInst.userData.dyn=1;wolkInst.renderOrder=-2;
    scene.add(wolkInst);
    wolkPufs=tops;wolkInstO=null;wolkPufsO=null;
    tops.forEach((p,i)=>{
      wolkDum.position.set(p.x,p.y,p.z);
      wolkDum.rotation.set(p.rx,Math.atan2(-p.x,-p.z+14),p.rz);
      wolkDum.scale.set(p.sx,p.sy,1);
      wolkDum.updateMatrix();
      wolkInst.setMatrixAt(i,wolkDum.matrix);
    });
    wolkInst.instanceMatrix.needsUpdate=true;
  }
  maakCumulus();

  /* grond */
  const grond=new THREE.Mesh(new THREE.PlaneGeometry(64,70),mat.gras);
  grond.rotation.x=-Math.PI/2;grond.position.set(0,-0.01,14);
  voeg(grond);

  /* paden: kronkelende linten met zachte randen, slijtage, keitjes en graspollen */
  const loopVlakken=[grond];
  const keiDummy=new THREE.Object3D();
  const keiMeshes=[], polMeshes=[];
  function padLint(punten, breed0, opt){
    opt=opt||{};
    const y=opt.y==null?0.028:opt.y;
    const pts=punten.map(p=>new THREE.Vector3(p[0],0,p[1]));
    if(pts.length<2)return null;
    const curve=new THREE.CatmullRomCurve3(pts,false,'catmullrom',0.22);
    const lengte=curve.getLength();
    const N=Math.max(16,Math.round(lengte*3.2));
    const posI=[],idxI=[],uvI=[],colI=[],posR=[],idxR=[],uvR=[],colR=[];
    const side=new THREE.Vector3(), prev=new THREE.Vector3();
    let lenAcc=0;
    for(let i=0;i<=N;i++){
      const t=i/N;
      const p=curve.getPointAt(t);
      const tan=curve.getTangentAt(t);
      side.set(-tan.z,0,tan.x);
      if(side.lengthSq()<1e-8)side.set(1,0,0);else side.normalize();
      const w=breed0*(0.86+rnd(punten[0][0]*8+i*3.17)*0.28);
      const jagged=(rnd(i*7.3+punten[0][1])-0.5)*0.16;
      const inner=w*0.34, mid=w*0.5+jagged;
      if(i)lenAcc+=p.distanceTo(prev);
      prev.copy(p);
      const STEEN=1.85;
      const u=lenAcc/STEEN;
      const iL=p.x+side.x*inner, iR=p.x-side.x*inner;
      const iLz=p.z+side.z*inner, iRz=p.z-side.z*inner;
      posI.push(iL,y,iLz, p.x,y+0.0015,p.z, iR,y,iRz);
      uvI.push(inner/STEEN,u, 0,u, -inner/STEEN,u);
      const slijt=0.92+rnd(i*2.2)*0.05;
      colI.push(slijt,slijt*0.99,slijt*0.96, 1.04,1.02,0.98, slijt,slijt*0.99,slijt*0.96);
      const oL=p.x+side.x*mid, oR=p.x-side.x*mid;
      const oLz=p.z+side.z*mid, oRz=p.z-side.z*mid;
      posR.push(oL,y-0.004,oLz, iL,y,iLz, iR,y,iRz, oR,y-0.004,oRz);
      uvR.push(mid/STEEN,u, inner/STEEN,u, -inner/STEEN,u, -mid/STEEN,u);
      colR.push(0.0,0.35,0.15, 0.96,0.94,0.88, 0.96,0.94,0.88, 0.0,0.35,0.15);
    }
    for(let i=0;i<N;i++){
      const a=i*3;
      idxI.push(a,a+3,a+1, a+1,a+3,a+4, a+1,a+4,a+2, a+2,a+4,a+5);
      const e=i*4;
      idxR.push(e,e+4,e+1, e+1,e+4,e+5, e+1,e+5,e+2, e+2,e+5,e+6, e+2,e+6,e+3, e+3,e+6,e+7);
    }
    const gI=new THREE.BufferGeometry();
    gI.setAttribute('position',new THREE.Float32BufferAttribute(posI,3));
    gI.setAttribute('uv',new THREE.Float32BufferAttribute(uvI,2));
    gI.setAttribute('color',new THREE.Float32BufferAttribute(colI,3));
    gI.setIndex(idxI);gI.computeVertexNormals();
    const meshI=new THREE.Mesh(gI,mat.padSlijt);
    voeg(meshI);loopVlakken.push(meshI);
    const gR=new THREE.BufferGeometry();
    gR.setAttribute('position',new THREE.Float32BufferAttribute(posR,3));
    gR.setAttribute('uv',new THREE.Float32BufferAttribute(uvR,2));
    gR.setAttribute('color',new THREE.Float32BufferAttribute(colR,3));
    gR.setIndex(idxR);gR.computeVertexNormals();
    const meshR=new THREE.Mesh(gR,mat.padRand);
    meshR.renderOrder=1;voeg(meshR);
    const nKei=Math.max(4,Math.round(lengte*1.3));
    for(let i=0;i<nKei;i++){
      const t=0.04+rnd(i*11+breed0)*0.92;
      const p=curve.getPointAt(t), tan=curve.getTangentAt(t);
      const sd=new THREE.Vector3(-tan.z,0,tan.x).normalize();
      const kant=rnd(i+3)>0.5?1:-1;
      const off=breed0*(0.42+rnd(i*4)*0.22)*kant;
      keiMeshes.push({x:p.x+sd.x*off,z:p.z+sd.z*off,s:0.05+rnd(i*8)*0.07,y:0.03,ry:rnd(i)*6});
    }
    const nPol=Math.max(5,Math.round(lengte*1.1));
    for(let i=0;i<nPol;i++){
      const t=0.03+rnd(i*13+2)*0.94;
      const p=curve.getPointAt(t), tan=curve.getTangentAt(t);
      const sd=new THREE.Vector3(-tan.z,0,tan.x).normalize();
      const kant=rnd(i+9)>0.5?1:-1;
      const off=breed0*(0.48+rnd(i*6)*0.28)*kant;
      polMeshes.push({x:p.x+sd.x*off,z:p.z+sd.z*off,s:0.7+rnd(i)*0.7,ry:rnd(i+1)*6});
    }
    return meshI;
  }
  function zachtPlein(x,z,r){
    const seg=28, pos=[], uv=[], col=[], idx=[];
    pos.push(x,0.032,z);uv.push(0,0);col.push(1.04,1.02,0.98);
    for(let i=0;i<=seg;i++){
      const a=i/seg*Math.PI*2;
      const rr=r*(0.86+rnd(i*3.1)*0.2);
      const px=x+Math.sin(a)*rr, pz=z+Math.cos(a)*rr;
      pos.push(px,0.03,pz);
      uv.push((px-x)/1.85,(pz-z)/1.85);
      col.push(0.94,0.92,0.88);
      if(i<seg)idx.push(0,i+1,i+2);
    }
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
    g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
    g.setIndex(idx);g.computeVertexNormals();
    const mesh=new THREE.Mesh(g,mat.padSlijt);
    voeg(mesh);loopVlakken.push(mesh);
    const rand=new THREE.Mesh(new THREE.RingGeometry(r*0.82,r*1.18,28),mat.padRand);
    rand.rotation.x=-Math.PI/2;rand.position.set(x,0.026,z);voeg(rand);
    return mesh;
  }
  const aanloop=padLint([[0.05,3.15],[0.22,4.4],[-0.16,5.7],[0.08,7.0],[0.0,8.45]],2.7);
  padLint([[0.0,11.05],[0.18,12.3],[-0.12,13.5],[0.0,14.0],[0.24,16.0],[-0.18,18.6],[0.14,21.4],[-0.1,24.2],[0.16,26.8],[0.0,29.0],[0.0,31.35]],2.75);
  padLint([[-16.1,14.2],[-13.6,13.82],[-11.0,14.28],[-8.2,13.88],[-5.6,14.22],[-3.5,13.95],[-1.8,14.05]],2.55);
  padLint([[16.1,14.18],[13.5,13.85],[11.0,14.25],[8.3,13.9],[5.6,14.2],[3.5,13.96],[1.8,14.06]],2.55);
  const plein=zachtPlein(0,14,3.7);
  (function strooiPad(){
    const nK=keiMeshes.length,nP=polMeshes.length;
    if(nK){
      const geo=new THREE.SphereGeometry(1,6,5);
      const inst=new THREE.InstancedMesh(geo,new THREE.MeshLambertMaterial({map:T.pad,color:0xc4a880}),nK);
      for(let i=0;i<nK;i++){
        const k=keiMeshes[i];
        keiDummy.position.set(k.x,k.y,k.z);
        keiDummy.rotation.set(rnd(i)*0.8,k.ry,rnd(i+2)*0.8);
        keiDummy.scale.set(k.s*1.2,k.s*0.55,k.s);
        keiDummy.updateMatrix();inst.setMatrixAt(i,keiDummy.matrix);
      }
      inst.instanceMatrix.needsUpdate=true;voeg(inst);
    }
    if(nP){
      const geo=new THREE.PlaneGeometry(0.28,0.2);
      const inst=new THREE.InstancedMesh(geo,new THREE.MeshLambertMaterial({map:T.haag,color:0xc8f070,transparent:true,depthWrite:false,side:THREE.DoubleSide}),nP);
      inst.renderOrder=2;
      for(let i=0;i<nP;i++){
        const k=polMeshes[i];
        keiDummy.position.set(k.x,0.08,k.z);
        keiDummy.rotation.set(-0.15,k.ry,0);
        keiDummy.scale.set(k.s,k.s,1);
        keiDummy.updateMatrix();inst.setMatrixAt(i,keiDummy.matrix);
      }
      inst.instanceMatrix.needsUpdate=true;voeg(inst);
    }
  })();

  /* hagen */
  // zuidelijke gang, verkort zodat de fontein links in beeld komt
  muur(-2.9,3.05,1.35,4.1,3.25);
  muur(2.9,4.6,1.35,7.2,3.3);
  // binnenplaats: westzijde open voor fontein en zandstenen muur
  muur(-12.8,8.4,6.5,1.35,3.2);
  muur(8.6,8.4,12,1.35,3.15);
  muur(-8.6,19.6,12,1.35,3.25);
  muur(8.6,19.6,12,1.35,3.2);
  // noordelijke gang naar de kassen
  muur(-2.9,25.5,1.35,9,3.3);
  muur(2.9,25.5,1.35,9,3.35);
  muur(0,33.4,9,1.4,3.4);
  muur(-5.4,31.4,1.4,5,3.3);
  muur(5.4,31.4,1.4,5,3.3);
  // westelijke gang (Hagrid)
  muur(-16,11.55,14,1.3,3.15);
  muur(-16,16.45,14,1.3,3.2);
  // oostelijke gang (Hal)
  muur(16,11.55,14,1.3,3.2);
  muur(16,16.45,14,1.3,3.15);
  // verre randen
  muur(-24,14,1.5,28,3.5);
  muur(24,14,1.5,28,3.45);
  muur(0,-2.2,20,1.5,3.3);
  (function plaatsSperen(){
    const n=speerPos.length/3;if(!n)return;
    const dummy=new THREE.Object3D();
    const stam=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.018,0.018,0.42,5),mat.ijzer,n);
    const punt=new THREE.InstancedMesh(new THREE.ConeGeometry(0.032,0.16,5),mat.ijzer,n);
    for(let i=0;i<n;i++){
      dummy.position.set(speerPos[i*3],speerPos[i*3+1],speerPos[i*3+2]);
      dummy.updateMatrix();stam.setMatrixAt(i,dummy.matrix);
      dummy.position.y+=0.27;dummy.updateMatrix();punt.setMatrixAt(i,dummy.matrix);
    }
    stam.instanceMatrix.needsUpdate=true;punt.instanceMatrix.needsUpdate=true;
    voeg(stam);voeg(punt);
  })();
  (function plaatsBladKaarten(){
    const n=haagBladPos.length/5;if(!n)return;
    const dummy=new THREE.Object3D();
    const inst=new THREE.InstancedMesh(new THREE.PlaneGeometry(0.38,0.26),mat.bladHaag.clone(),n);
    maakFadeMesh(inst);
    inst.frustumCulled=true;
    for(let i=0;i<n;i++){
      const o=i*5;
      dummy.position.set(haagBladPos[o],haagBladPos[o+1],haagBladPos[o+2]);
      // licht rechtop, zodat de bovenrand bobbelt
      dummy.rotation.set(-0.85+(rnd(i)-.5)*0.35, haagBladPos[o+3]+(rnd(i)-.5)*0.6, (rnd(i+3)-.5)*0.35);
      const s=haagBladPos[o+4]*1.15;
      dummy.scale.set(s,s,1);
      dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate=true;voeg(inst);
  })();

  function boom(x,z,s){
    s=s||1;
    const stam=new THREE.Mesh(new THREE.CylinderGeometry(0.11*s,0.16*s,2.2*s,6),mat.hout);
    stam.position.set(x,1.1*s,z);voeg(stam);
    const tm=new THREE.MeshLambertMaterial({map:T.haag,color:0xc8e090});
    [[0,2.15,0,0.85],[0.4,2.4,0.15,0.62],[-0.35,2.35,-0.12,0.58],[0.08,2.75,-0.08,0.5]].forEach(([dx,dy,dz,r])=>{
      const bl=new THREE.Mesh(new THREE.SphereGeometry(r*s,7,6),tm);
      bl.position.set(x+dx*s,dy*s,z+dz*s);voeg(bl);
    });
  }
  [[-10,33.2,1.15],[10,33.4,1.2],[-6,34.2,0.95],[6,34.0,1.0],[-16,22,1.05],[16,22.2,1.1],[-14,32.4,0.9],[14,32.6,0.95]].forEach(([x,z,s])=>boom(x,z,s));

  /* kasteelsilhouet in de verte: geschilderd, zelfgemaakt, zonder wapen */
  T.kasteel=cvTex((g,w,h)=>{
    g.clearRect(0,0,w,h);
    const sil='#2a4058';
    function toren(x,basis,bw,th,spits){
      g.fillStyle=sil;
      g.fillRect(x-bw/2,basis-th,bw,th);
      g.fillStyle='#3a546c';
      g.beginPath();g.moveTo(x-bw/2-4,basis-th);g.lineTo(x,basis-th-spits);g.lineTo(x+bw/2+4,basis-th);g.closePath();g.fill();
      g.fillStyle=sil;
    }
    function blok(x,y,bw,bh){g.fillStyle=sil;g.fillRect(x,y,bw,bh)}
    function raam(x,y,bw,bh){
      g.fillStyle=rnd(x*3+y)>.55?'#d8e4f0':'#3a4a5a';
      g.fillRect(x,y,bw,bh);
    }
    blok(180,h-78,420,78);
    for(let i=0;i<14;i++)blok(190+i*28,h-96,14,18);
    blok(120,h-70,80,70);
    blok(580,h-64,200,64);
    toren(140,h-70,36,90,48);
    toren(230,h-78,28,70,38);
    toren(390,h-78,44,110,58);
    toren(520,h-78,30,80,42);
    toren(640,h-64,34,95,50);
    toren(760,h-64,26,72,36);
    toren(70,h-70,22,60,32);
    // verlichte ramen
    [[200,h-50,7,9],[230,h-50,7,9],[260,h-50,7,9],[310,h-54,8,11],[350,h-54,8,11],
     [410,h-120,6,10],[400,h-90,6,9],[422,h-90,6,9],[500,h-48,7,9],[545,h-48,7,9],
     [610,h-44,7,9],[650,h-110,5,9],[635,h-80,6,8],[720,h-42,6,8],[150,h-100,5,8],
     [132,h-55,6,8],[755,h-90,5,8]].forEach(([x,y,bw,bh])=>raam(x,y,bw,bh));
    g.globalCompositeOperation='destination-out';
    const uit=g.createLinearGradient(0,h-40,0,h);
    uit.addColorStop(0,'rgba(0,0,0,0)');
    uit.addColorStop(1,'rgba(0,0,0,1)');
    g.fillStyle=uit;g.fillRect(0,h-40,w,40);
    g.globalCompositeOperation='source-over';
  },1024,256,{scherp:true});
  const kastMat=new THREE.MeshBasicMaterial({map:T.kasteel,transparent:true,opacity:1,depthWrite:false,fog:false,side:THREE.DoubleSide,toneMapped:false});
  const kastSil=new THREE.Mesh(new THREE.PlaneGeometry(13,5.2),kastMat);
  kastSil.position.set(3.2,6.35,35.5);
  kastSil.rotation.y=Math.PI;
  kastSil.renderOrder=2;
  voeg(kastSil);
  const bergRij=cvTex((g,w,h)=>{
    g.clearRect(0,0,w,h);
    g.fillStyle='#4a6a86';
    g.beginPath();g.moveTo(0,h);
    g.lineTo(0,h*0.62);
    [[0.08,0.22],[0.18,0.45],[0.30,0.28],[0.42,0.58],[0.55,0.30],[0.68,0.50],[0.80,0.24],[0.92,0.40],[1,0.32]].forEach(([u,v])=>{
      g.lineTo(u*w,(1-v)*h);
    });
    g.lineTo(w,h);g.closePath();g.fill();
    g.fillStyle='#5a7a94';
    g.beginPath();g.moveTo(0,h);
    [[0.0,0.18],[0.15,0.32],[0.28,0.16],[0.48,0.36],[0.66,0.14],[0.84,0.28],[1,0.16]].forEach(([u,v],i)=>{
      if(i===0)g.lineTo(u*w,(1-v)*h);else g.lineTo(u*w,(1-v)*h);
    });
    g.lineTo(w,h);g.closePath();g.fill();
  },1024,256,{scherp:true});
  const bergMat=new THREE.MeshBasicMaterial({map:bergRij,transparent:true,opacity:0.95,depthWrite:false,fog:false,side:THREE.DoubleSide,toneMapped:false});
  const bergen=new THREE.Mesh(new THREE.PlaneGeometry(36,7.2),bergMat);
  bergen.position.set(2.0,6.6,38.5);
  bergen.rotation.y=Math.PI;
  bergen.renderOrder=0;
  voeg(bergen);
  const boomRij=cvTex((g,w,h)=>{
    g.clearRect(0,0,w,h);
    for(let i=0;i<28;i++){
      const x=w*(i/27),H=h*(0.45+rnd(i)*0.55),R=18+rnd(i+3)*22;
      g.fillStyle=rnd(i)>.5?'#1e4a1c':'#143814';
      g.beginPath();g.moveTo(x-R,h);g.quadraticCurveTo(x,h-H,x+R,h);g.fill();
      g.fillRect(x-4,h-H*0.4,8,H*0.4);
    }
  },512,128,{scherp:true});
  const boomMat=new THREE.MeshBasicMaterial({map:boomRij,transparent:true,depthWrite:false,fog:false,side:THREE.DoubleSide});
  const bomen=new THREE.Mesh(new THREE.PlaneGeometry(22,4.4),boomMat);
  bomen.position.set(1.5,4.6,35.2);
  bomen.rotation.y=Math.PI;
  bomen.renderOrder=1;
  voeg(bomen);
  const nevelVlak=new THREE.Mesh(new THREE.PlaneGeometry(20,2.8),mat.nevel);
  nevelVlak.position.set(2.4,5.0,34.8);
  nevelVlak.rotation.y=Math.PI;
  nevelVlak.renderOrder=3;
  nevelVlak.visible=false;
  voeg(nevelVlak);

  /* buxusbolletjes */
  [[-6.6,6.8],[3.8,7.3],[-3.6,19.2],[3.65,18.8],[-10.5,12.3],[10.5,12.4]].forEach(([x,z],i)=>{
    cyl(mat.haag,x,0.16,z,0.28,0.28,0.32,8);
    const bol=new THREE.Mesh(new THREE.SphereGeometry(0.5+i*0.03,8,6),mat.haag);
    bol.position.set(x,0.72,z);voeg(bol);
    schijf(mat.schaduw,x,z,0.45);
  });

  /* smeedijzeren poort zuid */
  function pilaar(x,z,steen){
    const m=steen||mat.zandsteen;
    const H=1.85;
    box(m,x,H/2,z,0.56,H,0.56);
    // schuine hals onder de overhangende kap
    const hals=new THREE.Mesh(new THREE.CylinderGeometry(0.40,0.30,0.10,8),m);
    hals.position.set(x,H+0.05,z);voeg(hals);
    const kap=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.10,8),m);
    kap.position.set(x,H+0.13,z);voeg(kap);
    const bov=new THREE.Mesh(new THREE.CylinderGeometry(0.30,0.38,0.07,8),m);
    bov.position.set(x,H+0.20,z);voeg(bov);
    const knop=new THREE.Mesh(new THREE.SphereGeometry(0.075,10,8),m);
    knop.position.set(x,H+0.28,z);voeg(knop);
    const sp=new THREE.Mesh(new THREE.ConeGeometry(0.04,0.16,5),mat.ijzer);
    sp.position.set(x,H+0.40,z);voeg(sp);
    box(mat.grondSchaduw,x,0.03,z,0.95,0.06,0.95);
    solid(x,z,0.72,0.72,2.15);
  }
  function ijzerBuis(parent,x1,y1,z1,x2,y2,z2,rad){
    const dx=x2-x1,dy=y2-y1,dz=z2-z1,len=Math.hypot(dx,dy,dz)||0.01;
    const m=new THREE.Mesh(new THREE.CylinderGeometry(rad,rad,len,5),mat.ijzer);
    m.position.set((x1+x2)/2,(y1+y2)/2,(z1+z2)/2);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(dx/len,dy/len,dz/len));
    parent.add(m);
    return m;
  }
  function hekstuk(x0,z0,x1,z1,n){
    n=n||5;
    const g=new THREE.Group();world.add(g);
    const dx=x1-x0,dz=z1-z0,len=Math.hypot(dx,dz),ux=dx/len,uz=dz/len;
    for(let i=0;i<=n;i++){
      const t=i/n,h=1.12+((i%2)?0.14:0);
      const px=x0+dx*t,pz=z0+dz*t;
      ijzerBuis(g,px,0.02,pz,px,h,pz,0.028);
      const sp=new THREE.Mesh(new THREE.ConeGeometry(0.042,0.18,6),mat.ijzer);
      sp.position.set(px,h+0.09,pz);g.add(sp);
      if(i<n){
        const mx=x0+dx*(t+0.5/n),mz=z0+dz*(t+0.5/n);
        const kr=new THREE.Mesh(new THREE.TorusGeometry(0.12,0.018,5,12,Math.PI*1.6),mat.ijzer);
        kr.position.set(mx,0.78,mz);
        kr.rotation.y=Math.atan2(ux,uz);kr.rotation.z=0.2;
        g.add(kr);
      }
    }
    ijzerBuis(g,x0,0.48,z0,x1,0.48,z1,0.022);
    ijzerBuis(g,x0,0.92,z0,x1,0.92,z1,0.022);
  }
  function boog(x,z,r){
    r=r||2.2;
    const g=new THREE.Group();g.position.set(x,0,z);world.add(g);
    const b=new THREE.Mesh(new THREE.TorusGeometry(r,0.048,8,36,Math.PI),mat.ijzer);
    b.position.set(0,1.7,0);g.add(b);
    const b2=new THREE.Mesh(new THREE.TorusGeometry(r*0.86,0.030,6,32,Math.PI),mat.ijzer);
    b2.position.set(0,1.7,0);g.add(b2);
    const b3=new THREE.Mesh(new THREE.TorusGeometry(r*0.74,0.018,5,28,Math.PI),mat.ijzer);
    b3.position.set(0,1.7,0);g.add(b3);
    // speerpunten langs de boog
    for(let i=1;i<=11;i++){
      const a=Math.PI*i/12;
      const px=Math.cos(a)*r, py=1.7+Math.sin(a)*r;
      const sp=new THREE.Mesh(new THREE.ConeGeometry(0.048,0.22,6),mat.ijzer);
      sp.position.set(px,py,0);
      sp.rotation.z=a-Math.PI/2;g.add(sp);
      // krullen alleen aan de schouders, midden open voor het bord
      if(i!==6){
        const hang=i===5||i===7?0.05:0.14;
        const kr=new THREE.Mesh(new THREE.TorusGeometry(0.15,0.020,5,14,Math.PI*1.45),mat.ijzer);
        kr.position.set(Math.cos(a)*r*0.93,1.7+Math.sin(a)*r*0.93-hang,0.04*(i%2?1:-1));
        kr.rotation.x=1.05;
        kr.rotation.z=a+(i<6?0.55:-0.55);
        g.add(kr);
        if(i<=4||i>=8){
          const kr2=new THREE.Mesh(new THREE.TorusGeometry(0.11,0.016,4,12,Math.PI*1.5),mat.ijzer);
          kr2.position.set(Math.cos(a)*r*0.86,1.7+Math.sin(a)*r*0.70, -0.05*(i%2?1:-1));
          kr2.rotation.x=1.15;kr2.rotation.z=a+(i<6?-0.3:0.3);
          g.add(kr2);
        }
      }
    }
    // middenrozet boven de doorgang, hoog genoeg voor het bord
    const roz=new THREE.Mesh(new THREE.TorusGeometry(0.16,0.022,6,16),mat.ijzer);
    roz.position.set(0,1.7+r*0.78,0);g.add(roz);
    const spM=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.28,6),mat.ijzer);
    spM.position.set(0,1.7+r+0.14,0);g.add(spM);
    // schouderkrullen
    [[0.28,1],[2.86,-1],[0.48,1],[2.66,-1]].forEach(([a,s])=>{
      const kr=new THREE.Mesh(new THREE.TorusGeometry(0.22,0.024,5,16,Math.PI*1.6),mat.ijzer);
      kr.position.set(Math.cos(a)*r*0.90,1.7+Math.sin(a)*r*0.50,0.05*s);
      kr.rotation.z=a;g.add(kr);
    });
    // ranken aan de schouders; top midden vrij zodat borden leesbaar blijven
    const hoeken=[0.22,0.42,0.62,0.88,2.26,2.52,2.72,2.92];
    hoeken.forEach((a,i)=>{
      const lang=0.65+((i%3)*0.2), breed=0.42+((i%2)*0.14);
      const p=new THREE.Mesh(new THREE.PlaneGeometry(breed,lang),mat.rank);
      p.position.set(Math.cos(a)*r,1.7+Math.sin(a)*r-lang*0.22,0.1+(i%2?0.02:-0.06));
      p.rotation.z=a-Math.PI/2;
      g.add(p);
      if(i%2===0){
        const k=new THREE.Mesh(new THREE.PlaneGeometry(breed*0.9,lang*0.65),mat.klimop);
        k.position.set(Math.cos(a)*r*0.98,1.7+Math.sin(a)*r-lang*0.18,-0.1);
        k.rotation.z=a-Math.PI/2;
        g.add(k);
      }
    });
    return g;
  }
  pilaar(-2.2,1.5);pilaar(2.2,1.5);
  pilaar(-5.5,1.5);pilaar(5.5,1.5);
  hekstuk(-5.2,1.5,-2.5,1.5,7);
  hekstuk(2.5,1.5,5.2,1.5,7);
  // 3D-sierhek-vleugels in de zuidelijke poort
  function sierHek(cx,z,spiegel){
    const g=new THREE.Group();g.position.set(cx,0,z);world.add(g);
    const n=7, breed=1.7;
    for(let i=0;i<n;i++){
      const x=(i-(n-1)/2)*(breed/(n-1));
      const h=1.35+(i%2?0.12:0);
      ijzerBuis(g,x,0.02,0,x,h,0,0.026);
      const sp=new THREE.Mesh(new THREE.ConeGeometry(0.04,0.18,6),mat.ijzer);
      sp.position.set(x,h+0.09,0);g.add(sp);
      if(i<n-1){
        const kr=new THREE.Mesh(new THREE.TorusGeometry(0.11,0.016,5,12,Math.PI*1.5),mat.ijzer);
        kr.position.set(x+breed/(n-1)*0.5,0.82,0.02);
        kr.rotation.y=0.15;g.add(kr);
      }
    }
    ijzerBuis(g,-breed/2,0.42,0,breed/2,0.42,0,0.02);
    ijzerBuis(g,-breed/2,0.88,0,breed/2,0.88,0,0.02);
    ijzerBuis(g,-breed/2,1.28,0,breed/2,1.28,0,0.02);
    return g;
  }
  sierHek(-1.05,1.52);sierHek(1.05,1.52);
  (function(){
    const v=new THREE.Group();v.position.set(-2.2,0,1.65);v.rotation.y=-1.05;world.add(v);
    const v2=new THREE.Group();v2.position.set(2.2,0,1.65);v2.rotation.y=1.05+Math.PI;world.add(v2);
    [v,v2].forEach(g=>{
      for(let i=0;i<6;i++){
        const x=0.12+i*0.22,h=1.15;
        ijzerBuis(g,x,0.02,0,x,h,0,0.024);
        const sp=new THREE.Mesh(new THREE.ConeGeometry(0.036,0.15,5),mat.ijzer);
        sp.position.set(x,h+0.08,0);g.add(sp);
      }
      ijzerBuis(g,0.12,0.45,0,0.12+5*0.22,0.45,0,0.018);
      ijzerBuis(g,0.12,0.9,0,0.12+5*0.22,0.9,0,0.018);
    });
  })();
  boog(0,13.4,2.2);
  pilaar(-2.2,13.4);pilaar(2.2,13.4);
  // vierkante zandstenen pijlers tussen de hagen, zoals in HP1
  [[-2.25,8.4],[2.25,8.4],[-2.25,19.6],[2.25,19.6],[-2.25,29.8],[2.25,29.8]].forEach(([x,z])=>pilaar(x,z));

  /* beek, sproeiende achtkantige fontein met stenen koppen, houten brug */
  const fx=-5.0,fz=9.7;
  const waterVlakken=[];
  function steenMuur(cx,cz,dikte,hoog,lengte,langsZ){
    const N=18, P=9;
    const pos=[],uv=[],col=[],idx=[];
    const toppen=[];
    for(let i=0;i<=N;i++){
      const t=i/N, along=(t-0.5)*lengte;
      const hVar=(rnd(cx*9+cz+i*7.1)-0.5)*0.26+Math.sin(t*Math.PI)*0.07;
      const bulge=0.06+rnd(i*3.3+cx)*0.08;
      const curve=Math.sin(t*Math.PI)*0.13;
      const prof=[
        [0.00, 0.00],
        [dikte*0.22, 0.05],
        [dikte*0.58, 0.18],
        [dikte*0.64+bulge*0.3, hoog*0.22],
        [dikte*0.80+bulge, hoog*0.50],
        [dikte*0.70+bulge*0.4, hoog*0.86],
        [dikte*0.42, hoog+0.02+hVar],
        [dikte*0.16, hoog+0.13+hVar],
        [0.02, hoog+0.05+hVar]
      ];
      const lean=0.025;
      for(let p=0;p<P;p++){
        const out=prof[p][0]+lean*prof[p][1], y=prof[p][1];
        const x=langsZ?cx+out+curve:cx+along;
        const z=langsZ?cz+along:cz+out+curve;
        pos.push(x,y,z);
        uv.push(t*(lengte/2.05), y/2.05);
        const a=0.56+0.44*Math.min(1,y/(hoog+0.25));
        col.push(a, a*0.98, a*0.93);
        if(p===7)toppen.push({x,y,z,along,t,hVar});
      }
    }
    for(let i=0;i<N;i++){
      for(let p=0;p<P-1;p++){
        const a=i*P+p,b=a+P,c=a+1,d=b+1;
        idx.push(a,b,c, c,b,d);
      }
      const a=i*P,b=(i+1)*P,c=a+(P-1),d=b+(P-1);
      idx.push(a,c,b, b,c,d);
    }
    function sluitEinde(ii){
      const base=ii*P;
      for(let p=1;p<P-1;p++)idx.push(base, base+p, base+p+1);
    }
    sluitEinde(0);sluitEinde(N);
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
    geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    voeg(new THREE.Mesh(geo,mat.steenMuur));
    box(mat.grondSchaduw,cx,0.03,cz, langsZ?dikte+0.7:lengte+0.7, 0.06, langsZ?lengte+0.7:dikte+0.7);
    // ronde eindstijlen met bolle dop
    const eindR=dikte*0.42;
    [-lengte/2, lengte/2].forEach((al,ei)=>{
      const x=langsZ?cx+dikte*0.35:cx+al;
      const z=langsZ?cz+al:cz+dikte*0.35;
      const hh=hoog+0.08+rnd(ei+cx)*0.1;
      const stam=new THREE.Mesh(new THREE.CylinderGeometry(eindR,eindR*1.08,hh,12),mat.zandsteen);
      stam.position.set(x,hh/2,z);voeg(stam);
      const dop=new THREE.Mesh(new THREE.SphereGeometry(eindR*1.05,16,10),mat.zandsteen);
      dop.position.set(x,hh+eindR*0.15,z);dop.scale.set(1,0.48,1);voeg(dop);
    });
    // vuil- en mosrand onderaan
    const rok=new THREE.Mesh(new THREE.PlaneGeometry(langsZ?dikte+1.2:lengte+0.6,langsZ?lengte+0.6:dikte+1.2),
      new THREE.MeshLambertMaterial({color:0x5a4a32,transparent:true,opacity:0.58,depthWrite:false}));
    rok.rotation.x=-Math.PI/2;rok.position.set(cx+(langsZ?dikte*0.2:0),0.032,cz+(langsZ?0:dikte*0.2));voeg(rok);
    const mosMat=new THREE.MeshLambertMaterial({map:T.haag,color:0x6a8a32,transparent:true,opacity:0.82,depthWrite:false,side:THREE.DoubleSide});
    for(let i=0;i<5;i++){
      const tt=(i+0.5)/5-0.5, along=tt*lengte*0.9;
      const x=langsZ?cx+dikte*0.7:cx+along;
      const z=langsZ?cz+along:cz+dikte*0.7;
      const mos=new THREE.Mesh(new THREE.PlaneGeometry(0.7+rnd(i)*0.5,0.28+rnd(i+1)*0.16),mosMat);
      mos.position.set(x,0.14,z);
      if(langsZ)mos.rotation.y=Math.PI/2;
      mos.rotation.x=-0.55;voeg(mos);
    }
    solid(cx,cz,langsZ?dikte:lengte,langsZ?lengte:dikte,hoog+0.25);
  }
  // zandstenen muur achter de fontein, met hangende ranken
  steenMuur(-7.35,9.8,0.72,3.4,6.2,true);
  function hangRank(x,y,z,w,h,rotY){
    const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat.rank);
    p.position.set(x,y,z);if(rotY)p.rotation.y=rotY;voeg(p);
  }
  hangRank(-7.0,2.9,9.8,5.8,2.2,Math.PI/2);
  hangRank(-7.05,2.6,8.4,2.4,1.8,Math.PI/2);
  hangRank(-7.05,2.7,11.2,2.2,1.6,Math.PI/2);
  hangRank(-6.98,3.35,9.3,2.4,1.3,Math.PI/2);
  hangRank(-6.98,3.3,10.4,2.2,1.2,Math.PI/2);

  // stenen goot met turquoise water (onderbroken onder de brug)
  function waterBak(x,z,w,d){
    box(mat.zandsteen,x,0.12,z,w+0.28,0.28,d+0.28);
    box(mat.zandsteen,x,0.28,z+d/2,w+0.28,0.28,0.16);
    box(mat.zandsteen,x,0.28,z-d/2,w+0.28,0.28,0.16);
    box(mat.zandsteen,x-w/2,0.28,z,0.16,0.28,d+0.28);
    box(mat.zandsteen,x+w/2,0.28,z,0.16,0.28,d+0.28);
    const wv=new THREE.Mesh(new THREE.PlaneGeometry(w-0.08,d-0.08),mat.water);
    wv.rotation.x=-Math.PI/2;wv.position.set(x,0.26,z);voeg(wv);waterVlakken.push(wv);
    const gl=new THREE.Mesh(new THREE.PlaneGeometry(w-0.1,d-0.1),mat.glinster);
    gl.rotation.x=-Math.PI/2;gl.position.set(x,0.28,z);voeg(gl);waterVlakken.push(gl);
  }
  // achthoekig bassin: verhoogde, afgeschuinde stenen rand en gloeiend turkoois water
  (function(){
    const x=fx,z=fz,r=1.78;
    if(!T.zandKorrel){
      T.blokSteen=cvTex((g,w,h)=>{
        g.fillStyle='#5a4630';g.fillRect(0,0,w,h);
        const kol=4, rij=3, bw=w/kol, bh=h/rij;
        for(let r=0;r<rij;r++){
          const off=(r%2)*(bw*0.5);
          for(let c=-1;c<=kol;c++){
            const v=((r*13+c*7)%7);
            const R=170+v*8,G=140+v*5,B=96+v*3;
            g.fillStyle='rgb('+R+','+G+','+B+')';
            const x=c*bw+off+1,y=r*bh+1;
            g.fillRect(x,y,bw-2,bh-2);
            g.fillStyle='rgba(80,60,36,0.25)';
            g.fillRect(x,y+bh*0.7,bw-2,bh*0.25);
          }
        }
      },256,192,{repeat:[2,2]});
    }
    const zandBak=new THREE.MeshLambertMaterial({map:T.blokSteen,color:0xe0ccaa,emissive:0x2a2014,emissiveIntensity:0.06});
    function ringBlok(rIn,rUit,y,h){
      const n=8, r=(rIn+rUit)/2, dik=Math.max(0.08,rUit-rIn);
      for(let i=0;i<n;i++){
        const a=i*Math.PI*2/n+Math.PI/n;
        const L=2*r*Math.tan(Math.PI/n)+0.03;
        box(zandBak, x+Math.cos(a)*r, y, z+Math.sin(a)*r, dik, h, L, -a);
      }
    }
    ringBlok(r+0.22,r+0.44,0.11,0.22);
    ringBlok(r+0.10,r+0.30,0.34,0.28);
    ringBlok(r+0.08,r+0.20,0.62,0.52);
    // bovenrand mag een korrel hebben (van boven gezien strekt de uv niet) 
    mat.randSteen=new THREE.MeshLambertMaterial({map:T.blokSteen,color:0xe0ccaa,emissive:0x2a2014,emissiveIntensity:0.06});
    const buiten=new THREE.Mesh(new THREE.CylinderGeometry(r+0.28,r+0.32,0.16,8,1,true),mat.randSteen);
    buiten.position.set(x,0.86,z);voeg(buiten);
    const rand=new THREE.Mesh(new THREE.RingGeometry(r-0.04,r+0.32,8),mat.randSteen);
    rand.rotation.x=-Math.PI/2;rand.position.set(x,0.94,z);voeg(rand);
    const lip=new THREE.Mesh(new THREE.CylinderGeometry(r-0.02,r-0.08,0.1,8,1,true),mat.randSteen);
    lip.position.set(x,0.88,z);voeg(lip);
    const bodem=new THREE.Mesh(new THREE.CircleGeometry(r-0.02,8),mat.zandsteen);
    bodem.rotation.x=-Math.PI/2;bodem.position.set(x,0.48,z);voeg(bodem);
    const wv=new THREE.Mesh(new THREE.CircleGeometry(r-0.06,24),mat.water);
    wv.rotation.x=-Math.PI/2;wv.position.set(x,0.78,z);voeg(wv);waterVlakken.push(wv);
    const gl=new THREE.Mesh(new THREE.CircleGeometry(r-0.08,24),mat.glinster);
    gl.rotation.x=-Math.PI/2;gl.position.set(x,0.80,z);voeg(gl);waterVlakken.push(gl);
  })();
  waterBak(-3.15,9.7,2.0,1.35);
  waterBak(3.15,9.7,2.0,1.35);
  waterBak(4.7,9.7,1.3,1.6);
  // onder de brug: lager water, geen randen in het looppad
  (function(){
    const wv=new THREE.Mesh(new THREE.PlaneGeometry(4.4,1.2),mat.water);
    wv.rotation.x=-Math.PI/2;wv.position.set(0,0.12,9.7);voeg(wv);waterVlakken.push(wv);
  })();
  // collision voor het water, uitgezonderd de brug (x -1.7..1.7)
  solid(-5.0,9.7,3.8,3.8,0.9);
  solid(-3.2,9.7,1.8,1.5,0.5);
  solid(3.2,9.7,1.8,1.5,0.5);
  solid(4.7,9.7,1.4,1.8,0.5);

  // middenzuil in het water, met vier gladde stenen koppen (geen beeld erbovenop)
  function steenKop(){
    const g=new THREE.Group();
    const kop=new THREE.Mesh(new THREE.SphereGeometry(0.155,14,12),mat.kopSteen);
    kop.scale.set(1.08,1.02,0.96);g.add(kop);
    const snuit=new THREE.Mesh(new THREE.SphereGeometry(0.09,12,10),mat.kopSteen);
    snuit.position.set(0,-0.02,0.145);snuit.scale.set(0.88,0.7,1.18);g.add(snuit);
    const kaak=new THREE.Mesh(new THREE.SphereGeometry(0.07,10,8),mat.kopSteen);
    kaak.position.set(0,-0.08,0.12);kaak.scale.set(0.92,0.48,1.02);g.add(kaak);
    const wenk=new THREE.Mesh(new THREE.TorusGeometry(0.088,0.022,8,14,Math.PI),mat.kopSteen);
    wenk.position.set(0,0.07,0.1);wenk.rotation.x=1.15;g.add(wenk);
    [-1,1].forEach(s=>{
      const oor=new THREE.Mesh(new THREE.SphereGeometry(0.048,8,8),mat.kopSteen);
      oor.position.set(s*0.13,0.09,-0.01);oor.scale.set(0.58,1.15,0.5);oor.rotation.z=s*-0.38;g.add(oor);
      const oog=new THREE.Mesh(new THREE.SphereGeometry(0.024,8,6),new THREE.MeshLambertMaterial({color:0x1a1814}));
      oog.position.set(s*0.055,0.035,0.132);g.add(oog);
    });
    const mond=new THREE.Mesh(new THREE.CircleGeometry(0.026,10),new THREE.MeshBasicMaterial({color:0x0a0c10}));
    mond.position.set(0,-0.04,0.225);g.add(mond);
    const kraag=new THREE.Mesh(new THREE.TorusGeometry(0.14,0.038,8,14),mat.kopSteen);
    kraag.position.set(0,-0.02,-0.02);kraag.rotation.x=Math.PI/2;kraag.scale.set(1,0.82,1);g.add(kraag);
    return g;
  }
  const zuilVoet=new THREE.Mesh(zetAO(new THREE.CylinderGeometry(0.46,0.54,0.2,8),0.2),mat.steenAO);
  zuilVoet.position.set(fx,0.72,fz);voeg(zuilVoet);
  const zuil=new THREE.Mesh(zetAO(new THREE.CylinderGeometry(0.26,0.34,0.95,8),0.95),mat.steenAO);
  zuil.position.set(fx,1.28,fz);voeg(zuil);
  const kapiteel=new THREE.Mesh(zetAO(new THREE.CylinderGeometry(0.38,0.28,0.12,8),0.12),mat.steenAO);
  kapiteel.position.set(fx,1.78,fz);voeg(kapiteel);
  const dop=new THREE.Mesh(new THREE.SphereGeometry(0.16,12,8),mat.zandsteen);
  dop.position.set(fx,1.92,fz);dop.scale.set(1,0.68,1);voeg(dop);
  const pin=new THREE.Mesh(new THREE.SphereGeometry(0.055,10,8),mat.leisteen);
  pin.position.set(fx,2.04,fz);voeg(pin);
  const mos=new THREE.MeshLambertMaterial({map:T.haag,color:0x6a9a38});
  [[-0.22,0.18],[0.2,-0.16],[0.08,0.26]].forEach(([dx,dz],i)=>{
    const m=new THREE.Mesh(new THREE.SphereGeometry(0.09,7,5),mos);
    m.position.set(fx+dx,0.82,fz+dz);m.scale.set(1.3,0.28,0.9);voeg(m);
  });
  schijf(mat.schaduw,fx,fz,1.15);
  solid(fx,fz,1.15,1.15,2.15);

  const NKOP=4, NDRUP=5;
  const monden=[], stralen=[], druppels=[], spatten=[];
  for(let i=0;i<NKOP;i++){
    const a=i*Math.PI/2, rad=0.34, y=1.32;
    const kop=steenKop();
    kop.position.set(fx+Math.sin(a)*rad,y,fz+Math.cos(a)*rad);
    kop.rotation.y=a;voeg(kop);
    const mond=new THREE.Vector3(fx+Math.sin(a)*(rad+0.23),y-0.04,fz+Math.cos(a)*(rad+0.23));
    const mid=new THREE.Vector3(fx+Math.sin(a)*0.78,y+0.4,fz+Math.cos(a)*0.78);
    const land=new THREE.Vector3(fx+Math.sin(a)*1.18,0.80,fz+Math.cos(a)*1.18);
    monden.push({mond,mid,land});
    const straal=new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(mond,mid,land),16,0.02,6,false),mat.druppel.clone());
    straal.material.opacity=0.68;voeg(straal);stralen.push(straal);
    for(let k=0;k<NDRUP;k++){
      const d=new THREE.Mesh(new THREE.SphereGeometry(0.028,6,5),mat.druppel.clone());
      d.userData={kop:i,fase:(k/NDRUP)+i*0.08};
      voeg(d);druppels.push(d);
    }
    const s=new THREE.Mesh(new THREE.TorusGeometry(0.08,0.012,5,12),mat.druppel.clone());
    s.rotation.x=Math.PI/2;s.visible=false;voeg(s);spatten.push(s);
  }

  // houten brug met stenen dek en treden, over de beek
  const brug=new THREE.Group();brug.position.set(0,0,9.7);world.add(brug);
  function brugBox(m,x,y,z,w,h,d){
    const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
    b.position.set(x,y,z);brug.add(b);return b;
  }
  // treden zuid en noord
  brugBox(mat.zandsteen,0,0.12,-1.55,3.4,0.2,0.55);
  brugBox(mat.zandsteen,0,0.28,-1.15,3.4,0.16,0.5);
  brugBox(mat.zandsteen,0,0.12,1.55,3.4,0.2,0.55);
  brugBox(mat.zandsteen,0,0.28,1.15,3.4,0.16,0.5);
  // stenen dek
  const dek=new THREE.Mesh(new THREE.BoxGeometry(3.4,0.14,2.2),mat.pad);
  dek.position.set(0,0.4,0);brug.add(dek);
  // houten leuningen
  [-1.7,1.7].forEach(sx=>{
    [-1.15,0,1.15].forEach(sz=>{
      brugBox(mat.hout,sx,0.7,sz,0.14,0.7,0.14);
    });
    brugBox(mat.hout,sx,1.02,0,0.1,0.1,2.5);
    brugBox(mat.hout,sx,0.72,0,0.08,0.08,2.5);
  });
  // loopvlak voor tikken
  const brugVlak=new THREE.Mesh(new THREE.PlaneGeometry(3.4,3.6),new THREE.MeshBasicMaterial({visible:false}));
  brugVlak.rotation.x=-Math.PI/2;brugVlak.position.set(0,0.48,9.7);voeg(brugVlak);
  // leuning-collision, dek is begaanbaar
  solid(-1.7,9.7,0.3,2.6,1.3);
  solid(1.7,9.7,0.3,2.6,1.3);

  /* stenen bankje */
  /* stenen bankje */
  box(mat.zandsteen,3.4,0.28,16.6,1.5,0.18,0.48);
  box(mat.zandsteen,2.75,0.22,16.6,0.18,0.44,0.44);
  box(mat.zandsteen,4.05,0.22,16.6,0.18,0.44,0.44);
  box(mat.zandsteen,3.4,0.62,16.82,1.5,0.16,0.12);
  schijf(mat.schaduw,3.4,16.6,0.85);
  solid(3.4,16.6,1.6,0.6,0.8);

  /* bloembakken */
  function bak(x,z,rot){
    box(mat.baksteen,x,0.22,z,1.2,0.44,0.55,rot);
    box(mat.aarde,x,0.46,z,1.05,0.1,0.42,rot);
    schijf(mat.schaduw,x,z,0.7);
    solid(x,z,1.2,0.55,0.55);
  }
  bak(-10.2,11.2,0);bak(3.2,9.0,0);bak(-3.2,20.2,0);bak(3.2,20.4,0);

  /* bloemetjes als kaartjes */
  const bloemen=[];
  const bloemPlek=[[-10.2,11.2],[-10.0,11.35],[-10.4,11.1],[3.2,9.0],[3.0,9.15],[3.4,8.85],[-3.2,20.2],[-3.0,20.35],[3.2,20.4],[3.4,20.25]];
  bloemPlek.forEach(([x,z],i)=>{
    const f=new THREE.Mesh(new THREE.PlaneGeometry(0.18,0.26),mat.bloem);
    f.position.set(x+(rnd(i)-.5)*0.2,0.68,z+(rnd(i+3)-.5)*0.15);
    bloemen.push(f);voeg(f);
  });

  /* klimop-vlakken */
  function klimopVlak(x,y,z,w,h,rotY){
    const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat.klimop);
    p.position.set(x,y,z);if(rotY)p.rotation.y=rotY;voeg(p);
  }
  klimopVlak(-2.2,1.6,6.2,1.4,2.2,Math.PI/2);
  klimopVlak(2.2,1.5,25.5,1.3,2.0,-Math.PI/2);
  klimopVlak(8.6,1.6,18.8,2.0,2.3,Math.PI);
  hangRank(-2.25,2.5,5.2,1.6,1.8,Math.PI/2);
  hangRank(2.25,2.4,24.8,1.5,1.6,-Math.PI/2);

  /* ======== DRIE BESTEMMINGEN ======== */
  const deuren={};

  function maakBord(matBord,ouder,x,y,z,w,h){
    const b=new THREE.Mesh(new THREE.PlaneGeometry(w||1.9,h||0.58),matBord);
    b.position.set(x,y,z);ouder.add(b);
    return b;
  }

  /* 1. De Kassen, noord */
  const gevelKas=new THREE.Group();
  gevelKas.position.set(0,0,30.6);
  gevelKas.rotation.y=Math.PI;
  world.add(gevelKas);
  box(mat.baksteen,0,0.2,0,6.4,0.4,0.7,0,gevelKas);
  const achterKas=new THREE.Mesh(new THREE.PlaneGeometry(6.5,5.4),new THREE.MeshLambertMaterial({color:0x1a2e16,side:THREE.DoubleSide}));
  achterKas.position.set(0,2.6,-0.28);gevelKas.add(achterKas);
  [-3,-1.5,0,1.5,3].forEach(x=>box(mat.ijzer,x,2.15,0,0.12,3.9,0.16,0,gevelKas));
  box(mat.ijzer,0,4.15,0,6.3,0.14,0.16,0,gevelKas);
  box(mat.ijzer,-3.1,2.15,0,0.14,3.9,0.16,0,gevelKas);
  box(mat.ijzer,3.1,2.15,0,0.14,3.9,0.16,0,gevelKas);
  [1.25,2.25,3.2].forEach(y=>box(mat.ijzer,0,y,0,6.2,0.08,0.08,0,gevelKas));
  const glasL=new THREE.Mesh(new THREE.PlaneGeometry(2.25,3.5),mat.glas);
  glasL.position.set(-1.95,2.2,0.08);gevelKas.add(glasL);
  const glasR=glasL.clone();glasR.position.x=1.95;gevelKas.add(glasR);
  const dak=new THREE.Mesh(new THREE.ConeGeometry(3.55,1.35,4),mat.glas);
  dak.position.set(0,4.85,0);dak.rotation.y=Math.PI/4;gevelKas.add(dak);
  const deurKas=new THREE.Group();
  deurKas.position.set(0.55,0,0.1);
  gevelKas.add(deurKas);
  const kasLijst=new THREE.Mesh(new THREE.BoxGeometry(1.2,2.5,0.05),new THREE.MeshLambertMaterial({color:0xc9a227}));
  kasLijst.position.set(-0.55,1.5,0.1);deurKas.add(kasLijst);
  const kasPlaat=new THREE.Mesh(new THREE.BoxGeometry(1.1,2.4,0.07),new THREE.MeshLambertMaterial({color:0x3a4f30}));
  kasPlaat.position.set(-0.55,1.5,0.14);deurKas.add(kasPlaat);
  const kasRuit=new THREE.Mesh(new THREE.PlaneGeometry(0.38,0.7),mat.glas);
  [[-0.77,2.05],[-0.33,2.05],[-0.77,1.25],[-0.33,1.25]].forEach(([x,y])=>{
    const r=kasRuit.clone();r.position.set(x,y,0.19);deurKas.add(r);
  });
  const klinkK=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),new THREE.MeshLambertMaterial({color:0xc9a227}));
  klinkK.position.set(-0.18,1.35,0.22);deurKas.add(klinkK);
  maakBord(mat.bordKas,gevelKas,0,3.18,0.38,3.35,0.86);
  (function(){
    const r=new THREE.Mesh(new THREE.PlaneGeometry(2.2,2.0),mat.rank);
    r.position.set(-2.2,2.8,0.4);gevelKas.add(r);
    const r2=r.clone();r2.position.set(2.2,2.6,0.4);gevelKas.add(r2);
    const k=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.6),mat.klimop);
    k.position.set(-2.6,1.5,0.38);gevelKas.add(k);
  })();
  solid(0,30.8,6.5,1.0,5);
  deuren.kas={groep:deurKas, punt:new THREE.Vector3(0,0,28.6), naam:'De Kassen', open:'kas', scharnier:+1};

  /* 2. Hagrids moestuin, west */
  const gevelH=new THREE.Group();
  gevelH.position.set(-17.4,0,14);
  gevelH.rotation.y=Math.PI/2; // local +Z naar het pad (wereld +X, de speler komt van rechts)
  // Speler loopt naar -X voor Hagrid; de gevel draait met +π/2 zodat lokaal +Z naar de binnenplaats wijst.
  // Front of the gate should face +X (toward the courtyard).
  // Group at (-17.4, 14), rotation.y = -PI/2 would make local +Z become world -X? 
  // rotation.y = Y: local +Z rotates. rotation.y = -PI/2: +Z -> +X? 
  // Three.js Y rotation: positive Y looks left (CCW). 
  // Default local +Z. After rotation.y = π/2, local +Z points to world -X? 
  // Rx wasn't... Standard: rot Y +90°: +Z goes to +X? 
  // Actually: Ry(θ) * (0,0,1) = (sin θ, 0, cos θ). θ=π/2 → (1,0,0) world +X.
  // Player comes from +X (courtyard at x=0), looking -X. They see the face that points toward +X, i.e. local +Z after π/2. Good.
  world.add(gevelH);
  // aardebed
  const bed=new THREE.Mesh(new THREE.BoxGeometry(8.5,0.08,5.2),mat.aarde);
  bed.position.set(0,0.04,-2.2);gevelH.add(bed);
  // houten hek vleugels
  for(let s=-1;s<=1;s+=2){
    for(let i=0;i<5;i++){
      const paal=new THREE.Mesh(new THREE.BoxGeometry(0.1,1.15,0.1),mat.hout);
      paal.position.set(s*(1.2+i*0.55),0.58,0);gevelH.add(paal);
    }
    const lat=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.08,0.06),mat.hout);
    lat.position.set(s*2.2,0.4,0);gevelH.add(lat);
    const lat2=lat.clone();lat2.position.y=0.85;gevelH.add(lat2);
  }
  const deurH=new THREE.Group();
  deurH.position.set(0.7,0,0.05);
  gevelH.add(deurH);
  // hekpoortje
  for(let i=0;i<5;i++){
    const s=new THREE.Mesh(new THREE.BoxGeometry(0.07,1.2,0.06),mat.hout);
    s.position.set(-0.7+i*0.28,0.62,0);deurH.add(s);
  }
  const hlat=new THREE.Mesh(new THREE.BoxGeometry(1.35,0.08,0.07),mat.hout);
  hlat.position.set(-0.14,0.45,0);deurH.add(hlat);
  const hlat2=hlat.clone();hlat2.position.y=0.9;deurH.add(hlat2);
  maakBord(mat.bordHagrid,gevelH,0,2.05,0.24,2.45,0.7);
  // pompoenen
  function pompoen(x,z,s){
    const p=new THREE.Mesh(new THREE.SphereGeometry(0.28*s,8,6),mat.pompoen);
    p.scale.set(1.15,0.85,1.1);p.position.set(x,0.22*s,z);gevelH.add(p);
    const st=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.04,0.16*s,5),mat.steel);
    st.position.set(x,0.42*s,z);gevelH.add(st);
  }
  [[-1.6,-1.4,1.1],[0.4,-2.0,1.3],[-0.8,-2.6,0.85],[1.8,-1.8,1.15],[-2.3,-3.1,0.95],[1.2,-3.4,1.05],[-0.2,-1.2,0.75]].forEach(([x,z,s])=>pompoen(x,z,s));
  // hutje in de verte (lokaal -Z, verder de moestuin in)
  const hut=new THREE.Group();hut.position.set(-1.2,0,-6.4);gevelH.add(hut);
  box(mat.hout,0,1.05,0,3.2,2.1,2.4,0,hut);
  const dakH=new THREE.Mesh(new THREE.ConeGeometry(2.5,1.3,4),new THREE.MeshLambertMaterial({color:0x4a2a12}));
  dakH.position.set(0,2.55,0);dakH.rotation.y=Math.PI/4;hut.add(dakH);
  box(mat.baksteen,1.2,2.5,-0.4,0.4,0.9,0.4,0,hut);
  const raam=new THREE.Mesh(new THREE.PlaneGeometry(0.55,0.55),mat.glow);
  raam.position.set(0,1.2,1.22);hut.add(raam);
  box(mat.hout,0,0.7,1.22,0.7,1.3,0.08,0,hut);
  solid(-17.4,14,2.2,6.5,2.2);
  solid(-22.5,14,4,4,3.2);
  deuren.moestuin={groep:deurH, punt:new THREE.Vector3(-15.4,0,14), naam:'Hagrids moestuin', open:'moestuin', scharnier:-1};

  /* 3. Grote Hal, oost */
  const gevelHal=new THREE.Group();
  gevelHal.position.set(17.4,0,14);
  gevelHal.rotation.y=-Math.PI/2; // local +Z -> world -X, naar de binnenplaats
  world.add(gevelHal);
  // stenen gevel
  box(mat.zandsteen,0,2.1,0,7.2,4.2,0.8,0,gevelHal);
  box(mat.baksteen,0,0.22,0.2,7.4,0.44,1.0,0,gevelHal);
  // boog
  const halBoog=new THREE.Mesh(new THREE.TorusGeometry(1.35,0.16,6,14,Math.PI),mat.zandsteen);
  halBoog.position.set(0,2.5,0.45);gevelHal.add(halBoog);
  box(mat.zandsteen,-1.35,1.3,0.45,0.32,2.6,0.4,0,gevelHal);
  box(mat.zandsteen,1.35,1.3,0.45,0.32,2.6,0.4,0,gevelHal);
  // donkere opening
  const nis=new THREE.Mesh(new THREE.BoxGeometry(2.2,2.6,0.4),new THREE.MeshLambertMaterial({color:0x1a1208}));
  nis.position.set(0,1.4,0.15);gevelHal.add(nis);
  const deurHal=new THREE.Group();
  deurHal.position.set(1.05,0,0.42);
  gevelHal.add(deurHal);
  const houtDeur=new THREE.Mesh(new THREE.BoxGeometry(1.05,2.45,0.1),mat.hout);
  houtDeur.position.set(-0.52,1.28,0);deurHal.add(houtDeur);
  // tweede vleugel, vast
  box(mat.hout,-1.05,1.28,0.42,1.05,2.45,0.1,0,gevelHal);
  const klinkH=new THREE.Mesh(new THREE.SphereGeometry(0.07,8,6),new THREE.MeshLambertMaterial({color:0xc9a227}));
  klinkH.position.set(-0.15,1.2,0.1);deurHal.add(klinkH);
  // warme gleuf onder de deur
  const gloed=new THREE.Mesh(new THREE.PlaneGeometry(2.1,0.12),mat.glow);
  gloed.position.set(0,0.08,0.55);gevelHal.add(gloed);
  // klein venster erboven
  const ven=new THREE.Mesh(new THREE.PlaneGeometry(0.7,1.1),mat.glow);
  ven.position.set(0,3.55,0.45);gevelHal.add(ven);
  box(mat.zandsteen,0,3.55,0.5,0.9,1.3,0.12,0,gevelHal);
  maakBord(mat.bordHal,gevelHal,0,3.08,0.74,2.55,0.68);
  (function(){
    const r=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.8),mat.rank);
    r.position.set(0,3.7,0.85);gevelHal.add(r);
    const k=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.8),mat.klimop);
    k.position.set(-2.6,1.8,0.5);gevelHal.add(k);
    const k2=k.clone();k2.position.set(2.6,1.7,0.5);gevelHal.add(k2);
  })();
  solid(17.4,14,1.2,7.2,4.5);
  deuren.home={groep:deurHal, punt:new THREE.Vector3(15.4,0,14), naam:'De Grote Hal', open:'home', scharnier:+1};

  const deurGloed=[];
  function voegDeurGloed(ouder,y,z){
    const g=new THREE.Mesh(new THREE.PlaneGeometry(1.15,2.2),new THREE.MeshBasicMaterial({
      color:0xffe08a,transparent:true,opacity:0.4,depthWrite:false,side:THREE.DoubleSide
    }));
    g.position.set(0,y||1.3,z||0.2);ouder.add(g);deurGloed.push(g);
  }
  voegDeurGloed(deurKas,1.4,0.22);
  voegDeurGloed(deurH,1.3,0.22);
  voegDeurGloed(deurHal,1.3,0.22);

  /* pollen */
  const pN=12;
  const pGeo=new THREE.BufferGeometry();
  const pPos=new Float32Array(pN*3);
  const p0=[];
  for(let i=0;i<pN;i++){
    const x=(rnd(i+2)-.5)*22, y=0.4+rnd(i+5)*2.4, z=4+rnd(i+8)*24;
    pPos[i*3]=x;pPos[i*3+1]=y;pPos[i*3+2]=z;
    p0.push({x,y,z,s:0.6+rnd(i+11)*1.2,f:0.4+rnd(i+13)*0.8});
  }
  pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
  const pollen=new THREE.Points(pGeo,new THREE.PointsMaterial({
    map:T.pollen,transparent:true,depthWrite:false,size:0.22,sizeAttenuation:true,opacity:0.85,color:0xffe080
  }));
  scene.add(pollen);

  const vlinder=new THREE.Group();
  const vMat=new THREE.MeshBasicMaterial({color:0xf0d878,transparent:true,opacity:0.88,depthWrite:false,side:THREE.DoubleSide});
  const vleugelL=new THREE.Mesh(new THREE.CircleGeometry(0.12,7),vMat);
  vleugelL.position.x=-0.08;vlinder.add(vleugelL);
  const vleugelR=new THREE.Mesh(new THREE.CircleGeometry(0.12,7),vMat);
  vleugelR.position.x=0.08;vlinder.add(vleugelR);
  vlinder.userData={vL:vleugelL,vR:vleugelR};scene.add(vlinder);

  /* ===== v172: fakkels, lichtstralen, vuurvliegjes, stof, bladeren ===== */
  const fakkels=[];
  const fakkelLichten=[];
  const N_FAKKEL_LICHT=0;
  function wereldPlek(obj,out){
    out=out||new THREE.Vector3();
    obj.getWorldPosition(out);
    return out;
  }
  function maakVlam(g,x,y,z,schaal){
    schaal=schaal||1;
    const vlam=new THREE.Mesh(new THREE.PlaneGeometry(0.20*schaal,0.38*schaal),mat.vlam.clone());
    vlam.position.set(x,y,z);vlam.renderOrder=8;vlam.frustumCulled=false;
    const vlam2=vlam.clone();vlam2.visible=false;vlam2.material=mat.vlam.clone();
    const halo=new THREE.Mesh(new THREE.PlaneGeometry(0.58*schaal,0.58*schaal),mat.halo.clone());
    halo.position.set(x,y+0.02,z);halo.renderOrder=7;halo.frustumCulled=false;
    vlam.visible=false;vlam2.visible=false;halo.visible=false;
    g.add(vlam);g.add(vlam2);g.add(halo);
    return {vlam,vlam2,halo};
  }
  function maakMuurFakkel(x,y,z,rotY){
    const g=new THREE.Group();
    g.position.set(x,y,z);g.rotation.y=rotY||0;
    const plaat=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.22,0.04),mat.ijzer);
    plaat.position.set(0,0,-0.28);g.add(plaat);
    const arm=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.05,0.34),mat.ijzer);
    arm.position.set(0,-0.02,-0.12);g.add(arm);
    const haak=new THREE.Mesh(new THREE.TorusGeometry(0.07,0.015,5,8,Math.PI),mat.ijzer);
    haak.position.set(0,0.05,0.06);haak.rotation.x=Math.PI;g.add(haak);
    const bak=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.08,0.13,8,1,true),mat.ijzer);
    bak.position.set(0,0.02,0.08);g.add(bak);
    const binnen=new THREE.Mesh(new THREE.CylinderGeometry(0.095,0.07,0.1,8,1,true),
      new THREE.MeshBasicMaterial({color:0xff7a18,transparent:true,opacity:0.62,side:THREE.BackSide,toneMapped:false,depthWrite:false}));
    binnen.visible=false;binnen.position.set(0,0.04,0.08);g.add(binnen);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(0.11,0.016,5,10),mat.ijzer);
    ring.position.set(0,0.08,0.08);ring.rotation.x=Math.PI/2;g.add(ring);
    const kool=new THREE.Mesh(new THREE.CircleGeometry(0.075,8),mat.halo.clone());
    kool.visible=false;kool.rotation.x=-Math.PI/2;kool.position.set(0,0.09,0.08);kool.renderOrder=6;g.add(kool);
    const vl=maakVlam(g,0,0.36,0.08,1);
    vl.kool=kool;
    world.add(g);
    fakkels.push({groep:g,x,y:y+0.36,z,rotY:rotY||0,fase:rnd(x*11+z*7)*6.28,bak:false,...vl});
    return g;
  }
  function maakVuurbak(x,z){
    const g=new THREE.Group();g.position.set(x,0,z);
    const voet=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.16,0.08,8),mat.ijzer);
    voet.position.y=0.04;g.add(voet);
    const stam=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.05,1.02,6),mat.ijzer);
    stam.position.y=0.55;g.add(stam);
    const bak=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.12,0.16,8,1,true),mat.ijzer);
    bak.position.y=1.14;g.add(bak);
    const binnen=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.11,0.12,8,1,true),
      new THREE.MeshBasicMaterial({color:0xff7a18,transparent:true,opacity:0.62,side:THREE.BackSide,toneMapped:false,depthWrite:false}));
    binnen.visible=false;binnen.position.y=1.15;g.add(binnen);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(0.18,0.018,5,10),mat.ijzer);
    ring.position.y=1.22;ring.rotation.x=Math.PI/2;g.add(ring);
    const kool=new THREE.Mesh(new THREE.CircleGeometry(0.12,8),mat.halo.clone());
    kool.visible=false;kool.rotation.x=-Math.PI/2;kool.position.y=1.23;kool.renderOrder=6;g.add(kool);
    const vl=maakVlam(g,0,1.46,0,0.9);
    vl.kool=kool;
    world.add(g);
    solid(x,z,0.4,0.4,1.4);
    fakkels.push({groep:g,x,y:1.48,z,rotY:0,fase:rnd(x*9+z*5)*6.28,bak:true,...vl});
    return g;
  }
  // zandstenen muur bij de fontein (muur kijkt naar +X)
  maakMuurFakkel(-6.98,2.15,7.7,Math.PI/2);
  maakMuurFakkel(-6.98,2.15,11.7,Math.PI/2);
  // De Kassen (gevel kijkt naar -Z)
  maakMuurFakkel(-3.35,2.0,29.85,Math.PI);
  maakMuurFakkel(3.35,2.0,29.85,Math.PI);
  // Hagrids moestuin (gevel kijkt naar +X)
  maakMuurFakkel(-17.08,1.9,12.35,Math.PI/2);
  maakMuurFakkel(-17.08,1.9,15.65,Math.PI/2);
  // Grote Hal (gevel kijkt naar -X)
  maakMuurFakkel(17.08,2.2,12.15,-Math.PI/2);
  maakMuurFakkel(17.08,2.2,15.85,-Math.PI/2);
  // staande vuurbakken bij de ijzeren boog
  maakVuurbak(-2.55,13.15);
  maakVuurbak(2.55,13.15);
  for(let i=0;i<N_FAKKEL_LICHT;i++){
    const L=new THREE.PointLight(0xff9a40,0,8.5,2);
    scene.add(L);
    fakkelLichten.push(L);
  }
  const fakkelTmp=new THREE.Vector3();

  // goedkope lichtstralen (additieve kaarten)
  const straalKaarten=[];
  [[-3.8,2.35,9.6,1.15,2.6,0.55],[-7.4,2.3,12.8,1.05,2.4,0.2],[0.9,2.45,20.2,1.15,2.5,0.0]].forEach(([x,y,z,sx,sy,rotY],i)=>{
    const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),mat.straal.clone());
    m.position.set(x,y,z);m.scale.set(sx,sy,1);m.rotation.y=rotY;m.renderOrder=4;
    m.material.opacity=0.18;m.visible=false;
    world.add(m);straalKaarten.push(m);
  });

  // vuurvliegjes + stof + deurvonken in één points-set met typen
  const VLIEG_N=0, STOF_N=0, VONKDEUR_N=0, EMBER_N=0, BLAD_N=0;
  function pointsSet(n,maak,map,size,kleur,opt){
    opt=opt||{};
    const geo=new THREE.BufferGeometry();
    const pos=new Float32Array(n*3), col=new Float32Array(n*3);
    const data=[];
    for(let i=0;i<n;i++){
      const d=maak(i);
      data.push(d);
      pos[i*3]=d.x;pos[i*3+1]=d.y;pos[i*3+2]=d.z;
      const c=d.c||kleur;
      col[i*3]=((c>>16)&255)/255;col[i*3+1]=((c>>8)&255)/255;col[i*3+2]=(c&255)/255;
    }
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color',new THREE.BufferAttribute(col,3));
    const matP=new THREE.PointsMaterial({
      map:map,transparent:true,depthWrite:false,size:size,sizeAttenuation:true,
      vertexColors:true,blending:opt.add?THREE.AdditiveBlending:THREE.NormalBlending,
      opacity:opt.opacity||0.9,fog:false
    });
    const pts=new THREE.Points(geo,matP);
    pts.frustumCulled=false;
    scene.add(pts);
    return {geo,pos,data,pts,n,nVol:n};
  }
  const vuurvlieg=pointsSet(VLIEG_N,function(i){
    const zone=i%5;
    let x,y,z;
    if(zone===0){x=-5+rnd(i+2)*3.5;z=9.7+rnd(i+5)*2.4;y=0.7+rnd(i+8)*1.6} // fontein
    else if(zone===1){x=-8+rnd(i+3)*6;z=8+rnd(i+6)*4;y=1.1+rnd(i+9)*1.8} // hagen west
    else if(zone===2){x=2+rnd(i+4)*8;z=8+rnd(i+7)*8;y=1.0+rnd(i+10)*2.0} // pad
    else if(zone===3){x=-4+rnd(i+5)*8;z=20+rnd(i+8)*8;y=0.9+rnd(i+11)*2.2} // naar kassen
    else {x=(rnd(i+2)-.5)*20;z=6+rnd(i+9)*20;y=0.6+rnd(i+12)*2.4}
    return {x,y,z,x0:x,y0:y,z0:z,s:0.35+rnd(i+15)*0.7,f:0.6+rnd(i+17)*1.4,c:rnd(i+4)>.7?0xb8ff6a:0xffe080};
  },T.pollen,0.18,0xffe080,{add:true,opacity:0.9});
  const stof=pointsSet(STOF_N,function(i){
    const x=-6+rnd(i+3)*16,y=1.2+rnd(i+8)*3.2,z=6+rnd(i+5)*20;
    return {x,y,z,x0:x,y0:y,z0:z,s:0.12+rnd(i+11)*0.25,f:0.2+rnd(i+13)*0.35,c:0xffe6b0};
  },T.halo,0.12,0xffe6b0,{add:true,opacity:0.45});
  const deurVonken=pointsSet(VONKDEUR_N,function(i){
    const plekken=[[0,1.4,28.7],[-15.5,1.3,14],[15.5,1.3,14]];
    const p=plekken[i%3];
    const x=p[0]+(rnd(i+2)-.5)*1.6,y=p[1]+rnd(i+5)*1.4,z=p[2]+(rnd(i+8)-.5)*0.8;
    return {x,y,z,x0:x,y0:y,z0:z,s:0.8+rnd(i+11)*1.4,f:1.2+rnd(i+13)*1.8,c:rnd(i)>.5?0xf0c060:0xd8a0ff};
  },T.pollen,0.14,0xf0c060,{add:true,opacity:0.85});
  const embers=pointsSet(EMBER_N,function(i){
    const f=fakkels[i%fakkels.length];
    return {x:f.x,y:f.y,z:f.z,x0:f.x,y0:f.y,z0:f.z,faki:i%fakkels.length,
      u:rnd(i+3),s:0.4+rnd(i+7)*0.7,vx:(rnd(i+9)-.5)*0.15,vz:(rnd(i+11)-.5)*0.15,c:rnd(i)>.5?0xffc040:0xff6020};
  },T.vonk,0.08,0xff8020,{add:true,opacity:0.9});
  const bladeren=[];
  (function(){
    const geo=new THREE.PlaneGeometry(0.18,0.08);
    for(let i=0;i<BLAD_N;i++){
      const m=new THREE.Mesh(geo,mat.blad);
      const x=(rnd(i+2)-.5)*16,y=2.2+rnd(i+5)*3.5,z=6+rnd(i+8)*18;
      m.position.set(x,y,z);
      m.userData={x0:x,y0:y,z0:z,s:0.25+rnd(i+11)*0.4,spin:0.4+rnd(i+13)*1.1,fase:rnd(i+17)*6.28};
      world.add(m);bladeren.push(m);
    }
  })();
  let fakkelKnisterT=0;

  function zetSfeerLicht(){
    const n=licht||RMP?0:N_FAKKEL_LICHT;
    const hx=camera.position.x,hz=camera.position.z;
    const vol=fakkels.map((f,i)=>({i,d:(f.x-hx)*(f.x-hx)+(f.z-hz)*(f.z-hz)})).sort((a,b)=>a.d-b.d);
    for(let i=0;i<fakkelLichten.length;i++){
      const L=fakkelLichten[i];
      if(i>=n){L.intensity=0;L.distance=0.01;continue}
      const f=fakkels[vol[i].i];
      f.licht=L;
      L.position.set(f.x,f.y+0.15,f.z);
    }
    return vol;
  }
  function sfeerTic(t,dt){
    const flikk=licht?0.35:1;
    fakkels.forEach((f,i)=>{
      const k=0.75+0.25*Math.sin(t*11+f.fase)+0.12*Math.sin(t*23+f.fase*1.7);
      const s=(0.85+0.22*k)*flikk;
      f.vlam.scale.set(0.9+k*0.15,s,1);
      f.vlam.material.opacity=0.70+0.20*k;
      f.halo.material.opacity=(licht?0.18:0.36)*k;
      f.halo.scale.setScalar(0.85+0.3*k);
      f.vlam.lookAt(camera.position);
      f.halo.lookAt(camera.position);
    });
    const vol=zetSfeerLicht();
    const nLicht=licht||RMP?0:N_FAKKEL_LICHT;
    for(let i=0;i<nLicht;i++){
      const L=fakkelLichten[i];
      if(!L)continue;
      const f=fakkels[vol[i].i];
      const k=0.75+0.25*Math.sin(t*11+f.fase)+0.12*Math.sin(t*23+f.fase*1.7);
      L.intensity=1.85*k;
      L.distance=7.5;
    }
    const nVlieg=RMP?0:Math.min(vuurvlieg.nVol,licht?Math.min(12,VLIEG_N):VLIEG_N);
    const nStof=RMP?0:Math.min(stof.nVol,licht?Math.min(6,STOF_N):STOF_N);
    const nDeur=RMP?0:Math.min(deurVonken.nVol,licht?Math.min(4,VONKDEUR_N):VONKDEUR_N);
    const nEmber=RMP?0:Math.min(embers.nVol,licht?Math.min(12,EMBER_N):EMBER_N);
    vuurvlieg.pts.visible=nVlieg>0;stof.pts.visible=nStof>0;deurVonken.pts.visible=nDeur>0;embers.pts.visible=nEmber>0;
    vuurvlieg.geo.setDrawRange(0,nVlieg);stof.geo.setDrawRange(0,nStof);deurVonken.geo.setDrawRange(0,nDeur);embers.geo.setDrawRange(0,nEmber);
    function drift(set,n,fn){
      if(n<=0)return;
      const arr=set.pos;
      for(let i=0;i<n;i++)fn(set.data[i],i,arr,i*3);
      set.geo.attributes.position.needsUpdate=true;
    }
    if(!RMP){
      drift(vuurvlieg,nVlieg,function(o,i,arr,p){
        arr[p]=o.x0+Math.sin(t*o.s+i)*0.55;
        arr[p+1]=o.y0+Math.sin(t*o.f+i*0.7)*0.35+Math.sin(t*0.15+i)*0.1;
        arr[p+2]=o.z0+Math.cos(t*o.s*0.7+i)*0.55;
      });
      drift(stof,nStof,function(o,i,arr,p){
        arr[p]=o.x0+Math.sin(t*o.s+i)*0.8;
        arr[p+1]=o.y0+Math.sin(t*o.f+i)*0.25;
        arr[p+2]=o.z0+Math.cos(t*o.s*0.5+i)*0.6;
      });
      drift(deurVonken,nDeur,function(o,i,arr,p){
        const tw=0.5+0.5*Math.sin(t*o.f+i);
        arr[p]=o.x0+Math.sin(t*o.s+i)*0.2;
        arr[p+1]=o.y0+Math.sin(t*0.4+i)*0.15+tw*0.1;
        arr[p+2]=o.z0+Math.cos(t*o.s+i)*0.2;
      });
      drift(embers,nEmber,function(o,i,arr,p){
        o.u+=dt*o.s*0.45;
        if(o.u>1){o.u-=1;const f=fakkels[o.faki];o.x0=f.x+(rnd(i+t)-.5)*0.08;o.y0=f.y;o.z0=f.z+(rnd(i+3+t)-.5)*0.08}
        arr[p]=o.x0+o.vx*o.u*2;
        arr[p+1]=o.y0+o.u*0.7;
        arr[p+2]=o.z0+o.vz*o.u*2;
      });
      const nBlad=licht?0:BLAD_N;
      bladeren.forEach((m,i)=>{
        const aan=!RMP&&i<nBlad;
        m.visible=aan;
        if(!aan)return;
        const d=m.userData;
        const u=(t*d.s+d.fase)%8;
        m.position.set(d.x0+Math.sin(t*d.s+i)*0.8, d.y0-(u*0.55)%4.2, d.z0+Math.cos(t*d.s*0.6+i)*0.6);
        m.rotation.set(t*d.spin,t*d.spin*0.6,d.fase+t*0.4);
        if(m.position.y<0.15){d.y0=2.4+rnd(i+t)*3;d.x0=(rnd(i+2+t)-.5)*16;d.z0=6+rnd(i+8+t)*18}
      });
      straalKaarten.forEach(s=>{s.visible=false});
    }else{
      straalKaarten.forEach(s=>s.visible=false);
      bladeren.forEach(m=>m.visible=false);
    }
    if(hemelkoepel){hemelkoepel.position.x=camera.position.x;hemelkoepel.position.z=camera.position.z}
  }

  const vonkRingen=[];
  for(let i=0;i<2;i++){
    const r=new THREE.Mesh(new THREE.TorusGeometry(0.12,0.012,6,14),new THREE.MeshBasicMaterial({
      color:0xff9a20,transparent:true,opacity:0.5,depthWrite:false
    }));
    r.visible=false;scene.add(r);vonkRingen.push(r);
  }

  /* personage: CC0 Quaternius-figuur, als Luna gekleed (zwarte mantel, Huffelpuf-geel, kap, staf) */
  const held=new THREE.Group();
  held.position.set(0,0,6.8);
  scene.add(held);
  const heldModel=new THREE.Group();
  held.add(heldModel);
  const schaduw=new THREE.Mesh(new THREE.CircleGeometry(0.44,14),mat.schaduw);
  schaduw.rotation.x=-Math.PI/2;schaduw.position.y=0.03;held.add(schaduw);

  let mixer=null,actIdle=null,actWalk=null,actRun=null,animNaam='idle',stafPunt=null,lunaKlaar=false,gargKlaar=false,tuinKlaar=false,steenTex=null,gargRoot=null,mixBevries=false;

  function zetAnim(naam){
    if(!mixer||animNaam===naam)return;
    const act=naam==='walk'?actWalk:naam==='run'?actRun:actIdle;
    const prev=animNaam==='walk'?actWalk:animNaam==='run'?actRun:actIdle;
    if(!act)return;
    act.enabled=true;
    act.setEffectiveWeight(1);
    act.reset().play();
    if(prev&&prev!==act){
      prev.setEffectiveWeight(1);
      prev.crossFadeTo(act,0.22,false);
    }
    animNaam=naam;
  }
  function snapAnim(naam,t){
    if(!mixer)return;
    const act=naam==='walk'?actWalk:naam==='run'?actRun:actIdle;
    if(!act)return;
    [actIdle,actWalk,actRun].forEach(a=>{if(a&&a!==act){a.setEffectiveWeight(0);a.stop()}});
    act.enabled=true;act.setEffectiveWeight(1);act.reset().play();
    if(t!=null)act.time=t;
    animNaam=naam;lopen=naam==='walk'||naam==='run';
    mixer.update(0);
    knijpStaf();
    held.updateMatrixWorld(true);
  }

  function maakMantel(chest){
    const g=new THREE.Group();
    const pts=[
      new THREE.Vector2(0.42,-1.05),
      new THREE.Vector2(0.40,-0.82),
      new THREE.Vector2(0.36,-0.55),
      new THREE.Vector2(0.32,-0.28),
      new THREE.Vector2(0.28,-0.06),
      new THREE.Vector2(0.26,0.12),
      new THREE.Vector2(0.22,0.22)
    ];
    // Three.js-lathe: phi 0 = +Z (voorkant). Opening middenvoor, mantel over rug en zij.
    const startA=Math.PI*0.26,lenA=Math.PI*1.48;
    const geo=new THREE.LatheGeometry(pts,18,startA,lenA);
    const buitenMat=new THREE.MeshLambertMaterial({map:T.mantelPlooi,color:0x3a4048,side:THREE.FrontSide,emissive:0x16181c,emissiveIntensity:0.28});
    const voerMat=new THREE.MeshLambertMaterial({color:0xe0b41c,side:THREE.BackSide});
    const buiten=new THREE.Mesh(geo,buitenMat);
    const voer=new THREE.Mesh(geo,voerMat);
    voer.scale.set(0.982,1,0.982);
    g.add(buiten);g.add(voer);
    const hemPts=[new THREE.Vector2(0.43,-1.07),new THREE.Vector2(0.425,-1.04),new THREE.Vector2(0.408,-1.015)];
    const hem=new THREE.Mesh(new THREE.LatheGeometry(hemPts,18,startA,lenA),new THREE.MeshLambertMaterial({color:0xe0b41c,side:THREE.DoubleSide}));
    g.add(hem);
    // kap naar achteren, platte stofplooi (geen worst-rol)
    const kap=new THREE.Mesh(new THREE.SphereGeometry(0.22,12,8,0,Math.PI*2,0,Math.PI*0.68),buitenMat);
    kap.scale.set(1.25,0.28,1.05);
    kap.position.set(0,0.18,-0.18);
    kap.rotation.x=0.55;
    g.add(kap);
    const kapVoer=new THREE.Mesh(new THREE.SphereGeometry(0.20,10,7,0,Math.PI*2,0,Math.PI*0.65),voerMat);
    kapVoer.scale.set(1.12,0.22,0.92);
    kapVoer.position.set(0,0.17,-0.17);
    kapVoer.rotation.x=0.55;
    g.add(kapVoer);
    g.position.set(0,0.02,-0.04);
    chest.add(g);
    return g;
  }

  function maakStaf(wrist){
    const staf=new THREE.Group();
    const hout=new THREE.Mesh(new THREE.CylinderGeometry(0.011,0.016,0.42,8),mat.hout);
    hout.position.y=0.14;
    staf.add(hout);
    const greep=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.06,8),mat.hout);
    greep.position.y=0.05;staf.add(greep);
    const puntMat=new THREE.MeshLambertMaterial({color:0xffe08a,emissive:0xc9a227,emissiveIntensity:0.85});
    const punt=new THREE.Mesh(new THREE.SphereGeometry(0.015,8,6),puntMat);
    punt.position.set(0,0.36,0);
    staf.add(punt);
    stafPunt=new THREE.Object3D();
    stafPunt.position.set(0,0.36,0);
    staf.add(stafPunt);
    wrist.add(staf);held.userData.staf=staf;
    return staf;
  }
  function botNaam(o,n){
    return o.name===n||o.name===n.replace(/\./g,'');
  }
  function pasStafInPalm(wrist,root){
    const staf=held.userData.staf;if(!staf||!wrist)return;
    // iets in de palm, langs de vingers (+Y van Wrist.R)
    staf.position.set(0.008,0.042,0.016);
    staf.rotation.set(0.12,0.05,-0.18);
  }
  let greepBotten=null;
  function zoekGreep(root){
    const map={};
    root.traverse(o=>{if(o.name)map[o.name]=o});
    greepBotten=map;
  }
  function greepBot(n){
    if(!greepBotten)return null;
    return greepBotten[n]||greepBotten[n.replace(/\./g,'')];
  }
  function knijpStaf(){
    if(!greepBotten)return;
    const curl=[0.95,1.15,0.70];
    ['Index','Middle','Ring','Pinky'].forEach((f,i)=>{
      const spreid=(i-1.5)*0.07;
      const b1=greepBot(f+'1.R'),b2=greepBot(f+'2.R'),b3=greepBot(f+'3.R');
      if(b1){b1.rotation.x+=curl[0];b1.rotation.z+=spreid}
      if(b2)b2.rotation.x+=curl[1];
      if(b3)b3.rotation.x+=curl[2];
    });
    const t1=greepBot('Thumb1.R'),t2=greepBot('Thumb2.R'),t3=greepBot('Thumb3.R');
    if(t1){t1.rotation.y+=-0.9;t1.rotation.x+=0.5;t1.rotation.z+=0.3}
    if(t2)t2.rotation.x+=0.75;
    if(t3)t3.rotation.x+=0.45;
  }

  function plaatsLuna(gltf){
    const root=gltf.scene;
    root.traverse(o=>{
      if(o.isMesh){
        o.frustumCulled=false;
        if(o.geometry&&o.geometry.computeBoundingBox)o.geometry.computeBoundingBox();
        const src=o.material;
        if(src&&src.isMeshStandardMaterial){
          o.material=new THREE.MeshLambertMaterial({
            color:src.color?src.color.clone():new THREE.Color(0xffffff),
            map:src.map||null,
            emissive:src.emissive?src.emissive.clone():new THREE.Color(0x000000),
            emissiveIntensity:src.emissiveIntensity||0,
            transparent:!!src.transparent,
            opacity:src.opacity!=null?src.opacity:1,
            side:src.side||THREE.FrontSide
          });
          if(src.dispose)src.dispose();
        }
      }
    });
    root.updateMatrixWorld(true);
    const box=new THREE.Box3().setFromObject(root);
    const h=Math.max(0.2,box.max.y-box.min.y);
    const s=1.66/h;
    heldModel.scale.setScalar(s);
    root.position.y=-box.min.y;
    heldModel.add(root);
    let chest=null,wristR=null;
    root.traverse(o=>{
      if(o.name==='Chest')chest=o;
      else if(o.name==='Wrist.R'||o.name==='WristR')wristR=o;
    });
    if(chest)maakMantel(chest);
    mixer=new THREE.AnimationMixer(root);
    const clips=gltf.animations||[];
    function clip(n){return THREE.AnimationClip.findByName(clips,n)}
    const idleC=clip('Idle_Neutral')||clip('Idle');
    const walkC=clip('Walk');
    const runC=clip('Run');
    if(idleC){actIdle=mixer.clipAction(idleC);actIdle.play();animNaam='idle'}
    if(walkC){actWalk=mixer.clipAction(walkC);actWalk.enabled=false;actWalk.setEffectiveWeight(0)}
    if(runC){actRun=mixer.clipAction(runC);actRun.enabled=false;actRun.setEffectiveWeight(0)}
    if(mixer)mixer.update(0.35);
    held.updateMatrixWorld(true);
    if(wristR){zoekGreep(root);maakStaf(wristR);pasStafInPalm(wristR,root);knijpStaf();held.updateMatrixWorld(true)}
    lunaKlaar=true;
  }

  const mark=new THREE.Mesh(new THREE.RingGeometry(0.22,0.34,16),new THREE.MeshBasicMaterial({color:0xe6c25a,transparent:true,opacity:0.85,side:THREE.DoubleSide,depthWrite:false}));
  mark.rotation.x=-Math.PI/2;mark.visible=false;scene.add(mark);

  const camOff=new THREE.Vector3(0,0,-6.0);
  const kijkVooruit=0.85;
  const CAM_MIN=3.2,CAM_MIN_Y=1.5;
  const CAM_DIST=6.0;
  const CAM_LOOK_Y=1.25;
  const CAM_PITCH_MIN=20*Math.PI/180,CAM_PITCH_MAX=40*Math.PI/180;
  const CAM_YAW_SNEL=Math.PI/2;
  const CAM_PITCH_SNEL=0.55;
  let camYaw=0,camPitch=28*Math.PI/180;
  function camHoek(){return camYaw}
  function wikkelYaw(a){
    while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;
    return a;
  }
  const camPos=new THREE.Vector3(0,2.6,2.0);
  const CAM_ZOEK=new THREE.Vector3();
  const LOOK_CAM=new THREE.Vector3();
  camera.position.copy(camPos);
  let doel=null,lopen=false,loopT=0,naarBinnen=false;
  const snelheid=2.2;
  let nabij=null;
  let stokAan=false,stokKracht=0,stokDx=0,stokDz=0,camVast=false;
  let camStokAan=false,camStokKracht=0,camStokDx=0,camStokDy=0,camStokId=null;
  const loopStok=$('loopstok'), loopKnop=$('loopknop');

  function bots(x,z,r){
    r=r||0.32;
    if(x<-22||x>22||z<-0.2||z>31.2)return true;
    for(let i=0;i<col.length;i++){
      const c=col[i];
      if(x>c.minx-r&&x<c.maxx+r&&z>c.minz-r&&z<c.maxz+r)return true;
    }
    return false;
  }
  function schuif(x,z,dx,dz){
    let nx=x+dx,nz=z+dz;
    if(!bots(nx,nz))return [nx,nz];
    if(!bots(x+dx,z))return [x+dx,z];
    if(!bots(x,z+dz))return [x,z+dz];
    return [x,z];
  }
  function grondHoogte(x,z){
    const bx=x, bz=z-9.7;
    if(Math.abs(bx)<1.65 && Math.abs(bz)<1.9){
      const az=Math.abs(bz);
      if(az<=1.05) return 0.48;
      if(az<=1.40) return 0.36;
      if(az<=1.70) return 0.22;
      return 0.10+(1.9-az)*0.3;
    }
    return 0;
  }
  function zetHoogte(dt){
    const gy=grondHoogte(held.position.x,held.position.z);
    const k=dt==null?1:Math.min(1,10*dt);
    held.position.y+=(gy-held.position.y)*k;
  }
  function botsCam(x,y,z){
    if(y<0.35)return true;
    const r=0.9;
    for(let i=0;i<col.length;i++){
      const c=col[i];
      if(x>c.minx-r&&x<c.maxx+r&&z>c.minz-r&&z<c.maxz+r&&y<(c.h||3.4)+0.9)return true;
    }
    return false;
  }

  const ray=new THREE.Raycaster();
  const muis=new THREE.Vector2();
  loopVlakken.push(brugVlak);
  const grondHits=loopVlakken;
  let doelDeur=null,stokTot=0,blokkeerNav=false;
  function deurVanHit(obj){
    let o=obj;
    while(o){
      if(o===gevelKas)return deuren.kas;
      if(o===gevelH)return deuren.moestuin;
      if(o===gevelHal)return deuren.home;
      o=o.parent;
    }
    return null;
  }
  function inElZone(el,x,y,p){
    if(!el)return false;
    const r=el.getBoundingClientRect(),m=p==null?48:p;
    return x>=r.left-m&&x<=r.right+m&&y>=r.top-m&&y<=r.bottom+m;
  }
  function inStokZone(x,y){
    return inElZone(loopStok,x,y,48)||inElZone($('camstok'),x,y,48)||inElZone($('camreset'),x,y,24);
  }
  function tikDeur(ev){
    const r=canvas.getBoundingClientRect();
    const cx=ev.clientX??(ev.touches&&ev.touches[0]&&ev.touches[0].clientX);
    const cy=ev.clientY??(ev.touches&&ev.touches[0]&&ev.touches[0].clientY);
    if(cx==null||cy==null)return;
    if(inStokZone(cx,cy)||performance.now()<stokTot)return;
    muis.x=((cx-r.left)/r.width)*2-1;
    muis.y=-((cy-r.top)/r.height)*2+1;
    ray.setFromCamera(muis,camera);
    const hits=ray.intersectObjects([gevelKas,gevelH,gevelHal],true);
    if(!hits.length||hits[0].distance>28)return;
    const deur=deurVanHit(hits[0].object);
    if(!deur)return;
    camVast=false;
    if(held.position.distanceTo(deur.punt)<3.4){naarDeur(deur.open);return}
    doelDeur=deur;
    doel=deur.punt.clone();
    mark.position.set(doel.x,0.08,doel.z);mark.visible=true;
    lopen=true;
    if(hintEl)hintEl.style.opacity='0.35';
  }
  function pointerOpUi(ev){
    return ev.target&&ev.target.closest&&ev.target.closest('a,button,#nowebgl,#overgang,#loopstok,#camstok,#laden,#deurkaart,#camreset,#tuindebug');
  }
  const wijzers=new Map();
  let laatTouch=0;
  function merkWijzer(ev,rol){
    if(!ev)return;
    if(ev.pointerType&&ev.pointerType!=='mouse')laatTouch=performance.now();
    if(ev.type==='pointerup'||ev.type==='pointercancel'||ev.type==='lostpointercapture'){
      wijzers.delete(ev.pointerId);return;
    }
    wijzers.set(ev.pointerId,{
      id:ev.pointerId,typ:ev.pointerType||'?',
      rol:rol||(ev.pointerId===stokId?'stok':(ev.pointerId===kijkId?(kijkSleep?'kijk-sleep':'kijk'):'los')),
      x:Math.round(ev.clientX||0),y:Math.round(ev.clientY||0)
    });
  }
  function negeerMuis(ev){
    if(!ev||ev.pointerType!=='mouse')return false;
    if(performance.now()<laatTouch+800)return true;
    if(stokAan&&stokId!=null&&ev.pointerId!==stokId)return true;
    if(camStokAan&&camStokId!=null&&ev.pointerId!==camStokId)return true;
    if(kijkAan&&kijkId!=null&&ev.pointerId!==kijkId)return true;
    return false;
  }
  function startKijk(ev){
    if(naarBinnen)return;
    if(negeerMuis(ev))return;
    if(pointerOpUi(ev))return;
    if(stokAan&&ev.pointerId===stokId)return;
    if(camStokAan&&ev.pointerId===camStokId)return;
    if(ev.pointerId===stokId||ev.pointerId===camStokId)return;
    if(inStokZone(ev.clientX,ev.clientY))return;
    if(ev.target&&ev.target.closest&&ev.target.closest('#loopstok,#camstok,#camreset'))return;
    eersteTikGeluid();
    ev.preventDefault&&ev.preventDefault();
    kijkAan=true;kijkId=ev.pointerId;kijkSleep=false;
    kijkX=ev.clientX;kijkY=ev.clientY;kijkStartX=ev.clientX;kijkStartY=ev.clientY;
    merkWijzer(ev,'kijk');
    try{canvas.setPointerCapture(ev.pointerId)}catch(e){}
  }
  function beweegKijk(ev){
    if(negeerMuis(ev)&&ev.pointerId!==kijkId)return;
    if(!kijkAan||(kijkId!=null&&ev.pointerId!==kijkId))return;
    ev.preventDefault&&ev.preventDefault();
    merkWijzer(ev,kijkSleep?'kijk-sleep':'kijk');
    const dx=Math.max(-80,Math.min(80,ev.clientX-kijkX));
    const dy=Math.max(-80,Math.min(80,ev.clientY-kijkY));
    kijkX=ev.clientX;kijkY=ev.clientY;
    if(!kijkSleep && Math.hypot(ev.clientX-kijkStartX,ev.clientY-kijkStartY)>14){
      kijkSleep=true;doel=null;mark.visible=false;
    }
    // slepen op het scherm draait de camera niet meer; alleen de camerajoystick doet dat
  }
  function losKijk(ev){
    if(!kijkAan||(kijkId!=null&&ev.pointerId!==kijkId))return;
    ev.preventDefault&&ev.preventDefault();
    const wasSleep=kijkSleep;
    kijkAan=false;kijkId=null;kijkSleep=false;
    if(!wasSleep)tikDeur(ev);
  }
  canvas.addEventListener('pointerdown',startKijk,{passive:false});
  canvas.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation()},{capture:true});
  window.addEventListener('pointermove',function(ev){
    if(negeerMuis(ev)&&ev.pointerId!==stokId&&ev.pointerId!==camStokId&&ev.pointerId!==kijkId)return;
    if(camStokAan&&(camStokId==null||ev.pointerId===camStokId)){ev.preventDefault();merkWijzer(ev,'camstok');zetCamStok(ev.clientX,ev.clientY);return}
    if(stokAan&&(stokId==null||ev.pointerId===stokId)){ev.preventDefault();merkWijzer(ev,'stok');zetStok(ev.clientX,ev.clientY);return}
    if(ev.pointerId===stokId||ev.pointerId===camStokId)return;
    beweegKijk(ev);
  },{passive:false});
  function pointerLos(ev){
    merkWijzer(ev);
    if(camStokAan&&(camStokId==null||ev.pointerId===camStokId)){
      ev.preventDefault();stokTot=performance.now()+500;stopCamStok();
      return;
    }
    if(stokAan&&(stokId==null||ev.pointerId===stokId)){
      ev.preventDefault();stokTot=performance.now()+500;stokId=null;stopStok();
      if(!doel)lopen=false;
      return;
    }
    if(ev.pointerId===stokId||ev.pointerId===camStokId)return;
    losKijk(ev);
  }
  window.addEventListener('pointerup',pointerLos,{passive:false});
  window.addEventListener('pointercancel',pointerLos,{passive:false});
  window.addEventListener('lostpointercapture',pointerLos,{passive:false});
  function forceerLos(){
    if(stokAan){stokId=null;stopStok();if(!doel)lopen=false}
    if(camStokAan)stopCamStok();
    if(kijkAan){kijkAan=false;kijkId=null;kijkSleep=false}
  }
  window.addEventListener('blur',forceerLos);
  document.addEventListener('visibilitychange',function(){if(document.hidden)forceerLos()});

  function zetStok(cx,cy){
    if(!loopStok||!loopKnop)return;
    const r=loopStok.getBoundingClientRect();
    const mx=r.left+r.width/2,my=r.top+r.height/2;
    let dx=cx-mx,dy=cy-my;
    const max=r.width*0.42,len=Math.hypot(dx,dy)||1,k=Math.min(1,len/max);
    dx=dx/len*k*max;dy=dy/len*k*max;
    loopKnop.style.transform='translate('+dx+'px,'+dy+'px)';
    stokDx=dx/max;stokDz=-(dy/max);stokKracht=k;
    // midden van de knop (dode zone) = vooruit lopen, zonder zijwaartse drift
    if(k<0.20){stokDx=0;stokDz=1;stokKracht=0.92;return}
    // bijna recht omhoog/omlaag (±12°) klemt op recht vooruit of achteruit
    const ang=Math.atan2(stokDx,stokDz),snap=Math.PI*12/180;
    if(Math.abs(ang)<snap){stokDx=0;stokDz=k}
    else if(Math.abs(Math.abs(ang)-Math.PI)<snap){stokDx=0;stokDz=-k}
  }
  function stopStok(){
    stokAan=false;stokKracht=0;stokDx=0;stokDz=0;
    if(loopKnop)loopKnop.style.transform='';
    if(loopStok)loopStok.classList.remove('aan');
  }
  let stokId=null,kijkAan=false,kijkId=null,kijkSleep=false,kijkX=0,kijkY=0,kijkStartX=0,kijkStartY=0;
  if(loopStok){
    loopStok.addEventListener('pointerdown',function(ev){
      if(naarBinnen)return;
      eersteTikGeluid();
      ev.preventDefault();ev.stopPropagation();
      try{loopStok.setPointerCapture(ev.pointerId)}catch(e){}
      stokAan=true;stokId=ev.pointerId;loopStok.classList.add('aan');
      merkWijzer(ev,'stok');
      doel=null;doelDeur=null;mark.visible=false;camVast=false;
      if(kijkAan&&kijkId===ev.pointerId){kijkAan=false;kijkId=null}
      stokTot=performance.now()+800;
      if(hintEl)hintEl.style.opacity='0.35';
      zetStok(ev.clientX,ev.clientY);
    },{passive:false});
  }

  const camStokEl=$('camstok'),camKnopEl=$('camknop');
  function zetCamStok(cx,cy){
    if(!camStokEl||!camKnopEl)return;
    const r=camStokEl.getBoundingClientRect();
    const mx=r.left+r.width/2,my=r.top+r.height/2;
    let dx=cx-mx,dy=cy-my;
    const max=r.width*0.42,len=Math.hypot(dx,dy)||1,k=Math.min(1,len/max);
    dx=dx/len*k*max;dy=dy/len*k*max;
    camKnopEl.style.transform='translate('+dx+'px,'+dy+'px)';
    camStokDx=dx/max;camStokDy=dy/max;camStokKracht=k;
  }
  function stopCamStok(){
    camStokAan=false;camStokKracht=0;camStokDx=0;camStokDy=0;camStokId=null;
    if(camKnopEl)camKnopEl.style.transform='';
    if(camStokEl)camStokEl.classList.remove('aan');
  }
  if(camStokEl){
    camStokEl.addEventListener('pointerdown',function(ev){
      if(naarBinnen)return;
      ev.preventDefault();ev.stopPropagation();
      try{camStokEl.setPointerCapture(ev.pointerId)}catch(e){}
      camStokAan=true;camStokId=ev.pointerId;camStokEl.classList.add('aan');
      merkWijzer(ev,'camstok');
      camVast=false;
      if(kijkAan&&kijkId===ev.pointerId){kijkAan=false;kijkId=null}
      stokTot=performance.now()+800;
      zetCamStok(ev.clientX,ev.clientY);
    },{passive:false});
  }

  const camResetBtn=$('camreset');
  if(camResetBtn){
    camResetBtn.addEventListener('pointerdown',function(ev){
      ev.preventDefault();ev.stopPropagation();
    },{passive:false});
    camResetBtn.addEventListener('click',function(ev){
      ev.preventDefault();ev.stopPropagation();
      zetCameraAchter();
    });
  }
  function tekenDebug(){
    if(!debugAan||!debugEl)return;
    const ptrs=[...wijzers.values()].map(w=>w.id+':'+(w.typ||'?')+':'+w.rol+' @'+w.x+','+w.y).join(' | ')||'(geen)';
    debugEl.textContent='v177  camYaw '+camYaw.toFixed(3)+'  heading '+held.rotation.y.toFixed(3)+'  pitch '+camPitch.toFixed(3)+'\n'+
      'stok '+(stokAan?'AAN':'uit')+'  dx '+stokDx.toFixed(2)+'  dz '+stokDz.toFixed(2)+'  k '+stokKracht.toFixed(2)+'  id '+(stokId==null?'-':stokId)+'\n'+
      'camstok '+(camStokAan?'AAN':'uit')+'  dx '+camStokDx.toFixed(2)+'  dy '+camStokDy.toFixed(2)+'  k '+camStokKracht.toFixed(2)+'  id '+(camStokId==null?'-':camStokId)+'\n'+
      'kijk '+(kijkAan?'AAN':'uit')+(kijkSleep?' SLEEP':'')+'  id '+(kijkId==null?'-':kijkId)+'\n'+
      'pointers '+ptrs;
  }

  function dichtstDeur(){
    let beste=null,bd=9;
    Object.keys(deuren).forEach(k=>{
      const d=held.position.distanceTo(deuren[k].punt);
      if(d<bd){bd=d;beste=deuren[k]}
    });
    return (beste&&bd<3.5)?beste:null;
  }
  function zetDeurKaart(){
    const w=dichtstDeur();
    nabij=w;
    if(!w){deurKaart.hidden=true;if(hintEl)hintEl.hidden=false;return}
    deurKaart.hidden=false;
    if(hintEl)hintEl.hidden=true;
    deurBtn.textContent=w.naam+' – tik om naar binnen te gaan';
  }

  function naarDeur(id,opt){
    const d=deuren[id];if(!d||naarBinnen)return;
    naarBinnen=true;
    lopen=false;mark.visible=false;stopStok();
    if(overgang){
      overgang.className=id==='moestuin'?'moestuin':id==='home'?'home':'kas';
      overgang.hidden=false;
      requestAnimationFrame(()=>requestAnimationFrame(()=>overgang.classList.add('aan')));
    }
    const t0=performance.now(), dur=RMP?280:700;
    const start=d.groep.rotation.y, doelR=start+(d.scharnier||1)*1.15;
    (function anim(nu){
      const k=Math.min(1,(nu-t0)/dur);
      const e=1-Math.pow(1-k,2);
      d.groep.rotation.y=start+(doelR-start)*e;
      if(k<1)requestAnimationFrame(anim);
      else if(!(opt&&opt.geenNav)&&!blokkeerNav){
        setTimeout(()=>{location.href='index.html?open='+encodeURIComponent(d.open)},RMP?80:280);
      }else{
        naarBinnen=false;
      }
    })(t0);
  }
  if(deurBtn)deurBtn.onclick=()=>{const w=dichtstDeur();if(w)naarDeur(w.open)};


  function ondergrond(x,z){
    if(Math.abs(x)<1.65 && Math.abs(z-9.7)<1.4)return 'brug';
    if(Math.abs(x)<1.25 && ((z>1&&z<32)||(Math.abs(z-14)<1.8&&Math.abs(x)<16)))return 'steen';
    if(Math.abs(x)<2.15 && ((z>1&&z<32)||(Math.abs(z-14)<2.2&&Math.abs(x)<16)))return 'grind';
    return 'gras';
  }

  let audioCtx=null,masterGain=null,geluidAan=false,audioKlaar=false,audioBezig=false,stapKen=1,birdT=0,laagFps=0,t0fps=0;
  const panners={};
  const pakBuf={};
  const geluidBronnen={fontein:'proceduraal',beek:'proceduraal',wind:'proceduraal',vogel:'proceduraal',bed:null,pakket:false};

  function ruisBuffer(ctx,sec,kleur){
    const n=Math.floor(ctx.sampleRate*sec);
    const b=ctx.createBuffer(1,n,ctx.sampleRate);
    const d=b.getChannelData(0);
    let last=0;
    for(let i=0;i<n;i++){
      const w=Math.random()*2-1;
      if(kleur==='pink'){last=last*0.93+w*0.07;d[i]=Math.max(-1,Math.min(1,last*3.2))}
      else if(kleur==='brown'){last=last*0.97+w*0.03;d[i]=Math.max(-1,Math.min(1,last*4))}
      else d[i]=w;
    }
    return b;
  }
  function pakketDB(){
    return new Promise((ok,nee)=>{
      const r=indexedDB.open('zw_geluid',1);
      r.onupgradeneeded=()=>r.result.createObjectStore('g');
      r.onsuccess=()=>ok(r.result);
      r.onerror=()=>nee(r.error);
    });
  }
  function pakketAlle(d){
    return new Promise(ok=>{
      const o={},c=d.transaction('g').objectStore('g').openCursor();
      c.onsuccess=()=>{const x=c.result;if(x){o[x.key]=x.value;x.continue()}else ok(o)};
      c.onerror=()=>ok({});
    });
  }
  async function laadPakketBuffers(){
    const out={};
    try{
      if(!window.indexedDB)return out;
      const d=await pakketDB();
      const g=await pakketAlle(d);
      const idx=g['index.json']?JSON.parse(new TextDecoder().decode(g['index.json'])):null;
      if(!idx||!idx.geluiden)return out;
      geluidBronnen.pakket=true;
      const keys=['amb-fontein','amb-beek','amb-wind','amb-vogel','amb-kas','amb-buiten'];
      for(let i=0;i<keys.length;i++){
        const k=keys[i],inf=idx.geluiden[k];
        if(!inf)continue;
        const f=g[k+'.'+(inf.bestand_ext||'m4a')];
        if(!f)continue;
        try{out[k]=await audioCtx.decodeAudioData(f.buffer.slice(0))}catch(e){}
      }
    }catch(e){}
    return out;
  }
  function maakPanner(x,y,z,ref,max){
    const p=audioCtx.createPanner();
    p.panningModel='equalpower';
    p.distanceModel='inverse';
    p.refDistance=ref||3;
    p.maxDistance=max||28;
    p.rolloffFactor=1.05;
    if(p.positionX){p.positionX.value=x;p.positionY.value=y;p.positionZ.value=z}
    else if(p.setPosition)p.setPosition(x,y,z);
    p.connect(masterGain);
    return p;
  }
  function startBron(buffer,panner,vol,lus){
    const src=audioCtx.createBufferSource();
    src.buffer=buffer;src.loop=lus!==false;
    const g=audioCtx.createGain();g.gain.value=vol;
    src.connect(g);g.connect(panner);
    src.start();
    return src;
  }
  function startRuis(buffer,panner,type,freq,q,vol){
    const f=audioCtx.createBiquadFilter();
    f.type=type;f.frequency.value=freq;f.Q.value=q;
    const src=audioCtx.createBufferSource();
    src.buffer=buffer;src.loop=true;
    const g=audioCtx.createGain();g.gain.value=vol;
    src.connect(f);f.connect(g);g.connect(panner);
    src.start();
    return src;
  }
  function initGeluid(){
    if(audioKlaar||audioBezig)return;
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx)return;
    audioBezig=true;
    audioCtx=new Ctx();
    try{audioCtx.resume()}catch(e){}
    masterGain=audioCtx.createGain();
    masterGain.gain.value=0;
    masterGain.connect(audioCtx.destination);
    laadPakketBuffers().then(pak=>{
      Object.assign(pakBuf,pak);
      const pink=ruisBuffer(audioCtx,2,'pink');
      const brown=ruisBuffer(audioCtx,2,'brown');
      panners.stapBuf=ruisBuffer(audioCtx,0.12,'white');
      const pf=maakPanner(fx,0.7,fz,2.2,22);
      const pb=maakPanner(0,0.25,9.7,2.4,20);
      const pw=maakPanner(0,4,14,14,80);
      panners.fontein=pf;panners.beek=pb;panners.wind=pw;
      panners.vogels=[[-2.8,3.2,6],[2.8,3.3,20],[-8,3.1,14],[8,3.2,14]].map(p=>maakPanner(p[0],p[1],p[2],4,24));
      panners.stap=maakPanner(held.position.x,0.05,held.position.z,1.2,8);
      panners.fakkel=maakPanner(-5,2.2,9.7,1.4,14);
      const heeftPos=!!(pak['amb-fontein']||pak['amb-beek']||pak['amb-wind']);
      if(pak['amb-fontein']){startBron(pak['amb-fontein'],pf,0.55,true);geluidBronnen.fontein='amb-fontein'}
      else {startRuis(pink,pf,'bandpass',1500,0.75,0.24);geluidBronnen.fontein='proceduraal'}
      if(pak['amb-beek']){startBron(pak['amb-beek'],pb,0.42,true);geluidBronnen.beek='amb-beek'}
      else {startRuis(brown,pb,'bandpass',680,0.6,0.18);geluidBronnen.beek='proceduraal'}
      if(pak['amb-wind']){startBron(pak['amb-wind'],pw,0.28,true);geluidBronnen.wind='amb-wind'}
      else {startRuis(pink,pw,'lowpass',380,0.7,0.08);geluidBronnen.wind='proceduraal'}
      if(pak['amb-vogel']){geluidBronnen.vogel='amb-vogel'}
      else {geluidBronnen.vogel='proceduraal'}
      // Ouder pakket zonder tuin-clips: zachte, wijde bed-sfeer, geen dubbele fontein.
      if(!heeftPos && (pak['amb-kas']||pak['amb-buiten'])){
        const bed=pak['amb-kas']||pak['amb-buiten'];
        const pBed=maakPanner(0,2.5,14,16,80);
        startBron(bed,pBed,0.22,true);
        geluidBronnen.bed=pak['amb-kas']?'amb-kas':'amb-buiten';
      }
      audioKlaar=true;
      if(geluidAan&&masterGain){
        const t0=audioCtx.currentTime;
        masterGain.gain.cancelScheduledValues(t0);
        masterGain.gain.linearRampToValueAtTime(0.16,t0+0.25);
      }
    }).catch(()=>{audioBezig=false});
  }
  function vogelFluit(panner){
    if(!audioCtx||!geluidAan||!panner)return;
    const t0=audioCtx.currentTime;
    const g=audioCtx.createGain();
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.linearRampToValueAtTime(0.045,t0+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,t0+0.35);
    g.connect(panner);
    if(pakBuf['amb-vogel']){
      const src=audioCtx.createBufferSource();
      src.buffer=pakBuf['amb-vogel'];
      src.playbackRate.value=0.92+Math.random()*0.2;
      src.connect(g);
      src.start(t0);
      return;
    }
    const o=audioCtx.createOscillator();
    const f=audioCtx.createBiquadFilter();
    const f0=1700+Math.random()*1500;
    o.type='sine';
    o.frequency.setValueAtTime(f0,t0);
    o.frequency.exponentialRampToValueAtTime(Math.max(400,f0*(0.65+Math.random()*0.7)),t0+0.14);
    f.type='bandpass';f.frequency.value=f0;f.Q.value=5;
    o.connect(f);f.connect(g);
    o.start(t0);o.stop(t0+0.22);
  }
  function fakkelGesis(){
    if(!audioCtx||!geluidAan||!panners.fakkel||!panners.stapBuf)return;
    const t0=audioCtx.currentTime;
    const src=audioCtx.createBufferSource();
    src.buffer=panners.stapBuf;
    const f=audioCtx.createBiquadFilter();
    f.type='bandpass';
    f.frequency.value=700+Math.random()*1200;
    f.Q.value=1.1+Math.random()*0.8;
    const g=audioCtx.createGain();
    const piek=0.028+Math.random()*0.025;
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.linearRampToValueAtTime(piek,t0+0.008);
    g.gain.exponentialRampToValueAtTime(0.0001,t0+0.06+Math.random()*0.12);
    src.connect(f);f.connect(g);g.connect(panners.fakkel);
    src.start(t0);
    try{src.stop(t0+0.2)}catch(e){}
  }
  function stapGeluid(soort){
    if(!audioCtx||!geluidAan||!panners.stap||!panners.stapBuf)return;
    const src=audioCtx.createBufferSource();
    src.buffer=panners.stapBuf;
    const f=audioCtx.createBiquadFilter();
    f.type='bandpass';
    f.frequency.value=soort==='grind'?950:soort==='gras'?480:720;
    f.Q.value=soort==='grind'?1.5:0.85;
    const g=audioCtx.createGain();
    g.gain.value=soort==='grind'?0.07:soort==='gras'?0.03:0.05;
    src.connect(f);f.connect(g);g.connect(panners.stap);
    src.start();
    try{src.stop(audioCtx.currentTime+0.08)}catch(e){}
  }
  function zetLuisteraar(){
    if(!audioCtx||!audioCtx.listener)return;
    const l=audioCtx.listener,p=camera.position;
    const f=TMP.set(0,0,-1).applyQuaternion(camera.quaternion);
    const u=LOOK.set(0,1,0).applyQuaternion(camera.quaternion);
    if(l.positionX){
      l.positionX.value=p.x;l.positionY.value=p.y;l.positionZ.value=p.z;
      l.forwardX.value=f.x;l.forwardY.value=f.y;l.forwardZ.value=f.z;
      l.upX.value=u.x;l.upY.value=u.y;l.upZ.value=u.z;
    }else if(l.setPosition){
      l.setPosition(p.x,p.y,p.z);
      l.setOrientation(f.x,f.y,f.z,u.x,u.y,u.z);
    }
  }
  function zetGeluidAan(aan){
    geluidAan=!!aan;
    if(aan)initGeluid();
    if(masterGain&&audioCtx&&audioKlaar){
      const t0=audioCtx.currentTime;
      masterGain.gain.cancelScheduledValues(t0);
      masterGain.gain.linearRampToValueAtTime(geluidAan?0.16:0,t0+0.18);
    }
    if(geluidBtn){
      geluidBtn.textContent=geluidAan?'Geluid aan':'Geluid uit';
      geluidBtn.setAttribute('aria-pressed',geluidAan?'true':'false');
    }
  }
  function eersteTikGeluid(){
    if(!audioKlaar&&!audioBezig)zetGeluidAan(true);
  }
  if(geluidBtn){
    geluidBtn.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      if(!audioKlaar&&!audioBezig)zetGeluidAan(true);
      else if(audioKlaar)zetGeluidAan(!geluidAan);
    });
  }

  let fps=0,fpsMin=99,frames=0,tFps=performance.now(),laatste=performance.now();
  const klok=new THREE.Clock();

  const CAM_RAILS=[
    {x0:0,z0:1.0,x1:0,z1:30.9,hw:1.85},
    {x0:-16.6,z0:14.0,x1:16.6,z1:14.0,hw:1.42},
    {x0:-5.4,z0:9.7,x1:-1.8,z1:9.7,hw:1.65},
    {x0:-5.0,z0:8.0,x1:-5.0,z1:11.6,hw:1.55}
  ];
  function railPunt(x,z,seg){
    const dx=seg.x1-seg.x0,dz=seg.z1-seg.z0,len2=dx*dx+dz*dz||1;
    let t=((x-seg.x0)*dx+(z-seg.z0)*dz)/len2;
    t=Math.max(0,Math.min(1,t));
    const px=seg.x0+dx*t,pz=seg.z0+dz*t;
    const d=Math.hypot(x-px,z-pz);
    if(d<=seg.hw)return {x:x,z:z,d:0,px:px,pz:pz,seg:seg};
    const s=seg.hw/d;
    return {x:px+(x-px)*s,z:pz+(z-pz)*s,d:d-seg.hw,px:px,pz:pz,seg:seg};
  }
  function inRail(x,z){
    for(let i=0;i<CAM_RAILS.length;i++){
      if(railPunt(x,z,CAM_RAILS[i]).d<=0.001)return true;
    }
    return false;
  }
  function railsBij(x,z){
    const MARGE=0.45;
    const lokaal=[];
    let beste=null;
    for(let i=0;i<CAM_RAILS.length;i++){
      const p=railPunt(x,z,CAM_RAILS[i]);
      if(p.d<=MARGE)lokaal.push(CAM_RAILS[i]);
      if(!beste||p.d<beste.d)beste=p;
    }
    if(lokaal.length)return lokaal;
    return beste&&beste.seg?[beste.seg]:CAM_RAILS;
  }
  function projectOpRails(x,z,rails){
    let beste=null;
    for(let i=0;i<rails.length;i++){
      const p=railPunt(x,z,rails[i]);
      if(!beste||p.d<beste.d)beste=p;
    }
    return beste||{x:x,z:z,d:0};
  }
  function projectRail(x,z){
    return projectOpRails(x,z,railsBij(held.position.x,held.position.z));
  }
  function projectAlleRails(x,z){
    return projectOpRails(x,z,CAM_RAILS);
  }
  function kijkPunt(out){
    const facing=camHoek();
    out.set(
      held.position.x+Math.sin(facing)*kijkVooruit,
      held.position.y+CAM_LOOK_Y,
      held.position.z+Math.cos(facing)*kijkVooruit
    );
    return out;
  }
  function doelCamera(out,look){
    kijkPunt(look);
    const yaw=camHoek(), c=Math.cos(camPitch), s=Math.sin(camPitch);
    let cx=look.x-Math.sin(yaw)*CAM_DIST*c;
    let cy=look.y+CAM_DIST*s;
    let cz=look.z-Math.cos(yaw)*CAM_DIST*c;
    const p=projectRail(cx,cz);
    cx=p.x;cz=p.z;
    if(cy<CAM_MIN_Y)cy=CAM_MIN_Y;
    if(camInSolid(cx,cy,cz)){
      for(let i=1;i<=12;i++){
        const k=i/12;
        const nx=cx+(look.x-cx)*k, nz=cz+(look.z-cz)*k;
        if(!camInSolid(nx,cy,nz)){cx=nx;cz=nz;break}
      }
    }
    out.set(cx,cy,cz);
    return out;
  }
  function zoekCamera(out){
    return doelCamera(out,LOOK_CAM);
  }
  const lookPos=new THREE.Vector3(0,1.3,8.5);
  let camAchterT=0,camAchterVan=0,camAchterNaar=0;
  function zetCameraAchter(){
    camAchterVan=camYaw;
    camAchterNaar=wikkelYaw(held.rotation.y);
    camAchterT=0.001;
    camVast=false;
  }
  function fadeOcclusie(){
    if(!haagFade.length)return;
    const kop=LOOK;
    kop.set(held.position.x,held.position.y+1.45,held.position.z);
    const dir=CAM_ZOEK;
    dir.subVectors(kop,camera.position);
    const dist=dir.length();
    if(dist<0.05)return;
    dir.multiplyScalar(1/dist);
    ray.set(camera.position,dir);
    ray.far=dist-0.12;
    const hits=ray.intersectObjects(haagFade,false);
    const blok=new Set();
    for(let i=0;i<hits.length;i++){
      const o=hits[i].object;
      if(o&&o.userData&&o.userData.fadeOc)blok.add(o);
    }
    for(let i=0;i<haagFade.length;i++){
      const m=haagFade[i], mat=m.userData.fadeMat||m.material;
      const cur=m.userData.fadeOp==null?1:m.userData.fadeOp;
      // occlusie meteen doorzichtig (Luna nooit een frame weg), terugkomen is zacht
      const nxt=blok.has(m)?0.28:cur+(1-cur)*0.18;
      m.userData.fadeOp=nxt;
      if(mat){
        const tr=nxt<0.95;
        mat.transparent=tr;
        mat.opacity=nxt;
        mat.depthWrite=!tr;
        mat.needsUpdate=true;
      }
    }
  }
  function camInSolid(x,y,z){
    const r=0.28;
    for(let i=0;i<col.length;i++){
      const c=col[i];
      if(x>c.minx-r&&x<c.maxx+r&&z>c.minz-r&&z<c.maxz+r&&y<(c.h||3.4)-0.15)return true;
    }
    return false;
  }
  function lunaZichtbaar(){
    const kop=new THREE.Vector3(held.position.x,held.position.y+1.45,held.position.z);
    const dir=new THREE.Vector3().subVectors(kop,camera.position);
    const dist=dir.length();
    if(dist<0.05)return true;
    dir.multiplyScalar(1/dist);
    ray.set(camera.position,dir);
    ray.far=dist-0.12;
    const hits=ray.intersectObjects(haagFade,false);
    for(let i=0;i<hits.length;i++){
      const mat=hits[i].object&&(hits[i].object.userData.fadeMat||hits[i].object.material);
      const op=hits[i].object&&hits[i].object.userData.fadeOp;
      if(mat&&!mat.transparent&&(op==null||op>0.6))return false;
      if(op!=null&&op>0.6)return false;
    }
    return true;
  }
  function volgCamera(dt){
    if(camAchterT>0){
      camAchterT+=dt;
      const k=Math.min(1,camAchterT/0.65);
      const e=k*k*(3-2*k);
      let d=wikkelYaw(camAchterNaar-camAchterVan);
      camYaw=wikkelYaw(camAchterVan+d*e);
      if(k>=1)camAchterT=0;
    }
    if(camStokAan&&camStokKracht>0.18){
      camAchterT=0;
      camYaw=wikkelYaw(camYaw-camStokDx*CAM_YAW_SNEL*dt);
      camPitch=Math.max(CAM_PITCH_MIN,Math.min(CAM_PITCH_MAX,camPitch-camStokDy*CAM_PITCH_SNEL*dt));
    }
    doelCamera(CAM_ZOEK,LOOK_CAM);
    const k=1-Math.exp(-4.2*dt);
    const yawAan=camStokAan&&camStokKracht>0.18;
    const maxStap=(yawAan?CAM_DIST*CAM_YAW_SNEL*dt:0)+0.33;
    const vanX=camPos.x,vanY=camPos.y,vanZ=camPos.z;
    camPos.lerp(CAM_ZOEK,k);
    lookPos.lerp(LOOK_CAM,k);
    const opPad=projectAlleRails(camPos.x,camPos.z);
    camPos.x=opPad.x;camPos.z=opPad.z;
    if(camPos.y<CAM_MIN_Y)camPos.y=CAM_MIN_Y;
    const stap=Math.hypot(camPos.x-vanX,camPos.y-vanY,camPos.z-vanZ);
    if(stap>maxStap&&stap>0.0001){
      const s=maxStap/stap;
      camPos.set(vanX+(camPos.x-vanX)*s,vanY+(camPos.y-vanY)*s,vanZ+(camPos.z-vanZ)*s);
    }
    if(camInSolid(camPos.x,camPos.y,camPos.z)){
      const naar=projectRail(camPos.x,camPos.z);
      for(let i=1;i<=10;i++){
        const k2=i/10;
        const nx=camPos.x+(naar.x-camPos.x)*k2,nz=camPos.z+(naar.z-camPos.z)*k2;
        if(!camInSolid(nx,camPos.y,nz)){camPos.x=nx;camPos.z=nz;break}
      }
    }
    camera.position.copy(camPos);
    camera.lookAt(lookPos);
    fadeOcclusie();
  }

  function tic(){
    const now=performance.now();
    let dt=Math.min(0.05,(now-laatste)/1000);laatste=now;
    const t=klok.getElapsedTime();
    if(!naarBinnen && stokAan && stokKracht>0.08){
      lopen=true;doel=null;mark.visible=false;
      // richting t.o.v. de camerahoek (niet t.o.v. Luna), zodat de camera niet meedraait
      const fx=Math.sin(camYaw),fz=Math.cos(camYaw);
      const wx=fz*stokDx+fx*stokDz,wz=(-fx)*stokDx+fz*stokDz;
      const wl=Math.hypot(wx,wz)||1;
      const stap=snelheid*dt*stokKracht;
      const [nx,nz]=schuif(held.position.x,held.position.z,wx/wl*stap,wz/wl*stap);
      held.position.x=nx;held.position.z=nz;
      const gewenst=Math.atan2(wx,wz);
      let d=wikkelYaw(gewenst-held.rotation.y);
      held.rotation.y=wikkelYaw(held.rotation.y+d*Math.min(1,10*dt));
      loopT+=dt;
    }else if(lopen&&doel&&!naarBinnen){
      const dx=doel.x-held.position.x,dz=doel.z-held.position.z;
      const len=Math.hypot(dx,dz);
      if(len<0.18){
        lopen=false;mark.visible=false;
        if(doelDeur){const d=doelDeur;doelDeur=null;naarDeur(d.open)}
      }
      else{
        const stap=Math.min(snelheid*dt,len);
        const [nx,nz]=schuif(held.position.x,held.position.z,dx/len*stap,dz/len*stap);
        if(nx===held.position.x&&nz===held.position.z){lopen=false;mark.visible=false}
        else{
          held.position.x=nx;held.position.z=nz;
          const gewenst=Math.atan2(dx,dz);
          let d=wikkelYaw(gewenst-held.rotation.y);
          held.rotation.y=wikkelYaw(held.rotation.y+d*Math.min(1,10*dt));
          loopT+=dt;
        }
      }
    }
    zetHoogte(dt);
    if(mixer&&!mixBevries)mixer.update(dt);
    if(!mixBevries)knijpStaf();
    if(!RMP){
      if(lopen)zetAnim('walk');
      else zetAnim('idle');
    }else zetAnim('idle');
    if(!RMP){
      if(T.water){T.water.offset.x=t*0.09;T.water.offset.y=t*0.035}
      if(T.glinster){T.glinster.offset.x=-t*0.06;T.glinster.offset.y=t*0.08}
      if(T.rimpel){T.rimpel.offset.x=t*0.05;T.rimpel.offset.y=Math.sin(t*0.7)*0.03}
      stralen.forEach((s,i)=>{
        s.scale.set(1,1+Math.sin(t*5+i)*0.1,1);
        s.material.opacity=0.5+Math.sin(t*6+i)*0.16;
        if(licht)s.material.opacity*=0.7;
      });
      const nDrup=licht?8:druppels.length;
      druppels.forEach((d,i)=>{
        if(i>=nDrup){d.visible=false;return}
        d.visible=true;
        const k=monden[d.userData.kop];
        const u=(t*0.7+d.userData.fase)%1, iu=1-u;
        d.position.set(
          iu*iu*k.mond.x+2*iu*u*k.mid.x+u*u*k.land.x,
          iu*iu*k.mond.y+2*iu*u*k.mid.y+u*u*k.land.y,
          iu*iu*k.mond.z+2*iu*u*k.mid.z+u*u*k.land.z
        );
        d.scale.setScalar(1.15-u*0.45);
        d.material.opacity=0.9-u*0.55;
        if(u>0.88){
          const s=spatten[d.userData.kop];
          s.visible=true;
          s.position.copy(k.land);s.position.y=0.82;
          s.scale.setScalar(0.7+(u-0.88)*9);
          s.material.opacity=0.55-(u-0.88)*4;
        }
      });
      // haagzwaai uitgezet: te duur voor weinig winst

      zon.intensity=1.08;
      gloed.material.opacity=0.4+Math.sin(t*2.4)*0.18;
      ven.material.opacity=0.45+Math.sin(t*1.7)*0.15;
      if(typeof deurGloed!=='undefined'){
        deurGloed.forEach((g,i)=>{g.material.opacity=0.35+Math.sin(t*2.1+i)*0.2});
      }
      if(typeof vlinder!=='undefined' && vlinder && !licht){
        vlinder.visible=true;
        vlinder.position.set(Math.sin(t*0.35)*6.5,1.2+Math.sin(t*1.4)*0.35,10+Math.cos(t*0.28)*5);
        vlinder.rotation.y=t*0.35+1.2;
        const flap=Math.sin(t*14)*0.7;
        vlinder.userData.vL.rotation.y=-0.4+flap;
        vlinder.userData.vR.rotation.y=0.4-flap;
      }else if(typeof vlinder!=='undefined' && vlinder){vlinder.visible=false}
      if(typeof vonkRingen!=='undefined' && stafPunt){
        stafPunt.getWorldPosition(TMP);
        vonkRingen.forEach((r,i)=>{
          const aan=lopen&&!licht&&!RMP;
          r.visible=aan;
          if(!aan)return;
          const u=(t*0.8+i*0.33)%1;
          r.position.copy(TMP);
          r.position.y+=0.02;
          r.scale.setScalar(0.15+u*0.7);
          r.material.opacity=0.55*(1-u);
          r.rotation.x=t*2+i;r.rotation.y=t*1.4;
        });
      }
    }

    if(lopen){
      const s=Math.sin(loopT*8);
      if(stapKen*s<0){
        stapKen=s<0?-1:1;
        stapGeluid(ondergrond(held.position.x,held.position.z));
      }
    }
    if(audioKlaar && geluidAan){
      zetLuisteraar();
      if(panners.stap){panners.stap.positionX.value=held.position.x;panners.stap.positionZ.value=held.position.z}
      if(panners.fakkel&&fakkels&&fakkels.length){
        let beste=fakkels[0],bd=1e9;
        const hx=held.position.x,hz=held.position.z;
        for(let i=0;i<fakkels.length;i++){
          const f=fakkels[i],d=(f.x-hx)*(f.x-hx)+(f.z-hz)*(f.z-hz);
          if(d<bd){bd=d;beste=f}
        }
        panners.fakkel.positionX.value=beste.x;
        panners.fakkel.positionY.value=beste.y;
        panners.fakkel.positionZ.value=beste.z;
        fakkelKnisterT-=dt;
        if(fakkelKnisterT<=0 && bd<160){
          fakkelGesis();
          fakkelKnisterT=0.12+Math.random()*0.28;
        }
      }
      birdT+=dt;
      if(birdT>2.4){birdT=-Math.random()*2;const L=panners.vogels;if(L&&L.length)vogelFluit(L[Math.floor(Math.random()*L.length)])}
    }
    if(mark.visible)mark.material.opacity=0.45+Math.sin(t*4)*0.3;
    // stapelwolken staan vast (geen lookAt per frame, te duur en gaf eerder kruisen)
    bloemen.forEach(f=>f.lookAt(camera.position));
    if(pollen)pollen.visible=false;
    if(typeof sfeerTic==='function')sfeerTic(t,dt);
    if(!camVast)volgCamera(dt);
    zetDeurKaart();
    renderer.render(scene,camera);
    tekenDebug();
    frames++;
    if(now-tFps>=1000){
      fps=Math.round(frames*1000/(now-tFps));
      fpsMin=Math.min(fpsMin,fps);
      frames=0;tFps=now;
      if(fpsEl)fpsEl.textContent=fps+' fps'+(licht?' · licht':'');
      if(!t0fps)t0fps=now;
      if(!licht && now-t0fps>3500){
        if(fps<32)laagFps++;else laagFps=0;
        if(laagFps>=3){licht=true;maat();}
      }
    }
    requestAnimationFrame(tic);
  }

  function pbrMap(tex,herhaal){
    const img=tex.image;
    if(img && (img.width>512||img.height>512)){
      const c=document.createElement('canvas');
      const s=512/Math.max(img.width,img.height);
      c.width=Math.max(1,Math.round(img.width*s));
      c.height=Math.max(1,Math.round(img.height*s));
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      tex.image=c;
    }
    if(THREE.SRGBColorSpace)tex.colorSpace=THREE.SRGBColorSpace;
    tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
    tex.magFilter=THREE.LinearFilter;
    tex.minFilter=THREE.LinearMipmapLinearFilter;
    tex.generateMipmaps=true;
    if(herhaal)tex.repeat.set(herhaal[0],herhaal[1]);
    tex.needsUpdate=true;
    return tex;
  }
  function zetVoortgang(p){
    const vul=$('ladenvul'),pct=$('ladenpct');
    const k=Math.max(0,Math.min(1,p));
    if(vul)vul.style.width=Math.round(k*100)+'%';
    if(pct)pct.textContent=Math.round(k*100)+'%';
  }
  function voegGeos(geos){
    let vc=0,ic=0;
    const hasN=geos.every(g=>g.attributes.normal);
    const hasU=geos.every(g=>g.attributes.uv);
    const hasC=geos.every(g=>g.attributes.color);
    geos.forEach(g=>{
      vc+=g.attributes.position.count;
      ic+=g.index?g.index.count:g.attributes.position.count;
    });
    const pos=new Float32Array(vc*3);
    const nrm=hasN?new Float32Array(vc*3):null;
    const uv=hasU?new Float32Array(vc*2):null;
    const col=hasC?new Float32Array(vc*3):null;
    const idx=new Uint32Array(ic);
    let vo=0,io=0;
    geos.forEach(g=>{
      const p=g.attributes.position,n=g.attributes.normal,u=g.attributes.uv,c=g.attributes.color;
      for(let i=0;i<p.count;i++){
        const o=(vo+i)*3;
        pos[o]=p.getX(i);pos[o+1]=p.getY(i);pos[o+2]=p.getZ(i);
        if(nrm&&n){nrm[o]=n.getX(i);nrm[o+1]=n.getY(i);nrm[o+2]=n.getZ(i)}
        if(uv&&u){uv[(vo+i)*2]=u.getX(i);uv[(vo+i)*2+1]=u.getY(i)}
        if(col&&c){col[o]=c.getX(i);col[o+1]=c.getY(i);col[o+2]=c.getZ(i)}
      }
      if(g.index){
        const id=g.index;
        for(let i=0;i<id.count;i++)idx[io++]=id.getX(i)+vo;
      }else{
        for(let i=0;i<p.count;i++)idx[io++]=vo+i;
      }
      vo+=p.count;
    });
    const out=new THREE.BufferGeometry();
    out.setAttribute('position',new THREE.BufferAttribute(pos,3));
    if(nrm)out.setAttribute('normal',new THREE.BufferAttribute(nrm,3));
    else out.computeVertexNormals();
    if(uv)out.setAttribute('uv',new THREE.BufferAttribute(uv,2));
    if(col)out.setAttribute('color',new THREE.BufferAttribute(col,3));
    out.setIndex(new THREE.BufferAttribute(idx,1));
    return out;
  }
  let versmolten=false;
  function versmeltStatisch(){
    if(versmolten)return;versmolten=true;
    function mark(o){if(!o)return;o.userData.dyn=1;if(o.traverse)o.traverse(c=>c.userData.dyn=1)}
    if(typeof waterVlakken!=='undefined')waterVlakken.forEach(mark);
    if(typeof druppels!=='undefined')druppels.forEach(mark);
    if(typeof stralen!=='undefined')stralen.forEach(mark);
    if(typeof spatten!=='undefined')spatten.forEach(mark);
    if(typeof deurKas!=='undefined')mark(deurKas);
    if(typeof deurHal!=='undefined')mark(deurHal);
    if(typeof deurH!=='undefined')mark(deurH);
    if(typeof held!=='undefined'&&held)mark(held);
    world.updateMatrixWorld(true);
    const skip=new Set();
    if(held)held.traverse(o=>skip.add(o));
    const groepen=new Map();
    world.traverse(o=>{
      if(!o.isMesh||o.isInstancedMesh||o.userData.dyn||o.userData.fadeOc||skip.has(o))return;
      if(!o.material||Array.isArray(o.material))return;
      if(o.material.transparent&&!o.material.alphaTest)return;
      const g=o.geometry.clone();
      o.updateWorldMatrix(true,false);
      g.applyMatrix4(o.matrixWorld);
      const k=o.material.uuid;
      if(!groepen.has(k))groepen.set(k,{mat:o.material,geos:[],meshes:[]});
      groepen.get(k).geos.push(g);
      groepen.get(k).meshes.push(o);
    });
    groepen.forEach(gr=>{
      if(gr.geos.length<2)return;
      const m=new THREE.Mesh(voegGeos(gr.geos),gr.mat);
      m.matrixAutoUpdate=false;m.frustumCulled=true;
      scene.add(m);
      gr.meshes.forEach(o=>{if(o.parent)o.parent.remove(o)});
    });
  }
  function sluitLaden(){
    versmeltStatisch();
    tuinKlaar=true;
    const el=$('laden');
    if(el){el.hidden=true;el.style.pointerEvents='none'}
    document.body.classList.remove('laden-bezig');
  }
  function laadTuinAssets(){
    const Loader=THREE.GLTFLoader;
    if(!Loader){lunaKlaar=true;gargKlaar=true;sluitLaden();return}
    const mgr=new THREE.LoadingManager();
    mgr.onProgress=function(url,ok,tot){zetVoortgang(tot?ok/Math.max(tot,1):0)};
    mgr.onLoad=function(){
      zetVoortgang(1);
      setTimeout(sluitLaden,160);
    };
    mgr.onError=function(u){try{console.warn('tuin3d asset',u)}catch(e){}};
    const tl=new THREE.TextureLoader(mgr);
    const gl=new Loader(mgr);
    const basis='assets/tuin3d/';
    function zetMat(naam,bestand,herhaal,kleur){
      tl.load(basis+'tex/'+bestand,function(tex){
        pbrMap(tex,herhaal);
        if(mat[naam]){
          mat[naam].map=tex;
          if(kleur!=null)mat[naam].color.setHex(kleur);
          mat[naam].needsUpdate=true;
        }
        if(naam==='pad'){
          [mat.padSlijt,mat.padRand].forEach(function(m){if(m){m.map=tex;m.color.setHex(0xe8d8b8);m.needsUpdate=true}});
        }
        if(naam==='zandsteen'){
          [mat.steenAO,mat.steenInst,mat.kopSteen,mat.sokkel].forEach(function(m){if(m){m.map=tex;m.needsUpdate=true}});
          if(mat.steenMuur){
            const tw=tex.clone();tw.repeat.set(1,1);tw.needsUpdate=true;
            mat.steenMuur.map=tw;mat.steenMuur.color.setHex(0xd4ae76);mat.steenMuur.needsUpdate=true;
          }
        }
      });
    }
    zetMat('gras','gras.webp',[18,20],0x628e32);
    zetMat('pad','kassei.webp',[1,1],0xe8d8b8);
    zetMat('zandsteen','zandsteen.webp',[2.6,2.6],0xd6b07a);
    zetMat('sokkel','zandsteen.webp',[2,2],0xd8b888);
    zetMat('leisteen','leisteen.webp',[2,2],0xffffff);
    // hagen houden de zelfgemaakte bladcluster-textuur (Moss003 was te vlak)
    tl.load(basis+'tex/gras.webp',function(tex){
      const img=tex.image,c=document.createElement('canvas');
      c.width=img.width;c.height=img.height;
      const cg=c.getContext('2d');cg.drawImage(img,0,0);
      const id=cg.getImageData(0,0,c.width,c.height),d=id.data,W=c.width,H=c.height;
      for(let i=0;i<d.length;i+=4){
        const x=(i/4)%W,y=Math.floor((i/4)/W);
        const stripe=Math.sin(y/H*22*Math.PI)*0.12;
        let r=d[i],g0=d[i+1],b=d[i+2];
        // dieper, rijker groen, maaistrepen, geen gele lift
        const avg=(r+g0+b)/3;
        r=Math.max(0,Math.min(255,avg+(r-avg)*1.28-12+stripe*22));
        g0=Math.max(0,Math.min(255,avg+(g0-avg)*1.48+8+stripe*40));
        b=Math.max(0,Math.min(255,avg+(b-avg)*1.05-24+stripe*8));
        d[i]=r;d[i+1]=g0;d[i+2]=b;
      }
      cg.putImageData(id,0,0);
      const tx=new THREE.CanvasTexture(c);
      pbrMap(tx,[18,20]);
      if(mat.gras){mat.gras.map=tx;mat.gras.color.setHex(0x628e32);mat.gras.needsUpdate=true}
    });
    tl.load(basis+'tex/steen.webp',function(tex){
      pbrMap(tex,[1.8,1.8]);
      steenTex=tex;
      if(mat.kopSteen){mat.kopSteen.map=tex;mat.kopSteen.needsUpdate=true}
    });
    function zetNormaal(naam,bestand,herhaal,schaal){
      tl.load(basis+'tex/'+bestand,function(tex){
        tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
        tex.magFilter=THREE.LinearFilter;
        tex.minFilter=THREE.LinearMipmapLinearFilter;
        tex.generateMipmaps=true;
        if(herhaal)tex.repeat.set(herhaal[0],herhaal[1]);
        if(THREE.NoColorSpace)tex.colorSpace=THREE.NoColorSpace;
        const scl=new THREE.Vector2(schaal||0.7,schaal||0.7);
        const lijst=naam==='pad'?[mat.pad,mat.padSlijt,mat.padRand]:[mat.zandsteen,mat.steenAO,mat.sokkel,mat.kopSteen];
        lijst.forEach(function(m){
          if(!m)return;
          m.normalMap=tex;m.normalScale=scl;m.needsUpdate=true;
        });
      });
    }
    zetNormaal('pad','kassei-n.webp',[1,1],0.95);
    tl.load(basis+'tex/zandsteen-n.webp',function(tex){
      tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
      tex.magFilter=THREE.LinearFilter;
      tex.minFilter=THREE.LinearMipmapLinearFilter;
      tex.generateMipmaps=true;
      tex.repeat.set(1,1);
      if(THREE.NoColorSpace)tex.colorSpace=THREE.NoColorSpace;
      if(mat.steenMuur){
        mat.steenMuur.normalMap=tex;
        mat.steenMuur.normalScale=new THREE.Vector2(0.8,0.8);
        mat.steenMuur.needsUpdate=true;
      }
    });
    gl.load(basis+'luna.glb',plaatsLuna);
    gargKlaar=true;
    setTimeout(function(){
      if(!lunaKlaar)lunaKlaar=true;
      if(!gargKlaar)gargKlaar=true;
      if(!tuinKlaar)sluitLaden();
    },9000);
  }
  laadTuinAssets();

  doelCamera(camPos,LOOK_CAM);
  lookPos.copy(LOOK_CAM);
  camera.position.copy(camPos);
  camera.lookAt(lookPos);
  requestAnimationFrame(tic);

  function zetPlek(plek){
    const NAMED={
      poort:{x:0,z:6.8,y:0},
      pad:{x:0,z:8.2,y:0},
      fontein:{x:-3.6,z:6.8,y:Math.atan2(-5.0-(-3.6),9.7-6.8)},
      brug:{x:0,z:9.7,y:0},
      deur:{x:0,z:26.4,y:0},
      kas:{x:0,z:26.4,y:0},
      hagrid:{x:-13.0,z:14.0,y:-Math.PI/2},
      hal:{x:13.0,z:14.0,y:Math.PI/2}
    };
    const P=(plek&&typeof plek==='object'&&'x' in plek)?plek:(NAMED[plek]||{x:0,z:5.6,y:0});
    held.position.set(P.x,0,P.z);
    held.rotation.y=P.y;
    zetHoogte();
    lopen=false;doel=null;doelDeur=null;mark.visible=false;stopStok();stopCamStok();
    mixBevries=false;
    camVast=false;camAchterT=0;
    doelCamera(camPos,LOOK_CAM);
    lookPos.copy(LOOK_CAM);
    camera.position.copy(camPos);
    camera.lookAt(lookPos);
    zetDeurKaart();
    renderer.render(scene,camera);
  }

  window.ZW_TUIN={
    fps:()=>fps,
    fpsMin:()=>fpsMin,
    licht:()=>licht,
    stats:()=>{
      const r=renderer.info.render;
      let meshes=0, inst=0;
      scene.traverse(o=>{if(o.isInstancedMesh)inst++;else if(o.isMesh)meshes++;});
      return {calls:r.calls, triangles:r.triangles, points:r.points, meshes, inst, licht:!!licht, fps};
    },
    geladen:()=>!!(tuinKlaar&&lunaKlaar&&gargKlaar),
    pos:()=>({x:+held.position.x.toFixed(2),z:+held.position.z.toFixed(2),y:+held.position.y.toFixed(2)}),
    cam:()=>({x:+camera.position.x.toFixed(2),y:+camera.position.y.toFixed(2),z:+camera.position.z.toFixed(2),yaw:+camYaw.toFixed(3),pitch:+camPitch.toFixed(3),rot:+held.rotation.y.toFixed(3)}),
    stok:()=>({aan:stokAan,kracht:+stokKracht.toFixed(2),dx:+stokDx.toFixed(2),dz:+stokDz.toFixed(2)}),
    camStok:()=>({aan:camStokAan,kracht:+camStokKracht.toFixed(2),dx:+camStokDx.toFixed(2),dy:+camStokDy.toFixed(2)}),
    stokStand(d){
      if(!d||d.aan===false){stopStok();return this.stok()}
      stokAan=true;camVast=false;doel=null;doelDeur=null;mark.visible=false;
      stokDx=+d.dx||0;stokDz=d.dz==null?1:+d.dz;stokKracht=d.kracht==null?1:+d.kracht;
      return this.stok();
    },
    camStokStand(d){
      if(!d||d.aan===false){stopCamStok();return this.camStok()}
      camStokAan=true;camVast=false;camAchterT=0;
      camStokDx=+d.dx||0;camStokDy=+d.dy||0;camStokKracht=d.kracht==null?1:+d.kracht;
      return this.camStok();
    },
    camReset:zetCameraAchter,
    camTest(){
      return {
        pos:{x:held.position.x,y:held.position.y,z:held.position.z,rot:held.rotation.y},
        cam:{x:camera.position.x,y:camera.position.y,z:camera.position.z,yaw:camYaw,pitch:camPitch},
        zichtbaar:lunaZichtbaar(),
        inSolid:camInSolid(camera.position.x,camera.position.y,camera.position.z),
        inRail:inRail(camera.position.x,camera.position.z),
        fade:haagFade.filter(m=> (m.userData.fadeOp||1)<0.95).length,
        stok:{aan:stokAan,dx:stokDx,dz:stokDz,kracht:stokKracht},
        camStok:{aan:camStokAan,dx:camStokDx,dy:camStokDy,kracht:camStokKracht}
      };
    },
    debug:()=>({
      camYaw:+camYaw.toFixed(4),heading:+held.rotation.y.toFixed(4),pitch:+camPitch.toFixed(4),
      stok:{aan:stokAan,dx:+stokDx.toFixed(3),dz:+stokDz.toFixed(3),kracht:+stokKracht.toFixed(3),id:stokId},
      camStok:{aan:camStokAan,dx:+camStokDx.toFixed(3),dy:+camStokDy.toFixed(3),kracht:+camStokKracht.toFixed(3),id:camStokId},
      kijk:{aan:kijkAan,sleep:kijkSleep,id:kijkId},
      pointers:[...wijzers.values()]
    }),
    botten(){
      const out={names:[],wrist:null,axes:null,staf:null,tip:null};
      held.traverse(o=>{
        const n=o.name||'';
        if(/(Arm|Wrist|Hand|Index|Middle|Ring|Pinky|Thumb)/i.test(n)){
          const w=new THREE.Vector3();o.getWorldPosition(w);
          out.names.push({n,x:+w.x.toFixed(3),y:+w.y.toFixed(3),z:+w.z.toFixed(3)});
        }
      });
      let wrist=null;
      held.traverse(o=>{if(o.name==='WristR'||o.name==='Wrist.R')wrist=o});
      if(wrist){
        const w=new THREE.Vector3(),qx=new THREE.Vector3(),qy=new THREE.Vector3(),qz=new THREE.Vector3();
        wrist.getWorldPosition(w);
        wrist.matrixWorld.extractBasis(qx,qy,qz);
        out.wrist={x:+w.x.toFixed(3),y:+w.y.toFixed(3),z:+w.z.toFixed(3)};
        out.axes={x:[+qx.x.toFixed(3),+qx.y.toFixed(3),+qx.z.toFixed(3)],
                  y:[+qy.x.toFixed(3),+qy.y.toFixed(3),+qy.z.toFixed(3)],
                  z:[+qz.x.toFixed(3),+qz.y.toFixed(3),+qz.z.toFixed(3)]};
      }
      if(held.userData.staf){
        const w=new THREE.Vector3();held.userData.staf.getWorldPosition(w);
        out.staf={x:+w.x.toFixed(3),y:+w.y.toFixed(3),z:+w.z.toFixed(3),
          loc:{x:+held.userData.staf.position.x.toFixed(3),y:+held.userData.staf.position.y.toFixed(3),z:+held.userData.staf.position.z.toFixed(3)},
          rot:{x:+held.userData.staf.rotation.x.toFixed(3),y:+held.userData.staf.rotation.y.toFixed(3),z:+held.userData.staf.rotation.z.toFixed(3)}};
      }
      if(stafPunt){const t=new THREE.Vector3();stafPunt.getWorldPosition(t);out.tip={x:+t.x.toFixed(3),y:+t.y.toFixed(3),z:+t.z.toFixed(3)}}
      return out;
    },
    zetStafLoc(px,py,pz,rx,ry,rz){
      const st=held.userData.staf;if(!st)return false;
      st.position.set(px,py,pz);
      st.rotation.set(rx,ry,rz);
      held.updateMatrixWorld(true);
      return true;
    },
    close(kind){
      const hx=0,hz=9.0;
      held.position.set(hx,0,hz);zetHoogte();
      lopen=false;doel=null;mark.visible=false;stopStok();
      camVast=true;
      if(hintEl)hintEl.style.opacity='0';
      if(kind==='voor'){
        held.rotation.y=Math.PI;
        camera.position.set(0.15,1.48,hz-1.95);
        camera.lookAt(0,1.38,hz);
        snapAnim('idle',0.85);
      }else if(kind==='gargoyle'||kind==='fontein'){
        held.position.set(-2.15,0,6.35);zetHoogte();
        held.rotation.y=-0.35;
        camera.position.set(-3.55,1.72,6.85);
        camera.lookAt(-5.0,1.05,9.7);
      }else if(kind==='staf'||kind==='hand'){
        held.position.set(0,0,9);zetHoogte();
        held.rotation.y=0.35;lopen=false;loopT=0.15;
        snapAnim('walk',0.15);
        mixBevries=true;knijpStaf();held.updateMatrixWorld(true);
        const w=new THREE.Vector3(), tip=new THREE.Vector3();
        const wrist= (function(){let f=null;held.traverse(o=>{if(o.name==='WristR'||o.name==='Wrist.R')f=o});return f})();
        if(wrist)wrist.getWorldPosition(w);else w.set(-0.2,1.2,9);
        if(stafPunt)stafPunt.getWorldPosition(tip);
        else tip.copy(w).add(new THREE.Vector3(0,-0.15,0.04));
        camera.position.set(w.x-0.05, w.y+0.12, w.z+0.55);
        camera.lookAt(w.x, w.y-0.05, w.z+0.05);
      }else if(kind==='zij'){
        held.position.set(0,0,9);zetHoogte();
        held.rotation.y=0.2;lopen=true;loopT=0.4;
        snapAnim('walk',0.15);
        camera.position.set(-1.05,1.72,10.55);
        camera.lookAt(0.08,1.18,9.05);
      }else if(kind==='loop'){
        held.rotation.y=0.62;lopen=true;loopT=0.28;
        snapAnim('walk',0.15);
        camera.position.set(-1.95,1.52,hz-2.35);
        camera.lookAt(0.15,1.18,hz+0.25);
      }else{
        held.rotation.y=0;
        camera.position.set(0.35,1.62,hz-2.45);
        camera.lookAt(0,1.32,hz);
        snapAnim('idle',0.85);
      }
      renderer.render(scene,camera);
    },
    zet:zetPlek,
    loopNaar(x,z){doel=new THREE.Vector3(x,0,z);doelDeur=null;mark.position.set(x,0.08,z);mark.visible=true;lopen=true},
    schermPlek(x,y,z){
      const v=new THREE.Vector3(x,y,z).project(camera);
      const r=canvas.getBoundingClientRect();
      return {x:(v.x*0.5+0.5)*r.width+r.left,y:(-v.y*0.5+0.5)*r.height+r.top,voor:Math.abs(v.z)<1};
    },
    doelInfo:()=>({lopen,naarBinnen,mark:!!mark.visible,
      doel:doel?{x:+doel.x.toFixed(2),z:+doel.z.toFixed(2)}:null,
      deur:doelDeur?doelDeur.open:null,
      overgang:overgang?{hidden:!!overgang.hidden,cls:overgang.className}:null}),
    bevries(t){
      mixBevries=true;
      if(t!=null)snapAnim('walk',t);
      else held.updateMatrixWorld(true);
      renderer.render(scene,camera);
    },
    dooi(){mixBevries=false},
    naarDeur,
    melding:(id)=>naarDeur(id||'kas',{geenNav:true}),
    sluitMelding:()=>{if(overgang){overgang.classList.remove('aan');overgang.hidden=true}naarBinnen=false},
    blokkeerNav:(v)=>{blokkeerNav=!!v},
    geluidBronnen:()=>Object.assign({},geluidBronnen),
    kijkNaar(px,py,pz,lx,ly,lz){camVast=true;if(hintEl)hintEl.style.opacity='0';camera.position.set(px,py,pz);camera.lookAt(lx,ly,lz);renderer.render(scene,camera)}
  };
})();
