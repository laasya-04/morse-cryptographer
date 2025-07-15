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

// Morse Code Mappings
const morseCodeMap = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/'
};

const reverseMorseCodeMap = Object.fromEntries(
  Object.entries(morseCodeMap).map(([k, v]) => [v, k])
);

// Button Toggle based on mode and input
function toggleButtons() {
  const mode = document.getElementById('modeSelect').value;
  const input = document.getElementById('textInput').value.trim();
  const morseBtn = document.getElementById('toMorseBtn');
  const textBtn = document.getElementById('toTextBtn');

  morseBtn.disabled = !(mode === 'textToMorse' && input.length > 0);
  textBtn.disabled = !(mode === 'morseToText' && input.length > 0);
}

window.onload = () => toggleButtons();

// Convert to Morse (with Monoalphabetic Encryption)
function convertToMorse() {
  const mode = document.getElementById('modeSelect').value;
  if (mode !== 'textToMorse') return;

  let text = document.getElementById('textInput').value.toUpperCase();
  text = text.replace(/[A-Z]/g, char => monoAlphaKey[char] || char);

  const morse = text.split('').map(char => morseCodeMap[char] || '').join(' ');
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

// Convert Morse to Text (with Monoalphabetic Decryption)
function convertToText() {
  const mode = document.getElementById('modeSelect').value;
  if (mode !== 'morseToText') return;

  const morse = document.getElementById('textInput').value.trim();
  const words = morse.split('   ');
  let text = words.map(word =>
    word.split(' ').map(code => reverseMorseCodeMap[code] || '').join('')
  ).join(' ');

  text = text.replace(/[A-Z]/g, char => monoAlphaReverseKey[char] || char);
  document.getElementById('resultOutput').innerHTML = text;
}

// Keypress timing logic for dot/dash
let keyPressStart = null;

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowUp' && keyPressStart === null) {
    keyPressStart = Date.now();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowUp' && keyPressStart !== null) {
    const duration = Date.now() - keyPressStart;
    const input = document.getElementById('textInput');
    input.value += duration <= 500 ? '.' : '-';
    keyPressStart = null;
    toggleButtons();
  }
});
