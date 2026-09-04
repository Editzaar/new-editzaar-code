/**
 * EDITZAAR — Unified Presence-Aware Push Notification Service (OneSignal)
 * App ID: ea5130c0-a797-42ad-8240-caeaa6720a73
 */

(function () {
  'use strict';

  const ONESIGNAL_APP_ID = 'ea5130c0-a797-42ad-8240-caeaa6720a73';
  const ONESIGNAL_REST_API_KEY = (typeof atob === 'function')
    ? atob('b3NfdjJfYXBwXzVqaXRicWZoczViazNhc2F6bHZrbTRxa29waWdxZHJqbDR0ZW1tZWhtcWJ5NWRraWRieW4zamJoYnB6ZXQyN2tmcjVibnhlaWNzdzVua2pka2YzY2M2djZkZGl6cDVpZXp1b2treWk=')
    : Buffer.from('b3NfdjJfYXBwXzVqaXRicWZoczViazNhc2F6bHZrbTRxa29waWdxZHJqbDR0ZW1tZWhtcWJ5NWRraWRieW4zamJoYnB6ZXQyN2tmcjVibnhlaWNzdzVua2pka2YzY2M2djZkZGl6cDVpZXp1b2treWk=', 'base64').toString();

  // Global namespace
  const EditzaarPush = {
    appId: ONESIGNAL_APP_ID,
    isInitialized: false,
    currentRole: 'visitor',
    currentUid: null,

    /**
     * Checks whether the user is actively viewing this tab/PWA window.
     * Returns true ONLY if tab is in foreground and focused.
     */
    isUserActive: function () {
      return document.visibilityState === 'visible' && document.hasFocus();
    },

    /**
     * Initialize OneSignal Web SDK
     */
    init: function () {
      if (this.isInitialized) return;
      window.OneSignalDeferred = window.OneSignalDeferred || [];

      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          await OneSignal.init({
            appId: ONESIGNAL_APP_ID,
            allowLocalhostAsSecureOrigin: true,
            notifyButton: { enable: false } // We use custom UI / soft prompt
          });
          EditzaarPush.isInitialized = true;
          console.log('[EditzaarPush] OneSignal initialized successfully.');

          // Listen for push notifications while in foreground
          OneSignal.Notifications.addEventListener('foregroundWillDisplay', function (event) {
            // If user is actively looking at the screen, we can let in-app UI take over
            if (EditzaarPush.isUserActive()) {
              console.log('[EditzaarPush] User active in foreground, suppressing OS popup in favor of in-app UI.');
            }
          });
        } catch (err) {
          console.warn('[EditzaarPush] OneSignal init warning:', err);
        }
      });
    },

    /**
     * Identify and tag a logged-in user (Client, Editor, Admin)
     */
    identifyUser: function (uid, role, extraTags = {}) {
      if (!uid) return;
      this.currentUid = uid;
      this.currentRole = role || 'client';

      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          if (typeof OneSignal.login === 'function') {
            await OneSignal.login(uid);
          }
          if (OneSignal.User && typeof OneSignal.User.addTags === 'function') {
            await OneSignal.User.addTags({
              role: this.currentRole,
              user_id: uid,
              app_name: 'Editzaar',
              ...extraTags
            });
          }
          console.log(`[EditzaarPush] User tagged as ${this.currentRole} (UID: ${uid})`);
        } catch (e) {
          console.warn('[EditzaarPush] Tagging error:', e);
        }
      });
    },

    /**
     * Log out user from OneSignal
     */
    logoutUser: function () {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          if (typeof OneSignal.logout === 'function') {
            await OneSignal.logout();
          }
        } catch (e) {}
      });
    },

    /**
     * Trigger permission prompt politely
     */
    promptPushPermission: function () {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          if (OneSignal.Notifications && typeof OneSignal.Notifications.requestPermission === 'function') {
            await OneSignal.Notifications.requestPermission();
          }
        } catch (e) {}
      });
    },

    /**
     * Send Push Notification via OneSignal REST API
     * @param {Object} opts { title, message, url, icon, segment, targetUid }
     */
    sendPush: async function (opts) {
      const payload = {
        app_id: ONESIGNAL_APP_ID,
        headings: { en: opts.title || 'Editzaar Agency' },
        contents: { en: opts.message || '' },
        url: opts.url || 'https://editzaar.in',
        chrome_web_icon: opts.icon || 'https://editzaar.in/media/fav-logo.png',
        firefox_icon: opts.icon || 'https://editzaar.in/media/fav-logo.png'
      };

      if (opts.bigPicture) {
        payload.big_picture = opts.bigPicture;
        payload.chrome_web_image = opts.bigPicture;
      }

      // Target specific user ID or segment
      if (opts.targetUid) {
        payload.include_aliases = {
          external_id: Array.isArray(opts.targetUid) ? opts.targetUid : [opts.targetUid]
        };
        payload.target_channel = 'push';
      } else if (opts.segment && opts.segment !== 'All') {
        // Tag-based filter
        payload.filters = [
          { field: 'tag', key: 'role', relation: '=', value: opts.segment }
        ];
      } else {
        // Broadcast to all active subscribers
        payload.included_segments = ['Total Subscriptions'];
      }

      try {
        const res = await fetch('https://onesignal.com/api/v1/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Key ' + ONESIGNAL_REST_API_KEY
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        return { success: !data.errors, data };
      } catch (err) {
        console.error('[EditzaarPush] REST API push error:', err);
        return { success: false, error: err.message };
      }
    },

    /**
     * Fetch live subscriber metrics from OneSignal App API
     */
    getSubscriberMetrics: async function () {
      try {
        const res = await fetch('https://onesignal.com/api/v1/apps/' + ONESIGNAL_APP_ID, {
          method: 'GET',
          headers: {
            'Authorization': 'Key ' + ONESIGNAL_REST_API_KEY
          }
        });
        const data = await res.json();
        return {
          success: true,
          totalSubscribers: data.messageable_players || data.total_users || 0,
          name: data.name
        };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },

    /**
     * Set badge on app icon (Windows taskbar, Mac dock, iOS PWA, Android)
     */
    setBadge: async function (count = 1) {
      if ('setAppBadge' in navigator) {
        try {
          await navigator.setAppBadge(count);
        } catch (e) {}
      }
    },

    /**
     * Clear badge from app icon when user opens app
     */
    clearBadge: async function () {
      if ('clearAppBadge' in navigator) {
        try {
          await navigator.clearAppBadge();
        } catch (e) {}
      }
    }
  };

  window.EditzaarPush = EditzaarPush;

  // Auto clear app icon badge on window focus / visibility
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', () => EditzaarPush.clearBadge());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        EditzaarPush.clearBadge();
      }
    });
  }

  // Auto-init on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => EditzaarPush.init());
  } else {
    EditzaarPush.init();
  }
})();
