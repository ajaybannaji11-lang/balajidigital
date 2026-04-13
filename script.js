/* ============================================
   BALAJI DIGITAL ADS — script.js
   Login System + Nav + Animations
   ============================================ */

const WA_NUMBER = '918989593938';

/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
if (navbar) window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

/* ─── HAMBURGER ─── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
const overlay = document.getElementById('mobileOverlay');

function openMenu() { navLinksEl.classList.add('open'); hamburger.classList.add('open'); overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeMenu() { navLinksEl.classList.remove('open'); hamburger.classList.remove('open'); overlay.classList.remove('active'); document.body.style.overflow = ''; }

if (hamburger) hamburger.addEventListener('click', () => navLinksEl.classList.contains('open') ? closeMenu() : openMenu());
if (overlay) overlay.addEventListener('click', closeMenu);
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 600) closeMenu(); });

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── COUNTER ANIMATION ─── */
function animateCounter(el, target, dur = 1500) {
    let v = 0, step = target / (dur / 16);
    const t = setInterval(() => { v += step; if (v >= target) { el.textContent = target + '+'; clearInterval(t); return; } el.textContent = Math.floor(v) + '+'; }, 16);
}
const statNums = document.querySelectorAll('.stat-num');
const targets = [500, 200, 3];
if (statNums.length) {
    const so = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => { if (e.isIntersecting) { animateCounter(e.target, targets[i]); so.unobserve(e.target); } });
    }, { threshold: 0.5 });
    statNums.forEach((el, i) => { el.textContent = '0+'; so.observe(el); });
}

/* ─── LOGIN SYSTEM ─── */
function getUsers() { try { return JSON.parse(localStorage.getItem('bd_users') || '{}'); } catch { return {}; } }
function saveUsers(u) { localStorage.setItem('bd_users', JSON.stringify(u)); }
function getCurrentUser() { try { return JSON.parse(localStorage.getItem('bd_current') || 'null'); } catch { return null; } }
function setCurrentUser(u) { localStorage.setItem('bd_current', JSON.stringify(u)); }

function openLogin(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.add('open');
}
function closeLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.remove('open');
}
function modalOutsideClick(e) {
    if (e.target === document.getElementById('loginModal')) closeLogin();
}
function switchTab(tab) {
    document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
    document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
    document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
}

function doLogin() {
    const name = document.getElementById('loginName').value.trim();
    const pass = document.getElementById('loginPass').value;
    const err = document.getElementById('loginErr');
    if (!name || !pass) { err.textContent = 'Naam aur password dono bharo.'; return; }
    const users = getUsers();
    if (!users[name.toLowerCase()]) { err.textContent = 'User nahi mila. Register karein.'; return; }
    if (users[name.toLowerCase()].pass !== pass) { err.textContent = 'Password galat hai.'; return; }
    setCurrentUser({ name: users[name.toLowerCase()].displayName, phone: users[name.toLowerCase()].phone });
    err.textContent = '';
    closeLogin();
    updateNavAuth();
    showWelcome();
}

function doRegister() {
    const name = document.getElementById('regName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const pass = document.getElementById('regPass').value;
    const err = document.getElementById('regErr');
    if (!name || !pass) { err.textContent = 'Naam aur password zaroor bharo.'; return; }
    if (pass.length < 4) { err.textContent = 'Password kam se kam 4 characters ka hona chahiye.'; return; }
    const users = getUsers();
    if (users[name.toLowerCase()]) { err.textContent = 'Ye naam already registered hai. Login karein.'; return; }
    users[name.toLowerCase()] = { displayName: name, phone, pass };
    saveUsers(users);
    setCurrentUser({ name, phone });
    err.textContent = '';
    closeLogin();
    updateNavAuth();
    showWelcome();
}

function doLogout() {
    localStorage.removeItem('bd_current');
    updateNavAuth();
    const hw = document.getElementById('heroWelcome');
    if (hw) hw.style.display = 'none';
}

function updateNavAuth() {
    const area = document.getElementById('navAuthArea');
    if (!area) return;
    const user = getCurrentUser();
    if (user) {
        area.innerHTML = `<span class="nav-user-btn" style="color:var(--white);font-size:0.82rem;font-weight:600;background:rgba(128,0,32,0.3);border:1px solid rgba(128,0,32,0.5);padding:7px 16px;border-radius:50px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;" onclick="doLogout()">👤 ${user.name.split(' ')[0]} &nbsp;·&nbsp; Logout</span>`;
    } else {
        area.innerHTML = `<a href="#" class="nav-cta" id="navLoginBtn" onclick="openLogin(event)">Login</a>`;
    }
}

function showWelcome() {
    const user = getCurrentUser();
    const hw = document.getElementById('heroWelcome');
    const un = document.getElementById('heroUserName');
    if (hw && un && user) {
        un.textContent = user.name.split(' ')[0];
        hw.style.display = 'inline-flex';
    }
}

/* Init on load */
document.addEventListener('DOMContentLoaded', () => {
    updateNavAuth();
    showWelcome();
});
