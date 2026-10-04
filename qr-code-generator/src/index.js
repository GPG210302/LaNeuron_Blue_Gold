export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── Connect QR (review + social) — page with downloads ──────────
    // The image files live in src/connect/ and are served automatically.
    if (url.pathname === '/connect' || url.pathname === '/connect/') {
      return new Response(connectPage(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // Serve logo.PNG as a static asset
    if (url.pathname === './logo.PNG') {
      return env.ASSETS.fetch(request);
    }

    // Read ?text= param, default to laneuron.org
    const text = url.searchParams.get('text') || 'https://laneuron.org';

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

  <p class="footer-note">laneuron.org · STEAM Education</p>

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


// ─── Connect QR page ──────────────────────────────────────────────
function connectPage() {
  const files = (name) => ['png', 'svg', 'pdf']
    .map((ext) => `<a class="dl" href="/connect/${name}.${ext}" download>${ext.toUpperCase()}</a>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>La Neuron Connect QR</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: linear-gradient(145deg, #0a1235 0%, #0d1b4b 60%, #101e52 100%);
      min-height: 100vh; font-family: 'DM Sans', -apple-system, sans-serif;
      display: flex; flex-direction: column; align-items: center; padding: 40px 16px; color: #0d1b4b;
    }
    .head { text-align: center; color: #fff; margin-bottom: 28px; }
    .head img { width: 56px; height: 56px; object-fit: contain; background: #fff; border-radius: 14px; padding: 6px; }
    .head h1 { margin-top: 12px; font-size: 26px; }
    .head h1 span { color: #E0B33C; }
    .head p { margin-top: 6px; color: rgba(255,255,255,.65); font-size: 14px; }
    .grid { display: grid; gap: 24px; width: 100%; max-width: 980px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
    .card { background: #fff; border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,.18), 0 16px 48px rgba(0,0,0,.28); border: 2px solid transparent; }
    .card:hover { border-color: #E0B33C; }
    .card img.qr { width: 100%; height: auto; border-radius: 14px; background: #fff; }
    .tag { align-self: flex-start; font-size: 11px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase;
           padding: 6px 12px; border-radius: 999px; background: linear-gradient(135deg, #F4D07A, #E0B33C); color: #0f172a; }
    h2 { font-size: 19px; }
    .note { font-size: 13px; color: #555; line-height: 1.5; }
    .row { display: flex; gap: 8px; flex-wrap: wrap; }
    .dl { flex: 1; text-align: center; padding: 11px 0; border-radius: 999px; background: #0d1b4b; color: #fff;
          font-weight: 700; font-size: 14px; text-decoration: none; transition: background .2s, transform .12s; }
    .dl:hover { background: #E0B33C; color: #0f172a; transform: translateY(-1px); }
    .foot { margin-top: 28px; font-size: 12px; color: rgba(255,255,255,.4); text-align: center; line-height: 1.6; }
    .foot a { color: #E0B33C; }
  </style>
</head>
<body>
  <div class="head">
    <img src="/logo.PNG" alt="La Neuron">
    <h1>La Neuron <span>Connect QR</span></h1>
    <p>Opens laneuron.org/connect — Google review · social media · contact</p>
  </div>

  <div class="grid">
    <div class="card">
      <span class="tag">Card · A6 and up</span>
      <img class="qr" src="/connect/laneuron-connect-qr-large-card.png" alt="Connect QR card">
      <h2>Framed card</h2>
      <p class="note">Ready to print: SCAN ME, Review · Follow · Connect, official logos. Use the PDF for a print shop.</p>
      <div class="row">
        <a class="dl" href="/connect/laneuron-connect-qr-large-card.png" download>PNG</a>
        <a class="dl" href="/connect/laneuron-connect-qr-large-card.pdf" download>PDF</a>
      </div>
    </div>

    <div class="card">
      <span class="tag">Large · 3 cm and up</span>
      <img class="qr" src="/connect/laneuron-connect-qr-large.png" alt="Large Connect QR">
      <h2>QR only — large</h2>
      <p class="note">La Neuron logo with the five social logos in the centre. For posters, flyers and screens.</p>
      <div class="row">${files('laneuron-connect-qr-large')}</div>
    </div>

    <div class="card">
      <span class="tag">Small · 1.5–3 cm</span>
      <img class="qr" src="/connect/laneuron-connect-qr-small.png" alt="Small Connect QR">
      <h2>QR only — small</h2>
      <p class="note">Bigger dots for tiny prints. Keep at least 2 mm of white around it.</p>
      <div class="row">${files('laneuron-connect-qr-small')}</div>
    </div>
  </div>

  <p class="foot">Website QR generator stays at <a href="/">the main page</a>.<br>laneuron.org · STEAM Education</p>
</body>
</html>`;
}
