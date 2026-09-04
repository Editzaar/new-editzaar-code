importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// App Badging Support (Android PWA / Windows / macOS / iOS)
self.addEventListener('push', function (event) {
  if (self.navigator && 'setAppBadge' in self.navigator) {
    self.navigator.setAppBadge(1).catch(function () {});
  }
});

self.addEventListener('notificationclick', function (event) {
  if (self.navigator && 'clearAppBadge' in self.navigator) {
    self.navigator.clearAppBadge().catch(function () {});
  }
});
