
let _musicOn = true;

function toggleMusic() {
    const iframe = document.getElementById('bg-music');
    const btn = document.getElementById('music-btn');
    if (!iframe || !btn) return;

    if (_musicOn) {
        iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
        btn.textContent = '♪ OFF';
        btn.classList.add('music-off');
        btn.style.borderColor = '#1a3a1a';
        btn.style.boxShadow = 'none';
    } else {
        iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1');
        btn.textContent = '♪ MUSIC';
        btn.classList.remove('music-off');
        btn.style.borderColor = '#39ff14';
        btn.style.boxShadow = '0 0 10px #39ff14';
    }
    _musicOn = !_musicOn;
}


document.addEventListener('click', function _startMusic() {
    const iframe = document.getElementById('bg-music');
    if (iframe) {
        // Appending a timestamp forces the iframe to reload and respect the autoplay=1 param
        const currentSrc = iframe.src;
        if (!currentSrc.includes('autoplay=1')) {
            iframe.src = currentSrc + "&autoplay=1&t=" + new Date().getTime();
        } else {
            iframe.src = currentSrc + "&t=" + new Date().getTime();
        }
    }
    console.log("Terminal Audio Initialized...");
    // Remove listener so it only runs once
    document.removeEventListener('click', _startMusic);
}, { once: true });

/* ══════════════════════════════════════
   LOGIN LOGIC
══════════════════════════════════════ */
function doLogin() {
    const userEl = document.getElementById('username');
    const passEl = document.getElementById('password');
    const fb = document.getElementById('login-fb');
    
    const user = userEl.value.trim();
    const pass = passEl.value.trim();
    let valid = true;

    // Reset UI
    document.querySelectorAll('.field-err').forEach(el => el.classList.remove('show'));
    fb.textContent = '';
    fb.className = 'cfb';

    if (!user) { 
        document.getElementById('err-user').classList.add('show'); 
        valid = false; 
    }
    if (!pass) { 
        document.getElementById('err-pass').classList.add('show'); 
        valid = false; 
    }
    if (!valid) return;

    // Check agents
    const agents = JSON.parse(localStorage.getItem('rm_agents') || '[]');
    const found = agents.find(a => a.username.toLowerCase() === user.toLowerCase() && a.password === pass);

    if (found) {
        fb.textContent = '// ID_VERIFIED';
        fb.className = 'cfb ok';
        localStorage.setItem('rm_current', JSON.stringify(found));
        
        setTimeout(() => {
            const ov = document.getElementById('success-overlay');
            const sn = document.getElementById('success-name');
            if(sn) sn.textContent = `WELCOME, AGENT ${found.username.toUpperCase()}`;
            if(ov) ov.classList.add('show');
            
            setTimeout(() => window.location.href = 'rm.html', 1500);
        }, 500);
    } else {
        fb.textContent = '// INVALID_ACCESS_KEY';
        fb.className = 'cfb err';
        [userEl, passEl].forEach(el => {
            el.style.borderColor = '#ff3131';
            el.style.boxShadow = '0 0 15px #ff3131';
        });
        setTimeout(() => [userEl, passEl].forEach(el => {
            el.style.borderColor = '';
            el.style.boxShadow = '';
        }), 1000);
    }
}