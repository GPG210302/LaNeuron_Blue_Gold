export default {
  async fetch(request) {
    const url = new URL(request.url);
    const text = url.searchParams.get('La Neuron') || 'https://la-neuron.org';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Code Generator</title>
  <script src="https://cdn.jsdelivr.net/npm/qr-code-styling@1.5.0/lib/qr-code-styling.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #f5f5f5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, sans-serif;
      gap: 20px;
    }
    h2 { color: #333; font-size: 18px; }
    #qr-canvas { background: white; padding: 16px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    #qr-canvas canvas { display: block; }
    .url-label { font-size: 13px; color: #888; max-width: 300px; text-align: center; word-break: break-all; }
    button {
      padding: 12px 32px;
      background: #111;
      color: #fff;
      border: none;
      border-radius: 50px;
      font-size: 15px;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #333; }
  </style>
</head>
<body>
  <h2>Styled QR Code</h2>
  <div id="qr-canvas"></div>
  <p class="url-label">${text}</p>
  <button onclick="downloadQR()">⬇ Download PNG</button>

  <script>
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      type: "canvas",
      data: "${text.replace(/"/g, '&quot;')}",
      margin: 10,
      dotsOptions: {
        color: "#000000",
        type: "extra-rounded"
      },
      cornersSquareOptions: {
        color: "#000000",
        type: "extra-rounded"
      },
      cornersDotOptions: {
        color: "#000000",
        type: "dot"
      },
      backgroundOptions: {
        color: "#ffffff"
      }
    });

    qrCode.append(document.getElementById("qr-canvas"));

    function downloadQR() {
      qrCode.download({ name: "qr-code", extension: "png" });
    }
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};