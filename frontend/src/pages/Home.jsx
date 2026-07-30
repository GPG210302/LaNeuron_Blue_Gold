import { Link } from "react-router-dom";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Quote, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Hero } from "../components/sections/Hero";
import { useData } from "../i18n/useData";

const EXPO = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-60px" };

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
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(value);
        return (
          <Star
            key={i}
            className={`h-4 w-4 ${
              filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-slate-300"
            }`}
          />
        );
      })}
      <span className="ml-2 text-sm font-semibold text-slate-500">
        {Number(value).toFixed(1)}/5
      </span>
    </div>
  );
}

function ReviewDeck({ featuredReview }) {
  const items = useMemo(() => featuredReview?.items ?? [], [featuredReview]);
  const [paused, setPaused] = useState(false);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(1440);

  const CARD_WIDTH = 410;
  const CARD_GAP = 28;
  const STEP = CARD_WIDTH + CARD_GAP;
  const TRACK_REPEAT = 3;

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const repeatedItems = useMemo(() => {
    if (!items.length) return [];
    return Array.from({ length: TRACK_REPEAT }, (_, setIndex) =>
      items.map((item, itemIndex) => ({
        ...item,
        _key: `${setIndex}-${itemIndex}-${item.author}`,
        _index: itemIndex,
      }))
    ).flat();
  }, [items]);

  const loopWidth = items.length * STEP;
  const x = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    if (!items.length || paused) return;

    const speed = 42;
    const movement = (speed * delta) / 1000;
    let next = x.get() - movement;

    if (Math.abs(next) >= loopWidth) {
      next += loopWidth;
    }

    x.set(next);
  });

  if (!items.length) return null;

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={VIEWPORT}
          transition={{ duration: 0.65, ease: EXPO }}
        >
          <SectionIntro
            overline={featuredReview.overline}
            title={featuredReview.title}
            sub={featuredReview.sub}
            align="center"
            theme="gold-navy"
          />
        </motion.div>
      </div>

      <div className="relative mt-14 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-20" />

        <div
          className="relative mx-auto h-[380px] max-w-[1600px] [perspective:2200px]"
          onMouseLeave={() => {
            setPaused(false);
            setHoveredKey(null);
          }}
        >
          <motion.div
            className="absolute left-0 top-0 flex items-center gap-7"
            style={{
              x,
              transformStyle: "preserve-3d",
              paddingLeft: "180px",
              paddingRight: "180px",
            }}
          >
            {repeatedItems.map((item, index) => (
              <CoverflowReviewCard
                key={item._key}
                item={item}
                index={index}
                step={STEP}
                x={x}
                viewportWidth={viewportWidth}
                isHovered={hoveredKey === item._key}
                onHoverStart={() => {
                  setPaused(true);
                  setHoveredKey(item._key);
                }}
                onHoverEnd={() => {
                  setPaused(false);
                  setHoveredKey(null);
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CoverflowReviewCard({
  item,
  index,
  step,
  x,
  viewportWidth,
  isHovered,
  onHoverStart,
  onHoverEnd,
}) {
  const baseCenterOffset = 260;
  const cardCenter = useTransform(x, (latest) => baseCenterOffset + index * step + latest);
  const distanceFromCenter = useTransform(cardCenter, (v) => v - viewportWidth / 2);

  const rotateYRaw = useTransform(
    distanceFromCenter,
    [-1000, -700, -350, 0, 350, 700, 1000],
    [62, 44, 20, 0, -20, -44, -62]
  );

  const scaleRaw = useTransform(
    distanceFromCenter,
    [-1000, -700, -350, 0, 350, 700, 1000],
    [0.62, 0.74, 0.88, 1.02, 0.88, 0.74, 0.62]
  );

  const yRaw = useTransform(
    distanceFromCenter,
    [-1000, -700, -350, 0, 350, 700, 1000],
    [26, 18, 8, 0, 8, 18, 26]
  );

  const zRaw = useTransform(
    distanceFromCenter,
    [-1000, -700, -350, 0, 350, 700, 1000],
    [-340, -220, -80, 120, -80, -220, -340]
  );

  const opacityRaw = useTransform(
    distanceFromCenter,
    [-1100, -750, -350, 0, 350, 750, 1100],
    [0.14, 0.34, 0.72, 1, 0.72, 0.34, 0.14]
  );

  const blurRaw = useTransform(
    distanceFromCenter,
    [-1000, -700, -350, 0, 350, 700, 1000],
    [4.2, 2.6, 1.1, 0, 1.1, 2.6, 4.2]
  );

  const rotateY = useSpring(rotateYRaw, { stiffness: 120, damping: 22 });
  const scale = useSpring(scaleRaw, { stiffness: 120, damping: 22 });
  const y = useSpring(yRaw, { stiffness: 120, damping: 22 });
  const z = useSpring(zRaw, { stiffness: 120, damping: 22 });
  const opacity = useSpring(opacityRaw, { stiffness: 120, damping: 26 });
  const blur = useSpring(blurRaw, { stiffness: 120, damping: 26 });

  return (
    <motion.article
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      animate={
        isHovered
          ? {
              scale: 1.1,
              rotateY: 0,
              y: -12,
              z: 180,
              opacity: 1,
            }
          : {}
      }
      transition={{ duration: 0.34, ease: EXPO }}
      style={{
        width: CARD_WIDTH,
        rotateY,
        scale,
        y,
        z,
        opacity,
        filter: useTransform(blur, (b) => `blur(${b}px)`),
        transformStyle: "preserve-3d",
      }}
      className="group relative shrink-0 rounded-[2.35rem] border border-white/75 bg-white/92 backdrop-blur-xl shadow-[0_30px_80px_-36px_rgba(15,23,42,0.22)] overflow-hidden will-change-transform"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-100/35 via-sky-100/28 to-emerald-100/20 opacity-80" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/10 via-white/80 to-white/10" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/85 to-transparent" />

      <div className="relative h-full p-6 sm:p-7 lg:p-8 flex flex-col min-h-[292px]">
        <div className="flex items-start justify-between gap-4">
          <Stars value={item.rating || 5} />
          <Quote className="h-5 w-5 text-slate-300" />
        </div>

        <p
          className={`mt-6 text-slate-800 text-base sm:text-lg leading-relaxed transition-all duration-300 ${
            isHovered ? "line-clamp-none" : "line-clamp-5"
          }`}
        >
          “{item.quote}”
        </p>

        <div className="mt-auto pt-8">
          <div className="h-px w-full bg-gradient-to-r from-slate-200 via-slate-300/70 to-transparent" />
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
    </motion.article>
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