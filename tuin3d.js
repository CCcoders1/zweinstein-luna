/* v171: 3D-testtuin, HP1-sfeer. Camerahoek alleen via slepen; joystick t.o.v. vaste camerahoek. CC0/zelfgemaakt. Geen EA/Warner-assets. */
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
      g.fillStyle='#0a2208';g.fillRect(0,0,n,n);
      for(let i=0;i<90;i++){
        const x=rnd(i+1)*n,y=rnd(i+4)*n,s=8+rnd(i+2)*16;
        g.fillStyle=rnd(i+6)>.5?'#071806':'#12300c';
        g.beginPath();g.ellipse(x,y,s,s*0.65,rnd(i)*5,0,Math.PI*2);g.fill();
      }
      for(let i=0;i<520;i++){
        const x=rnd(i+11)*n,y=rnd(i+17)*n,k=rnd(i+3);
        const col=k>.9?'#e8ff6a':k>.74?'#9ad42a':k>.54?'#58a820':k>.34?'#2e7a16':k>.16?'#1a4c0e':'#0c2808';
        g.fillStyle=col;
        g.save();g.translate(x,y);g.rotate(rnd(i+8)*Math.PI*2);
        g.beginPath();g.ellipse(0,0,3.2+rnd(i+2)*5.5,1.5+rnd(i+5)*3.4,0,0,Math.PI*2);g.fill();
        g.restore();
      }
    },128,[2,2],false),
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
      // De telefooncamera ziet vooral de zone vlak boven de horizon.
      // Daarom zit het hele verloop in het midden van de textuur (evenaar).
      const lg=g.createLinearGradient(0,0,0,h);
      lg.addColorStop(0,'#0a3a8a');
      lg.addColorStop(.30,'#1460c0');
      lg.addColorStop(.38,'#1e78d8');
      lg.addColorStop(.44,'#3a98e4');
      lg.addColorStop(.50,'#6ab4ec');
      lg.addColorStop(.56,'#a8d4f4');
      lg.addColorStop(.70,'#8ebce8');
      lg.addColorStop(1,'#6aa0d0');
      g.fillStyle=lg;g.fillRect(0,0,w,h);
      function sluier(x,y,rx,ry,a){
        const grd=g.createRadialGradient(x,y,0,x,y,rx);
        grd.addColorStop(0,'rgba(255,250,240,'+a+')');
        grd.addColorStop(.45,'rgba(236,244,255,'+(a*0.4)+')');
        grd.addColorStop(1,'rgba(200,220,240,0)');
        g.fillStyle=grd;
        g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();
      }
      // sluiers vlak boven de evenaar, waar de lucht in beeld is
      [[0.22,0.46,0.30,0.035,0.32],[0.58,0.44,0.36,0.04,0.28],[0.85,0.47,0.28,0.032,0.26],[0.40,0.48,0.24,0.028,0.22]].forEach(([u,v,rx,ry,a])=>sluier(u*w,v*h,rx*w,ry*h,a));
    },512,512,{scherp:true}),
    wolk: cvTex((g,w,h)=>{
      g.clearRect(0,0,w,h);
      function veeg(x,y,rx,ry,a,rot){
        g.save();g.translate(x,y);g.rotate(rot||0);
        const grd=g.createRadialGradient(0,0,0,0,0,Math.max(rx,ry));
        grd.addColorStop(0,'rgba(255,252,248,'+a+')');
        grd.addColorStop(.4,'rgba(240,246,255,'+(a*0.45)+')');
        grd.addColorStop(1,'rgba(200,220,240,0)');
        g.fillStyle=grd;
        g.beginPath();g.ellipse(0,0,rx,ry,0,0,Math.PI*2);g.fill();
        g.restore();
      }
      veeg(w*.50,h*.50,w*.46,h*.10,.62,-0.08);
      veeg(w*.42,h*.46,w*.32,h*.07,.4,-0.12);
      veeg(w*.60,h*.54,w*.28,h*.06,.35,0.06);
    },256,96,{scherp:true}),
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
      lg.addColorStop(0,'rgba(200,220,230,0)');
      lg.addColorStop(.45,'rgba(190,210,220,.45)');
      lg.addColorStop(1,'rgba(180,200,210,0)');
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
      for(let i=0;i<70;i++){
        const x=rnd(i+2)*n,y=rnd(i+9)*n;
        g.fillStyle=rnd(i)>.5?'#2f7a22':'#145018';
        g.beginPath();g.ellipse(x,y,3+rnd(i+3)*4,2+rnd(i+4)*3,rnd(i)*3,0,Math.PI*2);g.fill();
      }
    },64,null,true),
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
  T.klimop.wrapS=T.klimop.wrapT=THREE.ClampToEdgeWrapping;
  T.rank.wrapS=T.rank.wrapT=THREE.ClampToEdgeWrapping;
  T.nevel.wrapS=T.nevel.wrapT=THREE.ClampToEdgeWrapping;
  T.bloem.wrapS=T.bloem.wrapT=THREE.ClampToEdgeWrapping;
  T.pollen.wrapS=T.pollen.wrapT=THREE.ClampToEdgeWrapping;
  T.vonk.wrapS=T.vonk.wrapT=THREE.ClampToEdgeWrapping;
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
    haag: new THREE.MeshLambertMaterial({map:T.haag,color:0xe8f0d0}),
    baksteen: new THREE.MeshLambertMaterial({map:T.baksteen}),
    zandsteen: new THREE.MeshPhongMaterial({map:T.zandsteen,color:0xffffff,shininess:8,specular:0x332820}),
    pad: new THREE.MeshPhongMaterial({map:T.pad,color:0xffffff,shininess:10,specular:0x333333}),
    aarde: new THREE.MeshLambertMaterial({map:T.aarde}),
    hout: new THREE.MeshLambertMaterial({map:T.hout}),
    sokkel: new THREE.MeshPhongMaterial({map:T.zandsteen,color:0xe8d8b0,shininess:8,specular:0x332820}),
    ijzer: new THREE.MeshLambertMaterial({color:0x1a1a1c}),
    grind: new THREE.MeshLambertMaterial({map:T.grind}),
    water: new THREE.MeshPhongMaterial({map:T.water,color:0xc8fff8,transparent:true,opacity:0.94,depthWrite:false,shininess:160,specular:0xffffff,emissive:0x24b0b8,emissiveIntensity:0.88}),
    rimpel: new THREE.MeshBasicMaterial({map:T.rimpel,transparent:true,opacity:0.35,depthWrite:false,side:THREE.DoubleSide}),
    glinster: new THREE.MeshBasicMaterial({map:T.glinster,transparent:true,opacity:0.7,depthWrite:false,side:THREE.DoubleSide}),
    wolk: new THREE.MeshBasicMaterial({map:T.wolk,transparent:true,opacity:0.9,depthWrite:false,fog:false,side:THREE.DoubleSide}),
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
    schaduw: new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.32,depthWrite:false}),
    glow: new THREE.MeshBasicMaterial({color:0xffd070,transparent:true,opacity:0.55,depthWrite:false,side:THREE.DoubleSide}),
    gezicht: new THREE.MeshLambertMaterial({map:T.gezicht,transparent:true,depthWrite:false}),
    leisteen: new THREE.MeshLambertMaterial({color:0x2a2824}),
    vonk: new THREE.MeshBasicMaterial({map:T.vonk,transparent:true,depthWrite:false,opacity:0.9})
  };
  mat.bordKas=new THREE.MeshBasicMaterial({map:T.bordKas,side:THREE.DoubleSide});
  mat.bordHagrid=new THREE.MeshBasicMaterial({map:T.bordHagrid,side:THREE.DoubleSide});
  mat.bordHal=new THREE.MeshBasicMaterial({map:T.bordHal,side:THREE.DoubleSide});
  const haagTinten=[0xfffff0,0xf6ffd8,0xe6ffa8,0xd8f890,0xf0ffc4];
  const haagMats=haagTinten.map(c=>new THREE.MeshLambertMaterial({map:T.haag,color:c}));
  const haagTopMat=new THREE.MeshLambertMaterial({map:T.haag,color:0xfffff0});
  const haagOnderMat=new THREE.MeshLambertMaterial({map:T.haag,color:0x5a8a32});
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
  scene.background=new THREE.Color(0x3a98e0);
  scene.fog=new THREE.Fog(0x7ab4dc,62,135);

  const camera=new THREE.PerspectiveCamera(56,innerWidth/Math.max(1,innerHeight),0.28,160);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:false,alpha:false,powerPreference:'high-performance'});
  renderer.setClearColor(0x3a98e0,1);
  function pixelRatio(w,h){
    return Math.min(1,window.devicePixelRatio||1,Math.sqrt(320000/Math.max(1,w*h)));
  }
  function maat(){
    const w=innerWidth,h=Math.max(1,innerHeight);
    renderer.setPixelRatio(pixelRatio(w,h));
    renderer.setSize(w,h,false);
    camera.aspect=w/h;camera.updateProjectionMatrix();
  }
  maat();
  addEventListener('resize',maat,{passive:true});

  const hemel=new THREE.HemisphereLight(0xa8d4f8,0x4a6220,1.08);
  scene.add(hemel);
  const zon=new THREE.DirectionalLight(0xffe08a,1.18);
  zon.position.set(16,17,11);
  scene.add(zon);
  const rim=new THREE.DirectionalLight(0xc8def0,0.62);
  rim.position.set(-14,5,-16);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0xffefd0,0.38));

  const hemelkoepel=new THREE.Mesh(
    new THREE.SphereGeometry(90,16,12),
    new THREE.MeshBasicMaterial({map:T.lucht,side:THREE.BackSide,depthWrite:false,fog:false})
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
      const a=0.52+0.48*t;
      colr[i*3]=a;colr[i*3+1]=a;colr[i*3+2]=a;
    }
    geom.setAttribute('color',new THREE.BufferAttribute(colr,3));
    return geom;
  }
  const speerPos=[];
  function muur(x,z,w,d,h,y0){
    h=h||3.2;y0=y0||0;
    const tint=haagMats[Math.floor(rnd(x*9+z*13)*haagMats.length)%haagMats.length];
    const r=Math.min(w,d)*0.18;
    if(w>=d){
      box(tint,x,y0+h/2,z,Math.max(0.06,w-2*r),h,d);
      cyl(tint,x-w/2+r,y0+h/2,z,r,r,h,10);
      cyl(tint,x+w/2-r,y0+h/2,z,r,r,h,10);
    }else{
      box(tint,x,y0+h/2,z,w,h,Math.max(0.06,d-2*r));
      cyl(tint,x,y0+h/2,z-d/2+r,r,r,h,10);
      cyl(tint,x,y0+h/2,z+d/2-r,r,r,h,10);
    }
    box(haagOnderMat,x,y0+0.42,z,w*1.02,0.84,d*1.02);
    const langs=w>=d?w:d, dwars=w>=d?d:w, alongX=w>=d;
    const n=Math.max(2,Math.round(langs/0.75));
    for(let i=0;i<n;i++){
      const tt=(i+0.5)/n-0.5;
      const hh=0.10+rnd(x*13+z*7+i)*0.22;
      const ww=langs/n*0.88, dd=dwars*0.9;
      const px=alongX?x+tt*langs:x;
      const pz=alongX?z:z+tt*langs;
      const top=box(haagTopMat,px,y0+h+hh/2,pz,alongX?ww:dd,hh,alongX?dd:ww);
      haagToppen.push({m:top,x0:px,z0:pz,fase:rnd(x+z+i)*6.28});
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
    solid(x,z,w,d,y0+h+0.45);
  }

  /* wolken: lange, wazige veegwolken zoals in HP1 */
  const wolken=[];
  [[-16,10.5,26,2.4,0.7,-0.12],[10,11.2,32,2.8,0.65,0.08],
   [-8,12.0,38,3.2,0.55,-0.06],[18,10.8,24,2.2,0.6,0.1],
   [-22,11.4,18,2.6,0.5,-0.15]].forEach(([x,y,z,sx,sy,rot])=>{
    const w=new THREE.Mesh(new THREE.PlaneGeometry(22,3.2),mat.wolk);
    w.position.set(x,y,z);w.scale.set(sx,sy,1);w.rotation.z=rot||0;
    wolken.push(w);voeg(w);
  });

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
      const u=lenAcc*0.55;
      const iL=p.x+side.x*inner, iR=p.x-side.x*inner;
      const iLz=p.z+side.z*inner, iRz=p.z-side.z*inner;
      posI.push(iL,y,iLz, p.x,y+0.004,p.z, iR,y,iRz);
      uvI.push(0.18,u, 0.5,u, 0.82,u);
      const slijt=0.78+rnd(i*2.2)*0.1;
      colI.push(slijt,slijt*0.97,slijt*0.9, 1.12,1.08,1.0, slijt,slijt*0.97,slijt*0.9);
      const oL=p.x+side.x*mid, oR=p.x-side.x*mid;
      const oLz=p.z+side.z*mid, oRz=p.z-side.z*mid;
      posR.push(oL,y-0.004,oLz, iL,y,iLz, iR,y,iRz, oR,y-0.004,oRz);
      uvR.push(0,u, 0.3,u, 0.7,u, 1,u);
      colR.push(0.0,0.35,0.15, 0.85,0.8,0.65, 0.85,0.8,0.65, 0.0,0.35,0.15);
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
    pos.push(x,0.032,z);uv.push(0.5,0.5);col.push(1.1,1.06,0.98);
    for(let i=0;i<=seg;i++){
      const a=i/seg*Math.PI*2;
      const rr=r*(0.86+rnd(i*3.1)*0.2);
      pos.push(x+Math.sin(a)*rr,0.03,z+Math.cos(a)*rr);
      uv.push(0.5+Math.sin(a)*0.5,0.5+Math.cos(a)*0.5);
      col.push(0.8,0.78,0.7);
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
      const inst=new THREE.InstancedMesh(geo,new THREE.MeshLambertMaterial({map:T.pad,color:0xc2b8a6}),nK);
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
    const sil='#141c2c';
    function toren(x,basis,bw,th,spits){
      g.fillStyle=sil;
      g.fillRect(x-bw/2,basis-th,bw,th);
      g.beginPath();g.moveTo(x-bw/2-4,basis-th);g.lineTo(x,basis-th-spits);g.lineTo(x+bw/2+4,basis-th);g.closePath();g.fill();
    }
    function blok(x,y,bw,bh){g.fillStyle=sil;g.fillRect(x,y,bw,bh)}
    // hal + vleugel, torens, kantelen
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
    // zachte onderkant zodat het achter de hagen verdwijnt
    const fade=g.createLinearGradient(0,h-28,0,h);
    fade.addColorStop(0,'rgba(26,36,56,0)');
    fade.addColorStop(1,'rgba(26,36,56,0)');
    // lichte heiigheid aan de voet
    g.globalCompositeOperation='destination-out';
    const uit=g.createLinearGradient(0,h-40,0,h);
    uit.addColorStop(0,'rgba(0,0,0,0)');
    uit.addColorStop(1,'rgba(0,0,0,1)');
    g.fillStyle=uit;g.fillRect(0,h-40,w,40);
    g.globalCompositeOperation='source-over';
  },1024,256,{scherp:true});
  const kastMat=new THREE.MeshBasicMaterial({map:T.kasteel,transparent:true,opacity:1,depthWrite:false,fog:false,side:THREE.DoubleSide});
  const kastSil=new THREE.Mesh(new THREE.PlaneGeometry(13,5.2),kastMat);
  kastSil.position.set(3.2,6.35,35.5);
  kastSil.rotation.y=Math.PI;
  kastSil.renderOrder=2;
  voeg(kastSil);
  const boomRij=cvTex((g,w,h)=>{
    g.clearRect(0,0,w,h);
    for(let i=0;i<28;i++){
      const x=w*(i/27),H=h*(0.45+rnd(i)*0.55),R=18+rnd(i+3)*22;
      g.fillStyle=rnd(i)>.5?'#152414':'#0e1a10';
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
    cyl(m,x,0.75,z,0.32,0.28,1.5,20);
    cyl(m,x,1.54,z,0.36,0.33,0.12,20);
    cyl(m,x,1.66,z,0.38,0.32,0.14,20);
    const dop=new THREE.Mesh(new THREE.SphereGeometry(0.28,16,10),m);
    dop.position.set(x,1.78,z);dop.scale.set(1,0.42,1);voeg(dop);
    schijf(mat.schaduw,x,z,0.4);
    solid(x,z,0.7,0.7,1.95);
  }
  function hekstuk(x0,z0,x1,z1,n){
    n=n||5;
    for(let i=0;i<=n;i++){
      const t=i/n,h=1.08+((i%2)?0.12:0);
      const px=x0+(x1-x0)*t,pz=z0+(z1-z0)*t;
      box(mat.ijzer,px,h/2,pz,0.05,h,0.05);
      const sp=new THREE.Mesh(new THREE.ConeGeometry(0.035,0.16,5),mat.ijzer);
      sp.position.set(px,h+0.08,pz);voeg(sp);
    }
    const mx=(x0+x1)/2,mz=(z0+z1)/2,len=Math.hypot(x1-x0,z1-z0),ang=Math.atan2(x1-x0,z1-z0);
    const rail=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.05,len),mat.ijzer);
    rail.position.set(mx,0.55,mz);rail.rotation.y=ang;voeg(rail);
    const rail2=rail.clone();rail2.position.y=1.0;voeg(rail2);
  }
  function boog(x,z,r){
    r=r||2.2;
    const g=new THREE.Group();g.position.set(x,0,z);world.add(g);
    const b=new THREE.Mesh(new THREE.TorusGeometry(r,0.07,6,20,Math.PI),mat.ijzer);
    b.position.set(0,1.7,0);g.add(b);
    for(let i=1;i<=7;i++){
      const a=Math.PI*i/8;
      const sp=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.2,4),mat.ijzer);
      sp.position.set(Math.cos(a)*r,1.7+Math.sin(a)*r,0);
      sp.rotation.z=a-Math.PI/2;g.add(sp);
    }
    // ranken over de ijzeren boog, zoals op de referentie
    // ranken aan de schouders van de boog; top midden vrij zodat borden leesbaar blijven
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
  (function(){
    const v=new THREE.Group();v.position.set(-2.2,0,1.65);v.rotation.y=-1.05;world.add(v);
    const v2=new THREE.Group();v2.position.set(2.2,0,1.65);v2.rotation.y=1.05+Math.PI;world.add(v2);
    [v,v2].forEach(g=>{
      for(let i=0;i<6;i++){
        const s=new THREE.Mesh(new THREE.BoxGeometry(0.05,1.15,0.05),mat.ijzer);
        s.position.set(0.12+i*0.22,0.62,0);g.add(s);
      }
    });
  })();
  boog(0,13.4,2.2);
  pilaar(-2.2,13.4);pilaar(2.2,13.4);

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
    const voet=new THREE.Mesh(zetAO(new THREE.CylinderGeometry(r+0.34,r+0.44,0.22,8),0.22),mat.steenAO);
    voet.position.set(x,0.11,z);voeg(voet);
    const sok=new THREE.Mesh(zetAO(new THREE.CylinderGeometry(r+0.2,r+0.3,0.28,8),0.28),mat.steenAO);
    sok.position.set(x,0.34,z);voeg(sok);
    // open binnenkant: alleen wanden, geen deksel
    const wand=new THREE.Mesh(new THREE.CylinderGeometry(r+0.16,r+0.2,0.52,8,1,true),mat.zandsteen);
    wand.position.set(x,0.6,z);voeg(wand);
    const buiten=new THREE.Mesh(new THREE.CylinderGeometry(r+0.28,r+0.32,0.16,8,1,true),mat.zandsteen);
    buiten.position.set(x,0.86,z);voeg(buiten);
    const rand=new THREE.Mesh(new THREE.RingGeometry(r-0.04,r+0.32,8),mat.zandsteen);
    rand.rotation.x=-Math.PI/2;rand.position.set(x,0.94,z);voeg(rand);
    const lip=new THREE.Mesh(new THREE.CylinderGeometry(r-0.02,r-0.08,0.1,8,1,true),mat.zandsteen);
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
    // +Y van de polsstekker wijst langs de vingers; lokale rustpose blijft in de palm
    staf.position.set(0,0.02,0);
    staf.rotation.set(0,0,0);
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
    if(wristR){maakStaf(wristR);pasStafInPalm(wristR,root)}
    lunaKlaar=true;
  }

  const mark=new THREE.Mesh(new THREE.RingGeometry(0.22,0.34,16),new THREE.MeshBasicMaterial({color:0xe6c25a,transparent:true,opacity:0.85,side:THREE.DoubleSide,depthWrite:false}));
  mark.rotation.x=-Math.PI/2;mark.visible=false;scene.add(mark);

  const camOff=new THREE.Vector3(0.52,1.85,-5.2);
  const kijkVooruit=1.7;
  const CAM_MIN=4.0,CAM_MIN_Y=1.5;
  let camYaw=0,camPitch=0;
  const CAM_PITCH_MIN=-0.22,CAM_PITCH_MAX=0.5;
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
  function inStokZone(x,y){
    if(!loopStok)return false;
    const r=loopStok.getBoundingClientRect(),p=48;
    return x>=r.left-p&&x<=r.right+p&&y>=r.top-p&&y<=r.bottom+p;
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
    return ev.target&&ev.target.closest&&ev.target.closest('a,button,#nowebgl,#overgang,#loopstok,#laden,#deurkaart,#camreset,#tuindebug');
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
    if(kijkAan&&kijkId!=null&&ev.pointerId!==kijkId)return true;
    return false;
  }
  function startKijk(ev){
    if(naarBinnen)return;
    if(negeerMuis(ev))return;
    if(pointerOpUi(ev))return;
    if(stokAan&&ev.pointerId===stokId)return;
    if(ev.pointerId===stokId)return;
    if(inStokZone(ev.clientX,ev.clientY))return;
    if(ev.target&&ev.target.closest&&ev.target.closest('#loopstok'))return;
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
    if(kijkSleep){
      camYaw=wikkelYaw(camYaw-dx*0.0075);
      camPitch=Math.max(CAM_PITCH_MIN,Math.min(CAM_PITCH_MAX,camPitch+dy*0.0055));
      camCacheAan=false;camVast=false;
    }
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
    if(negeerMuis(ev)&&ev.pointerId!==stokId&&ev.pointerId!==kijkId)return;
    if(stokAan&&(stokId==null||ev.pointerId===stokId)){ev.preventDefault();merkWijzer(ev,'stok');zetStok(ev.clientX,ev.clientY);return}
    if(ev.pointerId===stokId)return;
    beweegKijk(ev);
  },{passive:false});
  function pointerLos(ev){
    merkWijzer(ev);
    if(stokAan&&(stokId==null||ev.pointerId===stokId)){
      ev.preventDefault();stokTot=performance.now()+500;stokId=null;stopStok();
      if(!doel)lopen=false;
      return;
    }
    if(ev.pointerId===stokId)return;
    losKijk(ev);
  }
  window.addEventListener('pointerup',pointerLos,{passive:false});
  window.addEventListener('pointercancel',pointerLos,{passive:false});
  window.addEventListener('lostpointercapture',pointerLos,{passive:false});
  function forceerLos(){
    if(stokAan){stokId=null;stopStok();if(!doel)lopen=false}
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

  function zetCameraAchter(){
    camYaw=wikkelYaw(held.rotation.y);
    camPitch=0;
    camCacheAan=false;camVast=false;
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
    debugEl.textContent='v171  camYaw '+camYaw.toFixed(3)+'  heading '+held.rotation.y.toFixed(3)+'  pitch '+camPitch.toFixed(3)+'\n'+
      'stok '+(stokAan?'AAN':'uit')+'  dx '+stokDx.toFixed(2)+'  dz '+stokDz.toFixed(2)+'  k '+stokKracht.toFixed(2)+'  id '+(stokId==null?'-':stokId)+'\n'+
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

  let audioCtx=null,masterGain=null,geluidAan=false,audioKlaar=false,audioBezig=false,stapKen=1,birdT=0,licht=false,laagFps=0,t0fps=0;
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

  function cameraPlek(out){
    const facing=camHoek();
    const sx=Math.sin(facing), cz=Math.cos(facing);
    const back=camOff.z*Math.cos(camPitch);
    const hy=held.position.y+camOff.y+Math.sin(camPitch)*Math.abs(camOff.z)*0.65;
    out.set(
      held.position.x+sx*back+cz*camOff.x,
      hy,
      held.position.z+cz*back-sx*camOff.x
    );
    return out;
  }
  function kijkPunt(out){
    const facing=camHoek();
    out.set(
      held.position.x+Math.sin(facing)*kijkVooruit,
      held.position.y+1.15+camPitch*0.85,
      held.position.z+Math.cos(facing)*kijkVooruit
    );
    return out;
  }
  function camOffset(out,lat,h,back){
    const facing=camHoek(), sx=Math.sin(facing), cz=Math.cos(facing);
    out.set(
      held.position.x+sx*back+cz*lat,
      held.position.y+h+Math.sin(camPitch)*Math.abs(back)*0.3,
      held.position.z+cz*back-sx*lat
    );
    return out;
  }
  function camPadVrij(px,py,pz,kijk){
    if(py<CAM_MIN_Y-0.05)return false;
    if(pz<0.6||pz>31||px<-20||px>20)return false;
    const hx=held.position.x, hy=held.position.y+1.45, hz=held.position.z;
    const dist=Math.hypot(px-hx,py-hy,pz-hz);
    if(dist<CAM_MIN-0.2)return false;
    const stappen=12;
    for(let i=0;i<=stappen;i++){
      const t=0.22+i/stappen*0.78;
      const x=hx+(px-hx)*t, y=hy+(py-hy)*t, z=hz+(pz-hz)*t;
      if(botsCam(x,y,z))return false;
    }
    if(kijk){
      for(let i=0;i<=10;i++){
        const t=i/10*0.84;
        const x=px+(kijk.x-px)*t, y=py+(kijk.y-py)*t, z=pz+(kijk.z-pz)*t;
        if(botsCam(x,y,z))return false;
      }
    }
    return true;
  }
  let camCacheAan=false;
  function zoekCamera(out){
    const kijk=kijkPunt(LOOK_CAM);
    cameraPlek(out);
    if(camPadVrij(out.x,out.y,out.z,kijk))return out;
    const cands=[
      [camOff.x, camOff.y, camOff.z],
      [camOff.x*0.4, camOff.y, camOff.z],
      [0, camOff.y, camOff.z],
      [-camOff.x, camOff.y, camOff.z],
      [camOff.x, camOff.y+0.7, camOff.z*0.9],
      [0, camOff.y+0.5, camOff.z],
      [-0.3, 3.2, -5.6],
      [0.3, 3.4, -5.2]
    ];
    for(let i=0;i<cands.length;i++){
      const c=cands[i];
      camOffset(out,c[0],c[1],c[2]);
      if(camPadVrij(out.x,out.y,out.z,kijk))return out;
    }
    const hx=held.position.x, hz=held.position.z, facing=camHoek();
    const dists=[6.4,5.4,4.4], hoogtes=[2.55,3.15,3.75];
    const spreiding=[0,0.35,-0.35,0.7,-0.7,1.05,-1.05,1.4,-1.4,1.85,-1.85,2.4,-2.4];
    for(let d=0;d<dists.length;d++){
      for(let h=0;h<hoogtes.length;h++){
        for(let s=0;s<spreiding.length;s++){
          const a=facing+Math.PI+spreiding[s];
          out.set(hx+Math.sin(a)*dists[d], held.position.y+hoogtes[h], hz+Math.cos(a)*dists[d]);
          if(camPadVrij(out.x,out.y,out.z,kijk))return out;
        }
      }
    }
    camOffset(out,0,4.2,-CAM_MIN);
    if(out.y<CAM_MIN_Y)out.y=CAM_MIN_Y;
    return out;
  }
  function volgCamera(dt){
    zoekCamera(CAM_ZOEK);
    const hx=held.position.x, hy=held.position.y+1.45, hz=held.position.z;
    camPos.lerp(CAM_ZOEK,1-Math.exp(-6.8*dt));
    if(Math.hypot(camPos.x-hx,camPos.y-hy,camPos.z-hz)<CAM_MIN-0.35 || botsCam(camPos.x,camPos.y,camPos.z)){
      camPos.copy(CAM_ZOEK);
    }
    if(camPos.y<CAM_MIN_Y)camPos.y=CAM_MIN_Y;
    camera.position.copy(camPos);
    camera.lookAt(kijkPunt(LOOK));
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

      zon.intensity=1.26+Math.sin(t*2.1)*0.05+Math.sin(t*6.5)*0.02;
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
      birdT+=dt;
      if(birdT>2.4){birdT=-Math.random()*2;const L=panners.vogels;if(L&&L.length)vogelFluit(L[Math.floor(Math.random()*L.length)])}
    }
    if(mark.visible)mark.material.opacity=0.45+Math.sin(t*4)*0.3;
    wolken.forEach((w,i)=>{
      w.position.x+=Math.sin(t*0.04+i)*0.003;
      w.lookAt(camera.position.x,w.position.y,camera.position.z);
    });
    bloemen.forEach(f=>f.lookAt(camera.position));
    const arr=pollen.geometry.attributes.position.array;
    for(let i=0;i<pN;i++){
      const o=p0[i];
      arr[i*3]=o.x+Math.sin(t*o.s+i)*0.35;
      arr[i*3+1]=o.y+Math.sin(t*o.f+i*0.7)*0.25;
      arr[i*3+2]=o.z+Math.cos(t*o.s*0.7+i)*0.35;
    }
    pollen.geometry.attributes.position.needsUpdate=true;
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
        if(laagFps>=3)licht=true;
      }
    }
    requestAnimationFrame(tic);
  }

  function pbrMap(tex,herhaal){
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
  function sluitLaden(){
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
          [mat.padSlijt,mat.padRand].forEach(function(m){if(m){m.map=tex;m.needsUpdate=true}});
        }
        if(naam==='zandsteen'){
          [mat.steenAO,mat.steenInst,mat.kopSteen,mat.sokkel].forEach(function(m){if(m){m.map=tex;m.needsUpdate=true}});
          if(mat.steenMuur){
            const tw=tex.clone();tw.repeat.set(1,1);tw.needsUpdate=true;
            mat.steenMuur.map=tw;mat.steenMuur.needsUpdate=true;
          }
        }
      });
    }
    zetMat('gras','gras.webp',[18,20],0xffffff);
    zetMat('pad','kassei.webp',[7,16],0xffffff);
    zetMat('zandsteen','zandsteen.webp',[2.6,2.6],0xffffff);
    zetMat('sokkel','zandsteen.webp',[2,2],0xf2e2c4);
    zetMat('leisteen','leisteen.webp',[2,2],0xffffff);
    zetMat('haag','haag.webp',[3,3],0xffffff);
    tl.load(basis+'tex/haag.webp',function(tex){
      pbrMap(tex,[2.5,2.5]);
      haagMats.forEach(function(m){m.map=tex;m.needsUpdate=true});
      haagTopMat.map=tex;haagTopMat.needsUpdate=true;
      haagOnderMat.map=tex;haagOnderMat.needsUpdate=true;
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
    zetNormaal('pad','kassei-n.webp',[7,16],0.55);
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

  zoekCamera(camPos);
  camera.position.copy(camPos);
  camera.lookAt(kijkPunt(LOOK));
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
    camYaw=P.y;camPitch=0;
    zetHoogte();
    lopen=false;doel=null;doelDeur=null;mark.visible=false;stopStok();
    camVast=false;camCacheAan=false;
    zoekCamera(camPos);
    camera.position.copy(camPos);
    camera.lookAt(kijkPunt(LOOK));
    zetDeurKaart();
    renderer.render(scene,camera);
  }

  window.ZW_TUIN={
    fps:()=>fps,
    fpsMin:()=>fpsMin,
    licht:()=>licht,
    geladen:()=>!!(tuinKlaar&&lunaKlaar&&gargKlaar),
    pos:()=>({x:+held.position.x.toFixed(2),z:+held.position.z.toFixed(2),y:+held.position.y.toFixed(2)}),
    cam:()=>({x:+camera.position.x.toFixed(2),y:+camera.position.y.toFixed(2),z:+camera.position.z.toFixed(2),yaw:+camYaw.toFixed(3),pitch:+camPitch.toFixed(3),rot:+held.rotation.y.toFixed(3)}),
    stok:()=>({aan:stokAan,kracht:+stokKracht.toFixed(2),dx:+stokDx.toFixed(2),dz:+stokDz.toFixed(2)}),
    camReset:zetCameraAchter,
    debug:()=>({
      camYaw:+camYaw.toFixed(4),heading:+held.rotation.y.toFixed(4),pitch:+camPitch.toFixed(4),
      stok:{aan:stokAan,dx:+stokDx.toFixed(3),dz:+stokDz.toFixed(3),kracht:+stokKracht.toFixed(3),id:stokId},
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
        held.rotation.y=0.15;lopen=true;loopT=0.45;
        snapAnim('walk',0.15);
        const w=new THREE.Vector3(), tip=new THREE.Vector3();
        const wrist= (function(){let f=null;held.traverse(o=>{if(o.name==='WristR'||o.name==='Wrist.R')f=o});return f})();
        if(wrist)wrist.getWorldPosition(w);else w.set(-0.2,1.2,9);
        if(stafPunt)stafPunt.getWorldPosition(tip);
        else tip.copy(w).add(new THREE.Vector3(0,-0.15,0.04));
        const mid=w.clone().lerp(tip,0.4);
        camera.position.set(mid.x-0.15, mid.y+0.22, mid.z+0.62);
        camera.lookAt(mid.x+0.04, mid.y-0.02, mid.z);
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
