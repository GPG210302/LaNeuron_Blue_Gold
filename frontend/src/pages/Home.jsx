import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Hero } from "../components/sections/Hero";
import { useData } from "../i18n/useData";

const EXPO = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-60px" };
const SWIPE_CONFIDENCE = 80;

function SectionIntro({ overline, title, sub, align = "left", theme = "default" }) {
  const isCenter = align === "center";
  const isGoldNavy = theme === "gold-navy";

  return (
    <div className={isCenter ? "max-w-3xl mx-auto text-center" : "max-w-3xl"}>
      {overline && (
        <p
          className={
            isGoldNavy
              ? "text-[11px] font-bold uppercase tracking-[0.28em] text-amber-600"
              : "text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500"
          }
        >
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

function wrapIndex(index, length) {
  return (index + length) % length;
}

function ReviewDeck({ featuredReview }) {
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
    if (!items.length || isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => wrapIndex(prev + 1, items.length));
    }, isMobile ? 7000 : 5000);

    return () => clearInterval(timer);
  }, [items.length, isPaused, isMobile]);

  if (!items.length) return null;

  const prevIndex = wrapIndex(activeIndex - 1, items.length);
  const nextIndex = wrapIndex(activeIndex + 1, items.length);
  const farPrevIndex = wrapIndex(activeIndex - 2, items.length);
  const farNextIndex = wrapIndex(activeIndex + 2, items.length);

  const goPrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => wrapIndex(prev - 1, items.length));
  };

  const goNext = () => {
    setDirection(1);
    setActiveIndex((prev) => wrapIndex(prev + 1, items.length));
  };

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
      <div className="w-full px-4 sm:px-6 xl:px-10 2xl:px-14">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EXPO }}
        >
          <SectionIntro
            overline={featuredReview.overline}
            title={featuredReview.title}
            sub={
              isMobile
                ? "Swipe to read parent reflections."
                : "Real reflections in a panoramic glass amphitheater."
            }
            align="center"
            theme="gold-navy"
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
          <div
            className="mt-16"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative mx-auto h-[560px] w-full max-w-[1680px] overflow-hidden [perspective:2200px]">
              <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.88)_0%,rgba(248,250,252,0.96)_46%,rgba(241,245,249,1)_100%)]" />
              <div className="absolute left-[4%] right-[4%] bottom-7 h-20 rounded-full bg-slate-900/6 blur-3xl" />

              <div className="relative h-full w-full [transform-style:preserve-3d]">
                <FarEdgeCard item={items[farPrevIndex]} side="far-left" />
                <FarEdgeCard item={items[farNextIndex]} side="far-right" />

                <PanoramaSideCard
                  item={items[prevIndex]}
                  side="left"
                  onClick={goPrev}
                />

                <div className="absolute left-1/2 top-1/2 z-20 w-[min(54vw,860px)] -translate-x-1/2 -translate-y-1/2">
                  <AnimatePresence mode="wait" initial={false} custom={direction}>
                    <PanoramaCenterCard
                      key={activeIndex}
                      item={items[activeIndex]}
                      direction={direction}
                    />
                  </AnimatePresence>
                </div>

                <PanoramaSideCard
                  item={items[nextIndex]}
                  side="right"
                  onClick={goNext}
                />
              </div>
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
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setDirection(i > activeIndex ? 1 : -1);
                      setActiveIndex(i);
                    }}
                    className={`h-2.5 rounded-full transition-all ${
                      i === activeIndex ? "w-7 bg-slate-900" : "w-2.5 bg-slate-300"
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
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
        )}
      </div>
    </section>
  );
}

function GlassCardBase({ children, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/30 bg-[rgba(255,255,255,0.16)] shadow-[0_30px_80px_-34px_rgba(15,23,42,0.22)] backdrop-blur-xl ${className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.08)_38%,rgba(15,23,42,0.04)_100%)] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}

function RibbedGlassOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-90"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 2px, rgba(255,255,255,0.02) 9px, rgba(15,23,42,0.06) 18px)",
        backdropFilter: "blur(6px)",
      }}
    />
  );
}

function ClearGlassOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_100%)]"
      style={{ backdropFilter: "blur(14px)" }}
    />
  );
}

function PanoramaCenterCard({ item, direction }) {
  return (
    <motion.div
      custom={direction}
      initial={{ opacity: 0, x: direction > 0 ? 90 : -90, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: direction > 0 ? -90 : 90, scale: 0.95 }}
      transition={{ duration: 0.55, ease: EXPO }}
      className="relative z-20"
    >
      <GlassCardBase className="min-h-[410px] border-[rgba(244,183,112,0.34)] bg-[rgba(255,248,240,0.18)]">
        <ClearGlassOverlay />

        <div className="relative z-10 flex min-h-[410px] flex-col p-9 xl:p-10">
          <div className="flex items-start justify-between gap-4">
            <Stars value={item.rating || 5} />
            <Quote className="h-6 w-6 text-slate-300 shrink-0" />
          </div>

          <p className="mt-7 text-[clamp(2rem,2.15vw,2.4rem)] leading-[1.36] tracking-[-0.03em] text-slate-900">
            “{item.quote}”
          </p>

          <div className="mt-auto pt-10">
            <div className="h-px w-full bg-gradient-to-r from-slate-200/80 via-slate-300/80 to-transparent" />
            <div className="mt-5">
              <p className="font-semibold text-[17px] text-slate-900">{item.author}</p>
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
      </GlassCardBase>
    </motion.div>
  );
}

function PanoramaSideCard({ item, side, onClick }) {
  const isLeft = side === "left";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{
        scale: 1.03,
        opacity: 0.9,
      }}
      transition={{ duration: 0.4, ease: EXPO }}
      className={`absolute top-1/2 z-10 hidden h-[340px] w-[min(26vw,430px)] -translate-y-1/2 xl:block ${
        isLeft ? "left-[11%]" : "right-[11%]"
      }`}
      style={{
        transformStyle: "preserve-3d",
        transform: isLeft
          ? "translateY(-50%) rotateY(38deg) scale(0.88)"
          : "translateY(-50%) rotateY(-38deg) scale(0.88)",
      }}
      aria-label={isLeft ? "Show previous review" : "Show next review"}
    >
      <GlassCardBase className="h-full w-full border-white/20 bg-[rgba(255,248,240,0.10)]">
        <RibbedGlassOverlay />

        <div className="relative z-10 flex h-full flex-col justify-end p-7 text-left">
          <span className="mb-4 inline-flex w-fit rounded-full bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
            Parent voice
          </span>

          <div className="flex items-start justify-between gap-3">
            <Stars value={item.rating || 5} />
            <Quote className="h-5 w-5 text-slate-300 shrink-0" />
          </div>

          <p className="mt-5 line-clamp-5 text-[clamp(1.25rem,1.5vw,1.65rem)] leading-[1.34] tracking-[-0.02em] text-slate-700">
            “{item.quote}”
          </p>

          <div className="mt-7 h-px w-full bg-gradient-to-r from-slate-200/70 via-slate-300/70 to-transparent" />
          <div className="mt-4">
            <p className="font-semibold text-slate-800">{item.author}</p>
            <p className="text-sm text-slate-500">{item.source}</p>
          </div>
        </div>
      </GlassCardBase>
    </motion.button>
  );
}

function FarEdgeCard({ item, side }) {
  const isLeft = side === "far-left";

  return (
    <div
      className={`absolute top-1/2 z-0 hidden h-[290px] w-[min(19vw,320px)] -translate-y-1/2 2xl:block ${
        isLeft ? "-left-[1.5%]" : "-right-[1.5%]"
      }`}
      style={{
        transformStyle: "preserve-3d",
        transform: isLeft
          ? "translateY(-50%) rotateY(58deg) scale(0.72)"
          : "translateY(-50%) rotateY(-58deg) scale(0.72)",
        opacity: 0.22,
      }}
      aria-hidden="true"
    >
      <GlassCardBase className="h-full w-full border-white/15 bg-[rgba(255,248,240,0.08)]">
        <RibbedGlassOverlay />
        <div className="relative z-10 flex h-full flex-col justify-end p-6 text-left">
          <span className="mb-4 inline-flex w-fit rounded-full bg-white/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            Parent voice
          </span>
          <p className="line-clamp-3 text-[1.05rem] leading-[1.35] text-slate-600">
            “{item.quote}”
          </p>
          <div className="mt-5">
            <p className="font-semibold text-slate-700">{item.author}</p>
          </div>
        </div>
      </GlassCardBase>
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
      <GlassCardBase className="min-h-[360px] border-[rgba(244,183,112,0.28)] bg-[rgba(255,248,240,0.16)]">
        <ClearGlassOverlay />

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
      </GlassCardBase>
    </motion.div>
  );
}

function GlassCardBase({ children, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/30 bg-[rgba(255,255,255,0.16)] shadow-[0_30px_80px_-34px_rgba(15,23,42,0.22)] backdrop-blur-xl ${className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.08)_38%,rgba(15,23,42,0.04)_100%)] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}

function RibbedGlassOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-90"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 2px, rgba(255,255,255,0.02) 8px, rgba(15,23,42,0.06) 16px)",
        backdropFilter: "blur(6px)",
      }}
    />
  );
}

function ClearGlassOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_100%)]"
      style={{ backdropFilter: "blur(14px)" }}
    />
  );
}

function PanoramaCenterCard({ item, direction }) {
  return (
    <motion.div
      custom={direction}
      initial={{ opacity: 0, x: direction > 0 ? 70 : -70, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: direction > 0 ? -70 : 70, scale: 0.96 }}
      transition={{ duration: 0.55, ease: EXPO }}
      className="relative z-20"
    >
      <GlassCardBase className="min-h-[390px] border-[rgba(244,183,112,0.34)] bg-[rgba(255,248,240,0.18)]">
        <ClearGlassOverlay />

        <div className="relative z-10 flex min-h-[390px] flex-col p-9 lg:p-10">
          <div className="flex items-start justify-between gap-4">
            <Stars value={item.rating || 5} />
            <Quote className="h-6 w-6 text-slate-300 shrink-0" />
          </div>

          <p className="mt-7 text-[31px] leading-[1.38] tracking-[-0.02em] text-slate-900">
            “{item.quote}”
          </p>

          <div className="mt-auto pt-10">
            <div className="h-px w-full bg-gradient-to-r from-slate-200/80 via-slate-300/80 to-transparent" />
            <div className="mt-5">
              <p className="font-semibold text-[17px] text-slate-900">{item.author}</p>
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
      </GlassCardBase>
    </motion.div>
  );
}

function PanoramaSideCard({ item, side, onClick }) {
  const isLeft = side === "left";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{
        rotateY: isLeft ? 18 : -18,
        translateZ: 4,
        scale: 1.02,
        opacity: 0.88,
      }}
      transition={{ duration: 0.45, ease: EXPO }}
      className={`absolute top-1/2 z-10 hidden h-[330px] w-[360px] -translate-y-1/2 xl:block ${
        isLeft ? "left-8" : "right-8"
      }`}
      style={{
        transformStyle: "preserve-3d",
        transform: isLeft
          ? "translateY(-50%) rotateY(28deg) translateZ(-40px)"
          : "translateY(-50%) rotateY(-28deg) translateZ(-40px)",
      }}
      aria-label={isLeft ? "Show previous review" : "Show next review"}
    >
      <GlassCardBase className="h-full w-full border-white/20 bg-[rgba(255,248,240,0.10)]">
        <RibbedGlassOverlay />

        <div className="relative z-10 flex h-full flex-col justify-end p-7 text-left">
          <span className="mb-4 inline-flex w-fit rounded-full bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
            Parent voice
          </span>

          <div className="flex items-start justify-between gap-3">
            <Stars value={item.rating || 5} />
            <Quote className="h-5 w-5 text-slate-300 shrink-0" />
          </div>

          <p className="mt-5 line-clamp-5 text-[23px] leading-[1.34] tracking-[-0.02em] text-slate-700">
            “{item.quote}”
          </p>

          <div className="mt-7 h-px w-full bg-gradient-to-r from-slate-200/70 via-slate-300/70 to-transparent" />
          <div className="mt-4">
            <p className="font-semibold text-slate-800">{item.author}</p>
            <p className="text-sm text-slate-500">{item.source}</p>
          </div>
        </div>
      </GlassCardBase>
    </motion.button>
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
      <GlassCardBase className="min-h-[360px] border-[rgba(244,183,112,0.28)] bg-[rgba(255,248,240,0.16)]">
        <ClearGlassOverlay />

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
      </GlassCardBase>
    </motion.div>
  );
}

function WhyParentsSection({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!data?.items?.length) return null;

  const palettes = [
    {
      shell: "from-amber-200 via-orange-100 to-rose-100",
      front: "bg-gradient-to-br from-amber-50 to-orange-50",
      back: "bg-gradient-to-br from-amber-500 to-orange-500",
      accent: "bg-amber-500",
    },
    {
      shell: "from-sky-200 via-cyan-100 to-blue-100",
      front: "bg-gradient-to-br from-sky-50 to-cyan-50",
      back: "bg-gradient-to-br from-sky-500 to-cyan-500",
      accent: "bg-sky-500",
    },
    {
      shell: "from-violet-200 via-fuchsia-100 to-pink-100",
      front: "bg-gradient-to-br from-fuchsia-50 to-violet-50",
      back: "bg-gradient-to-br from-fuchsia-500 to-violet-500",
      accent: "bg-fuchsia-500",
    },
    {
      shell: "from-emerald-200 via-lime-100 to-green-100",
      front: "bg-gradient-to-br from-emerald-50 to-lime-50",
      back: "bg-gradient-to-br from-emerald-500 to-green-500",
      accent: "bg-emerald-500",
    },
    {
      shell: "from-rose-200 via-pink-100 to-orange-100",
      front: "bg-gradient-to-br from-rose-50 to-pink-50",
      back: "bg-gradient-to-br from-rose-500 to-pink-500",
      accent: "bg-rose-500",
    },
    {
      shell: "from-indigo-200 via-blue-100 to-slate-100",
      front: "bg-gradient-to-br from-indigo-50 to-blue-50",
      back: "bg-gradient-to-br from-indigo-500 to-blue-500",
      accent: "bg-indigo-500",
    },
  ];

  return (
    <section className="relative py-20 lg:py-28 bg-[linear-gradient(180deg,#fffdf7_0%,#ffffff_40%,#f8fafc_100%)] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.14),transparent_70%)]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EXPO }}
        >
          <SectionIntro
            overline={data.overline}
            title={data.title}
            sub={data.sub}
            align="center"
            theme="gold-navy"
          />
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 [perspective:1400px]">
          {data.items.map((item, i) => {
            const palette = palettes[i % palettes.length];
            const isActive = activeIndex === i;

            return (
              <motion.button
                key={`${item.title}-${i}`}
                type="button"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.55, ease: EXPO, delay: i * 0.06 }}
                onClick={() => setActiveIndex(isActive ? null : i)}
                className="group text-left h-[320px] rounded-[2rem] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
              >
                <div
                  className={`relative h-full w-full rounded-[2rem] transition-transform duration-700 [transform-style:preserve-3d] ${
                    isActive ? "[transform:rotateY(180deg)]" : ""
                  } group-hover:[transform:rotateY(180deg)]`}
                >
                  <div
                    className={`absolute inset-0 rounded-[2rem] border-[1.5px] border-slate-700 ${palette.front} shadow-[6px_8px_0_0_rgba(30,41,59,0.98)] overflow-hidden [backface-visibility:hidden]`}
                  >
                    <div className={`absolute inset-x-0 top-0 h-2 ${palette.accent}`} />
                    <div className={`absolute inset-0 bg-gradient-to-br ${palette.shell} opacity-40`} />
                    <div className="relative h-full p-7 flex flex-col">
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                          Why parents choose us
                        </span>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-2xl font-bold leading-tight text-slate-900">
                          {item.title}
                        </h3>
                      </div>

                      <div className="mt-auto flex items-end justify-between">
                        <p className="max-w-[16rem] text-sm leading-relaxed text-slate-500">
                          Hover to flip and see how.
                        </p>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-sm">
                          <ArrowRight className="h-5 w-5 text-slate-700" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`absolute inset-0 rounded-[2rem] border-[1.5px] border-slate-700 ${palette.back} shadow-[6px_8px_0_0_rgba(30,41,59,0.98)] overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden]`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.32),transparent_35%)]" />
                    <div className="relative h-full p-7 flex flex-col text-white">
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center rounded-full bg-white/18 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90">
                          La Neuron
                        </span>
                        <span className="text-xs font-semibold text-white/80">
                          Parent benefit
                        </span>
                      </div>

                      <h3 className="mt-6 text-2xl font-bold leading-tight">
                        {item.title}
                      </h3>

                      <p className="mt-5 text-[15px] leading-relaxed text-white/92">
                        {item.desc}
                      </p>

                      <div className="mt-auto" />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EnrollingNowSection({ data }) {
  if (!data?.items?.length) return null;

  return (
    <section className="py-20 lg:py-28 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EXPO }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <SectionIntro overline={data.overline} title={data.title} sub={data.sub} />
          <Link
            to="/programmes"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-5 py-3 text-sm font-semibold shadow-lg hover:bg-slate-800 transition-colors"
          >
            {data.cta || "View programme details"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {data.items.map((item, i) => (
            <motion.article
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.55, ease: EXPO, delay: i * 0.05 }}
              className="rounded-[2rem] bg-white border border-slate-200 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.16)]"
            >
              <p className="inline-flex rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]">
                {item.status}
              </p>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestSection({ data }) {
  if (!data?.items?.length) return null;

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EXPO }}
        >
          <SectionIntro overline={data.overline} title={data.title} sub={data.sub} />
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {data.items.map((item, i) => (
            <motion.article
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.55, ease: EXPO, delay: i * 0.05 }}
              className="rounded-[2rem] border border-slate-200 bg-slate-50/80 p-7 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.14)]"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {item.type}
              </p>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.article>
          ))}
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
      <WhyParentsSection data={home?.whyParents} />
      <EnrollingNowSection data={home?.enrollingNow} />
      <ReviewDeck featuredReview={home?.featuredReview} />
      <LatestSection data={home?.latest} />
    </>
  );
}