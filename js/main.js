/* =====================================================
   JAWAHAR PORTFOLIO — Main JavaScript
   Animations, Canvas, Interactions, Events
===================================================== */

'use strict';

// ─── Loader ──────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1800);
});

// ─── Custom Cursor ───────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .tilt-card, .tab-btn').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hovered'); cursorFollower.classList.add('hovered'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); cursorFollower.classList.remove('hovered'); });
});

// ─── Scroll Progress ─────────────────────────────────
const scrollBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollBar.style.width = pct + '%';
}, { passive: true });

// ─── Navbar scroll behavior ──────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ─── Reveal on scroll ────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal-line, .why-card, .step-content').forEach(el => {
  revealObserver.observe(el);
});

// Staggered delays for why-cards
document.querySelectorAll('.why-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 100) + 'ms';
});
document.querySelectorAll('.step-content').forEach((card, i) => {
  card.style.transitionDelay = (i * 120) + 'ms';
});

// ─── Animated Stat Counters ──────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const targets = e.target.querySelectorAll('.stat-number[data-target]');
      targets.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        let count = 0;
        const step = target / 50;
        const interval = setInterval(() => {
          count = Math.min(count + step, target);
          el.textContent = Math.floor(count);
          if (count >= target) clearInterval(interval);
        }, 30);
      });
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
const aboutCard = document.querySelector('.about-card');
if (aboutCard) counterObserver.observe(aboutCard);

// ─── Tilt Cards ──────────────────────────────────────
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
  });
});

// ─── Hero Particle Canvas ────────────────────────────
(function heroParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.color = ['#FFBE98','#FA8072','#F4C2C2','#F6A89E','#EDC9AF'][Math.floor(Math.random()*5)];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  // connect nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(250,128,114,${0.08 * (1 - d/100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
})();

// ─── Workspace Canvas (3D desk illustration) ─────────
(function workspaceCanvas() {
  const canvas = document.getElementById('workspaceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width  = 500;
  const H = canvas.height = 400;

  let time = 0;
  let mx = 0, my = 0;

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    my = ((e.clientY - r.top)  / r.height - 0.5) * 2;
  });
  canvas.addEventListener('mouseleave', () => { mx = 0; my = 0; });

  // Floating code text lines
  const codeLines = [
    'const build = () => {',
    '  return magic;',
    '};',
    'function create() {',
    '  // design + code',
    '  return awesome;',
    '}'
  ];

  function drawRoundRect(x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const ox = mx * 6; // parallax offset
    const oy = my * 4;

    // Background glow
    const grd = ctx.createRadialGradient(W/2 + ox*0.3, H/2 + oy*0.3, 0, W/2, H/2, 260);
    grd.addColorStop(0, 'rgba(255,190,152,0.25)');
    grd.addColorStop(1, 'rgba(255,248,245,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    // Desk surface
    const deskY = H * 0.62 + oy * 0.1;
    ctx.beginPath();
    ctx.moveTo(30 + ox*0.2, deskY);
    ctx.lineTo(W - 30 - ox*0.2, deskY);
    ctx.lineTo(W - 10 - ox*0.2, deskY + 22);
    ctx.lineTo(10 + ox*0.2, deskY + 22);
    ctx.closePath();
    ctx.fillStyle = 'rgba(237,201,175,0.45)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(250,128,114,0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Monitor body
    const monX = W/2 - 90 + ox*0.4, monY = deskY - 170 + oy*0.3;
    drawRoundRect(monX, monY, 180, 120, 12, 'rgba(45,27,20,0.85)', 'rgba(250,128,114,0.4)');

    // Monitor screen
    drawRoundRect(monX + 8, monY + 8, 164, 100, 8, '#1a1020', null);

    // Screen glow
    const sgrd = ctx.createRadialGradient(monX + 90, monY + 58, 0, monX + 90, monY + 58, 90);
    sgrd.addColorStop(0, 'rgba(250,128,114,0.25)');
    sgrd.addColorStop(1, 'rgba(250,128,114,0)');
    ctx.fillStyle = sgrd;
    ctx.fillRect(monX + 8, monY + 8, 164, 100);

    // Scrolling code lines
    ctx.font = '7.5px monospace';
    const lineColors = ['#FFBE98','#F6A89E','#FA8072','#EDC9AF','rgba(255,190,152,0.6)','#F4C2C2','rgba(250,128,114,0.5)'];
    const scrollOffset = (time * 18) % (codeLines.length * 12);
    for (let i = 0; i < 8; i++) {
      const lineIdx = (i + Math.floor(time * 1.5)) % codeLines.length;
      const ly = monY + 16 + i * 12 - (scrollOffset % 12);
      if (ly < monY + 10 || ly > monY + 102) continue;
      ctx.globalAlpha = Math.min(1, Math.min((ly - monY - 10) / 20, (monY + 104 - ly) / 20));
      ctx.fillStyle = lineColors[lineIdx % lineColors.length];
      ctx.fillText(codeLines[lineIdx], monX + 14, ly);
      ctx.globalAlpha = 1;
    }

    // Cursor blink
    if (Math.floor(time * 2) % 2 === 0) {
      ctx.fillStyle = '#FA8072';
      ctx.fillRect(monX + 14, monY + 78, 6, 9);
    }

    // Monitor stand
    ctx.fillStyle = 'rgba(45,27,20,0.6)';
    ctx.fillRect(monX + 80, monY + 118, 20, 14);
    drawRoundRect(monX + 60, monY + 130, 60, 8, 4, 'rgba(45,27,20,0.5)', null);

    // Character (stylized)
    const charX = W/2 + 60 + ox*0.5, charBaseY = deskY - 10 + oy*0.3;
    const breathe = Math.sin(time * 1.5) * 2;

    // Chair
    drawRoundRect(charX - 24, charBaseY - 60, 48, 10, 5, 'rgba(200,130,110,0.7)', null);
    ctx.fillStyle = 'rgba(180,110,90,0.5)';
    ctx.fillRect(charX - 4, charBaseY - 50, 8, 30);
    drawRoundRect(charX - 26, charBaseY - 90, 52, 40, 8, 'rgba(200,130,110,0.5)', null);

    // Body
    drawRoundRect(charX - 18, charBaseY - 90 + breathe, 36, 44, 8, 'rgba(250,128,114,0.75)', 'rgba(250,128,114,0.4)');

    // Head
    ctx.beginPath();
    ctx.arc(charX, charBaseY - 102 + breathe, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#F6A89E';
    ctx.fill();
    ctx.strokeStyle = 'rgba(250,128,114,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Eyes (blinking)
    const blink = (time % 4) < 0.15;
    if (!blink) {
      ctx.beginPath(); ctx.arc(charX - 6, charBaseY - 104 + breathe, 2.5, 0, Math.PI*2);
      ctx.fillStyle = '#2D1B14'; ctx.fill();
      ctx.beginPath(); ctx.arc(charX + 6, charBaseY - 104 + breathe, 2.5, 0, Math.PI*2);
      ctx.fill();
    } else {
      ctx.strokeStyle = '#2D1B14'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(charX-8, charBaseY-104+breathe); ctx.lineTo(charX-4, charBaseY-104+breathe); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(charX+4, charBaseY-104+breathe); ctx.lineTo(charX+8, charBaseY-104+breathe); ctx.stroke();
    }

    // Smile
    ctx.beginPath();
    ctx.arc(charX, charBaseY - 99 + breathe, 6, 0.2, Math.PI - 0.2);
    ctx.strokeStyle = '#2D1B14'; ctx.lineWidth = 1.5;
    ctx.stroke();

    // Arms typing
    const typingOffset = Math.sin(time * 5) * 3;
    ctx.strokeStyle = 'rgba(250,128,114,0.8)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(charX - 18, charBaseY - 72 + breathe); ctx.lineTo(charX - 38, charBaseY - 52 + typingOffset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(charX + 18, charBaseY - 72 + breathe); ctx.lineTo(charX + 32, charBaseY - 52 - typingOffset); ctx.stroke();

    // Floating particles around character
    for (let i = 0; i < 5; i++) {
      const angle = time * 0.8 + (i / 5) * Math.PI * 2;
      const px = charX + Math.cos(angle) * (50 + i * 8) + ox * 0.6;
      const py = charBaseY - 70 + Math.sin(angle * 0.7) * (30 + i * 5) + oy * 0.4;
      const pr = 1.5 + Math.sin(time + i) * 0.8;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fillStyle = ['#FFBE98','#FA8072','#F4C2C2','#F6A89E','#EDC9AF'][i];
      ctx.globalAlpha = 0.6;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Keyboard
    drawRoundRect(charX - 50 + ox*0.2, deskY - 18 + oy*0.1, 100, 12, 4, 'rgba(45,27,20,0.2)', 'rgba(250,128,114,0.2)');
    for (let k = 0; k < 8; k++) {
      drawRoundRect(charX - 46 + k*12 + ox*0.2, deskY - 16 + oy*0.1, 9, 7, 2, `rgba(250,128,114,${0.2 + (k === Math.floor(time*4)%8 ? 0.5 : 0)})`, null);
    }

    // Coffee mug
    const mugX = W/2 - 145 + ox*0.3, mugY = deskY - 30 + oy*0.2;
    drawRoundRect(mugX, mugY, 24, 28, 5, 'rgba(255,248,245,0.9)', 'rgba(250,128,114,0.4)');
    ctx.beginPath();
    ctx.arc(mugX + 24, mugY + 12, 8, -0.8, 0.8);
    ctx.strokeStyle = 'rgba(250,128,114,0.5)'; ctx.lineWidth = 3; ctx.stroke();
    // Steam
    for (let s = 0; s < 2; s++) {
      ctx.beginPath();
      const sx = mugX + 8 + s*8, sy = mugY - 8 - (time * 20 % 18);
      ctx.moveTo(sx, sy + 18);
      ctx.bezierCurveTo(sx - 4, sy + 12, sx + 4, sy + 6, sx, sy);
      ctx.strokeStyle = `rgba(250,128,114,${0.3 - ((time * 20) % 18) / 60})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Lamp
    const lampX = W/2 - 120 + ox*0.35, lampY = deskY - 80 + oy*0.25;
    ctx.strokeStyle = 'rgba(45,27,20,0.4)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(lampX, deskY + oy*0.1); ctx.lineTo(lampX, lampY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lampX, lampY); ctx.lineTo(lampX + 30, lampY - 20); ctx.stroke();
    // Lamp shade
    ctx.beginPath();
    ctx.moveTo(lampX + 18, lampY - 24); ctx.lineTo(lampX + 44, lampY - 24);
    ctx.lineTo(lampX + 38, lampY - 14); ctx.lineTo(lampX + 22, lampY - 14);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,190,152,0.7)'; ctx.fill();
    // Lamp glow
    const lgrd = ctx.createRadialGradient(lampX + 31, lampY - 10, 0, lampX + 31, lampY - 10, 50);
    lgrd.addColorStop(0, 'rgba(255,190,152,0.25)');
    lgrd.addColorStop(1, 'rgba(255,190,152,0)');
    ctx.fillStyle = lgrd;
    ctx.fillRect(lampX - 10, lampY - 50, 90, 80);

    time += 0.016;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── Skills Universe Canvas ───────────────────────────
(function skillsUniverse() {
  const canvas = document.getElementById('skillsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    const wrap = canvas.parentElement;
    W = canvas.width  = wrap.offsetWidth;
    H = canvas.height = wrap.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  const CX = () => W / 2;
  const CY = () => H / 2;

  const orbits = [
    {
      radius: 120, speed: 0.35, color: '#FA8072',
      skills: [
        { name: 'HTML5', icon: '⬢' }, { name: 'CSS3', icon: '✦' },
        { name: 'JavaScript', icon: '◉' }, { name: 'React', icon: '⊛' }
      ]
    },
    {
      radius: 190, speed: 0.22, color: '#F4C2C2',
      skills: [
        { name: 'Node.js', icon: '⬡' }, { name: 'Flutter', icon: '◆' },
        { name: 'Figma', icon: '✧' }, { name: 'Photoshop', icon: '⬟' },
        { name: 'Canva', icon: '◈' }
      ]
    },
    {
      radius: 260, speed: 0.15, color: '#EDC9AF',
      skills: [
        { name: 'Git', icon: '⬠' }, { name: 'Tailwind', icon: '◇' },
        { name: 'MongoDB', icon: '⊙' }, { name: 'MySQL', icon: '◎' },
        { name: 'Illustrator', icon: '⊕' }, { name: 'GSAP', icon: '◐' }
      ]
    }
  ];

  let time = 0;
  let hoveredSkill = null;
  let mouseXs = 0, mouseYs = 0;

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseXs = e.clientX - r.left;
    mouseYs = e.clientY - r.top;
    hoveredSkill = null;
    orbits.forEach(orbit => {
      orbit.skills.forEach((skill, idx) => {
        const angle = (idx / orbit.skills.length) * Math.PI * 2 + time * orbit.speed;
        const sx = CX() + Math.cos(angle) * orbit.radius;
        const sy = CY() + Math.sin(angle) * orbit.radius;
        const dx = mouseXs - sx, dy = mouseYs - sy;
        if (Math.sqrt(dx*dx + dy*dy) < 22) hoveredSkill = { ...skill, x: sx, y: sy };
      });
    });
    canvas.style.cursor = hoveredSkill ? 'pointer' : 'default';
  });
  canvas.addEventListener('mouseleave', () => { hoveredSkill = null; });

  function drawGlowCircle(x, y, r, color, alpha) {
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, color.replace(')', `,${alpha})`).replace('rgb', 'rgba'));
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgb(${r},${g},${b})`;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const cx = CX(), cy = CY();

    // Center glow
    const cgrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
    cgrd.addColorStop(0, 'rgba(250,128,114,0.15)');
    cgrd.addColorStop(1, 'rgba(250,128,114,0)');
    ctx.fillStyle = cgrd; ctx.fillRect(0, 0, W, H);

    // Orbit paths
    orbits.forEach(orbit => {
      ctx.beginPath();
      ctx.arc(cx, cy, orbit.radius, 0, Math.PI * 2);
      ctx.strokeStyle = orbit.color + '30';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Skill nodes
    orbits.forEach((orbit, oi) => {
      orbit.skills.forEach((skill, idx) => {
        const angle = (idx / orbit.skills.length) * Math.PI * 2 + time * orbit.speed;
        const x = cx + Math.cos(angle) * orbit.radius;
        const y = cy + Math.sin(angle) * orbit.radius;
        const isHov = hoveredSkill && hoveredSkill.name === skill.name;
        const scale = isHov ? 1.3 : 1;
        const nodeR = 20 * scale;

        // Glow
        if (isHov) drawGlowCircle(x, y, 40, hexToRgb(orbit.color), 0.4);

        // Node background
        ctx.beginPath();
        ctx.arc(x, y, nodeR, 0, Math.PI * 2);
        const bgGrd = ctx.createRadialGradient(x - nodeR*0.3, y - nodeR*0.3, 0, x, y, nodeR);
        bgGrd.addColorStop(0, 'rgba(255,248,245,0.95)');
        bgGrd.addColorStop(1, orbit.color + 'aa');
        ctx.fillStyle = bgGrd; ctx.fill();
        ctx.strokeStyle = orbit.color;
        ctx.lineWidth = isHov ? 2.5 : 1.5;
        ctx.stroke();

        // Icon / text
        ctx.font = `${10 * scale}px 'Sora', sans-serif`;
        ctx.fillStyle = '#2D1B14';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(skill.icon, x, y);

        // Label
        if (isHov || orbit.radius > 180) {
          ctx.font = `bold ${8.5 * scale}px 'Inter', sans-serif`;
          ctx.fillStyle = isHov ? '#2D1B14' : 'rgba(45,27,20,0.65)';
          ctx.fillText(skill.name, x, y + nodeR + 10);
        }
      });
    });

    // Tooltip for hovered
    if (hoveredSkill) {
      const { x, y, name } = hoveredSkill;
      const tw = ctx.measureText(name).width + 20;
      const tx = Math.min(W - tw/2 - 10, Math.max(tw/2 + 10, x));
      const ty = y < cy ? y + 48 : y - 50;
      drawRoundRectCtx(ctx, tx - tw/2, ty - 12, tw, 24, 8, 'rgba(255,248,245,0.95)', 'rgba(250,128,114,0.4)');
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillStyle = '#FA8072'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(name, tx, ty);
    }

    time += 0.008;
    requestAnimationFrame(draw);
  }

  function drawRoundRectCtx(ctx, x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
  }

  draw();
})();

// ─── CTA Particles ───────────────────────────────────
(function ctaParticles() {
  const wrap = document.getElementById('ctaParticles');
  if (!wrap) return;
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    const size = Math.random() * 80 + 20;
    el.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      border-radius:50%;
      background:radial-gradient(circle,rgba(250,128,114,0.12),transparent);
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      animation:float ${4+Math.random()*4}s ease-in-out ${Math.random()*3}s infinite alternate;
      pointer-events:none;
    `;
    wrap.appendChild(el);
  }
})();

// ─── Portfolio Filter ─────────────────────────────────
const tabBtns = document.querySelectorAll('.tab-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    portfolioCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      if (filter === 'all' || cat === filter) {
        card.style.display = '';
        card.style.animation = 'fadeInUp 0.4s ease both';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ─── Testimonials Carousel ───────────────────────────
(function carousel() {
  const track  = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('carouselDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let autoInterval;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i+1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function getCardWidth() {
    return cards[0].offsetWidth + 24; // gap
  }

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    track.style.transform = `translateX(-${current * getCardWidth()}px)`;
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  function resetAuto() {
    clearInterval(autoInterval);
    autoInterval = setInterval(() => goTo(current + 1), 4000);
  }
  resetAuto();
})();

// ═══════════════════════════════════════════════════════════
// ─── EmailJS Contact Form ──────────────────────────────────
// ═══════════════════════════════════════════════════════════
//
// SETUP INSTRUCTIONS (3 steps):
//   1. Create a free account at https://www.emailjs.com
//   2. Add a Gmail service → copy your Service ID below
//   3. Create an Email Template with these variables:
//        {{from_name}}, {{from_email}}, {{project_type}},
//        {{budget_range}}, {{message}}
//      Then copy your Template ID and Public Key below.
//
// ── Replace these three values before deploying ───────────
const EMAILJS_SERVICE_ID  = 'service_42v8x69';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_v6edve2';  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY  = 'xXSpJ2yGdfcPQuHU4';   // e.g. 'AbCdEfGhIjKlMnOp'
// ──────────────────────────────────────────────────────────

// Initialise EmailJS with your Public Key
(function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  } else {
    // SDK not yet loaded – retry once the window finishes loading
    window.addEventListener('load', () => {
      if (typeof emailjs !== 'undefined') emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    });
  }
})();

// ── Toast helper ──────────────────────────────────────────
/**
 * showToast(message, type, duration)
 * @param {string} message  - Text to display
 * @param {'success'|'error'} type - Visual style
 * @param {number} duration - Auto-dismiss delay in ms (default 5000)
 */
function showToast(message, type = 'success', duration = 5000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✅', error: '❌' };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-msg">${message}</span>
    <button class="toast-close" aria-label="Dismiss">&times;</button>
  `;

  // Manual dismiss
  toast.querySelector('.toast-close').addEventListener('click', () => dismissToast(toast));

  container.appendChild(toast);

  // Auto-dismiss after duration
  const timer = setTimeout(() => dismissToast(toast), duration);
  toast._timer = timer; // store so we could cancel if needed
}

function dismissToast(toast) {
  clearTimeout(toast._timer);
  toast.classList.add('toast-hide');
  toast.addEventListener('animationend', () => toast.remove(), { once: true });
}

// ── Form logic ────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');

if (contactForm) {

  // ── Real-time inline validation on blur ────────────────
  const fields = [
    { id: 'name',    errorId: 'nameError',    validate: v => v.trim().length >= 2 ? '' : 'Full name is required (min 2 characters).' },
    { id: 'email',   errorId: 'emailError',   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.' },
    { id: 'project', errorId: 'projectError', validate: v => v !== '' ? '' : 'Please select a project type.' },
    { id: 'message', errorId: 'messageError', validate: v => v.trim().length >= 10 ? '' : 'Message is too short (min 10 characters).' },
  ];

  fields.forEach(({ id, errorId, validate }) => {
    const el = document.getElementById(id);
    const errEl = document.getElementById(errorId);
    if (!el || !errEl) return;

    el.addEventListener('blur', () => {
      const msg = validate(el.value);
      errEl.textContent = msg;
      el.classList.toggle('error', msg !== '');
    });

    // Clear error as the user starts correcting
    el.addEventListener('input', () => {
      if (el.classList.contains('error') && validate(el.value) === '') {
        errEl.textContent = '';
        el.classList.remove('error');
      }
    });
  });

  // ── Submit handler ─────────────────────────────────────
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // --- Run full validation ---
    let isValid = true;
    fields.forEach(({ id, errorId, validate }) => {
      const el  = document.getElementById(id);
      const err = document.getElementById(errorId);
      if (!el || !err) return;
      const msg = validate(el.value);
      err.textContent = msg;
      el.classList.toggle('error', msg !== '');
      if (msg) isValid = false;
    });

    if (!isValid) {
      // Scroll to first error field
      const firstError = contactForm.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // --- Loading state ---
    const submitBtn     = document.getElementById('submitBtn');
    const submitText    = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    const submitIcon    = document.getElementById('submitIcon');

    submitBtn.disabled         = true;
    submitText.textContent     = 'Sending…';
    submitSpinner.style.display = 'inline-block';
    submitIcon.style.display    = 'none';

    // --- Build template params (must match EmailJS template variables) ---
    const templateParams = {
      from_name:    document.getElementById('name').value.trim(),
      from_email:   document.getElementById('email').value.trim(),
      project_type: document.getElementById('project').value,
      budget_range: document.getElementById('budget').value || 'Not specified',
      message:      document.getElementById('message').value.trim(),
    };

    try {
      // --- Send via EmailJS ---
      if (typeof emailjs === 'undefined') throw new Error('EmailJS SDK not loaded.');

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

      // ✅ Success
      showToast('Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours. 🚀', 'success', 6000);
      contactForm.reset();

      // Remove any lingering error states after reset
      document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
      document.querySelectorAll('input, textarea, select').forEach(el => el.classList.remove('error'));

    } catch (error) {
      // ❌ Failure
      console.error('EmailJS error:', error);
      showToast('Failed to send message. Please try again or reach out directly via email.', 'error', 7000);

    } finally {
      // --- Restore button state ---
      submitBtn.disabled          = false;
      submitText.textContent      = 'Send Message';
      submitSpinner.style.display = 'none';
      submitIcon.style.display    = '';
    }
  });

}

// ─── Modal ───────────────────────────────────────────
const modalData = [
  {
    title: 'SaaS Dashboard',
    desc: 'A comprehensive analytics dashboard built for a B2B SaaS startup. Features real-time data visualization, user management, and detailed reporting modules.',
    tech: ['React', 'Tailwind CSS', 'Node.js', 'Chart.js', 'MongoDB'],
    type: 'Website'
  },
  {
    title: 'Restaurant Landing Page',
    desc: 'A premium, immersive landing page for an upscale restaurant brand. Features cinematic scrolling, menu showcase, and reservation integration.',
    tech: ['HTML5', 'CSS3', 'GSAP', 'JavaScript'],
    type: 'Website'
  },
  {
    title: 'Music Festival Poster',
    desc: 'Bold and vibrant promotional poster designed for an annual music festival. The design balances energy with clarity to attract diverse audiences.',
    tech: ['Adobe Photoshop', 'Adobe Illustrator'],
    type: 'Poster Design'
  },
  {
    title: 'Bloom Co. Brand Identity',
    desc: 'Complete brand identity system for Bloom Co., a sustainable lifestyle brand. Includes primary logo, secondary marks, color palette, and usage guidelines.',
    tech: ['Figma', 'Adobe Illustrator'],
    type: 'Logo & Branding'
  },
  {
    title: 'Creative Agency Portfolio',
    desc: 'A bold, animated portfolio website for a design studio. Features page transitions, scroll-triggered animations, and an award-winning layout.',
    tech: ['Next.js', 'Framer Motion', 'Tailwind CSS'],
    type: 'Website'
  },
  {
    title: 'Tech Conference Banner',
    desc: 'A suite of social media visuals and digital banners for a major tech conference. Designed for cross-platform consistency and maximum engagement.',
    tech: ['Canva Pro', 'Adobe Photoshop'],
    type: 'Poster Design'
  }
];

function openModal(idx) {
  const data = modalData[idx];
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');

  content.innerHTML = `
    <div class="modal-content-inner">
      <div class="modal-thumb" style="background:linear-gradient(135deg,rgba(255,190,152,0.3),rgba(244,194,194,0.3));display:flex;align-items:center;justify-content:center;">
        <div style="text-align:center;">
          <div style="font-size:3rem;margin-bottom:8px;">✦</div>
          <span style="font-size:0.8rem;color:var(--text-light);font-weight:600;letter-spacing:0.1em;">${data.type.toUpperCase()}</span>
        </div>
      </div>
      <h3>${data.title}</h3>
      <p>${data.desc}</p>
      <div style="margin:20px 0;">
        <p style="font-size:0.82rem;font-weight:700;color:var(--text-mid);letter-spacing:0.1em;margin-bottom:10px;">TECHNOLOGIES USED</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${data.tech.map(t => `<span style="padding:5px 14px;border-radius:50px;background:rgba(250,128,114,0.1);border:1px solid rgba(250,128,114,0.25);color:var(--sunset);font-size:0.8rem;font-weight:600;">${t}</span>`).join('')}
        </div>
      </div>
      <div style="display:flex;gap:12px;margin-top:24px;">
        <a href="#" class="btn btn-primary" onclick="closeModal();return false;">Live Demo ↗</a>
        <button class="btn btn-outline" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ─── Smooth active nav link ───────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--sunset)' : '';
  });
}, { passive: true });

// ─── Service card entrance animation ─────────────────
const serviceObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.getAttribute('data-delay') || '0');
      setTimeout(() => {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }, delay);
      serviceObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.service-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  serviceObserver.observe(card);
});

const portfolioObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }, i * 100);
      portfolioObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

portfolioCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  portfolioObserver.observe(card);
});
