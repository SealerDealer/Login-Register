let _musicOn = true;

function toggleMusic() {
  const iframe = document.getElementById('bg-music');
  const btn    = document.getElementById('music-btn');
  if (!iframe || !btn) return;

  if (_musicOn) {
    iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
    btn.textContent = '♪ OFF';
    btn.style.borderColor = '#1a3a1a';
    btn.style.boxShadow   = 'none';
  } else {
    iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1');
    btn.textContent = '♪ MUSIC';
    btn.style.borderColor = '#39ff14';
    btn.style.boxShadow   = '0 0 10px #39ff14';
  }
  _musicOn = !_musicOn;
}

document.addEventListener('click', function _startMusic() {
  const iframe = document.getElementById('bg-music');
  if (iframe) iframe.src = iframe.src;
  document.removeEventListener('click', _startMusic);
}, { once: true });
