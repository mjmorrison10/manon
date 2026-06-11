// Manon - Interactive Scripts

const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
mobileToggle.addEventListener('click', () => { navLinks.classList.toggle('active'); mobileToggle.classList.toggle('active'); });
navLinks.querySelectorAll('a').forEach(link => { link.addEventListener('click', () => { navLinks.classList.remove('active'); mobileToggle.classList.remove('active'); }); });

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });

document.querySelectorAll('a[href^="#"]').forEach(anchor => { anchor.addEventListener('click', function(e) { e.preventDefault(); const t = document.querySelector(this.getAttribute('href')); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); });

const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() { const s = window.pageYOffset || document.documentElement.scrollTop; scrollProgress.style.width = (s / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100 + '%'; }
window.addEventListener('scroll', updateScrollProgress);

const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => { backToTop.classList.toggle('visible', window.scrollY > 400); });
backToTop.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

function animateCounter(el, target, dur) { const st = performance.now(); function up(ct) { const p = Math.min((ct - st) / dur, 1); const ep = 1 - Math.pow(1 - p, 3); el.textContent = (target >= 1000 ? Math.floor(ep * target).toLocaleString() : Math.floor(ep * target)) + '+'; if (p < 1) requestAnimationFrame(up); } requestAnimationFrame(up); }
function fadeInEl(el) { el.style.opacity = '0'; el.style.transform = 'scale(0.5)'; el.style.transition = 'all 0.6s ease'; requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'scale(1)'; }); }

const statsObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { const el = entry.target; const c = el.getAttribute('data-count'); if (c !== null) { const t = parseInt(c, 10); if (!isNaN(t) && t > 0) { el.classList.add('counting'); animateCounter(el, t, 2000); } else fadeInEl(el); } statsObserver.unobserve(el); } }); }, { threshold: 0.5 });
document.querySelectorAll('.stats-number[data-count]').forEach(el => statsObserver.observe(el));

const obs = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { const p = entry.target.parentElement; const sibs = Array.from(p.children).filter(c => c.classList.contains('service-card') || c.classList.contains('review-card') || c.classList.contains('why-feature') || c.classList.contains('detail-card')); entry.target.style.animationDelay = (sibs.indexOf(entry.target) * 0.1) + 's'; entry.target.classList.add('animate-in'); obs.unobserve(entry.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.service-card, .review-card, .why-feature, .detail-card').forEach(el => { el.style.opacity = '0'; obs.observe(el); });

const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => { const s = window.pageYOffset; const h = document.querySelector('.hero').offsetHeight; if (s < h) heroContent.style.transform = `translateY(${s * 0.3}px)`; });

(function() { const c = document.getElementById('heroParticles'); if (!c) return; for (let i = 0; i < 20; i++) { const p = document.createElement('div'); p.classList.add('hero-particle'); p.style.left = Math.random() * 100 + '%'; p.style.top = Math.random() * 100 + '%'; p.style.animationDelay = Math.random() * 4 + 's'; p.style.animationDuration = (3 + Math.random() * 3) + 's'; const sz = (4 + Math.random() * 6) + 'px'; p.style.width = sz; p.style.height = sz; c.appendChild(p); } })();

let asi = null;
function startAS() { const g = document.getElementById('reviewsGrid'); if (!g || window.innerWidth >= 768) return; let d = 1; asi = setInterval(() => { const m = g.scrollWidth - g.clientWidth; if (g.scrollLeft >= m - 2) d = -1; else if (g.scrollLeft <= 2) d = 1; g.scrollLeft += d; }, 30); }
function stopAS() { if (asi) { clearInterval(asi); asi = null; } }
const rg = document.getElementById('reviewsGrid');
if (rg) { rg.addEventListener('touchstart', stopAS); rg.addEventListener('touchend', () => { setTimeout(() => { if (window.innerWidth < 768) startAS(); }, 3000); }); }
window.addEventListener('resize', () => { if (window.innerWidth < 768) { if (!asi) startAS(); } else stopAS(); }); if (window.innerWidth < 768) startAS();

const contactForm = document.getElementById('contactForm');
const formFields = contactForm.querySelectorAll('input, select, textarea');
formFields.forEach(f => { f.addEventListener('input', function() { this.closest('.form-group').classList.toggle('valid', this.value.trim().length > 0); }); f.addEventListener('blur', function() { if (this.hasAttribute('required') && !this.value.trim()) this.closest('.form-group').classList.remove('valid'); }); });

contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); const d = Object.fromEntries(new FormData(this).entries());
    const subj = encodeURIComponent('Contact from Manon Website');
    const body = encodeURIComponent(`Name: ${d.name}\nPhone: ${d.phone || 'N/A'}\nEmail: ${d.email || 'N/A'}\nInterest: ${d.interest || 'N/A'}\nMessage: ${d.message || 'N/A'}\n\nPlease get back to me.`);
    window.location.href = `mailto:info@manonboutique.com?subject=${subj}&body=${body}`;
    const btn = this.querySelector('button[type="submit"]'); const ot = btn.innerHTML; btn.innerHTML = '&#10003; Message Sent!'; btn.style.background = '#10b981'; btn.style.borderColor = '#10b981';
    setTimeout(() => { btn.innerHTML = ot; btn.style.background = ''; btn.style.borderColor = ''; this.reset(); formFields.forEach(f => f.closest('.form-group').classList.remove('valid')); }, 3000);
});

setTimeout(() => { document.querySelectorAll('.hero-ctas .btn').forEach(b => b.classList.add('btn-pulse')); }, 3000);

const sections = document.querySelectorAll('section[id]'); const navList = document.querySelectorAll('.nav-links a[data-section]');
function updateNav() { const sp = window.scrollY + 120; sections.forEach(s => { const t = s.offsetTop; const h = s.offsetHeight; const id = s.id; if (sp >= t && sp < t + h) navList.forEach(l => { l.classList.toggle('active-section', l.getAttribute('data-section') === id); }); }); }
window.addEventListener('scroll', updateNav); updateNav();

document.querySelectorAll('a[href^="tel:"]').forEach(l => l.addEventListener('click', () => { if (typeof gtag === 'function') gtag('event', 'click_to_call', { business: 'Manon' }); }));

window.addEventListener('load', () => {
    ['.hero-badge', '.hero h1', '.hero-sub', '.hero-ctas', '.hero-trust'].forEach((sel, i) => {
        const el = document.querySelector(sel); if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; setTimeout(() => { el.style.transition = 'all 0.6s ease'; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 200 + i * 200); }
    }); updateScrollProgress();
});
