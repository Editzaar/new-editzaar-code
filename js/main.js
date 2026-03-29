/* ============================================================
   EDITZAAR — main.js
   All interactive behaviour: cursor, typing, scroll reveal,
   counters, filters, mobile nav, booking form → WhatsApp
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ──────────────────────────────────────────────
     1. CUSTOM CURSOR GLOW
  ────────────────────────────────────────────── */
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


  /* ──────────────────────────────────────────────
     2. TYPING HEADLINE EFFECT
  ────────────────────────────────────────────── */
  var typingTarget = document.getElementById('typing-target');
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

  setTimeout(typeLoop, 1000);


  /* ──────────────────────────────────────────────
     3. SCROLL REVEAL  (IntersectionObserver)
  ────────────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');

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
    // Fallback: show all immediately
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ──────────────────────────────────────────────
     4. ANIMATED NUMBER COUNTERS
  ────────────────────────────────────────────── */
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
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
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


  /* ──────────────────────────────────────────────
     5. VIDEO PORTFOLIO FILTER
  ────────────────────────────────────────────── */
  var filterBtns = document.querySelectorAll('#filters .filt');
  var videoCards = document.querySelectorAll('#vgrid .vcard');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active button
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-f');

      videoCards.forEach(function (card) {
        var cat = card.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          // Re-trigger subtle animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(function () {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });



  // Inside your filter click event
if (filter !== 'all' && cat !== filter) {
    card.style.display = 'none';
    const v = card.querySelector('video');
    if(v) v.pause(); // Stop hidden videos from playing in the background
}


  /* ──────────────────────────────────────────────
     6. BOOKING FORM — PLAN SELECTOR
  ────────────────────────────────────────────── */
  var planOpts = document.querySelectorAll('#planSel .plan-opt');

  planOpts.forEach(function (opt) {
    opt.addEventListener('click', function () {
      planOpts.forEach(function (o) { o.classList.remove('sel'); });
      opt.classList.add('sel');
    });
  });


  /* ──────────────────────────────────────────────
     7. BOOKING FORM — WHATSAPP SUBMIT
  ────────────────────────────────────────────── */
  var submitBtn = document.getElementById('submitBtn');

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      var name    = (document.getElementById('fname').value   || '').trim();
      var phone   = (document.getElementById('fphone').value  || '').trim();
      var message = (document.getElementById('fmsg').value    || '').trim();

      var selectedPlan = '';
      var selOpt = document.querySelector('#planSel .plan-opt.sel');
      if (selOpt) selectedPlan = selOpt.getAttribute('data-plan') || '';

      // Basic validation
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
      var waNumber = '919476766340'; // ← Replace with your actual WhatsApp number (no + sign)
      window.open('https://wa.me/' + waNumber + '?text=' + encoded, '_blank');
    });
  }


  /* ──────────────────────────────────────────────
     8. "BOOK SIMILAR" BUTTONS → WHATSAPP
  ────────────────────────────────────────────── */
  var bookSimilarBtns = document.querySelectorAll('.vbtn[data-wa]');

  bookSimilarBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var videoTitle = btn.getAttribute('data-wa') || '';
      var text = 'Hi Editzaar! I saw your work on your website and I want something similar to: "' + videoTitle + '". Can we discuss?';
      var encoded  = encodeURIComponent(text);
      var waNumber = '919476766340'; // ← Replace with your actual WhatsApp number
      window.open('https://wa.me/' + waNumber + '?text=' + encoded, '_blank');
    });
  });


  /* ──────────────────────────────────────────────
     9. MOBILE NAV TOGGLE
  ────────────────────────────────────────────── */
  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }


  /* ──────────────────────────────────────────────
     10. NAVBAR SCROLL SHADOW
  ────────────────────────────────────────────── */
  var navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.style.boxShadow = '0 1px 32px rgba(0,0,0,0.55)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });


  /* ──────────────────────────────────────────────
     11. SMOOTH SCROLL FOR ANCHOR LINKS
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
