const CACHE="marabou-languages-v23";
const ASSETS=["./","./index.html","./style.css","./app.js","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(path=>new Request(path,{cache:"reload"})))).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("marabou-languages-")&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=="GET"||url.origin!==self.location.origin)return;
 const allowed=ASSETS.some(path=>new URL(path,self.registration.scope).pathname===url.pathname);
 if(!allowed&&req.mode!=="navigate")return;
 if(!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(req,{cache:"no-cache"});if(response.ok&&allowed)await cache.put(req,response.clone());if(response.ok||response.status<500)return response;}catch(e){}return await cache.match(req)|| (req.mode==="navigate"?await cache.match("./index.html"):undefined)||Response.error()})());
});