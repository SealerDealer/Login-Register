function goToHintPage() {
  window.location.href = 'hint.html';
}
/* ══════════════════════════════════════
    GLOBAL CONFIG & STYLES
══════════════════════════════════════ */
const ALL_MODALS = ['clock', 'pc', 'calc', 'door', 'sun', 'rug', 'window', 'hint'];
let curModal = null;

// Shake effect for incorrect codes
const _shakeStyle = document.createElement('style');
_shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{ transform:translateX(0) }
    20%     { transform:translateX(-8px) }
    40%     { transform:translateX(8px) }
    60%     { transform:translateX(-5px) }
    80%     { transform:translateX(5px) }
  }
`;
document.head.appendChild(_shakeStyle);

/* ══════════════════════════════════════
    CLOCK LOGIC
══════════════════════════════════════ */
function moveClock() {
  const now = new Date();
  const s = now.getSeconds();
  const m = now.getMinutes();
  const h = now.getHours() % 12;
  const cx = 1000, cy = 95;

  function setHand(id, deg, len) {
    const rad = (deg - 90) * Math.PI / 180;
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute('x1', cx);
    el.setAttribute('y1', cy);
    el.setAttribute('x2', cx + Math.cos(rad) * len);
    el.setAttribute('y2', cy + Math.sin(rad) * len);
  }

  setHand('hand-h', h * 30 + m * 0.5, 28);
  setHand('hand-m', m * 6  + s * 0.1, 43);
  setHand('hand-s', s * 6,             46);

  const pad = n => String(n).padStart(2, '0');
  const t = document.getElementById('modal-clock-t');
  if (t) t.textContent = `${pad(now.getHours())}:${pad(m)}:${pad(s)}`;
}
setInterval(moveClock, 1000);
moveClock();

/* ══════════════════════════════════════
    CALCULATOR (CORE CALCULATION)
══════════════════════════════════════ */
let calcCurrent  = '0';
let calcPrev     = '';
let calcOperator = '';
let calcNewNum   = false;

function updateDisplay(val) {
  const d = document.getElementById('calc-display');
  if (!d) return;
  const str = String(val);
  d.textContent = str.length > 12 ? parseFloat(val).toExponential(4) : str;
}

function calcInput(num) {
  if (calcNewNum) { calcCurrent = num; calcNewNum = false; } 
  else { calcCurrent = calcCurrent === '0' ? num : calcCurrent + num; }
  updateDisplay(calcCurrent);
}

function calcDot() {
  if (calcNewNum) { calcCurrent = '0.'; calcNewNum = false; return; }
  if (!calcCurrent.includes('.')) calcCurrent += '.';
  updateDisplay(calcCurrent);
}

function calcExp() {
  if (!calcCurrent.includes('e')) calcCurrent += 'e';
  updateDisplay(calcCurrent);
}

function calcOp(op) {
  if (calcOperator && !calcNewNum) calcEquals();
  calcPrev = calcCurrent;
  calcOperator = op;
  calcNewNum = true;
  document.querySelectorAll('.cb.op').forEach(b => b.style.background = '');
}

function calcEquals() {
  if (!calcOperator || !calcPrev) return;
  const a = parseFloat(calcPrev);
  const b = parseFloat(calcCurrent);
  let result;
  switch (calcOperator) {
    case '/': result = b !== 0 ? a / b : 'ERR'; break;
    case '*': result = a * b; break;
    case '+': result = a + b; break;
    case '-': result = a - b; break;
  }
  calcCurrent = String(result);
  calcOperator = '';
  calcPrev = '';
  calcNewNum = true;
  updateDisplay(result);
}

function calcClear() {
  calcCurrent = '0'; calcPrev = ''; calcOperator = ''; calcNewNum = false;
  updateDisplay('0');
}

/* ══════════════════════════════════════
    MODAL SYSTEM
══════════════════════════════════════ */
function openModal(id) {
  const overlay = document.getElementById('overlay');
  overlay.classList.add('show');
  
  ALL_MODALS.forEach(k => {
    const el = document.getElementById('m-' + k);
    if (el) el.style.display = (k === id) ? 'block' : 'none';
  });
  
  curModal = id;
  if (id === 'door') initCode();
}

function closeModal() {
  // Lock the overlay if the player is on the Win Screen
  if (curModal === 'win') return;

  document.getElementById('overlay').classList.remove('show');
  curModal = null;
}

document.getElementById('overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('overlay')) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

document.querySelectorAll('.hotspot').forEach(el => {
  el.addEventListener('mouseenter', () => {
    const match = (el.getAttribute('onclick') || '').match(/openModal\('(\w+)'\)/);
    if (match) {
      const g = document.getElementById('glow-' + match[1]);
      if (g) g.style.opacity = '1';
    }
  });

  el.addEventListener('mouseleave', () => {
    ['clock', 'pc', 'calc', 'door', 'sun', 'rug', 'window'].forEach(k => {
      const g = document.getElementById('glow-' + k);
      if (g) g.style.opacity = '0';
    });
  });
});

/* ══════════════════════════════════════
    DOOR KEYPAD & WIN LOGIC
══════════════════════════════════════ */
const CORRECT = 'AURUM';
const CODE_LEN = 5;
let codeVal = '';

function initCode() {
  codeVal = '';
  renderCode();
  const fb = document.getElementById('cfb');
  fb.textContent = '';
  fb.className = 'cfb';
  setTimeout(() => { document.getElementById('code-inp').focus(); }, 80);
}

function renderCode() {
  const d = document.getElementById('code-display');
  if (!d) return;
  d.innerHTML = '';
  for (let i = 0; i < CODE_LEN; i++) {
    const c = document.createElement('div');
    c.className = 'cc' + (i === codeVal.length && codeVal.length < CODE_LEN ? ' active' : '');
    c.textContent = codeVal[i] || '';
    d.appendChild(c);
  }
}

const _codeInp = document.getElementById('code-inp');
if (_codeInp) {
  _codeInp.addEventListener('input', function() {
    const raw = this.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, CODE_LEN);
    codeVal = raw;
    this.value = raw;
    renderCode();
  });
}

// Dedicated Win Function
function triggerWin() {
  // close the door modal first
  closeModal();
  
  // show the win screen directly (it's outside overlay)
  setTimeout(() => {
    document.getElementById('win').classList.add('show');
  }, 400);
}

function submitCode() {
  const fb = document.getElementById('cfb');
  if (!codeVal) { fb.textContent = '// ENTER A CODE'; fb.className = 'cfb err'; return; }

  if (codeVal.toUpperCase() === CORRECT) {
    fb.textContent = '// ACCESS GRANTED';
    fb.className = 'cfb ok';
    
    // Update the SVG visual state
    const bg = document.getElementById('keypad-ok-bg');
    const txt = document.getElementById('keypad-ok-txt');
    if (bg) bg.setAttribute('opacity', '.9');
    if (txt) txt.setAttribute('opacity', '1');

    // Trigger Win sequence after a dramatic pause
    setTimeout(triggerWin, 1200);
  } else {
    fb.textContent = '// INCORRECT — INVESTIGATE FURTHER';
    fb.className = 'cfb err';
    const d = document.getElementById('code-display');
    d.style.animation = 'none';
    void d.offsetHeight; // Reflow to restart animation
    d.style.animation = 'shake .4s ease';
  }
}

/* ══════════════════════════════════════
    AUDIO CONTROL
══════════════════════════════════════ */
let _musicOn = true;

function toggleMusic() {
  const iframe = document.getElementById('bg-music');
  const btn = document.getElementById('music-btn');
  if (!iframe || !btn) return;

  if (_musicOn) {
    iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
    btn.textContent = '♪ OFF';
    btn.classList.add('music-off');
  } else {
    iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1');
    btn.textContent = '♪ MUSIC';
    btn.classList.remove('music-off');
  }
  _musicOn = !_musicOn;
}

document.addEventListener('click', function _startMusic() {
  const iframe = document.getElementById('bg-music');
  if (iframe && !iframe.src.includes('autoplay=1')) {
    iframe.src += "&autoplay=1";
  }
  document.removeEventListener('click', _startMusic);
}, { once: true });