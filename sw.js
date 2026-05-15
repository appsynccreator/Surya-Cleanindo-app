// ============================================================
//  SCMS Service Worker — Surya Cleanindo Management System
//  v2.0 — Compatible dengan GitHub Pages & Android PWA
// ============================================================

const CACHE_NAME = 'scms-v2';

// Gunakan path relatif agar bekerja di GitHub Pages subpath manapun
const BASE_PATH = self.location.pathname.replace(/\/sw\.js$/, '');

const CACHE_FILES = [
  BASE_PATH + '/',
  BASE_PATH + '/index.html',
  BASE_PATH + '/manifest.json',
  BASE_PATH + '/icon-192.png',
  BASE_PATH + '/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
];

// ── INSTALL ──────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Installing v2...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // addAll satu per satu agar tidak gagal total jika satu file missing
        return Promise.allSettled(
          CACHE_FILES.map(url => cache.add(url).catch(e => console.warn('[SW] Failed to cache:', url, e)))
        );
      })
      .then(() => console.log('[SW] Install complete'))
  );
  self.skipWaiting();
});

// ── ACTIVATE ─────────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => {
            console.log('[SW] Deleting old cache:', k);
            return caches.delete(k);
          })
      )
    )
  );
  // Ambil kontrol semua tab langsung tanpa perlu refresh
  self.clients.claim();
});

// ── FETCH ────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Jangan intercept request ke GAS / Google API / external
  if (
    url.hostname.includes('script.google.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('cdnjs.cloudflare.com')
  ) {
    // Biarkan browser handle, tapi tetap cache hasilnya
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          // Cache font & CDN files
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return response;
        }).catch(() => cached);
      })
    );
    return;
  }

  // Strategi: Cache First → Network Fallback → Offline Page
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // Lakukan background fetch untuk update cache
        fetch(event.request).then(response => {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then(c => c.put(event.request, response));
          }
        }).catch(() => {});
        return cached;
      }

      return fetch(event.request)
        .then(response => {
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response;
          }
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, responseClone));
          return response;
        })
        .catch(() => {
          // Offline fallback: tampilkan index.html
          return caches.match(BASE_PATH + '/index.html')
              || caches.match(BASE_PATH + '/')
              || new Response('<h1>Offline</h1><p>Tidak ada koneksi internet. Buka kembali saat online.</p>', {
                   headers: { 'Content-Type': 'text/html' }
                 });
        });
    })
  );
});

// ── MESSAGE ──────────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
