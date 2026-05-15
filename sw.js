// ============================================================
//  SCMS Service Worker — Surya Cleanindo Management System  
//  v3.0 — Fixed untuk GitHub Pages PWA Android
// ============================================================

const CACHE_NAME = 'scms-v3';

// BASE_PATH: folder tempat sw.js berada
// Contoh: jika sw.js di https://user.github.io/scms/sw.js
// maka BASE_PATH = '/scms'
const BASE_PATH = self.location.pathname.replace(/\/sw\.js$/, '') || '';

// Halaman utama yang di-cache
const SHELL_FILES = [
  BASE_PATH + '/',
  BASE_PATH + '/index.html',
  BASE_PATH + '/manifest.json',
  BASE_PATH + '/icon-192.png',
  BASE_PATH + '/icon-512.png',
  BASE_PATH + '/favicon-32.png',
];

// ── INSTALL ──────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW v3] Installing, BASE_PATH:', BASE_PATH);
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache satu per satu, jangan gagal total jika ada yang missing
      return Promise.allSettled(
        SHELL_FILES.map(url =>
          cache.add(url).catch(e => console.warn('[SW] Skip cache:', url))
        )
      );
    })
  );
  // Langsung aktif tanpa tunggu tab lama ditutup
  self.skipWaiting();
});

// ── ACTIVATE ─────────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW v3] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[SW] Delete old cache:', k);
          return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

// ── FETCH ────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Lewati semua request ke Google / GAS / CDN eksternal
  const isExternal = (
    url.hostname.includes('script.google.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('cdnjs.cloudflare.com')
  );

  if (isExternal) {
    // Untuk CDN/font: coba cache dulu, fallback ke network
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return res;
        }).catch(() => cached || new Response('', { status: 408 }));
      })
    );
    return;
  }

  // Untuk file lokal: Cache First dengan Network Update
  event.respondWith(
    caches.match(event.request).then(cached => {
      // Update cache di background
      const networkFetch = fetch(event.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return res;
      }).catch(() => null);

      // Return cache langsung jika ada, otherwise tunggu network
      return cached || networkFetch.then(res => res || offlineFallback());
    })
  );
});

function offlineFallback() {
  return caches.match(BASE_PATH + '/index.html')
    .then(r => r || caches.match(BASE_PATH + '/'))
    .then(r => r || new Response(
      '<meta charset="utf-8"><title>Offline</title><div style="font-family:sans-serif;text-align:center;padding:60px 20px"><h2>📶 Tidak ada koneksi</h2><p>Buka kembali saat ada internet</p><button onclick="location.reload()" style="margin-top:20px;padding:10px 24px;background:#166534;color:white;border:none;border-radius:8px;font-size:16px;cursor:pointer">🔄 Coba Lagi</button></div>',
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    ));
}

// ── MESSAGE ──────────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
