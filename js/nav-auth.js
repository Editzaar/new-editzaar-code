// Universal Navigation Auth for Editzaar Public Pages
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSTSremZrVJJ7WXuNWgHokljC-i8r3esc",
  authDomain: "editzaar-fa8d9.firebaseapp.com",
  projectId: "editzaar-fa8d9",
  storageBucket: "editzaar-fa8d9.firebasestorage.app",
  messagingSenderId: "419930711716",
  appId: "1:419930711716:web:b1504f651e397a14726831"
};

try {
  // Use default app to share session with dashboard/index.html
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const isSubPage = window.location.pathname.includes('/pages/');
  const dashPrefix = isSubPage ? '../dashboard/' : 'dashboard/';

  
    // Universal Real-time Firestore Coupon Validator
  window.validateCouponWithFirebase = async function(code, baseAmount) {
    const clean = String(code || '').trim().toUpperCase();
    const base = parseInt(baseAmount) || 0;
    if (!clean) return { valid: false, message: 'Please enter a coupon code.' };

    try {
      const snap = await getDoc(doc(db, 'coupons', clean));
      if (snap.exists()) {
        const coupon = snap.data();
        if (coupon.active !== false) {
          const val = parseInt(coupon.value) || 0;
          let discount = 0;
          if (coupon.discountType === 'percent') {
            discount = Math.round(base * (val / 100));
          } else {
            discount = Math.min(base, val);
          }
          const result = {
            valid: true,
            code: coupon.code || clean,
            discountType: coupon.discountType || 'percent',
            value: val,
            discountAmount: discount,
            description: coupon.description || '',
            message: `🎉 Coupon "${coupon.code || clean}" applied: ${coupon.discountType === 'percent' ? val + '% OFF' : '₹' + val + ' OFF'}! Saved ₹${discount.toLocaleString()}`
          };
          if (window.EditzaarCoupons && typeof window.EditzaarCoupons.save === 'function') {
            window.EditzaarCoupons.save({
              code: clean,
              discountType: coupon.discountType || 'percent',
              value: val,
              maxUses: coupon.maxUses || 100,
              description: coupon.description || '',
              active: true
            });
          }
          return result;
        }
      }
    } catch (err) {
      console.warn('[Firestore Coupon Query Error]', err);
    }

    // Fallback to local cache
    if (window.EditzaarCoupons && typeof window.EditzaarCoupons.validate === 'function') {
      return window.EditzaarCoupons.validate(clean, base);
    }
    return { valid: false, message: `Coupon "${clean}" is invalid or expired.` };
  };

  onAuthStateChanged(auth, async (user) => {
    const desktopBtns = document.querySelectorAll('#nav-auth-btn, .nav-cta:not(.nav-cta-mobile)');
    const mobileBtns = document.querySelectorAll('.nav-cta-mobile');

    if (user) {
      let displayName = user.displayName || '';
      let role = 'client';

      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.name) displayName = data.name;
          if (data.role) role = data.role;
        }
      } catch (err) {
        console.warn('[NavAuth Firestore]', err);
      }

      // Clean & validate display name
      if (!displayName || displayName.toLowerCase().includes('hhhh') || displayName.toLowerCase().includes('test')) {
        displayName = user.email ? user.email.split('@')[0] : 'Dashboard';
      }

      // First name or short name
      let shortName = displayName.trim().split(' ')[0] || 'Dashboard';
      if (shortName.length > 12) shortName = shortName.substring(0, 12);
      const initials = (shortName[0] || 'D').toUpperCase();

      // Role destination
      let destUrl = dashPrefix + 'client.html';
      if (role === 'admin') destUrl = dashPrefix + 'admin.html';
      else if (role === 'editor') destUrl = dashPrefix + 'editor.html';

      const buttonHtml = `
        <span style="width:24px;height:24px;border-radius:50%;background:var(--gold);color:#000;
          font-size:11px;font-weight:700;display:inline-flex;align-items:center;
          justify-content:center;margin-right:8px;flex-shrink:0;box-shadow:0 0 8px rgba(255,184,0,0.5);">${initials}</span>
        <span style="max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;">${shortName}</span>
      `;

      desktopBtns.forEach(btn => {
        btn.href = destUrl;
        btn.innerHTML = buttonHtml;
        btn.title = `Go to ${role.toUpperCase()} Dashboard`;
        if (window.innerWidth <= 900) {
          btn.style.setProperty('display', 'none', 'important');
        } else {
          btn.style.removeProperty('display');
        }
      });

      mobileBtns.forEach(btn => {
        btn.href = destUrl;
        btn.innerHTML = `<span style="display:inline-flex;align-items:center;gap:8px;"><span style="width:22px;height:22px;border-radius:50%;background:#000;color:var(--gold);font-size:11px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;">${initials}</span> <span>${shortName} (Dashboard)</span></span>`;
      });

    } else {
      const loginUrl = dashPrefix + 'index.html';
      desktopBtns.forEach(btn => {
        btn.href = loginUrl;
        btn.textContent = 'Client Login';
        btn.title = 'Client & Staff Login';
      });
      mobileBtns.forEach(btn => {
        btn.href = loginUrl;
        btn.textContent = 'Client Login';
      });
    }
  });
} catch (e) {
  console.warn('[Nav Auth Error]', e);
}
