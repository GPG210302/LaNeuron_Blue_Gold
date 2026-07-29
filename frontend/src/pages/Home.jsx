import { Link } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Hero } from "../components/sections/Hero";
import { SectionHeading } from "../components/Reveal";
import { useData } from "../i18n/useData";

const EXPO = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-60px" };

const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(rawY, { stiffness: 180, damping: 22 });
  const scale = useSpring(1, { stiffness: 280, damping: 22 });

  const glareX = useTransform(rotateY, [-12, 12], ["120%", "-20%"]);
  const glareY = useTransform(rotateX, [-12, 12], ["120%", "-20%"]);
  const glareOpacity = useTransform(rotateY, [-12, 0, 12], [0.15, 0, 0.15]);

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawY.set(((e.clientX - cx) / (rect.width / 2)) * 12);
    rawX.set(((e.clientY - cy) / (rect.height / 2)) * -12);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => scale.set(1.03)}
      onMouseLeave={() => {
        rawX.set(0);
        rawY.set(0);
        scale.set(1);
      }}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={`relative ${className}`}
    >
      {children}

      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden z-10"
        style={{ opacity: glareOpacity }}
      >
        <motion.div
          className="absolute w-[180%] h-[180%] -top-12 -left-12 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.45) 0%, transparent 65%)",
            x: glareX,
            y: glareY,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const reviewPalette = [
  {
    ring: "from-fuchsia-500/30 via-rose-400/15 to-transparent",
    border: "border-fuchsia-200/60",
    glow: "shadow-[0_24px_60px_-26px_rgba(217,70,239,0.45)]",
    chip: "bg-fuchsia-100 text-fuchsia-700",
  },
  {
    ring: "from-sky-500/30 via-cyan-400/15 to-transparent",
    border: "border-sky-200/60",
    glow: "shadow-[0_24px_60px_-26px_rgba(14,165,233,0.42)]",
    chip: "bg-sky-100 text-sky-700",
  },
  {
    ring: "from-emerald-500/30 via-lime-400/15 to-transparent",
    border: "border-emerald-200/60",
    glow: "shadow-[0_24px_60px_-26px_rgba(16,185,129,0.4)]",
    chip: "bg-emerald-100 text-emerald-700",
  },
  {
    ring: "from-amber-500/30 via-orange-400/15 to-transparent",
    border: "border-amber-200/60",
    glow: "shadow-[0_24px_60px_-26px_rgba(245,158,11,0.38)]",
    chip: "bg-amber-100 text-amber-700",
  },
  {
    ring: "from-violet-500/30 via-purple-400/15 to-transparent",
    border: "border-violet-200/60",
    glow: "shadow-[0_24px_60px_-26px_rgba(139,92,246,0.42)]",
    chip: "bg-violet-100 text-violet-700",
  },
];

function ReviewDeck({ featuredReview }) {
  const items = useMemo(() => featuredReview?.items ?? [], [featuredReview]);
  const [activeIndex, setActiveIndex] = useState(0);

  const orderedItems = useMemo(() => {
    if (!items.length) return [];
    return items.map((item, index) => {
      const distance = (index - activeIndex + items.length) % items.length;
      return {
        ...item,
        originalIndex: index,
        distance,
      };
    });
  }, [items, activeIndex]);

  if (!items.length) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={VIEWPORT}
          transition={{ duration: 0.65, ease: EXPO }}
          className="max-w-3xl"
        >
          <SectionHeading
            overline={featuredReview.overline}
            title={featuredReview.title}
            sub={featuredReview.sub}
          />
        </motion.div>

        <div className="mt-12 grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EXPO, delay: 0.08 }}
            className="relative min-h-[440px] sm:min-h-[500px]"
          >
            {orderedItems.map((item) => {
              const palette =
                reviewPalette[item.originalIndex % reviewPalette.length];
              const isActive = item.originalIndex === activeIndex;

              const layerY =
                item.distance === 0
                  ? 0
                  : item.distance === 1
                  ? 32
                  : item.distance === 2
                  ? 64
                  : 92;

              const layerX =
                item.distance === 0
                  ? 0
                  : item.distance === 1
                  ? 18
                  : item.distance === 2
                  ? 34
                  : 44;

              const layerScale =
                item.distance === 0
                  ? 1
                  : item.distance === 1
                  ? 0.965
                  : item.distance === 2
                  ? 0.93
                  : 0.905;

              const layerOpacity =
                item.distance === 0
                  ? 1
                  : item.distance === 1
                  ? 0.82
                  : item.distance === 2
                  ? 0.68
                  : 0.52;

              return (
                <motion.button
                  key={item.originalIndex}
                  type="button"
                  onClick={() => setActiveIndex(item.originalIndex)}
                  initial={false}
                  animate={{
                    x: layerX,
                    y: layerY,
                    scale: layerScale,
                    opacity: layerOpacity,
                    zIndex: 100 - item.distance,
                  }}
                  transition={{ duration: 0.55, ease: EXPO }}
                  whileHover={
                    !isActive
                      ? {
                          x: layerX - 6,
                          y: layerY - 6,
                          opacity: Math.min(layerOpacity + 0.12, 1),
                        }
                      : {}
                  }
                  className={`absolute inset-0 text-left rounded-[2rem] overflow-hidden border ${palette.border} ${palette.glow} ${
                    isActive
                      ? "cursor-default"
                      : "cursor-pointer hover:border-slate-300"
                  } bg-white/90 backdrop-blur-xl`}
                  aria-pressed={isActive}
                  aria-label={`Open review ${item.originalIndex + 1}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${palette.ring} pointer-events-none`}
                  />
                  <div className="relative h-full p-6 sm:p-8 lg:p-10 flex flex-col">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-[0.16em] uppercase ${palette.chip}`}
                      >
                        Review {item.originalIndex + 1}
                      </span>
                      <Quote className="w-5 h-5 text-slate-300" />
                    </div>

                    <p
                      className={`mt-6 text-slate-800 leading-relaxed transition-all duration-500 ${
                        isActive
                          ? "text-lg sm:text-[1.35rem]"
                          : "text-sm sm:text-base line-clamp-4"
                      }`}
                    >
                      “{item.quote}”
                    </p>

                    <div className="mt-auto pt-8">
                      <div className="h-px w-full bg-gradient-to-r from-slate-200 via-slate-300/70 to-transparent" />
                      <div className="mt-4 flex items-end justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {item.author}
                          </p>
                          <p className="text-sm text-slate-500">{item.source}</p>
                        </div>

                        {!isActive && (
                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Tap to open
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 26, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={VIEWPORT}
            transition={{ duration: 0.65, ease: EXPO, delay: 0.12 }}
            className="rounded-[2rem] border border-slate-200 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.25)]"
          >
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-slate-400">
              Browse parent reflections
            </p>

            <div className="mt-5 space-y-3">
              {items.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                      isActive
                        ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                        : "border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-white hover:border-slate-300"
                    }`}
                    aria-pressed={isActive}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">
                          Review {index + 1}
                        </p>
                        <p
                          className={`mt-1 text-sm ${
                            isActive ? "text-white/80" : "text-slate-500"
                          }`}
                        >
                          {item.author}
                        </p>
                      </div>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
                          isActive ? "text-white/65" : "text-slate-400"
                        }`}
                      >
                        {item.source}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: EXPO }}
                className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-5"
              >
                <p className="text-sm font-semibold text-slate-900">
                  Now reading
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {items[activeIndex]?.quote}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { home } = useData();

  return (
    <>
      <Hero />

      {home?.featuredReview && <ReviewDeck featuredReview={home.featuredReview} />}
    </>
  );
}