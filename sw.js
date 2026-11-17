const C='zweinstein-v255';
const F=["./", "index.html", "manifest.json", "CREDITS.txt", "bundel.css", "bundel.js", "img/icoon-192.png", "img/icoon-512.png", "img/ui/kasteelframe-320.webp", "img/lakzegel.webp", "img/sneeuwuil.webp", "img/perkament.webp", "img/perkament-sm.webp", "img/sterrenhemel-sm.webp", "img/hal-zaal-sm.webp", "img/ui/nav-hal-96.webp", "img/ui/nav-kaart-96.webp", "img/ui/nav-kassen-96.webp", "img/ui/nav-boek-96.webp", "img/ui/nav-meer-96.webp", "img/ui/nav-vrienden-96.webp", "img/ui/schild-64.webp", "img/smekkies/zak-half-128.webp", "img/laadschermen/herbologie-klein.webp", "tuin3d.html", "tuin3d.js", "tuin3d.css", "vendor/three.min.js","vendor/GLTFLoader.min.js", "assets/tuin3d/luna.glb", "assets/tuin3d/gargoyle.glb", "assets/tuin3d/dieren/hond.glb", "assets/tuin3d/dieren/kat.glb", "assets/tuin3d/dieren/vos.glb", "assets/tuin3d/dieren/arend.glb", "assets/tuin3d/dieren/kuiken.glb", "assets/tuin3d/tex/gras.webp", "assets/tuin3d/tex/kassei.webp", "assets/tuin3d/tex/kassei-n.webp", "assets/tuin3d/tex/zandsteen.webp", "assets/tuin3d/tex/zandsteen-n.webp", "assets/tuin3d/tex/leisteen.webp", "assets/tuin3d/tex/haag.webp", "assets/tuin3d/tex/steen.webp"];
const KRITIEK=["./","index.html","bundel.js","bundel.css"];
async function zetIn(c,u){
  for(let i=0;i<3;i++){
    try{await c.add(new Request(u,{cache:'reload'}));return true}catch(e){if(i===2)return false}
  }
  return false;
}
self.addEventListener('install',e=>e.waitUntil((async()=>{
  const c=await caches.open(C);
  const fout=[];
  for(const u of F){if(!await zetIn(c,u))fout.push(u)}
  if(fout.some(u=>KRITIEK.includes(u)))throw new Error('cache onvolledig: '+fout.join(','));
  await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  const k=await caches.keys();
  const oud=k.filter(x=>x!==C);
  await Promise.all(oud.map(x=>caches.delete(x)));
  await self.clients.claim();
  if(oud.length){
    const cs=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const cl of cs){if(cl.url.startsWith(self.registration.scope)){try{await cl.navigate(cl.url)}catch(err){}}}
  }
})()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||e.request.url.includes('open-meteo')||e.request.url.includes('.supabase.co'))return;
  e.respondWith((async()=>{
    const nav=e.request.mode==='navigate'||e.request.destination==='document';
    const uitCache=async()=>{
      const a=await caches.match(e.request,{ignoreSearch:true});
      if(a)return a;
      if(nav)return (await caches.match('./',{ignoreSearch:true}))||(await caches.match('index.html',{ignoreSearch:true}));
      return null;
    };
    const hit=await uitCache();
    if(hit)return hit;
    try{
      const x=await fetch(e.request);
      if(x&&x.ok&&e.request.url.startsWith(self.registration.scope)){
        const c=await caches.open(C);
        try{c.put(e.request,x.clone())}catch(err){}
      }
      return x;
    }catch(err){
      const fb=await uitCache();
      if(fb)return fb;
      throw err;
    }
  })());
});
