import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Quote, Star } from "lucide-react";
import { useMemo, useState } from "react";
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

function ReviewDeck({ featuredReview }) {
  const items = useMemo(() => featuredReview?.items ?? [], [featuredReview]);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!items.length) return null;

  const rail = [...items, ...items];

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

      <div
        className="relative mt-14 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoveredIndex(null);
        }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white via-white/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-20" />

        <motion.div
          className="flex gap-7 w-max pl-6 lg:pl-8 pr-6 lg:pr-8"
          animate={isPaused ? { x: undefined } : { x: ["0px", "-50%"] }}
          transition={
            isPaused
              ? { duration: 0 }
              : {
                  duration: 34,
                  ease: "linear",
                  repeat: Infinity,
                }
          }
          style={{ willChange: "transform" }}
        >
          {rail.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const positionType = index % 5;

            const shapeClass =
              positionType === 0
                ? "rounded-[2.6rem]"
                : positionType === 1
                ? "rounded-[2.2rem]"
                : positionType === 2
                ? "rounded-[2.9rem]"
                : positionType === 3
                ? "rounded-[2.1rem]"
                : "rounded-[2.5rem]";

            const tiltClass =
              positionType === 0
                ? "-rotate-[2.5deg]"
                : positionType === 1
                ? "rotate-[1.4deg]"
                : positionType === 2
                ? "-rotate-[1deg]"
                : positionType === 3
                ? "rotate-[2.2deg]"
                : "-rotate-[1.6deg]";

            return (
              <motion.article
                key={`${item.author}-${index}`}
                onMouseEnter={() => {
                  setIsPaused(true);
                  setHoveredIndex(index);
                }}
                onMouseLeave={() => {
                  setIsPaused(false);
                  setHoveredIndex(null);
                }}
                animate={{
                  scale: isHovered ? 1.08 : 1,
                  rotate: isHovered ? 0 : undefined,
                  y: isHovered ? -12 : 0,
                  opacity: isHovered ? 1 : 0.96,
                }}
                transition={{ duration: 0.35, ease: EXPO }}
                className={`group relative w-[320px] sm:w-[360px] md:w-[390px] lg:w-[410px] shrink-0 ${shapeClass} ${
                  isHovered ? "rotate-0 z-20" : tiltClass
                } border border-white/70 bg-white/92 backdrop-blur-xl shadow-[0_30px_80px_-36px_rgba(15,23,42,0.24)] overflow-hidden`}
                style={{ willChange: "transform" }}
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
          })}
        </motion.div>
      </div>
    </section>
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