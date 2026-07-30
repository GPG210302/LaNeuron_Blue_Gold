import { Link } from "react-router-dom";
import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
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

function wrapDistance(value, size) {
  let wrapped = ((value % size) + size) % size;
  if (wrapped > size / 2) wrapped -= size;
  return wrapped;
}

function ReviewDeck({ featuredReview }) {
  const items = useMemo(() => featuredReview?.items ?? [], [featuredReview]);
  const [viewportWidth, setViewportWidth] = useState(1400);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const progress = useMotionValue(0);
  const targetProgress = useRef(0);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      setIsMobile(width < 768);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useAnimationFrame((_, delta) => {
    if (!items.length) return;

    const current = progress.get();
    const target = targetProgress.current;
    const diff = target - current;
    const eased = current + diff * Math.min(1, delta / 220);

    const autoSpeed = isMobile ? 0.028 : 0.0385;
    const next =
      hoveredIndex === null ? eased + (delta / 1000) * autoSpeed : eased;

    progress.set(next);

    if (hoveredIndex === null) {
      targetProgress.current = next;
    }
  });

  if (!items.length) return null;

  if (isMobile) {
    return (
      <section className="relative py-16 overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EXPO }}
          >
            <SectionIntro
              overline={featuredReview.overline}
              title={featuredReview.title}
              sub={featuredReview.sub}
              align="center"
              theme="gold-navy"
            />
          </motion.div>

          <div className="mt-10 relative h-[350px] overflow-hidden">
            {items.map((item, index) => (
              <MobileReviewCard
                key={`${item.author}-${index}`}
                item={item}
                index={index}
                total={items.length}
                progress={progress}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const radius = Math.max(430, Math.min(680, viewportWidth * 0.35));
  const angleStep = 20;
  const visibleArc = 74;
  const cardWidth = Math.min(560, Math.max(430, viewportWidth * 0.27));

  const repeatedItems = [-1, 0, 1].flatMap((loop) =>
    items.map((item, index) => ({
      ...item,
      _virtualIndex: index + loop * items.length,
      _realIndex: index,
      _key: `${loop}-${index}-${item.author}`,
    }))
  );

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
      <div className="max-w-[1680px] mx-auto px-6 lg:px-8">
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

      <div
        className="relative mt-14 overflow-hidden"
        onMouseLeave={() => {
          setHoveredIndex(null);
        }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-white via-white/95 to-transparent z-30" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-white via-white/95 to-transparent z-30" />

        <div className="relative mx-auto h-[450px] max-w-[1900px] [perspective:2000px]">
          {repeatedItems.map((item) => (
            <CoverflowCard
              key={item._key}
              item={item}
              index={item._virtualIndex}
              realIndex={item._realIndex}
              progress={progress}
              radius={radius}
              angleStep={angleStep}
              visibleArc={visibleArc}
              cardWidth={cardWidth}
              hovered={hoveredIndex === item._realIndex}
              onHoverStart={() => {
                setHoveredIndex(item._realIndex);
                const current = progress.get();
                const currentAngle = wrapDistance(
                  item._virtualIndex * angleStep - current * 360,
                  360
                );
                const neededRotation = currentAngle / 360;
                targetProgress.current = current + neededRotation;
              }}
              onHoverEnd={() => {
                setHoveredIndex(null);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CoverflowCard({
  item,
  index,
  realIndex,
  progress,
  radius,
  angleStep,
  visibleArc,
  cardWidth,
  hovered,
  onHoverStart,
  onHoverEnd,
}) {
  const angle = useTransform(progress, (p) => {
    const raw = index * angleStep - p * 360;
    return wrapDistance(raw, 360);
  });

  const x = useTransform(angle, (a) => {
    const r = (a * Math.PI) / 180;
    return -Math.sin(r) * radius;
  });

  const y = useTransform(angle, (a) => Math.abs(a) * 0.18);
  const rotateY = useTransform(
    angle,
    [-visibleArc, -36, 0, 36, visibleArc],
    [-62, -30, 0, 30, 62]
  );
  const scale = useTransform(
    angle,
    [-visibleArc, -34, 0, 34, visibleArc],
    [0.82, 0.93, 1.08, 0.93, 0.82]
  );
  const opacity = useTransform(
    angle,
    [-visibleArc, -50, 0, 50, visibleArc],
    [0, 0.66, 1, 0.66, 0]
  );
  const blur = useTransform(
    angle,
    [-visibleArc, -44, 0, 44, visibleArc],
    [4.5, 1.4, 0, 1.4, 4.5]
  );
  const zIndex = useTransform(angle, (a) => 1000 - Math.abs(a) * 10);

  return (
    <motion.article
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      animate={
        hovered
          ? {
              scale: 1.08,
              rotateY: 0,
              y: -8,
              opacity: 1,
            }
          : {}
      }
      transition={{ duration: 0.42, ease: EXPO }}
      style={{
        width: cardWidth,
        left: "50%",
        top: 18,
        marginLeft: -(cardWidth / 2),
        x,
        y,
        rotateY,
        scale,
        opacity,
        zIndex,
        filter: useTransform(blur, (b) => `blur(${b}px)`),
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        pointerEvents: "auto",
      }}
      className="absolute rounded-[2.35rem] border border-white/75 bg-white/92 backdrop-blur-xl overflow-hidden will-change-transform shadow-[0_30px_80px_-34px_rgba(15,23,42,0.18)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-100/22 via-sky-100/16 to-emerald-100/14 opacity-70" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/10 via-white/80 to-white/10" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/85 to-transparent" />

      <div className="relative h-full p-7 sm:p-8 lg:p-9 flex flex-col min-h-[320px]">
        <div className="flex items-start justify-between gap-4">
          <Stars value={item.rating || 5} />
          <Quote className="h-5 w-5 text-slate-300" />
        </div>

        <p
          className={`mt-7 text-slate-800 text-lg leading-relaxed transition-all duration-300 ${
            hovered ? "line-clamp-none" : "line-clamp-5"
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

function MobileReviewCard({ item, index, total, progress }) {
  const angle = useTransform(progress, (p) => {
    const raw = index * (360 / total) - p * 360;
    return wrapDistance(raw, 360);
  });

  const opacity = useTransform(angle, [-180, -60, 0, 60, 180], [0, 0.15, 1, 0.15, 0]);
  const scale = useTransform(angle, [-180, -60, 0, 60, 180], [0.92, 0.96, 1, 0.96, 0.92]);
  const x = useTransform(angle, [-180, -90, 0, 90, 180], [80, 28, 0, -28, -80]);
  const zIndex = useTransform(angle, (a) => 1000 - Math.abs(a) * 10);

  return (
    <motion.article
      style={{
        opacity,
        scale,
        x,
        zIndex,
      }}
      className="absolute inset-0 mx-auto w-full max-w-[92vw] rounded-[1.8rem] border border-white/75 bg-white/95 backdrop-blur-xl overflow-hidden shadow-[0_24px_60px_-32px_rgba(15,23,42,0.18)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-100/18 via-sky-100/14 to-emerald-100/10 opacity-70" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/10 via-white/80 to-white/10" />
      <div className="relative h-full p-5 flex flex-col min-h-[320px]">
        <div className="flex items-start justify-between gap-3">
          <Stars value={item.rating || 5} />
          <Quote className="h-5 w-5 text-slate-300" />
        </div>

        <p className="mt-6 text-slate-800 text-base leading-7">
          “{item.quote}”
        </p>

        <div className="mt-auto pt-7">
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