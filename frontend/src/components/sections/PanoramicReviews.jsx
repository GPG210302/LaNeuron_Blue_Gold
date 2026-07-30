import {
  motion,
  AnimatePresence,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const EXPO = [0.22, 1, 0.36, 1];
const SWIPE_CONFIDENCE = 80;

function wrapIndex(index, length) {
  return (index + length) % length;
}

function shortestDelta(index, current) {
  const raw = index - current;
  if (raw > 2) return raw - 5;
  if (raw < -2) return raw + 5;
  return raw;
}

function SectionIntro({ overline, title, sub }) {
  return (
    <div className="max-w-3xl mx-auto text-center">
      {overline && (
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-amber-600">
          {overline}
        </p>
      )}
      {title && (
        <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
      )}
      {sub && (
        <p className="mt-4 text-base md:text-lg leading-relaxed text-slate-600">
          {sub}
        </p>
      )}
    </div>
  );
}

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

function GlassShell({ children, center = false }) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[2rem] border shadow-[0_30px_80px_-34px_rgba(15,23,42,0.22)] ${
        center
          ? "border-[rgba(244,183,112,0.34)] bg-[rgba(255,248,240,0.18)] backdrop-blur-xl"
          : "border-white/20 bg-[rgba(255,248,240,0.10)] backdrop-blur-lg"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.08)_38%,rgba(15,23,42,0.04)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      {children}
    </div>
  );
}

function RibbedOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-90"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 2px, rgba(255,255,255,0.03) 10px, rgba(15,23,42,0.06) 20px)",
        backdropFilter: "blur(6px)",
      }}
    />
  );
}

function ClearOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_100%)]"
      style={{ backdropFilter: "blur(14px)" }}
    />
  );
}

function truncateQuote(text = "", max = 120) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

function DesktopCard({ item, slot, onClick }) {
  const slotMap = {
    "-2": {
      x: "left-[0.5%]",
      w: "w-[240px]",
      h: "h-[250px]",
      rotate: "rotateY(64deg) scale(0.68)",
      opacity: "opacity-[0.16]",
      z: "z-0",
      text: "text-[0.95rem] line-clamp-2",
      pad: "p-5",
      showFull: false,
      showStars: false,
      clickable: false,
    },
    "-1": {
      x: "left-[8%]",
      w: "w-[340px]",
      h: "h-[320px]",
      rotate: "rotateY(38deg) scale(0.86)",
      opacity: "opacity-[0.60]",
      z: "z-10",
      text: "text-[1.1rem] line-clamp-4",
      pad: "p-6",
      showFull: false,
      showStars: true,
      clickable: true,
    },
    "0": {
      x: "left-1/2 -translate-x-1/2",
      w: "w-[min(54vw,860px)]",
      h: "h-[410px]",
      rotate: "rotateY(0deg) scale(1)",
      opacity: "opacity-100",
      z: "z-20",
      text: "text-[clamp(1.95rem,2.1vw,2.35rem)] leading-[1.36]",
      pad: "p-9 xl:p-10",
      showFull: true,
      showStars: true,
      clickable: false,
    },
    "1": {
      x: "right-[8%]",
      w: "w-[340px]",
      h: "h-[320px]",
      rotate: "rotateY(-38deg) scale(0.86)",
      opacity: "opacity-[0.60]",
      z: "z-10",
      text: "text-[1.1rem] line-clamp-4",
      pad: "p-6",
      showFull: false,
      showStars: true,
      clickable: true,
    },
    "2": {
      x: "right-[0.5%]",
      w: "w-[240px]",
      h: "h-[250px]",
      rotate: "rotateY(-64deg) scale(0.68)",
      opacity: "opacity-[0.16]",
      z: "z-0",
      text: "text-[0.95rem] line-clamp-2",
      pad: "p-5",
      showFull: false,
      showStars: false,
      clickable: false,
    },
  };

  const cfg = slotMap[String(slot)];
  if (!cfg) return null;

  const quoteText = cfg.showFull ? item.quote : truncateQuote(item.quote, slot === -1 || slot === 1 ? 110 : 54);

  const inner = (
    <div
      className={`absolute top-1/2 ${cfg.x} ${cfg.w} ${cfg.h} -translate-y-1/2 ${cfg.opacity} ${cfg.z}`}
      style={{
        transformStyle: "preserve-3d",
        transform:
          slot === 0
            ? "translateY(-50%)"
            : slot < 0
            ? "translateY(-50%) rotateY(38deg) scale(0.86)"
            : "translateY(-50%) rotateY(-38deg) scale(0.86)",
      }}
    >
      <motion.div
        animate={{
          transform:
            slot === 0
              ? "translateY(0px) scale(1)"
              : slot === -1
              ? "translateY(0px) rotateY(38deg) scale(0.86)"
              : slot === 1
              ? "translateY(0px) rotateY(-38deg) scale(0.86)"
              : slot === -2
              ? "translateY(0px) rotateY(64deg) scale(0.68)"
              : "translateY(0px) rotateY(-64deg) scale(0.68)",
        }}
        transition={{ duration: 0.9, ease: EXPO }}
        className="h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <GlassShell center={slot === 0}>
          {slot === 0 ? <ClearOverlay /> : <RibbedOverlay />}

          <div className={`relative z-10 flex h-full flex-col text-left ${cfg.pad}`}>
            <div className="flex items-start justify-between gap-3">
              {cfg.showStars ? <Stars value={item.rating || 5} /> : <span />}
              <Quote className={`${slot === 0 ? "h-6 w-6" : "h-5 w-5"} text-slate-300 shrink-0`} />
            </div>

            <p
              className={`mt-5 tracking-[-0.02em] text-slate-${slot === 0 ? "900" : "700"} ${cfg.text}`}
            >
              “{quoteText}”
            </p>

            <div className="mt-auto pt-6">
              <div className="h-px w-full bg-gradient-to-r from-slate-200/80 via-slate-300/80 to-transparent" />
              <div className="mt-4">
                <p className={`font-semibold ${slot === 0 ? "text-slate-900" : "text-slate-800"}`}>
                  {item.author}
                </p>
                {slot === 0 && item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto text-sm text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline"
                  >
                    {item.source}
                  </a>
                ) : (
                  <p className="text-sm text-slate-500">{item.source}</p>
                )}
              </div>
            </div>
          </div>
        </GlassShell>
      </motion.div>
    </div>
  );

  if (!cfg.clickable) return inner;

  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute inset-0"
      aria-label={slot < 0 ? "Show previous review" : "Show next review"}
    >
      {inner}
    </button>
  );
}

function DesktopPanoramicOrbit({ items }) {
  const [baseIndex, setBaseIndex] = useState(0);
  const [manualPause, setManualPause] = useState(false);
  const progress = useMotionValue(0);
  const speedPerSecond = 0.18;
  const stepDuration = 1 / speedPerSecond;
  const accumulator = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = manualPause;
  }, [manualPause]);

  useAnimationFrame((_, delta) => {
    if (pausedRef.current) return;

    const deltaSeconds = delta / 1000;
    accumulator.current += deltaSeconds * speedPerSecond;

    if (accumulator.current >= 1) {
      const wholeSteps = Math.floor(accumulator.current);
      accumulator.current -= wholeSteps;
      setBaseIndex((prev) => wrapIndex(prev + wholeSteps, items.length));
    }

    progress.set(accumulator.current);
  });

  const visible = useMemo(() => {
    return [-2, -1, 0, 1, 2].map((slot) => {
      const fractionalIndex = baseIndex + progress.get();
      const snappedBase = baseIndex;
      const itemIndex = wrapIndex(snappedBase + slot, items.length);
      return {
        slot,
        item: items[itemIndex],
        itemIndex,
      };
    });
  }, [baseIndex, items, progress]);

  const goPrev = () => {
    setManualPause(true);
    accumulator.current = 0;
    progress.set(0);
    setBaseIndex((prev) => wrapIndex(prev - 1, items.length));
    window.setTimeout(() => setManualPause(false), 900);
  };

  const goNext = () => {
    setManualPause(true);
    accumulator.current = 0;
    progress.set(0);
    setBaseIndex((prev) => wrapIndex(prev + 1, items.length));
    window.setTimeout(() => setManualPause(false), 900);
  };

  return (
    <div
      className="mt-16"
      onMouseEnter={() => setManualPause(true)}
      onMouseLeave={() => setManualPause(false)}
    >
      <div className="relative mx-auto h-[580px] w-full max-w-[1760px] overflow-hidden [perspective:2400px]">
        <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.90)_0%,rgba(248,250,252,0.97)_48%,rgba(241,245,249,1)_100%)]" />
        <div className="absolute left-[3%] right-[3%] bottom-8 h-20 rounded-full bg-slate-900/6 blur-3xl" />

        <motion.div
          className="relative h-full w-full"
          animate={{}}
          transition={{ duration: stepDuration, ease: "linear" }}
        >
          {visible.map(({ slot, item }) => (
            <DesktopCard
              key={`${slot}-${baseIndex}-${item.author}`}
              slot={slot}
              item={item}
              onClick={slot < 0 ? goPrev : goNext}
            />
          ))}
        </motion.div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goPrev}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          aria-label="Previous review"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {items.map((_, i) => {
            const active = i === baseIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setManualPause(true);
                  accumulator.current = 0;
                  progress.set(0);
                  setBaseIndex(i);
                  window.setTimeout(() => setManualPause(false), 900);
                }}
                className={`h-2.5 rounded-full transition-all ${
                  active ? "w-7 bg-slate-900" : "w-2.5 bg-slate-300"
                }`}
                aria-label={`Go to review ${i + 1}`}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={goNext}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          aria-label="Next review"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function MobileSwipeCard({ item, direction, onDragEnd }) {
  return (
    <motion.div
      custom={direction}
      initial={{ opacity: 0, x: direction > 0 ? 80 : -80, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: direction > 0 ? -80 : 80, scale: 0.98 }}
      transition={{ duration: 0.42, ease: EXPO }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={(_, info) => onDragEnd(info.offset.x)}
      className="touch-pan-y"
    >
      <GlassShell center>
        <ClearOverlay />

        <div className="relative z-10 flex min-h-[360px] flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <Stars value={item.rating || 5} />
            <Quote className="h-5 w-5 text-slate-300 shrink-0" />
          </div>

          <p className="mt-6 text-[clamp(1.2rem,3.8vw,1.65rem)] leading-[1.55] text-slate-900">
            “{item.quote}”
          </p>

          <div className="mt-auto pt-8">
            <div className="h-px w-full bg-gradient-to-r from-slate-200/80 via-slate-300/80 to-transparent" />
            <div className="mt-4">
              <p className="font-semibold text-slate-900">{item.author}</p>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline"
                >
                  {item.source}
                </a>
              ) : (
                <p className="text-sm text-slate-500">{item.source}</p>
              )}
            </div>
          </div>
        </div>
      </GlassShell>
    </motion.div>
  );
}

export function PanoramicReviews({ featuredReview }) {
  const items = useMemo(() => featuredReview?.items ?? [], [featuredReview]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!items.length || isPaused || !isMobile) return;

    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => wrapIndex(prev + 1, items.length));
    }, 7000);

    return () => clearInterval(timer);
  }, [items.length, isPaused, isMobile]);

  if (!items.length) return null;

  const goPrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => wrapIndex(prev - 1, items.length));
  };

  const goNext = () => {
    setDirection(1);
    setActiveIndex((prev) => wrapIndex(prev + 1, items.length));
  };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] py-16 lg:py-24">
      <div className="w-full px-4 sm:px-6 xl:px-10 2xl:px-14">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EXPO }}
        >
          <SectionIntro
            overline={featuredReview?.overline}
            title={featuredReview?.title}
            sub={
              isMobile
                ? "Swipe to read parent reflections."
                : "A continuously rotating panoramic showcase of parent reflections."
            }
          />
        </motion.div>

        {isMobile ? (
          <div
            className="mt-10"
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div className="relative mx-auto max-w-xl overflow-hidden">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <MobileSwipeCard
                  key={activeIndex}
                  item={items[activeIndex]}
                  direction={direction}
                  onDragEnd={(offsetX) => {
                    if (offsetX < -SWIPE_CONFIDENCE) goNext();
                    else if (offsetX > SWIPE_CONFIDENCE) goPrev();
                  }}
                />
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setDirection(i > activeIndex ? 1 : -1);
                      setActiveIndex(i);
                    }}
                    className={`h-2.5 rounded-full transition-all ${
                      i === activeIndex ? "w-6 bg-slate-900" : "w-2.5 bg-slate-300"
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
                aria-label="Next review"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <DesktopPanoramicOrbit items={items} />
        )}
      </div>
    </section>
  );
}