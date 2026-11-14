/* v160: 3D-testtuin naar Kas Drie. Zelfgemaakte low-poly geometrie, geen EA/Warner-assets. */
(function(){
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('tuin');
  const hintEl = $('hint');
  const fpsEl = $('fps');
  const deurKaart = $('deurkaart');
  const deurBtn = $('deurbtn');
  const melding = $('testmelding');
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
    noGl.hidden=false;
    canvas.style.display='none';
    return;
  }
  const THREE=window.THREE;

  const RMP=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}})();
  const TARGET=new THREE.Vector3();
  const TMP=new THREE.Vector3();
  const TMP2=new THREE.Vector3();
  const LOOK=new THREE.Vector3();

  function tex(teken, maat, herhaal){
    const c=document.createElement('canvas');
    c.width=c.height=maat||128;
    const g=c.getContext('2d');
    teken(g,c.width);
    const t=new THREE.CanvasTexture(c);
    t.wrapS=t.wrapT=THREE.RepeatWrapping;
    t.magFilter=THREE.LinearFilter;
    t.minFilter=THREE.LinearMipmapLinearFilter;
    t.anisotropy=1;
    if(herhaal)t.repeat.set(herhaal[0],herhaal[1]);
    t.needsUpdate=true;
    return t;
  }
  function rnd(s){s=Math.sin(s*127.1+311.7)*43758.5453;return s-Math.floor(s)}

  const T={
    gras: tex((g,n)=>{
      g.fillStyle='#3d6a22';g.fillRect(0,0,n,n);
      for(let i=0;i<900;i++){
        const x=rnd(i+1)*n,y=rnd(i+9)*n,s=1+rnd(i+3)*2;
        g.fillStyle=rnd(i+7)>.55?'#4e7e28':'#2f5418';
        g.fillRect(x,y,s,s+1);
      }
      for(let i=0;i<40;i++){
        g.fillStyle=rnd(i+40)>.5?'#c9a227':'#8a3a2a';
        g.fillRect(rnd(i+11)*n,rnd(i+17)*n,1.4,1.4);
      }
    },128,[14,18]),
    haag: tex((g,n)=>{
      g.fillStyle='#2d5a22';g.fillRect(0,0,n,n);
      for(let i=0;i<1400;i++){
        const x=rnd(i+2)*n,y=rnd(i+5)*n;
        g.fillStyle=rnd(i+8)>.5?'#3f7230':'#234a1a';
        g.fillRect(x,y,2,2);
      }
      g.fillStyle='rgba(160,190,80,.16)';
      for(let x=0;x<n;x+=8)g.fillRect(x,0,1,n);
    },128,[2,3]),
    steen: tex((g,n)=>{
      g.fillStyle='#6d634f';g.fillRect(0,0,n,n);
      const cell=32;
      for(let y=0;y<n;y+=cell){
        for(let x=0;x<n;x+=cell){
          const v=rnd(x*3+y*7);
          g.fillStyle=v>.5?'#b7aa8d':'#a3967a';
          g.fillRect(x+2,y+2,cell-4,cell-4);
          g.fillStyle='rgba(255,255,255,.08)';
          g.fillRect(x+3,y+3,cell-8,4);
        }
      }
    },128,[1,2]),
    pad: tex((g,n)=>{
      g.fillStyle='#7a6d58';g.fillRect(0,0,n,n);
      const cell=32;
      for(let y=0;y<n;y+=cell){
        const off=(Math.floor(y/cell)%2)*(cell/2);
        for(let x=-cell;x<n;x+=cell){
          const v=rnd(x*5+y*3+2);
          g.fillStyle=v>.6?'#d4c4a0':v>.3?'#c4b28c':'#b5a47a';
          g.fillRect(x+off+2,y+2,cell-4,cell-4);
        }
      }
    },128,[2,10]),
    sokkel: tex((g,n)=>{
      g.fillStyle='#8e8676';g.fillRect(0,0,n,n);
      for(let i=0;i<300;i++){
        g.fillStyle=rnd(i)>.5?'#a39b8a':'#7a7366';
        g.fillRect(rnd(i+3)*n,rnd(i+8)*n,3,2);
      }
      g.strokeStyle='rgba(40,30,20,.25)';g.lineWidth=2;
      g.strokeRect(2,2,n-4,n-4);
    },128,[2,2]),
    lucht: tex((g,n)=>{
      const lg=g.createLinearGradient(0,0,0,n);
      lg.addColorStop(0,'#6ea8d8');
      lg.addColorStop(.45,'#7eb4e0');
      lg.addColorStop(.75,'#9cc6e6');
      lg.addColorStop(1,'#c4dce8');
      g.fillStyle=lg;g.fillRect(0,0,n,n);
      for(let i=0;i<9;i++){
        const x=rnd(i+21)*n,y=rnd(i+4)*n*.45+n*.08,w=40+rnd(i+8)*80,h=16+rnd(i+6)*22;
        g.fillStyle='rgba(255,255,255,'+(0.55+rnd(i+2)*0.3)+')';
        g.beginPath();g.ellipse(x,y,w,h,0,0,Math.PI*2);g.fill();
        g.fillStyle='rgba(255,255,255,.35)';
        g.beginPath();g.ellipse(x-w*.2,y+h*.15,w*.6,h*.55,0,0,Math.PI*2);g.fill();
      }
    },256,[1,1]),
    wolk: tex((g,n)=>{
      g.clearRect(0,0,n,n);
      g.fillStyle='rgba(255,255,255,.92)';
      g.beginPath();g.ellipse(n*.5,n*.55,n*.36,n*.22,0,0,Math.PI*2);g.fill();
      g.beginPath();g.ellipse(n*.32,n*.52,n*.22,n*.16,0,0,Math.PI*2);g.fill();
      g.beginPath();g.ellipse(n*.68,n*.5,n*.24,n*.18,0,0,Math.PI*2);g.fill();
      g.fillStyle='rgba(230,236,245,.7)';
      g.beginPath();g.ellipse(n*.5,n*.66,n*.3,n*.12,0,0,Math.PI*2);g.fill();
    },128),
    bord: tex((g,n)=>{
      g.fillStyle='#24331a';g.fillRect(0,0,n,n);
      g.strokeStyle='#e6c25a';g.lineWidth=14;g.strokeRect(10,10,n-20,n-20);
      g.fillStyle='#ffe9a0';
      g.font='bold 56px Georgia,serif';
      g.textAlign='center';g.textBaseline='middle';
      g.fillText('KAS DRIE',n/2,n/2+4);
    },256),
    glas: tex((g,n)=>{
      g.fillStyle='#9ec9a8';g.fillRect(0,0,n,n);
      g.strokeStyle='rgba(40,60,40,.45)';g.lineWidth=4;
      for(let i=0;i<=4;i++){g.beginPath();g.moveTo(i*n/4,0);g.lineTo(i*n/4,n);g.stroke()}
      for(let i=0;i<=6;i++){g.beginPath();g.moveTo(0,i*n/6);g.lineTo(n,i*n/6);g.stroke()}
      g.fillStyle='rgba(255,255,255,.22)';g.fillRect(8,8,n*.25,n*.18);
    },128),
    bloem: tex((g,n)=>{
      g.fillStyle='#355c1c';g.fillRect(0,0,n,n);
      for(let i=0;i<80;i++){
        const kleuren=['#c9a227','#d46a2c','#e8e0c0','#7a1f10'];
        g.fillStyle=kleuren[i%kleuren.length];
        g.beginPath();g.arc(rnd(i+2)*n,rnd(i+9)*n,1.6+rnd(i)*1.4,0,Math.PI*2);g.fill();
      }
    },64,[3,2])
  };
  T.wolk.wrapS=T.wolk.wrapT=THREE.ClampToEdgeWrapping;

  const mat={
    gras: new THREE.MeshLambertMaterial({map:T.gras,color:0xffffff}),
    haag: new THREE.MeshLambertMaterial({map:T.haag,color:0x9aaa80}),
    steen: new THREE.MeshLambertMaterial({map:T.steen,color:0xffffff}),
    pad: new THREE.MeshLambertMaterial({map:T.pad,color:0xffffff}),
    sokkel: new THREE.MeshLambertMaterial({map:T.sokkel,color:0xffffff}),
    ijzer: new THREE.MeshLambertMaterial({color:0x1c1c1e}),
    water: new THREE.MeshLambertMaterial({color:0x4a7ea8,transparent:true,opacity:0.62,depthWrite:false}),
    lucht: new THREE.MeshBasicMaterial({map:T.lucht,side:THREE.BackSide,depthWrite:false,fog:false}),
    wolk: new THREE.MeshBasicMaterial({map:T.wolk,transparent:true,depthWrite:false,fog:true,side:THREE.DoubleSide}),
    bord: new THREE.MeshLambertMaterial({map:T.bord}),
    glas: new THREE.MeshLambertMaterial({map:T.glas,transparent:true,opacity:0.55,depthWrite:false,side:THREE.DoubleSide}),
    bloem: new THREE.MeshLambertMaterial({map:T.bloem}),
    huid: new THREE.MeshLambertMaterial({color:0xe6c2a0}),
    haar: new THREE.MeshLambertMaterial({color:0x4a2e18}),
    gewaad: new THREE.MeshLambertMaterial({color:0xd4a017}),
    zwart: new THREE.MeshLambertMaterial({color:0x1a140e}),
    schaduw: new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.28,depthWrite:false})
  };

  const scene=new THREE.Scene();
  scene.background=T.lucht;
  scene.fog=new THREE.Fog(0x9cc6e6,32,85);

  const camera=new THREE.PerspectiveCamera(56,innerWidth/Math.max(1,innerHeight),0.15,120);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:false,alpha:false,powerPreference:'default'});
  renderer.setClearColor(0x6ea8d8,1);
  renderer.setPixelRatio(Math.min(1.15,window.devicePixelRatio||1));
  function maat(){
    const w=innerWidth,h=Math.max(1,innerHeight);
    renderer.setSize(w,h,false);
    camera.aspect=w/h;camera.updateProjectionMatrix();
  }
  maat();
  addEventListener('resize',maat,{passive:true});

  scene.add(new THREE.HemisphereLight(0xc8e4ff,0x5a7a30,1.05));
  const zon=new THREE.DirectionalLight(0xffe2a8,1.35);
  zon.position.set(16,20,10);
  scene.add(zon);
  scene.add(new THREE.AmbientLight(0xfff0c8,0.32));

  const world=new THREE.Group();
  scene.add(world);
  const col=[]; // {minx,maxx,minz,maxz}

  function voeg(mesh,ouder){
    mesh.castShadow=false;mesh.receiveShadow=false;
    (ouder||world).add(mesh);
    return mesh;
  }
  function blok(geo,m,x,y,z,sx,sy,sz,rotY,ouder){
    const mesh=new THREE.Mesh(geo||new THREE.BoxGeometry(sx||1,sy||1,sz||1),m);
    if(sx&&!geo){} else if(sx&&geo){mesh.scale.set(sx,sy||1,sz||1)}
    if(!geo){mesh.position.set(x,y,z)}
    else {mesh.position.set(x,y,z);if(sx)mesh.scale.set(sx,sy,sz)}
    if(!geo)mesh.position.set(x,y,z);
    if(rotY)mesh.rotation.y=rotY;
    return voeg(mesh,ouder);
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
  function muur(x,z,w,d,h,y0){
    h=h||2.35;y0=y0||0;
    box(mat.haag,x,y0+h/2,z,w,h,d);
    col.push({minx:x-w/2,maxx:x+w/2,minz:z-d/2,maxz:z+d/2});
  }
  function solid(x,z,w,d){
    col.push({minx:x-w/2,maxx:x+w/2,minz:z-d/2,maxz:z+d/2});
  }

  /* wolkenborden tegen de lucht */
  const wolken=[];
  [[-10,11,18,2.6],[-2,12,26,3.1],[9,11,20,2.8],[14,10,12,2.2],[-16,12,8,2.5],[4,13,6,2.3]].forEach(([x,y,z,s],i)=>{
    const w=new THREE.Mesh(new THREE.PlaneGeometry(12,6),mat.wolk);
    w.position.set(x,y,z);w.scale.set(s,s,s);
    w.lookAt(0,y-1,z+6);
    wolken.push(w);voeg(w);
  });

  /* grond + pad */
  const grond=new THREE.Mesh(new THREE.PlaneGeometry(48,64),mat.gras);
  grond.rotation.x=-Math.PI/2;grond.position.set(0,-0.01,16);
  voeg(grond);
  const pad=new THREE.Mesh(new THREE.BoxGeometry(3.4,0.06,30),mat.pad);
  pad.position.set(0,0.02,16);
  voeg(pad);
  /* verbreding bij de fontein */
  box(mat.pad,-3.2,0.025,16,5.2,0.05,8);
  /* cirkel bij de fontein */
  const cirkel=new THREE.Mesh(new THREE.CylinderGeometry(2.6,2.6,0.05,16),mat.pad);
  cirkel.position.set(-5.1,0.03,16);
  voeg(cirkel);
  /* perkjes */
  box(mat.bloem,3.1,0.08,10,1.1,0.12,2.2);
  box(mat.bloem,3.1,0.08,22,1.1,0.12,2.2);
  box(mat.bloem,-3.1,0.08,8,1.1,0.12,2.0);

  /* hagen: gang, binnenplaats, gang naar de deur */
  // links startgang
  muur(-2.85,6,1.3,10,2.4);
  muur(2.85,6,1.3,10,2.4);
  // binnenplaats-openingen: hagen wijken
  muur(-8.2,16,1.4,12,2.45);
  muur(-5.4,10.6,5,1.3,2.3);
  muur(-5.4,21.4,5,1.3,2.3);
  muur(8.6,16,1.4,14,2.5);
  // laatste gang
  muur(-2.85,26,1.3,8,2.4);
  muur(2.85,26,1.3,8,2.5);
  // achter de kasdeur, zodat je er niet omheen loopt
  muur(0,33.6,9,1.4,2.6);
  muur(-5.2,31.6,1.4,5,2.5);
  muur(5.2,31.6,1.4,5,2.5);
  // zijwanden ver weg als horizon
  muur(-14,16,1.6,36,2.7);
  muur(12,16,1.6,36,2.6);

  /* een paar bolvormige buxusjes */
  [[-3.6,11.5],[3.6,7.5],[3.55,19.5],[-7.2,13.2]].forEach(([x,z],i)=>{
    cyl(mat.haag,x,0.18,z,0.28,0.28,0.36,8);
    const bol=new THREE.Mesh(new THREE.SphereGeometry(0.48+i*0.04,8,6),mat.haag);
    bol.position.set(x,0.7,z);voeg(bol);
  });

  /* smeedijzeren hek en stenen pilaren bij de ingang */
  function pilaar(x,z){
    cyl(mat.steen,x,0.7,z,0.28,0.24,1.4,8);
    box(mat.steen,x,1.48,z,0.62,0.16,0.62);
    const knop=new THREE.Mesh(new THREE.SphereGeometry(0.13,8,6),mat.steen);
    knop.position.set(x,1.66,z);voeg(knop);
    solid(x,z,0.6,0.6);
  }
  function spijl(x,z,h){
    box(mat.ijzer,x,(h||1.05)/2,z,0.05,h||1.05,0.05);
  }
  function hekstuk(x0,z0,x1,z1,n){
    n=n||5;
    for(let i=0;i<=n;i++){
      const t=i/n;
      spijl(x0+(x1-x0)*t,z0+(z1-z0)*t,1.05+((i%2)?0.12:0));
    }
    const mx=(x0+x1)/2,mz=(z0+z1)/2,dx=x1-x0,dz=z1-z0,len=Math.hypot(dx,dz),ang=Math.atan2(dx,dz);
    const rail=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.05,len),mat.ijzer);
    rail.position.set(mx,0.55,mz);rail.rotation.y=ang;voeg(rail);
    const rail2=rail.clone();rail2.position.y=0.95;voeg(rail2);
  }
  pilaar(-2.15,1.4);pilaar(2.15,1.4);
  pilaar(-5.4,1.4);pilaar(5.4,1.4);
  hekstuk(-5.1,1.4,-2.45,1.4,7);
  hekstuk(2.45,1.4,5.1,1.4,7);
  // open poortvleugels
  function vleugel(x,z,rot){
    const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;world.add(g);
    for(let i=0;i<6;i++){
      const s=new THREE.Mesh(new THREE.BoxGeometry(0.05,1.15,0.05),mat.ijzer);
      s.position.set(0.12+i*0.22,0.62,0);g.add(s);
    }
    const dwars=new THREE.Mesh(new THREE.BoxGeometry(1.3,0.05,0.05),mat.ijzer);
    dwars.position.set(0.7,0.5,0);g.add(dwars);
    const dwars2=dwars.clone();dwars2.position.y=1.0;g.add(dwars2);
    const boog=new THREE.Mesh(new THREE.TorusGeometry(0.65,0.04,6,10,Math.PI),mat.ijzer);
    boog.position.set(0.7,1.15,0);boog.rotation.z=Math.PI;g.add(boog);
  }
  vleugel(-2.15,1.55,-1.05);
  vleugel(2.15,1.55,1.05+Math.PI);
  (function(){
    const g=new THREE.Group();g.position.set(0,0,1.45);world.add(g);
    // halve boog in het X-Y-vlak, over het pad
    const boog=new THREE.Mesh(new THREE.TorusGeometry(2.15,0.07,6,20,Math.PI),mat.ijzer);
    boog.position.set(0,1.7,0);g.add(boog);
    for(let i=1;i<=7;i++){
      const a=Math.PI*i/8;
      const sp=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.2,4),mat.ijzer);
      sp.position.set(Math.cos(a)*2.15,1.7+Math.sin(a)*2.15,0);
      sp.rotation.z=a-Math.PI/2;
      g.add(sp);
    }
  })();


  /* extra pilaren langs de binnenplaats */
  pilaar(-2.2,11.9);pilaar(2.2,11.9);
  pilaar(-2.2,20.2);pilaar(2.2,20.2);
  (function(){
    const g=new THREE.Group();g.position.set(0,0,11.9);world.add(g);
    const boog=new THREE.Mesh(new THREE.TorusGeometry(2.2,0.07,6,20,Math.PI),mat.ijzer);
    boog.position.set(0,1.7,0);g.add(boog);
    for(let i=1;i<=7;i++){
      const a=Math.PI*i/8;
      const sp=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.2,4),mat.ijzer);
      sp.position.set(Math.cos(a)*2.2,1.7+Math.sin(a)*2.2,0);
      sp.rotation.z=a-Math.PI/2;g.add(sp);
    }
  })();

  // opening in het hek op het pad: twee korte stukken i.p.v. een gesloten lijn — al gedaan? het pad moet door. Skip the center of that fence.
  // Oops I just closed the path at z=11.9. Remove that full hekstuk and only put side bits? The path is at x=-1.7..1.7. I'll leave pillars only, no fence across the path.
  // Can't easily un-add. I'll move those fence bars... actually I already called hekstuk across the path. Need to not do that.
  // I'll fix after if I notice - better rewrite that part. For now I'll hide those rails by not including the center. Let me not call hekstuk across the path - I'll fix the file if I already wrote it.
  // I DID call hekstuk(-2.15,11.9,2.15,11.9,8) - that blocks the path visually (bars) but not in collision (spijl doesn't add col). Player would walk through bars. Looks wrong.
  // I'll fix this after writing by patching that call out... I'll handle in a post-pass. Let me remember to remove that hekstuk line.

  /* fontein */
  const fx=-5.1,fz=16;
  cyl(mat.sokkel,fx,0.18,fz,1.55,1.55,0.36,8);
  cyl(mat.sokkel,fx,0.48,fz,1.42,1.50,0.28,8);
  cyl(mat.sokkel,fx,0.9,fz,0.28,0.32,0.9,8);
  cyl(mat.sokkel,fx,1.4,fz,0.55,0.55,0.16,8);
  const kom=new THREE.Mesh(new THREE.CylinderGeometry(0.62,0.5,0.22,8),mat.sokkel);
  kom.position.set(fx,1.52,fz);voeg(kom);
  const water1=new THREE.Mesh(new THREE.CircleGeometry(1.28,16),mat.water);
  water1.rotation.x=-Math.PI/2;water1.position.set(fx,0.58,fz);voeg(water1);
  const water2=new THREE.Mesh(new THREE.CircleGeometry(0.46,12),mat.water);
  water2.rotation.x=-Math.PI/2;water2.position.set(fx,1.64,fz);voeg(water2);
  const straal=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.06,0.55,6),mat.water);
  straal.position.set(fx,1.95,fz);voeg(straal);
  solid(fx,fz,2.6,2.6);

  /* Kas Drie – alleen de gevel met deur, geen kas-interieur */
  const gevel=new THREE.Group();
  gevel.position.set(0,0,31.2);
  gevel.rotation.y=Math.PI;
  world.add(gevel);
  // sokkel / stenen plint
  box(mat.steen,0,0.2,0,6.2,0.4,0.7,0,gevel);
  // dichte achterwand, zodat de gevel geen leeg gat is (geen interieur)
  const achter=new THREE.Mesh(new THREE.PlaneGeometry(6.4,5.2),new THREE.MeshLambertMaterial({color:0x24361c,side:THREE.DoubleSide}));
  achter.position.set(0,2.5,-0.28);gevel.add(achter);
  // ijzeren stijlen van de gevel
  [-3,-1.5,0,1.5,3].forEach(x=>{
    box(mat.ijzer,x,2.1,0,0.12,3.8,0.16,0,gevel);
  });
  box(mat.ijzer,0,4.05,0,6.2,0.14,0.16,0,gevel);
  box(mat.ijzer,0,0.45,0,6.2,0.14,0.16,0,gevel);
  box(mat.ijzer,-3.05,2.1,0,0.14,3.8,0.16,0,gevel);
  box(mat.ijzer,3.05,2.1,0,0.14,3.8,0.16,0,gevel);
  // horizontale roeden
  [1.2,2.2,3.1].forEach(y=>box(mat.ijzer,0,y,0,6.1,0.08,0.08,0,gevel));
  // glasvlakken naast de deur
  const glasL=new THREE.Mesh(new THREE.PlaneGeometry(2.2,3.4),mat.glas);
  glasL.position.set(-1.95,2.15,0.06);gevel.add(glasL);
  const glasR=glasL.clone();glasR.position.x=1.95;gevel.add(glasR);
  // een hint van een zadeldak-gevel (alleen de voorrand, geen gebouw)
  const dak=new THREE.Mesh(new THREE.ConeGeometry(3.5,1.3,4),mat.glas);
  dak.position.set(0,4.75,0);dak.rotation.y=Math.PI/4;gevel.add(dak);
  box(mat.ijzer,0,4.55,0,0.1,1.2,0.1,0,gevel);
  // deur
  box(mat.ijzer,0,1.55,0.08,1.15,2.5,0.08,0,gevel);
  const deurPlaat=new THREE.Mesh(new THREE.BoxGeometry(1.08,2.35,0.07),new THREE.MeshLambertMaterial({color:0x3a4f30}));
  deurPlaat.position.set(0,1.5,0.13);gevel.add(deurPlaat);
  const deurLijst=new THREE.Mesh(new THREE.BoxGeometry(1.18,2.45,0.05),new THREE.MeshLambertMaterial({color:0xc9a227}));
  deurLijst.position.set(0,1.5,0.10);gevel.add(deurLijst);
  const deurGlas=new THREE.Mesh(new THREE.PlaneGeometry(0.38,0.7),mat.glas);
  [[-0.22,2.05],[0.22,2.05],[-0.22,1.25],[0.22,1.25]].forEach(([x,y])=>{
    const r=deurGlas.clone();r.position.set(x,y,0.16);gevel.add(r);
  });

  box(mat.ijzer,0,1.55,0.08,0.06,2.5,0.1,0,gevel);
  box(mat.ijzer,0,2.1,0.08,1.15,0.06,0.1,0,gevel);
  const klink=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),new THREE.MeshLambertMaterial({color:0xc9a227}));
  klink.position.set(0.42,1.35,0.18);gevel.add(klink);
  // naambord
  mat.bord=new THREE.MeshBasicMaterial({map:T.bord,side:THREE.DoubleSide});
  const bord=new THREE.Mesh(new THREE.PlaneGeometry(2.1,0.6),mat.bord);
  bord.position.set(0,2.85,0.32);gevel.add(bord);
  solid(0,31.4,6.4,0.9);

  /* personage in Huffelpuf-gewaad */
  const held=new THREE.Group();
  held.position.set(0,0,6.0);
  scene.add(held);
  const gewaad=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.28,1.05,8),mat.gewaad);
  gewaad.position.y=0.62;held.add(gewaad);
  const zoom=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.29,0.12,8),mat.zwart);
  zoom.position.y=0.16;held.add(zoom);
  const kraag=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.17,0.16,8),mat.zwart);
  kraag.position.y=1.1;held.add(kraag);
  const hoofd=new THREE.Mesh(new THREE.SphereGeometry(0.16,8,6),mat.huid);
  hoofd.position.y=1.34;held.add(hoofd);
  const haar=new THREE.Mesh(new THREE.SphereGeometry(0.17,8,6),mat.haar);
  haar.position.set(0,1.40,-0.01);haar.scale.set(1,0.8,0.95);held.add(haar);
  const oogM=new THREE.MeshLambertMaterial({color:0x1a140e});
  const oogL=new THREE.Mesh(new THREE.SphereGeometry(0.03,6,5),oogM);
  oogL.position.set(-0.055,1.36,0.14);held.add(oogL);
  const oogR=oogL.clone();oogR.position.x=0.055;held.add(oogR);
  const sjaal=new THREE.Mesh(new THREE.TorusGeometry(0.16,0.04,6,10),new THREE.MeshLambertMaterial({color:0x1a140e}));
  sjaal.position.set(0,1.14,0);sjaal.rotation.x=Math.PI/2;held.add(sjaal);
  const sjaalStaart=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.35,0.04),mat.gewaad);
  sjaalStaart.position.set(0.12,0.92,0.16);held.add(sjaalStaart);
  const armG=new THREE.Group();armG.position.set(0,1.02,0);held.add(armG);
  const armL=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.55,0.09),mat.gewaad);
  armL.position.set(-0.24,-0.18,0);armG.add(armL);
  const armR=armL.clone();armR.position.x=0.24;armG.add(armR);
  const schaduw=new THREE.Mesh(new THREE.CircleGeometry(0.38,10),mat.schaduw);
  schaduw.rotation.x=-Math.PI/2;schaduw.position.y=0.04;held.add(schaduw);

  const mark=new THREE.Mesh(new THREE.RingGeometry(0.22,0.34,16),new THREE.MeshBasicMaterial({color:0xe6c25a,transparent:true,opacity:0.85,side:THREE.DoubleSide,depthWrite:false}));
  mark.rotation.x=-Math.PI/2;mark.visible=false;scene.add(mark);

  const deurPunt=new THREE.Vector3(0,0,29.4);
  const startPunt=new THREE.Vector3(0,0,6.0);
  let doel=null,lopen=false,loopT=0;
  const snelheid=2.25;
  const camOff=new THREE.Vector3(0,2.05,-6.2);
  const camPos=new THREE.Vector3(0,3.6,-1.2);
  camera.position.copy(camPos);
  held.rotation.y=0; // kijkt naar +Z

  function bots(x,z,r){
    r=r||0.32;
    if(x<-10||x>8||z<1.1||z>31.0)return true;
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

  const ray=new THREE.Raycaster();
  const muis=new THREE.Vector2();
  const grondHits=[grond,pad,cirkel];
  function tik(ev){
    if(ev.target&&ev.target.closest&&ev.target.closest('a,button,#testmelding,#nowebgl'))return;
    if(!melding.hidden)return;
    ev.preventDefault&&ev.preventDefault();
    const r=canvas.getBoundingClientRect();
    const cx=ev.clientX??(ev.touches&&ev.touches[0].clientX);
    const cy=ev.clientY??(ev.touches&&ev.touches[0].clientY);
    muis.x=((cx-r.left)/r.width)*2-1;
    muis.y=-((cy-r.top)/r.height)*2+1;
    ray.setFromCamera(muis,camera);
    const deurHit=ray.intersectObject(gevel,true);
    const dist=held.position.distanceTo(deurPunt);
    if(deurHit.length&&deurHit[0].distance<18&&dist<3.4){
      openMelding();return;
    }
    const hits=ray.intersectObjects(grondHits,true);
    if(!hits.length)return;
    const p=hits[0].point;
    let x=p.x,z=p.z;
    // als het punt in een muur valt, schuif naar de speler toe tot het vrij is
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
    hintEl.style.opacity='0.35';
  }
  canvas.addEventListener('pointerdown',tik,{passive:false});

  function dichtBijDeur(){return held.position.distanceTo(deurPunt)<3.2}
  function zetDeurKaart(){
    const aan=dichtBijDeur();
    deurKaart.hidden=!aan;
    if(aan)hintEl.hidden=true;
    else hintEl.hidden=false;
  }
  function openMelding(){melding.hidden=false}
  $('sluitmelding').onclick=()=>{melding.hidden=true};
  deurBtn.onclick=()=>openMelding();

  let fps=0,fpsMin=99,frames=0,tFps=performance.now();
  let laatste=performance.now();
  const klok=new THREE.Clock();

  function volgCamera(dt){
    const facing=held.rotation.y;
    const ix=held.position.x+Math.sin(facing)*camOff.z;
    const iz=held.position.z+Math.cos(facing)*camOff.z;
    const iy=held.position.y+camOff.y;
    camPos.lerp(TMP.set(ix,iy,iz),1-Math.exp(-3.2*dt));
    // voorkom dat de camera onder de grond zakt
    if(camPos.y<1.2)camPos.y=1.2;
    camera.position.copy(camPos);
    LOOK.set(held.position.x,held.position.y+1.28,held.position.z);
    camera.lookAt(LOOK);
  }

  function tic(){
    const now=performance.now();
    let dt=Math.min(0.05,(now-laatste)/1000);laatste=now;
    const t=klok.getElapsedTime();
    if(lopen&&doel){
      const dx=doel.x-held.position.x,dz=doel.z-held.position.z;
      const len=Math.hypot(dx,dz);
      if(len<0.12){
        lopen=false;mark.visible=false;
      }else{
        const stap=Math.min(snelheid*dt,len);
        const vx=dx/len*stap,vz=dz/len*stap;
        const [nx,nz]=schuif(held.position.x,held.position.z,vx,vz);
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
    const zwab=(!RMP&&lopen)?Math.sin(loopT*10)*0.03:0;
    gewaad.position.y=0.62;
    held.children; // no-op
    hoofd.position.y=1.34+zwab;
    haar.position.y=1.40+zwab;
    kraag.position.y=1.1+zwab;
    if(!RMP){
      const zwaai=lopen?Math.sin(loopT*8)*0.45:0;
      armL.rotation.x=zwaai;armR.rotation.x=-zwaai;
      water1.position.y=0.58+Math.sin(t*1.6)*0.015;
      water2.position.y=1.64+Math.sin(t*2.1)*0.02;
      straal.scale.y=1+Math.sin(t*3)*0.12;
    }
    if(mark.visible)mark.material.opacity=0.45+Math.sin(t*4)*0.3;
    wolken.forEach((w,i)=>{w.position.x+=Math.sin(t*0.05+i)*0.002});
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

  /* startcamera netjes achter de held */
  camPos.set(0,3.2,-0.2);
  camera.position.copy(camPos);
  camera.lookAt(0,1.3,6.0);
  requestAnimationFrame(tic);

  /* test-API voor screenshots, raakt geen save */
  window.ZW_TUIN={
    fps:()=>fps,
    fpsMin:()=>fpsMin,
    pos:()=>({x:+held.position.x.toFixed(2),z:+held.position.z.toFixed(2)}),
    zet(plek){
      const P={
        poort:{x:0,z:6.0,y:0},
        pad:{x:0,z:10.5,y:0},
        fontein:{x:-0.2,z:15.6,y:-1.05},
        deur:{x:0,z:26.8,y:0}
      }[plek]||{x:0,z:4.2,y:0};
      held.position.set(P.x,0,P.z);
      held.rotation.y=P.y;
      lopen=false;doel=null;mark.visible=false;
      const facing=held.rotation.y;
      camPos.set(
        held.position.x+Math.sin(facing)*camOff.z,
        held.position.y+camOff.y,
        held.position.z+Math.cos(facing)*camOff.z
      );
      camera.position.copy(camPos);
      camera.lookAt(held.position.x,held.position.y+1.15,held.position.z);
      zetDeurKaart();
      renderer.render(scene,camera);
    },
    loopNaar(x,z){doel=new THREE.Vector3(x,0,z);mark.position.set(x,0.08,z);mark.visible=true;lopen=true},
    melding:openMelding,
    sluitMelding:()=>{melding.hidden=true}
  };
})();
