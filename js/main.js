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
     10. GLOBAL MASTER-TRAINED EDITZAAR AI CREATIVE STRATEGIST ENGINE
     ============================================================ */
  function ensureAiChatbot() {
    if (document.getElementById('editzaarAiChatbot')) return;

    var botHtml = `
    <div id="editzaarAiChatbot">
      <button class="ai-chatbot-fab" id="aiChatbotFab" title="Chat with Editzaar Creative Strategist" aria-label="Open AI Assistant">
        ✨
        <div class="fab-badge"></div>
      </button>

      <div class="ai-chatbot-panel" id="aiChatbotPanel" role="dialog" aria-label="Editzaar AI Assistant">
        <!-- Header -->
        <div class="ai-chat-header">
          <div class="ai-chat-header-info">
            <div class="ai-chat-avatar">✨</div>
            <div>
              <div class="ai-chat-title">Editzaar Creative Strategist</div>
              <div class="ai-chat-status">
                <span class="live-status-dot"></span>
                <span>Active Onboarding AI · 24/7</span>
              </div>
            </div>
          </div>
          <button class="ai-chat-close-btn" id="aiChatbotClose" title="Close" aria-label="Close Chat">✕</button>
        </div>

        <!-- Messages Area -->
        <div class="ai-chat-body" id="aiChatMessages">
          <div class="ai-msg bot">
            <div class="ai-bubble">
              👋 <strong>Hi! Welcome to Editzaar!</strong><br/><br/>
              I am your <strong>Senior Creative Strategist &amp; Client Onboarding AI</strong>. I help creators and scaling brands engineer high-retention video systems, ultra-fast websites, and profitable paid acquisition funnels.<br/><br/>
              What type of project or growth goal are you focusing on right now?
            </div>
            <span class="ai-msg-time">Just now</span>
          </div>
        </div>

        <!-- Input Bar (Apple iOS Pill Style) -->
        <div class="ai-chat-input-row">
          <div class="ai-chat-input-wrapper">
            <input type="text" class="ai-chat-input" id="aiChatInput" placeholder="Ask about editing, pricing, turnaround, ROI…" aria-label="Message Editzaar AI"/>
            <button class="ai-chat-send" id="aiChatSend" title="Send message" aria-label="Send">↑</button>
          </div>
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

    // Toggle Chat
    if (fab && panel) {
      fab.addEventListener('click', function (e) { 
        e.stopPropagation();
        panel.classList.toggle('open'); 
        if (panel.classList.contains('open') && input) {
          setTimeout(function() { input.focus(); }, 150);
        }
      });
    }

    if (close && panel) {
      close.addEventListener('click', function (e) {
        e.stopPropagation();
        panel.classList.remove('open'); 
      });
    }

    // Auto-close when clicking outside of the chatbot panel
    document.addEventListener('click', function (e) {
      if (panel && panel.classList.contains('open')) {
        if (!panel.contains(e.target) && !fab.contains(e.target)) {
          panel.classList.remove('open');
        }
      }
    });

    document.addEventListener('touchstart', function (e) {
      if (panel && panel.classList.contains('open')) {
        if (!panel.contains(e.target) && !fab.contains(e.target)) {
          panel.classList.remove('open');
        }
      }
    }, { passive: true });

    // Input handlers
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
      typingDiv.innerHTML = '<div class="ai-bubble" style="padding:10px 18px;display:flex;align-items:center;gap:8px;"><span class="dot-pulse">Analyzing requirement…</span></div>';
      msgsContainer.appendChild(typingDiv);
      msgsContainer.scrollTop = msgsContainer.scrollHeight;

      setTimeout(function () {
        var indicator = document.getElementById('aiTypingIndicator');
        if (indicator) indicator.remove();

        var botResponse = generateMasterAiResponse(q.trim());
        appendMessage('bot', botResponse);
      }, 350);
    }

    // ----------------------------------------------------
    // MASTER KNOWLEDGE & STRATEGY RESPONSE GENERATOR
    // ----------------------------------------------------
    function generateMasterAiResponse(rawText) {
      var text = rawText.toLowerCase();

      // 1. LEAD CAPTURE FORM / BOOKING / CONTACT FOUNDER
      if (text.includes('whatsapp') || text.includes('call') || text.includes('phone') || text.includes('contact') || text.includes('founder') || text.includes('bikram') || text.includes('hire') || text.includes('get started') || text.includes('start project') || text.includes('book')) {
        return `🚀 <strong>Ready to Scale Your Content &amp; Brand?</strong><br/><br/>` +
               `Our Creative Director <strong>Bikram Nath</strong> and production team are ready to review your project.<br/><br/>` +
               `<div class="ai-lead-box">` +
               `<div style="font-weight:600;font-size:0.88rem;color:var(--gold);margin-bottom:6px;">⚡ Connect Directly on WhatsApp:</div>` +
               `<div style="font-size:0.84rem;color:var(--t2);line-height:1.5;margin-bottom:12px;">Chat 1-on-1, share sample footage links, or get a custom retainer quote in under 15 minutes.</div>` +
               `<a href="https://wa.me/919476766340?text=Hi%20Editzaar,%20I'd%20like%20to%20discuss%20a%20project%20for%20my%20brand!" target="_blank" rel="noopener noreferrer" class="btn-gold-brand btn-sm" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px;width:100%;justify-content:center;padding:10px 16px;border-radius:12px;">💬 Chat on WhatsApp (+91 9476766340) →</a>` +
               `</div><br/>` +
               `Prefer email? Reach us at <a href="mailto:editzaarbooking@gmail.com" style="color:var(--gold);text-decoration:underline;">editzaarbooking@gmail.com</a>`;
      }

      // 2. OBJECTION HANDLING: AGENCY VS FREELANCER (Fiverr/Upwork)
      if (text.includes('fiverr') || text.includes('upwork') || text.includes('freelancer') || text.includes('why choose') || text.includes('why editzaar') || text.includes('agency vs') || text.includes('expensive')) {
        return `🛡️ <strong>Why Creators &amp; Brands Choose Editzaar over Freelancers:</strong><br/><br/>` +
               `• <strong>Guaranteed 24–48h Velocity:</strong> No ghosting, no missed deadlines, no creative burnout.<br/>` +
               `• <strong>Multi-Person Production Pipeline:</strong> You don't just get 1 editor — you get an editor, sound designer, motion artist, and quality reviewer for less than an in-house hire.<br/>` +
               `• <strong>100% Brand Consistency:</strong> We lock in your brand guidelines, LUTs, typography, and pacing so every video hits standard.<br/>` +
               `• <strong>Unlimited Revisions:</strong> We collaborate until you are 100% satisfied with zero friction.<br/><br/>` +
               `<div style="display:flex;gap:8px;flex-wrap:wrap;">` +
               `<a href="pricing" class="btn-gold-brand btn-sm" style="text-decoration:none;">View Pricing Models →</a>` +
               `<a href="work" class="btn-outline btn-sm" style="text-decoration:none;">Inspect Our Work 🎬</a>` +
               `</div>`;
      }

      // 3. COPYRIGHT, MUSIC & COMMERCIAL LICENSING
      if (text.includes('copyright') || text.includes('music') || text.includes('license') || text.includes('strike') || text.includes('stock footage') || text.includes('audio')) {
        return `🎵 <strong>100% Commercial Licensing &amp; Zero Copyright Strikes Guarantee:</strong><br/><br/>` +
               `• <strong>Royalty-Free Commercial Audio:</strong> Licensed via premium platforms like Artlist, Epidemic Sound, and Audiio.<br/>` +
               `• <strong>4K Premium Stock Footage:</strong> Storyblocks, Envato Elements, Motion Array.<br/>` +
               `• <strong>Commercial Fonts &amp; 3D VFX:</strong> Full commercial rights included for YouTube monetization, Instagram, and paid ads.<br/>` +
               `• <strong>Peace of Mind:</strong> Safe for monetized channels and corporate advertising worldwide.`;
      }

      // 4. TECHNICAL SPECIFICATIONS & RAW FOOTAGE WORKFLOW
      if (text.includes('raw') || text.includes('spec') || text.includes('resolution') || text.includes('4k') || text.includes('prores') || text.includes('upload') || text.includes('format') || text.includes('drive') || text.includes('dropbox')) {
        return `⚙️ <strong>Technical Specifications &amp; Footage Workflow:</strong><br/><br/>` +
               `• <strong>Formats Supported:</strong> MP4, MOV, Apple ProRes, Blackmagic BRAW, Sony S-Log, Canon C-Log.<br/>` +
               `• <strong>Resolution:</strong> 1080p Full HD up to 4K UHD 60fps.<br/>` +
               `• <strong>Multi-Track Audio:</strong> Dual lavalier sync, podcast multi-mic setups, noise reduction.<br/>` +
               `• <strong>Easy Upload:</strong> Share via Google Drive, Dropbox, Frame.io, or WeTransfer.<br/><br/>` +
               `💡 <em>Recommended Folder Structure:</em><br/>` +
               `<code style="background:rgba(255,255,255,0.08);padding:4px 8px;border-radius:6px;font-size:0.78rem;display:block;margin-top:6px;">/Project_Name ➔ /Raw_A_Roll · /B_Roll · /Voiceover · /Brief_Notes</code>`;
      }

      // 5. SHORT-FORM VIDEO EDITING (9:16 REELS, SHORTS, TIKTOK)
      if (text.includes('reel') || text.includes('short') || text.includes('tiktok') || text.includes('short-form') || text.includes('9:16') || text.includes('hook') || text.includes('hormozi')) {
        return `🎬 <strong>High-Retention Short-Form Editing (9:16 Vertical):</strong><br/><br/>` +
               `We engineer viral short-form assets built to stop the swipe and maximize retention:<br/><br/>` +
               `✓ <strong>3-Second Hook Rule:</strong> Visual pattern interrupts, kinetic title pop-ins, and riser SFX in the first 150 frames.<br/>` +
               `✓ <strong>Dynamic Styled Subtitles:</strong> Hormozi-style, animated word-by-word, colored emphasis tags.<br/>` +
               `✓ <strong>Pacing &amp; B-roll:</strong> Micro-zooms, sound design whooshes, animated emojis, stock cutaways.<br/>` +
               `✓ <strong>Turnaround:</strong> Fast 24–48 hours delivery.<br/><br/>` +
               `💰 <strong>Starting at:</strong> ₹1,000 / video (or discounted monthly volume retainers).<br/><br/>` +
               `<div style="display:flex;gap:8px;flex-wrap:wrap;">` +
               `<a href="pricing" class="btn-gold-brand btn-sm" style="text-decoration:none;">View Short-Form Pricing →</a>` +
               `<a href="work#video" class="btn-outline btn-sm" style="text-decoration:none;">Watch Live Reels 📱</a>` +
               `</div>`;
      }

      // 6. LONG-FORM YOUTUBE & PODCASTS (16:9)
      if (text.includes('youtube') || text.includes('long-form') || text.includes('podcast') || text.includes('16:9') || text.includes('talking head') || text.includes('documentary') || text.includes('interview')) {
        return `📹 <strong>Long-Form YouTube &amp; Podcast Post-Production (16:9):</strong><br/><br/>` +
               `We edit for <strong>high Average Percentage Viewed (APV)</strong> and viewer retention:<br/><br/>` +
               `✓ <strong>Narrative Pacing:</strong> Dead-air removal, multi-camera switching, audio leveling.<br/>` +
               `✓ <strong>Custom Motion Graphics:</strong> Animated stats, lower thirds, screen zoom callouts.<br/>` +
               `✓ <strong>Color Grading &amp; Mastering:</strong> Studio LUTs and vocal clarity enhancement.<br/>` +
               `✓ <strong>Shorts Extraction:</strong> We can extract 5–8 viral Shorts from every 1-hour episode!<br/>` +
               `✓ <strong>Turnaround:</strong> 48–72 hours per episode.<br/><br/>` +
               `<div style="display:flex;gap:8px;flex-wrap:wrap;">` +
               `<a href="pricing" class="btn-gold-brand btn-sm" style="text-decoration:none;">View YouTube Packages →</a>` +
               `<a href="work#video" class="btn-outline btn-sm" style="text-decoration:none;">View YouTube Portfolio 🎬</a>` +
               `</div>`;
      }

      // 7. WEBSITE DEVELOPMENT & SEO
      if (text.includes('web') || text.includes('site') || text.includes('seo') || text.includes('landing page') || text.includes('wordpress') || text.includes('ecommerce') || text.includes('store') || text.includes('speed')) {
        return `💻 <strong>Website Development &amp; Technical SEO:</strong><br/><br/>` +
               `Give your brand a digital home built to convert visitors and rank organically:<br/><br/>` +
               `✓ <strong>High-Converting Landing Pages:</strong> Sub-second load speeds (98+ PageSpeed), mobile-first UI.<br/>` +
               `✓ <strong>Corporate &amp; E-Commerce:</strong> Custom HTML5/JS systems, WooCommerce, Shopify.<br/>` +
               `✓ <strong>SEO Foundation:</strong> Schema.org Knowledge Graph, OpenGraph, Google Search Console indexing.<br/>` +
               `✓ <strong>Turnaround:</strong> 3 to 7 business days.<br/><br/>` +
               `<div style="display:flex;gap:8px;flex-wrap:wrap;">` +
               `<a href="https://wa.me/919476766340?text=Hi%20Editzaar,%20I'd%20like%20a%20quote%20for%20a%20new%20website" target="_blank" class="btn-gold-brand btn-sm" style="text-decoration:none;">Request Website Quote 💬</a>` +
               `<a href="work#web" class="btn-outline btn-sm" style="text-decoration:none;">View Web Projects 💻</a>` +
               `</div>`;
      }

      // 8. PAID ADVERTISING & PERFORMANCE MARKETING
      if (text.includes('ad') || text.includes('marketing') || text.includes('meta') || text.includes('google ads') || text.includes('roas') || text.includes('cpl') || text.includes('campaign') || text.includes('lead gen')) {
        return `📈 <strong>Paid Advertising &amp; Performance Marketing:</strong><br/><br/>` +
               `Turn ad spend into measurable, scalable revenue:<br/><br/>` +
               `✓ <strong>Meta &amp; Instagram Ads:</strong> Direct-response video creatives, audience targeting &amp; lookalikes.<br/>` +
               `✓ <strong>Google &amp; YouTube Ads:</strong> High-intent search and video discovery funnels.<br/>` +
               `✓ <strong>A/B Creative Testing:</strong> Hook variants, angle testing, and ROAS optimization.<br/>` +
               `✓ <strong>Proven Performance:</strong> +380% ROAS on average client campaigns.<br/><br/>` +
               `<a href="https://wa.me/919476766340?text=Hi%20Editzaar,%20I'd%20like%20to%20discuss%20Paid%20Ads%20for%20my%20business" target="_blank" class="btn-gold-brand btn-sm" style="text-decoration:none;display:inline-block;">Book Ad Strategy Call on WhatsApp ↗</a>`;
      }

      // 9. SOCIAL MEDIA MANAGEMENT & CHANNEL GROWTH
      if (text.includes('social') || text.includes('instagram') || text.includes('channel') || text.includes('management') || text.includes('grow') || text.includes('calendar') || text.includes('followers')) {
        return `📣 <strong>Social Media Management &amp; Channel Growth:</strong><br/><br/>` +
               `Build a consistent content engine that compounds authority:<br/><br/>` +
               `✓ Complete Content Strategy &amp; Monthly Publishing Calendar<br/>` +
               `✓ Instagram, YouTube, and Facebook Channel Handling<br/>` +
               `✓ 4K CTR-Optimized Thumbnails &amp; Video Titles<br/>` +
               `✓ Analytics, Retention Audits &amp; Monthly Performance Reports<br/><br/>` +
               `<a href="https://wa.me/919476766340?text=Hi%20Editzaar,%20tell%20me%20about%20Social%20Media%20Management" target="_blank" class="btn-gold-brand btn-sm" style="text-decoration:none;display:inline-block;">Discuss Social Retainers on WhatsApp ↗</a>`;
      }

      // 10. NICHE SPECIFIC STRATEGIES (Finance, Real Estate, Fitness, Tech, Podcasts)
      if (text.includes('finance') || text.includes('real estate') || text.includes('fitness') || text.includes('tech') || text.includes('saas') || text.includes('doctor') || text.includes('medical') || text.includes('vlog')) {
        return `🎯 <strong>Custom Tailored Editing Strategy for Your Niche:</strong><br/><br/>` +
               `• <strong>Finance / Real Estate:</strong> Clean luxury aesthetic, animated financial charts, key metric popups, and high-end stock B-roll to build maximum trust.<br/>` +
               `• <strong>Fitness / Lifestyle:</strong> Beat-synced jump cuts, dynamic speed ramps, energetic sound design, and vibrant color grading.<br/>` +
               `• <strong>Tech / SaaS:</strong> Smooth pan-and-zoom screen captures, highlighted UI boxes, and clean kinetic typography.<br/><br/>` +
               `Would you like to see 2–3 sample edits we produced in your specific industry?<br/><br/>` +
               `<a href="work" class="btn-gold-brand btn-sm" style="text-decoration:none;display:inline-block;">Explore Niche Portfolio Samples →</a>`;
      }

      // 11. PRICING, PACKAGES & TIME SAVINGS ROI CALCULATOR
      if (text.includes('price') || text.includes('pricing') || text.includes('cost') || text.includes('rate') || text.includes('package') || text.includes('retainer') || text.includes('roi') || text.includes('saving')) {
        return `💰 <strong>Editzaar Transparent Pricing &amp; ROI Calculator:</strong><br/><br/>` +
               `• <strong>Shorts &amp; Reels (9:16):</strong> ₹1,000 / video (48h turnaround, hook design, subtitles, SFX)<br/>` +
               `• <strong>Motion Graphics &amp; VFX:</strong> ₹2,500 / video (Custom vector animation &amp; kinetic typography)<br/>` +
               `• <strong>Long-Form YouTube (16:9):</strong> ₹5,000 / video (Cinematic story cuts, B-roll, audio mastering)<br/>` +
               `• <strong>High-Converting Website:</strong> Starting from ₹4,999 (3-day delivery, 98+ PageSpeed, SEO)<br/>` +
               `• <strong>Monthly Creator Retainer:</strong> Discounted bulk volume with dedicated editor queue.<br/><br/>` +
               `⚡ <strong>Time-Savings ROI:</strong> Editing 15 Reels takes ~50 hours/month of your time. Handing it to Editzaar gives you back <strong>12+ hours every week</strong> to focus on filming and closing clients.<br/><br/>` +
               `<div style="display:flex;gap:8px;flex-wrap:wrap;">` +
               `<a href="pricing" class="btn-gold-brand btn-sm" style="text-decoration:none;">View Full Pricing Catalog →</a>` +
               `<a href="https://wa.me/919476766340?text=Hi%20Editzaar,%20I'd%20like%20a%20custom%20monthly%20retainer%20quote" target="_blank" class="btn-outline btn-sm" style="text-decoration:none;">Custom Volume Quote 💬</a>` +
               `</div>`;
      }

      // 12. 4-STEP WORKFLOW, PROCESS & REVISIONS
      if (text.includes('process') || text.includes('workflow') || text.includes('step') || text.includes('revision') || text.includes('delivery time') || text.includes('turnaround') || text.includes('how it works')) {
        return `⚙️ <strong>Our 4-Step Production Workflow:</strong><br/><br/>` +
               `<strong>01 · Discovery:</strong> Quick discussion to understand goals, niche, and creative direction.<br/>` +
               `<strong>02 · Strategy &amp; Planning:</strong> Build the roadmap, pacing guidelines, and script structure.<br/>` +
               `<strong>03 · Production:</strong> We edit, color grade, animate, sound design, and review internally.<br/>` +
               `<strong>04 · Delivery &amp; Support:</strong> Receive 4K exports in 24–48 hours + ongoing support.<br/><br/>` +
               `🔄 <strong>Revisions:</strong> Revisions are handled swiftly until your video matches the agreed direction 100%.`;
      }

      // 13. WHITE-LABEL & AGENCY PARTNERSHIPS
      if (text.includes('white label') || text.includes('agency') || text.includes('resell') || text.includes('partner') || text.includes('nda')) {
        return `🤝 <strong>White-Label Video Production for Agencies:</strong><br/><br/>` +
               `We provide scalable, white-label editing capacity for marketing agencies and course creators:<br/><br/>` +
               `✓ <strong>Strict NDAs:</strong> We edit under your agency brand name with 100% confidentiality.<br/>` +
               `✓ <strong>Dedicated Slack/Discord Channel:</strong> Direct real-time communication for volume accounts.<br/>` +
               `✓ <strong>Predictable Capacity:</strong> 20 to 100+ videos delivered monthly without expanding your payroll.<br/><br/>` +
               `<a href="https://wa.me/919476766340?text=Hi%20Editzaar,%20I'm%20an%20agency%20owner%20interested%20in%20White-Label%20partnerships" target="_blank" class="btn-gold-brand btn-sm" style="text-decoration:none;display:inline-block;">Discuss Agency Partnership on WhatsApp ↗</a>`;
      }

      // 14. DEFAULT INTELLIGENT CREATIVE STRATEGIST FALLBACK
      return `💡 <strong>Editzaar Digital Growth &amp; Creative Agency:</strong><br/><br/>` +
             `We can help you scale across any of our 4 core pillars:<br/>` +
             `• <strong>01 · CREATE:</strong> High-Retention Reels, YouTube &amp; Motion Graphics<br/>` +
             `• <strong>02 · BUILD:</strong> Fast Websites &amp; SEO Systems (98+ PageSpeed)<br/>` +
             `• <strong>03 · ACQUIRE:</strong> Paid Ads &amp; Performance ROAS Funnels<br/>` +
             `• <strong>04 · GROW:</strong> Social Media Management &amp; Content Calendars<br/><br/>` +
             `Would you like to explore <strong>pricing</strong>, view <strong>portfolio samples</strong>, or <strong>chat directly with our founder on WhatsApp</strong>?<br/><br/>` +
             `<div style="display:flex;gap:8px;flex-wrap:wrap;">` +
             `<a href="pricing" class="btn-gold-brand btn-sm" style="text-decoration:none;">View Pricing →</a>` +
             `<a href="work" class="btn-outline btn-sm" style="text-decoration:none;">View Work 🎬</a>` +
             `<a href="https://wa.me/919476766340?text=Hi%20Editzaar,%20I'd%20like%20to%20discuss%20a%20project!" target="_blank" class="btn-outline btn-sm" style="text-decoration:none;">WhatsApp Us 💬</a>` +
             `</div>`;
    }
  }

  // Initialize Checkout Modal and AI Chatbot on DOM ready
  ensureCheckoutModal();
  ensureAiChatbot();

});