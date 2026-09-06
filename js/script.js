/* =========================================================
   MAKRA S.A.S — Interacciones del sitio
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Menú móvil ---- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Cierra el menú al hacer clic en un enlace (móvil)
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Resaltar enlace activo del nav (sitio de varias páginas) ---- */
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPage = (window.location.pathname.split('/').pop() || 'index.html');
  const isHome = currentPage === 'index.html' || currentPage === '';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const linkPage = href.split('#')[0] || 'index.html';
    // El enlace "Inicio" y el enlace "Contacto" comparten página (index.html);
    // en esos casos se decide con scroll-spy más abajo, no aquí.
    if (linkPage === currentPage && !(isHome && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  if (isHome) {
    const sections = document.querySelectorAll('section[id]');
    const highlightNav = () => {
      let current = sections.length ? sections[0].getAttribute('id') : '';
      sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) current = section.getAttribute('id');
      });
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${current}` || href === `index.html#${current}` || href === `index.html` && current === 'inicio') {
          link.classList.add('active');
        } else if (href.startsWith('#') || href.startsWith('index.html#') || href === 'index.html') {
          link.classList.remove('active');
        }
      });
    };
    window.addEventListener('scroll', highlightNav);
    highlightNav();
  }

  /* ---- Botón volver arriba ---- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Filtro de proyectos ---- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card, .machine-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });

  /* ---- Animación al hacer scroll (reveal) ---- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---- Contador animado de estadísticas ---- */
  const statNumbers = document.querySelectorAll('.stat-number');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && statNumbers.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statNumbers.forEach(el => statObserver.observe(el));
  }

  /* ---- Formulario de contacto (plantilla: solo demo, no envía datos) ---- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Este formulario es una plantilla. Conéctalo a un servicio como Formspree o EmailJS para recibir los mensajes (instrucciones en README.md). Mientras tanto, usa el botón de WhatsApp para contactarnos.');
    });
  }

  /* ---- Año dinámico en el footer ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
