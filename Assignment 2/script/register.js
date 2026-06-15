/* ══════════════════════════════════════
   MUSIC CONTROL (TERMINAL AUDIO)
══════════════════════════════════════ */
let _musicOn = true;
const SONG_ID = "n--SX54AUZU";

function toggleMusic() {
    const iframe = document.getElementById('bg-music');
    const btn = document.getElementById('music-btn');
    if (!iframe || !btn) return;

    if (_musicOn) {
        iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
        btn.textContent = '♪ OFF';
        btn.style.borderColor = '#1a3a1a';
        btn.style.boxShadow = 'none';
    } else {
        iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1');
        btn.textContent = '♪ MUSIC';
        btn.style.borderColor = '#39ff14';
        btn.style.boxShadow = '0 0 10px #39ff14';
    }
    _musicOn = !_musicOn;
}

document.addEventListener('click', function _initAudio() {
    const iframe = document.getElementById('bg-music');
    if (iframe) {
        const newSrc = `https://www.youtube.com/embed/${SONG_ID}?enablejsapi=1&autoplay=1&mute=0&loop=1&playlist=${SONG_ID}`;
        iframe.src = newSrc;
    }
    console.log("RM_REG_AUDIO: Initialized.");
    document.removeEventListener('click', _initAudio);
}, { once: true });

/* ══════════════════════════════════════
   CLOCK
══════════════════════════════════════ */
function tick(){
    const now = new Date();
    const p = n => String(n).padStart(2, '0');
    const timeEl = document.getElementById('status-time');
    if (timeEl) {
        timeEl.textContent = `${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`;
    }
}
tick();
setInterval(tick, 1000);

/* ══════════════════════════════════════
   PROGRESS STEPS
══════════════════════════════════════ */
function updateSteps(){
    const u = document.getElementById('reg-user').value.trim();
    const e = document.getElementById('reg-email').value.trim();
    const p = document.getElementById('reg-pass').value;
    const c = document.getElementById('reg-confirm').value;
    
    const steps = [
        u.length >= 3,
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),
        p.length >= 6,
        p === c && c.length > 0
    ];
    
    steps.forEach((done, i) => {
        const el = document.getElementById('s' + (i + 1));
        if (el) {
            el.className = 'step' + (done ? ' done active' : i === steps.filter(Boolean).length ? ' active' : '');
        }
    });
}

/* ══════════════════════════════════════
   VALIDATION LOGIC
══════════════════════════════════════ */

function validateUser(){
    const val = document.getElementById('reg-user').value.trim();
    const err = document.getElementById('err-reg-user');
    const ok = document.getElementById('ok-reg-user');
    const inp = document.getElementById('reg-user');
    
    err.classList.remove('show'); ok.classList.remove('show');
    
    if(!val){ 
        err.textContent = '⚠ AGENT ID REQUIRED'; err.classList.add('show'); 
        inp.className = 'invalid'; return false; 
    }
    if(val.length < 3){ 
        err.textContent = '⚠ MINIMUM 3 CHARACTERS'; err.classList.add('show'); 
        inp.className = 'invalid'; return false; 
    }
    if(!/^[a-zA-Z0-9_]+$/.test(val)){ 
        err.textContent = '⚠ LETTERS, NUMBERS AND _ ONLY'; err.classList.add('show'); 
        inp.className = 'invalid'; return false; 
    }

    const agents = JSON.parse(localStorage.getItem('rm_agents') || '[]');
    if(agents.find(a => a.username.toLowerCase() === val.toLowerCase())){
        err.textContent = '⚠ AGENT ID ALREADY TAKEN'; err.classList.add('show'); 
        inp.className = 'invalid'; return false;
    }
    
    ok.textContent = '✓ AGENT ID AVAILABLE'; ok.classList.add('show'); 
    inp.className = 'valid';
    updateSteps(); 
    return true;
}

function validateEmail(){
    const val = document.getElementById('reg-email').value.trim();
    const err = document.getElementById('err-reg-email');
    const ok = document.getElementById('ok-reg-email');
    const inp = document.getElementById('reg-email');
    
    err.classList.remove('show'); ok.classList.remove('show');
    
    if(!val){ err.textContent = '⚠ SECURE CHANNEL REQUIRED'; err.classList.add('show'); inp.className = 'invalid'; return false; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)){ err.textContent = '⚠ INVALID EMAIL FORMAT'; err.classList.add('show'); inp.className = 'invalid'; return false; }
    
    ok.textContent = '✓ CHANNEL VERIFIED'; ok.classList.add('show'); 
    inp.className = 'valid';
    updateSteps(); 
    return true;
}

function validatePass(){
    const val = document.getElementById('reg-pass').value;
    const err = document.getElementById('err-reg-pass');
    const ok = document.getElementById('ok-reg-pass');
    const inp = document.getElementById('reg-pass');
    
    err.classList.remove('show'); ok.classList.remove('show');
    
    let score = 0;
    if(val.length >= 6) score++;
    if(val.length >= 10) score++;
    if(/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if(/[0-9]/.test(val) || /[^a-zA-Z0-9]/.test(val)) score++;
    
    const colors = ['#5a2a2a', '#8a5a1a', '#6a8a1a', '#2a7a2a'];
    const labels = ['WEAK', 'MODERATE', 'STRONG', 'MAX'];
    
    for(let i = 1; i <= 4; i++){
        const seg = document.getElementById('str' + i);
        if (seg) {
            seg.style.background = i <= score ? colors[score - 1] : '#0e1a0e';
            seg.style.boxShadow = i <= score && score >= 3 ? `0 0 4px ${colors[score - 1]}` : 'none';
        }
    }
    
    if(!val){ err.textContent = '⚠ ACCESS KEY REQUIRED'; err.classList.add('show'); inp.className = 'invalid'; return false; }
    if(val.length < 6){ err.textContent = '⚠ MINIMUM 6 CHARACTERS'; err.classList.add('show'); inp.className = 'invalid'; return false; }
    
    ok.textContent = `✓ STRENGTH: ${labels[score - 1] || 'WEAK'}`; ok.classList.add('show'); 
    inp.className = 'valid';
    updateSteps(); 
    return true;
}

function validateConfirm(){
    const pass = document.getElementById('reg-pass').value;
    const val = document.getElementById('reg-confirm').value;
    const err = document.getElementById('err-reg-confirm');
    const ok = document.getElementById('ok-reg-confirm');
    const inp = document.getElementById('reg-confirm');
    
    err.classList.remove('show'); ok.classList.remove('show');
    
    if(!val){ err.textContent = '⚠ PLEASE CONFIRM ACCESS KEY'; err.classList.add('show'); inp.className = 'invalid'; return false; }
    if(val !== pass){ err.textContent = '⚠ ACCESS KEYS DO NOT MATCH'; err.classList.add('show'); inp.className = 'invalid'; return false; }
    
    ok.textContent = '✓ KEYS MATCH'; ok.classList.add('show'); 
    inp.className = 'valid';
    updateSteps(); 
    return true;
}

/* ══════════════════════════════════════
   REGISTER ACTION
══════════════════════════════════════ */
function doRegister(){
    const uOk = validateUser();
    const eOk = validateEmail();
    const pOk = validatePass();
    const cOk = validateConfirm();
    const fb = document.getElementById('reg-fb');
    
    if(!uOk || !eOk || !pOk || !cOk){
        fb.textContent = '// REGISTRATION FAILED — FIX ERRORS ABOVE';
        fb.className = 'err'; return;
    }
    
    const username = document.getElementById('reg-user').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-pass').value;
    
    const agents = JSON.parse(localStorage.getItem('rm_agents') || '[]');
    agents.push({username, email, password, registered: new Date().toISOString()});
    localStorage.setItem('rm_agents', JSON.stringify(agents));
    
    fb.textContent = '// AGENT PROFILE CREATED SUCCESSFULLY';
    fb.className = 'ok';
    
    setTimeout(() => {
        const msg = document.getElementById('success-msg');
        const ov = document.getElementById('success-overlay');
        if (msg) msg.textContent = `AGENT "${username.toUpperCase()}" HAS BEEN REGISTERED`;
        if (ov) ov.classList.add('show');
        setTimeout(() => window.location.href = 'login.html', 2500);
    }, 600);
}

/* ENTER KEY */
document.addEventListener('keydown', e => { if(e.key === 'Enter') doRegister(); });