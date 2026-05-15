// ============================================================
//  SCMS Service Worker v4
//  Surya Cleanindo Management System
// ============================================================

const CACHE_NAME = 'scms-v4';

// Deteksi base path dari lokasi sw.js
// Contoh: /scms/sw.js → BASE = '/scms/'
const BASE = self.location.pathname.replace('sw.js', '');

const SHELL = [
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'icon-192.png',
  BASE + 'icon-512.png',
];

// ── INSTALL ──────────────────────────────────────────────────
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(SHELL.map(url =>
        cache.add(url).catch(() => {}) // skip jika file tidak ada
      ))
    )
  );
});

// ── ACTIVATE ─────────────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── FETCH ────────────────────────────────────────────────────
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // JANGAN intercept request ke GAS atau API eksternal
  // Biarkan browser handle langsung tanpa cache
  if (
    url.hostname.includes('script.google.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com')
  ) {
    return; // biarkan browser handle
  }

  // Untuk request ke CDN (fonts, icons) - cache tapi jangan block
  if (
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('cdnjs.cloudflare.com')
  ) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return res;
        }).catch(() => cached || new Response('', {status: 503}));
      })
    );
    return;
  }

  // Untuk file lokal (HTML, CSS, icons) - Network first, fallback ke cache
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Simpan ke cache jika sukses
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => {
        // Offline: ambil dari cache
        return caches.match(e.request).then(cached => {
          if (cached) return cached;
          // Fallback ke index.html
          return caches.match(BASE + 'index.html').then(r => r ||
            new Response(
              '<meta charset="utf-8"><style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9fafb}.box{text-align:center;padding:40px 24px}.logo{font-size:48px;margin-bottom:16px}h2{color:#166534;margin-bottom:8px}p{color:#6b7280;font-size:14px}button{margin-top:20px;padding:10px 24px;background:#166534;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer}</style><div class="box"><div class="logo">📶</div><h2>Tidak Ada Koneksi</h2><p>Buka kembali saat ada internet</p><button onclick="location.reload()">Coba Lagi</button></div>',
              {headers:{'Content-Type':'text/html;charset=utf-8'}}
            )
          );
        });
      })
  );
});

// ── MESSAGE ──────────────────────────────────────────────────
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
