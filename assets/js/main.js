// Access globals defined by data.js (classic script)
const projects = (window.projects ?? []);
const skills = (window.skills ?? []);
const certifications = (window.certifications ?? []);
const contactLinks = (window.contactLinks ?? []);

function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $all(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

// Theme
const themeKey = 'portfolio-theme';
// Lightweight toast utility (reused for small notifications)
function showToast(text) {
  let toast = document.getElementById('copyToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'copyToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 1800);
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}
function initTheme() {
  const saved = localStorage.getItem(themeKey);
  // Force dark as default if no saved preference
  applyTheme(saved ?? 'dark');
}

// Header/nav
function initHeader() {
  const navToggle = $('#navToggle');
  const navList = $('#navList');
  const setExpanded = (isOpen) => {
    navToggle?.setAttribute('aria-expanded', String(!!isOpen));
  };
  const closeMenu = () => {
    navList.classList.remove('open');
    setExpanded(false);
  };
  const toggleMenu = () => {
    const isOpen = !navList.classList.contains('open');
    navList.classList.toggle('open', isOpen);
    setExpanded(isOpen);
  };

  navToggle?.addEventListener('click', toggleMenu);

  // Close on Escape key when menu open
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navList.classList.contains('open')) {
      closeMenu();
      navToggle?.focus();
    }
  });
  $all('#navList a').forEach(a => a.addEventListener('click', () => navList.classList.remove('open')));
}

// Header shadow on scroll
function initHeaderShadow() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const apply = () => {
    const scrolled = window.scrollY > 2;
    header.classList.toggle('is-scrolled', scrolled);
  };
  apply();
  window.addEventListener('scroll', apply, { passive: true });
}

// Theme toggle button
function initThemeToggle() {
  const btn = $('#themeToggle');
  btn?.addEventListener('click', () => {
    const now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(now);
    localStorage.setItem(themeKey, now);
  });
}

// Scroll reveal
function initReveal() {
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  $all('.reveal').forEach(el => io.observe(el));
}

// Filters for projects
function renderFilters(allTags) {
  const filtersEl = $('#projectFilters');
  if (!filtersEl) return;
  filtersEl.innerHTML = '';
  const tags = ['Semua', ...Array.from(allTags).sort()];
  for (const t of tags) {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.textContent = t;
    btn.dataset.tag = t;
    btn.type = 'button';
    if (t === 'Semua') btn.dataset.active = 'true';
    filtersEl.appendChild(btn);
  }
}

// Project card template
function projectCardTpl(p, index) {
  const letter = p.title.charAt(0).toUpperCase();
  const firstImg = p?.details?.images?.[0] || '';
  const cover = firstImg
    ? `<img class="card-img" src="${firstImg}" alt="${p.title} cover" loading="lazy">`
    : `<span>${letter}</span>`;
  const tags = p.tags.map(t => `<span class="chip">${t}</span>`).join('');

  const hasDocs = !!(p.docs && p.docs !== '#');
  const hasRepo = !!(p.repo && p.repo !== '#');
  let linkHtml = '';
  if (hasDocs) {
    linkHtml = `<a class="btn btn-ghost btn-docs" href="${p.docs}" target="_blank" rel="noreferrer noopener">dokumentasi</a>`;
  } else if (hasRepo) {
    const label = p.repoLabel || 'Kode';
    linkHtml = `<a class="btn btn-ghost btn-code" href="${p.repo}" target="_blank" rel="noreferrer noopener">${label}</a>`;
  } else {
    if ((p.title || '').toLowerCase() === 'tahes') {
      linkHtml = `<a class="btn btn-ghost btn-docs" aria-disabled="true">dokumentasi</a>`;
    }
  }

  return `
    <article class="card" role="listitem">
      <div class="card-cover" aria-hidden="true">${cover}</div>
      <div class="card-body">
        <h3 class="card-title">${p.title}</h3>
        <p class="card-desc">${p.description}</p>
        <div class="card-tags">${tags}</div>
        <div class="card-actions">
          ${linkHtml}
          <button class="btn btn-primary btn-details" type="button" data-index="${index}">View Details</button>
        </div>
      </div>
    </article>`;
}

function renderProjects(list) {
  const grid = $('#projectsGrid');
  // Ensure the data-index always references the original projects array
  grid.innerHTML = list.map((p) => projectCardTpl(p, projects.indexOf(p))).join('');
}

function initProjects() {
  const allTags = new Set(projects.flatMap(p => p.tags));
  renderFilters(allTags);
  renderProjects(projects);

  $('#projectFilters').addEventListener('click', (e) => {
    const btn = e.target.closest('button.chip');
    if (!btn) return;
    $all('#projectFilters .chip').forEach(c => c.dataset.active = 'false');
    btn.dataset.active = 'true';
    const tag = btn.dataset.tag;
    if (tag === 'Semua') { renderProjects(projects); return; }
    const filtered = projects.filter(p => p.tags.includes(tag));
    renderProjects(filtered);
  });

  // Delegate click for details buttons
  $('#projectsGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-details');
    if (!btn) return;
    const index = Number(btn.dataset.index);
    const p = (projects[index]) || null;
    if (!p) return;
    openProjectModal(p);
  });
}

// Modal helpers
function buildDetailsHtml(p) {
  const timeline = p.details?.timeline || '-';
  const role = p.details?.role || '-';
  const keyFeatures = Array.isArray(p.details?.keyFeatures) ? p.details.keyFeatures : [];
  const responsibilities = Array.isArray(p.details?.responsibilities) ? p.details.responsibilities : [];
  const featList = keyFeatures.map(item => `<li>${item}</li>`).join('');
  const respList = responsibilities.map(item => `<li>${item}</li>`).join('');
  const images = Array.isArray(p.details?.images) ? p.details.images : [];
  const tags = (p.tags || []).map(t => `<span class=\"chip\">${t}</span>`).join('');
  const docsBtn = p.docs && p.docs !== '#' ? `<a class=\"btn btn-ghost btn-docs\" href=\"${p.docs}\" target=\"_blank\" rel=\"noreferrer noopener\">dokumentasi</a>` : '';
  const repoBtn = p.repo && p.repo !== '#' ? `<a class=\"btn btn-ghost\" href=\"${p.repo}\" target=\"_blank\" rel=\"noreferrer noopener\">${p.repoLabel || 'Kode'}</a>` : '';
  const liveBtn = p.live && p.live !== '#' ? `<a class=\"btn btn-primary\" href=\"${p.live}\" target=\"_blank\" rel=\"noreferrer noopener\">Kunjungi</a>` : '';
  const gallery = images.length ? `
    <div class=\"modal-gallery\" data-index=\"0\">
      <div class=\"gallery-viewport\">
        ${images.map((src,i)=>`<img src=\"${src}\" alt=\"${p.title} preview ${i+1}\" class=\"gallery-item ${i===0?'active':''}\" loading=\"lazy\">`).join('')}
        <button class=\"gallery-nav prev\" type=\"button\" aria-label=\"Sebelumnya\">‹</button>
        <button class=\"gallery-nav next\" type=\"button\" aria-label=\"Berikutnya\">›</button>
      </div>
      <div class=\"gallery-dots\">${images.map((_,i)=>`<button class=\"dot\" data-i=\"${i}\" ${i===0?'data-active=\"true\"':''} aria-label=\"Gambar ${i+1}\"></button>`).join('')}</div>
    </div>` : '';
  return `
    <h3 id="modalTitle" class="card-title">${p.title}</h3>
    <p class="card-desc">${p.description}</p>
    ${gallery}
    <div class="modal-meta">
      <div class="meta-card">
        <div class="meta-label"><span class="meta-ic">🕒</span>Timeline</div>
        <div class="meta-value">${timeline}</div>
      </div>
      <div class="meta-card">
        <div class="meta-label"><span class="meta-ic">👤</span>Role</div>
        <div class="meta-value">${role}</div>
      </div>
      <div class="meta-card meta-card--tags">
        <div class="meta-label"><span class="meta-ic">🏷</span>Tags/Stack</div>
        <div class="meta-value"><div class="card-tags">${tags}</div></div>
      </div>
    </div>
    ${featList ? `<div class="section-line"></div><h4 class="modal-subtitle">Fitur Utama</h4><ul class="feat-list">${featList}</ul>` : ''}
    ${respList ? `<div class="section-line"></div><h4 class="modal-subtitle">Tanggung jawab/Highlight</h4><ul class="resp-list">${respList}</ul>` : ''}
    <div class="modal-actions">${docsBtn || repoBtn} ${liveBtn}</div>
  `;
}

function openProjectModal(p) {
  const modal = document.getElementById('projectModal');
  const content = document.getElementById('modalContent');
  if (!modal || !content) return;
  content.innerHTML = buildDetailsHtml(p);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  initModalGallery(modal);
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

// Modal global listeners
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-close]')) {
    closeProjectModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProjectModal();
});

function initModalGallery(modalRoot) {
  const root = modalRoot.querySelector('.modal-gallery');
  if (!root) return;
  const imgs = Array.from(root.querySelectorAll('.gallery-item'));
  const dots = Array.from(root.querySelectorAll('.dot'));
  const prev = root.querySelector('.prev');
  const next = root.querySelector('.next');
  const setIndex = (i) => {
    const total = imgs.length;
    let idx = ((i % total) + total) % total; // wrap
    root.dataset.index = String(idx);
    imgs.forEach((img, k) => img.classList.toggle('active', k === idx));
    dots.forEach((d, k) => d.dataset.active = (k === idx) ? 'true' : 'false');
  };
  const getIndex = () => Number(root.dataset.index || '0');
  prev?.addEventListener('click', () => setIndex(getIndex() - 1));
  next?.addEventListener('click', () => setIndex(getIndex() + 1));
  root.addEventListener('click', (e) => {
    const dot = e.target.closest('.dot');
    if (dot) setIndex(Number(dot.dataset.i || '0'));
  });
  // Keyboard arrows inside modal
  document.addEventListener('keydown', onKey);
  function onKey(e){
    if (!document.body.classList.contains('no-scroll')) { document.removeEventListener('keydown', onKey); return; }
    if (e.key === 'ArrowLeft') setIndex(getIndex() - 1);
    if (e.key === 'ArrowRight') setIndex(getIndex() + 1);
  }
}

// Skills rendering
function skillCardTpl(group) {
  const items = group.items.map(name => `
    <li class="skill-item"><span class="chip">${name}</span></li>
  `).join('');
  return `
    <article class="skill-card" role="listitem">
      <h3>${group.category}</h3>
      <ul class="skill-list skill-list--badges">${items}</ul>
    </article>
  `;
}

function renderSkills() {
  const grid = $('#skillsGrid');
  if (!grid) return;
  grid.innerHTML = skills.map(skillCardTpl).join('');
}

// Certifications rendering
function certCardTpl(c) {
  const tags = (c.skills || []).map(t => `<span class=\"chip\">${t}</span>`).join('');
  const date = c.date ? `${c.date}` : '';
  const link = c.credentialUrl && c.credentialUrl !== '#' ? `<a class=\"btn btn-ghost btn-cert\" href=\"${c.credentialUrl}\" target=\"_blank\" rel=\"noreferrer noopener\">View Sertificate</a>` : '';
  return `
    <article class=\"cert-card\" role=\"listitem\"> 
      <div class=\"cert-head\"> 
        <h3 class=\"cert-title\">${c.title}</h3> 
        <span class=\"cert-badge\" aria-hidden=\"true\">🏅</span> 
      </div>
      <div class=\"cert-rows\">
        <div class=\"cert-row\"><span class=\"cert-row-icon\">🏢</span><span>${c.issuer}</span></div>
        ${date ? `<div class=\"cert-row\"><span class=\"cert-row-icon\">📅</span><span>${date}</span></div>` : ''}
      </div>
      ${c.description ? `<p class=\"cert-desc\">${c.description}</p>` : ''}
      ${tags ? `<div class=\"cert-tags\">${tags}</div>` : ''}
      <div class=\"cert-footer\">${link}</div>
    </article>
  `;
}

function renderCertifications() {
  const grid = $('#certsGrid');
  if (!grid) return;
  grid.innerHTML = certifications.map(certCardTpl).join('');
}

// Contact helpers
function initContact() {
  // Attach copy-to-clipboard handler for email icon if present
  const copyTargets = $all('[data-copy-email]');
  if (copyTargets.length) {
    const defaultEmail = 'kemalsyahru15@gmail.com';
    const notify = (el) => {
      el.classList.add('copied');
      el.setAttribute('aria-label', 'Email disalin');
      setTimeout(() => {
        el.classList.remove('copied');
        el.setAttribute('aria-label', 'Salin email');
      }, 1800);
      showToast('alamat email sudah disalin');
    };
    copyTargets.forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const email = (el.getAttribute('data-copy-email') || '').trim() || defaultEmail;
        if (!navigator.clipboard) {
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = email;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch(err) {}
          document.body.removeChild(ta);
        } else {
          navigator.clipboard.writeText(email).catch(()=>{});
        }
        notify(el);
      });
    });
  }
  // Normalize WhatsApp links if data-wa is provided
  $all('a[aria-label="WhatsApp"]').forEach(a => {
    const raw = (a.getAttribute('data-wa') || '').replace(/[^0-9]/g, '');
    const preset = (a.getAttribute('data-wa-text') || '').trim();
    if (raw) {
      const base = `https://wa.me/${raw}`;
      const href = preset ? `${base}?text=${encodeURIComponent(preset)}` : base;
      a.setAttribute('href', href);
    } else {
      // If developer accidentally kept '+' in href, sanitize it
      const href = a.getAttribute('href') || '';
      if (href.includes('wa.me/+')) {
        a.setAttribute('href', href.replace('wa.me/+', 'wa.me/'));
      }
    }
  });
}

// Smooth scroll for internal links
function initSmoothScroll() {
  $all('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        // Immediate nav highlight for better feedback on different resolutions
        const navLinks = Array.from(document.querySelectorAll('.nav-list a[href^="#"]'));
        navLinks.forEach(l => l.removeAttribute('aria-current'));
        const active = document.querySelector(`.nav-list a[href="${id}"]`);
        if (active) active.setAttribute('aria-current', 'true');

        // Smooth scroll with header offset to avoid off-by-a-bit cases
        const header = document.querySelector('.site-header');
        const offset = (header?.offsetHeight || 0) + 10;
        const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

// ScrollSpy: highlight nav link based on visible section
function initScrollSpy() {
  const header = document.querySelector('.site-header');
  const links = Array.from(document.querySelectorAll('.nav-list a[href^="#"]'));
  const sectionIds = links
    .map(a => a.getAttribute('href'))
    .filter(h => h && h.startsWith('#'))
    .map(h => h.slice(1));
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach(a => a.removeAttribute('aria-current'));
    const active = document.querySelector(`.nav-list a[href="#${id}"]`);
    if (active) active.setAttribute('aria-current', 'true');
  };

  const compute = () => {
    const top = window.scrollY + (header?.offsetHeight || 0) + 12; // offset past fixed header
    let currentId = sections[0]?.id || '';
    for (const sec of sections) {
      if (sec.offsetTop <= top) currentId = sec.id;
    }
    if (currentId) setActive(currentId);
  };

  compute();
  window.addEventListener('scroll', compute, { passive: true });
  window.addEventListener('resize', compute);
}

// Footer year
function setYear() {
  const y = new Date().getFullYear();
  const span = document.getElementById('year');
  if (span) span.textContent = String(y);
}

// Init
initTheme();
initHeader();
initThemeToggle();
initReveal();
renderSkills();
renderCertifications();
initProjects();
initContact();
initSmoothScroll();
setYear();
initHeaderShadow();
initScrollSpy();
// Optional: add a global class for copied state styling if desired
