const C='zweinstein-v139';
const F=["./", "index.html", "manifest.json", "CREDITS.txt", "bundel.css", "bundel.js", "img/icoon-192.png", "img/icoon-512.png", "img/lakzegel.webp", "img/sneeuwuil.webp", "img/perkament.webp", "img/perkament-sm.webp", "img/sterrenhemel-sm.webp", "img/hal-zaal-sm.webp", "img/ui/nav-hal-96.webp", "img/ui/nav-kaart-96.webp", "img/ui/nav-kassen-96.webp", "img/ui/nav-boek-96.webp", "img/ui/nav-meer-96.webp", "img/ui/nav-vrienden-96.webp", "img/ui/schild-64.webp", "img/smekkies/zak-half-128.webp", "img/laadschermen/herbologie-klein.webp"];
self.addEventListener('install',e=>e.waitUntil((async()=>{
  const c=await caches.open(C);
  for(const u of F)await c.add(new Request(u,{cache:'reload'})).catch(()=>0);
  await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  const k=await caches.keys();
  await Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)));
  const cs=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  await self.clients.claim();
  for(const cl of cs){if(cl.url.startsWith(self.registration.scope)){try{await cl.navigate(cl.url)}catch(err){}}}
})()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||e.request.url.includes('open-meteo')||e.request.url.includes('.supabase.co'))return;
  e.respondWith((async()=>{
    const hit=await caches.match(e.request);
    if(hit)return hit;
    const x=await fetch(e.request);
    if(x&&x.ok&&e.request.url.startsWith(self.registration.scope)){
      const c=await caches.open(C);
      c.put(e.request,x.clone());
    }
    return x;
  })());
});
