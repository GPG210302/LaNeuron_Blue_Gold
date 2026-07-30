import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Quote, Star } from "lucide-react";
import { useMemo } from "react";
import { Hero } from "../components/sections/Hero";
import { useData } from "../i18n/useData";

const EXPO = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-60px" };

function SectionIntro({ overline, title, sub, align = "left" }) {
  return (
    <div className={align === "center" ? "max-w-3xl mx-auto text-center" : "max-w-3xl"}>
      {overline && (
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">
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
              : "text-slate-300"
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

  if (!items.length) return null;

  const rail = [...items, ...items];

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
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
          />
        </motion.div>
      </div>

      <div className="relative mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white via-white/70 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white via-white/70 to-transparent z-20" />

        <motion.div
          className="flex gap-6 w-max px-6 lg:px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 32,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {rail.map((item, index) => (
            <motion.article
              key={`${item.author}-${index}`}
              whileHover={{
                y: -10,
                scale: 1.03,
                width: 560,
              }}
              transition={{ duration: 0.35, ease: EXPO }}
              className="group relative w-[320px] sm:w-[360px] md:w-[400px] lg:w-[430px] shrink-0 rounded-[2rem] border border-white/60 bg-white/85 backdrop-blur-xl shadow-[0_24px_70px_-32px_rgba(15,23,42,0.25)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-200/45 via-sky-100/35 to-emerald-100/30 opacity-80" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/75 to-transparent" />

              <div className="relative h-full p-6 sm:p-7 lg:p-8 flex flex-col min-h-[280px]">
                <div className="flex items-start justify-between gap-4">
                  <Stars value={item.rating || 5} />
                  <Quote className="h-5 w-5 text-slate-300" />
                </div>

                <p className="mt-6 text-slate-800 text-base sm:text-lg leading-relaxed line-clamp-5 group-hover:line-clamp-none transition-all duration-300">
                  “{item.quote}”
                </p>

                <div className="mt-auto pt-8">
                  <div className="h-px w-full bg-gradient-to-r from-slate-200 via-slate-300/70 to-transparent" />
                  <div className="mt-4">
                    <p className="font-semibold text-slate-900">{item.author}</p>
                    <p className="text-sm text-slate-500">{item.source}</p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function WhyParentsSection({ data }) {
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

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {data.items.map((item, i) => (
            <motion.div
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.55, ease: EXPO, delay: i * 0.06 }}
              className="rounded-[2rem] border border-slate-200 bg-slate-50/80 p-7 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.18)]"
            >
              <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
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