import './style.css';
import * as THREE from 'three';

// --- Theme Toggle Logic ---
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const body = document.body;
const ghGraph = document.getElementById('gh-graph');

function updateGraphTheme(isLightMode) {
  if (ghGraph) {
    ghGraph.src = isLightMode
      ? "https://ghchart.rshah.org/4f46e5/Thanvik931"
      : "https://ghchart.rshah.org/6366f1/Thanvik931";
  }
}

// Check local storage for theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
  body.setAttribute('data-theme', 'light');
  sunIcon.style.display = 'none';
  moonIcon.style.display = 'block';
  updateGraphTheme(true);
}

themeToggleBtn.addEventListener('click', () => {
  if (body.getAttribute('data-theme') === 'light') {
    // Switch to dark
    body.removeAttribute('data-theme');
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
    localStorage.setItem('theme', 'dark');
    updateThreeColors(false);
    updateGraphTheme(false);
  } else {
    // Switch to light
    body.setAttribute('data-theme', 'light');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
    localStorage.setItem('theme', 'light');
    updateThreeColors(true);
    updateGraphTheme(true);
  }
});

// --- Dynamic GitHub Projects Fetch ---
async function fetchGitHubProjects() {
  const container = document.getElementById('github-projects');
  if (!container) return;

  try {
    const response = await fetch('https://api.github.com/users/Thanvik931/repos?sort=updated');
    if (!response.ok) throw new Error('Failed to fetch repos');

    let repos = await response.json();

    // Explicitly grab unilink if it exists
    const unilink = repos.find(repo => repo.name.toLowerCase() === 'unilink');

    // Filter out forks for the rest, and pick top 3 to make room for unilink
    let mainRepos = repos.filter(repo => !repo.fork && repo.name.toLowerCase() !== 'unilink').slice(0, 3);

    // Combine them
    if (unilink) {
      mainRepos.push(unilink);
    } else {
      // If unilink wasn't found in the first page, just use the top 4
      mainRepos = repos.filter(repo => !repo.fork).slice(0, 4);
    }

    repos = mainRepos;

    container.innerHTML = ''; // clear loading text

    if (repos.length === 0) {
      container.innerHTML = '<p class="text-center" style="grid-column: 1 / -1;">No projects found.</p>';
      return;
    }

    repos.forEach(repo => {
      // Create tags from language if available
      const langTag = repo.language ? `<span class="tag">${repo.language}</span>` : '';

      // Use official GitHub Open Graph preview generator for a stunning, authentic project image
      const fallbackImg = `https://opengraph.githubassets.com/1/Thanvik931/${repo.name}`;

      const cardHTML = `
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="card card-3d">
          <div class="card-inner">
            <div class="card-image">
              <img src="${fallbackImg}" alt="${repo.name} Preview">
            </div>
            <div class="card-content">
              <h3>${repo.name}</h3>
              <p>${repo.description ? repo.description.substring(0, 100) + '...' : 'View repository on GitHub for more details.'}</p>
              <div class="tags">
                ${langTag}
              </div>
            </div>
          </div>
        </a>
      `;
      container.innerHTML += cardHTML;
    });

    init3DCards(); // initialize hover logic after rendering

  } catch (error) {
    console.error('Error fetching projects:', error);
    container.innerHTML = '<p class="text-center text-muted" style="grid-column: 1 / -1;">Failed to load projects from GitHub. Please try again later.</p>';
  }
}

// --- Interactive 3D Card Hover Effects ---
function init3DCards() {
  // Select both project cards and ALL glass containers for full 3D layout effect
  const cards = document.querySelectorAll('.card-inner, .glass');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      // Slightly softer rotation for larger panels like glass containers
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });
}

// Call the fetch function on load
fetchGitHubProjects();

// Interactive 3D Hero Photo Effect
const heroPhoto = document.querySelector('.profile-photo');
const heroContainer = document.querySelector('.ui-3d');

if (heroContainer && heroPhoto) {
  heroContainer.addEventListener('mousemove', e => {
    const rect = heroContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    heroPhoto.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  });

  heroContainer.addEventListener('mouseleave', () => {
    heroPhoto.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    heroPhoto.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });

  heroContainer.addEventListener('mouseenter', () => {
    heroPhoto.style.transition = 'none';
  });
}


// --- Three.js Background Animation ---
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Torus Knot
const torusGeometry = new THREE.TorusKnotGeometry(12, 3.5, 120, 20);
const torusMaterial = new THREE.MeshStandardMaterial({
  color: 0x6366f1,
  wireframe: true,
  transparent: true,
  opacity: 0.1
});
const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torusKnot);

// Particles
const geometry = new THREE.BufferGeometry();
const numParticles = 1200;
const posArray = new Float32Array(numParticles * 3);

for (let i = 0; i < numParticles * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 120;
}
geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particleMaterial = new THREE.PointsMaterial({
  size: 0.12,
  color: 0xec4899,
  transparent: true,
  opacity: 0.6
});
const particlesMesh = new THREE.Points(geometry, particleMaterial);
scene.add(particlesMesh);

// Lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(pointLight, ambientLight);

// Update colors based on theme
function updateThreeColors(isLightMode) {
  if (isLightMode) {
    torusMaterial.color.setHex(0x4f46e5);
    torusMaterial.opacity = 0.08;
    particleMaterial.color.setHex(0xdb2777);
  } else {
    torusMaterial.color.setHex(0x6366f1);
    torusMaterial.opacity = 0.1;
    particleMaterial.color.setHex(0xec4899);
  }
}
if (currentTheme === 'light') updateThreeColors(true);

// Animation Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  torusKnot.rotation.x += 0.003;
  torusKnot.rotation.y += 0.003;
  torusKnot.rotation.z += 0.003;

  particlesMesh.rotation.y = elapsedTime * 0.03;
  particlesMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;

  // Gentle float
  torusKnot.position.y = Math.sin(elapsedTime * 0.8) * 2;

  renderer.render(scene, camera);
}

animate();

// Handle Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Scroll Fade-in Animation Logic
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const fadeObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optional: Stop observing once faded in
      // observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(el => fadeObserver.observe(el));
});

// --- About Me Expansion Logic ---
const aboutCard = document.getElementById('about-card');
const aboutExtra = document.getElementById('about-extra');
const aboutReadMore = document.getElementById('about-read-more');

if (aboutCard && aboutExtra && aboutReadMore) {
  let isExpanded = false;
  aboutCard.addEventListener('click', () => {
    isExpanded = !isExpanded;
    if (isExpanded) {
      aboutExtra.classList.add('visible');
      aboutReadMore.innerHTML = 'Show less &uarr;';
    } else {
      aboutExtra.classList.remove('visible');
      aboutReadMore.innerHTML = 'Click to read more &darr;';
    }
  });
}

// --- Feedback Form to WhatsApp Logic ---
const feedbackForm = document.getElementById('feedback-form');
if (feedbackForm) {
  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName').value;
    const message = document.getElementById('senderMessage').value;

    // Construct the WhatsApp message payload
    const textParams = `*Inquiry from Portfolio*\n\n*Name/Org:* ${name}\n\n*Message:*\n${message}`;
    const encodedText = encodeURIComponent(textParams);

    // Open WhatsApp with the prefilled message
    window.open(`https://wa.me/918790505507?text=${encodedText}`, '_blank');

    // Reset form after submission
    feedbackForm.reset();
  });
}

// Move camera on scroll
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.01 + 30;
  camera.position.y = t * 0.001;
  camera.rotation.y = t * -0.0002;
}
document.body.onscroll = moveCamera;
moveCamera();

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// --- Custom 3D Cursor Logic ---
const cursor = document.getElementById('custom-cursor');
const cursorTrail = document.getElementById('cursor-trail');

if (cursor && cursorTrail && !window.matchMedia("(pointer: coarse)").matches) {
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Immediate cursor update
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Smooth trail animation
  function animateTrail() {
    // Lerp (Linear Interpolation) for smooth trailing
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;

    cursorTrail.style.left = `${trailX}px`;
    cursorTrail.style.top = `${trailY}px`;

    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Add hover effects for links and buttons
  const interactables = document.querySelectorAll('a, button, .card-3d, .theme-btn');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering-link'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering-link'));
  });
}
