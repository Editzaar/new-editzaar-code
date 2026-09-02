/**
 * EDITZAAR — Service Worker (sw.js)
 * Handles:
 *   1. Offline caching (PWA)
 *   2. Firebase Cloud Messaging background push notifications
 */

// ── FCM Background Message Handler ──────────────────────────────────────────
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDSTSremZrVJJ7WXuNWgHokljC-i8r3esc",
  authDomain: "editzaar-fa8d9.firebaseapp.com",
  projectId: "editzaar-fa8d9",
  storageBucket: "editzaar-fa8d9.appspot.com",
  messagingSenderId: "419930711716",
  appId: "1:419930711716:web:b1504f651e397a14726831"
});

const messaging = firebase.messaging();

// Show notification in system notification bar when app is in background / closed
messaging.onBackgroundMessage(function (payload) {
  console.log('[sw.js] Background message received:', payload);

  const title   = (payload.notification && payload.notification.title)  || 'Editzaar';
  const body    = (payload.notification && payload.notification.body)   || '';
  const icon    = '/media/fav-logo.png';
  const badge   = '/media/fav-logo.png';
  const clickUrl = (payload.data && payload.data.url) || '/dashboard/index.html';

  const options = {
    body,
    icon,
    badge,
    vibrate: [200, 100, 200],
    data: { url: clickUrl },
    actions: [{ action: 'open', title: 'Open Dashboard' }]
  };

  self.registration.showNotification(title, options);
});

// Clicking the notification opens dashboard
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/dashboard/index.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (windowClients) {
      for (let client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ── Offline Cache (PWA) — Network First Strategy ─────────────────────────────
const CACHE_NAME = 'editzaar-v' + Date.now();

self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  // Network-first strategy: always fetch fresh from server, fallback to cache only if offline
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        return response;
      })
      .catch(function () {
        return caches.match(event.request);
      })
  );
});
