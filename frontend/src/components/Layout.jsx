import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./sections/Footer";
import { Toaster } from "./ui/sonner";

function useNeuronCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // ── Cream-background palette ───────────────────────────────────────────
    const BG_COLOR    = "rgba(253,251,247,0)";   // fully transparent — let CSS bg show
    const NODE_COLOR  = "#fdd017";               // deep bright gold node dot
    const LINE_DIM    = "rgba(180,120,20,";      // brighter base lines
    const LINE_BRIGHT = "rgba(230,160,20,";      // much brighter on hover
    const PULSE_COLOR = "rgba(230,160,30,";      // stronger pulse dot
    const CFG = { maxDist: 200, nodeMinR: 1.5, nodeMaxR: 4.0, speed: 0.35 };

    let nodes = [], pulses = [], W, H, animId;
    const mouse = { x: -9999, y: -9999 };

    const nodeCount = () => Math.min(Math.floor((W * H) / 14000), 90);

    class Node {
      constructor() { this.reset(true); }
      reset(rand) {
        this.x     = rand ? Math.random() * W : (Math.random() < 0.5 ? -10 : W + 10);
        this.y     = rand ? Math.random() * H : Math.random() * H;
        this.vx    = (Math.random() - 0.5) * CFG.speed;
        this.vy    = (Math.random() - 0.5) * CFG.speed;
        this.r     = CFG.nodeMinR + Math.random() * (CFG.nodeMaxR - CFG.nodeMinR);
        this.alpha = 0.45 + Math.random() * 0.45;
        this.phase = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.phase += 0.018;
        if (this.x < -20 || this.x > W + 20 || this.y < -20 || this.y > H + 20) this.reset(false);
      }
      draw() {
        const p = 0.85 + 0.15 * Math.sin(this.phase);
        const r = this.r * p;
        // soft glow around node
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 5);
        g.addColorStop(0, PULSE_COLOR + (this.alpha * 0.35) + ")");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(this.x, this.y, r * 5, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
        // solid node dot
        ctx.beginPath(); ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fillStyle = NODE_COLOR;
        ctx.globalAlpha = this.alpha * p;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    class Pulse {
      constructor(a, b) { this.a = a; this.b = b; this.t = 0; this.speed = 0.018; this.alive = true; }
      update() { this.t += this.speed; if (this.t >= 1) this.alive = false; }
      draw() {
        const x = this.a.x + (this.b.x - this.a.x) * this.t;
        const y = this.a.y + (this.b.y - this.a.y) * this.t;
        const f = Math.sin(this.t * Math.PI);
        const g = ctx.createRadialGradient(x, y, 0, x, y, 6);
        g.addColorStop(0,   PULSE_COLOR + (f * 0.9) + ")");
        g.addColorStop(0.4, PULSE_COLOR + (f * 0.35) + ")");
        g.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      }
    }

    const init = () => {
      nodes = Array.from({ length: nodeCount() }, () => new Node());
      pulses = [];
    };

    let lastPulse = 0;
    const spawnPulses = (t) => {
      if (t - lastPulse < 600) return;
      lastPulse = t; let s = 0;
      for (let i = 0; i < nodes.length && s < 2; i++) {
        for (let j = i + 1; j < nodes.length && s < 2; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < CFG.maxDist && Math.random() < 0.04) {
            pulses.push(new Pulse(nodes[i], nodes[j])); s++;
          }
        }
      }
    };

    const drawConnections = () => {
      // base connections between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d > CFG.maxDist) continue;
          const a = 1 - d / CFG.maxDist;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = LINE_DIM + (a * 0.75) + ")";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
      // mouse-proximity burst — brighter gold
      const MR = 140;
      for (let i = 0; i < nodes.length; i++) {
        const dx = nodes[i].x - mouse.x, dy = nodes[i].y - mouse.y;
        const dm = Math.sqrt(dx * dx + dy * dy);
        if (dm < MR) {
          for (let j = 0; j < nodes.length; j++) {
            if (i === j) continue;
            const dx2 = nodes[i].x - nodes[j].x, dy2 = nodes[i].y - nodes[j].y;
            const d2  = Math.sqrt(dx2 * dx2 + dy2 * dy2);
            if (d2 < CFG.maxDist) {
              const a = (1 - dm / MR) * (1 - d2 / CFG.maxDist) * 1.2;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = LINE_BRIGHT + a + ")";
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          }
        }
      }
    };

    const drawBg = () => {
      // clear to fully transparent so the CSS background shows through
      ctx.clearRect(0, 0, W, H);
    };

    const animate = (t) => {
      drawBg();
      drawConnections();
      nodes.forEach(n => { n.update(); n.draw(); });
      spawnPulses(t);
      pulses = pulses.filter(p => p.alive);
      pulses.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    };

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      cancelAnimationFrame(animId); init(); animate(0);
    };

    const onMouseMove  = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onMouseLeave = ()  => { mouse.x = -9999;      mouse.y = -9999; };
    const onTouchMove  = (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };
    const onTouchEnd = () => { mouse.x = -9999; mouse.y = -9999; };

    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove",  onTouchMove,  { passive: true });
    window.addEventListener("touchend",   onTouchEnd);
    window.addEventListener("resize",     resize);

    resize();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("touchend",   onTouchEnd);
      window.removeEventListener("resize",     resize);
    };
  }, [canvasRef]);
}

export const Layout = () => {
  const canvasRef = useRef(null);
  useNeuronCanvas(canvasRef);

  return (
    <div className="App min-h-screen bg-[#FDFBF7] overflow-x-hidden">

      {/* Neuron canvas — fixed, transparent, behind everything */}
      <canvas
        ref={canvasRef}
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          width:         "100%",
          height:        "100%",
          zIndex:        0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      {/* Page content above the canvas */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
        <Toaster position="top-center" richColors />
      </div>

    </div>
  );
};