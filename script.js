// Monoalphabetic Cipher (Fixed Key)
const monoAlphaKey = {
  'A': 'Q', 'B': 'W', 'C': 'E', 'D': 'R', 'E': 'T', 'F': 'Y',
  'G': 'U', 'H': 'I', 'I': 'O', 'J': 'P', 'K': 'A', 'L': 'S',
  'M': 'D', 'N': 'F', 'O': 'G', 'P': 'H', 'Q': 'J', 'R': 'K',
  'S': 'L', 'T': 'Z', 'U': 'X', 'V': 'C', 'W': 'V', 'X': 'B',
  'Y': 'N', 'Z': 'M'
};

const monoAlphaReverseKey = Object.fromEntries(
  Object.entries(monoAlphaKey).map(([k, v]) => [v, k])
);

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('SW registered', reg))
      .catch(err => console.error('SW registration failed', err));
  });
}

// Morse Code Mappings
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

// Toggle buttons for mode
function toggleButtons() {
  const mode = document.getElementById('modeSelect').value;
  document.getElementById('toMorseBtn').disabled = (mode !== 'textToMorse');
  document.getElementById('toTextBtn').disabled = (mode !== 'morseToText');
}

window.onload = () => toggleButtons();

// Convert to Morse (with Monoalphabetic Encryption)
function convertToMorse() {
  const mode = document.getElementById('modeSelect').value;
  if (mode !== 'textToMorse') return;

  const input = document.getElementById('textInput').value.toUpperCase();
  if (!input) return;

  // Step 1: Encrypt input
  const encrypted = input.replace(/[A-Z]/g, char => monoAlphaKey[char] || char);

  // Step 2: Convert encrypted text to Morse
  const morse = encrypted.split('').map(char => morseCodeMap[char] || '').join(' ');

  // Step 3: Decrypt back to original text (for display)
  const decrypted = encrypted.replace(/[A-Z]/g, char => monoAlphaReverseKey[char] || char);

  // Step 4: Display Morse visually (for decrypted/original letters)
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

  // Optional: Also display original English text underneath
  const textDisplay = document.createElement('div');
  textDisplay.textContent = `Decrypted English: ${decrypted}`;
  textDisplay.style.marginTop = '12px';
  textDisplay.style.fontWeight = 'bold';
  outputDiv.appendChild(document.createElement('br'));
  outputDiv.appendChild(textDisplay);
}

// Convert Morse to Text (with Monoalphabetic Decryption)
function convertToText() {
  const mode = document.getElementById('modeSelect').value;
  if (mode !== 'morseToText') return;

  const morse = document.getElementById('textInput').value.trim();
  const words = morse.split('   ');
  let text = words.map(word =>
    word.split(' ').map(code => reverseMorseCodeMap[code] || '').join('')
  ).join(' ');

  // Monoalphabetic decryption
  text = text.replace(/[A-Z]/g, char => monoAlphaReverseKey[char] || char);

  document.getElementById('resultOutput').innerHTML = text;
}

// Audio Playback
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let oscillator;
let isPaused = false;
let playbackIndex = 0;
let playbackTimer;

function playMorse() {
  stopMorse();
  isPaused = false;
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
  if (!isPaused) playMorse();
  else clearTimeout(playbackTimer);
}

function stopMorse() {
  clearTimeout(playbackTimer);
  if (oscillator) oscillator.stop();
  isPaused = false;
  playbackIndex = 0;
  document.querySelectorAll('.morse-char').forEach(el =>
    el.classList.remove('highlight')
  );
}

function repeatMorse() {
  stopMorse();
  playMorse();
}

// Canvas Background Animation
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
// Morse input via ArrowUp key based on duration
let keyPressStart = null;

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowUp' && keyPressStart === null) {
    keyPressStart = Date.now();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowUp' && keyPressStart !== null) {
    const duration = Date.now() - keyPressStart;
    const inputField = document.getElementById('textInput');
    const symbol = (duration <= 500) ? '.' : '-';
    inputField.value += symbol;
    keyPressStart = null;

    // Update button state
    toggleButtons();
  }
});

