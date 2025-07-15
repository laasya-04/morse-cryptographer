// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('SW registered', reg))
      .catch(err => console.error('SW registration failed', err));
  });
}

// Toggle buttons based on mode
function toggleButtons() {
  const mode = document.getElementById('modeSelect').value;
  const toMorseBtn = document.getElementById('toMorseBtn');
  const toTextBtn = document.getElementById('toTextBtn');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  toMorseBtn.disabled = (mode !== 'textToMorse');
  toTextBtn.disabled = (mode !== 'morseToText');
  playBtn.disabled = (mode !== 'textToMorse');
  pauseBtn.disabled = (mode !== 'textToMorse');
  [toMorseBtn, toTextBtn, playBtn, pauseBtn].forEach(btn => {
    btn.style.backgroundColor = btn.disabled ? 'lightgreen' : '';
  });
  if (mode === 'textToMorse') {
    toTextBtn.style.backgroundColor = 'lightgreen';
  } else if (mode === 'morseToText') {
    toMorseBtn.style.backgroundColor = 'lightgreen';
  }
}
window.onload = () => toggleButtons();

// Keypress input for Morse
let pressStartTime = 0;
let isSpaceHeld = false;
document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowUp' && !isSpaceHeld) {
    pressStartTime = Date.now();
    isSpaceHeld = true;
    e.preventDefault();
  }
});
document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowUp' && isSpaceHeld) {
    const duration = Date.now() - pressStartTime;
    isSpaceHeld = false;
    const threshold = 500;
    const symbol = duration < threshold ? '.' : '-';
    const input = document.getElementById('textInput');
    input.value += symbol;
  }
});

// Morse & Cipher Maps
const morseCodeMap = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  ' ': '/'
};
const reverseMorseCodeMap = Object.fromEntries(
  Object.entries(morseCodeMap).map(([k, v]) => [v, k])
);

// Monoalphabetic Cipher Maps
const monoAlphaKey = {
  'A': 'Q', 'B': 'W', 'C': 'E', 'D': 'R', 'E': 'T', 'F': 'Y',
  'G': 'U', 'H': 'I', 'I': 'O', 'J': 'P', 'K': 'A', 'L': 'S',
  'M': 'D', 'N': 'F', 'O': 'G', 'P': 'H', 'Q': 'J', 'R': 'K',
  'S': 'L', 'T': 'Z', 'U': 'X', 'V': 'C', 'W': 'V', 'X': 'B',
  'Y': 'N', 'Z': 'M', '0': '0', '1': '1', '2': '2', '3': '3',
  '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
  ' ': ' '
};
const reverseMonoAlphaKey = Object.fromEntries(
  Object.entries(monoAlphaKey).map(([k, v]) => [v, k])
);
function encryptText(text) {
  return text.split('').map(char => monoAlphaKey[char] || char).join('');
}
function decryptText(text) {
  return text.split('').map(char => reverseMonoAlphaKey[char] || char).join('');
}

// Convert Text → Cipher → Morse → Display
function convertToMorse() {
  const mode = document.getElementById('modeSelect').value;
  if (mode !== 'textToMorse') return;
  const input = document.getElementById('textInput').value.toUpperCase();
  const encrypted = encryptText(input);
  const morse = encrypted.split('').map(char => morseCodeMap[char] || '').join(' ');
  const outputDiv = document.getElementById('resultOutput');
  outputDiv.innerHTML = '';
  morse.split('').forEach(symbol => {
    const span = document.createElement('span');
    span.textContent = symbol;
    if (symbol === '.' || symbol === '-') {
      span.classList.add('morse-char');
    }
    outputDiv.appendChild(span);
  });
}

// Convert Morse → Ciphered Text → Decrypted Text
function convertToText() {
  const mode = document.getElementById('modeSelect').value;
  if (mode !== 'morseToText') return;
  const morse = document.getElementById('textInput').value.trim();
  const words = morse.split('   ');
  const encryptedText = words
    .map(word => word.split(' ').map(code => reverseMorseCodeMap[code] || '').join(''))
    .join(' ');
  const decryptedText = decryptText(encryptedText);
  document.getElementById('resultOutput').innerHTML = decryptedText;
}

// Morse Audio Playback
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let oscillator;
let isPaused = false;
let playbackIndex = 0;
let playbackTimer;

document.body.addEventListener('click', () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}, { once: true });

function playMorse() {
  stopMorse();
  isPaused = false;
  document.getElementById('playBtn').disabled = true;
  document.getElementById('playBtn').disabled = false;
  const chars = Array.from(document.querySelectorAll('.morse-char'));
  playSymbols(chars);
}
function playSymbols(chars) {
  if (playbackIndex >= chars.length || isPaused) return;
  const currentChar = chars[playbackIndex];
  const symbol = currentChar.textContent;
  if (symbol === '.' || symbol === '-') {
    oscillator = audioCtx.createOscillator();
    oscillator.frequency.value = 600;
    oscillator.type = 'sine';
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    currentChar.classList.add('highlight');
    const duration = (symbol === '.' ? 150 : 400);
    setTimeout(() => {
      oscillator.stop();
      currentChar.classList.remove('highlight');
      playbackIndex++;
      playbackTimer = setTimeout(() => playSymbols(chars), 150);
    }, duration);
  } else {
    playbackIndex++;
    playbackTimer = setTimeout(() => playSymbols(chars), 150);
  }
}
function pauseMorse() {
  isPaused = !isPaused;
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  if (!isPaused) {
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    playMorse();
  } else {
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    clearTimeout(playbackTimer);
  }
}
function stopMorse() {
  clearTimeout(playbackTimer);
  isPaused = true;
  playbackIndex = 0;
  if (oscillator) oscillator.stop();
}

// Canvas background animation
const canvas = document.getElementById('morseBackground');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particles = [];
const symbols = ['.', '-'];
for (let i = 0; i < 200; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: 0.5 + Math.random() * 1.5,
    symbol: symbols[Math.floor(Math.random() * 2)],
    size: 20 + Math.random() * 20,
    opacity: 0.3 + Math.random() * 0.7
  });
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.fillStyle = `rgba(0, 255, 255, ${p.opacity})`;
    ctx.font = `${p.size}px Courier New`;
    ctx.fillText(p.symbol, p.x, p.y);
    p.y += p.speed;
    if (p.y > canvas.height) {
      p.y = -20;
      p.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
