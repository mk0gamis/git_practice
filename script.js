/* =====================
   パーティクル背景
   ===================== */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const particles = [];
const PARTICLE_COUNT = 80;
let mouseX = -9999, mouseY = -9999;

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.6;
    this.speedY = (Math.random() - 0.5) * 0.6;
    this.opacity = Math.random() * 0.6 + 0.2;
    this.color = `hsl(${Math.random() * 60 + 220}, 80%, 70%)`;
  }
  update() {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 160 && dist > 0) {
      const force = (160 - dist) / 160 * 0.025;
      this.speedX += (dx / dist) * force;
      this.speedY += (dy / dist) * force;
    }
    const maxSpeed = 2;
    const spd = Math.sqrt(this.speedX ** 2 + this.speedY ** 2);
    if (spd > maxSpeed) {
      this.speedX = (this.speedX / spd) * maxSpeed;
      this.speedY = (this.speedY / spd) * maxSpeed;
    }
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(150, 120, 255, ${0.15 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}
animateParticles();


/* =====================
   3D マウス傾き ＋ トレイル
   ===================== */
const card = document.getElementById('card');

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // 3D 傾き
  const rect = card.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / (window.innerWidth / 2);
  const dy = (e.clientY - cy) / (window.innerHeight / 2);
  const rotateX = dy * -15;
  const rotateY = dx * 15;

  card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  card.style.boxShadow = `
    ${-rotateY * 2}px ${rotateX * 2}px 50px rgba(0,0,0,0.4),
    0 0 60px rgba(99, 102, 241, 0.35)
  `;

  // マウストレイル
  const trail = document.createElement('div');
  trail.classList.add('trail');
  trail.style.left = e.clientX + 'px';
  trail.style.top = e.clientY + 'px';
  const hue = Math.random() * 60 + 220;
  trail.style.background = `radial-gradient(circle, hsla(${hue}, 80%, 70%, 0.9), transparent)`;
  document.body.appendChild(trail);
  setTimeout(() => trail.remove(), 500);
});

document.addEventListener('mouseleave', () => {
  mouseX = -9999;
  mouseY = -9999;
  card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
  card.style.boxShadow = '0 25px 50px rgba(0,0,0,0.4), 0 0 40px rgba(99,102,241,0.2)';
});


/* =====================
   ホログラフィック効果
   ===================== */
const holoOverlay = document.createElement('div');
holoOverlay.className = 'holo-overlay';
card.appendChild(holoOverlay);

card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  const angle = (x + y) * 1.8;

  holoOverlay.style.background = `
    radial-gradient(circle at ${x}% ${y}%,
      rgba(255, 120, 180, 0.3) 0%,
      rgba(120, 200, 255, 0.2) 30%,
      rgba(120, 255, 180, 0.15) 55%,
      transparent 70%
    ),
    linear-gradient(
      ${angle}deg,
      rgba(99, 102, 241, 0.12),
      rgba(236, 72, 153, 0.12) 50%,
      rgba(16, 185, 129, 0.12)
    )
  `;
  holoOverlay.style.opacity = '1';
});

card.addEventListener('mouseleave', () => {
  holoOverlay.style.opacity = '0';
});


/* =====================
   リップルエフェクト
   ===================== */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const size = Math.max(this.offsetWidth, this.offsetHeight);
    const rect = this.getBoundingClientRect();
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});


/* =====================
   タイピングアニメーション
   ===================== */
const textElement = document.getElementById('typing-text');
const textContent = "エンジニアを目指して学習中のチャレンジャー。";
let charIndex = 0;

function typeWriter() {
  if (charIndex < textContent.length) {
    textElement.textContent += textContent.charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, 100);
  }
}

window.onload = function () {
  setTimeout(typeWriter, 1500);
};


/* =====================
   スパークル
   ===================== */
function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.classList.add('sparkle');
  const size = Math.random() * 10 + 6;
  sparkle.style.width = size + 'px';
  sparkle.style.height = size + 'px';
  sparkle.style.left = (Math.random() * 88 + 6) + '%';
  sparkle.style.top  = (Math.random() * 88 + 6) + '%';
  const hues = [260, 280, 320, 200];
  const hue = hues[Math.floor(Math.random() * hues.length)];
  sparkle.style.setProperty('--hue', hue);
  card.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 900);
}

setInterval(createSparkle, 350);
