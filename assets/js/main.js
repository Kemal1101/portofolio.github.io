// Access globals defined by data.js (classic script)
const projects = (window.projects ?? []);
const skills = (window.skills ?? []);

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

function projectCardTpl(p) {
  const letter = p.title.charAt(0).toUpperCase();
  const tags = p.tags.map(t => `<span class="chip">${t}</span>`).join('');
  return `
    <article class="card" role="listitem">
      <div class="card-cover" aria-hidden="true"><span>${letter}</span></div>
      <div class="card-body">
        <h3 class="card-title">${p.title}</h3>
        <p class="card-desc">${p.description}</p>
        <div class="card-tags">${tags}</div>
        <div class="card-actions">
          <a class="btn btn-ghost" href="${p.repo}" target="_blank" rel="noreferrer noopener">Kode</a>
          <a class="btn btn-primary" href="${p.live}" target="_blank" rel="noreferrer noopener">Demo</a>
        </div>
      </div>
    </article>`;
}

function renderProjects(list) {
  const grid = $('#projectsGrid');
  grid.innerHTML = list.map(projectCardTpl).join('');
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
}

// Skills rendering
function skillCardTpl(group) {
  const items = group.items.map(s => `
    <li class="skill-item">
      <div class="skill-meta">
        <span>${s.name}</span>
        <span>${s.level}%</span>
      </div>
      <div class="meter"><span data-level="${s.level}" style="width:0%"></span></div>
    </li>
  `).join('');
  return `
    <article class="skill-card" role="listitem">
      <h3>${group.category}</h3>
      <ul class="skill-list">${items}</ul>
    </article>
  `;
}

function renderSkills() {
  const grid = $('#skillsGrid');
  if (!grid) return;
  grid.innerHTML = skills.map(skillCardTpl).join('');
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
initProjects();
initContact();
initSmoothScroll();
setYear();
initHeaderShadow();
