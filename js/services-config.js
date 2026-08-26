/**
 * EDITZAAR CENTRAL DYNAMIC SERVICES CONFIGURATION & STATE MANAGER
 * Single source of truth for all services, prices, turnaround times, and descriptions.
 * Updates in Admin Dashboard dynamically propagate across all pages in real-time.
 */

(function () {
  'use strict';

  const DEFAULT_SERVICES = [
    // 🎬 Video Post-Production
    {
      id: "shorts-reels",
      category: "Video Post-Production",
      categoryIcon: "🎬",
      name: "Shorts & Instagram Reels",
      price: 1000,
      unit: "/ video",
      delivery: "48 Hours",
      description: "High-retention vertical editing with kinetic typography, SFX & 3-second hook structure.",
      features: [
        "Custom Subtitles & Kinetic Typography",
        "Dynamic B-Roll & Sound Design (SFX)",
        "Color Correction & Platform Formatting",
        "48-Hour Fast Delivery"
      ],
      popular: true,
      badge: "Most Popular"
    },
    {
      id: "motion-graphics",
      category: "Video Post-Production",
      categoryIcon: "🎬",
      name: "Motion Graphic & Animated Video",
      price: 2500,
      unit: "/ video",
      delivery: "48 Hours",
      description: "2D animations, title cards, animated infographics, lower thirds, and logo reveals.",
      features: [
        "2D Motion Graphics & Icon Animation",
        "Custom Brand Color Theming",
        "Sound FX & Royalty-Free Music Sync",
        "Up to 60 Seconds"
      ]
    },
    {
      id: "long-form-youtube",
      category: "Video Post-Production",
      categoryIcon: "🎬",
      name: "Long Form YouTube Video Edit",
      price: 5000,
      unit: "/ video",
      delivery: "48-72 Hours",
      description: "Full YouTube video editing: narrative pacing, seamless jump-cuts, zoom-ins, meme overlays & B-roll.",
      features: [
        "Up to 15-Minute Raw Footage Cut",
        "Multi-Cam Sync & Audio Cleanup",
        "Visual Hook, Chapters & Outro CTA",
        "2 Revision Rounds Included"
      ]
    },
    {
      id: "cinematic-documentary",
      category: "Video Post-Production",
      categoryIcon: "🎬",
      name: "Cinematic Documentary & Ad Film",
      price: 10000,
      unit: "/ video",
      delivery: "3-5 Days",
      description: "Cinematic grade brand films, high-end product showcases, and documentary storytelling.",
      features: [
        "Cinematic LUT Color Grading",
        "Custom Soundscape & Spatial Audio",
        "Advanced 3D/VFX Compositing",
        "Commercial Usage Rights"
      ]
    },

    // 💻 Website Design & Development
    {
      id: "landing-page",
      category: "Website Design & Development",
      categoryIcon: "💻",
      name: "High-Converting Landing Page",
      price: 4999,
      unit: "/ project",
      delivery: "3-5 Days",
      description: "Single-page responsive landing page engineered to capture leads and drive sales.",
      features: [
        "Custom Modern Design & Copy Layout",
        "Mobile-First Responsive (98/100 Speed)",
        "WhatsApp & Direct Form Lead Integration",
        "Free Hosting & SSL Setup"
      ],
      popular: true,
      badge: "Best for Ads"
    },
    {
      id: "ecommerce-store",
      category: "Website Design & Development",
      categoryIcon: "💻",
      name: "D2C Brand & E-Commerce Store",
      price: 12999,
      unit: "/ project",
      delivery: "7-10 Days",
      description: "Full-featured online store with payment gateway, product catalog, cart, and order system.",
      features: [
        "Payment Gateway (UPI / Razorpay / Stripe)",
        "Product Catalog & Cart Logic",
        "Admin CMS & Order Tracking",
        "Mobile-First Responsive Layout"
      ]
    },
    {
      id: "full-web-portal",
      category: "Website Design & Development",
      categoryIcon: "💻",
      name: "Full Web System & Portal",
      price: 24999,
      unit: "/ project",
      delivery: "10-14 Days",
      description: "Custom SaaS portal, multi-role client/staff dashboard with realtime database & live chat.",
      features: [
        "Firebase Auth & Role-Based Portals",
        "Real-Time Firestore Database",
        "Admin, Client & Staff Dashboards",
        "Live Chat & File Tracking System"
      ]
    },

    // 📈 Paid Advertising & Growth
    {
      id: "paid-ads-setup",
      category: "Paid Advertising & Growth",
      categoryIcon: "📈",
      name: "Paid Ad Setup & Creatives",
      price: 7999,
      unit: "/ campaign",
      delivery: "3-5 Days",
      description: "Data-driven Meta (FB/IG) & Google ad campaign setup with 3 direct-response video creatives.",
      features: [
        "Meta & Google Ad Campaign Setup",
        "3 Direct-Response Video Ad Creatives",
        "A/B Hook Variation Testing",
        "Audience Targeting & Pixel Setup"
      ]
    },
    {
      id: "growth-retainer",
      category: "Paid Advertising & Growth",
      categoryIcon: "📈",
      name: "Full Channel Growth Retainer",
      price: 14999,
      unit: "/ month",
      delivery: "Monthly Retainer",
      description: "All-in-one monthly growth partnership: 12 edited videos, SEO, thumbnails & ad management.",
      features: [
        "12 Reels / Shorts Editing per month",
        "YouTube Channel SEO & Thumbnail Design",
        "Meta & Google Paid Ads Management",
        "Monthly Strategy & Analytics Reports"
      ],
      popular: true,
      badge: "Best ROI"
    }
  ];

  const STORAGE_KEY = 'editzaar_dynamic_services';

  window.EditzaarServices = {
    /**
     * Get all active services (from cache/storage or defaults)
     */
    getAll: function () {
      try {
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('[EditzaarServices] Local storage read error:', e);
      }
      return DEFAULT_SERVICES;
    },

    /**
     * Get a specific service by ID or Name
     */
    getById: function (idOrName) {
      const all = this.getAll();
      return all.find(s => s.id === idOrName || s.name.toLowerCase() === (idOrName || '').toLowerCase()) || null;
    },

    /**
     * Save/Update a service in central storage
     */
    save: function (serviceObj) {
      const all = [...this.getAll()];
      const idx = all.findIndex(s => s.id === serviceObj.id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...serviceObj };
      } else {
        if (!serviceObj.id) {
          serviceObj.id = 'svc-' + Date.now();
        }
        all.push(serviceObj);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      this.notifySubscribers(all);
      return all;
    },

    /**
     * Update only price & turnaround for a service
     */
    updatePrice: function (id, newPrice, newDelivery) {
      const all = [...this.getAll()];
      const item = all.find(s => s.id === id);
      if (item) {
        if (newPrice !== undefined) item.price = parseInt(newPrice) || 0;
        if (newDelivery !== undefined) item.delivery = newDelivery;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        this.notifySubscribers(all);
      }
      return all;
    },

    /**
     * Delete a service
     */
    delete: function (id) {
      let all = this.getAll().filter(s => s.id !== id);
      if (all.length === 0) all = DEFAULT_SERVICES;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      this.notifySubscribers(all);
      return all;
    },

    /**
     * Reset to factory default services
     */
    resetDefaults: function () {
      localStorage.removeItem(STORAGE_KEY);
      this.notifySubscribers(DEFAULT_SERVICES);
      return DEFAULT_SERVICES;
    },

    /**
     * Subscribers for dynamic realtime updates on the same page
     */
    _subscribers: [],
    subscribe: function (cb) {
      if (typeof cb === 'function') this._subscribers.push(cb);
    },
    notifySubscribers: function (services) {
      this._subscribers.forEach(cb => {
        try { cb(services); } catch (e) { console.error(e); }
      });
      // Broadcast across tabs/windows
      window.dispatchEvent(new CustomEvent('editzaar:services_updated', { detail: services }));
    },

    /**
     * Dynamically populate any <select id="..."> with grouped options
     */
    populateSelect: function (selectEl, selectedId) {
      if (!selectEl) return;
      const services = this.getAll();
      const groups = {};

      services.forEach(s => {
        const cat = s.category || 'General Services';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(s);
      });

      let html = '';
      for (const [catName, list] of Object.entries(groups)) {
        const icon = list[0]?.categoryIcon || '📌';
        html += `<optgroup label="${icon} ${catName}">`;
        list.forEach(s => {
          const val = `${s.name}|${s.price}|${s.delivery}`;
          const isSel = (s.id === selectedId || s.name === selectedId) ? 'selected' : '';
          html += `<option value="${val}" ${isSel}>${icon} ${s.name} — ₹${s.price.toLocaleString()} ${s.unit}</option>`;
        });
        html += `</optgroup>`;
      }

      // Add Custom Service Option at the end
      html += `<optgroup label="⭐ Custom Service / Quote">
        <option value="Custom Service / Custom Quote|0|Custom">✨ Custom Service / Custom Quote Request</option>
      </optgroup>`;

      selectEl.innerHTML = html;
    }
  };

  
  /* ══════════════════════════════════════════════════════════════
     DYNAMIC COUPONS & DISCOUNTS SYSTEM
     ══════════════════════════════════════════════════════════════ */
  const DEFAULT_COUPONS = [
    { code: "WELCOME10", discountType: "percent", value: 10, description: "10% Welcome Discount for New Clients", active: true, maxUses: 100 },
    { code: "LAUNCH20", discountType: "percent", value: 20, description: "20% Launch Celebration Discount", active: true, maxUses: 50 },
    { code: "FLAT500", discountType: "flat", value: 500, description: "₹500 Flat Discount on any project", active: true, maxUses: 200 },
    { code: "AGENCY30", discountType: "percent", value: 30, description: "30% Partner / Agency Retainer Discount", active: true, maxUses: 20 }
  ];

  const COUPONS_STORAGE_KEY = 'editzaar_dynamic_coupons';

  // Global in-memory cache synchronized with localStorage
  let _cachedCoupons = null;

  window.EditzaarCoupons = {
    getAll: function () {
      try {
        const local = localStorage.getItem(COUPONS_STORAGE_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            _cachedCoupons = parsed;
            return parsed;
          }
        }
      } catch (e) {
        console.warn('[EditzaarCoupons] Local storage read error:', e);
      }
      if (!_cachedCoupons) _cachedCoupons = [...DEFAULT_COUPONS];
      return _cachedCoupons;
    },

    getByCode: function (code) {
      if (!code) return null;
      const clean = String(code).trim().toUpperCase();
      const all = this.getAll();
      return all.find(c => String(c.code).trim().toUpperCase() === clean && c.active !== false) || null;
    },

    validate: function (code, baseAmount) {
      const clean = String(code || '').trim().toUpperCase();
      const base = parseInt(baseAmount) || 0;

      if (!clean) {
        return { valid: false, message: 'Please enter a coupon code.' };
      }

      const coupon = this.getByCode(clean);
      if (!coupon) {
        return { valid: false, message: `Coupon "${clean}" is invalid or expired.` };
      }

      let discount = 0;
      const val = parseInt(coupon.value) || 0;
      if (coupon.discountType === 'percent') {
        discount = Math.round(base * (val / 100));
      } else {
        discount = Math.min(base, val);
      }

      return {
        valid: true,
        code: coupon.code,
        discountType: coupon.discountType,
        value: val,
        discountAmount: discount,
        description: coupon.description,
        message: `🎉 Coupon "${coupon.code}" applied: ${coupon.discountType === 'percent' ? val + '% OFF' : '₹' + val + ' OFF'}! Saved ₹${discount.toLocaleString()}`
      };
    },

    save: function (couponObj) {
      const all = [...this.getAll()];
      const cleanCode = String(couponObj.code).trim().toUpperCase();
      couponObj.code = cleanCode;
      couponObj.value = parseInt(couponObj.value) || 0;
      couponObj.active = true;

      const idx = all.findIndex(c => String(c.code).trim().toUpperCase() === cleanCode);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...couponObj };
      } else {
        all.push(couponObj);
      }
      _cachedCoupons = all;
      try {
        localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(all));
      } catch (err) {}
      this.notifySubscribers(all);
      return all;
    },

    delete: function (code) {
      const clean = String(code).trim().toUpperCase();
      let all = this.getAll().filter(c => String(c.code).trim().toUpperCase() !== clean);
      if (all.length === 0) all = [...DEFAULT_COUPONS];
      _cachedCoupons = all;
      try {
        localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(all));
      } catch (err) {}
      this.notifySubscribers(all);
      return all;
    },

    resetDefaults: function () {
      _cachedCoupons = [...DEFAULT_COUPONS];
      try {
        localStorage.removeItem(COUPONS_STORAGE_KEY);
      } catch (err) {}
      this.notifySubscribers(DEFAULT_COUPONS);
      return DEFAULT_COUPONS;
    },

    _subscribers: [],
    subscribe: function (cb) {
      if (typeof cb === 'function') this._subscribers.push(cb);
    },
    notifySubscribers: function (coupons) {
      this._subscribers.forEach(cb => {
        try { cb(coupons); } catch (e) { console.error(e); }
      });
      try {
        window.dispatchEvent(new CustomEvent('editzaar:coupons_updated', { detail: coupons }));
      } catch (err) {}
    }
  };

  // Sync across browser tabs in real-time
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) {
      try {
        const updated = JSON.parse(e.newValue);
        window.EditzaarServices.notifySubscribers(updated);
      } catch (err) {}
    }
    if (e.key === COUPONS_STORAGE_KEY) {
      try {
        const updated = JSON.parse(e.newValue);
        _cachedCoupons = updated;
        window.EditzaarCoupons.notifySubscribers(updated);
      } catch (err) {}
    }
  });

})();
