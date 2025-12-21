// ==========================================================================
// Cutting-edge animations, interactions, and effects
// ==========================================================================

(function() {
  'use strict';

  // ==========================================================================
  // Configuration
  // ==========================================================================
  
  const CONFIG = {
    cursor: {
      size: 20,
      followerSize: 40,
      hoverScale: 2,
      ease: 0.15
    },
    scroll: {
      threshold: 50,
      revealOffset: 100
    },
    animation: {
      staggerDelay: 0.08,
      duration: 800
    }
  };

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  // Utilities
  // ==========================================================================
  
  const lerp = (start, end, factor) => start + (end - start) * factor;
  
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  
  const debounce = (func, wait = 10) => {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // ==========================================================================
  // DOM Ready
  // ==========================================================================
  
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Set current year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Initialize all modules
    initBackgroundEffects();
    initCustomCursor();
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initScrollProgress();
    initRevealAnimations();
    initParallaxEffects();
    initMagneticButtons();
    initTextAnimations();
    initTiltEffect();
    initImageLoading();
    
    // Log success
    logWelcome();
  }

  // ==========================================================================
  // Background Effects - Aurora Mesh & Gradient Orbs
  // ==========================================================================
  
  function initBackgroundEffects() {
    // Create aurora background
    const aurora = document.createElement('div');
    aurora.className = 'aurora-bg';
    document.body.prepend(aurora);

    // Create noise overlay
    const noise = document.createElement('div');
    noise.className = 'noise-overlay';
    document.body.prepend(noise);

    // Create gradient orbs
    const orbsContainer = document.createElement('div');
    orbsContainer.setAttribute('aria-hidden', 'true');
    
    for (let i = 1; i <= 4; i++) {
      const orb = document.createElement('div');
      orb.className = `gradient-orb gradient-orb-${i}`;
      orbsContainer.appendChild(orb);
    }
    
    document.body.prepend(orbsContainer);

    // Animate orbs with mouse movement (desktop only)
    if (!prefersReducedMotion && window.innerWidth > 1024) {
      let mouseX = 0, mouseY = 0;
      let currentX = 0, currentY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
      });

      function animateOrbs() {
        currentX = lerp(currentX, mouseX, 0.05);
        currentY = lerp(currentY, mouseY, 0.05);

        const orbs = document.querySelectorAll('.gradient-orb');
        orbs.forEach((orb, i) => {
          const factor = (i + 1) * 0.3;
          orb.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
        });

        requestAnimationFrame(animateOrbs);
      }
      
      animateOrbs();
    }
  }

  // ==========================================================================
  // Custom Cursor - Premium Interactive
  // ==========================================================================
  
  function initCustomCursor() {
    if (prefersReducedMotion || window.innerWidth <= 1024 || 'ontouchstart' in window) {
      return;
    }

    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    
    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    let isHovering = false;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    });

    // Animate cursor with lerp for smooth following
    function animateCursor() {
      // Cursor follows immediately
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';

      // Follower lerps behind
      followerX = lerp(followerX, cursorX, CONFIG.cursor.ease);
      followerY = lerp(followerY, cursorY, CONFIG.cursor.ease);
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';

      requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, .value-item, .focus-item, .contact-link, .nav-link, .logo, .menu-button'
    );

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
        isHovering = true;
      });

      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
        isHovering = false;
      });
    });

    // Click effect
    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    });
  }

  // ==========================================================================
  // Mobile Menu - Liquid Glass Drawer
  // ==========================================================================
  
  function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-navigation');
    const navOverlay = document.getElementById('nav-overlay');
    const menuIcon = menuToggle?.querySelector('.menu-icon');
    const navLinks = mainNav?.querySelectorAll('.nav-link');

    if (!menuToggle || !mainNav) return;

    function closeMenu() {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
      mainNav.classList.remove('open');
      navOverlay?.classList.remove('active');
      menuIcon?.classList.remove('open');
      document.body.style.overflow = '';
      
      // Reset nav link animations
      navLinks?.forEach(link => {
        link.style.animation = 'none';
        link.offsetHeight; // Trigger reflow
        link.style.animation = '';
      });
    }

    function openMenu() {
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Fechar menu');
      mainNav.classList.add('open');
      navOverlay?.classList.add('active');
      menuIcon?.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Focus first link after animation
      setTimeout(() => navLinks?.[0]?.focus(), 400);
    }

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    navOverlay?.addEventListener('click', closeMenu);
    navLinks?.forEach(link => link.addEventListener('click', closeMenu));

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Close on resize to desktop
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth >= 768 && mainNav.classList.contains('open')) {
        closeMenu();
      }
    }, 100));
  }

  // ==========================================================================
  // Smooth Scroll - Premium
  // ==========================================================================
  
  function initSmoothScroll() {
    const header = document.querySelector('.header');
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        e.preventDefault();
        
        const headerHeight = header?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 30;
        
        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      });
    });
  }

  // ==========================================================================
  // Header Scroll Effect
  // ==========================================================================
  
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
      const scrollY = window.scrollY;
      
      if (scrollY > CONFIG.scroll.threshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScrollY = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    updateHeader();
  }

  // ==========================================================================
  // Scroll Progress Bar
  // ==========================================================================
  
  function initScrollProgress() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progress.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', throttle(updateProgress, 10), { passive: true });
    updateProgress();
  }

  // ==========================================================================
  // Reveal Animations - Intersection Observer
  // ==========================================================================
  
  function initRevealAnimations() {
    if (prefersReducedMotion) return;

    const observerOptions = {
      root: null,
      rootMargin: '-50px 0px',
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

    // Value items with stagger
    const valueItems = document.querySelectorAll('.value-item');
    valueItems.forEach((item, index) => {
      item.classList.add('reveal-scale');
      item.style.transitionDelay = `${index * CONFIG.animation.staggerDelay}s`;
      revealObserver.observe(item);
    });

    // Focus items with stagger
    const focusItems = document.querySelectorAll('.focus-item');
    focusItems.forEach((item, index) => {
      item.classList.add('reveal-text');
      item.style.transitionDelay = `${index * CONFIG.animation.staggerDelay}s`;
      revealObserver.observe(item);
    });

    // Contact links
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach((link, index) => {
      link.classList.add('reveal-scale');
      link.style.transitionDelay = `${index * CONFIG.animation.staggerDelay}s`;
      revealObserver.observe(link);
    });

    // Paragraphs with stagger
    const paragraphs = document.querySelectorAll('.paragraphs p');
    paragraphs.forEach((p, index) => {
      p.classList.add('reveal-text');
      p.style.transitionDelay = `${index * 0.1}s`;
      revealObserver.observe(p);
    });

    // Section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
      header.classList.add('reveal-text');
      revealObserver.observe(header);
    });
  }

  // ==========================================================================
  // Parallax Effects
  // ==========================================================================
  
  function initParallaxEffects() {
    if (prefersReducedMotion || window.innerWidth <= 768) return;

    const heroAvatar = document.querySelector('.hero-avatar');
    const avatarGlow = document.querySelector('.avatar-glow');
    
    if (!heroAvatar) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      targetX = (clientX / innerWidth - 0.5) * 20;
      targetY = (clientY / innerHeight - 0.5) * 20;
    });

    function animateParallax() {
      currentX = lerp(currentX, targetX, 0.05);
      currentY = lerp(currentY, targetY, 0.05);
      
      heroAvatar.style.transform = `rotateY(${currentX * 0.5}deg) rotateX(${-currentY * 0.5}deg)`;
      
      if (avatarGlow) {
        avatarGlow.style.transform = `translate(${currentX * 0.5}px, ${currentY * 0.5}px) rotate(${currentX * 2}deg)`;
      }

      requestAnimationFrame(animateParallax);
    }

    animateParallax();
  }

  // ==========================================================================
  // Magnetic Buttons Effect
  // ==========================================================================
  
  function initMagneticButtons() {
    if (prefersReducedMotion || window.innerWidth <= 1024) return;

    const magneticElements = document.querySelectorAll('.menu-button, .logo');

    magneticElements.forEach(el => {
      el.classList.add('magnetic');

      el.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      el.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ==========================================================================
  // Text Split Animation
  // ==========================================================================
  
  function initTextAnimations() {
    if (prefersReducedMotion) return;

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      heroTitle.style.opacity = '0';
      
      setTimeout(() => {
        heroTitle.style.opacity = '1';
        heroTitle.style.animation = 'heroReveal 1s var(--ease-out-expo) forwards';
      }, 400);
    }
  }

  // ==========================================================================
  // 3D Tilt Effect on Cards
  // ==========================================================================
  
  function initTiltEffect() {
    if (prefersReducedMotion || window.innerWidth <= 768 || 'ontouchstart' in window) return;

    const tiltElements = document.querySelectorAll('.value-item, .contact-link');

    tiltElements.forEach(el => {
      el.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      el.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ==========================================================================
  // Image Loading Animation
  // ==========================================================================
  
  function initImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s var(--ease-out-expo)';
        
        img.addEventListener('load', function() {
          this.style.opacity = '1';
          this.classList.add('loaded');
        });
      }
    });
  }

  // ==========================================================================
  // Console Welcome Message
  // ==========================================================================
  
  function logWelcome() {
    const styles = [
      'background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f64f59 100%)',
      'color: white',
      'padding: 15px 25px',
      'border-radius: 12px',
      'font-weight: bold',
      'font-size: 16px',
      'text-shadow: 0 2px 4px rgba(0,0,0,0.2)'
    ].join(';');

    console.log('%c🚀 Site Ultra Premium Carregado!', styles);
    console.log(
      '%cConstruindo o que ainda não existe.\nO site pessoal mais tecnológico da internet.',
      'color: #86868b; font-size: 12px; font-style: italic;'
    );
    console.log(
      '%c⚡ HTML5 & CSS3 no limite do possível',
      'color: #0071e3; font-weight: bold;'
    );
  }

  // ==========================================================================
  // Performance: Passive Event Listeners
  // ==========================================================================
  
  window.addEventListener('touchstart', () => {}, { passive: true });
  window.addEventListener('touchmove', () => {}, { passive: true });
  window.addEventListener('wheel', () => {}, { passive: true });

})();

