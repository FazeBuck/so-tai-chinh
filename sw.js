/* Sổ Tài Chính: chạy offline. Đổi VERSION mỗi lần phát hành để iPhone tải bản mới. */
const VERSION='stc-1.0.15';
const SHELL=['./','index.html','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png','lib/jspdf.umd.min.js','lib/pjs-400.ttf','lib/pjs-700.ttf'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  /* Trang chính: lấy bản mới khi có mạng, không có mạng thì dùng bản đã lưu */
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(VERSION).then(x=>x.put('index.html',c));return res}).catch(()=>caches.match('index.html')));return}
  /* Font Google và file tĩnh: dùng bản đã lưu, cập nhật ngầm */
  if(u.origin===location.origin||u.host.endsWith('fonts.googleapis.com')||u.host.endsWith('fonts.gstatic.com')){
    e.respondWith(caches.open(VERSION).then(c=>c.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}).catch(()=>hit);return hit||net})));
  }
});
