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

  /* ---- Cotizador (formulario único de Contacto) ----
     Catálogo completo de equipos, agrupado por línea y, en Equipos
     Livianos, por categoría (las mismas categorías del filtro en
     alquiler-equipos-livianos.html). Para agregar/quitar un equipo del
     cotizador, edita este arreglo — no hace falta tocar el HTML. */
  const EQUIPOS = [
    // Maquinaria Pesada
    { id: 'exc-sany', name: 'Excavadora SANY SY135C', img: 'images/excavadora-sany-sy135c.jpg', line: 'pesada' },
    { id: 'rodillo-1300', name: 'Rodillo Vibratorio Doble 1.300kg', img: 'images/rodillo-vibratorio-1300kg.jpg', line: 'pesada' },
    { id: 'retro-bobcat', name: 'Retroexcavadora Bobcat B760', img: 'images/retroexcavadora-bobcat-b760.jpg', line: 'pesada' },
    { id: 'mini-bobcat', name: 'Minicargador Bobcat S530', img: 'images/minicargador-bobcat-s530.jpg', line: 'pesada' },

    // Equipos Livianos — Concreto y Compactación
    { id: 'mezcladora-2b', name: 'Mezcladora de Concreto 2 Bultos', img: 'images/mezcladora-2-bultos.jpg', line: 'liviana', cat: 'concreto' },
    { id: 'mezcladora-1b', name: 'Mezcladora de Concreto 1 Bulto', img: 'images/mezcladora-1-bulto.jpg', line: 'liviana', cat: 'concreto' },
    { id: 'mezcladora-05b', name: 'Mezcladora de Concreto 1/2 Bulto', img: 'images/mezcladora-medio-bulto.jpg', line: 'liviana', cat: 'concreto' },
    { id: 'apisonador-gas', name: 'Apisonador Tipo Canguro (gasolina)', img: 'images/apisonador-gasolina.jpg', line: 'liviana', cat: 'concreto' },
    { id: 'apisonador-diesel', name: 'Apisonador Tipo Canguro (diesel)', img: 'images/apisonador-diesel.jpg', line: 'liviana', cat: 'concreto' },
    { id: 'rana', name: 'Rana Vibrocompactadora', img: 'images/rana-vibrocompactadora.jpg', line: 'liviana', cat: 'concreto' },
    { id: 'vibrador', name: 'Vibrador Eléctrico de Concreto', img: 'images/vibrador-concreto.jpg', line: 'liviana', cat: 'concreto' },

    // Herramienta Eléctrica
    { id: 'tronzadora', name: 'Tronzadora', img: 'images/tronzadora.jpg', line: 'liviana', cat: 'herramienta' },
    { id: 'compresor', name: 'Compresor de Aire Industrial', img: 'images/compresor-aire.jpg', line: 'liviana', cat: 'herramienta' },
    { id: 'rotomartillo-dewalt', name: 'Rotomartillo DeWalt', img: 'images/rotomartillo-dewalt.jpg', line: 'liviana', cat: 'herramienta' },
    { id: 'rotomartillo-hilti', name: 'Rotomartillo Hilti', img: 'images/rotomartillo-hilti.jpg', line: 'liviana', cat: 'herramienta' },
    { id: 'martillo-demoledor', name: 'Martillo Demoledor Eléctrico', img: 'images/martillo-demoledor.jpg', line: 'liviana', cat: 'herramienta' },
    { id: 'taladro-inal-percutor', name: 'Taladro Inalámbrico Percutor', img: 'images/taladro-inalambrico-percutor.jpg', line: 'liviana', cat: 'herramienta' },
    { id: 'taladro-atornillador', name: 'Taladro Atornillador de Impacto', img: 'images/taladro-atornillador-impacto.jpg', line: 'liviana', cat: 'herramienta' },
    { id: 'taladro-percutor', name: 'Taladro Percutor', img: 'images/taladro-percutor.jpg', line: 'liviana', cat: 'herramienta' },
    { id: 'pulidora-7', name: 'Pulidora 7 Pulgadas', img: 'images/pulidora-7.jpg', line: 'liviana', cat: 'herramienta' },
    { id: 'pulidora-4', name: 'Pulidora 4 Pulgadas', img: 'images/pulidora-4.jpg', line: 'liviana', cat: 'herramienta' },

    // Plantas Eléctricas
    { id: 'planta-4000', name: 'Planta Eléctrica 4000W', img: 'images/planta-4000w.jpg', line: 'liviana', cat: 'energia' },
    { id: 'planta-7000', name: 'Planta Eléctrica 7000W', img: 'images/planta-7000w.jpg', line: 'liviana', cat: 'energia' },
    { id: 'planta-10000', name: 'Planta Eléctrica 10000W', img: 'images/planta-10000w.jpg', line: 'liviana', cat: 'energia' },

    // Andamiaje y Accesorios
    { id: 'andamio', name: 'Andamio Tubular', img: 'images/andamio-tubular.jpg', line: 'liviana', cat: 'andamiaje' },
    { id: 'escalera', name: 'Escalera Dieléctrica 5 Peldaños', img: 'images/escalera-dielectrica.jpg', line: 'liviana', cat: 'andamiaje' },
    { id: 'extension', name: 'Extensión Eléctrica', img: 'images/extension-electrica.jpg', line: 'liviana', cat: 'andamiaje' },

    // Topografía y Calidad
    { id: 'topografico-gnss', name: 'Equipo Topográfico GNSS RTK', img: 'images/equipo-topografico-gnss.jpg', line: 'liviana', cat: 'topografia' },
    { id: 'camisa-cilindro', name: 'Camisa Cilindro Prueba de Concreto 4x8', img: 'images/camisa-cilindro-concreto.jpg', line: 'liviana', cat: 'topografia' },
    { id: 'cono-slump', name: 'Cono Slump', img: 'images/cono-slump.jpg', line: 'liviana', cat: 'topografia' },

    // Otros Equipos
    { id: 'corta-baldosa', name: 'Corta Baldosa Cerámica 1.2m', img: 'images/corta-baldosa.jpg', line: 'liviana', cat: 'otros' },
    { id: 'ponchadora', name: 'Ponchadora Hidráulica', img: 'images/ponchadora-hidraulica.jpg', line: 'liviana', cat: 'otros' },
    { id: 'isotanque', name: 'Isotanque Polietileno 1000L', img: 'images/isotanque-1000l.jpg', line: 'liviana', cat: 'otros' },
    { id: 'cosedora', name: 'Cosedora Industrial Taiwanesa', img: 'images/cosedora-industrial.jpg', line: 'liviana', cat: 'otros' },
    { id: 'motobomba', name: 'Motobomba', img: 'images/motobomba.jpg', line: 'liviana', cat: 'otros' },
    { id: 'zunchadora', name: 'Zunchadora Manual', img: 'images/zunchadora-manual.jpg', line: 'liviana', cat: 'otros' },
  ];

  const CATEGORIA_LABELS = {
    concreto: 'Concreto y Compactación',
    herramienta: 'Herramienta Eléctrica',
    energia: 'Plantas Eléctricas',
    andamiaje: 'Andamiaje y Accesorios',
    topografia: 'Topografía y Calidad',
    otros: 'Otros Equipos',
  };

  /* IMPORTANTE: para que este formulario SÍ llegue al correo, reemplaza
     los 3 valores de abajo por los de tu cuenta gratuita en emailjs.com
     (ver instrucciones completas en README.md). Mientras tengan estos
     valores de ejemplo, el formulario mostrará un mensaje de error al
     enviar en vez de mandar el correo. */
  const EMAILJS_PUBLIC_KEY = 'TU_PUBLIC_KEY_AQUI';
  const EMAILJS_SERVICE_ID = 'TU_SERVICE_ID_AQUI';
  const EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID_AQUI';

  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    if (typeof emailjs !== 'undefined') {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    const wrapPesada = document.getElementById('quoteItemsPesada');
    const wrapLiviana = document.getElementById('quoteItemsLiviana');
    const lineButtons = quoteForm.querySelectorAll('.line-btn');
    const groupBtn = document.getElementById('groupBtn');
    const selCount = document.getElementById('selCount');
    const quoteHint = document.getElementById('quoteHint');
    const quotePicker = document.getElementById('quotePicker');
    const quoteSummary = document.getElementById('quoteSummary');
    const summaryList = document.getElementById('summaryList');
    const editSelectionBtn = document.getElementById('editSelectionBtn');
    const quoteStatus = document.getElementById('quoteStatus');
    const quoteSubmitBtn = document.getElementById('quoteSubmitBtn');

    const diasGuardados = {}; // id -> días capturados, se conservan al reagrupar

    // ---- Pintar las tarjetas de equipos (una sola vez) ----
    const crearTarjeta = (equipo) => {
      const label = document.createElement('label');
      label.className = 'quote-item';
      label.innerHTML = `
        <div class="quote-item-thumb">
          <img src="${equipo.img}" alt="${equipo.name}" loading="lazy">
          <input type="checkbox" class="quote-item-check" value="${equipo.id}" aria-label="Seleccionar ${equipo.name}">
        </div>
        <span class="quote-item-name">${equipo.name}</span>
      `;
      return label;
    };

    const pesada = EQUIPOS.filter((e) => e.line === 'pesada');
    const grid = document.createElement('div');
    grid.className = 'quote-items-grid';
    pesada.forEach((equipo) => grid.appendChild(crearTarjeta(equipo)));
    wrapPesada.appendChild(grid);

    const categoriasOrden = ['concreto', 'herramienta', 'energia', 'andamiaje', 'topografia', 'otros'];
    categoriasOrden.forEach((cat) => {
      const equiposCat = EQUIPOS.filter((e) => e.line === 'liviana' && e.cat === cat);
      if (!equiposCat.length) return;
      const bloque = document.createElement('div');
      bloque.className = 'quote-category-block';
      const titulo = document.createElement('h4');
      titulo.className = 'quote-category-title';
      titulo.textContent = CATEGORIA_LABELS[cat] || cat;
      const gridCat = document.createElement('div');
      gridCat.className = 'quote-items-grid';
      equiposCat.forEach((equipo) => gridCat.appendChild(crearTarjeta(equipo)));
      bloque.appendChild(titulo);
      bloque.appendChild(gridCat);
      wrapLiviana.appendChild(bloque);
    });

    const allChecks = () => Array.from(quoteForm.querySelectorAll('.quote-item-check'));
    const equipoPorId = (id) => EQUIPOS.find((e) => e.id === id);

    // ---- Toggle de línea (Maquinaria Pesada / Equipos Livianos) ----
    lineButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const line = btn.dataset.line;
        const wrap = line === 'pesada' ? wrapPesada : wrapLiviana;
        const isOpen = !wrap.hidden;
        wrap.hidden = isOpen;
        btn.setAttribute('aria-pressed', String(!isOpen));
      });
    });

    // ---- Actualizar contador y estado del botón "Agrupar selección" ----
    const actualizarContador = () => {
      const n = allChecks().filter((c) => c.checked).length;
      selCount.textContent = `(${n})`;
      groupBtn.disabled = n === 0;
      quoteHint.textContent = n === 0
        ? 'Marca uno o varios equipos para agruparlos en tu solicitud.'
        : `${n} equipo${n === 1 ? '' : 's'} marcado${n === 1 ? '' : 's'}. Cuando termines, da clic en "Agrupar selección".`;
    };
    quoteForm.addEventListener('change', (e) => {
      if (e.target.classList.contains('quote-item-check')) {
        e.target.closest('.quote-item').classList.toggle('is-checked', e.target.checked);
        actualizarContador();
      }
    });

    // ---- Construir el resumen a partir de lo marcado ----
    const construirResumen = () => {
      const seleccionados = allChecks().filter((c) => c.checked).map((c) => c.value);
      if (seleccionados.length === 0) return;

      summaryList.innerHTML = '';
      seleccionados.forEach((id) => {
        const equipo = equipoPorId(id);
        if (!equipo) return;
        const row = document.createElement('div');
        row.className = 'summary-row';
        row.dataset.id = id;
        row.innerHTML = `
          <img src="${equipo.img}" alt="">
          <span class="summary-row-name">${equipo.name}</span>
          <span class="summary-days">
            <label for="dias-${id}">Días de alquiler</label>
            <input type="number" min="1" id="dias-${id}" value="${diasGuardados[id] || ''}" placeholder="ej. 5">
          </span>
          <button type="button" class="summary-remove" aria-label="Quitar ${equipo.name}">✕</button>
        `;
        row.querySelector('input[type="number"]').addEventListener('input', (e) => {
          diasGuardados[id] = e.target.value;
        });
        row.querySelector('.summary-remove').addEventListener('click', () => {
          const check = quoteForm.querySelector(`.quote-item-check[value="${id}"]`);
          if (check) {
            check.checked = false;
            check.closest('.quote-item').classList.remove('is-checked');
          }
          delete diasGuardados[id];
          row.remove();
          actualizarContador();
          if (!summaryList.children.length) mostrarPicker();
        });
        summaryList.appendChild(row);
      });

      quotePicker.hidden = true;
      quoteSummary.hidden = false;
    };

    const mostrarPicker = () => {
      quoteSummary.hidden = true;
      quotePicker.hidden = false;
    };

    groupBtn.addEventListener('click', construirResumen);
    editSelectionBtn.addEventListener('click', mostrarPicker);

    // ---- Envío por EmailJS ----
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      quoteStatus.textContent = '';
      quoteStatus.className = 'quote-status';

      const filas = Array.from(summaryList.children);
      if (!filas.length) {
        quoteStatus.textContent = 'Marca los equipos que necesitas y da clic en "Agrupar selección" antes de enviar.';
        quoteStatus.className = 'quote-status is-error';
        return;
      }

      const lineasEquipos = filas.map((row) => {
        const id = row.dataset.id;
        const equipo = equipoPorId(id);
        const dias = (diasGuardados[id] || '').trim();
        return `- ${equipo ? equipo.name : id}: ${dias || '(días sin especificar)'} día(s)`;
      });
      const equiposTexto = ['Deseo consultar o cotizar el alquiler de estos equipos:', ...lineasEquipos].join('\n');

      const formData = new FormData(quoteForm);
      const params = {
        from_name: formData.get('nombre'),
        from_phone: formData.get('telefono'),
        from_email: formData.get('email'),
        equipos: equiposTexto,
        mensaje: formData.get('mensaje') || '(sin mensaje adicional)',
      };

      if (typeof emailjs === 'undefined' || EMAILJS_PUBLIC_KEY === 'TU_PUBLIC_KEY_AQUI') {
        quoteStatus.textContent = 'El envío por correo aún no está configurado. Mientras tanto, escríbenos directo por WhatsApp con estos datos.';
        quoteStatus.className = 'quote-status is-error';
        return;
      }

      quoteSubmitBtn.disabled = true;
      quoteSubmitBtn.textContent = 'Enviando...';

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
        .then(() => {
          quoteStatus.textContent = '¡Listo! Recibimos tu solicitud y te contactaremos pronto.';
          quoteStatus.className = 'quote-status is-success';
          quoteForm.reset();
          allChecks().forEach((c) => c.closest('.quote-item').classList.remove('is-checked'));
          Object.keys(diasGuardados).forEach((k) => delete diasGuardados[k]);
          summaryList.innerHTML = '';
          wrapPesada.hidden = true;
          wrapLiviana.hidden = true;
          lineButtons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
          mostrarPicker();
          actualizarContador();
        })
        .catch(() => {
          quoteStatus.textContent = 'No pudimos enviar la solicitud. Intenta de nuevo o escríbenos por WhatsApp.';
          quoteStatus.className = 'quote-status is-error';
        })
        .finally(() => {
          quoteSubmitBtn.disabled = false;
          quoteSubmitBtn.textContent = 'Enviar solicitud de cotización';
        });
    });
  }

  /* ---- Año dinámico en el footer ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Video de fondo del hero: reintenta reproducir si el navegador
     (sobre todo en celular) bloqueó el autoplay inicial ---- */
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    const tryPlay = () => { heroVideo.play().catch(() => {}); };
    tryPlay();
    const resumeOnInteraction = () => {
      if (heroVideo.paused) tryPlay();
      ['touchstart', 'click', 'scroll'].forEach(evt =>
        document.removeEventListener(evt, resumeOnInteraction)
      );
    };
    ['touchstart', 'click', 'scroll'].forEach(evt =>
      document.addEventListener(evt, resumeOnInteraction, { passive: true, once: true })
    );
  }

});
