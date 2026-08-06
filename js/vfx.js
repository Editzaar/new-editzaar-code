/* ============================================================
   EDITZAAR — Modern Motion & Animated VFX Engine 2.0 (vfx.js)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ──────────────────────────────────────────────
     1. MOUSE TORCH SPOTLIGHT TRACKER
  ────────────────────────────────────────────── */
  var spotlight = document.querySelector('.mouse-spotlight');
  if (!spotlight) {
    spotlight = document.createElement('div');
    spotlight.className = 'mouse-spotlight';
    document.body.prepend(spotlight);
  }

  document.addEventListener('mousemove', function (e) {
    var x = e.clientX;
    var y = e.clientY;
    document.documentElement.style.setProperty('--mouse-x', x + 'px');
    document.documentElement.style.setProperty('--mouse-y', y + 'px');
  });


  /* ──────────────────────────────────────────────
     2. FLOATING GOLD DUST PARTICLE CANVAS
  ────────────────────────────────────────────── */
  var canvas = document.getElementById('vfx-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'vfx-canvas';
    document.body.prepend(canvas);
  }

  var ctx = canvas.getContext('2d');
  var particles = [];
  var particleCount = Math.min(Math.floor(window.innerWidth / 22), 50);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  for (var i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.0 + 0.6,
      alpha: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.25
    });
  }

  function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(223, 186, 107, ' + p.alpha + ')';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(223, 186, 107, 0.9)';
      ctx.fill();
    }

    requestAnimationFrame(renderParticles);
  }

  renderParticles();


  /* ──────────────────────────────────────────────
     3. 3D CARD PERSPECTIVE TILT
  ────────────────────────────────────────────── */
  var tiltCards = document.querySelectorAll('.vcard, .pricing-card, .srv-service-card, .hstat, .bento-card');

  tiltCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      var centerX = rect.width / 2;
      var centerY = rect.height / 2;

      var rotateX = ((y - centerY) / centerY) * -7;
      var rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });


  /* ──────────────────────────────────────────────
     4. CURSOR EXPANSION ON HOVERABLE ELEMENTS
  ────────────────────────────────────────────── */
  var glow = document.getElementById('cglow');
  var dot  = document.getElementById('cdot');
  var hoverables = document.querySelectorAll('a, button, .vcard, .pricing-card, .filt, .bento-card');

  if (glow && dot) {
    hoverables.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        glow.style.transform = 'translate(-50%, -50%) scale(1.7)';
        glow.style.background = 'radial-gradient(circle, rgba(223, 186, 107, 0.22) 0%, transparent 70%)';
        dot.style.transform = 'translate(-50%, -50%) scale(1.8)';
      });

      el.addEventListener('mouseleave', function () {
        glow.style.transform = 'translate(-50%, -50%) scale(1)';
        glow.style.background = 'radial-gradient(circle, rgba(191, 164, 106, 0.07) 0%, transparent 70%)';
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  }

});
