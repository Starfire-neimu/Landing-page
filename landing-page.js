 (() => {
  'use strict';

  // Preloader
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader').classList.add('done'), 1800);
  });

  // Custom cursor (only on fine pointer devices)
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });
    const animate = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animate);
    };
    animate();
    const hoverables = 'a, button, .g-item, .coll-card, .nav-logo, input, textarea';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverables)) ring.classList.add('hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverables)) ring.classList.remove('hover');
    });
  }

  // Scroll handlers (throttled)
  const nav = document.getElementById('nav');
  const backTop = document.getElementById('backTop');
  const progress = document.getElementById('scrollProgress');
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = ((y / h) * 100) + '%';
    nav.classList.toggle('scrolled', y > 60);
    backTop.classList.toggle('show', y > 600);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Hero parallax (only on desktop with fine pointer)
  const heroBg = document.getElementById('heroBg');
  const heroVisual = document.getElementById('heroVisual');
  if (window.matchMedia('(pointer: fine)').matches && heroBg) {
    let px = 0, py = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', e => {
      tx = (e.clientX / window.innerWidth - 0.5) * 15;
      ty = (e.clientY / window.innerHeight - 0.5) * 15;
    });
    const parallax = () => {
      px += (tx - px) * 0.08;
      py += (ty - py) * 0.08;
      heroBg.style.transform = `scale(1.18) translate(${px * 0.5}px, ${py * 0.5}px)`;
      if (heroVisual) heroVisual.style.transform = `translate(${px * -0.3}px, ${py * -0.3}px)`;
      requestAnimationFrame(parallax);
    };
    parallax();
  }

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Scroll reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbTitle = document.getElementById('lbTitle');
  const lbCat = document.getElementById('lbCat');
  document.querySelectorAll('.g-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbTitle.textContent = item.dataset.title || '';
      lbCat.textContent = item.dataset.cat || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  const closeLb = () => { lightbox.classList.remove('open'); document.body.style.overflow = ''; };
  document.getElementById('lbClose').addEventListener('click', closeLb);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

  // Testimonials
  const testi = [
    { q: "To wear an Aurum piece is to carry a quiet conversation with time itself. There is nothing louder — and nothing more lasting — than this kind of devotion.", n: "Isabella Moreau", r: "Editor-in-Chief, Vogue Paris" },
    { q: "In a world addicted to noise, Aurum composes silence. Each piece is a poem written in thread, stone, and patience.", n: "Henri de Vauban", r: "Creative Director, Le Monde" },
    { q: "I have collected art for thirty years. What Aurum creates is not fashion — it is inheritance.", n: "Catherine Ashford", r: "Private Collector, London" }
  ];
  const qEl = document.getElementById('testiQuote');
  const nEl = document.getElementById('testiName');
  const rEl = document.getElementById('testiRole');
  const dots = document.querySelectorAll('#testiDots button');
  let tIdx = 0;
  const setTesti = i => {
    tIdx = i;
    qEl.style.opacity = 0;
    qEl.style.transform = 'translateY(15px)';
    setTimeout(() => {
      qEl.textContent = testi[i].q;
      nEl.textContent = testi[i].n;
      rEl.textContent = testi[i].r;
      qEl.style.opacity = 1;
      qEl.style.transform = 'translateY(0)';
    }, 350);
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
  };
  dots.forEach(d => d.addEventListener('click', () => setTesti(+d.dataset.i)));
  setInterval(() => setTesti((tIdx + 1) % testi.length), 7000);

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
      }
    });
  });
})();
