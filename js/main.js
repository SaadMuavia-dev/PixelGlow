/* ============================================================
   GlowPixel — main.js
   Illustrator, Graphic Designer & Book Designer Portfolio
   ============================================================ */

// ── AOS Init
AOS.init({ once: true, easing: 'ease-out-cubic', offset: 60 });

// ── Scroll Progress Bar
const progressBar = document.getElementById('scrollProgress');
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
  if (backTop) backTop.classList.toggle('visible', scrollTop > 400);
});

// ── Custom Cursor removed

// ── Floating Particles Canvas
function initParticles() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;';
  hero.insertBefore(canvas, hero.firstChild);
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COLORS = ['rgba(192,57,43,', 'rgba(184,134,11,', 'rgba(255,255,255,'];

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 2.5 + .5;
    this.vx = (Math.random() - .5) * .4;
    this.vy = (Math.random() - .5) * .4;
    this.alpha = Math.random() * .5 + .1;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  Particle.prototype.update = function() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0) this.x = W; if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H; if (this.y > H) this.y = 0;
  };

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  // Draw connecting lines between nearby particles
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      const p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(192,57,43,' + (0.06 * (1 - dist / 100)) + ')';
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}
initParticles();

// ── Counter animation
function animateCount(el, target, suffix, duration) {
  let start = 0, step = target / (duration / 16);
  const t = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start) + suffix;
    if (start >= target) clearInterval(t);
  }, 16);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const s1 = document.getElementById('stat1');
      const s2 = document.getElementById('stat2');
      const s3 = document.getElementById('stat3');
      if (s1) animateCount(s1, 340, '+', 1800);
      if (s2) animateCount(s2, 180, '+', 1600);
      if (s3) animateCount(s3, 12,  '',  1200);
      counterObs.disconnect();
    }
  });
}, { threshold: .4 });
const stat1El = document.getElementById('stat1');
if (stat1El) counterObs.observe(stat1El);

// ── Skill bars animation
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.skill-fill').forEach((bar, i) => {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, i * 150);
      });
      skillObs.disconnect();
    }
  });
}, { threshold: .3 });
const firstSkill = document.querySelector('.skill-row');
if (firstSkill) skillObs.observe(firstSkill);

// ── Portfolio filter (visual only)
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── Parallax hero blobs + tilt effect
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const blobRed  = document.querySelector('.blob-red');
  const blobGold = document.querySelector('.blob-gold');
  if (blobRed)  blobRed.style.transform  = `translateY(${y * 0.15}px)`;
  if (blobGold) blobGold.style.transform = `translateY(${-y * 0.1}px)`;
});

// ── Mouse tilt on portfolio items
document.querySelectorAll('.portfolio-item').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top)  / rect.height - .5;
    card.style.transform = `perspective(500px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(10px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ── Navbar scroll style
const navbar = document.querySelector('nav.navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.style.boxShadow = window.scrollY > 50 ? '0 2px 20px rgba(0,0,0,.18)' : 'none';
});

// ── Typing effect for hero eyebrow
(function typeEffect() {
  const el = document.querySelector('.hero-eyebrow');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  let i = 0;
  const iv = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(iv);
  }, 55);
})();

// ── Ripple effect on primary buttons
document.querySelectorAll('.btn-hero-primary, .btn-submit, .btn-cta-white').forEach(btn => {
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.addEventListener('click', function(e) {
    const r = document.createElement('span');
    const d = Math.max(btn.offsetWidth, btn.offsetHeight);
    const rect = btn.getBoundingClientRect();
    r.style.cssText = `
      position:absolute;border-radius:50%;background:rgba(255,255,255,.3);
      width:${d}px;height:${d}px;
      left:${e.clientX - rect.left - d/2}px;top:${e.clientY - rect.top - d/2}px;
      transform:scale(0);animation:ripple .6s linear;pointer-events:none;
    `;
    btn.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });
});
// Inject ripple keyframes once
if (!document.getElementById('ripple-style')) {
  const s = document.createElement('style');
  s.id = 'ripple-style';
  s.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0;}}';
  document.head.appendChild(s);
}

// ── FAQ accordion (contact page)
document.querySelectorAll('.faq-q').forEach(q => {
  const a = q.nextElementSibling;
  if (!a) return;
  a.style.cssText = 'overflow:hidden;transition:max-height .35s ease,opacity .3s;max-height:200px;opacity:1;';
  let open = true;
  q.style.cursor = 'pointer';
  q.addEventListener('click', () => {
    open = !open;
    a.style.maxHeight  = open ? '200px' : '0';
    a.style.opacity    = open ? '1' : '0';
    q.style.color      = open ? 'var(--ink)' : 'var(--red-vivid)';
  });
});

// ============================================================
//  SECURITY: Input sanitisation helper (XSS prevention)
// ============================================================
function sanitizeInput(str) {
  const map = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;','/':'&#x2F;' };
  return String(str).replace(/[&<>"'/]/g, m => map[m]);
}

// Rate-limit helper — max N submissions per window (ms)
function makeRateLimiter(max, windowMs) {
  const key = 'gp_rl_ts';
  return function() {
    const now = Date.now();
    let arr;
    try { arr = JSON.parse(sessionStorage.getItem(key) || '[]'); } catch { arr = []; }
    arr = arr.filter(t => now - t < windowMs);
    if (arr.length >= max) return false;
    arr.push(now);
    try { sessionStorage.setItem(key, JSON.stringify(arr)); } catch {}
    return true;
  };
}
const checkRate = makeRateLimiter(3, 60000); // 3 submissions per minute

// ── Honeypot field injection (bot trap)
(function injectHoneypot() {
  document.querySelectorAll('.row.g-3').forEach(form => {
    const hp = document.createElement('div');
    hp.style.cssText = 'position:absolute;left:-9999px;opacity:0;pointer-events:none;';
    hp.innerHTML = '<input type="text" name="website" tabindex="-1" autocomplete="off" data-honeypot="1">';
    form.appendChild(hp);
  });
})();

// ── CSRF token (client-side, shown in header on send)
function genCSRFToken() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
}
const csrfToken = genCSRFToken();

// ============================================================
//  FORM VALIDATION & SECURE SUBMIT
// ============================================================
function showFieldError(field, msg) {
  field.style.borderColor = '#C0392B';
  field.style.boxShadow   = '0 0 0 3px rgba(192,57,43,.15)';
  let err = field.parentElement.querySelector('.field-error');
  if (!err) {
    err = document.createElement('p');
    err.className = 'field-error';
    err.style.cssText = 'color:#C0392B;font-size:.72rem;margin-top:.3rem;';
    field.parentElement.appendChild(err);
  }
  err.textContent = msg;
}
function clearFieldError(field) {
  field.style.borderColor = '';
  field.style.boxShadow   = '';
  const err = field.parentElement.querySelector('.field-error');
  if (err) err.remove();
}

function validateContactForm(container) {
  const nameEl    = container.querySelector('input[placeholder*="Jane"], input[placeholder*="Smith"], input[type="text"]');
  const emailEl   = container.querySelector('input[type="email"]');
  const projectEl = container.querySelector('select');
  const msgEl     = container.querySelector('textarea');
  const honeypot  = container.querySelector('[data-honeypot="1"]');

  // Honeypot check
  if (honeypot && honeypot.value) return false;

  let valid = true;

  // Name validation
  if (nameEl) {
    clearFieldError(nameEl);
    const v = nameEl.value.trim();
    if (!v) { showFieldError(nameEl, 'Name is required.'); valid = false; }
    else if (v.length < 2) { showFieldError(nameEl, 'Name must be at least 2 characters.'); valid = false; }
    else if (!/^[a-zA-Z\s'\-\.]+$/.test(v)) { showFieldError(nameEl, 'Name contains invalid characters.'); valid = false; }
  }

  // Email validation
  if (emailEl) {
    clearFieldError(emailEl);
    const v = emailEl.value.trim();
    if (!v) { showFieldError(emailEl, 'Email address is required.'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { showFieldError(emailEl, 'Please enter a valid email address.'); valid = false; }
    else if (v.length > 254) { showFieldError(emailEl, 'Email address is too long.'); valid = false; }
  }

  // Project type
  if (projectEl) {
    clearFieldError(projectEl);
    if (!projectEl.value) { showFieldError(projectEl, 'Please select a project type.'); valid = false; }
  }

  // Message validation
  if (msgEl) {
    clearFieldError(msgEl);
    const v = msgEl.value.trim();
    if (!v) { showFieldError(msgEl, 'Please describe your project — this field cannot be empty.'); valid = false; }
    else if (v.length < 10) { showFieldError(msgEl, 'Please provide at least 10 characters about your project.'); valid = false; }
    else if (v.length > 5000) { showFieldError(msgEl, 'Message is too long (max 5000 characters).'); valid = false; }
  }

  return valid;
}

// ── Main submit handler (called by button onclick)
function handleSubmit(btn) {
  const container = btn.closest('.row, form') || btn.closest('div');

  // Rate limit check
  if (!checkRate()) {
    btn.textContent = '⚠ Too many submissions. Please wait a minute.';
    btn.style.background = '#7B1FA2';
    return;
  }

  if (!validateContactForm(container)) return;

  // Sanitize visible outputs
  const emailEl = container.querySelector('input[type="email"]');
  if (emailEl) sanitizeInput(emailEl.value);

  // Simulate sending with loading state
  btn.disabled = true;
  btn.innerHTML = '<span style="display:inline-block;animation:spin .8s linear infinite;">⟳</span> Sending…';
  if (!document.getElementById('spin-style')) {
    const s = document.createElement('style');
    s.id = 'spin-style';
    s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
    document.head.appendChild(s);
  }

  // Add CSRF token as data attribute (would be sent as header in real fetch)
  btn.dataset.csrfToken = csrfToken;

  setTimeout(() => {
    btn.innerHTML = '✓ Message Sent — I\'ll be in touch shortly.';
    btn.style.background = '#1B4332';
    btn.style.transform   = 'none';
    // Clear form fields
    const fields = container.querySelectorAll('input, textarea, select');
    fields.forEach(f => { if (f.type !== 'submit') f.value = ''; });
  }, 1200);
}

// ── Live character counter for textarea
document.querySelectorAll('textarea.form-control-dark').forEach(ta => {
  const counter = document.createElement('p');
  counter.style.cssText = 'font-size:.7rem;color:var(--muted-light,#9A9A9A);text-align:right;margin-top:.25rem;';
  counter.textContent = '0 / 5000';
  ta.parentElement.appendChild(counter);
  ta.addEventListener('input', () => {
    const len = ta.value.length;
    counter.textContent = len + ' / 5000';
    counter.style.color = len > 4500 ? '#C0392B' : 'var(--muted-light,#9A9A9A)';
  });
});

// ── Real-time inline validation on blur
document.querySelectorAll('.form-control-dark').forEach(field => {
  field.addEventListener('blur', () => {
    if (!field.value.trim() && field.required) {
      showFieldError(field, 'This field is required.');
    } else {
      clearFieldError(field);
      if (field.type === 'email' && field.value) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(field.value.trim())) {
          showFieldError(field, 'Please enter a valid email address.');
        }
      }
    }
  });
  field.addEventListener('input', () => {
    if (field.value.trim()) clearFieldError(field);
  });
});

// ── Prevent paste of scripts in form fields (XSS guard)
document.querySelectorAll('.form-control-dark').forEach(field => {
  field.addEventListener('paste', e => {
    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    if (/<script|javascript:|on\w+\s*=/i.test(pasted)) {
      e.preventDefault();
      showFieldError(field, 'Invalid content detected.');
    }
  });
});

// ── Newsletter footer form validation
document.querySelectorAll('.form-control-dark[placeholder="your@email.com"]').forEach(emailInput => {
  const btn = emailInput.nextElementSibling;
  if (!btn) return;
  btn.addEventListener('click', () => {
    const v = emailInput.value.trim();
    if (!v) { emailInput.style.borderColor='#C0392B'; emailInput.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      emailInput.style.borderColor='#C0392B'; emailInput.focus(); return;
    }
    emailInput.style.borderColor = '#1B4332';
    btn.innerHTML = '✓';
    btn.style.background = '#1B4332';
    emailInput.value = '';
    setTimeout(() => {
      btn.innerHTML = '<i class="bi bi-arrow-right"></i>';
      btn.style.background = 'var(--red-vivid)';
      emailInput.style.borderColor = '';
    }, 3000);
  });
});

// ── Floating label effect for form inputs
document.querySelectorAll('.form-control-dark').forEach(input => {
  input.addEventListener('focus', () => {
    input.style.borderColor = 'var(--red-vivid)';
    input.style.boxShadow   = '0 0 0 3px rgba(192,57,43,.08)';
  });
  input.addEventListener('blur', () => {
    if (!input.closest('.field-error') && !input.parentElement.querySelector('.field-error')) {
      input.style.borderColor = '';
      input.style.boxShadow   = '';
    }
  });
});

// ── Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Number ticker for hero stats on scroll
(function heroTicker() {
  const items = document.querySelectorAll('.hero-title + * + * [style*="1.8rem"]');
  items.forEach(el => {
    const match = el.textContent.match(/(\d+)/);
    if (!match) return;
    const target = parseInt(match[1]);
    const suffix = el.textContent.replace(/\d+/, '').trim();
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { animateCount(el, target, suffix, 1500); obs.disconnect(); }
    }, { threshold: .5 });
    obs.observe(el);
  });
})();

