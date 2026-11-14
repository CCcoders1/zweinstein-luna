const C='zweinstein-v134';
const F=["./", "index.html", "manifest.json", "CREDITS.txt", "style.css", "extra.css", "polish.css", "donker.css", "kern.css", "licht.css", "halloween.css", "sfeer.css", "wachtrij.js", "fx.js", "reserve.js", "app.js", "economie.js", "lessen.js", "extra.js", "kaarten.js", "polish.js", "buit.js", "match3.js", "m3kunst.js", "kern.js", "kweek.js", "kas2.js", "elfjes.js", "laadscherm.js", "flits.js", "smekkies.js", "ui.js", "vakken.js", "doelen.js", "balans-data.js", "balans.js", "backup.js", "powerups.js", "kasplus.js", "personages.js", "spelbg.js", "plaag.js", "schooldagen.js", "fopshop.js", "pompoen.js", "kruidwinkel.js", "geluid.js", "spreuk.js", "ketel.js", "huispunten.js", "bonuskamer.js", "flesjes.js", "verloop.js", "minigames.js", "mijlpaal.js", "config-online.js", "vrienden.js", "speellog.js", "halloween.js", "versie.js", "feest.js", "kastaken.js", "kweekvolg.js", "samenhang.js", "sfeer.js", "verhaaljaar.js", "img/icoon-192.png", "img/icoon-512.png", "img/lakzegel.webp", "img/sneeuwuil.webp", "img/perkament.webp", "img/ui/nav-hal-96.webp", "img/ui/nav-kaart-96.webp", "img/ui/nav-kassen-96.webp", "img/ui/nav-boek-96.webp", "img/ui/nav-meer-96.webp", "img/ui/nav-vrienden-96.webp", "img/ui/schild-64.webp", "img/smekkies/zak-half-128.webp", "img/laadschermen/herbologie-klein.webp"];
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
