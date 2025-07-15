// --- Monoalphabetic Cipher Maps ---
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

// --- Morse Code Maps ---
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

// --- Convert Text → Cipher → Decrypt → Morse Output ---
function convertToMorse() {
  const input = document.getElementById('textInput').value.toUpperCase();

  const encrypted = input.split('').map(c => monoAlphaKey[c] || c);
  const decrypted = encrypted.map(c => reverseMonoAlphaKey[c] || c);

  const morse = decrypted.map(char => morseCodeMap[char] || '').join(' ');

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

  console.log("Input:", input);
  console.log("Encrypted:", encrypted.join(''));
  console.log("Decrypted:", decrypted.join(''));
  console.log("Morse of decrypted:", morse);
}

// --- Convert Morse → Text ---
function convertToText() {
  const morse = document.getElementById('textInput').value.trim();
  const words = morse.split('   '); // space between words
  const encryptedText = words
    .map(word => word.split(' ').map(code => reverseMorseCodeMap[code] || '').join(''))
    .join(' ');
  const decryptedText = decryptText(encryptedText);
  document.getElementById('resultOutput').innerHTML = decryptedText;
}

// --- Decrypt Monoalphabetic Text ---
function decryptText(text) {
  return text.split('').map(c => reverseMonoAlphaKey[c] || c).join('');
}
