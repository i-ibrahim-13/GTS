// GTS 2026 - JavaScript
function initCountdown() {
    const d = new Date('March 15, 2026 09:00:00').getTime();
    const e = ['days','hours','minutes','seconds'].map(id => document.getElementById(id));
    setInterval(() => {
        const n = new Date().getTime(), dist = d - n;
        if (dist < 0) return;
        const v = [Math.floor(dist/864e5), Math.floor((dist%864e5)/36e5), Math.floor((dist%36e5)/6e4), Math.floor((dist%6e4)/1e3)];
        e.forEach((el, i) => el.textContent = String(v[i]).padStart(2,'0'));
    }, 1000);
}

function initNav() {
    const nav = document.getElementById('navbar'), toggle = document.getElementById('navToggle'), menu = document.getElementById('navMenu');
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));
    toggle.addEventListener('click', () => { toggle.classList.toggle('active'); menu.classList.toggle('active'); });
    menu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { toggle.classList.remove('active'); menu.classList.remove('active'); }));
}

function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.schedule-day').forEach(d => d.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.day).classList.add('active');
        });
    });
}

function initStats() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const t = +e.target.dataset.target, inc = t/50; let c = 0;
                const timer = setInterval(() => { c += inc; if (c >= t) { e.target.textContent = t+'+'; clearInterval(timer); } else e.target.textContent = Math.floor(c)+'+'; }, 30);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number').forEach(n => obs.observe(n));
}

function initTop() {
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function showNotif(msg, type) {
    const n = document.createElement('div');
    n.innerHTML = `<i class="fas fa-${type==='success'?'check-circle':'exclamation-circle'}"></i><span>${msg}</span>`;
    n.style.cssText = `position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(100px);padding:1rem 1.5rem;background:${type==='success'?'#10b981':'#ef4444'};color:#fff;border-radius:12px;display:flex;align-items:center;gap:.75rem;font-weight:500;box-shadow:0 10px 30px rgba(0,0,0,.2);z-index:10000;transition:transform .3s`;
    document.body.appendChild(n);
    setTimeout(() => n.style.transform = 'translateX(-50%) translateY(0)', 100);
    setTimeout(() => { n.style.transform = 'translateX(-50%) translateY(100px)'; setTimeout(()=>n.remove(),300); }, 3000);
}

function initForms() {
    const cf = document.getElementById('contactForm');
    if (cf) cf.addEventListener('submit', e => {
        e.preventDefault(); const fd = Object.fromEntries(new FormData(cf));
        if (!fd.firstName||!fd.lastName||!fd.email||!fd.message) { showNotif('Please fill required fields.','error'); return; }
        const b = cf.querySelector('button'); b.innerHTML='<span>Sending...</span>'; b.disabled=true;
        setTimeout(()=>{ showNotif('Message sent successfully!','success'); cf.reset(); b.innerHTML='<span>Send Message</span><i class="fas fa-paper-plane"></i>'; b.disabled=false; }, 1500);
    });
    const nf = document.getElementById('newsletterForm');
    if (nf) nf.addEventListener('submit', e => { e.preventDefault(); showNotif('Subscribed!','success'); nf.reset(); });
}

function initScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', function(e) {
        e.preventDefault(); const t = document.querySelector(this.getAttribute('href'));
        if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
    }));
}


function initRegisterForm() {
    const overlay = document.getElementById('registerOverlay');
    const closeBtn = document.getElementById('registerClose');
    const form = document.getElementById('registerForm');
    const successDiv = document.getElementById('registerSuccess');
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    
    // Open registration form
    function openRegister(e) {
        if (e) e.preventDefault();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close registration form
    function closeRegister(e) {
        if (e) e.preventDefault();
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            form.classList.remove('hidden');
            successDiv.classList.remove('active');
            form.reset();
            clearErrors();
        }, 300);
    }
    
    // Clear error messages
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.register-form-group input').forEach(el => el.classList.remove('error'));
    }
    
    // Show field error
    function showError(fieldId, message) {
        const errorEl = document.getElementById('error' + fieldId);
        const inputEl = document.getElementById('reg' + fieldId);
        if (errorEl) errorEl.textContent = message;
        if (inputEl) inputEl.classList.add('error');
    }
    
    // Validate form
    function validateForm() {
        clearErrors();
        let isValid = true;
        
        const fullName = document.getElementById('regFullName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const regNo = document.getElementById('regNo').value.trim();
        
        if (!fullName) {
            showError('FullName', 'Full name is required');
            isValid = false;
        } else if (fullName.length < 3) {
            showError('FullName', 'Name must be at least 3 characters');
            isValid = false;
        }
        
        if (!email) {
            showError('Email', 'Email address is required');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('Email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!phone) {
            showError('Phone', 'Phone number is required');
            isValid = false;
        } else if (!/^[\d\s\-\+\(\)]{7,15}$/.test(phone)) {
            showError('Phone', 'Please enter a valid phone number');
            isValid = false;
        }
        
        if (!regNo) {
            showError('RegNo', 'Registration number is required');
            isValid = false;
        } else if (regNo.length < 3) {
            showError('RegNo', 'Registration number must be at least 3 characters');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const submitBtn = form.querySelector('.register-submit');
        submitBtn.innerHTML = '<span>Processing...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            form.classList.add('hidden');
            successDiv.classList.add('active');
            submitBtn.innerHTML = '<span>Complete Registration</span><i class="fas fa-arrow-right"></i>';
            submitBtn.disabled = false;
        }, 1500);
    }
    
    // Event listeners
    const navRegisterBtn = document.getElementById('navRegisterBtn');
    const heroRegisterBtn = document.getElementById('heroRegisterBtn');
    const pricingRegisterBtns = document.querySelectorAll('.pricing-register-btn');
    const footerRegisterLink = document.querySelector('.footer-register-link');
    
    if (navRegisterBtn) navRegisterBtn.addEventListener('click', openRegister);
    if (heroRegisterBtn) heroRegisterBtn.addEventListener('click', openRegister);
    pricingRegisterBtns.forEach(btn => btn.addEventListener('click', openRegister));
    if (footerRegisterLink) footerRegisterLink.addEventListener('click', openRegister);
    
    if (closeBtn) closeBtn.addEventListener('click', closeRegister);
    if (backToHomeBtn) backToHomeBtn.addEventListener('click', closeRegister);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeRegister();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeRegister();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => { initRegisterForm(); });
document.addEventListener('DOMContentLoaded', () => { initCountdown(); initNav(); initTabs(); initStats(); initTop(); initForms(); initScroll(); });