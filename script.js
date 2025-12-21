// ==========================================================================
// Site JavaScript - Funcionalidades Interativas
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-navigation');
  const menuIcon = menuToggle?.querySelector('.menu-icon');

  if (menuToggle && mainNav && menuIcon) {
    menuToggle.addEventListener('click', function() {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      
      menuToggle.setAttribute('aria-expanded', !isOpen);
      menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
      mainNav.classList.toggle('open');
      menuIcon.classList.toggle('open');
      
      // Prevenir scroll do body quando menu está aberto
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    // Close menu when clicking on nav links
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        mainNav.classList.remove('open');
        menuIcon.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Add scroll-based header styling
  const header = document.querySelector('.header');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
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
  });

  // Intersection Observer for reveal animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections for reveal animation
  const sections = document.querySelectorAll('.section:not(.hero)');
  sections.forEach(function(section) {
    section.classList.add('reveal');
    revealObserver.observe(section);
  });

  // Add reveal CSS dynamically
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
    
    @media (prefers-reduced-motion: reduce) {
      .reveal {
        opacity: 1;
        transform: none;
        transition: none;
      }
    }
    
    .header.scrolled {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
  `;
  document.head.appendChild(style);

  // Keyboard navigation improvements
  document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
      const menuToggle = document.getElementById('menu-toggle');
      const mainNav = document.getElementById('main-navigation');
      const menuIcon = menuToggle?.querySelector('.menu-icon');
      
      if (mainNav?.classList.contains('open')) {
        menuToggle?.setAttribute('aria-expanded', 'false');
        menuToggle?.setAttribute('aria-label', 'Abrir menu');
        mainNav.classList.remove('open');
        menuIcon?.classList.remove('open');
        document.body.style.overflow = '';
        menuToggle?.focus();
      }
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

  // Touch improvements for mobile
  if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Add touch feedback to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .contact-link');
    interactiveElements.forEach(function(el) {
      el.addEventListener('touchstart', function() {
        this.style.opacity = '0.7';
      });
      
      el.addEventListener('touchend', function() {
        setTimeout(() => {
          this.style.opacity = '';
        }, 150);
      });
    });
  }

  // Performance: Lazy load images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  console.log('Site carregado com sucesso! 🚀');
});
