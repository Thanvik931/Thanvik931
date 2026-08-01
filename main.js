import './style.css';
import * as THREE from 'three';

// --- Toast Notification System ---
function showToast(message, icon = '✨') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Copy Email Logic
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-email-btn');
  if (btn) {
    const email = 'thanvikreddy2@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Email address copied to clipboard!', '📧');
    }).catch(() => {
      showToast('Failed to copy email.', '❌');
    });
  }
});

// --- Theme Toggle Logic & Three.js Sync ---
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
  updateThreeColors(light);
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    isLightMode = !isLightMode;
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    applyTheme(isLightMode);
    showToast(`Switched to ${isLightMode ? 'Light' : 'Dark'} theme`, isLightMode ? '☀️' : '🌙');
  });
}

// Initialize theme on load
applyTheme(isLightMode);

// --- Dynamic Typing Effect in Hero ---
const typingTextElement = document.getElementById('typing-text');
const roles = [
  'AI Governance & Systems Engineer',
  'Full-Stack Developer (React 18 & FastAPI)',
  'Explainable AI Specialist (SHAP / LIME)',
  'Automation Anywhere Certified RPA Developer',
  'NVIDIA DLI Prompt Engineering Specialist',
  'GSSoC \'26 Open-Source Contributor'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeEffect() {
  if (!typingTextElement) return;

  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    typingDelay = 40;
  } else {
    typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    typingDelay = 90;
  }

  if (!isDeleting && charIndex === currentRole.length) {
    typingDelay = 2200; // Pause at end of word
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typingDelay = 400; // Pause before starting next word
  }

  setTimeout(typeEffect, typingDelay);
}

document.addEventListener('DOMContentLoaded', () => {
  typeEffect();
});

// --- Resume Modal Logic ---
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

// --- GitHub Repos API Fetch ---
async function fetchGitHubProjects() {
  const container = document.getElementById('github-projects');
  if (!container) return;

  try {
    const response = await fetch('https://api.github.com/users/Thanvik931/repos?sort=updated&per_page=10');
    if (!response.ok) throw new Error('GitHub API request failed');

    const repos = await response.json();

    // Filter out forks and main featured projects already in highlight section
    const excluded = ['neurocloak', 'nlp---trustlens'];
    const filteredRepos = repos
      .filter(repo => !repo.fork && !excluded.includes(repo.name.toLowerCase()))
      .slice(0, 6);

    container.innerHTML = '';

    if (filteredRepos.length === 0) {
      container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">Explore all repositories on GitHub.</p>';
      return;
    }

    filteredRepos.forEach(repo => {
      const card = document.createElement('a');
      card.href = repo.html_url;
      card.target = '_blank';
      card.rel = 'noopener';
      card.className = 'repo-card glass card-3d';

      card.innerHTML = `
        <div>
          <h4 class="repo-card-title">${repo.name}</h4>
          <p class="repo-card-desc">${repo.description || 'GitHub project repository by Thanvik Reddy.'}</p>
        </div>
        <div class="repo-card-footer">
          <span>${repo.language || 'Code'}</span>
          <span>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</span>
        </div>
      `;

      container.appendChild(card);
    });

    init3DTilt();

  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">View all projects on <a href="https://github.com/Thanvik931" target="_blank" style="color: var(--cyan);">GitHub profile</a>.</p>';
  }
}

fetchGitHubProjects();

// --- Interactive 3D Tilt Effect ---
function init3DTilt() {
  const tiltElements = document.querySelectorAll('.card-3d, .profile-card-3d');

  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.1s ease-out';
    });
  });
}

document.addEventListener('DOMContentLoaded', init3DTilt);

// --- Custom Glow Cursor Physics ---
const cursor = document.getElementById('custom-cursor');
const cursorTrail = document.getElementById('cursor-trail');

if (cursor && cursorTrail && window.matchMedia('(pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function renderTrail() {
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;

    cursorTrail.style.left = `${trailX}px`;
    cursorTrail.style.top = `${trailY}px`;

    requestAnimationFrame(renderTrail);
  }
  renderTrail();

  document.querySelectorAll('a, button, .card-3d').forEach(el => {
    el.addEventListener('mouseenter', () => body.classList.add('hovering-link'));
    el.addEventListener('mouseleave', () => body.classList.remove('hovering-link'));
  });
}

// --- Three.js Background Animation ---
const canvas = document.querySelector('#bg-canvas');
let scene, camera, renderer, particlesMesh, shapeMesh;

if (canvas) {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(30);

  // Geometric Shape (Icosahedron Wireframe)
  const shapeGeo = new THREE.IcosahedronGeometry(14, 2);
  const shapeMat = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });
  shapeMesh = new THREE.Mesh(shapeGeo, shapeMat);
  scene.add(shapeMesh);

  // Particle System
  const particleGeo = new THREE.BufferGeometry();
  const count = 1200;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 110;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.12,
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.6
  });
  particlesMesh = new THREE.Points(particleGeo, particleMat);
  scene.add(particlesMesh);

  // Lights
  const pLight = new THREE.PointLight(0xffffff, 1);
  pLight.position.set(20, 20, 20);
  const aLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(pLight, aLight);

  // Animation Loop
  const clock = new THREE.Clock();

  function animateThree() {
    requestAnimationFrame(animateThree);
    const elapsedTime = clock.getElapsedTime();

    if (shapeMesh) {
      shapeMesh.rotation.x = elapsedTime * 0.05;
      shapeMesh.rotation.y = elapsedTime * 0.08;
      shapeMesh.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    }

    if (particlesMesh) {
      particlesMesh.rotation.y = elapsedTime * 0.02;
    }

    renderer.render(scene, camera);
  }

  animateThree();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function updateThreeColors(lightMode) {
  if (!shapeMesh || !particlesMesh) return;
  if (lightMode) {
    shapeMesh.material.color.setHex(0x4f46e5);
    shapeMesh.material.opacity = 0.08;
    particlesMesh.material.color.setHex(0x0284c7);
  } else {
    shapeMesh.material.color.setHex(0x6366f1);
    shapeMesh.material.opacity = 0.12;
    particlesMesh.material.color.setHex(0x06b6d4);
  }
}

// Scroll camera shift
window.addEventListener('scroll', () => {
  if (camera) {
    const scrollY = window.scrollY;
    camera.position.y = -scrollY * 0.01;
  }
  
  // Navbar scroll background shift
  const nav = document.getElementById('navbar');
  if (nav) {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
});
