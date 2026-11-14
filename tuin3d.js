/* v162: 3D-testtuin als knooppunt. Zelfgemaakte low-poly geometrie, geen EA/Warner-assets. */
(function(){
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('tuin');
  const hintEl = $('hint');
  const fpsEl = $('fps');
  const deurKaart = $('deurkaart');
  const deurBtn = $('deurbtn');
  const overgang = $('overgang');
  const noGl = $('nowebgl');

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
      g.fillStyle='#2f6a14';g.fillRect(0,0,n,n);
      for(let i=0;i<700;i++){
        const x=rnd(i+1)*n,y=rnd(i+9)*n,s=1+rnd(i+3)*2;
        g.fillStyle=rnd(i+7)>.62?'#5a9c22':rnd(i+4)>.45?'#3d7a18':'#24580e';
        g.fillRect(x,y,s,s+1);
      }
      for(let i=0;i<28;i++){
        g.fillStyle=rnd(i+40)>.5?'#6a5a28':'#3a4a14';
        g.fillRect(rnd(i+11)*n,rnd(i+17)*n,6+rnd(i)*10,4+rnd(i+2)*8);
      }
    },64,[18,22],true),
    haag: tex((g,n)=>{
      g.fillStyle='#0d3a10';g.fillRect(0,0,n,n);
      for(let i=0;i<900;i++){
        const x=rnd(i+2)*n,y=rnd(i+5)*n,s=1+rnd(i)*2;
        g.fillStyle=rnd(i+8)>.7?'#3f8a28':rnd(i+3)>.45?'#1e5c16':'#0a2e0c';
        g.beginPath();g.arc(x,y,s,0,Math.PI*2);g.fill();
      }
    },64,[3,4],true),
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
      g.fillStyle='#6a5a40';g.fillRect(0,0,n,n);
      const cell=16;
      for(let y=0;y<n;y+=cell){
        const off=(Math.floor(y/cell)%2)*(cell/2);
        for(let x=-cell;x<n;x+=cell){
          const v=rnd(x*5+y*3+2);
          g.fillStyle=v>.6?'#e0c894':v>.3?'#c9a86a':'#b08a50';
          g.fillRect(x+off+1,y+1,cell-2,cell-2);
        }
      }
    },64,[3,12],true),
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
      lg.addColorStop(0,'#061a4c');
      lg.addColorStop(.30,'#082870');
      lg.addColorStop(.38,'#0c3a96');
      lg.addColorStop(.44,'#1658bc');
      lg.addColorStop(.50,'#3a8ad0');
      lg.addColorStop(.56,'#8ebde4');
      lg.addColorStop(.70,'#7aa8d0');
      lg.addColorStop(1,'#5a8ab8');
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
      function puff(x,y,rx,ry,a){
        const grd=g.createRadialGradient(x,y,0,x,y,Math.max(rx,ry));
        grd.addColorStop(0,'rgba(255,252,245,'+a+')');
        grd.addColorStop(.4,'rgba(245,248,255,'+(a*0.55)+')');
        grd.addColorStop(.75,'rgba(210,226,240,'+(a*0.2)+')');
        grd.addColorStop(1,'rgba(180,205,230,0)');
        g.fillStyle=grd;
        g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();
      }
      // liggende wolkbank, meerdere lobben
      puff(w*.50,h*.55,w*.32,h*.18,.7);
      puff(w*.34,h*.52,w*.20,h*.14,.6);
      puff(w*.66,h*.52,w*.22,h*.14,.62);
      puff(w*.44,h*.46,w*.16,h*.11,.48);
      puff(w*.58,h*.47,w*.17,h*.10,.46);
      puff(w*.50,h*.64,w*.22,h*.10,.25);
    },256,128,{scherp:true}),
    rimpel: cvTex((g,w,h)=>{
      g.fillStyle='#3a7a88';g.fillRect(0,0,w,h);
      for(let i=1;i<=6;i++){
        g.strokeStyle='rgba(210,240,245,'+(0.18-i*0.02)+')';
        g.lineWidth=2;
        g.beginPath();g.ellipse(w/2,h/2,i*w/14,i*h/18,0,0,Math.PI*2);g.stroke();
      }
      g.fillStyle='rgba(255,255,255,.2)';
      g.beginPath();g.ellipse(w*.35,h*.35,w*.18,h*.08, -0.4,0,Math.PI*2);g.fill();
    },64,64,{repeat:[2,2]}),
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
      const band=8;
      for(let y=0;y<n;y+=band){
        g.fillStyle=(Math.floor(y/band)%2)?'#1a140c':'#e0a818';
        g.fillRect(0,y,n,band);
      }
    },32,[1,4],true),
    pollen: tex((g,n)=>{
      g.clearRect(0,0,n,n);
      const lg=g.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);
      lg.addColorStop(0,'rgba(255,230,120,.95)');
      lg.addColorStop(.5,'rgba(255,200,60,.45)');
      lg.addColorStop(1,'rgba(255,200,60,0)');
      g.fillStyle=lg;g.fillRect(0,0,n,n);
    },32,null,false)
  };
  T.lucht.wrapS=T.lucht.wrapT=THREE.ClampToEdgeWrapping;
  T.wolk.wrapS=T.wolk.wrapT=THREE.ClampToEdgeWrapping;
  T.klimop.wrapS=T.klimop.wrapT=THREE.ClampToEdgeWrapping;
  T.bloem.wrapS=T.bloem.wrapT=THREE.ClampToEdgeWrapping;
  T.pollen.wrapS=T.pollen.wrapT=THREE.ClampToEdgeWrapping;
  T.glas.wrapS=T.glas.wrapT=THREE.ClampToEdgeWrapping;

  function bordTex(tekst){
    return cvTex((g,w,h)=>{
      g.fillStyle='#16110a';g.fillRect(0,0,w,h);
      g.fillStyle='#2a2014';g.fillRect(14,14,w-28,h-28);
      g.strokeStyle='#c9a227';g.lineWidth=10;g.strokeRect(10,10,w-20,h-20);
      g.strokeStyle='#7a5a14';g.lineWidth=3;g.strokeRect(22,22,w-44,h-44);
      const regels=tekst.split('\n');
      g.textAlign='center';g.textBaseline='middle';
      g.font=regels.length>1?'bold 78px Georgia,Palatino,serif':'bold 96px Georgia,Palatino,serif';
      g.lineJoin='round';
      const stap=regels.length>1?100:0;
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
    haag: new THREE.MeshLambertMaterial({map:T.haag,color:0xb0c890}),
    baksteen: new THREE.MeshLambertMaterial({map:T.baksteen}),
    zandsteen: new THREE.MeshLambertMaterial({map:T.zandsteen}),
    pad: new THREE.MeshLambertMaterial({map:T.pad}),
    aarde: new THREE.MeshLambertMaterial({map:T.aarde}),
    hout: new THREE.MeshLambertMaterial({map:T.hout}),
    sokkel: new THREE.MeshLambertMaterial({map:T.zandsteen,color:0xe8d8b0}),
    ijzer: new THREE.MeshLambertMaterial({color:0x1a1a1c}),
    water: new THREE.MeshPhongMaterial({map:T.rimpel,color:0x6eb8c4,transparent:true,opacity:0.9,depthWrite:false,shininess:70,specular:0xd8f4ff}),
    wolk: new THREE.MeshBasicMaterial({map:T.wolk,transparent:true,opacity:0.92,depthWrite:false,fog:false,side:THREE.DoubleSide}),
    kasteel: new THREE.MeshLambertMaterial({color:0x24344c}),
    daksteen: new THREE.MeshLambertMaterial({color:0x1a2436}),
    druppel: new THREE.MeshBasicMaterial({color:0xc8eef6,transparent:true,opacity:0.7,depthWrite:false}),
    glas: new THREE.MeshLambertMaterial({map:T.glas,transparent:true,opacity:0.62,depthWrite:false,side:THREE.DoubleSide}),
    klimop: new THREE.MeshLambertMaterial({map:T.klimop,transparent:true,depthWrite:false,side:THREE.DoubleSide}),
    bloem: new THREE.MeshLambertMaterial({map:T.bloem,transparent:true,depthWrite:false,side:THREE.DoubleSide}),
    sjaal: new THREE.MeshLambertMaterial({map:T.sjaal}),
    pompoen: new THREE.MeshLambertMaterial({color:0xe07018}),
    steel: new THREE.MeshLambertMaterial({color:0x2a5a14}),
    huid: new THREE.MeshLambertMaterial({color:0xe8c4a0}),
    haar: new THREE.MeshLambertMaterial({color:0x3a2210}),
    gewaad: new THREE.MeshLambertMaterial({color:0xe0a818}),
    zwart: new THREE.MeshLambertMaterial({color:0x1a140c}),
    oogwit: new THREE.MeshLambertMaterial({color:0xf4efe6}),
    schaduw: new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.32,depthWrite:false}),
    glow: new THREE.MeshBasicMaterial({color:0xffd070,transparent:true,opacity:0.55,depthWrite:false,side:THREE.DoubleSide})
  };
  mat.bordKas=new THREE.MeshBasicMaterial({map:T.bordKas,side:THREE.DoubleSide});
  mat.bordHagrid=new THREE.MeshBasicMaterial({map:T.bordHagrid,side:THREE.DoubleSide});
  mat.bordHal=new THREE.MeshBasicMaterial({map:T.bordHal,side:THREE.DoubleSide});

  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x1a62c4);
  scene.fog=new THREE.Fog(0x4a86c0,48,120);

  const camera=new THREE.PerspectiveCamera(52,innerWidth/Math.max(1,innerHeight),0.18,160);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:false,alpha:false,powerPreference:'default'});
  renderer.setClearColor(0x1a62c4,1);
  renderer.setPixelRatio(Math.min(1.1,window.devicePixelRatio||1));
  function maat(){
    const w=innerWidth,h=Math.max(1,innerHeight);
    renderer.setSize(w,h,false);
    camera.aspect=w/h;camera.updateProjectionMatrix();
  }
  maat();
  addEventListener('resize',maat,{passive:true});

  const hemel=new THREE.HemisphereLight(0x7eb0f0,0x5a6a22,1.15);
  scene.add(hemel);
  const zon=new THREE.DirectionalLight(0xffc45c,1.45);
  zon.position.set(18,20,9);
  scene.add(zon);
  scene.add(new THREE.AmbientLight(0xffe2a8,0.28));

  const hemelkoepel=new THREE.Mesh(
    new THREE.SphereGeometry(90,24,16),
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
  function muur(x,z,w,d,h,y0){
    h=h||3.2;y0=y0||0;
    box(mat.haag,x,y0+h/2,z,w,h,d);
    const langs=w>=d?w:d, dwars=w>=d?d:w, alongX=w>=d;
    const n=Math.max(2,Math.round(langs/0.75));
    for(let i=0;i<n;i++){
      const t=(i+0.5)/n-0.5;
      const hh=0.14+rnd(x*13+z*7+i)*0.42;
      const ww=langs/n*0.88, dd=dwars*0.9;
      const px=alongX?x+t*langs:x;
      const pz=alongX?z:z+t*langs;
      box(mat.haag,px,y0+h+hh/2,pz,alongX?ww:dd,hh,alongX?dd:ww);
    }
    solid(x,z,w,d,y0+h+0.45);
  }

  /* wolken: brede, platte banken, uit het midden van de deuren gehouden */
  const wolken=[];
  [[-11,8.6,28,1.5,1.05],[12,8.2,30,1.7,1.15],[-18,9.0,22,1.4,1.0],[16,8.5,24,1.5,1.1],
   [8,9.2,40,1.8,1.15],[-14,9.4,36,1.45,1.05],[18,8.6,34,1.5,1.1],
   [-24,8.8,14,1.6,1.1],[-22,9.2,18,1.4,1.0],[20,9.0,14,1.4,1.05]].forEach(([x,y,z,sx,sy])=>{
    const w=new THREE.Mesh(new THREE.PlaneGeometry(12,3.6),mat.wolk);
    w.position.set(x,y,z);w.scale.set(sx,sy,1);
    wolken.push(w);voeg(w);
  });

  /* grond */
  const grond=new THREE.Mesh(new THREE.PlaneGeometry(64,70),mat.gras);
  grond.rotation.x=-Math.PI/2;grond.position.set(0,-0.01,14);
  voeg(grond);

  /* paden: zuid→noord, plus zijpaden naar west (Hagrid) en oost (Hal) */
  box(mat.pad,0,0.025,10,3.5,0.06,22);           // zuid + binnenplaats + naar kas
  box(mat.pad,0,0.025,24,3.5,0.06,16);           // noord naar kassen
  box(mat.pad,-8,0.025,14,16,0.06,3.4);          // west naar Hagrid
  box(mat.pad,8,0.025,14,16,0.06,3.4);           // oost naar Hal
  const plein=new THREE.Mesh(new THREE.CylinderGeometry(4.4,4.4,0.05,16),mat.pad);
  plein.position.set(0,0.03,14);voeg(plein);

  /* hagen */
  // zuidelijke gang
  muur(-2.9,6.2,1.35,10.5,3.25);
  muur(2.9,6.2,1.35,10.5,3.3);
  // binnenplaats: open naar de zijkanten, achterwanden
  muur(-8.6,8.4,12,1.35,3.2);
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
  const kastSil=new THREE.Mesh(new THREE.PlaneGeometry(11,4.4),kastMat);
  kastSil.position.set(3.0,8.0,36);
  kastSil.rotation.y=Math.PI;
  kastSil.renderOrder=2;
  voeg(kastSil);

  /* buxusbolletjes */
  [[-3.7,9.2],[3.7,8.6],[-3.6,19.2],[3.65,18.8],[-10.5,12.3],[10.5,12.4]].forEach(([x,z],i)=>{
    cyl(mat.haag,x,0.16,z,0.28,0.28,0.32,8);
    const bol=new THREE.Mesh(new THREE.SphereGeometry(0.5+i*0.03,8,6),mat.haag);
    bol.position.set(x,0.72,z);voeg(bol);
    schijf(mat.schaduw,x,z,0.45);
  });

  /* smeedijzeren poort zuid */
  function pilaar(x,z,steen){
    const m=steen||mat.baksteen;
    cyl(m,x,0.75,z,0.3,0.26,1.5,8);
    box(m,x,1.58,z,0.66,0.18,0.66);
    const knop=new THREE.Mesh(new THREE.SphereGeometry(0.14,8,6),m);
    knop.position.set(x,1.78,z);voeg(knop);
    schijf(mat.schaduw,x,z,0.4);
    solid(x,z,0.65,0.65,1.9);
  }
  function hekstuk(x0,z0,x1,z1,n){
    n=n||5;
    for(let i=0;i<=n;i++){
      const t=i/n,h=1.08+((i%2)?0.12:0);
      box(mat.ijzer,x0+(x1-x0)*t,h/2,z0+(z1-z0)*t,0.05,h,0.05);
    }
    const mx=(x0+x1)/2,mz=(z0+z1)/2,len=Math.hypot(x1-x0,z1-z0),ang=Math.atan2(x1-x0,z1-z0);
    const rail=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.05,len),mat.ijzer);
    rail.position.set(mx,0.55,mz);rail.rotation.y=ang;voeg(rail);
    const rail2=rail.clone();rail2.position.y=1.0;voeg(rail2);
  }
  function boog(x,z,r){
    const g=new THREE.Group();g.position.set(x,0,z);world.add(g);
    const b=new THREE.Mesh(new THREE.TorusGeometry(r||2.2,0.07,6,20,Math.PI),mat.ijzer);
    b.position.set(0,1.7,0);g.add(b);
    for(let i=1;i<=7;i++){
      const a=Math.PI*i/8;
      const sp=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.2,4),mat.ijzer);
      sp.position.set(Math.cos(a)*(r||2.2),1.7+Math.sin(a)*(r||2.2),0);
      sp.rotation.z=a-Math.PI/2;g.add(sp);
    }
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
  boog(0,11.6,2.2);
  pilaar(-2.2,11.6);pilaar(2.2,11.6);

  /* fontein in het midden van het knooppunt */
  const fx=-4.6,fz=14.2;
  cyl(mat.sokkel,fx,0.16,fz,1.85,1.85,0.32,12);
  cyl(mat.sokkel,fx,0.42,fz,1.72,1.62,0.28,12);
  // opstaande rand zodat het water in het bassin zit
  cyl(mat.sokkel,fx,0.62,fz,1.72,1.74,0.16,12);
  cyl(mat.sokkel,fx,1.05,fz,0.28,0.32,1.05,8);
  cyl(mat.sokkel,fx,1.58,fz,0.62,0.62,0.14,10);
  const kom=new THREE.Mesh(new THREE.CylinderGeometry(0.7,0.55,0.2,10),mat.sokkel);
  kom.position.set(fx,1.7,fz);voeg(kom);
  const komRand=new THREE.Mesh(new THREE.CylinderGeometry(0.72,0.72,0.08,10),mat.sokkel);
  komRand.position.set(fx,1.82,fz);voeg(komRand);
  const water1=new THREE.Mesh(new THREE.CircleGeometry(1.58,24),mat.water);
  water1.rotation.x=-Math.PI/2;water1.position.set(fx,0.58,fz);voeg(water1);
  const water2=new THREE.Mesh(new THREE.CircleGeometry(0.54,16),mat.water);
  water2.rotation.x=-Math.PI/2;water2.position.set(fx,1.84,fz);voeg(water2);
  const straal=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.08,0.95,8),mat.druppel.clone());
  straal.position.set(fx,2.35,fz);voeg(straal);
  const sproei=new THREE.Mesh(new THREE.SphereGeometry(0.07,8,6),mat.druppel.clone());
  sproei.position.set(fx,2.82,fz);voeg(sproei);
  const plons=new THREE.Mesh(new THREE.TorusGeometry(0.16,0.025,6,12),mat.druppel.clone());
  plons.position.set(fx,1.86,fz);plons.rotation.x=Math.PI/2;voeg(plons);
  const druppels=[];
  for(let i=0;i<12;i++){
    const d=new THREE.Mesh(new THREE.SphereGeometry(0.035,6,5),mat.druppel.clone());
    d.userData.fase=i/12;
    voeg(d);druppels.push(d);
  }
  schijf(mat.schaduw,fx,fz,1.9);
  solid(fx,fz,2.8,2.8,1.8);

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
  bak(-3.2,8.8,0);bak(3.2,9.0,0);bak(-3.2,20.2,0);bak(3.2,20.4,0);

  /* bloemetjes als kaartjes */
  const bloemen=[];
  const bloemPlek=[[-3.2,8.8],[-3.0,8.95],[-3.4,8.7],[3.2,9.0],[3.0,9.15],[3.4,8.85],[-3.2,20.2],[-3.0,20.35],[3.2,20.4],[3.4,20.25]];
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
  klimopVlak(-8.6,1.7,10.0,2.2,2.4,0);
  klimopVlak(8.6,1.6,18.8,2.0,2.3,Math.PI);

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
  maakBord(mat.bordKas,gevelKas,0,2.95,0.36,2.3,0.58);
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
  maakBord(mat.bordHagrid,gevelH,0,1.95,0.22,2.15,0.58);
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
  maakBord(mat.bordHal,gevelHal,0,2.98,0.72,2.25,0.56);
  solid(17.4,14,1.2,7.2,4.5);
  deuren.home={groep:deurHal, punt:new THREE.Vector3(15.4,0,14), naam:'De Grote Hal', open:'home', scharnier:+1};

  /* pollen */
  const pN=24;
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

  /* personage: gezicht leesbaar in profiel en driekwart */
  const held=new THREE.Group();
  held.position.set(0,0,6.2);
  scene.add(held);
  const gewaad=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.3,1.08,10),mat.gewaad);
  gewaad.position.y=0.64;held.add(gewaad);
  const zoom=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.31,0.12,10),mat.zwart);
  zoom.position.y=0.16;held.add(zoom);
  const kraag=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.18,0.14,10),mat.zwart);
  kraag.position.y=1.14;held.add(kraag);
  const kop=new THREE.Group();kop.position.y=1.38;held.add(kop);
  const hoofd=new THREE.Mesh(new THREE.SphereGeometry(0.17,10,8),mat.huid);
  kop.add(hoofd);
  const haar=new THREE.Mesh(new THREE.SphereGeometry(0.19,10,8),mat.haar);
  haar.position.set(0,0.09,-0.1);haar.scale.set(0.98,0.92,1.18);kop.add(haar);
  const pony=new THREE.Mesh(new THREE.BoxGeometry(0.24,0.06,0.07),mat.haar);
  pony.position.set(0,0.12,0.12);kop.add(pony);
  const oorL=new THREE.Mesh(new THREE.SphereGeometry(0.045,8,6),mat.huid);
  oorL.position.set(-0.175,0.0,0.0);oorL.scale.set(0.6,1,0.8);kop.add(oorL);
  const oorR=oorL.clone();oorR.position.x=0.175;kop.add(oorR);
  const oogL=new THREE.Mesh(new THREE.SphereGeometry(0.038,8,6),mat.oogwit);
  oogL.position.set(-0.065,0.025,0.145);kop.add(oogL);
  const oogR=oogL.clone();oogR.position.x=0.065;kop.add(oogR);
  const pupL=new THREE.Mesh(new THREE.SphereGeometry(0.02,6,5),mat.zwart);
  pupL.position.set(-0.065,0.025,0.176);kop.add(pupL);
  const pupR=pupL.clone();pupR.position.x=0.065;kop.add(pupR);
  const brow=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.012,0.018),mat.haar);
  brow.position.set(-0.065,0.07,0.155);kop.add(brow);
  const browR=brow.clone();browR.position.x=0.065;kop.add(browR);
  const neus=new THREE.Mesh(new THREE.SphereGeometry(0.032,6,5),mat.huid);
  neus.position.set(0,-0.02,0.185);kop.add(neus);
  const mond=new THREE.Mesh(new THREE.TorusGeometry(0.032,0.007,5,8,Math.PI),mat.zwart);
  mond.position.set(0,-0.085,0.155);mond.rotation.set(0.35,0,Math.PI);kop.add(mond);
  const sjaal=new THREE.Mesh(new THREE.TorusGeometry(0.17,0.045,6,12),mat.sjaal);
  sjaal.position.set(0,1.16,0);sjaal.rotation.x=Math.PI/2;held.add(sjaal);
  const sjaalL=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.42,0.045),mat.sjaal);
  sjaalL.position.set(-0.08,0.92,0.18);held.add(sjaalL);
  const sjaalR=sjaalL.clone();sjaalR.position.x=0.1;sjaalR.position.y=0.86;held.add(sjaalR);
  const armG=new THREE.Group();armG.position.set(0,1.05,0);held.add(armG);
  const armL=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.55,0.09),mat.gewaad);
  armL.position.set(-0.26,-0.18,0);armG.add(armL);
  const armR=armL.clone();armR.position.x=0.26;armG.add(armR);
  const schoenL=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.08,0.16),mat.zwart);
  schoenL.position.set(-0.1,0.05,0.04);held.add(schoenL);
  const schoenR=schoenL.clone();schoenR.position.x=0.1;held.add(schoenR);
  const schaduw=new THREE.Mesh(new THREE.CircleGeometry(0.4,10),mat.schaduw);
  schaduw.rotation.x=-Math.PI/2;schaduw.position.y=0.04;held.add(schaduw);

  const mark=new THREE.Mesh(new THREE.RingGeometry(0.22,0.34,16),new THREE.MeshBasicMaterial({color:0xe6c25a,transparent:true,opacity:0.85,side:THREE.DoubleSide,depthWrite:false}));
  mark.rotation.x=-Math.PI/2;mark.visible=false;scene.add(mark);

  const camOff=new THREE.Vector3(0.7,2.55,-6.8);
  const kijkVooruit=2.3;
  const camPos=new THREE.Vector3(0,2.6,2.0);
  camera.position.copy(camPos);
  let doel=null,lopen=false,loopT=0,naarBinnen=false;
  const snelheid=2.2;
  let nabij=null;

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
  function botsCam(x,y,z){
    if(y<0.35)return true;
    const r=0.42;
    for(let i=0;i<col.length;i++){
      const c=col[i];
      if(x>c.minx-r&&x<c.maxx+r&&z>c.minz-r&&z<c.maxz+r&&y<(c.h||3.4)+0.15)return true;
    }
    return false;
  }

  const ray=new THREE.Raycaster();
  const muis=new THREE.Vector2();
  const grondHits=[grond,plein];
  function tik(ev){
    if(naarBinnen)return;
    if(ev.target&&ev.target.closest&&ev.target.closest('a,button,#nowebgl,#overgang'))return;
    ev.preventDefault&&ev.preventDefault();
    const r=canvas.getBoundingClientRect();
    const cx=ev.clientX??(ev.touches&&ev.touches[0].clientX);
    const cy=ev.clientY??(ev.touches&&ev.touches[0].clientY);
    muis.x=((cx-r.left)/r.width)*2-1;
    muis.y=-((cy-r.top)/r.height)*2+1;
    ray.setFromCamera(muis,camera);
    const wie=dichtstDeur();
    if(wie&&held.position.distanceTo(wie.punt)<3.4){
      const hits=ray.intersectObjects([gevelKas,gevelH,gevelHal],true);
      if(hits.length&&hits[0].distance<16){naarDeur(wie.open);return}
    }
    const hits=ray.intersectObjects(grondHits.concat([bed]),true);
    if(!hits.length){
      // also try any mesh in world via a hidden walk-plane already = grond
      return;
    }
    const p=hits[0].point;
    let x=p.x,z=p.z;
    if(bots(x,z,0.4)){
      const ax=held.position.x,az=held.position.z;
      for(let t=0.9;t>0.05;t-=0.08){
        const sx=ax+(x-ax)*t,sz=az+(z-az)*t;
        if(!bots(sx,sz,0.4)){x=sx;z=sz;break}
      }
      if(bots(x,z,0.4))return;
    }
    doel=new THREE.Vector3(x,0,z);
    mark.position.set(x,0.08,z);mark.visible=true;
    lopen=true;
    if(hintEl)hintEl.style.opacity='0.35';
  }
  canvas.addEventListener('pointerdown',tik,{passive:false});

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
    lopen=false;mark.visible=false;
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
      else if(!(opt&&opt.geenNav)){
        setTimeout(()=>{location.href='index.html?open='+encodeURIComponent(d.open)},RMP?80:280);
      }else{
        naarBinnen=false;
      }
    })(t0);
  }
  if(deurBtn)deurBtn.onclick=()=>{const w=dichtstDeur();if(w)naarDeur(w.open)};

  let fps=0,fpsMin=99,frames=0,tFps=performance.now(),laatste=performance.now();
  const klok=new THREE.Clock();

  function cameraPlek(out){
    const facing=held.rotation.y;
    const sx=Math.sin(facing), cz=Math.cos(facing);
    // camOff.z is negatief (achter), camOff.x is naar rechts over de schouder
    out.set(
      held.position.x+sx*camOff.z+cz*camOff.x,
      held.position.y+camOff.y,
      held.position.z+cz*camOff.z-sx*camOff.x
    );
    return out;
  }
  function kijkPunt(out){
    const facing=held.rotation.y;
    out.set(
      held.position.x+Math.sin(facing)*kijkVooruit,
      held.position.y+1.15,
      held.position.z+Math.cos(facing)*kijkVooruit
    );
    return out;
  }
  function volgCamera(dt){
    const ideal=cameraPlek(TMP);
    const ox=held.position.x, oy=held.position.y+1.45, oz=held.position.z;
    let bx=ox,by=oy,bz=oz;
    for(let i=1;i<=12;i++){
      const t=i/12;
      const px=ox+(ideal.x-ox)*t, py=oy+(ideal.y-oy)*t, pz=oz+(ideal.z-oz)*t;
      if(botsCam(px,py,pz))break;
      bx=px;by=py;bz=pz;
    }
    if(Math.hypot(bx-ox,bz-oz)<1.6)by=Math.max(by,oy+0.7);
    if(by<1.15)by=1.15;
    camPos.lerp(TMP.set(bx,by,bz),1-Math.exp(-4.2*dt));
    camera.position.copy(camPos);
    camera.lookAt(kijkPunt(LOOK));
  }

  function tic(){
    const now=performance.now();
    let dt=Math.min(0.05,(now-laatste)/1000);laatste=now;
    const t=klok.getElapsedTime();
    if(lopen&&doel&&!naarBinnen){
      const dx=doel.x-held.position.x,dz=doel.z-held.position.z;
      const len=Math.hypot(dx,dz);
      if(len<0.12){lopen=false;mark.visible=false}
      else{
        const stap=Math.min(snelheid*dt,len);
        const [nx,nz]=schuif(held.position.x,held.position.z,dx/len*stap,dz/len*stap);
        if(nx===held.position.x&&nz===held.position.z){lopen=false;mark.visible=false}
        else{
          held.position.x=nx;held.position.z=nz;
          const gewenst=Math.atan2(dx,dz);
          let d=gewenst-held.rotation.y;
          while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;
          held.rotation.y+=d*Math.min(1,10*dt);
          loopT+=dt;
        }
      }
    }
    const zwab=(!RMP&&lopen)?Math.sin(loopT*10)*0.035:0;
    kop.position.y=1.38+zwab;
    kop.rotation.y=-0.78;
    kraag.position.y=1.14+zwab;sjaal.position.y=1.16+zwab;
    if(!RMP){
      const zwaai=lopen?Math.sin(loopT*8)*0.5:0;
      armL.rotation.x=zwaai;armR.rotation.x=-zwaai;
      sjaalL.rotation.x=lopen?Math.sin(loopT*8)*0.15:0;
      sjaalR.rotation.x=lopen?Math.sin(loopT*8+1)*0.18:0;
      schoenL.position.z=0.04+(lopen?Math.sin(loopT*8)*0.05:0);
      schoenR.position.z=0.04+(lopen?Math.sin(loopT*8+Math.PI)*0.05:0);
      water1.position.y=0.58+Math.sin(t*1.8)*0.012;
      water2.position.y=1.84+Math.sin(t*2.3)*0.016;
      if(T.rimpel){T.rimpel.offset.x=t*0.04;T.rimpel.offset.y=Math.sin(t*0.7)*0.03}
      straal.scale.y=1+Math.sin(t*4.2)*0.16;
      straal.position.y=2.35+Math.sin(t*4.2)*0.04;
      sproei.position.y=2.82+Math.sin(t*4.2)*0.06;
      sproei.scale.setScalar(0.85+Math.sin(t*6)*0.2);
      plons.scale.set(1+Math.sin(t*5)*0.25,1,1+Math.sin(t*5)*0.25);
      plons.material.opacity=0.35+Math.sin(t*5)*0.2;
      druppels.forEach((d,i)=>{
        const u=(t*0.55+d.userData.fase)%1;
        const a=i/12*Math.PI*2;
        const uit=0.08+u*0.22;
        d.position.set(fx+Math.cos(a)*uit,2.75-u*1.05-u*u*0.55,fz+Math.sin(a)*uit);
        d.scale.setScalar(1.1-u*0.6);
        d.material.opacity=0.8-u*0.7;
      });
      zon.intensity=1.42+Math.sin(t*2.1)*0.05+Math.sin(t*6.5)*0.02;
      gloed.material.opacity=0.4+Math.sin(t*2.4)*0.18;
      ven.material.opacity=0.45+Math.sin(t*1.7)*0.15;
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
    volgCamera(dt);
    zetDeurKaart();
    renderer.render(scene,camera);
    frames++;
    if(now-tFps>=1000){
      fps=Math.round(frames*1000/(now-tFps));
      fpsMin=Math.min(fpsMin,fps);
      frames=0;tFps=now;
      if(fpsEl)fpsEl.textContent=fps+' fps';
    }
    requestAnimationFrame(tic);
  }

  cameraPlek(camPos);
  camera.position.copy(camPos);
  camera.lookAt(kijkPunt(LOOK));
  requestAnimationFrame(tic);

  function zetPlek(plek){
    const P={
      poort:{x:0,z:6.2,y:0},
      pad:{x:0,z:10.2,y:0},
      fontein:{x:1.6,z:17.0,y:Math.atan2(-4.6-1.6,14.2-17.0)+0.2},
      deur:{x:0,z:26.4,y:0},
      kas:{x:0,z:26.4,y:0},
      hagrid:{x:-13.0,z:14.0,y:-Math.PI/2},
      hal:{x:13.0,z:14.0,y:Math.PI/2}
    }[plek]||{x:0,z:6.2,y:0};
    held.position.set(P.x,0,P.z);
    held.rotation.y=P.y;
    lopen=false;doel=null;mark.visible=false;
    cameraPlek(camPos);
    if(botsCam(camPos.x,camPos.y,camPos.z)){
      camPos.set(held.position.x+0.4,held.position.y+2.1,held.position.z-2.2);
    }
    camera.position.copy(camPos);
    camera.lookAt(kijkPunt(LOOK));
    zetDeurKaart();
    renderer.render(scene,camera);
  }

  window.ZW_TUIN={
    fps:()=>fps,
    fpsMin:()=>fpsMin,
    pos:()=>({x:+held.position.x.toFixed(2),z:+held.position.z.toFixed(2)}),
    zet:zetPlek,
    loopNaar(x,z){doel=new THREE.Vector3(x,0,z);mark.position.set(x,0.08,z);mark.visible=true;lopen=true},
    naarDeur,
    melding:(id)=>naarDeur(id||'kas',{geenNav:true}),
    sluitMelding:()=>{if(overgang){overgang.classList.remove('aan');overgang.hidden=true}naarBinnen=false}
  };
})();
