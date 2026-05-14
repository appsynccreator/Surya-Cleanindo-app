// ============================================================
//  SCMS Service Worker — Surya Cleanindo Management System
//  Enables PWA install on mobile & desktop
// ============================================================

const CACHE_NAME = 'scms-v1';
const GAS_URL = 'https://script.google.com/macros/s/AKfycbweuaL6O_JvMsnXJPBTuHMOhu-ngh2PaYRWUsup7tT6-Pch6iG-HiecAHaFYoHi_dh_/exec';

// File yang di-cache untuk offline
const CACHE_FILES = [
  '/',
  '/index.html',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// Install — cache semua file
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_FILES).catch(() => {
        // Lanjut meski ada file yang gagal di-cache
      });
    })
  );
  self.skipWaiting();
});

// Activate — hapus cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch — redirect ke GAS untuk semua request
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Jangan intercept request ke GAS / Google API
  if (url.hostname.includes('google') || url.hostname.includes('googleapis') || url.hostname.includes('gstatic')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).catch(() => {
        // Offline fallback: tampilkan index.html
        return caches.match('/index.html');
      });
    })
  );
});
