import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const EXPO = [0.22, 1, 0.36, 1];

function Stars({ value = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(value) ? "fill-amber-400 text-amber-400" : "fill-transparent text-slate-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-semibold text-slate-500">{Number(value).toFixed(1)}/5</span>
    </div>
  );
}

function truncate(text = "", max = 100) {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "…";
}

function OrbitCard({ item, index, total, t, stageWidth }) {
  const angle = useTransform(t, (progress) => {
    const raw = (index / total - progress) * Math.PI * 2;
    let wrapped = raw % (Math.PI * 2);
    if (wrapped > Math.PI) wrapped -= Math.PI * 2;
    if (wrapped < -Math.PI) wrapped += Math.PI * 2;
    return wrapped;
  });

  const halfWidth = stageWidth / 2;
  const x = useTransform(angle, (a) => Math.sin(a) * halfWidth * 0.92);
  const depth = useTransform(angle, (a) => Math.cos(a));
  const scale = useTransform(depth, [-1, 0, 1], [0.58, 0.8, 1]);
  const opacity = useTransform(depth, [-1, -0.2, 0.4, 1], [0, 0.35, 0.75, 1]);
  const rotateY = useTransform(angle, (a) => (a > 0 ? Math.min(a, 1) * 42 : Math.max(a, -1) * 42) * -1);
  const zIndex = useTransform(depth, (d) => Math.round(d * 100));
  const blur = useTransform(depth, [-1, 0.4, 1], [3, 0.5, 0]);
  const isCenter = useTransform(angle, (a) => Math.abs(a) < 0.28);

  const [centerNow, setCenterNow] = useState(false);
  useEffect(() => isCenter.on("change", (v) => setCenterNow(v)), [isCenter]);

  const quoteText = centerNow ? item.quote : truncate(item.quote, 92);

  return (
    <motion.article
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        x,
        y: "-50%",
        translateX: "-50%",
        scale,
        rotateY,
        opacity,
        zIndex,
        filter: useTransform(blur, (b) => `blur(${b}px)`),
        width: centerNow ? "min(46vw, 720px)" : "300px",
        transformStyle: "preserve-3d",
      }}
      className="pointer-events-none"
    >
      <div
        className={`relative overflow-hidden rounded-[1.75rem] border shadow-[0_24px_60px_-28px_rgba(15,23,42,0.28)] backdrop-blur-xl ${
          centerNow
            ? "border-[rgba(244,183,112,0.4)] bg-[rgba(255,248,240,0.22)]"
            : "border-white/25 bg-[rgba(255,248,240,0.12)]"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.24),rgba(255,255,255,0.06)_45%,rgba(15,23,42,0.04)_100%)]" />
        {!centerNow && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 2px, rgba(255,255,255,0.02) 9px, rgba(15,23,42,0.05) 18px)",
            }}
          />
        )}

        <div className={`relative z-10 flex flex-col ${centerNow ? "p-8 lg:p-10 min-h-[360px]" : "p-6 min-h-[280px]"}`}>
          <div className="flex items-start justify-between gap-3">
            <Stars value={item.rating || 5} />
            <Quote className={`${centerNow ? "h-6 w-6" : "h-4 w-4"} text-slate-300 shrink-0`} />
          </div>

          <p
            className={`mt-5 tracking-[-0.02em] ${
              centerNow
                ? "text-slate-900 text-[clamp(1.5rem,1.9vw,2.15rem)] leading-[1.38]"
                : "text-slate-600 text-[0.95rem] leading-[1.4] line-clamp-4"
            }`}
          >
            “{quoteText}”
          </p>

          <div className="mt-auto pt-6">
            <div className="h-px w-full bg-gradient-to-r from-slate-200/80 via-slate-300/80 to-transparent" />
            <div className="mt-4">
              <p className={`font-semibold ${centerNow ? "text-slate-900" : "text-slate-700 text-sm"}`}>
                {item.author}
              </p>
              <p className={`text-slate-500 ${centerNow ? "text-sm" : "text-xs"}`}>{item.source}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function useElementWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(1200);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setWidth(entry.contentRect.width);
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}

function DesktopAmphitheater({ items }) {
  const t = useMotionValue(0);
  const pausedRef = useRef(false);
  const [stageRef, stageWidth] = useElementWidth();
  const speed = 0.045;

  useAnimationFrame((_, delta) => {
    if (pausedRef.current) return;
    t.set((t.get() + (delta / 1000) * speed) % 1);
  });

  const step = (dir) => {
    pausedRef.current = true;
    t.set((t.get() + dir / items.length + 1) % 1);
    window.setTimeout(() => (pausedRef.current = false), 1200);
  };

  return (
    <div
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      className="mt-14 w-full"
    >
      <div
        ref={stageRef}
        className="relative mx-auto h-[440px] w-full max-w-[1800px] overflow-hidden rounded-[2.5rem] [perspective:2000px]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.92)_0%,rgba(248,250,252,0.97)_50%,rgba(241,245,249,1)_100%)]" />
        <div className="absolute left-[4%] right-[4%] bottom-6 h-16 rounded-full bg-slate-900/6 blur-3xl" />

        <div className="relative h-full w-full">
          {items.map((item, i) => (
            <OrbitCard key={i} item={item} index={i} total={items.length} t={t} stageWidth={stageWidth} />
          ))}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => step(-1)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300"
          aria-label="Previous review"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300"
          aria-label="Next review"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function MobileStack({ items }) {
  const [index, setIndex] = useState(0);
  const item = items[index];

  return (
    <div className="mt-10">
      <div className="relative mx-auto max-w-md overflow-hidden rounded-[1.75rem] border border-[rgba(244,183,112,0.3)] bg-[rgba(255,248,240,0.6)] shadow-[0_20px_50px_-24px_rgba(15,23,42,0.25)]">
        <div className="p-6 flex flex-col min-h-[300px]">
          <div className="flex items-start justify-between gap-3">
            <Stars value={item.rating || 5} />
            <Quote className="h-5 w-5 text-slate-300 shrink-0" />
          </div>
          <p className="mt-5 text-slate-900 text-[1.1rem] leading-[1.5]">“{item.quote}”</p>
          <div className="mt-auto pt-6">
            <div className="h-px w-full bg-gradient-to-r from-slate-200/80 via-slate-300/80 to-transparent" />
            <div className="mt-4">
              <p className="font-semibold text-slate-900">{item.author}</p>
              <p className="text-sm text-slate-500">{item.source}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setIndex((p) => (p - 1 + items.length) % items.length)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
          aria-label="Previous review"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-slate-900" : "w-2 bg-slate-300"}`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIndex((p) => (p + 1) % items.length)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
          aria-label="Next review"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export function AmphitheaterReviews({ featuredReview }) {
  const items = useMemo(() => featuredReview?.items ?? [], [featuredReview]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!items.length) return null;

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] py-16 lg:py-20">
      <div className="w-full px-4 sm:px-6 xl:px-10">
        <div className="max-w-3xl mx-auto text-center">
          {featuredReview?.overline && (
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-amber-600">
              {featuredReview.overline}
            </p>
          )}
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            {featuredReview?.title}
          </h2>
        </div>

        {isMobile ? <MobileStack items={items} /> : <DesktopAmphitheater items={items} />}
      </div>
    </section>
  );
}