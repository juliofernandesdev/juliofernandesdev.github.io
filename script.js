// ==========================================================================
// Site JavaScript - Liquid Glass Premium
// Interações fluidas e animações elegantes
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ==========================================================================
  // Utilities
  // ==========================================================================
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Debounce function for performance
  function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ==========================================================================
  // Current Year
  // ==========================================================================
  
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // ==========================================================================
  // Mobile Menu - Liquid Glass Drawer
  // ==========================================================================
  
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-navigation');
  const navOverlay = document.getElementById('nav-overlay');
  const menuIcon = menuToggle?.querySelector('.menu-icon');

  function closeMenu() {
    if (!menuToggle || !mainNav) return;
    
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    mainNav.classList.remove('open');
    navOverlay?.classList.remove('active');
    menuIcon?.classList.remove('open');
    document.body.style.overflow = '';
    navOverlay?.setAttribute('aria-hidden', 'true');
  }

  function openMenu() {
    if (!menuToggle || !mainNav) return;
    
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Fechar menu');
    mainNav.classList.add('open');
    navOverlay?.classList.add('active');
    menuIcon?.classList.add('open');
    document.body.style.overflow = 'hidden';
    navOverlay?.setAttribute('aria-hidden', 'false');
    
    // Focus first nav link for accessibility
    const firstLink = mainNav.querySelector('.nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 300);
    }
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function() {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    // Close menu on overlay click
    navOverlay?.addEventListener('click', closeMenu);

    // Close menu on nav link click
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // ==========================================================================
  // Smooth Scroll with Header Offset
  // ==========================================================================
  
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector('.header');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // Scroll-based Header Styling - Liquid Glass Effect
  // ==========================================================================
  
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  // Initial check
  updateHeader();

  // ==========================================================================
  // Intersection Observer - Reveal Animations
  // ==========================================================================
  
  if (!prefersReducedMotion) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for reveal animation
    const revealElements = document.querySelectorAll(
      '.value-item, .focus-item, .contact-link, .paragraphs p'
    );
    
    revealElements.forEach((el, index) => {
      el.style.transitionDelay = `${index * 0.05}s`;
      el.classList.add('reveal-element');
      revealObserver.observe(el);
    });

    // Add reveal CSS
    const style = document.createElement('style');
    style.textContent = `
      .reveal-element {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), 
                    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      .reveal-element.revealed {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  // ==========================================================================
  // Keyboard Navigation
  // ==========================================================================
  
  document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape
    if (e.key === 'Escape' && mainNav?.classList.contains('open')) {
      closeMenu();
      menuToggle?.focus();
    }
  });

  // Focus trap for mobile menu
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    });
  }

  if (mainNav) {
    trapFocus(mainNav);
  }

  // ==========================================================================
  // Touch Device Optimizations
  // ==========================================================================
  
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
    
    // Remove hover effects on touch devices
    const style = document.createElement('style');
    style.textContent = `
      .touch-device .value-item:hover,
      .touch-device .focus-item:hover,
      .touch-device .contact-link:hover {
        transform: none;
      }
    `;
    document.head.appendChild(style);
  }

  // ==========================================================================
  // Image Loading Animation
  // ==========================================================================
  
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
      });
    }
  });

  // ==========================================================================
  // Performance: Passive scroll listeners
  // ==========================================================================
  
  // Use passive listeners for better scroll performance
  window.addEventListener('touchstart', function() {}, { passive: true });
  window.addEventListener('touchmove', function() {}, { passive: true });

  // ==========================================================================
  // Resize Handler
  // ==========================================================================
  
  const handleResize = debounce(function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768 && mainNav?.classList.contains('open')) {
      closeMenu();
    }
  }, 100);

  window.addEventListener('resize', handleResize, { passive: true });

  // ==========================================================================
  // Parallax Effect for Hero (optional, respects reduced motion)
  // ==========================================================================
  
  if (!prefersReducedMotion) {
    const heroAvatar = document.querySelector('.hero-avatar');
    const avatarGlow = document.querySelector('.avatar-glow');
    
    if (heroAvatar) {
      document.addEventListener('mousemove', debounce(function(e) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPos = (clientX / innerWidth - 0.5) * 10;
        const yPos = (clientY / innerHeight - 0.5) * 10;
        
        heroAvatar.style.transform = `translate(${xPos}px, ${yPos}px)`;
        
        if (avatarGlow) {
          avatarGlow.style.transform = `translate(${xPos * 1.5}px, ${yPos * 1.5}px) scale(1)`;
        }
      }, 16));
    }
  }

  // ==========================================================================
  // Scroll Progress Indicator (optional)
  // ==========================================================================
  
  function createScrollProgress() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);
    
    const style = document.createElement('style');
    style.textContent = `
      .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 2px;
        background: linear-gradient(90deg, var(--color-accent), var(--color-accent-hover));
        z-index: 1001;
        transition: width 0.1s linear;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('scroll', function() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progress.style.width = scrollPercent + '%';
    }, { passive: true });
  }
  
  createScrollProgress();

  // ==========================================================================
  // Console Welcome Message
  // ==========================================================================
  
  console.log(
    '%c🚀 Site carregado com sucesso!',
    'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 14px;'
  );
  console.log(
    '%cConstruindo o que ainda não existe.',
    'color: #86868b; font-style: italic; font-size: 12px;'
  );
});
