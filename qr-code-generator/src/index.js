export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve logo.PNG as a static asset
    if (url.pathname === '/logo.PNG') {
      return env.ASSETS.fetch(request);
    }

    // Read ?text= param, default to la-neuron.org
    const text = url.searchParams.get('text') || 'https://la-neuron.org';

    // Logo lives on same worker domain
    const logoUrl = `${url.origin}/logo.PNG`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>La Neuron QR Code</title>
  <script src="https://cdn.jsdelivr.net/npm/qr-code-styling@1.6.0/lib/qr-code-styling.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #f0f0f0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, sans-serif;
      gap: 20px;
    }
    h2 { color: #0d1b4b; font-size: 20px; font-weight: 700; }
    #qr-canvas {
      background: white;
      padding: 16px;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.12);
    }
    .url-label {
      font-size: 13px;
      color: #888;
      max-width: 300px;
      text-align: center;
      word-break: break-all;
    }
    button {
      padding: 12px 32px;
      background: #0d1b4b;
      color: #fff;
      border: none;
      border-radius: 50px;
      font-size: 15px;
      cursor: pointer;
    }
    button:hover { background: #c9950c; }
  </style>
</head>
<body>
  <h2>🧠 La Neuron QR Code</h2>
  <div id="qr-canvas"></div>
  <p class="url-label">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
  <button onclick="downloadQR()">⬇ Download PNG</button>

  <script>
    const qrCode = new QRCodeStyling({
      width: 320,
      height: 320,
      type: "canvas",
      data: ${JSON.stringify(text)},
      margin: 12,
      qrOptions: {
        errorCorrectionLevel: "H"
      },
      image: ${JSON.stringify(logoUrl)},
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 6,
        imageSize: 0.32,
        hideBackgroundDots: true
      },
      dotsOptions: {
        color: "#0d1b4b",
        type: "dots"
      },
      cornersSquareOptions: {
        color: "#c9950c",
        type: "extra-rounded"
      },
      cornersDotOptions: {
        color: "#c9950c",
        type: "dot"
      },
      backgroundOptions: {
        color: "#ffffff"
      }
    });

    qrCode.append(document.getElementById("qr-canvas"));

    function downloadQR() {
      qrCode.download({ name: "la-neuron-qr", extension: "png" });
    }
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};