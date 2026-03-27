/* ═══════════════════════════════════════════════════════════════════
   PORTFOLIO — JÚLIO AUGUSTO — script.js
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ── THEME TOGGLE ───────────────────────────────────────────────── */
(function initTheme() {
  const stored = localStorage.getItem('ja-theme');
  const preferred = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', preferred);
  document.body.setAttribute('data-theme', preferred);
})();

document.addEventListener('DOMContentLoaded', () => {
  const body        = document.body;
  const themeToggle = document.getElementById('themeToggle');

  function applyTheme(theme) {
    body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ja-theme', theme);
  }

  themeToggle.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ── NAVBAR: scroll shadow + active section ─────────────────── */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      // Scrolled shadow
      navbar.classList.toggle('scrolled', window.scrollY > 24);

      // Active section highlight
      let current = '';
      sections.forEach(sec => {
        const top = sec.offsetTop - 100;
        if (window.scrollY >= top) current = sec.getAttribute('id');
      });

      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial call

  /* ── MOBILE NAV ─────────────────────────────────────────────── */
  const burger    = document.getElementById('navBurger');
  const mobileNav = document.getElementById('navMobile');

  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    mobileNav.classList.toggle('open', open);
    mobileNav.setAttribute('aria-hidden', !open);
  });

  // Close on nav-link click
  mobileNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
  });

  /* ── AOS (Animate On Scroll) — lightweight custom impl ──────── */
  const aosElements = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        aosObserver.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  aosElements.forEach(el => aosObserver.observe(el));

  /* ── FOOTER YEAR ────────────────────────────────────────────── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── CONTACT FORM ───────────────────────────────────────────── */
  const form       = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');

      // Basic client-side validation
      const name    = form.querySelector('#contact-name').value.trim();
      const email   = form.querySelector('#contact-email').value.trim();
      const message = form.querySelector('#contact-message').value.trim();

      if (!name || !email || !message) {
        showStatus('Por favor, preencha todos os campos.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('Insira um email válido.', 'error');
        return;
      }

      btn.disabled    = true;
      btn.textContent = 'Enviando…';

      // Simulate async submission (replace with real endpoint)
      await new Promise(r => setTimeout(r, 1200));

      showStatus('Mensagem enviada! Retornarei em breve.', 'success');
      form.reset();
      btn.disabled    = false;
      btn.textContent = 'Enviar mensagem';
    });
  }

  function showStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className   = 'form-status ' + type;
    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className   = 'form-status';
    }, 5000);
  }

  /* ── SMOOTH SCROLL for anchor links ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── CURSOR GLOW on hero (desktop only) ─────────────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('mousemove', e => {
        const rect = hero.getBoundingClientRect();
        const x    = ((e.clientX - rect.left) / rect.width)  * 100;
        const y    = ((e.clientY - rect.top)  / rect.height) * 100;
        hero.style.setProperty('--mouse-x', x + '%');
        hero.style.setProperty('--mouse-y', y + '%');
      });
    }
  }
});
