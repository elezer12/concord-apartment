/* ============================================================
   CONCORD APARTMENTS — Main JavaScript
   Project: concordapartments.com / concord-apartment.com
   Author: Web Development Team
   Version: 2.0

   TABLE OF CONTENTS
   1.  Gold Particle Generator (Hero)
   2.  Navigation — Scroll State
   3.  Mobile Menu
   4.  Scroll Reveal Animations (IntersectionObserver)
   5.  Gold Rule Animations (IntersectionObserver)
   6.  Hero Stats — Animated Number Counters
   7.  Enquiry Form — Submission Feedback
   ============================================================ */


/* ============================================================
   1. GOLD PARTICLE GENERATOR
   Creates 22 small gold dots that float upward through the
   hero section, giving a subtle sense of luxury and depth.
   ============================================================ */
(function generateParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const PARTICLE_COUNT = 22;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Randomise position, size, speed, and delay so they feel organic
    const left          = Math.random() * 100;        // % across the hero
    const startY        = Math.random() * 100 + 20;   // % down (not at very top)
    const duration      = 8 + Math.random() * 12;     // 8–20s per cycle
    const delay         = Math.random() * 8;           // stagger start times
    const size          = 1 + Math.random() * 2;       // 1–3px diameter

    particle.style.cssText = [
      `left: ${left}%`,
      `top: ${startY}%`,
      `animation-duration: ${duration}s`,
      `animation-delay: ${delay}s`,
      `width: ${size}px`,
      `height: ${size}px`
    ].join('; ');

    container.appendChild(particle);
  }
})();


/* ============================================================
   2. NAVIGATION — SCROLL STATE
   Adds a .scrolled class to the nav once the user scrolls
   past 60px, which triggers the dark background + blur.
   ============================================================ */
(function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const SCROLL_THRESHOLD = 60;

  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
  }

  // Run once on load (in case the page is refreshed mid-scroll)
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
})();


/* ============================================================
   3. MOBILE MENU
   Opens and closes the fullscreen mobile navigation overlay.
   ============================================================ */
function openMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;
  menu.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;
  menu.classList.remove('active');
  document.body.style.overflow = '';
}

// Close the menu when the user clicks any nav link inside it
document.querySelectorAll('#mobile-menu a').forEach(function(link) {
  link.addEventListener('click', closeMobileMenu);
});

// Close the menu when pressing the Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeMobileMenu();
});


/* ============================================================
   4. SCROLL REVEAL ANIMATIONS
   Uses IntersectionObserver to add .visible to elements
   with the classes: .reveal, .reveal-left, .reveal-right.
   CSS handles the actual animation (opacity + translate).
   ============================================================ */
(function initReveal() {
  const SELECTOR = '.reveal, .reveal-left, .reveal-right';
  const elements = document.querySelectorAll(SELECTOR);
  if (!elements.length) return;

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after animating in — no need to watch anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px' // Trigger slightly before the element is fully in view
  });

  elements.forEach(function(el) { observer.observe(el); });
})();


/* ============================================================
   5. GOLD RULE ANIMATIONS
   The decorative gold horizontal rules start at width: 0
   and expand to 80px when they scroll into view.
   Elements must have the [data-animate] attribute.
   ============================================================ */
(function initGoldRules() {
  const rules = document.querySelectorAll('[data-animate]');
  if (!rules.length) return;

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.8 });

  rules.forEach(function(rule) { observer.observe(rule); });
})();


/* ============================================================
   6. HERO STATS — ANIMATED NUMBER COUNTERS
   Counts up from 0 to the [data-count] target value using
   an eased animation when the stats come into view.
   ============================================================ */
(function initCounters() {
  const statsBlock = document.querySelector('.hero-stats');
  if (!statsBlock) return;

  let hasAnimated = false;

  function animateCounters() {
    if (hasAnimated) return;

    const rect = statsBlock.getBoundingClientRect();
    if (rect.top >= window.innerHeight) return; // Not in view yet

    hasAnimated = true;

    document.querySelectorAll('[data-count]').forEach(function(el) {
      const target       = parseInt(el.getAttribute('data-count'), 10);
      const sup          = el.querySelector('sup') ? el.querySelector('sup').outerHTML : '';
      const DURATION     = 1600; // milliseconds
      let startTime      = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;

        const elapsed  = timestamp - startTime;
        const progress = Math.min(elapsed / DURATION, 1);

        // Cubic ease-out: starts fast, slows to a stop
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = Math.round(eased * target);

        el.innerHTML = current + sup;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    });
  }

  // Check on scroll and immediately on load
  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters();
})();


/* ============================================================
   7. ENQUIRY FORM — SUBMISSION FEEDBACK
   Provides visual confirmation when the user submits the form.
   Replace the setTimeout mock with a real API call (e.g. Formspree,
   EmailJS, or a backend endpoint) when connecting to a backend.
   ============================================================ */
function submitForm(button) {
  // Basic validation: check all required fields are filled
  const form   = button.closest('.contact-form');
  const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
  let allFilled = true;

  inputs.forEach(function(input) {
    if (!input.value.trim()) {
      allFilled = false;
      input.style.borderBottomColor = '#c0392b'; // Red indicator for empty field
    } else {
      input.style.borderBottomColor = ''; // Reset
    }
  });

  if (!allFilled) {
    button.textContent = 'Please fill all fields';
    setTimeout(function() { button.textContent = 'Send Enquiry'; }, 2500);
    return;
  }

  // Show sending state
  const originalText = button.textContent;
  button.textContent = 'Sending...';
  button.disabled = true;
  button.style.opacity = '0.8';

  // -----------------------------------------------------------------
  // TODO: Replace this setTimeout with your real API / form submission
  // Example with Formspree:
  //   fetch('https://formspree.io/f/YOUR_FORM_ID', {
  //     method: 'POST',
  //     body: new FormData(form),
  //     headers: { 'Accept': 'application/json' }
  //   }).then(...).catch(...)
  // -----------------------------------------------------------------
  setTimeout(function() {
    button.textContent = 'Enquiry Sent \u2714\u2014 We\'ll be in touch shortly';
    button.style.background  = '#C8A96B';
    button.style.opacity     = '1';

    // Reset the button after 5 seconds
    setTimeout(function() {
      button.textContent       = originalText;
      button.disabled          = false;
      button.style.background  = '';
    }, 5000);
  }, 1200);
}
