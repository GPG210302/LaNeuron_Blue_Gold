export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve logo.PNG as a static asset
    if (url.pathname === './logo.PNG') {
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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/qr-code-styling@1.6.0/lib/qr-code-styling.js"></script>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: linear-gradient(145deg, #0a1235 0%, #0d1b4b 60%, #101e52 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'DM Sans', -apple-system, sans-serif;
      gap: 0;
      padding: 32px 16px;
    }

    .card {
      background: #ffffff;
      border-radius: 24px;
      padding: 36px 40px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      box-shadow:
        0 2px 8px rgba(0,0,0,0.18),
        0 16px 48px rgba(0,0,0,0.28);
      max-width: 420px;
      width: 100%;
    }

    .brand-header {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }

    .brand-name {
      font-size: 22px;
      font-weight: 700;
      color: #0d1b4b;
      letter-spacing: -0.3px;
    }

    .brand-name span {
      color: #c9950c;
    }

    .divider {
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, #e0d5b0, transparent);
    }

    #qr-canvas {
      background: white;
      border-radius: 16px;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .url-label {
      font-size: 12px;
      color: #888;
      max-width: 300px;
      text-align: center;
      word-break: break-all;
      line-height: 1.5;
    }

    .download-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 13px 36px;
      background: #0d1b4b;
      color: #ffffff;
      border: none;
      border-radius: 50px;
      font-size: 15px;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: background 200ms ease, transform 120ms ease, box-shadow 200ms ease;
      box-shadow: 0 4px 14px rgba(13,27,75,0.35);
    }

    .download-btn:hover {
      background: #c9950c;
      box-shadow: 0 4px 18px rgba(201,149,12,0.4);
      transform: translateY(-1px);
    }

    .download-btn:active {
      transform: translateY(0);
    }

    .footer-note {
      font-size: 11px;
      color: rgba(255,255,255,0.35);
      margin-top: 16px;
      letter-spacing: 0.3px;
    }

    @media (max-width: 480px) {
      .card { padding: 28px 24px 24px; }
      .brand-name { font-size: 18px; }
    }
  </style>
</head>
<body>

  <div class="card">
    <div class="brand-header">
      <img src="/logo.PNG" alt="La Neuron Logo" class="brand-logo" />
      <span class="brand-name">La <span>Neuron</span></span>
    </div>

    <div class="divider"></div>

    <div id="qr-canvas"></div>

    <p class="url-label">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>

    <button class="download-btn" onclick="downloadQR()">
      ⬇ Download QR Code
    </button>
  </div>

  <p class="footer-note">la-neuron.org · STEAM Education</p>

  <script>
    const logoUrl = ${JSON.stringify(logoUrl)};

    const qrCode = new QRCodeStyling({
      width: 320,
      height: 320,
      type: "canvas",
      data: ${JSON.stringify(text)},
      margin: 14,
      qrOptions: {
        errorCorrectionLevel: "H"
      },
      image: logoUrl,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 8,
        imageSize: 0.45,
        hideBackgroundDots: true
      },
      dotsOptions: {
        color: "#0d1b4b",
        type: "dots"
      },
      cornersSquareOptions: {
        color: "#0d1b4b",
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