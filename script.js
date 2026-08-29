(function () {
  'use strict';

  /* =====================================================
     CONFIGURAÇÕES CENTRALIZADAS
     Altere aqui quando as informações da academia mudarem.
     ===================================================== */
  const academyInfo = {
    name: 'Academia Corpo em Movimento Fitness',
    phone: '(37) 99931-4630',
    phoneDial: '+5537999314630',
    whatsapp: '5537999314630', // apenas números, com código do país
    whatsappMessage: 'Olá! Vim pelo site e quero saber mais sobre a Academia Corpo em Movimento Fitness.',
    address: 'R. Bom Despacho, 31, Centro',
    city: 'Martinho Campos - MG',
    postalCode: '35606-000',
    instagram: '' // ex: "corpoemmovimentofitness" — deixe vazio até ser informado
  };

  const WHATSAPP_NUMBER = academyInfo.whatsapp;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(academyInfo.whatsappMessage)}`;
  const phoneUrl = `tel:${academyInfo.phoneDial}`;

  document.querySelectorAll('[data-whatsapp-link]').forEach((el) => {
    el.setAttribute('href', whatsappUrl);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  document.querySelectorAll('[data-phone-link]').forEach((el) => {
    el.setAttribute('href', phoneUrl);
  });

  // Instagram: mantém estrutura preparada; só ativa link se um @ for configurado.
  const instagramLink = document.getElementById('instagramLink');
  if (instagramLink) {
    if (academyInfo.instagram) {
      instagramLink.textContent = `@${academyInfo.instagram}`;
      instagramLink.setAttribute('href', `https://instagram.com/${academyInfo.instagram}`);
      instagramLink.setAttribute('target', '_blank');
      instagramLink.setAttribute('rel', 'noopener noreferrer');
    } else {
      instagramLink.setAttribute('aria-disabled', 'true');
      instagramLink.addEventListener('click', (e) => e.preventDefault());
    }
  }

  /* =====================================================
     ANO NO RODAPÉ
     ===================================================== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =====================================================
     NAVBAR — estado ao rolar + menu mobile
     ===================================================== */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  const onScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 30);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* =====================================================
     SCROLL REVEAL (IntersectionObserver)
     ===================================================== */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
      revealObserver.observe(el);
    });
  }

  /* =====================================================
     CONTADORES ANIMADOS
     ===================================================== */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          const decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
          const duration = 1400;
          const start = performance.now();

          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            el.textContent = decimals > 0 ? value.toFixed(decimals).replace('.', ',') : Math.round(value).toString();
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target'));
      const decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
      el.textContent = decimals > 0 ? target.toFixed(decimals).replace('.', ',') : target.toString();
    });
  }

  /* =====================================================
     LIGHTBOX DA GALERIA
     ===================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  let lastFocused = null;

  const openLightbox = (src, alt) => {
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  document.querySelectorAll('.gallery__item[data-full]').forEach((item) => {
    item.addEventListener('click', () => {
      const full = item.getAttribute('data-full');
      const img = item.querySelector('img');
      openLightbox(full, img ? img.alt : '');
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
})();
