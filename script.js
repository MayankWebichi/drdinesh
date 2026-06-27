/* ================================================================
   DR. DINESH CHOUDHARY — script.js
   GSAP Animations + Drawer + Slider + Counter + Cursor
================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------
     1. PRELOADER
  ------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('done');
      document.body.style.overflow = '';
      initAnimations();
    }, 1800);
  });
  document.body.style.overflow = 'hidden';

  /* -------------------------------------------------------
     2. CUSTOM CURSOR (desktop only)
  ------------------------------------------------------- */
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (window.matchMedia('(pointer: fine)').matches && cursor) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });

    const animRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(animRing);
    };
    animRing();

    document.querySelectorAll('a, button, .service-row, .condition-card, .review-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
    });
  }

  /* -------------------------------------------------------
     3. HEADER SCROLL STATE
  ------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* -------------------------------------------------------
     4. DRAWER TOGGLE
  ------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    if (drawer.classList.contains('open')) closeDrawer();
    else openDrawer();
  });
  drawerClose.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // Close drawer on Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  /* -------------------------------------------------------
     5. GALLERY SLIDER
  ------------------------------------------------------- */
  const slider = document.getElementById('gallerySlider');
  const slidePrev = document.getElementById('slidePrev');
  const slideNext = document.getElementById('slideNext');
  const dotsContainer = document.getElementById('sliderDots');
  const slides = slider ? slider.querySelectorAll('.gallery-slide') : [];
  let currentSlide = 0;

  if (slides.length && dotsContainer) {
    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const goToSlide = (n) => {
      currentSlide = Math.max(0, Math.min(n, slides.length - 1));
      const slideWidth = slides[0].offsetWidth + 16; // gap
      slider.scrollTo({ left: slideWidth * currentSlide, behavior: 'smooth' });
      document.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentSlide);
      });
    };

    slidePrev.addEventListener('click', () => goToSlide(currentSlide - 1));
    slideNext.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Sync dots on scroll
    slider.addEventListener('scroll', () => {
      const slideWidth = slides[0].offsetWidth + 16;
      const idx = Math.round(slider.scrollLeft / slideWidth);
      if (idx !== currentSlide) {
        currentSlide = idx;
        document.querySelectorAll('.slider-dot').forEach((d, i) => {
          d.classList.toggle('active', i === currentSlide);
        });
      }
    }, { passive: true });
  }

  /* -------------------------------------------------------
     6. GSAP ANIMATIONS
  ------------------------------------------------------- */
  function initAnimations() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // --- Hero Title Lines ---
    const heroLines = document.querySelectorAll('.hero-title .li');
    gsap.to(heroLines, {
      y: '0%',
      duration: 1.2,
      stagger: 0.12,
      ease: 'power4.out',
      delay: 0.1
    });

    // --- Hero Reveal-up elements ---
    const heroRevealItems = document.querySelectorAll('.hero [data-delay]');
    heroRevealItems.forEach(el => {
      const delay = parseFloat(el.dataset.delay || 0);
      gsap.to(el, {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: 'power3.out',
        delay: delay + 0.3
      });
    });

    // Hero image
    gsap.from('.hero-img-frame', {
      y: 40,
      autoAlpha: 0,
      duration: 1.4,
      ease: 'expo.out',
      delay: 0.6
    });

    // --- GENERIC SCROLL REVEALS ---
    // Section labels
    gsap.utils.toArray('.section-label').forEach(el => {
      gsap.to(el, {
        y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    // Section headings
    gsap.utils.toArray('.section-heading').forEach(el => {
      gsap.to(el, {
        y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    // Generic reveal-up
    gsap.utils.toArray('.reveal-up').forEach(el => {
      gsap.to(el, {
        y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out',
        delay: parseFloat(el.dataset.delay || 0),
        scrollTrigger: { trigger: el, start: 'top 87%' }
      });
    });

    // Reveal image
    gsap.utils.toArray('.reveal-image').forEach(el => {
      const img = el.querySelector('img');
      if (img) {
        gsap.to(img, {
          scale: 1, duration: 1.4, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 80%' }
        });
      }
      gsap.from(el, {
        autoAlpha: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' }
      });
    });

    // Condition & Review cards stagger
    gsap.utils.toArray('.reveal-card').forEach((el, i) => {
      gsap.to(el, {
        y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out',
        delay: (i % 4) * 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    // --- SERVICE ROWS stagger ---
    gsap.utils.toArray('.service-row').forEach((el, i) => {
      gsap.from(el, {
        x: -40, autoAlpha: 0, duration: 0.7, ease: 'power3.out',
        delay: i * 0.07,
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    // --- STATS COUNTER ---
    gsap.utils.toArray('.stat-block').forEach((block) => {
      gsap.to(block, {
        y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out',
        delay: parseFloat(block.dataset.delay || 0),
        scrollTrigger: { trigger: block, start: 'top 85%' }
      });
      const numEl = block.querySelector('[data-count]');
      if (numEl) {
        const target = parseInt(numEl.dataset.count);
        ScrollTrigger.create({
          trigger: block,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.to({ val: 0 }, {
              val: target,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: function () {
                numEl.textContent = Math.round(this.targets()[0].val).toLocaleString();
              }
            });
          }
        });
      }
    });

    // --- MARQUEE (CSS handles it, ensure playing) ---

    // --- ABOUT IMAGE PARALLAX ---
    gsap.to('.about-img-frame img', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // --- HERO BACKGROUND PARALLAX ---
    gsap.to('.hero-orb-1', {
      y: -100,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero-orb-2', {
      y: -60,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* -------------------------------------------------------
     7. SMOOTH SCROLL FOR ANCHOR LINKS
  ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
