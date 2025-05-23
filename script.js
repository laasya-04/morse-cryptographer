if ('serviceWorker' in navigator){
   window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('Service worker registered', registration);
      })
      .catch(error => {
        console.error('Service worker registration failed', error);
     });
   });
}

function toggleButtons() {
  const mode = document.getElementById('modeSelect').value;
  const toMorseBtn = document.getElementById('toMorseBtn');
  const toTextBtn = document.getElementById('toTextBtn');

  if (mode === 'textToMorse') {
    toMorseBtn.style.backgroundColor = '';
    toMorseBtn.style.cursor = 'pointer';

    toTextBtn.style.backgroundColor = 'lightgreen';
    toTextBtn.style.cursor = 'not-allowed';
  } else {
    toTextBtn.style.backgroundColor = '';
    toTextBtn.style.cursor = 'pointer';

    toMorseBtn.style.backgroundColor = 'lightgreen';
    toMorseBtn.style.cursor = 'not-allowed';
  }
}

window.onload = () => {
  toggleButtons();
};



let pressStartTime=0;
let isSpaceHeld=false;

document.addEventListener('keydown',(e) => {
  if(e.code === 'ArrowUp' && !isSpaceHeld) {
    pressStartTime = Date.now();
    isSpaceHeld=true;
    e.preventDefault();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowUp'&& isSpaceHeld) {
    const duration = Date.now() - pressStartTime;
    isSpaceHeld=false;
    const threshold = 500; 
    const symbol = duration < threshold?'.':'-';
    const input = document.getElementById('textInput');
    input.value += symbol; 
  }
});

const morseCodeMap = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..',
  'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
  'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/'
};
const reverseMorseCodeMap = Object.fromEntries(
  Object.entries(morseCodeMap).map(([k, v]) => [v, k])
);

function convertToMorse() {
  const mode = document.getElementById('modeSelect').value;
  const errorMsg = document.getElementById('errorMsg');
  if(mode!=='textToMorse'){
      errorMsg.textContent = 'Invalid input for Chosen convertor';
     return ;
  } 
  errorMsg.textContent='';
  const text = document.getElementById('textInput').value.toUpperCase();
  const morse = text.split('').map(char => morseCodeMap[char] || '').join(' ');
  document.getElementById('resultOutput').value = morse;
}

function convertToText() {
  const mode=document.getElementById('modeSelect').value;
  const errorMsg=document.getElementById('errorMsg');
  if(mode!=='morseToText'){
     errorMsg.textContent = 'Invalid input for chosen converter';
     return ;
  }
  errorMsg.textContent = ''; 
  const morse = document.getElementById('textInput').value.trim();
  const words = morse.split('   ');
  const text = words.map(word => word.split(' ').map(code => reverseMorseCodeMap[code] || '').join('')).join('  ');
  document.getElementById('resultOutput').value = text;
}

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let oscillator;
let isPaused = false;
let playbackIndex = 0;
let playbackTimer;

function playMorse() {
  stopMorse();
  const morse = document.getElementById('resultOutput').value.trim();
  const symbols = morse.replace(/\s+/g, ' ').split('');
  playSymbols(symbols);
}

function playSymbols(symbols) {
  if (playbackIndex >= symbols.length || isPaused) return;
  const symbol = symbols[playbackIndex];
  if (symbol === '.' || symbol === '-') {
    oscillator = audioCtx.createOscillator();
    oscillator.frequency.value = 600;
    oscillator.type = 'sine';
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    const duration = symbol === '.' ? 150 : 400;
    setTimeout(() => {
      oscillator.stop();
      playbackIndex++;
      playbackTimer = setTimeout(() => playSymbols(symbols), 150);
    }, duration);
  } else {
    playbackIndex++;
    playbackTimer = setTimeout(() => playSymbols(symbols), 150);
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
}

function repeatMorse() {
  stopMorse();
  playMorse();
}

// Background Animation
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
