// Access globals defined by data.js (classic script)
const projects = (window.projects ?? []);
const skills = (window.skills ?? []);
const certifications = (window.certifications ?? []);

function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $all(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

// Theme
const themeKey = 'portfolio-theme';
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
        // Animate skills meters when skills section appears
        if (e.target.id === 'skills') {
          document.querySelectorAll('#skills .meter > span').forEach(bar => {
            const level = Number(bar.getAttribute('data-level') || '0');
            requestAnimationFrame(() => {
              bar.style.width = level + '%';
            });
          });
        }
        io.unobserve(e.target);
      }
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  $all('.reveal').forEach(el => io.observe(el));
}

// Projects rendering and filters
function renderFilters(allTags) {
  const filtersEl = $('#projectFilters');
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

function projectCardTpl(p, index) {
  const letter = p.title.charAt(0).toUpperCase();
  const firstImg = p?.details?.images?.[0] || '';
  const cover = firstImg
    ? `<img class="card-img" src="${firstImg}" alt="${p.title} cover" loading="lazy">`
    : `<span>${letter}</span>`;
  const tags = p.tags.map(t => `<span class="chip">${t}</span>`).join('');
  return `
    <article class="card" role="listitem">
      <div class="card-cover" aria-hidden="true">${cover}</div>
      <div class="card-body">
        <h3 class="card-title">${p.title}</h3>
        <p class="card-desc">${p.description}</p>
        <div class="card-tags">${tags}</div>
        <div class="card-actions">
          <a class=\"btn btn-ghost btn-code\" href=\"${p.repo}\" target=\"_blank\" rel=\"noreferrer noopener\">Kode</a>
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
  const responsibilities = Array.isArray(p.details?.responsibilities) ? p.details.responsibilities : [];
  const respList = responsibilities.map(item => `<li>${item}</li>`).join('');
  const images = Array.isArray(p.details?.images) ? p.details.images : [];
  const tags = (p.tags || []).map(t => `<span class=\"chip\">${t}</span>`).join('');
  const repoBtn = p.repo && p.repo !== '#' ? `<a class=\"btn btn-ghost\" href=\"${p.repo}\" target=\"_blank\" rel=\"noreferrer noopener\">Kode</a>` : '';
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
      <div class="meta-card"><strong>Timeline:</strong><br>${timeline}</div>
      <div class="meta-card"><strong>Role:</strong><br>${role}</div>
      <div class="meta-card"><strong>Tags/Stack:</strong><br><div class="card-tags" style="margin-top:6px">${tags}</div></div>
    </div>
    ${respList ? `<div><strong>Tanggung jawab/Highlight:</strong><ul class="about-list" style="margin-top:6px">${respList}</ul></div>` : ''}
    <div class="modal-actions">${repoBtn} ${liveBtn}</div>
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
  const link = c.credentialUrl && c.credentialUrl !== '#' ? `<a class=\"btn btn-ghost btn-cert\" href=\"${c.credentialUrl}\" target=\"_blank\" rel=\"noreferrer noopener\">View Details</a>` : '';
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
  const btn = $('#copyEmail');
  const fallbackCopy = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    let success = false;
    try { success = document.execCommand('copy'); } catch {}
    document.body.removeChild(ta);
    return success;
  };

  btn?.addEventListener('click', async () => {
    const email = btn.dataset.email || '';
    const done = (ok) => {
      btn.textContent = ok ? 'Tersalin ✓' : 'Gagal menyalin';
      setTimeout(() => btn.textContent = 'Salin Email', 1500);
    };
    if (!email) return;
    if (!('clipboard' in navigator)) {
      const ok = fallbackCopy(email);
      done(ok);
      return;
    }
    try {
      await navigator.clipboard.writeText(email);
      done(true);
    } catch {
      const ok = fallbackCopy(email);
      done(ok);
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
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
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
