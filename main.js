import './style.css';

// --- Toast Notification Banner ---
function showToast(message, icon = '✨') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Copy Email to Clipboard
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-email-btn');
  if (btn) {
    const email = 'thanvikreddy2@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Email copied to clipboard!', '📧');
    }).catch(() => {
      showToast('Failed to copy email.', '❌');
    });
  }
});

// --- Theme Toggle (Dark / Light Mode) ---
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const body = document.body;

let isLightMode = localStorage.getItem('theme') === 'light';

function applyTheme(light) {
  if (light) {
    body.setAttribute('data-theme', 'light');
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
  } else {
    body.removeAttribute('data-theme');
    if (sunIcon) sunIcon.style.display = 'block';
    if (moonIcon) moonIcon.style.display = 'none';
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    isLightMode = !isLightMode;
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    applyTheme(isLightMode);
    showToast(`Switched to ${isLightMode ? 'Light' : 'Dark'} mode`, isLightMode ? '☀️' : '🌙');
  });
}

// Apply theme on load
applyTheme(isLightMode);

// --- Resume Modal Handlers ---
const resumeModal = document.getElementById('resume-modal');
const openModalBtns = [
  document.getElementById('resume-modal-btn'),
  document.getElementById('hero-resume-btn')
];
const closeModalBtn = document.getElementById('close-modal-btn');
const modalDownloadBtn = document.getElementById('modal-download-btn');

function openResumeModal() {
  if (resumeModal) {
    resumeModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeResumeModal() {
  if (resumeModal) {
    resumeModal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

openModalBtns.forEach(btn => {
  if (btn) btn.addEventListener('click', openResumeModal);
});

if (closeModalBtn) closeModalBtn.addEventListener('click', closeResumeModal);

if (resumeModal) {
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResumeModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeResumeModal();
});

if (modalDownloadBtn) {
  modalDownloadBtn.addEventListener('click', () => {
    window.print();
  });
}

// --- Contact Form to WhatsApp ---
const feedbackForm = document.getElementById('feedback-form');
if (feedbackForm) {
  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName').value;
    const message = document.getElementById('senderMessage').value;

    const formattedText = `*Inquiry from Portfolio*\n\n*From:* ${name}\n\n*Message:*\n${message}`;
    const encodedText = encodeURIComponent(formattedText);

    window.open(`https://wa.me/918790505507?text=${encodedText}`, '_blank');
    showToast('Redirecting to WhatsApp...', '💬');
    feedbackForm.reset();
  });
}

// --- Fetch GitHub Projects ---
async function fetchGitHubProjects() {
  const container = document.getElementById('github-projects');
  if (!container) return;

  try {
    const response = await fetch('https://api.github.com/users/Thanvik931/repos?sort=updated&per_page=10');
    if (!response.ok) throw new Error('GitHub API request failed');

    const repos = await response.json();

    const excluded = ['neurocloak', 'stepup-for-ai', 'stepupforai', 'skilling-', 'skilling'];
    const filteredRepos = repos
      .filter(repo => !repo.fork && !excluded.includes(repo.name.toLowerCase()))
      .slice(0, 3);

    container.innerHTML = '';

    if (filteredRepos.length === 0) {
      container.innerHTML = '<p style="grid-column: 1 / -1; color: var(--text-secondary);">Explore all repositories on <a href="https://github.com/Thanvik931" target="_blank" style="color: var(--accent-blue);">GitHub profile</a>.</p>';
      return;
    }

    filteredRepos.forEach(repo => {
      const card = document.createElement('a');
      card.href = repo.html_url;
      card.target = '_blank';
      card.rel = 'noopener';
      card.className = 'repo-card-minimal';

      card.innerHTML = `
        <div>
          <div class="repo-name">${repo.name}</div>
          <p class="repo-desc">${repo.description || 'GitHub project repository by Sama Thanvik Reddy.'}</p>
        </div>
        <div class="repo-meta">
          <span>${repo.language || 'Code'}</span>
          <span>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</span>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    container.innerHTML = '<p style="grid-column: 1 / -1; color: var(--text-secondary);">View projects directly on <a href="https://github.com/Thanvik931" target="_blank" style="color: var(--accent-blue);">GitHub profile</a>.</p>';
  }
}

fetchGitHubProjects();

// Scroll Navbar style shift
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
});
