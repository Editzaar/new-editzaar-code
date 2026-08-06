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

});
