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


  /* ── 2. Typing Headline Effect ── */
  var typingTarget = document.getElementById('typing-target');
  if (typingTarget) {
    var words = [
      'unforgettable.',
      'impossible to ignore.',
      'worth watching.',
      'go viral.',
      'convert viewers.',
      'tell your story.'
    ];
    var wordIndex  = 0;
    var charIndex  = 0;
    var isDeleting = false;

    function typeLoop() {
      if (!typingTarget) return;

      var currentWord = words[wordIndex];
      var cursor      = '<span class="cursor-blink"></span>';

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
          setTimeout(typeLoop, 420);
          return;
        }
        setTimeout(typeLoop, 36);
      }
    }

    setTimeout(typeLoop, 800);
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


  /* ── 9. Mobile Navigation Toggle ── */
  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
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
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:var(--gold);margin-bottom:12px;font-weight:700;">Selected Package Breakdown</div>
          <div class="summary-row"><span>Package Name</span><strong id="chkPkgName" style="color:#fff;">Custom Project</strong></div>
          <div class="summary-row"><span>Base Amount</span><span id="chkBasePrice">₹1,000</span></div>
          <div class="summary-row"><span>GST (18%)</span><span id="chkGst">₹180</span></div>
          <div class="summary-row total"><span>Total Package Value</span><span id="chkTotal" style="color:var(--gold);">₹1,180</span></div>
          <div class="summary-row advance">
            <span>💳 Required 50% Booking Advance</span>
            <span id="chkAdvance">₹590</span>
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

        <!-- DYNAMIC AUTO-AMOUNT UPI QR CODE PAYMENT BOX -->
        <div class="payment-box">
          <div>
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:var(--gold);margin-bottom:8px;font-weight:700;">Dynamic Auto-Amount UPI QR Code</div>
            <div class="upi-badge">UPI ID: nbikram704@okhdfcbank</div>
            <div style="font-size:0.85rem;color:var(--t2);line-height:1.6;margin-top:6px;">
              • <strong>Account Name:</strong> Bikram Nath<br/>
              • <strong>Pre-filled 50% Advance:</strong> <strong id="chkAdvancePayText" style="color:#28C840;">₹590</strong><br/>
              • <em>Scanning this QR pre-fills the exact advance deposit automatically in your GPay or PhonePe app!</em>
            </div>
            <a id="btnMobileUpi" href="#" target="_blank" class="btn-upi-mobile">⚡ Open GPay / PhonePe (Pre-filled ₹<span id="btnUpiAmt">590</span>) →</a>
          </div>
          <div class="dynamic-qr-wrapper">
            <img id="dynamicQrImg" src="" alt="Dynamic Pre-filled UPI Payment QR Code" class="dynamic-qr-img"/>
            <div style="font-size:10px;color:#000;font-weight:700;margin-top:6px;letter-spacing:0.04em;">PRE-FILLED 50% ADVANCE QR</div>
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
        var advance = Math.round(total * 0.5);

        var message = `🚨 *NEW PROJECT ORDER & CHECKOUT* 🚨\n\n` +
                      `📦 *PACKAGE:* ${pkgName}\n` +
                      `⏱ *Est. Delivery:* ${delivery}\n` +
                      `💵 *Base Price:* ₹${basePrice.toLocaleString()}\n` +
                      `🧾 *GST (18%):* ₹${gst.toLocaleString()}\n` +
                      `💰 *Total Package Value:* ₹${total.toLocaleString()}\n` +
                      `💳 *50% Advance Booking Deposit:* ₹${advance.toLocaleString()}\n\n` +
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
                      `Please confirm my 50% advance payment deposit of ₹${advance.toLocaleString()} and generate my Tax Invoice!`;

        window.open(`https://wa.me/919476766340?text=${encodeURIComponent(message)}`, '_blank');
        modal.classList.remove('open');
      });
    }
  }

  window.openCheckout = function (pName, price, deliveryTime) {
    ensureCheckoutModal();
    window._activeCheckoutPackage = { name: pName || 'Custom Project', basePrice: price || 1000, delivery: deliveryTime || '48 Hours' };

    var priceNum = parseInt(price) || 1000;
    var gst = Math.round(priceNum * 0.18);
    var total = priceNum + gst;
    var advance = Math.round(total * 0.5);

    var elPkg = document.getElementById('chkPkgName');
    var elBase = document.getElementById('chkBasePrice');
    var elGst = document.getElementById('chkGst');
    var elTot = document.getElementById('chkTotal');
    var elAdv = document.getElementById('chkAdvance');
    var elAdvPay = document.getElementById('chkAdvancePayText');
    var elUpiAmt = document.getElementById('btnUpiAmt');

    if (elPkg) elPkg.textContent = pName || 'Custom Project';
    if (elBase) elBase.textContent = '₹' + priceNum.toLocaleString();
    if (elGst) elGst.textContent = '₹' + gst.toLocaleString();
    if (elTot) elTot.textContent = '₹' + total.toLocaleString();
    if (elAdv) elAdv.textContent = '₹' + advance.toLocaleString();
    if (elAdvPay) elAdvPay.textContent = '₹' + advance.toLocaleString();
    if (elUpiAmt) elUpiAmt.textContent = advance.toLocaleString();

    var upiUrl = `upi://pay?pa=nbikram704@okhdfcbank&pn=Bikram%20Nath&am=${advance}&cu=INR&tn=${encodeURIComponent('Editzaar Advance: ' + (pName || 'Project'))}`;
    var qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;

    var elQr = document.getElementById('dynamicQrImg');
    var elMobileUpi = document.getElementById('btnMobileUpi');
    if (elQr) elQr.src = qrApiUrl;
    if (elMobileUpi) elMobileUpi.href = upiUrl;

    var modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.add('open');
  };


  /* ============================================================
     10. GLOBAL INTELLIGENT AI CHATBOT ENGINE
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
              <div class="ai-chat-status"><span style="width:7px;height:7px;border-radius:50%;background:#28C840;display:inline-block;"></span> Online · Instant Answers</div>
            </div>
          </div>
          <button class="checkout-close" id="aiChatbotClose" style="position:static;font-size:1.2rem;">✕</button>
        </div>

        <div class="ai-chat-body" id="aiChatMessages">
          <div class="ai-msg bot">
            <div class="ai-bubble">
              👋 <strong>Hi there! Welcome to Editzaar!</strong><br/><br/>
              I am your 24/7 AI Agency Assistant. I can help you with <strong>video editing rates, turnaround times, web development, payment/UPI process, or booking a project</strong>.<br/><br/>
              How can I assist your brand today?
            </div>
            <span class="ai-msg-time">Just now</span>
          </div>
        </div>

        <div class="ai-quick-chips">
          <span class="ai-chip" data-q="What are your video editing prices?">🎬 Video Editing Rates</span>
          <span class="ai-chip" data-q="What is your delivery time?">⏱ Turnaround Times</span>
          <span class="ai-chip" data-q="How does 50% advance UPI payment work?">💳 50% Advance &amp; UPI</span>
          <span class="ai-chip" data-q="Tell me about website development">💻 Web Design</span>
          <span class="ai-chip" data-q="Who is the founder and how to contact?">📞 Contact &amp; Founder</span>
          <span class="ai-chip" data-q="How do I book a project?">📋 How to Book</span>
        </div>

        <div class="ai-chat-input-row">
          <input type="text" class="ai-chat-input" id="aiChatInput" placeholder="Ask about services, pricing, booking…"/>
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
      fab.addEventListener('click', function () { panel.classList.toggle('open'); if (panel.classList.contains('open') && input) input.focus(); });
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
      typingDiv.innerHTML = '<div class="ai-bubble" style="padding:8px 16px;"><span class="dot-pulse">Thinking…</span></div>';
      msgsContainer.appendChild(typingDiv);
      msgsContainer.scrollTop = msgsContainer.scrollHeight;

      setTimeout(function () {
        var indicator = document.getElementById('aiTypingIndicator');
        if (indicator) indicator.remove();

        var botResponse = generateAiResponse(q.toLowerCase());
        appendMessage('bot', botResponse);
      }, 400);
    }

    function generateAiResponse(text) {
      // 1. Pricing / Rates
      if (text.includes('price') || text.includes('cost') || text.includes('rate') || text.includes('package') || text.includes('charge') || text.includes('fee')) {
        return `📊 <strong>Editzaar Transparent Pricing Plans:</strong><br/><br/>` +
               `• <strong>Shorts &amp; Reels (9:16):</strong> ₹1,000 / video (48h turnaround, hook optimization, subtitles &amp; SFX)<br/>` +
               `• <strong>Motion Graphics / Animated:</strong> ₹2,500 / video (Custom vector animation &amp; kinetic typography)<br/>` +
               `• <strong>Long-Form YouTube (16:9):</strong> ₹5,000 / video (Story cuts, B-roll, color grade &amp; audio mastering)<br/>` +
               `• <strong>Monthly Creator Retainer:</strong> ₹15,000 / month (Dedicated editor, priority 24h turnarounds, unlimited revisions)<br/>` +
               `• <strong>High-Converting Landing Page:</strong> ₹4,999 (3-day delivery, 95+ speed score)<br/><br/>` +
               `<button class="btn-gold-brand btn-sm" onclick="window.openCheckout('Shorts & Reels', 1000, '48 Hours')">⚡ Book Shorts &amp; Reels (₹1,000) →</button>`;
      }

      // 2. Turnaround / Delivery Time
      if (text.includes('time') || text.includes('turnaround') || text.includes('delivery') || text.includes('fast') || text.includes('duration') || text.includes('how long')) {
        return `⏱ <strong>Our Turnaround &amp; Delivery Guarantee:</strong><br/><br/>` +
               `• <strong>Shorts &amp; Reels:</strong> 24 to 48 Hours<br/>` +
               `• <strong>Motion Graphics:</strong> 48 Hours<br/>` +
               `• <strong>Long-form YouTube:</strong> 48 to 72 Hours<br/>` +
               `• <strong>Website Landing Page:</strong> 3 Business Days<br/>` +
               `• <strong>Monthly Retainers:</strong> Priority 24-hour turnaround on every video batch!<br/><br/>` +
               `Need urgent rush delivery? Contact Bikram Nath at <a href="https://wa.me/919476766340" target="_blank" style="color:var(--gold);text-decoration:underline;">+91 9476766340 ↗</a>`;
      }

      // 3. Payment / UPI / Advance
      if (text.includes('upi') || text.includes('pay') || text.includes('advance') || text.includes('gst') || text.includes('bank') || text.includes('gpay') || text.includes('phonepe')) {
        return `💳 <strong>Payment Terms &amp; Instant UPI Deposit:</strong><br/><br/>` +
               `• <strong>Booking Deposit:</strong> 50% advance required to initiate project editing.<br/>` +
               `• <strong>Official UPI ID:</strong> <span class="pass-pill" style="font-size:12px;">nbikram704@okhdfcbank</span> (Bikram Nath)<br/>` +
               `• <strong>Remaining 50%:</strong> Payable upon final delivery approval.<br/>` +
               `• <strong>Tax Invoices:</strong> Official 18% GST invoices generated for every order with GSTIN credit input!<br/><br/>` +
               `<button class="btn-gold-brand btn-sm" onclick="window.openCheckout('Custom Project', 1000, '48 Hours')">Scan Dynamic UPI QR Code →</button>`;
      }

      // 4. Website Development
      if (text.includes('web') || text.includes('site') || text.includes('wordpress') || text.includes('landing') || text.includes('react') || text.includes('code')) {
        return `💻 <strong>Website Design &amp; Development Services:</strong><br/><br/>` +
               `• <strong>High-Converting Landing Pages:</strong> ₹4,999 (3-day delivery, 95+ speed score, mobile responsive)<br/>` +
               `• <strong>Media &amp; News Portals:</strong> Like News Flash Daily (<a href="https://www.newsflashdaily.in" target="_blank" style="color:var(--gold);text-decoration:underline;">newsflashdaily.in ↗</a>)<br/>` +
               `• <strong>Agency &amp; Corporate Portals:</strong> Custom HTML5/CSS3/JavaScript with Firebase Realtime Database.<br/>` +
               `• <strong>E-Commerce:</strong> WooCommerce + Payment Gateway integration.<br/><br/>` +
               `<button class="btn-gold-brand btn-sm" onclick="window.openCheckout('High-Converting Landing Page', 4999, '3 Days')">Book Website (₹4,999) →</button>`;
      }

      // 5. Contact / Founder / Phone / Location
      if (text.includes('contact') || text.includes('founder') || text.includes('phone') || text.includes('whatsapp') || text.includes('call') || text.includes('location') || text.includes('address') || text.includes('email') || text.includes('bikram') || text.includes('who are you') || text.includes('about')) {
        return `🏢 <strong>About Editzaar Agency &amp; Contact:</strong><br/><br/>` +
               `• <strong>Founder &amp; Director:</strong> Bikram Nath<br/>` +
               `• <strong>Headquarters:</strong> Hyderabad, Telangana, India<br/>` +
               `• <strong>WhatsApp / Direct Call:</strong> <a href="https://wa.me/919476766340" target="_blank" style="color:var(--gold);font-weight:700;text-decoration:underline;">+91 9476766340 ↗</a><br/>` +
               `• <strong>Official Email:</strong> <a href="mailto:editzaarbooking@gmail.com" style="color:var(--gold);text-decoration:underline;">editzaarbooking@gmail.com</a><br/>` +
               `• <strong>Client Portal:</strong> <a href="dashboard/index.html" style="color:var(--gold);text-decoration:underline;">editzaar.in/dashboard ↗</a><br/><br/>` +
               `We are ready to scale your content and brand!`;
      }

      // 6. How to book / Order
      if (text.includes('book') || text.includes('order') || text.includes('start') || text.includes('hire') || text.includes('process')) {
        return `🚀 <strong>How to Book a Project in 3 Easy Steps:</strong><br/><br/>` +
               `1. Click the button below to open the <strong>Project Checkout &amp; Onboarding Modal</strong>.<br/>` +
               `2. Select your package, enter your brief &amp; Google Drive footage link.<br/>` +
               `3. Scan the <strong>50% Advance UPI QR Code</strong> (` + `<span class="pass-pill">nbikram704@okhdfcbank</span>) and submit to WhatsApp or your Client Dashboard!<br/><br/>` +
               `<button class="btn-gold-brand btn-sm" onclick="window.openCheckout('Shorts & Reels', 1000, '48 Hours')">🚀 Open Project Checkout &amp; Onboarding →</button>`;
      }

      // 7. Revisions & Satisfaction
      if (text.includes('revision') || text.includes('change') || text.includes('edit again') || text.includes('satisfaction') || text.includes('guarantee')) {
        return `✨ <strong>Revision Policy &amp; Satisfaction:</strong><br/><br/>` +
               `• <strong>Standard Plans:</strong> Include 1 to 4 free revision rounds.<br/>` +
               `• <strong>Monthly Retainers:</strong> Unlimited revisions until you are 100% satisfied!<br/>` +
               `• <strong>Direct Collaboration:</strong> Chat 1-on-1 directly with your assigned video editor in the Client Portal to request instant tweaks.`;
      }

      // 8. Default intelligent fallback
      return `💡 <strong>Editzaar Digital Media Agency:</strong><br/><br/>` +
             `We specialize in <strong>High-Retention Video Editing, Web Development, and Paid Ad Growth</strong>.<br/><br/>` +
             `• <strong>Video Editing:</strong> Shorts &amp; Reels (₹1,000) · Motion Graphics (₹2,500) · YouTube Long-Form (₹5,000)<br/>` +
             `• <strong>Web Development:</strong> Landing Pages (₹4,999) · News Portals · Full Stack<br/>` +
             `• <strong>Direct Contact:</strong> WhatsApp Bikram Nath at <a href="https://wa.me/919476766340" target="_blank" style="color:var(--gold);text-decoration:underline;">+91 9476766340 ↗</a><br/><br/>` +
             `<button class="btn-gold-brand btn-sm" onclick="window.openCheckout('Shorts & Reels', 1000, '48 Hours')">Choose Plan &amp; Checkout →</button>`;
    }
  }

  // Initialize Checkout Modal and AI Chatbot on DOM ready
  ensureCheckoutModal();
  ensureAiChatbot();

});