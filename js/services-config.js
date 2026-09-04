/**
 * EDITZAAR CENTRAL DYNAMIC SERVICES CONFIGURATION & STATE MANAGER
 * Single source of truth for all services, prices, turnaround times, and descriptions.
 * Updates in Admin Dashboard dynamically propagate across all pages in real-time.
 */

(function () {
  'use strict';

  const DEFAULT_SERVICES = [
    // 🎬 1. Video Post-Production
    {
      id: "shorts-reels",
      category: "Video Post-Production",
      categoryIcon: "🎬",
      name: "Shorts & Reels",
      price: 1000,
      priceUSD: 29,
      unit: "/ video",
      delivery: "48 Hours",
      description: "High-retention vertical editing with kinetic typography, SFX & 3-second hook structure.",
      features: [
        "Up to 60-second video cut",
        "3-sec hook optimization",
        "Kinetic subtitles & captions",
        "Background music & audio balancing",
        "Custom sound design & SFX",
        "Revisions: 1"
      ]
    },
    {
      id: "motion-graphics",
      category: "Video Post-Production",
      categoryIcon: "🎬",
      name: "Motion Graphic / Animated",
      price: 2500,
      priceUSD: 69,
      unit: "/ video",
      delivery: "48 Hours",
      description: "2D animations, title cards, animated infographics, lower thirds, and logo reveals.",
      popular: true,
      badge: "Most Popular",
      features: [
        "Up to 60-second video",
        "Custom vector animation & motion graphics",
        "Stylish kinetic typography",
        "Color grading & sound FX",
        "Voiceover syncing",
        "Revisions: 2"
      ]
    },
    {
      id: "long-form-youtube",
      category: "Video Post-Production",
      categoryIcon: "🎬",
      name: "Long-Form YouTube",
      price: 5000,
      priceUSD: 129,
      unit: "/ video",
      delivery: "48-72 Hours",
      description: "Full YouTube video editing: narrative pacing, seamless jump-cuts, zoom-ins, meme overlays & B-roll.",
      features: [
        "Up to 10–20 minute video edit",
        "Storytelling cuts & B-roll integration",
        "Custom lower thirds & titles",
        "Cinematic color grading & audio mastering",
        "Revisions: 4"
      ]
    },
    {
      id: "monthly-creator-partnership",
      category: "Video Post-Production",
      categoryIcon: "🎬",
      name: "Monthly Creator Partnership",
      price: 0,
      priceUSD: 0,
      isCustom: true,
      unit: "Custom",
      delivery: "Monthly Retainer",
      badge: "Dedicated Team",
      description: "Billed monthly · Dedicated editor & strategist for creators and brands.",
      features: [
        "Dedicated video editor & strategist",
        "Unlimited video length & revisions",
        "Priority 24-48h turnarounds",
        "Direct Slack / WhatsApp channel access"
      ]
    },

    // 💻 2. Web Design & Development
    {
      id: "landing-page",
      category: "Website Design & Development",
      categoryIcon: "💻",
      name: "Landing Page",
      price: 4999,
      priceUSD: 149,
      unit: "/ project",
      delivery: "3 Days",
      description: "Single-page responsive landing page engineered to capture leads and drive sales.",
      features: [
        "Single High-Converting Landing Page",
        "100/100 Mobile & Desktop Speed",
        "WhatsApp & Lead Form Integration",
        "Custom UI/UX Animation",
        "On-Page SEO Setup"
      ]
    },
    {
      id: "ecommerce-store",
      category: "Website Design & Development",
      categoryIcon: "💻",
      name: "Corporate / D2C Storefront",
      price: 12999,
      priceUSD: 349,
      unit: "/ project",
      delivery: "5-7 Days",
      popular: true,
      badge: "Most Popular",
      description: "Full-featured online store with payment gateway, product catalog, cart, and order system.",
      features: [
        "Up to 5-7 Custom Pages",
        "E-Commerce & Payment Gateway Setup",
        "Product Catalog & Cart Logic",
        "Admin CMS Dashboard",
        "Mobile-First Responsive"
      ]
    },
    {
      id: "full-web-portal",
      category: "Website Design & Development",
      categoryIcon: "💻",
      name: "Full Web System & Portal",
      price: 24999,
      priceUSD: 699,
      unit: "/ project",
      delivery: "10-14 Days",
      description: "Custom SaaS portal, multi-role client/staff dashboard with realtime database & live chat.",
      features: [
        "Firebase Auth & Role-Based User Portals",
        "Real-Time Firestore Database Integration",
        "Admin, Client & Staff Dashboards",
        "Live Chat & File Tracking System",
        "Dedicated Support & Deployment"
      ]
    },
    {
      id: "web-custom-system",
      category: "Website Design & Development",
      categoryIcon: "💻",
      name: "Custom Web & Enterprise System",
      price: 0,
      priceUSD: 0,
      isCustom: true,
      unit: "Custom",
      delivery: "Milestone Based",
      badge: "Enterprise",
      description: "Milestone based · Dedicated full-stack software engineer & designer.",
      features: [
        "Dedicated full-stack software engineer & designer",
        "Custom system architecture, database & API integrations",
        "SaaS platforms, CRM dashboards & portal development",
        "Direct Slack / WhatsApp engineering channel access"
      ]
    },

    // 📈 3. Paid Advertising & Growth
    {
      id: "paid-ads-setup",
      category: "Paid Advertising & Growth",
      categoryIcon: "📈",
      name: "Paid Ad Setup & Creatives",
      price: 7999,
      priceUSD: 199,
      unit: "/ campaign",
      delivery: "3-5 Days",
      description: "Data-driven Meta (FB/IG) & Google ad campaign setup with 3 direct-response video creatives.",
      features: [
        "Meta (FB/IG) & Google Ad Campaign Setup",
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
      priceUSD: 399,
      unit: "/ month",
      delivery: "Monthly Retainer",
      popular: true,
      badge: "Best ROI",
      description: "All-in-one monthly growth partnership: 12 edited videos, SEO, thumbnails & ad management.",
      features: [
        "12 Reels / Shorts Editing per month",
        "YouTube Channel SEO & Thumbnail Design",
        "Meta & Google Paid Ads Management",
        "Monthly Strategy & Analytics Reports"
      ]
    },
    {
      id: "ads-scale-engine",
      category: "Paid Advertising & Growth",
      categoryIcon: "📈",
      name: "Multi-Platform Scale Engine",
      price: 24999,
      priceUSD: 699,
      unit: "/ month",
      delivery: "7-10 Days / Ongoing",
      description: "High-volume acquisition engine combining omni-channel paid media and rapid creative iteration.",
      features: [
        "Meta + Google + YouTube Ads Management",
        "8 Direct-Response Video Ad Creatives",
        "Continuous A/B Creative Testing & Retargeting",
        "Custom Tracking Pixel, CAPI & Funnel Analytics"
      ]
    },
    {
      id: "growth-custom-enterprise",
      category: "Paid Advertising & Growth",
      categoryIcon: "📈",
      name: "Custom Enterprise Growth Partner",
      price: 0,
      priceUSD: 0,
      isCustom: true,
      unit: "Custom",
      delivery: "Monthly Retainer",
      badge: "VIP Scale",
      description: "Billed monthly · Dedicated media buyer & ad creative director.",
      features: [
        "Dedicated performance marketing director & ad strategist",
        "High-budget omni-channel scaling (Meta, Google, YouTube, TikTok)",
        "Weekly executive ROAS & attribution audits",
        "Direct Slack / WhatsApp 24/7 priority channel access"
      ]
    },

    // 📣 4. Social Media Management
    {
      id: "social-essential",
      category: "Social Media Management",
      categoryIcon: "📣",
      name: "Essential Social Presence",
      price: 6999,
      priceUSD: 189,
      unit: "/ month",
      delivery: "Monthly Retainer",
      description: "Consistent social presence with high-retention reels, graphic creatives, and caption strategy.",
      features: [
        "12 High-Retention Reels/Shorts + Static Graphics",
        "Content Calendar, Copywriting & Hashtags",
        "Monthly Performance & Growth Insights",
        "Instagram & Facebook Management"
      ]
    },
    {
      id: "social-omnichannel",
      category: "Social Media Management",
      categoryIcon: "📣",
      name: "Omnichannel Growth Engine",
      price: 12999,
      priceUSD: 349,
      unit: "/ month",
      delivery: "Monthly Retainer",
      popular: true,
      badge: "Most Popular",
      description: "Aggressive multi-platform content engine engineered to build authority and grow followers.",
      features: [
        "20 Vertical Videos (Reels, TikTok, Shorts)",
        "Complete YouTube Channel SEO & Custom Thumbnails",
        "Active Community Engagement & Comment Moderation",
        "Bi-Weekly Strategy Calls & Trend Adaptation"
      ]
    },
    {
      id: "social-youtube-authority",
      category: "Social Media Management",
      categoryIcon: "📣",
      name: "YouTube Authority & Domination",
      price: 18999,
      priceUSD: 499,
      unit: "/ month",
      delivery: "Monthly Retainer",
      description: "End-to-end management for YouTube channels looking to scale subscribers and watch time.",
      features: [
        "4 Long-Form YouTube Edits + 16 Short Repurposed Cuts",
        "High-CTR Custom Thumbnails & Title A/B Testing",
        "Complete YouTube SEO, Descriptions & Chapters",
        "Dedicated Social Manager & Channel Audits"
      ]
    },
    {
      id: "social-custom-partnership",
      category: "Social Media Management",
      categoryIcon: "📣",
      name: "Custom Brand Authority Partnership",
      price: 0,
      priceUSD: 0,
      isCustom: true,
      unit: "Custom",
      delivery: "Monthly Retainer",
      badge: "Full Takeover",
      description: "Billed monthly · Dedicated social media team, viral strategy & production.",
      features: [
        "Dedicated social media team (strategist, editor, designer)",
        "End-to-end multi-platform takeover (IG, YT, LinkedIn, X, FB)",
        "Custom content production schedules & viral format tests",
        "24/7 Priority Slack / WhatsApp communication"
      ]
    }
  ];

  const STORAGE_KEY = 'editzaar_dynamic_services';
  const CURRENCY_KEY = 'editzaar_preferred_currency';

  // Central System Configuration (Local & Production Ready)
  window.EDITZAAR_CONFIG = {
    upi: {
      vpa: 'nbikram704@okhdfcbank', // Change to editzaar@ybl / PhonePe Business VPA when ready
      name: 'Bikram Nath',          // Merchant / Account Holder Name
      mc: '7392'                   // Digital Services Merchant Category Code (Zero warning)
    },
    telegram: {
      botToken: '8981464059:AAGGj-_U6FGdN9ahEOgvezgFRvz98TGmpYQ', // Free Bot token from @BotFather
      adminChatId: '6432944929',                                   // Admin Telegram Chat ID (Bikram Nath)
      enabled: true
    },
    googleDrive: {
      rootFolderId: '',             // 5TB Google Drive Parent Folder ID
      serviceAccountEmail: '',      // Google Cloud Service Account
      folderPattern: 'Agency Projects/{client_name}/Project_{project_id}'
    },
    tax: {
      gstDomesticRate: 0.18,        // 18% GST for Indian Domestic Clients
      gstExportLutRate: 0.00        // 0% GST (Zero-Rated Supply) for Export under LUT RFD-11
    }
  };

  // PayPal Configuration
  window.EDITZAAR_PAYPAL = {
    clientId: 'BAAOOLXUc3ZolrTYVFM-EqsNXKorDGA_jqwfsdy7gAllTNKYDFtl-L5XxridH0oDKsSm67AtHmLoKqpaew',
    env: 'sandbox',
    currency: 'USD'
  };

  window.EditzaarServices = {
    /**
     * Generate official Merchant UPI intent URL (with zero-warning &mc=7392 code)
     */
    getMerchantUpiUrl: function (amount, note) {
      const upi = window.EDITZAAR_CONFIG.upi;
      const amt = parseInt(amount) || 1;
      const cleanNote = encodeURIComponent(note || 'Editzaar Project');
      const cleanName = encodeURIComponent(upi.name);
      return `upi://pay?pa=${upi.vpa}&pn=${cleanName}&am=${amt}&cu=INR&tn=${cleanNote}&mc=${upi.mc || '7392'}`;
    },

    /**
     * Compute Dynamic Tax & GST/LUT based on currency / country
     */
    calculateTax: function (basePrice, currency) {
      const curr = currency || this.getCurrency();
      const base = parseInt(basePrice) || 0;
      if (curr === 'USD' || curr === 'EUR') {
        // International Client: 0% GST under LUT (Export of Services)
        return {
          currency: curr,
          basePrice: base,
          gstRate: 0,
          gstAmount: 0,
          totalPrice: base,
          isExport: true,
          lutNote: '0% GST (Export of Services under LUT - Form GST RFD-11)'
        };
      }
      // Indian Domestic: 18% GST
      const gst = Math.round(base * 0.18);
      return {
        currency: 'INR',
        basePrice: base,
        gstRate: 0.18,
        gstAmount: gst,
        totalPrice: base + gst,
        isExport: false,
        lutNote: '18% GST Applicable (Standard CGST+SGST/IGST)'
      };
    },
    /**
     * Calculate automatic suggested USD price from INR
     */
    calculateAutoUSD: function (inrPrice) {
      const num = parseInt(inrPrice) || 0;
      if (num <= 0) return 0;
      return Math.max(1, Math.round(num / 80));
    },

    /**
     * Get active currency (INR or USD)
     */
    getCurrency: function () {
      try {
        const saved = localStorage.getItem(CURRENCY_KEY);
        if (saved === 'INR' || saved === 'USD') return saved;
      } catch (e) {}
      return 'INR';
    },

    /**
     * Set active currency (INR or USD)
     */
    setCurrency: function (curr) {
      const c = (curr === 'USD') ? 'USD' : 'INR';
      try {
        localStorage.setItem(CURRENCY_KEY, c);
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('editzaar:currency_changed', { detail: { currency: c } }));
      return c;
    },

    /**
     * Get all active services (from cache/storage or defaults)
     */
    getAll: function () {
      try {
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const merged = [...parsed];
            DEFAULT_SERVICES.forEach(def => {
              const exists = merged.find(m => m.id === def.id);
              if (!exists) {
                merged.push(def);
              }
            });
            return merged.map(s => ({
              ...s,
              priceUSD: s.priceUSD !== undefined ? s.priceUSD : window.EditzaarServices.calculateAutoUSD(s.price)
            }));
          }
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
      if (serviceObj.priceUSD === undefined && serviceObj.price !== undefined) {
        serviceObj.priceUSD = this.calculateAutoUSD(serviceObj.price);
      }
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
     * Update price (INR), priceUSD (International), and turnaround for a service
     */
    updatePrice: function (id, newPriceINR, newPriceUSD, newDelivery) {
      const all = [...this.getAll()];
      const item = all.find(s => s.id === id);
      if (item) {
        if (newPriceINR !== undefined) item.price = parseInt(newPriceINR) || 0;
        if (newPriceUSD !== undefined) {
          item.priceUSD = parseInt(newPriceUSD) || this.calculateAutoUSD(item.price);
        } else if (newPriceINR !== undefined && item.priceUSD === undefined) {
          item.priceUSD = this.calculateAutoUSD(newPriceINR);
        }
        if (newDelivery !== undefined) item.delivery = newDelivery;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        this.notifySubscribers(all);
      }
      return all;
    },

    delete: function (id) {
      let all = this.getAll().filter(s => s.id !== id);
      if (all.length === 0) all = DEFAULT_SERVICES;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      this.notifySubscribers(all);
      return all;
    },

    /**
     * Save the entire custom services catalog (used by Admin CMS)
     */
    saveCustomCatalog: function (allList) {
      if (Array.isArray(allList)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allList));
        this.notifySubscribers(allList);
        return allList;
      }
      return this.getAll();
    },

    /**
     * Update any fields of a service by id
     */
    updateService: function (id, updates) {
      const all = [...this.getAll()];
      const idx = all.findIndex(s => s.id === id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        this.notifySubscribers(all);
      }
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
    { code: "AGENCY30", discountType: "percent", value: 30, description: "30% Partner / Agency Retainer Discount", active: true, maxUses: 20 },
    { code: "BOSS", discountType: "percent", value: 100, description: "100% Full Discount Promo", active: true, maxUses: 100 },
    { code: "VIP50", discountType: "percent", value: 50, description: "50% VIP Exclusive Discount", active: true, maxUses: 50 }
  ];

  const COUPONS_STORAGE_KEY = 'editzaar_dynamic_coupons';
  // BroadcastChannel for instant cross-tab sync
  let _couponChannel = null;
  try {
    _couponChannel = new BroadcastChannel('editzaar_coupons_channel');
    _couponChannel.onmessage = function (e) {
      if (e.data && Array.isArray(e.data)) {
        _cachedCoupons = e.data;
        if (window.EditzaarCoupons) {
          window.EditzaarCoupons.notifySubscribers(e.data);
        }
      }
    };
  } catch (err) {}

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
        if (_couponChannel) _couponChannel.postMessage(all);
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
        if (_couponChannel) _couponChannel.postMessage(all);
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
