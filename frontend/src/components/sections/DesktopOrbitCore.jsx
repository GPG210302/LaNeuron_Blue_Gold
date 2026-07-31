import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { Quote, Star } from "lucide-react";

const EXPO = [0.22, 1, 0.36, 1];

function Stars({ value = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-slate-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-semibold text-slate-500">
        {Number(value).toFixed(1)}/5
      </span>
    </div>
  );
}

function truncate(text = "", max = 110) {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "…";
}

export function DesktopOrbitCore({ items }) {
  const t = useMotionValue(0); // progress 0 → 1, loops
  const speed = 0.02;          // orbit speed; adjust to taste

  useAnimationFrame((_, delta) => {
    const dt = delta / 1000;
    const next = (t.get() + dt * speed) % 1;
    t.set(next);
  });

  return (
    <div className="relative mx-auto mt-16 h-[580px] w-full max-w-[1760px] overflow-hidden [perspective:2400px]">
      {/* stage background */}
      <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.90)_0%,rgba(248,250,252,0.97)_48%,rgba(241,245,249,1)_100%)]" />
      <div className="absolute left-[3%] right-[3%] bottom-8 h-20 rounded-full bg-slate-900/6 blur-3xl" />

      <div className="relative h-full w-full">
        {items.map((item, index) => (
          <OrbitCard key={index} item={item} index={index} total={items.length} t={t} />
        ))}
      </div>
    </div>
  );
}

function OrbitCard({ item, index, total, t }) {
  // angle in radians, from -PI to PI
  const angle = (() => {
    const base = index / total + t.get(); // 0..1
    const wrapped = ((base % 1) + 1) % 1; // 0..1
    return (wrapped - 0.5) * 2 * Math.PI; // -PI..PI
  })();

  const radiusX = 520; // horizontal spread
  const radiusZ = 0.5; // depth factor

  const x = radiusX * Math.sin(angle);      // left-right
  const depth = Math.cos(angle);            // front/back
  const scale = 0.75 + radiusZ * depth;     // scale by depth
  const opacity = 0.15 + 0.85 * Math.max(depth, 0); // fade when behind
  const rotateY = angle < 0 ? -32 : 32;     // tilt left/right
  const y = 30 * Math.sin(angle);           // slight vertical variance
  const zIndex = Math.round(100 + depth * 50);

  const centerThreshold = 0.35; // radians ~20°
  const isCenter = Math.abs(angle) < centerThreshold;

  const width = isCenter ? "min(54vw, 860px)" : "340px";
  const height = isCenter ? 410 : 320;

  const quoteText = isCenter ? item.quote : truncate(item.quote, 110);

  return (
    <motion.article
      className="absolute top-1/2 left-1/2 pointer-events-none"
      style={{
        width,
        height,
        transformStyle: "preserve-3d",
        translateX: "-50%",
        translateY: "-50%",
        x,
        y,
        scale,
        rotateY,
        opacity,
        zIndex,
      }}
      transition={{ duration: 0.45, ease: EXPO }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/30 bg-[rgba(255,255,255,0.16)] shadow-[0_30px_80px_-34px_rgba(15,23,42,0.22)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.08)_38%,rgba(15,23,42,0.04)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        <div className="relative z-10 flex h-full flex-col p-6 lg:p-8 text-left">
          <div className="flex items-start justify-between gap-3">
            <Stars value={item.rating || 5} />
            <Quote className={`${isCenter ? "h-6 w-6" : "h-5 w-5"} text-slate-300 shrink-0`} />
          </div>

          <p
            className={`mt-5 tracking-[-0.02em] ${
              isCenter ? "text-slate-900 text-[clamp(1.95rem,2.1vw,2.35rem)] leading-[1.36]" : "text-slate-700 text-[1.1rem] leading-[1.34]"
            }`}
          >
            “{quoteText}”
          </p>

          <div className="mt-auto pt-6">
            <div className="h-px w-full bg-gradient-to-r from-slate-200/80 via-slate-300/80 to-transparent" />
            <div className="mt-4">
              <p className={`font-semibold ${isCenter ? "text-slate-900" : "text-slate-800"}`}>
                {item.author}
              </p>
              <p className="text-sm text-slate-500">{item.source}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}