// Submit 8-digit WhatsApp pairing code
function submitCode() {
  const codeInput = document.getElementById('whatsapp-code');
  const code = codeInput.value.trim();
  const resultDiv = document.getElementById('session-result');

  if(code.length !== 8 || !/^\d{8}$/.test(code)) {
    resultDiv.innerText = "❌ Please enter a valid 8-digit code.";
    return;
  }

  resultDiv.innerHTML = '🪐 Generating session...';

  fetch('/pair-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: code })
  })
  .then(res => res.json())
  .then(data => {
    if(data.sessionId) {
      resultDiv.innerHTML = `✅ Session ID: <span class="font-mono text-green-300">${data.sessionId}</span>`;
    } else {
      resultDiv.innerText = "❌ Invalid code or failed to generate session.";
    }
  })
  .catch(err => {
    console.error(err);
    resultDiv.innerText = "❌ Error connecting to server.";
  });
}
