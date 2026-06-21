/**
 * IsBar AI — Shared Script
 * Navbar effects, hamburger menu, fade-in animations, smooth scroll
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════
     NAVBAR SCROLL EFFECT
     ═══════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    handleScroll(); // check initial state
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /* ═══════════════════════════════════════════
     HAMBURGER MENU TOGGLE
     ═══════════════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');

      // Toggle body scroll when menu is open
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when any nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') &&
          !navLinks.contains(e.target) &&
          !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ═══════════════════════════════════════════
     SMOOTH SCROLL FOR ANCHOR LINKS
     ═══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 70;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ═══════════════════════════════════════════
     INTERSECTION OBSERVER — FADE IN ANIMATIONS
     Selectors match elements in the existing design
     ═══════════════════════════════════════════ */
  const animateSelectors = [
    '.service-card',
    '.course-card',
    '.feature-item',
    '.benefit-item',
    '.join-card',
    '.quiz-card',
    '.fade-in',
    '.live-section',
    '.community-cta .cta-buttons',
    '.stats-grid',
    '.welcome-section'
  ];

  const animateElements = document.querySelectorAll(animateSelectors.join(','));

  if (animateElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Add staggered delay based on index within parent
          const parent = entry.target.parentElement;
          if (parent) {
            const siblings = parent.querySelectorAll(animateSelectors.join(','));
            const index = Array.from(siblings).indexOf(entry.target);
            if (index >= 0) {
              entry.target.style.transitionDelay = `${(index % 4) * 0.1}s`;
            }
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all elements if IntersectionObserver not supported
    animateElements.forEach(el => el.classList.add('visible'));
  }

  /* ═══════════════════════════════════════════
     MOBILE MENU IMPROVEMENTS — Touch handling
     ═══════════════════════════════════════════ */
  // Prevent body scroll issues on iOS when menu is open
  if (navLinks) {
    navLinks.addEventListener('touchmove', (e) => {
      if (navLinks.classList.contains('open')) {
        e.stopPropagation();
      }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════
     ACTIVE NAV LINK HIGHLIGHTING
     ═══════════════════════════════════════════ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else if (currentPage === '' && href === 'index.html') {
      link.classList.add('active');
    }
  });
});
