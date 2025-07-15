function convertToMorse() {
  const mode = document.getElementById('modeSelect').value;
  if (mode !== 'textToMorse') return;

  const input = document.getElementById('textInput').value.toUpperCase();
  if (!input) return;

  // Step 1: Encrypt original input (for logic)
  const encrypted = input.replace(/[A-Z]/g, char => monoAlphaKey[char] || char);

  // Step 2: Decrypt it back (internal test/logic only)
  const decrypted = encrypted.replace(/[A-Z]/g, char => monoAlphaReverseKey[char] || char);

  // Step 3: Convert original input to Morse (NOT the encrypted one)
  const morse = input.split('').map(char => morseCodeMap[char] || '').join(' ');

  // Step 4: Display only Morse in output box
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

  // Note: encrypted and decrypted values are used silently, not shown
}
