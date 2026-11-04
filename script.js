(() => {
  const root = document.documentElement;
  const header = document.getElementById('site-header');
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const headerIndex = document.querySelector('.header-index');

  try {
    if (localStorage.getItem('portfolio-theme') === 'light') {
      root.dataset.theme = 'light';
      themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    }
  } catch (_) {
    // The theme remains usable when browser storage is unavailable.
  }

  themeToggle.addEventListener('click', () => {
    const isLight = root.dataset.theme !== 'light';
    root.dataset.theme = isLight ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    try {
      localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    } catch (_) {
      // Do not interrupt the theme change when storage is unavailable.
    }
  });

  const closeMenu = () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  };

  menuToggle.addEventListener('click', () => {
    const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    menuToggle.setAttribute('aria-label', willOpen ? 'Close navigation menu' : 'Open navigation menu');
    mainNav.classList.toggle('open', willOpen);
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 740) closeMenu();
  });

  let currentSection = 0;
  const setCurrentSection = (section) => {
    const index = Math.max(0, sections.indexOf(section));
    currentSection = index;
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${section.id}`;
      link.classList.toggle('active', active);
    });
    if (headerIndex) {
      headerIndex.innerHTML = `${String(index + 1).padStart(2, '0')} <i>/</i> ${String(sections.length).padStart(2, '0')}`;
      headerIndex.setAttribute('aria-label', `Section ${index + 1} of ${sections.length}`);
    }
  };

  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
    if (window.scrollY < 80 && currentSection !== 0) setCurrentSection(sections[0]);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setCurrentSection(entry.target);
      });
    }, { rootMargin: '-34% 0px -58% 0px', threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }

  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const values = new FormData(contactForm);
    const subject = encodeURIComponent(String(values.get('subject')).trim());
    const body = encodeURIComponent(`From: ${values.get('name')} <${values.get('email')}>\n\n${values.get('message')}`);
    window.location.href = `mailto:sahnikesh2022@gmail.com?subject=${subject}&body=${body}`;
  });
})();
