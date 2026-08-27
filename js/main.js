/* ============================================================
   EDITZAAR — main.js
   Unified Master Interactive Engine with Carousel Handlers
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. Custom Cursor Glow ── */
  var glow = document.getElementById('cglow');
  var dot  = document.getElementById('cdot');

  if (glow && dot && window.innerWidth > 768) {
    document.addEventListener('mousemove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
      dot.style.left  = e.clientX + 'px';
      dot.style.top   = e.clientY + 'px';
    });
  }


  /* ── 2. Dynamic Unique Multi-Color Gradient Typing Headline Effect ── */
  var typingTarget = document.getElementById('typing-target');
  if (typingTarget) {
    var words = [
      { text: 'impossible to ignore.', cls: 'grad-gold',    cursorColor: '#FFB800' },
      { text: 'stand out & scale.',    cls: 'grad-emerald', cursorColor: '#28C840' },
      { text: 'go viral.',             cls: 'grad-cyan',    cursorColor: '#00D2FF' },
      { text: 'unforgettable.',        cls: 'grad-rose',    cursorColor: '#F43F5E' }
    ];
    var wordIndex  = 0;
    var charIndex  = 0;
    var isDeleting = false;

    function applyGradient(item) {
      typingTarget.className = 'gold-italic ' + item.cls;
    }

    function typeLoop() {
      if (!typingTarget) return;

      var currentObj    = words[wordIndex];
      var currentWord   = currentObj.text;
      var currentCursor = currentObj.cursorColor;
      
      applyGradient(currentObj);
      var cursor = '<span class="cursor-blink" style="background:' + currentCursor + ';box-shadow:0 0 12px ' + currentCursor + '"></span>';

      if (!isDeleting) {
        charIndex++;
        typingTarget.innerHTML = currentWord.substring(0, charIndex) + cursor;

        if (charIndex === currentWord.length) {
          isDeleting = true;
          setTimeout(typeLoop, 2000);
          return;
        }
        setTimeout(typeLoop, 70);

      } else {
        charIndex--;
        typingTarget.innerHTML = currentWord.substring(0, charIndex) + cursor;

        if (charIndex === 0) {
          isDeleting = false;
          wordIndex  = (wordIndex + 1) % words.length;
          applyGradient(words[wordIndex]);
          setTimeout(typeLoop, 420);
          return;
        }
        setTimeout(typeLoop, 38);
      }
    }

    typeLoop();
  }


  /* ── 3. Scroll Reveal (IntersectionObserver) ── */
  var revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0) {
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });

      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }


  /* ── 4. Animated Number Counters ── */
  var countEls = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    var target   = parseInt(el.getAttribute('data-count'), 10);
    var suffix   = el.getAttribute('data-suffix') || '';
    var duration = 1800;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed  = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  if (countEls.length > 0 && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    countEls.forEach(function (el) {
      counterObserver.observe(el);
    });
  }


  /* ── 5. Carousel Nav Buttons (Next / Prev) ── */
  var carouselBtnBtns = document.querySelectorAll('.carousel-nav-btn');

  carouselBtnBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('data-carousel');
      var track = document.getElementById(targetId);
      if (!track) return;

      var scrollAmount = track.clientWidth * 0.85;
      if (btn.classList.contains('prev')) {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    });
  });


  /* ── 6. Booking Form Plan Selector ── */
  var planOpts = document.querySelectorAll('#planSel .plan-opt');

  if (planOpts.length > 0) {
    planOpts.forEach(function (opt) {
      opt.addEventListener('click', function () {
        planOpts.forEach(function (o) { o.classList.remove('sel'); });
        opt.classList.add('sel');
      });
    });
  }


  /* ── 7. Booking Form WhatsApp Submit ── */
  var submitBtn = document.getElementById('submitBtn');

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      var name    = (document.getElementById('fname').value   || '').trim();
      var phone   = (document.getElementById('fphone').value  || '').trim();
      var message = (document.getElementById('fmsg').value    || '').trim();

      var selectedPlan = '';
      var selOpt = document.querySelector('#planSel .plan-opt.sel');
      if (selOpt) selectedPlan = selOpt.getAttribute('data-plan') || '';

      if (!name) {
        alert('Please enter your name.');
        return;
      }

      var text = [
        'Hi Editzaar! I want to book a project.',
        'Plan: '    + (selectedPlan || 'Not selected'),
        'Name: '    + (name         || 'Not provided'),
        'Phone: '   + (phone        || 'Not provided'),
        'Project: ' + (message      || 'No details yet')
      ].join('\n');

      var encoded  = encodeURIComponent(text);
      var waNumber = '919476766340';
      window.open('https://wa.me/' + waNumber + '?text=' + encoded, '_blank');
    });
  }


  /* ── 8. "Book Similar" Buttons → WhatsApp ── */
  var bookSimilarBtns = document.querySelectorAll('.vbtn[data-wa]');

  bookSimilarBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var videoTitle = btn.getAttribute('data-wa') || '';
      var text = 'Hi Editzaar! I saw your work on your website and I want something similar to: "' + videoTitle + '". Can we discuss?';
      var encoded  = encodeURIComponent(text);
      var waNumber = '919476766340';
      window.open('https://wa.me/' + waNumber + '?text=' + encoded, '_blank');
    });
  });


  /* ── 9. Mobile Navigation Toggle & Outside Click Handler ── */
  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('open');
    });

    // Close menu when clicking outside anywhere on document
    document.addEventListener('click', function (e) {
      if (navLinks.classList.contains('open')) {
        if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
          navLinks.classList.remove('open');
          navToggle.classList.remove('open');
        }
      }
    });

    // Close menu when tapping/clicking any menu link
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      });
    });

    // Close menu on Escape key press
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      }
    });
  }


  /* ============================================================
     9. GLOBAL INTERACTIVE CHECKOUT & ONBOARDING MODAL ENGINE
     ============================================================ */
  function ensureCheckoutModal() {
    if (document.getElementById('checkoutModal')) return;

    var modalHtml = `
    <div class="checkout-modal" id="checkoutModal">
      <div class="checkout-box">
        <button class="checkout-close" id="btnCloseCheckout" title="Close">✕</button>

        <h3 style="font-family:var(--font-h);font-size:2rem;margin-bottom:6px;">Project Checkout &amp; <em>Onboarding</em></h3>
        <p style="color:var(--t2);font-size:0.9rem;margin-bottom:24px;line-height:1.6;">Review your price breakdown, advance deposit, scan the dynamic auto-amount UPI QR, and submit project details.</p>

        <!-- PACKAGE SUMMARY BREAKDOWN -->
        <div class="summary-card">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.12em;color:var(--gold);margin-bottom:12px;font-weight:700;">Selected Package Breakdown</div>
          <div class="summary-row"><span>Package Name</span><strong id="chkPkgName" style="color:#fff;">Custom Project</strong></div>
          <div class="summary-row"><span>Base Amount</span><span id="chkBasePrice">₹1,000</span></div>
          <div class="summary-row" id="chkDiscountRow" style="display:none;color:#28C840;font-weight:600;">
            <span>Coupon Discount (<span id="chkDiscountCode"></span>)</span>
            <span id="chkDiscountAmt">-₹0</span>
          </div>
          <div class="summary-row"><span>GST (18%)</span><span id="chkGst">₹180</span></div>
          <div class="summary-row total"><span>Total Package Value</span><strong id="chkTotal" style="color:var(--gold);">₹1,180</strong></div>

          <!-- COUPON PROMO CODE INPUT -->
          <div style="margin-top:12px;padding:10px 12px;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:8px;">
            <div style="font-size:11px;color:var(--gold);text-transform:uppercase;letter-spacing:0.08em;font-weight:700;margin-bottom:6px;">🎟️ Have a Coupon Code?</div>
            <div style="display:flex;gap:8px;align-items:center;">
              <input type="text" id="chkCouponCode" placeholder="e.g. WELCOME10 / LAUNCH20" style="flex:1;text-transform:uppercase;padding:7px 12px;background:rgba(0,0,0,0.4);border:1px solid var(--border);border-radius:6px;color:var(--t1);font-family:monospace;font-weight:700;outline:none;font-size:0.9rem;"/>
              <button type="button" class="btn-gold btn-sm" id="btnApplyCoupon" onclick="window.applyCheckoutCoupon()">Apply</button>
            </div>
            <div id="chkCouponStatusMsg" style="font-size:0.82rem;margin-top:6px;display:none;"></div>
          </div>

          <!-- FLEXIBLE PAYMENT AMOUNT CUSTOMIZER -->
          <div style="margin-top:16px;padding-top:16px;border-top:1px dashed var(--gold-border);">
            <div style="font-size:12px;color:var(--gold);text-transform:uppercase;letter-spacing:0.08em;font-weight:700;margin-bottom:10px;">💳 Choose Amount to Pay Now</div>
            
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
              <button type="button" class="pay-preset-btn active" id="btnPreset50" onclick="window.setCheckoutDeposit('50%')">50% Advance (<span id="txtPreset50">₹590</span>)</button>
              <button type="button" class="pay-preset-btn" id="btnPreset100" onclick="window.setCheckoutDeposit('100%')">100% Full Payment (<span id="txtPreset100">₹1,180</span>)</button>
              <button type="button" class="pay-preset-btn" id="btnPresetCustom" onclick="window.setCheckoutDeposit('custom')">Custom Amount ✏️</button>
            </div>

            <div style="background:rgba(40,200,64,0.08);border:1px solid rgba(40,200,64,0.35);padding:12px 16px;border-radius:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
              <div>
                <label for="chkCustomPayAmount" style="font-size:11px;color:var(--t2);text-transform:uppercase;letter-spacing:0.08em;font-weight:600;display:block;margin-bottom:4px;">Deposit Amount (₹):</label>
                <input type="number" id="chkCustomPayAmount" style="background:#0a0a0e;border:1.5px solid var(--gold);color:var(--gold);font-size:1.25rem;font-weight:700;padding:8px 14px;border-radius:8px;width:160px;outline:none;" min="100" oninput="window.onCustomDepositChange(this.value)"/>
              </div>
              <div style="text-align:right;">
                <div style="font-size:11px;color:var(--t2);text-transform:uppercase;letter-spacing:0.06em;">Remaining Balance:</div>
                <div style="font-size:1.15rem;font-weight:700;color:var(--t1);" id="chkRemainingBalance">₹590</div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="field">
            <label for="chkName">Full Name *</label>
            <input type="text" id="chkName" placeholder="John Doe" required/>
          </div>
          <div class="field">
            <label for="chkPhone">WhatsApp / Phone *</label>
            <input type="tel" id="chkPhone" placeholder="+91 9476766340" required/>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="field">
            <label for="chkEmail">Email Address *</label>
            <input type="email" id="chkEmail" placeholder="you@example.com" required/>
          </div>
          <div class="field">
            <label for="chkBrand">Brand / Company Name</label>
            <input type="text" id="chkBrand" placeholder="e.g. Acme Media / Personal Brand"/>
          </div>
        </div>

        <!-- OPTIONAL GSTIN FIELD -->
        <div class="field">
          <label for="chkGstin">Client GSTIN Number (Optional — For Tax Input Credit)</label>
          <input type="text" id="chkGstin" placeholder="e.g. 36AAAAA0000A1Z5 (Optional)"/>
        </div>

        <div class="field">
          <label for="chkBrief">Project Requirements &amp; Instructions *</label>
          <textarea id="chkBrief" placeholder="Describe your video style, reference links, hook preferences, target audience, audio instructions..."></textarea>
        </div>

        <div class="field">
          <label for="chkFootage">Raw Footage / Asset Link (Google Drive / WeTransfer / Dropbox)</label>
          <input type="url" id="chkFootage" placeholder="https://drive.google.com/..."/>
        </div>

        <!-- DYNAMIC AUTO-AMOUNT UPI QR CODE PAYMENT BOX (Design 2) -->
        <div class="luxury-upi-card" style="background:linear-gradient(135deg,rgba(255,255,255,0.03) 0%,rgba(0,0,0,0.5) 100%);border:1px solid rgba(255,184,0,0.35);border-radius:16px;padding:20px 22px;margin-top:16px;margin-bottom:20px;box-shadow:0 10px 30px rgba(0,0,0,0.35);">
          <div style="display:grid;grid-template-columns:1fr 180px;gap:20px;align-items:center;" class="upi-grid-wrap">
            <div>
              <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:var(--gold);font-weight:800;margin-bottom:10px;">DYNAMIC AUTO-AMOUNT UPI QR CODE</div>
              <div style="display:inline-flex;align-items:center;background:#b88200;color:#ffffff;font-weight:700;font-size:0.84rem;padding:5px 14px;border-radius:20px;margin-bottom:12px;letter-spacing:0.02em;">
                UPI ID: nbikram704@okhdfcbank
              </div>
              <div style="font-size:0.86rem;color:var(--t2);line-height:1.7;">
                <div>• <strong>Account Name:</strong> Bikram Nath</div>
                <div>• <strong>Pre-filled 50% Advance:</strong> <strong id="chkAdvancePayText" style="color:#28C840;font-weight:700;">₹590</strong></div>
                <div style="font-style:italic;color:var(--t3);font-size:0.8rem;margin-top:2px;">• Scanning this QR pre-fills the exact advance deposit automatically in your GPay or PhonePe app!</div>
              </div>
              <a id="btnMobileUpi" href="upi://pay?pa=nbikram704@okhdfcbank&pn=Bikram%20Nath&am=590&cu=INR&tn=Editzaar%20Project" target="_blank" style="display:inline-flex;align-items:center;justify-content:center;gap:6px;background:#28C840;color:#ffffff;font-weight:700;font-size:0.88rem;padding:10px 18px;border-radius:10px;text-decoration:none;margin-top:14px;box-shadow:0 4px 14px rgba(40,200,64,0.35);transition:all 0.2s;">
                ⚡ Open GPay / PhonePe (Pre-filled ₹<span id="btnUpiAmt">590</span>) →
              </a>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
              <div style="background:#ffffff;border:2px solid #FFB800;border-radius:14px;padding:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(255,184,0,0.25);width:170px;">
                <img id="dynamicQrImg" 
                     src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi%3A%2F%2Fpay%3Fpa%3Dnbikram704%40okhdfcbank%26pn%3DBikram%20Nath%26am%3D590%26cu%3DINR%26tn%3DEditzaar%20Project" 
                     alt="Pre-filled UPI Payment QR Code" 
                     onerror="this.src='https://quickchart.io/qr?text=' + encodeURIComponent('upi://pay?pa=nbikram704@okhdfcbank&pn=Bikram%20Nath&am=' + (document.getElementById('btnUpiAmt')?.textContent || '590') + '&cu=INR&tn=Editzaar%20Project');"
                     style="width:145px;height:145px;display:block;object-fit:contain;border-radius:4px;"/>
                <div style="font-size:10px;font-weight:800;color:#111116;text-transform:uppercase;letter-spacing:0.04em;margin-top:6px;text-align:center;" id="qrBadgeText">PRE-FILLED 50% ADVANCE QR</div>
              </div>
            </div>
          </div>
        </div>

        <button class="btn-gold-brand" style="width:100%;margin-top:24px;justify-content:center;" id="btnConfirmCheckout">Confirm &amp; Submit Project Brief →</button>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    var modal = document.getElementById('checkoutModal');
    var closeBtn = document.getElementById('btnCloseCheckout');
    if (closeBtn) closeBtn.addEventListener('click', function () { modal.classList.remove('open'); });
    if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('open'); });

    var confirmBtn = document.getElementById('btnConfirmCheckout');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        var name    = (document.getElementById('chkName').value   || '').trim();
        var phone   = (document.getElementById('chkPhone').value  || '').trim();
        var email   = (document.getElementById('chkEmail').value  || '').trim();
        var brand   = (document.getElementById('chkBrand').value  || '').trim();
        var gstin   = (document.getElementById('chkGstin').value  || '').trim();
        var brief   = (document.getElementById('chkBrief').value  || '').trim();
        var footage = (document.getElementById('chkFootage').value|| '').trim();

        if (!name || !phone || !email || !brief) {
          alert('Please fill in your Full Name, Phone, Email, and Project Brief requirements.');
          return;
        }

        var pkgName = window._activeCheckoutPackage ? window._activeCheckoutPackage.name : 'Custom Project';
        var basePrice = window._activeCheckoutPackage ? window._activeCheckoutPackage.basePrice : 1000;
        var delivery = window._activeCheckoutPackage ? window._activeCheckoutPackage.delivery : '48 Hours';

        var gst = Math.round(basePrice * 0.18);
        var total = basePrice + gst;
        var enteredPaid = parseInt(document.getElementById('chkCustomPayAmount').value) || Math.round(total * 0.5);
        var remaining = Math.max(0, total - enteredPaid);

        var message = `🚨 *NEW PROJECT ORDER & CHECKOUT* 🚨\n\n` +
                      `📦 *PACKAGE:* ${pkgName}\n` +
                      `⏱ *Est. Delivery:* ${delivery}\n` +
                      `💵 *Base Price:* ₹${basePrice.toLocaleString()}\n` +
                      `🧾 *GST (18%):* ₹${gst.toLocaleString()}\n` +
                      `💰 *Total Package Value:* ₹${total.toLocaleString()}\n` +
                      `💳 *Amount Paying Now:* ₹${enteredPaid.toLocaleString()}\n` +
                      `⏳ *Remaining Balance:* ₹${remaining.toLocaleString()}\n\n` +
                      `👤 *CLIENT DETAILS:*\n` +
                      `• Name: ${name}\n` +
                      `• Phone: ${phone}\n` +
                      `• Email: ${email}\n` +
                      `• Brand/Company: ${brand || 'N/A'}\n` +
                      `• Client GSTIN: ${gstin || 'N/A (Individual)'}\n\n` +
                      `💳 *UPI PAYMENT ID:* nbikram704@okhdfcbank (Bikram Nath)\n\n` +
                      `📝 *REQUIREMENT BRIEF:*\n${brief}\n\n` +
                      `📁 *RAW FOOTAGE / ASSET LINK:*\n${footage || 'Not attached (will upload in portal)'}\n\n` +
                      `-----------------------------------\n` +
                      `Please confirm my payment deposit of ₹${enteredPaid.toLocaleString()} and generate my Tax Invoice!`;

        window.open(`https://wa.me/919476766340?text=${encodeURIComponent(message)}`, '_blank');
        modal.classList.remove('open');
      });
    }
  }

  window.updateCheckoutUpi = function (amount) {
    var amt = parseInt(amount) || 1;
    var pkgName = window._activeCheckoutPackage ? window._activeCheckoutPackage.name : 'Project';
    var total = window._activeCheckoutTotal || (amt * 2);
    var remaining = Math.max(0, total - amt);

    var elAdvPay = document.getElementById('chkAdvancePayText');
    var elUpiAmt = document.getElementById('btnUpiAmt');
    var elRem = document.getElementById('chkRemainingBalance');
    var elQr = document.getElementById('dynamicQrImg');
    var elMobileUpi = document.getElementById('btnMobileUpi');
    var elQrBadge = document.getElementById('qrBadgeText');

    if (elAdvPay) elAdvPay.textContent = '₹' + amt.toLocaleString();
    if (elUpiAmt) elUpiAmt.textContent = amt.toLocaleString();
    if (elRem) elRem.textContent = '₹' + remaining.toLocaleString();
    if (elQrBadge) elQrBadge.textContent = `PRE-FILLED ₹${amt.toLocaleString()} QR`;

    var upiUrl = `upi://pay?pa=nbikram704@okhdfcbank&pn=Bikram%20Nath&am=${amt}&cu=INR&tn=${encodeURIComponent('Editzaar: ' + pkgName)}`;
    var qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;

    if (elQr) elQr.src = qrApiUrl;
    if (elMobileUpi) elMobileUpi.href = upiUrl;
  };

  window.setCheckoutDeposit = function (type) {
    var total = window._activeCheckoutTotal || 1180;
    var amt = Math.round(total * 0.5);

    document.querySelectorAll('.pay-preset-btn').forEach(function(b) { b.classList.remove('active'); });

    var input = document.getElementById('chkCustomPayAmount');

    if (type === '50%') {
      amt = Math.round(total * 0.5);
      var btn = document.getElementById('btnPreset50');
      if (btn) btn.classList.add('active');
    } else if (type === '100%') {
      amt = total;
      var btn = document.getElementById('btnPreset100');
      if (btn) btn.classList.add('active');
    } else {
      var btn = document.getElementById('btnPresetCustom');
      if (btn) btn.classList.add('active');
      if (input) { input.focus(); input.select(); }
      return;
    }

    if (input) input.value = amt;
    window.updateCheckoutUpi(amt);
  };

  window.onCustomDepositChange = function (val) {
    var amt = parseInt(val) || 0;
    document.querySelectorAll('.pay-preset-btn').forEach(function(b) { b.classList.remove('active'); });
    var btn = document.getElementById('btnPresetCustom');
    if (btn) btn.classList.add('active');
    window.updateCheckoutUpi(amt);
  };

  
  window._appliedCoupon = null;

  window.applyCheckoutCoupon = async function() {
    const codeInp = document.getElementById('chkCouponCode');
    const msgEl = document.getElementById('chkCouponStatusMsg');
    const code = (codeInp ? codeInp.value : '').trim().toUpperCase();
    const basePrice = window._activeCheckoutPackage ? window._activeCheckoutPackage.basePrice : 1000;

    if (!code) {
      if (msgEl) {
        msgEl.style.display = 'block';
        msgEl.style.color = '#ff5555';
        msgEl.textContent = 'Please enter a coupon code.';
      }
      return;
    }

    if (msgEl) {
      msgEl.style.display = 'block';
      msgEl.style.color = 'var(--gold)';
      msgEl.textContent = 'Validating coupon code... ⏳';
    }

    let res = null;
    if (typeof window.validateCouponWithFirebase === 'function') {
      res = await window.validateCouponWithFirebase(code, basePrice);
    } else if (window.EditzaarCoupons) {
      res = window.EditzaarCoupons.validate(code, basePrice);
    }

    if (!res || !res.valid) {
      if (msgEl) {
        msgEl.style.display = 'block';
        msgEl.style.color = '#ff5555';
        msgEl.textContent = (res && res.message) ? res.message : `Coupon "${code}" is invalid or expired.`;
      }
      return;
    }

    window._appliedCoupon = res;
    if (msgEl) {
      msgEl.style.display = 'block';
      msgEl.style.color = '#28C840';
      msgEl.innerHTML = `${res.message} <button type="button" onclick="window.removeCheckoutCoupon()" style="background:none;border:none;color:#ff5555;cursor:pointer;font-size:0.8rem;text-decoration:underline;margin-left:6px;">[Remove]</button>`;
    }

    window.recalculateCheckoutTotals();
  };

  window.removeCheckoutCoupon = function() {
    window._appliedCoupon = null;
    const codeInp = document.getElementById('chkCouponCode');
    const msgEl = document.getElementById('chkCouponStatusMsg');
    if (codeInp) codeInp.value = '';
    if (msgEl) {
      msgEl.style.display = 'none';
      msgEl.textContent = '';
    }
    window.recalculateCheckoutTotals();
  };

  window.recalculateCheckoutTotals = function() {
    const basePrice = window._activeCheckoutPackage ? window._activeCheckoutPackage.basePrice : 1000;
    const discountRow = document.getElementById('chkDiscountRow');
    const discountCodeEl = document.getElementById('chkDiscountCode');
    const discountAmtEl = document.getElementById('chkDiscountAmt');
    const elGst = document.getElementById('chkGst');
    const elTot = document.getElementById('chkTotal');
    const elTxt50 = document.getElementById('txtPreset50');
    const elTxt100 = document.getElementById('txtPreset100');

    let discount = 0;
    if (window._appliedCoupon && window._appliedCoupon.valid) {
      const val = parseInt(window._appliedCoupon.value) || 0;
      if (window._appliedCoupon.discountType === 'percent') {
        discount = Math.round(basePrice * (val / 100));
      } else {
        discount = Math.min(basePrice, val);
      }
      if (discountRow) discountRow.style.display = 'flex';
      if (discountCodeEl) discountCodeEl.textContent = window._appliedCoupon.code;
      if (discountAmtEl) discountAmtEl.textContent = '-₹' + discount.toLocaleString();
    } else {
      if (discountRow) discountRow.style.display = 'none';
    }

    const discountedBase = Math.max(0, basePrice - discount);
    const gst = Math.round(discountedBase * 0.18);
    const total = discountedBase + gst;
    const advance50 = Math.round(total * 0.5);

    window._activeCheckoutTotal = total;

    if (elGst) elGst.textContent = '₹' + gst.toLocaleString();
    if (elTot) elTot.textContent = '₹' + total.toLocaleString();
    if (elTxt50) elTxt50.textContent = '₹' + advance50.toLocaleString();
    if (elTxt100) elTxt100.textContent = '₹' + total.toLocaleString();

    window.setCheckoutDeposit('50%');
  };

  window.openCheckout = function (pName, price, deliveryTime) {
    ensureCheckoutModal();
    var priceNum = parseInt(price) || 1000;
    var gst = Math.round(priceNum * 0.18);
    var total = priceNum + gst;
    var advance50 = Math.round(total * 0.5);

    window._activeCheckoutPackage = { name: pName || 'Custom Project', basePrice: priceNum, delivery: deliveryTime || '48 Hours' };
    window._activeCheckoutTotal = total;

    var elPkg = document.getElementById('chkPkgName');
    var elBase = document.getElementById('chkBasePrice');
    var elGst = document.getElementById('chkGst');
    var elTot = document.getElementById('chkTotal');
    var elTxt50 = document.getElementById('txtPreset50');
    var elTxt100 = document.getElementById('txtPreset100');
    var elCustomInput = document.getElementById('chkCustomPayAmount');

    if (elPkg) elPkg.textContent = pName || 'Custom Project';
    if (elBase) elBase.textContent = '₹' + priceNum.toLocaleString();
    if (elGst) elGst.textContent = '₹' + gst.toLocaleString();
    if (elTot) elTot.textContent = '₹' + total.toLocaleString();
    if (elTxt50) elTxt50.textContent = '₹' + advance50.toLocaleString();
    if (elTxt100) elTxt100.textContent = '₹' + total.toLocaleString();
    if (elCustomInput) elCustomInput.value = advance50;

    window.setCheckoutDeposit('50%');

    var modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.add('open');
  };


  /* ============================================================
     10. GLOBAL HIGHLY-TRAINED PROFESSIONAL AI CHATBOT ENGINE
     ============================================================ */
  function ensureAiChatbot() {
    if (document.getElementById('editzaarAiChatbot')) return;

    var botHtml = `
    <div id="editzaarAiChatbot">
      <button class="ai-chatbot-fab" id="aiChatbotFab" title="Chat with Editzaar AI Assistant">
        🤖
        <div class="fab-badge"></div>
      </button>

      <div class="ai-chatbot-panel" id="aiChatbotPanel">
        <div class="ai-chat-header">
          <div class="ai-chat-header-info">
            <div class="ai-chat-avatar">🤖</div>
            <div>
              <div class="ai-chat-title">Editzaar AI Assistant</div>
              <div class="ai-chat-status"><span style="width:7px;height:7px;border-radius:50%;background:#28C840;display:inline-block;"></span> Online · Trained Agency AI</div>
            </div>
          </div>
          <button class="checkout-close" id="aiChatbotClose" style="position:static;font-size:1.2rem;" aria-label="Close Chat">✕</button>
        </div>

        <div class="ai-chat-body" id="aiChatMessages">
          <div class="ai-msg bot">
            <div class="ai-bubble">
              👋 <strong>Welcome to Editzaar!</strong><br/><br/>
              I am your 24/7 AI Agency Assistant, trained on all our <strong>creative services, website development, paid advertising, pricing, and project workflows</strong>.<br/><br/>
              How can we help scale your brand or content today?
            </div>
            <span class="ai-msg-time">Just now</span>
          </div>
        </div>

        <div class="ai-quick-chips">
          <span class="ai-chip" data-q="Tell me about Video Editing & Graphic Design">🎬 Video &amp; Design</span>
          <span class="ai-chip" data-q="Tell me about Website Development & SEO">💻 Websites &amp; SEO</span>
          <span class="ai-chip" data-q="Tell me about Paid Advertising & Performance Marketing">📈 Performance Ads</span>
          <span class="ai-chip" data-q="Tell me about Social Media Management">📣 Social Media</span>
          <span class="ai-chip" data-q="What are your packages and pricing?">💰 Pricing &amp; Plans</span>
          <span class="ai-chip" data-q="Can I see your previous work and portfolio?">📁 View Portfolio</span>
          <span class="ai-chip" data-q="What is your 4-step workflow and turnaround time?">⏱ Workflow &amp; Delivery</span>
          <span class="ai-chip" data-q="How do I book a project or contact founder?">💬 Book on WhatsApp</span>
        </div>

        <div class="ai-chat-input-row">
          <input type="text" class="ai-chat-input" id="aiChatInput" placeholder="Ask about services, pricing, turnaround, portfolio…"/>
          <button class="ai-chat-send" id="aiChatSend" title="Send message">➤</button>
        </div>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', botHtml);

    var fab = document.getElementById('aiChatbotFab');
    var panel = document.getElementById('aiChatbotPanel');
    var close = document.getElementById('aiChatbotClose');
    var input = document.getElementById('aiChatInput');
    var send = document.getElementById('aiChatSend');
    var msgsContainer = document.getElementById('aiChatMessages');

    if (fab && panel) {
      fab.addEventListener('click', function () { 
        panel.classList.toggle('open'); 
        if (panel.classList.contains('open') && input) input.focus(); 
      });
    }
    if (close && panel) {
      close.addEventListener('click', function () { panel.classList.remove('open'); });
    }

    // Quick chip clicks
    document.querySelectorAll('.ai-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var query = chip.getAttribute('data-q');
        if (query) handleUserQuestion(query);
      });
    });

    if (send && input) {
      send.addEventListener('click', function () {
        var text = input.value.trim();
        if (text) {
          input.value = '';
          handleUserQuestion(text);
        }
      });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var text = input.value.trim();
          if (text) {
            input.value = '';
            handleUserQuestion(text);
          }
        }
      });
    }

    function appendMessage(sender, htmlContent) {
      var timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      var div = document.createElement('div');
      div.className = 'ai-msg ' + sender;
      div.innerHTML = `<div class="ai-bubble">${htmlContent}</div><span class="ai-msg-time">${timeStr}</span>`;
      msgsContainer.appendChild(div);
      msgsContainer.scrollTop = msgsContainer.scrollHeight;
    }

    function handleUserQuestion(q) {
      appendMessage('user', q);

      // Typing animation
      var typingDiv = document.createElement('div');
      typingDiv.className = 'ai-msg bot';
      typingDiv.id = 'aiTypingIndicator';
      typingDiv.innerHTML = '<div class="ai-bubble" style="padding:8px 16px;"><span class="dot-pulse">Consulting Editzaar AI…</span></div>';
      msgsContainer.appendChild(typingDiv);
      msgsContainer.scrollTop = msgsContainer.scrollHeight;

      setTimeout(function () {
        var indicator = document.getElementById('aiTypingIndicator');
        if (indicator) indicator.remove();

        var botResponse = generateAiResponse(q.toLowerCase());
        appendMessage('bot', botResponse);
      }, 350);
    }

    function generateAiResponse(text) {
      // 1. GREETINGS / HELLO
      if (text === 'hi' || text === 'hello' || text === 'hey' || text === 'hola' || text.startsWith('good morning') || text.startsWith('good evening') || text.startsWith('greetings')) {
        return `👋 <strong>Hello! Great to connect with you.</strong><br/><br/>` +
               `At Editzaar, we provide end-to-end digital media &amp; growth systems:<br/>` +
               `• <strong>01 · CREATE:</strong> Video Editing &amp; Graphic Design<br/>` +
               `• <strong>02 · BUILD:</strong> Website Development &amp; SEO<br/>` +
               `• <strong>03 · ACQUIRE:</strong> Paid Ads &amp; Performance Marketing<br/>` +
               `• <strong>04 · GROW:</strong> Social Media Management<br/><br/>` +
               `What area would you like to explore first?`;
      }

      // 2. PILLAR 01: VIDEO EDITING & GRAPHIC DESIGN
      if (text.includes('video') || text.includes('edit') || text.includes('reel') || text.includes('short') || text.includes('youtube') || text.includes('motion') || text.includes('vfx') || text.includes('thumbnail') || text.includes('graphic') || text.includes('color grade')) {
        return `🎬 <strong>Core Service 01: Video Editing &amp; Graphic Design</strong><br/><br/>` +
               `We turn raw footage and ideas into high-impact content that makes your brand impossible to ignore.<br/><br/>` +
               `<strong>Deliverables include:</strong><br/>` +
               `✓ High-Retention Reels &amp; Shorts (3-sec hook engineering)<br/>` +
               `✓ Long-Form YouTube Video Editing &amp; Storytelling<br/>` +
               `✓ Motion Graphics, Kinetic Typography &amp; VFX<br/>` +
               `✓ Cinematic Color Grading &amp; Sound Design<br/>` +
               `✓ 4K CTR-Optimized Thumbnails &amp; Social Creatives<br/><br/>` +
               `⏱ <strong>Turnaround:</strong> 24 to 48 hours for short-form | 3 to 5 days for long-form.<br/><br/>` +
               `<div style="display:flex;gap:8px;flex-wrap:wrap;">` +
               `<a href="pricing" class="btn-gold-brand btn-sm" style="text-decoration:none;">View Video Pricing →</a>` +
               `<a href="work#video" class="btn-outline btn-sm" style="text-decoration:none;">View Video Portfolio 🎬</a>` +
               `</div>`;
      }

      // 3. PILLAR 02: WEBSITE DEVELOPMENT & SEO
      if (text.includes('web') || text.includes('site') || text.includes('seo') || text.includes('landing page') || text.includes('ecommerce') || text.includes('store') || text.includes('wordpress') || text.includes('speed') || text.includes('develop')) {
        return `💻 <strong>Core Service 02: Website Development &amp; SEO</strong><br/><br/>` +
               `We design and develop fast, responsive websites that look better, load in sub-seconds (98+ PageSpeed), and convert traffic into paying customers.<br/><br/>` +
               `<strong>Deliverables include:</strong><br/>` +
               `✓ High-Converting Landing Pages &amp; Funnels<br/>` +
               `✓ Business &amp; Corporate Websites<br/>` +
               `✓ D2C E-Commerce Storefronts &amp; WooCommerce<br/>` +
               `✓ Mobile-First Responsive Layouts<br/>` +
               `✓ Technical SEO &amp; On-Page Optimization<br/>` +
               `✓ Google Search Console &amp; Analytics Setup<br/><br/>` +
               `<div style="display:flex;gap:8px;flex-wrap:wrap;">` +
               `<a href="https://wa.link/pz3w3p" target="_blank" class="btn-gold-brand btn-sm" style="text-decoration:none;">Request Website Quote 💬</a>` +
               `<a href="work#web" class="btn-outline btn-sm" style="text-decoration:none;">View Web Projects 💻</a>` +
               `</div>`;
      }

      // 4. PILLAR 03: PAID ADS & PERFORMANCE MARKETING
      if (text.includes('ad') || text.includes('ads') || text.includes('marketing') || text.includes('performance') || text.includes('meta') || text.includes('facebook') || text.includes('google ad') || text.includes('roas') || text.includes('lead') || text.includes('campaign') || text.includes('acquire')) {
        return `📈 <strong>Core Service 03: Paid Advertising &amp; Performance Marketing</strong><br/><br/>` +
               `We build and manage performance ad campaigns designed to turn advertising budgets into measurable business growth and qualified client leads.<br/><br/>` +
               `<strong>Deliverables include:</strong><br/>` +
               `✓ Meta &amp; Instagram Ad Strategy &amp; Execution<br/>` +
               `✓ Google Search, Display &amp; YouTube Video Ads<br/>` +
               `✓ Direct-Response Video Ad Creatives<br/>` +
               `✓ Audience Research, Retargeting &amp; Funnels<br/>` +
               `✓ Creative A/B Variant Testing &amp; ROAS Tracking<br/><br/>` +
               `<div style="display:flex;gap:8px;flex-wrap:wrap;">` +
               `<a href="https://wa.link/pz3w3p" target="_blank" class="btn-gold-brand btn-sm" style="text-decoration:none;">Book Ad Strategy Call ↗</a>` +
               `<a href="work#brand" class="btn-outline btn-sm" style="text-decoration:none;">View Ad Case Studies 📈</a>` +
               `</div>`;
      }

      // 5. PILLAR 04: SOCIAL MEDIA MANAGEMENT
      if (text.includes('social') || text.includes('instagram') || text.includes('channel') || text.includes('management') || text.includes('grow') || text.includes('calendar') || text.includes('content strategy') || text.includes('subscribers') || text.includes('followers')) {
        return `📣 <strong>Core Service 04: Social Media Management &amp; Channel Growth</strong><br/><br/>` +
               `We turn your social channels into consistent, compounding growth assets so your brand stays active and authoritative.<br/><br/>` +
               `<strong>Deliverables include:</strong><br/>` +
               `✓ Social Media Growth Strategy &amp; Content Calendar<br/>` +
               `✓ Instagram &amp; Facebook Page Handling<br/>` +
               `✓ YouTube Channel Management &amp; Metadata SEO<br/>` +
               `✓ CTR-Optimized 4K Thumbnails<br/>` +
               `✓ Audience Retention Analytics &amp; Monthly Reports<br/><br/>` +
               `<div style="display:flex;gap:8px;flex-wrap:wrap;">` +
               `<a href="https://wa.link/pz3w3p" target="_blank" class="btn-gold-brand btn-sm" style="text-decoration:none;">Book Channel Strategy Call ↗</a>` +
               `<a href="work#social" class="btn-outline btn-sm" style="text-decoration:none;">View Growth Studies 📢</a>` +
               `</div>`;
      }

      // 6. PRICING / RATES / PACKAGES / RETAINER
      if (text.includes('price') || text.includes('pricing') || text.includes('cost') || text.includes('rate') || text.includes('package') || text.includes('charge') || text.includes('fee') || text.includes('plan') || text.includes('retainer')) {
        return `💰 <strong>Editzaar Transparent Pricing &amp; Flexible Packages:</strong><br/><br/>` +
               `Choose what you need. Scale when you’re ready:<br/>` +
               `• <strong>Shorts &amp; Reels (9:16):</strong> ₹1,000 / video (48h turnaround, hook optimization, sound design &amp; subtitles)<br/>` +
               `• <strong>Motion Graphics &amp; VFX:</strong> ₹2,500 / video (Custom kinetic typography &amp; animation)<br/>` +
               `• <strong>Long-Form YouTube (16:9):</strong> ₹5,000 / video (Cinematic story cuts, B-roll, audio mastering)<br/>` +
               `• <strong>High-Converting Website:</strong> Starting from ₹4,999 (3-day delivery, 98+ speed score, SEO ready)<br/>` +
               `• <strong>Monthly Growth Retainers:</strong> Custom creator &amp; brand partnerships with dedicated editors and priority delivery.<br/><br/>` +
               `<div style="display:flex;gap:8px;flex-wrap:wrap;">` +
               `<a href="pricing" class="btn-gold-brand btn-sm" style="text-decoration:none;">Explore Pricing Catalog →</a>` +
               `<a href="https://wa.link/pz3w3p" target="_blank" class="btn-outline btn-sm" style="text-decoration:none;">Custom Quote on WhatsApp 💬</a>` +
               `</div>`;
      }

      // 7. PORTFOLIO / WORK SAMPLES / PREVIOUS WORK
      if (text.includes('portfolio') || text.includes('work') || text.includes('sample') || text.includes('case stud') || text.includes('previous') || text.includes('examples') || text.includes('showcase') || text.includes('proof')) {
        return `📁 <strong>Editzaar Portfolio &amp; Case Studies:</strong><br/><br/>` +
               `You can explore our live client deliverables and video streams:<br/>` +
               `• <strong>Vertical Reels (9:16):</strong> Music, Healthcare, Real Estate &amp; Finance reels with 12M+ views.<br/>` +
               `• <strong>Horizontal Long-Form (16:9):</strong> Documentaries &amp; YouTube story cuts.<br/>` +
               `• <strong>Web Projects:</strong> Fast e-commerce &amp; agency portals (98/100 speed).<br/>` +
               `• <strong>Ad Case Studies:</strong> +380% ROAS Meta &amp; Google ad campaigns.<br/><br/>` +
               `<a href="work" class="btn-gold-brand btn-sm" style="text-decoration:none;display:inline-block;">Browse Full Portfolio Showcase 🎬</a>`;
      }

      // 8. 4-STEP WORKFLOW / TURNAROUND / DELIVERY / PROCESS
      if (text.includes('workflow') || text.includes('process') || text.includes('step') || text.includes('time') || text.includes('turnaround') || text.includes('delivery') || text.includes('fast') || text.includes('how long') || text.includes('how does it work')) {
        return `⚙️ <strong>Our 4-Step Production Workflow:</strong><br/><br/>` +
               `<strong>01 · Discovery:</strong> Quick discussion to understand goals, niche, and vision.<br/>` +
               `<strong>02 · Strategy &amp; Planning:</strong> Build the roadmap, script brief, and creative direction.<br/>` +
               `<strong>03 · Production:</strong> We edit, grade, animate, and develop your project.<br/>` +
               `<strong>04 · Delivery &amp; Support:</strong> Final delivery within agreed timelines + ongoing support.<br/><br/>` +
               `⏱ <strong>Typical Timelines:</strong><br/>` +
               `• Reels &amp; Shorts: 24 to 48 Hours<br/>` +
               `• YouTube Long-Form &amp; Motion: 3 to 5 Days<br/>` +
               `• Web Development: 3 to 7 Days<br/><br/>` +
               `<a href="pricing" class="btn-gold-brand btn-sm" style="text-decoration:none;display:inline-block;">View Turnaround Packages →</a>`;
      }

      // 9. REVISIONS & QUALITY GUARANTEE
      if (text.includes('revision') || text.includes('change') || text.includes('edit again') || text.includes('satisfaction') || text.includes('guarantee') || text.includes('quality')) {
        return `🔄 <strong>Revision Policy &amp; Quality Guarantee:</strong><br/><br/>` +
               `• Every project includes a defined number of revision rounds based on the selected package.<br/>` +
               `• We understand your brief and references deeply upfront to minimize back-and-forth.<br/>` +
               `• Direct 1-on-1 collaboration in the Client Portal to request instant tweaks until the final output matches your vision perfectly.`;
      }

      // 10. PAYMENT / UPI / ADVANCE / GST
      if (text.includes('pay') || text.includes('upi') || text.includes('advance') || text.includes('gst') || text.includes('bank') || text.includes('gpay') || text.includes('phonepe') || text.includes('deposit')) {
        return `💳 <strong>Payment Terms &amp; Instant UPI Deposit:</strong><br/><br/>` +
               `• <strong>Deposit Terms:</strong> 50% advance deposit to initiate work; 50% upon final delivery.<br/>` +
               `• <strong>Official UPI ID:</strong> <span class="pass-pill" style="font-size:12px;">nbikram704@okhdfcbank</span> (Bikram Nath)<br/>` +
               `• <strong>Instant Scan:</strong> Dynamic auto-amount QR codes on our pricing page pre-fill the exact advance deposit in GPay / PhonePe.<br/>` +
               `• <strong>GST Invoices:</strong> Official 18% GST invoices with input tax credit for businesses.<br/><br/>` +
               `<a href="pricing" class="btn-gold-brand btn-sm" style="text-decoration:none;display:inline-block;">Open Pricing &amp; UPI QR Checkout →</a>`;
      }

      // 11. CONTACT / FOUNDER / LOCATION / HYDERABAD / WHATSAPP
      if (text.includes('contact') || text.includes('founder') || text.includes('phone') || text.includes('whatsapp') || text.includes('call') || text.includes('location') || text.includes('address') || text.includes('hyderabad') || text.includes('email') || text.includes('bikram') || text.includes('about')) {
        return `🏢 <strong>About Editzaar &amp; Direct Founder Contact:</strong><br/><br/>` +
               `• <strong>Founder &amp; Director:</strong> Bikram Nath<br/>` +
               `• <strong>Agency Headquarters:</strong> Hyderabad, Telangana, India<br/>` +
               `• <strong>Global Reach:</strong> Serving creators &amp; brands across India, US, UK, UAE<br/>` +
               `• <strong>WhatsApp Direct:</strong> <a href="https://wa.link/pz3w3p" target="_blank" style="color:var(--gold);font-weight:700;text-decoration:underline;">+91 93478 69345 (Click to Chat ↗)</a><br/>` +
               `• <strong>Official Email:</strong> <a href="mailto:editzaarbooking@gmail.com" style="color:var(--gold);text-decoration:underline;">editzaarbooking@gmail.com</a><br/>` +
               `• <strong>Client Portal:</strong> <a href="dashboard/index.html" style="color:var(--gold);text-decoration:underline;">editzaar.in/dashboard ↗</a><br/><br/>` +
               `<a href="https://wa.link/pz3w3p" target="_blank" class="btn-gold-brand btn-sm" style="text-decoration:none;display:inline-block;">Book a Free 10-Min Call on WhatsApp →</a>`;
      }

      // 12. CLIENT DASHBOARD / LOGIN / STATUS
      if (text.includes('login') || text.includes('dashboard') || text.includes('portal') || text.includes('track') || text.includes('status') || text.includes('account')) {
        return `🔐 <strong>Editzaar Client &amp; Team Portal:</strong><br/><br/>` +
               `Our built-in client portal allows you to:<br/>` +
               `• Track project milestones in real-time<br/>` +
               `• Upload raw footage and brand assets<br/>` +
               `• Review draft deliverables &amp; request revisions<br/>` +
               `• Download GST invoices &amp; payment receipts<br/><br/>` +
               `<a href="dashboard/index.html" class="btn-gold-brand btn-sm" style="text-decoration:none;display:inline-block;">Access Client Portal ↗</a>`;
      }

      // 13. INTELLIGENT COMPREHENSIVE FALLBACK
      return `💡 <strong>Editzaar Digital Growth &amp; Media Agency:</strong><br/><br/>` +
             `We can assist you with any of our 4 core pillars:<br/>` +
             `• <strong>01 · CREATE:</strong> High-Retention Video Editing, Reels &amp; Motion Graphics<br/>` +
             `• <strong>02 · BUILD:</strong> Fast Websites &amp; SEO Setup (98+ PageSpeed)<br/>` +
             `• <strong>03 · ACQUIRE:</strong> Performance Ads (Meta &amp; Google ROAS Funnels)<br/>` +
             `• <strong>04 · GROW:</strong> Social Media &amp; Channel Growth Management<br/><br/>` +
             `You can also chat directly with our founder on WhatsApp at <a href="https://wa.link/pz3w3p" target="_blank" style="color:var(--gold);font-weight:700;text-decoration:underline;">+91 93478 69345 ↗</a>.<br/><br/>` +
             `<div style="display:flex;gap:8px;flex-wrap:wrap;">` +
             `<a href="pricing" class="btn-gold-brand btn-sm" style="text-decoration:none;">View Pricing →</a>` +
             `<a href="https://wa.link/pz3w3p" target="_blank" class="btn-outline btn-sm" style="text-decoration:none;">WhatsApp Us 💬</a>` +
             `</div>`;
    }
  }

  // Initialize Checkout Modal and AI Chatbot on DOM ready
  ensureCheckoutModal();
  ensureAiChatbot();

});