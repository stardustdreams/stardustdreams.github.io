/* NovelCraft main.js v3 */
(function () {
  /* ── Nav ── */
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.nav-burger');
  const links = document.querySelector('.nav-links');

  burger?.addEventListener('click', () => {
    links?.classList.toggle('open');
    const sp = burger.querySelectorAll('span');
    const open = links?.classList.contains('open');
    sp[0].style.transform = open ? 'rotate(45deg) translate(4px,4px)' : '';
    sp[1].style.opacity   = open ? '0' : '';
    sp[2].style.transform = open ? 'rotate(-45deg) translate(4px,-4px)' : '';
  });

  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    burger?.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }));

  /* Active link */
  const pg = location.pathname.split('/').pop() || 'index.html';
  links?.querySelectorAll('a').forEach(a => {
    const h = a.getAttribute('href') || '';
    if (h === pg || (pg === '' && h === 'index.html')) a.classList.add('active');
  });

  /* ── Scroll animations ── */
  const io = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('nc-on'); }),
    { threshold: .1, rootMargin: '0px 0px -35px 0px' }
  );
  document.querySelectorAll('.nc-fu').forEach(el => io.observe(el));

  /* ── Counter ── */
  function count(el, target, dur) {
    let v = 0;
    const step = target / (dur / 16);
    const t = setInterval(() => {
      v += step;
      if (v >= target) { el.textContent = target.toLocaleString(); clearInterval(t); }
      else el.textContent = Math.floor(v).toLocaleString();
    }, 16);
  }
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { count(e.target, +e.target.dataset.n, 1400); cio.unobserve(e.target); }
  }), { threshold: .5 });
  document.querySelectorAll('[data-n]').forEach(el => cio.observe(el));

  /* ── Particle canvas ── */
  window.initParticles = function (id) {
    const c = document.getElementById(id);
    if (!c) return;
    const ctx = c.getContext('2d');
    let pts = [];
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    const mk = () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - .5) * .26, vy: (Math.random() - .5) * .26,
      r: Math.random() * 1.2 + .3, a: Math.random() * .32 + .08,
      p: Math.random() * Math.PI * 2,
    });
    resize();
    pts = Array.from({ length: 70 }, mk);
    (function draw() {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.p += .012;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,171,92,${p.a * (.8 + .2 * Math.sin(p.p))})`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(200,171,92,${.05 * (1 - d / 90)})`;
            ctx.lineWidth = .4;
            ctx.stroke();
          }
        }
      requestAnimationFrame(draw);
    })();
    window.addEventListener('resize', resize);
  };

  /* ── Copy code ── */
  window.copyCode = function (btn) {
    const pre = btn.closest('.nc-code-block')?.querySelector('pre');
    if (!pre) return;
    navigator.clipboard.writeText(pre.innerText).then(() => {
      btn.textContent = '✓ コピー済み';
      setTimeout(() => btn.textContent = 'コピー', 2000);
    });
  };

  /* ── FAQ accordion ── */
  document.querySelectorAll('.nc-faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.nc-faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.nc-faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 82, behavior: 'smooth' }); }
    });
  });
})();